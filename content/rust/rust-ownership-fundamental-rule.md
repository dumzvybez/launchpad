---
slug: rust-ownership-fundamental-rule
id: rust-05
track: rust
order: 5
title: Ownership — The Fundamental Rule
description: Learn the single rule that enables Rust's memory safety without GC — every value has one owner, ownership transfers on move, and values drop when their owner goes out of scope.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=400s
whyItMatters: Learn the single rule that enables Rust's memory safety without GC — every value has one owner, ownership transfers on move, and values drop when their owner goes out of scope.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Ownership — The Fundamental Rule

## Ownership — The Fundamental Rule

### Why It Matters

Learn the single rule that enables Rust's memory safety without GC — every value has one owner, ownership transfers on move, and values drop when their owner goes out of scope.

Learn the single rule that enables Rust's memory safety without GC — every value has one owner, ownership transfers on move, and values drop when their owner goes out of scope.

### Prerequisites

- Stage 4: Functions and Comments
- Stage 2: Variables, Mutability, and Data Types

### Topics

- The three ownership rules: one owner, moves on assignment, drop at scope end
- Move semantics for heap types (`String`, `Vec`, `Box`)
- `Copy` trait for stack types (`i32`, `f64`, `bool`, `char`, fixed-size arrays of `Copy` types)
- Clone for explicit deep copies
- Partial moves out of structs
- Function call transfers ownership; returning values transfers it back
- Why `let s2 = s1;` invalidates `s1` for non-Copy types
- `Drop` trait and deterministic destruction
- The `drop` function for early disposal

### Key Concepts

- Stack types that implement `Copy` are bitwise-copied on assignment; `let b = a` leaves both usable.
- Heap types like `String` are moved on assignment; the old binding is unusable afterward.
- Passing a value to a function moves it (unless it's `Copy`); returning a value moves it back.
- `Drop::drop` runs deterministically when the owner goes out of scope — no GC, no finalizers.
- Cloning is explicit (`x.clone()`); the compiler never auto-clones heap data.

```rust
fn main() {
    let a = 5;        // i32 is Copy
    let b = a;        // copied
    println!("{a} {b}");  // both usable

    let s1 = String::from("hi");
    let s2 = s1;      // MOVED — s1 is now invalid
    // println!("{s1}"); // compile error: borrow of moved value
    println!("{s2}");
}
```
Caption: Move vs Copy

### Common Pitfalls

- Writing `let s2 = s1; println!("{s1}");` for a `String` — compile error: "borrow of moved value"; either `.clone()` or pass by reference (Stage 6).
- Calling a function that takes `String` by value and then trying to use the original — the value was moved; either return it, take `&str`, or `clone()`.
- Partially moving a struct and then trying to use the whole struct — once any non-Copy field is moved, the struct is partially moved and cannot be used as a whole (until reassembled or replaced).
- Implementing `Copy` on a type with a `String` or `Vec` field — `Copy` requires all fields be `Copy`; heap types are not, so the derive fails.
- Confusing `clone` and `copy` — `Copy` is implicit bitwise (stack types only); `Clone` is explicit and can do anything (deep copy of heap data).

### Real-World Applications

- Firefox's Stylo CSS engine relies on ownership transfer to safely pass DOM nodes between worker threads without locks.
- Cloudflare's `quiche` QUIC implementation moves packet buffers between parsing stages, never copying.
- Figma's multiplayer engine moves owned `Vec<Operation>` into the CRDT merger; ownership guarantees no other thread sees the buffer.
- The `tokio` runtime moves task futures between worker threads; the `Send` bound (Stage 17) is enforced by ownership transfer semantics.

### Interview Questions

- 1. What are Rust's three ownership rules? — Each value has one owner; assignment moves it (non-Copy) and invalidates the source; the value is dropped when the owner leaves scope.
- 2. Why is `let s2 = s1; println!("{s1}");` an error for `String` but not `i32`? — `String` is moved (non-Copy heap type); `i32` implements `Copy` (bitwise copy).
- 3. What's the difference between `Copy` and `Clone`? — `Copy` is implicit and bitwise (stack types); `Clone` is explicit and may do anything (deep copy of heap data).
- 4. When does `Drop::drop` run? — Deterministically when the owner goes out of scope — no GC, no finalizer delay.
- 5. What is a partial move? — Moving one non-Copy field out of a struct; the whole struct can no longer be used until the field is replaced.

### Mini Project

Build a String-Length Tracker: A program that takes several strings, moves them into a function that prints their lengths, then demonstrates `clone` vs move with explanatory prints. Suggested approach:
  - Define `fn report(s: String)` that prints `s.len()`
  - Move multiple `String`s into `report` in a loop
  - Show that the originals are invalid after the call
  - Use `.clone()` in a second loop to preserve the originals
  - Add a struct with `String` and `u32`, then partially move the `String` and print the `u32`

### Exercises

1. Move a `String` into a function and observe that the original is invalid.
2. Add `.clone()` to make the original usable after the call.
3. Implement a struct with `i32` and `String`; move the `String` out and print the `i32`.
4. Try to derive `Copy` on a struct with a `String` field; observe the error.
5. Use `drop(s)` to manually dispose of a `String` before end of scope.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens when you write `let s2 = s1;` where `s1: String`?
9. A) `s1` is moved to `s2`; `s1` is now invalid (*)
10. B) `s1` is copied
11. C) Compile error
12. D) Both share the heap data
13. Explanation: `String` is non-Copy; assignment moves it, invalidating the source binding to prevent double-free.
14. Q2: Which trait does `i32` implement that `String` does not?
15. A) Clone
16. B) Copy (*)
17. C) Drop
18. D) Display
19. Explanation: `i32` is `Copy` (bitwise stack copy); `String` owns heap memory and cannot be `Copy`.
20. Q3: When is a value dropped in Rust?
21. A) When the GC runs
22. B) When refcount hits zero
23. C) When the owner goes out of scope (*)
24. D) At program exit only
25. Explanation: Rust drops values deterministically when their owner's scope ends — no GC, no finalizer delay.
26. Q4: What is a partial move?
27. A) Moving half a buffer
28. B) Moving a value between threads
29. C) Moving a reference
30. D) Moving one non-Copy field out of a struct, invalidating that field (*)
31. Explanation: After moving a non-Copy field out, the struct is partially moved; you can still use other (Copy) fields but not the whole struct.
32. Q5: Which call makes an explicit deep copy of a `String`?
33. A) `s.clone()` (*)
34. B) `s.copy()`
35. C) `s.duplicate()`
36. D) `s.dup()`
37. Explanation: `Clone::clone` performs an explicit deep copy; the compiler never auto-clones.
38. Q6: Why can't you derive `Copy` on `struct S { s: String }`?
39. A) Derive doesn't support Copy
40. B) `Copy` requires all fields to be `Copy`, and `String` is not (*)
41. C) You need an unsafe impl
42. D) Copy is unstable
43. Explanation: `Copy` is only derivable when every field is `Copy`; `String` owns heap memory.
44. Q7: What happens when you pass a `Vec<u32>` to a function by value?
45. A) It's borrowed
46. B) It's copied element-by-element
47. C) It's moved into the function (*)
48. D) Compile error
49. Explanation: `Vec` is non-Copy; passing by value moves it. The original binding is invalid after the call.
50. Q8: Which built-in function forces early disposal of an owned value?
51. A) `free(x)`
52. B) `dispose(x)`
53. C) `delete(x)`
54. D) `drop(x)` (*)
55. Explanation: `std::mem::drop(x)` takes ownership and immediately drops the value — useful for releasing locks early.
56. Q9: For `let a = 5; let b = a;` which is true?
57. A) `a` is still usable because `i32: Copy` (*)
58. B) `a` is invalid
59. C) Compile error
60. D) `a` is borrowed
61. Explanation: `i32` implements `Copy`; assignment is a bitwise copy and `a` remains valid.
62. Q10: What does the `Drop` trait provide?
63. A) A way to free memory manually
64. B) A `drop(&mut self)` method that runs when the owner goes out of scope (*)
65. C) A GC hook
66. D) A marker for thread safety
67. Explanation: `Drop::drop` runs deterministically at scope end, enabling RAII patterns (files, locks, sockets).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "What happens when you write `let s2 = s1;` where `s1: String`?"
  options:
    - "`s1` is moved to `s2`; `s1` is now invalid"
    - "`s1` is copied"
    - Compile error
    - Both share the heap data
  correctIndex: 0
  explanation: "`String` is non-Copy; assignment moves it, invalidating the source binding to prevent double-free."
- id: q2
  question: Which trait does `i32` implement that `String` does not?
  options:
    - Clone
    - Copy
    - Drop
    - Display
  correctIndex: 1
  explanation: "`i32` is `Copy` (bitwise stack copy); `String` owns heap memory and cannot be `Copy`."
- id: q3
  question: When is a value dropped in Rust?
  options:
    - When the GC runs
    - When refcount hits zero
    - When the owner goes out of scope
    - At program exit only
  correctIndex: 2
  explanation: Rust drops values deterministically when their owner's scope ends — no GC, no finalizer delay.
- id: q4
  question: What is a partial move?
  options:
    - Moving half a buffer
    - Moving a value between threads
    - Moving a reference
    - Moving one non-Copy field out of a struct, invalidating that field
  correctIndex: 3
  explanation: After moving a non-Copy field out, the struct is partially moved; you can still use other (Copy) fields but not the whole struct.
- id: q5
  question: Which call makes an explicit deep copy of a `String`?
  options:
    - "`s.clone()`"
    - "`s.copy()`"
    - "`s.duplicate()`"
    - "`s.dup()`"
  correctIndex: 0
  explanation: "`Clone::clone` performs an explicit deep copy; the compiler never auto-clones."
- id: q6
  question: "Why can't you derive `Copy` on `struct S { s: String }`?"
  options:
    - Derive doesn't support Copy
    - "`Copy` requires all fields to be `Copy`, and `String` is not"
    - You need an unsafe impl
    - Copy is unstable
  correctIndex: 1
  explanation: "`Copy` is only derivable when every field is `Copy`; `String` owns heap memory."
- id: q7
  question: What happens when you pass a `Vec<u32>` to a function by value?
  options:
    - It's borrowed
    - It's copied element-by-element
    - It's moved into the function
    - Compile error
  correctIndex: 2
  explanation: "`Vec` is non-Copy; passing by value moves it. The original binding is invalid after the call."
- id: q8
  question: Which built-in function forces early disposal of an owned value?
  options:
    - "`free(x)`"
    - "`dispose(x)`"
    - "`delete(x)`"
    - "`drop(x)`"
  correctIndex: 3
  explanation: "`std::mem::drop(x)` takes ownership and immediately drops the value — useful for releasing locks early."
- id: q9
  question: For `let a = 5; let b = a;` which is true?
  options:
    - "`a` is still usable because `i32: Copy`"
    - "`a` is invalid"
    - Compile error
    - "`a` is borrowed"
  correctIndex: 0
  explanation: "`i32` implements `Copy`; assignment is a bitwise copy and `a` remains valid."
- id: q10
  question: What does the `Drop` trait provide?
  options:
    - A way to free memory manually
    - A `drop(&mut self)` method that runs when the owner goes out of scope
    - A GC hook
    - A marker for thread safety
  correctIndex: 1
  explanation: "`Drop::drop` runs deterministically at scope end, enabling RAII patterns (files, locks, sockets)."
```

