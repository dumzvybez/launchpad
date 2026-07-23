---
slug: c-dynamic-memory-malloc-calloc-realloc-free
id: c-08
track: c
order: 8
title: Dynamic Memory — malloc, calloc, realloc, free
description: Manage the heap yourself — allocate with malloc/calloc, resize with realloc, free with free — and learn the rules that prevent leaks, double-free, and use-after-free.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=4800s
whyItMatters: Manage the heap yourself — allocate with malloc/calloc, resize with realloc, free with free — and learn the rules that prevent leaks, double-free, and use-after-free.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Dynamic Memory — malloc, calloc, realloc, free

## Dynamic Memory — malloc, calloc, realloc, free

### Why It Matters

Manage the heap yourself — allocate with malloc/calloc, resize with realloc, free with free — and learn the rules that prevent leaks, double-free, and use-after-free.

Manage the heap yourself — allocate with malloc/calloc, resize with realloc, free with free — and learn the rules that prevent leaks, double-free, and use-after-free.

### Prerequisites

- Stage 6: Pointers.
- Stage 7: Pointer Arithmetic and Arrays.

### Topics

- The stack vs the heap
- malloc, calloc, realloc, free prototypes in <stdlib.h>
- Allocation failure: malloc returns NULL on OOM
- The realloc contract: may move the data, may return a new pointer
- Memory leaks — allocated but never freed
- Use-after-free and double-free
- calloc zero-initialization guarantee
- valgrind and ASan for finding leaks and corruption

### Key Concepts

- Stack memory is automatic (freed on return); heap memory is manual (you call free).
- malloc returns uninitialized memory; calloc returns zero-initialized memory.
- realloc(p, n) may move the block — copy your old data using the OLD size, then free the old pointer (realloc does this for you if it moves).
- free(NULL) is safe and a no-op.
- A memory leak is allocated memory that is no longer reachable; long-running daemons must not leak.
- Use-after-free and double-free are UB; valgrind and ASan catch them deterministically.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = malloc(5 * sizeof(int));   /* 20 bytes */
    if (!arr) {
        perror("malloc");
        return 1;
    }
    for (int i = 0; i < 5; i++) arr[i] = i * i;
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    putchar('\n');
    free(arr);          /* return to allocator */
    arr = NULL;          /* defensive — prevent use-after-free */
    return 0;
}
```
Caption: malloc and free

### Common Pitfalls

- Not checking malloc's return — malloc may return NULL on OOM or on huge sizes; always check before dereferencing.
- Memory leak — every malloc/calloc/realloc must be paired with a free on every code path, including error paths.
- Use-after-free — `free(p); printf("%d\n", *p);` is UB; tools like ASan catch this in tests.
- Wrong size in malloc — `malloc(n)` instead of `malloc(n * sizeof(int))` allocates too few bytes; use `malloc(n * sizeof(*p))` to scale with p's type.
- realloc misuse — `p = realloc(p, n);` leaks if realloc fails (the original block is still allocated); use a temporary pointer.

### Real-World Applications

- Redis uses jemalloc (a custom allocator) for fragmentation-resistant allocation of string and list objects under heavy churn.
- nginx pools per-request allocations and frees the whole pool at request end — O(1) cleanup, no per-object free.
- SQLite's memory allocator accepts a pluggable backend (sqlite3_mem_methods) so embedded systems can use static pools.
- The Linux kernel uses kmalloc/kfree with GFP flags for kernel heap; vmalloc for virtually-contiguous regions.

### Interview Questions

- 1. What's the difference between malloc and calloc? — malloc returns uninitialized memory; calloc(n, sz) returns zero-initialized memory of n*sz bytes and checks for multiplication overflow.
- 2. What happens if realloc fails? — It returns NULL and leaves the original block intact; you must NOT overwrite the original pointer until you've checked the result.
- 3. What is a memory leak? — Memory allocated but never freed, while no longer reachable; long-running processes accumulate leaks and crash with OOM.
- 4. What is use-after-free? — Accessing memory after it has been freed; the allocator may have reused the block, causing silent corruption.
- 5. How do you find a memory leak in C? — Compile with -g and run under valgrind --leak-check=full, or link with -fsanitize=address and run the program.

### Mini Project

Build a Dynamic Int Vector: A small vector library with `vec *vec_new(void)`, `vec_push(vec*, int)`, `vec_pop(vec*)`, `vec_free(vec*)`. Suggested approach:
  - Define `typedef struct { int *data; size_t len, cap; } vec;`
  - vec_new allocates the struct and a small initial data array
  - vec_push grows capacity with realloc when len == cap (use the temp-pointer pattern)
  - vec_pop returns the last element and decrements len (does not shrink)
  - vec_free frees data then the struct; document that the caller must not use the pointer after

### Exercises

1. Allocate a 1000-int array with malloc, fill it with random numbers, then free it.
2. Modify the program to use calloc and verify all elements start at 0.
3. Write a growable string buffer using realloc; concatenate 100 random strings into it.
4. Cause an intentional leak and detect it with valgrind --leak-check=full.
5. Cause an intentional use-after-free and detect it with -fsanitize=address.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does malloc return if allocation fails?
9. A) A pointer to a 0-byte block
10. B) A pointer to uninitialized memory
11. C) It aborts the program
12. D) NULL (*)
13. Explanation: malloc returns NULL on failure; you must check before dereferencing.
14. Q2: What is the difference between malloc and calloc?
15. A) calloc zero-initializes the memory (*)
16. B) calloc is faster
17. C) malloc zero-initializes the memory
18. D) calloc is for chars only
19. Explanation: calloc(n, sz) returns zero-initialized memory and checks for n*sz overflow; malloc returns uninitialized bytes.
20. Q3: What happens if realloc fails to grow the block?
21. A) The original block is freed and NULL is returned
22. B) The original block is unchanged and NULL is returned (*)
23. C) The original block is partially freed
24. D) The program aborts
25. Explanation: realloc returns NULL on failure and leaves the original block intact; never assign directly over the original pointer.
26. Q4: What is `free(NULL)`?
27. A) Undefined behavior
28. B) A crash
29. C) A safe no-op (*)
30. D) Compile error
31. Explanation: free(NULL) is explicitly defined as a no-op by the C standard, so you can call it unconditionally.
32. Q5: What is a memory leak?
33. A) Memory that is freed twice
34. B) Memory that holds uninitialized data
35. C) Memory that has been corrupted
36. D) Allocated memory that is no longer reachable but never freed (*)
37. Explanation: A leak is allocated-but-unreachable memory; long-running processes eventually exhaust available memory.
38. Q6: What is the safe realloc pattern?
39. A) `tmp = realloc(p, new_size); if (tmp) p = tmp;` (*)
40. B) `p = realloc(p, new_size);`
41. C) `realloc(p, 0);`
42. D) `free(p); p = malloc(new_size);`
43. Explanation: Using a temp pointer preserves the original block on realloc failure; assign only after success.
44. Q7: Which sanitizer catches use-after-free at runtime?
45. A) -fsanitize=undefined
46. B) -fsanitize=address (*)
47. C) -fsanitize=thread
48. D) -fsanitize=memory
49. Explanation: AddressSanitizer (ASan) instruments every memory access and reports use-after-free, double-free, and buffer overflows.
50. Q8: Why prefer `malloc(n * sizeof(*p))` over `malloc(n * sizeof(int))`?
51. A) It's faster
52. B) It avoids overflow
53. C) It auto-adapts if p's type changes (*)
54. D) It zero-initializes
55. Explanation: sizeof(*p) ties the size to p's type, so refactoring p to long* doesn't silently under-allocate.
56. Q9: What does valgrind --leak-check=full report?
57. A) Compile-time warnings
58. B) CPU cache misses
59. C) Thread race conditions
60. D) Memory leaks and their allocation sites (*)
61. Explanation: valgrind's Memcheck tracks every malloc/free and reports definitely-lost blocks with stack traces.
62. Q10: What is double-free?
63. A) Calling free(p) twice on the same allocation (*)
64. B) Calling free(p) where p is NULL
65. C) Calling free() from two threads
66. D) Calling free() on a stack pointer
67. Explanation: Double-free corrupts allocator metadata; glibc usually aborts with "double free or corruption".
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does malloc return if allocation fails?
  options:
    - A pointer to a 0-byte block
    - A pointer to uninitialized memory
    - It aborts the program
    - "NULL"
  correctIndex: 3
  explanation: malloc returns NULL on failure; you must check before dereferencing.
- id: q2
  question: What is the difference between malloc and calloc?
  options:
    - calloc zero-initializes the memory
    - calloc is faster
    - malloc zero-initializes the memory
    - calloc is for chars only
  correctIndex: 0
  explanation: calloc(n, sz) returns zero-initialized memory and checks for n*sz overflow; malloc returns uninitialized bytes.
- id: q3
  question: What happens if realloc fails to grow the block?
  options:
    - The original block is freed and NULL is returned
    - The original block is unchanged and NULL is returned
    - The original block is partially freed
    - The program aborts
  correctIndex: 1
  explanation: realloc returns NULL on failure and leaves the original block intact; never assign directly over the original pointer.
- id: q4
  question: What is `free(NULL)`?
  options:
    - "`?"
    - Undefined behavior
    - A crash
    - A safe no-op
    - Compile error
    - is explicitly defined as a no-op by the C standard, so you can call it unconditionally.
  correctIndex: 3
  explanation: free(NULL) is explicitly defined as a no-op by the C standard, so you can call it unconditionally.
- id: q5
  question: What is a memory leak?
  options:
    - Memory that is freed twice
    - Memory that holds uninitialized data
    - Memory that has been corrupted
    - Allocated memory that is no longer reachable but never freed
  correctIndex: 3
  explanation: A leak is allocated-but-unreachable memory; long-running processes eventually exhaust available memory.
- id: q6
  question: What is the safe realloc pattern?
  options:
    - "`tmp = realloc(p, new_size); if (tmp) p = tmp;`"
    - "`p = realloc(p, new_size);`"
    - "`realloc(p, 0);`"
    - "`free(p); p = malloc(new_size);`"
  correctIndex: 0
  explanation: Using a temp pointer preserves the original block on realloc failure; assign only after success.
- id: q7
  question: Which sanitizer catches use-after-free at runtime?
  options:
    - -fsanitize=undefined
    - -fsanitize=address
    - -fsanitize=thread
    - -fsanitize=memory
  correctIndex: 1
  explanation: AddressSanitizer (ASan) instruments every memory access and reports use-after-free, double-free, and buffer overflows.
- id: q8
  question: Why prefer `malloc(n * sizeof(*p))` over `malloc(n * sizeof(int))`?
  options:
    - It's faster
    - It avoids overflow
    - It auto-adapts if p's type changes
    - It zero-initializes
  correctIndex: 2
  explanation: sizeof(*p) ties the size to p's type, so refactoring p to long* doesn't silently under-allocate.
- id: q9
  question: What does valgrind --leak-check=full report?
  options:
    - Compile-time warnings
    - CPU cache misses
    - Thread race conditions
    - Memory leaks and their allocation sites
  correctIndex: 3
  explanation: valgrind's Memcheck tracks every malloc/free and reports definitely-lost blocks with stack traces.
- id: q10
  question: What is double-free?
  options:
    - Calling free(p) twice on the same allocation
    - Calling free(p) where p is NULL
    - Calling free() from two threads
    - Calling free() on a stack pointer
  correctIndex: 0
  explanation: Double-free corrupts allocator metadata; glibc usually aborts with "double free or corruption".
```

