---
slug: typescript-type-narrowing-type-guards
id: typescript-10
track: typescript
order: 10
title: Type Narrowing and Type Guards
description: Use `typeof`, `instanceof`, `in`, truthiness, and user-defined type predicates to narrow union types safely; spot narrowing failures.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=5200s
whyItMatters: Use `typeof`, `instanceof`, `in`, truthiness, and user-defined type predicates to narrow union types safely; spot narrowing failures.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Type Narrowing and Type Guards

## Type Narrowing and Type Guards

### Why It Matters

Use `typeof`, `instanceof`, `in`, truthiness, and user-defined type predicates to narrow union types safely; spot narrowing failures.

Use `typeof`, `instanceof`, `in`, truthiness, and user-defined type predicates to narrow union types safely; spot narrowing failures.

### Prerequisites

- Stage 7: Unions, Intersections, and Conditional Types.
- Stage 8: Mapped Types and Utility Types.

### Topics

- `typeof` narrowing for primitives
- `instanceof` narrowing for classes
- `in` narrowing for property presence
- Truthiness narrowing and the empty-string/zero trap
- Discriminated-union narrowing
- User-defined type guards (`x is Foo`)
- Assertion functions (`asserts x is Foo`)
- Narrowing failures: aliased conditions, closures, and `as`

### Key Concepts

- TS narrows in the branches of `if`, `switch`, `?`, `&&`, `||`, and after early returns.
- `typeof` works for primitives only; `instanceof` requires a class (constructor function) at runtime.
- User-defined type predicates (`x is Foo`) let you encapsulate narrowing logic in a function.
- Assertion functions (`asserts x is Foo`) throw if the assertion fails, narrowing after the call.
- Narrowing is lost inside callbacks because the variable may have changed; assign to a const first.

```typescript
function format(v: string | number | Date | { format: () => string }): string {
  if (typeof v === "string") return v.toUpperCase();
  if (typeof v === "number") return v.toFixed(2);
  if (v instanceof Date) return v.toISOString();
  return v.format(); // narrowed to the object-with-format case
}
```
Caption: typeof, instanceof, in

### Common Pitfalls

- Expecting narrowing to survive into a callback — TS conservatively assumes the variable could be reassigned between the check and the callback's execution; assign to a `const` first.
- Using `typeof x === "object"` to narrow to a specific shape — `typeof null === "object"`, so this check is unreliable; combine with `x !== null` or use `in`.
- Writing type guards that lie — `function isFoo(x: any): x is Foo { return true; }` will silently corrupt downstream typing; always run a real check.
- Confusing `asserts x is T` (throws on failure) with `x is T` (returns boolean) — assertion functions narrow after the call without an `if`.
- Forgetting that `instanceof` requires the constructor to be available at runtime — it fails across realms (iframes) and after class redefinition in HMR.

### Real-World Applications

- The `node-fetch` and `axios` error handling uses `error instanceof Error` and `axios.isAxiosError(error)` (a custom type guard) to narrow catch-block values.
- Zod's `.parse()` is an assertion function (`asserts input is T`) that throws on validation failure; this is how Zod narrows at runtime.
- The `io-ts` library uses user-defined type guards (`is(...)`/`decode(...)`) to convert unknown JSON into typed values at the boundary.
- React's `Children.count` and `isValidElement` are type guards that narrow `ReactNode` to `ReactElement` for safe property access.

### Interview Questions

- 1. What is type narrowing? — TS refining a value's type within a branch (if/switch/etc.) based on a runtime check.
- 2. What is the difference between a type guard and an assertion function? — A type guard returns boolean (`x is T`); an assertion function throws on failure and narrows after the call (`asserts x is T`).
- 3. Why does narrowing fail inside callbacks? — TS conservatively assumes the variable could be reassigned before the callback runs; capturing it in a `const` preserves the narrowing.
- 4. What's wrong with `typeof x === "object"` to check for an object? — `typeof null === "object"`, so null slips through; combine with `x !== null` or use `in`.
- 5. How do you write a custom type guard? — Use the `x is T` return-type annotation: `function isFoo(x: unknown): x is Foo { ... }`.

### Mini Project

Build a typed JSON-Safe Decoder: A small library of type guards (`isString`, `isNumber`, `isObject`, `isArray`, `isExactly`) plus a `decode` function that takes `unknown` and a schema and returns a typed value or throws. Suggested approach:
  - Write `type Guard<T> = (x: unknown) => x is T`
  - Implement each primitive guard using `typeof`
  - Implement `isObject` with `typeof x === "object" && x !== null`
  - Implement a `Guard<{ [K in keyof T]: T[K] }>` factory for objects
  - Write `decode<T>(input: unknown, g: Guard<T>): T` that throws on failure

### Exercises

1. Write a `isNonEmptyString(x: unknown): x is string` type guard that checks both type and length.
2. Write an `assertDefined<T>(x: T | undefined): asserts x is T` assertion function.
3. Demonstrate a narrowing failure inside a `setTimeout` callback and fix it with a `const` capture.
4. Use `in` to narrow a union `{ kind: "a"; a: number } | { kind: "b"; b: string }` based on which field exists.
5. Combine `typeof` and `Array.isArray` to narrow `string | string[] | number` exhaustively.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which returns a boolean that narrows in the calling branch?
9. A) `asserts x is T`
10. B) `x is T` (user-defined type guard) (*)
11. C) `as T`
12. D) `<T>x`
13. Explanation: A type guard (`x is T`) returns a boolean; the calling code's `if (isFoo(x))` branch narrows `x` to `Foo`.
14. Q2: What does an assertion function (`asserts x is T`) do on failure?
15. A) Returns false
16. B) Returns undefined
17. C) Throws an exception (*)
18. D) Logs a warning
19. Explanation: Assertion functions throw on failure; if they return, TS narrows the parameter to `T` in subsequent code.
20. Q3: Why does TS refuse to narrow inside a `setTimeout` callback?
21. A) Because setTimeout is async
22. B) Because TS doesn't know setTimeout
23. C) Because of `isolatedModules`
24. D) Because the variable might be reassigned before the callback runs (*)
25. Explanation: TS conservatively widens variables captured by callbacks, since the outer code could reassign them between the check and the callback's invocation.
26. Q4: What's the standard fix for the closure-narrowing failure?
27. A) Assign the narrowed value to a `const` local before the callback (*)
28. B) Use `as any`
29. C) Disable strict mode
30. D) Use `// @ts-ignore`
31. Explanation: A `const` local cannot be reassigned, so TS preserves the narrowing inside the callback.
32. Q5: Why is `typeof x === "object"` unreliable for narrowing?
33. A) It's not — it's always correct
34. B) `typeof null === "object"`, so null slips through (*)
35. C) It returns a string
36. D) It only works for arrays
37. Explanation: The `typeof null` quirk returns `"object"`, so the check alone lets null through; combine with `x !== null` or use `in`.
38. Q6: Which narrows to `Error` in a catch block?
39. A) `if (typeof e === "Error")`
40. B) `if (e === Error)`
41. C) `if (e instanceof Error)` (*)
42. D) `if (e is Error)`
43. Explanation: `instanceof` is the runtime check that narrows class instances; `typeof` returns `"object"` for Errors, not `"Error"`.
44. Q7: What's the signature of a type guard that checks `x is string`?
45. A) `(x: unknown) => boolean`
46. B) `(x: unknown): asserts x is string`
47. C) `(x: string) => x is unknown`
48. D) `(x: unknown) => x is string` (*)
49. Explanation: The `x is string` return type is the type-predicate syntax that enables narrowing in the caller's branch.
50. Q8: Which operator narrows based on property presence?
51. A) `in` (*)
52. B) `of`
53. C) `as`
54. D) `is`
55. Explanation: `if ("length" in x)` narrows based on whether the property exists on the object — useful when there's no discriminant field.
56. Q9: What happens if a type guard lies (always returns true)?
57. A) Compile error
58. B) TS silently trusts the predicate, corrupting downstream types (*)
59. C) Runtime error
60. D) Warning only
61. Explanation: TS trusts the predicate; a lying type guard is a footgun that lets wrong types through, so always run a real check.
62. Q10: After `assertNonNull(maybe)` where `maybe: string | null`, what is the type of `maybe`?
63. A) Still `string | null`
64. B) `null`
65. C) `string` (*)
66. D) `never`
67. Explanation: The assertion function narrows away the `null` alternative, so subsequent uses of `maybe` are typed as `string`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which returns a boolean that narrows in the calling branch?
  options:
    - "`asserts x is T`"
    - "`x is T` (user-defined type guard)"
    - "`as T`"
    - "`<T>x`"
  correctIndex: 1
  explanation: A type guard (`x is T`) returns a boolean; the calling code's `if (isFoo(x))` branch narrows `x` to `Foo`.
- id: q2
  question: What does an assertion function (`asserts x is T`) do on failure?
  options:
    - Returns false
    - Returns undefined
    - Throws an exception
    - Logs a warning
  correctIndex: 2
  explanation: Assertion functions throw on failure; if they return, TS narrows the parameter to `T` in subsequent code.
- id: q3
  question: Why does TS refuse to narrow inside a `setTimeout` callback?
  options:
    - Because setTimeout is async
    - Because TS doesn't know setTimeout
    - Because of `isolatedModules`
    - Because the variable might be reassigned before the callback runs
  correctIndex: 3
  explanation: TS conservatively widens variables captured by callbacks, since the outer code could reassign them between the check and the callback's invocation.
- id: q4
  question: What's the standard fix for the closure-narrowing failure?
  options:
    - Assign the narrowed value to a `const` local before the callback
    - Use `as any`
    - Disable strict mode
    - Use `// @ts-ignore`
  correctIndex: 0
  explanation: A `const` local cannot be reassigned, so TS preserves the narrowing inside the callback.
- id: q5
  question: Why is `typeof x === "object"` unreliable for narrowing?
  options:
    - It's not — it's always correct
    - '`typeof null === "object"`, so null slips through'
    - It returns a string
    - It only works for arrays
  correctIndex: 1
  explanation: The `typeof null` quirk returns `"object"`, so the check alone lets null through; combine with `x !== null` or use `in`.
- id: q6
  question: Which narrows to `Error` in a catch block?
  options:
    - '`if (typeof e === "Error")`'
    - "`if (e === Error)`"
    - "`if (e instanceof Error)`"
    - "`if (e is Error)`"
  correctIndex: 2
  explanation: '`instanceof` is the runtime check that narrows class instances; `typeof` returns `"object"` for Errors, not `"Error"`.'
- id: q7
  question: What's the signature of a type guard that checks `x is string`?
  options:
    - "`(x: unknown) => boolean`"
    - "`(x: unknown): asserts x is string`"
    - "`(x: string) => x is unknown`"
    - "`(x: unknown) => x is string`"
  correctIndex: 3
  explanation: The `x is string` return type is the type-predicate syntax that enables narrowing in the caller's branch.
- id: q8
  question: Which operator narrows based on property presence?
  options:
    - "`in`"
    - "`of`"
    - "`as`"
    - "`is`"
  correctIndex: 0
  explanation: "`if (\"length\" in x)` narrows based on whether the property exists on the object — useful when there's no discriminant field."
- id: q9
  question: What happens if a type guard lies (always returns true)?
  options:
    - Compile error
    - TS silently trusts the predicate, corrupting downstream types
    - Runtime error
    - Warning only
  correctIndex: 1
  explanation: TS trusts the predicate; a lying type guard is a footgun that lets wrong types through, so always run a real check.
- id: q10
  question: "After `assertNonNull(maybe)` where `maybe: string | null`, what is the type of `maybe`?"
  options:
    - Still `string | null`
    - "`null`"
    - "`string`"
    - "`never`"
  correctIndex: 2
  explanation: The assertion function narrows away the `null` alternative, so subsequent uses of `maybe` are typed as `string`.
```

