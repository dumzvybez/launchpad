---
slug: typescript-interfaces-type-aliases
id: typescript-03
track: typescript
order: 3
title: Interfaces and Type Aliases
description: Model object shapes with `interface` and `type`, understand when each is preferred, and learn declaration merging and extension.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=WcRgpER7i_g&t=120s
whyItMatters: Model object shapes with `interface` and `type`, understand when each is preferred, and learn declaration merging and extension.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Interfaces and Type Aliases

## Interfaces and Type Aliases

### Why It Matters

Model object shapes with `interface` and `type`, understand when each is preferred, and learn declaration merging and extension.

Model object shapes with `interface` and `type`, understand when each is preferred, and learn declaration merging and extension.

### Prerequisites

- Stage 1: Getting Started with TypeScript.
- Stage 2: Basic Types and Annotations.

### Topics

- `interface` declarations for object shapes
- `type` aliases for any shape (objects, unions, primitives)
- Optional and readonly properties
- Index signatures for dynamic keys
- Extending interfaces vs intersecting types
- Declaration merging (interfaces only)
- When to choose `interface` vs `type`
- Structural typing vs nominal typing (preview)

### Key Concepts

- TS uses structural typing: a value matches a type if it has the right shape, regardless of the name.
- `interface` is open (declaration merging) and extendable via `extends`.
- `type` is closed, supports unions/intersections/mapped types, and can alias primitives.
- Two interfaces with the same name merge their members; this is impossible with `type`.
- Excess property checks apply only to fresh object literals, not to variables.

```typescript
interface User {
  id: number;
  name: string;
  email?: string;        // optional
  readonly createdAt: Date;
}

const u: User = { id: 1, name: "ada", createdAt: new Date() };
// u.createdAt = new Date(); // ERROR: readonly
```
Caption: Interface basics

### Common Pitfalls

- Forgetting excess property checks apply only to fresh literals — `const u: User = { id: 1, name: "x", extra: true }` errors, but `const o = { id: 1, name: "x", extra: true }; const u: User = o;` does not.
- Expecting `interface` and `type` to behave identically — interfaces can merge and be `extends`-ed; types cannot merge but can express unions and mapped types.
- Using `type` for object shapes that should be open for augmentation — prefer `interface` for library API surfaces that consumers may need to extend.
- Adding an index signature that's too permissive — `[key: string]: any` defeats type safety; prefer `Record<string, unknown>` and narrow.
- Believing `readonly` makes objects deeply immutable — `readonly` is shallow; nested mutable properties remain mutable. Use `Readonly<T>` recursively or a `DeepReadonly<T>` utility for true immutability.

### Real-World Applications

- React's component prop types are conventionally declared as `interface Props` for openness — third-party libraries (e.g., Material-UI) augment them.
- The TypeScript compiler itself uses `interface` extensively for AST nodes (`ts.Node`, `ts.FunctionDeclaration`) because the same interface name is declared across multiple files via merging.
- Slack's message schema uses `type` aliases for the union of message kinds (`AppMessage | BotMessage | UserMessage`) because interfaces cannot express unions.
- The Fetch API types in lib.dom.d.ts use `interface RequestInit` so that platform extensions (CORS, credentials) can merge in additional fields.

### Interview Questions

- 1. What's the difference between `interface` and `type`? — Interfaces support declaration merging and `extends`; types support unions, intersections, and mapped types but cannot merge.
- 2. What is structural typing? — A value is assignable to a type if it has all the required members, regardless of the declared name (duck typing at compile time).
- 3. When does excess property checking kick in? — Only when assigning a fresh object literal directly to a typed target; passing an existing variable bypasses it.
- 4. What is declaration merging? — Multiple `interface` declarations with the same name in the same scope combine their members into a single interface.
- 5. Is `readonly` deep? — No, it's shallow; nested objects remain mutable. Use `Readonly<T>` or a `DeepReadonly<T>` helper for deep immutability.

### Mini Project

Build a typed Configuration Schema: Model an app config with nested `interface`s (database, server, logging), a discriminated union for `LogLevel`, and a `type Config = {...}` aggregator. Suggested approach:
  - Declare `interface DatabaseConfig`, `interface ServerConfig`, `interface LoggingConfig` with optional fields
  - Add `readonly` to fields that should not change after boot
  - Define `type LogLevel = "debug" | "info" | "warn" | "error"`
  - Compose: `type AppConfig = { db: DatabaseConfig; server: ServerConfig; logging: LoggingConfig }`
  - Write a `validate(config: unknown): AppConfig` that narrows and throws on missing required keys

### Exercises

1. Declare an `interface Product` with id, name, price, and optional discount; instantiate it both correctly and incorrectly.
2. Convert the interface to a `type` alias and observe which features (extension syntax) change.
3. Demonstrate declaration merging by adding a field to an existing interface in a second declaration.
4. Trigger an excess-property error on a fresh literal, then bypass it via an intermediate variable; explain why.
5. Write a `DeepReadonly<T>` mapped type and apply it to a nested object — verify nested mutation is now forbidden.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which statement about `interface` vs `type` is TRUE?
9. A) `type` can be declaration-merged; `interface` cannot
10. B) Neither can be merged
11. C) `interface` can be declaration-merged; `type` cannot (*)
12. D) Both can be merged identically
13. Explanation: Interfaces with the same name in the same scope combine (merge); type aliases are closed and redeclaring one is an error.
14. Q2: TS structural typing means a value matches a type if...
15. A) It was created by the same constructor
16. B) It is exported from the same module
17. C) It is asserted via `as`
18. D) It has the required shape (members) regardless of name (*)
19. Explanation: TS uses structural (duck) typing: shape compatibility, not nominal identity, governs assignability.
20. Q3: When does excess-property checking fire?
21. A) Only when assigning a fresh object literal directly to a typed target (*)
22. B) Always, on every assignment
23. C) Only at runtime
24. D) Only with `interface`, never with `type`
25. Explanation: Excess-property checks are a special-case check for fresh object literals; assigning via a variable bypasses them.
26. Q4: What does `readonly` enforce on a property?
27. A) Deep immutability of the property's value
28. B) Shallow immutability — reassignment forbidden, nested mutation allowed (*)
29. C) That the property is optional
30. D) That the property is also `private`
31. Explanation: `readonly` is shallow: the property binding cannot be reassigned, but if the value is an object, its own fields remain mutable.
32. Q5: Which keyword extends an interface?
33. A) `implements`
34. B) `inherits`
35. C) `extends` (*)
36. D) `:`
37. Explanation: `interface B extends A { ... }` copies A's members into B, optionally adding more.
38. Q6: Which is a valid index signature?
39. A) `index: number` on an interface
40. B) `string -> number` on an interface
41. C) `Map<string, number>` on an interface
42. D) `[index: string]: number` on an interface (*)
43. Explanation: `[key: string]: T` declares that any string-keyed property maps to type T — useful for dynamic dictionaries.
44. Q7: Which CANNOT be expressed with an `interface`?
45. A) A union of two primitives (*)
46. B) An object shape
47. C) A function signature
48. D) A callable signature
49. Explanation: Interfaces describe shapes; unions of primitives (e.g., `string | number`) require a `type` alias.
50. Q8: What does `type ID = string | number;` create?
51. A) An interface named ID
52. B) A type alias for the union of string and number (*)
53. C) A class named ID
54. D) A runtime guard
55. Explanation: `type` introduces an alias; here `ID` is a name for the union `string | number`.
56. Q9: Two interfaces with the same name in the same file will...
57. A) Cause a compile error
58. B) Shadow each other (last wins)
59. C) Merge their members (*)
60. D) Be ignored
61. Explanation: TS declaration merging combines same-named interfaces into one with all members.
62. Q10: Which is the recommended type for an object whose keys are unknown strings but values are all `User`?
63. A) `User[string]`
64. B) `Array<User>`
65. C) `Map<User, string>`
66. D) `interface UsersMap { [k: string]: User }` or `Record<string, User>` — both valid (*)
67. Explanation: Both an index-signature interface and `Record<string, User>` model a string-keyed dictionary of `User`; `Record` is more idiomatic.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which statement about `interface` vs `type` is TRUE?
  options:
    - "`type` can be declaration-merged; `interface` cannot"
    - Neither can be merged
    - "`interface` can be declaration-merged; `type` cannot"
    - Both can be merged identically
  correctIndex: 2
  explanation: Interfaces with the same name in the same scope combine (merge); type aliases are closed and redeclaring one is an error.
- id: q2
  question: TS structural typing means a value matches a type if...
  options:
    - It was created by the same constructor
    - It is exported from the same module
    - It is asserted via `as`
    - It has the required shape (members) regardless of name
  correctIndex: 3
  explanation: "TS uses structural (duck) typing: shape compatibility, not nominal identity, governs assignability."
- id: q3
  question: When does excess-property checking fire?
  options:
    - Only when assigning a fresh object literal directly to a typed target
    - Always, on every assignment
    - Only at runtime
    - Only with `interface`, never with `type`
  correctIndex: 0
  explanation: Excess-property checks are a special-case check for fresh object literals; assigning via a variable bypasses them.
- id: q4
  question: What does `readonly` enforce on a property?
  options:
    - Deep immutability of the property's value
    - Shallow immutability — reassignment forbidden, nested mutation allowed
    - That the property is optional
    - That the property is also `private`
  correctIndex: 1
  explanation: "`readonly` is shallow: the property binding cannot be reassigned, but if the value is an object, its own fields remain mutable."
- id: q5
  question: Which keyword extends an interface?
  options:
    - "`implements`"
    - "`inherits`"
    - "`extends`"
    - "`:`"
  correctIndex: 2
  explanation: "`interface B extends A { ... }` copies A's members into B, optionally adding more."
- id: q6
  question: Which is a valid index signature?
  options:
    - "`index: number` on an interface"
    - "`string -> number` on an interface"
    - "`Map<string, number>` on an interface"
    - "`[index: string]: number` on an interface"
  correctIndex: 3
  explanation: "`[key: string]: T` declares that any string-keyed property maps to type T — useful for dynamic dictionaries."
- id: q7
  question: Which CANNOT be expressed with an `interface`?
  options:
    - A union of two primitives
    - An object shape
    - A function signature
    - A callable signature
  correctIndex: 0
  explanation: Interfaces describe shapes; unions of primitives (e.g., `string | number`) require a `type` alias.
- id: q8
  question: What does `type ID = string | number;` create?
  options:
    - An interface named ID
    - A type alias for the union of string and number
    - A class named ID
    - A runtime guard
  correctIndex: 1
  explanation: "`type` introduces an alias; here `ID` is a name for the union `string | number`."
- id: q9
  question: Two interfaces with the same name in the same file will...
  options:
    - Cause a compile error
    - Shadow each other (last wins)
    - Merge their members
    - Be ignored
  correctIndex: 2
  explanation: TS declaration merging combines same-named interfaces into one with all members.
- id: q10
  question: Which is the recommended type for an object whose keys are unknown strings but values are all `User`?
  options:
    - "`User[string]`"
    - "`Array<User>`"
    - "`Map<User, string>`"
    - "`interface UsersMap { [k: string]: User }` or `Record<string, User>` — both valid"
  correctIndex: 3
  explanation: Both an index-signature interface and `Record<string, User>` model a string-keyed dictionary of `User`; `Record` is more idiomatic.
```

