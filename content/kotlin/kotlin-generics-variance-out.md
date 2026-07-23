---
slug: kotlin-generics-variance-out
id: kotlin-10
track: kotlin
order: 10
title: Generics and Variance (in/out)
description: Master Kotlin's declaration-site variance with `in` and `out`, use-site variance, type projections, and the reified generics that Java can only dream of.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=4860s
whyItMatters: Master Kotlin's declaration-site variance with `in` and `out`, use-site variance, type projections, and the reified generics that Java can only dream of.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Generics and Variance (in/out)

## Generics and Variance (in/out)

### Why It Matters

Master Kotlin's declaration-site variance with `in` and `out`, use-site variance, type projections, and the reified generics that Java can only dream of.

Master Kotlin's declaration-site variance with `in` and `out`, use-site variance, type projections, and the reified generics that Java can only dream of.

### Prerequisites

- Stage 1-9.
- Comfort with classes, interfaces, and the type system.

### Topics

- Generic functions and classes
- Type parameters: <T>, <T : Comparable<T>>
- Declaration-site variance: `out` (covariant) and `in` (contravariant)
- Use-site variance (Java-style ? extends / ? super)
- Type projections and star projection <*>
- Variance rules and the PECS mnemonic (Producer Extends, Consumer Super)
- Where-clauses: `where T : Comparable<T>, T : Serializable`
- Reified generics preview (full detail in Stage 13)

### Key Concepts

- `out T` makes a type parameter covariant: a `Producer<Cat>` is a subtype of `Producer<Animal>` — only allowed when T appears in `out` positions (return types).
- `in T` makes a type parameter contravariant: a `Comparator<Animal>` is a subtype of `Comparator<Cat>` — only allowed when T appears in `in` positions (parameters).
- Variance is declared at the class (`class Box<out T>`), not at the use site, unlike Java's `? extends`. This pushes the constraint to one place.
- Star projection `<*>` is like Java's `<?>` — use when you don't care about the type but still want type safety; you can only read `Any?` and cannot add.
- Reified generics (with `inline` functions) let you check `T::class` at runtime — impossible in Java due to type erasure.

```kotlin
// out: covariant — only produces T
interface Source<out T> { fun next(): T }
class CatSource : Source<Cat> { override fun next() = Cat() }
val s: Source<Animal> = CatSource()   // OK because Source is covariant

// in: contravariant — only consumes T
interface Comparator<in T> { fun compare(a: T, b: T): Int }
val c: Comparator<Cat> = object : Comparator<Animal> {
    override fun compare(a: Animal, b: Animal) = a.name.compareTo(b.name)
}
```
Caption: Declaration-site variance

### Common Pitfalls

- Trying to use `out T` when T also appears as a parameter type — the compiler rejects variance violations: "Type argument is not within its bounds" or "Variable in `in` position".
- Expecting `List<Cat>` to be a subtype of `List<Animal>` without variance — `List<T>` in Kotlin stdlib is declared `out T` so it works; if you write your own `class Box<T>`, it's invariant by default.
- Confusing `in` and `out` direction — `out` produces (returns T), `in` consumes (accepts T as parameter). PECS = Producer Extends, Consumer Super.
- Using reified generics without `inline` — `reified` requires `inline fun`; regular functions cannot have reified parameters due to type erasure.
- Forgetting that variance rules apply even within the class itself — a covariant `class Box<out T>` cannot have a method `fun set(t: T)` because T is in `in` position.

### Real-World Applications

- Kotlin's `List<out T>` is declared covariant so `List<Cat>` is a `List<Animal>` — used everywhere in idiomatic Kotlin.
- Kotlin's `Comparator<in T>` is contravariant so a `Comparator<Animal>` works for sorting `List<Cat>`.
- Jetpack Compose's `mutableStateOf<T>` uses variance carefully to allow covariant reads and invariant writes.
- Kotlin's `Flow<out T>` (Stage 16) is covariant so `Flow<Cat>` is a `Flow<Animal>` for collection.

### Interview Questions

- 1. What is declaration-site variance and how does it differ from Java's use-site? — Kotlin declares variance at the class (`out T`/`in T`) once; Java requires `? extends`/`? super` at every use site.
- 2. Explain the PECS mnemonic. — Producer Extends (use `out`/`? extends` when you only read T), Consumer Super (use `in`/`? super` when you only write T).
- 3. What is star projection `<*>`? — It's like Java's `<?>`: a type-erased projection where you can read `Any?` but cannot add; useful when the type doesn't matter.
- 4. Can you check `T is String` at runtime in a generic function? — Not in a regular function (erasure); only with `inline fun <reified T>` which inlines the type at the call site.
- 5. Why is `List<out T>` covariant? — Because `List` is read-only (no `add`); since T only appears in `out` position (return types of getters), covariant is safe.

### Mini Project

Build a Type-Safe Repository: A generic `Repository<T : Identifiable>` interface with covariant `ReadRepository<out T>` and contravariant `WriteRepository<in T>`, demonstrating PECS. Suggested approach:
  - `interface Identifiable { val id: String }`
  - `interface ReadRepository<out T : Identifiable> { fun findById(id: String): T?; fun all(): List<T> }`
  - `interface WriteRepository<in T : Identifiable> { fun save(item: T); fun delete(id: String) }`
  - `class UserRepository : ReadRepository<User>, WriteRepository<User>`
  - Demonstrate `val readers: List<ReadRepository<Identifiable>> = listOf(UserRepository(), PostRepository())`

### Exercises

1. Declare `class Box<out T>(val value: T)` and assign `Box<Cat>` to `Box<Animal>`; then try to add a method `fun put(t: T)` to see the variance violation.
2. Write `fun <T : Number> sumOf(list: List<T>): Double` that works for `List<Int>`, `List<Double>`, etc.
3. Use star projection: write `fun firstOrNull(list: List<*>): Any? = list.firstOrNull()`.
4. Write a `where` clause: `fun <T> sort(items: MutableList<T>) where T : CharSequence, T : Comparable<T>`.
5. Implement `inline fun <reified T> isInstance(x: Any): Boolean = x is T` and call `isInstance<String>("hi")`.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `out T` make a type parameter?
9. A) Contravariant
10. B) Covariant (*)
11. C) Invariant
12. D) Reified
13. Explanation: `out T` declares the parameter as covariant — a `Producer<Cat>` is a subtype of `Producer<Animal>`. T may only appear in `out` (return) positions.
14. Q2: What does `in T` make a type parameter?
15. A) Covariant
16. B) Invariant
17. C) Contravariant (*)
18. D) Reified
19. Explanation: `in T` declares the parameter as contravariant — a `Comparator<Animal>` is a subtype of `Comparator<Cat>`. T may only appear in `in` (parameter) positions.
20. Q3: What does PECS stand for?
21. A) Producer Equals, Consumer Subclass
22. B) Parent Extends, Child Super
23. C) Public External, Const Static
24. D) Producer Extends, Consumer Super (*)
25. Explanation: PECS = Producer Extends, Consumer Super. Use `out` (extends) when producing T, `in` (super) when consuming T.
26. Q4: What is star projection `<*>`?
27. A) A type projection where you can read Any? but cannot write (*)
28. B) Any type
29. C) A wildcard for nulls
30. D) A type alias for Object
31. Explanation: `<*>` is like Java's `<?>`: you can read elements as `Any?` but cannot add elements because the type is unknown.
32. Q5: Why is Kotlin's `List<out T>` covariant?
33. A) Because it's a keyword
34. B) Because List is read-only — T only appears in return positions (*)
35. C) Because List is mutable
36. D) Because List is sealed
37. Explanation: `List` is read-only (no `add`), so T only appears in `out` positions; covariant is safe, making `List<Cat>` a `List<Animal>`.
38. Q6: Can you write `class Box<out T>(var value: T)`?
39. A) Yes
40. B) Only with @JvmField
41. C) No — `var value` makes T appear in `in` position (setter), violating `out` (*)
42. D) Only if T is nullable
43. Explanation: A `var` property has a setter that takes T as a parameter (in position), which violates `out` variance — the compiler rejects this.
44. Q7: What does `where T : Comparable<T>, T : Serializable` do?
45. A) Aliases T
46. B) Hides T
47. C) Marks T as reified
48. D) Makes T a subtype of both (*)
49. Explanation: A `where` clause specifies multiple upper bounds; T must implement both `Comparable<T>` and `Serializable`.
50. Q8: How do you check `T is String` at runtime in a generic function?
51. A) Use `inline fun <reified T>` (*)
52. B) You cannot
53. C) Use reflection on T.class
54. D) Use `as String` cast
55. Explanation: Due to erasure, regular generics can't check `T is String`; `inline fun <reified T>` inlines the type at the call site so the check is possible.
56. Q9: Is `List<Cat>` a subtype of `List<Animal>` in Kotlin?
57. A) No, generics are invariant
58. B) Yes, because List is declared `out T` (*)
59. C) Only with explicit cast
60. D) Only at compile time
61. Explanation: Kotlin's stdlib `List<out T>` is covariant, so `List<Cat>` is a subtype of `List<Animal>` — no cast needed.
62. Q10: What is type erasure?
63. A) Hiding the implementation
64. B) Sealing a class
65. C) Removing generic parameters at runtime (*)
66. D) Deleting types
67. Explanation: Type erasure means generic type parameters (`<T>`) are not available at runtime; `List<String>` and `List<Int>` both become `List` at runtime on the JVM.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `out T` make a type parameter?
  options:
    - Contravariant
    - Covariant
    - Invariant
    - Reified
  correctIndex: 1
  explanation: "`out T` declares the parameter as covariant — a `Producer<Cat>` is a subtype of `Producer<Animal>`. T may only appear in `out` (return) positions."
- id: q2
  question: What does `in T` make a type parameter?
  options:
    - Covariant
    - Invariant
    - Contravariant
    - Reified
  correctIndex: 2
  explanation: "`in T` declares the parameter as contravariant — a `Comparator<Animal>` is a subtype of `Comparator<Cat>`. T may only appear in `in` (parameter) positions."
- id: q3
  question: What does PECS stand for?
  options:
    - Producer Equals, Consumer Subclass
    - Parent Extends, Child Super
    - Public External, Const Static
    - Producer Extends, Consumer Super
  correctIndex: 3
  explanation: PECS = Producer Extends, Consumer Super. Use `out` (extends) when producing T, `in` (super) when consuming T.
- id: q4
  question: What is star projection `<*>`?
  options:
    - A type projection where you can read Any? but cannot write
    - Any type
    - A wildcard for nulls
    - A type alias for Object
  correctIndex: 0
  explanation: "`<*>` is like Java's `<?>`: you can read elements as `Any?` but cannot add elements because the type is unknown."
- id: q5
  question: Why is Kotlin's `List<out T>` covariant?
  options:
    - Because it's a keyword
    - Because List is read-only — T only appears in return positions
    - Because List is mutable
    - Because List is sealed
  correctIndex: 1
  explanation: "`List` is read-only (no `add`), so T only appears in `out` positions; covariant is safe, making `List<Cat>` a `List<Animal>`."
- id: q6
  question: "Can you write `class Box<out T>(var value: T)`?"
  options:
    - "`?"
    - Yes
    - Only with @JvmField
    - No — `var value` makes T appear in `in` position (setter), violating `out`
    - Only if T is nullable
  correctIndex: 3
  explanation: A `var` property has a setter that takes T as a parameter (in position), which violates `out` variance — the compiler rejects this.
- id: q7
  question: "What does `where T : Comparable<T>, T : Serializable` do?"
  options:
    - Aliases T
    - Hides T
    - Marks T as reified
    - Makes T a subtype of both
  correctIndex: 3
  explanation: A `where` clause specifies multiple upper bounds; T must implement both `Comparable<T>` and `Serializable`.
- id: q8
  question: How do you check `T is String` at runtime in a generic function?
  options:
    - Use `inline fun <reified T>`
    - You cannot
    - Use reflection on T.class
    - Use `as String` cast
  correctIndex: 0
  explanation: Due to erasure, regular generics can't check `T is String`; `inline fun <reified T>` inlines the type at the call site so the check is possible.
- id: q9
  question: Is `List<Cat>` a subtype of `List<Animal>` in Kotlin?
  options:
    - No, generics are invariant
    - Yes, because List is declared `out T`
    - Only with explicit cast
    - Only at compile time
  correctIndex: 1
  explanation: Kotlin's stdlib `List<out T>` is covariant, so `List<Cat>` is a subtype of `List<Animal>` — no cast needed.
- id: q10
  question: What is type erasure?
  options:
    - Hiding the implementation
    - Sealing a class
    - Removing generic parameters at runtime
    - Deleting types
  correctIndex: 2
  explanation: Type erasure means generic type parameters (`<T>`) are not available at runtime; `List<String>` and `List<Int>` both become `List` at runtime on the JVM.
```

