---
slug: react-jsx-fundamentals-virtual-dom
id: react-02
track: react
order: 2
title: JSX Fundamentals and the Virtual DOM
description: Master JSX syntax, expression interpolation, conditional rendering inside JSX, and how JSX compiles to `React.createElement` calls that build the virtual DOM.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=60s
whyItMatters: Master JSX syntax, expression interpolation, conditional rendering inside JSX, and how JSX compiles to `React. createElement` calls that build the virtual DOM.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# JSX Fundamentals and the Virtual DOM

## JSX Fundamentals and the Virtual DOM

### Why It Matters

Master JSX syntax, expression interpolation, conditional rendering inside JSX, and how JSX compiles to `React. createElement` calls that build the virtual DOM.

Master JSX syntax, expression interpolation, conditional rendering inside JSX, and how JSX compiles to `React.createElement` calls that build the virtual DOM.

### Prerequisites

- Stage 1: Getting Started with React.
- ES6+ JavaScript: arrow functions, destructuring, template literals, spread.

### Topics

- JSX syntax rules and why it looks like HTML
- Embedding expressions with `{}`
- Conditional expressions: ternaries, `&&`, IIFEs
- Lists and `map` inside JSX
- The `key` prop (deep-dive in Stage 5)
- className vs class, htmlFor vs for
- Self-closing tags and fragments (`<>...</>` and `<Fragment>`)
- How Babel/the modern JSX transform compiles JSX

### Key Concepts

- JSX is syntactic sugar for `React.createElement(component, props, ...children)`
- The modern transform (`automatic`) imports `jsx` from `react/jsx-runtime` — no need to import React
- JSX expressions are JavaScript values — you can pass them around, store in variables, return from functions
- React elements are immutable descriptions of UI; reconciliation diffs them
- Fragments let you return multiple elements without a wrapper DOM node

```tsx
function Greeting({ name, isMember }: { name: string; isMember: boolean }) {
  return (
    <div className="greeting">
      <h1>Hello, {name || "Guest"}!</h1>
      {isMember ? (
        <p>Welcome back — your points are visible.</p>
      ) : (
        <p>Sign up to start earning points.</p>
      )}
      {isMember && <Badge text="VIP" />}
    </div>
  );
}
```
Caption: Expressions and conditionals

### Common Pitfalls

- Using `class` instead of `className` — `class` is a reserved word; React DOM uses `className`, `htmlFor`, and other camelCased DOM attributes.
- Returning multiple sibling elements without a fragment — JSX requires a single root; wrap in `<>...</>` or `React.Fragment`.
- Forgetting that `{cond && <X/>}` renders `0` or `""` when `cond` is falsy but numeric/empty string — coerce with `Boolean(cond)` or use a ternary.
- Using `if` inside JSX — JSX allows expressions only; use ternaries, `&&`, or extract into a function/IIFE.
- Putting comments inside JSX as `// ...` — JSX treats `{/* ... */}` as comment syntax; `//` outside braces breaks the parser.

### Real-World Applications

- Airbnb's listing cards are large JSX trees with conditional badges (Superhost, Instant Book) and price displays — perfect examples of conditional rendering in JSX.
- Netflix's title rows on the home screen map over hundreds of titles; each card is a memoized JSX component to keep scrolling smooth.
- Discord's message rendering uses JSX to combine user mentions, emoji, embeds, and code blocks with rich conditionals.
- Notion's block renderer emits JSX per block type (paragraph, heading, todo, callout) keyed by block ID.

### Interview Questions

- 1. What is JSX? — Syntactic sugar for `React.createElement` calls; lets you write HTML-like markup that compiles to function calls producing React elements.
- 2. Why must you use `className` not `class`? — `class` is a reserved word in JS and React normalizes DOM attributes to camelCase (`className`, `htmlFor`, `tabIndex`).
- 3. What does `{false && <X/>}` render? — Nothing — JSX skips `false`, `null`, `undefined`, and `true` as children; but `{0 && <X/>}` renders the `0`.
- 4. What is a fragment and why use it? — A wrapper that groups children without adding a DOM node, avoiding extra `<div>` wrappers that break CSS grid/flex layouts.
- 5. Does JSX require importing React? — Not since the automatic transform (React 17+); `react/jsx-runtime` is imported automatically by the compiler.

### Mini Project

Build a "User Profile Card" renderer: A component that takes a `user` object (name, avatar URL, role, isOnline, badges[]) and renders a styled card using conditionals, fragments, and `map`. The card shows the avatar, name with an online dot, role, and a horizontal list of badges. Suggested approach:
  - Define a `User` TypeScript interface for the prop
  - Use `Boolean(user.isOnline)` to gate the green dot
  - Map `badges` to `<span className="badge">` elements with stable keys
  - Use a fragment to group the avatar + name without an extra wrapper
  - Show a fallback `<div className="avatar-placeholder">` when `avatarUrl` is missing

### Exercises

1. Write a component that renders either "Even" or "Odd" based on a `number` prop using a ternary.
2. Refactor a multi-return component to use fragments instead of wrapping `<div>`s.
3. Add inline comments to a JSX block using `{/* ... */}` syntax.
4. Inspect the compiled output by running `npx vite build` and searching the bundle for `_jsx` calls.
5. Render a list of 5 fruits with `map` and observe the console warning when `key` is missing — fix it.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute do you use in JSX to set an element's CSS class?
9. A) class
10. B) className (*)
11. C) styleClass
12. D) classes
13. Explanation: `class` is a reserved word in JavaScript; React DOM attributes are camelCased, so use `className`.
14. Q2: What does `{0 && <Component/>}` render?
15. A) Nothing
16. B) An empty string
17. C) The number 0 (*)
18. D) The component
19. Explanation: `&&` returns its left operand when it is falsy; JSX renders `0` as text. Coerce with `Boolean(0) && ...` or use a ternary.
20. Q3: Which is a valid JSX comment?
21. A) // comment
22. B) <!-- comment -->
23. C) # comment
24. D) {/* comment */} (*)
25. Explanation: JSX comments must be wrapped in braces and use the `/* ... */` block syntax: `{/* comment */}`.
26. Q4: Why use a Fragment instead of a wrapping `<div>`?
27. A) Fragments group children without adding a DOM node, preserving CSS layout semantics (*)
28. B) Fragments render faster than divs
29. C) Fragments enable concurrent rendering
30. D) Fragments are required for hooks
31. Explanation: Fragments avoid extra DOM nodes that could break CSS grid/flex children or table structure.
32. Q5: Since React 17+, do you need `import React from "react"` for JSX?
33. A) Yes, always
34. B) No — the automatic transform imports from `react/jsx-runtime` for you (*)
35. C) Only with TypeScript
36. D) Only in production
37. Explanation: The modern `automatic` JSX runtime injects `import { jsx } from "react/jsx-runtime"` for you, so explicit React imports are no longer needed just for JSX.
38. Q6: Which of these is NOT a valid JSX child that renders something?
39. A) "text"
40. B) {42}
41. C) {false} (*)
42. D) <span>x</span>
43. Explanation: JSX renders strings, numbers, and elements; `false`, `null`, `undefined`, and `true` are all skipped (render nothing).
44. Q7: What does `<button onClick={handleClick}>` compile to (classic transform)?
45. A) document.createElement("button")
46. B) new React.Button({ onClick: handleClick })
47. C) jsx("button", { onClick: handleClick })
48. D) React.createElement("button", { onClick: handleClick }) (*)
49. Explanation: The classic transform produces `React.createElement("button", { onClick: handleClick })`; the modern automatic transform uses `jsx(...)` from `react/jsx-runtime`.
50. Q8: Which attribute name is correct in JSX for a label's "for" relationship?
51. A) htmlFor (*)
52. B) for
53. C) forId
54. D) labelFor
55. Explanation: Same rule as `className`: `for` is a reserved word in JS; use `htmlFor` in JSX.
56. Q9: Why can't you use an `if` statement directly inside JSX?
57. A) `if` is slower than ternaries
58. B) JSX only accepts expressions, not statements; `if` is a statement (*)
59. C) ESLint disables `if` in JSX
60. D) `if` is a reserved word in JSX
61. Explanation: JSX curly braces accept any expression; `if` is a statement, so you use ternaries, `&&`, IIFEs, or extract logic to a function.
62. Q10: Which best describes a React element produced by JSX?
63. A) A real DOM node
64. B) A mutable state container
65. C) An immutable description of what should be rendered (*)
66. D) A JSX AST node
67. Explanation: A React element is an immutable object describing a piece of UI; React reconciles the element tree against the previous one to compute DOM updates.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute do you use in JSX to set an element's CSS class?
  options:
    - class
    - className
    - styleClass
    - classes
  correctIndex: 1
  explanation: "`class` is a reserved word in JavaScript; React DOM attributes are camelCased, so use `className`."
- id: q2
  question: What does `{0 && <Component/>}` render?
  options:
    - Nothing
    - An empty string
    - The number 0
    - The component
  correctIndex: 2
  explanation: "`&&` returns its left operand when it is falsy; JSX renders `0` as text. Coerce with `Boolean(0) && ...` or use a ternary."
- id: q3
  question: Which is a valid JSX comment?
  options:
    - // comment
    - <!-- comment -->
    - "# comment"
    - "{/* comment */}"
  correctIndex: 3
  explanation: "JSX comments must be wrapped in braces and use the `/* ... */` block syntax: `{/* comment */}`."
- id: q4
  question: Why use a Fragment instead of a wrapping `<div>`?
  options:
    - Fragments group children without adding a DOM node, preserving CSS layout semantics
    - Fragments render faster than divs
    - Fragments enable concurrent rendering
    - Fragments are required for hooks
  correctIndex: 0
  explanation: Fragments avoid extra DOM nodes that could break CSS grid/flex children or table structure.
- id: q5
  question: Since React 17+, do you need `import React from "react"` for JSX?
  options:
    - Yes, always
    - No — the automatic transform imports from `react/jsx-runtime` for you
    - Only with TypeScript
    - Only in production
  correctIndex: 1
  explanation: The modern `automatic` JSX runtime injects `import { jsx } from "react/jsx-runtime"` for you, so explicit React imports are no longer needed just for JSX.
- id: q6
  question: Which of these is NOT a valid JSX child that renders something?
  options:
    - '"text"'
    - "{42}"
    - "{false}"
    - <span>x</span>
  correctIndex: 2
  explanation: JSX renders strings, numbers, and elements; `false`, `null`, `undefined`, and `true` are all skipped (render nothing).
- id: q7
  question: What does `<button onClick={handleClick}>` compile to (classic transform)?
  options:
    - document.createElement("button")
    - "new React.Button({ onClick: handleClick })"
    - 'jsx("button", { onClick: handleClick })'
    - 'React.createElement("button", { onClick: handleClick })'
  correctIndex: 3
  explanation: 'The classic transform produces `React.createElement("button", { onClick: handleClick })`; the modern automatic transform uses `jsx(...)` from `react/jsx-runtime`.'
- id: q8
  question: Which attribute name is correct in JSX for a label's "for" relationship?
  options:
    - htmlFor
    - for
    - forId
    - labelFor
  correctIndex: 0
  explanation: "Same rule as `className`: `for` is a reserved word in JS; use `htmlFor` in JSX."
- id: q9
  question: Why can't you use an `if` statement directly inside JSX?
  options:
    - "`if` is slower than ternaries"
    - JSX only accepts expressions, not statements; `if` is a statement
    - ESLint disables `if` in JSX
    - "`if` is a reserved word in JSX"
  correctIndex: 1
  explanation: JSX curly braces accept any expression; `if` is a statement, so you use ternaries, `&&`, IIFEs, or extract logic to a function.
- id: q10
  question: Which best describes a React element produced by JSX?
  options:
    - A real DOM node
    - A mutable state container
    - An immutable description of what should be rendered
    - A JSX AST node
  correctIndex: 2
  explanation: A React element is an immutable object describing a piece of UI; React reconciles the element tree against the previous one to compute DOM updates.
```

