---
slug: dart-control-flow-conditionals-loops
id: dart-03
track: dart
order: 3
title: Control Flow — Conditionals and Loops
description: Learn if/else, switch (with Dart 3 patterns), for, while, do-while, for-in, break/continue, and the assertion statement for defensive checks.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=1200s
whyItMatters: Learn if/else, switch (with Dart 3 patterns), for, while, do-while, for-in, break/continue, and the assertion statement for defensive checks.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Learn if/else, switch (with Dart 3 patterns), for, while, do-while, for-in, break/continue, and the assertion statement for defensive checks.

Learn if/else, switch (with Dart 3 patterns), for, while, do-while, for-in, break/continue, and the assertion statement for defensive checks.

### Prerequisites

- Stage 1: Getting Started with Dart
- Stage 2: Variables, Types, and null safety

### Topics

- if, else if, else, and the ternary `cond ? a : b`
- switch statements and switch expressions (Dart 3)
- Pattern matching: variable patterns, constant patterns, destructuring
- Exhaustiveness checking with sealed types and enums
- for, for-in, while, do-while
- break and continue (with labels)
- assert() for invariants in debug mode
- Collection if and collection for inside literals

### Key Concepts

- Dart 3 introduced switch expressions and patterns; the old switch statement still works but expressions are preferred for value selection.
- `switch` on a sealed type or enum is exhaustiveness-checked; missing a case is a compile error.
- Collection-if (`[if (cond) x]`) and collection-for (`[for (var x in xs) x * 2]`) are concise ways to build lists.
- `break` exits the nearest loop; labeled breaks (`outer: for(...) { for(...) { break outer; } }`) exit outer loops.
- `assert(condition, msg)` runs only in debug mode; it is stripped from release builds, so never use it for input validation.
- `continue label;` jumps to the labeled statement — rarely needed, but useful in state machines.

```dart
String grade(int score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'F';
}

// Ternary
final status = score >= 60 ? 'pass' : 'fail';
```
Caption: if/else and ternary

### Common Pitfalls

- Forgetting exhaustive switch on enums after adding a new value — adding a case to the enum breaks compilation everywhere it's switched on, which is the feature working as designed; let it guide you.
- Using `assert` for runtime input validation — assert is stripped in release builds, so user inputs slip through; use explicit `if` + throw `ArgumentError`.
- Modifying a list while iterating with for-in — `ConcurrentModificationError` is thrown; iterate over a snapshot (`for (final x in list.toList())`) or use a while loop with an index.
- Falling through switch cases (C-style) — Dart disallows implicit fallthrough; use `continue label` or restructure with switch expressions.
- Using `continue` inside collection-for — collection-for does not support `continue`/`break`; use `where(...)` to filter first.

### Real-World Applications

- The Flutter framework uses switch expressions on `TargetPlatform` to pick material/cupertino defaults per platform.
- Reflectly's chat state machine uses exhaustive switch on a sealed `MessageState` to ensure every state (typing, sent, delivered, read) renders correctly.
- BMW's My BMW app uses switch expressions to translate OBD-II error codes from the car's CAN bus into user-friendly status strings.
- Alibaba's Xianyu uses collection-if to build dynamic feed item lists based on user role and feature flags.

### Interview Questions

- 1. What's the difference between a switch statement and a switch expression in Dart 3? — A statement executes blocks; an expression yields a value with `=>` per case and supports pattern guards (`when`).
- 2. How does exhaustiveness checking work? — For sealed types and enums, the compiler errors if any case is missing, removing the need for a `_` default.
- 3. What is collection-if? — `[if (cond) value]` inside a list/set/map literal conditionally includes an element, replacing `if-then-add` boilerplate.
- 4. Why should `assert` not be used for input validation? — It is removed in `--release` mode, so any check guarded by assert is silently skipped in production.
- 5. How do you break out of an outer loop from a nested one? — Label the outer loop (`outer:`) and use `break outer;`.

### Mini Project

Build a FizzBuzz Variant CLI: A program that prints numbers 1..N with substitutions, but adds "Jazz" for multiples of 7 and "Fuzz" for multiples of 11, supports custom rules via a Map<int, String>, and uses a switch expression to format each line. Suggested approach:
  - Accept N as `int.tryParse(args.first)` with a fallback to 100
  - Store rules in `Map<int, String>` like `{3: 'Fizz', 5: 'Buzz', 7: 'Jazz'}`
  - For each number, build the label via collection-for over sorted rule keys
  - Use a switch expression: empty label → number as string, else the label
  - Print all lines with `print`

### Exercises

1. Write a switch expression on an enum `Color { red, green, blue }` returning a hex string for each.
2. Build a list `[for (var i = 1; i <= 10; i++) if (i.isEven) i]` and confirm it contains only even numbers.
3. Use a labeled break to exit a nested loop when `i == 2 && j == 2`.
4. Try modifying a list during for-in iteration and observe `ConcurrentModificationError`; fix it with `.toList()`.
5. Replace a chain of `if/else if` with a switch expression using `when` guards on an int parameter.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which Dart 3 feature lets a switch return a value directly?
9. A) Switch statements
10. B) Switch functions
11. C) Switch expressions (*)
12. D) Switch macros
13. Explanation: Switch expressions (Dart 3) evaluate to a value with `pattern => result` arms, replacing verbose `switch`-`return` blocks.
14. Q2: What does `assert(cond, msg)` do in release mode?
15. A) Throws an AssertionError
16. B) Logs the message and continues
17. C) Converts to an if-check
18. D) Is removed; the condition is not evaluated (*)
19. Explanation: `assert` is a debug-only construct; in `--release` the assertion is stripped entirely, so its condition is never evaluated.
20. Q3: Which is the correct collection-if syntax?
21. A) [if (show) value] (*)
22. B) [value if show]
23. C) [show ? value]
24. D) [value when show]
25. Explanation: Dart's collection-if uses `if (cond) value` inside the literal to conditionally include an element.
26. Q4: How do you break out of an outer loop from a nested loop?
27. A) break all
28. B) break outer (with a label) (*)
29. C) break 2
30. D) break outer.loop
31. Explanation: Label the outer loop with `outer:` then `break outer;` exits the labeled loop directly.
32. Q5: What happens if you iterate a list with for-in and remove items inside the loop?
33. A) Works fine
34. B) Skips every other element
35. C) Throws ConcurrentModificationError (*)
36. D) Compiles but loops forever
37. Explanation: Dart detects structural modification during iteration and throws `ConcurrentModificationError` to prevent silent data corruption.
38. Q6: When does exhaustiveness checking apply?
39. A) Only on int ranges
40. B) On every switch
41. C) Never — Dart requires a default always
42. D) On sealed types and enums (and other closed hierarchies) (*)
43. Explanation: For sealed types, enums, and other patterns the analyzer knows to be closed, it errors if any case is missing; otherwise a `_` default is required.
44. Q7: What is a pattern guard in a switch expression?
45. A) A `when` clause that adds a boolean condition to a case (*)
46. B) A `lock` around the case
47. C) A `where` filter on inputs
48. D) A try/catch around the case body
49. Explanation: `case int i when i > 0 =>` adds a `when` predicate; the case only matches if both the pattern and the predicate hold.
50. Q8: Which loop guarantees its body runs at least once?
51. A) for
52. B) do-while (*)
53. C) while
54. D) for-in
55. Explanation: `do { ... } while (cond);` evaluates the body first, then checks the condition, guaranteeing at least one execution.
56. Q9: What is the result of `[for (var i = 1; i <= 3; i++) i * 10]`?
57. A) [1, 2, 3]
58. B) [10, 10, 10]
59. C) [10, 20, 30] (*)
60. D) Compile error
61. Explanation: Collection-for evaluates the expression for each iteration; `i * 10` with i=1,2,3 yields `[10, 20, 30]`.
62. Q10: What does `_` mean in a switch expression?
63. A) Skip this case
64. B) Throw an error
65. C) Return null
66. D) The default/wildcard case (*)
67. Explanation: `_` is the wildcard pattern that matches anything; it's the default arm and must come last when used.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which Dart 3 feature lets a switch return a value directly?
  options:
    - Switch statements
    - Switch functions
    - Switch expressions
    - Switch macros
  correctIndex: 2
  explanation: Switch expressions (Dart 3) evaluate to a value with `pattern => result` arms, replacing verbose `switch`-`return` blocks.
- id: q2
  question: What does `assert(cond, msg)` do in release mode?
  options:
    - Throws an AssertionError
    - Logs the message and continues
    - Converts to an if-check
    - Is removed; the condition is not evaluated
  correctIndex: 3
  explanation: "`assert` is a debug-only construct; in `--release` the assertion is stripped entirely, so its condition is never evaluated."
- id: q3
  question: Which is the correct collection-if syntax?
  options:
    - "[if (show) value]"
    - "[value if show]"
    - "[show ? value]"
    - "[value when show]"
  correctIndex: 0
  explanation: Dart's collection-if uses `if (cond) value` inside the literal to conditionally include an element.
- id: q4
  question: How do you break out of an outer loop from a nested loop?
  options:
    - break all
    - break outer (with a label)
    - break 2
    - break outer.loop
  correctIndex: 1
  explanation: Label the outer loop with `outer:` then `break outer;` exits the labeled loop directly.
- id: q5
  question: What happens if you iterate a list with for-in and remove items inside the loop?
  options:
    - Works fine
    - Skips every other element
    - Throws ConcurrentModificationError
    - Compiles but loops forever
  correctIndex: 2
  explanation: Dart detects structural modification during iteration and throws `ConcurrentModificationError` to prevent silent data corruption.
- id: q6
  question: When does exhaustiveness checking apply?
  options:
    - Only on int ranges
    - On every switch
    - Never — Dart requires a default always
    - On sealed types and enums (and other closed hierarchies)
  correctIndex: 3
  explanation: For sealed types, enums, and other patterns the analyzer knows to be closed, it errors if any case is missing; otherwise a `_` default is required.
- id: q7
  question: What is a pattern guard in a switch expression?
  options:
    - A `when` clause that adds a boolean condition to a case
    - A `lock` around the case
    - A `where` filter on inputs
    - A try/catch around the case body
  correctIndex: 0
  explanation: "`case int i when i > 0 =>` adds a `when` predicate; the case only matches if both the pattern and the predicate hold."
- id: q8
  question: Which loop guarantees its body runs at least once?
  options:
    - for
    - do-while
    - while
    - for-in
  correctIndex: 1
  explanation: "`do { ... } while (cond);` evaluates the body first, then checks the condition, guaranteeing at least one execution."
- id: q9
  question: What is the result of `[for (var i = 1; i <= 3; i++) i * 10]`?
  options:
    - "[1, 2, 3]"
    - "[10, 10, 10]"
    - "[10, 20, 30]"
    - Compile error
  correctIndex: 2
  explanation: Collection-for evaluates the expression for each iteration; `i * 10` with i=1,2,3 yields `[10, 20, 30]`.
- id: q10
  question: What does `_` mean in a switch expression?
  options:
    - Skip this case
    - Throw an error
    - Return null
    - The default/wildcard case
  correctIndex: 3
  explanation: "`_` is the wildcard pattern that matches anything; it's the default arm and must come last when used."
```

