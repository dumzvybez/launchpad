---
slug: typescript-mapped-types-utility-types
id: typescript-08
track: typescript
order: 8
title: Mapped Types and Utility Types
description: Build reusable type transformations with mapped types, learn the built-in utility types, and understand `keyof` + `as` (key remapping).
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=3600s
whyItMatters: Build reusable type transformations with mapped types, learn the built-in utility types, and understand `keyof` + `as` (key remapping).
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Mapped Types and Utility Types

## Mapped Types and Utility Types

### Why It Matters

Build reusable type transformations with mapped types, learn the built-in utility types, and understand `keyof` + `as` (key remapping).

Build reusable type transformations with mapped types, learn the built-in utility types, and understand `keyof` + `as` (key remapping).

### Prerequisites

- Stage 6: Generics.
- Stage 7: Unions, Intersections, and Conditional Types.

### Topics

- `keyof` and indexed access types (`T[K]`)
- Mapped types: `{ [K in keyof T]: ... }`
- Modifiers `+`/`-`, `?`, and `readonly` in mapped types
- Key remapping via `as` (TS 4.1+)
- Built-in utilities: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`
- `Awaited<T>` and `Promise<T>`
- Template literal types

### Key Concepts

- Mapped types iterate over the keys of an existing type, producing a new object type.
- `?` and `readonly` modifiers can be added (`+`) or removed (`-`) via mapped types — this is how `Required` and `Mutable` are implemented.
- Key remapping (`as`) lets you rename or filter keys using template literal types.
- Template literal types (``${Prefix}${K}``) produce string literal unions; combined with mapped types, they're powerful for naming conventions.
- All built-in utilities are tiny mapped/conditional types — reading their definitions in `lib.d.ts` is a great learning exercise.

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

interface User { id: number; name: string; }
type UserGetters = Getters<User>; // { getId: () => number; getName: () => string }
```
Caption: Custom mapped types

### Common Pitfalls

- Forgetting that mapped types preserve modifiers (optionality, readonly) — `Pick<T, K>` keeps `readonly` and `?` from the source; use a custom mapper if you want to strip them.
- Expecting `Partial<T>` to make a deeply-optional type — it's shallow; use a `DeepPartial<T>` recursive mapped type for nested objects.
- Confusing `Pick` (keep these keys) and `Omit` (drop these keys) — they're inverse operations; double-check which one your call site needs.
- Using `Record<string, T>` when keys are known — `Record<"a" | "b", T>` is stricter and forces every key to be present.
- Believing template literal types produce runtime strings — they are pure compile-time types; the emitted JS contains nothing.

### Real-World Applications

- React's `ComponentProps<T>` is a mapped/conditional type that extracts props from a component type — used by every higher-order component library.
- The Prisma client uses `Omit` and `Pick` heavily to derive per-operation input types (e.g., `UserCreateInput`, `UserUpdateInput`) from the single source-of-truth model.
- The Emotion CSS-in-JS library exposes `Record<keyof CSSProperties, ...>` to type style objects with autocomplete.
- The Zod schema library's `z.infer<typeof schema>` is a deep conditional/mapped type that derives a TS type from a runtime schema.

### Interview Questions

- 1. What is a mapped type? — A type that iterates over the keys of an existing type and produces a new object type, optionally modifying each property.
- 2. How is `Partial<T>` implemented? — As `{ [K in keyof T]?: T[K] }`, adding the `?` modifier to every property.
- 3. What does `as` do in a mapped type? — Key remapping: it lets you rename or filter keys using a type-level expression.
- 4. What are template literal types? — Compile-time string types built by interpolating other types into a template literal, producing unions of string literals.
- 5. What is the difference between `Pick` and `Omit`? — `Pick<T, K>` keeps only the listed keys; `Omit<T, K>` drops the listed keys.

### Mini Project

Build a typed Form Schema Generator: Given an interface `T`, produce a `FormConfig<T>` where each field becomes `{ value: T[K]; errors: string[]; touched: boolean }`. Suggested approach:
  - Define `type FieldConfig<V> = { value: V; errors: string[]; touched: boolean }`
  - Write `type FormConfig<T> = { [K in keyof T]: FieldConfig<T[K]> }`
  - Add a `makeForm<T>(initial: T): FormConfig<T>` factory
  - Add a `validate<T>(form: FormConfig<T>, rules: Partial<Record<keyof T, (v: any) => string | null>>)` function
  - Test on a `User` interface with 3 fields

### Exercises

1. Implement `DeepReadonly<T>` recursively and apply it to a nested object.
2. Implement `Getters<T>` that produces `getX` methods for each property using `as` remapping.
3. Use `Pick` and `Omit` to derive a "user preview" and "user patch" type from a base `User` interface.
4. Write `type HTTPPath = \`/api/${string}\`` and use it as a parameter type.
5. Combine conditional + mapped: `type FunctionFields<T> = { [K in keyof T]: T[K] extends Function ? T[K] : never }`.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How is `Partial<T>` implemented?
9. A) `{ [K in keyof T]: T[K] }`
10. B) `{ [K in keyof T]: T[K] | undefined }`
11. C) `{ [K in T]?: K }`
12. D) `{ [K in keyof T]?: T[K] }` (*)
13. Explanation: `Partial` adds the `?` modifier to every property via a mapped type, making each optional.
14. Q2: What does `Pick<T, "a" | "b">` do?
15. A) Keeps only keys a and b (*)
16. B) Drops keys a and b
17. C) Renames keys a and b
18. D) Makes a and b readonly
19. Explanation: `Pick<T, K extends keyof T>` constructs a type with only the selected keys from T.
20. Q3: What does `as` do in a mapped type?
21. A) Casts the value to a type
22. B) Remaps (renames or filters) the key (*)
23. C) Makes the property optional
24. D) Asserts the key is a string
25. Explanation: `[K in keyof T as NewKey]: T[K]` remaps each key to `NewKey`, which can also be `never` to filter out.
26. Q4: Which built-in utility removes `null` and `undefined` from a union?
27. A) `Pick`
28. B) `Omit`
29. C) `NonNullable<T>` (*)
30. D) `Required`
31. Explanation: `NonNullable<T>` excludes `null` and `undefined` from the union T.
32. Q5: What does `Capitalize<"hello">` produce?
33. A) `"HELLO"`
34. B) `string`
35. C) An error
36. D) `"Hello"` (*)
37. Explanation: `Capitalize` is a built-in intrinsic that uppercases the first character of a string-literal type.
38. Q6: Which is a template literal type?
39. A) `type S = `on${Capitalize<"click">}`` -> `"onClick"` (*)
40. B) `type S = String("onClick")`
41. C) `type S = "onClick"()`
42. D) `type S = template("onClick")`
43. Explanation: Backtick template literals at the type level produce string-literal unions; here the result is `"onClick"`.
44. Q7: Which utility is the inverse of `Partial`?
45. A) `Omit`
46. B) `Required` (*)
47. C) `Readonly`
48. D) `Pick`
49. Explanation: `Required<T>` strips the `?` modifier (via `-?`) from every property, the opposite of `Partial`.
50. Q8: What does `keyof T` return for `type T = { a: number; b: string }`?
51. A) `number | string`
52. B) `{ a: number; b: string }`
53. C) `"a" | "b"` (*)
54. D) `T[]`
55. Explanation: `keyof` returns a union of the literal property names — `"a" | "b"` here.
56. Q9: What does `{ [K in keyof T]-?: T[K] }` do?
57. A) Makes every property optional
58. B) Makes every property readonly
59. C) Removes readonly
60. D) Removes the optional modifier from every property (*)
61. Explanation: The `-?` modifier strips optionality; this is exactly how `Required<T>` is implemented.
62. Q10: What's the type of `Record<"a" | "b", number>`?
63. A) `{ a: number; b: number }` (*)
64. B) `Map<"a" | "b", number>`
65. C) `["a" | "b", number]`
66. D) `Array<number>`
67. Explanation: `Record<K, V>` constructs an object type with each key in K mapped to V — here, an object with both `a` and `b` as numbers.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How is `Partial<T>` implemented?
  options:
    - "`{ [K in keyof T]: T[K] }`"
    - "`{ [K in keyof T]: T[K] | undefined }`"
    - "`{ [K in T]?: K }`"
    - "`{ [K in keyof T]?: T[K] }`"
  correctIndex: 3
  explanation: "`Partial` adds the `?` modifier to every property via a mapped type, making each optional."
- id: q2
  question: What does `Pick<T, "a" | "b">` do?
  options:
    - Keeps only keys a and b
    - Drops keys a and b
    - Renames keys a and b
    - Makes a and b readonly
  correctIndex: 0
  explanation: "`Pick<T, K extends keyof T>` constructs a type with only the selected keys from T."
- id: q3
  question: What does `as` do in a mapped type?
  options:
    - Casts the value to a type
    - Remaps (renames or filters) the key
    - Makes the property optional
    - Asserts the key is a string
  correctIndex: 1
  explanation: "`[K in keyof T as NewKey]: T[K]` remaps each key to `NewKey`, which can also be `never` to filter out."
- id: q4
  question: Which built-in utility removes `null` and `undefined` from a union?
  options:
    - "`Pick`"
    - "`Omit`"
    - "`NonNullable<T>`"
    - "`Required`"
  correctIndex: 2
  explanation: "`NonNullable<T>` excludes `null` and `undefined` from the union T."
- id: q5
  question: What does `Capitalize<"hello">` produce?
  options:
    - '`"HELLO"`'
    - "`string`"
    - An error
    - '`"Hello"`'
  correctIndex: 3
  explanation: "`Capitalize` is a built-in intrinsic that uppercases the first character of a string-literal type."
- id: q6
  question: Which is a template literal type?
  options:
    - '`type S = `on${Capitalize<"click">}`` -> `"onClick"`'
    - '`type S = String("onClick")`'
    - '`type S = "onClick"()`'
    - '`type S = template("onClick")`'
  correctIndex: 0
  explanation: Backtick template literals at the type level produce string-literal unions; here the result is `"onClick"`.
- id: q7
  question: Which utility is the inverse of `Partial`?
  options:
    - "`Omit`"
    - "`Required`"
    - "`Readonly`"
    - "`Pick`"
  correctIndex: 1
  explanation: "`Required<T>` strips the `?` modifier (via `-?`) from every property, the opposite of `Partial`."
- id: q8
  question: "What does `keyof T` return for `type T = { a: number; b: string }`?"
  options:
    - "`number | string`"
    - "`{ a: number; b: string }`"
    - '`"a" | "b"`'
    - "`T[]`"
  correctIndex: 2
  explanation: '`keyof` returns a union of the literal property names — `"a" | "b"` here.'
- id: q9
  question: "What does `{ [K in keyof T]-?: T[K] }` do?"
  options:
    - Makes every property optional
    - Makes every property readonly
    - Removes readonly
    - Removes the optional modifier from every property
  correctIndex: 3
  explanation: The `-?` modifier strips optionality; this is exactly how `Required<T>` is implemented.
- id: q10
  question: What's the type of `Record<"a" | "b", number>`?
  options:
    - "`{ a: number; b: number }`"
    - '`Map<"a" | "b", number>`'
    - '`["a" | "b", number]`'
    - "`Array<number>`"
  correctIndex: 0
  explanation: "`Record<K, V>` constructs an object type with each key in K mapped to V — here, an object with both `a` and `b` as numbers."
```

