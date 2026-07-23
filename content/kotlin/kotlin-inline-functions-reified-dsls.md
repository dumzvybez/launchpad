---
slug: kotlin-inline-functions-reified-dsls
id: kotlin-13
track: kotlin
order: 13
title: Inline Functions, reified, and DSLs
description: Use `inline` to eliminate lambda allocation overhead, `reified` to recover erased generic types at runtime, and lambdas-with-receivers to build type-safe DSLs.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=6480s
whyItMatters: Use `inline` to eliminate lambda allocation overhead, `reified` to recover erased generic types at runtime, and lambdas-with-receivers to build type-safe DSLs.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Inline Functions, reified, and DSLs

## Inline Functions, reified, and DSLs

### Why It Matters

Use `inline` to eliminate lambda allocation overhead, `reified` to recover erased generic types at runtime, and lambdas-with-receivers to build type-safe DSLs.

Use `inline` to eliminate lambda allocation overhead, `reified` to recover erased generic types at runtime, and lambdas-with-receivers to build type-safe DSLs.

### Prerequisites

- Stage 1-12.
- Solid grasp of higher-order functions and lambdas.

### Topics

- The `inline` keyword and bytecode inlining
- `noinline` to opt out of inlining
- `crossinline` for non-local returns in nested contexts
- `reified` type parameters with `inline`
- Reflection-free runtime type checks (`T::class`, `is T`)
- Lambdas with receiver: `A.() -> B`
- DSL construction with receivers
- `@DslMarker` to prevent scope pollution

### Key Concepts

- `inline fun` copies the function body (and lambdas) into the call site, eliminating function-object allocation — critical for hot loops and stdlib collection ops.
- `inline` is required for `reified` — the type parameter is inlined at the call site, so it survives erasure.
- `noinline` exempts a specific lambda from inlining (when you need a real function value); `crossinline` forbids non-local returns (for lambdas called in nested contexts).
- A lambda with receiver `A.() -> B` runs "inside" an `A` instance, giving direct access to `A`'s members — the foundation of DSLs.
- `@DslMarker` annotates an annotation class; marking DSL builders with it prevents implicit access to outer receivers (no more "which `add` am I calling?").

```kotlin
inline fun <reified T> Any?.castOrNull(): T? = this as? T

val s: String? = "hello".castOrNull<String>()   // works — T is reified
val i: Int? = "hello".castOrNull<Int>()         // null — type mismatch

inline fun <reified T> loadService(): T =
    serviceLocator.get(T::class)   // T::class is accessible!
```
Caption: inline + reified

### Common Pitfalls

- Marking a function `inline` only for performance without measuring — `inline` grows bytecode; for small hot functions it's a win, for large functions it bloats the JAR.
- Using non-local returns unintentionally — an inline lambda lets `return` exit the enclosing function, which can surprise you (e.g., in `forEach`); use `crossinline` to forbid.
- Forgetting `inline` when using `reified` — `reified` requires `inline`; the compiler error is clear but easy to misread.
- Exposing `inline` functions across module boundaries with private members — inline functions can't access private members of classes in other modules; make them `internal` or `public`.
- DSL scope pollution without `@DslMarker` — without it, nested builders can call methods from any enclosing receiver, leading to confusing call resolution; always mark DSL builders with a shared `@DslMarker`.

### Real-World Applications

- Kotlin stdlib's `let`, `run`, `with`, `apply`, `also`, `forEach`, `repeat`, `map`, `filter` are all `inline` to avoid allocation in hot paths.
- `kotlinx.coroutines` uses `inline` heavily on `launch`, `async`, `Flow.collect` for zero-overhead suspension.
- Gradle Kotlin DSL uses lambdas with receivers for `dependencies { }`, `android { }`, `repositories { }` — the entire build script is a DSL.
- Anko, Ktor's HTML DSL, and Compose's `@Composable` all use lambdas with receivers for tree construction.

### Interview Questions

- 1. What does `inline fun` do at the bytecode level? — Copies the function body (and any non-noinline lambdas) into each call site, eliminating function-object allocation and enabling non-local returns.
- 2. Why is `reified` only allowed on `inline` functions? — Because the type parameter is inlined at the call site (concretely known), so it survives type erasure and can be checked at runtime.
- 3. What is a lambda with receiver? — A lambda of type `A.() -> B` that runs inside an `A` instance, with direct access to `A`'s members via `this` — the foundation of DSLs.
- 4. What is `@DslMarker` for? — An annotation on an annotation class that, when applied to DSL builders, prevents implicit access to outer receivers — eliminating "which add() am I calling?" ambiguity.
- 5. Difference between `noinline` and `crossinline`? — `noinline` exempts a lambda from being inlined (stores it as a value); `crossinline` allows inlining but forbids non-local returns (for lambdas called in nested contexts).

### Mini Project

Build a SQL Query DSL: A type-safe DSL that builds `SELECT ... FROM ... WHERE ...` strings using lambdas with receivers and `@DslMarker` for safety. Suggested approach:
  - `@DslMarker annotation class SqlDsl`
  - `@SqlDsl class Query { val selects = mutableListOf<String>(); fun select(col: String) { selects.add(col) } }`
  - `fun query(init: Query.() -> Unit): String { val q = Query(); q.init(); return "SELECT ${q.selects.joinToString()}" }`
  - Add `from(table)`, `where(condition)` methods
  - Demonstrate `query { select("id"); from("users"); where("age > 18") }` returning a SQL string

### Exercises

1. Mark a small `inline fun twice(f: () -> Unit) { f(); f() }` and inspect with `javap` that no function object is allocated.
2. Write `inline fun <reified T> isA(x: Any): Boolean = x is T` and call `isA<String>("hi")`.
3. Add `noinline` to one lambda and `crossinline` to another in a function that stores one in a `Runnable`.
4. Build a tiny `html { body { p("hi") } }` DSL with `@DslMarker` and try to call an outer method from an inner block — observe the compile error.
5. Write an `inline fun measureTime(block: () -> Unit): Long` that times the block and returns nanos; verify no allocation overhead in a tight loop.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `inline fun` do?
9. A) Copies the function body and lambdas into the call site, avoiding allocation (*)
10. B) Makes the function faster
11. C) Makes it private
12. D) Adds caching
13. Explanation: `inline` causes the compiler to inline the function body (and any non-noinline lambdas) at each call site, eliminating function-object allocation.
14. Q2: What does `reified` enable?
15. A) Faster generics
16. B) Access to the generic type at runtime (T::class, is T) (*)
17. C) Mutable generics
18. D) Sealed generics
19. Explanation: `reified` (only on `inline fun`) makes the type parameter available at runtime by inlining the concrete type at each call site, surviving type erasure.
20. Q3: Why must `reified` functions be `inline`?
21. A) Convention
22. B) For thread safety
23. C) Because inlining materializes the concrete type at the call site, defeating erasure (*)
24. D) To prevent name conflicts
25. Explanation: At the call site, the compiler knows the concrete `T` and inlines it; without inlining, the type would be erased and unavailable at runtime.
26. Q4: What is a lambda with receiver?
27. A) A lambda that receives an email
28. B) A lambda that takes two receivers
29. C) A deprecated feature
30. D) A lambda of type `A.() -> B` that runs inside an A instance (*)
31. Explanation: `A.() -> B` is a function type where the receiver is `A`; inside the lambda you can call `A`'s members directly via `this`.
32. Q5: What does `noinline` do?
33. A) Exempts a specific lambda from being inlined (stored as a value) (*)
34. B) Forces inlining
35. C) Marks a function as private
36. D) Adds caching
37. Explanation: `noinline` on a function-typed parameter tells the compiler NOT to inline that lambda — it's stored as a real function object.
38. Q6: What does `crossinline` do?
39. A) Allows non-local returns
40. B) Forbids non-local returns for lambdas called in nested contexts (*)
41. C) Forces inlining
42. D) Marks a function as deprecated
43. Explanation: `crossinline` allows the lambda to be inlined but forbids non-local returns — needed when the lambda is called from another lambda or Runnable.
44. Q7: What is `@DslMarker` for?
45. A) Performance
46. B) Marking deprecated code
47. C) Preventing DSL scope pollution (ambiguous outer-receiver calls) (*)
48. D) Adding runtime checks
49. Explanation: `@DslMarker` annotates an annotation class; when applied to DSL builders, it tells the compiler to reject implicit access to outer receivers, eliminating ambiguity.
50. Q8: Can an `inline fun` access private members of a class in another module?
51. A) Yes
52. B) Only with @JvmStatic
53. C) Only with @PublishedApi
54. D) No — make them internal or public (*)
55. Explanation: Inline functions can't access private members across module boundaries because the body is inlined at the call site in the other module; use `internal` or `@PublishedApi internal`.
56. Q9: Which stdlib functions are marked `inline`?
57. A) `let`, `run`, `with`, `apply`, `also`, `forEach`, `repeat` (*)
58. B) `println` only
59. C) `class`
60. D) `if`
61. Explanation: Most scope functions and collection operations (`let`, `run`, `apply`, `also`, `forEach`, `map`, `filter`) are inline to avoid allocation in hot paths.
62. Q10: What is the type of the parameter in `fun document(init: StringBuilder.() -> Unit)`?
63. A) `() -> Unit`
64. B) `StringBuilder.() -> Unit` (lambda with receiver) (*)
65. C) `(StringBuilder) -> Unit`
66. D) `Unit`
67. Explanation: `StringBuilder.() -> Unit` is a lambda with receiver — it takes no explicit parameters but runs inside a `StringBuilder` instance.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `inline fun` do?
  options:
    - Copies the function body and lambdas into the call site, avoiding allocation
    - Makes the function faster
    - Makes it private
    - Adds caching
  correctIndex: 0
  explanation: "`inline` causes the compiler to inline the function body (and any non-noinline lambdas) at each call site, eliminating function-object allocation."
- id: q2
  question: What does `reified` enable?
  options:
    - Faster generics
    - Access to the generic type at runtime (T::class, is T)
    - Mutable generics
    - Sealed generics
  correctIndex: 1
  explanation: "`reified` (only on `inline fun`) makes the type parameter available at runtime by inlining the concrete type at each call site, surviving type erasure."
- id: q3
  question: Why must `reified` functions be `inline`?
  options:
    - Convention
    - For thread safety
    - Because inlining materializes the concrete type at the call site, defeating erasure
    - To prevent name conflicts
  correctIndex: 2
  explanation: At the call site, the compiler knows the concrete `T` and inlines it; without inlining, the type would be erased and unavailable at runtime.
- id: q4
  question: What is a lambda with receiver?
  options:
    - A lambda that receives an email
    - A lambda that takes two receivers
    - A deprecated feature
    - A lambda of type `A.() -> B` that runs inside an A instance
  correctIndex: 3
  explanation: "`A.() -> B` is a function type where the receiver is `A`; inside the lambda you can call `A`'s members directly via `this`."
- id: q5
  question: What does `noinline` do?
  options:
    - Exempts a specific lambda from being inlined (stored as a value)
    - Forces inlining
    - Marks a function as private
    - Adds caching
  correctIndex: 0
  explanation: "`noinline` on a function-typed parameter tells the compiler NOT to inline that lambda — it's stored as a real function object."
- id: q6
  question: What does `crossinline` do?
  options:
    - Allows non-local returns
    - Forbids non-local returns for lambdas called in nested contexts
    - Forces inlining
    - Marks a function as deprecated
  correctIndex: 1
  explanation: "`crossinline` allows the lambda to be inlined but forbids non-local returns — needed when the lambda is called from another lambda or Runnable."
- id: q7
  question: What is `@DslMarker` for?
  options:
    - Performance
    - Marking deprecated code
    - Preventing DSL scope pollution (ambiguous outer-receiver calls)
    - Adding runtime checks
  correctIndex: 2
  explanation: "`@DslMarker` annotates an annotation class; when applied to DSL builders, it tells the compiler to reject implicit access to outer receivers, eliminating ambiguity."
- id: q8
  question: Can an `inline fun` access private members of a class in another module?
  options:
    - Yes
    - Only with @JvmStatic
    - Only with @PublishedApi
    - No — make them internal or public
  correctIndex: 3
  explanation: Inline functions can't access private members across module boundaries because the body is inlined at the call site in the other module; use `internal` or `@PublishedApi internal`.
- id: q9
  question: Which stdlib functions are marked `inline`?
  options:
    - "`let`, `run`, `with`, `apply`, `also`, `forEach`, `repeat`"
    - "`println` only"
    - "`class`"
    - "`if`"
  correctIndex: 0
  explanation: Most scope functions and collection operations (`let`, `run`, `apply`, `also`, `forEach`, `map`, `filter`) are inline to avoid allocation in hot paths.
- id: q10
  question: "What is the type of the parameter in `fun document(init: StringBuilder.() -> Unit)`?"
  options:
    - "`() -> Unit`"
    - "`StringBuilder.() -> Unit` (lambda with receiver)"
    - "`(StringBuilder) -> Unit`"
    - "`Unit`"
  correctIndex: 1
  explanation: "`StringBuilder.() -> Unit` is a lambda with receiver — it takes no explicit parameters but runs inside a `StringBuilder` instance."
```

