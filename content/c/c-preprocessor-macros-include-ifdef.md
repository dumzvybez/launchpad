---
slug: c-preprocessor-macros-include-ifdef
id: c-12
track: c
order: 12
title: "Preprocessor — Macros, #include, #ifdef"
description: "Master the C preprocessor — object-like and function-like macros, #include, conditional compilation, and the dangerous pitfalls of macros that look like functions."
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=7600s
whyItMatters: "Master the C preprocessor — object-like and function-like macros, #include, conditional compilation, and the dangerous pitfalls of macros that look like functions."
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Preprocessor — Macros, #include, #ifdef

## Preprocessor — Macros, #include, #ifdef

### Why It Matters

Master the C preprocessor — object-like and function-like macros, #include, conditional compilation, and the dangerous pitfalls of macros that look like functions.

Master the C preprocessor — object-like and function-like macros, #include, conditional compilation, and the dangerous pitfalls of macros that look like functions.

### Prerequisites

- Stage 1: Getting Started with C.
- Stage 10: Function Pointers (for understanding macro/function trade-offs).

### Topics

- The preprocessor as a separate phase (cpp)
- Object-like macros: `#define PI 3.14`
- Function-like macros: `#define MAX(a,b) ((a)>(b)?(a):(b))`
- #include with angle brackets vs quotes
- Conditional compilation: #ifdef, #ifndef, #if, #elif, #endif
- defined() operator and __STDC_VERSION__
- Variadic macros (__VA_ARGS__)
- Token pasting (##) and stringification (#)
- #pragma and _Pragma

### Key Concepts

- The preprocessor runs before the compiler; it does textual substitution.
- Object-like macros have no parameters; function-like macros do, but no type checking.
- Macro arguments are textually substituted; parenthesize every use to avoid precedence bugs.
- Macros evaluate arguments each time they appear — `MAX(i++, j++)` increments twice.
- Header guards (#ifndef X / #define X / #endif) prevent double-inclusion.
- Conditional compilation lets you build platform-specific code (e.g., #ifdef _WIN32).
- #pragma once is a non-standard but widely-supported alternative to header guards.

```c
#include <stdio.h>

#define PI       3.14159
#define SQUARE(x) ((x) * (x))     /* parenthesize EVERY use */
#define MAX(a, b)  ((a) > (b) ? (a) : (b))

int main(void) {
    int i = 5, j = 7;
    printf("PI=%.5f  SQUARE(3)=%d  MAX(i,j)=%d\n",
           PI, SQUARE(3), MAX(i, j));
    return 0;
}
```
Caption: Object and function-like macros

### Common Pitfalls

- Missing parentheses in macros — `#define SQ(x) x*x` makes `SQ(1+2)` evaluate to 5, not 9; always wrap each parameter AND the whole expression in parens.
- Argument with side effects — `MAX(i++, j++)` increments the winner twice; use an inline function instead.
- Semicolon after a macro definition — `#define X 5;` makes every use of X include a stray semicolon; do not terminate macros with `;`.
- Forgetting the header guard — multiple inclusion causes redefinition errors; every .h needs a guard or #pragma once.
- Multi-statement macros without do-while — `#define SWAP(a,b) t=a;a=b;b=t;` breaks inside `if`; wrap in `do { ... } while(0)`.

### Real-World Applications

- The Linux kernel uses thousands of macros for platform abstraction, container_of, list_for_each, and lockdep instrumentation.
- SQLite uses macros for its public API (SQLITE_OK, SQLITE_ROW) and for the vdbe opcodes that drive its virtual machine.
- Redis uses macros like sdslen, sdsavail to access length-prefixed SDS strings as if they were plain char*.
- Every C standard library header (<stdio.h>, <stdlib.h>) is heavily guarded and conditional on __STDC_VERSION__ and platform macros.

### Interview Questions

- 1. What's the difference between an inline function and a function-like macro? — Inline functions have type checking and evaluate arguments once; macros are textual and lack both.
- 2. Why must every macro parameter be parenthesized? — Otherwise `SQ(1+2)` becomes `1+2*1+2` = 5, not 9; precedence is preserved by full parenthesization.
- 3. What's a do-while(0) macro and why use it? — Wrapping a multi-statement macro in `do { ... } while(0)` makes it behave like a single statement, so `if (cond) MACRO();` works.
- 4. What's the difference between #include <stdio.h> and #include "stdio.h"? — Angle brackets search system include paths; quotes search the current directory first.
- 5. What does the # operator do in a macro? — Stringifies its argument: `#x` becomes the literal "x"; `XSTR` two-level trick expands macros first.

### Mini Project

Build a Logging Macro Library: A header file `log.h` with macros LOG_DEBUG, LOG_INFO, LOG_ERROR that prepend file, line, and a level tag. Suggested approach:
  - Use __FILE__, __LINE__, __VA_ARGS__ to capture context
  - Gate each level with #ifdef LOG_LEVEL_DEBUG etc.
  - Wrap multi-statement bodies in do { ... } while(0)
  - Provide LOG_IF(cond, level, fmt, ...) that only logs if cond is true
  - Test that LOG_DEBUG compiles out when LOG_LEVEL is below DEBUG

### Exercises

1. Define a SQUARE macro both with and without parentheses; demonstrate the precedence bug.
2. Add a header guard to a .h file and verify it can be included multiple times.
3. Use #ifdef to compile different code on Linux vs Windows.
4. Write a variadic macro LOG_INFO(fmt, ...) that prints file:line and the formatted message.
5. Build a do-while(0) SWAP macro for two ints and verify it works inside a single-line if.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `#define SQ(x) x*x` evaluate `SQ(1+2)` to?
9. A) 9
10. B) 6
11. C) Compile error
12. D) 5 (*)
13. Explanation: Substitution gives `1+2*1+2` = 1+2+2 = 5 (operator precedence); fix with `((x)*(x))`.
14. Q2: When does the preprocessor run?
15. A) Before compilation (*)
16. B) After compilation
17. C) At link time
18. D) At runtime
19. Explanation: cpp runs first, producing a translation unit that the compiler then parses; you can see the output with `gcc -E`.
20. Q3: What's the difference between `#include <stdio.h>` and `#include "my.h"`?
21. A) No difference
22. B) Angle brackets search system paths; quotes search the current directory first (*)
23. C) Quotes search system paths only
24. D) Angle brackets require a special compiler flag
25. Explanation: Quotes look in the same directory as the source first; angle brackets use only the system include paths.
26. Q4: What's the purpose of a header guard?
27. A) Faster compilation
28. B) Encrypt the header
29. C) Prevent double-inclusion of the same header (*)
30. D) Reduce binary size
31. Explanation: `#ifndef X / #define X / ... / #endif` ensures a header's contents are processed only once per translation unit.
32. Q5: Why wrap multi-statement macros in `do { ... } while(0)`?
33. A) For performance
34. B) To enable recursion
35. C) To avoid the preprocessor
36. D) To make the macro behave like a single statement (so `if (c) MACRO();` works) (*)
37. Explanation: A bare block `{ ... };` adds a stray semicolon after the if; do-while(0) makes it a proper statement.
38. Q6: What does the # operator do in a function-like macro?
39. A) Stringifies the argument (*)
40. B) Comments out the argument
41. C) Token-pastes the argument
42. D) Counts the arguments
43. Explanation: `#x` turns the argument's text into a string literal; pair with a second-level macro to expand macros first.
44. Q7: Why does `MAX(i++, j++)` produce surprising results?
45. A) Macros can't take i++
46. B) The argument is expanded multiple times, incrementing the winner twice (*)
47. C) Macros run at compile time, so i++ is a no-op
48. D) It's undefined behavior to use i++ in a macro
49. Explanation: `MAX(i++, j++)` becomes `((i++)>(j++)?(i++):(j++))`; the winner is incremented twice. Use an inline function instead.
50. Q8: What does the ## operator do?
51. A) Stringifies
52. B) Counts tokens
53. C) Token-pastes two tokens into one (*)
54. D) Comments out tokens
55. Explanation: `a##b` produces a single token `ab`; used to generate names like CONCAT(my, var) -> myvar.
56. Q9: Which macro would you use to capture the source file and line?
57. A) __SOURCE__ and __LINE__
58. B) __LOC__ and __ROW__
59. C) __WHERE__ and __N__
60. D) __FILE__ and __LINE__ (*)
61. Explanation: __FILE__ is a string literal of the source filename; __LINE__ is the integer line number; both are set by the preprocessor.
62. Q10: What does #pragma once do?
63. A) A non-standard but widely-supported header guard alternative (*)
64. B) Runs the file once at runtime
65. C) Optimizes the file
66. D) Removes the file from the build
67. Explanation: #pragma once tells the compiler to include the file at most once per compilation; supported by gcc, clang, MSVC.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `#define SQ(x) x*x` evaluate `SQ(1+2)` to?
  options:
    - "9"
    - "6"
    - Compile error
    - "5"
  correctIndex: 3
  explanation: Substitution gives `1+2*1+2` = 1+2+2 = 5 (operator precedence); fix with `((x)*(x))`.
- id: q2
  question: When does the preprocessor run?
  options:
    - Before compilation
    - After compilation
    - At link time
    - At runtime
  correctIndex: 0
  explanation: cpp runs first, producing a translation unit that the compiler then parses; you can see the output with `gcc -E`.
- id: q3
  question: What's the difference between `#include <stdio.h>` and `#include "my.h"`?
  options:
    - No difference
    - Angle brackets search system paths; quotes search the current directory first
    - Quotes search system paths only
    - Angle brackets require a special compiler flag
  correctIndex: 1
  explanation: Quotes look in the same directory as the source first; angle brackets use only the system include paths.
- id: q4
  question: What's the purpose of a header guard?
  options:
    - Faster compilation
    - Encrypt the header
    - Prevent double-inclusion of the same header
    - Reduce binary size
  correctIndex: 2
  explanation: "`#ifndef X / #define X / ... / #endif` ensures a header's contents are processed only once per translation unit."
- id: q5
  question: Why wrap multi-statement macros in `do { ... } while(0)`?
  options:
    - For performance
    - To enable recursion
    - To avoid the preprocessor
    - To make the macro behave like a single statement (so `if (c) MACRO();` works)
  correctIndex: 3
  explanation: A bare block `{ ... };` adds a stray semicolon after the if; do-while(0) makes it a proper statement.
- id: q6
  question: "What does the # operator do in a function-like macro?"
  options:
    - Stringifies the argument
    - Comments out the argument
    - Token-pastes the argument
    - Counts the arguments
  correctIndex: 0
  explanation: "`#x` turns the argument's text into a string literal; pair with a second-level macro to expand macros first."
- id: q7
  question: Why does `MAX(i++, j++)` produce surprising results?
  options:
    - Macros can't take i++
    - The argument is expanded multiple times, incrementing the winner twice
    - Macros run at compile time, so i++ is a no-op
    - It's undefined behavior to use i++ in a macro
  correctIndex: 1
  explanation: "`MAX(i++, j++)` becomes `((i++)>(j++)?(i++):(j++))`; the winner is incremented twice. Use an inline function instead."
- id: q8
  question: "What does the ## operator do?"
  options:
    - Stringifies
    - Counts tokens
    - Token-pastes two tokens into one
    - Comments out tokens
  correctIndex: 2
  explanation: "`a##b` produces a single token `ab`; used to generate names like CONCAT(my, var) -> myvar."
- id: q9
  question: Which macro would you use to capture the source file and line?
  options:
    - __SOURCE__ and __LINE__
    - __LOC__ and __ROW__
    - __WHERE__ and __N__
    - __FILE__ and __LINE__
  correctIndex: 3
  explanation: __FILE__ is a string literal of the source filename; __LINE__ is the integer line number; both are set by the preprocessor.
- id: q10
  question: "What does #pragma once do?"
  options:
    - A non-standard but widely-supported header guard alternative
    - Runs the file once at runtime
    - Optimizes the file
    - Removes the file from the build
  correctIndex: 0
  explanation: "#pragma once tells the compiler to include the file at most once per compilation; supported by gcc, clang, MSVC."
```

