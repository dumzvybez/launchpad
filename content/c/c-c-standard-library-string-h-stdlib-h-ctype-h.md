---
slug: c-c-standard-library-string-h-stdlib-h-ctype-h
id: c-14
track: c
order: 14
title: The C Standard Library — string.h, stdlib.h, ctype.h
description: Survey the most-used headers of the C standard library — string.h for memory and strings, stdlib.h for allocation and conversion, ctype.h for character classification.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=9000s
whyItMatters: Survey the most-used headers of the C standard library — string. h for memory and strings, stdlib.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# The C Standard Library — string.h, stdlib.h, ctype.h

## The C Standard Library — string.h, stdlib.h, ctype.h

### Why It Matters

Survey the most-used headers of the C standard library — string. h for memory and strings, stdlib.

Survey the most-used headers of the C standard library — string.h for memory and strings, stdlib.h for allocation and conversion, ctype.h for character classification.

### Prerequisites

- Stage 5: Arrays and Strings.
- Stage 8: Dynamic Memory.
- Stage 13: Multi-File Projects.

### Topics

- string.h: strlen, strcpy, strncpy, strcat, strncat, strcmp, strncmp
- string.h memory: memcpy, memmove, memset, memcmp, memchr
- string.h search: strchr, strrchr, strstr, strtok
- stdlib.h: malloc/calloc/realloc/free (recap), exit, atexit
- stdlib.h conversion: atoi, strtol, strtod, strtof, strtoul
- stdlib.h sorting: qsort, bsearch
- ctype.h: isalpha, isdigit, isspace, toupper, tolower
- stdlib.h random: rand, srand, arc4random (BSD)

### Key Concepts

- string.h is the workhorse for both C strings and raw memory.
- memcpy vs memmove: memmove handles overlapping regions; memcpy does not (UB on overlap).
- strtoX family is safer than atoX — they detect overflow and report the end pointer.
- qsort is generic but uses indirect function calls; for tight loops, custom sorts are faster.
- ctype.h functions take int arguments that must be EOF or unsigned char — passing a signed char is UB.
- rand() is weak; use arc4random (BSD) or /dev/urandom for cryptographic randomness.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[10] = "abcdefg";

    /* Overlapping copy forward — memcpy is UB here */
    /* memmove handles overlap correctly */
    memmove(buf + 2, buf, 5);   /* "ababcde" */
    printf("%s\n", buf);

    return 0;
}
```
Caption: memcpy vs memmove

### Common Pitfalls

- Using memcpy on overlapping regions — UB; results are platform-dependent. Use memmove when regions may overlap.
- Passing a negative char to isalpha — `isalpha((char)0xC8)` is UB; cast to `unsigned char` first.
- Using atoi for parsing — atoi has no error detection; it silently returns 0 on failure and UB on overflow. Use strtol.
- Forgetting that strtok is not reentrant — it uses a static buffer; use strtok_r (POSIX) or strtok_s (C11 Annex K) in multi-threaded code.
- Calling rand() without srand — every run produces the same sequence; call srand(time(NULL)) once, or better, use arc4random.

### Real-World Applications

- nginx's string handling uses its own ngx_string functions on top of memcmp/memcpy for HTTP header comparison at line rate.
- SQLite's VFS layer uses memmove to handle overlapping buffer shifts during file format upgrades.
- Redis's SDS (simple dynamic strings) wraps memcpy/memmove to provide a length-prefixed, binary-safe string type.
- The glibc implementation of qsort uses introspective sort (quicksort + heapsort fallback) to avoid O(n^2) on adversarial inputs.

### Interview Questions

- 1. What's the difference between memcpy and memmove? — memmove handles overlapping regions correctly; memcpy is undefined on overlap (but may work on some platforms).
- 2. Why is strtol safer than atoi? — strtol sets errno on overflow, returns a pointer to the first unparsed character, and detects "no digits parsed".
- 3. Why must you cast a char to unsigned char before passing to isalpha? — ctype functions take int but require the value as unsigned char or EOF; a negative char is UB.
- 4. Is rand() thread-safe? — No; rand uses a hidden state. Use rand_r (POSIX) or arc4random (BSD), or drbg variants from a crypto library.
- 5. What does bsearch return if the key is not found? — NULL; if found, a pointer to the matching element in the sorted array.

### Mini Project

Build a Word Frequency Counter: A program that reads text from stdin, tokenizes on whitespace/punctuation, and prints the top 10 words by count. Suggested approach:
  - Read line by line with fgets
  - Tokenize with strtok_r using " \t\n.,;:!?" as delimiters
  - Lowercase each token with tolower
  - Store words in a dynamic array of {char *word; int count;} structs
  - Linear search to increment, qsort by count descending at the end, print top 10

### Exercises

1. Implement your own memcpy and memmove; demonstrate the overlap difference.
2. Use strtol to parse a hex number (base 16) and detect errors.
3. Sort an array of strings (case-insensitive) with qsort + strcasecmp.
4. Use bsearch to look up an int in a sorted array.
5. Count vowels, consonants, digits, and whitespace in a string using ctype.h.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between memcpy and memmove?
9. A) memcpy is faster
10. B) memmove handles overlapping regions; memcpy is UB on overlap (*)
11. C) memcpy is for chars; memmove is for ints
12. D) No difference
13. Explanation: memmove is overlap-safe (uses a temporary buffer if needed); memcpy may corrupt on overlap.
14. Q2: Why prefer strtol over atoi?
15. A) strtol is faster
16. B) atoi is deprecated
17. C) strtol detects overflow and reports the end pointer (*)
18. D) strtol works on floats
19. Explanation: atoi silently returns 0 on failure and UB on overflow; strtol sets errno=ERANGE and gives a pointer to the first unparsed char.
20. Q3: What must you do before passing a char to isalpha?
21. A) Cast to int
22. B) Cast to long
23. C) Nothing — char is fine
24. D) Cast to unsigned char (*)
25. Explanation: ctype functions require the argument as unsigned char or EOF; a negative signed char is UB.
26. Q4: Which string function is NOT reentrant?
27. A) strtok (*)
28. B) strlen
29. C) strcmp
30. D) memcpy
31. Explanation: strtok uses a static internal pointer; use strtok_r (POSIX) or strtok_s (Annex K) in multi-threaded code.
32. Q5: What does qsort's comparator return for a < b?
33. A) 1
34. B) A negative value (*)
35. C) 0
36. D) A positive value
37. Explanation: The comparator returns <0 if a<b, 0 if equal, >0 if a>b — matching strcmp's contract.
38. Q6: What does bsearch return if the key is not found?
39. A) 0
40. B) -1
41. C) NULL (*)
42. D) The last element
43. Explanation: bsearch returns NULL on miss; on hit it returns a pointer to the matching element.
44. Q7: What does memset(buf, 0, n) do?
45. A) Reads n bytes from buf
46. B) Compares n bytes
47. C) Moves n bytes
48. D) Sets n bytes of buf to 0 (*)
49. Explanation: memset fills the first n bytes of buf with the given byte value (here 0); commonly used to zero memory.
50. Q8: What does `srand(time(NULL))` do?
51. A) Seeds the random number generator with the current time (*)
52. B) Sleeps for a random time
53. C) Generates a random time
54. D) Resets the random number generator
55. Explanation: srand seeds the rand() PRNG; calling with time(NULL) makes each program run produce a different sequence.
56. Q9: Which is NOT a ctype.h function?
57. A) isalpha
58. B) strtok (*)
59. C) toupper
60. D) isdigit
61. Explanation: strtok is in <string.h>; ctype.h has classification (isalpha, isdigit, isspace) and conversion (toupper, tolower).
62. Q10: What does strchr return if the character is not found?
63. A) 0
64. B) -1
65. C) NULL (*)
66. D) The last character
67. Explanation: strchr returns NULL when the character is not present; otherwise a pointer to the first occurrence.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between memcpy and memmove?
  options:
    - memcpy is faster
    - memmove handles overlapping regions; memcpy is UB on overlap
    - memcpy is for chars; memmove is for ints
    - No difference
  correctIndex: 1
  explanation: memmove is overlap-safe (uses a temporary buffer if needed); memcpy may corrupt on overlap.
- id: q2
  question: Why prefer strtol over atoi?
  options:
    - strtol is faster
    - atoi is deprecated
    - strtol detects overflow and reports the end pointer
    - strtol works on floats
  correctIndex: 2
  explanation: atoi silently returns 0 on failure and UB on overflow; strtol sets errno=ERANGE and gives a pointer to the first unparsed char.
- id: q3
  question: What must you do before passing a char to isalpha?
  options:
    - Cast to int
    - Cast to long
    - Nothing — char is fine
    - Cast to unsigned char
  correctIndex: 3
  explanation: ctype functions require the argument as unsigned char or EOF; a negative signed char is UB.
- id: q4
  question: Which string function is NOT reentrant?
  options:
    - strtok
    - strlen
    - strcmp
    - memcpy
    - or strtok_s (Annex K) in multi-threaded code.
  correctIndex: 0
  explanation: strtok uses a static internal pointer; use strtok_r (POSIX) or strtok_s (Annex K) in multi-threaded code.
- id: q5
  question: What does qsort's comparator return for a < b?
  options:
    - "1"
    - A negative value
    - "0"
    - A positive value
  correctIndex: 1
  explanation: The comparator returns <0 if a<b, 0 if equal, >0 if a>b — matching strcmp's contract.
- id: q6
  question: What does bsearch return if the key is not found?
  options:
    - "0"
    - "-1"
    - "NULL"
    - The last element
  correctIndex: 2
  explanation: bsearch returns NULL on miss; on hit it returns a pointer to the matching element.
- id: q7
  question: What does memset(buf, 0, n) do?
  options:
    - Reads n bytes from buf
    - Compares n bytes
    - Moves n bytes
    - Sets n bytes of buf to 0
  correctIndex: 3
  explanation: memset fills the first n bytes of buf with the given byte value (here 0); commonly used to zero memory.
- id: q8
  question: What does `srand(time(NULL))` do?
  options:
    - )` do?
    - Seeds the random number generator with the current time
    - Sleeps for a random time
    - Generates a random time
    - Resets the random number generator
    - makes each program run produce a different sequence.
  correctIndex: 1
  explanation: srand seeds the rand() PRNG; calling with time(NULL) makes each program run produce a different sequence.
- id: q9
  question: Which is NOT a ctype.h function?
  options:
    - isalpha
    - strtok
    - toupper
    - isdigit
  correctIndex: 1
  explanation: strtok is in <string.h>; ctype.h has classification (isalpha, isdigit, isspace) and conversion (toupper, tolower).
- id: q10
  question: What does strchr return if the character is not found?
  options:
    - "0"
    - "-1"
    - "NULL"
    - The last character
  correctIndex: 2
  explanation: strchr returns NULL when the character is not present; otherwise a pointer to the first occurrence.
```

