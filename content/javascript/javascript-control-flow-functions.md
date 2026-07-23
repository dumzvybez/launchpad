---
slug: javascript-control-flow-functions
id: javascript-04
track: javascript
order: 4
title: Control Flow and Functions
description: Master branching, loops, function declarations, arrow functions, default parameters, rest/spread, closures, and the `this` keyword.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=2100s
whyItMatters: Master branching, loops, function declarations, arrow functions, default parameters, rest/spread, closures, and the `this` keyword.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Control Flow and Functions

## Control Flow and Functions

### Why It Matters

Master branching, loops, function declarations, arrow functions, default parameters, rest/spread, closures, and the `this` keyword.

Master branching, loops, function declarations, arrow functions, default parameters, rest/spread, closures, and the `this` keyword.

### Prerequisites

- Stage 3: Strings, Arrays, and Array Methods
- Understanding of scope from Stage 2.

### Topics

- if/else, switch, ternary, and short-circuit evaluation
- for, for...of, for...in, while, do...while, break, continue
- Function declarations vs function expressions vs arrow functions
- Default parameters, rest parameters, spread in calls
- Closures and lexical scope
- IIFE (Immediately Invoked Function Expression)
- The `this` keyword and call/apply/bind
- Higher-order functions and callbacks

### Key Concepts

- Arrow functions don't bind their own `this` or `arguments` — they inherit from the enclosing scope
- Closures let a function "remember" the scope where it was defined, even after that scope exits
- `for...of` iterates values (arrays, strings); `for...in` iterates enumerable keys (objects)
- Hoisting moves declarations to the top of scope; function declarations hoist with body, function expressions only the variable name
- `this` is determined by how a function is called, not where it's defined (except for arrows)
- Default parameters are evaluated at call time, allowing `x = []` patterns safely

```javascript
function makeCounter(start = 0) {
  let count = start;
  return {
    next: () => ++count,
    reset: () => { count = 0; },
    get: () => count,
  };
}
const c = makeCounter(10);
console.log(c.next(), c.next(), c.get()); // 11 12 12
```
Caption: Closure counter

### Common Pitfalls

- Using arrow functions as object methods — `this` won't bind to the object; use a regular function or method shorthand instead.
- Looping arrays with `for...in` — iterates string keys and includes prototype props; use `for...of` or `.forEach`.
- Creating functions inside loops with `var` — the closure captures the same variable; use `let` or an IIFE to capture per-iteration values.
- Forgetting `break` in `switch` — execution falls through to the next case; only omit `break` if fall-through is intentional.
- Losing `this` when passing a method as a callback — `setTimeout(obj.method, 100)` detaches `this`; use `.bind(obj)` or an arrow wrapper.

### Real-World Applications

- React's hooks API is built entirely on closures — every component render creates a fresh closure capturing that render's state, enabling time-travel debugging at Meta scale.
- The Express.js middleware pipeline uses higher-order functions to compose request handlers; this pattern powers millions of Node.js servers including PayPal and Uber.
- Lodash's `_.debounce` and `_.throttle` are textbook closures used across Airbnb, Slack, and Microsoft Teams to rate-limit scroll and resize handlers.
- jQuery's event binding relies on closures over per-element data; the same model still ships in WordPress's admin (which uses jQuery).

### Interview Questions

- 1. What is a closure? — A function that retains access to its lexical scope even when called outside that scope; useful for state encapsulation and currying.
- 2. Difference between arrow and regular functions? — Arrows have no own `this`, `arguments`, `super`, or `new.target`; they can't be constructors; they inherit `this` lexically.
- 3. How is `this` determined? — By call site: method invocation (object), simple call (undefined in strict, global in sloppy), `call/apply/bind` (explicit), arrow (lexical).
- 4. What's the difference between `for...of` and `for...in`? — `for...of` iterates iterable values; `for...in` iterates enumerable keys (including inherited), and is meant for objects.
- 5. What is an IIFE and why use one? — Immediately Invoked Function Expression; creates a private scope; was the module pattern before ES modules.

### Mini Project

Build a "Memoize" utility `memoize(fn)` that caches results based on argument equality, plus a `debounce(fn, ms)` higher-order function. It takes any pure function and returns a cached version. Suggested approach:
  - Use a Map keyed by JSON.stringify of args for the cache
  - Handle the no-args case with a sentinel key
  - For debounce, use setTimeout and clearTimeout to coalesce rapid calls
  - Add a `.clear()` method to reset the cache
  - Test with a slow `fib(n)` recursive function and show the speedup on repeat calls

### Exercises

1. Write `once(fn)` that ensures a function runs at most once; subsequent calls return the cached result.
2. Implement `curry(fn)` that converts `f(a,b,c)` into `f(a)(b)(c)`.
3. Build a `range(start, end, step)` generator function using `function*`.
4. Demonstrate the `this`-detachment bug: extract a method and call it directly; fix with `bind`.
5. Write `pipe(...fns)` that composes functions left-to-right: `pipe(f, g, h)(x) === h(g(f(x)))`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does an arrow function NOT have of its own?
9. A) Parameters
10. B) A return value
11. C) `this` binding (*)
12. D) A name
13. Explanation: Arrow functions inherit `this`, `arguments`, `super`, and `new.target` from their enclosing scope.
14. Q2: A closure is:
15. A) A function that closes the program
16. B) A function that retains access to its lexical scope (*)
17. C) A way to delete variables
18. D) A type of for-loop
19. Explanation: Closures "remember" the scope where they were defined, even after that scope exits.
20. Q3: Which loop iterates over array VALUES?
21. A) for...in
22. B) for...of (*)
23. C) for...key
24. D) while...of
25. Explanation: for...of works on iterables (arrays, strings, Maps, Sets); for...in iterates enumerable keys.
26. Q4: `setTimeout(obj.method, 100)` — what's wrong?
27. A) setTimeout can't take methods
28. B) `this` is lost inside method (*)
29. C) It runs synchronously
30. D) Nothing — it works perfectly
31. Explanation: Detaching the method from obj means `this` is undefined (strict) or window; use bind or an arrow.
32. Q5: `let f = function(){}` vs `function f(){}` — which hoists the body?
33. A) Both
34. B) Only the function declaration (*)
35. C) Only the function expression
36. D) Neither
37. Explanation: Function declarations hoist with their body; expressions only hoist the variable name (TDZ until assignment).
38. Q6: Default parameters are evaluated:
39. A) At parse time
40. B) Once at module load
41. C) Each time the function is called without that argument (*)
42. D) Never
43. Explanation: Defaults are evaluated at call time, so `x = []` gives a fresh array each call (no shared-mutable bug).
44. Q7: What does `(...nums)` in a parameter list do?
45. A) Spreads an array into the call
46. B) Gathers arguments into an array (*)
47. C) Declares a global
48. D) Freezes the argument
49. Explanation: Rest parameters collect remaining arguments into a real array (unlike the legacy `arguments` object).
50. Q8: `switch` falls through to the next case when:
51. A) Always
52. B) The case values match
53. C) `break` is omitted (*)
54. D) `default` is missing
55. Explanation: Without `break`, execution continues into the next case's body — sometimes intentional, often a bug.
56. Q9: Which correctly creates a private counter?
57. A) `function makeCounter(){ let c=0; return ()=>++c; }` (*)
58. B) `let counter = { c: 0, next: () => ++counter.c }`
59. C) `const c = 0; function next(){ return ++c; }`
60. D) `global.c = 0; function next(){ return ++global.c; }`
61. Explanation: The closure over `let c` keeps it private; only the returned function can read or modify it.
62. Q10: `pipe(f, g)(5)` is equivalent to:
63. A) f(g(5))
64. B) g(f(5)) (*)
65. C) f(5) + g(5)
66. D) 5
67. Explanation: pipe composes left-to-right, so f runs first then g: pipe(f,g)(x) === g(f(x)).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does an arrow function NOT have of its own?
  options:
    - Parameters
    - A return value
    - "`this` binding"
    - A name
  correctIndex: 2
  explanation: Arrow functions inherit `this`, `arguments`, `super`, and `new.target` from their enclosing scope.
- id: q2
  question: "A closure is:"
  options:
    - A function that closes the program
    - A function that retains access to its lexical scope
    - A way to delete variables
    - A type of for-loop
  correctIndex: 1
  explanation: Closures "remember" the scope where they were defined, even after that scope exits.
- id: q3
  question: Which loop iterates over array VALUES?
  options:
    - for...in
    - for...of
    - for...key
    - while...of
  correctIndex: 1
  explanation: for...of works on iterables (arrays, strings, Maps, Sets); for...in iterates enumerable keys.
- id: q4
  question: "`setTimeout(obj.method, 100)` — what's wrong?"
  options:
    - setTimeout can't take methods
    - "`this` is lost inside method"
    - It runs synchronously
    - Nothing — it works perfectly
  correctIndex: 1
  explanation: Detaching the method from obj means `this` is undefined (strict) or window; use bind or an arrow.
- id: q5
  question: "`let f = function(){}` vs `function f(){}` — which hoists the body?"
  options:
    - Both
    - Only the function declaration
    - Only the function expression
    - Neither
  correctIndex: 1
  explanation: Function declarations hoist with their body; expressions only hoist the variable name (TDZ until assignment).
- id: q6
  question: "Default parameters are evaluated:"
  options:
    - At parse time
    - Once at module load
    - Each time the function is called without that argument
    - Never
  correctIndex: 2
  explanation: Defaults are evaluated at call time, so `x = []` gives a fresh array each call (no shared-mutable bug).
- id: q7
  question: What does `(...nums)` in a parameter list do?
  options:
    - Spreads an array into the call
    - Gathers arguments into an array
    - Declares a global
    - Freezes the argument
  correctIndex: 1
  explanation: Rest parameters collect remaining arguments into a real array (unlike the legacy `arguments` object).
- id: q8
  question: "`switch` falls through to the next case when:"
  options:
    - Always
    - The case values match
    - "`break` is omitted"
    - "`default` is missing"
  correctIndex: 2
  explanation: Without `break`, execution continues into the next case's body — sometimes intentional, often a bug.
- id: q9
  question: Which correctly creates a private counter?
  options:
    - "`function makeCounter(){ let c=0; return ()=>++c; }`"
    - "`let counter = { c: 0, next: () => ++counter.c }`"
    - "`const c = 0; function next(){ return ++c; }`"
    - "`global.c = 0; function next(){ return ++global.c; }`"
  correctIndex: 0
  explanation: The closure over `let c` keeps it private; only the returned function can read or modify it.
- id: q10
  question: "`pipe(f, g)(5)` is equivalent to:"
  options:
    - f(g(5))
    - g(f(5))
    - f(5) + g(5)
    - "5"
  correctIndex: 1
  explanation: "pipe composes left-to-right, so f runs first then g: pipe(f,g)(x) === g(f(x))."
```

