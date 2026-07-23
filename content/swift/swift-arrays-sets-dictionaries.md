---
slug: swift-arrays-sets-dictionaries
id: swift-05
track: swift
order: 5
title: Arrays, Sets, and Dictionaries
description: Use Swift's three core collection types — `Array`, `Set`, and `Dictionary` — understand their value semantics, and know when each is the right choice.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=240s
whyItMatters: Use Swift's three core collection types — `Array`, `Set`, and `Dictionary` — understand their value semantics, and know when each is the right choice.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Arrays, Sets, and Dictionaries

## Arrays, Sets, and Dictionaries

### Why It Matters

Use Swift's three core collection types — `Array`, `Set`, and `Dictionary` — understand their value semantics, and know when each is the right choice.

Use Swift's three core collection types — `Array`, `Set`, and `Dictionary` — understand their value semantics, and know when each is the right choice.

### Prerequisites

- Stage 2: Variables, Types, and Optionals
- Stage 3: Control Flow
- Stage 4: Strings and `String.Index` (collection protocol concepts)

### Topics

- `Array<T>`: literal syntax, `append`, `remove`, `insert`, subscripting
- `Set<T>`: uniqueness, `Hashable` requirement, set algebra (`union`, `intersection`, `subtracting`)
- `Dictionary<K, V>`: literal syntax, subscript with default, `updateValue`, `removeValue`
- Value semantics and copy-on-write (COW)
- `Collection` and `Sequence` protocols (preview)
- `map`, `filter`, `reduce`, `compactMap`, `flatMap`
- Subscripting dictionaries returns optional
- Range-replaceable slices: `array[1..<3]`
- `ArraySlice` and its non-zero base index

### Key Concepts

- All three collection types are value types (structs) with COW — copies share storage until a mutation triggers a copy.
- `Dictionary` subscript returns `V?` because the key may be absent; use `dict[key, default: value]` to get a non-optional.
- `Set` requires `Hashable` elements; `Dictionary` keys must be `Hashable`.
- `ArraySlice` shares indices with its origin: `arr[5..<10].startIndex` is 5, not 0.
- `map`/`filter`/`reduce` are eager; for deferred work, use sequences and `lazy`.

```swift
var a = [1, 2, 3]
var b = a          // shares buffer with a (COW)
b.append(4)        // b's buffer copied, a unchanged
print(a)           // [1, 2, 3]
print(b)           // [1, 2, 3, 4]
```
Caption: Array basics and COW

### Common Pitfalls

- Treating `ArraySlice` as a fresh array — `slice[0]` may crash because the slice's `startIndex` matches the original array's index; convert with `Array(slice)` if you need index 0.
- Using `dict[key]!` instead of `dict[key, default: ...]` — force-unwrap crashes if the key is missing; use the defaulting subscript.
- Mutating an array while iterating its `indices` — `array.indices` is computed against the current array length; if you `append` mid-loop, indices become stale.
- Assuming `Set` preserves insertion order — it doesn't; use `Array` or an `OrderedDictionary` (swift-collections) if order matters.
- Forgetting to conform a custom type to `Hashable` before using it as a `Set` element or `Dictionary` key — the compiler will demand it.

### Real-World Applications

- Apple's `Dictionary(grouping:by:)` is used in Foundation to bucket notifications by category, providing O(1) lookup per group.
- LinkedIn uses `Set<UserID>` for de-duplication in feed generation, dropping repeat impressions in O(1) per check.
- Lyft uses `Dictionary<Location, RideRequest>` for the in-memory dispatcher; per-key updates are atomic on the value type.
- Things 3 uses arrays of UUIDs for ordered task references while a `Set<UUID>` enforces "no duplicate subtasks" in O(1).

### Interview Questions

- 1. Are Swift arrays value types or reference types? — Value types (structs) with copy-on-write; assignment shares storage, mutation copies.
- 2. What does `dict[key]` return and why? — An optional `V?`, because the key may be absent; use `dict[key, default: x]` for a non-optional.
- 3. What's the difference between `map` and `compactMap`? — `map` returns `T?` when the transform returns optional; `compactMap` discards nils and returns `[T]`.
- 4. Why does `ArraySlice` not start at index 0? — It shares indices with the origin; `arr[3..<6].startIndex` is 3, preserving the original indexing.
- 5. What protocol must a type conform to for `Set` membership or `Dictionary` keys? — `Hashable`, which requires a stable `hash(into:)` consistent with `==`.

### Mini Project

Build a Word Frequency Analyzer: Read a string of text and print the top 5 most frequent words (case-insensitive). Suggested approach:
  - Lowercase and split on whitespace/punctuation using `split(whereSeparator:)`
  - Use `Dictionary(words, countBy:)` or `reduce(into:)` to count
  - Use `dict[key, default: 0] += 1` for clean counting
  - Sort entries by descending count with `sorted(by:)`
  - Print with `prefix(5)` and string interpolation

### Exercises

1. Create `var a = [1,2,3]`, copy to `var b = a`, append to `b`, and confirm `a` is unchanged (COW).
2. Build a `Set<String>` of unique words from a paragraph; print its `count`.
3. Use `compactMap` to parse `["1","2","three","4"]` to `[Int]`.
4. Demonstrate the `ArraySlice` index trap: `let s = [10,20,30,40][2..<4]; print(s[0])` — observe the crash; fix with `Array(s)[0]`.
5. Use `Dictionary(grouping:by:)` to bucket names by first letter.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Are Swift `Array`, `Set`, and `Dictionary` value or reference types?
9. A) Value types with copy-on-write (*)
10. B) Reference types
11. C) Reference types for arrays only
12. D) Depends on element type
13. Explanation: All three are structs with COW — assignment is cheap (shared buffer), but mutation triggers a copy.
14. Q2: What does `dict["missing"]` return for `[String: Int]`?
15. A) 0
16. B) An `Int?` that is `nil` (*)
17. C) nil
18. D) A crash
19. Explanation: Dictionary subscript returns `V?`; absent keys yield `nil`. Use `dict["missing", default: 0]` to get a non-optional.
20. Q3: What does `compactMap` do that `map` doesn't?
21. A) Maps in parallel
22. B) Maps with an index
23. C) Discards `nil` results and unwraps (*)
24. D) Compacts the array size
25. Explanation: `compactMap` is `map` followed by `compact` (drop nils); it returns `[T]` from a transform of `T?`.
26. Q4: What is `startIndex` of `Array([10,20,30,40][2..<4])`?
27. A) 0
28. B) Always 0
29. C) Compile error
30. D) 2 (for the slice); `Array(...)` resets to 0 (*)
31. Explanation: An `ArraySlice` keeps index 2 from the origin; wrapping with `Array(...)` reindexes from 0. The slice itself has `startIndex == 2`.
32. Q5: What protocol must a `Set` element conform to?
33. A) Hashable (*)
34. B) Comparable
35. C) Equatable only
36. D) Codable
37. Explanation: `Set` and `Dictionary` keys must be `Hashable` so the hash table can bucket them; `Hashable` extends `Equatable`.
38. Q6: Which set operation returns elements in `a` but not in `b`?
39. A) `a.union(b)`
40. B) `a.subtracting(b)` (*)
41. C) `a.intersection(b)`
42. D) `a.symmetricDifference(b)`
43. Explanation: `subtracting(b)` returns the elements of `a` that are NOT in `b`; `symmetricDifference` returns elements in exactly one.
44. Q7: What is the time complexity of `dict[key]` lookup?
45. A) O(n)
46. B) O(log n)
47. C) O(1) average (*)
48. D) O(n log n)
49. Explanation: `Dictionary` is a hash table; lookup is O(1) amortized, with worst-case O(n) only under pathological hash collisions.
50. Q8: What does `reduce(0, +)` do on `[1,2,3]`?
51. A) Returns [1,2,3]
52. B) Returns 0
53. C) Compile error
54. D) Returns 6 (the sum) (*)
55. Explanation: `reduce` folds the array starting at 0, applying `+` cumulatively: `0+1+2+3 = 6`.
56. Q9: Does `Set` preserve insertion order?
57. A) No — it's unordered (*)
58. B) Yes
59. C) Only for Int
60. D) Only for String
61. Explanation: `Set` is unordered by spec; iteration order is implementation-defined. Use `Array` or `OrderedSet` from swift-collections if order matters.
62. Q10: What happens if you mutate an array while iterating `array.indices`?
63. A) Safe — indices update live
64. B) Indices become stale; possible crash or skipped elements (*)
65. C) Compile error
66. D) Mutations are deferred
67. Explanation: `indices` is computed from the current array; appending or removing shifts bounds, so iterating it during mutation is unsafe. Capture indices first or use `for-in` directly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Are Swift `Array`, `Set`, and `Dictionary` value or reference types?
  options:
    - Value types with copy-on-write
    - Reference types
    - Reference types for arrays only
    - Depends on element type
  correctIndex: 0
  explanation: All three are structs with COW — assignment is cheap (shared buffer), but mutation triggers a copy.
- id: q2
  question: 'What does `dict["missing"]` return for `[String: Int]`?'
  options:
    - "0"
    - An `Int?` that is `nil`
    - nil
    - A crash
  correctIndex: 1
  explanation: 'Dictionary subscript returns `V?`; absent keys yield `nil`. Use `dict["missing", default: 0]` to get a non-optional.'
- id: q3
  question: What does `compactMap` do that `map` doesn't?
  options:
    - Maps in parallel
    - Maps with an index
    - Discards `nil` results and unwraps
    - Compacts the array size
  correctIndex: 2
  explanation: "`compactMap` is `map` followed by `compact` (drop nils); it returns `[T]` from a transform of `T?`."
- id: q4
  question: What is `startIndex` of `Array([10,20,30,40][2..<4])`?
  options:
    - "0"
    - Always 0
    - Compile error
    - 2 (for the slice); `Array(...)` resets to 0
  correctIndex: 3
  explanation: An `ArraySlice` keeps index 2 from the origin; wrapping with `Array(...)` reindexes from 0. The slice itself has `startIndex == 2`.
- id: q5
  question: What protocol must a `Set` element conform to?
  options:
    - Hashable
    - Comparable
    - Equatable only
    - Codable
  correctIndex: 0
  explanation: "`Set` and `Dictionary` keys must be `Hashable` so the hash table can bucket them; `Hashable` extends `Equatable`."
- id: q6
  question: Which set operation returns elements in `a` but not in `b`?
  options:
    - "`a.union(b)`"
    - "`a.subtracting(b)`"
    - "`a.intersection(b)`"
    - "`a.symmetricDifference(b)`"
  correctIndex: 1
  explanation: "`subtracting(b)` returns the elements of `a` that are NOT in `b`; `symmetricDifference` returns elements in exactly one."
- id: q7
  question: What is the time complexity of `dict[key]` lookup?
  options:
    - O(n)
    - O(log n)
    - O(1) average
    - O(n log n)
  correctIndex: 2
  explanation: "`Dictionary` is a hash table; lookup is O(1) amortized, with worst-case O(n) only under pathological hash collisions."
- id: q8
  question: What does `reduce(0, +)` do on `[1,2,3]`?
  options:
    - Returns [1,2,3]
    - Returns 0
    - Compile error
    - Returns 6 (the sum)
  correctIndex: 3
  explanation: "`reduce` folds the array starting at 0, applying `+` cumulatively: `0+1+2+3 = 6`."
- id: q9
  question: Does `Set` preserve insertion order?
  options:
    - No — it's unordered
    - Yes
    - Only for Int
    - Only for String
  correctIndex: 0
  explanation: "`Set` is unordered by spec; iteration order is implementation-defined. Use `Array` or `OrderedSet` from swift-collections if order matters."
- id: q10
  question: What happens if you mutate an array while iterating `array.indices`?
  options:
    - Safe — indices update live
    - Indices become stale; possible crash or skipped elements
    - Compile error
    - Mutations are deferred
  correctIndex: 1
  explanation: "`indices` is computed from the current array; appending or removing shifts bounds, so iterating it during mutation is unsafe. Capture indices first or use `for-in` directly."
```

