---
slug: kotlin-getting-started-kotlin
id: kotlin-01
track: kotlin
order: 1
title: Getting Started with Kotlin
description: Install Kotlin, write your first program, and understand the edit-compile-run loop on the JVM, the REPL, and the three compilation targets (JVM, JS, Native).
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM
whyItMatters: Install Kotlin, write your first program, and understand the edit-compile-run loop on the JVM, the REPL, and the three compilation targets (JVM, JS, Native).
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Getting Started with Kotlin

## Getting Started with Kotlin

### Why It Matters

Install Kotlin, write your first program, and understand the edit-compile-run loop on the JVM, the REPL, and the three compilation targets (JVM, JS, Native).

Install Kotlin, write your first program, and understand the edit-compile-run loop on the JVM, the REPL, and the three compilation targets (JVM, JS, Native).

### Prerequisites

- None — this is the entry point for the Kotlin track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing the Kotlin compiler (kotlinc) and IntelliJ IDEA
- Using the Kotlin Playground (play.kotlinlang.org) without install
- The edit-compile-run loop: .kt -> .class -> JVM
- Top-level functions and the main function
- Semicolons optional, package declarations
- The ki shell (Kotlin REPL)
- Kotlin/JVM, Kotlin/JS, Kotlin/Native targets
- Gradle and Maven project scaffolding via Gradle init

### Key Concepts

- Kotlin was created by JetBrains, first released in 2011 and reaching v1.0 in 2016.
- main can be written as a top-level function with no surrounding class — `fun main()` is valid.
- Kotlin compiles to JVM bytecode (default), JavaScript, or a native binary via LLVM.
- Semicolons are optional; the compiler infers statement boundaries from newlines.
- The Kotlin standard library is small but rich; many "language features" (like `listOf`) are just library functions.

```kotlin
// Hello.kt
fun main() {
    println("Hello, World!")
}
```
Caption: Hello World

### Common Pitfalls

- Confusing Kotlin with Kotlin Script (.kts) — `.kts` files are scripts where top-level code runs directly; `.kt` files require a `main` function.
- Trying to run a .kt file with `kotlin Hello.kt` directly — you must compile first with `kotlinc` (or use `kotlin -script` for .kts), otherwise you get a "no main manifest" error.
- Forgetting `-include-runtime` when building a JAR — without it, the JAR is just classes with no Kotlin runtime bundled and fails with `NoClassDefFoundError`.
- Mixing Kotlin and Java versions of the stdlib on the classpath — always let the build tool (Gradle/Maven) pull the stdlib transitively; never hand-place `kotlin-stdlib.jar`.
- Using a Kotlin compiler version older than your IDE's plugin — IntelliJ's bundled Kotlin plugin lags; pin the compiler version in `build.gradle.kts` to avoid surprises.

### Real-World Applications

- Google's Android OS ships Kotlin as the preferred language; apps like Google Drive, Google Photos, and YouTube are heavily Kotlin.
- JetBrains' own IDEs (IntelliJ IDEA, WebStorm, PyCharm) have Kotlin in their build scripts and many internal modules.
- Basecamp's Android app was one of the first major production Kotlin codebases (since 2016).
- Trello rewrote its Android data layer in Kotlin to reduce null-pointer crashes by ~70%.

### Interview Questions

- 1. Who created Kotlin and when? — JetBrains started it in 2010, v1.0 shipped February 2016, and Google endorsed it for Android in 2017.
- 2. What three platforms does Kotlin compile to? — JVM bytecode (default), JavaScript (Kotlin/JS), and native binaries via LLVM (Kotlin/Native, with Kotlin Multiplatform shared code).
- 3. Why does Kotlin not require a class around main? — It allows top-level functions; the compiler generates a synthetic class (`HelloKt`) to host them on the JVM.
- 4. What is the difference between a .kt and a .kts file? — `.kt` is a regular source file requiring a `main` function; `.kts` is a Kotlin script where top-level statements execute in order.
- 5. What is the Kotlin Playground and when would you use it? — A browser-hosted REPL at play.kotlinlang.org useful for sharing snippets, prototyping, and teaching without local install.

### Mini Project

Build a Greeting Generator CLI: A command-line program that takes a name from argv, prints a personalized greeting with a timestamp, and handles missing args gracefully. Suggested approach:
  - Create `Greeting.kt` with a top-level `main(args: Array<String>)` function
  - Use `java.time.LocalDateTime` and `java.time.format.DateTimeFormatter` to stamp the greeting
  - Read `args.firstOrNull()` and print a usage hint to `System.err` on null
  - Print with a string template `"Hi, $name — it's $now"`
  - Compile with `kotlinc Greeting.kt -include-runtime -d greeting.jar` and run with `java -jar greeting.jar Alice`

### Exercises

1. Install the Kotlin compiler (via SDKMAN, Homebrew, or the standalone zip) and confirm with `kotlinc -version` that it reports 1.9 or higher.
2. Open the Kotlin Playground in a browser and write a `main()` that prints your name, then share the URL.
3. Write `Hello.kt`, compile it with `kotlinc -include-runtime -d hello.jar Hello.kt`, and run the JAR; inspect the generated `HelloKt.class` with `javap -c HelloKt`.
4. Open the Kotlin REPL (`kotlinc`), declare two Ints, compute their sum, then define a `fun square(x: Int) = x * x` and call it.
5. Modify `Hello.kt` to accept command-line args and print "Hi, <name>"; compile and run with `java -jar hello.jar Bob`.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created Kotlin?
9. A) JetBrains (*)
10. B) Google
11. C) Oracle
12. D) Apache Software Foundation
13. Explanation: JetBrains started the Kotlin project in 2010; v1.0 shipped in February 2016 and Google endorsed it for Android in 2017.
14. Q2: Which year did Kotlin 1.0 ship?
15. A) 2011
16. B) 2016 (*)
17. C) 2014
18. D) 2019
19. Explanation: Kotlin 1.0 was released on February 15, 2016; 2019 was the year Google named it the preferred Android language.
20. Q3: Which is a valid top-level main function in Kotlin?
21. A) public static void main(String[] args)
22. B) def main():
23. C) fun main() (*)
24. D) func main() -> Void
25. Explanation: `fun main()` is the simplest valid entry point; `fun main(args: Array<String>)` is also accepted.
26. Q4: What does `kotlinc Hello.kt -include-runtime -d hello.jar` produce?
27. A) A native executable
28. B) A .class file only
29. C) A JavaScript bundle
30. D) A JAR with the Kotlin runtime bundled (*)
31. Explanation: `-include-runtime` bundles the Kotlin stdlib so the JAR is self-contained and runnable with `java -jar`.
32. Q5: Which platforms does Kotlin officially compile to?
33. A) JVM, JavaScript, and Native (LLVM) (*)
34. B) JVM only
35. C) JVM and JavaScript
36. D) JVM and WebAssembly only
37. Explanation: Kotlin has three compilation backends: JVM (default), JS, and Native via LLVM; Kotlin Multiplatform shares code between them.
38. Q6: What is the file extension for a Kotlin source file?
39. A) .k
40. B) .kt (*)
41. C) .kotlin
42. D) .ks
43. Explanation: `.kt` is for source files; `.kts` is for Kotlin scripts where top-level statements execute in order.
44. Q7: Are semicolons required at the end of statements in Kotlin?
45. A) Yes, always
46. B) Only in classes
47. C) No, they are optional and usually omitted (*)
48. D) Only when multiple statements share a line
49. Explanation: Semicolons are optional in Kotlin; you only need them when two statements appear on the same line.
50. Q8: What name does the compiler give the synthetic class that hosts top-level functions in Hello.kt?
51. A) Hello
52. B) Main
53. C) HelloClass
54. D) HelloKt (*)
55. Explanation: Top-level functions in `Hello.kt` are placed into a class named `HelloKt` (filename + `Kt`) by the JVM compiler.
56. Q9: What is the ki shell?
57. A) A Kotlin REPL shipped with the compiler (*)
58. B) A Kotlin build tool
59. C) A package manager
60. D) An IDE plugin
61. Explanation: The Kotlin REPL (sometimes called `kotlinc` interactive mode or `ki`) evaluates snippets without writing a full project.
62. Q10: Which tool is the recommended build system for new Kotlin projects?
63. A) Ant
64. B) Gradle (often via Kotlin DSL) (*)
65. C) Make
66. D) Bazel only
67. Explanation: Gradle with the Kotlin DSL (`build.gradle.kts`) is the standard; Maven works but is less idiomatic for Kotlin.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Kotlin?
  options:
    - JetBrains
    - Google
    - Oracle
    - Apache Software Foundation
  correctIndex: 0
  explanation: JetBrains started the Kotlin project in 2010; v1.0 shipped in February 2016 and Google endorsed it for Android in 2017.
- id: q2
  question: Which year did Kotlin 1.0 ship?
  options:
    - "2011"
    - "2016"
    - "2014"
    - "2019"
  correctIndex: 1
  explanation: Kotlin 1.0 was released on February 15, 2016; 2019 was the year Google named it the preferred Android language.
- id: q3
  question: Which is a valid top-level main function in Kotlin?
  options:
    - public static void main(String[] args)
    - "def main():"
    - fun main()
    - func main() -> Void
  correctIndex: 2
  explanation: "`fun main()` is the simplest valid entry point; `fun main(args: Array<String>)` is also accepted."
- id: q4
  question: What does `kotlinc Hello.kt -include-runtime -d hello.jar` produce?
  options:
    - A native executable
    - A .class file only
    - A JavaScript bundle
    - A JAR with the Kotlin runtime bundled
  correctIndex: 3
  explanation: "`-include-runtime` bundles the Kotlin stdlib so the JAR is self-contained and runnable with `java -jar`."
- id: q5
  question: Which platforms does Kotlin officially compile to?
  options:
    - JVM, JavaScript, and Native (LLVM)
    - JVM only
    - JVM and JavaScript
    - JVM and WebAssembly only
  correctIndex: 0
  explanation: "Kotlin has three compilation backends: JVM (default), JS, and Native via LLVM; Kotlin Multiplatform shares code between them."
- id: q6
  question: What is the file extension for a Kotlin source file?
  options:
    - .k
    - .kt
    - .kotlin
    - .ks
  correctIndex: 1
  explanation: "`.kt` is for source files; `.kts` is for Kotlin scripts where top-level statements execute in order."
- id: q7
  question: Are semicolons required at the end of statements in Kotlin?
  options:
    - Yes, always
    - Only in classes
    - No, they are optional and usually omitted
    - Only when multiple statements share a line
  correctIndex: 2
  explanation: Semicolons are optional in Kotlin; you only need them when two statements appear on the same line.
- id: q8
  question: What name does the compiler give the synthetic class that hosts top-level functions in Hello.kt?
  options:
    - Hello
    - Main
    - HelloClass
    - HelloKt
  correctIndex: 3
  explanation: Top-level functions in `Hello.kt` are placed into a class named `HelloKt` (filename + `Kt`) by the JVM compiler.
- id: q9
  question: What is the ki shell?
  options:
    - A Kotlin REPL shipped with the compiler
    - A Kotlin build tool
    - A package manager
    - An IDE plugin
  correctIndex: 0
  explanation: The Kotlin REPL (sometimes called `kotlinc` interactive mode or `ki`) evaluates snippets without writing a full project.
- id: q10
  question: Which tool is the recommended build system for new Kotlin projects?
  options:
    - Ant
    - Gradle (often via Kotlin DSL)
    - Make
    - Bazel only
  correctIndex: 1
  explanation: Gradle with the Kotlin DSL (`build.gradle.kts`) is the standard; Maven works but is less idiomatic for Kotlin.
```

