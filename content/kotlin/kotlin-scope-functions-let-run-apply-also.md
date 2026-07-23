---
slug: kotlin-scope-functions-let-run-apply-also
id: kotlin-14
track: kotlin
order: 14
title: Scope Functions — let, run, with, apply, also
description: Master the five scope functions, understand when each shines, and avoid the readability traps that come with overusing them.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=7020s
whyItMatters: Master the five scope functions, understand when each shines, and avoid the readability traps that come with overusing them.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Scope Functions — let, run, with, apply, also

## Scope Functions — let, run, with, apply, also

### Why It Matters

Master the five scope functions, understand when each shines, and avoid the readability traps that come with overusing them.

Master the five scope functions, understand when each shines, and avoid the readability traps that come with overusing them.

### Prerequisites

- Stage 1-13.
- Comfort with higher-order functions, lambdas, and inline.

### Topics

- `let`: it, returns lambda result
- `run`: this, returns lambda result
- `with`: this, returns lambda result (not an extension)
- `apply`: this, returns the context
- `also: it, returns the context
- Choosing the right scope function
- Common idioms: null-check with let, builder with apply, side effects with also
- Overuse and readability pitfalls

### Key Concepts

- The five scope functions differ on two axes: receiver (`this` vs `it`) and return value (context object vs lambda result).
- `let` (it, result): null-guarded transformation; `x?.let { ... }`.
- `run` (this, result): compute something from the receiver; `run { ... }` is also a top-level form for scoping.
- `with` (this, result): call multiple methods on an object without repeating its name; not an extension, takes the object as first arg.
- `apply` (this, context): configure an object (builder pattern); returns the receiver.
- `also` (it, context): side effects (logging, validation) without breaking the chain; returns the receiver.

```kotlin
val name: String? = readLine()
name?.let {
    println("Got name: $it")
    saveToDb(it)
}
// Equivalent to: if (name != null) { ... name ... }
```
Caption: let for null checks

### Common Pitfalls

- Using scope functions when a plain `if`/`val` reads better — `x?.let { use(it) }` is great for null safety, but `with(x) { ... }` for a 2-line block adds noise.
- Mixing `it` and `this` in nested scope functions — the inner shadows the outer and the code becomes unreadable; rename or extract a function.
- Using `apply` for non-configuring work — `apply` returns the context, so `val x = foo.apply { compute() }` discards `compute()`'s result; use `let` or `run` for transformations.
- Expecting `also` to transform — `also` always returns the context; if you need the transformed value, use `let`.
- Chaining too many scope functions — `x.let { }.also { }.apply { }.run { }` is a code smell; extract named functions or local variables.

### Real-World Applications

- Android's `view.apply { visibility = View.VISIBLE; alpha = 0.5f; setOnClickListener { } }` idiom for view config.
- Spring Boot's Kotlin bean definitions: `router { addRoutes() }.apply { interceptors.add(...) }`.
- Kotlin's stdlib uses `also` internally for logging and validation chains that don't change the value.
- Gradle Kotlin DSL: `tasks.withType<Test>().configureEach { useJUnitPlatform() }` uses scope functions for configuration.

### Interview Questions

- 1. Name the five scope functions and their (receiver, return) axes. — `let`(it, result), `run`(this, result), `with`(this, result, not an extension), `apply`(this, context), `also`(it, context).
- 2. When would you use `let` over `run`? — When the receiver is nullable and you want `?.let { }` for null-safe transformation; `run` doesn't help with null safety.
- 3. What does `apply` return and why? — The context object (receiver), so you can configure an object inline and assign the result: `val b = StringBuilder().apply { ... }`.
- 4. Difference between `with` and `run`? — `with(obj) { }` takes the object as a parameter (not an extension); `obj.run { }` is an extension — same body behavior, different call style.
- 5. When is `also` the right choice? — When you want a side effect (log, validate, persist) without breaking a chain; `also` returns the original value, preserving the pipeline.

### Mini Project

Build a Configuration Builder: A `Config` class with many properties; use `apply` to construct one inline, `also` to log each step, `let` to transform a nullable input, and `with` to format a description. Suggested approach:
  - `data class Config(var host: String = "", var port: Int = 0, var debug: Boolean = false)`
  - `val cfg = Config().apply { host = "localhost"; port = 8080; debug = true }`
  - `.also { println("Built config: $it") }`
  - `val display = with(cfg) { "$host:$port (debug=$debug)" }`
  - `val url: String? = cfg.host.takeIf { it.isNotEmpty() }?.let { "http://$it:${cfg.port}" }`

### Exercises

1. Rewrite `if (x != null) { use(x) }` as `x?.let { use(it) }` and verify behavior matches.
2. Configure a `Properties().apply { setProperty("k", "v") }` and print the resulting map.
3. Use `also` to log each step of a chain: `listOf(1,2,3).also { println("input $it") }.map { it*2 }.also { println("doubled $it") }`.
4. Write `with(StringBuilder()) { append("a"); append("b") }.toString()` and verify the result.
5. Find a snippet in your own code with 3+ scope functions chained and refactor to named variables for readability.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which scope function uses `it` and returns the lambda result?
9. A) run
10. B) let (*)
11. C) apply
12. D) also
13. Explanation: `let` passes the context as `it` and returns the lambda's result; ideal for null-guarded transformations like `x?.let { ... }`.
14. Q2: Which scope function uses `this` and returns the context object?
15. A) let
16. B) run
17. C) apply (*)
18. D) with
19. Explanation: `apply` uses `this` as the receiver (so you call methods without prefix) and returns the context object — perfect for builder configuration.
20. Q3: Which scope function is NOT an extension function?
21. A) let
22. B) run
23. C) apply
24. D) with (*)
25. Explanation: `with(obj) { }` takes the object as a regular parameter, not as the receiver of an extension; it's used to call multiple methods on the same object.
26. Q4: Which scope function uses `it` and returns the context object (for side effects)?
27. A) also (*)
28. B) let
29. C) run
30. D) apply
31. Explanation: `also` passes the context as `it` and returns the context unchanged — ideal for side effects (logging, validation) without breaking the chain.
32. Q5: What does `x?.let { transform(it) }` return when x is null?
33. A) Throws NPE
34. B) null (*)
35. C) The default value
36. D) Unit
37. Explanation: Because `?.` short-circuits, the `let` block doesn't run and the expression returns null; this makes `?.let` a clean null-safe transformation.
38. Q6: Which idiom is best for configuring an object inline?
39. A) `val b = StringBuilder().let { it.append("a") }`
40. B) `val b = StringBuilder().also { it.append("a") }`
41. C) `val b = StringBuilder().apply { append("a") }` (*)
42. D) `val b = StringBuilder().run { append("a") }`
43. Explanation: `apply` returns the receiver (the StringBuilder) after configuration; the lambda runs with `this` = the builder so you call `append` directly.
44. Q7: What is `also` primarily used for?
45. A) Transforming values
46. B) Null checks
47. C) Configuration
48. D) Side effects (logging, validation) without breaking a chain (*)
49. Explanation: `also` returns the context unchanged, so you can insert a side-effect step (print, log, validate) into a chain without altering the value flowing through.
50. Q8: Which uses `this` and returns the lambda result?
51. A) run (*)
52. B) let
53. C) apply
54. D) also
55. Explanation: `run` uses `this` as the receiver and returns the lambda's result; useful for scoped computation like `obj.run { computeFrom(this) }`.
56. Q9: What's a common overuse pitfall?
57. A) Using `apply` for null checks
58. B) Chaining 3+ scope functions making code unreadable (*)
59. C) Using `let` for null safety
60. D) Using `also` for logging
61. Explanation: Long chains of scope functions (`x.let{}.also{}.apply{}.run{}`) hurt readability; extract named functions or local variables when chain length grows.
62. Q10: Which is `with` syntactically?
63. A) `obj.with { ... }` — extension function
64. B) `with(obj, lambda)` — two-arg call
65. C) `with(obj) { ... }` — takes obj as first parameter (*)
66. D) `with { obj -> ... }` — single-arg
67. Explanation: `with(obj) { ... }` is a regular (non-extension) function; the object is the first parameter and the lambda is the second (trailing-lambda syntax).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which scope function uses `it` and returns the lambda result?
  options:
    - run
    - let
    - apply
    - also
  correctIndex: 1
  explanation: "`let` passes the context as `it` and returns the lambda's result; ideal for null-guarded transformations like `x?.let { ... }`."
- id: q2
  question: Which scope function uses `this` and returns the context object?
  options:
    - let
    - run
    - apply
    - with
  correctIndex: 2
  explanation: "`apply` uses `this` as the receiver (so you call methods without prefix) and returns the context object — perfect for builder configuration."
- id: q3
  question: Which scope function is NOT an extension function?
  options:
    - let
    - run
    - apply
    - with
  correctIndex: 3
  explanation: "`with(obj) { }` takes the object as a regular parameter, not as the receiver of an extension; it's used to call multiple methods on the same object."
- id: q4
  question: Which scope function uses `it` and returns the context object (for side effects)?
  options:
    - also
    - let
    - run
    - apply
  correctIndex: 0
  explanation: "`also` passes the context as `it` and returns the context unchanged — ideal for side effects (logging, validation) without breaking the chain."
- id: q5
  question: What does `x?.let { transform(it) }` return when x is null?
  options:
    - Throws NPE
    - "null"
    - The default value
    - Unit
  correctIndex: 1
  explanation: Because `?.` short-circuits, the `let` block doesn't run and the expression returns null; this makes `?.let` a clean null-safe transformation.
- id: q6
  question: Which idiom is best for configuring an object inline?
  options:
    - '`val b = StringBuilder().let { it.append("a") }`'
    - '`val b = StringBuilder().also { it.append("a") }`'
    - '`val b = StringBuilder().apply { append("a") }`'
    - '`val b = StringBuilder().run { append("a") }`'
  correctIndex: 2
  explanation: "`apply` returns the receiver (the StringBuilder) after configuration; the lambda runs with `this` = the builder so you call `append` directly."
- id: q7
  question: What is `also` primarily used for?
  options:
    - Transforming values
    - Null checks
    - Configuration
    - Side effects (logging, validation) without breaking a chain
  correctIndex: 3
  explanation: "`also` returns the context unchanged, so you can insert a side-effect step (print, log, validate) into a chain without altering the value flowing through."
- id: q8
  question: Which uses `this` and returns the lambda result?
  options:
    - run
    - let
    - apply
    - also
  correctIndex: 0
  explanation: "`run` uses `this` as the receiver and returns the lambda's result; useful for scoped computation like `obj.run { computeFrom(this) }`."
- id: q9
  question: What's a common overuse pitfall?
  options:
    - Using `apply` for null checks
    - Chaining 3+ scope functions making code unreadable
    - Using `let` for null safety
    - Using `also` for logging
  correctIndex: 1
  explanation: Long chains of scope functions (`x.let{}.also{}.apply{}.run{}`) hurt readability; extract named functions or local variables when chain length grows.
- id: q10
  question: Which is `with` syntactically?
  options:
    - "`obj.with { ... }` — extension function"
    - "`with(obj, lambda)` — two-arg call"
    - "`with(obj) { ... }` — takes obj as first parameter"
    - "`with { obj -> ... }` — single-arg"
  correctIndex: 2
  explanation: "`with(obj) { ... }` is a regular (non-extension) function; the object is the first parameter and the lambda is the second (trailing-lambda syntax)."
```

