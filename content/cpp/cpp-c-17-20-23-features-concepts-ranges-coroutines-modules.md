---
slug: cpp-c-17-20-23-features-concepts-ranges-coroutines-modules
id: cpp-17
track: cpp
order: 17
title: C++17/20/23 Features — Concepts, Ranges, Coroutines, Modules
description: "Tour the headline features of modern C++: constexpr if, fold expressions (recap), concepts, ranges, coroutines, modules, std::optional / std::variant / std::expected, and std::span."
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=800s
whyItMatters: "Tour the headline features of modern C++: constexpr if, fold expressions (recap), concepts, ranges, coroutines, modules, std::optional / std::variant / std::expected, and std::span."
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# C++17/20/23 Features — Concepts, Ranges, Coroutines, Modules

## C++17/20/23 Features — Concepts, Ranges, Coroutines, Modules

### Why It Matters

Tour the headline features of modern C++: constexpr if, fold expressions (recap), concepts, ranges, coroutines, modules, std::optional / std::variant / std::expected, and std::span.

Tour the headline features of modern C++: constexpr if, fold expressions (recap), concepts, ranges, coroutines, modules, std::optional / std::variant / std::expected, and std::span.

### Prerequisites

- Stage 1-16 (especially templates and lambdas)

### Topics

- C++17: constexpr if, fold expressions, structured bindings, std::optional, std::variant, std::any, std::string_view, std::filesystem, std::span (C++20)
- C++20: Concepts, Ranges, Coroutines, Modules, three-way comparison (<=>), std::format
- C++23: std::expected, std::print, std::print_buffer, explicit object parameter (deducing this), std::mdspan
- if constexpr (recap)
- std::visit and overloaded pattern
- Ranges composability: views::filter | views::transform
- Coroutines: co_await, co_yield, co_return, promise_type
- Modules: export module, import, interface vs implementation units

### Key Concepts

- if constexpr (C++17) discards the false branch at compile time — essential for templated code that branches on type traits.
- Concepts (C++20) replace SFINAE with readable constraints: `template<typename T> requires std::integral<T>` or `template<std::integral T>`.
- Ranges (C++20) compose: `views::filter(...) | views::transform(...)` is lazy and chainable.
- Coroutines (C++20) are stackless: the compiler transforms the function into a state machine; you provide a promise_type.
- Modules (C++20) replace headers for faster, more isolated compilation: `export module foo;` / `import foo;`.
- std::optional<T> is "T or nothing"; std::variant<T...> is a type-safe union; std::expected<T, E> (C++23) is "T or error E".
- std::span<T> (C++20) is a non-owning view over a contiguous sequence — the modern pointer + length.

```cpp
#include <concepts>
#include <iostream>

// C++20 concept syntax
template<std::integral T>
T gcd(T a, T b) {
    while (b != 0) { T t = b; b = a % b; a = t; }
    return a;
}

// gcd(12, 8);     // OK
// gcd(1.5, 2.5);  // ERROR: double does not satisfy std::integral — clear message
```
Caption: Concepts replace SFINAE

### Common Pitfalls

- Coroutine lifetimes — the coroutine frame is heap-allocated and lives until final_suspend; if you don't manage the handle, you leak or use-after-free.
- Concepts not enforced because of template fallback — older SFINAE overloads may still pick up; remove legacy SFINAE when migrating to concepts.
- Ranges evaluation timing — views are lazy; you only compute when iterating. Forgetting to iterate gives you no work.
- Modules build system support — CMake, Bazel, and compiler support are still maturing; not all build tools handle .cppm files identically.
- std::variant index drift — adding a new alternative shifts indexes; use std::visit with overloaded lambdas rather than raw index access.

### Real-World Applications

- Bloomberg's BDE has been migrating to concepts for clearer template constraints in their public API.
- Unreal Engine 5 uses C++20 features in newer modules (concepts for template constraints, ranges for editor iteration).
- Facebook's folly library uses std::variant and std::optional extensively for nullable and sum-type values.
- Clang itself is being modularized; C++20 modules are an active migration target for the LLVM codebase to cut compile times.

### Interview Questions

- 1. What does if constexpr do? — Discards the false branch at compile time (no instantiation); essential for template code branching on type traits.
- 2. What is a C++20 concept? — A named set of constraints on template parameters, replacing SFINAE with readable error messages: `template<std::integral T>`.
- 3. What are Ranges? — A C++20 library of composable, lazy view adapters: `vec | views::filter(p) | views::transform(f)`.
- 4. What is a coroutine and what does the compiler do? — A stackless coroutine is compiled into a state machine + frame; you provide a promise_type. co_await, co_yield, co_return are the keywords.
- 5. What problem do C++20 modules solve? — Headers cause ODR conflicts and slow recompiles; modules provide isolation, faster builds, and better macro hygiene.

### Mini Project

Build a JSON Parser with std::variant: A small JSON value type using std::variant, with std::visit-based pretty-printing. Suggested approach:
  - Define `using JsonValue = std::variant<std::nullptr_t, bool, double, std::string, std::vector<JsonValue>, std::map<std::string, JsonValue>>;`
  - Recursive descent parser consuming std::string_view
  - Pretty-printer using std::visit with overloaded lambdas (C++17)
  - Use std::optional<JsonValue> for parse errors
  - Add a CLI that reads a JSON file and pretty-prints it

### Exercises

1. Replace a SFINAE-enabled template with a concept; call it with int (OK) and double (clear error message).
2. Build a range pipeline: filter even, transform to square, take first 5; print the result.
3. Use if constexpr to write a generic print function that handles containers and scalars differently.
4. Write a coroutine generator that yields Fibonacci numbers; iterate it in a for loop.
5. Use std::variant<int, std::string> with std::visit and overloaded to print either "int: N" or "string: S".
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does if constexpr do?
9. A) Discards the false branch at compile time (*)
10. B) Always evaluates both branches
11. C) Is the same as a regular if
12. D) Throws at compile time
13. Explanation: if constexpr (C++17) discards the false branch at compile time, so the false branch's body isn't even instantiated for templates.
14. Q2: What is a C++20 concept?
15. A) A type
16. B) A named set of template parameter constraints (*)
17. C) A class
18. D) A virtual function
19. Explanation: A concept is a named predicate on template parameters, e.g. `std::integral<T>`. Concepts replace SFINAE with clear error messages.
20. Q3: What do C++20 Ranges provide?
21. A) A faster std::vector
22. B) A new loop syntax
23. C) Composable, lazy view adapters (*)
24. D) A range-checked iterator
25. Explanation: Ranges provide view adapters (filter, transform, take, ...) that compose with `|` and are lazy — work happens only on iteration.
26. Q4: What does co_yield do in a coroutine?
27. A) Returns from the coroutine
28. B) Throws an exception
29. C) Allocates the coroutine frame
30. D) Suspends the coroutine and yields a value (*)
31. Explanation: co_yield suspends the coroutine, returns a value to the caller, and resumes from the same point on the next call. co_return terminates the coroutine.
32. Q5: What problem do C++20 modules solve?
33. A) Slow recompiles, ODR conflicts, macro leaks from headers (*)
34. B) Slow runtime
35. C) Memory leaks
36. D) Thread safety
37. Explanation: Modules replace #include headers, providing faster builds, better isolation (no macro leak), and avoiding ODR conflicts across translation units.
38. Q6: What is std::optional<T>?
39. A) A pointer to T
40. B) A nullable T — T or nothing (*)
41. C) A reference to T
42. D) A variant of T
43. Explanation: std::optional<T> is a value-or-nothing type; check with has_value() and access with value() or value_or(default).
44. Q7: What is std::variant<Ts...>?
45. A) A polymorphic base
46. B) A kind of optional
47. C) A type-safe union (*)
48. D) A template parameter
49. Explanation: std::variant<Ts...> holds exactly one of the listed types at a time, with a type-safe access via std::get / std::visit; it's the C++ equivalent of a tagged union.
50. Q8: What is std::span<T>?
51. A) An owning container
52. B) A kind of smart pointer
53. C) A range adaptor
54. D) A non-owning view over a contiguous sequence (*)
55. Explanation: std::span<T> (C++20) is a non-owning view of a contiguous sequence — the modern replacement for `T* ptr, size_t n` pairs.
56. Q9: What does std::visit do with a variant?
57. A) Calls a visitor with the active alternative — compile-time-checked (*)
58. B) Iterates the alternatives
59. C) Returns the index of the active alternative
60. D) Throws if the variant is empty
61. Explanation: std::visit(visitor, variant) calls visitor with the active alternative; the compiler checks the visitor handles every alternative (or a generic lambda).
62. Q10: What is std::expected<T, E> (C++23)?
63. A) A future of T
64. B) T or an error E — type-safe error handling (*)
65. C) A promise of T
66. D) A variant of T and E
67. Explanation: std::expected<T, E> holds either a value T or an error E, providing type-safe error handling without exceptions; it's similar to Rust's Result<T, E>.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does if constexpr do?
  options:
    - Discards the false branch at compile time
    - Always evaluates both branches
    - Is the same as a regular if
    - Throws at compile time
  correctIndex: 0
  explanation: if constexpr (C++17) discards the false branch at compile time, so the false branch's body isn't even instantiated for templates.
- id: q2
  question: What is a C++20 concept?
  options:
    - A type
    - A named set of template parameter constraints
    - A class
    - A virtual function
  correctIndex: 1
  explanation: A concept is a named predicate on template parameters, e.g. `std::integral<T>`. Concepts replace SFINAE with clear error messages.
- id: q3
  question: What do C++20 Ranges provide?
  options:
    - A faster std::vector
    - A new loop syntax
    - Composable, lazy view adapters
    - A range-checked iterator
  correctIndex: 2
  explanation: Ranges provide view adapters (filter, transform, take, ...) that compose with `|` and are lazy — work happens only on iteration.
- id: q4
  question: What does co_yield do in a coroutine?
  options:
    - Returns from the coroutine
    - Throws an exception
    - Allocates the coroutine frame
    - Suspends the coroutine and yields a value
  correctIndex: 3
  explanation: co_yield suspends the coroutine, returns a value to the caller, and resumes from the same point on the next call. co_return terminates the coroutine.
- id: q5
  question: What problem do C++20 modules solve?
  options:
    - Slow recompiles, ODR conflicts, macro leaks from headers
    - Slow runtime
    - Memory leaks
    - Thread safety
  correctIndex: 0
  explanation: "Modules replace #include headers, providing faster builds, better isolation (no macro leak), and avoiding ODR conflicts across translation units."
- id: q6
  question: What is std::optional<T>?
  options:
    - A pointer to T
    - A nullable T — T or nothing
    - A reference to T
    - A variant of T
  correctIndex: 1
  explanation: std::optional<T> is a value-or-nothing type; check with has_value() and access with value() or value_or(default).
- id: q7
  question: What is std::variant<Ts...>?
  options:
    - A polymorphic base
    - A kind of optional
    - A type-safe union
    - A template parameter
  correctIndex: 2
  explanation: std::variant<Ts...> holds exactly one of the listed types at a time, with a type-safe access via std::get / std::visit; it's the C++ equivalent of a tagged union.
- id: q8
  question: What is std::span<T>?
  options:
    - An owning container
    - A kind of smart pointer
    - A range adaptor
    - A non-owning view over a contiguous sequence
  correctIndex: 3
  explanation: std::span<T> (C++20) is a non-owning view of a contiguous sequence — the modern replacement for `T* ptr, size_t n` pairs.
- id: q9
  question: What does std::visit do with a variant?
  options:
    - Calls a visitor with the active alternative — compile-time-checked
    - Iterates the alternatives
    - Returns the index of the active alternative
    - Throws if the variant is empty
  correctIndex: 0
  explanation: std::visit(visitor, variant) calls visitor with the active alternative; the compiler checks the visitor handles every alternative (or a generic lambda).
- id: q10
  question: What is std::expected<T, E> (C++23)?
  options:
    - A future of T
    - T or an error E — type-safe error handling
    - A promise of T
    - A variant of T and E
  correctIndex: 1
  explanation: std::expected<T, E> holds either a value T or an error E, providing type-safe error handling without exceptions; it's similar to Rust's Result<T, E>.
```

