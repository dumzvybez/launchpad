---
slug: c-function-pointers-callbacks
id: c-10
track: c
order: 10
title: Function Pointers and Callbacks
description: Take pointers to functions, store them in tables, and use them for callbacks — the foundation of qsort, event loops, and plugin architectures in C.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=6200s
whyItMatters: Take pointers to functions, store them in tables, and use them for callbacks — the foundation of qsort, event loops, and plugin architectures in C.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Function Pointers and Callbacks

## Function Pointers and Callbacks

### Why It Matters

Take pointers to functions, store them in tables, and use them for callbacks — the foundation of qsort, event loops, and plugin architectures in C.

Take pointers to functions, store them in tables, and use them for callbacks — the foundation of qsort, event loops, and plugin architectures in C.

### Prerequisites

- Stage 4: Functions and Recursion.
- Stage 6: Pointers.
- Stage 9: structs, unions, and typedefs.

### Topics

- Function pointer syntax: `int (*fp)(int, int);`
- Calling through a function pointer
- qsort and its comparator signature
- Callbacks: registering and invoking
- Arrays of function pointers (dispatch tables)
- typedef for function pointer types
- The signal() function for asynchronous callbacks
- Pitfalls: null function pointers, calling conventions

### Key Concepts

- A function pointer stores the address of a function; calling it invokes the function.
- The syntax is dense: `int (*fp)(int, int)` is a pointer to a function taking two ints and returning int.
- typedef simplifies: `typedef int (*BinOp)(int, int);` then `BinOp fp = add;`.
- qsort takes a comparator `int (*)(const void*, const void*)` returning <0, 0, >0.
- Function pointers enable polymorphism in C — the same code can call different functions at runtime.
- Function pointers have an ABI calling convention; mixing cdecl, stdcall, etc. is UB.

```c
#include <stdio.h>

static int add(int a, int b) { return a + b; }
static int mul(int a, int b) { return a * b; }

int main(void) {
    int (*fp)(int, int) = add;          /* pointer to add */
    printf("add(2,3) = %d\n", fp(2, 3));   /* 5 */

    fp = mul;
    printf("mul(2,3) = %d\n", fp(2, 3));   /* 6 */
    return 0;
}
```
Caption: Basic function pointer

### Common Pitfalls

- Calling through a NULL function pointer — `fp(NULL);` segfaults; check `if (fp)` first.
- Wrong signature in the comparator — `int cmp(const int*, const int*)` doesn't match qsort's `int (*)(const void*, const void*)`; you must cast inside.
- Comparator returning subtraction overflow — `return *a - *b;` overflows for INT_MIN/INT_MAX; use `(a>b)-(a<b)`.
- Forgetting that function pointers and data pointers may have different sizes — POSIX requires them to be interchangeable, but standard C does not; do not cast `void*` to a function pointer.
- Calling convention mismatch — casting a `__stdcall` function pointer to a `__cdecl` type corrupts the stack on Windows; never mix.

### Real-World Applications

- The Linux kernel's `struct file_operations` is a struct of function pointers (open, read, write, ioctl) — every driver implements this interface.
- SQLite's `sqlite3_create_function` lets you register custom SQL functions as C function pointers.
- libcurl's `CURLOPT_WRITEFUNCTION` registers a callback `size_t (*)(char*, size_t, size_t, void*)` for receiving HTTP response data.
- Redis's command table is an array of `struct redisCommand` with a `cmd_proc` function pointer dispatched by name.

### Interview Questions

- 1. Declare a function pointer taking two ints and returning int. — `int (*fp)(int, int);` — note the parentheses around *fp.
- 2. How does qsort's comparator work? — Returns negative if a<b, 0 if equal, positive if a>b; the casts `(const int*)a` then `*` give you the values.
- 3. Why is `return *a - *b;` a bad comparator for ints? — `INT_MIN - INT_MAX` overflows (UB); use `(a>b) - (a<b)` which is branchless and overflow-free.
- 4. What's the difference between `int *f()` and `int (*f)()`? — The first is a function returning int*; the second is a pointer to a function returning int.
- 5. How would you implement polymorphism in C? — A struct of function pointers (a "vtable") plus per-instance data — exactly what the Linux kernel does for file_operations.

### Mini Project

Build a Tiny Calculator with Function Pointers: A CLI that parses `<int> <op> <int>` and dispatches to add/sub/mul/div via a function-pointer table. Suggested approach:
  - Define `typedef int (*BinOp)(int, int);`
  - Implement add, sub, mul, div functions (handle div by zero)
  - Build a lookup `struct { char op; BinOp fn; } table[] = {{'+',add},{'-',sub},...};`
  - Parse argv with sscanf and dispatch by scanning the table
  - Print "unknown op" if no match

### Exercises

1. Sort an int array with qsort using ascending and descending comparators.
2. Implement a generic `for_each` taking a function pointer and call it on an array.
3. Build a dispatch table mapping "+", "-", "*", "/" to function pointers; parse and dispatch.
4. Use signal(SIGINT, handler) to register a Ctrl-C handler that prints "bye" and exits.
5. Write a generic reduce function `int reduce(int *a, size_t n, int (*op)(int,int), int init)`.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you declare a pointer to a function taking two ints and returning int?
9. A) `int *fp(int, int);`
10. B) `int (*fp)(int, int);` (*)
11. C) `int fp(*)(int, int);`
12. D) `(int*) fp(int, int);`
13. Explanation: The parentheses around *fp are required; without them it's a function returning int*.
14. Q2: What is the signature of qsort's comparator?
15. A) `int (*)(int, int)`
16. B) `int (*)(void*, void*)`
17. C) `int (*)(const void*, const void*)` (*)
18. D) `int (*)(const int*, const int*)`
19. Explanation: qsort is generic; it passes const void* and expects <0, 0, or >0.
20. Q3: Why is `return *a - *b;` a bad comparator for ints?
21. A) It's too slow
22. B) It returns the wrong sign
23. C) It only works for unsigned
24. D) It overflows for INT_MIN/INT_MAX (*)
25. Explanation: `INT_MIN - INT_MAX` is signed overflow (UB); use `(a>b) - (a<b)` instead.
26. Q4: What does `signal(SIGINT, handler)` do?
27. A) Registers handler as the SIGINT callback (*)
28. B) Sends SIGINT to handler
29. C) Ignores SIGINT
30. D) Resets SIGINT to default
31. Explanation: signal() installs a function pointer to be called when the signal is delivered.
32. Q5: Are function pointers and data pointers guaranteed interchangeable in standard C?
33. A) Yes, always
34. B) No — only POSIX requires it (*)
35. C) Yes, since C11
36. D) Only on 64-bit
37. Explanation: Standard C leaves function-pointer-to-void* casts implementation-defined; POSIX guarantees interchangeability.
38. Q6: What is a dispatch table?
39. A) A hash table for strings
40. B) A list of goto labels
41. C) An array of function pointers indexed by command/opcode (*)
42. D) A switch statement in a struct
43. Explanation: A dispatch table maps names/opcodes to function pointers, replacing big switch statements with O(1) lookup.
44. Q7: What happens if you call through a NULL function pointer?
45. A) Returns 0
46. B) Compile error
47. C) Throws an exception
48. D) Undefined behavior, typically a segfault (*)
49. Explanation: Calling NULL is UB; on most platforms you jump to address 0 and segfault.
50. Q8: Why use typedef for function pointer types?
51. A) It dramatically improves readability (*)
52. B) It's required
53. C) It changes the type
54. D) It enables overloading
55. Explanation: `typedef int (*BinOp)(int,int);` then `BinOp fp;` is far cleaner than repeating the verbose syntax.
56. Q9: What is the Linux kernel's `struct file_operations`?
57. A) A struct of file paths
58. B) A struct of function pointers (open, read, write, ...) — the driver interface (*)
59. C) A list of open files
60. D) A typedef for FILE*
61. Explanation: file_operations is the kernel's vtable — every driver fills in the function pointers it implements.
62. Q10: What does `(a>b) - (a<b)` return for a=5, b=3?
63. A) -1
64. B) 0
65. C) 1 (*)
66. D) 2
67. Explanation: (5>3)=1, (5<3)=0, so 1-0=1; for a<b you get 0-1=-1; for equal, 0-0=0. Overflow-free comparator.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you declare a pointer to a function taking two ints and returning int?
  options:
    - "`int *fp(int, int);`"
    - "`int (*fp)(int, int);`"
    - "`int fp(*)(int, int);`"
    - "`(int*) fp(int, int);`"
  correctIndex: 1
  explanation: The parentheses around *fp are required; without them it's a function returning int*.
- id: q2
  question: What is the signature of qsort's comparator?
  options:
    - "`int (*)(int, int)`"
    - "`int (*)(void*, void*)`"
    - "`int (*)(const void*, const void*)`"
    - "`int (*)(const int*, const int*)`"
  correctIndex: 2
  explanation: qsort is generic; it passes const void* and expects <0, 0, or >0.
- id: q3
  question: Why is `return *a - *b;` a bad comparator for ints?
  options:
    - It's too slow
    - It returns the wrong sign
    - It only works for unsigned
    - It overflows for INT_MIN/INT_MAX
    - ; use `(a>b) - (a<b)` instead.
  correctIndex: 3
  explanation: "`INT_MIN - INT_MAX` is signed overflow (UB); use `(a>b) - (a<b)` instead."
- id: q4
  question: What does `signal(SIGINT, handler)` do?
  options:
    - Registers handler as the SIGINT callback
    - Sends SIGINT to handler
    - Ignores SIGINT
    - Resets SIGINT to default
  correctIndex: 0
  explanation: signal() installs a function pointer to be called when the signal is delivered.
- id: q5
  question: Are function pointers and data pointers guaranteed interchangeable in standard C?
  options:
    - Yes, always
    - No — only POSIX requires it
    - Yes, since C11
    - Only on 64-bit
  correctIndex: 1
  explanation: Standard C leaves function-pointer-to-void* casts implementation-defined; POSIX guarantees interchangeability.
- id: q6
  question: What is a dispatch table?
  options:
    - A hash table for strings
    - A list of goto labels
    - An array of function pointers indexed by command/opcode
    - A switch statement in a struct
  correctIndex: 2
  explanation: A dispatch table maps names/opcodes to function pointers, replacing big switch statements with O(1) lookup.
- id: q7
  question: What happens if you call through a NULL function pointer?
  options:
    - Returns 0
    - Compile error
    - Throws an exception
    - Undefined behavior, typically a segfault
  correctIndex: 3
  explanation: Calling NULL is UB; on most platforms you jump to address 0 and segfault.
- id: q8
  question: Why use typedef for function pointer types?
  options:
    - It dramatically improves readability
    - It's required
    - It changes the type
    - It enables overloading
  correctIndex: 0
  explanation: "`typedef int (*BinOp)(int,int);` then `BinOp fp;` is far cleaner than repeating the verbose syntax."
- id: q9
  question: What is the Linux kernel's `struct file_operations`?
  options:
    - A struct of file paths
    - A struct of function pointers (open, read, write, ...) — the driver interface
    - A list of open files
    - A typedef for FILE*
  correctIndex: 1
  explanation: file_operations is the kernel's vtable — every driver fills in the function pointers it implements.
- id: q10
  question: What does `(a>b) - (a<b)` return for a=5, b=3?
  options:
    - "-1"
    - "0"
    - "1"
    - "2"
  correctIndex: 2
  explanation: (5>3)=1, (5<3)=0, so 1-0=1; for a<b you get 0-1=-1; for equal, 0-0=0. Overflow-free comparator.
```

