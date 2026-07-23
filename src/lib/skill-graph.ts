/**
 * skill-graph.ts — v6.0 Foundation for skill-based progression.
 *
 * CURRENT STATE: This module is a FOUNDATION. The SkillGraph is empty — no
 * skills or edges are defined yet. The roadmap engine is UNCHANGED and still
 * uses linear lesson sequencing. This module exists so that:
 *
 *   1. Content authors can begin declaring `skillsTaught` on lessons (the
 *      optional Lesson.skillsTaught field added in v6.0) without waiting for
 *      the full skill-based roadmap.
 *   2. A future phase can populate SKILL_GRAPH from lesson annotations and
 *      build a DAG-based progression engine (Variables → Conditions → Loops →
 *      Functions → OOP) to replace the current linear model.
 *   3. The AI foundation (Phase 9) has a typed Skill/SkillGraph to consume.
 *
 * This is explicitly out of scope for v6.0 per the migration spec:
 *   "Do NOT fully build: complete skill graph roadmap, adaptive learning engine.
 *    Only prepare foundations."
 */

import type { Skill, SkillGraph } from "./types";

/**
 * The current skill graph — EMPTY. Populating this is a future phase.
 * When populated, it should be BUILD-GENERATED from lesson `skillsTaught`
 * annotations (similar to how lessons-meta-generated.ts is generated from
 * lesson content), NOT hand-maintained.
 */
export const SKILL_GRAPH: SkillGraph = {
  nodes: [] as Skill[],
  edges: [],
};

/**
 * Look up a skill by id. Returns undefined if not found (the graph is empty
 * in v6.0, so this always returns undefined until skills are populated).
 */
export function getSkill(skillId: string): Skill | undefined {
  return SKILL_GRAPH.nodes.find((s) => s.id === skillId);
}

/**
 * Get all skills for a track. Returns [] until the graph is populated.
 */
export function getSkillsForTrack(trackId: string): Skill[] {
  return SKILL_GRAPH.nodes.filter((s) => s.trackId === trackId);
}

/**
 * Get the prerequisite skills for a given skill (incoming "requires" edges).
 * Returns [] until the graph is populated.
 */
export function getPrerequisiteSkills(skillId: string): Skill[] {
  const prereqIds = SKILL_GRAPH.edges
    .filter((e) => e.to === skillId && e.relation === "requires")
    .map((e) => e.from);
  return prereqIds
    .map((id) => SKILL_GRAPH.nodes.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined);
}

/**
 * Check whether a skill is "unlocked" — i.e. all its prerequisite skills are
 * met. In v6.0 this is a STUB that always returns true (no skills defined).
 * A future phase will wire this to actual skill-mastery state.
 */
export function isSkillUnlocked(_skillId: string, _masteredSkillIds: Set<string>): boolean {
  // v6.0 stub: no prerequisites defined → everything unlocked.
  return true;
}

/**
 * Detect cycles in the skill graph. Returns the first cycle found (as a list
 * of skill ids), or null if the graph is acyclic. Used by the future
 * build-time generator to reject cyclic graphs.
 *
 * In v6.0 (empty graph) this always returns null.
 */
export function detectSkillGraphCycle(): string[] | null {
  if (SKILL_GRAPH.nodes.length === 0) return null;
  // Simple DFS cycle detection (not exercised until the graph is populated).
  const adj = new Map<string, string[]>();
  for (const e of SKILL_GRAPH.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e.to);
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const n of SKILL_GRAPH.nodes) color.set(n.id, WHITE);
  const stack: string[] = [];
  let cycle: string[] | null = null;

  const visit = (id: string): boolean => {
    color.set(id, GRAY);
    stack.push(id);
    for (const next of adj.get(id) ?? []) {
      if (color.get(next) === GRAY) {
        // Found a cycle — extract it from the stack.
        const start = stack.indexOf(next);
        cycle = stack.slice(start).concat(next);
        return true;
      }
      if (color.get(next) === WHITE && visit(next)) return true;
    }
    stack.pop();
    color.set(id, BLACK);
    return false;
  };

  for (const n of SKILL_GRAPH.nodes) {
    if (color.get(n.id) === WHITE && visit(n.id)) break;
  }
  return cycle;
}
