/**
 * SM-2 Spaced Repetition Algorithm (Sections 1 & 2)
 *
 * Implements the SuperMemo-2 algorithm — the same one Anki uses — for both
 * quiz questions and flashcards.
 *
 * Algorithm reference (per the original SM-2 paper by Piotr Wozniak):
 *   https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 *
 * Prompt audit note (Section 33): the prompt's EF formula was:
 *   EF = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
 * This IS the correct published SM-2 formula (with quality in 0-5). We use
 * quality=5 for correct and quality=2 for incorrect, clamp EF to [1.3, 2.5],
 * and cap the interval at 30 days per the prompt's instructions.
 */

import type { QuestionRecord, Flashcard } from "./types";

/** SM-2 quality grade — 0 (complete blackout) to 5 (perfect). */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const SM2_DEFAULT_EF = 2.5;
export const SM2_MIN_EF = 1.3;
export const SM2_MAX_EF = 2.5;
// v5.85: SM2_MAX_INTERVAL_DAYS = 365 (raised from 30 in v5.77).
// Allows mature cards to graduate to yearly reviews.
export const SM2_MAX_INTERVAL_DAYS = 365;

/**
 * Compute the next SM-2 state given the previous state and a quality grade.
 * Returns a partial record with the updated fields (interval, EF, dates,
 * counts). The caller is responsible for merging these into the existing
 * record (or using them to seed a new one).
 */
export function sm2Update(
  prev: {
    interval: number;
    easinessFactor: number;
    correctCount: number;
    incorrectCount: number;
  } | null,
  quality: SM2Quality,
): {
  interval: number;
  easinessFactor: number;
  correctCount: number;
  incorrectCount: number;
  lastAttemptDate: string;
  nextReviewDate: string;
} {
  const now = new Date();
  const prevEF = prev?.easinessFactor ?? SM2_DEFAULT_EF;
  const prevInterval = prev?.interval ?? 0;
  const correctCount = (prev?.correctCount ?? 0) + (quality >= 3 ? 1 : 0);
  const incorrectCount = (prev?.incorrectCount ?? 0) + (quality < 3 ? 1 : 0);

  // Update easiness factor using the published SM-2 formula.
  let ef = prevEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  ef = Math.max(SM2_MIN_EF, Math.min(SM2_MAX_EF, ef));

  // Compute the new interval.
  // v5.77 fix: second interval is now 6 days per the published SM-2 spec
  // (was 3, which halved the review spacing and doubled review load in the
  // first week). Reference: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
  let interval: number;
  if (quality < 3) {
    // Incorrect — reset to 1 day (immediate re-review).
    interval = 1;
  } else if (prevInterval === 0) {
    interval = 1;
  } else if (prevInterval === 1) {
    interval = 6;
  } else {
    interval = Math.max(1, Math.round(prevInterval * ef));
  }
  // v5.77 fix: raised cap from 30 to 365 days. The 30-day cap forced users to
  // review easy cards every month forever, defeating long-term retention.
  interval = Math.min(interval, SM2_MAX_INTERVAL_DAYS);

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    easinessFactor: ef,
    correctCount,
    incorrectCount,
    lastAttemptDate: now.toISOString(),
    nextReviewDate: nextReview.toISOString(),
  };
}

/**
 * Auto-classify difficulty based on hit rate and attempt count.
 * - `easy` if hitRate >= 80% AND attempts >= 3
 * - `hard` if hitRate < 50% AND attempts >= 3
 * - `medium` otherwise
 */
export function sm2Difficulty(
  correctCount: number,
  incorrectCount: number,
): "easy" | "medium" | "hard" {
  const attempts = correctCount + incorrectCount;
  if (attempts < 3) return "medium";
  const hitRate = correctCount / attempts;
  if (hitRate >= 0.8) return "easy";
  if (hitRate < 0.5) return "hard";
  return "medium";
}

// ============================================================
// Convenience wrappers for quiz questions and flashcards
// ============================================================

/**
 * Record a quiz question attempt and return the updated QuestionRecord.
 * Uses quality=5 for correct, quality=2 for incorrect (per prompt).
 */
export function recordQuestion(
  prev: QuestionRecord | undefined,
  questionId: string,
  correct: boolean,
): QuestionRecord {
  const quality: SM2Quality = correct ? 5 : 2;
  const updated = sm2Update(
    prev
      ? {
          interval: prev.interval,
          easinessFactor: prev.easinessFactor,
          correctCount: prev.correctCount,
          incorrectCount: prev.incorrectCount,
        }
      : null,
    quality,
  );
  return {
    questionId,
    ...updated,
    difficulty: sm2Difficulty(updated.correctCount, updated.incorrectCount),
  };
}

/**
 * Record a flashcard attempt and return the updated Flashcard.
 * Same SM-2 logic as `recordQuestion`, but merged into a Flashcard shape.
 */
export function recordFlashcard(
  prev: Flashcard,
  correct: boolean,
): Flashcard {
  const quality: SM2Quality = correct ? 5 : 2;
  const updated = sm2Update(
    {
      interval: prev.interval,
      easinessFactor: prev.easinessFactor,
      correctCount: prev.correctCount,
      incorrectCount: prev.incorrectCount,
    },
    quality,
  );
  return {
    ...prev,
    ...updated,
  };
}

/**
 * Check whether a question/flashcard is "due" for review today.
 * A card is due if nextReviewDate is in the past (or today), OR if it has
 * never been attempted (interval === 0).
 */
export function isDueForReview(nextReviewDate?: string, interval?: number): boolean {
  if (!nextReviewDate || interval === 0) return true;
  return new Date(nextReviewDate).getTime() <= Date.now();
}
