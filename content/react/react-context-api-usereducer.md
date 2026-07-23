---
slug: react-context-api-usereducer
id: react-10
track: react
order: 10
title: Context API and useReducer
description: Share state across deep trees with Context, manage complex state transitions with `useReducer`, and combine the two for a lightweight global store.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=540s
whyItMatters: Share state across deep trees with Context, manage complex state transitions with `useReducer`, and combine the two for a lightweight global store.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Context API and useReducer

## Context API and useReducer

### Why It Matters

Share state across deep trees with Context, manage complex state transitions with `useReducer`, and combine the two for a lightweight global store.

Share state across deep trees with Context, manage complex state transitions with `useReducer`, and combine the two for a lightweight global store.

### Prerequisites

- Stage 9: Custom Hooks.
- Reducer pattern (action -> state) from Redux/Flux concepts.

### Topics

- `createContext`, `Provider`, `useContext`
- Default values and the "must be inside provider" guard
- `useReducer` basics: state, dispatch, reducer
- Discriminated-union actions in TypeScript
- Combining Context + `useReducer` for a global store
- Context performance: re-render scope and selector patterns
- When to use Context vs an external store (Stage 16)
- Splitting contexts to limit re-render blast radius

### Key Concepts

- Context provides values to a subtree without prop drilling
- Every consumer re-renders when the provider's value changes — context is NOT a performance optimization
- `useReducer` is preferred over multiple `useState`s when state transitions are related and complex
- Reducers must be pure: same state + action -> same next state, no side effects
- Splitting state into multiple contexts (e.g. `AuthContext` + `ThemeContext`) limits re-renders to consumers that actually use the changed value

```tsx
type CounterState = { count: number };
type CounterAction = { type: "inc" } | { type: "dec" } | { type: "reset" };

function reducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "inc":   return { count: state.count + 1 };
    case "dec":   return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
      <button onClick={() => dispatch({ type: "dec" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```
Caption: useReducer

### Common Pitfalls

- Using Context as a performance optimization — every consumer re-renders when the value changes; for high-frequency updates use an external store (Stage 16) or selectors.
- Forgetting to memoize the provider value — passing a fresh object literal `value={{ state, dispatch }}` causes every consumer to re-render on every provider render. Memoize with `useMemo`.
- Throwing on null context in a test that forgot the provider — always wrap test components in the provider or provide a sensible default.
- Side effects inside a reducer — reducers must be pure; do async work in effects and dispatch the result, not the API call.
- One giant context for everything — split into focused contexts (auth, theme, cart) so a theme change doesn't re-render the cart list.

### Real-World Applications

- Shopify's Polaris components use Context to share theme and app-level config across deeply nested UI.
- Radix UI uses Context to coordinate Popover/Dialog trigger and content state across siblings.
- Notion uses reducers for collaborative block state — every keystroke dispatches an action that updates the tree deterministically.
- Adobe's React Aria uses Context to propagate accessibility labels and locale to all primitives in a subtree.

### Interview Questions

- 1. Is Context a performance optimization? — No; every consumer re-renders when the value changes. Use it for low-frequency shared state (theme, auth, locale).
- 2. Why use `useReducer` over multiple `useState`s? — When state pieces change together or transitions are complex; the reducer centralizes logic and makes it testable.
- 3. Must reducers be pure? — Yes; same state + action -> same next state. Side effects belong in effects that dispatch actions.
- 4. Why split Context? — A single context re-renders all consumers when any value changes; splitting limits the blast radius to consumers of the changed value.
- 5. How do you prevent the "must be used inside provider" error in tests? — Wrap the test component in the provider, or export a `useXSafe` variant that returns null/default.

### Mini Project

Build a "Multi-cart Storefront": An app with two pages (products, cart) sharing cart state via Context + `useReducer`. The cart supports add, remove, and quantity change. Display a live cart badge in the header that updates only when the cart changes. Suggested approach:
  - Define `cartReducer` and `CartProvider`
  - Use `useMemo` on the provider value to prevent re-renders when parent re-renders
  - Create a `useCart()` hook that throws if used outside the provider
  - Split the badge into its own context if its re-render frequency differs
  - Add a products page dispatching `add` actions

### Exercises

1. Convert a 5-field form using 5 `useState` calls into a `useReducer` form.
2. Build a `ThemeProvider` that toggles between light/dark via Context.
3. Add a TypeScript exhaustive check (`const _: never = action`) to a reducer's default case.
4. Split a single mega-context into two focused contexts and confirm unrelated consumers stop re-rendering.
5. Write a test that asserts `useCart` throws when rendered without a provider.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is React Context a performance optimization?
9. A) Yes — it prevents re-renders
10. B) No — every consumer re-renders when the provider value changes (*)
11. C) Only with React.memo
12. D) Only in production
13. Explanation: Context avoids prop drilling, not re-renders; every consumer re-renders whenever the provider's value changes by reference.
14. Q2: What's the signature of `useReducer`?
15. A) useReducer(initialState)
16. B) useReducer(reducer, initialArg, init)
17. C) useReducer(reducer, initialState) (*)
18. D) Both B and C are valid signatures
19. Explanation: `useReducer(reducer, initialState)` is the basic form; the third `init` arg is optional for lazy initialization: `useReducer(reducer, initialArg, init)`.
20. Q3: Why must reducers be pure?
21. A) Because React forbids impure code
22. B) For TypeScript reasons
23. C) To avoid memoization
24. D) So they can be tested in isolation and run safely under StrictMode's double-invoke (*)
25. Explanation: Pure reducers (same input -> same output, no side effects) are testable and safe under StrictMode double-invoke; do async work in effects, not the reducer.
26. Q4: Why memoize the `value` of a Context.Provider?
27. A) A fresh object every render causes every consumer to re-render even if nothing changed (*)
28. B) To prevent stale closures
29. C) It's required by TypeScript
30. D) To enable async updates
31. Explanation: Context compares value by reference; a new object literal each render triggers all consumers. Memoize with `useMemo`.
32. Q5: How do you guard a context hook against being used outside its provider?
33. A) Use a default value
34. B) Throw if `useContext` returns null (*)
35. C) Use a ref
36. D) Use try/catch
37. Explanation: Initialize the context with `null` and throw an explicit error in the hook when `useContext` returns null, giving callers a clear "must be inside provider" message.
38. Q6: What does the TypeScript exhaustive-union check (`const _: never = action`) do in a reducer's default case?
39. A) Throws at runtime if an action is missing
40. B) Skips the default case
41. C) Produces a compile error if you add a new action variant but forget to handle it (*)
42. D) Memoizes the action
43. Explanation: Assigning the action to `never` after the switch forces a type error whenever a new discriminated-union member isn't handled — compile-time exhaustiveness.
44. Q7: Why split state across multiple contexts?
45. A) To use less memory
46. B) It's required for TypeScript
47. C) To enable hooks
48. D) To limit re-renders to consumers of the changed value (*)
49. Explanation: A single context re-renders all consumers when any value changes; splitting by concern (auth, theme, cart) limits the blast radius.
50. Q8: When should you reach for an external store (Zustand, Redux) instead of Context?
51. A) For high-frequency updates or when only selected consumers should re-render (*)
52. B) Never — Context is enough
53. C) Only in class components
54. D) Only for forms
55. Explanation: External stores with selectors let only the consumers reading the changed slice re-render — far better than Context for high-frequency or large shared state.
56. Q9: What's a common bug when consuming a context with `useContext`?
57. A) Forgetting to call it
58. B) Forgetting the provider, getting the default (often null), then crashing on `.x` (*)
59. C) Using it in a class component
60. D) Calling it after a return
61. Explanation: Without a provider, `useContext` returns the default; accessing fields on `null` throws. Throw on null in your hook to fail fast with a clear message.
62. Q10: Which is a sign you should move from useState to useReducer?
63. A) You have one boolean
64. B) You have a single number
65. C) Multiple state pieces transition together and the logic is complex (*)
66. D) You want fewer imports
67. Explanation: When several state fields change together or transitions involve complex rules, a reducer centralizes and tests that logic more clearly than multiple `useState` calls.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is React Context a performance optimization?
  options:
    - Yes — it prevents re-renders
    - No — every consumer re-renders when the provider value changes
    - Only with React.memo
    - Only in production
  correctIndex: 1
  explanation: Context avoids prop drilling, not re-renders; every consumer re-renders whenever the provider's value changes by reference.
- id: q2
  question: What's the signature of `useReducer`?
  options:
    - useReducer(initialState)
    - useReducer(reducer, initialArg, init)
    - useReducer(reducer, initialState)
    - Both B and C are valid signatures
  correctIndex: 2
  explanation: "`useReducer(reducer, initialState)` is the basic form; the third `init` arg is optional for lazy initialization: `useReducer(reducer, initialArg, init)`."
- id: q3
  question: Why must reducers be pure?
  options:
    - Because React forbids impure code
    - For TypeScript reasons
    - To avoid memoization
    - So they can be tested in isolation and run safely under StrictMode's double-invoke
  correctIndex: 3
  explanation: Pure reducers (same input -> same output, no side effects) are testable and safe under StrictMode double-invoke; do async work in effects, not the reducer.
- id: q4
  question: Why memoize the `value` of a Context.Provider?
  options:
    - A fresh object every render causes every consumer to re-render even if nothing changed
    - To prevent stale closures
    - It's required by TypeScript
    - To enable async updates
  correctIndex: 0
  explanation: Context compares value by reference; a new object literal each render triggers all consumers. Memoize with `useMemo`.
- id: q5
  question: How do you guard a context hook against being used outside its provider?
  options:
    - Use a default value
    - Throw if `useContext` returns null
    - Use a ref
    - Use try/catch
  correctIndex: 1
  explanation: Initialize the context with `null` and throw an explicit error in the hook when `useContext` returns null, giving callers a clear "must be inside provider" message.
- id: q6
  question: "What does the TypeScript exhaustive-union check (`const _: never = action`) do in a reducer's default case?"
  options:
    - Throws at runtime if an action is missing
    - Skips the default case
    - Produces a compile error if you add a new action variant but forget to handle it
    - Memoizes the action
  correctIndex: 2
  explanation: Assigning the action to `never` after the switch forces a type error whenever a new discriminated-union member isn't handled — compile-time exhaustiveness.
- id: q7
  question: Why split state across multiple contexts?
  options:
    - To use less memory
    - It's required for TypeScript
    - To enable hooks
    - To limit re-renders to consumers of the changed value
  correctIndex: 3
  explanation: A single context re-renders all consumers when any value changes; splitting by concern (auth, theme, cart) limits the blast radius.
- id: q8
  question: When should you reach for an external store (Zustand, Redux) instead of Context?
  options:
    - For high-frequency updates or when only selected consumers should re-render
    - Never — Context is enough
    - Only in class components
    - Only for forms
  correctIndex: 0
  explanation: External stores with selectors let only the consumers reading the changed slice re-render — far better than Context for high-frequency or large shared state.
- id: q9
  question: What's a common bug when consuming a context with `useContext`?
  options:
    - Forgetting to call it
    - Forgetting the provider, getting the default (often null), then crashing on `.x`
    - Using it in a class component
    - Calling it after a return
  correctIndex: 1
  explanation: Without a provider, `useContext` returns the default; accessing fields on `null` throws. Throw on null in your hook to fail fast with a clear message.
- id: q10
  question: Which is a sign you should move from useState to useReducer?
  options:
    - You have one boolean
    - You have a single number
    - Multiple state pieces transition together and the logic is complex
    - You want fewer imports
  correctIndex: 2
  explanation: When several state fields change together or transitions involve complex rules, a reducer centralizes and tests that logic more clearly than multiple `useState` calls.
```

