---
slug: vue-transitions-animations
id: vue-17
track: vue
order: 17
title: Transitions and Animations
description: Animate enter/leave of elements and components with `<Transition>`, animate lists with `<TransitionGroup>`, and integrate JavaScript hooks and third-party animation libraries.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=360s
whyItMatters: Animate enter/leave of elements and components with `<Transition>`, animate lists with `<TransitionGroup>`, and integrate JavaScript hooks and third-party animation libraries.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Transitions and Animations

## Transitions and Animations

### Why It Matters

Animate enter/leave of elements and components with `<Transition>`, animate lists with `<TransitionGroup>`, and integrate JavaScript hooks and third-party animation libraries.

Animate enter/leave of elements and components with `<Transition>`, animate lists with `<TransitionGroup>`, and integrate JavaScript hooks and third-party animation libraries.

### Prerequisites

- Stage 6: v-if/v-show (Transitions wrap conditional content).
- Stage 7: v-for (TransitionGroup animates list items).
- Basic CSS transitions and keyframes.

### Topics

- `<Transition>` for single-element enter/leave
- CSS transition classes: `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`
- Custom transition names and `name="x"` prefix
- JavaScript hooks (`@before-enter`, `@enter`, `@after-enter`, etc.)
- `<TransitionGroup>` for list animations with `move` class
- Transition modes: `out-in` and `in-out` for swapping elements
- Animated route transitions with `<RouterView>` in `<Transition>`
- Integrating GSAP, Motion, or Animate.css

### Key Concepts

- `<Transition>` wraps a single element (or component) toggled by v-if/v-show
- Vue adds/removes CSS classes at the right phases; you define the transitions in CSS
- `<TransitionGroup>` renders a list (no wrapper element by default) and animates position changes via the `v-move` class
- `mode="out-in"` waits for the leave to finish before entering (good for swapping)
- JavaScript hooks let you use Web Animations API or libraries like GSAP for complex effects

```vue
<script setup lang="ts">
import { ref } from "vue";
const show = ref(true);
</script>

<template>
  <button @click="show = !show">Toggle</button>
  <Transition name="fade">
    <p v-if="show">Hello, I fade in and out.</p>
  </Transition>
</template>

<style>
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
</style>
```
Caption: Basic Transition with v-if

### Common Pitfalls

- Forgetting the `:key` on TransitionGroup items — without keys Vue cannot track identity, so `move` transitions break.
- Using `<Transition>` for a list — `<Transition>` is for ONE element; lists need `<TransitionGroup>`.
- Setting `:css="false"` but not calling `done()` in JS hooks — the transition never completes and the element gets stuck in the entering/leaving state.
- Animating with `position: absolute` on `.list-leave-active` but not compensating layout — the leaving item is removed from flow, causing the list to jump; the `move` class handles this if keys are stable.
- Using `mode="in-out"` by default — `out-in` is usually what you want (leave first, then enter), avoiding overlap.

### Real-World Applications

- GitLab animates dropdown menus, modals, and toasts with `<Transition>` and `out-in` mode for smooth swaps.
- Alibaba's Taobao product carousel uses `<TransitionGroup>` to animate reordering and pagination.
- Behance's lightbox uses JS hooks with GSAP for staggered image reveals.
- Adobe Portfolio animates section add/remove in the editor with `<TransitionGroup>` so layout shifts feel natural.

### Interview Questions

- 1. What's the difference between `<Transition>` and `<TransitionGroup>`? — Transition wraps ONE element toggled by v-if/v-show; TransitionGroup animates lists including add/remove/reorder via `move` classes.
- 2. What are the six CSS transition classes Vue applies? — `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to` (Vue 3 names; Vue 2 used `v-enter`/`v-leave-to`).
- 3. What does `mode="out-in"` do? — Waits for the leaving element to finish before entering the new one, preventing overlap (default mode allows both at once).
- 4. Why must you call `done()` in JS transition hooks when `:css="false"`? — Vue uses the callback to know when the animation finished; without it the transition never completes and the element stays in limbo.
- 5. How do TransitionGroup move transitions work? — Vue applies a `v-move` class during position changes (FLIP technique) so items smoothly animate to their new spots.

### Mini Project

Build a "Notification Stack" component: A `<TransitionGroup>` that adds and removes toast notifications with staggered enter/leave animations. Suggested approach:
  - Hold `notifications` in a Pinia store or local ref
  - Use `<TransitionGroup name="toast" tag="div">` to wrap them
  - Define CSS for `.toast-enter-from`, `.toast-enter-active`, `.toast-leave-to`, `.toast-leave-active`, and `.toast-move`
  - Auto-dismiss each notification after 4 seconds via `setTimeout` and `onScopeDispose` cleanup
  - Add a button to push a new notification

### Exercises

1. Wrap a v-if toggle in `<Transition>` with a fade CSS class.
2. Use `mode="out-in"` to swap between two components on a tab click.
3. Build a `<TransitionGroup>` list with shuffle and animate the `move` class.
4. Add JS hooks with `:css="false"` and use the Web Animations API.
5. Animate route transitions by wrapping `<RouterView>` in `<Transition>`.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which Vue component animates enter/leave of a single element?
9. A) <Transition> (*)
10. B) <Animation>
11. C) <Animate>
12. D) <Fade>
13. Explanation: `<Transition>` wraps a single element (or component) toggled by v-if/v-show; `<TransitionGroup>` animates lists.
14. Q2: Which is the Vue 3 enter-from class?
15. A) v-enter
16. B) v-enter-from (*)
17. C) v-enter-start
18. D) v-before-enter
19. Explanation: Vue 3 uses `v-enter-from` (Vue 2 used `v-enter`); the full set is `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`.
20. Q3: Which component animates a v-for list with add/remove/reorder?
21. A) <Transition>
22. B) <List>
23. C) <TransitionGroup> (*)
24. D) <v-list>
25. Explanation: `<TransitionGroup>` animates list items including position changes via the FLIP technique and a `v-move` class.
26. Q4: What does mode="out-in" do?
27. A) Runs enter and leave in parallel
28. B) Only enters, never leaves
29. C) Skips the leave animation
30. D) Waits for the leaving element to finish before entering the new one (*)
31. Explanation: `out-in` ensures the leave completes before the enter starts, preventing overlap; `in-out` is the opposite.
32. Q5: When using :css="false" with JS hooks, what must you call?
33. A) The `done` callback passed to the hook (*)
34. B) gsap.refresh()
35. C) nextTick()
36. D) cancelAnimation()
37. Explanation: When `:css="false"`, Vue relies on the `done` callback in `@enter`/`@leave` hooks to know the animation finished; without it the transition never completes.
38. Q6: Why is :key critical in <TransitionGroup>?
39. A) For CSS specificity
40. B) Vue needs stable identity to track each item across reorders for move animations (*)
41. C) It is not important
42. D) To satisfy ESLint
43. Explanation: Without a stable `:key`, Vue cannot track which item is which across reorders, so `move` (FLIP) animations break.
44. Q7: What does the v-move class enable in TransitionGroup?
45. A) Draggable items
46. B) Click-to-move
47. C) Smooth position change animation (FLIP) when items reorder (*)
48. D) Hover effects
49. Explanation: The `v-move` class is applied during position changes; Vue uses the FLIP technique to animate items to their new positions.
50. Q8: Why might `.list-leave-active { position: absolute; }` be needed?
51. A) To center the item
52. B) It's a CSS reset
53. C) To make it visible
54. D) To remove the leaving item from flow so siblings can animate to fill its spot (*)
55. Explanation: Setting `position: absolute` on the leaving item takes it out of flow so the remaining items can `move` smoothly into place.
56. Q9: How do you animate route transitions?
57. A) Wrap <RouterView> in <Transition> (*)
58. B) Pass a `transition` prop to RouterLink
59. C) You cannot
60. D) Use a v-if
61. Explanation: Wrap `<RouterView>` in `<Transition>` (often with `mode="out-in"`) so each route's component animates on enter/leave.
62. Q10: Which library is commonly used with Vue's JS transition hooks for complex effects?
63. A) Lodash
64. B) GSAP (*)
65. C) Moment
66. D) axios
67. Explanation: GSAP (GreenSock) is a popular animation library; Vue's JS hooks (`@enter`, `@leave` with `:css="false"`) integrate cleanly via the `done` callback.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which Vue component animates enter/leave of a single element?
  options:
    - <Transition>
    - <Animation>
    - <Animate>
    - <Fade>
  correctIndex: 0
  explanation: "`<Transition>` wraps a single element (or component) toggled by v-if/v-show; `<TransitionGroup>` animates lists."
- id: q2
  question: Which is the Vue 3 enter-from class?
  options:
    - v-enter
    - v-enter-from
    - v-enter-start
    - v-before-enter
  correctIndex: 1
  explanation: Vue 3 uses `v-enter-from` (Vue 2 used `v-enter`); the full set is `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`.
- id: q3
  question: Which component animates a v-for list with add/remove/reorder?
  options:
    - <Transition>
    - <List>
    - <TransitionGroup>
    - <v-list>
  correctIndex: 2
  explanation: "`<TransitionGroup>` animates list items including position changes via the FLIP technique and a `v-move` class."
- id: q4
  question: What does mode="out-in" do?
  options:
    - Runs enter and leave in parallel
    - Only enters, never leaves
    - Skips the leave animation
    - Waits for the leaving element to finish before entering the new one
  correctIndex: 3
  explanation: "`out-in` ensures the leave completes before the enter starts, preventing overlap; `in-out` is the opposite."
- id: q5
  question: When using :css="false" with JS hooks, what must you call?
  options:
    - The `done` callback passed to the hook
    - gsap.refresh()
    - nextTick()
    - cancelAnimation()
  correctIndex: 0
  explanation: When `:css="false"`, Vue relies on the `done` callback in `@enter`/`@leave` hooks to know the animation finished; without it the transition never completes.
- id: q6
  question: Why is :key critical in <TransitionGroup>?
  options:
    - For CSS specificity
    - Vue needs stable identity to track each item across reorders for move animations
    - It is not important
    - To satisfy ESLint
    - animations break.
  correctIndex: 1
  explanation: Without a stable `:key`, Vue cannot track which item is which across reorders, so `move` (FLIP) animations break.
- id: q7
  question: What does the v-move class enable in TransitionGroup?
  options:
    - Draggable items
    - Click-to-move
    - Smooth position change animation (FLIP) when items reorder
    - Hover effects
  correctIndex: 2
  explanation: The `v-move` class is applied during position changes; Vue uses the FLIP technique to animate items to their new positions.
- id: q8
  question: "Why might `.list-leave-active { position: absolute; }` be needed?"
  options:
    - To center the item
    - It's a CSS reset
    - To make it visible
    - To remove the leaving item from flow so siblings can animate to fill its spot
  correctIndex: 3
  explanation: "Setting `position: absolute` on the leaving item takes it out of flow so the remaining items can `move` smoothly into place."
- id: q9
  question: How do you animate route transitions?
  options:
    - Wrap <RouterView> in <Transition>
    - Pass a `transition` prop to RouterLink
    - You cannot
    - Use a v-if
  correctIndex: 0
  explanation: Wrap `<RouterView>` in `<Transition>` (often with `mode="out-in"`) so each route's component animates on enter/leave.
- id: q10
  question: Which library is commonly used with Vue's JS transition hooks for complex effects?
  options:
    - Lodash
    - GSAP
    - Moment
    - axios
  correctIndex: 1
  explanation: GSAP (GreenSock) is a popular animation library; Vue's JS hooks (`@enter`, `@leave` with `:css="false"`) integrate cleanly via the `done` callback.
```

