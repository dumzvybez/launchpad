---
slug: react-state-event-handlers
id: react-04
track: react
order: 4
title: State and Event Handlers
description: Add interactivity with `useState`, handle DOM and synthetic events, and understand React's state batching and update model.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=180s
whyItMatters: Add interactivity with `useState`, handle DOM and synthetic events, and understand React's state batching and update model.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# State and Event Handlers

## State and Event Handlers

### Why It Matters

Add interactivity with `useState`, handle DOM and synthetic events, and understand React's state batching and update model.

Add interactivity with `useState`, handle DOM and synthetic events, and understand React's state batching and update model.

### Prerequisites

- Stage 3: Components and Props.
- Closures in JavaScript, the event loop basics.

### Topics

- `useState` basics and the state setter
- Functional updates `setX(prev => next)`
- Event handlers: onClick, onChange, onSubmit
- Synthetic events and `e.currentTarget` vs `e.target`
- Forms 101: controlled inputs (deep dive Stage 6)
- Updating objects and arrays immutably
- Multiple state pieces vs one state object
- React 18 automatic batching

### Key Concepts

- State is the single source of truth that triggers re-renders
- Never mutate state directly — always return a new object/array
- Functional updates avoid stale closures when computing next state from previous
- Event handlers receive SyntheticEvent objects that wrap native events
- React batches state updates into a single re-render (automatic in React 18)

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  // Functional update — uses the latest state, safe for batching
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```
Caption: Basic useState and functional update

### Common Pitfalls

- Mutating state with `state.x = 5` — React won't detect the change and won't re-render. Always create a new object: `setState({ ...state, x: 5 })`.
- Calling `setCount(count + 1)` twice in a row and expecting +2 — both calls see the same `count`, so only +1 happens. Use the functional form `setCount(c => c + 1)`.
- Reading state right after `setState` — `setState` is async; the local variable still holds the old value. Move dependent logic into `useEffect`.
- Using `e.target` when you meant `e.currentTarget` — `target` is the inner element that fired the event (could be a child), `currentTarget` is the element the handler is attached to.
- Creating new object/array literals in render and passing as props — causes child re-renders; memoize or hoist constants.

### Real-World Applications

- Trello's card drag-and-drop updates local state on every pointer move; immutable array updates keep the board responsive across thousands of cards.
- Spotify's play queue uses functional `setState` updates to splice tracks without races from concurrent web-player events.
- Linear's issue board uses state batching to apply multiple field updates from a single keyboard shortcut in one render pass.
- Google Docs' comment sidebar (React) manages draft state locally and only commits on blur, avoiding constant autosave churn.

### Interview Questions

- 1. Why use functional updates `setX(prev => ...)`? — To avoid stale closures and ensure correct results when multiple updates are batched in one render.
- 2. Why can't React detect `state.x = 5`? — React compares by reference; mutating the same object leaves the reference unchanged, so it skips the re-render.
- 3. What is automatic batching? — React 18 batches state updates across event handlers, timeouts, promises, and native events into one re-render.
- 4. `e.target` vs `e.currentTarget`? — `target` is the element that fired the event (may be a child); `currentTarget` is the element the listener is attached to.
- 5. When should you split state into multiple `useState` calls vs one object? — Split when pieces change independently; group when they always change together to avoid intermediate states.

### Mini Project

Build a "Tip Calculator": An app with three inputs (bill amount, tip percent, number of people) and a live-updating result showing per-person tip and total. Use functional updates, immutable state, and format currency with `Intl.NumberFormat`. Suggested approach:
  - One `useState` per input or a single typed state object
  - Use `number` state but parse input via `Number(e.target.value)`
  - Compute derived values (tip, total) in render — no need for state
  - Format with `new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`
  - Disable the result when inputs are invalid

### Exercises

1. Build a counter that increments by 1, 5, and 10 — confirm batched updates only re-render once.
2. Refactor a mutable `state.items.push(item)` to use `setState(prev => [...prev, item])`.
3. Create a form with two inputs (email, password) controlled by separate `useState` calls.
4. Replace `e.target` with `e.currentTarget` in a click handler on a `<li>` containing a `<span>` — observe the difference when clicking the span.
5. Combine three independent `useState` calls into a single state object and verify the same behavior.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why does `setCount(count + 1); setCount(count + 1)` only increment once?
9. A) React dedupes identical calls
10. B) setState is synchronous
11. C) StrictMode disables it
12. D) Both calls read the same `count` from the closure (*)
13. Explanation: Both calls close over the same `count` value from the render; use the functional form `setCount(c => c + 1)` to chain updates correctly.
14. Q2: Which update form is safest when computing next state from previous?
15. A) setX(prev => prev + 1) (*)
16. B) setX(x + 1)
17. C) setX(() => x + 1)
18. D) x = x + 1
19. Explanation: The functional form receives the latest state, so it works correctly even when multiple updates are batched together.
20. Q3: What is automatic batching in React 18?
21. A) Multiple components are batched into one file
22. B) Updates inside setTimeout are batched too (*)
23. C) All setState calls become synchronous
24. D) StrictMode is enabled by default
25. Explanation: React 18 batches updates across event handlers, timeouts, promises, and native events into a single re-render; React 17 only batched inside React event handlers.
26. Q4: Why does mutating state (`state.x = 5`) not trigger a re-render?
27. A) Mutation is faster than setState
28. B) React disables mutation in StrictMode
29. C) React compares state by reference and the reference didn't change (*)
30. D) Mutation throws an error
31. Explanation: React's bail-out check uses `Object.is` on the new state vs the old; mutating in place leaves the reference identical, so it skips the re-render.
32. Q5: What is the difference between `e.target` and `e.currentTarget`?
33. A) They are identical
34. B) `target` is the parent; `currentTarget` is the child
35. C) `currentTarget` is deprecated
36. D) `target` is the element that fired the event; `currentTarget` is the element the listener is attached to (*)
37. Explanation: `target` may be a descendant (e.g. a span inside a button); `currentTarget` is always the element where the handler is registered.
38. Q6: When you read a state variable immediately after `setState`, what value do you see?
39. A) The old value (*)
40. B) The new value
41. C) undefined
42. D) A Promise
43. Explanation: `setState` schedules an update; the local variable in the current render scope is unchanged. Read the new value in the next render or inside a `useEffect`.
44. Q7: Which is the correct way to add an item immutably to an array state?
45. A) items.push(newItem)
46. B) setItems([...items, newItem]) (*)
47. C) items[items.length] = newItem
48. D) setItems(items.concat()) — without newItem
49. Explanation: Always return a new array: `[...items, newItem]` (or `items.concat(newItem)`). Mutation via `push` won't trigger a re-render.
50. Q8: When should you group related state into one object vs multiple useState calls?
51. A) Always group into one object
52. B) Always split into separate states
53. C) Group when pieces change together; split when they change independently (*)
54. D) Use useReducer for everything
55. Explanation: Group state that changes together to avoid inconsistent intermediate states; split independent pieces so each can update without re-rendering the others.
56. Q9: Which event type should you use for a form submission?
57. A) onClick on the button
58. B) onChange on the form
59. C) onInput on the button
60. D) onSubmit on the form (*)
61. Explanation: Forms should use `onSubmit` so Enter-to-submit and accessibility work; call `e.preventDefault()` to avoid a full page reload.
62. Q10: SyntheticEvent in React is...
63. A) A wrapper around the native event that normalizes behavior across browsers (*)
64. B) A native DOM event
65. C) A custom event type from TypeScript
66. D) An experimental API
67. Explanation: SyntheticEvents wrap native events to provide consistent behavior across browsers; they pool events in React 16 (de-pooled in 17+).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why does `setCount(count + 1); setCount(count + 1)` only increment once?
  options:
    - React dedupes identical calls
    - setState is synchronous
    - StrictMode disables it
    - Both calls read the same `count` from the closure
  correctIndex: 3
  explanation: Both calls close over the same `count` value from the render; use the functional form `setCount(c => c + 1)` to chain updates correctly.
- id: q2
  question: Which update form is safest when computing next state from previous?
  options:
    - setX(prev => prev + 1)
    - setX(x + 1)
    - setX(() => x + 1)
    - x = x + 1
  correctIndex: 0
  explanation: The functional form receives the latest state, so it works correctly even when multiple updates are batched together.
- id: q3
  question: What is automatic batching in React 18?
  options:
    - Multiple components are batched into one file
    - Updates inside setTimeout are batched too
    - All setState calls become synchronous
    - StrictMode is enabled by default
  correctIndex: 1
  explanation: React 18 batches updates across event handlers, timeouts, promises, and native events into a single re-render; React 17 only batched inside React event handlers.
- id: q4
  question: Why does mutating state (`state.x = 5`) not trigger a re-render?
  options:
    - Mutation is faster than setState
    - React disables mutation in StrictMode
    - React compares state by reference and the reference didn't change
    - Mutation throws an error
  correctIndex: 2
  explanation: React's bail-out check uses `Object.is` on the new state vs the old; mutating in place leaves the reference identical, so it skips the re-render.
- id: q5
  question: What is the difference between `e.target` and `e.currentTarget`?
  options:
    - They are identical
    - "`target` is the parent; `currentTarget` is the child"
    - "`currentTarget` is deprecated"
    - "`target` is the element that fired the event; `currentTarget` is the element the listener is attached to"
  correctIndex: 3
  explanation: "`target` may be a descendant (e.g. a span inside a button); `currentTarget` is always the element where the handler is registered."
- id: q6
  question: When you read a state variable immediately after `setState`, what value do you see?
  options:
    - The old value
    - The new value
    - undefined
    - A Promise
  correctIndex: 0
  explanation: "`setState` schedules an update; the local variable in the current render scope is unchanged. Read the new value in the next render or inside a `useEffect`."
- id: q7
  question: Which is the correct way to add an item immutably to an array state?
  options:
    - items.push(newItem)
    - setItems([...items, newItem])
    - items[items.length] = newItem
    - setItems(items.concat()) — without newItem
  correctIndex: 1
  explanation: "Always return a new array: `[...items, newItem]` (or `items.concat(newItem)`). Mutation via `push` won't trigger a re-render."
- id: q8
  question: When should you group related state into one object vs multiple useState calls?
  options:
    - Always group into one object
    - Always split into separate states
    - Group when pieces change together; split when they change independently
    - Use useReducer for everything
  correctIndex: 2
  explanation: Group state that changes together to avoid inconsistent intermediate states; split independent pieces so each can update without re-rendering the others.
- id: q9
  question: Which event type should you use for a form submission?
  options:
    - onClick on the button
    - onChange on the form
    - onInput on the button
    - onSubmit on the form
  correctIndex: 3
  explanation: Forms should use `onSubmit` so Enter-to-submit and accessibility work; call `e.preventDefault()` to avoid a full page reload.
- id: q10
  question: SyntheticEvent in React is...
  options:
    - A wrapper around the native event that normalizes behavior across browsers
    - A native DOM event
    - A custom event type from TypeScript
    - An experimental API
  correctIndex: 0
  explanation: SyntheticEvents wrap native events to provide consistent behavior across browsers; they pool events in React 16 (de-pooled in 17+).
```

