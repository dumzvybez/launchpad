---
slug: kotlin-variables-types-null-safety
id: kotlin-02
track: kotlin
order: 2
title: Variables, Types, and Null Safety
description: "Declare variables with val and var, lean on type inference, and master Kotlin's flagship feature: compile-time null safety with the ?, ?., ?:, and !! operators."
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=540s
whyItMatters: "Declare variables with val and var, lean on type inference, and master Kotlin's flagship feature: compile-time null safety with the ?, ?. , ?:, and !! operators."
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Variables, Types, and Null Safety

## Variables, Types, and Null Safety

### Why It Matters

Declare variables with val and var, lean on type inference, and master Kotlin's flagship feature: compile-time null safety with the ?, ?. , ?:, and !! operators.

Declare variables with val and var, lean on type inference, and master Kotlin's flagship feature: compile-time null safety with the ?, ?., ?:, and !! operators.

### Prerequisites

- Stage 1: Getting Started with Kotlin.
- Comfort compiling and running a small Kotlin program.

### Topics

- val (immutable reference) vs var (mutable)
- Type inference and explicit type annotations
- Nullable types (String?) and non-nullable types (String)
- Safe call ?., Elvis ?:, non-null assertion !!
- let for null-guarded blocks
- Smart casts after null checks
- Platform types (String!) from Java interop
- Primitive types and their Kotlin wrappers (Int, Long, Double, Boolean)

### Key Concepts

- Nullability is part of the type system: `String` cannot hold null, `String?` can — the compiler rejects `null` for non-null types at compile time.
- `val` makes the reference immutable but the object it points to may still be mutable (e.g., a `val list = mutableListOf(...)`).
- `==` calls `equals()` (structural equality); `===` is referential identity — opposite of Java's defaults.
- Platform types (`String!`) appear when Kotlin calls Java code whose nullability is unknown; the compiler relaxes null checks but you risk NPEs at runtime.
- Smart casts let you skip explicit casts after `is` checks or null checks; they do not work on `var` properties because the value could change between the check and the use.

```kotlin
val name = "Alice"      // String, immutable reference
var count = 0           // Int, mutable
// name = "Bob"         // compile error: val cannot be reassigned
count = 1               // ok

val explicit: Double = 3.14
val list = mutableListOf(1, 2, 3)  // val reference, mutable contents
list.add(4)             // ok — list contents can change
```
Caption: val and var, with type inference

### Common Pitfalls

- Treating `val` as deep immutability — `val list = mutableListOf(1,2,3)` is a read-only reference to a mutable list; use `listOf` for an immutable snapshot.
- Using `!!` as a routine null check — `!!` is an assertion that throws NPE; it should be reserved for cases where the type system can't express your invariant (e.g., lateinit fields, Java interop).
- Forgetting that platform types from Java have no null safety — annotate Java APIs with `@Nullable`/`@NotNull` (JetBrains or javax.annotation) or wrap returns in `?:` defaults.
- Expecting smart casts on `var` properties — `if (x is String) x.length` works for local `val`s but not for mutable `var` properties of the same class because another thread could change `x`.
- Confusing `==` with `===` — `==` calls `equals()` (structural); `===` compares identity. For strings, `"a" == "a"` is true even if they're different instances.

### Real-World Applications

- Trello's Android rewrite credited Kotlin's null safety with cutting NullPointerException crashes by around 70% in production.
- Square's Cash App uses Kotlin throughout its Android codebase; null-safety annotations flow from their Java libraries via the Kotlin compiler.
- Coursera's Android app migrated to Kotlin and reported a measurable drop in null-related crash reports during the first quarter.
- Slack's Android team uses Kotlin exclusively for new features and leans on nullable types to model "user profile may be missing" without Optional wrappers.

### Interview Questions

- 1. Difference between val and var? — `val` is a read-only (final) reference; `var` is reassignable. Neither implies deep immutability of the referenced object.
- 2. What is a platform type and why does it exist? — A type from Java with unknown nullability (printed `String!`); Kotlin relaxes null checks to allow interop but you can still get an NPE at runtime.
- 3. What does the Elvis operator ?: do? — Returns the left operand if non-null, otherwise the right operand; `name ?: "Guest"` yields "Guest" when name is null.
- 4. Explain smart casts and one case where they fail. — After `is` or null checks, the compiler narrows the type without an explicit cast; smart casts fail on `var` properties, mutable locals captured in lambdas, and across module boundaries for `internal`/`public` members.
- 5. What is the difference between == and === in Kotlin? — `==` calls `equals()` (structural equality, null-safe); `===` is referential identity — the opposite default from Java.

### Mini Project

Build a User Profile Formatter: Read a User object with nullable fields (email, phone, nickname) and produce a display string that gracefully handles missing data. Demonstrate safe calls, Elvis defaults, and let blocks. Suggested approach:
  - Define `data class User(val nickname: String?, val email: String?, val phone: String?)`
  - Use `email?.lowercase()` to lowercase only when present
  - Use `?: "no email on file"` for display defaults
  - Use `nickname?.let { "Hi, $it" } ?: "Hi, guest"` for conditional greeting
  - Print the formatted card and assert that null fields render their fallback text

### Exercises

1. Declare one `val` and one `var` of each common type (String, Int, Double, Boolean) and try to reassign them; note which assignment the compiler rejects.
2. Write a function `fun firstChar(s: String?): Char? = s?.firstOrNull()` and call it with null, "", and "Kotlin".
3. Demonstrate the platform type trap: call a small Java method that returns null where Kotlin expects non-null, and observe the NPE.
4. Write a function `fun safeLength(s: String?): Int = s?.length ?: 0` three ways: with `?:`, with `if`, and with `let`; compare readability.
5. Write a snippet that proves `"Kotlin" === "Kotlin"` may be true or false (string interning) and explain why you should always use `==`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which keyword declares an immutable reference?
9. A) var
10. B) val (*)
11. C) const
12. D) final
13. Explanation: `val` (value) is read-only after first assignment; `var` (variable) is reassignable.
14. Q2: What is the type of `name` in `val name: String? = null`?
15. A) String
16. B) Any
17. C) String? (nullable) (*)
18. D) Nothing
19. Explanation: The `?` suffix marks the type as nullable, meaning the variable may hold null at runtime.
20. Q3: What does `name?.length` evaluate to when `name` is null?
21. A) 0
22. B) Throws NullPointerException
23. C) -1
24. D) null (*)
25. Explanation: The safe-call operator `?.` short-circuits to null when the receiver is null, so no method is invoked.
26. Q4: What does the Elvis operator `?:` do?
27. A) Returns the left side if non-null, else the right side (*)
28. B) Compares two values
29. C) Throws if both sides are null
30. D) Concatenates two strings
31. Explanation: `a ?: b` yields `a` when `a` is not null, otherwise `b` — named for its resemblance to Elvis's hair.
32. Q5: What does `name!!` do?
33. A) Converts to a non-null type safely
34. B) Asserts non-null and throws NPE if it is null (*)
35. C) Returns null if name is null
36. D) Is the same as `name?.toString()`
37. Explanation: `!!` is the non-null assertion operator; it throws `NullPointerException` at runtime if the value is null.
38. Q6: Which is true about `==` in Kotlin?
39. A) It compares identity (like Java's ==)
40. B) It only works on primitives
41. C) It calls equals() and is null-safe (*)
42. D) It cannot be overloaded
43. Explanation: Kotlin's `==` translates to `a?.equals(b) ?: (b === null)`, providing null-safe structural equality.
44. Q7: What is a platform type (e.g., `String!`)?
45. A) A type from Kotlin/JS
46. B) A deprecated Kotlin type
47. C) A type alias for Any
48. D) A type from Java with unknown nullability (*)
49. Explanation: When Kotlin calls Java code, the nullability is unknown, so the type is "platform" — relaxation rules apply and NPEs are possible at runtime.
50. Q8: Smart casts after `if (x is String)` work for which?
51. A) Local val properties and immutable values (*)
52. B) Any variable, always
53. C) Only var properties
54. D) Only when explicitly cast with as
55. Explanation: Smart casts work for local `val`s and `val` properties but not for `var` properties (mutable) because the value could change between check and use.
56. Q9: What is the result of `val list = mutableListOf(1,2,3); list.add(4)`?
57. A) Compile error — list is val
58. B) Compiles and mutates the list contents (*)
59. C) Throws at runtime
60. D) Creates a new list
61. Explanation: `val` makes the reference read-only, but the list itself is mutable, so `add` works.
62. Q10: What is the recommended replacement for `if (x != null) use(x)`?
63. A) x!!use(x)
64. B) if (x is Any) use(x)
65. C) x?.let { use(it) } (*)
66. D) use(x as Any)
67. Explanation: `x?.let { use(it) }` runs `use` only when `x` is non-null, and inside the lambda `it` is smart-cast to non-null.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which keyword declares an immutable reference?
  options:
    - var
    - val
    - const
    - final
  correctIndex: 1
  explanation: "`val` (value) is read-only after first assignment; `var` (variable) is reassignable."
- id: q2
  question: "What is the type of `name` in `val name: String? = null`?"
  options:
    - String
    - Any
    - String? (nullable)
    - Nothing
  correctIndex: 2
  explanation: The `?` suffix marks the type as nullable, meaning the variable may hold null at runtime.
- id: q3
  question: What does `name?.length` evaluate to when `name` is null?
  options:
    - "0"
    - Throws NullPointerException
    - "-1"
    - "null"
  correctIndex: 3
  explanation: The safe-call operator `?.` short-circuits to null when the receiver is null, so no method is invoked.
- id: q4
  question: What does the Elvis operator `?:` do?
  options:
    - Returns the left side if non-null, else the right side
    - Compares two values
    - Throws if both sides are null
    - Concatenates two strings
  correctIndex: 0
  explanation: "`a ?: b` yields `a` when `a` is not null, otherwise `b` — named for its resemblance to Elvis's hair."
- id: q5
  question: What does `name!!` do?
  options:
    - Converts to a non-null type safely
    - Asserts non-null and throws NPE if it is null
    - Returns null if name is null
    - Is the same as `name?.toString()`
  correctIndex: 1
  explanation: "`!!` is the non-null assertion operator; it throws `NullPointerException` at runtime if the value is null."
- id: q6
  question: Which is true about `==` in Kotlin?
  options:
    - It compares identity (like Java's ==)
    - It only works on primitives
    - It calls equals() and is null-safe
    - It cannot be overloaded
  correctIndex: 2
  explanation: "Kotlin's `==` translates to `a?.equals(b) ?: (b === null)`, providing null-safe structural equality."
- id: q7
  question: What is a platform type (e.g., `String!`)?
  options:
    - A type from Kotlin/JS
    - A deprecated Kotlin type
    - A type alias for Any
    - A type from Java with unknown nullability
  correctIndex: 3
  explanation: When Kotlin calls Java code, the nullability is unknown, so the type is "platform" — relaxation rules apply and NPEs are possible at runtime.
- id: q8
  question: Smart casts after `if (x is String)` work for which?
  options:
    - Local val properties and immutable values
    - Any variable, always
    - Only var properties
    - Only when explicitly cast with as
  correctIndex: 0
  explanation: Smart casts work for local `val`s and `val` properties but not for `var` properties (mutable) because the value could change between check and use.
- id: q9
  question: What is the result of `val list = mutableListOf(1,2,3); list.add(4)`?
  options:
    - Compile error — list is val
    - Compiles and mutates the list contents
    - Throws at runtime
    - Creates a new list
  correctIndex: 1
  explanation: "`val` makes the reference read-only, but the list itself is mutable, so `add` works."
- id: q10
  question: What is the recommended replacement for `if (x != null) use(x)`?
  options:
    - x!!use(x)
    - if (x is Any) use(x)
    - x?.let { use(it) }
    - use(x as Any)
  correctIndex: 2
  explanation: "`x?.let { use(it) }` runs `use` only when `x` is non-null, and inside the lambda `it` is smart-cast to non-null."
```

