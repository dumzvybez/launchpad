---
slug: r-strings-stringr-regular-expressions
id: r-13
track: r
order: 13
title: Strings with stringr and Regular Expressions
description: Manipulate text with the stringr package and its consistent, vectorized API — plus regex anchors, quantifiers, lookarounds, and the differences from base R's paste/grep family.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=4200s
whyItMatters: Manipulate text with the stringr package and its consistent, vectorized API — plus regex anchors, quantifiers, lookarounds, and the differences from base R's paste/grep family.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Strings with stringr and Regular Expressions

## Strings with stringr and Regular Expressions

### Why It Matters

Manipulate text with the stringr package and its consistent, vectorized API — plus regex anchors, quantifiers, lookarounds, and the differences from base R's paste/grep family.

Manipulate text with the stringr package and its consistent, vectorized API — plus regex anchors, quantifiers, lookarounds, and the differences from base R's paste/grep family.

### Prerequisites

- Stage 2: Variables, Vectors, and Atomic Types
- Stage 9: Data Wrangling with dplyr

### Topics

- stringr vs base: str_length() vs nchar(), str_sub() vs substr()
- str_detect(), str_which(), str_count(), str_locate()
- str_extract(), str_match(), str_replace(), str_replace_all()
- str_split(), str_split_fixed(), str_glue()
- str_pad(), str_trim(), str_squish(), str_to_lower/upper/title()
- Regex anchors (^, $), quantifiers (*, +, ?, {n,m}), classes (\\d, \\w, \\s)
- regex(), fixed(), coll() — different matching engines
- Lookarounds: (?<=...), (?!...), (?:...) non-capturing groups

### Key Concepts

- stringr is a wrapper around ICU (the same library used by Java/Python); base R's grep/sub use either TRE (default) or PCRE (perl = TRUE), and the syntax differs slightly.
- stringr functions are zero-grep: str_length(x) returns a vector the same length as x; str_sub(x, start, end) is one-based and supports negative end (count from end).
- str_detect(x, pattern) returns logical; str_extract() returns the first match; str_extract_all(x, pattern, simplify = TRUE) returns a matrix.
- Use fixed('pattern') for literal matching (no regex, faster); coll() for collation-aware (locale-aware) comparison; regex() for full ICU regex.
- str_glue('Hello {name}!') is the tidyverse replacement for paste()/sprintf(); it interpolates R expressions inside {} and is type-safe.

```r
library(stringr)
names <- c("Ada Lovelace", "Linus Torvalds", "Grace Hopper")
str_length(names)             # 12 15 12
str_sub(names, 1, 5)          # first 5 chars
str_sub(names, -6, -1)        # last 6 chars (negative = from end)
str_to_upper(names)
str_detect(names, "^A")       # TRUE FALSE FALSE (starts with A)
str_count(names, "[aeiou]")   # count vowels
str_replace(names, " ", "_")  # replace first space
str_replace_all(names, " ", "_")  # replace all
```
Caption: stringr basics

### Common Pitfalls

- Confusing \\d vs \d in regex — R strings need double-escaping (\\d) because backslash is R's escape char; use raw strings r'(\\d)' (R 4.0+) to avoid this entirely.
- Using str_replace() when you mean str_replace_all() — str_replace() only replaces the first match per string; str_replace_all() replaces all; the difference is silent.
- Forgetting that str_split() returns a list — each input string yields a character vector; use str_split_fixed(pattern, n) to get a matrix, or purrr::flatten_chr() to unlist.
- Mixing stringr (ICU) and base grep (TRE/PCRE) — the regex syntax differs slightly (e.g. ICU supports \p{L} for any letter, TRE does not); pick one engine per project.
- Treating str_extract_all() as a vector — it returns a list of character vectors (variable length per input); pass simplify = TRUE to coerce to a matrix (filling with empty strings).

### Real-World Applications

- Airbnb uses stringr to clean user-entered listing descriptions, extract amenities from free text, and normalize phone numbers across locales before joining to a phone blacklist.
- Netflix uses str_detect() + regex to classify customer-support tickets into categories (refund, password, streaming quality) for routing to specialized teams.
- The New York Times uses str_extract_all() to pull quotes, dates, and bylines from raw AP wire text, then joins to a database of correspondents.
- Bioconductor's Biostrings package (built on top of stringr-like ideas) is used to manipulate DNA sequences with pattern matching at the chromosome scale.

### Interview Questions

- 1. What engine does stringr use, and how does it differ from base R's grep()? — stringr uses ICU; base grep() uses TRE by default and PCRE with perl = TRUE; the regex syntax differs slightly (e.g. ICU supports \p{L} for any letter).
- 2. Why do you need \\d (double backslash) in an R regex? — R strings treat backslash as an escape, so \d would be interpreted as 'd' (or error); \\d is the literal '\d' that the regex engine sees; raw strings r'(\d)' avoid this.
- 3. What is the difference between str_replace() and str_replace_all()? — str_replace() replaces only the first match per string; str_replace_all() replaces all matches; the difference is silent.
- 4. When would you use fixed() instead of regex()? — fixed('pattern') does literal matching (no metacharacters) and is faster; use it when the search string is user input or has special regex chars like '.' or '*'.
- 5. What does str_glue('Hi {name}!') do that paste() does not? — str_glue() interpolates R expressions inside {} directly; paste() requires explicit sep/collapse and sprintf-style formatting for type conversion.

### Mini Project

Build a Phone Number Normalizer: A function normalize_phone(strings) that takes a vector of phone numbers in mixed formats ('(415) 555-1234', '415-555-1234', '415.555.1234', '+1 415 555 1234') and returns a vector of normalized 'XXX-XXX-XXXX' strings. Use str_extract_all() with a regex that captures 3+3+4 digits, then assemble with str_glue(). Return NA for inputs that don't match a 10-digit pattern.
Suggested approach:
  - Use str_match(strings, '(\\d{3})[^\\d]*(\\d{3})[^\\d]*(\\d{4})') to capture three groups
  - Coerce NAs to NA_character_ with dplyr::if_else(is.na(m[, 1]), ...)
  - Assemble with str_glue_data(as_tibble(m[, 2:4]), '{1}-{2}-{3}') or paste()
  - Test with valid 10-digit, international +1, missing, and malformed inputs
  - Return NA_character_ for any input that doesn't yield three captured groups

### Exercises

1. Use str_detect() to find which US state names start with a vowel; use str_count() to count vowels per state name.
2. Use str_replace_all() to convert 'Hello World' to 'hello_world' (lowercase, spaces to underscores); write the regex carefully.
3. Use str_match() to extract the year, month, and day from a vector of 'YYYY-MM-DD' strings; verify with as.Date().
4. Use str_split_fixed() to split 'first,last,email' strings into a 3-column matrix; convert to a tibble.
5. Use str_glue() to format a vector of names and scores into 'Ada: 95' strings; test with NA scores that should produce 'Ada: N/A'.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What regex engine does stringr use?
9. A) ICU (*)
10. B) TRE
11. C) PCRE
12. D) POSIX
13. Explanation: stringr wraps ICU (International Components for Unicode), the same library Java and Python's regex use; base grep uses TRE by default or PCRE with perl = TRUE.
14. Q2: Why do you need \\d (double backslash) in an R regex?
15. A) It is ICU-specific syntax
16. B) R strings treat backslash as an escape; \\d is the literal '\d' the regex engine sees (*)
17. C) TRE requires double backslashes
18. D) It is faster
19. Explanation: R strings interpret backslash as an escape; '\d' would be just 'd' or error. \\d is the literal '\d' the regex engine sees. Raw strings r'(\d)' (R 4.0+) avoid this entirely.
20. Q3: What is the difference between str_replace() and str_replace_all()?
21. A) They are identical
22. B) str_replace_all() is faster
23. C) str_replace() replaces only the first match per string; str_replace_all() replaces all (*)
24. D) str_replace_all() only works on vectors
25. Explanation: str_replace() replaces the first match per string; str_replace_all() replaces every match. The difference is silent and a common bug.
26. Q4: What does fixed('pattern') do?
27. A) Same as regex()
28. B) Case-insensitive matching
29. C) Locale-aware matching
30. D) Literal matching (no metacharacters), faster (*)
31. Explanation: fixed() does literal substring matching with no regex interpretation; use it for user input or patterns with regex metacharacters like '.' or '*'.
32. Q5: What does str_detect(x, '^A') return?
33. A) A logical vector: TRUE where x starts with 'A' (*)
34. B) A character vector of matches
35. C) A count of matches
36. D) An error
37. Explanation: str_detect() returns a logical vector the same length as x; ^ anchors to the start, so '^A' matches strings starting with 'A'.
38. Q6: What does str_split('a,b,c', ',')[[1]] return?
39. A) A list of one vector
40. B) A character vector c('a','b','c') (*)
41. C) A matrix
42. D) An error
43. Explanation: str_split() returns a list (one element per input string); [[1]] extracts the first element, which is c('a','b','c').
44. Q7: What does str_glue('Hi {name}!') do?
45. A) Concatenates 'Hi ' and 'name' and '!'
46. B) Throws an error
47. C) Interpolates the R variable 'name' inside the braces (*)
48. D) Returns a list
49. Explanation: str_glue() interpolates R expressions inside {} (here, the variable 'name'); it's the tidyverse replacement for paste() with interpolation.
50. Q8: What does str_sub(x, -6, -1) return?
51. A) An error (negative indices not allowed)
52. B) The first 6 characters
53. C) Characters 6 to 1 (reverse order)
54. D) The last 6 characters of each string (*)
55. Explanation: Negative indices in str_sub() count from the end; -6 to -1 returns the last 6 characters.
56. Q9: What does str_extract_all(x, '\\d+', simplify = TRUE) return?
57. A) A matrix with one row per input and one column per match (*)
58. B) A list of character vectors
59. C) A vector
60. D) An error
61. Explanation: str_extract_all() returns a list by default; simplify = TRUE coerces to a matrix (one row per input string, one column per match, empty strings filling gaps).
62. Q10: Which anchors match the start and end of a string?
63. A) < and >
64. B) ^ and $ (*)
65. C) \\A and \\Z
66. D) [ and ]
67. Explanation: ^ anchors to the start of the string (or line in multiline mode); $ anchors to the end. \\A and \\Z are stricter (always start/end of string, not line).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What regex engine does stringr use?
  options:
    - ICU
    - TRE
    - PCRE
    - POSIX
  correctIndex: 0
  explanation: stringr wraps ICU (International Components for Unicode), the same library Java and Python's regex use; base grep uses TRE by default or PCRE with perl = TRUE.
- id: q2
  question: Why do you need \\d (double backslash) in an R regex?
  options:
    - It is ICU-specific syntax
    - R strings treat backslash as an escape; \\d is the literal '\d' the regex engine sees
    - TRE requires double backslashes
    - It is faster
  correctIndex: 1
  explanation: R strings interpret backslash as an escape; '\d' would be just 'd' or error. \\d is the literal '\d' the regex engine sees. Raw strings r'(\d)' (R 4.0+) avoid this entirely.
- id: q3
  question: What is the difference between str_replace() and str_replace_all()?
  options:
    - They are identical
    - str_replace_all() is faster
    - str_replace() replaces only the first match per string; str_replace_all() replaces all
    - str_replace_all() only works on vectors
  correctIndex: 2
  explanation: str_replace() replaces the first match per string; str_replace_all() replaces every match. The difference is silent and a common bug.
- id: q4
  question: What does fixed('pattern') do?
  options:
    - Same as regex()
    - Case-insensitive matching
    - Locale-aware matching
    - Literal matching (no metacharacters), faster
  correctIndex: 3
  explanation: fixed() does literal substring matching with no regex interpretation; use it for user input or patterns with regex metacharacters like '.' or '*'.
- id: q5
  question: What does str_detect(x, '^A') return?
  options:
    - "A logical vector: TRUE where x starts with 'A'"
    - A character vector of matches
    - A count of matches
    - An error
  correctIndex: 0
  explanation: str_detect() returns a logical vector the same length as x; ^ anchors to the start, so '^A' matches strings starting with 'A'.
- id: q6
  question: What does str_split('a,b,c', ',')[[1]] return?
  options:
    - A list of one vector
    - A character vector c('a','b','c')
    - A matrix
    - An error
  correctIndex: 1
  explanation: str_split() returns a list (one element per input string); [[1]] extracts the first element, which is c('a','b','c').
- id: q7
  question: What does str_glue('Hi {name}!') do?
  options:
    - Concatenates 'Hi ' and 'name' and '!'
    - Throws an error
    - Interpolates the R variable 'name' inside the braces
    - Returns a list
  correctIndex: 2
  explanation: str_glue() interpolates R expressions inside {} (here, the variable 'name'); it's the tidyverse replacement for paste() with interpolation.
- id: q8
  question: What does str_sub(x, -6, -1) return?
  options:
    - An error (negative indices not allowed)
    - The first 6 characters
    - Characters 6 to 1 (reverse order)
    - The last 6 characters of each string
  correctIndex: 3
  explanation: Negative indices in str_sub() count from the end; -6 to -1 returns the last 6 characters.
- id: q9
  question: What does str_extract_all(x, '\\d+', simplify = TRUE) return?
  options:
    - return?
    - A matrix with one row per input and one column per match
    - A list of character vectors
    - A vector
    - An error
  correctIndex: 1
  explanation: str_extract_all() returns a list by default; simplify = TRUE coerces to a matrix (one row per input string, one column per match, empty strings filling gaps).
- id: q10
  question: Which anchors match the start and end of a string?
  options:
    - < and >
    - ^ and $
    - \\A and \\Z
    - "[ and ]"
  correctIndex: 1
  explanation: ^ anchors to the start of the string (or line in multiline mode); $ anchors to the end. \\A and \\Z are stricter (always start/end of string, not line).
```

