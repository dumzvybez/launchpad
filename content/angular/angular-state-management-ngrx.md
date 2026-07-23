---
slug: angular-state-management-ngrx
id: angular-11
track: angular
order: 11
title: State Management with NgRx
description: Manage application state with NgRx — Actions, Reducers, Selectors, Effects, and Entity — and learn when to use NgRx vs signals for local vs global state.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ
whyItMatters: Manage application state with NgRx — Actions, Reducers, Selectors, Effects, and Entity — and learn when to use NgRx vs signals for local vs global state.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# State Management with NgRx

## State Management with NgRx

### Why It Matters

Manage application state with NgRx — Actions, Reducers, Selectors, Effects, and Entity — and learn when to use NgRx vs signals for local vs global state.

Manage application state with NgRx — Actions, Reducers, Selectors, Effects, and Entity — and learn when to use NgRx vs signals for local vs global state.

### Prerequisites

- Stage 9: RxJS Fundamentals (you understand Observables, operators, and Subjects).
- Stage 10: Forms (you've built reactive forms with `valueChanges`).
- Stage 6: Services and DI (you can write injectable services).

### Topics

- When to use NgRx (and when signals alone suffice)
- Store, Actions, Reducers, Selectors, Effects
- `provideStore`, `provideStoreDevtools`, `provideEffects`, `provideStoreFeature`
- Standalone feature registration with `provideState` and `provideEffects`
- `createFeature` and feature selectors
- `@ngrx/entity` for normalized collection state
- `@ngrx/data` (when to avoid — opinionated, less common)
- NgRx ComponentStore as a middle ground for component-level state
- Devtools, time-travel debugging, and action creators

### Key Concepts

- NgRx is a Redux pattern: state is a single immutable tree, changed only by pure reducers in response to actions
- Effects handle side effects (HTTP, etc.) — they listen for actions, run impure code, and dispatch new actions
- Selectors are memoized — recomputing only when inputs change; combine with `createSelector` for derived state
- NgRx is overkill for small apps; signals + service are simpler. Use NgRx when state is shared across many unrelated components.
- `createFeature` reduces boilerplate by generating selectors and a reducer map in one shot

```typescript
// src/app/tasks/tasks feature
import { createActionGroup, createFeature, createReducer, on, props, emptyProps } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface Task { id: string; title: string; done: boolean; }

export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': emptyProps(),
    'Tasks Loaded': props<{ tasks: Task[] }>(),
    'Add Task': props<{ title: string }>(),
    'Toggle Task': props<{ id: string }>(),
  },
});

const adapter = createEntityAdapter<Task>();
const initialState = adapter.getInitialState({ loading: false });

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(initialState,
    on(TaskActions.loadTasks, (s) => ({ ...s, loading: true })),
    on(TaskActions.tasksLoaded, (s, { tasks }) => adapter.setAll(tasks, { ...s, loading: false })),
    on(TaskActions.addTask, (s, { title }) => adapter.addOne({ id: crypto.randomUUID(), title, done: false }, s)),
    on(TaskActions.toggleTask, (s, { id }) => adapter.updateOne({ id, changes: { done: !s.entities[id]?.done } }, s)),
  ),
});
```
Caption: Feature with createFeature and Entity

### Common Pitfalls

- Adding NgRx to a small app that needs only local state — it's heavy boilerplate; use a service + signals first, add NgRx only when state is shared across many components.
- Putting side effects (HTTP, etc.) inside reducers — reducers must be pure; use Effects for any impure work.
- Selecting array slices that re-create references on every emit — use memoized selectors (`createSelector`) to avoid recomputing derived state.
- Using `store.select` (Observable) in templates without `async` pipe — leaks subscriptions; use `selectSignal` for signal-based reads.
- Forgetting `provideStore()` (root) and only `provideState(feature)` — the store won't initialize; always start with `provideStore()` then `provideState` per feature.

### Real-World Applications

- Google Ads uses NgRx for the cross-campaign selection state shared between the campaign table, the editor panel, and the breadcrumbs.
- Microsoft Teams uses NgRx to manage the active chat, presence, and notifications state shared across panels and lazy-loaded modules.
- PayPal uses NgRx for the checkout state machine (cart → billing → review → confirmation) shared between summary, form, and review panels.
- Upwork uses NgRx ComponentStore for component-level state that's too complex for signals but doesn't warrant the global store.

### Interview Questions

- 1. When should you use NgRx vs signals? — Use signals for local/component state; NgRx when state is shared across many unrelated components, needs time-travel debugging, or has complex async workflows.
- 2. What does an Effect do? — Listens for actions, performs side effects (HTTP, etc.), and dispatches new actions — keeping reducers pure.
- 3. Why are selectors memoized? — To avoid recomputing derived state when the underlying slice hasn't changed, improving performance on frequent emits.
- 4. What's `createFeature` for? — Generates a feature reducer, feature selector, and per-property selectors in one call, reducing NgRx boilerplate.
- 5. What's `@ngrx/entity`? — A normalized collection adapter with `setAll`, `addOne`, `updateOne`, `removeOne`, plus generated `selectAll`/`selectEntities` selectors.

### Mini Project

Build a "Cart" store with NgRx: A feature with `CartActions` (add, remove, updateQty, clear), an entity adapter for cart items, an Effect that persists to localStorage on every change, and a component that displays the cart and dispatches actions. Suggested approach:
  - Define `CartItem` interface with `id`, `name`, `price`, `qty`
  - Use `createEntityAdapter` for normalized storage
  - Build a `cart$` Effect subscribing to `cartActions` and writing to localStorage
  - Register the feature via `provideState` and `provideEffects`
  - Build a `CartComponent` using `store.selectSignal(cartFeature.selectAll)`

### Exercises

1. Define a counter feature with `increment`/`decrement` actions and dispatch from a component.
2. Add an Effect that logs every action to the console (no dispatch).
3. Convert the counter Observable selector to `selectSignal` and read in the template.
4. Use `@ngrx/entity` to manage a list of books with `addOne`, `updateOne`, `removeOne`.
5. Install `@ngrx/store-devtools` and inspect the action timeline in Redux DevTools.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which NgRx construct must be a PURE function?
9. A) Effect
10. B) Action creator
11. C) Reducer (*)
12. D) Selector dispatcher
13. Explanation: Reducers must be pure functions of (state, action) → new state; side effects (HTTP, logging) belong in Effects.
14. Q2: Which construct handles side effects like HTTP calls?
15. A) Reducer
16. B) Selector
17. C) Action creator
18. D) Effect (*)
19. Explanation: Effects listen for actions, run impure code (HTTP, etc.), and dispatch new actions; reducers stay pure.
20. Q3: Which function registers the root NgRx store?
21. A) provideStore() (*)
22. B) provideNgRx()
23. C) provideRedux()
24. D) StoreModule.forRoot()
25. Explanation: `provideStore()` is the functional provider for the root store; per-feature reducers go via `provideState(name, reducer)`.
26. Q4: Why are selectors memoized?
27. A) To cache HTTP responses
28. B) To avoid recomputing derived state when the underlying slice hasn't changed (*)
29. C) To enable time travel
30. D) To persist state
31. Explanation: Memoized selectors return the cached result when inputs are reference-equal to the previous call, skipping recomputation.
32. Q5: Which API returns a SIGNAL from the store (vs an Observable)?
33. A) store.select
34. B) store.signal
35. C) store.selectSignal (*)
36. D) store.toSignal
37. Explanation: `store.selectSignal(selector)` returns a signal that updates on state changes; integrates NgRx with Angular's signal-based reactivity.
38. Q6: What does `createFeature` generate?
39. A) A standalone component
40. B) An HTTP interceptor
41. C) A directive
42. D) A feature reducer, feature selector, and per-property selectors in one call (*)
43. Explanation: `createFeature({ name, reducer })` bundles the reducer map, a feature selector, and per-state-property selectors, reducing NgRx boilerplate.
44. Q7: Which package provides `createEntityAdapter` for normalized collections?
45. A) @ngrx/entity (*)
46. B) @ngrx/store
47. C) @ngrx/effects
48. D) @ngrx/data
49. Explanation: `@ngrx/entity` provides `createEntityAdapter` with `setAll`, `addOne`, `updateOne`, `removeOne`, plus `selectAll`/`selectEntities` selectors.
50. Q8: When is NgRx considered overkill?
51. A) When state is shared across many components
52. B) When the app is small with mostly local component state (*)
53. C) When the app needs time-travel debugging
54. D) When async workflows are complex
55. Explanation: For small apps with mostly local state, a service + signals is simpler; NgRx's boilerplate pays off only when state is shared broadly.
56. Q9: Which devtools package enables time-travel debugging?
57. A) @ngrx/entity
58. B) @ngrx/effects
59. C) @ngrx/store-devtools (*)
60. D) @ngrx/component-store
61. Explanation: `@ngrx/store-devtools` integrates with the Redux DevTools browser extension for action timeline and state snapshots.
62. Q10: Which NgRx library is a lighter-weight, component-scoped alternative to the global store?
63. A) @ngrx/data
64. B) @ngrx/entity
65. C) @ngrx/router-store
66. D) @ngrx/component-store (*)
67. Explanation: `@ngrx/component-store` provides a small, component-lifecycle-scoped store ideal for medium-complexity local state — between signals and the global store.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which NgRx construct must be a PURE function?
  options:
    - Effect
    - Action creator
    - Reducer
    - Selector dispatcher
  correctIndex: 2
  explanation: Reducers must be pure functions of (state, action) → new state; side effects (HTTP, logging) belong in Effects.
- id: q2
  question: Which construct handles side effects like HTTP calls?
  options:
    - Reducer
    - Selector
    - Action creator
    - Effect
  correctIndex: 3
  explanation: Effects listen for actions, run impure code (HTTP, etc.), and dispatch new actions; reducers stay pure.
- id: q3
  question: Which function registers the root NgRx store?
  options:
    - provideStore()
    - provideNgRx()
    - provideRedux()
    - StoreModule.forRoot()
  correctIndex: 0
  explanation: "`provideStore()` is the functional provider for the root store; per-feature reducers go via `provideState(name, reducer)`."
- id: q4
  question: Why are selectors memoized?
  options:
    - To cache HTTP responses
    - To avoid recomputing derived state when the underlying slice hasn't changed
    - To enable time travel
    - To persist state
  correctIndex: 1
  explanation: Memoized selectors return the cached result when inputs are reference-equal to the previous call, skipping recomputation.
- id: q5
  question: Which API returns a SIGNAL from the store (vs an Observable)?
  options:
    - store.select
    - store.signal
    - store.selectSignal
    - store.toSignal
  correctIndex: 2
  explanation: "`store.selectSignal(selector)` returns a signal that updates on state changes; integrates NgRx with Angular's signal-based reactivity."
- id: q6
  question: What does `createFeature` generate?
  options:
    - A standalone component
    - An HTTP interceptor
    - A directive
    - A feature reducer, feature selector, and per-property selectors in one call
  correctIndex: 3
  explanation: "`createFeature({ name, reducer })` bundles the reducer map, a feature selector, and per-state-property selectors, reducing NgRx boilerplate."
- id: q7
  question: Which package provides `createEntityAdapter` for normalized collections?
  options:
    - "@ngrx/entity"
    - "@ngrx/store"
    - "@ngrx/effects"
    - "@ngrx/data"
  correctIndex: 0
  explanation: "`@ngrx/entity` provides `createEntityAdapter` with `setAll`, `addOne`, `updateOne`, `removeOne`, plus `selectAll`/`selectEntities` selectors."
- id: q8
  question: When is NgRx considered overkill?
  options:
    - When state is shared across many components
    - When the app is small with mostly local component state
    - When the app needs time-travel debugging
    - When async workflows are complex
  correctIndex: 1
  explanation: For small apps with mostly local state, a service + signals is simpler; NgRx's boilerplate pays off only when state is shared broadly.
- id: q9
  question: Which devtools package enables time-travel debugging?
  options:
    - "@ngrx/entity"
    - "@ngrx/effects"
    - "@ngrx/store-devtools"
    - "@ngrx/component-store"
  correctIndex: 2
  explanation: "`@ngrx/store-devtools` integrates with the Redux DevTools browser extension for action timeline and state snapshots."
- id: q10
  question: Which NgRx library is a lighter-weight, component-scoped alternative to the global store?
  options:
    - "@ngrx/data"
    - "@ngrx/entity"
    - "@ngrx/router-store"
    - "@ngrx/component-store"
  correctIndex: 3
  explanation: "`@ngrx/component-store` provides a small, component-lifecycle-scoped store ideal for medium-complexity local state — between signals and the global store."
```

