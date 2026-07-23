---
slug: typescript-functions-type-inference
id: typescript-04
track: typescript
order: 4
title: Functions and Type Inference
description: Annotate function parameters and returns, model overloads, use rest and optional parameters, and understand contextual inference.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ
whyItMatters: Annotate function parameters and returns, model overloads, use rest and optional parameters, and understand contextual inference.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Functions and Type Inference

## Functions and Type Inference

### Why It Matters

Annotate function parameters and returns, model overloads, use rest and optional parameters, and understand contextual inference.

Annotate function parameters and returns, model overloads, use rest and optional parameters, and understand contextual inference.

### Prerequisites

- Stage 1: Getting Started with TypeScript.
- Stage 2: Basic Types and Annotations.
- Stage 3: Interfaces and Type Aliases.

### Topics

- Parameter and return-type annotations
- Optional (`?`) and default parameters
- Rest parameters and variadic functions
- Function type signatures (`type Fn = (a: number) => string`)
- Overloads and the implementation signature
- `this` parameter typing
- Contextual typing (callbacks infer from context)
- Void vs undefined return types

### Key Concepts

- Return-type inference works for most functions; annotate public-API returns for documentation and to catch drift.
- Overloads require multiple signatures followed by one implementation; the implementation is not visible to callers.
- Contextual typing lets callbacks omit annotations when the expected type is known (e.g., in `.map`, `.then`).
- `void` return type means the return value is ignored; `undefined` means it must explicitly return undefined.
- Rest parameters are arrays; tuple-types-in-rest-positions enable strongly-typed variadic functions.

```typescript
function add(a: number, b: number): number {
  return a + b;
}
const multiply = (a: number, b: number): number => a * b;
const greet = (name: string, greeting = "Hello"): string =>
  `${greeting}, ${name}!`;
```
Caption: Function annotations

### Common Pitfalls

- Forgetting the implementation signature of an overload must be compatible with every overload — callers see only the overloads, but `tsc` still type-checks the implementation against the union.
- Declaring overloads whose return types overlap ambiguously — TS picks the first matching overload, so order matters.
- Using `void` as a return annotation when you mean `undefined` — `void` allows the function to return anything (caller ignores it), while `undefined` requires an explicit `return undefined` or `return;`.
- Annotating callback parameters that are already contextually typed — redundant and noisy; trust inference inside `.map`, `.then`, event handlers.
- Modeling variadic functions with `any[]` when a tuple-in-rest-position (`...args: [string, number, boolean]`) would preserve element types.

### Real-World Applications

- Lodash's type definitions (in `@types/lodash`) use heavy overloads to express the many shapes of `_.get`, `_.map`, and `_.merge` precisely.
- The React `useState` function is heavily overloaded to model lazy initializers, undefined states, and discriminated updates — all without the caller seeing the implementation signature.
- Express.js route handlers use contextual typing via `@types/express`; `(req, res) => ...` infers `Request`/`Response` from the registered middleware types.
- RxJS pipeable operators (`map`, `filter`, `switchMap`) use contextual typing to infer the observable's element type through the pipeline.

### Interview Questions

- 1. What is the difference between `void` and `undefined` as return types? — `void` allows any return (caller ignores it); `undefined` requires the function to return undefined explicitly.
- 2. How do function overloads work in TS? — Multiple signatures followed by one implementation; callers see only the overloads, and TS picks the first match.
- 3. What is contextual typing? — When the expected type is known (e.g., a callback parameter), TS infers parameter types without explicit annotations.
- 4. Should you always annotate return types? — No; annotate public APIs and let inference handle private helpers to reduce noise and refactor friction.
- 5. What's the signature of a rest parameter? — `...args: T[]` (or a tuple type for typed variadic); rest parameters are always arrays.

### Mini Project

Build a typed Event Emitter: A class `Emitter<EventMap>` with `on<K>(key: K, cb: (payload: EventMap[K]) => void)` and `emit<K>(key: K, payload: EventMap[K])`. Suggested approach:
  - Define a generic `interface EventMap { login: { userId: string }; logout: void; ... }`
  - Use mapped types to constrain `on`/`emit` to keys of `EventMap`
  - Store handlers in a `Map<keyof EventMap, Array<(p: any) => void>>`
  - Add overload for `void` payloads so callers can omit the argument
  - Test by registering a login handler and emitting an event

### Exercises

1. Write a function `parseDate(s: string): Date` that throws on invalid input; annotate the return type explicitly.
2. Implement an overloaded `range(stop)` / `range(start, stop, step?)` function.
3. Convert a JavaScript function with default arguments to TypeScript, preserving the defaults in the type.
4. Write a `Comparator<T>` type alias and use it to sort an array of objects by a chosen key.
5. Use contextual typing to call `[1, 2, 3].map((n) => n * 2)` without annotating `n`; verify its inferred type by hovering.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is a valid overloaded function declaration?
9. A) Multiple implementations, one signature
10. B) A single signature with a union return
11. C) `function overload(...args: any[]): any`
12. D) Multiple signatures followed by one implementation (*)
13. Explanation: TS overloads consist of N call signatures followed by 1 implementation that must accept the union of all overload inputs.
14. Q2: What is contextual typing?
15. A) When TS infers parameter types from the expected type at the call site (*)
16. B) When types are inferred from variable names
17. C) When types are read from JSON files
18. D) When types are generated by the OS
19. Explanation: Contextual typing lets TS flow type information into expressions like callbacks where the expected type is known.
20. Q3: What does `void` as a return type mean?
21. A) The function must return undefined
22. B) The return value is ignored — any return is allowed but discarded (*)
23. C) The function must not contain a return statement
24. D) The function is async
25. Explanation: `void` tells callers the return value should be ignored; the implementation may return anything and TS will accept it at the call site.
26. Q4: Which is the correct way to declare a rest parameter typed as numbers?
27. A) `function f(...nums: number)`
28. B) `function f(nums: ...number)`
29. C) `function f(...nums: number[])` (*)
30. D) `function f(nums: number...)`
31. Explanation: Rest parameters use the `...` prefix on the parameter name and are always array types.
32. Q5: Which statement about overload order is TRUE?
33. A) Order does not matter
34. B) TS picks the most specific overload automatically
35. C) Only the last overload is used
36. D) TS picks the first matching overload, so order matters (*)
37. Explanation: Overloads are checked top-to-bottom and the first match wins; put more-specific overloads above more-general ones.
38. Q6: What does `type Fn = (a: number) => string` declare?
39. A) A type alias for a function signature (*)
40. B) A function named Fn
41. C) A class Fn
42. D) A variable Fn
43. Explanation: This declares a type alias `Fn` for a function that takes a number and returns a string.
44. Q7: Which annotation makes a parameter optional?
45. A) `param? = undefined`
46. B) `param?` (*)
47. C) `param: optional`
48. D) `[param]`
49. Explanation: The `?` suffix on a parameter name marks it optional; under the hood its type becomes `T | undefined`.
50. Q8: What does contextual typing infer for `[1,2,3].map((n) => n * 2)`?
51. A) `n` is `any`
52. B) `n` is `unknown`
53. C) `n` is `number` (*)
54. D) An error is reported
55. Explanation: `Array<number>.map` provides context that the callback receives a number, so `n` is inferred as `number` without annotation.
56. Q9: Which return type forbids the function from returning a non-undefined value?
57. A) `void`
58. B) `never`
59. C) `null`
60. D) `undefined` (*)
61. Explanation: `undefined` requires the function to return undefined (or nothing); `void` would allow any return that callers ignore.
62. Q10: What is the type of `greet` after `const greet = (name: string, greeting = "Hello") => ...`?
63. A) `(name: string, greeting?: string) => ...` with `greeting` defaulting to `"Hello"` (*)
64. B) `(name: string, greeting: "Hello") => ...`
65. C) `(name?: string, greeting?: string) => ...`
66. D) `(name: string, greeting: string) => ...` with no default
67. Explanation: Default parameters are typed as optional (the parameter type is `string | undefined` from the caller's view) but the runtime default is applied when omitted.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is a valid overloaded function declaration?
  options:
    - Multiple implementations, one signature
    - A single signature with a union return
    - "`function overload(...args: any[]): any`"
    - Multiple signatures followed by one implementation
  correctIndex: 3
  explanation: TS overloads consist of N call signatures followed by 1 implementation that must accept the union of all overload inputs.
- id: q2
  question: What is contextual typing?
  options:
    - When TS infers parameter types from the expected type at the call site
    - When types are inferred from variable names
    - When types are read from JSON files
    - When types are generated by the OS
  correctIndex: 0
  explanation: Contextual typing lets TS flow type information into expressions like callbacks where the expected type is known.
- id: q3
  question: What does `void` as a return type mean?
  options:
    - The function must return undefined
    - The return value is ignored — any return is allowed but discarded
    - The function must not contain a return statement
    - The function is async
  correctIndex: 1
  explanation: "`void` tells callers the return value should be ignored; the implementation may return anything and TS will accept it at the call site."
- id: q4
  question: Which is the correct way to declare a rest parameter typed as numbers?
  options:
    - "`function f(...nums: number)`"
    - "`function f(nums: ...number)`"
    - "`function f(...nums: number[])`"
    - "`function f(nums: number...)`"
  correctIndex: 2
  explanation: Rest parameters use the `...` prefix on the parameter name and are always array types.
- id: q5
  question: Which statement about overload order is TRUE?
  options:
    - Order does not matter
    - TS picks the most specific overload automatically
    - Only the last overload is used
    - TS picks the first matching overload, so order matters
  correctIndex: 3
  explanation: Overloads are checked top-to-bottom and the first match wins; put more-specific overloads above more-general ones.
- id: q6
  question: "What does `type Fn = (a: number) => string` declare?"
  options:
    - A type alias for a function signature
    - A function named Fn
    - A class Fn
    - A variable Fn
  correctIndex: 0
  explanation: This declares a type alias `Fn` for a function that takes a number and returns a string.
- id: q7
  question: Which annotation makes a parameter optional?
  options:
    - "`param? = undefined`"
    - "`param?`"
    - "`param: optional`"
    - "`[param]`"
  correctIndex: 1
  explanation: The `?` suffix on a parameter name marks it optional; under the hood its type becomes `T | undefined`.
- id: q8
  question: What does contextual typing infer for `[1,2,3].map((n) => n * 2)`?
  options:
    - "`n` is `any`"
    - "`n` is `unknown`"
    - "`n` is `number`"
    - An error is reported
  correctIndex: 2
  explanation: "`Array<number>.map` provides context that the callback receives a number, so `n` is inferred as `number` without annotation."
- id: q9
  question: Which return type forbids the function from returning a non-undefined value?
  options:
    - "`void`"
    - "`never`"
    - "`null`"
    - "`undefined`"
  correctIndex: 3
  explanation: "`undefined` requires the function to return undefined (or nothing); `void` would allow any return that callers ignore."
- id: q10
  question: 'What is the type of `greet` after `const greet = (name: string, greeting = "Hello") => ...`?'
  options:
    - '`(name: string, greeting?: string) => ...` with `greeting` defaulting to `"Hello"`'
    - '`(name: string, greeting: "Hello") => ...`'
    - "`(name?: string, greeting?: string) => ...`"
    - "`(name: string, greeting: string) => ...` with no default"
  correctIndex: 0
  explanation: Default parameters are typed as optional (the parameter type is `string | undefined` from the caller's view) but the runtime default is applied when omitted.
```

