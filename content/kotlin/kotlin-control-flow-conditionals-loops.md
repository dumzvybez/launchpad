---
slug: kotlin-control-flow-conditionals-loops
id: kotlin-03
track: kotlin
order: 3
title: Control Flow — Conditionals and Loops
description: "Master Kotlin's expression-oriented control flow: if-as-expression, the powerful when block, ranges, and labeled break/continue."
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=1080s
whyItMatters: "Master Kotlin's expression-oriented control flow: if-as-expression, the powerful when block, ranges, and labeled break/continue."
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master Kotlin's expression-oriented control flow: if-as-expression, the powerful when block, ranges, and labeled break/continue.

Master Kotlin's expression-oriented control flow: if-as-expression, the powerful when block, ranges, and labeled break/continue.

### Prerequisites

- Stage 1: Getting Started with Kotlin.
- Stage 2: Variables, Types, and Null Safety.

### Topics

- if as an expression (returns a value)
- when (the modern switch), with and without subject
- Ranges: .., until, downTo, step
- for loops over ranges, arrays, collections
- while and do-while
- break and continue with labels
- repeat(n) and forEach indexed
- Trailing lambda idioms (repeat, forEach)

### Key Concepts

- `if` is an expression: `val max = if (a > b) a else b` — there is no ternary `?:` operator in Kotlin.
- `when` is more powerful than Java's switch: it supports arbitrary expressions, ranges, type checks, and (with a subject) is exhaustive on sealed classes/enums.
- Ranges are first-class objects (`IntRange`); `1..10` is inclusive, `1 until 10` is half-open.
- `for` works on anything with an `iterator()` — including ranges, arrays, and custom classes that implement `operator fun iterator()`.
- Labels (`label@`) allow breaking out of nested loops or continuing an outer loop.

```kotlin
fun max(a: Int, b: Int): Int = if (a > b) a else b

fun classify(n: Int): String {
    // Multi-line if as expression — both branches must have a type
    return if (n < 0) "negative"
           else if (n == 0) "zero"
           else "positive"
}
```
Caption: if as expression

### Common Pitfalls

- Searching for a ternary operator — Kotlin has none; use `if (cond) a else b` which is an expression and works in initializers.
- Forgetting `else` in `when` used as an expression — the compiler requires the branches to be exhaustive (or an `else`), otherwise it errors with "when expression must be exhaustive".
- Confusing `..` (inclusive) with `until` (half-open) — `for (i in 0..list.size)` is an off-by-one error because `list.size` is included; use `0 until list.size` or `list.indices`.
- Using `for (i in 1..10 step 0)` — step must be non-zero; the runtime throws `IllegalArgumentException: Step must be non-zero`.
- Expecting `when` to fall through like Java's switch — Kotlin branches never fall through; each branch returns its value and only one is evaluated.

### Real-World Applications

- Android's `when` statement is used heavily in Jetpack Compose to model UI state (loading, success, error) and the compiler enforces exhaustiveness.
- Ktor's routing DSL uses `when` to dispatch HTTP methods and paths to handlers efficiently.
- Square's workflow library (used in Cash App) uses `when` over sealed classes to render different screen states safely.
- Gradle's Kotlin DSL leans on `if`-as-expression to compute build configuration declaratively.

### Interview Questions

- 1. Why is there no ternary `?:` operator in Kotlin? — Because `if` is an expression: `if (c) a else b` covers the same ground and reads more clearly.
- 2. What makes `when` more powerful than Java's switch? — It matches on ranges, types, arbitrary expressions, multiple values, and is exhaustive on sealed classes/enums when used as an expression.
- 3. What is the difference between `..` and `until`? — `..` is inclusive (`1..5` includes 5); `until` is half-open (`1 until 5` excludes 5).
- 4. How do labeled break/continue work? — A label `name@` precedes a loop and `break@name` exits the labeled loop; `continue@name` continues it.
- 5. When does the compiler enforce exhaustiveness on a `when`? — When the subject is a sealed class, enum, or nullable Boolean and the `when` is used as an expression (or annotated `@Suppress` otherwise).

### Mini Project

Build a FizzBuzz++ CLI: A program that prints 1..N withFizzBuzz rules plus extra rules (e.g., "Fizz" for multiples of 3, "Buzz" for 5, "Bazz" for 7). Use `when` with multiple conditions, ranges, and a labeled loop. Suggested approach:
  - Read N from `args.firstOrNull()?.toIntOrNull() ?: 100`
  - Loop with `for (i in 1..N)`
  - Use `when` with `i % 3 == 0 && i % 5 == 0` etc., ordered most-specific first
  - Add an outer label and `continue@loop` to skip output for excluded numbers
  - Print one line per number

### Exercises

1. Rewrite `Math.max(a, b)` using `if` as an expression and verify the bytecode is equivalent with `javap`.
2. Write a `when` that classifies an `Int` as "low" (0-10), "medium" (11-100), or "high" (101+) using ranges, then test with edge values.
3. Loop from 10 down to 1 with `downTo`, printing only even numbers using `if` and `continue`.
4. Write nested loops that print pairs (i, j); use a label to break the outer loop when i+j exceeds 5.
5. Use `repeat(5) { println("Iteration $it") }` and explain why `it` is the implicit lambda parameter.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why does Kotlin not have a ternary ?: operator?
9. A) It was forgotten
10. B) It is reserved for future use
11. C) Because if is already an expression (*)
12. D) To match Java syntax
13. Explanation: `if (cond) a else b` is an expression and serves the same role as the ternary operator, more readably.
14. Q2: Which keyword replaces Java's switch?
15. A) match
16. B) case
17. C) select
18. D) when (*)
19. Explanation: `when` is Kotlin's switch on steroids — it supports ranges, types, and is exhaustive on sealed classes.
20. Q3: What is the result of `for (i in 1..3) print(i)`?
21. A) 123 (*)
22. B) 12
23. C) 0123
24. D) 1234
25. Explanation: `..` is inclusive, so 1, 2, 3 are printed (concatenated as "123").
26. Q4: What does `1 until 5` include?
27. A) 1, 2, 3, 4, 5
28. B) 1, 2, 3, 4 (*)
29. C) 2, 3, 4
30. D) 0, 1, 2, 3, 4
31. Explanation: `until` produces a half-open range; the upper bound (5) is excluded.
32. Q5: How do you iterate from 5 down to 1?
33. A) `for (i in 5..1)`
34. B) `for (i in 1..5 reversed)`
35. C) `for (i in 5 downTo 1)` (*)
36. D) `for (i in 5 to 1)`
37. Explanation: `downTo` produces a descending inclusive range; `5..1` produces an empty range because the start is greater than the end.
38. Q6: When used as an expression, what must a `when` satisfy?
39. A) It must have at least 5 branches
40. B) It must use ranges
41. C) Nothing special
42. D) It must be exhaustive or have an `else` (*)
43. Explanation: A `when` expression requires either all cases covered (sealed/enum) or an `else` branch so every path returns a value.
44. Q7: What does `break@outer` do?
45. A) Breaks the loop labeled `outer` (*)
46. B) Breaks the current loop and prints "outer"
47. C) Skips to the outer function
48. D) Throws an exception
49. Explanation: Labels (`outer@`) precede a loop and `break@outer` exits that labeled loop, useful for nested loops.
50. Q8: Which is a valid `when` branch matching a range?
51. A) `case 1..10:`
52. B) `in 1..10 ->` (*)
53. C) `range 1-10 ->`
54. D) `match 1..10:`
55. Explanation: Use `in 1..10 ->` to match a value within an inclusive range; `!in` matches the complement.
56. Q9: What does `repeat(3) { print("x") }` print?
57. A) xx
58. B) x
59. C) xxx (*)
60. D) Nothing
61. Explanation: `repeat(n)` runs the lambda n times, so three `x` characters are printed.
62. Q10: What happens if a `when` is used as an expression on an enum but a case is missing?
63. A) Compiles and returns null
64. B) Throws at runtime
65. C) Falls through to default
66. D) Compile error: when must be exhaustive (*)
67. Explanation: Kotlin enforces exhaustiveness at compile time for `when` expressions over enums and sealed classes — missing cases are a compile error.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "Why does Kotlin not have a ternary ?: operator?"
  options:
    - It was forgotten
    - It is reserved for future use
    - Because if is already an expression
    - To match Java syntax
  correctIndex: 2
  explanation: "`if (cond) a else b` is an expression and serves the same role as the ternary operator, more readably."
- id: q2
  question: Which keyword replaces Java's switch?
  options:
    - match
    - case
    - select
    - when
  correctIndex: 3
  explanation: "`when` is Kotlin's switch on steroids — it supports ranges, types, and is exhaustive on sealed classes."
- id: q3
  question: What is the result of `for (i in 1..3) print(i)`?
  options:
    - "123"
    - "12"
    - "0123"
    - "1234"
  correctIndex: 0
  explanation: '`..` is inclusive, so 1, 2, 3 are printed (concatenated as "123").'
- id: q4
  question: What does `1 until 5` include?
  options:
    - 1, 2, 3, 4, 5
    - 1, 2, 3, 4
    - 2, 3, 4
    - 0, 1, 2, 3, 4
  correctIndex: 1
  explanation: "`until` produces a half-open range; the upper bound (5) is excluded."
- id: q5
  question: How do you iterate from 5 down to 1?
  options:
    - "`for (i in 5..1)`"
    - "`for (i in 1..5 reversed)`"
    - "`for (i in 5 downTo 1)`"
    - "`for (i in 5 to 1)`"
  correctIndex: 2
  explanation: "`downTo` produces a descending inclusive range; `5..1` produces an empty range because the start is greater than the end."
- id: q6
  question: When used as an expression, what must a `when` satisfy?
  options:
    - It must have at least 5 branches
    - It must use ranges
    - Nothing special
    - It must be exhaustive or have an `else`
  correctIndex: 3
  explanation: A `when` expression requires either all cases covered (sealed/enum) or an `else` branch so every path returns a value.
- id: q7
  question: What does `break@outer` do?
  options:
    - Breaks the loop labeled `outer`
    - Breaks the current loop and prints "outer"
    - Skips to the outer function
    - Throws an exception
  correctIndex: 0
  explanation: Labels (`outer@`) precede a loop and `break@outer` exits that labeled loop, useful for nested loops.
- id: q8
  question: Which is a valid `when` branch matching a range?
  options:
    - "`case 1..10:`"
    - "`in 1..10 ->`"
    - "`range 1-10 ->`"
    - "`match 1..10:`"
  correctIndex: 1
  explanation: Use `in 1..10 ->` to match a value within an inclusive range; `!in` matches the complement.
- id: q9
  question: What does `repeat(3) { print("x") }` print?
  options:
    - xx
    - x
    - xxx
    - Nothing
  correctIndex: 2
  explanation: "`repeat(n)` runs the lambda n times, so three `x` characters are printed."
- id: q10
  question: What happens if a `when` is used as an expression on an enum but a case is missing?
  options:
    - Compiles and returns null
    - Throws at runtime
    - Falls through to default
    - "Compile error: when must be exhaustive"
  correctIndex: 3
  explanation: Kotlin enforces exhaustiveness at compile time for `when` expressions over enums and sealed classes — missing cases are a compile error.
```

