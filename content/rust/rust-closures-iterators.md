---
slug: rust-closures-iterators
id: rust-15
track: rust
order: 15
title: Closures and Iterators
description: Capture variables with closures (Fn/FnMut/FnOnce), chain lazy iterator adapters, and write idiomatic functional-style Rust.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=4500s
whyItMatters: Capture variables with closures (Fn/FnMut/FnOnce), chain lazy iterator adapters, and write idiomatic functional-style Rust.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Closures and Iterators

## Closures and Iterators

### Why It Matters

Capture variables with closures (Fn/FnMut/FnOnce), chain lazy iterator adapters, and write idiomatic functional-style Rust.

Capture variables with closures (Fn/FnMut/FnOnce), chain lazy iterator adapters, and write idiomatic functional-style Rust.

### Prerequisites

- Stage 14: Lifetimes
- Stage 13: Generics and Traits
- Stage 11: Collections

### Topics

- Closure syntax: `|x| x + 1`, `|x: i32| -> i32 { x + 1 }`
- Capture modes: by reference, by mutable reference, by value
- `Fn`, `FnMut`, `FnOnce` traits
- `move` closures (force by-value capture)
- Iterator trait and `next`
- `Iterator::collect`, `map`, `filter`, `enumerate`, `zip`, `take`, `skip`
- `fold` / `reduce`, `sum`, `product`, `min`, `max`
- Lazy evaluation — adapters compose without iterating
- `into_iter` (consumes), `iter` (borrows), `iter_mut` (mutably borrows)
- `Inspect`, `Cloned`, `Copied`, `Chain`, `FlatMap` adapter types

### Key Concepts

- Closures infer their trait (`Fn`/`FnMut`/`FnOnce`) from how they capture: read-only = `Fn`, mutable = `FnMut`, consume = `FnOnce`.
- `move` forces the closure to take ownership of captured variables; required for spawning threads.
- Iterators are lazy — `map`/`filter` don't run until you `collect`, `for`, `sum`, or otherwise consume.
- `into_iter` consumes the collection, yielding owned `T`; `iter` yields `&T`; `iter_mut` yields `&mut T`.
- Iterator adapters are zero-cost — the compiler optimizes chains into tight loops.

```rust
fn main() {
    let s = String::from("hi");
    let print = || println!("{s}");         // Fn: borrows s
    let mut s2 = String::from("hi");
    let push = || s2.push_str("!");          // FnMut: mutably borrows s2
    let consume = move || { drop(s2); };     // FnOnce + move: takes s2
    print();
    push();
    consume();
}
```
Caption: Closure capture modes

### Common Pitfalls

- Forgetting `move` on a closure sent to a thread — borrow of local variables doesn't outlive the function; `move` transfers ownership.
- Calling `collect` without a type hint — `let v = iter.collect();` fails; use `let v: Vec<_> = ...` or turbofish `collect::<Vec<_>>()`.
- Confusing `iter`, `iter_mut`, `into_iter` — they yield `&T`, `&mut T`, and `T` respectively; for `for x in &v` desugars to `iter()`.
- Expecting eager evaluation — `iter.map(f)` does nothing until consumed; lazy chains can mask bugs.
- Capturing by reference in a closure that outlives the captured value — fails the borrow checker; use `move` and `Arc` (Stage 16) for sharing.

### Real-World Applications

- `itertools` crate adds dozens of adapters (`interleave`, `group_by`, `unique`) used across the ecosystem.
- `rayon` provides parallel iterators (`par_iter`) that split work across cores — same adapter API as serial.
- ripgrep's matcher pipeline uses iterator chains to filter file paths, decode bytes, and apply regex matches lazily.
- The standard library's `Iterator` trait powers everything from `Vec::iter` to `Option::iter` to `HashMap` entries.

### Interview Questions

- 1. What's the difference between `Fn`, `FnMut`, and `FnOnce`? — `Fn` borrows immutably, `FnMut` borrows mutably, `FnOnce` consumes (can be called once).
- 2. What does `move` do on a closure? — Forces capture by value (ownership transfer); required for thread spawning.
- 3. Are Rust iterators lazy or eager? — Lazy; `map`/`filter` don't run until `collect`/`for`/`sum`/etc. consumes.
- 4. What's the difference between `iter`, `iter_mut`, `into_iter`? — `iter` yields `&T`, `iter_mut` yields `&mut T`, `into_iter` consumes yielding `T`.
- 5. Why are iterator chains "zero-cost"? — The compiler inlines and optimizes the adapters into a tight loop, equivalent to hand-written code.

### Mini Project

Build a CSV Stats CLI: Read CSV-like lines from stdin (one number per line), compute min/max/mean/sum/count using only iterator adapters (no explicit loops). Suggested approach:
  - Read with `io::stdin().lock().lines()`
  - Parse each line to `f64` and `filter_map` to skip bad lines
  - Compute `min`, `max`, `sum`, `count` in one pass via `fold`
  - Compute `mean = sum / count`
  - Print results in a clean table

### Exercises

1. Write a closure that captures a `String` by reference and prints it.
2. Use `move` to transfer ownership of a captured `String` into a closure; observe the original is invalid.
3. Chain `.iter().filter().map().collect::<Vec<_>>()` on a `Vec<i32>`.
4. Use `fold` to compute the product of `1..=5`.
5. Use `enumerate()` and `zip()` together to print index, name, and score.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which trait does a closure that consumes a captured variable implement?
9. A) Fn
10. B) FnMut
11. C) FnOnce (*)
12. D) FnMove
13. Explanation: `FnOnce` consumes captured variables and can be called once; `FnMut` mutably borrows; `Fn` borrows immutably.
14. Q2: What does `move` do on a closure?
15. A) Moves the closure
16. B) Moves the closure to the heap
17. C) Moves the closure to another thread
18. D) Forces the closure to capture by value (ownership transfer) (*)
19. Explanation: `move` transfers ownership of captured variables into the closure; required for thread spawning.
20. Q3: Are Rust iterators lazy or eager?
21. A) Lazy — adapters don't run until consumed (*)
22. B) Eager
23. C) Both
24. D) Eager for `map`, lazy for `filter`
25. Explanation: Iterator adapters are lazy; `map`/`filter`/etc. don't execute until `collect`, `for`, `sum`, or another consumer drives them.
26. Q4: What does `iter()` yield for `Vec<T>`?
27. A) `T`
28. B) `&T` (*)
29. C) `&mut T`
30. D) `Option<T>`
31. Explanation: `iter()` borrows immutably yielding `&T`; `iter_mut()` yields `&mut T`; `into_iter()` consumes yielding `T`.
32. Q5: Which method consumes the iterator and builds a collection?
33. A) `take`
34. B) `chain`
35. C) `collect` (*)
36. D) `enumerate`
37. Explanation: `collect()` materializes any `FromIterator` collection, often with a turbofish: `collect::<Vec<_>>()`.
38. Q6: Which adapter applies a function and discards results, used for side effects?
39. A) `map`
40. B) `fold`
41. C) `inspect`
42. D) `for_each` (*)
43. Explanation: `for_each` consumes the iterator, calling a closure on each element for side effects (e.g. printing).
44. Q7: What does `enumerate()` yield?
45. A) `(usize, T)` tuples of index and value (*)
46. B) Only the index
47. C) Only the value
48. D) `(T, usize)`
49. Explanation: `enumerate` returns `(usize, T)` — index first, value second; useful in `for (i, x) in iter.enumerate()`.
50. Q8: Why are iterator adapters considered zero-cost?
51. A) They use SIMD
52. B) The compiler inlines and optimizes them into tight loops (*)
53. C) They run on a separate thread
54. D) They skip elements
55. Explanation: Monomorphization plus inlining lets LLVM fuse chained adapters into a single loop, equivalent to hand-written code.
56. Q9: Which combinator builds a single value from an iterator with an accumulator?
57. A) `map`
58. B) `filter`
59. C) `fold` (*)
60. D) `take`
61. Explanation: `fold(init, |acc, x| ...)` reduces the iterator to one value using an accumulator and a closure.
62. Q10: Which trait must a closure implement to be stored in a `Box<dyn Fn()>`?
63. A) FnOnce
64. B) FnMut
65. C) Any of the above via Box<dyn FnOnce>
66. D) Fn (*)
67. Explanation: `dyn Fn` requires the `Fn` trait; `Box<dyn FnMut>` and `Box<dyn FnOnce>` exist for the others (the latter stabilized in 1.35).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which trait does a closure that consumes a captured variable implement?
  options:
    - Fn
    - FnMut
    - FnOnce
    - FnMove
  correctIndex: 2
  explanation: "`FnOnce` consumes captured variables and can be called once; `FnMut` mutably borrows; `Fn` borrows immutably."
- id: q2
  question: What does `move` do on a closure?
  options:
    - Moves the closure
    - Moves the closure to the heap
    - Moves the closure to another thread
    - Forces the closure to capture by value (ownership transfer)
  correctIndex: 3
  explanation: "`move` transfers ownership of captured variables into the closure; required for thread spawning."
- id: q3
  question: Are Rust iterators lazy or eager?
  options:
    - Lazy — adapters don't run until consumed
    - Eager
    - Both
    - Eager for `map`, lazy for `filter`
  correctIndex: 0
  explanation: Iterator adapters are lazy; `map`/`filter`/etc. don't execute until `collect`, `for`, `sum`, or another consumer drives them.
- id: q4
  question: What does `iter()` yield for `Vec<T>`?
  options:
    - "`T`"
    - "`&T`"
    - "`&mut T`"
    - "`Option<T>`"
  correctIndex: 1
  explanation: "`iter()` borrows immutably yielding `&T`; `iter_mut()` yields `&mut T`; `into_iter()` consumes yielding `T`."
- id: q5
  question: Which method consumes the iterator and builds a collection?
  options:
    - "`take`"
    - "`chain`"
    - "`collect`"
    - "`enumerate`"
  correctIndex: 2
  explanation: "`collect()` materializes any `FromIterator` collection, often with a turbofish: `collect::<Vec<_>>()`."
- id: q6
  question: Which adapter applies a function and discards results, used for side effects?
  options:
    - "`map`"
    - "`fold`"
    - "`inspect`"
    - "`for_each`"
  correctIndex: 3
  explanation: "`for_each` consumes the iterator, calling a closure on each element for side effects (e.g. printing)."
- id: q7
  question: What does `enumerate()` yield?
  options:
    - "`(usize, T)` tuples of index and value"
    - Only the index
    - Only the value
    - "`(T, usize)`"
    - "` — index first, value second; useful in `for (i, x) in iter.enumerate()`."
  correctIndex: 0
  explanation: "`enumerate` returns `(usize, T)` — index first, value second; useful in `for (i, x) in iter.enumerate()`."
- id: q8
  question: Why are iterator adapters considered zero-cost?
  options:
    - They use SIMD
    - The compiler inlines and optimizes them into tight loops
    - They run on a separate thread
    - They skip elements
  correctIndex: 1
  explanation: Monomorphization plus inlining lets LLVM fuse chained adapters into a single loop, equivalent to hand-written code.
- id: q9
  question: Which combinator builds a single value from an iterator with an accumulator?
  options:
    - "`map`"
    - "`filter`"
    - "`fold`"
    - "`take`"
  correctIndex: 2
  explanation: "`fold(init, |acc, x| ...)` reduces the iterator to one value using an accumulator and a closure."
- id: q10
  question: Which trait must a closure implement to be stored in a `Box<dyn Fn()>`?
  options:
    - FnOnce
    - FnMut
    - Any of the above via Box<dyn FnOnce>
    - Fn
  correctIndex: 3
  explanation: "`dyn Fn` requires the `Fn` trait; `Box<dyn FnMut>` and `Box<dyn FnOnce>` exist for the others (the latter stabilized in 1.35)."
```

