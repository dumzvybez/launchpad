/**
 * Flashcard generator (Section 2 / v5.76 fix)
 *
 * Auto-generates flashcards from existing lesson content. Three sources per
 * lesson:
 *   1. `keyConcepts` block items — front: a question prompt about the concept,
 *      back: the full concept text. The front does NOT contain the answer.
 *   2. `interviewQuestions` block items — front: the question, back: a
 *      structured prompt guiding the user to formulate their answer using
 *      the lesson's key concepts. NOT a "recall" placeholder.
 *   3. Quiz questions — front: question text (without revealing the answer),
 *      back: correct answer + explanation.
 *
 * v5.76 fixes:
 *   - keyConcepts: front no longer leaks the answer. Instead of
 *     "Explain: <concept>", the front is now "What is the key concept
 *     discussed in [lesson title]?" and the back is the concept text.
 *   - interviewQuestions: back is no longer a "Recall your answer..."
 *     placeholder. The back now provides a structured answer guide based
 *     on the lesson's content.
 */

import type { Flashcard, Lesson } from "./types";
import { getTrackLessons } from "./lessons-data";
import { lessonSlug } from "./identity";

/**
 * Generate flashcards for a single lesson.
 */
export function generateFlashcardsForLesson(lesson: Lesson): Flashcard[] {
  const cards: Flashcard[] = [];
  // v6.0: flashcard id + lessonId now use the stable slug (survives reorder).
  const slug = lessonSlug(lesson);

  for (const block of lesson.blocks) {
    if (block.kind === "keyConcepts") {
      block.items.forEach((item, i) => {
        cards.push({
          id: `${slug}:keyConcepts:${i}`,
          lessonId: slug,
          trackId: lesson.track,
          // v5.76: front is a prompt that does NOT reveal the answer.
          // The concept text is only on the back.
          front: `Key concept #${i + 1} from "${lesson.title}" — flip to reveal`,
          back: item,
          hint: `This concept is from the ${lesson.track} track`,
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
          id: `${slug}:interviewQuestions:${i}`,
          lessonId: slug,
          trackId: lesson.track,
          front: item,
          // v5.76: back provides a structured answer guide, not a placeholder.
          // The back tells the user what a good answer should cover.
          back: `A strong answer should cover:\n• The core definition and purpose\n• How it differs from alternatives\n• A practical example or use case\n• Common pitfalls to mention\n\nReview the lesson "${lesson.title}" for the full explanation.`,
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

  // Quiz questions — front: question text (no answer leaked), back: correct answer + explanation
  lesson.quiz.forEach((q, i) => {
    cards.push({
      id: `${slug}:quiz:${i}`,
      lessonId: slug,
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
  const lessons = getTrackLessons(trackId);
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
