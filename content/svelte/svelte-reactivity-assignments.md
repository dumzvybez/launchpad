---
slug: svelte-reactivity-assignments
id: svelte-02
track: svelte
order: 2
title: Reactivity and Assignments
description: Master Svelte 5's rune-based reactivity ($state, $derived, $effect) and understand how it differs from Svelte 4's assignment-based reactivity.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=30s
whyItMatters: Master Svelte 5's rune-based reactivity ($state, $derived, $effect) and understand how it differs from Svelte 4's assignment-based reactivity.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Reactivity and Assignments

## Reactivity and Assignments

### Why It Matters

Master Svelte 5's rune-based reactivity ($state, $derived, $effect) and understand how it differs from Svelte 4's assignment-based reactivity.

Master Svelte 5's rune-based reactivity ($state, $derived, $effect) and understand how it differs from Svelte 4's assignment-based reactivity.

### Prerequisites

- Stage 1: Getting Started with Svelte
- Basic JavaScript/TypeScript variables, functions, and array methods.

### Topics

- $state: declaring reactive variables and objects
- $state.raw: opt-out of deep reactivity
- $derived: computed values that memoize
- $derived.by: derived from a function body
- $effect: side effects that re-run when dependencies change
- $effect.pre: runs before DOM updates
- $effect.root: escaping the component lifecycle
- Spread/push reactivity caveats in Svelte 4 vs Svelte 5

### Key Concepts

- Svelte 5 runes use signals under the hood for fine-grained updates
- $derived recomputes only when its dependencies change (memoized)
- $effect tracks dependencies automatically by reading them inside its body
- Mutating arrays (.push, .splice) triggers updates in Svelte 5 because the array is a proxy
- Svelte 4 required reassignment (`items = items`) to trigger updates — Svelte 5 does not

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
  let message = $derived(
    count === 0 ? "none yet" : `${count} (${doubled} doubled)`
  );
</script>

<button onclick={() => count++}>+1</button>
<p>{message}</p>
```
Caption: $state and $derived

### Common Pitfalls

- Treating $derived like a function call — $derived(expr) is evaluated once and re-run on dep change; calling it inside a function does not memoize.
- Forgetting that $effect re-runs whenever ANY tracked dep changes — reading a state inside an effect subscribes to it; guard with conditionals or untrack with `untrack`.
- Mutating a $state.raw object expecting reactivity — only reassignment triggers updates with .raw.
- Using $effect for derived data — prefer $derived; $effect is for side effects (subscriptions, DOM, fetches).
- Spread reactivity: `obj = { ...obj, key: value }` is safe in both; `Object.assign(obj, ...)` works in Svelte 5 (proxy) but not Svelte 4.

### Real-World Applications

- The New York Times election results page uses derived state to compute vote percentages from raw totals without re-running filters on every render.
- Apple Music's web player uses effects to subscribe to media session APIs and clean up on track change.
- Spotify's internal dashboards use $state arrays for live-updating metrics with reactive push.
- Chess.com's analysis board uses $state.raw for move-tree snapshots where deep tracking would be wasteful.

### Interview Questions

- 1. What's the difference between Svelte 4 and Svelte 5 reactivity? — Svelte 4 used assignment tracking via the compiler; Svelte 5 uses runes ($state/$derived/$effect) backed by signals for fine-grained updates.
- 2. When does $derived recompute? — Only when a dependency read inside its expression changes; otherwise it returns the cached value.
- 3. What's the cleanup pattern in $effect? — Return a function from the effect; it runs before the next re-run and on component destroy.
- 4. Why does `todos.push(x)` update the UI in Svelte 5 but not Svelte 4? — Svelte 5 wraps $state arrays in a proxy that intercepts mutation methods; Svelte 4 needed reassignment.
- 5. What's $state.raw for? — Opting out of deep reactivity: only reassigning the variable triggers updates, useful for large snapshots you replace wholesale.

### Mini Project

Build a Reactive Counter & Todo List: A Svelte 5 component with $state for a count and a todo array, $derived for a "done" count, and $effect to persist the list to localStorage. Demonstrate that pushing to the array updates the UI without reassignment. Suggested approach:
  - Use $state for `todos: { text: string; done: boolean }[]`
  - Add $derived `doneCount = todos.filter(t => t.done).length`
  - Use $effect to write todos to localStorage on every change
  - Initialize state from localStorage inside onMount
  - Add a "Mark all done" button that mutates todos in place

### Exercises

1. Build a counter with $state and $derived showing count, doubled, and squared.
2. Convert an array push pattern from Svelte 4 (reassign) to Svelte 5 (mutate the proxy).
3. Add an $effect that logs the count to the console whenever it changes; verify it doesn't log when unrelated state changes.
4. Use $state.raw for a config object and verify that direct mutation does NOT trigger UI updates.
5. Replace a Svelte 4 reactive `$: double = count * 2` with Svelte 5 `$derived`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which rune declares a reactive variable in Svelte 5?
9. A) $let
10. B) $state (*)
11. C) reactive()
12. D) $ref
13. Explanation: $state(value) declares a reactive variable; mutations to it are tracked via signals.
14. Q2: How do you compute a value from reactive state?
15. A) const x = compute(count)
16. B) const x = memo(count * 2)
17. C) const x = $derived(count * 2) (*)
18. D) const x = $effect(count * 2)
19. Explanation: $derived(expr) creates a memoized reactive value that recomputes only when dependencies change.
20. Q3: In Svelte 5, does `todos.push(item)` trigger a UI update?
21. A) No, you must reassign todos
22. B) Only inside $effect
23. C) Only in production builds
24. D) Yes, $state arrays are proxies that intercept mutation methods (*)
25. Explanation: Svelte 5 wraps $state arrays in a proxy so push/splice/sort trigger updates without reassignment.
26. Q4: What does $state.raw do?
27. A) Skips deep reactivity; only reassignment triggers updates (*)
28. B) Logs every change
29. C) Forces re-render every tick
30. D) Disables TypeScript checks
31. Explanation: $state.raw opts out of deep proxy tracking — useful for large immutable snapshots replaced wholesale.
32. Q5: What does $effect return for cleanup?
33. A) A promise
34. B) A function (*)
35. C) An observable
36. D) Nothing
37. Explanation: $effect's return value is a cleanup function invoked before the next re-run and on component destroy.
38. Q6: When does $derived recompute?
39. A) Every render
40. B) On a timer
41. C) Only when a tracked dependency changes (*)
42. D) Never after first run
43. Explanation: $derived reads dependencies during execution and recomputes only when those signals change.
44. Q7: In Svelte 4, what triggered reactivity for arrays?
45. A) push() automatically
46. B) Calling $refresh()
47. C) Using the each block
48. D) Reassigning the variable (e.g., `items = items`) (*)
49. Explanation: Svelte 4's compiler tracked assignments, so you had to reassign (`items = [...items, x]` or `items = items`) after mutating.
50. Q8: Which rune runs side effects and re-runs on dependency changes?
51. A) $effect (*)
52. B) $derived
53. C) $state
54. D) $inspect
55. Explanation: $effect(fn) runs fn, tracks dependencies, and re-runs when they change; return a cleanup function.
56. Q9: What's $effect.pre used for?
57. A) Pre-fetching data
58. B) Running effects before the DOM updates (*)
59. C) Disabling effects
60. D) Initializing state
61. Explanation: $effect.pre runs before Svelte flushes DOM updates, useful when you need to read layout then mutate before paint.
62. Q10: Why avoid $effect for derived data?
63. A) It's deprecated
64. B) It only runs once
65. C) It's slower than $derived and can cause infinite loops (*)
66. D) It can't read $state
67. Explanation: $effect is for side effects; using it for derived values bypasses memoization, risks infinite loops, and duplicates work.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which rune declares a reactive variable in Svelte 5?
  options:
    - $let
    - $state
    - reactive()
    - $ref
  correctIndex: 1
  explanation: $state(value) declares a reactive variable; mutations to it are tracked via signals.
- id: q2
  question: How do you compute a value from reactive state?
  options:
    - const x = compute(count)
    - const x = memo(count * 2)
    - const x = $derived(count * 2)
    - const x = $effect(count * 2)
  correctIndex: 2
  explanation: $derived(expr) creates a memoized reactive value that recomputes only when dependencies change.
- id: q3
  question: In Svelte 5, does `todos.push(item)` trigger a UI update?
  options:
    - No, you must reassign todos
    - Only inside $effect
    - Only in production builds
    - Yes, $state arrays are proxies that intercept mutation methods
  correctIndex: 3
  explanation: Svelte 5 wraps $state arrays in a proxy so push/splice/sort trigger updates without reassignment.
- id: q4
  question: What does $state.raw do?
  options:
    - Skips deep reactivity; only reassignment triggers updates
    - Logs every change
    - Forces re-render every tick
    - Disables TypeScript checks
  correctIndex: 0
  explanation: $state.raw opts out of deep proxy tracking — useful for large immutable snapshots replaced wholesale.
- id: q5
  question: What does $effect return for cleanup?
  options:
    - A promise
    - A function
    - An observable
    - Nothing
  correctIndex: 1
  explanation: $effect's return value is a cleanup function invoked before the next re-run and on component destroy.
- id: q6
  question: When does $derived recompute?
  options:
    - Every render
    - On a timer
    - Only when a tracked dependency changes
    - Never after first run
  correctIndex: 2
  explanation: $derived reads dependencies during execution and recomputes only when those signals change.
- id: q7
  question: In Svelte 4, what triggered reactivity for arrays?
  options:
    - push() automatically
    - Calling $refresh()
    - Using the each block
    - Reassigning the variable (e.g., `items = items`)
  correctIndex: 3
  explanation: Svelte 4's compiler tracked assignments, so you had to reassign (`items = [...items, x]` or `items = items`) after mutating.
- id: q8
  question: Which rune runs side effects and re-runs on dependency changes?
  options:
    - $effect
    - $derived
    - $state
    - $inspect
  correctIndex: 0
  explanation: $effect(fn) runs fn, tracks dependencies, and re-runs when they change; return a cleanup function.
- id: q9
  question: What's $effect.pre used for?
  options:
    - Pre-fetching data
    - Running effects before the DOM updates
    - Disabling effects
    - Initializing state
  correctIndex: 1
  explanation: $effect.pre runs before Svelte flushes DOM updates, useful when you need to read layout then mutate before paint.
- id: q10
  question: Why avoid $effect for derived data?
  options:
    - It's deprecated
    - It only runs once
    - It's slower than $derived and can cause infinite loops
    - It can't read $state
  correctIndex: 2
  explanation: $effect is for side effects; using it for derived values bypasses memoization, risks infinite loops, and duplicates work.
```

