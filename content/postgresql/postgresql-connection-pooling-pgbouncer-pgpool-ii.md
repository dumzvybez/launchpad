---
slug: postgresql-connection-pooling-pgbouncer-pgpool-ii
id: postgresql-19
track: postgresql
order: 19
title: Connection Pooling — PgBouncer, Pgpool-II
description: Use PgBouncer for lightweight connection pooling in transaction mode, and understand Pgpool-II for load balancing, query routing, and parallel query.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14&t=2400s
whyItMatters: Use PgBouncer for lightweight connection pooling in transaction mode, and understand Pgpool-II for load balancing, query routing, and parallel query.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Connection Pooling — PgBouncer, Pgpool-II

## Connection Pooling — PgBouncer, Pgpool-II

### Why It Matters

Use PgBouncer for lightweight connection pooling in transaction mode, and understand Pgpool-II for load balancing, query routing, and parallel query.

Use PgBouncer for lightweight connection pooling in transaction mode, and understand Pgpool-II for load balancing, query routing, and parallel query.

### Prerequisites

- Stage 2: psql, createdb, and Database Administration Basics
- Stage 13: Transactions, Isolation Levels, and MVCC

### Topics

- Why connection pooling matters: Postgres connections are heavyweight (fork+exec per backend)
- PgBouncer: session, transaction, statement pooling modes
- PgBouncer config: max_client_conn, pool_size, default_pool_size, reserve_pool
- Authentication: scram-sha-256, auth_file, user-level overrides
- Prepared statements and PgBouncer: the named-statement problem in transaction mode
- Pgpool-II: load balancing, replication, parallel query
- When to use PgBouncer vs Pgpool-II vs a pool in your app (SQLAlchemy, asyncpg)
- Monitoring: SHOW POOLS, SHOW CLIENTS, SHOW STATS in PgBouncer

### Key Concepts

- Postgres forks a process per connection — expensive (memory + context-switch); 1000+ idle connections waste RAM and slow the planner (PG14+ improved this, but pooling is still essential).
- PgBouncer is a lightweight (event-loop) pooler that multiplexes many client connections onto fewer server connections; the standard for Postgres connection pooling.
- Transaction mode (default) is the most efficient — a server connection is assigned per transaction, returned at COMMIT/ROLLBACK. Session mode is less efficient but compatible with session-level features.
- Prepared statements break transaction mode — a named prepared statement is bound to a server connection; PgBouncer 1.21+ supports protocol-level prepared statement tracking (level=protocol); otherwise use `prepared_statement_cache_size = 0` or statement mode.
- `SET` and session variables break transaction mode — use `SET LOCAL` (transaction-scoped) instead of `SET` (session-scoped) for app.tenant_id and similar.
- Pgpool-II is heavier: load balancing, query routing, replication, parallel query. Use it when you need those features; for pure pooling, PgBouncer is lighter and faster.
- The right pattern: PgBouncer in front of a Postgres primary + read-replicas for read scaling; the app connects to PgBouncer, which routes writes to primary and reads to replicas (or use a separate pooler DSN per role).

### Common Pitfalls

- Using `SET` instead of `SET LOCAL` in transaction mode — SET persists across the session but the backend changes per transaction; use SET LOCAL (transaction-scoped) for app.tenant_id and similar.
- Named prepared statements in transaction mode pre-PgBouncer-1.21 — "prepared statement does not exist" errors; upgrade PgBouncer to 1.21+ with max_prepared_statements, or disable named statements in the driver.
- Pool size too small — default_pool_size of 25 may bottleneck high-concurrency apps; monitor SHOW POOLS sv_active vs sv_idle and bump pool_size, but watch server memory (each backend ~10MB).
- Pool size too large — 1000s of server connections waste RAM and slow the planner; Postgres backends are heavyweight (fork+exec). Cap total backends around 200-500 per server.
- Connecting directly to Postgres instead of PgBouncer for writes — defeats pooling; route all traffic through PgBouncer, with separate DSNs for primary and replica if you do read/write splitting.

### Real-World Applications

- Discord uses PgBouncer extensively to multiplex millions of client connections onto hundreds of Postgres backends per shard.
- Reddit uses PgBouncer in transaction mode in front of every Postgres shard for connection management.
- Spotify uses PgBouncer to pool connections from hundreds of microservices onto shared Postgres clusters.
- Twitch uses PgBouncer for chat-event ingestion, with max_client_conn in the tens of thousands per pooler.

### Interview Questions

- 1. Why does Postgres need a connection pooler? — Postgres forks a process per connection (heavyweight, ~10MB each); 1000+ idle connections waste RAM and slow planning. PgBouncer multiplexes onto fewer backends.
- 2. What's the difference between session, transaction, and statement pooling? — Session holds a backend for the whole client session; transaction releases at COMMIT (most efficient); statement releases after each statement (breaks transactions).
- 3. Why do prepared statements break transaction mode? — A named prepared statement is bound to a specific backend; PgBouncer 1.21+ tracks them per client (max_prepared_statements), otherwise you get "prepared statement does not exist".
- 4. Why use `SET LOCAL` instead of `SET` in transaction mode? — SET persists across the session but the backend changes per transaction; SET LOCAL scopes to the current transaction and is cleaned up at COMMIT.
- 5. When would you use Pgpool-II over PgBouncer? — When you need load balancing, query routing, parallel query, or replication features; for pure pooling, PgBouncer is lighter and faster.

### Mini Project

Build a PgBouncer Deployment: A `docker-compose.yml` with Postgres 16, PgBouncer in transaction mode, and a Python asyncpg app. Configure (1) scram-sha-256 auth, (2) max_client_conn=1000, default_pool_size=25, (3) max_prepared_statements=100 (PG 1.21+), (4) SHOW POOLS monitoring. Demonstrate 1000 concurrent clients sharing 25 server connections. Suggested approach:
  - Postgres 16 with `max_connections=200` (PgBouncer caps at 25 per pool)
  - PgBouncer 1.21+ config with pool_mode=transaction and max_prepared_statements=100
  - auth_type=scram-sha-256; userlist.txt with hash from `pg_password`
  - Python asyncpg app with `statement_cache_size=100` (uses named prepared statements, tracked by PgBouncer)
  - Load test with 1000 concurrent SELECTs; verify SHOW POOLS shows sv_active <= 25

### Exercises

1. Install PgBouncer; configure it in transaction mode in front of Postgres; connect via psql -p 6432 and verify SHOW POOLS works.
2. Open 100 psql connections to PgBouncer; verify Postgres shows only ~25 (default_pool_size) backends via pg_stat_activity.
3. Use SET app.tenant_id = '42' in transaction mode; observe the variable is missing in a subsequent query (use SET LOCAL instead and verify it works).
4. Configure a Python app to use named prepared statements through PgBouncer 1.21+; verify SHOW STATS shows prepared statement tracking.
5. Set max_client_conn too low; observe clients get "no more connections allowed"; bump it and verify they connect.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why does Postgres need a connection pooler like PgBouncer?
9. A) Postgres is single-threaded
10. B) PgBouncer is faster at executing queries
11. C) Postgres forks a process per connection (heavyweight, ~10MB each); pooling multiplexes clients onto fewer backends (*)
12. D) Postgres can't handle more than 100 connections
13. Explanation: Each Postgres backend is a forked process with its own memory; thousands of idle connections waste RAM and slow planning. PgBouncer multiplexes many client connections onto a smaller pool of server connections.
14. Q2: Which PgBouncer pool mode is most efficient for typical web apps?
15. A) session
16. B) statement
17. C) smart
18. D) transaction (*)
19. Explanation: Transaction mode assigns a server connection per transaction and returns it at COMMIT/ROLLBACK; it's the most efficient and works for most web apps that use short transactions.
20. Q3: Why do named prepared statements break transaction mode in older PgBouncer?
21. A) A named prepared statement is bound to a specific backend; the backend changes per transaction (*)
22. B) They are too slow
23. C) They use too much memory
24. D) They can't be parameterized
25. Explanation: PgBouncer pre-1.21 returns "prepared statement does not exist" because the underlying backend changed. PgBouncer 1.21+ tracks prepared statements per client (max_prepared_statements > 0).
26. Q4: Why use SET LOCAL instead of SET in transaction mode?
27. A) SET LOCAL is faster
28. B) SET persists across the session but the backend changes per transaction; SET LOCAL scopes to the current txn (*)
29. C) SET is deprecated
30. D) SET LOCAL uses less memory
31. Explanation: SET writes to the session's GUC memory, but the backend changes after COMMIT; the next query runs on a different backend with the variable unset. SET LOCAL scopes the variable to the current transaction.
32. Q5: What does SHOW POOLS display in PgBouncer?
33. A) Connected clients only
34. B) Slow queries
35. C) Per-database pool stats: cl_active, cl_waiting, sv_active, sv_idle, sv_used (*)
36. D) Server logs
37. Explanation: SHOW POOLS shows client-side and server-side connection counts per pool; sv_active vs default_pool_size tells you if the pool is saturated. SHOW CLIENTS shows individual clients; SHOW STATS shows totals.
38. Q6: Which is TRUE about pool_size?
39. A) Bigger is always better
40. B) It must equal max_client_conn
41. C) It's auto-tuned
42. D) Too small bottlenecks concurrency; too large wastes server RAM and slows planning (cap ~200-500 backends per server) (*)
43. Explanation: Each backend is ~10MB; 1000 backends is ~10GB just for connections. Cap total backends per server around 200-500; let PgBouncer multiplex many clients onto them.
44. Q7: When would you use Pgpool-II over PgBouncer?
45. A) When you need load balancing, query routing, replication, or parallel query (*)
46. B) Always
47. C) Never
48. D) For single-node Postgres
49. Explanation: Pgpool-II is heavier but adds load balancing, query routing (writes to primary, reads to replicas), replication, and parallel query. For pure pooling, PgBouncer is lighter and faster.
50. Q8: What does the `auth_file` in pgbouncer.ini contain?
51. A) SSL certificates
52. B) Username + password hash pairs for client authentication (*)
53. C) Postgres config
54. D) Query logs
55. Explanation: auth_file (userlist.txt) contains `"user" "password-hash"` lines; the hash format depends on auth_type (scram-sha-256 uses SCRAM-SHA-256$... format). Generate with the pg_password utility or by querying pg_authid.
56. Q9: Which is a PgBouncer maintenance command?
57. A) STOP and START
58. B) DROP and CREATE
59. C) PAUSE and RESUME — pause client connections for maintenance (*)
60. D) KILL and REVIVE
61. Explanation: PAUSE stops new client queries and waits for active ones to finish (for online schema migrations or failover); RESUME resumes. RELOAD reloads the config without disconnecting clients.
62. Q10: What's a sign that your PgBouncer pool_size is too small?
63. A) sv_active is consistently below default_pool_size
64. B) sv_idle is consistently > 0
65. C) total_xact_count is high
66. D) cl_waiting is consistently > 0 and query_wait_timeout fires (*)
67. Explanation: cl_waiting > 0 means clients are queued waiting for a backend; if query_wait_timeout fires, queries are failing. Bump default_pool_size (within server memory limits) or add more Postgres replicas.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why does Postgres need a connection pooler like PgBouncer?
  options:
    - Postgres is single-threaded
    - PgBouncer is faster at executing queries
    - Postgres forks a process per connection (heavyweight, ~10MB each); pooling multiplexes clients onto fewer backends
    - Postgres can't handle more than 100 connections
  correctIndex: 2
  explanation: Each Postgres backend is a forked process with its own memory; thousands of idle connections waste RAM and slow planning. PgBouncer multiplexes many client connections onto a smaller pool of server connections.
- id: q2
  question: Which PgBouncer pool mode is most efficient for typical web apps?
  options:
    - session
    - statement
    - smart
    - transaction
  correctIndex: 3
  explanation: Transaction mode assigns a server connection per transaction and returns it at COMMIT/ROLLBACK; it's the most efficient and works for most web apps that use short transactions.
- id: q3
  question: Why do named prepared statements break transaction mode in older PgBouncer?
  options:
    - A named prepared statement is bound to a specific backend; the backend changes per transaction
    - They are too slow
    - They use too much memory
    - They can't be parameterized
  correctIndex: 0
  explanation: PgBouncer pre-1.21 returns "prepared statement does not exist" because the underlying backend changed. PgBouncer 1.21+ tracks prepared statements per client (max_prepared_statements > 0).
- id: q4
  question: Why use SET LOCAL instead of SET in transaction mode?
  options:
    - SET LOCAL is faster
    - SET persists across the session but the backend changes per transaction; SET LOCAL scopes to the current txn
    - SET is deprecated
    - SET LOCAL uses less memory
  correctIndex: 1
  explanation: SET writes to the session's GUC memory, but the backend changes after COMMIT; the next query runs on a different backend with the variable unset. SET LOCAL scopes the variable to the current transaction.
- id: q5
  question: What does SHOW POOLS display in PgBouncer?
  options:
    - Connected clients only
    - Slow queries
    - "Per-database pool stats: cl_active, cl_waiting, sv_active, sv_idle, sv_used"
    - Server logs
  correctIndex: 2
  explanation: SHOW POOLS shows client-side and server-side connection counts per pool; sv_active vs default_pool_size tells you if the pool is saturated. SHOW CLIENTS shows individual clients; SHOW STATS shows totals.
- id: q6
  question: Which is TRUE about pool_size?
  options:
    - Bigger is always better
    - It must equal max_client_conn
    - It's auto-tuned
    - Too small bottlenecks concurrency; too large wastes server RAM and slows planning (cap ~200-500 backends per server)
  correctIndex: 3
  explanation: Each backend is ~10MB; 1000 backends is ~10GB just for connections. Cap total backends per server around 200-500; let PgBouncer multiplex many clients onto them.
- id: q7
  question: When would you use Pgpool-II over PgBouncer?
  options:
    - When you need load balancing, query routing, replication, or parallel query
    - Always
    - Never
    - For single-node Postgres
  correctIndex: 0
  explanation: Pgpool-II is heavier but adds load balancing, query routing (writes to primary, reads to replicas), replication, and parallel query. For pure pooling, PgBouncer is lighter and faster.
- id: q8
  question: What does the `auth_file` in pgbouncer.ini contain?
  options:
    - SSL certificates
    - Username + password hash pairs for client authentication
    - Postgres config
    - Query logs
  correctIndex: 1
  explanation: auth_file (userlist.txt) contains `"user" "password-hash"` lines; the hash format depends on auth_type (scram-sha-256 uses SCRAM-SHA-256$... format). Generate with the pg_password utility or by querying pg_authid.
- id: q9
  question: Which is a PgBouncer maintenance command?
  options:
    - STOP and START
    - DROP and CREATE
    - PAUSE and RESUME — pause client connections for maintenance
    - KILL and REVIVE
  correctIndex: 2
  explanation: PAUSE stops new client queries and waits for active ones to finish (for online schema migrations or failover); RESUME resumes. RELOAD reloads the config without disconnecting clients.
- id: q10
  question: What's a sign that your PgBouncer pool_size is too small?
  options:
    - sv_active is consistently below default_pool_size
    - sv_idle is consistently > 0
    - total_xact_count is high
    - cl_waiting is consistently > 0 and query_wait_timeout fires
  correctIndex: 3
  explanation: cl_waiting > 0 means clients are queued waiting for a backend; if query_wait_timeout fires, queries are failing. Bump default_pool_size (within server memory limits) or add more Postgres replicas.
```

