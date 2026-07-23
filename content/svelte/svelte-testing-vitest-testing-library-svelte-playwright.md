---
slug: svelte-testing-vitest-testing-library-svelte-playwright
id: svelte-17
track: svelte
order: 17
title: Testing — Vitest, @testing-library/svelte, Playwright
description: Write unit, component, and E2E tests for Svelte/SvelteKit apps using Vitest, @testing-library/svelte, and Playwright — including runes-aware testing and SvelteKit context mocking.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=180s
whyItMatters: Write unit, component, and E2E tests for Svelte/SvelteKit apps using Vitest, @testing-library/svelte, and Playwright — including runes-aware testing and SvelteKit context mocking.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Testing — Vitest, @testing-library/svelte, Playwright

## Testing — Vitest, @testing-library/svelte, Playwright

### Why It Matters

Write unit, component, and E2E tests for Svelte/SvelteKit apps using Vitest, @testing-library/svelte, and Playwright — including runes-aware testing and SvelteKit context mocking.

Write unit, component, and E2E tests for Svelte/SvelteKit apps using Vitest, @testing-library/svelte, and Playwright — including runes-aware testing and SvelteKit context mocking.

### Prerequisites

- Stage 3: Components and Props
- Stage 13: SvelteKit — Routing
- Basic familiarity with any test framework.

### Topics

- Vitest config for Svelte (vite.config.ts + svelte plugin)
- Component tests with @testing-library/svelte
- render() + queries (getByRole, findByText)
- userEvent for realistic interactions
- Mocking SvelteKit context (getContext, page, navigation)
- Testing runes: $state, $derived, $effect
- Snapshot tests
- Playwright for E2E in SvelteKit

### Key Concepts

- @testing-library/svelte renders components into jsdom; queries target accessible roles
- Vitest runs alongside Vite for fast HMR-style test re-runs
- SvelteKit context and stores ($app/stores) need to be mocked or set up in test setup
- findBy* queries are async (await re-render); getBy* is sync (throws if not present)
- Playwright launches the dev server and drives a real browser for E2E

```ts
// vite.config.ts
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: { provider: "v8", reporter: ["text", "html"] }
  }
});
```
Caption: Vitest config

### Common Pitfalls

- Using getBy* for async state — use findBy* (await) when the assertion depends on re-render after a state change.
- Forgetting userEvent.setup() — calling userEvent.click directly without setup is deprecated; create a user instance.
- Not mocking $app/stores in component tests — $page, $navigating etc. are undefined in jsdom; provide via a setup file or context.
- Snapshot-testing volatile output (dates, IDs) — snapshots break on every run; mask volatile fields before snapshotting.
- Running Playwright against `npm run dev` — use a preview build (`npm run build && npm run preview`) for stable, production-like E2E.

### Real-World Applications

- The New York Times' interactive graphics team uses Vitest + RTL to test chart components with synthetic data.
- Apple Music's web player team runs Playwright suites on every PR across Chrome, Safari, and Firefox.
- Rakuten's checkout flow has a Playwright E2E that runs the full purchase path against a staging API.
- Chess.com uses Vitest for move-generation logic and Playwright for full-game UI tests.

### Interview Questions

- 1. Which library renders Svelte components in Vitest? — @testing-library/svelte's render() mounts a component into jsdom and returns queries.
- 2. What's the difference between getBy* and findBy*? — getBy is sync (throws if not found); findBy is async (retries, used after state updates).
- 3. How do you simulate a realistic click? — `const user = userEvent.setup(); await user.click(element)` — preferred over fireEvent for real browser behavior.
- 4. How do you test components that read $page? — Mock via a setup file using vi.mock("$app/stores") or set up a SvelteKit context wrapper.
- 5. Why use Playwright over Cypress? — Playwright supports all Chromium, Firefox, and WebKit engines, parallelizes by default, and integrates well with SvelteKit's preview server.

### Mini Project

Build a Test Suite for a Todo Component: Component tests for a TodoList.svelte using RTL + userEvent (add, toggle, delete); a snapshot test for empty state; and a Playwright E2E for adding a todo across a page reload. Suggested approach:
  - Configure vite.config.ts with svelte plugin + jsdom
  - Write TodoList.test.ts: render, type into input, click Add, assert list item appears
  - Add a toggle test that clicks the checkbox and asserts done style
  - Add a snapshot test for empty list with a "No items" message
  - Write Playwright spec that adds an item, reloads, and verifies it persists (if app stores to localStorage)

### Exercises

1. Configure Vitest with @sveltejs/vite-plugin-svelte and jsdom.
2. Write a component test that renders a Counter and asserts increment works.
3. Use userEvent to type into an input and submit a form.
4. Mock $app/stores page in a test setup file.
5. Write a Playwright spec that visits "/" and asserts an <h1> is visible.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which library renders Svelte components in Vitest?
9. A) @testing-library/svelte (*)
10. B) @testing-library/react
11. C) svelte-testing
12. D) vitest-svelte
13. Explanation: @testing-library/svelte exports render() which mounts a Svelte component into jsdom and returns queries.
14. Q2: Which query is async (retries after state changes)?
15. A) getByText
16. B) findByText (*)
17. C) queryByText
18. D) getAllBy
19. Explanation: findBy* queries are async (await-able) and retry until found or timeout; getBy* is sync and throws if not immediately present.
20. Q3: How do you simulate a realistic click?
21. A) element.click()
22. B) fireEvent.click(element)
23. C) const user = userEvent.setup(); await user.click(element) (*)
24. D) dispatchEvent
25. Explanation: userEvent simulates real browser behavior (focus, hover, pointer events); always create a user instance with userEvent.setup().
26. Q4: Which test environment does Svelte component testing typically use?
27. A) node
28. B) happy-dom
29. C) edge
30. D) jsdom (*)
31. Explanation: Vitest with `environment: "jsdom"` provides a DOM in Node; happy-dom is an alternative but jsdom is the standard for component tests.
32. Q5: How do you mock $app/stores in tests?
33. A) vi.mock("$app/stores", ...) in a setup file (*)
34. B) You can't
35. C) Skip the test
36. D) Use the real stores
37. Explanation: $app/stores is SvelteKit-specific and undefined in jsdom; mock it via vi.mock in a setup file or per-test to provide $page, $navigating, etc.
38. Q6: Which framework is preferred for SvelteKit E2E?
39. A) Cypress
40. B) Playwright (*)
41. C) Selenium
42. D) Puppeteer
43. Explanation: Playwright supports Chromium, Firefox, and WebKit, parallelizes by default, and integrates cleanly with SvelteKit's preview server.
44. Q7: Why run Playwright against `npm run preview` instead of `npm run dev`?
45. A) Dev is too slow
46. B) Dev doesn't support E2E
47. C) Preview is production-like (built assets) and stable (*)
48. D) You can't
49. Explanation: `vite preview` serves the production build, surfacing real issues with bundling, hydration, and SSR that dev mode hides.
50. Q8: What does render(Component, { props }) return?
51. A) The component instance
52. B) A promise
53. C) Nothing
54. D) An object with queries (getByRole, etc.) and a container (*)
55. Explanation: render() returns an object with the DOM container and bound queries; props pass initial values to the component.
56. Q9: Why avoid snapshot tests for volatile content (dates, IDs)?
57. A) They break on every run, masking real regressions (*)
58. B) Snapshots are deprecated
59. C) They're slow
60. D) They require a database
61. Explanation: Volatile fields change every run, breaking snapshots constantly; either mask them (e.g., replace IDs with a fixed token) or test behavior instead.
62. Q10: What's the recommended coverage provider for Vitest?
63. A) istanbul
64. B) v8 (*)
65. C) codecov
66. D) nyc
67. Explanation: Vitest supports v8 and istanbul coverage providers; v8 is faster and recommended. Configure via `test.coverage.provider: "v8"`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which library renders Svelte components in Vitest?
  options:
    - "@testing-library/svelte"
    - "@testing-library/react"
    - svelte-testing
    - vitest-svelte
  correctIndex: 0
  explanation: "@testing-library/svelte exports render() which mounts a Svelte component into jsdom and returns queries."
- id: q2
  question: Which query is async (retries after state changes)?
  options:
    - getByText
    - findByText
    - queryByText
    - getAllBy
  correctIndex: 1
  explanation: findBy* queries are async (await-able) and retry until found or timeout; getBy* is sync and throws if not immediately present.
- id: q3
  question: How do you simulate a realistic click?
  options:
    - element.click()
    - fireEvent.click(element)
    - const user = userEvent.setup(); await user.click(element)
    - dispatchEvent
  correctIndex: 2
  explanation: userEvent simulates real browser behavior (focus, hover, pointer events); always create a user instance with userEvent.setup().
- id: q4
  question: Which test environment does Svelte component testing typically use?
  options:
    - node
    - happy-dom
    - edge
    - jsdom
  correctIndex: 3
  explanation: 'Vitest with `environment: "jsdom"` provides a DOM in Node; happy-dom is an alternative but jsdom is the standard for component tests.'
- id: q5
  question: How do you mock $app/stores in tests?
  options:
    - vi.mock("$app/stores", ...) in a setup file
    - You can't
    - Skip the test
    - Use the real stores
  correctIndex: 0
  explanation: $app/stores is SvelteKit-specific and undefined in jsdom; mock it via vi.mock in a setup file or per-test to provide $page, $navigating, etc.
- id: q6
  question: Which framework is preferred for SvelteKit E2E?
  options:
    - Cypress
    - Playwright
    - Selenium
    - Puppeteer
  correctIndex: 1
  explanation: Playwright supports Chromium, Firefox, and WebKit, parallelizes by default, and integrates cleanly with SvelteKit's preview server.
- id: q7
  question: Why run Playwright against `npm run preview` instead of `npm run dev`?
  options:
    - Dev is too slow
    - Dev doesn't support E2E
    - Preview is production-like (built assets) and stable
    - You can't
  correctIndex: 2
  explanation: "`vite preview` serves the production build, surfacing real issues with bundling, hydration, and SSR that dev mode hides."
- id: q8
  question: What does render(Component, { props }) return?
  options:
    - The component instance
    - A promise
    - Nothing
    - An object with queries (getByRole, etc.) and a container
  correctIndex: 3
  explanation: render() returns an object with the DOM container and bound queries; props pass initial values to the component.
- id: q9
  question: Why avoid snapshot tests for volatile content (dates, IDs)?
  options:
    - They break on every run, masking real regressions
    - Snapshots are deprecated
    - They're slow
    - They require a database
  correctIndex: 0
  explanation: Volatile fields change every run, breaking snapshots constantly; either mask them (e.g., replace IDs with a fixed token) or test behavior instead.
- id: q10
  question: What's the recommended coverage provider for Vitest?
  options:
    - istanbul
    - v8
    - codecov
    - nyc
  correctIndex: 1
  explanation: 'Vitest supports v8 and istanbul coverage providers; v8 is faster and recommended. Configure via `test.coverage.provider: "v8"`.'
```

