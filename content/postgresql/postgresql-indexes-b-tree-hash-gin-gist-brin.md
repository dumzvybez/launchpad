---
slug: postgresql-indexes-b-tree-hash-gin-gist-brin
id: postgresql-05
track: postgresql
order: 5
title: Indexes — B-tree, Hash, GIN, GiST, BRIN
description: Choose the right index type for each query, understand partial and expression indexes, covering (INCLUDE) indexes, and the tradeoffs of each — plus when NOT to index.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=4800s
whyItMatters: Choose the right index type for each query, understand partial and expression indexes, covering (INCLUDE) indexes, and the tradeoffs of each — plus when NOT to index.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Indexes — B-tree, Hash, GIN, GiST, BRIN

## Indexes — B-tree, Hash, GIN, GiST, BRIN

### Why It Matters

Choose the right index type for each query, understand partial and expression indexes, covering (INCLUDE) indexes, and the tradeoffs of each — plus when NOT to index.

Choose the right index type for each query, understand partial and expression indexes, covering (INCLUDE) indexes, and the tradeoffs of each — plus when NOT to index.

### Prerequisites

- Stage 4: Schemas, Tables, and Constraints
- Familiarity with EXPLAIN output (covered deeper in Stage 14).

### Topics

- B-tree: the default, good for =, <, >, BETWEEN, ORDER BY, IS NULL
- Hash: only = (and not for ORDER BY); useful for dedup on large tables
- GIN: inverted index for arrays, jsonb, tsvector, full-text; fast lookup, slow build
- GiST: range/geometric/overlapping data; powers EXCLUDE constraints
- BRIN: block-range index for naturally-ordered, huge tables (time-series)
- Partial indexes: WHERE clause on the index; great for "active = true" subsets
- Expression indexes: index LOWER(email) or (event_type, occurred_at)
- Covering indexes with INCLUDE for index-only scans; RECENTLY DEAD hint

### Key Concepts

- A B-tree index is the default and is excellent for equality, range, ORDER BY, and UNIQUE — but it can be defeated by leading-wildcard LIKE (`'%foo'`) or unrelated leading columns.
- Indexes are not free: every INSERT/UPDATE/DELETE updates every index on the table (the write amplification cost). Five indexes on a hot table can quintuple write load.
- A partial index (`CREATE INDEX ... WHERE active`) is smaller and faster than a full index when most rows match the predicate — it's also self-documenting intent.
- A covering index (`CREATE INDEX ... INCLUDE (col)`) lets queries that need only the indexed and INCLUDE columns do an index-only scan (no heap fetch).
- An expression index (`CREATE INDEX ON users (LOWER(email))`) is necessary for case-insensitive equality — without it, `WHERE LOWER(email) = '...'` cannot use a plain email index.
- BRIN is tiny (kilobytes vs gigabytes) and only useful when physical row order correlates with the indexed value (e.g. append-only time-series by timestamp).
- GIN indexes jsonb and arrays but are slow to update — consider `gin_pending_list_limit` and a fastupdate threshold.

```sql
-- B-tree (default) — equality, range, ORDER BY:
CREATE INDEX events_type_time_idx
    ON events (event_type, occurred_at DESC);

-- Hash — only equality, but smaller for pure dedup:
CREATE INDEX session_hash_idx ON session (session_token);

-- GIN — full-text, jsonb, arrays:
CREATE INDEX events_payload_gin
    ON events USING gin (payload jsonb_path_ops);   -- jsonb_path_ops = smaller, faster

-- GiST — ranges, geometric, exclusion:
CREATE INDEX bookings_during_gist
    ON room_booking USING gist (during);

-- BRIN — naturally-ordered, huge tables:
CREATE INDEX events_time_brin
    ON events USING brin (occurred_at) WITH (pages_per_range = 32);
```
Caption: Right index for each query shape

### Common Pitfalls

- Leading-wildcard LIKE defeats B-tree — `WHERE name LIKE '%foo'` cannot use a plain B-tree on name; use a trigram index (`pg_trgm` GIN/GiST) or denormalize a reverse-string column.
- Forgetting that JSONB needs GIN — `WHERE payload->>'type' = 'click'` will Seq Scan without a GIN index; either GIN (jsonb_path_ops) or expression B-tree on `(payload->>'type')`.
- Stacking too many indexes — every index adds write amplification on INSERT/UPDATE; remove unused indexes found via `pg_stat_user_indexes.idx_scan = 0`.
- Creating a partial index without the predicate in the query — `WHERE active = true` on the index must also appear in the query (or Postgres must prove equivalence) for the planner to use it.
- Using BRIN on unordered data — BRIN assumes physical row order correlates with the indexed value; on a randomly-ordered column it's worse than useless (false positives, no pruning).

### Real-World Applications

- Instagram uses B-tree indexes on (user_id, created_at) for feed pagination; partial indexes on `WHERE deleted_at IS NULL` for soft-delete queries.
- Discord uses GIN indexes on jsonb event payloads for ad-hoc analytics without a separate warehouse.
- Reddit uses BRIN indexes on time-series vote tables (billions of rows) where the physical order matches time order.
- Spotify uses expression indexes on `LOWER(email)` for case-insensitive login lookups across hundreds of millions of users.

### Interview Questions

- 1. When would you choose GIN over GiST? — GIN is faster for point lookups on jsonb/arrays/tsvector but slower to update; GiST is better for range/overlap and dynamic data.
- 2. What's a covering index and when does it help? — `CREATE INDEX ... INCLUDE (col)` lets queries needing only the indexed + INCLUDE columns do an index-only scan (no heap fetch).
- 3. Why does `WHERE col LIKE '%foo'` not use a plain B-tree index? — B-tree can't prune leading-wildcard patterns; use `pg_trgm` GIN/GiST or denormalize a reversed-string column.
- 4. When is BRIN the right choice? — On huge, append-only, naturally-ordered tables (e.g. time-series by timestamp) where physical row order matches the indexed value.
- 5. What is write amplification from indexes? — Every INSERT/UPDATE/DELETE must update every index on the table; 5 indexes on a hot table can 5× the write load.

### Mini Project

Build an Index Tuning Report: Given a schema with 5 tables and 10 sample queries, write a single `index_tuning.sql` that: (1) lists all current indexes with sizes and scan counts, (2) flags unused indexes (idx_scan = 0), (3) flags duplicate indexes, (4) suggests a partial index for a soft-delete query, (5) suggests an expression index for a case-insensitive lookup. Suggested approach:
  - Use `pg_stat_user_indexes` for scan counts and sizes
  - Use `pg_index` to find duplicates (same indkey on same relid)
  - Demonstrate the partial index with a CREATE INDEX ... WHERE active = true
  - Demonstrate the expression index with CREATE INDEX ON users (LOWER(email))
  - Run EXPLAIN ANALYZE before and after each suggestion to show the planner change

### Exercises

1. Create a 1M-row events table; query `WHERE event_type = 'click'` (no index, then B-tree) and compare EXPLAIN ANALYZE timings.
2. Create a jsonb payload column; query `WHERE payload->>'type' = 'click'` (Seq Scan, then GIN) and observe the index scan.
3. Create a partial index `WHERE active = true` on a users table with 95% inactive; verify the index is ~5% the size of a full index.
4. Create a covering index `INCLUDE (event_type)` and run a query that selects only event_type; verify EXPLAIN shows "Index Only Scan".
5. Use `pg_stat_user_indexes` to find indexes with idx_scan = 0; drop one and confirm nothing breaks.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which index type is Postgres's default and best for range queries and ORDER BY?
9. A) B-tree (*)
10. B) Hash
11. C) GIN
12. D) BRIN
13. Explanation: B-tree is the default; it handles =, <, >, BETWEEN, ORDER BY, and IS NULL efficiently. Hash is equality-only; GIN is for jsonb/arrays/full-text; BRIN is for huge ordered tables.
14. Q2: Which index would you use for a JSONB column queried as `payload->>'type' = 'click'`?
15. A) B-tree on payload
16. B) GIN with jsonb_path_ops (*)
17. C) Hash on payload
18. D) BRIN on payload
19. Explanation: GIN with jsonb_path_ops is the standard index for jsonb containment and key lookups; it's smaller and faster than the default GIN for jsonb.
20. Q3: Why does `WHERE name LIKE '%foo'` not use a plain B-tree index?
21. A) B-tree can't handle LIKE
22. B) LIKE requires a hash index
23. C) Leading wildcards defeat B-tree prefix pruning; use pg_trgm GIN/GiST (*)
24. D) B-tree is case-sensitive
25. Explanation: B-tree can use LIKE 'foo%' (prefix) but not '%foo' (suffix); install pg_trgm and create a GIN/GiST trigram index for suffix/contains queries.
26. Q4: What does a covering index with INCLUDE (col) enable?
27. A) Faster writes
28. B) Full-text search
29. C) Foreign key enforcement
30. D) Index-only scans when the query needs only indexed + INCLUDE columns (*)
31. Explanation: INCLUDE columns are stored in the index leaf but not in the B-tree ordering; queries needing only those columns skip the heap fetch (Index Only Scan).
32. Q5: What is write amplification from indexes?
33. A) Every INSERT/UPDATE/DELETE must update every index on the table (*)
34. B) Indexes double the data on disk
35. C) Indexes cause writes to be replicated
36. D) Indexes amplify SELECT speed
37. Explanation: Maintaining N indexes adds N write operations per row change; 5 indexes on a hot table can 5× write load. Drop unused indexes (idx_scan = 0).
38. Q6: When is BRIN the right choice over B-tree?
39. A) For OLTP lookups
40. B) For huge, naturally-ordered tables like time-series (*)
41. C) For JSONB columns
42. D) For full-text search
43. Explanation: BRIN stores only min/max per block range; it's tiny (KB not GB) and effective when physical row order correlates with the indexed value (e.g. append-only time-series).
44. Q7: What does a partial index `CREATE INDEX ... WHERE active = true` do?
45. A) Indexes only the first 1000 rows
46. B) Creates a partitioned index
47. C) Indexes only rows matching the predicate; smaller and faster if most rows match (*)
48. D) Makes the index read-only
49. Explanation: Partial indexes include only matching rows; if 95% of rows are inactive, the index is ~5% the size and faster to scan. The query must include the predicate (or provably equivalent).
50. Q8: Which is TRUE about an expression index on LOWER(email)?
51. A) It speeds up WHERE email = 'X'
52. B) It can't be UNIQUE
53. C) It's identical to a function-based CHECK
54. D) It speeds up WHERE LOWER(email) = 'x' (*)
55. Explanation: Expression indexes index the result of an immutable expression; queries that use the same expression can use the index. UNIQUE on LOWER(email) is allowed and is the right way to enforce case-insensitive uniqueness.
56. Q9: What does `idx_scan = 0` in pg_stat_user_indexes indicate?
57. A) The index has never been used since the last stats reset (*)
58. B) The index is broken
59. C) The index is duplicate
60. D) The index is missing
61. Explanation: idx_scan counts index scans since stats reset; 0 means unused and a candidate for removal (after confirming stats aren't recently reset).
62. Q10: Which is a benefit of GIN's jsonb_path_ops over the default GIN for jsonb?
63. A) Faster updates
64. B) Smaller index size and faster lookups, but only supports containment (@>) (*)
65. C) Supports full-text operators
66. D) Supports range queries
67. Explanation: jsonb_path_ops creates a smaller, faster index but only supports the @> (containment) operator; the default GIN supports more operators but is larger.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which index type is Postgres's default and best for range queries and ORDER BY?
  options:
    - B-tree
    - Hash
    - GIN
    - BRIN
  correctIndex: 0
  explanation: B-tree is the default; it handles =, <, >, BETWEEN, ORDER BY, and IS NULL efficiently. Hash is equality-only; GIN is for jsonb/arrays/full-text; BRIN is for huge ordered tables.
- id: q2
  question: Which index would you use for a JSONB column queried as `payload->>'type' = 'click'`?
  options:
    - B-tree on payload
    - GIN with jsonb_path_ops
    - Hash on payload
    - BRIN on payload
  correctIndex: 1
  explanation: GIN with jsonb_path_ops is the standard index for jsonb containment and key lookups; it's smaller and faster than the default GIN for jsonb.
- id: q3
  question: Why does `WHERE name LIKE '%foo'` not use a plain B-tree index?
  options:
    - B-tree can't handle LIKE
    - LIKE requires a hash index
    - Leading wildcards defeat B-tree prefix pruning; use pg_trgm GIN/GiST
    - B-tree is case-sensitive
  correctIndex: 2
  explanation: B-tree can use LIKE 'foo%' (prefix) but not '%foo' (suffix); install pg_trgm and create a GIN/GiST trigram index for suffix/contains queries.
- id: q4
  question: What does a covering index with INCLUDE (col) enable?
  options:
    - Faster writes
    - Full-text search
    - Foreign key enforcement
    - Index-only scans when the query needs only indexed + INCLUDE columns
  correctIndex: 3
  explanation: INCLUDE columns are stored in the index leaf but not in the B-tree ordering; queries needing only those columns skip the heap fetch (Index Only Scan).
- id: q5
  question: What is write amplification from indexes?
  options:
    - Every INSERT/UPDATE/DELETE must update every index on the table
    - Indexes double the data on disk
    - Indexes cause writes to be replicated
    - Indexes amplify SELECT speed
  correctIndex: 0
  explanation: Maintaining N indexes adds N write operations per row change; 5 indexes on a hot table can 5× write load. Drop unused indexes (idx_scan = 0).
- id: q6
  question: When is BRIN the right choice over B-tree?
  options:
    - For OLTP lookups
    - For huge, naturally-ordered tables like time-series
    - For JSONB columns
    - For full-text search
    - and effective when physical row order correlates with the indexed value (e.g. append-only time-series).
  correctIndex: 1
  explanation: BRIN stores only min/max per block range; it's tiny (KB not GB) and effective when physical row order correlates with the indexed value (e.g. append-only time-series).
- id: q7
  question: What does a partial index `CREATE INDEX ... WHERE active = true` do?
  options:
    - Indexes only the first 1000 rows
    - Creates a partitioned index
    - Indexes only rows matching the predicate; smaller and faster if most rows match
    - Makes the index read-only
  correctIndex: 2
  explanation: Partial indexes include only matching rows; if 95% of rows are inactive, the index is ~5% the size and faster to scan. The query must include the predicate (or provably equivalent).
- id: q8
  question: Which is TRUE about an expression index on LOWER(email)?
  options:
    - It speeds up WHERE email = 'X'
    - It can't be UNIQUE
    - It's identical to a function-based CHECK
    - It speeds up WHERE LOWER(email) = 'x'
  correctIndex: 3
  explanation: Expression indexes index the result of an immutable expression; queries that use the same expression can use the index. UNIQUE on LOWER(email) is allowed and is the right way to enforce case-insensitive uniqueness.
- id: q9
  question: What does `idx_scan = 0` in pg_stat_user_indexes indicate?
  options:
    - The index has never been used since the last stats reset
    - The index is broken
    - The index is duplicate
    - The index is missing
  correctIndex: 0
  explanation: idx_scan counts index scans since stats reset; 0 means unused and a candidate for removal (after confirming stats aren't recently reset).
- id: q10
  question: Which is a benefit of GIN's jsonb_path_ops over the default GIN for jsonb?
  options:
    - Faster updates
    - Smaller index size and faster lookups, but only supports containment (@>)
    - Supports full-text operators
    - Supports range queries
  correctIndex: 1
  explanation: jsonb_path_ops creates a smaller, faster index but only supports the @> (containment) operator; the default GIN supports more operators but is larger.
```

