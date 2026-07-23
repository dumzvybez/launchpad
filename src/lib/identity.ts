// ============================================================
// identity.ts — v6.0 Stable lesson & quiz identity layer.
//
// This module is the SINGLE SOURCE OF TRUTH for converting between:
//   - positional lesson ids  (e.g. "python-05")   — may change on reorder
//   - stable lesson slugs    (e.g. "python-variables-and-data-types")  — permanent
//   - global quiz keys       (e.g. "python.variables-and-data-types.q1")  — permanent
//
// All PERSISTED user state (lessonProgress, questionRecords, bookmarks,
// flashcards, learnTabState.selectedLessonId) is keyed by SLUG as of v6.0.
// All in-memory Lesson objects still carry `.id` (positional) for backward
// compat with the 10MB content bundle, which was not hand-edited.
//
// The helpers here are IDEMPOTENT: resolveRef("python-05") → "python-...",
// resolveRef("python-...") → "python-..." (already a slug, unchanged).
// This makes the v4→v5 state migration safe to run on mixed/old state and
// safe to re-run.
//
// Usage rules for new code:
//   - Persisting a lesson reference? Use lessonRef(lesson) → slug.
//   - Persisting a quiz reference?   Use quizRef(lesson, q.id) → global key.
//   - Looking up a lesson by a persisted ref? Use getLessonByRef(ref).
//   - Normalizing an unknown string (could be id or slug)? Use resolveRef(ref).
// ============================================================

import { LESSON_SLUGS, SLUG_TO_ID } from "./lessons-meta-generated";
import { getLessonById } from "./lessons-data";
import type { Lesson, QuizQuestion } from "./types";

/**
 * Returns the stable slug for a lesson object.
 * Priority: lesson.slug (explicit) → LESSON_SLUGS[lesson.id] (generated) → lesson.id (fallback).
 */
export function lessonSlug(lesson: { id: string; slug?: string }): string {
  return lesson.slug ?? LESSON_SLUGS[lesson.id] ?? lesson.id;
}

/**
 * Normalizes ANY lesson reference string to its canonical slug form.
 *   - If `ref` is already a slug → returned unchanged.
 *   - If `ref` is a positional id with a known slug → returns the slug.
 *   - If `ref` is unknown → returned unchanged (graceful passthrough; avoids
 *     dropping user data for lessons that may have been removed from content).
 *
 * IDEMPOTENT: resolveRef(resolveRef(x)) === resolveRef(x).
 */
export function resolveRef(ref: string): string {
  // Already a slug?
  if (SLUG_TO_ID[ref]) return ref;
  // A positional id we can map?
  const slug = LESSON_SLUGS[ref];
  if (slug) return slug;
  // Unknown — pass through (could be a slug not in the generated map, e.g.
  // a brand-new lesson whose content hasn't been generated yet).
  return ref;
}

/**
 * Returns true if `ref` is a known lesson reference (either a positional id
 * or a slug that resolves to a real lesson).
 */
export function isKnownLessonRef(ref: string): boolean {
  return !!(SLUG_TO_ID[ref] || LESSON_SLUGS[ref]);
}

/**
 * Computes the globally-unique quiz key for a question in a lesson.
 * Format: `${lessonSlugWithDots}.${qId}` where lessonSlugWithDots is the
 * lesson slug with hyphens replaced by dots.
 *   e.g. lessonSlug "python-variables-and-data-types", qId "q1"
 *        → "python.variables.and.data.types.q1"
 *
 * If the QuizQuestion has an explicit `slug` field, that is used directly.
 */
export function quizRef(lesson: { id: string; slug?: string }, qId: string): string {
  const slug = lessonSlug(lesson);
  return `${slug.replace(/-/g, ".")}.${qId}`;
}

/** Overload: accepts a QuizQuestion with an explicit slug. */
export function quizRefFromQuestion(
  lesson: { id: string; slug?: string },
  q: Pick<QuizQuestion, "id" | "slug">,
): string {
  return q.slug ?? quizRef(lesson, q.id);
}

/**
 * Normalizes ANY quiz key to its canonical global form.
 *   - Old format "python-05:q1"  → "python.variables.and.data.types.q1" (if python-05 maps to that slug)
 *   - New format "python.variables.q1" → unchanged (already canonical)
 *   - Unknown → unchanged (passthrough, avoids data loss)
 *
 * IDEMPOTENT.
 */
export function resolveQuizRef(ref: string): string {
  // Already new format (no colon)? Assume canonical, return as-is.
  if (!ref.includes(":")) return ref;
  // Old format: split on the LAST colon (lessonId : qId).
  const lastColon = ref.lastIndexOf(":");
  if (lastColon < 0) return ref;
  const lessonPart = ref.slice(0, lastColon);
  const qPart = ref.slice(lastColon + 1);
  // Resolve the lesson part (could be a positional id or already a slug).
  const slug = resolveRef(lessonPart);
  return `${slug.replace(/-/g, ".")}.${qPart}`;
}

/**
 * Parses a global quiz key back into its lesson slug + local question id.
 *   "python.variables.and.data.types.q1"
 *     → { lessonSlug: "python-variables-and-data-types", questionId: "q1" }
 *
 * The question id is always the LAST dot-segment (q1..q10 never contain dots).
 * The lesson slug is reconstructed by joining the remaining segments with hyphens.
 * For old-format keys ("python-05:q1"), the lesson part is resolved via resolveRef.
 */
export function parseQuizRef(ref: string): { lessonSlug: string; questionId: string } {
  if (ref.includes(":")) {
    // Old format — resolve then recurse.
    const canonical = resolveQuizRef(ref);
    return parseQuizRef(canonical);
  }
  const parts = ref.split(".");
  if (parts.length < 2) {
    return { lessonSlug: ref, questionId: "" };
  }
  const questionId = parts[parts.length - 1];
  const lessonSlugDotted = parts.slice(0, -1).join("-");
  return { lessonSlug: lessonSlugDotted, questionId };
}

/**
 * Resolves a lesson reference (slug OR positional id) to the in-memory Lesson
 * object. Returns undefined if not found (e.g. lesson removed from content,
 * or lessons not yet loaded).
 */
export function getLessonByRef(ref: string | null | undefined): Lesson | undefined {
  if (!ref) return undefined;
  // If ref is a slug, resolve to positional id for LESSON_MAP lookup.
  const positionalId = SLUG_TO_ID[ref] ?? ref;
  return getLessonById(positionalId) ?? getLessonById(ref);
}

/**
 * Returns the track id for a lesson reference (slug or positional id).
 * Uses the generated slug map (no need to load the 10MB content bundle).
 * Returns "" if the ref is unknown.
 */
export function trackIdForRef(ref: string): string {
  const slug = resolveRef(ref);
  // Slugs are formatted as `${trackId}-...`. The track id is the first hyphen-
  // separated segment — EXCEPT for track ids that contain no hyphen (all current
  // track ids are single words: python, javascript, nextjs, etc.). So splitting
  // on the first hyphen is safe.
  const hyphenIdx = slug.indexOf("-");
  return hyphenIdx > 0 ? slug.slice(0, hyphenIdx) : slug;
}

// ============================================================
// v6.1.0: Spec-aligned aliases.
//
// The v6.0.0 release shipped the helpers above under short names
// (resolveRef, getLessonByRef, quizRef, resolveQuizRef). The v6.1.0
// migration spec requests the longer, more explicit names below as the
// public API. These aliases point to the same implementations — both
// names work, so existing call sites (in store.ts, LearnView.tsx, etc.)
// remain valid and new code can use either form.
// ============================================================

/** v6.1.0 alias for resolveRef(). Normalizes any lesson reference to its canonical slug. */
export const resolveLessonReference = resolveRef;

/** v6.1.0 alias for getLessonByRef(). Resolves a lesson reference to the in-memory Lesson object. */
export const getLessonByReference = getLessonByRef;

/** v6.1.0 alias for quizRef(). Computes the globally-unique quiz key for a question. */
export const quizReference = quizRef;

/** v6.1.0 alias for resolveQuizRef(). Normalizes any quiz key to its canonical global form. */
export const resolveQuizReference = resolveQuizRef;
