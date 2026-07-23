---
slug: javascript-testing-jest-vitest-tdd-basics
id: javascript-14
track: javascript
order: 14
title: Testing — Jest, Vitest, and TDD Basics
description: Write automated tests with Jest or Vitest, follow the red-green-refactor TDD loop, and measure coverage.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=11200s
whyItMatters: Write automated tests with Jest or Vitest, follow the red-green-refactor TDD loop, and measure coverage.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Testing — Jest, Vitest, and TDD Basics

## Testing — Jest, Vitest, and TDD Basics

### Why It Matters

Write automated tests with Jest or Vitest, follow the red-green-refactor TDD loop, and measure coverage.

Write automated tests with Jest or Vitest, follow the red-green-refactor TDD loop, and measure coverage.

### Prerequisites

- Stage 13: Error Handling and Debugging
- Comfort with modules (Stage 10) and async (Stage 8).

### Topics

- Anatomy of a test: describe, it, expect
- Matchers: toBe, toEqual, toThrow, toBeCloseTo, toContain
- Setup/teardown: beforeEach, afterEach, beforeAll, afterAll
- Mocks, spies, and stubs (jest.fn, vi.fn, vi.mock)
- Async testing: async/await, resolves/rejects
- TDD: red, green, refactor
- Coverage: lines, branches, functions
- Testing in the browser with Playwright or Cypress

### Key Concepts

- TDD is a design activity: write a failing test, write the minimum code to pass, refactor
- `toBe` is `===`; `toEqual` does deep equality — use toEqual for objects/arrays
- Mocks replace dependencies; spies wrap real functions to assert calls
- Tests should be deterministic — no real timers, no real network; use fake timers and mocks
- Coverage is a lower bound, not a target — 100% coverage doesn't mean 100% tested
- A test name should read like a sentence: "throws when the email is missing"

```javascript
import { describe, it, expect } from "vitest";
import { add, slugify, divide } from "./math.js";

describe("add", () => {
  it("returns the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
  it("handles negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });
});

describe("slugify", () => {
  it("lowercases and joins with dashes", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
});

describe("divide", () => {
  it("throws on divide-by-zero", () => {
    expect(() => divide(1, 0)).toThrow(/zero/);
  });
});
```
Caption: Basic test with Vitest

### Common Pitfalls

- Using `toBe` for objects — `toBe` is `===` reference equality; use `toEqual` for deep equality.
- Tests that depend on execution order — shared state leaks; use `beforeEach` to reset, or pure functions.
- Mocking too much — mocks that fake everything don't test the real system; mock only at boundaries (network, clock).
- Forgetting to await async tests — passes silently; the assertion runs after the test reports success.
- Chasing 100% coverage — coverage measures lines run, not behavior tested; 80% with good edge cases beats 100% trivial.

### Real-World Applications

- Meta's React codebase has tens of thousands of Jest tests; every PR runs them in sharded CI before merge.
- Vite and Vitest are used by Vue, Svelte, and Astro core teams for fast, ESM-native testing.
- Playwright (Microsoft) runs cross-browser E2E tests for Microsoft Teams, GitHub, and the Adobe Creative Cloud web apps.
- Stripe's JavaScript SDK has a comprehensive test suite with recorded HTTP fixtures so unit tests never hit the real API.

### Interview Questions

- 1. Difference between `toBe` and `toEqual`? — toBe is `===` (reference equality); toEqual does deep structural equality for objects/arrays.
- 2. What is a mock vs a spy? — A mock replaces a function entirely; a spy wraps the original so you can assert calls while preserving behavior.
- 3. Explain the TDD loop. — Red (write a failing test), Green (minimum code to pass), Refactor (improve code, tests stay green).
- 4. Why use fake timers? — Determinism and speed; real setTimeout makes tests slow and flaky; vi.useFakeTimers lets you advance time manually.
- 5. What does coverage measure? — Which lines/branches/functions were executed during tests; it's necessary but not sufficient for good testing.

### Mini Project

Build a small `format` library (currency, date, file-size) using strict TDD: write the test first, watch it fail, write the code, refactor. The library exports three pure functions. Suggested approach:
  - Set up Vitest: `npm i -D vitest` and add `"test": "vitest"` script
  - Write tests for `formatCurrency(amount, currency)`, `formatDate(date, locale)`, `formatBytes(n)`
  - For each: write the failing test, then implement, then refactor
  - Add edge-case tests: 0, negative, NaN, Intl defaults
  - Run `vitest run --coverage` and aim for 90%+ on the library

### Exercises

1. Write a failing test, watch it fail (RED), then implement to make it pass (GREEN).
2. Mock a fetch call so a test doesn't hit the network; assert it was called with the right URL.
3. Use `vi.useFakeTimers()` and `vi.advanceTimersByTime(1000)` to test a debounce.
4. Refactor a 100-line function into 3 smaller ones without breaking existing tests.
5. Add a coverage threshold to vitest config: fail if below 80% branches.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `toBe` checks:
9. A) Deep equality
10. B) Reference equality (===) (*)
11. C) Type only
12. D) String equality
13. Explanation: toBe uses ===; for objects/arrays, use toEqual which does deep structural comparison.
14. Q2: `toEqual` is used for:
15. A) Reference equality
16. B) Deep structural equality of objects and arrays (*)
17. C) Type checking
18. D) String compare
19. Explanation: toEqual recursively compares values, ignoring undefined properties; perfect for objects.
20. Q3: The TDD loop is:
21. A) Plan, Code, Test
22. B) Red, Green, Refactor (*)
23. C) Test, Deploy, Monitor
24. D) Mock, Run, Fix
25. Explanation: Write a failing test (red), make it pass minimally (green), then improve the code (refactor).
26. Q4: A mock:
27. A) Wraps the original
28. B) Replaces a function/module entirely (*)
29. C) Always calls the real function
30. D) Is the same as a spy
31. Explanation: Mocks replace; spies wrap. Mock at boundaries (network, clock) and avoid mocking what you own.
32. Q5: To test that a function throws:
33. A) expect(fn()).toThrow()
34. B) expect(() => fn()).toThrow() (*)
35. C) try { fn() } catch {}
36. D) expect(fn).toThrow()
37. Explanation: Pass a callback so the matcher can catch the throw; calling fn() directly would propagate the error.
38. Q6: To await an async test:
39. A) Mark `it` as async and await inside (*)
40. B) Use setTimeout
41. C) Return a Promise only
42. D) You can't
43. Explanation: `it("...", async () => { await ... })` — the test runner awaits the returned promise.
44. Q7: `beforeEach` runs:
45. A) Once per test file
46. B) Before every test in its describe block (*)
47. C) Only before the first test
48. D) After every test
49. Explanation: beforeEach runs before each test — perfect for resetting state, mocks, or fixtures.
50. Q8: `toBeCloseTo(33.33, 2)` is used for:
51. A) String match
52. B) Floating-point comparison with precision (*)
53. C) Date comparison
54. D) Deep equality
55. Explanation: Avoids IEEE-754 surprises; checks the value is within 0.005 of expected (2 decimal precision).
56. Q9: 100% coverage means:
57. A) All bugs are caught
58. B) All lines ran during tests — not all behaviors tested (*)
59. C) The code is bug-free
60. D) Tests are unnecessary
61. Explanation: Coverage is a lower bound; high coverage with weak assertions still misses bugs.
62. Q10: Why use fake timers in tests?
63. A) To slow tests down
64. B) Determinism and speed — control time explicitly (*)
65. C) To replace Date.now only
66. D) They're required by Jest
67. Explanation: Fake timers let you advance time instantly (vi.advanceTimersByTime), making debounce/timeout tests fast and deterministic.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`toBe` checks:"
  options:
    - Deep equality
    - Reference equality (===)
    - Type only
    - String equality
  correctIndex: 1
  explanation: toBe uses ===; for objects/arrays, use toEqual which does deep structural comparison.
- id: q2
  question: "`toEqual` is used for:"
  options:
    - Reference equality
    - Deep structural equality of objects and arrays
    - Type checking
    - String compare
  correctIndex: 1
  explanation: toEqual recursively compares values, ignoring undefined properties; perfect for objects.
- id: q3
  question: "The TDD loop is:"
  options:
    - Plan, Code, Test
    - Red, Green, Refactor
    - Test, Deploy, Monitor
    - Mock, Run, Fix
  correctIndex: 1
  explanation: Write a failing test (red), make it pass minimally (green), then improve the code (refactor).
- id: q4
  question: "A mock:"
  options:
    - Wraps the original
    - Replaces a function/module entirely
    - Always calls the real function
    - Is the same as a spy
  correctIndex: 1
  explanation: Mocks replace; spies wrap. Mock at boundaries (network, clock) and avoid mocking what you own.
- id: q5
  question: "To test that a function throws:"
  options:
    - expect(fn()).toThrow()
    - expect(() => fn()).toThrow()
    - try { fn() } catch {}
    - expect(fn).toThrow()
  correctIndex: 1
  explanation: Pass a callback so the matcher can catch the throw; calling fn() directly would propagate the error.
- id: q6
  question: "To await an async test:"
  options:
    - Mark `it` as async and await inside
    - Use setTimeout
    - Return a Promise only
    - You can't
  correctIndex: 0
  explanation: '`it("...", async () => { await ... })` — the test runner awaits the returned promise.'
- id: q7
  question: "`beforeEach` runs:"
  options:
    - Once per test file
    - Before every test in its describe block
    - Only before the first test
    - After every test
  correctIndex: 1
  explanation: beforeEach runs before each test — perfect for resetting state, mocks, or fixtures.
- id: q8
  question: "`toBeCloseTo(33.33, 2)` is used for:"
  options:
    - String match
    - Floating-point comparison with precision
    - Date comparison
    - Deep equality
  correctIndex: 1
  explanation: Avoids IEEE-754 surprises; checks the value is within 0.005 of expected (2 decimal precision).
- id: q9
  question: "100% coverage means:"
  options:
    - All bugs are caught
    - All lines ran during tests — not all behaviors tested
    - The code is bug-free
    - Tests are unnecessary
  correctIndex: 1
  explanation: Coverage is a lower bound; high coverage with weak assertions still misses bugs.
- id: q10
  question: Why use fake timers in tests?
  options:
    - To slow tests down
    - Determinism and speed — control time explicitly
    - To replace Date.now only
    - They're required by Jest
  correctIndex: 1
  explanation: Fake timers let you advance time instantly (vi.advanceTimersByTime), making debounce/timeout tests fast and deterministic.
```

