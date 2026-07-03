/**
 * Flashcard generator (Section 2)
 *
 * Auto-generates flashcards from existing lesson content. Three sources per
 * lesson:
 *   1. `keyConcepts` block items — front: "Explain: <concept>", back: concept
 *   2. `interviewQuestions` block items — front: question, back: a hint to
 *      recall the answer (the questions are open-ended; we use the question
 *      itself as both front and a prompt on the back)
 *   3. Quiz questions — front: question text, back: correct answer + explanation
 */

import type { Flashcard, Lesson } from "./types";
import { ALL_LESSONS } from "./lessons-data";

/**
 * Generate flashcards for a single lesson.
 */
export function generateFlashcardsForLesson(lesson: Lesson): Flashcard[] {
  const cards: Flashcard[] = [];

  for (const block of lesson.blocks) {
    if (block.kind === "keyConcepts") {
      block.items.forEach((item, i) => {
        cards.push({
          id: `${lesson.id}:keyConcepts:${i}`,
          lessonId: lesson.id,
          trackId: lesson.track,
          front: `Explain: ${item.length > 80 ? item.slice(0, 77) + "…" : item}`,
          back: item,
          source: "keyConcept",
          correctCount: 0,
          incorrectCount: 0,
          interval: 0,
          easinessFactor: 2.5,
        });
      });
    } else if (block.kind === "interviewQuestions") {
      block.items.forEach((item, i) => {
        cards.push({
          id: `${lesson.id}:interviewQuestions:${i}`,
          lessonId: lesson.id,
          trackId: lesson.track,
          front: item,
          back: "Recall your answer, then check the lesson for the full explanation.",
          hint: `From: ${lesson.title}`,
          source: "interviewQuestion",
          correctCount: 0,
          incorrectCount: 0,
          interval: 0,
          easinessFactor: 2.5,
        });
      });
    }
  }

  // Quiz questions — front: question, back: correct answer + explanation
  lesson.quiz.forEach((q, i) => {
    cards.push({
      id: `${lesson.id}:quiz:${i}`,
      lessonId: lesson.id,
      trackId: lesson.track,
      front: q.question,
      back: `Answer: ${q.options[q.correctIndex] ?? "?"}${q.explanation ? `\n\nExplanation: ${q.explanation}` : ""}`,
      hint: `Options: ${q.options.length}`,
      source: "quiz",
      correctCount: 0,
      incorrectCount: 0,
      interval: 0,
      easinessFactor: 2.5,
    });
  });

  return cards;
}

/**
 * Generate flashcards for an entire track (all lessons in that track).
 */
export function generateFlashcardsForTrack(trackId: string): Flashcard[] {
  const lessons = ALL_LESSONS.filter((l) => l.track === trackId);
  const cards: Flashcard[] = [];
  for (const lesson of lessons) {
    cards.push(...generateFlashcardsForLesson(lesson));
  }
  return cards;
}

/**
 * Generate flashcards for multiple tracks (used to bulk-populate when the
 * user first visits the Flashcards tab).
 */
export function generateFlashcardsForTracks(trackIds: string[]): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const id of trackIds) {
    cards.push(...generateFlashcardsForTrack(id));
  }
  return cards;
}

/**
 * Get all flashcards for a track, merging the auto-generated defaults with
 * any SM-2 progress the user has made (stored in AppState.flashcards).
 */
export function getFlashcardsForTrack(
  trackId: string,
  userProgress: Flashcard[],
): Flashcard[] {
  const generated = generateFlashcardsForTrack(trackId);
  const progressMap = new Map(userProgress.map((f) => [f.id, f]));
  return generated.map((f) => progressMap.get(f.id) ?? f);
}
