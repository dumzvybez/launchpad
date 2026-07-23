#!/usr/bin/env bun
/**
 * compile-content.ts — v6.2.0: Compiles lesson Markdown source files in
 * content/{track}/*.md into per-track JSON files in public/content/{track}.json.
 *
 * The compiler is the inverse of migrate-content-to-md.ts. Together they form
 * a lossless round-trip: compile(serialize(lesson)) === lesson.
 *
 * Pipeline:
 *   content/{track}/*.md  →  [this compiler]  →  public/content/{track}.json
 *
 * Each output JSON file contains:
 *   { track: string, lessons: Lesson[] }
 *
 * The runtime content-loader.ts lazy-fetches these JSON files when a user
 * opens a track — replacing the 11MB eager bundle with ~200-470KB per-track.
 *
 * RUN:  bun run compile:content
 *       (wired in package.json)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import type { Lesson, LessonBlock, QuizQuestion, ResourceLink } from "../src/lib/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content");
const OUT_DIR = join(ROOT, "public", "content");

// ---- Section name → block kind mapping ----
const LIST_SECTIONS: Record<string, LessonBlock["kind"]> = {
  "Prerequisites": "prerequisites",
  "Topics": "topics",
  "Key Concepts": "keyConcepts",
  "Common Pitfalls": "pitfalls",
  "Real-World Applications": "realWorldApps",
  "Interview Questions": "interviewQuestions",
};
const PARAGRAPH_SECTIONS = new Set(["Why It Matters", "Mini Project"]);
const RESOURCES_SECTION = "Resources";
const EXERCISES_SECTION = "Exercises";

// ---- Frontmatter parser ----
type Frontmatter = { yaml: Record<string, unknown>; body: string };
function parseFrontmatter(src: string): Frontmatter {
  if (!src.startsWith("---")) return { yaml: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end < 0) return { yaml: {}, body: src };
  const yamlStr = src.slice(3, end);
  const body = src.slice(end + 4).replace(/^\n/, "");
  return { yaml: yaml.parse(yamlStr) as Record<string, unknown>, body };
}

// ---- Body parser: Markdown lines → LessonBlock[] + QuizQuestion[] ----
type ParsedBody = { blocks: LessonBlock[]; quiz: QuizQuestion[] };
function parseBody(body: string): ParsedBody {
  const lines = body.split("\n");
  const blocks: LessonBlock[] = [];
  const quiz: QuizQuestion[] = [];

  let i = 0;
  // Skip the leading `# Title` h1 line (title is in frontmatter).
  if (lines.length > 0 && lines[0].startsWith("# ")) i = 1;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines.
    if (line.trim() === "") { i++; continue; }

    // Quiz fence (```quiz ... ```) — MUST be checked BEFORE the code fence,
    // because "quiz" matches \w* in the code fence regex.
    if (line.trim() === "```quiz") {
      const quizLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        quizLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const parsed = yaml.parse(quizLines.join("\n")) as QuizQuestion[];
      if (Array.isArray(parsed)) quiz.push(...parsed);
      continue;
    }

    // Code fence (```lang ... ```).
    const codeFenceMatch = line.match(/^```(\w*)$/);
    if (codeFenceMatch) {
      const language = codeFenceMatch[1] || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      // Optional caption: next line starting with "Caption: "
      let caption: string | undefined;
      if (i < lines.length && lines[i].trim().startsWith("Caption: ")) {
        caption = lines[i].trim().slice("Caption: ".length);
        i++;
      }
      const codeBlock: LessonBlock = { kind: "code", language, code: codeLines.join("\n") };
      if (caption) (codeBlock as { caption?: string }).caption = caption;
      blocks.push(codeBlock);
      continue;
    }

    // H2 heading (## X) → heading block.
    if (line.startsWith("## ")) {
      blocks.push({ kind: "heading", content: line.slice(3) });
      i++;
      continue;
    }

    // H3 section (### X) → named section.
    if (line.startsWith("### ")) {
      const sectionName = line.slice(4).trim();
      i++;
      // Skip blank lines after heading.
      while (i < lines.length && lines[i].trim() === "") i++;

      if (sectionName in LIST_SECTIONS) {
        // Collect bullet list items.
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(lines[i].slice(2));
          i++;
        }
        blocks.push({ kind: LIST_SECTIONS[sectionName], items } as LessonBlock);
      } else if (PARAGRAPH_SECTIONS.has(sectionName)) {
        // Collect paragraph lines until blank or next heading.
        const paraLines: string[] = [];
        while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```")) {
          paraLines.push(lines[i]);
          i++;
        }
        const content = paraLines.join("\n");
        if (sectionName === "Why It Matters") {
          blocks.push({ kind: "whyItMatters", content });
        } else {
          blocks.push({ kind: "miniProject", content });
        }
      } else if (sectionName === RESOURCES_SECTION) {
        // Collect resource links: - [label](url) {kind: X}
        const links: ResourceLink[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          const m = lines[i].match(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*\{kind:\s*(\w+)\})?/);
          if (m) {
            const link: ResourceLink = { label: m[1], url: m[2] };
            if (m[3]) (link as { kind?: string }).kind = m[3] as ResourceLink["kind"];
            links.push(link);
          }
          i++;
        }
        blocks.push({ kind: "resources", links });
      } else if (sectionName === EXERCISES_SECTION) {
        // Collect numbered list items: 1. X, 2. Y, ...
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ""));
          i++;
        }
        blocks.push({ kind: "exercises", items });
      } else {
        // Unknown section — treat the heading itself as a heading block.
        blocks.push({ kind: "heading", content: sectionName });
      }
      continue;
    }

    // Blockquote: tip / warning / callout.
    if (line.startsWith("> ")) {
      // Multi-line blockquote: collect consecutive > lines.
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      const content = quoteLines.join("\n");
      // Detect variant.
      const tipMatch = content.match(/^\*\*Tip:\*\*\s*(.*)$/s);
      const warningMatch = content.match(/^\*\*Warning:\*\*\s*(.*)$/s);
      const calloutMatch = content.match(/^\[!(INFO|SUCCESS|WARNING)\]\n(.*)$/s);
      if (tipMatch) {
        blocks.push({ kind: "tip", content: tipMatch[1].trim() });
      } else if (warningMatch) {
        blocks.push({ kind: "warning", content: warningMatch[1].trim() });
      } else if (calloutMatch) {
        blocks.push({ kind: "callout", content: calloutMatch[2].trim(), variant: calloutMatch[1].toLowerCase() as "info" | "success" | "warning" });
      } else {
        // Unknown blockquote — treat as text.
        blocks.push({ kind: "text", content });
      }
      continue;
    }

    // Plain paragraph → text block.
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].startsWith("> ") && !lines[i].startsWith("- ")) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ kind: "text", content: paraLines.join("\n") });
    } else {
      // Safety: if no handler matched and the paragraph loop didn't advance,
      // force-advance to prevent an infinite loop. This handles edge cases
      // like a stray "- " line outside a section heading.
      i++;
    }
  }

  return { blocks, quiz };
}

// ---- Lesson parser: .md file → Lesson object ----
function parseLessonFile(filePath: string): Lesson {
  const src = readFileSync(filePath, "utf8");
  const { yaml: fm, body } = parseFrontmatter(src);
  const { blocks, quiz } = parseBody(body);

  const lesson: Lesson = {
    id: fm.id as string,
    slug: fm.slug as string,
    track: fm.track as string,
    title: fm.title as string,
    description: fm.description as string,
    difficulty: fm.difficulty as Lesson["difficulty"],
    estMinutes: fm.estMinutes as number,
    order: fm.order as number,
    blocks,
    quiz,
  };
  // Optional fields.
  if (fm.group) lesson.group = fm.group as string;
  if (fm.youtubeUrl) lesson.youtubeUrl = fm.youtubeUrl as string;
  if (fm.whyItMatters) lesson.whyItMatters = fm.whyItMatters as string;
  if (fm.difficultyNumeric) lesson.difficultyNumeric = fm.difficultyNumeric as Lesson["difficultyNumeric"];
  if (fm.deepDiveResources) lesson.deepDiveResources = fm.deepDiveResources as ResourceLink[];
  if (fm.learningObjectives) lesson.learningObjectives = fm.learningObjectives as string[];
  if (fm.prerequisiteLessons) lesson.prerequisiteLessons = fm.prerequisiteLessons as Lesson["prerequisiteLessons"];
  if (fm.skillsTaught) lesson.skillsTaught = fm.skillsTaught as Lesson["skillsTaught"];
  if (fm.aiContext) lesson.aiContext = fm.aiContext as Lesson["aiContext"];
  if (fm.versionHash) lesson.versionHash = fm.versionHash as string;
  return lesson;
}

// ---- Main ----
mkdirSync(OUT_DIR, { recursive: true });

let trackCount = 0;
let lessonCount = 0;
const trackDirs = readdirSync(CONTENT_DIR).filter(
  (d) => d !== "README.md" && d !== "_track-meta",
);

for (const trackId of trackDirs) {
  const trackPath = join(CONTENT_DIR, trackId);
  if (!existsSync(trackPath)) continue;
  const mdFiles = readdirSync(trackPath).filter((f) => f.endsWith(".md"));
  if (mdFiles.length === 0) continue;

  const lessons: Lesson[] = [];
  for (const mdFile of mdFiles) {
    try {
      const lesson = parseLessonFile(join(trackPath, mdFile));
      lessons.push(lesson);
    } catch (e) {
      console.error(`[compile] ERROR parsing ${trackId}/${mdFile}:`, e);
      throw e;
    }
  }
  // Sort by order.
  lessons.sort((a, b) => a.order - b.order);

  const outPath = join(OUT_DIR, `${trackId}.json`);
  const payload = { track: trackId, lessons };
  writeFileSync(outPath, JSON.stringify(payload), "utf8");

  trackCount++;
  lessonCount += lessons.length;
  console.log(`[compile] ${trackId}: ${lessons.length} lessons → ${outPath}`);
}

console.log(`[compile] done: ${trackCount} tracks, ${lessonCount} lessons → public/content/`);
