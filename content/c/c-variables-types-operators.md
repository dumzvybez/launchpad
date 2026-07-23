---
slug: c-variables-types-operators
id: c-02
track: c
order: 2
title: Variables, Types, and Operators
description: Declare variables of every primitive type, understand fixed-width integers from <stdint.h>, and master C's operator set and precedence rules.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=600s
whyItMatters: Declare variables of every primitive type, understand fixed-width integers from <stdint. h>, and master C's operator set and precedence rules.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Declare variables of every primitive type, understand fixed-width integers from <stdint. h>, and master C's operator set and precedence rules.

Declare variables of every primitive type, understand fixed-width integers from <stdint.h>, and master C's operator set and precedence rules.

### Prerequisites

- Stage 1: Getting Started with C.
- A working gcc/clang install and the ability to compile hello.c.

### Topics

- Primitive types: char, short, int, long, long long, float, double
- Fixed-width integers: int8_t, int16_t, int32_t, int64_t, uint*_t
- Signed vs unsigned and sign extension
- Variable declaration, initialization, and const
- Arithmetic, relational, logical, bitwise, and assignment operators
- Operator precedence and associativity
- Implicit and explicit type conversion (casts)
- sizeof and limits.h / float.h

### Key Concepts

- C leaves many type sizes implementation-defined; use <stdint.h> when size matters.
- Integer arithmetic wraps modulo 2^N for unsigned types; signed overflow is undefined behavior.
- char may be signed or unsigned by default — portability hazard.
- Operator precedence is non-intuitive; when in doubt, parenthesize.
- Implicit conversions (integer promotion, usual arithmetic conversions) silently change types.
- sizeof is a compile-time operator (except for VLAs), returning size_t bytes.

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    int32_t  signed_32   = -123456;
    uint64_t unsigned_64 = 18014398509481984ULL;
    size_t   sz          = sizeof(unsigned_64);
    printf("s32=%d  u64=%llu  bytes=%zu\n",
           signed_32,
           (unsigned long long)unsigned_64,
           sz);
    return 0;
}
```
Caption: Fixed-width integers

### Common Pitfalls

- Using `=` instead of `==` in a condition — `if (x = 5)` assigns and is truthy; enable `-Wparentheses` (in -Wall) or write `if (5 == x)` ("Yoda" style).
- Signed integer overflow — `INT_MAX + 1` is undefined behavior, not a wraparound; use unsigned types when you need modular arithmetic.
- Mixing signed and unsigned in comparisons — `-1 < (unsigned)1` is false because -1 gets converted to a huge unsigned value; compile with -Wsign-compare.
- Forgetting that `char` may be signed — on x86 `char c = 200;` yields -56; use `unsigned char` for byte data.
- Assuming int is 32 bits — on embedded platforms int may be 16 bits; use int32_t when the size matters.

### Real-World Applications

- The Linux kernel uses int32_t, uintptr_t, and __u32 extensively so the same source compiles on 32-bit and 64-bit CPUs.
- SQLite's on-disk page format uses fixed-width uint16_t and uint32_t fields so the file layout is identical across platforms.
- libpng and libjpeg manipulate pixels as `unsigned char` arrays to avoid sign-extension bugs in alpha blending.
- OpenSSL's bignum library uses arrays of uint64_t to implement portable big-integer arithmetic.

### Interview Questions

- 1. What's the difference between int32_t and long on a 64-bit Linux? — int32_t is exactly 32 bits; long is 64 bits on LP64 Linux but 32 bits on LLP64 Windows.
- 2. What is undefined behavior, and why does signed overflow qualify? — Behavior the standard does not define; the compiler may assume it doesn't happen, enabling optimizations that surprise you.
- 3. What's the value of `sizeof('A')` in C vs C++? — In C, 'A' is an int, so sizeof is 4 (typically); in C++ it's a char, so sizeof is 1.
- 4. Explain sign extension. — When a signed integer is widened, the sign bit is replicated to fill the high bits; unsigned types zero-extend.
- 5. What does the comma operator do? — Evaluates left-to-right, returns the right operand; rare in application code but used in `for` loops like `for (i=0, j=n; i<j; i++, j--)`.

### Mini Project

Build a Bit Twiddler CLI: A program that takes a hex number and prints its binary representation, sets and clears individual bits, and toggles bit N. Suggested approach:
  - Use strtoul to parse argv[1] as a base-16 number
  - Print 32 bits from MSB to LSB using shifts and `& 1`
  - Implement set_bit, clear_bit, toggle_bit functions taking unsigned int and bit index
  - Guard against bit index >= 32 with an error return
  - Compile with -Wall -Wextra -Wconversion

### Exercises

1. Print sizeof for char, short, int, long, long long, float, double, void* on your platform; explain the results.
2. Set bit 5 of an unsigned int, then clear it, then toggle it — print the value at each step.
3. Multiply by 7 using only shifts and adds; verify against `x * 7`.
4. Find the bug: `if (x & 0x1 == 0)` — explain why this is wrong and fix it.
5. Use <limits.h> to print CHAR_MIN, INT_MAX, LLONG_MIN, ULLONG_MAX.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is sizeof(int32_t) on a compliant C11 implementation?
9. A) Implementation-defined, may be 2
10. B) Always 4 (*)
11. C) Always 8 on 64-bit systems
12. D) 4 on Linux, 2 on Windows
13. Explanation: int32_t is exactly 32 bits = 4 bytes by definition; if the platform lacks such a type, int32_t is not defined.
14. Q2: What is the result of signed `INT_MAX + 1`?
15. A) INT_MIN (two's complement wraparound)
16. B) Implementation-defined
17. C) Undefined behavior (*)
18. D) A trap representation
19. Explanation: Signed overflow is UB in C; the compiler may assume it doesn't happen and optimize based on that.
20. Q3: What does `if (x = 5)` do?
21. A) Compile error
22. B) Compares x to 5
23. C) Nothing — statement has no effect
24. D) Assigns 5 to x and is always true (*)
25. Explanation: `=` is assignment; the result is the assigned value, 5, which is non-zero (true). -Wall warns about this.
26. Q4: On a platform where `char` is signed, what is `(int)(char)200`?
27. A) -56 (*)
28. B) 200
29. C) 0xC8
30. D) Undefined behavior
31. Explanation: 200 doesn't fit in signed 8-bit (max 127); the bit pattern 0xC8 is reinterpreted as -56 in two's complement.
32. Q5: Which operator has higher precedence?
33. A) `==` over `&`
34. B) `&` over `==` (*)
35. C) They have equal precedence, left-to-right
36. D) They have equal precedence, right-to-left
37. Explanation: Bitwise `&` is below relational operators, so `a & b == c` parses as `a & (b == c)`.
38. Q6: Which header declares uint8_t, int32_t, uintptr_t?
39. A) <stdlib.h>
40. B) <types.h>
41. C) <stdint.h> (*)
42. D) <inttypes.h>
43. Explanation: <stdint.h> (C99) defines fixed-width integer types; <inttypes.h> adds printf/scanf format specifiers like PRId32.
44. Q7: What is `-1 < (unsigned)1` in C?
45. A) True (1)
46. B) Implementation-defined
47. C) Undefined behavior
48. D) False (0) (*)
49. Explanation: The usual arithmetic conversions promote -1 to unsigned, yielding UINT_MAX, which is greater than 1.
50. Q8: What does `sizeof('A')` return in C (not C++)?
51. A) 4 (typically) (*)
52. B) 1
53. C) 2
54. D) Implementation-defined
55. Explanation: In C, character constants have type int, so sizeof('A') == sizeof(int), usually 4.
56. Q9: Which is a portable way to compute `x * 7`?
57. A) `x << 3 - x`
58. B) `(x << 3) - x` (*)
59. C) `x << 7`
60. D) `x << 2 + x << 1 + x`
61. Explanation: `x << 3` is 8x; subtract x for 7x. Parentheses are required because `-` binds tighter than `<<`.
62. Q10: What does `size_t` represent?
63. A) The size of a pointer
64. B) The size of an int
65. C) An unsigned type for object sizes and array indices (*)
66. D) A signed type for byte counts
67. Explanation: size_t is the unsigned result type of sizeof, suitable for array indices and memory sizes; print with %zu.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is sizeof(int32_t) on a compliant C11 implementation?
  options:
    - Implementation-defined, may be 2
    - Always 4
    - Always 8 on 64-bit systems
    - 4 on Linux, 2 on Windows
  correctIndex: 1
  explanation: int32_t is exactly 32 bits = 4 bytes by definition; if the platform lacks such a type, int32_t is not defined.
- id: q2
  question: What is the result of signed `INT_MAX + 1`?
  options:
    - INT_MIN (two's complement wraparound)
    - Implementation-defined
    - Undefined behavior
    - A trap representation
  correctIndex: 2
  explanation: Signed overflow is UB in C; the compiler may assume it doesn't happen and optimize based on that.
- id: q3
  question: What does `if (x = 5)` do?
  options:
    - Compile error
    - Compares x to 5
    - Nothing — statement has no effect
    - Assigns 5 to x and is always true
  correctIndex: 3
  explanation: "`=` is assignment; the result is the assigned value, 5, which is non-zero (true). -Wall warns about this."
- id: q4
  question: On a platform where `char` is signed, what is `(int)(char)200`?
  options:
    - "-56"
    - "200"
    - "0xC8"
    - Undefined behavior
  correctIndex: 0
  explanation: 200 doesn't fit in signed 8-bit (max 127); the bit pattern 0xC8 is reinterpreted as -56 in two's complement.
- id: q5
  question: Which operator has higher precedence?
  options:
    - "`==` over `&`"
    - "`&` over `==`"
    - They have equal precedence, left-to-right
    - They have equal precedence, right-to-left
  correctIndex: 1
  explanation: Bitwise `&` is below relational operators, so `a & b == c` parses as `a & (b == c)`.
- id: q6
  question: Which header declares uint8_t, int32_t, uintptr_t?
  options:
    - <stdlib.h>
    - <types.h>
    - <stdint.h>
    - <inttypes.h>
  correctIndex: 2
  explanation: <stdint.h> (C99) defines fixed-width integer types; <inttypes.h> adds printf/scanf format specifiers like PRId32.
- id: q7
  question: What is `-1 < (unsigned)1` in C?
  options:
    - True (1)
    - Implementation-defined
    - Undefined behavior
    - False (0)
  correctIndex: 3
  explanation: The usual arithmetic conversions promote -1 to unsigned, yielding UINT_MAX, which is greater than 1.
- id: q8
  question: What does `sizeof('A')` return in C (not C++)?
  options:
    - 4 (typically)
    - "1"
    - "2"
    - Implementation-defined
  correctIndex: 0
  explanation: In C, character constants have type int, so sizeof('A') == sizeof(int), usually 4.
- id: q9
  question: Which is a portable way to compute `x * 7`?
  options:
    - "`x << 3 - x`"
    - "`(x << 3) - x`"
    - "`x << 7`"
    - "`x << 2 + x << 1 + x`"
  correctIndex: 1
  explanation: "`x << 3` is 8x; subtract x for 7x. Parentheses are required because `-` binds tighter than `<<`."
- id: q10
  question: What does `size_t` represent?
  options:
    - The size of a pointer
    - The size of an int
    - An unsigned type for object sizes and array indices
    - A signed type for byte counts
  correctIndex: 2
  explanation: size_t is the unsigned result type of sizeof, suitable for array indices and memory sizes; print with %zu.
```

