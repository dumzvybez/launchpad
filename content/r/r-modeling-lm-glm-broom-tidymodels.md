---
slug: r-modeling-lm-glm-broom-tidymodels
id: r-18
track: r
order: 18
title: Modeling — lm, glm, broom, tidymodels
description: Move from classic lm() to generalized linear models (glm), broom for tidying, and the tidymodels framework for reproducible train/test splits, recipes, and tuning.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=5950s
whyItMatters: Move from classic lm() to generalized linear models (glm), broom for tidying, and the tidymodels framework for reproducible train/test splits, recipes, and tuning.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Modeling — lm, glm, broom, tidymodels

## Modeling — lm, glm, broom, tidymodels

### Why It Matters

Move from classic lm() to generalized linear models (glm), broom for tidying, and the tidymodels framework for reproducible train/test splits, recipes, and tuning.

Move from classic lm() to generalized linear models (glm), broom for tidying, and the tidymodels framework for reproducible train/test splits, recipes, and tuning.

### Prerequisites

- Stage 9: Data Wrangling with dplyr
- Stage 17: Statistics — Hypothesis Testing, Regression, ANOVA

### Topics

- lm() refresher: formula, summary, coef, predict
- glm() families: gaussian, binomial (logistic), poisson, Gamma
- broom::tidy(), augment(), glance() for model tidy-up
- tidymodels: rsample (train/test split, vfold_cv), recipes (preprocessing)
- parsnip model specifications; workflows binding recipe + model
- tune + tune_grid() for hyperparameter search
- yardstick for metrics: rmse, mae, accuracy, roc_auc, sens, spec
- Workflowsets and racing for comparing multiple model specs

### Key Concepts

- glm(y ~ x, family = binomial()) fits logistic regression for binary outcomes; predict(type = 'response') gives probabilities; family = poisson() for counts; family = Gamma() for positive continuous.
- broom::tidy(fit) returns a tibble of coefficients (term, estimate, std.error, statistic, p.value); augment(fit) adds fitted values, residuals, and cooksd to the original data; glance(fit) returns one-row model summary (r.squared, AIC, etc.).
- tidymodels separates concerns: rsample (data splits), recipes (preprocessing), parsnip (model spec), workflows (binding recipe + model), tune (hyperparameters), yardstick (metrics).
- Always split into train/test with rsample::initial_split() before fitting; resample with vfold_cv(v = 10) for cross-validation; never tune on the test set.
- yardstick metrics: rmse/mae for regression, accuracy/roc_auc for classification; roc_auc is preferred over accuracy for imbalanced binary problems; collect_metrics() summarizes CV results.

```r
fit <- glm(am ~ wt + hp, data = mtcars, family = binomial())
summary(fit)
# Predicted probabilities:
mtcars$prob <- predict(fit, type = "response")
mtcars$pred <- ifelse(mtcars$prob > 0.5, 1, 0)
# Confusion matrix:
table(truth = mtcars$am, pred = mtcars$pred)
# Poisson regression for counts:
fit_p <- glm(count ~ day, data = warpbreaks, family = poisson())
```
Caption: Logistic regression with glm

### Common Pitfalls

- Tuning hyperparameters on the test set — always split train/test first, tune via cross-validation on train, evaluate once on test; otherwise you leak test data into model selection.
- Using predict() on a logistic glm without type = 'response' — default returns log-odds (linear predictor), not probabilities; use type = 'response' for probabilities.
- Forgetting to stratify the train/test split — initial_split(strata = outcome) preserves class balance; without it, a rare class may be entirely in test or train.
- Comparing models by training accuracy — in-sample accuracy is optimistic; use cross-validated metrics (collect_metrics on tune_res) or out-of-sample metrics on the test set.
- Mixing base R's predict() with tidymodels workflows — workflows use predict(workflow, new_data); the input must be a tibble/data frame, not a formula or vector; check argument names.

### Real-World Applications

- Airbnb uses tidymodels to train listing-price regressions; recipes handle preprocessing (normalization, missing-value imputation) reproducibly across many model variants.
- Netflix uses logistic GLMs and gradient-boosted models in tidymodels for churn prediction; yardstick's roc_auc is the canonical metric, not accuracy (churn is rare, so accuracy is misleading).
- The New York Times election forecast uses Bayesian model averaging (via the tidybayes + brms ecosystem) over many polling models, with broom::tidy() to extract posterior summaries for publication.
- Bioconductor's glm() per gene with limma-voom is the workhorse for RNA-seq differential expression; the same GLM machinery tidied with broom powers thousands of biology papers.

### Interview Questions

- 1. What is the difference between lm() and glm()? — lm() fits Gaussian (continuous) OLS; glm() generalizes to other families (binomial for logistic, poisson for counts, Gamma for positive continuous) via a link function.
- 2. What does broom::tidy(), augment(), and glance() each return? — tidy() returns a tibble of coefficients; augment() returns the original data plus fitted values, residuals, and cooksd; glance() returns a one-row model summary (r.squared, AIC, etc.).
- 3. Why should you split train/test before tuning hyperparameters? — To prevent test data leaking into model selection; tune via cross-validation on train, evaluate once on the held-out test set; tuning on test overfits to test idiosyncrasies.
- 4. What does predict(glm_fit, type = 'response') return for a logistic glm? — Probabilities (between 0 and 1); without type = 'response', predict() returns log-odds (the linear predictor).
- 5. What are the core tidymodels packages and their roles? — rsample (splits/CV), recipes (preprocessing), parsnip (model spec), workflows (binding recipe + model), tune (hyperparameter search), yardstick (metrics), tune + workflows for end-to-end pipelines.

### Mini Project

Build a Titanic Survival Classifier: A tidymodels pipeline that loads the Titanic dataset, splits train/test stratified by Survived, builds a recipe (impute Age, normalize Fare, encode Sex and Pclass as factors), fits a logistic regression and a random forest with 5-fold CV, picks the better model by roc_auc, evaluates on the test set, and outputs a confusion matrix plus a ROC curve plot.
Suggested approach:
  - Use rsample::initial_split(strata = Survived) for the split
  - Build a recipe with step_impute_median(Age), step_normalize(Fare), step_string2factor(Sex, Pclass)
  - Define logistic_reg() and rand_forest() specs with parsnip
  - Tune via workflowsets + tune_grid() on 5-fold CV; select_best(metric = 'roc_auc')
  - Fit the final model with last_fit() and report conf_mat + roc_curve + autoplot()

### Exercises

1. Fit glm(am ~ wt + hp, family = binomial()) on mtcars; predict probabilities; compute a confusion matrix and accuracy at threshold 0.5.
2. Use broom::tidy() and glance() on a lm() fit; identify which tibbles contain coefficients vs model summary.
3. Build a tidymodels pipeline for iris classification: initial_split, recipe with step_normalize(), logistic_reg, workflow, fit, predict on test, compute accuracy.
4. Add 5-fold cross-validation to the iris pipeline with vfold_cv(); tune mtry in rand_forest(); select_best by accuracy.
5. Use yardstick::roc_curve() and autoplot() to draw a ROC curve for a binary classifier; compute roc_auc with roc_auc() metric.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does glm(..., family = binomial()) fit?
9. A) Linear regression
10. B) Logistic regression for binary outcomes (*)
11. C) Poisson regression for counts
12. D) ANOVA
13. Explanation: family = binomial() with a glm() fits logistic regression for binary outcomes; family = poisson() for counts; family = Gamma() for positive continuous.
14. Q2: What does predict(glm_fit, type = 'response') return for logistic regression?
15. A) Log-odds (linear predictor)
16. B) Coefficients
17. C) Probabilities (between 0 and 1) (*)
18. D) Residuals
19. Explanation: type = 'response' returns probabilities (inverse-link applied); without it, predict() returns log-odds (the linear predictor).
20. Q3: What does broom::tidy(fit) return?
21. A) A one-row model summary
22. B) The original data with residuals
23. C) A list of fitted values
24. D) A tibble of coefficients (term, estimate, std.error, statistic, p.value) (*)
25. Explanation: tidy() returns a tibble of coefficients; glance() returns a one-row summary; augment() returns original data plus .fitted, .resid, .cooksd.
26. Q4: Why use initial_split(strata = outcome)?
27. A) It preserves the class balance in both train and test sets (*)
28. B) It speeds up the split
29. C) It sorts the data
30. D) It removes missing values
31. Explanation: strata = outcome ensures both train and test have roughly the same proportion of each outcome class; critical for imbalanced classification where a rare class could end up entirely in one split.
32. Q5: Which tidymodels package handles preprocessing (imputation, normalization, encoding)?
33. A) parsnip
34. B) recipes (*)
35. C) rsample
36. D) yardstick
37. Explanation: recipes defines preprocessing as a sequence of step_*() calls (step_impute_median, step_normalize, step_string2factor); parsnip is the model spec; rsample splits; yardstick metrics.
38. Q6: What is the role of workflows in tidymodels?
39. A) They store predictions
40. B) They tune hyperparameters
41. C) They bind a recipe and a model spec into one object (*)
42. D) They compute metrics
43. Explanation: workflow() bundles a recipe + parsnip model spec into a single object that can be fit, tuned, and predicted with one consistent interface; this decouples preprocessing from the model.
44. Q7: Why is roc_auc often preferred over accuracy for binary classification?
45. A) It is faster to compute
46. B) It is required by tidymodels
47. C) It always gives higher numbers
48. D) It is threshold-independent and works well on imbalanced data (*)
49. Explanation: roc_auc summarizes the ROC curve across all thresholds, so it is robust to class imbalance and threshold choice; accuracy at a single threshold can be misleading when one class dominates.
50. Q8: What does tune_grid() do?
51. A) Tunes hyperparameters via cross-validation over a grid of values (*)
52. B) Splits the data
53. C) Computes metrics on the test set
54. D) Trains the final model
55. Explanation: tune_grid(workflow, resamples = folds, grid = ...) evaluates the workflow across a grid of hyperparameter values on CV folds; collect_metrics() summarizes the results.
56. Q9: What does yardstick::conf_mat() return?
57. A) A tibble of metrics
58. B) A confusion matrix object (truth x estimate) with summary methods (*)
59. C) A ROC curve
60. D) AUC value
61. Explanation: conf_mat(pred, truth, estimate) returns a confusion matrix object with summary(conf_mat) giving accuracy, sensitivity, specificity, etc.; autoplot() draws a heatmap.
62. Q10: What does last_fit() do in tidymodels?
63. A) Reverts to the previous fit
64. B) Tunes hyperparameters
65. C) Fits the finalized workflow on the full training split and evaluates once on the test split (*)
66. D) Computes cross-validation
67. Explanation: last_fit(final_workflow, split) trains on the training portion of the initial split and evaluates once on the test portion; collect_metrics() and collect_predictions() extract results.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does glm(..., family = binomial()) fit?
  options:
    - Linear regression
    - Logistic regression for binary outcomes
    - Poisson regression for counts
    - ANOVA
  correctIndex: 1
  explanation: family = binomial() with a glm() fits logistic regression for binary outcomes; family = poisson() for counts; family = Gamma() for positive continuous.
- id: q2
  question: What does predict(glm_fit, type = 'response') return for logistic regression?
  options:
    - Log-odds (linear predictor)
    - Coefficients
    - Probabilities (between 0 and 1)
    - Residuals
  correctIndex: 2
  explanation: type = 'response' returns probabilities (inverse-link applied); without it, predict() returns log-odds (the linear predictor).
- id: q3
  question: What does broom::tidy(fit) return?
  options:
    - A one-row model summary
    - The original data with residuals
    - A list of fitted values
    - A tibble of coefficients (term, estimate, std.error, statistic, p.value)
  correctIndex: 3
  explanation: tidy() returns a tibble of coefficients; glance() returns a one-row summary; augment() returns original data plus .fitted, .resid, .cooksd.
- id: q4
  question: Why use initial_split(strata = outcome)?
  options:
    - It preserves the class balance in both train and test sets
    - It speeds up the split
    - It sorts the data
    - It removes missing values
  correctIndex: 0
  explanation: strata = outcome ensures both train and test have roughly the same proportion of each outcome class; critical for imbalanced classification where a rare class could end up entirely in one split.
- id: q5
  question: Which tidymodels package handles preprocessing (imputation, normalization, encoding)?
  options:
    - parsnip
    - recipes
    - rsample
    - yardstick
  correctIndex: 1
  explanation: recipes defines preprocessing as a sequence of step_*() calls (step_impute_median, step_normalize, step_string2factor); parsnip is the model spec; rsample splits; yardstick metrics.
- id: q6
  question: What is the role of workflows in tidymodels?
  options:
    - They store predictions
    - They tune hyperparameters
    - They bind a recipe and a model spec into one object
    - They compute metrics
  correctIndex: 2
  explanation: workflow() bundles a recipe + parsnip model spec into a single object that can be fit, tuned, and predicted with one consistent interface; this decouples preprocessing from the model.
- id: q7
  question: Why is roc_auc often preferred over accuracy for binary classification?
  options:
    - It is faster to compute
    - It is required by tidymodels
    - It always gives higher numbers
    - It is threshold-independent and works well on imbalanced data
  correctIndex: 3
  explanation: roc_auc summarizes the ROC curve across all thresholds, so it is robust to class imbalance and threshold choice; accuracy at a single threshold can be misleading when one class dominates.
- id: q8
  question: What does tune_grid() do?
  options:
    - Tunes hyperparameters via cross-validation over a grid of values
    - Splits the data
    - Computes metrics on the test set
    - Trains the final model
  correctIndex: 0
  explanation: tune_grid(workflow, resamples = folds, grid = ...) evaluates the workflow across a grid of hyperparameter values on CV folds; collect_metrics() summarizes the results.
- id: q9
  question: What does yardstick::conf_mat() return?
  options:
    - A tibble of metrics
    - A confusion matrix object (truth x estimate) with summary methods
    - A ROC curve
    - AUC value
  correctIndex: 1
  explanation: conf_mat(pred, truth, estimate) returns a confusion matrix object with summary(conf_mat) giving accuracy, sensitivity, specificity, etc.; autoplot() draws a heatmap.
- id: q10
  question: What does last_fit() do in tidymodels?
  options:
    - Reverts to the previous fit
    - Tunes hyperparameters
    - Fits the finalized workflow on the full training split and evaluates once on the test split
    - Computes cross-validation
  correctIndex: 2
  explanation: last_fit(final_workflow, split) trains on the training portion of the initial split and evaluates once on the test portion; collect_metrics() and collect_predictions() extract results.
```

