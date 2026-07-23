---
slug: rust-functions-comments
id: rust-04
track: rust
order: 4
title: Functions and Comments
description: Define functions, specify parameter and return types, write expressions vs statements, and document code with `//`, `///`, and `//!`.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=300s
whyItMatters: Define functions, specify parameter and return types, write expressions vs statements, and document code with `//`, `///`, and `//!`.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Functions and Comments

## Functions and Comments

### Why It Matters

Define functions, specify parameter and return types, write expressions vs statements, and document code with `//`, `///`, and `//!`.

Define functions, specify parameter and return types, write expressions vs statements, and document code with `//`, `///`, and `//!`.

### Prerequisites

- Stage 3: Control Flow — Conditionals and Loops
- Stage 2: Variables, Mutability, and Data Types

### Topics

- `fn` definition, parameter types, return type after `->`
- Expression vs statement bodies (no `return` needed for tail expression)
- Early `return` and `return value`
- Diverging functions (`-> !`)
- Function pointers (`fn` type) vs closures (Stage 15)
- Doc comments: `///` (item-level), `//!` (module-level)
- Inner `//` line comments and `/* */` block comments
- `cargo doc` and `rustdoc` HTML generation
- Calling convention basics (no variadics in safe Rust; `extern "C"` preview)

### Key Concepts

- The last expression in a function body (no semicolon) is the return value.
- A semicolon turns an expression into a statement, making the function return `()`.
- Functions have explicit parameter and return types; inference does not cross function boundaries.
- Diverging functions return `!` and never return to the caller (panic, infinite loop, process exit).
- Doc comments support Markdown and show up in `cargo doc` output.

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b     // no semicolon — this is the return value
}
```
Caption: Basic function with expression body

### Common Pitfalls

- Putting a semicolon after the tail expression — `a + b;` returns `()` and you get a confusing "expected i32, found ()" error.
- Writing `-> i32 { return a + b; }` everywhere — idiomatic Rust drops `return` for the tail expression; reserve `return` for early exits.
- Forgetting that function signatures need explicit types — `fn add(a, b)` does not compile; types are mandatory on parameters.
- Using `//` for what should be `///` — `//` is invisible to rustdoc; only `///` and `//!` produce docs.
- Treating `-> !` as a typo — it's the never type, valid for functions that never return (panic, exit, infinite loop).

### Real-World Applications

- The `serde` crate's public API is fully `///`-documented; `cargo doc --open` is the canonical way to read its API.
- ripgrep's `grep` module uses diverging `-> !` helpers to centralize fatal error paths.
- Tokio's task runtime exposes `pub fn spawn` with rich doc comments including doctests; CI runs them via `cargo test --doc`.
- The standard library itself is documented with `///` and ships examples as runnable doctests.

### Interview Questions

- 1. Why doesn't `fn add(a, b) -> i32 { a + b }` compile? — Parameter types are required in Rust; inference does not cross function boundaries.
- 2. What's the difference between `a + b` and `a + b;` in a function body? — Without a semicolon it's the tail expression (the return value); with a semicolon it's a statement and the function returns `()`.
- 3. What does `-> !` mean? — The never type; the function never returns to the caller (panic, exit, infinite loop).
- 4. How do you write a doc comment? — `///` for item-level docs, `//!` for module-level; both support Markdown and are picked up by `cargo doc`.
- 5. What is a doctest? — A code block in a `///` comment that `cargo test --doc` compiles and runs to ensure your docs stay correct.

### Mini Project

Build a Math Utility Library: A small `lib.rs` exposing `add`, `subtract`, `multiply`, `divide` (returning `Option<f64>`), and a `bail` helper that prints and exits. Suggested approach:
  - Create with `cargo new math --lib`
  - Write `pub fn` signatures with explicit types
  - Use tail expressions (no `return`)
  - Add `///` doc comments with example doctests
  - Run `cargo test --doc` and `cargo doc --open`

### Exercises

1. Write `fn max(a: i32, b: i32) -> i32` using an `if` expression in the tail position.
2. Convert a function from `return x;` style to idiomatic tail-expression style.
3. Add a `///` doc comment with a runnable doctest and confirm `cargo test --doc` runs it.
4. Write a `-> !` function that prints an error and calls `std::process::exit(1)`.
5. Add a `//!` module-level doc comment to the top of `main.rs`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the return type of `fn f() { let x = 5; }`?
9. A) i32
10. B) Compile error
11. C) i64
12. D) `()` (unit) (*)
13. Explanation: Without a `-> T`, the function returns `()`; the body has no tail expression.
14. Q2: What does the missing `return` keyword in `fn add(a:i32,b:i32)->i32 { a+b }` indicate?
15. A) `a+b` is the tail expression and is returned (*)
16. B) Compile error
17. C) The function returns ()
18. D) The function is async
19. Explanation: Rust returns the last expression (no semicolon) as the function's value; `return` is only for early exits.
20. Q3: What happens if you write `a + b;` (with semicolon) as the last line of `fn add(...) -> i32`?
21. A) Returns a + b
22. B) Compile error: expected i32, found () (*)
23. C) Returns None
24. D) Panics at runtime
25. Explanation: The semicolon turns the expression into a statement; the tail becomes `()`, which doesn't match the declared `i32`.
26. Q4: What does `-> !` indicate?
27. A) A function returning a boolean
28. B) An error type
29. C) A diverging function that never returns (*)
30. D) A generic parameter
31. Explanation: `!` is the never type; functions returning it (panic, exit, infinite loop) never produce a value to the caller.
32. Q5: Which comment style is used for item-level docs?
33. A) //
34. B) //!
35. C) /* */
36. D) /// (*)
37. Explanation: `///` documents the item that follows; `//!` documents the enclosing module/crate.
38. Q6: What runs doctests in a crate?
39. A) cargo test --doc (*)
40. B) cargo run --doc
41. C) cargo check
42. D) rustdoc --test
43. Explanation: `cargo test --doc` (or `cargo test`, which includes doctests) compiles and runs `///` code blocks.
44. Q7: Which function signature is valid Rust?
45. A) `fn add(a, b) -> i32 { a + b }`
46. B) `fn add(a: i32, b: i32) -> i32 { a + b }` (*)
47. C) `fn add(a i32, b i32) -> i32 { a + b }`
48. D) `fn add<i32>(a, b) { a + b }`
49. Explanation: Rust requires explicit types on every parameter; option B is the only syntactically valid signature.
50. Q8: What does `cargo doc` produce?
51. A) A coverage report
52. B) A binary
53. C) HTML API documentation from `///` comments (*)
54. D) A test report
55. Explanation: `cargo doc` invokes rustdoc to generate HTML docs for your crate and dependencies.
56. Q9: Why prefer tail expressions over explicit `return`?
57. A) Tail expressions are faster
58. B) `return` is deprecated
59. C) `return` only works in `unsafe`
60. D) Idiomatic Rust uses tail expressions; `return` is reserved for early exits (*)
61. Explanation: Tail expressions are idiomatic and concise; `return` is reserved for early or conditional exits.
62. Q10: Which is a module-level doc comment?
63. A) //! (*)
64. B) //
65. C) ///
66. D) /* */
67. Explanation: `//!` (inner doc comment) documents the enclosing module or crate; `///` documents the following item.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the return type of `fn f() { let x = 5; }`?
  options:
    - i32
    - Compile error
    - i64
    - "`()` (unit)"
  correctIndex: 3
  explanation: Without a `-> T`, the function returns `()`; the body has no tail expression.
- id: q2
  question: What does the missing `return` keyword in `fn add(a:i32,b:i32)->i32 { a+b }` indicate?
  options:
    - "`a+b` is the tail expression and is returned"
    - Compile error
    - The function returns ()
    - The function is async
  correctIndex: 0
  explanation: Rust returns the last expression (no semicolon) as the function's value; `return` is only for early exits.
- id: q3
  question: What happens if you write `a + b;` (with semicolon) as the last line of `fn add(...) -> i32`?
  options:
    - Returns a + b
    - "Compile error: expected i32, found ()"
    - Returns None
    - Panics at runtime
  correctIndex: 1
  explanation: The semicolon turns the expression into a statement; the tail becomes `()`, which doesn't match the declared `i32`.
- id: q4
  question: What does `-> !` indicate?
  options:
    - A function returning a boolean
    - An error type
    - A diverging function that never returns
    - A generic parameter
  correctIndex: 2
  explanation: "`!` is the never type; functions returning it (panic, exit, infinite loop) never produce a value to the caller."
- id: q5
  question: Which comment style is used for item-level docs?
  options:
    - //
    - //!
    - /* */
    - ///
  correctIndex: 3
  explanation: "`///` documents the item that follows; `//!` documents the enclosing module/crate."
- id: q6
  question: What runs doctests in a crate?
  options:
    - cargo test --doc
    - cargo run --doc
    - cargo check
    - rustdoc --test
  correctIndex: 0
  explanation: "`cargo test --doc` (or `cargo test`, which includes doctests) compiles and runs `///` code blocks."
- id: q7
  question: Which function signature is valid Rust?
  options:
    - "`fn add(a, b) -> i32 { a + b }`"
    - "`fn add(a: i32, b: i32) -> i32 { a + b }`"
    - "`fn add(a i32, b i32) -> i32 { a + b }`"
    - "`fn add<i32>(a, b) { a + b }`"
  correctIndex: 1
  explanation: Rust requires explicit types on every parameter; option B is the only syntactically valid signature.
- id: q8
  question: What does `cargo doc` produce?
  options:
    - A coverage report
    - A binary
    - HTML API documentation from `///` comments
    - A test report
  correctIndex: 2
  explanation: "`cargo doc` invokes rustdoc to generate HTML docs for your crate and dependencies."
- id: q9
  question: Why prefer tail expressions over explicit `return`?
  options:
    - Tail expressions are faster
    - "`return` is deprecated"
    - "`return` only works in `unsafe`"
    - Idiomatic Rust uses tail expressions; `return` is reserved for early exits
  correctIndex: 3
  explanation: Tail expressions are idiomatic and concise; `return` is reserved for early or conditional exits.
- id: q10
  question: Which is a module-level doc comment?
  options:
    - //!
    - //
    - ///
    - /* */
  correctIndex: 0
  explanation: "`//!` (inner doc comment) documents the enclosing module or crate; `///` documents the following item."
```

