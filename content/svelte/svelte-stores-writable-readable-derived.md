---
slug: svelte-stores-writable-readable-derived
id: svelte-09
track: svelte
order: 9
title: Stores — Writable, Readable, Derived
description: Use Svelte stores for cross-component state, understand the store contract (subscribe + set/update), and choose between stores, $state, and context for your state needs.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=240s
whyItMatters: Use Svelte stores for cross-component state, understand the store contract (subscribe + set/update), and choose between stores, $state, and context for your state needs.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Stores — Writable, Readable, Derived

## Stores — Writable, Readable, Derived

### Why It Matters

Use Svelte stores for cross-component state, understand the store contract (subscribe + set/update), and choose between stores, $state, and context for your state needs.

Use Svelte stores for cross-component state, understand the store contract (subscribe + set/update), and choose between stores, $state, and context for your state needs.

### Prerequisites

- Stage 2: Reactivity and Assignments
- Stage 8: Lifecycle
- Basic understanding of observables/subscriptions.

### Topics

- The store contract: subscribe + (optionally) set/update
- writable(initial, start?)
- readable(initial, start)
- derived(stores, fn)
- Auto-subscription with $ prefix in markup
- get(store) for one-shot reads outside components
- store.bind (bindable stores)
- When to use a store vs $state vs context

### Key Concepts

- Any object with a `subscribe(fn)` returning an unsubscribe function is a store
- `$store` in markup auto-subscribes and unsubscribes on component destroy
- writable exposes set/update; readable is for read-only external sources (timers, sensors)
- derived computes from one or more stores, recomputing on dep change
- Stores still work in Svelte 5 runes mode — use $store in markup or get(store) in script

```ts
// stores/counter.ts
import { writable } from "svelte/store";

export const counter = writable(0);

export function increment() {
  counter.update((n) => n + 1);
}

export function reset() {
  counter.set(0);
}
```
Caption: Writable store

### Common Pitfalls

- Forgetting to unsubscribe when reading outside markup — use `get(store)` for one-shot reads (subscribes + unsubscribes synchronously); for ongoing reads, call `subscribe` and clean up.
- Subscribing in onMount and forgetting to clean up — always return the unsubscribe function from onMount; the `$store` auto-syntax handles this for you.
- Overusing stores for local component state — use $state for component-local state; stores are for cross-component or global state.
- Mutating a store value with `.push()` and expecting updates — stores don't proxy; call `store.update(arr => [...arr, x])` to emit a new value.
- Deriving a store from another store synchronously but missing the async overload — derived supports a third arg `{ initial }` and async derivation; consult docs for promise-returning fns.

### Real-World Applications

- The New York Times uses derived stores to compute election totals from per-state result stores.
- Apple Music's web player uses a writable store for the current playback queue shared across player, queue, and mini-player components.
- Rakuten uses a persistent cart store backed by localStorage so carts survive reloads.
- Chess.com uses a custom move-tree store that exposes typed set/update methods and persists to indexedDB.

### Interview Questions

- 1. What's the Svelte store contract? — An object with a `subscribe(fn)` method returning an unsubscribe function; optionally `set` and `update` for writable.
- 2. What does `$store` do in markup? — Auto-subscribes when the component mounts and unsubscribes on destroy; reads the current value.
- 3. When do you use readable vs writable? — readable for external read-only sources (timers, sensors); writable when you need set/update.
- 4. How does derived work with multiple stores? — Pass an array: `derived([a, b], ([$a, $b]) => ...)`, recomputes when any input changes.
- 5. When should you NOT use a store? — For component-local state, use $state; for parent-child, use $props or context API.

### Mini Project

Build a Persistent Theme Store: A `theme.ts` exporting a writable store for "light" | "dark" that reads/writes localStorage and applies a `data-theme` attribute to <html>. Build a ThemeToggle.svelte that uses $theme and a derived `isDark` store. Suggested approach:
  - Create `theme.ts` with a custom store wrapping writable
  - In the start function, read localStorage and default to system preference
  - On set, write localStorage and update document.documentElement.dataset.theme
  - Export derived `isDark = derived(theme, t => t === "dark")`
  - Build ThemeToggle.svelte using $theme and $isDark

### Exercises

1. Build a writable counter store with increment/decrement/reset helpers.
2. Convert it to a persistent store that saves to localStorage.
3. Add a derived store for "isEven".
4. Use `get(store)` to read the current value inside a plain function.
5. Build a readable store that emits the current time every second.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the Svelte store contract?
9. A) An object with a `subscribe(fn)` method returning an unsubscribe function (*)
10. B) Any object with a `get` method
11. C) An EventEmitter
12. D) A Promise
13. Explanation: A store is any object with `subscribe(fn): () => void`; writable stores also expose set/update. The auto-subscription syntax relies on this contract.
14. Q2: What does `$store` do in markup?
15. A) Calls the store as a function
16. B) Auto-subscribes on mount, unsubscribes on destroy, reads current value (*)
17. C) Freezes the store
18. D) Renders the store as text
19. Explanation: The `$store` prefix in markup subscribes (returning current value) and tears down on unmount — boilerplate-free reactive reads.
20. Q3: Which store type is best for an external read-only source (timer, sensor)?
21. A) writable
22. B) derived
23. C) readable (*)
24. D) get
25. Explanation: readable(initial, start) is for read-only sources; the start function sets up the subscription and returns cleanup.
26. Q4: How do you derive from multiple stores?
27. A) derived(a, b, fn)
28. B) merge(a, b, fn)
29. C) combine(a, b, fn)
30. D) derived([a, b], ([$a, $b]) => ...) (*)
31. Explanation: Pass an array of stores and a function that receives the array of current values: `derived([a, b], ([$a, $b]) => ...)`.
32. Q5: How do you read a store value outside markup (one-shot)?
33. A) get(store) (*)
34. B) store.value
35. C) read(store)
36. D) $store (only works in markup)
37. Explanation: `import { get } from "svelte/store"; const v = get(store);` subscribes, reads, and unsubscribes synchronously.
38. Q6: Which is a common store subscription leak?
39. A) Using $store in markup
40. B) Calling subscribe in onMount without returning the unsubscribe (*)
41. C) Using get(store) too often
42. D) Using derived
43. Explanation: Manually subscribing in onMount and not returning unsubscribe leaves the subscription alive after unmount, causing stale updates and leaks.
44. Q7: Does `store.update(arr => arr.push(x))` trigger updates?
45. A) Yes
46. B) Only in Svelte 5
47. C) No — push returns the new length, not the array; use `arr => [...arr, x]` (*)
48. D) Only with writable
49. Explanation: update expects you to return the new value; `arr.push(x)` returns a number, not the array. Use `arr => [...arr, x]` or mutate-and-return.
50. Q8: When should you prefer $state over a store?
51. A) Never
52. B) For global state
53. C) For server state
54. D) For component-local state (*)
55. Explanation: $state is for component-local reactive state; stores are for cross-component or global state shared via imports.
56. Q9: Can a store be async (return a promise from set)?
57. A) No — stores are synchronous; use derived with the async overload for promise-returning fns (*)
58. B) Yes, set can be async
59. C) Only readable stores
60. D) Only in Svelte 4
61. Explanation: Stores themselves are sync; for async derived computations, use `derived(store, (val, set) => { fetch(...).then(set) }, initial)`.
62. Q10: What does writable's second argument (start) do?
63. A) Sets the initial value
64. B) Receives `set` and runs when the first subscriber attaches; returns cleanup (*)
65. C) Resets the store
66. D) Validates the value
67. Explanation: `writable(initial, start)` calls `start(set)` when the first subscriber attaches and uses its return value as cleanup when the last unsubscribes — useful for lazy subscriptions.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the Svelte store contract?
  options:
    - An object with a `subscribe(fn)` method returning an unsubscribe function
    - Any object with a `get` method
    - An EventEmitter
    - A Promise
  correctIndex: 0
  explanation: "A store is any object with `subscribe(fn): () => void`; writable stores also expose set/update. The auto-subscription syntax relies on this contract."
- id: q2
  question: What does `$store` do in markup?
  options:
    - Calls the store as a function
    - Auto-subscribes on mount, unsubscribes on destroy, reads current value
    - Freezes the store
    - Renders the store as text
  correctIndex: 1
  explanation: The `$store` prefix in markup subscribes (returning current value) and tears down on unmount — boilerplate-free reactive reads.
- id: q3
  question: Which store type is best for an external read-only source (timer, sensor)?
  options:
    - writable
    - derived
    - readable
    - get
  correctIndex: 2
  explanation: readable(initial, start) is for read-only sources; the start function sets up the subscription and returns cleanup.
- id: q4
  question: How do you derive from multiple stores?
  options:
    - derived(a, b, fn)
    - merge(a, b, fn)
    - combine(a, b, fn)
    - derived([a, b], ([$a, $b]) => ...)
  correctIndex: 3
  explanation: "Pass an array of stores and a function that receives the array of current values: `derived([a, b], ([$a, $b]) => ...)`."
- id: q5
  question: How do you read a store value outside markup (one-shot)?
  options:
    - get(store)
    - store.value
    - read(store)
    - $store (only works in markup)
  correctIndex: 0
  explanation: '`import { get } from "svelte/store"; const v = get(store);` subscribes, reads, and unsubscribes synchronously.'
- id: q6
  question: Which is a common store subscription leak?
  options:
    - Using $store in markup
    - Calling subscribe in onMount without returning the unsubscribe
    - Using get(store) too often
    - Using derived
  correctIndex: 1
  explanation: Manually subscribing in onMount and not returning unsubscribe leaves the subscription alive after unmount, causing stale updates and leaks.
- id: q7
  question: Does `store.update(arr => arr.push(x))` trigger updates?
  options:
    - Yes
    - Only in Svelte 5
    - No — push returns the new length, not the array; use `arr => [...arr, x]`
    - Only with writable
  correctIndex: 2
  explanation: update expects you to return the new value; `arr.push(x)` returns a number, not the array. Use `arr => [...arr, x]` or mutate-and-return.
- id: q8
  question: When should you prefer $state over a store?
  options:
    - Never
    - For global state
    - For server state
    - For component-local state
  correctIndex: 3
  explanation: $state is for component-local reactive state; stores are for cross-component or global state shared via imports.
- id: q9
  question: Can a store be async (return a promise from set)?
  options:
    - No — stores are synchronous; use derived with the async overload for promise-returning fns
    - Yes, set can be async
    - Only readable stores
    - Only in Svelte 4
  correctIndex: 0
  explanation: Stores themselves are sync; for async derived computations, use `derived(store, (val, set) => { fetch(...).then(set) }, initial)`.
- id: q10
  question: What does writable's second argument (start) do?
  options:
    - Sets the initial value
    - Receives `set` and runs when the first subscriber attaches; returns cleanup
    - Resets the store
    - Validates the value
  correctIndex: 1
  explanation: "`writable(initial, start)` calls `start(set)` when the first subscriber attaches and uses its return value as cleanup when the last unsubscribes — useful for lazy subscriptions."
```

