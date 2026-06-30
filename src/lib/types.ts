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

export type Project = {
  id: string;
  title: string;
  description: string;
  /** Tech the project exercises */
  technologies: string[];
  /** What "done" looks like */
  deliverables: string[];
  /** Which module unlocks this project */
  unlockedBy: string;
  tier: "foundational" | "core" | "capstone";
  /** Optional stretch goals for advanced learners */
  stretchGoals?: string[];
};

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
  occupationId: string;
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
  /** AI refinement notes */
  aiRefinement?: string;
  /** Source of the generated roadmap */
  source?: RoadmapSource;
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

/** Result source for AI roadmap generation */
export type RoadmapSource =
  | "ai-gemini"
  | "ai-groq"
  | "ai-openrouter"
  | "deterministic";

export type RateLimitEntry = {
  timestamp: number; // epoch ms
};

export type AppState = {
  schemaVersion: number;
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
    /** First-time tour completed */
    tourCompleted?: boolean;
    /** Whether to show the mobile "use desktop" banner this session */
    mobileBannerDismissed?: boolean;
    /** Whether to hide video supplements in lessons (Section 2.4) */
    hideVideoSupplements?: boolean;
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
};

// ============================================================
// View identifiers
// ============================================================

export type ViewId =
  | "dashboard"
  | "roadmap"
  | "learn"
  | "playground"
  | "skill-tree"
  | "daily-challenge"
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
  | "settings";

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
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  /** Track id (one of 30 technologies: python, javascript, typescript, html, css, sql, java, c, cpp, csharp, go, rust, swift, kotlin, php, ruby, r, dart, bash, react, nextjs, django, fastapi, flask, svelte, vue, angular, nodejs, postgresql, mongodb) */
  track: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estMinutes: number;
  /** Order within track */
  order: number;
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
  /** Optional external deep-dive resources */
  deepDiveResources?: ResourceLink[];
  /** Whether this lesson is the capstone project for the track */
  isCapstone?: boolean;
  /** YouTube tutorial video URL for this stage */
  youtubeUrl?: string;
  /** Short paragraph explaining why this stage matters in real-world practice */
  whyItMatters?: string;
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
