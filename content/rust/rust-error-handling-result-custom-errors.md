---
slug: rust-error-handling-result-custom-errors
id: rust-12
track: rust
order: 12
title: Error Handling — Result, ?, and custom errors
description: Use `Result<T, E>` for recoverable errors, propagate with `?`, define custom error types, and choose between `panic` and `Result`.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4
whyItMatters: Use `Result<T, E>` for recoverable errors, propagate with `?`, define custom error types, and choose between `panic` and `Result`.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Error Handling — Result, ?, and custom errors

## Error Handling — Result, ?, and custom errors

### Why It Matters

Use `Result<T, E>` for recoverable errors, propagate with `?`, define custom error types, and choose between `panic` and `Result`.

Use `Result<T, E>` for recoverable errors, propagate with `?`, define custom error types, and choose between `panic` and `Result`.

### Prerequisites

- Stage 11: Collections
- Stage 9: Enums, Pattern Matching, and Option

### Topics

- `Result<T, E>`: `Ok(T)` / `Err(E)`
- The `?` operator for error propagation
- `panic!` for unrecoverable errors and when to use it
- `unwrap` / `expect` / `unwrap_or` / `unwrap_or_else`
- `Option::ok_or` to convert `Option` to `Result`
- Custom error enums with `#[derive(Debug)]`
- `std::error::Error` and `Display`
- `thiserror` crate for derive-based error definitions
- `anyhow` crate for application-level error chaining
- Converting errors with `From` for `?` to work across types

### Key Concepts

- `Result<T, E>` is the standard way to express recoverable failure; `panic` is for bugs and unrecoverable states.
- `?` returns early with the error if `Err`, unwraps if `Ok`; it auto-converts error types via `From`.
- `?` works on `Option` too (returns `None` early).
- `thiserror` is the standard library-idiomatic choice for libraries; `anyhow` for applications.
- Functions that may fail should return `Result`, not panic, unless failure is genuinely impossible.

```rust
use std::fs;
use std::io;
use std::num::ParseIntError;

fn read_count(path: &str) -> Result<i32, ParseIntError> {
    let s: String = fs::read_to_string(path)
        .map_err(|e| ParseIntError::from(e))?;  // explicit conversion
    let n: i32 = s.trim().parse()?;
    Ok(n)
}
```
Caption: ? operator

### Common Pitfalls

- Using `unwrap()` everywhere — panics on `Err`; use `?`, `match`, or `unwrap_or` in production.
- Forgetting `From` impls (or `#[from]` in thiserror) — `?` won't auto-convert across unrelated error types.
- Panicking from a library — libraries should return `Result`; only the top-level binary should choose to panic.
- Using `anyhow` in a library — `anyhow::Error` erases the type, making it impossible for callers to `match` on specific variants; use `thiserror` for libraries.
- Calling `unwrap()` on a `Result` returned by `?`-friendly code — defeats the purpose; propagate instead.

### Real-World Applications

- The `serde` ecosystem returns `Result<T, serde_json::Error>` so callers can recover from malformed input.
- `tokio` uses `io::Result` pervasively; `?` propagates through async functions identically to sync ones.
- Cloudflare's `quiche` defines a `ConnectionError` enum that callers match on for QUIC protocol-level decisions.
- The `reqwest` HTTP client uses `thiserror`-style typed errors so callers can branch on `Timeout`, `Connect`, or `Decode`.

### Interview Questions

- 1. When should you use `Result` vs `panic`? — `Result` for recoverable, expected failure; `panic` for bugs and unreachable states.
- 2. What does the `?` operator do? — Returns early with the error if `Err`, unwraps if `Ok`, auto-converting error types via `From`.
- 3. What's the difference between `thiserror` and `anyhow`? — `thiserror` derives typed errors for libraries; `anyhow` is for applications that just need to chain and report.
- 4. Why shouldn't libraries use `anyhow`? — It erases error types so callers can't match on specific variants.
- 5. How does `?` convert between error types? — Via the `From<E2> for E1` impl; `#[from]` in thiserror generates it automatically.

### Mini Project

Build a Config Loader: A library that reads a TOML config file, parses it into a `Config` struct, and returns `Result<Config, ConfigError>` with variants for `Io`, `Parse`, and `Missing(String)`. Suggested approach:
  - Define `#[derive(Debug, thiserror::Error)] enum ConfigError`
  - Read with `std::fs::read_to_string` and `?`
  - Parse with the `toml` crate, mapping errors via `#[from]`
  - Validate required fields, returning `Missing(field)` if absent
  - Write a `main.rs` that calls it and prints either the config or the error

### Exercises

1. Write `fn parse_ints(s: &str) -> Result<Vec<i32>, ParseIntError>` using `?` in a loop.
2. Define a custom error enum (with thiserror) for `Io`, `Parse`, and `Empty`.
3. Use `anyhow` in a binary that chains `context()` for friendly messages.
4. Convert an `Option` to `Result` with `ok_or` / `ok_or_else`.
5. Replace three `unwrap()` calls in existing code with `?` or `unwrap_or`.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `?` after a `Result` do?
9. A) Panics on Err
10. B) Logs the error
11. C) Converts to Option
12. D) Returns early with the error if Err, unwraps if Ok (*)
13. Explanation: `?` propagates the error (with `From` conversion) on `Err`; otherwise unwraps the `Ok` value.
14. Q2: When should you use `panic!` over `Result`?
15. A) For unrecoverable bugs or unreachable states (*)
16. B) For expected failures
17. C) Whenever you don't feel like handling errors
18. D) In async functions only
19. Explanation: `panic` is for bugs and impossible states; `Result` is for expected, recoverable failure.
20. Q3: How does `?` convert between error types?
21. A) It doesn't — types must match exactly
22. B) Via the `From<E2> for E1` impl (*)
23. C) Via the `Into` trait on the function
24. D) Via `Display`
25. Explanation: `?` calls `From::from` on the error to convert it to the function's return error type.
26. Q4: Which crate is idiomatic for application-level error chaining?
27. A) thiserror
28. B) failure
29. C) anyhow (*)
30. D) quick-error
31. Explanation: `anyhow` is for applications where you just need to chain and report; `thiserror` is for libraries needing typed errors.
32. Q5: Which crate is preferred for library error types?
33. A) anyhow
34. B) error-chain
35. C) quick-error
36. D) thiserror (*)
37. Explanation: `thiserror` derives typed errors with `#[error("...")]` so callers can `match` on specific variants.
38. Q6: What does `Option::ok_or` do?
39. A) Converts `Option<T>` to `Result<T, E>` with a provided error (*)
40. B) Converts `Option<T>` to `Result<T, ()>`
41. C) Returns the inner T
42. D) Panics if None
43. Explanation: `ok_or(err)` turns `Some(t)` into `Ok(t)` and `None` into `Err(err)`; `ok_or_else` lazily builds the error.
44. Q7: What does `unwrap()` do on `Err`?
45. A) Returns the error
46. B) Panics with the error's Debug output (*)
47. C) Returns None
48. D) Logs and continues
49. Explanation: `unwrap()` panics on `Err`/`None`; `expect("msg")` is identical but with a custom message.
50. Q8: Why is `anyhow` not ideal for a library?
51. A) It's slower
52. B) It doesn't work in async
53. C) It erases the error type, so callers can't match on variants (*)
54. D) It's deprecated
55. Explanation: `anyhow::Error` is a type-erased trait object; libraries should expose typed errors so callers can pattern-match.
56. Q9: Which trait must an error type implement for `?` to work with `std::error::Error`?
57. A) Display only
58. B) Debug only
59. C) Clone
60. D) `std::error::Error` (and usually `Debug + Display`) (*)
61. Explanation: Idiomatic errors implement `std::error::Error` plus `Debug` and `Display`; `thiserror::Error` derives all three.
62. Q10: What does `.context("...")` (anyhow) do?
63. A) Wraps the error with additional context for better messages (*)
64. B) Logs the error
65. C) Recovers from the error
66. D) Replaces the error
67. Explanation: `.context("msg")` wraps an error with a human-readable message, building a chain for diagnosis.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `?` after a `Result` do?
  options:
    - Panics on Err
    - Logs the error
    - Converts to Option
    - Returns early with the error if Err, unwraps if Ok
  correctIndex: 3
  explanation: "`?` propagates the error (with `From` conversion) on `Err`; otherwise unwraps the `Ok` value."
- id: q2
  question: When should you use `panic!` over `Result`?
  options:
    - For unrecoverable bugs or unreachable states
    - For expected failures
    - Whenever you don't feel like handling errors
    - In async functions only
  correctIndex: 0
  explanation: "`panic` is for bugs and impossible states; `Result` is for expected, recoverable failure."
- id: q3
  question: How does `?` convert between error types?
  options:
    - It doesn't — types must match exactly
    - Via the `From<E2> for E1` impl
    - Via the `Into` trait on the function
    - Via `Display`
  correctIndex: 1
  explanation: "`?` calls `From::from` on the error to convert it to the function's return error type."
- id: q4
  question: Which crate is idiomatic for application-level error chaining?
  options:
    - thiserror
    - failure
    - anyhow
    - quick-error
  correctIndex: 2
  explanation: "`anyhow` is for applications where you just need to chain and report; `thiserror` is for libraries needing typed errors."
- id: q5
  question: Which crate is preferred for library error types?
  options:
    - anyhow
    - error-chain
    - quick-error
    - thiserror
  correctIndex: 3
  explanation: '`thiserror` derives typed errors with `#[error("...")]` so callers can `match` on specific variants.'
- id: q6
  question: What does `Option::ok_or` do?
  options:
    - Converts `Option<T>` to `Result<T, E>` with a provided error
    - Converts `Option<T>` to `Result<T, ()>`
    - Returns the inner T
    - Panics if None
  correctIndex: 0
  explanation: "`ok_or(err)` turns `Some(t)` into `Ok(t)` and `None` into `Err(err)`; `ok_or_else` lazily builds the error."
- id: q7
  question: What does `unwrap()` do on `Err`?
  options:
    - Returns the error
    - Panics with the error's Debug output
    - Returns None
    - Logs and continues
  correctIndex: 1
  explanation: '`unwrap()` panics on `Err`/`None`; `expect("msg")` is identical but with a custom message.'
- id: q8
  question: Why is `anyhow` not ideal for a library?
  options:
    - It's slower
    - It doesn't work in async
    - It erases the error type, so callers can't match on variants
    - It's deprecated
  correctIndex: 2
  explanation: "`anyhow::Error` is a type-erased trait object; libraries should expose typed errors so callers can pattern-match."
- id: q9
  question: Which trait must an error type implement for `?` to work with `std::error::Error`?
  options:
    - Display only
    - Debug only
    - Clone
    - "`std::error::Error` (and usually `Debug + Display`)"
  correctIndex: 3
  explanation: Idiomatic errors implement `std::error::Error` plus `Debug` and `Display`; `thiserror::Error` derives all three.
- id: q10
  question: What does `.context("...")` (anyhow) do?
  options:
    - Wraps the error with additional context for better messages
    - Logs the error
    - Recovers from the error
    - Replaces the error
  correctIndex: 0
  explanation: '`.context("msg")` wraps an error with a human-readable message, building a chain for diagnosis.'
```

