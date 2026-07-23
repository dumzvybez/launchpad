---
slug: dart-strings-stringbuffer-regex
id: dart-05
track: dart
order: 5
title: Strings, StringBuffer, and Regex
description: Work with Dart strings, escape sequences, raw strings, multiline strings, interpolation, `StringBuffer` for efficient concatenation, and `RegExp` for pattern matching and replacement.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=2400s
whyItMatters: Work with Dart strings, escape sequences, raw strings, multiline strings, interpolation, `StringBuffer` for efficient concatenation, and `RegExp` for pattern matching and replacement.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Strings, StringBuffer, and Regex

## Strings, StringBuffer, and Regex

### Why It Matters

Work with Dart strings, escape sequences, raw strings, multiline strings, interpolation, `StringBuffer` for efficient concatenation, and `RegExp` for pattern matching and replacement.

Work with Dart strings, escape sequences, raw strings, multiline strings, interpolation, `StringBuffer` for efficient concatenation, and `RegExp` for pattern matching and replacement.

### Prerequisites

- Stage 2: Variables, Types, and null safety
- Stage 3: Control Flow — Conditionals and Loops
- Stage 4: Functions, Parameters, and Closures

### Topics

- Single vs double quotes; string equality and identity
- Escape sequences: \n, \t, \\, \', \", \u{XXXX}
- Raw strings `r'...'` (no escapes) and multiline `'''...'''`
- String interpolation `$var` and `${expr}`
- `StringBuffer` for efficient repeated concatenation
- Common methods: split, join, replaceAll, substring, trim, contains, indexOf, padLeft/Right
- `RegExp` and `Match` objects; named groups (Dart 3)
- `String.runes` for Unicode code points vs `String.codeUnits` for UTF-16

### Key Concepts

- Dart strings are immutable sequences of UTF-16 code units; for code-point-level work use `runes`.
- `$x` interpolates a variable; `${expr}` interpolates any expression — needed for member access (`${user.name}`).
- `StringBuffer` is the efficient way to build a string from many pieces; `+` on Strings creates a new object each time.
- `RegExp` uses ECMAScript regex syntax; access matches via `.firstMatch`, `.allMatches`, or `String.replaceAllMapped`.
- Raw strings (`r'...'`) treat backslashes literally — essential for regex patterns like `r'\d+'`.
- `==` on strings compares by value (Dart interns string literals and many constant strings), not by identity.

```dart
var name = 'Anna';
var age = 30;
print('Name: $name, Age: $age');          // Name: Anna, Age: 30
print('Length: ${name.length}');          // Length: 4
print(r'Path: C:\Users\Anna\file.txt');   // raw — backslashes literal

// Multiline
var doc = '''
Line 1
Line 2
Line 3
''';
```
Caption: Interpolation and raw strings

### Common Pitfalls

- Using `+` in a hot loop to build a string — each `+` allocates a new String; switch to `StringBuffer` for O(n) instead of O(n^2) behavior.
- Treating `string.length` as character count — it's UTF-16 code unit count; an emoji like `'😀'` has length 2. Use `string.runes.length` for code points or `characters` package for grapheme clusters.
- Forgetting `r'...'` for regex patterns — `'\d+'` is interpreted as `d+` because `\d` is an unknown escape and Dart keeps it as `d`; always use `r'\d+'`.
- Modifying a string "in place" — Dart strings are immutable; `replaceAll` returns a new string, it doesn't mutate the receiver.
- Confusing `==` with `identical` — `==` on Strings compares by value; `identical(a, b)` checks reference identity. Interned literals may be identical, but runtime-built strings usually aren't.

### Real-World Applications

- Flutter's `debugPrint` throttles long output using `StringBuffer` to chunk logs without flooding the console.
- The Hamilton app parses show-time strings from a CMS using `RegExp` to extract dates, times, and venue codes for display in different time zones.
- eBay Motors' listing pipeline uses `String.replaceAllMapped` to normalize vehicle identification numbers (VINs) and trim whitespace before validation.
- Alibaba's Xianyu uses the `characters` package (grapheme-aware) to enforce correct max-length checks on user-submitted product titles in CJK languages.

### Interview Questions

- 1. Why use `StringBuffer` instead of `+` for repeated concatenation? — `StringBuffer` amortizes allocations to O(n); repeated `+` is O(n^2) due to copying.
- 2. What is the difference between `'😀'.length` and `'😀'.runes.length`? — `.length` counts UTF-16 code units (2 for emoji surrogate pair); `.runes.length` counts Unicode code points (1).
- 3. What does `r'...'` do? — Marks a raw string where backslashes are literal, so `r'\d+'` is two characters (backslash-d-plus) rather than `d+`.
- 4. Are Dart strings mutable? — No, all strings are immutable; methods like `replaceAll` return new strings.
- 5. How do you extract named regex groups? — Dart 3 supports named groups via `(?<name>...)` and `m.namedGroup('name')`; older code uses numbered `m.group(N)`.

### Mini Project

Build a Markdown Link Extractor: A program that reads a Markdown string and returns a list of all links (text, URL) using `RegExp`. Also build a CSV row splitter that handles quoted fields containing commas. Suggested approach:
  - Use `RegExp(r'\[([^\]]+)\]\(([^)]+)\)')` for Markdown links
  - Iterate `allMatches` and collect `(text, url)` pairs into a `List<({String text, String url})>` record
  - For CSV, use a state machine or a regex like `r'(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))'`
  - Use `StringBuffer` to format output as a table
  - Print results and run `dart analyze`

### Exercises

1. Build a `String` from 1000 parts using `+` and then using `StringBuffer`; time both with `Stopwatch` and compare.
2. Use a `RegExp` to extract all email addresses from a paragraph of text.
3. Count code points vs UTF-16 code units of `'👋🌍🚀'` and explain the difference.
4. Write `String titleCase(String s)` that uppercases the first letter of each word using `split` + `map` + `join`.
5. Use `replaceAllMapped` to convert kebab-case to camelCase (`foo-bar-baz` → `fooBarBaz`).
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `StringBuffer` optimize for?
9. A) Efficient repeated concatenation (*)
10. B) Immutable string sharing
11. C) Regex matching
12. D) Unicode normalization
13. Explanation: `StringBuffer` builds a string in O(n) by amortizing allocations; naive `+` chains are O(n^2) due to repeated copying.
14. Q2: What is `'😀'.length` in Dart?
15. A) 1
16. B) 2 (*)
17. C) 4
18. D) 0
19. Explanation: Dart strings are UTF-16; an emoji outside the BMP is encoded as a surrogate pair, so `.length` returns 2 code units.
20. Q3: What does `r'\d+'` match in Dart?
21. A) The literal text \d+
22. B) A backslash followed by d
23. C) One or more digits (*)
24. D) Any character
25. Explanation: `r'...'` is a raw string, so `\d+` reaches the regex engine as `\d+` (digit-class plus), matching one or more digits.
26. Q4: How do you interpolate a member access?
27. A) $user.name
28. B) $user{name}
29. C) $(user.name)
30. D) ${user.name} (*)
31. Explanation: Bare `$user.name` parses as `$user` followed by `.name`; you must wrap the expression in `${}` to interpolate it.
32. Q5: Are Dart strings mutable?
33. A) No, all strings are immutable (*)
34. B) Yes, all strings are mutable
35. C) Only StringBuffer strings are mutable
36. D) Only const strings are immutable
37. Explanation: Strings are immutable; methods like `replaceAll` return a new String rather than mutating the receiver.
38. Q6: Which method returns all regex matches as an iterable?
39. A) RegExp.match
40. B) RegExp.allMatches(str) (*)
41. C) String.matches(re)
42. D) RegExp.find(str)
43. Explanation: `RegExp.allMatches(input)` returns an `Iterable<Match>` you can iterate or convert with `.toList()`.
44. Q7: What is the result of `'abc' == 'abc'`?
45. A) false
46. B) Compile error
47. C) true (value equality) (*)
48. D) Depends on string interning
49. Explanation: Dart's `String.==` compares by value, so equal contents return true regardless of interning or reference identity.
50. Q8: Which gives the Unicode code point count?
51. A) string.length
52. B) string.codeUnits.length
53. C) string.chars.length
54. D) string.runes.length (*)
55. Explanation: `.runes` iterates Unicode code points; `.runes.length` is the code point count. `.length` and `.codeUnits.length` are UTF-16 code unit counts.
56. Q9: Which is a raw multiline string?
57. A) r'''...'''  (*)
58. B) raw'''...'''
59. C) '''r...'''
60. D) r"""...""" only
61. Explanation: Both `r'''...'''` and `r"""..."""` are valid raw multiline strings; the `r` prefix may be combined with triple quotes.
62. Q10: What does `text.replaceAllMapped(re, fn)` do?
63. A) Returns the first match
64. B) Replaces each match using a function that receives the Match (*)
65. C) Mutates `text` in place
66. D) Removes all matches without replacement
67. Explanation: `replaceAllMapped` calls `fn(Match)` for each match and replaces with the returned string, enabling transformations that depend on captured groups.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `StringBuffer` optimize for?
  options:
    - Efficient repeated concatenation
    - Immutable string sharing
    - Regex matching
    - Unicode normalization
  correctIndex: 0
  explanation: "`StringBuffer` builds a string in O(n) by amortizing allocations; naive `+` chains are O(n^2) due to repeated copying."
- id: q2
  question: What is `'😀'.length` in Dart?
  options:
    - "1"
    - "2"
    - "4"
    - "0"
  correctIndex: 1
  explanation: Dart strings are UTF-16; an emoji outside the BMP is encoded as a surrogate pair, so `.length` returns 2 code units.
- id: q3
  question: What does `r'\d+'` match in Dart?
  options:
    - The literal text \d+
    - A backslash followed by d
    - One or more digits
    - Any character
  correctIndex: 2
  explanation: "`r'...'` is a raw string, so `\\d+` reaches the regex engine as `\\d+` (digit-class plus), matching one or more digits."
- id: q4
  question: How do you interpolate a member access?
  options:
    - $user.name
    - $user{name}
    - $(user.name)
    - ${user.name}
  correctIndex: 3
  explanation: Bare `$user.name` parses as `$user` followed by `.name`; you must wrap the expression in `${}` to interpolate it.
- id: q5
  question: Are Dart strings mutable?
  options:
    - No, all strings are immutable
    - Yes, all strings are mutable
    - Only StringBuffer strings are mutable
    - Only const strings are immutable
  correctIndex: 0
  explanation: Strings are immutable; methods like `replaceAll` return a new String rather than mutating the receiver.
- id: q6
  question: Which method returns all regex matches as an iterable?
  options:
    - RegExp.match
    - RegExp.allMatches(str)
    - String.matches(re)
    - RegExp.find(str)
  correctIndex: 1
  explanation: "`RegExp.allMatches(input)` returns an `Iterable<Match>` you can iterate or convert with `.toList()`."
- id: q7
  question: What is the result of `'abc' == 'abc'`?
  options:
    - "false"
    - Compile error
    - true (value equality)
    - Depends on string interning
  correctIndex: 2
  explanation: Dart's `String.==` compares by value, so equal contents return true regardless of interning or reference identity.
- id: q8
  question: Which gives the Unicode code point count?
  options:
    - string.length
    - string.codeUnits.length
    - string.chars.length
    - string.runes.length
  correctIndex: 3
  explanation: "`.runes` iterates Unicode code points; `.runes.length` is the code point count. `.length` and `.codeUnits.length` are UTF-16 code unit counts."
- id: q9
  question: Which is a raw multiline string?
  options:
    - r'''...'''
    - raw'''...'''
    - "'''r...'''"
    - r"""...""" only
  correctIndex: 0
  explanation: Both `r'''...'''` and `r"""..."""` are valid raw multiline strings; the `r` prefix may be combined with triple quotes.
- id: q10
  question: What does `text.replaceAllMapped(re, fn)` do?
  options:
    - Returns the first match
    - Replaces each match using a function that receives the Match
    - Mutates `text` in place
    - Removes all matches without replacement
  correctIndex: 1
  explanation: "`replaceAllMapped` calls `fn(Match)` for each match and replaces with the returned string, enabling transformations that depend on captured groups."
```

