---
slug: dart-collections-list-set-map
id: dart-06
track: dart
order: 6
title: Collections — List, Set, Map
description: Use Dart's core collections (`List`, `Set`, `Map`), their literal syntax, generics, mutability vs const, spread operators, and the rich `Iterable` API for transforming data.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=3000s
whyItMatters: Use Dart's core collections (`List`, `Set`, `Map`), their literal syntax, generics, mutability vs const, spread operators, and the rich `Iterable` API for transforming data.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Collections — List, Set, Map

## Collections — List, Set, Map

### Why It Matters

Use Dart's core collections (`List`, `Set`, `Map`), their literal syntax, generics, mutability vs const, spread operators, and the rich `Iterable` API for transforming data.

Use Dart's core collections (`List`, `Set`, `Map`), their literal syntax, generics, mutability vs const, spread operators, and the rich `Iterable` API for transforming data.

### Prerequisites

- Stage 2: Variables, Types, and null safety
- Stage 4: Functions, Parameters, and Closures
- Stage 5: Strings, StringBuffer, and Regex

### Topics

- List, Set, Map literals and constructors
- Const collections and the `const` keyword
- Spread (`...`) and null-aware spread (`...?`)
- Collection-if/for inside literals (recap)
- `Iterable<T>` API: map, where, expand, fold, reduce, take, skip, distinct
- `forEach`, `for-in`, and when to use each
- `List` methods: add, insert, remove, sort, sublist, shuffle
- `Map` methods: putIfAbsent, update, containsKey, entries, keys, values
- `Set` operations: union, intersection, difference

### Key Concepts

- `Iterable<T>` is lazy; operations like `map` and `where` don't execute until you materialize (`.toList()`, `.length`, etc.).
- `List` is an ordered, indexable collection; `Set` is unordered and unique; `Map` is a key-value associative collection (LinkedHashMap by default, preserving insertion order).
- Const collections are deeply immutable and canonicalized; two `const [1, 2, 3]` literals are `identical`.
- `...?` spreads only when the iterable is non-null, avoiding `null` injection into a list.
- `List<E>.filled(n, v)` creates a fixed-length list; `List<E>.generate(n, fn)` builds one from a function.
- `sort` mutates the list in place and returns void; if you need a sorted copy, use `[...list]..sort()`.

```dart
const a = [1, 2, 3];
const b = [4, 5];
final combined = [...a, ...b, 6];           // [1,2,3,4,5,6]
List<int>? maybe;
final safe = [...a, ...?maybe];              // null-aware spread

final map = {'a': 1, 'b': 2};
final set = <String>{'x', 'y', 'x'};        // {x, y}
```
Caption: Literals and spreads

### Common Pitfalls

- Treating `Iterable` as a `List` — `iterable[i]` is a compile error; you must `.toList()` or `.elementAt(i)`. Worse, `iterable.length` consumes the iterable for some (like a `sync*` generator).
- Mutating a list during `forEach`/`for-in` — `ConcurrentModificationError`; iterate a snapshot or use an index.
- Expecting `Set` to preserve order — `LinkedHashSet` (the default) preserves insertion order, but `HashSet` (used by `Set.identity()`) does not; document the assumption.
- Using `Map.fromIterables` with mismatched lengths — silent truncation to the shorter; consider `Map.fromEntries` with a list of `MapEntry` objects for clarity.
- `sort` returns void — `final sorted = list.sort()` assigns `void` to `sorted`, which is rarely what you meant. Use `[...list]..sort()` for a sorted copy.

### Real-World Applications

- Flutter's `Row`/`Column` widgets take `List<Widget>`, and the framework spreads children with `...?` for optional groups.
- The Hamilton app groups showtimes by date using `Map<DateTime, List<Show>>` built via `putIfAbsent`.
- Alibaba's Xianyu uses `Iterable.expand` to flatten paginated product feeds before rendering.
- eBay Motors uses Set operations to deduplicate vehicle feature tags across multiple data providers.

### Interview Questions

- 1. What's the difference between `Iterable` and `List`? — `List` is indexable and materialized; `Iterable` is a lazy sequence that may be consumed once and has no `[]` operator.
- 2. How does `...?` differ from `...`? — `...?` spreads only if the iterable is non-null; `...` requires non-null or it throws.
- 3. What does `fold` do? — Combines elements into an accumulator via a function, starting from an initial value; generalizes `reduce` (which uses the first element as the initial accumulator).
- 4. Why does `sort()` return void? — It mutates the receiver in place for efficiency; chain `[...list]..sort()` for a sorted copy.
- 5. What's the default `Map` implementation in Dart? — `LinkedHashMap`, which preserves insertion order; use `HashMap` (no order guarantee) explicitly if needed.

### Mini Project

Build a Word Frequency Analyzer: A program that takes a string of text, tokenizes it into lowercase words (stripping punctuation), counts occurrences, and prints the top 10 most-frequent words using `Map`, `Set`, and the `Iterable` pipeline. Suggested approach:
  - Lowercase the input and split on `RegExp(r'\W+')` to get words
  - Filter out empty strings and common stopwords via a `Set<String>`
  - Build `Map<String, int>` counts using `update(word, (v) => v + 1, ifAbsent: () => 1)`
  - Convert `entries` to a list, sort by value descending, take 10
  - Print formatted with `padRight` for alignment

### Exercises

1. Use `fold` to compute the product of `[1, 2, 3, 4, 5]`.
2. Dedupe a list while preserving order using `Set` + spread.
3. Use `expand` to flatten `[['a','b'],['c']]` into a single list.
4. Build a `Map<String, int>` from two parallel lists of keys and values using `Map.fromIterables`.
5. Sort a list of `(String name, int score)` records by score descending using a comparator.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `...?maybeList` do?
9. A) Throws if maybeList is null
10. B) Spreads only if maybeList is non-null (*)
11. C) Wraps each element in nullable
12. D) Reverses the list
13. Explanation: The null-aware spread `...?x` inserts `x`'s elements only when `x` is non-null; null spreads nothing.
14. Q2: Which method on Iterable forces materialization?
15. A) map
16. B) where
17. C) toList() (*)
18. D) take
19. Explanation: `map`, `where`, and `take` return lazy Iterables; `toList()` (or `length`, `forEach`) forces evaluation and caches the result.
20. Q3: What does `fold<int>(0, (a, b) => a + b)` return for `[1,2,3]`?
21. A) 0
22. B) 3
23. C) [1,2,3]
24. D) 6 (*)
25. Explanation: `fold` starts with 0 and adds each element: ((0+1)+2)+3 = 6.
26. Q4: What is the default `Map` implementation in Dart?
27. A) LinkedHashMap (*)
28. B) HashMap
29. C) SplayTreeMap
30. D) TreeMap
31. Explanation: `{}` and `<K,V>{}` create `LinkedHashMap` instances, which preserve insertion order during iteration.
32. Q5: What does `list.sort()` return?
33. A) A sorted copy of the list
34. B) void — it mutates in place (*)
35. C) The sorted list (same reference)
36. D) The first element
37. Explanation: `sort` mutates the receiver and returns `void`; for a sorted copy use `[...list]..sort()`.
38. Q6: Which collection guarantees uniqueness?
39. A) List
40. B) Map
41. C) Set (*)
42. D) Queue
43. Explanation: `Set` rejects duplicate elements (per `==` and `hashCode`); `List` allows duplicates.
44. Q7: How do you compute the intersection of two sets?
45. A) a & b
46. B) a.intersect(b)
47. C) a.common(b)
48. D) a.intersection(b) (*)
49. Explanation: `Set.intersection(other)` returns the elements present in both sets.
50. Q8: Which creates a fixed-length list of 5 zeros?
51. A) List.filled(5, 0) (*)
52. B) List.generate(5, 0)
53. C) [0, 0, 0, 0, 0] only
54. D) List.of(0, 5)
55. Explanation: `List.filled(n, fill)` creates a list of length n with all elements set to `fill`; it's fixed-length unless `growable: true` is passed.
56. Q9: What happens if you call `iterable[0]`?
57. A) Returns the first element
58. B) Compile error — Iterable has no [] operator (*)
59. C) Throws IndexError
60. D) Returns null
61. Explanation: `Iterable` lacks random access; use `.first`, `.elementAt(0)`, or `.toList()[0]` instead.
62. Q10: What does `Map.update(key, fn, ifAbsent: () => init)` do?
63. A) Replaces the key
64. B) Removes the key
65. C) Updates the existing value via fn, or inserts init if missing (*)
66. D) Throws if key is missing (always)
67. Explanation: `update` applies `fn` to the current value if present, or inserts `ifAbsent()`'s result if the key is missing — useful for counters.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `...?maybeList` do?
  options:
    - Throws if maybeList is null
    - Spreads only if maybeList is non-null
    - Wraps each element in nullable
    - Reverses the list
  correctIndex: 1
  explanation: The null-aware spread `...?x` inserts `x`'s elements only when `x` is non-null; null spreads nothing.
- id: q2
  question: Which method on Iterable forces materialization?
  options:
    - map
    - where
    - toList()
    - take
  correctIndex: 2
  explanation: "`map`, `where`, and `take` return lazy Iterables; `toList()` (or `length`, `forEach`) forces evaluation and caches the result."
- id: q3
  question: What does `fold<int>(0, (a, b) => a + b)` return for `[1,2,3]`?
  options:
    - "0"
    - "3"
    - "[1,2,3]"
    - "6"
  correctIndex: 3
  explanation: "`fold` starts with 0 and adds each element: ((0+1)+2)+3 = 6."
- id: q4
  question: What is the default `Map` implementation in Dart?
  options:
    - LinkedHashMap
    - HashMap
    - SplayTreeMap
    - TreeMap
  correctIndex: 0
  explanation: "`{}` and `<K,V>{}` create `LinkedHashMap` instances, which preserve insertion order during iteration."
- id: q5
  question: What does `list.sort()` return?
  options:
    - A sorted copy of the list
    - void — it mutates in place
    - The sorted list (same reference)
    - The first element
  correctIndex: 1
  explanation: "`sort` mutates the receiver and returns `void`; for a sorted copy use `[...list]..sort()`."
- id: q6
  question: Which collection guarantees uniqueness?
  options:
    - List
    - Map
    - Set
    - Queue
  correctIndex: 2
  explanation: "`Set` rejects duplicate elements (per `==` and `hashCode`); `List` allows duplicates."
- id: q7
  question: How do you compute the intersection of two sets?
  options:
    - a & b
    - a.intersect(b)
    - a.common(b)
    - a.intersection(b)
  correctIndex: 3
  explanation: "`Set.intersection(other)` returns the elements present in both sets."
- id: q8
  question: Which creates a fixed-length list of 5 zeros?
  options:
    - List.filled(5, 0)
    - List.generate(5, 0)
    - "[0, 0, 0, 0, 0] only"
    - List.of(0, 5)
  correctIndex: 0
  explanation: "`List.filled(n, fill)` creates a list of length n with all elements set to `fill`; it's fixed-length unless `growable: true` is passed."
- id: q9
  question: What happens if you call `iterable[0]`?
  options:
    - Returns the first element
    - Compile error — Iterable has no [] operator
    - Throws IndexError
    - Returns null
  correctIndex: 1
  explanation: "`Iterable` lacks random access; use `.first`, `.elementAt(0)`, or `.toList()[0]` instead."
- id: q10
  question: "What does `Map.update(key, fn, ifAbsent: () => init)` do?"
  options:
    - Replaces the key
    - Removes the key
    - Updates the existing value via fn, or inserts init if missing
    - Throws if key is missing (always)
  correctIndex: 2
  explanation: "`update` applies `fn` to the current value if present, or inserts `ifAbsent()`'s result if the key is missing — useful for counters."
```

