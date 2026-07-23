---
slug: kotlin-object-declarations-companion-objects-singletons
id: kotlin-09
track: kotlin
order: 9
title: Object Declarations, Companion Objects, and Singletons
description: Use the `object` keyword for singletons and anonymous objects, the `companion object` for factory methods and constants, and understand how each compiles down on the JVM.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=4320s
whyItMatters: Use the `object` keyword for singletons and anonymous objects, the `companion object` for factory methods and constants, and understand how each compiles down on the JVM.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Object Declarations, Companion Objects, and Singletons

## Object Declarations, Companion Objects, and Singletons

### Why It Matters

Use the `object` keyword for singletons and anonymous objects, the `companion object` for factory methods and constants, and understand how each compiles down on the JVM.

Use the `object` keyword for singletons and anonymous objects, the `companion object` for factory methods and constants, and understand how each compiles down on the JVM.

### Prerequisites

- Stage 1-8.
- Familiarity with classes, inheritance, and data classes.

### Topics

- Object declarations (singletons) with `object Name { ... }`
- Lazy vs eager initialization of singletons
- Object expressions (anonymous objects)
- Companion objects inside classes
- Factory methods and constants on the companion
- @JvmStatic and @JvmField for Java interop
- const val vs val in companions
- Implementing interfaces in companions

### Key Concepts

- An `object Name { ... }` is a thread-safe singleton initialized lazily on first access (since Kotlin 1.4 the JVM uses a synchronized inner class holder).
- An `object : Foo { ... }` (object expression) creates an anonymous instance, like Java's anonymous inner class — useful for one-off implementations.
- A `companion object` is a singleton tied to a class; its members are accessed via `ClassName.member` (no instance).
- `const val` is a compile-time constant inlined at use sites; `val` in a companion is a runtime constant accessed via the companion instance.
- `@JvmStatic` makes a companion method callable as a true static from Java; otherwise Java must access via `ClassName.Companion.method()`.

```kotlin
object AppConfig {
    val version: String = "1.0.0"
    fun printInfo() = println("App v$version")
}

AppConfig.printInfo()   // App v1.0.0
// AppConfig is a singleton — same instance everywhere
```
Caption: Object singleton

### Common Pitfalls

- Using `object` for stateful singletons that need DI — `object` cannot have constructor parameters and is hard to swap in tests; prefer a `class` with a DI framework for testable code.
- Forgetting `const` for true constants — `val` in a companion is accessed via the companion instance at runtime; `const val` is inlined by the compiler and works in annotations.
- Calling companion members via instance in Kotlin — `User.create("x")` works but `user.create("x")` does not (companion members are class-level, not instance-level).
- Expecting `object` to be initialized at startup — singletons initialize lazily on first access (not class load), which matters for startup-time tuning and order-of-init bugs.
- Accessing companion from Java without `@JvmStatic` — Java code must write `User.Companion.create("x")`, which is awkward; annotate with `@JvmStatic` for clean interop.

### Real-World Applications

- Kotlin's `object` is used for global config, event bus implementations, and DI service locators in Android apps.
- Android's `Activity` companion objects hold `EXTRA_*` keys and `newIntent()` factory methods, called from Java via `@JvmStatic`.
- Anko (JetBrains' Android library) uses `object` for DSL scopes that need a singleton receiver.
- Spring Boot's Kotlin beans often use `companion object` with `@JvmStatic` for logger factories and helper methods.

### Interview Questions

- 1. What is the difference between `object` and `companion object`? — `object Name` is a standalone singleton; `companion object` is nested in a class and its members are accessed via `ClassName.member`.
- 2. When is an `object` singleton initialized? — Lazily on first access (thread-safe via JVM's class-init mechanism), not at program start.
- 3. What does `@JvmStatic` do? — Generates a true static method/field on the JVM for Java callers, so they don't have to go through `ClassName.Companion.method()`.
- 4. What is the difference between `const val` and `val` in a companion? — `const val` is inlined at compile time (must be primitive or String); `val` is a runtime property accessed via the companion instance.
- 5. When would you use an object expression vs an object declaration? — Object expressions create anonymous one-off instances (like Java's anonymous inner classes); object declarations are named singletons.

### Mini Project

Build a Logger Singleton: An `object Logger` with levels, a `companion object` on a `LogConfig` class with `const val` defaults, and an `@JvmStatic` method callable from Java. Suggested approach:
  - `object Logger { fun info(msg: String) = println("[INFO] $msg"); fun error(msg: String) = println("[ERROR] $msg") }`
  - `class LogConfig { companion object { const val DEFAULT_LEVEL = "INFO"; @JvmStatic fun defaultFormatter() = { s: String -> s.uppercase() } } }`
  - Test from Kotlin and from a small Java class to verify both styles work
  - Add a `var minLevel` to the object and filter messages below it

### Exercises

1. Create an `object Counter` with `inc()` and `count`; call from two threads and observe the count after `1000` increments each (it should be `2000`).
2. Add a `companion object` to a `class User` with a `factory(name: String): User` and call it as `User.factory("a")`.
3. Declare both `const val X = 1` and `val Y = 2` in a companion; inspect with `javap` to see `X` as static final and `Y` accessed via Companion.
4. Write an object expression that implements `Runnable` and pass it to a `Thread`; start it and observe the output.
5. Annotate a companion method with `@JvmStatic` and write a small Java class that calls it without `Companion`.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `object Name { ... }` declare?
9. A) A singleton (*)
10. B) A class
11. C) A function
12. D) An interface
13. Explanation: `object Name { ... }` is an object declaration — a thread-safe singleton instance initialized lazily on first access.
14. Q2: When is an `object` singleton initialized?
15. A) At compile time
16. B) Lazily on first access (*)
17. C) At program start
18. D) When the file is opened
19. Explanation: Object singletons are initialized lazily and thread-safely on first access via the JVM class-init mechanism.
20. Q3: How do you access a companion object's member?
21. A) `instance.member`
22. B) `ClassName.companion.member`
23. C) `ClassName.member` (*)
24. D) `ClassName.Companion::member`
25. Explanation: Companion members are accessed via the enclosing class name: `User.create("x")` (from Kotlin; Java needs `@JvmStatic` for true static).
26. Q4: What does `@JvmStatic` do?
27. A) Marks a method as static
28. B) Makes the class final
29. C) Adds a companion object
30. D) Generates a true static method/field for Java callers (*)
31. Explanation: `@JvmStatic` tells the compiler to also generate a real `static` method/field so Java callers don't have to write `ClassName.Companion.method()`.
32. Q5: What's the difference between `const val` and `val` in a companion?
33. A) const val is inlined at compile time; val is runtime (*)
34. B) None
35. C) const val is mutable; val is not
36. D) val is public; const val is private
37. Explanation: `const val` must be a primitive or String and is inlined at use sites; `val` is a runtime property accessed via the companion instance.
38. Q6: Which is an object expression (anonymous object)?
39. A) `object Foo { }`
40. B) `object : Foo { }` (*)
41. C) `companion object Foo`
42. D) `class Foo`
43. Explanation: `object : Foo { }` creates an anonymous instance implementing/extending `Foo`; useful for one-off implementations like listeners.
44. Q7: Can a `companion object` implement an interface?
45. A) No
46. B) Only with @JvmStatic
47. C) Yes (*)
48. D) Only if it's const
49. Explanation: A companion object can implement interfaces: `companion object : Factory<User> { ... }`, useful for the factory pattern and is testable.
50. Q8: What is `const val` restricted to?
51. A) Any type
52. B) Only Int
53. C) Only nullable types
54. D) Primitives and String (*)
55. Explanation: `const val` requires a compile-time constant of a primitive type or String; it's inlined at every use site.
56. Q9: From Java, how do you call a companion method WITHOUT @JvmStatic?
57. A) `ClassName.Companion.method()` (*)
58. B) `ClassName.method()`
59. C) `new ClassName().method()`
60. D) You cannot call it
61. Explanation: Without `@JvmStatic`, the method lives on the `Companion` instance, so Java must access it as `ClassName.Companion.method()`.
62. Q10: Can an `object` declaration have constructor parameters?
63. A) Yes, always
64. B) No — singletons cannot take constructor parameters (*)
65. C) Only with @JvmStatic
66. D) Only String parameters
67. Explanation: Object declarations have no constructor; you cannot pass init parameters. For parameterized singletons use a `class` with a DI container.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `object Name { ... }` declare?
  options:
    - A singleton
    - A class
    - A function
    - An interface
  correctIndex: 0
  explanation: "`object Name { ... }` is an object declaration — a thread-safe singleton instance initialized lazily on first access."
- id: q2
  question: When is an `object` singleton initialized?
  options:
    - At compile time
    - Lazily on first access
    - At program start
    - When the file is opened
  correctIndex: 1
  explanation: Object singletons are initialized lazily and thread-safely on first access via the JVM class-init mechanism.
- id: q3
  question: How do you access a companion object's member?
  options:
    - "`instance.member`"
    - "`ClassName.companion.member`"
    - "`ClassName.member`"
    - "`ClassName.Companion::member`"
  correctIndex: 2
  explanation: 'Companion members are accessed via the enclosing class name: `User.create("x")` (from Kotlin; Java needs `@JvmStatic` for true static).'
- id: q4
  question: What does `@JvmStatic` do?
  options:
    - Marks a method as static
    - Makes the class final
    - Adds a companion object
    - Generates a true static method/field for Java callers
  correctIndex: 3
  explanation: "`@JvmStatic` tells the compiler to also generate a real `static` method/field so Java callers don't have to write `ClassName.Companion.method()`."
- id: q5
  question: What's the difference between `const val` and `val` in a companion?
  options:
    - const val is inlined at compile time; val is runtime
    - None
    - const val is mutable; val is not
    - val is public; const val is private
  correctIndex: 0
  explanation: "`const val` must be a primitive or String and is inlined at use sites; `val` is a runtime property accessed via the companion instance."
- id: q6
  question: Which is an object expression (anonymous object)?
  options:
    - "`object Foo { }`"
    - "`object : Foo { }`"
    - "`companion object Foo`"
    - "`class Foo`"
  correctIndex: 1
  explanation: "`object : Foo { }` creates an anonymous instance implementing/extending `Foo`; useful for one-off implementations like listeners."
- id: q7
  question: Can a `companion object` implement an interface?
  options:
    - No
    - Only with @JvmStatic
    - Yes
    - Only if it's const
  correctIndex: 2
  explanation: "A companion object can implement interfaces: `companion object : Factory<User> { ... }`, useful for the factory pattern and is testable."
- id: q8
  question: What is `const val` restricted to?
  options:
    - Any type
    - Only Int
    - Only nullable types
    - Primitives and String
  correctIndex: 3
  explanation: "`const val` requires a compile-time constant of a primitive type or String; it's inlined at every use site."
- id: q9
  question: From Java, how do you call a companion method WITHOUT @JvmStatic?
  options:
    - "`ClassName.Companion.method()`"
    - "`ClassName.method()`"
    - "`new ClassName().method()`"
    - You cannot call it
  correctIndex: 0
  explanation: Without `@JvmStatic`, the method lives on the `Companion` instance, so Java must access it as `ClassName.Companion.method()`.
- id: q10
  question: Can an `object` declaration have constructor parameters?
  options:
    - Yes, always
    - No — singletons cannot take constructor parameters
    - Only with @JvmStatic
    - Only String parameters
  correctIndex: 1
  explanation: Object declarations have no constructor; you cannot pass init parameters. For parameterized singletons use a `class` with a DI container.
```

