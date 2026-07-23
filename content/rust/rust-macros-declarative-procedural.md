---
slug: rust-macros-declarative-procedural
id: rust-19
track: rust
order: 19
title: Macros — declarative and procedural
description: Write `macro_rules!` declarative macros for code generation, understand procedural macros (derive, attribute, function-like), and use `vec![]`/`println!` patterns.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=10500s
whyItMatters: Write `macro_rules!` declarative macros for code generation, understand procedural macros (derive, attribute, function-like), and use `vec![]`/`println!` patterns.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Macros — declarative and procedural

## Macros — declarative and procedural

### Why It Matters

Write `macro_rules!` declarative macros for code generation, understand procedural macros (derive, attribute, function-like), and use `vec![]`/`println!` patterns.

Write `macro_rules!` declarative macros for code generation, understand procedural macros (derive, attribute, function-like), and use `vec![]`/`println!` patterns.

### Prerequisites

- Stage 13: Generics and Traits
- Stage 10: The Module System

### Topics

- `macro_rules!` syntax and matchers
- Token Tree types: ident, expr, tt, ty, literal, block, stmt
- Repetition: `$(...),*` and `$(...),+` and separators
- Hygiene: identifiers introduced by the macro don't collide
- `vec![]`, `println!`, `format!`, `assert_eq!` as case studies
- Procedural macros: derive, attribute, function-like
- `#[derive(Debug, Clone, ...)]` under the hood
- `proc-macro2`, `syn`, `quote` crates for proc-macro authoring
- `macro_export` and the macro prelude

### Key Concepts

- Declarative macros match patterns of tokens and produce tokens; they run before the type checker.
- Hygiene prevents macro-introduced identifiers from clashing with caller identifiers (mostly; item-position is not fully hygienic).
- Repetition syntax `$(x),*` matches zero or more comma-separated; `+` matches one or more.
- Procedural macros are Rust functions that take a `TokenStream` and produce one; they live in a separate `proc-macro = true` crate.
- `#[derive(MyTrait)]` invokes a derive macro that generates an `impl MyTrait` block.

```rust
macro_rules! say_hello {
    () => { println!("hello!"); };
    ($name:expr) => { println!("hello, {}!", $name); };
}

fn main() {
    say_hello!();          // hello!
    say_hello!("Ada");     // hello, Ada!
}
```
Caption: Basic macro_rules!

### Common Pitfalls

- Macro hygiene surprises — `$x` is hygienic, but `let` bindings introduced by the macro can shadow or fail to capture caller-side bindings.
- Missing arms — `macro_rules!` matches top-to-bottom; an unhandled pattern produces a confusing error.
- Forgetting that macros run before type checking — type errors appear at the macro output, not the macro definition, which can mislead.
- Trying to call a macro before it's defined — macros must be in scope (`use crate::my_macro;`) and defined before use in source order within a crate (or via `#[macro_export]`).
- Procedural macros in the same crate as their use — proc-macros must live in a separate `proc-macro = true` crate, often called `foo_macros` next to `foo`.

### Real-World Applications

- `serde` uses derive macros (`#[derive(Serialize, Deserialize)]`) to generate serialization code — the most-used proc-macro in the ecosystem.
- `tokio::main` and `tokio::macro_main` wrap a function with runtime setup.
- `thiserror`'s `#[derive(Error)]` generates `Display`, `Error`, and `From` impls from `#[error("...")]` attributes.
- `tracing::instrument` is an attribute proc-macro that wraps a function to emit span traces.

### Interview Questions

- 1. What's the difference between declarative (`macro_rules!`) and procedural macros? — Declarative match token patterns; procedural are Rust functions over `TokenStream` (can use `syn`/`quote`).
- 2. What is macro hygiene? — Identifiers introduced by a macro don't collide with caller identifiers (mostly); prevents accidental capture.
- 3. What does `$($x:expr),*` match? — Zero or more comma-separated expressions; use `+` instead of `*` for one-or-more.
- 4. Where must procedural macros live? — In a separate crate with `proc-macro = true` in `Cargo.toml`.
- 5. What does `#[derive(Trait)]` actually do? — Invokes a derive proc-macro that generates an `impl Trait for Type` block.

### Mini Project

Build a `vec2!` Macro and a Custom `Debug`-Like Derive Stub: Write `macro_rules! vec2` supporting `vec2!(1, 2, 3)` and `vec2!(0; 5)`. Then sketch a `HelloWorld` derive macro that prints the type name. Suggested approach:
  - Write `macro_rules! vec2` with two arms
  - Test it with various element types
  - Create a separate crate `hello_derive` with `proc-macro = true`
  - Define `#[proc_macro_derive(HelloWorld)]` that emits a `hello()` method
  - Use the derive in the main crate

### Exercises

1. Write `macro_rules! max` taking two `expr`s and returning the larger.
2. Write a `vec!`-like macro using `$(...),*` repetition.
3. Add an arm matching a single expr for a fallback.
4. Write a procedural macro stub (in a separate crate) that emits a `Hello` trait impl.
5. Use `#[derive(HelloMacro)]` on a struct and call the generated method.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which keyword defines a declarative macro?
9. A) macro
10. B) define
11. C) macro_rules! (*)
12. D) macro_def
13. Explanation: `macro_rules! name { ... }` declares a declarative (pattern-matching) macro.
14. Q2: What does `$x:expr` match?
15. A) Any single token
16. B) A type
17. C) An identifier
18. D) An expression (*)
19. Explanation: `:expr` matches a complete expression; `:ident` matches an identifier, `:tt` matches a single token tree.
20. Q3: What does `$( $x ),*` match?
21. A) Zero or more comma-separated matches (*)
22. B) Exactly one expression
23. C) One or more
24. D) A range
25. Explanation: `*` is zero-or-more; `+` is one-or-more; the `,` is the separator between matches.
26. Q4: What is macro hygiene?
27. A) Macros must be clean
28. B) Identifiers introduced by a macro don't collide with caller identifiers (*)
29. C) Macros auto-format code
30. D) Macros reject invalid syntax
31. Explanation: Hygiene prevents accidental capture of caller bindings by macro-introduced identifiers (with some item-level caveats).
32. Q5: Where must procedural macros live?
33. A) Anywhere
34. B) In the binary crate
35. C) In a separate crate with `proc-macro = true` (*)
36. D) In the standard library
37. Explanation: Procedural macros must be in a crate marked `proc-macro = true` so the compiler treats them specially.
38. Q6: Which crate parses Rust syntax in proc-macros?
39. A) proc-macro2
40. B) quote
41. C) regex
42. D) syn (*)
43. Explanation: `syn` parses a `TokenStream` into a syntax tree; `quote!` produces tokens; `proc-macro2` provides a stable wrapper API.
44. Q7: What does `#[derive(Debug)]` generate?
45. A) An `impl Debug for Type` (*)
46. B) A debug print of the type
47. C) A println
48. D) A type alias
49. Explanation: The derive macro generates an `impl` block implementing `Debug` so you can use `{:?}` / `{:#?}`.
50. Q8: Which macro crates the `vec![1, 2, 3]` syntax?
51. A) A proc-macro
52. B) A declarative `macro_rules!` macro (*)
53. C) A builtin function
54. D) A const fn
55. Explanation: `vec!` is a `macro_rules!` macro that expands to a `Vec` construction with `push` calls or `from_elem`.
56. Q9: When do declarative macros run?
57. A) At runtime
58. B) After type checking
59. C) Before type checking — at expansion time (*)
60. D) At link time
61. Explanation: Macros expand during parsing, before type checking; type errors in the expanded code are reported at the call site.
62. Q10: What does the `quote!` macro do?
63. A) Parses a TokenStream
64. B) Escapes strings
65. C) Generates random data
66. D) Produces a `TokenStream` from quasi-Rust code (*)
67. Explanation: `quote! { ... }` produces a `proc_macro2::TokenStream`, with `#ident` interpolation, used in proc-macros to generate code.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which keyword defines a declarative macro?
  options:
    - macro
    - define
    - macro_rules!
    - macro_def
  correctIndex: 2
  explanation: "`macro_rules! name { ... }` declares a declarative (pattern-matching) macro."
- id: q2
  question: What does `$x:expr` match?
  options:
    - Any single token
    - A type
    - An identifier
    - An expression
  correctIndex: 3
  explanation: "`:expr` matches a complete expression; `:ident` matches an identifier, `:tt` matches a single token tree."
- id: q3
  question: What does `$( $x ),*` match?
  options:
    - Zero or more comma-separated matches
    - Exactly one expression
    - One or more
    - A range
  correctIndex: 0
  explanation: "`*` is zero-or-more; `+` is one-or-more; the `,` is the separator between matches."
- id: q4
  question: What is macro hygiene?
  options:
    - Macros must be clean
    - Identifiers introduced by a macro don't collide with caller identifiers
    - Macros auto-format code
    - Macros reject invalid syntax
  correctIndex: 1
  explanation: Hygiene prevents accidental capture of caller bindings by macro-introduced identifiers (with some item-level caveats).
- id: q5
  question: Where must procedural macros live?
  options:
    - Anywhere
    - In the binary crate
    - In a separate crate with `proc-macro = true`
    - In the standard library
  correctIndex: 2
  explanation: Procedural macros must be in a crate marked `proc-macro = true` so the compiler treats them specially.
- id: q6
  question: Which crate parses Rust syntax in proc-macros?
  options:
    - proc-macro2
    - quote
    - regex
    - syn
  correctIndex: 3
  explanation: "`syn` parses a `TokenStream` into a syntax tree; `quote!` produces tokens; `proc-macro2` provides a stable wrapper API."
- id: q7
  question: What does `#[derive(Debug)]` generate?
  options:
    - An `impl Debug for Type`
    - A debug print of the type
    - A println
    - A type alias
  correctIndex: 0
  explanation: The derive macro generates an `impl` block implementing `Debug` so you can use `{:?}` / `{:#?}`.
- id: q8
  question: Which macro crates the `vec![1, 2, 3]` syntax?
  options:
    - A proc-macro
    - A declarative `macro_rules!` macro
    - A builtin function
    - A const fn
  correctIndex: 1
  explanation: "`vec!` is a `macro_rules!` macro that expands to a `Vec` construction with `push` calls or `from_elem`."
- id: q9
  question: When do declarative macros run?
  options:
    - At runtime
    - After type checking
    - Before type checking — at expansion time
    - At link time
  correctIndex: 2
  explanation: Macros expand during parsing, before type checking; type errors in the expanded code are reported at the call site.
- id: q10
  question: What does the `quote!` macro do?
  options:
    - Parses a TokenStream
    - Escapes strings
    - Generates random data
    - Produces a `TokenStream` from quasi-Rust code
  correctIndex: 3
  explanation: "`quote! { ... }` produces a `proc_macro2::TokenStream`, with `#ident` interpolation, used in proc-macros to generate code."
```

