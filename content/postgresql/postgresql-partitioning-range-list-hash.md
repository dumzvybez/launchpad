---
slug: postgresql-partitioning-range-list-hash
id: postgresql-12
track: postgresql
order: 12
title: Partitioning — Range, List, Hash
description: Partition huge tables by range (time-series), list (regions/categories), or hash (even distribution), and understand the planner's partition pruning and routing.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=13200s
whyItMatters: Partition huge tables by range (time-series), list (regions/categories), or hash (even distribution), and understand the planner's partition pruning and routing.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Partitioning — Range, List, Hash

## Partitioning — Range, List, Hash

### Why It Matters

Partition huge tables by range (time-series), list (regions/categories), or hash (even distribution), and understand the planner's partition pruning and routing.

Partition huge tables by range (time-series), list (regions/categories), or hash (even distribution), and understand the planner's partition pruning and routing.

### Prerequisites

- Stage 4: Schemas, Tables, and Constraints
- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN

### Topics

- CREATE TABLE ... PARTITION BY RANGE/LIST/HASH
- Creating partitions: explicit, DEFAULT, and pg_partman for automation
- Partition pruning: the planner skips irrelevant partitions at plan time
- Runtime pruning (parameterized queries) and prepare/exec generic plans
- Subpartitioning (range by date, then hash by tenant)
- Unique constraints on partitioned tables must include the partition key
- Foreign keys referencing partitioned tables (PG12+), partitioned FKs (PG13+)
- Detach and attach partitions online for zero-downtime retention

### Key Concepts

- Partitioning splits one logical table into multiple physical tables; the planner prunes partitions not needed for a query, often turning a 1B-row scan into a 10M-row scan.
- Range partitioning is the default for time-series (one partition per day/month/year); list is for discrete values (region, category); hash is for even distribution when no natural key exists.
- The partition key must be part of any UNIQUE constraint — you can't have a globally unique email on a hash-partitioned table without including the partition key.
- Partition pruning happens at plan time (constants) and at runtime (parameterized queries via EXECUTE); generic prepared-statement plans may defeat pruning (PG12+ generic plans are smarter but still risk).
- Detaching a partition is online (PG14+ supports CONCURRENTLY) — perfect for dropping old data without the locks a DELETE would take.
- pg_partman automates partition creation and retention (create next month, drop oldest); essential for time-series at scale.
- Subpartitioning (e.g. range by date then hash by tenant) is powerful but adds planner complexity; benchmark carefully.

```sql
CREATE TABLE events (
    id          bigint GENERATED ALWAYS AS IDENTITY,
    tenant_id   bigint NOT NULL,
    occurred_at timestamptz NOT NULL,
    event_type  text NOT NULL,
    payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
    PRIMARY KEY (id, occurred_at)            -- PK must include partition key
) PARTITION BY RANGE (occurred_at);

CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE events_2024_02 PARTITION OF events
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE events_default PARTITION OF events DEFAULT;

-- The planner prunes to the relevant partition:
EXPLAIN SELECT count(*) FROM events
WHERE occurred_at >= '2024-01-15' AND occurred_at < '2024-01-20';
-- Shows: Seq Scan on events_2024_01 only (other partitions pruned)
```
Caption: Range partitioning by month

### Common Pitfalls

- Unique constraints that exclude the partition key — Postgres rejects `UNIQUE (email)` on a hash-partitioned table; you must include the partition key (e.g. `UNIQUE (user_id, email)`), which weakens the guarantee.
- Generic prepared-statement plans defeating pruning — `PREPARE ... AS SELECT ... WHERE occurred_at = $1` may use a generic plan that scans all partitions; PG12+ is smarter but monitor with EXPLAIN GENERIC.
- Forgetting to detach before dropping old partitions — `DROP TABLE events_2022_01` while it's still a partition is fine, but if you want to move it to cheaper storage first, you must DETACH.
- Too many partitions — 1000+ partitions slow planning (the planner iterates all of them); use pg_partman's retention to keep partition count bounded, or use subpartitioning.
- Default partition accumulating misplaced rows — rows that don't match any partition go to DEFAULT; if your partition boundaries drift, DEFAULT grows unbounded and queries against it can be slow.

### Real-World Applications

- Discord partitions message tables by month and detaches old months to cold storage for free-tier history retention.
- Reddit partitions vote tables by range (time) and hash (post_id) for even write distribution.
- Spotify partitions play-event tables by day for fast ingestion and easy retention (drop old days).
- Twitch partitions chat events by hour during major events (-stream awards) for tight pruning.

### Interview Questions

- 1. What are the three partitioning strategies in Postgres? — RANGE (time-series), LIST (discrete values), HASH (even distribution by hash of a key).
- 2. Why must the partition key be in any UNIQUE constraint? — Postgres can only enforce uniqueness within a partition; to enforce globally, it must know which partition to check, which requires the partition key.
- 3. What is partition pruning? — The planner skips partitions that can't contain matching rows based on the WHERE clause; happens at plan time (constants) and runtime (parameters).
- 4. How do you drop old data from a partitioned table efficiently? — DETACH the old partition (CONCURRENTLY in PG14+), then DROP it — instant, vs a slow DELETE that bloats the table.
- 5. What's the risk of too many partitions? — The planner iterates all partitions during planning, slowing every query; keep partition count bounded (typically <1000) with retention automation.

### Mini Project

Build a Time-Series Events Store: An `events` table range-partitioned by month with a DEFAULT partition, a `pg_partman` config to auto-create next month and drop partitions older than 13 months, and a script that demonstrates prune (query one month → one partition scanned) vs no prune (query all months → all partitions scanned). Suggested approach:
  - Create the parent with PRIMARY KEY (id, occurred_at) and PARTITION BY RANGE (occurred_at)
  - Create 3 monthly partitions for 2024-01, 2024-02, 2024-03
  - Install pg_partman and `SELECT partman.create_parent('public.events', 'occurred_at', 'native', 'monthly')`
  - Configure retention: `UPDATE partman.part_config SET retention = '13 months' WHERE parent_table = 'public.events'`
  - Use EXPLAIN to show partition pruning on a single-month WHERE clause

### Exercises

1. Create a range-partitioned table by month with 3 partitions; insert rows for each month; verify queries with a single-month WHERE prune to one partition via EXPLAIN.
2. Try to add UNIQUE(email) on a hash-partitioned table without the partition key — observe the error.
3. DETACH an old partition, drop it, and verify the parent table no longer has the rows (instant vs slow DELETE).
4. Create a subpartitioned table (range by date, hash by tenant); insert 1000 rows; verify pruning works on both dimensions.
5. Use pg_partman to auto-create next month's partition and schedule retention drop of partitions older than N months.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which partitioning strategy is best for time-series data?
9. A) LIST
10. B) HASH
11. C) MODULAR
12. D) RANGE (*)
13. Explanation: RANGE partitioning on a timestamp lets the planner prune to relevant time windows; LIST is for discrete values; HASH is for even distribution when no natural key exists.
14. Q2: Why must the partition key be included in any UNIQUE constraint on a partitioned table?
15. A) Postgres enforces uniqueness only within a partition; without the key it can't route to the right partition (*)
16. B) It's faster
17. C) It's required by SQL standard
18. D) It enables GIN indexes
19. Explanation: Postgres can only check uniqueness within a single partition; to enforce globally it must know which partition to look in, which requires the partition key in the constraint.
20. Q3: What is partition pruning?
21. A) Dropping old partitions
22. B) The planner skips partitions that can't contain matching rows (*)
23. C) Compressing partitions
24. D) Indexing partitions
25. Explanation: Based on the WHERE clause, the planner excludes partitions that can't match; happens at plan time for constants and at runtime for parameters (PG11+).
26. Q4: Which is the most efficient way to drop old data from a partitioned table?
27. A) DELETE WHERE occurred_at < ...
28. B) TRUNCATE
29. C) DETACH the old partition, then DROP it (*)
30. D) VACUUM
31. Explanation: DETACH (CONCURRENTLY in PG14+) and DROP is O(1); DELETE scans and writes dead tuples, bloating the table and causing VACUUM load.
32. Q5: What can defeat partition pruning with prepared statements?
33. A) Using binds
34. B) Too many columns
35. C) Using GIN indexes
36. D) Generic plans that don't specialize on parameter values (*)
37. Explanation: A generic prepared-statement plan doesn't know the parameter value at plan time, so it can't prune; PG12+ is smarter but monitor with EXPLAIN GENERIC. Use custom plans or filter at the app layer.
38. Q6: How many partitions is "too many"?
39. A) Typically >1000 — the planner iterates all partitions, slowing every query (*)
40. B) 10
41. C) 100
42. D) There's no limit
43. Explanation: The planner iterates all partitions during planning; with 1000+ partitions, planning time dominates. Use retention automation (pg_partman) to keep the count bounded.
44. Q7: What does the DEFAULT partition do?
45. A) Stores the most-recent rows
46. B) Catches rows that don't match any defined partition (*)
47. C) Stores indexes
48. D) Stores constraints
49. Explanation: Rows that don't match any partition's range/list/hash go to DEFAULT; if your boundaries drift, DEFAULT grows unbounded — monitor it.
50. Q8: Which is TRUE about subpartitioning?
51. A) It's not supported
52. B) Subpartitioning always speeds up queries
53. C) You can partition by RANGE then HASH (e.g. date then tenant) (*)
54. D) Subpartitioning disables pruning
55. Explanation: Subpartitioning (e.g. range by date, then hash by tenant) is supported and useful for multi-dimensional pruning; but it adds planner complexity — benchmark carefully.
56. Q9: What does `ALTER TABLE ... ATTACH PARTITION ... FOR VALUES FROM (...) TO (...)` do?
57. A) Drops the partition
58. B) Creates a new table
59. C) Reindexes the parent
60. D) Adds an existing table as a new partition of the parent (*)
61. Explanation: ATTACH PARTITION turns an existing standalone table into a partition of the parent; useful for preparing next month's table offline, then attaching with a brief lock.
62. Q10: What does pg_partman do?
63. A) Automates partition creation and retention (create next month, drop oldest) (*)
64. B) Indexes partitions
65. C) Backs up partitions
66. D) Replicates partitions
67. Explanation: pg_partman is the standard extension for managing time-based partitioning: it pre-creates future partitions and drops old ones per a retention policy. Essential for time-series at scale.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which partitioning strategy is best for time-series data?
  options:
    - LIST
    - HASH
    - MODULAR
    - RANGE
  correctIndex: 3
  explanation: RANGE partitioning on a timestamp lets the planner prune to relevant time windows; LIST is for discrete values; HASH is for even distribution when no natural key exists.
- id: q2
  question: Why must the partition key be included in any UNIQUE constraint on a partitioned table?
  options:
    - Postgres enforces uniqueness only within a partition; without the key it can't route to the right partition
    - It's faster
    - It's required by SQL standard
    - It enables GIN indexes
  correctIndex: 0
  explanation: Postgres can only check uniqueness within a single partition; to enforce globally it must know which partition to look in, which requires the partition key in the constraint.
- id: q3
  question: What is partition pruning?
  options:
    - Dropping old partitions
    - The planner skips partitions that can't contain matching rows
    - Compressing partitions
    - Indexing partitions
  correctIndex: 1
  explanation: Based on the WHERE clause, the planner excludes partitions that can't match; happens at plan time for constants and at runtime for parameters (PG11+).
- id: q4
  question: Which is the most efficient way to drop old data from a partitioned table?
  options:
    - DELETE WHERE occurred_at < ...
    - TRUNCATE
    - DETACH the old partition, then DROP it
    - VACUUM
  correctIndex: 2
  explanation: DETACH (CONCURRENTLY in PG14+) and DROP is O(1); DELETE scans and writes dead tuples, bloating the table and causing VACUUM load.
- id: q5
  question: What can defeat partition pruning with prepared statements?
  options:
    - Using binds
    - Too many columns
    - Using GIN indexes
    - Generic plans that don't specialize on parameter values
  correctIndex: 3
  explanation: A generic prepared-statement plan doesn't know the parameter value at plan time, so it can't prune; PG12+ is smarter but monitor with EXPLAIN GENERIC. Use custom plans or filter at the app layer.
- id: q6
  question: How many partitions is "too many"?
  options:
    - Typically >1000 — the planner iterates all partitions, slowing every query
    - "10"
    - "100"
    - There's no limit
  correctIndex: 0
  explanation: The planner iterates all partitions during planning; with 1000+ partitions, planning time dominates. Use retention automation (pg_partman) to keep the count bounded.
- id: q7
  question: What does the DEFAULT partition do?
  options:
    - Stores the most-recent rows
    - Catches rows that don't match any defined partition
    - Stores indexes
    - Stores constraints
  correctIndex: 1
  explanation: Rows that don't match any partition's range/list/hash go to DEFAULT; if your boundaries drift, DEFAULT grows unbounded — monitor it.
- id: q8
  question: Which is TRUE about subpartitioning?
  options:
    - It's not supported
    - Subpartitioning always speeds up queries
    - You can partition by RANGE then HASH (e.g. date then tenant)
    - Subpartitioning disables pruning
  correctIndex: 2
  explanation: Subpartitioning (e.g. range by date, then hash by tenant) is supported and useful for multi-dimensional pruning; but it adds planner complexity — benchmark carefully.
- id: q9
  question: What does `ALTER TABLE ... ATTACH PARTITION ... FOR VALUES FROM (...) TO (...)` do?
  options:
    - Drops the partition
    - Creates a new table
    - Reindexes the parent
    - Adds an existing table as a new partition of the parent
  correctIndex: 3
  explanation: ATTACH PARTITION turns an existing standalone table into a partition of the parent; useful for preparing next month's table offline, then attaching with a brief lock.
- id: q10
  question: What does pg_partman do?
  options:
    - Automates partition creation and retention (create next month, drop oldest)
    - Indexes partitions
    - Backs up partitions
    - Replicates partitions
  correctIndex: 0
  explanation: "pg_partman is the standard extension for managing time-based partitioning: it pre-creates future partitions and drops old ones per a retention policy. Essential for time-series at scale."
```

