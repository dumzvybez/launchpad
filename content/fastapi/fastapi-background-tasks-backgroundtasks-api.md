---
slug: fastapi-background-tasks-backgroundtasks-api
id: fastapi-10
track: fastapi
order: 10
title: Background Tasks and the BackgroundTasks API
description: Use FastAPI's `BackgroundTasks` for fire-and-forget post-response work (emails, log writes, cache invalidation), and learn when to graduate to a real task queue (Celery, RQ, Arq).
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=2700s
whyItMatters: Use FastAPI's `BackgroundTasks` for fire-and-forget post-response work (emails, log writes, cache invalidation), and learn when to graduate to a real task queue (Celery, RQ, Arq).
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Background Tasks and the BackgroundTasks API

## Background Tasks and the BackgroundTasks API

### Why It Matters

Use FastAPI's `BackgroundTasks` for fire-and-forget post-response work (emails, log writes, cache invalidation), and learn when to graduate to a real task queue (Celery, RQ, Arq).

Use FastAPI's `BackgroundTasks` for fire-and-forget post-response work (emails, log writes, cache invalidation), and learn when to graduate to a real task queue (Celery, RQ, Arq).

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 9: async/await in FastAPI
- Familiarity with the request/response lifecycle.

### Topics

- `BackgroundTasks` injected via `Depends` or directly
- Adding sync and async callables with `tasks.add_task(fn, *args, **kwargs)`
- Tasks run after the response is sent — not in a separate process
- The single-process, single-worker limitation
- When to use `BackgroundTasks` vs Celery / RQ / Arq / Dramatiq
- Database writes after response (visibility vs consistency tradeoff)
- Error handling: failed tasks silently disappear unless logged
- Long-running tasks belong in a queue, not BackgroundTasks

### Key Concepts

- `BackgroundTasks` runs in the same process, after the response is sent — perfect for sub-second work.
- If the worker restarts (or crashes) before the task runs, it's lost — no durability guarantee.
- For multi-second or retryable work, use a real queue (Celery, Arq, RQ, Dramatiq) backed by Redis/RabbitMQ.
- Don't put critical writes (charge a card, send a contract) in `BackgroundTasks` — if it fails, the user already got a 200.
- Tasks can be sync or async; Starlette runs them appropriately.

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_welcome_email(email: str):
    # imagine smtplib send
    print(f"Sending welcome email to {email}")

@app.post("/signup")
async def signup(email: str, tasks: BackgroundTasks):
    tasks.add_task(send_welcome_email, email)
    return {"status": "signed up"}
```
Caption: Basic BackgroundTasks

### Common Pitfalls

- Treating `BackgroundTasks` as durable — they're not; a worker crash or restart loses pending tasks, so don't use them for billing-critical work.
- Running multi-minute tasks in `BackgroundTasks` — they block the worker's response-sending capacity; use Celery/Arq for long work.
- Forgetting to log exceptions — tasks fail silently; wrap each task in try/except and log.
- Adding tasks after returning the response — they must be added before the handler returns; once the response is sent, the handler is done.
- Using `BackgroundTasks` across multiple workers expecting shared state — tasks run on the receiving worker only; shared state must live in Redis or the DB.

### Real-World Applications

- Stripe uses background workers (separate queue, not the request path) to send receipts and update invoices — the request returns 200 immediately and the queue handles the rest.
- Uber's trip-completion flow enqueues receipts, push notifications, and ETL jobs — never on the request thread; FastAPI's BackgroundTasks is the small-scale analog.
- Microsoft's email-verification pattern sends the email after the signup response — a classic BackgroundTasks use case at small scale.
- Netflix's playback-event ingestion buffers small writes to Redis before flushing to a queue; `BackgroundTasks` is fine for the buffer flush step.

### Interview Questions

- 1. When is `BackgroundTasks` appropriate vs Celery? — Use BackgroundTasks for sub-second, non-critical work in the same process; use Celery/Arq for durable, retryable, multi-second work.
- 2. What's the durability guarantee of `BackgroundTasks`? — None; if the worker crashes before the task runs, it's lost.
- 3. When do background tasks run relative to the response? — After the response is sent to the client; the handler returns, then the tasks execute.
- 4. Can `BackgroundTasks` run async functions? — Yes; Starlette awaits async tasks and runs sync tasks in the threadpool.
- 5. Why mustn't you put billing-critical writes in `BackgroundTasks`? — The client already received 200; if the task fails, the charge is lost with no retry path.

### Mini Project

Build a "Signup + Welcome Email" Flow: A POST `/signup` endpoint that creates a user (in-memory list), returns 201 immediately, and uses `BackgroundTasks` to simulate sending a welcome email after a 1-second delay. Add an `/users` endpoint to list signups. Suggested approach:
  - Maintain `USERS: list[dict] = []` at module scope
  - Define `def send_welcome_email(email): time.sleep(1); print(f"sent to {email}")`
  - Inject `tasks: BackgroundTasks`, call `tasks.add_task(send_welcome_email, payload.email)`
  - Return `{"id": len(USERS), "email": payload.email}` with 201
  - Verify the response returns instantly and the print fires ~1s later

### Exercises

1. Add a `BackgroundTasks` call that writes a log line after each request; verify the response isn't delayed.
2. Add try/except + `logging.exception` inside a task and trigger a failure; confirm the response was still 200.
3. Compare with a sleep(5) task: observe the worker is busy and can't process new requests on that one worker.
4. Add a Celery (or Arq) task doing the same work and compare the durability and retry behavior.
5. >>> QUIZ (Stage 10) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: When do `BackgroundTasks` run relative to the response?
8. A) Before the response is sent
9. B) After the response is sent (*)
10. C) Concurrently with the response
11. D) On the next request
12. Explanation: Starlette sends the response first, then runs the tasks — so the client sees 200 before the task starts.
13. Q2: What's the durability guarantee of `BackgroundTasks`?
14. A) At-least-once delivery
15. B) Backed by Redis
16. C) None — a worker crash before the task runs loses it (*)
17. D) Two-phase commit
18. Explanation: Tasks live in-memory on the worker; a crash or restart between response and task execution means the task is lost.
19. Q3: Which is a good use case for `BackgroundTasks`?
20. A) Charging a credit card
21. B) Generating a 10GB report
22. C) Running a 5-minute ML inference
23. D) Writing a non-critical audit log or sending a welcome email (*)
24. Explanation: BackgroundTasks suits sub-second, non-critical work; billing/signing/long jobs need a durable queue.
25. Q4: How do you add a task?
26. A) `tasks.add_task(fn, *args, **kwargs)` (*)
27. B) `tasks.spawn(fn, *args)`
28. C) `tasks.queue(fn)`
29. D) `await tasks.schedule(fn)`
30. Explanation: `BackgroundTasks.add_task` accepts a callable and its args/kwargs; Starlette runs it (sync in threadpool, async awaited).
31. Q5: Can `BackgroundTasks` run async callables?
32. A) No, only sync
33. B) Yes, Starlette awaits async tasks (*)
34. C) Only if wrapped in `asyncio.run`
35. D) Only in Python 3.13+
36. Explanation: If the callable is a coroutine function, Starlette awaits it; otherwise it runs in the threadpool.
37. Q6: When should you switch to Celery or Arq?
38. A) Never — BackgroundTasks is always enough
39. B) Only if you have multiple workers
40. C) For durable, retryable, multi-second work (*)
41. D) Only on Windows
42. Explanation: Real queues give durability, retries, backoff, and horizontal scaling; BackgroundTasks gives none of these.
43. Q7: What happens if a task raises an exception?
44. A) The client gets a 500
45. B) The worker restarts
46. C) The task is retried automatically
47. D) The response was already 200; the exception is logged by Starlette but not surfaced to the client (*)
48. Explanation: Tasks run after the response is sent; Starlette logs the exception but can't retroactively change the status code.
49. Q8: Why shouldn't billing-critical writes go in `BackgroundTasks`?
50. A) The client already got 200; a failed task means a lost charge with no retry (*)
51. B) They're slow
52. C) BackgroundTasks can't call Stripe
53. D) Stripe requires sync calls
54. Explanation: Critical work needs a durable queue with retries; BackgroundTasks can lose work on crash.
55. Q9: Can `BackgroundTasks` be injected via Depends?
56. A) No, only as a direct param
57. B) Yes — FastAPI provides it as a dependency too (*)
58. C) Only in APIRouters
59. D) Only with a custom class
60. Explanation: `BackgroundTasks` is a special type that FastAPI injects whether declared as a param or via `Depends`.
61. Q10: What's the per-worker concurrency implication?
62. A) Tasks run in a separate process
63. B) Tasks scale infinitely
64. C) Tasks run on the worker's event loop / threadpool, sharing capacity with requests (*)
65. D) Tasks don't count against worker capacity
66. Explanation: Tasks share the worker's resources; long-running tasks can starve request handling on that worker.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When do `BackgroundTasks` run relative to the response?
  options:
    - Before the response is sent
    - After the response is sent
    - Concurrently with the response
    - On the next request
  correctIndex: 1
  explanation: Starlette sends the response first, then runs the tasks — so the client sees 200 before the task starts.
- id: q2
  question: What's the durability guarantee of `BackgroundTasks`?
  options:
    - At-least-once delivery
    - Backed by Redis
    - None — a worker crash before the task runs loses it
    - Two-phase commit
  correctIndex: 2
  explanation: Tasks live in-memory on the worker; a crash or restart between response and task execution means the task is lost.
- id: q3
  question: Which is a good use case for `BackgroundTasks`?
  options:
    - Charging a credit card
    - Generating a 10GB report
    - Running a 5-minute ML inference
    - Writing a non-critical audit log or sending a welcome email
  correctIndex: 3
  explanation: BackgroundTasks suits sub-second, non-critical work; billing/signing/long jobs need a durable queue.
- id: q4
  question: How do you add a task?
  options:
    - "`tasks.add_task(fn, *args, **kwargs)`"
    - "`tasks.spawn(fn, *args)`"
    - "`tasks.queue(fn)`"
    - "`await tasks.schedule(fn)`"
  correctIndex: 0
  explanation: "`BackgroundTasks.add_task` accepts a callable and its args/kwargs; Starlette runs it (sync in threadpool, async awaited)."
- id: q5
  question: Can `BackgroundTasks` run async callables?
  options:
    - No, only sync
    - Yes, Starlette awaits async tasks
    - Only if wrapped in `asyncio.run`
    - Only in Python 3.13+
  correctIndex: 1
  explanation: If the callable is a coroutine function, Starlette awaits it; otherwise it runs in the threadpool.
- id: q6
  question: When should you switch to Celery or Arq?
  options:
    - Never — BackgroundTasks is always enough
    - Only if you have multiple workers
    - For durable, retryable, multi-second work
    - Only on Windows
  correctIndex: 2
  explanation: Real queues give durability, retries, backoff, and horizontal scaling; BackgroundTasks gives none of these.
- id: q7
  question: What happens if a task raises an exception?
  options:
    - The client gets a 500
    - The worker restarts
    - The task is retried automatically
    - The response was already 200; the exception is logged by Starlette but not surfaced to the client
  correctIndex: 3
  explanation: Tasks run after the response is sent; Starlette logs the exception but can't retroactively change the status code.
- id: q8
  question: Why shouldn't billing-critical writes go in `BackgroundTasks`?
  options:
    - The client already got 200; a failed task means a lost charge with no retry
    - They're slow
    - BackgroundTasks can't call Stripe
    - Stripe requires sync calls
  correctIndex: 0
  explanation: Critical work needs a durable queue with retries; BackgroundTasks can lose work on crash.
- id: q9
  question: Can `BackgroundTasks` be injected via Depends?
  options:
    - No, only as a direct param
    - Yes — FastAPI provides it as a dependency too
    - Only in APIRouters
    - Only with a custom class
  correctIndex: 1
  explanation: "`BackgroundTasks` is a special type that FastAPI injects whether declared as a param or via `Depends`."
- id: q10
  question: What's the per-worker concurrency implication?
  options:
    - Tasks run in a separate process
    - Tasks scale infinitely
    - Tasks run on the worker's event loop / threadpool, sharing capacity with requests
    - Tasks don't count against worker capacity
  correctIndex: 2
  explanation: Tasks share the worker's resources; long-running tasks can starve request handling on that worker.
```

