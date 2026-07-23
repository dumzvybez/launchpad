---
slug: kotlin-functions-default-named-vararg
id: kotlin-04
track: kotlin
order: 4
title: Functions — Default, Named, Vararg
description: Declare functions of every shape — top-level, local, infix, and tail-recursive — and master default arguments, named arguments, and the vararg spread operator.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=1620s
whyItMatters: Declare functions of every shape — top-level, local, infix, and tail-recursive — and master default arguments, named arguments, and the vararg spread operator.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Functions — Default, Named, Vararg

## Functions — Default, Named, Vararg

### Why It Matters

Declare functions of every shape — top-level, local, infix, and tail-recursive — and master default arguments, named arguments, and the vararg spread operator.

Declare functions of every shape — top-level, local, infix, and tail-recursive — and master default arguments, named arguments, and the vararg spread operator.

### Prerequisites

- Stage 1: Getting Started with Kotlin.
- Stage 2: Variables, Types, and Null Safety.
- Stage 3: Control Flow — Conditionals and Loops.

### Topics

- Function declarations with `fun`
- Single-expression functions (`fun square(x: Int) = x * x`)
- Default parameter values
- Named arguments
- vararg parameters and the spread `*` operator
- Local (nested) functions
- Infix functions
- Tail-recursive functions (`tailrec`)

### Key Concepts

- Kotlin functions can be top-level (no class needed), member, local, or extension.
- Default arguments eliminate the need for overloaded methods — one signature covers many call shapes.
- Named arguments make call sites self-documenting and order-independent; combine with defaults for builder-style ergonomics without builders.
- `vararg` allows a variable number of arguments of one type; inside the function it's an array.
- The spread operator `*` unpacks an array into a vararg call: `listOf(*arr)`.

```kotlin
fun greet(
    name: String,
    greeting: String = "Hello",
    punctuation: Char = '!'
): String = "$greeting, $name$punctuation"

greet("Alice")                            // Hello, Alice!
greet("Bob", punctuation = '?')           // Hello, Bob?
greet(name = "Carol", greeting = "Hi")    // Hi, Carol!
```
Caption: Defaults and named args

### Common Pitfalls

- Forgetting `@JvmOverloads` for Java callers — defaults are a Kotlin feature; Java sees only the full signature unless you annotate with `@JvmOverloads` (which generates overloads).
- Mixing positional and named arguments in the wrong order — positional arguments must come before named ones; `f(1, b = 2, 3)` is a compile error.
- Spread on a `List` directly — `*listOf(1,2,3)` does not compile because spread requires an array; convert with `list.toTypedArray()` first.
- Expecting `tailrec` to optimize any recursion — it only works when the recursive call is in tail position (no further computation after); a non-tail recursion like naive Fibonacci is rejected by the compiler.
- Forgetting that `vararg` is the last parameter unless you use named args — `fun f(vararg xs: Int, last: String)` is legal but `last` must be passed by name.

### Real-World Applications

- Kotlin's standard library `listOf`, `setOf`, `arrayOf` all use `vararg` so users can write `listOf(1, 2, 3)` instead of `listOf(intArrayOf(1,2,3))`.
- Android's `Intent.putExtra(name, value)` overloads are reduced in Kotlin wrappers using default values and named arguments.
- Ktor's `route(path) { ... }` uses trailing-lambda + default arg patterns for its routing DSL.
- Gradle's Kotlin DSL uses named arguments extensively (`java { toolchain { languageVersion = JavaLanguageVersion.of(17) } }`) for readable build scripts.

### Interview Questions

- 1. What does `@JvmOverloads` do and when do you need it? — It generates Java overloaded methods for each default combination; needed when Java code calls Kotlin functions with defaults.
- 2. Can a vararg parameter be in the middle of the parameter list? — Yes, but subsequent parameters must be passed by name at the call site; conventionally vararg is last.
- 3. What does the spread operator `*` do? — It unpacks an array into individual vararg arguments at the call site: `sum(*intArrayOf(1,2,3))`.
- 4. Difference between a local function and a lambda? — A local function is declared with `fun` inside another function and has a name (can recurse); a lambda is an anonymous function value assigned to a variable.
- 5. When does `tailrec` fail to compile? — When the recursive call is not in tail position (e.g., `n * fact(n-1)`); the compiler emits a warning and the function is not optimized.

### Mini Project

Build a Printf-style Logger: A `log(level, message, vararg args)` function that formats a message with placeholders and supports default levels. Demonstrate named args, vararg, and spread. Suggested approach:
  - Define `enum class Level { DEBUG, INFO, WARN, ERROR }`
  - `fun log(level: Level = Level.INFO, message: String, vararg args: Any?)`
  - Use `message.format(*args)` (or a custom %s substitution) to interpolate
  - Allow `log(message = "User %s logged in", args = *arrayOf("Alice"))`
  - Add `@JvmOverloads` so Java callers get overloads

### Exercises

1. Write `fun power(base: Double, exp: Int = 2): Double` and call it three ways: positional, named, and with default.
2. Write a `join(vararg parts: String, separator: String = ", ")` function and call it with mixed spread and literal args.
3. Convert a recursive `factorial` to `tailrec` form (accumulator pattern) and test that `factorial(50_000)` does not stack-overflow.
4. Define an `infix fun String.repeat(n: Int): String` extension (shadows stdlib? — use a different name) and call it as `"ab" xrepeat 3`.
5. Add `@JvmOverloads` to a function with two default args and inspect the generated Java overloads with `javap`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which keyword declares a function in Kotlin?
9. A) def
10. B) func
11. C) function
12. D) fun (*)
13. Explanation: `fun name(params): ReturnType { ... }` is the declaration syntax; single-expression bodies use `= expr`.
14. Q2: How do you call `fun greet(name: String, greeting: String = "Hi")` skipping the default?
15. A) greet("Alice") (*)
16. B) greet("Alice", "")
17. C) greet(name = "Alice", greeting = default)
18. D) greet("Alice", null)
19. Explanation: Default arguments let you omit the parameter entirely; the default value is used automatically.
20. Q3: What does `vararg` allow?
21. A) Mutable parameters
22. B) A variable number of arguments of one type (*)
23. C) Variable return type
24. D) Variable scope
25. Explanation: `vararg` declares a parameter that accepts any number of arguments, accessible as an array inside the function.
26. Q4: What does `sum(*arr)` do?
27. A) Multiplies arr
28. B) Dereferences a pointer
29. C) Spreads the array into vararg arguments (*)
30. D) Compiles the array
31. Explanation: The spread operator `*` unpacks an array into individual vararg args at the call site.
32. Q5: What is a single-expression function syntax?
33. A) `fun f(x) := x*x`
34. B) `fun f(x: Int) -> Int { x*x }`
35. C) `lambda f(x) = x*x`
36. D) `fun f(x: Int) = x * x` (*)
37. Explanation: `fun f(x: Int) = x * x` declares a function whose body is a single expression; the return type is inferred.
38. Q6: Which is required for `tailrec` to compile cleanly?
39. A) The recursive call must be in tail position (*)
40. B) The function must return Unit
41. C) The function must be private
42. D) The function must take an Int
43. Explanation: `tailrec` requires the recursive call to be the very last operation so the compiler can rewrite it as a loop.
44. Q7: What is the order rule for positional and named arguments?
45. A) Named must come before positional
46. B) Positional must come before named (*)
47. C) They can be in any order
48. D) Only named is allowed
49. Explanation: Positional arguments must precede named ones; otherwise the compiler can't map them to parameters unambiguously.
50. Q8: What does `@JvmOverloads` do?
51. A) Makes the function overload in Kotlin
52. B) Adds runtime checks
53. C) Generates overloaded Java methods for default arguments (*)
54. D) Marks it as deprecated
55. Explanation: `@JvmOverloads` makes the Kotlin compiler generate one Java method per default-arg combination so Java callers see overloads.
56. Q9: Can you have parameters after a vararg?
57. A) No, never
58. B) Yes, but only one
59. C) Only if they have defaults
60. D) Yes, but they must be called with named arguments (*)
61. Explanation: Parameters after a vararg are legal but must be passed by name at the call site because positional mapping is ambiguous.
62. Q10: How is an infix function called?
63. A) `a infix b` (*)
64. B) `a.infix(b)`
65. C) `infix(a, b)`
66. D) `a.infix b`
67. Explanation: `infix fun Int.shl(b: Int)` is called as `1 shl 2` — no dot, no parentheses — for readability.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which keyword declares a function in Kotlin?
  options:
    - def
    - func
    - function
    - fun
  correctIndex: 3
  explanation: "`fun name(params): ReturnType { ... }` is the declaration syntax; single-expression bodies use `= expr`."
- id: q2
  question: 'How do you call `fun greet(name: String, greeting: String = "Hi")` skipping the default?'
  options:
    - greet("Alice")
    - greet("Alice", "")
    - greet(name = "Alice", greeting = default)
    - greet("Alice", null)
  correctIndex: 0
  explanation: Default arguments let you omit the parameter entirely; the default value is used automatically.
- id: q3
  question: What does `vararg` allow?
  options:
    - Mutable parameters
    - A variable number of arguments of one type
    - Variable return type
    - Variable scope
  correctIndex: 1
  explanation: "`vararg` declares a parameter that accepts any number of arguments, accessible as an array inside the function."
- id: q4
  question: What does `sum(*arr)` do?
  options:
    - Multiplies arr
    - Dereferences a pointer
    - Spreads the array into vararg arguments
    - Compiles the array
  correctIndex: 2
  explanation: The spread operator `*` unpacks an array into individual vararg args at the call site.
- id: q5
  question: What is a single-expression function syntax?
  options:
    - "`fun f(x) := x*x`"
    - "`fun f(x: Int) -> Int { x*x }`"
    - "`lambda f(x) = x*x`"
    - "`fun f(x: Int) = x * x`"
  correctIndex: 3
  explanation: "`fun f(x: Int) = x * x` declares a function whose body is a single expression; the return type is inferred."
- id: q6
  question: Which is required for `tailrec` to compile cleanly?
  options:
    - The recursive call must be in tail position
    - The function must return Unit
    - The function must be private
    - The function must take an Int
  correctIndex: 0
  explanation: "`tailrec` requires the recursive call to be the very last operation so the compiler can rewrite it as a loop."
- id: q7
  question: What is the order rule for positional and named arguments?
  options:
    - Named must come before positional
    - Positional must come before named
    - They can be in any order
    - Only named is allowed
  correctIndex: 1
  explanation: Positional arguments must precede named ones; otherwise the compiler can't map them to parameters unambiguously.
- id: q8
  question: What does `@JvmOverloads` do?
  options:
    - Makes the function overload in Kotlin
    - Adds runtime checks
    - Generates overloaded Java methods for default arguments
    - Marks it as deprecated
  correctIndex: 2
  explanation: "`@JvmOverloads` makes the Kotlin compiler generate one Java method per default-arg combination so Java callers see overloads."
- id: q9
  question: Can you have parameters after a vararg?
  options:
    - No, never
    - Yes, but only one
    - Only if they have defaults
    - Yes, but they must be called with named arguments
  correctIndex: 3
  explanation: Parameters after a vararg are legal but must be passed by name at the call site because positional mapping is ambiguous.
- id: q10
  question: How is an infix function called?
  options:
    - "`a infix b`"
    - "`a.infix(b)`"
    - "`infix(a, b)`"
    - "`a.infix b`"
  correctIndex: 0
  explanation: "`infix fun Int.shl(b: Int)` is called as `1 shl 2` — no dot, no parentheses — for readability."
```

