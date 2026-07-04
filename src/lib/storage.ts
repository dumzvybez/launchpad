import type { AppState } from "./types";

export const STORAGE_KEY = "launchpad:v4:state";
export const SCHEMA_VERSION = 4;

// v5.84: List of all known previous storage keys, in version order.
// When migrating, we check each in order (newest first) and use the first
// one that has data. This prevents silent data loss on version bumps.
const PREVIOUS_STORAGE_KEYS = [
  "launchpad:v3:state",
  "launchpad:v2:state",
  "launchpad:v1:state",
  "launchpad:state",  // original key before versioning
];

/**
 * v5.84: Migrate state from an older schema version to the current one.
 * Each migration step transforms the state from version N to version N+1.
 * This ensures user data is never silently lost on version bumps.
 */
function migrateState(oldState: Record<string, unknown>, fromVersion: number): Partial<AppState> {
  let state = { ...oldState };

  // Migration v1 → v2: aiSettings.temperature was added
  if (fromVersion < 2) {
    if (!state.aiSettings) state.aiSettings = {};
    if (state.aiSettings.temperature === undefined) {
      state.aiSettings.temperature = 0.7;
    }
  }

  // Migration v2 → v3: flashcards, questionRecords, bookmarkedLessons were added
  if (fromVersion < 3) {
    if (!state.flashcards) state.flashcards = [];
    if (!state.questionRecords) state.questionRecords = {};
    if (!state.bookmarkedLessons) state.bookmarkedLessons = [];
    if (!state.dailyChallenge) {
      state.dailyChallenge = { currentStreak: 0, completedToday: false, totalCompleted: 0 };
    }
  }

  // Migration v3 → v4: certificates, careerCertificate, dailyChallengePool were added
  if (fromVersion < 4) {
    if (!state.certificates) state.certificates = {};
    if (!state.projectSubmissions) state.projectSubmissions = [];
    if (!state.activeNotifications) state.activeNotifications = [];
    if (!state.learnTabState) {
      state.learnTabState = { selectedTrack: null, selectedLessonId: null, tab: "tracks" };
    }
  }

  // Mark as current schema version
  state.schemaVersion = SCHEMA_VERSION;
  return state as Partial<AppState>;
}

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
  hourlyActivity: {},
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
    hideVideoSupplements: false,
  },
  lessonProgress: {},
  chatConversations: [],
  aiSettings: {
    provider: "gemini",
    apiKey: "",
    model: "gemini-2.5-flash",
    temperature: 0.7,
  },
  rateLimitTimestamps: [],
  dailyChallenge: {
    currentStreak: 0,
    completedToday: false,
    totalCompleted: 0,
  },
  learnTabState: {
    selectedTrack: null,
    selectedLessonId: null,
    tab: "tracks",
  },
  certificates: {},
  projectSubmissions: [],
  activeNotifications: [],
  questionRecords: {},
  flashcards: [],
  bookmarkedLessons: [],
};

/** Safely load state from localStorage, with schema migration */
export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    let cameFromMigration = false;
    let oldVersion = SCHEMA_VERSION;

    // v5.84: If the current key doesn't exist, check for older version keys
    // and migrate the data instead of silently starting fresh.
    if (!raw) {
      for (const oldKey of PREVIOUS_STORAGE_KEYS) {
        const oldRaw = window.localStorage.getItem(oldKey);
        if (oldRaw) {
          console.log(`[launchpad] migrating state from ${oldKey} → ${STORAGE_KEY}`);
          raw = oldRaw;
          cameFromMigration = true;
          // Determine the old version from the key name
          const versionMatch = oldKey.match(/v(\d+):/);
          oldVersion = versionMatch ? parseInt(versionMatch[1], 10) : 1;
          // Remove the old key after successful migration (below)
          break;
        }
      }
    }

    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<AppState>;

    // v5.84: Apply field-level migrations if loading from an older version
    let migratedParsed = parsed;
    if (cameFromMigration || (parsed.schemaVersion && parsed.schemaVersion < SCHEMA_VERSION)) {
      migratedParsed = migrateState(parsed as Record<string, unknown>, parsed.schemaVersion ?? oldVersion);
      console.log(`[launchpad] state migrated from v${oldVersion} to v${SCHEMA_VERSION}`);
    }

    const result = {
      ...DEFAULT_STATE,
      ...migratedParsed,
      schemaVersion: SCHEMA_VERSION,
      profile: { ...DEFAULT_STATE.profile, ...migratedParsed.profile },
      preferences: {
        ...DEFAULT_STATE.preferences,
        ...migratedParsed.preferences,
        backgroundTheme: migratedParsed.preferences?.backgroundTheme ?? "aurora",
      },
      streak: { ...DEFAULT_STATE.streak, ...migratedParsed.streak },
      tasks: migratedParsed.tasks ?? {},
      notes: migratedParsed.notes ?? [],
      journal: migratedParsed.journal ?? [],
      projects: migratedParsed.projects ?? [],
      focusSessions: migratedParsed.focusSessions ?? [],
      habits: migratedParsed.habits ?? [],
      badges: migratedParsed.badges ?? [],
      bookmarks: migratedParsed.bookmarks ?? [],
      calendarEvents: migratedParsed.calendarEvents ?? [],
      activity: migratedParsed.activity ?? {},
      hourlyActivity: migratedParsed.hourlyActivity ?? {},
      lessonProgress: migratedParsed.lessonProgress ?? {},
      chatConversations: migratedParsed.chatConversations ?? [],
      aiSettings: { ...DEFAULT_STATE.aiSettings, ...migratedParsed.aiSettings },
      rateLimitTimestamps: migratedParsed.rateLimitTimestamps ?? [],
      dailyChallenge: { ...DEFAULT_STATE.dailyChallenge, ...migratedParsed.dailyChallenge },
      learnTabState: { ...DEFAULT_STATE.learnTabState, ...migratedParsed.learnTabState },
      certificates: migratedParsed.certificates ?? {},
      careerCertificate: migratedParsed.careerCertificate,
      dailyChallengePool: migratedParsed.dailyChallengePool,
      dailyChallengeWeekIndex: migratedParsed.dailyChallengeWeekIndex,
      projectSubmissions: migratedParsed.projectSubmissions ?? [],
      activeNotifications: migratedParsed.activeNotifications ?? [],
      questionRecords: migratedParsed.questionRecords ?? {},
      flashcards: migratedParsed.flashcards ?? [],
      bookmarkedLessons: migratedParsed.bookmarkedLessons ?? [],
    };

    // v5.84: If we migrated from an old key, save the migrated state under
    // the current key and remove the old key.
    if (cameFromMigration) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        // Remove old keys
        for (const oldKey of PREVIOUS_STORAGE_KEYS) {
          window.localStorage.removeItem(oldKey);
        }
        console.log("[launchpad] migration complete — old keys removed");
      } catch (e) {
        console.warn("[launchpad] failed to save migrated state:", e);
      }
    }

    return result;
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
    // v5.77 fix: handle QuotaExceededError by attempting to prune large arrays
    // and retry once. Previously the catch just warned and the user's state
    // silently stopped persisting until the next reload (losing all progress
    // made after the quota hit).
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
      console.warn("[launchpad] localStorage quota exceeded — attempting prune + retry.");
      try {
        const pruned: AppState = {
          ...state,
          // Drop oldest chat conversations beyond 50
          chatConversations: state.chatConversations.slice(0, 50),
          // Drop oldest focus sessions beyond 100
          focusSessions: state.focusSessions.slice(-100),
          // Drop calendar events older than 1 year
          calendarEvents: state.calendarEvents.filter((ev) => {
            if (!ev.date) return true;
            const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
            return new Date(ev.date).getTime() > oneYearAgo;
          }),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
        console.warn("[launchpad] prune + retry succeeded.");
      } catch (e2) {
        console.error("[launchpad] save failed even after prune:", e2);
      }
    } else {
      console.warn("[launchpad] failed to save state:", e);
    }
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
  // v5.77 fix: validate the date to prevent "NaN-NaN-NaN" keys from corrupting
  // the activity heatmap when called with an invalid Date.
  if (isNaN(d.getTime())) return "";
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
