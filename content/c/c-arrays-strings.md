---
slug: c-arrays-strings
id: c-05
track: c
order: 5
title: Arrays and Strings
description: Declare arrays, understand the array-pointer duality, manipulate C strings (null-terminated char arrays), and learn why gets() and strcpy() are forbidden in modern code.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=2700s
whyItMatters: Declare arrays, understand the array-pointer duality, manipulate C strings (null-terminated char arrays), and learn why gets() and strcpy() are forbidden in modern code.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Arrays and Strings

## Arrays and Strings

### Why It Matters

Declare arrays, understand the array-pointer duality, manipulate C strings (null-terminated char arrays), and learn why gets() and strcpy() are forbidden in modern code.

Declare arrays, understand the array-pointer duality, manipulate C strings (null-terminated char arrays), and learn why gets() and strcpy() are forbidden in modern code.

### Prerequisites

- Stage 1: Getting Started with C.
- Stage 2: Variables, Types, and Operators.
- Stage 3: Control Flow.
- Stage 4: Functions and Recursion.

### Topics

- 1-D arrays and array initialization
- Multidimensional arrays
- Array decay to pointer in expressions
- C strings: null-terminated char arrays
- string.h functions: strlen, strcpy, strncpy, strcat, strcmp, strchr, strstr
- Character classification: ctype.h (isdigit, isalpha, toupper)
- fgets vs gets — buffer safety
- Reading and tokenizing strings with strtok and strsep

### Key Concepts

- Arrays are contiguous blocks; `sizeof(arr)` is the total size only in the declaring scope.
- In most expressions an array decays to a pointer to its first element; the size is lost.
- C strings are char arrays terminated by '\0' (the null terminator, value 0).
- "abc" has length 3 but requires 4 bytes of storage (including '\0').
- gets() is removed in C11 because it cannot take a length — use fgets() everywhere.
- strncpy() does NOT guarantee null-termination; you must terminate manually.

```c
#include <stdio.h>
#include <string.h>

static void show_size(int *p) {
    /* Here `p` is a pointer, not an array — sizeof is sizeof(int*) */
    printf("sizeof(p) in callee = %zu\n", sizeof(p));
}

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    printf("sizeof(arr) in main = %zu\n", sizeof(arr));   /* 20 (5*4) */
    printf("count = %zu\n", sizeof(arr)/sizeof(arr[0]));  /* 5 */
    show_size(arr);                                       /* 8 (pointer) */
    return 0;
}
```
Caption: Array initialization and decay

### Common Pitfalls

- Using gets() — removed in C11 because it cannot be used safely; always use fgets(buf, sizeof(buf), stdin).
- Off-by-one in string buffers — `char s[5] = "Hello";` fails: "Hello" needs 6 bytes including '\0'; use size 6 or larger.
- Forgetting to null-terminate after strncpy — strncpy stops at the count, possibly without writing '\0'; always set dst[n-1]='\0'.
- Comparing strings with == — `if (s == "foo")` compares pointers, not contents; use strcmp.
- Returning a pointer to a local array — the array's storage is freed on return; either malloc or take a caller-supplied buffer.

### Real-World Applications

- nginx parses HTTP request lines with custom bounded string functions to avoid buffer overflows at line-rate traffic.
- OpenSSH reads user input exclusively with fgets/snprintf-style bounded functions; gets() would be a remote root hole.
- The Linux kernel uses strscpy() (introduced 2015) instead of strlcpy/strncpy for safe bounded string copies.
- SQLite's VFS layer tokenizes file paths with strtok_r (the reentrant variant) to avoid thread-safety bugs.

### Interview Questions

- 1. What's the difference between `char s[] = "foo";` and `char *s = "foo";`? — The first is a mutable array initialized from the literal; the second points at a read-only literal (UB to modify).
- 2. Why was gets() removed in C11? — It has no length parameter and caused countless buffer overflows (e.g., the Morris worm's fingerd exploit).
- 3. Does strncpy null-terminate? — Only if the source length is less than the count; otherwise the destination is not null-terminated. Always terminate manually.
- 4. What is array decay? — In most expressions, an array converts to a pointer to its first element; sizeof is one of the few exceptions.
- 5. How do you safely read a line of input? — `fgets(buf, sizeof(buf), stdin)` reads at most sizeof(buf)-1 bytes and null-terminates.

### Mini Project

Build a CSV Parser: A program that reads a CSV file from stdin (one row per line, comma-separated) and prints the maximum value in each numeric column. Suggested approach:
  - Read each line with fgets into a 1024-byte buffer
  - Use strtok_r with delimiter "," to tokenize the row
  - For each token, attempt strtol; if it parses, track per-column max in an int array
  - Handle a header row by skipping it
  - Print "col N: max = M" for each column

### Exercises

1. Declare a 3x3 int matrix and write a function to print it; verify array decay makes passing `int m[3][3]` necessary.
2. Reverse a C string in place using two pointers; do NOT use a second buffer.
3. Write your own strlen, strcpy, strcmp using only pointer arithmetic.
4. Read 5 lines from stdin using fgets and print them sorted with qsort + strcmp.
5. Demonstrate the strncpy footgun: copy "Hello, World!" into a 5-byte buffer without terminating, then print it (in a sandbox) and explain the output.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many bytes does `char s[] = "Hello";` occupy?
9. A) 6 (*)
10. B) 5
11. C) 7
12. D) Implementation-defined
13. Explanation: "Hello" is 5 chars plus the implicit null terminator '\0' = 6 bytes total.
14. Q2: Which function was removed in C11 because it cannot be made safe?
15. A) fgets
16. B) gets (*)
17. C) scanf
18. D) strcpy
19. Explanation: gets() has no length parameter; the 1988 Morris worm exploited this in fingerd. Use fgets() instead.
20. Q3: Does strncpy always null-terminate the destination?
21. A) Yes, always
22. B) Only if the source is longer than the count
23. C) Only if the source is shorter than the count (*)
24. D) Never
25. Explanation: strncpy copies up to n bytes and only writes '\0' if the source had fewer than n chars; you must terminate manually.
26. Q4: What does `if (s == "foo")` compare?
27. A) The string contents
28. B) The lengths
29. C) Compile error
30. D) The pointer values (*)
31. Explanation: == on char* compares addresses; use strcmp(s, "foo") == 0 to compare contents.
32. Q5: What is "array decay"?
33. A) An array converts to a pointer to its first element in most expressions (*)
34. B) The array is freed after use
35. C) Arrays become volatile
36. D) The array's size shrinks over time
37. Explanation: Outside sizeof, &, and string-literal initialization, an array name becomes a pointer to element 0.
38. Q6: Which ctype.h function tests if a character is a digit?
39. A) isnum
40. B) isdigit (*)
41. C) is_number
42. D) isnumeric
43. Explanation: isdigit(c) returns non-zero for '0'..'9'; requires the argument as unsigned char or EOF.
44. Q7: How do you strip the trailing newline left by fgets?
45. A) buf[strlen(buf)] = '\0';
46. B) buf[sizeof(buf)] = '\0';
47. C) buf[strcspn(buf, "\n")] = '\0'; (*)
48. D) strcat(buf, "\0");
49. Explanation: strcspn finds the first newline; replacing it with '\0' safely strips the newline (or no-op if none).
50. Q8: What is the safe way to read a line into a 64-byte buffer?
51. A) gets(buf)
52. B) scanf("%s", buf)
53. C) fgets(buf, 1000, stdin)
54. D) fgets(buf, sizeof(buf), stdin) (*)
55. Explanation: fgets takes the buffer size, reads at most size-1 bytes, and null-terminates.
56. Q9: Which strtok variant is safe to use across multiple threads?
57. A) strtok_r (*)
58. B) strtok
59. C) strtok_s (Windows only)
60. D) None — strtok is the only one
61. Explanation: strtok_r is the POSIX reentrant variant that takes a saveptr; strtok uses a static internal pointer.
62. Q10: What is the type of `"abc"` in C?
63. A) char *
64. B) char[4] (a static array of 4 chars including '\0') (*)
65. C) const char *
66. D) const char[3]
67. Explanation: A string literal is a static char array of length+1; modifying it is undefined behavior (often segfault).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many bytes does `char s[] = "Hello";` occupy?
  options:
    - "6"
    - "5"
    - "7"
    - Implementation-defined
  correctIndex: 0
  explanation: "\"Hello\" is 5 chars plus the implicit null terminator '\\0' = 6 bytes total."
- id: q2
  question: Which function was removed in C11 because it cannot be made safe?
  options:
    - fgets
    - gets
    - scanf
    - strcpy
  correctIndex: 1
  explanation: gets() has no length parameter; the 1988 Morris worm exploited this in fingerd. Use fgets() instead.
- id: q3
  question: Does strncpy always null-terminate the destination?
  options:
    - Yes, always
    - Only if the source is longer than the count
    - Only if the source is shorter than the count
    - Never
  correctIndex: 2
  explanation: strncpy copies up to n bytes and only writes '\0' if the source had fewer than n chars; you must terminate manually.
- id: q4
  question: What does `if (s == "foo")` compare?
  options:
    - The string contents
    - The lengths
    - Compile error
    - The pointer values
  correctIndex: 3
  explanation: == on char* compares addresses; use strcmp(s, "foo") == 0 to compare contents.
- id: q5
  question: What is "array decay"?
  options:
    - An array converts to a pointer to its first element in most expressions
    - The array is freed after use
    - Arrays become volatile
    - The array's size shrinks over time
  correctIndex: 0
  explanation: Outside sizeof, &, and string-literal initialization, an array name becomes a pointer to element 0.
- id: q6
  question: Which ctype.h function tests if a character is a digit?
  options:
    - isnum
    - isdigit
    - is_number
    - isnumeric
  correctIndex: 1
  explanation: isdigit(c) returns non-zero for '0'..'9'; requires the argument as unsigned char or EOF.
- id: q7
  question: How do you strip the trailing newline left by fgets?
  options:
    - buf[strlen(buf)] = '\0';
    - buf[sizeof(buf)] = '\0';
    - buf[strcspn(buf, "\n")] = '\0';
    - strcat(buf, "\0");
  correctIndex: 2
  explanation: strcspn finds the first newline; replacing it with '\0' safely strips the newline (or no-op if none).
- id: q8
  question: What is the safe way to read a line into a 64-byte buffer?
  options:
    - gets(buf)
    - scanf("%s", buf)
    - fgets(buf, 1000, stdin)
    - fgets(buf, sizeof(buf), stdin)
  correctIndex: 3
  explanation: fgets takes the buffer size, reads at most size-1 bytes, and null-terminates.
- id: q9
  question: Which strtok variant is safe to use across multiple threads?
  options:
    - strtok_r
    - strtok
    - strtok_s (Windows only)
    - None — strtok is the only one
  correctIndex: 0
  explanation: strtok_r is the POSIX reentrant variant that takes a saveptr; strtok uses a static internal pointer.
- id: q10
  question: What is the type of `"abc"` in C?
  options:
    - char *
    - char[4] (a static array of 4 chars including '\0')
    - const char *
    - const char[3]
  correctIndex: 1
  explanation: A string literal is a static char array of length+1; modifying it is undefined behavior (often segfault).
```

