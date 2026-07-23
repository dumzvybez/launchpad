---
slug: svelte-context-api-component-context
id: svelte-12
track: svelte
order: 12
title: Context API and Component Context
description: Share state across a component subtree without prop drilling using Svelte's Context API (getContext/setContext) and the module-level component context.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=WK4SN853CqI
whyItMatters: Share state across a component subtree without prop drilling using Svelte's Context API (getContext/setContext) and the module-level component context.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Context API and Component Context

## Context API and Component Context

### Why It Matters

Share state across a component subtree without prop drilling using Svelte's Context API (getContext/setContext) and the module-level component context.

Share state across a component subtree without prop drilling using Svelte's Context API (getContext/setContext) and the module-level component context.

### Prerequisites

- Stage 3: Components and Props
- Stage 9: Stores
- Understanding of React Context or Vue provide/inject is helpful but not required.

### Topics

- setContext(key, value) and getContext(key)
- Symbol vs string keys
- Context is component-scoped (set during init, read by descendants)
- Storing stores in context (most common pattern)
- hasContext and lifecycle timing
- Module context: <script context="module"> (legacy) vs $lib
- When to use context vs props vs stores
- Type-safe context with class brands

### Key Concepts

- Context is set during component initialization and readable by descendants only
- Keys must be unique — Symbols are safest; strings work but risk collisions
- The most common pattern is storing a writable store in context
- Context is NOT reactive by itself — but storing a store makes the value reactive
- Context avoids prop drilling: set in a parent, get in any descendant

```svelte
<!-- ThemeProvider.svelte -->
<script lang="ts">
  import { writable, type Writable } from "svelte/store";
  import { setContext } from "svelte";

  const theme = writable<"light" | "dark">("light");
  setContext("theme", theme);
</script>

<div>
  {@render children?.()}
</div>
```
Caption: Context with a store

### Common Pitfalls

- Calling getContext during component init only — getContext outside init returns undefined; it must be called synchronously during the descendant's initialization.
- Using string keys without scoping — collisions with libraries are real; prefer Symbols or class-brand keys.
- Forgetting that context is not reactive by itself — wrap your value in a store if descendants need updates.
- Calling setContext after an await — setContext must be called synchronously during init; async setup breaks it.
- Treating context as global state — context is component-tree scoped; for true global state use a store imported from a module.

### Real-World Applications

- The New York Times uses context to provide a per-article "edition" (US/International) to nested components without prop drilling.
- Apple Music's web player uses context to share the audio controller instance across player, queue, and mini-player components.
- Rakuten uses context to share a cart instance across deeply nested product cards and the cart drawer.
- Chess.com uses context to share the analysis engine instance across board, move list, and evaluation panel.

### Interview Questions

- 1. What's the Context API for? — Sharing values across a component subtree without prop drilling, set in a parent and read by any descendant.
- 2. When must getContext be called? — Synchronously during component initialization; calling it later (after await, in callbacks) returns undefined.
- 3. Is context reactive? — No, the context value itself isn't reactive; wrap it in a store if descendants need to react to changes.
- 4. Why prefer Symbol or class keys? — String keys risk collisions across libraries; Symbols and class constructors are globally unique.
- 5. How does context differ from a store? — Context is component-tree-scoped and set at init; stores are module-level globals importable anywhere.

### Mini Project

Build a Form Provider with Context: A `Form.svelte` that holds a writable store of form values and provides it via context; deeply nested `Field.svelte` components read the context and bind to their `name`. Add validation derived store. Suggested approach:
  - Create FormContext class with a writable values store
  - Form.svelte calls setContext(FormContext, ctx) at init
  - Field.svelte calls getContext(FormContext) and binds its input by name
  - Expose a derived `errors` store that validates required fields
  - Build a demo form with 3 nested Fields and a submit button

### Exercises

1. Build a ThemeProvider that sets a context store; consume it in a nested ThemeToggle.
2. Use a class-brand key for type-safe context.
3. Add hasContext() to gracefully handle missing providers.
4. Try calling getContext inside setTimeout and observe it returns undefined.
5. Compare the same shared state implemented via context vs a module-level store.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does setContext(key, value) do?
9. A) Sets a global variable
10. B) Updates the URL
11. C) Sets a CSS variable
12. D) Stores a value in the current component's context, readable by descendants (*)
13. Explanation: setContext stores a value tied to the component instance; any descendant can read it via getContext during its init.
14. Q2: When must getContext be called?
15. A) Synchronously during component initialization (*)
16. B) Anytime
17. C) Inside onMount only
18. D) After an await
19. Explanation: getContext must be called during the component's synchronous init; calling it later (in callbacks, after await) returns undefined.
20. Q3: Is context reactive by itself?
21. A) Yes
22. B) No — wrap the value in a store if descendants need updates (*)
23. C) Only in Svelte 4
24. D) Only with $state
25. Explanation: The context value is just a value; to make it reactive, store a writable store in context and use $store in descendants.
26. Q4: Which key type is safest against collisions?
27. A) Strings
28. B) Numbers
29. C) Symbols or class constructors (*)
30. D) Booleans
31. Explanation: Symbols and class constructors are globally unique; string keys can collide across libraries that use the same name.
32. Q5: How does context differ from a module-level store?
33. A) Stores are faster
34. B) Context is global
35. C) There's no difference
36. D) Context is component-tree-scoped; stores are global imports (*)
37. Explanation: Context is set per component instance and inherited by descendants; module-level stores are singletons importable anywhere.
38. Q6: What does hasContext(key) return?
39. A) true if a context was set for that key, else false (*)
40. B) The value
41. C) Always true
42. D) The component instance
43. Explanation: hasContext returns a boolean — useful to guard getContext when a provider may be absent.
44. Q7: What happens if you call setContext after an await?
45. A) It works fine
46. B) It throws or has no effect — context must be set synchronously during init (*)
47. C) It becomes a store
48. D) It's deferred to onMount
49. Explanation: setContext must be called synchronously during component init; calling it after await (or in onMount) is too late — descendants won't see it.
50. Q8: What's the most common context pattern?
51. A) Storing plain objects
52. B) Storing functions only
53. C) Storing a writable store so descendants get reactivity via $store (*)
54. D) Storing strings
55. Explanation: Wrapping a value in a writable store and putting it in context gives descendants both access AND reactivity via `$store` auto-subscription.
56. Q9: Can a parent read context set by a child?
57. A) Yes
58. B) Only with hasContext
59. C) Only in Svelte 4
60. D) No — context flows parent-to-descendant only (*)
61. Explanation: Context flows downward: a parent sets, descendants get. A parent cannot read a child's context.
62. Q10: Why avoid context for component-local state?
63. A) Context is for sharing across a subtree; local state should use $state or $props (*)
64. B) Context is slower than $state
65. C) Context is deprecated
66. D) Context only works in SvelteKit
67. Explanation: Use $state for component-local reactivity; reserve context for cross-subtree sharing without prop drilling.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does setContext(key, value) do?
  options:
    - Sets a global variable
    - Updates the URL
    - Sets a CSS variable
    - Stores a value in the current component's context, readable by descendants
  correctIndex: 3
  explanation: setContext stores a value tied to the component instance; any descendant can read it via getContext during its init.
- id: q2
  question: When must getContext be called?
  options:
    - Synchronously during component initialization
    - Anytime
    - Inside onMount only
    - After an await
  correctIndex: 0
  explanation: getContext must be called during the component's synchronous init; calling it later (in callbacks, after await) returns undefined.
- id: q3
  question: Is context reactive by itself?
  options:
    - Yes
    - No — wrap the value in a store if descendants need updates
    - Only in Svelte 4
    - Only with $state
  correctIndex: 1
  explanation: The context value is just a value; to make it reactive, store a writable store in context and use $store in descendants.
- id: q4
  question: Which key type is safest against collisions?
  options:
    - Strings
    - Numbers
    - Symbols or class constructors
    - Booleans
  correctIndex: 2
  explanation: Symbols and class constructors are globally unique; string keys can collide across libraries that use the same name.
- id: q5
  question: How does context differ from a module-level store?
  options:
    - Stores are faster
    - Context is global
    - There's no difference
    - Context is component-tree-scoped; stores are global imports
  correctIndex: 3
  explanation: Context is set per component instance and inherited by descendants; module-level stores are singletons importable anywhere.
- id: q6
  question: What does hasContext(key) return?
  options:
    - true if a context was set for that key, else false
    - The value
    - Always true
    - The component instance
  correctIndex: 0
  explanation: hasContext returns a boolean — useful to guard getContext when a provider may be absent.
- id: q7
  question: What happens if you call setContext after an await?
  options:
    - It works fine
    - It throws or has no effect — context must be set synchronously during init
    - It becomes a store
    - It's deferred to onMount
  correctIndex: 1
  explanation: setContext must be called synchronously during component init; calling it after await (or in onMount) is too late — descendants won't see it.
- id: q8
  question: What's the most common context pattern?
  options:
    - Storing plain objects
    - Storing functions only
    - Storing a writable store so descendants get reactivity via $store
    - Storing strings
  correctIndex: 2
  explanation: Wrapping a value in a writable store and putting it in context gives descendants both access AND reactivity via `$store` auto-subscription.
- id: q9
  question: Can a parent read context set by a child?
  options:
    - Yes
    - Only with hasContext
    - Only in Svelte 4
    - No — context flows parent-to-descendant only
  correctIndex: 3
  explanation: "Context flows downward: a parent sets, descendants get. A parent cannot read a child's context."
- id: q10
  question: Why avoid context for component-local state?
  options:
    - Context is for sharing across a subtree; local state should use $state or $props
    - Context is slower than $state
    - Context is deprecated
    - Context only works in SvelteKit
  correctIndex: 0
  explanation: Use $state for component-local reactivity; reserve context for cross-subtree sharing without prop drilling.
```

