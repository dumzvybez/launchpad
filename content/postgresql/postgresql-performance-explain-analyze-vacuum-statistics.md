---
slug: postgresql-performance-explain-analyze-vacuum-statistics
id: postgresql-14
track: postgresql
order: 14
title: Performance — EXPLAIN, ANALYZE, VACUUM, Statistics
description: Read EXPLAIN (ANALYZE, BUFFERS) output, tune autovacuum, understand table and index bloat, and keep statistics accurate for the query planner.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=15600s
whyItMatters: Read EXPLAIN (ANALYZE, BUFFERS) output, tune autovacuum, understand table and index bloat, and keep statistics accurate for the query planner.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Performance — EXPLAIN, ANALYZE, VACUUM, Statistics

## Performance — EXPLAIN, ANALYZE, VACUUM, Statistics

### Why It Matters

Read EXPLAIN (ANALYZE, BUFFERS) output, tune autovacuum, understand table and index bloat, and keep statistics accurate for the query planner.

Read EXPLAIN (ANALYZE, BUFFERS) output, tune autovacuum, understand table and index bloat, and keep statistics accurate for the query planner.

### Prerequisites

- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN
- Stage 13: Transactions, Isolation Levels, and MVCC

### Topics

- EXPLAIN, EXPLAIN ANALYZE, EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS)
- Reading plans: Seq Scan, Index Scan, Index Only Scan, Bitmap Heap Scan, Nested Loop, Hash Join, Merge Join, Sort, Aggregate
- Cost model: seq_page_cost, random_page_cost, cpu_tuple_cost, effective_cache_size
- VACUUM, VACUUM FULL, VACUUM ANALYZE, autovacuum tuning
- Table and index bloat: pg_stat_user_tables, n_dead_tup, last_autovacuum
- Statistics: pg_statistic, default_statistics_target, ALTER TABLE ... ALTER COLUMN ... SET STATISTICS
- Plan caching: prepared statements, generic vs custom plans, plan_cache_mode
- Common slow-query patterns: implicit casts, OR vs UNION ALL, function calls in WHERE

### Key Concepts

- EXPLAIN shows the plan; EXPLAIN ANALYZE runs the query and shows actual times; BUFFERS shows shared/dirtied/written blocks. Always read ANALYZE, not just EXPLAIN.
- "Seq Scan" isn't always bad — for small tables or large fractions of the table, Seq Scan is faster than an Index Scan. Look at the row estimates vs actuals.
- "Index Only Scan" requires the visibility map to mark pages all-visible; VACUUM maintains the visibility map, so a never-VACUUMed table can't do Index Only Scans.
- VACUUM marks dead tuples as reusable but doesn't shrink the file; VACUUM FULL shrinks but takes an AccessExclusiveLock (blocks everything). Use pg_repack for online.
- Autovacuum defaults are conservative; high-churn tables need per-table tuning (`ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.05)`).
- The planner relies on statistics in pg_statistic; stale stats cause bad plans. ANALYZE updates them; autovacuum runs ANALYZE too.
- Generic prepared-statement plans can be slower than custom plans for skewed data; PG12+ has `plan_cache_mode = auto` (default), but you can force custom plans.

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT tenant_id, count(*)
FROM events
WHERE occurred_at >= now() - interval '7 days'
  AND event_type = 'click'
GROUP BY tenant_id;

-- Typical output (abbreviated):
-- HashAggregate (cost=1234.56..1245.67 rows=100 ...) (actual time=12.345..13.456 ...)
--   Group Key: events.tenant_id
--   Batches: 1  Memory Usage: 40kB
--   ->  Index Scan using events_time_type_idx on events
--         Index Cond: (occurred_at >= ...)
--         Filter: (event_type = 'click')
--         Rows Removed by Filter: 1234
--         Heap Fetches: 0          <-- Index Only Scan possible if all-visible
--         Buffers: shared hit=1234 read=56
-- Planning Time: 0.234 ms
-- Execution Time: 13.567 ms
```
Caption: EXPLAIN ANALYZE with BUFFERS

### Common Pitfalls

- Trusting EXPLAIN (without ANALYZE) — the planner's estimates can be wildly off; always run EXPLAIN ANALYZE to see actual row counts and times.
- Forgetting to ANALYZE after bulk loads — COPY/INSERT of millions of rows leaves statistics stale until autovacuum catches up; run `VACUUM ANALYZE` manually after bulk loads.
- VACUUM FULL in production — it takes an AccessExclusiveLock (blocks everything); use pg_repack or pg_squeeze for online bloat removal.
- Function calls in WHERE defeating indexes — `WHERE LOWER(email) = 'x'` only uses an index on LOWER(email); without it, the planner can't use a plain email index. Use expression indexes.
- Implicit casts causing Seq Scans — `WHERE varchar_col = 42` may cast 42 to varchar per-row, defeating an index on varchar_col; explicit-cast the parameter or fix the column type.

### Real-World Applications

- Instagram tunes autovacuum per-table on user-feed tables to keep dead-tuple ratio below 5% during peak posting.
- Discord uses EXPLAIN ANALYZE during incidents to find Seq Scans on hot paths and add indexes in real time.
- Reddit runs pg_repack nightly on high-churn vote tables to remove bloat without locking.
- Spotify runs VACUUM ANALYZE after every nightly play-count backfill to keep the planner healthy.

### Interview Questions

- 1. What's the difference between EXPLAIN and EXPLAIN ANALYZE? — EXPLAIN shows the plan with estimates; EXPLAIN ANALYZE runs the query and shows actual times, row counts, and loops.
- 2. Why is VACUUM needed in Postgres? — MVCC leaves dead tuples after UPDATE/DELETE; VACUUM marks them as reusable (and updates the visibility map for Index Only Scans).
- 3. What's the difference between VACUUM and VACUUM FULL? — VACUUM marks dead tuples as reusable (no lock, doesn't shrink); VACUUM FULL rewrites and shrinks the file but takes AccessExclusiveLock.
- 4. How do you tune autovacuum for a high-churn table? — `ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.05)` to vacuum earlier; raise cost_limit to vacuum harder.
- 5. What does the visibility map do, and why does it matter? — Tracks which pages have only live tuples; Index Only Scans require pages to be all-visible, which VACUUM maintains.

### Mini Project

Build a Slow-Query Triage Report: A `triage.sql` script that: (1) lists the 10 slowest queries from pg_stat_statements, (2) for each, runs EXPLAIN (ANALYZE, BUFFERS) (manually), (3) flags Seq Scans on large tables, (4) flags queries with bad row estimates (estimated vs actual > 10×), and (5) suggests indexes or ANALYZE. Suggested approach:
  - Install pg_stat_statements and query `pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10`
  - For each slow query, paste into EXPLAIN (ANALYZE, BUFFERS)
  - Look for "Seq Scan" on tables with >100k rows (pg_class.reltuples)
  - Look for "rows estimated=10 actual=100000" (off by 4 orders of magnitude = stale stats, run ANALYZE)
  - Document the suggested fix per query in a markdown report

### Exercises

1. Create a 1M-row table without an index; run EXPLAIN ANALYZE on a SELECT WHERE; observe Seq Scan; add a B-tree index; re-run; observe Index Scan.
2. Run `VACUUM ANALYZE` after a bulk INSERT; verify n_dead_tup drops to 0 in pg_stat_user_tables.
3. Update 100k rows; check n_dead_tup rises; run VACUUM; verify dead tuples are reclaimed.
4. Drop and recreate statistics with `ALTER TABLE ... ALTER COLUMN ... SET STATISTICS 1000;` then ANALYZE; verify the planner's estimates improve for skewed data.
5. Install pgstattuple; run `SELECT * FROM pgstattuple('events')` before and after VACUUM FULL to see the free_space percentage drop.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between EXPLAIN and EXPLAIN ANALYZE?
9. A) They are identical
10. B) EXPLAIN shows estimates; EXPLAIN ANALYZE runs the query and shows actual times (*)
11. C) EXPLAIN ANALYZE is slower
12. D) EXPLAIN is deprecated
13. Explanation: EXPLAIN shows the planner's cost and row estimates; EXPLAIN ANALYZE actually runs the query (DML inside a rollback for safety in some clients) and reports actual times, row counts, and loops.
14. Q2: Why is VACUUM needed in Postgres?
15. A) To compact tables
16. B) To run ANALYZE
17. C) To mark MVCC dead tuples as reusable and update the visibility map (*)
18. D) To drop indexes
19. Explanation: MVCC leaves dead tuples after UPDATE/DELETE; VACUUM marks them reusable (space can be reused by future INSERTs/UPDATEs) and updates the visibility map so Index Only Scans work.
20. Q3: What's the difference between VACUUM and VACUUM FULL?
21. A) VACUUM FULL is faster
22. B) VACUUM FULL is automatic
23. C) There is no difference
24. D) VACUUM marks dead tuples reusable (no shrink, no lock); VACUUM FULL rewrites and shrinks but takes AccessExclusiveLock (*)
25. Explanation: VACUUM is safe online; VACUUM FULL blocks everything while it rewrites the file. Use pg_repack or pg_squeeze for online bloat removal in production.
26. Q4: What does the visibility map track?
27. A) Which pages contain only live tuples (all-visible), enabling Index Only Scans (*)
28. B) Which rows are visible to which transactions
29. C) Which users can see which schemas
30. D) Which transactions are committed
31. Explanation: The visibility map marks pages as all-visible; VACUUM maintains it. Index Only Scans require the page to be all-visible, so a never-VACUUMed table can't do Index Only Scans.
32. Q5: How do you tighten autovacuum for a high-churn table?
33. A) Disable autovacuum and run manual VACUUM
34. B) ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.05) to vacuum when 5% dead (*)
35. C) Increase shared_buffers
36. D) Set autovacuum = off globally
37. Explanation: The default scale_factor is 0.2 (20% dead); high-churn tables need 0.05 or lower. Also tune autovacuum_vacuum_cost_limit to vacuum harder.
38. Q6: What does BUFFERS in EXPLAIN (ANALYZE, BUFFERS) show?
39. A) Buffer pool size
40. B) Connection count
41. C) shared hit/read/written/dirtied blocks per plan node (*)
42. D) Lock waits
43. Explanation: BUFFERS shows how many pages were served from cache (hit) vs disk (read), and how many were dirtied/written. High hit ratio = good cache use; high read = cold data.
44. Q7: Why might a function call in WHERE defeat an index?
45. A) Functions can't be in WHERE
46. B) It always uses the index
47. C) It disables the planner
48. D) `WHERE LOWER(email) = 'x'` only uses an index on LOWER(email), not on email (*)
49. Explanation: Indexes are on the column value, not the function result; an expression index on LOWER(email) is needed for `WHERE LOWER(email) = ...` to be indexed.
50. Q8: What does stale statistics cause?
51. A) Bad row estimates and wrong plans (Seq Scan instead of Index Scan, or vice versa) (*)
52. B) Crashes
53. C) Data loss
54. D) Replication lag
55. Explanation: The planner uses pg_statistic to estimate row counts; stale stats (after bulk loads) cause bad estimates and bad plans. Run VACUUM ANALYZE after bulk loads.
56. Q9: What is plan_cache_mode = force_custom_plan for?
57. A) Forcing all queries to use the same plan
58. B) Forcing prepared statements to use parameter-aware custom plans instead of generic (*)
59. C) Disabling prepared statements
60. D) Caching more plans
61. Explanation: Generic prepared-statement plans can be slow for skewed data; force_custom_plan makes every EXECUTE re-plan with the actual parameter value. PG12+ defaults to auto (5 custom plans then maybe generic).
62. Q10: Which is a sign of bloat in pg_stat_user_tables?
63. A) n_live_tup = 0
64. B) last_analyze is recent
65. C) High n_dead_tup ratio and last_autovacuum is old or null (*)
66. D) seq_scan is high
67. Explanation: A high n_dead_tup / n_live_tup ratio (e.g. >20%) with no recent autovacuum indicates autovacuum is falling behind and bloat is accumulating; tighten the per-table autovacuum settings.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between EXPLAIN and EXPLAIN ANALYZE?
  options:
    - They are identical
    - EXPLAIN shows estimates; EXPLAIN ANALYZE runs the query and shows actual times
    - EXPLAIN ANALYZE is slower
    - EXPLAIN is deprecated
  correctIndex: 1
  explanation: EXPLAIN shows the planner's cost and row estimates; EXPLAIN ANALYZE actually runs the query (DML inside a rollback for safety in some clients) and reports actual times, row counts, and loops.
- id: q2
  question: Why is VACUUM needed in Postgres?
  options:
    - To compact tables
    - To run ANALYZE
    - To mark MVCC dead tuples as reusable and update the visibility map
    - To drop indexes
  correctIndex: 2
  explanation: MVCC leaves dead tuples after UPDATE/DELETE; VACUUM marks them reusable (space can be reused by future INSERTs/UPDATEs) and updates the visibility map so Index Only Scans work.
- id: q3
  question: What's the difference between VACUUM and VACUUM FULL?
  options:
    - VACUUM FULL is faster
    - VACUUM FULL is automatic
    - There is no difference
    - VACUUM marks dead tuples reusable (no shrink, no lock); VACUUM FULL rewrites and shrinks but takes AccessExclusiveLock
  correctIndex: 3
  explanation: VACUUM is safe online; VACUUM FULL blocks everything while it rewrites the file. Use pg_repack or pg_squeeze for online bloat removal in production.
- id: q4
  question: What does the visibility map track?
  options:
    - Which pages contain only live tuples (all-visible), enabling Index Only Scans
    - Which rows are visible to which transactions
    - Which users can see which schemas
    - Which transactions are committed
  correctIndex: 0
  explanation: The visibility map marks pages as all-visible; VACUUM maintains it. Index Only Scans require the page to be all-visible, so a never-VACUUMed table can't do Index Only Scans.
- id: q5
  question: How do you tighten autovacuum for a high-churn table?
  options:
    - Disable autovacuum and run manual VACUUM
    - ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.05) to vacuum when 5% dead
    - Increase shared_buffers
    - Set autovacuum = off globally
  correctIndex: 1
  explanation: The default scale_factor is 0.2 (20% dead); high-churn tables need 0.05 or lower. Also tune autovacuum_vacuum_cost_limit to vacuum harder.
- id: q6
  question: What does BUFFERS in EXPLAIN (ANALYZE, BUFFERS) show?
  options:
    - show?
    - Buffer pool size
    - Connection count
    - shared hit/read/written/dirtied blocks per plan node
    - Lock waits
  correctIndex: 3
  explanation: BUFFERS shows how many pages were served from cache (hit) vs disk (read), and how many were dirtied/written. High hit ratio = good cache use; high read = cold data.
- id: q7
  question: Why might a function call in WHERE defeat an index?
  options:
    - Functions can't be in WHERE
    - It always uses the index
    - It disables the planner
    - "`WHERE LOWER(email) = 'x'` only uses an index on LOWER(email), not on email"
  correctIndex: 3
  explanation: Indexes are on the column value, not the function result; an expression index on LOWER(email) is needed for `WHERE LOWER(email) = ...` to be indexed.
- id: q8
  question: What does stale statistics cause?
  options:
    - Bad row estimates and wrong plans (Seq Scan instead of Index Scan, or vice versa)
    - Crashes
    - Data loss
    - Replication lag
  correctIndex: 0
  explanation: The planner uses pg_statistic to estimate row counts; stale stats (after bulk loads) cause bad estimates and bad plans. Run VACUUM ANALYZE after bulk loads.
- id: q9
  question: What is plan_cache_mode = force_custom_plan for?
  options:
    - Forcing all queries to use the same plan
    - Forcing prepared statements to use parameter-aware custom plans instead of generic
    - Disabling prepared statements
    - Caching more plans
  correctIndex: 1
  explanation: Generic prepared-statement plans can be slow for skewed data; force_custom_plan makes every EXECUTE re-plan with the actual parameter value. PG12+ defaults to auto (5 custom plans then maybe generic).
- id: q10
  question: Which is a sign of bloat in pg_stat_user_tables?
  options:
    - n_live_tup = 0
    - last_analyze is recent
    - High n_dead_tup ratio and last_autovacuum is old or null
    - seq_scan is high
  correctIndex: 2
  explanation: A high n_dead_tup / n_live_tup ratio (e.g. >20%) with no recent autovacuum indicates autovacuum is falling behind and bloat is accumulating; tighten the per-table autovacuum settings.
```

