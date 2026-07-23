---
slug: typescript-enums-literals-literal-types
id: typescript-12
track: typescript
order: 12
title: Enums, Literals, and Literal Types
description: Use string-literal unions, numeric and string enums, `const enum`, and `as const` objects — and know when to avoid each.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=6800s
whyItMatters: Use string-literal unions, numeric and string enums, `const enum`, and `as const` objects — and know when to avoid each.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Enums, Literals, and Literal Types

## Enums, Literals, and Literal Types

### Why It Matters

Use string-literal unions, numeric and string enums, `const enum`, and `as const` objects — and know when to avoid each.

Use string-literal unions, numeric and string enums, `const enum`, and `as const` objects — and know when to avoid each.

### Prerequisites

- Stage 3: Interfaces and Type Aliases.
- Stage 7: Unions, Intersections, and Conditional Types.

### Topics

- String-literal unions (`type Status = "open" | "closed"`)
- Numeric enums and their reverse-mapping behavior
- String enums and their lack of reverse mapping
- `const enum` and the bundler incompatibility
- `as const` for readonly literal arrays and objects
- The "union of literals vs enum" decision
- Computed enum members and pitfalls
- `satisfies` (TS 4.9+) for checked literal collections

### Key Concepts

- String-literal unions are erased at runtime (zero cost) and preferred for closed sets of values.
- Numeric enums create a reverse-mapping object at runtime (`Color[0] === "Red"`); string enums do not.
- `const enum` is inlined by `tsc` but breaks with `isolatedModules` and many bundlers — avoid in shared libraries.
- `as const` produces the narrowest literal types and readonly arrays/objects.
- `satisfies` (TS 4.9+) lets you constrain an object's values to a union while preserving the literal types of each property.

```typescript
type Status = "open" | "closed" | "pending";
const STATUSES = ["open", "closed", "pending"] as const;
type StatusFromConst = typeof STATUSES[number]; // "open" | "closed" | "pending"
```
Caption: Literal unions and as const

### Common Pitfalls

- Using numeric enums where string enums or literal unions would be safer — numeric enums are reverse-mappable and silently accept arbitrary numbers via a type cast.
- Reaching for `const enum` in a library — `isolatedModules` and `tsc`-less transpilers (esbuild, swc) cannot inline them; use plain enums or literal unions instead.
- Forgetting that string enums are not auto-incremented and have no reverse mapping — `Direction["UP"]` is a runtime error, unlike numeric enums.
- Widening with `as` instead of narrowing with `as const` — `["a", "b"] as string[]` widens; `["a", "b"] as const` preserves the literal types.
- Adding a new value to a literal union but forgetting to update every switch — combine with `never`-default exhaustiveness (Stage 7) to get a compile error.

### Real-World Applications

- The TypeScript compiler itself uses both enums (`SyntaxKind`) and literal unions depending on whether reverse-mapping is needed.
- Stripe's API types use string-literal unions for currency codes, country codes, and event names — enabling autocomplete and catching typos at compile time.
- The tRPC library uses `as const` to define procedure types and infer the router shape from a runtime definition.
- GitHub's Octokit SDK uses string-literal unions for media types (`"application/vnd.github+json"`) and event names.

### Interview Questions

- 1. What is the difference between a numeric enum and a string enum at runtime? — Numeric enums create a reverse-mapping object (`Color[0] === "Red"`); string enums do not.
- 2. Why avoid `const enum` in libraries? — It requires inlining by `tsc`; `isolatedModules` and most transpilers (esbuild, swc, Babel) cannot inline them, causing runtime errors.
- 3. What does `as const` do? — Narrows types to their literal versions and marks arrays/objects as readonly: `["a"] as const` is `readonly ["a"]`.
- 4. What's a safer alternative to enums? — String-literal unions (or `as const` objects) for closed value sets; they're erased at runtime and tree-shake cleanly.
- 5. What does `satisfies` add over a type annotation? — It checks the value matches the type while preserving the most specific (literal) types of each property.

### Mini Project

Build a typed Configuration Registry: A `ROLES` and `PERMISSIONS` registry using `as const` objects, with a `hasPermission(role: Role, perm: Permission)` function. Suggested approach:
  - Define `const ROLES = { ADMIN: "admin", USER: "user", GUEST: "guest" } as const`
  - Define `const PERMISSIONS = { READ: "read", WRITE: "write", DELETE: "delete" } as const`
  - Derive `type Role` and `type Permission` via `typeof X[keyof typeof X]`
  - Build a `Map<Role, Permission[]>` literal table
  - Implement `hasPermission` and exhaustively test all role-permission pairs

### Exercises

1. Convert a numeric enum to a string-literal union; verify the runtime output is smaller.
2. Use `as const` on an array of strings and derive a union type from it.
3. Demonstrate numeric enum reverse-mapping in the console; show that string enums fail the same operation.
4. Refactor a `const enum` to a plain enum (or literal union) so it works under `isolatedModules`.
5. Use `satisfies` to validate a config object against a known shape while preserving literal types.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which enum creates a reverse-mapping object at runtime?
9. A) String enum
10. B) `const enum`
11. C) Literal union
12. D) Numeric enum (*)
13. Explanation: Numeric enums emit an object with both forward (`Color.Red === 0`) and reverse (`Color[0] === "Red"`) mappings; string enums emit only forward mappings.
14. Q2: What does `as const` do to `["a", "b"]`?
15. A) Narrows to `readonly ["a", "b"]` (*)
16. B) Widens to `string[]`
17. C) Makes it mutable
18. D) Throws at runtime
19. Explanation: `as const` infers the narrowest type — here a readonly tuple of two string literals — and marks arrays as readonly.
20. Q3: Why is `const enum` discouraged in libraries?
21. A) It is slower at runtime
22. B) `isolatedModules` and most transpilers cannot inline it, causing runtime errors (*)
23. C) It produces larger bundles
24. D) It is deprecated
25. Explanation: `const enum` requires the compiler to inline member references; esbuild/swc/Babel don't do this, so values become `undefined` at runtime.
26. Q4: Which is the recommended zero-cost alternative to enums for closed value sets?
27. A) Numeric enums
28. B) `const enum`
29. C) String-literal unions (*)
30. D) `Record<string, any>`
31. Explanation: String-literal unions are erased at runtime (zero cost), tree-shake cleanly, and offer the same autocomplete and exhaustiveness as enums.
32. Q5: What does `satisfies` (TS 4.9+) do?
33. A) Widens types
34. B) Throws at runtime
35. C) Skips type-checking
36. D) Checks a value matches a type while preserving literal types (*)
37. Explanation: `satisfies T` validates that the value is assignable to T while keeping the most specific (literal) type of each property — unlike `: T`, which widens.
38. Q6: What is `typeof STATUSES[number]` if `STATUSES = ["a","b"] as const`?
39. A) `"a" | "b"` (*)
40. B) `string`
41. C) `number`
42. D) `unknown`
43. Explanation: Indexing a readonly tuple by `number` yields the union of its element types — here the literal union `"a" | "b"`.
44. Q7: Why don't string enums support reverse mapping?
45. A) They do — the question is wrong
46. B) The runtime object only has forward mappings for string values (*)
47. C) String enums are erased
48. D) TS forbids it
49. Explanation: String-enum members map name -> value only; there's no value -> name entry in the emitted object, so `Direction["UP"]` is `undefined`.
50. Q8: Which pattern derives a union type from an `as const` object's values?
51. A) `keyof ROLES`
52. B) `ROLES[]`
53. C) `typeof ROLES[keyof typeof ROLES]` (*)
54. D) `Partial<ROLES>`
55. Explanation: `keyof typeof ROLES` is the union of keys; indexing `typeof ROLES` by that union yields the union of value types.
56. Q9: What is a downside of numeric enums?
57. A) They cannot be string values
58. B) They are always `const enum`
59. C) They are not supported in TS 5
60. D) Any number is assignable to the enum type via cast, breaking type safety (*)
61. Explanation: Numeric enum types are actually `number` under the hood, so `Color.X = 99 as Color` compiles even though 99 isn't a defined member — a real footgun.
62. Q10: What's a key advantage of `satisfies` over a plain type annotation?
63. A) It preserves the literal type of each property (e.g., `"#3178C6"` instead of `string`) (*)
64. B) It is faster
65. C) It skips runtime checks
66. D) It enables decorators
67. Explanation: A plain annotation widens each property to the declared type; `satisfies` keeps the narrow literal type so you can use it in further type-level computations.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which enum creates a reverse-mapping object at runtime?
  options:
    - String enum
    - "`const enum`"
    - Literal union
    - Numeric enum
  correctIndex: 3
  explanation: Numeric enums emit an object with both forward (`Color.Red === 0`) and reverse (`Color[0] === "Red"`) mappings; string enums emit only forward mappings.
- id: q2
  question: What does `as const` do to `["a", "b"]`?
  options:
    - Narrows to `readonly ["a", "b"]`
    - Widens to `string[]`
    - Makes it mutable
    - Throws at runtime
  correctIndex: 0
  explanation: "`as const` infers the narrowest type — here a readonly tuple of two string literals — and marks arrays as readonly."
- id: q3
  question: Why is `const enum` discouraged in libraries?
  options:
    - It is slower at runtime
    - "`isolatedModules` and most transpilers cannot inline it, causing runtime errors"
    - It produces larger bundles
    - It is deprecated
  correctIndex: 1
  explanation: "`const enum` requires the compiler to inline member references; esbuild/swc/Babel don't do this, so values become `undefined` at runtime."
- id: q4
  question: Which is the recommended zero-cost alternative to enums for closed value sets?
  options:
    - Numeric enums
    - "`const enum`"
    - String-literal unions
    - "`Record<string, any>`"
  correctIndex: 2
  explanation: String-literal unions are erased at runtime (zero cost), tree-shake cleanly, and offer the same autocomplete and exhaustiveness as enums.
- id: q5
  question: What does `satisfies` (TS 4.9+) do?
  options:
    - Widens types
    - Throws at runtime
    - Skips type-checking
    - Checks a value matches a type while preserving literal types
  correctIndex: 3
  explanation: "`satisfies T` validates that the value is assignable to T while keeping the most specific (literal) type of each property — unlike `: T`, which widens."
- id: q6
  question: What is `typeof STATUSES[number]` if `STATUSES = ["a","b"] as const`?
  options:
    - '`"a" | "b"`'
    - "`string`"
    - "`number`"
    - "`unknown`"
  correctIndex: 0
  explanation: Indexing a readonly tuple by `number` yields the union of its element types — here the literal union `"a" | "b"`.
- id: q7
  question: Why don't string enums support reverse mapping?
  options:
    - They do — the question is wrong
    - The runtime object only has forward mappings for string values
    - String enums are erased
    - TS forbids it
  correctIndex: 1
  explanation: String-enum members map name -> value only; there's no value -> name entry in the emitted object, so `Direction["UP"]` is `undefined`.
- id: q8
  question: Which pattern derives a union type from an `as const` object's values?
  options:
    - "`keyof ROLES`"
    - "`ROLES[]`"
    - "`typeof ROLES[keyof typeof ROLES]`"
    - "`Partial<ROLES>`"
  correctIndex: 2
  explanation: "`keyof typeof ROLES` is the union of keys; indexing `typeof ROLES` by that union yields the union of value types."
- id: q9
  question: What is a downside of numeric enums?
  options:
    - They cannot be string values
    - They are always `const enum`
    - They are not supported in TS 5
    - Any number is assignable to the enum type via cast, breaking type safety
  correctIndex: 3
  explanation: Numeric enum types are actually `number` under the hood, so `Color.X = 99 as Color` compiles even though 99 isn't a defined member — a real footgun.
- id: q10
  question: What's a key advantage of `satisfies` over a plain type annotation?
  options:
    - It preserves the literal type of each property (e.g., `"#3178C6"` instead of `string`)
    - It is faster
    - It skips runtime checks
    - It enables decorators
  correctIndex: 0
  explanation: A plain annotation widens each property to the declared type; `satisfies` keeps the narrow literal type so you can use it in further type-level computations.
```

