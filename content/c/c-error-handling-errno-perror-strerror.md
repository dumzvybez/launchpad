---
slug: c-error-handling-errno-perror-strerror
id: c-15
track: c
order: 15
title: Error Handling — errno, perror, strerror
description: Use errno, perror, and strerror to report errors meaningfully, learn the difference between library errors and signal-based errors, and structure programs with explicit error-propagation patterns.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=9700s
whyItMatters: Use errno, perror, and strerror to report errors meaningfully, learn the difference between library errors and signal-based errors, and structure programs with explicit error-propagation patterns.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Error Handling — errno, perror, strerror

## Error Handling — errno, perror, strerror

### Why It Matters

Use errno, perror, and strerror to report errors meaningfully, learn the difference between library errors and signal-based errors, and structure programs with explicit error-propagation patterns.

Use errno, perror, and strerror to report errors meaningfully, learn the difference between library errors and signal-based errors, and structure programs with explicit error-propagation patterns.

### Prerequisites

- Stage 11: File I/O.
- Stage 13: Multi-File Projects.
- Stage 14: The C Standard Library.

### Topics

- errno as a thread-local int set by library functions
- Common errno values: ENOENT, EACCES, EINVAL, ENOMEM, ERANGE
- perror: print a colon-separated message to stderr
- strerror / strerror_r: convert errno to a string
- Return-code conventions: 0 on success, non-zero on error
- errno pitfalls: not cleared on success, cleared on error
- Out-parameter patterns and goto cleanup
- assert, static_assert, and NDEBUG

### Key Concepts

- errno is set by library functions on failure; it's thread-local since C11 (and POSIX).
- errno is NOT cleared on success — check the return value first, then errno.
- perror prepends a custom message and appends the errno description.
- strerror returns a pointer to a static string (not thread-safe); strerror_r is the reentrant version.
- Convention: return 0 on success, negative or non-zero on error; out-params carry the result.
- assert(expr) aborts if expr is false; disabled by -DNDEBUG in release builds.
- _Static_assert (C11) checks at compile time.

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(void) {
    FILE *fp = fopen("/etc/nonexistent", "r");
    if (!fp) {
        perror("fopen");                          /* "fopen: No such file or directory" */
        printf("errno=%d: %s\n", errno, strerror(errno));
        return 1;
    }
    fclose(fp);
    return 0;
}
```
Caption: errno + perror

### Common Pitfalls

- Checking errno instead of the return value — errno is only meaningful after a known failure; a successful call may leave errno stale.
- Not clearing errno before strtol — a previous call's errno lingers; set errno = 0 before the call.
- Using strerror in multi-threaded code — strerror returns a pointer to a static buffer; use strerror_r.
- Forgetting to free resources on error paths — pair every allocation with a cleanup label; use goto cleanup.
- assert with side effects — `assert(close(fd) == 0);` becomes a no-op under -DNDEBUG, leaking the fd; don't put side effects in assert.

### Real-World Applications

- The Linux kernel uses errno-style negative return codes (e.g., -ENOMEM, -EINVAL) throughout its API.
- SQLite returns an int error code (SQLITE_OK, SQLITE_BUSY, SQLITE_CORRUPT) and provides sqlite3_errmsg() for human-readable text.
- libcurl uses CURLE_* codes plus curl_easy_strerror for human-readable error messages.
- PostgreSQL's backend uses an ereport() macro that combines error severity, errno, and a formatted message into a single throw site.

### Interview Questions

- 1. What is errno and where does it live? — A thread-local int declared in <errno.h>; library functions set it on failure (not on success).
- 2. Why must you check the return value before reading errno? — Successful calls don't clear errno; a stale errno from a prior failure would mislead you.
- 3. What's the difference between strerror and strerror_r? — strerror returns a static buffer (not thread-safe); strerror_r writes into a caller-provided buffer.
- 4. What does assert do, and what happens with -DNDEBUG? — assert(expr) aborts if expr is false; -DNDEBUG makes assert a no-op, so don't put side effects in assert expressions.
- 5. What's the idiomatic C error-propagation pattern? — Return 0 on success, non-zero on error; use goto cleanup to centralize resource release.

### Mini Project

Build a Robust Config Loader: A function `int config_load(const char *path, Config *out)` that opens a file, parses "key=value" lines, and returns 0 on success or -1 with errno set on failure. Suggested approach:
  - Use fopen; on failure, return -1 (errno is already set by fopen)
  - Use goto cleanup to ensure fclose on every path
  - Parse with sscanf("%63[^=]=%255[^\n]", key, value)
  - On a parse error, set errno = EINVAL and goto cleanup
  - Print errors via perror in main, not in the function

### Exercises

1. Open a non-existent file and print both perror and strerror(errno).
2. Write a function that returns 0 on success and -1 with errno set on failure; test it.
3. Use _Static_assert to verify sizeof(int) >= 4 at compile time.
4. Demonstrate the assert-side-effect bug: assert(i++ < 10) compiles fine in debug but does nothing in release.
5. Use strerror_r in a multi-threaded-safe error printer.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is errno?
9. A) A keyword
10. B) A global function
11. C) A thread-local int set by library functions on failure (*)
12. D) A compile-time constant
13. Explanation: errno is a thread-local modifiable lvalue; library functions set it on failure but do not clear it on success.
14. Q2: When is errno valid?
15. A) Always
16. B) Only in main
17. C) Only after perror
18. D) Only after a function returned a failure indication (*)
19. Explanation: Successful calls don't clear errno; check the return value first, then read errno if the call failed.
20. Q3: What does perror do?
21. A) Prints "your_msg: errno_description" to stderr (*)
22. B) Returns an error string
23. C) Exits the program
24. D) Logs to syslog
25. Explanation: perror(s) prints s, a colon, a space, then the strerror(errno) string, then a newline — all to stderr.
26. Q4: Why use strerror_r instead of strerror?
27. A) It's faster
28. B) strerror returns a static buffer (not thread-safe); strerror_r writes to caller-provided buffer (*)
29. C) strerror is deprecated
30. D) strerror doesn't exist
31. Explanation: strerror's static buffer races between threads; strerror_r is reentrant and safe in multi-threaded code.
32. Q5: What does `assert(b != 0)` do under -DNDEBUG?
33. A) Always aborts
34. B) Becomes a runtime check
35. C) Becomes a no-op (*)
36. D) Becomes a compile error
37. Explanation: -DNDEBUG makes assert(expr) expand to ((void)0), so the check is skipped — never put side effects in assert.
38. Q6: What's the idiomatic error-propagation pattern in C?
39. A) Throw exceptions
40. B) Use longjmp
41. C) Use a global error variable
42. D) Return 0 on success, non-zero on error; use goto cleanup for resources (*)
43. Explanation: Return codes plus goto-cleanup is the dominant C pattern; longjmp is reserved for truly exceptional paths.
44. Q7: What does `_Static_assert(cond, msg);` do?
45. A) Compile-time check — fails the build if cond is false (*)
46. B) Runtime check
47. C) Logs a warning
48. D) Aborts the program
49. Explanation: _Static_assert (C11) verifies a constant expression at compile time; useful for portability invariants like sizeof(int) >= 4.
50. Q8: What's the bug in `assert(close(fd) == 0);`?
51. A) Nothing
52. B) With -DNDEBUG, close(fd) is never called, leaking the fd (*)
53. C) close doesn't return a value
54. D) assert can't take a function call
55. Explanation: assert is removed under -DNDEBUG, so any side effects in its expression (like close(fd)) are also removed.
56. Q9: What should you do before calling strtol for error detection?
57. A) Nothing
58. B) Call perror
59. C) Set errno = 0 (*)
60. D) Set the end pointer to NULL
61. Explanation: strtol sets errno on overflow but doesn't clear it on success; setting errno = 0 before the call lets you detect overflow cleanly.
62. Q10: Which errno value indicates "No such file or directory"?
63. A) EINVAL
64. B) EACCES
65. C) ENOMEM
66. D) ENOENT (*)
67. Explanation: ENOENT = Error NO ENTity (file not found); EACCES is permission denied; EINVAL is invalid argument; ENOMEM is out of memory.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is errno?
  options:
    - A keyword
    - A global function
    - A thread-local int set by library functions on failure
    - A compile-time constant
  correctIndex: 2
  explanation: errno is a thread-local modifiable lvalue; library functions set it on failure but do not clear it on success.
- id: q2
  question: When is errno valid?
  options:
    - Always
    - Only in main
    - Only after perror
    - Only after a function returned a failure indication
  correctIndex: 3
  explanation: Successful calls don't clear errno; check the return value first, then read errno if the call failed.
- id: q3
  question: What does perror do?
  options:
    - 'Prints "your_msg: errno_description" to stderr'
    - Returns an error string
    - Exits the program
    - Logs to syslog
  correctIndex: 0
  explanation: perror(s) prints s, a colon, a space, then the strerror(errno) string, then a newline — all to stderr.
- id: q4
  question: Why use strerror_r instead of strerror?
  options:
    - It's faster
    - strerror returns a static buffer (not thread-safe); strerror_r writes to caller-provided buffer
    - strerror is deprecated
    - strerror doesn't exist
  correctIndex: 1
  explanation: strerror's static buffer races between threads; strerror_r is reentrant and safe in multi-threaded code.
- id: q5
  question: What does `assert(b != 0)` do under -DNDEBUG?
  options:
    - Always aborts
    - Becomes a runtime check
    - Becomes a no-op
    - Becomes a compile error
  correctIndex: 2
  explanation: -DNDEBUG makes assert(expr) expand to ((void)0), so the check is skipped — never put side effects in assert.
- id: q6
  question: What's the idiomatic error-propagation pattern in C?
  options:
    - Throw exceptions
    - Use longjmp
    - Use a global error variable
    - Return 0 on success, non-zero on error; use goto cleanup for resources
  correctIndex: 3
  explanation: Return codes plus goto-cleanup is the dominant C pattern; longjmp is reserved for truly exceptional paths.
- id: q7
  question: What does `_Static_assert(cond, msg);` do?
  options:
    - Compile-time check — fails the build if cond is false
    - Runtime check
    - Logs a warning
    - Aborts the program
  correctIndex: 0
  explanation: _Static_assert (C11) verifies a constant expression at compile time; useful for portability invariants like sizeof(int) >= 4.
- id: q8
  question: What's the bug in `assert(close(fd) == 0);`?
  options:
    - Nothing
    - With -DNDEBUG, close(fd) is never called, leaking the fd
    - close doesn't return a value
    - assert can't take a function call
  correctIndex: 1
  explanation: assert is removed under -DNDEBUG, so any side effects in its expression (like close(fd)) are also removed.
- id: q9
  question: What should you do before calling strtol for error detection?
  options:
    - Nothing
    - Call perror
    - Set errno = 0
    - Set the end pointer to NULL
  correctIndex: 2
  explanation: strtol sets errno on overflow but doesn't clear it on success; setting errno = 0 before the call lets you detect overflow cleanly.
- id: q10
  question: Which errno value indicates "No such file or directory"?
  options:
    - EINVAL
    - EACCES
    - ENOMEM
    - ENOENT
  correctIndex: 3
  explanation: ENOENT = Error NO ENTity (file not found); EACCES is permission denied; EINVAL is invalid argument; ENOMEM is out of memory.
```

