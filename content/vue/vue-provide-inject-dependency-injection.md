---
slug: vue-provide-inject-dependency-injection
id: vue-12
track: vue
order: 12
title: Provide/Inject and Dependency Injection
description: Share state across a deeply nested component tree using provide/inject, type it with InjectionKey, and make it reactive.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=60s
whyItMatters: Share state across a deeply nested component tree using provide/inject, type it with InjectionKey, and make it reactive.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Provide/Inject and Dependency Injection

## Provide/Inject and Dependency Injection

### Why It Matters

Share state across a deeply nested component tree using provide/inject, type it with InjectionKey, and make it reactive.

Share state across a deeply nested component tree using provide/inject, type it with InjectionKey, and make it reactive.

### Prerequisites

- Stage 10: Components and Props (you understand parent/child).
- Stage 11: Slots.
- Stage 2: refs and reactive.

### Topics

- `provide()` and `inject()` in `<script setup>`
- Why provide/inject beats prop drilling
- `InjectionKey<T>` for type-safe injection
- Default values and factory functions
- Making provided values reactive (provide a ref, not a value)
- `readonly()` to prevent children from mutating
- App-level provides via `app.provide`
- Comparison with Provide/Inject in Vue 2

### Key Concepts

- Provide/inject lets an ancestor share data with any descendant, bypassing intermediate components
- The provided value can be anything — a primitive, object, function, or ref
- To keep reactivity, provide a ref (or reactive object), not the unwrapped value
- `inject(key, default)` accepts a default for when no ancestor provides
- `readonly()` lets you expose an immutable view to descendants while keeping a writable source

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { ref, provide } from "vue";

const theme = ref<"light" | "dark">("light");
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

provide("theme", theme);
provide("toggleTheme", toggleTheme);
</script>

<template>
  <button @click="toggleTheme">Toggle</button>
  <slot />
</template>
```
Caption: Basic provide/inject

### Common Pitfalls

- Providing a non-reactive value and expecting descendants to see updates — provide a ref (or reactive object) so changes propagate.
- Mutating an injected ref directly in a descendant when the parent expects to control it — wrap with `readonly()` and expose a setter function instead.
- Forgetting default values — `inject("x")` returns `undefined` if no ancestor provides, causing runtime errors; pass a default.
- Using a string key without a shared InjectionKey — TypeScript cannot type-check the injection; use `InjectionKey<T>` for safety.
- Expecting provide/inject to work across separate app instances — provides are scoped to a single app tree; sibling apps do not share.

### Real-World Applications

- GitLab's design tokens (colors, spacing) are provided at the app root so any component can inject them without prop drilling.
- Alibaba's Element Plus uses provide/inject to share form context (validity, disabled state) with all form-item descendants.
- Behance's gallery uses provide/inject to share the current user context (logged in, permissions) deep into nested card overlays.
- Adobe Portfolio uses provide/inject to expose the active site's theme, fonts, and layout settings to every section component.

### Interview Questions

- 1. Why use provide/inject over props? — To share data with deeply nested descendants without prop drilling through intermediate components that don't need the data.
- 2. How do you keep provide/inject reactive? — Provide a `ref` or `reactive` object; descendants inject the same ref and see updates.
- 3. What is an `InjectionKey<T>`? — A Symbol-typed key that carries TypeScript type information so `inject(key)` returns the correct type.
- 4. How do you prevent descendants from mutating an injected value? — Wrap with `readonly()` before providing, and expose setter functions for controlled mutations.
- 5. What's the difference between component-level and app-level provide? — Component-level provides are scoped to the component's subtree; app-level (`app.provide`) is available to the whole app.

### Mini Project

Build a "Theme System" with provide/inject: An `App.vue` provides a theme context (color + toggle) and a `SettingsPanel.vue` three levels deep injects and toggles it. Suggested approach:
  - Define a `ThemeKey: InjectionKey<ThemeContext>` in `keys.ts`
  - In `App.vue`, hold `const theme = ref<"light"|"dark">("light")` and provide `{ theme: readonly(theme), toggle: () => ... }`
  - Build three nested components: `App` -> `Layout` -> `Dashboard` -> `SettingsPanel`
  - In `SettingsPanel`, `inject(ThemeKey)` and bind `:class` to the theme value
  - Add a button that calls the injected `toggle()` function

### Exercises

1. Provide a string from a grandparent and inject it in a grandchild.
2. Make the provided value reactive (ref) and verify the descendant updates when it changes.
3. Refactor to use an `InjectionKey<T>` and remove any manual type casts.
4. Wrap the provided ref in `readonly()` and try to mutate it from a child — observe the warning.
5. Use `app.provide` in `main.ts` to make an API URL available app-wide.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What problem does provide/inject solve?
9. A) Async data fetching
10. B) CSS scoping
11. C) Form validation
12. D) Prop drilling — sharing data with deeply nested descendants without passing through intermediates (*)
13. Explanation: Provide/inject lets an ancestor share data with any descendant, bypassing intermediate components that don't need the data.
14. Q2: How do you keep a provided value reactive?
15. A) Provide a ref or reactive object so descendants see updates (*)
16. B) Provide a plain value
17. C) Use a computed
18. D) You cannot
19. Explanation: Provide a `ref` or `reactive` object; the descendant injects the same reference and Vue's reactivity propagates updates.
20. Q3: What is an InjectionKey<T>?
21. A) A string with a type
22. B) A Symbol that carries type information so inject() returns the correct type (*)
23. C) A built-in Vue type
24. D) A deprecated API
25. Explanation: `InjectionKey<T>` is a `Symbol` typed with `T` so `inject(key)` returns `T | undefined` without manual casts.
26. Q4: What happens if inject() can't find a provided value and no default is given?
27. A) Vue throws an error
28. B) It returns null
29. C) It returns undefined (*)
30. D) It blocks rendering
31. Explanation: `inject(key)` returns `undefined` if no ancestor provides that key; pass a second argument to set a default.
32. Q5: How do you expose a read-only version of a ref to descendants?
33. A) Provide a string
34. B) Use shallowRef
35. C) Set a flag
36. D) Wrap with readonly() before providing (*)
37. Explanation: `provide(key, readonly(myRef))` exposes an immutable proxy that warns on mutation; the parent keeps the writable source.
38. Q6: How is app-level provide different from component-level?
39. A) App-level (app.provide) is available to the whole app tree; component-level is scoped to the subtree (*)
40. B) It is the same
41. C) App-level is faster
42. D) Component-level is preferred
43. Explanation: `app.provide` makes a value available to every component in the app; component-level `provide()` is scoped to that component's subtree.
44. Q7: Why avoid using a string key for provide/inject in TypeScript projects?
45. A) Strings are slower
46. B) TypeScript cannot infer the injected value's type; use an InjectionKey<T> for type safety (*)
47. C) String keys cause memory leaks
48. D) Strings are deprecated
49. Explanation: A plain string key gives `inject()` a type of `unknown`; an `InjectionKey<T>` carries the type so `inject(key)` returns `T | undefined`.
50. Q8: What does `inject(key, default)` do?
51. A) Throws if not provided
52. B) Sets the default as the provided value
53. C) Returns the default if no ancestor provides the key (*)
54. D) Merges the default with the provided value
55. Explanation: The second argument to `inject()` is the default value returned if no ancestor provides the key.
56. Q9: Can provide/inject share data across two separate Vue apps on the same page?
57. A) Yes
58. B) Only with Pinia
59. C) Only in Vue 2
60. D) No — provides are scoped per app instance (*)
61. Explanation: Each `createApp()` has its own provide scope; sibling apps do not share provided values unless you explicitly bridge them.
62. Q10: Which is the recommended pattern when a descendant needs to MUTATE provided state?
63. A) Provide a setter function alongside the readonly state and call it from the descendant (*)
64. B) Mutate the injected ref directly
65. C) Use v-model
66. D) Emit an event
67. Explanation: Provide the readonly state plus a setter function (like `toggle()`) so descendants request mutations through a controlled API rather than mutating the source directly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What problem does provide/inject solve?
  options:
    - Async data fetching
    - CSS scoping
    - Form validation
    - Prop drilling — sharing data with deeply nested descendants without passing through intermediates
  correctIndex: 3
  explanation: Provide/inject lets an ancestor share data with any descendant, bypassing intermediate components that don't need the data.
- id: q2
  question: How do you keep a provided value reactive?
  options:
    - Provide a ref or reactive object so descendants see updates
    - Provide a plain value
    - Use a computed
    - You cannot
  correctIndex: 0
  explanation: Provide a `ref` or `reactive` object; the descendant injects the same reference and Vue's reactivity propagates updates.
- id: q3
  question: What is an InjectionKey<T>?
  options:
    - A string with a type
    - A Symbol that carries type information so inject() returns the correct type
    - A built-in Vue type
    - A deprecated API
  correctIndex: 1
  explanation: "`InjectionKey<T>` is a `Symbol` typed with `T` so `inject(key)` returns `T | undefined` without manual casts."
- id: q4
  question: What happens if inject() can't find a provided value and no default is given?
  options:
    - Vue throws an error
    - It returns null
    - It returns undefined
    - It blocks rendering
  correctIndex: 2
  explanation: "`inject(key)` returns `undefined` if no ancestor provides that key; pass a second argument to set a default."
- id: q5
  question: How do you expose a read-only version of a ref to descendants?
  options:
    - Provide a string
    - Use shallowRef
    - Set a flag
    - Wrap with readonly() before providing
  correctIndex: 3
  explanation: "`provide(key, readonly(myRef))` exposes an immutable proxy that warns on mutation; the parent keeps the writable source."
- id: q6
  question: How is app-level provide different from component-level?
  options:
    - App-level (app.provide) is available to the whole app tree; component-level is scoped to the subtree
    - It is the same
    - App-level is faster
    - Component-level is preferred
  correctIndex: 0
  explanation: "`app.provide` makes a value available to every component in the app; component-level `provide()` is scoped to that component's subtree."
- id: q7
  question: Why avoid using a string key for provide/inject in TypeScript projects?
  options:
    - Strings are slower
    - TypeScript cannot infer the injected value's type; use an InjectionKey<T> for type safety
    - String keys cause memory leaks
    - Strings are deprecated
  correctIndex: 1
  explanation: A plain string key gives `inject()` a type of `unknown`; an `InjectionKey<T>` carries the type so `inject(key)` returns `T | undefined`.
- id: q8
  question: What does `inject(key, default)` do?
  options:
    - Throws if not provided
    - Sets the default as the provided value
    - Returns the default if no ancestor provides the key
    - Merges the default with the provided value
  correctIndex: 2
  explanation: The second argument to `inject()` is the default value returned if no ancestor provides the key.
- id: q9
  question: Can provide/inject share data across two separate Vue apps on the same page?
  options:
    - Yes
    - Only with Pinia
    - Only in Vue 2
    - No — provides are scoped per app instance
  correctIndex: 3
  explanation: Each `createApp()` has its own provide scope; sibling apps do not share provided values unless you explicitly bridge them.
- id: q10
  question: Which is the recommended pattern when a descendant needs to MUTATE provided state?
  options:
    - Provide a setter function alongside the readonly state and call it from the descendant
    - Mutate the injected ref directly
    - Use v-model
    - Emit an event
  correctIndex: 0
  explanation: Provide the readonly state plus a setter function (like `toggle()`) so descendants request mutations through a controlled API rather than mutating the source directly.
```

