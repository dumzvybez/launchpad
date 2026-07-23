---
slug: django-celery-asynchronous-tasks
id: django-14
track: django
order: 14
title: Celery and Asynchronous Tasks
description: Offload slow work to background tasks with Celery + Redis/RabbitMQ. Learn task chaining, scheduled tasks (Celery Beat), retries, idempotency, and monitoring with Flower.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=660s
whyItMatters: Offload slow work to background tasks with Celery + Redis/RabbitMQ. Learn task chaining, scheduled tasks (Celery Beat), retries, idempotency, and monitoring with Flower.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Celery and Asynchronous Tasks

## Celery and Asynchronous Tasks

### Why It Matters

Offload slow work to background tasks with Celery + Redis/RabbitMQ. Learn task chaining, scheduled tasks (Celery Beat), retries, idempotency, and monitoring with Flower.

Offload slow work to background tasks with Celery + Redis/RabbitMQ. Learn task chaining, scheduled tasks (Celery Beat), retries, idempotency, and monitoring with Flower.

### Prerequisites

- Stage 4 (Models), Stage 12 (DRF)
- A Redis or RabbitMQ broker available (Docker recommended).

### Topics

- Celery setup: celery.py, app = Celery("mysite")
- @app.task decorator and bind=True for self.retry
- Calling: .delay() vs .apply_async()
- Chains, groups, chords (canvas)
- Celery Beat for periodic tasks
- Task retries with exponential backoff
- Idempotency and deduplication strategies
- Result backends (django-db, redis, disabled)
- Monitoring with Flower; structured logging

### Key Concepts

- Celery is a distributed task queue: producer (Django) -> broker (Redis) -> worker -> backend (results).
- `.delay(args)` is the simplest call; `.apply_async(args, eta=...)` schedules.
- Tasks should be idempotent — workers can crash and re-run; design for it.
- `bind=True` gives the task `self` so you can call `self.retry(exc=exc, countdown=...)`.
- Long-running tasks should checkpoint progress and be cancellable.

```python
# mysite/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
app = Celery("mysite")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()  # finds tasks.py in each INSTALLED_APP

# mysite/__init__.py
from .celery import app as celery_app
__all__ = ("celery_app",)

# settings.py
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "django-db"   # needs django-celery-results
CELERY_TASK_TIME_LIMIT = 600
CELERY_TASK_SOFT_TIME_LIMIT = 540
```
Caption: Celery app setup

### Common Pitfalls

- Passing model instances to tasks — they get pickled and become stale; pass IDs and re-fetch inside the task.
- Non-idempotent tasks — retries double-charge, double-send emails; use a Notification/status row as a guard.
- Long-running task with no soft time limit — a stuck task blocks the worker forever; set CELERY_TASK_SOFT_TIME_LIMIT.
- Using `@shared_task` without `app.autodiscover_tasks()` — Django can't find tasks.py files in apps; autodiscover is required.
- Calling `.delay()` in tests without `CELERY_TASK_ALWAYS_EAGER=True` — tests should run synchronously; set ALWAYS_EAGER in test settings or mock the task.

### Real-World Applications

- Disqus uses Celery for comment spam classification (Akismet calls), email digests, and analytics rollups.
- Mozilla uses Celery for MDN rendering pipelines (build pages on edit) and SUMO's notification system.
- Eventbrite uses Celery for ticket confirmation emails, refund processing, and PDF generation.
- Instagram used Celery (with RabbitMQ) early on for feed fan-out and notifications before moving to custom systems.

### Interview Questions

- 1. Why use Celery instead of Django's async views for background work? — Celery decouples the worker from the web process, supports retries, scheduling, and scales workers independently.
- 2. What's the difference between .delay() and .apply_async()? — .delay(*args) is a shortcut for .apply_async(args=...). apply_async supports eta, countdown, queue, routing.
- 3. How do you make a task idempotent? — Use a unique key (e.g., notification row, dedup cache) to detect and skip re-runs; the same input must produce the same final state.
- 4. What's the soft vs hard time limit? — soft_time_limit raises SoftTimeLimitExceeded (catchable); time_limit kills the worker process (uncatchable).
- 5. How do you test Celery tasks? — Set CELERY_TASK_ALWAYS_EAGER=True in test settings (runs synchronously) or call the task function directly (task.run() or task.apply()).

### Mini Project

Build an Email Digest Pipeline: A weekly Celery Beat task that finds users who haven't logged in but have new posts in their followed tags, builds a digest email, and sends via SES. Use a chain: build_digest -> render_template -> send_email. Suggested approach:
  - send_weekly_digest task scheduled with crontab(hour=8, minute=0, day_of_week=1)
  - build_digest.s(user_id) returns a list of post IDs
  - render_template.s() takes the post list, returns HTML
  - send_email.s(user_id) sends via boto3 SES with retry on throttling
  - Add a "DigestSent" row per user to make it idempotent

### Exercises

1. Install celery + redis; configure celery.py and test a "hello world" task with .delay().
2. Add retry with exponential backoff to a task that calls an external API.
3. Use chain() to run three tasks sequentially; verify ordering.
4. Schedule a Beat task to run every 5 minutes and verify with `celery -A mysite beat`.
5. Set CELERY_TASK_ALWAYS_EAGER=True in tests and assert the task ran synchronously.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which method enqueues a Celery task asynchronously?
9. A) task.run()
10. B) task.delay() (*)
11. C) task.start()
12. D) task.queue()
13. Explanation: .delay(*args) is a shortcut for .apply_async(args=...). It returns an AsyncResult immediately.
14. Q2: What does @shared_task do?
15. A) Shares the task across users
16. B) Makes the task thread-safe
17. C) Registers the function as a Celery task without needing the app instance directly (*)
18. D) Shares the task between Django and Flask
19. Explanation: @shared_task creates a task that's registered with whatever Celery app is current. Useful for reusable apps.
20. Q3: Why should you pass IDs (not model instances) to tasks?
21. A) IDs are smaller
22. B) Pickling is deprecated
23. C) IDs support retries
24. D) Instances get pickled and become stale; re-fetching inside the task is safer (*)
25. Explanation: A model instance pickled at enqueue time may be outdated by the time the worker runs. Pass the PK and re-fetch.
26. Q4: What does app.autodiscover_tasks() do?
27. A) Loads tasks.py from each INSTALLED_APP automatically (*)
28. B) Auto-creates tasks from models
29. C) Discovers existing celery workers
30. D) Imports all Python files
31. Explanation: autodiscover_tasks scans each app for a tasks.py module and registers its @shared_task functions.
32. Q5: What's the difference between soft and hard time limits?
33. A) Soft is for dev; hard is for prod
34. B) Soft raises a catchable exception; hard kills the worker process (*)
35. C) Both kill the process
36. D) Hard limit is configurable; soft is fixed
37. Explanation: soft_time_limit raises SoftTimeLimitExceeded (you can catch and clean up). time_limit sends SIGKILL — no cleanup.
38. Q6: Which Celery construct runs tasks one after another with the output of one feeding the next?
39. A) group
40. B) chord
41. C) chain (*)
42. D) fanout
43. Explanation: chain(t1.s(), t2.s(), t3.s()) runs t1 -> t2 -> t3 sequentially; each task's return value is the first arg of the next.
44. Q7: What does Celery Beat do?
45. A) Beats (load-balances) workers
46. B) Monitors task performance
47. C) Acts as a result backend
48. D) Schedules periodic tasks on a schedule (crontab) (*)
49. Explanation: celery beat is a separate process that submits tasks on a schedule defined in CELERY_BEAT_SCHEDULE.
50. Q8: How do you make a task idempotent?
51. A) Use a dedup key/row to detect re-runs and skip if already processed (*)
52. B) Use @idempotent decorator
53. C) Disable retries
54. D) Set always_commit=True
55. Explanation: Create a unique marker (e.g., a Notification row keyed on post_id + kind). If it exists, skip. Same input -> same final state.
56. Q9: What's the recommended test setting for Celery?
57. A) Mock every task
58. B) Set CELERY_TASK_ALWAYS_EAGER=True to run tasks inline (*)
59. C) Don't test Celery
60. D) Run a real broker in CI
61. Explanation: ALWAYS_EAGER runs tasks synchronously in the same process — no broker needed. For integration tests, run a real broker.
62. Q10: Which is the most common broker for Celery in production?
63. A) RabbitMQ only
64. B) PostgreSQL
65. C) Redis or RabbitMQ (Redis is simpler; RabbitMQ is more feature-rich) (*)
66. D) Kafka
67. Explanation: Redis is the simplest broker and good for most cases. RabbitMQ adds features like priority queues and better ack semantics for some workloads.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method enqueues a Celery task asynchronously?
  options:
    - task.run()
    - task.delay()
    - task.start()
    - task.queue()
  correctIndex: 1
  explanation: .delay(*args) is a shortcut for .apply_async(args=...). It returns an AsyncResult immediately.
- id: q2
  question: What does @shared_task do?
  options:
    - Shares the task across users
    - Makes the task thread-safe
    - Registers the function as a Celery task without needing the app instance directly
    - Shares the task between Django and Flask
  correctIndex: 2
  explanation: "@shared_task creates a task that's registered with whatever Celery app is current. Useful for reusable apps."
- id: q3
  question: Why should you pass IDs (not model instances) to tasks?
  options:
    - IDs are smaller
    - Pickling is deprecated
    - IDs support retries
    - Instances get pickled and become stale; re-fetching inside the task is safer
  correctIndex: 3
  explanation: A model instance pickled at enqueue time may be outdated by the time the worker runs. Pass the PK and re-fetch.
- id: q4
  question: What does app.autodiscover_tasks() do?
  options:
    - Loads tasks.py from each INSTALLED_APP automatically
    - Auto-creates tasks from models
    - Discovers existing celery workers
    - Imports all Python files
  correctIndex: 0
  explanation: autodiscover_tasks scans each app for a tasks.py module and registers its @shared_task functions.
- id: q5
  question: What's the difference between soft and hard time limits?
  options:
    - Soft is for dev; hard is for prod
    - Soft raises a catchable exception; hard kills the worker process
    - Both kill the process
    - Hard limit is configurable; soft is fixed
  correctIndex: 1
  explanation: soft_time_limit raises SoftTimeLimitExceeded (you can catch and clean up). time_limit sends SIGKILL — no cleanup.
- id: q6
  question: Which Celery construct runs tasks one after another with the output of one feeding the next?
  options:
    - group
    - chord
    - chain
    - fanout
  correctIndex: 2
  explanation: chain(t1.s(), t2.s(), t3.s()) runs t1 -> t2 -> t3 sequentially; each task's return value is the first arg of the next.
- id: q7
  question: What does Celery Beat do?
  options:
    - Beats (load-balances) workers
    - Monitors task performance
    - Acts as a result backend
    - Schedules periodic tasks on a schedule (crontab)
  correctIndex: 3
  explanation: celery beat is a separate process that submits tasks on a schedule defined in CELERY_BEAT_SCHEDULE.
- id: q8
  question: How do you make a task idempotent?
  options:
    - Use a dedup key/row to detect re-runs and skip if already processed
    - Use @idempotent decorator
    - Disable retries
    - Set always_commit=True
  correctIndex: 0
  explanation: Create a unique marker (e.g., a Notification row keyed on post_id + kind). If it exists, skip. Same input -> same final state.
- id: q9
  question: What's the recommended test setting for Celery?
  options:
    - Mock every task
    - Set CELERY_TASK_ALWAYS_EAGER=True to run tasks inline
    - Don't test Celery
    - Run a real broker in CI
  correctIndex: 1
  explanation: ALWAYS_EAGER runs tasks synchronously in the same process — no broker needed. For integration tests, run a real broker.
- id: q10
  question: Which is the most common broker for Celery in production?
  options:
    - RabbitMQ only
    - PostgreSQL
    - Redis or RabbitMQ (Redis is simpler; RabbitMQ is more feature-rich)
    - Kafka
  correctIndex: 2
  explanation: Redis is the simplest broker and good for most cases. RabbitMQ adds features like priority queues and better ack semantics for some workloads.
```

