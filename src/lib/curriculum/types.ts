// ============================================================
// curriculum/types.ts — v6.004 Final Curriculum Architecture.
//
// This module defines the TYPES ONLY for the scalable curriculum
// model. No content is populated here — that lives in the catalog
// files (module-catalog.ts, track-config.ts, assessments.ts,
// capstones.ts) and, eventually, in per-track content authored by
// content writers.
//
// DESIGN PRINCIPLES:
//   1. Additive only. The existing `Lesson` type (src/lib/types.ts)
//      is EXTENDED with optional fields, never restructured. Existing
//      21-lesson tracks keep working unchanged.
//   2. Modules are first-class. A Module is a canonical, reusable
//      unit (e.g. "functions", "o_op", "testing") that every language
//      track picks from. Module identity is a stable slug.
//   3. Stable identity everywhere. Modules, capstones, assessments,
//      and projects all have permanent slugs — reordering never
//      breaks user progress (same principle as v6.000 lesson slugs).
//   4. Flexibility for 30+ languages. Each track declares which
//      modules apply and which are optional. A query language (SQL)
//      skips OOP; a markup language (HTML) skips generics.
//   5. Forward-looking. Fields for AI tutoring, skill progression,
//      multiple capstones, tiered projects, and a graduated
//      assessment ladder are all in the schema from day one.
// ============================================================

// ----------------------------------------------------------------
// Difficulty
// ----------------------------------------------------------------

/** Coarse difficulty band (backward-compat with the existing Lesson.difficulty). */
export type CurriculumDifficulty = "beginner" | "intermediate" | "advanced";

/** Fine-grained difficulty 1-5 (1 = absolute beginner, 5 = expert). */
export type DifficultyScore = 1 | 2 | 3 | 4 | 5;

// ----------------------------------------------------------------
// Module taxonomy
// ----------------------------------------------------------------

/**
 * Canonical module categories. Every module in the catalog belongs to
 * exactly one category. Categories drive the UI grouping in the Learn
 * tab (e.g. "Core Language", "Advanced Topics", "Professional Skills").
 */
export type ModuleCategory =
  | "foundation" // getting-started, setup, syntax, variables, operators, io
  | "core-language" // control-flow, loops, functions, collections, strings
  | "organization" // modules, files, error-handling
  | "paradigms" // oop, functional, generics, metaprogramming
  | "advanced-language" // memory, concurrency, async, interop
  | "professional" // networking, databases, testing, debugging, performance, security, best-practices, tooling
  | "application" // real-projects, capstones
  | "framework" // web-frameworks, deployment-devops (optional, framework-specific)
  | "extension"; // community, ecosystem extras (optional)

/**
 * Language archetypes. A module declares which archetypes it applies
 * to. A track's config then includes/excludes modules based on its
 * archetype — e.g. a "query-language" track skips OOP and generics.
 */
export type LanguageArchetype =
  | "all" // applies to every language
  | "compiled" // C, C++, Go, Rust, Java, Swift, Kotlin, C#
  | "interpreted" // Python, JavaScript, Ruby, PHP, R, Bash, Dart
  | "web" // HTML, CSS, React, Vue, Svelte, Angular, Next.js, Tailwind, Express, Node.js
  | "systems" // C, C++, Rust, Go
  | "jvm" // Java, Kotlin
  | "functional" // (none currently first-class; future Haskell/Elm/Elixir)
  | "query-language" // SQL, PostgreSQL, MongoDB, GraphQL
  | "markup" // HTML, CSS, Tailwind
  | "container" // Docker, Kubernetes, Terraform
  | "ml-framework"; // PyTorch, TensorFlow

/**
 * A canonical curriculum module. Modules are defined ONCE in the
 * catalog and referenced by every track that includes them. This is
 * the "course structure" that scales from 21 to 100-150+ lessons.
 *
 * Example modules: "getting-started", "basic-syntax", "functions",
 * "o_op", "testing", "final-capstone".
 */
export type CurriculumModule = {
  /** Permanent slug, e.g. "c_functions". Prefix `c_` avoids collisions with lesson slugs. */
  slug: string;
  /** Human title, e.g. "Functions". */
  title: string;
  /** One-sentence description of what the module covers. */
  description: string;
  /** Emoji icon for UI display. */
  icon: string;
  /** Coarse difficulty band (most modules are a single band). */
  difficulty: CurriculumDifficulty;
  /** Fine-grained difficulty (average of its lessons). */
  difficultyScore: DifficultyScore;
  /** Canonical sequence number (1-based). Tracks may reorder, but this is the default. */
  sequence: number;
  /** Category for UI grouping. */
  category: ModuleCategory;
  /** Estimated hours to complete all required lessons in this module. */
  estimatedHours: number;
  /** Whether this module is optional by default (tracks may override). */
  optionalByDefault: boolean;
  /** Module slugs that must be substantially complete before starting this one. */
  requiredModules: string[];
  /** Skill ids unlocked by completing this module. */
  skillsUnlocked: string[];
  /** If this module contains a capstone, which tier. */
  capstoneTier?: CapstoneTierId;
  /** Whether completing this module counts toward the track certificate. */
  certificateEligible: boolean;
  /** Whether this module includes a module-level quiz. */
  hasModuleQuiz: boolean;
  /** Whether this module ends with a checkpoint exam (harder, cumulative). */
  hasCheckpointExam: boolean;
  /** Language archetypes this module applies to. */
  appliesTo: LanguageArchetype[];
  /** Architecture version of this module definition. */
  version: string;
};

// ----------------------------------------------------------------
// Capstone tiers
// ----------------------------------------------------------------

/**
 * Capstone tier identifiers. A track may offer multiple capstones,
 * one per tier, so a learner can demonstrate mastery at each level.
 *
 * DESIGN DECISION (multiple capstones): The legacy single-capstone
 * model forced every learner through one final project regardless of
 * their goal. A graduated ladder (beginner → intermediate → advanced
 * → portfolio → career → certification) lets a learner stop where
 * their goal is met and gives the certificate API multiple evidence
 * points. Not every track offers every tier — e.g. a markup language
 * may only offer beginner + portfolio.
 */
export type CapstoneTierId =
  | "beginner" // end of foundation modules — first non-trivial program
  | "intermediate" // end of core-language + organization — integrated app
  | "advanced" // end of paradigms + advanced-language — systems-level work
  | "portfolio" // a polished, shareable project for a portfolio
  | "career" // a project simulating a real job-task / take-home
  | "certification"; // the final, certificate-gating capstone

/** Definition of a capstone tier (catalog-level, not per-track). */
export type CapstoneTier = {
  id: CapstoneTierId;
  title: string;
  description: string;
  /** Difficulty band. */
  difficulty: CurriculumDifficulty;
  difficultyScore: DifficultyScore;
  /** Roughly how many hours a learner should spend. */
  estimatedHours: number;
  /** Which module category this tier typically follows. */
  followsCategory: ModuleCategory;
  /** Whether this tier is required for the track certificate. */
  certificateRequired: boolean;
  /** UI icon. */
  icon: string;
};

// ----------------------------------------------------------------
// Assessment ladder
// ----------------------------------------------------------------

/**
 * Assessment level identifiers. The curriculum uses a graduated
 * assessment ladder: low-stakes per-lesson quizzes build to
 * high-stakes certificate exams, with module quizzes and checkpoint
 * exams in between.
 *
 *   lesson-quiz      → 3-5 questions, instant feedback, retake freely
 *   module-quiz      → 8-12 questions, covers one module, retake freely
 *   checkpoint-exam  → 20-30 questions, cumulative across modules, timed
 *   practice-exam    → full-length mock, no stakes, optional
 *   capstone-eval    → project evaluation (AI + self + peer future)
 *   certificate-exam → final gated exam, pass required for certificate
 */
export type AssessmentLevelId =
  | "lesson-quiz"
  | "module-quiz"
  | "checkpoint-exam"
  | "practice-exam"
  | "capstone-evaluation"
  | "certificate-exam";

/** Definition of an assessment level (catalog-level). */
export type AssessmentLevel = {
  id: AssessmentLevelId;
  title: string;
  description: string;
  /** Number of questions (range; capstone-eval uses criteria instead). */
  questionCount: { min: number; max: number };
  /** Whether the assessment is timed. */
  timed: boolean;
  /** Pass mark (0-100). lesson-quiz is low to encourage attempt; certificate-exam is high. */
  passMark: number;
  /** Whether the result counts toward the certificate. */
  certificateWeight: number; // 0-100 (relative; normalized per track)
  /** Whether retakes are unlimited. */
  unlimitedRetakes: boolean;
  /** UI icon. */
  icon: string;
};

// ----------------------------------------------------------------
// Projects (enhanced, independent learning objects)
// ----------------------------------------------------------------

/**
 * Project tier. Projects are independent learning objects (not bound
 * to a single lesson). A track's modules reference projects by id;
 * the Projects tab renders them all.
 */
export type ProjectTier = "foundational" | "core" | "capstone" | "stretch";

/**
 * A curriculum project. Independent of any single lesson — linked
 * to modules and capstone tiers instead. The existing `Project` type
 * in projects-data.ts remains the runtime shape; this type adds the
 * curriculum-linkage fields.
 */
export type CurriculumProject = {
  /** Permanent slug, e.g. "p_python-cli-todo". */
  slug: string;
  title: string;
  description: string;
  /** Difficulty band. */
  difficulty: CurriculumDifficulty;
  difficultyScore: DifficultyScore;
  /** Tier within the project ladder. */
  tier: ProjectTier;
  /** Which capstone tier this project satisfies (if any). */
  capstoneTier?: CapstoneTierId;
  /** Estimated hours. */
  estHours: number;
  /** Language ids this project can be built in. */
  languages: string[];
  /** Career ids this project is relevant to. */
  careers: string[];
  /** Skill ids demonstrated by this project. */
  skills: string[];
  /** Module slugs whose completion is recommended before starting. */
  recommendedModules: string[];
  /** Lesson refs (slugs) that should be complete first. */
  prerequisiteLessons?: string[];
  /** Concrete deliverables the learner must produce. */
  deliverables: string[];
  /** Optional stretch goals for advanced learners. */
  stretchGoals?: string[];
  /** Evaluation criteria (used by capstone-evaluation assessment). */
  evaluationCriteria: string[];
  /** Skills explicitly assessed by this project. */
  skillsAssessed: string[];
  /** Tags for search/filter. */
  tags: string[];
};

// ----------------------------------------------------------------
// Track configuration
// ----------------------------------------------------------------

/**
 * A track's module entry. Declares which canonical module this track
 * includes, in what order, and whether it's optional for this track.
 */
export type CurriculumTrackModule = {
  /** References CurriculumModule.slug. */
  moduleSlug: string;
  /** Display order within this track (1-based). */
  order: number;
  /** Whether this module is optional FOR THIS TRACK (overrides the module's optionalByDefault). */
  optional: boolean;
};

/**
 * Per-track curriculum configuration. Declares which modules the
 * track includes, which capstone tiers it offers, and the
 * certificate requirements. This is what a content author fills in
 * when adding a new track — NOT lesson content.
 */
export type CurriculumTrackConfig = {
  /** Track id (e.g. "python"). References ALL_LANGUAGE_INFO. */
  trackId: string;
  /** Language archetype — drives module defaults. */
  archetype: LanguageArchetype;
  /** The modules this track includes, in order. */
  modules: CurriculumTrackModule[];
  /** Capstone tiers this track offers (subset of all tiers). */
  capstonesOffered: CapstoneTierId[];
  /** How many modules (non-optional) must be complete for the certificate. */
  certificateRequiredModuleCount: number;
  /** Which capstone tiers are required for the certificate. */
  certificateRequiredCapstones: CapstoneTierId[];
  /** The default assessment type for lessons in this track. */
  defaultAssessment: AssessmentLevelId;
  /** Whether this track has a final certificate exam (in addition to capstones). */
  hasCertificateExam: boolean;
};

// ----------------------------------------------------------------
// AI architecture (forward-looking, no content populated)
// ----------------------------------------------------------------

/**
 * Per-module AI context. Mirrors LessonAIContext but at module
 * granularity — lets the AI Tutor give module-level guidance without
 * loading every lesson's context.
 */
export type ModuleAIContext = {
  /** 200-400 char summary of the module for AI system prompts. */
  summary: string;
  /** 3-5 key concepts the AI should emphasize across this module. */
  keyConcepts?: string[];
  /** Common cross-lesson misconceptions. */
  commonMisconceptions?: { misconception: string; correction: string }[];
  /** Suggested Socratic questions the AI can ask. */
  suggestedQuestions?: string[];
  /** Pre-computed embedding of the module summary (build-time artifact). */
  embedding?: number[];
  /** Embedding model + version (for cache invalidation). */
  embeddingModel?: string;
  embeddingVersion?: string;
};

/**
 * Capstone AI evaluation context. Describes how the AI should
 * evaluate a capstone submission (criteria, rubric, tone). Populated
 * per capstone tier — NOT per submission.
 */
export type CapstoneAIEvalContext = {
  /** The evaluation rubric as structured criteria. */
  rubric: {
    criterion: string;
    weight: number; // 0-1, sums to 1 across all criteria
    description: string;
  }[];
  /** Tone/persona for the evaluator (e.g. "senior staff engineer"). */
  evaluatorPersona?: string;
  /** Example pass/fail boundary description. */
  passBoundary: string;
};
