---
slug: r-importing-data-readr-readxl-haven
id: r-11
track: r
order: 11
title: Importing Data — readr, readxl, haven
description: Read CSVs, Excel workbooks, SAS/SPSS/Stata files, and other tabular formats with the modern tidyverse readers — faster, stricter, and more type-aware than base R.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=3500s
whyItMatters: Read CSVs, Excel workbooks, SAS/SPSS/Stata files, and other tabular formats with the modern tidyverse readers — faster, stricter, and more type-aware than base R.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Importing Data — readr, readxl, haven

## Importing Data — readr, readxl, haven

### Why It Matters

Read CSVs, Excel workbooks, SAS/SPSS/Stata files, and other tabular formats with the modern tidyverse readers — faster, stricter, and more type-aware than base R.

Read CSVs, Excel workbooks, SAS/SPSS/Stata files, and other tabular formats with the modern tidyverse readers — faster, stricter, and more type-aware than base R.

### Prerequisites

- Stage 4: Data Frames and Tibbles
- Stage 9: Data Wrangling with dplyr

### Topics

- readr::read_csv() vs base read.csv()
- Column type specification: col_integer, col_double, col_character, col_date, col_factor
- readxl::read_xlsx(), read_excel(), excel_sheets()
- haven::read_sas(), read_sav(), read_dta() (SAS/SPSS/Stata)
- vroom() for fast multi-file reads and lazy loading
- data.table::fread() (preview — the speed king)
- write_csv(), write_rds(), write_parquet() for outputs
- readRDS()/saveRDS() vs qs::qsave() for serialized R objects

### Key Concepts

- readr returns tibbles, parses column types eagerly (with a guess), and reports parsing problems; base read.csv() returns a data frame, guesses types silently, and is 5-20x slower on large files.
- Always specify col_types explicitly for production code — readr's guess can change with the data, breaking downstream code that assumes a fixed schema.
- haven reads SAS/SPSS/Stata with their native missing-value sentinels (SAS NA, SPSS sysmis, Stata .) and tags them so you can detect provenance; use haven::zap_missing() to drop the tag.
- vroom() reads lazily — it indexes the file first and only materializes columns on access; great for huge files where you only need a subset.
- write_rds() serializes any R object; write_parquet() (via arrow) writes columnar Parquet — 5-50x smaller and faster to read than CSV for analytical workloads.

```r
library(readr)
sales <- read_csv("sales.csv", col_types = cols(
  id       = col_integer(),
  date     = col_date("%Y-%m-%d"),
  amount   = col_double(),
  region   = col_factor(levels = c("NA","EMEA","APAC","LATAM")),
  notes    = col_character()
))
problems(sales)          # show rows that failed to parse
stopifnot(nrow(problems(sales)) == 0)
```
Caption: read_csv with explicit types

### Common Pitfalls

- Letting readr guess column types — a row with all-missing values can flip a column from integer to logical, silently breaking downstream code; always specify col_types in production.
- Forgetting that read_csv() returns a tibble, not a data.frame — most code is fine, but legacy code that relies on drop = TRUE subsetting or stringsAsFactors will behave differently.
- Reading Excel files without checking sheets — readxl reads only the first sheet by default; use excel_sheets() to enumerate and read the correct one explicitly.
- Confusing haven's tagged NA with base NA — haven preserves SAS/SPSS missing-value codes (e.g. .A, .B) as 'tagged NA' that look like NA but are distinct; use haven::zap_missing() or is.na() to normalize.
- Using saveRDS() for data other R users may not have packages for — .rds preserves R objects but requires the same R version and packages on read; for portable exchange use Parquet or CSV.

### Real-World Applications

- Airbnb uses readr and arrow (Parquet) to load billion-row booking snapshots for ad-hoc analysis; CSV is used only for small cross-team exports.
- Netflix's experimentation platform ingests SAS exports from legacy survey tools via haven, normalizes them, and feeds them to tidymodels for cohort analysis.
- The New York Times data desk uses readxl to ingest monthly Excel reports from external partners (AP, Reuters) before transforming to long format with tidyr.
- Bioconductor's readxl + haven bridge is used by pharma companies to import clinical trial data (SAS) into R for FDA submissions.

### Interview Questions

- 1. What are the advantages of readr::read_csv() over base read.csv()? — readr is 5-20x faster, returns a tibble, parses types eagerly, reports parsing problems, and supports explicit col_types.
- 2. Why should you specify col_types explicitly in production code? — readr's type guess can change with the data (e.g. all-missing column flips to logical), breaking downstream code that assumes a fixed schema.
- 3. What does haven::zap_missing() do? — It converts haven's tagged NAs (preserved SAS/SPSS missing codes like .A, .B) to base R NA so downstream code sees a single NA sentinel.
- 4. How does vroom() differ from read_csv()? — vroom() indexes the file lazily and only materializes columns on access; great for huge files where you only need a subset of columns.
- 5. When would you choose Parquet over CSV for output? — Parquet is columnar, 5-50x smaller, and 5-50x faster to read for analytical workloads; CSV is text, portable, and human-readable but slow.

### Mini Project

Build a Multi-Format Data Loader: A function load_any(path) that inspects a file extension (.csv, .xlsx, .sas7bdat, .sav, .dta, .parquet) and dispatches to the right reader (readr, readxl, haven, arrow), returning a tibble with a consistent schema (column names lowercased, types guessed but logged). It should log the source file, row count, column count, and any parsing problems to a sidecar .log file.
Suggested approach:
  - Switch on tools::file_ext(path) to dispatch to read_csv/read_xlsx/read_sas/read_parquet/etc.
  - Coerce the result to a tibble with tibble::as_tibble()
  - Lowercase column names with janitor::clean_names() or tolower(names(df))
  - Capture parsing problems with readr::problems() when applicable
  - Write a log file at paste0(path, '.log') with readr::write_lines()

### Exercises

1. Read a CSV with read_csv() and read.csv(); compare class, column types, and read time on a 100k-row file with system.time().
2. Use col_types to force a column to col_factor with explicit levels; verify with class() and levels().
3. Use readxl::excel_sheets() to list sheets in an .xlsx file, then read each into a list of tibbles with purrr::map().
4. Read a SAS file with haven::read_sas(); inspect tagged NAs with haven::is_tagged_na(); zap them with zap_missing().
5. Write a 1M-row tibble to CSV, RDS, and Parquet; compare file sizes and read times with system.time().
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does readr::read_csv() return by default?
9. A) A data.frame
10. B) A list
11. C) A tibble (*)
12. D) A matrix
13. Explanation: read_csv() returns a tibble (tbl_df) with type-stable column parsing and a compact print method.
14. Q2: Why should you specify col_types in production code?
15. A) It is faster
16. B) It is required by R CMD check
17. C) It enables parallelism
18. D) It locks the schema so a data change can't silently flip a column's type (*)
19. Explanation: readr's type guess can change with the data (e.g. all-missing column flips to logical); explicit col_types locks the schema and surfaces data changes as errors.
20. Q3: Which function lists sheets in an Excel workbook?
21. A) excel_sheets() (*)
22. B) list_sheets()
23. C) sheets()
24. D) read_xlsx(sheets = TRUE)
25. Explanation: readxl::excel_sheets('file.xlsx') returns a character vector of sheet names; pass one to read_xlsx(sheet = ...).
26. Q4: What does haven::zap_missing() do?
27. A) Removes all rows with NA
28. B) Converts haven's tagged NAs (SAS .A, SPSS sysmis) to base R NA (*)
29. C) Deletes missing columns
30. D) Throws on missing values
31. Explanation: haven preserves SAS/SPSS missing-value codes as 'tagged NA' (distinct from base NA); zap_missing() normalizes them to base NA.
32. Q5: Which is the fastest format for analytical reads of large data in R?
33. A) CSV
34. B) RDS
35. C) Parquet (columnar) (*)
36. D) TSV
37. Explanation: Parquet is columnar and compressed; reading only the needed columns is 5-50x faster than CSV; arrow::read_parquet() is the standard reader.
38. Q6: What does readr::problems(df) return?
39. A) A list of all rows
40. B) An error count
41. C) A warning log
42. D) A tibble of rows that failed to parse, with row, col, expected, actual (*)
43. Explanation: problems() returns a tibble showing where parsing failed, including row, column, expected type, and actual value; check it after every read_csv().
44. Q7: What is vroom's main advantage over read_csv()?
45. A) It reads lazily, materializing columns only on access (great for huge files) (*)
46. B) It is always faster
47. C) It parses types more strictly
48. D) It is the only one that returns tibbles
49. Explanation: vroom() indexes the file up front and only reads columns on demand; great for huge files where you use a subset of columns.
50. Q8: Which haven function reads a Stata .dta file?
51. A) read_stata()
52. B) read_dta() (*)
53. C) read_spss() (with .dta extension)
54. D) import_dta()
55. Explanation: haven::read_dta('file.dta') reads Stata files; haven also has read_sas() and read_sav() for SAS and SPSS.
56. Q9: What is the difference between saveRDS() and write_parquet()?
57. A) saveRDS() is faster
58. B) They are identical
59. C) saveRDS() serializes any R object (R-version specific); write_parquet() writes portable columnar data (*)
60. D) write_parquet() requires PostgreSQL
61. Explanation: saveRDS() is for any R object but requires compatible R version + packages; write_parquet() is portable columnar storage, readable by Python, Spark, DuckDB, etc.
62. Q10: Which base R function does readr::read_csv() replace?
63. A) read.table()
64. B) load()
65. C) scan()
66. D) read.csv() (*)
67. Explanation: read_csv() replaces read.csv(); it is faster, returns a tibble, and reports parsing problems. read_tsv() replaces read.delim().
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does readr::read_csv() return by default?
  options:
    - A data.frame
    - A list
    - A tibble
    - A matrix
  correctIndex: 2
  explanation: read_csv() returns a tibble (tbl_df) with type-stable column parsing and a compact print method.
- id: q2
  question: Why should you specify col_types in production code?
  options:
    - It is faster
    - It is required by R CMD check
    - It enables parallelism
    - It locks the schema so a data change can't silently flip a column's type
  correctIndex: 3
  explanation: readr's type guess can change with the data (e.g. all-missing column flips to logical); explicit col_types locks the schema and surfaces data changes as errors.
- id: q3
  question: Which function lists sheets in an Excel workbook?
  options:
    - excel_sheets()
    - list_sheets()
    - sheets()
    - read_xlsx(sheets = TRUE)
  correctIndex: 0
  explanation: readxl::excel_sheets('file.xlsx') returns a character vector of sheet names; pass one to read_xlsx(sheet = ...).
- id: q4
  question: What does haven::zap_missing() do?
  options:
    - Removes all rows with NA
    - Converts haven's tagged NAs (SAS .A, SPSS sysmis) to base R NA
    - Deletes missing columns
    - Throws on missing values
    - ; zap_missing() normalizes them to base NA.
  correctIndex: 1
  explanation: haven preserves SAS/SPSS missing-value codes as 'tagged NA' (distinct from base NA); zap_missing() normalizes them to base NA.
- id: q5
  question: Which is the fastest format for analytical reads of large data in R?
  options:
    - CSV
    - RDS
    - Parquet (columnar)
    - TSV
  correctIndex: 2
  explanation: Parquet is columnar and compressed; reading only the needed columns is 5-50x faster than CSV; arrow::read_parquet() is the standard reader.
- id: q6
  question: What does readr::problems(df) return?
  options:
    - A list of all rows
    - An error count
    - A warning log
    - A tibble of rows that failed to parse, with row, col, expected, actual
  correctIndex: 3
  explanation: problems() returns a tibble showing where parsing failed, including row, column, expected type, and actual value; check it after every read_csv().
- id: q7
  question: What is vroom's main advantage over read_csv()?
  options:
    - It reads lazily, materializing columns only on access (great for huge files)
    - It is always faster
    - It parses types more strictly
    - It is the only one that returns tibbles
  correctIndex: 0
  explanation: vroom() indexes the file up front and only reads columns on demand; great for huge files where you use a subset of columns.
- id: q8
  question: Which haven function reads a Stata .dta file?
  options:
    - read_stata()
    - read_dta()
    - read_spss() (with .dta extension)
    - import_dta()
  correctIndex: 1
  explanation: haven::read_dta('file.dta') reads Stata files; haven also has read_sas() and read_sav() for SAS and SPSS.
- id: q9
  question: What is the difference between saveRDS() and write_parquet()?
  options:
    - saveRDS() is faster
    - They are identical
    - saveRDS() serializes any R object (R-version specific); write_parquet() writes portable columnar data
    - write_parquet() requires PostgreSQL
  correctIndex: 2
  explanation: saveRDS() is for any R object but requires compatible R version + packages; write_parquet() is portable columnar storage, readable by Python, Spark, DuckDB, etc.
- id: q10
  question: Which base R function does readr::read_csv() replace?
  options:
    - read.table()
    - load()
    - scan()
    - read.csv()
  correctIndex: 3
  explanation: read_csv() replaces read.csv(); it is faster, returns a tibble, and reports parsing problems. read_tsv() replaces read.delim().
```

