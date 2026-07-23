---
slug: kotlin-strings-arrays-collections
id: kotlin-05
track: kotlin
order: 5
title: Strings, Arrays, and Collections
description: Manipulate strings with templates and raw literals, distinguish arrays from lists, and use Kotlin's rich collections API with sequences for lazy evaluation.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=2160s
whyItMatters: Manipulate strings with templates and raw literals, distinguish arrays from lists, and use Kotlin's rich collections API with sequences for lazy evaluation.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Strings, Arrays, and Collections

## Strings, Arrays, and Collections

### Why It Matters

Manipulate strings with templates and raw literals, distinguish arrays from lists, and use Kotlin's rich collections API with sequences for lazy evaluation.

Manipulate strings with templates and raw literals, distinguish arrays from lists, and use Kotlin's rich collections API with sequences for lazy evaluation.

### Prerequisites

- Stage 1-4.
- Familiarity with var, val, and functions.

### Topics

- String templates ($var and ${expr})
- Raw strings (triple-quoted """ """) with trimIndent and trimMargin
- String API: split, substring, replace, uppercase, lines
- Array<T> vs primitive arrays (IntArray, LongArray, etc.)
- listOf, mutableListOf, setOf, mapOf and their mutable counterparts
- Read-only vs immutable: List is read-only view, not deep immutable
- Collection operations: filter, map, sortedBy, groupBy, associate
- Sequences for lazy evaluation

### Key Concepts

- Kotlin distinguishes Array<Int> (boxed) from IntArray (primitive-backed); the latter avoids autoboxing overhead.
- `List<T>` is a read-only interface — it does not expose mutating methods — but the underlying instance may be a `MutableList` cast to `List`. True immutability requires `listOf` returns from a non-mutable source.
- String templates compile to a `StringBuilder` chain under the hood — `"a$b"` is efficient.
- Raw strings (`"""..."""`) preserve newlines and indentation; use `trimIndent()` to strip common leading whitespace or `trimMargin("|")` for explicit markers.
- Sequences evaluate lazily (like Java Streams): `list.asSequence().filter { }.map { }.toList()` avoids intermediate collections.

```kotlin
val name = "Alice"
val age = 30
println("$name is $age years old")           // Alice is 30 years old
println("Length: ${name.length}")            // Length: 5

val json = """
    {
      "name": "$name",
      "age": $age
    }
""".trimIndent()
println(json)
```
Caption: String templates and raw strings

### Common Pitfalls

- Treating `List` as deeply immutable — `val list: List<Int> = mutableListOf(1,2,3)` is a read-only view of a mutable list; another reference cast to `MutableList` can mutate it. Use `List.copyOf` (Java 10+) or wrap defensively.
- Using `Array<Int>` for large numeric data — it boxes every element; prefer `IntArray`, `LongArray`, `DoubleArray` for performance.
- Calling `.split(",")` and expecting regex semantics — the String overload treats the delimiter literally; the Regex overload is needed for patterns.
- Chaining `list.filter{}.map{}.filter{}` on huge collections — each step materializes an intermediate list; switch to `asSequence()` for lazy one-pass evaluation.
- Forgetting that `listOf(null)` is a compile error — `listOf<T?>` requires explicit nullable type argument; otherwise the compiler infers non-null.

### Real-World Applications

- Kotlin's collections API underpins Jetpack Compose's snapshot state — every UI state is a `List` or `Map` manipulated with `map`, `filter`, `sortedBy`.
- Square's Retrofit + Kotlin codebases use `associateBy` and `groupBy` to transform network DTOs into domain models in one expression.
- Ktor's content negotiation uses sequences to stream large JSON payloads without intermediate buffers.
- AndroidX Room's query results expose `List<Entity>` and recommend `asSequence()` for transformation-heavy mapping.

### Interview Questions

- 1. Difference between `Array<Int>` and `IntArray`? — `Array<Int>` is `Integer[]` (boxed); `IntArray` is `int[]` (primitive) — the latter avoids per-element boxing.
- 2. Is `List` in Kotlin immutable? — It's read-only (no mutating methods exposed), but the underlying instance may be a `MutableList`; it's not a guarantee of deep immutability.
- 3. What's the difference between a List pipeline and a Sequence? — Lists evaluate eagerly and materialize intermediate collections; Sequences evaluate lazily and short-circuit.
- 4. What does `trimIndent()` do on a raw string? — Detects the minimal common indentation across non-blank lines and strips it, so triple-quoted strings can be indented in source without leading spaces in output.
- 5. Why might you prefer `IntArray` in an Android app? — To avoid autoboxing churn and reduce GC pressure on memory-constrained devices.

### Mini Project

Build a Word Frequency Analyzer: Read a text block, tokenize it, ignore stop words, and print the top 10 words by frequency using groupBy, sortedByDescending, and take. Suggested approach:
  - Define a small `val STOP_WORDS = setOf("the", "a", "an", "is", ...)`
  - Use `rawText.split(Regex("\\W+")).filter { it.isNotBlank() && it.lowercase() !in STOP_WORDS }`
  - `groupBy { it.lowercase() }.mapValues { it.value.size }`
  - `toList().sortedByDescending { it.second }.take(10)`
  - Print formatted output with `${"%-15s".format(word)} $count`

### Exercises

1. Build a multi-line address using a raw string with `trimIndent()` and verify no leading whitespace appears in the output.
2. Time `filter { it % 2 == 0 }.map { it * it }.take(10).toList()` on `1..10_000_000` with both List and Sequence; compare with `measureTimeMillis`.
3. Use `associateBy` on a list of `data class User(val id: String, val name: String)` and verify duplicate keys keep the last value.
4. Convert an `IntArray` to a `List<Int>` with `toList()` and back with `toIntArray()`; confirm the round-trip is value-equal.
5. Use `groupBy` to bucket a list of timestamps by day-of-week using `java.time.LocalDate`.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `"Value: ${x + 1}"` use?
9. A) A string template expression (*)
10. B) A regex
11. C) A lambda
12. D) A format specifier
13. Explanation: `${expr}` evaluates an arbitrary expression inside a string template; `$var` works for simple variable names.
14. Q2: What do triple-quoted strings (""") allow?
15. A) Single-line only
16. B) Multi-line raw strings without escape sequences (*)
17. C) Comments
18. D) Regex literals
19. Explanation: `"""..."""` preserves newlines and avoids escaping `\`; commonly used for JSON, SQL, and HTML templates.
20. Q3: Difference between Array<Int> and IntArray?
21. A) They are identical
22. B) IntArray boxes; Array<Int> is primitive
23. C) Array<Int> boxes; IntArray is primitive-backed (*)
24. D) Array<Int> is deprecated
25. Explanation: `Array<Int>` is `Integer[]` (boxed); `IntArray` is `int[]` (unboxed) — important for performance with large numeric data.
26. Q4: Is `List<Int>` immutable?
27. A) Yes, always
28. B) Only if created with setOf
29. C) Only on the JVM
30. D) No, it's a read-only view that may hide a MutableList (*)
31. Explanation: `List` is read-only (no mutating methods exposed) but the underlying instance may be mutable; deep immutability is not guaranteed.
32. Q5: What does `nums.filter { it > 0 }.map { it * 2 }` produce?
33. A) A new List with transformed positive values (*)
34. B) An error
35. C) A lazy Sequence
36. D) The original list modified
37. Explanation: List operations are eager and return new lists; Sequences require explicit `asSequence()`.
38. Q6: How do you create a lazy pipeline?
39. A) `list.lazy()`
40. B) `list.asSequence()` (*)
41. C) `list.stream()`
42. D) `list.lazyMap { }`
43. Explanation: `asSequence()` wraps the list in a Sequence that evaluates lazily; intermediate steps don't materialize collections.
44. Q7: What does `groupBy { it % 2 }` return?
45. A) A List
46. B) A Set
47. C) A Map<Int, List<Int>> (*)
48. D) An Array
49. Explanation: `groupBy` returns a `Map<K, List<V>>` keyed by the lambda result, with each value being the matching elements.
50. Q8: What does `trimIndent()` do?
51. A) Removes all whitespace
52. B) Trims trailing newlines only
53. C) Removes the first line
54. D) Strips the minimal common leading whitespace from a raw string (*)
55. Explanation: `trimIndent()` finds the smallest common indentation across non-blank lines and removes it, normalizing raw-string formatting.
56. Q9: Which produces primitive storage for doubles?
57. A) `doubleArrayOf(1.0, 2.0)` (*)
58. B) `arrayOf(1.0, 2.0)`
59. C) `listOf(1.0, 2.0)`
60. D) `Array<Double>(2) { 0.0 }`
61. Explanation: `doubleArrayOf(...)` returns a `DoubleArray` backed by `double[]`; `arrayOf` returns `Array<Double>` (boxed).
62. Q10: Why prefer `asSequence()` for `list.filter{}.map{}.take(5)` on a million items?
63. A) Sequences are always faster
64. B) They avoid building intermediate million-element lists and short-circuit after 5 results (*)
65. C) They use multiple threads
66. D) They cache results in memory
67. Explanation: Sequences evaluate lazily and short-circuit; the pipeline only does enough work to produce 5 results rather than processing all 1M elements twice.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: 'What does `"Value: ${x + 1}"` use?'
  options:
    - A string template expression
    - A regex
    - A lambda
    - A format specifier
  correctIndex: 0
  explanation: "`${expr}` evaluates an arbitrary expression inside a string template; `$var` works for simple variable names."
- id: q2
  question: What do triple-quoted strings (""") allow?
  options:
    - Single-line only
    - Multi-line raw strings without escape sequences
    - Comments
    - Regex literals
  correctIndex: 1
  explanation: '`"""..."""` preserves newlines and avoids escaping `\`; commonly used for JSON, SQL, and HTML templates.'
- id: q3
  question: Difference between Array<Int> and IntArray?
  options:
    - They are identical
    - IntArray boxes; Array<Int> is primitive
    - Array<Int> boxes; IntArray is primitive-backed
    - Array<Int> is deprecated
  correctIndex: 2
  explanation: "`Array<Int>` is `Integer[]` (boxed); `IntArray` is `int[]` (unboxed) — important for performance with large numeric data."
- id: q4
  question: Is `List<Int>` immutable?
  options:
    - Yes, always
    - Only if created with setOf
    - Only on the JVM
    - No, it's a read-only view that may hide a MutableList
  correctIndex: 3
  explanation: "`List` is read-only (no mutating methods exposed) but the underlying instance may be mutable; deep immutability is not guaranteed."
- id: q5
  question: What does `nums.filter { it > 0 }.map { it * 2 }` produce?
  options:
    - A new List with transformed positive values
    - An error
    - A lazy Sequence
    - The original list modified
  correctIndex: 0
  explanation: List operations are eager and return new lists; Sequences require explicit `asSequence()`.
- id: q6
  question: How do you create a lazy pipeline?
  options:
    - "`list.lazy()`"
    - "`list.asSequence()`"
    - "`list.stream()`"
    - "`list.lazyMap { }`"
  correctIndex: 1
  explanation: "`asSequence()` wraps the list in a Sequence that evaluates lazily; intermediate steps don't materialize collections."
- id: q7
  question: What does `groupBy { it % 2 }` return?
  options:
    - A List
    - A Set
    - A Map<Int, List<Int>>
    - An Array
  correctIndex: 2
  explanation: "`groupBy` returns a `Map<K, List<V>>` keyed by the lambda result, with each value being the matching elements."
- id: q8
  question: What does `trimIndent()` do?
  options:
    - Removes all whitespace
    - Trims trailing newlines only
    - Removes the first line
    - Strips the minimal common leading whitespace from a raw string
  correctIndex: 3
  explanation: "`trimIndent()` finds the smallest common indentation across non-blank lines and removes it, normalizing raw-string formatting."
- id: q9
  question: Which produces primitive storage for doubles?
  options:
    - "`doubleArrayOf(1.0, 2.0)`"
    - "`arrayOf(1.0, 2.0)`"
    - "`listOf(1.0, 2.0)`"
    - "`Array<Double>(2) { 0.0 }`"
  correctIndex: 0
  explanation: "`doubleArrayOf(...)` returns a `DoubleArray` backed by `double[]`; `arrayOf` returns `Array<Double>` (boxed)."
- id: q10
  question: Why prefer `asSequence()` for `list.filter{}.map{}.take(5)` on a million items?
  options:
    - Sequences are always faster
    - They avoid building intermediate million-element lists and short-circuit after 5 results
    - They use multiple threads
    - They cache results in memory
  correctIndex: 1
  explanation: Sequences evaluate lazily and short-circuit; the pipeline only does enough work to produce 5 results rather than processing all 1M elements twice.
```

