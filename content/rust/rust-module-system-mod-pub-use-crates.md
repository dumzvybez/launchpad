---
slug: rust-module-system-mod-pub-use-crates
id: rust-10
track: rust
order: 10
title: The Module System — mod, pub, use, crates
description: Organize code into modules and crates, control visibility with `pub`, bring items into scope with `use`, and understand crate roots and paths.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=900s
whyItMatters: Organize code into modules and crates, control visibility with `pub`, bring items into scope with `use`, and understand crate roots and paths.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# The Module System — mod, pub, use, crates

## The Module System — mod, pub, use, crates

### Why It Matters

Organize code into modules and crates, control visibility with `pub`, bring items into scope with `use`, and understand crate roots and paths.

Organize code into modules and crates, control visibility with `pub`, bring items into scope with `use`, and understand crate roots and paths.

### Prerequisites

- Stage 9: Enums, Pattern Matching, and Option
- Stage 4: Functions and Comments

### Topics

- `mod foo { ... }` and `mod foo;` (file-backed modules)
- Crate roots: `src/main.rs` (binary), `src/lib.rs` (library)
- `pub` for functions, structs, fields, and enum variants
- `pub(crate)`, `pub(super)`, `pub(in path)` visibility
- `use` for importing, `use ... as ...` for renaming
- Re-exports with `pub use`
- Module paths: `crate::`, `super::`, `self::`, absolute paths
- Workspaces (multi-crate repos) — preview, full treatment in Stage 20
- Cargo dependencies vs path dependencies vs dev-dependencies

### Key Concepts

- A crate is the unit of compilation; a module is a namespace inside a crate.
- Items are private by default; `pub` is required to expose them.
- Struct fields are private even when the struct is `pub`; you must `pub` each field individually.
- Enum variants inherit the enum's visibility — `pub enum` makes all variants `pub`.
- The 2018+ edition lets you write `use crate::foo::bar` (absolute) or `use foo::bar` for extern crates.

```rust
// src/lib.rs
pub mod network {
    pub mod tcp {
        pub fn connect(addr: &str) -> bool { true }
        fn retry() {} // private
    }
}

pub use network::tcp::connect as tcp_connect;  // re-export
```
Caption: Module hierarchy in lib.rs

### Common Pitfalls

- Marking a struct `pub` but its fields private — external code can't construct or read fields; either `pub` the fields or add a `new()` constructor.
- Using `mod foo;` without creating `foo.rs` or `foo/mod.rs` — compile error "file not found for module `foo`".
- Forgetting to re-export — a deeply nested `pub` item is only accessible via its full path; add `pub use` to surface it.
- Importing the same name from two crates without rename — `use a::Foo; use b::Foo;` errors; rename one with `as`.
- Confusing `crate::` (current crate root) with `super::` (parent module) and `self::` (current module).

### Real-World Applications

- The `tokio` crate uses a deep module tree with `pub use` re-exports at the root so users only need `use tokio::{spawn, sync::mpsc};`.
- `serde` re-exports derives behind a `#[derive(Serialize, Deserialize)]` feature flag — the module system drives the public API.
- Cloudflare's `pingora` organizes its code into `server`, `proxy`, `protocols`, `upstreams` modules, each `pub` selectively.
- The `clap` crate (CLI parsing) uses `pub use` to expose a flat top-level API despite an internal hierarchy.

### Interview Questions

- 1. What's the difference between a crate and a module? — A crate is the compilation unit (a binary or library); a module is a namespace inside a crate.
- 2. What does `pub` mean for a struct's fields? — Field visibility is independent; even a `pub struct`'s fields are private unless explicitly `pub`.
- 3. What does `pub use` do? — Re-exports an item from a different path, useful for surfacing deeply nested items at a clean API path.
- 4. How does Rust find `mod server;`? — Looks for `server.rs` or `server/mod.rs` in the current module's directory.
- 5. What's the difference between `crate::`, `super::`, and `self::`? — `crate::` is absolute from crate root, `super::` is the parent module, `self::` is the current module.

### Mini Project

Build a Multi-Module Math Crate: A library with `mod arithmetic` (add, sub, mul, div), `mod geometry` (area functions), and `mod stats` (mean, max). Re-export the most-used items at the crate root. Suggested approach:
  - `cargo new math --lib`
  - Create `arithmetic.rs`, `geometry.rs`, `stats.rs`
  - Declare each via `pub mod` in `lib.rs`
  - Add `pub use arithmetic::add;` to re-export
  - In a binary in `examples/`, import only the top-level names

### Exercises

1. Create `src/lib.rs` with `pub mod network;` and a `network.rs` file with a `pub fn ping()`.
2. Add a private function in `network` and try to call it from `main.rs`; observe the error.
3. Use `pub use` to re-export `network::ping` at the crate root.
4. Build a struct with one `pub` field and one private field; construct it via a `new` method.
5. Use `use std::collections::HashMap as Map;` to rename an import.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a crate in Rust?
9. A) A namespace inside a file
10. B) The unit of compilation (a binary or library) (*)
11. C) A dependency
12. D) A macro
13. Explanation: A crate is the compilation unit; a module is a namespace inside a crate.
14. Q2: What's the default visibility of items?
15. A) pub
16. B) pub(crate)
17. C) private (*)
18. D) pub(super)
19. Explanation: Items are private by default; you must add `pub` (or `pub(crate)`, etc.) to expose them.
20. Q3: If a struct is `pub`, are its fields also `pub`?
21. A) Yes
22. B) Only in the same module
23. C) Only the first field
24. D) No — each field must be marked `pub` separately (*)
25. Explanation: Field visibility is independent of the struct's; you must `pub` each field or add a constructor.
26. Q4: What does `pub use` do?
27. A) Re-exports an item under a new path (*)
28. B) Imports privately
29. C) Marks a use as deprecated
30. D) Generates docs
31. Explanation: `pub use` re-exports, surfacing a deeply nested item at a cleaner API path.
32. Q5: Where does `mod server;` look for the module body?
33. A) Anywhere in the project
34. B) `server.rs` or `server/mod.rs` in the current module's directory (*)
35. C) Only in `src/`
36. D) In `target/`
37. Explanation: Rust convention looks for `server.rs` or `server/mod.rs` adjacent to the current module.
38. Q6: What does `crate::` mean in a path?
39. A) An external dependency
40. B) The parent module
41. C) The current crate's root (*)
42. D) The standard library
43. Explanation: `crate::` is absolute from the current crate's root; `super::` is the parent module.
44. Q7: Which keyword brings an item into scope?
45. A) import
46. B) include
47. C) require
48. D) use (*)
49. Explanation: `use std::collections::HashMap;` brings `HashMap` into the current scope.
50. Q8: How do you rename an import?
51. A) `use foo as bar;` (*)
52. B) `use foo -> bar;`
53. C) `import foo as bar;`
54. D) `use foo => bar;`
55. Explanation: `use foo::Foo as MyFoo;` brings `Foo` in as `MyFoo`.
56. Q9: Which visibility means "visible anywhere in this crate, not externally"?
57. A) pub
58. B) pub(crate) (*)
59. C) pub(super)
60. D) pub(in path)
61. Explanation: `pub(crate)` exposes the item to the whole crate but not to external users.
62. Q10: What's a workspace?
63. A) A single crate
64. B) An IDE feature
65. C) A collection of crates sharing a Cargo.lock and target dir (*)
66. D) A branch in git
67. Explanation: A Cargo workspace groups multiple crates that share one `Cargo.lock` and `target/` directory, useful for monorepos.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a crate in Rust?
  options:
    - A namespace inside a file
    - The unit of compilation (a binary or library)
    - A dependency
    - A macro
  correctIndex: 1
  explanation: A crate is the compilation unit; a module is a namespace inside a crate.
- id: q2
  question: What's the default visibility of items?
  options:
    - pub
    - pub(crate)
    - private
    - pub(super)
  correctIndex: 2
  explanation: Items are private by default; you must add `pub` (or `pub(crate)`, etc.) to expose them.
- id: q3
  question: If a struct is `pub`, are its fields also `pub`?
  options:
    - Yes
    - Only in the same module
    - Only the first field
    - No — each field must be marked `pub` separately
  correctIndex: 3
  explanation: Field visibility is independent of the struct's; you must `pub` each field or add a constructor.
- id: q4
  question: What does `pub use` do?
  options:
    - Re-exports an item under a new path
    - Imports privately
    - Marks a use as deprecated
    - Generates docs
  correctIndex: 0
  explanation: "`pub use` re-exports, surfacing a deeply nested item at a cleaner API path."
- id: q5
  question: Where does `mod server;` look for the module body?
  options:
    - Anywhere in the project
    - "`server.rs` or `server/mod.rs` in the current module's directory"
    - Only in `src/`
    - In `target/`
  correctIndex: 1
  explanation: Rust convention looks for `server.rs` or `server/mod.rs` adjacent to the current module.
- id: q6
  question: What does `crate::` mean in a path?
  options:
    - An external dependency
    - The parent module
    - The current crate's root
    - The standard library
  correctIndex: 2
  explanation: "`crate::` is absolute from the current crate's root; `super::` is the parent module."
- id: q7
  question: Which keyword brings an item into scope?
  options:
    - import
    - include
    - require
    - use
  correctIndex: 3
  explanation: "`use std::collections::HashMap;` brings `HashMap` into the current scope."
- id: q8
  question: How do you rename an import?
  options:
    - "`use foo as bar;`"
    - "`use foo -> bar;`"
    - "`import foo as bar;`"
    - "`use foo => bar;`"
  correctIndex: 0
  explanation: "`use foo::Foo as MyFoo;` brings `Foo` in as `MyFoo`."
- id: q9
  question: Which visibility means "visible anywhere in this crate, not externally"?
  options:
    - pub
    - pub(crate)
    - pub(super)
    - pub(in path)
  correctIndex: 1
  explanation: "`pub(crate)` exposes the item to the whole crate but not to external users."
- id: q10
  question: What's a workspace?
  options:
    - A single crate
    - An IDE feature
    - A collection of crates sharing a Cargo.lock and target dir
    - A branch in git
  correctIndex: 2
  explanation: A Cargo workspace groups multiple crates that share one `Cargo.lock` and `target/` directory, useful for monorepos.
```

