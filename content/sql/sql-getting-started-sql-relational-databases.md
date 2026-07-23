---
slug: sql-getting-started-sql-relational-databases
id: sql-01
track: sql
order: 1
title: Getting Started with SQL and Relational Databases
description: Install PostgreSQL, connect with psql, and understand the relational model — tables, rows, columns, schemas, and primary keys — by writing your first SELECT queries.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY
whyItMatters: Install PostgreSQL, connect with psql, and understand the relational model — tables, rows, columns, schemas, and primary keys — by writing your first SELECT queries.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Getting Started with SQL and Relational Databases

## Getting Started with SQL and Relational Databases

### Why It Matters

Install PostgreSQL, connect with psql, and understand the relational model — tables, rows, columns, schemas, and primary keys — by writing your first SELECT queries.

Install PostgreSQL, connect with psql, and understand the relational model — tables, rows, columns, schemas, and primary keys — by writing your first SELECT queries.

### Prerequisites

- None — basic database concepts helpful but not required.
- Comfort using a terminal and installing software.

### Topics

- Installing PostgreSQL 16 and the psql CLI on macOS/Linux/Windows
- Connecting to a database: `psql -h localhost -U postgres`
- The relational model: tables, rows, columns, schemas, catalogs
- SQL dialects: Postgres, MySQL, SQLite, SQL Server, Oracle — where they diverge
- System catalogs: `\dt`, `\d`, `information_schema.tables`
- Data type families: text, numeric, boolean, date/time, uuid, jsonb
- Comments (`--` and `/* */`), statement termination (`;`), and case folding
- Introspection commands: `\l`, `\d+`, `\dx`, `\df`

### Key Concepts

- A relational database stores data in tables of rows (tuples) and columns (attributes).
- SQL is declarative: you describe what you want, the planner decides how to get it.
- Postgres organizes objects in a hierarchy: cluster -> database -> schema -> table.
- Unquoted identifiers are case-folded to lowercase; quote with "..." to preserve case.
- String literals use single quotes ('abc'); double quotes are for identifiers, not strings.
- A primary key uniquely identifies a row; the modern default is `bigint GENERATED ALWAYS AS IDENTITY`.

```sql
-- From the shell: psql -h localhost -U postgres -d postgres
-- List all databases
\l

-- Connect to a different database
\c dvdrental

-- List tables in the current schema
\dt

-- Describe a table's columns, types, and modifiers
\d customer

-- Your first query: select all columns from the customer table
SELECT * FROM customer LIMIT 5;
```
Caption: psql connection and first query

### Common Pitfalls

- Forgetting the trailing semicolon — psql shows a continuation prompt and seems to hang; end every statement with `;` (or `\g`).
- Quoting strings with double quotes — `"abc"` is an identifier, `'abc'` is a string literal; mixing them yields "column does not exist" or "missing FROM-clause entry".
- Mixed-case identifier confusion — `CREATE TABLE Foo (Bar int)` actually creates table `foo` with column `bar`; quote with `"Foo"` only if you really need mixed case (and then always quote it).
- `SELECT *` in production — column order can change, extra columns bloat wire traffic, and ORM mappings break; always project explicit columns.
- Using SERIAL instead of GENERATED ALWAYS AS IDENTITY — SERIAL is a Postgres legacy that complicates dumps and migrations; IDENTITY (SQL standard) is preferred since Postgres 10.

### Real-World Applications

- Netflix's billing platform runs on PostgreSQL with hundreds of sharded schemas tracking every subscriber's plan and payment.
- Uber's early architecture ran on Postgres; engineers routinely introspect tables via psql during incident triage.
- Airbnb uses Postgres for transactional data and Citus-derived extensions for analytical fan-out across listings and bookings.
- Stripe's ledger subsystem is built on Postgres with strict row-level constraints to keep money movement auditable.

### Interview Questions

- 1. What's the difference between a database, a schema, and a table? — A database contains schemas; a schema contains tables (and other objects); a table contains rows and columns.
- 2. Why is SQL called declarative? — You specify the result you want; the query planner picks the execution strategy.
- 3. What does GENERATED ALWAYS AS IDENTITY do? — Auto-assigns a monotonically increasing bigint for the column on INSERT, using an internal sequence.
- 4. Difference between `\d` and `\dt` in psql? — `\dt` lists only tables in the current schema; `\d <name>` describes one relation (table, view, sequence) in detail.
- 5. Why are Postgres identifiers case-folded to lowercase? — SQL spec default; double-quoting preserves case but creates a footgun where unquoted references fail.

### Mini Project

Build a Personal Library Catalog: A single table that stores books you own (title, author, isbn, status, acquired_at). You write a schema.sql, a seed.sql with five rows, and a queries.sql with five SELECT statements (all books, books by an author, books borrowed, count by status, recent acquisitions). Suggested approach:
  - Use `bigint GENERATED ALWAYS AS IDENTITY` for the primary key
  - Use a CHECK constraint for status ('owned', 'borrowed', 'lent')
  - Use timestamptz (not timestamp) for acquired_at to avoid timezone bugs
  - Use ISBN text with a CHECK regex `'^[0-9]{13}$'`
  - Run with `psql -f schema.sql && psql -f seed.sql && psql -f queries.sql`

### Exercises

1. Install Postgres 16, connect with psql, run `\l` and `\conninfo`, then create a database called `lab1`.
2. Create a `task` table (id, title, done boolean, created_at) and insert three rows; verify with SELECT.
3. Run `\d task` and `\d+ task`; identify the index Postgres auto-created for the primary key.
4. Query `information_schema.columns` for the `task` table and confirm the data types match your CREATE statement.
5. Drop the `task` table, then re-run your CREATE script to confirm it is idempotent.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command lists all databases on a Postgres server from psql?
9. A) \l (*)
10. B) \dt
11. C) \db
12. D) SHOW DATABASES;
13. Explanation: \l is the psql meta-command for listing databases; \dt lists tables in the current schema; SHOW DATABASES is MySQL syntax.
14. Q2: Which characters delimit a string literal in standard SQL?
15. A) Double quotes "..."
16. B) Single quotes '...' (*)
17. C) Backticks `...`
18. D) Brackets [...]
19. Explanation: Single quotes are string literals; double quotes are identifiers; backticks are MySQL-only identifier quoting.
20. Q3: What does GENERATED ALWAYS AS IDENTITY produce?
21. A) A UUID string per row
22. B) A random bigint per row
23. C) A monotonic bigint from an internal sequence (*)
24. D) A hash of the row contents
25. Explanation: IDENTITY columns use a sequence under the hood, producing sequential bigint values; UUIDs need the uuid type and gen_random_uuid().
26. Q4: Which statement about Postgres identifier case-folding is TRUE?
27. A) Identifiers are case-sensitive by default
28. B) Identifiers preserve their original case
29. C) Mixed-case identifiers are an error
30. D) Unquoted identifiers are folded to lowercase; quote with "..." to preserve case (*)
31. Explanation: Postgres folds unquoted identifiers to lowercase; "MyCol" preserves case but must always be quoted thereafter.
32. Q5: What does SELECT * FROM customer LIMIT 5; return?
33. A) The first 5 rows of customer in an unspecified order (*)
34. B) 5 random rows from customer
35. C) All rows of customer, truncated to 5 columns
36. D) The last 5 rows inserted
37. Explanation: LIMIT caps the row count but without ORDER BY the row order is unspecified (often insertion order in practice but not guaranteed).
38. Q6: What is the SQL-standard alternative to Postgres SERIAL?
39. A) BIGSERIAL
40. B) GENERATED ALWAYS AS IDENTITY (*)
41. C) AUTO_INCREMENT
42. D) SEQUENCE.nextval
43. Explanation: SERIAL is Postgres-specific legacy; IDENTITY is the SQL:2003 standard and is preferred for new schemas.
44. Q7: Which catalog schema exposes portable metadata about columns and tables?
45. A) pg_catalog
46. B) sys_catalog
47. C) information_schema (*)
48. D) meta_schema
49. Explanation: information_schema is the SQL-standard catalog; pg_catalog is Postgres-specific and exposes more detail but is less portable.
50. Q8: Which data type should you use for a timestamp with timezone awareness?
51. A) timestamp
52. B) datetime
53. C) timestamp without timezone
54. D) timestamptz (*)
55. Explanation: timestamptz stores the instant in UTC and renders in the session's timezone; plain timestamp has no zone and causes subtle bugs across regions.
56. Q9: What happens if you forget the trailing semicolon in psql?
57. A) psql shows a continuation prompt and waits for more input (*)
58. B) psql silently ignores the statement
59. C) psql executes immediately
60. D) psql quits the session
61. Explanation: Without ; psql thinks the statement continues; press ; on the next line or Ctrl-C to abort.
62. Q10: Which psql command describes the columns, types, and modifiers of an existing table?
63. A) \list
64. B) \d tablename (*)
65. C) DESCRIBE tablename
66. D) SHOW COLUMNS FROM tablename
67. Explanation: \d is psql's describe; DESCRIBE and SHOW COLUMNS are MySQL syntax.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command lists all databases on a Postgres server from psql?
  options:
    - \l
    - \dt
    - \db
    - SHOW DATABASES;
  correctIndex: 0
  explanation: \l is the psql meta-command for listing databases; \dt lists tables in the current schema; SHOW DATABASES is MySQL syntax.
- id: q2
  question: Which characters delimit a string literal in standard SQL?
  options:
    - Double quotes "..."
    - Single quotes '...'
    - Backticks `...`
    - Brackets [...]
  correctIndex: 1
  explanation: Single quotes are string literals; double quotes are identifiers; backticks are MySQL-only identifier quoting.
- id: q3
  question: What does GENERATED ALWAYS AS IDENTITY produce?
  options:
    - A UUID string per row
    - A random bigint per row
    - A monotonic bigint from an internal sequence
    - A hash of the row contents
  correctIndex: 2
  explanation: IDENTITY columns use a sequence under the hood, producing sequential bigint values; UUIDs need the uuid type and gen_random_uuid().
- id: q4
  question: Which statement about Postgres identifier case-folding is TRUE?
  options:
    - Identifiers are case-sensitive by default
    - Identifiers preserve their original case
    - Mixed-case identifiers are an error
    - Unquoted identifiers are folded to lowercase; quote with "..." to preserve case
  correctIndex: 3
  explanation: Postgres folds unquoted identifiers to lowercase; "MyCol" preserves case but must always be quoted thereafter.
- id: q5
  question: What does SELECT * FROM customer LIMIT 5; return?
  options:
    - The first 5 rows of customer in an unspecified order
    - 5 random rows from customer
    - All rows of customer, truncated to 5 columns
    - The last 5 rows inserted
  correctIndex: 0
  explanation: LIMIT caps the row count but without ORDER BY the row order is unspecified (often insertion order in practice but not guaranteed).
- id: q6
  question: What is the SQL-standard alternative to Postgres SERIAL?
  options:
    - BIGSERIAL
    - GENERATED ALWAYS AS IDENTITY
    - AUTO_INCREMENT
    - SEQUENCE.nextval
  correctIndex: 1
  explanation: SERIAL is Postgres-specific legacy; IDENTITY is the SQL:2003 standard and is preferred for new schemas.
- id: q7
  question: Which catalog schema exposes portable metadata about columns and tables?
  options:
    - pg_catalog
    - sys_catalog
    - information_schema
    - meta_schema
  correctIndex: 2
  explanation: information_schema is the SQL-standard catalog; pg_catalog is Postgres-specific and exposes more detail but is less portable.
- id: q8
  question: Which data type should you use for a timestamp with timezone awareness?
  options:
    - timestamp
    - datetime
    - timestamp without timezone
    - timestamptz
  correctIndex: 3
  explanation: timestamptz stores the instant in UTC and renders in the session's timezone; plain timestamp has no zone and causes subtle bugs across regions.
- id: q9
  question: What happens if you forget the trailing semicolon in psql?
  options:
    - psql shows a continuation prompt and waits for more input
    - psql silently ignores the statement
    - psql executes immediately
    - psql quits the session
  correctIndex: 0
  explanation: Without ; psql thinks the statement continues; press ; on the next line or Ctrl-C to abort.
- id: q10
  question: Which psql command describes the columns, types, and modifiers of an existing table?
  options:
    - \list
    - \d tablename
    - DESCRIBE tablename
    - SHOW COLUMNS FROM tablename
  correctIndex: 1
  explanation: \d is psql's describe; DESCRIBE and SHOW COLUMNS are MySQL syntax.
```

