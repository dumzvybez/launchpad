---
slug: swift-control-flow-conditionals-loops
id: swift-03
track: swift
order: 3
title: Control Flow — Conditionals and Loops
description: Master Swift's conditional and loop constructs, including `if`/`else`, `switch`, `for`-`in`, `while`, `repeat`-`while`, and the labeled `break`/`continue` for nested loops.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=120s
whyItMatters: Master Swift's conditional and loop constructs, including `if`/`else`, `switch`, `for`-`in`, `while`, `repeat`-`while`, and the labeled `break`/`continue` for nested loops.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master Swift's conditional and loop constructs, including `if`/`else`, `switch`, `for`-`in`, `while`, `repeat`-`while`, and the labeled `break`/`continue` for nested loops.

Master Swift's conditional and loop constructs, including `if`/`else`, `switch`, `for`-`in`, `while`, `repeat`-`while`, and the labeled `break`/`continue` for nested loops.

### Prerequisites

- Stage 1: Getting Started with Swift
- Stage 2: Variables, Types, and Optionals (binding, tuples)

### Topics

- `if`, `else if`, `else`
- `switch` with exhaustive matching and `where` clauses
- Tuples and ranges in `switch` cases
- `for`-`in` over arrays, dictionaries, ranges, and `stride`
- `while` and `repeat`-`while`
- `break` and `continue` with optional labels
- `fallthrough` (rare) and the default no-fallthrough rule
- Early exit with `guard`
- Ternary `? :` and `nil`-coalescing in expressions

### Key Concepts

- `switch` must be exhaustive — the compiler enforces that every possible value is handled or a `default` is present.
- `switch` cases do NOT fall through by default; you must write `fallthrough` explicitly to chain.
- `for`-`in` is the only modern loop; C-style `for (int i = 0; i < n; i++)` was removed in Swift 3.
- Ranges (`1...5`, `1..<5`, `stride(from:to:by:)`) are first-class values that you can iterate and pattern-match.
- Labeled `break`/`continue` are the clean way to escape nested loops.

```swift
func classify(point: (Double, Double)) -> String {
    switch point {
    case (0, 0):
        return "origin"
    case (_, 0):
        return "on x-axis"
    case (0, _):
        return "on y-axis"
    case let (x, y) where x == y:
        return "on diagonal"
    case let (x, y) where x > 0 && y > 0:
        return "quadrant I"
    default:
        return "elsewhere"
    }
}
```
Caption: switch with tuple and where

### Common Pitfalls

- Writing `for (int i = 0; i < n; i++)` — C-style for loops were removed in Swift 3; use `for i in 0..<n` instead.
- Forgetting `default` in a `switch` over `Int` or `String` — the compiler rejects non-exhaustive switches; add `default` or enumerate all cases for enums.
- Expecting `switch` to fall through — Swift does NOT fall through; you must use `fallthrough` explicitly, and you cannot use it to transfer into a case that binds variables.
- Using `stride(from: 0, to: 10, by: 3)` when you want inclusive — `to:` excludes the end; `through:` includes it.
- Modifying a collection while iterating — mutating the array during `for`-in is undefined; collect changes and apply after the loop, or use `indices` carefully.

### Real-World Applications

- Apple's SwiftUI uses `switch` over `enum` states for view rendering, relying on compiler-checked exhaustiveness so adding a new case surfaces every unhandled site.
- Lyft's price calculator uses tuple pattern matching to combine surge multiplier and ride type into a single `switch` expression for readability.
- Slack uses `for case let` patterns to iterate only items matching a specific subtype in mixed arrays of message types.
- Things 3 (Cultured Code) uses labeled loops in its calendar view to walk dates efficiently and break out as soon as the visible range ends.

### Interview Questions

- 1. Why does Swift require `switch` to be exhaustive? — So that adding a new enum case or input value produces a compile-time error at every unhandled site, preventing missed cases.
- 2. Does Swift `switch` fall through by default? — No; you must write `fallthrough` explicitly, and it cannot transfer into a case that binds a value.
- 3. How do you iterate with a custom step in Swift? — Use `stride(from:to:by:)` (exclusive end) or `stride(from:through:by:)` (inclusive end).
- 4. What's the difference between `while` and `repeat-while`? — `while` checks before the body; `repeat-while` checks after, guaranteeing at least one iteration.
- 5. How do you break out of a nested loop? — Label the outer loop (`outer:`) and `break outer`; Swift requires explicit labels — there's no `goto`.

### Mini Project

Build an ASCII Minesweeper Solver (CLI): Walk a grid of characters and find all cells where a number should be displayed (adjacent-mine count), printing the solved board. Suggested approach:
  - Represent the board as `[[Character]]`
  - Use nested `for`-`in` over `grid.indices` and `grid[i].indices`
  - Use tuple matching `switch` on `(deltaRow, deltaCol)` to enumerate 8 neighbors
  - Skip out-of-bounds neighbors with a `where` clause
  - Use a labeled `continue` to short-circuit cells that are themselves mines

### Exercises

1. Write a `switch` over `(Int, Int)` that classifies a point into one of four quadrants, an axis, or the origin.
2. Use `stride` to print even numbers from 0 to 20 inclusive.
3. Rewrite a nested loop with `break` to use a labeled `break` instead.
4. Convert a `for i in 0..<array.count` into `for (i, item) in array.enumerated()` and explain when each is preferred.
5. Write a `repeat-while` that prompts the user for input until they type "quit".
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens if a `switch` is not exhaustive?
9. A) It silently falls through to a default at runtime
10. B) Runtime crash on unmatched input
11. C) Compile error (*)
12. D) Warning only
13. Explanation: Swift requires every possible value to be handled; the compiler rejects non-exhaustive switches at build time.
14. Q2: Does Swift `switch` fall through to the next case by default?
15. A) Yes
16. B) Only for empty cases
17. C) Only when the next case is `default`
18. D) No — explicit `fallthrough` is required (*)
19. Explanation: Unlike C, Swift switches do NOT fall through; each case must end without continuing, unless you write `fallthrough`.
20. Q3: Which loop guarantees at least one iteration?
21. A) `repeat-while` (*)
22. B) `while`
23. C) `for`-`in`
24. D) `do-while` is not in Swift
25. Explanation: `repeat { ... } while cond` runs the body once before checking the condition, like C's `do-while`.
26. Q4: How do you iterate `0, 2, 4, 6, 8, 10`?
27. A) `for i in 0...10 by 2`
28. B) `for i in stride(from: 0, through: 10, by: 2)` (*)
29. C) `for i in stride(from: 0, to: 10, by: 2)`
30. D) `for i in 0..10 step 2`
31. Explanation: `stride(from:through:by:)` includes the end value; `to:` would exclude 10, printing only `0,2,4,6,8`.
32. Q5: How do you break out of an outer nested loop?
33. A) `break all`
34. B) `return` from a closure
35. C) Label the outer loop and `break <label>` (*)
36. D) `throw` to unwind
37. Explanation: Swift supports labeled statements; `outer: for ... { break outer }` is the idiomatic escape from nested loops.
38. Q6: Which is a valid Swift `for` loop?
39. A) `for (int i = 0; i < 10; i++)`
40. B) `for i = 0 to 9`
41. C) `foreach i in range(10)`
42. D) `for i in 0..<10` (*)
43. Explanation: C-style for loops were removed in Swift 3; `for i in 0..<10` is the modern replacement.
44. Q7: What does `for case let item as? Cat in animals` do?
45. A) Iterates only items castable to `Cat`, binding the cast result (*)
46. B) Crashes on non-Cat items
47. C) Skips nil items
48. D) Iterates all items and casts each
49. Explanation: `for case let` with `as?` filters the iteration to only items that match the pattern (successfully cast), skipping others.
50. Q8: What does `fallthrough` NOT allow?
51. A) Transferring control to the next case in a switch
52. B) Falling into a case that binds variables (*)
53. C) Falling into a default case
54. D) Falling through multiple cases in sequence
55. Explanation: `fallthrough` cannot transfer into a case that binds variables, because the next case's bindings would have no values.
56. Q9: What does `where` add to a `switch` case?
57. A) A default branch
58. B) A logging hook
59. C) An additional boolean condition that must also be true (*)
60. D) A throw point
61. Explanation: `case let (x, y) where x == y:` matches only when both the pattern AND the `where` predicate hold.
62. Q10: What is the difference between `0..<5` and `0...5`?
63. A) `..<5` includes 5; `...5` excludes 5
64. B) Both are identical
65. C) `..<5` is for floats, `...5` is for ints
66. D) `..<5` excludes 5; `...5` includes 5 (*)
67. Explanation: `..<` is a half-open range (excludes the upper bound); `...` is a closed range (includes it).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if a `switch` is not exhaustive?
  options:
    - It silently falls through to a default at runtime
    - Runtime crash on unmatched input
    - Compile error
    - Warning only
  correctIndex: 2
  explanation: Swift requires every possible value to be handled; the compiler rejects non-exhaustive switches at build time.
- id: q2
  question: Does Swift `switch` fall through to the next case by default?
  options:
    - Yes
    - Only for empty cases
    - Only when the next case is `default`
    - No — explicit `fallthrough` is required
  correctIndex: 3
  explanation: Unlike C, Swift switches do NOT fall through; each case must end without continuing, unless you write `fallthrough`.
- id: q3
  question: Which loop guarantees at least one iteration?
  options:
    - "`repeat-while`"
    - "`while`"
    - "`for`-`in`"
    - "`do-while` is not in Swift"
  correctIndex: 0
  explanation: "`repeat { ... } while cond` runs the body once before checking the condition, like C's `do-while`."
- id: q4
  question: How do you iterate `0, 2, 4, 6, 8, 10`?
  options:
    - "`for i in 0...10 by 2`"
    - "`for i in stride(from: 0, through: 10, by: 2)`"
    - "`for i in stride(from: 0, to: 10, by: 2)`"
    - "`for i in 0..10 step 2`"
  correctIndex: 1
  explanation: "`stride(from:through:by:)` includes the end value; `to:` would exclude 10, printing only `0,2,4,6,8`."
- id: q5
  question: How do you break out of an outer nested loop?
  options:
    - "`break all`"
    - "`return` from a closure"
    - Label the outer loop and `break <label>`
    - "`throw` to unwind"
  correctIndex: 2
  explanation: "Swift supports labeled statements; `outer: for ... { break outer }` is the idiomatic escape from nested loops."
- id: q6
  question: Which is a valid Swift `for` loop?
  options:
    - "`for (int i = 0; i < 10; i++)`"
    - "`for i = 0 to 9`"
    - "`foreach i in range(10)`"
    - "`for i in 0..<10`"
  correctIndex: 3
  explanation: C-style for loops were removed in Swift 3; `for i in 0..<10` is the modern replacement.
- id: q7
  question: What does `for case let item as? Cat in animals` do?
  options:
    - Iterates only items castable to `Cat`, binding the cast result
    - Crashes on non-Cat items
    - Skips nil items
    - Iterates all items and casts each
  correctIndex: 0
  explanation: "`for case let` with `as?` filters the iteration to only items that match the pattern (successfully cast), skipping others."
- id: q8
  question: What does `fallthrough` NOT allow?
  options:
    - Transferring control to the next case in a switch
    - Falling into a case that binds variables
    - Falling into a default case
    - Falling through multiple cases in sequence
  correctIndex: 1
  explanation: "`fallthrough` cannot transfer into a case that binds variables, because the next case's bindings would have no values."
- id: q9
  question: What does `where` add to a `switch` case?
  options:
    - A default branch
    - A logging hook
    - An additional boolean condition that must also be true
    - A throw point
  correctIndex: 2
  explanation: "`case let (x, y) where x == y:` matches only when both the pattern AND the `where` predicate hold."
- id: q10
  question: What is the difference between `0..<5` and `0...5`?
  options:
    - "`..<5` includes 5; `...5` excludes 5"
    - Both are identical
    - "`..<5` is for floats, `...5` is for ints"
    - "`..<5` excludes 5; `...5` includes 5"
  correctIndex: 3
  explanation: "`..<` is a half-open range (excludes the upper bound); `...` is a closed range (includes it)."
```

