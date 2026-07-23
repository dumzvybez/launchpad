---
slug: sql-joins-inner-left-right-full
id: sql-03
track: sql
order: 3
title: JOINs — Inner, Left, Right, Full
description: Combine rows from two or more tables using INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self-joins — and learn why missing JOIN conditions cause silent Cartesian-product explosions.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=1300s
whyItMatters: Combine rows from two or more tables using INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self-joins — and learn why missing JOIN conditions cause silent Cartesian-product explosions.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# JOINs — Inner, Left, Right, Full

## JOINs — Inner, Left, Right, Full

### Why It Matters

Combine rows from two or more tables using INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self-joins — and learn why missing JOIN conditions cause silent Cartesian-product explosions.

Combine rows from two or more tables using INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self-joins — and learn why missing JOIN conditions cause silent Cartesian-product explosions.

### Prerequisites

- Stage 2: SELECT, WHERE, and ORDER BY.
- Understanding of primary keys and foreign keys.

### Topics

- INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN
- CROSS JOIN (and the implicit CROSS JOIN from comma-separated tables)
- Self-joins (manager/employee, friend-of)
- USING vs ON vs NATURAL JOIN
- Joining 3+ tables; join order and readability
- Equi-joins vs theta-joins (non-equi)
- LATERAL joins (Postgres)
- Multi-column foreign keys and composite joins

### Key Concepts

- INNER JOIN keeps only rows that match in both tables; OUTER JOIN preserves unmatched rows from one or both sides, filling with NULLs.
- ON defines the join predicate; WHERE filters AFTER the join — placing a predicate on the inner table in WHERE for a LEFT JOIN silently converts it to an INNER JOIN.
- USING (col) requires the column to exist in both tables with the same name; it coalesces them into one output column.
- CROSS JOIN is the explicit form of `FROM a, b` — use it intentionally, never by accident.
- A missing join condition in an n-table query produces O(n*m) rows — the classic Cartesian product bug.
- LATERAL lets a subquery reference columns from the left table, enabling per-row joins (top-N per group).

```sql
-- Customers who have rented at least once
SELECT c.customer_id, c.last_name, r.rental_date
FROM customer c
INNER JOIN rental r ON r.customer_id = c.customer_id;

-- All customers, with their rentals (NULLs where none)
SELECT c.customer_id, c.last_name, r.rental_date
FROM customer c
LEFT JOIN rental r ON r.customer_id = c.customer_id
ORDER BY c.customer_id, r.rental_date;
```
Caption: Inner and left joins

### Common Pitfalls

- Forgetting a join condition — `FROM a, b` without a WHERE produces a Cartesian product; always use explicit JOIN ... ON.
- WHERE on inner table of LEFT JOIN — silently converts to INNER JOIN; move the predicate to ON to preserve unmatched rows.
- Ambiguous column names — `customer_id` exists in both tables; qualify as `c.customer_id` or use USING to coalesce.
- NATURAL JOIN — joins on all same-named columns, including coincidental ones like `created_at`; avoid in production.
- Counting LEFT JOIN rows with COUNT(*) — COUNT(*) counts NULL-filled rows as 1; use COUNT(r.id) to count only matches.

### Real-World Applications

- Uber Eats uses inner joins to assemble order displays from orders, restaurants, and drivers in a single round-trip.
- Netflix's recommendation backend joins user_activity to title_metadata on content_id with billions of rows daily.
- LinkedIn's graph queries self-join the member table to compute 2nd- and 3rd-degree connections.
- Airbnb's booking pipeline joins listings, reservations, and payouts with LEFT JOINs to handle pending payouts gracefully.

### Interview Questions

- 1. Difference between LEFT JOIN and LEFT OUTER JOIN? — None; OUTER is optional in SQL standard; Postgres accepts both.
- 2. Why does adding `WHERE inner_col = X` to a LEFT JOIN break it? — It filters out NULL-padded rows, effectively making it an INNER JOIN; move to ON.
- 3. What does USING (col) do that ON doesn't? — Coalesces the join column into a single output column; requires the same name on both sides.
- 4. What's a Cartesian product and how do you avoid it? — Every row of A paired with every row of B (n*m); always specify JOIN ... ON explicitly.
- 5. When would you use LATERAL? — When a subquery needs to reference columns from the left table per row (e.g. top-N per group, jsonb_unpack).

### Mini Project

Build an Org Chart Reporter: Given an employee table with manager_id self-reference, print every employee with their direct manager's name, their manager's manager (grand-boss), and a count of direct reports. Suggested approach:
  - Use a self-LEFT JOIN twice to get manager and grand-boss
  - Use a correlated subquery or LATERAL to count reports
  - Use COALESCE to label the top-level boss as 'TOP'
  - Order by employee_id
  - Bonus: produce a CSV via `\copy (SELECT ...) TO 'org.csv' CSV HEADER`

### Exercises

1. Write an INNER JOIN of customer, rental, and payment; count rows.
2. Convert it to a LEFT JOIN of customer to rental; explain the row-count difference.
3. Demonstrate the ON-vs-WHERE trap: write a LEFT JOIN with `WHERE inner_col IS NOT NULL` and show it equals an INNER JOIN.
4. Use LATERAL to fetch the most recent 3 rentals per customer.
5. Rewrite `FROM a, b WHERE a.id = b.id` as an explicit INNER JOIN; explain why the latter is preferred.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which JOIN keeps only matching rows from both tables?
9. A) LEFT JOIN
10. B) FULL OUTER JOIN
11. C) INNER JOIN (*)
12. D) CROSS JOIN
13. Explanation: INNER JOIN retains only rows where the join predicate matches in both inputs; LEFT/FULL preserve unmatched rows.
14. Q2: What happens if you write `FROM a, b` with no WHERE?
15. A) Syntax error
16. B) Empty result
17. C) Same as INNER JOIN on a.id = b.id
18. D) Cartesian product (every row of A paired with every row of B) (*)
19. Explanation: Comma-separated FROM is an implicit CROSS JOIN; with no predicate it produces n*m rows — a classic bug.
20. Q3: Which is the correct way to filter the inner table in a LEFT JOIN?
21. A) Put the predicate in ON (*)
22. B) Put the predicate in WHERE
23. C) Use HAVING
24. D) Filter in a subquery only
25. Explanation: A WHERE on the inner table filters AFTER the join, dropping NULL-padded rows; move it to ON to preserve unmatched left rows.
26. Q4: What does USING (col) do?
27. A) Forces a unique constraint on col
28. B) Joins on a column named col, outputting one coalesced col column (*)
29. C) Same as NATURAL JOIN
30. D) Same as ON 1=1
31. Explanation: USING requires the same column name on both sides and outputs a single column instead of two duplicates.
32. Q5: What does `COUNT(*)` return on a LEFT JOIN where some rows have NULL inner columns?
33. A) Only matching rows
34. B) Zero for NULL rows
35. C) All rows including NULL-padded ones (*)
36. D) A syntax error
37. Explanation: COUNT(*) counts rows regardless of NULLs; use COUNT(inner_table.pk) to count only matched rows.
38. Q6: When should you use LATERAL?
39. A) When joining on a non-equi predicate
40. B) For recursive queries
41. C) For window functions
42. D) When the subquery needs to reference the left row's columns (*)
43. Explanation: LATERAL enables per-row subquery evaluation referencing left-table columns — the standard way to do top-N per group.
44. Q7: Which JOIN type preserves unmatched rows from BOTH tables?
45. A) FULL OUTER (*)
46. B) LEFT OUTER
47. C) RIGHT OUTER
48. D) INNER
49. Explanation: FULL OUTER JOIN keeps unmatched rows from both sides, padding with NULLs; LEFT/RIGHT preserve only one side.
50. Q8: Why is NATURAL JOIN risky?
51. A) It's slower than INNER JOIN
52. B) It joins on all same-named columns, including coincidental ones like created_at (*)
53. C) It doesn't exist in Postgres
54. D) It requires a foreign key
55. Explanation: NATURAL JOIN implicitly joins on every shared column name, which can break if a coincidental column is added later.
56. Q9: A self-join is most commonly used for?
57. A) Optimizing window functions
58. B) Replacing UNION ALL
59. C) Recursive hierarchies (employee -> manager) and pair-wise comparisons (*)
60. D) Materializing CTEs
61. Explanation: Self-joins pair rows of a table with other rows of the same table, useful for manager/employee and friend-of-friend queries.
62. Q10: Which of these is an INNER JOIN with a non-equi predicate?
63. A) `JOIN r USING (id)`
64. B) `NATURAL JOIN r`
65. C) `CROSS JOIN r`
66. D) `JOIN r ON r.start <= c.now AND r.end > c.now` (*)
67. Explanation: Non-equi joins use predicates other than = (range, overlap, inequality) — common for time-window and interval joins.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which JOIN keeps only matching rows from both tables?
  options:
    - LEFT JOIN
    - FULL OUTER JOIN
    - INNER JOIN
    - CROSS JOIN
  correctIndex: 2
  explanation: INNER JOIN retains only rows where the join predicate matches in both inputs; LEFT/FULL preserve unmatched rows.
- id: q2
  question: What happens if you write `FROM a, b` with no WHERE?
  options:
    - Syntax error
    - Empty result
    - Same as INNER JOIN on a.id = b.id
    - Cartesian product (every row of A paired with every row of B)
  correctIndex: 3
  explanation: Comma-separated FROM is an implicit CROSS JOIN; with no predicate it produces n*m rows — a classic bug.
- id: q3
  question: Which is the correct way to filter the inner table in a LEFT JOIN?
  options:
    - Put the predicate in ON
    - Put the predicate in WHERE
    - Use HAVING
    - Filter in a subquery only
  correctIndex: 0
  explanation: A WHERE on the inner table filters AFTER the join, dropping NULL-padded rows; move it to ON to preserve unmatched left rows.
- id: q4
  question: What does USING (col) do?
  options:
    - Forces a unique constraint on col
    - Joins on a column named col, outputting one coalesced col column
    - Same as NATURAL JOIN
    - Same as ON 1=1
  correctIndex: 1
  explanation: USING requires the same column name on both sides and outputs a single column instead of two duplicates.
- id: q5
  question: What does `COUNT(*)` return on a LEFT JOIN where some rows have NULL inner columns?
  options:
    - Only matching rows
    - Zero for NULL rows
    - All rows including NULL-padded ones
    - A syntax error
  correctIndex: 2
  explanation: COUNT(*) counts rows regardless of NULLs; use COUNT(inner_table.pk) to count only matched rows.
- id: q6
  question: When should you use LATERAL?
  options:
    - When joining on a non-equi predicate
    - For recursive queries
    - For window functions
    - When the subquery needs to reference the left row's columns
  correctIndex: 3
  explanation: LATERAL enables per-row subquery evaluation referencing left-table columns — the standard way to do top-N per group.
- id: q7
  question: Which JOIN type preserves unmatched rows from BOTH tables?
  options:
    - FULL OUTER
    - LEFT OUTER
    - RIGHT OUTER
    - INNER
  correctIndex: 0
  explanation: FULL OUTER JOIN keeps unmatched rows from both sides, padding with NULLs; LEFT/RIGHT preserve only one side.
- id: q8
  question: Why is NATURAL JOIN risky?
  options:
    - It's slower than INNER JOIN
    - It joins on all same-named columns, including coincidental ones like created_at
    - It doesn't exist in Postgres
    - It requires a foreign key
  correctIndex: 1
  explanation: NATURAL JOIN implicitly joins on every shared column name, which can break if a coincidental column is added later.
- id: q9
  question: A self-join is most commonly used for?
  options:
    - Optimizing window functions
    - Replacing UNION ALL
    - Recursive hierarchies (employee -> manager) and pair-wise comparisons
    - Materializing CTEs
  correctIndex: 2
  explanation: Self-joins pair rows of a table with other rows of the same table, useful for manager/employee and friend-of-friend queries.
- id: q10
  question: Which of these is an INNER JOIN with a non-equi predicate?
  options:
    - "`JOIN r USING (id)`"
    - "`NATURAL JOIN r`"
    - "`CROSS JOIN r`"
    - "`JOIN r ON r.start <= c.now AND r.end > c.now`"
  correctIndex: 3
  explanation: Non-equi joins use predicates other than = (range, overlap, inequality) — common for time-window and interval joins.
```

