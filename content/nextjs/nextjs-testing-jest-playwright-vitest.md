---
slug: nextjs-testing-jest-playwright-vitest
id: nextjs-17
track: nextjs
order: 17
title: Testing — Jest, Playwright, Vitest
description: Write unit tests with Vitest, integration tests with React Testing Library, and end-to-end tests with Playwright — and run them in CI against your Next.js app.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=360s
whyItMatters: Write unit tests with Vitest, integration tests with React Testing Library, and end-to-end tests with Playwright — and run them in CI against your Next. js app.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Testing — Jest, Playwright, Vitest

## Testing — Jest, Playwright, Vitest

### Why It Matters

Write unit tests with Vitest, integration tests with React Testing Library, and end-to-end tests with Playwright — and run them in CI against your Next. js app.

Write unit tests with Vitest, integration tests with React Testing Library, and end-to-end tests with Playwright — and run them in CI against your Next.js app.

### Prerequisites

- Stage 15: Database Integration — Prisma, Drizzle.
- Stage 13: Forms, Server Actions, and Mutations.
- Basic testing concepts (assert, mock, fixture).

### Topics

- Vitest setup for unit testing utilities and pure functions
- React Testing Library for component tests
- `next/test` for server component tests (experimental)
- Mocking `next/headers`, `next/navigation`, and `next/cache`
- Playwright for E2E across Chromium, Firefox, WebKit
- `playwright.config.ts` with baseURL and webServer
- Testing Server Actions and Route Handlers
- Coverage targets and CI integration

### Key Concepts

- Vitest is a Jest-compatible runner with ESM support and faster HMR; preferred for new Next.js projects
- React Testing Library renders client components and asserts on DOM output
- Server components are harder to test directly — extract logic into pure functions and test those, or use `next/test`
- Playwright runs a real browser against `next start` (or `next dev`) for true E2E
- Mock `next/headers` and `next/navigation` in unit tests because they require a request context

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: { reporter: ["text", "html"], include: ["src/**/*.{ts,tsx}"] },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```
Caption: Vitest config

### Common Pitfalls

- Testing server components directly with RTL — they require async rendering and a request context; extract logic into pure functions or test via Playwright E2E.
- Forgetting to mock `next/navigation` in component tests — calling `useRouter()` without a mock throws because there is no router context.
- Running Playwright against `next dev` in CI — dev mode is slower and less stable; use `next build && next start` for E2E.
- Allowing `global.fetch` mocks to leak between tests — call `vi.restoreAllMocks()` in `afterEach` to avoid one test affecting another.
- Setting coverage targets without exclusions — `__tests__`, `*.config.*`, and `app/layout.tsx` will tank coverage; exclude them.

### Real-World Applications

- Vercel uses Playwright for E2E tests across its dashboard and runs them on every PR.
- Notion uses Vitest for unit-testing block renderers and Playwright for editor E2E flows.
- Hulu uses Playwright to verify purchase flows across three browser engines before each release.
- Twitch uses Playwright to test the creator dashboard with mocked live-stream backends.

### Interview Questions

- 1. Why prefer Vitest over Jest for a Next.js project? — Vitest has native ESM, faster startup, Vite-powered transforms, and a Jest-compatible API — better fit for modern Next.js codebases.
- 2. How do you test a server component? — Extract logic into pure functions and test those, or use `next/test` (experimental); for full coverage use Playwright E2E.
- 3. Why mock `next/navigation` in component tests? — Hooks like `useRouter` and `useSearchParams` require a router context; without a mock they throw.
- 4. Why run Playwright against `next start` in CI? — Dev mode is slower, less stable, and includes hot-reload code that production does not; `next build && next start` matches production.
- 5. What is the difference between a unit test and an E2E test? — Unit tests isolate functions/components; E2E tests drive a real browser against the running app to verify full user flows.

### Mini Project

Build a tested counter: A `Counter` client component with increment and decrement buttons, a Vitest unit test verifying the buttons change the count, and a Playwright E2E test loading the page and clicking increment. Suggested approach:
  - Create `src/components/Counter.tsx` with `useState`
  - Add `Counter.test.tsx` with RTL clicking the buttons and asserting on the displayed count
  - Mock `next/navigation` in `vitest.setup.ts` (in case Counter imports it)
  - Add `e2e/counter.spec.ts` that loads `/`, clicks Increment, and asserts the count updates
  - Run `npm run test` and `npm run e2e` to verify both pass

### Exercises

1. Install Vitest and write a unit test for a pure `formatPrice` function.
2. Add React Testing Library and write a component test for a Button that fires onClick.
3. Mock `next/navigation` and verify a component using `useRouter()` builds correctly.
4. Install Playwright and write an E2E test that loads `/` and asserts on a heading.
5. Add coverage thresholds (80% lines) and exclude `*.config.*` files.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which runner is recommended for unit tests in modern Next.js projects?
9. A) Vitest (*)
10. B) Jest
11. C) Mocha
12. D) Jasmine
13. Explanation: Vitest has native ESM, faster startup via Vite, and a Jest-compatible API — a better fit for modern Next.js codebases than Jest, which requires more config.
14. Q2: Why is testing a server component with React Testing Library hard?
15. A) Server components cannot be tested
16. B) They require async rendering and a request context; extract logic into pure functions or use E2E (*)
17. C) RTL does not support TypeScript
18. D) Server components are private
19. Explanation: Server components are async and depend on a request context (cookies, headers); RTL is designed for synchronous client rendering. Extract pure logic to test, or use Playwright E2E.
20. Q3: Why mock `next/navigation` in component tests?
21. A) It is too slow
22. B) It triggers network requests
23. C) Hooks like useRouter() require a router context; without a mock they throw (*)
24. D) It is required by Vitest
25. Explanation: `useRouter`, `usePathname`, and `useSearchParams` need a router context that does not exist in unit tests; mocking them provides safe stubs.
26. Q4: Which Playwright config runs the app for E2E in CI?
27. A) testDir
28. B) baseURL only
29. C) projects
30. D) webServer with command: "npm run build && npm run start" (*)
31. Explanation: `webServer` starts your app (`next build && next start`) and waits for `url` to respond before running tests, ensuring a production-like environment.
32. Q5: Why run Playwright against `next start` (not `next dev`) in CI?
33. A) Dev mode is slower, less stable, and includes hot-reload code that production does not (*)
34. B) Dev mode is faster
35. C) Dev mode does not support testing
36. D) Start mode is free
37. Explanation: Dev mode includes Fast Refresh, on-demand compilation, and dev-only warnings — all unsuitable for E2E. `next build && next start` matches production behavior.
38. Q6: How do you prevent fetch mocks from leaking between tests?
39. A) Use jest.restoreAllMocks()
40. B) Call vi.restoreAllMocks() in afterEach (*)
41. C) Restart the test runner
42. D) You cannot
43. Explanation: Vitest's `vi.restoreAllMocks()` in `afterEach` resets all mocks so one test's `global.fetch = vi.fn()` does not affect subsequent tests.
44. Q7: Which library is the standard for rendering React components in tests?
45. A) Enzyme
46. B) React Test Renderer
47. C) React Testing Library (*)
48. D) Sinon
49. Explanation: React Testing Library is the standard for component tests; it renders components into a real DOM and asserts on accessible, user-visible output rather than internals.
50. Q8: What is a typical coverage target for a Next.js app?
51. A) 100% on every file
52. B) 50%
53. C) Coverage does not matter
54. D) ≥80% line coverage on core modules, excluding config and layout files (*)
55. Explanation: A common target is ≥80% line coverage on core modules; exclude `*.config.*`, `app/layout.tsx`, and `__tests__` files so boilerplate does not drag down the number.
56. Q9: Which Playwright feature records a trace for debugging failed tests?
57. A) trace: "on-first-retry" (*)
58. B) video: true only
59. C) screenshot: true only
60. D) debug: true
61. Explanation: `trace: "on-first-retry"` records a full trace (DOM snapshots, network, console) on the first retry, viewable in `npx playwright show-trace`.
62. Q10: What is the difference between a unit test and an E2E test?
63. A) They are the same
64. B) Unit tests isolate functions/components; E2E tests drive a real browser against the running app (*)
65. C) Unit tests are slower
66. D) E2E tests do not use browsers
67. Explanation: Unit tests exercise isolated functions or components with mocks; E2E tests (Playwright) drive a real browser against a running Next.js app to verify full user flows.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which runner is recommended for unit tests in modern Next.js projects?
  options:
    - Vitest
    - Jest
    - Mocha
    - Jasmine
  correctIndex: 0
  explanation: Vitest has native ESM, faster startup via Vite, and a Jest-compatible API — a better fit for modern Next.js codebases than Jest, which requires more config.
- id: q2
  question: Why is testing a server component with React Testing Library hard?
  options:
    - Server components cannot be tested
    - They require async rendering and a request context; extract logic into pure functions or use E2E
    - RTL does not support TypeScript
    - Server components are private
  correctIndex: 1
  explanation: Server components are async and depend on a request context (cookies, headers); RTL is designed for synchronous client rendering. Extract pure logic to test, or use Playwright E2E.
- id: q3
  question: Why mock `next/navigation` in component tests?
  options:
    - It is too slow
    - It triggers network requests
    - Hooks like useRouter() require a router context; without a mock they throw
    - It is required by Vitest
  correctIndex: 2
  explanation: "`useRouter`, `usePathname`, and `useSearchParams` need a router context that does not exist in unit tests; mocking them provides safe stubs."
- id: q4
  question: Which Playwright config runs the app for E2E in CI?
  options:
    - testDir
    - baseURL only
    - projects
    - 'webServer with command: "npm run build && npm run start"'
  correctIndex: 3
  explanation: "`webServer` starts your app (`next build && next start`) and waits for `url` to respond before running tests, ensuring a production-like environment."
- id: q5
  question: Why run Playwright against `next start` (not `next dev`) in CI?
  options:
    - Dev mode is slower, less stable, and includes hot-reload code that production does not
    - Dev mode is faster
    - Dev mode does not support testing
    - Start mode is free
  correctIndex: 0
  explanation: Dev mode includes Fast Refresh, on-demand compilation, and dev-only warnings — all unsuitable for E2E. `next build && next start` matches production behavior.
- id: q6
  question: How do you prevent fetch mocks from leaking between tests?
  options:
    - Use jest.restoreAllMocks()
    - Call vi.restoreAllMocks() in afterEach
    - Restart the test runner
    - You cannot
  correctIndex: 1
  explanation: Vitest's `vi.restoreAllMocks()` in `afterEach` resets all mocks so one test's `global.fetch = vi.fn()` does not affect subsequent tests.
- id: q7
  question: Which library is the standard for rendering React components in tests?
  options:
    - Enzyme
    - React Test Renderer
    - React Testing Library
    - Sinon
  correctIndex: 2
  explanation: React Testing Library is the standard for component tests; it renders components into a real DOM and asserts on accessible, user-visible output rather than internals.
- id: q8
  question: What is a typical coverage target for a Next.js app?
  options:
    - 100% on every file
    - 50%
    - Coverage does not matter
    - ≥80% line coverage on core modules, excluding config and layout files
  correctIndex: 3
  explanation: A common target is ≥80% line coverage on core modules; exclude `*.config.*`, `app/layout.tsx`, and `__tests__` files so boilerplate does not drag down the number.
- id: q9
  question: Which Playwright feature records a trace for debugging failed tests?
  options:
    - 'trace: "on-first-retry"'
    - "video: true only"
    - "screenshot: true only"
    - "debug: true"
  correctIndex: 0
  explanation: '`trace: "on-first-retry"` records a full trace (DOM snapshots, network, console) on the first retry, viewable in `npx playwright show-trace`.'
- id: q10
  question: What is the difference between a unit test and an E2E test?
  options:
    - They are the same
    - Unit tests isolate functions/components; E2E tests drive a real browser against the running app
    - Unit tests are slower
    - E2E tests do not use browsers
  correctIndex: 1
  explanation: Unit tests exercise isolated functions or components with mocks; E2E tests (Playwright) drive a real browser against a running Next.js app to verify full user flows.
```

