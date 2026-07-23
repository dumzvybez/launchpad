---
slug: swift-enums-associated-values-pattern-matching
id: swift-07
track: swift
order: 7
title: Enums, Associated Values, and Pattern Matching
description: Define enums with raw values and associated values, exhaustively match them with `switch`, and learn why enums are Swift's secret weapon for safe modeling.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=360s
whyItMatters: Define enums with raw values and associated values, exhaustively match them with `switch`, and learn why enums are Swift's secret weapon for safe modeling.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Enums, Associated Values, and Pattern Matching

## Enums, Associated Values, and Pattern Matching

### Why It Matters

Define enums with raw values and associated values, exhaustively match them with `switch`, and learn why enums are Swift's secret weapon for safe modeling.

Define enums with raw values and associated values, exhaustively match them with `switch`, and learn why enums are Swift's secret weapon for safe modeling.

### Prerequisites

- Stage 3: Control Flow (switch, where)
- Stage 5: Arrays, Sets, and Dictionaries
- Stage 6: Functions and Closures

### Topics

- Enum basics: cases, raw values (`String`, `Int`)
- Associated values: tagged unions / sum types
- `indirect` enums for recursive data (linked lists, trees)
- Pattern matching: `switch`, `if case`, `guard case`, `for case`
- Exhaustiveness checking and `@unknown default`
- `Hashable`/`Equatable` synthesis for enums
- Computed properties and methods on enums
- CaseIterable and `allCases`
- Enum case name collisions and how to disambiguate

### Key Concepts

- Enums with associated values are algebraic sum types — the cornerstone of safe Swift modeling.
- The compiler enforces exhaustiveness, surfacing every missed case when you add a new one.
- `indirect enum` allows a case to reference the enum type itself (heap-allocated box), enabling recursive structures.
- `if case let .some(value) = optional` is the lightweight pattern-match alternative to a full `switch`.
- Adding `@unknown default` future-proofs switches against enums from C or other libraries that may grow new cases.

```swift
enum HTTPStatus: Int {
    case ok = 200
    case notFound = 404
    case serverError = 500
}
let s = HTTPStatus(rawValue: 404)  // HTTPStatus?.notFound
```
Caption: Enum with raw values

### Common Pitfalls

- Forgetting `@unknown default` when switching over a C-imported enum — the compiler can't know new cases added in future SDKs; `@unknown default` produces a warning (not error) when new cases appear.
- Confusing raw values with associated values — raw values are fixed per case (`case ok = 200`); associated values are per-instance (`case success(Data)`). You can't have both on the same case.
- Case name collisions across enums — `case loading` in both `ViewState` and `NetworkState`; the compiler resolves via context but calls become ambiguous in untyped contexts. Disambiguate with `ViewState.loading`.
- Forgetting `indirect` on a recursive enum — the compiler errors "recursive enum is not marked indirect"; add `indirect` to the case or the whole enum.
- Assuming enum `rawValue` always succeeds — `init(rawValue:)` returns an optional because the raw value may not match any case.

### Real-World Applications

- Apple's SwiftUI uses `enum NavigationDestination` for typed navigation routing, enforcing compile-time-safe navigation paths.
- LinkedIn's content feed uses an enum with associated values for cell types (post, ad, recommended connection, promoted), enabling exhaustive `switch` in the cell factory.
- Slack models every message type as a case in an enum with associated values, ensuring renderers handle every variant.
- Things 3 represents task scheduling rules as enums with associated `DateComponents` for repeat patterns.

### Interview Questions

- 1. What's the difference between a raw value and an associated value? — Raw values are pre-set constants per case (one per case); associated values are per-instance payloads attached at construction.
- 2. Why are Swift enums called "sum types"? — A sum type's cardinality is the sum of its cases' cardinalities, mirroring the algebra of types.
- 3. What does `indirect` do? — It allows an enum case to reference the enum type itself by boxing it on the heap, enabling recursive structures like trees.
- 4. What's the purpose of `@unknown default`? — It future-proofs switches over foreign enums (often C) so newly added cases produce a runtime warning instead of silent mis-routing.
- 5. When does the compiler synthesize `Equatable` and `Hashable` for an enum? — When all associated values are themselves `Equatable`/`Hashable`; opt in by conforming to the protocol with no implementation.

### Mini Project

Build an Arithmetic Expression Evaluator: Use an `indirect enum Expr { case num(Double); case add(Expr, Expr); case mul(Expr, Expr); case neg(Expr) }` and recursively evaluate. Suggested approach:
  - Define the enum with `indirect`
  - Write `func eval(_ e: Expr) -> Double` using `switch`
  - Add a `format(_ e: Expr) -> String` that pretty-prints with parentheses
  - Add a `parse(_ s: String) -> Expr?` for `"+ 1 2"`-style prefix notation
  - Test with `(1 + 2) * (3 + 4)` and verify result is 21

### Exercises

1. Define `enum TrafficLight: Int { case red = 0, yellow = 1, green = 2 }` and write a `switch` over it.
2. Add an associated value `case yellow(Int)` to track seconds remaining.
3. Create an `indirect enum JSONValue` modeling number, string, array, and object.
4. Use `if case let` to extract the value from an `Optional<String>.some("hi")`.
5. Add `@unknown default` to a switch over a hypothetical imported C enum and explain when it would fire.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between raw values and associated values?
9. A) They're the same
10. B) Raw values are optional; associated values aren't
11. C) Raw values are fixed per case; associated values vary per instance (*)
12. D) Associated values are strings only
13. Explanation: Raw values like `case ok = 200` are baked into the case declaration; associated values like `case success(Data)` are passed at construction.
14. Q2: What does `indirect enum` enable?
15. A) Faster enum dispatch
16. B) String raw values
17. C) Optional cases
18. D) Recursive enum types like trees (*)
19. Explanation: `indirect` boxes the recursive reference on the heap, allowing an enum case to contain values of the same enum type.
20. Q3: What happens when you add a new case to an enum and rebuild?
21. A) Every non-exhaustive switch fails to compile (*)
22. B) Nothing — runtime resolves it
23. C) A warning only
24. D) The new case is silently ignored
25. Explanation: The compiler enforces exhaustiveness; new cases produce errors at every `switch` that doesn't have a `default` or `@unknown default`.
26. Q4: What does `@unknown default` provide?
27. A) A runtime crash on new cases
28. B) A non-fatal warning for future-added cases when switching over foreign enums (*)
29. C) A compile error for missing cases
30. D) Auto-generation of missing cases
31. Explanation: Used with C-imported enums, `@unknown default` warns (instead of erroring) when the SDK adds new cases, future-proofing switches.
32. Q5: What is `CaseIterable`?
33. A) A protocol that adds `rawValue`
34. B) A type of for-loop
35. C) A protocol that synthesizes `allCases: [Self]` for enums without associated values (*)
36. D) A subscript
37. Explanation: Conforming to `CaseIterable` synthesizes a static `allCases` collection so you can iterate all enum cases.
38. Q6: What does `if case .north = direction { ... }` do?
39. A) Assigns .north to direction
40. B) Crashes if direction isn't .north
41. C) Switches exhaustively
42. D) Matches direction against .north and runs the body if matched (*)
43. Explanation: `if case` is a one-pattern branch — it runs the body if the value matches the pattern; otherwise it falls through (with optional `else`).
44. Q7: Which is the correct way to extract an associated value?
45. A) `case .success(let data):` (*)
46. B) `case .success(data):`
47. C) `case .success(data: let):`
48. D) `case let success(data):` is also valid
49. Explanation: Both `case .success(let data):` and `case let .success(data):` are valid; the `let` can be inside or outside the pattern.
50. Q8: When does Swift synthesize `Hashable` for an enum?
51. A) Always
52. B) When all associated values are Hashable (*)
53. C) Only for enums without associated values
54. D) Never — you must implement it
55. Explanation: The compiler auto-synthesizes `Hashable` and `Equatable` when every associated value conforms to the respective protocol.
56. Q9: What's the cardinality of `enum Either { case left(Int); case right(Bool) }`?
57. A) 2
58. B) Int × Bool's values
59. C) Int + Bool's values (*)
60. D) 1
61. Explanation: It's a sum type: |Either| = |Int| + |Bool|. Sum types add cardinalities; product types (structs/tuples) multiply them.
62. Q10: How do you disambiguate `case loading` shared across two enums?
63. A) You can't — rename one
64. B) Use a rawValue
65. C) Use `as?`
66. D) Write `EnumA.loading` explicitly (*)
67. Explanation: When context is insufficient, qualify with the enum type: `let s: State = .loading` becomes `let s: State = StateA.loading`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between raw values and associated values?
  options:
    - They're the same
    - Raw values are optional; associated values aren't
    - Raw values are fixed per case; associated values vary per instance
    - Associated values are strings only
  correctIndex: 2
  explanation: Raw values like `case ok = 200` are baked into the case declaration; associated values like `case success(Data)` are passed at construction.
- id: q2
  question: What does `indirect enum` enable?
  options:
    - Faster enum dispatch
    - String raw values
    - Optional cases
    - Recursive enum types like trees
  correctIndex: 3
  explanation: "`indirect` boxes the recursive reference on the heap, allowing an enum case to contain values of the same enum type."
- id: q3
  question: What happens when you add a new case to an enum and rebuild?
  options:
    - Every non-exhaustive switch fails to compile
    - Nothing — runtime resolves it
    - A warning only
    - The new case is silently ignored
  correctIndex: 0
  explanation: The compiler enforces exhaustiveness; new cases produce errors at every `switch` that doesn't have a `default` or `@unknown default`.
- id: q4
  question: What does `@unknown default` provide?
  options:
    - A runtime crash on new cases
    - A non-fatal warning for future-added cases when switching over foreign enums
    - A compile error for missing cases
    - Auto-generation of missing cases
  correctIndex: 1
  explanation: Used with C-imported enums, `@unknown default` warns (instead of erroring) when the SDK adds new cases, future-proofing switches.
- id: q5
  question: What is `CaseIterable`?
  options:
    - A protocol that adds `rawValue`
    - A type of for-loop
    - "A protocol that synthesizes `allCases: [Self]` for enums without associated values"
    - A subscript
  correctIndex: 2
  explanation: Conforming to `CaseIterable` synthesizes a static `allCases` collection so you can iterate all enum cases.
- id: q6
  question: What does `if case .north = direction { ... }` do?
  options:
    - Assigns .north to direction
    - Crashes if direction isn't .north
    - Switches exhaustively
    - Matches direction against .north and runs the body if matched
  correctIndex: 3
  explanation: "`if case` is a one-pattern branch — it runs the body if the value matches the pattern; otherwise it falls through (with optional `else`)."
- id: q7
  question: Which is the correct way to extract an associated value?
  options:
    - "`case .success(let data):`"
    - "`case .success(data):`"
    - "`case .success(data: let):`"
    - "`case let success(data):` is also valid"
  correctIndex: 0
  explanation: Both `case .success(let data):` and `case let .success(data):` are valid; the `let` can be inside or outside the pattern.
- id: q8
  question: When does Swift synthesize `Hashable` for an enum?
  options:
    - Always
    - When all associated values are Hashable
    - Only for enums without associated values
    - Never — you must implement it
  correctIndex: 1
  explanation: The compiler auto-synthesizes `Hashable` and `Equatable` when every associated value conforms to the respective protocol.
- id: q9
  question: What's the cardinality of `enum Either { case left(Int); case right(Bool) }`?
  options:
    - "2"
    - Int × Bool's values
    - Int + Bool's values
    - "1"
  correctIndex: 2
  explanation: "It's a sum type: |Either| = |Int| + |Bool|. Sum types add cardinalities; product types (structs/tuples) multiply them."
- id: q10
  question: How do you disambiguate `case loading` shared across two enums?
  options:
    - You can't — rename one
    - Use a rawValue
    - Use `as?`
    - Write `EnumA.loading` explicitly
  correctIndex: 3
  explanation: "When context is insufficient, qualify with the enum type: `let s: State = .loading` becomes `let s: State = StateA.loading`."
```

