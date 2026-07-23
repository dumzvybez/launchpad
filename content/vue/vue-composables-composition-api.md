---
slug: vue-composables-composition-api
id: vue-14
track: vue
order: 14
title: Composables and the Composition API
description: Extract reusable reactive logic into composables, master ref forwarding and toRefs, and learn the build-in composables from the Vue core.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=180s
whyItMatters: Extract reusable reactive logic into composables, master ref forwarding and toRefs, and learn the build-in composables from the Vue core.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Composables and the Composition API

## Composables and the Composition API

### Why It Matters

Extract reusable reactive logic into composables, master ref forwarding and toRefs, and learn the build-in composables from the Vue core.

Extract reusable reactive logic into composables, master ref forwarding and toRefs, and learn the build-in composables from the Vue core.

### Prerequisites

- Stage 2: Reactivity (ref/reactive).
- Stage 4: Computed and watch.
- Stage 13: Lifecycle hooks.

### Topics

- What a composable is (a function that uses reactivity)
- Convention: prefix with `use` (e.g. `useMouse`, `useFetch`)
- Returning refs vs reactive objects vs plain values
- `toRefs()` and `toValue()` for ergonomic destructuring
- `effectScope` for grouped cleanup
- Built-in composables: `useSlots`, `useAttrs`, `useTemplateRef`, `useId`
- Async composables and `<Suspense>` integration
- Composable testing patterns

### Key Concepts

- A composable is a function that encapsulates reactive state and effects, returning refs/methods for the consumer
- Always return refs (not values) from composables so consumers stay reactive
- `toRefs(reactiveObj)` lets you return a reactive object as individual refs the consumer can destructure
- `effectScope()` groups effects so they can be disposed together — useful for non-component contexts
- Async composables that use top-level `await` require `<Suspense>` in the parent

```ts
// composables/useMouse.ts
import { ref, onMounted, onUnmounted, readonly } from "vue";

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  // Return readonly refs so consumers can't mutate
  return { x: readonly(x), y: readonly(y) };
}
```
Caption: A useMouse composable

### Common Pitfalls

- Returning plain values (not refs) from a composable — destructured consumers lose reactivity; return refs and let consumers destructure them.
- Calling lifecycle hooks (onMounted, etc.) inside a composable that's invoked outside setup — they only register if the composable is called during a component's setup synchronously.
- Using top-level `await` in a composable that's not under `<Suspense>` — setup becomes async, which the parent must wrap in Suspense or it throws.
- Mutating returned readonly refs — wrap them in `readonly()` for the public API but keep a private writable ref for internal logic.
- Forgetting to clean up event listeners / intervals in a composable — use `onScopeDispose` so the consumer doesn't need to remember.

### Real-World Applications

- GitLab's shared composables (`useKeyboardShortcut`, `useLocalStorage`, `useDisclosure`) are reused across dozens of product surfaces.
- Alibaba's Element Plus ships composables like `useFormItem`, `useZIndex` for managing focus and stacking context across components.
- Behance's composables for pagination, infinite scroll, and image lazy-loading are reused across grids and search results.
- Adobe Portfolio's `useTheme` and `useBreakpoints` composables encapsulate responsive design logic used by every section.

### Interview Questions

- 1. What is a composable? — A function that uses Vue's reactivity APIs (ref, computed, watch, lifecycle hooks) to encapsulate and reuse reactive logic.
- 2. Why return refs (not values) from a composable? — So the consumer can destructure them without losing reactivity; plain values are snapshotted at call time.
- 3. What does `toRefs()` do in a composable? — Converts each property of a reactive object into a ref so consumers can destructure them individually.
- 4. How do async composables work? — Use top-level `await` in setup; the parent must wrap the component in `<Suspense>` with a fallback.
- 5. What is `effectScope` for? — Grouping multiple effects (watches, computeds) so they can be stopped together; useful in non-component contexts like stores or plugins.

### Mini Project

Build a `useLocalStorage<T>(key, initial)` composable: Returns a ref that syncs to localStorage on change and updates from the `storage` event across tabs. Use it from a small app that persists a counter across reloads and tabs. Suggested approach:
  - Read the initial value from `localStorage.getItem(key)` (parse JSON) or fall back to `initial`
  - Use a `ref<T>(initialValue)` and a `watch(ref, (val) => localStorage.setItem(key, JSON.stringify(val)), { deep: true })`
  - Add an `onMounted` window `storage` event listener that updates the ref when other tabs change it
  - Use `onScopeDispose` to remove the listener
  - Demo with two `<input>`s sharing the same key — change one tab, see the other update

### Exercises

1. Build `useMouse()` and consume it in two components simultaneously.
2. Add a `useFetch(url)` composable and use it with a ref URL that changes.
3. Refactor `useFetch` to use `onCleanup` for abort and verify the abort on URL change.
4. Build an async setup component and wrap it in `<Suspense>` with a fallback.
5. Use `effectScope()` to group three watchers and stop them all at once.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a Vue composable?
9. A) A Vue plugin
10. B) A function that encapsulates reactive logic using Vue's reactivity APIs (*)
11. C) A SFC component
12. D) A type of directive
13. Explanation: A composable is a function (conventionally prefixed `use`) that uses ref/computed/watch/lifecycle hooks to encapsulate and reuse reactive logic.
14. Q2: Why should composables return refs (not plain values)?
15. A) Refs are faster
16. B) TypeScript requires it
17. C) Plain values snapshot at call time and lose reactivity when destructured; refs preserve it (*)
18. D) Plain values are not allowed
19. Explanation: Returning refs lets consumers destructure them and stay reactive; returning a plain value snapshots the value at call time.
20. Q3: What naming convention do Vue composables follow?
21. A) Prefix with `get`
22. B) Suffix with `Composable`
23. C) CamelCase only
24. D) Prefix with `use` (e.g. useMouse) (*)
25. Explanation: Vue convention is to prefix composables with `use`, mirroring the React hooks convention; the Vue tooling and docs assume this.
26. Q4: What does toRefs() do?
27. A) Converts each property of a reactive object into a ref so they can be destructured without losing reactivity (*)
28. B) Converts a ref to a reactive object
29. C) Removes reactivity
30. D) Converts a ref to a plain value
31. Explanation: `toRefs(reactiveObj)` returns an object whose properties are refs linked to the original, enabling safe destructuring.
32. Q5: How does an async composable integrate with the parent?
33. A) It just works
34. B) The parent must wrap the component in <Suspense> (*)
35. C) You pass a callback
36. D) Async composables are not supported
37. Explanation: A composable using top-level `await` makes setup async; the parent must wrap the component in `<Suspense>` with a fallback template.
38. Q6: What does onCleanup() do inside a watchEffect?
39. A) Cancels the effect
40. B) Resets the deps
41. C) Registers a cleanup function that runs before the next effect run and on scope disposal (*)
42. D) Disables the effect
43. Explanation: `onCleanup(fn)` (imported from `vue`) registers a function that runs before the next effect run and when the scope is disposed — ideal for aborting fetches.
44. Q7: What is effectScope for?
45. A) Creating a new Vue app
46. B) Defining computed scopes
47. C) A replacement for setup
48. D) Grouping effects so they can be stopped together outside of a component (*)
49. Explanation: `effectScope()` creates a scope that collects effects created inside it; calling `.stop()` disposes them all — useful for stores, plugins, and tests.
50. Q8: Where can lifecycle hooks (onMounted, etc.) be called?
51. A) Only synchronously during a component's setup (or a composable called from it) (*)
52. B) Anywhere
53. C) Inside async functions
54. D) Inside <template>
55. Explanation: Lifecycle hooks register with the current component instance captured during setup; calling them outside setup (or after an `await`) silently fails.
56. Q9: What does readonly() return when wrapping a ref?
57. A) A plain value
58. B) A new ref that warns on mutation in dev (*)
59. C) The same ref
60. D) An array
61. Explanation: `readonly(ref)` returns a proxy ref that warns when you try to set `.value` — useful for exposing immutable state from composables.
62. Q10: Which is a built-in Vue 3 composable for unique IDs?
63. A) useUuid()
64. B) useRandom()
65. C) useId() (*)
66. D) useHash()
67. Explanation: `useId()` (Vue 3.5+) generates a stable, SSR-safe unique ID for a11y attributes like `aria-labelledby` and `for`/`id` pairs.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a Vue composable?
  options:
    - A Vue plugin
    - A function that encapsulates reactive logic using Vue's reactivity APIs
    - A SFC component
    - A type of directive
  correctIndex: 1
  explanation: A composable is a function (conventionally prefixed `use`) that uses ref/computed/watch/lifecycle hooks to encapsulate and reuse reactive logic.
- id: q2
  question: Why should composables return refs (not plain values)?
  options:
    - Refs are faster
    - TypeScript requires it
    - Plain values snapshot at call time and lose reactivity when destructured; refs preserve it
    - Plain values are not allowed
  correctIndex: 2
  explanation: Returning refs lets consumers destructure them and stay reactive; returning a plain value snapshots the value at call time.
- id: q3
  question: What naming convention do Vue composables follow?
  options:
    - Prefix with `get`
    - Suffix with `Composable`
    - CamelCase only
    - Prefix with `use` (e.g. useMouse)
  correctIndex: 3
  explanation: Vue convention is to prefix composables with `use`, mirroring the React hooks convention; the Vue tooling and docs assume this.
- id: q4
  question: What does toRefs() do?
  options:
    - Converts each property of a reactive object into a ref so they can be destructured without losing reactivity
    - Converts a ref to a reactive object
    - Removes reactivity
    - Converts a ref to a plain value
  correctIndex: 0
  explanation: "`toRefs(reactiveObj)` returns an object whose properties are refs linked to the original, enabling safe destructuring."
- id: q5
  question: How does an async composable integrate with the parent?
  options:
    - It just works
    - The parent must wrap the component in <Suspense>
    - You pass a callback
    - Async composables are not supported
  correctIndex: 1
  explanation: A composable using top-level `await` makes setup async; the parent must wrap the component in `<Suspense>` with a fallback template.
- id: q6
  question: What does onCleanup() do inside a watchEffect?
  options:
    - Cancels the effect
    - Resets the deps
    - Registers a cleanup function that runs before the next effect run and on scope disposal
    - Disables the effect
  correctIndex: 2
  explanation: "`onCleanup(fn)` (imported from `vue`) registers a function that runs before the next effect run and when the scope is disposed — ideal for aborting fetches."
- id: q7
  question: What is effectScope for?
  options:
    - Creating a new Vue app
    - Defining computed scopes
    - A replacement for setup
    - Grouping effects so they can be stopped together outside of a component
  correctIndex: 3
  explanation: "`effectScope()` creates a scope that collects effects created inside it; calling `.stop()` disposes them all — useful for stores, plugins, and tests."
- id: q8
  question: Where can lifecycle hooks (onMounted, etc.) be called?
  options:
    - Only synchronously during a component's setup (or a composable called from it)
    - Anywhere
    - Inside async functions
    - Inside <template>
  correctIndex: 0
  explanation: Lifecycle hooks register with the current component instance captured during setup; calling them outside setup (or after an `await`) silently fails.
- id: q9
  question: What does readonly() return when wrapping a ref?
  options:
    - A plain value
    - A new ref that warns on mutation in dev
    - The same ref
    - An array
  correctIndex: 1
  explanation: "`readonly(ref)` returns a proxy ref that warns when you try to set `.value` — useful for exposing immutable state from composables."
- id: q10
  question: Which is a built-in Vue 3 composable for unique IDs?
  options:
    - useUuid()
    - useRandom()
    - useId()
    - useHash()
  correctIndex: 2
  explanation: "`useId()` (Vue 3.5+) generates a stable, SSR-safe unique ID for a11y attributes like `aria-labelledby` and `for`/`id` pairs."
```

