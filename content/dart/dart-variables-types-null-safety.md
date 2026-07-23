---
slug: dart-variables-types-null-safety
id: dart-02
track: dart
order: 2
title: Variables, Types, and null safety
description: Master Dart's type system, var/final/const, and sound null safety — including `?`, `!`, `??`, `late`, and the difference between compile-time and runtime checks.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=600s
whyItMatters: Master Dart's type system, var/final/const, and sound null safety — including `?`, `!`, `??`, `late`, and the difference between compile-time and runtime checks.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Variables, Types, and null safety

## Variables, Types, and null safety

### Why It Matters

Master Dart's type system, var/final/const, and sound null safety — including `?`, `!`, `??`, `late`, and the difference between compile-time and runtime checks.

Master Dart's type system, var/final/const, and sound null safety — including `?`, `!`, `??`, `late`, and the difference between compile-time and runtime checks.

### Prerequisites

- Stage 1: Getting Started with Dart
- Comfort running `dart run` and reading analyzer messages.

### Topics

- Built-in types: int, double, String, bool, num, List, Map, Set, Runes, Symbol
- var, final, const, late — when each is correct
- Type inference with `var` and `dynamic`
- Nullable types (`int?`) and the null-aware operators (`?.`, `??`, `??=`, `!`)
- `late` variables and initialization timing
- The `Never` and `void` and `dynamic` and `Object` types
- Type promotion after null checks
- `const` constructors and compile-time constant expressions

### Key Concepts

- Sound null safety: a variable of type `int` can never be null; if null is possible you must write `int?`.
- `var` infers the type at first assignment and the type is then fixed; `dynamic` skips static checks.
- `final` is a runtime single-assignment variable; `const` is a compile-time constant deeply baked into the binary.
- `late` defers initialization until first read; if you read it before assigning you get a `LateInitializationError`.
- `!` (null assertion) is a runtime check; abuse it and you trade compile-time safety for runtime crashes.
- Type promotion lets Dart narrow `int?` to `int` after an `if (x != null)` check, but only for local variables (not fields).

```dart
var name = 'Anna';        // inferred String, mutable
final int age = 30;       // assigned once at runtime
const double pi = 3.14;   // compile-time constant

// const propagates: const list of const objects
const points = [Point(0, 0), Point(1, 1)]; // requires const constructor

class Point {
  final int x, y;
  const Point(this.x, this.y); // const constructor -> all fields final
}
```
Caption: var vs final vs const

### Common Pitfalls

- Using `!` to silence the analyzer instead of handling null — every `!` is a deferred `NullCheckError`; prefer `??`, `?.`, or an explicit `if (x == null) return` early exit.
- Forgetting that `late` is lazy and throws if read before assignment — `late int x; print(x);` crashes with `LateInitializationError`; only use `late` when you can guarantee a write before read.
- Treating `const` like `final` — `const` requires all constituents to be compile-time constants; `final DateTime now = DateTime.now()` is legal, `const DateTime now = DateTime.now()` is a compile error.
- Confusing `dynamic` with `Object` — `dynamic` disables static checks; `Object` keeps them and forces casts. Use `Object` for "any value", `dynamic` only for interop.
- Expecting type promotion on instance fields — `if (this.email != null) email.toLowerCase()` is a compile error because a field could be mutated by another method between the check and the use; copy to a local first.

### Real-World Applications

- Flutter's widget tree relies on `const` constructors everywhere a widget is rebuilt — Google's own Flutter team treats const widgets as a performance-critical optimization.
- The Hamilton app (Broadway musical) uses Dart null safety across its state models to prevent null-related crashes in production.
- Alibaba's Xianyu marketplace uses Dart for shared model code where null safety catches 100s of bugs that previously shipped as NPEs in their Java equivalents.
- eBay Motors' Flutter app uses sound null safety to share a typed model between iOS, Android, and web builds without null-related runtime errors.

### Interview Questions

- 1. What's the difference between `final` and `const`? — `final` is set once at runtime; `const` is a compile-time constant baked into the binary, and `const` propagates to its parts.
- 2. When should you use `late`? — When a field cannot be initialized in the initializer list (e.g., needs `this`) but is guaranteed to be set before first read; common in Flutter State objects.
- 3. What does `??=` do? — `x ??= y` assigns `y` to `x` only if `x` is currently null, and is shorthand for `if (x == null) x = y;`.
- 4. Why doesn't type promotion work on instance fields? — Between the null check and the use, another method could mutate the field, so the analyzer refuses to promote; copy to a local first.
- 5. What's the difference between `dynamic` and `Object?`? — `dynamic` disables static type checks (anything callable); `Object?` keeps them and requires explicit casts or methods of Object.

### Mini Project

Build a User Profile Model: A small Dart program that defines a `User` class with required and optional fields (name, email, age, nickname), constructs a user from a JSON-like map (manually, without codegen yet), and prints a formatted greeting using null-safe operators. Suggested approach:
  - Use required named parameters for `name` and `email`, optional for `nickname` and `age`
  - Make `age` nullable with a default fallback via `??`
  - Use `?.` and `??` to print nickname-or-name
  - Add a `const` constructor for an anonymous guest user
  - Print the result via `print` and run `dart analyze` clean

### Exercises

1. Declare `int? maybeScore = null;` and write a one-liner that returns 0 when `maybeScore` is null.
2. Create a `const` list of three `Point` objects with a `const` constructor; verify it compiles.
3. Try `late int x; print(x);` and observe the runtime error; then fix it by initializing in the declaration.
4. Write a `dynamic` variable that holds an int, then a String; call a non-existent method and observe `NoSuchMethodError`.
5. Convert `String? name; if (name != null) { print(name.length); }` to a one-liner using `?.` and `??`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which type can hold null in Dart 3.x?
9. A) int
10. B) int? (*)
11. C) String
12. D) bool
13. Explanation: In sound null safety, only nullable types (declared with `?`) can hold null; `int`, `String`, `bool` cannot.
14. Q2: What does `final` mean?
15. A) A compile-time constant
16. B) A variable that is immutable but reassignable
17. C) A variable that can be assigned only once (*)
18. D) A constant that must be inlined
19. Explanation: `final` is single-assignment at runtime; unlike `const`, its value need not be known at compile time.
20. Q3: Which operator returns the left value if non-null, otherwise the right?
21. A) ?
22. B) !!
23. C) ?.
24. D) ?? (*)
25. Explanation: `a ?? b` evaluates to `a` if `a` is non-null, otherwise `b` — the null-coalescing operator.
26. Q4: What does `late` do?
27. A) Defers initialization until first read (*)
28. B) Marks a variable as deprecated
29. C) Makes a variable thread-safe
30. D) Forces a const evaluation at link time
31. Explanation: `late` defers the initializer to first read; reading before any assignment throws `LateInitializationError`.
32. Q5: Why does type promotion not apply to instance fields?
33. A) Fields are always nullable
34. B) Another method could mutate the field between check and use (*)
35. C) Promotion only works for ints
36. D) Fields are always const
37. Explanation: The analyzer cannot prove a field stays non-null across an arbitrary call, so it refuses to promote; copy to a local first.
38. Q6: What is the result of `int? x; print(x!);`?
39. A) Prints null
40. B) Prints 0
41. C) Throws a NullCheckError at runtime (*)
42. D) Compile error
43. Explanation: `!` asserts non-null and throws `NullCheckError` (a subtype of `TypeError`) when the value is null at runtime.
44. Q7: Which declaration creates a compile-time constant list?
45. A) final list = [1, 2, 3];
46. B) var list = const [1, 2, 3];
47. C) Both B and C are const
48. D) const list = [1, 2, 3]; (*)
49. Explanation: Both `const list = [1,2,3]` and `var list = const [1,2,3]` create compile-time const lists; option B is the canonical form.
50. Q8: What does `dynamic` disable?
51. A) Static type checks (*)
52. B) Memory allocation
53. C) Garbage collection
54. D) Null safety
55. Explanation: `dynamic` tells the analyzer to skip static type checks; calls are checked at runtime via `noSuchMethod`.
56. Q9: Which is the correct nullable String declaration?
57. A) String name = null;
58. B) String? name; (*)
59. C) nullable<String> name;
60. D) String name?
61. Explanation: The `?` suffix on the type (not the variable) marks it nullable: `String?` is the type that allows null.
62. Q10: What is `const` constructor useful for?
63. A) Avoiding manual `dispose()` calls
64. B) Threading the constructor call asynchronously
65. C) Creating compile-time constant instances and canonicalizing widgets (*)
66. D) Hiding the constructor from callers
67. Explanation: A `const` constructor lets you create compile-time constant instances; Flutter uses this to canonicalize widgets so equal const widgets skip rebuilds.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which type can hold null in Dart 3.x?
  options:
    - int
    - int?
    - String
    - bool
  correctIndex: 1
  explanation: In sound null safety, only nullable types (declared with `?`) can hold null; `int`, `String`, `bool` cannot.
- id: q2
  question: What does `final` mean?
  options:
    - A compile-time constant
    - A variable that is immutable but reassignable
    - A variable that can be assigned only once
    - A constant that must be inlined
  correctIndex: 2
  explanation: "`final` is single-assignment at runtime; unlike `const`, its value need not be known at compile time."
- id: q3
  question: Which operator returns the left value if non-null, otherwise the right?
  options:
    - "?"
    - "!!"
    - ?.
    - ??
  correctIndex: 3
  explanation: "`a ?? b` evaluates to `a` if `a` is non-null, otherwise `b` — the null-coalescing operator."
- id: q4
  question: What does `late` do?
  options:
    - Defers initialization until first read
    - Marks a variable as deprecated
    - Makes a variable thread-safe
    - Forces a const evaluation at link time
  correctIndex: 0
  explanation: "`late` defers the initializer to first read; reading before any assignment throws `LateInitializationError`."
- id: q5
  question: Why does type promotion not apply to instance fields?
  options:
    - Fields are always nullable
    - Another method could mutate the field between check and use
    - Promotion only works for ints
    - Fields are always const
  correctIndex: 1
  explanation: The analyzer cannot prove a field stays non-null across an arbitrary call, so it refuses to promote; copy to a local first.
- id: q6
  question: What is the result of `int? x; print(x!);`?
  options:
    - Prints null
    - Prints 0
    - Throws a NullCheckError at runtime
    - Compile error
  correctIndex: 2
  explanation: "`!` asserts non-null and throws `NullCheckError` (a subtype of `TypeError`) when the value is null at runtime."
- id: q7
  question: Which declaration creates a compile-time constant list?
  options:
    - final list = [1, 2, 3];
    - var list = const [1, 2, 3];
    - Both B and C are const
    - const list = [1, 2, 3];
  correctIndex: 3
  explanation: Both `const list = [1,2,3]` and `var list = const [1,2,3]` create compile-time const lists; option B is the canonical form.
- id: q8
  question: What does `dynamic` disable?
  options:
    - Static type checks
    - Memory allocation
    - Garbage collection
    - Null safety
  correctIndex: 0
  explanation: "`dynamic` tells the analyzer to skip static type checks; calls are checked at runtime via `noSuchMethod`."
- id: q9
  question: Which is the correct nullable String declaration?
  options:
    - String name = null;
    - String? name;
    - nullable<String> name;
    - String name?
  correctIndex: 1
  explanation: "The `?` suffix on the type (not the variable) marks it nullable: `String?` is the type that allows null."
- id: q10
  question: What is `const` constructor useful for?
  options:
    - Avoiding manual `dispose()` calls
    - Threading the constructor call asynchronously
    - Creating compile-time constant instances and canonicalizing widgets
    - Hiding the constructor from callers
  correctIndex: 2
  explanation: A `const` constructor lets you create compile-time constant instances; Flutter uses this to canonicalize widgets so equal const widgets skip rebuilds.
```

