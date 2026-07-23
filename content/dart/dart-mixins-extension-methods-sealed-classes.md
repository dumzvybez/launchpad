---
slug: dart-mixins-extension-methods-sealed-classes
id: dart-09
track: dart
order: 9
title: Mixins, Extension Methods, and Sealed Classes
description: Use Dart's three code-reuse mechanisms — mixins for horizontal reuse, extension methods for adding to existing types, and sealed classes for exhaustive closed hierarchies (Dart 3).
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=4800s
whyItMatters: Use Dart's three code-reuse mechanisms — mixins for horizontal reuse, extension methods for adding to existing types, and sealed classes for exhaustive closed hierarchies (Dart 3).
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Mixins, Extension Methods, and Sealed Classes

## Mixins, Extension Methods, and Sealed Classes

### Why It Matters

Use Dart's three code-reuse mechanisms — mixins for horizontal reuse, extension methods for adding to existing types, and sealed classes for exhaustive closed hierarchies (Dart 3).

Use Dart's three code-reuse mechanisms — mixins for horizontal reuse, extension methods for adding to existing types, and sealed classes for exhaustive closed hierarchies (Dart 3).

### Prerequisites

- Stage 8: Inheritance, Abstract Classes, and Interfaces

### Topics

- `mixin` declaration and `with` clause
- `on` constraint (mixin requiring a specific supertype)
- Mixin composition order and method resolution
- `extension` methods on existing types (including primitives)
- Generic extensions and `extension Type on T`
- Sealed classes (`sealed class`) for closed hierarchies
- Exhaustiveness checking with sealed types
- Records and patterns (briefly) used with sealed hierarchies

### Key Concepts

- Mixins are for horizontal reuse: a class can mix in multiple behaviors without inheriting from a common parent.
- `mixin M on C` requires any class using `M` to extend or implement `C` — useful when the mixin calls methods defined on `C`.
- Linearization: `class C extends B with M1, M2` resolves methods right-to-left, so `M2` wins over `M1` wins over `B`.
- Extension methods add syntax sugar: `string.myMethod()` works if `extension MyExt on String { ... myMethod() ... }` is imported.
- Sealed classes (Dart 3) define a closed hierarchy: the compiler knows all subtypes, enabling exhaustiveness in switch without a default.
- Sealed class subtypes must be in the same library; this is what makes the hierarchy closed.
- Extensions are resolved statically (by static type), not dynamically — they don't participate in virtual dispatch.

```dart
mixin Drawable {
  void draw() => print('$runtimeType drawn');
}

mixin Movable {
  void move(int dx, int dy) => print('moved by $dx,$dy');
}

class Sprite with Drawable, Movable {}

void main() {
  final s = Sprite();
  s.draw();   // Sprite drawn
  s.move(1, 2);
}
```
Caption: Mixin

### Common Pitfalls

- Assuming mixins have state isolation — mixins share state with the class they're mixed into; two classes mixing in the same mixin do NOT share state.
- Extension methods not resolved dynamically — `Object o = 'hi'; o.capitalize();` is a compile error because the static type is `Object`. Extensions work on the static type only.
- Forgetting that sealed subtypes must be in the same library — moving a `sealed` subtype to another file is a compile error; this is what guarantees exhaustiveness.
- Mixin linearization confusion — `class C extends B with M1, M2` resolves M2 first; if you need M1's behavior to "win", reverse the order.
- Extension name collisions — two extensions defining `capitalize()` on String cause an ambiguous-call compile error; resolve by importing only one or calling `StringX('hi').capitalize()` explicitly.

### Real-World Applications

- Flutter's `WidgetsFlutterBinding` mixes in `GestureBinding`, `SchedulerBinding`, `PaintingBinding`, etc., composing many capabilities into one binding object.
- The Dart SDK uses extensions to add `padLeft`, `padRight`, and other helpers to `String`; the entire time-DSL (`5.seconds`) in many Dart utility libraries is via extensions on `int` and `double`.
- Reflectly uses sealed classes for its `MoodState` hierarchy, ensuring every UI branch handles every state exhaustively.
- BMW's app uses mixins for analytics and logging across many feature screens without forcing a deep inheritance tree.

### Interview Questions

- 1. What's the difference between `extends` and `with`? — `extends` inherits from one parent; `with` applies one or more mixins for horizontal reuse without a strict IS-A relationship.
- 2. What does `mixin M on C` mean? — Any class using `M` must extend or implement `C`; useful when the mixin calls methods defined on `C`.
- 3. How are extension methods resolved? — Statically, based on the static type of the receiver; they don't participate in dynamic dispatch.
- 4. What is a sealed class? — A Dart 3 closed hierarchy: all subtypes must be in the same library, enabling exhaustiveness checking in switch expressions.
- 5. Why use sealed classes over enums? — Sealed classes can carry heterogeneous data per case (different fields), while enums share the same shape; sealed is ideal for tagged unions like Result/Option.

### Mini Project

Build a Result<T> API with Extensions: Implement `sealed class Result<T>` with `Success` and `Failure` subtypes, plus extension methods on `Result<T>` for `isOk`, `unwrap()`, `unwrapOr(default)`, and `map(f)`. Then write a function that divides two ints and returns `Result<double>`. Suggested approach:
  - `sealed class Result<T> {}` with `Success<T>(T value)` and `Failure<T>(Object error)`
  - Extension `on Result<T>` with getters and methods
  - `Result<double> divide(int a, int b) => b == 0 ? Failure(ArgumentError('zero')) : Success(a / b)`
  - Use a switch expression to consume the result exhaustively
  - Add tests later in Stage 16

### Exercises

1. Write a `JsonSerializable` mixin that adds `toJson()` to any class.
2. Add an extension on `List<int>` that returns the sum and product as a record `(int, int)`.
3. Define a `sealed class Tree` with `Leaf` and `Node` subtypes, and write a recursive `depth()` function via switch.
4. Demonstrate mixin linearization by creating two mixins that override the same method.
5. Try to define an extension method on a nullable type (`String?`) and call it on a `null` value safely.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What keyword applies a mixin to a class?
9. A) with (*)
10. B) implements
11. C) extends
12. D) uses
13. Explanation: The `with` clause applies one or more mixins: `class C extends B with M1, M2`.
14. Q2: What does `mixin M on C` require?
15. A) M to extend C
16. B) Any class using M must extend or implement C (*)
17. C) C to be abstract
18. D) M to be private
19. Explanation: The `on` constraint restricts mixin application to classes that satisfy the supertype `C`; this lets the mixin call methods defined on C.
20. Q3: How are extension methods dispatched?
21. A) Dynamically via vtable
22. B) Via reflection
23. C) Statically by the receiver's static type (*)
24. D) Asynchronously
25. Explanation: Extensions are syntactic sugar resolved at compile time; `Object o = 'hi'; o.capitalize()` is a compile error because the static type is Object.
26. Q4: Sealed class subtypes must be in...
27. A) Any library
28. B) A subdirectory
29. C) The same file only (no other files)
30. D) The same library as the sealed class (*)
31. Explanation: Sealed types guarantee a closed hierarchy by restricting subtypes to the same library (which can span multiple files via part/part-of).
32. Q5: What benefit does a sealed class give in switch?
33. A) Exhaustiveness checking without a default (*)
34. B) Faster runtime matching
35. C) Auto-generated equals
36. D) Pattern matching syntax
37. Explanation: Because the compiler knows all subtypes, it can verify every case is covered — no `_` default needed, and adding a subtype forces you to handle it.
38. Q6: Mixin linearization in `class C extends B with M1, M2` resolves methods...
39. A) B first, then M1, then M2
40. B) M2 first, then M1, then B (*)
41. C) Alphabetically
42. D) By definition order in source
43. Explanation: Linearization is right-to-left: M2 takes precedence, then M1, then B. Reverse the order if you need M1 to win.
44. Q7: Two extensions defining the same method name on String cause...
45. A) The first imported wins
46. B) A runtime error
47. C) An ambiguous-call compile error (*)
48. D) Silent override
49. Explanation: When multiple extensions in scope provide the same method, the analyzer reports ambiguity; resolve by importing only one or qualifying with `ExtName(receiver).method()`.
50. Q8: Which is a valid extension on int?
51. A) extension int { ... }
52. B) extend int { ... }
53. C) extension int: IntX { ... }
54. D) extension IntX on int { ... } (*)
55. Explanation: `extension <Name> on <Type> { ... }` is the syntax; the Name is optional but recommended for explicit qualification.
56. Q9: What's a key difference between an enum and a sealed class?
57. A) Sealed class subtypes can carry different fields per case; enum cases share shape (*)
58. B) Enums support methods; sealed classes don't
59. C) Sealed classes can't be switched on
60. D) Nothing — they're identical
61. Explanation: Sealed subtypes can have different fields (heterogeneous data), making them ideal for tagged unions like Result/Option; enums share the same shape across cases.
62. Q10: What does `extension type on T` (Dart 3.3+) introduce?
63. A) A subtype of T
64. B) A representation type wrapper — a zero-cost named type backed by T (*)
65. C) A new mixin
66. D) A sealed class
67. Explanation: `extension type Name(T _) { ... }` introduces a lightweight wrapper with no runtime overhead, useful for typed IDs and domain primitives.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What keyword applies a mixin to a class?
  options:
    - with
    - implements
    - extends
    - uses
  correctIndex: 0
  explanation: "The `with` clause applies one or more mixins: `class C extends B with M1, M2`."
- id: q2
  question: What does `mixin M on C` require?
  options:
    - M to extend C
    - Any class using M must extend or implement C
    - C to be abstract
    - M to be private
  correctIndex: 1
  explanation: The `on` constraint restricts mixin application to classes that satisfy the supertype `C`; this lets the mixin call methods defined on C.
- id: q3
  question: How are extension methods dispatched?
  options:
    - Dynamically via vtable
    - Via reflection
    - Statically by the receiver's static type
    - Asynchronously
  correctIndex: 2
  explanation: Extensions are syntactic sugar resolved at compile time; `Object o = 'hi'; o.capitalize()` is a compile error because the static type is Object.
- id: q4
  question: Sealed class subtypes must be in...
  options:
    - Any library
    - A subdirectory
    - The same file only (no other files)
    - The same library as the sealed class
  correctIndex: 3
  explanation: Sealed types guarantee a closed hierarchy by restricting subtypes to the same library (which can span multiple files via part/part-of).
- id: q5
  question: What benefit does a sealed class give in switch?
  options:
    - Exhaustiveness checking without a default
    - Faster runtime matching
    - Auto-generated equals
    - Pattern matching syntax
  correctIndex: 0
  explanation: Because the compiler knows all subtypes, it can verify every case is covered — no `_` default needed, and adding a subtype forces you to handle it.
- id: q6
  question: Mixin linearization in `class C extends B with M1, M2` resolves methods...
  options:
    - B first, then M1, then M2
    - M2 first, then M1, then B
    - Alphabetically
    - By definition order in source
  correctIndex: 1
  explanation: "Linearization is right-to-left: M2 takes precedence, then M1, then B. Reverse the order if you need M1 to win."
- id: q7
  question: Two extensions defining the same method name on String cause...
  options:
    - The first imported wins
    - A runtime error
    - An ambiguous-call compile error
    - Silent override
  correctIndex: 2
  explanation: When multiple extensions in scope provide the same method, the analyzer reports ambiguity; resolve by importing only one or qualifying with `ExtName(receiver).method()`.
- id: q8
  question: Which is a valid extension on int?
  options:
    - extension int { ... }
    - extend int { ... }
    - "extension int: IntX { ... }"
    - extension IntX on int { ... }
  correctIndex: 3
  explanation: "`extension <Name> on <Type> { ... }` is the syntax; the Name is optional but recommended for explicit qualification."
- id: q9
  question: What's a key difference between an enum and a sealed class?
  options:
    - Sealed class subtypes can carry different fields per case; enum cases share shape
    - Enums support methods; sealed classes don't
    - Sealed classes can't be switched on
    - Nothing — they're identical
  correctIndex: 0
  explanation: Sealed subtypes can have different fields (heterogeneous data), making them ideal for tagged unions like Result/Option; enums share the same shape across cases.
- id: q10
  question: What does `extension type on T` (Dart 3.3+) introduce?
  options:
    - A subtype of T
    - A representation type wrapper — a zero-cost named type backed by T
    - A new mixin
    - A sealed class
  correctIndex: 1
  explanation: "`extension type Name(T _) { ... }` introduces a lightweight wrapper with no runtime overhead, useful for typed IDs and domain primitives."
```

