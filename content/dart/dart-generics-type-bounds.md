---
slug: dart-generics-type-bounds
id: dart-10
track: dart
order: 10
title: Generics and Type Bounds
description: Master Dart generics — generic classes, methods, type bounds (`extends`), `void`/`dynamic`/`Object?` semantics, generic typedefs, and the difference between reified and erased generics.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=5400s
whyItMatters: Master Dart generics — generic classes, methods, type bounds (`extends`), `void`/`dynamic`/`Object?` semantics, generic typedefs, and the difference between reified and erased generics.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Generics and Type Bounds

## Generics and Type Bounds

### Why It Matters

Master Dart generics — generic classes, methods, type bounds (`extends`), `void`/`dynamic`/`Object?` semantics, generic typedefs, and the difference between reified and erased generics.

Master Dart generics — generic classes, methods, type bounds (`extends`), `void`/`dynamic`/`Object?` semantics, generic typedefs, and the difference between reified and erased generics.

### Prerequisites

- Stage 6: Collections — List, Set, Map
- Stage 7: Classes, Constructors, and Named Parameters
- Stage 8: Inheritance, Abstract Classes, and Interfaces

### Topics

- Generic classes `class Box<T> { ... }`
- Generic methods `T identity<T>(T x) => x;`
- Type bounds `T extends Comparable<T>`
- Generic typedefs `typedef Callback<T> = void Function(T);`
- Reified generics in Dart (types are known at runtime)
- Type literals and `as`/`is` with generics
- `void`, `dynamic`, `Object?`, and `Never` in generic position
- Variance in Dart (covariant, invariant, contravariant in practice)

### Key Concepts

- Dart generics are REIFIED: `List<int>` and `List<String>` have distinct runtime types, and `is` checks work on the type parameter.
- `T extends Bound` constrains `T` to subtypes of `Bound` — necessary when you call methods of `Bound` (e.g., `compareTo` for sorting).
- Type inference picks `T` from the argument types at the call site; you can also specify explicitly: `Box<int>(...)`.
- `void` as a type argument means "I don't care about the value"; e.g., `Future<void>` is a Future whose result is ignored.
- `Never` is the bottom type: a function returning `Never` never returns (always throws); `List<Never>` is a subtype of `List<T>` for any T.
- Variance: Dart is informally covariant for generics (a `List<Dog>` is assignable to `List<Animal>` for backward compat), but `is` checks remain sound.

```dart
class SortedList<T extends Comparable<T>> {
  final List<T> _items = [];

  void add(T item) {
    _items.add(item);
    _items.sort((a, b) => a.compareTo(b));
  }

  T get first => _items.first;
}

void main() {
  final sl = SortedList<int>(); // int implements Comparable<int>
  sl.add(3);
  sl.add(1);
  sl.add(2);
  print(sl.first); // 1
}
```
Caption: Generic class with bound

### Common Pitfalls

- Expecting `List<Dog>` to NOT be a `List<Animal>` — Dart is covariant for backward compatibility, so `List<Dog>` IS a `List<Animal>` statically, but adding a `Cat` to it throws at runtime. Use `List<Animal>` explicitly if you need mixed contents.
- Forgetting the bound when calling methods on `T` — `T x; x.compareTo(y)` is a compile error without `T extends Comparable<T>`.
- Confusing `void` and `Null` in generics — `Future<void>` is a Future whose result is ignored (and can be completed with `null` or any value, but you shouldn't read it); `Future<Null>` explicitly completes with `null`.
- Assuming generic erasure like Java — Dart keeps `List<int>` distinct at runtime, so `is List<int>` works. Don't try to "work around" erasure that doesn't exist.
- Using `dynamic` as a generic argument when you mean `Object?` — `List<dynamic>` disables type checking on element access; `List<Object?>` keeps it (you must cast to use the value).

### Real-World Applications

- Flutter's `State<T extends StatefulWidget>` and `InheritedWidget`/`InheritedModel` rely heavily on generics with bounds.
- The Dart SDK's `Completer<T>`, `Future<T>`, `Stream<T>` are generic; `Future<void>` is the canonical "fire and forget" type.
- Alibaba's repository layer uses `Repository<T extends Entity>` with `Comparable<T>` bounds to enforce consistent ordering across entity types.
- eBay Motors uses generics to type their pagination wrappers as `PageResult<T>` so the compiler catches type mismatches between layers.

### Interview Questions

- 1. Are Dart generics reified or erased? — Reified; `List<int>` knows it holds ints at runtime, and `is List<int>` works.
- 2. What does `T extends Comparable<T>` mean? — T must be a subtype of `Comparable<T>`, so the compiler allows `a.compareTo(b)` inside generic methods.
- 3. What's the difference between `Future<void>` and `Future<Null>`? — `Future<void>` says the result is ignored; `Future<Null>` says it completes with `null` specifically. `void` is the more idiomatic choice.
- 4. What is `Never`? — The bottom type; a function returning `Never` never returns (always throws), and `Never` is a subtype of every other type.
- 5. Is `List<Dog>` a `List<Animal>`? — Yes, statically (covariance for back-compat); but adding a non-Dog throws at runtime via `TypeError`.

### Mini Project

Build a Generic Cache: Implement `Cache<K extends Object, V>` with `get`, `set`, `remove`, `containsKey`, `clear`, and a `TTL` (time-to-live) using `DateTime`. Add an `LRUCache<K, V>` subclass that evicts the least-recently-used entry when capacity is exceeded. Suggested approach:
  - Store entries as `Map<K, _Entry<V>>` where `_Entry` holds value and expiry
  - Use `LinkedHashMap` (default) to track insertion order for LRU
  - Bound `K extends Object` so `K` is non-null and hashable
  - Add a `Stream<(K, V)>` getter that emits evictions
  - Write a `print`-based demo in `main`

### Exercises

1. Implement `T max<T extends Comparable<T>>(T a, T b, T c)`.
2. Define `Pair<A, B>` with `first` and `second` and value equality.
3. Use `is List<int>` and `is List<String>` to confirm reified generics.
4. Implement `R apply<T, R>(T x, R Function(T) f)`.
5. Create a `Box<T>` class with `unwrap()` that throws if accessed twice.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Are Dart generics reified or erased?
9. A) Erased (like Java)
10. B) Reified (known at runtime) (*)
11. C) Partially both
12. D) Configurable
13. Explanation: Dart keeps full type info at runtime, so `List<int>` is distinguishable from `List<String>` and `is List<int>` works.
14. Q2: What does `T extends Comparable<T>` do?
15. A) Makes T a Comparable
16. B) Forces T to be sealed
17. C) Constrains T to subtypes of Comparable<T> so compareTo is callable (*)
18. D) Makes T nullable
19. Explanation: The bound lets the compiler trust that any T has `compareTo(T)`, enabling generic sorting, max, etc.
20. Q3: Is `List<Dog>` assignable to `List<Animal>`?
21. A) No, never
22. B) Only with explicit cast
23. C) Only in const context
24. D) Yes (covariant) (*)
25. Explanation: Dart allows covariant assignment for backward compatibility, but adding a non-Dog throws at runtime via `TypeError`.
26. Q4: What is `Never`?
27. A) The bottom type — a function returning Never never returns (*)
28. B) A synonym for void
29. C) A nullable Object
30. D) The dynamic type
31. Explanation: `Never` is the bottom type: a function returning `Never` always throws or loops forever; `List<Never>` is a subtype of `List<T>` for any T.
32. Q5: What does `Future<void>` signify?
33. A) The Future never completes
34. B) The Future completes with no value (result ignored) (*)
35. C) The Future completes with null only
36. D) The Future is cancelled
37. Explanation: `Future<void>` is a Future whose result is intentionally ignored; the future still completes normally, you just don't read a value.
38. Q6: Which generic typedef syntax is valid?
39. A) typedef<T> Mapper = R Function(T);
40. B) typedef Mapper(T, R) = Function;
41. C) typedef Mapper<T, R> = R Function(T); (*)
42. D) generic typedef Mapper<T, R>;
43. Explanation: The modern syntax `typedef Name<TParam> = Signature;` introduces a generic function type alias.
44. Q7: What is the result of `([1,2,3] as List<int>).runtimeType`?
45. A) List
46. B) List<dynamic>
47. C) Object
48. D) List<int> (*)
49. Explanation: Because generics are reified, `runtimeType` returns the concrete parameterized type `List<int>`.
50. Q8: What's the issue with `List<dynamic>` vs `List<Object?>`?
51. A) `List<dynamic>` disables static checks on element access; `List<Object?>` keeps them (*)
52. B) They are identical
53. C) `List<Object?>` allows null; `List<dynamic>` does not
54. D) `List<dynamic>` is const-only
55. Explanation: `dynamic` opts out of static checking; `Object?` keeps it. You can call any method on `dynamic` elements; for `Object?` you must cast.
56. Q9: How do you specify T explicitly at a call site?
57. A) identity<T=int>(42)
58. B) identity<int>(42) (*)
59. C) identity(42) where T=int
60. D) int identity(42)
61. Explanation: Explicit type arguments use `<Type>` immediately after the function name: `identity<int>(42)`.
62. Q10: What does `T?` mean in a generic method?
63. A) T is nullable in the body
64. B) T must be Object
65. C) The return/parameter is a nullable T (*)
66. D) T must be Never
67. Explanation: `T?` is shorthand for `Null`-compatible T; if T is already nullable (e.g., `int?`), `T?` is just T (idempotent), per null safety rules.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Are Dart generics reified or erased?
  options:
    - Erased (like Java)
    - Reified (known at runtime)
    - Partially both
    - Configurable
  correctIndex: 1
  explanation: Dart keeps full type info at runtime, so `List<int>` is distinguishable from `List<String>` and `is List<int>` works.
- id: q2
  question: What does `T extends Comparable<T>` do?
  options:
    - Makes T a Comparable
    - Forces T to be sealed
    - Constrains T to subtypes of Comparable<T> so compareTo is callable
    - Makes T nullable
    - "`, enabling generic sorting, max, etc."
  correctIndex: 2
  explanation: The bound lets the compiler trust that any T has `compareTo(T)`, enabling generic sorting, max, etc.
- id: q3
  question: Is `List<Dog>` assignable to `List<Animal>`?
  options:
    - No, never
    - Only with explicit cast
    - Only in const context
    - Yes (covariant)
  correctIndex: 3
  explanation: Dart allows covariant assignment for backward compatibility, but adding a non-Dog throws at runtime via `TypeError`.
- id: q4
  question: What is `Never`?
  options:
    - The bottom type — a function returning Never never returns
    - A synonym for void
    - A nullable Object
    - The dynamic type
  correctIndex: 0
  explanation: "`Never` is the bottom type: a function returning `Never` always throws or loops forever; `List<Never>` is a subtype of `List<T>` for any T."
- id: q5
  question: What does `Future<void>` signify?
  options:
    - The Future never completes
    - The Future completes with no value (result ignored)
    - The Future completes with null only
    - The Future is cancelled
  correctIndex: 1
  explanation: "`Future<void>` is a Future whose result is intentionally ignored; the future still completes normally, you just don't read a value."
- id: q6
  question: Which generic typedef syntax is valid?
  options:
    - typedef<T> Mapper = R Function(T);
    - typedef Mapper(T, R) = Function;
    - typedef Mapper<T, R> = R Function(T);
    - generic typedef Mapper<T, R>;
  correctIndex: 2
  explanation: The modern syntax `typedef Name<TParam> = Signature;` introduces a generic function type alias.
- id: q7
  question: What is the result of `([1,2,3] as List<int>).runtimeType`?
  options:
    - List
    - List<dynamic>
    - Object
    - List<int>
  correctIndex: 3
  explanation: Because generics are reified, `runtimeType` returns the concrete parameterized type `List<int>`.
- id: q8
  question: What's the issue with `List<dynamic>` vs `List<Object?>`?
  options:
    - "`List<dynamic>` disables static checks on element access; `List<Object?>` keeps them"
    - They are identical
    - "`List<Object?>` allows null; `List<dynamic>` does not"
    - "`List<dynamic>` is const-only"
  correctIndex: 0
  explanation: "`dynamic` opts out of static checking; `Object?` keeps it. You can call any method on `dynamic` elements; for `Object?` you must cast."
- id: q9
  question: How do you specify T explicitly at a call site?
  options:
    - identity<T=int>(42)
    - identity<int>(42)
    - identity(42) where T=int
    - int identity(42)
  correctIndex: 1
  explanation: "Explicit type arguments use `<Type>` immediately after the function name: `identity<int>(42)`."
- id: q10
  question: What does `T?` mean in a generic method?
  options:
    - T is nullable in the body
    - T must be Object
    - The return/parameter is a nullable T
    - T must be Never
  correctIndex: 2
  explanation: "`T?` is shorthand for `Null`-compatible T; if T is already nullable (e.g., `int?`), `T?` is just T (idempotent), per null safety rules."
```

