---
slug: rust-enums-pattern-matching-option
id: rust-09
track: rust
order: 9
title: Enums, Pattern Matching, and Option
description: Define enums (including variants with data), use exhaustive `match`, handle absence with `Option<T>`, and learn `if let` and `while let`.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=800s
whyItMatters: Define enums (including variants with data), use exhaustive `match`, handle absence with `Option<T>`, and learn `if let` and `while let`.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Enums, Pattern Matching, and Option

## Enums, Pattern Matching, and Option

### Why It Matters

Define enums (including variants with data), use exhaustive `match`, handle absence with `Option<T>`, and learn `if let` and `while let`.

Define enums (including variants with data), use exhaustive `match`, handle absence with `Option<T>`, and learn `if let` and `while let`.

### Prerequisites

- Stage 8: Structs and Tuple Structs
- Stage 3: Control Flow — Conditionals and Loops

### Topics

- Enum definition with unit and data-carrying variants
- Variants holding named fields, tuples, or no data
- `match` expressions with arms, guards, and bindings
- Exhaustiveness checking and the `_` wildcard
- `Option<T>`: `Some(T)` / `None` for absence without null
- `if let` and `while let` for single-pattern control flow
- Methods on enums via `impl`
- `#[derive(Debug, Clone, PartialEq)]` and why enums often need it

### Key Concepts

- Enums are sum types; a value of an enum is exactly one of its variants.
- `match` is exhaustive; the compiler forces you to handle every variant (or use `_`).
- `Option<T>` replaces null; you must explicitly unwrap to get the `T`.
- `if let` is sugar for `match` with a single arm; useful when you only care about one variant.
- Enums can carry data per variant, including structs and other enums.

```rust
#[derive(Debug)]
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Square(f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h) => w * h,
            Shape::Square(s) => s * s,
        }
    }
}

fn main() {
    let s = Shape::Rectangle(3.0, 4.0);
    println!("{:?} area = {}", s, s.area());
}
```
Caption: Enum with data

### Common Pitfalls

- Non-exhaustive `match` — forgetting a variant; the compiler errors. Adding `_` silently swallows future variants, so prefer explicit arms.
- Confusing `if let` with `match` — `if let` only handles one pattern and silently does nothing on mismatch; use `match` for full handling.
- Using `unwrap()` on `Option` in production — panics on `None`; use `match`, `?`, or `unwrap_or`/`unwrap_or_else`.
- Forgetting `#[derive(PartialEq)]` when comparing enums — `==` won't work without it.
- Storing variant data inconsistently — keep variants meaningful; an enum where every variant has a different `String` field is often a sign you want a struct + a tag enum.

### Real-World Applications

- `serde_json` uses an enum `Value` with variants `Null`, `Bool`, `Number`, `String`, `Array`, `Object` to represent any JSON.
- The standard library's `Option` and `Result` are enums; they replace null and exceptions across the ecosystem.
- `tokio` models task errors as `enum TaskError` with variants for panic, cancel, and channel close.
- Cloudflare's `pingora` uses enums for HTTP method (`Method::Get`, `Method::Post`, ...) with `match` for dispatch.

### Interview Questions

- 1. What is an enum in Rust? — A sum type; a value is exactly one of its variants, each of which can carry data.
- 2. Why is `match` exhaustive? — To force you to handle every case (or use `_`); prevents bugs from newly-added variants going unhandled.
- 3. What is `Option<T>` and why is it used instead of null? — `Option<T>` is `Some(T)` or `None`; null doesn't exist, so the type system forces explicit handling of absence.
- 4. When do you use `if let` vs `match`? — `if let` when you only care about one pattern (and the rest is no-op); `match` for full handling.
- 5. What is a match guard? — An `if` condition on a match arm: `x if x > 0 => ...`, allowing extra filtering within a pattern.

### Mini Project

Build a JSON-Like Value Enum: Implement `enum JsonValue { Null, Bool(bool), Num(f64), Str(String), Arr(Vec<JsonValue>), Obj(HashMap<String, JsonValue>) }` with a `pretty(&self, indent: usize) -> String` method. Suggested approach:
  - Define the enum with `#[derive(Debug, Clone, PartialEq)]`
  - Implement `pretty` recursively with `match`
  - Use `HashMap<String, JsonValue>` for `Obj`
  - Handle nested arrays/objects via recursion
  - Test with a hand-built nested value

### Exercises

1. Define a `Color` enum with `Rgb` and `Hex` variants; pattern-match in a function returning a hex string.
2. Write `fn half(x: i32) -> Option<i32>` returning `None` for odd numbers.
3. Use `if let Some(x) = opt` to do work only when `opt` is `Some`.
4. Add a new variant to an enum and observe compiler errors at every `match` site.
5. Implement `From<&str>` for a custom `Email` newtype and use `let e: Email = "x@y".into();`.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does an enum represent in Rust?
9. A) A sum type — a value is exactly one of several variants (*)
10. B) A single value
11. C) A constant
12. D) A namespace
13. Explanation: Enums are sum (algebraic) types; each value is one variant, which may carry data.
14. Q2: Why is `match` exhaustive?
15. A) For performance
16. B) The compiler forces you to handle every variant (or use `_`) (*)
17. C) It's a style lint, not required
18. D) Only with `#[non_exhaustive]`
19. Explanation: Exhaustiveness prevents bugs where a new variant goes unhandled; the compiler rejects non-exhaustive matches.
20. Q3: What is `Option<T>`?
21. A) A nullable pointer
22. B) A special trait
23. C) An enum with `Some(T)` and `None` variants (*)
24. D) A generic collection
25. Explanation: `Option<T>` is the standard way to express absence — `Some(T)` for presence, `None` for absence; null doesn't exist.
26. Q4: What does `if let Some(x) = opt { ... }` do?
27. A) Always runs the block
28. B) Panics if opt is None
29. C) Always skips the block
30. D) Runs the block only if `opt` matches `Some(x)`, binding `x` (*)
31. Explanation: `if let` is sugar for a single-arm match — it runs the block only on a match and binds sub-patterns.
32. Q5: What's wrong with `opt.unwrap()` in production code?
33. A) It panics on `None` (*)
34. B) It's deprecated
35. C) It's slow
36. D) It's unsafe
37. Explanation: `unwrap()` panics if the value is `None`; use `?`, `match`, or `unwrap_or` for safe handling.
38. Q6: What is a match guard?
39. A) A trait guard
40. B) An `if` condition on a match arm (*)
41. C) A type-level guard
42. D) A runtime lock
43. Explanation: Guards refine a match arm: `Some(n) if n > 5 => ...`.
44. Q7: Can an enum variant carry named fields?
45. A) No, only tuples
46. B) Only unit variants
47. C) Yes: `Move { x: i32, y: i32 }` (*)
48. D) Only with derive
49. Explanation: Variants can carry no data, a tuple, or named fields like `Move { x, y }`.
50. Q8: What does adding `_ => ...` to a match do?
51. A) Disables exhaustiveness
52. B) Makes the match non-exhaustive
53. C) Silences warnings
54. D) Adds a default case for unhandled patterns (*)
55. Explanation: `_` is the wildcard — it matches anything not covered by earlier arms, providing a default.
56. Q9: Which trait must be derived for an enum to support `==`?
57. A) PartialEq (*)
58. B) Debug
59. C) Clone
60. D) Default
61. Explanation: `==` requires `PartialEq` (and `Eq` for total equality); derive both for full equality support.
62. Q10: What's a common use of `while let`?
63. A) Infinite loop
64. B) Loop until a pattern fails to match (e.g. drain a channel) (*)
65. C) Single-pass iteration
66. D) Trait dispatch
67. Explanation: `while let Some(x) = rx.recv()` is idiomatic for draining a channel until it closes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does an enum represent in Rust?
  options:
    - A sum type — a value is exactly one of several variants
    - A single value
    - A constant
    - A namespace
  correctIndex: 0
  explanation: Enums are sum (algebraic) types; each value is one variant, which may carry data.
- id: q2
  question: Why is `match` exhaustive?
  options:
    - For performance
    - The compiler forces you to handle every variant (or use `_`)
    - It's a style lint, not required
    - Only with `#[non_exhaustive]`
  correctIndex: 1
  explanation: Exhaustiveness prevents bugs where a new variant goes unhandled; the compiler rejects non-exhaustive matches.
- id: q3
  question: What is `Option<T>`?
  options:
    - A nullable pointer
    - A special trait
    - An enum with `Some(T)` and `None` variants
    - A generic collection
    - "` for presence, `None` for absence; null doesn't exist."
  correctIndex: 2
  explanation: "`Option<T>` is the standard way to express absence — `Some(T)` for presence, `None` for absence; null doesn't exist."
- id: q4
  question: What does `if let Some(x) = opt { ... }` do?
  options:
    - Always runs the block
    - Panics if opt is None
    - Always skips the block
    - Runs the block only if `opt` matches `Some(x)`, binding `x`
  correctIndex: 3
  explanation: "`if let` is sugar for a single-arm match — it runs the block only on a match and binds sub-patterns."
- id: q5
  question: What's wrong with `opt.unwrap()` in production code?
  options:
    - It panics on `None`
    - It's deprecated
    - It's slow
    - It's unsafe
  correctIndex: 0
  explanation: "`unwrap()` panics if the value is `None`; use `?`, `match`, or `unwrap_or` for safe handling."
- id: q6
  question: What is a match guard?
  options:
    - A trait guard
    - An `if` condition on a match arm
    - A type-level guard
    - A runtime lock
  correctIndex: 1
  explanation: "Guards refine a match arm: `Some(n) if n > 5 => ...`."
- id: q7
  question: Can an enum variant carry named fields?
  options:
    - No, only tuples
    - Only unit variants
    - "Yes: `Move { x: i32, y: i32 }`"
    - Only with derive
  correctIndex: 2
  explanation: Variants can carry no data, a tuple, or named fields like `Move { x, y }`.
- id: q8
  question: What does adding `_ => ...` to a match do?
  options:
    - Disables exhaustiveness
    - Makes the match non-exhaustive
    - Silences warnings
    - Adds a default case for unhandled patterns
  correctIndex: 3
  explanation: "`_` is the wildcard — it matches anything not covered by earlier arms, providing a default."
- id: q9
  question: Which trait must be derived for an enum to support `==`?
  options:
    - PartialEq
    - Debug
    - Clone
    - Default
  correctIndex: 0
  explanation: "`==` requires `PartialEq` (and `Eq` for total equality); derive both for full equality support."
- id: q10
  question: What's a common use of `while let`?
  options:
    - Infinite loop
    - Loop until a pattern fails to match (e.g. drain a channel)
    - Single-pass iteration
    - Trait dispatch
  correctIndex: 1
  explanation: "`while let Some(x) = rx.recv()` is idiomatic for draining a channel until it closes."
```

