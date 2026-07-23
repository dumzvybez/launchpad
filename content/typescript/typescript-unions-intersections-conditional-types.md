---
slug: typescript-unions-intersections-conditional-types
id: typescript-07
track: typescript
order: 7
title: Unions, Intersections, and Conditional Types
description: Combine types with unions and intersections, narrow them safely, and write conditional types that branch on type relationships.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=2700s
whyItMatters: Combine types with unions and intersections, narrow them safely, and write conditional types that branch on type relationships.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Unions, Intersections, and Conditional Types

## Unions, Intersections, and Conditional Types

### Why It Matters

Combine types with unions and intersections, narrow them safely, and write conditional types that branch on type relationships.

Combine types with unions and intersections, narrow them safely, and write conditional types that branch on type relationships.

### Prerequisites

- Stage 3: Interfaces and Type Aliases.
- Stage 6: Generics.

### Topics

- Union types (`A | B`)
- Intersection types (`A & B`)
- Discriminated unions with literal discriminants
- Type narrowing via `typeof`, `in`, `instanceof`, and discriminants
- Exhaustiveness checking with `never`
- Conditional types (`T extends U ? X : Y`)
- `infer` keyword to extract types
- Distributive conditional types

### Key Concepts

- Unions widen the set of acceptable values; intersections narrow them (must satisfy both).
- Discriminated unions with a shared literal field are the idiomatic ADT pattern in TS.
- Conditional types let you write type-level functions: `type IsString<T> = T extends string ? true : false;`
- `infer` extracts a type from a generic position: `type ElementType<T> = T extends (infer E)[] ? E : never;`
- Conditional types distribute over naked type parameters: `MyType<string | number>` = `MyType<string> | MyType<number>`.

```typescript
type ID = string | number;
function label(id: ID): string {
  if (typeof id === "string") return `str:${id}`;
  return `num:${id.toFixed(0)}`;
}
```
Caption: Union and narrowing

### Common Pitfalls

- Forgetting that intersections of conflicting types produce `never` for the conflicting fields — `{ a: string } & { a: number }` is `{ a: never }`, which no value can satisfy.
- Mixing discriminants — a discriminated union requires the same field name with mutually exclusive literal values; using two different fields breaks narrowing.
- Expecting conditional types to be eager — they are lazy and distribute over unions, sometimes producing surprising results when the input is a union.
- Skipping the `default: never` branch in a discriminated-union switch — you lose exhaustiveness checking and silently forget to handle new variants.
- Using `in` to narrow on optional fields — `in` returns true only for own properties; consider an explicit discriminant field instead.

### Real-World Applications

- Redux Toolkit's `createAsyncThunk` returns a discriminated union (`pending` | `fulfilled` | `rejected`) that reducers exhaustively switch on.
- The XState library models every state machine as a discriminated union of state objects; transitions are exhaustive-switch-checked.
- tRPC's error type is `TRPCClientError<T>` whose `data` field is a discriminated union of error codes — `switch (err.data.code)` is exhaustive.
- The TypeScript compiler's own AST (`ts.Node`) is a giant discriminated union over `kind: SyntaxKind`.

### Interview Questions

- 1. What is a discriminated union? — A union of object types sharing a literal-typed field (the discriminant) that TS can use to narrow safely.
- 2. What is the difference between `&` and `|`? — Intersection (`&`) requires satisfying both types (narrower); union (`|`) accepts either (wider).
- 3. What does `T extends U ? X : Y` do at the type level? — It's a conditional type: if T is assignable to U, evaluate to X, otherwise Y.
- 4. What is the `infer` keyword for? — Extracting a type variable from a generic position, e.g., the return type of a function.
- 5. How do you enforce exhaustiveness in a switch? — Add a `default` branch that assigns the value to a `never`-typed variable; TS errors if any case is unhandled.

### Mini Project

Build a typed Result-and-Option Library: Implement `Result<T, E>` and `Option<T>` as discriminated unions with `map`, `flatMap`, `match`, and exhaustive switch-based dispatch. Suggested approach:
  - Define `type Option<T> = { kind: "some"; value: T } | { kind: "none" }`
  - Define `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`
  - Write `matchOption<T, R>(o: Option<T>, onSome: (v: T) => R, onNone: () => R): R` using a switch
  - Write `mapResult<T, U, E>(r: Result<T, E>, f: (v: T) => U): Result<U, E>`
  - Add an exhaustive `default: never` branch to catch missing cases at compile time

### Exercises

1. Define a discriminated union `type Payment = ...` with `cash`, `card`, and `crypto` variants; switch exhaustively over them.
2. Write `type IsArray<T> = T extends any[] ? true : false` and test it on `number[]` and `string`.
3. Use `infer` to write `type UnwrapPromise<T> = T extends Promise<infer U> ? U : T`.
4. Create an intersection `{ a: string } & { b: number }` and an object that satisfies it.
5. Trigger an exhaustiveness error by adding a fourth variant to a discriminated union without updating the switch.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `A & B` (intersection) require of a value?
9. A) It must satisfy either A or B
10. B) It must satisfy neither
11. C) It must satisfy both A and B (*)
12. D) It becomes `never` always
13. Explanation: Intersection combines requirements: the value must have all members of both A and B.
14. Q2: What is the discriminant in `{ kind: "circle"; radius: number }`?
15. A) `radius`
16. B) The whole object
17. C) There is none
18. D) `kind` (the literal-typed field) (*)
19. Explanation: `kind` is a string-literal field with mutually exclusive values; TS uses it to narrow the union.
20. Q3: What does `T extends U ? X : Y` produce when T is `string | number` and distributes?
21. A) `X` applied to each member, then unioned (*)
22. B) `X`
23. C) `Y`
24. D) An error
25. Explanation: Conditional types distribute over naked union parameters: `T extends U ? X : Y` with `T = A | B` becomes `(A extends U ? X : Y) | (B extends U ? X : Y)`.
26. Q4: What is `{ a: string } & { a: number }`?
27. A) `{ a: string | number }`
28. B) `{ a: string & number }` = `{ a: never }` — unsatisfiable (*)
29. C) `never` (the whole type)
30. D) An error
31. Explanation: The intersection of `string` and `number` is `never`, so the `a` property becomes `never` and no value can satisfy it.
32. Q5: Which keyword extracts a type from a function's return?
33. A) `keyof`
34. B) `typeof`
35. C) `infer` (*)
36. D) `extract`
37. Explanation: `infer R` inside a conditional type captures the return type: `T extends (...args: any[]) => infer R ? R : never`.
38. Q6: How do you force exhaustiveness in a switch on a discriminated union?
39. A) Use `if` instead of `switch`
40. B) Add `@ts-ignore` to the default
41. C) Throw in every case
42. D) Add a `default` that assigns the value to a `never`-typed variable (*)
43. Explanation: A `default` branch that assigns to `never` triggers a compile error if any union member is not handled above.
44. Q7: Which operator narrows with `typeof`?
45. A) `typeof x === "number"` (returns true at runtime; TS narrows in the branch) (*)
46. B) `x typeof number`
47. C) `x is number`
48. D) `x instanceof number`
49. Explanation: `typeof x === "number"` is a runtime check that TS uses as a type guard, narrowing `x` to `number` inside the if-branch.
50. Q8: What does `type R = ReturnOf<() => number>` evaluate to for `type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never`?
51. A) `() => number`
52. B) `number` (*)
53. C) `never`
54. D) `any`
55. Explanation: `infer R` captures the return type, which is `number`; the conditional resolves to `R`, i.e., `number`.
56. Q9: What's the idiomatic name for the literal-typed shared field in a discriminated union?
57. A) The brand
58. B) The phantom
59. C) The discriminant (or tag) (*)
60. D) The nominal
61. Explanation: The shared literal field is called the discriminant or tag; TS uses it for narrowing.
62. Q10: Which narrows a union via a property-presence check?
63. A) `if (s.radius)`
64. B) `if (s.kind = "circle")`
65. C) `if (typeof s === "circle")`
66. D) `if ("radius" in s)` (*)
67. Explanation: The `in` operator narrows based on whether a property exists on the object — useful when there's no discriminant field.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `A & B` (intersection) require of a value?
  options:
    - It must satisfy either A or B
    - It must satisfy neither
    - It must satisfy both A and B
    - It becomes `never` always
  correctIndex: 2
  explanation: "Intersection combines requirements: the value must have all members of both A and B."
- id: q2
  question: 'What is the discriminant in `{ kind: "circle"; radius: number }`?'
  options:
    - "`radius`"
    - The whole object
    - There is none
    - "`kind` (the literal-typed field)"
  correctIndex: 3
  explanation: "`kind` is a string-literal field with mutually exclusive values; TS uses it to narrow the union."
- id: q3
  question: "What does `T extends U ? X : Y` produce when T is `string | number` and distributes?"
  options:
    - "`X` applied to each member, then unioned"
    - "`X`"
    - "`Y`"
    - An error
    - "| (B extends U ? X : Y)`."
  correctIndex: 0
  explanation: "Conditional types distribute over naked union parameters: `T extends U ? X : Y` with `T = A | B` becomes `(A extends U ? X : Y) | (B extends U ? X : Y)`."
- id: q4
  question: "What is `{ a: string } & { a: number }`?"
  options:
    - "`{ a: string | number }`"
    - "`{ a: string & number }` = `{ a: never }` — unsatisfiable"
    - "`never` (the whole type)"
    - An error
  correctIndex: 1
  explanation: The intersection of `string` and `number` is `never`, so the `a` property becomes `never` and no value can satisfy it.
- id: q5
  question: Which keyword extracts a type from a function's return?
  options:
    - "`keyof`"
    - "`typeof`"
    - "`infer`"
    - "`extract`"
  correctIndex: 2
  explanation: "`infer R` inside a conditional type captures the return type: `T extends (...args: any[]) => infer R ? R : never`."
- id: q6
  question: How do you force exhaustiveness in a switch on a discriminated union?
  options:
    - Use `if` instead of `switch`
    - Add `@ts-ignore` to the default
    - Throw in every case
    - Add a `default` that assigns the value to a `never`-typed variable
  correctIndex: 3
  explanation: A `default` branch that assigns to `never` triggers a compile error if any union member is not handled above.
- id: q7
  question: Which operator narrows with `typeof`?
  options:
    - '`typeof x === "number"` (returns true at runtime; TS narrows in the branch)'
    - "`x typeof number`"
    - "`x is number`"
    - "`x instanceof number`"
  correctIndex: 0
  explanation: '`typeof x === "number"` is a runtime check that TS uses as a type guard, narrowing `x` to `number` inside the if-branch.'
- id: q8
  question: "What does `type R = ReturnOf<() => number>` evaluate to for `type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never`?"
  options:
    - "`() => number`"
    - "`number`"
    - "`never`"
    - "`any`"
  correctIndex: 1
  explanation: "`infer R` captures the return type, which is `number`; the conditional resolves to `R`, i.e., `number`."
- id: q9
  question: What's the idiomatic name for the literal-typed shared field in a discriminated union?
  options:
    - The brand
    - The phantom
    - The discriminant (or tag)
    - The nominal
  correctIndex: 2
  explanation: The shared literal field is called the discriminant or tag; TS uses it for narrowing.
- id: q10
  question: Which narrows a union via a property-presence check?
  options:
    - "`if (s.radius)`"
    - '`if (s.kind = "circle")`'
    - '`if (typeof s === "circle")`'
    - '`if ("radius" in s)`'
  correctIndex: 3
  explanation: The `in` operator narrows based on whether a property exists on the object — useful when there's no discriminant field.
```

