---
slug: sql-indexes-query-performance
id: sql-09
track: sql
order: 9
title: Indexes and Query Performance
description: Speed up queries with B-tree, GIN, GiST, BRIN, and partial/expression indexes — and use EXPLAIN to understand why a query is slow and whether the index is being used.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=5500s
whyItMatters: Speed up queries with B-tree, GIN, GiST, BRIN, and partial/expression indexes — and use EXPLAIN to understand why a query is slow and whether the index is being used.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Indexes and Query Performance

## Indexes and Query Performance

### Why It Matters

Speed up queries with B-tree, GIN, GiST, BRIN, and partial/expression indexes — and use EXPLAIN to understand why a query is slow and whether the index is being used.

Speed up queries with B-tree, GIN, GiST, BRIN, and partial/expression indexes — and use EXPLAIN to understand why a query is slow and whether the index is being used.

### Prerequisites

- Stage 8: Schema Design, Keys, and Constraints.
- A table with at least 100k rows for benchmarking.

### Topics

- B-tree (default), Hash, GIN, GiST, BRIN, SP-GiST index types
- CREATE INDEX, CREATE INDEX CONCURRENTLY
- Partial indexes (WHERE clause)
- Expression indexes (lower(email))
- Covering indexes (INCLUDE)
- Multi-column indexes and column order
- EXPLAIN, EXPLAIN (ANALYZE, BUFFERS)
- Index-only scans and visibility map

### Key Concepts

- B-tree is the default; it handles =, <>, <, <=, >, >=, BETWEEN, IN, IS NULL, and prefix LIKE.
- GIN is for composite types (jsonb, arrays, tsvector); GiST is for range/geometric; BRIN is for naturally-ordered huge tables (logs).
- A multi-column index is most useful when the leading column is filtered; (a, b) helps `WHERE a=?` and `WHERE a=? AND b=?` but not `WHERE b=?`.
- Partial indexes (WHERE active = true) are smaller and faster for the common case.
- Expression indexes (lower(email)) enable case-insensitive lookups without storing a duplicate column.
- Index-only scans require the visibility map to be up to date — vacuum regularly.

```sql
CREATE INDEX idx_payment_customer_date ON payment(customer_id, payment_date);

EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM payment
WHERE customer_id = 5
  AND payment_date >= '2020-01-01';
-- Look for "Index Scan" or "Bitmap Index Scan" — not "Seq Scan"
```
Caption: B-tree basics and EXPLAIN

### Common Pitfalls

- Function in WHERE defeats the index — `WHERE lower(email) = 'x'` needs an expression index on `lower(email)`; the plain index on email isn't used.
- Wrong multi-column order — `(a, b)` doesn't help `WHERE b = ?` alone; put the most-filtered or equality column first.
- Over-indexing writes — every index slows INSERT/UPDATE/DELETE; drop unused indexes (pg_stat_user_indexes).
- CREATE INDEX blocking writes — on production use CREATE INDEX CONCURRENTLY to avoid the ACCESS EXCLUSIVE lock.
- Stale visibility map — index-only scans need all-visible pages; run VACUUM (autovacuum normally handles it).

### Real-World Applications

- Stripe uses partial indexes on `charges WHERE disputed_at IS NULL` for hot active-charge lookups.
- LinkedIn uses GiST indexes on member location ranges for geo-targeted job ads.
- Airbnb uses GIN indexes on listings.amenities (array) for filter-by-amenity search.
- Uber uses BRIN indexes on trip timestamps for time-bucketed analytics on multi-billion-row tables.

### Interview Questions

- 1. When does a B-tree index help? — Equality, range, IN, IS NULL, and prefix LIKE; not full-wildcard LIKE ('%foo').
- 2. What's the difference between GIN and GiST? — GIN is faster to read, slower to write, good for jsonb/arrays/tsvector; GiST is balanced, good for ranges and geometric.
- 3. Why doesn't `WHERE lower(email) = 'x'` use an index on email? — The index stores the original value; you need an expression index on `lower(email)`.
- 4. What does CREATE INDEX CONCURRENTLY do? — Builds the index without blocking writes; slower and can fail (must DROP INDEX CONCURRENTLY to retry).
- 5. When is BRIN a good choice? — Huge, naturally-ordered tables (logs, time-series) where adjacent blocks share similar values; tiny index size.

### Mini Project

Index-Tune a Slow Query: Take a query on a 1M-row `payment` table that takes 5+ seconds, EXPLAIN it, identify the seq scan, add the right index (B-tree, partial, or expression), and re-measure. Suggested approach:
  - Run `EXPLAIN (ANALYZE, BUFFERS)` and capture the plan
  - Identify the seq scan and the filter columns
  - Add a partial index for the common predicate (e.g. `WHERE active = true`)
  - Re-run EXPLAIN ANALYZE; target >10x speedup
  - Document before/after timing and the chosen index in a README

### Exercises

1. Create a B-tree on (customer_id, payment_date); verify a query uses "Index Scan".
2. Create a partial index `WHERE active = true`; confirm it's smaller via `\di+`.
3. Add an expression index on lower(email); verify a CI lookup uses it.
4. Use `pg_stat_user_indexes` to find an unused index and DROP it.
5. Add INCLUDE (amount) to an index; verify an "Index Only Scan".
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which index type does Postgres use by default?
9. A) B-tree (*)
10. B) Hash
11. C) GIN
12. D) BRIN
13. Explanation: B-tree is the default and handles equality, range, IN, IS NULL, and prefix LIKE; Hash only does equality.
14. Q2: Which is the right index for case-insensitive email lookup?
15. A) A plain B-tree on email
16. B) An expression index on lower(email) (*)
17. C) A GIN index on email
18. D) A BRIN index on email
19. Explanation: WHERE lower(email) = 'x' can only use an index on the expression lower(email); the plain index stores the original value.
20. Q3: Multi-column index (a, b) helps which query?
21. A) WHERE b = ?
22. B) WHERE b = ? AND a = ?
23. C) WHERE a = ? AND b = ? (*)
24. D) WHERE a > ? OR b = ?
25. Explanation: Multi-column B-tree is most useful from the left; (a,b) helps WHERE a=? (and WHERE a=? AND b=?) but not WHERE b=? alone.
26. Q4: Which index type is best for jsonb containment (@>) queries?
27. A) B-tree
28. B) Hash
29. C) BRIN
30. D) GIN (*)
31. Explanation: GIN supports jsonb operators like @>, ?, ?|; the default B-tree can't index composite types meaningfully.
32. Q5: What does CREATE INDEX CONCURRENTLY avoid?
33. A) Blocking writes to the table during build (*)
34. B) Writing to a new file
35. C) Using the planner
36. D) Updating statistics
37. Explanation: CONCURRENTLY builds without an ACCESS EXCLUSIVE lock; slower and may fail, requiring DROP INDEX CONCURRENTLY to retry.
38. Q6: When is BRIN a good choice?
39. A) Small lookup tables
40. B) Huge, naturally-ordered tables (logs, time-series) (*)
41. C) JSONB columns
42. D) Foreign keys
43. Explanation: BRIN stores per-block range summaries, giving tiny indexes for tables where adjacent blocks have similar values.
44. Q7: What does INCLUDE (amount) do in CREATE INDEX?
45. A) Adds amount to the index key
46. B) Forces an index-only scan
47. C) Stores amount in the index leaf for Index-Only Scans (*)
48. D) Drops amount from the table
49. Explanation: INCLUDE adds the column as "payload" (not part of the key), enabling Index-Only Scans when the query projects only indexed columns.
50. Q8: Which query defeats a B-tree index on email?
51. A) WHERE email = 'x'
52. B) WHERE email LIKE 'ada%'
53. C) WHERE email IS NULL
54. D) WHERE email LIKE '%example.com' (*)
55. Explanation: Leading-wildcard LIKE ('%foo') can't use a B-tree prefix; use a trigram index (pg_trgm) or full-text search.
56. Q9: Where can you find unused indexes?
57. A) pg_stat_user_indexes (idx_scan = 0) (*)
58. B) information_schema.columns
59. C) pg_indexes
60. D) \d tablename
61. Explanation: pg_stat_user_indexes tracks per-index usage; idx_scan = 0 over a long window suggests the index is unused.
62. Q10: Why does an Index-Only Scan sometimes still hit the heap?
63. A) The index is too big
64. B) The visibility map isn't all-visible for the pages (*)
65. C) Index-only scans always hit the heap
66. D) The query is too simple
67. Explanation: Index-Only Scans need all-visible pages (so the DB knows the row is visible to all transactions); VACUUM maintains this.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which index type does Postgres use by default?
  options:
    - B-tree
    - Hash
    - GIN
    - BRIN
  correctIndex: 0
  explanation: B-tree is the default and handles equality, range, IN, IS NULL, and prefix LIKE; Hash only does equality.
- id: q2
  question: Which is the right index for case-insensitive email lookup?
  options:
    - A plain B-tree on email
    - An expression index on lower(email)
    - A GIN index on email
    - A BRIN index on email
  correctIndex: 1
  explanation: WHERE lower(email) = 'x' can only use an index on the expression lower(email); the plain index stores the original value.
- id: q3
  question: Multi-column index (a, b) helps which query?
  options:
    - WHERE b = ?
    - WHERE b = ? AND a = ?
    - WHERE a = ? AND b = ?
    - WHERE a > ? OR b = ?
  correctIndex: 2
  explanation: Multi-column B-tree is most useful from the left; (a,b) helps WHERE a=? (and WHERE a=? AND b=?) but not WHERE b=? alone.
- id: q4
  question: Which index type is best for jsonb containment (@>) queries?
  options:
    - B-tree
    - Hash
    - BRIN
    - GIN
  correctIndex: 3
  explanation: GIN supports jsonb operators like @>, ?, ?|; the default B-tree can't index composite types meaningfully.
- id: q5
  question: What does CREATE INDEX CONCURRENTLY avoid?
  options:
    - Blocking writes to the table during build
    - Writing to a new file
    - Using the planner
    - Updating statistics
  correctIndex: 0
  explanation: CONCURRENTLY builds without an ACCESS EXCLUSIVE lock; slower and may fail, requiring DROP INDEX CONCURRENTLY to retry.
- id: q6
  question: When is BRIN a good choice?
  options:
    - Small lookup tables
    - Huge, naturally-ordered tables (logs, time-series)
    - JSONB columns
    - Foreign keys
  correctIndex: 1
  explanation: BRIN stores per-block range summaries, giving tiny indexes for tables where adjacent blocks have similar values.
- id: q7
  question: What does INCLUDE (amount) do in CREATE INDEX?
  options:
    - Adds amount to the index key
    - Forces an index-only scan
    - Stores amount in the index leaf for Index-Only Scans
    - Drops amount from the table
  correctIndex: 2
  explanation: INCLUDE adds the column as "payload" (not part of the key), enabling Index-Only Scans when the query projects only indexed columns.
- id: q8
  question: Which query defeats a B-tree index on email?
  options:
    - WHERE email = 'x'
    - WHERE email LIKE 'ada%'
    - WHERE email IS NULL
    - WHERE email LIKE '%example.com'
  correctIndex: 3
  explanation: Leading-wildcard LIKE ('%foo') can't use a B-tree prefix; use a trigram index (pg_trgm) or full-text search.
- id: q9
  question: Where can you find unused indexes?
  options:
    - pg_stat_user_indexes (idx_scan = 0)
    - information_schema.columns
    - pg_indexes
    - \d tablename
  correctIndex: 0
  explanation: pg_stat_user_indexes tracks per-index usage; idx_scan = 0 over a long window suggests the index is unused.
- id: q10
  question: Why does an Index-Only Scan sometimes still hit the heap?
  options:
    - The index is too big
    - The visibility map isn't all-visible for the pages
    - Index-only scans always hit the heap
    - The query is too simple
  correctIndex: 1
  explanation: Index-Only Scans need all-visible pages (so the DB knows the row is visible to all transactions); VACUUM maintains this.
```

