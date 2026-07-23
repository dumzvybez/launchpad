---
slug: rust-lifetimes-explicit-annotations
id: rust-14
track: rust
order: 14
title: Lifetimes — Explicit Annotations
description: Understand lifetimes as compile-time scopes, write explicit annotations, leverage elision rules, and use `'static` correctly.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=3000s
whyItMatters: Understand lifetimes as compile-time scopes, write explicit annotations, leverage elision rules, and use `'static` correctly.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Lifetimes — Explicit Annotations

## Lifetimes — Explicit Annotations

### Why It Matters

Understand lifetimes as compile-time scopes, write explicit annotations, leverage elision rules, and use `'static` correctly.

Understand lifetimes as compile-time scopes, write explicit annotations, leverage elision rules, and use `'static` correctly.

### Prerequisites

- Stage 13: Generics and Traits
- Stage 6: References and Borrowing
- Stage 7: Slices and String Types

### Topics

- Lifetimes as compile-time scopes, not runtime values
- The borrow checker's lifetime inference
- Explicit annotations: `<'a>` and `&'a T`
- Function lifetime elision rules (3 rules)
- Structs holding references need a lifetime parameter
- `'static` lifetime: lives for the entire program
- Lifetime bounds: `T: 'a`, `&'a dyn Trait`
- Higher-ranked trait bounds (HRTBs): `for<'a>`
- Lifetime variance: invariance of `&mut T` and why it matters

### Key Concepts

- Lifetimes are compile-time annotations the borrow checker uses; they have zero runtime cost.
- Elision rules handle most cases automatically: one input ref -> output takes its lifetime; methods take `&self`'s lifetime.
- A struct holding a `&T` must declare a lifetime parameter so the compiler can enforce that the struct doesn't outlive the borrow.
- `'static` means "lives for the entire program"; string literals are `&'static str`.
- `&mut T` is invariant in `T` (to prevent aliasing through different lifetimes); `&T` is covariant.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let s2 = String::from("hi");
    let r = longest(s1.as_str(), s2.as_str());
    println!("longest: {r}");
}
```
Caption: Function with explicit lifetimes

### Common Pitfalls

- Storing a reference in a struct without a lifetime parameter — `struct Excerpt { part: &str }` errors; needs `<'a>` and `&'a str`.
- Trying to return a reference to a local — fails because the local's lifetime ends at function return; return the owned value.
- Overusing `'static` to silence errors — `'static` is restrictive; it means "lives for the entire program," not "any lifetime."
- Assuming elision always works — when a function has multiple input lifetimes and returns a ref, you need explicit annotations.
- Variance surprises — `&mut &'a T` cannot be assigned a `&'static T` because `&mut T` is invariant in `T`; this prevents aliasing through lifetimes.

### Real-World Applications

- `serde_json` parses into `Value<'a>` borrowing `&str` slices from the input — lifetimes avoid allocation on hot paths.
- The `nom` parser combinator library uses lifetimes extensively to return borrowed slices of input.
- `regex` returns `Match<'a>` borrowing the haystack; lifetime parameters prevent use-after-free of the input.
- The `http` crate models `Request<T>` and `Response<T>` so headers borrow from a buffer when needed.

### Interview Questions

- 1. What is a lifetime in Rust? — A compile-time scope annotation the borrow checker uses to ensure references don't outlive their owners; zero runtime cost.
- 2. What are the three elision rules? — Each input ref gets its own lifetime; if one input lifetime, output gets it; if `&self`/`&mut self`, output gets `self`'s lifetime.
- 3. Why do structs holding references need a lifetime parameter? — So the compiler can enforce the struct doesn't outlive the borrowed data.
- 4. What does `'static` mean? — The reference lives for the entire program; string literals are `&'static str`.
- 5. Why is `&mut T` invariant in `T`? — To prevent aliasing through different lifetimes (e.g. `&mut &'a T` accepting `&'static T` then keeping a shorter-lived `&'a T`).

### Mini Project

Build a Tokenizer with Borrowed Tokens: A `Lexer<'a>` that takes a `&'a str` source and produces `Vec<Token<'a>>` where each token borrows from the source. Suggested approach:
  - Define `enum Token<'a> { Ident(&'a str), Number(&'a str), Punct(&'a str) }`
  - Define `struct Lexer<'a> { src: &'a str, pos: usize }`
  - Implement `next(&mut self) -> Option<Token<'a>>`
  - Iterate producing tokens that all borrow from `src`
  - Confirm the compiler prevents using tokens after `src` is dropped

### Exercises

1. Write `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str` and call it on two strings.
2. Define a struct holding `&str` with a lifetime parameter; build it from a local and observe compiler errors if the local goes out of scope.
3. Remove the lifetime parameter from a function and rely on elision rules.
4. Annotate a function with `'static` and try to pass a non-`'static` reference; observe the error.
5. Write a function returning `&str` and break it by returning a reference to a local; fix by returning `String`.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a lifetime in Rust?
9. A) A runtime counter
10. B) A compile-time scope annotation the borrow checker uses (*)
11. C) A reference count
12. D) A garbage collector phase
13. Explanation: Lifetimes are static annotations ensuring references don't outlive their owners; they have zero runtime cost.
14. Q2: How many lifetime parameters does `fn f(x: &str) -> &str` have after elision?
15. A) Zero
16. B) Two
17. C) One — `'a` for both input and output (*)
18. D) Three
19. Explanation: The first elision rule assigns one lifetime to each input; the second assigns that lifetime to the output.
20. Q3: What does a struct holding `&str` need?
21. A) A `Clone` impl
22. B) A `Drop` impl
23. C) Nothing special
24. D) A lifetime parameter, e.g. `struct S<'a> { s: &'a str }` (*)
25. Explanation: The compiler must enforce the struct doesn't outlive the borrow; the lifetime parameter makes that possible.
26. Q4: What does `'static` mean?
27. A) The reference lives for the entire program (*)
28. B) The reference is mutable
29. C) The reference is in static memory only
30. D) The reference is thread-local
31. Explanation: `'static` means "lives for the entire program"; string literals are `&'static str` stored in the binary.
32. Q5: When does elision NOT work?
33. A) When there's one input lifetime
34. B) When there are multiple input lifetimes and the output is a reference (*)
35. C) When `&self` is present
36. D) When the function returns a non-reference
37. Explanation: With multiple input lifetimes and a reference output, elision can't pick which input owns the output; you must annotate explicitly.
38. Q6: What does `T: 'a` mean?
39. A) T is `'static`
40. B) T is borrowed
41. C) T must outlive lifetime `'a` (T contains no references shorter than `'a`) (*)
42. D) T is owned
43. Explanation: `T: 'a` is a bound saying "T does not contain any references with lifetimes shorter than 'a".
44. Q7: Why is `&mut T` invariant in `T`?
45. A) Performance
46. B) Because `T` is Copy
47. C) Because `T` is Sized
48. D) To prevent aliasing through different lifetimes (*)
49. Explanation: Invariance prevents `&mut &'a T` from being assigned a `&'static T` then read back as a shorter `&'a T`, which would alias.
50. Q8: What is a higher-ranked trait bound (HRTB)?
51. A) `for<'a> T: Trait<'a>` — works for any lifetime (*)
52. B) A bound on a higher trait
53. C) A bound on `Self`
54. D) A bound that's higher in the trait hierarchy
55. Explanation: HRTBs express "implements the trait for any lifetime"; common for closures like `Fn(&str)`.
56. Q9: What's the lifetime of a string literal `"hi"`?
57. A) The enclosing scope
58. B) `'static` — stored in the binary (*)
59. C) The enclosing function
60. D) `'local`
61. Explanation: String literals have the `'static` lifetime; they live for the entire program.
62. Q10: What does the second elision rule say?
63. A) Each input gets its own lifetime
64. B) If `&self` exists, outputs get `self`'s lifetime
65. C) If there's exactly one input lifetime, outputs get it (*)
66. D) Outputs are `'static`
67. Explanation: The second rule: one input lifetime => output borrows from it. The third: `&self`/`&mut self` => output borrows from `self`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a lifetime in Rust?
  options:
    - A runtime counter
    - A compile-time scope annotation the borrow checker uses
    - A reference count
    - A garbage collector phase
  correctIndex: 1
  explanation: Lifetimes are static annotations ensuring references don't outlive their owners; they have zero runtime cost.
- id: q2
  question: "How many lifetime parameters does `fn f(x: &str) -> &str` have after elision?"
  options:
    - Zero
    - Two
    - One — `'a` for both input and output
    - Three
  correctIndex: 2
  explanation: The first elision rule assigns one lifetime to each input; the second assigns that lifetime to the output.
- id: q3
  question: What does a struct holding `&str` need?
  options:
    - A `Clone` impl
    - A `Drop` impl
    - Nothing special
    - "A lifetime parameter, e.g. `struct S<'a> { s: &'a str }`"
  correctIndex: 3
  explanation: The compiler must enforce the struct doesn't outlive the borrow; the lifetime parameter makes that possible.
- id: q4
  question: What does `'static` mean?
  options:
    - The reference lives for the entire program
    - The reference is mutable
    - The reference is in static memory only
    - The reference is thread-local
  correctIndex: 0
  explanation: "`'static` means \"lives for the entire program\"; string literals are `&'static str` stored in the binary."
- id: q5
  question: When does elision NOT work?
  options:
    - When there's one input lifetime
    - When there are multiple input lifetimes and the output is a reference
    - When `&self` is present
    - When the function returns a non-reference
  correctIndex: 1
  explanation: With multiple input lifetimes and a reference output, elision can't pick which input owns the output; you must annotate explicitly.
- id: q6
  question: "What does `T: 'a` mean?"
  options:
    - T is `'static`
    - T is borrowed
    - T must outlive lifetime `'a` (T contains no references shorter than `'a`)
    - T is owned
  correctIndex: 2
  explanation: "`T: 'a` is a bound saying \"T does not contain any references with lifetimes shorter than 'a\"."
- id: q7
  question: Why is `&mut T` invariant in `T`?
  options:
    - Performance
    - Because `T` is Copy
    - Because `T` is Sized
    - To prevent aliasing through different lifetimes
  correctIndex: 3
  explanation: Invariance prevents `&mut &'a T` from being assigned a `&'static T` then read back as a shorter `&'a T`, which would alias.
- id: q8
  question: What is a higher-ranked trait bound (HRTB)?
  options:
    - "?"
    - "`for<'a> T: Trait<'a>` — works for any lifetime"
    - A bound on a higher trait
    - A bound on `Self`
    - A bound that's higher in the trait hierarchy
  correctIndex: 1
  explanation: HRTBs express "implements the trait for any lifetime"; common for closures like `Fn(&str)`.
- id: q9
  question: What's the lifetime of a string literal `"hi"`?
  options:
    - The enclosing scope
    - "`'static` — stored in the binary"
    - The enclosing function
    - "`'local`"
  correctIndex: 1
  explanation: String literals have the `'static` lifetime; they live for the entire program.
- id: q10
  question: What does the second elision rule say?
  options:
    - Each input gets its own lifetime
    - If `&self` exists, outputs get `self`'s lifetime
    - If there's exactly one input lifetime, outputs get it
    - Outputs are `'static`
  correctIndex: 2
  explanation: "The second rule: one input lifetime => output borrows from it. The third: `&self`/`&mut self` => output borrows from `self`."
```

