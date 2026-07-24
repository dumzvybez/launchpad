import type { AppState } from "./types";
import { LESSON_SLUGS, SLUG_TO_ID } from "./lessons-meta-generated";

export const STORAGE_KEY = "launchpad:v4:state";
/**
 * v6.0 / v6.1: Schema bumped 4 → 5. The v4→v5 migration rewrites all persisted
 * lesson references from positional ids (e.g. "python-05") to stable slugs
 * (e.g. "python-variables-and-data-types"). See migrateSlugsV5() below.
 *
 * The localStorage KEY name stays "launchpad:v4:state" (changing it would
 * orphan every existing user); only the internal schemaVersion field bumps.
 */
export const SCHEMA_VERSION = 5;

/**
 * v6.1: Key under which a pre-migration backup is saved, exactly once, so the
 * user's pre-migration state is always recoverable.
 *
 * v6.0 used the key name `launchpad:v6:pre-slug-backup`. v6.1 renames it to
 * `launchpad:v6:pre-migration-backup` per the spec. Both keys are checked
 * before saving (so a v6.0 user who already has a backup under the old key
 * won't get a duplicate under the new key), and both are recognized on
 * restore. This keeps the backup idempotent across the v6.0 → v6.1 upgrade.
 */
const V6_BACKUP_KEY = "launchpad:v6:pre-migration-backup";
const V6_BACKUP_KEY_LEGACY = "launchpad:v6:pre-slug-backup";

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
 *
 * v6.006 fix: `state` is typed as MigrationState (a permissive record with
 * the specific fields the migrations touch typed explicitly) instead of
 * inferring `Record<string, unknown>` from oldState. This avoids `unknown`
 * access errors without resorting to `any`.
 */
type MigrationState = {
  schemaVersion?: number;
  aiSettings?: { temperature?: number; [key: string]: unknown };
  flashcards?: unknown[];
  questionRecords?: Record<string, unknown>;
  bookmarkedLessons?: unknown[];
  dailyChallenge?: { currentStreak?: number; completedToday?: boolean; totalCompleted?: number; [key: string]: unknown };
  certificates?: Record<string, unknown>;
  projectSubmissions?: unknown[];
  activeNotifications?: unknown[];
  learnTabState?: { selectedTrack?: string | null; selectedLessonId?: string | null; tab?: string; [key: string]: unknown };
  flashcardsTabState?: { filter?: string; currentIndex?: number; [key: string]: unknown };
  [key: string]: unknown;
};

function migrateState(oldState: Record<string, unknown>, fromVersion: number): Partial<AppState> {
  let state: MigrationState = { ...oldState };

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
    // v5.925: flashcardsTabState migration for older saved states.
    if (!state.flashcardsTabState) {
      state.flashcardsTabState = { filter: "due", currentIndex: 0 };
    }
  }

  // Migration v4 → v5 (v6.0 release): rewrite all persisted lesson references
  // from positional ids to stable slugs. IDEMPOTENT — checks the
  // migrations.v6SlugMigration flag and is a no-op if already applied.
  // See migrateSlugsV5() for full details.
  if (fromVersion < 5) {
    migrateSlugsV5(state);
  }

  // Mark as current schema version
  state.schemaVersion = SCHEMA_VERSION;
  return state as Partial<AppState>;
}

/**
 * v6.0 (v4→v5 schema migration): Rewrite all persisted lesson references from
 * positional ids to stable slugs.
 *
 * What gets rewritten:
 *   - lessonProgress keys:                       "python-05" → "python-variables-..."
 *   - lessonProgress[*].lessonId:                "python-05" → slug
 *   - lessonProgress[*].questionAnswers keys:    "python-05:q1" → "python.variables.q1"
 *   - questionRecords keys:                      "python-05:q1" → "python.variables.q1"
 *     (+ adds lessonSlug + trackId fields to each record)
 *   - bookmarkedLessons[]:                       "python-05" → slug
 *   - flashcards[].id:     "python-05:keyConcepts:0" → "slug:keyConcepts:0"
 *   - flashcards[].lessonId:                     "python-05" → slug
 *   - learnTabState.selectedLessonId:            "python-05" → slug
 *
 * Safety properties:
 *   - IDEMPOTENT: resolveRef/resolveQuizRef return slugs unchanged, so
 *     re-running on already-migrated state is a no-op. The migrations.v6SlugMigration
 *     flag also guards against re-running the full pass.
 *   - NON-DESTRUCTIVE: unknown ids (not in LESSON_SLUGS) are passed through
 *     unchanged — we never drop a user's data because we can't map a lesson id
 *     (the lesson may have been removed from content, or the maps may be stale).
 *   - A pre-migration backup is saved to localStorage[V6_BACKUP_KEY] exactly
 *     once, so the original state is always recoverable.
 */
function migrateSlugsV5(state: Record<string, unknown>): void {
  // v6.1: check BOTH the new `slugMigration` flag and the v6.0 legacy
  // `v6SlugMigration` flag. Users who migrated under v6.0 (which set
  // `v6SlugMigration`) must NOT be re-migrated by v6.1.
  type MigrationState = { migrations?: { slugMigration?: boolean; v6SlugMigration?: boolean } };
  const migState = state as unknown as MigrationState;
  if (migState.migrations?.slugMigration || migState.migrations?.v6SlugMigration) {
    // Already migrated — no-op.
    return;
  }

  // --- helpers (local, to avoid importing the full identity module graph) ---
  // Resolve any lesson ref (positional id OR slug) to canonical slug form.
  const resolveRef = (ref: string): string => {
    if (typeof ref !== "string" || ref === "") return ref;
    if (SLUG_TO_ID[ref]) return ref;          // already a slug
    const slug = LESSON_SLUGS[ref];
    if (slug) return slug;                    // positional id → slug
    return ref;                               // unknown — passthrough
  };
  // Resolve any quiz key ("id:qN" OR "slug.with.dots.qN") to canonical form.
  const resolveQuizRef = (ref: string): string => {
    if (typeof ref !== "string" || ref === "") return ref;
    if (!ref.includes(":")) return ref;       // already new format
    const lastColon = ref.lastIndexOf(":");
    if (lastColon < 0) return ref;
    const lessonPart = ref.slice(0, lastColon);
    const qPart = ref.slice(lastColon + 1);
    const slug = resolveRef(lessonPart);
    return `${slug.replace(/-/g, ".")}.${qPart}`;
  };
  // Derive trackId from a slug (first hyphen-segment). Safe because all
  // current track ids are single words.
  const trackIdFromSlug = (slug: string): string => {
    const i = slug.indexOf("-");
    return i > 0 ? slug.slice(0, i) : slug;
  };

  let rewritten = 0;

  // --- 1. lessonProgress: rewrite keys + lessonId + questionAnswers keys ---
  const lp = state.lessonProgress as Record<string, unknown> | undefined;
  if (lp && typeof lp === "object") {
    const newLp: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(lp)) {
      const newKey = resolveRef(key);
      if (newKey !== key) rewritten++;
      const v = value as Record<string, unknown> | undefined;
      if (v && typeof v === "object") {
        // Rewrite lessonId field.
        if (typeof v.lessonId === "string") {
          v.lessonId = resolveRef(v.lessonId);
        }
        // Rewrite questionAnswers keys (id:qN → global quiz slug).
        const qa = v.questionAnswers as Record<string, unknown> | undefined;
        if (qa && typeof qa === "object") {
          const newQa: Record<string, unknown> = {};
          for (const [qaKey, qaVal] of Object.entries(qa)) {
            newQa[resolveQuizRef(qaKey)] = qaVal;
          }
          v.questionAnswers = newQa;
        }
      }
      // If two old ids collide on the same slug (shouldn't happen, but be
      // safe), merge rather than overwrite — prefer the one with status "complete".
      if (newLp[newKey] && v && typeof v === "object") {
        const existing = newLp[newKey] as Record<string, unknown>;
        if (existing.status !== "complete" && v.status === "complete") {
          newLp[newKey] = v;
        }
      } else {
        newLp[newKey] = v;
      }
    }
    state.lessonProgress = newLp;
  }

  // --- 2. questionRecords: rewrite keys + add lessonSlug/trackId ---
  const qr = state.questionRecords as Record<string, unknown> | undefined;
  if (qr && typeof qr === "object") {
    const newQr: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(qr)) {
      const newKey = resolveQuizRef(key);
      if (newKey !== key) rewritten++;
      const v = value as Record<string, unknown> | undefined;
      if (v && typeof v === "object") {
        // Derive lessonSlug + trackId from the new key for robust resolution.
        const parts = newKey.split(".");
        if (parts.length >= 2) {
          const qId = parts[parts.length - 1];
          const lessonSlugDotted = parts.slice(0, -1).join("-");
          v.lessonSlug = v.lessonSlug ?? lessonSlugDotted;
          v.trackId = v.trackId ?? trackIdFromSlug(lessonSlugDotted);
          // Keep questionId as the local id (last segment).
          v.questionId = v.questionId ?? qId;
        }
      }
      newQr[newKey] = v;
    }
    state.questionRecords = newQr;
  }

  // --- 3. bookmarkedLessons: rewrite each id → slug ---
  const bm = state.bookmarkedLessons as string[] | undefined;
  if (Array.isArray(bm)) {
    const seen = new Set<string>();
    state.bookmarkedLessons = bm
      .map((id) => {
        const slug = resolveRef(id);
        if (slug !== id) rewritten++;
        return slug;
      })
      .filter((slug) => {
        // Dedup (a positional id and its slug may both have been present).
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      });
  }

  // --- 4. flashcards: rewrite id + lessonId ---
  const fc = state.flashcards as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(fc)) {
    for (const card of fc) {
      if (typeof card.id === "string" && card.id.includes(":")) {
        // id format: `${lessonId}:${blockKind}:${index}` — rewrite the lesson part.
        const firstColon = card.id.indexOf(":");
        const lessonPart = card.id.slice(0, firstColon);
        const rest = card.id.slice(firstColon);
        const newId = resolveRef(lessonPart) + rest;
        if (newId !== card.id) rewritten++;
        card.id = newId;
      }
      if (typeof card.lessonId === "string") {
        const slug = resolveRef(card.lessonId);
        if (slug !== card.lessonId) rewritten++;
        card.lessonId = slug;
      }
    }
  }

  // --- 5. learnTabState.selectedLessonId: rewrite id → slug ---
  const lts = state.learnTabState as { selectedLessonId?: string } | undefined;
  if (lts && typeof lts.selectedLessonId === "string") {
    const slug = resolveRef(lts.selectedLessonId);
    if (slug !== lts.selectedLessonId) rewritten++;
    lts.selectedLessonId = slug;
  }

  // --- Mark migration complete (set BOTH flag names for cross-version compat) ---
  // v6.1 sets `slugMigration` (the spec name). We ALSO set `v6SlugMigration`
  // (the v6.0 name) so that if the user downgrades to v6.0 after upgrading to
  // v6.1, v6.0's migration check still recognizes the migration as done.
  if (!state.migrations) state.migrations = {};
  (state.migrations as { slugMigration?: boolean; v6SlugMigration?: boolean }).slugMigration = true;
  (state.migrations as { slugMigration?: boolean; v6SlugMigration?: boolean }).v6SlugMigration = true;

  if (rewritten > 0) {
    console.log(`[launchpad] v6 slug migration: rewrote ${rewritten} persisted refs to stable slugs`);
  } else {
    console.log("[launchpad] v6 slug migration: no refs needed rewriting (already slug-keyed or empty)");
  }
}

export const DEFAULT_STATE: AppState = {
  schemaVersion: SCHEMA_VERSION,
  migrations: {
    slugMigration: true,      // v6.1 spec name — fresh installs are slug-keyed by construction
    v6SlugMigration: true,    // v6.0 legacy name — kept for cross-version compat
  },
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
  flashcardsTabState: {
    filter: "due",
    currentIndex: 0,
  },
  certificates: {},
  projectSubmissions: [],
  activeNotifications: [],
  questionRecords: {},
  flashcards: [],
  bookmarkedLessons: [],
  certIssueAttempts: {},
  // v5.931: Notification Centre — persistent notification history (no read/unread).
  notifications: [],
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

    // v6.0 / v6.1: Before running the slug migration, save a one-time backup of
    // the raw pre-migration state so it is always recoverable. Only saves if no
    // backup already exists under EITHER the v6.1 key or the v6.0 legacy key
    // (idempotent — re-running never overwrites the original backup) AND the
    // state actually needs migrating.
    //
    // The migration is considered "already done" if EITHER the v6.1 flag
    // (`slugMigration`) OR the v6.0 legacy flag (`v6SlugMigration`) is set.
    // This ensures users who migrated under v6.0 are not re-migrated by v6.1.
    const parsedMigrations = (parsed as { migrations?: { slugMigration?: boolean; v6SlugMigration?: boolean } }).migrations;
    const alreadyMigrated = parsedMigrations?.slugMigration === true || parsedMigrations?.v6SlugMigration === true;
    const needsSlugMigration =
      (parsed.schemaVersion ?? oldVersion) < SCHEMA_VERSION && !alreadyMigrated;
    if (needsSlugMigration) {
      try {
        const existingBackupNew = window.localStorage.getItem(V6_BACKUP_KEY);
        const existingBackupLegacy = window.localStorage.getItem(V6_BACKUP_KEY_LEGACY);
        if (!existingBackupNew && !existingBackupLegacy) {
          window.localStorage.setItem(V6_BACKUP_KEY, raw);
          console.log("[launchpad] v6 pre-migration backup saved to", V6_BACKUP_KEY);
        }
      } catch (e) {
        // Backup failure is non-fatal — log and continue with migration.
        console.warn("[launchpad] v6 backup save failed (non-fatal):", e);
      }
    }

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
      // v6.0 / v6.1: preserve migrations flags (set by migrateSlugsV5).
      // Both `slugMigration` (v6.1) and `v6SlugMigration` (v6.0) are merged.
      migrations: {
        ...DEFAULT_STATE.migrations,
        ...(migratedParsed as { migrations?: { slugMigration?: boolean; v6SlugMigration?: boolean } }).migrations,
      },
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
      flashcardsTabState: { ...DEFAULT_STATE.flashcardsTabState, ...migratedParsed.flashcardsTabState },
      certificates: migratedParsed.certificates ?? {},
      careerCertificate: migratedParsed.careerCertificate,
      dailyChallengePool: migratedParsed.dailyChallengePool,
      dailyChallengeWeekIndex: migratedParsed.dailyChallengeWeekIndex,
      projectSubmissions: migratedParsed.projectSubmissions ?? [],
      activeNotifications: migratedParsed.activeNotifications ?? [],
      questionRecords: migratedParsed.questionRecords ?? {},
      flashcards: migratedParsed.flashcards ?? [],
      bookmarkedLessons: migratedParsed.bookmarkedLessons ?? [],
      certIssueAttempts: migratedParsed.certIssueAttempts ?? {},
      // v5.931: Notification Centre history (no read/unread state).
      notifications: migratedParsed.notifications ?? [],
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
          // v5.937 / v6.0: Prune questionRecords (SM-2 spaced-repetition state)
          // to prevent localStorage quota issues at scale (100-150+ lessons ×
          // 10 questions × 38 languages = potentially 57,000 records).
          // Keep only records for lessons in the user's current roadmap languages;
          // records for other languages are dropped (they'll be re-created if the
          // user revisits those lessons).
          //
          // v6.0: The record KEY is now a global quiz slug (e.g.
          // "python.variables.q1"), and each record carries a `trackId` field
          // (populated by the v6 migration). We filter on `trackId` first, and
          // fall back to deriving the track from the key (first dot-segment) for
          // any pre-migration records that somehow weren't migrated.
          questionRecords: state.roadmap
            ? Object.fromEntries(
                Object.entries(state.questionRecords).filter(([key, rec]) => {
                  // v6.0: prefer the record's trackId field (populated by migration).
                  if (rec.trackId && state.roadmap!.languageIds.includes(rec.trackId)) {
                    return true;
                  }
                  // Fallback: derive track from the key.
                  //   New key format: "python.variables.q1" → first dot-segment = "python"
                  //   Legacy key format: "python-05:q1"     → first hyphen-segment = "python"
                  let keyTrack = "";
                  if (key.includes(".")) {
                    keyTrack = key.split(".")[0];
                  } else if (key.includes(":")) {
                    keyTrack = key.split(":")[0].split("-")[0];
                  } else if (key.includes("-")) {
                    keyTrack = key.split("-")[0];
                  }
                  return keyTrack !== "" && state.roadmap!.languageIds.includes(keyTrack);
                }),
              )
            : state.questionRecords,
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
