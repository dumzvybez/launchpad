---
slug: rust-control-flow-conditionals-loops
id: rust-03
track: rust
order: 3
title: Control Flow — Conditionals and Loops
description: Use `if`/`else if`/`else`, `loop`, `while`, `for`, and the value-returning nature of expressions to write idiomatic control flow.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=200s
whyItMatters: Use `if`/`else if`/`else`, `loop`, `while`, `for`, and the value-returning nature of expressions to write idiomatic control flow.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Use `if`/`else if`/`else`, `loop`, `while`, `for`, and the value-returning nature of expressions to write idiomatic control flow.

Use `if`/`else if`/`else`, `loop`, `while`, `for`, and the value-returning nature of expressions to write idiomatic control flow.

### Prerequisites

- Stage 2: Variables, Mutability, and Data Types

### Topics

- `if`/`else if`/`else` expressions
- `if` is an expression and can return a value
- `loop` (infinite), `break` with value, `continue`
- Loop labels: `'outer: loop { ... }`
- `while` conditional loops
- `for x in iter` over ranges, arrays, and iterators
- Range syntax: `1..5`, `1..=5`, exclusive/inclusive
- `match` preview (full treatment in Stage 9)
- Exhaustiveness and the `_` wildcard

### Key Concepts

- `if` and `match` are expressions; they evaluate to a value, so `let x = if c { 1 } else { 2 };` is idiomatic.
- Both arms of an `if` expression must return the same type.
- `for` desugars to `IntoIterator::into_iter`; ranges, arrays, `Vec`, `HashMap` all work.
- `break value` from `loop` returns a value to the surrounding expression.
- Loop labels let you `break 'outer` from nested loops.

```rust
fn classify(n: i32) -> &'static str {
    if n > 0 { "positive" }
    else if n < 0 { "negative" }
    else { "zero" }
}
```
Caption: if as expression

### Common Pitfalls

- Writing `if c { 1 } else { 2.0 }` — type mismatch; both arms must have the same type.
- Forgetting `break value` and instead using a mutable accumulator — the `loop` expression form is more idiomatic and avoids the mutable state.
- Using `while i < arr.len()` and indexing — prefer `for x in &arr` which is bounds-checked once and reads cleanly.
- Off-by-one with ranges: `1..5` is exclusive (1,2,3,4); `1..=5` is inclusive (1,2,3,4,5). Mixing them up is a classic bug.
- Using `break` in a nested loop intending to break the outer — use a label: `'outer: loop { ... break 'outer; }`.

### Real-World Applications

- ripgrep's main loop uses labeled `loop` and `break` with values to short-circuit directory traversal when matches are found.
- Cloudflare's `pingora` uses `loop` with `break` to manage connection pools, returning pooled clients to the caller.
- The Rust compiler itself uses dense `match` expressions for AST traversal; `if`-as-expression keeps IR construction concise.
- Tokio's scheduler internals use `loop { ... }` with cooperative yield points checked via `if` against a budget counter.

### Interview Questions

- 1. Is `if` a statement or expression in Rust? — It's an expression; `let x = if c { 1 } else { 2 };` is idiomatic.
- 2. What does `break value` do inside `loop`? — It terminates the loop and yields `value` as the result of the `loop` expression.
- 3. How do you break out of an outer loop from inside an inner one? — Use a label: `'outer: loop { ... break 'outer; }`.
- 4. What's the difference between `1..5` and `1..=5`? — `1..5` is exclusive (1..4), `1..=5` is inclusive (1..5).
- 5. Why does `if c { 1 } else { 2.0 }` fail to compile? — Both arms must have the same type; `i32` and `f64` differ.

### Mini Project

Build a FizzBuzz CLI with a Configurable Range: Read start/end from argv and print FizzBuzz over the inclusive range. Suggested approach:
  - Parse `std::env::args` for `--start` and `--end`
  - Loop with `for i in start..=end`
  - Use `if`/`else if`/`else` for the 3 classic cases
  - Print with `println!`
  - Add a `--only-fizz` filter using `continue` to skip non-Fizz lines

### Exercises

1. Rewrite a `while`-with-index loop as a `for x in &vec` loop.
2. Use `loop` with `break value` to compute the sum of 1..=100.
3. Write nested loops and use a label to break the outer loop on a specific condition.
4. Convert a long `if`/`else if` chain into a `match` and observe readability.
5. Use a `match` with a guard (`Some(n) if n > 5`) to classify values.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is `if` a statement or an expression in Rust?
9. A) Statement only
10. B) Both, depending on edition
11. C) Expression — it can return a value (*)
12. D) Neither; it's a macro
13. Explanation: `if` is an expression; `let x = if c { 1 } else { 2 };` is idiomatic.
14. Q2: What's wrong with `let x = if c { 1 } else { 2.0 };`?
15. A) Nothing
16. B) `c` must be `bool`, not `i32`
17. C) `let` cannot use `if`
18. D) Both arms must have the same type (*)
19. Explanation: Both branches of an `if` expression must produce the same type; `i32` and `f64` differ.
20. Q3: How do you break an outer loop from an inner one?
21. A) Use a label: `'outer: loop { ... break 'outer; }` (*)
22. B) `break outer`
23. C) `break 2`
24. D) You can't; refactor
25. Explanation: Rust uses loop labels like `'outer:` to control which loop `break`/`continue` targets.
26. Q4: What does `1..=5` produce?
27. A) 1, 2, 3, 4
28. B) 1, 2, 3, 4, 5 (*)
29. C) 0, 1, 2, 3, 4, 5
30. D) 1, 5
31. Explanation: `..=` is inclusive; `1..=5` yields 1 through 5. `1..5` is exclusive.
32. Q5: What does `break count * 2;` inside a `loop` do?
33. A) Compile error
34. B) Multiplies count by 2 and continues
35. C) Returns `count * 2` as the value of the loop expression (*)
36. D) Throws a runtime error
37. Explanation: `break value` terminates the loop and yields `value` to the surrounding expression.
38. Q6: Which form is idiomatic for iterating an array's values?
39. A) `for i in 0..arr.len() { arr[i] }`
40. B) `while i < arr.len()`
41. C) `foreach arr as x`
42. D) `for x in &arr { /* x */ }` (*)
43. Explanation: `for x in &arr` borrows each element, bounds-checks once, and reads cleanly.
44. Q7: What must a `match` be on a value of type `Option<i32>`?
45. A) Both `Some` and `None` (or `_`) — exhaustive (*)
46. B) Only `Some(_)`
47. C) Only `None`
48. D) Just `if let`
49. Explanation: `match` must be exhaustive; you must handle `Some` and `None` or use a wildcard `_`.
50. Q8: Which keyword skips the rest of the current loop iteration?
51. A) skip
52. B) continue (*)
53. C) next
54. D) pass
55. Explanation: `continue` jumps to the next iteration; `break` exits the loop entirely.
56. Q9: What is a match guard?
57. A) A trait implementation
58. B) A type guard for generics
59. C) An `if` condition attached to a match arm, e.g. `Some(n) if n > 5` (*)
60. D) A runtime lock
61. Explanation: Guards add extra conditions to a match arm: `Some(n) if n > 5 => ...`.
62. Q10: What does `for c in "hi".chars()` iterate over?
63. A) Bytes
64. B) Grapheme clusters
65. C) Code points as u32
66. D) `char` values (*)
67. Explanation: `.chars()` yields `char` values (Unicode scalar values); `.bytes()` yields `u8`; for graphemes use `unicode-segmentation`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is `if` a statement or an expression in Rust?
  options:
    - Statement only
    - Both, depending on edition
    - Expression — it can return a value
    - Neither; it's a macro
  correctIndex: 2
  explanation: "`if` is an expression; `let x = if c { 1 } else { 2 };` is idiomatic."
- id: q2
  question: What's wrong with `let x = if c { 1 } else { 2.0 };`?
  options:
    - Nothing
    - "`c` must be `bool`, not `i32`"
    - "`let` cannot use `if`"
    - Both arms must have the same type
  correctIndex: 3
  explanation: Both branches of an `if` expression must produce the same type; `i32` and `f64` differ.
- id: q3
  question: How do you break an outer loop from an inner one?
  options:
    - "Use a label: `'outer: loop { ... break 'outer; }`"
    - "`break outer`"
    - "`break 2`"
    - You can't; refactor
  correctIndex: 0
  explanation: Rust uses loop labels like `'outer:` to control which loop `break`/`continue` targets.
- id: q4
  question: What does `1..=5` produce?
  options:
    - 1, 2, 3, 4
    - 1, 2, 3, 4, 5
    - 0, 1, 2, 3, 4, 5
    - 1, 5
  correctIndex: 1
  explanation: "`..=` is inclusive; `1..=5` yields 1 through 5. `1..5` is exclusive."
- id: q5
  question: What does `break count * 2;` inside a `loop` do?
  options:
    - Compile error
    - Multiplies count by 2 and continues
    - Returns `count * 2` as the value of the loop expression
    - Throws a runtime error
  correctIndex: 2
  explanation: "`break value` terminates the loop and yields `value` to the surrounding expression."
- id: q6
  question: Which form is idiomatic for iterating an array's values?
  options:
    - "`for i in 0..arr.len() { arr[i] }`"
    - "`while i < arr.len()`"
    - "`foreach arr as x`"
    - "`for x in &arr { /* x */ }`"
  correctIndex: 3
  explanation: "`for x in &arr` borrows each element, bounds-checks once, and reads cleanly."
- id: q7
  question: What must a `match` be on a value of type `Option<i32>`?
  options:
    - Both `Some` and `None` (or `_`) — exhaustive
    - Only `Some(_)`
    - Only `None`
    - Just `if let`
  correctIndex: 0
  explanation: "`match` must be exhaustive; you must handle `Some` and `None` or use a wildcard `_`."
- id: q8
  question: Which keyword skips the rest of the current loop iteration?
  options:
    - skip
    - continue
    - next
    - pass
  correctIndex: 1
  explanation: "`continue` jumps to the next iteration; `break` exits the loop entirely."
- id: q9
  question: What is a match guard?
  options:
    - A trait implementation
    - A type guard for generics
    - An `if` condition attached to a match arm, e.g. `Some(n) if n > 5`
    - A runtime lock
  correctIndex: 2
  explanation: "Guards add extra conditions to a match arm: `Some(n) if n > 5 => ...`."
- id: q10
  question: What does `for c in "hi".chars()` iterate over?
  options:
    - Bytes
    - Grapheme clusters
    - Code points as u32
    - "`char` values"
  correctIndex: 3
  explanation: "`.chars()` yields `char` values (Unicode scalar values); `.bytes()` yields `u8`; for graphemes use `unicode-segmentation`."
```

