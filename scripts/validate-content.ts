#!/usr/bin/env bun
/**
 * validate-content.ts — v6.2.0: Validates the compiled content JSON files
 * in public/content/*.json for structural integrity.
 *
 * Checks:
 *   1. No duplicate slugs across all tracks
 *   2. No duplicate lesson IDs
 *   3. Every lesson has required fields (id, slug, track, title, blocks, quiz)
 *   4. Every quiz question has id, question, options, correctIndex
 *   5. correctIndex is within options bounds
 *   6. Every lesson's track matches the file's track
 *   7. No broken prerequisite references (if prerequisiteLessons is set)
 *   8. Track lesson counts match generated metadata
 *
 * RUN:  bun run validate:content
 * Exit 0 = pass, 1 = fail.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Lesson } from "../src/lib/types";
import { TRACK_LESSON_COUNTS_GENERATED, LESSON_SLUGS } from "../src/lib/lessons-meta-generated";

const CONTENT_DIR = join("public", "content");
let errors = 0;
let warnings = 0;

if (!existsSync(CONTENT_DIR)) {
  console.error("[validate] FAIL: public/content/ not found. Run `bun run compile:content`.");
  process.exit(1);
}

const allSlugs = new Set<string>();
const allIds = new Set<string>();
const allLessons: Lesson[] = [];
const trackFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));

console.log(`[validate] checking ${trackFiles.length} track JSON files...`);

for (const file of trackFiles) {
  const trackId = file.replace(".json", "");
  const data = JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8")) as { track: string; lessons: Lesson[] };

  // Check: track field in JSON matches filename.
  if (data.track !== trackId) {
    console.error(`[validate] FAIL: ${file} track field "${data.track}" ≠ filename track "${trackId}"`);
    errors++;
  }

  // Check: lesson count matches generated metadata.
  const expectedCount = TRACK_LESSON_COUNTS_GENERATED[trackId] ?? 0;
  if (data.lessons.length !== expectedCount) {
    console.error(`[validate] FAIL: ${trackId} lesson count ${data.lessons.length} ≠ expected ${expectedCount}`);
    errors++;
  }

  for (const lesson of data.lessons) {
    allLessons.push(lesson);

    // Check: required fields.
    for (const field of ["id", "slug", "track", "title", "description", "difficulty", "order", "blocks", "quiz"] as const) {
      if (lesson[field] === undefined || lesson[field] === null) {
        console.error(`[validate] FAIL: ${lesson.id ?? "??"} missing required field "${field}"`);
        errors++;
      }
    }

    // Check: slug globally unique.
    const slug = lesson.slug ?? "";
    if (allSlugs.has(slug)) {
      console.error(`[validate] FAIL: duplicate slug "${slug}" (lesson ${lesson.id})`);
      errors++;
    }
    allSlugs.add(slug);

    // Check: id globally unique.
    if (allIds.has(lesson.id)) {
      console.error(`[validate] FAIL: duplicate id "${lesson.id}"`);
      errors++;
    }
    allIds.add(lesson.id);

    // Check: lesson.track matches file track.
    if (lesson.track !== trackId) {
      console.error(`[validate] FAIL: ${lesson.id} track "${lesson.track}" ≠ file track "${trackId}"`);
      errors++;
    }

    // Check: slug matches generated slug map.
    const expectedSlug = LESSON_SLUGS[lesson.id];
    if (expectedSlug && lesson.slug !== expectedSlug) {
      console.error(`[validate] FAIL: ${lesson.id} slug "${lesson.slug}" ≠ generated "${expectedSlug}"`);
      errors++;
    }

    // Check: quiz questions.
    for (let qi = 0; qi < lesson.quiz.length; qi++) {
      const q = lesson.quiz[qi];
      if (!q.id) {
        console.error(`[validate] FAIL: ${lesson.id} quiz[${qi}] missing id`);
        errors++;
      }
      if (!q.question) {
        console.error(`[validate] FAIL: ${lesson.id} quiz[${qi}] missing question`);
        errors++;
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        console.error(`[validate] FAIL: ${lesson.id} quiz[${qi}] options must have ≥2 items`);
        errors++;
      }
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        console.error(`[validate] FAIL: ${lesson.id} quiz[${qi}] correctIndex ${q.correctIndex} out of bounds (options: ${q.options.length})`);
        errors++;
      }
    }

    // Check: blocks have valid kinds.
    for (let bi = 0; bi < lesson.blocks.length; bi++) {
      const b = lesson.blocks[bi];
      const validKinds = ["text", "code", "tip", "warning", "heading", "resources", "prerequisites", "topics", "keyConcepts", "pitfalls", "realWorldApps", "interviewQuestions", "miniProject", "exercises", "whyItMatters", "callout"];
      if (!validKinds.includes(b.kind)) {
        console.error(`[validate] FAIL: ${lesson.id} block[${bi}] invalid kind "${b.kind}"`);
        errors++;
      }
    }

    // Check: prerequisiteLessons resolve to known slugs.
    if (lesson.prerequisiteLessons) {
      for (const prereq of lesson.prerequisiteLessons) {
        if (!allSlugs.has(prereq.lessonRef) && !allIds.has(prereq.lessonRef)) {
          // Deferred check — the prereq might be in a track we haven't loaded yet.
          // We'll do a second pass after all lessons are collected.
        }
      }
    }
  }
}

// Second pass: check prerequisites now that all slugs are known.
for (const lesson of allLessons) {
  if (lesson.prerequisiteLessons) {
    for (const prereq of lesson.prerequisiteLessons) {
      if (!allSlugs.has(prereq.lessonRef) && !allIds.has(prereq.lessonRef)) {
        console.warn(`[validate] WARN: ${lesson.id} prerequisite "${prereq.lessonRef}" does not resolve to a known lesson`);
        warnings++;
      }
    }
  }
  // Check: skillsTaught references (if any) — can't validate without a skill graph.
}

console.log("");
console.log("========================================");
console.log(`Tracks checked:     ${trackFiles.length}`);
console.log(`Lessons checked:    ${allLessons.length}`);
console.log(`Unique slugs:       ${allSlugs.size}`);
console.log(`Unique IDs:         ${allIds.size}`);
console.log(`Errors:             ${errors}`);
console.log(`Warnings:           ${warnings}`);
console.log("========================================");

if (errors > 0) {
  console.error("[validate] FAILED — content has structural errors");
  process.exit(1);
}
console.log("[validate] PASS — content is structurally valid");
process.exit(0);
