---
slug: ruby-regex-string-processing
id: ruby-17
track: ruby
order: 17
title: Regex and String Processing
description: Master Ruby's Regexp class, named captures, gsub with blocks, scan, and string-processing helpers like split and partition.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=11100s
whyItMatters: Master Ruby's Regexp class, named captures, gsub with blocks, scan, and string-processing helpers like split and partition.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Regex and String Processing

## Regex and String Processing

### Why It Matters

Master Ruby's Regexp class, named captures, gsub with blocks, scan, and string-processing helpers like split and partition.

Master Ruby's Regexp class, named captures, gsub with blocks, scan, and string-processing helpers like split and partition.

### Prerequisites

- Stage 16: Threads, Fibers, and Ractor
- Stage 4: Strings, Symbols, and Ranges.

### Topics

- Regexp literals (/pattern/) and %r{}
- =~, match, match?, and MatchData
- Named captures with (?<name>...) and \k<name>
- gsub, gsub!, scan, split, partition
- Anchors: ^ $ \A \z \b \B
- Modifiers: /i /m /x /o
- String#chars, bytes, lines, codepoints
- Catastrophic backtracking and when to use a parser

### Key Concepts

- match? (Ruby 2.4+) is the fastest match check — it returns true/false without creating a MatchData.
- Named captures `(?<year>\d{4})` are clearer than $1, $2; access via match[:year].
- Prefer `\A` and `\z` over `^` and `$` for security — `$` matches before a trailing newline, allowing CRLF injection in validations.
- gsub with a block computes the replacement (no need for backreferences); gsub! mutates in place and returns nil on no match.
- scan returns all non-overlapping matches; with capture groups, returns an array of arrays.
- Catastrophic backtracking (e.g., `(a+)+`) can hang your process; use a real parser (strscan, parser gem) for complex grammars.

```ruby
# Literal regex with /pattern/
puts 'hello world'.match?(/world/)   # true
puts 'ruby 3.3'.match(/\d+\.\d+/)    # <MatchData "3.3">

# =~ returns the index of the match (or nil)
puts 'foo123bar' =~ /\d+/   # 3 (index of '1')

# Special variables after a match: $~, $1, $2 ...
'2024-01-15' =~ /(\d{4})-(\d{2})-(\d{2})/
puts $1   # 2024
puts $2   # 01
puts $3   # 15

# match returns a MatchData object
m = '2024-01-15'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)
puts m[:year]   # 2024
puts m[:month]  # 01
```
Caption: Regex matching and named captures

### Common Pitfalls

- Using ^ and $ for input validation — $ matches before a trailing newline, allowing CRLF injection; use \A and \z to anchor the entire string.
- Expecting gsub! to always return the string — gsub! returns nil if no substitution was made (mutation skipped) — use gsub for a guaranteed string return.
- Forgetting match? for boolean checks — match? (Ruby 2.4+) is faster than =~ and match because it skips creating MatchData — use it for boolean checks.
- Catastrophic backtracking with nested quantifiers — Patterns like (a+)+ can hang on adversarial input; use a real parser for complex grammars.
- Using $1, $2 across multiple matches — The $1, $2 globals are set by the LAST match in the current thread — use MatchData or named captures for clarity.

### Real-World Applications

- GitHub uses regex for thousands of pattern-match rules in its code-search index (with a custom RE2-backed engine for safety).
- Shopify's URL router compiles hundreds of route regexps once at boot and matches incoming requests in microseconds.
- Stripe's webhook signature verifier uses anchored regexes (\A...\z) to prevent CRLF injection in header validation.
- Airbnb's listing search uses scan to extract hashtags from property descriptions for faceted search indexing.

### Interview Questions

- 1. What's the difference between ^ and \A? — ^ matches start of line (after newlines); \A matches only start of string — prefer \A for input validation.
- 2. What does match? return that match does not? — match? returns just true/false (no MatchData object) — faster for boolean checks.
- 3. What's the danger of `(a+)+` regex? — Catastrophic backtracking — adversarial input can hang the process; use RE2 or a real parser.
- 4. How do you access named captures? — Via match[:name] after matching with (?<name>...) — clearer than $1, $2.
- 5. What does gsub! return when no match is found? — nil (unlike gsub which always returns the string) — common source of NoMethodError on nil.

### Mini Project

Build a Log Parser CLI: A tool that reads an Apache/Nginx log file and
extracts IP, timestamp, status, and path using named-capture regexes;
prints a summary by status code. Suggested approach:
Suggested approach:
  - Read file with File.foreach
  - Define a Regexp with named captures for each field
  - Use match? to skip malformed lines
  - Tally status codes with .tally
  - Print top IPs by request count with group_by + sort_by

### Exercises

1. Write a regex to validate an email and test with match? on 5 examples.
2. Use gsub with a block to redact credit card numbers in a string.
3. Use named captures to extract year/month/day from a date string.
4. Use scan to extract all hashtags from a tweet.
5. Refactor a regex with /x to add comments and whitespace.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between ^ and \A?
9. A) ^ matches start of line; \A matches start of string only (*)
10. B) They're identical
11. C) ^ is faster
12. D) \A is deprecated
13. Explanation: ^ allows matching after newlines (start of each line); \A is the strict start of the entire string — safer for validation.
14. Q2: What does match? return that match does not?
15. A) A MatchData
16. B) Just true/false (no MatchData object) (*)
17. C) An Integer
18. D) Nothing — it's a void method
19. Explanation: match? (Ruby 2.4+) skips creating MatchData for performance — use it for boolean checks.
20. Q3: What's the danger of `(a+)+` regex?
21. A) Syntax error
22. B) Slower compile
23. C) Catastrophic backtracking (*)
24. D) Matches nothing
25. Explanation: Nested quantifiers cause exponential backtracking on adversarial input; use RE2 or a real parser.
26. Q4: How do you access named captures?
27. A) match.name
28. B) match['name']
29. C) $<name>
30. D) match[:name] (*)
31. Explanation: Named captures (?<name>...) are accessed via match[:name] — clearer than $1, $2.
32. Q5: What does gsub! return when no match is found?
33. A) nil (*)
34. B) The original string
35. C) An empty string
36. D) Raises
37. Explanation: gsub! returns nil if no substitution was made — unlike gsub which always returns the string.
38. Q6: What does the /x modifier do?
39. A) Makes it case-insensitive
40. B) Allows whitespace and comments in the pattern (*)
41. C) Makes it multiline
42. D) Compiles it once
43. Explanation: /x ignores whitespace and #comments in the regex, allowing self-documenting patterns.
44. Q7: What does `'a,b,c'.split(',')` return?
45. A) "abc"
46. B) ["a,b,c"]
47. C) ["a", "b", "c"] (*)
48. D) Raises
49. Explanation: split divides the string on the delimiter and returns an Array of substrings.
50. Q8: What does `'hello'.scan(/\w/)` return?
51. A) "hello"
52. B) ["hello"]
53. C) nil
54. D) ["h", "e", "l", "l", "o"] (*)
55. Explanation: scan returns all non-overlapping matches as an Array; with capture groups, returns Array of Arrays.
56. Q9: Which is the recommended anchor for input validation?
57. A) \A...\z (*)
58. B) ^...$
59. C) \A...$
60. D) ^...\z
61. Explanation: \A and \z anchor the entire string with no exceptions — $ allows a trailing newline (CRLF injection risk).
62. Q10: What does `%r{...}` do?
63. A) Compiles regex once
64. B) An alternate regex literal (useful when pattern contains slashes) (*)
65. C) Makes it case-insensitive
66. D) Creates a Range
67. Explanation: %r{...} is an alternate regex literal — avoids escaping forward slashes in patterns like URLs.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between ^ and \A?
  options:
    - ^ matches start of line; \A matches start of string only
    - They're identical
    - ^ is faster
    - \A is deprecated
  correctIndex: 0
  explanation: ^ allows matching after newlines (start of each line); \A is the strict start of the entire string — safer for validation.
- id: q2
  question: What does match? return that match does not?
  options:
    - A MatchData
    - Just true/false (no MatchData object)
    - An Integer
    - Nothing — it's a void method
  correctIndex: 1
  explanation: match? (Ruby 2.4+) skips creating MatchData for performance — use it for boolean checks.
- id: q3
  question: What's the danger of `(a+)+` regex?
  options:
    - Syntax error
    - Slower compile
    - Catastrophic backtracking
    - Matches nothing
  correctIndex: 2
  explanation: Nested quantifiers cause exponential backtracking on adversarial input; use RE2 or a real parser.
- id: q4
  question: How do you access named captures?
  options:
    - match.name
    - match['name']
    - $<name>
    - match[:name]
  correctIndex: 3
  explanation: Named captures (?<name>...) are accessed via match[:name] — clearer than $1, $2.
- id: q5
  question: What does gsub! return when no match is found?
  options:
    - nil
    - The original string
    - An empty string
    - Raises
  correctIndex: 0
  explanation: gsub! returns nil if no substitution was made — unlike gsub which always returns the string.
- id: q6
  question: What does the /x modifier do?
  options:
    - Makes it case-insensitive
    - Allows whitespace and comments in the pattern
    - Makes it multiline
    - Compiles it once
  correctIndex: 1
  explanation: "/x ignores whitespace and #comments in the regex, allowing self-documenting patterns."
- id: q7
  question: What does `'a,b,c'.split(',')` return?
  options:
    - '"abc"'
    - '["a,b,c"]'
    - '["a", "b", "c"]'
    - Raises
  correctIndex: 2
  explanation: split divides the string on the delimiter and returns an Array of substrings.
- id: q8
  question: What does `'hello'.scan(/\w/)` return?
  options:
    - '"hello"'
    - '["hello"]'
    - nil
    - '["h", "e", "l", "l", "o"]'
  correctIndex: 3
  explanation: scan returns all non-overlapping matches as an Array; with capture groups, returns Array of Arrays.
- id: q9
  question: Which is the recommended anchor for input validation?
  options:
    - \A...\z
    - ^...$
    - \A...$
    - ^...\z
  correctIndex: 0
  explanation: \A and \z anchor the entire string with no exceptions — $ allows a trailing newline (CRLF injection risk).
- id: q10
  question: What does `%r{...}` do?
  options:
    - Compiles regex once
    - An alternate regex literal (useful when pattern contains slashes)
    - Makes it case-insensitive
    - Creates a Range
  correctIndex: 1
  explanation: "%r{...} is an alternate regex literal — avoids escaping forward slashes in patterns like URLs."
```

