---
slug: python-numbers-booleans-operators
id: python-04
track: python
order: 4
title: Numbers, Booleans, and Operators
description: Master Python's numeric types (int, float, complex, Decimal, Fraction), boolean logic, the full operator set, and the surprising edge cases (float precision, integer caching).
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=2900s
whyItMatters: Master Python's numeric types (int, float, complex, Decimal, Fraction), boolean logic, the full operator set, and the surprising edge cases (float precision, integer caching).
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Numbers, Booleans, and Operators

## Numbers, Booleans, and Operators

### Why It Matters

Master Python's numeric types (int, float, complex, Decimal, Fraction), boolean logic, the full operator set, and the surprising edge cases (float precision, integer caching).

Master Python's numeric types (int, float, complex, Decimal, Fraction), boolean logic, the full operator set, and the surprising edge cases (float precision, integer caching).

### Prerequisites

- Stage 2: Variables and Data Types
- Stage 3: Strings and String Methods (for str-to-number conversion).

### Topics

- int (arbitrary precision), float (IEEE 754 double), complex
- bool as a subclass of int (True=1, False=0)
- Decimal and Fraction from the standard library
- Arithmetic operators (+, -, *, /, //, %, **)
- Comparison operators (==, !=, <, >, <=, >=)
- Logical operators (and, or, not) and short-circuit evaluation
- Bitwise operators (&, |, ^, ~, <<, >>)
- Operator precedence and chaining (a < b < c)
- Integer caching for small ints (-5 to 256)

### Key Concepts

- Python ints have arbitrary precision — no overflow, ever.
- Floats are IEEE 754 doubles — 0.1 + 0.2 != 0.3 due to binary representation.
- `==` is value equality; `is` is identity. Use `is` for None, True, False.
- Short-circuit: `a and b` returns a if a is falsy, else b; never returns a bool unless both operands are bools.
- Chained comparisons (a < b < c) are shorthand for (a < b) and (b < c) with b evaluated once.

```python
print(7 / 2)    # 3.5   — true division (always float)
print(7 // 2)   # 3     — floor division
print(7 % 2)    # 1     — modulo
print(2 ** 10)  # 1024  — exponentiation
print(-7 // 2)  # -4    — floor division rounds toward -inf, not zero!
print(-7 % 2)   # 1     — result has the sign of the divisor
```
Caption: Arithmetic

### Common Pitfalls

- Comparing floats with `==` — use math.isclose(a, b, rel_tol=1e-9) or Decimal for exact decimal arithmetic.
- Confusing `/` (true division, returns float) with `//` (floor division) — `7/2 == 3.5` but `7//2 == 3`.
- Floor division with negatives — `-7 // 2 == -4` (rounds toward -inf), not -3; this surprises people coming from C/Java.
- Relying on `is` for small-int caching — `a is b` for ints outside [-5, 256] is implementation-defined; always use `==` for value comparison.
- Mixing bool arithmetic — `True + True == 2` because bool subclasses int; this is sometimes useful, sometimes a bug.

### Real-World Applications

- Bloomberg's bond pricing systems use Decimal to avoid float rounding errors across trillions of dollars in notional.
- Stripe uses Decimal in its Python SDK for all money calculations to prevent cent-loss bugs.
- Quantopian (and now QuantConnect) used Python's Fraction and Decimal for backtesting fractional-share positions.
- NASA's Python astropy library uses Decimal-aware units for high-precision orbital mechanics.

### Interview Questions

- 1. Why does 0.1 + 0.2 != 0.3 in Python? — Binary floating point can't represent 0.1 exactly; use Decimal or math.isclose.
- 2. What's the difference between /, //, and %? — / is true division (float), // is floor division (int if both int), % is modulo.
- 3. What is short-circuit evaluation? — `a and b` returns a if a is falsy without evaluating b; same for `or`.
- 4. Is bool a subclass of int? — Yes; True==1, False==0, and you can do arithmetic on them.
- 5. What is the small-integer cache? — CPython pre-allocates ints -5..256 for performance; `is` works on them but don't rely on it.

### Mini Project

Build a Tip Calculator CLI: A tool that splits a restaurant bill among N people with configurable tip percent and rounds to cents correctly using Decimal. Suggested approach:
  - Use argparse for bill, tip%, and party size
  - Use Decimal for all money math (string inputs)
  - Round half-up with Decimal(...).quantize(Decimal("0.01"))
  - Print per-person breakdown with f-strings
  - Add a --round-up flag that rounds each share up to the nearest dollar

### Exercises

1. Show that `0.1 + 0.2 == 0.3` is False; then make it True using math.isclose.
2. Compute 2 ** 1000 — confirm Python handles big ints natively (no overflow).
3. Write a function is_leap(year) using chained comparison: `year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`.
4. Use Decimal to compute the monthly payment on a $10,000 loan at 5% APR over 36 months.
5. Demonstrate short-circuit: define `def f(): print("called"); return True` and observe `False and f()` does not call f.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `7 / 2` return in Python 3?
9. A) 3
10. B) 3.0
11. C) 3.5 (*)
12. D) 4
13. Explanation: / always performs true division and returns a float, even when both operands are ints.
14. Q2: What is `0.1 + 0.2 == 0.3`?
15. A) False (*)
16. B) True
17. C) Raises ValueError
18. D) Depends on platform
19. Explanation: Binary float can't represent 0.1 exactly; the sum is 0.30000000000000004, not 0.3.
20. Q3: What does `7 // 2` return?
21. A) 3.5
22. B) 3.0
23. C) 4
24. D) 3 (*)
25. Explanation: // is floor division; for positive ints it truncates toward zero, returning an int when both operands are int.
26. Q4: What does `-7 // 2` return?
27. A) -3
28. B) -4 (*)
29. C) -3.5
30. D) 3
31. Explanation: // floors (rounds toward -inf), so -7 // 2 == -4, not -3 like C/Java's integer division.
32. Q5: Which is correct for comparing two floats a and b?
33. A) a == b
34. B) a is b
35. C) math.isclose(a, b) (*)
36. D) abs(a - b) == 0
37. Explanation: Float math introduces tiny errors; math.isclose compares with a relative tolerance to handle this.
38. Q6: What does `True + True` evaluate to?
39. A) 2 (*)
40. B) True
41. C) "TrueTrue"
42. D) TypeError
43. Explanation: bool subclasses int (True==1, False==0), so True + True == 2.
44. Q7: What does `0 or "fallback"` return?
45. A) 0
46. B) None
47. C) True
48. D) "fallback" (*)
49. Explanation: `or` short-circuits and returns the first truthy operand, or the last operand if all are falsy.
50. Q8: Which range of ints does CPython cache by default?
51. A) 0 to 100
52. B) -5 to 256 (*)
53. C) -128 to 127
54. D) 0 to 1000
55. Explanation: CPython pre-allocates small ints -5..256 for performance; `a is b` works there but should not be relied on.
56. Q9: What does `1 < x < 10` mean?
57. A) (1 < x) < 10 — chained incorrectly
58. B) 1 < (x < 10)
59. C) (1 < x) and (x < 10) with x evaluated once (*)
60. D) SyntaxError
61. Explanation: Python supports chained comparisons natively; equivalent to (1 < x) and (x < 10) with x evaluated once.
62. Q10: Which type should you use for money?
63. A) Decimal (*)
64. B) int (cents)
65. C) float
66. D) Fraction
67. Explanation: Decimal represents decimal fractions exactly (e.g. Decimal("0.1") is precise); float is binary and accumulates rounding errors.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `7 / 2` return in Python 3?
  options:
    - "3"
    - "3.0"
    - "3.5"
    - "4"
  correctIndex: 2
  explanation: / always performs true division and returns a float, even when both operands are ints.
- id: q2
  question: What is `0.1 + 0.2 == 0.3`?
  options:
    - "False"
    - "True"
    - Raises ValueError
    - Depends on platform
  correctIndex: 0
  explanation: Binary float can't represent 0.1 exactly; the sum is 0.30000000000000004, not 0.3.
- id: q3
  question: What does `7 // 2` return?
  options:
    - "3.5"
    - "3.0"
    - "4"
    - "3"
  correctIndex: 3
  explanation: // is floor division; for positive ints it truncates toward zero, returning an int when both operands are int.
- id: q4
  question: What does `-7 // 2` return?
  options:
    - "-3"
    - "-4"
    - "-3.5"
    - "3"
  correctIndex: 1
  explanation: // floors (rounds toward -inf), so -7 // 2 == -4, not -3 like C/Java's integer division.
- id: q5
  question: Which is correct for comparing two floats a and b?
  options:
    - a == b
    - a is b
    - math.isclose(a, b)
    - abs(a - b) == 0
  correctIndex: 2
  explanation: Float math introduces tiny errors; math.isclose compares with a relative tolerance to handle this.
- id: q6
  question: What does `True + True` evaluate to?
  options:
    - "2"
    - "True"
    - '"TrueTrue"'
    - TypeError
  correctIndex: 0
  explanation: bool subclasses int (True==1, False==0), so True + True == 2.
- id: q7
  question: What does `0 or "fallback"` return?
  options:
    - "0"
    - None
    - "True"
    - '"fallback"'
  correctIndex: 3
  explanation: "`or` short-circuits and returns the first truthy operand, or the last operand if all are falsy."
- id: q8
  question: Which range of ints does CPython cache by default?
  options:
    - 0 to 100
    - -5 to 256
    - -128 to 127
    - 0 to 1000
  correctIndex: 1
  explanation: CPython pre-allocates small ints -5..256 for performance; `a is b` works there but should not be relied on.
- id: q9
  question: What does `1 < x < 10` mean?
  options:
    - (1 < x) < 10 — chained incorrectly
    - 1 < (x < 10)
    - (1 < x) and (x < 10) with x evaluated once
    - SyntaxError
  correctIndex: 2
  explanation: Python supports chained comparisons natively; equivalent to (1 < x) and (x < 10) with x evaluated once.
- id: q10
  question: Which type should you use for money?
  options:
    - Decimal
    - int (cents)
    - float
    - Fraction
  correctIndex: 0
  explanation: Decimal represents decimal fractions exactly (e.g. Decimal("0.1") is precise); float is binary and accumulates rounding errors.
```

