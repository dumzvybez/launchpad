---
slug: r-data-frames-tibbles
id: r-04
track: r
order: 4
title: Data Frames and Tibbles
description: Master R's two rectangular data structures — the classic data.frame and the modern tibble — and the subsetting, summarization, and type quirks that distinguish them.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=1050s
whyItMatters: Master R's two rectangular data structures — the classic data. frame and the modern tibble — and the subsetting, summarization, and type quirks that distinguish them.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Data Frames and Tibbles

## Data Frames and Tibbles

### Why It Matters

Master R's two rectangular data structures — the classic data. frame and the modern tibble — and the subsetting, summarization, and type quirks that distinguish them.

Master R's two rectangular data structures — the classic data.frame and the modern tibble — and the subsetting, summarization, and type quirks that distinguish them.

### Prerequisites

- Stage 2: Variables, Vectors, and Atomic Types
- Stage 3: Matrices, Arrays, and Lists

### Topics

- data.frame() construction and stringsAsFactors history
- Tibbles: tibble::tibble(), tibble::tribble(), as_tibble()
- str(), summary(), glimpse(), dim(), nrow(), ncol()
- Subsetting: $, [[]], [], and the drop = FALSE pitfall
- rownames and column names: rownames(), colnames(), names()
- Coercion between data frames, matrices, and tibbles
- Reading a CSV quickly with read.csv() vs readr::read_csv()
- When to prefer tibbles: printing, subsetting, list-columns

### Key Concepts

- A data frame is a list of equal-length vectors; a tibble is a stricter subclass that never coerces strings to factors, never changes input names, and prints compactly.
- df[, 1] returns a vector (drop = TRUE default) — a major source of bugs; df[, 1, drop = FALSE] or tibbles preserve the column structure.
- Pre-R-4.0, data.frame() coerced strings to factors by default (stringsAsFactors = TRUE); since 4.0 it defaults to FALSE — but legacy code and CSVs may still surprise you.
- Tibbles lazy-print 10 rows and as many columns as fit, show column types at the header, and never partially match $-subsetting (which data frames do, silently).
- Use glimpse(df) for a transposed summary that fits in a terminal; use str(df) for raw structure including attributes.

```r
df <- data.frame(id = 1:3, name = c('Ada','Linus','Grace'), score = c(95, 88, 91))
tb <- tibble::tibble(id = 1:3, name = c('Ada','Linus','Grace'), score = c(95, 88, 91))
str(df)            # 'data.frame': 3 obs. of 3 variables
glimpse(tb)        # Rows: 3, Columns: 3, with types
class(df)          # 'data.frame'
class(tb)          # 'tbl_df' 'tbl' 'data.frame'
```
Caption: Data frame vs tibble

### Common Pitfalls

- Forgetting drop = FALSE on base data-frame subsetting — df[, col] returns a vector when only one column is selected, breaking code downstream that expects a frame; tibbles sidestep this by never dropping.
- Assuming stringsAsFactors = FALSE everywhere — R < 4.0 (and read.csv defaults before 4.0) coerced strings to factors; always set it explicitly when reading legacy data or scripts.
- Using $ with partial names on data frames — df$score partially matches df$scores and returns it silently; tibbles error loudly instead, which is safer.
- Comparing tibbles and data frames with == — use all.equal() or dplyr::all_equal() (now dplyr::setequal or dplyr::anti_join) instead, since == returns a logical matrix and ignores attributes.
- Mixing base R and tidyverse subsetting styles — df[, c('id','x')] vs dplyr::select(df, id, x); pick one style per project to avoid confusion and silent surprises.

### Real-World Applications

- Airbnb's R data pipelines produce tibbles almost exclusively — their internal style guide bans base data.frame() in new code, citing the stringsAsFactors and drop = TRUE footguns.
- The BBC's R graphics cookbook (bbplot) is built entirely on tibbles feeding ggplot2; their data journalists reach for tribble() when hand-entering small lookup tables.
- Bioconductor's tidySummarizedExperiment and tidySingleCellExperiment bridges S4 bio objects and tibbles so analysts can use dplyr on genomic data.
- Netflix's experimentation platform returns tibbles from internal APIs because the compact, type-annotated print makes ad-hoc console exploration much faster than base data frames.

### Interview Questions

- 1. What is a tibble and how does it differ from a data.frame? — A tibble is a stricter subclass that never coerces strings to factors, never partially matches $, never drops dimensions on [, and prints compactly with column types.
- 2. What does df[, 1] return for a base data frame, and how do you keep it as a frame? — It returns a vector (drop = TRUE default); pass drop = FALSE or use a tibble to preserve the column structure.
- 3. What changed about stringsAsFactors in R 4.0? — The default flipped from TRUE to FALSE for data.frame() and read.csv(); legacy code may still depend on the old behavior, so set it explicitly.
- 4. Why does df$sc silently return df$scores in a base data frame? — $ uses partial matching when no exact match exists; tibbles disable this and error, which is safer.
- 5. When would you use tribble() over tibble()? — tribble() is a row-wise, human-readable constructor useful for small lookup tables and test fixtures (e.g. test data with 3-5 rows).

### Mini Project

Build a Data Frame Comparison Tool: A function compare_frames(a, b) that takes two data frames or tibbles and returns a tibble listing differences: column type mismatches, columns only in one frame, row count differences, and a per-column summary of changed cells (first 5). The function should coerce both inputs to tibbles internally and print a friendly summary.
Suggested approach:
  - Coerce both inputs with tibble::as_tibble() so behavior is uniform
  - Use setdiff(names(a), names(b)) to find missing columns
  - Compare column types with purrr::map2_chr() and typeof()
  - Use vctrs::vec_size() and purrr::map_lgl() for row counts and per-column checks
  - Return a tibble with columns: kind, column, detail, sample

### Exercises

1. Create a data frame with id, name, score columns; convert it to a tibble with as_tibble(); compare str() output of each.
2. Demonstrate the drop pitfall: subset a 1-column base data frame and a 1-column tibble, then use drop = FALSE to keep both rectangular.
3. Build a tibble with a list-column (e.g. scores = list(c(90,85), c(70,75))) and print it — observe the compact <dbl> display.
4. Use tribble() to define a 4-row lookup table of US state abbreviations, then join it (with merge() or dplyr::left_join()) to another small data frame.
5. Read a small CSV with both read.csv() and readr::read_csv(); compare class(), column types, and print formatting.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is TRUE of tibbles vs base data frames?
9. A) Tibbles coerce strings to factors by default
10. B) Tibbles allow partial $ matching
11. C) Tibbles are slower to print large data
12. D) Tibbles never drop dimensions on [ subsetting (*)
13. Explanation: Tibbles never drop dimensions on [, never coerce strings to factors, never partially match $, and print compactly with column types.
14. Q2: What does df[, 1] return for a base data frame with one column selected?
15. A) A vector (drop = TRUE default) (*)
16. B) A 1-column data frame
17. C) A tibble
18. D) An error
19. Explanation: Base data frames drop the dimension when subsetting to a single column; pass drop = FALSE or use a tibble to preserve shape.
20. Q3: What changed about stringsAsFactors in R 4.0?
21. A) It was removed entirely
22. B) Its default flipped from TRUE to FALSE (*)
23. C) It became TRUE for read.csv only
24. D) Nothing changed
25. Explanation: Before 4.0, data.frame() and read.csv() coerced strings to factors by default; from 4.0 the default is FALSE, but legacy code may still depend on the old behavior.
26. Q4: What does df$sc return in a base data frame if 'scores' is a column?
27. A) An error (no exact match)
28. B) NULL
29. C) The 'scores' column via partial matching (*)
30. D) All columns starting with 'sc'
31. Explanation: $ uses partial matching when no exact match exists; tibbles disable this and error, which is safer.
32. Q5: Which function gives a transposed, terminal-friendly summary of a tibble?
33. A) str()
34. B) summary()
35. C) head()
36. D) glimpse() (*)
37. Explanation: glimpse() prints one line per column showing type and first few values; str() is more verbose and includes attributes.
38. Q6: What does tribble() do?
39. A) Constructs a tibble row-wise in a human-readable layout (*)
40. B) Triangulates three data frames
41. C) Computes triangular numbers
42. D) Tests three tibbles for equality
43. Explanation: tribble() is a row-wise tibble constructor ideal for small lookup tables and test fixtures: ~col1, ~col2 followed by data rows.
44. Q7: What is the class of a tibble?
45. A) 'data.frame' only
46. B) 'tbl_df' 'tbl' 'data.frame' (*)
47. C) 'tibble' only
48. D) 'tbl' only
49. Explanation: A tibble's class vector is c('tbl_df','tbl','data.frame'); it inherits from data.frame so most base code still works.
50. Q8: What does as.data.frame(tb) do to a tibble?
51. A) Throws an error
52. B) Strips all columns
53. C) Coerces it to a base data.frame (re-enabling drop and partial match) (*)
54. D) Converts it to a matrix
55. Explanation: as.data.frame() reverts the tibble to a plain data.frame; subsetting then uses base rules (drop = TRUE, partial $ match).
56. Q9: Which is the safer way to extract a single column as a vector from a tibble?
57. A) df[, 1]
58. B) df[1]
59. C) df$colname with partial match
60. D) df[[1]] or df[['colname']] (*)
61. Explanation: [[]] extracts the column as a vector without partial matching; $ on tibbles also refuses partial matches but [[]] is the explicit choice.
62. Q10: Which base function reads a CSV but warns about stringsAsFactors in old R versions?
63. A) read.csv() (*)
64. B) readr::read_csv()
65. C) data.table::fread()
66. D) vroom::vroom()
67. Explanation: read.csv() is the base reader; before R 4.0 it coerced strings to factors by default. read_csv/fread/vroom never did.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is TRUE of tibbles vs base data frames?
  options:
    - Tibbles coerce strings to factors by default
    - Tibbles allow partial $ matching
    - Tibbles are slower to print large data
    - Tibbles never drop dimensions on [ subsetting
  correctIndex: 3
  explanation: Tibbles never drop dimensions on [, never coerce strings to factors, never partially match $, and print compactly with column types.
- id: q2
  question: What does df[, 1] return for a base data frame with one column selected?
  options:
    - A vector (drop = TRUE default)
    - A 1-column data frame
    - A tibble
    - An error
  correctIndex: 0
  explanation: Base data frames drop the dimension when subsetting to a single column; pass drop = FALSE or use a tibble to preserve shape.
- id: q3
  question: What changed about stringsAsFactors in R 4.0?
  options:
    - It was removed entirely
    - Its default flipped from TRUE to FALSE
    - It became TRUE for read.csv only
    - Nothing changed
  correctIndex: 1
  explanation: Before 4.0, data.frame() and read.csv() coerced strings to factors by default; from 4.0 the default is FALSE, but legacy code may still depend on the old behavior.
- id: q4
  question: What does df$sc return in a base data frame if 'scores' is a column?
  options:
    - An error (no exact match)
    - "NULL"
    - The 'scores' column via partial matching
    - All columns starting with 'sc'
  correctIndex: 2
  explanation: $ uses partial matching when no exact match exists; tibbles disable this and error, which is safer.
- id: q5
  question: Which function gives a transposed, terminal-friendly summary of a tibble?
  options:
    - str()
    - summary()
    - head()
    - glimpse()
  correctIndex: 3
  explanation: glimpse() prints one line per column showing type and first few values; str() is more verbose and includes attributes.
- id: q6
  question: What does tribble() do?
  options:
    - Constructs a tibble row-wise in a human-readable layout
    - Triangulates three data frames
    - Computes triangular numbers
    - Tests three tibbles for equality
  correctIndex: 0
  explanation: "tribble() is a row-wise tibble constructor ideal for small lookup tables and test fixtures: ~col1, ~col2 followed by data rows."
- id: q7
  question: What is the class of a tibble?
  options:
    - "'data.frame' only"
    - "'tbl_df' 'tbl' 'data.frame'"
    - "'tibble' only"
    - "'tbl' only"
  correctIndex: 1
  explanation: A tibble's class vector is c('tbl_df','tbl','data.frame'); it inherits from data.frame so most base code still works.
- id: q8
  question: What does as.data.frame(tb) do to a tibble?
  options:
    - Throws an error
    - Strips all columns
    - Coerces it to a base data.frame (re-enabling drop and partial match)
    - Converts it to a matrix
  correctIndex: 2
  explanation: as.data.frame() reverts the tibble to a plain data.frame; subsetting then uses base rules (drop = TRUE, partial $ match).
- id: q9
  question: Which is the safer way to extract a single column as a vector from a tibble?
  options:
    - df[, 1]
    - df[1]
    - df$colname with partial match
    - df[[1]] or df[['colname']]
  correctIndex: 3
  explanation: "[[]] extracts the column as a vector without partial matching; $ on tibbles also refuses partial matches but [[]] is the explicit choice."
- id: q10
  question: Which base function reads a CSV but warns about stringsAsFactors in old R versions?
  options:
    - read.csv()
    - readr::read_csv()
    - data.table::fread()
    - vroom::vroom()
  correctIndex: 0
  explanation: read.csv() is the base reader; before R 4.0 it coerced strings to factors by default. read_csv/fread/vroom never did.
```

