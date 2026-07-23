---
slug: r-getting-started-r-rstudio
id: r-01
track: r
order: 1
title: Getting Started with R and RStudio
description: Install R 4.x and RStudio (Posit), run your first commands in the console, and learn the workspace, packages, and help system that everything else in the track depends on.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug
whyItMatters: Install R 4. x and RStudio (Posit), run your first commands in the console, and learn the workspace, packages, and help system that everything else in the track depends on.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Getting Started with R and RStudio

## Getting Started with R and RStudio

### Why It Matters

Install R 4. x and RStudio (Posit), run your first commands in the console, and learn the workspace, packages, and help system that everything else in the track depends on.

Install R 4.x and RStudio (Posit), run your first commands in the console, and learn the workspace, packages, and help system that everything else in the track depends on.

### Prerequisites

- None — this is the entry point for the R track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing R 4.x from CRAN on macOS, Windows, Linux
- Installing RStudio (Posit) Desktop as the IDE
- R console vs RStudio panels (Source, Console, Environment, Plots, Help)
- Working directory: getwd(), setwd(), and project-root discipline
- R packages: install.packages(), library(), require(), remove.packages()
- Repositories: CRAN, Bioconductor, GitHub via remotes::install_github()
- The help system: ?, ??, help(), vignette(), packageDescription()
- Workspace artifacts: .RData, .Rhistory, .Renviron, and renv for reproducibility

### Key Concepts

- R is the language and interpreter; RStudio is just one IDE that wraps it — you can run R from the terminal too.
- Everything in R is a vector; even a 'scalar' like 42 is a length-1 numeric vector.
- Functions live in packages; install.packages() downloads once, library() loads per session.
- R is case-sensitive: Print() is not print(); — TRUE/TRUE vs T shorthand differ in safety.
- Working directory matters for relative paths; use here::here() with an .Rproj so scripts are portable.

```r
print("Hello, World!")
message("Info line: ", 42)
warning("This is a warning")
```
Caption: Hello World

### Common Pitfalls

- Using the macOS/Linux system R without a version manager — use rig (macOS/Linux) or Posit's installer, and pin a version per project with renv so package upgrades do not silently break old analyses.
- Confusing install.packages() with library() — install.packages() downloads once to the user library; library() loads an installed package each session; forgetting library() is the #1 cause of 'could not find function' errors.
- Calling setwd('/hard/coded/path') inside scripts — breaks the moment anyone else runs the script; use here::here() with an .Rproj file, or the targets package, instead.
- Leaving 'Restore .RData into workspace at startup' enabled — stale state silently contaminates new sessions; turn it off in RStudio > Global Options > General.

### Real-World Applications

- Airbnb runs hundreds of internal R analyses and R Markdown reports per day; its data scientists publish the R-based 'Rarticles' templating system internally for experiment readouts.
- Netflix uses R for causal-inference and A/B test reporting; many product decisions are supported by R Markdown dashboards rendered on a schedule.
- The New York Times data-journalism desk (The Upshot) builds election forecasts and published charts in R; the same R script often produces the graphic that ships online.
- Bioconductor, built on R, is the de-facto platform for high-throughput genomics at the NIH, EMBL-EBI, and 10x Genomics analysis pipelines — thousands of peer-reviewed papers depend on it.

### Interview Questions

- 1. What is the difference between R and RStudio? — R is the language and interpreter; RStudio (Posit) is the IDE that wraps R with editor, debugger, and plotting tools; R runs fine without RStudio.
- 2. What does library() do that install.packages() does not? — install.packages() downloads and stores a package once; library() loads an installed package into the current session.
- 3. What is renv for and when would you use it? — renv snapshots a project's exact package versions to renv.lock so others can restore the identical environment, making analyses reproducible across machines and time.
- 4. Why is setwd() discouraged in scripts? — hard-coded paths break on other machines and in CI; use here::here() with a project .Rproj so paths resolve from the project root.
- 5. Name three help entry points in R. — ?foo for a single function's page, ??keyword for fuzzy search across all packages, and vignette('pkg') for a long-form tutorial.

### Mini Project

Build a Session Info Reporter: A small script that ensures tidyverse is installed (installing if missing), loads it, captures R version, platform, and attached packages with their versions via sessionInfo(), and writes a timestamped .txt report to the working directory. The script should print a friendly message confirming the output path and run cleanly from a fresh R session.
Suggested approach:
  - Use requireNamespace('tidyverse') and conditionally call install.packages()
  - Build a timestamped filename with format(Sys.time(), '%Y%m%d-%H%M%S')
  - Capture output with capture.output(sessionInfo())
  - Write to file with writeLines(..., con = path)
  - Use here::here() if available so the report lands at the project root

### Exercises

1. Install R 4.x and RStudio; verify with R.version.string in the console (should print 4.x).
2. Install the tidyverse and janitor packages; load both and confirm packageVersion('dplyr') prints a recent version.
3. Run ?mean, ??regression, and vignette('dplyr') and compare what each help entry point returns.
4. Create an RStudio Project (.Rproj) in a fresh folder; install here and print here::here() to confirm the project root.
5. Run sessionInfo() and identify which R version, platform, and packages are attached vs loaded.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created R?
9. A) Ross Ihaka and Robert Gentleman (*)
10. B) John Chambers
11. C) Hadley Wickham
12. D) JJ Allaire
13. Explanation: Ross Ihaka and Robert Gentleman created R at the University of Auckland in 1993; it became a GNU project in 1995.
14. Q2: What is RStudio (Posit)?
15. A) A different programming language
16. B) An IDE that wraps the R interpreter (*)
17. C) A package on CRAN
18. D) A fork of S-PLUS
19. Explanation: RStudio is an IDE; R runs fine without it, but RStudio adds editor, debugger, plotting, and project-management tools.
20. Q3: Which function loads an already-installed package into the current session?
21. A) install.packages()
22. B) require_packages()
23. C) library() (*)
24. D) use()
25. Explanation: library() loads an installed package; install.packages() only downloads and stores it on disk.
26. Q4: Which is the canonical repository for general R packages?
27. A) PyPI
28. B) npm
29. C) Conda
30. D) CRAN (*)
31. Explanation: CRAN (Comprehensive R Archive Network) is the primary repository; Bioconductor is the genomics-focused sibling.
32. Q5: What does setwd('/path') do?
33. A) Changes the working directory for the current R session (*)
34. B) Saves the workspace to /path
35. C) Sets the package library path
36. D) Sets the .Renviron variable
37. Explanation: setwd() changes where R reads/writes relative paths; it is discouraged in scripts because it breaks portability.
38. Q6: What problem does the here package solve?
39. A) Vectorized file concatenation
40. B) Project-root-relative paths that work regardless of where R is launched (*)
41. C) Faster package installation
42. D) Console output coloring
43. Explanation: here::here() finds the project root (typically an .Rproj) and builds paths from it, making scripts portable.
44. Q7: Which file marks an RStudio Project root?
45. A) .RData
46. B) .Renviron
47. C) .Rproj (*)
48. D) Makefile
49. Explanation: An .Rproj file marks the project root and stores IDE options; here::here() and renv both key off it.
50. Q8: What does sessionInfo() output?
51. A) Just the R version
52. B) A list of files in the working directory
53. C) The current user's home directory
54. D) R version, platform, attached packages, and loaded namespaces (*)
55. Explanation: sessionInfo() captures the full compute environment — essential for reproducible bug reports and paper supplementary materials.
56. Q9: Which is the recommended way to make an analysis reproducible across machines?
57. A) Use renv to snapshot package versions per project (*)
58. B) Copy your .RData file
59. C) Always install the latest packages on every run
60. D) Hard-code paths with setwd()
61. Explanation: renv records exact package versions in renv.lock so others can restore the identical environment.
62. Q10: Which operator opens the help page for a specific function?
63. A) !
64. B) ? (*)
65. C) #
66. D) ::
67. Explanation: ?function (equivalent to help(function)) opens its help page; ?? searches the help system by keyword.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created R?
  options:
    - Ross Ihaka and Robert Gentleman
    - John Chambers
    - Hadley Wickham
    - JJ Allaire
  correctIndex: 0
  explanation: Ross Ihaka and Robert Gentleman created R at the University of Auckland in 1993; it became a GNU project in 1995.
- id: q2
  question: What is RStudio (Posit)?
  options:
    - A different programming language
    - An IDE that wraps the R interpreter
    - A package on CRAN
    - A fork of S-PLUS
  correctIndex: 1
  explanation: RStudio is an IDE; R runs fine without it, but RStudio adds editor, debugger, plotting, and project-management tools.
- id: q3
  question: Which function loads an already-installed package into the current session?
  options:
    - install.packages()
    - require_packages()
    - library()
    - use()
  correctIndex: 2
  explanation: library() loads an installed package; install.packages() only downloads and stores it on disk.
- id: q4
  question: Which is the canonical repository for general R packages?
  options:
    - PyPI
    - npm
    - Conda
    - CRAN
  correctIndex: 3
  explanation: CRAN (Comprehensive R Archive Network) is the primary repository; Bioconductor is the genomics-focused sibling.
- id: q5
  question: What does setwd('/path') do?
  options:
    - Changes the working directory for the current R session
    - Saves the workspace to /path
    - Sets the package library path
    - Sets the .Renviron variable
  correctIndex: 0
  explanation: setwd() changes where R reads/writes relative paths; it is discouraged in scripts because it breaks portability.
- id: q6
  question: What problem does the here package solve?
  options:
    - Vectorized file concatenation
    - Project-root-relative paths that work regardless of where R is launched
    - Faster package installation
    - Console output coloring
  correctIndex: 1
  explanation: here::here() finds the project root (typically an .Rproj) and builds paths from it, making scripts portable.
- id: q7
  question: Which file marks an RStudio Project root?
  options:
    - .RData
    - .Renviron
    - .Rproj
    - Makefile
  correctIndex: 2
  explanation: An .Rproj file marks the project root and stores IDE options; here::here() and renv both key off it.
- id: q8
  question: What does sessionInfo() output?
  options:
    - Just the R version
    - A list of files in the working directory
    - The current user's home directory
    - R version, platform, attached packages, and loaded namespaces
  correctIndex: 3
  explanation: sessionInfo() captures the full compute environment — essential for reproducible bug reports and paper supplementary materials.
- id: q9
  question: Which is the recommended way to make an analysis reproducible across machines?
  options:
    - Use renv to snapshot package versions per project
    - Copy your .RData file
    - Always install the latest packages on every run
    - Hard-code paths with setwd()
  correctIndex: 0
  explanation: renv records exact package versions in renv.lock so others can restore the identical environment.
- id: q10
  question: Which operator opens the help page for a specific function?
  options:
    - "!"
    - "?"
    - "#"
    - "::"
  correctIndex: 1
  explanation: ?function (equivalent to help(function)) opens its help page; ?? searches the help system by keyword.
```

