---
slug: r-base-plotting-ggplot2-fundamentals
id: r-08
track: r
order: 8
title: Base Plotting and ggplot2 Fundamentals
description: Visualize data with base R's plotting functions and with ggplot2's layered grammar of graphics — the foundation of nearly every published R chart.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=2450s
whyItMatters: Visualize data with base R's plotting functions and with ggplot2's layered grammar of graphics — the foundation of nearly every published R chart.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Base Plotting and ggplot2 Fundamentals

## Base Plotting and ggplot2 Fundamentals

### Why It Matters

Visualize data with base R's plotting functions and with ggplot2's layered grammar of graphics — the foundation of nearly every published R chart.

Visualize data with base R's plotting functions and with ggplot2's layered grammar of graphics — the foundation of nearly every published R chart.

### Prerequisites

- Stage 4: Data Frames and Tibbles
- Stage 6: Control Flow — Conditionals and Loops

### Topics

- Base R: plot(), hist(), boxplot(), barplot(), scatterplot matrix
- par(mfrow, mfcol) for multi-panel layouts
- Graphical parameters: pch, lty, col, lwd, cex, xlab, ylab, main
- ggplot2 grammar: data, aes(), geoms, scales, facets, themes, coords
- Common geoms: geom_point, geom_line, geom_bar, geom_histogram, geom_boxplot
- Faceting with facet_wrap() and facet_grid()
- Saving with ggsave() vs dev.off() (base)
- Themes: theme_minimal(), theme_bw(), theme(), ggthemes packages

### Key Concepts

- Base R plotting is imperative and stateful — each command adds to the current device; ggplot2 is declarative and layered — you build up a plot object with +.
- ggplot2's aes() maps data columns to visual properties (x, y, color, size, shape); geoms (geom_*) decide how to draw; facets split into panels; scales customize axes and legends.
- Bar charts: geom_bar() counts discrete values; geom_col() uses pre-computed heights; mixing them up is a common bug.
- ggsave() infers format from file extension (.png, .pdf, .svg) and respects the current plot size; for reproducibility, set width, height, and dpi explicitly.
- Themes control everything non-data (gridlines, fonts, legend position); theme_minimal() and theme_bw() are good starting points; theme() lets you override any element.

```r
par(mfrow = c(1, 2))             # two panels side by side
hist(mtcars$mpg, breaks = 10, col = "steelblue",
     xlab = "MPG", main = "Distribution of MPG")
boxplot(mpg ~ cyl, data = mtcars, col = "tomato",
        xlab = "Cylinders", ylab = "MPG", main = "MPG by Cylinders")
par(mfrow = c(1, 1))             # reset
```
Caption: Base R plotting

### Common Pitfalls

- Forgetting dev.off() after png()/pdf() in base R — the file stays open and corrupted; ggplot2's ggsave() sidesteps this entirely and is the safer choice.
- Using geom_bar() when you have pre-summarized heights — geom_bar() counts; geom_col() uses the y aesthetic directly; the wrong choice gives a 1-bar chart at count = n.
- Mapping a categorical variable to color without factor() — ggplot2 coerces to factor but warns; explicitly factor() to control the level order and legend labels.
- Putting color = outside aes() — color = 'blue' outside aes() sets a fixed color for all points; color = var inside aes() maps var to the color scale.
- Calling print(p) inside a loop or function — ggplot objects only render when printed; in scripts this happens automatically, but inside loops/functions you must call print(p) explicitly or save with ggsave().

### Real-World Applications

- The BBC's data-journalism graphics cookbook (bbplot) is built on ggplot2; their published charts ship with a custom theme matching BBC brand guidelines.
- The New York Times election night charts are produced with ggplot2 and a custom theme; RStudio Connect renders them on a schedule as returns arrive.
- Airbnb uses ggplot2 for internal EDA dashboards; their style guide mandates theme_minimal() and a fixed palette across teams for consistency.
- Bioconductor's ComplexHeatmap and ggplot2 (via ggbio / ggpubr) power thousands of genomics figures in published cancer-research papers.

### Interview Questions

- 1. What is the 'grammar of graphics' that ggplot2 implements? — A layered system where plots are built from data, aesthetic mappings, geometric objects, scales, facets, coordinates, and themes; each layer can be added or modified independently.
- 2. What is the difference between geom_bar() and geom_col()? — geom_bar() counts rows per x (no y aesthetic); geom_col() uses pre-computed heights from the y aesthetic.
- 3. Why do you need to call print(p) on a ggplot object inside a function or loop? — Auto-printing only happens at the top level of an R script; inside functions/loops the object is returned without rendering unless explicitly printed.
- 4. What does aes() do vs setting color outside aes()? — aes() maps a data column to a visual property (legend created); setting color outside aes() fixes it for all points (no legend).
- 5. How would you save a ggplot to a 300 DPI PNG that is 6x4 inches? — ggsave('plot.png', plot = p, width = 6, height = 4, dpi = 300); ggsave infers format from the file extension.

### Mini Project

Build an EDA Plot Generator: A function eda_plots(df, target) that takes a data frame and a target column name, then produces (1) a histogram of the target, (2) a boxplot of the target by a categorical column, (3) a scatterplot of the target vs the most-correlated numeric column, and (4) saves all three to a single multi-panel PDF with ggsave() or patchwork::wrap_plots().
Suggested approach:
  - Use purrr::keep(is.numeric) to find numeric columns for correlation
  - Compute correlations with cor(df[target], df[numeric_cols], use = 'complete.obs')
  - Use patchwork::wrap_plots(p1, p2, p3, ncol = 1) to combine ggplot objects
  - Save with ggsave('eda.pdf', plot = combined, width = 8, height = 12)
  - Return the patchwork object invisibly so callers can further customize

### Exercises

1. Create a base R scatterplot of mtcars$wt vs mtcars$mpg with color by cyl; add a legend with legend(); save with png()/dev.off().
2. Re-create the same scatterplot in ggplot2; add geom_smooth(method = 'lm'); customize with labs() and theme_minimal().
3. Use facet_wrap(~ class) on the mpg dataset to make a panel per car class; experiment with scales = 'free_x' vs 'fixed'.
4. Demonstrate the geom_bar() vs geom_col() distinction: count mtcars by cyl with geom_bar(), then compute counts with dplyr::count() and plot with geom_col().
5. Build a custom theme with theme() that hides the legend, increases font size to 14, and uses Helvetica; apply it to a ggplot of your choice.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is TRUE about base R vs ggplot2?
9. A) Base R is declarative; ggplot2 is imperative
10. B) They are identical in style
11. C) ggplot2 is built on base R plotting
12. D) Base R is imperative and stateful; ggplot2 is declarative and layered (*)
13. Explanation: Base R adds commands to a stateful device; ggplot2 builds a plot object declaratively by adding layers with +.
14. Q2: What does geom_bar() do by default?
15. A) Counts the number of rows for each x value (*)
16. B) Plots pre-computed heights from y
17. C) Stacks bars by a fill variable
18. D) Plots a horizontal bar
19. Explanation: geom_bar() counts rows per x (stat = 'count'); geom_col() uses pre-computed heights from the y aesthetic (stat = 'identity').
20. Q3: What must you call after png() in base R?
21. A) close()
22. B) dev.off() (*)
23. C) save()
24. D) stop()
25. Explanation: dev.off() closes the device and flushes the file; forgetting it leaves the file corrupted. ggsave() handles this automatically.
26. Q4: Why must you call print(p) on a ggplot object inside a function?
27. A) ggplot objects are not printable by default
28. B) It speeds up rendering
29. C) Auto-printing only happens at the top level of a script (*)
30. D) It applies the theme
31. Explanation: At the top level, R auto-prints the last expression; inside functions/loops, you must call print(p) explicitly to render the plot.
32. Q5: What does color = 'blue' outside aes() do?
33. A) Maps 'blue' as a data column to a color scale
34. B) Throws an error
35. C) Creates a legend with 'blue'
36. D) Sets a fixed color for all points (no legend) (*)
37. Explanation: Outside aes(), color is a fixed aesthetic for all points; inside aes(), color maps a data column to a scale and creates a legend.
38. Q6: Which facet function splits by ONE variable into a ribbon of panels?
39. A) facet_wrap() (*)
40. B) facet_grid()
41. C) facet_row()
42. D) split_by()
43. Explanation: facet_wrap(~ var) wraps panels into a ribbon; facet_grid(row ~ col) creates a 2-D grid of panels.
44. Q7: What does ggsave() infer from the file extension?
45. A) The plot size
46. B) The output format (PNG, PDF, SVG) (*)
47. C) The theme
48. D) The color palette
49. Explanation: ggsave('p.png') writes PNG, 'p.pdf' writes PDF, 'p.svg' writes SVG; width, height, and dpi are explicit args.
50. Q8: Which theme is a good minimalist default?
51. A) theme_gray() (the default)
52. B) theme_void()
53. C) theme_minimal() (*)
54. D) theme_dark()
55. Explanation: theme_minimal() removes the gray background and gridlines for a cleaner look; theme_gray() is the heavy default; theme_void() removes everything (good for maps).
56. Q9: What does scale_color_brewer(palette = 'Set2') do?
57. A) Sets a fixed color
58. B) Inverts the color order
59. C) Sets the font size
60. D) Applies a ColorBrewer palette to a discrete color scale (*)
61. Explanation: scale_color_brewer() applies a ColorBrewer palette to discrete data; scale_fill_brewer() is the equivalent for fill (bars, ribbons).
62. Q10: What is aes() used for?
63. A) Mapping data columns to visual properties (*)
64. B) Setting fixed colors
65. C) Saving plots
66. D) Setting the plot title
67. Explanation: aes() maps data columns to visual properties (x, y, color, size, shape); fixed values for all points go outside aes().
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is TRUE about base R vs ggplot2?
  options:
    - Base R is declarative; ggplot2 is imperative
    - They are identical in style
    - ggplot2 is built on base R plotting
    - Base R is imperative and stateful; ggplot2 is declarative and layered
  correctIndex: 3
  explanation: Base R adds commands to a stateful device; ggplot2 builds a plot object declaratively by adding layers with +.
- id: q2
  question: What does geom_bar() do by default?
  options:
    - Counts the number of rows for each x value
    - Plots pre-computed heights from y
    - Stacks bars by a fill variable
    - Plots a horizontal bar
  correctIndex: 0
  explanation: geom_bar() counts rows per x (stat = 'count'); geom_col() uses pre-computed heights from the y aesthetic (stat = 'identity').
- id: q3
  question: What must you call after png() in base R?
  options:
    - close()
    - dev.off()
    - save()
    - stop()
  correctIndex: 1
  explanation: dev.off() closes the device and flushes the file; forgetting it leaves the file corrupted. ggsave() handles this automatically.
- id: q4
  question: Why must you call print(p) on a ggplot object inside a function?
  options:
    - ggplot objects are not printable by default
    - It speeds up rendering
    - Auto-printing only happens at the top level of a script
    - It applies the theme
  correctIndex: 2
  explanation: At the top level, R auto-prints the last expression; inside functions/loops, you must call print(p) explicitly to render the plot.
- id: q5
  question: What does color = 'blue' outside aes() do?
  options:
    - Maps 'blue' as a data column to a color scale
    - Throws an error
    - Creates a legend with 'blue'
    - Sets a fixed color for all points (no legend)
  correctIndex: 3
  explanation: Outside aes(), color is a fixed aesthetic for all points; inside aes(), color maps a data column to a scale and creates a legend.
- id: q6
  question: Which facet function splits by ONE variable into a ribbon of panels?
  options:
    - facet_wrap()
    - facet_grid()
    - facet_row()
    - split_by()
  correctIndex: 0
  explanation: facet_wrap(~ var) wraps panels into a ribbon; facet_grid(row ~ col) creates a 2-D grid of panels.
- id: q7
  question: What does ggsave() infer from the file extension?
  options:
    - The plot size
    - The output format (PNG, PDF, SVG)
    - The theme
    - The color palette
  correctIndex: 1
  explanation: ggsave('p.png') writes PNG, 'p.pdf' writes PDF, 'p.svg' writes SVG; width, height, and dpi are explicit args.
- id: q8
  question: Which theme is a good minimalist default?
  options:
    - theme_gray() (the default)
    - theme_void()
    - theme_minimal()
    - theme_dark()
  correctIndex: 2
  explanation: theme_minimal() removes the gray background and gridlines for a cleaner look; theme_gray() is the heavy default; theme_void() removes everything (good for maps).
- id: q9
  question: What does scale_color_brewer(palette = 'Set2') do?
  options:
    - Sets a fixed color
    - Inverts the color order
    - Sets the font size
    - Applies a ColorBrewer palette to a discrete color scale
  correctIndex: 3
  explanation: scale_color_brewer() applies a ColorBrewer palette to discrete data; scale_fill_brewer() is the equivalent for fill (bars, ribbons).
- id: q10
  question: What is aes() used for?
  options:
    - Mapping data columns to visual properties
    - Setting fixed colors
    - Saving plots
    - Setting the plot title
  correctIndex: 0
  explanation: aes() maps data columns to visual properties (x, y, color, size, shape); fixed values for all points go outside aes().
```

