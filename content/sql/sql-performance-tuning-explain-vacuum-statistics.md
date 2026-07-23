---
slug: sql-performance-tuning-explain-vacuum-statistics
id: sql-16
track: sql
order: 16
title: Performance Tuning — EXPLAIN, Vacuum, Statistics
description: Diagnose slow queries with EXPLAIN (ANALYZE, BUFFERS), understand seq scans, index scans, and join strategies, and keep the planner healthy with VACUUM, ANALYZE, and statistics tuning.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=10400s
whyItMatters: Diagnose slow queries with EXPLAIN (ANALYZE, BUFFERS), understand seq scans, index scans, and join strategies, and keep the planner healthy with VACUUM, ANALYZE, and statistics tuning.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Performance Tuning — EXPLAIN, Vacuum, Statistics

## Performance Tuning — EXPLAIN, Vacuum, Statistics

### Why It Matters

Diagnose slow queries with EXPLAIN (ANALYZE, BUFFERS), understand seq scans, index scans, and join strategies, and keep the planner healthy with VACUUM, ANALYZE, and statistics tuning.

Diagnose slow queries with EXPLAIN (ANALYZE, BUFFERS), understand seq scans, index scans, and join strategies, and keep the planner healthy with VACUUM, ANALYZE, and statistics tuning.

### Prerequisites

- Stage 15: Pivot, Unpivot, and Advanced Aggregations.
- A loaded database (~1M+ rows) with realistic distribution.

### Topics

- EXPLAIN, EXPLAIN (ANALYZE), EXPLAIN (ANALYZE, BUFFERS, WAL, SETTINGS)
- Reading plans: Seq Scan, Index Scan, Bitmap Index Scan, Index Only Scan
- Join strategies: Nested Loop, Hash Join, Merge Join
- Sort, HashAggregate, Gather (parallel)
- VACUUM, AUTOVACUUM, ANALYZE, VACUUM FULL
- Statistics: pg_statistic, default_statistics_target, ALTER TABLE SET STATISTICS
- Bloat: pgstattuple, dead tuples, visibility map
- Common tuning knobs: work_mem, shared_buffers, effective_cache_size

### Key Concepts

- EXPLAIN shows the plan; EXPLAIN ANALYZE actually runs the query and reports real timings — but it executes side effects (use a transaction with ROLLBACK for writes).
- Seq Scan isn't always bad — for small tables or large fractions of a big table, scanning is faster than an index.
- Bitmap Index Scan + Bitmap Heap Scan handles multiple indexes or non-prefix range conditions; Index Scan is for point or narrow-range lookups.
- Nested Loop is good for small outer inputs; Hash Join is good for larger unsorted inputs; Merge Join requires sorted inputs.
- ANALYZE samples columns to build statistics; stale stats cause bad plans. autovacuum handles this, but heavy-write tables may need higher frequency.
- Bloat (dead tuples not yet reclaimed) slows seq scans and index lookups; VACUUM reclaims space, VACUUM FULL rebuilds (locks the table).

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.last_name, SUM(p.amount) AS total
FROM customer c
JOIN payment p ON p.customer_id = c.customer_id
WHERE p.payment_date >= '2020-01-01'
GROUP BY c.customer_id, c.last_name
ORDER BY total DESC
LIMIT 10;

-- Look for: Index Scan vs Seq Scan, Hash Join vs Nested Loop,
-- actual rows vs estimated rows (mismatch = stale stats),
-- "Buffers: shared hit" (cache) vs "shared read" (disk)
```
Caption: Reading a plan

### Common Pitfalls

- EXPLAIN ANALYZE on writes — ANALYZE actually executes; wrap writes in BEGIN; ... ROLLBACK; to avoid side effects.
- Stale statistics — `n_distinct` and histogram buckets get out of date after bulk loads; run ANALYZE manually.
- Confusing VACUUM and VACUUM FULL — VACUUM reclaims dead tuples (concurrent, doesn't shrink files); VACUUM FULL rewrites the table (locks, shrinks).
- Setting work_mem too high globally — multiplied by max_connections, can OOM; set per-session for big queries.
- Disabling planner options in production — `enable_nestloop = off` is a diagnostic tool; the planner knows better than you in 99% of cases.

### Real-World Applications

- Stripe's DBAs run EXPLAIN (ANALYZE, BUFFERS) on every slow charge query during incidents.
- Netflix's analytics team tunes default_statistics_target on skewed user-content columns to fix bad plans.
- LinkedIn uses pgstattuple to monitor bloat on the member-profile table; runs VACUUM FULL during off-hours.
- Airbnb's data team uses per-session work_mem bumps for large booking-aggregation queries to avoid disk spills.

### Interview Questions

- 1. Difference between EXPLAIN and EXPLAIN ANALYZE? — EXPLAIN shows the plan; ANALYZE actually runs the query and reports real timings and row counts.
- 2. When is a Seq Scan preferred over an Index Scan? — Small tables, or when the query returns a large fraction of the table (index + heap fetch is slower than scanning).
- 3. What's the difference between VACUUM and VACUUM FULL? — VACUUM reclaims dead tuples (concurrent, doesn't shrink); VACUUM FULL rewrites (locks, shrinks).
- 4. Why increase `default_statistics_target`? — More histogram buckets give the planner better estimates for skewed columns, fixing bad plans at the cost of slower ANALYZE.
- 5. How do you fix a slow sort that spills to disk? — Bump `work_mem` per session until the sort fits in memory; check the EXPLAIN ANALYZE "Sort Method: external merge Disk" line.

### Mini Project

Tune a Slow Analytics Query: Take a multi-join aggregation that takes >5 seconds, profile with EXPLAIN (ANALYZE, BUFFERS), and improve it via indexes, statistics, and work_mem. Document before/after. Suggested approach:
  - Capture the baseline plan and timing
  - Identify the worst node (seq scan on a big table? nested loop on huge inputs? sort spilling to disk?)
  - Add a composite index or expression index
  - Run ANALYZE on the affected tables; bump stats target on skewed columns
  - Bump work_mem for the session; re-measure
  - Document the chosen interventions and the final plan in a tuning.md

### Exercises

1. Run EXPLAIN on a simple SELECT; identify the scan type and cost estimate.
2. Add EXPLAIN ANALYZE and compare estimated vs actual rows.
3. Find a table with >5% dead tuples via pg_stat_user_tables; VACUUM ANALYZE it.
4. Bump default_statistics_target to 1000 on a skewed column; ANALYZE; check if the plan changes.
5. Set work_mem = '128MB' for a session; verify a Sort node switches from external merge to quicksort.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does EXPLAIN ANALYZE do that EXPLAIN alone doesn't?
9. A) Shows the query plan
10. B) Generates an index
11. C) Rewrites the query
12. D) Actually executes the query and reports real timings and row counts (*)
13. Explanation: EXPLAIN ANALYZE runs the query and reports actual timing, loops, and rows — but executes side effects; wrap writes in BEGIN/ROLLBACK.
14. Q2: When is a Seq Scan preferred over an Index Scan?
15. A) For small tables or large fractions of a big table (*)
16. B) Always
17. C) Never
18. D) Only with foreign keys
19. Explanation: For small tables or queries returning a large fraction of rows, the index + heap fetch overhead exceeds a sequential scan.
20. Q3: Which join strategy requires sorted inputs?
21. A) Nested Loop
22. B) Merge Join (*)
23. C) Hash Join
24. D) Cross Join
25. Explanation: Merge Join walks two sorted inputs in tandem; the planner adds a Sort if inputs aren't sorted, or uses an index for ordered access.
26. Q4: What does VACUUM FULL do that VACUUM doesn't?
27. A) Runs ANALYZE
28. B) Updates statistics
29. C) Rewrites the table to reclaim OS space (but takes an ACCESS EXCLUSIVE lock) (*)
30. D) Skips dead tuples
31. Explanation: VACUUM reclaims dead tuples for reuse (no shrink); VACUUM FULL rewrites the file (shrinks, but locks the table).
32. Q5: What's the risk of setting work_mem too high globally?
33. A) Slower queries
34. B) Index corruption
35. C) Replication lag
36. D) Memory exhaustion (work_mem * max_connections can OOM) (*)
37. Explanation: work_mem is per-node, per-operation; multiplied by concurrent operations, it can exhaust RAM. Set per-session for big queries.
38. Q6: Which catalog view shows dead vs live tuples per table?
39. A) pg_stat_user_tables (*)
40. B) pg_stat_activity
41. C) pg_indexes
42. D) pg_settings
43. Explanation: pg_stat_user_tables has n_live_tup, n_dead_tup, last_vacuum, last_analyze — the bloat-monitoring view.
44. Q7: When would you bump `SET STATISTICS` on a column?
45. A) When the column is small
46. B) When the column has a skewed distribution and the planner mis-estimates (*)
47. C) When the column is a primary key
48. D) Always
49. Explanation: Bumping statistics target increases histogram buckets, improving estimates on skewed columns at the cost of slower ANALYZE.
50. Q8: What does "Sort Method: external merge Disk 50MB" in EXPLAIN ANALYZE indicate?
51. A) The sort fit in memory
52. B) The query is invalid
53. C) The sort spilled to disk (slow); bump work_mem to fit in memory (*)
54. D) The index is corrupt
55. Explanation: "external merge Disk" means the sort didn't fit in work_mem; bumping it per-session often yields a 10x speedup.
56. Q9: Bitmap Index Scan + Bitmap Heap Scan is used when?
57. A) For a single point lookup
58. B) Only for joins
59. C) Only with SERIALIZABLE
60. D) For non-prefix range conditions or multiple indexes that get ORed (*)
61. Explanation: Bitmap scans build a bitmap of matching tuples then fetch them; useful for ranges, multiple indexes (BitmapOr), and avoiding random I/O.
62. Q10: Setting `enable_nestloop = off` is?
63. A) A diagnostic tool to force alternative plans; never use in production (*)
64. B) A production tuning best practice
65. C) Required for SERIALIZABLE
66. D) A way to disable indexes
67. Explanation: Disabling planner options is for diagnostics only; the planner is smarter than hard-coded hints in 99% of cases.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does EXPLAIN ANALYZE do that EXPLAIN alone doesn't?
  options:
    - Shows the query plan
    - Generates an index
    - Rewrites the query
    - Actually executes the query and reports real timings and row counts
  correctIndex: 3
  explanation: EXPLAIN ANALYZE runs the query and reports actual timing, loops, and rows — but executes side effects; wrap writes in BEGIN/ROLLBACK.
- id: q2
  question: When is a Seq Scan preferred over an Index Scan?
  options:
    - For small tables or large fractions of a big table
    - Always
    - Never
    - Only with foreign keys
  correctIndex: 0
  explanation: For small tables or queries returning a large fraction of rows, the index + heap fetch overhead exceeds a sequential scan.
- id: q3
  question: Which join strategy requires sorted inputs?
  options:
    - Nested Loop
    - Merge Join
    - Hash Join
    - Cross Join
  correctIndex: 1
  explanation: Merge Join walks two sorted inputs in tandem; the planner adds a Sort if inputs aren't sorted, or uses an index for ordered access.
- id: q4
  question: What does VACUUM FULL do that VACUUM doesn't?
  options:
    - Runs ANALYZE
    - Updates statistics
    - Rewrites the table to reclaim OS space (but takes an ACCESS EXCLUSIVE lock)
    - Skips dead tuples
  correctIndex: 2
  explanation: VACUUM reclaims dead tuples for reuse (no shrink); VACUUM FULL rewrites the file (shrinks, but locks the table).
- id: q5
  question: What's the risk of setting work_mem too high globally?
  options:
    - Slower queries
    - Index corruption
    - Replication lag
    - Memory exhaustion (work_mem * max_connections can OOM)
  correctIndex: 3
  explanation: work_mem is per-node, per-operation; multiplied by concurrent operations, it can exhaust RAM. Set per-session for big queries.
- id: q6
  question: Which catalog view shows dead vs live tuples per table?
  options:
    - pg_stat_user_tables
    - pg_stat_activity
    - pg_indexes
    - pg_settings
  correctIndex: 0
  explanation: pg_stat_user_tables has n_live_tup, n_dead_tup, last_vacuum, last_analyze — the bloat-monitoring view.
- id: q7
  question: When would you bump `SET STATISTICS` on a column?
  options:
    - When the column is small
    - When the column has a skewed distribution and the planner mis-estimates
    - When the column is a primary key
    - Always
  correctIndex: 1
  explanation: Bumping statistics target increases histogram buckets, improving estimates on skewed columns at the cost of slower ANALYZE.
- id: q8
  question: 'What does "Sort Method: external merge Disk 50MB" in EXPLAIN ANALYZE indicate?'
  options:
    - The sort fit in memory
    - The query is invalid
    - The sort spilled to disk (slow); bump work_mem to fit in memory
    - The index is corrupt
  correctIndex: 2
  explanation: "\"external merge Disk\" means the sort didn't fit in work_mem; bumping it per-session often yields a 10x speedup."
- id: q9
  question: Bitmap Index Scan + Bitmap Heap Scan is used when?
  options:
    - For a single point lookup
    - Only for joins
    - Only with SERIALIZABLE
    - For non-prefix range conditions or multiple indexes that get ORed
  correctIndex: 3
  explanation: Bitmap scans build a bitmap of matching tuples then fetch them; useful for ranges, multiple indexes (BitmapOr), and avoiding random I/O.
- id: q10
  question: Setting `enable_nestloop = off` is?
  options:
    - A diagnostic tool to force alternative plans; never use in production
    - A production tuning best practice
    - Required for SERIALIZABLE
    - A way to disable indexes
  correctIndex: 0
  explanation: Disabling planner options is for diagnostics only; the planner is smarter than hard-coded hints in 99% of cases.
```

