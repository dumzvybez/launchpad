---
slug: sql-subqueries-ctes
id: sql-05
track: sql
order: 5
title: Subqueries and CTEs
description: Decompose complex queries with scalar, correlated, and EXISTS subqueries, then refactor them into readable Common Table Expressions (CTEs) using WITH — and learn when to prefer one over the other.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=2700s
whyItMatters: Decompose complex queries with scalar, correlated, and EXISTS subqueries, then refactor them into readable Common Table Expressions (CTEs) using WITH — and learn when to prefer one over the other.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Subqueries and CTEs

## Subqueries and CTEs

### Why It Matters

Decompose complex queries with scalar, correlated, and EXISTS subqueries, then refactor them into readable Common Table Expressions (CTEs) using WITH — and learn when to prefer one over the other.

Decompose complex queries with scalar, correlated, and EXISTS subqueries, then refactor them into readable Common Table Expressions (CTEs) using WITH — and learn when to prefer one over the other.

### Prerequisites

- Stage 4: GROUP BY, HAVING, and Aggregate Functions.
- Solid grasp of JOINs and three-valued logic.

### Topics

- Scalar subqueries (one row, one column)
- Correlated subqueries (reference outer query)
- EXISTS / NOT EXISTS — semi-joins and anti-joins
- IN / NOT IN — and the NULL trap
- Subqueries in FROM (derived tables)
- Common Table Expressions: WITH name AS (...)
- Multiple CTEs, referencing one another
- MATERIALIZED hint and CTE inlining (Postgres 12+)

### Key Concepts

- A scalar subquery returns exactly one column and one row; if it returns 0 rows, the value is NULL.
- Correlated subqueries re-execute per outer row — expensive; often a JOIN or window function is faster.
- EXISTS short-circuits on the first match; NOT EXISTS is the NULL-safe equivalent of NOT IN.
- CTEs are primarily a readability and DRY tool; in Postgres 12+ they're inlined by default unless MATERIALIZED is requested.
- Subqueries in FROM must be aliased; CTEs are named once and can be referenced multiple times.
- Recursive CTEs are covered in Stage 14; non-recursive CTEs here are just named subqueries.

```sql
-- Customers who paid more than the average payment
SELECT customer_id, SUM(amount) AS total
FROM payment
GROUP BY customer_id
HAVING SUM(amount) > (SELECT AVG(amount) FROM payment);
```
Caption: Scalar subquery

### Common Pitfalls

- NOT IN with NULLs — if the subquery returns any NULL, NOT IN returns no rows at all; use NOT EXISTS.
- Correlated subquery performance — re-executes per outer row; rewrite as JOIN or window function when possible.
- Treating CTEs as optimization fences — pre-Postgres 12, CTEs were always materialized; now they're inlined unless MATERIALIZED is set.
- Subquery returning multiple rows in a scalar context — `WHERE x = (SELECT y FROM t)` errors if t has >1 row; use IN, ANY, or LIMIT 1.
- Over-nesting — deeply nested subqueries are unreadable; refactor into a chain of named CTEs.

### Real-World Applications

- Facebook's News Feed ranking uses CTEs to decompose multi-stage feature aggregation before feeding the ML ranker.
- Stripe Sigma exposes a SQL interface where analysts write CTEs to join charge, customer, and refund tables across accounts.
- LinkedIn's data warehouse uses layered CTEs for ETL staging models in dbt — each CTE becomes a view.
- Airbnb's host analytics uses EXISTS subqueries to identify "power hosts" (>= 10 bookings) without JOIN fan-out.

### Interview Questions

- 1. Difference between IN and EXISTS? — IN collects values then matches; EXISTS short-circuits on first match; EXISTS is typically faster with large subquery results.
- 2. Why does NOT IN return no rows when the subquery has NULLs? — Because `x NOT IN (a, NULL)` evaluates to NULL, not TRUE; use NOT EXISTS.
- 3. What's a correlated subquery? — A subquery that references the outer query's columns; re-executes per outer row.
- 4. Are CTEs materialized in Postgres 12+? — By default no, they're inlined; use MATERIALIZED to force it (e.g. when referenced multiple times).
- 5. When should you use a CTE vs a subquery? — CTE for readability and reuse; subquery for one-off scalar values; performance is usually equivalent.

### Mini Project

Build a Customer Segmentation Query Pack: A set of CTEs that classify customers as VIP (>$200 lifetime), Active (rented in last 30d), At-Risk (rented in last 90d but not 30d), and Lapsed (no rental in 90d). Suggested approach:
  - Use one CTE per segment with HAVING filters
  - Use NOT EXISTS for the "no rental" segments
  - UNION ALL the segments into a single result with a segment label
  - Wrap with a final CTE that computes segment counts
  - Output as a single SELECT suitable for a Grafana table panel

### Exercises

1. Rewrite a correlated subquery as an equivalent JOIN; compare EXPLAIN output.
2. Find customers who have rented at least one film from every category — use GROUP BY + HAVING COUNT(DISTINCT) = N.
3. Replace NOT IN with NOT EXISTS in a query and verify identical results (and NULL-safety).
4. Refactor a 4-deep nested subquery into a chain of named CTEs.
5. Add MATERIALIZED to a CTE referenced 3 times; measure the difference with EXPLAIN ANALYZE.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does a scalar subquery return?
9. A) One row, one column (*)
10. B) One row, multiple columns
11. C) Multiple rows, one column
12. D) A boolean
13. Explanation: A scalar subquery returns exactly one column and at most one row; if 0 rows, the value is NULL.
14. Q2: What happens with `x NOT IN (SELECT y FROM t)` if t.y contains NULL?
15. A) Returns x not in the non-NULL y values
16. B) Returns no rows at all (*)
17. C) Returns only NULL x values
18. D) Raises a syntax error
19. Explanation: `x NOT IN (a, NULL)` evaluates to NULL for every x; use NOT EXISTS for NULL-safe anti-joins.
20. Q3: Which is the most NULL-safe way to express an anti-join?
21. A) NOT IN
22. B) LEFT JOIN ... WHERE inner.pk IS NULL
23. C) NOT EXISTS (*)
24. D) COUNT(*) = 0 in HAVING
25. Explanation: NOT EXISTS short-circuits and is immune to NULLs in the subquery; LEFT JOIN ... IS NULL also works but is less readable.
26. Q4: In Postgres 12+, what is the default CTE behavior?
27. A) Always materialized
28. B) Always cached for the session
29. C) Always treated as a temp table
30. D) Always inlined (unless MATERIALIZED) (*)
31. Explanation: Since Postgres 12, CTEs are inlined by default; use MATERIALIZED to force materialization when referenced multiple times.
32. Q5: A correlated subquery is one that?
33. A) References columns from the outer query (*)
34. B) Returns correlated rows
35. C) Uses ORDER BY
36. D) Has a recursive member
37. Explanation: Correlated subqueries depend on the outer row and re-execute per outer row; often slower than JOIN equivalents.
38. Q6: When does `WHERE x = (SELECT y FROM t)` error?
39. A) Never
40. B) When t returns more than one row (*)
41. C) When t has 0 rows
42. D) When y is NULL
43. Explanation: A scalar-context subquery must return 0 or 1 rows; >1 raises "more than one row returned by a subquery used as an expression".
44. Q7: What does EXISTS return?
45. A) A count of matching rows
46. B) The matching rows themselves
47. C) TRUE/FALSE per outer row, short-circuiting on first match (*)
48. D) NULL if no match
49. Explanation: EXISTS is a boolean predicate that stops at the first matching row; NOT EXISTS is its negation, both NULL-safe.
50. Q8: Why use CTEs over nested subqueries?
51. A) CTEs are always faster
52. B) CTEs are executed in parallel
53. C) CTEs bypass the query planner
54. D) Readability, named steps, and reuse (*)
55. Explanation: CTEs are a readability and DRY tool; performance is usually equivalent to subqueries since Postgres 12 inlines them.
56. Q9: What is the keyword for forcing CTE materialization?
57. A) MATERIALIZED (*)
58. B) CACHED
59. C) STORED
60. D) INLINE OFF
61. Explanation: `WITH name AS MATERIALIZED (...)` forces Postgres to compute and store the CTE once, useful when referenced multiple times.
62. Q10: Which is a typical use case for a CTE?
63. A) Replacing a primary key
64. B) Decomposing a multi-step aggregation into named, composable steps (*)
65. C) Creating an index
66. D) Defining a foreign key
67. Explanation: CTEs shine for multi-step ETL-style queries where each step is a named, testable unit that chains into the next.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does a scalar subquery return?
  options:
    - One row, one column
    - One row, multiple columns
    - Multiple rows, one column
    - A boolean
  correctIndex: 0
  explanation: A scalar subquery returns exactly one column and at most one row; if 0 rows, the value is NULL.
- id: q2
  question: What happens with `x NOT IN (SELECT y FROM t)` if t.y contains NULL?
  options:
    - Returns x not in the non-NULL y values
    - Returns no rows at all
    - Returns only NULL x values
    - Raises a syntax error
    - "` evaluates to NULL for every x; use NOT EXISTS for NULL-safe anti-joins."
  correctIndex: 1
  explanation: "`x NOT IN (a, NULL)` evaluates to NULL for every x; use NOT EXISTS for NULL-safe anti-joins."
- id: q3
  question: Which is the most NULL-safe way to express an anti-join?
  options:
    - NOT IN
    - LEFT JOIN ... WHERE inner.pk IS NULL
    - NOT EXISTS
    - COUNT(*) = 0 in HAVING
  correctIndex: 2
  explanation: NOT EXISTS short-circuits and is immune to NULLs in the subquery; LEFT JOIN ... IS NULL also works but is less readable.
- id: q4
  question: In Postgres 12+, what is the default CTE behavior?
  options:
    - Always materialized
    - Always cached for the session
    - Always treated as a temp table
    - Always inlined (unless MATERIALIZED)
  correctIndex: 3
  explanation: Since Postgres 12, CTEs are inlined by default; use MATERIALIZED to force materialization when referenced multiple times.
- id: q5
  question: A correlated subquery is one that?
  options:
    - References columns from the outer query
    - Returns correlated rows
    - Uses ORDER BY
    - Has a recursive member
  correctIndex: 0
  explanation: Correlated subqueries depend on the outer row and re-execute per outer row; often slower than JOIN equivalents.
- id: q6
  question: When does `WHERE x = (SELECT y FROM t)` error?
  options:
    - Never
    - When t returns more than one row
    - When t has 0 rows
    - When y is NULL
  correctIndex: 1
  explanation: A scalar-context subquery must return 0 or 1 rows; >1 raises "more than one row returned by a subquery used as an expression".
- id: q7
  question: What does EXISTS return?
  options:
    - A count of matching rows
    - The matching rows themselves
    - TRUE/FALSE per outer row, short-circuiting on first match
    - NULL if no match
  correctIndex: 2
  explanation: EXISTS is a boolean predicate that stops at the first matching row; NOT EXISTS is its negation, both NULL-safe.
- id: q8
  question: Why use CTEs over nested subqueries?
  options:
    - CTEs are always faster
    - CTEs are executed in parallel
    - CTEs bypass the query planner
    - Readability, named steps, and reuse
  correctIndex: 3
  explanation: CTEs are a readability and DRY tool; performance is usually equivalent to subqueries since Postgres 12 inlines them.
- id: q9
  question: What is the keyword for forcing CTE materialization?
  options:
    - MATERIALIZED
    - CACHED
    - STORED
    - INLINE OFF
  correctIndex: 0
  explanation: "`WITH name AS MATERIALIZED (...)` forces Postgres to compute and store the CTE once, useful when referenced multiple times."
- id: q10
  question: Which is a typical use case for a CTE?
  options:
    - Replacing a primary key
    - Decomposing a multi-step aggregation into named, composable steps
    - Creating an index
    - Defining a foreign key
  correctIndex: 1
  explanation: CTEs shine for multi-step ETL-style queries where each step is a named, testable unit that chains into the next.
```

