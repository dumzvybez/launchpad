---
slug: postgresql-psql-createdb-database-administration-basics
id: postgresql-02
track: postgresql
order: 2
title: psql, createdb, and Database Administration Basics
description: Master the psql CLI and the createdb/createuser/dropdb shell tools, learn to read postgresql.conf and pg_hba.conf, and operate a Postgres cluster day-to-day.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=1200s
whyItMatters: Master the psql CLI and the createdb/createuser/dropdb shell tools, learn to read postgresql. conf and pg_hba.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# psql, createdb, and Database Administration Basics

## psql, createdb, and Database Administration Basics

### Why It Matters

Master the psql CLI and the createdb/createuser/dropdb shell tools, learn to read postgresql. conf and pg_hba.

Master the psql CLI and the createdb/createuser/dropdb shell tools, learn to read postgresql.conf and pg_hba.conf, and operate a Postgres cluster day-to-day.

### Prerequisites

- Stage 1: Getting Started with PostgreSQL
- A working Postgres 16 install you can connect to as superuser.

### Topics

- psql power features: \e (editor), \i (file), \o (output), \copy, \timing, \x (expanded), \watch, \gexec
- createdb / dropdb / createuser / dropuser shell wrappers
- pg_ctl, pg_ctlcluster (Debian/Ubuntu), brew services (macOS) — start, stop, reload, status
- postgresql.conf key settings: shared_buffers, work_mem, max_connections, wal_level, listen_addresses
- pg_hba.conf: host, local, scram-sha-256 vs md5 vs trust, reload with `pg_ctl reload`
- SHOW, ALTER SYSTEM, and pg_file_settings for safe config changes
- The pg_stat_activity view: who is connected, what they're running, blocking
- Server-side COPY vs psql \copy (permissions and file ownership)

### Key Concepts

- psql is the single most important Postgres tool — every DBA and backend engineer should be fluent in its meta-commands.
- `ALTER SYSTEM SET ... = ...;` writes to postgresql.auto.conf (not postgresql.conf) and is the safe way to change settings without shell access; reload with `SELECT pg_reload_conf();`.
- pg_hba.conf controls authentication (who can connect, from where, by what method); changes require a reload, not a restart, except for some settings.
- shared_buffers is typically 25% of system RAM; work_mem is per-sort/hash, not global, so set it conservatively (4-16MB) and bump per-session for big queries.
- scram-sha-256 is the modern password hashing default (PG10+); md5 is deprecated; trust should never appear in production.
- pg_stat_activity is the live query inspector — `state = 'active'` shows currently running SQL; long `idle in transaction` connections are a footgun.

```sql
\timing on                -- show query durations
\x on                     -- expanded (vertical) output for wide rows
\i /tmp/setup.sql         -- run a SQL file
\o /tmp/out.csv           -- redirect output to a file
\copy (SELECT * FROM book) TO '/tmp/book.csv' WITH CSV HEADER
\o                        -- close the redirect
\watch 5                  -- re-run the last query every 5 seconds
\ef                       -- edit the last function in $EDITOR
SELECT * FROM pg_stat_activity WHERE state = 'active';
```
Caption: psql meta-commands in action

### Common Pitfalls

- Setting `work_mem` too high globally — work_mem is per-sort/hash operation per backend, so 100MB × 100 connections × 5 sorts = 50GB; keep the default low (4-16MB) and bump per-session for big queries.
- Using `trust` in pg_hba.conf on production — anyone with network access can connect as any user (including `postgres`) without a password; never use trust outside of local dev.
- Editing postgresql.conf by hand on Debian/Ubuntu — the distro layout splits config across `postgresql.conf`, `pg_hba.conf`, and `conf.d/`; use `ALTER SYSTEM` or a conf.d drop-in to keep changes auditable.
- Leaving long `idle in transaction` sessions open — they hold snapshots, block VACUUM, and cause bloat; set `idle_in_transaction_session_timeout` to a few minutes in production.
- Forgetting to reload after editing pg_hba.conf — `ALTER SYSTEM` and `pg_ctl reload` are no-restart; some settings (shared_buffers, max_connections, wal_level) still need a full restart.

### Real-World Applications

- Discord's backend relies on psql and pg_stat_activity for real-time triage during incidents affecting millions of concurrent users.
- Stripe engineers use `\copy` to extract slices of ledger data for compliance audits without locking hot tables.
- GitHub's DBAs script createdb and role provisioning via Ansible so every new repository shard has identical security baselines.
- Apple's iCloud services use Postgres with strict pg_hba.conf and TLS-only connections for sensitive user-data backends.

### Interview Questions

- 1. What's the difference between `work_mem` and `shared_buffers`? — shared_buffers is the global Postgres page cache (~25% RAM); work_mem is per-sort/hash per backend and should be conservative globally.
- 2. How do you safely change a config setting that requires a restart? — `ALTER SYSTEM SET ...;` then `pg_ctl restart`; for non-restart settings, `SELECT pg_reload_conf();` is enough.
- 3. What does `idle in transaction` mean, and why is it dangerous? — A session opened a transaction but hasn't committed; it holds a snapshot, blocks VACUUM, and causes table/index bloat.
- 4. What's the difference between `\copy` and server-side `COPY`? — `\copy` runs as the psql client user and writes to the client machine; server-side `COPY` runs as the postgres user and writes to the server's filesystem (often blocked by permissions).
- 5. What does `pg_blocking_pids(pid)` return? — An array of PIDs currently blocking the given PID — useful for diagnosing lock contention without manually joining pg_locks.

### Mini Project

Build a DBA Health-Check Script: A single `healthcheck.sql` file you can run with `psql -f healthcheck.sql` that prints a report of: (1) top 5 longest-running active queries, (2) all `idle in transaction` sessions older than 5 minutes, (3) the 5 largest tables by size, (4) any tables where dead-tuple ratio exceeds 20%, (5) all roles with SUPERUSER. Suggested approach:
  - Use pg_stat_activity for queries and blocking
  - Use pg_total_relation_size() and pg_stat_user_tables for sizes and dead tuples
  - Use pg_roles WHERE rolsuper = true for superusers
  - Wrap each section in a SELECT with a label column so the output is readable
  - Add `\echo === Section N: <name> ===` between sections to format output

### Exercises

1. Connect with psql and use `\timing on`, then run a few SELECTs — observe the elapsed time printed after each.
2. Use `\copy (SELECT * FROM book) TO '/tmp/book.csv' WITH CSV HEADER` to export the books table, then `\copy book_test FROM '/tmp/book.csv' WITH CSV HEADER` to import into a fresh table.
3. Run `ALTER SYSTEM SET log_min_duration_statement = '500';` and `SELECT pg_reload_conf();`, then run a slow query and find it in the Postgres log.
4. Open two psql sessions; in one, run `BEGIN; UPDATE book SET title = title;` (no commit); in the other, run an UPDATE on the same row and use `pg_blocking_pids()` to identify the blocker.
5. Write a one-liner psql query to list the 10 largest tables by total relation size, including indexes.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which psql meta-command runs a SQL file from disk?
9. A) \r
10. B) \i (*)
11. C) \f
12. D) \run
13. Explanation: \i <filename> executes the SQL file in the current session; \ef edits functions, \o redirects output.
14. Q2: What is the recommended size of `shared_buffers` on a dedicated server?
15. A) 50% of RAM
16. B) 5% of RAM
17. C) 25% of RAM (*)
18. D) 100% of RAM
19. Explanation: The Postgres docs recommend ~25% of RAM for shared_buffers; the OS page cache uses the rest for file caching.
20. Q3: How do you apply a config change made via ALTER SYSTEM that does NOT require a restart?
21. A) Restart the cluster
22. B) Reconnect the session
23. C) Run ANALYZE;
24. D) Run SELECT pg_reload_conf(); (*)
25. Explanation: pg_reload_conf() sends SIGHUP to the postmaster, reloading postgresql.auto.conf and pg_hba.conf without dropping connections.
26. Q4: Which is the modern default password hashing method in Postgres 16?
27. A) scram-sha-256 (*)
28. B) md5
29. C) trust
30. D) plaintext
31. Explanation: scram-sha-256 (RFC 7677) became the default in Postgres 10; md5 is deprecated and trust is for local dev only.
32. Q5: Why is `idle in transaction` dangerous?
33. A) It wastes CPU
34. B) It holds a snapshot, blocks VACUUM, and causes bloat (*)
35. C) It blocks new logins
36. D) It disables WAL archiving
37. Explanation: An open transaction keeps a snapshot that VACUUM cannot prune past; long-running idle-in-transaction sessions are a leading cause of bloat.
38. Q6: Which setting should be tuned per-session for big analytical queries rather than globally?
39. A) shared_buffers
40. B) max_connections
41. C) work_mem (*)
42. D) wal_level
43. Explanation: work_mem is per-sort/hash per backend; setting it high globally risks memory exhaustion with many concurrent sessions.
44. Q7: What is the difference between \copy and server-side COPY?
45. A) No difference
46. B) \copy is faster
47. C) Server-side COPY requires superuser to read
48. D) \copy runs as the client user and writes to the client; server-side COPY runs as postgres on the server (*)
49. Explanation: \copy streams data through the client; server-side COPY reads/writes files on the server's filesystem as the postgres OS user.
50. Q8: Which statement returns the PIDs blocking a given backend?
51. A) pg_blocking_pids(pid) (*)
52. B) pg_lock_holders(pid)
53. C) pg_blocked_by(pid)
54. D) pg_lock_waiters(pid)
55. Explanation: pg_blocking_pids(pid) returns an array of PIDs holding locks that block the given backend — much simpler than joining pg_locks manually.
56. Q9: What does `ALTER SYSTEM SET ... = ...;` write to?
57. A) postgresql.conf
58. B) postgresql.auto.conf (*)
59. C) pg_hba.conf
60. D) postmaster.opts
61. Explanation: ALTER SYSTEM appends to postgresql.auto.conf, which is read after postgresql.conf; this keeps manual edits auditable and idempotent.
62. Q10: Which Postgres setting should you set to log slow queries automatically?
63. A) log_statement = 'all'
64. B) log_duration = on
65. C) log_min_duration_statement = '1000' (*)
66. D) log_connections = on
67. Explanation: log_min_duration_statement = '1000' logs every statement that takes more than 1000ms (1s); log_statement='all' logs every query (too noisy for prod).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which psql meta-command runs a SQL file from disk?
  options:
    - \r
    - \i
    - \f
    - \run
  correctIndex: 1
  explanation: \i <filename> executes the SQL file in the current session; \ef edits functions, \o redirects output.
- id: q2
  question: What is the recommended size of `shared_buffers` on a dedicated server?
  options:
    - 50% of RAM
    - 5% of RAM
    - 25% of RAM
    - 100% of RAM
  correctIndex: 2
  explanation: The Postgres docs recommend ~25% of RAM for shared_buffers; the OS page cache uses the rest for file caching.
- id: q3
  question: How do you apply a config change made via ALTER SYSTEM that does NOT require a restart?
  options:
    - Restart the cluster
    - Reconnect the session
    - Run ANALYZE;
    - Run SELECT pg_reload_conf();
  correctIndex: 3
  explanation: pg_reload_conf() sends SIGHUP to the postmaster, reloading postgresql.auto.conf and pg_hba.conf without dropping connections.
- id: q4
  question: Which is the modern default password hashing method in Postgres 16?
  options:
    - scram-sha-256
    - md5
    - trust
    - plaintext
  correctIndex: 0
  explanation: scram-sha-256 (RFC 7677) became the default in Postgres 10; md5 is deprecated and trust is for local dev only.
- id: q5
  question: Why is `idle in transaction` dangerous?
  options:
    - It wastes CPU
    - It holds a snapshot, blocks VACUUM, and causes bloat
    - It blocks new logins
    - It disables WAL archiving
  correctIndex: 1
  explanation: An open transaction keeps a snapshot that VACUUM cannot prune past; long-running idle-in-transaction sessions are a leading cause of bloat.
- id: q6
  question: Which setting should be tuned per-session for big analytical queries rather than globally?
  options:
    - shared_buffers
    - max_connections
    - work_mem
    - wal_level
  correctIndex: 2
  explanation: work_mem is per-sort/hash per backend; setting it high globally risks memory exhaustion with many concurrent sessions.
- id: q7
  question: What is the difference between \copy and server-side COPY?
  options:
    - No difference
    - \copy is faster
    - Server-side COPY requires superuser to read
    - \copy runs as the client user and writes to the client; server-side COPY runs as postgres on the server
  correctIndex: 3
  explanation: \copy streams data through the client; server-side COPY reads/writes files on the server's filesystem as the postgres OS user.
- id: q8
  question: Which statement returns the PIDs blocking a given backend?
  options:
    - pg_blocking_pids(pid)
    - pg_lock_holders(pid)
    - pg_blocked_by(pid)
    - pg_lock_waiters(pid)
  correctIndex: 0
  explanation: pg_blocking_pids(pid) returns an array of PIDs holding locks that block the given backend — much simpler than joining pg_locks manually.
- id: q9
  question: What does `ALTER SYSTEM SET ... = ...;` write to?
  options:
    - postgresql.conf
    - postgresql.auto.conf
    - pg_hba.conf
    - postmaster.opts
  correctIndex: 1
  explanation: ALTER SYSTEM appends to postgresql.auto.conf, which is read after postgresql.conf; this keeps manual edits auditable and idempotent.
- id: q10
  question: Which Postgres setting should you set to log slow queries automatically?
  options:
    - log_statement = 'all'
    - log_duration = on
    - log_min_duration_statement = '1000'
    - log_connections = on
  correctIndex: 2
  explanation: log_min_duration_statement = '1000' logs every statement that takes more than 1000ms (1s); log_statement='all' logs every query (too noisy for prod).
```

