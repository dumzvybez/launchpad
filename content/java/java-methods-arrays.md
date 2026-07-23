---
slug: java-methods-arrays
id: java-04
track: java
order: 4
title: Methods and Arrays
description: Write reusable methods, understand pass-by-value, return types, varargs, and work with Java arrays — including multidimensional arrays, `Arrays` utility, and array covariance.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=3600s
whyItMatters: Write reusable methods, understand pass-by-value, return types, varargs, and work with Java arrays — including multidimensional arrays, `Arrays` utility, and array covariance.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Methods and Arrays

## Methods and Arrays

### Why It Matters

Write reusable methods, understand pass-by-value, return types, varargs, and work with Java arrays — including multidimensional arrays, `Arrays` utility, and array covariance.

Write reusable methods, understand pass-by-value, return types, varargs, and work with Java arrays — including multidimensional arrays, `Arrays` utility, and array covariance.

### Prerequisites

- Stage 3: Control Flow — Conditionals and Loops.
- Comfortable declaring primitives and references.

### Topics

- Method declaration: modifiers, return type, name, parameters, body
- Pass-by-value (always, even for references)
- Varargs (`int... nums`)
- Method overloading
- Recursive methods
- Array declaration, initialization, length, and indexing
- Multidimensional and ragged arrays
- `java.util.Arrays` utility methods (sort, asList, copyOf, equals)
- Array covariance and its pitfall

### Key Concepts

- Java is strictly pass-by-value: for reference types, the value passed is a copy of the reference (not a copy of the object).
- Arrays are objects with a `.length` field (not a method) and fixed size at creation.
- `int[]` is covariant over `int[]`'s component type: `Object[] objs = new String[10];` compiles, but `objs[0] = Integer.valueOf(1)` throws ArrayStoreException at runtime.
- `Arrays.asList` returns a fixed-size view backed by the array; `List.of` returns an immutable list.
- Varargs is syntactic sugar for an array; the compiler boxes/wraps the call site.

```java
static void mutate(int[] arr) {
    arr[0] = 99;            // mutation visible to caller
}
static void reassign(int[] arr) {
    arr = new int[]{99};    // reassigns local copy — caller unaffected
}
public static void main(String[] args) {
    int[] a = {1, 2, 3};
    mutate(a);
    System.out.println(a[0]);  // 99
    reassign(a);
    System.out.println(a[0]);  // still 99, not reassignable via callee
}
```
Caption: Pass-by-value demo

### Common Pitfalls

- Believing Java is pass-by-reference — it is strictly pass-by-value; references are passed by value, so reassignment inside a method is invisible to the caller.
- Calling `add` on the result of `Arrays.asList` — throws UnsupportedOperationException; wrap with `new ArrayList<>(Arrays.asList(...))` for a mutable list.
- Using `.length()` on an array — arrays have a `.length` field (no parentheses); `.length()` is for String.
- Expecting `int[] arr2 = arr1` to copy — it shares the same array object; use `Arrays.copyOf` or `arr.clone()`.
- Trusting array covariance — `Object[] o = new String[]{}` compiles but stores throw ArrayStoreException; prefer `List<? extends T>` for read-only covariance.

### Real-World Applications

- Apache Lucene's postings lists are backed by raw int[] arrays for tight memory layout, enabling sub-millisecond term lookups across billion-document indices.
- The LMAX Disruptor (used by Apache Storm and other high-throughput systems) preallocates ring-buffer arrays of event objects to avoid GC during the hot path.
- Android's `Bitmap.getPixels(int[])` API fills a caller-provided int array, leveraging pass-by-value of the reference for zero-copy pixel data transfer.
- Netty's `ByteBuf` uses preallocated backing arrays with explicit capacity tracking to avoid the array-copy overhead of `java.nio.Buffer`.

### Interview Questions

- 1. Is Java pass-by-value or pass-by-reference? — Strictly pass-by-value; references are passed by copying the reference, so callee reassignment is invisible.
- 2. What is the difference between `int[]` and `ArrayList<Integer>`? — Arrays are fixed-size, primitive-friendly, and have a length field; ArrayList is resizable, generic, and stores boxed Integers.
- 3. What is array covariance and why is it dangerous? — If S extends T, S[] is a subtype of T[]; this lets you assign String[] to Object[] but a store can throw ArrayStoreException.
- 4. What does `Arrays.asList` return? — A fixed-size `Arrays$ArrayList` view of the original array; add/remove throws UnsupportedOperationException.
- 5. How are varargs implemented? — As syntactic sugar over an array; the compiler collects the arguments into a newly allocated array at the call site.

### Mini Project

Build a Statistics Calculator: Read N integers from argv, compute min, max, mean, median, and standard deviation using only arrays and helper methods. Suggested approach:
  - Parse argv into an `int[]` with `Integer.parseInt`
  - Sort a copy with `Arrays.sort` to compute median
  - Write separate methods `min(int[])`, `max(int[])`, `mean(int[])`, `median(int[])`, `stddev(int[])`
  - Use `double` for mean and stddev; cast carefully
  - Print results with `System.out.printf("%.2f%n", x)`

### Exercises

1. Write a method that swaps two elements of an `int[]` and prove that the swap is visible to the caller (because the array reference is passed by value but the array is shared).
2. Use varargs to implement a `String join(String sep, String... parts)` method and test it with 0, 1, and many arguments.
3. Demonstrate array covariance: assign a `String[]` to `Object[]`, then attempt to store an Integer; print the resulting exception.
4. Use `Arrays.copyOf`, `Arrays.sort`, `Arrays.binarySearch`, and `Arrays.toString` on an int array; explain what each returns.
5. Implement a recursive `binarySearch(int[] sorted, int target)` that takes low/high bounds and returns the index or -1.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Java's parameter passing model is?
9. A) Pass-by-reference for objects, pass-by-value for primitives
10. B) Pass-by-name
11. C) Pass-by-pointer
12. D) Strictly pass-by-value (*)
13. Explanation: Java is strictly pass-by-value. References are copied (the value of the reference is copied), so the callee can mutate the object but cannot reassign the caller's variable.
14. Q2: Arrays in Java have which property for length?
15. A) `.length` field (*)
16. B) `.length()` method
17. C) `.size()` method
18. D) `.count()` method
19. Explanation: Arrays expose a public final field `length`. String has a method `length()`; Collections have `size()`.
20. Q3: What does `Arrays.asList(1, 2, 3)` return?
21. A) An ArrayList that supports add/remove
22. B) A fixed-size List view backed by an array (*)
23. C) An immutable list
24. D) A Set
25. Explanation: Arrays.asList returns a List view of the given array (or varargs-backed array). add/remove throws UnsupportedOperationException; set() works.
26. Q4: `Object[] o = new String[10]; o[0] = 5;` produces?
27. A) Compile error
28. B) NullPointerException
29. C) ArrayStoreException at runtime (*)
30. D) Successful store of Integer into String[]
31. Explanation: Array covariance lets the assignment compile, but the runtime type is String[], so storing an Integer throws ArrayStoreException.
32. Q5: Varargs `int... nums` is implemented as?
33. A) A List<Integer>
34. B) A Stream<Integer>
35. C) A tuple
36. D) An int[] array (*)
37. Explanation: Varargs is syntactic sugar; the method receives an array (here, int[]) and the call site allocates the array.
38. Q6: Reassigning a parameter inside a method:
39. A) Is NOT visible to the caller (*)
40. B) Is visible to the caller
41. C) Throws an exception
42. D) Only works for primitives
43. Explanation: Because references are passed by value, reassigning the parameter to a new object is local — the caller's variable still points to the original.
44. Q7: Which is true about method overloading?
45. A) Methods must differ in return type
46. B) Methods must differ in parameter list (number, types, or order) (*)
47. C) Methods must differ in name
48. D) Methods cannot share a name
49. Explanation: Overloading requires distinct parameter lists; return type alone is not enough to disambiguate (the compiler couldn't choose).
50. Q8: `int[] a = {1,2,3}; int[] b = a; b[0] = 99;` What is `a[0]`?
51. A) 1
52. B) 0
53. C) 99 (*)
54. D) Undefined
55. Explanation: `b = a` copies the reference, so both point to the same array; mutating through b is visible through a.
56. Q9: To get an immutable list in Java 9+ use?
57. A) `Arrays.asList(...)`
58. B) `Collections.singletonList(...)`
59. C) `new ArrayList<>(...)`
60. D) `List.of(...) (*)
61. Explanation: `List.of(...)` (Java 9+) returns an unmodifiable list with the given elements; nulls are rejected at creation.
62. Q10: Recursion in Java lacks tail-call optimization, so deep recursion can?
63. A) Throw StackOverflowError (*)
64. B) Throw OutOfMemoryError in the heap
65. C) Be silently optimized by the JIT
66. D) Trigger a GC pause
67. Explanation: The JVM does not guarantee TCO; deep recursion can exhaust the stack and throw StackOverflowError. Convert to iteration for unbounded depth.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Java's parameter passing model is?
  options:
    - Pass-by-reference for objects, pass-by-value for primitives
    - Pass-by-name
    - Pass-by-pointer
    - Strictly pass-by-value
  correctIndex: 3
  explanation: Java is strictly pass-by-value. References are copied (the value of the reference is copied), so the callee can mutate the object but cannot reassign the caller's variable.
- id: q2
  question: Arrays in Java have which property for length?
  options:
    - "`.length` field"
    - "`.length()` method"
    - "`.size()` method"
    - "`.count()` method"
  correctIndex: 0
  explanation: Arrays expose a public final field `length`. String has a method `length()`; Collections have `size()`.
- id: q3
  question: What does `Arrays.asList(1, 2, 3)` return?
  options:
    - An ArrayList that supports add/remove
    - A fixed-size List view backed by an array
    - An immutable list
    - A Set
  correctIndex: 1
  explanation: Arrays.asList returns a List view of the given array (or varargs-backed array). add/remove throws UnsupportedOperationException; set() works.
- id: q4
  question: "`Object[] o = new String[10]; o[0] = 5;` produces?"
  options:
    - Compile error
    - NullPointerException
    - ArrayStoreException at runtime
    - Successful store of Integer into String[]
  correctIndex: 2
  explanation: Array covariance lets the assignment compile, but the runtime type is String[], so storing an Integer throws ArrayStoreException.
- id: q5
  question: Varargs `int... nums` is implemented as?
  options:
    - A List<Integer>
    - A Stream<Integer>
    - A tuple
    - An int[] array
  correctIndex: 3
  explanation: Varargs is syntactic sugar; the method receives an array (here, int[]) and the call site allocates the array.
- id: q6
  question: "Reassigning a parameter inside a method:"
  options:
    - Is NOT visible to the caller
    - Is visible to the caller
    - Throws an exception
    - Only works for primitives
  correctIndex: 0
  explanation: Because references are passed by value, reassigning the parameter to a new object is local — the caller's variable still points to the original.
- id: q7
  question: Which is true about method overloading?
  options:
    - Methods must differ in return type
    - Methods must differ in parameter list (number, types, or order)
    - Methods must differ in name
    - Methods cannot share a name
  correctIndex: 1
  explanation: Overloading requires distinct parameter lists; return type alone is not enough to disambiguate (the compiler couldn't choose).
- id: q8
  question: "`int[] a = {1,2,3}; int[] b = a; b[0] = 99;` What is `a[0]`?"
  options:
    - "1"
    - "0"
    - "99"
    - Undefined
  correctIndex: 2
  explanation: "`b = a` copies the reference, so both point to the same array; mutating through b is visible through a."
- id: q9
  question: To get an immutable list in Java 9+ use?
  options:
    - "`Arrays.asList(...)`"
    - "`Collections.singletonList(...)`"
    - "`new ArrayList<>(...)`"
    - "`List.of(...)"
  correctIndex: 3
  explanation: "`List.of(...)` (Java 9+) returns an unmodifiable list with the given elements; nulls are rejected at creation."
- id: q10
  question: Recursion in Java lacks tail-call optimization, so deep recursion can?
  options:
    - Throw StackOverflowError
    - Throw OutOfMemoryError in the heap
    - Be silently optimized by the JIT
    - Trigger a GC pause
  correctIndex: 0
  explanation: The JVM does not guarantee TCO; deep recursion can exhaust the stack and throw StackOverflowError. Convert to iteration for unbounded depth.
```

