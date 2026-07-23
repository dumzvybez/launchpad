---
slug: rust-testing-cargo-workspaces-capstone-prep
id: rust-20
track: rust
order: 20
title: Testing, Cargo Workspaces, and Capstone Prep
description: Write unit and integration tests, use `cargo test` features, organize multi-crate projects with workspaces, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=12000s
whyItMatters: Write unit and integration tests, use `cargo test` features, organize multi-crate projects with workspaces, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Testing, Cargo Workspaces, and Capstone Prep

## Testing, Cargo Workspaces, and Capstone Prep

### Why It Matters

Write unit and integration tests, use `cargo test` features, organize multi-crate projects with workspaces, and prepare for the capstone project.

Write unit and integration tests, use `cargo test` features, organize multi-crate projects with workspaces, and prepare for the capstone project.

### Prerequisites

- Stage 19: Macros
- Stage 18: async/await and Tokio
- Stage 12: Error Handling

### Topics

- `#[test]`, `#[cfg(test)]`, `mod tests`
- `assert!`, `assert_eq!`, `assert_ne!`, `assert_matches!`
- Integration tests in `tests/` directory
- `#[should_panic]` and `Result<T, E>` test functions
- Property testing with `proptest` / `quickcheck`
- `tokio::test` for async tests
- Test coverage with `tarpaulin` or `cargo-llvm-cov`
- Cargo workspaces: root `Cargo.toml` with `[workspace]`
- Workspace dependencies (`workspace.dependencies`), shared `target/`, single `Cargo.lock`
- Continuous integration with GitHub Actions: `cargo fmt --check`, `cargo clippy`, `cargo test`
- Capstone prep: scope, milestones, and architecture

### Key Concepts

- Unit tests live in `#[cfg(test)] mod tests` inside each module; integration tests live in `tests/` and use the crate's public API.
- `cargo test` runs unit tests, integration tests, and doctests in one shot.
- `#[tokio::test]` wraps an async fn in a single-thread runtime for testing.
- A workspace groups multiple crates that share a `Cargo.lock` and `target/` directory.
- CI should run `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test` on every push.

```rust
pub fn add(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn adds_two() {
        assert_eq!(add(2, 3), 5);
    }
    #[test]
    fn negative() {
        assert_eq!(add(-1, -1), -2);
    }
}
```
Caption: Unit tests inline

### Common Pitfalls

- Tests in `tests/` can't access private items — they're external; use `#[cfg(test)] mod tests` inside the module for private tests.
- `cargo test` doesn't run doctests for unpublished dependencies by default — use `cargo test --doc` explicitly if needed.
- Forgetting `#[cfg(test)]` — non-test code in `mod tests` ships to production (and bloats the binary).
- Workspaces with `resolver = "1"` cause feature unification bugs — always use `resolver = "2"` (default in 2021 edition).
- CI only running `cargo build` — also run `cargo fmt --check` and `cargo clippy -- -D warnings` to catch style and lint issues.

### Real-World Applications

- The Tokio project uses a workspace of `tokio`, `tokio-util`, `tokio-stream`, `mio`, `tracing`, etc., sharing a single `Cargo.lock`.
- The Rust compiler itself uses a huge workspace; `cargo test` runs thousands of unit and integration tests plus UI tests.
- Cloudflare's `pingora` workspace organizes `pingora`, `pingora-proxy`, `pingora-http`, etc., with shared deps.
- `serde` uses property-style tests with `cargo-fuzz` to find parsing bugs in JSON and other formats.

### Interview Questions

- 1. What's the difference between unit and integration tests in Rust? — Unit tests live inside modules with `#[cfg(test)] mod tests` and can access private items; integration tests live in `tests/` and use only the public API.
- 2. What does `#[cfg(test)]` do? — Compiles the annotated item only when running `cargo test`, keeping test code out of release builds.
- 3. What is a Cargo workspace? — A group of crates sharing `Cargo.lock` and `target/`; enables multi-crate monorepos with shared deps.
- 4. Why prefer `resolver = "2"`? — The 2021 edition resolver avoids feature unification bugs where enabling one crate's feature pulls it in everywhere.
- 5. What should CI run on a Rust project? — `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`, and ideally `cargo deny check` for advisories.

### Mini Project

Build a Tested Math Workspace: A two-crate workspace (`math-core` library + `math-cli` binary) with unit tests for each function, integration tests in `tests/`, async tests using `tokio::test`, and a GitHub Actions workflow. Suggested approach:
  - Create the workspace root with `members = ["core", "cli"]`
  - In `core/src/lib.rs` add `add`, `factorial`, and an async `delayed_add`
  - Add `#[cfg(test)] mod tests` with `assert_eq!`
  - Add `tests/integration.rs` calling the public API
  - Add `.github/workflows/ci.yml` running fmt/clippy/test

### Exercises

1. Add a `#[cfg(test)] mod tests` block with three `#[test]` functions to an existing module.
2. Write an async test using `#[tokio::test]`.
3. Add an integration test in `tests/` that uses your crate's public API.
4. Convert a single-crate project to a workspace with `core` and `cli` members.
5. Write a GitHub Actions workflow that runs `cargo fmt --check`, `cargo clippy`, `cargo test`.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute marks a test function?
9. A) #[testing]
10. B) #[unit_test]
11. C) #[test_case]
12. D) #[test] (*)
13. Explanation: `#[test]` marks a function as a test; `cargo test` discovers and runs all `#[test]`-tagged functions.
14. Q2: Where do integration tests live?
15. A) In `tests/` directory, using the crate's public API (*)
16. B) In `src/`
17. C) Inline in `lib.rs`
18. D) In `benches/`
19. Explanation: Each file in `tests/` is a separate crate that depends on your library; it can only use public items.
20. Q3: What does `#[cfg(test)]` do?
21. A) Runs the test
22. B) Compiles the item only during `cargo test` (*)
23. C) Skips the test
24. D) Marks the test as flaky
25. Explanation: `#[cfg(test)]` conditionally compiles the item — the code is excluded from release builds, keeping tests out of production.
26. Q4: Which macro checks two values for equality in a test?
27. A) assert!
28. B) assert_equal!
29. C) assert_eq! (*)
30. D) equals!
31. Explanation: `assert_eq!(a, b)` panics if `a != b`, printing both values; `assert!(cond)` checks a boolean.
32. Q5: Which attribute wraps an async fn as a test?
33. A) #[async_test]
34. B) #[test_async]
35. C) #[test(tokio)]
36. D) #[tokio::test] (*)
37. Explanation: `#[tokio::test]` creates a current-thread Tokio runtime and awaits the async fn — the standard way to test async code.
38. Q6: What does a Cargo workspace share?
39. A) A `Cargo.lock` and `target/` directory (*)
40. B) Source code
41. C) Module paths
42. D) Test files
43. Explanation: A workspace groups crates that share one `Cargo.lock` and one `target/`, simplifying multi-crate monorepos.
44. Q7: Which `resolver` value avoids feature-unification bugs in workspaces?
45. A) "1"
46. B) "2" (*)
47. C) "2021"
48. D) "default"
49. Explanation: `resolver = "2"` (default in 2021 edition) doesn't unify features across crates, preventing surprising behavior.
50. Q8: Which command runs all tests, including doctests?
51. A) cargo run
52. B) cargo check
53. C) cargo test (*)
54. D) cargo build --tests
55. Explanation: `cargo test` runs unit tests, integration tests, and doctests in one pass; `cargo test --doc` runs only doctests.
56. Q9: What should CI typically run on a Rust project?
57. A) Only `cargo build`
58. B) Only `cargo run`
59. C) `cargo doc` only
60. D) `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test` (*)
61. Explanation: A healthy CI runs formatting check, clippy with warnings-as-errors, and the full test suite; plus optional `cargo deny check`.
62. Q10: Which crate provides property-based testing in Rust?
63. A) proptest / quickcheck (*)
64. B) faker
65. C) mockall
66. D) insta
67. Explanation: `proptest` (and `quickcheck`) generate random inputs to find counterexamples; `mockall` is for mocks and `insta` for snapshot tests.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which attribute marks a test function?
  options:
    - "#[testing]"
    - "#[unit_test]"
    - "#[test_case]"
    - "#[test]"
  correctIndex: 3
  explanation: "`#[test]` marks a function as a test; `cargo test` discovers and runs all `#[test]`-tagged functions."
- id: q2
  question: Where do integration tests live?
  options:
    - In `tests/` directory, using the crate's public API
    - In `src/`
    - Inline in `lib.rs`
    - In `benches/`
  correctIndex: 0
  explanation: Each file in `tests/` is a separate crate that depends on your library; it can only use public items.
- id: q3
  question: What does `#[cfg(test)]` do?
  options:
    - Runs the test
    - Compiles the item only during `cargo test`
    - Skips the test
    - Marks the test as flaky
  correctIndex: 1
  explanation: "`#[cfg(test)]` conditionally compiles the item — the code is excluded from release builds, keeping tests out of production."
- id: q4
  question: Which macro checks two values for equality in a test?
  options:
    - assert!
    - assert_equal!
    - assert_eq!
    - equals!
  correctIndex: 2
  explanation: "`assert_eq!(a, b)` panics if `a != b`, printing both values; `assert!(cond)` checks a boolean."
- id: q5
  question: Which attribute wraps an async fn as a test?
  options:
    - "#[async_test]"
    - "#[test_async]"
    - "#[test(tokio)]"
    - "#[tokio::test]"
  correctIndex: 3
  explanation: "`#[tokio::test]` creates a current-thread Tokio runtime and awaits the async fn — the standard way to test async code."
- id: q6
  question: What does a Cargo workspace share?
  options:
    - A `Cargo.lock` and `target/` directory
    - Source code
    - Module paths
    - Test files
  correctIndex: 0
  explanation: A workspace groups crates that share one `Cargo.lock` and one `target/`, simplifying multi-crate monorepos.
- id: q7
  question: Which `resolver` value avoids feature-unification bugs in workspaces?
  options:
    - '"1"'
    - '"2"'
    - '"2021"'
    - '"default"'
  correctIndex: 1
  explanation: "`resolver = \"2\"` (default in 2021 edition) doesn't unify features across crates, preventing surprising behavior."
- id: q8
  question: Which command runs all tests, including doctests?
  options:
    - cargo run
    - cargo check
    - cargo test
    - cargo build --tests
  correctIndex: 2
  explanation: "`cargo test` runs unit tests, integration tests, and doctests in one pass; `cargo test --doc` runs only doctests."
- id: q9
  question: What should CI typically run on a Rust project?
  options:
    - Only `cargo build`
    - Only `cargo run`
    - "`cargo doc` only"
    - "`cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`"
  correctIndex: 3
  explanation: A healthy CI runs formatting check, clippy with warnings-as-errors, and the full test suite; plus optional `cargo deny check`.
- id: q10
  question: Which crate provides property-based testing in Rust?
  options:
    - proptest / quickcheck
    - faker
    - mockall
    - insta
  correctIndex: 0
  explanation: "`proptest` (and `quickcheck`) generate random inputs to find counterexamples; `mockall` is for mocks and `insta` for snapshot tests."
```

