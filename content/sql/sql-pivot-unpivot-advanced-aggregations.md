---
slug: sql-pivot-unpivot-advanced-aggregations
id: sql-15
track: sql
order: 15
title: Pivot, Unpivot, and Advanced Aggregations
description: Reshape wide to long and back with crosstab and UNION ALL, compute multi-dimensional aggregates with ROLLUP, CUBE, and GROUPING SETS, and use the FILTER clause for clean conditional aggregation.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=9700s
whyItMatters: Reshape wide to long and back with crosstab and UNION ALL, compute multi-dimensional aggregates with ROLLUP, CUBE, and GROUPING SETS, and use the FILTER clause for clean conditional aggregation.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Pivot, Unpivot, and Advanced Aggregations

## Pivot, Unpivot, and Advanced Aggregations

### Why It Matters

Reshape wide to long and back with crosstab and UNION ALL, compute multi-dimensional aggregates with ROLLUP, CUBE, and GROUPING SETS, and use the FILTER clause for clean conditional aggregation.

Reshape wide to long and back with crosstab and UNION ALL, compute multi-dimensional aggregates with ROLLUP, CUBE, and GROUPING SETS, and use the FILTER clause for clean conditional aggregation.

### Prerequisites

- Stage 14: Recursive Queries and Tree Traversal.
- Mastery of GROUP BY and HAVING from Stage 4.

### Topics

- Pivoting with `crosstab` (tablefunc extension)
- Unpivoting with UNION ALL or `unnest(array[...])`
- ROLLUP — hierarchical subtotals
- CUBE — all combinations of subtotals
- GROUPING SETS — explicit subtotal groups
- FILTER clause for conditional aggregates
- GROUPING_ID and GROUPING() to identify subtotal rows
- ARRAY_AGG and jsonb_agg for vertical packing

### Key Concepts

- Pivot (rows to columns): Postgres has no native PIVOT keyword; use the `crosstab` function from the tablefunc extension.
- Unpivot (columns to rows): use UNION ALL of one SELECT per column, or `unnest(ARRAY[...])` with ordinality.
- ROLLUP(a, b) produces subtotals for (a,b), (a), and () — the grand total.
- CUBE(a, b) produces subtotals for all 2^n combinations: (a,b), (a), (b), ().
- GROUPING SETS lets you specify exactly which subtotal groups you want.
- FILTER (WHERE cond) is cleaner than CASE WHEN inside aggregates — and often faster.
- GROUPING(col) returns 1 when the column is a subtotal (NULL because of aggregation), 0 otherwise.

```sql
CREATE EXTENSION IF NOT EXISTS tablefunc;

-- Monthly revenue by store (stores as columns)
SELECT *
FROM crosstab(
    $$
        SELECT to_char(payment_date, 'YYYY-MM') AS month,
               store_id,
               SUM(amount)
        FROM payment p
        JOIN staff s ON s.staff_id = p.staff_id
        GROUP BY 1, 2
        ORDER BY 1, 2
    $$
) AS ct (month text, store_1 numeric, store_2 numeric);
```
Caption: Pivot with crosstab

### Common Pitfalls

- crosstab column mismatch — the AS clause must declare exact types and names; mismatch yields silent truncation or errors.
- NULL vs subtotal-NULL — in ROLLUP/CUBE, NULL means "this is a subtotal", not "the data was NULL"; use GROUPING(col) to disambiguate.
- CUBE explosion — CUBE over 4+ columns produces 2^n subtotal groups; use GROUPING SETS to pick only the ones you need.
- CASE WHEN vs FILTER — `SUM(CASE WHEN ... END)` works but is slower and noisier than `SUM(col) FILTER (WHERE ...)`.
- UNION vs UNION ALL for unpivot — UNION dedupes (slow, may hide rows); UNION ALL preserves duplicates (usually what you want).

### Real-World Applications

- Stripe Sigma pivots charge volume by country and month for finance reporting.
- Airbnb's host dashboard uses GROUPING SETS to show per-listing, per-host, and overall totals in one query.
- Netflix's content teams pivot watch hours by title and region for quarterly reviews.
- LinkedIn's talent insights uses CUBE on (industry, seniority, country) for labor-market dashboards.

### Interview Questions

- 1. How do you pivot in Postgres? — Use the `crosstab` function from the tablefunc extension; declare output columns explicitly.
- 2. Difference between ROLLUP and CUBE? — ROLLUP produces hierarchical subtotals (a, ab, abc); CUBE produces all 2^n combinations.
- 3. What does GROUPING(col) return? — 1 if the NULL in col is due to ROLLUP/CUBE aggregation, 0 if it's an actual NULL value.
- 4. Why use FILTER over CASE WHEN? — Cleaner, often faster, and avoids accidental NULL contributions from ELSE branches.
- 5. How do you unpivot? — UNION ALL one SELECT per column, or unnest an array with ordinality.

### Mini Project

Build a Quarterly Sales Dashboard Query: One query that produces per-quarter revenue broken down by region and product line, with subtotals per region and a grand total. Suggested approach:
  - Use ROLLUP (region, product_line) for hierarchical subtotals
  - Use GROUPING() to label subtotal rows
  - Use FILTER for Q1/Q2/Q3/Q4 columns in a pivot via crosstab
  - Output: region, product_line, q1, q2, q3, q4, total, is_subtotal
  - Save as a view for the dashboard to consume

### Exercises

1. Use crosstab to pivot monthly revenue by store; verify totals match the unpivoted query.
2. Unpivot a (id, q1, q2, q3, q4) table into (id, quarter, revenue) rows.
3. Use ROLLUP(country, region) and label subtotal rows with GROUPING().
4. Replace 4 SUM(CASE WHEN ...) columns with FILTER; verify identical results.
5. Use GROUPING SETS ((a,b), (a), ()) to pick exactly three subtotal groups.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which extension provides the crosstab function in Postgres?
9. A) pg_trgm
10. B) hstore
11. C) tablefunc (*)
12. D) pg_stat_statements
13. Explanation: tablefunc supplies crosstab() for pivoting rows to columns; CREATE EXTENSION tablefunc to enable it.
14. Q2: ROLLUP(a, b) produces how many grouping levels?
15. A) 1
16. B) 2
17. C) 4
18. D) 3 (a+b, a, grand total) (*)
19. Explanation: ROLLUP(a, b) produces (a, b), (a), and () — hierarchical subtotals from finest to grand total.
20. Q3: CUBE(a, b) produces how many subtotal groups?
21. A) 4 (a+b, a, b, ()) (*)
22. B) 2
23. C) 3
24. D) 5
25. Explanation: CUBE produces all 2^n combinations of the n columns; for 2 columns: (a,b), (a), (b), ().
26. Q4: What does GROUPING(col) return on a subtotal row?
27. A) NULL
28. B) 1 (*)
29. C) 0
30. D) The column name
31. Explanation: GROUPING(col) is 1 when col's NULL is from ROLLUP/CUBE aggregation (a subtotal), 0 when it's an actual data NULL.
32. Q5: Which is the cleaner alternative to SUM(CASE WHEN cond THEN x END)?
33. A) GROUPING SETS
34. B) ROLLUP
35. C) SUM(x) FILTER (WHERE cond) (*)
36. D) LATERAL
37. Explanation: FILTER is more readable and often faster than CASE WHEN inside aggregates; it's also SQL:2003 standard.
38. Q6: Why prefer UNION ALL over UNION for unpivoting?
39. A) UNION ALL doesn't exist
40. B) UNION ALL sorts the output
41. C) UNION requires a primary key
42. D) UNION ALL is faster and preserves duplicates you usually want to keep (*)
43. Explanation: UNION dedupes (slow and may hide legitimate duplicate rows); UNION ALL keeps all rows, which is usually the unpivot intent.
44. Q7: When does CUBE become problematic?
45. A) With 4+ columns (2^n subtotal groups explode) (*)
46. B) With 2 columns
47. C) With NULLs
48. D) With text columns
49. Explanation: CUBE generates 2^n groups; 4 columns = 16 groups, 5 = 32. Use GROUPING SETS to pick only the ones you need.
50. Q8: What's a requirement of crosstab's output clause?
51. A) It can use any type
52. B) It must list column names and types exactly matching the pivot rows (*)
53. C) It must have exactly 2 columns
54. D) It must use jsonb
55. Explanation: crosstab requires `AS ct (col1 type1, col2 type2, ...)` declaring the exact output schema; mismatches silently truncate or error.
56. Q9: GROUPING SETS ((a,b), (a), ()) is equivalent to?
57. A) CUBE(a, b)
58. B) UNION ALL
59. C) ROLLUP(a, b) (*)
60. D) DISTINCT
61. Explanation: ROLLUP(a, b) = GROUPING SETS ((a,b), (a), ()); GROUPING SETS is the general form that lets you pick any combination.
62. Q10: ARRAY_AGG and jsonb_agg are commonly used for?
63. A) Pivoting
64. B) Unpivoting
65. C) Cycle detection
66. D) Packing grouped rows into a single cell (vertical packing) (*)
67. Explanation: ARRAY_AGG and jsonb_agg collect rows in a group into an array or JSON array — useful for shipping grouped data to APIs in one row.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which extension provides the crosstab function in Postgres?
  options:
    - pg_trgm
    - hstore
    - tablefunc
    - pg_stat_statements
  correctIndex: 2
  explanation: tablefunc supplies crosstab() for pivoting rows to columns; CREATE EXTENSION tablefunc to enable it.
- id: q2
  question: ROLLUP(a, b) produces how many grouping levels?
  options:
    - "1"
    - "2"
    - "4"
    - 3 (a+b, a, grand total)
  correctIndex: 3
  explanation: ROLLUP(a, b) produces (a, b), (a), and () — hierarchical subtotals from finest to grand total.
- id: q3
  question: CUBE(a, b) produces how many subtotal groups?
  options:
    - 4 (a+b, a, b, ())
    - "2"
    - "3"
    - "5"
  correctIndex: 0
  explanation: "CUBE produces all 2^n combinations of the n columns; for 2 columns: (a,b), (a), (b), ()."
- id: q4
  question: What does GROUPING(col) return on a subtotal row?
  options:
    - "NULL"
    - "1"
    - "0"
    - The column name
  correctIndex: 1
  explanation: GROUPING(col) is 1 when col's NULL is from ROLLUP/CUBE aggregation (a subtotal), 0 when it's an actual data NULL.
- id: q5
  question: Which is the cleaner alternative to SUM(CASE WHEN cond THEN x END)?
  options:
    - "?"
    - GROUPING SETS
    - ROLLUP
    - SUM(x) FILTER (WHERE cond)
    - LATERAL
  correctIndex: 3
  explanation: FILTER is more readable and often faster than CASE WHEN inside aggregates; it's also SQL:2003 standard.
- id: q6
  question: Why prefer UNION ALL over UNION for unpivoting?
  options:
    - UNION ALL doesn't exist
    - UNION ALL sorts the output
    - UNION requires a primary key
    - UNION ALL is faster and preserves duplicates you usually want to keep
  correctIndex: 3
  explanation: UNION dedupes (slow and may hide legitimate duplicate rows); UNION ALL keeps all rows, which is usually the unpivot intent.
- id: q7
  question: When does CUBE become problematic?
  options:
    - With 4+ columns (2^n subtotal groups explode)
    - With 2 columns
    - With NULLs
    - With text columns
  correctIndex: 0
  explanation: CUBE generates 2^n groups; 4 columns = 16 groups, 5 = 32. Use GROUPING SETS to pick only the ones you need.
- id: q8
  question: What's a requirement of crosstab's output clause?
  options:
    - It can use any type
    - It must list column names and types exactly matching the pivot rows
    - It must have exactly 2 columns
    - It must use jsonb
  correctIndex: 1
  explanation: crosstab requires `AS ct (col1 type1, col2 type2, ...)` declaring the exact output schema; mismatches silently truncate or error.
- id: q9
  question: GROUPING SETS ((a,b), (a), ()) is equivalent to?
  options:
    - CUBE(a, b)
    - UNION ALL
    - ROLLUP(a, b)
    - DISTINCT
  correctIndex: 2
  explanation: ROLLUP(a, b) = GROUPING SETS ((a,b), (a), ()); GROUPING SETS is the general form that lets you pick any combination.
- id: q10
  question: ARRAY_AGG and jsonb_agg are commonly used for?
  options:
    - Pivoting
    - Unpivoting
    - Cycle detection
    - Packing grouped rows into a single cell (vertical packing)
  correctIndex: 3
  explanation: ARRAY_AGG and jsonb_agg collect rows in a group into an array or JSON array — useful for shipping grouped data to APIs in one row.
```

