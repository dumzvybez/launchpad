---
slug: php-control-flow-conditionals-loops
id: php-03
track: php
order: 3
title: Control Flow — Conditionals and Loops
description: Master `if`/`elseif`/`else`, `switch`, the modern `match` expression, and the loop constructs that replace them in idiomatic PHP.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=1600s
whyItMatters: Master `if`/`elseif`/`else`, `switch`, the modern `match` expression, and the loop constructs that replace them in idiomatic PHP.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master `if`/`elseif`/`else`, `switch`, the modern `match` expression, and the loop constructs that replace them in idiomatic PHP.

Master `if`/`elseif`/`else`, `switch`, the modern `match` expression, and the loop constructs that replace them in idiomatic PHP.

### Prerequisites

- Stage 1: Getting Started with PHP
- Stage 2: Variables, Types, and Operators

### Topics

- `if`, `elseif`, `else` syntax
- `switch` (with loose `==` matching!) and `match` (strict `===`)
- `while`, `do-while`, `for`, and `foreach`
- `break` and `continue` with optional level argument
- Iterating arrays by value vs by reference
- Alternative syntax `if (): ... endif;` for templates
- Ternary `? :` and null-safe `?->` (8.0)
- `match` arms, default, and `UnhandledMatchError`
- Endless-loop prevention and `max_execution_time`

### Key Concepts

- `switch` uses loose `==` comparison — a frequent source of bugs when matching `0` against strings like `"abc"` (PHP 8 changed this slightly, but `switch` is still loose).
- `match` (PHP 8.0+) is an expression (returns a value), uses strict `===`, and throws `UnhandledMatchError` if no arm matches and no default is provided.
- `foreach` by value copies the element; `foreach ($arr as &$v)` iterates by reference and can leave `$v` as a dangling reference — always `unset($v)` after the loop.
- `break N` and `continue N` accept a numeric argument to break out of N nested loops.
- Infinite `while (true)` loops are bounded in web requests by `max_execution_time` (default 30s); CLI scripts have no such limit unless `set_time_limit()` is called.

```php
<?php
declare(strict_types=1);

$score = 82;
if ($score >= 90) {
    $grade = "A";
} elseif ($score >= 80) {
    $grade = "B";
} elseif ($score >= 70) {
    $grade = "C";
} else {
    $grade = "F";
}
echo "Grade: $grade\n";
```
Caption: if / elseif / else

### Common Pitfalls

- Forgetting `break` in `switch` — execution falls through to the next case; intentional fall-through is rare and should be commented.
- Using `switch` with mixed types — `switch (0)` matches `"abc"` under loose comparison in PHP 7 (changed in 8.0 to not match non-numeric strings); use `match` for strict comparison.
- Leaving a dangling reference after `foreach ($arr as &$v)` — always `unset($v)` after the loop, or the next loop silently corrupts the array's last element.
- Using `continue` inside a `switch` — in PHP, `continue` inside `switch` behaves like `break` (and emits a warning in 7.3+); use `continue 2` if you mean "continue the surrounding loop".
- Writing an infinite `while (true)` loop in a web script — `max_execution_time` kills it after 30s by default, but a CLI script will run forever; always include a termination condition or `set_time_limit`.

### Real-World Applications

- WordPress's template-loader uses a large `switch` on the query type (single, page, archive, search) to pick which PHP template file to render.
- Slack's old PHP API gateway used `match`-style dispatch tables (after upgrading to PHP 8) to route requests to handlers without the fall-through bugs of `switch`.
- Wikipedia's MediaWiki uses `foreach` by reference in its parser-cache invalidation code, with explicit `unset()` to avoid the classic reference trap.
- Etsy uses `match(true)` in feature-flag evaluation to replace long `if/elseif` chains, which improved readability and cut test surface area.

### Interview Questions

- 1. What's the difference between `switch` and `match`? — `switch` uses loose `==`, requires `break`, and is a statement; `match` uses strict `===`, returns a value, and throws `UnhandledMatchError` if no arm matches.
- 2. What is the dangling-reference bug in `foreach`? — After `foreach ($arr as &$v)`, `$v` still references `$arr`'s last element; a subsequent `foreach ($arr as $v)` overwrites it. Fix with `unset($v)`.
- 3. What does `break 2` do? — Breaks out of two nested loops (or two switch/loop levels).
- 4. Why is `continue` inside a `switch` confusing? — PHP treats `continue` inside `switch` like `break`; to continue the enclosing loop you need `continue 2`.
- 5. What is `match(true)` and when is it useful? — It's an idiom for replacing long `if/elseif` chains: each arm's condition is a boolean expression, and the first truthy one wins.

### Mini Project

Build a FizzBuzz CLI with a Twist: A script that prints FizzBuzz from 1 to N, but reads N from `$argv[1]`, accepts a `--json` flag to emit `{"n": N, "output": "..."}` per line, and uses `match(true)` for the divisible-by logic. Suggested approach:
  - Parse `$argv` for N and the `--json` flag
  - Use `match (true) { $n % 15 === 0 => "FizzBuzz", ... }` for the core logic
  - Use `printf` or `json_encode` per line depending on the flag
  - Validate N is a positive integer with `filter_var` and `FILTER_VALIDATE_INT`
  - Print usage to stderr on bad input and exit with status 1

### Exercises

1. Rewrite a 4-arm `switch` statement as a `match` expression and confirm both produce the same output for a test input.
2. Demonstrate the dangling-reference bug: write two consecutive `foreach` loops (one by reference) and observe the corrupted array.
3. Build a nested loop (3x3 multiplication table) and use `break 2` to exit when the product exceeds 4.
4. Write a `match(true)` expression that classifies a number as "negative", "zero", "small" (1-9), "big" (10+).
5. Compare `switch(0)` matching `"abc"` in PHP 7 vs PHP 8 by reading the migration notes — explain the behavior change.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which statement uses loose `==` comparison?
9. A) match
10. B) if using ===
11. C) switch (*)
12. D) match with true
13. Explanation: `switch` compares each case with loose `==`. `match` (PHP 8.0+) uses strict `===`.
14. Q2: What does `match` do if no arm matches and there is no `default`?
15. A) Returns null
16. B) Returns false
17. C) Falls through to the next match
18. D) Throws UnhandledMatchError (*)
19. Explanation: `match` throws `UnhandledMatchError` if no arm matches and no `default` is provided — fail-fast by design.
20. Q3: After `foreach ($arr as &$v) { ... }`, what is `$v`?
21. A) A reference to the last element of $arr (*)
22. B) Undefined
23. C) A copy of the last element
24. D) null
25. Explanation: `$v` remains a reference to the last element; call `unset($v)` after the loop to prevent the classic bug.
26. Q4: What does `break 2` do?
27. A) Breaks twice from the same loop
28. B) Breaks out of two nested control structures (*)
29. C) Skips two iterations
30. D) Throws a level-2 error
31. Explanation: `break N` exits N levels of nested loops/switches. `continue N` skips to the next iteration of the Nth outer loop.
32. Q5: Which is true about `continue` inside a `switch`?
33. A) It skips to the next case
34. B) It throws an error
35. C) It behaves like `break` (with a warning in PHP 7.3+) (*)
36. D) It exits the function
37. Explanation: Inside a `switch`, `continue` acts like `break`; use `continue 2` to continue the enclosing loop.
38. Q6: What is `match(true) { $x > 0 => "pos", default => "non-pos" }`?
39. A) A syntax error
40. B) A loop construct
41. C) A type guard
42. D) An idiom for replacing if/elseif chains (*)
43. Explanation: `match(true)` evaluates each arm's condition as a boolean; the first truthy one wins. It's an idiomatic replacement for long if/elseif chains.
44. Q7: In PHP 8, what does `switch ("abc") { case 0: ... }` do?
45. A) Does not match case 0 (*)
46. B) Matches case 0
47. C) Throws a TypeError
48. D) Skips to default automatically
49. Explanation: PHP 8 changed `switch` so non-numeric strings no longer match `0` under loose comparison; previously they did, causing silent bugs.
50. Q8: Which loop guarantees its body runs at least once?
51. A) while
52. B) do-while (*)
53. C) for
54. D) foreach
55. Explanation: `do { ... } while ($cond);` evaluates the condition after the body, so the body always executes at least once.
56. Q9: What does `foreach ($nums as $n)` do to `$nums`?
57. A) Modifies it in place
58. B) Sorts it
59. C) Iterates by value; $nums is unchanged (*)
60. D) Removes each element as it's read
61. Explanation: Without `&`, `foreach` iterates by value: `$n` is a copy of each element, and the original array is not modified.
62. Q10: What is the default `max_execution_time` for web requests?
63. A) 10 seconds
64. B) 60 seconds
65. C) Unlimited
66. D) 30 seconds (*)
67. Explanation: The default `max_execution_time` is 30 seconds for web SAPIs; CLI has no limit unless `set_time_limit()` is called.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which statement uses loose `==` comparison?
  options:
    - match
    - if using ===
    - switch
    - match with true
  correctIndex: 2
  explanation: "`switch` compares each case with loose `==`. `match` (PHP 8.0+) uses strict `===`."
- id: q2
  question: What does `match` do if no arm matches and there is no `default`?
  options:
    - Returns null
    - Returns false
    - Falls through to the next match
    - Throws UnhandledMatchError
  correctIndex: 3
  explanation: "`match` throws `UnhandledMatchError` if no arm matches and no `default` is provided — fail-fast by design."
- id: q3
  question: After `foreach ($arr as &$v) { ... }`, what is `$v`?
  options:
    - A reference to the last element of $arr
    - Undefined
    - A copy of the last element
    - "null"
  correctIndex: 0
  explanation: "`$v` remains a reference to the last element; call `unset($v)` after the loop to prevent the classic bug."
- id: q4
  question: What does `break 2` do?
  options:
    - Breaks twice from the same loop
    - Breaks out of two nested control structures
    - Skips two iterations
    - Throws a level-2 error
  correctIndex: 1
  explanation: "`break N` exits N levels of nested loops/switches. `continue N` skips to the next iteration of the Nth outer loop."
- id: q5
  question: Which is true about `continue` inside a `switch`?
  options:
    - It skips to the next case
    - It throws an error
    - It behaves like `break` (with a warning in PHP 7.3+)
    - It exits the function
  correctIndex: 2
  explanation: Inside a `switch`, `continue` acts like `break`; use `continue 2` to continue the enclosing loop.
- id: q6
  question: What is `match(true) { $x > 0 => "pos", default => "non-pos" }`?
  options:
    - A syntax error
    - A loop construct
    - A type guard
    - An idiom for replacing if/elseif chains
  correctIndex: 3
  explanation: "`match(true)` evaluates each arm's condition as a boolean; the first truthy one wins. It's an idiomatic replacement for long if/elseif chains."
- id: q7
  question: 'In PHP 8, what does `switch ("abc") { case 0: ... }` do?'
  options:
    - Does not match case 0
    - Matches case 0
    - Throws a TypeError
    - Skips to default automatically
  correctIndex: 0
  explanation: PHP 8 changed `switch` so non-numeric strings no longer match `0` under loose comparison; previously they did, causing silent bugs.
- id: q8
  question: Which loop guarantees its body runs at least once?
  options:
    - while
    - do-while
    - for
    - foreach
  correctIndex: 1
  explanation: "`do { ... } while ($cond);` evaluates the condition after the body, so the body always executes at least once."
- id: q9
  question: What does `foreach ($nums as $n)` do to `$nums`?
  options:
    - Modifies it in place
    - Sorts it
    - Iterates by value; $nums is unchanged
    - Removes each element as it's read
  correctIndex: 2
  explanation: "Without `&`, `foreach` iterates by value: `$n` is a copy of each element, and the original array is not modified."
- id: q10
  question: What is the default `max_execution_time` for web requests?
  options:
    - 10 seconds
    - 60 seconds
    - Unlimited
    - 30 seconds
  correctIndex: 3
  explanation: The default `max_execution_time` is 30 seconds for web SAPIs; CLI has no limit unless `set_time_limit()` is called.
```

