---
slug: typescript-generics
id: typescript-06
track: typescript
order: 6
title: Generics
description: Write reusable, type-safe functions and classes with generics, learn type-parameter constraints, and understand inference vs explicit specification.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=1800s
whyItMatters: Write reusable, type-safe functions and classes with generics, learn type-parameter constraints, and understand inference vs explicit specification.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Generics

## Generics

### Why It Matters

Write reusable, type-safe functions and classes with generics, learn type-parameter constraints, and understand inference vs explicit specification.

Write reusable, type-safe functions and classes with generics, learn type-parameter constraints, and understand inference vs explicit specification.

### Prerequisites

- Stage 3: Interfaces and Type Aliases.
- Stage 4: Functions and Type Inference.
- Stage 5: Classes and Access Modifiers.

### Topics

- Generic functions (`function id<T>(x: T): T`)
- Generic interfaces and classes (`Promise<T>`, `Array<T>`)
- Type inference at call sites
- Explicit type arguments (`id<string>("hi")`)
- Constraints via `extends` (`<T extends { id: number }>`)
- Default type parameters (`<T = string>`)
- Generic utility types preview (`Partial<T>`, `Readonly<T>`)
- Multi-parameter generics and inference failures

### Key Concepts

- Generics are type variables resolved at the call site, not at runtime (erasure still applies).
- Inference works when the type parameter appears in a parameter; it fails when it appears only in the return type.
- Constraints (`<T extends X>`) require T to be assignable to X; this enables property access inside the function.
- Default type parameters provide a fallback when inference fails or the caller omits the argument.
- Conditional types and mapped types (Stages 7-8) build on generics.

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2, 3]);       // number | undefined
const s = first(["a", "b"]);      // string | undefined
```
Caption: Generic function

### Common Pitfalls

- Writing a generic that doesn't appear in any parameter — `function f<T>(): T` forces the caller to specify T explicitly and is effectively an unsafe cast.
- Over-constraining generics — `<T extends string | number>` may be so narrow that the generic adds no value over the constraint itself.
- Using a single type parameter when two are needed — `function pair<T>(a: T, b: T): T[]` forces both to be the same type; use `<T, U>` for heterogeneous pairs.
- Forgetting that `keyof T` in constraints is itself a union of literal types — `K extends keyof T` lets `pick` accept only valid keys.
- Asserting `as T` to "make" a generic work — this is a lie to the compiler; prefer `unknown` and narrow, or restructure the types.

### Real-World Applications

- React's `useState<T>` and `useReducer<T>` are generic hooks whose type argument is usually inferred from the initial value.
- The `Promise<T>` constructor is generic; `new Promise<string>((resolve) => resolve("hi"))` propagates `string` through `.then`.
- The Prisma ORM exposes `prisma.user.findUnique<T>()` where T is inferred from the generated schema — every query is type-safe end-to-end.
- The tRPC library uses generics + inference to give you a fully typed client/server RPC without code generation.

### Interview Questions

- 1. What is a generic in TypeScript? — A type variable declared on a function/class/interface and resolved at the call site, enabling reuse with type safety.
- 2. When does generic inference fail? — When the type parameter appears only in the return type (not in any parameter), the caller must specify it explicitly.
- 3. What does `<T extends { id: number }>` mean? — T must be assignable to `{ id: number }`, allowing the function to access `obj.id` safely.
- 4. Can you have multiple type parameters? — Yes; `<T, U extends keyof T>` is common in utilities like `pick`.
- 5. Are generics available at runtime? — No; they are erased during compilation like all other type annotations.

### Mini Project

Build a typed Result<T, E> Algebraic Data Type: A discriminated union `Result<T, E>` with `ok<T>(value: T)` and `err<E>(error: E)` constructors, plus `map`, `flatMap`, and `unwrap` methods. Suggested approach:
  - Define `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`
  - Write `function ok<T>(value: T): Result<T, never>` and `function err<E>(error: E): Result<never, E>`
  - Add `function map<T, U, E>(r: Result<T, E>, f: (v: T) => U): Result<U, E>`
  - Add `function flatMap` and `function unwrap` (throws on err)
  - Use it to model a `parseInt`-like parse that returns `Result<number, string>`

### Exercises

1. Write `function identity<T>(x: T): T` and call it with and without an explicit type argument.
2. Write a generic `Box<T>` class with `getValue()` and `setValue()`; verify that `Box<string>` rejects numbers.
3. Add a constraint `<T extends { length: number }>` to a `function logLength<T>(x: T)` and call it with both a string and an array.
4. Implement `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`.
5. Define `type Result<T, E>` and use it in a `parseNumber(s: string): Result<number, string>` function.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When does generic type inference fail (caller must specify T)?
9. A) When T appears in a parameter
10. B) When T appears only in the return type, not in any parameter (*)
11. C) When T is constrained
12. D) When the function is async
13. Explanation: TS infers type arguments from parameters; if T appears only in the return type, there's nothing to infer from, and the caller must specify it.
14. Q2: What does `<T extends { id: number }>` mean?
15. A) T must be a subclass of `{ id: number }`
16. B) T is exactly `{ id: number }`
17. C) T must be assignable to `{ id: number }` — structural constraint (*)
18. D) T must be a number
19. Explanation: `extends` in a type-parameter position is a constraint: T must be structurally assignable to the constraint type.
20. Q3: Are generics preserved at runtime?
21. A) Yes, as `Symbol` properties
22. B) Yes, as `Type` objects
23. C) Only when using decorators
24. D) No — they are erased during compilation (*)
25. Explanation: Like all TS types, generics are erased; the emitted JS has no trace of type parameters.
26. Q4: Which signature allows heterogeneous pairs?
27. A) `function pair<T, U>(a: T, b: U): [T, U]` (*)
28. B) `function pair<T>(a: T, b: T): [T, T]`
29. C) `function pair(a: any, b: any): [any, any]`
30. D) `function pair<T>(a: T, b: T): T[]`
31. Explanation: A single type parameter forces both elements to the same type; using two type parameters lets each have its own type.
32. Q5: What does `keyof T` produce in a constraint `K extends keyof T`?
33. A) The values of T
34. B) The union of T's property names (as literal types) (*)
35. C) The first key of T
36. D) An array of keys
37. Explanation: `keyof T` is a union of string/number literal types, one per property of T; this lets `K` be constrained to valid keys.
38. Q6: What is the result of `first([1, 2, 3])` for `function first<T>(arr: T[]): T | undefined`?
39. A) `any | undefined`
40. B) `unknown | undefined`
41. C) `number | undefined` (*)
42. D) `number` only
43. Explanation: TS infers T as `number` from the array argument, so the return is `number | undefined` (the `undefined` accounts for the empty-array case).
44. Q7: Which is a valid default type parameter?
45. A) `<T default string>`
46. B) `<T: string>`
47. C) `<T ?>`
48. D) `<T = string>` (*)
49. Explanation: `<T = string>` provides a fallback when inference fails or the caller omits the argument.
50. Q8: Why is `function f<T>(): T { return null as any as T; }` unsafe?
51. A) The caller controls T, but the function returns null — a lie (*)
52. B) It throws at runtime
53. C) It is unsafe only with strict mode
54. D) It is actually safe
55. Explanation: The function claims to return T but actually returns null; the caller's `f<number>() + 1` will crash at runtime even though TS allowed it.
56. Q9: Which built-in type is generic?
57. A) `Math`
58. B) `Array<T>` (also written `T[]`) (*)
59. C) `console`
60. D) `JSON`
61. Explanation: `Array<T>` is generic over its element type; `Promise<T>`, `Map<K, V>`, and `Set<T>` are other built-in generics.
62. Q10: Which utility type is built on generics and `keyof`?
63. A) `typeof`
64. B) `instanceof`
65. C) `Pick<T, K>` (*)
66. D) `void`
67. Explanation: `Pick<T, K extends keyof T>` constructs a type with only the selected keys — implemented via a mapped type using generics.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When does generic type inference fail (caller must specify T)?
  options:
    - "?"
    - When T appears in a parameter
    - When T appears only in the return type, not in any parameter
    - When T is constrained
    - When the function is async
  correctIndex: 2
  explanation: TS infers type arguments from parameters; if T appears only in the return type, there's nothing to infer from, and the caller must specify it.
- id: q2
  question: "What does `<T extends { id: number }>` mean?"
  options:
    - "T must be a subclass of `{ id: number }`"
    - "T is exactly `{ id: number }`"
    - "T must be assignable to `{ id: number }` — structural constraint"
    - T must be a number
  correctIndex: 2
  explanation: "`extends` in a type-parameter position is a constraint: T must be structurally assignable to the constraint type."
- id: q3
  question: Are generics preserved at runtime?
  options:
    - Yes, as `Symbol` properties
    - Yes, as `Type` objects
    - Only when using decorators
    - No — they are erased during compilation
  correctIndex: 3
  explanation: Like all TS types, generics are erased; the emitted JS has no trace of type parameters.
- id: q4
  question: Which signature allows heterogeneous pairs?
  options:
    - "`function pair<T, U>(a: T, b: U): [T, U]`"
    - "`function pair<T>(a: T, b: T): [T, T]`"
    - "`function pair(a: any, b: any): [any, any]`"
    - "`function pair<T>(a: T, b: T): T[]`"
  correctIndex: 0
  explanation: A single type parameter forces both elements to the same type; using two type parameters lets each have its own type.
- id: q5
  question: What does `keyof T` produce in a constraint `K extends keyof T`?
  options:
    - The values of T
    - The union of T's property names (as literal types)
    - The first key of T
    - An array of keys
  correctIndex: 1
  explanation: "`keyof T` is a union of string/number literal types, one per property of T; this lets `K` be constrained to valid keys."
- id: q6
  question: "What is the result of `first([1, 2, 3])` for `function first<T>(arr: T[]): T | undefined`?"
  options:
    - "`any | undefined`"
    - "`unknown | undefined`"
    - "`number | undefined`"
    - "`number` only"
  correctIndex: 2
  explanation: TS infers T as `number` from the array argument, so the return is `number | undefined` (the `undefined` accounts for the empty-array case).
- id: q7
  question: Which is a valid default type parameter?
  options:
    - "`<T default string>`"
    - "`<T: string>`"
    - "`<T ?>`"
    - "`<T = string>`"
  correctIndex: 3
  explanation: "`<T = string>` provides a fallback when inference fails or the caller omits the argument."
- id: q8
  question: "Why is `function f<T>(): T { return null as any as T; }` unsafe?"
  options:
    - The caller controls T, but the function returns null — a lie
    - It throws at runtime
    - It is unsafe only with strict mode
    - It is actually safe
  correctIndex: 0
  explanation: The function claims to return T but actually returns null; the caller's `f<number>() + 1` will crash at runtime even though TS allowed it.
- id: q9
  question: Which built-in type is generic?
  options:
    - "`Math`"
    - "`Array<T>` (also written `T[]`)"
    - "`console`"
    - "`JSON`"
  correctIndex: 1
  explanation: "`Array<T>` is generic over its element type; `Promise<T>`, `Map<K, V>`, and `Set<T>` are other built-in generics."
- id: q10
  question: Which utility type is built on generics and `keyof`?
  options:
    - "`typeof`"
    - "`instanceof`"
    - "`Pick<T, K>`"
    - "`void`"
  correctIndex: 2
  explanation: "`Pick<T, K extends keyof T>` constructs a type with only the selected keys — implemented via a mapped type using generics."
```

