---
slug: swift-strings-characters-ranges
id: swift-04
track: swift
order: 4
title: Strings, Characters, and Ranges
description: Work with Swift strings as collections of `Character` (Unicode grapheme clusters), master `String.Index` (not `Int`), and use ranges for slicing and matching.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=180s
whyItMatters: Work with Swift strings as collections of `Character` (Unicode grapheme clusters), master `String. Index` (not `Int`), and use ranges for slicing and matching.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Strings, Characters, and Ranges

## Strings, Characters, and Ranges

### Why It Matters

Work with Swift strings as collections of `Character` (Unicode grapheme clusters), master `String. Index` (not `Int`), and use ranges for slicing and matching.

Work with Swift strings as collections of `Character` (Unicode grapheme clusters), master `String.Index` (not `Int`), and use ranges for slicing and matching.

### Prerequisites

- Stage 1: Getting Started with Swift
- Stage 2: Variables, Types, and Optionals
- Stage 3: Control Flow (for-in, ranges)

### Topics

- `String`, `Substring`, and `Character`
- Unicode grapheme clusters (why "é" can be 1 or 2 code points)
- `String.Index` and `distance(from:to:)`
- Ranges: `Range<String.Index>`, `ClosedRange`, `PartialRange`
- Substring sharing storage with the original (COW)
- String interpolation and `String(format:)`
- Multiline string literals `"""..."""`
- Raw strings `#"..."#` with custom delimiters
- `joined`, `split`, `replacingOccurrences`, and `components(separatedBy:)`

### Key Concepts

- Swift strings are NOT random-access; you cannot subscript with an integer (`s[2]` is a compile error). Use `String.Index`.
- A `Character` is a grapheme cluster — a user-perceived character — which may be multiple Unicode scalars (e.g. "é" = U+0065 + U+0301).
- `Substring` shares storage with its origin string; convert with `String(substring)` when you want to break the link.
- Ranges over `String.Index` are first-class; `string.range(of:)` returns `Range<String.Index>?`.
- String interpolation calls `String.init(stringInterpolation:)` and is fully customizable via `ExpressibleByStringInterpolation`.

```swift
let s = "Hello, world!"
if let i = s.firstIndex(of: ",") {
    let before = s[s.startIndex..<i]   // "Hello"
    let after = s[s.index(after: i)..<s.endIndex]  // " world!"
}
// s[2] is a COMPILE ERROR — strings are not integer-subscriptable
let third = s[s.index(s.startIndex, offsetBy: 2)]  // "l"
```
Caption: String.Index navigation

### Common Pitfalls

- Writing `s[i]` where `i` is an `Int` — compile error; Swift strings are not integer-subscriptable because grapheme boundaries are not O(1) computable. Use `s.index(s.startIndex, offsetBy: i)` instead, or convert to an array.
- Holding a `Substring` long-term and keeping the entire origin string alive in memory — convert with `String(substring)` when the substring outlives the source.
- Assuming `"é".count == 2` — `count` returns 1 because Swift counts grapheme clusters, not Unicode scalars; use `unicodeScalars.count` for scalar count.
- Using `String(format:)` when interpolation works — `String(format: "%d", n)` is Obj-C bridge and loses Swift's type safety; prefer `\(n)`.
- Modifying a string while holding a `String.Index` — indices may be invalidated by mutation; recompute indices after edits.

### Real-World Applications

- Apple's Foundation text system uses grapheme clusters throughout, so emoji and combined characters count and edit correctly in TextEdit, Mail, and Notes.
- Twitter's iOS app uses Swift string slicing to truncate long tweets at grapheme boundaries, never splitting an emoji in half.
- WhatsApp handles ZWJ sequences (family emoji) correctly because Swift treats them as single `Character` values.
- Bear Notes uses `Substring` for live syntax highlighting so highlighters don't copy the entire document on every keystroke.

### Interview Questions

- 1. Why can't you subscript a Swift `String` with an `Int`? — Because grapheme cluster boundaries aren't O(1) computable; the type system forces you to use `String.Index` and explicitly compute offsets.
- 2. What is a `Character` in Swift? — An extended grapheme cluster, which is a user-perceived character that may consist of multiple Unicode scalars.
- 3. What's the difference between `String` and `Substring`? — `Substring` shares storage with its origin string (COW) until mutated or converted; `String` owns its buffer.
- 4. When does a `Substring` keep its origin alive? — Until the substring is released or converted to `String`; this can leak large buffers if you hold tiny substrings long-term.
- 5. How do you create a multiline raw string with `#` inside it? — Increase the `#` count to one more than the longest run inside: `##" ... # ... "##`.

### Mini Project

Build a CSV Parser: Parse a string of comma-separated values into `[[String]]`, handling quoted fields with embedded commas. Suggested approach:
  - Use `string.split(separator:)` only for trivial cases; quote handling requires a state machine
  - Track `inQuotes` boolean while iterating `Character`s
  - Build a current field buffer with `Substring` then convert to `String`
  - Use `string.indices` to iterate (not `0..<count`)
  - Return `[[String]]` and handle empty trailing lines

### Exercises

1. Print the third `Character` of "Swift" using `String.Index`, then explain why `s[2]` doesn't compile.
2. Create a `Substring` of the first 5 characters of a long string; verify it shares storage by checking `ObjectIdentifier(s.base)` if exposed.
3. Count the number of grapheme clusters in "👩‍👩‍👧‍👦" (family ZWJ) and the number of unicode scalars; explain the difference.
4. Use a raw string `#"..."#` to embed `#"C:\path\to"#` without escaping.
5. Build a `CamelCase` function using `split(by:)` on `Character` and `capitalized` on each chunk.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why can't you write `s[2]` on a Swift `String`?
9. A) Performance reasons only
10. B) It's a bug
11. C) You can — it works fine
12. D) Strings are not integer-subscriptable; you must use `String.Index` (*)
13. Explanation: Swift strings are collections of grapheme clusters whose boundaries aren't O(1) computable, so the type system forces `String.Index` and explicit offset arithmetic.
14. Q2: What does `s.count` return for "👩‍👩‍👧‍👦"?
15. A) 1 grapheme cluster (*)
16. B) 1
17. C) 4
18. D) 7
19. Explanation: The family emoji is a single extended grapheme cluster (joined by ZWJ); `count` returns 1. Use `unicodeScalars.count` for the scalar count (7).
20. Q3: What does a `Substring` share with its origin string?
21. A) Nothing — it's a copy
22. B) Storage (via copy-on-write) until mutation (*)
23. C) Only its type
24. D) Its indices but not storage
25. Explanation: `Substring` is a view into the origin's buffer; the origin stays alive until the substring is released or converted to `String`.
26. Q4: How do you convert a `Substring` to a fresh owning `String`?
27. A) `substring.copy()`
28. B) `substring as String`
29. C) `String(substring)` (*)
30. D) You can't — they're the same type
31. Explanation: `String(substring)` produces a new buffer that owns its storage, breaking the link to the origin.
32. Q5: Which produces a multiline string in Swift?
33. A) `"line1\nline2"`
34. B) `"""line1\nline2"""`
35. C) `r"line1\nline2"`
36. D) `"""\nline1\nline2\n"""` with literal newlines (*)
37. Explanation: Triple-quoted `"""..."""` allows literal newlines; closing delimiter's indentation controls the stripping of leading whitespace.
38. Q6: What is a `Character` in Swift?
39. A) An extended grapheme cluster (*)
40. B) A single byte
41. C) A Unicode code point
42. D) An ASCII code
43. Explanation: `Character` is an extended grapheme cluster — what a user perceives as one character — which may include multiple Unicode scalars.
44. Q7: Which is the safe way to get the index 3 positions after `s.startIndex`?
45. A) `s.startIndex + 3`
46. B) `s.index(s.startIndex, offsetBy: 3)` (*)
47. C) `s[3]`
48. D) `s.advanced(by: 3)`
49. Explanation: `String.Index` doesn't support `+`; use `index(_:offsetBy:)` to advance by N positions.
50. Q8: What is the result of `"a,b,,c".split(separator: ",")`?
51. A) `["a", "b", "c"]`
52. B) `["a", "b", "", "c"]` (4 elements, default `omittingEmptySubsequences: true` actually drops empty)
53. C) `["a", "b", "c"]` — empty subsequences are omitted by default (*)
54. D) Compile error
55. Explanation: By default `split(separator:)` omits empty subsequences; pass `omittingEmptySubsequences: false` to keep them.
56. Q9: What does `s.replacingOccurrences(of:with:)` return?
57. A) Modifies `s` in place
58. B) A `Substring`
59. C) An optional
60. D) A new `String` (*)
61. Explanation: `String` is a value type; `replacingOccurrences` returns a new string and leaves the original unchanged.
62. Q10: Which creates a raw string containing a literal `#` and `"`?
63. A) `##"text with # and ""##` (*)
64. B) `#"text"#`
65. C) `"text with # and \""`
66. D) `r"text with # and ""`
67. Explanation: Raw strings use one more `#` than the longest run of `#` inside; `##"..."##` allows single `#` and `"` inside without escaping.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why can't you write `s[2]` on a Swift `String`?
  options:
    - Performance reasons only
    - It's a bug
    - You can — it works fine
    - Strings are not integer-subscriptable; you must use `String.Index`
  correctIndex: 3
  explanation: Swift strings are collections of grapheme clusters whose boundaries aren't O(1) computable, so the type system forces `String.Index` and explicit offset arithmetic.
- id: q2
  question: What does `s.count` return for "👩‍👩‍👧‍👦"?
  options:
    - 1 grapheme cluster
    - "1"
    - "4"
    - "7"
    - ; `count` returns 1. Use `unicodeScalars.count` for the scalar count (7).
  correctIndex: 0
  explanation: The family emoji is a single extended grapheme cluster (joined by ZWJ); `count` returns 1. Use `unicodeScalars.count` for the scalar count (7).
- id: q3
  question: What does a `Substring` share with its origin string?
  options:
    - Nothing — it's a copy
    - Storage (via copy-on-write) until mutation
    - Only its type
    - Its indices but not storage
  correctIndex: 1
  explanation: "`Substring` is a view into the origin's buffer; the origin stays alive until the substring is released or converted to `String`."
- id: q4
  question: How do you convert a `Substring` to a fresh owning `String`?
  options:
    - "`substring.copy()`"
    - "`substring as String`"
    - "`String(substring)`"
    - You can't — they're the same type
  correctIndex: 2
  explanation: "`String(substring)` produces a new buffer that owns its storage, breaking the link to the origin."
- id: q5
  question: Which produces a multiline string in Swift?
  options:
    - '`"line1\nline2"`'
    - '`"""line1\nline2"""`'
    - '`r"line1\nline2"`'
    - '`"""\nline1\nline2\n"""` with literal newlines'
  correctIndex: 3
  explanation: Triple-quoted `"""..."""` allows literal newlines; closing delimiter's indentation controls the stripping of leading whitespace.
- id: q6
  question: What is a `Character` in Swift?
  options:
    - An extended grapheme cluster
    - A single byte
    - A Unicode code point
    - An ASCII code
  correctIndex: 0
  explanation: "`Character` is an extended grapheme cluster — what a user perceives as one character — which may include multiple Unicode scalars."
- id: q7
  question: Which is the safe way to get the index 3 positions after `s.startIndex`?
  options:
    - "`s.startIndex + 3`"
    - "`s.index(s.startIndex, offsetBy: 3)`"
    - "`s[3]`"
    - "`s.advanced(by: 3)`"
  correctIndex: 1
  explanation: "`String.Index` doesn't support `+`; use `index(_:offsetBy:)` to advance by N positions."
- id: q8
  question: 'What is the result of `"a,b,,c".split(separator: ",")`?'
  options:
    - '`["a", "b", "c"]`'
    - '`["a", "b", "", "c"]` (4 elements, default `omittingEmptySubsequences: true` actually drops empty)'
    - '`["a", "b", "c"]` — empty subsequences are omitted by default'
    - Compile error
  correctIndex: 2
  explanation: "By default `split(separator:)` omits empty subsequences; pass `omittingEmptySubsequences: false` to keep them."
- id: q9
  question: What does `s.replacingOccurrences(of:with:)` return?
  options:
    - Modifies `s` in place
    - A `Substring`
    - An optional
    - A new `String`
  correctIndex: 3
  explanation: "`String` is a value type; `replacingOccurrences` returns a new string and leaves the original unchanged."
- id: q10
  question: Which creates a raw string containing a literal `#` and `"`?
  options:
    - '`##"text with # and ""##`'
    - '`#"text"#`'
    - '`"text with # and \""`'
    - '`r"text with # and ""`'
  correctIndex: 0
  explanation: Raw strings use one more `#` than the longest run of `#` inside; `##"..."##` allows single `#` and `"` inside without escaping.
```

