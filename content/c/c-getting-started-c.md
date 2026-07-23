---
slug: c-getting-started-c
id: c-01
track: c
order: 1
title: Getting Started with C
description: Install a C compiler, write your first program, and understand the compile-link-run pipeline that turns source into an executable.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0
whyItMatters: Install a C compiler, write your first program, and understand the compile-link-run pipeline that turns source into an executable.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Getting Started with C

## Getting Started with C

### Why It Matters

Install a C compiler, write your first program, and understand the compile-link-run pipeline that turns source into an executable.

Install a C compiler, write your first program, and understand the compile-link-run pipeline that turns source into an executable.

### Prerequisites

- None — this is the entry point for the C track.
- Basic computer literacy (using a terminal, installing software).

### Topics

- History of C (Dennis Ritchie, 1972, Bell Labs)
- Installing gcc/clang on Linux, macOS, Windows (WSL or MinGW)
- The compile pipeline: preprocess, compile, assemble, link
- Writing main() and returning an int
- printf and basic format specifiers (%d, %f, %s, %c)
- Compiling with `gcc hello.c -o hello`
- Header files and #include <stdio.h>
- C standards: C89, C99, C11, C17, C23

### Key Concepts

- C is compiled and statically typed — no runtime, no garbage collector.
- main returns int: 0 for success, non-zero for error (visible to the shell).
- The C standard library is tiny and explicit — no built-in strings or containers.
- Source is portable; binary is not — recompile per platform.
- The toolchain: cpp (preprocessor) -> cc1 (compiler) -> as (assembler) -> ld (linker).
- Header files (.h) declare interfaces; source files (.c) define implementations.

```c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;
}
```
Caption: Hello World

### Common Pitfalls

- Forgetting #include <stdio.h> and calling printf — enable -Wall to catch the implicit-declaration warning; in C99+ implicit declarations are constraint violations.
- Writing `void main()` — main must return int; "void main()" is non-standard and breaks shell `$?` checks.
- Compiling without -Wall -Wextra — silently shipping bugs the compiler already diagnosed; always enable warnings and treat them as errors with -Werror in CI.
- Using a 30-year-old compiler (Turbo C, Borland C) — those are wildly non-compliant with modern standards; use gcc >= 11, clang >= 14, or MSVC 2019+.
- Omitting the trailing newline in printf — terminal prompts and log files merge lines; always end output with \n.

### Real-World Applications

- The Linux kernel (28+ million lines of C) compiles with gcc and clang across 30+ architectures.
- Redis, the in-memory data store, is written in C99 and ships a single `make` invocation for Linux/macOS.
- SQLite, the most-deployed database on Earth, is a single C amalgamation file shipping in every iOS and Android device.
- Git's core plumbing (commits, trees, blobs, pack files) is implemented in C and ships with every Linux distribution.

### Interview Questions

- 1. Who created C, when, and why? — Dennis Ritchie at Bell Labs in 1972 to rewrite the UNIX kernel in a portable high-level language.
- 2. What are the four phases of C compilation? — Preprocess (.i), compile (.s assembly), assemble (.o object), link (executable).
- 3. What is the difference between gcc and clang? — Both are driver front-ends; gcc uses the GCC backend, clang uses LLVM; clang usually has sharper diagnostics, gcc supports more architectures.
- 4. What does `return 0;` in main signify? — Success to the host environment; the shell sees exit status 0 in `$?`.
- 5. Name the major C standards and one feature of each. — C89 (first ANSI), C99 (// comments, <stdint.h>, VLAs), C11 (threads, _Generic, _Static_assert), C17 (bug-fix), C23 (typeof, constexpr, #embed).

### Mini Project

Build a Greeting CLI: A command-line program that takes a name from argv[1] and prints a personalized greeting. Suggested approach:
  - In main(int argc, char *argv[]), check argc >= 2
  - Print "Hello, <name>!" using printf with %s
  - If no name is supplied, print a default greeting
  - Return EXIT_FAILURE (1) if argc is wrong, EXIT_SUCCESS otherwise
  - Compile with `gcc -std=c11 -Wall -Wextra greet.c -o greet`

### Exercises

1. Install gcc or clang and verify with `gcc --version` and `clang --version`.
2. Write hello.c, then compile three ways: `gcc hello.c -o hello`, `gcc -std=c99 ...`, `gcc -std=c11 -Wall -Wextra ...`. Confirm identical output.
3. Run `gcc -E hello.c | head -40` to see preprocessor output — note how stdio.h's declarations are pasted in.
4. Modify hello.c to print your name and age using printf format specifiers.
5. Cause an intentional warning (e.g., an unused variable) and confirm -Wall -Wextra catches it.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created C?
9. A) Dennis Ritchie (*)
10. B) Ken Thompson
11. C) Brian Kernighan
12. D) Bjarne Stroustrup
13. Explanation: Dennis Ritchie designed C at Bell Labs in 1972 to port the UNIX kernel to the PDP-11.
14. Q2: Which header declares printf?
15. A) <stdlib.h>
16. B) <stdio.h> (*)
17. C) <string.h>
18. D) <printf.h>
19. Explanation: stdio.h declares the standard I/O functions, including printf, fopen, and fgets.
20. Q3: What are the four phases of C compilation?
21. A) Edit, run, debug, ship
22. B) Parse, optimize, run, gc
23. C) Preprocess, compile, assemble, link (*)
24. D) Lex, parse, type-check, execute
25. Explanation: gcc runs the preprocessor (-E), compiler (-S), assembler (-c), and linker in sequence.
26. Q4: What should main return on success?
27. A) -1
28. B) NULL
29. C) void
30. D) 0 (*)
31. Explanation: main returns int; 0 signals success to the host environment and shows up in `$?`.
32. Q5: Which is a valid C99/C11 main signature?
33. A) int main(void) (*)
34. B) void main()
35. C) main()
36. D) float main()
37. Explanation: `int main(void)` is the canonical no-argument form; `int main(int argc, char *argv[])` is the argument form.
38. Q6: Which flags enable most gcc warnings?
39. A) -O2
40. B) -Wall -Wextra (*)
41. C) -w
42. D) -Wno-all
43. Explanation: -Wall enables common warnings and -Wextra adds more; together they catch the majority of bugs at compile time.
44. Q7: Which standard introduced // line comments?
45. A) C89
46. B) C90
47. C) C99 (*)
48. D) C11
49. Explanation: C89 only allowed /* */ comments; C99 added // line comments borrowed from C++.
50. Q8: What does the preprocessor do with #include <stdio.h>?
51. A) Links the standard library at runtime
52. B) Compiles stdio.h to an object file
53. C) Generates a header guard automatically
54. D) Pastes the file's contents into the source (*)
55. Explanation: #include is a textual copy — the contents of stdio.h are inserted at that point before compilation.
56. Q9: Which is the most widely deployed C program in the world?
57. A) SQLite (*)
58. B) The Linux kernel
59. C) Git
60. D) PostgreSQL
61. Explanation: SQLite ships in every iOS and Android device, plus most browsers — over a trillion deployments.
62. Q10: What happens if you call printf without #include <stdio.h> in C11?
63. A) Compile error in C11
64. B) Implicit declaration warning, undefined behavior at runtime (*)
65. C) The linker resolves it automatically
66. D) Nothing — printf is a keyword
67. Explanation: C99+ made implicit declarations a constraint violation; the call may also crash at runtime due to argument-passing mismatch.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created C?
  options:
    - Dennis Ritchie
    - Ken Thompson
    - Brian Kernighan
    - Bjarne Stroustrup
  correctIndex: 0
  explanation: Dennis Ritchie designed C at Bell Labs in 1972 to port the UNIX kernel to the PDP-11.
- id: q2
  question: Which header declares printf?
  options:
    - <stdlib.h>
    - <stdio.h>
    - <string.h>
    - <printf.h>
  correctIndex: 1
  explanation: stdio.h declares the standard I/O functions, including printf, fopen, and fgets.
- id: q3
  question: What are the four phases of C compilation?
  options:
    - Edit, run, debug, ship
    - Parse, optimize, run, gc
    - Preprocess, compile, assemble, link
    - Lex, parse, type-check, execute
    - ", compiler (-S), assembler (-c), and linker in sequence."
  correctIndex: 2
  explanation: gcc runs the preprocessor (-E), compiler (-S), assembler (-c), and linker in sequence.
- id: q4
  question: What should main return on success?
  options:
    - "-1"
    - "NULL"
    - void
    - "0"
  correctIndex: 3
  explanation: main returns int; 0 signals success to the host environment and shows up in `$?`.
- id: q5
  question: Which is a valid C99/C11 main signature?
  options:
    - int main(void)
    - void main()
    - main()
    - float main()
  correctIndex: 0
  explanation: "`int main(void)` is the canonical no-argument form; `int main(int argc, char *argv[])` is the argument form."
- id: q6
  question: Which flags enable most gcc warnings?
  options:
    - -O2
    - -Wall -Wextra
    - -w
    - -Wno-all
  correctIndex: 1
  explanation: -Wall enables common warnings and -Wextra adds more; together they catch the majority of bugs at compile time.
- id: q7
  question: Which standard introduced // line comments?
  options:
    - C89
    - C90
    - C99
    - C11
  correctIndex: 2
  explanation: C89 only allowed /* */ comments; C99 added // line comments borrowed from C++.
- id: q8
  question: "What does the preprocessor do with #include <stdio.h>?"
  options:
    - Links the standard library at runtime
    - Compiles stdio.h to an object file
    - Generates a header guard automatically
    - Pastes the file's contents into the source
  correctIndex: 3
  explanation: "#include is a textual copy — the contents of stdio.h are inserted at that point before compilation."
- id: q9
  question: Which is the most widely deployed C program in the world?
  options:
    - SQLite
    - The Linux kernel
    - Git
    - PostgreSQL
  correctIndex: 0
  explanation: SQLite ships in every iOS and Android device, plus most browsers — over a trillion deployments.
- id: q10
  question: "What happens if you call printf without #include <stdio.h> in C11?"
  options:
    - Compile error in C11
    - Implicit declaration warning, undefined behavior at runtime
    - The linker resolves it automatically
    - Nothing — printf is a keyword
  correctIndex: 1
  explanation: C99+ made implicit declarations a constraint violation; the call may also crash at runtime due to argument-passing mismatch.
```

