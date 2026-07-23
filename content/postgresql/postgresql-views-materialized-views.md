---
slug: postgresql-views-materialized-views
id: postgresql-07
track: postgresql
order: 7
title: Views and Materialized Views
description: Build regular views for query reuse and security, and materialized views for cached aggregations — including REFRESH CONCURRENTLY, unique index requirements, and refresh strategies.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=7200s
whyItMatters: Build regular views for query reuse and security, and materialized views for cached aggregations — including REFRESH CONCURRENTLY, unique index requirements, and refresh strategies.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Views and Materialized Views

## Views and Materialized Views

### Why It Matters

Build regular views for query reuse and security, and materialized views for cached aggregations — including REFRESH CONCURRENTLY, unique index requirements, and refresh strategies.

Build regular views for query reuse and security, and materialized views for cached aggregations — including REFRESH CONCURRENTLY, unique index requirements, and refresh strategies.

### Prerequisites

- Stage 4: Schemas, Tables, and Constraints
- Stage 6: Advanced Types — JSONB, Arrays, Hstore, Enums, Composite

### Topics

- CREATE VIEW: simple and updatable views; column rename and WITH CHECK OPTION
- When to use a view (query reuse, security, abstraction) vs when not to (perf)
- CREATE MATERIALIZED VIEW: caches the result set as a real table
- REFRESH MATERIALIZED VIEW and REFRESH CONCURRENTLY (requires a UNIQUE index)
- Scheduling refreshes with pg_cron or external schedulers
- Tradeoffs: refresh cost vs query speed; staleness SLAs
- Security: views as a way to grant SELECT on a subset of columns/rows
- Recursive views (WITH RECURSIVE wrapped in a view) for tree traversal

### Key Concepts

- A regular view is just a saved SELECT — it's expanded inline at query time, so it adds no perf benefit and can mask bad query patterns.
- A materialized view is a real table whose contents are the result of a SELECT, refreshed on demand; it trades freshness for query speed.
- `REFRESH MATERIALIZED VIEW CONCURRENTLY` requires a UNIQUE index on the materialized view and lets reads continue during refresh (no read lock).
- Materialized views don't auto-refresh — schedule with `pg_cron` (`SELECT cron.schedule('0 2 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily')`) or an external scheduler.
- Views are a security tool: `GRANT SELECT ON sensitive_view TO analyst` lets them query a subset of columns/rows without direct table access.
- `WITH CHECK OPTION` ensures INSERTs/UPDATEs through an updatable view stay visible to the view's WHERE — important for tenant-scoped views.
- Materialized views are not a substitute for proper indexing — the underlying query still needs indexes; the MV just caches the result.

```sql
-- Hide the salary column from analysts:
CREATE VIEW employee_public AS
SELECT id, name, department_id, hire_date
FROM employee
WHERE terminated_at IS NULL;

GRANT SELECT ON employee_public TO analyst_role;
-- Now analysts cannot see salary or terminated employees.

-- Updatable view with WITH CHECK OPTION (PG9.4+):
CREATE VIEW active_employee AS
SELECT * FROM employee WHERE active = true
WITH CHECK OPTION;
-- INSERT INTO active_employee(..., active=false) now FAILS because
-- the new row wouldn't be visible to the view.
```
Caption: Regular view for query reuse and security

### Common Pitfalls

- Using regular views for performance — a view is expanded inline; it adds no perf benefit and can mask bad queries. Use materialized views for caching.
- REFRESH CONCURRENTLY without a UNIQUE index — Postgres raises "CONCURRENTLY requires a UNIQUE index"; create one first or use non-concurrent REFRESH (which blocks readers).
- Forgetting to refresh materialized views on a schedule — they don't auto-update; staleness grows until you refresh. Set up pg_cron or an external job.
- Granting SELECT on a view but not the underlying tables — for non-security-definer views, the user still needs SELECT on the underlying tables; for security, use SECURITY DEFINER or column-level GRANTs.
- Materialized view refresh taking too long and locking users out — use CONCURRENTLY, schedule off-peak, and add indexes on the underlying tables to speed up the refresh query.

### Real-World Applications

- Reddit uses materialized views for subreddit-level daily aggregates, refreshed hourly via pg_cron.
- Discord uses views to expose redacted user data to internal analytics tools without exposing PII.
- Spotify uses materialized views for "Top Tracks This Week" playlists, refreshed nightly.
- Twitch uses recursive views to compute channel hierarchy for partner/super-partner rollups.

### Interview Questions

- 1. What's the difference between a view and a materialized view? — A view is expanded inline at query time (no caching); a materialized view is a stored result refreshed on demand.
- 2. What does REFRESH CONCURRENTLY require? — A UNIQUE index on the materialized view; without it, Postgres raises an error and you must use non-concurrent REFRESH (which blocks readers).
- 3. What does WITH CHECK OPTION do on an updatable view? — Ensures INSERTed/UPDATEd rows satisfy the view's WHERE clause, preventing rows from "disappearing" through the view.
- 4. How do you schedule a materialized view refresh? — Use pg_cron (`SELECT cron.schedule(...)`) or an external scheduler like Airflow or systemd timers.
- 5. When is a regular view a security tool? — When you GRANT SELECT on the view but not the underlying table, exposing only a subset of columns/rows (pair with SECURITY DEFINER for full effect).

### Mini Project

Build a Daily Stats Dashboard Backend: Create an `events` table with 100k rows, a materialized view `mv_daily_stats` aggregating by (tenant, day, event_type), a UNIQUE index enabling CONCURRENTLY refresh, a regular view `v_top_pages_today` selecting top 10 pages from events, and a pg_cron schedule to refresh nightly. Suggested approach:
  - Use date_trunc('day', occurred_at)::date for the day column
  - Add `count(*)` and `count(distinct user_id)` metrics
  - Create the UNIQUE index on (tenant_id, day, event_type) BEFORE the first CONCURRENTLY refresh
  - Schedule with `cron.schedule('refresh_daily', '0 2 * * *', $SQL$ REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats $SQL$)`
  - Verify by querying mv_daily_stats before and after a REFRESH

### Exercises

1. Create a regular view `employee_public` that hides the salary column; GRANT SELECT to a role; verify the role can SELECT the view but not the underlying salary column.
2. Create a materialized view on a 100k-row events table; query it; INSERT new events; query again — observe the MV is stale.
3. Add a UNIQUE index to the MV and run REFRESH MATERIALIZED VIEW CONCURRENTLY; verify readers are not blocked (open a long SELECT in another session).
4. Schedule a refresh with pg_cron; verify it appears in `cron.job`; manually trigger with `cron.schedule` returning a jobid.
5. Create a recursive view on an org-chart tree (employee → manager) and SELECT the full path for each employee.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the main difference between a view and a materialized view?
9. A) Views are larger
10. B) Materialized views can't have indexes
11. C) A view is expanded inline at query time; a materialized view is a stored result refreshed on demand (*)
12. D) Views are faster
13. Explanation: Views are just saved SELECTs expanded by the planner; materialized views persist the result and must be refreshed manually.
14. Q2: What does REFRESH MATERIALIZED VIEW CONCURRENTLY require?
15. A) A B-tree index on every column
16. B) No active connections
17. C) Superuser
18. D) A UNIQUE index on the materialized view (*)
19. Explanation: CONCURRENTLY builds a new version and swaps; it needs a UNIQUE index to identify which rows to update/delete. Without it, Postgres raises an error.
20. Q3: What does WITH CHECK OPTION do on an updatable view?
21. A) Ensures INSERTed/UPDATEd rows satisfy the view's WHERE clause (*)
22. B) Validates the view definition
23. C) Adds a CHECK constraint to the underlying table
24. D) Forces the view to be read-only
25. Explanation: WITH CHECK OPTION prevents rows from "disappearing" through the view — INSERT or UPDATE that would make a row invisible to the view is rejected.
26. Q4: How often does a materialized view refresh automatically?
27. A) Every minute
28. B) Never — you must refresh manually or via a scheduler (*)
29. C) On every INSERT to the underlying table
30. D) On every COMMIT
31. Explanation: Materialized views don't auto-refresh; schedule with pg_cron (`SELECT cron.schedule(...)`) or an external scheduler like Airflow or systemd timers.
32. Q5: When is a regular view a useful security tool?
33. A) When you want faster queries
34. B) When you need caching
35. C) When you GRANT SELECT on the view but not the underlying table, exposing only a subset (*)
36. D) When you need partitioning
37. Explanation: A view exposes only the columns/rows in its SELECT; granting SELECT on the view (not the table) hides the rest. Pair with SECURITY DEFINER for full effect.
38. Q6: Which is a downside of using a regular view for "performance"?
39. A) It uses too much disk
40. B) It can't be indexed
41. C) It can't be queried
42. D) It adds no perf benefit — it's expanded inline by the planner (*)
43. Explanation: Views are macro-expanded; the underlying query runs every time. Use a materialized view if you need caching.
44. Q7: What does `pg_cron.schedule('0 2 * * *', $SQL$ REFRESH MATERIALIZED VIEW CONCURRENTLY mv $SQL$)` do?
45. A) Schedules a nightly 2am refresh of mv (*)
46. B) Refreshes once, immediately
47. C) Drops the materialized view at 2am
48. D) Creates a new materialized view
49. Explanation: pg_cron uses cron syntax; the schedule runs the REFRESH nightly at 2am. The $SQL$ ... $SQL$ quoting handles the internal quotes safely.
50. Q8: Which is TRUE about a recursive view?
51. A) It cannot be queried
52. B) It uses WITH RECURSIVE internally for tree traversal (*)
53. C) It's the same as a materialized view
54. D) It can only be queried by superusers
55. Explanation: CREATE RECURSIVE VIEW wraps a WITH RECURSIVE query; useful for org charts, category trees, and other hierarchical data.
56. Q9: What happens if you REFRESH MATERIALIZED VIEW (without CONCURRENTLY) while readers are querying it?
57. A) Readers see the new data immediately
58. B) The refresh fails
59. C) Readers are blocked until refresh completes (*)
60. D) The view is dropped
61. Explanation: Non-concurrent REFRESH takes an AccessExclusiveLock, blocking all readers until done. Use CONCURRENTLY (requires a UNIQUE index) to avoid this.
62. Q10: Which is a good practice for materialized view staleness?
63. A) Refresh every second
64. B) Never refresh — let it grow stale
65. C) Drop and recreate on every query
66. D) Document a staleness SLA (e.g. "max 24h") and refresh to meet it (*)
67. Explanation: Document the staleness SLA in your README; refresh on a schedule that meets it. Most dashboards tolerate hours-to-a-day staleness; align refresh cadence with the SLA.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the main difference between a view and a materialized view?
  options:
    - Views are larger
    - Materialized views can't have indexes
    - A view is expanded inline at query time; a materialized view is a stored result refreshed on demand
    - Views are faster
  correctIndex: 2
  explanation: Views are just saved SELECTs expanded by the planner; materialized views persist the result and must be refreshed manually.
- id: q2
  question: What does REFRESH MATERIALIZED VIEW CONCURRENTLY require?
  options:
    - A B-tree index on every column
    - No active connections
    - Superuser
    - A UNIQUE index on the materialized view
  correctIndex: 3
  explanation: CONCURRENTLY builds a new version and swaps; it needs a UNIQUE index to identify which rows to update/delete. Without it, Postgres raises an error.
- id: q3
  question: What does WITH CHECK OPTION do on an updatable view?
  options:
    - Ensures INSERTed/UPDATEd rows satisfy the view's WHERE clause
    - Validates the view definition
    - Adds a CHECK constraint to the underlying table
    - Forces the view to be read-only
  correctIndex: 0
  explanation: WITH CHECK OPTION prevents rows from "disappearing" through the view — INSERT or UPDATE that would make a row invisible to the view is rejected.
- id: q4
  question: How often does a materialized view refresh automatically?
  options:
    - Every minute
    - Never — you must refresh manually or via a scheduler
    - On every INSERT to the underlying table
    - On every COMMIT
  correctIndex: 1
  explanation: Materialized views don't auto-refresh; schedule with pg_cron (`SELECT cron.schedule(...)`) or an external scheduler like Airflow or systemd timers.
- id: q5
  question: When is a regular view a useful security tool?
  options:
    - When you want faster queries
    - When you need caching
    - When you GRANT SELECT on the view but not the underlying table, exposing only a subset
    - When you need partitioning
  correctIndex: 2
  explanation: A view exposes only the columns/rows in its SELECT; granting SELECT on the view (not the table) hides the rest. Pair with SECURITY DEFINER for full effect.
- id: q6
  question: Which is a downside of using a regular view for "performance"?
  options:
    - It uses too much disk
    - It can't be indexed
    - It can't be queried
    - It adds no perf benefit — it's expanded inline by the planner
  correctIndex: 3
  explanation: Views are macro-expanded; the underlying query runs every time. Use a materialized view if you need caching.
- id: q7
  question: What does `pg_cron.schedule('0 2 * * *', $SQL$ REFRESH MATERIALIZED VIEW CONCURRENTLY mv $SQL$)` do?
  options:
    - Schedules a nightly 2am refresh of mv
    - Refreshes once, immediately
    - Drops the materialized view at 2am
    - Creates a new materialized view
  correctIndex: 0
  explanation: pg_cron uses cron syntax; the schedule runs the REFRESH nightly at 2am. The $SQL$ ... $SQL$ quoting handles the internal quotes safely.
- id: q8
  question: Which is TRUE about a recursive view?
  options:
    - It cannot be queried
    - It uses WITH RECURSIVE internally for tree traversal
    - It's the same as a materialized view
    - It can only be queried by superusers
  correctIndex: 1
  explanation: CREATE RECURSIVE VIEW wraps a WITH RECURSIVE query; useful for org charts, category trees, and other hierarchical data.
- id: q9
  question: What happens if you REFRESH MATERIALIZED VIEW (without CONCURRENTLY) while readers are querying it?
  options:
    - while readers are querying it?
    - Readers see the new data immediately
    - The refresh fails
    - Readers are blocked until refresh completes
    - The view is dropped
  correctIndex: 3
  explanation: Non-concurrent REFRESH takes an AccessExclusiveLock, blocking all readers until done. Use CONCURRENTLY (requires a UNIQUE index) to avoid this.
- id: q10
  question: Which is a good practice for materialized view staleness?
  options:
    - Refresh every second
    - Never refresh — let it grow stale
    - Drop and recreate on every query
    - Document a staleness SLA (e.g. "max 24h") and refresh to meet it
  correctIndex: 3
  explanation: Document the staleness SLA in your README; refresh on a schedule that meets it. Most dashboards tolerate hours-to-a-day staleness; align refresh cadence with the SLA.
```

