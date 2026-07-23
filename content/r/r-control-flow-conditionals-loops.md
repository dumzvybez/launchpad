---
slug: r-control-flow-conditionals-loops
id: r-06
track: r
order: 6
title: Control Flow — Conditionals and Loops
description: Use R's conditional and looping constructs — if/else, ifelse(), case_when(), for/while/repeat — and learn when to vectorize instead, which is the most idiomatic R style.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=1750s
whyItMatters: Use R's conditional and looping constructs — if/else, ifelse(), case_when(), for/while/repeat — and learn when to vectorize instead, which is the most idiomatic R style.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Use R's conditional and looping constructs — if/else, ifelse(), case_when(), for/while/repeat — and learn when to vectorize instead, which is the most idiomatic R style.

Use R's conditional and looping constructs — if/else, ifelse(), case_when(), for/while/repeat — and learn when to vectorize instead, which is the most idiomatic R style.

### Prerequisites

- Stage 2: Variables, Vectors, and Atomic Types
- Stage 4: Data Frames and Tibbles

### Topics

- if / else if / else blocks (scalar conditionals)
- Vectorized ifelse(test, yes, no)
- dplyr::case_when() for multi-branch vectorized logic
- switch() for value-based dispatch
- for, while, and repeat loops with break / next
- Looping over indices vs elements; seq_along() vs 1:length()
- Vectorization: when NOT to write a loop
- purrr::map() and friends as functional replacements for loops (preview)

### Key Concepts

- if expects a single TRUE/FALSE (length-1 logical); if you pass a vector, R warns and uses only the first element — a silent correctness bug.
- ifelse() is vectorized but returns NA where test is NA, and silently strips attributes (e.g. Date, factor) — prefer dplyr::if_else() or data.table::fifelse() for type safety.
- case_when() evaluates formulas left-to-right and returns the first match; LHS must be a logical vector, RHS gives the value; all RHS must have the same type.
- for loops in R iterate over elements (for (x in vec)) not indices; use for (i in seq_along(vec)) when you need the index.
- Most R loops should be replaced with a vectorized operation, lapply/map, or dplyr::across() — explicit loops are slow and unidiomatic.

```r
x <- 7
if (x < 0) {
  message("negative")
} else if (x == 0) {
  message("zero")
} else {
  message("positive: ", x)
}
# Pitfall: if requires length-1 logical
if (c(TRUE, FALSE)) message("hi")  # warning, uses first element only
```
Caption: if / else if / else

### Common Pitfalls

- Passing a vector to if — if (df$x > 0) only uses the first element and warns; use if(all(df$x > 0)) or any(), or switch to ifelse()/case_when() for vectorized logic.
- Using 1:length(x) in a loop — if x is empty, 1:length(x) yields c(1, 0) and the loop runs twice with index 1 (NA) and 0 (last element); use seq_along(x) instead.
- Nested ifelse() calls — readable in theory, hideous in practice, and they silently strip Date/factor attributes; use dplyr::case_when() or dplyr::if_else() instead.
- Writing a for loop to apply a function to each column — use lapply(), purrr::map(), or dplyr::across(); loops are 10-100x slower and harder to read.
- Forgetting the TRUE ~ default branch in case_when() — unmatched rows get NA, often silently; always include a catch-all at the bottom.

### Real-World Applications

- Netflix uses case_when() heavily in experiment-readout pipelines to bucket users into treatment cohorts with millions of rows processed per render.
- Airbnb's data scientists use vectorized if_else() to flag suspicious listings (e.g. instant_bookable AND has_minimum_nights <= 1) across millions of records in milliseconds.
- The New York Times election model uses if branches for state-specific path logic and case_when() to bucket states into 'called', 'leaning', and 'tossup'.
- Bioconductor's SingleCellExperiment workflows use loops only when calling C-level code per gene; everything else is vectorized via DelayedArray.

### Interview Questions

- 1. What happens if you pass a length-2 logical vector to if? — R warns ('the condition has length > 1') and uses only the first element, which is usually a silent bug; use all() or any().
- 2. Why is 1:length(x) dangerous in a loop? — If x is empty, 1:length(x) becomes c(1, 0) and the loop iterates twice with bad indices; seq_along(x) is safe because it returns integer(0) on empty input.
- 3. What does case_when() return for unmatched rows? — NA, unless you add a TRUE ~ default branch at the bottom; this is a common silent-bug source.
- 4. How is dplyr::if_else() different from base ifelse()? — if_else() requires same type for yes/no/missing, preserves attributes (Date, factor), and is strict; ifelse() silently strips attributes and coerces.
- 5. When is a for loop the right choice in R? — When each iteration depends on the previous (cumulative state), when calling side-effectful functions like write() or plot(), or when a vectorized API does not exist.

### Mini Project

Build a Grade Calculator: A function assign_grades(scores, scheme = 'letter') that takes a numeric vector of scores and returns a tibble with columns score, grade, gpa (4.0 scale), and pass_fail. Support at least two schemes (letter A-F and pass/fail with a configurable threshold). Use case_when() for the letter scheme, if_else() for pass/fail, and handle NA scores by propagating them through.
Suggested approach:
  - Use dplyr::case_when() with score >= 90 ~ 'A', etc., ending with TRUE ~ 'F'
  - Map letters to GPA via a named lookup vector: c(A=4, B=3, C=2, D=1, F=0)
  - Use if_else(is.na(score), NA_character_, ...) to propagate missingness
  - Add a pass_fail column with if_else(score >= threshold, 'P', 'F', missing = 'I')
  - Return a tibble so column types are stable; test with NA, 0, 100, and an empty vector

### Exercises

1. Write an if/else if/else chain that classifies a BMI value as underweight, normal, overweight, or obese; test with 17, 22, 28, 35.
2. Re-implement the BMI classifier using dplyr::case_when() on a vector of 10 BMI values; compare readability with the if/else version.
3. Demonstrate the 1:length(x) bug: write a loop with 1:length(NULL) and observe it runs twice; then fix it with seq_along().
4. Use a for loop to compute cumulative sums of 1:100; then re-implement with cumsum() and benchmark both with system.time().
5. Build a switch()-based function weekday_name(n) that returns the name for n=1..7 and 'invalid' otherwise.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does if (c(TRUE, FALSE)) message('hi') do?
9. A) Prints 'hi' twice
10. B) Warns and prints 'hi' using the first element only (*)
11. C) Throws an error
12. D) Prints nothing
13. Explanation: if expects a length-1 logical; a longer vector triggers a warning and uses only the first element.
14. Q2: Why is 1:length(x) unsafe in a for loop?
15. A) It is always wrong
16. B) It is too slow
17. C) If x is empty, it yields c(1, 0) and iterates twice with bad indices (*)
18. D) It only works on vectors of length 1
19. Explanation: 1:0 is c(1, 0), so the loop iterates with i=1 (NA) and i=0 (last element); use seq_along(x) which returns integer(0) on empty input.
20. Q3: What does case_when() return for an unmatched row?
21. A) An error
22. B) The value of the first formula
23. C) FALSE
24. D) NA (*)
25. Explanation: Unmatched rows get NA; add a TRUE ~ default branch to handle catch-all cases explicitly.
26. Q4: How does dplyr::if_else() differ from base ifelse()?
27. A) if_else() is strict on types and preserves attributes (Date, factor) (*)
28. B) It is identical
29. C) if_else() is faster but untyped
30. D) ifelse() preserves attributes but if_else() does not
31. Explanation: if_else() requires same-type yes/no/missing, preserves attributes, and is strict; ifelse() silently strips attributes and coerces.
32. Q5: Which is the most idiomatic replacement for a nested ifelse() chain?
33. A) A for loop
34. B) dplyr::case_when() (*)
35. C) switch()
36. D) Reduce()
37. Explanation: case_when() handles multi-branch vectorized logic cleanly with formula syntax; nested ifelse() is unreadable and strips attributes.
38. Q6: What does the 'next' keyword do in a loop?
39. A) Restarts the loop from the top
40. B) Throws an error
41. C) Skips to the next iteration (*)
42. D) Exits the loop
43. Explanation: next skips the rest of the current iteration and moves to the next; break exits the loop entirely.
44. Q7: What does switch(2, 'a', 'b', 'c') return?
45. A) 'a'
46. B) 'c'
47. C) An error
48. D) 'b' (*)
49. Explanation: switch() with a numeric first argument returns the n-th element: 'b'.
50. Q8: Why should you prefer seq_along(x) over seq(length(x))?
51. A) seq_along(x) returns integer(0) for empty x; seq(length(x)) returns c(1L, 0L) (*)
52. B) They are identical
53. C) seq_along is faster for large x
54. D) seq_along only works on lists
55. Explanation: seq_along(x) handles empty input safely; seq(length(x)) on empty x gives c(1L, 0L) which iterates twice.
56. Q9: Which is the recommended default branch in case_when()?
57. A) NA ~ 'default'
58. B) TRUE ~ 'default' (*)
59. C) ELSE ~ 'default'
60. D) default ~ TRUE
61. Explanation: TRUE ~ value acts as the catch-all branch at the bottom; it matches any row not caught by earlier formulas.
62. Q10: When is a for loop the right choice in R?
63. A) Always — R is a loop-first language
64. B) Never — use only map()
65. C) When iteration depends on prior state or no vectorized API exists (*)
66. D) Only for printing
67. Explanation: Loops are appropriate when each iteration depends on the previous (cumulative state) or when no vectorized/functional API exists; otherwise prefer vectorization, lapply, or map.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does if (c(TRUE, FALSE)) message('hi') do?
  options:
    - ) message('hi') do?
    - Prints 'hi' twice
    - Warns and prints 'hi' using the first element only
    - Throws an error
    - Prints nothing
  correctIndex: 2
  explanation: if expects a length-1 logical; a longer vector triggers a warning and uses only the first element.
- id: q2
  question: Why is 1:length(x) unsafe in a for loop?
  options:
    - It is always wrong
    - It is too slow
    - If x is empty, it yields c(1, 0) and iterates twice with bad indices
    - It only works on vectors of length 1
    - and i=0 (last element); use seq_along(x) which returns integer(0) on empty input.
  correctIndex: 2
  explanation: 1:0 is c(1, 0), so the loop iterates with i=1 (NA) and i=0 (last element); use seq_along(x) which returns integer(0) on empty input.
- id: q3
  question: What does case_when() return for an unmatched row?
  options:
    - An error
    - The value of the first formula
    - "FALSE"
    - NA
  correctIndex: 3
  explanation: Unmatched rows get NA; add a TRUE ~ default branch to handle catch-all cases explicitly.
- id: q4
  question: How does dplyr::if_else() differ from base ifelse()?
  options:
    - if_else() is strict on types and preserves attributes (Date, factor)
    - It is identical
    - if_else() is faster but untyped
    - ifelse() preserves attributes but if_else() does not
  correctIndex: 0
  explanation: if_else() requires same-type yes/no/missing, preserves attributes, and is strict; ifelse() silently strips attributes and coerces.
- id: q5
  question: Which is the most idiomatic replacement for a nested ifelse() chain?
  options:
    - A for loop
    - dplyr::case_when()
    - switch()
    - Reduce()
  correctIndex: 1
  explanation: case_when() handles multi-branch vectorized logic cleanly with formula syntax; nested ifelse() is unreadable and strips attributes.
- id: q6
  question: What does the 'next' keyword do in a loop?
  options:
    - Restarts the loop from the top
    - Throws an error
    - Skips to the next iteration
    - Exits the loop
  correctIndex: 2
  explanation: next skips the rest of the current iteration and moves to the next; break exits the loop entirely.
- id: q7
  question: What does switch(2, 'a', 'b', 'c') return?
  options:
    - "'a'"
    - "'c'"
    - An error
    - "'b'"
  correctIndex: 3
  explanation: "switch() with a numeric first argument returns the n-th element: 'b'."
- id: q8
  question: Why should you prefer seq_along(x) over seq(length(x))?
  options:
    - seq_along(x) returns integer(0) for empty x; seq(length(x)) returns c(1L, 0L)
    - They are identical
    - seq_along is faster for large x
    - seq_along only works on lists
    - which iterates twice.
  correctIndex: 0
  explanation: seq_along(x) handles empty input safely; seq(length(x)) on empty x gives c(1L, 0L) which iterates twice.
- id: q9
  question: Which is the recommended default branch in case_when()?
  options:
    - NA ~ 'default'
    - TRUE ~ 'default'
    - ELSE ~ 'default'
    - default ~ TRUE
  correctIndex: 1
  explanation: TRUE ~ value acts as the catch-all branch at the bottom; it matches any row not caught by earlier formulas.
- id: q10
  question: When is a for loop the right choice in R?
  options:
    - Always — R is a loop-first language
    - Never — use only map()
    - When iteration depends on prior state or no vectorized API exists
    - Only for printing
  correctIndex: 2
  explanation: Loops are appropriate when each iteration depends on the previous (cumulative state) or when no vectorized/functional API exists; otherwise prefer vectorization, lapply, or map.
```

