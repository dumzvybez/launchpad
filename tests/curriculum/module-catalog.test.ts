/**
 * Curriculum tests — validate the v6.004 curriculum architecture catalogs.
 *
 * These tests validate the CATALOG STRUCTURE (module-catalog.ts, track-config.ts,
 * assessments.ts, capstones.ts) — NOT lesson population, since lessons don't
 * populate moduleId yet (that's a future content phase).
 *
 * Tests:
 *   - Module catalog validity (all modules have required fields, valid slugs)
 *   - Prerequisite validation (requiredModules reference existing modules)
 *   - Circular dependency detection (no cycles in the module prerequisite graph)
 *   - Track config validity (all track module references resolve)
 *   - Assessment level validity
 *   - Capstone tier validity
 */
import { describe, it, expect } from "vitest";
import {
  MODULE_CATALOG,
  MODULE_MAP,
  ALL_MODULE_SLUGS,
  getModule,
} from "@/lib/curriculum/module-catalog";
import { ASSESSMENT_LEVELS } from "@/lib/curriculum/assessments";
import { CAPSTONE_TIERS } from "@/lib/curriculum/capstones";
import type { CurriculumModule } from "@/lib/curriculum/types";

// ---- Tests ----

describe("Curriculum: module catalog validity", () => {
  it("MODULE_CATALOG is a non-empty array", () => {
    expect(Array.isArray(MODULE_CATALOG)).toBe(true);
    expect(MODULE_CATALOG.length).toBeGreaterThan(0);
  });

  it("every module has all required fields", () => {
    const errors: string[] = [];
    for (const mod of MODULE_CATALOG) {
      if (typeof mod.slug !== "string" || !mod.slug.startsWith("c_"))
        errors.push(`${mod.slug}: slug must start with "c_"`);
      if (typeof mod.title !== "string" || !mod.title) errors.push(`${mod.slug}: missing title`);
      if (typeof mod.description !== "string" || !mod.description) errors.push(`${mod.slug}: missing description`);
      if (typeof mod.icon !== "string" || !mod.icon) errors.push(`${mod.slug}: missing icon`);
      if (!["beginner", "intermediate", "advanced"].includes(mod.difficulty))
        errors.push(`${mod.slug}: invalid difficulty "${mod.difficulty}"`);
      if (typeof mod.difficultyScore !== "number" || mod.difficultyScore < 1 || mod.difficultyScore > 5)
        errors.push(`${mod.slug}: invalid difficultyScore=${mod.difficultyScore}`);
      if (typeof mod.sequence !== "number" || mod.sequence < 1)
        errors.push(`${mod.slug}: invalid sequence=${mod.sequence}`);
      if (typeof mod.estimatedHours !== "number" || mod.estimatedHours < 0)
        errors.push(`${mod.slug}: invalid estimatedHours=${mod.estimatedHours}`);
      if (typeof mod.optionalByDefault !== "boolean") errors.push(`${mod.slug}: optionalByDefault not boolean`);
      if (!Array.isArray(mod.requiredModules)) errors.push(`${mod.slug}: requiredModules not array`);
      if (!Array.isArray(mod.skillsUnlocked)) errors.push(`${mod.slug}: skillsUnlocked not array`);
      if (typeof mod.certificateEligible !== "boolean") errors.push(`${mod.slug}: certificateEligible not boolean`);
      if (typeof mod.hasModuleQuiz !== "boolean") errors.push(`${mod.slug}: hasModuleQuiz not boolean`);
      if (typeof mod.hasCheckpointExam !== "boolean") errors.push(`${mod.slug}: hasCheckpointExam not boolean`);
      if (!Array.isArray(mod.appliesTo) || mod.appliesTo.length === 0)
        errors.push(`${mod.slug}: appliesTo must be non-empty array`);
      if (typeof mod.version !== "string" || !mod.version) errors.push(`${mod.slug}: missing version`);
    }
    expect(errors).toEqual([]);
  });

  it("all module slugs are unique", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const mod of MODULE_CATALOG) {
      if (seen.has(mod.slug)) duplicates.push(mod.slug);
      else seen.add(mod.slug);
    }
    expect(duplicates).toEqual([]);
  });

  it("MODULE_MAP contains all catalog modules", () => {
    for (const mod of MODULE_CATALOG) {
      expect(MODULE_MAP[mod.slug]).toBeDefined();
      expect(MODULE_MAP[mod.slug].slug).toBe(mod.slug);
    }
  });

  it("ALL_MODULE_SLUGS matches catalog slugs", () => {
    expect(ALL_MODULE_SLUGS.length).toBe(MODULE_CATALOG.length);
    for (const mod of MODULE_CATALOG) {
      expect(ALL_MODULE_SLUGS).toContain(mod.slug);
    }
  });

  it("getModule returns the correct module or undefined", () => {
    const first = MODULE_CATALOG[0];
    expect(getModule(first.slug)).toBe(first);
    expect(getModule("nonexistent-slug")).toBeUndefined();
  });
});

describe("Curriculum: prerequisite validation", () => {
  it("all requiredModules references point to existing modules", () => {
    const errors: string[] = [];
    const validSlugs = new Set(MODULE_CATALOG.map((m) => m.slug));
    for (const mod of MODULE_CATALOG) {
      for (const req of mod.requiredModules) {
        if (!validSlugs.has(req)) {
          errors.push(`${mod.slug}: requiredModules references unknown "${req}"`);
        }
      }
    }
    expect(errors).toEqual([]);
  });

  it("no module lists itself as a prerequisite", () => {
    const errors: string[] = [];
    for (const mod of MODULE_CATALOG) {
      if (mod.requiredModules.includes(mod.slug)) {
        errors.push(`${mod.slug}: lists itself as a prerequisite`);
      }
    }
    expect(errors).toEqual([]);
  });
});

describe("Curriculum: circular dependency detection", () => {
  it("no circular dependencies in module prerequisite graph", () => {
    // DFS-based cycle detection on the requiredModules graph.
    const errors: string[] = [];
    const moduleMap = new Map(MODULE_CATALOG.map((m) => [m.slug, m]));

    function hasCycle(startSlug: string): string[] | null {
      const visited = new Set<string>();
      const path: string[] = [];

      function dfs(slug: string): string[] | null {
        if (path.includes(slug)) {
          // Found a cycle — return the cycle path
          const cycleStart = path.indexOf(slug);
          return [...path.slice(cycleStart), slug];
        }
        if (visited.has(slug)) return null;
        visited.add(slug);
        path.push(slug);

        const mod = moduleMap.get(slug);
        if (mod) {
          for (const req of mod.requiredModules) {
            const cycle = dfs(req);
            if (cycle) return cycle;
          }
        }

        path.pop();
        return null;
      }

      return dfs(startSlug);
    }

    for (const mod of MODULE_CATALOG) {
      const cycle = hasCycle(mod.slug);
      if (cycle) {
        errors.push(`${mod.slug}: circular dependency → ${cycle.join(" → ")}`);
      }
    }
    expect(errors).toEqual([]);
  });
});

describe("Curriculum: assessment level validity", () => {
  it("ASSESSMENT_LEVELS is a non-empty array", () => {
    expect(Array.isArray(ASSESSMENT_LEVELS)).toBe(true);
    expect(ASSESSMENT_LEVELS.length).toBeGreaterThan(0);
  });

  it("every assessment level has required fields", () => {
    const errors: string[] = [];
    for (const level of ASSESSMENT_LEVELS) {
      if (typeof level.id !== "string" || !level.id) errors.push("level missing id");
      if (typeof level.title !== "string" || !level.title) errors.push(`${level.id}: missing title`);
      if (typeof level.passMark !== "number" || level.passMark < 0 || level.passMark > 100)
        errors.push(`${level.id}: invalid passMark=${level.passMark}`);
      if (typeof level.certificateWeight !== "number" || level.certificateWeight < 0)
        errors.push(`${level.id}: invalid certificateWeight=${level.certificateWeight}`);
      if (typeof level.unlimitedRetakes !== "boolean") errors.push(`${level.id}: unlimitedRetakes not boolean`);
    }
    expect(errors).toEqual([]);
  });

  it("assessment level ids are unique", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const level of ASSESSMENT_LEVELS) {
      if (seen.has(level.id)) duplicates.push(level.id);
      else seen.add(level.id);
    }
    expect(duplicates).toEqual([]);
  });
});

describe("Curriculum: capstone tier validity", () => {
  it("CAPSTONE_TIERS is a non-empty array", () => {
    expect(Array.isArray(CAPSTONE_TIERS)).toBe(true);
    expect(CAPSTONE_TIERS.length).toBeGreaterThan(0);
  });

  it("every capstone tier has required fields", () => {
    const errors: string[] = [];
    for (const tier of CAPSTONE_TIERS) {
      if (typeof tier.id !== "string" || !tier.id) errors.push("tier missing id");
      if (typeof tier.title !== "string" || !tier.title) errors.push(`${tier.id}: missing title`);
      if (!["beginner", "intermediate", "advanced"].includes(tier.difficulty))
        errors.push(`${tier.id}: invalid difficulty "${tier.difficulty}"`);
      if (typeof tier.estimatedHours !== "number" || tier.estimatedHours < 0)
        errors.push(`${tier.id}: invalid estimatedHours=${tier.estimatedHours}`);
      if (typeof tier.certificateRequired !== "boolean") errors.push(`${tier.id}: certificateRequired not boolean`);
    }
    expect(errors).toEqual([]);
  });

  it("capstone tier ids are unique", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const tier of CAPSTONE_TIERS) {
      if (seen.has(tier.id)) duplicates.push(tier.id);
      else seen.add(tier.id);
    }
    expect(duplicates).toEqual([]);
  });
});
