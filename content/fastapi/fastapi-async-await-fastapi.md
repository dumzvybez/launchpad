---
slug: fastapi-async-await-fastapi
id: fastapi-09
track: fastapi
order: 9
title: async/await in FastAPI
description: Master async route handlers, recognize the blocking-call trap, offload blocking work via `run_in_threadpool` and `asyncio.to_thread`, and reason about concurrency vs parallelism in a single worker.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=2400s
whyItMatters: Master async route handlers, recognize the blocking-call trap, offload blocking work via `run_in_threadpool` and `asyncio. to_thread`, and reason about concurrency vs parallelism in a single worker.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# async/await in FastAPI

## async/await in FastAPI

### Why It Matters

Master async route handlers, recognize the blocking-call trap, offload blocking work via `run_in_threadpool` and `asyncio. to_thread`, and reason about concurrency vs parallelism in a single worker.

Master async route handlers, recognize the blocking-call trap, offload blocking work via `run_in_threadpool` and `asyncio.to_thread`, and reason about concurrency vs parallelism in a single worker.

### Prerequisites

- Stage 1: Getting Started with FastAPI
- Stage 8: Database Integration with SQLAlchemy and Alembic
- Basic understanding of Python's `asyncio`.

### Topics

- The event loop and one-thread-per-process model
- `async def` route handlers run on the loop; `def` handlers run in a threadpool
- The blocking-call trap: `requests.get`, `time.sleep`, sync DB drivers in `async def`
- `starlette.concurrency.run_in_threadpool` for blocking calls
- `asyncio.to_thread` (Python 3.9+) as a stdlib alternative
- Async HTTP clients (`httpx.AsyncClient`) for downstream calls
- Concurrency with `asyncio.gather` and `asyncio.create_task`
- Cancellation, timeouts, and `asyncio.wait_for`

### Key Concepts

- A single Uvicorn worker has one event loop; an `async def` handler that blocks stalls every other in-flight request on that worker.
- Mixing `await`-able libraries (`httpx`, `asyncpg`, `aioredis`) with blocking ones (`requests`, `psycopg2`, `boto3`) requires `run_in_threadpool` for the blocking calls.
- `def` handlers are dispatched to a threadpool (default 40 threads); use them when no async library is available.
- `asyncio.gather(*tasks)` runs coroutines concurrently and returns results in order; one task raising cancels the others by default.
- Always set timeouts on downstream calls: `asyncio.wait_for`, `httpx.AsyncClient(timeout=...)`, or `asyncio.timeout()`.

```python
import requests  # BAD: blocking
from fastapi import FastAPI

app = FastAPI()

@app.get("/weather")
async def weather(city: str):
    r = requests.get(f"https://api.weather.example/{city}")  # blocks loop!
    return r.json()
```
Caption: Blocking call in async route — DON'T

### Common Pitfalls

- Calling `requests.get`, `time.sleep`, or `psycopg2` inside `async def` — blocks the event loop and every concurrent request on that worker.
- Using `def` handlers when async libraries exist — you forfeit concurrency; an `async def` with `httpx.AsyncClient` is faster under load.
- Forgetting `return_exceptions=True` on `asyncio.gather` — one failing task cancels the others; use this flag to collect all results.
- Awaiting blocking sync code via `await some_sync_func()` — sync funcs don't return awaitables; this either raises or silently does nothing useful. Use `run_in_threadpool`.
- Not setting timeouts on downstream HTTP calls — a slow backend stalls your route; always pass `timeout=` to `httpx.AsyncClient`.

### Real-World Applications

- Netflix's API gateway fans out to dozens of upstream services with `asyncio.gather`, which is the canonical FastAPI pattern for aggregator endpoints.
- Uber's trip-execution service calls ETA, pricing, and routing services concurrently; FastAPI's async handlers + httpx match this pattern.
- Microsoft's Azure SDK ships async clients (`azure-identity-aio`, `azure-storage-blob-aio`) precisely so FastAPI services can call Azure without blocking.
- OpenAI's Python SDK now ships an async client (`AsyncOpenAI`) for use inside FastAPI services that stream completions.

### Interview Questions

- 1. What happens if you call `requests.get` inside an `async def` route? — It blocks the event loop, stalling every concurrent request on that worker.
- 2. How do you call a blocking library (boto3, requests) from an async route? — Wrap it in `await run_in_threadpool(func, *args)` or `asyncio.to_thread(func, *args)`.
- 3. What's the difference between `def` and `async def` route handlers? — `def` handlers run in a threadpool (40 threads default); `async def` handlers run on the event loop.
- 4. How do you fan out to N concurrent downstream calls? — Build a list of coroutines and `await asyncio.gather(*coros, return_exceptions=True)`.
- 5. Why must every downstream HTTP call have a timeout? — Without one, a slow backend can stall your worker indefinitely; pass `timeout=` to `httpx.AsyncClient`.

### Mini Project

Build a "Multi-Source Aggregator" API: A `/summary?q=...` endpoint that fans out to three mock downstream HTTP services (each with a 200-800ms delay) and returns the merged JSON. Use `httpx.AsyncClient`, `asyncio.gather(return_exceptions=True)`, and per-call timeouts. Suggested approach:
  - Spin up three mock services (or use `httpbin.org/delay/N`)
  - Create one shared `httpx.AsyncClient(timeout=2.0)`
  - Use `asyncio.gather(*[fetch(c, url) for url in urls], return_exceptions=True)`
  - Filter out exceptions and return successful results
  - Compare latency: serial (sum of delays) vs concurrent (max delay)

### Exercises

1. Write an `async def` route that calls `requests.get` and observe throughput drop under load (use `hey` or `locust`).
2. Replace `requests` with `httpx.AsyncClient` and re-run the load test; plot the difference.
3. Use `run_in_threadpool` to call `boto3.client("s3").list_buckets()` from an async route.
4. Build a `/fanout` route that calls 5 URLs concurrently with `asyncio.gather(return_exceptions=True)` and returns the results.
5. >>> QUIZ (Stage 9) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What happens if you call `requests.get()` inside an `async def` route?
8. A) It blocks the event loop, stalling all concurrent requests on the worker (*)
9. B) It runs concurrently
10. C) It raises ImportError
11. D) FastAPI auto-wraps it in a thread
12. Explanation: `requests` is synchronous; calling it in an `async def` blocks the event loop. Use `httpx.AsyncClient` or `run_in_threadpool`.
13. Q2: How do you call a blocking function (e.g., boto3) from an async route?
14. A) `await func()`
15. B) `await run_in_threadpool(func, *args)` (*)
16. C) `asyncio.run(func())`
17. D) `func.sync_call()`
18. Explanation: `run_in_threadpool` (or `asyncio.to_thread`) runs the blocking function in a thread and awaits its result.
19. Q3: What's the default threadpool size for `def` handlers in Starlette?
20. A) 1
21. B) 4
22. C) 40 (*)
23. D) 1000
24. Explanation: Starlette's default `anyio.to_thread` limiter is 40 tokens; if you exceed it, requests queue.
25. Q4: Which is a correct way to run N downstream calls concurrently?
26. A) `for u in urls: await fetch(u)`
27. B) `await asyncio.run(*[fetch(u) for u in urls])`
28. C) `await [fetch(u) for u in urls]`
29. D) `await asyncio.gather(*[fetch(u) for u in urls])` (*)
30. Explanation: `asyncio.gather(*coros)` schedules all coroutines concurrently and returns results in argument order.
31. Q5: What does `return_exceptions=True` do in `asyncio.gather`?
32. A) Returns exceptions as result values instead of raising (*)
33. B) Re-raises the first exception
34. C) Suppresses all exceptions silently
35. D) Cancels the other tasks
36. Explanation: With this flag, a failing task returns the Exception object instead of cancelling the others — useful for partial-success aggregators.
37. Q6: Which is an async HTTP client?
38. A) requests
39. B) httpx.AsyncClient (*)
40. C) aiohttp.requests (does not exist)
41. D) curl
42. Explanation: `httpx.AsyncClient` and `aiohttp.ClientSession` are async; `requests` is sync only.
43. Q7: Why must every downstream HTTP call have a timeout?
44. A) To improve throughput
45. B) To save bandwidth
46. C) To prevent a slow backend from stalling your worker indefinitely (*)
47. D) It's required by HTTP/2
48. Explanation: Without a timeout, a hung backend stalls your route and exhausts the worker's capacity.
49. Q8: Which is a benefit of `async def` over `def` for I/O-bound handlers?
50. A) It uses less memory per request
51. B) It's always faster for CPU-bound work
52. C) It disables CORS
53. D) It can handle many concurrent I/O-bound requests on one event loop (*)
54. Explanation: A single event loop can juggle thousands of awaiting I/O operations, whereas thread-based concurrency is capped by the threadpool.
55. Q9: What does `asyncio.wait_for(coro, timeout=2.0)` do?
56. A) Awaits `coro` and raises `asyncio.TimeoutError` if it doesn't finish in 2 seconds (*)
57. B) Waits 2 seconds before starting
58. C) Sleeps for 2 seconds
59. D) Cancels the loop after 2 seconds
60. Explanation: `wait_for` enforces a timeout; on expiry it cancels the wrapped coroutine and raises `TimeoutError`.
61. Q10: Which is true about `def` route handlers?
62. A) They run on the event loop
63. B) They run in a threadpool managed by Starlette (*)
64. C) They can't access `Depends`
65. D) They can't be rate-limited
66. Explanation: Plain `def` handlers are dispatched to a threadpool (40 threads default) so blocking I/O doesn't stall the event loop.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if you call `requests.get()` inside an `async def` route?
  options:
    - It blocks the event loop, stalling all concurrent requests on the worker
    - It runs concurrently
    - It raises ImportError
    - FastAPI auto-wraps it in a thread
  correctIndex: 0
  explanation: "`requests` is synchronous; calling it in an `async def` blocks the event loop. Use `httpx.AsyncClient` or `run_in_threadpool`."
- id: q2
  question: How do you call a blocking function (e.g., boto3) from an async route?
  options:
    - "`await func()`"
    - "`await run_in_threadpool(func, *args)`"
    - "`asyncio.run(func())`"
    - "`func.sync_call()`"
  correctIndex: 1
  explanation: "`run_in_threadpool` (or `asyncio.to_thread`) runs the blocking function in a thread and awaits its result."
- id: q3
  question: What's the default threadpool size for `def` handlers in Starlette?
  options:
    - "1"
    - "4"
    - "40"
    - "1000"
  correctIndex: 2
  explanation: Starlette's default `anyio.to_thread` limiter is 40 tokens; if you exceed it, requests queue.
- id: q4
  question: Which is a correct way to run N downstream calls concurrently?
  options:
    - "`for u in urls: await fetch(u)`"
    - "`await asyncio.run(*[fetch(u) for u in urls])`"
    - "`await [fetch(u) for u in urls]`"
    - "`await asyncio.gather(*[fetch(u) for u in urls])`"
  correctIndex: 3
  explanation: "`asyncio.gather(*coros)` schedules all coroutines concurrently and returns results in argument order."
- id: q5
  question: What does `return_exceptions=True` do in `asyncio.gather`?
  options:
    - Returns exceptions as result values instead of raising
    - Re-raises the first exception
    - Suppresses all exceptions silently
    - Cancels the other tasks
  correctIndex: 0
  explanation: With this flag, a failing task returns the Exception object instead of cancelling the others — useful for partial-success aggregators.
- id: q6
  question: Which is an async HTTP client?
  options:
    - requests
    - httpx.AsyncClient
    - aiohttp.requests (does not exist)
    - curl
  correctIndex: 1
  explanation: "`httpx.AsyncClient` and `aiohttp.ClientSession` are async; `requests` is sync only."
- id: q7
  question: Why must every downstream HTTP call have a timeout?
  options:
    - To improve throughput
    - To save bandwidth
    - To prevent a slow backend from stalling your worker indefinitely
    - It's required by HTTP/2
  correctIndex: 2
  explanation: Without a timeout, a hung backend stalls your route and exhausts the worker's capacity.
- id: q8
  question: Which is a benefit of `async def` over `def` for I/O-bound handlers?
  options:
    - It uses less memory per request
    - It's always faster for CPU-bound work
    - It disables CORS
    - It can handle many concurrent I/O-bound requests on one event loop
  correctIndex: 3
  explanation: A single event loop can juggle thousands of awaiting I/O operations, whereas thread-based concurrency is capped by the threadpool.
- id: q9
  question: What does `asyncio.wait_for(coro, timeout=2.0)` do?
  options:
    - Awaits `coro` and raises `asyncio.TimeoutError` if it doesn't finish in 2 seconds
    - Waits 2 seconds before starting
    - Sleeps for 2 seconds
    - Cancels the loop after 2 seconds
  correctIndex: 0
  explanation: "`wait_for` enforces a timeout; on expiry it cancels the wrapped coroutine and raises `TimeoutError`."
- id: q10
  question: Which is true about `def` route handlers?
  options:
    - They run on the event loop
    - They run in a threadpool managed by Starlette
    - They can't access `Depends`
    - They can't be rate-limited
  correctIndex: 1
  explanation: Plain `def` handlers are dispatched to a threadpool (40 threads default) so blocking I/O doesn't stall the event loop.
```

