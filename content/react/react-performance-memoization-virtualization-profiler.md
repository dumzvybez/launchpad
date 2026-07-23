---
slug: react-performance-memoization-virtualization-profiler
id: react-13
track: react
order: 13
title: Performance — Memoization, Virtualization, Profiler
description: Profile React apps with the DevTools Profiler, eliminate wasted renders with `React.memo` and memoization, and virtualize long lists for smooth 60fps scrolling.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=720s
whyItMatters: Profile React apps with the DevTools Profiler, eliminate wasted renders with `React. memo` and memoization, and virtualize long lists for smooth 60fps scrolling.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Performance — Memoization, Virtualization, Profiler

## Performance — Memoization, Virtualization, Profiler

### Why It Matters

Profile React apps with the DevTools Profiler, eliminate wasted renders with `React. memo` and memoization, and virtualize long lists for smooth 60fps scrolling.

Profile React apps with the DevTools Profiler, eliminate wasted renders with `React.memo` and memoization, and virtualize long lists for smooth 60fps scrolling.

### Prerequisites

- Stage 12: Data Fetching.
- Browser paint/composite pipeline, the cost of reconciliation.

### Topics

- The React DevTools Profiler: flamechart, ranked chart, commits
- Why components re-render (state, parent, context)
- `React.memo` for shallow prop comparison
- `useMemo` and `useCallback` (recap from Stage 8)
- Virtualization with `react-window` / `@tanstack/react-virtual`
- Code splitting with `React.lazy` and `Suspense`
- `useDeferredValue` and `useTransition` for concurrent UIs
- Common performance anti-patterns

### Key Concepts

- A component re-renders when its state changes, its parent re-renders, or a context it reads changes
- `React.memo` does a shallow prop compare; it helps only when props are stable
- Memoization without stable props is useless — combine `React.memo` + `useCallback`/`useMemo`
- Virtualization renders only the visible rows, making 100k-item lists scroll at 60fps
- The Profiler shows you what actually re-rendered and why — measure before optimizing

```tsx
const ExpensiveRow = React.memo(function Row({ item, onSelect }: {
  item: Item;
  onSelect: (id: string) => void;
}) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }: { items: Item[] }) {
  // Without useCallback, onSelect is a new function every render and React.memo is useless.
  const onSelect = useCallback((id: string) => console.log(id), []);
  return (
    <ul>
      {items.map((it) => <ExpensiveRow key={it.id} item={it} onSelect={onSelect} />)}
    </ul>
  );
}
```
Caption: React.memo with stable callbacks

### Common Pitfalls

- Wrapping every component in `React.memo` blindly — if props include new functions/objects each render, memo never bails out. Make props stable first.
- Premature optimization without profiling — always measure with the Profiler before memoizing; the cost of memoization may exceed the savings.
- Index-based virtualization that breaks accessibility — virtualized lists need correct `aria-setsize`/`aria-posinset` for screen readers.
- Using `useTransition` for urgent updates — transitions defer the update, so don't use them for inputs that must feel instant.
- Ignoring the Profiler's "Why did this render?" — it tells you exactly what changed (props, state, parent); read it before guessing.

### Real-World Applications

- Twitter/X's timeline uses virtualization to scroll through thousands of tweets at 60fps even on mid-range phones.
- Linear's issue list virtualizes rows and uses `React.memo` so a single-row update doesn't re-render the whole list.
- Notion's block editor uses `useTransition` so typing stays responsive while block formatting recomputes.
- Airbnb's search results use code splitting via `React.lazy` to load the map only when users open it.

### Interview Questions

- 1. Why does a component re-render? — State change, parent re-rendered (and not memoized), or a context it reads changed.
- 2. When does `React.memo` help? — Only when props are referentially stable between renders; pair it with `useCallback`/`useMemo` for new-function/object props.
- 3. What does virtualization do? — Renders only the visible window of items (plus overscan), keeping DOM node count constant regardless of list size.
- 4. When should you use `useTransition`? — For non-urgent updates (filtering, sorting, heavy recomputes) where you'd rather defer than block input.
- 5. What's the first step in any performance work? — Profile with the DevTools Profiler; never guess. It shows what re-rendered, why, and how long.

### Mini Project

Build a "10,000-row virtualized table" with sortable columns and a search filter. Profile before and after adding `React.memo` and `useTransition`; document the commit times. Suggested approach:
  - Generate 10k rows with `crypto.randomUUID()` + random data
  - Use `@tanstack/react-virtual` for row virtualization
  - Memoize each row with `React.memo` and pass a stable `onSelect` via `useCallback`
  - Wrap the filter recompute in `startTransition` and show `isPending`
  - Capture Profiler screenshots for the writeup

### Exercises

1. Open the Profiler, record a session, and identify the slowest commit.
2. Add `React.memo` to a child component and watch it stop re-rendering when props are stable.
3. Virtualize a 5k-item list and verify scrolling stays at 60fps.
4. Use `React.lazy` + `Suspense` to code-split a heavy route.
5. Wrap a filter recompute in `useTransition` and observe input responsiveness.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why would `React.memo` fail to prevent re-renders?
9. A) If props include a new function/object each render, the shallow compare fails (*)
10. B) It always works
11. C) It only works in production
12. D) It only works for class components
13. Explanation: `React.memo` shallow-compares props; a new function or object literal every render will always differ by reference, so memo never bails out. Pair with `useCallback`/`useMemo`.
14. Q2: What does list virtualization do?
15. A) Clones the list
16. B) Renders only the visible window of items, keeping DOM count constant (*)
17. C) Sorts items faster
18. D) Memoizes every item
19. Explanation: Virtualization (e.g. `react-window`, `@tanstack/react-virtual`) renders only what's visible plus an overscan, making 100k-item lists scroll smoothly.
20. Q3: What's the first step in React performance work?
21. A) Add React.memo everywhere
22. B) Switch to React 19
23. C) Profile with the DevTools Profiler to find the slowest commit (*)
24. D) Memoize all functions
25. Explanation: Always profile first; the Profiler shows what re-rendered, why, and how long, so you optimize only the actual hotspots.
26. Q4: When should you use `useTransition`?
27. A) For urgent state updates
28. B) Only in class components
29. C) Only for fetches
30. D) For non-urgent updates like filtering or heavy recomputes (*)
31. Explanation: `useTransition` marks an update as non-urgent so React can keep the UI responsive (e.g. typing in an input) while a heavy filter recomputes.
32. Q5: Why pair `React.memo` with `useCallback`?
33. A) Stable callback references are required for `React.memo` to bail out (*)
34. B) They're unrelated
35. C) It's a TypeScript requirement
36. D) For CSS reasons
37. Explanation: `React.memo` shallow-compares props; if a callback prop is a new function every render, memo never bails out. `useCallback` keeps the reference stable.
38. Q6: Which hook helps defer a heavy recompute without blocking input?
39. A) `useEffect`
40. B) `useTransition` (*)
41. C) `useRef`
42. D) `useReducer`
43. Explanation: `useTransition` returns `startTransition` and `isPending`; wrapping a non-urgent update lets React keep urgent updates (typing) responsive.
44. Q7: What does `React.lazy` do?
45. A) Defers a re-render
46. B) Memoizes a component
47. C) Code-splits a component so it loads on demand (*)
48. D) Skips rendering
49. Explanation: `React.lazy` dynamically imports a component, splitting it into a separate bundle loaded on first render (with a `Suspense` fallback).
50. Q8: Which Profiler feature tells you why a component re-rendered?
51. A) The flamechart
52. B) The commits bar
53. C) The ranked chart
54. D) The "What caused this render?" / "Why did this render?" panel (*)
55. Explanation: The Profiler's "Why did this render?" panel lists the changed props/state/context that triggered the re-render — invaluable for memoization work.
56. Q9: What's a downside of overusing `useMemo`/`useCallback`?
57. A) They make components slower than no memoization in many cases (*)
58. B) They break TypeScript
59. C) They disable StrictMode
60. D) They require React 19
61. Explanation: Memoization costs memory and dep-comparison each render; for cheap work the overhead exceeds the savings. Profile before memoizing.
62. Q10: Which is a common accessibility pitfall of virtualized lists?
63. A) They use too much memory
64. B) Missing `aria-setsize`/`aria-posinset` so screen readers don't know the total count (*)
65. C) They scroll too fast
66. D) They can't be keyboard-navigated
67. Explanation: Virtualization renders only visible rows, so the DOM doesn't reveal total size; add ARIA set/position attributes so screen readers announce "row 3 of 10,000".
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why would `React.memo` fail to prevent re-renders?
  options:
    - If props include a new function/object each render, the shallow compare fails
    - It always works
    - It only works in production
    - It only works for class components
  correctIndex: 0
  explanation: "`React.memo` shallow-compares props; a new function or object literal every render will always differ by reference, so memo never bails out. Pair with `useCallback`/`useMemo`."
- id: q2
  question: What does list virtualization do?
  options:
    - Clones the list
    - Renders only the visible window of items, keeping DOM count constant
    - Sorts items faster
    - Memoizes every item
  correctIndex: 1
  explanation: Virtualization (e.g. `react-window`, `@tanstack/react-virtual`) renders only what's visible plus an overscan, making 100k-item lists scroll smoothly.
- id: q3
  question: What's the first step in React performance work?
  options:
    - Add React.memo everywhere
    - Switch to React 19
    - Profile with the DevTools Profiler to find the slowest commit
    - Memoize all functions
  correctIndex: 2
  explanation: Always profile first; the Profiler shows what re-rendered, why, and how long, so you optimize only the actual hotspots.
- id: q4
  question: When should you use `useTransition`?
  options:
    - For urgent state updates
    - Only in class components
    - Only for fetches
    - For non-urgent updates like filtering or heavy recomputes
  correctIndex: 3
  explanation: "`useTransition` marks an update as non-urgent so React can keep the UI responsive (e.g. typing in an input) while a heavy filter recomputes."
- id: q5
  question: Why pair `React.memo` with `useCallback`?
  options:
    - Stable callback references are required for `React.memo` to bail out
    - They're unrelated
    - It's a TypeScript requirement
    - For CSS reasons
  correctIndex: 0
  explanation: "`React.memo` shallow-compares props; if a callback prop is a new function every render, memo never bails out. `useCallback` keeps the reference stable."
- id: q6
  question: Which hook helps defer a heavy recompute without blocking input?
  options:
    - "`useEffect`"
    - "`useTransition`"
    - "`useRef`"
    - "`useReducer`"
  correctIndex: 1
  explanation: "`useTransition` returns `startTransition` and `isPending`; wrapping a non-urgent update lets React keep urgent updates (typing) responsive."
- id: q7
  question: What does `React.lazy` do?
  options:
    - Defers a re-render
    - Memoizes a component
    - Code-splits a component so it loads on demand
    - Skips rendering
  correctIndex: 2
  explanation: "`React.lazy` dynamically imports a component, splitting it into a separate bundle loaded on first render (with a `Suspense` fallback)."
- id: q8
  question: Which Profiler feature tells you why a component re-rendered?
  options:
    - The flamechart
    - The commits bar
    - The ranked chart
    - The "What caused this render?" / "Why did this render?" panel
  correctIndex: 3
  explanation: The Profiler's "Why did this render?" panel lists the changed props/state/context that triggered the re-render — invaluable for memoization work.
- id: q9
  question: What's a downside of overusing `useMemo`/`useCallback`?
  options:
    - They make components slower than no memoization in many cases
    - They break TypeScript
    - They disable StrictMode
    - They require React 19
  correctIndex: 0
  explanation: Memoization costs memory and dep-comparison each render; for cheap work the overhead exceeds the savings. Profile before memoizing.
- id: q10
  question: Which is a common accessibility pitfall of virtualized lists?
  options:
    - They use too much memory
    - Missing `aria-setsize`/`aria-posinset` so screen readers don't know the total count
    - They scroll too fast
    - They can't be keyboard-navigated
  correctIndex: 1
  explanation: Virtualization renders only visible rows, so the DOM doesn't reveal total size; add ARIA set/position attributes so screen readers announce "row 3 of 10,000".
```

