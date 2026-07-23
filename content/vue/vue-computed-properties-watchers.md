---
slug: vue-computed-properties-watchers
id: vue-04
track: vue
order: 4
title: Computed Properties and Watchers
description: Master computed properties for derived state, watchers for side effects, and the watchEffect API for automatic dependency tracking.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=90s
whyItMatters: Master computed properties for derived state, watchers for side effects, and the watchEffect API for automatic dependency tracking.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Computed Properties and Watchers

## Computed Properties and Watchers

### Why It Matters

Master computed properties for derived state, watchers for side effects, and the watchEffect API for automatic dependency tracking.

Master computed properties for derived state, watchers for side effects, and the watchEffect API for automatic dependency tracking.

### Prerequisites

- Stage 2: The Vue Instance and Reactivity (ref/reactive).
- Stage 3: Template Syntax (expressions and bindings).

### Topics

- Why computed beats inline expressions (caching, readability)
- `computed()` — getter-only and writable computed
- Computed caching and lazy evaluation
- `watch()` — explicit source(s), old/new value, deep option
- `watchEffect()` — auto-tracked dependencies, immediate run
- `immediate` and `flush` options (`'pre'`, `'post'`, `'sync'`)
- Stopping watchers with the returned handle
- Computed vs watch vs watchEffect — when to use each

### Key Concepts

- Computed values are cached and only re-evaluated when their dependencies change
- Writable computeds have separate get and set functions
- `watch` lets you respond to changes with the old and new value, but is lazy by default
- `watchEffect` runs immediately and re-runs whenever any reactive read inside it changes
- Watchers run synchronously in `'pre'` flush mode by default (before component update); use `'post'` for DOM access

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const firstName = ref("Ada");
const lastName = ref("Lovelace");

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const reversed = computed(() => fullName.value.split("").reverse().join(""));
</script>

<template>
  <p>{{ fullName }} / {{ reversed }}</p>
</template>
```
Caption: Computed for derived state

### Common Pitfalls

- Using a method instead of a computed — methods re-run on every render; computeds cache by dependency, so use computed for derived state.
- Forgetting `deep: true` on a `watch()` of a reactive object — top-level property changes are tracked but nested mutations are not unless `deep: true` is set.
- Mutating state inside a computed getter — getters must be pure; side effects cause infinite loops or stale caches. Use `watch`/`watchEffect` for side effects.
- Expecting `watch` to fire immediately — by default `watch` is lazy and only fires on change; use `{ immediate: true }` to also fire on setup.
- Doing DOM work in a `watchEffect` with default flush — DOM may not be updated yet; use `{ flush: 'post' }` or `nextTick()` to run after the update.

### Real-World Applications

- GitLab's issue list uses computed properties to derive filtered/sorted views from a single source of issues, caching results until filters change.
- Alibaba's Tmall search page uses `watchEffect` to debounce and refetch results whenever any facet (price, brand, rating) changes.
- Adobe Portfolio's gallery uses a writable computed to keep a `slug` ref in sync with the editable `title` ref.
- Nintendo's eShop uses deep watchers on the cart object to persist it to localStorage on every change.

### Interview Questions

- 1. What's the difference between a computed and a method? — Computeds cache by dependency and only re-evaluate when deps change; methods re-run on every render.
- 2. When would you use `watch` over `watchEffect`? — When you need the previous value, want to watch a specific source (not auto-tracked), or want lazy behavior (no immediate run).
- 3. Why must computed getters be pure? — Side effects cause cache invalidation issues, infinite update loops, and make the component hard to reason about.
- 4. What does `deep: true` do on a watcher? — It traverses the source object deeply so nested property mutations also trigger the callback.
- 5. What are the three `flush` modes? — `'pre'` (default, before component DOM update), `'post'` (after DOM update — use for DOM reads), `'sync'` (synchronously after every change).

### Mini Project

Build a "Search Filter" mini-app: An SFC with a search input, a list of 20 hardcoded items, and a computed that filters the list case-insensitively. Add a watch that logs every change to the search term with a timestamp. Suggested approach:
  - Hold items in a `ref<string[]>` (hardcoded)
  - Hold the query in a `ref<string>`
  - Build a `computed` that returns `items.value.filter(i => i.toLowerCase().includes(query.value.toLowerCase()))`
  - Use a `watch(query, ...)` to log old/new values with `new Date().toISOString()`
  - Show "No results" when the computed array is empty

### Exercises

1. Convert an inline `{{ a + b }}` expression to a computed `sum` and verify it only re-runs when a or b changes (add a `console.log`).
2. Build a writable computed `fullName` that splits the input into `firstName` and `lastName` refs.
3. Use `watch(state, cb, { deep: true })` to detect a nested object mutation.
4. Replace a `watch` with `watchEffect` for a fetch effect and verify it auto-tracks dependencies.
5. Use `{ flush: 'post' }` on a watcher that reads `document.querySelector` after a state change.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why use a computed property instead of a method?
9. A) Computed is async
10. B) Methods are deprecated
11. C) Computed always runs faster on first call
12. D) Computed caches results by dependency and avoids re-computation (*)
13. Explanation: Computeds cache their result and only re-evaluate when a dependency changes; methods re-run on every render.
14. Q2: What's the default behavior of watch()?
15. A) Lazy — only runs when the source changes (*)
16. B) Runs immediately on setup
17. C) Runs once per second
18. D) Runs after every render
19. Explanation: `watch` is lazy by default; it does not fire on setup unless you pass `{ immediate: true }`.
20. Q3: What does watchEffect() do that watch() does not?
21. A) Watches multiple sources at once
22. B) Runs immediately and auto-tracks all reactive reads inside it (*)
23. C) Runs synchronously
24. D) Returns a value
25. Explanation: `watchEffect` runs immediately and re-runs whenever any reactive read inside the callback changes; you don't list sources explicitly.
26. Q4: When should you use { deep: true } on a watcher?
27. A) Always
28. B) When watching a primitive
29. C) When you need to detect nested property mutations on an object (*)
30. D) To make the watcher async
31. Explanation: `deep: true` traverses the source object deeply so nested mutations trigger the callback; otherwise only reassignment of the top-level value is tracked.
32. Q5: Which computed getter is INVALID?
33. A) () => a.value + b.value
34. B) () => a.value * 2
35. C) () => `${a.value}`
36. D) () => { a.value++; return a.value; } (*)
37. Explanation: Computed getters must be pure — mutating state inside a getter causes infinite loops and stale caches.
38. Q6: What does { immediate: true } do on watch()?
39. A) Runs the callback immediately on setup in addition to on change (*)
40. B) Makes the watcher async
41. C) Cancels the watcher
42. D) Increases the watcher priority
43. Explanation: `{ immediate: true }` fires the callback once on setup with `oldValue === undefined`, then again whenever the source changes.
44. Q7: How do you create a writable computed?
45. A) Pass { writable: true }
46. B) Pass an object with get and set functions (*)
47. C) Use ref() instead
48. D) Writable computeds are not supported
49. Explanation: `computed({ get, set })` creates a writable computed where setting `.value` calls the set function.
50. Q8: Which flush mode runs the watcher AFTER the DOM is updated?
51. A) 'pre'
52. B) 'sync'
53. C) 'post' (*)
54. D) 'after'
55. Explanation: `{ flush: 'post' }` runs the callback after the component's DOM has been updated; useful for reading DOM measurements.
56. Q9: How do you clean up an async side effect in watchEffect?
57. A) You cannot
58. B) Use try/finally
59. C) Use a separate watch()
60. D) Call onCleanup(fn) inside the effect to register a cleanup that runs before the next run (*)
61. Explanation: `onCleanup(fn)` (imported from 'vue') registers a function that runs before the next effect run and on scope disposal, ideal for aborting fetches.
62. Q10: What happens if a watch source is a reactive() object and you mutate a nested field?
63. A) The watcher does NOT fire unless you pass { deep: true } (*)
64. B) The watcher fires automatically
65. C) The watcher fires only if the top-level reference changes
66. D) Vue throws an error
67. Explanation: For `reactive()` sources, `watch` only tracks top-level reassignment by default; nested mutations require `{ deep: true }`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why use a computed property instead of a method?
  options:
    - Computed is async
    - Methods are deprecated
    - Computed always runs faster on first call
    - Computed caches results by dependency and avoids re-computation
  correctIndex: 3
  explanation: Computeds cache their result and only re-evaluate when a dependency changes; methods re-run on every render.
- id: q2
  question: What's the default behavior of watch()?
  options:
    - Lazy — only runs when the source changes
    - Runs immediately on setup
    - Runs once per second
    - Runs after every render
  correctIndex: 0
  explanation: "`watch` is lazy by default; it does not fire on setup unless you pass `{ immediate: true }`."
- id: q3
  question: What does watchEffect() do that watch() does not?
  options:
    - Watches multiple sources at once
    - Runs immediately and auto-tracks all reactive reads inside it
    - Runs synchronously
    - Returns a value
  correctIndex: 1
  explanation: "`watchEffect` runs immediately and re-runs whenever any reactive read inside the callback changes; you don't list sources explicitly."
- id: q4
  question: "When should you use { deep: true } on a watcher?"
  options:
    - Always
    - When watching a primitive
    - When you need to detect nested property mutations on an object
    - To make the watcher async
  correctIndex: 2
  explanation: "`deep: true` traverses the source object deeply so nested mutations trigger the callback; otherwise only reassignment of the top-level value is tracked."
- id: q5
  question: Which computed getter is INVALID?
  options:
    - () => a.value + b.value
    - () => a.value * 2
    - () => `${a.value}`
    - () => { a.value++; return a.value; }
  correctIndex: 3
  explanation: Computed getters must be pure — mutating state inside a getter causes infinite loops and stale caches.
- id: q6
  question: "What does { immediate: true } do on watch()?"
  options:
    - Runs the callback immediately on setup in addition to on change
    - Makes the watcher async
    - Cancels the watcher
    - Increases the watcher priority
  correctIndex: 0
  explanation: "`{ immediate: true }` fires the callback once on setup with `oldValue === undefined`, then again whenever the source changes."
- id: q7
  question: How do you create a writable computed?
  options:
    - "Pass { writable: true }"
    - Pass an object with get and set functions
    - Use ref() instead
    - Writable computeds are not supported
  correctIndex: 1
  explanation: "`computed({ get, set })` creates a writable computed where setting `.value` calls the set function."
- id: q8
  question: Which flush mode runs the watcher AFTER the DOM is updated?
  options:
    - "'pre'"
    - "'sync'"
    - "'post'"
    - "'after'"
  correctIndex: 2
  explanation: "`{ flush: 'post' }` runs the callback after the component's DOM has been updated; useful for reading DOM measurements."
- id: q9
  question: How do you clean up an async side effect in watchEffect?
  options:
    - You cannot
    - Use try/finally
    - Use a separate watch()
    - Call onCleanup(fn) inside the effect to register a cleanup that runs before the next run
  correctIndex: 3
  explanation: "`onCleanup(fn)` (imported from 'vue') registers a function that runs before the next effect run and on scope disposal, ideal for aborting fetches."
- id: q10
  question: What happens if a watch source is a reactive() object and you mutate a nested field?
  options:
    - "The watcher does NOT fire unless you pass { deep: true }"
    - The watcher fires automatically
    - The watcher fires only if the top-level reference changes
    - Vue throws an error
  correctIndex: 0
  explanation: "For `reactive()` sources, `watch` only tracks top-level reassignment by default; nested mutations require `{ deep: true }`."
```

