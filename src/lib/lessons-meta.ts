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
 * Static list of all tracks that have content in ALL_LESSONS.
 * This is hardcoded to avoid importing ALL_LESSONS (6MB) just to count lessons.
 * v5.78 fix: this is the 30 core tracks that have full 21-lesson content.
 */
export const GAP_LANGUAGES = ["docker", "tailwind", "express", "graphql", "kubernetes", "terraform", "pytorch", "tensorflow"];

export const TRACKS_WITH_CONTENT: string[] = [
  "python", "javascript", "typescript", "html", "css", "sql",
  "java", "c", "cpp", "csharp", "go", "rust", "swift", "kotlin",
  "php", "ruby", "r", "dart", "bash", "react", "nextjs", "django",
  "fastapi", "flask", "svelte", "vue", "angular", "nodejs",
  "postgresql", "mongodb",
  // v5.87: gap languages now have lesson content (extended to 21)
  "docker", "tailwind", "express", "graphql", "kubernetes",
  "terraform", "pytorch", "tensorflow",
];

/**
 * Get all tracks as display objects (id, name, icon, color, lessonCount).
 * v5.78 fix: lessonCount is a static 21 for the 30 core tracks (no need to
 * scan ALL_LESSONS). For gap languages (docker, tailwind, etc.) it's 0
 * because they have no lessons in ALL_LESSONS.
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
        lessonCount: 21, // each core track has 20 stages + 1 capstone
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
