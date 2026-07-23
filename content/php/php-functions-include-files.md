---
slug: php-functions-include-files
id: php-04
track: php
order: 4
title: Functions and Include Files
description: Define reusable functions with type declarations, default and named arguments, variadics, and split your code across files with `include`, `require`, and PSR-4-ready autoloaders.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=2400s
whyItMatters: Define reusable functions with type declarations, default and named arguments, variadics, and split your code across files with `include`, `require`, and PSR-4-ready autoloaders.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Functions and Include Files

## Functions and Include Files

### Why It Matters

Define reusable functions with type declarations, default and named arguments, variadics, and split your code across files with `include`, `require`, and PSR-4-ready autoloaders.

Define reusable functions with type declarations, default and named arguments, variadics, and split your code across files with `include`, `require`, and PSR-4-ready autoloaders.

### Prerequisites

- Stage 1: Getting Started with PHP
- Stage 2: Variables, Types, and Operators
- Stage 3: Control Flow — Conditionals and Loops

### Topics

- Function declaration, parameters, and `return`
- Type declarations: parameter types, return types, union types, intersection types
- `declare(strict_types=1)` and per-file strict mode
- Default arguments, variadic `...$args`, and the spread operator
- Named arguments (PHP 8.0+)
- Variable scope: local, global, static
- `include`, `require`, `include_once`, `require_once`
- Anonymous functions (closures) and arrow functions `fn() =>`
- First-class callable syntax `strlen(...)` (8.1)
- Pass by reference with `&`

### Key Concepts

- Without `declare(strict_types=1)`, PHP coerces argument types at call time (e.g. `function f(int $x)` called with `f("5")` works); with it, type mismatches throw `TypeError`.
- `strict_types` is per-file: only the file that *calls* the function matters, not the file that *defines* it.
- `require` and `include` are identical except `require` triggers a fatal error on failure, while `include` only emits a warning.
- `require_once` tracks included files by absolute path; cyclic `_once` chains work but can mask architecture problems.
- Arrow functions `fn($x) => $x * 2` automatically capture outer variables by value (unlike `function () use ($x)` which must list captures explicitly).

```php
<?php
declare(strict_types=1);

function add(int $a, int $b): int
{
    return $a + $b;
}

function formatPrice(float $amount, string $currency = "USD"): string
{
    return sprintf("%.2f %s", $amount, $currency);
}

echo add(2, 3);                  // 5
// echo add("2", "3");           // TypeError under strict_types
echo formatPrice(19.99);         // "19.99 USD"
echo formatPrice(19.99, "EUR");  // "19.99 EUR"
```
Caption: Function with typed parameters and return type

### Common Pitfalls

- Forgetting `declare(strict_types=1)` at the top of a file — without it, PHP coerces argument types silently (`f("5")` becomes `f(5)`); the directive only affects calls made from the same file, so callers must opt in.
- Using `include` where `require` is meant — a missing `include`d file only warns and continues, which often masks broken configuration; use `require` for mandatory files.
- Capturing loop variables in closures by reference — `function () use (&$i)` captures by reference and is a common cause of "all my closures return the last value"; capture by value or use `fn()` for safety.
- Confusing `return` from an included file with `return` from a function — `include 'config.php'` returns whatever the file returns with `return`, which is the idiomatic way to load config arrays.
- Defining a function inside a conditional — if the condition is false on one request and true on the next, the function may or may not exist; hoist function declarations to the top level or wrap them in `if (!function_exists(...))`.

### Real-World Applications

- WordPress's `wp-includes/load.php` uses `require_once` for hundreds of helper files; the `_once` guard prevents redefinition when plugins also include core files.
- Laravel's `Illuminate\Support` helpers are wrapped in `if (!function_exists('array_wrap'))` so multiple framework versions can coexist.
- Slack's PHP monolith used `declare(strict_types=1)` on every new file as part of their 2018 type-safety push, gradually eliminating type-juggling bugs.
- Symfony's DependencyInjection container compiles closures with `use ($container)` for lazy service resolution, leveraging first-class callable syntax in newer versions.

### Interview Questions

- 1. What does `declare(strict_types=1)` do? — Enforces strict type checking for function calls *in that file*; type mismatches throw `TypeError` instead of coercing.
- 2. What's the difference between `include` and `require`? — Both evaluate and execute the included file; `require` is fatal on failure, `include` only warns.
- 3. How do arrow functions capture variables? — Automatically, by value, from the enclosing scope — no `use()` list needed; they're limited to a single expression.
- 4. What is first-class callable syntax `strlen(...)`? — PHP 8.1+ syntax that converts any callable into a `Closure`, replacing verbose `Closure::fromCallable('strlen')`.
- 5. What does `require_once` use to detect duplicates? — The resolved absolute file path; relative paths that resolve to the same file are deduped correctly.

### Mini Project

Build a Math Helpers Module: A `math_helpers.php` file that defines `factorial(int $n): int`, `fibonacci(int $n): int`, and `is_prime(int $n): bool` with strict types, plus a `cli.php` driver that loads it via `require_once` and runs each function on `$argv`. Suggested approach:
  - Start `math_helpers.php` with `declare(strict_types=1);`
  - Use `gmp_strval(gmp_fact($n))` for large inputs, or a loop for the basic case
  - Throw `InvalidArgumentException` for negative inputs
  - In `cli.php`, parse `$argv` for the function name and argument
  - Use named arguments or a `match` to dispatch to the right function

### Exercises

1. Write a function `greet(string $name, string $greeting = "Hello"): string` and call it with and without the default.
2. Add `declare(strict_types=1)` and observe the `TypeError` when you call `greet(42)`.
3. Rewrite a closure `function ($x) use ($y) { return $x + $y; }` as an arrow function.
4. Use named arguments to call `makeUser(age: 30, name: "Ada")` and verify the result.
5. Create two files: `config.php` returns an array, and `app.php` `require`s it and prints the array — observe that the array is the return value of `require`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `declare(strict_types=1)` enable?
9. A) Strict comparison everywhere
10. B) Strict mode for require/include
11. C) Strict integer overflow handling
12. D) Strict type checking for function calls in the declaring file (*)
13. Explanation: It enforces strict type checking for calls made from that file only; type mismatches throw `TypeError` instead of coercing.
14. Q2: Which statement triggers a fatal error if the file is missing?
15. A) require (*)
16. B) include
17. C) include_once
18. D) eval
19. Explanation: `require` and `require_once` are fatal on failure; `include` and `include_once` only emit a warning.
20. Q3: What does an arrow function `fn($x) => $x * 2` do with outer variables?
21. A) Captures them by reference
22. B) Captures them by value automatically (*)
23. C) Cannot access them
24. D) Requires an explicit `use()` list
25. Explanation: Arrow functions auto-capture outer variables by value; closures need an explicit `use ($var)` list.
26. Q4: What does `strlen(...)` produce in PHP 8.1+?
27. A) A string
28. B) The string's length
29. C) A Closure wrapping the callable (*)
30. D) A syntax error
31. Explanation: The `...` after a callable name is first-class callable syntax: it returns a `Closure` equivalent to `Closure::fromCallable('strlen')`.
32. Q5: How are variadic arguments declared?
33. A) `function f(&$args)`
34. B) `function f($args...)`
35. C) `function f(*$args)`
36. D) `function f(...$args)` (*)
37. Explanation: `...$args` collects all remaining arguments into an array; the spread operator `...$array` unpacks an array into arguments at the call site.
38. Q6: Which is a valid named-argument call (PHP 8.0+)?
39. A) `f(name: "Ada")` (*)
40. B) `f(name = "Ada")`
41. C) `f(name => "Ada")`
42. D) `f("Ada" as name)`
43. Explanation: Named arguments use the `name: value` syntax, allowing you to skip defaults and reorder arguments at the call site.
44. Q7: What does `require_once` use to deduplicate included files?
45. A) The file's basename
46. B) The resolved absolute path (*)
47. C) The file's mtime
48. D) The include path order
49. Explanation: `require_once` (and `include_once`) track included files by their resolved absolute path, so symlinks or different relative paths that resolve to the same file are deduped.
50. Q8: What happens if you define a function inside an `if (false) { ... }` block?
51. A) Always available
52. B) Conditional functions are hoisted anyway
53. C) The function is not defined if the condition is false (*)
54. D) Throws a fatal error
55. Explanation: Functions defined inside conditional blocks exist only if the block executes; this can lead to "undefined function" errors across requests.
56. Q9: What does `function f(int $x): int` enforce without strict_types?
57. A) Nothing — types are ignored
58. B) A TypeError for any non-int
59. C) A deprecation notice
60. D) Coercion: `f("5")` becomes `f(5)` (*)
61. Explanation: Without `declare(strict_types=1)`, PHP coerces argument types at call time: `f("5")` is accepted as `5`. With strict_types, it throws `TypeError`.
62. Q10: What is the return value of `require 'config.php';` if config.php contains `return ['a' => 1];`?
63. A) The array `['a' => 1]` (*)
64. B) true
65. C) 1
66. D) null
67. Explanation: `require` returns whatever the included file returns via `return`, which is the idiomatic way to load config arrays.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `declare(strict_types=1)` enable?
  options:
    - Strict comparison everywhere
    - Strict mode for require/include
    - Strict integer overflow handling
    - Strict type checking for function calls in the declaring file
  correctIndex: 3
  explanation: It enforces strict type checking for calls made from that file only; type mismatches throw `TypeError` instead of coercing.
- id: q2
  question: Which statement triggers a fatal error if the file is missing?
  options:
    - require
    - include
    - include_once
    - eval
  correctIndex: 0
  explanation: "`require` and `require_once` are fatal on failure; `include` and `include_once` only emit a warning."
- id: q3
  question: What does an arrow function `fn($x) => $x * 2` do with outer variables?
  options:
    - Captures them by reference
    - Captures them by value automatically
    - Cannot access them
    - Requires an explicit `use()` list
  correctIndex: 1
  explanation: Arrow functions auto-capture outer variables by value; closures need an explicit `use ($var)` list.
- id: q4
  question: What does `strlen(...)` produce in PHP 8.1+?
  options:
    - A string
    - The string's length
    - A Closure wrapping the callable
    - A syntax error
  correctIndex: 2
  explanation: "The `...` after a callable name is first-class callable syntax: it returns a `Closure` equivalent to `Closure::fromCallable('strlen')`."
- id: q5
  question: How are variadic arguments declared?
  options:
    - "`function f(&$args)`"
    - "`function f($args...)`"
    - "`function f(*$args)`"
    - "`function f(...$args)`"
  correctIndex: 3
  explanation: "`...$args` collects all remaining arguments into an array; the spread operator `...$array` unpacks an array into arguments at the call site."
- id: q6
  question: Which is a valid named-argument call (PHP 8.0+)?
  options:
    - '`f(name: "Ada")`'
    - '`f(name = "Ada")`'
    - '`f(name => "Ada")`'
    - '`f("Ada" as name)`'
  correctIndex: 0
  explanation: "Named arguments use the `name: value` syntax, allowing you to skip defaults and reorder arguments at the call site."
- id: q7
  question: What does `require_once` use to deduplicate included files?
  options:
    - The file's basename
    - The resolved absolute path
    - The file's mtime
    - The include path order
  correctIndex: 1
  explanation: "`require_once` (and `include_once`) track included files by their resolved absolute path, so symlinks or different relative paths that resolve to the same file are deduped."
- id: q8
  question: What happens if you define a function inside an `if (false) { ... }` block?
  options:
    - Always available
    - Conditional functions are hoisted anyway
    - The function is not defined if the condition is false
    - Throws a fatal error
  correctIndex: 2
  explanation: Functions defined inside conditional blocks exist only if the block executes; this can lead to "undefined function" errors across requests.
- id: q9
  question: "What does `function f(int $x): int` enforce without strict_types?"
  options:
    - Nothing — types are ignored
    - A TypeError for any non-int
    - A deprecation notice
    - 'Coercion: `f("5")` becomes `f(5)`'
  correctIndex: 3
  explanation: 'Without `declare(strict_types=1)`, PHP coerces argument types at call time: `f("5")` is accepted as `5`. With strict_types, it throws `TypeError`.'
- id: q10
  question: What is the return value of `require 'config.php';` if config.php contains `return ['a' => 1];`?
  options:
    - The array `['a' => 1]`
    - "true"
    - "1"
    - "null"
  correctIndex: 0
  explanation: "`require` returns whatever the included file returns via `return`, which is the idiomatic way to load config arrays."
```

