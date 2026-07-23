---
slug: react-lifting-state-up-component-composition
id: react-07
track: react
order: 7
title: Lifting State Up and Component Composition
description: Coordinate state between siblings by lifting it to a common parent, compose components via render props and slots, and learn when to extract vs when to share state.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=360s
whyItMatters: Coordinate state between siblings by lifting it to a common parent, compose components via render props and slots, and learn when to extract vs when to share state.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Lifting State Up and Component Composition

## Lifting State Up and Component Composition

### Why It Matters

Coordinate state between siblings by lifting it to a common parent, compose components via render props and slots, and learn when to extract vs when to share state.

Coordinate state between siblings by lifting it to a common parent, compose components via render props and slots, and learn when to extract vs when to share state.

### Prerequisites

- Stage 6: Forms and Controlled Inputs.
- Stage 3: Components and Props (composition).

### Topics

- Lifting state up to a common parent
- Two-way binding via callbacks (state down, events up)
- Single source of truth for shared state
- Render props pattern
- Slot pattern via children-as-function
- Compound components
- When to lift vs when to use context
- Controlled vs uncontrolled component design

### Key Concepts

- Siblings can't share state directly; lift to the nearest common ancestor
- "State down, events up" is the React data-flow rule for two-way coordination
- A controlled component receives both value and onChange; the parent owns the state
- Render props pass a function as a child to let a generic component drive a specific UI
- Compound components (e.g. `<Tabs><TabList/><TabPanel/></Tabs>`) share implicit state via context

```tsx
function TemperatureInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState(0);

  // Both inputs share the same state via the parent — that's "lifting state up".
  return (
    <div>
      <TemperatureInput value={celsius} onChange={setCelsius} />
      <TemperatureInput value={celsius * 9 / 5 + 32} onChange={(f) => setCelsius((f - 32) * 5 / 9)} />
      <p>{celsius >= 100 ? "Boiling!" : "Not boiling."}</p>
    </div>
  );
}
```
Caption: Lifting state up

### Common Pitfalls

- Storing the same state in two siblings and trying to keep them in sync — lift it to the parent so there's a single source of truth.
- Overusing render props when a simple prop or context would do — render props can be hard to read; reach for them only when the child needs to drive the parent's UI.
- Forgetting to handle the null case when consuming context with `useContext` — guard with `if (!ctx) throw new Error("Must be inside <Tabs>")` for compound components.
- Lifting state too high — pushing state to the root when only two siblings need it causes unnecessary re-renders across the whole tree.
- Mutating shared state in multiple children — always route updates through the parent's setter callback.

### Real-World Applications

- React's official Temperature Calculator doc example shows lifting state up; the pattern powers every multi-field coordinator in real apps.
- Reach UI's Tabs/Accordion use the compound-component pattern with context for implicit coordination.
- MUI's `<DataGrid>` exposes controlled state via render-cell callbacks — a render-props pattern for custom cell rendering.
- Radix UI primitives (Dialog, Popover, Tabs) use compound components + context to coordinate trigger and content without prop drilling.

### Interview Questions

- 1. How do two sibling components share state? — Lift the state to their common parent; pass value and onChange down to each sibling.
- 2. What is a render prop? — A prop (often `children` or `render`) that is a function the component calls to render part of its UI, enabling it to share state with the caller.
- 3. When would you use a render prop vs a custom hook? — Hooks are simpler for state-only sharing; render props make sense when the component also provides markup/structure that the caller plugs into.
- 4. What is a compound component? — A set of components designed to be used together (e.g. `<Tabs>` + `<Tab>` + `<TabPanel>`) that share implicit state via context, giving users a clean declarative API.
- 5. When does lifting state up stop scaling? — When the common ancestor is near the root and updates trigger many unrelated re-renders — at that point reach for context, `useReducer`, or an external store (Stages 10, 16).

### Mini Project

Build a "Theme & Font Previewer": An app where a user picks a theme (light/dark) and a font size (small/medium/large), and the preview panel updates live. Build it three times: (1) lifted state, (2) render props, (3) compound components — to feel the tradeoffs. Suggested approach:
  - Version 1: lift theme + font state into `App`, pass down via props
  - Version 2: `<ThemePreviewer>{(theme, font) => <Panel/>}</ThemePreviewer>`
  - Version 3: `<Previewer><Controls/><Panel/></Previewer>` with context
  - Confirm each version produces identical behavior
  - Note the boilerplate and re-render differences

### Exercises

1. Refactor two siblings with duplicated state into a lifted-state version.
2. Implement a `Mouse` component that exposes its position via render props.
3. Build a compound `<Accordion>` with `<Item>` and `<Panel>` children coordinated via context.
4. Convert a render-props component to a custom hook equivalent.
5. Add a controlled `value`/`onChange` API to your `Tabs` so callers can manage active tab externally.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do two sibling components share state in React?
9. A) They can't — siblings never share state
10. B) Use a global variable
11. C) Lift the state to their common parent (*)
12. D) Use refs
13. Explanation: Siblings communicate via their parent: the parent owns the state and passes `value` + `onChange` down to each sibling.
14. Q2: What is a render prop?
15. A) A prop named `render`
16. B) A prop that triggers a re-render
17. C) A CSS prop
18. D) A function prop the component calls to share state with the caller's UI (*)
19. Explanation: A render prop is a function (often `children` or `render`) the component invokes with its internal state, letting the caller decide how to render.
20. Q3: What pattern lets `<Tabs>`, `<Tab>`, and `<TabPanel>` coordinate without prop drilling?
21. A) Compound components with shared context (*)
22. B) Higher-order components
23. C) Inline state in each component
24. D) LocalStorage
25. Explanation: Compound components share implicit state via React Context, giving users a clean declarative composition API without manual prop wiring.
26. Q4: Why is duplicating state in two siblings a bug?
27. A) It uses more memory
28. B) The two copies can drift out of sync; lift to one source of truth (*)
29. C) React forbids it
30. D) It triggers double renders
31. Explanation: Two copies must be manually kept in sync, which always drifts; lifting gives a single source of truth.
32. Q5: When should you NOT lift state to the root?
33. A) Always lift to root
34. B) Never lift state
35. C) When only two siblings need it — keep it as low as possible to avoid extra re-renders (*)
36. D) Only in class components
37. Explanation: Lifting too high causes unrelated branches to re-render; lift to the lowest common ancestor of the components that actually need the state.
38. Q6: A controlled component receives...
39. A) Only `value`
40. B) Only `onChange`
41. C) An internal ref
42. D) Both `value` and `onChange` (parent owns the state) (*)
43. Explanation: A controlled component takes its value from props and notifies the parent of changes via `onChange`; the parent owns the state.
44. Q7: When consuming context in a compound component, why guard against null?
45. A) The hook returns null when used outside the provider — throw a clear error (*)
46. B) Context is always null
47. C) To skip re-renders
48. D) To avoid TypeScript
49. Explanation: `useContext` returns the default (often null) when called outside the provider; throw an explicit error to fail fast with a helpful message.
50. Q8: Which is a downside of render props vs custom hooks?
51. A) Render props are slower than HOCs
52. B) Render props can be harder to read and create new function instances each render (*)
53. C) Render props can't share state
54. D) Hooks require fewer imports
55. Explanation: Render props nest deeper, are harder to type, and create new closures each render — modern React often prefers hooks for state-only sharing.
56. Q9: What's the rule of thumb for when to lift state vs use context?
57. A) Always use context
58. B) Never use context
59. C) Lift for 2-3 components; reach for context when many descendants need the state (*)
60. D) Always use a global store
61. Explanation: Lifting is fine for a few close siblings; when state must reach deeply nested or many components, context avoids heavy prop drilling.
62. Q10: What does the "state down, events up" rule describe?
63. A) A CSS layout
64. B) An anti-pattern
65. C) A React 18 feature
66. D) The React data-flow: state is passed down via props, events go up via callbacks (*)
67. Explanation: React's unidirectional flow: parents pass state down as props; children report changes up by calling callbacks the parent passed in.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do two sibling components share state in React?
  options:
    - They can't — siblings never share state
    - Use a global variable
    - Lift the state to their common parent
    - Use refs
  correctIndex: 2
  explanation: "Siblings communicate via their parent: the parent owns the state and passes `value` + `onChange` down to each sibling."
- id: q2
  question: What is a render prop?
  options:
    - A prop named `render`
    - A prop that triggers a re-render
    - A CSS prop
    - A function prop the component calls to share state with the caller's UI
  correctIndex: 3
  explanation: A render prop is a function (often `children` or `render`) the component invokes with its internal state, letting the caller decide how to render.
- id: q3
  question: What pattern lets `<Tabs>`, `<Tab>`, and `<TabPanel>` coordinate without prop drilling?
  options:
    - Compound components with shared context
    - Higher-order components
    - Inline state in each component
    - LocalStorage
  correctIndex: 0
  explanation: Compound components share implicit state via React Context, giving users a clean declarative composition API without manual prop wiring.
- id: q4
  question: Why is duplicating state in two siblings a bug?
  options:
    - It uses more memory
    - The two copies can drift out of sync; lift to one source of truth
    - React forbids it
    - It triggers double renders
  correctIndex: 1
  explanation: Two copies must be manually kept in sync, which always drifts; lifting gives a single source of truth.
- id: q5
  question: When should you NOT lift state to the root?
  options:
    - Always lift to root
    - Never lift state
    - When only two siblings need it — keep it as low as possible to avoid extra re-renders
    - Only in class components
  correctIndex: 2
  explanation: Lifting too high causes unrelated branches to re-render; lift to the lowest common ancestor of the components that actually need the state.
- id: q6
  question: A controlled component receives...
  options:
    - Only `value`
    - Only `onChange`
    - An internal ref
    - Both `value` and `onChange` (parent owns the state)
  correctIndex: 3
  explanation: A controlled component takes its value from props and notifies the parent of changes via `onChange`; the parent owns the state.
- id: q7
  question: When consuming context in a compound component, why guard against null?
  options:
    - The hook returns null when used outside the provider — throw a clear error
    - Context is always null
    - To skip re-renders
    - To avoid TypeScript
  correctIndex: 0
  explanation: "`useContext` returns the default (often null) when called outside the provider; throw an explicit error to fail fast with a helpful message."
- id: q8
  question: Which is a downside of render props vs custom hooks?
  options:
    - Render props are slower than HOCs
    - Render props can be harder to read and create new function instances each render
    - Render props can't share state
    - Hooks require fewer imports
  correctIndex: 1
  explanation: Render props nest deeper, are harder to type, and create new closures each render — modern React often prefers hooks for state-only sharing.
- id: q9
  question: What's the rule of thumb for when to lift state vs use context?
  options:
    - Always use context
    - Never use context
    - Lift for 2-3 components; reach for context when many descendants need the state
    - Always use a global store
  correctIndex: 2
  explanation: Lifting is fine for a few close siblings; when state must reach deeply nested or many components, context avoids heavy prop drilling.
- id: q10
  question: What does the "state down, events up" rule describe?
  options:
    - A CSS layout
    - An anti-pattern
    - A React 18 feature
    - "The React data-flow: state is passed down via props, events go up via callbacks"
  correctIndex: 3
  explanation: "React's unidirectional flow: parents pass state down as props; children report changes up by calling callbacks the parent passed in."
```

