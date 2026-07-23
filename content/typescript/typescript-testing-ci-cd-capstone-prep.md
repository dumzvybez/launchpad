---
slug: typescript-testing-ci-cd-capstone-prep
id: typescript-20
track: typescript
order: 20
title: Testing, CI/CD, and Capstone Prep
description: Write unit tests with Vitest/Jest, set up GitHub Actions for type-check + test + build, and prepare your capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=13200s
whyItMatters: Write unit tests with Vitest/Jest, set up GitHub Actions for type-check + test + build, and prepare your capstone project.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Testing, CI/CD, and Capstone Prep

## Testing, CI/CD, and Capstone Prep

### Why It Matters

Write unit tests with Vitest/Jest, set up GitHub Actions for type-check + test + build, and prepare your capstone project.

Write unit tests with Vitest/Jest, set up GitHub Actions for type-check + test + build, and prepare your capstone project.

### Prerequisites

- Stage 11: Tooling — tsconfig, ESLint, Prettier.
- Stage 17: TypeScript with Node.js.
- Stage 19: Performance — Build Times, Type-Speak, and Strict Mode.

### Topics

- Vitest (or Jest) with TypeScript via `vite-tsconfig-paths` / `ts-jest`
- Type-only test files and `import type` in tests
- Property-based testing with `fast-check`
- Coverage thresholds via `c8` or `vitest --coverage`
- Mocking typed modules (`vi.mock`)
- GitHub Actions: `actions/setup-node`, cache `node_modules` and `.tsbuildinfo`
- Type-check, lint, test, build as separate CI jobs
- Capstone preparation: project structure, requirements traceability

### Key Concepts

- Vitest is the modern Vitest+Vite-based test runner; it reads your `vite.config.ts` and supports TS natively (no `ts-jest` needed).
- Type-only imports in tests (`import type`) matter under `isolatedModules`; the test transpiler will error otherwise.
- Coverage thresholds (lines/branches/functions) in CI prevent regressions; start at 70% and raise.
- `vi.mock` is fully typed — mocked module types flow into the consuming code.
- CI should run type-check (`tsc --noEmit`), lint (`eslint`), tests (`vitest run`), and build as separate, cacheable steps.

```typescript
// math.test.ts
import { describe, it, expect } from "vitest";
import { add } from "./math";

describe("add", () => {
  it("sums two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
  it("handles negatives", () => {
    expect(add(-1, -2)).toBe(-3);
  });
});
```
Caption: Vitest test file

### Common Pitfalls

- Using `ts-jest` for new projects — Vitest with native TS support (via esbuild) is 5-20x faster and simpler; `ts-jest` is legacy.
- Forgetting `import type` in test files under `isolatedModules` — the test runner's transpiler will error on type-only imports.
- Setting coverage thresholds too high (95%+) — encourages low-value tests; aim for 70-80% on core modules and use coverage as a guard, not a goal.
- Caching `node_modules` but not `.tsbuildinfo` — incremental builds reset every CI run; cache both for fastest type-check.
- Running all checks in one CI job — split them so a lint failure doesn't hide a test failure; cacheable parallel jobs surface more signal.

### Real-World Applications

- Vite and Vitest themselves are tested with Vitest; their CI runs type-check, lint, unit tests, and E2E on every PR.
- The TypeScript compiler uses Jest with `ts-jest` (legacy) and a custom transformer; newer Microsoft projects have moved to Vitest.
- Vercel's CI uses parallel GitHub Actions jobs for type-check, lint, unit tests, and Playwright E2E per package.
- Linear's CI uses a Turborepo-aware Vitest setup that only re-runs tests for changed packages.

### Interview Questions

- 1. Why prefer Vitest over Jest for new TS projects? — Vitest uses Vite's esbuild pipeline (native TS, no `ts-jest`), is 5-20x faster, and shares your `vite.config.ts`.
- 2. What does `vi.mock` do? — Replaces a module's exports with mock implementations; the mock is fully typed so consuming code keeps its types.
- 3. What's a sensible coverage threshold? — 70-80% on core modules; use coverage as a regression guard, not a target. Above 90% encourages low-value tests.
- 4. Why split CI into type-check, lint, test, build jobs? — Parallel jobs surface more signal (one failure doesn't hide another) and each step is independently cacheable.
- 5. What should you cache in CI for a TS project? — `node_modules` (via `npm ci` cache) AND `.tsbuildinfo` for incremental `tsc` builds.

### Mini Project

Add Tests and CI to a Small TypeScript Project: Take the URL-shortener from Stage 17, add Vitest unit tests for the URL-validation logic, and configure a GitHub Actions workflow. Suggested approach:
  - Install `vitest` and write `shorten.test.ts` testing `validateUrl`, `generateCode`, and the route handler
  - Use `vi.mock` to mock the storage layer
  - Add a `vitest.config.ts` with coverage thresholds (lines: 70, branches: 60)
  - Write `.github/workflows/ci.yml` with type-check, lint, test, build jobs
  - Push to GitHub and confirm all jobs pass

### Exercises

1. Install Vitest and write 5 unit tests for a small math module.
2. Use `vi.mock` to mock a `db` module in a service test; verify the mock is typed.
3. Add a property-based test with `fast-check` for a sorting function.
4. Configure coverage thresholds in `vitest.config.ts` and run `vitest run --coverage`.
5. Write a GitHub Actions workflow that runs `typecheck`, `lint`, `test`, and `build` in parallel jobs.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which test runner is recommended for new TS projects?
9. A) Jest with `ts-jest`
10. B) Mocha with `ts-node`
11. C) Jasmine
12. D) Vitest (native TS via esbuild) (*)
13. Explanation: Vitest uses Vite's esbuild pipeline to handle TypeScript natively (no `ts-jest`), is 5-20x faster, and shares your `vite.config.ts`.
14. Q2: What does `vi.mock("./db", () => ({ ... }))` do?
15. A) Replaces the db module's exports with mock implementations (*)
16. B) Spies on the db module
17. C) Deletes the db module
18. D) Re-runs db tests
19. Explanation: `vi.mock` substitutes the module's exports with the provided mock; the mock is typed against the original, so consuming code keeps its types.
20. Q3: Under `isolatedModules`, what must test files use for type-only imports?
21. A) `require`
22. B) `import type` (*)
23. C) `import =`
24. D) Nothing — type imports are allowed as-is
25. Explanation: `isolatedModules` requires `import type` so the test runner's single-file transpiler can safely erase type imports.
26. Q4: What's a sensible coverage threshold for a new TS project?
27. A) 95-100%
28. B) 0%
29. C) 70-80% on core modules (*)
30. D) 50%
31. Explanation: 70-80% on core modules balances regression protection with avoiding low-value "coverage tests"; raise over time but don't start at 95%+.
32. Q5: Why split CI into separate type-check, lint, test, build jobs?
33. A) It's required by GitHub
34. B) It's slower but more correct
35. C) Single-job CI is deprecated
36. D) Parallel jobs surface more signal and are independently cacheable (*)
37. Explanation: Parallel jobs let one failure not hide another, and each step can be cached and re-used (e.g., `.tsbuildinfo` for incremental `tsc`).
38. Q6: Which GitHub Action sets up Node.js with cache?
39. A) `actions/setup-node@v4` with `cache: "npm"` (*)
40. B) `actions/node`
41. C) `actions/setup-typescript`
42. D) `actions/install-node`
43. Explanation: `actions/setup-node@v4` configures Node and (with `cache: "npm"`) caches the npm cache directory across runs.
44. Q7: Which command runs Vitest once in CI (no watch)?
45. A) `vitest`
46. B) `vitest run` (*)
47. C) `vitest --ci`
48. D) `vitest --no-watch`
49. Explanation: `vitest run` executes tests once and exits; the bare `vitest` defaults to watch mode (interactive, doesn't exit).
50. Q8: What should you cache alongside `node_modules` for a TS project?
51. A) `dist/`
52. B) `coverage/`
53. C) `.tsbuildinfo` for incremental `tsc` (*)
54. D) `.eslintcache` only
55. Explanation: `.tsbuildinfo` enables `tsc --incremental` to skip unchanged files; caching it across CI runs is a major speed win.
56. Q9: Which library enables property-based testing in TS?
57. A) `chai`
58. B) `sinon`
59. C) `nock`
60. D) `fast-check` (*)
61. Explanation: `fast-check` generates random inputs according to your specifications and shrinks failing cases — the JS/TS port of QuickCheck.
62. Q10: Which is the recommended CI command for type-checking when a bundler handles emit?
63. A) `tsc --noEmit` (*)
64. B) `tsc --build`
65. C) `tsc --watch`
66. D) `tsc --emit`
67. Explanation: `tsc --noEmit` performs type-checking without writing files — correct when esbuild/webpack/Vite handle emit.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which test runner is recommended for new TS projects?
  options:
    - Jest with `ts-jest`
    - Mocha with `ts-node`
    - Jasmine
    - Vitest (native TS via esbuild)
  correctIndex: 3
  explanation: Vitest uses Vite's esbuild pipeline to handle TypeScript natively (no `ts-jest`), is 5-20x faster, and shares your `vite.config.ts`.
- id: q2
  question: What does `vi.mock("./db", () => ({ ... }))` do?
  options:
    - Replaces the db module's exports with mock implementations
    - Spies on the db module
    - Deletes the db module
    - Re-runs db tests
  correctIndex: 0
  explanation: "`vi.mock` substitutes the module's exports with the provided mock; the mock is typed against the original, so consuming code keeps its types."
- id: q3
  question: Under `isolatedModules`, what must test files use for type-only imports?
  options:
    - "`require`"
    - "`import type`"
    - "`import =`"
    - Nothing — type imports are allowed as-is
  correctIndex: 1
  explanation: "`isolatedModules` requires `import type` so the test runner's single-file transpiler can safely erase type imports."
- id: q4
  question: What's a sensible coverage threshold for a new TS project?
  options:
    - 95-100%
    - 0%
    - 70-80% on core modules
    - 50%
  correctIndex: 2
  explanation: 70-80% on core modules balances regression protection with avoiding low-value "coverage tests"; raise over time but don't start at 95%+.
- id: q5
  question: Why split CI into separate type-check, lint, test, build jobs?
  options:
    - It's required by GitHub
    - It's slower but more correct
    - Single-job CI is deprecated
    - Parallel jobs surface more signal and are independently cacheable
  correctIndex: 3
  explanation: Parallel jobs let one failure not hide another, and each step can be cached and re-used (e.g., `.tsbuildinfo` for incremental `tsc`).
- id: q6
  question: Which GitHub Action sets up Node.js with cache?
  options:
    - '`actions/setup-node@v4` with `cache: "npm"`'
    - "`actions/node`"
    - "`actions/setup-typescript`"
    - "`actions/install-node`"
  correctIndex: 0
  explanation: '`actions/setup-node@v4` configures Node and (with `cache: "npm"`) caches the npm cache directory across runs.'
- id: q7
  question: Which command runs Vitest once in CI (no watch)?
  options:
    - "`vitest`"
    - "`vitest run`"
    - "`vitest --ci`"
    - "`vitest --no-watch`"
  correctIndex: 1
  explanation: "`vitest run` executes tests once and exits; the bare `vitest` defaults to watch mode (interactive, doesn't exit)."
- id: q8
  question: What should you cache alongside `node_modules` for a TS project?
  options:
    - "`dist/`"
    - "`coverage/`"
    - "`.tsbuildinfo` for incremental `tsc`"
    - "`.eslintcache` only"
  correctIndex: 2
  explanation: "`.tsbuildinfo` enables `tsc --incremental` to skip unchanged files; caching it across CI runs is a major speed win."
- id: q9
  question: Which library enables property-based testing in TS?
  options:
    - "`chai`"
    - "`sinon`"
    - "`nock`"
    - "`fast-check`"
  correctIndex: 3
  explanation: "`fast-check` generates random inputs according to your specifications and shrinks failing cases — the JS/TS port of QuickCheck."
- id: q10
  question: Which is the recommended CI command for type-checking when a bundler handles emit?
  options:
    - "`tsc --noEmit`"
    - "`tsc --build`"
    - "`tsc --watch`"
    - "`tsc --emit`"
  correctIndex: 0
  explanation: "`tsc --noEmit` performs type-checking without writing files — correct when esbuild/webpack/Vite handle emit."
```

