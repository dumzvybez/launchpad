// ============================================================
// curriculum/capstones.ts — v6.004 Capstone Tier Catalog.
//
// Defines the 6 capstone tiers. A track offers a SUBSET of these
// via its CurriculumTrackConfig.capstonesOffered.
//
// DESIGN DECISION — multiple capstones:
// The legacy single-capstone model forced every learner through one
// final project. A graduated ladder (beginner → certification) lets
// a learner demonstrate mastery at each level and gives the
// certificate API multiple evidence points. A learner can stop at
// "portfolio" if their goal is a job-ready portfolio, or continue to
// "certification" for the final gated capstone.
// ============================================================

import type { CapstoneTier } from "./types";

export const CAPSTONE_TIERS: CapstoneTier[] = [
  {
    id: "beginner",
    title: "Beginner Capstone",
    description: "A small, self-contained program that uses foundation modules (syntax, variables, control flow, loops). Demonstrates the learner can write working code unaided.",
    difficulty: "beginner",
    difficultyScore: 2,
    estimatedHours: 3,
    followsCategory: "foundation",
    certificateRequired: false,
    icon: "🌱",
  },
  {
    id: "intermediate",
    title: "Intermediate Capstone",
    description: "An integrated application using core-language + organization modules (functions, collections, files, error handling, OOP). Demonstrates the learner can structure a real program.",
    difficulty: "intermediate",
    difficultyScore: 3,
    estimatedHours: 8,
    followsCategory: "organization",
    certificateRequired: false,
    icon: "🌿",
  },
  {
    id: "advanced",
    title: "Advanced Capstone",
    description: "A systems-level project using paradigms + advanced-language modules (generics, memory, concurrency). Demonstrates the learner can reason about performance and safety.",
    difficulty: "advanced",
    difficultyScore: 4,
    estimatedHours: 12,
    followsCategory: "advanced-language",
    certificateRequired: false,
    icon: "🌳",
  },
  {
    id: "portfolio",
    title: "Portfolio Project",
    description: "A polished, shareable project suitable for a public portfolio. Emphasizes best practices, documentation, and a clean README. The learner's showcase piece.",
    difficulty: "advanced",
    difficultyScore: 4,
    estimatedHours: 15,
    followsCategory: "professional",
    certificateRequired: false,
    icon: "💼",
  },
  {
    id: "career",
    title: "Career Project",
    description: "A project simulating a real job task or take-home assignment. Timed, scoped, and evaluated as a hiring manager would. Bridges learning and employment.",
    difficulty: "advanced",
    difficultyScore: 5,
    estimatedHours: 10,
    followsCategory: "professional",
    certificateRequired: false,
    icon: "🎯",
  },
  {
    id: "certification",
    title: "Certification Capstone",
    description: "The final, certificate-gating capstone. Comprehensive, integrates the full track, and must pass AI + rubric evaluation. Required for the track certificate.",
    difficulty: "advanced",
    difficultyScore: 5,
    estimatedHours: 15,
    followsCategory: "application",
    certificateRequired: true,
    icon: "🎓",
  },
];

export const CAPSTONE_TIER_MAP: Record<string, CapstoneTier> = Object.fromEntries(
  CAPSTONE_TIERS.map((t) => [t.id, t]),
);

export function getCapstoneTier(id: string): CapstoneTier | undefined {
  return CAPSTONE_TIER_MAP[id];
}
