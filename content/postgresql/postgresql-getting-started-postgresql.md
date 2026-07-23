---
slug: postgresql-getting-started-postgresql
id: postgresql-01
track: postgresql
order: 1
title: Getting Started with PostgreSQL
description: Install PostgreSQL 16, connect with psql, understand the cluster/database/schema/table hierarchy, and write your first queries against a real Postgres instance.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4
whyItMatters: Install PostgreSQL 16, connect with psql, understand the cluster/database/schema/table hierarchy, and write your first queries against a real Postgres instance.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Getting Started with PostgreSQL

## Getting Started with PostgreSQL

### Why It Matters

Install PostgreSQL 16, connect with psql, understand the cluster/database/schema/table hierarchy, and write your first queries against a real Postgres instance.

Install PostgreSQL 16, connect with psql, understand the cluster/database/schema/table hierarchy, and write your first queries against a real Postgres instance.

### Prerequisites

- None — basic SQL knowledge is helpful but not required.
- Comfort using a terminal and installing software on your OS.

### Topics

- Installing PostgreSQL 16 on macOS (Postgres.app / Homebrew), Linux (apt), Windows (EnterpriseDB installer)
- The cluster/database/schema/table hierarchy and how it differs from MySQL
- Connecting with psql: -h, -U, -d, -W, and the .pgpass file
- psql meta-commands: \l, \c, \dt, \d, \dn, \dx, \df, \du, \conninfo, \q
- System catalogs: pg_catalog vs information_schema (SQL-standard)
- The pg_hba.conf and postgresql.conf files — where they live and what they control
- Roles vs users vs groups in Postgres (users are roles with LOGIN)
- The default `postgres` superuser and why you should not run apps as it

### Key Concepts

- A Postgres cluster is one running postmaster with shared WAL and system catalogs; one cluster hosts many databases.
- A database contains schemas; a schema contains tables, views, functions, etc. The default schema is `public` (and `public` no longer grants CREATE to everyone in PG15+).
- Postgres uses MVCC: readers never block writers, writers never block readers; updates create new row versions.
- WAL (Write-Ahead Log) records every change before it hits the data files — the foundation of crash recovery and replication.
- Unquoted identifiers fold to lowercase; quote with "MixedCase" only if you accept the quoting tax forever after.
- String literals use single quotes ('abc'); double quotes are identifiers ("Col Name"); dollar-quoting $$body$$ avoids escaping in functions.

```sql
-- From the shell:
--   psql -h localhost -U postgres -d postgres
-- psql prompts for the password from .pgpass or -W.

\l                          -- list databases
\conninfo                   -- show current connection
\c lab1                     -- connect to database lab1
\dn                         -- list schemas
\dt public.*                -- list tables in public schema
\d customer                 -- describe one table
\dx                         -- list installed extensions
\q                          -- quit
```
Caption: Connect and list databases

### Common Pitfalls

- Running the app as the `postgres` superuser — create a least-privilege role with INSERT/SELECT/UPDATE only; superuser bypasses RLS and grants full DROP rights.
- Forgetting the trailing semicolon — psql shows a `-` continuation prompt and seems to hang; end every statement with `;` or use `\g` to run.
- Quoting strings with double quotes — `"abc"` is an identifier, `'abc'` is a string literal; mixing them gives "column does not exist" or "missing FROM-clause entry".
- Mixed-case identifier confusion — `CREATE TABLE Foo (Bar int)` actually creates table `foo` with column `bar`; only quote with `"Foo"` if you really need mixed case.
- Using SERIAL instead of GENERATED ALWAYS AS IDENTITY — SERIAL is a Postgres legacy that complicates dumps and migrations; IDENTITY (SQL standard) is preferred since Postgres 10.

### Real-World Applications

- Instagram's backend originally ran on Postgres (with sharding on top) before parts moved to Cassandra and custom stores; engineers routinely introspect tables via psql during incidents.
- Reddit runs Postgres as a primary datastore for votes, comments, and subreddit metadata, with logical replication feeding analytical clusters.
- Spotify uses Postgres for user-account and royalty-tracking services that require strict transactional guarantees.
- Twitch's chat and event systems use Postgres for transactional state, with extensions for time-series and queueing.

### Interview Questions

- 1. What's the difference between a database, a schema, and a table in Postgres? — A database contains schemas; a schema contains tables (and other objects); a table contains rows and columns.
- 2. What is MVCC, and what is its main benefit? — Multi-Version Concurrency Control: readers never block writers and vice versa; each transaction sees a consistent snapshot via tuple xmin/xmax.
- 3. What is WAL and why does it exist? — The Write-Ahead Log records every change before data files are touched, enabling crash recovery and replication.
- 4. Why should the application not connect as the `postgres` superuser? — Superusers bypass RLS, can DROP anything, and a SQL-injection bug becomes a full-cluster compromise.
- 5. What does the `\d` meta-command do? — Describes one relation (table, view, sequence, materialized view) showing columns, types, defaults, indexes, and constraints.

### Mini Project

Build a Personal Library Catalog: A single-table schema that stores books you own (title, author, isbn, status, acquired_at). You write a `schema.sql`, a `seed.sql` with five rows, and a `queries.sql` with five SELECT statements (all books, books by an author, books borrowed, count by status, recent acquisitions). Suggested approach:
  - Use `bigint GENERATED ALWAYS AS IDENTITY` for the primary key
  - Use a CHECK constraint for status IN ('owned', 'borrowed', 'lent')
  - Use timestamptz (not timestamp) for acquired_at to avoid timezone bugs
  - Use ISBN text with a CHECK regex `'^[0-9]{13}$'`
  - Run with `psql -f schema.sql && psql -f seed.sql && psql -f queries.sql`

### Exercises

1. Install Postgres 16, connect with psql as `postgres`, run `\l` and `\conninfo`, then create a database called `lab1`.
2. Create a least-privilege role `app_user` with LOGIN and a strong password; grant USAGE on `public` and test it can connect but cannot DROP tables.
3. Create a `task` table (id, title, done boolean, created_at) and insert three rows; verify with SELECT.
4. Run `\d task` and identify the index Postgres auto-created for the primary key (it will be named `task_pkey`).
5. Query `information_schema.columns` for the `task` table and confirm the data types match your CREATE statement.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which psql meta-command lists all databases on a Postgres server?
9. A) \l (*)
10. B) \dt
11. C) \db
12. D) SHOW DATABASES;
13. Explanation: \l is the psql meta-command for listing databases; \dt lists tables in the current schema; SHOW DATABASES is MySQL syntax.
14. Q2: What is the correct way to write a string literal in standard SQL?
15. A) "abc"
16. B) 'abc' (*)
17. C) `abc`
18. D) [abc]
19. Explanation: Single quotes delimit string literals; double quotes are identifiers; backticks are MySQL-only identifier quoting.
20. Q3: In Postgres, what does a database contain?
21. A) Tables only
22. B) Other databases
23. C) Schemas, which in turn contain tables and other objects (*)
24. D) Clusters
25. Explanation: A Postgres cluster hosts databases; a database hosts schemas; a schema hosts tables, views, functions, etc.
26. Q4: What does GENERATED ALWAYS AS IDENTITY produce on INSERT?
27. A) A UUID string per row
28. B) A random bigint per row
29. C) A hash of the row contents
30. D) A monotonic bigint from an internal sequence (*)
31. Explanation: IDENTITY columns use a sequence under the hood, producing sequential bigint values; UUIDs need the uuid type and gen_random_uuid().
32. Q5: Which statement about Postgres identifier case-folding is TRUE?
33. A) Unquoted identifiers fold to lowercase; quote with "..." to preserve case (*)
34. B) Identifiers are case-sensitive by default
35. C) Mixed-case identifiers are an error
36. D) Identifiers preserve their original case
37. Explanation: Postgres folds unquoted identifiers to lowercase; "MyCol" preserves case but must always be quoted thereafter.
38. Q6: What does the WAL (Write-Ahead Log) enable?
39. A) Faster SELECTs
40. B) Crash recovery and replication (*)
41. C) Automatic index creation
42. D) Schema migrations
43. Explanation: WAL records every change before data files are touched; it powers crash recovery and both streaming and logical replication.
44. Q7: Why should the application NOT connect as the `postgres` superuser?
45. A) It is slower
46. B) Postgres disables WAL for superusers
47. C) It bypasses RLS, can DROP anything, and turns SQL injection into full-cluster compromise (*)
48. D) Superusers cannot use indexes
49. Explanation: A least-privilege app role limits blast radius; superuser has no access controls and bypasses row-level security.
50. Q8: Which is the SQL-standard alternative to Postgres SERIAL?
51. A) BIGSERIAL
52. B) AUTO_INCREMENT
53. C) SEQUENCE.nextval
54. D) GENERATED ALWAYS AS IDENTITY (*)
55. Explanation: SERIAL is Postgres-specific legacy; IDENTITY is the SQL:2003 standard and is preferred for new schemas since Postgres 10.
56. Q9: Which catalog schema exposes portable metadata about columns and tables?
57. A) information_schema (*)
58. B) pg_catalog
59. C) sys_catalog
60. D) meta_schema
61. Explanation: information_schema is the SQL-standard catalog; pg_catalog is Postgres-specific and exposes more detail but is less portable.
62. Q10: What does the \d meta-command do in psql?
63. A) Drops the named relation
64. B) Describes one relation showing columns, types, indexes, and constraints (*)
65. C) Lists all databases
66. D) Disconnects from the server
67. Explanation: \d <name> describes a single relation (table, view, sequence, materialized view) including columns, defaults, indexes, and constraints.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which psql meta-command lists all databases on a Postgres server?
  options:
    - \l
    - \dt
    - \db
    - SHOW DATABASES;
  correctIndex: 0
  explanation: \l is the psql meta-command for listing databases; \dt lists tables in the current schema; SHOW DATABASES is MySQL syntax.
- id: q2
  question: What is the correct way to write a string literal in standard SQL?
  options:
    - '"abc"'
    - "'abc'"
    - "`abc`"
    - "[abc]"
  correctIndex: 1
  explanation: Single quotes delimit string literals; double quotes are identifiers; backticks are MySQL-only identifier quoting.
- id: q3
  question: In Postgres, what does a database contain?
  options:
    - Tables only
    - Other databases
    - Schemas, which in turn contain tables and other objects
    - Clusters
  correctIndex: 2
  explanation: A Postgres cluster hosts databases; a database hosts schemas; a schema hosts tables, views, functions, etc.
- id: q4
  question: What does GENERATED ALWAYS AS IDENTITY produce on INSERT?
  options:
    - A UUID string per row
    - A random bigint per row
    - A hash of the row contents
    - A monotonic bigint from an internal sequence
  correctIndex: 3
  explanation: IDENTITY columns use a sequence under the hood, producing sequential bigint values; UUIDs need the uuid type and gen_random_uuid().
- id: q5
  question: Which statement about Postgres identifier case-folding is TRUE?
  options:
    - Unquoted identifiers fold to lowercase; quote with "..." to preserve case
    - Identifiers are case-sensitive by default
    - Mixed-case identifiers are an error
    - Identifiers preserve their original case
  correctIndex: 0
  explanation: Postgres folds unquoted identifiers to lowercase; "MyCol" preserves case but must always be quoted thereafter.
- id: q6
  question: What does the WAL (Write-Ahead Log) enable?
  options:
    - Faster SELECTs
    - Crash recovery and replication
    - Automatic index creation
    - Schema migrations
  correctIndex: 1
  explanation: WAL records every change before data files are touched; it powers crash recovery and both streaming and logical replication.
- id: q7
  question: Why should the application NOT connect as the `postgres` superuser?
  options:
    - It is slower
    - Postgres disables WAL for superusers
    - It bypasses RLS, can DROP anything, and turns SQL injection into full-cluster compromise
    - Superusers cannot use indexes
  correctIndex: 2
  explanation: A least-privilege app role limits blast radius; superuser has no access controls and bypasses row-level security.
- id: q8
  question: Which is the SQL-standard alternative to Postgres SERIAL?
  options:
    - BIGSERIAL
    - AUTO_INCREMENT
    - SEQUENCE.nextval
    - GENERATED ALWAYS AS IDENTITY
  correctIndex: 3
  explanation: SERIAL is Postgres-specific legacy; IDENTITY is the SQL:2003 standard and is preferred for new schemas since Postgres 10.
- id: q9
  question: Which catalog schema exposes portable metadata about columns and tables?
  options:
    - information_schema
    - pg_catalog
    - sys_catalog
    - meta_schema
  correctIndex: 0
  explanation: information_schema is the SQL-standard catalog; pg_catalog is Postgres-specific and exposes more detail but is less portable.
- id: q10
  question: What does the \d meta-command do in psql?
  options:
    - Drops the named relation
    - Describes one relation showing columns, types, indexes, and constraints
    - Lists all databases
    - Disconnects from the server
  correctIndex: 1
  explanation: \d <name> describes a single relation (table, view, sequence, materialized view) including columns, defaults, indexes, and constraints.
```

