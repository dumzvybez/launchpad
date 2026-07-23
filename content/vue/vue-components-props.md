---
slug: vue-components-props
id: vue-10
track: vue
order: 10
title: Components and Props
description: Build reusable components with props, type them with TypeScript, validate them, and understand one-way data flow and the definesetup macros.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=CYPZBK8zUik&t=120s
whyItMatters: Build reusable components with props, type them with TypeScript, validate them, and understand one-way data flow and the definesetup macros.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Components and Props

## Components and Props

### Why It Matters

Build reusable components with props, type them with TypeScript, validate them, and understand one-way data flow and the definesetup macros.

Build reusable components with props, type them with TypeScript, validate them, and understand one-way data flow and the definesetup macros.

### Prerequisites

- Stage 1-3: SFCs, reactivity, templates.
- Stage 4: Computed properties.
- TypeScript basics (interfaces, types).

### Topics

- Defining a component in an SFC
- `defineProps()` — runtime declaration vs type-based declaration
- Prop validation: type, required, default, validator
- `defineEmits()` with typed events
- One-way data flow: props down, events up
- Non-prop attributes (fallthrough) and `inheritAttrs: false`
- `defineExpose()` for parent access via template refs
- Async components with `defineAsyncComponent`

### Key Concepts

- Props are read-only inside the child — never mutate a prop directly
- Type-based `defineProps<T>()` provides compile-time type safety and is the recommended approach with `<script setup lang="ts">`
- `withDefaults()` is needed when using type-based props with defaults
- Non-prop attributes (class, style, id) fall through to the root element by default
- `defineExpose({ method })` makes a method/property accessible to parents via a template ref

```vue
<!-- UserCard.vue -->
<script setup lang="ts">
interface Props {
  name: string;
  age?: number;
  role?: "admin" | "user" | "guest";
  tags?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  age: 18,
  role: "user",
  tags: () => [],   // object/array defaults must be factory functions
});

defineEmits<{
  (e: "follow", name: string): void;
  (e: "block", id: number): void;
}>();
</script>

<template>
  <article>
    <h3>{{ props.name }} ({{ props.age }})</h3>
    <span>{{ props.role }}</span>
    <button @click="$emit('follow', props.name)">Follow</button>
  </article>
</template>
```
Caption: Type-based props with defaults

### Common Pitfalls

- Mutating a prop directly — `props.count++` throws a warning and breaks one-way data flow; emit an event for the parent to update.
- Using object/array literals as default in type-based props — `tags: []` is a syntax error; use `withDefaults` with a factory function `() => []`.
- Forgetting that non-prop attributes fall through to the root element — `class="x"` on a component merges with the root's static class.
- Multiple root elements + fallthrough attributes — Vue cannot decide which root to apply them to; set `inheritAttrs: false` and bind `$attrs` manually.
- Accessing a child method via template ref but it's not exposed — `<script setup>` components are closed by default; use `defineExpose` to whitelist.

### Real-World Applications

- GitLab's design system has hundreds of typed Vue components (GlButton, GlDropdown, GlTable) shared across product teams.
- Alibaba's Element Plus library exposes 100+ components with type-based props and validators, used by millions of developers.
- Behance's card component accepts title, image, author props and emits click/bookmark events — reused across grids, lists, and search results.
- Adobe Portfolio's section components (gallery, text, contact form) use `defineAsyncComponent` to lazy-load less-frequently-edited sections.

### Interview Questions

- 1. Why are props read-only in the child? — One-way data flow: the parent owns the source of truth; the child signals intent via events, preventing inconsistent state.
- 2. What's the difference between runtime and type-based `defineProps`? — Type-based uses an interface (`defineProps<T>()`) for compile-time checks; runtime declaration uses an object with `type/required/default/validator` for runtime checks.
- 3. What is `withDefaults` for? — It provides defaults for type-based props, which cannot express defaults inline.
- 4. What happens to non-prop attributes on a component? — They fall through to the root element (merging class/style) unless `inheritAttrs: false`.
- 5. How do you call a child method from a parent in `<script setup>`? — The child must `defineExpose({ method })`, then the parent uses a template ref to access `ref.value.method()`.

### Mini Project

Build a "Reusable Modal" component: A `Modal.vue` that accepts `open` (boolean), `title` (string), and `size` ("sm"/"md"/"lg") props, emits `close` and `confirm` events, and exposes a `focusCloseButton()` method via `defineExpose`. Use it from a parent that opens it on button click. Suggested approach:
  - Use `withDefaults(defineProps<{ open: boolean; title: string; size?: "sm"|"md"|"lg" }>(), { size: "md" })`
  - Emit `close` and `confirm` with `defineEmits`
  - Render a backdrop + dialog with `v-if="open"`
  - Use a template ref on the close button and expose `focusCloseButton` via `defineExpose`
  - In the parent, hold an `open` ref and bind `<Modal :open="open" @close="open = false" @confirm="save" />`

### Exercises

1. Build a `Button.vue` with `variant` ("primary"/"secondary") and `size` props; render with different combos.
2. Add a runtime validator that rejects `size="xl"`.
3. Add a typed emit `click` and use it from a parent with `@click`.
4. Set `inheritAttrs: false` on a multi-root component and bind `$attrs` to a specific element.
5. Use `defineAsyncComponent` to lazy-load a `Chart.vue` and show a fallback spinner.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why are props read-only in the child component?
9. A) For performance
10. B) One-way data flow — the parent owns the state; children emit events to request changes (*)
11. C) Vue disables two-way binding
12. D) TypeScript requires it
13. Explanation: One-way data flow keeps the parent as the source of truth; mutating a prop directly causes warnings and risks inconsistent state.
14. Q2: Which macro provides compile-time prop typing in <script setup lang="ts">?
15. A) props()
16. B) useProps()
17. C) defineProps<T>() with a TypeScript interface (*)
18. D) declareProps()
19. Explanation: `defineProps<Props>()` with a TypeScript interface provides compile-time type safety; for runtime checks use the object form.
20. Q3: How do you provide defaults for type-based props?
21. A) Inside the interface
22. B) Defaults are not supported
23. C) Use a watcher to set them
24. D) With the withDefaults() helper (*)
25. Explanation: `withDefaults(defineProps<Props>(), { ... })` provides defaults for type-based props; object/array defaults must be factory functions.
26. Q4: What happens to non-prop attributes (like class="x") on a component?
27. A) They fall through to the root element (*)
28. B) They are ignored
29. C) They throw an error
30. D) They are applied to every element
31. Explanation: Non-prop attributes (class, style, id, data-*) fall through to the component's root element by default, merging class and style.
32. Q5: How do you disable attribute fallthrough?
33. A) Set fallthrough: false
34. B) Set inheritAttrs: false (in <script setup>, via defineOptions) (*)
35. C) Add a key
36. D) You cannot
37. Explanation: `defineOptions({ inheritAttrs: false })` (or `inheritAttrs: false` in Options API) disables fallthrough; you then bind `$attrs` manually.
38. Q6: How does a parent call a child method in <script setup>?
39. A) Directly via the child instance
40. B) By emitting an event
41. C) The child must defineExpose() the method, then the parent uses a template ref (*)
42. D) It is not possible
43. Explanation: `<script setup>` components are closed by default; the child must `defineExpose({ method })` and the parent calls it via a template ref.
44. Q7: Which is correct for an array default in type-based props?
45. A) tags: []
46. B) tags: () => []
47. C) tags: new Array()
48. D) withDefaults(defineProps<Props>(), { tags: () => [] }) (*)
49. Explanation: Object and array defaults must be factory functions to avoid shared mutable state; use `withDefaults(..., { tags: () => [] })`.
50. Q8: What does defineAsyncComponent do?
51. A) Loads a component lazily, code-splitting it (*)
52. B) Renders a component asynchronously
53. C) Memoizes a component
54. D) Wraps a component in Suspense
55. Explanation: `defineAsyncComponent(() => import("./X.vue"))` lazy-loads the component, splitting it into a separate bundle chunk fetched on demand.
56. Q9: What does defineEmits do?
57. A) Emits an event immediately
58. B) Declares the events a component will emit, with optional types (*)
59. C) Subscribes to events
60. D) Validates events
61. Explanation: `defineEmits<{ (e: 'close'): void }>()` declares the component's emitted events for type-checking and parent autocomplete.
62. Q10: What's the difference between runtime and type-based defineProps?
63. A) There is none
64. B) Type-based is faster
65. C) Type-based gives compile-time checks via TS; runtime declaration gives runtime type checking via the `type` field (*)
66. D) Runtime is preferred in Vue 3.4+
67. Explanation: Type-based (`defineProps<T>()`) provides compile-time type safety; runtime declaration (`defineProps({ type: String })`) provides runtime checks. Type-based is preferred in TS projects.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why are props read-only in the child component?
  options:
    - For performance
    - One-way data flow — the parent owns the state; children emit events to request changes
    - Vue disables two-way binding
    - TypeScript requires it
  correctIndex: 1
  explanation: One-way data flow keeps the parent as the source of truth; mutating a prop directly causes warnings and risks inconsistent state.
- id: q2
  question: Which macro provides compile-time prop typing in <script setup lang="ts">?
  options:
    - props()
    - useProps()
    - defineProps<T>() with a TypeScript interface
    - declareProps()
  correctIndex: 2
  explanation: "`defineProps<Props>()` with a TypeScript interface provides compile-time type safety; for runtime checks use the object form."
- id: q3
  question: How do you provide defaults for type-based props?
  options:
    - Inside the interface
    - Defaults are not supported
    - Use a watcher to set them
    - With the withDefaults() helper
  correctIndex: 3
  explanation: "`withDefaults(defineProps<Props>(), { ... })` provides defaults for type-based props; object/array defaults must be factory functions."
- id: q4
  question: What happens to non-prop attributes (like class="x") on a component?
  options:
    - They fall through to the root element
    - They are ignored
    - They throw an error
    - They are applied to every element
  correctIndex: 0
  explanation: Non-prop attributes (class, style, id, data-*) fall through to the component's root element by default, merging class and style.
- id: q5
  question: How do you disable attribute fallthrough?
  options:
    - "Set fallthrough: false"
    - "Set inheritAttrs: false (in <script setup>, via defineOptions)"
    - Add a key
    - You cannot
    - disables fallthrough; you then bind `$attrs` manually.
  correctIndex: 1
  explanation: "`defineOptions({ inheritAttrs: false })` (or `inheritAttrs: false` in Options API) disables fallthrough; you then bind `$attrs` manually."
- id: q6
  question: How does a parent call a child method in <script setup>?
  options:
    - Directly via the child instance
    - By emitting an event
    - The child must defineExpose() the method, then the parent uses a template ref
    - It is not possible
  correctIndex: 2
  explanation: "`<script setup>` components are closed by default; the child must `defineExpose({ method })` and the parent calls it via a template ref."
- id: q7
  question: Which is correct for an array default in type-based props?
  options:
    - "tags: []"
    - "tags: () => []"
    - "tags: new Array()"
    - "withDefaults(defineProps<Props>(), { tags: () => [] })"
  correctIndex: 3
  explanation: "Object and array defaults must be factory functions to avoid shared mutable state; use `withDefaults(..., { tags: () => [] })`."
- id: q8
  question: What does defineAsyncComponent do?
  options:
    - Loads a component lazily, code-splitting it
    - Renders a component asynchronously
    - Memoizes a component
    - Wraps a component in Suspense
  correctIndex: 0
  explanation: '`defineAsyncComponent(() => import("./X.vue"))` lazy-loads the component, splitting it into a separate bundle chunk fetched on demand.'
- id: q9
  question: What does defineEmits do?
  options:
    - Emits an event immediately
    - Declares the events a component will emit, with optional types
    - Subscribes to events
    - Validates events
  correctIndex: 1
  explanation: "`defineEmits<{ (e: 'close'): void }>()` declares the component's emitted events for type-checking and parent autocomplete."
- id: q10
  question: What's the difference between runtime and type-based defineProps?
  options:
    - There is none
    - Type-based is faster
    - Type-based gives compile-time checks via TS; runtime declaration gives runtime type checking via the `type` field
    - Runtime is preferred in Vue 3.4+
  correctIndex: 2
  explanation: "Type-based (`defineProps<T>()`) provides compile-time type safety; runtime declaration (`defineProps({ type: String })`) provides runtime checks. Type-based is preferred in TS projects."
```

