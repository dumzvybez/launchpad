---
slug: c-control-flow-conditionals-loops
id: c-03
track: c
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/else, switch, for, while, do-while, break, continue, and the goto debate — and learn why switch fallthrough is a famous C footgun.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=1300s
whyItMatters: Master if/else, switch, for, while, do-while, break, continue, and the goto debate — and learn why switch fallthrough is a famous C footgun.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/else, switch, for, while, do-while, break, continue, and the goto debate — and learn why switch fallthrough is a famous C footgun.

Master if/else, switch, for, while, do-while, break, continue, and the goto debate — and learn why switch fallthrough is a famous C footgun.

### Prerequisites

- Stage 1: Getting Started with C.
- Stage 2: Variables, Types, and Operators (for relational/logical operators).

### Topics

- if / else if / else and dangling-else
- switch / case / default and fallthrough
- for, while, do-while loops
- break and continue
- goto and labeled statements (and when to use them)
- Ternary conditional `?:`
- Comma operator in for-loops
- Short-circuit evaluation of && and ||

### Key Concepts

- C has no boolean type before C99; `int` 0 is false, anything else is true.
- C99 added _Bool and the <stdbool.h> true/false macros.
- switch cases fall through unless you `break;` — a famous source of bugs.
- && and || short-circuit: the right side may not be evaluated.
- Loops evaluate their condition before each iteration (do-while: after).
- goto is acceptable for cleanup jumps in functions with multiple resources.

```c
#include <stdio.h>

int main(void) {
    int day = 2;
    switch (day) {
        case 1: printf("Mon\n");
        case 2: printf("Tue\n");   /* intentional or not? */
        case 3: printf("Wed\n");
                break;
        default: printf("?\n");
    }
    /* Prints Tue \n Wed \n — both case 2 and case 3 fire */
    return 0;
}
```
Caption: switch with fallthrough bug

### Common Pitfalls

- Forgetting `break;` in a switch case — silent fallthrough; modern gcc warns with -Wimplicit-fallthrough.
- Off-by-one in `for (i = 0; i <= n; i++)` — uses index n, which is past the end; use `i < n`.
- Comparing unsigned i >= 0 in a for-loop — always true; `for (size_t i = n; i >= 0; i--)` is an infinite loop. Use a signed type or `i != SIZE_MAX`.
- Semicolon after a for-loop header — `for (...); { ... }` runs the loop body zero times in the empty statement, then runs the block once.
- Using `goto` to jump into a different scope, skipping variable initialization — undefined behavior in C99+.

### Real-World Applications

- The Linux kernel uses goto extensively for cleanup in functions that acquire multiple locks or files; see Linus Torvalds' defense of the pattern on LKML.
- SQLite's parser uses switch statements with deliberate fallthrough groups to share code between similar token types.
- Redis's main event loop is a single big while(1) with select/epoll; control flow is central to its throughput.
- The cURL source uses do-while(0) macros to make multi-statement macros behave like single statements.

### Interview Questions

- 1. Why does C switch fall through by default? — BCPL/B language heritage; the design assumed fallthrough was the common case; modern style requires explicit `break` or `/* fallthrough */` comments.
- 2. What's the difference between `while` and `do-while`? — while checks the condition before the first iteration; do-while checks after, so the body runs at least once.
- 3. When is `goto` acceptable? — For centralized cleanup (free/close/unlock) in functions with multiple error paths; not for general control flow.
- 4. What is short-circuit evaluation, and why does it matter? — && stops on false, || stops on true; lets you safely write `if (p && p->x)` without a null deref.
- 5. What's the value of `sizeof(true)` with <stdbool.h>? — true is `_Bool` promoted to int in arithmetic, but sizeof(true) is 1 (sizeof of _Bool).

### Mini Project

Build a FizzBuzz CLI with switch: A program that prints FizzBuzz from 1 to N (N from argv[1]) using a switch statement to handle the four cases (neither, Fizz, Buzz, FizzBuzz). Suggested approach:
  - Parse N from argv[1] with strtol, with error checking
  - For each i from 1 to N, compute (i%3==0) + 2*(i%5==0) -> 0..3
  - switch on that value: case 0 prints i, case 1 prints "Fizz", case 2 prints "Buzz", case 3 prints "FizzBuzz"
  - Use putchar for performance, not printf per number
  - Compile with -Wall -Wextra and verify no fallthrough warnings

### Exercises

1. Print numbers 1..20 with a for-loop, then re-write the same loop with while and do-while.
2. Write a switch on a char that classifies it as 'vowel', 'consonant', 'digit', or 'other' — be careful about fallthrough.
3. Demonstrate short-circuit evaluation by writing `if (ptr && ptr->value == 5)` and verifying ptr->value is never accessed when ptr is NULL.
4. Refactor a function with three nested ifs into a single expression using && and ||.
5. Find the bug: `for (size_t i = 10; i >= 0; i--) printf("%zu\n", i);` — explain the infinite loop and fix it.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens if you forget `break;` in a switch case?
9. A) Compile error
10. B) The default case runs instead
11. C) The case falls through to the next case (*)
12. D) Undefined behavior
13. Explanation: Switch cases fall through silently; -Wimplicit-fallthrough (in -Wall) warns about likely-unintended fallthrough.
14. Q2: Which loop checks its condition AFTER the first iteration?
15. A) for
16. B) while
17. C) All of the above
18. D) do-while (*)
19. Explanation: do-while runs the body, then tests the condition; the body always executes at least once.
20. Q3: What is the result of `for (size_t i = 5; i >= 0; i--) printf("%zu", i);`?
21. A) Prints 5 4 3 2 1 0 SIZE_MAX ... infinite loop (*)
22. B) Prints 5 4 3 2 1 0 and stops
23. C) Compile error
24. D) Undefined behavior
25. Explanation: size_t is unsigned, so after i=0 it wraps to SIZE_MAX and the loop never terminates.
26. Q4: In `if (p && p->value)`, when is `p->value` accessed?
27. A) Always
28. B) Only when p is non-null (*)
29. C) Only when p is null
30. D) Twice
31. Explanation: && short-circuits — if p is NULL, the right side is not evaluated, avoiding a null-pointer dereference.
32. Q5: What does the comma operator `a, b` evaluate to?
33. A) a
34. B) The sum a+b
35. C) b (*)
36. D) A compile error
37. Explanation: The comma operator evaluates left-to-right and yields the right operand's value; common in `for (i=0, j=N; ...)`.
38. Q6: What does `if (x = 0)` do?
39. A) Compares x to 0
40. B) Compile error
41. C) Loops forever
42. D) Assigns 0 to x and is always false (*)
43. Explanation: `=` is assignment; the result is 0, which is false, so the if-body never runs. -Wall warns.
44. Q7: Which header introduces `true`, `false`, and `bool`?
45. A) <stdbool.h> (*)
46. B) <stdbool.h> in C99
47. C) <bool.h>
48. D) <stdbool.h> only in C23
49. Explanation: C99 added _Bool and the <stdbool.h> macros true/false/bool; C23 makes bool/true/false keywords.
50. Q8: When is `goto` considered acceptable in C?
51. A) Never
52. B) For jumping to cleanup labels in multi-resource functions (*)
53. C) For replacing all for-loops
54. D) Only inside switch statements
55. Explanation: The Linux kernel style uses goto for centralized cleanup (fclose, free, unlock) when a function has multiple error paths.
56. Q9: What does `for (i=0; i<n; i++);` (note the trailing semicolon) do?
57. A) Syntax error
58. B) Runs the loop body n times
59. C) Runs the empty statement n times, then continues — the next block runs once (*)
60. D) Infinite loop
61. Explanation: The semicolon is the loop body; the following block is not part of the loop.
62. Q10: What does `switch` require for its controlling expression?
63. A) Any type
64. B) A pointer
65. C) A string
66. D) An integer type (*)
67. Explanation: switch works on integer (and enum) types only; case labels must be constant integer expressions.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if you forget `break;` in a switch case?
  options:
    - Compile error
    - The default case runs instead
    - The case falls through to the next case
    - Undefined behavior
  correctIndex: 2
  explanation: Switch cases fall through silently; -Wimplicit-fallthrough (in -Wall) warns about likely-unintended fallthrough.
- id: q2
  question: Which loop checks its condition AFTER the first iteration?
  options:
    - for
    - while
    - All of the above
    - do-while
  correctIndex: 3
  explanation: do-while runs the body, then tests the condition; the body always executes at least once.
- id: q3
  question: What is the result of `for (size_t i = 5; i >= 0; i--) printf("%zu", i);`?
  options:
    - Prints 5 4 3 2 1 0 SIZE_MAX ... infinite loop
    - Prints 5 4 3 2 1 0 and stops
    - Compile error
    - Undefined behavior
  correctIndex: 0
  explanation: size_t is unsigned, so after i=0 it wraps to SIZE_MAX and the loop never terminates.
- id: q4
  question: In `if (p && p->value)`, when is `p->value` accessed?
  options:
    - Always
    - Only when p is non-null
    - Only when p is null
    - Twice
  correctIndex: 1
  explanation: "&& short-circuits — if p is NULL, the right side is not evaluated, avoiding a null-pointer dereference."
- id: q5
  question: What does the comma operator `a, b` evaluate to?
  options:
    - a
    - The sum a+b
    - b
    - A compile error
  correctIndex: 2
  explanation: The comma operator evaluates left-to-right and yields the right operand's value; common in `for (i=0, j=N; ...)`.
- id: q6
  question: What does `if (x = 0)` do?
  options:
    - Compares x to 0
    - Compile error
    - Loops forever
    - Assigns 0 to x and is always false
  correctIndex: 3
  explanation: "`=` is assignment; the result is 0, which is false, so the if-body never runs. -Wall warns."
- id: q7
  question: Which header introduces `true`, `false`, and `bool`?
  options:
    - <stdbool.h>
    - <stdbool.h> in C99
    - <bool.h>
    - <stdbool.h> only in C23
  correctIndex: 0
  explanation: C99 added _Bool and the <stdbool.h> macros true/false/bool; C23 makes bool/true/false keywords.
- id: q8
  question: When is `goto` considered acceptable in C?
  options:
    - Never
    - For jumping to cleanup labels in multi-resource functions
    - For replacing all for-loops
    - Only inside switch statements
  correctIndex: 1
  explanation: The Linux kernel style uses goto for centralized cleanup (fclose, free, unlock) when a function has multiple error paths.
- id: q9
  question: What does `for (i=0; i<n; i++);` (note the trailing semicolon) do?
  options:
    - Syntax error
    - Runs the loop body n times
    - Runs the empty statement n times, then continues — the next block runs once
    - Infinite loop
  correctIndex: 2
  explanation: The semicolon is the loop body; the following block is not part of the loop.
- id: q10
  question: What does `switch` require for its controlling expression?
  options:
    - Any type
    - A pointer
    - A string
    - An integer type
  correctIndex: 3
  explanation: switch works on integer (and enum) types only; case labels must be constant integer expressions.
```

