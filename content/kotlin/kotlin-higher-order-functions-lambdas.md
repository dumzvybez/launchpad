---
slug: kotlin-higher-order-functions-lambdas
id: kotlin-12
track: kotlin
order: 12
title: Higher-Order Functions and Lambdas
description: Treat functions as values with function types, lambdas, and trailing-lambda syntax — the foundation for Kotlin's expressive collection APIs and DSLs.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=5940s
whyItMatters: Treat functions as values with function types, lambdas, and trailing-lambda syntax — the foundation for Kotlin's expressive collection APIs and DSLs.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Higher-Order Functions and Lambdas

## Higher-Order Functions and Lambdas

### Why It Matters

Treat functions as values with function types, lambdas, and trailing-lambda syntax — the foundation for Kotlin's expressive collection APIs and DSLs.

Treat functions as values with function types, lambdas, and trailing-lambda syntax — the foundation for Kotlin's expressive collection APIs and DSLs.

### Prerequisites

- Stage 1-11.
- Solid grasp of functions and collections.

### Topics

- Function types: `(Int, String) -> Boolean`
- Lambdas: `{ x, y -> x + y }`
- The implicit `it` parameter
- Trailing lambda syntax
- Function references: `::println`, `String::length`
- Bound references: `obj::method`
- Higher-order functions taking/returning functions
- Inline closures preview (full detail in Stage 13)

### Key Concepts

- A function type `(A, B) -> C` is a first-class type — you can pass it, store it, return it.
- A lambda is `{ params -> body }`; the last expression is the return value.
- If a lambda has one parameter, you can omit it and use the implicit name `it`.
- If the last parameter of a function is a function type, you can write the lambda outside the parentheses: `list.filter { it > 0 }`.
- `::` creates a function reference — `String::length` is `(String) -> Int`; `obj::method` is a bound reference capturing the receiver.

```kotlin
// Function type as a parameter
fun applyTwice(f: (Int) -> Int, x: Int): Int = f(f(x))

val result = applyTwice({ it * 2 }, 3)   // 12
val result2 = applyTwice({ n -> n * n }, 3)  // 81
```
Caption: Function types and lambdas

### Common Pitfalls

- Capturing a mutable variable in a lambda — the lambda captures the variable (not the value), so changes after creation are visible; this can surprise you in loops (use a local `val` snapshot).
- Forgetting the trailing-lambda syntax convention — `list.filter({ it > 0 })` works but is un-idiomatic; Kotlin idiom is `list.filter { it > 0 }`.
- Confusing `it` across nested lambdas — the inner `it` shadows the outer; rename parameters explicitly when nesting to avoid bugs.
- Expecting `return` inside a lambda to exit the enclosing function — by default `return` returns from the lambda; use labeled returns (`return@forEach`) or `forEach` carefully.
- Using non-inline lambdas in hot loops — non-inline lambdas allocate a function object per call; mark the higher-order function `inline` (Stage 13) to avoid allocation.

### Real-World Applications

- Kotlin's `let`, `apply`, `run`, `also`, `with` are all higher-order functions in stdlib; ubiquitous in idiomatic Kotlin.
- Jetpack Compose is built on trailing-lambda DSL: `Column { Text("Hi"); Button(onClick = { ... }) { Text("Click") } }`.
- Ktor's routing DSL: `routing { get("/") { call.respondText("Hi") } }` uses trailing lambdas everywhere.
- Gradle Kotlin DSL uses lambdas with receivers heavily: `dependencies { implementation("...") }`.

### Interview Questions

- 1. What is the type of `{ x: Int, y: Int -> x + y }`? — `(Int, Int) -> Int`; a function type is denoted with `->` and parenthesized parameter list.
- 2. What is trailing-lambda syntax and when does it apply? — If the last parameter of a function is a function type, you can move the lambda outside the parens: `f(1) { ... }` instead of `f(1, { ... })`.
- 3. What is the implicit `it` parameter? — A single-parameter lambda can omit the parameter declaration; the parameter is automatically named `it`.
- 4. Difference between `::function` and `obj::method`? — `::function` is an unbound reference (function value); `obj::method` is a bound reference that captures the receiver.
- 5. Does a lambda capture variables by value or by reference? — By reference — changes to a captured `var` after the lambda is created are visible; this is a common source of bugs in loops.

### Mini Project

Build a Tiny DSL for HTML: A function `html { head { title("Hi") }; body { p("Hello") } }` that builds a string of HTML using lambdas with receivers (preview of Stage 13 DSLs). Suggested approach:
  - `class HtmlBuilder { val parts = mutableListOf<String>(); fun p(text: String) { parts.add("<p>$text</p>") } }`
  - `fun html(init: HtmlBuilder.() -> Unit): String { val b = HtmlBuilder(); b.init(); return b.parts.joinToString("") }`
  - Add `head`, `body`, `title` methods
  - Call `html { body { p("Hello") } }` and verify the output string
  - Note how the lambda runs "inside" HtmlBuilder, giving access to its methods directly

### Exercises

1. Write `fun compose(f: (Int) -> Int, g: (Int) -> Int): (Int) -> Int = { f(g(it)) }` and test `compose({ it * 2 }, { it + 1 })(3)`.
2. Use trailing-lambda syntax with `repeat(3) { println("hi") }` and explain where `it` would come from.
3. Convert `nums.filter { it > 0 }` to use a function reference by defining `fun isPositive(x: Int) = x > 0` and `nums.filter(::isPositive)`.
4. Capture a `var counter = 0` in a lambda and call the lambda twice; observe how `counter` changes.
5. Write a labeled return: `listOf(1,2,3).forEach { if (it == 2) return@forEach; println(it) }` and explain what's printed.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the type of `(Int, String) -> Boolean`?
9. A) A pair
10. B) A tuple
11. C) A class
12. D) A function type taking Int and String, returning Boolean (*)
13. Explanation: `(Int, String) -> Boolean` is a function type — it can be passed, stored, and invoked like any other value.
14. Q2: What does `it` refer to in a single-parameter lambda?
15. A) The implicit single parameter (*)
16. B) The class instance
17. C) A loop variable
18. D) An error variable
19. Explanation: If a lambda has exactly one parameter, you can omit the declaration; the parameter is automatically named `it`.
20. Q3: When can you use trailing-lambda syntax?
21. A) Always
22. B) When the last parameter is a function type (*)
23. C) Only with inline functions
24. D) Only with collections
25. Explanation: If the function's last parameter is a function type, the lambda can be moved outside the parentheses: `f(1) { ... }`.
26. Q4: What does `String::length` produce?
27. A) An Int
28. B) A string
29. C) A function reference of type `(String) -> Int` (*)
30. D) A class
31. Explanation: `String::length` is an unbound function reference; you call it with a String argument to get its length.
32. Q5: What is a bound function reference?
33. A) `::function`
34. B) A static method
35. C) A lambda
36. D) `obj::method` — captures the receiver (*)
37. Explanation: `obj::method` is a bound reference — the receiver `obj` is captured, so the resulting function takes only the remaining parameters.
38. Q6: What does a lambda capture — value or reference?
39. A) Reference — changes to a captured var are visible (*)
40. B) Value
41. C) Nothing
42. D) Only final values
43. Explanation: Kotlin lambdas capture variables by reference (closures), so changes to a `var` after the lambda is created are visible when the lambda runs.
44. Q7: What does `return` inside a lambda do by default?
45. A) Returns from the enclosing function
46. B) Returns from the lambda only (unless labeled) (*)
47. C) Throws an exception
48. D) Continues the loop
49. Explanation: A bare `return` inside a lambda returns from the enclosing function — but inside inline lambdas like `forEach`, you typically use `return@forEach` to skip an iteration.
50. Q8: Which is the idiomatic way to write `list.filter({ it > 0 })`?
51. A) `list.filter({ it > 0 })`
52. B) `list.filter({ it > 0 })`
53. C) `list.filter { it > 0 }` (*)
54. D) `list.filter() { it > 0 }`
55. Explanation: Trailing-lambda syntax moves the lambda outside the parens; if it's the only parameter, you can drop the parens entirely.
56. Q9: What does `fun multiplier(factor: Int): (Int) -> Int = { it * factor }` return?
57. A) An Int
58. B) A class
59. C) A constant
60. D) A function that multiplies by factor (*)
61. Explanation: The function returns a function value (closure) capturing `factor`; calling `multiplier(2)` returns a function that doubles its input.
62. Q10: Which stdlib function is a higher-order function?
63. A) `let`, `apply`, `run`, `also` (*)
64. B) `print`
65. C) `if`
66. D) `class`
67. Explanation: `let`, `run`, `with`, `apply`, `also` are all higher-order functions in the Kotlin stdlib — they take a function (lambda) as a parameter.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the type of `(Int, String) -> Boolean`?
  options:
    - A pair
    - A tuple
    - A class
    - A function type taking Int and String, returning Boolean
  correctIndex: 3
  explanation: "`(Int, String) -> Boolean` is a function type — it can be passed, stored, and invoked like any other value."
- id: q2
  question: What does `it` refer to in a single-parameter lambda?
  options:
    - The implicit single parameter
    - The class instance
    - A loop variable
    - An error variable
  correctIndex: 0
  explanation: If a lambda has exactly one parameter, you can omit the declaration; the parameter is automatically named `it`.
- id: q3
  question: When can you use trailing-lambda syntax?
  options:
    - Always
    - When the last parameter is a function type
    - Only with inline functions
    - Only with collections
  correctIndex: 1
  explanation: "If the function's last parameter is a function type, the lambda can be moved outside the parentheses: `f(1) { ... }`."
- id: q4
  question: What does `String::length` produce?
  options:
    - An Int
    - A string
    - A function reference of type `(String) -> Int`
    - A class
  correctIndex: 2
  explanation: "`String::length` is an unbound function reference; you call it with a String argument to get its length."
- id: q5
  question: What is a bound function reference?
  options:
    - "`::function`"
    - A static method
    - A lambda
    - "`obj::method` — captures the receiver"
  correctIndex: 3
  explanation: "`obj::method` is a bound reference — the receiver `obj` is captured, so the resulting function takes only the remaining parameters."
- id: q6
  question: What does a lambda capture — value or reference?
  options:
    - Reference — changes to a captured var are visible
    - Value
    - Nothing
    - Only final values
  correctIndex: 0
  explanation: Kotlin lambdas capture variables by reference (closures), so changes to a `var` after the lambda is created are visible when the lambda runs.
- id: q7
  question: What does `return` inside a lambda do by default?
  options:
    - Returns from the enclosing function
    - Returns from the lambda only (unless labeled)
    - Throws an exception
    - Continues the loop
  correctIndex: 1
  explanation: A bare `return` inside a lambda returns from the enclosing function — but inside inline lambdas like `forEach`, you typically use `return@forEach` to skip an iteration.
- id: q8
  question: Which is the idiomatic way to write `list.filter({ it > 0 })`?
  options:
    - "`list.filter({ it > 0 })`"
    - "`list.filter({ it > 0 })`"
    - "`list.filter { it > 0 }`"
    - "`list.filter() { it > 0 }`"
  correctIndex: 2
  explanation: Trailing-lambda syntax moves the lambda outside the parens; if it's the only parameter, you can drop the parens entirely.
- id: q9
  question: "What does `fun multiplier(factor: Int): (Int) -> Int = { it * factor }` return?"
  options:
    - An Int
    - A class
    - A constant
    - A function that multiplies by factor
  correctIndex: 3
  explanation: The function returns a function value (closure) capturing `factor`; calling `multiplier(2)` returns a function that doubles its input.
- id: q10
  question: Which stdlib function is a higher-order function?
  options:
    - "`let`, `apply`, `run`, `also`"
    - "`print`"
    - "`if`"
    - "`class`"
  correctIndex: 0
  explanation: "`let`, `run`, `with`, `apply`, `also` are all higher-order functions in the Kotlin stdlib — they take a function (lambda) as a parameter."
```

