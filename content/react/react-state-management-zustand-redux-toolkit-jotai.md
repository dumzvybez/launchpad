---
slug: react-state-management-zustand-redux-toolkit-jotai
id: react-16
track: react
order: 16
title: State Management — Zustand, Redux Toolkit, Jotai
description: "Choose the right state-management library for the job: Zustand for a tiny ergonomic store, Redux Toolkit for complex flows with devtools, and Jotai for atomic state."
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=900s
whyItMatters: "Choose the right state-management library for the job: Zustand for a tiny ergonomic store, Redux Toolkit for complex flows with devtools, and Jotai for atomic state."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# State Management — Zustand, Redux Toolkit, Jotai

## State Management — Zustand, Redux Toolkit, Jotai

### Why It Matters

Choose the right state-management library for the job: Zustand for a tiny ergonomic store, Redux Toolkit for complex flows with devtools, and Jotai for atomic state.

Choose the right state-management library for the job: Zustand for a tiny ergonomic store, Redux Toolkit for complex flows with devtools, and Jotai for atomic state.

### Prerequisites

- Stage 15: Forms Advanced.
- Stage 10: Context API and useReducer (for comparison).

### Topics

- Why Context doesn't scale for high-frequency state
- Zustand: store, selectors, middleware
- Redux Toolkit (RTK): slices, `configureStore`, `useSelector`, `useDispatch`
- RTK Query for server state
- Jotai: atoms, derived atoms, async atoms
- Local vs shared vs server state (the three buckets)
- Devtools and time-travel debugging
- When to use which library

### Key Concepts

- External stores with selectors let only the consumers reading the changed slice re-render
- Server state (API data) is best handled by RTK Query / TanStack Query, not by your global store
- Zustand is a single store with hook-style selectors; minimal boilerplate
- RTK standardizes Redux with slices and removes 90% of historical boilerplate
- Jotai models state as atoms that compose — great for fine-grained reactive state

```tsx
import { create } from "zustand";

type CounterStore = {
  count: number;
  inc: () => void;
  reset: () => void;
};

export const useCounter = create<CounterStore>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage — selector subscribes to only `count`
function Counter() {
  const count = useCounter((s) => s.count);
  const inc = useCounter((s) => s.inc);
  return <button onClick={inc}>{count}</button>;
}
```
Caption: Zustand store

### Common Pitfalls

- Putting server state (API data) in your global store — use RTK Query / TanStack Query instead; they handle caching, invalidation, and refetch.
- Subscribing to the entire store with `useStore()` — re-renders on every change; always select the slice you need.
- Returning new objects from a Zustand selector — use `shallow` comparator or select primitives to avoid infinite re-render loops.
- Mutating state outside Immer in RTK — must use the "mutating" syntax inside reducers or return a new object; never both.
- Choosing Redux for a tiny app — Zustand or Context is enough; RTK shines for large teams needing strict structure and devtools.

### Real-World Applications

- Instagram's web client uses a custom store similar to Redux for managing feed, stories, and DMs.
- Discord's desktop client uses a Flux-inspired store (close to Redux) for real-time message and server state.
- Linear uses Zustand for fine-grained UI state and TanStack Query for server state.
- Notion uses a custom immutable store (similar to RTK with Immer) for collaborative block state.

### Interview Questions

- 1. Why use an external store over Context for high-frequency state? — External stores with selectors only re-render consumers reading the changed slice; Context re-renders all consumers on any change.
- 2. What problem does Redux Toolkit solve? — It removes the historical Redux boilerplate (action types, action creators, hand-written reducers) with `createSlice` and includes Immer for immutable updates.
- 3. What's the difference between client state and server state? — Client state is UI-local (form drafts, toggles); server state is fetched data that needs caching, invalidation, and refetch — use RTK Query / TanStack Query for the latter.
- 4. Why use Jotai over Zustand? — Jotai models state as composable atoms, ideal for fine-grained reactive graphs; Zustand is one big store with selectors.
- 5. What's the rule for Zustand selectors? — Select the smallest slice you need (primitives preferred); if you must select an object, use the `shallow` comparator to avoid extra re-renders.

### Mini Project

Build a "Shopping Cart" with Zustand: a product list, an "Add to cart" action, a cart drawer showing line items with quantity controls, and a persisted cart across reloads using the `persist` middleware. Suggested approach:
  - Create a Zustand store with `items`, `addItem`, `removeItem`, `setQty`, `clear`
  - Use the `persist` middleware to write to `localStorage`
  - Select only `items` in the drawer, only `count` in the header badge
  - Verify adding 10 items only re-renders the badge and drawer, not the product list
  - Reload the page and confirm the cart persists

### Exercises

1. Port a Context + useReducer store to Zustand and compare re-render counts.
2. Add the `persist` middleware and confirm the cart survives reloads.
3. Build the same cart with Redux Toolkit and observe the devtools time-travel.
4. Implement a derived Jotai atom computing the cart total.
5. Move server-state (products list) into TanStack Query and keep only UI state in Zustand.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why prefer an external store over Context for high-frequency state?
9. A) External stores are faster in general
10. B) Context is deprecated
11. C) External stores use less memory
12. D) Selectors let only consumers of the changed slice re-render (*)
13. Explanation: Context re-renders every consumer when its value changes by reference; external stores with selectors subscribe each consumer to the specific slice they read.
14. Q2: What does `createSlice` in Redux Toolkit give you?
15. A) Auto-generated action creators and reducers from a single config (*)
16. B) A React component
17. C) A selector hook
18. D) A persist middleware
19. Explanation: `createSlice` takes a name, initialState, and reducers; it returns auto-generated action creators and the reducer, eliminating hand-written action types.
20. Q3: Why does RTK let you "mutate" state inside reducers?
21. A) It's actually mutating
22. B) It uses Immer under the hood to translate mutations into immutable updates (*)
23. C) It disables immutability
24. D) It's a bug
25. Explanation: RTK wraps reducers with Immer, which intercepts "mutations" and produces a new immutable state — so `s.count += 1` produces a new object.
26. Q4: Where should server-state (API data) live?
27. A) In your global store (Redux/Zustand)
28. B) In component state
29. C) In RTK Query or TanStack Query, which handle caching and refetch (*)
30. D) In localStorage only
31. Explanation: Server state needs caching, invalidation, refetch, and stale-while-revalidate — specialized tools (RTK Query, TanStack Query) handle this; your global store is for client state.
32. Q5: What's a common Zustand selector bug?
33. A) Selecting primitives
34. B) Using `useStore`
35. C) Selecting a slice
36. D) Returning a new object every call without a comparator → infinite re-render loop (*)
37. Explanation: Zustand uses `Object.is` to compare selector results; returning `{a, b}` each call yields a new reference, causing re-renders forever — use `useStoreWithEqualityFn` + `shallow`.
38. Q6: What does Jotai model state as?
39. A) Composable atoms (*)
40. B) One big store
41. C) Redux slices
42. D) Context values
43. Explanation: Jotai represents state as individual atoms that can derive from each other, enabling fine-grained reactive graphs.
44. Q7: Which library provides the richest devtools with time-travel debugging?
45. A) Zustand
46. B) Redux Toolkit / Redux DevTools (*)
47. C) Jotai
48. D) Context
49. Explanation: Redux DevTools supports action-by-action time travel, dispatched-action inspection, and state diffs — RTK wires this up automatically.
50. Q8: When is Redux Toolkit a better pick than Zustand?
51. A) For a tiny app
52. B) For one-off state
53. C) For large teams needing strict structure, middleware, and devtools (*)
54. D) Never
55. Explanation: RTK shines for large codebases with many engineers: opinionated structure, middleware (thunk, listener), and rich devtools. Zustand wins for smaller or ergonomic-first stores.
56. Q9: What does the Zustand `persist` middleware do?
57. A) Memoizes selectors
58. B) Logs every change
59. C) Cancels in-flight requests
60. D) Saves the store to localStorage (or other storage) so it survives reloads (*)
61. Explanation: `persist` serializes the store to a storage backend (localStorage by default) and rehydrates on load, giving you cross-session state.
62. Q10: What's the three-bucket model for React state?
63. A) Local state, shared client state, server state — each handled by the right tool (*)
64. B) Local, shared, server
65. C) useState, useReducer, context
66. D) Atomic, slice, store
67. Explanation: Local state = `useState`; shared client state = Zustand/RTK/Context; server state = TanStack Query / RTK Query. Matching the tool to the bucket avoids misuse.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why prefer an external store over Context for high-frequency state?
  options:
    - External stores are faster in general
    - Context is deprecated
    - External stores use less memory
    - Selectors let only consumers of the changed slice re-render
  correctIndex: 3
  explanation: Context re-renders every consumer when its value changes by reference; external stores with selectors subscribe each consumer to the specific slice they read.
- id: q2
  question: What does `createSlice` in Redux Toolkit give you?
  options:
    - Auto-generated action creators and reducers from a single config
    - A React component
    - A selector hook
    - A persist middleware
  correctIndex: 0
  explanation: "`createSlice` takes a name, initialState, and reducers; it returns auto-generated action creators and the reducer, eliminating hand-written action types."
- id: q3
  question: Why does RTK let you "mutate" state inside reducers?
  options:
    - It's actually mutating
    - It uses Immer under the hood to translate mutations into immutable updates
    - It disables immutability
    - It's a bug
  correctIndex: 1
  explanation: RTK wraps reducers with Immer, which intercepts "mutations" and produces a new immutable state — so `s.count += 1` produces a new object.
- id: q4
  question: Where should server-state (API data) live?
  options:
    - In your global store (Redux/Zustand)
    - In component state
    - In RTK Query or TanStack Query, which handle caching and refetch
    - In localStorage only
  correctIndex: 2
  explanation: Server state needs caching, invalidation, refetch, and stale-while-revalidate — specialized tools (RTK Query, TanStack Query) handle this; your global store is for client state.
- id: q5
  question: What's a common Zustand selector bug?
  options:
    - Selecting primitives
    - Using `useStore`
    - Selecting a slice
    - Returning a new object every call without a comparator → infinite re-render loop
  correctIndex: 3
  explanation: Zustand uses `Object.is` to compare selector results; returning `{a, b}` each call yields a new reference, causing re-renders forever — use `useStoreWithEqualityFn` + `shallow`.
- id: q6
  question: What does Jotai model state as?
  options:
    - Composable atoms
    - One big store
    - Redux slices
    - Context values
  correctIndex: 0
  explanation: Jotai represents state as individual atoms that can derive from each other, enabling fine-grained reactive graphs.
- id: q7
  question: Which library provides the richest devtools with time-travel debugging?
  options:
    - Zustand
    - Redux Toolkit / Redux DevTools
    - Jotai
    - Context
  correctIndex: 1
  explanation: Redux DevTools supports action-by-action time travel, dispatched-action inspection, and state diffs — RTK wires this up automatically.
- id: q8
  question: When is Redux Toolkit a better pick than Zustand?
  options:
    - For a tiny app
    - For one-off state
    - For large teams needing strict structure, middleware, and devtools
    - Never
  correctIndex: 2
  explanation: "RTK shines for large codebases with many engineers: opinionated structure, middleware (thunk, listener), and rich devtools. Zustand wins for smaller or ergonomic-first stores."
- id: q9
  question: What does the Zustand `persist` middleware do?
  options:
    - Memoizes selectors
    - Logs every change
    - Cancels in-flight requests
    - Saves the store to localStorage (or other storage) so it survives reloads
  correctIndex: 3
  explanation: "`persist` serializes the store to a storage backend (localStorage by default) and rehydrates on load, giving you cross-session state."
- id: q10
  question: What's the three-bucket model for React state?
  options:
    - Local state, shared client state, server state — each handled by the right tool
    - Local, shared, server
    - useState, useReducer, context
    - Atomic, slice, store
  correctIndex: 0
  explanation: Local state = `useState`; shared client state = Zustand/RTK/Context; server state = TanStack Query / RTK Query. Matching the tool to the bucket avoids misuse.
```

