---
slug: typescript-typescript-react
id: typescript-16
track: typescript
order: 16
title: TypeScript with React
description: Author React components with typed props and state, model hooks with generics, and apply discriminated-union prop patterns.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=10000s
whyItMatters: Author React components with typed props and state, model hooks with generics, and apply discriminated-union prop patterns.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# TypeScript with React

## TypeScript with React

### Why It Matters

Author React components with typed props and state, model hooks with generics, and apply discriminated-union prop patterns.

Author React components with typed props and state, model hooks with generics, and apply discriminated-union prop patterns.

### Prerequisites

- Stage 6: Generics.
- Stage 7: Unions, Intersections, and Conditional Types.
- Stage 8: Mapped Types and Utility Types.
- Basic React familiarity.

### Topics

- `React.FC` vs plain function components (and why plain is preferred)
- Props interfaces and `ComponentProps<T>`
- Typing `useState`, `useReducer`, `useRef`, `useMemo`, `useCallback`
- Generics in hooks (`useState<T>`)
- Event handler types (`React.ChangeEvent<HTMLInputElement>`)
- Discriminated-union props (`{ variant: "a" } | { variant: "b" }`)
- `React.PropsWithChildren`, `React.ComponentPropsWithoutRef`
- Polymorphic components with `as` prop

### Key Concepts

- Modern React 18+ favors plain function components (`function Button(props: Props) {}`) over `React.FC` — `React.FC` adds `children` implicitly and is less explicit.
- `useState<T>` infers T from the initial value; pass an explicit type when the state can be `null` initially.
- `useRef<T>(null)` is the pattern for DOM refs; the ref's `current` is `T | null`.
- Discriminated-union props give you exhaustive variant handling with no invalid combinations.
- `ComponentProps<typeof Button>` extracts props from a component, useful for wrappers.

```typescript
interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
export function Button({ label, variant, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {label}
    </button>
  );
}
```
Caption: Function component with typed props

### Common Pitfalls

- Using `React.FC` and being surprised that `children` is implicit — prefer plain function components with explicit `children?: React.ReactNode`.
- Typing `useState<string>(null)` — the initial value's type must be assignable to the state type; use `useState<string | null>(null)` for nullable state.
- Calling `useRef<HTMLInputElement>(undefined)` — the initial value must be `null` for DOM refs; otherwise `current` is typed as `T` (never null) and you lose the null-check.
- Spreading props without `ComponentProps<typeof X>` — hand-typing each prop drifts from the source of truth; let TS extract.
- Forgetting that `React.MouseEvent<HTMLButtonElement>` is the typed event for button clicks; `Event` is too loose and `any` is unsafe.

### Real-World Applications

- The new Facebook web (fb4a/fbweb) is TypeScript + React; every component's props are an `interface Props` per Facebook's internal style guide.
- Linear's React frontend uses discriminated-union props for every variant component (buttons, badges, banners).
- The MUI (Material-UI) library uses polymorphic `as` props with `OverridableComponent<T>` for every component — a heavily generic pattern.
- Vercel's dashboard uses `ComponentProps<typeof Button>` to forward props from page-level wrappers without retyping.

### Interview Questions

- 1. Should you use `React.FC` or plain function components? — Plain functions are preferred; `React.FC` adds implicit `children` and is less explicit about return types.
- 2. How do you type a DOM ref? — `const ref = useRef<HTMLInputElement>(null)`; `ref.current` is `HTMLInputElement | null`.
- 3. How do you type a nullable state? — `useState<User | null>(null)` — the initial null forces the union type.
- 4. What is a discriminated-union props pattern? — Modeling variants as a union of object types with a shared literal discriminant; TS narrows and ensures valid combinations.
- 5. How do you extract props from an existing component? — `type Props = React.ComponentProps<typeof Button>`.

### Mini Project

Build a typed Modal Component: A polymorphic, accessible `<Modal>` with discriminated-union variants (`"info" | "warning" | "confirm"`), optional children, and a `useModal` hook. Suggested approach:
  - Define `interface ModalProps` with `open`, `onClose`, and `variant: "info" | "warning" | "confirm"`
  - For `"confirm"`, require `onConfirm: () => void`; use a discriminated union to enforce this
  - Implement `useModal()` returning `{ isOpen, open, close }` with `useState<boolean>`
  - Use `React.Portal` (via `react-dom`) to render outside the React tree
  - Add a `useEffect` to close on Escape key

### Exercises

1. Write a `Button` component with typed `onClick` (`React.MouseEvent<HTMLButtonElement>`).
2. Type a `useState<User | null>(null)` and access `user?.name` after a null check.
3. Create a `Card` component that accepts `as?: ElementType` and forwards props (polymorphic).
4. Use `ComponentProps<typeof Button>` to forward props from a `PrimaryButton` wrapper.
5. Implement an `Alert` with discriminated-union props for "text" and "progress" variants.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the modern preferred way to declare a React component?
9. A) `const C: React.FC<Props> = (props) => ...`
10. B) `class C extends React.Component<Props> {}`
11. C) `React.createComponent(...)`
12. D) `function C(props: Props) { ... }` (*)
13. Explanation: Plain function components with explicit `Props` are preferred; `React.FC` is now discouraged for its implicit `children` and weaker generics.
14. Q2: How do you type a DOM ref for an input?
15. A) `useRef<HTMLInputElement>(null)` (*)
16. B) `useRef("input")`
17. C) `useRef<HTMLInputElement>(undefined)`
18. D) `useRef(HTMLInputElement)`
19. Explanation: The initial value for a DOM ref must be `null`; the generic argument narrows `current` to `HTMLInputElement | null`.
20. Q3: What is the type of `useState<User | null>(null)`?
21. A) `[User, (u: User) => void]`
22. B) `[User | null, (u: User | null) => void]` (*)
23. C) `[User, Dispatch<SetStateAction<User>>]`
24. D) `[null, (u: User) => void]`
25. Explanation: The state is `User | null` (inferred from the initial value's union with the generic), and the setter accepts `User | null` or an updater function.
26. Q4: Which type is the click handler for a button?
27. A) `Event`
28. B) `MouseEvent`
29. C) `React.MouseEvent<HTMLButtonElement>` (*)
30. D) `any`
31. Explanation: `React.MouseEvent<HTMLButtonElement>` carries the typed `currentTarget` (`HTMLButtonElement`) so you can safely access button-specific properties.
32. Q5: What does `ComponentProps<typeof Button>` give you?
33. A) The button's display name
34. B) The button's ref
35. C) The button's default export
36. D) The props type of the Button component (*)
37. Explanation: `ComponentProps<typeof Component>` extracts the props type — useful for wrappers that should accept the same props as the wrapped component.
38. Q6: Why is discriminated-union props useful in React?
39. A) It enforces valid prop combinations and enables exhaustive handling (*)
40. B) It speeds up rendering
41. C) It removes the need for PropTypes
42. D) It enables SSR
43. Explanation: Discriminated-union props make invalid combinations unrepresentable (e.g., `variant: "confirm"` requires `onConfirm`); TS narrows and exhaustiveness-checks.
44. Q7: Which type describes any renderable React node (string, element, array, null)?
45. A) `JSX.Element`
46. B) `React.ReactNode` (*)
47. C) `React.Element`
48. D) `React.Children`
49. Explanation: `React.ReactNode` is the broadest type covering all renderable values: strings, numbers, elements, arrays, portals, null, boolean, undefined.
50. Q8: What does `React.PropsWithChildren<Props>` add?
51. A) `ref`
52. B) `key`
53. C) `children?: React.ReactNode` (*)
54. D) `style`
55. Explanation: `PropsWithChildren<T>` is `T & { children?: React.ReactNode }` — the idiomatic way to opt back into implicit children if you want them.
56. Q9: Which prop type allows a component to render as different elements?
57. A) `render?: Function`
58. B) `tag?: string`
59. C) `element?: keyof JSX.IntrinsicElements`
60. D) `as?: ElementType` (polymorphic component) (*)
61. Explanation: The polymorphic-component pattern uses `as?: E` with `E extends React.ElementType`, intersecting with `ComponentPropsWithoutRef<E>` to type the rest of the props.
62. Q10: Why avoid `useState<string>(null)`?
63. A) `null` is not assignable to `string` — TS errors (*)
64. B) It's deprecated
65. C) It returns `null` at runtime
66. D) It's slower than `useState<string>(undefined)`
67. Explanation: The initial value must be assignable to the state type; `null` is not assignable to `string`. Use `useState<string | null>(null)` instead.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the modern preferred way to declare a React component?
  options:
    - "`const C: React.FC<Props> = (props) => ...`"
    - "`class C extends React.Component<Props> {}`"
    - "`React.createComponent(...)`"
    - "`function C(props: Props) { ... }`"
  correctIndex: 3
  explanation: Plain function components with explicit `Props` are preferred; `React.FC` is now discouraged for its implicit `children` and weaker generics.
- id: q2
  question: How do you type a DOM ref for an input?
  options:
    - "`useRef<HTMLInputElement>(null)`"
    - '`useRef("input")`'
    - "`useRef<HTMLInputElement>(undefined)`"
    - "`useRef(HTMLInputElement)`"
  correctIndex: 0
  explanation: The initial value for a DOM ref must be `null`; the generic argument narrows `current` to `HTMLInputElement | null`.
- id: q3
  question: What is the type of `useState<User | null>(null)`?
  options:
    - "`[User, (u: User) => void]`"
    - "`[User | null, (u: User | null) => void]`"
    - "`[User, Dispatch<SetStateAction<User>>]`"
    - "`[null, (u: User) => void]`"
  correctIndex: 1
  explanation: The state is `User | null` (inferred from the initial value's union with the generic), and the setter accepts `User | null` or an updater function.
- id: q4
  question: Which type is the click handler for a button?
  options:
    - "`Event`"
    - "`MouseEvent`"
    - "`React.MouseEvent<HTMLButtonElement>`"
    - "`any`"
  correctIndex: 2
  explanation: "`React.MouseEvent<HTMLButtonElement>` carries the typed `currentTarget` (`HTMLButtonElement`) so you can safely access button-specific properties."
- id: q5
  question: What does `ComponentProps<typeof Button>` give you?
  options:
    - The button's display name
    - The button's ref
    - The button's default export
    - The props type of the Button component
  correctIndex: 3
  explanation: "`ComponentProps<typeof Component>` extracts the props type — useful for wrappers that should accept the same props as the wrapped component."
- id: q6
  question: Why is discriminated-union props useful in React?
  options:
    - It enforces valid prop combinations and enables exhaustive handling
    - It speeds up rendering
    - It removes the need for PropTypes
    - It enables SSR
  correctIndex: 0
  explanation: 'Discriminated-union props make invalid combinations unrepresentable (e.g., `variant: "confirm"` requires `onConfirm`); TS narrows and exhaustiveness-checks.'
- id: q7
  question: Which type describes any renderable React node (string, element, array, null)?
  options:
    - "`JSX.Element`"
    - "`React.ReactNode`"
    - "`React.Element`"
    - "`React.Children`"
  correctIndex: 1
  explanation: "`React.ReactNode` is the broadest type covering all renderable values: strings, numbers, elements, arrays, portals, null, boolean, undefined."
- id: q8
  question: What does `React.PropsWithChildren<Props>` add?
  options:
    - "`ref`"
    - "`key`"
    - "`children?: React.ReactNode`"
    - "`style`"
  correctIndex: 2
  explanation: "`PropsWithChildren<T>` is `T & { children?: React.ReactNode }` — the idiomatic way to opt back into implicit children if you want them."
- id: q9
  question: Which prop type allows a component to render as different elements?
  options:
    - "`render?: Function`"
    - "`tag?: string`"
    - "`element?: keyof JSX.IntrinsicElements`"
    - "`as?: ElementType` (polymorphic component)"
  correctIndex: 3
  explanation: "The polymorphic-component pattern uses `as?: E` with `E extends React.ElementType`, intersecting with `ComponentPropsWithoutRef<E>` to type the rest of the props."
- id: q10
  question: Why avoid `useState<string>(null)`?
  options:
    - "`null` is not assignable to `string` — TS errors"
    - It's deprecated
    - It returns `null` at runtime
    - It's slower than `useState<string>(undefined)`
  correctIndex: 0
  explanation: The initial value must be assignable to the state type; `null` is not assignable to `string`. Use `useState<string | null>(null)` instead.
```

