---
slug: javascript-functional-programming-javascript
id: javascript-15
track: javascript
order: 15
title: Functional Programming in JavaScript
description: Apply functional programming — pure functions, immutability, currying, composition, and recursion — to write predictable, testable JavaScript.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=12100s
whyItMatters: Apply functional programming — pure functions, immutability, currying, composition, and recursion — to write predictable, testable JavaScript.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Functional Programming in JavaScript

## Functional Programming in JavaScript

### Why It Matters

Apply functional programming — pure functions, immutability, currying, composition, and recursion — to write predictable, testable JavaScript.

Apply functional programming — pure functions, immutability, currying, composition, and recursion — to write predictable, testable JavaScript.

### Prerequisites

- Stage 14: Testing — Jest, Vitest, and TDD Basics
- Comfort with higher-order functions (Stage 4) and array methods (Stage 3).

### Topics

- Pure functions and side effects
- Immutability and persistent data structures
- Currying and partial application
- Function composition (compose, pipe)
- Recursion and tail calls
- Map, filter, reduce — the trinity
- Functors and monads (Maybe, Either) — light intro
- Lenses and immutable updates

### Key Concepts

- A pure function: same input → same output, no side effects
- Immutability makes code predictable and enables time-travel debugging (Redux, XState)
- Currying transforms `f(a,b,c)` into `f(a)(b)(c)` — useful for partial application and reuse
- `compose(f, g, h)(x) === f(g(h(x)))`; `pipe` is the same but left-to-right
- Recursion expresses self-referential problems elegantly; JS lacks TCO so deep recursion can stack-overflow
- Maybe/Either types formalize error handling without try/catch — fp-ts, Option

```javascript
// Impure: reads/writes global state, returns different values per call
let counter = 0;
function impure() { return ++counter; }

// Pure: same input, same output, no side effects
function pure(n) { return n + 1; }

// Pure version of counter — return new state
function increment(state) { return { ...state, count: state.count + 1 }; }
```
Caption: Pure vs impure

### Common Pitfalls

- Pretending `const` makes data immutable — `const` only freezes the binding; use `Object.freeze` or libraries (Immer) for real immutability.
- Deep-cloning on every update — `structuredClone` is expensive; use structural sharing (Immer, immer-style updates) for performance.
- Over-currying simple functions — readable code beats clever code; curry when it aids reuse, not for its own sake.
- Recursion without bounds in JS — no TCO in engines; deep recursion stack-overflows; use trampolines or iteration for unbounded depth.
- Confusing map (functor) with flatMap (monad) — `Array.prototype.flatMap` is the monadic bind for arrays; Maybe/Task need their own.

### Real-World Applications

- Redux (used by Instagram, Discord, Alibaba) is built on pure reducers and immutability — the entire app state is a fold over actions.
- Immer (used by Redux Toolkit, MobX-State-Tree) lets you write "mutating" code that produces immutable updates via Proxies.
- React's `useState` and `useReducer` enforce functional update patterns — state is never mutated, always replaced.
- fp-ts is used in production at LeanCloud and others to model async flows as TaskEither, eliminating unhandled rejections by construction.

### Interview Questions

- 1. What is a pure function? — Same inputs always produce the same output with no side effects; easy to test, memoize, and parallelize.
- 2. Difference between currying and partial application? — Currying transforms a multi-arg function into nested single-arg functions; partial application fixes some args and returns a function expecting the rest.
- 3. What is `compose` vs `pipe`? — Both compose functions; compose runs right-to-left (`f(g(h(x)))`), pipe runs left-to-right (`h(g(f(x)))`).
- 4. Why is immutability useful? — Predictable state transitions, easier debugging (time-travel), safe memoization, no aliasing bugs.
- 5. What's a functor/monad in JS terms? — A functor is anything with `map` (Array, Maybe); a monad has `flatMap`/`chain` to handle nested contexts (Promise, Task, Maybe).

### Mini Project

Build a "Tiny Redux-like Store" with `createStore(reducer, initialState)`, `dispatch`, `subscribe`, and `getState`. Write a todo-list reducer and prove the reducer is pure by running it twice on the same input. Suggested approach:
  - Define `createStore` returning `{ getState, dispatch, subscribe }`
  - Write a `todosReducer(state, action)` that handles ADD, TOGGLE, REMOVE with immutable updates
  - Subscribe a `console.log` listener and dispatch 3 actions
  - Run the reducer twice with the same args and assert equal results (pure check)
  - Add a `combineReducers` helper for multiple slices

### Exercises

1. Write `curry(fn)` and prove it works on a 3-arg function called three different ways.
2. Implement `pipe` and `compose` and show they're equivalent under argument reversal.
3. Build a `Maybe` type with `map`, `chain`, and `getOrElse`; chain two operations safely.
4. Refactor an impure function that mutates a shared array into a pure one.
5. Use Immer (or hand-rolled produce) to write a "mutating" recipe that produces immutable state.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: A pure function:
9. A) Reads global state
10. B) Returns the same output for the same input with no side effects (*)
11. C) Always returns undefined
12. D) Mutates its arguments
13. Explanation: Purity = determinism + no side effects; the same input always yields the same output.
14. Q2: Currying transforms `f(a,b,c)` into:
15. A) f(a,b,c)
16. B) f(a)(b)(c) — a chain of single-arg functions (*)
17. C) f([a,b,c])
18. D) f({a,b,c})
19. Explanation: Curried functions take one argument at a time, returning a function until all args are supplied.
20. Q3: `compose(f, g, h)(x)` evaluates as:
21. A) h(g(f(x)))
22. B) f(g(h(x))) (*)
23. C) f(x) + g(x) + h(x)
24. D) x(f)(g)(h)
25. Explanation: compose runs right-to-left: h runs first, then g, then f.
26. Q4: `const` makes data immutable — true or false?
27. A) True
28. B) False — it only freezes the binding, not the value (*)
29. C) True for arrays only
30. D) True in strict mode
31. Explanation: const x = {a:1}; x.a = 2 works; use Object.freeze or Immer for real immutability.
32. Q5: `pipe(f, g, h)(x)` evaluates as:
33. A) f(g(h(x)))
34. B) h(g(f(x))) (*)
35. C) f(x); g(x); h(x)
36. D) pipe doesn't compose
37. Explanation: pipe is left-to-right: f first, then g, then h — the opposite of compose.
38. Q6: JS engines do NOT reliably support:
39. A) Arrow functions
40. B) Tail-call optimization (*)
41. C) let/const
42. D) Promises
43. Explanation: TCO is in the spec but not in V8/SpiderMonkey; deep recursion can overflow the stack.
44. Q7: A functor is anything with a:
45. A) map method (*)
46. B) reduce method
47. C) filter method
48. D) constructor
49. Explanation: Functors expose map to apply a function inside a context (Array, Maybe, Promise).
50. Q8: Redux reducers must be:
51. A) Async functions
52. B) Pure functions returning new state (*)
53. C) Methods on a class
54. D) Decorated with @Reducer
55. Explanation: Reducers take state + action and return NEW state — pure and side-effect free for predictability.
56. Q9: Immer lets you:
57. A) Mutate state directly while producing immutable updates (*)
58. B) Skip writing reducers
59. C) Replace Redux
60. D) Run code in a Web Worker
61. Explanation: Immer uses Proxies to track "mutations" in a recipe and emits a structurally-shared immutable result.
62. Q10: `flatMap` (monadic bind) for arrays:
63. A) Maps and flattens one level (*)
64. B) Is just map
65. C) Removes duplicates
66. D) Sorts the array
67. Explanation: flatMap = map then flat(1); it's the monadic bind that handles nested array contexts.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "A pure function:"
  options:
    - Reads global state
    - Returns the same output for the same input with no side effects
    - Always returns undefined
    - Mutates its arguments
  correctIndex: 1
  explanation: Purity = determinism + no side effects; the same input always yields the same output.
- id: q2
  question: "Currying transforms `f(a,b,c)` into:"
  options:
    - f(a,b,c)
    - f(a)(b)(c) — a chain of single-arg functions
    - f([a,b,c])
    - f({a,b,c})
  correctIndex: 1
  explanation: Curried functions take one argument at a time, returning a function until all args are supplied.
- id: q3
  question: "`compose(f, g, h)(x)` evaluates as:"
  options:
    - h(g(f(x)))
    - f(g(h(x)))
    - f(x) + g(x) + h(x)
    - x(f)(g)(h)
  correctIndex: 1
  explanation: "compose runs right-to-left: h runs first, then g, then f."
- id: q4
  question: "`const` makes data immutable — true or false?"
  options:
    - "True"
    - False — it only freezes the binding, not the value
    - True for arrays only
    - True in strict mode
  correctIndex: 1
  explanation: const x = {a:1}; x.a = 2 works; use Object.freeze or Immer for real immutability.
- id: q5
  question: "`pipe(f, g, h)(x)` evaluates as:"
  options:
    - f(g(h(x)))
    - h(g(f(x)))
    - f(x); g(x); h(x)
    - pipe doesn't compose
  correctIndex: 1
  explanation: "pipe is left-to-right: f first, then g, then h — the opposite of compose."
- id: q6
  question: "JS engines do NOT reliably support:"
  options:
    - Arrow functions
    - Tail-call optimization
    - let/const
    - Promises
  correctIndex: 1
  explanation: TCO is in the spec but not in V8/SpiderMonkey; deep recursion can overflow the stack.
- id: q7
  question: "A functor is anything with a:"
  options:
    - map method
    - reduce method
    - filter method
    - constructor
  correctIndex: 0
  explanation: Functors expose map to apply a function inside a context (Array, Maybe, Promise).
- id: q8
  question: "Redux reducers must be:"
  options:
    - Async functions
    - Pure functions returning new state
    - Methods on a class
    - Decorated with @Reducer
  correctIndex: 1
  explanation: Reducers take state + action and return NEW state — pure and side-effect free for predictability.
- id: q9
  question: "Immer lets you:"
  options:
    - Mutate state directly while producing immutable updates
    - Skip writing reducers
    - Replace Redux
    - Run code in a Web Worker
  correctIndex: 0
  explanation: Immer uses Proxies to track "mutations" in a recipe and emits a structurally-shared immutable result.
- id: q10
  question: "`flatMap` (monadic bind) for arrays:"
  options:
    - Maps and flattens one level
    - Is just map
    - Removes duplicates
    - Sorts the array
  correctIndex: 0
  explanation: flatMap = map then flat(1); it's the monadic bind that handles nested array contexts.
```

