---
slug: sql-group-having-aggregate-functions
id: sql-04
track: sql
order: 4
title: GROUP BY, HAVING, and Aggregate Functions
description: Aggregate rows into groups with GROUP BY, filter groups with HAVING, and master COUNT/SUM/AVG/MIN/MAX plus the subtle difference between COUNT(*), COUNT(col), and COUNT(DISTINCT col).
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=2000s
whyItMatters: Aggregate rows into groups with GROUP BY, filter groups with HAVING, and master COUNT/SUM/AVG/MIN/MAX plus the subtle difference between COUNT(*), COUNT(col), and COUNT(DISTINCT col).
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# GROUP BY, HAVING, and Aggregate Functions

## GROUP BY, HAVING, and Aggregate Functions

### Why It Matters

Aggregate rows into groups with GROUP BY, filter groups with HAVING, and master COUNT/SUM/AVG/MIN/MAX plus the subtle difference between COUNT(*), COUNT(col), and COUNT(DISTINCT col).

Aggregate rows into groups with GROUP BY, filter groups with HAVING, and master COUNT/SUM/AVG/MIN/MAX plus the subtle difference between COUNT(*), COUNT(col), and COUNT(DISTINCT col).

### Prerequisites

- Stage 3: JOINs — Inner, Left, Right, Full.
- Comfort with WHERE and ORDER BY.

### Topics

- Aggregate functions: COUNT, SUM, AVG, MIN, MAX, ARRAY_AGG, STRING_AGG
- GROUP BY with one and multiple columns
- HAVING — filtering groups after aggregation
- COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)
- GROUP BY with expressions and dates (date_trunc, to_char)
- FILTER clause (Postgres extension, SQL standard since SQL:2003)
- GROUPING SETS, ROLLUP, CUBE (preview; full coverage in Stage 15)
- Aggregates and NULLs — silent exclusion

### Key Concepts

- Aggregates collapse many rows into one; non-aggregated columns in SELECT must appear in GROUP BY (or be functionally dependent on a grouped key — Postgres allows this for primary keys).
- WHERE filters rows BEFORE grouping; HAVING filters groups AFTER grouping.
- COUNT(*) counts rows including NULLs; COUNT(col) counts non-NULL values of col; COUNT(DISTINCT col) counts unique non-NULL values.
- AVG ignores NULLs; SUM ignores NULLs; both return NULL if all inputs are NULL.
- The FILTER clause (Postgres) is cleaner and faster than CASE WHEN for conditional aggregation.
- `GROUP BY 1` (ordinal) is supported but discouraged in production — schema changes silently break it.

```sql
SELECT
    customer_id,
    COUNT(*)            AS rental_count,
    SUM(amount)         AS total_paid,
    AVG(amount)::numeric(10,2) AS avg_paid,
    MAX(payment_date)   AS last_payment
FROM payment
GROUP BY customer_id
ORDER BY total_paid DESC
LIMIT 10;
```
Caption: Basic grouping

### Common Pitfalls

- COUNT(col) silently ignores NULLs — use COUNT(*) for row counts and COUNT(col) only when you specifically want non-NULL counts.
- Non-aggregated column missing from GROUP BY — Postgres raises "column must appear in GROUP BY or be used in an aggregate"; add it to GROUP BY or wrap in MAX()/MIN() if you don't care which value.
- WHERE vs HAVING confusion — WHERE can't reference aggregates; HAVING can. Filtering by SUM(x) > 100 must go in HAVING.
- AVG surprise — `AVG(col)` ignores NULLs, so AVG over (1, 2, NULL) = 1.5, not 1.0; use SUM(col)/COUNT(*) explicitly if you need the latter.
- GROUP BY ordinal in production — `GROUP BY 1` is fragile; renaming a column doesn't break it but adding/reordering columns in SELECT does.

### Real-World Applications

- Stripe aggregates daily settlement totals with GROUP BY date_trunc('day', created) across billions of payments.
- Spotify Wrapped is essentially a massive GROUP BY user_id with FILTER clauses for top artist, top track, total minutes.
- LinkedIn's Who Viewed My Profile groups profile views by viewer industry and week using date_trunc + GROUP BY.
- Airbnb's host dashboard uses GROUP BY listing_id with conditional FILTERs for booked nights, blocked nights, and inquiries.

### Interview Questions

- 1. Difference between WHERE and HAVING? — WHERE filters rows before grouping; HAVING filters groups after aggregation, can reference aggregates.
- 2. Difference between COUNT(*) and COUNT(col)? — COUNT(*) counts all rows; COUNT(col) counts non-NULL values of col.
- 3. Why does AVG(NULL, 1, 2) return 1.5? — AVG ignores NULLs; divide by COUNT(*) if you want the NULLs counted as zeros.
- 4. What does the FILTER clause do? — Applies an aggregate to a subset of rows in the group, cleaner than CASE WHEN.
- 5. Can you SELECT a column that's not in GROUP BY? — Only if it's functionally dependent on a grouped column (e.g. grouped by primary key); otherwise the DB raises an error.

### Mini Project

Build a Daily Revenue Dashboard query pack: A set of saved queries that produce daily, weekly, and monthly revenue with payment counts, average ticket size, and big-ticket share (amount > 10). Suggested approach:
  - Use date_trunc('day'/'week'/'month', payment_date) AS bucket
  - Use FILTER for big-ticket and small-ticket sums
  - Use HAVING for buckets with at least 100 payments
  - Project numeric(p,2) casts for clean currency output
  - Save as .sql files run by `psql -f daily.sql`

### Exercises

1. Write a query that counts rentals per store; output store_id and rental_count.
2. Find customers whose average payment exceeds $5 — use HAVING AVG(amount) > 5.
3. Demonstrate the difference: SELECT COUNT(*), COUNT(returned_date), COUNT(DISTINCT customer_id) FROM rental.
4. Rewrite a CASE-based conditional sum using the FILTER clause and confirm identical results.
5. Group payments by ISO week (to_char(payment_date, 'IYYY-IW')) and find the top-3 weeks by revenue.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which clause filters groups AFTER aggregation?
9. A) WHERE
10. B) GROUP BY
11. C) DISTINCT
12. D) HAVING (*)
13. Explanation: HAVING filters groups formed by GROUP BY and can reference aggregate functions; WHERE filters rows before grouping.
14. Q2: What does COUNT(col) count?
15. A) Non-NULL values of col (*)
16. B) All rows
17. C) Distinct values of col
18. D) NULL values of col
19. Explanation: COUNT(col) ignores NULLs; COUNT(*) counts all rows; COUNT(DISTINCT col) counts unique non-NULL values.
20. Q3: AVG(1, 2, NULL) returns what in Postgres?
21. A) 1.0
22. B) 1.5 (*)
23. C) NULL
24. D) 2.0
25. Explanation: AVG ignores NULLs; (1+2)/2 = 1.5. Use SUM(col)::float / COUNT(*) if you want NULLs counted as zeros.
26. Q4: Which is the cleaner form of conditional aggregation?
27. A) CASE WHEN in SUM
28. B) Subqueries with UNION ALL
29. C) The FILTER clause (*)
30. D) GROUPING SETS
31. Explanation: SUM(amount) FILTER (WHERE x > 5) is more readable and often faster than SUM(CASE WHEN x > 5 THEN amount END).
32. Q5: A SELECT lists column `name` that's not in GROUP BY — what happens?
33. A) Returns the first value of name
34. B) Returns a random value
35. C) Silently uses MAX(name)
36. D) Postgres raises an error (*)
37. Explanation: Postgres enforces the single-value rule; either add name to GROUP BY, aggregate it (MAX/MIN), or group by a functional-dependency PK.
38. Q6: What does `GROUP BY 1` mean?
39. A) Group by the first SELECT column (ordinal form) (*)
40. B) Group by a column literally named "1"
41. C) Group by the primary key
42. D) Same as DISTINCT
43. Explanation: Ordinals reference SELECT position; supported but discouraged in production because SELECT reorders silently break it.
44. Q7: Which is the correct way to find groups with SUM(amount) > 100?
45. A) WHERE SUM(amount) > 100
46. B) HAVING SUM(amount) > 100 (*)
47. C) GROUP BY HAVING SUM(amount) > 100
48. D) FILTER (SUM(amount) > 100)
49. Explanation: Aggregate predicates go in HAVING; WHERE cannot reference aggregates.
50. Q8: date_trunc('month', ts) returns?
51. A) A text label like '2020-01'
52. B) An integer month number
53. C) A timestamp truncated to the first instant of the month (*)
54. D) An interval
55. Explanation: date_trunc returns a timestamp at the start of the bucket (e.g. 2020-01-01 00:00:00); use to_char for formatted labels.
56. Q9: Which is TRUE of SUM over an all-NULL group?
57. A) Returns 0
58. B) Raises an error
59. C) Returns the count of rows
60. D) Returns NULL (*)
61. Explanation: SUM ignores NULLs and returns NULL if all inputs are NULL; wrap in COALESCE(SUM(x), 0) for a zero default.
62. Q10: Which is the SQL-standard alternative to Postgres FILTER?
63. A) CASE WHEN inside the aggregate (*)
64. B) GROUPING SETS
65. C) WINDOW functions
66. D) ROLLUP
67. Explanation: SUM(CASE WHEN cond THEN x END) is the SQL:2003-portable form; FILTER is the Postgres/SQL:2003 extension that's more concise.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which clause filters groups AFTER aggregation?
  options:
    - WHERE
    - GROUP BY
    - DISTINCT
    - HAVING
  correctIndex: 3
  explanation: HAVING filters groups formed by GROUP BY and can reference aggregate functions; WHERE filters rows before grouping.
- id: q2
  question: What does COUNT(col) count?
  options:
    - Non-NULL values of col
    - All rows
    - Distinct values of col
    - NULL values of col
  correctIndex: 0
  explanation: COUNT(col) ignores NULLs; COUNT(*) counts all rows; COUNT(DISTINCT col) counts unique non-NULL values.
- id: q3
  question: AVG(1, 2, NULL) returns what in Postgres?
  options:
    - returns what in Postgres?
    - "1.0"
    - "1.5"
    - "NULL"
    - "2.0"
  correctIndex: 2
  explanation: AVG ignores NULLs; (1+2)/2 = 1.5. Use SUM(col)::float / COUNT(*) if you want NULLs counted as zeros.
- id: q4
  question: Which is the cleaner form of conditional aggregation?
  options:
    - CASE WHEN in SUM
    - Subqueries with UNION ALL
    - The FILTER clause
    - GROUPING SETS
    - .
  correctIndex: 2
  explanation: SUM(amount) FILTER (WHERE x > 5) is more readable and often faster than SUM(CASE WHEN x > 5 THEN amount END).
- id: q5
  question: A SELECT lists column `name` that's not in GROUP BY — what happens?
  options:
    - Returns the first value of name
    - Returns a random value
    - Silently uses MAX(name)
    - Postgres raises an error
    - ", or group by a functional-dependency PK."
  correctIndex: 3
  explanation: Postgres enforces the single-value rule; either add name to GROUP BY, aggregate it (MAX/MIN), or group by a functional-dependency PK.
- id: q6
  question: What does `GROUP BY 1` mean?
  options:
    - Group by the first SELECT column (ordinal form)
    - Group by a column literally named "1"
    - Group by the primary key
    - Same as DISTINCT
  correctIndex: 0
  explanation: Ordinals reference SELECT position; supported but discouraged in production because SELECT reorders silently break it.
- id: q7
  question: Which is the correct way to find groups with SUM(amount) > 100?
  options:
    - WHERE SUM(amount) > 100
    - HAVING SUM(amount) > 100
    - GROUP BY HAVING SUM(amount) > 100
    - FILTER (SUM(amount) > 100)
  correctIndex: 1
  explanation: Aggregate predicates go in HAVING; WHERE cannot reference aggregates.
- id: q8
  question: date_trunc('month', ts) returns?
  options:
    - A text label like '2020-01'
    - An integer month number
    - A timestamp truncated to the first instant of the month
    - An interval
  correctIndex: 2
  explanation: date_trunc returns a timestamp at the start of the bucket (e.g. 2020-01-01 00:00:00); use to_char for formatted labels.
- id: q9
  question: Which is TRUE of SUM over an all-NULL group?
  options:
    - Returns 0
    - Raises an error
    - Returns the count of rows
    - Returns NULL
  correctIndex: 3
  explanation: SUM ignores NULLs and returns NULL if all inputs are NULL; wrap in COALESCE(SUM(x), 0) for a zero default.
- id: q10
  question: Which is the SQL-standard alternative to Postgres FILTER?
  options:
    - CASE WHEN inside the aggregate
    - GROUPING SETS
    - WINDOW functions
    - ROLLUP
    - is the SQL:2003-portable form; FILTER is the Postgres/SQL:2003 extension that's more concise.
  correctIndex: 0
  explanation: SUM(CASE WHEN cond THEN x END) is the SQL:2003-portable form; FILTER is the Postgres/SQL:2003 extension that's more concise.
```

