#!/usr/bin/env bun
/**
 * migrate-content-to-md.ts — v6.2.0: Migrates ALL existing lesson content from
 * the TypeScript bundle (lessons-content.ts + lessons-extended.ts) to Markdown
 * source files in content/{track}/{slug}.md.
 *
 * This is a ONE-TIME migration. After it runs, the Markdown files are the
 * source-of-truth, and scripts/compile-content.ts compiles them to
 * public/content/{track}.json for runtime use.
 *
 * The Markdown format is designed for lossless round-trip:
 *   - YAML frontmatter holds all scalar metadata + structured fields.
 *   - The body uses heading-anchored sections for list-type blocks
 *     (##/### headings), fenced code blocks, blockquotes for tip/warning/callout,
 *     and a ```quiz fence for quiz questions.
 *
 * RUN:  bun run scripts/migrate-content-to-md.ts
 */

import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import type { Lesson, LessonBlock, QuizQuestion } from "../src/lib/types";
import { ALL_LESSONS } from "../src/lib/lessons-content";
import { EXTENDED_LESSONS } from "../src/lib/lessons-extended";
import { LESSON_SLUGS } from "../src/lib/lessons-meta-generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content");

// ---- Block serializer: LessonBlock → Markdown lines ----
function serializeBlock(block: LessonBlock): string[] {
  switch (block.kind) {
    case "heading":
      return [`## ${block.content}`, ""];
    case "whyItMatters":
      return ["### Why It Matters", "", block.content, ""];
    case "text":
      return [block.content, ""];
    case "code":
      return [
        "```" + block.language,
        block.code,
        "```",
        ...(block.caption ? [`Caption: ${block.caption}`, ""] : [""]),
      ];
    case "tip":
      // Prefix every line with "> " so multi-line content stays in one blockquote.
      return [`> **Tip:** ${block.content.split("\n").join("\n> ")}`, ""];
    case "warning":
      return [`> **Warning:** ${block.content.split("\n").join("\n> ")}`, ""];
    case "callout":
      return [
        `> [!${block.variant.toUpperCase()}]`,
        ...block.content.split("\n").map((l) => `> ${l}`),
        "",
      ];
    case "resources":
      return [
        "### Resources",
        "",
        ...block.links.map((l) => `- [${l.label}](${l.url})${l.kind ? ` {kind: ${l.kind}}` : ""}`),
        "",
      ];
    case "prerequisites":
      return ["### Prerequisites", "", ...block.items.map((i) => `- ${i}`), ""];
    case "topics":
      return ["### Topics", "", ...block.items.map((i) => `- ${i}`), ""];
    case "keyConcepts":
      return ["### Key Concepts", "", ...block.items.map((i) => `- ${i}`), ""];
    case "pitfalls":
      return ["### Common Pitfalls", "", ...block.items.map((i) => `- ${i}`), ""];
    case "realWorldApps":
      return ["### Real-World Applications", "", ...block.items.map((i) => `- ${i}`), ""];
    case "interviewQuestions":
      return ["### Interview Questions", "", ...block.items.map((i) => `- ${i}`), ""];
    case "miniProject":
      return ["### Mini Project", "", block.content, ""];
    case "exercises":
      return ["### Exercises", "", ...block.items.map((i, idx) => `${idx + 1}. ${i}`), ""];
    default:
      return [`<!-- unknown block kind: ${(block as { kind: string }).kind} -->`, ""];
  }
}

// ---- Quiz serializer: QuizQuestion[] → YAML fence ----
function serializeQuiz(quiz: QuizQuestion[]): string {
  const items = quiz.map((q) => {
    const obj: Record<string, unknown> = {
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
    };
    if (q.explanation) obj.explanation = q.explanation;
    if (q.slug) obj.slug = q.slug;
    if (q.versionHash) obj.versionHash = q.versionHash;
    if (q.kind) obj.kind = q.kind;
    if (q.skillsAssessed) obj.skillsAssessed = q.skillsAssessed;
    return obj;
  });
  const yamlStr = yaml.stringify(items, { lineWidth: 0 });
  return ["```quiz", yamlStr.trimEnd(), "```", ""].join("\n");
}

// ---- Lesson serializer: Lesson → full .md file content ----
function serializeLesson(lesson: Lesson): string {
  const slug = lesson.slug ?? LESSON_SLUGS[lesson.id] ?? lesson.id;

  // Build frontmatter object (only non-empty fields).
  const fm: Record<string, unknown> = {
    slug,
    id: lesson.id,
    track: lesson.track,
    order: lesson.order,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    estMinutes: lesson.estMinutes,
    contentVersion: "1.0.0",
  };
  if (lesson.group) fm.group = lesson.group;
  if (lesson.youtubeUrl) fm.youtubeUrl = lesson.youtubeUrl;
  if (lesson.whyItMatters) fm.whyItMatters = lesson.whyItMatters;
  if (lesson.difficultyNumeric) fm.difficultyNumeric = lesson.difficultyNumeric;
  if (lesson.deepDiveResources && lesson.deepDiveResources.length > 0)
    fm.deepDiveResources = lesson.deepDiveResources;
  if (lesson.learningObjectives) fm.learningObjectives = lesson.learningObjectives;
  if (lesson.prerequisiteLessons) fm.prerequisiteLessons = lesson.prerequisiteLessons;
  if (lesson.skillsTaught) fm.skillsTaught = lesson.skillsTaught;
  if (lesson.aiContext) fm.aiContext = lesson.aiContext;
  if (lesson.versionHash) fm.versionHash = lesson.versionHash;

  const fmYaml = yaml.stringify(fm, { lineWidth: 0 });

  // Build body.
  const bodyLines: string[] = [`# ${lesson.title}`, ""];
  for (const block of lesson.blocks) {
    bodyLines.push(...serializeBlock(block));
  }
  // Quiz fence at the end.
  if (lesson.quiz && lesson.quiz.length > 0) {
    bodyLines.push(serializeQuiz(lesson.quiz));
  }

  return `---\n${fmYaml}---\n\n${bodyLines.join("\n")}\n`;
}

// ---- Main ----
const allLessons: Lesson[] = [...ALL_LESSONS, ...EXTENDED_LESSONS];
console.log(`[migrate] found ${allLessons.length} lessons (${ALL_LESSONS.length} + ${EXTENDED_LESSONS.length})`);

// Clean content/ subdirectories (keep README.md and _track-meta/).
if (existsSync(CONTENT_DIR)) {
  for (const entry of readdirSync(CONTENT_DIR)) {
    if (entry === "README.md" || entry === "_track-meta") continue;
    const p = join(CONTENT_DIR, entry);
    if (statSync(p).isDirectory()) rmSync(p, { recursive: true, force: true });
  }
}

// Group lessons by track.
const byTrack = new Map<string, Lesson[]>();
for (const lesson of allLessons) {
  if (!byTrack.has(lesson.track)) byTrack.set(lesson.track, []);
  byTrack.get(lesson.track)!.push(lesson);
}

let written = 0;
let skipped = 0;
for (const [trackId, lessons] of byTrack) {
  const trackDir = join(CONTENT_DIR, trackId);
  mkdirSync(trackDir, { recursive: true });
  for (const lesson of lessons) {
    const slug = lesson.slug ?? LESSON_SLUGS[lesson.id] ?? lesson.id;
    const md = serializeLesson(lesson);
    const filePath = join(trackDir, `${slug}.md`);
    writeFileSync(filePath, md, "utf8");
    written++;
  }
}

console.log(`[migrate] wrote ${written} lesson .md files across ${byTrack.size} tracks`);
console.log(`[migrate] sample: content/python/python-getting-started-python.md`);

// Verify a sample file was written correctly.
const samplePath = join(CONTENT_DIR, "python", "python-getting-started-python.md");
if (existsSync(samplePath)) {
  const sample = readFileSync(samplePath, "utf8");
  const lines = sample.split("\n").length;
  console.log(`[migrate] sample file: ${lines} lines, ${sample.length} bytes`);
}
