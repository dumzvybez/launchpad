---
slug: postgresql-transactions-isolation-levels-mvcc
id: postgresql-13
track: postgresql
order: 13
title: Transactions, Isolation Levels, and MVCC
description: Understand Postgres's MVCC model, the four isolation levels, serialization failures, and how to write retry logic for SERIALIZABLE transactions.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=14400s
whyItMatters: Understand Postgres's MVCC model, the four isolation levels, serialization failures, and how to write retry logic for SERIALIZABLE transactions.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Transactions, Isolation Levels, and MVCC

## Transactions, Isolation Levels, and MVCC

### Why It Matters

Understand Postgres's MVCC model, the four isolation levels, serialization failures, and how to write retry logic for SERIALIZABLE transactions.

Understand Postgres's MVCC model, the four isolation levels, serialization failures, and how to write retry logic for SERIALIZABLE transactions.

### Prerequisites

- Stage 8: Functions — SQL, PL/pgSQL, Procedural
- Stage 4: Schemas, Tables, and Constraints

### Topics

- ACID: Atomicity, Consistency, Isolation, Durability — and what each means in Postgres
- MVCC: tuples, xmin/xmax, snapshots, and why readers never block writers
- The four isolation levels: READ UNCOMMITTED, READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE
- READ COMMITTED vs REPEATABLE READ: statement snapshot vs transaction snapshot
- SERIALIZABLE: SSI (Serializable Snapshot Isolation), predicate locks, serialization_failure
- Locks: row, table, advisory; explicit LOCK TABLE; SELECT FOR UPDATE/SHARE
- Deadlocks: how they happen, lock_timeout, and retry-on-deadlock patterns
- Savepoints, nested transactions, and partial rollback

### Key Concepts

- Postgres MVCC: every UPDATE creates a new row version; DELETE marks the row as dead; readers see a snapshot of "live" rows as of their transaction start.
- READ COMMITTED (default): each statement gets a fresh snapshot — non-repeatable reads and phantoms are possible.
- REPEATABLE READ: the whole transaction uses one snapshot (first query's); prevents non-repeatable reads and phantoms in Postgres (stronger than SQL standard requires).
- SERIALIZABLE: SSI tracks predicate locks; if two concurrent transactions would conflict, one gets `serialization_failure` (SQLSTATE 40001) and must retry.
- `SELECT ... FOR UPDATE` locks rows to prevent concurrent UPDATE/DELETE; FOR SHARE allows other FOR SHARE but blocks UPDATE.
- Deadlocks: txn A locks row 1 then row 2; txn B locks row 2 then row 1; one is killed. Fix with consistent lock ordering or retry-on-deadlock.
- Advisory locks (`pg_advisory_lock`) are app-level mutexes in the DB — great for "only one cron runs at a time" or per-tenant serialization.

```sql
-- Session A:
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT count(*) FROM events WHERE tenant_id = 1;   -- returns 100
-- Session B inserts 50 rows and commits
SELECT count(*) FROM events WHERE tenant_id = 1;   -- returns 150 (non-repeatable)
COMMIT;

-- Session A (REPEATABLE READ):
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT count(*) FROM events WHERE tenant_id = 1;   -- returns 100
-- Session B inserts 50 rows and commits
SELECT count(*) FROM events WHERE tenant_id = 1;   -- returns 100 (snapshot frozen)
COMMIT;
```
Caption: Isolation levels and the difference

### Common Pitfalls

- Forgetting to retry serialization_failure — SERIALIZABLE transactions can fail with SQLSTATE 40001 by design; the app MUST catch and retry (3-5 attempts is usually enough).
- Long-running transactions causing bloat — a long READ COMMITTED txn holds a snapshot that prevents VACUUM from reclaiming dead tuples; keep txns short and set `idle_in_transaction_session_timeout`.
- Inconsistent lock ordering causing deadlocks — always lock rows in a consistent order (e.g. by id ascending) to avoid the classic A→B vs B→A deadlock.
- Treating REPEATABLE READ as SERIALIZABLE — Postgres REPEATABLE READ prevents phantoms but NOT write skew; for true isolation use SERIALIZABLE with retry.
- Using SELECT FOR UPDATE recklessly — it locks rows for the whole transaction; if you only need to detect concurrent changes, use `FOR UPDATE` after a row lookup, not in a wide scan that locks thousands of rows.

### Real-World Applications

- Stripe uses SERIALIZABLE transactions for ledger entries to guarantee no double-spends across concurrent transfers.
- Discord uses advisory locks for per-channel rate-limiting and per-shard cron serialization.
- Reddit uses SELECT FOR UPDATE on vote-aggregation rows to prevent lost updates.
- Spotify uses REPEATABLE READ for batch reconciliation jobs that need a consistent snapshot.

### Interview Questions

- 1. What is MVCC and what does it guarantee? — Multi-Version Concurrency Control: each transaction sees a snapshot of live rows; readers never block writers and vice versa.
- 2. What's the difference between READ COMMITTED and REPEATABLE READ? — READ COMMITTED takes a fresh snapshot per statement; REPEATABLE READ uses one snapshot for the whole transaction (prevents non-repeatable reads).
- 3. What does SERIALIZABLE mean in Postgres? — Serializable Snapshot Isolation (SSI): detects conflicts via predicate locks and aborts one txn with serialization_failure (40001); the app must retry.
- 4. How do you prevent deadlocks? — Lock rows in a consistent order (e.g. by id ascending); use SELECT FOR UPDATE on a sorted subquery; set lock_timeout to fail fast.
- 5. What is an advisory lock used for? — App-level mutexes in the DB: "only one cron runs at a time", per-tenant serialization, leader election.

### Mini Project

Build a Concurrent Transfer Demo: Two psql sessions repeatedly transfer money between accounts in opposite directions. Demonstrate (1) a deadlock under inconsistent lock ordering, (2) the fix with sorted locks, (3) a SERIALIZABLE retry-on-40001 loop, and (4) an advisory lock that serializes a background reconciliation job. Suggested approach:
  - Create `account(id, balance)` with 2 rows
  - Session A: UPDATE account SET balance = balance - 10 WHERE id = 1; UPDATE ... WHERE id = 2;
  - Session B: same but ids 2 then 1 — observe deadlock
  - Fix: SELECT ... FOR UPDATE WHERE id IN (1,2) ORDER BY id in both sessions
  - Add a SERIALIZABLE transaction wrapper that retries on SQLSTATE 40001
  - Use pg_advisory_lock(app_id) to ensure only one reconciliation runs at a time

### Exercises

1. Open two psql sessions; in READ COMMITTED, demonstrate a non-repeatable read (session B inserts between two SELECTs in session A).
2. Repeat the same test in REPEATABLE READ; verify session A sees the same count both times.
3. Cause a deadlock with two sessions updating rows in opposite orders; observe one is killed.
4. Set `SET lock_timeout = '2s';` and trigger a lock wait; verify it aborts after 2 seconds instead of waiting forever.
5. Use pg_try_advisory_lock(12345) in two sessions; verify only one acquires it.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Postgres's default transaction isolation level?
9. A) READ COMMITTED (*)
10. B) READ UNCOMMITTED
11. C) REPEATABLE READ
12. D) SERIALIZABLE
13. Explanation: READ COMMITTED is the default; each statement gets a fresh snapshot, allowing non-repeatable reads but offering good concurrency.
14. Q2: What does MVCC guarantee?
15. A) Faster writes
16. B) Readers never block writers and vice versa; each txn sees a snapshot of live rows (*)
17. C) No deadlocks
18. D) Immediate consistency
19. Explanation: Multi-Version Concurrency Control keeps multiple row versions; readers see a snapshot, writers create new versions. Locks are mostly for write/write conflicts only.
20. Q3: What's the difference between READ COMMITTED and REPEATABLE READ in Postgres?
21. A) REPEATABLE READ is always slower
22. B) They are the same
23. C) READ COMMITTED takes a fresh snapshot per statement; REPEATABLE READ uses one snapshot for the whole txn (*)
24. D) REPEATABLE READ allows dirty reads
25. Explanation: REPEATABLE READ freezes the snapshot at the first query, preventing non-repeatable reads and phantoms (Postgres's implementation is stronger than the SQL standard requires).
26. Q4: What SQLSTATE does a SERIALIZABLE transaction return when it must retry?
27. A) 23505 (unique_violation)
28. B) 40P01 (deadlock_detected)
29. C) 08006 (connection_failure)
30. D) 40001 (serialization_failure) (*)
31. Explanation: 40001 is serialization_failure; the app MUST catch it and retry the whole transaction. 40P01 is deadlock_detected (also retriable).
32. Q5: How do you prevent deadlocks from inconsistent lock ordering?
33. A) Always lock rows in a consistent order (e.g. by id ascending) (*)
34. B) Use SERIALIZABLE
35. C) Increase lock_timeout
36. D) Disable transactions
37. Explanation: If all transactions acquire locks in the same order, the A→B vs B→A cycle can't form. Use SELECT ... FOR UPDATE on a sorted subquery, or sort the ids in your UPDATE.
38. Q6: What does SELECT ... FOR UPDATE do?
39. A) Forces an UPDATE
40. B) Locks the selected rows until the transaction ends, preventing concurrent UPDATE/DELETE (*)
41. C) Upgrades the isolation level
42. D) Skips locked rows
43. Explanation: FOR UPDATE acquires row-level FOR UPDATE locks; other transactions trying to UPDATE/DELETE/SELECT FOR UPDATE the same rows block until the locking txn ends. FOR SHARE allows concurrent reads.
44. Q7: What is an advisory lock used for?
45. A) Locking tables
46. B) Faster SELECTs
47. C) App-level mutexes in the DB — "only one cron runs at a time", per-tenant serialization (*)
48. D) Recovering from deadlocks
49. Explanation: Advisory locks (pg_advisory_lock) are app-defined locks that don't tie to any row; perfect for cross-process coordination like cron serialization or leader election.
50. Q8: Why are long-running transactions dangerous in Postgres?
51. A) They use too much CPU
52. B) They cause deadlocks
53. C) They disable WAL
54. D) They hold a snapshot that blocks VACUUM from reclaiming dead tuples, causing bloat (*)
55. Explanation: VACUUM can't remove dead tuples newer than the oldest open transaction's snapshot; long txns cause table and index bloat. Set idle_in_transaction_session_timeout.
56. Q9: What does Postgres's REPEATABLE READ prevent that the SQL standard requires it not to?
57. A) Phantoms — Postgres's REPEATABLE READ is stronger than the SQL standard requires (*)
58. B) Dirty reads
59. C) Write skew
60. D) Lost updates
61. Explanation: The SQL standard allows REPEATABLE READ to permit phantoms; Postgres's snapshot isolation prevents them. Write skew is still possible (only SERIALIZABLE prevents it).
62. Q10: What does `pg_advisory_xact_lock(123)` do?
63. A) Locks table 123
64. B) Acquires a transaction-level advisory lock auto-released on COMMIT/ROLLBACK (*)
65. C) Locks row 123
66. D) Starts a new transaction
67. Explanation: pg_advisory_xact_lock auto-releases at txn end; pg_advisory_lock is session-level (must be explicitly unlocked or released on disconnect). Choose based on your lock scope.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is Postgres's default transaction isolation level?
  options:
    - READ COMMITTED
    - READ UNCOMMITTED
    - REPEATABLE READ
    - SERIALIZABLE
  correctIndex: 0
  explanation: READ COMMITTED is the default; each statement gets a fresh snapshot, allowing non-repeatable reads but offering good concurrency.
- id: q2
  question: What does MVCC guarantee?
  options:
    - Faster writes
    - Readers never block writers and vice versa; each txn sees a snapshot of live rows
    - No deadlocks
    - Immediate consistency
  correctIndex: 1
  explanation: Multi-Version Concurrency Control keeps multiple row versions; readers see a snapshot, writers create new versions. Locks are mostly for write/write conflicts only.
- id: q3
  question: What's the difference between READ COMMITTED and REPEATABLE READ in Postgres?
  options:
    - REPEATABLE READ is always slower
    - They are the same
    - READ COMMITTED takes a fresh snapshot per statement; REPEATABLE READ uses one snapshot for the whole txn
    - REPEATABLE READ allows dirty reads
  correctIndex: 2
  explanation: REPEATABLE READ freezes the snapshot at the first query, preventing non-repeatable reads and phantoms (Postgres's implementation is stronger than the SQL standard requires).
- id: q4
  question: What SQLSTATE does a SERIALIZABLE transaction return when it must retry?
  options:
    - 23505 (unique_violation)
    - 40P01 (deadlock_detected)
    - 08006 (connection_failure)
    - 40001 (serialization_failure)
  correctIndex: 3
  explanation: 40001 is serialization_failure; the app MUST catch it and retry the whole transaction. 40P01 is deadlock_detected (also retriable).
- id: q5
  question: How do you prevent deadlocks from inconsistent lock ordering?
  options:
    - Always lock rows in a consistent order (e.g. by id ascending)
    - Use SERIALIZABLE
    - Increase lock_timeout
    - Disable transactions
  correctIndex: 0
  explanation: If all transactions acquire locks in the same order, the A→B vs B→A cycle can't form. Use SELECT ... FOR UPDATE on a sorted subquery, or sort the ids in your UPDATE.
- id: q6
  question: What does SELECT ... FOR UPDATE do?
  options:
    - Forces an UPDATE
    - Locks the selected rows until the transaction ends, preventing concurrent UPDATE/DELETE
    - Upgrades the isolation level
    - Skips locked rows
  correctIndex: 1
  explanation: FOR UPDATE acquires row-level FOR UPDATE locks; other transactions trying to UPDATE/DELETE/SELECT FOR UPDATE the same rows block until the locking txn ends. FOR SHARE allows concurrent reads.
- id: q7
  question: What is an advisory lock used for?
  options:
    - Locking tables
    - Faster SELECTs
    - App-level mutexes in the DB — "only one cron runs at a time", per-tenant serialization
    - Recovering from deadlocks
  correctIndex: 2
  explanation: Advisory locks (pg_advisory_lock) are app-defined locks that don't tie to any row; perfect for cross-process coordination like cron serialization or leader election.
- id: q8
  question: Why are long-running transactions dangerous in Postgres?
  options:
    - They use too much CPU
    - They cause deadlocks
    - They disable WAL
    - They hold a snapshot that blocks VACUUM from reclaiming dead tuples, causing bloat
  correctIndex: 3
  explanation: VACUUM can't remove dead tuples newer than the oldest open transaction's snapshot; long txns cause table and index bloat. Set idle_in_transaction_session_timeout.
- id: q9
  question: What does Postgres's REPEATABLE READ prevent that the SQL standard requires it not to?
  options:
    - Phantoms — Postgres's REPEATABLE READ is stronger than the SQL standard requires
    - Dirty reads
    - Write skew
    - Lost updates
  correctIndex: 0
  explanation: The SQL standard allows REPEATABLE READ to permit phantoms; Postgres's snapshot isolation prevents them. Write skew is still possible (only SERIALIZABLE prevents it).
- id: q10
  question: What does `pg_advisory_xact_lock(123)` do?
  options:
    - Locks table 123
    - Acquires a transaction-level advisory lock auto-released on COMMIT/ROLLBACK
    - Locks row 123
    - Starts a new transaction
  correctIndex: 1
  explanation: pg_advisory_xact_lock auto-releases at txn end; pg_advisory_lock is session-level (must be explicitly unlocked or released on disconnect). Choose based on your lock scope.
```

