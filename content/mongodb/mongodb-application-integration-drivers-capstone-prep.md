---
slug: mongodb-application-integration-drivers-capstone-prep
id: mongodb-20
track: mongodb
order: 20
title: Application Integration, Drivers, and Capstone Prep
description: Connect a real application to MongoDB with the official Node driver, manage connection pooling and retry logic, and pull together everything you've learned in preparation for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=1620s
whyItMatters: Connect a real application to MongoDB with the official Node driver, manage connection pooling and retry logic, and pull together everything you've learned in preparation for the capstone project.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Application Integration, Drivers, and Capstone Prep

## Application Integration, Drivers, and Capstone Prep

### Why It Matters

Connect a real application to MongoDB with the official Node driver, manage connection pooling and retry logic, and pull together everything you've learned in preparation for the capstone project.

Connect a real application to MongoDB with the official Node driver, manage connection pooling and retry logic, and pull together everything you've learned in preparation for the capstone project.

### Prerequisites

- All prior 19 stages — this is the integration stage that ties them together.
- Comfort writing Node.js (Express or Fastify) services.

### Topics

- The official `mongodb` Node driver (and Mongoose ODM trade-offs)
- Connection strings and options: `maxPoolSize`, `retryWrites`, `readPreference`, `appName`
- Connection pooling, `MongoClient` singleton, graceful `close()`
- Index creation at startup vs migrations (syncIndexes / migrate scripts)
- Retry logic for transient errors (`retryWrites=true`, retry on `TransientTransactionError`)
- Health checks: `ping`, `db.admin().ping()`, readiness probes
- Logging with `commandMonitoring`/`serverMonitoring` for slow queries
- Connecting to Atlas from Node, TLS, IP allowlist, SCRAM

### Key Concepts

- One `MongoClient` per application process; the client holds a connection pool (default `maxPoolSize: 100`); never create a client per request.
- Always set `retryWrites=true` (default in modern drivers) — the driver retries once on transient network/primary-failover errors.
- Use `appName` in the connection string so DBAs can identify your service in `currentOp` and logs.
- Create indexes explicitly via a migration script (or `syncIndexes`), NOT via `createIndex` on every app boot — boot-time index creation causes thundering-herd problems on multi-replica deployments.
- Health check endpoint should `db.admin().ping()` (lightweight) — not run a query — and your readiness probe should distinguish "I'm alive" from "DB is reachable".

```javascript
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI
// e.g.: "mongodb+srv://user:pass@cluster0.x.mongodb.net/shop?retryWrites=true&w=majority&appName=orders-api"

let client
async function getDb() {
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 50,           // tune per service
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      readPreference: "primary",
      writeConcern: "majority",
      retryWrites: true,
      monitorCommands: true      // enables command monitoring events
    })
    client.on("commandSucceeded", e => logSlowIfSlow(e))
    await client.connect()
  }
  return client.db("shop")
}

async function shutdown() {
  if (client) await client.close()
}
```
Caption: Singleton MongoClient with options

### Common Pitfalls

- Creating a `MongoClient` per request — the client holds a connection pool; instantiate ONE per process and reuse it. Per-request clients exhaust connections and slow down startup.
- Calling `createIndex` on every app boot — multi-replica deployments race to create indexes; use a migration script run as an init container / one-off job.
- Forgetting `retryWrites=true` — without it, a primary failover mid-write errors instead of retrying on the new primary; modern drivers default to true but verify your connection string.
- Setting `maxPoolSize` too low (or unbounded) — too low throttles throughput under load; too high overwhelms the server. Start at 50-100 per process and tune via `db.serverStatus().connections`.
- Using `findOne({})` or a slow query as a health check — use `db.admin().ping()` which is a constant-time admin command, not a query against your data.

### Real-World Applications

- Stripe uses one MongoClient per service process with tuned pool sizes and `appName` for cross-team traceability in DB logs.
- Uber uses retryable writes and transactions to survive replica-set failovers without dropping user requests.
- eBay runs migrations as one-off k8s jobs (init containers) so app replicas never race to create indexes.
- Adobe uses command monitoring to log slow queries (>100ms) to a central observability stack for continuous tuning.

### Interview Questions

- 1. Should you create a `MongoClient` per request? — No; one client per process holds a connection pool. Per-request clients exhaust connections.
- 2. Why set `retryWrites=true`? — It lets the driver retry single-doc writes on transient network/primary-failover errors instead of surfacing them to the app.
- 3. Where should you create indexes — in app boot or migrations? — Migrations (one-off jobs); boot-time `createIndex` causes thundering-herd on multi-replica deployments.
- 4. What's the right health-check command? — `db.admin().ping()` — a lightweight admin command, not a query against your data.
- 5. What does `appName` do? — Tags all your connections in `currentOp` and logs so DBAs can identify which service is running which queries.

### Mini Project

Wire a Fastify Service to MongoDB: A Node service with `/healthz`, `/readyz`, three CRUD endpoints for an `items` collection, and a migration script for indexes — using a singleton MongoClient with proper retry and graceful shutdown. Suggested approach:
  - Create `src/db/client.js` exporting a singleton MongoClient with `retryWrites`, `w: "majority"`, `appName`, tuned pool size
  - Create `migrations/001-items-indexes.js` that creates `{ name: 1 }` and `{ createdAt: -1 }` indexes
  - Build Fastify routes `POST /items`, `GET /items/:id`, `GET /items` with keyset pagination
  - Add `/healthz` (always 200) and `/readyz` (uses `db.admin().ping()`)
  - Wire `SIGTERM` to close Fastify then close the MongoClient before exit

### Exercises

1. Build a singleton `MongoClient` module; confirm two routes share the same pool via `db.serverStatus().connections`.
2. Write a migration script that creates two indexes; run it as a standalone script (NOT in app boot).
3. Add `retryWrites=true` and a `withRetry` wrapper to a `findOne` route; verify it survives a replica-set failover.
4. Implement `/healthz` and `/readyz`; verify `/readyz` returns 503 when MongoDB is unreachable.
5. >>> QUIZ (Stage 20) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How many MongoClients should a process create?
8. A) One per request
9. B) One per collection
10. C) One per query
11. D) One per process (singleton) holding a connection pool (*)
12. Explanation: MongoClient holds a connection pool; one per process reuses connections. Per-request clients exhaust connections and slow startup.
13. Q2: Where should index creation live in a multi-replica deployment?
14. A) A migration script run as a one-off job (*)
15. B) App boot code
16. C) The connection string
17. D) Nowhere — indexes auto-create
18. Explanation: Boot-time `createIndex` causes thundering-herd on multi-replica deployments; run a migration script as an init container or one-off job so indexes are created exactly once.
19. Q3: What does `retryWrites=true` do?
20. A) Retries failed reads
21. B) Lets the driver retry single-doc writes on transient errors / primary failover (*)
22. C) Disables write concern
23. D) Forces transactions
24. Explanation: `retryWrites=true` (default in modern drivers) retries single-document writes once on transient network errors or primary failover, so the app sees fewer hard errors.
25. Q4: Which is the right health-check command?
26. A) findOne({})
27. B) aggregate $count
28. C) db.admin().ping() (*)
29. D) listCollections
30. Explanation: `db.admin().ping()` is a lightweight admin command that doesn't touch your data; using `findOne({})` or any data query adds avoidable load on every probe.
31. Q5: What's the default `maxPoolSize` for the Node driver?
32. A) 10
33. B) 1000
34. C) Unlimited
35. D) 100 (*)
36. Explanation: Default is 100 connections per MongoClient; tune per service. Too low throttles under load, too high overwhelms the server.
37. Q6: What does `appName` in the connection string do?
38. A) Tags connections in currentOp and logs so DBAs can identify the service (*)
39. B) Names the database
40. C) Sets the auth user
41. D) Enables Atlas Search
42. Explanation: `appName=orders-api` appears in `db.currentOp()` and mongod logs so DBAs can trace which service runs which queries — essential in multi-service estates.
43. Q7: Why should app boot NOT call `createIndex` on every startup?
44. A) Indexes aren't persisted
45. B) Multi-replica deployments race to create the same index, causing lock contention (*)
46. C) createIndex is deprecated
47. D) It requires admin auth
48. Explanation: Each replica calling `createIndex` at boot races, causing lock contention and slow startups. Use a migration job instead.
49. Q8: Which connection-string parameter is recommended for production?
50. A) retryWrites=false
51. B) w=1
52. C) w=majority&retryWrites=true (*)
53. D) maxPoolSize=1
54. Explanation: `w=majority&retryWrites=true` ensures durable writes (survive failover) and retries single-doc writes on transient errors — the production-safe default.
55. Q9: What should a graceful shutdown do with the MongoClient?
56. A) Skip closing — the OS handles it
57. B) Close it immediately on SIGTERM
58. C) Never close it
59. D) Close it after stopping HTTP traffic so in-flight ops finish (*)
60. Explanation: On SIGTERM: stop accepting new HTTP connections, let in-flight requests finish, then `await client.close()` to drain the pool, then exit. Sudden close drops in-flight ops.
61. Q10: What's a benefit of command monitoring (`monitorCommands: true`)?
62. A) Lets you log slow queries to observability for continuous tuning (*)
63. B) Faster queries
64. C) Caches query results
65. D) Encrypts commands
66. Explanation: Command monitoring emits `commandSucceeded`/`commandFailed` events with durations; you can log slow queries (>100ms) to a central observability stack for continuous performance tuning.
67. ----------------------------------------------------------------------
68. ======================================================================

```quiz
- id: q1
  question: How many MongoClients should a process create?
  options:
    - One per request
    - One per collection
    - One per query
    - One per process (singleton) holding a connection pool
  correctIndex: 3
  explanation: MongoClient holds a connection pool; one per process reuses connections. Per-request clients exhaust connections and slow startup.
- id: q2
  question: Where should index creation live in a multi-replica deployment?
  options:
    - A migration script run as a one-off job
    - App boot code
    - The connection string
    - Nowhere — indexes auto-create
  correctIndex: 0
  explanation: Boot-time `createIndex` causes thundering-herd on multi-replica deployments; run a migration script as an init container or one-off job so indexes are created exactly once.
- id: q3
  question: What does `retryWrites=true` do?
  options:
    - Retries failed reads
    - Lets the driver retry single-doc writes on transient errors / primary failover
    - Disables write concern
    - Forces transactions
  correctIndex: 1
  explanation: "`retryWrites=true` (default in modern drivers) retries single-document writes once on transient network errors or primary failover, so the app sees fewer hard errors."
- id: q4
  question: Which is the right health-check command?
  options:
    - findOne({})
    - aggregate $count
    - db.admin().ping()
    - listCollections
  correctIndex: 2
  explanation: "`db.admin().ping()` is a lightweight admin command that doesn't touch your data; using `findOne({})` or any data query adds avoidable load on every probe."
- id: q5
  question: What's the default `maxPoolSize` for the Node driver?
  options:
    - "10"
    - "1000"
    - Unlimited
    - "100"
  correctIndex: 3
  explanation: Default is 100 connections per MongoClient; tune per service. Too low throttles under load, too high overwhelms the server.
- id: q6
  question: What does `appName` in the connection string do?
  options:
    - Tags connections in currentOp and logs so DBAs can identify the service
    - Names the database
    - Sets the auth user
    - Enables Atlas Search
  correctIndex: 0
  explanation: "`appName=orders-api` appears in `db.currentOp()` and mongod logs so DBAs can trace which service runs which queries — essential in multi-service estates."
- id: q7
  question: Why should app boot NOT call `createIndex` on every startup?
  options:
    - Indexes aren't persisted
    - Multi-replica deployments race to create the same index, causing lock contention
    - createIndex is deprecated
    - It requires admin auth
  correctIndex: 1
  explanation: Each replica calling `createIndex` at boot races, causing lock contention and slow startups. Use a migration job instead.
- id: q8
  question: Which connection-string parameter is recommended for production?
  options:
    - retryWrites=false
    - w=1
    - w=majority&retryWrites=true
    - maxPoolSize=1
  correctIndex: 2
  explanation: "`w=majority&retryWrites=true` ensures durable writes (survive failover) and retries single-doc writes on transient errors — the production-safe default."
- id: q9
  question: What should a graceful shutdown do with the MongoClient?
  options:
    - Skip closing — the OS handles it
    - Close it immediately on SIGTERM
    - Never close it
    - Close it after stopping HTTP traffic so in-flight ops finish
  correctIndex: 3
  explanation: "On SIGTERM: stop accepting new HTTP connections, let in-flight requests finish, then `await client.close()` to drain the pool, then exit. Sudden close drops in-flight ops."
- id: q10
  question: "What's a benefit of command monitoring (`monitorCommands: true`)?"
  options:
    - Lets you log slow queries to observability for continuous tuning
    - Faster queries
    - Caches query results
    - Encrypts commands
  correctIndex: 0
  explanation: Command monitoring emits `commandSucceeded`/`commandFailed` events with durations; you can log slow queries (>100ms) to a central observability stack for continuous performance tuning.
```

