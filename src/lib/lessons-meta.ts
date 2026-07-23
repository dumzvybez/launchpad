/**
 * Launchpad lesson metadata (v5.78).
 *
 * This file contains ONLY the language/track metadata (icons, colors, names)
 * and the track-listing helpers — NOT the 6MB `ALL_LESSONS` array.
 *
 * Components that only need metadata (icons, colors, track names) should
 * import from here instead of from `./lessons-data`, so they don't pull
 * the 6MB lesson content into their bundle.
 *
 * v5.78 fix: extracted from lessons-data.ts so that AIChat, FlashcardsView,
 * CareerView, and other metadata-only consumers ship ~2KB instead of ~6MB.
 */

export type LanguageInfo = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const ALL_LANGUAGE_INFO: Record<string, LanguageInfo> = {
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

/**
 * Get a language's display info (name, icon, color) by track id.
 * Returns a fallback for unknown tracks.
 */
export function getLanguageInfo(trackId: string): LanguageInfo {
  return ALL_LANGUAGE_INFO[trackId] ?? { id: trackId, name: trackId, icon: "📘", color: "#3B82F6" };
}

/**
 * v6.0: Tracks that have lesson content — now BUILD-GENERATED from actual
 * content (was a hand-maintained array that could drift). Re-exported from
 * lessons-meta-generated for backward compat with existing imports.
 */
export const GAP_LANGUAGES = ["docker", "tailwind", "express", "graphql", "kubernetes", "terraform", "pytorch", "tensorflow"];

import { TRACKS_WITH_CONTENT_GENERATED as _TRACKS_WITH_CONTENT } from "./lessons-meta-generated";
/** v6.0: Tracks with content — re-exported under the legacy name for backward compat. */
export const TRACKS_WITH_CONTENT: string[] = _TRACKS_WITH_CONTENT;

/**
 * v6.0: Per-track lesson counts, BUILD-GENERATED from actual content.
 * Replaces the hand-maintained TRACK_LESSON_COUNTS (which was hardcoded to 21
 * for all tracks and could drift). The server's certificate-validation API
 * imports this to verify expected lesson counts WITHOUT importing the 10MB
 * lessons-content bundle.
 *
 * To regenerate after content changes:  bun run gen:meta
 * (A CI check should assert this stays in sync.)
 *
 * Re-exported here for backward compat with existing imports of
 * `TRACK_LESSON_COUNTS` from lessons-meta. New code can import directly from
 * lessons-meta-generated.
 */
import {
  TRACK_LESSON_COUNTS_GENERATED,
} from "./lessons-meta-generated";

// v6.0: Re-export the generated counts under the legacy name for backward compat.
export const TRACK_LESSON_COUNTS: Record<string, number> = TRACK_LESSON_COUNTS_GENERATED;

/** v6.0: Ordered slugs per track. Used by the server to validate a client's
 *  completedLessonIds against the real lesson set (by slug, not positional id). */
export { TRACK_LESSON_SLUGS } from "./lessons-meta-generated";

/**
 * v6.0: Get the expected lesson count for a track (server-safe, no lazy loading).
 *
 * CHANGED in v6.0: the fallback for unknown tracks is now 0 (LOUD FAILURE)
 * instead of 21. A return of 0 means "track not recognized" — the certificate
 * API treats this as a hard error ("track not found") rather than silently
 * expecting 21 lessons. This prevents the v5.x bug where a new track added
 * without updating the hand-maintained map would wrongly expect 21 lessons.
 *
 * If you genuinely need the legacy 21 fallback behavior, import
 * TRACK_LESSON_COUNTS directly and use `?? 21`.
 */
export function getExpectedLessonCount(trackId: string): number {
  return TRACK_LESSON_COUNTS_GENERATED[trackId] ?? 0;
}

/**
 * Get all tracks as display objects (id, name, icon, color, lessonCount).
 * v5.937: lessonCount is now read from TRACK_LESSON_COUNTS (not hardcoded 21).
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
        lessonCount: getExpectedLessonCount(id),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * v6.2: Total lesson count across ALL tracks (from generated metadata).
 * Used by the Learn tab header ("X of Y lessons complete") WITHOUT needing
 * to load any content. Replaces getLessons().length which required the 11MB
 * bundle to be loaded.
 */
export function getTotalLessonCount(): number {
  return TRACKS_WITH_CONTENT.reduce(
    (sum, trackId) => sum + getExpectedLessonCount(trackId),
    0,
  );
}
