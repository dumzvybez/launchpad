---
slug: react-testing-react-testing-library-vitest-playwright
id: react-18
track: react
order: 18
title: Testing — React Testing Library, Vitest, Playwright
description: Write fast unit/component tests with Vitest + React Testing Library, and end-to-end tests with Playwright — including async, mocks, and accessibility-first queries.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=1020s
whyItMatters: Write fast unit/component tests with Vitest + React Testing Library, and end-to-end tests with Playwright — including async, mocks, and accessibility-first queries.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Testing — React Testing Library, Vitest, Playwright

## Testing — React Testing Library, Vitest, Playwright

### Why It Matters

Write fast unit/component tests with Vitest + React Testing Library, and end-to-end tests with Playwright — including async, mocks, and accessibility-first queries.

Write fast unit/component tests with Vitest + React Testing Library, and end-to-end tests with Playwright — including async, mocks, and accessibility-first queries.

### Prerequisites

- Stage 17: Styling.
- Stage 9: Custom Hooks (for `renderHook`).
- Basic test-runner concepts (describe, it, expect).

### Topics

- Vitest setup with jsdom environment
- React Testing Library: `render`, `screen`, `fireEvent`/`userEvent`
- Queries: `getByRole`, `getByLabelText`, `getByText`, `findBy*`
- `userEvent` vs `fireEvent` — prefer `userEvent`
- Testing async: `waitFor`, `findBy`
- Mocking modules with `vi.mock`
- Testing custom hooks with `renderHook` and `act`
- Playwright E2E: page, locator, async/await, fixtures

### Key Concepts

- RTL tests the rendered DOM, not component internals — favor user-facing queries
- Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- `userEvent` simulates real user interactions (focus, key events) more accurately than `fireEvent`
- `findBy*` queries auto-await (great for async); `getBy*` is synchronous and throws if not found
- Playwright tests the full app in a real browser, catching integration and CSS bugs unit tests miss

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("increments on click", async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} />);
    const button = screen.getByRole("button", { name: /increment/i });
    await user.click(button);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```
Caption: Vitest + RTL component test

### Common Pitfalls

- Using `getByTestId` everywhere — bypasses accessibility and makes tests brittle; prefer `getByRole`/`getByLabelText`.
- Forgetting to await async assertions — use `findBy*` (auto-await) or wrap in `waitFor`; synchronous `getBy*` throws on missing elements.
- Testing implementation details (state shape, internal methods) — tests break on refactor; test behavior the user sees.
- Calling state updaters outside `act()` in hook tests — React warns; wrap updates in `act(() => ...)`.
- Mocking too much in E2E — Playwright tests the real app; over-mocking defeats their purpose and hides integration bugs.

### Real-World Applications

- Meta's React tests rely heavily on React Testing Library for component behavior tests across Facebook and Instagram web.
- Vercel runs Playwright E2E on every PR against preview deployments to catch regressions before merge.
- Stripe's dashboard tests use RTL for component behavior and Playwright for end-to-end payment flows.
- Linear runs Vitest unit tests + Playwright E2E on every commit, with a parallelized CI matrix.

### Interview Questions

- 1. Why prefer `getByRole` over `getByTestId`? — `getByRole` mirrors how users (and screen readers) find elements, so it implicitly tests accessibility; `getByTestId` only tests your `data-testid` strings.
- 2. `userEvent` vs `fireEvent`? — `userEvent` simulates real user interactions (focus, key events, clipboard) more accurately; `fireEvent` is a lower-level synthetic dispatch.
- 3. `findBy*` vs `getBy*`? — `findBy*` is async and auto-waits (for elements appearing after async work); `getBy*` is synchronous and throws immediately if not found.
- 4. Why wrap hook state updates in `act()`? — React batches and flushes updates synchronously inside `act`; without it, React warns about state updates outside tests.
- 5. What's the role of Playwright vs RTL? — RTL tests component behavior in isolation; Playwright tests the full app in a real browser, catching integration, routing, and styling bugs.

### Mini Project

Build a "Test Suite for a Todo App": Write Vitest + RTL tests covering add, toggle, delete, and filter behaviors, plus a Playwright E2E covering the full add-toggle-clear flow. Use `userEvent`, `findBy*` for async, and mock the API with `vi.mock`. Suggested approach:
  - Mock `api.fetchTodos` to return a fixed list
  - Test adding a todo via `userEvent.type` + `userEvent.click`
  - Test toggle updates the UI and calls the mocked API
  - Test the filter dropdown shows/hides completed
  - Add a Playwright E2E that runs against the dev server

### Exercises

1. Write a Vitest + RTL test using only `getByRole` queries.
2. Replace `fireEvent` with `userEvent` and observe the difference.
3. Test an async component using `findByText` after mocking fetch.
4. Test a custom hook with `renderHook` + `act`.
5. Write a Playwright E2E that fills a form and asserts a success toast.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which RTL query is preferred for accessibility?
9. A) `getByTestId`
10. B) `getByRole` (*)
11. C) `getByClassName`
12. D) `getById`
13. Explanation: `getByRole` mirrors how users and screen readers find elements, implicitly testing accessibility; `getByTestId` bypasses it and tests your test-id strings instead.
14. Q2: Why prefer `userEvent` over `fireEvent`?
15. A) It's faster
16. B) It's a newer API
17. C) It simulates real user interactions (focus, keys, clipboard) more accurately (*)
18. D) It supports TypeScript
19. Explanation: `userEvent` simulates the full interaction including focus, key events, and selection — closer to a real user; `fireEvent` is a lower-level synthetic dispatch.
20. Q3: What's the difference between `findBy*` and `getBy*`?
21. A) `findBy*` is for forms
22. B) `getBy*` is async
23. C) They are identical
24. D) `findBy*` is async and auto-waits; `getBy*` is sync and throws if not found (*)
25. Explanation: `findBy*` returns a Promise that resolves when the element appears (great for async UI); `getBy*` is synchronous and throws immediately if the element is missing.
26. Q4: Why wrap state updates in `act()` in hook tests?
27. A) To flush updates synchronously and avoid React warnings (*)
28. B) For performance
29. C) It's required by TypeScript
30. D) To skip rendering
31. Explanation: `act()` ensures state updates and effects are flushed before assertions; without it React warns "An update to X inside a test was not wrapped in act(...)".
32. Q5: Which is the recommended query priority order?
33. A) `getByTestId` > `getByText` > `getByRole`
34. B) `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (*)
35. C) `getByClassName` > `getByText`
36. D) `getById` > anything
37. Explanation: RTL recommends `getByRole` first (accessibility), then `getByLabelText` (forms), then `getByText` (visible content), reserving `getByTestId` for last resort.
38. Q6: Why avoid testing implementation details?
39. A) They're slower
40. B) They can't be mocked
41. C) Tests break on refactor even when behavior is unchanged (*)
42. D) They require TypeScript
43. Explanation: Testing internal state, methods, or component names couples tests to implementation; refactor for clarity breaks tests that should still pass. Test what the user sees.
44. Q7: What's the role of Playwright vs React Testing Library?
45. A) They're identical
46. B) Playwright is for unit tests
47. C) RTL is for E2E
48. D) RTL tests components in isolation; Playwright tests the full app in a real browser (*)
49. Explanation: RTL mounts components in jsdom; Playwright drives a real browser against your running app, catching integration, routing, CSS, and network bugs unit tests miss.
50. Q8: How do you mock a module in Vitest?
51. A) `vi.mock(path, factory)` (*)
52. B) `jest.mock(...)`
53. C) `mockModule(...)`
54. D) You can't
55. Explanation: `vi.mock("../api", () => ({ fetchUser: vi.fn()... }))` replaces the module with the factory's return; restores happen automatically per test by default.
56. Q9: Which is a sign you're over-mocking in E2E?
57. A) Using `page.goto`
58. B) Mocking the network layer entirely (*)
59. C) Asserting on visible text
60. D) Using `getByRole`
61. Explanation: E2E tests exist to exercise the real system; mocking everything defeats that purpose. Mock only third-party services or unstable external dependencies.
62. Q10: Which Vitest environment is needed for DOM/React tests?
63. A) `node`
64. B) `browser`
65. C) `jsdom` (or `happy-dom`) (*)
66. D) `edge`
67. Explanation: Vitest defaults to Node; for React/DOM tests set `environment: "jsdom"` (or `happy-dom`) in the config to provide `document`, `window`, etc.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which RTL query is preferred for accessibility?
  options:
    - "`getByTestId`"
    - "`getByRole`"
    - "`getByClassName`"
    - "`getById`"
  correctIndex: 1
  explanation: "`getByRole` mirrors how users and screen readers find elements, implicitly testing accessibility; `getByTestId` bypasses it and tests your test-id strings instead."
- id: q2
  question: Why prefer `userEvent` over `fireEvent`?
  options:
    - It's faster
    - It's a newer API
    - It simulates real user interactions (focus, keys, clipboard) more accurately
    - It supports TypeScript
  correctIndex: 2
  explanation: "`userEvent` simulates the full interaction including focus, key events, and selection — closer to a real user; `fireEvent` is a lower-level synthetic dispatch."
- id: q3
  question: What's the difference between `findBy*` and `getBy*`?
  options:
    - "`findBy*` is for forms"
    - "`getBy*` is async"
    - They are identical
    - "`findBy*` is async and auto-waits; `getBy*` is sync and throws if not found"
    - ; `getBy*` is synchronous and throws immediately if the element is missing.
  correctIndex: 3
  explanation: "`findBy*` returns a Promise that resolves when the element appears (great for async UI); `getBy*` is synchronous and throws immediately if the element is missing."
- id: q4
  question: Why wrap state updates in `act()` in hook tests?
  options:
    - To flush updates synchronously and avoid React warnings
    - For performance
    - It's required by TypeScript
    - To skip rendering
  correctIndex: 0
  explanation: '`act()` ensures state updates and effects are flushed before assertions; without it React warns "An update to X inside a test was not wrapped in act(...)".'
- id: q5
  question: Which is the recommended query priority order?
  options:
    - "`getByTestId` > `getByText` > `getByRole`"
    - "`getByRole` > `getByLabelText` > `getByText` > `getByTestId`"
    - "`getByClassName` > `getByText`"
    - "`getById` > anything"
  correctIndex: 1
  explanation: RTL recommends `getByRole` first (accessibility), then `getByLabelText` (forms), then `getByText` (visible content), reserving `getByTestId` for last resort.
- id: q6
  question: Why avoid testing implementation details?
  options:
    - They're slower
    - They can't be mocked
    - Tests break on refactor even when behavior is unchanged
    - They require TypeScript
  correctIndex: 2
  explanation: Testing internal state, methods, or component names couples tests to implementation; refactor for clarity breaks tests that should still pass. Test what the user sees.
- id: q7
  question: What's the role of Playwright vs React Testing Library?
  options:
    - They're identical
    - Playwright is for unit tests
    - RTL is for E2E
    - RTL tests components in isolation; Playwright tests the full app in a real browser
  correctIndex: 3
  explanation: RTL mounts components in jsdom; Playwright drives a real browser against your running app, catching integration, routing, CSS, and network bugs unit tests miss.
- id: q8
  question: How do you mock a module in Vitest?
  options:
    - "`vi.mock(path, factory)`"
    - "`jest.mock(...)`"
    - "`mockModule(...)`"
    - You can't
  correctIndex: 0
  explanation: "`vi.mock(\"../api\", () => ({ fetchUser: vi.fn()... }))` replaces the module with the factory's return; restores happen automatically per test by default."
- id: q9
  question: Which is a sign you're over-mocking in E2E?
  options:
    - Using `page.goto`
    - Mocking the network layer entirely
    - Asserting on visible text
    - Using `getByRole`
  correctIndex: 1
  explanation: E2E tests exist to exercise the real system; mocking everything defeats that purpose. Mock only third-party services or unstable external dependencies.
- id: q10
  question: Which Vitest environment is needed for DOM/React tests?
  options:
    - "`node`"
    - "`browser`"
    - "`jsdom` (or `happy-dom`)"
    - "`edge`"
  correctIndex: 2
  explanation: 'Vitest defaults to Node; for React/DOM tests set `environment: "jsdom"` (or `happy-dom`) in the config to provide `document`, `window`, etc.'
```

