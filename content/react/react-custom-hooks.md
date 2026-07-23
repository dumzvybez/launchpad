---
slug: react-custom-hooks
id: react-09
track: react
order: 9
title: Custom Hooks
description: Extract reusable logic into custom hooks, follow the rules of hooks, and design composable, testable primitives that feel like built-ins.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=480s
whyItMatters: Extract reusable logic into custom hooks, follow the rules of hooks, and design composable, testable primitives that feel like built-ins.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Custom Hooks

## Custom Hooks

### Why It Matters

Extract reusable logic into custom hooks, follow the rules of hooks, and design composable, testable primitives that feel like built-ins.

Extract reusable logic into custom hooks, follow the rules of hooks, and design composable, testable primitives that feel like built-ins.

### Prerequisites

- Stage 8: Hooks — useEffect, useRef, useMemo, useCallback.
- Closures, pure functions, the dependency array contract.

### Topics

- What makes a function a "hook" (the `use` prefix)
- Rules of hooks: top-level only, only from React functions
- Extracting state + effects into a custom hook
- Returning values, objects, and tuples
- Composing hooks (one hook calling another)
- `useToggle`, `useDebounce`, `useLocalStorage`, `useFetch`
- Testing custom hooks with `renderHook`
- Naming conventions and the eslint-plugin-react-hooks

### Key Concepts

- Custom hooks are just functions that call other hooks; the `use` prefix enables the linter
- Hooks compose: a custom hook can call other custom hooks freely
- Return shape matters: tuples enable caller renaming, objects enable cherry-picking
- Hooks isolate state per component instance — two components using `useToggle` each get their own state
- Testable in isolation via `@testing-library/react`'s `renderHook`

```tsx
import { useCallback, useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  const set = useCallback((v: boolean) => setOn(v), []);
  return [on, toggle, set] as const; // `as const` for correct tuple type
}
```
Caption: useToggle

### Common Pitfalls

- Breaking the rules of hooks (calling hooks conditionally or in loops) — React relies on call order; conditionals break it and throw. Always call hooks at the top level.
- Returning an un-typed tuple — TypeScript infers a union, losing the boolean/setter distinction. Use `as const` or an explicit `[T, (v: T) => void]` return type.
- Hardcoding side effects in a custom hook without cleanup — leaks listeners/timers when the calling component unmounts; always clean up.
- Putting React-internal logic in a non-`use` function — the linter won't catch rule violations; name hooks with the `use` prefix.
- Returning a fresh object each render from a hook — callers using `React.memo` will re-render; return primitives or memoize the object.

### Real-World Applications

- The `useDebounce` hook is in virtually every search-as-you-type UI (Twitter/X, Linear, Algolia-powered sites).
- MUI's `useMediaQuery` and `useScrollTrigger` are battle-tested custom hooks shipped to thousands of apps.
- React Aria (Adobe) ships dozens of custom hooks (`useButton`, `useDialog`) that power accessible Radix-like primitives.
- Vercel's website uses custom hooks like `useUser` and `useToast` to coordinate auth and notifications across pages.

### Interview Questions

- 1. What are the rules of hooks? — Call hooks only at the top level (no loops/conditions) and only from React functions (components or other hooks); the `use` prefix enables linting.
- 2. Why does the call order of hooks matter? — React identifies hooks by call order; if order changes between renders, state gets mismatched to the wrong hook.
- 3. Tuple vs object return for a custom hook? — Tuples let callers rename (`const [open, toggle] = useToggle()`); objects let callers cherry-pick (`const { on } = useToggle()`). Pick based on caller ergonomics.
- 4. How do you test a custom hook in isolation? — Use `@testing-library/react`'s `renderHook` (and `act` to flush effects) — no full component needed.
- 5. Can a custom hook call another custom hook? — Yes; hooks compose freely, that's the whole point — build small primitives and combine them.

### Mini Project

Build a `useFetch` hook: A hook that takes a URL and options, returns `{ data, error, isLoading, refetch }`, supports an AbortController to cancel in-flight requests, and skips the fetch when a `skip` option is true. Suggested approach:
  - Use `useState` for `data`, `error`, `isLoading`
  - In `useEffect`, create an `AbortController` and pass `signal` to `fetch`
  - In cleanup, call `controller.abort()`
  - Expose a `refetch` callback via `useCallback` that re-triggers the effect (use a counter state)
  - Return a stable object (use `useMemo`) so callers can pass it to memoized children

### Exercises

1. Write a `usePrevious(value)` hook returning the previous value of a prop.
2. Build a `useWindowSize()` hook returning `{ width, height }` with cleanup.
3. Test a custom hook with `renderHook` and `act` from `@testing-library/react`.
4. Compose `useDebounce` + `useFetch` to build a search-as-you-type component.
5. Convert a component with 5 inline `useState`/`useEffect` calls into one that delegates to a custom hook.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What makes a function a "hook" recognized by the linter?
9. A) A name starting with `use` (*)
10. B) Returning a tuple
11. C) Being exported from a hooks folder
12. D) Calling useState
13. Explanation: The `react-hooks` ESLint plugin treats any function whose name starts with `use` as a hook and enforces the rules of hooks on it.
14. Q2: Which of the following is a rule of hooks?
15. A) Hooks can be called inside loops
16. B) Hooks must be called at the top level, not in conditions or loops (*)
17. C) Hooks can be called from any function
18. D) Hooks can be called conditionally if wrapped in try/catch
19. Explanation: React identifies hooks by call order; calling them conditionally or in loops breaks that ordering and throws at runtime.
20. Q3: Why does call order matter for hooks?
21. A) It doesn't
22. B) It affects TypeScript inference
23. C) React identifies each hook by its position in the call sequence (*)
24. D) It controls re-render order
25. Explanation: React stores hook state in a linked list per component; it matches state to hooks purely by call order, so reordering breaks the mapping.
26. Q4: Why use `as const` when returning a tuple from a custom hook?
27. A) To make the tuple immutable
28. B) It's required by React
29. C) To enable memoization
30. D) So TypeScript infers a tuple type, not a widened array union (*)
31. Explanation: Without `as const`, TypeScript infers `(boolean | (() => void))[]`; `as const` infers a readonly tuple `[boolean, () => void]` preserving each position's type.
32. Q5: How do you test a custom hook without a component?
33. A) Use `renderHook` from `@testing-library/react` and `act` to flush effects (*)
34. B) You can't
35. C) Use Jest mocks only
36. D) Convert it to a class first
37. Explanation: `renderHook` mounts the hook in a test harness and returns its latest result; wrap state updates in `act()` to flush effects synchronously.
38. Q6: Can a custom hook call other custom hooks?
39. A) No
40. B) Yes — hooks compose freely (*)
41. C) Only in class components
42. D) Only if they return tuples
43. Explanation: Hooks can call other hooks; composing small hooks (`useDebounce` + `useFetch`) is the recommended way to build complex logic.
44. Q7: What is the bug if a hook returns a fresh object every render?
45. A) It causes a syntax error
46. B) The hook can't be tested
47. C) Callers using React.memo will re-render every time (*)
48. D) It violates the rules of hooks
49. Explanation: A new object reference every render defeats `React.memo` on consumers; memoize the returned object with `useMemo` if callers depend on referential equality.
50. Q8: Which is a good custom hook design principle?
51. A) Hardcode cleanup in the consumer
52. B) Avoid returning cleanup functions
53. C) Use globals to share state
54. D) Always clean up effects inside the hook so callers don't have to (*)
55. Explanation: A well-designed hook encapsulates its side effects and their cleanup, so consumers don't need to know about timers, listeners, or subscriptions.
56. Q9: What does `useLocalStorage(key, initial)` typically do?
57. A) Reads on mount, writes on change, and persists across reloads (*)
58. B) Reads from localStorage once and never writes
59. C) Replaces useState entirely
60. D) Synchronizes across tabs automatically
61. Explanation: It seeds state from localStorage on mount and writes back on every change, so state survives reloads. Cross-tab sync requires the `storage` event (Stage 10 extension).
62. Q10: Why is `useToggle` returning `[on, toggle, set] as const` better than an object here?
63. A) Tuples are always better
64. B) Callers can rename positions: `const [isOpen, , setIsOpen] = useToggle()` (*)
65. C) Objects can't be typed
66. D) Tuples are faster
67. Explanation: Tuples let callers rename and skip positions (`const [isOpen, , setIsOpen]`); objects require destructuring all keys. Pick the shape based on caller ergonomics.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What makes a function a "hook" recognized by the linter?
  options:
    - A name starting with `use`
    - Returning a tuple
    - Being exported from a hooks folder
    - Calling useState
  correctIndex: 0
  explanation: The `react-hooks` ESLint plugin treats any function whose name starts with `use` as a hook and enforces the rules of hooks on it.
- id: q2
  question: Which of the following is a rule of hooks?
  options:
    - Hooks can be called inside loops
    - Hooks must be called at the top level, not in conditions or loops
    - Hooks can be called from any function
    - Hooks can be called conditionally if wrapped in try/catch
  correctIndex: 1
  explanation: React identifies hooks by call order; calling them conditionally or in loops breaks that ordering and throws at runtime.
- id: q3
  question: Why does call order matter for hooks?
  options:
    - It doesn't
    - It affects TypeScript inference
    - React identifies each hook by its position in the call sequence
    - It controls re-render order
  correctIndex: 2
  explanation: React stores hook state in a linked list per component; it matches state to hooks purely by call order, so reordering breaks the mapping.
- id: q4
  question: Why use `as const` when returning a tuple from a custom hook?
  options:
    - To make the tuple immutable
    - It's required by React
    - To enable memoization
    - So TypeScript infers a tuple type, not a widened array union
  correctIndex: 3
  explanation: Without `as const`, TypeScript infers `(boolean | (() => void))[]`; `as const` infers a readonly tuple `[boolean, () => void]` preserving each position's type.
- id: q5
  question: How do you test a custom hook without a component?
  options:
    - Use `renderHook` from `@testing-library/react` and `act` to flush effects
    - You can't
    - Use Jest mocks only
    - Convert it to a class first
  correctIndex: 0
  explanation: "`renderHook` mounts the hook in a test harness and returns its latest result; wrap state updates in `act()` to flush effects synchronously."
- id: q6
  question: Can a custom hook call other custom hooks?
  options:
    - No
    - Yes — hooks compose freely
    - Only in class components
    - Only if they return tuples
  correctIndex: 1
  explanation: Hooks can call other hooks; composing small hooks (`useDebounce` + `useFetch`) is the recommended way to build complex logic.
- id: q7
  question: What is the bug if a hook returns a fresh object every render?
  options:
    - It causes a syntax error
    - The hook can't be tested
    - Callers using React.memo will re-render every time
    - It violates the rules of hooks
  correctIndex: 2
  explanation: A new object reference every render defeats `React.memo` on consumers; memoize the returned object with `useMemo` if callers depend on referential equality.
- id: q8
  question: Which is a good custom hook design principle?
  options:
    - Hardcode cleanup in the consumer
    - Avoid returning cleanup functions
    - Use globals to share state
    - Always clean up effects inside the hook so callers don't have to
  correctIndex: 3
  explanation: A well-designed hook encapsulates its side effects and their cleanup, so consumers don't need to know about timers, listeners, or subscriptions.
- id: q9
  question: What does `useLocalStorage(key, initial)` typically do?
  options:
    - Reads on mount, writes on change, and persists across reloads
    - Reads from localStorage once and never writes
    - Replaces useState entirely
    - Synchronizes across tabs automatically
  correctIndex: 0
  explanation: It seeds state from localStorage on mount and writes back on every change, so state survives reloads. Cross-tab sync requires the `storage` event (Stage 10 extension).
- id: q10
  question: Why is `useToggle` returning `[on, toggle, set] as const` better than an object here?
  options:
    - Tuples are always better
    - "Callers can rename positions: `const [isOpen, , setIsOpen] = useToggle()`"
    - Objects can't be typed
    - Tuples are faster
  correctIndex: 1
  explanation: Tuples let callers rename and skip positions (`const [isOpen, , setIsOpen]`); objects require destructuring all keys. Pick the shape based on caller ergonomics.
```

