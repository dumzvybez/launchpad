---
slug: vue-lifecycle-hooks
id: vue-13
track: vue
order: 13
title: Lifecycle Hooks
description: Hook into every stage of a component's life — setup, mount, update, unmount — and learn when to use onMounted, onUpdated, onUnmounted, and the new onScopeDispose.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=120s
whyItMatters: Hook into every stage of a component's life — setup, mount, update, unmount — and learn when to use onMounted, onUpdated, onUnmounted, and the new onScopeDispose.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Lifecycle Hooks

## Lifecycle Hooks

### Why It Matters

Hook into every stage of a component's life — setup, mount, update, unmount — and learn when to use onMounted, onUpdated, onUnmounted, and the new onScopeDispose.

Hook into every stage of a component's life — setup, mount, update, unmount — and learn when to use onMounted, onUpdated, onUnmounted, and the new onScopeDispose.

### Prerequisites

- Stage 2: Reactivity (refs and reactive).
- Stage 10: Components and Props.
- Familiarity with the concept of side effects.

### Topics

- The Composition API lifecycle: `onBeforeMount`, `onMounted`, `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, `onUnmounted`
- `onErrorCaptured` for error boundaries
- `onActivated` / `onDeactivated` with `<KeepAlive>`
- `onScopeDispose` for effect/scope cleanup
- The lifecycle order during setup, mount, update, unmount
- Comparison with Vue 2 hooks (created/mounted/destroyed -> onBeforeMount/onMounted/onUnmounted)
- Common patterns: fetch in onMounted, cleanup in onUnmounted, debounce in watch
- Server-side rendering: which hooks run on the server (only setup + onServerPrefetch)

### Key Concepts

- `<script setup>` runs as part of setup; equivalent to beforeCreate/created in Options API
- `onMounted` is the right place for DOM access (refs are populated) and initial fetches
- `onUnmounted` is the right place for cleanup (timers, listeners, subscriptions)
- `onUpdated` fires after every reactive update; avoid mutating state inside it (infinite loop)
- `onErrorCaptured` lets a parent component catch errors from descendants — Vue's error boundary

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, onUpdated } from "vue";

const el = ref<HTMLElement | null>(null);
const width = ref(0);

onMounted(() => {
  // DOM is ready; refs are populated
  width.value = el.value?.offsetWidth ?? 0;
  window.addEventListener("resize", updateWidth);
});

onUpdated(() => {
  console.log("Component re-rendered at", new Date().toISOString());
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

function updateWidth() {
  width.value = el.value?.offsetWidth ?? 0;
}
</script>

<template>
  <div ref="el">Width: {{ width }}px</div>
</template>
```
Caption: The main hooks

### Common Pitfalls

- Forgetting cleanup in `onUnmounted` — event listeners, timers, and subscriptions leak and cause memory leaks; always pair setup with teardown.
- Mutating state inside `onUpdated` — causes an infinite update loop; use a `watch` with a guard or compute a derived value instead.
- Using `onMounted` for SSR — `onMounted` does NOT run on the server; use `onServerPrefetch` for server-only fetches.
- Expecting refs to be populated in setup — refs are still null until `onMounted`; only access DOM via refs inside `onMounted` or with `nextTick`.
- Calling hooks conditionally — hooks must be called synchronously in setup, not inside if statements or async callbacks.

### Real-World Applications

- GitLab's IDE-like editor uses onMounted to initialize Monaco Editor and onUnmounted to dispose the editor instance and free memory.
- Alibaba's product pages use onMounted to start in-view lazy loading observers and onUnmounted to disconnect them.
- Behance's image carousel uses onActivated/onDeactivated with KeepAlive to pause autoplay when the tab is hidden.
- Adobe Portfolio's editor uses onErrorCaptured to show friendly fallbacks when a buggy section component throws.

### Interview Questions

- 1. What's the Vue 3 equivalent of `created` in Options API? — In `<script setup>`, the body of setup IS equivalent to beforeCreate + created; there's no explicit hook needed.
- 2. When is `onMounted` the right place to fetch data? — When the fetch is client-side only and you need the DOM (or just need to defer until after first paint); for SSR use `onServerPrefetch`.
- 3. Why must you clean up in `onUnmounted`? — To remove listeners, timers, and subscriptions; otherwise they persist after the component is gone, causing memory leaks and stale callbacks.
- 4. What does `onErrorCaptured` do? — Catches errors from descendant components (render, lifecycle, setup) — Vue's error boundary mechanism.
- 5. What's the difference between `onUnmounted` and `onDeactivated`? — `onUnmounted` fires when the component is destroyed; `onDeactivated` fires when a `<KeepAlive>` child is cached (deactivated but not destroyed).

### Mini Project

Build a "Live Clock" composable + component: A `useClock()` composable that ticks every second and cleans up on unmount; a `Clock.vue` that displays the time and updates the document title with the time while mounted. Suggested approach:
  - In `useClock()`, use `setInterval(() => time.value = new Date(), 1000)` and `onScopeDispose(() => clearInterval(id))`
  - Return `{ time }` from the composable
  - In `Clock.vue`, call `useClock()`, render `time.toLocaleTimeString()` in a `<p>`
  - Add `onMounted`/`onUnmounted` to update `document.title` with the time (clear in unmount)
  - Wrap multiple `<Clock />` in `<KeepAlive>` and verify `onActivated`/`onDeactivated` fire

### Exercises

1. Add `onMounted` and `onUnmounted` to a component and log to verify they fire in order.
2. Use `onErrorCaptured` in a parent to catch a thrown error in a child's setup.
3. Build a `useEventListener` composable that registers a listener and auto-removes it via `onScopeDispose`.
4. Use `<KeepAlive>` to cache a tab and verify `onActivated`/`onDeactivated` fire on tab switch.
5. Add `onUpdated` and observe when it fires after a state change; then mutate state inside it to trigger an infinite loop warning.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which hook runs after the component's DOM is mounted?
9. A) onMounted (*)
10. B) onBeforeMount
11. C) onUpdated
12. D) onUnmounted
13. Explanation: `onMounted` runs after the component's DOM has been inserted; refs are populated and safe to access here.
14. Q2: What's the Vue 3 equivalent of the Vue 2 `created` hook?
15. A) onCreated
16. B) The body of <script setup> (setup itself) (*)
17. C) onBeforeMount
18. D) onSetup
19. Explanation: In `<script setup>`, the setup body replaces beforeCreate + created; there's no separate `onCreated` hook.
20. Q3: Where should you clean up event listeners and timers?
21. A) onUpdated
22. B) onBeforeUpdate
23. C) onUnmounted (*)
24. D) Nowhere — Vue cleans up automatically
25. Explanation: `onUnmounted` is the right place to remove listeners, clear intervals, and dispose subscriptions to avoid leaks.
26. Q4: Why is mutating state inside onUpdated dangerous?
27. A) It is slower
28. B) Vue disables it
29. C) It only runs in dev
30. D) It can cause an infinite update loop (*)
31. Explanation: Mutating state inside `onUpdated` triggers another update, which fires `onUpdated` again — an infinite loop. Use a `watch` with a guard instead.
32. Q5: Which hook is the Vue 3 error boundary mechanism?
33. A) onErrorCaptured (*)
34. B) onError
35. C) onCatch
36. D) onBoundaryError
37. Explanation: `onErrorCaptured` catches errors from descendant components (in render, lifecycle, or setup) — Vue's error boundary.
38. Q6: When does onActivated fire?
39. A) On first mount only
40. B) When a <KeepAlive> child is re-activated from cache (*)
41. C) On every update
42. D) On error
43. Explanation: `onActivated` fires when a `<KeepAlive>` child is re-activated (cache hit); `onMounted` still fires only once on first mount.
44. Q7: Does onMounted run during server-side rendering?
45. A) Yes
46. B) Only in production
47. C) No — use onServerPrefetch for server-side data fetching (*)
48. D) Only with Nuxt
49. Explanation: `onMounted` does NOT run on the server (no DOM); use `onServerPrefetch` for server-only fetches during SSR.
50. Q8: What does onScopeDispose do?
51. A) Disposes a component
52. B) Cancels a watch
53. C) Resets refs
54. D) Registers a cleanup function that runs when the current effect scope is disposed (component or effect scope) (*)
55. Explanation: `onScopeDispose(fn)` runs `fn` when the current scope (a component's setup scope or an `effectScope`) is disposed — useful for reusable composables.
56. Q9: When can you safely access a template ref's DOM element?
57. A) Only in onMounted (or later, or after nextTick) (*)
58. B) In setup synchronously
59. C) Never
60. D) In onBeforeMount
61. Explanation: Template refs are null in setup and onBeforeMount; they're populated only after `onMounted` (or after `await nextTick()`).
62. Q10: Why must lifecycle hooks be called synchronously in setup?
63. A) For performance
64. B) Vue registers them during setup; calling them in async callbacks or conditionally breaks the registration (*)
65. C) It is just a convention
66. D) Hooks are async
67. Explanation: Vue captures hooks via the current instance during setup; calling them after an `await` or inside an `if` detaches them from the component, causing them to silently fail.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which hook runs after the component's DOM is mounted?
  options:
    - onMounted
    - onBeforeMount
    - onUpdated
    - onUnmounted
  correctIndex: 0
  explanation: "`onMounted` runs after the component's DOM has been inserted; refs are populated and safe to access here."
- id: q2
  question: What's the Vue 3 equivalent of the Vue 2 `created` hook?
  options:
    - onCreated
    - The body of <script setup> (setup itself)
    - onBeforeMount
    - onSetup
  correctIndex: 1
  explanation: In `<script setup>`, the setup body replaces beforeCreate + created; there's no separate `onCreated` hook.
- id: q3
  question: Where should you clean up event listeners and timers?
  options:
    - onUpdated
    - onBeforeUpdate
    - onUnmounted
    - Nowhere — Vue cleans up automatically
  correctIndex: 2
  explanation: "`onUnmounted` is the right place to remove listeners, clear intervals, and dispose subscriptions to avoid leaks."
- id: q4
  question: Why is mutating state inside onUpdated dangerous?
  options:
    - It is slower
    - Vue disables it
    - It only runs in dev
    - It can cause an infinite update loop
  correctIndex: 3
  explanation: Mutating state inside `onUpdated` triggers another update, which fires `onUpdated` again — an infinite loop. Use a `watch` with a guard instead.
- id: q5
  question: Which hook is the Vue 3 error boundary mechanism?
  options:
    - onErrorCaptured
    - onError
    - onCatch
    - onBoundaryError
  correctIndex: 0
  explanation: "`onErrorCaptured` catches errors from descendant components (in render, lifecycle, or setup) — Vue's error boundary."
- id: q6
  question: When does onActivated fire?
  options:
    - On first mount only
    - When a <KeepAlive> child is re-activated from cache
    - On every update
    - On error
  correctIndex: 1
  explanation: "`onActivated` fires when a `<KeepAlive>` child is re-activated (cache hit); `onMounted` still fires only once on first mount."
- id: q7
  question: Does onMounted run during server-side rendering?
  options:
    - Yes
    - Only in production
    - No — use onServerPrefetch for server-side data fetching
    - Only with Nuxt
    - ; use `onServerPrefetch` for server-only fetches during SSR.
  correctIndex: 2
  explanation: "`onMounted` does NOT run on the server (no DOM); use `onServerPrefetch` for server-only fetches during SSR."
- id: q8
  question: What does onScopeDispose do?
  options:
    - Disposes a component
    - Cancels a watch
    - Resets refs
    - Registers a cleanup function that runs when the current effect scope is disposed (component or effect scope)
  correctIndex: 3
  explanation: "`onScopeDispose(fn)` runs `fn` when the current scope (a component's setup scope or an `effectScope`) is disposed — useful for reusable composables."
- id: q9
  question: When can you safely access a template ref's DOM element?
  options:
    - Only in onMounted (or later, or after nextTick)
    - In setup synchronously
    - Never
    - In onBeforeMount
  correctIndex: 0
  explanation: Template refs are null in setup and onBeforeMount; they're populated only after `onMounted` (or after `await nextTick()`).
- id: q10
  question: Why must lifecycle hooks be called synchronously in setup?
  options:
    - For performance
    - Vue registers them during setup; calling them in async callbacks or conditionally breaks the registration
    - It is just a convention
    - Hooks are async
  correctIndex: 1
  explanation: Vue captures hooks via the current instance during setup; calling them after an `await` or inside an `if` detaches them from the component, causing them to silently fail.
```

