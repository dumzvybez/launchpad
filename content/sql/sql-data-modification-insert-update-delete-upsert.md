---
slug: sql-data-modification-insert-update-delete-upsert
id: sql-07
track: sql
order: 7
title: Data Modification — INSERT, UPDATE, DELETE, UPSERT
description: Modify data with INSERT, UPDATE, DELETE, and UPSERT (ON CONFLICT), and learn the safe patterns — RETURNING, transactions, and the WHERE-clause discipline that prevents catastrophic bulk updates.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=4100s
whyItMatters: Modify data with INSERT, UPDATE, DELETE, and UPSERT (ON CONFLICT), and learn the safe patterns — RETURNING, transactions, and the WHERE-clause discipline that prevents catastrophic bulk updates.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Data Modification — INSERT, UPDATE, DELETE, UPSERT

## Data Modification — INSERT, UPDATE, DELETE, UPSERT

### Why It Matters

Modify data with INSERT, UPDATE, DELETE, and UPSERT (ON CONFLICT), and learn the safe patterns — RETURNING, transactions, and the WHERE-clause discipline that prevents catastrophic bulk updates.

Modify data with INSERT, UPDATE, DELETE, and UPSERT (ON CONFLICT), and learn the safe patterns — RETURNING, transactions, and the WHERE-clause discipline that prevents catastrophic bulk updates.

### Prerequisites

- Stage 6: Window Functions.
- A sandbox database you can mutate.

### Topics

- INSERT ... VALUES, multi-row INSERT, INSERT ... DEFAULT VALUES
- INSERT ... SELECT (ETL pattern)
- UPDATE ... SET ... WHERE
- DELETE ... WHERE, TRUNCATE
- UPSERT with ON CONFLICT (DO UPDATE / DO NOTHING)
- RETURNING — get inserted/updated rows back
- UPDATE ... FROM (joining to another table)
- MERGE (SQL:2003 standard, Postgres 15+)

### Key Concepts

- Always scope UPDATE and DELETE with a WHERE; run SELECT with the same WHERE first to preview affected rows.
- ON CONFLICT (cols) DO UPDATE requires a unique constraint or index on cols; otherwise it errors.
- RETURNING * gives you back the row(s) — perfect for getting auto-generated IDs without a second round-trip.
- UPDATE ... FROM lets you join to another table for set values; be careful of Cartesian fan-out.
- MERGE is the SQL-standard upsert/delete/insert-in-one; available since Postgres 15.
- TRUNCATE is faster than DELETE but is non-transactional with respect to other sessions in some cases and resets sequences unless RESTART IDENTITY is set.

```sql
INSERT INTO customer (store_id, first_name, last_name, email, address_id, activebool)
VALUES
    (1, 'Ada',  'Lovelace', 'ada@example.com',   5, true),
    (1, 'Alan', 'Turing',   'alan@example.com',  6, true),
    (2, 'Grace','Hopper',   'grace@example.com', 7, true)
RETURNING customer_id, email, create_date;
```
Caption: Multi-row insert with RETURNING

### Common Pitfalls

- UPDATE/DELETE without WHERE — affects every row; always preview with SELECT first and wrap in a transaction.
- Missing ON CONFLICT target — `ON CONFLICT DO UPDATE` requires a unique index/constraint; without one Postgres raises "there is no unique or exclusion constraint matching the ON CONFLICT specification".
- TRUNCATE surprise — TRUNCATE is fast but can't be rolled back in some setups (e.g. with foreign keys CASCADE), and resets sequences unless RESTART IDENTITY.
- UPDATE FROM fan-out — joining a row that has multiple matches multiplies updates; ensure the FROM side is unique per join key.
- Forgetting RETURNING — without it you need a second SELECT to fetch the generated id, doubling round-trips.

### Real-World Applications

- Stripe uses INSERT ... ON CONFLICT DO UPDATE for idempotent webhook handling (re-deliveries are common).
- Netflix's watch-history pipeline uses INSERT ... SELECT to bulk-load from Kafka into Postgres nightly.
- Airbnb uses UPDATE ... FROM to denormalize listing ratings into the listings table from a nightly aggregation.
- Uber's trip ingestion uses MERGE to upsert active trips and soft-delete completed ones in one statement.

### Interview Questions

- 1. What does RETURNING do? — Returns the affected rows (and computed values like generated IDs) without a second SELECT.
- 2. What's required for ON CONFLICT DO UPDATE? — A unique constraint or unique index on the conflict target columns.
- 3. Difference between TRUNCATE and DELETE? — TRUNCATE drops and recreates the storage (fast, non-transactional with FK cascades); DELETE scans and removes row by row (transactional).
- 4. Why prefer MERGE over INSERT ... ON CONFLICT? — MERGE can also DELETE on match; ON CONFLICT can only INSERT or UPDATE.
- 5. Why preview UPDATE with SELECT first? — Confirms the WHERE matches the intended rows; the same predicate must be used in UPDATE.

### Mini Project

Build a Daily Sync Job: A SQL script that upserts ~10,000 customer rows from a staging table into the live customer table, logs the count of inserts vs updates, and archives soft-deleted rows. Suggested approach:
  - Use INSERT ... ON CONFLICT (email) DO UPDATE SET ...
  - Use RETURNING (xmax = 0) to flag inserts vs updates
  - Wrap in a transaction with BEGIN/COMMIT
  - Use a CTE to count results: WITH upserted AS (INSERT ... RETURNING ...) SELECT count(*) FILTER (WHERE inserted), count(*) FILTER (WHERE NOT inserted) FROM upserted
  - Log to an `etl_log` table with timestamp, rows_inserted, rows_updated

### Exercises

1. Insert 3 rows into `customer` with RETURNING; capture the generated IDs.
2. Write an UPSERT that bumps an `updated_at` column on conflict; verify with two runs.
3. Update all `payment` rows older than 2020 to `void=true` — but first preview with SELECT.
4. Use UPDATE ... FROM to copy a category name into a denormalized column on `film`.
5. Write a MERGE that inserts new rows, updates existing, and deletes soft-deleted (Postgres 15+).
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does INSERT ... ON CONFLICT DO NOTHING require?
9. A) A primary key on every column
10. B) A trigger
11. C) A unique constraint or unique index on the conflict target (*)
12. D) A foreign key
13. Explanation: ON CONFLICT needs a unique index or constraint on the target columns to detect the conflict; otherwise Postgres raises an error.
14. Q2: What does RETURNING give you?
15. A) The row count affected
16. B) The query plan
17. C) A success/failure boolean
18. D) The actual rows affected, including generated columns (*)
19. Explanation: RETURNING projects the affected rows back, letting you fetch generated IDs and computed columns in one round-trip.
20. Q3: Which is faster for emptying a large table?
21. A) TRUNCATE TABLE t (*)
22. B) DELETE FROM t
23. C) DROP TABLE t
24. D) TRUNCATE is identical to DELETE
25. Explanation: TRUNCATE drops and recreates storage, bypassing row-by-row deletion; it's much faster but is non-transactional for FK cascades and resets sequences unless RESTART IDENTITY.
26. Q4: Why preview an UPDATE with SELECT first?
27. A) SELECT is faster than UPDATE
28. B) To confirm the WHERE matches exactly the intended rows (*)
29. C) SELECT acquires locks that speed up UPDATE
30. D) It's required by the SQL standard
31. Explanation: Running SELECT with the same WHERE lets you sanity-check the affected set before mutating.
32. Q5: What does `xmax = 0` indicate in RETURNING?
33. A) The row was deleted
34. B) The row has a unique violation
35. C) The row was inserted (not updated) (*)
36. D) The row is locked
37. Explanation: xmax is the row's transaction delete/update xid; for a fresh INSERT it's 0, so `(xmax = 0)` is TRUE only for inserted rows.
38. Q6: Which statement can also DELETE on match?
39. A) INSERT ... ON CONFLICT
40. B) UPDATE ... FROM
41. C) UPSERT
42. D) MERGE (*)
43. Explanation: MERGE supports WHEN MATCHED THEN DELETE/UPDATE and WHEN NOT MATCHED THEN INSERT, all in one statement.
44. Q7: What is a risk of `UPDATE ... FROM`?
45. A) The FROM side may fan out and multiply updates if join keys aren't unique (*)
46. B) It's slower than MERGE
47. C) It can't be wrapped in a transaction
48. D) It bypasses triggers
49. Explanation: If the FROM table has multiple matching rows per target row, the update happens multiple times nondeterministically; ensure uniqueness.
50. Q8: TRUNCATE ... RESTART IDENTITY does what?
51. A) Drops the table
52. B) Resets owned sequences to their initial values (*)
53. C) Restores from backup
54. D) Rebuilds indexes
55. Explanation: RESTART IDENTITY resets sequences owned by the table's columns; without it, sequences continue from their current value.
56. Q9: INSERT ... SELECT is commonly used for?
57. A) Idempotent webhook handling
58. B) Soft-deletes
59. C) Bulk ETL loads from one table to another (*)
60. D) Index rebuilds
61. Explanation: INSERT INTO target SELECT ... FROM source is the standard pattern for batch-loading or transforming data between tables.
62. Q10: Where should an UPSERT inside a webhook handler be wrapped?
63. A) In a stored procedure only
64. B) In an AFTER trigger
65. C) In a cursor
66. D) In a transaction with retry-on-serialization-failure (*)
67. Explanation: Webhook handlers run concurrently; UPSERT plus a transaction with retry-on-serialization-failure handles races cleanly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does INSERT ... ON CONFLICT DO NOTHING require?
  options:
    - A primary key on every column
    - A trigger
    - A unique constraint or unique index on the conflict target
    - A foreign key
  correctIndex: 2
  explanation: ON CONFLICT needs a unique index or constraint on the target columns to detect the conflict; otherwise Postgres raises an error.
- id: q2
  question: What does RETURNING give you?
  options:
    - The row count affected
    - The query plan
    - A success/failure boolean
    - The actual rows affected, including generated columns
  correctIndex: 3
  explanation: RETURNING projects the affected rows back, letting you fetch generated IDs and computed columns in one round-trip.
- id: q3
  question: Which is faster for emptying a large table?
  options:
    - TRUNCATE TABLE t
    - DELETE FROM t
    - DROP TABLE t
    - TRUNCATE is identical to DELETE
  correctIndex: 0
  explanation: TRUNCATE drops and recreates storage, bypassing row-by-row deletion; it's much faster but is non-transactional for FK cascades and resets sequences unless RESTART IDENTITY.
- id: q4
  question: Why preview an UPDATE with SELECT first?
  options:
    - SELECT is faster than UPDATE
    - To confirm the WHERE matches exactly the intended rows
    - SELECT acquires locks that speed up UPDATE
    - It's required by the SQL standard
  correctIndex: 1
  explanation: Running SELECT with the same WHERE lets you sanity-check the affected set before mutating.
- id: q5
  question: What does `xmax = 0` indicate in RETURNING?
  options:
    - The row was deleted
    - The row has a unique violation
    - The row was inserted (not updated)
    - The row is locked
  correctIndex: 2
  explanation: xmax is the row's transaction delete/update xid; for a fresh INSERT it's 0, so `(xmax = 0)` is TRUE only for inserted rows.
- id: q6
  question: Which statement can also DELETE on match?
  options:
    - INSERT ... ON CONFLICT
    - UPDATE ... FROM
    - UPSERT
    - MERGE
  correctIndex: 3
  explanation: MERGE supports WHEN MATCHED THEN DELETE/UPDATE and WHEN NOT MATCHED THEN INSERT, all in one statement.
- id: q7
  question: What is a risk of `UPDATE ... FROM`?
  options:
    - The FROM side may fan out and multiply updates if join keys aren't unique
    - It's slower than MERGE
    - It can't be wrapped in a transaction
    - It bypasses triggers
  correctIndex: 0
  explanation: If the FROM table has multiple matching rows per target row, the update happens multiple times nondeterministically; ensure uniqueness.
- id: q8
  question: TRUNCATE ... RESTART IDENTITY does what?
  options:
    - Drops the table
    - Resets owned sequences to their initial values
    - Restores from backup
    - Rebuilds indexes
  correctIndex: 1
  explanation: RESTART IDENTITY resets sequences owned by the table's columns; without it, sequences continue from their current value.
- id: q9
  question: INSERT ... SELECT is commonly used for?
  options:
    - Idempotent webhook handling
    - Soft-deletes
    - Bulk ETL loads from one table to another
    - Index rebuilds
  correctIndex: 2
  explanation: INSERT INTO target SELECT ... FROM source is the standard pattern for batch-loading or transforming data between tables.
- id: q10
  question: Where should an UPSERT inside a webhook handler be wrapped?
  options:
    - In a stored procedure only
    - In an AFTER trigger
    - In a cursor
    - In a transaction with retry-on-serialization-failure
  correctIndex: 3
  explanation: Webhook handlers run concurrently; UPSERT plus a transaction with retry-on-serialization-failure handles races cleanly.
```

