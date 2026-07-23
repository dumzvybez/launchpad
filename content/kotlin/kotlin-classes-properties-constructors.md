---
slug: kotlin-classes-properties-constructors
id: kotlin-06
track: kotlin
order: 6
title: Classes, Properties, and Constructors
description: Define classes with primary and secondary constructors, init blocks, custom getters and setters, and master the subtle init order that catches every Kotlin newcomer.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=2700s
whyItMatters: Define classes with primary and secondary constructors, init blocks, custom getters and setters, and master the subtle init order that catches every Kotlin newcomer.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Classes, Properties, and Constructors

## Classes, Properties, and Constructors

### Why It Matters

Define classes with primary and secondary constructors, init blocks, custom getters and setters, and master the subtle init order that catches every Kotlin newcomer.

Define classes with primary and secondary constructors, init blocks, custom getters and setters, and master the subtle init order that catches every Kotlin newcomer.

### Prerequisites

- Stage 1-5.
- Understanding of functions, collections, and null safety.

### Topics

- class declaration with primary constructor
- Properties with val and var
- Custom getters and setters with field=
- init blocks and their execution order
- Secondary constructors (constructor keyword)
- Visibility modifiers: public, private, protected, internal
- Late-init properties (lateinit var)
- Lazy properties (by lazy)

### Key Concepts

- A Kotlin class has at most one primary constructor (in the header) and zero or more secondary constructors (must delegate to primary).
- Properties are first-class — every `val`/`var` declared in a class gets a backing field, getter, and (for var) setter automatically; you can override either.
- Init blocks run in the order they appear in the class body, interleaved with property initializers, all during the primary constructor execution.
- `lateinit var` is for non-null properties initialized after construction (e.g., in a lifecycle callback); it only works on `var` of non-primitive types.
- `by lazy` defers initialization until first access and is thread-safe by default (synchronized); it works on `val` only.

```kotlin
class Person(val name: String, var age: Int)

val p = Person("Alice", 30)
println(p.name)   // Alice
p.age = 31        // setter
// p.name = "Bob"  // compile error — val
```
Caption: Primary constructor with properties

### Common Pitfalls

- Confusing init order — property initializers and init blocks run top-to-bottom; a property declared after an init block that uses it will be `null` (or 0) at that point.
- Using `lateinit` on a `val` or primitive — `lateinit` only works on `var` of non-null, non-primitive types; use `by lazy` for `val` and a nullable `Int?` for primitives.
- Accessing `lateinit` before initialization — throws `UninitializedPropertyAccessException`; check with `::property.isInitialized` (only available on `lateinit var`).
- Forgetting that `protected` in Kotlin is more restrictive than Java — it means "accessible in subclass AND in the same class" but NOT in the same package; there is no package-protected.
- Expecting `by lazy` to be re-evaluated — it caches the first computation forever; use a custom getter or delegated property if you need re-computation.

### Real-World Applications

- Android's Activity and Fragment subclasses use `lateinit var` for views initialized in `onCreate` / `onViewCreated`.
- Jetpack Compose's `mutableStateOf` returns a property delegate that re-renders UI on change — same property mechanism under the hood.
- Spring Boot's `@Autowired` fields work with `lateinit var` because Spring injects after the no-arg constructor.
- Ktor's plugin config classes use init blocks to validate setup at install time.

### Interview Questions

- 1. What is the difference between primary and secondary constructors? — A class has one primary constructor (in the header); secondary constructors must delegate to it via `this(...)` and are usually only needed for multiple init shapes.
- 2. When are init blocks executed? — In declaration order, interleaved with property initializers, all during the primary constructor execution.
- 3. What does `lateinit var` enable and what are its limits? — Defers initialization of a non-null `var` to after construction; works only on non-primitive types and throws `UninitializedPropertyAccessException` if read early.
- 4. What does `by lazy` do and is it thread-safe? — Computes a `val` on first access and caches it; the default mode `LazyThreadSafetyMode.SYNCHRONIZED` is thread-safe via double-checked locking.
- 5. What is `field` in a custom setter? — The backing field reference, available only inside the accessor; without `field`, the setter would recurse infinitely.

### Mini Project

Build a Bank Account class: A class with a primary constructor (owner name, initial balance), custom setter for balance that rejects negatives, an init block that validates the owner name, and a lazy property for the account statement generator. Suggested approach:
  - `class Account(val owner: String, initialBalance: Double)`
  - Init block: `require(owner.isNotBlank()) { "Owner required" }`
  - `var balance: Double = initialBalance; set(value) { require(value >= 0) { "Negative balance" }; field = value }`
  - `val statement: String by lazy { generateStatement() }`
  - Methods `deposit(amount)` and `withdraw(amount)` that go through the setter

### Exercises

1. Define a `class Rectangle(val width: Double, val height: Double)` with a computed `val area` and verify with a unit test.
2. Add a custom setter to a `var name: String` that trims whitespace; verify it persists via `field = value.trim()`.
3. Create a class with two init blocks and a property initializer between them; print messages to demonstrate execution order.
4. Use `lateinit var service: Service` and access it before initialization to trigger `UninitializedPropertyAccessException`; then guard with `::service.isInitialized`.
5. Use `by lazy` for an expensive `val cached: ExpensiveData` and prove it computes only once with a print statement.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where is the primary constructor declared?
9. A) In the class body
10. B) In the class header (*)
11. C) In an init block
12. D) Outside the class
13. Explanation: The primary constructor is in the class header (`class Foo(val x: Int)`); secondary constructors go in the body with `constructor`.
14. Q2: What does `val name: String` in a primary constructor create?
15. A) A local variable
16. B) A function parameter only
17. C) A property with a getter (no setter) (*)
18. D) A static field
19. Explanation: `val`/`var` in the primary constructor declares a property automatically; without them the parameter is just a constructor-local value.
20. Q3: In what order do init blocks and property initializers run?
21. A) Init blocks first, then properties
22. B) Properties first, then init blocks
23. C) Random order
24. D) Top-to-bottom in source order (*)
25. Explanation: Property initializers and init blocks execute in the order they appear in the class body, interleaved.
26. Q4: What does `lateinit var` allow?
27. A) Deferred initialization of a non-null var (*)
28. B) Lazy initialization of a val
29. C) Constant properties
30. D) Mutable primitives
31. Explanation: `lateinit var` lets you declare a non-null property initialized after construction; works only on non-primitive `var` types.
32. Q5: What does `by lazy { ... }` return on second access?
33. A) Recomputes
34. B) Returns the cached value (*)
35. C) Throws an exception
36. D) Returns null
37. Explanation: `by lazy` caches the first computation forever (default Synchronized mode), so subsequent accesses return the cached value.
38. Q6: What is `field` in a custom setter?
39. A) A static variable
40. B) The parameter name
41. C) The backing field reference (*)
42. D) A reserved keyword for type
43. Explanation: `field` is a special identifier inside accessors that refers to the backing field; using the property name would cause infinite recursion.
44. Q7: What does accessing `lateinit var` before initialization throw?
45. A) NullPointerException
46. B) IllegalStateException
47. C) IllegalArgumentException
48. D) UninitializedPropertyAccessException (*)
49. Explanation: `UninitializedPropertyAccessException` is thrown when you read a `lateinit var` before it's been assigned.
50. Q8: Which modifier restricts access to the same class and its subclasses only?
51. A) protected (*)
52. B) public
53. C) internal
54. D) private
55. Explanation: `protected` in Kotlin means "same class + subclasses"; unlike Java it does NOT include the same package.
56. Q9: Can a secondary constructor skip delegating to the primary?
57. A) Yes, always
58. B) Only if there is no primary constructor (*)
59. C) Only with @JvmOverloads
60. D) Never
61. Explanation: If a class has a primary constructor, every secondary constructor must delegate to it (directly or via another secondary); without a primary, secondaries stand alone.
62. Q10: How do you check if a `lateinit var` is set?
63. A) `lateinit.isSet`
64. B) `property == null`
65. C) `::property.isInitialized` (*)
66. D) `property.isInitialized`
67. Explanation: The `::property.isInitialized` syntax (only for `lateinit var`) returns true if the property has been assigned.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where is the primary constructor declared?
  options:
    - In the class body
    - In the class header
    - In an init block
    - Outside the class
  correctIndex: 1
  explanation: "The primary constructor is in the class header (`class Foo(val x: Int)`); secondary constructors go in the body with `constructor`."
- id: q2
  question: "What does `val name: String` in a primary constructor create?"
  options:
    - A local variable
    - A function parameter only
    - A property with a getter (no setter)
    - A static field
  correctIndex: 2
  explanation: "`val`/`var` in the primary constructor declares a property automatically; without them the parameter is just a constructor-local value."
- id: q3
  question: In what order do init blocks and property initializers run?
  options:
    - Init blocks first, then properties
    - Properties first, then init blocks
    - Random order
    - Top-to-bottom in source order
  correctIndex: 3
  explanation: Property initializers and init blocks execute in the order they appear in the class body, interleaved.
- id: q4
  question: What does `lateinit var` allow?
  options:
    - Deferred initialization of a non-null var
    - Lazy initialization of a val
    - Constant properties
    - Mutable primitives
  correctIndex: 0
  explanation: "`lateinit var` lets you declare a non-null property initialized after construction; works only on non-primitive `var` types."
- id: q5
  question: What does `by lazy { ... }` return on second access?
  options:
    - Recomputes
    - Returns the cached value
    - Throws an exception
    - Returns null
  correctIndex: 1
  explanation: "`by lazy` caches the first computation forever (default Synchronized mode), so subsequent accesses return the cached value."
- id: q6
  question: What is `field` in a custom setter?
  options:
    - A static variable
    - The parameter name
    - The backing field reference
    - A reserved keyword for type
  correctIndex: 2
  explanation: "`field` is a special identifier inside accessors that refers to the backing field; using the property name would cause infinite recursion."
- id: q7
  question: What does accessing `lateinit var` before initialization throw?
  options:
    - NullPointerException
    - IllegalStateException
    - IllegalArgumentException
    - UninitializedPropertyAccessException
  correctIndex: 3
  explanation: "`UninitializedPropertyAccessException` is thrown when you read a `lateinit var` before it's been assigned."
- id: q8
  question: Which modifier restricts access to the same class and its subclasses only?
  options:
    - protected
    - public
    - internal
    - private
  correctIndex: 0
  explanation: '`protected` in Kotlin means "same class + subclasses"; unlike Java it does NOT include the same package.'
- id: q9
  question: Can a secondary constructor skip delegating to the primary?
  options:
    - Yes, always
    - Only if there is no primary constructor
    - Only with @JvmOverloads
    - Never
  correctIndex: 1
  explanation: If a class has a primary constructor, every secondary constructor must delegate to it (directly or via another secondary); without a primary, secondaries stand alone.
- id: q10
  question: How do you check if a `lateinit var` is set?
  options:
    - "`lateinit.isSet`"
    - "`property == null`"
    - "`::property.isInitialized`"
    - "`property.isInitialized`"
  correctIndex: 2
  explanation: The `::property.isInitialized` syntax (only for `lateinit var`) returns true if the property has been assigned.
```

