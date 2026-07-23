---
slug: vue-list-rendering-v-key
id: vue-07
track: vue
order: 7
title: List Rendering — v-for, key
description: Render lists with v-for over arrays, ranges, and objects, understand the critical role of the key attribute, and apply list filtering with computed properties.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=180s
whyItMatters: Render lists with v-for over arrays, ranges, and objects, understand the critical role of the key attribute, and apply list filtering with computed properties.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# List Rendering — v-for, key

## List Rendering — v-for, key

### Why It Matters

Render lists with v-for over arrays, ranges, and objects, understand the critical role of the key attribute, and apply list filtering with computed properties.

Render lists with v-for over arrays, ranges, and objects, understand the critical role of the key attribute, and apply list filtering with computed properties.

### Prerequisites

- Stage 2: The Vue Instance and Reactivity (arrays in reactive).
- Stage 4: Computed Properties (for filtering/sorting).
- Stage 6: Conditional Rendering.

### Topics

- `v-for` over arrays: `item in items`, `(item, index) in items`
- `v-for` over objects: `(value, key, index) in object`
- `v-for` over a range: `n in 10`
- The `key` attribute — why it must be unique and stable
- Mutation methods that Vue tracks: `push`, `pop`, `splice`, `sort`, `reverse`, `shift`, `unshift`
- Replacing a list (immutable update) vs mutating it
- Filtering/sorting with `computed` instead of in-place mutation
- `v-for` and `v-if` priority rules (and why to use a computed filter instead)

### Key Concepts

- The `key` attribute gives Vue a stable identity per item, so it can move nodes instead of re-rendering them
- Using the array index as a key is anti-pattern when items can be added/removed/reordered — leads to subtle state bugs
- Vue 3 wraps reactive arrays so `push`/`splice`/etc. trigger updates natively (no `Vue.set` needed)
- Computed filters are preferred over v-if inside v-for — they keep the template declarative and the filter cached
- `v-for` on `<template>` lets you loop multiple sibling elements without a wrapper

```vue
<script setup lang="ts">
import { ref } from "vue";

interface Todo { id: number; text: string; done: boolean; }
const todos = ref<Todo[]>([
  { id: 1, text: "Learn Vue", done: true },
  { id: 2, text: "Build app", done: false },
]);
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input type="checkbox" v-model="todo.done" />
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
    </li>
  </ul>
</template>
```
Caption: v-for over an array with key

### Common Pitfalls

- Using the array index as `:key` when items can be reordered/removed — this causes Vue to reuse the wrong DOM nodes and leak state (inputs, transitions); use a stable unique id.
- Using `v-if` inside `v-for` — Vue 3 evaluates v-if before v-for so the loop variable is undefined; use a computed filter instead.
- Mutating a non-reactive array — `items.push(x)` on a plain array (not via `ref/reactive`) does NOT trigger updates; always wrap state in `ref()` or `reactive()`.
- Forgetting `:key` entirely — Vue uses a fallback "in-place patch" strategy that can cause subtle bugs with form inputs and child state; always provide a stable key.
- Reordering with `sort()`/`reverse()` on a reactive array — these mutate in place, which Vue 3 handles, but the DOM may not visually update if keys are unstable.

### Real-World Applications

- GitLab's issue list uses v-for with `:key="issue.id"` to support drag-and-drop reordering without losing per-issue state.
- Alibaba's Taobao product listings use virtual scrolling (Stage 14) with `:key` for stable identity across pagination.
- Behance's project grid uses a computed filter + v-for to react to search, sort, and category facets without mutating the source array.
- Adobe Portfolio's image gallery uses `v-for` over an object map of breakpoints to render responsive image variants.

### Interview Questions

- 1. Why is the `key` attribute important in v-for? — It gives Vue a stable identity per item so it can move/reuse DOM nodes correctly instead of re-rendering them in place.
- 2. Why is using the array index as a key an anti-pattern? — When items are added/removed/reordered, the index shifts but the underlying item changes, causing Vue to mismatch DOM state with item state.
- 3. How does Vue 3 track array mutations? — Reactive arrays are Proxied, so `push/pop/splice/sort/etc.` are intercepted and trigger updates natively (no `Vue.set` needed).
- 4. How would you filter a v-for list? — Use a `computed` that returns the filtered array, then iterate that computed in the template; this is cached and keeps the template declarative.
- 5. What's wrong with v-if inside v-for in Vue 3? — Vue 3 evaluates v-if before v-for, so the loop variable is undefined inside the v-if expression; use a computed filter instead.

### Mini Project

Build a "Task Manager" mini-app: An SFC that lets you add tasks with text and priority (low/medium/high), filter by priority, and remove tasks. Use `:key="task.id"` and a computed filter. Suggested approach:
  - Hold tasks in `ref<{ id: number; text: string; priority: 'low'|'medium'|'high' }[]>([])`
  - Generate ids with `crypto.randomUUID()` or an incrementing counter ref
  - Add a `<select>` for the active filter (low/medium/high/all)
  - Build a `computed` that returns tasks filtered by the selected priority
  - Add a delete button per task that uses `tasks.value = tasks.value.filter(t => t.id !== id)` (immutable update)

### Exercises

1. Render a list of 5 numbers with `v-for="n in 5"` and compute their sum below.
2. Render `v-for` over an object's keys/values using `(value, key, index)`.
3. Add an input that filters a list of 10 hardcoded names via a `computed`.
4. Intentionally use the array index as `:key`, then add/remove items — observe the stale state bug.
5. Implement "add to top" with `unshift` and "remove by id" with `filter`; verify keys track correctly.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the correct syntax for v-for over an array with index?
9. A) v-for="item, index of items"
10. B) v-for="{item, index} in items"
11. C) v-for="(item, index) in items" (*)
12. D) v-for="item in items, index"
13. Explanation: `v-for="(item, index) in items"` is the syntax; `in` and `of` both work.
14. Q2: Why must the key attribute be stable and unique?
15. A) To improve CSS specificity
16. B) To satisfy the ESLint plugin
17. C) It does not matter
18. D) So Vue can identify and reuse the correct DOM nodes when the list changes (*)
19. Explanation: A stable unique key lets Vue match DOM nodes to items across renders, enabling it to move (not re-create) nodes when items reorder.
20. Q3: What's wrong with using the array index as :key?
21. A) When items are reordered/removed, the index shifts but the underlying item changes, causing state to leak between items (*)
22. B) It is slower
23. C) It is not allowed in Vue 3
24. D) Keys must be strings
25. Explanation: Index keys cause Vue to reuse the wrong DOM node when the array mutates — form inputs and child state appear to "jump" between items.
26. Q4: Which array method does NOT trigger reactivity in Vue 3 reactive arrays?
27. A) push()
28. B) direct index assignment like arr[5] = x — actually this DOES work in Vue 3 (*)
29. C) splice()
30. D) sort()
31. Explanation: Vue 3 Proxies intercept all array operations including direct index assignment; this is a key advantage over Vue 2's Object.defineProperty.
32. Q5: How does v-for over an object look?
33. A) v-for="key, value of object"
34. B) v-for="item in object.entries()"
35. C) v-for="(value, key, index) in object" (*)
36. D) v-for="[key, value] of object"
37. Explanation: Vue provides `(value, key, index)` triple-destructuring for objects directly in v-for, no need for `Object.entries()`.
38. Q6: Why should you use a computed filter instead of v-if inside v-for?
39. A) Computed is faster
40. B) v-if is deprecated
41. C) Computed supports async
42. D) Vue 3 evaluates v-if before v-for, so the loop variable is undefined inside v-if (*)
43. Explanation: Vue 3 evaluates v-if with higher priority than v-for, so the loop item is undefined inside the v-if expression — use a computed filter.
44. Q7: What does v-for on <template> do?
45. A) Loops multiple sibling elements without a wrapper (*)
46. B) Renders a <template> wrapper in the DOM
47. C) Creates a new scope
48. D) Nothing — it is invalid
49. Explanation: `<template v-for>` renders its children per iteration without adding a wrapper element to the DOM.
50. Q8: Which v-for syntax iterates a number range?
51. A) v-for="n from 1 to 10"
52. B) v-for="n in 10" (*)
53. C) v-for="n of range(10)"
54. D) v-for="n..10"
55. Explanation: `v-for="n in 10"` iterates from 1 to 10 inclusive; useful for generating a fixed number of items.
56. Q9: What happens if you omit :key entirely in v-for?
57. A) Vue throws a compile error
58. B) The list does not render
59. C) Vue uses an in-place patch strategy that may cause state bugs with form inputs and child state (*)
60. D) Vue adds a default key
61. Explanation: Without a key, Vue uses an index-based in-place patch strategy that can cause subtle bugs (e.g. input values appearing on the wrong row) — always provide a stable key.
62. Q10: Which is the IMMUTABLE update pattern for removing an item by id?
63. A) items.splice(index, 1)
64. B) delete items[index]
65. C) items.pop()
66. D) items = items.filter(t => t.id !== id) (via .value for ref) (*)
67. Explanation: `items.value = items.value.filter(...)` reassigns the array immutably; `splice` is the mutating alternative. Both work in Vue 3.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the correct syntax for v-for over an array with index?
  options:
    - v-for="item, index of items"
    - v-for="{item, index} in items"
    - v-for="(item, index) in items"
    - v-for="item in items, index"
  correctIndex: 2
  explanation: '`v-for="(item, index) in items"` is the syntax; `in` and `of` both work.'
- id: q2
  question: Why must the key attribute be stable and unique?
  options:
    - To improve CSS specificity
    - To satisfy the ESLint plugin
    - It does not matter
    - So Vue can identify and reuse the correct DOM nodes when the list changes
  correctIndex: 3
  explanation: A stable unique key lets Vue match DOM nodes to items across renders, enabling it to move (not re-create) nodes when items reorder.
- id: q3
  question: What's wrong with using the array index as :key?
  options:
    - When items are reordered/removed, the index shifts but the underlying item changes, causing state to leak between items
    - It is slower
    - It is not allowed in Vue 3
    - Keys must be strings
  correctIndex: 0
  explanation: Index keys cause Vue to reuse the wrong DOM node when the array mutates — form inputs and child state appear to "jump" between items.
- id: q4
  question: Which array method does NOT trigger reactivity in Vue 3 reactive arrays?
  options:
    - push()
    - direct index assignment like arr[5] = x — actually this DOES work in Vue 3
    - splice()
    - sort()
  correctIndex: 1
  explanation: Vue 3 Proxies intercept all array operations including direct index assignment; this is a key advantage over Vue 2's Object.defineProperty.
- id: q5
  question: How does v-for over an object look?
  options:
    - v-for="key, value of object"
    - v-for="item in object.entries()"
    - v-for="(value, key, index) in object"
    - v-for="[key, value] of object"
  correctIndex: 2
  explanation: Vue provides `(value, key, index)` triple-destructuring for objects directly in v-for, no need for `Object.entries()`.
- id: q6
  question: Why should you use a computed filter instead of v-if inside v-for?
  options:
    - Computed is faster
    - v-if is deprecated
    - Computed supports async
    - Vue 3 evaluates v-if before v-for, so the loop variable is undefined inside v-if
  correctIndex: 3
  explanation: Vue 3 evaluates v-if with higher priority than v-for, so the loop item is undefined inside the v-if expression — use a computed filter.
- id: q7
  question: What does v-for on <template> do?
  options:
    - Loops multiple sibling elements without a wrapper
    - Renders a <template> wrapper in the DOM
    - Creates a new scope
    - Nothing — it is invalid
  correctIndex: 0
  explanation: "`<template v-for>` renders its children per iteration without adding a wrapper element to the DOM."
- id: q8
  question: Which v-for syntax iterates a number range?
  options:
    - v-for="n from 1 to 10"
    - v-for="n in 10"
    - v-for="n of range(10)"
    - v-for="n..10"
  correctIndex: 1
  explanation: '`v-for="n in 10"` iterates from 1 to 10 inclusive; useful for generating a fixed number of items.'
- id: q9
  question: What happens if you omit :key entirely in v-for?
  options:
    - Vue throws a compile error
    - The list does not render
    - Vue uses an in-place patch strategy that may cause state bugs with form inputs and child state
    - Vue adds a default key
  correctIndex: 2
  explanation: Without a key, Vue uses an index-based in-place patch strategy that can cause subtle bugs (e.g. input values appearing on the wrong row) — always provide a stable key.
- id: q10
  question: Which is the IMMUTABLE update pattern for removing an item by id?
  options:
    - items.splice(index, 1)
    - delete items[index]
    - items.pop()
    - items = items.filter(t => t.id !== id) (via .value for ref)
  correctIndex: 3
  explanation: "`items.value = items.value.filter(...)` reassigns the array immutably; `splice` is the mutating alternative. Both work in Vue 3."
```

