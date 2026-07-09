// ============================================================
// v5.91 (Part 1): Dependency Graph — Prerequisite relationships
// for lesson-backed tracks.
//
// This is a structured, machine-readable prerequisite graph.
// For each track, `requires` lists track IDs that must be
// substantially complete (or at least selected) first.
//
// DESIGN RULES:
// - Only tracks with REAL lesson content (in the Learn tab) appear here.
// - Non-lesson-backed prerequisites (e.g., Git) are NOT in this graph —
//   they're handled as informational notes instead (see Part 2).
// - The graph does NOT block language selection — users can select any
//   combination freely. It only affects:
//   (a) auto-injection of missing prerequisites (Part 2)
//   (b) phase ORDERING in the generated roadmap (prerequisites before dependents)
// - Cascading prerequisites resolve fully (e.g., Next.js → TypeScript → JavaScript).
// ============================================================

/**
 * The prerequisite graph. Key = track ID, value = array of track IDs that
 * are required prerequisites (must be learned first).
 *
 * Only tracks with real lesson content (38 tracks in the Learn tab) appear.
 * If a prerequisite has no lesson content (e.g., Git), it's excluded —
 * the auto-injection system will show an informational note instead.
 */
export const PREREQUISITE_GRAPH: Record<string, string[]> = {
  // ---- Frontend chain ----
  // html → css → javascript → typescript
  css: ["html"],
  javascript: ["html", "css"],
  typescript: ["javascript"],

  // Frontend frameworks require their parent language
  react: ["javascript"],
  vue: ["javascript"],
  svelte: ["javascript"],
  angular: ["typescript"],
  nextjs: ["typescript"], // which requires javascript (cascading)

  // CSS frameworks
  tailwind: ["css"],

  // ---- Backend chain ----
  // Node.js / Express require JavaScript
  nodejs: ["javascript"],
  express: ["javascript"],

  // Python frameworks require Python (python has no prerequisite)
  django: ["python"],
  fastapi: ["python"],
  flask: ["python"],

  // GraphQL is a query language — recommend JavaScript as a practical base
  // (most GraphQL servers/clients are JS-based), but don't strictly require it
  // since GraphQL can be used with any backend. No hard prerequisite.

  // ---- Data/ML chain ----
  pytorch: ["python"],
  tensorflow: ["python"],

  // ---- DevOps chain ----
  // Docker has no lesson-backed prerequisite in the catalog
  // (Git would be ideal but has no lesson content — handled as informational note)
  kubernetes: ["docker"],
  // Terraform has no strict lesson-backed prerequisite

  // ---- Databases ----
  // SQL is foundational; PostgreSQL and MongoDB can be learned independently
  // but SQL knowledge helps. We list SQL as a prerequisite for PostgreSQL.
  postgresql: ["sql"],
  // MongoDB is NoSQL — no SQL prerequisite needed

  // ---- Systems / Mobile ----
  // c, cpp, rust, go, java, csharp, kotlin, swift, dart, php, ruby, r, bash
  // are independent entry points — no cross-language prerequisites.

  // ---- Independent entry points (no prerequisites) ----
  // python, html, sql, docker, terraform, c, cpp, csharp, go, rust, java,
  // kotlin, swift, dart, php, ruby, r, bash, mongodb
  // (these don't appear as keys in the graph — they have no prerequisites)
};

/**
 * Non-lesson-backed prerequisites that would be ideal but have no Learn-tab content.
 * These are shown as informational notes in the roadmap rather than being
 * auto-injected as phases.
 */
export const NON_LESSON_PREREQUISITES: Record<string, string[]> = {
  // Git is a practical prerequisite for Docker, Kubernetes, and Terraform
  // (version control is essential for DevOps work), but has no lesson track.
  docker: ["git"],
  kubernetes: ["git"],
  terraform: ["git"],
};

/**
 * Tracks that have real lesson content (38 tracks).
 * Used to filter auto-injection — only lesson-backed prerequisites get injected.
 */
export const LESSON_BACKED_TRACKS: Set<string> = new Set([
  "python", "javascript", "typescript", "html", "css", "sql", "java", "c",
  "cpp", "csharp", "go", "rust", "swift", "kotlin", "php", "ruby", "r",
  "dart", "bash", "react", "nextjs", "django", "fastapi", "flask", "svelte",
  "vue", "angular", "nodejs", "postgresql", "mongodb", "docker", "tailwind",
  "express", "graphql", "kubernetes", "terraform", "pytorch", "tensorflow",
]);

/**
 * Check if a track has real lesson content.
 */
export function hasLessons(trackId: string): boolean {
  return LESSON_BACKED_TRACKS.has(trackId);
}

/**
 * Get all prerequisites for a track (direct only, not transitive).
 * Returns only lesson-backed prerequisites.
 */
export function getDirectPrerequisites(trackId: string): string[] {
  return PREREQUISITE_GRAPH[trackId] ?? [];
}

/**
 * Get ALL prerequisites for a track (transitive — fully resolved).
 * E.g., for "nextjs": returns ["typescript", "javascript", "html", "css"]
 * (typescript requires javascript, which requires html + css).
 * Returns only lesson-backed prerequisites (non-lesson-backed are excluded).
 */
export function getAllPrerequisites(trackId: string): string[] {
  const result = new Set<string>();
  const queue = [trackId];
  const visited = new Set<string>([trackId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const prereqs = PREREQUISITE_GRAPH[current] ?? [];
    for (const prereq of prereqs) {
      if (!visited.has(prereq)) {
        visited.add(prereq);
        if (hasLessons(prereq)) {
          result.add(prereq);
        }
        queue.push(prereq);
      }
    }
  }

  return Array.from(result);
}

/**
 * Given a user's selected language IDs, compute which prerequisites are MISSING
 * (selected by the user but their prerequisites are not in the selection).
 * Returns an array of { trackId, requiredBy } pairs.
 * Only lesson-backed prerequisites are returned.
 *
 * Example: user selects ["react", "python"]
 * → react requires "javascript", which requires "html" + "css"
 * → missing: [{ trackId: "javascript", requiredBy: ["react"] },
 *             { trackId: "html", requiredBy: ["javascript"] },
 *             { trackId: "css", requiredBy: ["javascript"] }]
 */
export function findMissingPrerequisites(
  selectedTrackIds: string[],
): Array<{ trackId: string; requiredBy: string[] }> {
  const selectedSet = new Set(selectedTrackIds);
  const missingMap = new Map<string, Set<string>>(); // trackId → set of tracks that require it

  for (const trackId of selectedTrackIds) {
    const allPrereqs = getAllPrerequisites(trackId);
    for (const prereq of allPrereqs) {
      if (!selectedSet.has(prereq) && hasLessons(prereq)) {
        if (!missingMap.has(prereq)) {
          missingMap.set(prereq, new Set());
        }
        missingMap.get(prereq)!.add(trackId);
      }
    }
  }

  return Array.from(missingMap.entries()).map(([trackId, requiredBy]) => ({
    trackId,
    requiredBy: Array.from(requiredBy),
  }));
}

/**
 * Get non-lesson-backed prerequisite notes for a track.
 * E.g., for "docker": returns ["git"] — shown as an informational note.
 */
export function getNonLessonPrerequisiteNotes(trackId: string): string[] {
  return NON_LESSON_PREREQUISITES[trackId] ?? [];
}

/**
 * Topologically sort a list of track IDs so that prerequisites come before
 * their dependents. Used for phase ordering in the roadmap.
 *
 * If there's a cycle (shouldn't happen with the current graph), the original
 * order is preserved for the cyclic elements.
 */
export function topologicalSort(trackIds: string[]): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>(); // for cycle detection

  function visit(id: string) {
    if (visited.has(id)) return;
    if (visiting.has(id)) return; // cycle — skip (shouldn't happen)
    visiting.add(id);

    // Visit prerequisites first (only those in our list)
    const prereqs = PREREQUISITE_GRAPH[id] ?? [];
    for (const prereq of prereqs) {
      if (trackIds.includes(prereq)) {
        visit(prereq);
      }
    }

    visiting.delete(id);
    visited.add(id);
    result.push(id);
  }

  for (const id of trackIds) {
    visit(id);
  }

  return result;
}

/**
 * Get the full dependency graph as a readable object for reporting.
 */
export function getFullGraphForReview(): Record<string, { requires: string[]; nonLessonNotes: string[] }> {
  const result: Record<string, { requires: string[]; nonLessonNotes: string[] }> = {};
  for (const trackId of LESSON_BACKED_TRACKS) {
    result[trackId] = {
      requires: getDirectPrerequisites(trackId),
      nonLessonNotes: getNonLessonPrerequisiteNotes(trackId),
    };
  }
  return result;
}
