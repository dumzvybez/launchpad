---
slug: flask-email-celery-background-tasks
id: flask-16
track: flask
order: 16
title: Email, Celery, and Background Tasks
description: Send transactional email asynchronously with Celery + Redis, offload long-running work from the request, and avoid blocking WSGI workers on slow I/O.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=780s
whyItMatters: Send transactional email asynchronously with Celery + Redis, offload long-running work from the request, and avoid blocking WSGI workers on slow I/O.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Email, Celery, and Background Tasks

## Email, Celery, and Background Tasks

### Why It Matters

Send transactional email asynchronously with Celery + Redis, offload long-running work from the request, and avoid blocking WSGI workers on slow I/O.

Send transactional email asynchronously with Celery + Redis, offload long-running work from the request, and avoid blocking WSGI workers on slow I/O.

### Prerequisites

- Stage 15: Error Handling, Custom Error Pages, Logging
- Stage 8 (application factory) and Stage 9 (config).

### Topics

- Why you can't send email synchronously in a request
- Celery: app = Celery(__name__), broker=Redis, result_backend=Redis
- Task definition: @celery.task with bind=True for self.retry
- Calling tasks: .delay() (fire-and-forget) and .apply_async() (with options)
- Task retries, exponential backoff, max_retries
- Transaction-aware dispatch: after_commit hook
- Flask-Mail for SMTP and Mailgun/SendGrid APIs for prod
- Alternatives: RQ, Dramatiq, Huey, arq (async)

### Key Concepts

- WSGI workers are synchronous; calling smtplib.sendmail in a view blocks the worker for the SMTP round-trip (often 1-3s). Always offload email to a background task.
- Celery tasks must be idempotent and re-runnable because the broker may redeliver; design for at-least-once delivery (use locks or unique constraints for side effects like payments).
- Calling task.delay() before db.session.commit() races: if the commit fails, the task runs anyway and reads stale/missing data. Use transaction-aware after_commit hooks.
- The Celery worker is a separate process from the web app; it shares the same codebase (create_app) but boots via celery -A app.celery worker, not gunicorn.
- Self.retry with exponential backoff (countdown=2**self.request.retries) handles transient failures (SMTP timeout, 5xx from provider) without manual loops.

```python
# app/celery.py
from celery import Celery
import os

def make_celery(app):
    celery = Celery(app.import_name,
                    broker=os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0"),
                    backend=os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"))
    celery.conf.update(app.config)
    return celery

# app/__init__.py
from flask import Flask
from app.celery import make_celery

def create_app(config_name="dev"):
    app = Flask(__name__)
    app.config.from_object(f"app.config.{config_name}Config")
    app.celery = make_celery(app)
    return app
```
Caption: Celery app + task

### Common Pitfalls

- Calling task.delay() before db.session.commit() — If the commit fails the task still runs and reads missing data; use after_commit hook or call delay() only after commit() returns successfully.
- Blocking the WSGI worker on smtplib.sendmail in a view — SMTP round-trips take 1-3s and block the worker; offload to a Celery task so the request returns immediately.
- Non-idempotent tasks on at-least-once brokers — Celery may redeliver; if the task charges a card or sends an SMS, use a unique constraint or lock to make it idempotent.
- Forgetting to import the tasks module in the worker — Celery autodiscovers tasks only if you configure include=['app.notifications.tasks'] or import them in the celery app; missing import = task never registered = KeyError on send.
- Running Celery with CELERY_TASK_ALWAYS_EAGER=True in production — EAGER mode runs tasks synchronously in the same process (good for tests, terrible for prod — defeats the purpose); only set in TestConfig.

### Real-World Applications

- Patreon's Flask services use Celery + Redis for sending creator-update emails, processing payout batches, and syncing to Stripe — millions of tasks/day.
- Lyft's Flask admin apps use Celery for batch user-import jobs and nightly reconciliation reports, with exponential backoff on third-party API failures.
- Netflix's security-automation Flask tools use Celery to run vulnerability scans across regions in parallel, with task chaining for scan -> triage -> notify.
- Twilio's webhook-receiving Flask services offload SMS-send retries to a task queue so HTTP webhook responses stay under the 5s timeout.

### Interview Questions

- 1. Why can't you send email synchronously in a Flask view? — SMTP round-trips take 1-3s and block the WSGI worker, killing concurrency; offload to Celery so the request returns immediately.
- 2. Why call task.delay() after commit(), not before? — If the commit fails the task still runs and reads missing data; use after_commit hooks or call delay() after commit() returns.
- 3. How do you make a Celery task idempotent? — Use a unique constraint or advisory lock keyed by a stable id (e.g., order_id) so a redelivery is a no-op; design for at-least-once delivery.
- 4. What does self.retry(exc=exc, countdown=2**self.request.retries) do? — Retries the task with exponential backoff (2, 4, 8, ... seconds) up to max_retries; re-raises if max is hit.
- 5. Why is CELERY_TASK_ALWAYS_EAGER=True dangerous in production? — It runs tasks synchronously in the web process, blocking workers and defeating the purpose of async; only use in tests.

### Mini Project

Build a Welcome Email Worker: A Flask app that signs up a user,
commits, then dispatches a Celery task that sends a welcome email
with retry on SMTP errors. Suggested approach:
  - Run Redis locally; configure Celery with broker+backend
  - Define send_welcome_email(user_id) with @celery.task(bind=True)
  - Use self.retry with exponential backoff on SMTPException
  - In the signup view, db.session.commit() then send_welcome_email.delay(user.id)
  - Start a worker with `celery -A app.celery worker -l info` and test signup

### Exercises

1. Set up Celery with Redis broker in create_app and run a worker.
2. Define a task with @celery.task(bind=True, max_retries=3) and self.retry.
3. Dispatch a task after db.session.commit() in a view.
4. Set CELERY_TASK_ALWAYS_EAGER=True in TestConfig and write a test that runs the task inline.
5. Add an after_commit listener that drains pending tasks from session.info.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why not call smtplib.sendmail in a Flask view?
9. A) It's deprecated
10. B) It can't send HTML
11. C) Flask forbids it
12. D) SMTP round-trips block the WSGI worker for 1-3s, killing concurrency (*)
13. Explanation: WSGI workers are synchronous; an SMTP call blocks the worker. Offload to a Celery task so the request returns immediately.
14. Q2: When should you dispatch a Celery task in a view?
15. A) After db.session.commit() returns successfully (*)
16. B) Before db.session.add()
17. C) Before db.session.commit()
18. D) In teardown_request
19. Explanation: If the commit fails, the task would read missing data. Dispatch after commit() returns (or use after_commit hook).
20. Q3: What does @celery.task(bind=True, max_retries=5) enable?
21. A) Auto-retry on any error
22. B) Access to self (task instance) for self.retry() up to 5 times (*)
23. C) 5 parallel workers
24. D) 5-second timeout
25. Explanation: bind=True passes self as the first arg; self.retry(exc=exc, countdown=...) retries the task up to max_retries times before raising.
26. Q4: What does self.retry(exc=exc, countdown=2**self.request.retries) implement?
27. A) Linear backoff
28. B) Immediate retry
29. C) Exponential backoff (2, 4, 8, ...) (*)
30. D) No retry
31. Explanation: self.request.retries starts at 0; countdown doubles each retry (2, 4, 8, ...), giving transient errors time to recover.
32. Q5: Why must Celery tasks be idempotent?
33. A) For performance
34. B) Celery requires it
35. C) It's faster
36. D) Brokers may redeliver; non-idempotent side effects (charge card, send SMS) would double-execute (*)
37. Explanation: Celery (and most brokers) guarantee at-least-once delivery; redeliveries are normal. Use unique constraints or locks so a repeat is a no-op.
38. Q6: What does CELERY_TASK_ALWAYS_EAGER=True do?
39. A) Runs tasks synchronously in the calling process (for tests) (*)
40. B) Runs tasks asynchronously
41. C) Disables retries
42. D) Forces retries
43. Explanation: EAGER mode runs tasks inline in the same process, blocking the caller; useful for tests, dangerous in production (defeats async purpose).
44. Q7: What's a common broker for Celery with Flask?
45. A) PostgreSQL
46. B) Redis (*)
47. C) SQLite
48. D) Filesystem
49. Explanation: Redis is the most common Celery broker (and result backend); RabbitMQ is the other popular option, preferred for complex routing.
50. Q8: How do you start a Celery worker for a Flask app?
51. A) flask worker
52. B) gunicorn -A app.celery worker
53. C) celery -A app.celery worker -l info (*)
54. D) python -m celery worker
55. Explanation: celery -A app.celery worker -l info boots a worker that imports the Celery app at app.celery; -l info sets log level.
56. Q9: What's the purpose of an after_commit listener?
57. A) To validate data after commit
58. B) To rollback on commit
59. C) To log SQL
60. D) To dispatch tasks only after the transaction is durable, avoiding races (*)
61. Explanation: after_commit fires after a successful commit; queuing tasks here guarantees they see the committed rows, avoiding the stale-data race.
62. Q10: Which alternative to Celery is popular for simpler task queues?
63. A) RQ (Redis Queue) (*)
64. B) Django ORM
65. C) SQLAlchemy
66. D) Jinja2
67. Explanation: RQ (Redis Queue) is a simpler Python library for background jobs; Dramatiq and Huey are other alternatives, each with different ergonomics.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why not call smtplib.sendmail in a Flask view?
  options:
    - It's deprecated
    - It can't send HTML
    - Flask forbids it
    - SMTP round-trips block the WSGI worker for 1-3s, killing concurrency
  correctIndex: 3
  explanation: WSGI workers are synchronous; an SMTP call blocks the worker. Offload to a Celery task so the request returns immediately.
- id: q2
  question: When should you dispatch a Celery task in a view?
  options:
    - After db.session.commit() returns successfully
    - Before db.session.add()
    - Before db.session.commit()
    - In teardown_request
  correctIndex: 0
  explanation: If the commit fails, the task would read missing data. Dispatch after commit() returns (or use after_commit hook).
- id: q3
  question: What does @celery.task(bind=True, max_retries=5) enable?
  options:
    - Auto-retry on any error
    - Access to self (task instance) for self.retry() up to 5 times
    - 5 parallel workers
    - 5-second timeout
  correctIndex: 1
  explanation: bind=True passes self as the first arg; self.retry(exc=exc, countdown=...) retries the task up to max_retries times before raising.
- id: q4
  question: What does self.retry(exc=exc, countdown=2**self.request.retries) implement?
  options:
    - Linear backoff
    - Immediate retry
    - Exponential backoff (2, 4, 8, ...)
    - No retry
  correctIndex: 2
  explanation: self.request.retries starts at 0; countdown doubles each retry (2, 4, 8, ...), giving transient errors time to recover.
- id: q5
  question: Why must Celery tasks be idempotent?
  options:
    - For performance
    - Celery requires it
    - It's faster
    - Brokers may redeliver; non-idempotent side effects (charge card, send SMS) would double-execute
  correctIndex: 3
  explanation: Celery (and most brokers) guarantee at-least-once delivery; redeliveries are normal. Use unique constraints or locks so a repeat is a no-op.
- id: q6
  question: What does CELERY_TASK_ALWAYS_EAGER=True do?
  options:
    - Runs tasks synchronously in the calling process (for tests)
    - Runs tasks asynchronously
    - Disables retries
    - Forces retries
  correctIndex: 0
  explanation: EAGER mode runs tasks inline in the same process, blocking the caller; useful for tests, dangerous in production (defeats async purpose).
- id: q7
  question: What's a common broker for Celery with Flask?
  options:
    - PostgreSQL
    - Redis
    - SQLite
    - Filesystem
  correctIndex: 1
  explanation: Redis is the most common Celery broker (and result backend); RabbitMQ is the other popular option, preferred for complex routing.
- id: q8
  question: How do you start a Celery worker for a Flask app?
  options:
    - flask worker
    - gunicorn -A app.celery worker
    - celery -A app.celery worker -l info
    - python -m celery worker
  correctIndex: 2
  explanation: celery -A app.celery worker -l info boots a worker that imports the Celery app at app.celery; -l info sets log level.
- id: q9
  question: What's the purpose of an after_commit listener?
  options:
    - To validate data after commit
    - To rollback on commit
    - To log SQL
    - To dispatch tasks only after the transaction is durable, avoiding races
  correctIndex: 3
  explanation: after_commit fires after a successful commit; queuing tasks here guarantees they see the committed rows, avoiding the stale-data race.
- id: q10
  question: Which alternative to Celery is popular for simpler task queues?
  options:
    - RQ (Redis Queue)
    - Django ORM
    - SQLAlchemy
    - Jinja2
  correctIndex: 0
  explanation: RQ (Redis Queue) is a simpler Python library for background jobs; Dramatiq and Huey are other alternatives, each with different ergonomics.
```

