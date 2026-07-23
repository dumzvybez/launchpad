---
slug: kotlin-inheritance-interfaces-abstract-classes
id: kotlin-07
track: kotlin
order: 7
title: Inheritance, Interfaces, and Abstract Classes
description: Extend classes, implement interfaces, override members, and understand Kotlin's "final by default" philosophy and the subtle init-order interactions in inheritance chains.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=3240s
whyItMatters: Extend classes, implement interfaces, override members, and understand Kotlin's "final by default" philosophy and the subtle init-order interactions in inheritance chains.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Inheritance, Interfaces, and Abstract Classes

## Inheritance, Interfaces, and Abstract Classes

### Why It Matters

Extend classes, implement interfaces, override members, and understand Kotlin's "final by default" philosophy and the subtle init-order interactions in inheritance chains.

Extend classes, implement interfaces, override members, and understand Kotlin's "final by default" philosophy and the subtle init-order interactions in inheritance chains.

### Prerequisites

- Stage 1-6.
- Solid grasp of classes, properties, and constructors.

### Topics

- open classes and open functions (final by default)
- Inheritance with `: SuperClass()`
- Overriding with `override` keyword
- Abstract classes and abstract members
- Interfaces with default method implementations
- Interface default method conflicts (diamond)
- super calls and super<T>.method()
- Init order in inheritance chains (the open-member-in-init trap)

### Key Concepts

- Kotlin classes and members are `final` by default — you must explicitly mark them `open` to allow inheritance/override.
- `override` is mandatory (not optional like Java's `@Override`); it's a keyword, not an annotation.
- An interface can have default method bodies; if a class implements two interfaces with the same method, it must override and disambiguate with `super<A>.method()`.
- Abstract classes can have constructors (primary), interfaces cannot.
- The init-order trap: a base class's init block may call an open method that's overridden in a subclass — but the subclass's properties haven't initialized yet, leading to subtle `null` reads.

```kotlin
open class Animal(val name: String) {
    open fun sound(): String = "..."
    fun eat() = "$name is eating"
}

class Dog(name: String) : Animal(name) {
    override fun sound(): String = "Woof"
}

val d = Dog("Rex")
println("${d.name}: ${d.sound()}")  // Rex: Woof
```
Caption: open class and override

### Common Pitfalls

- Forgetting `open` on a class you intend to subclass — `class Foo` is final; subclasses fail with "this type is final, so it cannot be inherited from".
- Calling open methods from an init block — the subclass's overrides run before the subclass's properties are initialized, leading to subtle nulls/zeros; mark such methods `final` or use factory functions.
- Confusing `super` with `super<T>` — `super.foo()` calls the immediate parent; `super<A>.foo()` is needed when multiple interfaces declare the same method.
- Implementing an interface without `override` — Kotlin requires `override fun method()` even for abstract interface members; forgetting it is a compile error.
- Expecting interfaces to have state — interfaces can have `val` properties but they must be abstract or backed by a custom getter; no instance fields allowed.

### Real-World Applications

- Kotlin's `Iterable` and `Collection` interfaces use default methods heavily (`map`, `filter`) so concrete collections inherit rich operations.
- Android's `Activity` and `Fragment` are open by design; Kotlin code overrides `onCreate`, `onViewCreated`, etc., and `override` is enforced.
- Spring's `JpaRepository` interface in Kotlin uses default methods for `findById`, `save` so concrete repo interfaces stay empty.
- JetBrains' IntelliJ Platform SDK uses abstract classes (e.g., `AnAction`) that Kotlin plugins override safely with `override` keyword.

### Interview Questions

- 1. Why are Kotlin classes final by default? — To favor composition over inheritance and prevent accidental breakage from subclasses; you opt-in with `open`.
- 2. What is the difference between `abstract` and `open`? — `abstract` requires a subclass to implement (cannot be instantiated); `open` merely permits overriding of an existing implementation.
- 3. How does Kotlin resolve diamond inheritance with interfaces? — The class must override the conflicting method and disambiguate with `super<A>.method()` and `super<B>.method()`.
- 4. What is the init-order trap and how do you avoid it? — Calling an open method from a base init block invokes the subclass override before subclass properties initialize; avoid by making the method final or moving setup to a factory.
- 5. Can an interface have a `val` property? — Yes, but it must be abstract (no backing field) or have a custom getter; interfaces cannot hold state.

### Mini Project

Build a Shape Hierarchy: An abstract Shape with abstract `area` and `perimeter`, a `describe()` default method, and three subclasses (Circle, Rectangle, Triangle). Demonstrate override, super calls, and polymorphism in a list. Suggested approach:
  - `abstract class Shape { abstract fun area(): Double; abstract fun perimeter(): Double; open fun describe() = "${this::class.simpleName} area=${area()} perimeter=${perimeter()}" }`
  - `class Circle(val r: Double) : Shape() { override fun area() = PI * r * r; override fun perimeter() = 2 * PI * r }`
  - `class Rectangle(val w: Double, val h: Double) : Shape()`
  - `class Triangle(val a: Double, val b: Double, val c: Double) : Shape()`
  - Put instances in a list, sort by area, and print `describe()`

### Exercises

1. Create `open class Vehicle(val maxSpeed: Int)` and subclass `Bicycle` that overrides `toString()`; mark `maxSpeed` so subclasses can't override its getter.
2. Define an interface `Drawable { fun draw() }` with a default body that prints "Drawing"; implement in two classes and call from a list typed as `List<Drawable>`.
3. Create a diamond: two interfaces with the same method, implement both in one class, and call `super<A>` and `super<B>`.
4. Reproduce the init-order trap: a base class that calls an open method in init and a subclass that reads a `val` in the override; print the surprising value.
5. Mark a method `final` in a subclass to prevent further override; attempt a deeper subclass to confirm the compile error.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: By default, can a Kotlin class be subclassed?
9. A) Yes, always
10. B) Only if it's abstract
11. C) No — it must be marked open (*)
12. D) Only if it has no constructor
13. Explanation: Kotlin classes are `final` by default; you must declare them `open` to permit inheritance, favoring composition.
14. Q2: What keyword is required to override a method?
15. A) @Override
16. B) reimplements
17. C) virtual
18. D) override (*)
19. Explanation: `override` is a hard keyword in Kotlin, not an annotation — forgetting it is a compile error.
20. Q3: What's the difference between abstract and open?
21. A) abstract requires subclass implementation; open permits overriding existing (*)
22. B) They are synonyms
23. C) abstract is for interfaces only
24. D) open is for interfaces only
25. Explanation: `abstract` members have no body and must be implemented; `open` members have a body and may be overridden.
26. Q4: How do you disambiguate when two interfaces declare the same default method?
27. A) Use @JvmName
28. B) Override and call super<A>.method() (*)
29. C) Use @ConflictResolver
30. D) You cannot implement both
31. Explanation: Override the method and explicitly call `super<InterfaceName>.method()` to choose which interface's default to invoke.
32. Q5: Can an interface have a default method body?
33. A) No
34. B) Only with @JvmDefault
35. C) Yes (*)
36. D) Only in Kotlin/JS
37. Explanation: Kotlin interfaces can have default method implementations; before Kotlin 1.5 you needed `@JvmDefault` for Java interop, now it's the default.
38. Q6: What happens if a base init block calls an open method overridden in a subclass?
39. A) The base version runs
40. B) Throws an AbstractMethodError
41. C) Compile error
42. D) The override runs, but subclass properties may not be initialized yet (*)
43. Explanation: The override runs (dynamic dispatch), but the subclass's property initializers haven't executed yet, so reads may see default values.
44. Q7: Can an abstract class have a constructor?
45. A) Yes, a primary constructor (*)
46. B) No
47. C) Only a no-arg constructor
48. D) Only private constructors
49. Explanation: Abstract classes can have primary constructors that subclasses call via `: AbstractClass(args)`; interfaces cannot have constructors.
50. Q8: Can an interface declare a val property?
51. A) No
52. B) Yes, but it's abstract or has a custom getter (no backing field) (*)
53. C) Yes, with full backing field
54. D) Only if it's const
55. Explanation: Interfaces can declare `val` properties but cannot hold state — they must be abstract or implemented with a custom getter.
56. Q9: What does `super.foo()` resolve to in a class implementing one interface?
57. A) The base class's method
58. B) A compile error
59. C) The interface's default method (*)
60. D) The current class's method
61. Explanation: With one parent (interface or class), `super.foo()` resolves unambiguously; multiple parents require `super<T>.foo()`.
62. Q10: Which keyword prevents further overriding in a subclass?
63. A) sealed
64. B) const
65. C) lock
66. D) final (*)
67. Explanation: `final` (allowed on an `override fun`) prevents subclasses from overriding it again; this is the same default as Java.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: By default, can a Kotlin class be subclassed?
  options:
    - Yes, always
    - Only if it's abstract
    - No — it must be marked open
    - Only if it has no constructor
  correctIndex: 2
  explanation: Kotlin classes are `final` by default; you must declare them `open` to permit inheritance, favoring composition.
- id: q2
  question: What keyword is required to override a method?
  options:
    - "@Override"
    - reimplements
    - virtual
    - override
  correctIndex: 3
  explanation: "`override` is a hard keyword in Kotlin, not an annotation — forgetting it is a compile error."
- id: q3
  question: What's the difference between abstract and open?
  options:
    - abstract requires subclass implementation; open permits overriding existing
    - They are synonyms
    - abstract is for interfaces only
    - open is for interfaces only
  correctIndex: 0
  explanation: "`abstract` members have no body and must be implemented; `open` members have a body and may be overridden."
- id: q4
  question: How do you disambiguate when two interfaces declare the same default method?
  options:
    - Use @JvmName
    - Override and call super<A>.method()
    - Use @ConflictResolver
    - You cannot implement both
  correctIndex: 1
  explanation: Override the method and explicitly call `super<InterfaceName>.method()` to choose which interface's default to invoke.
- id: q5
  question: Can an interface have a default method body?
  options:
    - No
    - Only with @JvmDefault
    - Yes
    - Only in Kotlin/JS
  correctIndex: 2
  explanation: Kotlin interfaces can have default method implementations; before Kotlin 1.5 you needed `@JvmDefault` for Java interop, now it's the default.
- id: q6
  question: What happens if a base init block calls an open method overridden in a subclass?
  options:
    - The base version runs
    - Throws an AbstractMethodError
    - Compile error
    - The override runs, but subclass properties may not be initialized yet
  correctIndex: 3
  explanation: The override runs (dynamic dispatch), but the subclass's property initializers haven't executed yet, so reads may see default values.
- id: q7
  question: Can an abstract class have a constructor?
  options:
    - Yes, a primary constructor
    - No
    - Only a no-arg constructor
    - Only private constructors
  correctIndex: 0
  explanation: "Abstract classes can have primary constructors that subclasses call via `: AbstractClass(args)`; interfaces cannot have constructors."
- id: q8
  question: Can an interface declare a val property?
  options:
    - No
    - Yes, but it's abstract or has a custom getter (no backing field)
    - Yes, with full backing field
    - Only if it's const
  correctIndex: 1
  explanation: Interfaces can declare `val` properties but cannot hold state — they must be abstract or implemented with a custom getter.
- id: q9
  question: What does `super.foo()` resolve to in a class implementing one interface?
  options:
    - The base class's method
    - A compile error
    - The interface's default method
    - The current class's method
  correctIndex: 2
  explanation: With one parent (interface or class), `super.foo()` resolves unambiguously; multiple parents require `super<T>.foo()`.
- id: q10
  question: Which keyword prevents further overriding in a subclass?
  options:
    - sealed
    - const
    - lock
    - final
  correctIndex: 3
  explanation: "`final` (allowed on an `override fun`) prevents subclasses from overriding it again; this is the same default as Java."
```

