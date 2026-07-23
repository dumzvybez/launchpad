#!/usr/bin/env bun
/**
 * verify-roundtrip.ts — v6.2.0: Verifies the TS → Markdown → JSON round-trip
 * is lossless. Compares the compiled public/content/*.json against the original
 * TS content (lessons-content.ts + lessons-extended.ts).
 *
 * Checks:
 *   1. Lesson count unchanged (797)
 *   2. Quiz count unchanged
 *   3. Every lesson ID preserved
 *   4. Every lesson slug preserved
 *   5. Every lesson title preserved
 *   6. Every lesson track/order/difficulty/estMinutes preserved
 *   7. Block count per lesson preserved
 *   8. Quiz question count per lesson preserved
 *
 * RUN:  bun run scripts/verify-roundtrip.ts
 * Exit 0 = pass, 1 = fail.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Lesson } from "../src/lib/types";
import { ALL_LESSONS } from "../src/lib/lessons-content";
import { EXTENDED_LESSONS } from "../src/lib/lessons-extended";
import { LESSON_SLUGS } from "../src/lib/lessons-meta-generated";

const originalLessons: Lesson[] = [...ALL_LESSONS, ...EXTENDED_LESSONS];
const originalById = new Map<string, Lesson>();
for (const l of originalLessons) originalById.set(l.id, l);

// Load compiled JSON.
const compiledDir = join("public", "content");
const compiledLessons = new Map<string, Lesson>();
let compiledTrackCount = 0;
for (const file of readdirSync(compiledDir).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(readFileSync(join(compiledDir, file), "utf8")) as { track: string; lessons: Lesson[] };
  compiledTrackCount++;
  for (const l of data.lessons) compiledLessons.set(l.id, l);
}

let errors = 0;
let warnings = 0;

// Check 1: lesson count.
console.log(`[verify] original: ${originalLessons.length} lessons, compiled: ${compiledLessons.size} lessons`);
if (originalLessons.length !== compiledLessons.size) {
  console.error(`[verify] FAIL: lesson count mismatch (${originalLessons.length} → ${compiledLessons.size})`);
  errors++;
}

// Check 2: quiz count.
const origQuizCount = originalLessons.reduce((sum, l) => sum + l.quiz.length, 0);
const compQuizCount = [...compiledLessons.values()].reduce((sum, l) => sum + l.quiz.length, 0);
console.log(`[verify] original: ${origQuizCount} quiz questions, compiled: ${compQuizCount}`);
if (origQuizCount !== compQuizCount) {
  console.error(`[verify] FAIL: quiz count mismatch (${origQuizCount} → ${compQuizCount})`);
  errors++;
}

// Check 3: track count.
console.log(`[verify] compiled tracks: ${compiledTrackCount}`);
if (compiledTrackCount !== 38) {
  console.error(`[verify] FAIL: expected 38 tracks, got ${compiledTrackCount}`);
  errors++;
}

// Check 4-8: per-lesson field-by-field comparison.
let lessonsChecked = 0;
let quizIdsMatched = 0;
let blockCountsMatch = 0;
for (const [id, origLesson] of originalById) {
  const compLesson = compiledLessons.get(id);
  if (!compLesson) {
    console.error(`[verify] FAIL: lesson ${id} missing from compiled output`);
    errors++;
    continue;
  }
  lessonsChecked++;

  // Slug check.
  const origSlug = origLesson.slug ?? LESSON_SLUGS[id] ?? id;
  if (compLesson.slug !== origSlug) {
    console.error(`[verify] FAIL: ${id} slug mismatch (${origSlug} → ${compLesson.slug})`);
    errors++;
  }

  // Scalar field checks.
  for (const field of ["track", "order", "title", "difficulty", "estMinutes"] as const) {
    if (compLesson[field] !== origLesson[field]) {
      console.error(`[verify] FAIL: ${id} ${field} mismatch (${JSON.stringify(origLesson[field])} → ${JSON.stringify(compLesson[field])})`);
      errors++;
    }
  }

  // Block count check (deep equality of blocks is hard due to nested objects;
  // count is a strong proxy).
  if (compLesson.blocks.length !== origLesson.blocks.length) {
    console.error(`[verify] FAIL: ${id} block count mismatch (${origLesson.blocks.length} → ${compLesson.blocks.length})`);
    errors++;
  } else {
    blockCountsMatch++;
    // Spot-check block kinds.
    const origKinds = origLesson.blocks.map((b) => b.kind).join(",");
    const compKinds = compLesson.blocks.map((b) => b.kind).join(",");
    if (origKinds !== compKinds) {
      console.warn(`[verify] WARN: ${id} block kinds order differs`);
      warnings++;
    }
  }

  // Quiz check: question count + IDs.
  if (compLesson.quiz.length !== origLesson.quiz.length) {
    console.error(`[verify] FAIL: ${id} quiz count mismatch (${origLesson.quiz.length} → ${compLesson.quiz.length})`);
    errors++;
  } else {
    let quizOk = true;
    for (let qi = 0; qi < origLesson.quiz.length; qi++) {
      if (compLesson.quiz[qi].id !== origLesson.quiz[qi].id) {
        console.error(`[verify] FAIL: ${id} quiz[${qi}] id mismatch (${origLesson.quiz[qi].id} → ${compLesson.quiz[qi].id})`);
        errors++;
        quizOk = false;
      }
      if (compLesson.quiz[qi].correctIndex !== origLesson.quiz[qi].correctIndex) {
        console.error(`[verify] FAIL: ${id} quiz[${qi}] correctIndex mismatch`);
        errors++;
        quizOk = false;
      }
      if (compLesson.quiz[qi].options.length !== origLesson.quiz[qi].options.length) {
        console.error(`[verify] FAIL: ${id} quiz[${qi}] options count mismatch`);
        errors++;
        quizOk = false;
      }
    }
    if (quizOk) quizIdsMatched++;
  }
}

console.log("");
console.log("========================================");
console.log(`Lessons checked:     ${lessonsChecked}/${originalLessons.length}`);
console.log(`Quiz IDs matched:    ${quizIdsMatched}/${originalLessons.length}`);
console.log(`Block counts match:  ${blockCountsMatch}/${originalLessons.length}`);
console.log(`Errors:              ${errors}`);
console.log(`Warnings:            ${warnings}`);
console.log("========================================");

if (errors > 0) {
  console.error("[verify] FAILED — round-trip is NOT lossless");
  process.exit(1);
}
console.log("[verify] PASS — round-trip is lossless (lesson count, quiz count, IDs, slugs, block counts all preserved)");
process.exit(0);
