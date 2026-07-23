---
slug: vue-pinia-state-management
id: vue-16
track: vue
order: 16
title: Pinia — State Management
description: "Replace Vuex with Pinia for type-safe state management: define stores with setup or options syntax, mutate state via actions, and persist across reloads."
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=300s
whyItMatters: "Replace Vuex with Pinia for type-safe state management: define stores with setup or options syntax, mutate state via actions, and persist across reloads."
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Pinia — State Management

## Pinia — State Management

### Why It Matters

Replace Vuex with Pinia for type-safe state management: define stores with setup or options syntax, mutate state via actions, and persist across reloads.

Replace Vuex with Pinia for type-safe state management: define stores with setup or options syntax, mutate state via actions, and persist across reloads.

### Prerequisites

- Stage 2: Reactivity.
- Stage 14: Composables.
- Stage 15: Vue Router (for navigation-integrated stores).

### Topics

- Why Pinia replaced Vuex in Vue 3
- `defineStore()` — options vs setup syntax
- State, getters, and actions
- Accessing stores in components with `useXStore()`
- Mutating state directly (Pinia allows it) vs via actions
- `storeToRefs()` for destructuring without losing reactivity
- Resetting, patching (`$patch`), and subscribing (`$subscribe`)
- Pinia plugins and persistence (`pinia-plugin-persistedstate`)

### Key Concepts

- Pinia is the official Vue store (Vuex is in maintenance); it has full TypeScript inference and no mutations boilerplate
- Setup stores look like composables: `defineStore("x", () => { const count = ref(0); return { count }; })`
- Options stores use `state/getters/actions` (familiar to Vuex users)
- You can mutate state directly (`store.count++`) — Pinia tracks it; actions are for async or batched logic
- `storeToRefs(store)` lets you destructure without losing reactivity (like `toRefs` for stores)

```ts
// stores/counter.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  async function incrementAsync() {
    await new Promise((r) => setTimeout(r, 100));
    count.value++;
  }

  return { count, double, increment, incrementAsync };
});
```
Caption: Setup store

### Common Pitfalls

- Destructuring a store without `storeToRefs()` — `const { count } = store` loses reactivity (count becomes a plain value); use `storeToRefs`.
- Mutating state outside an action in strict Vuex mindset — Pinia allows direct mutation (`store.count++`); only use actions for async or batched logic.
- Forgetting to install Pinia (`app.use(pinia)`) — calling `useStore()` outside an installed app throws "no active Pinia".
- Using `this` in setup stores — setup stores use closure (no `this`); options stores use `this` to access state/getters/actions.
- Storing non-serializable objects in persistent state — DOM nodes, class instances, functions don't survive JSON serialization; persist only plain data.

### Real-World Applications

- GitLab uses Pinia for its new frontend modules (issues, epics, merge requests), gradually migrating from Vuex.
- Alibaba's Element Plus templates use Pinia for auth, cart, and UI state with the persistedstate plugin.
- Behance's portfolio SPA uses Pinia stores for user session, notifications, and the active project draft.
- Adobe Portfolio uses Pinia for the editor's site-wide state (sections, theme, layout) with persistence to localStorage.

### Interview Questions

- 1. Why did Pinia replace Vuex? — Better TypeScript inference, no mutations boilerplate, simpler API (state/getters/actions), smaller bundle, devtools integration.
- 2. What's the difference between setup and options stores? — Setup stores use the composable syntax (`defineStore("x", () => {...})`); options stores use `state/getters/actions` (Vuex-like).
- 3. How do you destructure a store without losing reactivity? — Use `storeToRefs(store)` for state and getters; actions can be destructured directly (they're stable).
- 4. Can you mutate Pinia state directly? — Yes, `store.count++` works; actions are for async or batched mutations, not a strict requirement.
- 5. What does `$patch` do? — Applies multiple state changes in one batch (object or function form), triggering a single re-render.

### Mini Project

Build a "Shopping Cart" Pinia store: A cart store with items, total getter, addItem/removeItem/clear actions, and persistence to localStorage. Use it from a small product list UI. Suggested approach:
  - Define `useCartStore` with `state: () => ({ items: [] as { id: number; name: string; price: number; qty: number }[] })`
  - Add getters: `totalItems`, `totalPrice`
  - Add actions: `addItem(item)`, `removeItem(id)`, `clear()`
  - Add `persist: true` via the persistedstate plugin so the cart survives reloads
  - In a `ProductList.vue`, call `useCartStore()` and bind `addItem` to "Add" buttons

### Exercises

1. Install Pinia, register it, and define a setup-store counter.
2. Convert the counter to an options store and verify the API is equivalent.
3. Use `storeToRefs` to destructure state and getters; mutate via an action.
4. Use `$patch` to bulk-update state and `$subscribe` to log changes.
5. Add the persistedstate plugin and verify the store survives a page reload.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which function defines a Pinia store?
9. A) createStore()
10. B) createStore()
11. C) useStore()
12. D) defineStore() (*)
13. Explanation: `defineStore("id", ...)` defines a Pinia store; `useStore()` is the resulting composable you call in components.
14. Q2: Why did Pinia replace Vuex as the official Vue store?
15. A) Better TypeScript inference, no mutations boilerplate, simpler API (*)
16. B) Pinia is faster
17. C) Vuex is deprecated
18. D) Pinia is built into Vue core
19. Explanation: Pinia offers full TS type inference, removes the mutations concept, has a simpler API, smaller bundle, and is the official Vue 3 store.
20. Q3: How do you destructure a Pinia store without losing reactivity?
21. A) const { x } = store
22. B) Use storeToRefs(store) for state and getters (*)
23. C) Use toRefs(store)
24. D) Destructuring always preserves reactivity
25. Explanation: `storeToRefs(store)` returns reactive refs for state and getters; actions can be destructured directly because they're stable functions.
26. Q4: Can you mutate Pinia state directly (e.g. store.count++)?
27. A) No, you must use an action
28. B) Only in setup stores
29. C) Yes — Pinia tracks direct mutations; actions are for async/batched logic (*)
30. D) Only with $patch
31. Explanation: Unlike Vuex, Pinia allows direct state mutation; actions are recommended for async or batched mutations but not strictly required.
32. Q5: What does storeToRefs() return for?
33. A) Actions only
34. B) The store instance
35. C) Plain values
36. D) State and getters as refs (without losing reactivity on destructure) (*)
37. Explanation: `storeToRefs(store)` returns an object whose state and getter properties are refs, so destructuring preserves reactivity; actions are excluded.
38. Q6: Which is the setup-store syntax?
39. A) defineStore("x", () => { const c = ref(0); return { c }; }) (*)
40. B) defineStore("x", { state, getters, actions })
41. C) defineStore("x", function() {})
42. D) defineStore("x", [state, actions])
43. Explanation: Setup stores pass a composable-style function `() => { ... return {...} }`; options stores pass `{ state, getters, actions }`.
44. Q7: What does $patch do?
45. A) Resets the store
46. B) Applies multiple state changes in one batch (*)
47. C) Subscribes to changes
48. D) Disposes the store
49. Explanation: `store.$patch({ ... })` or `store.$patch(state => { ... })` applies multiple changes in one batch, triggering a single re-render.
50. Q8: What does $subscribe do?
51. A) Subscribes to a getter
52. B) Subscribes to actions
53. C) Registers a callback that fires on every state mutation (*)
54. D) Resets the state
55. Explanation: `store.$subscribe((mutation, state) => {...})` fires whenever the store's state changes; useful for persistence or logging.
56. Q9: How do you persist a Pinia store across reloads?
57. A) Use a watcher
58. B) Use localStorage manually only
59. C) Pinia persists by default
60. D) Use the pinia-plugin-persistedstate plugin and set `persist: true` on the store (*)
61. Explanation: Install `pinia-plugin-persistedstate`, register it via `pinia.use(...)`, and add `persist: true` to the store definition; the plugin syncs to localStorage.
62. Q10: What's the difference between setup and options stores?
63. A) Setup stores use composable syntax (no `this`); options stores use `state/getters/actions` with `this` (*)
64. B) Setup stores are deprecated
65. C) Options stores are faster
66. D) There is no difference
67. Explanation: Setup stores use closure-based syntax (no `this`, like composables); options stores use the Vuex-like `state/getters/actions` shape with `this` referring to the store.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which function defines a Pinia store?
  options:
    - createStore()
    - createStore()
    - useStore()
    - defineStore()
  correctIndex: 3
  explanation: '`defineStore("id", ...)` defines a Pinia store; `useStore()` is the resulting composable you call in components.'
- id: q2
  question: Why did Pinia replace Vuex as the official Vue store?
  options:
    - Better TypeScript inference, no mutations boilerplate, simpler API
    - Pinia is faster
    - Vuex is deprecated
    - Pinia is built into Vue core
  correctIndex: 0
  explanation: Pinia offers full TS type inference, removes the mutations concept, has a simpler API, smaller bundle, and is the official Vue 3 store.
- id: q3
  question: How do you destructure a Pinia store without losing reactivity?
  options:
    - const { x } = store
    - Use storeToRefs(store) for state and getters
    - Use toRefs(store)
    - Destructuring always preserves reactivity
  correctIndex: 1
  explanation: "`storeToRefs(store)` returns reactive refs for state and getters; actions can be destructured directly because they're stable functions."
- id: q4
  question: Can you mutate Pinia state directly (e.g. store.count++)?
  options:
    - No, you must use an action
    - Only in setup stores
    - Yes — Pinia tracks direct mutations; actions are for async/batched logic
    - Only with $patch
  correctIndex: 2
  explanation: Unlike Vuex, Pinia allows direct state mutation; actions are recommended for async or batched mutations but not strictly required.
- id: q5
  question: What does storeToRefs() return for?
  options:
    - Actions only
    - The store instance
    - Plain values
    - State and getters as refs (without losing reactivity on destructure)
  correctIndex: 3
  explanation: "`storeToRefs(store)` returns an object whose state and getter properties are refs, so destructuring preserves reactivity; actions are excluded."
- id: q6
  question: Which is the setup-store syntax?
  options:
    - defineStore("x", () => { const c = ref(0); return { c }; })
    - defineStore("x", { state, getters, actions })
    - defineStore("x", function() {})
    - defineStore("x", [state, actions])
  correctIndex: 0
  explanation: Setup stores pass a composable-style function `() => { ... return {...} }`; options stores pass `{ state, getters, actions }`.
- id: q7
  question: What does $patch do?
  options:
    - Resets the store
    - Applies multiple state changes in one batch
    - Subscribes to changes
    - Disposes the store
  correctIndex: 1
  explanation: "`store.$patch({ ... })` or `store.$patch(state => { ... })` applies multiple changes in one batch, triggering a single re-render."
- id: q8
  question: What does $subscribe do?
  options:
    - Subscribes to a getter
    - Subscribes to actions
    - Registers a callback that fires on every state mutation
    - Resets the state
  correctIndex: 2
  explanation: "`store.$subscribe((mutation, state) => {...})` fires whenever the store's state changes; useful for persistence or logging."
- id: q9
  question: How do you persist a Pinia store across reloads?
  options:
    - Use a watcher
    - Use localStorage manually only
    - Pinia persists by default
    - "Use the pinia-plugin-persistedstate plugin and set `persist: true` on the store"
  correctIndex: 3
  explanation: "Install `pinia-plugin-persistedstate`, register it via `pinia.use(...)`, and add `persist: true` to the store definition; the plugin syncs to localStorage."
- id: q10
  question: What's the difference between setup and options stores?
  options:
    - Setup stores use composable syntax (no `this`); options stores use `state/getters/actions` with `this`
    - Setup stores are deprecated
    - Options stores are faster
    - There is no difference
  correctIndex: 0
  explanation: Setup stores use closure-based syntax (no `this`, like composables); options stores use the Vuex-like `state/getters/actions` shape with `this` referring to the store.
```

