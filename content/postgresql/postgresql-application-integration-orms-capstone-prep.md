---
slug: postgresql-application-integration-orms-capstone-prep
id: postgresql-20
track: postgresql
order: 20
title: Application Integration, ORMs, and Capstone Prep
description: Connect applications to Postgres via drivers and ORMs (SQLAlchemy, asyncpg, Prisma, Diesel), use parameterized queries everywhere, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14&t=3000s
whyItMatters: Connect applications to Postgres via drivers and ORMs (SQLAlchemy, asyncpg, Prisma, Diesel), use parameterized queries everywhere, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Application Integration, ORMs, and Capstone Prep

## Application Integration, ORMs, and Capstone Prep

### Why It Matters

Connect applications to Postgres via drivers and ORMs (SQLAlchemy, asyncpg, Prisma, Diesel), use parameterized queries everywhere, and prepare for the capstone project.

Connect applications to Postgres via drivers and ORMs (SQLAlchemy, asyncpg, Prisma, Diesel), use parameterized queries everywhere, and prepare for the capstone project.

### Prerequisites

- All 19 prior stages (especially Stage 15 Security and Stage 19 Connection Pooling)

### Topics

- Drivers: asyncpg (fastest Python), psycopg3 (modern, libpq-based), node-postgres, pgx (Go), Rust sqlx
- ORMs: SQLAlchemy 2.0 (async), Prisma (TypeScript), Diesel (Rust), Django ORM, ActiveRecord
- Parameterized queries: the ONLY way to write dynamic SQL safely
- Connection strings and DSNs:postgresql://user:pass@host:port/db?sslmode=require
- SSL/TLS: sslmode=disable/allow/prefer/require/verify-ca/verify-full
- Health checks, pre-ping, statement_timeout, idle_in_transaction_session_timeout
- Schema migrations: Alembic (SQLAlchemy), Prisma Migrate, sqitch, raw SQL with expand-contract
- Capstone prep: review RLS, partitioning, indexes, materialized views, PITR

### Key Concepts

- Parameterized queries are non-negotiable — string concatenation is the SQL injection vector. Every driver supports `cursor.execute(sql, (params,))`; never use f-strings or % formatting for values.
- asyncpg is the fastest Postgres driver for Python (5-10× psycopg2 for high-throughput); psycopg3 is the modern libpq-based alternative with both sync and async APIs.
- SQLAlchemy 2.0 has a unified async API (`async_session.execute(select(User).where(...))`); use the Core for performance-critical queries and the ORM for CRUD.
- sslmode=verify-full is the only truly safe TLS mode (verifies hostname + CA); `require` encrypts but doesn't verify identity (MITM-able); `prefer` falls back to plaintext.
- statement_timeout (per-session) is essential — without it, a slow query can hold locks and cause cascading failures. Set `SET LOCAL statement_timeout = '5s'` for user-facing endpoints.
- idle_in_transaction_session_timeout (PG14+ default 0 = off) kills stuck idle-in-txn sessions; set to a few minutes in production to prevent bloat.
- Migrations should follow expand-then-contract: add the new column, backfill, switch reads, then in a later deployment drop the old column. Never rewrite a hot table in one migration.

```python
# Python with psycopg3 — parameterized:
with conn.cursor() as cur:
    cur.execute(
        "SELECT id, name FROM users WHERE email = %s AND active = %s",
        (email, True)             # bound as parameters, not interpolated
    )
    rows = cur.fetchall()

# WRONG — string concatenation (SQL injection!):
# cur.execute(f"SELECT * FROM users WHERE email = '{email}'")   # NEVER

# asyncpg uses $1, $2 style:
async with pool.acquire() as conn:
    rows = await conn.fetch(
        "SELECT id, name FROM users WHERE email = $1 AND active = $2",
        email, True
    )
```
Caption: Parameterized queries — the ONLY safe way

### Common Pitfalls

- String-concatenating SQL — the #1 cause of SQL injection; ALWAYS use parameterized queries (`cursor.execute(sql, (params,))`). No exceptions.
- Using sslmode=require instead of verify-full — `require` encrypts but doesn't verify the server identity (MITM-able); use `verify-full` for production.
- Forgetting statement_timeout — a slow query can hold locks and cause cascading failures; set per-session `SET LOCAL statement_timeout = '5s'` for user-facing endpoints.
- Long-running idle-in-transaction sessions — they hold snapshots and cause bloat; set `idle_in_transaction_session_timeout = '5min'` globally.
- Rewriting a hot table in one migration — adding a NOT NULL column without a default rewrites the table on PG < 11 (and locks it); use expand-then-contract (add with default, backfill, switch, drop old).

### Real-World Applications

- Instagram uses asyncpg and SQLAlchemy for high-throughput Python services against Postgres shards.
- Discord uses Rust sqlx and Go pgx for chat ingestion at millions of QPS against Postgres.
- Reddit uses SQLAlchemy with PgBouncer for transaction-mode pooling across hundreds of services.
- Spotify uses Prisma (TypeScript) for newer microservices against Postgres, with raw SQL for performance-critical queries.

### Interview Questions

- 1. Why are parameterized queries mandatory? — String concatenation is the SQL injection vector; parameterized queries separate SQL from data, preventing injection entirely. No exceptions.
- 2. What's the difference between sslmode=require and verify-full? — require encrypts but doesn't verify identity (MITM-able); verify-full verifies hostname + CA (truly safe TLS).
- 3. Why set statement_timeout? — Without it, a slow query can hold locks and cause cascading failures; set per-session for user-facing endpoints (e.g. 5s).
- 4. What's expand-then-contract? — A migration pattern: add new column (with default), backfill, switch app reads, drop old column in a later deploy. Avoids rewriting hot tables.
- 5. When would you use asyncpg over psycopg3? — asyncpg is 5-10× faster for high-throughput Python (no libpq overhead); psycopg3 is better if you need libpq features (e.g. advanced COPY, pgpass).

### Mini Project

Build a Multi-Tenant API Skeleton: A FastAPI app with asyncpg, PgBouncer, RLS (per-request SET LOCAL app.tenant_id), parameterized queries everywhere, statement_timeout per session, and an Alembic migration that adds a column using expand-then-contract. Capstone prep: review your RLS, indexes, materialized views, and PITR plan. Suggested approach:
  - FastAPI app with asyncpg and a connection pool
  - Dependency that opens a transaction, SET LOCAL app.tenant_id, yields the txn
  - All queries parameterized (no f-strings)
  - connect_args sets statement_timeout=5000 and idle_in_transaction_session_timeout=300000
  - Alembic migration: add post.slug text NOT NULL DEFAULT '' (metadata-only on PG11+)
  - Backfill script in batches of 1000
  - Verify the capstone checklist: schema, RLS, indexes, MV, PITR

### Exercises

1. Write a parameterized query in asyncpg and a wrong f-string version; demonstrate a SQL injection attack on the f-string version (e.g. email = "x' OR '1'='1").
2. Connect with sslmode=verify-full and a self-signed cert; verify it works; try with sslmode=require and observe it doesn't verify identity.
3. Set statement_timeout = '2s' for a session; run a slow query (pg_sleep(5)); verify it aborts after 2s.
4. Use Alembic to add a NOT NULL column with a default to a 1M-row table; verify it's fast (metadata-only on PG11+); then backfill in batches.
5. Build a FastAPI endpoint that sets app.tenant_id via SET LOCAL in a transaction; verify RLS filters rows correctly.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why are parameterized queries mandatory?
9. A) They are faster
10. B) They use less memory
11. C) They are required by Postgres
12. D) String concatenation is the SQL injection vector; parameterized queries separate SQL from data (*)
13. Explanation: Parameterized queries send SQL and data separately; the server never parses parameters as SQL, so injection is impossible. No exceptions — even "trusted" input should be parameterized.
14. Q2: What's the difference between sslmode=require and verify-full?
15. A) require encrypts but doesn't verify identity (MITM-able); verify-full verifies hostname + CA (*)
16. B) They are identical
17. C) require is more secure
18. D) verify-full doesn't encrypt
19. Explanation: require ensures TLS but accepts any certificate (MITM-able); verify-ca verifies the CA but not the hostname; verify-full verifies both — the only truly safe mode for production.
20. Q3: Why set statement_timeout per session?
21. A) To speed up queries
22. B) A slow query can hold locks and cause cascading failures; cap user-facing queries at e.g. 5s (*)
23. C) To reduce memory use
24. D) To disable WAL
25. Explanation: Without a timeout, a single slow query can hold row/table locks, block other queries, and snowball into an outage. Set per-session for user-facing endpoints (5s), longer for batch jobs.
26. Q4: What's expand-then-contract in migrations?
27. A) Drop and recreate the table
28. B) Use pg_dump and restore
29. C) Add the new column, backfill, switch reads, drop old column in a later deploy (*)
30. D) VACUUM FULL
31. Explanation: Expand (add new with default — metadata-only on PG11+), backfill in batches, switch app reads to new column, contract (drop old) in a separate deploy. Avoids rewriting or locking hot tables.
32. Q5: Which is the fastest Postgres driver for Python?
33. A) psycopg2
34. B) sqlite3
35. C) pyodbc
36. D) asyncpg (*)
37. Explanation: asyncpg is 5-10× faster than psycopg2 for high-throughput workloads (no libpq overhead, native async). psycopg3 is the modern libpq-based alternative with both sync and async APIs.
38. Q6: What does pool_pre_ping=True do in SQLAlchemy?
39. A) Sends a SELECT 1 before each checkout to detect dead connections (*)
40. B) Disables the pool
41. C) Adds SSL
42. D) Sets a statement timeout
43. Explanation: pool_pre_ping runs a lightweight SELECT 1 before reusing a connection; if it fails, the connection is recycled. Prevents "connection already closed" errors after idle timeouts or failovers.
44. Q7: Which is the right way to set per-request RLS context in transaction mode?
45. A) SET app.tenant_id = '42' (session-scoped)
46. B) SET LOCAL app.tenant_id = '42' inside a transaction (*)
47. C) Use a global variable
48. D) Hardcode the tenant_id in queries
49. Explanation: SET LOCAL scopes the variable to the current transaction; the underlying backend changes per transaction (PgBouncer), so SET (session) would be lost. Wrap each request in BEGIN ... SET LOCAL ... queries ... COMMIT.
50. Q8: What does idle_in_transaction_session_timeout do?
51. A) Limits total connections
52. B) Sets a query timeout
53. C) Kills stuck idle-in-txn sessions to prevent bloat (*)
54. D) Disables transactions
55. Explanation: idle_in_transaction_session_timeout (PG14+ default 0=off) aborts sessions that stay idle-in-transaction longer than the threshold; set to a few minutes in production to prevent bloat from leaked transactions.
56. Q9: Which migration tool is paired with SQLAlchemy?
57. A) Prisma Migrate
58. B) sqitch
59. C) Flyway
60. D) Alembic (*)
61. Explanation: Alembic is SQLAlchemy's migration tool; it generates migrations from model changes (autogenerate) and supports expand-then-contract workflows. Prisma Migrate is for Prisma (TypeScript); sqitch is database-agnostic.
62. Q10: Why is rewriting a hot table in one migration dangerous?
63. A) It locks the table for the duration, blocking reads/writes; use expand-then-contract (*)
64. B) It uses too much CPU
65. C) It can't be rolled back
66. D) It requires superuser
67. Explanation: Adding a NOT NULL column without a default rewrites the table (PG < 11) and takes an AccessExclusiveLock; on PG11+ a default makes it metadata-only. Always expand (add with default), backfill, then contract (drop old).
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Why are parameterized queries mandatory?
  options:
    - They are faster
    - They use less memory
    - They are required by Postgres
    - String concatenation is the SQL injection vector; parameterized queries separate SQL from data
  correctIndex: 3
  explanation: Parameterized queries send SQL and data separately; the server never parses parameters as SQL, so injection is impossible. No exceptions — even "trusted" input should be parameterized.
- id: q2
  question: What's the difference between sslmode=require and verify-full?
  options:
    - require encrypts but doesn't verify identity (MITM-able); verify-full verifies hostname + CA
    - They are identical
    - require is more secure
    - verify-full doesn't encrypt
  correctIndex: 0
  explanation: require ensures TLS but accepts any certificate (MITM-able); verify-ca verifies the CA but not the hostname; verify-full verifies both — the only truly safe mode for production.
- id: q3
  question: Why set statement_timeout per session?
  options:
    - To speed up queries
    - A slow query can hold locks and cause cascading failures; cap user-facing queries at e.g. 5s
    - To reduce memory use
    - To disable WAL
  correctIndex: 1
  explanation: Without a timeout, a single slow query can hold row/table locks, block other queries, and snowball into an outage. Set per-session for user-facing endpoints (5s), longer for batch jobs.
- id: q4
  question: What's expand-then-contract in migrations?
  options:
    - Drop and recreate the table
    - Use pg_dump and restore
    - Add the new column, backfill, switch reads, drop old column in a later deploy
    - VACUUM FULL
  correctIndex: 2
  explanation: Expand (add new with default — metadata-only on PG11+), backfill in batches, switch app reads to new column, contract (drop old) in a separate deploy. Avoids rewriting or locking hot tables.
- id: q5
  question: Which is the fastest Postgres driver for Python?
  options:
    - psycopg2
    - sqlite3
    - pyodbc
    - asyncpg
  correctIndex: 3
  explanation: asyncpg is 5-10× faster than psycopg2 for high-throughput workloads (no libpq overhead, native async). psycopg3 is the modern libpq-based alternative with both sync and async APIs.
- id: q6
  question: What does pool_pre_ping=True do in SQLAlchemy?
  options:
    - Sends a SELECT 1 before each checkout to detect dead connections
    - Disables the pool
    - Adds SSL
    - Sets a statement timeout
  correctIndex: 0
  explanation: pool_pre_ping runs a lightweight SELECT 1 before reusing a connection; if it fails, the connection is recycled. Prevents "connection already closed" errors after idle timeouts or failovers.
- id: q7
  question: Which is the right way to set per-request RLS context in transaction mode?
  options:
    - SET app.tenant_id = '42' (session-scoped)
    - SET LOCAL app.tenant_id = '42' inside a transaction
    - Use a global variable
    - Hardcode the tenant_id in queries
  correctIndex: 1
  explanation: SET LOCAL scopes the variable to the current transaction; the underlying backend changes per transaction (PgBouncer), so SET (session) would be lost. Wrap each request in BEGIN ... SET LOCAL ... queries ... COMMIT.
- id: q8
  question: What does idle_in_transaction_session_timeout do?
  options:
    - Limits total connections
    - Sets a query timeout
    - Kills stuck idle-in-txn sessions to prevent bloat
    - Disables transactions
  correctIndex: 2
  explanation: idle_in_transaction_session_timeout (PG14+ default 0=off) aborts sessions that stay idle-in-transaction longer than the threshold; set to a few minutes in production to prevent bloat from leaked transactions.
- id: q9
  question: Which migration tool is paired with SQLAlchemy?
  options:
    - Prisma Migrate
    - sqitch
    - Flyway
    - Alembic
  correctIndex: 3
  explanation: Alembic is SQLAlchemy's migration tool; it generates migrations from model changes (autogenerate) and supports expand-then-contract workflows. Prisma Migrate is for Prisma (TypeScript); sqitch is database-agnostic.
- id: q10
  question: Why is rewriting a hot table in one migration dangerous?
  options:
    - It locks the table for the duration, blocking reads/writes; use expand-then-contract
    - It uses too much CPU
    - It can't be rolled back
    - It requires superuser
  correctIndex: 0
  explanation: Adding a NOT NULL column without a default rewrites the table (PG < 11) and takes an AccessExclusiveLock; on PG11+ a default makes it metadata-only. Always expand (add with default), backfill, then contract (drop old).
```

