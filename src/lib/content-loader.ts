/**
 * content-loader.ts — v6.2.0: Lazy, per-track content loading.
 *
 * Replaces the v6.0–v6.1 eager 11 MB bundle (loadAllLessons) with lazy
 * per-track JSON fetches. When a user opens Python, only python.json
 * (~200–470 KB) is downloaded — not the entire 11 MB content bundle.
 *
 * The JSON files are compiled from Markdown source by scripts/compile-content.ts
 * and served from public/content/{trackId}.json.
 *
 * Caching:
 *   - In-memory: Map<trackId, Lesson[]> — survives for the session.
 *   - The fetch itself is cached by the browser's HTTP cache (with
 *     appropriate Cache-Control headers in production).
 *
 * Progressive enhancement:
 *   - getLessons() in lessons-data.ts returns the union of all loaded tracks.
 *   - getTrackLessons(trackId) returns [] if the track hasn't been loaded yet.
 *   - The track LIST view uses generated metadata (no content fetch needed).
 *   - CommandPalette search works on loaded tracks (progressive).
 */

import type { Lesson } from "./types";
import { registerTrackLessons, getTrackLessons } from "./lessons-data";

/** In-memory cache of loaded track content. */
const _trackCache = new Map<string, Lesson[]>();

/** Set of track IDs currently being fetched (dedup concurrent requests). */
const _loading = new Map<string, Promise<Lesson[]>>();

/**
 * Load a track's lessons by fetching /content/{trackId}.json.
 * Caches in memory; duplicate calls return the cached result.
 */
export async function loadTrackContent(trackId: string): Promise<Lesson[]> {
  // Return cached if available.
  if (_trackCache.has(trackId)) {
    return _trackCache.get(trackId)!;
  }
  // Dedup: if a fetch is already in flight for this track, wait for it.
  if (_loading.has(trackId)) {
    return _loading.get(trackId)!;
  }

  const promise = (async () => {
    try {
      const res = await fetch(`/content/${trackId}.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for /content/${trackId}.json`);
      }
      const data = (await res.json()) as { track: string; lessons: Lesson[] };
      const lessons = data.lessons ?? [];
      // Sort by order (defensive — the compiler already sorts).
      lessons.sort((a, b) => a.order - b.order);
      // Cache + register in the lookup maps.
      _trackCache.set(trackId, lessons);
      registerTrackLessons(trackId, lessons);
      return lessons;
    } catch (err) {
      console.warn(`[content-loader] failed to load track "${trackId}":`, err);
      // Cache empty array to prevent retry storms.
      _trackCache.set(trackId, []);
      registerTrackLessons(trackId, []);
      return [];
    } finally {
      _loading.delete(trackId);
    }
  })();

  _loading.set(trackId, promise);
  return promise;
}

/**
 * Synchronous access to a track's lessons (returns [] if not yet loaded).
 * Call sites that can't be async should use this; call sites that can should
 * prefer loadTrackContent().
 */
export function getTrackContent(trackId: string): Lesson[] {
  return _trackCache.get(trackId) ?? getTrackLessons(trackId);
}

/** Whether a track's content is already in memory. */
export function trackContentLoaded(trackId: string): boolean {
  return _trackCache.has(trackId);
}

/**
 * Preload multiple tracks (e.g. the user's roadmap languages) in the
 * background. Fetches each track's JSON in parallel.
 */
export async function preloadTracks(trackIds: string[]): Promise<void> {
  await Promise.all(trackIds.map((id) => loadTrackContent(id)));
}
