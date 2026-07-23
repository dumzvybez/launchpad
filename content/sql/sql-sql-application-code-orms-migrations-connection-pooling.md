---
slug: sql-sql-application-code-orms-migrations-connection-pooling
id: sql-19
track: sql
order: 19
title: SQL in Application Code — ORMs, Migrations, Connection Pooling
description: Use SQL safely from application code with ORMs (SQLAlchemy, Prisma, TypeORM), manage schema changes with migrations (Alembic, golang-migrate), and avoid the N+1, SQL injection, and connection-pool pitfalls that plague real backends.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=12500s
whyItMatters: Use SQL safely from application code with ORMs (SQLAlchemy, Prisma, TypeORM), manage schema changes with migrations (Alembic, golang-migrate), and avoid the N+1, SQL injection, and connection-pool pitfalls that plague real backends.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# SQL in Application Code — ORMs, Migrations, Connection Pooling

## SQL in Application Code — ORMs, Migrations, Connection Pooling

### Why It Matters

Use SQL safely from application code with ORMs (SQLAlchemy, Prisma, TypeORM), manage schema changes with migrations (Alembic, golang-migrate), and avoid the N+1, SQL injection, and connection-pool pitfalls that plague real backends.

Use SQL safely from application code with ORMs (SQLAlchemy, Prisma, TypeORM), manage schema changes with migrations (Alembic, golang-migrate), and avoid the N+1, SQL injection, and connection-pool pitfalls that plague real backends.

### Prerequisites

- Stage 18: Security — Roles, Grants, RLS, Auditing.
- Familiarity with at least one backend language (Python, Node, Go).

### Topics

- ORM patterns: ActiveRecord, Data Mapper (SQLAlchemy), Prisma, TypeORM
- The N+1 problem — detection and eager loading
- Parameterized queries and SQL injection prevention
- Migrations: Alembic, Flyway, golang-migrate, Prisma Migrate
- Expand-then-contract zero-downtime migrations
- Connection pooling: PgBouncer (transaction mode), pgxpool, SQLAlchemy pool
- Prepared statements and the generic plan pitfall (Postgres 16+)
- Long-running transactions in web requests

### Key Concepts

- ORMs boost productivity but generate SQL you didn't write; turn on query logging in dev and review slow queries.
- N+1: a list query followed by one extra query per row to fetch a relation; fix with eager loading (SQLAlchemy joinedload/selectinload, Prisma include).
- ALWAYS parameterize — `$1`/`?` placeholders — never concatenate user input; even identifiers should come from a whitelist.
- Migrations should be additive first; expand-then-contract: add column, backfill, switch reads, drop old (later).
- PgBouncer in transaction mode multiplexes many app connections over few server connections; can't use session-level features (LISTEN/NOTIFY, advisory locks).
- A web request that opens a transaction and waits on an external API holds a DB connection for the whole duration; keep transactions short.

```python
import psycopg

# GOOD: parameters bound by the driver; immune to SQL injection
with psycopg.connect(dsn) as conn, conn.cursor() as cur:
    cur.execute(
        "SELECT id, email FROM customer WHERE last_name = %s AND active = %s",
        (last_name, True),
    )
    rows = cur.fetchall()

# BAD: string concatenation — SQL injection vulnerability
# cur.execute(f"SELECT ... WHERE last_name = '{last_name}'")  # NEVER
```
Caption: Parameterized queries in Python (psycopg2/3)

### Common Pitfalls

- N+1 queries — list endpoint that loads relations per row; fix with eager loading or batching.
- SQL injection via string concatenation — `f"WHERE name = '{user_input}'"`; always parameterize, even for "internal" inputs.
- Connection leak — opening a connection per request without returning it to the pool; use context managers.
- Long transaction in a web request — holding a DB connection while waiting on an external API; push the API call outside the transaction.
- PgBouncer transaction mode + session features — LISTEN/NOTIFY, advisory locks, and SET with session scope don't work; use session mode or a direct connection for those.

### Real-World Applications

- Instagram uses SQLAlchemy-equivalent ORMs with strict query logging to catch N+1 in code review.
- Stripe uses Alembic migrations with expand-then-contract enforced via CI checks.
- Airbnb runs PgBouncer in transaction mode in front of Postgres, multiplexing tens of thousands of web connections to a few hundred server connections.
- Netflix uses Prisma in Node services and r2d2-style migrations; slow-query alerts fire on any query >1s.

### Interview Questions

- 1. What is the N+1 problem? — A list query plus one extra query per row to fetch a relation; fix with eager loading (joinedload/selectinload/include).
- 2. How do you prevent SQL injection? — Parameterized queries (placeholders bound by the driver); never concatenate user input, even identifiers.
- 3. What is expand-then-contract? — Add the new structure (nullable column), backfill, switch reads, then drop the old — zero-downtime migrations.
- 4. What does PgBouncer transaction mode do? — Multiplexes many app connections over few server connections, releasing the server connection at COMMIT/ROLLBACK.
- 5. Why avoid long transactions in web requests? — They hold a connection from a finite pool while waiting on slow external calls; move the external call outside the transaction.

### Mini Project

Build a Customer API with No N+1: A small FastAPI (or Express) service exposing `GET /customers?with_payments=true` and `GET /customers/{id}` using SQLAlchemy (or Prisma). Use eager loading to avoid N+1, parameterized queries throughout, and an Alembic migration for the schema. Suggested approach:
  - Define Customer and Payment models with a relationship
  - Use selectinload(Customer.payments) when with_payments=true
  - Use parameterized queries for any raw SQL (e.g. search)
  - Write Alembic migrations using expand-then-contract
  - Add a PgBouncer config in front of Postgres; verify connection multiplexing

### Exercises

1. Write a parameterized query in psycopg2 (or pg) that selects by email.
2. Trigger an N+1 in SQLAlchemy by accessing a lazy-loaded relation in a loop; fix with selectinload.
3. Write an Alembic migration adding a nullable column, then a follow-up to backfill and set NOT NULL.
4. Configure PgBouncer in transaction mode; verify max_client_conn > default_pool_size works.
5. Use EXPLAIN to compare a custom vs generic plan for a prepared statement on skewed data.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the N+1 query problem?
9. A) One query that returns 1 row
10. B) A nested subquery
11. C) A list query plus one extra query per row to fetch a relation (*)
12. D) A query that uses N indexes
13. Explanation: Loading N parents then issuing one query per parent for a child relation = N+1 total queries; fix with eager loading.
14. Q2: Which is the SQL injection-safe pattern?
15. A) f"WHERE name = '{user_input}'"
16. B) String concatenation with escaping
17. C) Reading input from a file
18. D) Parameterized queries with placeholders bound by the driver (*)
19. Explanation: Placeholders ($1, ?) are bound by the driver; values never become SQL syntax. Concatenation — even with escaping — is fragile.
20. Q3: In SQLAlchemy, which option loads a relation with one extra IN query?
21. A) selectinload (*)
22. B) lazyload
23. C) subquery
24. D) noload
25. Explanation: selectinload issues one SELECT ... WHERE id IN (...) after the parent query; joinedload uses a JOIN. Both fix N+1.
26. Q4: What does PgBouncer transaction mode release?
27. A) The query plan
28. B) The server connection at COMMIT/ROLLBACK, allowing multiplexing (*)
29. C) The client connection
30. D) Locks
31. Explanation: In transaction mode, the server connection is returned to the pool at txn end; many clients share few server connections. Session features (LISTEN, advisory locks) don't work.
32. Q5: Why avoid long transactions in web requests?
33. A) They violate SQL standard
34. B) They always deadlock
35. C) They hold a pooled connection while waiting on slow external calls (*)
36. D) They disable indexes
37. Explanation: Holding a transaction across an external API call keeps a scarce connection out of the pool; move the call outside the transaction.
38. Q6: Expand-then-contract migration pattern means?
39. A) Drop then recreate
40. B) Use VACUUM FULL
41. C) Restart Postgres
42. D) Add structure, backfill, switch reads, then drop the old — zero downtime (*)
43. Explanation: Each step is non-breaking: add nullable column, backfill, deploy app using new column, then drop the old in a later migration.
44. Q7: Why might a prepared statement become slower after 5 executions in Postgres 12+?
45. A) The planner may switch to a generic plan that's worse for skewed data (*)
46. B) It's cached incorrectly
47. C) It always uses seq scan
48. D) It disables indexes
49. Explanation: After 5 custom-plan executions, Postgres may pick a generic plan; for skewed data this can be much slower. Force custom with plan_cache_mode (PG16+).
50. Q8: Which is TRUE about Alembic?
51. A) It's a NoSQL ORM
52. B) It generates Python migration scripts from SQLAlchemy model changes; supports upgrade/downgrade (*)
53. C) It replaces PgBouncer
54. D) It only works with SQLite
55. Explanation: Alembic is the standard SQLAlchemy migration tool; `alembic revision --autogenerate` produces upgrade/downgrade scripts you should review.
56. Q9: A symptom of an N+1 problem is?
57. A) One slow query
58. B) High CPU on the DB
59. C) Many quick queries in the logs when fetching a list (*)
60. D) Disk full
61. Explanation: N+1 looks like 1 + N small fast queries in pg_stat_statements or app logs; the count grows with the list size.
62. Q10: Prisma's `include: { payments: true }` is the equivalent of?
63. A) lazyload
64. B) raw SQL
65. C) a transaction
66. D) joinedload or selectinload (eager loading) — fixes N+1 (*)
67. Explanation: Prisma's include generates a JOIN or a separate IN query, depending on strategy; either way it eagerly loads the relation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the N+1 query problem?
  options:
    - One query that returns 1 row
    - A nested subquery
    - A list query plus one extra query per row to fetch a relation
    - A query that uses N indexes
  correctIndex: 2
  explanation: Loading N parents then issuing one query per parent for a child relation = N+1 total queries; fix with eager loading.
- id: q2
  question: Which is the SQL injection-safe pattern?
  options:
    - f"WHERE name = '{user_input}'"
    - String concatenation with escaping
    - Reading input from a file
    - Parameterized queries with placeholders bound by the driver
  correctIndex: 3
  explanation: Placeholders ($1, ?) are bound by the driver; values never become SQL syntax. Concatenation — even with escaping — is fragile.
- id: q3
  question: In SQLAlchemy, which option loads a relation with one extra IN query?
  options:
    - selectinload
    - lazyload
    - subquery
    - noload
  correctIndex: 0
  explanation: selectinload issues one SELECT ... WHERE id IN (...) after the parent query; joinedload uses a JOIN. Both fix N+1.
- id: q4
  question: What does PgBouncer transaction mode release?
  options:
    - The query plan
    - The server connection at COMMIT/ROLLBACK, allowing multiplexing
    - The client connection
    - Locks
  correctIndex: 1
  explanation: In transaction mode, the server connection is returned to the pool at txn end; many clients share few server connections. Session features (LISTEN, advisory locks) don't work.
- id: q5
  question: Why avoid long transactions in web requests?
  options:
    - They violate SQL standard
    - They always deadlock
    - They hold a pooled connection while waiting on slow external calls
    - They disable indexes
  correctIndex: 2
  explanation: Holding a transaction across an external API call keeps a scarce connection out of the pool; move the call outside the transaction.
- id: q6
  question: Expand-then-contract migration pattern means?
  options:
    - Drop then recreate
    - Use VACUUM FULL
    - Restart Postgres
    - Add structure, backfill, switch reads, then drop the old — zero downtime
  correctIndex: 3
  explanation: "Each step is non-breaking: add nullable column, backfill, deploy app using new column, then drop the old in a later migration."
- id: q7
  question: Why might a prepared statement become slower after 5 executions in Postgres 12+?
  options:
    - The planner may switch to a generic plan that's worse for skewed data
    - It's cached incorrectly
    - It always uses seq scan
    - It disables indexes
  correctIndex: 0
  explanation: After 5 custom-plan executions, Postgres may pick a generic plan; for skewed data this can be much slower. Force custom with plan_cache_mode (PG16+).
- id: q8
  question: Which is TRUE about Alembic?
  options:
    - It's a NoSQL ORM
    - It generates Python migration scripts from SQLAlchemy model changes; supports upgrade/downgrade
    - It replaces PgBouncer
    - It only works with SQLite
  correctIndex: 1
  explanation: Alembic is the standard SQLAlchemy migration tool; `alembic revision --autogenerate` produces upgrade/downgrade scripts you should review.
- id: q9
  question: A symptom of an N+1 problem is?
  options:
    - One slow query
    - High CPU on the DB
    - Many quick queries in the logs when fetching a list
    - Disk full
  correctIndex: 2
  explanation: N+1 looks like 1 + N small fast queries in pg_stat_statements or app logs; the count grows with the list size.
- id: q10
  question: "Prisma's `include: { payments: true }` is the equivalent of?"
  options:
    - lazyload
    - raw SQL
    - a transaction
    - joinedload or selectinload (eager loading) — fixes N+1
  correctIndex: 3
  explanation: Prisma's include generates a JOIN or a separate IN query, depending on strategy; either way it eagerly loads the relation.
```

