---
slug: postgresql-window-functions-ctes-deep-dive
id: postgresql-10
track: postgresql
order: 10
title: Window Functions and CTEs (Deep Dive)
description: Master window functions (OVER, PARTITION BY, ORDER BY, frame clauses) and CTEs (WITH, RECURSIVE, MATERIALIZED) for analytical queries that would otherwise require multiple self-joins or procedural code.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=10800s
whyItMatters: Master window functions (OVER, PARTITION BY, ORDER BY, frame clauses) and CTEs (WITH, RECURSIVE, MATERIALIZED) for analytical queries that would otherwise require multiple self-joins or procedural code.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Window Functions and CTEs (Deep Dive)

## Window Functions and CTEs (Deep Dive)

### Why It Matters

Master window functions (OVER, PARTITION BY, ORDER BY, frame clauses) and CTEs (WITH, RECURSIVE, MATERIALIZED) for analytical queries that would otherwise require multiple self-joins or procedural code.

Master window functions (OVER, PARTITION BY, ORDER BY, frame clauses) and CTEs (WITH, RECURSIVE, MATERIALIZED) for analytical queries that would otherwise require multiple self-joins or procedural code.

### Prerequisites

- Stage 1: Getting Started with PostgreSQL
- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN
- Comfort with GROUP BY, JOIN, and subqueries.

### Topics

- Window functions: OVER (), PARTITION BY, ORDER BY, ROWS vs RANGE frames
- Ranking functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE, PERCENT_RANK
- Offset functions: LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE
- Aggregates as windows: SUM/AVG/COUNT OVER (running totals, moving averages)
- WITH (CTE): named subqueries, multiple CTEs, chained CTEs
- RECURSIVE CTE: tree traversal, graph traversal, sequence generation
- MATERIALIZED hint (PG12+): force the planner to materialize a CTE
- Window functions vs GROUP BY: windows preserve rows; GROUP BY collapses them

### Key Concepts

- A window function computes over a "window" of rows related to the current row, without collapsing them (unlike GROUP BY). The result is one value per input row.
- `OVER ()` is the whole partition; `OVER (PARTITION BY x)` resets per group; `OVER (PARTITION BY x ORDER BY y)` adds a frame (default: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).
- `ROWS BETWEEN N PRECEDING AND CURRENT ROW` is a fixed-row frame; `RANGE` is value-based (includes ties) — usually you want ROWS.
- LAG(col, 1) gives the previous row's value — perfect for "change since yesterday" without a self-join.
- CTEs (WITH) are not performance optimizations in PG12+ — the planner can inline them; use them for readability. Use MATERIALIZED to force materialization (e.g. for expensive CTEs called twice).
- RECURSIVE CTEs are Postgres's general-purpose loop — they handle trees, graphs, and sequences; the base case + recursive step pattern is mandatory.
- Window functions can't appear in WHERE — wrap in a CTE or subquery and filter on the outer level.

```sql
-- Top 3 highest-paid employees per department:
WITH ranked AS (
    SELECT
        name,
        department_id,
        salary,
        RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
    FROM employee
)
SELECT * FROM ranked WHERE rnk <= 3;

-- Period-over-period change using LAG:
SELECT
    day,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY day)              AS prev_day_revenue,
    revenue - LAG(revenue, 1) OVER (ORDER BY day)    AS daily_change,
    revenue - LAG(revenue, 7) OVER (ORDER BY day)    AS wow_change
FROM daily_revenue
ORDER BY day;
```
Caption: Ranking and offset functions

### Common Pitfalls

- Putting window functions in WHERE — they're not allowed; wrap in a CTE or subquery and filter on the outer level.
- Default frame is RANGE, not ROWS — `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` includes ties, which is rarely what you want for running totals; use `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
- Forgetting UNION ALL vs UNION in RECURSIVE CTEs — UNION dedupes (often wrong for tree traversal); UNION ALL is usually what you want (faster, no dedup).
- CTEs are not always optimizations — PG12+ inlines them; don't write `WITH x AS (...) SELECT * FROM x` expecting it to be faster than a subquery. Use them for readability.
- Not handling NULLs in LAG/LEAD — LAG(col, 1) returns NULL for the first row; coalesce or filter to avoid downstream NaN propagation.

### Real-World Applications

- Stripe uses window functions to compute merchant running balances and detect anomalies (sudden spikes).
- Discord uses LAG/LEAD to compute message-volume deltas during incidents.
- Reddit uses RECURSIVE CTEs for comment trees (threaded comments with arbitrary depth).
- Spotify uses window functions for "Top 50 this week" and rolling 30-day play counts.

### Interview Questions

- 1. What's the difference between a window function and GROUP BY? — GROUP BY collapses rows; window functions compute over a window but return one value per input row.
- 2. What does `OVER (PARTITION BY x ORDER BY y)` do? — Resets the window per x value, and within each partition, orders by y with a default frame of RANGE UNBOUNDED PRECEDING to CURRENT ROW.
- 3. What's the difference between RANK and DENSE_RANK? — RANK skips after ties (1,1,3); DENSE_RANK doesn't (1,1,2). ROW_NUMBER is unique (1,2,3).
- 4. Why use UNION ALL in a RECURSIVE CTE? — UNION dedupes (slow and often wrong for tree traversal); UNION ALL preserves duplicates and is faster.
- 5. When would you use the MATERIALIZED hint on a CTE? — When the CTE is expensive and called multiple times; MATERIALIZED (PG12+) forces the planner to materialize once and reuse.

### Mini Project

Build a Retention Cohort Query: Given an `events` table (user_id, occurred_at, event_type), compute a cohort matrix: rows = signup month, columns = month-since-signup (0..11), cells = % of cohort still active that month. Use a RECURSIVE CTE to generate the month series, window functions to find each user's first-seen date, and a final PIVOT-like aggregation. Suggested approach:
  - Use `date_trunc('month', MIN(occurred_at))` per user as cohort_month
  - Use a RECURSIVE CTE to generate months 0..11 from cohort_month
  - Use `FILTER (WHERE active_month = cohort_month + offset)` for each cell
  - Wrap the whole thing in a view `cohort_retention`
  - Verify with a small fixture of 100 users across 6 cohort months

### Exercises

1. Use RANK(), DENSE_RANK(), and ROW_NUMBER() on a salary column with ties; observe the differences.
2. Use LAG() to compute day-over-day revenue change; coalesce the first row's NULL to 0.
3. Use a RECURSIVE CTE to traverse a self-referential employee(manager_id) table; cap the depth at 10 to avoid infinite loops.
4. Compute a 7-day moving average using ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.
5. Write a chained CTE that filters active users, computes revenue per user, then selects the top 10.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between a window function and GROUP BY?
9. A) They are the same
10. B) GROUP BY collapses rows; window functions compute over a window but preserve rows (*)
11. C) Window functions are faster
12. D) GROUP BY is always preferred
13. Explanation: GROUP BY produces one row per group; window functions produce one value per input row, computed over a "window" related to the current row. Use windows when you want both detail and aggregate.
14. Q2: What does RANK() do that DENSE_RANK() does not?
15. A) Returns unique numbers
16. B) Returns text
17. C) Skips numbers after ties (1,1,3) — DENSE_RANK gives (1,1,2) (*)
18. D) Sorts ascending only
19. Explanation: RANK skips after ties; DENSE_RANK doesn't. ROW_NUMBER always returns unique numbers (1,2,3) regardless of ties.
20. Q3: What is the default frame for OVER (ORDER BY x)?
21. A) ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
22. B) No frame
23. C) ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
24. D) RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (*)
25. Explanation: The default is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which includes ties on the ORDER BY value. For running totals without ties, use ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.
26. Q4: Why use UNION ALL instead of UNION in a RECURSIVE CTE?
27. A) UNION dedupes (slow and often wrong for tree traversal); UNION ALL preserves duplicates (*)
28. B) UNION is invalid
29. C) UNION ALL is required by SQL
30. D) UNION is faster
31. Explanation: UNION applies DISTINCT (extra sort) and can drop legitimate duplicates in a tree; UNION ALL is faster and almost always correct for recursive tree/graph traversal.
32. Q5: Where can a window function NOT appear?
33. A) SELECT
34. B) WHERE (*)
35. C) ORDER BY
36. D) Subquery
37. Explanation: Window functions can't appear in WHERE or HAVING; wrap in a CTE or subquery and filter on the outer level (e.g. WHERE rnk <= 3).
38. Q6: What does LAG(col, 1) return for the first row in a partition?
39. A) The first row's value
40. B) An error
41. C) NULL (*)
42. D) The last row's value
43. Explanation: LAG(col, 1) returns the previous row's value; for the first row there is no previous row, so it returns NULL. Coalesce or filter to avoid NaN propagation.
44. Q7: In PG12+, what does WITH x AS MATERIALIZED (...) do?
45. A) Creates a materialized view
46. B) Drops the CTE
47. C) Makes the CTE immutable
48. D) Forces the planner to materialize the CTE once and reuse it (*)
49. Explanation: PG12+ can inline CTEs; MATERIALIZED forces materialization (useful for expensive CTEs called multiple times). The opposite hint is AS NOT MATERIALIZED.
50. Q8: What does `OVER (PARTITION BY dept ORDER BY salary DESC)` produce per row?
51. A) A window scoped to the dept, ordered by salary descending, with the default frame (*)
52. B) One row per dept
53. C) An error
54. D) A single scalar
55. Explanation: PARTITION BY resets per dept; ORDER BY sorts within each partition; the default frame (RANGE UNBOUNDED PRECEDING to CURRENT ROW) applies. Each input row gets one value.
56. Q9: Which is the right pattern for "top 3 per group"?
57. A) GROUP BY then LIMIT 3
58. B) RANK() OVER (PARTITION BY group ORDER BY x DESC) in a CTE, then filter rnk <= 3 (*)
59. C) SELECT ... LIMIT 3 OFFSET 0
60. D) Use DISTINCT ON
61. Explanation: RANK() or ROW_NUMBER() in a CTE, then filter on the outer level — the canonical pattern for top-N-per-group. DISTINCT ON also works but is less flexible.
62. Q10: What does FIRST_VALUE(col) OVER (ORDER BY x) return?
63. A) The last value
64. B) NULL
65. C) The first value in the frame (by x ascending) for every row in the partition (*)
66. D) The current row's value
67. Explanation: FIRST_VALUE returns the value from the first row in the frame; with the default frame (UNBOUNDED PRECEDING to CURRENT ROW) and ORDER BY x, this is the row with the smallest x. Use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to get the partition-wide first.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between a window function and GROUP BY?
  options:
    - They are the same
    - GROUP BY collapses rows; window functions compute over a window but preserve rows
    - Window functions are faster
    - GROUP BY is always preferred
  correctIndex: 1
  explanation: GROUP BY produces one row per group; window functions produce one value per input row, computed over a "window" related to the current row. Use windows when you want both detail and aggregate.
- id: q2
  question: What does RANK() do that DENSE_RANK() does not?
  options:
    - Returns unique numbers
    - Returns text
    - Skips numbers after ties (1,1,3) — DENSE_RANK gives (1,1,2)
    - Sorts ascending only
  correctIndex: 2
  explanation: RANK skips after ties; DENSE_RANK doesn't. ROW_NUMBER always returns unique numbers (1,2,3) regardless of ties.
- id: q3
  question: What is the default frame for OVER (ORDER BY x)?
  options:
    - ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    - No frame
    - ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
    - RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  correctIndex: 3
  explanation: The default is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which includes ties on the ORDER BY value. For running totals without ties, use ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.
- id: q4
  question: Why use UNION ALL instead of UNION in a RECURSIVE CTE?
  options:
    - UNION dedupes (slow and often wrong for tree traversal); UNION ALL preserves duplicates
    - UNION is invalid
    - UNION ALL is required by SQL
    - UNION is faster
  correctIndex: 0
  explanation: UNION applies DISTINCT (extra sort) and can drop legitimate duplicates in a tree; UNION ALL is faster and almost always correct for recursive tree/graph traversal.
- id: q5
  question: Where can a window function NOT appear?
  options:
    - SELECT
    - WHERE
    - ORDER BY
    - Subquery
  correctIndex: 1
  explanation: Window functions can't appear in WHERE or HAVING; wrap in a CTE or subquery and filter on the outer level (e.g. WHERE rnk <= 3).
- id: q6
  question: What does LAG(col, 1) return for the first row in a partition?
  options:
    - The first row's value
    - An error
    - "NULL"
    - The last row's value
  correctIndex: 2
  explanation: LAG(col, 1) returns the previous row's value; for the first row there is no previous row, so it returns NULL. Coalesce or filter to avoid NaN propagation.
- id: q7
  question: In PG12+, what does WITH x AS MATERIALIZED (...) do?
  options:
    - Creates a materialized view
    - Drops the CTE
    - Makes the CTE immutable
    - Forces the planner to materialize the CTE once and reuse it
  correctIndex: 3
  explanation: PG12+ can inline CTEs; MATERIALIZED forces materialization (useful for expensive CTEs called multiple times). The opposite hint is AS NOT MATERIALIZED.
- id: q8
  question: What does `OVER (PARTITION BY dept ORDER BY salary DESC)` produce per row?
  options:
    - "` produce per row?"
    - A window scoped to the dept, ordered by salary descending, with the default frame
    - One row per dept
    - An error
    - A single scalar
    - applies. Each input row gets one value.
  correctIndex: 1
  explanation: PARTITION BY resets per dept; ORDER BY sorts within each partition; the default frame (RANGE UNBOUNDED PRECEDING to CURRENT ROW) applies. Each input row gets one value.
- id: q9
  question: Which is the right pattern for "top 3 per group"?
  options:
    - GROUP BY then LIMIT 3
    - RANK() OVER (PARTITION BY group ORDER BY x DESC) in a CTE, then filter rnk <= 3
    - SELECT ... LIMIT 3 OFFSET 0
    - Use DISTINCT ON
  correctIndex: 1
  explanation: RANK() or ROW_NUMBER() in a CTE, then filter on the outer level — the canonical pattern for top-N-per-group. DISTINCT ON also works but is less flexible.
- id: q10
  question: What does FIRST_VALUE(col) OVER (ORDER BY x) return?
  options:
    - The last value
    - "NULL"
    - The first value in the frame (by x ascending) for every row in the partition
    - The current row's value
    - and ORDER BY x, this is the row with the smallest x. Use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to get the partition-wide first.
  correctIndex: 2
  explanation: FIRST_VALUE returns the value from the first row in the frame; with the default frame (UNBOUNDED PRECEDING to CURRENT ROW) and ORDER BY x, this is the row with the smallest x. Use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to get the partition-wide first.
```

