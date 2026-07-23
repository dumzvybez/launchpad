#!/usr/bin/env bun
/**
 * gen-lesson-meta.ts — Build-time generator for Launchpad lesson metadata.
 *
 * Scans the lesson content source files (lessons-content.ts + lessons-extended.ts)
 * as TEXT (no full TS parse needed — the files are too large for a lightweight
 * AST pass to be practical), extracts {id, track, title, order} for every
 * lesson, and emits src/lib/lessons-meta-generated.ts with:
 *
 *   - LESSON_SLUGS:        Record<lessonId, slug>     (positional id → stable slug)
 *   - SLUG_TO_ID:          Record<slug, lessonId>     (reverse lookup)
 *   - TRACK_LESSON_COUNTS_GENERATED: Record<trackId, number>
 *   - TRACK_LESSON_SLUGS:  Record<trackId, slug[]>    (ordered slugs per track)
 *   - TRACKS_WITH_CONTENT_GENERATED: string[]
 *
 * Slugs are derived deterministically from the lesson title:
 *   slug = `${trackId}-${slugify(title)}`   e.g. "Variables and Data Types" → "python-variables-and-data-types"
 *
 * Collisions (two lessons in the same track with the same slugified title) are
 * resolved by appending `-2`, `-3`, etc. to the later lesson's slug.
 *
 * Capstone lesson IDs (e.g. "docker-capstone") get a stable slug of
 * `${trackId}-capstone-project` so they remain addressable without encoding
 * their positional order (which is being phased out).
 *
 * RUN:  bun run scripts/gen-lesson-meta.ts
 *       (or: bun run gen:meta  — wired in package.json)
 *
 * This script is IDEMPOTENT — re-running produces the same output as long as
 * the source content hasn't changed. Output is checked into git so the server
 * (which cannot import the 10MB content bundle) has a trusted metadata mirror.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_CONTENT = join(ROOT, "src", "lib", "lessons-content.ts");
const SRC_EXTENDED = join(ROOT, "src", "lib", "lessons-extended.ts");
const OUT_FILE = join(ROOT, "src", "lib", "lessons-meta-generated.ts");

// ---- slugify ----
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "for",
  "with", "by", "from", "into", "via", "as", "is", "are", "be", "your",
]);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/['"`’]/g, "")
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum → hyphen
    .split("-")
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w))
    .join("-")
    .replace(/^-+|-+$/g, "");
}

// ---- lesson header extraction ----
// Both content files declare lesson objects. lessons-content.ts uses quoted
// keys (`"id": "python-01"`), lessons-extended.ts uses unquoted keys
// (`id: "docker-16"`). This regex matches both forms for the id/track/title/
// order fields that appear at the START of each lesson object (the top-level
// fields, not the nested quiz `id: "q1"` fields which lack a `track`/`order`).
type RawLesson = { id: string; track: string; title: string; order: number };

function extractLessons(filePath: string): RawLesson[] {
  if (!existsSync(filePath)) {
    console.warn(`[gen-lesson-meta] WARNING: ${filePath} not found — skipping`);
    return [];
  }
  const src = readFileSync(filePath, "utf8");
  const out: RawLesson[] = [];

  // Match a lesson object's leading fields. We require `track:` to appear
  // (quiz question objects don't have track), and we capture the four fields
  // that define identity. The pattern tolerates quoted or unquoted keys and
  // any field ordering within the object header (fields appear before `blocks:`).
  //
  // Strategy: find each occurrence of a top-level lesson by locating the
  // `id: "track-NN"` pattern (the lesson's own id, which always embeds the
  // track prefix), then scan forward up to ~600 chars for track/title/order.
  const idRegex = /"?id"?\s*:\s*"([a-z][a-z0-9-]*?-[a-z0-9]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = idRegex.exec(src)) !== null) {
    const lessonId = m[1];
    // Skip quiz-question ids (they look like "q1" — no hyphen). The regex
    // above already requires a hyphen, so "q1" won't match. But capstone
    // ids like "docker-capstone" WILL match (good).
    const window = src.slice(m.index, m.index + 800);

    const trackMatch = window.match(/"?track"?\s*:\s*"([a-z][a-z0-9_]*)"/);
    const titleMatch = window.match(/"?title"?\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const orderMatch = window.match(/"?order"?\s*:\s*(\d+)/);

    if (!trackMatch || !titleMatch || !orderMatch) {
      // Likely a nested object (e.g. a quiz question) — skip.
      continue;
    }
    const track = trackMatch[1];
    // Only accept if the lesson id starts with the track prefix (guards
    // against matching a `track:` field that belongs to a different nearby
    // object in the minified-ish source).
    if (!lessonId.startsWith(track + "-") && lessonId !== track) continue;

    out.push({
      id: lessonId,
      track,
      title: titleMatch[1].replace(/\\"/g, '"'),
      order: parseInt(orderMatch[1], 10),
    });
  }
  return out;
}

// ---- main ----
const fromContent = extractLessons(SRC_CONTENT);
const fromExtended = extractLessons(SRC_EXTENDED);
const all = [...fromContent, ...fromExtended];

console.log(`[gen-lesson-meta] extracted ${fromContent.length} from lessons-content.ts`);
console.log(`[gen-lesson-meta] extracted ${fromExtended.length} from lessons-extended.ts`);
console.log(`[gen-lesson-meta] total: ${all.length} lessons`);

// Deduplicate by id (a lesson should only appear once across both files).
const seenIds = new Set<string>();
const deduped: RawLesson[] = [];
for (const l of all) {
  if (seenIds.has(l.id)) {
    console.warn(`[gen-lesson-meta] WARN duplicate lesson id "${l.id}" — keeping first occurrence`);
    continue;
  }
  seenIds.add(l.id);
  deduped.push(l);
}

// Build slug map with collision handling.
const LESSON_SLUGS: Record<string, string> = {};
const SLUG_TO_ID: Record<string, string> = {};
const slugUsageCount: Record<string, number> = {};

// First pass: compute base slug for each lesson.
const trackOrder: string[] = [];
const trackLessonsMap: Record<string, RawLesson[]> = {};
for (const l of deduped) {
  if (!trackLessonsMap[l.track]) {
    trackLessonsMap[l.track] = [];
    trackOrder.push(l.track);
  }
  trackLessonsMap[l.track].push(l);
}
// Sort each track's lessons by order so slug lists are ordered.
for (const t of trackOrder) {
  trackLessonsMap[t].sort((a, b) => a.order - b.order);
}

for (const t of trackOrder) {
  for (const l of trackLessonsMap[t]) {
    let slug: string;
    if (l.id.endsWith("-capstone")) {
      // Stable slug for legacy capstone lessons — does NOT encode order.
      slug = `${t}-capstone-project`;
    } else {
      const base = `${t}-${slugify(l.title)}`;
      slug = base;
      // Collision handling within the track.
      if (slugUsageCount[slug] !== undefined) {
        slugUsageCount[slug]++;
        slug = `${base}-${slugUsageCount[base] + 1}`;
      } else {
        slugUsageCount[base] = 0;
      }
    }
    // Global uniqueness guard (across tracks — shouldn't happen but be safe).
    if (SLUG_TO_ID[slug] !== undefined && SLUG_TO_ID[slug] !== l.id) {
      console.warn(`[gen-lesson-meta] WARN global slug collision "${slug}" between ${l.id} and ${SLUG_TO_ID[slug]} — appending track`);
      slug = `${slug}-${t}`;
    }
    LESSON_SLUGS[l.id] = slug;
    SLUG_TO_ID[slug] = l.id;
  }
}

// Build track metadata.
const TRACK_LESSON_COUNTS_GENERATED: Record<string, number> = {};
const TRACK_LESSON_SLUGS: Record<string, string[]> = {};
const TRACKS_WITH_CONTENT_GENERATED: string[] = [];
for (const t of trackOrder) {
  TRACK_LESSON_COUNTS_GENERATED[t] = trackLessonsMap[t].length;
  TRACK_LESSON_SLUGS[t] = trackLessonsMap[t].map((l) => LESSON_SLUGS[l.id]);
  TRACKS_WITH_CONTENT_GENERATED.push(t);
}

// Sanity checks.
let missingSlug = 0;
for (const l of deduped) {
  if (!LESSON_SLUGS[l.id]) {
    console.error(`[gen-lesson-meta] ERROR no slug generated for ${l.id}`);
    missingSlug++;
  }
}
if (missingSlug > 0) {
  console.error(`[gen-lesson-meta] FAILED: ${missingSlug} lessons missing slugs`);
  process.exit(1);
}

// Emit the generated file.
const banner = `// ============================================================
// lessons-meta-generated.ts — BUILD-GENERATED. DO NOT EDIT BY HAND.
//
// Generated by: scripts/gen-lesson-meta.ts
// Generated at: ${new Date().toISOString()}
// Source: src/lib/lessons-content.ts + src/lib/lessons-extended.ts
//
// This file is the server-side trusted mirror of lesson metadata. The
// certificate-issuance API (/api/certificates/create) imports from here
// because it CANNOT import the 10MB lessons-content bundle (client-only).
//
// Re-generate after any content change:  bun run gen:meta
// A CI check should assert this file is up-to-date.
// ============================================================

// v6.0: Maps a legacy positional lesson id (e.g. "python-05") to its stable
// slug (e.g. "python-variables-and-data-types"). The slug is the permanent
// identity; the positional id may change when lessons are reordered.
export const LESSON_SLUGS: Record<string, string> = ${JSON.stringify(LESSON_SLUGS, null, 2)};

// v6.0: Reverse lookup — slug → legacy positional id. Used to resolve a
// slug back to the in-memory Lesson object (which is still indexed by id).
export const SLUG_TO_ID: Record<string, string> = ${JSON.stringify(SLUG_TO_ID, null, 2)};

// v6.0: Per-track lesson counts, derived from actual content. Replaces the
// hand-maintained TRACK_LESSON_COUNTS (which was hardcoded to 21 for all
// tracks and could drift). The server uses this for certificate validation.
export const TRACK_LESSON_COUNTS_GENERATED: Record<string, number> = ${JSON.stringify(TRACK_LESSON_COUNTS_GENERATED, null, 2)};

// v6.0: Ordered list of slugs per track (sorted by lesson order). The server
// uses this to validate that a client's completedLessonIds covers the full
// track, using stable slugs instead of positional ids.
export const TRACK_LESSON_SLUGS: Record<string, string[]> = ${JSON.stringify(TRACK_LESSON_SLUGS, null, 2)};

// v6.0: List of track ids that have lesson content. Replaces the hand-
// maintained TRACKS_WITH_CONTENT array.
export const TRACKS_WITH_CONTENT_GENERATED: string[] = ${JSON.stringify(TRACKS_WITH_CONTENT_GENERATED)};
`;

writeFileSync(OUT_FILE, banner, "utf8");
console.log(`[gen-lesson-meta] wrote ${OUT_FILE}`);
console.log(`[gen-lesson-meta] ${TRACKS_WITH_CONTENT_GENERATED.length} tracks, ${deduped.length} lessons, ${Object.keys(LESSON_SLUGS).length} slugs`);

// Print a sample for visual verification.
const sample = deduped.slice(0, 3).map((l) => `  ${l.id} → ${LESSON_SLUGS[l.id]}`);
console.log(`[gen-lesson-meta] sample mappings:\n${sample.join("\n")}`);
