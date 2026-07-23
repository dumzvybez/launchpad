---
slug: nodejs-testing-node-test-vitest-jest-playwright
id: nodejs-18
track: nodejs
order: 18
title: Testing — Node:test, Vitest, Jest, Playwright
description: Test Node apps with the built-in `node:test`, run unit tests with Vitest or Jest, integration-test HTTP APIs with supertest, and drive real browsers with Playwright.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=420s
whyItMatters: Test Node apps with the built-in `node:test`, run unit tests with Vitest or Jest, integration-test HTTP APIs with supertest, and drive real browsers with Playwright.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Testing — Node:test, Vitest, Jest, Playwright

## Testing — Node:test, Vitest, Jest, Playwright

### Why It Matters

Test Node apps with the built-in `node:test`, run unit tests with Vitest or Jest, integration-test HTTP APIs with supertest, and drive real browsers with Playwright.

Test Node apps with the built-in `node:test`, run unit tests with Vitest or Jest, integration-test HTTP APIs with supertest, and drive real browsers with Playwright.

### Prerequisites

- Stage 11: npm and package.json (test scripts).
- Stage 12: async/await (tests are async).
- Stage 16: Express and Fastify (testing HTTP APIs).

### Topics

- `node:test` built-in module: `describe`, `it`/`test`, `assert`, hooks
- Vitest (Vite-powered, Jest-compatible, ESM-native, fast)
- Jest (snapshot, mock, `jest.fn`, `jest.mock`)
- `supertest` for HTTP integration tests against Express/Fastify apps
- Playwright for E2E browser tests
- Coverage via `node --test --experimental-test-coverage` or `c8`
- Mocking: replace dependencies, not the system under test
- Test hooks: `before`, `beforeEach`, `after`, `afterEach`

### Key Concepts

- `node:test` is built-in (no install) — perfect for small libraries and zero-config setups; Vitest is fastest for ESM projects; Jest has the biggest ecosystem.
- Mock dependencies, not the system under test — replace `fetch` or DB calls, but test the real function logic.
- Use `supertest` to mount an Express/Fastify app and fire HTTP requests without binding a port.
- Playwright runs real browsers (Chromium, Firefox, WebKit) for E2E tests; install browsers once with `npx playwright install`.
- Coverage via `c8` (V8-based, no instrumentation) or `--experimental-test-coverage` for `node:test`.

```javascript
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { add } = require("./math");

describe("add", () => {
  test("adds two numbers", () => {
    assert.equal(add(2, 3), 5);
  });

  test("rejects negative numbers", () => {
    assert.throws(() => add(-1, 1), /negative/);
  });
});

// Run: node --test
```
Caption: node:test

### Common Pitfalls

- Forgetting `await` on async assertions — the test "passes" because the assertion never runs; always `await` async test bodies.
- Over-mocking — mocking the system under test (instead of its dependencies) tests the mocks, not the code; mock only external boundaries (`fetch`, DB, FS).
- Tests depending on order — Vitest/Jest run tests in parallel by default; if test B depends on test A's side effects, they fail intermittently. Use `beforeEach` to reset state.
- Snapshot tests as golden files — brittle; small changes (whitespace, timestamp) break them. Use sparingly and review diffs carefully.
- Leaking resources between tests — unclosed DB connections, open handles, or timers keep the test runner alive; use `after` hooks to clean up and `--detect-open-handlers` to debug.

### Real-World Applications

- Node.js itself uses `node:test` for its own internal test suite (migrated from Python-based tools).
- React and React Native use Jest for unit and component tests.
- Vite and Vue use Vitest for ESM-native testing.
- Microsoft built Playwright (and uses it internally) to test Visual Studio Code for the Web and other browser products.

### Interview Questions

- 1. `node:test` vs Vitest vs Jest — which would you pick? — `node:test` for zero-config small libraries; Vitest for ESM projects and Vite-powered apps (fast, modern); Jest for the biggest ecosystem and React/Vue component tests.
- 2. What is a mock, and what should you NOT mock? — A mock replaces a dependency (e.g. `fetch`, DB) with a controlled fake; do NOT mock the system under test itself — you'd be testing the mock, not your code.
- 3. What does `supertest` do? — It mounts an Express/Fastify app in-process (without binding a port) and fires HTTP requests against it, returning a Promise of the response — perfect for integration tests.
- 4. How do you test a real browser flow? — Use Playwright (or Cypress); install browsers with `npx playwright install`, write `test("flow", async ({ page }) => { await page.goto(...); ... })`.
- 5. How do you measure test coverage? — Use `c8` (V8-based, no instrumentation) or `--experimental-test-coverage` for `node:test`; aim for ≥80% on core modules, but prioritize meaningful assertions over raw coverage.

### Mini Project

Build a Test Suite for a Mini API: Take the Express/Fastify `/users` API from Stage 16 and write a full test suite: unit tests for validation logic, integration tests with `supertest` for every endpoint, and one Playwright E2E test that loads the page and creates a user. Suggested approach:
  - Extract validation logic into `validate.js` and unit-test with `node:test`
  - Export the Express `app` (without calling `listen`) so `supertest` can mount it
  - Write integration tests for GET, POST, PATCH, DELETE covering success and error cases
  - Add a Playwright E2E test that loads `index.html`, fills the form, clicks submit, verifies the user appears
  - Configure `c8` to report coverage; target ≥80% on `users.js` and `validate.js`

### Exercises

1. Write `node:test` tests for a `math.js` module with `add`, `mul`, and `factorial`; run with `node --test`.
2. Convert the same tests to Vitest with `vi.mock` for one external dependency.
3. Use `supertest` to test an Express `/users` endpoint without binding a port.
4. Write a Playwright E2E test that logs into a sample site and verifies the dashboard.
5. Run coverage with `c8 node --test` and identify the least-covered function.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which test runner is built into Node.js?
9. A) Jest
10. B) node:test (*)
11. C) Vitest
12. D) Mocha
13. Explanation: `node:test` is the built-in test runner (Node 18+); no install needed, supports `describe`/`it`/`test` and `node:assert`.
14. Q2: Which runner is fastest for ESM and Vite-powered projects?
15. A) Jest
16. B) Mocha
17. C) Vitest (*)
18. D) Jasmine
19. Explanation: Vitest is Vite-powered, ESM-native, and Jest-compatible; it's typically the fastest for modern ESM projects because it reuses Vite's transform cache.
20. Q3: What should you NOT mock?
21. A) External dependencies (fetch, DB)
22. B) Timers
23. C) Environment variables
24. D) The system under test itself (*)
25. Explanation: Mocking the system under test means you're testing the mock, not your code. Mock only external boundaries (fetch, DB, FS) so your logic runs for real.
26. Q4: What does `supertest` do?
27. A) Mounts an Express/Fastify app in-process and fires HTTP requests (*)
28. B) Spawns a real browser
29. C) Runs load tests
30. D) Mocks fetch
31. Explanation: `supertest(app).get("/users")` mounts the app without binding a port and fires a request against it; the response is returned as a Promise — perfect for integration tests.
32. Q5: Which tool runs real browsers for E2E tests?
33. A) supertest
34. B) Playwright (*)
35. C) Jest
36. D) node:test
37. Explanation: Playwright drives real Chromium, Firefox, and WebKit browsers for end-to-end tests; install browsers once with `npx playwright install`.
38. Q6: What is a common mistake with async tests?
39. A) Using too many tests
40. B) Using `describe`
41. C) Forgetting `await` on assertions; the test passes without running them (*)
42. D) Naming tests
43. Explanation: Without `await`, the async test body resolves before the assertion runs; the test "passes" silently. Always `await` async test bodies and assertions.
44. Q7: Why should tests not depend on order?
45. A) It's slower
46. B) It's a syntax error
47. C) Order is always alphabetical anyway
48. D) Order is non-deterministic across runners (Vitest/Jest parallelize) (*)
49. Explanation: Vitest and Jest run tests in parallel by default; if test B depends on test A's side effects, it'll fail intermittently. Use `beforeEach` to reset state.
50. Q8: How do you measure coverage in Node?
51. A) `c8` or `node --test --experimental-test-coverage` (*)
52. B) `node --coverage`
53. C) `npm run cover`
54. D) You can't
55. Explanation: `c8` (V8-based, no instrumentation) is the most common; `node --test --experimental-test-coverage` works for `node:test` (still experimental in some versions).
56. Q9: Which is true about snapshot tests?
57. A) They are immune to changes
58. B) They are brittle — small changes (whitespace, timestamps) break them (*)
59. C) They replace unit tests
60. D) They are required by Jest
61. Explanation: Snapshot tests store a "golden" output; any change (even formatting) breaks them. Use sparingly and review diffs carefully — they're easy to "update" without thinking.
62. Q10: Which test hook runs before every test in a `describe` block?
63. A) before
64. B) beforeAll
65. C) beforeEach (*)
66. D) setup
67. Explanation: `beforeEach` runs before each test in the enclosing `describe` (or file); `before` runs once before all tests in the block.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which test runner is built into Node.js?
  options:
    - Jest
    - node:test
    - Vitest
    - Mocha
  correctIndex: 1
  explanation: "`node:test` is the built-in test runner (Node 18+); no install needed, supports `describe`/`it`/`test` and `node:assert`."
- id: q2
  question: Which runner is fastest for ESM and Vite-powered projects?
  options:
    - Jest
    - Mocha
    - Vitest
    - Jasmine
  correctIndex: 2
  explanation: Vitest is Vite-powered, ESM-native, and Jest-compatible; it's typically the fastest for modern ESM projects because it reuses Vite's transform cache.
- id: q3
  question: What should you NOT mock?
  options:
    - External dependencies (fetch, DB)
    - Timers
    - Environment variables
    - The system under test itself
    - so your logic runs for real.
  correctIndex: 3
  explanation: Mocking the system under test means you're testing the mock, not your code. Mock only external boundaries (fetch, DB, FS) so your logic runs for real.
- id: q4
  question: What does `supertest` do?
  options:
    - Mounts an Express/Fastify app in-process and fires HTTP requests
    - Spawns a real browser
    - Runs load tests
    - Mocks fetch
  correctIndex: 0
  explanation: '`supertest(app).get("/users")` mounts the app without binding a port and fires a request against it; the response is returned as a Promise — perfect for integration tests.'
- id: q5
  question: Which tool runs real browsers for E2E tests?
  options:
    - supertest
    - Playwright
    - Jest
    - node:test
  correctIndex: 1
  explanation: Playwright drives real Chromium, Firefox, and WebKit browsers for end-to-end tests; install browsers once with `npx playwright install`.
- id: q6
  question: What is a common mistake with async tests?
  options:
    - Using too many tests
    - Using `describe`
    - Forgetting `await` on assertions; the test passes without running them
    - Naming tests
  correctIndex: 2
  explanation: Without `await`, the async test body resolves before the assertion runs; the test "passes" silently. Always `await` async test bodies and assertions.
- id: q7
  question: Why should tests not depend on order?
  options:
    - It's slower
    - It's a syntax error
    - Order is always alphabetical anyway
    - Order is non-deterministic across runners (Vitest/Jest parallelize)
  correctIndex: 3
  explanation: Vitest and Jest run tests in parallel by default; if test B depends on test A's side effects, it'll fail intermittently. Use `beforeEach` to reset state.
- id: q8
  question: How do you measure coverage in Node?
  options:
    - "`c8` or `node --test --experimental-test-coverage`"
    - "`node --coverage`"
    - "`npm run cover`"
    - You can't
  correctIndex: 0
  explanation: "`c8` (V8-based, no instrumentation) is the most common; `node --test --experimental-test-coverage` works for `node:test` (still experimental in some versions)."
- id: q9
  question: Which is true about snapshot tests?
  options:
    - They are immune to changes
    - They are brittle — small changes (whitespace, timestamps) break them
    - They replace unit tests
    - They are required by Jest
  correctIndex: 1
  explanation: Snapshot tests store a "golden" output; any change (even formatting) breaks them. Use sparingly and review diffs carefully — they're easy to "update" without thinking.
- id: q10
  question: Which test hook runs before every test in a `describe` block?
  options:
    - before
    - beforeAll
    - beforeEach
    - setup
  correctIndex: 2
  explanation: "`beforeEach` runs before each test in the enclosing `describe` (or file); `before` runs once before all tests in the block."
```

