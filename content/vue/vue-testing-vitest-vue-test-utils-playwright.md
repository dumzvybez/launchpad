---
slug: vue-testing-vitest-vue-test-utils-playwright
id: vue-18
track: vue
order: 18
title: Testing — Vitest, Vue Test Utils, Playwright
description: Write unit tests with Vitest, component tests with Vue Test Utils, and end-to-end tests with Playwright; set coverage targets and run them in CI.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=420s
whyItMatters: Write unit tests with Vitest, component tests with Vue Test Utils, and end-to-end tests with Playwright; set coverage targets and run them in CI.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Testing — Vitest, Vue Test Utils, Playwright

## Testing — Vitest, Vue Test Utils, Playwright

### Why It Matters

Write unit tests with Vitest, component tests with Vue Test Utils, and end-to-end tests with Playwright; set coverage targets and run them in CI.

Write unit tests with Vitest, component tests with Vue Test Utils, and end-to-end tests with Playwright; set coverage targets and run them in CI.

### Prerequisites

- Stage 10: Components and Props.
- Stage 14: Composables.
- Stage 16: Pinia (for store testing).
- Basic familiarity with Jest-style assertions.

### Topics

- Vitest: a Vite-native test runner with Jest-compatible API
- Vue Test Utils (`@vue/test-utils`) for mounting components
- `mount` vs `shallowMount` and stubs
- Testing props, emits, slots, and lifecycle hooks
- Testing composables with `effectScope` and `defineComponent`
- Testing Pinia stores
- Playwright for E2E tests across Chromium/Firefox/WebKit
- Coverage targets (`c8`/`v8`) and CI integration

### Key Concepts

- Vitest runs in the same Vite pipeline as the dev server — same transforms, same aliases
- Vue Test Utils `mount` renders a component with full children; `shallowMount` stubs children for isolation
- Always assert via roles and text (`getByRole`, `getByText`) for resilience to DOM changes
- Composables that use lifecycle hooks need a component host (`defineComponent` + `setup`) or `effectScope`
- Playwright runs real browsers and exercises the full app — slowest but most realistic

```ts
// tests/unit/Counter.spec.ts
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";

describe("Counter.vue", () => {
  it("renders initial count", () => {
    const wrapper = mount(Counter, { props: { initial: 5 } });
    expect(wrapper.text()).toContain("5");
  });

  it("emits increment on button click", async () => {
    const wrapper = mount(Counter);
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("increment")).toHaveLength(1);
    expect(wrapper.emitted("increment")![0]).toEqual([1]);
  });
});
```
Caption: Component test with Vue Test Utils

### Common Pitfalls

- Forgetting `await` before `trigger("click")` or `setValue` — Vue updates the DOM asynchronously; assertions fail without awaiting the next tick.
- Testing implementation details instead of behavior — asserting `wrapper.classes()` is brittle; assert visible text or roles instead.
- Mutating global state (Pinia, localStorage) between tests without cleanup — use `beforeEach` to reset; `localStorage.clear()` in setup.
- Using `mount` when `shallowMount` would isolate the test — deeply mounted children slow tests and break isolation.
- Forgetting to register router/Pinia in the test — a component that uses `useRouter()` or `useStore()` throws unless you mount it inside a router/pinia plugin.

### Real-World Applications

- GitLab runs tens of thousands of Vitest unit tests and Vue Test Utils component tests in CI on every merge request.
- Alibaba's Element Plus has comprehensive Vitest + Playwright coverage across all components, run in parallel in CI.
- Behance's portfolio viewer is covered by Playwright E2E tests for upload, edit, and share flows.
- Adobe Portfolio runs Vitest on composables and Playwright smoke tests against every preview deployment.

### Interview Questions

- 1. Why Vitest over Jest for Vue projects? — Vitest runs in the Vite pipeline (same transforms, aliases, HMR), is faster, and has Jest-compatible API.
- 2. What's the difference between `mount` and `shallowMount`? — `mount` renders children fully; `shallowMount` stubs children for isolation and speed.
- 3. How do you test a composable that uses lifecycle hooks? — Mount a host component (`defineComponent`) whose setup calls the composable, or use `effectScope` to run the composable outside a component.
- 4. How do you test that a component emits an event? — Use `wrapper.emitted("event")` after triggering the action; assert on the args array.
- 5. Why assert via roles and text (`getByRole`, `getByText`) instead of CSS classes? — Resilience to DOM/CSS refactors; tests focus on user-visible behavior, not implementation details.

### Mini Project

Build a "TodoMVC test suite": Write Vitest unit tests for a `TodoItem.vue` component (toggle, edit, delete emits), a Pinia store test for `useTodoStore` (add/toggle/clear actions), and a Playwright E2E test for the full add-toggle-clear flow. Suggested approach:
  - In `TodoItem.spec.ts`, mount with `props: { todo: { id: 1, text: "test", done: false } }` and assert toggling emits `toggle` with id
  - In `todoStore.spec.ts`, use `setActivePinia(createPinia())` in `beforeEach` and test add/toggle/clear actions
  - In `todos.spec.ts` (Playwright), navigate to `/`, add a todo, toggle it, click "Clear completed", and assert the list is empty
  - Add a `vitest.config.ts` with `coverage: { provider: "v8", reporter: ["text", "html"] }`
  - Add `npm scripts: "test": "vitest", "test:e2e": "playwright test"`

### Exercises

1. Install Vitest + Vue Test Utils; write a spec that mounts a button and asserts its text.
2. Add a `trigger("click")` test and assert an emitted event with args.
3. Use `shallowMount` to stub a child component and verify it's stubbed.
4. Write a Pinia store test with `setActivePinia(createPinia())` in `beforeEach`.
5. Write a Playwright test that fills a login form and asserts the URL changes to /dashboard.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which test runner is Vite-native and recommended for Vue 3 projects?
9. A) Jest
10. B) Vitest (*)
11. C) Mocha
12. D) Karma
13. Explanation: Vitest runs in the Vite pipeline (same transforms, aliases, HMR), has a Jest-compatible API, and is the recommended runner for Vue 3 + Vite projects.
14. Q2: Which library mounts Vue components for unit testing?
15. A) @testing-library/vue
16. B) vue-jest
17. C) @vue/test-utils (*)
18. D) vitest-dom
19. Explanation: `@vue/test-utils` provides `mount` and `shallowMount` for Vue components; `@testing-library/vue` is an alternative higher-level API.
20. Q3: What's the difference between mount and shallowMount?
21. A) mount is async, shallowMount is sync
22. B) shallowMount is deprecated
23. C) There is no difference
24. D) mount renders children fully; shallowMount stubs child components for isolation (*)
25. Explanation: `mount` renders the full tree; `shallowMount` stubs child components to isolate the unit under test and speed up tests.
26. Q4: How do you assert a component emitted an event?
27. A) wrapper.emitted("event") (*)
28. B) wrapper.events
29. C) wrapper.$emit
30. D) wrapper.trigger("emit")
31. Explanation: `wrapper.emitted("name")` returns an array of arg-arrays for each emit; assert length and contents.
32. Q5: Why must you `await` trigger("click") before asserting?
33. A) trigger is sync
34. B) Vue updates the DOM asynchronously; assertions fail without awaiting the next tick (*)
35. C) trigger returns a promise
36. D) To satisfy ESLint
37. Explanation: Vue's reactivity flushes updates asynchronously; `await wrapper.get("button").trigger("click")` waits for the update before asserting.
38. Q6: How do you test a composable that uses onMounted?
39. A) Call it directly
40. B) You cannot
41. C) Mount a host component whose setup calls the composable (*)
42. D) Use a mock
43. Explanation: Lifecycle hooks register with the active component instance; mount a host component (`defineComponent`) whose `setup` calls the composable so hooks fire.
44. Q7: How do you reset Pinia between tests?
45. A) store.$reset()
46. B) delete the store
47. C) Reload the page
48. D) setActivePinia(createPinia()) in beforeEach (*)
49. Explanation: `setActivePinia(createPinia())` in `beforeEach` creates a fresh Pinia instance per test so state doesn't leak between tests.
50. Q8: Which tool is recommended for E2E testing Vue apps?
51. A) Playwright (*)
52. B) Cypress
53. C) Selenium
54. D) Puppeteer
55. Explanation: Playwright is the Vue team's recommended E2E tool (cross-browser, fast, built-in auto-wait); Cypress is a popular alternative.
56. Q9: Why prefer getByRole/getByText over CSS class selectors in tests?
57. A) Faster
58. B) Resilience to DOM/CSS refactors — tests focus on user-visible behavior (*)
59. C) Required by Vue
60. D) Class selectors are deprecated
61. Explanation: Role/text selectors mimic how users interact; CSS classes are implementation details that change during refactoring.
62. Q10: How do you measure test coverage in a Vite + Vitest project?
63. A) jest --coverage
64. B) babel-plugin-istanbul
65. C) vitest run --coverage with the v8 or c8 provider (*)
66. D) nyc
67. Explanation: Vitest supports coverage via `@vitest/coverage-v8` (or `c8`); configure in `vitest.config.ts` and run `vitest run --coverage`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which test runner is Vite-native and recommended for Vue 3 projects?
  options:
    - Jest
    - Vitest
    - Mocha
    - Karma
    - ", has a Jest-compatible API, and is the recommended runner for Vue 3 + Vite projects."
  correctIndex: 1
  explanation: Vitest runs in the Vite pipeline (same transforms, aliases, HMR), has a Jest-compatible API, and is the recommended runner for Vue 3 + Vite projects.
- id: q2
  question: Which library mounts Vue components for unit testing?
  options:
    - "@testing-library/vue"
    - vue-jest
    - "@vue/test-utils"
    - vitest-dom
  correctIndex: 2
  explanation: "`@vue/test-utils` provides `mount` and `shallowMount` for Vue components; `@testing-library/vue` is an alternative higher-level API."
- id: q3
  question: What's the difference between mount and shallowMount?
  options:
    - mount is async, shallowMount is sync
    - shallowMount is deprecated
    - There is no difference
    - mount renders children fully; shallowMount stubs child components for isolation
  correctIndex: 3
  explanation: "`mount` renders the full tree; `shallowMount` stubs child components to isolate the unit under test and speed up tests."
- id: q4
  question: How do you assert a component emitted an event?
  options:
    - wrapper.emitted("event")
    - wrapper.events
    - wrapper.$emit
    - wrapper.trigger("emit")
  correctIndex: 0
  explanation: '`wrapper.emitted("name")` returns an array of arg-arrays for each emit; assert length and contents.'
- id: q5
  question: Why must you `await` trigger("click") before asserting?
  options:
    - trigger is sync
    - Vue updates the DOM asynchronously; assertions fail without awaiting the next tick
    - trigger returns a promise
    - To satisfy ESLint
  correctIndex: 1
  explanation: Vue's reactivity flushes updates asynchronously; `await wrapper.get("button").trigger("click")` waits for the update before asserting.
- id: q6
  question: How do you test a composable that uses onMounted?
  options:
    - Call it directly
    - You cannot
    - Mount a host component whose setup calls the composable
    - Use a mock
  correctIndex: 2
  explanation: Lifecycle hooks register with the active component instance; mount a host component (`defineComponent`) whose `setup` calls the composable so hooks fire.
- id: q7
  question: How do you reset Pinia between tests?
  options:
    - store.$reset()
    - delete the store
    - Reload the page
    - setActivePinia(createPinia()) in beforeEach
  correctIndex: 3
  explanation: "`setActivePinia(createPinia())` in `beforeEach` creates a fresh Pinia instance per test so state doesn't leak between tests."
- id: q8
  question: Which tool is recommended for E2E testing Vue apps?
  options:
    - Playwright
    - Cypress
    - Selenium
    - Puppeteer
  correctIndex: 0
  explanation: Playwright is the Vue team's recommended E2E tool (cross-browser, fast, built-in auto-wait); Cypress is a popular alternative.
- id: q9
  question: Why prefer getByRole/getByText over CSS class selectors in tests?
  options:
    - Faster
    - Resilience to DOM/CSS refactors — tests focus on user-visible behavior
    - Required by Vue
    - Class selectors are deprecated
  correctIndex: 1
  explanation: Role/text selectors mimic how users interact; CSS classes are implementation details that change during refactoring.
- id: q10
  question: How do you measure test coverage in a Vite + Vitest project?
  options:
    - jest --coverage
    - babel-plugin-istanbul
    - vitest run --coverage with the v8 or c8 provider
    - nyc
  correctIndex: 2
  explanation: Vitest supports coverage via `@vitest/coverage-v8` (or `c8`); configure in `vitest.config.ts` and run `vitest run --coverage`.
```

