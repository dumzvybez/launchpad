---
slug: c-pointers-fundamentals
id: c-06
track: c
order: 6
title: Pointers — The Fundamentals
description: Grasp what a pointer really is — an address into memory — and learn the address-of operator, dereference, NULL, and the difference between pointers and arrays.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=3400s
whyItMatters: Grasp what a pointer really is — an address into memory — and learn the address-of operator, dereference, NULL, and the difference between pointers and arrays.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Pointers — The Fundamentals

## Pointers — The Fundamentals

### Why It Matters

Grasp what a pointer really is — an address into memory — and learn the address-of operator, dereference, NULL, and the difference between pointers and arrays.

Grasp what a pointer really is — an address into memory — and learn the address-of operator, dereference, NULL, and the difference between pointers and arrays.

### Prerequisites

- Stage 1: Getting Started with C.
- Stage 2: Variables, Types, and Operators.
- Stage 4: Functions and Recursion (pass-by-value).
- Stage 5: Arrays and Strings (array decay).

### Topics

- Memory model: addresses, bytes, words
- The & (address-of) and * (dereference) operators
- Pointer declaration syntax: `int *p;`
- NULL, nullptr (C23), and null-pointer checks
- Pointer types and pointer compatibility
- Pointer assignment and aliasing
- const pointers: `const int *`, `int * const`, `const int * const`
- Pointer pitfalls: uninitialized pointers, dangling pointers, double-free

### Key Concepts

- A pointer is a variable holding a memory address.
- `int *p` reads as "p has type int*" — the * binds to the name in declarations, not the type.
- Dereferencing an invalid pointer (NULL, uninitialized, freed) is undefined behavior.
- Pointers have types so the compiler knows how many bytes to read/write on dereference.
- `const int *p` points at a read-only int; `int * const p` is a const pointer to a mutable int.
- Aliasing occurs when two pointers refer to the same memory — important for compiler optimization and bug-hunting.

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;            /* p holds the address of x */
    printf("x       = %d\n", x);
    printf("&x      = %p\n", (void*)&x);
    printf("p       = %p\n", (void*)p);
    printf("*p      = %d\n", *p);   /* dereference */
    *p = 99;                          /* modify x through p */
    printf("x now   = %d\n", x);    /* 99 */
    return 0;
}
```
Caption: Address-of and dereference

### Common Pitfalls

- Dereferencing an uninitialized pointer — `int *p; *p = 5;` writes to a random address; always initialize (to NULL or a valid address).
- Dereferencing NULL — `*NULL` is undefined behavior; almost always segfaults; check `if (p)` first.
- Forgetting to set a pointer to NULL after free — leaves a dangling pointer; `free(p); p = NULL;` is the safe pattern.
- Double-free — `free(p); free(p);` corrupts the heap allocator's metadata; some allocators abort, others silently corrupt.
- Confusing `const int *p` and `int * const p` — read declarations right-to-left: "p is a const pointer to int" vs "p is a pointer to const int".

### Real-World Applications

- Every C program uses pointers for output parameters; the Linux kernel's `copy_to_user(void __user *dst, const void *src, unsigned long n)` is a typed-pointer boundary.
- SQLite's prepared-statement API (sqlite3_prepare / sqlite3_step) takes `sqlite3_stmt**` — a pointer to a pointer — so the function can allocate and return the handle.
- libcurl returns response data via a callback `size_t write_cb(char *ptr, size_t size, size_t nmemb, void *userdata)` where userdata is an opaque pointer the caller chose.
- Redis's command dispatcher stores a `struct redisCommand *` table of name -> function-pointer entries.

### Interview Questions

- 1. What is a pointer in C? — A variable that holds the memory address of another object; dereferencing reads or writes the pointee.
- 2. What's the difference between `int *p` and `int* p`? — Syntactically identical; the * binds to the variable name in multi-declarations: `int *a, b;` makes a int* and b int.
- 3. What does dereferencing NULL do? — Undefined behavior; typically a segfault because low addresses are unmapped.
- 4. What is a dangling pointer? — A pointer whose pointee has been freed (or whose storage has been reclaimed); using it is UB.
- 5. Explain `const int * const p`. — A const pointer to a const int: you can neither change where p points nor modify *p.

### Mini Project

Build a Pointer Playground CLI: An interactive menu that lets the user (1) allocate an int and store its address, (2) read the value, (3) write a value, (4) free it and NULL the pointer. Suggested approach:
  - Maintain a single `int *p = NULL;` in main
  - Use fgets + sscanf to read a menu choice
  - On allocate, malloc(sizeof(int)) and store; on free, free(p) and set p = NULL
  - On read/write, check `if (!p)` and print an error
  - Use%p to print the pointer value for debugging

### Exercises

1. Declare an int, a pointer to it, and print both addresses and values; modify via the pointer.
2. Write a swap function using pointers; demonstrate it swaps two variables in main.
3. Demonstrate the four const combinations; verify which writes compile and which don't.
4. Cause an intentional null deref in a sandboxed program; observe the segfault.
5. Write a function `int *max(int *a, int *b)` that returns a pointer to the larger of the two.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does the & operator do?
9. A) Multiplies two values
10. B) Takes the address of a variable (*)
11. C) Logical AND
12. D) Bitwise AND
13. Explanation: In unary context, & is the address-of operator; in binary context it's bitwise AND.
14. Q2: What does `*p` do (when p is a pointer)?
15. A) Multiplies p by itself
16. B) Returns the address of p
17. C) Dereferences p — reads or writes the object p points at (*)
18. D) Converts p to an int
19. Explanation: In unary context, * is the indirection (dereference) operator; `*p` is the object p points at.
20. Q3: What is the type of `NULL` in C (pre-C23)?
21. A) `void *`
22. B) `char *`
23. C) `nullptr_t`
24. D) `int` (typically, via `#define NULL ((void*)0)`) (*)
25. Explanation: In C, NULL is often `((void*)0)`; C23 introduces nullptr and nullptr_t as a first-class null pointer constant.
26. Q4: What happens if you dereference an uninitialized pointer?
27. A) Undefined behavior — may segfault, may silently corrupt memory (*)
28. B) Always segfault
29. C) Always works
30. D) Compile error
31. Explanation: Uninitialized pointers hold garbage addresses; the result is UB, often a crash but sometimes silent corruption.
32. Q5: What is `const int *p`?
33. A) A const pointer to a mutable int
34. B) A mutable pointer to a const int (*)
35. C) A const pointer to a const int
36. D) A compile error
37. Explanation: Read right-to-left: "p is a pointer to int const" — you can change p, but not *p.
38. Q6: What is `int * const p`?
39. A) A mutable pointer to a const int
40. B) Both const
41. C) A const pointer to a mutable int (*)
42. D) Compile error
43. Explanation: Read right-to-left: "p is a const pointer to int" — you can change *p, but not p itself.
44. Q7: What is a dangling pointer?
45. A) A pointer to a function
46. B) A pointer with no type
47. C) A pointer that has been cast to void*
48. D) A pointer to freed memory (or a reclaimed stack frame) (*)
49. Explanation: A dangling pointer references memory that has been freed or gone out of scope; using it is UB.
50. Q8: What is the safe pattern after `free(p);`?
51. A) Set p = NULL; (*)
52. B) Leave p as-is for the next malloc
53. C) Set p = -1;
54. D) Set p = 0xDEADBEEF;
55. Explanation: Setting p = NULL makes a subsequent accidental dereference crash deterministically rather than corrupt memory.
56. Q9: What is double-free?
57. A) Freeing two different pointers
58. B) Calling free() on the same pointer twice (*)
59. C) Calling free() on NULL
60. D) Calling free() on a stack pointer
61. Explanation: free(p) twice corrupts the allocator's metadata; glibc usually aborts with "double free or corruption".
62. Q10: In `int *a, b;`, what is the type of b?
63. A) int *
64. B) int
65. C) int (*)
66. D) int (just int, not a pointer)
67. Explanation: The * binds to the name `a`, not the type; `b` is a plain int. Use `int *a, *b;` to make both pointers.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the & operator do?
  options:
    - Multiplies two values
    - Takes the address of a variable
    - Logical AND
    - Bitwise AND
  correctIndex: 1
  explanation: In unary context, & is the address-of operator; in binary context it's bitwise AND.
- id: q2
  question: What does `*p` do (when p is a pointer)?
  options:
    - Multiplies p by itself
    - Returns the address of p
    - Dereferences p — reads or writes the object p points at
    - Converts p to an int
  correctIndex: 2
  explanation: In unary context, * is the indirection (dereference) operator; `*p` is the object p points at.
- id: q3
  question: What is the type of `NULL` in C (pre-C23)?
  options:
    - "`void *`"
    - "`char *`"
    - "`nullptr_t`"
    - "`int` (typically, via `#define NULL ((void*)0)`)"
  correctIndex: 3
  explanation: In C, NULL is often `((void*)0)`; C23 introduces nullptr and nullptr_t as a first-class null pointer constant.
- id: q4
  question: What happens if you dereference an uninitialized pointer?
  options:
    - Undefined behavior — may segfault, may silently corrupt memory
    - Always segfault
    - Always works
    - Compile error
  correctIndex: 0
  explanation: Uninitialized pointers hold garbage addresses; the result is UB, often a crash but sometimes silent corruption.
- id: q5
  question: What is `const int *p`?
  options:
    - A const pointer to a mutable int
    - A mutable pointer to a const int
    - A const pointer to a const int
    - A compile error
  correctIndex: 1
  explanation: 'Read right-to-left: "p is a pointer to int const" — you can change p, but not *p.'
- id: q6
  question: What is `int * const p`?
  options:
    - A mutable pointer to a const int
    - Both const
    - A const pointer to a mutable int
    - Compile error
  correctIndex: 2
  explanation: 'Read right-to-left: "p is a const pointer to int" — you can change *p, but not p itself.'
- id: q7
  question: What is a dangling pointer?
  options:
    - A pointer to a function
    - A pointer with no type
    - A pointer that has been cast to void*
    - A pointer to freed memory (or a reclaimed stack frame)
  correctIndex: 3
  explanation: A dangling pointer references memory that has been freed or gone out of scope; using it is UB.
- id: q8
  question: What is the safe pattern after `free(p);`?
  options:
    - Set p = NULL;
    - Leave p as-is for the next malloc
    - Set p = -1;
    - Set p = 0xDEADBEEF;
  correctIndex: 0
  explanation: Setting p = NULL makes a subsequent accidental dereference crash deterministically rather than corrupt memory.
- id: q9
  question: What is double-free?
  options:
    - Freeing two different pointers
    - Calling free() on the same pointer twice
    - Calling free() on NULL
    - Calling free() on a stack pointer
  correctIndex: 1
  explanation: free(p) twice corrupts the allocator's metadata; glibc usually aborts with "double free or corruption".
- id: q10
  question: In `int *a, b;`, what is the type of b?
  options:
    - int *
    - int
    - int
    - int (just int, not a pointer)
  correctIndex: 2
  explanation: The * binds to the name `a`, not the type; `b` is a plain int. Use `int *a, *b;` to make both pointers.
```

