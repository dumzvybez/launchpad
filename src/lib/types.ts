// ============================================================
// Core domain types for the Launchpad public coding education platform
// ============================================================

export type PhaseColor =
  | "teal"
  | "violet"
  | "amber"
  | "rose"
  | "emerald"
  | "sky";

export type ResourceLink = {
  label: string;
  url: string;
  kind?: "doc" | "video" | "course" | "book" | "tool" | "article";
};

export type Task = {
  id: string;
  title: string;
  /** Why this matters — the explicit rationale */
  why: string;
  /** What to actually do */
  brief: string;
  /** Atomic checklist of substeps */
  steps?: string[];
  /** Estimated time in minutes */
  estMinutes: number;
  /** XP reward — milestones only fire celebrations */
  xp: number;
  /** Task IDs that must be done first */
  dependencies?: string[];
  resources?: ResourceLink[];
  /** Optional tags like "core", "stretch", "project" */
  tags?: string[];
  /** Optional code sample shown in task detail with a "Try in Playground" button */
  codeExample?: {
    language: "javascript" | "typescript" | "python";
    code: string;
    filename?: string;
  };
};

export type Module = {
  id: string;
  title: string;
  description: string;
  /** Estimated days to complete at ~2 hours/day */
  estDays: number;
  tasks: Task[];
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  xp: number;
};

// v5.79 fix: Project type is now defined in projects-data.ts (the authoritative
// source) and re-exported here for backward compatibility. Previously both
// files defined their own `Project` type with different shapes, causing type
// mismatches that required `ignoreBuildErrors: true`.
// v6.006 fix: import the type so it is available within this file (line 85:
// Phase.projects uses Project[]). `export type` alone re-exports for consumers
// but does not bind the name in the current module scope.
import type { Project, ProjectDifficulty } from "./projects-data";
export type { Project, ProjectDifficulty };

export type Phase = {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  color: PhaseColor;
  icon: string;
  /** Total estimated weeks at ~14 hr/week */
  estWeeks: number;
  /** Phase IDs that must be substantially complete first */
  dependsOn?: string[];
  objectives: string[];
  outcomes: string[];
  skills: { name: string; level: "intro" | "working" | "solid" }[];
  modules: Module[];
  milestones: Milestone[];
  projects: Project[];
};

// ============================================================
// Personalization engine types
// ============================================================

export type CareerId =
  | "software-engineering"
  | "web-dev"
  | "cloud-devops"
  | "data-science"
  | "ai-ml"
  | "cybersecurity"
  | "mobile-dev"
  | "game-dev"
  | "hardware-embedded";

export type SoftwareEngineeringSubPath =
  | "general"
  | "backend"
  | "frontend"
  | "fullstack"
  | "devops";

export type CareerInfo = {
  id: CareerId;
  label: string;
  /** Short tagline shown in career picker */
  tagline: string;
  /** What the career does (paragraph for detail panel) */
  description: string;
  /** Languages/frameworks recommended for this career (ids from LANGUAGES) */
  recommendedLanguages: string[];
  /** Other useful skills (non-language) */
  skills: string[];
  /** Demand level 1-5 */
  demand: 1 | 2 | 3 | 4 | 5;
  /** Salary range text */
  salaryRange: string;
  /** Top employers */
  topCompanies: string[];
  /** Tags for grouping */
  category: "engineering" | "data" | "systems" | "creative";
  /** Optional sub-paths (only software-engineering for now) */
  subPaths?: { id: string; label: string; description: string }[];
};

export type LanguageInfo = {
  id: string;
  name: string;
  type: "language" | "framework" | "tool";
  /** Parent language if framework (e.g. React -> JavaScript) */
  parentLanguage?: string;
  /** Short tagline */
  tagline: string;
  /** What it is (paragraph) */
  description: string;
  /** Demand 1-5 */
  demand: 1 | 2 | 3 | 4 | 5;
  /** Salary impact text */
  salaryImpact: string;
  /** Common use cases */
  useCases: string[];
  /** Difficulty 1-5 (5 = hardest) */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Learning curve text */
  learningCurve: string;
  /** Trend: rising / stable / declining */
  trend: "rising" | "stable" | "declining";
  /** Top companies using */
  topCompanies: string[];
  /** Careers this language is most relevant to */
  careers: CareerId[];
  /** Icon (emoji or short text) */
  icon: string;
  /** Accent color (hex) */
  color: string;
  /** Companion language ids (when this is a framework, e.g. React -> [javascript, typescript]) */
  companions?: string[];
  /** True if this framework handles both frontend & backend (Next.js, Django, etc.) */
  fullstack?: boolean;
};

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type OccupationInfo = {
  id: string;
  label: string;
  /** Adjusts pace: 'student' = more depth, 'professional' = condensed */
  pace: "foundational" | "condensed";
  description: string;
};

export type PersonalizationInput = {
  name: string;
  careerId: CareerId;
  subPath?: string;
  occupationId: string; // v5.85 (6.4): should be keyof typeof OCCUPATION_MAP
  selectedLanguageIds: string[];
  skillLevel: SkillLevel;
  hoursPerDay: number;
  daysPerWeek: number;
};

export type GeneratedPhase = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: PhaseColor;
  icon: string;
  estWeeks: number;
  objectives: string[];
  /** v5.91 (Part 2): If this phase was auto-injected as a prerequisite,
   * this field lists which selected languages required it. */
  autoInjectedFor?: string[];
  /** v5.91 (Part 3): If this phase is a lesson-backed language phase,
   * this contains the real lesson content grouped into modules. */
  lessonGroups?: LessonGroup[];
  modules: {
    id: string;
    title: string;
    description: string;
    tasks: {
      id: string;
      title: string;
      why: string;
      brief: string;
      steps?: string[];
      estMinutes: number;
      xp: number;
      tags?: string[];
      codeExample?: Task["codeExample"];
      /** Optional: link to a Launchpad lesson (e.g. "py-01", "js-03") */
      lessonId?: string;
    }[];
  }[];
};

export type GeneratedRoadmap = {
  careerId: CareerId;
  careerLabel: string;
  subPath?: string;
  languageIds: string[];
  totalWeeks: number;
  totalHours: number;
  phases: GeneratedPhase[];
  generatedAt: string;
  /** Source of the generated roadmap (always "deterministic" since v5.923) */
  source?: RoadmapSource;
};

// ============================================================
// v5.91 (Part 3): Lesson groups for roadmap phase display
// ============================================================

/** A group of lessons within a language's roadmap phase. */
export type LessonGroup = {
  /** Module title, e.g., "Module 1: Foundations" */
  title: string;
  /** Brief description of what this module covers */
  description: string;
  /** The lesson IDs in this group (e.g., ["python-01", "python-02", ...]) */
  lessonIds: string[];
  /** The lesson numbers (1-indexed) for display */
  lessonNumbers: number[];
};

// ============================================================
// User state types — what we persist
// ============================================================

export type TaskState = {
  /** ISO date string when completed */
  completedAt?: string;
  /** minutes actually spent */
  timeSpent?: number;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
};

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  wins: string;
  blockers: string;
  tomorrow: string;
  createdAt: string;
};

export type ProjectTracker = {
  projectId: string;
  status: "planned" | "in_progress" | "shipped" | "abandoned";
  repoUrl?: string;
  liveUrl?: string;
  notes?: string;
  startedAt?: string;
  shippedAt?: string;
  /** v5.925: ISO timestamp when the project was AI-verified. A project counts
   * toward Career Readiness Score only if this is set (AI-Verify flow). */
  verifiedAt?: string;
};

export type FocusSession = {
  id: string;
  startedAt: string;
  durationMinutes: number;
  taskId?: string;
  completed: boolean;
};

export type HabitEntry = {
  date: string; // YYYY-MM-DD
  habits: Record<string, boolean>;
};

export type AchievementBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
  unlockedAt?: string;
};

// ============================================================
// v5.931: Notification Centre — persistent notification history.
// NOTE: per the user's explicit instruction, there is NO read/unread
// state on notifications. The bell-icon badge is a simple COUNT of
// notifications in the history (reset by Clear All), NOT a per-item
// read flag. Snooze mode suppresses POPUPS/toasts but notifications
// are still recorded here and visible in the Centre panel.
// ============================================================
export type NotificationCategory =
  | "achievement"
  | "certificate"
  | "reminder"
  | "system"
  | "challenge";

export type AppNotification = {
  /** Stable unique id (used for dismiss + dedup). */
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /** ISO timestamp of when the notification was recorded. */
  createdAt: string;
  /** Optional emoji/icon glyph rendered in the card header. */
  icon?: string;
  /** Optional deep-link: clicking the notification navigates to this view. */
  actionView?: ViewId;
  /** Optional label for the action link. */
  actionLabel?: string;
};

export type UserProfile = {
  name: string;
  goal: string;
  university: string;
  startDate?: string;
  targetEndDate?: string;
  /** Career chosen during onboarding */
  careerId?: CareerId;
  subPath?: string;
  occupationId?: string;
  skillLevel?: SkillLevel;
  hoursPerDay?: number;
  daysPerWeek?: number;
};

export type LessonProgress = {
  lessonId: string;
  status: "not-started" | "in-progress" | "complete";
  startedAt?: string;
  completedAt?: string;
  /** Best quiz score 0-100 (legacy — still updated for backward compat) */
  bestQuizScore?: number;
  /** Per-question answer tracking (latest attempt). Keyed by `${lessonId}:${questionId}` */
  questionAnswers?: Record<string, { selectedIndex: number; correct: boolean; attemptedAt: string }>;
  /** Number of attempts on this lesson's quiz */
  quizAttempts?: number;
};

// ============================================================
// SM-2 Spaced Repetition (Section 1)
// ============================================================

/** Per-question SM-2 spaced repetition record.
 *
 *  v6.0: The record's KEY in AppState.questionRecords is now the globally-
 *  unique quiz slug (e.g. "python.variables-data-types.q1"), NOT the old
 *  `${lessonId}:${questionId}` composite. The `questionId` field below still
 *  holds the local id ("q1") for backward compat; the global key is derived
 *  via quizRef(lesson, q.id) in src/lib/identity.ts.
 *
 *  v6.0: `trackId` and `lessonSlug` are optional fields populated by the
 *  migration so the Weak Areas selector and quota-prune logic can resolve
 *  records without parsing the key. */
export type QuestionRecord = {
  questionId: string;
  /** v6.0: The lesson slug this question belongs to (e.g. "python-variables-data-types"). */
  lessonSlug?: string;
  /** v6.0: The track id this question belongs to (e.g. "python"). */
  trackId?: string;
  correctCount: number;
  incorrectCount: number;
  lastAttemptDate: string;       // ISO timestamp
  nextReviewDate: string;        // ISO timestamp — when question is "due"
  interval: number;              // days until next review
  easinessFactor: number;        // SM-2 EF, starts at 2.5
  difficulty: "easy" | "medium" | "hard"; // auto-updated based on hit rate
};

// ============================================================
// Flashcards (Section 2)
// ============================================================

export type Flashcard = {
  /** v6.0: Now `${lessonSlug}:${blockKind}:${index}` (slug, not positional id).
   *  Survives lesson reordering. */
  id: string;
  /** v6.0: Now the lesson SLUG (e.g. "python-variables-data-types"), not the positional id. */
  lessonId: string;
  trackId: string;             // language id
  front: string;               // question / prompt
  back: string;                // answer / explanation
  hint?: string;
  source: "keyConcept" | "interviewQuestion" | "quiz";
  // SM-2 fields (same shape as QuestionRecord)
  correctCount: number;
  incorrectCount: number;
  lastAttemptDate?: string;
  nextReviewDate?: string;
  interval: number;
  easinessFactor: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  /** Optional: provider that produced this message */
  provider?: string;
};

export type ChatConversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type AIProviderKey =
  | "gemini"
  | "groq"
  | "openrouter"
  | "openai"
  | "anthropic"
  | "custom";

export type AISettings = {
  provider: AIProviderKey;
  /** User-supplied API key (BYOK — every user must bring their own) */
  apiKey: string;
  /** Endpoint for custom provider */
  customEndpoint?: string;
  model: string;
  temperature: number; // 0.0 - 1.5
};

/** Result source for roadmap generation. v5.923: the deterministic engine is
 * the only generator, so this is always "deterministic". The union is kept
 * for backward-compatibility with roadmaps persisted in older localStorage. */
export type RoadmapSource =
  | "deterministic"
  | "ai-gemini"
  | "ai-groq"
  | "ai-openrouter";

export type RateLimitEntry = {
  timestamp: number; // epoch ms
};

export type AppState = {
  schemaVersion: number;
  /**
   * v6.0: Granular migration tracking. Independent of schemaVersion (which
   * tracks the overall state shape), this records which named migrations
   * have been applied. Each migration is idempotent and checks its own flag
   * before running, so re-running on already-migrated state is a no-op.
   */
  migrations?: {
    /** v6.1 slug migration: lessonProgress/questionRecords/bookmarks/flashcards
     *  keys rewritten from positional ids to stable slugs. Spec flag name. */
    slugMigration?: boolean;
    /** v6.0 legacy flag name for the same migration. Kept for cross-version
     *  compat: v6.1 checks both names so users who migrated under v6.0 are
     *  not re-migrated, and v6.0 still recognizes v6.1-migrated state. */
    v6SlugMigration?: boolean;
  };
  profile: UserProfile;
  tasks: Record<string, TaskState>;
  notes: Note[];
  journal: JournalEntry[];
  projects: ProjectTracker[];
  focusSessions: FocusSession[];
  habits: HabitEntry[];
  badges: AchievementBadge[];
  bookmarks: Bookmark[];
  calendarEvents: CalendarEvent[];
  onboardingCompleted?: boolean;
  /** Day streak counter — increments on any task completed */
  streak: {
    current: number;
    longest: number;
    lastActiveDate?: string;
    freezes: number;
  };
  /** per-day task completion counts for heatmap */
  activity: Record<string, number>;
  /** Per-hour task completion counts (0-23) for time-of-day analytics (Section 8) */
  hourlyActivity: Record<number, number>;
  preferences: {
    theme: "light" | "dark" | "system";
    reduceMotion: boolean;
    focusMode: boolean;
    density: "comfortable" | "compact";
    showSplash: boolean;
    weekStartsOn: 0 | 1;
    /** Background theme id */
    backgroundTheme: string;
    /** Custom background color (when theme = 'custom') */
    customBackground?: string;
    /** First-time tour completed (deprecated v5.923 — tour removed, kept for persisted-state compat) */
    tourCompleted?: boolean;
    /** v5.923: last app version whose release notes the user has seen. Used by
     * VersionUpdateDialog to show "what's new" once per release. */
    lastSeenReleaseVersion?: string;
    /** Whether to show the mobile "use desktop" banner this session */
    mobileBannerDismissed?: boolean;
    /** Whether to hide video supplements in lessons (Section 2.4) */
    hideVideoSupplements?: boolean;
    /** v5.931: Notification Centre snooze — when true, notification POPUPS/toasts
     * are suppressed, but notifications are still recorded in `notifications`
     * and visible in the Centre panel. NOT a read/unread flag. */
    notificationSnooze?: boolean;
  };
  /** Personalized roadmap generated by the engine */
  roadmap?: GeneratedRoadmap;
  /** Lesson progress (keyed by lessonId) */
  lessonProgress: Record<string, LessonProgress>;
  /** AI chat conversations */
  chatConversations: ChatConversation[];
  /** Currently active chat conversation id */
  activeChatId?: string;
  /** AI settings */
  aiSettings: AISettings;
  /** Rate limit timestamps (last 2 hours) */
  rateLimitTimestamps: number[];
  /** Whether user has acknowledged the AI first-time warning */
  aiWarningAcknowledged?: boolean;
  /** Daily challenge state */
  dailyChallenge: {
    lastChallengeDate?: string;
    currentStreak: number;
    completedToday: boolean;
    /** Total number of daily challenges ever completed (lifetime). */
    totalCompleted: number;
  };
  /** Learn tab persistent UI state — fixes the resume bug */
  learnTabState: {
    selectedTrack: string | null;
    selectedLessonId: string | null;
    tab: "tracks" | "lesson" | "quiz" | "result";
  };
  /** v5.925: Flashcards tab persistent UI state — fixes review-position reset
   * on refresh. Mirrors learnTabState. */
  flashcardsTabState: {
    filter: string; // "all" | "due" | trackId
    currentIndex: number;
  };
  /** Per-track certificate metadata (keyed by track id) */
  certificates: Record<string, {
    certId: string;
    issuedAt: string;
    name: string;
    trackId: string;
    trackName: string;
  }>;
  /** Career Master Certificate metadata (if earned) */
  careerCertificate?: {
    certId: string;
    issuedAt: string;
    name: string;
    careerLabel: string;
  };
  /** Daily challenge task pool assigned to this user (from roadmap languages) */
  dailyChallengePool?: string[];
  /** Index into the pool for the current week's challenge rotation */
  dailyChallengeWeekIndex?: number;
  /** Project submissions (capstone uploads with repo URLs) */
  projectSubmissions: ProjectSubmission[];
  /** Active calendar notifications (transient — for snooze/dismiss tracking) */
  activeNotifications: string[];
  /** Auto-backup timestamp */
  lastAutoBackup?: string;
  /** Per-question SM-2 records, keyed by `${lessonId}:${questionId}` (Section 1) */
  questionRecords: Record<string, QuestionRecord>;
  /** Flashcards with SM-2 state (Section 2) */
  flashcards: Flashcard[];
  /** Bookmarked lesson IDs (Section 3) */
  bookmarkedLessons: string[];
  /** v5.875 (CRIT-2): Certificate issuance attempt tracking to prevent infinite retry.
   * Keyed by trackId (language certs) or "__career__" (career cert).
   * Stores count + lastAttempt timestamp. */
  certIssueAttempts: Record<string, { count: number; lastAttempt: number; permanentFail?: boolean }>;
  /** v5.875 (HIGH-3): Actual number of projects assigned to this user's roadmap.
   * Set by ProjectsView on mount via selectProjectsForRoadmap(). Used by
   * selectCareerReadinessScore to compute the projects-completed percentage
   * with the correct denominator (was hardcoded /3, should be /assignedProjectCount). */
  assignedProjectCount?: number;
  /** v5.931: Notification Centre — persistent notification history.
   * Notifications remain listed until explicitly cleared by the user (Clear All
   * or per-item dismiss). No auto-expiry. No read/unread state — the bell badge
   * is a simple count. See AppNotification type above. */
  notifications?: AppNotification[];
};

// ============================================================
// View identifiers
// ============================================================

export type ViewId =
  | "dashboard"
  | "roadmap"
  | "learn"
  | "playground"
  | "daily-challenge"
  | "skill-tree"
  | "notes"
  | "projects"
  | "focus"
  | "analytics"
  | "career"
  | "calendar"
  | "ai-tutor"
  | "community"
  | "tools"
  | "account"
  | "settings"
  | "flashcards";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  category: "resource" | "tool" | "article" | "video" | "course" | "doc" | "inspiration";
  favorited?: boolean;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  duration?: number; // minutes
  type: "study" | "project" | "review" | "deadline" | "break";
  notes?: string;
  completed?: boolean;
  /** Recurrence frequency */
  frequency?: "one-time" | "daily" | "weekly" | "monthly";
  /** For weekly: days of week (0=Sun ... 6=Sat) */
  weekdays?: number[];
  /** For monthly: day of month (1-31) */
  dayOfMonth?: number;
  /** Reminder snooze state: number of minutes snoozed, or undefined if not snoozed */
  snoozedUntil?: string; // ISO timestamp
  /** Whether notification has been shown for the current occurrence */
  notifiedFor?: string; // ISO timestamp of the occurrence that was notified
};

// ============================================================
// Lesson & quiz types
// ============================================================

export type LessonBlock =
  | { kind: "text"; content: string }
  | { kind: "code"; language: string; code: string; caption?: string }
  | { kind: "tip"; content: string }
  | { kind: "warning"; content: string }
  | { kind: "heading"; content: string }
  | { kind: "resources"; links: ResourceLink[] }
  | { kind: "prerequisites"; items: string[] }
  | { kind: "topics"; items: string[] }
  | { kind: "keyConcepts"; items: string[] }
  | { kind: "pitfalls"; items: string[] }
  | { kind: "realWorldApps"; items: string[] }
  | { kind: "interviewQuestions"; items: string[] }
  | { kind: "miniProject"; content: string }
  | { kind: "exercises"; items: string[] }
  | { kind: "whyItMatters"; content: string }
  | { kind: "callout"; content: string; variant: "info" | "success" | "warning" };

export type QuizQuestion = {
  /** Local question id within the lesson, e.g. "q1".."q10". */
  id: string;
  /**
   * v6.0: Optional globally-unique slug, e.g. "python.variables-data-types.q1".
   * When absent, the global key is DERIVED at runtime via quizRef(lesson, q.id)
   * in src/lib/identity.ts. This field is forward-looking: content authors may
   * set it explicitly for questions that need a hand-curated stable identity.
   */
  slug?: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** v6.0: Made effectively required for AI features — the "I don't understand"
   * button sends explanation to the AI Tutor. Kept optional for backward compat. */
  explanation?: string;
  /**
   * v6.0: Content version hash. When a question's text/options/correctIndex
   * change, this hash should change, which lets SM-2 records invalidate
   * cleanly instead of silently attaching to a different question.
   * Forward-looking — not yet populated on existing content.
   */
  versionHash?: string;
  /** v6.0: Forward-looking — supports future multi-select / fill-blank / code-eval. */
  kind?: "single-select" | "multi-select" | "fill-blank" | "code-eval" | "ordering";
  /** v6.0: Skills this question assesses (references Skill.id). Forward-looking. */
  skillsAssessed?: string[];
};

export type Lesson = {
  /**
   * Positional lesson id, e.g. "python-05". Encodes the lesson's `order` and
   * may CHANGE when lessons are reordered. Retained for backward compatibility
   * with existing content and as the in-memory lookup key (LESSON_MAP).
   *
   * v6.0: New code should prefer `slug` (the permanent identity) for any
   * persisted reference. Use lessonRef(lesson) / resolveRef(id) from
   * src/lib/identity.ts to obtain the canonical key.
   */
  id: string;
  /**
   * v6.0: Stable, permanent slug, e.g. "python-variables-and-data-types".
   * Does NOT encode order — survives lesson reorganization. This is the
   * canonical identity for all PERSISTED user state (lessonProgress,
   * questionRecords, bookmarks, flashcards, certificates).
   *
   * For existing lessons, the slug is generated at build time by
   * scripts/gen-lesson-meta.ts and exposed via LESSON_SLUGS in
   * src/lib/lessons-meta-generated.ts. The lessonRef(lesson) helper returns
   * lesson.slug ?? LESSON_SLUGS[lesson.id] ?? lesson.id, so this field is
   * optional — content authors may set it explicitly to override the
   * generated slug.
   */
  slug?: string;
  /** Track id (one of 38 technologies: python, javascript, typescript, ...) */
  track: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  /** v6.0: Forward-looking finer-grained difficulty (1-5). Optional. */
  difficultyNumeric?: 1 | 2 | 3 | 4 | 5;
  estMinutes: number;
  /** Order within track (display order only — NOT identity as of v6.0). */
  order: number;
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
  /** Optional external deep-dive resources */
  deepDiveResources?: ResourceLink[];
  /** v5.937: Topic-based group name (e.g., "Python Basics", "Python Classes", "File Handling").
   * Lessons in the same group must be contiguous in `order`. Used by buildLessonGroups
   * to produce data-driven, variable-count groupings instead of a hardcoded 4-module split. */
  group?: string;
  /** YouTube tutorial video URL for this stage */
  youtubeUrl?: string;
  /** Short paragraph explaining why this stage matters in real-world practice */
  whyItMatters?: string;
  // ---- v6.0: Learning system foundation (Phase 8) — all optional, forward-looking ----
  /** Structured learning objectives (Bloom-aligned). Empty on existing content. */
  learningObjectives?: string[];
  /** Structured prerequisite lesson refs (replaces free-text kind:"prerequisites" block). */
  prerequisiteLessons?: LessonPrerequisiteRef[];
  /** Skills taught in this lesson (references Skill.id). */
  skillsTaught?: LessonSkillRef[];
  // ---- v6.0: AI foundation (Phase 9) — optional, forward-looking ----
  /** Per-lesson AI context bundle. Absent on existing content (AI behaves as before). */
  aiContext?: LessonAIContext;
  /** v6.0: Content version hash for cache invalidation / change detection. */
  versionHash?: string;
  // ---- v6.004: Final curriculum architecture — additive, optional ----
  // All fields below are OPTIONAL. Existing 21-lesson tracks work unchanged
  // (every field defaults to absent). New content authors populate them to
  // opt into the module-based curriculum model. See:
  //   src/lib/curriculum/  (module catalog, track configs, capstones, assessments)
  //   CURRICULUM-ARCHITECTURE.md  (full design doc)
  /** The canonical module this lesson belongs to (references CurriculumModule.slug, e.g. "c_functions"). */
  moduleId?: string;
  /** If this lesson IS a capstone, which tier (references CapstoneTierId). Absent for non-capstone lessons. */
  capstoneTier?: "beginner" | "intermediate" | "advanced" | "portfolio" | "career" | "certification";
  /** The assessment level this lesson uses (references AssessmentLevelId). Defaults to "lesson-quiz" if absent. */
  assessmentLevel?: "lesson-quiz" | "module-quiz" | "checkpoint-exam" | "practice-exam" | "capstone-evaluation" | "certificate-exam";
  /** Whether this lesson is optional (skippable) within its module. Defaults to false. */
  optional?: boolean;
  /** Search keywords for the Command Palette (beyond title + description). */
  searchKeywords?: string[];
  /** Project slugs (references CurriculumProject.slug) this lesson prepares the learner for. */
  projectTags?: string[];
  /** Certificate relevance tags (which certificate(s) this lesson counts toward). */
  certificateTags?: string[];
  /** Career ids this lesson is particularly relevant to. */
  careerTags?: string[];
  /** Computed reading time in minutes (for the lesson header). If absent, derived from estMinutes. */
  readingTimeMinutes?: number;
  /** XP reward override. If absent, the store computes XP from lesson/quiz completion per selectEarnedXP. */
  xpReward?: number;
  /** Content version (semver), for change tracking. */
  curriculumVersion?: string;
  /** Author of this lesson's content (for attribution + future review workflow). */
  author?: string;
  /** ISO date the lesson content was last reviewed by a human. */
  reviewedDate?: string;
  /** Lesson refs (slugs) the learner should complete AFTER this one (forward prerequisites). */
  recommendedAfter?: string[];
  /** Lesson refs (slugs) the learner should complete BEFORE this one (beyond the module's required modules). */
  recommendedBefore?: string[];
  /** Difficulty score 1-5 (finer than the coarse `difficulty` band). */
  difficultyScore?: 1 | 2 | 3 | 4 | 5;
  // ---- v6.005: Lesson experience architecture — additive, optional ----
  // Fields supporting the guided-lesson UI (course sidebar, sectioned flow,
  // skill badges, next-lesson recommendation, interactive practice shells).
  // All optional; existing content unchanged. See components/learning/.
  /** One-line summary for the course sidebar / next-lesson card (≤120 chars). */
  lessonSummary?: string;
  /** Ordered lesson refs (slugs) recommended after this one (curriculum-graph next). */
  recommendedNextLessons?: string[];
  /** Structured practice challenges (architecture shell; rendered by PracticeChallenge). */
  practiceChallenges?: LessonPracticeChallenge[];
  /** Structured interactive code examples (architecture shell; rendered by CodeExample). */
  interactiveExamples?: LessonInteractiveExample[];
};

/**
 * v6.005: A structured practice challenge inside a lesson. Architecture only —
 * the PracticeChallenge component renders the shell; a future phase wires the
 * inline code runner (reusing the Playground infrastructure).
 */
export type LessonPracticeChallenge = {
  /** Stable id within the lesson, e.g. "pc1". */
  id: string;
  title: string;
  prompt: string;
  /** Starter code shown in the editor. */
  starterCode?: string;
  /** Language for syntax highlighting / runner, e.g. "python". */
  language?: string;
  /** Test cases (input → expected output). Empty for free-form challenges. */
  testCases?: { input?: string; expected?: string; hidden?: boolean }[];
  /** Hint shown when the learner is stuck. */
  hint?: string;
  /** Solution (revealed after attempt or on demand). */
  solution?: string;
  /** Skills this challenge exercises. */
  skillsAssessed?: string[];
};

/**
 * v6.005: A structured interactive code example. Architecture only — the
 * CodeExample component renders the shell; a future phase wires the inline
 * runner. Distinct from the `kind:"code"` LessonBlock (which is static).
 */
export type LessonInteractiveExample = {
  id: string;
  title?: string;
  caption?: string;
  code: string;
  language: string;
  /** Whether the learner can edit the code (false = read-only highlighted). */
  editable?: boolean;
  /** Expected output (shown alongside, or used by a future runner). */
  expectedOutput?: string;
  /** AI-generated explanation of the example (forward-looking). */
  explanation?: string;
};

// ============================================================
// v6.0: Learning system foundation types (Phase 8)
// These are FORWARD-LOOKING — the roadmap engine is NOT replaced yet.
// They exist so content authors can begin annotating lessons with
// structured skills, objectives, and prerequisites, and so the AI
// foundation (Phase 9) has typed fields to consume.
// ============================================================

/** First-class Track type. Today tracks are bare string ids; this type
 *  formalizes track-level metadata for future scalability (30+ tracks,
 *  100-150+ lessons each). Not yet populated for existing tracks. */
export type Track = {
  id: string;
  name: string;
  icon: string;
  color: string;
  category?: "language" | "framework" | "database" | "tool";
  summary?: string;
  estimatedTotalHours?: number;
  /** Track ids that must be completed before starting this one. */
  prerequisiteTrackIds?: string[];
  /** Content version (semver), for reproducibility. */
  version?: string;
  lastUpdated?: string;
  tags?: string[];
};

/** A teachable, assessable skill (e.g. "python.variables.scope"). */
export type Skill = {
  id: string;
  trackId: string;
  name: string;
  description: string;
  /** Bloom's taxonomy level 1-6 (remember, understand, apply, analyze, evaluate, create). */
  bloomLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** A directed graph of skills with requires/reinforces/unlocks edges.
 *  This is the foundation for future skill-based progression (replacing
 *  the current linear lesson-1 → lesson-2 → lesson-3 model). NOT yet
 *  consumed by the roadmap engine. */
export type SkillGraph = {
  nodes: Skill[];
  edges: { from: string; to: string; relation: "requires" | "reinforces" | "unlocks" }[];
};

/** A structured reference to a prerequisite lesson (replaces the free-text
 *  kind:"prerequisites" LessonBlock for AI + graph consumption). */
export type LessonPrerequisiteRef = {
  /** Resolvable lesson slug or id. */
  lessonRef: string;
  reason: string;
};

/** A skill taught by a lesson, with the depth at which it's covered. */
export type LessonSkillRef = {
  skillId: string;
  level: "intro" | "working" | "solid";
};

// ============================================================
// v6.0: AI foundation types (Phase 9)
// All OPTIONAL on Lesson — existing content has no aiContext and the
// BYOK /api/chat architecture is unchanged. These fields let future
// content carry structured context the AI Tutor can consume.
// ============================================================

export type LessonHintScaffold = {
  /** 1 = nudge, 2 = analogy, 3 = worked example. */
  level: 1 | 2 | 3;
  hint: string;
};

export type LessonCodeExample = {
  id: string;
  language: string;
  code: string;
  /** What concept this example demonstrates. */
  demonstrates: string;
  explanation: string;
  runnable: boolean;
};

export type LessonAIContext = {
  /** 200-500 char summary for system-prompt injection + future RAG embedding. */
  summary: string;
  /** 3-5 key takeaways for the AI to emphasize. */
  keyTakeaways?: string[];
  /** Optional prefix prepended to the AI Tutor system prompt when this lesson is active. */
  suggestedPromptPrefix?: string;
  /** Structured common misconceptions + corrections (replaces informal pitfalls). */
  commonMisconceptions?: { misconception: string; correction: string }[];
  /** Graduated hints for the "I don't understand" button. */
  hintScaffolding?: LessonHintScaffold[];
  /** Structured code examples for code-aware AI answers. */
  codeExamples?: LessonCodeExample[];
  /** Related lessons for "see also" suggestions (lesson refs). */
  relatedLessons?: { lessonRef: string; relation: "extends" | "contrasts" | "applies" }[];
  /** Pre-computed embedding (build-time artifact, public, anonymous). Lazy-loaded separately. */
  embedding?: number[];
};

// ============================================================
// Daily challenge
// ============================================================

export type DailyChallenge = {
  id: string;
  title: string;
  prompt: string;
  /** Starter code shown in playground */
  starterCode: string;
  language: "javascript" | "python";
  hint: string;
  /** Reference solution (hidden until revealed) */
  solution: string;
  /** Difficulty 1-5 */
  difficulty: 1 | 2 | 3 | 4 | 5;
};

/** Extended daily challenge supporting all 30 tech languages with rich metadata */
export type DailyChallengeTask = {
  id: string;
  title: string;
  description: string;
  /** Language/tech id this task is for (e.g. "python", "javascript", "react") */
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  hint: string;
  /** Reference solution (hidden until revealed) */
  solution: string;
  /** Estimated time in minutes */
  estMinutes: number;
  /** Optional starter code */
  starterCode?: string;
};

/** Project submission record (for capstone project uploads) */
export type ProjectSubmission = {
  projectId: string;
  repoUrl?: string;
  submittedAt: string;
  notes?: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
  /** Check function returns true when earned */
  check?: (state: AppState) => boolean;
};
