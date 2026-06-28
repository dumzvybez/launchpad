import type { AppState } from "./types";

export const STORAGE_KEY = "launchpad:v4:state";
export const SCHEMA_VERSION = 4;

export const DEFAULT_STATE: AppState = {
  schemaVersion: SCHEMA_VERSION,
  profile: {
    name: "",
    goal: "",
    university: "",
  },
  tasks: {},
  notes: [],
  journal: [],
  projects: [],
  focusSessions: [],
  habits: [],
  badges: [],
  bookmarks: [],
  calendarEvents: [],
  onboardingCompleted: false,
  streak: {
    current: 0,
    longest: 0,
    freezes: 2,
  },
  activity: {},
  preferences: {
    theme: "dark",
    reduceMotion: false,
    focusMode: false,
    density: "comfortable",
    showSplash: true,
    weekStartsOn: 1,
    backgroundTheme: "aurora",
    tourCompleted: false,
    mobileBannerDismissed: false,
  },
  lessonProgress: {},
  chatConversations: [],
  aiSettings: {
    provider: "zai",
    apiKey: "",
    model: "glm-4.6",
    temperature: 0.7,
  },
  rateLimitTimestamps: [],
  dailyChallenge: {
    currentStreak: 0,
    completedToday: false,
  },
};

/** Safely load state from localStorage, with schema migration */
export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<AppState>;

    // Try migrating from older keys
    if (!raw || !parsed) return DEFAULT_STATE;

    return {
      ...DEFAULT_STATE,
      ...parsed,
      schemaVersion: SCHEMA_VERSION,
      profile: { ...DEFAULT_STATE.profile, ...parsed.profile },
      preferences: {
        ...DEFAULT_STATE.preferences,
        ...parsed.preferences,
        backgroundTheme: parsed.preferences?.backgroundTheme ?? "aurora",
      },
      streak: { ...DEFAULT_STATE.streak, ...parsed.streak },
      lessonProgress: parsed.lessonProgress ?? {},
      chatConversations: parsed.chatConversations ?? [],
      aiSettings: { ...DEFAULT_STATE.aiSettings, ...parsed.aiSettings },
      rateLimitTimestamps: parsed.rateLimitTimestamps ?? [],
      dailyChallenge: { ...DEFAULT_STATE.dailyChallenge, ...parsed.dailyChallenge },
      badges: parsed.badges ?? [],
    };
  } catch (e) {
    console.warn("[launchpad] failed to load state, resetting:", e);
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[launchpad] failed to save state:", e);
  }
}

export function exportState(state: AppState): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `launchpad-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importState(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppState;
        if (!data || typeof data !== "object") {
          reject(new Error("Invalid backup file"));
          return;
        }
        resolve({ ...DEFAULT_STATE, ...data, schemaVersion: SCHEMA_VERSION });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// ============================================================
// Auto-backup — daily snapshot to localStorage
// ============================================================

const AUTO_BACKUP_KEY = "launchpad:v4:auto-backup";

export function saveAutoBackup(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    const snapshot = {
      savedAt: new Date().toISOString(),
      state,
    };
    window.localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(snapshot));
    window.localStorage.setItem("launchpad:v4:last-auto-backup", snapshot.savedAt);
  } catch (e) {
    console.warn("[launchpad] auto-backup failed:", e);
  }
}

export function getAutoBackup(): { savedAt: string; state: AppState } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTO_BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getLastAutoBackupTime(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("launchpad:v4:last-auto-backup");
}

// ============================================================
// Date helpers — consistent YYYY-MM-DD formatting
// ============================================================

export function todayKey(): string {
  return dateKey(new Date());
}

export function dateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = 1000 * 60 * 60 * 24;
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bMid.getTime() - aMid.getTime()) / ms);
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}
