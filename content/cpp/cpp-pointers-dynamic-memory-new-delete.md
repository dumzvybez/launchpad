---
slug: cpp-pointers-dynamic-memory-new-delete
id: cpp-05
track: cpp
order: 5
title: Pointers and Dynamic Memory (new/delete)
description: Learn raw pointers, address-of and dereference, dynamic allocation with new and delete, arrays with new[]/delete[], the strict aliasing rule, and the pathologies that motivate smart pointers in Stage 12.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=200s
whyItMatters: Learn raw pointers, address-of and dereference, dynamic allocation with new and delete, arrays with new[]/delete[], the strict aliasing rule, and the pathologies that motivate smart pointers in Stage 12.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Pointers and Dynamic Memory (new/delete)

## Pointers and Dynamic Memory (new/delete)

### Why It Matters

Learn raw pointers, address-of and dereference, dynamic allocation with new and delete, arrays with new[]/delete[], the strict aliasing rule, and the pathologies that motivate smart pointers in Stage 12.

Learn raw pointers, address-of and dereference, dynamic allocation with new and delete, arrays with new[]/delete[], the strict aliasing rule, and the pathologies that motivate smart pointers in Stage 12.

### Prerequisites

- Stage 1-4

### Topics

- Address-of (&) and dereference (*) operators
- Pointer arithmetic and array decay
- new and delete (single object)
- new[] and delete[] (arrays)
- Operator new (the allocator function) vs the new expression
- Pointer to void*, casting (static_cast, reinterpret_cast)
- The strict aliasing rule
- Null pointers (nullptr, not NULL or 0)
- Memory leaks, double-free, use-after-free
- Placement new (preview)

### Key Concepts

- A pointer is an address; *p dereferences it; &x takes its address.
- new allocates and constructs; delete destructs and deallocates. new[] needs delete[] — mixing them is UB.
- delete on a nullptr is a no-op (defined); double-delete is UB.
- Use-after-free is UB and the source of countless security vulnerabilities; ASan catches it in testing.
- The strict aliasing rule says you may not access memory through an incompatible type pointer; use memcpy for type-punning or -fno-strict-aliasing to disable.
- nullptr is a first-class null pointer constant of type std::nullptr_t; prefer it to NULL (which is `0` or `(void*)0`) and `0`.

```cpp
#include <iostream>

int main() {
    int x = 42;
    int* p = &x;          // p points to x
    std::cout << *p;      // 42
    *p = 99;              // mutates x through the pointer
    std::cout << x;       // 99

    int* null = nullptr;  // modern null pointer
    if (!null) std::cout << "null\n";
}
```
Caption: Pointer basics

### Common Pitfalls

- Mismatched new[] / delete — `int* a = new int[10]; delete a;` is UB; the array elements are not destructed and the allocator may corrupt its bookkeeping. Always pair new[] with delete[].
- Forgetting delete on an exception path — use RAII (smart pointers, Stage 12) so the destructor runs unconditionally; raw new/delete is a code smell in modern C++.
- Returning a raw owning pointer from a function — the caller cannot tell if they own it; return std::unique_ptr (Stage 12) to make ownership explicit.
- Strict aliasing violations through reinterpret_cast — type-pun with std::memcpy or use std::bit_cast (C++20); -fno-strict-aliasing disables the optimization but at a perf cost.
- Pointer arithmetic past the bounds of an array (including one-past-the-end dereference) — UB; use std::span (C++20) or iterators to keep bounds visible.

### Real-World Applications

- Linux kernel allocators (kmalloc/slab) are C-style but share the same "raw memory + ownership discipline" model; understanding new/delete clarifies the kernel equivalent.
- SQLite uses raw allocation with custom allocators; every allocation has a tracked owner to avoid leaks.
- Game engines (Unreal) often use custom allocators that wrap operator new; alignment and pooling matter for cache performance.
- Chromium's PartitionAlloc is a hardened malloc that catches many use-after-free bugs in production; modern C++ code in Chrome uses std::unique_ptr instead of raw new.

### Interview Questions

- 1. What is the difference between `new` and `operator new`? — `new` is an expression that allocates (via operator new) AND constructs; `operator new` is just the allocator function that returns raw memory.
- 2. Why is `int* a = new int[10]; delete a;` undefined behavior? — delete (without []) does not call destructors and may corrupt allocator bookkeeping; you must use delete[] for arrays.
- 3. What is the strict aliasing rule? — You may not access an object through a pointer of an incompatible type (with exceptions for char/unsigned char/std::byte); violations are UB.
- 4. What is nullptr and why prefer it to NULL? — nullptr is of type std::nullptr_t and converts to any pointer type without ambiguity; NULL is `0` or `(void*)0` and can cause overload-resolution surprises.
- 5. What does RAII mean and how does it solve the leak problem? — Resource Acquisition Is Initialization: tie every resource to an object's lifetime so the destructor releases it; smart pointers are RAII for memory.

### Mini Project

Build a Dynamic Int Stack: A simple stack class using raw new[]/delete[] for storage (then in Stage 12, refactor to unique_ptr). Suggested approach:
  - Class IntStack with int* data_, size_t size_, size_t cap_
  - Constructor allocates cap_ = 16 with new int[cap_]
  - push(int) doubles cap_ when full: allocate new[], copy, delete[] old
  - pop() decrements size_; top() returns data_[size_-1]
  - Destructor calls delete[] data_
  - Add bounds-checked at(size_t) that throws std::out_of_range

### Exercises

1. Write a program that allocates 1000 ints with new, leaks them, then runs under valgrind (`valgrind ./leak`) to see the diagnostic.
2. Demonstrate double-free under ASan: `int* p = new int; delete p; delete p;` compiled with -fsanitize=address; read the report.
3. Type-pun an int as a float with reinterpret_cast and observe the -fsanitize=undefined (with -fno-sanitize-recover) diagnostic about strict aliasing.
4. Allocate a 2D matrix as `int** m = new int*[rows]; for (...) m[i] = new int[cols];` and free it in reverse order.
5. Use placement new to construct a string in pre-allocated memory; manually call the destructor and free the buffer.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which form must be used to free `int* a = new int[10];`?
9. A) delete[] a; (*)
10. B) delete a;
11. C) free(a);
12. D) Both delete a; and delete[] a;
13. Explanation: new[] must be paired with delete[]; plain delete does not call element destructors and corrupts the allocator's array metadata.
14. Q2: What is the result of deleting a pointer twice?
15. A) No effect
16. B) Undefined behavior — double free (*)
17. C) Defined behavior — second delete is a no-op
18. D) Throws std::bad_alloc
19. Explanation: Double-free corrupts the allocator's free list and is UB; setting the pointer to nullptr after the first delete makes the second delete safe (a no-op).
20. Q3: What does deleting nullptr do?
21. A) UB
22. B) Throws an exception
23. C) Defined as a no-op (*)
24. D) Crashes the program
25. Explanation: The standard guarantees delete and delete[] on nullptr are no-ops; this lets you delete a possibly-null pointer without an explicit check.
26. Q4: What is the strict aliasing rule?
27. A) Two pointers may always alias
28. B) Aliases are forbidden
29. C) Pointers must be unique
30. D) Memory may not be accessed through an incompatible type pointer (*)
31. Explanation: Strict aliasing forbids accessing an object through a pointer of an incompatible type (with exceptions for char-like types); violations are UB.
32. Q5: Why prefer nullptr to NULL?
33. A) nullptr has type std::nullptr_t and avoids overload ambiguity (*)
34. B) NULL is deprecated
35. C) NULL is not portable
36. D) NULL cannot be assigned to pointers
37. Explanation: NULL is `0` or `(void*)0` and can resolve to int in overload resolution; nullptr is its own type that converts to any pointer without ambiguity.
38. Q6: Which type-punning is portable and well-defined?
39. A) `*reinterpret_cast<float*>(&int_var)`
40. B) std::memcpy / std::bit_cast<float>(int_var) (*)
41. C) `(float)int_var`
42. D) union { int i; float f; }
43. Explanation: memcpy and std::bit_cast (C++20) are the safe ways to type-pun; reinterpret_cast violates strict aliasing and union type-punning is UB in C++.
44. Q7: What is the difference between `new T` and `operator new(sizeof(T))`?
45. A) They are identical
46. B) operator new also constructs
47. C) new T allocates and constructs; operator new only allocates raw memory (*)
48. D) new T is a function call
49. Explanation: `new T` is an expression that calls operator new to get memory and then constructs a T; operator new is just the raw allocator function.
50. Q8: What is use-after-free?
51. A) Deleting memory after use
52. B) Using memory before allocation
53. C) A pattern in smart pointers
54. D) Accessing memory after delete (*)
55. Explanation: Use-after-free is accessing memory that has already been freed; it is UB and a common source of security vulnerabilities. ASan catches it in testing.
56. Q9: What does pointer arithmetic allow?
57. A) Arithmetic within an array bounds (incl. one-past-the-end, not deref'd) (*)
58. B) Adding any integer to any pointer
59. C) Only subtraction
60. D) Pointer-to-float conversion
61. Explanation: Pointer arithmetic is defined only within an array (including the one-past-the-end position, which must not be dereferenced); other arithmetic is UB.
62. Q10: What is placement new?
63. A) A new operator that places objects at specific addresses
64. B) new with extra arguments that constructs in pre-allocated memory (*)
65. C) An alias for operator new
66. D) A way to delete objects
67. Explanation: `new (ptr) T(args)` constructs a T at the address ptr without allocating; the caller must manually call the destructor and manage the underlying memory.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which form must be used to free `int* a = new int[10];`?
  options:
    - delete[] a;
    - delete a;
    - free(a);
    - Both delete a; and delete[] a;
  correctIndex: 0
  explanation: new[] must be paired with delete[]; plain delete does not call element destructors and corrupts the allocator's array metadata.
- id: q2
  question: What is the result of deleting a pointer twice?
  options:
    - No effect
    - Undefined behavior — double free
    - Defined behavior — second delete is a no-op
    - Throws std::bad_alloc
  correctIndex: 1
  explanation: Double-free corrupts the allocator's free list and is UB; setting the pointer to nullptr after the first delete makes the second delete safe (a no-op).
- id: q3
  question: What does deleting nullptr do?
  options:
    - UB
    - Throws an exception
    - Defined as a no-op
    - Crashes the program
  correctIndex: 2
  explanation: The standard guarantees delete and delete[] on nullptr are no-ops; this lets you delete a possibly-null pointer without an explicit check.
- id: q4
  question: What is the strict aliasing rule?
  options:
    - Two pointers may always alias
    - Aliases are forbidden
    - Pointers must be unique
    - Memory may not be accessed through an incompatible type pointer
  correctIndex: 3
  explanation: Strict aliasing forbids accessing an object through a pointer of an incompatible type (with exceptions for char-like types); violations are UB.
- id: q5
  question: Why prefer nullptr to NULL?
  options:
    - nullptr has type std::nullptr_t and avoids overload ambiguity
    - NULL is deprecated
    - NULL is not portable
    - NULL cannot be assigned to pointers
  correctIndex: 0
  explanation: NULL is `0` or `(void*)0` and can resolve to int in overload resolution; nullptr is its own type that converts to any pointer without ambiguity.
- id: q6
  question: Which type-punning is portable and well-defined?
  options:
    - "`*reinterpret_cast<float*>(&int_var)`"
    - std::memcpy / std::bit_cast<float>(int_var)
    - "`(float)int_var`"
    - union { int i; float f; }
  correctIndex: 1
  explanation: memcpy and std::bit_cast (C++20) are the safe ways to type-pun; reinterpret_cast violates strict aliasing and union type-punning is UB in C++.
- id: q7
  question: What is the difference between `new T` and `operator new(sizeof(T))`?
  options:
    - )`?
    - They are identical
    - operator new also constructs
    - new T allocates and constructs; operator new only allocates raw memory
    - new T is a function call
  correctIndex: 3
  explanation: "`new T` is an expression that calls operator new to get memory and then constructs a T; operator new is just the raw allocator function."
- id: q8
  question: What is use-after-free?
  options:
    - Deleting memory after use
    - Using memory before allocation
    - A pattern in smart pointers
    - Accessing memory after delete
  correctIndex: 3
  explanation: Use-after-free is accessing memory that has already been freed; it is UB and a common source of security vulnerabilities. ASan catches it in testing.
- id: q9
  question: What does pointer arithmetic allow?
  options:
    - Arithmetic within an array bounds (incl. one-past-the-end, not deref'd)
    - Adding any integer to any pointer
    - Only subtraction
    - Pointer-to-float conversion
  correctIndex: 0
  explanation: Pointer arithmetic is defined only within an array (including the one-past-the-end position, which must not be dereferenced); other arithmetic is UB.
- id: q10
  question: What is placement new?
  options:
    - A new operator that places objects at specific addresses
    - new with extra arguments that constructs in pre-allocated memory
    - An alias for operator new
    - A way to delete objects
  correctIndex: 1
  explanation: "`new (ptr) T(args)` constructs a T at the address ptr without allocating; the caller must manually call the destructor and manage the underlying memory."
```

