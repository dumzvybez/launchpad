---
slug: typescript-advanced-generics-higher-order-types
id: typescript-18
track: typescript
order: 18
title: Advanced Generics and Higher-Order Types
description: Master recursive types, higher-order generic functions, variance, and the patterns used by libraries like tRPC, Zod, and Effect.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=11600s
whyItMatters: Master recursive types, higher-order generic functions, variance, and the patterns used by libraries like tRPC, Zod, and Effect.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Advanced Generics and Higher-Order Types

## Advanced Generics and Higher-Order Types

### Why It Matters

Master recursive types, higher-order generic functions, variance, and the patterns used by libraries like tRPC, Zod, and Effect.

Master recursive types, higher-order generic functions, variance, and the patterns used by libraries like tRPC, Zod, and Effect.

### Prerequisites

- Stage 6: Generics.
- Stage 7: Unions, Intersections, and Conditional Types.
- Stage 8: Mapped Types and Utility Types.

### Topics

- Recursive types (linked lists, JSON trees)
- Higher-order generics (`<T, F extends (x: T) => unknown>`)
- Variance: covariance, contravariance, bivariance
- `infer` in multiple positions (return, parameter, array element)
- `unknown`-driven API design
- Branding and nominal typing via `unique symbol`/brands
- The `satisfies` operator (recap and advanced use)
- Type-level programming (Fibonacci, tuples)

### Key Concepts

- Recursive types reference themselves: `type Json = string | number | boolean | null | Json[] | { [k: string]: Json }`.
- TS function parameters are bivariant by default; `strictFunctionTypes` makes them contravariant (safer).
- Variance matters for assignability: `Array<Dog>` is assignable to `Array<Animal>` (covariant), but `(x: Animal) => void` is NOT assignable to `(x: Dog) => void` (contravariant).
- Branding (`type UserId = string & { __brand: "UserId" }`) creates nominal types over primitives.
- Type-level programming uses conditional + recursive types to compute (e.g., `Range<0, 5>` = `0 | 1 | 2 | 3 | 4 | 5`).

```typescript
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
const data: Json = { users: [{ id: 1, name: "ada" }], count: 1 };
```
Caption: Recursive JSON type

### Common Pitfalls

- Forgetting that `strictFunctionTypes` makes function parameters contravariant — code that compiled under bivariance may suddenly error; the fix is usually to widen the parameter.
- Using branding without `declare const __brand: unique symbol` — the symbol must be unique per brand or collisions occur; `declare` avoids emitting a runtime value.
- Writing infinite recursive types — TS has a recursion depth limit (~50); deep type-level computations trip "Type instantiation is excessively deep" errors.
- Confusing covariance (output positions) with contravariance (input positions) — arrays are covariant, function parameters are contravariant.
- Reaching for type-level programming when runtime code would do — types are erased; some computations belong in `const` values, not in the type system.

### Real-World Applications

- tRPC's entire type system is a higher-order generic: the client infers the full router shape from a server-side TypeScript router definition, with no codegen.
- Zod's `z.infer<typeof schema>` is a recursive conditional/mapped type that walks the schema tree and produces a TS type.
- The Effect library uses variance annotations (`+A`, `-E`, `+R`) to model effect types in a type-safe, functional way.
- The `fp-ts` library brands types like `Option<T>` and `Either<E, A>` and uses higher-kinded type emulation via `HKT` interfaces.

### Interview Questions

- 1. What is variance in TypeScript? — How subtyping of composite types relates to subtyping of their components: covariance (same direction), contravariance (opposite), bivariance (both).
- 2. Why does `strictFunctionTypes` matter? — It makes function parameters contravariant (safer), catching bugs where a callback accepting `Animal` is assigned to a slot expecting `(Dog) => void`.
- 3. How do you create a nominal type over a primitive? — Brand it: `type UserId = string & { readonly __brand: "UserId" }` (often via a `unique symbol` to avoid collisions).
- 4. What is a higher-order generic? — A generic that takes another generic as an argument, e.g., `<T, F extends (x: T) => unknown>` modeling a function that accepts a transformer.
- 5. What's the recursion depth limit in TS? — Approximately 50 instantiations; deeper type-level computations error with "Type instantiation is excessively deep".

### Mini Project

Build a Branded ID Library: A small library that brands `string` and `number` IDs (`UserId`, `OrderId`, `SkuCode`), plus a `create<T>(value: string): T` factory and a typed repository. Suggested approach:
  - Define `declare const __brand: unique symbol; type Brand<T, B> = T & { readonly [__brand]: B }`
  - Create `UserId`, `OrderId`, `SkuCode` brands
  - Write `function brand<T extends string & { readonly [__brand]: string }>(v: string): T { return v as T; }`
  - Implement a `UserRepo` that accepts only `UserId` and rejects raw strings
  - Add a `toJson` that strips the brand (returning `string`) for serialization

### Exercises

1. Define a recursive `type Json` and parse a small JSON object through it.
2. Brand `string` as `Email` and `UserId`; verify that `getUser(email)` is a type error.
3. Write a higher-order `function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C`.
4. Trigger a variance error under `strictFunctionTypes` and fix it by widening the parameter type.
5. Implement a type-level `Range<0, 3>` that produces `0 | 1 | 2 | 3` using recursion + conditional types.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Under `strictFunctionTypes`, function parameters are...
9. A) Covariant
10. B) Contravariant (*)
11. C) Bivariant
12. D) Invariant
13. Explanation: `strictFunctionTypes` makes function parameters contravariant: `(x: Animal) => void` is NOT assignable to `(x: Dog) => void` (it might be called with a Cat).
14. Q2: How do you create a nominal type over `string`?
15. A) `type UserId = string`
16. B) `enum UserId { ... }`
17. C) Brand it: `type UserId = string & { readonly __brand: "UserId" }` (*)
18. D) `class UserId extends string {}`
19. Explanation: Branding intersects with a phantom property that exists only at the type level, preventing cross-assignment between branded primitives.
20. Q3: Arrays in TS are...
21. A) Contravariant
22. B) Invariant
23. C) Bivariant
24. D) Covariant (*)
25. Explanation: `Array<Dog>` is assignable to `Array<Animal>` — arrays are covariant (this is a deliberate unsoundness for practicality, matching Java).
26. Q4: What is a higher-order generic?
27. A) A generic that takes another type constructor or function type as an argument (*)
28. B) A generic that returns a class
29. C) A generic with three or more type parameters
30. D) A generic that uses `infer`
31. Explanation: Higher-order generics abstract over type constructors or function types, e.g., `<T, F extends (x: T) => unknown>`.
32. Q5: What error does deep type-level recursion cause?
33. A) Stack overflow at runtime
34. B) "Type instantiation is excessively deep and possibly infinite" (*)
35. C) Out-of-memory error
36. D) No error — TS handles any depth
37. Explanation: TS limits type-level recursion (~50 instantiations); deeper computations trip this error and must be flattened or computed at runtime.
38. Q6: Which symbol declaration avoids emitting a runtime value?
39. A) `const __brand: unique symbol`
40. B) `let __brand: symbol`
41. C) `declare const __brand: unique symbol` (*)
42. D) `var __brand: symbol`
43. Explanation: `declare` tells TS the symbol exists at the type level only; no runtime value is emitted, which is what you want for branding.
44. Q7: Which recursive type models JSON?
45. A) `type Json = any`
46. B) `type Json = object`
47. C) `type Json = unknown`
48. D) `type Json = string | number | boolean | null | Json[] | { [k: string]: Json }` (*)
49. Explanation: A union of primitives, null, arrays of `Json`, and string-keyed objects of `Json` — recursive and self-referential — accurately models JSON.
50. Q8: What does `strictFunctionTypes` NOT affect?
51. A) Method signatures (declared with method shorthand) — these remain bivariant (*)
52. B) Standalone function types
53. C) Arrow functions
54. D) Function type aliases
55. Explanation: For backwards compatibility with OO hierarchies, `strictFunctionTypes` only applies to function-type aliases, not method shorthand declarations (which stay bivariant).
56. Q9: Which is a real library that uses variance annotations?
57. A) Lodash
58. B) `fp-ts` (and Effect) (*)
59. C) Express
60. D) Moment.js
61. Explanation: `fp-ts` and Effect model effect types (`Effect<R, E, A>`) with explicit variance (`+A`, `-E`, `+R`) for sound composition.
62. Q10: Why brand an ID rather than use a raw `string`?
63. A) Performance
64. B) To make serialization easier
65. C) To prevent passing a `UserId` where an `OrderId` is expected — compile-time type safety (*)
66. D) To save memory
67. Explanation: Branding gives you nominal typing over a primitive; cross-assignment between differently-branded strings becomes a compile error.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Under `strictFunctionTypes`, function parameters are...
  options:
    - Covariant
    - Contravariant
    - Bivariant
    - Invariant
  correctIndex: 1
  explanation: "`strictFunctionTypes` makes function parameters contravariant: `(x: Animal) => void` is NOT assignable to `(x: Dog) => void` (it might be called with a Cat)."
- id: q2
  question: How do you create a nominal type over `string`?
  options:
    - "`type UserId = string`"
    - "`enum UserId { ... }`"
    - 'Brand it: `type UserId = string & { readonly __brand: "UserId" }`'
    - "`class UserId extends string {}`"
  correctIndex: 2
  explanation: Branding intersects with a phantom property that exists only at the type level, preventing cross-assignment between branded primitives.
- id: q3
  question: Arrays in TS are...
  options:
    - Contravariant
    - Invariant
    - Bivariant
    - Covariant
  correctIndex: 3
  explanation: "`Array<Dog>` is assignable to `Array<Animal>` — arrays are covariant (this is a deliberate unsoundness for practicality, matching Java)."
- id: q4
  question: What is a higher-order generic?
  options:
    - A generic that takes another type constructor or function type as an argument
    - A generic that returns a class
    - A generic with three or more type parameters
    - A generic that uses `infer`
    - => unknown>`.
  correctIndex: 0
  explanation: "Higher-order generics abstract over type constructors or function types, e.g., `<T, F extends (x: T) => unknown>`."
- id: q5
  question: What error does deep type-level recursion cause?
  options:
    - Stack overflow at runtime
    - '"Type instantiation is excessively deep and possibly infinite"'
    - Out-of-memory error
    - No error — TS handles any depth
  correctIndex: 1
  explanation: TS limits type-level recursion (~50 instantiations); deeper computations trip this error and must be flattened or computed at runtime.
- id: q6
  question: Which symbol declaration avoids emitting a runtime value?
  options:
    - "`const __brand: unique symbol`"
    - "`let __brand: symbol`"
    - "`declare const __brand: unique symbol`"
    - "`var __brand: symbol`"
  correctIndex: 2
  explanation: "`declare` tells TS the symbol exists at the type level only; no runtime value is emitted, which is what you want for branding."
- id: q7
  question: Which recursive type models JSON?
  options:
    - "`type Json = any`"
    - "`type Json = object`"
    - "`type Json = unknown`"
    - "`type Json = string | number | boolean | null | Json[] | { [k: string]: Json }`"
  correctIndex: 3
  explanation: A union of primitives, null, arrays of `Json`, and string-keyed objects of `Json` — recursive and self-referential — accurately models JSON.
- id: q8
  question: What does `strictFunctionTypes` NOT affect?
  options:
    - Method signatures (declared with method shorthand) — these remain bivariant
    - Standalone function types
    - Arrow functions
    - Function type aliases
  correctIndex: 0
  explanation: For backwards compatibility with OO hierarchies, `strictFunctionTypes` only applies to function-type aliases, not method shorthand declarations (which stay bivariant).
- id: q9
  question: Which is a real library that uses variance annotations?
  options:
    - Lodash
    - "`fp-ts` (and Effect)"
    - Express
    - Moment.js
  correctIndex: 1
  explanation: "`fp-ts` and Effect model effect types (`Effect<R, E, A>`) with explicit variance (`+A`, `-E`, `+R`) for sound composition."
- id: q10
  question: Why brand an ID rather than use a raw `string`?
  options:
    - Performance
    - To make serialization easier
    - To prevent passing a `UserId` where an `OrderId` is expected — compile-time type safety
    - To save memory
  correctIndex: 2
  explanation: Branding gives you nominal typing over a primitive; cross-assignment between differently-branded strings becomes a compile error.
```

