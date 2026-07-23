---
slug: java-streams-lambda-expressions
id: java-11
track: java
order: 11
title: Streams and Lambda Expressions
description: Write functional-style code with lambda expressions, method references, the Stream API, Optional, and functional interfaces — and learn the parallel-stream pitfalls.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=12000s
whyItMatters: Write functional-style code with lambda expressions, method references, the Stream API, Optional, and functional interfaces — and learn the parallel-stream pitfalls.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Streams and Lambda Expressions

## Streams and Lambda Expressions

### Why It Matters

Write functional-style code with lambda expressions, method references, the Stream API, Optional, and functional interfaces — and learn the parallel-stream pitfalls.

Write functional-style code with lambda expressions, method references, the Stream API, Optional, and functional interfaces — and learn the parallel-stream pitfalls.

### Prerequisites

- Stage 10: Generics.
- Comfort with the Collection hierarchy and parameterized types.

### Topics

- Lambda expressions and functional interfaces
- The `java.util.function` package (Function, Predicate, Consumer, Supplier, BiFunction)
- Method references (`Class::method`, `instance::method`, `Class::new`)
- Stream pipeline: source, intermediate ops, terminal ops
- map, filter, reduce, collect, flatMap, groupBy
- `Collectors.toList`, `joining`, `groupingBy`, `partitioningBy`, `counting`
- Optional and its chaining methods
- Parallel streams — when they help and when they hurt

### Key Concepts

- A lambda's type is a functional interface (single abstract method); the compiler infers it from context.
- Streams are lazy: intermediate operations are not executed until a terminal operation is invoked.
- Stream pipelines are single-use; calling a terminal op consumes the stream — get a new one from the source.
- `Collectors.groupingBy` returns a `Map<K, List<T>>`; with a downstream collector you can compose sophisticated aggregations.
- Parallel streams use the common ForkJoinPool; for blocking I/O or shared mutable state they are a footgun.

```java
Function<String, Integer> len = String::length;        // method reference
Predicate<String> nonEmpty = s -> !s.isEmpty();
Consumer<String> printer = System.out::println;
Supplier<List<String>> factory = ArrayList::new;

System.out.println(len.apply("hello"));  // 5
```
Caption: Functional interfaces and lambdas

### Common Pitfalls

- Reusing a Stream — throws IllegalStateException; streams are single-use, so cache the source and call `.stream()` again.
- Using parallel streams for blocking I/O or shared mutable state — they share the common ForkJoinPool and can stall unrelated streams; side effects cause data races.
- Side effects in lambda (e.g., mutating an outside list) — not thread-safe and breaks the functional contract; use `collect` instead.
- Confusing `map` with `flatMap` — `map` produces a 1:1 stream of wrapped values; `flatMap` flattens one-to-many streams.
- Treating `Optional.get()` as safe — throws NoSuchElementException if empty; prefer `orElse`, `orElseThrow`, or `ifPresent`.

### Real-World Applications

- Netflix's rules engine uses streams and collectors to evaluate tens of thousands of playback rules per request across the catalog.
- Spotify's backend (much of it on the JVM) uses parallel streams for batch normalization of track features in machine-learning pipelines.
- Spring Framework 6's reactive `Flux` and `Mono` build on the same functional idioms (map, filter, flatMap) as Java Streams.
- IntelliJ's code-inspection passes are heavily stream-based — they parallelize independent inspections across PSI trees using parallelStream.

### Interview Questions

- 1. What is a functional interface? — An interface with exactly one abstract method (default/static methods don't count); lambdas target functional interfaces.
- 2. What is the difference between `map` and `flatMap`? — `map` is 1:1 (wraps results in a new stream); `flatMap` is 1:many (flattens inner streams into one).
- 3. Why are streams lazy? — Intermediate operations are recorded but not executed until a terminal operation pulls values, enabling short-circuiting and fusion.
- 4. When should you NOT use a parallel stream? — When the workload is blocking I/O, when the per-element work is tiny, when ordering matters, or when there's shared mutable state.
- 5. What is Optional for? — A typed container that signals the possible absence of a value, encouraging explicit handling rather than null checks; it's not a general-purpose wrapper.

### Mini Project

Build a Log Analyzer: Read a log file, parse each line into a structured record, and compute per-level counts, top-5 error messages, and the slowest 10 requests by duration. Suggested approach:
  - Read lines with `Files.lines(path)` (returns a Stream<String>)
  - Parse with a `Function<String, LogRecord>` (filter unparseable lines)
  - Use `Collectors.groupingBy(LogRecord::level, Collectors.counting())` for per-level counts
  - Use `sorted(Comparator.comparingLong(LogRecord::duration).reversed()).limit(10)` for the slowest
  - Wrap in try-with-resources since `Files.lines` holds a file handle

### Exercises

1. Implement `int sumOfSquares(List<Integer> xs)` using `stream().mapToInt(Integer::intValue).map(x -> x*x).sum()`; compare to an imperative version.
2. Use `Collectors.groupingBy` with a downstream `Collectors.mapping` to produce `Map<String, Set<Integer>>`.
3. Build an `Optional`-chained method that returns a user's zip code or `"00000"`; test with null user, null address, and a real chain.
4. Write a parallel-stream benchmark that sums 10M integers and measures speedup vs the sequential version; explain when the speedup materializes.
5. Convert a nested for-loop that builds a list of pairs into a `flatMap`-based stream pipeline; reason about which is clearer.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: A functional interface has how many abstract methods?
9. A) Zero
10. B) Any number
11. C) Exactly one (*)
12. D) At least two
13. Explanation: A functional interface has exactly one abstract method (default and static methods don't count). @FunctionalInterface is optional but recommended.
14. Q2: Streams are?
15. A) Eager by default
16. B) Always parallel
17. C) Reusable across terminal operations
18. D) Lazy — intermediate ops run only when a terminal op pulls (*)
19. Explanation: Intermediate operations are recorded as a pipeline; nothing executes until a terminal operation (collect, reduce, count, etc.) pulls values.
20. Q3: After a terminal operation, a Stream can be?
21. A) Not reused — IllegalStateException on second terminal op (*)
22. B) Reused indefinitely
23. C) Used once more
24. D) Reset by calling .parallel()
25. Explanation: Streams are single-use; calling a terminal op consumes the pipeline. Reusing it throws IllegalStateException — create a new stream from the source.
26. Q4: `flatMap` is used to?
27. A) Map each element 1:1
28. B) Flatten one-to-many into a single stream (*)
29. C) Sort the stream
30. D) Reduce to a single value
31. Explanation: flatMap takes a function returning a Stream (or array/Optional) per element and concatenates them into one stream; ideal for nested structures.
32. Q5: Parallel streams use which pool by default?
33. A) A new thread per element
34. B) A single dedicated worker
35. C) The common ForkJoinPool (*)
36. D) The EDT
37. Explanation: Parallel streams share the JVM-wide common ForkJoinPool (sized to #cores - 1 by default); blocking operations in a parallel stream can starve unrelated workloads.
38. Q6: `Collectors.groupingBy(...)` returns?
39. A) A List
40. B) A Set
41. C) An Optional
42. D) A Map<K, List<T>> (or with a downstream collector, a composed result) (*)
43. Explanation: groupingBy partitions elements by a classifier function into a Map; supplying a downstream collector (e.g., counting()) produces a Map<K, Long>.
44. Q7: `Optional.of(null)` throws?
45. A) NullPointerException (*)
46. B) NoSuchElementException
47. C) Nothing — returns Optional.empty()
48. D) IllegalStateException
49. Explanation: `Optional.of` requires a non-null value; for nullable inputs use `Optional.ofNullable`, which returns `Optional.empty()` on null.
50. Q8: Method reference `String::length` is equivalent to?
51. A) `() -> String.length`
52. B) `s -> s.length()` (*)
53. C) `s -> String.length(s)`
54. D) `() -> 0`
55. Explanation: `String::length` is a reference to the instance method `length` on String, evaluated against the first parameter; equivalent to the lambda `s -> s.length()`.
56. Q9: Side effects in a parallel stream lambda (e.g., mutating an outside ArrayList) cause?
57. A) Thread safety — streams handle it
58. B) Compile error
59. C) Data races and lost updates (*)
60. D) Automatic synchronization
61. Explanation: Parallel stream pipelines do not synchronize side effects; mutating an outside collection causes races and lost updates. Use collect() instead.
62. Q10: `.toList()` (Java 16+) returns?
63. A) A mutable ArrayList
64. B) A LinkedList
65. C) A Set
66. D) An unmodifiable List (*)
67. Explanation: The Stream.toList() terminal op added in Java 16 returns an unmodifiable list (calls into a stripped-down, allocation-friendly collector).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: A functional interface has how many abstract methods?
  options:
    - Zero
    - Any number
    - Exactly one
    - At least two
  correctIndex: 2
  explanation: A functional interface has exactly one abstract method (default and static methods don't count). @FunctionalInterface is optional but recommended.
- id: q2
  question: Streams are?
  options:
    - Eager by default
    - Always parallel
    - Reusable across terminal operations
    - Lazy — intermediate ops run only when a terminal op pulls
  correctIndex: 3
  explanation: Intermediate operations are recorded as a pipeline; nothing executes until a terminal operation (collect, reduce, count, etc.) pulls values.
- id: q3
  question: After a terminal operation, a Stream can be?
  options:
    - Not reused — IllegalStateException on second terminal op
    - Reused indefinitely
    - Used once more
    - Reset by calling .parallel()
  correctIndex: 0
  explanation: Streams are single-use; calling a terminal op consumes the pipeline. Reusing it throws IllegalStateException — create a new stream from the source.
- id: q4
  question: "`flatMap` is used to?"
  options:
    - Map each element 1:1
    - Flatten one-to-many into a single stream
    - Sort the stream
    - Reduce to a single value
  correctIndex: 1
  explanation: flatMap takes a function returning a Stream (or array/Optional) per element and concatenates them into one stream; ideal for nested structures.
- id: q5
  question: Parallel streams use which pool by default?
  options:
    - A new thread per element
    - A single dedicated worker
    - The common ForkJoinPool
    - The EDT
  correctIndex: 2
  explanation: "Parallel streams share the JVM-wide common ForkJoinPool (sized to #cores - 1 by default); blocking operations in a parallel stream can starve unrelated workloads."
- id: q6
  question: "`Collectors.groupingBy(...)` returns?"
  options:
    - A List
    - A Set
    - An Optional
    - A Map<K, List<T>> (or with a downstream collector, a composed result)
  correctIndex: 3
  explanation: groupingBy partitions elements by a classifier function into a Map; supplying a downstream collector (e.g., counting()) produces a Map<K, Long>.
- id: q7
  question: "`Optional.of(null)` throws?"
  options:
    - NullPointerException
    - NoSuchElementException
    - Nothing — returns Optional.empty()
    - IllegalStateException
  correctIndex: 0
  explanation: "`Optional.of` requires a non-null value; for nullable inputs use `Optional.ofNullable`, which returns `Optional.empty()` on null."
- id: q8
  question: Method reference `String::length` is equivalent to?
  options:
    - "`() -> String.length`"
    - "`s -> s.length()`"
    - "`s -> String.length(s)`"
    - "`() -> 0`"
  correctIndex: 1
  explanation: "`String::length` is a reference to the instance method `length` on String, evaluated against the first parameter; equivalent to the lambda `s -> s.length()`."
- id: q9
  question: Side effects in a parallel stream lambda (e.g., mutating an outside ArrayList) cause?
  options:
    - Thread safety — streams handle it
    - Compile error
    - Data races and lost updates
    - Automatic synchronization
  correctIndex: 2
  explanation: Parallel stream pipelines do not synchronize side effects; mutating an outside collection causes races and lost updates. Use collect() instead.
- id: q10
  question: "`.toList()` (Java 16+) returns?"
  options:
    - A mutable ArrayList
    - A LinkedList
    - A Set
    - An unmodifiable List
  correctIndex: 3
  explanation: The Stream.toList() terminal op added in Java 16 returns an unmodifiable list (calls into a stripped-down, allocation-friendly collector).
```

