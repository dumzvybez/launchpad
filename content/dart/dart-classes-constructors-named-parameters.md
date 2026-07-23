---
slug: dart-classes-constructors-named-parameters
id: dart-07
track: dart
order: 7
title: Classes, Constructors, and Named Parameters
description: Define classes with fields, multiple constructor types (default, named, redirecting, factory), `const` constructors, initializer lists, and the `==`/`hashCode` contract for value equality.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=3600s
whyItMatters: Define classes with fields, multiple constructor types (default, named, redirecting, factory), `const` constructors, initializer lists, and the `==`/`hashCode` contract for value equality.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Classes, Constructors, and Named Parameters

## Classes, Constructors, and Named Parameters

### Why It Matters

Define classes with fields, multiple constructor types (default, named, redirecting, factory), `const` constructors, initializer lists, and the `==`/`hashCode` contract for value equality.

Define classes with fields, multiple constructor types (default, named, redirecting, factory), `const` constructors, initializer lists, and the `==`/`hashCode` contract for value equality.

### Prerequisites

- Stage 2: Variables, Types, and null safety
- Stage 4: Functions, Parameters, and Closures
- Stage 6: Collections — List, Set, Map

### Topics

- Class declarations, fields, and `this`
- Default, named (`ClassName.named`), and redirecting constructors
- Initializer lists and `this.x` parameter shorthand
- `const` constructors and compile-time constant instances
- Factory constructors and singletons
- `static` fields and methods
- `==`, `hashCode`, and the value-equality contract
- `toString`, `noSuchMethod`, and `call` overrides

### Key Concepts

- Initializer lists (`Class() : x = expr, y = expr {}`) run before the constructor body and are required for `final` fields and `assert` arguments.
- `const` constructors require all fields to be `final` and all arguments to be compile-time constants; this enables widget canonicalization in Flutter.
- Factory constructors can return cached instances (singletons, interning) or subclasses — they don't always create a new object.
- If you override `==`, you MUST override `hashCode` to preserve the invariant: equal objects have equal hash codes.
- `late final` fields are useful for lazily-computed immutable properties, but be careful about thread safety (Dart is single-threaded per isolate, so this is usually fine).
- A class without an explicit constructor gets a default `Class()` constructor; if you define any constructor, the default disappears.

```dart
class Point {
  final double x, y;

  // Default constructor with this.x shorthand
  const Point(this.x, this.y);

  // Named constructor
  const Point.origin() : x = 0, y = 0;

  // Redirecting constructor
  Point.alongX(double x) : this(x, 0);

  // Factory: returns a cached instance
  factory Point.unit() => const Point(1, 1);

  // Initializer list with assert
  Point.positive(double x, double y)
      : assert(x >= 0 && y >= 0),
        x = x,
        y = y;

  double get distance => (x * x + y * y) / 2; // sqrt omitted for brevity

  @override
  bool operator ==(Object other) =>
      other is Point && x == other.x && y == other.y;

  @override
  int get hashCode => Object.hash(x, y);
}
```
Caption: Constructors

### Common Pitfalls

- Overriding `==` without `hashCode` — equal objects may end up in different buckets of a `HashSet`/`HashMap`, breaking lookups. Always override both; use `Object.hash(...)` for a clean implementation.
- Using `factory` when a static method is clearer — factories look like constructors at the call site, which is good for caching but bad if the function has side effects or returns wildly different types. Prefer a static method when the "construction" is really a transformation.
- `late final` field read before write — `LateInitializationError`; either assign in the constructor or initialize inline.
- Forgetting that `const` constructors propagate — `const Point(0,0)` only works if all args are const; `const Point(now.millisecondsSinceEpoch, 0)` is a compile error.
- Mutable fields in a class used as a Map key — even if you implement `==`/`hashCode`, mutating a key after insertion breaks the Map. Use immutable fields (final) for keys.

### Real-World Applications

- Flutter's `Widget` subclasses (`StatelessWidget`, `StatefulWidget`) use `const` constructors everywhere — the framework canonicalizes const widgets to skip rebuilds.
- The Dart SDK's `Duration` class is an immutable value type with `==`/`hashCode` and arithmetic operators, used pervasively across Flutter animations and timers.
- Reflectly's `Mood` model is a value class with `copyWith` and value equality, used as the source of truth for the journaling state.
- BMW's telemetry DTOs use factory constructors to deserialize binary protocol buffers into typed Dart objects shared with the mobile app.

### Interview Questions

- 1. What's the difference between a generative constructor and a factory constructor? — Generative always creates a new instance; factory is a static-like method that may return a cached or subtype instance.
- 2. Why must you override `hashCode` when you override `==`? — Hash-based collections rely on the invariant that equal objects have equal hashes; breaking it puts equal objects in different buckets.
- 3. When can a constructor be `const`? — All fields must be `final` and all arguments must be compile-time constants; no `this` access in the body.
- 4. What does `Object.hash(a, b, c)` do? — Combines the hashes of `a`, `b`, `c` into a single int using a good mixing function; recommended for implementing `hashCode`.
- 5. How do you make a singleton in Dart? — Make the default constructor private (`_internal`), create a `static final _instance`, and expose it via a `factory` constructor.

### Mini Project

Build an immutable Money class: A `Money` value type with `amount` (int cents) and `currency` (String), supporting addition and subtraction of same-currency values, multiplication by an integer, value equality, `hashCode`, `toString` (`"$12.34"`), and a `copyWith`. Suggested approach:
  - Use `final int amountCents` and `final String currency`
  - Define operators `+`, `-`, `*` that throw `ArgumentError` on currency mismatch
  - Implement `==` and `hashCode` via `Object.hash`
  - Override `toString` to format with 2 decimals and a `$` (or currency symbol)
  - Add `Money.zero(String currency)` and `Money.fromDouble(double v, String currency)`

### Exercises

1. Define a `Rectangle` class with `width`/`height` and `area` getter; make a `const` constructor.
2. Implement a `Logger` singleton with a private constructor and a `factory`.
3. Override `==` and `hashCode` for a `Person(name, age)` class using `Object.hash`.
4. Add `copyWith` to the `Person` class.
5. Write a factory constructor `Point.fromMap(Map<String, dynamic> m)` that returns a `Point` or throws on invalid input.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What must you override alongside `==`?
9. A) toString
10. B) noSuchMethod
11. C) hashCode (*)
12. D) call
13. Explanation: The contract `a == b => a.hashCode == b.hashCode` must hold for hash-based collections to work; override both together.
14. Q2: Which constructor type may return a cached instance?
15. A) Generative
16. B) Redirecting
17. C) Const
18. D) Factory (*)
19. Explanation: A factory constructor is essentially a static method that can return an existing object, a subtype, or throw — it need not allocate a new instance.
20. Q3: What does an initializer list (`: x = expr, y = expr`) run?
21. A) Before the constructor body (*)
22. B) After the constructor body
23. C) Lazily on first access
24. D) Only in const constructors
25. Explanation: Initializer list runs before the body; it's the only place to set `final` fields and validate arguments with `assert`.
26. Q4: When can a constructor be marked `const`?
27. A) Always
28. B) All fields must be final and all args compile-time constants (*)
29. C) Only when the class has no fields
30. D) Only in abstract classes
31. Explanation: `const` constructors require all fields to be `final` and all arguments to be evaluable at compile time; this enables canonicalized constant instances.
32. Q5: How do you make a singleton in Dart?
33. A) `class X { factory X() => X(); }`
34. B) `class X { static X get i => X(); }`
35. C) `class X { static final X i = X._(); X._(); factory X() => i; }` (*)
36. D) `class X { X() {} }`
37. Explanation: Private constructor + static final instance + factory that returns the instance is the canonical Dart singleton pattern.
38. Q6: What is `Object.hash(a, b, c)` used for?
39. A) Computing a cryptographic hash
40. B) Comparing two objects for equality
41. C) Hashing strings for storage
42. D) Implementing hashCode by combining field hashes (*)
43. Explanation: `Object.hash(...)` combines multiple field hashes into a single int using a mixing function; it's the recommended `hashCode` implementation.
44. Q7: If you define a named constructor `Point.origin()`, what happens to the default `Point()`?
45. A) It remains available alongside any named constructor (*)
46. B) It still exists
47. C) It still exists only if you don't define any other constructor
48. D) It disappears only if you also define a default — otherwise it's still there
49. Explanation: Defining a named constructor does NOT remove the default; only defining a generative (default-replacement) constructor does. Both can coexist.
50. Q8: What happens if you mutate a field used as a Map key after insertion?
51. A) Map updates automatically
52. B) The entry becomes unreachable — broken lookup (*)
53. C) Map throws
54. D) Nothing — fields are always immutable
55. Explanation: Hash-based collections bucket by the key's hash at insertion; mutating the key changes its hash but not its bucket, so lookups fail silently.
56. Q9: Which is the `this.x` shorthand?
57. A) Point(x) — assigns the param to the field x
58. B) Point(x = this.x)
59. C) Point(this.x) — assigns the param to the field x (*)
60. D) Point(x: this)
61. Explanation: `Point(this.x)` is sugar for `Point(x) : this.x = x;` — the parameter name matches the field and is auto-assigned via the initializer list.
62. Q10: What does `late final` enable?
63. A) A mutable field that can be reassigned
64. B) A field that is always null initially
65. C) A field that is thread-safe
66. D) A const-like field that is set once at runtime, possibly lazily (*)
67. Explanation: `late final` allows a field to be assigned exactly once at runtime (often lazily via inline initializer), useful when construction-time init isn't possible.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What must you override alongside `==`?
  options:
    - toString
    - noSuchMethod
    - hashCode
    - call
  correctIndex: 2
  explanation: The contract `a == b => a.hashCode == b.hashCode` must hold for hash-based collections to work; override both together.
- id: q2
  question: Which constructor type may return a cached instance?
  options:
    - Generative
    - Redirecting
    - Const
    - Factory
  correctIndex: 3
  explanation: A factory constructor is essentially a static method that can return an existing object, a subtype, or throw — it need not allocate a new instance.
- id: q3
  question: "What does an initializer list (`: x = expr, y = expr`) run?"
  options:
    - Before the constructor body
    - After the constructor body
    - Lazily on first access
    - Only in const constructors
  correctIndex: 0
  explanation: Initializer list runs before the body; it's the only place to set `final` fields and validate arguments with `assert`.
- id: q4
  question: When can a constructor be marked `const`?
  options:
    - Always
    - All fields must be final and all args compile-time constants
    - Only when the class has no fields
    - Only in abstract classes
  correctIndex: 1
  explanation: "`const` constructors require all fields to be `final` and all arguments to be evaluable at compile time; this enables canonicalized constant instances."
- id: q5
  question: How do you make a singleton in Dart?
  options:
    - "`class X { factory X() => X(); }`"
    - "`class X { static X get i => X(); }`"
    - "`class X { static final X i = X._(); X._(); factory X() => i; }`"
    - "`class X { X() {} }`"
  correctIndex: 2
  explanation: Private constructor + static final instance + factory that returns the instance is the canonical Dart singleton pattern.
- id: q6
  question: What is `Object.hash(a, b, c)` used for?
  options:
    - Computing a cryptographic hash
    - Comparing two objects for equality
    - Hashing strings for storage
    - Implementing hashCode by combining field hashes
  correctIndex: 3
  explanation: "`Object.hash(...)` combines multiple field hashes into a single int using a mixing function; it's the recommended `hashCode` implementation."
- id: q7
  question: If you define a named constructor `Point.origin()`, what happens to the default `Point()`?
  options:
    - It remains available alongside any named constructor
    - It still exists
    - It still exists only if you don't define any other constructor
    - It disappears only if you also define a default — otherwise it's still there
  correctIndex: 0
  explanation: Defining a named constructor does NOT remove the default; only defining a generative (default-replacement) constructor does. Both can coexist.
- id: q8
  question: What happens if you mutate a field used as a Map key after insertion?
  options:
    - Map updates automatically
    - The entry becomes unreachable — broken lookup
    - Map throws
    - Nothing — fields are always immutable
  correctIndex: 1
  explanation: Hash-based collections bucket by the key's hash at insertion; mutating the key changes its hash but not its bucket, so lookups fail silently.
- id: q9
  question: Which is the `this.x` shorthand?
  options:
    - Point(x) — assigns the param to the field x
    - Point(x = this.x)
    - Point(this.x) — assigns the param to the field x
    - "Point(x: this)"
  correctIndex: 2
  explanation: "`Point(this.x)` is sugar for `Point(x) : this.x = x;` — the parameter name matches the field and is auto-assigned via the initializer list."
- id: q10
  question: What does `late final` enable?
  options:
    - A mutable field that can be reassigned
    - A field that is always null initially
    - A field that is thread-safe
    - A const-like field that is set once at runtime, possibly lazily
  correctIndex: 3
  explanation: "`late final` allows a field to be assigned exactly once at runtime (often lazily via inline initializer), useful when construction-time init isn't possible."
```

