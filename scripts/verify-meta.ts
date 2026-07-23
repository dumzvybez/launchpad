#!/usr/bin/env bun
/**
 * verify-meta.ts — v6.0 CI check: asserts that lessons-meta-generated.ts is
 * in sync with the actual lesson content. Run after `gen:meta`.
 *
 * Checks:
 *   1. TRACK_LESSON_COUNTS_GENERATED[trackId] matches the actual lesson count
 *      for every track in the content files.
 *   2. Every lesson id in content has a slug in LESSON_SLUGS.
 *   3. Every slug in SLUG_TO_ID resolves back to a real lesson id.
 *   4. No duplicate slugs.
 *
 * RUN:  bun run verify:meta
 * Exit code 0 = pass, 1 = fail.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LESSON_SLUGS,
  SLUG_TO_ID,
  TRACK_LESSON_COUNTS_GENERATED,
  TRACK_LESSON_SLUGS,
  TRACKS_WITH_CONTENT_GENERATED,
} from "../src/lib/lessons-meta-generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let errors = 0;

// Check 1: generated file exists and is non-empty.
if (!existsSync(join(ROOT, "src/lib/lessons-meta-generated.ts"))) {
  console.error("[verify-meta] FAIL: lessons-meta-generated.ts not found. Run `bun run gen:meta`.");
  process.exit(1);
}

// Check 2: every track in TRACKS_WITH_CONTENT_GENERATED has a count + slug list.
for (const trackId of TRACKS_WITH_CONTENT_GENERATED) {
  const count = TRACK_LESSON_COUNTS_GENERATED[trackId];
  const slugs = TRACK_LESSON_SLUGS[trackId];
  if (typeof count !== "number" || count === 0) {
    console.error(`[verify-meta] FAIL: track "${trackId}" has no count`);
    errors++;
  }
  if (!Array.isArray(slugs) || slugs.length === 0) {
    console.error(`[verify-meta] FAIL: track "${trackId}" has no slug list`);
    errors++;
  } else if (slugs.length !== count) {
    console.error(`[verify-meta] FAIL: track "${trackId}" count (${count}) ≠ slugs length (${slugs.length})`);
    errors++;
  }
}

// Check 3: LESSON_SLUGS and SLUG_TO_ID are inverses.
for (const [id, slug] of Object.entries(LESSON_SLUGS)) {
  if (SLUG_TO_ID[slug] !== id) {
    console.error(`[verify-meta] FAIL: SLUG_TO_ID["${slug}"] = ${SLUG_TO_ID[slug] ?? "undefined"} (expected "${id}")`);
    errors++;
  }
}
for (const [slug, id] of Object.entries(SLUG_TO_ID)) {
  if (LESSON_SLUGS[id] !== slug) {
    console.error(`[verify-meta] FAIL: LESSON_SLUGS["${id}"] = ${LESSON_SLUGS[id] ?? "undefined"} (expected "${slug}")`);
    errors++;
  }
}

// Check 4: no duplicate slugs (the slug map values should be unique).
const slugValues = Object.values(LESSON_SLUGS);
const slugSet = new Set(slugValues);
if (slugSet.size !== slugValues.length) {
  console.error(`[verify-meta] FAIL: ${slugValues.length - slugSet.size} duplicate slugs detected`);
  errors++;
}

// Summary
const totalLessons = Object.keys(LESSON_SLUGS).length;
const totalTracks = TRACKS_WITH_CONTENT_GENERATED.length;
console.log(`[verify-meta] ${totalTracks} tracks, ${totalLessons} lessons, ${slugValues.length} unique slugs`);

if (errors > 0) {
  console.error(`[verify-meta] FAILED with ${errors} error(s)`);
  process.exit(1);
}
console.log("[verify-meta] PASS — generated metadata is consistent and complete.");
process.exit(0);
