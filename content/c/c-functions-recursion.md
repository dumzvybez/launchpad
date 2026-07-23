---
slug: c-functions-recursion
id: c-04
track: c
order: 4
title: Functions and Recursion
description: Declare and define functions, understand pass-by-value semantics, master recursion and tail calls, and learn how the call stack actually works.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=2000s
whyItMatters: Declare and define functions, understand pass-by-value semantics, master recursion and tail calls, and learn how the call stack actually works.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Functions and Recursion

## Functions and Recursion

### Why It Matters

Declare and define functions, understand pass-by-value semantics, master recursion and tail calls, and learn how the call stack actually works.

Declare and define functions, understand pass-by-value semantics, master recursion and tail calls, and learn how the call stack actually works.

### Prerequisites

- Stage 1: Getting Started with C.
- Stage 2: Variables, Types, and Operators.
- Stage 3: Control Flow.

### Topics

- Function declaration (prototype) vs definition
- Pass-by-value: arguments are copied
- Return values and `void`
- Recursion and base cases
- The call stack: frames, return addresses, local storage
- Stack overflow and tail-call optimization
- Static and extern functions
- Variadic functions (stdarg.h) and printf

### Key Concepts

- C is strictly pass-by-value; pointers simulate pass-by-reference.
- Function prototypes allow the compiler to type-check calls before the definition.
- Each function call pushes a stack frame (locals, return address, saved registers).
- Deep recursion can overflow the stack (typically 1-8 MB on Linux).
- Tail-recursive functions may be optimized into loops by -O2, but C does not require it.
- Variadic functions bypass type checking on trailing arguments.

```c
#include <stdio.h>

/* Prototype — lets main call sum before its definition */
int sum(int a, int b);

int main(void) {
    printf("sum(2,3) = %d\n", sum(2, 3));
    return 0;
}

int sum(int a, int b) {
    return a + b;
}
```
Caption: Prototype and definition

### Common Pitfalls

- Forgetting a prototype — pre-C99 compilers assume `int f()` (returns int, takes any args); C99+ makes this a constraint violation; always declare prototypes in headers.
- Returning a pointer to a local — `return &local;` returns dangling memory; the stack frame is reused after the function returns.
- Variadic function with wrong type — `printf("%d", 3.14)` reads the double as int; undefined behavior; compile with -Wformat.
- Stack overflow from unbounded recursion — `int f(int n){ return f(n+1); }` crashes with SIGSEGV; ensure a reachable base case.
- Argument type mismatches in old-style K&R declarations — `int f()` (empty parens) means "unspecified args"; use `int f(void)` for "no args".

### Real-World Applications

- Recursive-descent parsers in SQLite, Git, and many JSON libraries (cJSON, jansson) walk grammar productions using C recursion.
- The QuickSort and MergeSort implementations in glibc use recursion with a depth guard to avoid stack overflow on adversarial inputs.
- The Linux kernel avoids unbounded recursion on purpose — kernel stacks are small (8-16 KB) on most architectures.
- Redis's object serialization uses recursion to walk nested list/set/hash structures.

### Interview Questions

- 1. Is C pass-by-value or pass-by-reference? — Strictly pass-by-value; pointers are also passed by value, but copying a pointer lets the callee mutate the pointee.
- 2. What is a stack frame? — A per-call block on the call stack holding locals, saved registers, and the return address; popped on return.
- 3. What's the difference between `int f()` and `int f(void)`? — `int f()` accepts unspecified arguments (K&R style); `int f(void)` accepts no arguments.
- 4. How does tail-call optimization work, and does C require it? — A tail call reuses the current frame; C permits but does not require TCO, so deep tail recursion can still overflow.
- 5. What's the danger of variadic functions? — The compiler cannot type-check trailing arguments; passing the wrong type (or wrong count) is undefined behavior.

### Mini Project

Build a Recursive File-Size Counter: A program that takes a directory path and prints the total size of all regular files using opendir/readdir/stat (POSIX). Suggested approach:
  - Use opendir/readdir; for each entry, call stat
  - If S_ISDIR(mode) and not "." or "..", recurse
  - If S_ISREG(mode), add st_size to a running total
  - Pass the total via a pointer (uint64_t *total) to accumulate
  - Handle errors with perror and return non-zero

### Exercises

1. Write a recursive function to compute the nth Fibonacci number; then write an iterative version and compare performance for n=40.
2. Write a variadic function `max_of(int count, ...)` returning the maximum of count integers.
3. Demonstrate pass-by-value vs pass-by-pointer with a swap function (one version that fails, one that works).
4. Cause an intentional stack overflow by recursing without a base case; observe the SIGSEGV and run `ulimit -s` to see the stack limit.
5. Write a recursive function to print a number in any base (2, 8, 10, 16).
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How are arguments passed to C functions?
9. A) Pass-by-reference
10. B) Pass-by-value for primitives, pass-by-reference for arrays
11. C) Implementation-defined
12. D) Pass-by-value, always (*)
13. Explanation: C is strictly pass-by-value; pointers are passed by value too, but the copy still points at the same object.
14. Q2: What does `int f();` declare (in C99+)?
15. A) A function returning int with unspecified arguments (*)
16. B) A function taking no arguments
17. C) A function returning int and taking no arguments
18. D) A syntax error
19. Explanation: Empty parens mean unspecified arguments (K&R-style); use `int f(void)` to mean "no arguments".
20. Q3: What happens when you return a pointer to a local variable?
21. A) Compile error
22. B) Dangling pointer — undefined behavior (*)
23. C) The pointer is automatically heap-allocated
24. D) The local becomes static automatically
25. Explanation: The local's storage is freed when the function returns; the pointer now points at reused stack memory.
26. Q4: Which header is required for variadic functions?
27. A) <stdio.h>
28. B) <varargs.h>
29. C) <stdarg.h> (*)
30. D) <stdarg.h> only on Linux
31. Explanation: <stdarg.h> provides va_list, va_start, va_arg, and va_end; <varargs.h> is the pre-C89 predecessor.
32. Q5: What does `va_arg(ap, int)` do?
33. A) Pushes an int onto the va_list
34. B) Returns the count of arguments
35. C) Ends the va_list traversal
36. D) Reads the next int from the va_list and advances it (*)
37. Explanation: va_arg reads the next argument with the given type and advances the internal pointer.
38. Q6: What is the typical cause of a stack overflow?
39. A) Unbounded or too-deep recursion (*)
40. B) malloc with size 0
41. C) Forgetting to call free
42. D) Using too many globals
43. Explanation: Each recursive call adds a frame; deep or infinite recursion exhausts the stack (commonly 1-8 MB).
44. Q7: What is a function prototype used for?
45. A) Allocating stack for the function
46. B) Letting the compiler type-check calls before the definition (*)
47. C) Inlining the function
48. D) Making the function static
49. Explanation: A prototype declares the signature so calls before the definition can be type-checked.
50. Q8: Does C require tail-call optimization?
51. A) Yes, always
52. B) Yes, with -O2
53. C) No, it permits but does not require it (*)
54. D) Only for void functions
55. Explanation: C compilers may perform TCO at -O2, but the standard does not require it, so portable code should not rely on it.
56. Q9: What is a base case in recursion?
57. A) The first recursive call
58. B) The fastest path through the function
59. C) The deepest allowed recursion depth
60. D) A condition that stops the recursion (*)
61. Explanation: A base case returns without recursing, ensuring the recursion terminates.
62. Q10: What's wrong with `printf("%d", 3.14);`?
63. A) Reads the double as int — undefined behavior (*)
64. B) Nothing — printf converts types
65. C) Compile error
66. D) Rounds 3.14 to 3
67. Explanation: %d expects an int; passing a double yields garbage or a crash. -Wformat (in -Wall) catches this at compile time.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How are arguments passed to C functions?
  options:
    - Pass-by-reference
    - Pass-by-value for primitives, pass-by-reference for arrays
    - Implementation-defined
    - Pass-by-value, always
  correctIndex: 3
  explanation: C is strictly pass-by-value; pointers are passed by value too, but the copy still points at the same object.
- id: q2
  question: What does `int f();` declare (in C99+)?
  options:
    - A function returning int with unspecified arguments
    - A function taking no arguments
    - A function returning int and taking no arguments
    - A syntax error
  correctIndex: 0
  explanation: Empty parens mean unspecified arguments (K&R-style); use `int f(void)` to mean "no arguments".
- id: q3
  question: What happens when you return a pointer to a local variable?
  options:
    - Compile error
    - Dangling pointer — undefined behavior
    - The pointer is automatically heap-allocated
    - The local becomes static automatically
  correctIndex: 1
  explanation: The local's storage is freed when the function returns; the pointer now points at reused stack memory.
- id: q4
  question: Which header is required for variadic functions?
  options:
    - <stdio.h>
    - <varargs.h>
    - <stdarg.h>
    - <stdarg.h> only on Linux
  correctIndex: 2
  explanation: <stdarg.h> provides va_list, va_start, va_arg, and va_end; <varargs.h> is the pre-C89 predecessor.
- id: q5
  question: What does `va_arg(ap, int)` do?
  options:
    - Pushes an int onto the va_list
    - Returns the count of arguments
    - Ends the va_list traversal
    - Reads the next int from the va_list and advances it
  correctIndex: 3
  explanation: va_arg reads the next argument with the given type and advances the internal pointer.
- id: q6
  question: What is the typical cause of a stack overflow?
  options:
    - Unbounded or too-deep recursion
    - malloc with size 0
    - Forgetting to call free
    - Using too many globals
    - .
  correctIndex: 0
  explanation: Each recursive call adds a frame; deep or infinite recursion exhausts the stack (commonly 1-8 MB).
- id: q7
  question: What is a function prototype used for?
  options:
    - Allocating stack for the function
    - Letting the compiler type-check calls before the definition
    - Inlining the function
    - Making the function static
  correctIndex: 1
  explanation: A prototype declares the signature so calls before the definition can be type-checked.
- id: q8
  question: Does C require tail-call optimization?
  options:
    - Yes, always
    - Yes, with -O2
    - No, it permits but does not require it
    - Only for void functions
  correctIndex: 2
  explanation: C compilers may perform TCO at -O2, but the standard does not require it, so portable code should not rely on it.
- id: q9
  question: What is a base case in recursion?
  options:
    - The first recursive call
    - The fastest path through the function
    - The deepest allowed recursion depth
    - A condition that stops the recursion
  correctIndex: 3
  explanation: A base case returns without recursing, ensuring the recursion terminates.
- id: q10
  question: What's wrong with `printf("%d", 3.14);`?
  options:
    - Reads the double as int — undefined behavior
    - Nothing — printf converts types
    - Compile error
    - Rounds 3.14 to 3
  correctIndex: 0
  explanation: "%d expects an int; passing a double yields garbage or a crash. -Wformat (in -Wall) catches this at compile time."
```

