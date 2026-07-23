---
slug: r-tidyr-pivot-unite-separate-nest
id: r-10
track: r
order: 10
title: Tidyr — Pivot, Unite, Separate, Nest
description: Reshape data between long and wide formats, split and combine columns, and nest groups into list-columns — the tidyverse answer to 'messy data'.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=3150s
whyItMatters: Reshape data between long and wide formats, split and combine columns, and nest groups into list-columns — the tidyverse answer to 'messy data'.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Tidyr — Pivot, Unite, Separate, Nest

## Tidyr — Pivot, Unite, Separate, Nest

### Why It Matters

Reshape data between long and wide formats, split and combine columns, and nest groups into list-columns — the tidyverse answer to 'messy data'.

Reshape data between long and wide formats, split and combine columns, and nest groups into list-columns — the tidyverse answer to 'messy data'.

### Prerequisites

- Stage 4: Data Frames and Tibbles
- Stage 9: Data Wrangling with dplyr

### Topics

- Tidy data principles: each variable a column, each observation a row
- pivot_longer() and pivot_wider() (replacing gather/spread)
- separate() and unite() for splitting/merging character columns
- extract() with regex capture groups
- nest() and unnest() for list-columns
- complete() to fill missing combinations
- fill() to carry values down/up
- drop_na(), replace_na(), replace_with_na(), na_if()

### Key Concepts

- Tidy data: one column per variable, one row per observation, one table per observational unit — most ggplot2 and dplyr pipelines assume tidy data.
- pivot_longer(cols, names_to, values_to) melts wide data to long; pivot_wider(names_from, values_from) is the inverse — use them instead of the deprecated gather/spread.
- nest(-group_cols) creates a list-column of tibbles, one per group; unnest(col) expands a list-column back into rows — the foundation of purrr + list-columns workflows.
- complete(cols, fill = list(value = 0)) adds missing combinations of grouping columns, optionally filling NAs — essential for time series and contingency tables.
- fill(col, .direction = 'downup') carries last observation forward/backward — the tidyverse replacement for zoo::na.locf() in most cases.

```r
library(tidyr)
library(dplyr)
# Wide -> long:
wide <- tibble(year = 2020:2022, q1 = c(10,12,14), q2 = c(15,17,19))
long <- wide %>%
  pivot_longer(c(q1, q2), names_to = "quarter", values_to = "sales")
# Long -> wide:
wide2 <- long %>%
  pivot_wider(names_from = quarter, values_from = sales)
```
Caption: pivot_longer and pivot_wider

### Common Pitfalls

- Using the deprecated gather() and spread() — they are frozen and have known footguns (e.g. spread() dropping attributes); always use pivot_longer() and pivot_wider() in new code.
- Forgetting to handle duplicate (key, value) combos in pivot_wider() — pivot_wider() errors or fills with list-cols when duplicates exist; pre-aggregate with group_by() + summarise() first.
- Naming pivot_wider() output with values that are not valid R names — e.g. column '2024-Q1' needs names_prefix = 'q_' or backticks downstream; use names_prefix to make safe column names.
- unnest() on a list-column with unequal lengths silently recycles or errors — use unnest(col, keep_empty = TRUE) to keep rows with empty list elements, and check lengths first.
- Calling fill() without checking order — fill() works in row order; if your data is not sorted by time, the carry-forward is wrong; always arrange(date) before fill().

### Real-World Applications

- Airbnb uses pivot_longer() to convert wide booking metrics (one column per night) into long format for time-series modeling and ggplot2 visualization.
- Netflix reshapes viewership tables with pivot_wider() to make per-show matrices for recommendation-model training, then nests by genre for batch model fitting.
- The BBC data team uses complete() on monthly time series to ensure zero-activity months appear in charts (otherwise gaps look like missing data, not zero).
- Bioconductor's tidySummarizedExperiment nests single-cell data by sample for batch model fitting, then unnests coefficients back into a flat tibble.

### Interview Questions

- 1. What are the three principles of tidy data? — Each variable forms a column; each observation forms a row; each observational unit forms a table — most tidyverse pipelines assume tidy data.
- 2. What is the difference between pivot_longer() and gather()? — pivot_longer() is the modern, more flexible replacement; gather() is deprecated and has known issues with handling column-name prefixes and multi-value cells.
- 3. How does nest(-Species) work? — It returns one row per Species with a list-column (default name 'data') containing the per-species tibble; the minus sign means 'everything except'.
- 4. What does complete(month, store, fill = list(sales = 0)) do? — Adds all combinations of month and store, filling missing sales with 0 instead of NA — essential for time series and contingency tables.
- 5. Why should you arrange() before fill()? — fill() carries values in row order; if data is not sorted by time, the carry-forward goes to the wrong row. Always arrange(date) before fill().

### Mini Project

Build a Wide-to-Long Metric Transformer: A function to_long(df, key_col, value_col, pattern) that takes a wide data frame with metric columns matching a regex pattern (e.g. 'sales_\\d{4}') and pivots them into long format with columns key_col (e.g. 'year') and value_col (e.g. 'sales'). Use pivot_longer() with names_pattern to extract the year; verify the result has one row per (id, year) combo.
Suggested approach:
  - Identify target columns with tidyselect::matches(pattern)
  - Use pivot_longer() with names_to = c('.value', key_col) or names_pattern
  - Use names_pattern = 'sales_(\\d{4})' to extract the year suffix
  - Verify with stopifnot(nrow(result) == nrow(df) * n_years)
  - Test on a tibble with id + 3 sales_YYYY columns and check the long shape

### Exercises

1. Take a wide tibble with year and q1..q4 columns; pivot_longer() to long format with quarter and value; then pivot_wider() back; verify equality with all.equal().
2. Separate a 'YYYY-MM-DD' date column into year, month, day; then unite them back as 'YYYY/MM/DD' with sep = '/'.
3. Use extract() with regex to pull area code and number out of phone strings like '(415) 555-1234'; test on 5 strings.
4. Nest iris by Species; fit a linear model of Petal.Width ~ Petal.Length per species with purrr::map(); unnest broom::tidy() results.
5. Build a small monthly time series with missing months; use complete() to add them with sales = 0, then fill() to carry forward any NA values.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does pivot_longer() do?
9. A) Converts long data to wide
10. B) Converts wide data to long (melts columns into rows) (*)
11. C) Sorts rows
12. D) Aggregates by group
13. Explanation: pivot_longer() melts multiple columns into two: a 'name' column and a 'value' column; it replaces the deprecated gather().
14. Q2: What is the inverse of pivot_longer()?
15. A) gather()
16. B) spread()
17. C) pivot_wider() (*)
18. D) unite()
19. Explanation: pivot_wider() is the inverse: it takes a key column and a value column and spreads them into multiple columns; it replaces spread().
20. Q3: What does nest(-Species) return?
21. A) One row with all data nested
22. B) An error
23. C) A vector of species names
24. D) One row per Species, each with a list-column 'data' of tibbles (*)
25. Explanation: nest(-Species) returns one row per Species with a list-column (default 'data') of per-species tibbles; the minus means 'everything except'.
26. Q4: What does complete(month, store, fill = list(sales = 0)) do?
27. A) Adds all month x store combos, filling sales with 0 where missing (*)
28. B) Removes rows with missing combos
29. C) Sorts by month and store
30. D) Computes cumulative sales
31. Explanation: complete() expands to the full Cartesian product of the specified columns, filling missing values with the supplied fill values.
32. Q5: Why should you arrange(date) before fill()?
33. A) fill() requires sorted data
34. B) fill() carries values in row order; unsorted data carries to wrong rows (*)
35. C) fill() sorts automatically
36. D) It does not matter
37. Explanation: fill() works in current row order; if data is not sorted by time, the carry-forward goes to the wrong row. Always arrange(date) first.
38. Q6: Which function splits a character column on a separator?
39. A) split()
40. B) strsplit()
41. C) separate() (*)
42. D) extract()
43. Explanation: tidyr::separate() splits one column into several on a separator; base strsplit() returns a list; extract() uses regex capture groups.
44. Q7: What happens if pivot_wider() encounters duplicate (key, value) combos?
45. A) It silently picks the first
46. B) It sums them automatically
47. C) It drops duplicates silently
48. D) It errors or creates list-cols (*)
49. Explanation: pivot_wider() errors or fills cells with list-cols when duplicates exist; pre-aggregate with group_by() + summarise() first.
50. Q8: What does unnest(col, keep_empty = TRUE) do?
51. A) Keeps rows with empty list elements as NA (*)
52. B) Drops rows with empty list elements
53. C) Throws an error on empty elements
54. D) Removes the list column
55. Explanation: unnest(col, keep_empty = TRUE) preserves rows whose list element is empty, filling the other columns with NA; default is to drop them.
56. Q9: What does unite('combo', a, b, sep = '-') do?
57. A) Adds combo = a - b (numeric)
58. B) Combines columns a and b into one 'combo' string separated by '-' (*)
59. C) Splits combo into a and b
60. D) Computes the union of a and b
61. Explanation: unite() concatenates multiple columns into one string column with a separator; remove = TRUE (default) drops the original columns.
62. Q10: Which is the modern replacement for spread()?
63. A) gather()
64. B) complete()
65. C) pivot_wider() (*)
66. D) expand()
67. Explanation: pivot_wider() replaces the deprecated spread(); it has more consistent arguments and handles edge cases (duplicates, multiple values) better.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does pivot_longer() do?
  options:
    - Converts long data to wide
    - Converts wide data to long (melts columns into rows)
    - Sorts rows
    - Aggregates by group
  correctIndex: 1
  explanation: "pivot_longer() melts multiple columns into two: a 'name' column and a 'value' column; it replaces the deprecated gather()."
- id: q2
  question: What is the inverse of pivot_longer()?
  options:
    - gather()
    - spread()
    - pivot_wider()
    - unite()
  correctIndex: 2
  explanation: "pivot_wider() is the inverse: it takes a key column and a value column and spreads them into multiple columns; it replaces spread()."
- id: q3
  question: What does nest(-Species) return?
  options:
    - One row with all data nested
    - An error
    - A vector of species names
    - One row per Species, each with a list-column 'data' of tibbles
  correctIndex: 3
  explanation: nest(-Species) returns one row per Species with a list-column (default 'data') of per-species tibbles; the minus means 'everything except'.
- id: q4
  question: What does complete(month, store, fill = list(sales = 0)) do?
  options:
    - Adds all month x store combos, filling sales with 0 where missing
    - Removes rows with missing combos
    - Sorts by month and store
    - Computes cumulative sales
  correctIndex: 0
  explanation: complete() expands to the full Cartesian product of the specified columns, filling missing values with the supplied fill values.
- id: q5
  question: Why should you arrange(date) before fill()?
  options:
    - fill() requires sorted data
    - fill() carries values in row order; unsorted data carries to wrong rows
    - fill() sorts automatically
    - It does not matter
  correctIndex: 1
  explanation: fill() works in current row order; if data is not sorted by time, the carry-forward goes to the wrong row. Always arrange(date) first.
- id: q6
  question: Which function splits a character column on a separator?
  options:
    - split()
    - strsplit()
    - separate()
    - extract()
  correctIndex: 2
  explanation: tidyr::separate() splits one column into several on a separator; base strsplit() returns a list; extract() uses regex capture groups.
- id: q7
  question: What happens if pivot_wider() encounters duplicate (key, value) combos?
  options:
    - It silently picks the first
    - It sums them automatically
    - It drops duplicates silently
    - It errors or creates list-cols
  correctIndex: 3
  explanation: pivot_wider() errors or fills cells with list-cols when duplicates exist; pre-aggregate with group_by() + summarise() first.
- id: q8
  question: What does unnest(col, keep_empty = TRUE) do?
  options:
    - do?
    - Keeps rows with empty list elements as NA
    - Drops rows with empty list elements
    - Throws an error on empty elements
    - Removes the list column
    - preserves rows whose list element is empty, filling the other columns with NA; default is to drop them.
  correctIndex: 1
  explanation: unnest(col, keep_empty = TRUE) preserves rows whose list element is empty, filling the other columns with NA; default is to drop them.
- id: q9
  question: What does unite('combo', a, b, sep = '-') do?
  options:
    - Adds combo = a - b (numeric)
    - Combines columns a and b into one 'combo' string separated by '-'
    - Splits combo into a and b
    - Computes the union of a and b
  correctIndex: 1
  explanation: unite() concatenates multiple columns into one string column with a separator; remove = TRUE (default) drops the original columns.
- id: q10
  question: Which is the modern replacement for spread()?
  options:
    - gather()
    - complete()
    - pivot_wider()
    - expand()
  correctIndex: 2
  explanation: pivot_wider() replaces the deprecated spread(); it has more consistent arguments and handles edge cases (duplicates, multiple values) better.
```

