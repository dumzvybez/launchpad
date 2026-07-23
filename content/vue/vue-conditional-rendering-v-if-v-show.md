---
slug: vue-conditional-rendering-v-if-v-show
id: vue-06
track: vue
order: 6
title: Conditional Rendering — v-if, v-show
description: Render elements conditionally with v-if/v-else-if/v-else, toggle visibility with v-show, and understand when to use each.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=150s
whyItMatters: Render elements conditionally with v-if/v-else-if/v-else, toggle visibility with v-show, and understand when to use each.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Conditional Rendering — v-if, v-show

## Conditional Rendering — v-if, v-show

### Why It Matters

Render elements conditionally with v-if/v-else-if/v-else, toggle visibility with v-show, and understand when to use each.

Render elements conditionally with v-if/v-else-if/v-else, toggle visibility with v-show, and understand when to use each.

### Prerequisites

- Stage 3: Template Syntax (directives overview).
- Stage 4: Computed Properties (for derived booleans).

### Topics

- `v-if`, `v-else-if`, `v-else` directive chain
- `v-show` and the `display: none` toggle
- `v-if` on `<template>` to group siblings without a wrapper
- Performance trade-offs: v-if destroys/recreates, v-show only toggles CSS
- `v-if` with `key` to force re-creation
- `v-memo` for memoizing sub-trees on condition
- A11y implications of conditional rendering (focus management)
- Combining v-if and v-for (and why you shouldn't)

### Key Concepts

- `v-if` removes the element from the DOM entirely (and its children's lifecycle hooks fire on each toggle)
- `v-show` only toggles `display: none` — the element is always in the DOM, so initial cost is higher but toggling is cheaper
- `v-if` and `v-for` on the same element is anti-pattern — v-if has priority over v-for in Vue 3 (reversed from Vue 2), causing confusion
- `v-memo` memoizes a subtree and only re-renders when the listed deps change
- Use `<template v-if>` to wrap multiple sibling elements without adding a wrapper to the DOM

```vue
<script setup lang="ts">
import { ref } from "vue";
const score = ref(75);
</script>

<template>
  <p v-if="score >= 90">A</p>
  <p v-else-if="score >= 80">B</p>
  <p v-else-if="score >= 70">C</p>
  <p v-else>F</p>
</template>
```
Caption: v-if / v-else-if / v-else chain

### Common Pitfalls

- Using `v-if` and `v-for` on the same element — Vue 3 evaluates v-if first (reversed from Vue 2), so the loop variable is undefined; use a `<template v-for>` wrapper or a computed filter.
- Using `v-show` on a heavy component to "save" init time — the component still mounts and runs setup; use `v-if` if you actually want to defer work.
- Forgetting `key` when toggling between similar elements — Vue may reuse the DOM node and cause stale state; add a unique `key` to force re-creation.
- Toggling focusable elements with `v-if` without managing focus — screen reader users lose focus when an element is removed; move focus explicitly.
- Expecting `v-if` to lazy-mount async components — `v-if` removes from DOM but the component is still imported; pair with `defineAsyncComponent` for code-splitting.

### Real-World Applications

- GitLab's merge request widget uses v-if/v-else to switch between loaded, loading, and error states.
- Alibaba's Tmall product page uses `v-show` for tabbed sections that users toggle frequently.
- Behance's image lightbox uses `v-if` to mount the heavy carousel only when opened.
- Adobe Portfolio uses `<template v-if>` to group author bio + photo + social links without a wrapper div.

### Interview Questions

- 1. When would you prefer v-show over v-if? — When the element toggles frequently and the initial render cost is acceptable, since v-show only toggles CSS.
- 2. What happens when v-if becomes false? — Vue removes the element from the DOM and triggers the unmounted lifecycle hook on any child components.
- 3. Why is v-if with v-for on the same element an anti-pattern? — In Vue 3, v-if evaluates before v-for, so the loop variable is undefined; split them via a computed or `<template v-for>`.
- 4. What does `<template v-if>` do? — Renders its children without adding a wrapper element to the DOM; useful for grouping conditional siblings.
- 5. What is v-memo for? — Memoizing a subtree so it only re-renders when the listed dependency array changes; useful for expensive children in large lists.

### Mini Project

Build a "Login / Dashboard" toggle: An SFC that shows a login form when the user is null and a dashboard with their name + logout button when logged in. Use `<template v-if>` to group. Suggested approach:
  - Hold `user` in a `ref<{ name: string; email: string } | null>(null)`
  - Use `<template v-if="user">` to group the dashboard (name, email, logout)
  - Use `<template v-else>` for the login form (two inputs + submit button)
  - Add a `key` attribute to each top-level template group so Vue never reuses nodes between them
  - Show a "logging in..." state via v-show on a spinner for 500ms after submit

### Exercises

1. Build a v-if/v-else-if/v-else chain that prints the day type (weekday/weekend) from `new Date().getDay()`.
2. Toggle the same div with both v-if and v-show, then inspect the DOM in DevTools to see the difference.
3. Use `<template v-if>` to conditionally render three sibling elements without a wrapper div.
4. Add `v-memo` to an expensive list item and verify (via console.log) it doesn't re-render on unrelated state changes.
5. Trigger a focus bug by removing a focused input via v-if, then fix it by moving focus before removal.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does v-if do when its expression is false?
9. A) Hides the element with display:none
10. B) Removes the element from the DOM entirely (*)
11. C) Sets visibility:hidden
12. D) Logs a warning
13. Explanation: `v-if` removes the element from the DOM (and triggers unmounted hooks on child components); it is re-created when the expression becomes truthy.
14. Q2: What does v-show do when its expression is false?
15. A) Removes the element from the DOM
16. B) Sets visibility:hidden
17. C) Sets display:none on the element (*)
18. D) Throws an error
19. Explanation: `v-show` toggles the CSS `display` property; the element stays in the DOM and is not re-mounted.
20. Q3: Which is TRUE about v-if and v-for on the same element in Vue 3?
21. A) v-for runs before v-if
22. B) They are not allowed together
23. C) Vue throws a compile error
24. D) v-if runs before v-for (the loop variable is undefined inside v-if) (*)
25. Explanation: Vue 3 evaluates v-if with higher priority than v-for (the opposite of Vue 2), so the loop variable is undefined — split them or use a computed.
26. Q4: When should you prefer v-show over v-if?
27. A) When the element toggles frequently and you can afford the initial render cost (*)
28. B) When the element rarely toggles
29. C) Never
30. D) Only for forms
31. Explanation: v-show pays the initial render cost once but toggles cheaply thereafter; ideal for frequently toggled UI like tabs.
32. Q5: What does <template v-if> do?
33. A) Renders a <template> element to the DOM
34. B) Groups conditional siblings without a wrapper element in the DOM (*)
35. C) Creates a new Vue instance
36. D) Comments out the children
37. Explanation: `<template v-if>` renders its children directly without a wrapper element, useful for grouping conditional content.
38. Q6: What is v-memo used for?
39. A) Caching API responses
40. B) Memoizing computed properties
41. C) Memoizing a subtree so it only re-renders when listed deps change (*)
42. D) A replacement for v-once
43. Explanation: `v-memo="[deps]"` skips re-rendering a subtree unless the listed dependencies change — useful for expensive items in large lists.
44. Q7: Why might you need a key when toggling between two similar elements with v-if/v-else?
45. A) To improve performance
46. B) To satisfy the compiler
47. C) Keys are not needed with v-if
48. D) To prevent Vue from reusing the DOM node and causing stale state (*)
49. Explanation: Without a `key`, Vue may reuse the same DOM node between branches and leak state (e.g. input value); a unique key forces re-creation.
50. Q8: Which lifecycle hook fires when a v-if child component is removed?
51. A) onUnmounted (*)
52. B) onBeforeMount
53. C) onMounted
54. D) onActivated
55. Explanation: When v-if becomes false, the child is removed from the DOM and its `onUnmounted` hook fires.
56. Q9: What's the a11y concern with v-if on a focused element?
57. A) It is slower
58. B) Focus is lost when the element is removed from the DOM; move focus explicitly (*)
59. C) Screen readers cannot read v-if content
60. D) There is no concern
61. Explanation: Removing a focused element from the DOM causes focus to jump to <body>; always move focus programmatically before removal.
62. Q10: What does v-else-if require to be valid?
63. A) A v-show before it
64. B) A key attribute
65. C) A previous v-if or v-else-if on a sibling (*)
66. D) Nothing
67. Explanation: v-else-if must immediately follow a v-if or another v-else-if on a sibling element; otherwise Vue treats it as invalid.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does v-if do when its expression is false?
  options:
    - Hides the element with display:none
    - Removes the element from the DOM entirely
    - Sets visibility:hidden
    - Logs a warning
  correctIndex: 1
  explanation: "`v-if` removes the element from the DOM (and triggers unmounted hooks on child components); it is re-created when the expression becomes truthy."
- id: q2
  question: What does v-show do when its expression is false?
  options:
    - Removes the element from the DOM
    - Sets visibility:hidden
    - Sets display:none on the element
    - Throws an error
  correctIndex: 2
  explanation: "`v-show` toggles the CSS `display` property; the element stays in the DOM and is not re-mounted."
- id: q3
  question: Which is TRUE about v-if and v-for on the same element in Vue 3?
  options:
    - v-for runs before v-if
    - They are not allowed together
    - Vue throws a compile error
    - v-if runs before v-for (the loop variable is undefined inside v-if)
  correctIndex: 3
  explanation: Vue 3 evaluates v-if with higher priority than v-for (the opposite of Vue 2), so the loop variable is undefined — split them or use a computed.
- id: q4
  question: When should you prefer v-show over v-if?
  options:
    - When the element toggles frequently and you can afford the initial render cost
    - When the element rarely toggles
    - Never
    - Only for forms
  correctIndex: 0
  explanation: v-show pays the initial render cost once but toggles cheaply thereafter; ideal for frequently toggled UI like tabs.
- id: q5
  question: What does <template v-if> do?
  options:
    - Renders a <template> element to the DOM
    - Groups conditional siblings without a wrapper element in the DOM
    - Creates a new Vue instance
    - Comments out the children
  correctIndex: 1
  explanation: "`<template v-if>` renders its children directly without a wrapper element, useful for grouping conditional content."
- id: q6
  question: What is v-memo used for?
  options:
    - Caching API responses
    - Memoizing computed properties
    - Memoizing a subtree so it only re-renders when listed deps change
    - A replacement for v-once
  correctIndex: 2
  explanation: '`v-memo="[deps]"` skips re-rendering a subtree unless the listed dependencies change — useful for expensive items in large lists.'
- id: q7
  question: Why might you need a key when toggling between two similar elements with v-if/v-else?
  options:
    - To improve performance
    - To satisfy the compiler
    - Keys are not needed with v-if
    - To prevent Vue from reusing the DOM node and causing stale state
  correctIndex: 3
  explanation: Without a `key`, Vue may reuse the same DOM node between branches and leak state (e.g. input value); a unique key forces re-creation.
- id: q8
  question: Which lifecycle hook fires when a v-if child component is removed?
  options:
    - onUnmounted
    - onBeforeMount
    - onMounted
    - onActivated
  correctIndex: 0
  explanation: When v-if becomes false, the child is removed from the DOM and its `onUnmounted` hook fires.
- id: q9
  question: What's the a11y concern with v-if on a focused element?
  options:
    - It is slower
    - Focus is lost when the element is removed from the DOM; move focus explicitly
    - Screen readers cannot read v-if content
    - There is no concern
  correctIndex: 1
  explanation: Removing a focused element from the DOM causes focus to jump to <body>; always move focus programmatically before removal.
- id: q10
  question: What does v-else-if require to be valid?
  options:
    - A v-show before it
    - A key attribute
    - A previous v-if or v-else-if on a sibling
    - Nothing
  correctIndex: 2
  explanation: v-else-if must immediately follow a v-if or another v-else-if on a sibling element; otherwise Vue treats it as invalid.
```

