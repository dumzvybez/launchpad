---
slug: php-arrays-indexed-associative-multidimensional
id: php-05
track: php
order: 5
title: Arrays — Indexed, Associative, Multidimensional
description: PHP arrays are the workhorse data structure — they're ordered maps that act as lists, dictionaries, sets, and trees. Learn the syntax, the 80+ built-in functions, and the most common destructuring and reference pitfalls.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=3200s
whyItMatters: PHP arrays are the workhorse data structure — they're ordered maps that act as lists, dictionaries, sets, and trees. Learn the syntax, the 80+ built-in functions, and the most common destructuring and reference pitfalls.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Arrays — Indexed, Associative, Multidimensional

## Arrays — Indexed, Associative, Multidimensional

### Why It Matters

PHP arrays are the workhorse data structure — they're ordered maps that act as lists, dictionaries, sets, and trees. Learn the syntax, the 80+ built-in functions, and the most common destructuring and reference pitfalls.

PHP arrays are the workhorse data structure — they're ordered maps that act as lists, dictionaries, sets, and trees. Learn the syntax, the 80+ built-in functions, and the most common destructuring and reference pitfalls.

### Prerequisites

- Stage 2: Variables, Types, and Operators
- Stage 3: Control Flow — Conditionals and Loops
- Stage 4: Functions and Include Files

### Topics

- Indexed arrays, associative arrays, and nested/multidimensional arrays
- Literal syntax with `[]` and the legacy `array()` form
- Adding, removing, and updating elements; `unset()` behavior
- Array operators: `+`, `==`, `===`, `==>` spaceship
- Key coercion: integer-string keys, the `08` trap, duplicate keys
- `foreach` iteration with key and value
- Destructuring with `list()` and the `[$a, $b] = $arr` shorthand
- Splat/spread in arrays (8.1: string-keyed spread)
- Common functions: `array_map`, `array_filter`, `array_reduce`, `array_column`, `array_merge`, `array_keys`, `array_values`, `array_unique`, `usort`
- `array` vs `ArrayObject` vs `SplFixedArray`

### Key Concepts

- A PHP array is an ordered hash map — it preserves insertion order, supports both integer and string keys, and resizes dynamically.
- String keys that look like valid decimal integers (`"0"`, `"42"`, but NOT `"08"` or `"+1"`) are coerced to integers — a frequent source of subtle bugs.
- `array_merge` reindexes integer keys but preserves string keys (later values overwrite earlier); `+` keeps the first occurrence of each key and ignores later ones.
- `==` compares arrays element-by-element with type juggling; `===` requires same key order, same types, and same values.
- `list($a, $b) = $arr` (and the shorthand `[$a, $b] = $arr`) destructures arrays; you can skip elements with `[, $b] = $arr` and use named keys `['k' => $v] = $arr`.

```php
<?php
// Indexed
$colors = ["red", "green", "blue"];

// Associative
$user = [
    "name"  => "Ada",
    "age"   => 36,
    "roles" => ["admin", "editor"],   // nested
];

echo $user["roles"][1];               // "editor"
$user["email"] = "ada@example.com";   // add a key
unset($user["age"]);                  // remove a key
```
Caption: Indexed, associative, and nested

### Common Pitfalls

- `array_filter` preserves keys — after filtering `[0, 1, 2, 3]` to even numbers, the result is `[0 => 0, 2 => 2]`, not `[0, 2]`. Wrap with `array_values()` to reindex.
- Using `array_merge` vs `+` interchangeably — `array_merge` reindexes integer keys and overwrites string keys with later values; `+` keeps the first occurrence and ignores later ones, preserving keys.
- Forgetting that integer-like string keys are coerced — `["08" => "x"]` stays a string key, but `["8" => "x"]` becomes integer key 8; this can cause data loss when keys collide.
- Mutating an array while iterating it with `foreach` — adding/removing elements during iteration can skip or duplicate elements; iterate a copy (`foreach ($arr as $k => $v) { ... }` copies by default) or use explicit index loops.
- Comparing arrays with `==` vs `===` — `==` ignores key order and uses loose comparison; `===` requires identical key order, types, and values. Use `===` for "exact same array".

### Real-World Applications

- WordPress's options table is loaded into a giant associative array; the `get_option`/`update_option` API is essentially a wrapper around array key access with caching.
- Slack's PHP backend used `array_column` heavily to extract IDs from record lists before joining them to other services.
- Wikipedia's parser uses nested associative arrays to represent document trees, with `array_map`/`array_filter` chains for transforms.
- Etsy uses `usort` with the spaceship operator `<=>` for ranking product feeds by composite scores.

### Interview Questions

- 1. What is a PHP array internally? — An ordered hash map (the Zend HashTable) that supports both integer and string keys, preserves insertion order, and resizes dynamically.
- 2. What's the difference between `array_merge` and `+`? — `array_merge` reindexes integer keys and overwrites string keys with later values; `+` keeps the first occurrence of each key and ignores later ones.
- 3. Why does `array_filter` not reindex? — It preserves keys so you can map back to the original positions; wrap with `array_values()` to get a 0-indexed list.
- 4. When is a string key coerced to an integer? — When it's a canonical decimal integer string (`"0"`, `"42"`) without leading zeros, sign, or decimal point; `"08"`, `"+1"`, and `"1.5"` stay strings.
- 5. What does `[$a, $b] = $arr` do? — Destructures the array into `$a` and `$b` by position; equivalent to `list($a, $b) = $arr`.

### Mini Project

Build a CSV-to-JSON Converter CLI: A script that reads a CSV file, parses it into an array of associative arrays keyed by the header row, filters out rows where a given column is empty, and emits JSON. Suggested approach:
  - Use `fgetcsv()` to read the header row, then each data row
  - Combine header + row with `array_combine` to make an associative array per record
  - Use `array_filter` to drop empty rows, then `array_values` to reindex
  - Use `array_map` to cast numeric strings to ints/floats
  - Emit JSON with `json_encode($rows, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)`

### Exercises

1. Build an indexed array of 5 colors, then an associative array mapping color names to hex codes, then a nested array of both.
2. Use `array_map`, `array_filter`, and `array_reduce` together to compute the sum of squares of even numbers in `[1..10]`.
3. Demonstrate the key-coercion trap: create an array with keys `"1"`, `"01"`, and `true` — print the result and explain.
4. Use destructuring to swap two values in one line: `[$a, $b] = [$b, $a];`.
5. Sort an array of associative records by a nested key using `usort` and the spaceship operator.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a PHP array internally?
9. A) An ordered hash map (*)
10. B) A linked list
11. C) A fixed-size array
12. D) A binary tree
13. Explanation: A PHP array is the Zend HashTable — an ordered map supporting both integer and string keys with insertion-order preservation.
14. Q2: What does `array_filter` do to keys?
15. A) Reindexes from 0
16. B) Preserves original keys (*)
17. C) Sorts them
18. D) Converts them to strings
19. Explanation: `array_filter` keeps the original keys, which can leave gaps in the index. Use `array_values()` to reindex.
20. Q3: Which is true of `array_merge` with integer keys?
21. A) Keeps the first occurrence
22. B) Drops all integer keys
23. C) Reindexes from 0 sequentially (*)
24. D) Throws an error
25. Explanation: `array_merge` reindexes integer keys from 0, while string keys are overwritten by later values.
26. Q4: What is the result of `["1" => "a", 1 => "b"]`?
27. A) Two keys: "1" and 1
28. B) One key: "1", with value "a"
29. C) A syntax error
30. D) One key: 1, with value "b" (*)
31. Explanation: "1" is coerced to integer 1, so the second entry overwrites the first; the array has one entry `[1 => "b"]`.
32. Q5: Which operator compares arrays element-by-element with type juggling?
33. A) == (*)
34. B) +
35. C) ===
36. D) <=>
37. Explanation: `==` compares element-by-element with type juggling; `===` requires identical key order, types, and values.
38. Q6: What does `array_column($users, "name")` return?
39. A) The first column
40. B) The values from the "name" key of each record (*)
41. C) The "name" key as a column header
42. D) An error if the key is missing
43. Explanation: `array_column` extracts values from a single column (a key) of a list of arrays/objects, perfect for flattening record lists.
44. Q7: What does the spaceship operator `<=>` return?
45. A) A boolean
46. B) The smaller value
47. C) -1, 0, or 1 (*)
48. D) The larger value
49. Explanation: `<=>` returns -1, 0, or 1 depending on whether the left is less, equal, or greater than the right — perfect for `usort` comparators.
50. Q8: Which destructures an array positionally?
51. A) `list($a, $b) = $arr`
52. B) `[$a, $b] = $arr`
53. C) `{$a, $b} = $arr`
54. D) Both A and B (*)
55. Explanation: Both `list($a, $b) = $arr` and the modern `[$a, $b] = $arr` destructure positionally; the `[]` form is preferred since PHP 7.1.
56. Q9: What does `["08" => "x"]` produce?
57. A) A string key "08" (*)
58. B) An integer key 8
59. C) A syntax error
60. D) An integer key 0
61. Explanation: "08" is not a canonical decimal integer (leading zero), so it stays a string key — a common source of subtle key-mismatch bugs.
62. Q10: Which is true of string-keyed spread `[...$a, ...$b]` in PHP 8.1+?
63. A) Only works for indexed arrays
64. B) Works for string-keyed arrays too, with later keys overwriting (*)
65. C) Throws a TypeError on string keys
66. D) Drops all keys and reindexes
67. Explanation: PHP 8.1+ supports string-keyed spread: later keys overwrite earlier ones, like `array_merge` but with array literals.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a PHP array internally?
  options:
    - An ordered hash map
    - A linked list
    - A fixed-size array
    - A binary tree
  correctIndex: 0
  explanation: A PHP array is the Zend HashTable — an ordered map supporting both integer and string keys with insertion-order preservation.
- id: q2
  question: What does `array_filter` do to keys?
  options:
    - Reindexes from 0
    - Preserves original keys
    - Sorts them
    - Converts them to strings
  correctIndex: 1
  explanation: "`array_filter` keeps the original keys, which can leave gaps in the index. Use `array_values()` to reindex."
- id: q3
  question: Which is true of `array_merge` with integer keys?
  options:
    - Keeps the first occurrence
    - Drops all integer keys
    - Reindexes from 0 sequentially
    - Throws an error
  correctIndex: 2
  explanation: "`array_merge` reindexes integer keys from 0, while string keys are overwritten by later values."
- id: q4
  question: What is the result of `["1" => "a", 1 => "b"]`?
  options:
    - 'Two keys: "1" and 1'
    - 'One key: "1", with value "a"'
    - A syntax error
    - 'One key: 1, with value "b"'
  correctIndex: 3
  explanation: '"1" is coerced to integer 1, so the second entry overwrites the first; the array has one entry `[1 => "b"]`.'
- id: q5
  question: Which operator compares arrays element-by-element with type juggling?
  options:
    - ==
    - +
    - ===
    - <=>
  correctIndex: 0
  explanation: "`==` compares element-by-element with type juggling; `===` requires identical key order, types, and values."
- id: q6
  question: What does `array_column($users, "name")` return?
  options:
    - The first column
    - The values from the "name" key of each record
    - The "name" key as a column header
    - An error if the key is missing
  correctIndex: 1
  explanation: "`array_column` extracts values from a single column (a key) of a list of arrays/objects, perfect for flattening record lists."
- id: q7
  question: What does the spaceship operator `<=>` return?
  options:
    - A boolean
    - The smaller value
    - -1, 0, or 1
    - The larger value
  correctIndex: 2
  explanation: "`<=>` returns -1, 0, or 1 depending on whether the left is less, equal, or greater than the right — perfect for `usort` comparators."
- id: q8
  question: Which destructures an array positionally?
  options:
    - "`list($a, $b) = $arr`"
    - "`[$a, $b] = $arr`"
    - "`{$a, $b} = $arr`"
    - Both A and B
  correctIndex: 3
  explanation: Both `list($a, $b) = $arr` and the modern `[$a, $b] = $arr` destructure positionally; the `[]` form is preferred since PHP 7.1.
- id: q9
  question: What does `["08" => "x"]` produce?
  options:
    - A string key "08"
    - An integer key 8
    - A syntax error
    - An integer key 0
  correctIndex: 0
  explanation: '"08" is not a canonical decimal integer (leading zero), so it stays a string key — a common source of subtle key-mismatch bugs.'
- id: q10
  question: Which is true of string-keyed spread `[...$a, ...$b]` in PHP 8.1+?
  options:
    - Only works for indexed arrays
    - Works for string-keyed arrays too, with later keys overwriting
    - Throws a TypeError on string keys
    - Drops all keys and reindexes
  correctIndex: 1
  explanation: "PHP 8.1+ supports string-keyed spread: later keys overwrite earlier ones, like `array_merge` but with array literals."
```

