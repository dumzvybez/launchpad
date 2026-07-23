---
slug: r-functions-functional-programming-lapply-sapply-map
id: r-07
track: r
order: 7
title: Functions and Functional Programming (lapply, sapply, map)
description: Write robust R functions with proper argument matching, defaults, and dots; then replace loops with the functional toolset — lapply, sapply, vapply, and purrr::map family.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=2100s
whyItMatters: Write robust R functions with proper argument matching, defaults, and dots; then replace loops with the functional toolset — lapply, sapply, vapply, and purrr::map family.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Functions and Functional Programming (lapply, sapply, map)

## Functions and Functional Programming (lapply, sapply, map)

### Why It Matters

Write robust R functions with proper argument matching, defaults, and dots; then replace loops with the functional toolset — lapply, sapply, vapply, and purrr::map family.

Write robust R functions with proper argument matching, defaults, and dots; then replace loops with the functional toolset — lapply, sapply, vapply, and purrr::map family.

### Prerequisites

- Stage 2: Variables, Vectors, and Atomic Types
- Stage 6: Control Flow — Conditionals and Loops

### Topics

- function() syntax: arguments, body, return value
- Argument matching: positional, named, partial (and why to avoid it in packages)
- Default arguments and missing() detection
- ... (dots) for passing extra arguments; list(...) and ..1, ..2
- Lexical scoping and environment lookups
- lapply(), sapply(), vapply() — and why vapply() wins in packages
- mapply() / Map() for multiple-argument iteration
- purrr::map(), map_dbl(), map_chr(), map2(), pmap() (preview)

### Key Concepts

- R uses lexical scoping: a function looks up free variables in the environment where it was defined, not where it was called.
- Argument matching happens in three stages: exact named, then partial named, then positional; partial matching is forbidden in package code by R CMD check.
- lapply(X, FUN) always returns a list; sapply() tries to simplify (often to a vector or matrix) but is unpredictable; vapply() requires a template and is the safe choice.
- Functions return the last evaluated expression; return() is explicit but optional, and is recommended for early-exit branches.
- Anonymous functions are common in map calls: purrr::map(xs, \(x) x^2) (R 4.1+ native syntax) or purrr::map(xs, function(x) x^2) or purrr::map(xs, ~ .x^2).

```r
standardize <- function(x, center = mean, scale = sd) {
  if (length(x) == 0) return(numeric(0))
  (x - center(x, na.rm = TRUE)) / scale(x, na.rm = TRUE)
}
standardize(c(1, 2, 3, 4, 5))         # uses defaults
standardize(c(1,2,3), center = median)
```
Caption: Function definition and defaults

### Common Pitfalls

- Using sapply() in a package — sapply() opportunistically simplifies and may return a list on edge cases (empty input, mixed lengths); vapply(FUN.VALUE = ...) guarantees the shape, so R CMD check insists on it.
- Forgetting that lapply() returns a list — even when each call returns a scalar, you get a list of length-1 elements; wrap with unlist() or use vapply/map_dbl to get a vector.
- Relying on partial argument matching — f(x = 5) works, but f(x = 5) and f(xyz = 5) may both match argument 'xyz' if no exact match exists; R CMD check warns; always match exactly in package code.
- Modifying global state from a function with <<- — super-assignment is rarely needed and creates hidden coupling; use environments explicitly or return updated values instead.
- Passing complex expressions through ... without validation — list(...) lets you inspect dots, but missing validation can produce unhelpful errors downstream; check names with match.call() if needed.

### Real-World Applications

- Airbnb's R package ecosystem uses purrr::map() extensively to iterate over hundreds of A/B test definitions and render each as an R Markdown report.
- Bioconductor's lapply() over SummarizedExperiment columns is the workhorse for per-sample QC stats across thousands of single-cell samples.
- Netflix's experimentation platform uses vapply() (not sapply()) inside its internal R packages precisely because R CMD check enforces type stability.
- The tidyverse itself is built on purrr and vctrs; the consistent map_dbl/map_chr/map_int contract is what makes typed pipelines composable at scale.

### Interview Questions

- 1. What is the difference between lapply(), sapply(), and vapply()? — lapply() always returns a list; sapply() tries to simplify (unpredictable); vapply() requires a template (FUN.VALUE) and guarantees type — the right choice for packages.
- 2. Explain R's lexical scoping. — A function looks up free variables in the environment where it was defined (its enclosing environment), not where it was called; this is what makes closures work.
- 3. What is ... (dots) and when would you use it? — ... collects extra arguments to forward to another function (e.g. plot(...)) or to construct a list with list(...); it is the idiomatic way to write flexible wrappers.
- 4. How do you write an anonymous function in purrr::map()? — Three ways: function(x) x^2 (classic), ~ .x^2 (formula shorthand), or \(x) x^2 (R 4.1+ native lambda).
- 5. Why does R CMD check warn about sapply() in packages? — sapply()'s return type is unpredictable (vector or list), which violates type stability that package code should guarantee; use vapply() instead.

### Mini Project

Build a Column Profiler: A function profile_columns(df) that takes a data frame or tibble and returns a tibble with one row per column, showing name, type, n, n_missing, n_unique, min (if numeric), max (if numeric), and sample (first 3 values as a list-column). Use vapply() (or purrr::map_dfr) to iterate columns; never throw on non-numeric or all-NA columns.
Suggested approach:
  - Get column names and types with names(df) and vapply(df, typeof, character(1))
  - Use vapply(df, function(x) sum(is.na(x)), integer(1)) for missing counts
  - Branch on is.numeric() to compute min/max, otherwise NA_real_
  - Capture first-3 samples with lapply(df, function(x) head(x, 3))
  - Assemble a tibble with tibble::tibble(); test on mtcars, iris, and an empty frame

### Exercises

1. Write a function zscore(x, na.rm = TRUE) that returns the z-scored vector; verify it returns 0 mean and 1 sd on a sample.
2. Use lapply() and vapply() to compute column means of mtcars; explain the difference in output type.
3. Write a wrapper function plot_col(df, col, ...) that uses ... to forward graphical params to plot(); test with col = 'blue' and main = 'Title'.
4. Use purrr::map_dfr() to read 3 small CSVs and bind them row-wise into one tibble.
5. Demonstrate the sapply() surprise: call sapply(list(), mean) and observe it returns list(); show that vapply(list(), mean, numeric(1)) returns numeric(0).
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does lapply() always return?
9. A) A vector
10. B) A data frame
11. C) A list (*)
12. D) Whatever sapply would return
13. Explanation: lapply() always returns a list, regardless of the FUN return type; wrap with unlist() or use vapply/map_dbl for vectors.
14. Q2: Why is vapply() preferred over sapply() in packages?
15. A) It is faster
16. B) It handles missing values better
17. C) It supports parallelism
18. D) It guarantees the return type and shape via FUN.VALUE (*)
19. Explanation: vapply(FUN.VALUE = ...) requires a template, guaranteeing type and shape; sapply() silently simplifies or returns a list unpredictably.
20. Q3: What does sapply(list(), mean) return?
21. A) list() (*)
22. B) numeric(0)
23. C) NULL
24. D) An error
25. Explanation: sapply() on an empty input returns a list (not a vector), which is the classic type-instability footgun.
26. Q4: Which scoping rule does R use?
27. A) Dynamic scoping
28. B) Lexical scoping (*)
29. C) Prototype scoping
30. D) Closure scoping
31. Explanation: R uses lexical scoping: free variables in a function are looked up in the environment where the function was defined.
32. Q5: What does ... (dots) do in a function signature?
33. A) Marks optional arguments
34. B) Indicates default values
35. C) Collects extra arguments for forwarding or list(...) (*)
36. D) Is a comment marker
37. Explanation: ... collects extra arguments; you can forward them with f(...) or capture them as a list with list(...).
38. Q6: What is the R 4.1+ native anonymous function syntax?
39. A) lambda(x) x^2
40. B) x => x^2
41. C) function(x) { x^2 }
42. D) \(x) x^2 (*)
43. Explanation: R 4.1 added the native lambda syntax \(x) x^2 (backslash-paren-args); it is shorter than function(x) x^2 and stricter than purrr's ~ formula.
44. Q7: What does missing(arg) test for inside a function?
45. A) Whether arg was supplied by the caller (*)
46. B) Whether arg is NA
47. C) Whether arg is NULL
48. D) Whether arg has length 0
49. Explanation: missing(arg) returns TRUE if the caller did not supply the argument; useful for distinguishing 'not provided' from 'provided as NULL'.
50. Q8: Why does R CMD check warn about partial argument matching?
51. A) It is slower
52. B) It is ambiguous and breaks if a new argument with the same prefix is added (*)
53. C) It only works in interactive mode
54. D) It causes memory leaks
55. Explanation: Partial matching (f(x = 5) matching argument 'xyz') is fragile; package code should match arguments exactly to remain stable across versions.
56. Q9: What does purrr::map2(c(1,2,3), c(10,20,30), ~ .x + .y) return?
57. A) A numeric vector: 11 22 33
58. B) An error
59. C) A list: 11, 22, 33 (*)
60. D) A tibble
61. Explanation: map2() always returns a list; use map2_dbl() for a numeric vector result.
62. Q10: When does a function return without an explicit return()?
63. A) Never — return() is required
64. B) It returns NULL
65. C) It returns the first argument
66. D) It returns the last evaluated expression (*)
67. Explanation: R functions return the value of the last evaluated expression; return() is optional but useful for early-exit branches.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does lapply() always return?
  options:
    - A vector
    - A data frame
    - A list
    - Whatever sapply would return
  correctIndex: 2
  explanation: lapply() always returns a list, regardless of the FUN return type; wrap with unlist() or use vapply/map_dbl for vectors.
- id: q2
  question: Why is vapply() preferred over sapply() in packages?
  options:
    - It is faster
    - It handles missing values better
    - It supports parallelism
    - It guarantees the return type and shape via FUN.VALUE
  correctIndex: 3
  explanation: vapply(FUN.VALUE = ...) requires a template, guaranteeing type and shape; sapply() silently simplifies or returns a list unpredictably.
- id: q3
  question: What does sapply(list(), mean) return?
  options:
    - list()
    - numeric(0)
    - "NULL"
    - An error
  correctIndex: 0
  explanation: sapply() on an empty input returns a list (not a vector), which is the classic type-instability footgun.
- id: q4
  question: Which scoping rule does R use?
  options:
    - Dynamic scoping
    - Lexical scoping
    - Prototype scoping
    - Closure scoping
  correctIndex: 1
  explanation: "R uses lexical scoping: free variables in a function are looked up in the environment where the function was defined."
- id: q5
  question: What does ... (dots) do in a function signature?
  options:
    - Marks optional arguments
    - Indicates default values
    - Collects extra arguments for forwarding or list(...)
    - Is a comment marker
  correctIndex: 2
  explanation: ... collects extra arguments; you can forward them with f(...) or capture them as a list with list(...).
- id: q6
  question: What is the R 4.1+ native anonymous function syntax?
  options:
    - lambda(x) x^2
    - x => x^2
    - function(x) { x^2 }
    - \(x) x^2
  correctIndex: 3
  explanation: R 4.1 added the native lambda syntax \(x) x^2 (backslash-paren-args); it is shorter than function(x) x^2 and stricter than purrr's ~ formula.
- id: q7
  question: What does missing(arg) test for inside a function?
  options:
    - Whether arg was supplied by the caller
    - Whether arg is NA
    - Whether arg is NULL
    - Whether arg has length 0
  correctIndex: 0
  explanation: missing(arg) returns TRUE if the caller did not supply the argument; useful for distinguishing 'not provided' from 'provided as NULL'.
- id: q8
  question: Why does R CMD check warn about partial argument matching?
  options:
    - It is slower
    - It is ambiguous and breaks if a new argument with the same prefix is added
    - It only works in interactive mode
    - It causes memory leaks
  correctIndex: 1
  explanation: Partial matching (f(x = 5) matching argument 'xyz') is fragile; package code should match arguments exactly to remain stable across versions.
- id: q9
  question: What does purrr::map2(c(1,2,3), c(10,20,30), ~ .x + .y) return?
  options:
    - "A numeric vector: 11 22 33"
    - An error
    - "A list: 11, 22, 33"
    - A tibble
  correctIndex: 2
  explanation: map2() always returns a list; use map2_dbl() for a numeric vector result.
- id: q10
  question: When does a function return without an explicit return()?
  options:
    - Never — return() is required
    - It returns NULL
    - It returns the first argument
    - It returns the last evaluated expression
  correctIndex: 3
  explanation: R functions return the value of the last evaluated expression; return() is optional but useful for early-exit branches.
```

