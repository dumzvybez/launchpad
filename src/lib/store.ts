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
  // Badge XP
  for (const b of state.badges) {
    if (b.unlockedAt) xp += b.xp;
  }
  // Lesson XP
  for (const p of Object.values(state.lessonProgress)) {
    if (p.status === "complete") xp += 50;
  }
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

// Level system: each level needs progressively more XP
export function selectLevel(state: AppState): {
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  pct: number;
} {
  const totalXP = selectEarnedXP(state);
  let level = 1;
  let remaining = totalXP;
  let needed = 300;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = Math.round(needed * 1.3);
  }
  return {
    level,
    xpInLevel: remaining,
    xpForNextLevel: needed,
    pct: Math.round((remaining / needed) * 100),
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

  // Onboarding & roadmap
  completeOnboarding: (input: PersonalizationInput) => GeneratedRoadmap;
  setRoadmap: (roadmap: GeneratedRoadmap) => void;
  regenerateRoadmap: (input: PersonalizationInput) => GeneratedRoadmap;

  // Lessons
  setLessonProgress: (lessonId: string, status: LessonProgress["status"], quizScore?: number) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;

  // AI chat
  createChatConversation: () => string;
  deleteChatConversation: (id: string) => void;
  renameChatConversation: (id: string, title: string) => void;
  addChatMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActiveChat: (id: string | null) => void;
  clearAllChats: () => void;
  setAISettings: (patch: Partial<AISettings>) => void;
  recordRateLimitHit: () => void;
  acknowledgeAIWarning: () => void;

  // Daily challenge
  completeDailyChallenge: () => void;

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
          };
        } else {
          newStreak = {
            current: 1,
            longest: Math.max(s.streak.longest, 1),
            lastActiveDate: today,
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
      })),

    completeOnboarding: (input) => {
      const roadmap = generateRoadmap(input);
      // Validate
      const validation = validateRoadmap(roadmap, input);
      if (!validation.valid) {
        console.warn("[launchpad] roadmap validation issues:", validation.errors);
      }
      updateState((s) => ({
        ...s,
        onboardingCompleted: true,
        roadmap,
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
      updateState((s) => ({ ...s, chatConversations: [], activeChatId: null })),

    setAISettings: (patch) =>
      updateState((s) => ({ ...s, aiSettings: { ...s.aiSettings, ...patch } })),

    recordRateLimitHit: () =>
      updateState((s) => ({
        ...s,
        rateLimitTimestamps: [...s.rateLimitTimestamps, Date.now()].filter(
          (ts) => Date.now() - ts < 2 * 60 * 60 * 1000,
        ),
      })),

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

// Provider model presets
export const PROVIDER_MODELS: Record<AIProviderKey, string[]> = {
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  groq: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it", "llama-3.1-70b-versatile"],
  openrouter: ["google/gemini-2.5-flash", "openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.3-70b-instruct"],
  custom: [],
};

export const PROVIDER_INFO: Record<AIProviderKey, { label: string; icon: string; recommended: boolean; freeModels: string[] }> = {
  gemini: { label: "Google Gemini ⭐", icon: "✨", recommended: true, freeModels: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"] },
  groq: { label: "Groq ⭐", icon: "⚡", recommended: true, freeModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it", "llama-3.1-70b-versatile"] },
  openai: { label: "OpenAI", icon: "🤖", recommended: false, freeModels: [] },
  anthropic: { label: "Anthropic", icon: "🧠", recommended: false, freeModels: [] },
  openrouter: { label: "OpenRouter ⭐", icon: "🌐", recommended: true, freeModels: ["google/gemini-2.5-flash", "meta-llama/llama-3.3-70b-instruct"] },
  custom: { label: "Custom Endpoint", icon: "🔧", recommended: false, freeModels: [] },
};
