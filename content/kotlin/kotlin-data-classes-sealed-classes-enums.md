---
slug: kotlin-data-classes-sealed-classes-enums
id: kotlin-08
track: kotlin
order: 8
title: Data Classes, Sealed Classes, and Enums
description: Model data succinctly with data classes, model finite hierarchies safely with sealed classes, and represent fixed constants with enums — the trio that makes Kotlin's pattern matching shine.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=3780s
whyItMatters: Model data succinctly with data classes, model finite hierarchies safely with sealed classes, and represent fixed constants with enums — the trio that makes Kotlin's pattern matching shine.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Data Classes, Sealed Classes, and Enums

## Data Classes, Sealed Classes, and Enums

### Why It Matters

Model data succinctly with data classes, model finite hierarchies safely with sealed classes, and represent fixed constants with enums — the trio that makes Kotlin's pattern matching shine.

Model data succinctly with data classes, model finite hierarchies safely with sealed classes, and represent fixed constants with enums — the trio that makes Kotlin's pattern matching shine.

### Prerequisites

- Stage 1-7.
- Understanding of classes, inheritance, and when.

### Topics

- data class and its generated equals/hashCode/toString/copy
- Destructuring declarations with componentN
- copy() with named arguments for partial updates
- Sealed classes and interfaces (closed hierarchies)
- Sealed class exhaustiveness in when expressions
- Enum classes with properties and methods
- Enum constants with body (anonymous subclasses)
- when over sealed classes and enums (no else needed)

### Key Concepts

- A `data class` autogenerates `equals`, `hashCode`, `toString`, `copy`, and `componentN` for properties declared in the primary constructor.
- Data classes are limited: they cannot be `open` or `abstract` (you cannot subclass them); they can implement interfaces.
- Sealed classes constrain subtypes to the same file/module (Kotlin 1.5+ lifts this to same package), enabling exhaustive `when` without an `else`.
- Sealed classes are ideal for representing UI state, results (Success/Error/Loading), and ASTs.
- Enums are classes — they can have properties, methods, and implement interfaces; each constant can have its own body.

```kotlin
data class User(val name: String, val age: Int, val email: String? = null)

val alice = User("Alice", 30)
val alice30 = alice.copy(email = "alice@example.com")
println(alice)         // User(name=Alice, age=30, email=null)
println(alice30)       // User(name=Alice, age=30, email=alice@example.com)
val (name, age) = alice  // destructuring via componentN
println("$name is $age") // Alice is 30
```
Caption: Data class and copy

### Common Pitfalls

- Declaring properties outside the primary constructor in a data class — only primary-constructor properties are part of `equals`/`hashCode`/`copy`; body properties are ignored.
- Using a `data class` as a long-lived mutable entity — `copy` creates a new instance, so mutating flows look awkward; prefer `var` only if you accept the equal/hashCode churn.
- Forgetting `is` check in `when` on a sealed class — without `is`, you can't access subclass-specific properties; the compiler won't smart-cast otherwise.
- Expecting `when` over a sealed class defined in another module to be exhaustive — before Kotlin 1.5, sealed subclasses had to be in the same file; 1.5+ allows same package, but cross-module sealed hierarchies need `@JvmInline` value classes or careful design.
- Using enum constants as strings — `Enum.name` is the source-name; if you serialize, consider `@SerialName` or a custom `serialName` property to decouple wire format from refactorings.

### Real-World Applications

- Jetpack Compose's state modeling uses sealed classes (`Loading`, `Success`, `Error`) so the compiler enforces UI rendering for every state.
- Kotlin's own `Result<T>` is essentially a sealed class (Success/Failure) used in stdlib APIs.
- Square's Workflow library models screen states as sealed class hierarchies for type-safe rendering.
- AndroidX Notifier and many MVI architectures use sealed classes for one-time UI events (ShowSnackbar, Navigate, etc.).

### Interview Questions

- 1. What does a `data class` generate automatically? — `equals`, `hashCode`, `toString`, `copy`, and `componentN` for primary-constructor properties.
- 2. Why use a sealed class instead of an interface? — Sealed classes restrict subtypes to the same module/package, enabling the compiler to enforce exhaustive `when` without an `else`.
- 3. Can a data class be inherited from? — No, data classes are `final` by design; they can implement interfaces but cannot be subclassed.
- 4. What is `copy()` useful for? — Creating a new instance with one or more fields changed, preserving the rest — ideal for immutable updates in functional flows.
- 5. Can an enum have methods and properties? — Yes, enums are full classes; they can have properties, methods, implement interfaces, and each constant can override methods in its own body.

### Mini Project

Build a Result Hierarchy: A sealed class `Result<out T>` with Success, Failure, and Loading subclasses; a `when` that handles all three; a data class for errors; and an enum for error severity. Suggested approach:
  - `sealed class Result<out T>`
  - `data class Success<out T>(val value: T) : Result<T>()`
  - `data class Failure(val error: AppError, val severity: Severity) : Result<Nothing>()`
  - `data object Loading : Result<Nothing>()`
  - `enum class Severity { INFO, WARN, ERROR, FATAL }`
  - `fun <T> handle(r: Result<T>): String = when (r) { is Success -> "OK ${r.value}"; is Failure -> "Err ${r.severity}"; Loading -> "..." }`

### Exercises

1. Define `data class Point(val x: Double, val y: Double)` and verify `==` works without writing `equals`; test in a `HashSet`.
2. Use `copy()` to update one field of a `data class Task` and verify the original is unchanged.
3. Build a sealed class `Tree` with `Leaf` and `Node` subclasses; write a recursive `sum` function with exhaustive `when`.
4. Define an enum `HttpStatus` with code and message properties; iterate with `values()` and filter by code range.
5. Add a constant body to one enum value (e.g., `EARTH { override fun supportsLife() = true }`) and call it.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does a `data class` auto-generate?
9. A) Getters and setters only
10. B) Builder methods
11. C) A companion object
12. D) equals, hashCode, toString, copy, componentN (*)
13. Explanation: A `data class` generates `equals`, `hashCode`, `toString`, `copy`, and `componentN` (for destructuring) for primary-constructor properties.
14. Q2: Can you subclass a data class?
15. A) No — data classes are final (*)
16. B) Yes, with open
17. C) Only abstract data classes
18. D) Only in same file
19. Explanation: Data classes are implicitly `final`; they can implement interfaces but cannot be subclassed.
20. Q3: What does `copy(email = "x")` do on a data class?
21. A) Mutates the original
22. B) Returns a new instance with email changed, other fields preserved (*)
23. C) Throws if email is null
24. D) Calls equals
25. Explanation: `copy` produces a new instance with the specified fields replaced; the original is unchanged, enabling immutable updates.
26. Q4: What is a sealed class's main benefit?
27. A) It's faster
28. B) It's thread-safe
29. C) It enables exhaustive when without else (*)
30. D) It's serializable
31. Explanation: Sealed classes restrict subtypes to the same module/package, so the compiler can verify a `when` covers every case — no `else` required.
32. Q5: Where can a sealed class's subclasses live (Kotlin 1.5+)?
33. A) Same file only
34. B) Anywhere
35. C) Same class only
36. D) Same package (any file in same compilation unit/module) (*)
37. Explanation: Since Kotlin 1.5, sealed subclasses can live anywhere in the same package across files; the compiler still enforces exhaustiveness.
38. Q6: In `when (state)`, what lets you access subclass fields without a cast?
39. A) `is` smart-cast (*)
40. B) `as` operator
41. C) `instanceof`
42. D) `super`
43. Explanation: `is SubType` triggers smart-casting, so within that branch the compiler treats `state` as the subclass type and exposes its fields.
44. Q7: Can an enum have properties?
45. A) No
46. B) Yes, declared in the primary constructor (*)
47. C) Only constants
48. D) Only with @JvmField
49. Explanation: `enum class HttpStatus(val code: Int)` declares a property; every constant must supply a value in its declaration.
50. Q8: Can enum constants have their own method overrides?
51. A) No
52. B) Only with companion object
53. C) Yes, via anonymous subclass bodies (*)
54. D) Only in interfaces
55. Explanation: Each enum constant can have a body that overrides abstract methods declared in the enum, creating an anonymous subclass per constant.
56. Q9: What's the result of `data class User(val name: String); User("a") == User("a")`?
57. A) false
58. B) Compile error
59. C) Runtime error
60. D) true (*)
61. Explanation: Data class `equals` compares primary-constructor properties, so two instances with the same `name` are equal.
62. Q10: What is `componentN()` used for?
63. A) Destructuring declarations (*)
64. B) Composition
65. C) Component registration
66. D) Naming conventions only
67. Explanation: `componentN()` functions enable `val (a, b) = pair` syntax — destructuring — generated automatically for data classes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does a `data class` auto-generate?
  options:
    - Getters and setters only
    - Builder methods
    - A companion object
    - equals, hashCode, toString, copy, componentN
  correctIndex: 3
  explanation: A `data class` generates `equals`, `hashCode`, `toString`, `copy`, and `componentN` (for destructuring) for primary-constructor properties.
- id: q2
  question: Can you subclass a data class?
  options:
    - No — data classes are final
    - Yes, with open
    - Only abstract data classes
    - Only in same file
  correctIndex: 0
  explanation: Data classes are implicitly `final`; they can implement interfaces but cannot be subclassed.
- id: q3
  question: What does `copy(email = "x")` do on a data class?
  options:
    - Mutates the original
    - Returns a new instance with email changed, other fields preserved
    - Throws if email is null
    - Calls equals
  correctIndex: 1
  explanation: "`copy` produces a new instance with the specified fields replaced; the original is unchanged, enabling immutable updates."
- id: q4
  question: What is a sealed class's main benefit?
  options:
    - It's faster
    - It's thread-safe
    - It enables exhaustive when without else
    - It's serializable
  correctIndex: 2
  explanation: Sealed classes restrict subtypes to the same module/package, so the compiler can verify a `when` covers every case — no `else` required.
- id: q5
  question: Where can a sealed class's subclasses live (Kotlin 1.5+)?
  options:
    - Same file only
    - Anywhere
    - Same class only
    - Same package (any file in same compilation unit/module)
  correctIndex: 3
  explanation: Since Kotlin 1.5, sealed subclasses can live anywhere in the same package across files; the compiler still enforces exhaustiveness.
- id: q6
  question: In `when (state)`, what lets you access subclass fields without a cast?
  options:
    - "`is` smart-cast"
    - "`as` operator"
    - "`instanceof`"
    - "`super`"
  correctIndex: 0
  explanation: "`is SubType` triggers smart-casting, so within that branch the compiler treats `state` as the subclass type and exposes its fields."
- id: q7
  question: Can an enum have properties?
  options:
    - No
    - Yes, declared in the primary constructor
    - Only constants
    - Only with @JvmField
  correctIndex: 1
  explanation: "`enum class HttpStatus(val code: Int)` declares a property; every constant must supply a value in its declaration."
- id: q8
  question: Can enum constants have their own method overrides?
  options:
    - No
    - Only with companion object
    - Yes, via anonymous subclass bodies
    - Only in interfaces
  correctIndex: 2
  explanation: Each enum constant can have a body that overrides abstract methods declared in the enum, creating an anonymous subclass per constant.
- id: q9
  question: "What's the result of `data class User(val name: String); User(\"a\") == User(\"a\")`?"
  options:
    - "false"
    - Compile error
    - Runtime error
    - "true"
  correctIndex: 3
  explanation: Data class `equals` compares primary-constructor properties, so two instances with the same `name` are equal.
- id: q10
  question: What is `componentN()` used for?
  options:
    - Destructuring declarations
    - Composition
    - Component registration
    - Naming conventions only
  correctIndex: 0
  explanation: "`componentN()` functions enable `val (a, b) = pair` syntax — destructuring — generated automatically for data classes."
```

