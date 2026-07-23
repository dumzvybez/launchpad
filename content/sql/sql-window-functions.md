---
slug: sql-window-functions
id: sql-06
track: sql
order: 6
title: Window Functions
description: Compute analytics across rows without collapsing them — ROW_NUMBER, RANK, LAG, LEAD, running totals, and per-group top-N with the OVER(), PARTITION BY, and frame clauses.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=3400s
whyItMatters: Compute analytics across rows without collapsing them — ROW_NUMBER, RANK, LAG, LEAD, running totals, and per-group top-N with the OVER(), PARTITION BY, and frame clauses.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Window Functions

## Window Functions

### Why It Matters

Compute analytics across rows without collapsing them — ROW_NUMBER, RANK, LAG, LEAD, running totals, and per-group top-N with the OVER(), PARTITION BY, and frame clauses.

Compute analytics across rows without collapsing them — ROW_NUMBER, RANK, LAG, LEAD, running totals, and per-group top-N with the OVER(), PARTITION BY, and frame clauses.

### Prerequisites

- Stage 5: Subqueries and CTEs.
- Comfort with GROUP BY and aggregates.

### Topics

- OVER () — the universal window clause
- PARTITION BY — window per group
- ORDER BY inside OVER — ranking and ordered frames
- Ranking functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE
- Offset functions: LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE
- Aggregate functions as windows: SUM/AVG/COUNT OVER
- Frame clauses: ROWS BETWEEN, RANGE BETWEEN, GROUPS BETWEEN
- PERCENT_RANK, CUME_DIST, PERCENTILE_CONT

### Key Concepts

- Window functions compute a value per row based on a "window" of related rows; they don't collapse rows like GROUP BY does.
- PARTITION BY divides rows into groups; ORDER BY inside OVER defines the ordering within each partition.
- The default frame for ordered windows is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — a running aggregate.
- For pure ranking (no aggregation), use ROW_NUMBER (unique), RANK (gaps after ties), DENSE_RANK (no gaps).
- `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` gives the whole partition as the frame.
- Window functions are evaluated AFTER WHERE, GROUP BY, and HAVING — they can't appear in WHERE.

```sql
SELECT
    customer_id,
    payment_date,
    amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date DESC) AS rn,
    RANK()       OVER (PARTITION BY customer_id ORDER BY amount DESC)       AS amt_rank,
    DENSE_RANK() OVER (PARTITION BY customer_id ORDER BY amount DESC)       AS amt_dense
FROM payment
ORDER BY customer_id, rn;
```
Caption: Ranking

### Common Pitfalls

- Window in WHERE — window functions are evaluated after WHERE; use a CTE or subquery to filter by row_number.
- Default frame surprise — `SUM(x) OVER (PARTITION BY p ORDER BY d)` is a RUNNING sum, not a partition total; use `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` for the partition total.
- RANK vs DENSE_RANK — RANK leaves gaps after ties (1,1,3); DENSE_RANK doesn't (1,1,2); pick the one matching your semantic.
- LAST_VALUE default — with the default frame, LAST_VALUE returns the current row's value, not the partition's last; widen the frame.
- Confusing window ORDER BY with result ORDER BY — the OVER (ORDER BY ...) is for the window; you still need a top-level ORDER BY for stable output.

### Real-World Applications

- Stripe computes rolling 30-day fraud rates with SUM(...) OVER (ORDER BY date ROWS 29 PRECEDING).
- Netflix uses LAG/LEAD to compute session-duration deltas between consecutive user events.
- LinkedIn ranks job recommendations per member with ROW_NUMBER() OVER (PARTITION BY member_id ORDER BY score DESC).
- Uber's surge pricing pipeline uses PERCENTILE_CONT(0.95) OVER (PARTITION BY geohash) for p95 wait times.

### Interview Questions

- 1. Difference between ROW_NUMBER, RANK, and DENSE_RANK? — ROW_NUMBER is unique; RANK leaves gaps after ties; DENSE_RANK doesn't.
- 2. Can you use a window function in WHERE? — No; windows evaluate after WHERE. Wrap in a CTE and filter the rn column.
- 3. What does `SUM(x) OVER (ORDER BY d)` compute? — A running total from the first row in the partition to the current row (default RANGE frame).
- 4. How do you compute a 7-day moving average? — `AVG(x) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`.
- 5. What does PARTITION BY do? — Divides rows into independent windows; the function resets at each partition boundary.

### Mini Project

Build a Customer Cohort Retention Query: Given a `payment` table, compute the cohort (first-payment month) for each customer, then for each subsequent month, the count of customers still active (paid in that month). Suggested approach:
  - First CTE: cohort_month = MIN(date_trunc('month', payment_date)) per customer
  - Second CTE: each customer's active months via DISTINCT date_trunc('month', payment_date)
  - Cross-join cohort_month with month_index 0..11
  - Use COUNT(DISTINCT customer_id) FILTER (WHERE active_month = cohort_month + month_index)
  - Pivot to a matrix with cohort_month as rows and month_index as columns

### Exercises

1. Use ROW_NUMBER to deduplicate a table keeping the latest row per customer_id.
2. Compute the delta between consecutive payments per customer with LAG.
3. Compute a running total of revenue per day, ordered by payment_date.
4. Find the 95th percentile payment amount per customer with PERCENTILE_CONT(0.95).
5. Compare `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` on a column with duplicate values; show the differences.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does PARTITION BY do in a window function?
9. A) Splits the table into separate physical partitions
10. B) Defines groups within which the window function operates and resets (*)
11. C) Acts like GROUP BY and collapses rows
12. D) Forces parallel execution
13. Explanation: PARTITION BY divides rows into independent windows; the function (e.g. ROW_NUMBER) resets at each partition boundary.
14. Q2: Which function returns unique sequential integers per partition, ignoring ties?
15. A) RANK
16. B) DENSE_RANK
17. C) ROW_NUMBER (*)
18. D) NTILE
19. Explanation: ROW_NUMBER assigns 1, 2, 3, ... uniquely; RANK and DENSE_RANK give tied rows the same number.
20. Q3: Which leaves gaps in the ranking after ties (1, 1, 3)?
21. A) ROW_NUMBER
22. B) DENSE_RANK
23. C) NTILE
24. D) RANK (*)
25. Explanation: RANK gives tied rows the same number and skips the next ranks; DENSE_RANK doesn't skip.
26. Q4: Where can a window function NOT appear?
27. A) WHERE (*)
28. B) SELECT list
29. C) ORDER BY
30. D) Subquery SELECT
31. Explanation: Window functions are evaluated after WHERE; filter on row_number by wrapping in a CTE.
32. Q5: What does `SUM(x) OVER (ORDER BY d)` compute by default?
33. A) The partition total
34. B) A running total from partition start to current row (*)
35. C) A moving 7-row sum
36. D) The grand total
37. Explanation: The default frame for ordered OVER is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — a running aggregate.
38. Q6: Which computes a 7-row moving average?
39. A) AVG(x) OVER ()
40. B) AVG(x) OVER (ORDER BY d)
41. C) AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) (*)
42. D) AVG(x) OVER (PARTITION BY d)
43. Explanation: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW gives the current row plus the 6 before it — a 7-row moving average.
44. Q7: Why does LAST_VALUE often return unexpected results?
45. A) It's not implemented in Postgres
46. B) It only works with ROW_NUMBER
47. C) It requires a PARTITION BY
48. D) The default frame ends at the current row, not the partition (*)
49. Explanation: With the default frame, LAST_VALUE returns the current row's value; widen the frame to UNBOUNDED FOLLOWING for the partition's last.
50. Q8: How do you compute top-N per group with window functions?
51. A) ROW_NUMBER() OVER (PARTITION BY group ORDER BY ...) AS rn, then WHERE rn <= N (*)
52. B) Use NTILE(N)
53. C) LIMIT N per group
54. D) Use LAG(N)
55. Explanation: Wrap the window in a CTE/subquery and filter rn <= N — the canonical top-N-per-group pattern.
56. Q9: Which function returns the previous row's value?
57. A) LEAD
58. B) LAG (*)
59. C) FIRST_VALUE
60. D) NTH_VALUE
61. Explanation: LAG(col, n) returns col from n rows before the current row; LEAD returns n rows ahead.
62. Q10: PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY x) computes?
63. A) The 95th row
64. B) 95% of the sum
65. C) The 95th percentile, interpolating between adjacent values (*)
66. D) A 95-row moving window
67. Explanation: PERCENTILE_CONT interpolates continuous percentiles; PERCENTILE_DISC returns the nearest actual value.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does PARTITION BY do in a window function?
  options:
    - Splits the table into separate physical partitions
    - Defines groups within which the window function operates and resets
    - Acts like GROUP BY and collapses rows
    - Forces parallel execution
    - resets at each partition boundary.
  correctIndex: 1
  explanation: PARTITION BY divides rows into independent windows; the function (e.g. ROW_NUMBER) resets at each partition boundary.
- id: q2
  question: Which function returns unique sequential integers per partition, ignoring ties?
  options:
    - RANK
    - DENSE_RANK
    - ROW_NUMBER
    - NTILE
  correctIndex: 2
  explanation: ROW_NUMBER assigns 1, 2, 3, ... uniquely; RANK and DENSE_RANK give tied rows the same number.
- id: q3
  question: Which leaves gaps in the ranking after ties (1, 1, 3)?
  options:
    - ROW_NUMBER
    - DENSE_RANK
    - NTILE
    - RANK
  correctIndex: 3
  explanation: RANK gives tied rows the same number and skips the next ranks; DENSE_RANK doesn't skip.
- id: q4
  question: Where can a window function NOT appear?
  options:
    - WHERE
    - SELECT list
    - ORDER BY
    - Subquery SELECT
  correctIndex: 0
  explanation: Window functions are evaluated after WHERE; filter on row_number by wrapping in a CTE.
- id: q5
  question: What does `SUM(x) OVER (ORDER BY d)` compute by default?
  options:
    - The partition total
    - A running total from partition start to current row
    - A moving 7-row sum
    - The grand total
  correctIndex: 1
  explanation: The default frame for ordered OVER is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — a running aggregate.
- id: q6
  question: Which computes a 7-row moving average?
  options:
    - AVG(x) OVER ()
    - AVG(x) OVER (ORDER BY d)
    - AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
    - AVG(x) OVER (PARTITION BY d)
  correctIndex: 2
  explanation: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW gives the current row plus the 6 before it — a 7-row moving average.
- id: q7
  question: Why does LAST_VALUE often return unexpected results?
  options:
    - It's not implemented in Postgres
    - It only works with ROW_NUMBER
    - It requires a PARTITION BY
    - The default frame ends at the current row, not the partition
  correctIndex: 3
  explanation: With the default frame, LAST_VALUE returns the current row's value; widen the frame to UNBOUNDED FOLLOWING for the partition's last.
- id: q8
  question: How do you compute top-N per group with window functions?
  options:
    - ROW_NUMBER() OVER (PARTITION BY group ORDER BY ...) AS rn, then WHERE rn <= N
    - Use NTILE(N)
    - LIMIT N per group
    - Use LAG(N)
  correctIndex: 0
  explanation: Wrap the window in a CTE/subquery and filter rn <= N — the canonical top-N-per-group pattern.
- id: q9
  question: Which function returns the previous row's value?
  options:
    - LEAD
    - LAG
    - FIRST_VALUE
    - NTH_VALUE
  correctIndex: 1
  explanation: LAG(col, n) returns col from n rows before the current row; LEAD returns n rows ahead.
- id: q10
  question: PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY x) computes?
  options:
    - The 95th row
    - 95% of the sum
    - The 95th percentile, interpolating between adjacent values
    - A 95-row moving window
  correctIndex: 2
  explanation: PERCENTILE_CONT interpolates continuous percentiles; PERCENTILE_DISC returns the nearest actual value.
```

