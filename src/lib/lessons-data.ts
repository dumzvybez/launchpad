// ============================================================
// Launchpad lesson database — auto-generated from launchpad_database_v3.txt
// 630 lessons across 30 technologies
// 600 quizzes · 6000 quiz questions
// ============================================================

import type { Lesson } from "./types";

// v5.79: ALL_LESSONS is now in lessons-content.ts and loaded lazily
// via dynamic import(). See loadAllLessons() below.
// This file still re-exports ALL_LESSONS for backward compatibility,
// but it's undefined until loadAllLessons() is called (which AppShell
// does on mount). Selectors that need ALL_LESSONS should use
// getLessons() which returns the cached array (or [] if not loaded).

let _allLessonsCache: Lesson[] | null = null;

/**
 * Get the cached ALL_LESSONS array. Returns [] if not yet loaded.
 * Call loadAllLessons() to populate the cache (AppShell does this on mount).
 */
export function getLessons(): Lesson[] {
  return _allLessonsCache ?? [];
}

/**
 * Whether ALL_LESSONS has been loaded into memory.
 */
export function lessonsLoaded(): boolean {
  return _allLessonsCache !== null;
}

/**
 * v5.79: dynamically import the 6MB ALL_LESSONS array from
 * lessons-content.ts. This is a separate webpack chunk that only
 * loads on the client after the app mounts — not in the initial bundle.
 * Returns the loaded array (also caches it for synchronous access).
 */
export async function loadAllLessons(): Promise<Lesson[]> {
  if (_allLessonsCache) return _allLessonsCache;
  const mod = await import("./lessons-content");
  _allLessonsCache = mod.ALL_LESSONS;
  // Rebuild the lookup maps now that we have the data.
  rebuildMaps();
  return _allLessonsCache;
}

// Backward-compat: ALL_LESSONS is undefined until loadAllLessons() is called.
// New code should use getLessons() instead.
export const ALL_LESSONS: Lesson[] = [];


export const ALL_LANGUAGE_INFO: Record<string, { id: string; name: string; icon: string; color: string }> = {
  python: { id: "python", name: "Python", icon: "🐍", color: "#3776AB" },
  javascript: { id: "javascript", name: "JavaScript", icon: "🌐", color: "#F7DF1E" },
  typescript: { id: "typescript", name: "TypeScript", icon: "🟦", color: "#3178C6" },
  html: { id: "html", name: "HTML", icon: "📄", color: "#E34F26" },
  css: { id: "css", name: "CSS", icon: "🎨", color: "#1572B6" },
  sql: { id: "sql", name: "SQL", icon: "🗄️", color: "#4479A1" },
  java: { id: "java", name: "Java", icon: "☕", color: "#ED8B00" },
  c: { id: "c", name: "C", icon: "🔧", color: "#A8B9CC" },
  cpp: { id: "cpp", name: "C++", icon: "➕", color: "#00599C" },
  csharp: { id: "csharp", name: "C#", icon: "🔷", color: "#239120" },
  go: { id: "go", name: "Go", icon: "🐹", color: "#00ADD8" },
  rust: { id: "rust", name: "Rust", icon: "🦀", color: "#DEA584" },
  swift: { id: "swift", name: "Swift", icon: "🐦", color: "#F05138" },
  kotlin: { id: "kotlin", name: "Kotlin", icon: "🟣", color: "#7F52FF" },
  php: { id: "php", name: "PHP", icon: "🐘", color: "#777BB4" },
  ruby: { id: "ruby", name: "Ruby", icon: "💎", color: "#CC342D" },
  r: { id: "r", name: "R", icon: "📊", color: "#276DC3" },
  dart: { id: "dart", name: "Dart", icon: "🎯", color: "#0175C2" },
  bash: { id: "bash", name: "Bash / Shell", icon: "🐚", color: "#4EAA25" },
  react: { id: "react", name: "React", icon: "⚛️", color: "#61DAFB" },
  nextjs: { id: "nextjs", name: "Next.js", icon: "▲", color: "#000000" },
  django: { id: "django", name: "Django", icon: "🎸", color: "#092E20" },
  fastapi: { id: "fastapi", name: "FastAPI", icon: "⚡", color: "#009688" },
  flask: { id: "flask", name: "Flask", icon: "🧪", color: "#000000" },
  svelte: { id: "svelte", name: "Svelte", icon: "🔥", color: "#FF3E00" },
  vue: { id: "vue", name: "Vue", icon: "💚", color: "#42B883" },
  angular: { id: "angular", name: "Angular", icon: "🅰️", color: "#DD0031" },
  nodejs: { id: "nodejs", name: "Node.js", icon: "🟩", color: "#339933" },
  postgresql: { id: "postgresql", name: "PostgreSQL", icon: "🐘", color: "#4169E1" },
  mongodb: { id: "mongodb", name: "MongoDB", icon: "🍃", color: "#47A248" },
  // Section 30 — Gap languages added to onboarding catalog
  docker: { id: "docker", name: "Docker", icon: "🐳", color: "#2496ED" },
  tailwind: { id: "tailwind", name: "Tailwind CSS", icon: "🎨", color: "#06B6D4" },
  express: { id: "express", name: "Express.js", icon: "🚂", color: "#000000" },
  graphql: { id: "graphql", name: "GraphQL", icon: "🔗", color: "#E10098" },
  kubernetes: { id: "kubernetes", name: "Kubernetes", icon: "☸️", color: "#326CE5" },
  // Section 19 — New gap languages
  terraform: { id: "terraform", name: "Terraform", icon: "🏗️", color: "#7B42BC" },
  pytorch: { id: "pytorch", name: "PyTorch", icon: "🔥", color: "#EE4C2C" },
  tensorflow: { id: "tensorflow", name: "TensorFlow", icon: "🧠", color: "#FF6F00" },
};

// v5.78 fix: O(1) lookup maps. v5.79: rebuilt lazily after loadAllLessons().
// Initially empty (ALL_LESSONS is [] until loadAllLessons() populates the cache).
const LESSON_MAP: Map<string, Lesson> = new Map();
const LESSONS_BY_TRACK: Map<string, Lesson[]> = new Map();

/**
 * v5.79: rebuild the lookup maps from the cached ALL_LESSONS array.
 * Called by loadAllLessons() after the dynamic import completes.
 */
function rebuildMaps(): void {
  LESSON_MAP.clear();
  LESSONS_BY_TRACK.clear();
  const lessons = _allLessonsCache ?? [];
  for (const l of lessons) {
    LESSON_MAP.set(l.id, l);
    if (!LESSONS_BY_TRACK.has(l.track)) LESSONS_BY_TRACK.set(l.track, []);
    LESSONS_BY_TRACK.get(l.track)!.push(l);
  }
  // Sort each track's lessons by order.
  for (const arr of LESSONS_BY_TRACK.values()) {
    arr.sort((a, b) => a.order - b.order);
  }
}

export function getTrackLessons(trackId: string): Lesson[] {
  // v5.78 fix: use the pre-built index instead of O(n) filter on every call.
  // v5.79: returns [] if lessons haven't been loaded yet.
  return LESSONS_BY_TRACK.get(trackId) ?? [];
}

export function getAllTracks(): { id: string; name: string; icon: string; color: string; lessonCount: number }[] {
  // v5.79: use getLessons() (cached) instead of ALL_LESSONS (empty until loaded).
  const lessons = getLessons();
  const trackMap = new Map<string, { id: string; name: string; icon: string; color: string; lessonCount: number }>();
  for (const l of lessons) {
    if (!trackMap.has(l.track)) {
      const info = ALL_LANGUAGE_INFO[l.track];
      trackMap.set(l.track, {
        id: l.track,
        name: info?.name ?? l.track,
        icon: info?.icon ?? '📘',
        color: info?.color ?? '#3B82F6',
        lessonCount: 0,
      });
    }
    trackMap.get(l.track)!.lessonCount++;
  }
  return Array.from(trackMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getLessonById(id: string): Lesson | undefined {
  // v5.78 fix: O(1) Map lookup instead of O(n) find().
  // v5.79: returns undefined if lessons haven't been loaded yet.
  return LESSON_MAP.get(id);
}

// Alias for backward compatibility with components that import getLessonsForTrack
export function getLessonsForTrack(trackId: string): Lesson[] {
  return getTrackLessons(trackId);
}
