---
slug: svelte-lifecycle-onmount-ondestroy-tick
id: svelte-08
track: svelte
order: 8
title: Lifecycle — onMount, onDestroy, tick
description: Use Svelte's lifecycle functions (onMount, onDestroy, beforeUpdate, afterUpdate, tick) to run code at the right time, and understand how $effect replaces some of them in runes mode.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=210s
whyItMatters: Use Svelte's lifecycle functions (onMount, onDestroy, beforeUpdate, afterUpdate, tick) to run code at the right time, and understand how $effect replaces some of them in runes mode.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Lifecycle — onMount, onDestroy, tick

## Lifecycle — onMount, onDestroy, tick

### Why It Matters

Use Svelte's lifecycle functions (onMount, onDestroy, beforeUpdate, afterUpdate, tick) to run code at the right time, and understand how $effect replaces some of them in runes mode.

Use Svelte's lifecycle functions (onMount, onDestroy, beforeUpdate, afterUpdate, tick) to run code at the right time, and understand how $effect replaces some of them in runes mode.

### Prerequisites

- Stage 2: Reactivity and Assignments
- Stage 5: Event Handlers
- Understanding of side effects and cleanup.

### Topics

- onMount: run after first render
- onDestroy: cleanup before unmount
- beforeUpdate / afterUpdate (legacy)
- tick(): wait for DOM updates to flush
- $effect as the runes-mode replacement for afterUpdate/beforeUpdate
- $effect.pre for before-paint side effects
- Lifecycle ordering and nesting
- Common patterns: subscriptions, timers, IntersectionObserver

### Key Concepts

- onMount runs once after the component is first rendered to the DOM
- onDestroy runs before the component is removed (cleanup)
- tick() returns a promise that resolves when DOM updates are flushed
- $effect replaces many beforeUpdate/afterUpdate uses in runes mode
- $effect.pre runs before DOM updates (replaces beforeUpdate for most cases)
- Lifecycle functions must be called synchronously during component init (or inside $effect)

```svelte
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let width = $state(window.innerWidth);
  let onResize: () => void;

  onMount(() => {
    onResize = () => (width = window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize); // also cleanup
  });

  // Explicit onDestroy is also valid (alternative to onMount return)
  onDestroy(() => console.log("cleaned up"));
</script>

<p>Window: {width}px</p>
```
Caption: onMount and onDestroy with a subscription

### Common Pitfalls

- Calling onMount inside an async function or $effect — lifecycle hooks must be called synchronously during component init.
- Forgetting to clean up subscriptions in onMount's return or onDestroy — leads to memory leaks and stale updates after unmount.
- Using beforeUpdate/afterUpdate in runes mode — prefer $effect / $effect.pre; the legacy hooks fire even when nothing relevant changed.
- Calling tick() expecting a microtask — tick() resolves when Svelte flushes pending updates, which may be later than a plain `await Promise.resolve()`.
- Adding event listeners in $effect without cleanup — return the cleanup function from $effect so listeners are removed before next run + on destroy.

### Real-World Applications

- The New York Times' lazy image loader uses onMount to set up an IntersectionObserver and disconnect on destroy.
- Apple Music's web player uses onMount to subscribe to the media session API and onDestroy to release the audio context.
- Spotify's internal dashboards use tick() before measuring chart heights so the DOM reflects the latest data.
- Chess.com's analysis board uses $effect to re-derive highlight overlays when the move tree changes.

### Interview Questions

- 1. When does onMount run? — Once, after the component's first DOM render; return a function for cleanup.
- 2. What's tick() for? — It returns a promise that resolves after Svelte flushes pending DOM updates, useful for reading post-update layout.
- 3. How does $effect differ from afterUpdate? — $effect tracks specific dependencies and only re-runs when they change; afterUpdate fires after any update.
- 4. When does onDestroy run? — Before the component is removed from the DOM; use it (or return from onMount) to clean up.
- 5. Can you call onMount inside $effect? — No — lifecycle functions must be called synchronously during component initialization, not inside effects.

### Mini Project

Build an Infinite Scroll Feed: A page that loads more items when the user scrolls near the bottom. Use onMount to set up an IntersectionObserver on a sentinel <div>, tick() to scroll to the new content, and onDestroy to disconnect the observer. Suggested approach:
  - Use $state for `items: string[]` and `loading: boolean`
  - Add a sentinel `<div bind:this={sentinel}>` at the bottom
  - In onMount, observe the sentinel and call `loadMore()` when intersecting
  - Use tick() before adjusting scroll position if needed
  - Return the disconnect function from onMount for cleanup

### Exercises

1. Use onMount to log "mounted" once and return a cleanup that logs "unmounted".
2. Build a clock that updates every second using onMount + setInterval; clean up on destroy.
3. Use tick() to scroll a list to the bottom after pushing an item.
4. Replace an afterUpdate block with an $effect that tracks the specific dependency.
5. Add an IntersectionObserver to fade in an element when it scrolls into view.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When does onMount run?
9. A) Before the first render
10. B) On every state change
11. C) Only in Svelte 4
12. D) Once, after the first DOM render (*)
13. Explanation: onMount runs after the component's first render to the DOM; return a function for cleanup on unmount.
14. Q2: What does tick() return?
15. A) A promise that resolves when DOM updates are flushed (*)
16. B) A boolean
17. C) The current DOM
18. D) A microtask ID
19. Explanation: tick() returns a Promise that resolves once Svelte has flushed pending DOM updates, so you can read post-update layout.
20. Q3: Which lifecycle runs before the component is removed?
21. A) onMount
22. B) onDestroy (*)
23. C) beforeUpdate
24. D) afterUpdate
25. Explanation: onDestroy runs just before the component is removed from the DOM; use it (or return from onMount) for cleanup.
26. Q4: What's the runes-mode replacement for afterUpdate?
27. A) $state
28. B) $derived
29. C) $effect (*)
30. D) $inspect
31. Explanation: $effect tracks dependencies and runs after mount and on dep changes; it replaces most afterUpdate uses with finer-grained control.
32. Q5: How do you clean up inside onMount?
33. A) Throw an error
34. B) Call onDestroy separately
35. C) You can't
36. D) Return a cleanup function (*)
37. Explanation: onMount's return value (if a function) is treated as cleanup, called on unmount — equivalent to a separate onDestroy.
38. Q6: Where must lifecycle functions be called?
39. A) Synchronously during component initialization (*)
40. B) Anywhere
41. C) Inside $effect only
42. D) Inside event handlers
43. Explanation: onMount/onDestroy etc. must be called synchronously during component init, not inside async functions or effects.
44. Q7: What does $effect.pre do?
45. A) Pre-fetches data
46. B) Runs before DOM updates flush (*)
47. C) Precompiles the component
48. D) Disables effects
49. Explanation: $effect.pre runs before Svelte flushes DOM updates — useful when you need to read layout and mutate before paint.
50. Q8: What's a common cleanup mistake?
51. A) Returning a function from onMount (this is correct)
52. B) Using tick() too often
53. C) Forgetting to remove event listeners / disconnect observers (*)
54. D) Calling onDestroy twice
55. Explanation: Forgetting cleanup leaks listeners and observers, which keep firing after unmount and cause stale updates or memory growth.
56. Q9: Which is true about beforeUpdate/afterUpdate in runes mode?
57. A) They're removed
58. B) They're required
59. C) They're renamed to $before/$after
60. D) They still work but $effect / $effect.pre are preferred (*)
61. Explanation: The legacy hooks still work in runes mode, but $effect (which only re-runs on dep change) is preferred for finer-grained control.
62. Q10: When does onMount's return function run?
63. A) Once, on component unmount (*)
64. B) On every state change
65. C) After every render
66. D) Before the first render
67. Explanation: The function returned from onMount is the cleanup callback; Svelte invokes it once when the component is destroyed.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When does onMount run?
  options:
    - Before the first render
    - On every state change
    - Only in Svelte 4
    - Once, after the first DOM render
  correctIndex: 3
  explanation: onMount runs after the component's first render to the DOM; return a function for cleanup on unmount.
- id: q2
  question: What does tick() return?
  options:
    - A promise that resolves when DOM updates are flushed
    - A boolean
    - The current DOM
    - A microtask ID
  correctIndex: 0
  explanation: tick() returns a Promise that resolves once Svelte has flushed pending DOM updates, so you can read post-update layout.
- id: q3
  question: Which lifecycle runs before the component is removed?
  options:
    - onMount
    - onDestroy
    - beforeUpdate
    - afterUpdate
  correctIndex: 1
  explanation: onDestroy runs just before the component is removed from the DOM; use it (or return from onMount) for cleanup.
- id: q4
  question: What's the runes-mode replacement for afterUpdate?
  options:
    - $state
    - $derived
    - $effect
    - $inspect
  correctIndex: 2
  explanation: $effect tracks dependencies and runs after mount and on dep changes; it replaces most afterUpdate uses with finer-grained control.
- id: q5
  question: How do you clean up inside onMount?
  options:
    - Throw an error
    - Call onDestroy separately
    - You can't
    - Return a cleanup function
  correctIndex: 3
  explanation: onMount's return value (if a function) is treated as cleanup, called on unmount — equivalent to a separate onDestroy.
- id: q6
  question: Where must lifecycle functions be called?
  options:
    - Synchronously during component initialization
    - Anywhere
    - Inside $effect only
    - Inside event handlers
  correctIndex: 0
  explanation: onMount/onDestroy etc. must be called synchronously during component init, not inside async functions or effects.
- id: q7
  question: What does $effect.pre do?
  options:
    - Pre-fetches data
    - Runs before DOM updates flush
    - Precompiles the component
    - Disables effects
  correctIndex: 1
  explanation: $effect.pre runs before Svelte flushes DOM updates — useful when you need to read layout and mutate before paint.
- id: q8
  question: What's a common cleanup mistake?
  options:
    - Returning a function from onMount (this is correct)
    - Using tick() too often
    - Forgetting to remove event listeners / disconnect observers
    - Calling onDestroy twice
  correctIndex: 2
  explanation: Forgetting cleanup leaks listeners and observers, which keep firing after unmount and cause stale updates or memory growth.
- id: q9
  question: Which is true about beforeUpdate/afterUpdate in runes mode?
  options:
    - They're removed
    - They're required
    - They're renamed to $before/$after
    - They still work but $effect / $effect.pre are preferred
  correctIndex: 3
  explanation: The legacy hooks still work in runes mode, but $effect (which only re-runs on dep change) is preferred for finer-grained control.
- id: q10
  question: When does onMount's return function run?
  options:
    - Once, on component unmount
    - On every state change
    - After every render
    - Before the first render
  correctIndex: 0
  explanation: The function returned from onMount is the cleanup callback; Svelte invokes it once when the component is destroyed.
```

