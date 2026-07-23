---
slug: sql-transactions-isolation-levels-locks
id: sql-10
track: sql
order: 10
title: Transactions, Isolation Levels, and Locks
description: Use BEGIN/COMMIT/ROLLBACK, SAVEPOINT, and SELECT FOR UPDATE to keep data consistent — and understand ACID, the four isolation levels, deadlock causes, and how to avoid them.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=6200s
whyItMatters: Use BEGIN/COMMIT/ROLLBACK, SAVEPOINT, and SELECT FOR UPDATE to keep data consistent — and understand ACID, the four isolation levels, deadlock causes, and how to avoid them.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Transactions, Isolation Levels, and Locks

## Transactions, Isolation Levels, and Locks

### Why It Matters

Use BEGIN/COMMIT/ROLLBACK, SAVEPOINT, and SELECT FOR UPDATE to keep data consistent — and understand ACID, the four isolation levels, deadlock causes, and how to avoid them.

Use BEGIN/COMMIT/ROLLBACK, SAVEPOINT, and SELECT FOR UPDATE to keep data consistent — and understand ACID, the four isolation levels, deadlock causes, and how to avoid them.

### Prerequisites

- Stage 9: Indexes and Query Performance.
- Comfort with concurrent clients (two psql sessions).

### Topics

- BEGIN, COMMIT, ROLLBACK, SAVEPOINT, RELEASE SAVEPOINT
- ACID properties — atomicity, consistency, isolation, durability
- Isolation levels: READ UNCOMMITTED, READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE
- Phenomena: dirty read, non-repeatable read, phantom read, serialization anomaly
- Locks: row, table, advisory; SELECT ... FOR UPDATE, FOR SHARE, NOWAIT, SKIP LOCKED
- Deadlocks — causes, detection, and prevention via deterministic lock ordering
- Implicit transactions and autocommit
- Long-running transactions and their harm to VACUUM

### Key Concepts

- A transaction is an atomic unit of work; either all changes commit or none do.
- Postgres defaults to READ COMMITTED (no dirty reads, but non-repeatable reads and phantoms possible).
- SERIALIZABLE uses SSI (Serializable Snapshot Isolation) and may abort with serialization_failure — retry the whole transaction.
- SELECT FOR UPDATE locks the row against concurrent updates; useful for "fetch then update" patterns.
- Deadlocks happen when two transactions hold locks the other wants; the DB aborts one — retry or use deterministic lock ordering.
- Long-running transactions block VACUUM from reclaiming dead tuples, causing bloat.

```sql
BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
-- If either fails, ROLLBACK; otherwise COMMIT
COMMIT;
```
Caption: Basic transaction

### Common Pitfalls

- Long-running transactions — block VACUUM and bloat the table; keep transactions short, especially in web requests.
- Deadlock from inconsistent lock ordering — transaction A locks row1 then row2; B locks row2 then row1; always lock in the same order.
- Forgetting to retry on serialization_failure — SERIALIZABLE can abort; the app must retry the whole transaction.
- Read-modify-write without FOR UPDATE — two sessions read the same balance, both write, one overwrites the other; use SELECT FOR UPDATE.
- Mixing DDL and DML in long transactions — DDL like CREATE INDEX CONCURRENTLY can't run inside a transaction block.

### Real-World Applications

- Stripe's payment pipeline wraps every charge in a SERIALIZABLE transaction with retry-on-serialization-failure.
- Airbnb's calendar uses SELECT FOR UPDATE on the listing-date row to prevent double-bookings.
- Uber's trip dispatch uses SKIP LOCKED to assign drivers without contention.
- LinkedIn's feed pre-computation uses advisory locks keyed by member_id to dedupe concurrent jobs.

### Interview Questions

- 1. What are the ACID properties? — Atomicity, Consistency, Isolation, Durability.
- 2. What's the default isolation level in Postgres? — READ COMMITTED; no dirty reads, but non-repeatable reads and phantoms possible.
- 3. How does SERIALIZABLE work in Postgres? — SSI (Serializable Snapshot Isolation) tracks read/write dependencies and aborts on conflicts.
- 4. What causes a deadlock? — Two transactions each hold a lock the other wants; the DB aborts one with deadlock_detected.
- 5. Why are long transactions harmful? — They block VACUUM from reclaiming dead tuples, leading to bloat and degraded performance.

### Mini Project

Build a Concurrent Task Queue: A `task_queue` table with status (pending, running, done, failed), claimed_at, claimed_by. Two scripts compete: workers claim 5 tasks at a time with FOR UPDATE SKIP LOCKED, mark them running, then done. Demonstrate that two workers can drain the queue without conflicts. Suggested approach:
  - Use SELECT ... FOR UPDATE SKIP LOCKED LIMIT 5
  - UPDATE in the same transaction to flip status
  - Use pg_advisory_lock on worker_id for graceful shutdown
  - On serialization_failure, retry with exponential backoff
  - Add a `claimed_at` and timeout to re-claim stuck tasks

### Exercises

1. Open two psql sessions; in one BEGIN and UPDATE a row without COMMIT; in the other, observe the blocked UPDATE.
2. Use SELECT FOR UPDATE to safely read-modify-write a counter.
3. Use FOR UPDATE SKIP LOCKED to claim 3 tasks concurrently from two sessions.
4. Set isolation to SERIALIZABLE in both sessions and trigger a serialization_failure; retry.
5. Cause a deadlock by reversing lock order in two sessions; observe the error.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What are the ACID properties?
9. A) Atomicity, Caching, Indexing, Durability
10. B) Atomicity, Consistency, Isolation, Durability (*)
11. C) Availability, Consistency, Isolation, Durability
12. D) Atomicity, Concurrency, Indexing, Distribution
13. Explanation: ACID = Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent txns don't interfere), Durability (committed survives crash).
14. Q2: What is Postgres' default isolation level?
15. A) READ UNCOMMITTED
16. B) REPEATABLE READ
17. C) READ COMMITTED (*)
18. D) SERIALIZABLE
19. Explanation: Postgres defaults to READ COMMITTED — no dirty reads, but a re-read can show different data (non-repeatable read).
20. Q3: How does Postgres implement SERIALIZABLE?
21. A) With table-level locks
22. B) By serializing all transactions
23. C) With global ordering
24. D) Via SSI (Serializable Snapshot Isolation) tracking read/write dependencies (*)
25. Explanation: SSI detects potential conflicts at commit time and may abort with serialization_failure; the app must retry.
26. Q4: What does SELECT FOR UPDATE SKIP LOCKED do?
27. A) Locks matching rows; rows already locked by other txns are skipped (not blocked) (*)
28. B) Skips the FOR UPDATE
29. C) Skips the WHERE
30. D) Releases the lock immediately
31. Explanation: SKIP LOCKED is the canonical queue-claim pattern — workers drain the queue concurrently without waiting on each other.
32. Q5: What is the cause of a deadlock?
33. A) A transaction that runs too long
34. B) Two transactions each hold a lock the other wants (*)
35. C) Missing index
36. D) Too many connections
37. Explanation: Deadlocks arise from circular lock waits; Postgres detects them and aborts one transaction with deadlock_detected.
38. Q6: How do you prevent deadlocks?
39. A) Use SERIALIZABLE always
40. B) Disable locks
41. C) Always lock resources in the same order across transactions (*)
42. D) Use shorter queries
43. Explanation: If every transaction acquires locks in a deterministic order, no circular wait can form; document and enforce the order.
44. Q7: What does SAVEPOINT allow?
45. A) A persistent checkpoint
46. B) A snapshot of the table
47. C) An automatic commit
48. D) A named point inside a transaction to which you can ROLLBACK TO (*)
49. Explanation: SAVEPOINT creates a sub-transaction; ROLLBACK TO name undoes work back to that point without aborting the whole transaction.
50. Q8: Why are long-running transactions harmful?
51. A) They block VACUUM from reclaiming dead tuples, causing bloat (*)
52. B) They use more CPU
53. C) They violate ACID
54. D) They cause serialization failures
55. Explanation: VACUUM can't remove row versions that are still visible to an open transaction; this leads to table and index bloat.
56. Q9: What error does Postgres raise on a serialization conflict?
57. A) deadlock_detected
58. B) serialization_failure (SQLSTATE 40001) (*)
59. C) unique_violation
60. D) lock_not_available
61. Explanation: SQLSTATE 40001 (serialization_failure) signals SSI conflict; the app should retry the whole transaction.
62. Q10: pg_advisory_lock is best for?
63. A) Locking a single row
64. B) Replacing FOR UPDATE
65. C) Coordinating application-level logical locks across transactions/sessions (*)
66. D) Indexing
67. Explanation: Advisory locks are cooperative app-level locks identified by bigint keys; perfect for "only one build of project X at a time" patterns.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What are the ACID properties?
  options:
    - Atomicity, Caching, Indexing, Durability
    - Atomicity, Consistency, Isolation, Durability
    - Availability, Consistency, Isolation, Durability
    - Atomicity, Concurrency, Indexing, Distribution
  correctIndex: 1
  explanation: ACID = Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent txns don't interfere), Durability (committed survives crash).
- id: q2
  question: What is Postgres' default isolation level?
  options:
    - READ UNCOMMITTED
    - REPEATABLE READ
    - READ COMMITTED
    - SERIALIZABLE
  correctIndex: 2
  explanation: Postgres defaults to READ COMMITTED — no dirty reads, but a re-read can show different data (non-repeatable read).
- id: q3
  question: How does Postgres implement SERIALIZABLE?
  options:
    - With table-level locks
    - By serializing all transactions
    - With global ordering
    - Via SSI (Serializable Snapshot Isolation) tracking read/write dependencies
  correctIndex: 3
  explanation: SSI detects potential conflicts at commit time and may abort with serialization_failure; the app must retry.
- id: q4
  question: What does SELECT FOR UPDATE SKIP LOCKED do?
  options:
    - Locks matching rows; rows already locked by other txns are skipped (not blocked)
    - Skips the FOR UPDATE
    - Skips the WHERE
    - Releases the lock immediately
  correctIndex: 0
  explanation: SKIP LOCKED is the canonical queue-claim pattern — workers drain the queue concurrently without waiting on each other.
- id: q5
  question: What is the cause of a deadlock?
  options:
    - A transaction that runs too long
    - Two transactions each hold a lock the other wants
    - Missing index
    - Too many connections
  correctIndex: 1
  explanation: Deadlocks arise from circular lock waits; Postgres detects them and aborts one transaction with deadlock_detected.
- id: q6
  question: How do you prevent deadlocks?
  options:
    - Use SERIALIZABLE always
    - Disable locks
    - Always lock resources in the same order across transactions
    - Use shorter queries
  correctIndex: 2
  explanation: If every transaction acquires locks in a deterministic order, no circular wait can form; document and enforce the order.
- id: q7
  question: What does SAVEPOINT allow?
  options:
    - A persistent checkpoint
    - A snapshot of the table
    - An automatic commit
    - A named point inside a transaction to which you can ROLLBACK TO
  correctIndex: 3
  explanation: SAVEPOINT creates a sub-transaction; ROLLBACK TO name undoes work back to that point without aborting the whole transaction.
- id: q8
  question: Why are long-running transactions harmful?
  options:
    - They block VACUUM from reclaiming dead tuples, causing bloat
    - They use more CPU
    - They violate ACID
    - They cause serialization failures
  correctIndex: 0
  explanation: VACUUM can't remove row versions that are still visible to an open transaction; this leads to table and index bloat.
- id: q9
  question: What error does Postgres raise on a serialization conflict?
  options:
    - deadlock_detected
    - serialization_failure (SQLSTATE 40001)
    - unique_violation
    - lock_not_available
  correctIndex: 1
  explanation: SQLSTATE 40001 (serialization_failure) signals SSI conflict; the app should retry the whole transaction.
- id: q10
  question: pg_advisory_lock is best for?
  options:
    - Locking a single row
    - Replacing FOR UPDATE
    - Coordinating application-level logical locks across transactions/sessions
    - Indexing
  correctIndex: 2
  explanation: Advisory locks are cooperative app-level locks identified by bigint keys; perfect for "only one build of project X at a time" patterns.
```

