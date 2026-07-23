---
slug: sql-select-where-order
id: sql-02
track: sql
order: 2
title: SELECT, WHERE, and ORDER BY
description: Filter and sort rows with WHERE, comparison and pattern operators, DISTINCT, ORDER BY, and LIMIT/OFFSET — the everyday vocabulary of every analyst and backend engineer.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=600s
whyItMatters: Filter and sort rows with WHERE, comparison and pattern operators, DISTINCT, ORDER BY, and LIMIT/OFFSET — the everyday vocabulary of every analyst and backend engineer.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# SELECT, WHERE, and ORDER BY

## SELECT, WHERE, and ORDER BY

### Why It Matters

Filter and sort rows with WHERE, comparison and pattern operators, DISTINCT, ORDER BY, and LIMIT/OFFSET — the everyday vocabulary of every analyst and backend engineer.

Filter and sort rows with WHERE, comparison and pattern operators, DISTINCT, ORDER BY, and LIMIT/OFFSET — the everyday vocabulary of every analyst and backend engineer.

### Prerequisites

- Stage 1: Getting Started with SQL and Relational Databases.
- A working Postgres instance and a sample schema (e.g. pagila/dvdrental).

### Topics

- SELECT list, FROM, aliases (AS, implicit)
- WHERE with =, <>, <, >, <=, >=, BETWEEN, IN, NOT IN
- IS NULL / IS NOT NULL — NULL-aware filtering
- LIKE, ILIKE, SIMILAR TO, regex (~, ~*)
- Boolean operators: AND, OR, NOT, and precedence
- ORDER BY (ASC/DESC), multiple columns, NULLS FIRST/LAST
- LIMIT, OFFSET, and FETCH FIRST n ROWS ONLY
- DISTINCT and DISTINCT ON (Postgres extension)

### Key Concepts

- Three-valued logic: any comparison with NULL yields NULL, not false; WHERE keeps only rows where the predicate is TRUE.
- AND binds tighter than OR; always parenthesize mixed expressions.
- ORDER BY can reference output column aliases, expressions, or ordinal positions (avoid ordinals in production).
- LIMIT without ORDER BY is non-deterministic; never rely on it for stable pagination.
- `NULLS FIRST/LAST` differs per database — Postgres defaults to NULLS LAST for ASC, NULLS FIRST for DESC.
- `DISTINCT ON (col)` returns the first row per group when combined with ORDER BY — a Postgres-specific deduplication pattern.

```sql
SELECT title, release_year, rental_rate
FROM film
WHERE rental_rate >= 2.99
  AND rating IN ('PG', 'PG-13')
  AND release_year BETWEEN 2005 AND 2010
ORDER BY rental_rate DESC, title ASC;
```
Caption: Filtering with WHERE

### Common Pitfalls

- Treating NULL as a value — `WHERE col <> 5` excludes NULLs; use `IS DISTINCT FROM 5` if you want NULL-safe inequality.
- LIKE case sensitivity — `LIKE 'A%'` is case-sensitive in Postgres; use ILIKE for case-insensitive matches.
- OFFSET pagination — `LIMIT 25 OFFSET 100000` scans 100k rows first; switch to keyset (WHERE id > last_id) for stable, fast pagination.
- NOT IN with NULLs — `WHERE x NOT IN (SELECT ...)` returns nothing if the subquery has any NULL; use NOT EXISTS instead.
- Forgetting NULLS FIRST/LAST — sorting behavior on NULLs is database-specific; make it explicit when it matters.

### Real-World Applications

- LinkedIn's People You May Know pipeline runs massive WHERE/ORDER BY queries against member graphs, using keyset pagination to avoid OFFSET scans.
- Stripe Radar filters transactions with multi-clause WHERE on amount, country, and risk score before sending them to ML scoring.
- Airbnb search pre-filters listings by geobox and price range in SQL before re-ranking in an in-memory service.
- Facebook's internal analytics tools rely on ORDER BY + LIMIT patterns over Hive-style warehouses for top-N reports.

### Interview Questions

- 1. Why does `WHERE col <> 5` not return NULL rows? — Comparisons with NULL yield NULL, which is filtered out by WHERE; use IS DISTINCT FROM for NULL-safe inequality.
- 2. What's the difference between LIKE and ILIKE? — LIKE is case-sensitive; ILIKE is case-insensitive (Postgres extension).
- 3. Why is OFFSET pagination slow on large tables? — The DB must scan and discard all skipped rows; keyset pagination avoids this with WHERE on an indexed column.
- 4. What does DISTINCT ON (col) do in Postgres? — Returns the first row per distinct value of col when combined with ORDER BY.
- 5. How do AND and OR interact in WHERE? — AND binds tighter than OR; use parentheses to disambiguate mixed expressions.

### Mini Project

Build a Movie Finder CLI: Given a genre, max rating cap, and optional title prefix, print the top-20 films by rental rate, then by title. Inputs come from argv; output is aligned text. Suggested approach:
  - Connect with psql via subprocess or use psycopg2 directly
  - Build the WHERE with parameterized queries (no string concatenation)
  - Use ILIKE for the title prefix
  - Sort by rental_rate DESC, title ASC, with NULLS LAST
  - Use FETCH FIRST 20 ROWS ONLY (SQL standard) instead of LIMIT

### Exercises

1. Write a query that lists all customers whose email ends in `.org` and whose create_date is in 2020.
2. Find all films with a NULL description; then fix the query to also include films whose description is empty string.
3. Write a keyset-paginated query for `payment` ordered by payment_date DESC, payment_id DESC.
4. Use DISTINCT ON to find the most expensive rental per customer.
5. Compare `WHERE col IN (NULL, 1, 2)` to `WHERE col = 1 OR col = 2` — explain why they are NOT equivalent.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `WHERE x = NULL` return for any x?
9. A) True if x is NULL
10. B) Nothing — use IS NULL instead (*)
11. C) All rows
12. D) A syntax error
13. Explanation: Comparisons with NULL yield NULL, which WHERE filters out; always use IS NULL or IS NOT NULL for NULL tests.
14. Q2: Which operator is case-insensitive in Postgres?
15. A) LIKE
16. B) REGEXP
17. C) ILIKE (*)
18. D) MATCH
19. Explanation: ILIKE is Postgres' case-insensitive variant of LIKE; MySQL's LIKE is CI only under specific collations.
20. Q3: What is the safest way to do NULL-aware inequality?
21. A) x <> y
22. B) x != y
23. C) NOT (x = y)
24. D) x IS DISTINCT FROM y (*)
25. Explanation: IS DISTINCT FROM treats NULL as a comparable value, returning TRUE when one side is NULL and the other isn't.
26. Q4: Why is OFFSET pagination slow on large tables?
27. A) The DB still scans and discards all skipped rows (*)
28. B) It triggers full table scans always
29. C) It locks the table
30. D) It returns wrong results
31. Explanation: OFFSET N requires reading N rows before the LIMIT window; keyset pagination (WHERE id > last_id) avoids this.
32. Q5: What does `WHERE x NOT IN (SELECT y FROM t)` return if t.y contains a NULL?
33. A) All x not in t.y
34. B) No rows at all (*)
35. C) A syntax error
36. D) Only NULL x values
37. Explanation: NOT IN with a NULL in the list evaluates to NULL for every row; use NOT EXISTS for NULL-safe anti-joins.
38. Q6: Which is the SQL-standard alternative to LIMIT 25?
39. A) TOP 25
40. B) ROWNUM <= 25
41. C) FETCH FIRST 25 ROWS ONLY (*)
42. D) TAKE 25
43. Explanation: FETCH FIRST n ROWS ONLY is SQL:2008; TOP is SQL Server, ROWNUM is Oracle.
44. Q7: In Postgres, where do NULLs sort by default in DESC order?
45. A) NULLS LAST always
46. B) NULLS FIRST always
47. C) NULLS LAST for ASC, NULLS FIRST for DESC
48. D) NULLS FIRST for ASC, NULLS LAST for DESC (*)
49. Explanation: Postgres defaults to NULLS LAST for ASC, NULLS FIRST for DESC; override with explicit NULLS FIRST/LAST.
50. Q8: What does `DISTINCT ON (col)` return?
51. A) The first row per distinct col (with matching ORDER BY) (*)
52. B) All rows with distinct col
53. C) Only the col column, deduplicated
54. D) An error in Postgres
55. Explanation: DISTINCT ON (col) is a Postgres extension that returns the first row per group when combined with ORDER BY col, ...
56. Q9: Which operator binds tighter in WHERE: AND or OR?
57. A) OR
58. B) AND (*)
59. C) They have equal precedence
60. D) It depends on the database
61. Explanation: AND has higher precedence than OR; use parentheses to make mixed expressions unambiguous.
62. Q10: Which is the recommended pattern for stable pagination?
63. A) OFFSET and LIMIT
64. B) Page-number math
65. C) Keyset pagination with WHERE id > last_id (*)
66. D) Random sampling
67. Explanation: Keyset (cursor) pagination uses an indexed sort key from the last seen row, giving stable results and O(log n) seeks.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `WHERE x = NULL` return for any x?
  options:
    - True if x is NULL
    - Nothing — use IS NULL instead
    - All rows
    - A syntax error
  correctIndex: 1
  explanation: Comparisons with NULL yield NULL, which WHERE filters out; always use IS NULL or IS NOT NULL for NULL tests.
- id: q2
  question: Which operator is case-insensitive in Postgres?
  options:
    - LIKE
    - REGEXP
    - ILIKE
    - MATCH
  correctIndex: 2
  explanation: ILIKE is Postgres' case-insensitive variant of LIKE; MySQL's LIKE is CI only under specific collations.
- id: q3
  question: What is the safest way to do NULL-aware inequality?
  options:
    - x <> y
    - x != y
    - NOT (x = y)
    - x IS DISTINCT FROM y
  correctIndex: 3
  explanation: IS DISTINCT FROM treats NULL as a comparable value, returning TRUE when one side is NULL and the other isn't.
- id: q4
  question: Why is OFFSET pagination slow on large tables?
  options:
    - The DB still scans and discards all skipped rows
    - It triggers full table scans always
    - It locks the table
    - It returns wrong results
  correctIndex: 0
  explanation: OFFSET N requires reading N rows before the LIMIT window; keyset pagination (WHERE id > last_id) avoids this.
- id: q5
  question: What does `WHERE x NOT IN (SELECT y FROM t)` return if t.y contains a NULL?
  options:
    - All x not in t.y
    - No rows at all
    - A syntax error
    - Only NULL x values
  correctIndex: 1
  explanation: NOT IN with a NULL in the list evaluates to NULL for every row; use NOT EXISTS for NULL-safe anti-joins.
- id: q6
  question: Which is the SQL-standard alternative to LIMIT 25?
  options:
    - TOP 25
    - ROWNUM <= 25
    - FETCH FIRST 25 ROWS ONLY
    - TAKE 25
  correctIndex: 2
  explanation: FETCH FIRST n ROWS ONLY is SQL:2008; TOP is SQL Server, ROWNUM is Oracle.
- id: q7
  question: In Postgres, where do NULLs sort by default in DESC order?
  options:
    - NULLS LAST always
    - NULLS FIRST always
    - NULLS LAST for ASC, NULLS FIRST for DESC
    - NULLS FIRST for ASC, NULLS LAST for DESC
  correctIndex: 3
  explanation: Postgres defaults to NULLS LAST for ASC, NULLS FIRST for DESC; override with explicit NULLS FIRST/LAST.
- id: q8
  question: What does `DISTINCT ON (col)` return?
  options:
    - The first row per distinct col (with matching ORDER BY)
    - All rows with distinct col
    - Only the col column, deduplicated
    - An error in Postgres
  correctIndex: 0
  explanation: DISTINCT ON (col) is a Postgres extension that returns the first row per group when combined with ORDER BY col, ...
- id: q9
  question: "Which operator binds tighter in WHERE: AND or OR?"
  options:
    - OR
    - AND
    - They have equal precedence
    - It depends on the database
  correctIndex: 1
  explanation: AND has higher precedence than OR; use parentheses to make mixed expressions unambiguous.
- id: q10
  question: Which is the recommended pattern for stable pagination?
  options:
    - OFFSET and LIMIT
    - Page-number math
    - Keyset pagination with WHERE id > last_id
    - Random sampling
  correctIndex: 2
  explanation: Keyset (cursor) pagination uses an indexed sort key from the last seen row, giving stable results and O(log n) seeks.
```

