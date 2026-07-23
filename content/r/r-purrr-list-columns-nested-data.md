---
slug: r-purrr-list-columns-nested-data
id: r-16
track: r
order: 16
title: Purrr, List Columns, and Nested Data
description: Use purrr's full functional toolkit — safely, possibly, walk, pluck, keep, discard — to iterate over complex nested structures and build per-group model pipelines with list-columns.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=5250s
whyItMatters: Use purrr's full functional toolkit — safely, possibly, walk, pluck, keep, discard — to iterate over complex nested structures and build per-group model pipelines with list-columns.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Purrr, List Columns, and Nested Data

## Purrr, List Columns, and Nested Data

### Why It Matters

Use purrr's full functional toolkit — safely, possibly, walk, pluck, keep, discard — to iterate over complex nested structures and build per-group model pipelines with list-columns.

Use purrr's full functional toolkit — safely, possibly, walk, pluck, keep, discard — to iterate over complex nested structures and build per-group model pipelines with list-columns.

### Prerequisites

- Stage 7: Functions and Functional Programming (lapply, sapply, map)
- Stage 9: Data Wrangling with dplyr
- Stage 10: Tidyr — Pivot, Unite, Separate, Nest

### Topics

- map(), map_dbl(), map_chr(), map_lgl(), map_int(), map_dfr(), map_dfc()
- map2() and pmap() for parallel iteration over multiple inputs
- walk(), walk2(), iwalk() for side-effectful iteration
- safely(), possibly(), quietly() for error-tolerant iteration
- keep(), discard(), compact(), reduce(), accumulate()
- pluck(), chuck() for deep extraction (replacing [[ chaining)
- List-columns: nesting with tidyr::nest(), operating with map(), unnesting
- Per-group models: nest() + mutate(model = map(data, lm)) + broom::tidy()

### Key Concepts

- map() always returns a list; map_dbl/_chr/_lgl/_int return typed vectors (error if FUN returns wrong type); map_dfr/_dfc row/column-bind tibbles.
- safely(fn) wraps fn to return list(result, error); possibly(fn, otherwise) returns a default on error; quietly() captures warnings/messages — use these to make pipelines resilient to bad inputs.
- pluck(x, 'a', 2, 'b') is the safe replacement for x[['a']][[2]][['b']] — it returns NULL on missing path; chuck() throws instead.
- List-columns (tibbles with a column that is a list of tibbles/vectors) are the bridge between dplyr and purrr: nest() creates them, map() operates on them, unnest() expands them.
- The 'many models' pattern: nest(-group) %>% mutate(model = map(data, lm)) %>% mutate(tidy = map(model, broom::tidy)) %>% unnest(tidy) fits one model per group and returns a flat tibble of coefficients.

```r
library(purrr)
xs <- list(1:3, 4:6, 7:9)
map(xs, mean)                  # list
map_dbl(xs, mean)              # numeric vector
map_chr(xs, \(x) paste(x, collapse = ","))
map_lgl(xs, \(x) length(x) == 3)
map_dfr(xs, \(x) tibble(min = min(x), max = max(x)))  # row-bind tibbles
# map2 for two parallel inputs:
map2_chr(c("Alice","Bob"), c(95, 88), \(name, score) paste(name, score, sep = ": "))
```
Caption: Map variants and types

### Common Pitfalls

- Using map() when you need a typed vector — map() returns a list, so downstream code expecting a vector silently breaks; use map_dbl/_chr/_lgl/_int to lock the type.
- Forgetting that map_dfr() requires FUN to return a tibble or data frame — if some calls return NULL (e.g. empty subset), bind_rows() silently drops them; use possibly(fn, tibble()) to keep schema.
- Confusing map2() with pmap() — map2() takes exactly two parallel inputs; pmap() takes a list of N parallel inputs (one element per argument of the function); use pmap for 3+ parallel inputs.
- Calling side-effectful functions (write_csv, ggsave) with map() instead of walk() — map() returns a list of NULLs (the return of write_csv); walk() returns the input invisibly and signals intent.
- Operating on list-columns without checking lengths — unnest(col) on a column where elements have unequal lengths produces a longer tibble than expected; use unnest(col, keep_empty = TRUE) and inspect lengths first.

### Real-World Applications

- Airbnb runs hundreds of A/B test analyses per week with the many-models pattern: nest by experiment, fit a linear model per experiment, unnest broom::tidy() coefficients into a flat tibble for dashboards.
- Netflix uses purrr::safely() to wrap calls to internal forecasting APIs so a single bad show ID does not kill a 10,000-show batch render.
- The New York Times election desk uses pmap() to iterate over (state, year, office) tuples and render one Quarto report per combo via rmarkdown::render().
- Bioconductor's plyranges + purrr pipelines fit one differential-expression model per gene across thousands of genes, using map_dfr() to bind coefficient tibbles.

### Interview Questions

- 1. What is the difference between map(), map_dbl(), and map_dfr()? — map() returns a list; map_dbl() returns a numeric vector (errors on wrong type); map_dfr() row-binds tibble-returning results into one tibble.
- 2. What do safely() and possibly() do? — safely(fn) wraps fn to return list(result, error) so failures do not stop iteration; possibly(fn, otherwise) returns a default on error; both make pipelines resilient.
- 3. How would you fit one model per group and get coefficients in a flat tibble? — nest(-group) %>% mutate(model = map(data, lm), tidy = map(model, broom::tidy)) %>% unnest(tidy).
- 4. What is pluck() for, and how does it differ from chuck()? — pluck(x, 'a', 1, 'b') is the safe replacement for x[['a']][[1]][['b']], returning NULL on missing path; chuck() throws on missing path.
- 5. When should you use walk() instead of map()? — walk() is for side-effectful functions (write_csv, ggsave, message) where the return value is uninteresting; it returns the input invisibly and signals intent.

### Mini Project

Build a Safe Multi-File Loader: A function load_all(paths, reader = readr::read_csv) that takes a vector of file paths and a reader function, returns a single row-bound tibble with a source_file column tracking provenance. Wrap the reader in safely() so one missing or malformed file does not kill the batch; log errors to a separate tibble attribute and skip bad files.
Suggested approach:
  - Wrap reader with safely() to capture errors per file
  - Use purrr::map() to iterate paths and collect (result, error) pairs
  - Use purrr::compact() and purrr::list_rbind() (or map_dfr with possibly()) to bind successful results
  - Add source_file column with dplyr::mutate()
  - Attach errors as attr(result, 'errors') so callers can inspect failures

### Exercises

1. Use map_dbl() to compute the mean of each column in mtcars; verify the result type with class().
2. Wrap log() in safely() and map it over c(10, -1, 100); extract results and errors separately with list_transpose().
3. Use pluck() to extract a deep nested value from a list representing a JSON API response; demonstrate NULL vs chuck() error.
4. Nest iris by Species; fit lm(Petal.Width ~ Petal.Length) per species; unnest broom::tidy() coefficients into a flat tibble.
5. Use walk() to write 3 small tibbles to disk; explain why walk() is more appropriate than map() here.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does map() always return?
9. A) A typed vector
10. B) A tibble
11. C) A vector of length 1
12. D) A list (*)
13. Explanation: map() always returns a list, regardless of FUN's return type; use map_dbl/_chr/_lgl/_int for typed vectors, map_dfr/_dfc for tibbles.
14. Q2: What does map_dbl(xs, mean) do if mean() returns NA for some element?
15. A) Returns NA in that position (*)
16. B) Errors
17. C) Skips that element
18. D) Returns a list
19. Explanation: map_dbl() returns a numeric vector the same length as xs; NAs are preserved. It only errors if FUN returns a non-numeric type.
20. Q3: What does safely(fn) return when applied to a function?
21. A) A function that always succeeds
22. B) A function that returns list(result, error) (*)
23. C) A function that throws on error
24. D) A function that retries
25. Explanation: safely(fn) wraps fn so each call returns list(result, error) — result is NULL on error, error is NULL on success; iteration continues past failures.
26. Q4: What does possibly(fn, otherwise = NA) do?
27. A) Throws on error
28. B) Retries 3 times
29. C) Returns NA on error instead of throwing (*)
30. D) Logs the error and throws
31. Explanation: possibly(fn, otherwise = NA) returns the otherwise value when fn errors; useful for batch jobs where you want to skip bad inputs without stopping.
32. Q5: What does pluck(x, 'a', 1, 'b') return if any element is missing?
33. A) An error
34. B) NA
35. C) The last valid element
36. D) NULL (*)
37. Explanation: pluck() returns NULL on a missing path; chuck() throws instead. pluck() is the safe deep-extraction tool.
38. Q6: Which purrr function iterates over TWO parallel inputs?
39. A) map2() (*)
40. B) map()
41. C) pmap()
42. D) imap()
43. Explanation: map2(x, y, fn) iterates over two parallel inputs; pmap(list(x, y, z), fn) handles 3+ parallel inputs; imap() gives both value and index/name.
44. Q7: What does walk() return?
45. A) A list of results
46. B) Its input invisibly (used for side effects) (*)
47. C) NULL
48. D) An error
49. Explanation: walk() returns its input invisibly; it is for side-effectful functions (write_csv, ggsave) where the return value is uninteresting. Using map() here would return a list of NULLs.
50. Q8: What does map_dfr() require of FUN?
51. A) FUN must return a vector
52. B) FUN must return a list
53. C) FUN must return a data frame or tibble (row-bound into one tibble) (*)
54. D) FUN must return NULL
55. Explanation: map_dfr() row-binds FUN results; each must be a data frame or tibble. Use possibly(fn, tibble()) to maintain schema when some calls return NULL.
56. Q9: What does keep(xs, predicate) do?
57. A) Keeps the first element matching predicate
58. B) Removes elements where predicate is TRUE
59. C) Sorts by predicate
60. D) Returns a list of elements where predicate is TRUE (*)
61. Explanation: keep() returns a list of elements where predicate returns TRUE; discard() returns the complement; compact() drops NULL elements.
62. Q10: What does the many-models pattern produce?
63. A) A flat tibble of per-group coefficients (via nest + map(lm) + map(broom::tidy) + unnest) (*)
64. B) A single model object
65. C) A list of plots
66. D) An error
67. Explanation: nest(-group) + mutate(model = map(data, lm), tidy = map(model, broom::tidy)) + unnest(tidy) returns one row per (group, coefficient) for downstream analysis or plotting.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does map() always return?
  options:
    - A typed vector
    - A tibble
    - A vector of length 1
    - A list
  correctIndex: 3
  explanation: map() always returns a list, regardless of FUN's return type; use map_dbl/_chr/_lgl/_int for typed vectors, map_dfr/_dfc for tibbles.
- id: q2
  question: What does map_dbl(xs, mean) do if mean() returns NA for some element?
  options:
    - Returns NA in that position
    - Errors
    - Skips that element
    - Returns a list
  correctIndex: 0
  explanation: map_dbl() returns a numeric vector the same length as xs; NAs are preserved. It only errors if FUN returns a non-numeric type.
- id: q3
  question: What does safely(fn) return when applied to a function?
  options:
    - A function that always succeeds
    - A function that returns list(result, error)
    - A function that throws on error
    - A function that retries
  correctIndex: 1
  explanation: safely(fn) wraps fn so each call returns list(result, error) — result is NULL on error, error is NULL on success; iteration continues past failures.
- id: q4
  question: What does possibly(fn, otherwise = NA) do?
  options:
    - do?
    - Throws on error
    - Retries 3 times
    - Returns NA on error instead of throwing
    - Logs the error and throws
    - returns the otherwise value when fn errors; useful for batch jobs where you want to skip bad inputs without stopping.
  correctIndex: 3
  explanation: possibly(fn, otherwise = NA) returns the otherwise value when fn errors; useful for batch jobs where you want to skip bad inputs without stopping.
- id: q5
  question: What does pluck(x, 'a', 1, 'b') return if any element is missing?
  options:
    - An error
    - NA
    - The last valid element
    - "NULL"
  correctIndex: 3
  explanation: pluck() returns NULL on a missing path; chuck() throws instead. pluck() is the safe deep-extraction tool.
- id: q6
  question: Which purrr function iterates over TWO parallel inputs?
  options:
    - map2()
    - map()
    - pmap()
    - imap()
  correctIndex: 0
  explanation: map2(x, y, fn) iterates over two parallel inputs; pmap(list(x, y, z), fn) handles 3+ parallel inputs; imap() gives both value and index/name.
- id: q7
  question: What does walk() return?
  options:
    - A list of results
    - Its input invisibly (used for side effects)
    - "NULL"
    - An error
  correctIndex: 1
  explanation: walk() returns its input invisibly; it is for side-effectful functions (write_csv, ggsave) where the return value is uninteresting. Using map() here would return a list of NULLs.
- id: q8
  question: What does map_dfr() require of FUN?
  options:
    - FUN must return a vector
    - FUN must return a list
    - FUN must return a data frame or tibble (row-bound into one tibble)
    - FUN must return NULL
  correctIndex: 2
  explanation: map_dfr() row-binds FUN results; each must be a data frame or tibble. Use possibly(fn, tibble()) to maintain schema when some calls return NULL.
- id: q9
  question: What does keep(xs, predicate) do?
  options:
    - Keeps the first element matching predicate
    - Removes elements where predicate is TRUE
    - Sorts by predicate
    - Returns a list of elements where predicate is TRUE
  correctIndex: 3
  explanation: keep() returns a list of elements where predicate returns TRUE; discard() returns the complement; compact() drops NULL elements.
- id: q10
  question: What does the many-models pattern produce?
  options:
    - A flat tibble of per-group coefficients (via nest + map(lm) + map(broom::tidy) + unnest)
    - A single model object
    - A list of plots
    - An error
  correctIndex: 0
  explanation: nest(-group) + mutate(model = map(data, lm), tidy = map(model, broom::tidy)) + unnest(tidy) returns one row per (group, coefficient) for downstream analysis or plotting.
```

