---
slug: django-advanced-topics-signals-custom-managers-capstone-prep
id: django-20
track: django
order: 20
title: Advanced Topics — Signals, Custom Managers, and Capstone Prep
description: Master Django's power tools — signals (and when NOT to use them), custom managers and querysets, custom model fields, database transactions and select_for_update, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=1020s
whyItMatters: Master Django's power tools — signals (and when NOT to use them), custom managers and querysets, custom model fields, database transactions and select_for_update, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Advanced Topics — Signals, Custom Managers, and Capstone Prep

## Advanced Topics — Signals, Custom Managers, and Capstone Prep

### Why It Matters

Master Django's power tools — signals (and when NOT to use them), custom managers and querysets, custom model fields, database transactions and select_for_update, and prepare for the capstone project.

Master Django's power tools — signals (and when NOT to use them), custom managers and querysets, custom model fields, database transactions and select_for_update, and prepare for the capstone project.

### Prerequisites

- All previous stages (1-19)
- Comfort with Python decorators and context managers.

### Topics

- Signals: post_save, pre_save, post_delete, m2m_changed — and the override-save() alternative
- Custom managers AND custom queryset methods (chaining)
- Custom model fields (CharField subclass, JSONField helpers)
- Transactions: atomic(), savepoints, on_commit()
- select_for_update() for pessimistic locking
- Custom management commands
- Database functions: Cast, Coalesce, Concat, Now
- Capstone prep: project structure, env, CI/CD scaffolding

### Key Concepts

- Signals decouple code (good) but hide execution flow (bad) — prefer overriding save() or a service function for clarity.
- Custom queryset methods let you chain: `Post.objects.published().recent()` — the modern pattern.
- `transaction.atomic()` wraps a block in BEGIN/COMMIT; on exception it ROLLBACKs.
- `select_for_update()` issues SELECT ... FOR UPDATE, locking rows until commit — used to prevent race conditions.
- `transaction.on_commit(callback)` runs after a successful commit — perfect for triggering Celery tasks without rollback issues.

```python
# blog/managers.py
from django.db import models, transaction
from django.db.models import QuerySet

class PostQuerySet(QuerySet):
    def published(self):
        return self.filter(status="published", published_at__lte=timezone.now())

    def by_author(self, user):
        return self.filter(author=user)

    def with_comment_count(self):
        return self.annotate(comment_count=models.Count("comments"))

    def recent(self, days=7):
        return self.filter(published_at__gte=timezone.now() - timedelta(days=days))

class PostManager(models.Manager.from_queryset(PostQuerySet)):
    pass

# blog/models.py
class Post(models.Model):
    # ...
    objects = PostManager()  # enables chaining: Post.objects.published().recent().with_comment_count()
```
Caption: Custom queryset + manager (chainable)

### Common Pitfalls

- Using signals for core business logic — signals hide execution order and make debugging hell; use save() overrides or explicit service calls for the main flow, signals only for cross-cutting concerns.
- Forgetting to connect signals — either via @receiver + AppConfig.ready() or via apps.py import; otherwise nothing happens.
- Race conditions in read-modify-write — `obj.balance += 1; obj.save()` races; use F() expressions for counters or select_for_update() for multi-field updates.
- Using transaction.atomic() without understanding savepoints — nested atomic() creates savepoints, not nested transactions; an inner exception rolls back to the savepoint, not the outer.
- Calling Celery tasks inside atomic() without on_commit() — if the transaction rolls back, the task is already enqueued and runs on bad data; wrap in on_commit().

### Real-World Applications

- Instagram uses custom queryset methods extensively (`User.objects.with_recent_photos()`) to compose complex feed queries.
- Disqus uses post_save signals for cache invalidation and search-index updates.
- Mozilla uses select_for_update() in SUMO's KB revision system to prevent concurrent-edit conflicts.
- Eventbrite uses transaction.atomic + on_commit for ticket-purchase flows (charge card -> issue tickets -> send confirmation email).

### Interview Questions

- 1. When should you use signals vs overriding save()? — Override save() for model-level lifecycle; signals for cross-cutting concerns (cache invalidation, search index, denormalized counters) that shouldn't couple the models.
- 2. How do you make a custom queryset chainable? — Subclass QuerySet, add methods returning self; create a Manager via `models.Manager.from_queryset(MyQuerySet)`.
- 3. What does select_for_update() do? — Issues SELECT ... FOR UPDATE, locking the rows until commit. Prevents concurrent modifications within the transaction.
- 4. What does transaction.on_commit() do? — Schedules a callback to run after the transaction successfully commits; perfect for "send email only if the save succeeded" — also for Celery tasks.
- 5. What's a savepoint vs a transaction? — A transaction is the outer BEGIN/COMMIT; nested atomic() creates SAVEPOINTs. An inner exception rolls back to the savepoint; the outer can still commit (if caught) or roll back (if not).

### Mini Project

Build a Money Transfer Service: Two `Account` models and a `Transfer` model. Use transaction.atomic + select_for_update to safely move money; trigger a Celery notification task via transaction.on_commit. Add a custom management command `reconcile_transfers` that verifies balances. Suggested approach:
  - Account(id, owner, balance); Transfer(id, from_account, to_account, amount, created_at)
  - transfer_money(from_id, to_id, amount) in services.py with atomic + select_for_update
  - transaction.on_commit(lambda: notify_transfer.delay(transfer.id))
  - post_save signal on Transfer updates a denormalized "transfer_count" on Account
  - reconcile_transfers command: for each account, sum transfers and assert it matches balance

### Exercises

1. Write a custom queryset method `for_user(user)` that filters by author and pre-fetches tags.
2. Add a post_save signal that updates a denormalized "post_count" on User.
3. Wrap a multi-step create in transaction.atomic; verify rollback on exception.
4. Use select_for_update() in a transfer function; verify race-free under concurrent requests.
5. Write a management command that prunes expired sessions.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When should you prefer overriding save() over a signal?
9. A) Never
10. B) Always
11. C) Only in admin
12. D) For model-level lifecycle that's part of the main flow (*)
13. Explanation: Override save() for core behavior that callers expect. Reserve signals for cross-cutting concerns (cache invalidation, search indexing) that shouldn't couple models.
14. Q2: Which approach makes a custom queryset method chainable?
15. A) Subclass QuerySet and use Manager.from_queryset() (*)
16. B) Subclass Manager only
17. C) Use a free function
18. D) Add the method to Meta
19. Explanation: Subclass QuerySet, add methods returning self. Then Manager.from_queryset(MyQuerySet) creates a Manager that exposes those methods and chains.
20. Q3: What does select_for_update() do?
21. A) Updates the selected rows
22. B) Locks rows for the duration of the transaction (SELECT ... FOR UPDATE) (*)
23. C) Pre-fetches related rows
24. D) Marks rows as dirty
25. Explanation: SELECT ... FOR UPDATE locks the rows so other transactions block until your commit. Prevents race conditions in read-modify-write.
26. Q4: What does transaction.on_commit(callback) do?
27. A) Runs callback before commit
28. B) Cancels the transaction
29. C) Runs callback only after the transaction commits successfully (*)
30. D) Locks the rows
31. Explanation: on_commit schedules the callback to fire after a successful commit. Use it for Celery tasks so you don't enqueue work that depends on rolled-back data.
32. Q5: What's the difference between a transaction and a savepoint?
33. A) They're the same
34. B) A savepoint is for async only
35. C) A savepoint can't be rolled back
36. D) A transaction is the outer BEGIN/COMMIT; nested atomic() creates SAVEPOINTs (*)
37. Explanation: Django's nested atomic() uses savepoints. An inner exception rolls back to the savepoint; the outer transaction can still commit if the inner exception was caught.
38. Q6: Where do you connect signals in a modern Django app?
39. A) In apps.py AppConfig.ready() (import the signals module) (*)
40. B) In models.py via @receiver
41. C) In settings.py
42. D) In urls.py
43. Explanation: Define signals in signals.py with @receiver. Import them in AppConfig.ready() so they're loaded when the app is ready. (Some teams use @receiver directly in models.py for simplicity.)
44. Q7: Which is the safest counter update?
45. A) obj.count += 1; obj.save()
46. B) Model.objects.filter(pk=...).update(count=F("count") + 1) (*)
47. C) A Python loop
48. D) A signal
49. Explanation: F("count") + 1 issues a single atomic UPDATE; the read-modify-write pattern races when two requests hit at the same time.
50. Q8: What does a custom management command need?
51. A) A function in views.py
52. B) A signal
53. C) A class Command(BaseCommand) with handle() in management/commands/<name>.py (*)
54. D) A URL pattern
55. Explanation: Create blog/management/commands/cleanup.py with class Command(BaseCommand). Define handle() and optionally add_arguments(). Call with `python manage.py cleanup`.
56. Q9: Why avoid signals for core business logic?
57. A) They're slow
58. B) They only work in admin
59. C) They're deprecated
60. D) They hide execution order and make debugging hard; explicit service calls are clearer (*)
61. Explanation: Signals fire "magically" from anywhere, making the call graph invisible. Use them for truly cross-cutting concerns (cache, search index, audit log).
62. Q10: Which DB function returns the first non-NULL value?
63. A) Coalesce (*)
64. B) Cast
65. C) Concat
66. D) Greatest
67. Explanation: Coalesce(*fields) returns the first non-NULL argument. Useful for "use nickname if set, else username": Coalesce("nickname", "username").
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: When should you prefer overriding save() over a signal?
  options:
    - Never
    - Always
    - Only in admin
    - For model-level lifecycle that's part of the main flow
  correctIndex: 3
  explanation: Override save() for core behavior that callers expect. Reserve signals for cross-cutting concerns (cache invalidation, search indexing) that shouldn't couple models.
- id: q2
  question: Which approach makes a custom queryset method chainable?
  options:
    - Subclass QuerySet and use Manager.from_queryset()
    - Subclass Manager only
    - Use a free function
    - Add the method to Meta
  correctIndex: 0
  explanation: Subclass QuerySet, add methods returning self. Then Manager.from_queryset(MyQuerySet) creates a Manager that exposes those methods and chains.
- id: q3
  question: What does select_for_update() do?
  options:
    - Updates the selected rows
    - Locks rows for the duration of the transaction (SELECT ... FOR UPDATE)
    - Pre-fetches related rows
    - Marks rows as dirty
  correctIndex: 1
  explanation: SELECT ... FOR UPDATE locks the rows so other transactions block until your commit. Prevents race conditions in read-modify-write.
- id: q4
  question: What does transaction.on_commit(callback) do?
  options:
    - Runs callback before commit
    - Cancels the transaction
    - Runs callback only after the transaction commits successfully
    - Locks the rows
  correctIndex: 2
  explanation: on_commit schedules the callback to fire after a successful commit. Use it for Celery tasks so you don't enqueue work that depends on rolled-back data.
- id: q5
  question: What's the difference between a transaction and a savepoint?
  options:
    - They're the same
    - A savepoint is for async only
    - A savepoint can't be rolled back
    - A transaction is the outer BEGIN/COMMIT; nested atomic() creates SAVEPOINTs
  correctIndex: 3
  explanation: Django's nested atomic() uses savepoints. An inner exception rolls back to the savepoint; the outer transaction can still commit if the inner exception was caught.
- id: q6
  question: Where do you connect signals in a modern Django app?
  options:
    - In apps.py AppConfig.ready() (import the signals module)
    - In models.py via @receiver
    - In settings.py
    - In urls.py
  correctIndex: 0
  explanation: Define signals in signals.py with @receiver. Import them in AppConfig.ready() so they're loaded when the app is ready. (Some teams use @receiver directly in models.py for simplicity.)
- id: q7
  question: Which is the safest counter update?
  options:
    - obj.count += 1; obj.save()
    - Model.objects.filter(pk=...).update(count=F("count") + 1)
    - A Python loop
    - A signal
  correctIndex: 1
  explanation: F("count") + 1 issues a single atomic UPDATE; the read-modify-write pattern races when two requests hit at the same time.
- id: q8
  question: What does a custom management command need?
  options:
    - A function in views.py
    - A signal
    - A class Command(BaseCommand) with handle() in management/commands/<name>.py
    - A URL pattern
  correctIndex: 2
  explanation: Create blog/management/commands/cleanup.py with class Command(BaseCommand). Define handle() and optionally add_arguments(). Call with `python manage.py cleanup`.
- id: q9
  question: Why avoid signals for core business logic?
  options:
    - They're slow
    - They only work in admin
    - They're deprecated
    - They hide execution order and make debugging hard; explicit service calls are clearer
  correctIndex: 3
  explanation: Signals fire "magically" from anywhere, making the call graph invisible. Use them for truly cross-cutting concerns (cache, search index, audit log).
- id: q10
  question: Which DB function returns the first non-NULL value?
  options:
    - Coalesce
    - Cast
    - Concat
    - Greatest
  correctIndex: 0
  explanation: 'Coalesce(*fields) returns the first non-NULL argument. Useful for "use nickname if set, else username": Coalesce("nickname", "username").'
```

