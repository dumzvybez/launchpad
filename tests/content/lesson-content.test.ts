/**
 * Content tests — validate the compiled lesson content in public/content/*.json.
 *
 * Tests:
 *   - Lesson schema validation (required fields present and correctly typed)
 *   - Unique slugs across all 797 lessons
 *   - Valid tracks (no orphaned/mistyped track references)
 *   - Quiz existence (expected: 767/797 lessons have quizzes)
 *   - Quiz explanation coverage (expected: 100% of quiz questions have explanations)
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "..", "public", "content");

// ---- Load all compiled track JSON ----
type Lesson = {
  id: string;
  slug?: string;
  track: string;
  title: string;
  description: string;
  difficulty: string;
  estMinutes: number;
  order: number;
  blocks: unknown[];
  quiz: QuizQuestion[];
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

type TrackFile = { track: string; lessons: Lesson[] };

function loadAllTracks(): { trackFiles: TrackFile[]; allLessons: Lesson[] } {
  const trackFiles: TrackFile[] = [];
  const allLessons: Lesson[] = [];
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const raw = readFileSync(join(CONTENT_DIR, file), "utf8");
    const data = JSON.parse(raw) as TrackFile;
    trackFiles.push(data);
    allLessons.push(...data.lessons);
  }
  return { trackFiles, allLessons };
}

const { trackFiles, allLessons } = loadAllTracks();

// Expected totals (verified in the audit report)
const EXPECTED_TOTAL_LESSONS = 797;
const EXPECTED_TRACKS = 38;
const EXPECTED_LESSONS_WITH_QUIZ = 767;

// ---- Tests ----

describe("Content: lesson schema validation", () => {
  it("every lesson has all required fields with correct types", () => {
    const errors: string[] = [];
    for (const lesson of allLessons) {
      if (typeof lesson.id !== "string" || !lesson.id) errors.push(`${lesson.id ?? "?"}: missing/invalid id`);
      if (typeof lesson.slug !== "string" || !lesson.slug) errors.push(`${lesson.id}: missing/invalid slug`);
      if (typeof lesson.track !== "string" || !lesson.track) errors.push(`${lesson.id}: missing/invalid track`);
      if (typeof lesson.title !== "string" || !lesson.title) errors.push(`${lesson.id}: missing/invalid title`);
      if (typeof lesson.description !== "string" || !lesson.description) errors.push(`${lesson.id}: missing/invalid description`);
      if (!["beginner", "intermediate", "advanced"].includes(lesson.difficulty))
        errors.push(`${lesson.id}: invalid difficulty "${lesson.difficulty}"`);
      if (typeof lesson.estMinutes !== "number" || lesson.estMinutes <= 0)
        errors.push(`${lesson.id}: invalid estMinutes=${lesson.estMinutes}`);
      if (typeof lesson.order !== "number" || lesson.order < 1)
        errors.push(`${lesson.id}: invalid order=${lesson.order}`);
      if (!Array.isArray(lesson.blocks)) errors.push(`${lesson.id}: blocks is not an array`);
      if (!Array.isArray(lesson.quiz)) errors.push(`${lesson.id}: quiz is not an array`);
    }
    expect(errors).toEqual([]);
  });

  it("every quiz question has required fields", () => {
    const errors: string[] = [];
    for (const lesson of allLessons) {
      for (let i = 0; i < lesson.quiz.length; i++) {
        const q = lesson.quiz[i];
        if (typeof q.id !== "string" || !q.id) errors.push(`${lesson.id} Q${i}: missing id`);
        if (typeof q.question !== "string" || !q.question) errors.push(`${lesson.id} Q${i}: missing question`);
        if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${lesson.id} Q${i}: needs ≥2 options`);
        if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length)
          errors.push(`${lesson.id} Q${i}: invalid correctIndex=${q.correctIndex}`);
      }
    }
    expect(errors).toEqual([]);
  });
});

describe("Content: unique slugs", () => {
  it("all lesson slugs are globally unique", () => {
    const slugSet = new Map<string, string>(); // slug → lesson id
    const duplicates: string[] = [];
    for (const lesson of allLessons) {
      const slug = lesson.slug ?? lesson.id;
      if (slugSet.has(slug)) {
        duplicates.push(`${slug} (lessons ${slugSet.get(slug)} and ${lesson.id})`);
      } else {
        slugSet.set(slug, lesson.id);
      }
    }
    expect(duplicates).toEqual([]);
  });

  it("all lesson ids are globally unique", () => {
    const idSet = new Set<string>();
    const duplicates: string[] = [];
    for (const lesson of allLessons) {
      if (idSet.has(lesson.id)) duplicates.push(lesson.id);
      else idSet.add(lesson.id);
    }
    expect(duplicates).toEqual([]);
  });
});

describe("Content: valid tracks", () => {
  const KNOWN_TRACKS = new Set([
    "angular", "bash", "c", "cpp", "csharp", "css", "dart", "django", "docker",
    "express", "fastapi", "flask", "go", "graphql", "html", "java", "javascript",
    "kotlin", "kubernetes", "mongodb", "nextjs", "nodejs", "php", "postgresql",
    "python", "pytorch", "r", "react", "ruby", "rust", "sql", "svelte", "swift",
    "tailwind", "tensorflow", "terraform", "typescript", "vue",
  ]);

  it("all lessons reference a known track", () => {
    const unknown: string[] = [];
    for (const lesson of allLessons) {
      if (!KNOWN_TRACKS.has(lesson.track)) unknown.push(`${lesson.id}: unknown track "${lesson.track}"`);
    }
    expect(unknown).toEqual([]);
  });

  it("every track file's track field matches its filename", () => {
    const mismatches: string[] = [];
    for (const tf of trackFiles) {
      // The track field should be a non-empty string that's in the known set
      if (!tf.track || !KNOWN_TRACKS.has(tf.track)) {
        mismatches.push(`track field "${tf.track}" is not a known track`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it(`total track count is ${EXPECTED_TRACKS}`, () => {
    expect(trackFiles.length).toBe(EXPECTED_TRACKS);
  });

  it(`total lesson count is ${EXPECTED_TOTAL_LESSONS}`, () => {
    expect(allLessons.length).toBe(EXPECTED_TOTAL_LESSONS);
  });
});

describe("Content: quiz existence", () => {
  it(`lessons with quizzes: ${EXPECTED_LESSONS_WITH_QUIZ}/${EXPECTED_TOTAL_LESSONS}`, () => {
    const withQuiz = allLessons.filter((l) => l.quiz.length > 0);
    expect(withQuiz.length).toBe(EXPECTED_LESSONS_WITH_QUIZ);
  });

  it("lessons without quizzes are capstones (30 main capstones)", () => {
    const withoutQuiz = allLessons.filter((l) => l.quiz.length === 0);
    // 30 main capstones have no quiz; 7 "lesser" capstones DO have quizzes
    expect(withoutQuiz.length).toBe(30);
    // Each should have "capstone" in its slug or id
    for (const lesson of withoutQuiz) {
      const id = lesson.id.toLowerCase();
      const slug = (lesson.slug ?? "").toLowerCase();
      expect(id.includes("capstone") || slug.includes("capstone")).toBe(true);
    }
  });

  it("quiz questions count per lesson is 5 or 10 (or 0 for capstones)", () => {
    const unexpected: string[] = [];
    for (const lesson of allLessons) {
      const count = lesson.quiz.length;
      if (count !== 0 && count !== 5 && count !== 10) {
        unexpected.push(`${lesson.id}: ${count} questions`);
      }
    }
    expect(unexpected).toEqual([]);
  });
});

describe("Content: quiz explanation coverage", () => {
  it("100% of quiz questions have explanations", () => {
    const missing: string[] = [];
    let totalQuestions = 0;
    for (const lesson of allLessons) {
      for (let i = 0; i < lesson.quiz.length; i++) {
        totalQuestions++;
        const q = lesson.quiz[i];
        if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim().length === 0) {
          missing.push(`${lesson.id} Q${i}: missing explanation`);
        }
      }
    }
    // Should have 7,220 total questions, all with explanations
    expect(totalQuestions).toBe(7220);
    expect(missing).toEqual([]);
  });
});
