---
slug: nodejs-database-access-pg-mysql2-mongodb-prisma
id: nodejs-17
track: nodejs
order: 17
title: Database Access — pg, mysql2, mongodb, Prisma
description: Connect Node to PostgreSQL (pg), MySQL (mysql2), MongoDB (mongodb), and use Prisma as a type-safe ORM — with connection pooling, transactions, and SQL injection prevention.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=360s
whyItMatters: Connect Node to PostgreSQL (pg), MySQL (mysql2), MongoDB (mongodb), and use Prisma as a type-safe ORM — with connection pooling, transactions, and SQL injection prevention.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Database Access — pg, mysql2, mongodb, Prisma

## Database Access — pg, mysql2, mongodb, Prisma

### Why It Matters

Connect Node to PostgreSQL (pg), MySQL (mysql2), MongoDB (mongodb), and use Prisma as a type-safe ORM — with connection pooling, transactions, and SQL injection prevention.

Connect Node to PostgreSQL (pg), MySQL (mysql2), MongoDB (mongodb), and use Prisma as a type-safe ORM — with connection pooling, transactions, and SQL injection prevention.

### Prerequisites

- Stage 5: The http Module (API servers need a DB).
- Stage 12: async/await (DB calls are async).
- Stage 9: Errors (handle DB errors with codes).

### Topics

- `pg` (PostgreSQL) with `pg.Pool` for connection pooling
- `mysql2` with promises interface and pool
- `mongodb` native driver (Node 18+ has official driver)
- Prisma ORM: schema, migrations, type-safe queries, relations
- Parameterized queries (`$1`, `$2`) to prevent SQL injection
- Transactions (`BEGIN`/`COMMIT`/`ROLLBACK` or `pool.transaction`)
- N+1 query problem and how to fix it (joins, includes, batching)
- Query builders: knex (lightweight, SQL-like)

### Key Concepts

- Use a connection pool — opening a new client per request exhausts DB connections; `pg.Pool` reuses a fixed set.
- Always use parameterized queries (`$1`, `$2` in pg, `?` in mysql2) — string concatenation enables SQL injection.
- Prisma generates a type-safe client from a `schema.prisma` file; migrations are auto-generated from schema changes.
- Transactions ensure atomicity: either all statements commit or none do (ROLLBACK on error).
- The N+1 problem: 1 query to fetch N parents, then N queries to fetch each child — fix with a JOIN, Prisma `include`, or DataLoader batching.

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // max connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

async function getUsers(limit = 100) {
  // Parameterized query — SAFE from SQL injection
  const { rows } = await pool.query(
    "SELECT id, name, email FROM users ORDER BY id LIMIT $1",
    [limit]
  );
  return rows;
}

async function getUserById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return rows[0] ?? null;
}
```
Caption: pg with connection pool

### Common Pitfalls

- SQL injection via string concatenation — `pool.query("SELECT * FROM users WHERE name = '" + name + "'")` is catastrophic; always use parameterized queries (`$1`, `?`).
- Pool exhaustion — opening new `pg.Client` per request without release exhausts DB connections; use `Pool` and always `client.release()` in `finally`.
- N+1 queries — fetching N parents then looping to fetch each child makes N+1 queries; use JOIN, Prisma `include`, or DataLoader.
- Forgetting transactions for multi-step writes — without a transaction, partial failures leave inconsistent data; wrap related writes in BEGIN/COMMIT with ROLLBACK on error.
- Sync `JSON.stringify` on huge result sets — `pool.query` returning 100k rows blocks the loop while stringifying; paginate or stream with a cursor.

### Real-World Applications

- GitHub uses PostgreSQL extensively; their Node services connect via `pg` (or wrappers).
- LinkedIn uses multiple DBs (Voldemort, Espresso, Pinot) with Node drivers for some internal tools.
- Netflix uses Cassandra + PostgreSQL; Node services query both via respective drivers.
- Prisma is used by many TypeScript-first startups (Cal.com,axter, Documenso) for type-safe DB access.

### Interview Questions

- 1. How do you prevent SQL injection in Node? — Always use parameterized queries (`pool.query("SELECT * FROM users WHERE id = $1", [id])`); never string-concat user input. Prisma and knex do this automatically.
- 2. What is a connection pool and why use one? — A fixed set of reusable DB connections; opening a new connection per request has high overhead and exhausts DB connection limits. `pg.Pool` reuses connections across requests.
- 3. What is a transaction and when do you need one? — A group of queries that commit atomically (all-or-nothing); use for multi-step writes like money transfers, where partial failure would corrupt data.
- 4. What is the N+1 query problem? — 1 query fetches N parents, then N queries fetch each child (N+1 total); fix with a JOIN, Prisma `include`, or DataLoader batching.
- 5. What does Prisma generate? — A type-safe client (TypeScript types from `schema.prisma`), a query builder, and migration files; changes to `schema.prisma` produce SQL migrations via `prisma migrate dev`.

### Mini Project

Build a CRUD App with Prisma and Postgres: A `/todos` API with full CRUD (list, get, create, update, delete) backed by Postgres via Prisma, including relations (a `User` has many `Todo`). Suggested approach:
  - Define `schema.prisma` with `User` and `Todo` models and a 1-to-many relation
  - Run `prisma migrate dev --name init` to create tables
  - Implement 5 route handlers using `prisma.user.findMany`, `create`, `update`, `delete`
  - Use `include: { todos: true }` to avoid N+1 when listing users with their todos
  - Wrap each handler in try/catch and return appropriate status codes (400, 404, 500)

### Exercises

1. Connect to a local Postgres with `pg.Pool`, run `SELECT 1 AS result`, and print the row.
2. Insert a user with parameterized query (`$1`), then SELECT them back.
3. Wrap two UPDATEs in a transaction; verify ROLLBACK on error.
4. Set up Prisma with two related models and run a query with `include` to avoid N+1.
5. Use mongodb to insert a document and query it with a filter.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the SAFE way to write a parameterized query in pg?
9. A) `pool.query("SELECT * FROM users WHERE name = $1", [name])` (*)
10. B) `pool.query("SELECT * FROM users WHERE name = '" + name + "'")`
11. C) `pool.query("SELECT * FROM users WHERE name = ?")`
12. D) `pool.query("SELECT * FROM users WHERE name = %{name}")`
13. Explanation: Parameterized queries (`$1`, `$2` in pg, `?` in mysql2) are pre-compiled and safely escape values; string concatenation enables SQL injection.
14. Q2: What does a connection pool do?
15. A) Caches query results
16. B) Reuses a fixed set of DB connections across requests (*)
17. C) Encrypts the connection
18. D) Auto-retries failed queries
19. Explanation: A pool maintains a fixed set of DB connections and hands them out per request; avoids the overhead of opening/closing connections per request and prevents pool exhaustion.
20. Q3: What is a transaction?
21. A) A single query
22. B) A cached query result
23. C) A group of queries that commit atomically (all or nothing) (*)
24. D) A type of index
25. Explanation: A transaction wraps multiple queries in BEGIN/COMMIT; if any fails, ROLLBACK undoes all changes, ensuring atomicity.
26. Q4: What is the N+1 query problem?
27. A) N queries to fetch N parents, then 1 query for children
28. B) N+1 databases
29. C) A type of SQL injection
30. D) 1 query for parents, then N queries for each child's data (*)
31. Explanation: You fetch N parents in 1 query, then loop to fetch each child (N more queries = N+1 total); fix with a JOIN, Prisma `include`, or DataLoader batching.
32. Q5: What does Prisma generate from a schema?
33. A) A type-safe client with TypeScript types, query builder, and migrations (*)
34. B) SQL only
35. C) Just documentation
36. D) A REST API
37. Explanation: `prisma generate` produces a TypeScript client with types inferred from `schema.prisma`; `prisma migrate dev` produces SQL migration files.
38. Q6: Why must you `client.release()` after `pool.connect()`?
39. A) To close the pool
40. B) To return the connection to the pool for reuse (*)
41. C) To commit the transaction
42. D) It's optional
43. Explanation: Failing to release returns the connection to nowhere — the pool eventually exhausts and new requests block; always release in `finally`.
44. Q7: Which Prisma directive includes related records to avoid N+1?
45. A) `select`
46. B) `join`
47. C) `include` (*)
48. D) `with`
49. Explanation: `prisma.user.findMany({ include: { todos: true } })` issues a single SQL query with a JOIN (or batched queries) to fetch users and their todos — no N+1.
50. Q8: Which database does the `mongodb` driver connect to?
51. A) PostgreSQL
52. B) MySQL
53. C) SQLite
54. D) MongoDB (document store) (*)
55. Explanation: The official `mongodb` npm package is the native driver for MongoDB, a NoSQL document database; queries return JS objects (documents), not rows.
56. Q9: What happens if you forget a transaction around multi-step writes?
57. A) Nothing; they auto-commit individually (*)
58. B) All writes are rolled back
59. C) An error is thrown
60. D) The DB locks
61. Explanation: Without an explicit transaction, each statement auto-commits; a failure midway leaves partial data. Wrap related writes in BEGIN/COMMIT with ROLLBACK on error.
62. Q10: Which is a valid reason to choose Prisma over raw `pg`?
63. A) Faster runtime performance
64. B) Type-safe queries and auto-generated migrations (*)
65. C) Smaller bundle size
66. D) No need for a database
67. Explanation: Prisma gives you TypeScript types inferred from the schema, type-safe queries (compile-time errors on typos), and auto-generated migrations — at the cost of some runtime overhead.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the SAFE way to write a parameterized query in pg?
  options:
    - '`pool.query("SELECT * FROM users WHERE name = $1", [name])`'
    - "`pool.query(\"SELECT * FROM users WHERE name = '\" + name + \"'\")`"
    - '`pool.query("SELECT * FROM users WHERE name = ?")`'
    - '`pool.query("SELECT * FROM users WHERE name = %{name}")`'
  correctIndex: 0
  explanation: Parameterized queries (`$1`, `$2` in pg, `?` in mysql2) are pre-compiled and safely escape values; string concatenation enables SQL injection.
- id: q2
  question: What does a connection pool do?
  options:
    - Caches query results
    - Reuses a fixed set of DB connections across requests
    - Encrypts the connection
    - Auto-retries failed queries
  correctIndex: 1
  explanation: A pool maintains a fixed set of DB connections and hands them out per request; avoids the overhead of opening/closing connections per request and prevents pool exhaustion.
- id: q3
  question: What is a transaction?
  options:
    - A single query
    - A cached query result
    - A group of queries that commit atomically (all or nothing)
    - A type of index
  correctIndex: 2
  explanation: A transaction wraps multiple queries in BEGIN/COMMIT; if any fails, ROLLBACK undoes all changes, ensuring atomicity.
- id: q4
  question: What is the N+1 query problem?
  options:
    - N queries to fetch N parents, then 1 query for children
    - N+1 databases
    - A type of SQL injection
    - 1 query for parents, then N queries for each child's data
  correctIndex: 3
  explanation: You fetch N parents in 1 query, then loop to fetch each child (N more queries = N+1 total); fix with a JOIN, Prisma `include`, or DataLoader batching.
- id: q5
  question: What does Prisma generate from a schema?
  options:
    - A type-safe client with TypeScript types, query builder, and migrations
    - SQL only
    - Just documentation
    - A REST API
  correctIndex: 0
  explanation: "`prisma generate` produces a TypeScript client with types inferred from `schema.prisma`; `prisma migrate dev` produces SQL migration files."
- id: q6
  question: Why must you `client.release()` after `pool.connect()`?
  options:
    - To close the pool
    - To return the connection to the pool for reuse
    - To commit the transaction
    - It's optional
  correctIndex: 1
  explanation: Failing to release returns the connection to nowhere — the pool eventually exhausts and new requests block; always release in `finally`.
- id: q7
  question: Which Prisma directive includes related records to avoid N+1?
  options:
    - "`select`"
    - "`join`"
    - "`include`"
    - "`with`"
  correctIndex: 2
  explanation: "`prisma.user.findMany({ include: { todos: true } })` issues a single SQL query with a JOIN (or batched queries) to fetch users and their todos — no N+1."
- id: q8
  question: Which database does the `mongodb` driver connect to?
  options:
    - PostgreSQL
    - MySQL
    - SQLite
    - MongoDB (document store)
  correctIndex: 3
  explanation: The official `mongodb` npm package is the native driver for MongoDB, a NoSQL document database; queries return JS objects (documents), not rows.
- id: q9
  question: What happens if you forget a transaction around multi-step writes?
  options:
    - Nothing; they auto-commit individually
    - All writes are rolled back
    - An error is thrown
    - The DB locks
  correctIndex: 0
  explanation: Without an explicit transaction, each statement auto-commits; a failure midway leaves partial data. Wrap related writes in BEGIN/COMMIT with ROLLBACK on error.
- id: q10
  question: Which is a valid reason to choose Prisma over raw `pg`?
  options:
    - Faster runtime performance
    - Type-safe queries and auto-generated migrations
    - Smaller bundle size
    - No need for a database
  correctIndex: 1
  explanation: Prisma gives you TypeScript types inferred from the schema, type-safe queries (compile-time errors on typos), and auto-generated migrations — at the cost of some runtime overhead.
```

