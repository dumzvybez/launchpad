---
slug: rust-references-borrowing
id: rust-06
track: rust
order: 6
title: References and Borrowing
description: "Use `&T` and `&mut T` to use a value without taking ownership, and learn the borrow checker's rules: many shared or one mutable, never both."
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=500s
whyItMatters: "Use `&T` and `&mut T` to use a value without taking ownership, and learn the borrow checker's rules: many shared or one mutable, never both."
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# References and Borrowing

## References and Borrowing

### Why It Matters

Use `&T` and `&mut T` to use a value without taking ownership, and learn the borrow checker's rules: many shared or one mutable, never both.

Use `&T` and `&mut T` to use a value without taking ownership, and learn the borrow checker's rules: many shared or one mutable, never both.

### Prerequisites

- Stage 5: Ownership — The Fundamental Rule

### Topics

- Shared references `&T` (many readers, no mutation)
- Mutable references `&mut T` (one writer, exclusive)
- The borrow rule: many `&T` OR exactly one `&mut T`, never both at once
- NLL (Non-Lexical Lifetimes) and the 2018 borrow checker
- Implicit reborrowing: `&mut *r` for chained mutable calls
- Dangling references are prevented at compile time
- Returning references tied to input lifetimes (preview; full Stage 14)
- Lifetimes of temporary values and `let x = &foo();` patterns

### Key Concepts

- A reference does not own the value; the original owner stays valid.
- The borrow checker enforces: at any point, you have either many `&T` or exactly one `&mut T`, never both.
- NLL tracks last-use, so `let r = &mut v; v.push(...)` can compile if `r` is no longer used after the push.
- References must never outlive the value they point to (no dangling references).
- Implicit reborrows let you call `&mut`-taking functions repeatedly without explicit `&mut *x`.

```rust
fn main() {
    let mut v = vec![1, 2, 3];
    let r1 = &v;            // shared borrow
    let r2 = &v;            // another shared borrow — OK
    println!("{r1} {r2}");
    let r3 = &mut v;        // mutable borrow — OK because r1, r2 not used after
    r3.push(4);
    println!("{r3:?}");
}
```
Caption: Shared and mutable references

### Common Pitfalls

- Holding a shared borrow and trying to mutate — `let r = &v; v.push(1);` fails because `v` is borrowed.
- Creating two `&mut` to the same data — `let r1 = &mut v; let r2 = &mut v;` is a compile error; aliasing mutable state is forbidden.
- Forgetting NLL — code that looks like it should fail (use, then mutate) often compiles because NLL tracks last-use rather than lexical scope.
- Returning a reference to a local — `fn f() -> &String { let s = ...; &s }` fails because the local is dropped at function return.
- Storing a `&mut` in a struct and then using the original — the borrow is still live as long as the struct holds the reference.

### Real-World Applications

- `serde_json` parses into `&str` slices that borrow from the input buffer, avoiding allocations on hot paths.
- The `bytes` crate (used by Tokio/Hyper) uses `Bytes` to share buffer slices across threads via reference counting.
- ripgrep's `grep` crate borrows `&[u8]` haystacks from memory-mapped files instead of copying.
- Cloudflare's `pingora` passes `&mut Request` between middleware, ensuring only one handler mutates at a time.

### Interview Questions

- 1. What are the two kinds of references and their rules? — `&T` (many shared, read-only) and `&mut T` (one exclusive, mutable); never both at once.
- 2. What is NLL? — Non-Lexical Lifetimes; the 2018 borrow checker tracks last-use rather than lexical scope, so more code compiles.
- 3. Why can't you return `&String` from a function that creates the `String` locally? — The local is dropped at function return, leaving a dangling reference; return the owned `String` instead.
- 4. What's an implicit reborrow? — Passing `&mut r` to a `&mut`-taking function reborrows automatically, so chained mutable calls work without `&mut *r`.
- 5. How does the borrow checker prevent data races? — By forbidding `&mut T` aliasing, it makes "shared XOR mutable" a compile-time invariant, which `Send`/`Sync` then extend across threads.

### Mini Project

Build a Vector Stats Library: Functions `mean(&[f64]) -> f64`, `max(&[f64]) -> Option<f64>`, and `scale(&mut [f64], f64)` that operate via shared/mutable references. Suggested approach:
  - Define all functions with `&[f64]` or `&mut [f64]` parameters
  - Use `iter().sum::<f64>()` for the mean
  - Use `iter().fold(None, ...)` for the max
  - Demonstrate borrowing the same slice twice in `main`
  - Try (and observe) a borrow conflict if you mutate while iterating

### Exercises

1. Write `fn sum(s: &[i32]) -> i32` and call it on a `Vec<i32>` (notice implicit deref coercion).
2. Hold two shared `&v` references and print both; then attempt a `&mut v` and observe the error.
3. Refactor an ownership-transferring function to borrow instead, then call it twice on the same value.
4. Write code that NLL allows but the pre-NLL checker would have rejected.
5. Attempt to return `&String` from a function with a local; fix it by returning `String`.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many mutable references to a value can exist at once?
9. A) Unlimited
10. B) Exactly one (*)
11. C) Up to two
12. D) Zero or one
13. Explanation: A `&mut T` is exclusive — only one at a time, preventing data races at compile time.
14. Q2: What does NLL stand for?
15. A) New Lexical Lifetimes
16. B) Null Lifetime Lint
17. C) Non-Lexical Lifetimes (*)
18. D) Named Lifetime Lexer
19. Explanation: Non-Lexical Lifetimes (2018 edition) tracks last-use, allowing more borrow patterns to compile.
20. Q3: Which is allowed simultaneously?
21. A) Two `&mut T`
22. B) One `&T` and one `&mut T`
23. C) A `&mut T` and the owner mutating
24. D) Many `&T` (*)
25. Explanation: Many shared `&T` are fine; only one `&mut T` is allowed, and never with any `&T` simultaneously.
26. Q4: What's wrong with `fn f() -> &String { let s = String::new(); &s }`?
27. A) `s` is dropped at function end, leaving a dangling reference (*)
28. B) Nothing
29. C) You can't return references
30. D) String is not Clone
31. Explanation: The local `s` is dropped when the function returns; return the owned `String` instead.
32. Q5: What does `&v[0]` return for `v: Vec<i32>`?
33. A) An owned i32
34. B) A `&i32` borrowing from `v` (*)
35. C) A `&mut i32`
36. D) An i32 copy
37. Explanation: Indexing returns a reference to the element; `v[0]` would copy it (i32: Copy) but `&v[0]` borrows.
38. Q6: What is an implicit reborrow?
39. A) A new lifetime parameter
40. B) A second mutable borrow allowed in unsafe
41. C) The compiler automatically shortens a `&mut T` when passing to a `&mut T`-taking function (*)
42. D) A clone of the reference
43. Explanation: When you call `f(&mut x)` where `x: &mut T`, the compiler inserts `&mut *x` to reborrow with a shorter lifetime.
44. Q7: Which signature borrows immutably?
45. A) `fn f(s: String)`
46. B) `fn f(s: &mut String)`
47. C) `fn f(s: *const String)`
48. D) `fn f(s: &String)` (*)
49. Explanation: `&String` is a shared (immutable) reference; `&mut String` is mutable; the by-value form moves.
50. Q8: After `let r = &v; v.push(1);`, what happens?
51. A) Compiles fine — `r` not used after the push may compile under NLL (*)
52. B) Always compiles
53. C) Always fails
54. D) Panics
55. Explanation: If `r` is not used after `v.push(1)`, NLL allows the code; if `r` is used, it fails because of borrow conflict.
56. Q9: What does a reference own?
57. A) The value it points to
58. B) Nothing — references are non-owning (*)
59. C) A copy of the value
60. D) The drop responsibility
61. Explanation: References borrow without owning; the original owner remains responsible for dropping.
62. Q10: Why does the borrow checker reject `let r1 = &mut v; let r2 = &mut v;`?
63. A) v is not mut
64. B) v is not initialized
65. C) Two mutable references alias the same data (*)
66. D) References can't be mutable
67. Explanation: Aliasing `&mut` would allow simultaneous mutation, so the compiler forbids it.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many mutable references to a value can exist at once?
  options:
    - Unlimited
    - Exactly one
    - Up to two
    - Zero or one
  correctIndex: 1
  explanation: A `&mut T` is exclusive — only one at a time, preventing data races at compile time.
- id: q2
  question: What does NLL stand for?
  options:
    - New Lexical Lifetimes
    - Null Lifetime Lint
    - Non-Lexical Lifetimes
    - Named Lifetime Lexer
  correctIndex: 2
  explanation: Non-Lexical Lifetimes (2018 edition) tracks last-use, allowing more borrow patterns to compile.
- id: q3
  question: Which is allowed simultaneously?
  options:
    - Two `&mut T`
    - One `&T` and one `&mut T`
    - A `&mut T` and the owner mutating
    - Many `&T`
  correctIndex: 3
  explanation: Many shared `&T` are fine; only one `&mut T` is allowed, and never with any `&T` simultaneously.
- id: q4
  question: What's wrong with `fn f() -> &String { let s = String::new(); &s }`?
  options:
    - "`s` is dropped at function end, leaving a dangling reference"
    - Nothing
    - You can't return references
    - String is not Clone
  correctIndex: 0
  explanation: The local `s` is dropped when the function returns; return the owned `String` instead.
- id: q5
  question: "What does `&v[0]` return for `v: Vec<i32>`?"
  options:
    - An owned i32
    - A `&i32` borrowing from `v`
    - A `&mut i32`
    - An i32 copy
  correctIndex: 1
  explanation: "Indexing returns a reference to the element; `v[0]` would copy it (i32: Copy) but `&v[0]` borrows."
- id: q6
  question: What is an implicit reborrow?
  options:
    - A new lifetime parameter
    - A second mutable borrow allowed in unsafe
    - The compiler automatically shortens a `&mut T` when passing to a `&mut T`-taking function
    - A clone of the reference
  correctIndex: 2
  explanation: "When you call `f(&mut x)` where `x: &mut T`, the compiler inserts `&mut *x` to reborrow with a shorter lifetime."
- id: q7
  question: Which signature borrows immutably?
  options:
    - "`fn f(s: String)`"
    - "`fn f(s: &mut String)`"
    - "`fn f(s: *const String)`"
    - "`fn f(s: &String)`"
  correctIndex: 3
  explanation: "`&String` is a shared (immutable) reference; `&mut String` is mutable; the by-value form moves."
- id: q8
  question: After `let r = &v; v.push(1);`, what happens?
  options:
    - Compiles fine — `r` not used after the push may compile under NLL
    - Always compiles
    - Always fails
    - Panics
  correctIndex: 0
  explanation: If `r` is not used after `v.push(1)`, NLL allows the code; if `r` is used, it fails because of borrow conflict.
- id: q9
  question: What does a reference own?
  options:
    - The value it points to
    - Nothing — references are non-owning
    - A copy of the value
    - The drop responsibility
  correctIndex: 1
  explanation: References borrow without owning; the original owner remains responsible for dropping.
- id: q10
  question: Why does the borrow checker reject `let r1 = &mut v; let r2 = &mut v;`?
  options:
    - v is not mut
    - v is not initialized
    - Two mutable references alias the same data
    - References can't be mutable
  correctIndex: 2
  explanation: Aliasing `&mut` would allow simultaneous mutation, so the compiler forbids it.
```

