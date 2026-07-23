---
slug: php-variables-types-operators
id: php-02
track: php
order: 2
title: Variables, Types, and Operators
description: Learn how PHP variables work, the four scalar types plus arrays and objects, and the comparison operators — including the infamous `==` vs `===` distinction.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=800s
whyItMatters: Learn how PHP variables work, the four scalar types plus arrays and objects, and the comparison operators — including the infamous `==` vs `===` distinction.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Learn how PHP variables work, the four scalar types plus arrays and objects, and the comparison operators — including the infamous `==` vs `===` distinction.

Learn how PHP variables work, the four scalar types plus arrays and objects, and the comparison operators — including the infamous `==` vs `===` distinction.

### Prerequisites

- Stage 1: Getting Started with PHP
- Comfort running `php script.php` and using `echo`/`printf`.

### Topics

- Variable declaration with `$`, assignment, and reassignment
- Scalar types: int, float, string, bool
- Compound types: array, object
- Special types: null, callable, iterable, resource
- Type juggling and coercion rules
- Arithmetic, assignment, comparison, and logical operators
- `==` (loose) vs `===` (strict) comparison
- The `??` null coalescing operator and `?:` elvis
- `gettype()`, `get_debug_type()`, `is_*` checks
- Integer overflow to float, string-to-number parsing quirks

### Key Concepts

- PHP is dynamically typed: a variable can hold any type, and types are coerced at operation time according to documented rules.
- Loose comparison `==` performs type juggling (`"0" == false` is true); strict comparison `===` requires same type and value.
- `gettype()` returns strings like "integer" and "double" (legacy); `get_debug_type()` (8.0+) returns "int", "float", "null" — preferred for diagnostics.
- Integer overflow silently promotes to float; `PHP_INT_MAX` is platform-dependent (typically 9223372036854775807 on 64-bit).
- Strings starting with a digit are coerced numerically when used in arithmetic: `"5 apples" + 2` equals 7 (with a deprecation notice in 8.x for the trailing non-numeric part).

```php
<?php
$age = 30;                 // int
$price = 19.99;            // float
$name = "Ada";             // string
$active = true;            // bool
$tags = ["php", "web"];    // array
$user = new stdClass();    // object
$user->name = "Grace";
$nothing = null;           // null

echo get_debug_type($age);   // int
echo get_debug_type($user);  // stdClass
```
Caption: Variables and types

### Common Pitfalls

- Using `==` where `===` is needed — `"0" == false`, `null == false`, and `"abc" == 0` (in PHP 7) all evaluate true under loose comparison; use `===` whenever comparing to `0`, `null`, `false`, or empty strings.
- Confusing `isset()` with `empty()` — `isset($x)` is false only if `$x` is null or undeclared; `empty($x)` is true for `0`, `"0"`, `""`, `false`, `null`, and `[]` — so `empty(0)` is true even though the value is set.
- Treating `"0"` as truthy — `"0"` is falsy in PHP (unlike most languages), so `if ("0") { ... }` does not execute.
- Casting floats to ints silently truncates — `(int) 3.99` is `3`, not `4`; use `(int) round(3.99)` if you need rounding.
- Integer overflow silently promotes to float — `PHP_INT_MAX + 1` becomes a float and precision can drop; use GMP or BCMath for big-integer math.

### Real-World Applications

- WordPress uses `===` for capability checks in `current_user_can()` to avoid the type-juggling bugs that historically allowed privilege escalation.
- Slack's PHP backend relied on `===` comparisons for type-tagged identifiers to prevent request-smuggling issues.
- Etsy's codebase ships a project-wide `declare(strict_types=1);` lint rule so all parameter types are enforced across modules.
- Wikipedia's MediaWiki uses `get_debug_type()` in error messages to give editors clearer diagnostics when a hook returns an unexpected type.

### Interview Questions

- 1. What's the difference between `==` and `===`? — `==` performs type juggling before comparing; `===` requires the same type and value.
- 2. What does the `??` operator do? — Null coalescing: returns the left operand if it is set and non-null, otherwise the right; `??=` assigns only if the left is null.
- 3. Why is `"0"` falsy in PHP? — Historical consistency: PHP treats `"0"` like the integer 0, which is falsy; this differs from JavaScript and Python.
- 4. What's the difference between `isset()` and `empty()`? — `isset` is false only for null/undeclared; `empty` is true for `0`, `"0"`, `""`, `false`, `null`, `[]`.
- 5. What happens when an integer overflows `PHP_INT_MAX`? — It silently promotes to a float, which may lose precision; use GMP or BCMath for big integers.

### Mini Project

Build a Type Inspector CLI: A script that takes any PHP literal as a string (e.g. `"42"`, `"3.14"`, `"true"`, `"[1,2]"`) and reports its type, value, and a few coercion side-effects. Suggested approach:
  - Use `eval()` only on a hardcoded allow-list of literals — never on raw input
  - Print `get_debug_type()`, `var_export()`, and `json_encode()` of the value
  - Show what `== 0`, `=== null`, and `empty()` would return
  - Add a `--strict` flag that uses `===` for all comparisons
  - Handle parse errors with a friendly message

### Exercises

1. Create variables of each scalar type plus an array and an object; print `get_debug_type()` for each.
2. Build a truth table for `0`, `"0"`, `""`, `null`, `false`, `[]`, and `"0.0"` under both `== false` and `=== false`.
3. Demonstrate integer overflow: compute `PHP_INT_MAX + 1` and explain why the result is a float.
4. Use `??` and `??=` to set defaults on a nested config array with missing keys.
5. Compare `"abc" == 0` in both PHP 7 and PHP 8 by reading the migration guide — explain what changed and why.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which symbol is used to declare a PHP variable?
9. A) @
10. B) $ (*)
11. C) &
12. D) #
13. Explanation: All PHP variables start with `$`, e.g. `$name = "Ada";`.
14. Q2: What does `var_dump("1" == "01")` print?
15. A) bool(false)
16. B) int(1)
17. C) bool(true) (*)
18. D) string(2) "01"
19. Explanation: Loose `==` compares numeric strings as numbers, so "1" and "01" are equal. `===` would be false.
20. Q3: Which comparison requires both same type AND same value?
21. A) ==
22. B) =
23. C) <=>
24. D) === (*)
25. Explanation: `===` is strict comparison: same type and value. `==` performs type juggling.
26. Q4: What does `empty(0)` return?
27. A) true (*)
28. B) false
29. C) null
30. D) A fatal error
31. Explanation: `empty()` returns true for `0`, `"0"`, `""`, `false`, `null`, and `[]` — so `empty(0)` is true.
32. Q5: What is `PHP_INT_MAX + 1` on a 64-bit build?
33. A) A fatal overflow error
34. B) A float (*)
35. C) The same integer
36. D) null
37. Explanation: Integer overflow silently promotes to float, which may lose precision for very large values.
38. Q6: Which is falsy in PHP?
39. A) "1"
40. B) [0]
41. C) "0" (*)
42. D) "0.0"
43. Explanation: "0" is falsy (consistent with integer 0). "0.0" is a non-numeric-leading-truthy string and is truthy.
44. Q7: What does `$x ?? $y` return?
45. A) The truthy one
46. B) $x if it is truthy, else $y
47. C) The concatenation of $x and $y
48. D) $x if it is set and non-null, else $y (*)
49. Explanation: `??` (null coalescing) returns the left operand if it is set and not null, otherwise the right.
50. Q8: What does `get_debug_type(null)` return in PHP 8+?
51. A) "null" (*)
52. B) "NULL"
53. C) "NULL type"
54. D) "void"
55. Explanation: `get_debug_type()` returns lowercase, normalized names: "int", "float", "null", "stdClass", etc.
56. Q9: What does `(int) "10.9"` evaluate to?
57. A) 11
58. B) 10 (*)
59. C) 10.9
60. D) 0
61. Explanation: Casting a string to int truncates at the first non-integer character; it does not round. Use `(int) round(...)` to round.
62. Q10: Which operator assigns only if the left side is null?
63. A) ?=
64. B) :=?
65. C) ??= (*)
66. D) =?
67. Explanation: `??=` (null coalescing assignment) assigns the right-hand value only if the left is null or unset, introduced in PHP 7.4.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which symbol is used to declare a PHP variable?
  options:
    - "@"
    - $
    - "&"
    - "#"
  correctIndex: 1
  explanation: All PHP variables start with `$`, e.g. `$name = "Ada";`.
- id: q2
  question: What does `var_dump("1" == "01")` print?
  options:
    - bool(false)
    - int(1)
    - bool(true)
    - string(2) "01"
  correctIndex: 2
  explanation: Loose `==` compares numeric strings as numbers, so "1" and "01" are equal. `===` would be false.
- id: q3
  question: Which comparison requires both same type AND same value?
  options:
    - ==
    - =
    - <=>
    - ===
  correctIndex: 3
  explanation: "`===` is strict comparison: same type and value. `==` performs type juggling."
- id: q4
  question: What does `empty(0)` return?
  options:
    - "true"
    - "false"
    - "null"
    - A fatal error
  correctIndex: 0
  explanation: '`empty()` returns true for `0`, `"0"`, `""`, `false`, `null`, and `[]` — so `empty(0)` is true.'
- id: q5
  question: What is `PHP_INT_MAX + 1` on a 64-bit build?
  options:
    - A fatal overflow error
    - A float
    - The same integer
    - "null"
  correctIndex: 1
  explanation: Integer overflow silently promotes to float, which may lose precision for very large values.
- id: q6
  question: Which is falsy in PHP?
  options:
    - '"1"'
    - "[0]"
    - '"0"'
    - '"0.0"'
  correctIndex: 2
  explanation: '"0" is falsy (consistent with integer 0). "0.0" is a non-numeric-leading-truthy string and is truthy.'
- id: q7
  question: What does `$x ?? $y` return?
  options:
    - The truthy one
    - $x if it is truthy, else $y
    - The concatenation of $x and $y
    - $x if it is set and non-null, else $y
  correctIndex: 3
  explanation: "`??` (null coalescing) returns the left operand if it is set and not null, otherwise the right."
- id: q8
  question: What does `get_debug_type(null)` return in PHP 8+?
  options:
    - '"null"'
    - '"NULL"'
    - '"NULL type"'
    - '"void"'
  correctIndex: 0
  explanation: '`get_debug_type()` returns lowercase, normalized names: "int", "float", "null", "stdClass", etc.'
- id: q9
  question: What does `(int) "10.9"` evaluate to?
  options:
    - "11"
    - "10"
    - "10.9"
    - "0"
  correctIndex: 1
  explanation: Casting a string to int truncates at the first non-integer character; it does not round. Use `(int) round(...)` to round.
- id: q10
  question: Which operator assigns only if the left side is null?
  options:
    - ?=
    - :=?
    - ??=
    - =?
  correctIndex: 2
  explanation: "`??=` (null coalescing assignment) assigns the right-hand value only if the left is null or unset, introduced in PHP 7.4."
```

