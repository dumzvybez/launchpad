---
slug: fastapi-performance-async-db-drivers-connection-pooling-profiling
id: fastapi-19
track: fastapi
order: 19
title: Performance — async DB drivers, connection pooling, profiling
description: Size your DB connection pool, choose the right async driver, profile slow routes with `pyinstrument` and `py-spy`, log p95 latencies, and avoid the most common FastAPI performance bugs.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=5400s
whyItMatters: Size your DB connection pool, choose the right async driver, profile slow routes with `pyinstrument` and `py-spy`, log p95 latencies, and avoid the most common FastAPI performance bugs.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Performance — async DB drivers, connection pooling, profiling

## Performance — async DB drivers, connection pooling, profiling

### Why It Matters

Size your DB connection pool, choose the right async driver, profile slow routes with `pyinstrument` and `py-spy`, log p95 latencies, and avoid the most common FastAPI performance bugs.

Size your DB connection pool, choose the right async driver, profile slow routes with `pyinstrument` and `py-spy`, log p95 latencies, and avoid the most common FastAPI performance bugs.

### Prerequisites

- Stage 8: Database Integration with SQLAlchemy and Alembic
- Stage 9: async/await in FastAPI
- Stage 11: Middleware, CORS, and Custom Middleware

### Topics

- `create_async_engine` pool sizing: `pool_size`, `max_overflow`, `pool_pre_ping`, `pool_recycle`
- Async driver selection: `asyncpg` (Postgres), `aiomysql` (MySQL), `aiosqlite` (SQLite)
- Avoiding N+1 with `selectinload` / `joinedload`
- Profiling with `pyinstrument` (in-process) and `py-spy` (sampling)
- Structured access logs with `X-Elapsed-Ms` and p50/p95/p99
- Worker count: Uvicorn `-w` and Gunicorn `-k uvicorn.workers.UvicornWorker`
- `GZipMiddleware`, response compression, and `response_model_exclude_none`
- Caching, batching, and avoiding serialization overhead

### Key Concepts

- The pool size is per-worker; with N workers and `pool_size=10`, you have N*10 connections — make sure Postgres `max_connections` accommodates it.
- `pool_pre_ping=True` detects dropped connections; `pool_recycle=3600` prevents stale connections behind firewalls.
- N+1 is the #1 FastAPI DB perf bug; use `selectinload` for collections and `joinedload` for one-to-one.
- Profile before optimizing: `pyinstrument` shows where time goes; `py-spy record` profiles production with low overhead.
- Worker count: `(2 * CPU) + 1` is a Gunicorn rule of thumb; for I/O-bound FastAPI, fewer workers + async may suffice.

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "postgresql+asyncpg://u:p@localhost/db",
    pool_size=10,
    max_overflow=5,
    pool_pre_ping=True,   # detect dropped connections
    pool_recycle=3600,    # recycle hourly
    echo=False,           # set True to log SQL (dev only)
)
```
Caption: Pool-sized async engine

### Common Pitfalls

- Setting `pool_size=20` per worker with 10 workers behind one Postgres (`max_connections=100`) — you exhaust connections; size for the fleet, not the worker.
- Forgetting `pool_pre_ping=True` — stale connections behind AWS RDS proxies cause 500s; pre-ping catches them.
- Using `selectinload` everywhere — it's great for collections but `joinedload` is better for one-to-one; choose per relationship.
- Profiling only in dev — production behavior differs; use `py-spy record` in staging or low-rate sampling in prod.
- Setting `--workers 16` on a 2-CPU box — context-switching overhead dominates; start with `(2*CPU)+1` and tune from load tests.

### Real-World Applications

- Netflix tunes per-worker pool sizes against a sharded Postgres cluster with strict `max_connections` budgets; FastAPI teams must do the same arithmetic.
- Uber's connection-pool sizing is automated based on traffic forecasts; the `pool_size + max_overflow` math applies to SQLAlchemy too.
- Microsoft's Azure docs recommend `pool_pre_ping=True` and `pool_recycle=1800` for apps behind Azure SQL Gateway.
- OpenAI's inference services use profiling (py-spy) to find slow async paths; the same tools work on FastAPI.

### Interview Questions

- 1. How do you size a DB connection pool for N Uvicorn workers? — `(pool_size + max_overflow) * N` must be ≤ Postgres `max_connections`; budget for migrations and other clients.
- 2. What does `pool_pre_ping=True` do? — Sends a cheap `SELECT 1` before checkout to detect dropped connections (avoids 500s on stale sockets).
- 3. How do you avoid N+1? — Use `selectinload(Relationship)` for collections and `joinedload` for one-to-one; verify with a query-count assertion.
- 4. How would you profile a slow FastAPI route? — Add a `pyinstrument` middleware that profiles when `?profile=1`, or sample with `py-spy record` in staging.
- 5. What's the worker-count rule of thumb for I/O-bound FastAPI? — Start with `(2*CPU)+1`; for heavily I/O-bound workloads, fewer workers + larger event-loop concurrency may suffice.

### Mini Project

Build a "Profile + Tune" Loop: Take a small FastAPI app with an N+1 list endpoint; profile it with `pyinstrument` middleware, fix the N+1 with `selectinload`, add a slow-query log middleware (warn >200ms), and tune the async engine pool. Suggested approach:
  - Add `pyinstrument` middleware triggered by `?profile=1`
  - Confirm the N+1 in the profile output
  - Replace the lazy load with `selectinload(Post.author)`
  - Re-profile and confirm the N+1 is gone
  - Set `pool_size=10, max_overflow=5, pool_pre_ping=True`

### Exercises

1. Set `echo=True` on the async engine and count queries for a list route; identify N+1.
2. Add `selectinload` and re-count; verify the query count drops.
3. Add a `pyinstrument` middleware and visit `/?profile=1` to read the profile.
4. Configure Gunicorn with `UvicornWorker` and `-w 4`; benchmark with `hey` or `wrk`.
5. >>> QUIZ (Stage 19) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How do you size a DB pool for N Uvicorn workers?
8. A) One pool shared by all workers
9. B) Set pool_size = N
10. C) `(pool_size + max_overflow) * N` must be ≤ Postgres max_connections (*)
11. D) Pool size doesn't matter with async
12. Explanation: Each worker has its own pool; total connections = (pool_size + max_overflow) * workers; this must fit within the DB's max_connections.
13. Q2: What does `pool_pre_ping=True` do?
14. A) Pings the application
15. B) Compresses queries
16. C) Disables the pool
17. D) Sends SELECT 1 before checkout to detect dropped connections (*)
18. Explanation: Pre-ping catches stale connections (e.g., killed by a proxy) before they're handed to a request, preventing 500s.
19. Q3: Which loading strategy is best for one-to-one relationships?
20. A) joinedload (*)
21. B) selectinload
22. C) lazyload
23. D) subqueryload
24. Explanation: `joinedload` does a single SQL with a JOIN — ideal for one-to-one; `selectinload` is better for collections (avoids cartesian products).
25. Q4: Which tool profiles a FastAPI route in-process?
26. A) py-spy
27. B) pyinstrument (via middleware) (*)
28. C) cProfile alone
29. D) strace
30. Explanation: `pyinstrument` integrates as an `@app.middleware("http")` that profiles when triggered; `py-spy` is for sampling production from outside.
31. Q5: What's the worker-count rule of thumb?
32. A) 1 worker always
33. B) 100 workers
34. C) `(2 * CPU) + 1` (tune from load tests) (*)
35. D) Workers don't matter for async
36. Explanation: `(2*CPU)+1` is the classic Gunicorn starting point; for I/O-bound workloads you may go lower with larger event-loop concurrency.
37. Q6: Why enable `pool_recycle`?
38. A) To improve query speed
39. B) To reduce memory
40. C) To disable transactions
41. D) To prevent connections going stale behind firewalls/proxies (*)
42. Explanation: `pool_recycle=3600` recycles connections hourly, sidestepping idle-timeout kills from network firewalls or DB proxies.
43. Q7: Which async driver is correct for Postgres?
44. A) asyncpg (URL: postgresql+asyncpg) (*)
45. B) psycopg2
46. C) pymysql
47. D) sqlite3
48. Explanation: `asyncpg` is the high-performance async Postgres driver; `psycopg2` is sync (use `psycopg` v3 with async mode as an alternative).
49. Q8: What does a slow-query log middleware do?
50. A) Cancels slow queries
51. B) Logs routes that exceed a threshold (e.g., 200ms) for follow-up profiling (*)
52. C) Speeds up queries
53. D) Replaces py-spy
54. Explanation: A timing middleware logs warnings for slow routes; combined with `X-Elapsed-Ms` it lets you find p95 outliers in production.
55. Q9: Why avoid `--workers 16` on a 2-CPU box?
56. A) It's against the law
57. B) Workers can't exceed CPUs
58. C) Context-switching overhead dominates; start with (2*CPU)+1 and tune (*)
59. D) It crashes Uvicorn
60. Explanation: Too many workers on few CPUs causes context-switch thrashing; the rule of thumb is `(2*CPU)+1`, tuned from benchmarks.
61. Q10: Which middleware can reduce network bytes for large JSON?
62. A) CORSMiddleware
63. B) TrustedHostMiddleware
64. C) HTTPSRedirectMiddleware
65. D) GZipMiddleware (*)
66. Explanation: `GZipMiddleware` compresses large responses (above `minimum_size`); combined with `response_model_exclude_none` it minimizes payload size.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you size a DB pool for N Uvicorn workers?
  options:
    - One pool shared by all workers
    - Set pool_size = N
    - "`(pool_size + max_overflow) * N` must be ≤ Postgres max_connections"
    - Pool size doesn't matter with async
  correctIndex: 2
  explanation: Each worker has its own pool; total connections = (pool_size + max_overflow) * workers; this must fit within the DB's max_connections.
- id: q2
  question: What does `pool_pre_ping=True` do?
  options:
    - Pings the application
    - Compresses queries
    - Disables the pool
    - Sends SELECT 1 before checkout to detect dropped connections
  correctIndex: 3
  explanation: Pre-ping catches stale connections (e.g., killed by a proxy) before they're handed to a request, preventing 500s.
- id: q3
  question: Which loading strategy is best for one-to-one relationships?
  options:
    - joinedload
    - selectinload
    - lazyload
    - subqueryload
  correctIndex: 0
  explanation: "`joinedload` does a single SQL with a JOIN — ideal for one-to-one; `selectinload` is better for collections (avoids cartesian products)."
- id: q4
  question: Which tool profiles a FastAPI route in-process?
  options:
    - py-spy
    - pyinstrument (via middleware)
    - cProfile alone
    - strace
  correctIndex: 1
  explanation: '`pyinstrument` integrates as an `@app.middleware("http")` that profiles when triggered; `py-spy` is for sampling production from outside.'
- id: q5
  question: What's the worker-count rule of thumb?
  options:
    - 1 worker always
    - 100 workers
    - "`(2 * CPU) + 1` (tune from load tests)"
    - Workers don't matter for async
    - +1` is the classic Gunicorn starting point; for I/O-bound workloads you may go lower with larger event-loop concurrency.
  correctIndex: 2
  explanation: "`(2*CPU)+1` is the classic Gunicorn starting point; for I/O-bound workloads you may go lower with larger event-loop concurrency."
- id: q6
  question: Why enable `pool_recycle`?
  options:
    - To improve query speed
    - To reduce memory
    - To disable transactions
    - To prevent connections going stale behind firewalls/proxies
  correctIndex: 3
  explanation: "`pool_recycle=3600` recycles connections hourly, sidestepping idle-timeout kills from network firewalls or DB proxies."
- id: q7
  question: Which async driver is correct for Postgres?
  options:
    - "asyncpg (URL: postgresql+asyncpg)"
    - psycopg2
    - pymysql
    - sqlite3
  correctIndex: 0
  explanation: "`asyncpg` is the high-performance async Postgres driver; `psycopg2` is sync (use `psycopg` v3 with async mode as an alternative)."
- id: q8
  question: What does a slow-query log middleware do?
  options:
    - Cancels slow queries
    - Logs routes that exceed a threshold (e.g., 200ms) for follow-up profiling
    - Speeds up queries
    - Replaces py-spy
  correctIndex: 1
  explanation: A timing middleware logs warnings for slow routes; combined with `X-Elapsed-Ms` it lets you find p95 outliers in production.
- id: q9
  question: Why avoid `--workers 16` on a 2-CPU box?
  options:
    - It's against the law
    - Workers can't exceed CPUs
    - Context-switching overhead dominates; start with (2*CPU)+1 and tune
    - It crashes Uvicorn
    - +1`, tuned from benchmarks.
  correctIndex: 2
  explanation: Too many workers on few CPUs causes context-switch thrashing; the rule of thumb is `(2*CPU)+1`, tuned from benchmarks.
- id: q10
  question: Which middleware can reduce network bytes for large JSON?
  options:
    - CORSMiddleware
    - TrustedHostMiddleware
    - HTTPSRedirectMiddleware
    - GZipMiddleware
  correctIndex: 3
  explanation: "`GZipMiddleware` compresses large responses (above `minimum_size`); combined with `response_model_exclude_none` it minimizes payload size."
```

