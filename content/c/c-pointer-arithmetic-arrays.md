---
slug: c-pointer-arithmetic-arrays
id: c-07
track: c
order: 7
title: Pointer Arithmetic and Arrays
description: Use pointer arithmetic to traverse arrays, understand why `arr[i]` is defined as `*(arr + i)`, and learn the relationship between pointers, arrays, and multi-dimensional layouts.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=4100s
whyItMatters: Use pointer arithmetic to traverse arrays, understand why `arr[i]` is defined as `*(arr + i)`, and learn the relationship between pointers, arrays, and multi-dimensional layouts.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Pointer Arithmetic and Arrays

## Pointer Arithmetic and Arrays

### Why It Matters

Use pointer arithmetic to traverse arrays, understand why `arr[i]` is defined as `*(arr + i)`, and learn the relationship between pointers, arrays, and multi-dimensional layouts.

Use pointer arithmetic to traverse arrays, understand why `arr[i]` is defined as `*(arr + i)`, and learn the relationship between pointers, arrays, and multi-dimensional layouts.

### Prerequisites

- Stage 5: Arrays and Strings.
- Stage 6: Pointers — The Fundamentals.

### Topics

- Pointer arithmetic rules: p + n, p - n, p - q
- Pointer scaling: p + n advances by n * sizeof(*p) bytes
- Array indexing defined as *(a + i)
- Pointer subtraction and ptrdiff_t
- Pointer comparison and the one-past-the-end rule
- Multidimensional arrays: row-major layout
- Pointer to array vs array of pointers
- Iterating with pointers vs indices

### Key Concepts

- Pointer arithmetic scales by the size of the pointed-to type — `p + 1` advances by sizeof(*p) bytes.
- `arr[i]` is defined as `*(arr + i)`, and `i[arr]` is legal (but ugly) for the same reason.
- Subtracting two pointers into the same array yields a ptrdiff_t (signed).
- Comparing pointers from different objects is undefined behavior.
- One-past-the-end (`arr + n`) is a valid pointer for comparison but not for dereference.
- A 2D array `int m[3][4]` is a single 12-int block in row-major order; `m[i][j]` is `*(*(m + i) + j)`.

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;             /* points at arr[0] */
    int *q = arr + 3;         /* points at arr[3] */

    printf("p   = %p, *p = %d\n", (void*)p, *p);
    printf("p+1 = %p, *(p+1) = %d\n", (void*)(p+1), *(p+1));
    printf("q - p = %td (ptrdiff_t)\n", q - p);   /* 3 */
    return 0;
}
```
Caption: Pointer arithmetic scaling

### Common Pitfalls

- Out-of-bounds via off-by-one — `for (i=0; i<=n; i++) arr[i]` writes past the end; use `i < n`.
- Comparing pointers from different objects — `&a < &b` for unrelated arrays is UB; only same-array comparisons are defined.
- Dereferencing one-past-the-end — `*(arr + n)` is UB; the pointer is valid only for comparison.
- Pointer arithmetic on void* — `void *p; p + 1;` is a GCC extension, not standard C; cast to char* first.
- Treating a 2D array as `int **` — `int m[3][4]` does NOT decay to `int **`; it decays to `int (*)[4]`. Mismatched types cause crashes.

### Real-World Applications

- The Linux kernel's list.h uses pointer arithmetic on `struct list_head *` offsets (`container_of` macro) to recover the enclosing struct from a member pointer.
- glibc's bsearch and qsort take `void *base, size_t nmemb, size_t size` and use byte arithmetic (via char*) to access each element.
- SQLite's pager uses pointer arithmetic over memory-mapped pages for O(1) page lookup in its cache.
- BLAS/LAPACK implement matrix operations with pointer-arithmetic inner loops to maximize cache locality.

### Interview Questions

- 1. Why is `arr[i]` defined as `*(arr + i)`? — So the same syntax works for arrays and pointers; the index scales by sizeof(*arr) automatically.
- 2. What does `p - q` give you when both point into the same array? — A ptrdiff_t (signed) count of elements between them.
- 3. Is `i[arr]` legal? — Yes, because `i[arr]` is `*(i + arr)` is `*(arr + i)` is `arr[i]`; it compiles but is bad style.
- 4. What is one-past-the-end? — A pointer to position N of an N-element array; valid for comparison but not dereference.
- 5. Why doesn't `int m[3][4]` decay to `int **`? — A 2D array decays to a pointer to its first row (`int (*)[4]`), preserving the row size for the next indexing step.

### Mini Project

Build a Generic Array Sum: A function `long long array_sum(const void *base, size_t n, size_t sz)` that sums an array of any numeric type using char* arithmetic. Suggested approach:
  - Use `const char *p = base;` and `p += sz;` to advance one element
  - Detect element width (1, 2, 4, 8 bytes) and cast appropriately
  - Sum as long long to avoid overflow for char/short/int arrays
  - Test with int, double (cast to double, return as long long rounded), short arrays
  - Print results for each test case

### Exercises

1. Implement strlen using only pointer arithmetic (no indexing).
2. Write `int *find(int *begin, int *end, int target)` returning a pointer to the first match or end.
3. Reverse an array in place using two pointers (one from each end).
4. Demonstrate that `arr[i]` and `i[arr]` produce the same value.
5. Print a 3x4 2D array using both `m[i][j]` and `*(*(m+i)+j)` syntax.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: If `int *p = arr;`, what is the byte address of `p + 1`?
9. A) p + 1 byte
10. B) p + 4 bytes always
11. C) p + sizeof(int) bytes (*)
12. D) Implementation-defined
13. Explanation: Pointer arithmetic scales by sizeof(*p); for int* on most platforms, p+1 advances by 4 bytes.
14. Q2: How is `arr[i]` defined?
15. A) `arr + i`
16. B) `&arr[i]`
17. C) `arr[i] + 0`
18. D) `*(arr + i)` (*)
19. Explanation: Indexing is defined as dereference of pointer-plus-offset: `arr[i]` is `*(arr + i)`.
20. Q3: What does `p - q` yield for two pointers into the same array?
21. A) An element count (ptrdiff_t) (*)
22. B) A byte count
23. C) A void *
24. D) Undefined behavior
25. Explanation: Pointer subtraction yields a signed ptrdiff_t element count; print with %td.
26. Q4: Which pointer is valid for comparison but NOT for dereference?
27. A) The first element
28. B) One-past-the-end (*)
29. C) The middle element
30. D) NULL
31. Explanation: `arr + n` (one past the end) is a valid pointer for comparison (`p != end`) but dereferencing it is UB.
32. Q5: What is `int m[3][4]`'s decayed type?
33. A) `int **`
34. B) `int *[4]`
35. C) `int (*)[4]` — pointer to array of 4 ints (*)
36. D) `int *`
37. Explanation: A 2D array decays to a pointer to its first row, preserving the inner dimension for the next index.
38. Q6: Is pointer arithmetic on `void *` standard C?
39. A) Yes, always
40. B) Yes, since C11
41. C) Only in C23
42. D) No — it's a GCC extension; cast to char* first (*)
43. Explanation: void has no size, so void* arithmetic is a GNU extension; standard C requires casting to char* for byte arithmetic.
44. Q7: Is comparing `&a[0]` and `&b[0]` (two unrelated arrays) defined?
45. A) No — undefined behavior (*)
46. B) Yes — pointers are just addresses
47. C) Yes, but the result is unspecified
48. D) Only if both arrays are the same size
49. Explanation: Pointer comparison is only defined for pointers into (or one-past) the same array.
50. Q8: What is `i[arr]` (where i is an int)?
51. A) Syntax error
52. B) Equivalent to `arr[i]` (*)
53. C) Equivalent to `&arr[i]`
54. D) Equivalent to `arr + i`
55. Explanation: `i[arr]` is `*(i + arr)` is `*(arr + i)` is `arr[i]`; legal but bad style.
56. Q9: How is a 3x4 array `int m[3][4]` laid out in memory?
57. A) Column-major (4 rows of 3)
58. B) Pointer to 3 separate arrays
59. C) Row-major (3 rows of 4, contiguous) (*)
60. D) Implementation-defined
61. Explanation: C stores 2D arrays in row-major order as a single contiguous block of 12 ints.
62. Q10: What does the `container_of` macro use to recover an enclosing struct?
63. A) memcpy
64. B) A hash table
65. C) RTTI
66. D) Pointer subtraction and offsetof (*)
67. Explanation: container_of(ptr, type, member) computes the enclosing address by subtracting offsetof(type, member) from ptr.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: If `int *p = arr;`, what is the byte address of `p + 1`?
  options:
    - p + 1 byte
    - p + 4 bytes always
    - p + sizeof(int) bytes
    - Implementation-defined
  correctIndex: 2
  explanation: Pointer arithmetic scales by sizeof(*p); for int* on most platforms, p+1 advances by 4 bytes.
- id: q2
  question: How is `arr[i]` defined?
  options:
    - "`arr + i`"
    - "`&arr[i]`"
    - "`arr[i] + 0`"
    - "`*(arr + i)`"
  correctIndex: 3
  explanation: "Indexing is defined as dereference of pointer-plus-offset: `arr[i]` is `*(arr + i)`."
- id: q3
  question: What does `p - q` yield for two pointers into the same array?
  options:
    - An element count (ptrdiff_t)
    - A byte count
    - A void *
    - Undefined behavior
  correctIndex: 0
  explanation: Pointer subtraction yields a signed ptrdiff_t element count; print with %td.
- id: q4
  question: Which pointer is valid for comparison but NOT for dereference?
  options:
    - The first element
    - One-past-the-end
    - The middle element
    - "NULL"
  correctIndex: 1
  explanation: "`arr + n` (one past the end) is a valid pointer for comparison (`p != end`) but dereferencing it is UB."
- id: q5
  question: What is `int m[3][4]`'s decayed type?
  options:
    - "`int **`"
    - "`int *[4]`"
    - "`int (*)[4]` — pointer to array of 4 ints"
    - "`int *`"
  correctIndex: 2
  explanation: A 2D array decays to a pointer to its first row, preserving the inner dimension for the next index.
- id: q6
  question: Is pointer arithmetic on `void *` standard C?
  options:
    - Yes, always
    - Yes, since C11
    - Only in C23
    - No — it's a GCC extension; cast to char* first
  correctIndex: 3
  explanation: void has no size, so void* arithmetic is a GNU extension; standard C requires casting to char* for byte arithmetic.
- id: q7
  question: Is comparing `&a[0]` and `&b[0]` (two unrelated arrays) defined?
  options:
    - No — undefined behavior
    - Yes — pointers are just addresses
    - Yes, but the result is unspecified
    - Only if both arrays are the same size
  correctIndex: 0
  explanation: Pointer comparison is only defined for pointers into (or one-past) the same array.
- id: q8
  question: What is `i[arr]` (where i is an int)?
  options:
    - Syntax error
    - Equivalent to `arr[i]`
    - Equivalent to `&arr[i]`
    - Equivalent to `arr + i`
  correctIndex: 1
  explanation: "`i[arr]` is `*(i + arr)` is `*(arr + i)` is `arr[i]`; legal but bad style."
- id: q9
  question: How is a 3x4 array `int m[3][4]` laid out in memory?
  options:
    - Column-major (4 rows of 3)
    - Pointer to 3 separate arrays
    - Row-major (3 rows of 4, contiguous)
    - Implementation-defined
  correctIndex: 2
  explanation: C stores 2D arrays in row-major order as a single contiguous block of 12 ints.
- id: q10
  question: What does the `container_of` macro use to recover an enclosing struct?
  options:
    - memcpy
    - A hash table
    - RTTI
    - Pointer subtraction and offsetof
  correctIndex: 3
  explanation: container_of(ptr, type, member) computes the enclosing address by subtracting offsetof(type, member) from ptr.
```

