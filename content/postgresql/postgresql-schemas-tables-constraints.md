---
slug: postgresql-schemas-tables-constraints
id: postgresql-04
track: postgresql
order: 4
title: Schemas, Tables, and Constraints
description: Design normalized schemas, choose appropriate primary and foreign keys, and enforce data integrity with CHECK, UNIQUE, NOT NULL, EXCLUDE, and deferrable constraints.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=3600s
whyItMatters: Design normalized schemas, choose appropriate primary and foreign keys, and enforce data integrity with CHECK, UNIQUE, NOT NULL, EXCLUDE, and deferrable constraints.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Schemas, Tables, and Constraints

## Schemas, Tables, and Constraints

### Why It Matters

Design normalized schemas, choose appropriate primary and foreign keys, and enforce data integrity with CHECK, UNIQUE, NOT NULL, EXCLUDE, and deferrable constraints.

Design normalized schemas, choose appropriate primary and foreign keys, and enforce data integrity with CHECK, UNIQUE, NOT NULL, EXCLUDE, and deferrable constraints.

### Prerequisites

- Stage 1: Getting Started with PostgreSQL
- Stage 3: Data Types — Numeric, Text, Temporal, Boolean, UUID

### Topics

- Schemas: when to split into multiple schemas (multi-tenant, versioning, isolation)
- CREATE TABLE syntax, INCLUDING ALL, LIKE, partitioned tables (preview)
- Primary keys: bigint IDENTITY vs UUID vs composite (natural keys)
- Foreign keys with ON DELETE / ON UPDATE actions: NO ACTION, RESTRICT, CASCADE, SET NULL, SET DEFAULT
- CHECK constraints with predicates, UNIQUE constraints (including NULLS NOT DISTINCT in PG15+)
- EXCLUDE USING GiST for range overlap prevention (no double-booking)
- Deferrable constraints and SET CONSTRAINTS DEFERRED for multi-step inserts
- Generated columns (STORED) and identity columns (ALWAYS vs BY DEFAULT)

### Key Concepts

- A foreign key without an index on the referencing column is a major footgun — every DELETE on the parent does a Seq Scan on the child; Postgres does NOT auto-index FKs.
- UNIQUE allows multiple NULLs by default (NULL ≠ NULL in SQL); PG15 added `UNIQUE NULLS NOT DISTINCT` to treat NULLs as equal.
- EXCLUDE USING GiST with `&&` (overlaps) on a tstzrange is the right way to prevent double-booking a resource for a time window.
- Deferrable constraints let you insert/update in any order within a transaction; the check happens at COMMIT, not statement — useful for cyclic references.
- A "natural key" (e.g. ISBN) is sometimes better than a surrogate ID, but only if it's truly immutable and unique — most of the time, a surrogate bigint IDENTITY is safer.
- 3NF is the default; denormalize deliberately (and only in materialized views) when read performance demands it.

```sql
CREATE TABLE author (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE book (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id   bigint NOT NULL REFERENCES author(id) ON DELETE RESTRICT,
    title       text   NOT NULL,
    isbn        text   UNIQUE,
    published_at date  NOT NULL,
    CHECK (published_at <= current_date)        -- no future pub dates
);

-- Index the FK to avoid Seq Scans on DELETE from author:
CREATE INDEX book_author_id_idx ON book(author_id);
```
Caption: 3NF schema with FKs and sensible ON DELETE

### Common Pitfalls

- Forgetting to index foreign keys — Postgres does NOT auto-index FKs; an unindexed FK causes Seq Scans on the child for every parent DELETE/UPDATE, and locks the child table.
- Using `ON DELETE CASCADE` recklessly — a single DELETE of a parent row can cascade to thousands of child rows (or worse, grandchildren), causing surprising bloat and locks.
- Assuming `UNIQUE` rejects multiple NULLs — by default it does NOT (NULL ≠ NULL); use `UNIQUE NULLS NOT DISTINCT` (PG15+) if NULLs should be treated as equal.
- Forgetting `CHECK` constraints are NOT NULL only if explicitly written — `CHECK (status = 'active')` allows NULL because `NULL = 'active'` is NULL (unknown), not false.
- Using deferrable constraints when not needed — they add overhead at COMMIT and mask ordering bugs; only use them for genuine cyclic references (e.g. self-referential manager_id).

### Real-World Applications

- Airbnb uses EXCLUDE constraints to prevent double-booking of listings for overlapping date ranges.
- Stripe's ledger uses deferrable FKs to insert linked transactions in the same statement without ordering headaches.
- Reddit uses composite natural keys (subreddit_id, post_id) for vote tables to avoid an extra surrogate ID and enable partition pruning.
- Twitch uses ON DELETE RESTRICT on stream-session → user FKs to prevent accidental cascade-deletes of historical analytics.

### Interview Questions

- 1. Why is an unindexed foreign key a footgun? — Postgres does not auto-index FKs; every parent DELETE/UPDATE forces a Seq Scan on the child and takes a stronger lock.
- 2. What does `ON DELETE RESTRICT` vs `ON DELETE NO ACTION` do? — Both reject the delete; NO ACTION (default) is checked at COMMIT and can be deferred, RESTRICT is checked immediately.
- 3. How do you prevent double-booking a resource in time? — Use an EXCLUDE USING GiST constraint with `tstzrange` and the `&&` (overlap) operator.
- 4. Does `UNIQUE` allow multiple NULLs? — Yes, by default (NULL ≠ NULL); use `UNIQUE NULLS NOT DISTINCT` (PG15+) to forbid duplicates when NULLs should be treated as equal.
- 5. What's the difference between `GENERATED ALWAYS AS ... STORED` and a default? — A default is computed once at INSERT; a STORED generated column is recomputed on every UPDATE of the source columns and cannot be written directly.

### Mini Project

Build a Hotel Booking Schema: `hotel`, `room`, `reservation` tables where reservations can never overlap for the same room. Add CHECK constraints (valid dates, non-negative price), deferrable FKs (so you can insert a reservation referencing a future guest), and an index on every FK. Suggested approach:
  - Use bigint IDENTITY PKs throughout
  - Use `tstzrange` for reservation.during and an EXCLUDE USING GiST on (room_id, during)
  - Add `CHECK (during.lower() < during.upper())` to reject zero-duration or backwards ranges
  - Add `CHECK (price >= 0)` and `CHECK (price <= 100000)` for sanity
  - Try to insert two overlapping reservations for the same room — the second should raise

### Exercises

1. Create `author` and `book` tables with a FK; forget to index book.author_id; insert 10,000 books; EXPLAIN ANALYZE a DELETE on author to see the Seq Scan.
2. Add the index on book.author_id; re-run the same DELETE; observe the Index Scan in EXPLAIN.
3. Create a room_booking table with an EXCLUDE constraint and demonstrate two overlapping inserts fail.
4. Create a UNIQUE NULLS NOT DISTINCT column and show that two NULLs are rejected.
5. Create a self-referential `employee(manager_id)` with a deferrable FK; insert a tree in one transaction out of order; commit succeeds.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Does Postgres automatically create an index on foreign key columns?
9. A) Always
10. B) Only for UNIQUE FKs
11. C) Only on the parent side
12. D) No — you must CREATE INDEX manually (*)
13. Explanation: Postgres does NOT auto-index FKs on the referencing (child) table; an unindexed FK causes Seq Scans and stronger locks on parent DELETE/UPDATE.
14. Q2: Which constraint prevents overlapping time ranges in the same room?
15. A) EXCLUDE USING gist (room_id WITH =, during WITH &&) (*)
16. B) UNIQUE (room_id, during)
17. C) CHECK (during IS NOT NULL)
18. D) FOREIGN KEY (room_id)
19. Explanation: EXCLUDE with the && (overlaps) operator on a tstzrange is the standard Postgres way to prevent range overlaps; UNIQUE cannot do this.
20. Q3: What's the default behavior of UNIQUE on NULL values?
21. A) Multiple NULLs are rejected
22. B) Multiple NULLs are allowed (NULL != NULL) (*)
23. C) Only one NULL per table
24. D) NULLs are ignored entirely
25. Explanation: SQL NULL semantics treat NULL != NULL as unknown, so multiple NULLs are allowed; PG15 added UNIQUE NULLS NOT DISTINCT to forbid this.
26. Q4: What does ON DELETE RESTRICT do?
27. A) Deletes child rows automatically
28. B) Sets child FKs to NULL
29. C) Rejects the parent DELETE if any children exist, immediately (*)
30. D) Defers the check to COMMIT
31. Explanation: RESTRICT raises immediately if children exist; NO ACTION is similar but deferrable. CASCADE deletes children, SET NULL nullifies the FK.
32. Q5: When should you use a deferrable foreign key?
33. A) Always, for safety
34. B) Never — it's a performance footgun
35. C) Only on partitioned tables
36. D) For genuine cyclic references where insert order is hard to control within a transaction (*)
37. Explanation: Deferrable constraints check at COMMIT, not statement; useful for cyclic refs (e.g. self-referential manager_id) but add overhead and mask ordering bugs if overused.
38. Q6: Which is TRUE about CHECK (status = 'active')?
39. A) It allows NULL values (NULL = 'active' is unknown, not false) (*)
40. B) It rejects NULL values
41. C) It's equivalent to NOT NULL
42. D) It only fires on UPDATE
43. Explanation: CHECK passes when the predicate is true OR null; NULL = 'active' evaluates to NULL, so NULLs satisfy the constraint. Add NOT NULL explicitly.
44. Q7: What does GENERATED ALWAYS AS (qty * unit_price) STORED do?
45. A) Computes once at INSERT
46. B) Recomputes on every UPDATE of qty or unit_price; cannot be written directly (*)
47. C) Stores nothing — it's a virtual column
48. D) Computes only on SELECT
49. Explanation: STORED generated columns are persisted and recomputed automatically when source columns change; attempts to INSERT or UPDATE them raise an error.
50. Q8: Which ON DELETE action is safest for most FKs to avoid surprising data loss?
51. A) CASCADE
52. B) SET NULL
53. C) RESTRICT (or NO ACTION) — prevents accidental cascading deletes (*)
54. D) SET DEFAULT
55. Explanation: RESTRICT/NO ACTION forces the app to delete children explicitly; CASCADE can wipe thousands of rows (or grandchildren) on a single parent DELETE.
56. Q9: Which is the correct way to make a composite natural key on (subreddit_id, post_id)?
57. A) UNIQUE (subreddit_id); UNIQUE (post_id)
58. B) Two separate FKs
59. C) A CHECK constraint
60. D) PRIMARY KEY (subreddit_id, post_id) (*)
61. Explanation: PRIMARY KEY (a, b) creates a composite key with a single B-tree index on (a, b); two separate UNIQUEs would not enforce the combination.
62. Q10: What does the INCLUDING ALL clause do in CREATE TABLE new (LIKE old INCLUDING ALL)?
63. A) Copies defaults, constraints, indexes, comments, storage — everything copyable (*)
64. B) Copies all data
65. C) Copies only column names
66. D) Copies only indexes
67. Explanation: INCLUDING ALL includes defaults, constraints, indexes, storage params, comments; useful for creating archive tables or temp copies with full structure.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Does Postgres automatically create an index on foreign key columns?
  options:
    - Always
    - Only for UNIQUE FKs
    - Only on the parent side
    - No — you must CREATE INDEX manually
  correctIndex: 3
  explanation: Postgres does NOT auto-index FKs on the referencing (child) table; an unindexed FK causes Seq Scans and stronger locks on parent DELETE/UPDATE.
- id: q2
  question: Which constraint prevents overlapping time ranges in the same room?
  options:
    - EXCLUDE USING gist (room_id WITH =, during WITH &&)
    - UNIQUE (room_id, during)
    - CHECK (during IS NOT NULL)
    - FOREIGN KEY (room_id)
  correctIndex: 0
  explanation: EXCLUDE with the && (overlaps) operator on a tstzrange is the standard Postgres way to prevent range overlaps; UNIQUE cannot do this.
- id: q3
  question: What's the default behavior of UNIQUE on NULL values?
  options:
    - Multiple NULLs are rejected
    - Multiple NULLs are allowed (NULL != NULL)
    - Only one NULL per table
    - NULLs are ignored entirely
  correctIndex: 1
  explanation: SQL NULL semantics treat NULL != NULL as unknown, so multiple NULLs are allowed; PG15 added UNIQUE NULLS NOT DISTINCT to forbid this.
- id: q4
  question: What does ON DELETE RESTRICT do?
  options:
    - Deletes child rows automatically
    - Sets child FKs to NULL
    - Rejects the parent DELETE if any children exist, immediately
    - Defers the check to COMMIT
  correctIndex: 2
  explanation: RESTRICT raises immediately if children exist; NO ACTION is similar but deferrable. CASCADE deletes children, SET NULL nullifies the FK.
- id: q5
  question: When should you use a deferrable foreign key?
  options:
    - Always, for safety
    - Never — it's a performance footgun
    - Only on partitioned tables
    - For genuine cyclic references where insert order is hard to control within a transaction
  correctIndex: 3
  explanation: Deferrable constraints check at COMMIT, not statement; useful for cyclic refs (e.g. self-referential manager_id) but add overhead and mask ordering bugs if overused.
- id: q6
  question: Which is TRUE about CHECK (status = 'active')?
  options:
    - It allows NULL values (NULL = 'active' is unknown, not false)
    - It rejects NULL values
    - It's equivalent to NOT NULL
    - It only fires on UPDATE
  correctIndex: 0
  explanation: CHECK passes when the predicate is true OR null; NULL = 'active' evaluates to NULL, so NULLs satisfy the constraint. Add NOT NULL explicitly.
- id: q7
  question: What does GENERATED ALWAYS AS (qty * unit_price) STORED do?
  options:
    - Computes once at INSERT
    - Recomputes on every UPDATE of qty or unit_price; cannot be written directly
    - Stores nothing — it's a virtual column
    - Computes only on SELECT
  correctIndex: 1
  explanation: STORED generated columns are persisted and recomputed automatically when source columns change; attempts to INSERT or UPDATE them raise an error.
- id: q8
  question: Which ON DELETE action is safest for most FKs to avoid surprising data loss?
  options:
    - CASCADE
    - SET NULL
    - RESTRICT (or NO ACTION) — prevents accidental cascading deletes
    - SET DEFAULT
  correctIndex: 2
  explanation: RESTRICT/NO ACTION forces the app to delete children explicitly; CASCADE can wipe thousands of rows (or grandchildren) on a single parent DELETE.
- id: q9
  question: Which is the correct way to make a composite natural key on (subreddit_id, post_id)?
  options:
    - UNIQUE (subreddit_id); UNIQUE (post_id)
    - Two separate FKs
    - A CHECK constraint
    - PRIMARY KEY (subreddit_id, post_id)
  correctIndex: 3
  explanation: PRIMARY KEY (a, b) creates a composite key with a single B-tree index on (a, b); two separate UNIQUEs would not enforce the combination.
- id: q10
  question: What does the INCLUDING ALL clause do in CREATE TABLE new (LIKE old INCLUDING ALL)?
  options:
    - "?"
    - Copies defaults, constraints, indexes, comments, storage — everything copyable
    - Copies all data
    - Copies only column names
    - Copies only indexes
  correctIndex: 1
  explanation: INCLUDING ALL includes defaults, constraints, indexes, storage params, comments; useful for creating archive tables or temp copies with full structure.
```

