---
slug: c-multi-file-projects-header-files-extern-static
id: c-13
track: c
order: 13
title: Multi-File Projects — Header Files, extern, static
description: Split a project into multiple .c and .h files, share declarations via headers, link definitions via extern, and hide internals with static.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=8300s
whyItMatters: Split a project into multiple. c and.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Multi-File Projects — Header Files, extern, static

## Multi-File Projects — Header Files, extern, static

### Why It Matters

Split a project into multiple. c and.

Split a project into multiple .c and .h files, share declarations via headers, link definitions via extern, and hide internals with static.

### Prerequisites

- Stage 9: structs, unions, and typedefs.
- Stage 12: Preprocessor.

### Topics

- Translation units: each .c is compiled separately
- Header files: declarations shared across TUs
- extern: declaring a variable defined elsewhere
- static at file scope: internal linkage (file-private)
- static at function scope: persistent local
- extern inline (C99) vs static inline
- The linker: resolving symbols across .o files
- Forward declarations and opaque types

### Key Concepts

- A translation unit (TU) is one .c file after preprocessing.
- Each TU is compiled independently into a .o object file; the linker resolves symbols.
- extern declares a name defined in another TU; the definition (with initializer) lives in exactly one TU.
- static at file scope gives internal linkage — the name is private to that TU.
- static at function scope makes the local persist across calls (with one-time initialization).
- Opaque types: declare `struct Foo;` in the header, define `struct Foo { ... };` in the .c file — clients use Foo* only.
- Header files should declare; source files should define. Avoid putting definitions in headers (except static inline).

```c
/* math.h */
#ifndef MATH_H
#define MATH_H
int add(int a, int b);
int mul(int a, int b);
#endif
```
Caption: Two-file project: math.h, math.c, main.c

### Common Pitfalls

- Putting a definition in a header — `int g_x = 5;` in a header causes multiple-definition link errors when the header is included by two TUs; use `extern` declaration in the header and definition in one .c.
- Forgetting to declare a function — implicit declarations are UB in C99+; always include the header.
- Using static for "global" — `static int x;` at file scope means file-private, NOT a global; multiple TUs each get their own copy.
- Including a .c file — never `#include "foo.c"`; compile each .c separately and link them.
- Header mismatch — declaring a function one way in the header and differently in the .c causes silent UB; the compiler trusts the header at the call site.

### Real-World Applications

- Redis is split into ~50 .c files (networking.c, db.c, t_string.c, etc.) with shared headers; `make` compiles each into a .o and links them.
- The Linux kernel uses opaque types extensively (struct inode, struct file) so drivers can't reach into private fields.
- SQLite ships as a single amalgamation file, but the original source is split into ~200 files compiled separately.
- Git's object access layer is split into object.c, object-store.c, packfile.c with shared headers — exemplifying multi-file design.

### Interview Questions

- 1. What is a translation unit? — A .c file after preprocessing; each TU is compiled independently into a .o.
- 2. What does `extern int x;` mean? — A declaration: x is defined (and initialized) in another TU; the linker resolves it.
- 3. What does `static` mean at file scope? — Internal linkage: the name is private to the TU; no other TU can see it.
- 4. What's the difference between static and static inline in a header? — static inline functions are designed to live in headers (one definition per TU, but inlined); static non-inline functions in headers cause code bloat (one copy per TU).
- 5. What is an opaque type? — A type whose definition is hidden in the .c file; the header declares only `struct Foo;`, so clients use `Foo*` and cannot access members.

### Mini Project

Build a 3-File Math Library: A project with math.h, math.c, and main.c that exposes add, sub, mul, factorial, plus a file-private helper. Suggested approach:
  - In math.h, declare the public functions
  - In math.c, implement them; add `static int checked_overflow(...)` as a private helper
  - In main.c, include math.h and exercise the functions
  - Compile with separate -c steps and a final link
  - Verify that the static helper is not visible from main.c (try calling it; expect a compile error)

### Exercises

1. Split a single-file program into 3 files: main.c, util.c, util.h. Compile and link separately.
2. Define a global counter with extern in a header and definition in one .c; increment it from another .c.
3. Make a function file-private with static; verify it's not visible from another TU.
4. Build an opaque Stack type: stack.h with `typedef struct Stack Stack;`, stack.c with the struct definition.
5. Add static inline util functions to a header; verify no multiple-definition errors.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a translation unit (TU)?
9. A) A .c file after preprocessing (*)
10. B) A library
11. C) A header file
12. D) An object file
13. Explanation: The preprocessor expands #includes and #defines; the result is the TU, which the compiler then parses.
14. Q2: What does `extern int x;` declare?
15. A) A definition of x
16. B) A declaration that x is defined elsewhere (*)
17. C) A static variable
18. D) A const variable
19. Explanation: extern is a declaration only — x must be defined (with initializer) in exactly one TU; the linker resolves references.
20. Q3: What does `static` mean at file scope?
21. A) The variable lives on the stack
22. B) The variable is const
23. C) Internal linkage — the name is private to the TU (*)
24. D) The variable is shared across TUs
25. Explanation: File-scope static gives internal linkage; the symbol is not exported, so other TUs cannot link to it.
26. Q4: Why is `int g_x = 5;` in a header a bug?
27. A) Headers can't have variables
28. B) It's UB at runtime
29. C) It causes a compile error
30. D) Multiple TUs will each define g_x -> multiple-definition link error (*)
31. Explanation: Each TU that includes the header defines g_x; the linker sees duplicate definitions and aborts.
32. Q5: What's an opaque type?
33. A) A type whose definition is hidden — clients use a pointer only (*)
34. B) A type with no name
35. C) A const type
36. D) A void *
37. Explanation: The header declares `struct Foo;` only; the struct body lives in the .c file, so clients can't access members directly.
38. Q6: What does `static inline` allow in a header?
39. A) Faster compilation
40. B) Inline functions defined in headers without multiple-definition errors (*)
41. C) Thread-safe functions
42. D) Const variables
43. Explanation: static inline functions have internal linkage; each TU gets its own copy, but inlining avoids any function-call overhead.
44. Q7: Should you `#include "foo.c"`?
45. A) Yes, always
46. B) Only on Windows
47. C) No — compile each .c separately and link them (*)
48. D) Only for tiny files
49. Explanation: Including .c files defeats separate compilation, slows rebuilds, and causes duplicate definitions; compile .c files separately.
50. Q8: What does the linker do?
51. A) Parses source files
52. B) Runs the preprocessor
53. C) Generates assembly
54. D) Resolves symbols across .o files and produces an executable (*)
55. Explanation: The linker takes .o files (and libraries) and resolves undefined symbols to their definitions, producing the final executable.
56. Q9: What happens if a function's header declaration doesn't match its .c definition?
57. A) Silent undefined behavior — the compiler trusts the header (*)
58. B) Compile error
59. C) Link error
60. D) Runtime crash always
61. Explanation: The compiler type-checks calls against the header; the .c definition may differ. The mismatch is UB, often a silent crash.
62. Q10: What is `static` at function-scope (a static local)?
63. A) A file-private local
64. B) A local that persists across calls, initialized once (*)
65. C) A const local
66. D) A thread-local local
67. Explanation: Function-scope static locals live in the data segment, are zero-initialized, and persist across calls; not thread-safe by default.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a translation unit (TU)?
  options:
    - "?"
    - A .c file after preprocessing
    - A library
    - A header file
    - An object file
  correctIndex: 1
  explanation: "The preprocessor expands #includes and #defines; the result is the TU, which the compiler then parses."
- id: q2
  question: What does `extern int x;` declare?
  options:
    - A definition of x
    - A declaration that x is defined elsewhere
    - A static variable
    - A const variable
  correctIndex: 1
  explanation: extern is a declaration only — x must be defined (with initializer) in exactly one TU; the linker resolves references.
- id: q3
  question: What does `static` mean at file scope?
  options:
    - The variable lives on the stack
    - The variable is const
    - Internal linkage — the name is private to the TU
    - The variable is shared across TUs
  correctIndex: 2
  explanation: File-scope static gives internal linkage; the symbol is not exported, so other TUs cannot link to it.
- id: q4
  question: Why is `int g_x = 5;` in a header a bug?
  options:
    - Headers can't have variables
    - It's UB at runtime
    - It causes a compile error
    - Multiple TUs will each define g_x -> multiple-definition link error
  correctIndex: 3
  explanation: Each TU that includes the header defines g_x; the linker sees duplicate definitions and aborts.
- id: q5
  question: What's an opaque type?
  options:
    - A type whose definition is hidden — clients use a pointer only
    - A type with no name
    - A const type
    - A void *
  correctIndex: 0
  explanation: The header declares `struct Foo;` only; the struct body lives in the .c file, so clients can't access members directly.
- id: q6
  question: What does `static inline` allow in a header?
  options:
    - Faster compilation
    - Inline functions defined in headers without multiple-definition errors
    - Thread-safe functions
    - Const variables
  correctIndex: 1
  explanation: static inline functions have internal linkage; each TU gets its own copy, but inlining avoids any function-call overhead.
- id: q7
  question: Should you `#include "foo.c"`?
  options:
    - Yes, always
    - Only on Windows
    - No — compile each .c separately and link them
    - Only for tiny files
  correctIndex: 2
  explanation: Including .c files defeats separate compilation, slows rebuilds, and causes duplicate definitions; compile .c files separately.
- id: q8
  question: What does the linker do?
  options:
    - Parses source files
    - Runs the preprocessor
    - Generates assembly
    - Resolves symbols across .o files and produces an executable
  correctIndex: 3
  explanation: The linker takes .o files (and libraries) and resolves undefined symbols to their definitions, producing the final executable.
- id: q9
  question: What happens if a function's header declaration doesn't match its .c definition?
  options:
    - Silent undefined behavior — the compiler trusts the header
    - Compile error
    - Link error
    - Runtime crash always
  correctIndex: 0
  explanation: The compiler type-checks calls against the header; the .c definition may differ. The mismatch is UB, often a silent crash.
- id: q10
  question: What is `static` at function-scope (a static local)?
  options:
    - A file-private local
    - A local that persists across calls, initialized once
    - A const local
    - A thread-local local
  correctIndex: 1
  explanation: Function-scope static locals live in the data segment, are zero-initialized, and persist across calls; not thread-safe by default.
```

