---
slug: typescript-basic-types-annotations
id: typescript-02
track: typescript
order: 2
title: Basic Types and Annotations
description: Learn TypeScript's primitive types, type annotations, type inference, and the difference between `let` and `const` widening.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=WcRgpER7i_g
whyItMatters: Learn TypeScript's primitive types, type annotations, type inference, and the difference between `let` and `const` widening.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Basic Types and Annotations

## Basic Types and Annotations

### Why It Matters

Learn TypeScript's primitive types, type annotations, type inference, and the difference between `let` and `const` widening.

Learn TypeScript's primitive types, type annotations, type inference, and the difference between `let` and `const` widening.

### Prerequisites

- Stage 1: Getting Started with TypeScript.
- Basic JavaScript syntax (variables, functions).

### Topics

- Primitives: string, number, boolean, null, undefined, symbol, bigint
- Type annotations on variables, parameters, and return types
- Type inference (when to annotate, when to let TS infer)
- `let` vs `const` and type widening
- Array types: `number[]` vs `Array<number>`
- Tuple types and their pitfalls
- The `any` type and why to avoid it
- `unknown` as the safe alternative to `any`

### Key Concepts

- Type annotations are explicit; inference is implicit and preferred when unambiguous.
- `const x = "hi"` infers the literal type `"hi"`, not `string` — this is "non-widening".
- `let x = "hi"` widens to `string` because reassignment is allowed.
- `any` opts out of the type system; `unknown` requires narrowing before use.
- Tuples have fixed length and per-element types; arrays do not.

```typescript
let username: string = "ada";
let age: number = 36;
let isActive: boolean = true;
let big: bigint = 9007199254740993n;
let nothing: null = null;
let undef: undefined = undefined;
```
Caption: Primitive annotations

### Common Pitfalls

- Annotating every variable — let TS infer where the initializer is unambiguous; annotate only function signatures, public APIs, and ambiguous cases.
- Reaching for `any` to silence an error — use `unknown` and narrow, or fix the underlying type mismatch; `any` disables all checking downstream.
- Treating tuples like arrays — `pair.push("extra")` is allowed by TS for historical reasons even though it breaks the tuple's declared length; use `readonly` tuples to prevent mutation.
- Confusing `null` and `undefined` — under `strictNullChecks`, they are distinct types; an `undefined` is not assignable to `null` and vice versa.
- Forgetting that `Number`, `String`, `Boolean` (capitalized) refer to the wrapper object types, not the primitives — always use the lowercase versions.

### Real-World Applications

- The Bloomberg Terminal's web UI relies on strict primitive typing to prevent the string-vs-number confusions that historically caused financial miscalculations.
- Stripe's JavaScript SDK uses `unknown` for untyped webhook payloads, forcing consumers to narrow before use — preventing a class of injection bugs.
- Vercel's dashboard annotates every public function's parameters explicitly to make API contracts grep-able in code review.
- Linear's GraphQL codegen emits precise `string | number | null` unions for every nullable field, surfacing nullability at compile time.

### Interview Questions

- 1. What is the difference between `any` and `unknown`? — Both accept any value, but `unknown` forces narrowing before use whereas `any` disables checking entirely.
- 2. What is type widening? — When TS broadens a literal type (e.g., `"hi"`) to its base type (`string`) for mutable bindings declared with `let`.
- 3. When should you annotate vs infer? — Annotate function signatures and public APIs; let inference handle locals where the initializer is unambiguous.
- 4. What does `const x = "hi"` infer as? — The literal type `"hi"` (not `string`), because `const` bindings cannot be reassigned.
- 5. Why are `Number`/`String`/`Boolean` (capitalized) discouraged as type annotations? — They refer to the wrapper object types; the lowercase versions denote the primitives you almost always want.

### Mini Project

Build a typed Temperature Converter: A module with `toFahrenheit(c: number): number`, `toCelsius(f: number): number`, and a `parseTemp(input: unknown): number` that narrows and throws on bad input. Suggested approach:
  - Define each conversion function with explicit return-type annotations
  - Implement `parseTemp` using `typeof` narrowing on `unknown`
  - Add a tuple type `[number, "C" | "F"]` for tagged values
  - Export the functions and a `convert(value: number, from: "C" | "F"): number` dispatcher
  - Write 5 assertions in a `main()` and run with `tsx`

### Exercises

1. Declare variables of every primitive type and verify their inferred types by hovering in VS Code.
2. Write a function `formatPrice(amount: number, currency: string): string` and call it incorrectly on purpose to see the error.
3. Convert a function that uses `any` to use `unknown` with proper narrowing.
4. Create a tuple `[string, number, boolean]`, then attempt to `push` an extra element — observe the warning and apply `as const` or `readonly`.
5. Enable `noImplicitAny` in tsconfig and refactor any parameters that were implicitly `any`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `const x = "hi"` infer as?
9. A) `string`
10. B) `"hi"` (literal type) (*)
11. C) `unknown`
12. D) `any`
13. Explanation: `const` bindings are non-widening, so TS infers the literal type `"hi"` rather than the broader `string`.
14. Q2: Which type accepts any value but requires narrowing before use?
15. A) `any`
16. B) `object`
17. C) `unknown` (*)
18. D) `never`
19. Explanation: `unknown` is the type-safe counterpart to `any` — assignable from anything but you must narrow it before operating on it.
20. Q3: What is the inferred type of `let n = 42;`?
21. A) `42`
22. B) `Number`
23. C) `int`
24. D) `number` (*)
25. Explanation: `let` allows reassignment, so TS widens the literal `42` to the base type `number`.
26. Q4: Which annotation declares a tuple of a string and a number?
27. A) `[string, number]` (*)
28. B) `(string, number)`
29. C) `{string, number}`
30. D) `<string, number>`
31. Explanation: TS uses square brackets with comma-separated element types for tuples: `[string, number]`.
32. Q5: Which is the correct type for an array of numbers?
33. A) `number{}`
34. B) `Array<number>` and `number[]` are both correct (*)
35. C) `list<number>`
36. D) `[number]`
37. Explanation: Both `number[]` and `Array<number>` denote an array of numbers; the former is preferred for brevity.
38. Q6: What does `noImplicitAny` do?
39. A) Forbids the explicit `any` keyword
40. B) Converts all `any` to `unknown`
41. C) Reports an error when a type would otherwise be inferred as `any` (*)
42. D) Disables the `any` type entirely
43. Explanation: `noImplicitAny` causes `tsc` to error on parameters/variables whose type cannot be inferred and would silently become `any`.
44. Q7: Which is the primitive boolean type?
45. A) `Boolean`
46. B) `bool`
47. C) `Bool`
48. D) `boolean` (*)
49. Explanation: Lowercase `boolean` is the primitive type; `Boolean` is the wrapper object type, which you almost never want.
50. Q8: Which correctly narrows `unknown` to a number?
51. A) `if (typeof x === "number")` (*)
52. B) `if (x === number)`
53. C) `if (x instanceof number)`
54. D) `if (x is number)`
55. Explanation: `typeof` is the standard runtime check for primitives; `instanceof` only works for class instances, not primitives.
56. Q9: What is the type of `undefined` under `strictNullChecks`?
57. A) `any`
58. B) `undefined` (its own type, distinct from `null`) (*)
59. C) `void`
60. D) `null`
61. Explanation: With `strictNullChecks`, `undefined` and `null` are distinct types and are not assignable to each other or to other types without an explicit union.
62. Q10: Which statement about `bigint` is true?
63. A) It is interchangeable with `number`
64. B) It is the default for all integers
65. C) It can represent integers beyond `Number.MAX_SAFE_INTEGER` (*)
66. D) It compiles to a regular `number` at runtime
67. Explanation: `bigint` is a separate primitive for arbitrary-precision integers; literals use the `n` suffix (e.g., `123n`) and the type is preserved at runtime.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `const x = "hi"` infer as?
  options:
    - "`string`"
    - '`"hi"` (literal type)'
    - "`unknown`"
    - "`any`"
  correctIndex: 1
  explanation: '`const` bindings are non-widening, so TS infers the literal type `"hi"` rather than the broader `string`.'
- id: q2
  question: Which type accepts any value but requires narrowing before use?
  options:
    - "`any`"
    - "`object`"
    - "`unknown`"
    - "`never`"
  correctIndex: 2
  explanation: "`unknown` is the type-safe counterpart to `any` — assignable from anything but you must narrow it before operating on it."
- id: q3
  question: What is the inferred type of `let n = 42;`?
  options:
    - "`42`"
    - "`Number`"
    - "`int`"
    - "`number`"
  correctIndex: 3
  explanation: "`let` allows reassignment, so TS widens the literal `42` to the base type `number`."
- id: q4
  question: Which annotation declares a tuple of a string and a number?
  options:
    - "`[string, number]`"
    - "`(string, number)`"
    - "`{string, number}`"
    - "`<string, number>`"
  correctIndex: 0
  explanation: "TS uses square brackets with comma-separated element types for tuples: `[string, number]`."
- id: q5
  question: Which is the correct type for an array of numbers?
  options:
    - "`number{}`"
    - "`Array<number>` and `number[]` are both correct"
    - "`list<number>`"
    - "`[number]`"
  correctIndex: 1
  explanation: Both `number[]` and `Array<number>` denote an array of numbers; the former is preferred for brevity.
- id: q6
  question: What does `noImplicitAny` do?
  options:
    - Forbids the explicit `any` keyword
    - Converts all `any` to `unknown`
    - Reports an error when a type would otherwise be inferred as `any`
    - Disables the `any` type entirely
  correctIndex: 2
  explanation: "`noImplicitAny` causes `tsc` to error on parameters/variables whose type cannot be inferred and would silently become `any`."
- id: q7
  question: Which is the primitive boolean type?
  options:
    - "`Boolean`"
    - "`bool`"
    - "`Bool`"
    - "`boolean`"
  correctIndex: 3
  explanation: Lowercase `boolean` is the primitive type; `Boolean` is the wrapper object type, which you almost never want.
- id: q8
  question: Which correctly narrows `unknown` to a number?
  options:
    - '`if (typeof x === "number")`'
    - "`if (x === number)`"
    - "`if (x instanceof number)`"
    - "`if (x is number)`"
  correctIndex: 0
  explanation: "`typeof` is the standard runtime check for primitives; `instanceof` only works for class instances, not primitives."
- id: q9
  question: What is the type of `undefined` under `strictNullChecks`?
  options:
    - "`any`"
    - "`undefined` (its own type, distinct from `null`)"
    - "`void`"
    - "`null`"
  correctIndex: 1
  explanation: With `strictNullChecks`, `undefined` and `null` are distinct types and are not assignable to each other or to other types without an explicit union.
- id: q10
  question: Which statement about `bigint` is true?
  options:
    - It is interchangeable with `number`
    - It is the default for all integers
    - It can represent integers beyond `Number.MAX_SAFE_INTEGER`
    - It compiles to a regular `number` at runtime
  correctIndex: 2
  explanation: "`bigint` is a separate primitive for arbitrary-precision integers; literals use the `n` suffix (e.g., `123n`) and the type is preserved at runtime."
```

