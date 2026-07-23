---
slug: r-variables-vectors-atomic-types
id: r-02
track: r
order: 2
title: Variables, Vectors, and Atomic Types
description: Master R's atomic vector types, the assignment operator family, coercion rules, and missing-value vocabulary — the foundation everything else (data frames, modeling, purrr) is built on.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=350s
whyItMatters: Master R's atomic vector types, the assignment operator family, coercion rules, and missing-value vocabulary — the foundation everything else (data frames, modeling, purrr) is built on.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Variables, Vectors, and Atomic Types

## Variables, Vectors, and Atomic Types

### Why It Matters

Master R's atomic vector types, the assignment operator family, coercion rules, and missing-value vocabulary — the foundation everything else (data frames, modeling, purrr) is built on.

Master R's atomic vector types, the assignment operator family, coercion rules, and missing-value vocabulary — the foundation everything else (data frames, modeling, purrr) is built on.

### Prerequisites

- Stage 1: Getting Started with R and RStudio
- Comfort with the R console and basic function calls.

### Topics

- Assignment: <- vs = vs -> vs <<- (super-assignment)
- Atomic vector types: double, integer, character, logical, complex, raw
- Creating vectors with c(), seq(), rep(), vector()
- typeof(), class(), mode(), storage.mode() distinctions
- Length, names(), and indexing with [], [[]], $
- Coercion rules: logical < integer < double < character
- Missing values: NA, NA_integer_, NA_real_, NA_character_, NaN, NULL, Inf
- Vectorized arithmetic and recycling rules

### Key Concepts

- <- is the idiomatic assignment; = works for assignment but is also used for named arguments, so <- avoids ambiguity; <<- assigns in the nearest enclosing environment (super-assignment) and is almost always a smell.
- All elements of an atomic vector share one type; combining types triggers automatic coercion to the most permissive (character beats double beats integer beats logical).
- NA is a logical missing by default — use NA_real_, NA_integer_, NA_character_ to type it; NaN is a numeric not-a-number (0/0); NULL is the absence of a value (length 0).
- R recycles shorter vectors in arithmetic: c(1,2,3,4) + c(10,20) yields c(11,22,13,24) — sometimes a silent bug.
- T and F are variables that can be reassigned; always write TRUE and FALSE in real code.

```r
x <- 10          # idiomatic assignment
y = 20           # legal but ambiguous with named args
10 -> z          # right-assign, rare
x <<- 999        # super-assignment to parent env (avoid!)
print(x)         # 10 in this scope
```
Caption: Assignment flavors

### Common Pitfalls

- Using T and F instead of TRUE and FALSE — T and F are just variables that someone can reassign (T <- FALSE); always write the full words in scripts and packages.
- Comparing with NA using == — NA == 1 returns NA, not FALSE; use is.na() to detect missing values, and coalesce with tidyr::replace_na() or data.table::fcoalesce().
- Forgetting that c() coerces to one type — c(1, 'two', 3) silently becomes a character vector; if you need mixed types you want a list(), not c().
- Confusing <- with = inside function calls — f(x = 5) binds the named argument and returns the result, while f(x <- 5) assigns x in the calling env AND passes 5 — a subtle and dangerous difference.
- Using sapply() expecting a vector and getting a list — sapply() simplifies opportunistically; use vapply() with a template to guarantee the return type.

### Real-World Applications

- Airbnb's R codebase leans heavily on typed vectors and dplyr; their internal R style guide bans = for assignment and mandates TRUE/FALSE over T/F.
- Bioconductor packages (e.g. GenomicRanges, SummarizedExperiment) use integer vectors with NA_integer_ markers to represent genomic coordinates at the chromosome scale.
- Netflix's experimentation team uses logical vectors with NA flags for 'user did not see the experiment' rows — distinct from NaN for 'metric undefined'.
- The tidyverse itself enforces strict typing: readr parses columns to specific types and warns loudly on implicit coercion, which has prevented silent data-corruption bugs at the BBC data team.

### Interview Questions

- 1. What is the difference between <- and = in R? — Both assign, but <- is unambiguous and works anywhere; = is also used for named-argument binding and is forbidden inside conditionals like if (x = 5).
- 2. What does <<- do and when should you avoid it? — <<- assigns in the nearest enclosing environment (super-assignment); it is rarely needed outside closures and is a common source of hard-to-trace bugs in non-trivial code.
- 3. What is the difference between NA, NaN, NULL, and Inf? — NA is a missing value (typed: NA_real_, NA_integer_, etc.); NaN is a numeric not-a-number (0/0); NULL is the absence of a value (length 0); Inf is numeric infinity (1/0).
- 4. Explain R's vector recycling rules. — In binary ops, the shorter vector is recycled to match the longer; if the longer length is not a multiple of the shorter, R warns and recycles anyway.
- 5. Why is sapply() considered unsafe in packages? — sapply() opportunistically simplifies its output, sometimes returning a list when the input is empty; vapply() with a template guarantees the return type and should be preferred.

### Mini Project

Build a Vector Type Inspector: A function inspect_vec(x) that takes any R object, prints its typeof, class, length, and a 3-line summary, then returns a named list with type, length, has_na (logical), and sample (first 5 elements). The function should handle atomic vectors, lists, NULL, and factors gracefully — never throwing on edge cases.
Suggested approach:
  - Dispatch on is.null(), is.list(), is.factor(), and is.atomic() to pick a branch
  - Use typeof() and class() to capture type info
  - Detect NAs with anyNA() and NaNs with any(is.nan(x))
  - Return head(x, 5) safely wrapped in as.list() so callers always get the same shape
  - Add a print method that formats the summary nicely

### Exercises

1. Create vectors of each atomic type and verify with typeof(); coerce a numeric vector to character and back with as.character() and as.numeric().
2. Demonstrate recycling: add c(1,2,3,4,5,6) + c(10,100) and explain the result; trigger the 'not a multiple' warning with non-divisible lengths.
3. Build a vector with NA, NaN, Inf, and -Inf; use is.na(), is.nan(), is.finite(), is.infinite() to test each position.
4. Write a function safe_mean(x) that returns NA if the vector has length 0 or all-NA, otherwise mean(x, na.rm = TRUE).
5. Prove that T can be reassigned (T <- FALSE) and explain why you should always write TRUE in production code.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the idiomatic assignment operator in R?
9. A) =
10. B) <- (*)
11. C) ->>
12. D) :
13. Explanation: <- is the unambiguous idiomatic assignment; = also assigns but is shared with named-argument binding, which makes it ambiguous in some contexts.
14. Q2: What does <<- do?
15. A) Assigns in the global environment only
16. B) Creates a constant
17. C) Assigns in the nearest enclosing environment (super-assignment) (*)
18. D) Throws an error
19. Explanation: <<- walks up the environment chain and assigns in the nearest enclosing scope that already has the variable; rarely needed outside closures.
20. Q3: What is the type of c(1, 'two', 3)?
21. A) numeric
22. B) integer
23. C) list
24. D) character (*)
25. Explanation: Atomic vectors have one type; mixing numeric and character coerces everything to character (the most permissive type).
26. Q4: What does NA == 1 return?
27. A) NA (*)
28. B) TRUE
29. C) FALSE
30. D) An error
31. Explanation: Any comparison with NA yields NA, not FALSE; use is.na() to detect missingness.
32. Q5: How is NaN different from NA?
33. A) They are identical
34. B) NaN is a numeric not-a-number (0/0); NA is a missing-value marker (*)
35. C) NaN is for strings; NA is for numbers
36. D) NaN is integer; NA is double
37. Explanation: NaN is a specific IEEE-754 numeric value (0/0); NA is R's missing-value sentinel and exists for every atomic type.
38. Q6: What does c(1, 2, 3, 4) + c(10, 20) return?
39. A) 11 22 (stops at shorter)
40. B) 11 12 13 14
41. C) 11 22 13 24 (*)
42. D) An error
43. Explanation: R recycles the shorter vector: 1+10, 2+20, 3+10, 4+20 = 11 22 13 24.
44. Q7: Which is TRUE about T and F?
45. A) They are reserved words like TRUE
46. B) They are faster than TRUE/FALSE
47. C) They only work in functions
48. D) They are variables that can be reassigned (*)
49. Explanation: T and F are set to TRUE/FALSE by default but can be reassigned (T <- FALSE); always use TRUE and FALSE in production code.
50. Q8: What does NULL == NULL return?
51. A) logical(0) (empty vector) (*)
52. B) TRUE
53. C) FALSE
54. D) An error
55. Explanation: NULL has length 0, so any comparison returns logical(0); use is.null() to test for NULL.
56. Q9: What is the result of typeof(NA)?
57. A) 'missing'
58. B) 'logical' (*)
59. C) 'NA'
60. D) 'any'
61. Explanation: NA is a logical missing by default; typed variants NA_real_, NA_integer_, NA_character_ exist for explicit typing.
62. Q10: Which function should you prefer over sapply() in a package?
63. A) lapply() only
64. B) map() from purrr is required
65. C) vapply() with a template (*)
66. D) do.call()
67. Explanation: vapply(FUN.VALUE = ...) guarantees the return shape and type, eliminating the silent-simplification surprise that sapply() can produce.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the idiomatic assignment operator in R?
  options:
    - =
    - <-
    - ->>
    - ":"
  correctIndex: 1
  explanation: <- is the unambiguous idiomatic assignment; = also assigns but is shared with named-argument binding, which makes it ambiguous in some contexts.
- id: q2
  question: What does <<- do?
  options:
    - Assigns in the global environment only
    - Creates a constant
    - Assigns in the nearest enclosing environment (super-assignment)
    - Throws an error
  correctIndex: 2
  explanation: <<- walks up the environment chain and assigns in the nearest enclosing scope that already has the variable; rarely needed outside closures.
- id: q3
  question: What is the type of c(1, 'two', 3)?
  options:
    - numeric
    - integer
    - list
    - character
  correctIndex: 3
  explanation: Atomic vectors have one type; mixing numeric and character coerces everything to character (the most permissive type).
- id: q4
  question: What does NA == 1 return?
  options:
    - NA
    - "TRUE"
    - "FALSE"
    - An error
  correctIndex: 0
  explanation: Any comparison with NA yields NA, not FALSE; use is.na() to detect missingness.
- id: q5
  question: How is NaN different from NA?
  options:
    - They are identical
    - NaN is a numeric not-a-number (0/0); NA is a missing-value marker
    - NaN is for strings; NA is for numbers
    - NaN is integer; NA is double
  correctIndex: 1
  explanation: NaN is a specific IEEE-754 numeric value (0/0); NA is R's missing-value sentinel and exists for every atomic type.
- id: q6
  question: What does c(1, 2, 3, 4) + c(10, 20) return?
  options:
    - 11 22 (stops at shorter)
    - 11 12 13 14
    - 11 22 13 24
    - An error
  correctIndex: 2
  explanation: "R recycles the shorter vector: 1+10, 2+20, 3+10, 4+20 = 11 22 13 24."
- id: q7
  question: Which is TRUE about T and F?
  options:
    - They are reserved words like TRUE
    - They are faster than TRUE/FALSE
    - They only work in functions
    - They are variables that can be reassigned
    - ; always use TRUE and FALSE in production code.
  correctIndex: 3
  explanation: T and F are set to TRUE/FALSE by default but can be reassigned (T <- FALSE); always use TRUE and FALSE in production code.
- id: q8
  question: What does NULL == NULL return?
  options:
    - logical(0) (empty vector)
    - "TRUE"
    - "FALSE"
    - An error
  correctIndex: 0
  explanation: NULL has length 0, so any comparison returns logical(0); use is.null() to test for NULL.
- id: q9
  question: What is the result of typeof(NA)?
  options:
    - "?"
    - "'missing'"
    - "'logical'"
    - "'NA'"
    - "'any'"
  correctIndex: 2
  explanation: NA is a logical missing by default; typed variants NA_real_, NA_integer_, NA_character_ exist for explicit typing.
- id: q10
  question: Which function should you prefer over sapply() in a package?
  options:
    - lapply() only
    - map() from purrr is required
    - vapply() with a template
    - do.call()
  correctIndex: 2
  explanation: vapply(FUN.VALUE = ...) guarantees the return shape and type, eliminating the silent-simplification surprise that sapply() can produce.
```

