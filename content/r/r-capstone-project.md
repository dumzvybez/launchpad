---
slug: r-capstone-project
id: r-capstone
track: r
order: 21
title: "Capstone Project: Build a Customer Churn Analysis & Forecasting Platform..."
description: |-
  Build a Customer Churn Analysis & Forecasting Platform — a production-grade R
    system that ingests customer transaction and engagement data, engineers features,
    trains and evaluates churn-prediction models with tidymodels, forecasts revenue
    with fable, and exposes everything through a Shiny das
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Capstone Project: Build a Customer Churn Analysis & Forecasting Platform...

## Build a Customer Churn Analysis & Forecasting Platform...

Problem statement:
Build a Customer Churn Analysis & Forecasting Platform — a production-grade R
  system that ingests customer transaction and engagement data, engineers features,
  trains and evaluates churn-prediction models with tidymodels, forecasts revenue
  with fable, and exposes everything through a Shiny dashboard and a parameterized
  Quarto report. The system must run as an R package, pass R CMD check with 0
  errors/warnings, ship via a Docker image, run on a schedule with the targets
  package, and be reproducible end-to-end via renv. This project exercises every
  concept from the 20-stage track: tidyverse ingest and wrangling, dplyr + tidyr
  shaping, ggplot2 visualization, purrr many-models, tidymodels training and
  tuning, lubridate time handling, fable forecasting, Shiny interactivity, R
  package engineering, and CI/CD via GitHub Actions.

Target users:
• Customer-success managers who need to see which accounts are at risk of churning this month.
• Revenue-operations analysts who need a reproducible monthly forecast of subscription revenue.
• Data scientists who need a maintained codebase (R package) they can extend with new models.
• Executives who need a parameterized Quarto report per region each month, automatically rendered.

P0 (Must have) requirements:
• Ingest customers.csv, transactions.parquet, and engagement_events.parquet via readr/arrow; define column types explicitly
• Wrangle into a tidy customers-long tibble with dplyr + tidyr: one row per (customer_id, month) with churn flag, MRR, engagement counts
• Feature engineering with dplyr::mutate: tenure months, monthly revenue trend, last-30-day engagement, support tickets opened
• Train/test split with rsample::initial_split(strata = churn); 5-fold CV with vfold_cv()
• Fit logistic_reg, rand_forest (ranger), and xgboost via parsnip; tune mtry/trees with tune_grid(); select_best by roc_auc
• Evaluate on test set with yardstick::conf_mat, roc_auc, sens, spec; produce a calibration plot
• Revenue forecast: tsibble by month, fit ARIMA + ETS with fable, forecast 12 months with 80/95% intervals
• Shiny dashboard: filter by segment, plot churn prob distribution, DT::dataTableOutput of at-risk accounts, forecast autoplot
• R package structure (usethis::create_package) with R/, man/ (roxygen2), tests/ (testthat), vignettes/; DESCRIPTION declares dependencies
• Pass devtools::check() with 0 errors, 0 warnings, 0 notes; GitHub Actions CI runs check + tests on every push

P1 (Should have) requirements:
• Parameterized Quarto report (region, month) rendered automatically via targets pipeline
• renv::snapshot() pins exact package versions in renv.lock for full reproducibility
• Dockerfile based on rocker/r-ver:4.4 with renv restore on build; multi-stage for smaller image
• targets pipeline orchestrates ingest -> wrangle -> features -> fit -> evaluate -> render; runs on schedule via cron or GitHub Actions
• Drift monitoring: compute population stability index (PSI) on top features monthly; alert via Slack webhook if PSI > 0.25
• Model card Quarto doc documenting training data, features, metrics, limitations, and refresh cadence

P2 (Nice to have) requirements:
• Plumber API at /predict that accepts customer JSON and returns churn probability using the trained workflow
• SHAP-based explainability with fastshap or shapviz for the top 50 at-risk accounts
• A/B compare two models in production via stratified sampling; log predictions to a parquet audit log
• Bayesian hierarchical model with brms for per-segment churn with partial pooling
• Interactive cohort retention heatmap (plotly) embedded in the Shiny app
• Automated retraining trigger when PSI > threshold or weekly schedule, with model comparison report

```text
churn-platform/
    .github/
        workflows/
            ci.yml             # R CMD check + testthat + lint
            render.yml         # nightly targets pipeline
    _targets.R                 # targets pipeline definition
    _packages/                 # renv library (gitignored)
    renv.lock                  # pinned package versions
    renv/
        activate.R
    Dockerfile
    docker-compose.yml
    DESCRIPTION
    NAMESPACE                  # auto-generated by roxygen2
    LICENSE
    README.md
    R/
        ingest.R               # read_customers(), read_transactions(), read_engagement()
        wrangle.R              # build_customer_monthly()
        features.R             # add_tenure(), add_engagement_rollups()
        model.R                # fit_churn_models(), tune_churn()
        forecast.R             # fit_revenue_forecast()
        evaluate.R             # evaluate_churn(), make_calibration_plot()
    inst/
        app/
            app.R              # Shiny app
        api/
            plumber.R          # Plumber API
        report/
            report.qmd         # parameterized Quarto report
        extdata/
            customers.csv
            sample_transactions.parquet
    man/                       # auto-generated .Rd files
    vignettes/
        getting-started.Rmd
        model-card.Rmd
    tests/
        testthat/
            test-ingest.R
            test-wrangle.R
            test-features.R
            test-model.R
            test-forecast.R
        testthat.R
```
Caption: Suggested file structure

Tech stack:
• R 4.4+ (latest stable at time of writing)
• tidyverse (dplyr, tidyr, readr, ggplot2, stringr, forcats, lubridate) for wrangling and plotting
• arrow for Parquet I/O of transaction and engagement events (5-50x faster than CSV)
• tidymodels (rsample, recipes, parsnip, workflows, tune, yardstick) for model training and evaluation
• ranger and xgboost engines for random forest and gradient boosting
• tsibble + fable + fabletools for tidy time-series forecasting (ARIMA, ETS)
• purrr + broom for the many-models pattern (per-segment fits)
• Shiny + DT + plotly for the interactive dashboard
• Plumber for the prediction API
• Quarto (via quarto R package) for parameterized reports
• renv for reproducible package environments; rocker/r-ver:4.4 base image for Docker
• targets for pipeline orchestration; GitHub Actions for CI/CD and scheduled renders
• testthat for unit tests; devtools::check() + r-lib/actions for CI; covr for coverage

> **Tip:** Testing strategy:
> - Unit tests with testthat in tests/testthat/ for every exported function in R/: ingest, wrangle, features, model, forecast, evaluate. Cover happy path, edge cases (empty input, all-NA column, single customer, missing month), and error paths.
>   - Integration tests: build a small end-to-end pipeline on 100 customers x 12 months of fixtures and assert that fit_churn_models() returns a workflowset, evaluate_churn() returns a list with conf_mat and final_workflow, and fit_revenue_forecast() returns 12-month forecasts.
>   - Snapshot tests with testthat::expect_snapshot_file() for the rendered Quarto report (one snapshot per region); review diffs in PRs to catch unintended changes.
>   - Coverage target: >=80% line coverage on R/ (95%+ on features.R and forecast.R); enforce via covr::codecov() in CI and a covr::package_coverage() gate in devtools::check().
>   - Run tests with: devtools::test() for unit tests, targets::tar_visnetwork() to inspect the pipeline, and devtools::check() for the full CRAN-style check; the CI workflow runs all three on every push and PR.

> **Tip:** Deployment guide:
> - Deploy the Shiny dashboard to shinyapps.io (free tier OK for demo) or Posit Connect (for enterprise); connect the app to the trained workflow saved as an .rds artifact from the targets pipeline.
>   - Deploy the Plumber API to Posit Connect or a Rocker-based container on Fly.io/Render; expose /predict (POST JSON) and /health (GET) endpoints.
>   - Environment variables to set: CHURN_DATA_PATH (where the targets pipeline reads from), CHURN_MODEL_PATH (where the trained workflow .rds lives), SLACK_WEBHOOK_URL (for drift alerts), SHINYAPPS_SECRET, GITHUB_TOKEN (for nightly CI to commit rendered reports).
>   - Build command: docker build -t churn-platform:latest . (renv restore happens during build; image is reproducible from renv.lock).
>   - Start command (batch): docker run --rm -e CHURN_DATA_PATH=/data churn-platform:latest Rscript -e 'targets::tar_make()'; (Shiny): docker run -p 3838:3838 churn-platform:latest Rscript -e 'shiny::runApp("inst/app", host="0.0.0.0", port=3838)'.
>   - Post-deploy verification: (1) curl https://your-app.shinyapps.io loads the dashboard; (2) the nightly GitHub Action runs targets::tar_make() and commits rendered reports; (3) curl https://api.example.com/health returns 200; (4) a sample /predict POST returns a probability between 0 and 1; (5) the Slack drift-alert channel receives a message only when PSI > 0.25 (verify with a synthetic drift test).
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 features work end-to-end: ingest, wrangle, features, tune 3 models, evaluate on test, forecast 12 months, Shiny dashboard renders, Quarto report renders; correct metrics (roc_auc, RMSE).
>   2. Code quality (20 pts) — Clean R/ package layout; roxygen2 on every exported function; tidyverse style throughout; lintr clean; no sapply; explicit ungroup() and by = on joins; tests use testthat patterns.
>   3. Testing (20 pts) — >=80% line coverage on R/ (95%+ on features.R); integration test runs the full pipeline on 100-customer fixture; snapshot tests on the Quarto report; tests run in <60s in CI.
>   4. Reproducibility (20 pts) — renv.lock pins all packages; Dockerfile builds reproducibly from rocker/r-ver:4.4; targets pipeline caches intermediates; nightly CI renders fresh reports; model card documents training data and limitations.
>   5. Deployment & CI/CD (20 pts) — Shiny app deployed and reachable; Plumber API /health returns 200; GitHub Actions CI green on main; nightly render workflow committed reports; README has setup, run, test, deploy instructions; .env.example documents all env vars.
> 
> Stretch goals:
>   - Add SHAP-based explainability with fastshap or shapviz: per-customer feature attribution for the top 50 at-risk accounts, displayed in the Shiny dashboard.
>   - Add a Bayesian hierarchical model with brms for per-segment churn with partial pooling; compare to the tidymodels gradient-boosted model.
>   - Add a Plumber /predict endpoint that streams predictions for batch scoring via arrow::write_parquet() to an audit log; add a /drift endpoint that returns the latest PSI for top features.
>   - Add A/B model comparison in production: split incoming customers 50/50 between two workflows, log predictions + outcomes to a parquet audit log, compute lift weekly.
>   - Add interactive cohort retention heatmap (plotly) embedded in the Shiny app, with cohorts by signup month and segments.
>   - Add automated retraining: trigger when PSI > 0.25 or on a weekly schedule; render a model-comparison Quarto report and post a Slack message with the diff.
>   - Add an RStudio Connect deployment with scheduled Quarto reports emailed to executives on the first of each month.
>   - Add OpenTelemetry tracing to the Plumber API with spans for the model predict call; export to Honeycomb or Datadog.
>   - Add a vignettes/benchmark.Rmd that benchmarks arrow vs data.table vs dplyr on a 10M-row transaction table and publishes the results to the pkgdown site.

> **Tip:** Stretch goals:
> • Add SHAP-based explainability with fastshap or shapviz: per-customer feature attribution for the top 50 at-risk accounts, displayed in the Shiny dashboard.
> • Add a Bayesian hierarchical model with brms for per-segment churn with partial pooling; compare to the tidymodels gradient-boosted model.
> • Add a Plumber /predict endpoint that streams predictions for batch scoring via arrow::write_parquet() to an audit log; add a /drift endpoint that returns the latest PSI for top features.
> • Add A/B model comparison in production: split incoming customers 50/50 between two workflows, log predictions + outcomes to a parquet audit log, compute lift weekly.
> • Add interactive cohort retention heatmap (plotly) embedded in the Shiny app, with cohorts by signup month and segments.
> • Add automated retraining: trigger when PSI > 0.25 or on a weekly schedule; render a model-comparison Quarto report and post a Slack message with the diff.
> • Add an RStudio Connect deployment with scheduled Quarto reports emailed to executives on the first of each month.
> • Add OpenTelemetry tracing to the Plumber API with spans for the model predict call; export to Honeycomb or Datadog.
> • Add a vignettes/benchmark.Rmd that benchmarks arrow vs data.table vs dplyr on a 10M-row transaction table and publishes the results to the pkgdown site.

