---
slug: r-time-series-forecasting-lubridate
id: r-19
track: r
order: 19
title: Time Series, Forecasting, and lubridate
description: Manipulate dates and times with lubridate, model time series with stats::ts and the tidyverts ecosystem (tsibble, fable, fabletools), and forecast with ARIMA and ETS.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_V8eKsto3Ug&t=6300s
whyItMatters: Manipulate dates and times with lubridate, model time series with stats::ts and the tidyverts ecosystem (tsibble, fable, fabletools), and forecast with ARIMA and ETS.
deepDiveResources:
  - label: W3Schools R
    url: https://www.w3schools.com/r/
    kind: course
  - label: R Official Docs
    url: https://www.rdocumentation.org/
    kind: doc
---

# Time Series, Forecasting, and lubridate

## Time Series, Forecasting, and lubridate

### Why It Matters

Manipulate dates and times with lubridate, model time series with stats::ts and the tidyverts ecosystem (tsibble, fable, fabletools), and forecast with ARIMA and ETS.

Manipulate dates and times with lubridate, model time series with stats::ts and the tidyverts ecosystem (tsibble, fable, fabletools), and forecast with ARIMA and ETS.

### Prerequisites

- Stage 5: Factors, Strings, and Dates
- Stage 9: Data Wrangling with dplyr
- Stage 18: Modeling — lm, glm, broom, tidymodels

### Topics

- lubridate: ymd(), mdy(), hms(), ymd_hms(), parse_date_time()
- Accessors: year(), month(), wday(), yday(), hour(), minute()
- Time zones: with_tz(), force_tz(), tz(), OlsonNames()
- Durations (dyears, dhours) vs periods (years, hours) vs intervals
- floor_date(), ceiling_date(), rollback() for rounding
- Base ts class with frequency and start; stats::ts()
- tsibble (tidy time series tibble) and the tidyverts ecosystem
- fable models: ARIMA(), ETS(), SNAIVE(), NAIVE(); forecast() and autoplot()

### Key Concepts

- Lubridate distinguishes durations (exact seconds, dyears()) from periods (calendar-aware, years()) because months and years have variable length; intervals are durations anchored to start/end.
- with_tz(t, 'America/New_York') converts a time to a different timezone (instant unchanged); force_tz(t, 'UTC') re-labels the same clock time as if it were in a different timezone (instant changes).
- Base ts class stores regularly-spaced series with a frequency (12 = monthly, 4 = quarterly); many classic models (arima, ets, HoltWinters) require ts; tsibble is the tidyverse alternative for irregular data.
- fable::ARIMA(y) auto-fits an ARIMA(p,d,q)(P,D,Q)_m model with automatic differencing and seasonal component selection; ETS() fits exponential smoothing; both return model objects that forecast() turns into prediction intervals.
- Forecast evaluation: split time series into train/test chronologically (NOT random — random leaks future into past); use accuracy(forecast, test) for point metrics and check residual diagnostics with gg_tsresiduals().

```r
library(lubridate)
d <- ymd("2024-03-15")
dt <- ymd_hms("2024-03-15 14:30:00", tz = "UTC")
year(d); month(d, label = TRUE); wday(d, label = TRUE); yday(d)
# Time zone conversion (same instant):
with_tz(dt, "America/New_York")    # shows 10:30 EDT
# Force (same clock time, different instant):
force_tz(dt, "America/New_York")   # shows 14:30 but in EDT
# Rounding:
floor_date(dt, "month")            # 2024-03-01 00:00
```
Caption: lubridate parsing and accessors

### Common Pitfalls

- Using durations for calendar arithmetic — dyears(1) is exactly 31,557,600 seconds, which does not land on the same date next year due to leap years; use periods (years(1)) for calendar-aware jumps.
- Random train/test split on time series — leaks future into training; always split chronologically with rsample::sliding_window(), rolling_origin(), or by hand using a date threshold.
- Forgetting to set tz (timezone) on ingestion — POSIXct without explicit tz defaults to local time, which differs across machines; always parse with tz = 'UTC' or your project's standard timezone.
- Confusing with_tz() and force_tz() — with_tz() changes the displayed time but not the instant; force_tz() changes the instant but not the displayed clock time; mixing them up corrupts the timeline.
- Treating time series as IID in a model — lm(y ~ x) on autocorrelated residuals gives misleading p-values; check residuals with gg_tsresiduals() or checkresiduals() and consider ARIMA errors.

### Real-World Applications

- Netflix uses fable and ARIMA for short-term viewership forecasting at the title level; the auto.arima-style selection in fable fits thousands of models per night for capacity planning.
- Airbnb uses lubridate and tsibble for host-revenue forecasting; with_tz() normalizes booking times across 220 countries to a single reference timezone for global aggregates.
- Facebook's Prophet package has an R interface that produces fast, tunable forecasts for business time series with holidays and changepoints; many R shops use it alongside fable.
- The New York Times uses lubridate + tsibble for traffic dashboards; floor_date(click_time, 'hour') is the standard aggregation for the realtime analytics pipeline.

### Interview Questions

- 1. What is the difference between a duration and a period in lubridate? — Durations are exact seconds (dyears(1) = 31,557,600s, regardless of leap years); periods are calendar-aware (years(1) lands on the same month/day next year); use periods for calendar arithmetic.
- 2. How do with_tz() and force_tz() differ? — with_tz(t, tz) displays the same instant in a different timezone; force_tz(t, tz) re-labels the same clock time as if it were in a different timezone, changing the actual instant; mixing them up corrupts data.
- 3. Why can't you randomly split a time series into train/test? — Random splits leak future observations into the training set; split chronologically (older = train, newer = test) to mimic real forecasting.
- 4. What does auto.arima() do, and what are p, d, q? — It searches over ARIMA(p, d, q) orders (auto-regressive, differencing, moving-average) plus seasonal (P, D, Q)_m, selecting by AICc; d is differencing for stationarity.
- 5. What is the tidyverts ecosystem and why use it? — tsibble (tidy time-indexed tibble), fable (models), fabletools (engine), feasts (stats) — brings tidyverse verbs and pipes to time series, replacing the older forecast package for new code.

### Mini Project

Build a Monthly Sales Forecaster: A function forecast_sales(sales_tibble, h = 12) that takes a tibble with date and sales columns, converts to a tsibble, fits ARIMA and ETS models with fable, forecasts h periods ahead, returns a tibble of point forecasts and 80/95% intervals, and produces an autoplot() of the forecast with the history. Validate by holding out the last 12 months and computing RMSE.
Suggested approach:
  - Parse dates with lubridate::ymd() and convert to yearmonth with tsibble::yearmonth()
  - Build a tsibble with tsibble::tsibble(index = month)
  - Fit multiple models with fable::model(arima = ARIMA(sales), ets = ETS(sales))
  - Forecast with fabletools::forecast(h = h) and extract intervals with hilo()
  - Hold out last 12 months for validation; compute RMSE with fabletools::accuracy()

### Exercises

1. Use lubridate to parse 'March 15, 2024 2:30 PM' with parse_date_time(); extract year, month name, weekday, and yday.
2. Demonstrate the duration vs period difference: compute ymd('2024-02-28') + dyears(1) vs + years(1); explain the result.
3. Convert a POSIXct in UTC to America/New_York with with_tz(); then force_tz() the original to America/New_York and compare the instants.
4. Build a tsibble from a tibble with month index; fit ARIMA() and ETS() with fable; forecast 12 months; plot with autoplot().
5. Hold out the last 12 months of a time series, fit ARIMA on the rest, forecast, and compute RMSE on the held-out period with accuracy().
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does ymd('2024-03-15') return?
9. A) A character vector
10. B) A POSIXct object
11. C) A Date object (*)
12. D) A factor
13. Explanation: lubridate::ymd() parses a year-month-day string into a Date object; ymd_hms() returns POSIXct with optional timezone.
14. Q2: What is the difference between dyears(1) and years(1)?
15. A) They are identical
16. B) years(1) is shorter
17. C) dyears(1) is calendar-aware
18. D) dyears(1) is exactly 31,557,600 seconds; years(1) is calendar-aware (jumps to same date next year) (*)
19. Explanation: durations (dyears) are exact seconds; periods (years) are calendar-aware; dyears(1) + ymd('2024-02-28') lands in 2024-12-31 06:00 due to leap year, while years(1) lands in 2025-02-28.
20. Q3: What does with_tz(dt, 'America/New_York') do?
21. A) Changes the displayed clock time but not the instant (*)
22. B) Changes the instant but not the displayed time
23. C) Throws an error
24. D) Sets the system timezone
25. Explanation: with_tz() displays the same instant in a different timezone; force_tz() re-labels the same clock time as if it were in a different timezone (changing the instant).
26. Q4: What does force_tz(dt, 'UTC') do?
27. A) Displays the same instant in UTC
28. B) Re-labels the same clock time as if it were UTC, changing the actual instant (*)
29. C) Throws an error
30. D) Converts to Date
31. Explanation: force_tz() takes a clock time and reinterprets it in a new timezone, changing the actual instant. Use it when a parse forgot the timezone.
32. Q5: What is the canonical frequency for a monthly ts() object?
33. A) 1
34. B) 4
35. C) 12 (*)
36. D) 365
37. Explanation: ts(..., frequency = 12) for monthly; 4 for quarterly; 52 for weekly; 365.25 for daily. fable/tsibble use yearmonth() instead.
38. Q6: Why can't you randomly split a time series into train/test?
39. A) It is too slow
40. B) ts() does not allow it
41. C) It produces too few rows
42. D) Random splits leak future observations into training, defeating the forecasting goal (*)
43. Explanation: Random splits put future rows in train, leaking future information; always split chronologically (older = train, newer = test) to mimic real forecasting.
44. Q7: What does auto.arima() select?
45. A) The ARIMA(p,d,q)(P,D,Q)_m orders by AICc, including differencing (*)
46. B) Just the AR order p
47. C) Only the differencing order d
48. D) The seasonal period m
49. Explanation: auto.arima() (and fable::ARIMA()) search over ARIMA orders p, d, q (auto-regressive, differencing, moving average) plus seasonal P, D, Q, m, selecting by AICc.
50. Q8: What is a tsibble?
51. A) A faster tibble
52. B) A time-indexed tibble (tidy time series) (*)
53. C) A time-zone aware POSIXct
54. D) A forecasting model
55. Explanation: tsibble is the tidy time-indexed data structure from the tidyverts ecosystem; it enforces a unique index and handles irregular series, replacing base ts() for new code.
56. Q9: What does floor_date(dt, 'month') return?
57. A) The last day of the month
58. B) The month name
59. C) The first day of the month containing dt (*)
60. D) The week containing dt
61. Explanation: floor_date(dt, 'month') rounds down to the first instant of the month; useful for monthly aggregation alongside ceiling_date() (rounds up) and round_date().
62. Q10: What does checkresiduals(fit) do for an ARIMA fit?
63. A) Plots the forecast
64. B) Computes RMSE
65. C) Returns coefficients
66. D) Runs a Ljung-Box test and plots residual diagnostics for white noise (*)
67. Explanation: checkresiduals() plots residuals (time series, ACF, histogram) and runs a Ljung-Box test for autocorrelation; non-significant p-value supports the model (residuals look like white noise).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does ymd('2024-03-15') return?
  options:
    - A character vector
    - A POSIXct object
    - A Date object
    - A factor
  correctIndex: 2
  explanation: lubridate::ymd() parses a year-month-day string into a Date object; ymd_hms() returns POSIXct with optional timezone.
- id: q2
  question: What is the difference between dyears(1) and years(1)?
  options:
    - They are identical
    - years(1) is shorter
    - dyears(1) is calendar-aware
    - dyears(1) is exactly 31,557,600 seconds; years(1) is calendar-aware (jumps to same date next year)
  correctIndex: 3
  explanation: durations (dyears) are exact seconds; periods (years) are calendar-aware; dyears(1) + ymd('2024-02-28') lands in 2024-12-31 06:00 due to leap year, while years(1) lands in 2025-02-28.
- id: q3
  question: What does with_tz(dt, 'America/New_York') do?
  options:
    - Changes the displayed clock time but not the instant
    - Changes the instant but not the displayed time
    - Throws an error
    - Sets the system timezone
  correctIndex: 0
  explanation: with_tz() displays the same instant in a different timezone; force_tz() re-labels the same clock time as if it were in a different timezone (changing the instant).
- id: q4
  question: What does force_tz(dt, 'UTC') do?
  options:
    - Displays the same instant in UTC
    - Re-labels the same clock time as if it were UTC, changing the actual instant
    - Throws an error
    - Converts to Date
  correctIndex: 1
  explanation: force_tz() takes a clock time and reinterprets it in a new timezone, changing the actual instant. Use it when a parse forgot the timezone.
- id: q5
  question: What is the canonical frequency for a monthly ts() object?
  options:
    - "1"
    - "4"
    - "12"
    - "365"
  correctIndex: 2
  explanation: ts(..., frequency = 12) for monthly; 4 for quarterly; 52 for weekly; 365.25 for daily. fable/tsibble use yearmonth() instead.
- id: q6
  question: Why can't you randomly split a time series into train/test?
  options:
    - It is too slow
    - ts() does not allow it
    - It produces too few rows
    - Random splits leak future observations into training, defeating the forecasting goal
  correctIndex: 3
  explanation: Random splits put future rows in train, leaking future information; always split chronologically (older = train, newer = test) to mimic real forecasting.
- id: q7
  question: What does auto.arima() select?
  options:
    - The ARIMA(p,d,q)(P,D,Q)_m orders by AICc, including differencing
    - Just the AR order p
    - Only the differencing order d
    - The seasonal period m
  correctIndex: 0
  explanation: auto.arima() (and fable::ARIMA()) search over ARIMA orders p, d, q (auto-regressive, differencing, moving average) plus seasonal P, D, Q, m, selecting by AICc.
- id: q8
  question: What is a tsibble?
  options:
    - A faster tibble
    - A time-indexed tibble (tidy time series)
    - A time-zone aware POSIXct
    - A forecasting model
  correctIndex: 1
  explanation: tsibble is the tidy time-indexed data structure from the tidyverts ecosystem; it enforces a unique index and handles irregular series, replacing base ts() for new code.
- id: q9
  question: What does floor_date(dt, 'month') return?
  options:
    - The last day of the month
    - The month name
    - The first day of the month containing dt
    - The week containing dt
  correctIndex: 2
  explanation: floor_date(dt, 'month') rounds down to the first instant of the month; useful for monthly aggregation alongside ceiling_date() (rounds up) and round_date().
- id: q10
  question: What does checkresiduals(fit) do for an ARIMA fit?
  options:
    - Plots the forecast
    - Computes RMSE
    - Returns coefficients
    - Runs a Ljung-Box test and plots residual diagnostics for white noise
  correctIndex: 3
  explanation: checkresiduals() plots residuals (time series, ACF, histogram) and runs a Ljung-Box test for autocorrelation; non-significant p-value supports the model (residuals look like white noise).
```

