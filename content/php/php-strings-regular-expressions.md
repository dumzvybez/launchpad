---
slug: php-strings-regular-expressions
id: php-06
track: php
order: 6
title: Strings and Regular Expressions
description: PHP strings are byte arrays, not Unicode sequences — master single vs double quotes, heredoc/nowdoc, multibyte-safe functions, and PCRE regular expressions with `preg_*`.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=4000s
whyItMatters: PHP strings are byte arrays, not Unicode sequences — master single vs double quotes, heredoc/nowdoc, multibyte-safe functions, and PCRE regular expressions with `preg_*`.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Strings and Regular Expressions

## Strings and Regular Expressions

### Why It Matters

PHP strings are byte arrays, not Unicode sequences — master single vs double quotes, heredoc/nowdoc, multibyte-safe functions, and PCRE regular expressions with `preg_*`.

PHP strings are byte arrays, not Unicode sequences — master single vs double quotes, heredoc/nowdoc, multibyte-safe functions, and PCRE regular expressions with `preg_*`.

### Prerequisites

- Stage 2: Variables, Types, and Operators
- Stage 4: Functions and Include Files
- Stage 5: Arrays

### Topics

- Single-quoted vs double-quoted strings
- Variable interpolation and `{$arr['key']}` complex syntax
- heredoc `<<<SQL` and nowdoc `<<<'SQL'` (no interpolation)
- String as byte array: `$str[0]`, `strlen`, `substr`
- `mb_*` functions for UTF-8 (`mb_strlen`, `mb_substr`, `mb_strpos`)
- `sprintf`, `vsprintf`, `number_format`
- Comparing strings: `strcmp`, `strcasecmp`, `strnatcmp`
- PCRE: `preg_match`, `preg_match_all`, `preg_replace`, `preg_replace_callback`
- Delimiters, character classes, anchors, quantifiers, modifiers (`u` for UTF-8)
- `preg_quote` for escaping literal strings

### Key Concepts

- A PHP string is a sequence of bytes, not characters — `strlen("café")` is 5, not 4, because `é` is 2 bytes in UTF-8. Use `mb_strlen` for character counts.
- Single quotes do not interpret `\n` or interpolate variables; double quotes do. `"{$arr['key']}"` is the only safe way to interpolate array elements and object properties.
- `preg_*` functions require delimiters around the pattern (e.g. `/pattern/`, `~pattern~`, `#pattern#`); the `u` modifier treats the pattern and subject as UTF-8.
- `preg_match` returns 0 or 1 (not false on no match) and fills the `$matches` array; `preg_match_all` returns the count of full matches.
- Compiling a regex is expensive — for performance, pre-build patterns into variables rather than reconstructing them in loops.

```php
<?php
$name = "Ada";
echo 'Hello, $name\n';        // Hello, $name\n (literal)
echo "Hello, $name\n";        // Hello, Ada<newline>
echo "Hello, {$name}!\n";     // Hello, Ada!  — complex syntax
echo "Length: {strlen($name)}"; // syntax error — complex syntax only for variables/properties/methods by name
echo "Length: " . strlen($name);
```
Caption: Single vs double quotes

### Common Pitfalls

- Using `strlen`/`substr` on UTF-8 strings — they're byte-based and can split multibyte characters; use `mb_strlen`/`mb_substr` (or set `mb_internal_encoding('UTF-8')` globally).
- Forgetting the `u` modifier in `preg_*` for UTF-8 subjects — without it, `\w` and `.` match bytes, not characters, breaking Unicode patterns.
- Confusing `==` for string comparison — `0 == "abc"` was true in PHP 7 (the string was coerced to int 0); use `===` or `strcmp` to compare strings safely.
- Interpolating array elements with `$arr[key]` inside double quotes — `"$arr[key]"` works only for unquoted bareword keys; `"{$arr['key']}"` is the safe, recommended form.
- Using `str_replace` for regex work — `str_replace` is literal substring replacement, no patterns; reach for `preg_replace` if you need wildcards, anchors, or capture groups.

### Real-World Applications

- Wikipedia's wikitext parser uses dozens of PCRE patterns with the `u` modifier to handle Unicode article titles safely.
- WordPress's `sanitize_title` uses `preg_replace` chains to slug-ify post titles, replacing non-ASCII characters with hyphens.
- Slack used `mb_*` functions extensively for emoji rendering (many emoji are multi-codepoint sequences in UTF-8).
- Mailchimp uses PCRE for email validation, phone number normalization, and merge-tag parsing in email templates.

### Interview Questions

- 1. Is a PHP string a sequence of characters or bytes? — Bytes; `strlen("café")` is 5, not 4. Use `mb_strlen` for character counts.
- 2. What's the difference between single and double quotes? — Single quotes don't interpolate variables and don't interpret `\n`; double quotes do both.
- 3. What does the `u` modifier do in PCRE? — Treats the pattern and subject as UTF-8, so `\w`, `.`, and character classes match Unicode characters, not bytes.
- 4. What's the difference between `heredoc` and `nowdoc`? — Heredoc interpolates variables (like double quotes); nowdoc (single-quoted marker `<<<'SQL'`) does not (like single quotes).
- 5. Why is `preg_quote` necessary? — It escapes regex metacharacters (`.`, `*`, `+`, `?`, etc.) in user-supplied strings so they're treated as literals in a pattern.

### Mini Project

Build a Markdown Link Extractor CLI: A script that reads a Markdown file and prints all links in `GitHub-flavored` format: `[text](url)`. Suggested approach:
  - Read the file with `file_get_contents`
  - Use `preg_match_all('/\[([^\]]+)\]\(([^)]+)\)/u', $content, $matches, PREG_SET_ORDER)`
  - Output each link as `text -> url` lines
  - Add a `--validate` flag that filters out URLs that don't start with `http(s)://`
  - Print a summary count at the end with `printf`

### Exercises

1. Print `strlen("café")` vs `mb_strlen("café")` and explain the difference.
2. Use `preg_match` to extract the year, month, and day from an ISO date string with capture groups.
3. Build a slug-ifier: convert "Hello, World! café" to "hello-world-cafe" using `preg_replace`, `strtolower`, and `str_replace`.
4. Compare `str_replace('cat', 'dog', 'catalog')` with `preg_replace('/\bcat\b/', 'dog', 'catalog')` — explain word boundaries.
5. Write a heredoc SQL query template that interpolates a `$table` variable, then rewrite it as a nowdoc that doesn't interpolate.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is a PHP string a sequence of characters or bytes?
9. A) Characters
10. B) Bytes (*)
11. C) Code points
12. D) Grapheme clusters
13. Explanation: A PHP string is a sequence of bytes; `strlen("café")` is 5 because é is 2 bytes in UTF-8. Use `mb_strlen` for character counts.
14. Q2: What does `strlen("café")` return (UTF-8 encoded)?
15. A) 4
16. B) 6
17. C) 5 (*)
18. D) 7
19. Explanation: "café" is 5 bytes in UTF-8: c, a, f, then é (0xC3 0xA9 = 2 bytes).
20. Q3: Which modifier makes a PCRE pattern UTF-8-aware?
21. A) /i
22. B) /m
23. C) /s
24. D) /u (*)
25. Explanation: The `u` modifier treats the pattern and subject as UTF-8, so `\w`, `.`, and character classes match Unicode characters.
26. Q4: What's the difference between heredoc and nowdoc?
27. A) Heredoc interpolates, nowdoc does not (*)
28. B) Heredoc is single-quoted, nowdoc is double-quoted
29. C) Heredoc is for SQL, nowdoc is for regex
30. D) There is no difference
31. Explanation: Heredoc `<<<SQL` interpolates variables (like double quotes); nowdoc `<<<'SQL'` (single-quoted marker) does not (like single quotes).
32. Q5: How do you safely interpolate `$arr['key']` in a double-quoted string?
33. A) "$arr['key']"
34. B) "{$arr['key']}" (*)
35. C) "$arr[key]"
36. D) "$arr->key"
37. Explanation: The complex syntax `{$arr['key']}` is the safe way to interpolate array elements and object properties; the bareword form `"$arr[key]"` works but is fragile and deprecated in some cases.
38. Q6: What does `preg_match` return on a successful match?
39. A) true
40. B) The matched string
41. C) 1 (*)
42. D) An array
43. Explanation: `preg_match` returns 1 on match, 0 on no match, and false on error. The matches are stored in the third argument (by reference).
44. Q7: What does `preg_quote` do?
45. A) Quotes a string for use in HTML
46. B) Adds delimiters around a regex
47. C) Validates a regex pattern
48. D) Escapes regex metacharacters in a string (*)
49. Explanation: `preg_quote` escapes regex metacharacters (`. * + ? [ ]` etc.) so a user-supplied string is treated as a literal in a pattern.
50. Q8: Which correctly compares two strings for equality in PHP 8?
51. A) `if ($a === $b)` (*)
52. B) `if ($a == $b)` (always safe)
53. C) `if ($a = $b)`
54. D) `if ($a <=> $b)`
55. Explanation: `===` is the safest string comparison — same type and value. `==` can coerce (e.g. "0" == "" is false but "abc" == 0 was true in PHP 7).
56. Q9: What does the `/m` modifier do?
57. A) Treats the subject as UTF-8
58. B) Makes `^` and `$` match at line boundaries, not just string boundaries (*)
59. C) Makes `.` match newlines
60. D) Enables multiline comments in the pattern
61. Explanation: `/m` (multiline) makes `^` and `$` match at the start/end of each line; `/s` makes `.` match newlines.
62. Q10: Which function applies a callback to each regex match for dynamic replacement?
63. A) preg_replace_dynamic
64. B) preg_callback
65. C) preg_replace_callback (*)
66. D) str_replace_callback
67. Explanation: `preg_replace_callback` calls a user function for each match, allowing dynamic replacements based on the matched text.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is a PHP string a sequence of characters or bytes?
  options:
    - Characters
    - Bytes
    - Code points
    - Grapheme clusters
  correctIndex: 1
  explanation: A PHP string is a sequence of bytes; `strlen("café")` is 5 because é is 2 bytes in UTF-8. Use `mb_strlen` for character counts.
- id: q2
  question: What does `strlen("café")` return (UTF-8 encoded)?
  options:
    - "4"
    - "6"
    - "5"
    - "7"
  correctIndex: 2
  explanation: '"café" is 5 bytes in UTF-8: c, a, f, then é (0xC3 0xA9 = 2 bytes).'
- id: q3
  question: Which modifier makes a PCRE pattern UTF-8-aware?
  options:
    - /i
    - /m
    - /s
    - /u
  correctIndex: 3
  explanation: The `u` modifier treats the pattern and subject as UTF-8, so `\w`, `.`, and character classes match Unicode characters.
- id: q4
  question: What's the difference between heredoc and nowdoc?
  options:
    - Heredoc interpolates, nowdoc does not
    - Heredoc is single-quoted, nowdoc is double-quoted
    - Heredoc is for SQL, nowdoc is for regex
    - There is no difference
  correctIndex: 0
  explanation: Heredoc `<<<SQL` interpolates variables (like double quotes); nowdoc `<<<'SQL'` (single-quoted marker) does not (like single quotes).
- id: q5
  question: How do you safely interpolate `$arr['key']` in a double-quoted string?
  options:
    - "\"$arr['key']\""
    - "\"{$arr['key']}\""
    - '"$arr[key]"'
    - '"$arr->key"'
  correctIndex: 1
  explanation: The complex syntax `{$arr['key']}` is the safe way to interpolate array elements and object properties; the bareword form `"$arr[key]"` works but is fragile and deprecated in some cases.
- id: q6
  question: What does `preg_match` return on a successful match?
  options:
    - "true"
    - The matched string
    - "1"
    - An array
  correctIndex: 2
  explanation: "`preg_match` returns 1 on match, 0 on no match, and false on error. The matches are stored in the third argument (by reference)."
- id: q7
  question: What does `preg_quote` do?
  options:
    - Quotes a string for use in HTML
    - Adds delimiters around a regex
    - Validates a regex pattern
    - Escapes regex metacharacters in a string
  correctIndex: 3
  explanation: "`preg_quote` escapes regex metacharacters (`. * + ? [ ]` etc.) so a user-supplied string is treated as a literal in a pattern."
- id: q8
  question: Which correctly compares two strings for equality in PHP 8?
  options:
    - "`if ($a === $b)`"
    - "`if ($a == $b)` (always safe)"
    - "`if ($a = $b)`"
    - "`if ($a <=> $b)`"
  correctIndex: 0
  explanation: '`===` is the safest string comparison — same type and value. `==` can coerce (e.g. "0" == "" is false but "abc" == 0 was true in PHP 7).'
- id: q9
  question: What does the `/m` modifier do?
  options:
    - Treats the subject as UTF-8
    - Makes `^` and `$` match at line boundaries, not just string boundaries
    - Makes `.` match newlines
    - Enables multiline comments in the pattern
  correctIndex: 1
  explanation: "`/m` (multiline) makes `^` and `$` match at the start/end of each line; `/s` makes `.` match newlines."
- id: q10
  question: Which function applies a callback to each regex match for dynamic replacement?
  options:
    - preg_replace_dynamic
    - preg_callback
    - preg_replace_callback
    - str_replace_callback
  correctIndex: 2
  explanation: "`preg_replace_callback` calls a user function for each match, allowing dynamic replacements based on the matched text."
```

