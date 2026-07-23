---
slug: r-data-wrangling-dplyr
id: r-09
track: r
order: 9
title: Data Wrangling with dplyr
description: Master the five dplyr verbs (filter, select, mutate, summarise, arrange) plus group_by, the pipe, and the modern across() — the toolkit that powers almost every tidyverse data pipeline.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=2800s
whyItMatters: Master the five dplyr verbs (filter, select, mutate, summarise, arrange) plus group_by, the pipe, and the modern across() — the toolkit that powers almost every tidyverse data pipeline.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Data Wrangling with dplyr

## Data Wrangling with dplyr

### Why It Matters

Master the five dplyr verbs (filter, select, mutate, summarise, arrange) plus group_by, the pipe, and the modern across() — the toolkit that powers almost every tidyverse data pipeline.

Master the five dplyr verbs (filter, select, mutate, summarise, arrange) plus group_by, the pipe, and the modern across() — the toolkit that powers almost every tidyverse data pipeline.

### Prerequisites

- Stage 4: Data Frames and Tibbles
- Stage 6: Control Flow — Conditionals and Loops
- Stage 7: Functions and Functional Programming (lapply, sapply, map)

### Topics

- The five verbs: filter(), select(), mutate(), summarise(), arrange()
- group_by() + summarise() for grouped aggregation
- Pipes: %>% (magrittr) vs |> (R 4.1+ native)
- Helper functions: starts_with(), ends_with(), contains(), where(), everything()
- across() for applying a function to multiple columns (replaces mutate_all/at/etc.)
- slice_sample(), slice_min(), slice_max(), slice_head(), slice_tail()
- count(), tally(), add_count(), add_tally()
- rename(), relocate(), distinct(), pull()

### Key Concepts

- dplyr verbs are lazy on tibbles: they always return a new tibble (copy-on-modify), never modify in place; the pipe threads the result of one verb into the first argument of the next.
- %>% (magrittr) inserts the LHS as the first argument of the RHS call AND supports the . placeholder; |> (R 4.1+ native) is faster and stricter but has no placeholder — use it for new code unless you need the dot.
- group_by() + summarise() is the workhorse: group_by() sets the grouping, summarise() collapses each group to one row; ungroup() removes grouping (forgetting this is a common bug).
- across(cols, fns) applies one or more functions to selected columns; it replaces the deprecated mutate_all/at/if/each family.
- summarise() with n() returns group sizes; n_distinct() returns unique counts; first()/last()/nth() return positional values within each group.

```r
library(dplyr)
mtcars %>%
  filter(cyl %in% c(4, 6)) %>%            # rows: 4 or 6 cylinders
  select(mpg, cyl, hp, wt) %>%            # columns
  mutate(hp_per_ton = hp / wt) %>%         # new column
  arrange(desc(hp_per_ton)) %>%            # sort
  head(5)                                  # top 5
# Note: %>% is magrittr, |> is R 4.1+ native:
mtcars |> filter(cyl == 4) |> head(3)
```
Caption: The five verbs + pipe

### Common Pitfalls

- Forgetting ungroup() after group_by() + summarise() — the result still has the (smaller) grouping, so further mutate/summarise silently operates per group; always ungroup() unless you intend to keep grouping.
- Using %>% when you need the . placeholder — the native |> pipe does NOT support . as a placeholder (R 4.1); use %>% from magrittr for placeholder behavior, or use _ as the named-placeholder in |>.
- Confusing filter() with if_else() inside mutate() — filter() keeps/removes rows; if_else() inside mutate() creates per-row flags; using one when you mean the other is a common logic bug.
- Relying on row order without arrange() — dplyr does not guarantee row order across verbs; if order matters, end the pipeline with arrange() (or use slice_min/max which sort implicitly).
- Mutate with a non-vectorized function — mutate(score = slow_fn(value)) calls slow_fn once per row, which can be 1000x slower than Vectorize(slow_fn) or purrr::map_dbl; benchmark first.

### Real-World Applications

- Airbnb's R codebase uses dplyr pipelines as the standard unit of analysis; their internal 'minipipe' style guide mandates ungroup() and explicit arrange() at the end of every pipeline.
- Netflix's experimentation team uses group_by() + summarise() across millions of users to compute per-cohort metric lift; the resulting tibbles feed ggplot2 dashboards.
- The New York Times data desk uses dplyr + count() + slice_max() to surface top stories and trending topics from web-traffic logs.
- Bioconductor's tidySummarizedExperiment brings dplyr verbs to genomic range data, so analysts can filter() genes by chromosome and group_by() sample batch.

### Interview Questions

- 1. What are the five core dplyr verbs? — filter() (rows by condition), select() (columns by name), mutate() (new columns), summarise() (collapse to one row per group), arrange() (sort rows).
- 2. What is the difference between %>% and |>? — %>% is magrittr's pipe with . placeholder and lazy evaluation; |> is R 4.1+ native, faster and stricter, with no . placeholder (use _ for named-argument position).
- 3. Why does summarise() without ungroup() cause subtle bugs? — After summarise(), the result retains the grouping (now with one row per group); further mutate/summarise silently operates per group; always ungroup() unless intended.
- 4. What does across() replace? — across() replaces the deprecated mutate_if/at/all, summarise_if/at/all, and transmute_if/at/all family; it takes a column selector and one or more functions.
- 5. How does slice_sample(prop = 0.1) differ from sample_n(df, 10)? — slice_sample(prop = 0.1) takes 10% of rows; sample_n(df, 10) takes exactly 10 rows; slice_sample() is the modern, slice_*()-consistent verb.

### Mini Project

Build a Customer Cohort Retention Analyzer: A function cohort_retention(transactions, customer_id, date, period = 'month') that takes a transactions tibble and computes a cohort-retention matrix — rows are first-purchase cohorts, columns are months since first purchase, cells are the count (or fraction) of returning customers. Use dplyr group_by(), summarise(), mutate(), and tidyr::pivot_wider() (preview).
Suggested approach:
  - Find each customer's first-purchase date with group_by(customer_id) + summarise(first = min(date))
  - Join back to transactions and compute cohort_period and elapsed_period with lubridate::floor_date()
  - Group by cohort_period and elapsed_period; summarise active = n_distinct(customer_id)
  - Compute cohort size and retention fraction with mutate(active / first(active))
  - Pivot to wide with tidyr::pivot_wider(names_from = elapsed_period, values_from = retention)

### Exercises

1. Use filter(), select(), mutate(), and arrange() to find the top 5 most fuel-efficient 4-cylinder cars in mtcars.
2. Group mtcars by cyl and compute mean, median, and sd of mpg; sort the result by mean_mpg descending.
3. Use across(where(is.numeric), mean, na.rm = TRUE) on iris grouped by Species; rename the result columns with .names = 'mean_{.col}'.
4. Demonstrate the ungroup() pitfall: create a grouped tibble, summarise, then mutate without ungroup() — explain the unexpected per-group behavior.
5. Rewrite a magrittr %>% pipeline using the native |> pipe; identify which steps need adjustment because of the missing . placeholder.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which dplyr verb keeps rows where a condition is TRUE?
9. A) filter() (*)
10. B) select()
11. C) arrange()
12. D) mutate()
13. Explanation: filter() keeps rows by condition; select() picks columns; mutate() adds columns; arrange() sorts rows.
14. Q2: What is the difference between %>% and |>?
15. A) They are identical
16. B) %>% supports the . placeholder; |> (R 4.1+) does not (*)
17. C) |> is magrittr; %>% is native
18. D) |> is faster but deprecated
19. Explanation: %>% (magrittr) has . as a placeholder and lazy semantics; |> (R 4.1+ native) is stricter and faster but has no . placeholder.
20. Q3: Why must you call ungroup() after a grouped summarise()?
21. A) summarise() drops the grouping automatically
22. B) ungroup() is required by R CMD check
23. C) The result retains the grouping, so further mutate/summarise silently operates per group (*)
24. D) ungroup() sorts the result
25. Explanation: summarise() peels off one level of grouping but keeps the rest; further operations silently operate per group; ungroup() removes all grouping.
26. Q4: What does across() replace?
27. A) group_by()
28. B) summarise()
29. C) the pipe
30. D) the mutate_if/at/all family (*)
31. Explanation: across() replaces the deprecated mutate_if/at/all, summarise_if/at/all, transmute_if/at/all; it takes a column selector and one or more functions.
32. Q5: Which helper selects all numeric columns inside across()?
33. A) where(is.numeric) (*)
34. B) is.numeric
35. C) all_numeric()
36. D) numeric_cols()
37. Explanation: where(is.numeric) is a selection helper that picks columns where the predicate returns TRUE; it is the modern replacement for mutate_if(is.numeric, ...).
38. Q6: What does slice_max(mpg, n = 3) return?
39. A) The 3 smallest mpg values
40. B) The 3 rows with the largest mpg (*)
41. C) 3 random rows
42. D) An error
43. Explanation: slice_max(mpg, n = 3) returns the top 3 rows by mpg; slice_min() returns the bottom n; slice_sample() returns random rows.
44. Q7: What does count(cyl, sort = TRUE) do?
45. A) Sorts by cyl
46. B) Computes cumulative counts
47. C) Counts rows per cyl and sorts by frequency descending (*)
48. D) Throws an error
49. Explanation: count(cyl, sort = TRUE) is shorthand for group_by(cyl) %>% summarise(n = n()) %>% arrange(desc(n)) %>% ungroup().
50. Q8: What does pull(mpg) do?
51. A) Plots mpg
52. B) Removes the mpg column
53. C) Adds an mpg column
54. D) Extracts the mpg column as a vector (not a tibble) (*)
55. Explanation: pull() extracts a single column as a vector; useful when you need to pass a column to a function that expects a vector, not a tibble.
56. Q9: Which is the modern way to apply two functions to every numeric column inside summarise()?
57. A) summarise(across(where(is.numeric), list(min = min, max = max))) (*)
58. B) summarise_each()
59. C) summarise_all()
60. D) mutate_if(is.numeric, list(min, max))
61. Explanation: across() with a list of named functions is the modern, consistent syntax; the _each/_all/_if variants are deprecated.
62. Q10: What happens if you call mutate(score = slow_fn(value)) where slow_fn is not vectorized?
63. A) It runs once for the whole column
64. B) It runs once per row, which can be 1000x slower than a vectorized version (*)
65. C) It throws an error
66. D) It is automatically parallelized
67. Explanation: mutate calls the function once per row; for non-vectorized functions, use Vectorize(), purrr::map_dbl(), or rewrite the function to be vectorized.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which dplyr verb keeps rows where a condition is TRUE?
  options:
    - filter()
    - select()
    - arrange()
    - mutate()
  correctIndex: 0
  explanation: filter() keeps rows by condition; select() picks columns; mutate() adds columns; arrange() sorts rows.
- id: q2
  question: What is the difference between %>% and |>?
  options:
    - They are identical
    - "%>% supports the . placeholder; |> (R 4.1+) does not"
    - "|> is magrittr; %>% is native"
    - "|> is faster but deprecated"
  correctIndex: 1
  explanation: "%>% (magrittr) has . as a placeholder and lazy semantics; |> (R 4.1+ native) is stricter and faster but has no . placeholder."
- id: q3
  question: Why must you call ungroup() after a grouped summarise()?
  options:
    - summarise() drops the grouping automatically
    - ungroup() is required by R CMD check
    - The result retains the grouping, so further mutate/summarise silently operates per group
    - ungroup() sorts the result
  correctIndex: 2
  explanation: summarise() peels off one level of grouping but keeps the rest; further operations silently operate per group; ungroup() removes all grouping.
- id: q4
  question: What does across() replace?
  options:
    - group_by()
    - summarise()
    - the pipe
    - the mutate_if/at/all family
  correctIndex: 3
  explanation: across() replaces the deprecated mutate_if/at/all, summarise_if/at/all, transmute_if/at/all; it takes a column selector and one or more functions.
- id: q5
  question: Which helper selects all numeric columns inside across()?
  options:
    - where(is.numeric)
    - is.numeric
    - all_numeric()
    - numeric_cols()
  correctIndex: 0
  explanation: where(is.numeric) is a selection helper that picks columns where the predicate returns TRUE; it is the modern replacement for mutate_if(is.numeric, ...).
- id: q6
  question: What does slice_max(mpg, n = 3) return?
  options:
    - The 3 smallest mpg values
    - The 3 rows with the largest mpg
    - 3 random rows
    - An error
  correctIndex: 1
  explanation: slice_max(mpg, n = 3) returns the top 3 rows by mpg; slice_min() returns the bottom n; slice_sample() returns random rows.
- id: q7
  question: What does count(cyl, sort = TRUE) do?
  options:
    - do?
    - Sorts by cyl
    - Computes cumulative counts
    - Counts rows per cyl and sorts by frequency descending
    - Throws an error
    - is shorthand for group_by(cyl) %>% summarise(n = n()) %>% arrange(desc(n)) %>% ungroup().
  correctIndex: 3
  explanation: count(cyl, sort = TRUE) is shorthand for group_by(cyl) %>% summarise(n = n()) %>% arrange(desc(n)) %>% ungroup().
- id: q8
  question: What does pull(mpg) do?
  options:
    - Plots mpg
    - Removes the mpg column
    - Adds an mpg column
    - Extracts the mpg column as a vector (not a tibble)
  correctIndex: 3
  explanation: pull() extracts a single column as a vector; useful when you need to pass a column to a function that expects a vector, not a tibble.
- id: q9
  question: Which is the modern way to apply two functions to every numeric column inside summarise()?
  options:
    - summarise(across(where(is.numeric), list(min = min, max = max)))
    - summarise_each()
    - summarise_all()
    - mutate_if(is.numeric, list(min, max))
  correctIndex: 0
  explanation: across() with a list of named functions is the modern, consistent syntax; the _each/_all/_if variants are deprecated.
- id: q10
  question: What happens if you call mutate(score = slow_fn(value)) where slow_fn is not vectorized?
  options:
    - It runs once for the whole column
    - It runs once per row, which can be 1000x slower than a vectorized version
    - It throws an error
    - It is automatically parallelized
  correctIndex: 1
  explanation: mutate calls the function once per row; for non-vectorized functions, use Vectorize(), purrr::map_dbl(), or rewrite the function to be vectorized.
```

