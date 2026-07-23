---
slug: r-r-markdown-quarto-reproducible-reports
id: r-15
track: r
order: 15
title: R Markdown, Quarto, and Reproducible Reports
description: Author reproducible reports, dashboards, papers, and slide decks with R Markdown and Quarto — mixing prose, code, plots, and tables in one source document that renders to HTML, PDF, Word, and more.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=4900s
whyItMatters: Author reproducible reports, dashboards, papers, and slide decks with R Markdown and Quarto — mixing prose, code, plots, and tables in one source document that renders to HTML, PDF, Word, and more.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# R Markdown, Quarto, and Reproducible Reports

## R Markdown, Quarto, and Reproducible Reports

### Why It Matters

Author reproducible reports, dashboards, papers, and slide decks with R Markdown and Quarto — mixing prose, code, plots, and tables in one source document that renders to HTML, PDF, Word, and more.

Author reproducible reports, dashboards, papers, and slide decks with R Markdown and Quarto — mixing prose, code, plots, and tables in one source document that renders to HTML, PDF, Word, and more.

### Prerequisites

- Stage 8: Base Plotting and ggplot2 Fundamentals
- Stage 9: Data Wrangling with dplyr

### Topics

- R Markdown (.Rmd) structure: YAML header, prose, code chunks
- knitr chunk options: echo, eval, warning, message, include, fig.width
- Chunk labels and caching: cache = TRUE, dependson
- Inline R code with `r expr`
- Quarto (.qmd) differences: no chunk braces needed, native Python/Julia support
- Output formats: html_document, pdf_document, word_document, ioslides, beamer
- Parameterized reports with params: in YAML
- Cross-references, citations, footnotes, tables with knitr::kable() and gt

### Key Concepts

- An Rmd file is Markdown with R chunks; knitr executes the chunks, knits the results into Markdown, then pandoc renders to HTML/PDF/Word — one source, many outputs.
- Chunk options control behavior: echo=FALSE hides code, eval=FALSE skips execution, warning=FALSE/message=FALSE suppress, fig.cap= adds a caption, cache=TRUE caches results.
- Quarto is the successor to R Markdown: same .qmd syntax (with subtle differences), no chunk-brace syntax (use #| tags), native multi-language support (Python, Julia, Observable), and better cross-references.
- Parameterized reports: declare params: in YAML, access via params$xxx inside chunks; render with rmarkdown::render('report.Rmd', params = list(year = 2024)) to loop over many parameter sets.
- Reproducibility: set seed in the first chunk (set.seed(42)), pin package versions with renv, declare the compute environment with a Dockerfile or DESCRIPTION file, and run on a schedule via RStudio Connect or GitHub Actions.

```markdown
---
title: "Sales Report"
author: "Data Team"
date: "`r format(Sys.Date(), '%B %d, %Y')`"
output: html_document
---

## Overview

Total sales in 2024 were `r sum(sales2024$total)`.
```
Caption: Minimal R Markdown

### Common Pitfalls

- Forgetting set.seed() in the first chunk — random sampling (train/test splits, MCMC, random forests) becomes unreproducible; set a fixed seed and pin it in the setup chunk.
- Mixing chunk options syntaxes between R Markdown and Quarto — Rmd uses ```{r label, opt=val}; Quarto uses ```{r} with #| label: and #| opt: val lines below; mixing them silently fails.
- Caching without dependson — cache=TRUE saves results; if upstream data changes but the chunk code does not, the cached result is reused silently; always set dependson to upstream chunk labels.
- Embedding hard-coded paths in chunks — breaks when the report is rendered on another machine or in CI; use here::here() and parameterize via params.
- Using inline `r expr` that returns a vector — inline R must return a length-1 atomic value; if it returns a vector, knitting fails or prints ugly output; wrap with format() or paste().

### Real-World Applications

- Airbnb's data scientists write experiment readouts as parameterized R Markdown reports rendered automatically for each A/B test via RStudio Connect.
- Netflix renders weekly content-performance reports as Quarto dashboards that combine R, Python (for ML inference), and SQL in one document.
- The New York Times election model publishes its methodology as an R Markdown document, with the actual forecast code visible for transparency.
- Bioconductor vignettes are R Markdown documents that ship with every package, doubling as user tutorials and continuous-integration tests (R CMD check builds them).

### Interview Questions

- 1. What are the three components of an R Markdown document? — YAML header (metadata + output format), Markdown prose (text), and R code chunks (executable code) — knitr runs chunks, pandoc renders to HTML/PDF/Word.
- 2. What is the difference between echo=FALSE and include=FALSE? — echo=FALSE hides the code but shows output (plots, tables); include=FALSE hides both code and output but still runs the chunk (useful for setup).
- 3. How do you make a report reproducible across machines? — Set a fixed seed, pin package versions with renv, use here::here() for paths, parameterize with params, and document the compute environment (Dockerfile or DESCRIPTION).
- 4. What is parameterized reporting and when would you use it? — Declare params in YAML, access via params$xxx in chunks; render with rmarkdown::render() looping over many parameter sets to produce one report per region/cohort/month.
- 5. How does Quarto differ from R Markdown? — Quarto uses #| tag syntax (no chunk-brace options), supports Python/Julia/Observable natively, has better cross-references, and is the active development path; R Markdown is stable but feature-frozen.

### Mini Project

Build a Parameterized Sales Report: A Quarto (.qmd) report that takes params (region, start_date, end_date), reads a CSV of sales, filters to the region and date range, and produces: (1) a summary table with knitr::kable(), (2) a monthly trend line chart with ggplot2, (3) a top-5 products bar chart, and (4) inline R sentences summarizing the results. Render it for 3 different regions and verify each output is correct.
Suggested approach:
  - Declare params: region, start_date, end_date in YAML
  - Read CSV with readr::read_csv() and filter with dplyr::filter()
  - Build the summary table with dplyr::summarise() and knitr::kable(caption = ...)
  - Build ggplot2 charts withlabs(title = glue::glue('Sales for {params$region}'))
  - Render with quarto::quarto_render() in a loop over the regions

### Exercises

1. Create a minimal R Markdown (.Rmd) file with a YAML header, one prose section, and one R chunk that prints summary(mtcars); render to HTML.
2. Set knitr chunk options in a setup chunk: echo=FALSE, warning=FALSE, message=FALSE, set.seed(42); verify they apply to all subsequent chunks.
3. Add an inline R sentence that reports the mean of mtcars$mpg with 2 decimal places using format().
4. Convert your .Rmd to .qmd: change chunk options to #| tags, change output: html_document to format: html; verify it renders with quarto::quarto_render().
5. Parameterize your report with year: 2024 in YAML; render two versions (2023, 2024) with rmarkdown::render(params = list(year = 2023)).
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does knitr do in an R Markdown document?
9. A) Renders HTML
10. B) Converts Markdown to PDF
11. C) Executes R chunks and weaves results into Markdown (*)
12. D) Manages packages
13. Explanation: knitr executes R chunks, captures output (text, plots, tables), and weaves them into a Markdown document; pandoc then renders Markdown to HTML/PDF/Word.
14. Q2: What is the difference between echo=FALSE and include=FALSE?
15. A) They are identical
16. B) echo=FALSE hides both; include=FALSE hides code only
17. C) include=FALSE skips execution
18. D) echo=FALSE hides code but shows output; include=FALSE hides both but still runs (*)
19. Explanation: echo=FALSE hides the source code but shows output (plots, tables); include=FALSE hides both code and output but still runs the chunk (useful for setup or side effects).
20. Q3: Which chunk option suppresses warnings and messages?
21. A) warning=FALSE, message=FALSE (*)
22. B) silent=TRUE
23. C) quiet=TRUE
24. D) verbose=FALSE
25. Explanation: warning=FALSE and message=FALSE suppress those streams; set them globally with knitr::opts_chunk$set() in a setup chunk.
26. Q4: What does cache=TRUE do?
27. A) Deletes the chunk output
28. B) Stores the chunk output for reuse on subsequent renders (*)
29. C) Disables execution
30. D) Saves to a database
31. Explanation: cache=TRUE saves chunk outputs to disk; on subsequent renders, the chunk is skipped and the cached results are loaded — use dependson to invalidate when upstream changes.
32. Q5: How do you access a parameter declared in YAML inside a chunk?
33. A) yaml$param
34. B) options$param
35. C) params$param_name (*)
36. D) config$param
37. Explanation: Parameters declared in YAML are accessed via params$xxx inside chunks; render with rmarkdown::render(params = list(...)) to override.
38. Q6: What does Quarto use for chunk options?
39. A) Brace options like {r label, opt=val}
40. B) YAML inside the chunk
41. C) No chunk options are supported
42. D) #| tag lines below the chunk fence (*)
43. Explanation: Quarto uses #| tag lines (e.g. #| label: fig-x, #| echo: false) below the chunk fence, replacing the brace syntax of R Markdown.
44. Q7: Which function renders an R Markdown file programmatically?
45. A) rmarkdown::render() (*)
46. B) knit()
47. C) pandoc::convert()
48. D) quarto::build()
49. Explanation: rmarkdown::render('report.Rmd') renders to the default output; pass output_file and params to customize. For Quarto use quarto::quarto_render().
50. Q8: What is the rule for inline R code `r expr`?
51. A) It must return a vector
52. B) It must return a length-1 atomic value (scalar) (*)
53. C) It cannot call functions
54. D) It must use cat()
55. Explanation: Inline R returns text into the prose; if it returns a vector, knitting fails or prints ugly output. Wrap with format(), round(), or paste() to guarantee a single value.
56. Q9: Why must you set set.seed() in a reproducible report?
57. A) It speeds up rendering
58. B) It is required by knitr
59. C) Random sampling (train/test splits, MCMC, random forests) becomes reproducible across renders (*)
60. D) It disables caching
61. Explanation: set.seed(42) (or any fixed seed) makes random operations reproducible across renders and machines; otherwise results differ on each knit.
62. Q10: What does dependson='setup' do on a cached chunk?
63. A) Disables caching
64. B) Sorts the chunks
65. C) Throws an error
66. D) Makes the chunk depend on the setup chunk (invalidates cache when setup changes) (*)
67. Explanation: dependson links a cached chunk to upstream chunk labels; when those chunks change, this chunk's cache is invalidated and it re-runs. Without dependson, stale cached results silently persist.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does knitr do in an R Markdown document?
  options:
    - Renders HTML
    - Converts Markdown to PDF
    - Executes R chunks and weaves results into Markdown
    - Manages packages
  correctIndex: 2
  explanation: knitr executes R chunks, captures output (text, plots, tables), and weaves them into a Markdown document; pandoc then renders Markdown to HTML/PDF/Word.
- id: q2
  question: What is the difference between echo=FALSE and include=FALSE?
  options:
    - They are identical
    - echo=FALSE hides both; include=FALSE hides code only
    - include=FALSE skips execution
    - echo=FALSE hides code but shows output; include=FALSE hides both but still runs
  correctIndex: 3
  explanation: echo=FALSE hides the source code but shows output (plots, tables); include=FALSE hides both code and output but still runs the chunk (useful for setup or side effects).
- id: q3
  question: Which chunk option suppresses warnings and messages?
  options:
    - warning=FALSE, message=FALSE
    - silent=TRUE
    - quiet=TRUE
    - verbose=FALSE
  correctIndex: 0
  explanation: warning=FALSE and message=FALSE suppress those streams; set them globally with knitr::opts_chunk$set() in a setup chunk.
- id: q4
  question: What does cache=TRUE do?
  options:
    - Deletes the chunk output
    - Stores the chunk output for reuse on subsequent renders
    - Disables execution
    - Saves to a database
  correctIndex: 1
  explanation: cache=TRUE saves chunk outputs to disk; on subsequent renders, the chunk is skipped and the cached results are loaded — use dependson to invalidate when upstream changes.
- id: q5
  question: How do you access a parameter declared in YAML inside a chunk?
  options:
    - yaml$param
    - options$param
    - params$param_name
    - config$param
  correctIndex: 2
  explanation: Parameters declared in YAML are accessed via params$xxx inside chunks; render with rmarkdown::render(params = list(...)) to override.
- id: q6
  question: What does Quarto use for chunk options?
  options:
    - Brace options like {r label, opt=val}
    - YAML inside the chunk
    - No chunk options are supported
    - "#| tag lines below the chunk fence"
  correctIndex: 3
  explanation: "Quarto uses #| tag lines (e.g. #| label: fig-x, #| echo: false) below the chunk fence, replacing the brace syntax of R Markdown."
- id: q7
  question: Which function renders an R Markdown file programmatically?
  options:
    - rmarkdown::render()
    - knit()
    - pandoc::convert()
    - quarto::build()
  correctIndex: 0
  explanation: rmarkdown::render('report.Rmd') renders to the default output; pass output_file and params to customize. For Quarto use quarto::quarto_render().
- id: q8
  question: What is the rule for inline R code `r expr`?
  options:
    - It must return a vector
    - It must return a length-1 atomic value (scalar)
    - It cannot call functions
    - It must use cat()
  correctIndex: 1
  explanation: Inline R returns text into the prose; if it returns a vector, knitting fails or prints ugly output. Wrap with format(), round(), or paste() to guarantee a single value.
- id: q9
  question: Why must you set set.seed() in a reproducible report?
  options:
    - It speeds up rendering
    - It is required by knitr
    - Random sampling (train/test splits, MCMC, random forests) becomes reproducible across renders
    - It disables caching
  correctIndex: 2
  explanation: set.seed(42) (or any fixed seed) makes random operations reproducible across renders and machines; otherwise results differ on each knit.
- id: q10
  question: What does dependson='setup' do on a cached chunk?
  options:
    - Disables caching
    - Sorts the chunks
    - Throws an error
    - Makes the chunk depend on the setup chunk (invalidates cache when setup changes)
  correctIndex: 3
  explanation: dependson links a cached chunk to upstream chunk labels; when those chunks change, this chunk's cache is invalidated and it re-runs. Without dependson, stale cached results silently persist.
```

