---
slug: vue-slots-default-named-scoped
id: vue-11
track: vue
order: 11
title: Slots — Default, Named, Scoped
description: Compose components with default, named, and scoped slots; learn the v-slot shorthand and dynamic slot names for flexible layout APIs.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M
whyItMatters: Compose components with default, named, and scoped slots; learn the v-slot shorthand and dynamic slot names for flexible layout APIs.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Slots — Default, Named, Scoped

## Slots — Default, Named, Scoped

### Why It Matters

Compose components with default, named, and scoped slots; learn the v-slot shorthand and dynamic slot names for flexible layout APIs.

Compose components with default, named, and scoped slots; learn the v-slot shorthand and dynamic slot names for flexible layout APIs.

### Prerequisites

- Stage 10: Components and Props.
- Comfort with destructuring and JSX-like mental models.

### Topics

- Default slots: `<slot/>` and parent-provided content
- Fallback content: `<slot>default text</slot>`
- Named slots: `<slot name="header"/>` and `<template #header>`
- The `v-slot` directive and the `#` shorthand
- Scoped slots: passing data from child to parent
- Default slot with props: `v-slot="{ item }"`
- Dynamic slot names: `#[dynamicName]`
- Render functions and slot props (useSlot, useSlots)

### Key Concepts

- Slots let a parent inject content into a child's template — the child decides WHERE, the parent decides WHAT
- Named slots support multiple insertion points with `<slot name="x">` and `<template #x>`
- Scoped slots let the child pass data back to the parent for the parent to render
- The `#` shorthand only works on `<template>` tags and on child component tags (not on plain elements)
- Slot props are reactive — when the child's slot data changes, the parent's slot content re-renders

```vue
<!-- Button.vue -->
<template>
  <button class="btn">
    <slot>Click me</slot>
  </button>
</template>
```
Caption: Default slot with fallback

### Common Pitfalls

- Using `#name` on a plain HTML element (not a `<template>`) — `#` shorthand only works on `<template>` tags or directly on a component (for the default slot).
- Forgetting to pass slot props when consuming a scoped slot — `#default` without `="{ item }"` won't receive the child's data.
- Expecting named slot fallback content to appear when the slot is provided but empty — empty `<template #header></template>` makes the slot "provided" so fallback does NOT show.
- Mutating slot props inside the parent — they are read-only data passed from the child; emit events to change child state.
- Using slots where props would do — if the parent only passes static strings, a prop is simpler than a slot.

### Real-World Applications

- GitLab's panel components use named slots (header, body, footer, actions) to let product teams compose dashboards.
- Alibaba's Element Plus Table uses scoped slots extensively to let developers customize cell rendering per column.
- Behance's gallery card uses a default slot for the image and a scoped slot for the hover overlay actions.
- Adobe Portfolio's theme components use dynamic slot names to let users customize specific sections of a template.

### Interview Questions

- 1. What's the difference between a prop and a slot? — Props pass data; slots pass template content (markup) the child renders at a chosen location.
- 2. What is a scoped slot? — A slot where the child passes data back to the parent via slot props, so the parent can render based on child data.
- 3. What does `#` shorthand do? — It's the shorthand for `v-slot:` and only works on `<template>` tags or directly on a component (for the default slot).
- 4. When does slot fallback content show? — When the parent does not provide any content for that slot; an empty `<template #x>` counts as provided.
- 5. What are slot props? — Data the child binds to a `<slot>` (e.g. `<slot :item="x">`); the parent receives them via `v-slot="{ item }"`.

### Mini Project

Build a "DataTable" component: A `DataTable.vue` that takes `columns` and `rows` props, renders a table, and uses scoped slots so each cell can be customized via `<template #cell-{column}="{ row }">`. Suggested approach:
  - Define `columns: { key: string; label: string }[]` and `rows: Record<string, any>[]` props
  - Render `<th v-for="col in columns">{{ col.label }}</th>` and `<td v-for="col in columns"><slot :name="'cell-' + col.key" :row="row">{{ row[col.key] }}</slot></td>`
  - In a parent, provide a custom cell renderer for one column: `<template #cell-status="{ row }"><span :class="row.status">{{ row.status }}</span></template>`
  - Add a fallback default cell value so columns without a custom slot still render
  - Style with scoped CSS for borders and padding

### Exercises

1. Build a `Card.vue` with header/default/footer named slots and use it from a parent.
2. Add fallback content to a slot and confirm it shows when the parent omits the slot.
3. Build a `List.vue` that exposes a scoped slot `#default="{ item, index }"` and use it.
4. Use a dynamic slot name `#[slotName]` to swap which slot receives content.
5. Inspect the `useSlots()` return value in `<script setup>` to see what slots the parent provided.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does a slot let the parent do?
9. A) Pass data to a child
10. B) Call child methods
11. C) Pass template content (markup) that the child renders at a chosen location (*)
12. D) Subscribe to child events
13. Explanation: Slots let the parent inject template content into the child's template; the child decides WHERE it appears.
14. Q2: Which is the shorthand for v-slot:header?
15. A) :header
16. B) @header
17. C) ->header
18. D) #header (*)
19. Explanation: `#` is the shorthand for `v-slot:`; it only works on `<template>` tags or directly on a component for the default slot.
20. Q3: What is a scoped slot?
21. A) A slot where the child passes data back to the parent via slot props (*)
22. B) A slot with a CSS scoped style
23. C) A slot that only renders once
24. D) A slot for primitive types
25. Explanation: Scoped slots let the child pass data to the parent via `<slot :item="x">`; the parent receives it via `v-slot="{ item }"`.
26. Q4: When does slot fallback content show?
27. A) Always
28. B) Only when the parent does not provide content for that slot (*)
29. C) Only in production
30. D) Never
31. Explanation: Fallback content (e.g. `<slot>Default</slot>`) shows only when the parent omits that slot; an empty `<template #x>` counts as provided.
32. Q5: How do you receive a slot prop in the parent?
33. A) `<template #default="item">`
34. B) `<template #default="item.id">`
35. C) `<template #default="{ item }">` (*)
36. D) `<template :default="item">`
37. Explanation: Slot props come as a single object; destructure with `v-slot="{ item }"` (or `#default="{ item }"`).
38. Q6: Where can the # shorthand be used?
39. A) On any HTML element
40. B) Only on a component root
41. C) Only inside <script setup>
42. D) Only on <template> tags or directly on a component (for default slot) (*)
43. Explanation: The `#` shorthand works on `<template>` tags (for named slots) or directly on a component (for the default slot); it cannot be used on plain HTML elements.
44. Q7: How do you declare a slot that passes data to the parent?
45. A) `<slot :item="item" />` (*)
46. B) `<slot name="item" />`
47. C) `<slot prop="item" />`
48. D) `<data-slot :item="item" />`
49. Explanation: Bind attributes on the `<slot>` element to pass them as slot props: `<slot :item="item" :index="i" />`.
50. Q8: What's a dynamic slot name?
51. A) A slot with a random name
52. B) Using `#[variableName]` to choose the slot at runtime (*)
53. C) A slot defined in JavaScript
54. D) A deprecated Vue 2 feature
55. Explanation: `#[slotName]` lets the slot target be a reactive variable so the parent can switch which slot it fills.
56. Q9: What's the difference between `<slot name="x" />` and `<slot />`?
57. A) Nothing
58. B) The first is for scoped slots
59. C) The first declares a named slot "x"; the second is the default slot (*)
60. D) The first is invalid
61. Explanation: Named slots use `name="x"`; the default slot is `<slot />` with no name. Parents fill them with `<template #x>` or plain content.
62. Q10: What does useSlots() return in <script setup>?
63. A) An array of slot names
64. B) The slot contents as a string
65. C) Nothing useful
66. D) An object mapping slot names to slot functions (or undefined if not provided) (*)
67. Explanation: `useSlots()` returns an object whose keys are slot names and values are slot render functions; useful for conditional rendering based on whether a slot is provided.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does a slot let the parent do?
  options:
    - Pass data to a child
    - Call child methods
    - Pass template content (markup) that the child renders at a chosen location
    - Subscribe to child events
  correctIndex: 2
  explanation: Slots let the parent inject template content into the child's template; the child decides WHERE it appears.
- id: q2
  question: Which is the shorthand for v-slot:header?
  options:
    - :header
    - "@header"
    - ->header
    - "#header"
  correctIndex: 3
  explanation: "`#` is the shorthand for `v-slot:`; it only works on `<template>` tags or directly on a component for the default slot."
- id: q3
  question: What is a scoped slot?
  options:
    - A slot where the child passes data back to the parent via slot props
    - A slot with a CSS scoped style
    - A slot that only renders once
    - A slot for primitive types
  correctIndex: 0
  explanation: Scoped slots let the child pass data to the parent via `<slot :item="x">`; the parent receives it via `v-slot="{ item }"`.
- id: q4
  question: When does slot fallback content show?
  options:
    - Always
    - Only when the parent does not provide content for that slot
    - Only in production
    - Never
  correctIndex: 1
  explanation: "Fallback content (e.g. `<slot>Default</slot>`) shows only when the parent omits that slot; an empty `<template #x>` counts as provided."
- id: q5
  question: How do you receive a slot prop in the parent?
  options:
    - '`<template #default="item">`'
    - '`<template #default="item.id">`'
    - '`<template #default="{ item }">`'
    - '`<template :default="item">`'
  correctIndex: 2
  explanation: Slot props come as a single object; destructure with `v-slot="{ item }"` (or `#default="{ item }"`).
- id: q6
  question: "Where can the # shorthand be used?"
  options:
    - On any HTML element
    - Only on a component root
    - Only inside <script setup>
    - Only on <template> tags or directly on a component (for default slot)
  correctIndex: 3
  explanation: The `#` shorthand works on `<template>` tags (for named slots) or directly on a component (for the default slot); it cannot be used on plain HTML elements.
- id: q7
  question: How do you declare a slot that passes data to the parent?
  options:
    - '`<slot :item="item" />`'
    - '`<slot name="item" />`'
    - '`<slot prop="item" />`'
    - '`<data-slot :item="item" />`'
  correctIndex: 0
  explanation: 'Bind attributes on the `<slot>` element to pass them as slot props: `<slot :item="item" :index="i" />`.'
- id: q8
  question: What's a dynamic slot name?
  options:
    - A slot with a random name
    - Using `#[variableName]` to choose the slot at runtime
    - A slot defined in JavaScript
    - A deprecated Vue 2 feature
  correctIndex: 1
  explanation: "`#[slotName]` lets the slot target be a reactive variable so the parent can switch which slot it fills."
- id: q9
  question: What's the difference between `<slot name="x" />` and `<slot />`?
  options:
    - Nothing
    - The first is for scoped slots
    - The first declares a named slot "x"; the second is the default slot
    - The first is invalid
  correctIndex: 2
  explanation: 'Named slots use `name="x"`; the default slot is `<slot />` with no name. Parents fill them with `<template #x>` or plain content.'
- id: q10
  question: What does useSlots() return in <script setup>?
  options:
    - An array of slot names
    - The slot contents as a string
    - Nothing useful
    - An object mapping slot names to slot functions (or undefined if not provided)
  correctIndex: 3
  explanation: "`useSlots()` returns an object whose keys are slot names and values are slot render functions; useful for conditional rendering based on whether a slot is provided."
```

