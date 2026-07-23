// ============================================================
// curriculum/track-config.ts — v6.004 Per-track curriculum config.
//
// ARCHITECTURE ONLY. No lesson content, no quizzes. This file
// declares, for each of the 38 language tracks:
//   - its language archetype (drives module defaults)
//   - which canonical modules it includes (and which are optional)
//   - which capstone tiers it offers
//   - its certificate requirements
//
// Most tracks use the archetype default (all applicable modules in
// canonical order). A handful of tracks have explicit overrides
// (e.g. SQL skips OOP/generics; HTML skips concurrency; Docker
// offers only beginner + portfolio capstones).
// ============================================================

import type { CurriculumTrackConfig, LanguageArchetype } from "./types";
import { MODULE_CATALOG } from "./module-catalog";

// ----------------------------------------------------------------
// Archetype → default module set
// ----------------------------------------------------------------

/**
 * Builds the default module list for an archetype: every canonical
 * module whose `appliesTo` includes "all" OR the archetype, in
 * canonical sequence order. `optional` is taken from the module's
 * `optionalByDefault`.
 */
function defaultModulesForArchetype(archetype: LanguageArchetype): CurriculumTrackConfig["modules"] {
  return MODULE_CATALOG
    .filter((m) => m.appliesTo.includes("all") || m.appliesTo.includes(archetype))
    .map((m, i) => ({
      moduleSlug: m.slug,
      order: i + 1,
      optional: m.optionalByDefault,
    }));
}

/** Default capstones offered for an archetype. */
function defaultCapstones(archetype: LanguageArchetype): CurriculumTrackConfig["capstonesOffered"] {
  // Markup/query/container tracks offer fewer capstones.
  if (archetype === "markup" || archetype === "query-language" || archetype === "container") {
    return ["beginner", "intermediate", "portfolio", "certification"];
  }
  return ["beginner", "intermediate", "advanced", "portfolio", "career", "certification"];
}

// ----------------------------------------------------------------
// Per-track archetype mapping (38 tracks)
// ----------------------------------------------------------------

export const TRACK_ARCHETYPES: Record<string, LanguageArchetype> = {
  // Compiled systems languages
  c: "systems",
  cpp: "systems",
  rust: "systems",
  go: "systems",
  // JVM
  java: "jvm",
  kotlin: "jvm",
  // Compiled (other)
  csharp: "compiled",
  swift: "compiled",
  dart: "compiled",
  // Interpreted
  python: "interpreted",
  javascript: "interpreted",
  typescript: "interpreted",
  php: "interpreted",
  ruby: "interpreted",
  r: "interpreted",
  bash: "interpreted",
  // Web / frontend
  html: "markup",
  css: "markup",
  tailwind: "markup",
  react: "web",
  vue: "web",
  svelte: "web",
  angular: "web",
  nextjs: "web",
  // Web / backend
  nodejs: "web",
  express: "web",
  // Python web frameworks
  django: "web",
  fastapi: "web",
  flask: "web",
  // Query languages
  sql: "query-language",
  postgresql: "query-language",
  mongodb: "query-language",
  graphql: "query-language",
  // Containers / infra
  docker: "container",
  kubernetes: "container",
  terraform: "container",
  // ML frameworks
  pytorch: "ml-framework",
  tensorflow: "ml-framework",
};

// ----------------------------------------------------------------
// Explicit track overrides (where the default isn't right)
// ----------------------------------------------------------------

/**
 * Track-specific module overrides. Keyed by trackId. Each entry can
 * exclude modules (by slug) or mark them optional/non-optional
 * against the archetype default. ARCHITECTURE ONLY.
 */
const TRACK_OVERRIDES: Record<string, {
  exclude?: string[];
  forceOptional?: string[];
  forceRequired?: string[];
  capstonesOffered?: CurriculumTrackConfig["capstonesOffered"];
  certificateRequiredModuleCount?: number;
  hasCertificateExam?: boolean;
}> = {
  // SQL-like tracks: no OOP, no generics, no concurrency, no memory.
  sql: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi"],
  },
  postgresql: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi"],
  },
  mongodb: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi"],
  },
  graphql: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_interop-ffi"],
  },
  // Markup languages: no OOP, no generics, no concurrency, no memory, no interop.
  html: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi", "c_functional"],
  },
  css: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi", "c_functional"],
  },
  tailwind: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_concurrency-async", "c_interop-ffi", "c_functional"],
  },
  // Bash: no OOP, no generics, simplified.
  bash: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_interop-ffi"],
    forceOptional: ["c_functional", "c_concurrency-async", "c_performance", "c_security"],
  },
  // Containers: focus on professional modules.
  docker: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_interop-ffi", "c_functional"],
    capstonesOffered: ["beginner", "intermediate", "portfolio", "certification"],
  },
  kubernetes: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_interop-ffi", "c_functional"],
    capstonesOffered: ["beginner", "intermediate", "portfolio", "certification"],
  },
  terraform: {
    exclude: ["c_oop", "c_generics-templates", "c_metaprogramming", "c_memory-management", "c_interop-ffi", "c_functional"],
    capstonesOffered: ["beginner", "intermediate", "portfolio", "certification"],
  },
  // ML frameworks: keep OOP + functional; exclude low-level memory/interop.
  pytorch: {
    exclude: ["c_memory-management", "c_interop-ffi", "c_metaprogramming"],
  },
  tensorflow: {
    exclude: ["c_memory-management", "c_interop-ffi", "c_metaprogramming"],
  },
};

// ----------------------------------------------------------------
// Config builder
// ----------------------------------------------------------------

/**
 * Returns the CurriculumTrackConfig for a track. Derived from the
 * archetype default + any explicit overrides. ARCHITECTURE ONLY.
 */
export function getTrackConfig(trackId: string): CurriculumTrackConfig {
  const archetype = TRACK_ARCHETYPES[trackId] ?? "interpreted";
  const override = TRACK_OVERRIDES[trackId] ?? {};
  const baseModules = defaultModulesForArchetype(archetype);

  // Apply exclusions.
  let modules = baseModules.filter(
    (m) => !(override.exclude ?? []).includes(m.moduleSlug),
  );

  // Apply optional/required overrides.
  modules = modules.map((m) => {
    if ((override.forceOptional ?? []).includes(m.moduleSlug)) return { ...m, optional: true };
    if ((override.forceRequired ?? []).includes(m.moduleSlug)) return { ...m, optional: false };
    return m;
  });

  // Re-sequence after exclusions.
  modules = modules.map((m, i) => ({ ...m, order: i + 1 }));

  const capstonesOffered = override.capstonesOffered ?? defaultCapstones(archetype);
  const requiredModuleCount = modules.filter((m) => !m.optional).length;
  // Certificate requires all non-optional modules + the certification capstone.
  const certificateRequiredModuleCount = override.certificateRequiredModuleCount ?? requiredModuleCount;
  const hasCertificateExam = override.hasCertificateExam ?? true;

  return {
    trackId,
    archetype,
    modules,
    capstonesOffered,
    certificateRequiredModuleCount,
    certificateRequiredCapstones: capstonesOffered.includes("certification") ? ["certification"] : [],
    defaultAssessment: "lesson-quiz",
    hasCertificateExam,
  };
}

/** All 38 track configs (lazy-built map). */
const _trackConfigCache = new Map<string, CurriculumTrackConfig>();
export function getAllTrackConfigs(): CurriculumTrackConfig[] {
  return Object.keys(TRACK_ARCHETYPES).map((id) => {
    if (!_trackConfigCache.has(id)) _trackConfigCache.set(id, getTrackConfig(id));
    return _trackConfigCache.get(id)!;
  });
}

/** Quick lookup. */
export function getTrackArchetype(trackId: string): LanguageArchetype {
  return TRACK_ARCHETYPES[trackId] ?? "interpreted";
}
