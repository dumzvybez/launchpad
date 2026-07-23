---
slug: r-factors-forcats
id: r-14
track: r
order: 14
title: Factors with forcats
description: Tame categorical variables with the forcats package — reorder levels by frequency, lump rare levels, recode values, and control the order plots and models present.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=4550s
whyItMatters: Tame categorical variables with the forcats package — reorder levels by frequency, lump rare levels, recode values, and control the order plots and models present.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Factors with forcats

## Factors with forcats

### Why It Matters

Tame categorical variables with the forcats package — reorder levels by frequency, lump rare levels, recode values, and control the order plots and models present.

Tame categorical variables with the forcats package — reorder levels by frequency, lump rare levels, recode values, and control the order plots and models present.

### Prerequisites

- Stage 5: Factors, Strings, and Dates
- Stage 9: Data Wrangling with dplyr

### Topics

- fct_reorder(): reorder levels by another variable
- fct_infreq(), fct_inorder(), fct_rev()
- fct_recode(): rename individual levels
- fct_collapse(): combine multiple levels into one
- fct_lump(), fct_lump_n(), fct_lump_prop(): collapse rare levels to 'Other'
- fct_drop(), fct_explicit_na(): handle unused and missing levels
- fct_relevel(), fct_anon(): change reference or anonymize
- fct_cross() and fct_expand() for compound factors

### Key Concepts

- Factors drive plot order (left-to-right, top-to-bottom) and regression contrasts (first level is the reference); uncontrolled factor order produces arbitrary plots and models.
- fct_reorder(f, x) reorders f's levels by a summary (default median) of x per level — the standard way to sort bars/boxplots by their value rather than alphabetically.
- fct_infreq() orders levels by frequency (most common first); fct_lump_n(n = 5) keeps top 5 levels and collapses the rest to 'Other' — essential for high-cardinality categoricals.
- fct_recode(f, 'new' = 'old') renames levels; fct_collapse(f, group = c('a','b')) combines levels — the way to clean messy survey responses.
- fct_explicit_na(f) converts NA to a visible 'NA' level so it appears in plots and tables; fct_drop(f) removes unused levels after subsetting.

```r
library(forcats); library(ggplot2); library(dplyr)
# Boxplot of mpg by manufacturer, ordered by median mpg:
mpg %>%
  mutate(manufacturer = fct_reorder(manufacturer, hwy, .fun = median)) %>%
  ggplot(aes(manufacturer, hwy)) +
  geom_boxplot() +
  coord_flip()
# Reverse so the largest is at the top:
mpg %>%
  mutate(manufacturer = fct_reorder(manufacturer, hwy, median) %>% fct_rev()) %>%
  ggplot(aes(manufacturer, hwy)) + geom_boxplot() + coord_flip()
```
Caption: Reorder for plots

### Common Pitfalls

- Leaving factor levels in alphabetical order in plots — bars/boxplots appear in arbitrary alphabetical order; use fct_reorder() to sort by the actual value being plotted.
- Forgetting fct_drop() after subsetting — unused levels stay in the factor and show up as empty bars/categories in plots; call fct_drop() or use droplevels().
- Letting NA silently disappear from plots — NA values are not factor levels by default and vanish from bar charts; use fct_explicit_na() to make them visible.
- Lumping with fct_lump() without checking the result — the default behavior changed across forcats versions; explicitly use fct_lump_n() or fct_lump_prop() to be deterministic.
- Using fct_recode() with the wrong direction — syntax is fct_recode(f, new = old), not the other way; flipping the assignment silently produces wrong labels.

### Real-World Applications

- Airbnb uses fct_lump_n() to group rare listing types (e.g. yurt, treehouse) into 'Other' so plots and models aren't dominated by singleton categories.
- Netflix uses fct_reorder() to sort genre bar charts by average viewership so the chart tells a story (most-watched at the top) rather than alphabetical noise.
- The New York Times uses fct_recode() to merge small election-candidate categories ('Libertarian', 'Green') into 'Other' for cleaner published charts.
- Bioconductor uses factors to represent chromosome and strand; forcats-like reordering ensures karyotype plots present chromosomes in canonical 1-22, X, Y order.

### Interview Questions

- 1. Why does factor level order matter for plots? — ggplot2 places levels left-to-right (or top-to-bottom) in level order; alphabetical order is usually meaningless, so use fct_reorder() to sort by value.
- 2. What does fct_lump_n(n = 5) do? — Keeps the 5 most frequent levels and collapses all others into 'Other'; essential for high-cardinality categoricals that would otherwise dominate a legend.
- 3. How do you make NA appear in a bar chart? — Use fct_explicit_na(f, na_level = 'Missing') to convert NA into a visible factor level so it shows up in tables and plots.
- 4. What is fct_reorder(f, x, .fun = median) used for? — Reorders f's levels by the median of x within each level; the standard way to sort boxplots or bar charts by their value.
- 5. What is the syntax of fct_recode()? — fct_recode(f, new_name = 'old_name'); you can rename multiple levels with multiple new = old pairs; flipping direction silently mislabels.

### Mini Project

Build a Survey Response Cleaner: A function clean_survey(df, col) that takes a tibble and a column of messy survey responses (typos, casing variations, rare levels, NAs) and returns the column as a clean factor: lowercased, whitespace-squished, common typos recoded (e.g. 'yes ' -> 'yes'), rare levels (under 5% frequency) lumped to 'Other', and NA converted to 'No Response'. Return the cleaned factor and a summary tibble of before/after counts.
Suggested approach:
  - Lowercase + squish with stringr::str_squish(str_to_lower(as.character(df[[col]])))
  - Recode known typos with forcats::fct_recode('yes' = 'yes ', 'no' = 'n')
  - Lump rare levels with forcats::fct_lump_prop(prop = 0.05)
  - Convert NA to a visible level with forcats::fct_explicit_na('No Response')
  - Return a list with cleaned factor and a before/after count tibble

### Exercises

1. Use fct_reorder() to sort manufacturers in the mpg dataset by median hwy; plot with ggplot2 and coord_flip().
2. Use fct_lump_n(n = 5) on a high-cardinality factor (e.g. model in mpg); verify the result has 6 levels (top 5 + Other).
3. Use fct_recode() to rename 'f' to 'front', 'r' to 'rear', '4' to 'four' on mpg$drv; verify with levels().
4. Demonstrate the fct_drop() need: subset a factor to one level, then plot it with and without fct_drop(); explain the difference.
5. Use fct_explicit_na() to make NA values visible in a bar chart of a factor with missing values.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does fct_reorder(f, x) do by default?
9. A) Reorders f alphabetically
10. B) Reorders f's levels by the median of x within each level (*)
11. C) Reorders by frequency
12. D) Reverses the level order
13. Explanation: fct_reorder(f, x) reorders f's levels by the median (default .fun) of x per level; the standard way to sort boxplots/bar charts by value.
14. Q2: What does fct_lump_n(n = 5) do?
15. A) Keeps the 5 rarest levels
16. B) Removes the 5 most frequent levels
17. C) Keeps the 5 most frequent levels and collapses the rest to 'Other' (*)
18. D) Splits each level into 5
19. Explanation: fct_lump_n(n = 5) keeps the top 5 levels by frequency and collapses all others into 'Other'; essential for high-cardinality categoricals.
20. Q3: How do you make NA appear in a bar chart of a factor?
21. A) Use na.rm = TRUE
22. B) You cannot; NA always disappears
23. C) Use forcats::fct_drop()
24. D) Use fct_explicit_na() to convert NA to a visible level (*)
25. Explanation: fct_explicit_na(f, na_level = 'Missing') converts NA into a visible factor level so it shows up in tables and plots.
26. Q4: What is the syntax for fct_recode()?
27. A) fct_recode(f, new = old) (*)
28. B) fct_recode(f, old = new)
29. C) fct_recode(f, new, old)
30. D) fct_recode(f, 'new', 'old')
31. Explanation: fct_recode(f, new_name = 'old_name'); you can rename multiple levels with multiple new = old pairs in one call. Flipping direction silently mislabels.
32. Q5: What does fct_drop() do?
33. A) Drops the entire factor column
34. B) Removes unused levels after subsetting (*)
35. C) Drops NAs
36. D) Drops the first level
37. Explanation: fct_drop() removes unused levels (e.g. after subsetting); otherwise they linger and appear as empty categories in plots.
38. Q6: Which forcats function orders levels by frequency (most common first)?
39. A) fct_reorder
40. B) fct_inorder
41. C) fct_infreq (*)
42. D) fct_rev
43. Explanation: fct_infreq() orders levels by frequency, most common first; fct_inorder() orders by first appearance in the data; fct_rev() reverses any order.
44. Q7: What does fct_collapse(f, East = c('NYC','Miami')) do?
45. A) Splits 'East' into NYC and Miami
46. B) Drops NYC and Miami
47. C) Reorders them
48. D) Combines NYC and Miami into a single 'East' level (*)
49. Explanation: fct_collapse() combines multiple existing levels into one new level; useful for grouping small categories or merging variants.
50. Q8: What does fct_relevel(sizes, 'XXL') do?
51. A) Moves 'XXL' to the first position (reference level) (*)
52. B) Removes 'XXL'
53. C) Renames 'XXL'
54. D) Reverses around 'XXL'
55. Explanation: fct_relevel(f, 'X') moves 'X' to the front (becomes the first level, the regression reference); other levels shift down.
56. Q9: What does fct_anon(patients) do?
57. A) Anonymizes the data values
58. B) Replaces level names with Level1, Level2, ... (preserving groupings) (*)
59. C) Drops levels
60. D) Reorders randomly
61. Explanation: fct_anon() replaces level names with anonymous labels (Level1, Level2, ...) while preserving the groupings; useful for sharing data without exposing names.
62. Q10: Why does leaving factors in alphabetical order matter for plots?
63. A) It doesn't matter
64. B) It is faster alphabetically
65. C) Bars/boxplots appear in arbitrary alphabetical order rather than by value, obscuring patterns (*)
66. D) Alphabetical is required by ggplot2
67. Explanation: ggplot2 places levels in level order; alphabetical is usually meaningless. Use fct_reorder() to sort by value so the chart tells a story.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does fct_reorder(f, x) do by default?
  options:
    - Reorders f alphabetically
    - Reorders f's levels by the median of x within each level
    - Reorders by frequency
    - Reverses the level order
  correctIndex: 1
  explanation: fct_reorder(f, x) reorders f's levels by the median (default .fun) of x per level; the standard way to sort boxplots/bar charts by value.
- id: q2
  question: What does fct_lump_n(n = 5) do?
  options:
    - Keeps the 5 rarest levels
    - Removes the 5 most frequent levels
    - Keeps the 5 most frequent levels and collapses the rest to 'Other'
    - Splits each level into 5
  correctIndex: 2
  explanation: fct_lump_n(n = 5) keeps the top 5 levels by frequency and collapses all others into 'Other'; essential for high-cardinality categoricals.
- id: q3
  question: How do you make NA appear in a bar chart of a factor?
  options:
    - Use na.rm = TRUE
    - You cannot; NA always disappears
    - Use forcats::fct_drop()
    - Use fct_explicit_na() to convert NA to a visible level
  correctIndex: 3
  explanation: fct_explicit_na(f, na_level = 'Missing') converts NA into a visible factor level so it shows up in tables and plots.
- id: q4
  question: What is the syntax for fct_recode()?
  options:
    - fct_recode(f, new = old)
    - fct_recode(f, old = new)
    - fct_recode(f, new, old)
    - fct_recode(f, 'new', 'old')
  correctIndex: 0
  explanation: fct_recode(f, new_name = 'old_name'); you can rename multiple levels with multiple new = old pairs in one call. Flipping direction silently mislabels.
- id: q5
  question: What does fct_drop() do?
  options:
    - Drops the entire factor column
    - Removes unused levels after subsetting
    - Drops NAs
    - Drops the first level
  correctIndex: 1
  explanation: fct_drop() removes unused levels (e.g. after subsetting); otherwise they linger and appear as empty categories in plots.
- id: q6
  question: Which forcats function orders levels by frequency (most common first)?
  options:
    - fct_reorder
    - fct_inorder
    - fct_infreq
    - fct_rev
  correctIndex: 2
  explanation: fct_infreq() orders levels by frequency, most common first; fct_inorder() orders by first appearance in the data; fct_rev() reverses any order.
- id: q7
  question: What does fct_collapse(f, East = c('NYC','Miami')) do?
  options:
    - Splits 'East' into NYC and Miami
    - Drops NYC and Miami
    - Reorders them
    - Combines NYC and Miami into a single 'East' level
  correctIndex: 3
  explanation: fct_collapse() combines multiple existing levels into one new level; useful for grouping small categories or merging variants.
- id: q8
  question: What does fct_relevel(sizes, 'XXL') do?
  options:
    - Moves 'XXL' to the first position (reference level)
    - Removes 'XXL'
    - Renames 'XXL'
    - Reverses around 'XXL'
  correctIndex: 0
  explanation: fct_relevel(f, 'X') moves 'X' to the front (becomes the first level, the regression reference); other levels shift down.
- id: q9
  question: What does fct_anon(patients) do?
  options:
    - Anonymizes the data values
    - Replaces level names with Level1, Level2, ... (preserving groupings)
    - Drops levels
    - Reorders randomly
  correctIndex: 1
  explanation: fct_anon() replaces level names with anonymous labels (Level1, Level2, ...) while preserving the groupings; useful for sharing data without exposing names.
- id: q10
  question: Why does leaving factors in alphabetical order matter for plots?
  options:
    - It doesn't matter
    - It is faster alphabetically
    - Bars/boxplots appear in arbitrary alphabetical order rather than by value, obscuring patterns
    - Alphabetical is required by ggplot2
  correctIndex: 2
  explanation: ggplot2 places levels in level order; alphabetical is usually meaningless. Use fct_reorder() to sort by value so the chart tells a story.
```

