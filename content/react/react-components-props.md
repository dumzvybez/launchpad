---
slug: react-components-props
id: react-03
track: react
order: 3
title: Components and Props
description: Build reusable components, define prop contracts with TypeScript, compose components via children, and master the unidirectional data flow that defines React.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=120s
whyItMatters: Build reusable components, define prop contracts with TypeScript, compose components via children, and master the unidirectional data flow that defines React.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Components and Props

## Components and Props

### Why It Matters

Build reusable components, define prop contracts with TypeScript, compose components via children, and master the unidirectional data flow that defines React.

Build reusable components, define prop contracts with TypeScript, compose components via children, and master the unidirectional data flow that defines React.

### Prerequisites

- Stage 2: JSX Fundamentals and the Virtual DOM.
- TypeScript basics: interfaces, type aliases, generics.

### Topics

- Functional components (function vs arrow)
- Props: passing, destructuring, default values
- TypeScript prop types and `React.FC` debate
- Children and composition patterns
- Passing functions, objects, and JSX as props
- The `children` prop and `ReactNode` vs `ReactElement`
- Spread props and prop drilling (introduction)
- Specialization via composition

### Key Concepts

- Props are read-only inside a component — never mutate them
- Data flows down (props); events flow up (callbacks) — "one-way binding"
- Components compose: parent passes children, child renders them where desired
- `ReactNode` accepts strings, numbers, elements, arrays, fragments, null; `ReactElement` only accepts elements
- Specialization: instead of inheritance, compose a generic component with a specific wrapper

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ label, variant = "primary", disabled, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
```
Caption: Typed props with destructuring

### Common Pitfalls

- Mutating props inside a component — props are read-only; derive new state instead. Mutating props breaks React's reconciliation.
- Using `React.FC` in 2024 — it adds an implicit `children` prop and an empty return type; prefer plain function declarations with explicit prop types.
- Spreading `...props` blindly onto a DOM element — unknown attributes leak to the DOM and React warns. Destructure known keys and spread the rest into a typed object.
- Passing new object/array literals as props every render — causes child re-renders; memoize (Stage 13) or hoist the constant.
- Confusing `ReactNode` with `ReactElement` — `ReactNode` includes strings, numbers, null, fragments; `ReactElement` is only JSX elements.

### Real-World Applications

- Material UI (MUI) and Chakra UI are pure component libraries built on the composition model — `<Box>`, `<Stack>`, `<Card>` all use `children` and `sx`/style props.
- Stripe's hosted payment elements embed React components (`<CardElement>`, `<PaymentRequestButton>`) into merchants' checkouts with strictly-typed props.
- GitHub's Primer React components power the issue/PR UI; everything is composed from primitive `<Box>` and `<Text>` components.
- Linear's entire UI is composed from a small set of primitive components with strict TypeScript prop contracts.

### Interview Questions

- 1. Can a component modify its own props? — No; props are read-only. If you need to change a value, lift state up or use local state.
- 2. What is prop drilling and why is it a smell? — Passing props through many levels; it couples intermediate components to data they don't use. Solution: context (Stage 10) or composition.
- 3. `ReactNode` vs `ReactElement`? — `ReactNode` = anything renderable (string, number, null, element, array); `ReactElement` = only a JSX element object.
- 4. Why avoid `React.FC`? — It implicitly adds `children`, doesn't reflect generics well, and historically typed return as `JSX.Element | null`; plain functions with explicit prop types are cleaner.
- 5. How do you set a default prop value with destructuring? — Use `function C({ size = 12 }: Props)`; defaults live with the destructure, not as a separate `defaultProps` (deprecated for function components).

### Mini Project

Build a small design system: a `Card`, `Button`, and `Avatar` component set, then assemble a `UserProfile` component that composes all three. Each component must have a typed prop interface, sensible defaults, and a `children` slot where appropriate. Suggested approach:
  - Define `ButtonProps` with `variant`, `size`, `onClick`, and `children`
  - Make `Avatar` accept `src`, `alt`, `size`, and a `fallback` ReactNode
  - `Card` accepts `title`, `footer?`, and `children`
  - `UserProfile` composes Card + Avatar + two Buttons
  - Export everything from an `index.ts` barrel file

### Exercises

1. Write a `Greeting` component that takes `{ name: string; enthusiastic?: boolean }` and shows "Hi!" or "HI!!!" based on the flag.
2. Convert a `React.FC`-typed component to a plain function with an explicit prop type.
3. Build a `Layout` component that accepts `header`, `sidebar`, and `children` and renders them in a grid.
4. Spread known props onto a button while filtering out a custom `trackingId` prop.
5. Create an `IconButton` that wraps `Button` and prepends an SVG icon.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Can a React component mutate its own props?
9. A) Yes, any time
10. B) Only inside useEffect
11. C) No — props are read-only (*)
12. D) Only in class components
13. Explanation: Props are read-only inside a component; mutating them breaks reconciliation and violates React's data-flow model.
14. Q2: Which TypeScript type accepts "any renderable value" (string, number, element, null)?
15. A) ReactElement
16. B) JSX.Element
17. C) Component
18. D) ReactNode (*)
19. Explanation: `ReactNode` is the union of strings, numbers, booleans, elements, fragments, arrays, and null — i.e. anything React can render.
20. Q3: What is "prop drilling"?
21. A) Passing props through several layers of components that don't use them (*)
22. B) Using a drill-down context menu
23. C) Destructuring props at every level
24. D) Spreading props onto a child
25. Explanation: Prop drilling is when intermediate components forward props they don't use, increasing coupling; context or composition is the fix.
26. Q4: Why is `React.FC` discouraged in modern React?
27. A) It is deprecated and removed
28. B) It implicitly adds `children` and historically had weak return typing (*)
29. C) It does not support TypeScript
30. D) It only works with class components
31. Explanation: `React.FC` implicitly includes `children`, complicates generics, and historically returned `JSX.Element | null`; plain function components with explicit prop types are preferred.
32. Q5: How do you set a default prop value in a function component?
33. A) `Button.defaultProps = {...}`
34. B) Inside useState initializer
35. C) Destructure with a default: `function C({ size = 12 }: Props)` (*)
36. D) Inside useEffect
37. Explanation: `defaultProps` is deprecated for function components; use default values in the destructuring pattern instead.
38. Q6: What happens if you spread `{...props}` containing a non-DOM attribute onto a `<button>`?
39. A) React throws immediately
40. B) Nothing — React silently drops it
41. C) React creates a custom element
42. D) React warns and the attribute may leak to the DOM as an unknown attribute (*)
43. Explanation: Unknown props on DOM elements trigger a dev warning and React may render them as lowercase HTML attributes; destructure out non-DOM keys first.
44. Q7: What is the recommended way to specialize a generic component?
45. A) Composition — wrap the generic component in a specific one (*)
46. B) Class inheritance
47. C) Higher-order memoization
48. D) Re-export with new types
49. Explanation: React favors composition over inheritance; wrap a generic component (e.g. `<Button variant="primary">`) instead of subclassing.
50. Q8: Which is true about the `children` prop?
51. A) It must always be a single element
52. B) It can be a string, number, element, array, or null (*)
53. C) It is automatically memoized
54. D) It is only available with React.FC
55. Explanation: `children` is a `ReactNode` — it accepts anything renderable, including arrays and fragments.
56. Q9: When you pass `onClick={() => doThing()}` as a prop, what is being passed?
57. A) The result of doThing()
58. B) A memoized function
59. C) A new function reference each render (*)
60. D) A string of code
61. Explanation: The arrow function creates a new function each render — important for memoization (Stage 8) and `useCallback`.
62. Q10: Which prop pattern lets a parent fully control what goes inside a component?
63. A) Using `useState` in the child
64. B) Hardcoding content in the child
65. C) Using `useContext`
66. D) Passing JSX via the `children` prop (*)
67. Explanation: The `children` prop lets parents inject any JSX into a component's layout — the core composition pattern in React.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Can a React component mutate its own props?
  options:
    - Yes, any time
    - Only inside useEffect
    - No — props are read-only
    - Only in class components
  correctIndex: 2
  explanation: Props are read-only inside a component; mutating them breaks reconciliation and violates React's data-flow model.
- id: q2
  question: Which TypeScript type accepts "any renderable value" (string, number, element, null)?
  options:
    - ReactElement
    - JSX.Element
    - Component
    - ReactNode
  correctIndex: 3
  explanation: "`ReactNode` is the union of strings, numbers, booleans, elements, fragments, arrays, and null — i.e. anything React can render."
- id: q3
  question: What is "prop drilling"?
  options:
    - Passing props through several layers of components that don't use them
    - Using a drill-down context menu
    - Destructuring props at every level
    - Spreading props onto a child
  correctIndex: 0
  explanation: Prop drilling is when intermediate components forward props they don't use, increasing coupling; context or composition is the fix.
- id: q4
  question: Why is `React.FC` discouraged in modern React?
  options:
    - It is deprecated and removed
    - It implicitly adds `children` and historically had weak return typing
    - It does not support TypeScript
    - It only works with class components
  correctIndex: 1
  explanation: "`React.FC` implicitly includes `children`, complicates generics, and historically returned `JSX.Element | null`; plain function components with explicit prop types are preferred."
- id: q5
  question: How do you set a default prop value in a function component?
  options:
    - "`Button.defaultProps = {...}`"
    - Inside useState initializer
    - "Destructure with a default: `function C({ size = 12 }: Props)`"
    - Inside useEffect
  correctIndex: 2
  explanation: "`defaultProps` is deprecated for function components; use default values in the destructuring pattern instead."
- id: q6
  question: What happens if you spread `{...props}` containing a non-DOM attribute onto a `<button>`?
  options:
    - React throws immediately
    - Nothing — React silently drops it
    - React creates a custom element
    - React warns and the attribute may leak to the DOM as an unknown attribute
  correctIndex: 3
  explanation: Unknown props on DOM elements trigger a dev warning and React may render them as lowercase HTML attributes; destructure out non-DOM keys first.
- id: q7
  question: What is the recommended way to specialize a generic component?
  options:
    - Composition — wrap the generic component in a specific one
    - Class inheritance
    - Higher-order memoization
    - Re-export with new types
  correctIndex: 0
  explanation: React favors composition over inheritance; wrap a generic component (e.g. `<Button variant="primary">`) instead of subclassing.
- id: q8
  question: Which is true about the `children` prop?
  options:
    - It must always be a single element
    - It can be a string, number, element, array, or null
    - It is automatically memoized
    - It is only available with React.FC
  correctIndex: 1
  explanation: "`children` is a `ReactNode` — it accepts anything renderable, including arrays and fragments."
- id: q9
  question: When you pass `onClick={() => doThing()}` as a prop, what is being passed?
  options:
    - The result of doThing()
    - A memoized function
    - A new function reference each render
    - A string of code
  correctIndex: 2
  explanation: The arrow function creates a new function each render — important for memoization (Stage 8) and `useCallback`.
- id: q10
  question: Which prop pattern lets a parent fully control what goes inside a component?
  options:
    - Using `useState` in the child
    - Hardcoding content in the child
    - Using `useContext`
    - Passing JSX via the `children` prop
  correctIndex: 3
  explanation: The `children` prop lets parents inject any JSX into a component's layout — the core composition pattern in React.
```

