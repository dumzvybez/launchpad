---
slug: java-control-flow-conditionals-loops
id: java-03
track: java
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/else, switch (including the new arrow-form switch and pattern matching), for, while, do-while, break, continue, and labeled loops.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=2400s
whyItMatters: Master if/else, switch (including the new arrow-form switch and pattern matching), for, while, do-while, break, continue, and labeled loops.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/else, switch (including the new arrow-form switch and pattern matching), for, while, do-while, break, continue, and labeled loops.

Master if/else, switch (including the new arrow-form switch and pattern matching), for, while, do-while, break, continue, and labeled loops.

### Prerequisites

- Stage 2: Variables, Types, and Operators.
- Familiarity with boolean expressions and operators.

### Topics

- if, else if, else, and dangling-else
- Ternary conditional `? :`
- The classic switch statement (with fall-through)
- The Java 14+ switch expression and arrow-form `->` with no fall-through
- Pattern matching in switch (Java 21) — type patterns and guards
- for loops (classic and enhanced for-each)
- while and do-while
- break, continue, and labeled statements

### Key Concepts

- Switch on String (since Java 7) compiles to hashCode + equals chains; null falls through all cases.
- The classic switch falls through unless you `break`; the arrow-form `case X ->` does not fall through and can yield a value.
- Enhanced for-each works on anything implementing `Iterable` or arrays; it cannot give you the index.
- Labeled break/continue are rare but valid for breaking out of nested loops.
- Switch expression `yield` returns a value from a block-style case arm.

```java
int day = 3;
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("weekday");
        break;
    case 6:
    case 7:
        System.out.println("weekend");
        break;
    default:
        System.out.println("invalid");
}
```
Caption: Classic switch with fall-through

### Common Pitfalls

- Forgetting `break` in a classic switch — causes unintentional fall-through; prefer the arrow-form to eliminate the bug class entirely.
- Switching on a null String — throws NullPointerException because the switch evaluates `o.hashCode()`; guard with a null check or use Java 21's `case null`.
- Using for-each when you need the index — for-each hides indices; use a classic for loop or an indexed stream when position matters.
- Confusing `do-while` with `while` — do-while executes the body at least once, which can be a bug if the precondition should have prevented execution.
- Modifying a collection inside a for-each loop — throws ConcurrentModificationException; use an explicit Iterator with `remove()` or removeIf.

### Real-World Applications

- Apache Commons Lang's `Validate` and `BooleanUtils` use switch expression syntax for clean branch-to-value mapping in 1.4+ builds.
- JetBrains' IntelliJ code-inspection engine uses pattern-matching switch to dispatch AST node types in its Java 17 baseline.
- Spring Framework 6's `BeanUtils` and property resolvers migrated to switch expressions for readability across hundreds of type dispatch sites.
- The Minecraft server tick loop uses nested labeled loops with `continue outer` to skip entities in unloaded chunks.

### Interview Questions

- 1. What is fall-through in a switch and how do you avoid it? — Without `break`, execution continues into the next case; the arrow-form `case X ->` and exhaustive switch expressions avoid it.
- 2. What is the difference between `while` and `do-while`? — while checks the condition before the first iteration; do-while checks after, so the body always runs at least once.
- 3. When can you switch on a String? — Since Java 7; the compiler emits a hashCode-based dispatch followed by equals checks.
- 4. What does `yield` do in a switch expression? — Returns a value from a block-form case arm of a switch expression.
- 5. How does pattern matching in switch (Java 21) improve code? — It combines type testing, binding, and guards, removing boilerplate instanceof-cast chains.

### Mini Project

Build a FizzBuzz Variant Printer: Print numbers 1 to N (from argv) with rules: multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of 7 -> "Bazz", combined for multiples of several. Use a switch expression and a labeled continue. Suggested approach:
  - Parse N from `args[0]` with `Integer.parseInt`
  - Loop i from 1 to N with a classic for
  - Use `switch` over the boolean pattern (or simple if-chain) and a StringBuilder for combined labels
  - Use a labeled `continue outer` in a nested loop variant
  - Print each result on its own line

### Exercises

1. Rewrite a classic switch with fall-through into an arrow-form switch expression; confirm the behavior is identical.
2. Write a method that takes an Object and uses Java 21 pattern matching to classify it as Integer, String, List, or other.
3. Use a labeled break to find the first negative number in a 2D array and print its coordinates.
4. Modify a for-each loop that throws ConcurrentModificationException to use `Iterator.remove()` correctly.
5. Convert a nested if/else into a single switch expression with guards (`when`) and compare readability.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens if you forget `break` in a classic switch case?
9. A) Compile error
10. B) The JVM throws SwitchException
11. C) Fall-through to the next case (*)
12. D) The default case runs instead
13. Explanation: Classic switch falls through cases that lack a `break` (or `return`); this is a famous source of bugs and the arrow-form was designed to eliminate it.
14. Q2: Which Java version introduced the arrow-form switch?
15. A) Java 8
16. B) Java 11
17. C) Java 21
18. D) Java 14 (standard in 14, preview earlier) (*)
19. Explanation: Switch expressions (with `->` and `yield`) were finalized in Java 14; pattern matching for switch was finalized in Java 21.
20. Q3: What does `yield` do?
21. A) Returns a value from a block arm of a switch expression (*)
22. B) Pauses the current thread
23. C) Throws a YieldException
24. D) Renames a case label
25. Explanation: `yield` is the keyword used to return a value from a block-form arm of a switch expression (e.g., `case X -> { ... yield v; }`).
26. Q4: Switching on a null String in classic switch produces?
27. A) The default case runs
28. B) NullPointerException (*)
29. C) Compile error
30. D) An empty-string match
31. Explanation: The compiled switch calls hashCode on the selector; null.hashCode throws NPE. Java 21 lets you write `case null` explicitly.
32. Q5: Which loop guarantees the body runs at least once?
33. A) for
34. B) while
35. C) do-while (*)
36. D) for-each
37. Explanation: do-while evaluates the condition after the body, so the body always executes once even if the condition is initially false.
38. Q6: Enhanced for-each works on?
39. A) Only arrays
40. B) Only collections
41. C) Any object with a size() method
42. D) Arrays and any Iterable (*)
43. Explanation: The enhanced for works on arrays and on anything implementing java.lang.Iterable (which includes all Collections).
44. Q7: How do you break out of an outer loop from inside a nested loop?
45. A) Use a labeled break (*)
46. B) Use return from the enclosing method
47. C) Throw a checked exception
48. D) Set a flag and check after every inner iteration
49. Explanation: Java supports labeled break/continue (`label:` then `break label;`) for control over which enclosing loop is exited.
50. Q8: Modifying a collection during for-each typically throws?
51. A) IndexOutOfBoundsException
52. B) ConcurrentModificationException (*)
53. C) IllegalStateException
54. D) ClassCastException
55. Explanation: for-each uses an Iterator; the iterator detects structural modification between calls and throws CME. Use Iterator.remove() or removeIf().
56. Q9: Pattern matching in switch (case Integer i when i > 0) requires which Java version?
57. A) Java 17
58. B) Java 19
59. C) Java 21 (*)
60. D) Java 25
61. Explanation: Pattern matching for switch was finalized in Java 21 (JEP 441); earlier versions had it as a preview feature.
62. Q10: What does the arrow-form `case X ->` prevent by design?
63. A) Returning from the method
64. B) Using a default branch
65. C) Switching on String
66. D) Fall-through to the next case (*)
67. Explanation: The arrow form executes only its right-hand side and does not fall through, eliminating the most common classic-switch bug.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if you forget `break` in a classic switch case?
  options:
    - Compile error
    - The JVM throws SwitchException
    - Fall-through to the next case
    - The default case runs instead
  correctIndex: 2
  explanation: Classic switch falls through cases that lack a `break` (or `return`); this is a famous source of bugs and the arrow-form was designed to eliminate it.
- id: q2
  question: Which Java version introduced the arrow-form switch?
  options:
    - Java 8
    - Java 11
    - Java 21
    - Java 14 (standard in 14, preview earlier)
  correctIndex: 3
  explanation: Switch expressions (with `->` and `yield`) were finalized in Java 14; pattern matching for switch was finalized in Java 21.
- id: q3
  question: What does `yield` do?
  options:
    - Returns a value from a block arm of a switch expression
    - Pauses the current thread
    - Throws a YieldException
    - Renames a case label
  correctIndex: 0
  explanation: "`yield` is the keyword used to return a value from a block-form arm of a switch expression (e.g., `case X -> { ... yield v; }`)."
- id: q4
  question: Switching on a null String in classic switch produces?
  options:
    - The default case runs
    - NullPointerException
    - Compile error
    - An empty-string match
  correctIndex: 1
  explanation: The compiled switch calls hashCode on the selector; null.hashCode throws NPE. Java 21 lets you write `case null` explicitly.
- id: q5
  question: Which loop guarantees the body runs at least once?
  options:
    - for
    - while
    - do-while
    - for-each
  correctIndex: 2
  explanation: do-while evaluates the condition after the body, so the body always executes once even if the condition is initially false.
- id: q6
  question: Enhanced for-each works on?
  options:
    - Only arrays
    - Only collections
    - Any object with a size() method
    - Arrays and any Iterable
  correctIndex: 3
  explanation: The enhanced for works on arrays and on anything implementing java.lang.Iterable (which includes all Collections).
- id: q7
  question: How do you break out of an outer loop from inside a nested loop?
  options:
    - Use a labeled break
    - Use return from the enclosing method
    - Throw a checked exception
    - Set a flag and check after every inner iteration
  correctIndex: 0
  explanation: Java supports labeled break/continue (`label:` then `break label;`) for control over which enclosing loop is exited.
- id: q8
  question: Modifying a collection during for-each typically throws?
  options:
    - IndexOutOfBoundsException
    - ConcurrentModificationException
    - IllegalStateException
    - ClassCastException
  correctIndex: 1
  explanation: for-each uses an Iterator; the iterator detects structural modification between calls and throws CME. Use Iterator.remove() or removeIf().
- id: q9
  question: Pattern matching in switch (case Integer i when i > 0) requires which Java version?
  options:
    - Java 17
    - Java 19
    - Java 21
    - Java 25
  correctIndex: 2
  explanation: Pattern matching for switch was finalized in Java 21 (JEP 441); earlier versions had it as a preview feature.
- id: q10
  question: What does the arrow-form `case X ->` prevent by design?
  options:
    - Returning from the method
    - Using a default branch
    - Switching on String
    - Fall-through to the next case
  correctIndex: 3
  explanation: The arrow form executes only its right-hand side and does not fall through, eliminating the most common classic-switch bug.
```

