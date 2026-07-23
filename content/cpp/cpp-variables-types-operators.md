---
slug: cpp-variables-types-operators
id: cpp-02
track: cpp
order: 2
title: Variables, Types, and Operators
description: Learn the C++ fundamental types, the rules of arithmetic (including signed overflow UB), narrowing conversions, and the operator set with precedence.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=50s
whyItMatters: Learn the C++ fundamental types, the rules of arithmetic (including signed overflow UB), narrowing conversions, and the operator set with precedence.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Learn the C++ fundamental types, the rules of arithmetic (including signed overflow UB), narrowing conversions, and the operator set with precedence.

Learn the C++ fundamental types, the rules of arithmetic (including signed overflow UB), narrowing conversions, and the operator set with precedence.

### Prerequisites

- Stage 1: Getting Started with C++
- Comfort with `g++ -std=c++20 -Wall -Wextra` compilation.

### Topics

- Fundamental types: bool, char, short, int, long, long long, float, double, long double
- Fixed-width integers: int32_t, uint64_t, size_t (from <cstdint>, <cstddef>)
- signed vs unsigned: promotion rules, comparison surprises
- Variable initialization: copy, direct, brace (uniform), default
- const and constexpr
- Arithmetic, comparison, logical, bitwise, shift operators
- Operator precedence and associativity
- Narrowing conversions and brace-init safety
- auto (preview — covered fully in Stage 16)

### Key Concepts

- C++ has many integer types with implementation-defined sizes; use <cstdint> types for portability.
- Signed integer overflow is undefined behavior; unsigned overflow wraps modulo 2^N.
- Brace initialization `T x{...}` prevents narrowing conversions.
- `unsigned` and `signed` comparison silently promotes the signed operand — a classic source of bugs.
- constexpr means "evaluable at compile time"; const means "won't change after init" (not the same thing).
- The size of int, long, etc. depends on the platform; sizeof reports the actual size.

```cpp
#include <iostream>
#include <cstdint>

int main() {
    std::cout << "sizeof(int)       = " << sizeof(int)        << '\n'
              << "sizeof(long)      = " << sizeof(long)       << '\n'
              << "sizeof(void*)     = " << sizeof(void*)      << '\n'
              << "sizeof(int64_t)   = " << sizeof(int64_t)    << '\n';
    return 0;
}
```
Caption: Type sizes

### Common Pitfalls

- Signed integer overflow — use 64-bit types when sums may exceed 2^31; sanitize untrusted inputs; enable -fsanitize=undefined in CI to catch it.
- Mixing signed and unsigned in comparisons — `int i = -1; i < v.size()` evaluates false because i is converted to unsigned; use signed loop counters or explicit casts.
- Relying on `sizeof(int) == 4` — it's 4 on most platforms but 2 on some embedded chips; use int32_t / int64_t when size matters.
- Forgetting that `1 / 2` is 0 (integer division) — cast one operand to double: `1.0 / 2` or `static_cast<double>(1) / 2`.
- Writing `char c = 200;` — char may be signed (implementation-defined), so 200 may become -56; use unsigned char or uint8_t for byte values 128-255.

### Real-World Applications

- Bloomberg's BDE library enforces strict type-size rules with int64_t for monetary calculations to avoid signed overflow.
- Google's protobuf uses fixed-width int32/int64 wire types for portable cross-language serialization.
- Unreal Engine uses int32/int64 typedefs for deterministic cross-platform integer sizes in gameplay code.
- LLVM's APInt class implements arbitrary-precision integers precisely because C++'s signed overflow is UB.

### Interview Questions

- 1. Is signed integer overflow defined behavior in C++? — No, it is undefined behavior; the compiler may assume it cannot happen and optimize accordingly (e.g., remove overflow checks).
- 2. What is the difference between const and constexpr? — const means "won't change after init"; constexpr means "potentially evaluable at compile time"; constexpr implies const for variables.
- 3. What is the most vexing parse? — A syntax ambiguity where `T x(U());` is parsed as a function declaration rather than a variable; use brace init `T x{U()};` to disambiguate.
- 4. What is integer promotion? — Operands smaller than int (bool, char, short) are promoted to int before arithmetic; this affects overload resolution and signedness.
- 5. Why does `unsigned(0) - 1` give a huge number? — Unsigned arithmetic wraps modulo 2^N, so subtracting from 0 yields UINT_MAX (or ULLONG_MAX, etc.).

### Mini Project

Build a Temperature Converter CLI: A program that converts between Celsius, Fahrenheit, and Kelvin. Reads a value and a target scale from argv, prints the converted value with fixed precision. Suggested approach:
  - Parse argv[1] as double (use std::stod; handle std::invalid_argument)
  - Parse argv[2] as the source scale, argv[3] as target scale ("C", "F", "K")
  - Store conversion formulas in a function (Kelvin as the canonical intermediate)
  - Print with std::fixed and std::setprecision(2) from <iomanip>
  - Reject temperatures below absolute zero (-273.15 C) with a clear error

### Exercises

1. Write a program that prints sizeof for every fundamental type; explain why `sizeof(long)` differs between Linux x86-64 (8) and Windows x86-64 (4).
2. Demonstrate signed overflow UB: write a loop that increments an int past INT_MAX, compile with -O2 -fsanitize=undefined, and observe the diagnostic.
3. Write a function that sums a vector<int> using int64_t as the accumulator; explain why int would be unsafe for large inputs.
4. Use brace initialization to provoke a narrowing error: `int x{3.14};` — read the compiler diagnostic.
5. Time the cost of float vs double multiplication in a tight loop of 1e9 iterations; explain the result on your hardware.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is signed integer overflow defined behavior in C++?
9. A) Yes — it wraps like unsigned
10. B) No — it is undefined behavior (*)
11. C) Only in C++20 and later
12. D) Only when -O0 is used
13. Explanation: The C++ standard says signed integer overflow is undefined behavior; compilers exploit this to optimize away overflow checks.
14. Q2: What does brace initialization `int x{3.14};` do?
15. A) Silently truncates to 3
16. B) Rounds to 3
17. C) Produces a compile error — narrowing not allowed (*)
18. D) Prints a warning and continues
19. Explanation: Brace initialization prohibits narrowing conversions, so float-to-int narrowing is a hard error.
20. Q3: What does `unsigned u = 0; std::cout << (u - 1);` print?
21. A) -1
22. B) 0
23. C) Undefined behavior
24. D) The maximum value of unsigned (*)
25. Explanation: Unsigned arithmetic is defined to wrap modulo 2^N, so subtracting 1 from 0 yields the maximum unsigned value.
26. Q4: What is `1 / 2` in C++?
27. A) 0 (*)
28. B) 0.5
29. C) 1
30. D) Compile error
31. Explanation: Integer division truncates toward zero; `1.0 / 2` or `static_cast<double>(1) / 2` produces 0.5.
32. Q5: Which header provides int32_t and int64_t?
33. A) <iostream>
34. B) <cstdint> (*)
35. C) <stdlib.h>
36. D) <cstdint> and <tr1/cstdint>
37. Explanation: <cstdint> defines fixed-width integer types like int8_t, int32_t, int64_t, and the corresponding unsigned variants.
38. Q6: What is the difference between const and constexpr?
39. A) They are identical
40. B) constexpr is a const subset
41. C) const means won't change; constexpr means evaluable at compile time (*)
42. D) const implies constexpr
43. Explanation: const forbids modification after init; constexpr additionally requires the initializer to be a constant expression.
44. Q7: Why is `int i = -1; if (i < v.size())` likely false?
45. A) Because -1 < 0 is false
46. B) Because v.size() is always 0
47. C) Because the comparison is ill-formed
48. D) Because i is converted to unsigned and wraps to a huge value (*)
49. Explanation: When comparing signed and unsigned, the signed operand is converted to unsigned; -1 becomes SIZE_MAX, which is greater than any real size.
50. Q8: What is the "most vexing parse"?
51. A) A syntax ambiguity parsed as a function declaration instead of a variable (*)
52. B) A parse error
53. C) An ambiguous template syntax
54. D) A loop with an off-by-one error
55. Explanation: `T x(U());` is parsed as a function `x` taking a pointer-to-function returning U; use brace init `T x{U()};` to disambiguate.
56. Q9: What does `char c = 200;` do on a platform where char is signed?
57. A) Sets c to 200
58. B) Sets c to -56 (*)
59. C) Is a compile error
60. D) Is implementation-defined behavior but typically 200
61. Explanation: When char is signed (typical on x86), 200 overflows the 8-bit signed range and is interpreted as -56; use unsigned char for byte values 128-255.
62. Q10: Which is the safest way to write a constant 1 billion?
63. A) 1000000000
64. B) 1e9
65. C) 1'000'000'000 (*)
66. D) 1B
67. Explanation: C++14 digit separators (single quotes) make large literals readable; 1e9 is a double, not an int.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is signed integer overflow defined behavior in C++?
  options:
    - Yes — it wraps like unsigned
    - No — it is undefined behavior
    - Only in C++20 and later
    - Only when -O0 is used
  correctIndex: 1
  explanation: The C++ standard says signed integer overflow is undefined behavior; compilers exploit this to optimize away overflow checks.
- id: q2
  question: What does brace initialization `int x{3.14};` do?
  options:
    - Silently truncates to 3
    - Rounds to 3
    - Produces a compile error — narrowing not allowed
    - Prints a warning and continues
  correctIndex: 2
  explanation: Brace initialization prohibits narrowing conversions, so float-to-int narrowing is a hard error.
- id: q3
  question: What does `unsigned u = 0; std::cout << (u - 1);` print?
  options:
    - "-1"
    - "0"
    - Undefined behavior
    - The maximum value of unsigned
  correctIndex: 3
  explanation: Unsigned arithmetic is defined to wrap modulo 2^N, so subtracting 1 from 0 yields the maximum unsigned value.
- id: q4
  question: What is `1 / 2` in C++?
  options:
    - "0"
    - "0.5"
    - "1"
    - Compile error
  correctIndex: 0
  explanation: Integer division truncates toward zero; `1.0 / 2` or `static_cast<double>(1) / 2` produces 0.5.
- id: q5
  question: Which header provides int32_t and int64_t?
  options:
    - <iostream>
    - <cstdint>
    - <stdlib.h>
    - <cstdint> and <tr1/cstdint>
  correctIndex: 1
  explanation: <cstdint> defines fixed-width integer types like int8_t, int32_t, int64_t, and the corresponding unsigned variants.
- id: q6
  question: What is the difference between const and constexpr?
  options:
    - They are identical
    - constexpr is a const subset
    - const means won't change; constexpr means evaluable at compile time
    - const implies constexpr
  correctIndex: 2
  explanation: const forbids modification after init; constexpr additionally requires the initializer to be a constant expression.
- id: q7
  question: Why is `int i = -1; if (i < v.size())` likely false?
  options:
    - Because -1 < 0 is false
    - Because v.size() is always 0
    - Because the comparison is ill-formed
    - Because i is converted to unsigned and wraps to a huge value
  correctIndex: 3
  explanation: When comparing signed and unsigned, the signed operand is converted to unsigned; -1 becomes SIZE_MAX, which is greater than any real size.
- id: q8
  question: What is the "most vexing parse"?
  options:
    - A syntax ambiguity parsed as a function declaration instead of a variable
    - A parse error
    - An ambiguous template syntax
    - A loop with an off-by-one error
  correctIndex: 0
  explanation: "`T x(U());` is parsed as a function `x` taking a pointer-to-function returning U; use brace init `T x{U()};` to disambiguate."
- id: q9
  question: What does `char c = 200;` do on a platform where char is signed?
  options:
    - Sets c to 200
    - Sets c to -56
    - Is a compile error
    - Is implementation-defined behavior but typically 200
  correctIndex: 1
  explanation: When char is signed (typical on x86), 200 overflows the 8-bit signed range and is interpreted as -56; use unsigned char for byte values 128-255.
- id: q10
  question: Which is the safest way to write a constant 1 billion?
  options:
    - "1000000000"
    - "1e9"
    - 1'000'000'000
    - 1B
  correctIndex: 2
  explanation: C++14 digit separators (single quotes) make large literals readable; 1e9 is a double, not an int.
```

