---
slug: java-getting-started-java
id: java-01
track: java
order: 1
title: Getting Started with Java
description: Install the JDK, compile and run your first program, and understand the edit-compile-run loop and JVM bytecode model.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0
whyItMatters: Install the JDK, compile and run your first program, and understand the edit-compile-run loop and JVM bytecode model.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Getting Started with Java

## Getting Started with Java

### Why It Matters

Install the JDK, compile and run your first program, and understand the edit-compile-run loop and JVM bytecode model.

Install the JDK, compile and run your first program, and understand the edit-compile-run loop and JVM bytecode model.

### Prerequisites

- None — this is the entry point for the Java track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing the JDK (OpenJDK 17 LTS or 21 LTS) on Windows/macOS/Linux
- Choosing an IDE: IntelliJ IDEA, Eclipse, VS Code
- The edit-compile-run loop: .java -> .class -> JVM
- The `javac` compiler and `java` launcher
- main method signature and command-line args
- The JDK, JRE, and JVM distinction (JRE removed as separate bundle in JDK 11+)
- Packages, the default package, and the `package` declaration
- Using `jshell` (REPL) introduced in Java 9

### Key Concepts

- Java is compiled to bytecode (.class) which the JVM interprets and JIT-compiles.
- "Write once, run anywhere" — the JVM is the portability layer, not the source.
- Java source files must be named exactly after their public class, with a .java extension.
- The main method signature is `public static void main(String[] args)` — every word matters.
- Java 17 (LTS, Sept 2021) and Java 21 (LTS, Sept 2023) are the supported long-term releases.

```java
// Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```
Caption: Hello World

### Common Pitfalls

- Naming the source file differently from the public class — `javac` will refuse to compile a file `Foo.java` containing `public class Bar`.
- Calling `java Hello.class` (with the extension) — pass the class name only: `java Hello`.
- Confusing JDK (development kit) with JRE (runtime only) — since JDK 11 the JRE is no longer shipped separately; you install a JDK and that includes everything needed to run.
- Forgetting to set JAVA_HOME — many build tools (Maven, Gradle) and IDEs rely on the JAVA_HOME environment variable; on macOS use `/usr/libexec/java_home -v 17`.
- Using a non-LTS release in production (e.g., 18, 19, 22) — stick to LTS releases (17 or 21) unless you have a reason and a migration plan.

### Real-World Applications

- Minecraft Java Edition's entire game loop, world generation, and modding API (Forge, Fabric) are written in Java.
- Apache Kafka, Hadoop, Cassandra, and Spark all run on the JVM and ship Java APIs as their first-class interface.
- LinkedIn's backend has been migrating from monolithic Java services to a polyglot stack, but the core data and member graph services remain Java.
- eBay's trading platform runs on a massively parallel Java tier that handles peak loads of tens of thousands of transactions per second.

### Interview Questions

- 1. What is the JVM and how does it differ from the JDK? — The JVM executes bytecode; the JDK includes the JVM plus compilers (javac), tools (jshell, jstack, jmap), and the standard library.
- 2. Why is Java called "write once, run anywhere"? — Because the compiled bytecode is portable and any OS with a JVM can run the same .class files.
- 3. What is the signature of main and why is each keyword needed? — `public static void main(String[] args)` — public so the JVM can call it, static so no instance is needed, void because it returns nothing to the JVM.
- 4. What is jshell and when would you use it? — An interactive REPL added in Java 9 for prototyping snippets and exploring APIs without writing a full class.
- 5. What is the difference between an LTS and a non-LTS JDK release? — LTS releases (every 2 years since 11) get long-term commercial support; non-LTS releases (every 6 months) are stopgaps for early adopters and are not supported long-term.

### Mini Project

Build a Greeting Generator CLI: A command-line program that takes a name from argv, prints a personalized greeting with a timestamp, and handles missing args gracefully. Suggested approach:
  - Create `Greeting.java` with a public class and the standard main method
  - Use `java.time.LocalDateTime` and `java.time.format.DateTimeFormatter` to stamp the greeting
  - Read `args[0]` after checking `args.length`
  - Print with `System.out.printf` so the timestamp and name align
  - Print a usage message to `System.err` and call `System.exit(1)` on bad input

### Exercises

1. Install OpenJDK 17 (or 21) and confirm with `java -version` and `javac -version` that both report the same version.
2. Write `Hello.java`, compile it, run it, then inspect `Hello.class` with `javap -c Hello` to see the disassembled bytecode.
3. Open `jshell`, declare two ints, and compute their sum interactively; then define a method `int square(int x)` and call it.
4. Modify `Hello.java` to read `args[0]` and print "Hi, <name>"; compile and run with `java Hello Alice`.
5. Add a `package com.example;` declaration at the top, recompile with `javac -d . Hello.java`, and run with `java com.example.Hello Alice`.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created Java?
9. A) James Gosling (*)
10. B) Bjarne Stroustrup
11. C) Anders Hejlsberg
12. D) Guido van Rossum
13. Explanation: James Gosling led the Java project (originally "Oak") at Sun Microsystems in the early 1990s; it shipped publicly in 1995.
14. Q2: What does `javac Hello.java` produce?
15. A) A native executable named Hello
16. B) A bytecode file named Hello.class (*)
17. C) A JAR archive named Hello.jar
18. D) A documentation file named Hello.html
19. Explanation: javac compiles source to JVM bytecode, written to Hello.class in the same directory (or as specified by -d).
20. Q3: Which is the correct main method signature?
21. A) public void main(String args)
22. B) static int main(String[] args)
23. C) public static void main(String[] args) (*)
24. D) public Main(String[] args)
25. Explanation: The JVM looks for `public static void main(String[] args)`; any deviation (wrong access, missing static, wrong return type) means main won't be found.
26. Q4: What does the JVM do?
27. A) Compiles .java files to .class files
28. B) Packages .class files into JARs
29. C) Generates HTML documentation
30. D) Executes .class bytecode and manages memory/GC (*)
31. Explanation: The JVM loads bytecode, verifies it, interprets/JIT-compiles it, and provides runtime services like garbage collection.
32. Q5: Which JDK is an LTS release suitable for production?
33. A) JDK 17 (*)
34. B) JDK 18
35. C) JDK 19
36. D) JDK 22
37. Explanation: JDK 17 (Sept 2021) and JDK 21 (Sept 2023) are LTS; 18, 19, and 22 are non-LTS releases intended for early adopters.
38. Q6: What is jshell?
39. A) A build tool replacing Maven
40. B) An interactive REPL introduced in Java 9 (*)
41. C) A profiler for measuring GC pauses
42. D) A dependency manager for JARs
43. Explanation: jshell is the Java REPL shipped with the JDK since version 9; it evaluates snippets of Java code without requiring a full class.
44. Q7: Why must a public class be in a file with the same base name?
45. A) It is just a convention; javac ignores the filename
46. B) The JVM refuses to load classes whose filename differs
47. C) The language spec requires it so the compiler can locate the class (*)
48. D) Only protected classes have this requirement
49. Explanation: JLS section 7.6 requires a top-level public class to be in a file with a matching name, and javac enforces it.
50. Q8: Since JDK 11, what is true about the JRE?
51. A) It is the only thing you need to install
52. B) It replaces the JVM entirely
53. C) It is bundled with the OS
54. D) It is no longer shipped as a separate bundle; you install a JDK (*)
55. Explanation: Oracle stopped producing separate JRE bundles after JDK 10; modern installs use a JDK which contains everything needed to develop and run.
56. Q9: Which command runs a compiled class named Hello?
57. A) java Hello (*)
58. B) java Hello.class
59. C) run Hello
60. D) javac Hello
61. Explanation: `java Hello` loads the Hello.class file via the classpath and invokes its main method. The .class extension must be omitted.
62. Q10: What is the role of JAVA_HOME?
63. A) It is the user's home directory in the JVM
64. B) It points tools like Maven/Gradle and IDEs to the JDK installation (*)
65. C) It stores compiled .class files
66. D) It is where the JVM logs garbage collection
67. Explanation: JAVA_HOME is an environment variable conventionally set to the JDK root, used by build tools and IDEs to find the compiler and runtime.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Java?
  options:
    - James Gosling
    - Bjarne Stroustrup
    - Anders Hejlsberg
    - Guido van Rossum
  correctIndex: 0
  explanation: James Gosling led the Java project (originally "Oak") at Sun Microsystems in the early 1990s; it shipped publicly in 1995.
- id: q2
  question: What does `javac Hello.java` produce?
  options:
    - A native executable named Hello
    - A bytecode file named Hello.class
    - A JAR archive named Hello.jar
    - A documentation file named Hello.html
  correctIndex: 1
  explanation: javac compiles source to JVM bytecode, written to Hello.class in the same directory (or as specified by -d).
- id: q3
  question: Which is the correct main method signature?
  options:
    - public void main(String args)
    - static int main(String[] args)
    - public static void main(String[] args)
    - public Main(String[] args)
  correctIndex: 2
  explanation: The JVM looks for `public static void main(String[] args)`; any deviation (wrong access, missing static, wrong return type) means main won't be found.
- id: q4
  question: What does the JVM do?
  options:
    - Compiles .java files to .class files
    - Packages .class files into JARs
    - Generates HTML documentation
    - Executes .class bytecode and manages memory/GC
  correctIndex: 3
  explanation: The JVM loads bytecode, verifies it, interprets/JIT-compiles it, and provides runtime services like garbage collection.
- id: q5
  question: Which JDK is an LTS release suitable for production?
  options:
    - JDK 17
    - JDK 18
    - JDK 19
    - JDK 22
  correctIndex: 0
  explanation: JDK 17 (Sept 2021) and JDK 21 (Sept 2023) are LTS; 18, 19, and 22 are non-LTS releases intended for early adopters.
- id: q6
  question: What is jshell?
  options:
    - A build tool replacing Maven
    - An interactive REPL introduced in Java 9
    - A profiler for measuring GC pauses
    - A dependency manager for JARs
  correctIndex: 1
  explanation: jshell is the Java REPL shipped with the JDK since version 9; it evaluates snippets of Java code without requiring a full class.
- id: q7
  question: Why must a public class be in a file with the same base name?
  options:
    - It is just a convention; javac ignores the filename
    - The JVM refuses to load classes whose filename differs
    - The language spec requires it so the compiler can locate the class
    - Only protected classes have this requirement
  correctIndex: 2
  explanation: JLS section 7.6 requires a top-level public class to be in a file with a matching name, and javac enforces it.
- id: q8
  question: Since JDK 11, what is true about the JRE?
  options:
    - It is the only thing you need to install
    - It replaces the JVM entirely
    - It is bundled with the OS
    - It is no longer shipped as a separate bundle; you install a JDK
  correctIndex: 3
  explanation: Oracle stopped producing separate JRE bundles after JDK 10; modern installs use a JDK which contains everything needed to develop and run.
- id: q9
  question: Which command runs a compiled class named Hello?
  options:
    - java Hello
    - java Hello.class
    - run Hello
    - javac Hello
  correctIndex: 0
  explanation: "`java Hello` loads the Hello.class file via the classpath and invokes its main method. The .class extension must be omitted."
- id: q10
  question: What is the role of JAVA_HOME?
  options:
    - It is the user's home directory in the JVM
    - It points tools like Maven/Gradle and IDEs to the JDK installation
    - It stores compiled .class files
    - It is where the JVM logs garbage collection
  correctIndex: 1
  explanation: JAVA_HOME is an environment variable conventionally set to the JDK root, used by build tools and IDEs to find the compiler and runtime.
```

