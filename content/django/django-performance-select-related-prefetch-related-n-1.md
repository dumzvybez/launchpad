---
slug: django-performance-select-related-prefetch-related-n-1
id: django-17
track: django
order: 17
title: Performance — select_related, prefetch_related, N+1
description: "Profile and fix Django performance problems: N+1 queries, missing indexes, oversized querysets, slow templates, and unbounded loops. Use Django Debug Toolbar, silk, and EXPLAIN."
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=840s
whyItMatters: "Profile and fix Django performance problems: N+1 queries, missing indexes, oversized querysets, slow templates, and unbounded loops. Use Django Debug Toolbar, silk, and EXPLAIN."
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Performance — select_related, prefetch_related, N+1

## Performance — select_related, prefetch_related, N+1

### Why It Matters

Profile and fix Django performance problems: N+1 queries, missing indexes, oversized querysets, slow templates, and unbounded loops. Use Django Debug Toolbar, silk, and EXPLAIN.

Profile and fix Django performance problems: N+1 queries, missing indexes, oversized querysets, slow templates, and unbounded loops. Use Django Debug Toolbar, silk, and EXPLAIN.

### Prerequisites

- Stage 5 (Queries), Stage 4 (Models)
- Comfort reading SQL.

### Topics

- The N+1 problem — diagnosis and fix
- select_related (FK / OneToOne via JOIN)
- prefetch_related (M2M / reverse FK via second query + Python join)
- Prefetch() for custom prefetch querysets
- django.db.connection.queries and logging SQL
- Django Debug Toolbar and django-silk
- EXPLAIN ANALYZE and index review
- bulk_create / bulk_update / iterator(chunk_size)
- Caching querysets (cached_property, property pitfalls)

### Key Concepts

- N+1: 1 query to fetch the list + N queries to fetch a relation per row.
- select_related = single SQL JOIN (single-valued relations only).
- prefetch_related = second query + Python-side join (multi-valued).
- `iterator(chunk_size=N)` streams large querysets to avoid loading all into memory.
- `only()` / `defer()` skip loading heavy columns (e.g., body text) when not needed.

```python
# BAD: 1 + N queries (one per post to fetch author)
posts = Post.objects.all()[:100]
for p in posts:
    print(p.author.username)   # 100 extra queries

# GOOD: 1 query with JOIN
posts = Post.objects.select_related("author")[:100]
for p in posts:
    print(p.author.username)   # 0 extra queries

# M2M N+1
for p in posts:
    print([t.name for t in p.tags.all()])  # N+1 again

# Fix with prefetch_related
posts = Post.objects.prefetch_related("tags")[:100]
for p in posts:
    print([t.name for t in p.tags.all()])  # 0 extra queries
```
Caption: N+1 diagnosis and fix

### Common Pitfalls

- Forgetting prefetch_related on M2M in serializers — `CommentSerializer(post.author)` inside a loop = N+1; pre-fetch in get_queryset.
- Calling len(qs) for a count — `len()` materializes the queryset; use `qs.count()` for COUNT(*).
- Slicing a large queryset without iterator — `User.objects.all()[0:1000000]` loads all into memory; use `iterator(chunk_size=N)`.
- Caching a queryset on a function — `@cached_property` on a queryset means it's evaluated once per instance; good for repeated access, bad if you need fresh data.
- Missing indexes on filter/order_by columns — a missing index turns O(log N) into O(N); check with EXPLAIN ANALYZE and add db_index=True or Meta.indexes.

### Real-World Applications

- Instagram famously profiled and fixed N+1s to bring feed-render latency from seconds to <100ms.
- Disqus used django-silk to find slow admin pages and to instrument comment-thread rendering.
- Mozilla MDN uses Django Debug Toolbar in dev and django-silk in staging to catch regressions.
- Eventbrite runs a custom SQL counter in tests; CI fails if a view does more than N queries.

### Interview Questions

- 1. What's an N+1 query and how do you spot it? — 1 query for the list, then N for the relation per row; spot via django.db.connection.queries or assertNumQueries.
- 2. When do you use select_related vs prefetch_related? — select_related for FK/OneToOne (JOIN); prefetch_related for M2M/reverse FK (second query + Python join).
- 3. How do you prefetch only a filtered subset? — Use Prefetch("comments", queryset=Comment.objects.filter(approved=True), to_attr="approved_comments").
- 4. What does .iterator(chunk_size=N) do? — Streams the queryset in chunks of N rows, so you can iterate 1M rows without loading all into memory.
- 5. How do you test for query regressions? — assertNumQueries(N) in Django tests, or pytest-django's django_assert_num_queries fixture.

### Mini Project

Build a Slow Endpoint Profiler: Add django-silk to a starter project; build a /report/ view that lists all posts with author + tags + recent comments. Use select_related, prefetch_related, and Prefetch() to bring query count from 100s down to ~3. Compare timings before/after. Suggested approach:
  - Install django-silk; add middleware + URLs
  - First pass: naive loop, record query count + time via Silk
  - Add select_related("author"), prefetch_related("tags")
  - Add Prefetch("comments", queryset=Comment.objects.order_by("-created_at")[:3])
  - Verify with assertNumQueries(3)

### Exercises

1. Enable SQL logging in dev; identify an N+1 in your list view.
2. Add select_related to a list view; verify with assertNumQueries.
3. Use Prefetch() to load only the 5 most recent comments per post.
4. Stream 100k rows with iterator(chunk_size=1000) and compare memory usage.
5. Add a composite index and verify with EXPLAIN ANALYZE.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which method fixes N+1 on a ForeignKey?
9. A) select_related (*)
10. B) prefetch_related
11. C) eager_load
12. D) join_related
13. Explanation: select_related uses a SQL JOIN to fetch the related row in the same query. Only works for single-valued relations (FK, OneToOne).
14. Q2: Which method fixes N+1 on a ManyToMany?
15. A) select_related
16. B) prefetch_related (*)
17. C) join_m2m
18. D) eager_m2m
19. Explanation: prefetch_related issues a second query (IN ...) and joins in Python. select_related can't JOIN multi-valued relations.
20. Q3: How do you prefetch a filtered subset?
21. A) prefetch_related("comments", filter="approved")
22. B) prefetch_filter("comments", approved=True)
23. C) Prefetch("comments", queryset=Comment.objects.filter(approved=True)) (*)
24. D) You can't filter a prefetch
25. Explanation: Prefetch() takes a queryset arg. Optionally set to_attr to store the result on a custom attribute.
26. Q4: What does .iterator(chunk_size=1000) do?
27. A) Returns 1000 items only
28. B) Limits the query to 1000
29. C) Sets a 1000ms timeout
30. D) Streams the queryset in chunks of 1000 rows to avoid loading all into memory (*)
31. Explanation: iterator() doesn't cache results; chunk_size is the number of rows fetched per DB round-trip. Use for large exports.
32. Q5: Which is faster for counting rows?
33. A) qs.count() (*)
34. B) len(qs)
35. C) qs.len()
36. D) list(qs) and count
37. Explanation: count() runs SELECT COUNT(*) — no rows transferred. len(qs) loads every row into memory first.
38. Q6: What does assertNumQueries(3) do?
39. A) Asserts exactly 3 rows returned
40. B) Asserts the block runs exactly 3 SQL queries (*)
41. C) Asserts the query takes 3 seconds
42. D) Limits the query to 3
43. Explanation: assertNumQueries is a Django test context manager. Use it to catch N+1 regressions.
44. Q7: Which tool is best for profiling a slow view in dev?
45. A) print() statements
46. B) curl
47. C) Django Debug Toolbar (*)
48. D) browser devtools
49. Explanation: Django Debug Toolbar shows queries, headers, static files, templates, and signals per page. Use django-silk for staging/prod-like profiles.
50. Q8: What's the cost of a missing index on filter()?
51. A) No cost
52. B) Faster queries
53. C) Memory leak
54. D) Full table scan — O(N) instead of O(log N) (*)
55. Explanation: Without an index, Postgres does a sequential scan. Add db_index=True or a Meta.indexes entry; verify with EXPLAIN ANALYZE.
56. Q9: Which is the best way to defer loading a heavy TextField?
57. A) .only("id", "title") or .defer("body") (*)
58. B) Don't select it
59. C) .exclude("body")
60. D) Cast the field to None
61. Explanation: only() loads only listed fields; defer() loads all but listed. Lazy fields fetch on access (extra query) — beware of N+1 when iterating.
62. Q10: What does bulk_create do that save() in a loop doesn't?
63. A) Triggers pre_save signals
64. B) Issues one INSERT (or batch) instead of N INSERTs (*)
65. C) Updates existing rows
66. D) Calls clean()
67. Explanation: bulk_create batches INSERTs (per batch_size). It skips save(), pre_save/post_save signals, and clean() — manage those yourself if needed.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method fixes N+1 on a ForeignKey?
  options:
    - select_related
    - prefetch_related
    - eager_load
    - join_related
  correctIndex: 0
  explanation: select_related uses a SQL JOIN to fetch the related row in the same query. Only works for single-valued relations (FK, OneToOne).
- id: q2
  question: Which method fixes N+1 on a ManyToMany?
  options:
    - select_related
    - prefetch_related
    - join_m2m
    - eager_m2m
  correctIndex: 1
  explanation: prefetch_related issues a second query (IN ...) and joins in Python. select_related can't JOIN multi-valued relations.
- id: q3
  question: How do you prefetch a filtered subset?
  options:
    - prefetch_related("comments", filter="approved")
    - prefetch_filter("comments", approved=True)
    - Prefetch("comments", queryset=Comment.objects.filter(approved=True))
    - You can't filter a prefetch
  correctIndex: 2
  explanation: Prefetch() takes a queryset arg. Optionally set to_attr to store the result on a custom attribute.
- id: q4
  question: What does .iterator(chunk_size=1000) do?
  options:
    - Returns 1000 items only
    - Limits the query to 1000
    - Sets a 1000ms timeout
    - Streams the queryset in chunks of 1000 rows to avoid loading all into memory
  correctIndex: 3
  explanation: iterator() doesn't cache results; chunk_size is the number of rows fetched per DB round-trip. Use for large exports.
- id: q5
  question: Which is faster for counting rows?
  options:
    - qs.count()
    - len(qs)
    - qs.len()
    - list(qs) and count
  correctIndex: 0
  explanation: count() runs SELECT COUNT(*) — no rows transferred. len(qs) loads every row into memory first.
- id: q6
  question: What does assertNumQueries(3) do?
  options:
    - Asserts exactly 3 rows returned
    - Asserts the block runs exactly 3 SQL queries
    - Asserts the query takes 3 seconds
    - Limits the query to 3
  correctIndex: 1
  explanation: assertNumQueries is a Django test context manager. Use it to catch N+1 regressions.
- id: q7
  question: Which tool is best for profiling a slow view in dev?
  options:
    - print() statements
    - curl
    - Django Debug Toolbar
    - browser devtools
  correctIndex: 2
  explanation: Django Debug Toolbar shows queries, headers, static files, templates, and signals per page. Use django-silk for staging/prod-like profiles.
- id: q8
  question: What's the cost of a missing index on filter()?
  options:
    - No cost
    - Faster queries
    - Memory leak
    - Full table scan — O(N) instead of O(log N)
  correctIndex: 3
  explanation: Without an index, Postgres does a sequential scan. Add db_index=True or a Meta.indexes entry; verify with EXPLAIN ANALYZE.
- id: q9
  question: Which is the best way to defer loading a heavy TextField?
  options:
    - .only("id", "title") or .defer("body")
    - Don't select it
    - .exclude("body")
    - Cast the field to None
  correctIndex: 0
  explanation: only() loads only listed fields; defer() loads all but listed. Lazy fields fetch on access (extra query) — beware of N+1 when iterating.
- id: q10
  question: What does bulk_create do that save() in a loop doesn't?
  options:
    - Triggers pre_save signals
    - Issues one INSERT (or batch) instead of N INSERTs
    - Updates existing rows
    - Calls clean()
  correctIndex: 1
  explanation: bulk_create batches INSERTs (per batch_size). It skips save(), pre_save/post_save signals, and clean() — manage those yourself if needed.
```

