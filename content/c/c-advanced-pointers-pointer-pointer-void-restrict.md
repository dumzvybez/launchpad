---
slug: c-advanced-pointers-pointer-pointer-void-restrict
id: c-16
track: c
order: 16
title: Advanced Pointers — Pointer to Pointer, void*, restrict
description: Tackle the pointer patterns that scare beginners — pointer-to-pointer, void* genericity, and the restrict qualifier for optimization.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=10400s
whyItMatters: Tackle the pointer patterns that scare beginners — pointer-to-pointer, void* genericity, and the restrict qualifier for optimization.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Advanced Pointers — Pointer to Pointer, void*, restrict

## Advanced Pointers — Pointer to Pointer, void*, restrict

### Why It Matters

Tackle the pointer patterns that scare beginners — pointer-to-pointer, void* genericity, and the restrict qualifier for optimization.

Tackle the pointer patterns that scare beginners — pointer-to-pointer, void* genericity, and the restrict qualifier for optimization.

### Prerequisites

- Stage 6: Pointers.
- Stage 7: Pointer Arithmetic and Arrays.
- Stage 8: Dynamic Memory.
- Stage 10: Function Pointers.

### Topics

- Pointer to pointer: `int **pp;`
- Modifying a caller's pointer via `T **` out-params
- void* as a generic pointer
- Casting void* to typed pointers
- restrict qualifier (C99)
- strict aliasing rule
- _Generic type dispatch (C11)
- Compound literals and array-of-pointer patterns

### Key Concepts

- A `T **` is a pointer to a `T *` — used to let a function modify the caller's pointer (e.g., to allocate or realloc it).
- void* is a generic pointer that can hold any object address; you cast to dereference.
- void* arithmetic is non-standard (GCC extension); cast to char* for byte arithmetic.
- restrict tells the compiler that a pointer is the only way to access a region — enables vectorization but UB if violated.
- Strict aliasing: two pointers of different types don't alias (with exceptions for char* and signed/unsigned variants).
- _Generic lets you write type-dispatched macros (a poor man's overloading).

```c
#include <stdio.h>
#include <stdlib.h>

static int make_array(int **out, size_t n) {
    int *a = malloc(n * sizeof(int));
    if (!a) return -1;
    for (size_t i = 0; i < n; i++) a[i] = (int)i;
    *out = a;            /* write to caller's pointer */
    return 0;
}

int main(void) {
    int *arr = NULL;
    if (make_array(&arr, 5) == 0) {
        printf("arr[3] = %d\n", arr[3]);   /* 3 */
        free(arr);
    }
    return 0;
}
```
Caption: Pointer to pointer: out-param allocation

### Common Pitfalls

- Strict aliasing violation — `int *i; float *f = (float*)i; *f = 1.0f;` is UB; use memcpy to type-pun safely.
- Violating restrict — if two restrict pointers alias, behavior is undefined; the compiler may vectorize incorrectly.
- Casting void* to a function pointer — not portable in standard C (only POSIX guarantees it); use a union or a specific function-pointer type.
- Forgetting to dereference `T **` — `*pp` is the inner pointer; `**pp` is the value; mixing them up causes type errors or crashes.
- Returning `&local` through a T** out-param — the caller's pointer now points to a freed stack frame; the out-param must point to something whose lifetime exceeds the call.

### Real-World Applications

- SQLite's sqlite3_prepare_v2 takes `sqlite3_stmt **ppStmt` so it can allocate and return the prepared-statement handle.
- glibc's qsort uses void* + element size + comparator to sort any type — the canonical C generic pattern.
- BLAS routines (daxpy, dgemm) use restrict pointers to enable auto-vectorization of inner loops.
- The Linux kernel's `__builtin_memcpy` and `container_of` macros rely on void* and typeof for type-safe genericity.

### Interview Questions

- 1. What's the use of `int **`? — To let a function modify the caller's int*: allocating, reallocating, or reassigning the caller's pointer.
- 2. What can you do with a void*? — Hold any object pointer; cast to a typed pointer to dereference; arithmetic is non-standard.
- 3. What does restrict promise? — That within the function's scope, the pointed-to memory is accessed only through that pointer; enables optimization.
- 4. What is the strict aliasing rule? — Two pointers of incompatible types don't alias (with exceptions for char* and signed/unsigned variants); violating it is UB.
- 5. How does _Generic work? — A compile-time switch on a type; the macro expands to one of several expressions based on the type of its argument.

### Mini Project

Build a Generic Vector Library: A vector that holds any type via void* and element size. Suggested approach:
  - `typedef struct { void *data; size_t len, cap, sz; } Vec;`
  - vec_init(Vec*, size_t sz) — store element size
  - vec_push(Vec*, const void *item) — memcpy item into the array, growing with realloc
  - vec_get(Vec*, size_t i, void *out) — memcpy out
  - Test with int, double, and a struct Point

### Exercises

1. Write a function `int alloc_str(char **out, const char *src)` that mallocs and copies src.
2. Implement a generic swap(void*, void*, size_t) using a small stack buffer.
3. Mark the pointers in a vector_add function with restrict; benchmark vs unmarked.
4. Use _Generic to print int, double, char*, and a default case.
5. Demonstrate strict aliasing: cast int* to float* and write; observe -O2 producing surprising results.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the type of `int **pp`?
9. A) A pointer to an int
10. B) An array of ints
11. C) A 2D array
12. D) A pointer to a pointer to an int (*)
13. Explanation: `int **pp` is a pointer whose pointee is itself an `int *`; used for out-params that allocate or reassign a caller's pointer.
14. Q2: What does `void *` allow?
15. A) Holding any object pointer (*)
16. B) Arithmetic on any type
17. C) Direct dereference
18. D) Function pointers
19. Explanation: void* is a generic object pointer; you must cast before dereferencing. Arithmetic on void* is a GNU extension.
20. Q3: What does `restrict` promise?
21. A) The pointer is const
22. B) The pointer is the only way to access the pointed-to memory in the function's scope (*)
23. C) The pointer is non-null
24. D) The pointer is aligned
25. Explanation: restrict asserts no aliasing, enabling vectorization; violating it is UB.
26. Q4: What is the strict aliasing rule?
27. A) Two pointers must always alias
28. B) Pointers can't be cast
29. C) Two pointers of incompatible types do not alias (with exceptions for char*) (*)
30. D) void* aliases everything
31. Explanation: Strict aliasing lets the compiler assume `int*` and `float*` don't alias; type-punning via cast is UB (use memcpy).
32. Q5: What does _Generic do?
33. A) Runtime type dispatch
34. B) Generic functions
35. C) Reflection
36. D) Compile-time type dispatch in macros (*)
37. Explanation: _Generic (C11) chooses one of several expressions at compile time based on the type of its controlling expression.
38. Q6: Why is casting `void*` to a function pointer non-portable?
39. A) Function pointers have different sizes than data pointers on some platforms (*)
40. B) Casting is illegal
41. C) void* doesn't exist
42. D) Function pointers are deprecated
43. Explanation: Standard C leaves data-pointer-to-function-pointer casts implementation-defined; POSIX guarantees interchangeability.
44. Q7: What's the safe way to type-pun an int as a float?
45. A) `(float)i`
46. B) `memcpy(&f, &i, sizeof f)` (*)
47. C) `*(float*)&i` (strict aliasing violation)
48. D) `union { int i; float f; } u; u.i = i; return u.f;` is also OK in C99+
49. Explanation: memcpy is the portable, aliasing-safe way; the union trick is also explicitly allowed in C99+.
50. Q8: What does `*pp` give you when pp is `int **`?
51. A) An int
52. B) An int **
53. C) An int * (*)
54. D) A void *
55. Explanation: One dereference strips one level of pointer; `*pp` is the inner `int *`, and `**pp` is the int.
56. Q9: What's the danger of returning `&local` through a `T **` out-param?
57. A) Nothing — the caller copies the value
58. B) Compile error
59. C) Slow
60. D) The caller's pointer points to a freed stack frame — dangling pointer (*)
61. Explanation: The local goes out of scope when the function returns; the caller's pointer is now dangling.
62. Q10: Which standard introduced _Generic?
63. A) C11 (*)
64. B) C99
65. C) C17
66. D) C23
67. Explanation: _Generic was added in C11; it's the basis for type-generic macros like the tgmath.h replacements.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the type of `int **pp`?
  options:
    - A pointer to an int
    - An array of ints
    - A 2D array
    - A pointer to a pointer to an int
  correctIndex: 3
  explanation: "`int **pp` is a pointer whose pointee is itself an `int *`; used for out-params that allocate or reassign a caller's pointer."
- id: q2
  question: What does `void *` allow?
  options:
    - Holding any object pointer
    - Arithmetic on any type
    - Direct dereference
    - Function pointers
  correctIndex: 0
  explanation: void* is a generic object pointer; you must cast before dereferencing. Arithmetic on void* is a GNU extension.
- id: q3
  question: What does `restrict` promise?
  options:
    - The pointer is const
    - The pointer is the only way to access the pointed-to memory in the function's scope
    - The pointer is non-null
    - The pointer is aligned
  correctIndex: 1
  explanation: restrict asserts no aliasing, enabling vectorization; violating it is UB.
- id: q4
  question: What is the strict aliasing rule?
  options:
    - Two pointers must always alias
    - Pointers can't be cast
    - Two pointers of incompatible types do not alias (with exceptions for char*)
    - void* aliases everything
  correctIndex: 2
  explanation: Strict aliasing lets the compiler assume `int*` and `float*` don't alias; type-punning via cast is UB (use memcpy).
- id: q5
  question: What does _Generic do?
  options:
    - Runtime type dispatch
    - Generic functions
    - Reflection
    - Compile-time type dispatch in macros
  correctIndex: 3
  explanation: _Generic (C11) chooses one of several expressions at compile time based on the type of its controlling expression.
- id: q6
  question: Why is casting `void*` to a function pointer non-portable?
  options:
    - Function pointers have different sizes than data pointers on some platforms
    - Casting is illegal
    - void* doesn't exist
    - Function pointers are deprecated
  correctIndex: 0
  explanation: Standard C leaves data-pointer-to-function-pointer casts implementation-defined; POSIX guarantees interchangeability.
- id: q7
  question: What's the safe way to type-pun an int as a float?
  options:
    - "`(float)i`"
    - "`memcpy(&f, &i, sizeof f)`"
    - "`*(float*)&i` (strict aliasing violation)"
    - "`union { int i; float f; } u; u.i = i; return u.f;` is also OK in C99+"
  correctIndex: 1
  explanation: memcpy is the portable, aliasing-safe way; the union trick is also explicitly allowed in C99+.
- id: q8
  question: What does `*pp` give you when pp is `int **`?
  options:
    - An int
    - An int **
    - An int *
    - A void *
  correctIndex: 2
  explanation: One dereference strips one level of pointer; `*pp` is the inner `int *`, and `**pp` is the int.
- id: q9
  question: What's the danger of returning `&local` through a `T **` out-param?
  options:
    - Nothing — the caller copies the value
    - Compile error
    - Slow
    - The caller's pointer points to a freed stack frame — dangling pointer
  correctIndex: 3
  explanation: The local goes out of scope when the function returns; the caller's pointer is now dangling.
- id: q10
  question: Which standard introduced _Generic?
  options:
    - C11
    - C99
    - C17
    - C23
  correctIndex: 0
  explanation: _Generic was added in C11; it's the basis for type-generic macros like the tgmath.h replacements.
```

