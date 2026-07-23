---
slug: java-generics
id: java-10
track: java
order: 10
title: Generics
description: Master parameterized types, wildcards (`? extends`, `? super`), type erasure, generic methods, bounded type parameters, and the PECS rule.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=10800s
whyItMatters: Master parameterized types, wildcards (`? extends`, `? super`), type erasure, generic methods, bounded type parameters, and the PECS rule.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Generics

## Generics

### Why It Matters

Master parameterized types, wildcards (`? extends`, `? super`), type erasure, generic methods, bounded type parameters, and the PECS rule.

Master parameterized types, wildcards (`? extends`, `? super`), type erasure, generic methods, bounded type parameters, and the PECS rule.

### Prerequisites

- Stage 9: Collections Framework — List, Set, Map, Queue.
- Comfort with the Collection hierarchy and the Iterator pattern.

### Topics

- Generic class and interface declarations
- Generic methods (`<T> T first(List<T> list)`)
- Bounded type parameters (`<T extends Comparable<T>>`)
- Wildcards: `?`, `? extends T` (covariant), `? super T` (contravariant)
- PECS: Producer Extends, Consumer Super
- Type erasure and its runtime consequences
- Raw types and unchecked warnings
- Bridge methods and overload clashes

### Key Concepts

- Generics are a compile-time feature: types are erased to their bounds (or Object) at runtime.
- `List<String>` and `List<Integer>` are the same class at runtime (`List`); you cannot `instanceof List<String>`.
- `List<? extends Number>` is read-only (producer — you can get but not safely add); `List<? super Number>` is write-only (consumer — you can add Number but get Object).
- PECS: if you read from a collection, use `extends`; if you write to it, use `super`.
- Raw types (`List` without `<T>`) exist only for backward compatibility; new code should never use them.

```java
public class Pair<A, B> {
    private final A first;
    private final B second;
    public Pair(A first, B second) { this.first = first; this.second = second; }
    public A first() { return first; }
    public B second() { return second; }
}
Pair<String, Integer> p = new Pair<>("age", 30);
```
Caption: Generic class

### Common Pitfalls

- Trying to `new T()` or `new T[]` — generics are erased, so the runtime has no `T` to instantiate; pass a `Supplier<T>` or `Class<T>` token instead.
- Using `instanceof List<String>` — illegal at compile time; only raw `instanceof List` is allowed.
- Mixing raw and parameterized types — produces unchecked warnings and can cause heap pollution (a List<String> holding an Integer).
- Forgetting PECS and writing `void addAll(List<Number> nums)` — too restrictive; use `List<? extends Number>` so callers can pass List<Integer>.
- Expecting method overloading on generic type parameters — `void m(List<String>)` and `void m(List<Integer>)` clash because they share the same erasure.

### Real-World Applications

- The entire Java Collections Framework was retrofitted with generics in Java 5; List, Map, Set, and Iterator are all parameterized.
- Spring's `ApplicationEventPublisher<T>` and `RestClient` fluent API use bounded generics to enforce event types and response type safety.
- RxJava and Reactor's `Flow.Publisher<T>` / `Mono<T>` / `Flux<T>` are deeply generic, leveraging PECS in operators like `flatMap`.
- Guava's `ImmutableList<E>`, `Range<C extends Comparable>`, and `Optional<T>` are textbook examples of generics done right.

### Interview Questions

- 1. What is type erasure? — Generics exist only at compile time; the compiler erases type parameters to their bound (or Object) and inserts casts at use sites.
- 2. What is PECS? — Producer Extends, Consumer Super: read from `? extends T`, write to `? super T`.
- 3. Can you create a `new T()`? Why not? — No; the runtime has no T (erased). Pass a `Supplier<T>` or `Class<T>` token to instantiate reflectively.
- 4. What is heap pollution? — A variable of parameterized type points to an object of the wrong type (usually via raw types or unchecked casts); leads to ClassCastException later.
- 5. Why can't you overload `m(List<String>)` and `m(List<Integer>)`? — After erasure both become `m(List)`, so the JVM cannot distinguish them — compile-time clash.

### Mini Project

Build a Generic Repository: A `Repository<T, ID>` interface with `save`, `findById`, `findAll`, `deleteById`, and a `InMemoryRepository` implementation backed by a `Map<ID, T>`. Demonstrate PECS in a `copyTo` method. Suggested approach:
  - Define `interface Repository<T, ID> { Optional<T> findById(ID id); ... }`
  - Implement `InMemoryRepository<T extends Entity<ID>, ID>` with a ConcurrentHashMap
  - Add `void copyTo(Repository<? super T> sink)` (consumer super)
  - Add `void importFrom(Repository<? extends T> src)` (producer extends)
  - Test with `Repository<User, UUID>` and `Repository<Product, Long>`

### Exercises

1. Write a generic `Pair<A, B>` class with accessors and an `equals`/`hashCode` implementation; use it for two distinct type combinations.
2. Implement a generic `static <T> List<T> filter(List<T> in, Predicate<T> p)` and exercise it with String and Integer.
3. Apply PECS: write a method that copies from `List<? extends Number>` to `List<? super Number>` and explain why both wildcards are needed.
4. Demonstrate type erasure: print `List.of("a").getClass() == List.of(1).getClass()` and explain the result.
5. Trigger an unchecked warning by assigning a raw `List` to `List<String>` and inserting an Integer; observe the late ClassCastException on retrieval.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Generics in Java are implemented via?
9. A) Runtime type reification
10. B) Type erasure (*)
11. C) Compiler-only monomorphization
12. D) C++ templates
13. Explanation: Java generics use type erasure: the compiler removes type parameters (replacing with their bound or Object) and inserts casts at use sites.
14. Q2: PECS stands for?
15. A) Public, External, Concrete, Static
16. B) Parametric, Erased, Covariant, Subtype
17. C) Producer Extends, Consumer Super (*)
18. D) Predicate, Encoder, Consumer, Supplier
19. Explanation: PECS — read from `? extends T` (producer), write to `? super T` (consumer) — is the standard mnemonic for wildcard choice.
20. Q3: Can you write `new T()` in a generic method?
21. A) Yes, always
22. B) Only if T has a public no-arg constructor
23. C) Only in records
24. D) No — T is erased at runtime; pass a Supplier<T> or Class<T> (*)
25. Explanation: Erasure means the runtime has no Class<T> for the type parameter; you must pass a `Supplier<T>` or a `Class<T>` token to instantiate reflectively.
26. Q4: `List<String>.getClass() == List<Integer>.getClass()` evaluates to?
27. A) true (*)
28. B) false
29. C) Compile error
30. D) RuntimeException
31. Explanation: After erasure both are plain `ArrayList` (or `List`); they share the same Class object at runtime, which is why `instanceof List<String>` is illegal.
32. Q5: `List<? extends Number>` allows you to?
33. A) Add any Number
34. B) Read Numbers but not safely add (*)
35. C) Add Integers only
36. D) Mutate elements freely
37. Explanation: A `List<? extends Number>` could be a `List<Double>` at runtime; the compiler forbids adding anything but `null` to avoid heap pollution. Reading is safe (Number).
38. Q6: A raw type (`List` without `<T>`) is?
39. A) Recommended for new code
40. B) A compile error
41. C) Allowed only for backward compatibility; produces unchecked warnings (*)
42. D) Required for generics interop
43. Explanation: Raw types exist solely for pre-Java-5 compatibility. New code should always parameterize them; using raw types triggers unchecked warnings.
44. Q7: `void m(List<String>)` and `void m(List<Integer>)` together cause?
45. A) Nothing — they overload cleanly
46. B) Runtime ambiguity
47. C) A bridge method conflict
48. D) Compile error: same erasure (*)
49. Explanation: After erasure both methods become `void m(List)`, so the JVM cannot distinguish them; the compiler rejects the overload.
50. Q8: A bounded type parameter `<T extends Comparable<T>>` enforces?
51. A) That T is comparable to itself (*)
52. B) That T is final
53. C) That T is immutable
54. D) That T is serializable
55. Explanation: The bound requires T to be a subtype of `Comparable<T>`, letting the method call `t.compareTo(other)` with type safety.
56. Q9: Heap pollution occurs when?
57. A) The GC fails to collect an unreachable object
58. B) A generic type refers to an object of the wrong type (*)
59. C) A static field is not nulled
60. D) An array stores mixed types
61. Explanation: Heap pollution is when a variable of parameterized type refers to an object of an incompatible type — usually via raw types or unchecked casts — and surfaces as a later ClassCastException.
62. Q10: `List<? super Integer>` is appropriate when you want to?
63. A) Read Integers from the list
64. B) Sort the list
65. C) Write Integers to the list (*)
66. D) Make the list immutable
67. Explanation: `? super Integer` is a consumer: you can safely add Integer (or its subtypes, of which there are none), but reading returns Object.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Generics in Java are implemented via?
  options:
    - Runtime type reification
    - Type erasure
    - Compiler-only monomorphization
    - C++ templates
  correctIndex: 1
  explanation: "Java generics use type erasure: the compiler removes type parameters (replacing with their bound or Object) and inserts casts at use sites."
- id: q2
  question: PECS stands for?
  options:
    - Public, External, Concrete, Static
    - Parametric, Erased, Covariant, Subtype
    - Producer Extends, Consumer Super
    - Predicate, Encoder, Consumer, Supplier
  correctIndex: 2
  explanation: PECS — read from `? extends T` (producer), write to `? super T` (consumer) — is the standard mnemonic for wildcard choice.
- id: q3
  question: Can you write `new T()` in a generic method?
  options:
    - Yes, always
    - Only if T has a public no-arg constructor
    - Only in records
    - No — T is erased at runtime; pass a Supplier<T> or Class<T>
  correctIndex: 3
  explanation: Erasure means the runtime has no Class<T> for the type parameter; you must pass a `Supplier<T>` or a `Class<T>` token to instantiate reflectively.
- id: q4
  question: "`List<String>.getClass() == List<Integer>.getClass()` evaluates to?"
  options:
    - "true"
    - "false"
    - Compile error
    - RuntimeException
  correctIndex: 0
  explanation: After erasure both are plain `ArrayList` (or `List`); they share the same Class object at runtime, which is why `instanceof List<String>` is illegal.
- id: q5
  question: "`List<? extends Number>` allows you to?"
  options:
    - Add any Number
    - Read Numbers but not safely add
    - Add Integers only
    - Mutate elements freely
  correctIndex: 1
  explanation: A `List<? extends Number>` could be a `List<Double>` at runtime; the compiler forbids adding anything but `null` to avoid heap pollution. Reading is safe (Number).
- id: q6
  question: A raw type (`List` without `<T>`) is?
  options:
    - Recommended for new code
    - A compile error
    - Allowed only for backward compatibility; produces unchecked warnings
    - Required for generics interop
  correctIndex: 2
  explanation: Raw types exist solely for pre-Java-5 compatibility. New code should always parameterize them; using raw types triggers unchecked warnings.
- id: q7
  question: "`void m(List<String>)` and `void m(List<Integer>)` together cause?"
  options:
    - Nothing — they overload cleanly
    - Runtime ambiguity
    - A bridge method conflict
    - "Compile error: same erasure"
  correctIndex: 3
  explanation: After erasure both methods become `void m(List)`, so the JVM cannot distinguish them; the compiler rejects the overload.
- id: q8
  question: A bounded type parameter `<T extends Comparable<T>>` enforces?
  options:
    - That T is comparable to itself
    - That T is final
    - That T is immutable
    - That T is serializable
  correctIndex: 0
  explanation: The bound requires T to be a subtype of `Comparable<T>`, letting the method call `t.compareTo(other)` with type safety.
- id: q9
  question: Heap pollution occurs when?
  options:
    - The GC fails to collect an unreachable object
    - A generic type refers to an object of the wrong type
    - A static field is not nulled
    - An array stores mixed types
  correctIndex: 1
  explanation: Heap pollution is when a variable of parameterized type refers to an object of an incompatible type — usually via raw types or unchecked casts — and surfaces as a later ClassCastException.
- id: q10
  question: "`List<? super Integer>` is appropriate when you want to?"
  options:
    - Read Integers from the list
    - Sort the list
    - Write Integers to the list
    - Make the list immutable
  correctIndex: 2
  explanation: "`? super Integer` is a consumer: you can safely add Integer (or its subtypes, of which there are none), but reading returns Object."
```

