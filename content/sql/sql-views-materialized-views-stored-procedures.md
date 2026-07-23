---
slug: sql-views-materialized-views-stored-procedures
id: sql-11
track: sql
order: 11
title: Views, Materialized Views, and Stored Procedures
description: Encapsulate queries as views, cache heavy aggregates as materialized views, and write server-side functions and procedures in PL/pgSQL — and learn the security and performance trade-offs.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=6900s
whyItMatters: Encapsulate queries as views, cache heavy aggregates as materialized views, and write server-side functions and procedures in PL/pgSQL — and learn the security and performance trade-offs.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Views, Materialized Views, and Stored Procedures

## Views, Materialized Views, and Stored Procedures

### Why It Matters

Encapsulate queries as views, cache heavy aggregates as materialized views, and write server-side functions and procedures in PL/pgSQL — and learn the security and performance trade-offs.

Encapsulate queries as views, cache heavy aggregates as materialized views, and write server-side functions and procedures in PL/pgSQL — and learn the security and performance trade-offs.

### Prerequisites

- Stage 10: Transactions, Isolation Levels, and Locks.
- Comfort with multi-statement scripts.

### Topics

- CREATE VIEW, CREATE OR REPLACE VIEW
- Updatable views (simple views)
- CREATE MATERIALIZED VIEW, REFRESH MATERIALIZED VIEW, CONCURRENTLY
- CREATE FUNCTION (LANGUAGE plpgsql, LANGUAGE sql)
- CREATE PROCEDURE (Postgres 11+)
- SECURITY DEFINER vs SECURITY INVOKER
- SET search_path inside functions (security)
- RETURN TABLE, RETURNS TABLE, OUT parameters, SETOF

### Key Concepts

- A view is a saved SELECT; it's evaluated at query time. A materialized view is a saved SELECT whose result is stored on disk and refreshed on demand.
- Materialized views are perfect for heavy aggregates that tolerate staleness; REFRESH CONCURRENTLY avoids read locks but requires a unique index.
- SQL functions inline into the caller (faster); PL/pgSQL functions are compiled and cached.
- SECURITY DEFINER runs with the function owner's privileges — useful for granting controlled access to restricted data, but requires a fixed `search_path` to prevent search-path injection.
- Procedures (CALL proc()) support transaction control (COMMIT/ROLLBACK inside); functions can't.
- Updatable views: simple single-table views support INSERT/UPDATE/DELETE automatically.

```sql
CREATE OR REPLACE VIEW v_active_customers AS
SELECT customer_id, first_name, last_name, email
FROM customer
WHERE active = true;

GRANT SELECT ON v_active_customers TO reporting_role;
```
Caption: View

### Common Pitfalls

- Stale materialized views — `REFRESH MATERIALIZED VIEW` without a schedule means reports silently drift; use pg_cron or a scheduled job.
- SECURITY DEFINER without `SET search_path` — vulnerable to search-path injection where a malicious user creates a hostile function in their schema that your function calls.
- Function returning SETOF and SELECT * from it — performance cliff; prefer `RETURNS TABLE` and inline SQL functions when possible.
- Updatable view restrictions — adding JOIN or aggregate makes the view read-only; use INSTEAD OF triggers (Stage 12) to make it writable.
- Using a procedure where a function would do — procedures can't be used in SELECT; only use CALL when you need transaction control or side-effects.

### Real-World Applications

- Stripe exposes customer-revenue summaries via SECURITY DEFINER functions that join across tables analysts can't directly read.
- Airbnb materializes nightly listing-availability snapshots for fast search; refreshed with CONCURRENTLY during low-traffic windows.
- LinkedIn uses materialized views to pre-compute member connection counts; refreshed every 15 minutes.
- Uber's H3 hex-grid aggregates are exposed as views backed by materialized rollups for the analytics dashboard.

### Interview Questions

- 1. Difference between VIEW and MATERIALIZED VIEW? — VIEW is a saved query evaluated at read time; MATERIALIZED VIEW stores the result and must be refreshed.
- 2. Why use SECURITY DEFINER? — To grant controlled access to data the caller can't directly read (e.g. expose only the SUM of payments, not individual rows).
- 3. What's required for REFRESH CONCURRENTLY? — A UNIQUE index on the materialized view; it lets Postgres build the new version alongside the old.
- 4. Difference between FUNCTION and PROCEDURE in Postgres? — Functions can be in SELECT and can't control transactions; procedures use CALL and can COMMIT/ROLLBACK inside.
- 5. Why set `search_path` in SECURITY DEFINER functions? — To prevent search-path injection where a hostile user pre-creates a same-named function the definer calls.

### Mini Project

Build a Daily Revenue Reporting Layer: Three objects — a view `v_daily_revenue` (live, for small queries), a materialized view `mv_daily_revenue` (refreshed nightly, for dashboards), and a function `get_revenue(p_day date)` that returns the day's total. Schedule a nightly REFRESH via pg_cron. Suggested approach:
  - Create both view and materialized view from the same GROUP BY query
  - Add a unique index on mv_daily_revenue(day) to enable CONCURRENTLY refresh
  - Function reads from the materialized view for speed
  - Schedule: `SELECT cron.schedule('0 2 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue');`
  - Document refresh time and staleness SLA in a README

### Exercises

1. Create a view over `payment` that hides PII columns; grant it to a `reporting` role.
2. Create a materialized view of daily revenue; refresh it; show the difference vs the live query.
3. Add a UNIQUE index and use REFRESH CONCURRENTLY; verify reads aren't blocked.
4. Write a SECURITY DEFINER function with `SET search_path = public, pg_temp`; explain why.
5. Write a PROCEDURE that inserts and then COMMITs mid-way; call it with CALL.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the difference between a VIEW and a MATERIALIZED VIEW?
9. A) A VIEW can't have indexes; a MATERIALIZED VIEW can
10. B) They are identical
11. C) A VIEW is evaluated at read time; a MATERIALIZED VIEW stores its result and must be refreshed (*)
12. D) A MATERIALIZED VIEW is always faster
13. Explanation: VIEW is a saved query plan evaluated per read; MATERIALIZED VIEW persists the result and only updates on REFRESH.
14. Q2: What does SECURITY DEFINER do?
15. A) Defends against SQL injection
16. B) Adds a security lock
17. C) Requires HTTPS
18. D) Runs the function with the OWNER's privileges instead of the caller's (*)
19. Explanation: SECURITY DEFINER is how you grant controlled access to data the caller can't read directly — but it requires careful search_path handling.
20. Q3: What is required to use REFRESH MATERIALIZED VIEW CONCURRENTLY?
21. A) A UNIQUE index on the materialized view (*)
22. B) A primary key on every column
23. C) A trigger
24. D) An extension
25. Explanation: CONCURRENTLY builds the new version alongside the old, which requires a unique index to diff and swap without blocking reads.
26. Q4: Why set `search_path` inside a SECURITY DEFINER function?
27. A) To speed up lookups
28. B) To prevent search-path injection where a malicious user pre-creates a same-named function (*)
29. C) To enable parallelism
30. D) To allow cross-schema access
31. Explanation: Without an explicit search_path, a hostile user could create a same-named object in their schema that your function calls with elevated privileges.
32. Q5: When can a Postgres PROCEDURE do something a FUNCTION can't?
33. A) Return a value
34. B) Be used in SELECT
35. C) Control transactions with COMMIT/ROLLBACK inside (*)
36. D) Use SQL
37. Explanation: Procedures (Postgres 11+) can issue COMMIT/ROLLBACK mid-call; functions can't. Use CALL proc(), not SELECT.
38. Q6: What makes a simple view updatable?
39. A) It's named with the prefix "upd_"
40. B) It has a UNIQUE index
41. C) The owner grants UPDATE
42. D) It selects from one table without aggregation or DISTINCT (*)
43. Explanation: Single-table views without aggregates/DISTINCT/GROUP BY are auto-updatable in Postgres; the DB translates writes through to the base table.
44. Q7: What is INSTEAD OF used for?
45. A) Making complex (non-simple) views writable via triggers (*)
46. B) Replacing a function
47. C) Disabling a view
48. D) Switching indexes
49. Explanation: INSTEAD OF triggers on views intercept INSERT/UPDATE/DELETE and let you write logic to map them back to base tables.
50. Q8: A materialized view that is never REFRESHed will?
51. A) Auto-refresh on read
52. B) Silently serve stale data (*)
53. C) Raise an error on read
54. D) Drop itself
55. Explanation: Materialized views persist their last-refreshed state; schedule refreshes with pg_cron or an external scheduler to avoid silent staleness.
56. Q9: Which is true about RETURNS TABLE vs OUT parameters?
57. A) OUT is faster
58. B) RETURNS TABLE is more readable and modern; OUT is older
59. C) RETURNS TABLE only works in procedures (*)
60. D) They are identical
61. Explanation: RETURNS TABLE is the modern, more readable way to declare a function returning a row set; OUT parameters predate it.
62. Q10: pg_cron is commonly used to?
63. A) Backup the database
64. B) Run client-side code
65. C) Manage roles
66. D) Schedule REFRESH MATERIALIZED VIEW and other periodic SQL jobs (*)
67. Explanation: pg_cron is a Postgres extension that runs SQL on a cron schedule — perfect for nightly materialized view refreshes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the difference between a VIEW and a MATERIALIZED VIEW?
  options:
    - A VIEW can't have indexes; a MATERIALIZED VIEW can
    - They are identical
    - A VIEW is evaluated at read time; a MATERIALIZED VIEW stores its result and must be refreshed
    - A MATERIALIZED VIEW is always faster
  correctIndex: 2
  explanation: VIEW is a saved query plan evaluated per read; MATERIALIZED VIEW persists the result and only updates on REFRESH.
- id: q2
  question: What does SECURITY DEFINER do?
  options:
    - Defends against SQL injection
    - Adds a security lock
    - Requires HTTPS
    - Runs the function with the OWNER's privileges instead of the caller's
  correctIndex: 3
  explanation: SECURITY DEFINER is how you grant controlled access to data the caller can't read directly — but it requires careful search_path handling.
- id: q3
  question: What is required to use REFRESH MATERIALIZED VIEW CONCURRENTLY?
  options:
    - A UNIQUE index on the materialized view
    - A primary key on every column
    - A trigger
    - An extension
  correctIndex: 0
  explanation: CONCURRENTLY builds the new version alongside the old, which requires a unique index to diff and swap without blocking reads.
- id: q4
  question: Why set `search_path` inside a SECURITY DEFINER function?
  options:
    - To speed up lookups
    - To prevent search-path injection where a malicious user pre-creates a same-named function
    - To enable parallelism
    - To allow cross-schema access
  correctIndex: 1
  explanation: Without an explicit search_path, a hostile user could create a same-named object in their schema that your function calls with elevated privileges.
- id: q5
  question: When can a Postgres PROCEDURE do something a FUNCTION can't?
  options:
    - Return a value
    - Be used in SELECT
    - Control transactions with COMMIT/ROLLBACK inside
    - Use SQL
  correctIndex: 2
  explanation: Procedures (Postgres 11+) can issue COMMIT/ROLLBACK mid-call; functions can't. Use CALL proc(), not SELECT.
- id: q6
  question: What makes a simple view updatable?
  options:
    - It's named with the prefix "upd_"
    - It has a UNIQUE index
    - The owner grants UPDATE
    - It selects from one table without aggregation or DISTINCT
  correctIndex: 3
  explanation: Single-table views without aggregates/DISTINCT/GROUP BY are auto-updatable in Postgres; the DB translates writes through to the base table.
- id: q7
  question: What is INSTEAD OF used for?
  options:
    - Making complex (non-simple) views writable via triggers
    - Replacing a function
    - Disabling a view
    - Switching indexes
  correctIndex: 0
  explanation: INSTEAD OF triggers on views intercept INSERT/UPDATE/DELETE and let you write logic to map them back to base tables.
- id: q8
  question: A materialized view that is never REFRESHed will?
  options:
    - Auto-refresh on read
    - Silently serve stale data
    - Raise an error on read
    - Drop itself
  correctIndex: 1
  explanation: Materialized views persist their last-refreshed state; schedule refreshes with pg_cron or an external scheduler to avoid silent staleness.
- id: q9
  question: Which is true about RETURNS TABLE vs OUT parameters?
  options:
    - OUT is faster
    - RETURNS TABLE is more readable and modern; OUT is older
    - RETURNS TABLE only works in procedures
    - They are identical
  correctIndex: 2
  explanation: RETURNS TABLE is the modern, more readable way to declare a function returning a row set; OUT parameters predate it.
- id: q10
  question: pg_cron is commonly used to?
  options:
    - Backup the database
    - Run client-side code
    - Manage roles
    - Schedule REFRESH MATERIALIZED VIEW and other periodic SQL jobs
  correctIndex: 3
  explanation: pg_cron is a Postgres extension that runs SQL on a cron schedule — perfect for nightly materialized view refreshes.
```

