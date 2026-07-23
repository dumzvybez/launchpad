---
slug: rust-generics-traits
id: rust-13
track: rust
order: 13
title: Generics and Traits
description: Write generic functions and types, define and implement traits, use trait bounds, and learn default methods, associated types, and trait objects.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=1500s
whyItMatters: Write generic functions and types, define and implement traits, use trait bounds, and learn default methods, associated types, and trait objects.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Generics and Traits

## Generics and Traits

### Why It Matters

Write generic functions and types, define and implement traits, use trait bounds, and learn default methods, associated types, and trait objects.

Write generic functions and types, define and implement traits, use trait bounds, and learn default methods, associated types, and trait objects.

### Prerequisites

- Stage 12: Error Handling
- Stage 8: Structs and Tuple Structs

### Topics

- Generic functions: `fn first<T>(v: &[T]) -> Option<&T>`
- Generic structs and enums: `struct Point<T> { x: T, y: T }`
- Trait definitions: `trait Draw { fn draw(&self); }`
- Implementing traits: `impl Draw for Circle { ... }`
- Trait bounds: `fn sum<T: Add>(a: T, b: T) -> T::Output`
- `+` for combining bounds, `where` clauses for readability
- Default methods in traits
- Associated types vs generics: `trait Iterator { type Item; ... }`
- Trait objects: `Box<dyn Trait>` for dynamic dispatch
- `impl Trait` in argument and return position

### Key Concepts

- Generics are monomorphized at compile time — each concrete type produces a separate copy, zero runtime cost.
- Trait bounds say "T must implement these traits"; the compiler enforces them at the call site.
- Default methods let traits provide a default implementation that types can override.
- Associated types are chosen by the implementing type (one per impl); generics let callers choose (many per type).
- Trait objects (`dyn Trait`) use dynamic dispatch via a vtable; `Box<dyn Trait>` is the most common form.

```rust
fn largest<T: PartialOrd>(list: &[T]) -> Option<&T> {
    let mut max = &list[0];
    for item in &list[1..] {
        if item > max { max = item; }
    }
    Some(max)
}

fn main() {
    println!("{:?}", largest(&[1, 5, 3]));      // Some(5)
    println!("{:?}", largest(&['a', 'z', 'm'])); // Some('z')
}
```
Caption: Generic function with bounds

### Common Pitfalls

- Trait not in scope — `#[derive(Debug)]` works because it's a built-in; using an external trait requires `use crate::Trait;` before implementing it.
- Implementing a foreign trait on a foreign type — Rust's orphan rule forbids this; define a newtype wrapper.
- Trait objects don't work with `Sized`-only traits — `dyn Trait` requires the trait to be object-safe (no `Self` in method signatures, no generics).
- Choosing generics when associated types are clearer — if the type is fixed by the impl, use an associated type, not a generic.
- Forgetting that monomorphization bloats binary size — large generic functions instantiated for many types can slow compile and grow the binary.

### Real-World Applications

- `serde::Serialize` and `Deserialize` are the most-implemented traits in the ecosystem; derive macros generate impls.
- The `Iterator` trait uses an associated type `Item`; the entire `itertools` ecosystem builds on it.
- Tokio's `AsyncRead`/`AsyncWrite` traits abstract over byte streams, with `impl Trait` returns for combinators.
- `tower::Service<Request>` uses an associated `Response` and `Error` type for middleware-style generic services.

### Interview Questions

- 1. What is monomorphization? — The compiler generates a separate copy of generic code for each concrete type, giving zero-cost abstractions at the cost of binary size.
- 2. What's the orphan rule? — You can implement a trait on a type only if at least one of them is local to your crate; prevents conflicting impls across crates.
- 3. Associated type vs generic parameter? — Associated types are chosen by the impl (one per type); generics are chosen by the caller (many per type).
- 4. What is a trait object and how is it dispatched? — `dyn Trait` is a fat pointer (data + vtable) for dynamic dispatch; `Box<dyn Trait>` is the common form.
- 5. What is object safety? — A trait is object-safe if it has no `Self`-returning methods, no generic methods, and is `Sized`-free; required for `dyn Trait`.

### Mini Project

Build a Generic Stack with Iterable Trait: A `Stack<T>` type with `push`, `pop`, `peek`, and an `IntoIterator` impl. Add a `Draw` trait with two implementors rendered as ASCII. Suggested approach:
  - Define `struct Stack<T> { data: Vec<T> }`
  - Add `pub fn new`, `push`, `pop`, `peek`
  - Implement `Iterator` returning owned `T`s
  - Define `trait Draw { fn draw(&self); }` with `Box` and `Circle` impls
  - Build a `Vec<Box<dyn Draw>>` and call `draw` on each

### Exercises

1. Write `fn first<T>(v: &[T]) -> Option<&T>` and call it on `[1,2,3]` and `["a","b"]`.
2. Define a `Summary` trait with a default `summarize` method and implement for a `NewsArticle` struct.
3. Add an associated type to a `Storage` trait and implement for `VecStorage`.
4. Build a `Vec<Box<dyn Display>>` containing different types and print each.
5. Use a `where` clause to clean up a function with three trait bounds.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How are generics implemented in Rust?
9. A) Monomorphized — a separate copy per concrete type at compile time (*)
10. B) Boxed at runtime
11. C) Via dynamic dispatch
12. D) Via type erasure
13. Explanation: Monomorphization generates a distinct function per type used, giving zero-cost abstractions with potentially larger binaries.
14. Q2: What does a trait bound `T: PartialOrd` mean?
15. A) T must be ordered
16. B) T must implement `PartialOrd` (*)
17. C) T is a partial type
18. D) T is partial to ord
19. Explanation: Trait bounds constrain generic types; `T: PartialOrd` says "T must implement PartialOrd".
20. Q3: What is the orphan rule?
21. A) You can't implement any trait
22. B) Foreign traits can't be used
23. C) You can implement a trait on a type only if at least one is local to your crate (*)
24. D) Local types can't have foreign traits
25. Explanation: The orphan rule prevents conflicting impls across crates; use a newtype wrapper to work around it.
26. Q4: Associated type vs generic parameter — which is chosen by the impl?
27. A) Generic parameter
28. B) Both
29. C) Neither
30. D) Associated type (*)
31. Explanation: Associated types are chosen by the implementing type (one per type); generic parameters are chosen by the caller.
32. Q5: What is `Box<dyn Trait>`?
33. A) A trait object with dynamic dispatch (*)
34. B) A generic box
35. C) A compile-time dispatch
36. D) A trait alias
37. Explanation: `dyn Trait` is a fat pointer (data + vtable) dispatched at runtime; `Box` owns it on the heap.
38. Q6: Which keyword introduces a trait definition?
39. A) interface
40. B) trait (*)
41. C) impl
42. D) type
43. Explanation: `trait Name { fn ... }` declares a trait; `impl Trait for Type` implements it.
44. Q7: What does a default method in a trait do?
45. A) Must be overridden
46. B) Marks the method as default
47. C) Provides a default implementation that types may use or override (*)
48. D) Is private
49. Explanation: Default methods have a body in the trait; implementors can use them as-is or override.
50. Q8: Which trait must a type implement to be usable in a `for` loop directly?
51. A) Iterator
52. B) Iterable
53. C) For
54. D) IntoIterator (*)
55. Explanation: `for x in y` desugars to `y.into_iter()`; the type must implement `IntoIterator`.
56. Q9: When is a trait NOT object-safe?
57. A) When it has a method returning `Self` (*)
58. B) When it has any method
59. C) When it has default methods
60. D) When it has associated types
61. Explanation: Object safety fails if methods return `Self`, take `Self` by value, or have generic parameters.
62. Q10: What does `impl Trait` in return position do?
63. A) Returns a `Box<dyn Trait>`
64. B) Returns some concrete type implementing Trait, inferred by the compiler (*)
65. C) Requires dynamic dispatch
66. D) Is unstable
67. Explanation: `-> impl Iterator<Item=i32>` returns an anonymous concrete type — static dispatch, no boxing.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How are generics implemented in Rust?
  options:
    - Monomorphized — a separate copy per concrete type at compile time
    - Boxed at runtime
    - Via dynamic dispatch
    - Via type erasure
  correctIndex: 0
  explanation: Monomorphization generates a distinct function per type used, giving zero-cost abstractions with potentially larger binaries.
- id: q2
  question: "What does a trait bound `T: PartialOrd` mean?"
  options:
    - T must be ordered
    - T must implement `PartialOrd`
    - T is a partial type
    - T is partial to ord
  correctIndex: 1
  explanation: 'Trait bounds constrain generic types; `T: PartialOrd` says "T must implement PartialOrd".'
- id: q3
  question: What is the orphan rule?
  options:
    - You can't implement any trait
    - Foreign traits can't be used
    - You can implement a trait on a type only if at least one is local to your crate
    - Local types can't have foreign traits
  correctIndex: 2
  explanation: The orphan rule prevents conflicting impls across crates; use a newtype wrapper to work around it.
- id: q4
  question: Associated type vs generic parameter — which is chosen by the impl?
  options:
    - Generic parameter
    - Both
    - Neither
    - Associated type
  correctIndex: 3
  explanation: Associated types are chosen by the implementing type (one per type); generic parameters are chosen by the caller.
- id: q5
  question: What is `Box<dyn Trait>`?
  options:
    - A trait object with dynamic dispatch
    - A generic box
    - A compile-time dispatch
    - A trait alias
  correctIndex: 0
  explanation: "`dyn Trait` is a fat pointer (data + vtable) dispatched at runtime; `Box` owns it on the heap."
- id: q6
  question: Which keyword introduces a trait definition?
  options:
    - interface
    - trait
    - impl
    - type
  correctIndex: 1
  explanation: "`trait Name { fn ... }` declares a trait; `impl Trait for Type` implements it."
- id: q7
  question: What does a default method in a trait do?
  options:
    - Must be overridden
    - Marks the method as default
    - Provides a default implementation that types may use or override
    - Is private
  correctIndex: 2
  explanation: Default methods have a body in the trait; implementors can use them as-is or override.
- id: q8
  question: Which trait must a type implement to be usable in a `for` loop directly?
  options:
    - Iterator
    - Iterable
    - For
    - IntoIterator
  correctIndex: 3
  explanation: "`for x in y` desugars to `y.into_iter()`; the type must implement `IntoIterator`."
- id: q9
  question: When is a trait NOT object-safe?
  options:
    - When it has a method returning `Self`
    - When it has any method
    - When it has default methods
    - When it has associated types
  correctIndex: 0
  explanation: Object safety fails if methods return `Self`, take `Self` by value, or have generic parameters.
- id: q10
  question: What does `impl Trait` in return position do?
  options:
    - Returns a `Box<dyn Trait>`
    - Returns some concrete type implementing Trait, inferred by the compiler
    - Requires dynamic dispatch
    - Is unstable
  correctIndex: 1
  explanation: "`-> impl Iterator<Item=i32>` returns an anonymous concrete type — static dispatch, no boxing."
```

