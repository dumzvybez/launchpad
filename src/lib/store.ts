"use client";

import { create } from "zustand";
import type {
  AppState,
  Note,
  JournalEntry,
  ProjectTracker,
  FocusSession,
  HabitEntry,
  UserProfile,
  ViewId,
  Bookmark,
  CalendarEvent,
  PersonalizationInput,
  GeneratedRoadmap,
  LessonProgress,
  ChatConversation,
  ChatMessage,
  AISettings,
  AIProviderKey,
} from "./types";
import {
  loadState,
  saveState,
  exportState,
  saveAutoBackup,
  DEFAULT_STATE,
  todayKey,
  yesterdayKey,
  dateKey,
} from "./storage";
import { generateRoadmap, validateRoadmap } from "./personalization-engine";
import { ACHIEVEMENTS } from "./achievements-data";

// ============================================================
// Derived selectors (work on the personalized roadmap if present)
// ============================================================

function getAllTasksFromRoadmap(state: AppState) {
  if (state.roadmap) {
    return state.roadmap.phases.flatMap((p) =>
      p.modules.flatMap((m) =>
        m.tasks.map((t) => ({ ...t, phaseId: p.id, moduleId: m.id, phaseNumber: p.number })),
      ),
    );
  }
  return [];
}

export function selectCompletedTaskIds(state: AppState): Set<string> {
  return new Set(
    Object.entries(state.tasks)
      .filter(([, v]) => v.completedAt)
      .map(([k]) => k),
  );
}

export function selectEarnedXP(state: AppState): number {
  const completed = selectCompletedTaskIds(state);
  let xp = 0;
  const allTasks = getAllTasksFromRoadmap(state);
  for (const t of allTasks) {
    if (completed.has(t.id)) xp += t.xp;
  }
  // Badge XP — includes +75 XP per badge per Section 13.2
  for (const b of state.badges) {
    if (b.unlockedAt) xp += b.xp;
  }
  // Lesson XP — +50 XP per completed lesson per Section 13.2
  for (const p of Object.values(state.lessonProgress)) {
    if (p.status === "complete") xp += 50;
  }
  // Quiz XP — +30 XP per passed quiz (≥70%), +60 XP per perfect quiz (100%) per Section 13.2
  for (const p of Object.values(state.lessonProgress)) {
    const score = p.bestQuizScore ?? 0;
    if (score >= 100) xp += 60;
    else if (score >= 70) xp += 30;
  }
  // Project XP — +150 XP per shipped project per Section 13.2
  xp += state.projects.filter((p) => p.status === "shipped").length * 150;
  // Daily challenge XP — +25 XP per completed challenge per Section 13.2
  // Approximation: current streak × 25 (capped at 50 challenges)
  xp += Math.min(50, state.streak.current) * 25;
  // Mock interview XP — +100 XP per interview completed per Section 13.2
  const interviewCount = state.chatConversations.filter((c) =>
    c.messages.some((m) => m.content?.includes("I'm ready to start my mock interview")),
  ).length;
  xp += interviewCount * 100;
  // 7-day streak bonus — +200 XP per Section 13.2
  if (state.streak.longest >= 7) xp += 200;
  return xp;
}

export function selectPhaseProgress(
  state: AppState,
  phaseId: string,
): { completed: number; total: number; pct: number } {
  if (!state.roadmap) return { completed: 0, total: 0, pct: 0 };
  const phase = state.roadmap.phases.find((p) => p.id === phaseId);
  if (!phase) return { completed: 0, total: 0, pct: 0 };
  const tasks = phase.modules.flatMap((m) => m.tasks);
  const completed = tasks.filter((t) => state.tasks[t.id]?.completedAt).length;
  return {
    completed,
    total: tasks.length,
    pct: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };
}

export function selectOverallProgress(state: AppState): {
  completed: number;
  total: number;
  pct: number;
} {
  const allTasks = getAllTasksFromRoadmap(state);
  const completed = allTasks.filter((t) => state.tasks[t.id]?.completedAt).length;
  return {
    completed,
    total: allTasks.length,
    pct: allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0,
  };
}

// ============================================================
// Quiz score helpers (per-question tracking per Section 1.1)
// ============================================================

/**
 * Calculate the average quiz score for an entire track.
 * Formula: (userEarnedMarks / totalPossibleMarks) × 100
 * where each question = 10 marks, each quiz = 10 questions = 100 marks,
 * and totalPossibleMarks = numStages × 10 × 10 = 2000 per track.
 * Only counts attempted questions (unattempted = 0 marks).
 */
export function selectTrackQuizAverage(
  state: AppState,
  trackId: string,
  trackLessons: { id: string; quiz: { id: string }[] }[],
): { average: number; attemptedQuestions: number; totalQuestions: number } {
  const totalQuestions = trackLessons.reduce((sum, l) => sum + l.quiz.length, 0);
  const totalPossibleMarks = totalQuestions * 10;
  let userEarnedMarks = 0;
  let attemptedQuestions = 0;

  for (const lesson of trackLessons) {
    const progress = state.lessonProgress[lesson.id];
    if (!progress?.questionAnswers) continue;
    for (const q of lesson.quiz) {
      const key = `${lesson.id}:${q.id}`;
      const ans = progress.questionAnswers[key];
      if (ans) {
        attemptedQuestions++;
        if (ans.correct) userEarnedMarks += 10;
      }
    }
  }

  const average = totalPossibleMarks > 0
    ? Math.round((userEarnedMarks / totalPossibleMarks) * 100)
    : 0;
  return { average, attemptedQuestions, totalQuestions };
}

/**
 * Check if a track certificate is eligible.
 * Eligible when: all lessons complete AND quiz average >= 75%.
 */
export function selectCertificateEligible(
  state: AppState,
  trackId: string,
  trackLessons: { id: string; quiz: { id: string }[] }[],
): { eligible: boolean; allComplete: boolean; average: number; gap: number } {
  const allComplete = trackLessons.every(
    (l) => state.lessonProgress[l.id]?.status === "complete",
  );
  const { average } = selectTrackQuizAverage(state, trackId, trackLessons);
  const gap = Math.max(0, 75 - average);
  return {
    eligible: allComplete && average >= 75,
    allComplete,
    average,
    gap,
  };
}

/**
 * Career Readiness Score per Section 5.1 of Prompt-2-updated.txt.
 *
 * 5 dimensions:
 *   - Roadmap Progress: 25% — % of roadmap tasks completed
 *   - Knowledge (Quizzes): 25% — average quiz score across all completed stages
 *   - Projects Built: 20% — % of assigned projects marked complete
 *   - Daily Challenges: 15% — streak length + % of total challenges completed (capped at 100%)
 *   - Interview Readiness: 15% — % of Interview Mode sessions completed × average score
 *
 * If Interview Mode has never been used, redistribute its 15% equally
 * across the other 4 dimensions (multiply each by ~1.1765).
 *
 * Backward compat: `selectCareerProgress` (used by Dashboard + Analytics tab)
 * still returns roadmapPct/lessonsPct/projectsPct/overall but now uses the
 * new formula under the hood.
 */
export function selectCareerReadinessScore(state: AppState): {
  roadmapProgress: number;       // 0-100
  quizAverage: number;           // 0-100
  projectsCompleted: number;     // 0-100
  challengeScore: number;        // 0-100
  interviewScore: number | null; // 0-100, or null if never used
  overall: number;               // 0-100 weighted
  weights: { roadmap: number; quiz: number; projects: number; challenges: number; interviews: number };
} {
  // 1. Roadmap progress
  const roadmapProgress = selectOverallProgress(state).pct;

  // 2. Quiz average — across all attempted lessons in user's roadmap languages
  const userLangs = state.roadmap?.languageIds ?? [];
  let quizSum = 0;
  let quizCount = 0;
  if (userLangs.length > 0) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ALL_LESSONS } = require("./lessons-data");
      for (const lang of userLangs) {
        const lessons = ALL_LESSONS.filter((l: { track: string }) => l.track === lang);
        for (const l of lessons) {
          const prog = state.lessonProgress[l.id];
          if (prog?.bestQuizScore !== undefined && prog.bestQuizScore !== null) {
            quizSum += prog.bestQuizScore;
            quizCount++;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  const quizAverage = quizCount > 0 ? Math.round(quizSum / quizCount) : 0;

  // 3. Projects completed — % of assigned projects marked shipped
  const shippedCount = state.projects.filter((p) => p.status === "shipped").length;
  const projectsCompleted = Math.min(100, Math.round((shippedCount / 3) * 100));

  // 4. Daily challenges — streak + % completion
  const streakScore = Math.min(100, state.streak.current * 5); // 20-day streak = 100%
  // Completion %: totalCompletedChallenges / 30 (cap), each completed lesson = 1 challenge
  const completedLessons = Object.values(state.lessonProgress).filter((p) => p.status === "complete").length;
  const completionScore = Math.min(100, Math.round((completedLessons / 30) * 100));
  const challengeScore = Math.round((streakScore + completionScore) / 2);

  // 5. Interview readiness — null if no interviews completed
  // We approximate using chat conversations that started with the Interview Mode kickoff message
  const interviewConversations = state.chatConversations.filter((c) =>
    c.messages.some((m) => m.content?.includes("I'm ready to start my mock interview")),
  );
  const interviewScore: number | null = interviewConversations.length > 0
    ? Math.min(100, Math.round((interviewConversations.length / 5) * 100))
    : null;

  // Weighted formula
  const weights = interviewScore === null
    ? { roadmap: 0.294, quiz: 0.294, projects: 0.235, challenges: 0.176, interviews: 0 }
    : { roadmap: 0.25, quiz: 0.25, projects: 0.20, challenges: 0.15, interviews: 0.15 };

  const overall = Math.round(
    roadmapProgress * weights.roadmap +
    quizAverage * weights.quiz +
    projectsCompleted * weights.projects +
    challengeScore * weights.challenges +
    (interviewScore ?? 0) * weights.interviews,
  );

  return {
    roadmapProgress,
    quizAverage,
    projectsCompleted,
    challengeScore,
    interviewScore,
    overall,
    weights,
  };
}

/**
 * Career progress per Section 5.3 (Round 4): 40% roadmap tasks + 40% lessons + 20% projects.
 * NOTE: This is kept for backward compat with Dashboard + Analytics tab. The Career tab
 * now uses selectCareerReadinessScore (5 dimensions) per Section 5.1 of Prompt-2.
 */
export function selectCareerProgress(state: AppState): {
  roadmapPct: number;
  lessonsPct: number;
  projectsPct: number;
  overall: number;
} {
  const roadmapPct = selectOverallProgress(state).pct;
  // Lessons: progress across user's roadmap languages only
  const userLangs = state.roadmap?.languageIds ?? [];
  let totalLessons = 0;
  let completedLessons = 0;
  if (userLangs.length > 0) {
    // Import dynamically to avoid circular deps at module load
    // We use a lazy require here
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ALL_LESSONS } = require("./lessons-data");
      for (const lang of userLangs) {
        const lessons = ALL_LESSONS.filter((l: { track: string }) => l.track === lang);
        totalLessons += lessons.length;
        for (const l of lessons) {
          if (state.lessonProgress[l.id]?.status === "complete") completedLessons++;
        }
      }
    } catch {
      // fall through
    }
  }
  const lessonsPct = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  // Projects: shipped count / 3 (capped at 100%)
  const shippedCount = state.projects.filter((p) => p.status === "shipped").length;
  const projectsPct = Math.min(100, Math.round((shippedCount / 3) * 100));
  const overall = Math.round(roadmapPct * 0.4 + lessonsPct * 0.4 + projectsPct * 0.2);
  return { roadmapPct, lessonsPct, projectsPct, overall };
}

// Level system per Section 13.2 of Prompt-2-updated.txt — explicit 10-level curve
const LEVEL_THRESHOLDS = [
  0,        // Level 1: 0–499 XP
  500,      // Level 2: 500–1,499 XP
  1500,     // Level 3: 1,500–3,499 XP
  3500,     // Level 4: 3,500–7,499 XP
  7500,     // Level 5: 7,500–14,999 XP
  15000,    // Level 6: 15,000–29,999 XP
  30000,    // Level 7: 30,000–59,999 XP
  60000,    // Level 8: 60,000–119,999 XP
  120000,   // Level 9: 120,000–239,999 XP
  240000,   // Level 10: 240,000+ XP (max)
];

export function selectLevel(state: AppState): {
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  pct: number;
} {
  const totalXP = selectEarnedXP(state);
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const lowerBound = LEVEL_THRESHOLDS[level - 1];
  const upperBound = level < LEVEL_THRESHOLDS.length
    ? LEVEL_THRESHOLDS[level]
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1;
  const xpInLevel = totalXP - lowerBound;
  const xpForNextLevel = level < LEVEL_THRESHOLDS.length ? upperBound - lowerBound : 1;
  const pct = level >= LEVEL_THRESHOLDS.length ? 100 : Math.round((xpInLevel / xpForNextLevel) * 100);
  return {
    level,
    xpInLevel,
    xpForNextLevel,
    pct,
  };
}

// ============================================================
// AI rate limiting — 15 messages per 2-hour window (on-device)
// ============================================================

const RATE_LIMIT_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const RATE_LIMIT_MAX = 15;

export function getRateLimitInfo(state: AppState): {
  used: number;
  remaining: number;
  resetsAt: number | null;
} {
  const now = Date.now();
  const recent = state.rateLimitTimestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  const remaining = Math.max(0, RATE_LIMIT_MAX - recent.length);
  const resetsAt =
    recent.length > 0 && remaining === 0
      ? recent[0] + RATE_LIMIT_WINDOW_MS
      : null;
  return { used: recent.length, remaining, resetsAt };
}

export function canSendMessage(state: AppState, hasUserKey: boolean): boolean {
  if (hasUserKey) return true; // user's own key bypasses rate limit
  const { remaining } = getRateLimitInfo(state);
  return remaining > 0;
}

// ============================================================
// Store
// ============================================================

type Store = {
  state: AppState;
  hydrated: boolean;
  currentView: ViewId;
  selectedPhaseId: string | null;
  selectedTaskId: string | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  selectedChatId: string | null;
  commandOpen: boolean;
  focusMode: boolean;
  /** Currently active tour (null = no tour) */
  tourStep: number | null;
  /** Mobile sidebar drawer open */
  mobileNavOpen: boolean;
  /** AI Tutor floating window state */
  aiTutorOpen: boolean;
  aiTutorMaximized: boolean;
  /** Toast queue for achievement badges */
  pendingBadgeToasts: string[];
  /** Playground code (loaded by Try in Playground buttons) */
  playgroundCode: string | null;
  playgroundLanguage: "javascript" | "typescript" | null;
  /** Force onboarding flow (set by Regenerate Plan button) */
  forceOnboarding: boolean;

  // Hydration
  hydrate: () => void;

  // View navigation
  setView: (v: ViewId) => void;
  selectPhase: (id: string | null) => void;
  selectModule: (id: string | null) => void;
  selectTask: (id: string | null) => void;
  selectLesson: (id: string | null) => void;
  selectChat: (id: string | null) => void;
  setCommandOpen: (open: boolean) => void;
  setFocusMode: (on: boolean) => void;
  setTourStep: (step: number | null) => void;
  setMobileNavOpen: (open: boolean) => void;
  setAiTutorOpen: (open: boolean) => void;
  setAiTutorMaximized: (max: boolean) => void;
  setPlaygroundCode: (code: string | null, language?: "javascript" | "typescript" | null) => void;

  // Task actions
  toggleTask: (taskId: string) => void;
  isTaskComplete: (taskId: string) => boolean;
  isPhaseUnlocked: (phaseNumber: number) => boolean;

  // Profile
  updateProfile: (patch: Partial<UserProfile>) => void;

  // Notes
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Journal
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  updateJournalEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Projects
  updateProjectTracker: (projectId: string, patch: Partial<ProjectTracker>) => void;

  // Focus sessions
  addFocusSession: (session: Omit<FocusSession, "id">) => void;

  // Habits
  toggleHabit: (habitId: string, date?: string) => void;
  getHabitsForDate: (date: string) => HabitEntry | undefined;

  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;

  // Calendar events
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateCalendarEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  // Calendar notifications (transient)
  addNotification: (eventId: string) => void;
  snoozeNotification: (eventId: string, minutes: number) => void;
  dismissNotification: (eventId: string) => void;

  // Onboarding & roadmap
  completeOnboarding: (input: PersonalizationInput) => GeneratedRoadmap;
  setRoadmap: (roadmap: GeneratedRoadmap) => void;
  regenerateRoadmap: (input: PersonalizationInput) => GeneratedRoadmap;

  // Lessons
  setLessonProgress: (lessonId: string, status: LessonProgress["status"], quizScore?: number) => void;
  recordQuizAnswer: (lessonId: string, questionId: string, selectedIndex: number, correct: boolean) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  setLearnTabState: (partial: Partial<AppState["learnTabState"]>) => void;

  // Project submissions (capstone uploads)
  addProjectSubmission: (projectId: string, repoUrl: string, notes?: string) => void;

  // Certificates
  issueCertificate: (trackId: string, trackName: string, name: string) => string;
  issueCareerCertificate: (careerLabel: string, name: string) => string;
  updateCertificateName: (trackId: string, name: string) => void;
  updateCareerCertificateName: (name: string) => void;

  // AI chat
  createChatConversation: () => string;
  deleteChatConversation: (id: string) => void;
  renameChatConversation: (id: string, title: string) => void;
  addChatMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActiveChat: (id: string | undefined) => void;
  clearAllChats: () => void;
  setAISettings: (patch: Partial<AISettings>) => void;
  acknowledgeAIWarning: () => void;

  // Daily challenge
  completeDailyChallenge: () => void;
  setDailyChallengePool: (taskIds: string[]) => void;

  // Preferences
  setPreference: <K extends keyof AppState["preferences"]>(
    key: K,
    value: AppState["preferences"][K],
  ) => void;

  // Achievements
  checkAchievements: () => string[]; // returns newly earned badge ids
  dismissBadgeToast: (badgeId: string) => void;

  // Reset & backup
  resetAll: () => void;
  exportBackup: () => void;
  importBackup: (state: AppState) => void;
  runAutoBackup: () => void;

  // Regenerate plan
  startOnboardingAgain: () => void;
  clearForceOnboarding: () => void;
};

export const HABIT_DEFINITIONS = [
  { id: "code", label: "Coded today", icon: "Code" },
  { id: "read", label: "Read docs/article", icon: "Book" },
  { id: "exercise", label: "Exercised", icon: "Dumbbell" },
  { id: "sleep", label: "8h sleep", icon: "Moon" },
  { id: "leetcode", label: "Solved a problem", icon: "Brain" },
];

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function persist(state: AppState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveState(state), 200);
}

export const useStore = create<Store>((set, get) => {
  function updateState(updater: (s: AppState) => AppState) {
    const current = get().state;
    const next = updater(current);
    persist(next);
    set({ state: next });
    return next;
  }

  return {
    state: DEFAULT_STATE,
    hydrated: false,
    currentView: "dashboard",
    selectedPhaseId: null,
    selectedTaskId: null,
    selectedModuleId: null,
    selectedLessonId: null,
    selectedChatId: null,
    commandOpen: false,
    focusMode: false,
    tourStep: null,
    mobileNavOpen: false,
    aiTutorOpen: false,
    aiTutorMaximized: false,
    pendingBadgeToasts: [],
    playgroundCode: null,
    playgroundLanguage: "javascript",
    forceOnboarding: false,

    hydrate: () => {
      if (get().hydrated) return;
      const loaded = loadState();
      // Migrate deprecated AI models (Section 2.4)
      if (loaded.aiSettings) {
        const migrated = migrateDeprecatedModel(loaded.aiSettings.provider, loaded.aiSettings.model);
        if (migrated !== loaded.aiSettings.model) {
          loaded.aiSettings = { ...loaded.aiSettings, model: migrated };
        }
      }
      set({ state: loaded, hydrated: true });
      // Run auto-backup check
      const today = todayKey();
      if (loaded.lastAutoBackup !== today) {
        saveAutoBackup(loaded);
        updateState((s) => ({ ...s, lastAutoBackup: today }));
      }
      // Check achievements on hydrate (in case state changed externally)
      setTimeout(() => get().checkAchievements(), 100);
    },

    setView: (v) => set({ currentView: v, selectedPhaseId: null, selectedTaskId: null, selectedModuleId: null, mobileNavOpen: false }),
    selectPhase: (id) => set({ selectedPhaseId: id, selectedModuleId: null, selectedTaskId: null }),
    selectModule: (id) => set({ selectedModuleId: id, selectedTaskId: null }),
    selectTask: (id) => set({ selectedTaskId: id }),
    selectLesson: (id) => set({ selectedLessonId: id }),
    selectChat: (id) => set({ selectedChatId: id }),
    setCommandOpen: (open) => set({ commandOpen: open }),
    setFocusMode: (on) => set({ focusMode: on }),
    setTourStep: (step) => set({ tourStep: step }),
    setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    setAiTutorOpen: (open) => set({ aiTutorOpen: open }),
    setAiTutorMaximized: (max) => set({ aiTutorMaximized: max }),
    setPlaygroundCode: (code, language = "javascript") => set({ playgroundCode: code, playgroundLanguage: language }),

    toggleTask: (taskId) => {
      updateState((s) => {
        const existing = s.tasks[taskId];
        const today = todayKey();

        if (existing?.completedAt) {
          const newTasks = { ...s.tasks };
          delete newTasks[taskId];
          const newActivity = { ...s.activity };
          if (newActivity[today]) {
            newActivity[today] = Math.max(0, newActivity[today] - 1);
            if (newActivity[today] === 0) delete newActivity[today];
          }
          return { ...s, tasks: newTasks, activity: newActivity };
        }

        const newTasks = {
          ...s.tasks,
          [taskId]: { completedAt: new Date().toISOString() },
        };
        const newActivity = {
          ...s.activity,
          [today]: (s.activity[today] || 0) + 1,
        };

        let newStreak = { ...s.streak };
        const lastDate = s.streak.lastActiveDate;
        if (lastDate === today) {
          // already counted today
        } else if (lastDate === yesterdayKey()) {
          newStreak = {
            current: s.streak.current + 1,
            longest: Math.max(s.streak.longest, s.streak.current + 1),
            lastActiveDate: today,
            freezes: s.streak.freezes,
          };
        } else {
          newStreak = {
            current: 1,
            longest: Math.max(s.streak.longest, 1),
            lastActiveDate: today,
            freezes: s.streak.freezes,
          };
        }

        return { ...s, tasks: newTasks, activity: newActivity, streak: newStreak };
      });
      // Check achievements after task toggle
      setTimeout(() => get().checkAchievements(), 50);
    },

    isTaskComplete: (taskId) => !!get().state.tasks[taskId]?.completedAt,

    isPhaseUnlocked: (phaseNumber) => {
      const s = get().state;
      if (!s.roadmap) return false;
      if (phaseNumber === 1) return true;
      // Phase N is unlocked when phase N-1 is at least 50% complete
      const prevPhase = s.roadmap.phases.find((p) => p.number === phaseNumber - 1);
      if (!prevPhase) return false;
      const tasks = prevPhase.modules.flatMap((m) => m.tasks);
      if (!tasks.length) return true;
      const completed = tasks.filter((t) => s.tasks[t.id]?.completedAt).length;
      const pct = completed / tasks.length;
      // First 2 phases always unlocked to allow exploration
      if (phaseNumber <= 2) return true;
      return pct >= 0.5;
    },

    updateProfile: (patch) =>
      updateState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),

    addNote: (note) =>
      updateState((s) => ({
        ...s,
        notes: [
          {
            ...note,
            id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...s.notes,
        ],
      })),

    updateNote: (id, patch) =>
      updateState((s) => ({
        ...s,
        notes: s.notes.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n,
        ),
      })),

    deleteNote: (id) =>
      updateState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),

    addJournalEntry: (entry) =>
      updateState((s) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
        };
        const filtered = s.journal.filter((e) => e.date !== entry.date);
        return { ...s, journal: [newEntry, ...filtered] };
      }),

    updateJournalEntry: (id, patch) =>
      updateState((s) => ({
        ...s,
        journal: s.journal.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),

    deleteJournalEntry: (id) =>
      updateState((s) => ({ ...s, journal: s.journal.filter((e) => e.id !== id) })),

    updateProjectTracker: (projectId, patch) =>
      updateState((s) => {
        const existing = s.projects.find((p) => p.projectId === projectId);
        if (existing) {
          return {
            ...s,
            projects: s.projects.map((p) =>
              p.projectId === projectId ? { ...p, ...patch } : p,
            ),
          };
        }
        return {
          ...s,
          projects: [...s.projects, { projectId, status: "planned", ...patch }],
        };
      }),

    addFocusSession: (session) =>
      updateState((s) => ({
        ...s,
        focusSessions: [
          { ...session, id: `focus-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
          ...s.focusSessions,
        ],
      })),

    toggleHabit: (habitId, date) =>
      updateState((s) => {
        const d = date || todayKey();
        const existing = s.habits.find((h) => h.date === d);
        if (existing) {
          return {
            ...s,
            habits: s.habits.map((h) =>
              h.date === d
                ? { ...h, habits: { ...h.habits, [habitId]: !h.habits[habitId] } }
                : h,
            ),
          };
        }
        return {
          ...s,
          habits: [...s.habits, { date: d, habits: { [habitId]: true } }],
        };
      }),

    getHabitsForDate: (date) => get().state.habits.find((h) => h.date === date),

    addBookmark: (bookmark) =>
      updateState((s) => ({
        ...s,
        bookmarks: [
          {
            ...bookmark,
            id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString(),
          },
          ...s.bookmarks,
        ],
      })),

    updateBookmark: (id, patch) =>
      updateState((s) => ({
        ...s,
        bookmarks: s.bookmarks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      })),

    deleteBookmark: (id) =>
      updateState((s) => ({ ...s, bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

    addCalendarEvent: (event) =>
      updateState((s) => ({
        ...s,
        calendarEvents: [
          { ...event, id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
          ...s.calendarEvents,
        ],
      })),

    updateCalendarEvent: (id, patch) =>
      updateState((s) => ({
        ...s,
        calendarEvents: s.calendarEvents.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),

    deleteCalendarEvent: (id) =>
      updateState((s) => ({
        ...s,
        calendarEvents: s.calendarEvents.filter((e) => e.id !== id),
        activeNotifications: s.activeNotifications.filter((n) => n !== id),
      })),

    addNotification: (eventId) =>
      updateState((s) => {
        if (s.activeNotifications.includes(eventId)) return s;
        return { ...s, activeNotifications: [...s.activeNotifications, eventId] };
      }),

    snoozeNotification: (eventId, minutes) =>
      updateState((s) => {
        const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        return {
          ...s,
          calendarEvents: s.calendarEvents.map((e) =>
            e.id === eventId ? { ...e, snoozedUntil } : e,
          ),
          activeNotifications: s.activeNotifications.filter((n) => n !== eventId),
        };
      }),

    dismissNotification: (eventId) =>
      updateState((s) => {
        const event = s.calendarEvents.find((e) => e.id === eventId);
        return {
          ...s,
          calendarEvents: s.calendarEvents.map((e) =>
            e.id === eventId
              ? { ...e, notifiedFor: new Date().toISOString(), completed: true }
              : e,
          ),
          activeNotifications: s.activeNotifications.filter((n) => n !== eventId),
        };
      }),

    completeOnboarding: (input) => {
      const roadmap = generateRoadmap(input);
      // Validate
      const validation = validateRoadmap(roadmap, input);
      if (!validation.valid) {
        console.warn("[launchpad] roadmap validation issues:", validation.errors);
      }
      // Assign daily challenge pool based on selected languages (Section 7)
      let dailyPool: string[] = [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { selectPoolForLanguages } = require("./daily-challenges-data-v2");
        dailyPool = selectPoolForLanguages(input.selectedLanguageIds);
      } catch (e) {
        console.warn("[launchpad] could not load daily challenge pool:", e);
      }
      updateState((s) => ({
        ...s,
        onboardingCompleted: true,
        roadmap,
        dailyChallengePool: dailyPool,
        dailyChallengeWeekIndex: 0,
        profile: {
          ...s.profile,
          name: input.name,
          goal: `Target: ${roadmap.careerLabel}${input.subPath ? ` (${input.subPath})` : ""}`,
          careerId: input.careerId,
          subPath: input.subPath,
          occupationId: input.occupationId,
          skillLevel: input.skillLevel,
          hoursPerDay: input.hoursPerDay,
          daysPerWeek: input.daysPerWeek,
          startDate: new Date().toISOString(),
        },
      }));
      return roadmap;
    },

    setRoadmap: (roadmap) => updateState((s) => ({ ...s, roadmap })),

    regenerateRoadmap: (input) => {
      const roadmap = generateRoadmap(input);
      const validation = validateRoadmap(roadmap, input);
      if (!validation.valid) {
        console.warn("[launchpad] regenerated roadmap validation issues:", validation.errors);
      }
      updateState((s) => ({ ...s, roadmap }));
      return roadmap;
    },

    setLessonProgress: (lessonId, status, quizScore) =>
      updateState((s) => {
        const existing = s.lessonProgress[lessonId] ?? {
          lessonId,
          status: "not-started" as const,
        };
        const updated: LessonProgress = {
          ...existing,
          status,
          startedAt: existing.startedAt ?? (status !== "not-started" ? new Date().toISOString() : undefined),
          completedAt: status === "complete" ? new Date().toISOString() : existing.completedAt,
          bestQuizScore: quizScore !== undefined
            ? Math.max(quizScore, existing.bestQuizScore ?? 0)
            : existing.bestQuizScore,
        };

        // Auto-complete linked roadmap tasks when a lesson is completed
        let newTasks = s.tasks;
        let newActivity = s.activity;
        let newStreak = s.streak;
        if (status === "complete" && s.roadmap) {
          const today = todayKey();
          for (const phase of s.roadmap.phases) {
            for (const mod of phase.modules) {
              for (const task of mod.tasks) {
                if (task.lessonId === lessonId && !s.tasks[task.id]?.completedAt) {
                  newTasks = {
                    ...newTasks,
                    [task.id]: { completedAt: new Date().toISOString() },
                  };
                  newActivity = {
                    ...newActivity,
                    [today]: (newActivity[today] || 0) + 1,
                  };
                  // Update streak
                  const lastDate = newStreak.lastActiveDate;
                  if (lastDate !== today) {
                    if (lastDate === yesterdayKey()) {
                      newStreak = {
                        current: newStreak.current + 1,
                        longest: Math.max(newStreak.longest, newStreak.current + 1),
                        lastActiveDate: today,
                        freezes: newStreak.freezes,
                      };
                    } else {
                      newStreak = {
                        current: 1,
                        longest: Math.max(newStreak.longest, 1),
                        lastActiveDate: today,
                        freezes: newStreak.freezes,
                      };
                    }
                  }
                }
              }
            }
          }
        }

        return {
          ...s,
          lessonProgress: { ...s.lessonProgress, [lessonId]: updated },
          tasks: newTasks,
          activity: newActivity,
          streak: newStreak,
        };
      }),

    getLessonProgress: (lessonId) => get().state.lessonProgress[lessonId],

    recordQuizAnswer: (lessonId, questionId, selectedIndex, correct) =>
      updateState((s) => {
        const existing = s.lessonProgress[lessonId] ?? {
          lessonId,
          status: "in-progress" as const,
          startedAt: new Date().toISOString(),
        };
        const key = `${lessonId}:${questionId}`;
        const updated: LessonProgress = {
          ...existing,
          status: existing.status === "not-started" ? "in-progress" : existing.status,
          questionAnswers: {
            ...(existing.questionAnswers ?? {}),
            [key]: {
              selectedIndex,
              correct,
              attemptedAt: new Date().toISOString(),
            },
          },
        };
        return {
          ...s,
          lessonProgress: { ...s.lessonProgress, [lessonId]: updated },
        };
      }),

    addProjectSubmission: (projectId, repoUrl, notes) =>
      updateState((s) => {
        const submission = {
          projectId,
          repoUrl,
          submittedAt: new Date().toISOString(),
          notes,
        };
        // Replace existing submission for this project, or add new
        const existing = s.projectSubmissions.filter((p) => p.projectId !== projectId);
        return {
          ...s,
          projectSubmissions: [...existing, submission],
        };
      }),

    setLearnTabState: (partial) =>
      updateState((s) => ({
        ...s,
        learnTabState: { ...s.learnTabState, ...partial },
      })),

    issueCertificate: (trackId, trackName, name) => {
      // Deterministic ID from user+track+date hash
      const state = get().state;
      const seed = `${state.profile.name || "learner"}-${trackId}-${new Date().toISOString().slice(0, 10)}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
      }
      const certId = `LP-${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
      const cert = {
        certId,
        issuedAt: new Date().toISOString(),
        name,
        trackId,
        trackName,
      };
      updateState((s) => ({
        ...s,
        certificates: { ...s.certificates, [trackId]: cert },
      }));
      return certId;
    },

    issueCareerCertificate: (careerLabel, name) => {
      const state = get().state;
      const seed = `CAREER-${state.profile.name || "learner"}-${state.profile.careerId || "x"}-${new Date().toISOString().slice(0, 10)}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
      }
      const certId = `LP-CAREER-${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
      const cert = {
        certId,
        issuedAt: new Date().toISOString(),
        name,
        careerLabel,
      };
      updateState((s) => ({ ...s, careerCertificate: cert }));
      return certId;
    },

    updateCertificateName: (trackId, name) =>
      updateState((s) => {
        const existing = s.certificates[trackId];
        if (!existing) return s;
        return {
          ...s,
          certificates: { ...s.certificates, [trackId]: { ...existing, name } },
        };
      }),

    updateCareerCertificateName: (name) =>
      updateState((s) => ({
        ...s,
        careerCertificate: s.careerCertificate ? { ...s.careerCertificate, name } : undefined,
      })),

    createChatConversation: () => {
      const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const now = new Date().toISOString();
      const conversation: ChatConversation = {
        id,
        title: "New chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      updateState((s) => ({
        ...s,
        chatConversations: [conversation, ...s.chatConversations],
        activeChatId: id,
      }));
      return id;
    },

    deleteChatConversation: (id) =>
      updateState((s) => {
        const filtered = s.chatConversations.filter((c) => c.id !== id);
        return {
          ...s,
          chatConversations: filtered,
          activeChatId: s.activeChatId === id ? filtered[0]?.id ?? null : s.activeChatId,
        };
      }),

    renameChatConversation: (id, title) =>
      updateState((s) => ({
        ...s,
        chatConversations: s.chatConversations.map((c) =>
          c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c,
        ),
      })),

    addChatMessage: (conversationId, message) =>
      updateState((s) => ({
        ...s,
        chatConversations: s.chatConversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    ...message,
                    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                updatedAt: new Date().toISOString(),
                // Auto-title from first user message if still "New chat"
                title:
                  c.title === "New chat" && message.role === "user"
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? "…" : "")
                    : c.title,
              }
            : c,
        ),
      })),

    setActiveChat: (id) => updateState((s) => ({ ...s, activeChatId: id })),

    clearAllChats: () =>
      updateState((s) => ({ ...s, chatConversations: [], activeChatId: undefined })),

    setAISettings: (patch) =>
      updateState((s) => ({ ...s, aiSettings: { ...s.aiSettings, ...patch } })),

    acknowledgeAIWarning: () =>
      updateState((s) => ({ ...s, aiWarningAcknowledged: true })),

    completeDailyChallenge: () =>
      updateState((s) => {
        const today = todayKey();
        const yesterday = yesterdayKey();
        const wasYesterday = s.dailyChallenge.lastChallengeDate === yesterday;
        const wasToday = s.dailyChallenge.lastChallengeDate === today;
        const newStreak = wasToday
          ? s.dailyChallenge.currentStreak
          : wasYesterday
            ? s.dailyChallenge.currentStreak + 1
            : 1;
        return {
          ...s,
          dailyChallenge: {
            lastChallengeDate: today,
            currentStreak: newStreak,
            completedToday: true,
          },
        };
      }),

    setDailyChallengePool: (taskIds) =>
      updateState((s) => ({
        ...s,
        dailyChallengePool: taskIds,
        dailyChallengeWeekIndex: 0,
      })),

    setPreference: (key, value) =>
      updateState((s) => ({
        ...s,
        preferences: { ...s.preferences, [key]: value },
      })),

    checkAchievements: () => {
      const s = get().state;
      const newlyEarned: string[] = [];
      const existing = new Set(s.badges.map((b) => b.id));
      const newBadges = [...s.badges];

      for (const achievement of ACHIEVEMENTS) {
        if (existing.has(achievement.id)) continue;
        if (achievement.check && achievement.check(s)) {
          newBadges.push({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            xp: achievement.xp,
            unlockedAt: new Date().toISOString(),
          });
          newlyEarned.push(achievement.id);
        }
      }

      if (newlyEarned.length > 0) {
        updateState((s) => ({ ...s, badges: newBadges }));
        set({ pendingBadgeToasts: [...get().pendingBadgeToasts, ...newlyEarned] });
      }
      return newlyEarned;
    },

    dismissBadgeToast: (badgeId) =>
      set({ pendingBadgeToasts: get().pendingBadgeToasts.filter((id) => id !== badgeId) }),

    resetAll: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("launchpad:v4:state");
        window.localStorage.removeItem("launchpad:v4:auto-backup");
        window.localStorage.removeItem("launchpad:v4:last-auto-backup");
      }
      set({ state: DEFAULT_STATE });
    },

    exportBackup: () => exportState(get().state),

    importBackup: (imported) => {
      persist(imported);
      set({ state: imported });
    },

    runAutoBackup: () => {
      const s = get().state;
      saveAutoBackup(s);
      updateState((s) => ({ ...s, lastAutoBackup: todayKey() }));
    },

    startOnboardingAgain: () => {
      // Mark onboarding as incomplete so AppShell shows the OnboardingFlow
      updateState((s) => ({ ...s, onboardingCompleted: false }));
      set({ forceOnboarding: true, currentView: "dashboard" });
    },

    clearForceOnboarding: () => set({ forceOnboarding: false }),
  };
});

// Helper to format dates for display
export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// Provider model presets — BYOK only, no Z.ai. Updated per Section 2.4 (deprecated models removed).
export const PROVIDER_MODELS: Record<AIProviderKey, string[]> = {
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"],
  groq: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama-3.1-70b-versatile"],
  openrouter: ["google/gemini-2.5-flash", "openai/gpt-4o", "anthropic/claude-sonnet-4", "meta-llama/llama-3.3-70b-instruct"],
  openai: ["gpt-4o-mini", "gpt-4o"],
  anthropic: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022"],
  custom: [],
};

export const PROVIDER_INFO: Record<AIProviderKey, {
  label: string;
  icon: string;
  recommended: boolean;
  freeModels: string[];
  getFreeKeyUrl?: string;
}> = {
  gemini: {
    label: "Google Gemini",
    icon: "✨",
    recommended: true,
    freeModels: ["gemini-2.5-flash", "gemini-2.0-flash"],
    getFreeKeyUrl: "https://aistudio.google.com",
  },
  groq: {
    label: "Groq",
    icon: "⚡",
    recommended: true,
    freeModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama-3.1-70b-versatile"],
    getFreeKeyUrl: "https://console.groq.com",
  },
  openrouter: {
    label: "OpenRouter",
    icon: "🌐",
    recommended: true,
    freeModels: ["google/gemini-2.5-flash", "meta-llama/llama-3.3-70b-instruct"],
    getFreeKeyUrl: "https://openrouter.ai/keys",
  },
  openai: {
    label: "OpenAI",
    icon: "🤖",
    recommended: false,
    freeModels: [],
  },
  anthropic: {
    label: "Anthropic",
    icon: "🧠",
    recommended: false,
    freeModels: [],
  },
  custom: {
    label: "Custom Endpoint",
    icon: "🔧",
    recommended: false,
    freeModels: [],
  },
};

/**
 * Migrate a saved model to its current equivalent if the saved model was deprecated.
 * Called on app hydration to keep user settings valid.
 */
export function migrateDeprecatedModel(provider: AIProviderKey, model: string): string {
  const valid = PROVIDER_MODELS[provider] ?? [];
  if (valid.includes(model)) return model;
  // Migration map for deprecated models
  const migrations: Record<string, string> = {
    "gemini-1.5-flash": "gemini-2.0-flash",
    "gemini-1.5-pro": "gemini-2.5-flash",
    "mixtral-8x7b-32768": "llama-3.3-70b-versatile",
    "gemma2-9b-it": "llama-3.3-70b-versatile",
    "gpt-3.5-turbo": "gpt-4o-mini",
    "gpt-4-turbo": "gpt-4o",
    "claude-3-5-sonnet-20241022": "claude-sonnet-4-20250514",
    "claude-3-opus-20240229": "claude-sonnet-4-20250514",
    "anthropic/claude-3.5-sonnet": "anthropic/claude-sonnet-4",
  };
  return migrations[model] ?? (valid[0] ?? model);
}
