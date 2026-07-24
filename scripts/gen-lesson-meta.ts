#!/usr/bin/env bun
/**
 * gen-lesson-meta.ts — Build-time generator for Launchpad lesson metadata.
 *
 * v6.006: Rewritten to read from Markdown source files (content/{track}/*.md)
 * instead of the deprecated lessons-content.ts / lessons-extended.ts bundles.
 * The Markdown frontmatter already carries slug, id, track, order, and title,
 * so no slug regeneration is needed — the frontmatter slug is authoritative.
 *
 * Scans content/{track}/*.md, extracts {id, track, title, order, slug} from
 * each file's YAML frontmatter, and emits src/lib/lessons-meta-generated.ts
 * with:
 *
 *   - LESSON_SLUGS:        Record<lessonId, slug>     (positional id → stable slug)
 *   - SLUG_TO_ID:          Record<slug, lessonId>     (reverse lookup)
 *   - TRACK_LESSON_COUNTS_GENERATED: Record<trackId, number>
 *   - TRACK_LESSON_SLUGS:  Record<trackId, slug[]>    (ordered slugs per track)
 *   - TRACKS_WITH_CONTENT_GENERATED: string[]
 *
 * RUN:  bun run scripts/gen-lesson-meta.ts
 *       (or: bun run gen:meta  — wired in package.json)
 *
 * This script is IDEMPOTENT — re-running produces the same output as long as
 * the source content hasn't changed. Output is checked into git so the server
 * (which cannot import the 10MB content bundle) has a trusted metadata mirror.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content");
const OUT_FILE = join(ROOT, "src", "lib", "lessons-meta-generated.ts");

// ---- types ----
type RawLesson = { id: string; track: string; title: string; order: number; slug: string };

// ---- frontmatter parser ----
type Frontmatter = { yaml: Record<string, unknown>; body: string };
function parseFrontmatter(src: string): Frontmatter {
  if (!src.startsWith("---")) return { yaml: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end < 0) return { yaml: {}, body: src };
  const yamlStr = src.slice(3, end);
  const body = src.slice(end + 4).replace(/^\n/, "");
  return { yaml: yaml.parse(yamlStr) as Record<string, unknown>, body };
}

// ---- lesson extraction from Markdown frontmatter ----
function extractLessonsFromMarkdown(contentDir: string): RawLesson[] {
  const out: RawLesson[] = [];
  if (!existsSync(contentDir)) {
    console.warn(`[gen-lesson-meta] WARNING: ${contentDir} not found`);
    return out;
  }

  const trackDirs = readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const trackDir of trackDirs) {
    const trackPath = join(contentDir, trackDir);
    const files = readdirSync(trackPath)
      .filter((f) => f.endsWith(".md") && f !== "README.md")
      .sort();

    for (const file of files) {
      const filePath = join(trackPath, file);
      const src = readFileSync(filePath, "utf8");
      const { yaml: fm } = parseFrontmatter(src);

      const id = fm["id"] as string | undefined;
      const track = fm["track"] as string | undefined;
      const title = fm["title"] as string | undefined;
      const order = fm["order"] as number | undefined;
      const slug = fm["slug"] as string | undefined;

      if (!id || !track || !title || order === undefined || !slug) {
        console.warn(`[gen-lesson-meta] SKIP ${filePath}: missing required frontmatter field`);
        continue;
      }

      out.push({ id, track, title, order: Number(order), slug });
    }
  }

  return out;
}

// ---- main ----
const all = extractLessonsFromMarkdown(CONTENT_DIR);
console.log(`[gen-lesson-meta] extracted ${all.length} lessons from content/*.md`);

// Deduplicate by id (a lesson should only appear once).
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

// Build maps using the authoritative slug from frontmatter.
const LESSON_SLUGS: Record<string, string> = {};
const SLUG_TO_ID: Record<string, string> = {};

// Group by track, preserving directory sort order, then sort by order.
const trackOrder: string[] = [];
const trackLessonsMap: Record<string, RawLesson[]> = {};
for (const l of deduped) {
  if (!trackLessonsMap[l.track]) {
    trackLessonsMap[l.track] = [];
    trackOrder.push(l.track);
  }
  trackLessonsMap[l.track].push(l);
}
for (const t of trackOrder) {
  trackLessonsMap[t].sort((a, b) => a.order - b.order);
}

for (const t of trackOrder) {
  for (const l of trackLessonsMap[t]) {
    const slug = l.slug;
    // Global uniqueness guard.
    if (SLUG_TO_ID[slug] !== undefined && SLUG_TO_ID[slug] !== l.id) {
      console.warn(`[gen-lesson-meta] WARN global slug collision "${slug}" between ${l.id} and ${SLUG_TO_ID[slug]}`);
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
    console.error(`[gen-lesson-meta] ERROR no slug for ${l.id}`);
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
// Source: content/{track}/*.md (Markdown frontmatter)
//
// This file is the server-side trusted mirror of lesson metadata. The
// certificate-issuance API (/api/certificates/create) imports from here
// because it CANNOT import the 10MB content bundle (client-only).
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
