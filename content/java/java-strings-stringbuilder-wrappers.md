---
slug: java-strings-stringbuilder-wrappers
id: java-08
track: java
order: 8
title: Strings, StringBuilder, and Wrappers
description: Understand why String is immutable, when to use StringBuilder vs StringBuffer, how String interning works, and how wrapper classes bridge primitives and generics.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=8400s
whyItMatters: Understand why String is immutable, when to use StringBuilder vs StringBuffer, how String interning works, and how wrapper classes bridge primitives and generics.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Strings, StringBuilder, and Wrappers

## Strings, StringBuilder, and Wrappers

### Why It Matters

Understand why String is immutable, when to use StringBuilder vs StringBuffer, how String interning works, and how wrapper classes bridge primitives and generics.

Understand why String is immutable, when to use StringBuilder vs StringBuffer, how String interning works, and how wrapper classes bridge primitives and generics.

### Prerequisites

- Stage 7: Exception Handling and try-with-resources.
- Solid grasp of OOP, exceptions, and the type system.

### Topics

- String immutability and why it matters (thread-safety, caching hashCode)
- String literal pool and `intern()`
- StringBuilder vs StringBuffer vs String concatenation
- `+` operator and the compiler's StringBuilder optimization (Java 9+ uses invokedynamic)
- String methods: indexOf, substring, split, trim, strip, repeat, isBlank
- Wrapper classes and the auto(un)boxing pipeline
- Text blocks (Java 15+) — multi-line string literals
- Unicode and UTF-16 surrogate pairs in Java strings

### Key Concepts

- String is final and immutable; methods like `substring` and `trim` return new String instances.
- String literals are interned by the JVM into the string pool; `"a" + "b"` of compile-time constants is folded into `"ab"` at compile time.
- StringBuilder is unsynchronized and preferred for in-loop concatenation; StringBuffer is synchronized (legacy) and rarely needed.
- Java 9+ `+` on String compiles to `invokedynamic` calling `StringConcatFactory`, allowing JIT optimization rather than a fixed StringBuilder.
- Strings are UTF-16: characters outside the BMP (e.g., emoji) occupy two `char` values (a surrogate pair), so `length()` may exceed the perceived character count.

```java
String s = "hello";
s.concat(" world");           // returns a NEW string; s is unchanged
System.out.println(s);        // hello
s = s.concat(" world");       // reassign to capture the new value
System.out.println(s);        // hello world
```
Caption: Immutability

### Common Pitfalls

- Using `+` to build strings in a tight loop — O(n²) due to repeated copies; use StringBuilder.
- Assuming `==` works for Strings — it works for interned literals but not for `new String(...)` or computed strings; always use `.equals()`.
- Confusing `trim()` with `strip()` — `trim` only removes ASCII whitespace (<= U+0020); `strip` (Java 11+) is Unicode-aware and is the modern default.
- Forgetting surrogate pairs in emoji handling — `"😀".length()` is 2; use `codePointCount` for character count.
- Storing sensitive data in String — Strings are interned and may persist in memory; for passwords use `char[]` and zero it after use.

### Real-World Applications

- Log4j and SLF4J message formatters use StringBuilder internally to assemble log lines from message templates and arguments.
- Jackson's JSON parser builds Strings via a recycling char buffer and StringReader rather than `+` to minimize per-token allocation.
- Spring's `StringUtils` and `CollectionUtils` are widely used in enterprise apps for null-safe string manipulation and parsing.
- IntelliJ's code formatter manipulates char arrays and StringBuilder rather than String concatenation, since formatting touches thousands of tokens per file.

### Interview Questions

- 1. Why is String immutable in Java? — For thread-safety, hashCode caching, classloader/security (safe keys), and the string constant pool.
- 2. What is the difference between StringBuilder and StringBuffer? — Both are mutable; StringBuffer is synchronized (thread-safe but slow), StringBuilder is not.
- 3. What does `intern()` do? — Returns the canonical pooled representation of a String, enabling `==` comparisons; overuse wastes permgen/metaspace.
- 4. How does Java 9+ compile `+` on Strings? — Via `invokedynamic` calling `StringConcatFactory`, allowing JIT-tuned concatenation strategies.
- 5. What is the issue with `length()` on emoji strings? — Strings are UTF-16; supplementary characters (e.g., emoji) occupy a surrogate pair (two chars); use `codePointCount`.

### Mini Project

Build a CSV Serializer: Convert a list of records to CSV with proper quoting (double-quote fields containing commas, escape internal quotes by doubling). Use StringBuilder, not `+`. Suggested approach:
  - Define a record `CsvRow(List<String> fields)`
  - Write `String toCsv(List<CsvRow> rows)` using a StringBuilder
  - For each field, check for `,`, `"`, `\n`, or `\r`; if present wrap in `"..."` and double internal quotes
  - Add a configurable separator and line ending (`\n` vs `\r\n`)
  - Benchmark against naive `+` concatenation on 10,000 rows

### Exercises

1. Prove String immutability: call `s.concat("x")` without reassigning and print `s`; then reassign and confirm the new value.
2. Demonstrate `intern()`: create two strings via `new String("hello")`, compare with `==` (false), call `intern()` on both, compare again (true).
3. Compare `trim()` and `strip()` on a string containing a Unicode non-breaking space (U+00A0); explain the difference.
4. Build a 10,000-iteration loop with `+` and one with StringBuilder; time both with `System.nanoTime()` and compute the ratio.
5. Write a text block for an HTML template; experiment with trailing `\` for line continuation and `\s` for preserved whitespace.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: String in Java is?
9. A) Mutable
10. B) Mutable and final
11. C) Immutable but extendable
12. D) Immutable and final (*)
13. Explanation: String is declared final and all its "mutator" methods (substring, concat, replace) return new String instances; the original is never changed.
14. Q2: `new String("x") == new String("x")` evaluates to?
15. A) false (*)
16. B) true
17. C) Compile error
18. D) NullPointerException
19. Explanation: Each `new String(...)` allocates a fresh heap object; `==` compares references and returns false. Use `.equals()` or `intern()`.
20. Q3: For building a string inside a loop, prefer?
21. A) `+=` on a String
22. B) StringBuilder (*)
23. C) StringBuffer
24. D) Formatter
25. Explanation: `+=` on String creates a new String each iteration (O(n²) total). StringBuilder mutates an internal buffer, amortizing to O(n).
26. Q4: What is the main difference between StringBuilder and StringBuffer?
27. A) StringBuffer is immutable
28. B) StringBuilder is deprecated
29. C) StringBuffer is synchronized (thread-safe), StringBuilder is not (*)
30. D) There is no difference
31. Explanation: StringBuffer (Java 1.0) is synchronized; StringBuilder (Java 5) is not. Modern code uses StringBuilder for non-shared buffers and pays nothing for synchronization.
32. Q5: Java 9+ compiles String `+` using?
33. A) A fixed StringBuilder chain
34. B) Manual byte[]
35. C) A static String.join
36. D) invokedynamic with StringConcatFactory (*)
37. Explanation: JEP 280 changed `+` to use `invokedynamic` calling `StringConcatFactory.makeConcatWithConstants`, allowing JIT-tuned strategies per call site.
38. Q6: `trim()` removes characters up to?
39. A) ASCII whitespace only (code points <= U+0020) (*)
40. B) Unicode whitespace (all of it)
41. C) Only spaces (no tabs/newlines)
42. D) Only \r and \n
43. Explanation: trim removes ASCII control/space characters <= U+0020. Use `strip()` (Java 11+) for Unicode-aware whitespace removal.
44. Q7: `"😀".length()` returns?
45. A) 1
46. B) 2 (*)
47. C) 4
48. D) 8
49. Explanation: Java strings are UTF-16; supplementary characters (emoji) occupy a surrogate pair of two char units. Use `codePointCount(0, length())` for the character count.
50. Q8: Text blocks (triple-quote strings) were finalized in?
51. A) Java 11
52. B) Java 13
53. C) Java 15 (*)
54. D) Java 17
55. Explanation: Text blocks (JEP 378) were finalized in Java 15 after previews in 13 and 14.
56. Q9: What does `intern()` do?
57. A) Returns a sorted copy
58. B) Trims whitespace
59. C) Escapes special characters
60. D) Returns the canonical pooled representation of the string (*)
61. Explanation: `intern()` returns the string from the JVM's string pool, allowing `==` comparisons; overuse can pressure metaspace.
62. Q10: For storing a password, prefer?
63. A) char[] so you can zero it after use (*)
64. B) String
65. C) byte[]
66. D) StringBuilder
67. Explanation: Strings are interned and may persist in memory indefinitely; a char[] lets you wipe the value after use, reducing the window for heap-dump exposure.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: String in Java is?
  options:
    - Mutable
    - Mutable and final
    - Immutable but extendable
    - Immutable and final
  correctIndex: 3
  explanation: String is declared final and all its "mutator" methods (substring, concat, replace) return new String instances; the original is never changed.
- id: q2
  question: '`new String("x") == new String("x")` evaluates to?'
  options:
    - "false"
    - "true"
    - Compile error
    - NullPointerException
  correctIndex: 0
  explanation: Each `new String(...)` allocates a fresh heap object; `==` compares references and returns false. Use `.equals()` or `intern()`.
- id: q3
  question: For building a string inside a loop, prefer?
  options:
    - "`+=` on a String"
    - StringBuilder
    - StringBuffer
    - Formatter
  correctIndex: 1
  explanation: "`+=` on String creates a new String each iteration (O(n²) total). StringBuilder mutates an internal buffer, amortizing to O(n)."
- id: q4
  question: What is the main difference between StringBuilder and StringBuffer?
  options:
    - StringBuffer is immutable
    - StringBuilder is deprecated
    - StringBuffer is synchronized (thread-safe), StringBuilder is not
    - There is no difference
  correctIndex: 2
  explanation: StringBuffer (Java 1.0) is synchronized; StringBuilder (Java 5) is not. Modern code uses StringBuilder for non-shared buffers and pays nothing for synchronization.
- id: q5
  question: Java 9+ compiles String `+` using?
  options:
    - A fixed StringBuilder chain
    - Manual byte[]
    - A static String.join
    - invokedynamic with StringConcatFactory
  correctIndex: 3
  explanation: JEP 280 changed `+` to use `invokedynamic` calling `StringConcatFactory.makeConcatWithConstants`, allowing JIT-tuned strategies per call site.
- id: q6
  question: "`trim()` removes characters up to?"
  options:
    - ASCII whitespace only (code points <= U+0020)
    - Unicode whitespace (all of it)
    - Only spaces (no tabs/newlines)
    - Only \r and \n
  correctIndex: 0
  explanation: trim removes ASCII control/space characters <= U+0020. Use `strip()` (Java 11+) for Unicode-aware whitespace removal.
- id: q7
  question: '`"😀".length()` returns?'
  options:
    - "1"
    - "2"
    - "4"
    - "8"
  correctIndex: 1
  explanation: Java strings are UTF-16; supplementary characters (emoji) occupy a surrogate pair of two char units. Use `codePointCount(0, length())` for the character count.
- id: q8
  question: Text blocks (triple-quote strings) were finalized in?
  options:
    - Java 11
    - Java 13
    - Java 15
    - Java 17
  correctIndex: 2
  explanation: Text blocks (JEP 378) were finalized in Java 15 after previews in 13 and 14.
- id: q9
  question: What does `intern()` do?
  options:
    - Returns a sorted copy
    - Trims whitespace
    - Escapes special characters
    - Returns the canonical pooled representation of the string
  correctIndex: 3
  explanation: "`intern()` returns the string from the JVM's string pool, allowing `==` comparisons; overuse can pressure metaspace."
- id: q10
  question: For storing a password, prefer?
  options:
    - char[] so you can zero it after use
    - String
    - byte[]
    - StringBuilder
  correctIndex: 0
  explanation: Strings are interned and may persist in memory indefinitely; a char[] lets you wipe the value after use, reducing the window for heap-dump exposure.
```

