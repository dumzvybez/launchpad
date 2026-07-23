---
slug: java-variables-types-operators
id: java-02
track: java
order: 2
title: Variables, Types, and Operators
description: Declare primitive and reference variables, learn Java's two-type system, master arithmetic and logical operators, and meet autoboxing and the Integer cache.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=1200s
whyItMatters: Declare primitive and reference variables, learn Java's two-type system, master arithmetic and logical operators, and meet autoboxing and the Integer cache.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Declare primitive and reference variables, learn Java's two-type system, master arithmetic and logical operators, and meet autoboxing and the Integer cache.

Declare primitive and reference variables, learn Java's two-type system, master arithmetic and logical operators, and meet autoboxing and the Integer cache.

### Prerequisites

- Stage 1: Getting Started with Java.
- Comfort compiling and running a small Java program.

### Topics

- The 8 primitive types (byte, short, int, long, float, double, char, boolean)
- Reference types vs primitive types
- Variable declaration, initialization, and final
- Type inference with `var` (Java 10+)
- Arithmetic, relational, logical, bitwise, and assignment operators
- String concatenation with `+` and the StringBuilder optimization
- Wrapper classes (Integer, Double, Boolean, etc.)
- Autoboxing and unboxing and the Integer cache (-128 to 127)

### Key Concepts

- Java has a strict split: primitives (value types on the stack) and references (pointers to heap objects).
- Integer, Byte, Short, Long cache values in a small range by default — `Integer.valueOf(127) == Integer.valueOf(127)` is true but 128 is not.
- `==` compares primitives by value and references by identity; almost always use `.equals()` for objects.
- `var` infers the static type at compile time — Java remains statically typed; `var` is not dynamic.
- Strings are immutable; `+` may compile to a StringBuilder under the hood but not always — be explicit in loops.

```java
int a = 10;                 // primitive
Integer b = 20;             // reference (autoboxed)
String s = "hello";         // reference

int[] nums = {1, 2, 3};     // reference to array object
int c = nums[0];            // value copy

System.out.println(a + b);  // 30 — b is unboxed
```
Caption: Primitives and references

### Common Pitfalls

- Using `==` to compare Strings or Integers — always use `.equals()` (or `Objects.equals()` to be null-safe).
- Autoboxing in a hot loop — `Integer sum = 0; for (...) sum += i;` creates a new Integer per iteration; use `int` for accumulators.
- Expecting the Integer cache to extend beyond -128 to 127 — it can be tuned with `-XX:AutoBoxCacheMax` but code that relies on it is fragile; use `equals`.
- Treating `var` as JavaScript `let` — `var` infers a fixed compile-time type; you cannot reassign to a different type later.
- Forgetting that integer division truncates — `5 / 2` is `2`, not `2.5`; cast one operand to double: `5 / 2.0` is `2.5`.

### Real-World Applications

- Apache Hadoop's serialization (Writable) leans heavily on primitive types and explicit boxing control to minimize per-record allocation across petabyte-scale jobs.
- IntelliJ IDEA's editor data model uses primitive longs for offsets and ranges to avoid autoboxing churn during thousands of file scans per minute.
- Android's `SparseArray` API exists precisely to avoid the autoboxing cost of `HashMap<Integer, V>` on memory-constrained devices.
- High-frequency trading platforms written in Java (e.g., LMAX Disruptor) deliberately use primitives and preallocated arrays to avoid GC pressure and autoboxing.

### Interview Questions

- 1. What is the Integer cache and what range does it cover? — Java caches boxed Integer instances for -128 to 127 by default; `==` works in that range but not outside.
- 2. Difference between primitive int and Integer? — int is a 32-bit value type with no null; Integer is a heap object that can be null and participates in generics.
- 3. Why does Java have both primitives and wrappers? — Primitives are efficient (no allocation); wrappers are required for generics (which only accept reference types) and for nullability.
- 4. What is `var` and is Java still statically typed with it? — `var` infers the declared type at compile time; Java remains statically typed and the inferred type cannot change.
- 5. Why is `5 / 2 == 2`? — Integer division truncates toward zero in Java; cast to double or divide by a double literal to get 2.5.

### Mini Project

Build a Tip Calculator CLI: Read a bill amount and tip percentage from argv, compute tip and total, and print a formatted receipt. Demonstrate primitive arithmetic, double formatting, and rounding. Suggested approach:
  - Parse `args[0]` with `Double.parseDouble` after checking `args.length`
  - Use `BigDecimal` for the math to avoid 0.1 + 0.2 surprises
  - Round to 2 decimal places with `setScale(2, RoundingMode.HALF_UP)`
  - Print a formatted receipt with `System.out.printf("%.2f%n", ...)`
  - Add a `--split N` flag parsed manually to divide the total N ways

### Exercises

1. Declare one variable of each primitive type and print its min and max value using the wrapper's `MIN_VALUE`/`MAX_VALUE` constants.
2. Demonstrate the Integer cache: print `Integer.valueOf(127) == Integer.valueOf(127)` and the same for 128; explain the difference.
3. Write a loop that sums integers 1 to 1_000_000 using `Integer` vs `int` and time it with `System.nanoTime()` to observe autoboxing overhead.
4. Use `var` to declare a String, a List<String>, and a Map<String,Integer>; verify the inferred types with the compiler by assigning an incompatible value.
5. Compute `0.1 + 0.2` as a double and as a BigDecimal; print both and explain why they differ.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many primitive types does Java have?
9. A) 6
10. B) 8 (*)
11. C) 7
12. D) 9
13. Explanation: byte, short, int, long, float, double, char, boolean — eight primitives defined by the JLS.
14. Q2: What is the default value of an int field (not a local variable)?
15. A) null
16. B) undefined
17. C) 0 (*)
18. D) garbage
19. Explanation: Fields are zero-initialized by the JVM; local variables are not initialized at all and must be assigned before use.
20. Q3: What is the range of the Integer cache by default?
21. A) 0 to 255
22. B) -32 to 32
23. C) -32768 to 32767
24. D) -128 to 127 (*)
25. Explanation: JLS mandates caching of -128 to 127 (Byte, Short, Long, Character 0-127 too); the high end of Integer can be raised with -XX:AutoBoxCacheMax.
26. Q4: `Integer a = 200; Integer b = 200; System.out.println(a == b);` prints?
27. A) false (*)
28. B) true
29. C) Compile error
30. D) NullPointerException
31. Explanation: 200 is outside the default cache, so a and b are distinct heap objects; == compares references and returns false. Use equals.
32. Q5: What does `var x = "hi";` mean?
33. A) x is dynamically typed
34. B) x has the inferred static type String (*)
35. C) x is of type Object
36. D) x is a JavaScript-style variable
37. Explanation: `var` (Java 10+) lets the compiler infer the declared type; the type is still fixed at compile time and cannot change.
38. Q6: Which operator short-circuits?
39. A) `&`
40. B) `|`
41. C) `&&` (*)
42. D) `^`
43. Explanation: `&&` and `||` short-circuit; the bitwise `&` and `|` always evaluate both operands even when used on booleans.
44. Q7: What does `5 / 2` evaluate to in Java?
45. A) 2.5
46. B) 3
47. C) Compile error
48. D) 2 (*)
49. Explanation: Integer division truncates toward zero, so 5 / 2 == 2. To get 2.5, write 5 / 2.0 or (double) 5 / 2.
50. Q8: Why use `BigDecimal` for money instead of double?
51. A) double cannot represent 0.1 exactly, causing rounding drift (*)
52. B) BigDecimal is faster
53. C) BigDecimal supports bitwise ops
54. D) double cannot store negative values
55. Explanation: 0.1 has no exact binary representation; BigDecimal uses arbitrary-precision decimal arithmetic and is the standard for monetary code.
56. Q9: `String s = "a" + "b";` in a tight loop is best replaced with?
57. A) A char array
58. B) StringBuilder (*)
59. C) StringBuffer
60. D) java.io.StringWriter
61. Explanation: StringBuilder is the unsynchronized, mutable companion to String and is the recommended way to build strings in loops.
62. Q10: Which is NOT a primitive type?
63. A) char
64. B) boolean
65. C) String (*)
66. D) long
67. Explanation: String is a reference type (a class in java.lang); the other three are primitives.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many primitive types does Java have?
  options:
    - "6"
    - "8"
    - "7"
    - "9"
  correctIndex: 1
  explanation: byte, short, int, long, float, double, char, boolean — eight primitives defined by the JLS.
- id: q2
  question: What is the default value of an int field (not a local variable)?
  options:
    - "null"
    - undefined
    - "0"
    - garbage
  correctIndex: 2
  explanation: Fields are zero-initialized by the JVM; local variables are not initialized at all and must be assigned before use.
- id: q3
  question: What is the range of the Integer cache by default?
  options:
    - 0 to 255
    - -32 to 32
    - -32768 to 32767
    - -128 to 127
  correctIndex: 3
  explanation: JLS mandates caching of -128 to 127 (Byte, Short, Long, Character 0-127 too); the high end of Integer can be raised with -XX:AutoBoxCacheMax.
- id: q4
  question: "`Integer a = 200; Integer b = 200; System.out.println(a == b);` prints?"
  options:
    - "false"
    - "true"
    - Compile error
    - NullPointerException
  correctIndex: 0
  explanation: 200 is outside the default cache, so a and b are distinct heap objects; == compares references and returns false. Use equals.
- id: q5
  question: What does `var x = "hi";` mean?
  options:
    - x is dynamically typed
    - x has the inferred static type String
    - x is of type Object
    - x is a JavaScript-style variable
  correctIndex: 1
  explanation: "`var` (Java 10+) lets the compiler infer the declared type; the type is still fixed at compile time and cannot change."
- id: q6
  question: Which operator short-circuits?
  options:
    - "`&`"
    - "`|`"
    - "`&&`"
    - "`^`"
  correctIndex: 2
  explanation: "`&&` and `||` short-circuit; the bitwise `&` and `|` always evaluate both operands even when used on booleans."
- id: q7
  question: What does `5 / 2` evaluate to in Java?
  options:
    - "2.5"
    - "3"
    - Compile error
    - "2"
  correctIndex: 3
  explanation: Integer division truncates toward zero, so 5 / 2 == 2. To get 2.5, write 5 / 2.0 or (double) 5 / 2.
- id: q8
  question: Why use `BigDecimal` for money instead of double?
  options:
    - double cannot represent 0.1 exactly, causing rounding drift
    - BigDecimal is faster
    - BigDecimal supports bitwise ops
    - double cannot store negative values
  correctIndex: 0
  explanation: 0.1 has no exact binary representation; BigDecimal uses arbitrary-precision decimal arithmetic and is the standard for monetary code.
- id: q9
  question: '`String s = "a" + "b";` in a tight loop is best replaced with?'
  options:
    - A char array
    - StringBuilder
    - StringBuffer
    - java.io.StringWriter
  correctIndex: 1
  explanation: StringBuilder is the unsynchronized, mutable companion to String and is the recommended way to build strings in loops.
- id: q10
  question: Which is NOT a primitive type?
  options:
    - char
    - boolean
    - String
    - long
  correctIndex: 2
  explanation: String is a reference type (a class in java.lang); the other three are primitives.
```

