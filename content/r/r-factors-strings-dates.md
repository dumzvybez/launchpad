---
slug: r-factors-strings-dates
id: r-05
track: r
order: 5
title: Factors, Strings, and Dates
description: Work with R's three most error-prone scalar-ish types — factors (categorical data), strings, and dates/times — covering the legacy traps and the modern tidyverse replacements.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=1400s
whyItMatters: Work with R's three most error-prone scalar-ish types — factors (categorical data), strings, and dates/times — covering the legacy traps and the modern tidyverse replacements.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Factors, Strings, and Dates

## Factors, Strings, and Dates

### Why It Matters

Work with R's three most error-prone scalar-ish types — factors (categorical data), strings, and dates/times — covering the legacy traps and the modern tidyverse replacements.

Work with R's three most error-prone scalar-ish types — factors (categorical data), strings, and dates/times — covering the legacy traps and the modern tidyverse replacements.

### Prerequisites

- Stage 2: Variables, Vectors, and Atomic Types
- Stage 4: Data Frames and Tibbles

### Topics

- factor(), levels, labels, ordered factors
- table(), levels(), nlevels(), relevel(), droplevels()
- Strings: paste(), paste0(), sprintf(), nchar(), substr(), strsplit()
- Case conversion: tolower(), toupper(), chartr()
- Date class vs POSIXct vs POSIXlt
- Sys.Date(), Sys.time(), as.Date(), as.POSIXct()
- Date arithmetic, difftime(), seq() for dates
- Time zones: with_tz(), force_tz() (lubridate preview)

### Key Concepts

- A factor is an integer vector with a levels attribute; the integer codes are 1-based and ordered by levels; many plotting and modeling functions silently treat character columns as factors.
- Order of levels matters for plotting (left-to-right) and for contrasts in regression (the first level is the reference); relevel() or forcats::fct_relevel() change the reference.
- Strings in base R use paste() (with sep= and collapse=) and sprintf() (C-style formatting); stringr (Stage 13) is more consistent.
- Date is days-since-1970; POSIXct is seconds-since-1970 with a tzone attribute; POSIXlt is a list of components (sec, min, hour, mday, mon, year) — use POSIXct for storage.
- Date arithmetic uses difftime() and as.numeric(..., units = 'days'); seq(as.Date('2024-01-01'), as.Date('2024-12-31'), by = 'month') generates a sequence.

```r
sizes <- factor(c('S','M','L','M','S'), levels = c('S','M','L'))
table(sizes)               # S M L 
                           # 2 2 1
levels(sizes)              # 'S' 'M' 'L'
order <- factor(c('S','M','L'), levels = c('S','M','L'), ordered = TRUE)
order[1] < order[2]        # TRUE (ordered comparison)
relevel(sizes, ref = 'L')  # L is now the first level (regression reference)
droplevels(sizes[sizes != 'L'])  # drops unused 'L' level
```
Caption: Factors

### Common Pitfalls

- Forgetting that c() coerces a factor to its underlying integer codes — c(factor('a'), 'b') yields c('1','b'), not c('a','b'); wrap with as.character() first.
- Letting factor levels leak after subsetting — f[f != 'high'] keeps 'high' as a level even though no rows have it; call droplevels() or use forcats::fct_drop() to remove it.
- Mixing Date and POSIXct in arithmetic — adding 1 to a Date advances one day, but adding 1 to POSIXct advances one second; coerce with as.Date() or use lubridate::days(1).
- Trusting locale-dependent format() output — format(Sys.Date(), '%B') gives 'January' or 'enero' depending on the user's locale; for reproducible reports, set Sys.setlocale() explicitly or use lubridate::month(label = TRUE, locale = 'C').
- Using cbind() on factors and character columns — cbind() coerces to a matrix and then to character; use dplyr::bind_cols() or tibble::tibble() to preserve types.

### Real-World Applications

- Airbnb uses ordered factors for listing categories (Entire home > Private room > Shared room) so that regression models use the right reference level and plots present categories in a fixed order.
- Netflix's experimentation platform uses POSIXct with explicit time zones (America/Los_Angeles for product; UTC for storage) to avoid the 'experiment started at midnight PDT or PST?' ambiguity.
- The New York Times election forecast stores poll dates as Date and uses lubridate for time-decay weighting (recent polls count more).
- Bioconductor's GenomicRanges uses ordered factor-like run-length-encoded (Rle) vectors for chromosome and strand — millions of values stored in a few levels.

### Interview Questions

- 1. What is a factor under the hood? — An integer vector with a levels attribute; the integers are 1-based codes into the levels character vector.
- 2. Why does c(factor('a'), 'b') return c('1', 'b')? — c() on a factor extracts the underlying integer codes and coerces to character; wrap the factor with as.character() first.
- 3. What is the difference between Date and POSIXct? — Date is days since 1970-01-01 with no time-of-day or timezone; POSIXct is seconds since 1970-01-01 with an optional tzone attribute.
- 4. How do you change the reference level of a factor for regression? — Use relevel(f, ref = 'new_ref') or forcats::fct_relevel(f, 'new_ref'); the first level becomes the intercept.
- 5. Why is format(Sys.Date(), '%B') not reproducible across machines? — It depends on the user's locale; use lubridate::month(label = TRUE, locale = 'C') or set Sys.setlocale() explicitly.

### Mini Project

Build a Date-Range Aggregator: A function summarize_dates(dates, by = 'month') that takes a vector of date strings or Date objects, parses them safely (handling NA and bad strings), and returns a tibble with one row per period containing n_events, first_date, last_date, and span_days. The function should support 'day', 'week', 'month', and 'year' groupings and work correctly across daylight-saving transitions.
Suggested approach:
  - Parse with as.Date() (or lubridate::ymd() for ISO strings), keeping NA for bad inputs
  - Truncate to the requested period with lubridate::floor_date() or base cut()
  - Group with dplyr::group_by() and summarise() with n(), min(), max()
  - Compute span_days with as.numeric(difftime(max, min, units = 'days'))
  - Return a tibble sorted by period and test with a vector spanning a DST transition

### Exercises

1. Create an ordered factor for shirt sizes (S < M < L < XL); verify that 'S' < 'L' returns TRUE; subset and use droplevels() to remove unused levels.
2. Use paste(), paste0(), and sprintf() to build the strings 'Ada-95', 'Linus-88', and 'Grace-91' from a small tibble; explain when each function is appropriate.
3. Convert '2024-03-15 14:30:00' to POSIXct with tz='UTC'; use format() to extract the year, month name, and weekday; convert to America/New_York with lubridate::with_tz().
4. Generate a sequence of monthly dates from 2024-01-01 to 2024-12-01 with seq(); compute the number of days between each consecutive pair.
5. Demonstrate the c(factor) pitfall: c(factor('a'), 'b') and explain the result; fix it with as.character().
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a factor under the hood?
9. A) An integer vector with a levels attribute (*)
10. B) A character vector with attributes
11. C) A special kind of list
12. D) A data frame column type only
13. Explanation: A factor is an integer vector (1-based codes) with a 'levels' character attribute; this is why c(factor) extracts integers.
14. Q2: What does c(factor('a'), 'b') return?
15. A) c('a', 'b')
16. B) c('1', 'b') (*)
17. C) c(1, 'b')
18. D) An error
19. Explanation: c() on a factor extracts the underlying integer codes and coerces to character; wrap with as.character() first.
20. Q3: Which function removes unused factor levels after subsetting?
21. A) drop()
22. B) rm.levels()
23. C) droplevels() (*)
24. D) factor() always drops them
25. Explanation: droplevels() (or forcats::fct_drop()) removes unused levels; factor(f) preserves them.
26. Q4: What is the difference between Date and POSIXct?
27. A) They are identical
28. B) Date is for past; POSIXct is for future
29. C) POSIXct is deprecated
30. D) Date is days-since-1970 with no time or tz; POSIXct is seconds-since-1970 with optional tz (*)
31. Explanation: Date has day resolution and no timezone; POSIXct has second resolution and a tzone attribute; adding 1 advances a day vs a second respectively.
32. Q5: What does adding 1 to a POSIXct object do?
33. A) Adds 1 second (*)
34. B) Adds 1 day
35. C) Adds 1 millisecond
36. D) Throws an error
37. Explanation: POSIXct is seconds since 1970; adding 1 advances one second; use lubridate::days(1) or + 86400 to advance a day.
38. Q6: Which base function joins strings with a separator?
39. A) join()
40. B) paste(..., sep = '-') (*)
41. C) concat()
42. D) glue()
43. Explanation: paste(..., sep = '-') joins with a separator; paste0() has no separator; glue() is a tidyverse package for {expr} interpolation.
44. Q7: Why is format(Sys.Date(), '%B') not reproducible across machines?
45. A) %B is not a valid format token
46. B) format() is deprecated
47. C) It depends on the user's locale (*)
48. D) It always returns English
49. Explanation: %B gives the full month name in the user's locale; set Sys.setlocale() or use lubridate::month(label = TRUE, locale = 'C') for reproducibility.
50. Q8: Which function changes the reference level of a factor for regression?
51. A) reorder()
52. B) refactor()
53. C) factor(ref = )
54. D) relevel() (*)
55. Explanation: relevel(f, ref = 'L') makes 'L' the first level (the regression intercept); forcats::fct_relevel() is the tidyverse equivalent.
56. Q9: What does seq(as.Date('2024-01-01'), as.Date('2024-04-01'), by = 'month') return?
57. A) A vector of 4 monthly dates: Jan 1, Feb 1, Mar 1, Apr 1 (*)
58. B) A single date
59. C) An error
60. D) Every day between
61. Explanation: seq() with by = 'month' generates one date per month from start to end inclusive.
62. Q10: What is the safest way to parse ISO date strings like '2024-03-15'?
63. A) as.POSIXct() always
64. B) as.Date() (*)
65. C) as.numeric()
66. D) c() then unlist()
67. Explanation: as.Date() parses ISO 8601 dates natively; for non-ISO formats use lubridate::mdy(), dmy(), etc.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a factor under the hood?
  options:
    - An integer vector with a levels attribute
    - A character vector with attributes
    - A special kind of list
    - A data frame column type only
  correctIndex: 0
  explanation: A factor is an integer vector (1-based codes) with a 'levels' character attribute; this is why c(factor) extracts integers.
- id: q2
  question: What does c(factor('a'), 'b') return?
  options:
    - c('a', 'b')
    - c('1', 'b')
    - c(1, 'b')
    - An error
  correctIndex: 1
  explanation: c() on a factor extracts the underlying integer codes and coerces to character; wrap with as.character() first.
- id: q3
  question: Which function removes unused factor levels after subsetting?
  options:
    - drop()
    - rm.levels()
    - droplevels()
    - factor() always drops them
  correctIndex: 2
  explanation: droplevels() (or forcats::fct_drop()) removes unused levels; factor(f) preserves them.
- id: q4
  question: What is the difference between Date and POSIXct?
  options:
    - They are identical
    - Date is for past; POSIXct is for future
    - POSIXct is deprecated
    - Date is days-since-1970 with no time or tz; POSIXct is seconds-since-1970 with optional tz
  correctIndex: 3
  explanation: Date has day resolution and no timezone; POSIXct has second resolution and a tzone attribute; adding 1 advances a day vs a second respectively.
- id: q5
  question: What does adding 1 to a POSIXct object do?
  options:
    - Adds 1 second
    - Adds 1 day
    - Adds 1 millisecond
    - Throws an error
  correctIndex: 0
  explanation: POSIXct is seconds since 1970; adding 1 advances one second; use lubridate::days(1) or + 86400 to advance a day.
- id: q6
  question: Which base function joins strings with a separator?
  options:
    - join()
    - paste(..., sep = '-')
    - concat()
    - glue()
  correctIndex: 1
  explanation: paste(..., sep = '-') joins with a separator; paste0() has no separator; glue() is a tidyverse package for {expr} interpolation.
- id: q7
  question: Why is format(Sys.Date(), '%B') not reproducible across machines?
  options:
    - "%B is not a valid format token"
    - format() is deprecated
    - It depends on the user's locale
    - It always returns English
  correctIndex: 2
  explanation: "%B gives the full month name in the user's locale; set Sys.setlocale() or use lubridate::month(label = TRUE, locale = 'C') for reproducibility."
- id: q8
  question: Which function changes the reference level of a factor for regression?
  options:
    - reorder()
    - refactor()
    - factor(ref = )
    - relevel()
  correctIndex: 3
  explanation: relevel(f, ref = 'L') makes 'L' the first level (the regression intercept); forcats::fct_relevel() is the tidyverse equivalent.
- id: q9
  question: What does seq(as.Date('2024-01-01'), as.Date('2024-04-01'), by = 'month') return?
  options:
    - "A vector of 4 monthly dates: Jan 1, Feb 1, Mar 1, Apr 1"
    - A single date
    - An error
    - Every day between
  correctIndex: 0
  explanation: seq() with by = 'month' generates one date per month from start to end inclusive.
- id: q10
  question: What is the safest way to parse ISO date strings like '2024-03-15'?
  options:
    - as.POSIXct() always
    - as.Date()
    - as.numeric()
    - c() then unlist()
  correctIndex: 1
  explanation: as.Date() parses ISO 8601 dates natively; for non-ISO formats use lubridate::mdy(), dmy(), etc.
```

