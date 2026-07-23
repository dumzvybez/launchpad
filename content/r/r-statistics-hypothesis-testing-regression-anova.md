---
slug: r-statistics-hypothesis-testing-regression-anova
id: r-17
track: r
order: 17
title: Statistics — Hypothesis Testing, Regression, ANOVA
description: Apply R's classic statistics toolkit — t-tests, chi-square, ANOVA, correlation, linear regression — with attention to assumptions, p-values, and the formula interface.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=5600s
whyItMatters: Apply R's classic statistics toolkit — t-tests, chi-square, ANOVA, correlation, linear regression — with attention to assumptions, p-values, and the formula interface.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Statistics — Hypothesis Testing, Regression, ANOVA

## Statistics — Hypothesis Testing, Regression, ANOVA

### Why It Matters

Apply R's classic statistics toolkit — t-tests, chi-square, ANOVA, correlation, linear regression — with attention to assumptions, p-values, and the formula interface.

Apply R's classic statistics toolkit — t-tests, chi-square, ANOVA, correlation, linear regression — with attention to assumptions, p-values, and the formula interface.

### Prerequisites

- Stage 4: Data Frames and Tibbles
- Stage 9: Data Wrangling with dplyr

### Topics

- t.test(): one-sample, two-sample, paired
- var.test(), wilcox.test(), ks.test() (non-parametric alternatives)
- chisq.test(), fisher.test() for categorical independence
- aov() and TukeyHSD() for ANOVA and post-hoc comparisons
- cor(), cor.test() for Pearson, Spearman, Kendall correlation
- lm() and the formula interface y ~ x + z
- summary.lm() output: coefficients, std.error, t-value, p-value, R-squared
- Assumptions: normality (shapiro.test), homoscedasticity, linearity

### Key Concepts

- The formula interface y ~ x + z + x:z is the standard R model syntax; + adds a main effect, : an interaction, * shorthand for both, - removes a term.
- t.test(x, y, paired = FALSE, var.equal = FALSE, alternative = 'two.sided') tests mean difference; Welch's default (var.equal = FALSE) is safer when variances are unequal.
- lm(y ~ x, data) fits ordinary least squares; summary(lm_fit) prints coefficients with std.error, t-value, p-value, and R-squared; coef(), confint(), predict() extract components.
- aov(y ~ group, data) fits ANOVA; TukeyHSD(aov_fit) gives pairwise post-hoc comparisons with adjusted p-values; check the assumptions (normality, equal variance) before trusting p-values.
- p-values below 0.05 do not prove an effect; check effect sizes (coef/sd), confidence intervals (confint), sample size, and assumptions; pre-register analyses to avoid p-hacking.

```r
library(dplyr)
# Two-sample Welch t-test (default, variances unequal):
t.test(extra ~ group, data = sleep, alternative = "two.sided")
# Paired t-test:
t.test(extra ~ group, data = sleep, paired = TRUE)
# One-sample t-test against mu = 0:
t.test(sleep$extra, mu = 0)
# Non-parametric alternative (no normality assumption):
wilcox.test(extra ~ group, data = sleep)
```
Caption: t-tests

### Common Pitfalls

- Using a paired t-test when samples are independent (or vice versa) — paired tests have much higher power but require matched pairs; check the study design before choosing.
- Trusting p-values without checking assumptions — t-tests assume normality (or large n); ANOVA assumes equal variance across groups; check with shapiro.test() and bartlett.test() before trusting p-values.
- Interpreting R-squared as effect size — a high R-squared does not mean a useful model; check residual plots for non-linearity, heteroscedasticity, and outliers; consider adjusted R-squared for multi-predictor models.
- Multiple-comparison inflation — running many t-tests inflates the family-wise error rate; use TukeyHSD() after ANOVA, or p.adjust(p, method = 'BH') for Benjamini-Hochberg FDR control.
- Confusing correlation with causation — cor.test() shows association, not causation; confounders and reverse causation are real; use causal-inference methods (IV, difference-in-differences) for causal claims.

### Real-World Applications

- Airbnb uses t-tests and chi-square tests in A/B experiment readouts to decide whether a UI change moves booking rate significantly; the team uses Benjamini-Hochberg FDR correction across hundreds of metrics.
- Netflix uses ANOVA + TukeyHSD to compare user engagement across plan tiers (Basic, Standard, Premium), then reports effect sizes alongside p-values to product leadership.
- The New York Times election forecast uses linear regression of poll margins on time-to-election to weight recent polls more heavily, with residual diagnostics published alongside the forecast.
- Bioconductor's limma package (linear models for microarray/RNA-seq) fits lm() per gene with empirical-Bayes variance moderation — the engine of differential-expression analysis for thousands of papers.

### Interview Questions

- 1. What is the difference between a paired and an unpaired t-test? — Paired tests use matched pairs (e.g. before/after the same subject) and have higher power; unpaired tests compare two independent groups; choose based on study design.
- 2. How do you interpret summary(lm_fit) output? — Each coefficient has Estimate, Std. Error, t-value, and p-value; small p (<0.05) suggests the coefficient differs from 0; R-squared shows variance explained; F-statistic tests the overall model.
- 3. What does TukeyHSD() do? — It computes pairwise post-hoc comparisons after ANOVA with family-wise error rate control; it gives adjusted p-values and confidence intervals for each pair of group means.
- 4. What assumptions does linear regression make? — Linearity, independence of residuals, homoscedasticity (constant variance), normality of residuals (for inference), and no perfect multicollinearity; check with residual plots and shapiro.test().
- 5. How do you handle multiple-comparison inflation? — Use TukeyHSD() after ANOVA for pairwise tests, or p.adjust(p, method = 'BH') for Benjamini-Hochberg FDR control across many simultaneous tests.

### Mini Project

Build an A/B Test Analyzer: A function analyze_ab(df, metric, group_col) that takes an experiment-results tibble (with columns treatment assignment and a numeric metric), runs the appropriate test (Welch t-test by default; Mann-Whitney if normality fails), and returns a tibble with: mean_control, mean_treatment, difference, t_stat, p_value, ci_low, ci_high, effect_size_cohens_d, and a verdict (significant/not significant at alpha = 0.05).
Suggested approach:
  - Split into control/treatment vectors with dplyr::filter()
  - Check normality with shapiro.test() on each group; if either fails, fall back to wilcox.test()
  - Run t.test() with var.equal = FALSE (Welch) and extract statistic, p.value, conf.int
  - Compute Cohen's d as (mean_t - mean_c) / pooled_sd
  - Return a one-row tibble with all results and a verdict column using dplyr::if_else(p < 0.05, 'significant', 'not significant')

### Exercises

1. Run a two-sample t-test on the sleep dataset (extra ~ group); compare to the paired version; explain why the paired test is more powerful here.
2. Fit lm(mpg ~ wt + hp, data = mtcars); interpret the coefficients, R-squared, and p-values; check residual plots with plot(fit, which = 1:2).
3. Run aov(Sepal.Length ~ Species, data = iris); follow with TukeyHSD() to identify which species pairs differ significantly.
4. Compute cor() between all numeric columns of mtcars; use corrplot or ggcorrplot to visualize the correlation matrix.
5. Demonstrate multiple-comparison inflation: run 20 t-tests on random data and count how many have p < 0.05; then apply p.adjust(method = 'BH').
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the default variance assumption of t.test()?
9. A) Unequal variances (Welch t) (*)
10. B) Equal variances (Student t)
11. C) No variances needed
12. D) Pooled variances
13. Explanation: R's t.test() defaults to Welch's t-test (var.equal = FALSE), which is safer when variances are unequal; set var.equal = TRUE for the classic Student t-test.
14. Q2: What does the formula y ~ x + z specify in lm()?
15. A) y equals x plus z
16. B) y as a function of x and z (additive main effects) (*)
17. C) An interaction only
18. D) y predicted by x times z
19. Explanation: y ~ x + z fits y as an additive function of x and z (two main effects); x:z adds an interaction; x*z is shorthand for x + z + x:z.
20. Q3: What does TukeyHSD() compute?
21. A) F-statistic for ANOVA
22. B) Residuals of the model
23. C) Pairwise post-hoc comparisons with family-wise error control (*)
24. D) R-squared
25. Explanation: TukeyHSD() gives pairwise comparisons of group means with adjusted p-values and confidence intervals; it controls the family-wise error rate after a significant ANOVA.
26. Q4: Which test is a non-parametric alternative to the two-sample t-test?
27. A) chisq.test()
28. B) fisher.test()
29. C) cor.test()
30. D) wilcox.test() (Mann-Whitney U) (*)
31. Explanation: wilcox.test() (Mann-Whitney U for independent samples, Wilcoxon signed-rank for paired) is the non-parametric alternative when normality fails.
32. Q5: What does R-squared measure?
33. A) The fraction of variance in y explained by the model (*)
34. B) The p-value of the model
35. C) The number of significant predictors
36. D) The standard error of coefficients
37. Explanation: R-squared is the proportion of variance in y explained by the model (0 to 1); adjusted R-squared penalizes for adding predictors that do not improve fit.
38. Q6: Which function tests normality of a vector?
39. A) bartlett.test()
40. B) shapiro.test() (*)
41. C) ks.test()
42. D) cor.test()
43. Explanation: shapiro.test() is the Shapiro-Wilk normality test; bartlett.test() tests equal variances; ks.test() compares two distributions or one to a reference.
44. Q7: What does p.adjust(p, method = 'BH') do?
45. A) Increases p-values to make them significant
46. B) Removes non-significant p-values
47. C) Adjusts p-values to control the false discovery rate (FDR) (*)
48. D) Throws an error
49. Explanation: p.adjust(p, method = 'BH') applies Benjamini-Hochberg FDR correction, controlling the expected proportion of false discoveries among the rejected hypotheses; useful for many simultaneous tests.
50. Q8: What does the plot(fit, which = 2) diagnostic show?
51. A) Residuals vs fitted
52. B) Scale-location
53. C) Cook's distance
54. D) Q-Q plot of residuals (normality check) (*)
55. Explanation: which = 2 is the Q-Q (quantile-quantile) plot of residuals; deviations from the line indicate non-normality; which = 1 is residuals vs fitted (linearity, homoscedasticity).
56. Q9: What does confint(fit, level = 0.95) return?
57. A) 95% confidence intervals for each coefficient (*)
58. B) The coefficients
59. C) The p-values
60. D) The residuals
61. Explanation: confint() returns a matrix of lower and upper bounds for each coefficient at the specified confidence level; intervals crossing 0 suggest non-significance.
62. Q10: Why is cor.test() preferred over cor() for inference?
63. A) It is faster
64. B) It returns a p-value and confidence interval for the correlation (*)
65. C) It handles missing values
66. D) It works on factors
67. Explanation: cor() returns just the point estimate; cor.test() returns the estimate plus a t-statistic, p-value, and confidence interval, allowing inference about whether the true correlation differs from 0.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the default variance assumption of t.test()?
  options:
    - Unequal variances (Welch t)
    - Equal variances (Student t)
    - No variances needed
    - Pooled variances
    - ", which is safer when variances are unequal; set var.equal = TRUE for the classic Student t-test."
  correctIndex: 0
  explanation: R's t.test() defaults to Welch's t-test (var.equal = FALSE), which is safer when variances are unequal; set var.equal = TRUE for the classic Student t-test.
- id: q2
  question: What does the formula y ~ x + z specify in lm()?
  options:
    - y equals x plus z
    - y as a function of x and z (additive main effects)
    - An interaction only
    - y predicted by x times z
  correctIndex: 1
  explanation: y ~ x + z fits y as an additive function of x and z (two main effects); x:z adds an interaction; x*z is shorthand for x + z + x:z.
- id: q3
  question: What does TukeyHSD() compute?
  options:
    - F-statistic for ANOVA
    - Residuals of the model
    - Pairwise post-hoc comparisons with family-wise error control
    - R-squared
  correctIndex: 2
  explanation: TukeyHSD() gives pairwise comparisons of group means with adjusted p-values and confidence intervals; it controls the family-wise error rate after a significant ANOVA.
- id: q4
  question: Which test is a non-parametric alternative to the two-sample t-test?
  options:
    - chisq.test()
    - fisher.test()
    - cor.test()
    - wilcox.test() (Mann-Whitney U)
  correctIndex: 3
  explanation: wilcox.test() (Mann-Whitney U for independent samples, Wilcoxon signed-rank for paired) is the non-parametric alternative when normality fails.
- id: q5
  question: What does R-squared measure?
  options:
    - The fraction of variance in y explained by the model
    - The p-value of the model
    - The number of significant predictors
    - The standard error of coefficients
  correctIndex: 0
  explanation: R-squared is the proportion of variance in y explained by the model (0 to 1); adjusted R-squared penalizes for adding predictors that do not improve fit.
- id: q6
  question: Which function tests normality of a vector?
  options:
    - bartlett.test()
    - shapiro.test()
    - ks.test()
    - cor.test()
  correctIndex: 1
  explanation: shapiro.test() is the Shapiro-Wilk normality test; bartlett.test() tests equal variances; ks.test() compares two distributions or one to a reference.
- id: q7
  question: What does p.adjust(p, method = 'BH') do?
  options:
    - Increases p-values to make them significant
    - Removes non-significant p-values
    - Adjusts p-values to control the false discovery rate (FDR)
    - Throws an error
  correctIndex: 2
  explanation: p.adjust(p, method = 'BH') applies Benjamini-Hochberg FDR correction, controlling the expected proportion of false discoveries among the rejected hypotheses; useful for many simultaneous tests.
- id: q8
  question: What does the plot(fit, which = 2) diagnostic show?
  options:
    - Residuals vs fitted
    - Scale-location
    - Cook's distance
    - Q-Q plot of residuals (normality check)
  correctIndex: 3
  explanation: which = 2 is the Q-Q (quantile-quantile) plot of residuals; deviations from the line indicate non-normality; which = 1 is residuals vs fitted (linearity, homoscedasticity).
- id: q9
  question: What does confint(fit, level = 0.95) return?
  options:
    - 95% confidence intervals for each coefficient
    - The coefficients
    - The p-values
    - The residuals
  correctIndex: 0
  explanation: confint() returns a matrix of lower and upper bounds for each coefficient at the specified confidence level; intervals crossing 0 suggest non-significance.
- id: q10
  question: Why is cor.test() preferred over cor() for inference?
  options:
    - It is faster
    - It returns a p-value and confidence interval for the correlation
    - It handles missing values
    - It works on factors
  correctIndex: 1
  explanation: cor() returns just the point estimate; cor.test() returns the estimate plus a t-statistic, p-value, and confidence interval, allowing inference about whether the true correlation differs from 0.
```

