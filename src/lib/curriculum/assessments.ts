// ============================================================
// curriculum/assessments.ts — v6.004 Assessment Ladder.
//
// Defines the 6 assessment levels. Lessons/modules declare which
// level they use; the Learn tab and certificate API read these to
// determine weights and pass marks.
//
// The ladder is graduated: low-stakes per-lesson quizzes build to
// high-stakes certificate exams, with module quizzes and checkpoint
// exams in between. This keeps beginners unblocked while ensuring
// certificate holders have passed real verification.
// ============================================================

import type { AssessmentLevel } from "./types";

export const ASSESSMENT_LEVELS: AssessmentLevel[] = [
  {
    id: "lesson-quiz",
    title: "Lesson Quiz",
    description: "3-5 questions at the end of a lesson. Instant feedback. Retake freely. Low stakes — the goal is learning, not gating.",
    questionCount: { min: 3, max: 5 },
    timed: false,
    passMark: 70,
    certificateWeight: 0,
    unlimitedRetakes: true,
    icon: "📝",
  },
  {
    id: "module-quiz",
    title: "Module Quiz",
    description: "8-12 questions covering one module. Retake freely. Confirms the learner absorbed the module as a whole.",
    questionCount: { min: 8, max: 12 },
    timed: false,
    passMark: 75,
    certificateWeight: 10,
    unlimitedRetakes: true,
    icon: "📦",
  },
  {
    id: "checkpoint-exam",
    title: "Checkpoint Exam",
    description: "20-30 cumulative questions across several modules. Timed. A harder milestone that catches gaps before the learner moves on.",
    questionCount: { min: 20, max: 30 },
    timed: true,
    passMark: 75,
    certificateWeight: 20,
    unlimitedRetakes: true,
    icon: "🚧",
  },
  {
    id: "practice-exam",
    title: "Practice Exam",
    description: "A full-length mock of the certificate exam. No stakes. Optional but recommended before the real exam.",
    questionCount: { min: 40, max: 60 },
    timed: true,
    passMark: 75,
    certificateWeight: 0,
    unlimitedRetakes: true,
    icon: "🏋️",
  },
  {
    id: "capstone-evaluation",
    title: "Capstone Evaluation",
    description: "Project evaluation against a structured rubric. AI-assisted with self-assessment. Replaces a quiz for capstone lessons.",
    questionCount: { min: 0, max: 0 },
    timed: false,
    passMark: 80,
    certificateWeight: 30,
    unlimitedRetakes: true,
    icon: "🏗️",
  },
  {
    id: "certificate-exam",
    title: "Certificate Exam",
    description: "The final gated exam. Comprehensive, timed, limited retakes. Must pass to earn the track certificate.",
    questionCount: { min: 50, max: 80 },
    timed: true,
    passMark: 80,
    certificateWeight: 40,
    unlimitedRetakes: false,
    icon: "🎓",
  },
];

export const ASSESSMENT_LEVEL_MAP: Record<string, AssessmentLevel> = Object.fromEntries(
  ASSESSMENT_LEVELS.map((a) => [a.id, a]),
);

export function getAssessmentLevel(id: string): AssessmentLevel | undefined {
  return ASSESSMENT_LEVEL_MAP[id];
}
