---
slug: vue-vue-instance-reactivity
id: vue-02
track: vue
order: 2
title: The Vue Instance and Reactivity
description: Master Vue's reactivity system using ref, reactive, and shallowRef, and understand how ES Proxy-based reactivity tracks dependencies automatically.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=30s
whyItMatters: Master Vue's reactivity system using ref, reactive, and shallowRef, and understand how ES Proxy-based reactivity tracks dependencies automatically.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# The Vue Instance and Reactivity

## The Vue Instance and Reactivity

### Why It Matters

Master Vue's reactivity system using ref, reactive, and shallowRef, and understand how ES Proxy-based reactivity tracks dependencies automatically.

Master Vue's reactivity system using ref, reactive, and shallowRef, and understand how ES Proxy-based reactivity tracks dependencies automatically.

### Prerequisites

- Stage 1: Getting Started with Vue (you can scaffold and run a Vue project).
- Comfort with ES6 destructuring, arrow functions, and TypeScript basics.

### Topics

- The Composition API mental model (functions vs options)
- `ref()` for primitives and objects — .value access
- `reactive()` for objects — Proxy-wrapped deep reactivity
- `shallowRef()` and `shallowReactive()` for performance
- `readonly()` and `shallowReadonly()` for immutability
- How Vue tracks dependencies via Proxy get/set traps
- Reactive vs ref: when to use which
- The `unref()` and `isRef()` helpers

### Key Concepts

- `ref()` wraps any value in a { value: T } object so Vue can track it; primitives MUST use ref
- `reactive()` only works on objects (including arrays, Map, Set); primitives throw
- Refs auto-unwrap in templates (`count` not `count.value`) but NOT in plain JS
- Reactivity is synchronous and batched per tick via the scheduler
- Deep reactivity recursively proxies nested objects — convenient but can be slow for large data

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const name = ref<string>("Vue");

function increment() {
  count.value++;           // must use .value in JS
  name.value = `Vue ${count.value}`;
}
</script>

<template>
  <button @click="increment">{{ name }} — clicked {{ count }}</button>
  <!-- Note: no .value needed in template -->
</template>
```
Caption: ref for primitives

### Common Pitfalls

- Destructuring a reactive object — `const { name } = state` loses reactivity; use `toRefs()` to convert each field into a ref first.
- Replacing a reactive object — `state = { ...newState }` reassigns the local variable, breaking the original proxy; mutate fields or use ref + .value reassign.
- Forgetting `.value` in JavaScript — `count++` throws "ReferenceError: count is not defined" or silently no-ops; use `count.value++`.
- Using `reactive()` on a primitive — `reactive(0)` returns the raw value with no reactivity; always use `ref()` for primitives.
- Mutating nested fields on `shallowRef` — shallowRef only tracks .value reassignment, so `bigList.value.push(x)` will NOT trigger updates; reassign the whole array.

### Real-World Applications

- GitLab uses reactive stores for its issue boards; deep reactivity powers real-time drag-and-drop column updates.
- Alibaba's Element Plus table component uses shallowRef for large datasets to avoid deep-proxy overhead on thousands of rows.
- Behance's project viewer uses reactive() for the gallery state, tracking scroll position, current item, and filter facets.
- Adobe Portfolio's editor uses readonly() to expose immutable theme config to child components while keeping the writable source in one place.

### Interview Questions

- 1. What's the difference between ref and reactive? — ref wraps any value (including primitives) and requires .value in JS; reactive only works on objects and is accessed directly.
- 2. Why does Vue use Proxy instead of Object.defineProperty? — Proxy can track property addition, deletion, and array index/length mutations that Vue 2 could not detect.
- 3. How does Vue's reactivity system know which effects to re-run? — During a get trap, the running effect is recorded as a subscriber to that property; on set, all subscribers are notified.
- 4. When would you use shallowRef over ref? — For large arrays/objects where you always replace the whole value, to avoid the cost of recursively proxying every nested field.
- 5. What does `toRefs()` do and when do you need it? — It converts each property of a reactive object into a ref so you can destructure without losing reactivity, typically when returning from a composable.

### Mini Project

Build a "Reactive Shopping Cart" mini-app: An SFC that holds a cart (reactive array of items with name, price, qty) and a total (computed). Let the user add items from a hardcoded catalog, increment/decrement quantities, and see the total update live. Suggested approach:
  - Use `reactive()` for the cart array and the catalog
  - Use `ref()` for the discount percentage (a primitive)
  - Compute the total via a `computed()` (introduced formally in Stage 4 — for now use a watcher)
  - Add an "empty cart" button that sets `cart.length = 0` (a reactive mutation)
  - Display a live count of items using `cart.reduce((n, i) => n + i.qty, 0)`

### Exercises

1. Create a `ref<number>` counter and a button that increments it; confirm the template updates without `.value`.
2. Convert the counter to `reactive({ count: 0 })` and verify both approaches produce the same UI behavior.
3. Build a small `shallowRef` list of 1000 numbers; add a button to push (no update) vs reassign (update) and observe the difference.
4. Wrap a reactive object in `readonly()` and try to mutate it from a child component — observe the warning in dev.
5. Use `toRefs()` to destructure a reactive state object and confirm the destructured fields stay reactive.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which function wraps a primitive so Vue can track changes to it?
9. A) reactive()
10. B) ref() (*)
11. C) computed()
12. D) watch()
13. Explanation: `ref()` wraps any value (including primitives) in a `{ value: T }` object; reactive() only works on objects.
14. Q2: In JavaScript (not template), how do you read a ref's value?
15. A) myRef
16. B) myRef.get()
17. C) myRef.value (*)
18. D) *myRef
19. Explanation: Refs require `.value` access in JavaScript; in templates Vue auto-unwraps them so you write `myRef` directly.
20. Q3: What happens when you destructure a reactive() object?
21. A) Each field becomes a ref automatically
22. B) Vue throws an error
23. C) Nothing changes
24. D) Each field loses reactivity — use toRefs() to preserve it (*)
25. Explanation: Destructuring copies the plain value out of the proxy, breaking reactivity; `toRefs()` converts each field to a ref before destructuring.
26. Q4: Which primitive does Vue 3 use to implement reactivity?
27. A) ES Proxy (*)
28. B) Object.defineProperty
29. C) getters/setters only
30. D) Web Workers
31. Explanation: Vue 3 uses ES Proxy so it can detect property add/delete and array index mutations that Vue 2 could not.
32. Q5: What does shallowRef() track?
33. A) Every nested property change
34. B) Only .value reassignment, not nested mutations (*)
35. C) Nothing — it is just a placeholder
36. D) All async changes
37. Explanation: shallowRef only triggers effects when you replace .value as a whole; nested mutations are NOT reactive.
38. Q6: Why does reactive() not work on primitives?
39. A) Vue blocks it intentionally for performance
40. B) Primitives are already reactive
41. C) Primitives cannot be Proxied; Proxy only works on objects (*)
42. D) TypeScript forbids it
43. Explanation: ES Proxy requires a target object; primitives (number, string, boolean) cannot be proxied, so Vue requires ref() for them.
44. Q7: When you mutate state.todos.push(item) on a reactive() array, what happens?
45. A) Nothing — Vue cannot track array methods
46. B) Vue throws an error
47. C) The push is delayed to the next tick
48. D) Vue's Proxy intercepts the push and triggers reactivity (*)
49. Explanation: Vue 3's Proxy intercepts array methods like push/pop/splice, so mutations are reactive without Vue.set.
50. Q8: What does readonly(state) do?
51. A) Returns a deep readonly proxy that warns on mutation in dev (*)
52. B) Freezes the object permanently
53. C) Deletes all setters
54. D) Makes the object immutable at the JS engine level
55. Explanation: `readonly()` returns a Proxy that throws a dev warning when you try to mutate it; useful for exposing immutable state to children.
56. Q9: What's the recommended way to replace an entire reactive() object?
57. A) state = { ...newState }
58. B) Object.assign(state, newState) or mutate fields individually (*)
59. C) delete state; state = newState
60. D) Vue.set(state, newState)
61. Explanation: Reassigning a reactive variable breaks the proxy binding; use `Object.assign(state, newState)` to update fields in place.
62. Q10: What does isRef(x) return?
63. A) true if x is reactive
64. B) true if x is a primitive
65. C) true if x is a ref object (*)
66. D) Always true
67. Explanation: `isRef(x)` returns true only if x is a ref (created by ref(), shallowRef(), computed(), etc.); useful for type guards in composables.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which function wraps a primitive so Vue can track changes to it?
  options:
    - reactive()
    - ref()
    - computed()
    - watch()
  correctIndex: 1
  explanation: "`ref()` wraps any value (including primitives) in a `{ value: T }` object; reactive() only works on objects."
- id: q2
  question: In JavaScript (not template), how do you read a ref's value?
  options:
    - myRef
    - myRef.get()
    - myRef.value
    - "*myRef"
  correctIndex: 2
  explanation: Refs require `.value` access in JavaScript; in templates Vue auto-unwraps them so you write `myRef` directly.
- id: q3
  question: What happens when you destructure a reactive() object?
  options:
    - Each field becomes a ref automatically
    - Vue throws an error
    - Nothing changes
    - Each field loses reactivity — use toRefs() to preserve it
  correctIndex: 3
  explanation: Destructuring copies the plain value out of the proxy, breaking reactivity; `toRefs()` converts each field to a ref before destructuring.
- id: q4
  question: Which primitive does Vue 3 use to implement reactivity?
  options:
    - ES Proxy
    - Object.defineProperty
    - getters/setters only
    - Web Workers
  correctIndex: 0
  explanation: Vue 3 uses ES Proxy so it can detect property add/delete and array index mutations that Vue 2 could not.
- id: q5
  question: What does shallowRef() track?
  options:
    - Every nested property change
    - Only .value reassignment, not nested mutations
    - Nothing — it is just a placeholder
    - All async changes
  correctIndex: 1
  explanation: shallowRef only triggers effects when you replace .value as a whole; nested mutations are NOT reactive.
- id: q6
  question: Why does reactive() not work on primitives?
  options:
    - Vue blocks it intentionally for performance
    - Primitives are already reactive
    - Primitives cannot be Proxied; Proxy only works on objects
    - TypeScript forbids it
  correctIndex: 2
  explanation: ES Proxy requires a target object; primitives (number, string, boolean) cannot be proxied, so Vue requires ref() for them.
- id: q7
  question: When you mutate state.todos.push(item) on a reactive() array, what happens?
  options:
    - Nothing — Vue cannot track array methods
    - Vue throws an error
    - The push is delayed to the next tick
    - Vue's Proxy intercepts the push and triggers reactivity
  correctIndex: 3
  explanation: Vue 3's Proxy intercepts array methods like push/pop/splice, so mutations are reactive without Vue.set.
- id: q8
  question: What does readonly(state) do?
  options:
    - Returns a deep readonly proxy that warns on mutation in dev
    - Freezes the object permanently
    - Deletes all setters
    - Makes the object immutable at the JS engine level
  correctIndex: 0
  explanation: "`readonly()` returns a Proxy that throws a dev warning when you try to mutate it; useful for exposing immutable state to children."
- id: q9
  question: What's the recommended way to replace an entire reactive() object?
  options:
    - state = { ...newState }
    - Object.assign(state, newState) or mutate fields individually
    - delete state; state = newState
    - Vue.set(state, newState)
  correctIndex: 1
  explanation: Reassigning a reactive variable breaks the proxy binding; use `Object.assign(state, newState)` to update fields in place.
- id: q10
  question: What does isRef(x) return?
  options:
    - true if x is reactive
    - true if x is a primitive
    - true if x is a ref object
    - Always true
  correctIndex: 2
  explanation: "`isRef(x)` returns true only if x is a ref (created by ref(), shallowRef(), computed(), etc.); useful for type guards in composables."
```

