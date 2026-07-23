---
slug: r-matrices-arrays-lists
id: r-03
track: r
order: 3
title: Matrices, Arrays, and Lists
description: Work with R's rectangular (matrix, array) and heterogeneous (list) containers, the workhorses behind linear algebra, dimension reduction, and JSON-like nested data.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=700s
whyItMatters: Work with R's rectangular (matrix, array) and heterogeneous (list) containers, the workhorses behind linear algebra, dimension reduction, and JSON-like nested data.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Matrices, Arrays, and Lists

## Matrices, Arrays, and Lists

### Why It Matters

Work with R's rectangular (matrix, array) and heterogeneous (list) containers, the workhorses behind linear algebra, dimension reduction, and JSON-like nested data.

Work with R's rectangular (matrix, array) and heterogeneous (list) containers, the workhorses behind linear algebra, dimension reduction, and JSON-like nested data.

### Prerequisites

- Stage 1: Getting Started with R and RStudio
- Stage 2: Variables, Vectors, and Atomic Types

### Topics

- matrix(): nrow, ncol, byrow, dimnames
- Array() with dim() for n-dimensional arrays
- Matrix algebra: %*%, t(), solve(), det(), eigen(), diag()
- Row/column operations: rowSums, colSums, rowMeans, colMeans
- apply() over margins (1 = rows, 2 = columns)
- list() as R's heterogeneous container (the JSON of R)
- Subsetting lists: [], [[]], $ — and why they differ
- Rectangular lists vs data frames vs tibbles (preview)

### Key Concepts

- A matrix is an atomic vector with a dim attribute of length 2; an array generalizes to n dimensions; both share one atomic type.
- %*% is matrix multiplication; * is element-wise — confusing them is the most common linear-algebra bug in R.
- A list holds heterogeneous elements; myList[1] returns a length-1 list, myList[[1]] returns the element itself, myList$name is shorthand for [['name']].
- apply(X, MARGIN, FUN) iterates a function over rows (MARGIN=1) or columns (MARGIN=2); on data frames it silently coerces to matrix.
- Lists are the building blocks of data frames (a data frame is a list of equal-length columns) and of JSON-like API responses.

```r
A <- matrix(1:12, nrow = 3, ncol = 4, byrow = TRUE)
B <- matrix(1:6, nrow = 3, ncol = 2)
A %*% B          # 3x2 result (matrix multiply)
t(A)             # transpose
A * A            # element-wise square (NOT matrix square!)
solve(B)         # error: B is not square
M <- matrix(c(4,2,1,3), 2, 2); solve(M)   # inverse
det(M)           # 10
eigen(M)         # eigenvalues and eigenvectors
```
Caption: Matrix creation and algebra

### Common Pitfalls

- Using * instead of %*% for matrix multiplication — * is element-wise; %*% is matrix multiplication; mixing them up silently produces wrong eigenvalues, regressions, and PCA results.
- Confusing [] and [[]] on lists — lst[1] returns a length-1 list wrapping the element; lst[[1]] returns the element itself; this single character is the most common list-bug in R.
- Forgetting that apply() on a data frame coerces it to a matrix — if any column is character, the entire frame becomes character and numeric ops silently break; use dplyr::across() or lapply() instead.
- Calling solve() on a non-square or singular matrix — solve() inverts and will error on rectangular inputs and warn-or-error on singular ones; check qr()$rank or use MASS::ginv() for the pseudoinverse.
- Assuming drop = FALSE behavior — subsetting a matrix to one row or column silently drops the dimension (matrix[1, ] returns a vector); pass drop = FALSE to keep the matrix shape.

### Real-World Applications

- Netflix's recommendation engine prototypes matrix factorization in R using %*%, svd(), and eigen() before porting performance-critical code to Spark or CUDA.
- Bioconductor's SummarizedExperiment wraps matrices of gene expression (genes x samples) with row/column metadata in a list-like container — the basis of thousands of peer-reviewed analyses.
- Facebook's Core Data Science team has published R packages (e.g. bminr, prophet's R bindings) that lean on matrix operations for Bayesian inference and forecasting.
- The New York Times election model (Leo) is an R codebase that uses matrix algebra to compute posterior distributions over thousands of simulated outcomes per election night.

### Interview Questions

- 1. What is the difference between * and %*% in R? — * is element-wise multiplication; %*% is matrix multiplication; using the wrong one silently produces wrong linear-algebra results.
- 2. Explain the difference between lst[1], lst[[1]], and lst$name. — lst[1] returns a length-1 list slice; lst[[1]] returns the element itself; lst$name is shorthand for lst[['name']].
- 3. Why does apply(df, 2, mean) sometimes return all NA? — apply() coerces a data frame to a matrix first; if any column is character, all columns become character and mean() returns NA.
- 4. How would you compute the inverse of a matrix in R, and what happens if it is singular? — Use solve(M); on a singular matrix it raises 'system is computationally singular'; use MASS::ginv() for a pseudoinverse.
- 5. When would you reach for a list instead of a data frame? — Lists handle heterogeneous, jagged, or nested data (e.g. API responses with variable fields per record) that a rectangular data frame cannot represent.

### Mini Project

Build a JSON-style record flattener: A function flatten_records(records) that takes a list of records (each a list with id, name, scores), and returns a tibble with columns id (integer), name (character), mean_score (double), and n_scores (integer). It must handle missing fields, NA scores, and records with zero scores without throwing.
Suggested approach:
  - Use purrr::map_int(), map_chr(), map_dbl() for typed extraction
  - Compute mean_score with mean(scores, na.rm = TRUE), guarded by length check
  - Replace NaN with NA_real_ using dplyr::if_else() or tidyr::replace_na()
  - Assemble a tibble with tibble::tibble() so column types are stable
  - Test with an empty list, a single record, and a record missing 'scores'

### Exercises

1. Create a 4x4 matrix, compute its determinant, eigenvalues, and inverse; verify A %*% solve(A) is the identity (within floating-point tolerance).
2. Build a list of 3 user records (id, name, scores) and use purrr::map_dbl() to compute each user's mean score, returning a named numeric vector.
3. Demonstrate the drop = FALSE pitfall: subset a matrix to one column and show it becomes a vector; then add drop = FALSE to keep it a matrix.
4. Compare apply(M, 2, mean) vs colMeans(M) on a 1000x1000 matrix and benchmark with system.time() — explain why colMeans is faster.
5. Write a function matrix_stats(M) that returns a list with rowMeans, colMeans, and overall mean, handling NA values with na.rm = TRUE.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which operator performs matrix multiplication in R?
9. A) *
10. B) %x%
11. C) %*% (*)
12. D) matmul()
13. Explanation: %*% is matrix multiplication; * is element-wise; %x% is the Kronecker product.
14. Q2: What does lst[[1]] return that lst[1] does not?
15. A) A longer list
16. B) The first key name
17. C) An error
18. D) The element itself (not a list wrapper) (*)
19. Explanation: [[]] returns the element itself; [] returns a list slice wrapping the element; this is the most common list-bug in R.
20. Q3: What does apply() do internally when given a data frame?
21. A) Coerces it to a matrix first (*)
22. B) Iterates columns without coercion
23. C) Throws an error
24. D) Converts it to a tibble
25. Explanation: apply() coerces a data frame to a matrix; if any column is character, the entire frame becomes character and numeric ops silently break.
26. Q4: Which MARGIN means 'over rows' in apply()?
27. A) 0
28. B) 1 (*)
29. C) 2
30. D) 'rows'
31. Explanation: MARGIN=1 iterates over rows; MARGIN=2 iterates over columns; c(1,2) iterates over both margins cell-by-cell.
32. Q5: What does matrix(1:12, 3, 4)[1,] return?
33. A) A 1x4 matrix
34. B) A list
35. C) A length-4 vector (drop=TRUE by default) (*)
36. D) An error
37. Explanation: Single-row or single-column subsetting drops the dimension by default; pass drop = FALSE to keep the matrix shape.
38. Q6: What does solve(M) compute for a square matrix M?
39. A) Its transpose
40. B) Its determinant
41. C) Its eigenvalues
42. D) Its inverse (*)
43. Explanation: solve(M) returns M's inverse; solve(A, b) solves the linear system Ax = b.
44. Q7: Which is faster on a 1000x1000 matrix?
45. A) colMeans(M) (*)
46. B) apply(M, 2, mean)
47. C) sapply(as.data.frame(M), mean)
48. D) A for loop
49. Explanation: colMeans() is a vectorized C-level primitive; apply() has per-iteration overhead; the difference is 10-100x on large matrices.
50. Q8: What is a data frame, structurally?
51. A) A matrix with column names
52. B) A list of equal-length vectors with class 'data.frame' (*)
53. C) A special kind of tibble
54. D) An array of records
55. Explanation: A data frame is a list of equal-length vectors (columns) with a 'data.frame' class and row.names; tibbles are a stricter subclass.
56. Q9: Which would you use to hold a mix of an integer, a string, and a vector of doubles?
57. A) c()
58. B) matrix()
59. C) list() (*)
60. D) array()
61. Explanation: Only a list can hold heterogeneous elements; c(), matrix(), and array() are all atomic and coerce to one type.
62. Q10: What does t(M) do?
63. A) Truncates M
64. B) Takes the trace
65. C) Computes the type
66. D) Transposes M (swap rows and columns) (*)
67. Explanation: t(M) returns the transpose of M, swapping rows and columns; for arrays, aperm() generalizes to higher dimensions.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which operator performs matrix multiplication in R?
  options:
    - "*"
    - "%x%"
    - "%*%"
    - matmul()
  correctIndex: 2
  explanation: "%*% is matrix multiplication; * is element-wise; %x% is the Kronecker product."
- id: q2
  question: What does lst[[1]] return that lst[1] does not?
  options:
    - A longer list
    - The first key name
    - An error
    - The element itself (not a list wrapper)
  correctIndex: 3
  explanation: "[[]] returns the element itself; [] returns a list slice wrapping the element; this is the most common list-bug in R."
- id: q3
  question: What does apply() do internally when given a data frame?
  options:
    - Coerces it to a matrix first
    - Iterates columns without coercion
    - Throws an error
    - Converts it to a tibble
  correctIndex: 0
  explanation: apply() coerces a data frame to a matrix; if any column is character, the entire frame becomes character and numeric ops silently break.
- id: q4
  question: Which MARGIN means 'over rows' in apply()?
  options:
    - "0"
    - "1"
    - "2"
    - "'rows'"
  correctIndex: 1
  explanation: MARGIN=1 iterates over rows; MARGIN=2 iterates over columns; c(1,2) iterates over both margins cell-by-cell.
- id: q5
  question: What does matrix(1:12, 3, 4)[1,] return?
  options:
    - A 1x4 matrix
    - A list
    - A length-4 vector (drop=TRUE by default)
    - An error
  correctIndex: 2
  explanation: Single-row or single-column subsetting drops the dimension by default; pass drop = FALSE to keep the matrix shape.
- id: q6
  question: What does solve(M) compute for a square matrix M?
  options:
    - compute for a square matrix M?
    - Its transpose
    - Its determinant
    - Its eigenvalues
    - Its inverse
    - returns M's inverse; solve(A, b) solves the linear system Ax = b.
  correctIndex: 4
  explanation: solve(M) returns M's inverse; solve(A, b) solves the linear system Ax = b.
- id: q7
  question: Which is faster on a 1000x1000 matrix?
  options:
    - colMeans(M)
    - apply(M, 2, mean)
    - sapply(as.data.frame(M), mean)
    - A for loop
  correctIndex: 0
  explanation: colMeans() is a vectorized C-level primitive; apply() has per-iteration overhead; the difference is 10-100x on large matrices.
- id: q8
  question: What is a data frame, structurally?
  options:
    - A matrix with column names
    - A list of equal-length vectors with class 'data.frame'
    - A special kind of tibble
    - An array of records
  correctIndex: 1
  explanation: A data frame is a list of equal-length vectors (columns) with a 'data.frame' class and row.names; tibbles are a stricter subclass.
- id: q9
  question: Which would you use to hold a mix of an integer, a string, and a vector of doubles?
  options:
    - c()
    - matrix()
    - list()
    - array()
  correctIndex: 2
  explanation: Only a list can hold heterogeneous elements; c(), matrix(), and array() are all atomic and coerce to one type.
- id: q10
  question: What does t(M) do?
  options:
    - do?
    - Truncates M
    - Takes the trace
    - Computes the type
    - Transposes M (swap rows and columns)
    - returns the transpose of M, swapping rows and columns; for arrays, aperm() generalizes to higher dimensions.
  correctIndex: 4
  explanation: t(M) returns the transpose of M, swapping rows and columns; for arrays, aperm() generalizes to higher dimensions.
```

