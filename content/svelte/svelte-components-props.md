---
slug: svelte-components-props
id: svelte-03
track: svelte
order: 3
title: Components and Props
description: Build reusable Svelte components, pass data with $props, type props with TypeScript, and use $bindable for two-way binding.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=60s
whyItMatters: Build reusable Svelte components, pass data with $props, type props with TypeScript, and use $bindable for two-way binding.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Components and Props

## Components and Props

### Why It Matters

Build reusable Svelte components, pass data with $props, type props with TypeScript, and use $bindable for two-way binding.

Build reusable Svelte components, pass data with $props, type props with TypeScript, and use $bindable for two-way binding.

### Prerequisites

- Stage 1: Getting Started with Svelte
- Stage 2: Reactivity and Assignments
- Basic TypeScript types (string, number, interfaces).

### Topics

- Declaring props with $props()
- TypeScript prop types and defaults
- Optional vs required props
- Rest props and spread onto elements
- $bindable() for two-way prop binding
- Component composition patterns
- Snippets as props (children)
- Slots (legacy) vs snippets (Svelte 5)

### Key Concepts

- $props() returns an object of all passed props; destructure with defaults
- $bindable() marks a prop as bindable so `bind:prop` works on the parent
- Rest props (`...rest`) capture extra props for forwarding to an element
- Snippets (Svelte 5) replace slots; pass `{@render children()}` to invoke
- Components are imported by relative path; no JSX required

```svelte
<!-- Greeting.svelte -->
<script lang="ts">
  let { name, enthusiasm = 1 }: { name: string; enthusiasm?: number } = $props();
</script>

<h1>Hello, {name}{"!".repeat(enthusiasm)}</h1>
```
Caption: Basic props

### Common Pitfalls

- Using `export let name` (Svelte 4 syntax) in a Svelte 5 runes component — use `let { name } = $props()` instead.
- Forgetting that $bindable requires a default — `let { value = $bindable(0) } = $props()`; without the default, `bind:value` from parent won't work.
- Spreading rest props onto a Svelte component instead of a DOM element — Svelte 5 supports spreading on elements; for components, pass props explicitly.
- Mutating a prop directly (antipattern) — in Svelte 5 with $bindable it's allowed but should be intentional; otherwise emit an event or callback.
- Using `<slot />` in a runes-mode component — use `{@render children()}` instead; slots are legacy and won't compose with runes reactivity properly.

### Real-World Applications

- Apple Music's web player composes PlayerControls, TrackList, and NowPlaying components with typed props for track metadata.
- The New York Times graphics team reuses a ChartWrapper component with $bindable height so parent articles can resize charts live.
- Rakuten's product card component accepts a snippet for the "Add to cart" action, letting different pages customize behavior.
- Chess.com's board component takes piece positions as props and a bindable move list for analysis mode.

### Interview Questions

- 1. How do you declare props in Svelte 5? — `let { name, age }: Props = $props()` destructures the props object with types and defaults.
- 2. How do you make a prop two-way bindable? — Use $bindable() as the default: `let { value = $bindable(0) } = $props()`, then parent uses `bind:value={x}`.
- 3. What replaces slots in Svelte 5? — Snippets: a `children` prop of type Snippet rendered with `{@render children()}`.
- 4. How do you forward unknown props to an element? — Destructure `...rest` from $props() and spread with `{...rest}` on the element.
- 5. What's the difference between `export let x` and $props()? — `export let` is Svelte 4 syntax that doesn't work in runes mode; $props() is the Svelte 5 universal API.

### Mini Project

Build a Configurable Card Component Library: A `Card.svelte` with title, description, and a bindable `expanded` state; a `Button.svelte` with a variant prop (primary/secondary/ghost) and snippet children; and a demo page composing them. Include TypeScript prop types and defaults. Suggested approach:
  - Define `CardProps` interface with title, description, expanded?
  - Use $bindable(false) for expanded so parents can control collapse state
  - Button takes `variant: "primary" | "secondary" | "ghost"` and `children: Snippet`
  - Spread rest props onto the underlying <button> for accessibility attrs
  - Build a demo page rendering 3 cards with a shared "Expand all" button

### Exercises

1. Convert a Svelte 4 component using `export let name = "world"` to Svelte 5 with $props().
2. Make a Counter.svelte with $bindable value, then bind it from a parent and verify two-way updates.
3. Create a Button.svelte that forwards rest props (aria-label, disabled) to its <button> element.
4. Replace a `<slot name="header" />` with a snippet prop `{@render header()}`.
5. Build a Card component that accepts an optional `footer` snippet and renders it only if provided.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you declare props in a Svelte 5 runes component?
9. A) export let name
10. B) props.name
11. C) let { name } = $props() (*)
12. D) const name = prop()
13. Explanation: $props() returns the props object; destructuring with types and defaults is the Svelte 5 way.
14. Q2: How do you enable two-way binding on a prop?
15. A) Use bindable: true
16. B) Use a store
17. C) You can't bind props
18. D) Use $bindable() as the default value (*)
19. Explanation: `let { value = $bindable(0) } = $props()` marks value as bindable; parents use `bind:value={x}`.
20. Q3: What replaces `<slot />` in Svelte 5?
21. A) {@render children()} with a snippet prop (*)
22. B) <children />
23. C) <Outlet />
24. D) Nothing, slots still work
25. Explanation: Snippets are Svelte 5's replacement for slots; pass `children: Snippet` and render with {@render children()}.
26. Q4: How do you forward extra props to an element?
27. A) Use `forwardRef`
28. B) Use `<element {...rest} />` after destructuring `...rest` from $props() (*)
29. C) Use `<element all-props />`
30. D) You can't
31. Explanation: Destructure `...rest` from $props() to capture unknown props, then spread with `{...rest}` on a DOM element.
32. Q5: What happens if you use `export let x` in a runes-mode component?
33. A) It works fine
34. B) It silently fails
35. C) The compiler throws — runes mode requires $props() (*)
36. D) It becomes a store
37. Explanation: In runes mode, `export let` is invalid; props must be declared via $props().
38. Q6: Which type do snippet props use?
39. A) Function
40. B) Slot
41. C) Render
42. D) Snippet (*)
43. Explanation: Import `Snippet` from "svelte" and type the prop as `Snippet` (optionally generic with parameters).
44. Q7: How do you give a prop a default value?
45. A) let { name = "default" } = $props() (*)
46. B) props = { name: "default" }
47. C) default name = "default"
48. D) name.default = "default"
49. Explanation: Default values are assigned during destructuring of $props(), same as ordinary destructuring.
50. Q8: What does {@render snippet()} do?
51. A) Renders an HTML string
52. B) Renders a snippet at that location (*)
53. C) Mounts a child component
54. D) Logs the snippet
55. Explanation: {@render ...} invokes a snippet (a piece of pre-compiled UI) and inserts its output at that point in the DOM.
56. Q9: Are props readonly by default in Svelte 5?
57. A) Yes, mutating throws
58. B) They're frozen
59. C) No, but mutating is an antipattern unless $bindable is intended (*)
60. D) They're always writable
61. Explanation: Svelte 5 doesn't enforce immutability, but mutating props directly is an antipattern; use $bindable for intended two-way flow.
62. Q10: What's the recommended way to type props with TypeScript?
63. A) JSDoc comments only
64. B) Use a separate interface file always
65. C) Props are untyped
66. D) Annotate the destructuring: `let { x }: Props = $props()` (*)
67. Explanation: Inline a type annotation on the destructuring (or use an interface) for full type safety and editor autocomplete.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you declare props in a Svelte 5 runes component?
  options:
    - export let name
    - props.name
    - let { name } = $props()
    - const name = prop()
  correctIndex: 2
  explanation: $props() returns the props object; destructuring with types and defaults is the Svelte 5 way.
- id: q2
  question: How do you enable two-way binding on a prop?
  options:
    - "Use bindable: true"
    - Use a store
    - You can't bind props
    - Use $bindable() as the default value
  correctIndex: 3
  explanation: "`let { value = $bindable(0) } = $props()` marks value as bindable; parents use `bind:value={x}`."
- id: q3
  question: What replaces `<slot />` in Svelte 5?
  options:
    - "{@render children()} with a snippet prop"
    - <children />
    - <Outlet />
    - Nothing, slots still work
  correctIndex: 0
  explanation: "Snippets are Svelte 5's replacement for slots; pass `children: Snippet` and render with {@render children()}."
- id: q4
  question: How do you forward extra props to an element?
  options:
    - Use `forwardRef`
    - Use `<element {...rest} />` after destructuring `...rest` from $props()
    - Use `<element all-props />`
    - You can't
  correctIndex: 1
  explanation: Destructure `...rest` from $props() to capture unknown props, then spread with `{...rest}` on a DOM element.
- id: q5
  question: What happens if you use `export let x` in a runes-mode component?
  options:
    - It works fine
    - It silently fails
    - The compiler throws — runes mode requires $props()
    - It becomes a store
  correctIndex: 2
  explanation: In runes mode, `export let` is invalid; props must be declared via $props().
- id: q6
  question: Which type do snippet props use?
  options:
    - Function
    - Slot
    - Render
    - Snippet
  correctIndex: 3
  explanation: Import `Snippet` from "svelte" and type the prop as `Snippet` (optionally generic with parameters).
- id: q7
  question: How do you give a prop a default value?
  options:
    - let { name = "default" } = $props()
    - 'props = { name: "default" }'
    - default name = "default"
    - name.default = "default"
  correctIndex: 0
  explanation: Default values are assigned during destructuring of $props(), same as ordinary destructuring.
- id: q8
  question: What does {@render snippet()} do?
  options:
    - Renders an HTML string
    - Renders a snippet at that location
    - Mounts a child component
    - Logs the snippet
    - and inserts its output at that point in the DOM.
  correctIndex: 1
  explanation: "{@render ...} invokes a snippet (a piece of pre-compiled UI) and inserts its output at that point in the DOM."
- id: q9
  question: Are props readonly by default in Svelte 5?
  options:
    - Yes, mutating throws
    - They're frozen
    - No, but mutating is an antipattern unless $bindable is intended
    - They're always writable
  correctIndex: 2
  explanation: Svelte 5 doesn't enforce immutability, but mutating props directly is an antipattern; use $bindable for intended two-way flow.
- id: q10
  question: What's the recommended way to type props with TypeScript?
  options:
    - JSDoc comments only
    - Use a separate interface file always
    - Props are untyped
    - "Annotate the destructuring: `let { x }: Props = $props()`"
  correctIndex: 3
  explanation: Inline a type annotation on the destructuring (or use an interface) for full type safety and editor autocomplete.
```

