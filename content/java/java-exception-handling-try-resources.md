---
slug: java-exception-handling-try-resources
id: java-07
track: java
order: 7
title: Exception Handling and try-with-resources
description: Throw, catch, and declare exceptions; understand checked vs unchecked, custom exceptions, multi-catch, finally semantics, and the try-with-resources idiom for safe cleanup.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=7200s
whyItMatters: Throw, catch, and declare exceptions; understand checked vs unchecked, custom exceptions, multi-catch, finally semantics, and the try-with-resources idiom for safe cleanup.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Exception Handling and try-with-resources

## Exception Handling and try-with-resources

### Why It Matters

Throw, catch, and declare exceptions; understand checked vs unchecked, custom exceptions, multi-catch, finally semantics, and the try-with-resources idiom for safe cleanup.

Throw, catch, and declare exceptions; understand checked vs unchecked, custom exceptions, multi-catch, finally semantics, and the try-with-resources idiom for safe cleanup.

### Prerequisites

- Stage 6: OOP — Inheritance, Polymorphism, Interfaces.
- Familiarity with subclassing and override semantics.

### Topics

- The Throwable hierarchy: Error, Exception, RuntimeException
- Checked vs unchecked exceptions
- throw, throws, and the method signature contract
- try / catch / finally semantics
- Multi-catch (`catch (IOException | SQLException e)`)
- try-with-resources and the AutoCloseable interface
- Custom exceptions and exception chaining
- The `finally` block's interaction with return and exceptions

### Key Concepts

- Checked exceptions are verified at compile time and force callers to handle or declare; unchecked (RuntimeException subclasses) do not.
- try-with-resources (Java 7+) calls `close()` automatically on AutoCloseables in reverse order of declaration, suppressing exceptions via addSuppressed.
- `finally` always runs (even on return, break, continue, or uncaught exception) — except on System.exit or JVM crash.
- Returning from `finally` swallows the pending exception; never return from finally.
- Catching multiple exception types in one catch (multi-catch) requires unrelated types (no inheritance between them).

```java
import java.io.IOException;

// Checked — caller must handle or declare
void readFile(String path) throws IOException { /* ... */ }

// Unchecked — caller is not forced
void divide(int a, int b) {
    if (b == 0) throw new IllegalArgumentException("b must not be 0");
    // ArithmeticException is also unchecked (RuntimeException)
}
```
Caption: Checked vs unchecked

### Common Pitfalls

- Catching `Exception` or `Throwable` too broadly — hides bugs and breaks the exception pipeline; catch the most specific types you can handle.
- Returning from `finally` — silently swallows the pending exception and overrides the try's return value; never return from finally.
- Forgetting that close() can throw — try-with-resources handles this by suppressing the close exception onto the primary one; manual close() in finally does not.
- Abusing checked exceptions for control flow — wrapping every method in `throws Exception` defeats the type system and annoys callers; prefer unchecked for recoverable runtime conditions.
- Empty catch blocks (`catch (Exception e) {}`) — the worst antipattern; at minimum log, and ideally let the exception propagate.

### Real-World Applications

- Spring's `DataAccessException` hierarchy translates JDBC's checked `SQLException` into unchecked exceptions so business code can choose to ignore persistence errors.
- Apache HttpClient uses try-with-resources extensively to guarantee that HTTP connections return to the pool even on parsing errors.
- Netty's `ChannelFuture` model propagates exceptions through pipeline listeners rather than throwing, sidestepping the cost of stack traces on the hot path.
- Hadoop's `FileSystem` API marks `IOException` checked across all FS operations, forcing MapReduce jobs to handle I/O failure explicitly.

### Interview Questions

- 1. What is the difference between checked and unchecked exceptions? — Checked (Exception subclasses not extending RuntimeException) are enforced at compile time; unchecked (RuntimeException) are not.
- 2. What is try-with-resources and what interface does it require? — A try form that auto-closes resources; the resource type must implement AutoCloseable (or Closeable).
- 3. What happens if you return from a `finally` block? — It swallows the pending exception and overrides the try's return value; never do this.
- 4. What is exception chaining and why use it? — Wrapping a low-level cause in a higher-level exception via `new X("msg", cause)` preserves the stack trace for debugging.
- 5. What is multi-catch and what is its constraint? — `catch (A | B e)` lets one handler cover multiple types, but A and B must not be related by inheritance.

### Mini Project

Build a Config Loader: Read a properties file with try-with-resources, parse keys, and report a typed `ConfigException` (chained from IOException) on failure. Include a finally that logs how long the load took. Suggested approach:
  - Use `java.util.Properties` with `try (var in = Files.newInputStream(path))`
  - Define `ConfigException extends RuntimeException` with a (msg, cause) constructor
  - Catch `IOException` and rethrow as `ConfigException` chained with the cause
  - Use a `finally` block to log elapsed time via `System.nanoTime()`
  - Validate required keys and throw a `MissingKeyException` (unchecked)

### Exercises

1. Write a method that throws a checked `IOException`; call it from `main` without handling to see the compiler error, then fix by adding `throws` or a try/catch.
2. Use multi-catch to handle `IOException` and `SQLException` with the same handler; verify the variable is effectively final.
3. Implement an AutoCloseable resource (e.g., a fake `DbConnection`) and use it in try-with-resources; print a log line in `close()` to confirm the order.
4. Deliberately throw from `close()` inside try-with-resources and inspect `getSuppressed()` to see the secondary exception.
5. Compare two versions of cleanup code — manual try/finally and try-with-resources — and reason about which is shorter and safer.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is a checked exception?
9. A) NullPointerException
10. B) IllegalArgumentException
11. C) IOException (*)
12. D) ArithmeticException
13. Explanation: IOException is a checked exception (subclass of Exception but not RuntimeException). The others are all RuntimeException subclasses.
14. Q2: try-with-resources requires the resource to implement?
15. A) Serializable
16. B) Iterable
17. C) Comparable
18. D) AutoCloseable (Closeable also works) (*)
19. Explanation: Any AutoCloseable (or the Closeable subtype) can be a resource; close() is called automatically in reverse declaration order.
20. Q3: In try-with-resources, if both the try body and close() throw, what happens to the close exception?
21. A) It is added as suppressed on the try exception (*)
22. B) It replaces the try exception
23. C) It is silently dropped
24. D) The JVM prints both stack traces
25. Explanation: The primary exception propagates; the close() exception is attached via `addSuppressed` and accessible via `getSuppressed()`.
26. Q4: Returning from a `finally` block:
27. A) Is recommended for cleanup
28. B) Silently swallows any pending exception and overrides the try return (*)
29. C) Throws IllegalReturnException
30. D) Is a compile error
31. Explanation: Returning from finally is a famous antipattern: it discards the try's exception and replaces its return value, hiding bugs.
32. Q5: Multi-catch (`catch (A | B e)`) requires that?
33. A) A extends B
34. B) B extends A
35. C) A and B are unrelated by inheritance (*)
36. D) Both are checked
37. Explanation: Multi-catch alternatives must not be related by inheritance — otherwise the union is redundant and the compiler rejects it.
38. Q6: Which class is the root of the exception hierarchy?
39. A) Exception
40. B) Error
41. C) RuntimeException
42. D) Throwable (*)
43. Explanation: Throwable is the root; Error (JVM failures) and Exception (application-level) are its direct subclasses.
44. Q7: A RuntimeException is?
45. A) Unchecked — callers are not forced to handle it (*)
46. B) Always caught at compile time
47. C) Always fatal
48. D) A subtype of Error
49. Explanation: RuntimeException and its subclasses are unchecked; the compiler does not require callers to handle or declare them.
50. Q8: The `finally` block runs when?
51. A) Only when an exception is thrown
52. B) Always (unless JVM exits or crashes) (*)
53. C) Only when no exception is thrown
54. D) Only after a return
55. Explanation: finally runs whether the try completes normally, throws, or returns — the only escapes are System.exit(), JVM crash, or an infinite loop in try.
56. Q9: Catching `Throwable` is generally a bad idea because?
57. A) It is forbidden by the compiler
58. B) It only catches checked exceptions
59. C) It catches Errors (OOM, StackOverflow) that the app usually cannot recover from (*)
60. D) finally will not run afterward
61. Explanation: Throwable includes Error subclasses like OutOfMemoryError and StackOverflowError, which usually can't be recovered from; catching them can mask fatal JVM problems.
62. Q10: The `throws` clause is used to?
63. A) Throw an exception
64. B) Suppress an exception
65. C) Convert checked to unchecked
66. D) Declare checked exceptions a method may propagate (*)
67. Explanation: `throws` declares the checked exceptions a method may propagate, forcing callers to handle or redeclare them. `throw` is the statement that actually raises an exception.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is a checked exception?
  options:
    - NullPointerException
    - IllegalArgumentException
    - IOException
    - ArithmeticException
  correctIndex: 2
  explanation: IOException is a checked exception (subclass of Exception but not RuntimeException). The others are all RuntimeException subclasses.
- id: q2
  question: try-with-resources requires the resource to implement?
  options:
    - Serializable
    - Iterable
    - Comparable
    - AutoCloseable (Closeable also works)
  correctIndex: 3
  explanation: Any AutoCloseable (or the Closeable subtype) can be a resource; close() is called automatically in reverse declaration order.
- id: q3
  question: In try-with-resources, if both the try body and close() throw, what happens to the close exception?
  options:
    - It is added as suppressed on the try exception
    - It replaces the try exception
    - It is silently dropped
    - The JVM prints both stack traces
  correctIndex: 0
  explanation: The primary exception propagates; the close() exception is attached via `addSuppressed` and accessible via `getSuppressed()`.
- id: q4
  question: "Returning from a `finally` block:"
  options:
    - Is recommended for cleanup
    - Silently swallows any pending exception and overrides the try return
    - Throws IllegalReturnException
    - Is a compile error
  correctIndex: 1
  explanation: "Returning from finally is a famous antipattern: it discards the try's exception and replaces its return value, hiding bugs."
- id: q5
  question: Multi-catch (`catch (A | B e)`) requires that?
  options:
    - A extends B
    - B extends A
    - A and B are unrelated by inheritance
    - Both are checked
  correctIndex: 2
  explanation: Multi-catch alternatives must not be related by inheritance — otherwise the union is redundant and the compiler rejects it.
- id: q6
  question: Which class is the root of the exception hierarchy?
  options:
    - Exception
    - Error
    - RuntimeException
    - Throwable
  correctIndex: 3
  explanation: Throwable is the root; Error (JVM failures) and Exception (application-level) are its direct subclasses.
- id: q7
  question: A RuntimeException is?
  options:
    - Unchecked — callers are not forced to handle it
    - Always caught at compile time
    - Always fatal
    - A subtype of Error
  correctIndex: 0
  explanation: RuntimeException and its subclasses are unchecked; the compiler does not require callers to handle or declare them.
- id: q8
  question: The `finally` block runs when?
  options:
    - Only when an exception is thrown
    - Always (unless JVM exits or crashes)
    - Only when no exception is thrown
    - Only after a return
  correctIndex: 1
  explanation: finally runs whether the try completes normally, throws, or returns — the only escapes are System.exit(), JVM crash, or an infinite loop in try.
- id: q9
  question: Catching `Throwable` is generally a bad idea because?
  options:
    - It is forbidden by the compiler
    - It only catches checked exceptions
    - It catches Errors (OOM, StackOverflow) that the app usually cannot recover from
    - finally will not run afterward
  correctIndex: 2
  explanation: Throwable includes Error subclasses like OutOfMemoryError and StackOverflowError, which usually can't be recovered from; catching them can mask fatal JVM problems.
- id: q10
  question: The `throws` clause is used to?
  options:
    - Throw an exception
    - Suppress an exception
    - Convert checked to unchecked
    - Declare checked exceptions a method may propagate
  correctIndex: 3
  explanation: "`throws` declares the checked exceptions a method may propagate, forcing callers to handle or redeclare them. `throw` is the statement that actually raises an exception."
```

