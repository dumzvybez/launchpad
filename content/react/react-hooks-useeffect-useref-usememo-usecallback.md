---
slug: react-hooks-useeffect-useref-usememo-usecallback
id: react-08
track: react
order: 8
title: Hooks — useEffect, useRef, useMemo, useCallback
description: "Master the four most-used hooks beyond `useState`: `useEffect` for side effects, `useRef` for mutable values and DOM handles, and `useMemo`/`useCallback` for selective memoization."
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=420s
whyItMatters: "Master the four most-used hooks beyond `useState`: `useEffect` for side effects, `useRef` for mutable values and DOM handles, and `useMemo`/`useCallback` for selective memoization."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Hooks — useEffect, useRef, useMemo, useCallback

## Hooks — useEffect, useRef, useMemo, useCallback

### Why It Matters

Master the four most-used hooks beyond `useState`: `useEffect` for side effects, `useRef` for mutable values and DOM handles, and `useMemo`/`useCallback` for selective memoization.

Master the four most-used hooks beyond `useState`: `useEffect` for side effects, `useRef` for mutable values and DOM handles, and `useMemo`/`useCallback` for selective memoization.

### Prerequisites

- Stage 7: Lifting State Up and Component Composition.
- JavaScript closures, the cleanup pattern, dependency arrays.

### Topics

- `useEffect` basics: mount, update, unmount
- Dependency arrays and the exhaustive-deps lint rule
- Cleanup functions (subscriptions, timers, observers)
- `useRef` for DOM handles and mutable values that don't trigger re-render
- `useMemo` for memoizing expensive computations
- `useCallback` for memoizing callbacks
- Stale closures and how to avoid them
- When NOT to use `useMemo`/`useCallback`

### Key Concepts

- Effects run after paint; cleanup runs before the next effect and on unmount
- The dependency array is your contract with React: "rerun only when these change"
- Refs persist across renders without triggering re-renders — perfect for caches and DOM nodes
- `useMemo`/`useCallback` trade memory for fewer re-renders — only worth it when profiling shows a real cost
- The exhaustive-deps lint rule catches 90% of effect bugs — leave it on

```tsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id); // cleanup on unmount and before next effect
}, []);                            // empty deps = run once on mount
```
Caption: Effect with cleanup

### Common Pitfalls

- Missing dependency in `useEffect` array — causes stale closures; the function captures old state and silently uses outdated values. Trust the exhaustive-deps lint rule.
- Forgetting cleanup for subscriptions/timers — leaks memory and causes "setState on unmounted component" warnings; always return a cleanup function.
- Using `useEffect` to derive state from props — derive in render or `useMemo` instead; effects cause an extra render and can flicker.
- Overusing `useMemo`/`useCallback` for cheap computations — the memoization itself costs more than the saved work; only use when profiling shows a benefit.
- Setting a ref in render — refs must be set in effects or event handlers, not during render (except lazy initializers); mutating during render breaks concurrent mode.

### Real-World Applications

- Discord's WebSocket connection lives in a `useEffect` with proper cleanup so reconnects don't multiply subscriptions.
- Spotify's player uses `useRef` to hold the Web Playback SDK instance across renders without triggering re-renders.
- Airbnb's map clustering memoizes cluster computations with `useMemo` so panning doesn't recompute the world.
- Linear's command palette uses `useCallback` for action handlers so virtualized rows don't all re-render on each keystroke.

### Interview Questions

- 1. When does an effect run? — After every render by default; with `[]` only on mount; with `[deps]` only when one of the deps changed. Cleanup runs before the next effect and on unmount.
- 2. What is a stale closure in `useEffect`? — When the effect captures old state values via closure and the deps array doesn't include them, so it always sees the first render's value.
- 3. When should you use `useRef` instead of `useState`? — For mutable values that don't need to trigger a re-render (DOM handles, instance caches, previous-value trackers).
- 4. Why is `useMemo` not free? — It stores the value in memory and compares deps each render; for cheap computations the overhead exceeds the savings.
- 5. How do you fix "setState on unmounted component"? — Add a cleanup that cancels the async work or sets a `mounted` flag; better, use AbortController for fetches.

### Mini Project

Build a "Window Size + Mouse Tracker": An app that displays the current window width/height (updated on resize) and the mouse position (updated on move), with the listeners properly cleaned up on unmount. Add a button to toggle the tracker on/off and watch the cleanup remove the listeners. Suggested approach:
  - `useEffect` adding `resize` listener returning `removeEventListener`
  - A second `useEffect` for `mousemove` gated by an `enabled` state
  - Use `useRef` to track total events fired (no re-render)
  - `useMemo` to format the display string only when values change
  - Confirm in DevTools that toggling off removes the listener (no events accumulate)

### Exercises

1. Write an effect that subscribes to an `EventTarget` and cleans up properly.
2. Reproduce the stale-closure bug with a `setInterval` and fix it with a functional update.
3. Use `useRef` to track the previous value of a prop across renders.
4. Profile a list render in DevTools and add `useMemo` only where it helps.
5. Convert an over-memoized component back to plain code and benchmark the difference.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When does a `useEffect` with `[]` (empty deps) run?
9. A) After every render
10. B) Never
11. C) On every state change
12. D) Only once after the initial mount (*)
13. Explanation: An empty dependency array means "no dependencies changed", so React runs the effect only after the initial mount and the cleanup only on unmount.
14. Q2: What is a stale closure in `useEffect`?
15. A) The effect captures old state values because the dep array omitted them (*)
16. B) An effect that runs too often
17. C) A closure that throws
18. D) A closure that returns undefined
19. Explanation: The effect's function closes over the state from the render it was created in; if you don't list that state in deps, the effect keeps using the old value.
20. Q3: What does the cleanup function returned from `useEffect` do?
21. A) Resets state
22. B) Runs before the next effect and on unmount, freeing resources (*)
23. C) Runs before render
24. D) Cancels React rendering
25. Explanation: Cleanup runs (1) before the next effect invocation and (2) on unmount, so you can release subscriptions, timers, and listeners.
26. Q4: When should you use `useRef` instead of `useState`?
27. A) When you want a re-render
28. B) For async state
29. C) For mutable values that don't need to trigger a re-render (DOM handles, caches) (*)
30. D) Only in effects
31. Explanation: Refs persist across renders without causing re-renders; use them for DOM nodes, instance values, and "previous value" trackers.
32. Q5: Why is `useMemo` not free?
33. A) It can't memoize objects
34. B) It is async
35. C) It throws in StrictMode
36. D) It costs memory and dep-comparison each render (*)
37. Explanation: `useMemo` stores the result and compares deps every render; for cheap work the overhead exceeds the savings — only memoize when profiling shows a benefit.
38. Q6: Which lint rule catches most missing-dependency bugs?
39. A) react-hooks/exhaustive-deps (*)
40. B) react/no-array-index-key
41. C) react/jsx-key
42. D) @typescript-eslint/no-explicit-any
43. Explanation: `react-hooks/exhaustive-deps` warns when your effect or callback references a value not listed in its deps, catching stale-closure bugs.
44. Q7: How do you safely cancel an in-flight fetch on unmount?
45. A) You can't
46. B) Use AbortController and abort it in the effect cleanup (*)
47. C) Set a state flag
48. D) Use a setTimeout
49. Explanation: Pass an `AbortSignal` to `fetch` and call `controller.abort()` in the cleanup; the promise rejects with an `AbortError` you can ignore.
50. Q8: What happens if you mutate a ref during render?
51. A) React throws
52. B) It triggers a re-render
53. C) It breaks concurrent rendering and is an anti-pattern — mutate refs in effects or handlers (*)
54. D) It's the recommended pattern
55. Explanation: Mutating a ref during render is unsafe under concurrent rendering; only write refs inside `useEffect`, event handlers, or lazy initializers.
56. Q9: What does `useCallback(fn, deps)` return?
57. A) The result of calling `fn`
58. B) A new function each render
59. C) A Promise
60. D) A memoized version of `fn` that changes identity only when `deps` change (*)
61. Explanation: `useCallback` returns the same function reference across renders unless one of `deps` changes — useful when passing callbacks to memoized children.
62. Q10: Which is a sign you're overusing `useMemo`/`useCallback`?
63. A) Every variable is memoized "just in case" with no measured benefit (*)
64. B) You profile before memoizing
65. C) You memoize only expensive computations
66. D) You use them only for props passed to memoized children
67. Explanation: Memoizing everything "just in case" adds memory and dep-check overhead with no benefit; reach for memoization only when a profiler shows a real cost.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When does a `useEffect` with `[]` (empty deps) run?
  options:
    - After every render
    - Never
    - On every state change
    - Only once after the initial mount
  correctIndex: 3
  explanation: An empty dependency array means "no dependencies changed", so React runs the effect only after the initial mount and the cleanup only on unmount.
- id: q2
  question: What is a stale closure in `useEffect`?
  options:
    - The effect captures old state values because the dep array omitted them
    - An effect that runs too often
    - A closure that throws
    - A closure that returns undefined
  correctIndex: 0
  explanation: The effect's function closes over the state from the render it was created in; if you don't list that state in deps, the effect keeps using the old value.
- id: q3
  question: What does the cleanup function returned from `useEffect` do?
  options:
    - Resets state
    - Runs before the next effect and on unmount, freeing resources
    - Runs before render
    - Cancels React rendering
  correctIndex: 1
  explanation: Cleanup runs (1) before the next effect invocation and (2) on unmount, so you can release subscriptions, timers, and listeners.
- id: q4
  question: When should you use `useRef` instead of `useState`?
  options:
    - When you want a re-render
    - For async state
    - For mutable values that don't need to trigger a re-render (DOM handles, caches)
    - Only in effects
  correctIndex: 2
  explanation: Refs persist across renders without causing re-renders; use them for DOM nodes, instance values, and "previous value" trackers.
- id: q5
  question: Why is `useMemo` not free?
  options:
    - It can't memoize objects
    - It is async
    - It throws in StrictMode
    - It costs memory and dep-comparison each render
  correctIndex: 3
  explanation: "`useMemo` stores the result and compares deps every render; for cheap work the overhead exceeds the savings — only memoize when profiling shows a benefit."
- id: q6
  question: Which lint rule catches most missing-dependency bugs?
  options:
    - react-hooks/exhaustive-deps
    - react/no-array-index-key
    - react/jsx-key
    - "@typescript-eslint/no-explicit-any"
  correctIndex: 0
  explanation: "`react-hooks/exhaustive-deps` warns when your effect or callback references a value not listed in its deps, catching stale-closure bugs."
- id: q7
  question: How do you safely cancel an in-flight fetch on unmount?
  options:
    - You can't
    - Use AbortController and abort it in the effect cleanup
    - Set a state flag
    - Use a setTimeout
  correctIndex: 1
  explanation: Pass an `AbortSignal` to `fetch` and call `controller.abort()` in the cleanup; the promise rejects with an `AbortError` you can ignore.
- id: q8
  question: What happens if you mutate a ref during render?
  options:
    - React throws
    - It triggers a re-render
    - It breaks concurrent rendering and is an anti-pattern — mutate refs in effects or handlers
    - It's the recommended pattern
  correctIndex: 2
  explanation: Mutating a ref during render is unsafe under concurrent rendering; only write refs inside `useEffect`, event handlers, or lazy initializers.
- id: q9
  question: What does `useCallback(fn, deps)` return?
  options:
    - The result of calling `fn`
    - A new function each render
    - A Promise
    - A memoized version of `fn` that changes identity only when `deps` change
  correctIndex: 3
  explanation: "`useCallback` returns the same function reference across renders unless one of `deps` changes — useful when passing callbacks to memoized children."
- id: q10
  question: Which is a sign you're overusing `useMemo`/`useCallback`?
  options:
    - Every variable is memoized "just in case" with no measured benefit
    - You profile before memoizing
    - You memoize only expensive computations
    - You use them only for props passed to memoized children
  correctIndex: 0
  explanation: Memoizing everything "just in case" adds memory and dep-check overhead with no benefit; reach for memoization only when a profiler shows a real cost.
```

