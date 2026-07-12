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
  Flashcard,
  AppNotification,
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
import { generateCertificateId, generateCareerCertificateId } from "./certificate-utils";
// ESM imports for data modules — replaces the previous `require()` calls
// which can silently fail under Turbopack/Next.js 16 bundling.
import { ALL_LANGUAGE_INFO, getLessons, getLessonById, getTrackLessons, loadAllLessons } from "./lessons-data";
import { selectPoolForLanguages } from "./daily-challenges-data-v2";
import { recordQuestion, recordFlashcard } from "./sm2";
import { generateFlashcardsForTrack } from "./flashcard-generator";

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
  // Daily challenge XP — +25 XP per completed challenge per Section 13.2.
  // Uses the *daily-challenge* streak, not the task-completion streak.
  xp += Math.min(50, state.dailyChallenge.currentStreak) * 25;
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
// SM-2 Weak Areas selector (Section 1.5)
// ============================================================

/**
 * Get the user's top-N most-missed questions across all tracks, sorted by
 * incorrectCount desc then lastAttemptDate desc. Used by the "Weak Areas"
 * card on the Learn tab.
 */
export function selectWeakAreas(state: AppState, limit = 5): Array<{
  lessonId: string;
  questionId: string;
  incorrectCount: number;
  correctCount: number;
  lastAttemptDate: string;
  trackId: string;
  lessonTitle: string;
  questionText: string;
}> {
  const records = Object.entries(state.questionRecords ?? {});
  if (records.length === 0) return [];
  const sorted = records
    .filter(([, r]) => r.incorrectCount > 0)
    .sort((a, b) => {
      if (b[1].incorrectCount !== a[1].incorrectCount) {
        return b[1].incorrectCount - a[1].incorrectCount;
      }
      return (b[1].lastAttemptDate ?? "").localeCompare(a[1].lastAttemptDate ?? "");
    })
    .slice(0, limit);

  return sorted.map(([key, r]) => {
    const [lessonId, questionId] = key.split(":");
    const lesson = getLessonById(lessonId);
    const question = lesson?.quiz.find((q) => q.id === questionId);
    return {
      lessonId,
      questionId,
      incorrectCount: r.incorrectCount,
      correctCount: r.correctCount,
      lastAttemptDate: r.lastAttemptDate,
      trackId: lesson?.track ?? "",
      lessonTitle: lesson?.title ?? lessonId,
      questionText: question?.question ?? questionId,
    };
  });
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
/**
 * v5.926 (A2): Career Readiness Score — redesigned to 4 components.
 * Removed "Challenges" (daily challenges) entirely. Now weights:
 *   Without interviews: Roadmap 40%, Knowledge 40%, Projects 20%
 *   With interviews:    Roadmap 30%, Knowledge 30%, Projects 20%, Interviews 20%
 *
 * Interview scoring is now transparent: reports sessionsCompleted +
 * questionsAnswered (approximated from message count). The interview
 * dimension only contributes when the user has completed at least 1 session.
 */
export function selectCareerReadinessScore(state: AppState): {
  roadmapProgress: number;       // 0-100
  quizAverage: number;           // 0-100 (knowledge mastery across curriculum)
  projectsCompleted: number;     // 0-100 (AI-verified projects / assigned)
  interviewScore: number | null; // 0-100, or null if never used
  interviewSessions: number;     // v5.926: transparent count
  interviewQuestions: number;    // v5.926: approx questions answered
  minInterviewQuestions: number; // v5.927: language-scaled minimum for warm-up
  overall: number;               // 0-100 weighted
  weights: { roadmap: number; quiz: number; projects: number; interviews: number };
} {
  // 1. Roadmap progress
  const roadmapProgress = selectOverallProgress(state).pct;

  // 2. Knowledge (quiz average) — across ALL lessons in the user's roadmap languages.
  // v5.925: divides by totalLessons (not attempted) so unattempted = 0.
  const userLangs = state.roadmap?.languageIds ?? [];
  let quizSum = 0;
  let totalLessons = 0;
  if (userLangs.length > 0) {
    for (const lang of userLangs) {
      const lessons = getTrackLessons(lang);
      totalLessons += lessons.length;
      for (const l of lessons) {
        const prog = state.lessonProgress[l.id];
        if (prog?.bestQuizScore !== undefined && prog.bestQuizScore !== null) {
          quizSum += prog.bestQuizScore;
        }
      }
    }
  }
  const quizAverage = totalLessons > 0 ? Math.round((quizSum / totalLessons)) : 0;

  // 3. Projects — % of assigned projects AI-VERIFIED.
  // v5.926 (A1): only verifiedAt counts (Shipped self-marking removed).
  const verifiedCount = state.projects.filter((p) => p.verifiedAt).length;
  const totalProjects = state.assignedProjectCount && state.assignedProjectCount > 0
    ? state.assignedProjectCount
    : 8;
  const projectsCompleted = Math.min(100, Math.round((verifiedCount / totalProjects) * 100));

  // 4. Interview readiness — transparent scoring with a language-scaled minimum.
  // v5.927 (#2): the score now requires a MINIMUM number of answered questions
  // before it "warms up" and contributes meaningfully. The minimum scales with
  // the number of languages the user selected:
  //   minQuestions = 10 × languageCount  (1 lang = 10 Q, 6 langs = 60 Q)
  // Reasoning: a user studying 6 languages should demonstrate broader knowledge
  // than a user studying 1. Below the minimum, the score is 0 and the UI shows
  // transparent progress ("X/Y questions across Z sessions"). Above the minimum,
  // the score scales linearly: minQuestions → 50%, 2× minQuestions → 100%.
  // A "session" = a chat conversation containing the Interview Mode kickoff
  // message. "Questions answered" = approximated as user messages (minus the
  // kickoff). Only contributes when interviewSessions >= 1 (otherwise null).
  const interviewConversations = state.chatConversations.filter((c) =>
    c.messages.some((m) => m.content?.includes("I'm ready to start my mock interview")),
  );
  const interviewSessions = interviewConversations.length;
  const interviewQuestions = interviewConversations.reduce((sum, c) => {
    const userMsgs = c.messages.filter((m) => m.role === "user").length;
    return sum + Math.max(0, userMsgs - 1); // -1 for the kickoff message
  }, 0);
  // v5.927 (#2): language-scaled minimum + linear warm-up.
  const languageCount = Math.max(1, userLangs.length);
  const minInterviewQuestions = 10 * languageCount;
  let interviewScore: number | null;
  if (interviewSessions === 0) {
    interviewScore = null;
  } else if (interviewQuestions < minInterviewQuestions) {
    // Below minimum — score is 0 (warms up at minInterviewQuestions).
    interviewScore = 0;
  } else {
    // Above minimum — linear scale: min → 50%, 2×min → 100%.
    const ratio = (interviewQuestions - minInterviewQuestions) / minInterviewQuestions;
    interviewScore = Math.min(100, Math.round(50 + ratio * 50));
  }

  // v5.930 (#8): Interview is ALWAYS a required, counted 4th component.
  // Previously, when interviewScore was null (no sessions), Interview was
  // excluded and the other 3 silently redistributed to 40/40/20 — making
  // Interview effectively optional. Now Interview ALWAYS contributes (0 when
  // no sessions), with fixed 4-component weights: 30/30/20/20.
  const weights = { roadmap: 0.30, quiz: 0.30, projects: 0.20, interviews: 0.20 };

  const overall = Math.round(
    roadmapProgress * weights.roadmap +
    quizAverage * weights.quiz +
    projectsCompleted * weights.projects +
    (interviewScore ?? 0) * weights.interviews,
  );

  return {
    roadmapProgress,
    quizAverage,
    projectsCompleted,
    interviewScore,
    interviewSessions,
    interviewQuestions,
    minInterviewQuestions,
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
    for (const lang of userLangs) {
      const lessons = getTrackLessons(lang);
      totalLessons += lessons.length;
      for (const l of lessons) {
        if (state.lessonProgress[l.id]?.status === "complete") completedLessons++;
      }
    }
  }
  const lessonsPct = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  // Projects: shipped count / actual assigned total (capped at 100%)
  // v5.875 (HIGH-3): was /3, now uses the dynamic assignedProjectCount.
  const shippedCount = state.projects.filter((p) => p.status === "shipped").length;
  const totalProjects = state.assignedProjectCount && state.assignedProjectCount > 0
    ? state.assignedProjectCount
    : 8;
  const projectsPct = Math.min(100, Math.round((shippedCount / totalProjects) * 100));
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
  playgroundLanguage: "javascript" | "typescript" | "python" | "html" | "css" | "sql" | "bash" | null;
  /** v5.92 (Part 5): Deep-link target for Projects tab (set by /projects/[id] URL). */
  deepLinkProjectId: string | null;
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
  setPlaygroundCode: (code: string | null, language?: "javascript" | "typescript" | "python" | "html" | "css" | "sql" | "bash" | null) => void;

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
  // v5.85 note (3.7): toggleHabit doesn't distinguish 'toggled on then off'
    // from 'never toggled' in stored entries. A proper 'touched' flag would fix
    // this, but it's a minor limitation — left as-is for now.
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
  completeOnboarding: (input: PersonalizationInput, existingRoadmap?: GeneratedRoadmap) => GeneratedRoadmap;
  setRoadmap: (roadmap: GeneratedRoadmap) => void;
  regenerateRoadmap: (input: PersonalizationInput) => GeneratedRoadmap;

  // Lessons
  setLessonProgress: (lessonId: string, status: LessonProgress["status"], quizScore?: number) => void;
  recordQuizAnswer: (lessonId: string, questionId: string, selectedIndex: number, correct: boolean) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  setLearnTabState: (partial: Partial<AppState["learnTabState"]>) => void;
  /** v5.925: persist Flashcards tab UI state (filter + currentIndex) */
  setFlashcardsTabState: (partial: Partial<AppState["flashcardsTabState"]>) => void;

  // SM-2 spaced repetition (Section 1)
  recordQuestionSM2: (lessonId: string, questionId: string, correct: boolean) => void;
  /** Open a lesson's quiz in review mode (pre-selects difficult questions). */
  startQuizReviewMode: (lessonId: string) => void;
  /** Currently active review-mode lesson ID (null = no review mode active). */
  reviewModeLessonId: string | null;

  // Flashcards (Section 2)
  recordFlashcardResult: (cardId: string, correct: boolean) => void;
  ensureFlashcardsForTrack: (trackId: string) => void;

  // Lesson bookmarks (Section 3)
  toggleLessonBookmark: (lessonId: string) => void;

  // Project submissions (capstone uploads)
  addProjectSubmission: (projectId: string, repoUrl: string, notes?: string) => void;
  /** v5.875 (HIGH-3): Set the actual number of assigned projects for the user's
   * roadmap. Called by ProjectsView on mount so Career Readiness Score uses
   * the correct denominator instead of the hardcoded /3. */
  setAssignedProjectCount: (count: number) => void;

  // Certificates
  issueCertificate: (trackId: string, trackName: string, name: string) => Promise<string>;
  /** v5.875 (CRIT-1): Internal — do NOT call directly. Use issueCertificate. */
  _issueCertificateInner: (trackId: string, trackName: string, name: string, state: AppState) => Promise<string>;
  issueCareerCertificate: (careerLabel: string, name: string) => Promise<string>;
  /** v5.76 — Auto-issue certificates when eligibility is met. Called from
   * setLessonProgress and checkAchievements. Idempotent — skips tracks
   * that already have a cert.
   * v5.875 (CRIT-1): guarded by in-memory Set to prevent duplicate fetches.
   * v5.875 (CRIT-2): respects certIssueAttempts — skips after 3 transient
   * failures within 24h, or immediately on permanent (4xx) failure. */
  tryAutoIssueCertificates: () => void;
  /** v5.875 (CRIT-2): Manual retry — resets attempt counter for a track
   * and immediately attempts issuance. Used by the "Retry" button in the UI. */
  retryCertificateIssuance: (trackId: string) => Promise<string>;
  updateCertificateName: (trackId: string, name: string) => void;
  updateCareerCertificateName: (name: string) => void;

  // AI chat
  createChatConversation: () => string;
  deleteChatConversation: (id: string) => void;
  renameChatConversation: (id: string, title: string) => void;
  addChatMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  // v5.78: update an existing chat message in-place (used for SSE streaming,
  // where the assistant message is created empty and filled in token-by-token).
  updateChatMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void;
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

  // v5.931: Notification Centre — persistent notification history.
  // NO read/unread state. Snooze suppresses popups but records still persist.
  pushNotification: (n: Omit<AppNotification, "createdAt"> & { createdAt?: string }) => void;
  dismissNotificationItem: (id: string) => void;
  clearAllNotifications: () => void;
  setNotificationSnooze: (on: boolean) => void;

  // Reset & backup
  resetAll: () => void;
  exportBackup: () => void;
  importBackup: (state: AppState) => void;
  runAutoBackup: () => void;

  // Regenerate plan
  startOnboardingAgain: () => void;
  clearForceOnboarding: () => void;

  // Section 11 — unified AI bubble: pending message for auto-send
  pendingTutorMessage: string | null;
  setPendingTutorMessage: (msg: string | null) => void;
};

export const HABIT_DEFINITIONS = [
  { id: "code", label: "Coded today", icon: "Code" },
  { id: "read", label: "Read docs/article", icon: "Book" },
  { id: "exercise", label: "Exercised", icon: "Dumbbell" },
  { id: "sleep", label: "8h sleep", icon: "Moon" },
  { id: "leetcode", label: "Solved a problem", icon: "Brain" },
];

let isResetting = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

// v5.875 (CRIT-1): In-memory Set to prevent concurrent duplicate certificate
// issuance requests for the same track. When tryAutoIssueCertificates fires
// from both setLessonProgress AND checkAchievements (~50ms apart), both would
// see certificates[trackId] as undefined and fire separate POSTs, creating
// duplicate Supabase rows. This Set ensures only one in-flight request per track.
const certIssuingInProgress = new Set<string>();

// v5.875 (CRIT-2): Constants for certificate retry backoff.
const CERT_MAX_ATTEMPTS = 3;
const CERT_RETRY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const CERT_TRANSIENT_BACKOFF_MS = 30 * 1000; // 30 seconds
let lastPersistedState: AppState | null = null;
function persist(state: AppState) {
    if (isResetting) return;
    lastPersistedState = state;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState(state);
    saveTimer = null;
  }, 200);
}

// v5.77 fix: flush pending saves on page hide / unload. Previously, if a user
// completed an action and closed the tab within 200ms, the debounced save
// never fired and the change was lost.
if (typeof window !== "undefined") {
  const flushPendingSave = () => {
    if (saveTimer && lastPersistedState) {
      clearTimeout(saveTimer);
      saveTimer = null;
      try {
        saveState(lastPersistedState);
      } catch (err) {
        console.warn("[launchpad] flush on unload failed:", err);
      }
    }
  };
  window.addEventListener("beforeunload", flushPendingSave);
  window.addEventListener("pagehide", flushPendingSave);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPendingSave();
    }
  });
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
    deepLinkProjectId: null,
    forceOnboarding: false,
    reviewModeLessonId: null,
    pendingTutorMessage: null,

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
      // v5.85 fix (2.9): reset completedToday if it's a new day.
      // Previously completedToday stayed true forever after the first completion.
      if (loaded.dailyChallenge?.lastChallengeDate !== today) {
        updateState((s) => ({
          ...s,
          dailyChallenge: {
            ...s.dailyChallenge,
            completedToday: false,
          },
        }));
      }
      // v5.79: lazily load the 6MB ALL_LESSONS array in the background.
      // This is a separate webpack chunk that downloads after the app mounts,
      // so it doesn't block the initial page render. Selectors that need
      // lessons return [] until the load completes, then re-render with data.
      if (typeof window !== "undefined") {
        loadAllLessons().then(() => {
          // Trigger a re-render by updating state (selectors will now return data).
          updateState((s) => ({ ...s }));
        }).catch((err) => {
          console.warn("[launchpad] failed to load lessons content:", err);
        });
      }
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
        // Also track per-hour activity for time-of-day analytics (Section 8).
        const hour = new Date().getHours();
        const newHourlyActivity = {
          ...s.hourlyActivity,
          [hour]: (s.hourlyActivity[hour] || 0) + 1,
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

        return { ...s, tasks: newTasks, activity: newActivity, hourlyActivity: newHourlyActivity, streak: newStreak };
      });
      // Check achievements after task toggle
      setTimeout(() => get().checkAchievements(), 50);
    },

    isTaskComplete: (taskId) => !!get().state.tasks[taskId]?.completedAt,

    isPhaseUnlocked: (phaseNumber) => {
      const s = get().state;
      if (!s.roadmap) return false;
      if (phaseNumber === 1) return true;
      // Phases 1 and 2 are always unlocked for exploration.
      // Phase N (N>2) unlocks when phase N-1 is at least 50% complete.
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

    // v5.85 note (3.7): toggleHabit doesn't distinguish 'toggled on then off'
    // from 'never toggled' in stored entries. A proper 'touched' flag would fix
    // this, but it's a minor limitation — left as-is for now.
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
        // v5.77 fix: if minutes === 0, CLEAR the snooze (used by CalendarNotifier
        // after a snooze-expired re-fire to prevent the infinite re-fire loop).
        const snoozedUntil = minutes <= 0
          ? undefined
          : new Date(Date.now() + minutes * 60 * 1000).toISOString();
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
        // v5.77 fix: no longer marks the underlying event as `completed: true`.
        // Dismissal is a UI action — it should only stop the notification, not
        // mark the event itself as done. Also clears snoozedUntil.
        return {
          ...s,
          calendarEvents: s.calendarEvents.map((e) =>
            e.id === eventId
              ? { ...e, notifiedFor: new Date().toISOString(), snoozedUntil: undefined }
              : e,
          ),
          activeNotifications: s.activeNotifications.filter((n) => n !== eventId),
        };
      }),

    completeOnboarding: (input, existingRoadmap?) => {
      // Use the roadmap OnboardingFlow already generated (deterministic engine,
      // v5.923) if provided; otherwise generate one on the fly.
      // v5.91 (Part 2): pass autoInjected languages to generateRoadmap
      const roadmap = existingRoadmap ?? generateRoadmap(input);
      // Validate
      const validation = validateRoadmap(roadmap, input);
      if (!validation.valid) {
        console.warn("[launchpad] roadmap validation issues:", validation.errors);
      }
      // Assign daily challenge pool based on selected languages.
      // v5.77 fix: use the already-imported ESM `selectPoolForLanguages` instead
      // of a dynamic `require()` that throws under Turbopack and silently broke
      // daily challenges for every new user.
      // v5.88: pass skillLevel so beginners only get beginner-difficulty tasks.
      let dailyPool: string[] = [];
      try {
        dailyPool = selectPoolForLanguages(input.selectedLanguageIds, undefined, input.skillLevel);
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

    setLessonProgress: (lessonId, status, quizScore) => {
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

        // Auto-complete linked roadmap tasks when a lesson is completed.
        // v5.925 FIX (BUG 3 — roadmap auto-completion scope too broad):
        // Previously this loop matched ANY task with a linked lessonId in ANY
        // phase, which (combined with linkTasksToLessons stamping lessonIds on
        // tasks in Foundations, Milestone, AI Bonus, Capstone, etc.) caused
        // lesson/quiz completions to auto-complete roadmap tasks in phases
        // that have no genuine 1:1 mapping to a language track. Now auto-
        // completion is restricted to phases whose title matches the
        // "Second Language: X" pattern — the ONLY phase type with a real 1:1
        // mapping to a language track's lesson completion. All other phase
        // types (Foundations, Core Language Mastery, Building Blocks,
        // Specialization, Advanced, Capstone & Career, AI Bonus Track, etc.)
        // must be completed via the manual toggleTask action.
        let newTasks = s.tasks;
        let newActivity = s.activity;
        let newStreak = s.streak;
        if (status === "complete" && s.roadmap) {
          const today = todayKey();
          for (const phase of s.roadmap.phases) {
            // v5.929 (#1): auto-complete tasks in ALL language phases (primary +
            // secondary), identified by lessonGroups presence. The old regex
            // /^Second Language:\s/ no longer matches the new unique titles.
            if (!phase.lessonGroups || phase.lessonGroups.length === 0) continue;
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
      });
      // v5.76 — Synchronously check for certificate eligibility after the
      // state has been committed by updateState above. No setTimeout —
      // get().state is already updated, so the eligibility check runs
      // against the freshest data. The actual Supabase API call inside
      // issueCertificate is async (fire-and-forget), but the eligibility
      // decision and the "should we issue?" logic are synchronous.
      if (status === "complete") {
        get().tryAutoIssueCertificates();
        // v5.77 fix: trigger achievement check after auto-completing linked
        // roadmap tasks. Previously, badges like `first-task`, `code-veteran`,
        // and `all-6-phases` wouldn't fire from lesson-completion cascades
        // until the next external trigger.
        setTimeout(() => get().checkAchievements(), 50);
      }
    },

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
        // Also record SM-2 state for the question (Section 1).
        const sm2Key = `${lessonId}:${questionId}`;
        const prevRecord = s.questionRecords?.[sm2Key];
        const newRecord = recordQuestion(prevRecord, questionId, correct);
        return {
          ...s,
          lessonProgress: { ...s.lessonProgress, [lessonId]: updated },
          questionRecords: { ...(s.questionRecords ?? {}), [sm2Key]: newRecord },
        };
      }),

    // SM-2 spaced repetition (Section 1)
    recordQuestionSM2: (lessonId, questionId, correct) =>
      updateState((s) => {
        const sm2Key = `${lessonId}:${questionId}`;
        const prevRecord = s.questionRecords?.[sm2Key];
        const newRecord = recordQuestion(prevRecord, questionId, correct);
        return {
          ...s,
          questionRecords: { ...(s.questionRecords ?? {}), [sm2Key]: newRecord },
        };
      }),

    startQuizReviewMode: (lessonId) => set({ reviewModeLessonId: lessonId }),

    // Flashcards (Section 2)
    recordFlashcardResult: (cardId, correct) =>
      updateState((s) => {
        const existing = s.flashcards.find((f) => f.id === cardId);
        if (!existing) return s;
        const updated = recordFlashcard(existing, correct);
        return {
          ...s,
          flashcards: s.flashcards.map((f) => (f.id === cardId ? updated : f)),
        };
      }),

    ensureFlashcardsForTrack: (trackId) =>
      updateState((s) => {
        // Lazy-populate flashcards for a track the first time the user
        // visits the Flashcards tab for that track.
        const generated = generateFlashcardsForTrack(trackId);
        const existingIds = new Set(s.flashcards.map((f) => f.id));
        const newCards = generated.filter((f) => !existingIds.has(f.id));
        if (newCards.length === 0) return s;
        return { ...s, flashcards: [...s.flashcards, ...newCards] };
      }),

    // Lesson bookmarks (Section 3)
    toggleLessonBookmark: (lessonId) =>
      updateState((s) => {
        // v5.77 fix: use `?? []` consistently to avoid crash if bookmarkedLessons is undefined.
        const current = s.bookmarkedLessons ?? [];
        const isBookmarked = current.includes(lessonId);
        return {
          ...s,
          bookmarkedLessons: isBookmarked
            ? current.filter((id) => id !== lessonId)
            : [...current, lessonId],
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

    // v5.875 (HIGH-3): Store the actual number of assigned projects.
    setAssignedProjectCount: (count) =>
      updateState((s) => ({ ...s, assignedProjectCount: count })),

    setLearnTabState: (partial) =>
      updateState((s) => ({
        ...s,
        learnTabState: { ...s.learnTabState, ...partial },
      })),

    // v5.925: persist Flashcards tab UI state so review position survives refresh.
    setFlashcardsTabState: (partial) =>
      updateState((s) => ({
        ...s,
        flashcardsTabState: { ...s.flashcardsTabState, ...partial },
      })),

    issueCertificate: async (trackId, trackName, name) => {
      const state = get().state;

      // v5.76 — IDEMPOTENT: if a cert already exists for this track, return
      // the existing ID. Never issue a duplicate.
      const existing = state.certificates[trackId];
      if (existing) {
        return existing.certId;
      }

      // v5.875 (CRIT-1): RACE CONDITION GUARD — if an issuance is already
      // in-flight for this track, return "" instead of firing a duplicate
      // request. This prevents two concurrent POSTs (from
      // setLessonProgress + checkAchievements firing ~50ms apart) from
      // creating duplicate Supabase rows.
      if (certIssuingInProgress.has(trackId)) {
        console.log("[issueCertificate] issuance already in-flight for", trackId);
        return "";
      }

      // v5.875 (CRIT-2): RETRY BACKOFF — if we've already tried and failed
      // CERT_MAX_ATTEMPTS times within the last 24h, don't retry
      // automatically. The user can manually retry via retryCertificateIssuance.
      const attempts = state.certIssueAttempts[trackId];
      if (attempts) {
        if (attempts.permanentFail) {
          console.log("[issueCertificate] permanent failure recorded for", trackId, "— use manual retry");
          return "";
        }
        if (attempts.count >= CERT_MAX_ATTEMPTS && (Date.now() - attempts.lastAttempt) < CERT_RETRY_COOLDOWN_MS) {
          console.log("[issueCertificate] max attempts reached for", trackId, "— cooldown active");
          return "";
        }
      }

      certIssuingInProgress.add(trackId);
      try {
        return await get()._issueCertificateInner(trackId, trackName, name, state);
      } finally {
        certIssuingInProgress.delete(trackId);
      }
    },

    // v5.875 (CRIT-1/CRIT-2): Inner implementation — separated so the
    // in-flight guard in issueCertificate can wrap it in try/finally.
    _issueCertificateInner: async (trackId, trackName, name, state) => {
      // v5.84: build the progress proof from the user's actual lesson progress.
      const trackLessons = getTrackLessons(trackId);
      const completedLessonIds: string[] = [];
      const quizScores: Record<string, number> = {};
      for (const lesson of trackLessons) {
        const prog = state.lessonProgress[lesson.id];
        if (prog?.status === "complete") {
          completedLessonIds.push(lesson.id);
        }
        if (prog?.bestQuizScore !== undefined && prog.bestQuizScore !== null) {
          quizScores[lesson.id] = prog.bestQuizScore;
        } else if (prog?.questionAnswers && lesson.quiz.length > 0) {
          let correct = 0;
          let answered = 0;
          for (const q of lesson.quiz) {
            const key = `${lesson.id}:${q.id}`;
            const ans = prog.questionAnswers[key];
            if (ans) {
              answered++;
              if (ans.correct) correct++;
            }
          }
          if (answered > 0) {
            const computedScore = Math.round((correct / lesson.quiz.length) * 100);
            quizScores[lesson.id] = computedScore;
          }
        }
      }

      // v5.868: handle gap languages (tracks with no lessons).
      if (trackLessons.length === 0) {
        console.error("[issueCertificate] track has no lessons (gap language):", trackId);
        return "";
      }

      // v5.866: client-side pre-validation.
      if (completedLessonIds.length < trackLessons.length) {
        console.error("[issueCertificate] client-side validation: not enough completed lessons", {
          trackId, completed: completedLessonIds.length, expected: trackLessons.length,
        });
        return "";
      }
      if (Object.keys(quizScores).length < trackLessons.length) {
        console.error("[issueCertificate] client-side validation: not enough quiz scores", {
          trackId, scores: Object.keys(quizScores).length, expected: trackLessons.length,
        });
        return "";
      }

      let certId = "";
      let issueError: string | undefined;
      let httpStatus = 0;

      try {
        const res = await fetch("/api/certificates/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            holderName: name,
            certificateType: "language",
            languageCompleted: trackId,
            joinedDate: state.profile.startDate || new Date().toISOString(),
            progressProof: {
              completedLessonIds,
              quizScores,
            },
          }),
        });
        httpStatus = res.status;
        if (res.ok) {
          const data = await res.json();
          certId = data.certId;
        } else {
          const data = await res.json().catch(() => ({}));
          issueError = data.error || `HTTP ${res.status}`;
        }
      } catch (err) {
        issueError = (err as Error).message;
      }

      // v5.875 (CRIT-2): Record the attempt outcome.
      // 4xx = permanent failure (validation/forbidden) — mark as permanent.
      // 5xx/network/rate-limit = transient — increment count, allow retry after cooldown.
      const isPermanentFail = httpStatus >= 400 && httpStatus < 500;
      updateState((s) => {
        const prev = s.certIssueAttempts[trackId] ?? { count: 0, lastAttempt: 0 };
        return {
          ...s,
          certIssueAttempts: {
            ...s.certIssueAttempts,
            [trackId]: {
              count: prev.count + 1,
              lastAttempt: Date.now(),
              permanentFail: isPermanentFail ? true : prev.permanentFail,
            },
          },
        };
      });

      if (!certId) {
        console.error("[issueCertificate] failed:", issueError, "(permanent:", isPermanentFail, ")");
        return "";
      }

      // Success — clear attempt tracking for this track.
      updateState((s) => {
        const updated = { ...s.certIssueAttempts };
        delete updated[trackId];
        return { ...s, certIssueAttempts: updated };
      });

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
      // v5.931: record the language-certificate issuance as a persistent notification.
      get().pushNotification({
        id: `certificate:language:${trackId}`,
        category: "certificate",
        title: `Certificate earned: ${trackName}`,
        body: `Your ${trackName} certificate (ID ${certId}) has been issued and is ready to download.`,
        icon: "🏆",
        actionView: "dashboard",
        actionLabel: "View certificate",
      });
      return certId;
    },

    issueCareerCertificate: async (careerLabel, name) => {
      const state = get().state;

      // v5.76 — IDEMPOTENT: if a career cert already exists, return it.
      if (state.careerCertificate) {
        return state.careerCertificate.certId;
      }

      // v5.84: build the progress proof — career certs require 100% readiness.
      const readinessScore = selectCareerReadinessScore(state).overall;

      // v5.865 (B.CERT.3): NO local fallback. If Supabase insert fails,
      // return empty string to signal failure.
      let certId = "";
      let issueError: string | undefined;

      try {
        const res = await fetch("/api/certificates/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            holderName: name,
            certificateType: "career",
            languageCompleted: null,
            joinedDate: state.profile.startDate || new Date().toISOString(),
            progressProof: {
              careerReadinessScore: readinessScore,
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          certId = data.certId;
        } else {
          const data = await res.json().catch(() => ({}));
          issueError = data.error || `HTTP ${res.status}`;
        }
      } catch (err) {
        issueError = (err as Error).message;
      }

      if (!certId) {
        console.error("[issueCareerCertificate] failed:", issueError);
        return "";
      }

      const cert = {
        certId,
        issuedAt: new Date().toISOString(),
        name,
        careerLabel,
      };
      updateState((s) => ({ ...s, careerCertificate: cert }));
      // v5.931: record the Career Master Certificate as a persistent notification.
      get().pushNotification({
        id: "certificate:career",
        category: "certificate",
        title: "Career Master Certificate earned!",
        body: `Congratulations ${name}! Your Career Master Certificate (${careerLabel}) is ready to download. ID ${certId}.`,
        icon: "🏆",
        actionView: "career",
        actionLabel: "View certificate",
      });
      return certId;
    },

    // v5.76 — Auto-issue certificates when eligibility is met.
    // Called from setLessonProgress (after quiz completion) and
    // checkAchievements (after career readiness hits 100%).
    // Idempotent: skips tracks that already have a cert.
    // v5.875 (CRIT-1/CRIT-2): The in-flight Set + attempt tracking in
    // issueCertificate now prevents duplicate fetches and infinite retries.
    // tryAutoIssueCertificates just checks eligibility — the guard logic
    // inside issueCertificate handles dedup and backoff.
    tryAutoIssueCertificates: () => {
      const s = get().state;
      if (!s.roadmap) return;
      const holderName = s.profile.name || "Learner";

      // Check each roadmap language for certificate eligibility
      for (const langId of s.roadmap.languageIds) {
        // Skip if cert already exists
        if (s.certificates[langId]) continue;

        // v5.875 (CRIT-2): Skip if this track has a permanent failure
        // or is in cooldown — prevents hammering the endpoint.
        const attempts = s.certIssueAttempts[langId];
        if (attempts) {
          if (attempts.permanentFail) continue;
          if (attempts.count >= CERT_MAX_ATTEMPTS && (Date.now() - attempts.lastAttempt) < CERT_RETRY_COOLDOWN_MS) continue;
        }

        // Skip if issuance is already in-flight (CRIT-1)
        if (certIssuingInProgress.has(langId)) continue;

        // Get lessons for this track
        const trackLessons = getTrackLessons(langId);
        if (trackLessons.length === 0) continue;

        const { eligible } = selectCertificateEligible(s, langId, trackLessons);
        if (eligible) {
          // Auto-issue — fire and forget (async, doesn't block the UI)
          const trackName = ALL_LANGUAGE_INFO[langId]?.name ?? langId;
          get().issueCertificate(langId, trackName, holderName).catch(() => {
            // Error already logged + tracked in issueCertificate
          });
        }
      }

      // Check career certificate eligibility (100% career readiness)
      if (!s.careerCertificate) {
        const careerKey = "__career__";
        const careerAttempts = s.certIssueAttempts[careerKey];
        if (careerAttempts) {
          if (careerAttempts.permanentFail) return;
          if (careerAttempts.count >= CERT_MAX_ATTEMPTS && (Date.now() - careerAttempts.lastAttempt) < CERT_RETRY_COOLDOWN_MS) return;
        }
        if (certIssuingInProgress.has(careerKey)) return;

        const { overall } = selectCareerReadinessScore(s);
        if (overall >= 100) {
          const careerLabel = s.roadmap.careerLabel;
          get().issueCareerCertificate(careerLabel, holderName).catch(() => {
            // Error already logged
          });
        }
      }
    },

    // v5.875 (CRIT-2): Manual retry — resets the attempt counter for a
    // track and immediately attempts issuance. Bypasses the cooldown.
    retryCertificateIssuance: async (trackId) => {
      const s = get().state;
      // Clear attempt tracking for this track
      updateState((st) => {
        const updated = { ...st.certIssueAttempts };
        delete updated[trackId];
        return { ...st, certIssueAttempts: updated };
      });
      const holderName = s.profile.name || "Learner";
      const trackName = ALL_LANGUAGE_INFO[trackId]?.name ?? trackId;
      return get().issueCertificate(trackId, trackName, holderName);
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
          // v5.77 fix: use `undefined` instead of `null` to match the AppState type
          // (`activeChatId: string | undefined`). `null` caused type-check failures
          // and broke `=== undefined` comparisons elsewhere.
          activeChatId: s.activeChatId === id ? (filtered[0]?.id ?? undefined) : s.activeChatId,
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
                    // v5.868 BUG A FIX: preserve the caller-provided id if it exists.
                    // Previously this ALWAYS overwrote the id with a new random one.
                    // The streaming code creates an assistant message with a specific id
                    // (assistantMsgId), then calls updateChatMessage(chatId, assistantMsgId, ...).
                    // But addChatMessage was overriding that id, so updateChatMessage could
                    // never find the message — the bubble stayed empty forever.
                    id: (message as ChatMessage).id || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    timestamp: (message as ChatMessage).timestamp || new Date().toISOString(),
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

    // v5.78: update an existing chat message in-place. Used by the SSE
    // streaming consumer to append tokens to the assistant message.
    updateChatMessage: (conversationId, messageId, patch) =>
      updateState((s) => ({
        ...s,
        chatConversations: s.chatConversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, ...patch } : m,
                ),
                updatedAt: new Date().toISOString(),
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
            // Increment lifetime count only when this is a *new* day's
            // completion (idempotent — re-clicking "Complete" on the same
            // day doesn't inflate the counter).
            totalCompleted: (s.dailyChallenge.totalCompleted ?? 0) + (wasToday ? 0 : 1),
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
        // v5.931: also record each newly-earned badge as a persistent
        // notification (visible in the Notification Centre). pushNotification
        // dedups on id, so repeated checkAchievements calls are safe.
        for (const badgeId of newlyEarned) {
          const ach = ACHIEVEMENTS.find((a) => a.id === badgeId);
          if (ach) {
            get().pushNotification({
              id: `achievement:${badgeId}`,
              category: "achievement",
              title: `Badge unlocked: ${ach.title}`,
              body: ach.description,
              icon: ach.icon,
              actionView: "account",
              actionLabel: "View badges",
            });
          }
        }
      }
      // v5.76 — Synchronously check career cert eligibility. The state
      // has already been committed by updateState above (if badges changed),
      // so selectCareerReadinessScore runs against fresh data.
      get().tryAutoIssueCertificates();
      return newlyEarned;
    },

    dismissBadgeToast: (badgeId) =>
      set({ pendingBadgeToasts: get().pendingBadgeToasts.filter((id) => id !== badgeId) }),

    // v5.931: Notification Centre actions.
    // pushNotification is idempotent on `id` (dedup) — safe to call from
    // checkAchievements / issueCertificate which may fire repeatedly.
    pushNotification: (n) => {
      const now = n.createdAt ?? new Date().toISOString();
      updateState((s) => {
        const existing = s.notifications ?? [];
        if (existing.some((x) => x.id === n.id)) return s; // dedup
        const record: AppNotification = { ...n, createdAt: now };
        // Cap at 200 (most recent first) to bound localStorage growth.
        return { ...s, notifications: [record, ...existing].slice(0, 200) };
      });
    },
    dismissNotificationItem: (id) =>
      updateState((s) => ({
        ...s,
        notifications: (s.notifications ?? []).filter((x) => x.id !== id),
      })),
    clearAllNotifications: () =>
      updateState((s) => ({ ...s, notifications: [] })),
    setNotificationSnooze: (on) => {
      get().setPreference("notificationSnooze", on);
    },

    resetAll: () => {
      // v5.865 fix (3.3/B.8): set isResetting BEFORE clearing, clear AFTER.
      // This prevents any in-flight debounced save from writing the pre-reset
      // state back to localStorage AFTER the reset.
      isResetting = true;
      try {
        if (saveTimer) {
          clearTimeout(saveTimer);
          saveTimer = null;
        }
        if (typeof window !== "undefined") {
          // v5.77 fix: clear ALL launchpad:* keys, not just the main state key.
          // v5.865 fix (3.4): use the same prefix filter as SettingsView
          // ("launchpad" prefix covers "launchpad:" and "launchpad-")
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && (key.startsWith("launchpad") || key.startsWith("lp-"))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => window.localStorage.removeItem(key));
        }
        set({ state: DEFAULT_STATE });
      } finally {
        // Allow saves again after a short delay (let React settle).
        setTimeout(() => { isResetting = false; }, 500);
      }
    },

    exportBackup: () => exportState(get().state),

    importBackup: (imported) => {
      // v5.77 fix: clear any pending save before importing to avoid races.
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      // v5.77 fix: defensively merge with DEFAULT_STATE so missing fields
      // don't crash the next hydration.
      const safe = { ...DEFAULT_STATE, ...imported };
      persist(safe);
      set({ state: safe });
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

    // Section 11 — unified AI bubble
    setPendingTutorMessage: (msg) => set({ pendingTutorMessage: msg }),
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
// v5.90 (PART 4): These are now FALLBACK lists only. The live model list is fetched
// from each provider's API via /api/models and cached for 1 hour (see use-provider-models.ts).
// These static lists are used only when the live fetch fails or before the first fetch completes.
// IMPORTANT: do NOT default to "llama-3.3-70b-versatile" for Groq — it was deprecated June 17, 2026.
export const PROVIDER_MODELS: Record<AIProviderKey, string[]> = {
  // v5.90 (PART 4): Fallback lists — match /api/models FALLBACK_MODELS exactly.
  gemini: ["gemini-2.5-flash-lite", "gemini-3-flash", "gemini-3.5-flash"],
  groq: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
  openrouter: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "openai/gpt-oss-120b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
    "openrouter/free",
  ],
  openai: ["gpt-4o-mini"],
  anthropic: ["claude-sonnet-4-5"],
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
    // v5.85 fix (0.2): removed gemini-2.0-flash (shut down).
    freeModels: ["gemini-2.5-flash"],
    getFreeKeyUrl: "https://aistudio.google.com",
  },
  groq: {
    label: "Groq",
    icon: "⚡",
    recommended: true,
    // v5.90 (PART 4): updated — llama-3.3-70b-versatile was deprecated June 17, 2026.
    freeModels: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
    getFreeKeyUrl: "https://console.groq.com",
  },
  openrouter: {
    label: "OpenRouter",
    icon: "🌐",
    recommended: true,
    // v5.90 (PART 4): updated with current free models.
    freeModels: ["meta-llama/llama-3.3-70b-instruct:free", "openai/gpt-oss-120b:free"],
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
    // v5.85 fix (0.2): gemini-2.0-flash was shut down June 1, 2026.
    // All old models now migrate to gemini-2.5-flash (the current free model).
    "gemini-1.5-flash": "gemini-2.5-flash",
    "gemini-1.5-pro": "gemini-2.5-flash",
    "gemini-2.0-flash": "gemini-2.5-flash",
    "gemini-2.0-flash-lite": "gemini-2.5-flash",
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
