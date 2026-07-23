---
slug: kotlin-extension-functions-properties
id: kotlin-11
track: kotlin
order: 11
title: Extension Functions and Properties
description: Add methods to classes you don't own — including third-party and JDK classes — with extension functions and properties, and learn why they resolve statically.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=5400s
whyItMatters: Add methods to classes you don't own — including third-party and JDK classes — with extension functions and properties, and learn why they resolve statically.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Extension Functions and Properties

## Extension Functions and Properties

### Why It Matters

Add methods to classes you don't own — including third-party and JDK classes — with extension functions and properties, and learn why they resolve statically.

Add methods to classes you don't own — including third-party and JDK classes — with extension functions and properties, and learn why they resolve statically.

### Prerequisites

- Stage 1-10.
- Comfort with functions, classes, and generics.

### Topics

- Extension functions: `fun String.isEmail(): Boolean`
- Extension properties: `val Int.isEven: Boolean`
- Nullable receiver: `fun String?.orDefault(s: String)`
- Extensions on generic types
- Resolution is static (not virtual)
- Member functions win over extensions
- Extensions in packages and import
- Standard library extensions (let, run, also, etc. preview)

### Key Concepts

- Extensions do NOT modify the class — they're syntactic sugar for `static fun isEmail(receiver: String): Boolean` resolved at compile time.
- Because resolution is static, an extension called on a `Number` variable holding an `Int` calls the `Number` extension, not the `Int` one.
- If a class later adds a member function with the same signature as your extension, the member wins (your extension silently stops being called).
- Nullable receiver extensions let you call methods on `null` without `?.` — useful for `orEmpty()` etc.
- Extensions on generic types like `fun <T> List<T>.secondOrNull(): T?` are how the stdlib builds much of its collection API.

```kotlin
fun String.isEmail(): Boolean =
    this.contains("@") && this.contains(".") && this.length > 5

println("alice@example.com".isEmail())   // true
println("not-an-email".isEmail())        // false
// `this` refers to the receiver (the String)
```
Caption: Basic extension function

### Common Pitfalls

- Expecting extensions to participate in dynamic dispatch — `Animal.speak()` is called on a `Dog` typed as `Animal`; the static (declared) type wins, not the runtime type.
- Hiding extensions behind member functions — if the class later adds a member with the same signature, your extension silently stops being called; this is a maintenance trap.
- Forgetting to import extensions — extensions defined in a package must be imported (`import com.example.strings.isEmail`) to be usable; IDEs do this automatically.
- Putting too many extensions in a global file — namespace pollution; group extensions in cohesive files (e.g., `StringUtils.kt`).
- Using extension properties with `var` and a backing field — extension properties cannot have backing fields; they must compute from `this`.

### Real-World Applications

- Kotlin's stdlib collection API (`filter`, `map`, `sortedBy`, `groupBy`) is implemented almost entirely as extension functions on `Iterable<T>`.
- Android's KTX libraries (androidx.core) add hundreds of extension functions to platform classes like `View`, `Context`, `SharedPreferences`.
- Square's Picasso and Glide have Kotlin extensions that turn `ImageView.load(url)` into a one-liner.
- Ktor's `ApplicationCall.respond(...)` is an extension function — the call site reads like a method but is statically resolved.

### Interview Questions

- 1. Are extension functions virtual or static? — Static. They resolve based on the declared (compile-time) type, not the runtime type — they're syntactic sugar for top-level functions taking the receiver as the first parameter.
- 2. What happens if a class adds a member function with the same signature as your extension? — The member wins; the extension is silently shadowed and no longer called.
- 3. Can extension functions be overridden in subclasses? — No, because they're not members; resolution is static at the call site.
- 4. What is a nullable receiver extension? — An extension declared on `Type?` that handles `null` itself (e.g., `fun String?.orEmpty(): String = this ?: ""`), so callers don't need `?.`.
- 5. Why can't extension properties have backing fields? — Because extensions don't actually add state to the class; they only add accessors that compute from the existing `this`.

### Mini Project

Build a String Utilities Library: A `StringUtils.kt` file with extensions like `isEmail`, `isPhone`, `toTitleCase`, `truncate(maxLen)`, and a nullable `orDefault`. Demonstrate static dispatch with a small hierarchy. Suggested approach:
  - `fun String.isEmail(): Boolean = matches(Regex("^[^@]+@[^@]+\\.[^@]+$"))`
  - `fun String.toTitleCase(): String = split(" ").joinToString(" ") { it.replaceFirstChar { c -> c.titlecase() } }`
  - `fun String.truncate(max: Int): String = if (length <= max) this else take(max - 1) + "…"`
  - `fun String?.orDefault(d: String): String = this ?: d`
  - Demonstrate that an extension on `Any` called via `Any` variable holding `String` resolves to `Any`'s extension

### Exercises

1. Write `fun Int.factorial(): Long` as an extension and call `5.factorial()`.
2. Write a nullable-receiver extension `fun List<*>?.sizeOrZero(): Int = this?.size ?: 0` and test with null.
3. Define `fun Animal.speak()` and `fun Dog.speak()`; call via `Animal` variable holding `Dog` to verify static dispatch.
4. Add an extension property `val List<Int>.sumSquares: Int` and verify it computes correctly.
5. Put extensions in a `com.example.ext` package, then import them into a different file and verify they only resolve with the import.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How are extension functions resolved?
9. A) Dynamically (by runtime type)
10. B) By name only
11. C) Statically (by declared type) (*)
12. D) By the order of imports
13. Explanation: Extensions are syntactic sugar for static functions; resolution is based on the declared (compile-time) type of the receiver.
14. Q2: What happens if a class adds a member function with the same signature as your extension?
15. A) Compile error
16. B) Both are called
17. C) The extension wins
18. D) The member wins; the extension is shadowed (*)
19. Explanation: Member functions always take precedence over extensions; your extension silently stops being called if a member with the same signature is added.
20. Q3: What does `this` refer to in `fun String.isEmail(): Boolean`?
21. A) The receiver String instance (*)
22. B) The companion object
23. C) The function itself
24. D) Nothing
25. Explanation: Inside an extension function, `this` is the receiver (the String the function is called on); you can also use the bare name of any member.
26. Q4: Can extension functions be overridden in subclasses?
27. A) Yes, with override
28. B) No — they are not members and resolved statically (*)
29. C) Only with @JvmStatic
30. D) Only if marked open
31. Explanation: Extensions are not part of the class hierarchy, so they cannot be virtual; the call site's declared type decides which extension fires.
32. Q5: What is a nullable receiver extension?
33. A) An extension that returns null
34. B) An extension that requires null
35. C) An extension declared on `Type?` that handles null itself (*)
36. D) A deprecated feature
37. Explanation: `fun String?.orEmpty(): String = this ?: ""` declares an extension on a nullable type; callers don't need `?.` because the extension handles null.
38. Q6: Can extension properties have backing fields?
39. A) Yes, always
40. B) Only with `const`
41. C) Only for `var`
42. D) No — they must compute from `this` (*)
43. Explanation: Extension properties cannot have backing fields because extensions don't add state; they only add accessors that compute from the receiver.
44. Q7: Where do you need to import extensions from?
45. A) From the package where they're declared (*)
46. B) They're always available
47. C) Only from kotlin.io
48. D) From the JDK
49. Explanation: Extensions are scoped to their declaring package; `import com.example.ext.isEmail` is needed before use (the IDE auto-imports).
50. Q8: Given `open class A; class B : A()`, `fun A.f() = "A"`, `fun B.f() = "B"`, what does `val a: A = B(); a.f()` print?
51. A) "B"
52. B) "A" (*)
53. C) Compile error
54. D) Throws at runtime
55. Explanation: Static dispatch uses the declared type `A`, so `A.f()` is called even though the runtime instance is `B`.
56. Q9: Which stdlib API is implemented as extension functions?
57. A) `println`
58. B) `if` / `when`
59. C) `Iterable.filter`, `Iterable.map`, etc. (*)
60. D) `class` keyword
61. Explanation: Most of the stdlib collection API (`filter`, `map`, `sortedBy`, `groupBy`) are extension functions on `Iterable<T>` and `Collection<T>`.
62. Q10: What is the receiver in `fun <T> List<T>.secondOrNull(): T?`?
63. A) T
64. B) Nothing
65. C) The function itself
66. D) `List<T>` — the type the extension is added to (*)
67. Explanation: The receiver is `List<T>`; the extension adds `secondOrNull()` to every `List<T>` and uses `this` to refer to the list inside.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How are extension functions resolved?
  options:
    - Dynamically (by runtime type)
    - By name only
    - Statically (by declared type)
    - By the order of imports
  correctIndex: 2
  explanation: Extensions are syntactic sugar for static functions; resolution is based on the declared (compile-time) type of the receiver.
- id: q2
  question: What happens if a class adds a member function with the same signature as your extension?
  options:
    - Compile error
    - Both are called
    - The extension wins
    - The member wins; the extension is shadowed
  correctIndex: 3
  explanation: Member functions always take precedence over extensions; your extension silently stops being called if a member with the same signature is added.
- id: q3
  question: "What does `this` refer to in `fun String.isEmail(): Boolean`?"
  options:
    - The receiver String instance
    - The companion object
    - The function itself
    - Nothing
  correctIndex: 0
  explanation: Inside an extension function, `this` is the receiver (the String the function is called on); you can also use the bare name of any member.
- id: q4
  question: Can extension functions be overridden in subclasses?
  options:
    - Yes, with override
    - No — they are not members and resolved statically
    - Only with @JvmStatic
    - Only if marked open
  correctIndex: 1
  explanation: Extensions are not part of the class hierarchy, so they cannot be virtual; the call site's declared type decides which extension fires.
- id: q5
  question: What is a nullable receiver extension?
  options:
    - An extension that returns null
    - An extension that requires null
    - An extension declared on `Type?` that handles null itself
    - A deprecated feature
  correctIndex: 2
  explanation: "`fun String?.orEmpty(): String = this ?: \"\"` declares an extension on a nullable type; callers don't need `?.` because the extension handles null."
- id: q6
  question: Can extension properties have backing fields?
  options:
    - Yes, always
    - Only with `const`
    - Only for `var`
    - No — they must compute from `this`
  correctIndex: 3
  explanation: Extension properties cannot have backing fields because extensions don't add state; they only add accessors that compute from the receiver.
- id: q7
  question: Where do you need to import extensions from?
  options:
    - From the package where they're declared
    - They're always available
    - Only from kotlin.io
    - From the JDK
  correctIndex: 0
  explanation: Extensions are scoped to their declaring package; `import com.example.ext.isEmail` is needed before use (the IDE auto-imports).
- id: q8
  question: 'Given `open class A; class B : A()`, `fun A.f() = "A"`, `fun B.f() = "B"`, what does `val a: A = B(); a.f()` print?'
  options:
    - '"B"'
    - '"A"'
    - Compile error
    - Throws at runtime
  correctIndex: 1
  explanation: Static dispatch uses the declared type `A`, so `A.f()` is called even though the runtime instance is `B`.
- id: q9
  question: Which stdlib API is implemented as extension functions?
  options:
    - "`println`"
    - "`if` / `when`"
    - "`Iterable.filter`, `Iterable.map`, etc."
    - "`class` keyword"
  correctIndex: 2
  explanation: Most of the stdlib collection API (`filter`, `map`, `sortedBy`, `groupBy`) are extension functions on `Iterable<T>` and `Collection<T>`.
- id: q10
  question: "What is the receiver in `fun <T> List<T>.secondOrNull(): T?`?"
  options:
    - T
    - Nothing
    - The function itself
    - "`List<T>` — the type the extension is added to"
  correctIndex: 3
  explanation: The receiver is `List<T>`; the extension adds `secondOrNull()` to every `List<T>` and uses `this` to refer to the list inside.
```

