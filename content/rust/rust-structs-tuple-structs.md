---
slug: rust-structs-tuple-structs
id: rust-08
track: rust
order: 8
title: Structs and Tuple Structs
description: Define named-field structs, tuple structs, and unit structs; implement methods with `impl` blocks; use `#[derive]` for common traits.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=700s
whyItMatters: Define named-field structs, tuple structs, and unit structs; implement methods with `impl` blocks; use `#[derive]` for common traits.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Structs and Tuple Structs

## Structs and Tuple Structs

### Why It Matters

Define named-field structs, tuple structs, and unit structs; implement methods with `impl` blocks; use `#[derive]` for common traits.

Define named-field structs, tuple structs, and unit structs; implement methods with `impl` blocks; use `#[derive]` for common traits.

### Prerequisites

- Stage 7: Slices and String Types
- Stage 5: Ownership — The Fundamental Rule

### Topics

- Named-field structs: `struct Point { x: f64, y: f64 }`
- Tuple structs: `struct Color(u8, u8, u8)`
- Unit structs: `struct Marker;`
- Field init shorthand: `Point { x, y }`
- Struct update syntax: `Point { ..other }` (moves remaining fields)
- `impl` blocks and methods
- Associated functions (`Self::new`), `&self`, `&mut self`, `self`
- `#[derive(Debug, Clone, Copy, PartialEq)]`
- Tuple struct field access `c.0`, `c.1`

### Key Concepts

- A struct's fields are private by default; `pub` is needed to expose them across modules.
- `&self` borrows shared, `&mut self` borrows mutable, `self` takes ownership.
- Associated functions (no `self`) are like static methods; called as `Type::name(...)`.
- Struct update syntax moves the unlisted fields out of the source struct.
- `#[derive(Debug)]` adds `{:?}` formatting; `#[derive(Clone)]` adds deep-clone for non-Copy types.

```rust
#[derive(Debug, Clone)]
struct Rectangle { width: f64, height: f64 }

impl Rectangle {
    fn new(width: f64, height: f64) -> Self {
        Rectangle { width, height }
    }
    fn area(&self) -> f64 { self.width * self.height }
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }
}

fn main() {
    let mut r = Rectangle::new(10.0, 5.0);
    println!("{:?}", r);
    println!("area = {}", r.area());
    r.scale(2.0);
    println!("area = {}", r.area());
}
```
Caption: Named-field struct with impl

### Common Pitfalls

- Calling `self.method()` after moving `self` — once consumed, the value is gone; use `&self` if you need to keep using it.
- Forgetting `#[derive(Debug)]` — `println!("{:?}", s)` fails with "`Point` doesn't implement `Debug`".
- Struct update syntax moving fields out of the source — `Point { x: 1.0, ..p1 }` moves the remaining fields, invalidating `p1` (unless they're `Copy`).
- Trying to mutate through `&self` — needs `&mut self`; the borrow checker catches this at the call site.
- Making fields `pub` when only `pub(crate)` is needed — prefer the narrowest visibility; `pub` invites external mutation.

### Real-World Applications

- The `time` crate models instants and durations as newtype tuple structs wrapping `i64`/`u64` nanoseconds.
- `serde` uses derive macros heavily — `#[derive(Serialize, Deserialize)]` on structs drives the whole ecosystem.
- Cloudflare's `pingora` models HTTP requests/responses as structs with `impl` methods for header access and body streaming.
- Figma's CRDT engine uses tuple structs (`NodeId(u64)`, `OpId(u64)`) to give type safety to what would otherwise be raw integers.

### Interview Questions

- 1. What's the difference between a method (`&self`) and an associated function (`Self::name`)? — Methods take `self` and are called as `x.method()`; associated functions don't and are called as `Type::name()`.
- 2. What does `#[derive(Debug)]` do? — Generates a `Debug` impl so the type can be formatted with `{:?}`/`{:#?}`.
- 3. What is struct update syntax `Point { x: 1.0, ..p1 }`? — Takes the unspecified fields from `p1`, moving them (if non-Copy) out of `p1`.
- 4. When do you use a tuple struct? — When the field name would be redundant; common for newtype wrappers like `struct Meters(f64)`.
- 5. What does `self` (not `&self`) in a method signature mean? — The method takes ownership, consuming the receiver; the caller cannot use it afterward.

### Mini Project

Build a 2D Geometry Library: A `Point` and `Rectangle` type with methods for area, perimeter, translation, and `contains`. Suggested approach:
  - Define `Point { x: f64, y: f64 }` and `Rectangle { top_left: Point, size: Point }`
  - Add `Rectangle::new`, `area(&self)`, `contains(&self, p: &Point) -> bool`
  - Derive `Debug`, `Clone`, `Copy`, `PartialEq`
  - Add `translate(&mut self, dx: f64, dy: f64)`
  - Write a small test in `main` printing two rectangles and overlap check

### Exercises

1. Define a `User` struct with `String` fields and derive `Debug`; print it.
2. Add a `::new` associated function and a `birthday(&mut self)` method.
3. Create a newtype `struct Email(String)` with an `as_str(&self) -> &str` method.
4. Use struct update syntax and observe that non-Copy fields are moved.
5. Implement `into_inner(self) -> Vec<u8>` on a wrapper and confirm the wrapper is consumed.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you define a method that mutates the receiver?
9. A) `fn f(self)`
10. B) `fn f(mut self)`
11. C) `fn f(&self, mut)`
12. D) `fn f(&mut self)` (*)
13. Explanation: `&mut self` borrows the receiver mutably so the method can modify it without taking ownership.
14. Q2: What's an associated function (no `self`) called like?
15. A) `Type::name(...)` (*)
16. B) `x.method()`
17. C) `name(Type)`
18. D) `Type->name()`
19. Explanation: Associated functions (often constructors like `String::new`) are called via `Type::name(...)`.
20. Q3: What does `#[derive(Debug)]` generate?
21. A) A default constructor
22. B) An impl of `Debug` for `{:?}` formatting (*)
23. C) A copy constructor
24. D) A thread-safe wrapper
25. Explanation: `Debug` lets you use `{:?}` and `{:#?}` to print the struct for development.
26. Q4: What does `Point { x: 1.0, ..p1 }` do?
27. A) Copies p1 entirely
28. B) Borrows p1
29. C) Takes the unspecified fields from p1, moving non-Copy ones (*)
30. D) Compile error
31. Explanation: Struct update syntax fills remaining fields from `p1`; non-Copy fields are moved out.
32. Q5: What is a tuple struct's first field accessed as?
33. A) `t.first`
34. B) `t[0]`
35. C) `t._0`
36. D) `t.0` (*)
37. Explanation: Tuple struct fields are accessed by zero-based index: `t.0`, `t.1`, etc.
38. Q6: What is a unit struct?
39. A) A struct with no fields: `struct Marker;` (*)
40. B) A struct with one field
41. C) A struct that returns ()
42. D) A struct of unit type
43. Explanation: Unit structs have no data and are zero-sized; useful as trait targets or markers.
44. Q7: What does `self` (not `&self`) as a receiver mean?
45. A) Borrow shared
46. B) Take ownership — the caller's value is consumed (*)
47. C) Borrow mutable
48. D) Compile error
49. Explanation: `self` moves the receiver into the method; the caller cannot use it afterward.
50. Q8: Why would you use a newtype like `struct Meters(f64)`?
51. A) To avoid allocation
52. B) To allow inheritance
53. C) To give type safety — Meters and Feet are distinct types (*)
54. D) To enable GC
55. Explanation: Newtypes prevent mixing distinct units (Meters vs Feet) at compile time with zero runtime cost.
56. Q9: What is `Self` inside an `impl` block?
57. A) The trait being implemented
58. B) The module path
59. C) A generic parameter
60. D) An alias for the type the `impl` is for (*)
61. Explanation: `Self` refers to the implementing type, handy for constructors like `fn new() -> Self`.
62. Q10: Why might you prefer `pub(crate)` over `pub` for a field?
63. A) Narrower visibility — only this crate can access, not external users (*)
64. B) Faster access
65. C) It's required for derive
66. D) It enables Copy
67. Explanation: `pub(crate)` exposes to your crate only, which is safer than `pub` for internal helpers.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you define a method that mutates the receiver?
  options:
    - "`fn f(self)`"
    - "`fn f(mut self)`"
    - "`fn f(&self, mut)`"
    - "`fn f(&mut self)`"
  correctIndex: 3
  explanation: "`&mut self` borrows the receiver mutably so the method can modify it without taking ownership."
- id: q2
  question: What's an associated function (no `self`) called like?
  options:
    - "`Type::name(...)`"
    - "`x.method()`"
    - "`name(Type)`"
    - "`Type->name()`"
  correctIndex: 0
  explanation: Associated functions (often constructors like `String::new`) are called via `Type::name(...)`.
- id: q3
  question: What does `#[derive(Debug)]` generate?
  options:
    - A default constructor
    - An impl of `Debug` for `{:?}` formatting
    - A copy constructor
    - A thread-safe wrapper
  correctIndex: 1
  explanation: "`Debug` lets you use `{:?}` and `{:#?}` to print the struct for development."
- id: q4
  question: "What does `Point { x: 1.0, ..p1 }` do?"
  options:
    - Copies p1 entirely
    - Borrows p1
    - Takes the unspecified fields from p1, moving non-Copy ones
    - Compile error
  correctIndex: 2
  explanation: Struct update syntax fills remaining fields from `p1`; non-Copy fields are moved out.
- id: q5
  question: What is a tuple struct's first field accessed as?
  options:
    - "`t.first`"
    - "`t[0]`"
    - "`t._0`"
    - "`t.0`"
  correctIndex: 3
  explanation: "Tuple struct fields are accessed by zero-based index: `t.0`, `t.1`, etc."
- id: q6
  question: What is a unit struct?
  options:
    - "A struct with no fields: `struct Marker;`"
    - A struct with one field
    - A struct that returns ()
    - A struct of unit type
  correctIndex: 0
  explanation: Unit structs have no data and are zero-sized; useful as trait targets or markers.
- id: q7
  question: What does `self` (not `&self`) as a receiver mean?
  options:
    - Borrow shared
    - Take ownership — the caller's value is consumed
    - Borrow mutable
    - Compile error
  correctIndex: 1
  explanation: "`self` moves the receiver into the method; the caller cannot use it afterward."
- id: q8
  question: Why would you use a newtype like `struct Meters(f64)`?
  options:
    - To avoid allocation
    - To allow inheritance
    - To give type safety — Meters and Feet are distinct types
    - To enable GC
  correctIndex: 2
  explanation: Newtypes prevent mixing distinct units (Meters vs Feet) at compile time with zero runtime cost.
- id: q9
  question: What is `Self` inside an `impl` block?
  options:
    - The trait being implemented
    - The module path
    - A generic parameter
    - An alias for the type the `impl` is for
  correctIndex: 3
  explanation: "`Self` refers to the implementing type, handy for constructors like `fn new() -> Self`."
- id: q10
  question: Why might you prefer `pub(crate)` over `pub` for a field?
  options:
    - Narrower visibility — only this crate can access, not external users
    - Faster access
    - It's required for derive
    - It enables Copy
  correctIndex: 0
  explanation: "`pub(crate)` exposes to your crate only, which is safer than `pub` for internal helpers."
```

