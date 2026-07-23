// ============================================================
// Launchpad lesson database — v6.2.0: Lazy per-track loading.
//
// CHANGED in v6.2: The 11 MB lessons-content.ts bundle is NO LONGER
// imported. Instead, tracks are loaded on-demand by content-loader.ts
// via fetch('/content/{trackId}.json'). This drops the per-user initial
// download from ~11 MB to ~0 KB (track list uses metadata) + ~200-470 KB
// per track opened.
//
// The old loadAllLessons() is kept as a deprecated no-op for backward
// compat with any code that still calls it.
// ============================================================

import type { Lesson } from "./types";
import { TRACK_LESSON_COUNTS, TRACKS_WITH_CONTENT, ALL_LANGUAGE_INFO } from "./lessons-meta";

// v6.2: In-memory cache of all loaded lessons (progressively populated by
// registerTrackLessons, called by content-loader.loadTrackContent).
let _allLessonsCache: Lesson[] | null = null;

// v6.2: O(1) lookup maps, rebuilt incrementally as tracks are registered.
const LESSON_MAP: Map<string, Lesson> = new Map();
const LESSONS_BY_TRACK: Map<string, Lesson[]> = new Map();
const _tracksRegistered = new Set<string>();

/**
 * v6.2: Register a track's lessons into the lookup maps. Called by
 * content-loader.loadTrackContent after fetching a track's JSON.
 * Idempotent — re-registering a track replaces its lessons.
 */
export function registerTrackLessons(trackId: string, lessons: Lesson[]): void {
  // Remove old entries for this track (if re-registering).
  if (_tracksRegistered.has(trackId)) {
    const old = LESSONS_BY_TRACK.get(trackId) ?? [];
    for (const l of old) LESSON_MAP.delete(l.id);
  }
  _tracksRegistered.add(trackId);
  LESSONS_BY_TRACK.set(trackId, lessons);
  for (const l of lessons) {
    if (!l || typeof l !== "object") continue;
    if (typeof l.id !== "string" || typeof l.track !== "string") continue;
    LESSON_MAP.set(l.id, l);
  }
  // Invalidate the all-lessons cache (rebuilt on next getLessons() call).
  _allLessonsCache = null;
}

/**
 * Get all loaded lessons across all registered tracks.
 * Returns [] if no tracks have been loaded yet.
 * v6.2: The track LIST view should use getAllTracks() from lessons-meta
 * (which uses generated metadata, no content fetch) instead of relying
 * on getLessons().length for counts.
 */
export function getLessons(): Lesson[] {
  if (_allLessonsCache) return _allLessonsCache;
  _allLessonsCache = [];
  for (const lessons of LESSONS_BY_TRACK.values()) {
    _allLessonsCache.push(...lessons);
  }
  return _allLessonsCache;
}

/**
 * Whether ANY track content has been loaded.
 * v6.2: This is no longer a binary "all or nothing" — tracks load
 * progressively. Use trackContentLoaded(trackId) from content-loader
 * for per-track checks.
 */
export function lessonsLoaded(): boolean {
  return _tracksRegistered.size > 0;
}

/**
 * v6.2: DEPRECATED. Previously loaded the 11 MB bundle. Now a no-op.
 * Kept for backward compat with code that calls it. Track content is now
 * loaded on-demand by content-loader.loadTrackContent().
 */
export async function loadAllLessons(): Promise<Lesson[]> {
  // No-op: content is loaded per-track by content-loader.ts.
  return getLessons();
}

// Backward-compat: ALL_LESSONS is empty (content loads per-track now).
export const ALL_LESSONS: Lesson[] = [];

// Re-export ALL_LANGUAGE_INFO for backward compat with existing imports.
export { ALL_LANGUAGE_INFO };

export function getTrackLessons(trackId: string): Lesson[] {
  return LESSONS_BY_TRACK.get(trackId) ?? [];
}

/**
 * Get all tracks as display objects (id, name, icon, color, lessonCount).
 * v6.2: Uses generated metadata (TRACK_LESSON_COUNTS) — does NOT require
 * content to be loaded. This is the same as lessons-meta.getAllTracks().
 */
export function getAllTracks(): { id: string; name: string; icon: string; color: string; lessonCount: number }[] {
  return TRACKS_WITH_CONTENT
    .map((id) => {
      const info = ALL_LANGUAGE_INFO[id];
      return {
        id,
        name: info?.name ?? id,
        icon: info?.icon ?? "📘",
        color: info?.color ?? "#3B82F6",
        lessonCount: TRACK_LESSON_COUNTS[id] ?? 0,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSON_MAP.get(id);
}

// Alias for backward compatibility with components that import getLessonsForTrack
export function getLessonsForTrack(trackId: string): Lesson[] {
  return getTrackLessons(trackId);
}
