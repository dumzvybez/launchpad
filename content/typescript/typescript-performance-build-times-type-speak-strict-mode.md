---
slug: typescript-performance-build-times-type-speak-strict-mode
id: typescript-19
track: typescript
order: 19
title: Performance — Build Times, Type-Speak, and Strict Mode
description: Diagnose slow TypeScript builds, reduce type-checking overhead, and configure tsconfig for fast CI and editor feedback.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=12400s
whyItMatters: Diagnose slow TypeScript builds, reduce type-checking overhead, and configure tsconfig for fast CI and editor feedback.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Performance — Build Times, Type-Speak, and Strict Mode

## Performance — Build Times, Type-Speak, and Strict Mode

### Why It Matters

Diagnose slow TypeScript builds, reduce type-checking overhead, and configure tsconfig for fast CI and editor feedback.

Diagnose slow TypeScript builds, reduce type-checking overhead, and configure tsconfig for fast CI and editor feedback.

### Prerequisites

- Stage 11: Tooling — tsconfig, ESLint, Prettier.
- Stage 18: Advanced Generics and Higher-Order Types.

### Topics

- `tsc --extendedDiagnostics` and what to look for
- Project references and incremental builds (`--incremental`, `.tsbuildinfo`)
- `skipLibCheck` and the `types` array
- Strict mode performance impact (small but real)
- Heavy conditional/mapped types and recursion limits
- The `typescript-eslint` type-aware overhead and `parserOptions.project`
- Editor (LSP) performance and `tsserver` memory
- `swc`/`esbuild` for emit, `tsc` for type-checking (separation)

### Key Concepts

- Type-checking is single-threaded per project; project references let `tsc --build` parallelize across packages.
- `skipLibCheck` skips `.d.ts` checking — usually safe and a big win on large dependency trees.
- Deep conditional/mapped types (especially recursive ones) can blow up type-checking time quadratically.
- Modern stacks separate emit (esbuild/swc, fast) from type-checking (`tsc --noEmit`, run in CI or via editor LSP).
- `incremental: true` with `tsBuildInfoFile` enables incremental builds that only re-check changed files.

```json
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/server" },
    { "path": "./packages/web" }
  ]
}
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "composite": true, "outDir": "dist" },
  "include": ["src"]
}
```
Caption: Project references

### Common Pitfalls

- Running `tsc` (with emit) in CI when you only need type-checking — `tsc --noEmit` is faster and is the right CI command when a bundler handles emit.
- Forgetting `composite: true` on referenced projects — `tsc --build` refuses to build a project whose dependencies aren't composite.
- Enabling `@typescript-eslint` type-aware rules across a 100k-LOC monorepo without scoping — they're 5-10x slower than non-type-aware rules; scope them to changed files in CI.
- Defining a recursive conditional type that fans out exponentially — e.g., `DeepReadonly<T>` over a wide tree; cap recursion or use a finite-depth variant.
- Letting `tsserver` balloon in memory — increase `maxTsServerMemory` in VS Code, or restart the LSP; large unions and intersections are common culprits.

### Real-World Applications

- The TypeScript compiler itself uses project references and incremental builds to keep `tsc --build` under a minute on its own ~700k-LOC codebase.
- Airbnb's monorepo uses `tsc --build` with project references per package; CI caches `.tsbuildinfo` to skip unchanged packages.
- Vercel uses `esbuild` for emit and `tsc --noEmit` for type-checking in parallel, halving build times on Next.js apps.
- The Rush monorepo tool orchestrates `tsc --build` across packages with change detection.

### Interview Questions

- 1. How do you speed up `tsc` on a large project? — Use project references + `--build --incremental`, enable `skipLibCheck`, and separate emit (esbuild) from type-checking (`tsc --noEmit`).
- 2. What does `skipLibCheck` skip? — Type-checking of all `.d.ts` files (yours and dependencies'); usually safe because libraries are responsible for their own correctness.
- 3. Why separate emit from type-checking? — esbuild/swc emit is 10-100x faster than `tsc` emit; `tsc --noEmit` runs in parallel in CI without blocking the bundler.
- 4. What is `composite: true` for? — Marking a project as buildable by `tsc --build`; enables project references and incremental builds with `.tsbuildinfo`.
- 5. What's a common cause of slow `tsserver` (editor) memory? — Large unions/intersections and deep recursive types; the LSP has to materialize them on every keystroke.

### Mini Project

Profile and Optimize a Slow TS Build: Take a small but slow project (or generate one with many files), run `tsc --extendedDiagnostics`, identify the bottleneck, and apply optimizations. Suggested approach:
  - Create a project with 100 `.ts` files and a wide union type
  - Run `tsc --noEmit --extendedDiagnostics` and note "Check time" and "Types"
  - Add `skipLibCheck: true`, `incremental: true`, `tsBuildInfoFile`
  - Split into two project references and use `tsc --build`
  - Re-run diagnostics and record the before/after times

### Exercises

1. Run `tsc --extendedDiagnostics` on an existing project and identify the slowest phase.
2. Enable `incremental: true` and confirm a second `tsc` is faster (uses `.tsbuildinfo`).
3. Add `skipLibCheck: true` and observe the drop in files checked.
4. Split a 2-package project into project references; run `tsc --build` and confirm parallel builds.
5. Move emit to `esbuild` and replace `npm run build` with a `tsc --noEmit` + `esbuild` combo.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which `tsc` flag prints check time, files, and memory?
9. A) `--verbose`
10. B) `--profile`
11. C) `--extendedDiagnostics` (*)
12. D) `--stats`
13. Explanation: `--extendedDiagnostics` prints detailed timing, file counts, and memory usage for each compiler phase.
14. Q2: Which tsconfig flag skips type-checking of `.d.ts` files?
15. A) `noResolve`
16. B) `declaration`
17. C) `types: []`
18. D) `skipLibCheck` (*)
19. Explanation: `skipLibCheck: true` skips type-checking all declaration files (yours and dependencies'), usually a large speed win with minimal safety loss.
20. Q3: Which flag enables incremental builds with `.tsbuildinfo`?
21. A) `--incremental` (*)
22. B) `--watch`
23. C) `--build`
24. D) `--cache`
25. Explanation: `--incremental` (or `incremental: true` in tsconfig) writes `.tsbuildinfo` so the next `tsc` only re-checks changed files.
26. Q4: What does `composite: true` enable?
27. A) Strict mode
28. B) Project references and `tsc --build` (*)
29. C) Faster emit
30. D) Decorators
31. Explanation: `composite: true` marks a project as buildable, enabling it to be referenced by other projects and to produce `.tsbuildinfo` for incremental builds.
32. Q5: Why separate emit (esbuild) from type-checking (`tsc --noEmit`)?
33. A) `tsc` cannot emit ES modules
34. B) esbuild does not support TypeScript
35. C) esbuild emit is 10-100x faster; `tsc --noEmit` runs in parallel in CI (*)
36. D) `tsc --noEmit` is more accurate
37. Explanation: esbuild/swc transpile per-file without type-checking, which is much faster; `tsc --noEmit` runs in parallel as a separate CI step to enforce type safety.
38. Q6: Which type-aware ESLint setup is slowest?
39. A) `recommended` (no type info)
40. B) `recommended` with `eslint:recommended`
41. C) `eslint:recommended` only
42. D) `recommendedTypeChecked` with `parserOptions.project` across the whole repo (*)
43. Explanation: Type-aware rules need a TS program per file; running them project-wide is 5-10x slower than non-type-aware rules, so scope them to changed files in CI.
44. Q7: What's a common cause of `tsserver` memory bloat?
45. A) Large unions/intersections and deep recursive types (*)
46. B) Too few files
47. C) Too many comments
48. D) Using `const` instead of `let`
49. Explanation: Large unions and recursive conditional types force the LSP to materialize many types on every keystroke, ballooning memory and slowing autocomplete.
50. Q8: Which command builds only changed packages in a monorepo?
51. A) `tsc --watch`
52. B) `tsc --build` with project references and `.tsbuildinfo` (*)
53. C) `tsc --noEmit`
54. D) `tsc --skipLibCheck`
55. Explanation: `tsc --build` uses project references and `.tsbuildinfo` to skip packages whose inputs haven't changed since the last successful build.
56. Q9: What's the recursion limit in TS type-level programming?
57. A) 1000
58. B) Unlimited
59. C) ~50 instantiations (*)
60. D) 10
61. Explanation: TS caps type-level recursion at roughly 50 instantiations, after which it errors with "Type instantiation is excessively deep and possibly infinite".
62. Q10: Which is the recommended CI command for a project that uses a bundler for emit?
63. A) `tsc` (with emit)
64. B) `tsc --watch`
65. C) `tsc --build`
66. D) `tsc --noEmit` for type-checking only (*)
67. Explanation: When a bundler (esbuild/webpack/Vite) handles emit, CI should run `tsc --noEmit` to enforce type safety without duplicating emit work.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which `tsc` flag prints check time, files, and memory?
  options:
    - "`--verbose`"
    - "`--profile`"
    - "`--extendedDiagnostics`"
    - "`--stats`"
  correctIndex: 2
  explanation: "`--extendedDiagnostics` prints detailed timing, file counts, and memory usage for each compiler phase."
- id: q2
  question: Which tsconfig flag skips type-checking of `.d.ts` files?
  options:
    - "`noResolve`"
    - "`declaration`"
    - "`types: []`"
    - "`skipLibCheck`"
  correctIndex: 3
  explanation: "`skipLibCheck: true` skips type-checking all declaration files (yours and dependencies'), usually a large speed win with minimal safety loss."
- id: q3
  question: Which flag enables incremental builds with `.tsbuildinfo`?
  options:
    - "`--incremental`"
    - "`--watch`"
    - "`--build`"
    - "`--cache`"
  correctIndex: 0
  explanation: "`--incremental` (or `incremental: true` in tsconfig) writes `.tsbuildinfo` so the next `tsc` only re-checks changed files."
- id: q4
  question: "What does `composite: true` enable?"
  options:
    - Strict mode
    - Project references and `tsc --build`
    - Faster emit
    - Decorators
  correctIndex: 1
  explanation: "`composite: true` marks a project as buildable, enabling it to be referenced by other projects and to produce `.tsbuildinfo` for incremental builds."
- id: q5
  question: Why separate emit (esbuild) from type-checking (`tsc --noEmit`)?
  options:
    - "`tsc` cannot emit ES modules"
    - esbuild does not support TypeScript
    - esbuild emit is 10-100x faster; `tsc --noEmit` runs in parallel in CI
    - "`tsc --noEmit` is more accurate"
  correctIndex: 2
  explanation: esbuild/swc transpile per-file without type-checking, which is much faster; `tsc --noEmit` runs in parallel as a separate CI step to enforce type safety.
- id: q6
  question: Which type-aware ESLint setup is slowest?
  options:
    - "`recommended` (no type info)"
    - "`recommended` with `eslint:recommended`"
    - "`eslint:recommended` only"
    - "`recommendedTypeChecked` with `parserOptions.project` across the whole repo"
  correctIndex: 3
  explanation: Type-aware rules need a TS program per file; running them project-wide is 5-10x slower than non-type-aware rules, so scope them to changed files in CI.
- id: q7
  question: What's a common cause of `tsserver` memory bloat?
  options:
    - Large unions/intersections and deep recursive types
    - Too few files
    - Too many comments
    - Using `const` instead of `let`
  correctIndex: 0
  explanation: Large unions and recursive conditional types force the LSP to materialize many types on every keystroke, ballooning memory and slowing autocomplete.
- id: q8
  question: Which command builds only changed packages in a monorepo?
  options:
    - "`tsc --watch`"
    - "`tsc --build` with project references and `.tsbuildinfo`"
    - "`tsc --noEmit`"
    - "`tsc --skipLibCheck`"
  correctIndex: 1
  explanation: "`tsc --build` uses project references and `.tsbuildinfo` to skip packages whose inputs haven't changed since the last successful build."
- id: q9
  question: What's the recursion limit in TS type-level programming?
  options:
    - "1000"
    - Unlimited
    - ~50 instantiations
    - "10"
  correctIndex: 2
  explanation: TS caps type-level recursion at roughly 50 instantiations, after which it errors with "Type instantiation is excessively deep and possibly infinite".
- id: q10
  question: Which is the recommended CI command for a project that uses a bundler for emit?
  options:
    - "`tsc` (with emit)"
    - "`tsc --watch`"
    - "`tsc --build`"
    - "`tsc --noEmit` for type-checking only"
  correctIndex: 3
  explanation: When a bundler (esbuild/webpack/Vite) handles emit, CI should run `tsc --noEmit` to enforce type safety without duplicating emit work.
```

