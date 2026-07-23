---
slug: rust-variables-mutability-data-types
id: rust-02
track: rust
order: 2
title: Variables, Mutability, and Data Types
description: Declare variables, learn why Rust defaults to immutability, shadowing, constants, and the primitive and compound types.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=100s
whyItMatters: Declare variables, learn why Rust defaults to immutability, shadowing, constants, and the primitive and compound types.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Variables, Mutability, and Data Types

## Variables, Mutability, and Data Types

### Why It Matters

Declare variables, learn why Rust defaults to immutability, shadowing, constants, and the primitive and compound types.

Declare variables, learn why Rust defaults to immutability, shadowing, constants, and the primitive and compound types.

### Prerequisites

- Stage 1: Getting Started with Rust (cargo, main.rs, println!)

### Topics

- `let` bindings and immutability by default
- `let mut` for mutable bindings
- Shadowing (re-declaring with the same name, possibly a new type)
- Constants with `const` and `static`
- Scalar types: i8..i64, u8..u64, isize/usize, f32, f64, bool, char
- Compound types: tuples and arrays
- Integer overflow behavior (debug panic, release wrap)
- Type inference and explicit annotations
- String literals vs String (preview; full treatment in Stage 7)

### Key Concepts

- Variables are immutable by default; mutability is opt-in via `let mut`.
- Shadowing is distinct from mutation: it creates a new binding that can have a different type.
- `const` values are inlined at every use site and must be computable at compile time.
- Integer overflow panics in debug, wraps in release (use `wrapping_*`, `checked_*`, `saturating_*` for explicit behavior).
- `char` is a 4-byte Unicode scalar value, not a byte.

```rust
fn main() {
    let x = 5;       // immutable
    // x = 6;       // compile error
    let mut y = 5;   // mutable
    y = 6;
    println!("x={x}, y={y}");
}
```
Caption: Immutability and mut

### Common Pitfalls

- Writing `let x = 5; x = 6;` and being surprised by the "cannot assign twice to immutable variable" error — add `mut`: `let mut x = 5;`.
- Confusing shadowing with mutation — shadowing creates a new binding; the old binding still exists until end of scope, and the new one can have a totally different type.
- Using `i32` for byte data — bytes are `u8`; mixing signed `i32` with byte indexing triggers sign-extension bugs and lots of casts.
- Assuming overflow wraps in debug — debug panics on overflow; release wraps; choose explicit `wrapping_*`/`checked_*`/`saturating_*` for clarity.
- Treating `char` as a byte — `char` is 4 bytes (a Unicode scalar value); to operate on bytes use `u8`, on grapheme clusters use the `unicode-segmentation` crate.

### Real-World Applications

- Cloudflare's `pingora` framework uses fixed-size `u8` and `u16` buffers for packet headers, leveraging Rust's bounds-checked arrays to safely parse untrusted network data.
- Figma's multiplayer engine uses `f64` for canvas coordinates; immutable `let` bindings everywhere ensure no accidental mutation during CRDT merges.
- The `bstr` crate (used by ripgrep) operates on `[u8]` directly because file paths in the wild are not guaranteed UTF-8.
- Discord's Read States service uses `i64` timestamps and saturating arithmetic to avoid silent overflow on long-running counters.

### Interview Questions

- 1. Why are Rust variables immutable by default? — To make state changes explicit and auditable, helping the compiler reason about aliasing.
- 2. What's the difference between shadowing and `let mut`? — Shadowing creates a new binding (possibly with a new type); `mut` allows mutating the existing binding's value.
- 3. What does `const` mean vs `static`? — `const` is inlined at each use site with no fixed address; `static` has a fixed memory location for the program's lifetime.
- 4. What happens on integer overflow in debug vs release? — Debug panics; release wraps (two's complement) unless you use `checked_*`, `wrapping_*`, or `saturating_*`.
- 5. How big is a Rust `char`? — 4 bytes; it stores a Unicode scalar value (not a grapheme cluster, which can be multiple chars).

### Mini Project

Build a Temperature Converter CLI: A tool that converts Celsius to Fahrenheit and back, reading the value and unit from `std::env::args`. Suggested approach:
  - Parse argv with `args().collect::<Vec<_>>()`
  - Use `let mut` for an output variable
  - Convert with `as f64` casts where needed
  - Use `checked_mul`/`checked_add` to detect overflow on extreme inputs
  - Print with `println!("{:.2}", result)` for two decimals

### Exercises

1. Declare an immutable `let x = 10`, then a `let mut y = 20`; modify `y` and confirm the compiler rejects `x = 11`.
2. Shadow `let s = "100"` as `i32` using `.parse().unwrap()` and print the parsed value.
3. Create a tuple `(String, i32, bool)`, destructure it, and print each element.
4. Trigger an overflow panic in debug mode with `u8::MAX + 1`, then use `wrapping_add(1)` to make it compile and run.
5. Define a `const MAX_USERS: u32 = 1_000_000;` and use it in a function.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Are Rust variables mutable by default?
9. A) Yes, always
10. B) No — you must write `let mut` to mutate (*)
11. C) Only inside functions
12. D) Only integers
13. Explanation: Immutability is the default; `let mut` opts in to mutation, making state changes explicit.
14. Q2: What does shadowing allow that `let mut` does not?
15. A) Reassigning a value
16. B) Global scope
17. C) Reusing a name with a different type (*)
18. D) Thread safety
19. Explanation: Shadowing declares a new binding (possibly a new type); `mut` mutates an existing binding whose type is fixed.
20. Q3: What is the size of a Rust `char`?
21. A) 1 byte
22. B) 2 bytes
23. C) 8 bytes
24. D) 4 bytes (*)
25. Explanation: `char` is a 4-byte Unicode scalar value; bytes are `u8` and grapheme clusters may span multiple chars.
26. Q4: What does `let x: u8 = 255; let y = x + 1;` do in a release build?
27. A) Returns 0 due to wrapping (*)
28. B) Panics
29. C) Returns 256 as u16
30. D) Compile error
31. Explanation: Release builds wrap on overflow (two's complement); debug builds panic. Use `checked_add` for explicit handling.
32. Q5: Which keyword declares a compile-time constant?
33. A) let
34. B) const (*)
35. C) static
36. D) final
37. Explanation: `const` declares a value inlined at every use site, computed at compile time with no fixed address.
38. Q6: Which type should you use for raw byte data?
39. A) char
40. B) i32
41. C) u8 (*)
42. D) String
43. Explanation: Bytes are `u8`; `char` is a 4-byte Unicode scalar value and `String` is a UTF-8 heap buffer.
44. Q7: How do you destructure a tuple `let p = (1, 2.0);`?
45. A) `let [a, b] = p;`
46. B) `let p.0 = a;`
47. C) `unpack p into a, b;`
48. D) `let (a, b) = p;` (*)
49. Explanation: Tuple destructuring uses `let (a, b) = p;`; you can also access by index `p.0`, `p.1`.
50. Q8: What is the default integer type when you write `let n = 42;`?
51. A) i32 (*)
52. B) i8
53. C) i64
54. D) usize
55. Explanation: The compiler defaults integer literals to `i32` unless context constrains it.
56. Q9: What does `saturating_add` do on overflow?
57. A) Panics
58. B) Returns the maximum value of the type (*)
59. C) Wraps around
60. D) Returns None
61. Explanation: `saturating_add` clamps at the type's max (or min for negative overflow); `checked_add` returns `Option`.
62. Q10: Which is a valid array declaration?
63. A) `let a = [1, 2, 3];`
64. B) `let a: [i32; 3] = [1, 2, 3];`
65. C) All of the above (*)
66. D) `let a = [0; 5];` (five zeros)
67. Explanation: All three forms are valid: inferred, explicit type with length, and `[value; count]` repeat syntax.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Are Rust variables mutable by default?
  options:
    - Yes, always
    - No — you must write `let mut` to mutate
    - Only inside functions
    - Only integers
  correctIndex: 1
  explanation: Immutability is the default; `let mut` opts in to mutation, making state changes explicit.
- id: q2
  question: What does shadowing allow that `let mut` does not?
  options:
    - Reassigning a value
    - Global scope
    - Reusing a name with a different type
    - Thread safety
  correctIndex: 2
  explanation: Shadowing declares a new binding (possibly a new type); `mut` mutates an existing binding whose type is fixed.
- id: q3
  question: What is the size of a Rust `char`?
  options:
    - 1 byte
    - 2 bytes
    - 8 bytes
    - 4 bytes
  correctIndex: 3
  explanation: "`char` is a 4-byte Unicode scalar value; bytes are `u8` and grapheme clusters may span multiple chars."
- id: q4
  question: "What does `let x: u8 = 255; let y = x + 1;` do in a release build?"
  options:
    - Returns 0 due to wrapping
    - Panics
    - Returns 256 as u16
    - Compile error
  correctIndex: 0
  explanation: Release builds wrap on overflow (two's complement); debug builds panic. Use `checked_add` for explicit handling.
- id: q5
  question: Which keyword declares a compile-time constant?
  options:
    - let
    - const
    - static
    - final
  correctIndex: 1
  explanation: "`const` declares a value inlined at every use site, computed at compile time with no fixed address."
- id: q6
  question: Which type should you use for raw byte data?
  options:
    - char
    - i32
    - u8
    - String
  correctIndex: 2
  explanation: Bytes are `u8`; `char` is a 4-byte Unicode scalar value and `String` is a UTF-8 heap buffer.
- id: q7
  question: How do you destructure a tuple `let p = (1, 2.0);`?
  options:
    - "`let [a, b] = p;`"
    - "`let p.0 = a;`"
    - "`unpack p into a, b;`"
    - "`let (a, b) = p;`"
  correctIndex: 3
  explanation: Tuple destructuring uses `let (a, b) = p;`; you can also access by index `p.0`, `p.1`.
- id: q8
  question: What is the default integer type when you write `let n = 42;`?
  options:
    - i32
    - i8
    - i64
    - usize
  correctIndex: 0
  explanation: The compiler defaults integer literals to `i32` unless context constrains it.
- id: q9
  question: What does `saturating_add` do on overflow?
  options:
    - Panics
    - Returns the maximum value of the type
    - Wraps around
    - Returns None
  correctIndex: 1
  explanation: "`saturating_add` clamps at the type's max (or min for negative overflow); `checked_add` returns `Option`."
- id: q10
  question: Which is a valid array declaration?
  options:
    - "`let a = [1, 2, 3];`"
    - "`let a: [i32; 3] = [1, 2, 3];`"
    - All of the above
    - "`let a = [0; 5];` (five zeros)"
  correctIndex: 2
  explanation: "All three forms are valid: inferred, explicit type with length, and `[value; count]` repeat syntax."
```

