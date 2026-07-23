/**
 * test-migration.ts — v6.0 verification: simulate the slug migration on
 * sample pre-migration state and assert the output is correct.
 *
 * RUN:  bun run scripts/test-migration.ts
 *
 * This is NOT a full test framework — it's a focused, self-contained check
 * that the migrateSlugsV5() function correctly rewrites persisted state.
 */

import { LESSON_SLUGS, SLUG_TO_ID } from "../src/lib/lessons-meta-generated";

// --- Inline copies of the resolveRef/resolveQuizRef helpers (same logic as
//     storage.ts migrateSlugsV5, which can't be imported directly because it's
//     a non-exported function inside storage.ts). ---
function resolveRef(ref: string): string {
  if (typeof ref !== "string" || ref === "") return ref;
  if (SLUG_TO_ID[ref]) return ref;
  const slug = LESSON_SLUGS[ref];
  if (slug) return slug;
  return ref;
}
function resolveQuizRef(ref: string): string {
  if (typeof ref !== "string" || ref === "") return ref;
  if (!ref.includes(":")) return ref;
  const lastColon = ref.lastIndexOf(":");
  if (lastColon < 0) return ref;
  const lessonPart = ref.slice(0, lastColon);
  const qPart = ref.slice(lastColon + 1);
  const slug = resolveRef(lessonPart);
  return `${slug.replace(/-/g, ".")}.${qPart}`;
}
function trackIdFromSlug(slug: string): string {
  const i = slug.indexOf("-");
  return i > 0 ? slug.slice(0, i) : slug;
}

// --- The migrateSlugsV5 function, replicated from storage.ts ---
function migrateSlugsV5(state: Record<string, unknown>): void {
  // v6.1: check BOTH the new `slugMigration` flag and the v6.0 legacy
  // `v6SlugMigration` flag.
  type MS = { migrations?: { slugMigration?: boolean; v6SlugMigration?: boolean } };
  const mig = (state as unknown as MS).migrations;
  if (mig?.slugMigration || mig?.v6SlugMigration) return;

  let rewritten = 0;
  const lp = state.lessonProgress as Record<string, unknown> | undefined;
  if (lp && typeof lp === "object") {
    const newLp: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(lp)) {
      const newKey = resolveRef(key);
      if (newKey !== key) rewritten++;
      const v = value as Record<string, unknown> | undefined;
      if (v && typeof v === "object") {
        if (typeof v.lessonId === "string") v.lessonId = resolveRef(v.lessonId);
        const qa = v.questionAnswers as Record<string, unknown> | undefined;
        if (qa && typeof qa === "object") {
          const newQa: Record<string, unknown> = {};
          for (const [qaKey, qaVal] of Object.entries(qa)) newQa[resolveQuizRef(qaKey)] = qaVal;
          v.questionAnswers = newQa;
        }
      }
      if (newLp[newKey] && v && typeof v === "object") {
        const existing = newLp[newKey] as Record<string, unknown>;
        if (existing.status !== "complete" && v.status === "complete") newLp[newKey] = v;
      } else newLp[newKey] = v;
    }
    state.lessonProgress = newLp;
  }

  const qr = state.questionRecords as Record<string, unknown> | undefined;
  if (qr && typeof qr === "object") {
    const newQr: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(qr)) {
      const newKey = resolveQuizRef(key);
      if (newKey !== key) rewritten++;
      const v = value as Record<string, unknown> | undefined;
      if (v && typeof v === "object") {
        const parts = newKey.split(".");
        if (parts.length >= 2) {
          const lessonSlugDotted = parts.slice(0, -1).join("-");
          v.lessonSlug = v.lessonSlug ?? lessonSlugDotted;
          v.trackId = v.trackId ?? trackIdFromSlug(lessonSlugDotted);
          v.questionId = v.questionId ?? parts[parts.length - 1];
        }
      }
      newQr[newKey] = v;
    }
    state.questionRecords = newQr;
  }

  const bm = state.bookmarkedLessons as string[] | undefined;
  if (Array.isArray(bm)) {
    const seen = new Set<string>();
    state.bookmarkedLessons = bm.map((id) => { const s = resolveRef(id); if (s !== id) rewritten++; return s; })
      .filter((s) => { if (seen.has(s)) return false; seen.add(s); return true; });
  }

  const fc = state.flashcards as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(fc)) {
    for (const card of fc) {
      if (typeof card.id === "string" && card.id.includes(":")) {
        const firstColon = card.id.indexOf(":");
        const newId = resolveRef(card.id.slice(0, firstColon)) + card.id.slice(firstColon);
        if (newId !== card.id) rewritten++;
        card.id = newId;
      }
      if (typeof card.lessonId === "string") {
        const s = resolveRef(card.lessonId);
        if (s !== card.lessonId) rewritten++;
        card.lessonId = s;
      }
    }
  }

  const lts = state.learnTabState as { selectedLessonId?: string } | undefined;
  if (lts && typeof lts.selectedLessonId === "string") {
    const s = resolveRef(lts.selectedLessonId);
    if (s !== lts.selectedLessonId) rewritten++;
    lts.selectedLessonId = s;
  }

  if (!state.migrations) state.migrations = {};
  // v6.1: set BOTH flag names for cross-version compat.
  (state.migrations as { slugMigration?: boolean; v6SlugMigration?: boolean }).slugMigration = true;
  (state.migrations as { slugMigration?: boolean; v6SlugMigration?: boolean }).v6SlugMigration = true;
  console.log(`[test] migration rewrote ${rewritten} refs`);
}

// --- TEST HARNESS ---
let passed = 0, failed = 0;
function assert(cond: boolean, msg: string) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
}

// --- Look up real slugs from the generated map ---
const python01 = "python-01";
const python01Slug = LESSON_SLUGS[python01]; // e.g. "python-getting-started-python"
const python05 = "python-05";
const python05Slug = LESSON_SLUGS[python05];
console.log(`\n[test] Using real mappings: ${python01} → ${python01Slug}, ${python05} → ${python05Slug}\n`);

// --- TEST 1: lessonProgress key migration ---
console.log("Test 1: lessonProgress key migration");
{
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: {
      [python05]: {
        lessonId: python05,
        status: "complete",
        bestQuizScore: 80,
        questionAnswers: {
          [`${python05}:q1`]: { selectedIndex: 1, correct: true, attemptedAt: "2026-01-01T00:00:00Z" },
          [`${python05}:q2`]: { selectedIndex: 0, correct: false, attemptedAt: "2026-01-01T00:00:00Z" },
        },
      },
    },
    questionRecords: {},
    bookmarkedLessons: [],
    flashcards: [],
    learnTabState: { selectedLessonId: null, selectedTrack: null, tab: "tracks" },
  };
  migrateSlugsV5(state);
  const lp = state.lessonProgress as Record<string, unknown>;
  assert(!(python05 in lp), `old key ${python05} removed from lessonProgress`);
  assert(python05Slug in lp, `new slug key ${python05Slug} present in lessonProgress`);
  const prog = lp[python05Slug] as { lessonId: string; questionAnswers: Record<string, unknown> };
  assert(prog.lessonId === python05Slug, `lessonId field updated to slug`);
  assert(!(`${python05}:q1` in prog.questionAnswers), `old quiz key removed from questionAnswers`);
  const expectedQ1Key = `${python05Slug.replace(/-/g, ".")}.q1`;
  assert(expectedQ1Key in prog.questionAnswers, `new global quiz key ${expectedQ1Key} present in questionAnswers`);
}

// --- TEST 2: questionRecords key migration + trackId population ---
console.log("\nTest 2: questionRecords key migration + trackId");
{
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: {},
    questionRecords: {
      [`${python05}:q3`]: { questionId: "q3", correctCount: 1, incorrectCount: 2, lastAttemptDate: "", nextReviewDate: "", interval: 1, easinessFactor: 2.5, difficulty: "hard" },
    },
    bookmarkedLessons: [],
    flashcards: [],
    learnTabState: { selectedLessonId: null, selectedTrack: null, tab: "tracks" },
  };
  migrateSlugsV5(state);
  const qr = state.questionRecords as Record<string, unknown>;
  assert(!(`${python05}:q3` in qr), `old questionRecords key removed`);
  const expectedKey = `${python05Slug.replace(/-/g, ".")}.q3`;
  assert(expectedKey in qr, `new global quiz key ${expectedKey} present in questionRecords`);
  const rec = qr[expectedKey] as { lessonSlug?: string; trackId?: string; questionId?: string };
  assert(rec.lessonSlug === python05Slug, `record.lessonSlug = ${rec.lessonSlug} (expected ${python05Slug})`);
  assert(rec.trackId === "python", `record.trackId = ${rec.trackId} (expected "python")`);
}

// --- TEST 3: bookmarks + flashcards + selectedLessonId ---
console.log("\nTest 3: bookmarks + flashcards + selectedLessonId");
{
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: {},
    questionRecords: {},
    bookmarkedLessons: [python01, python05],
    flashcards: [
      { id: `${python05}:keyConcepts:0`, lessonId: python05, trackId: "python", front: "f", back: "b", source: "keyConcept", correctCount: 0, incorrectCount: 0, interval: 0, easinessFactor: 2.5 },
    ],
    learnTabState: { selectedLessonId: python01, selectedTrack: "python", tab: "lesson" },
  };
  migrateSlugsV5(state);
  const bm = state.bookmarkedLessons as string[];
  assert(bm.includes(python01Slug) && !bm.includes(python01), `bookmarks migrated to slugs`);
  assert(bm.length === 2, `bookmark count preserved (${bm.length})`);
  const fc = state.flashcards as Array<Record<string, unknown>>;
  assert(fc[0].id === `${python05Slug}:keyConcepts:0`, `flashcard id migrated (${fc[0].id})`);
  assert(fc[0].lessonId === python05Slug, `flashcard lessonId migrated`);
  const lts = state.learnTabState as { selectedLessonId: string };
  assert(lts.selectedLessonId === python01Slug, `selectedLessonId migrated to slug`);
}

// --- TEST 4: idempotency (re-running on migrated state is a no-op) ---
console.log("\nTest 4: idempotency");
{
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: { [python05Slug]: { lessonId: python05Slug, status: "complete", questionAnswers: {} } },
    questionRecords: { [`${python05Slug.replace(/-/g, ".")}.q1`]: { questionId: "q1", correctCount: 1, incorrectCount: 0, lessonSlug: python05Slug, trackId: "python", lastAttemptDate: "", nextReviewDate: "", interval: 1, easinessFactor: 2.5, difficulty: "easy" } },
    bookmarkedLessons: [python05Slug],
    flashcards: [],
    learnTabState: { selectedLessonId: python05Slug, selectedTrack: "python", tab: "lesson" },
    migrations: { slugMigration: true, v6SlugMigration: true },
  };
  const before = JSON.stringify(state);
  migrateSlugsV5(state);
  const after = JSON.stringify(state);
  assert(before === after, `re-running on migrated state is a no-op (idempotent)`);
}

// --- TEST 7: v6.0 → v6.1 cross-version compatibility ---
// A user who migrated under v6.0 has `v6SlugMigration: true` (but NOT
// `slugMigration`). v6.1 must recognize this and NOT re-run the migration.
console.log("\nTest 7: v6.0 → v6.1 cross-version flag compatibility");
{
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: { [python05Slug]: { lessonId: python05Slug, status: "complete", questionAnswers: {} } },
    questionRecords: {},
    bookmarkedLessons: [python05Slug],
    flashcards: [],
    learnTabState: { selectedLessonId: python05Slug, selectedTrack: "python", tab: "lesson" },
    // v6.0 set ONLY this flag. v6.1 must recognize it.
    migrations: { v6SlugMigration: true },
  };
  const before = JSON.stringify(state);
  migrateSlugsV5(state);
  const after = JSON.stringify(state);
  assert(before === after, `v6.0-flagged state is not re-migrated by v6.1 (cross-version compat)`);
}

// --- TEST 5: unknown lesson ids pass through unchanged (no data loss) ---
console.log("\nTest 5: unknown lesson id passthrough (no data loss)");
{
  const unknownId = "futurelang-99";
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: { [unknownId]: { lessonId: unknownId, status: "complete" } },
    questionRecords: {},
    bookmarkedLessons: [unknownId],
    flashcards: [],
    learnTabState: { selectedLessonId: null, selectedTrack: null, tab: "tracks" },
  };
  migrateSlugsV5(state);
  const lp = state.lessonProgress as Record<string, unknown>;
  assert(unknownId in lp, `unknown lesson id preserved (not dropped)`);
  const bm = state.bookmarkedLessons as string[];
  assert(bm.includes(unknownId), `unknown bookmark preserved`);
}

// --- TEST 6: capstone lesson id migration ---
console.log("\nTest 6: capstone lesson id migration");
{
  const capstoneId = "docker-capstone";
  const capstoneSlug = LESSON_SLUGS[capstoneId]; // "docker-capstone-project"
  const state: Record<string, unknown> = {
    schemaVersion: 4,
    lessonProgress: { [capstoneId]: { lessonId: capstoneId, status: "complete" } },
    questionRecords: {},
    bookmarkedLessons: [capstoneId],
    flashcards: [],
    learnTabState: { selectedLessonId: null, selectedTrack: null, tab: "tracks" },
  };
  migrateSlugsV5(state);
  const lp = state.lessonProgress as Record<string, unknown>;
  assert(capstoneSlug in lp, `capstone migrated: ${capstoneId} → ${capstoneSlug}`);
  assert(!(capstoneId in lp), `old capstone key removed`);
}

// --- SUMMARY ---
console.log(`\n========================================`);
console.log(`Migration tests: ${passed} passed, ${failed} failed`);
console.log(`========================================`);
process.exit(failed > 0 ? 1 : 0);
