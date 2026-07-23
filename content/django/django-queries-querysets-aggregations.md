---
slug: django-queries-querysets-aggregations
id: django-05
track: django
order: 5
title: Queries, QuerySets, and Aggregations
description: Master QuerySet evaluation, lazy loading, chaining, and advanced ORM operations — annotations, aggregations, F expressions, Q objects, and bulk operations.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=120s
whyItMatters: Master QuerySet evaluation, lazy loading, chaining, and advanced ORM operations — annotations, aggregations, F expressions, Q objects, and bulk operations.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Queries, QuerySets, and Aggregations

## Queries, QuerySets, and Aggregations

### Why It Matters

Master QuerySet evaluation, lazy loading, chaining, and advanced ORM operations — annotations, aggregations, F expressions, Q objects, and bulk operations.

Master QuerySet evaluation, lazy loading, chaining, and advanced ORM operations — annotations, aggregations, F expressions, Q objects, and bulk operations.

### Prerequisites

- Stage 4: Models and the ORM
- Comfort with SQL GROUP BY, JOIN, and WHERE clauses.

### Topics

- QuerySet laziness and evaluation points (list(), iteration, len(), bool(), indexing)
- Field lookups: __exact, __iexact, __contains, __icontains, __gt, __in, __range, __date, __year
- Q objects for OR / NOT queries
- F expressions for atomic updates and comparisons
- annotate() vs aggregate()
- Subqueries and Exists()
- bulk_create, bulk_update, and iterator(chunk_size=...)
- distinct(), values(), values_list(), only(), defer()

### Key Concepts

- A QuerySet is lazy — no SQL runs until you iterate, slice, len(), list(), or bool() it.
- QuerySets are immutable; each chained method returns a new QuerySet.
- annotate() adds a per-row computed column; aggregate() collapses the queryset to a single dict.
- F() references other columns — used for atomic UPDATEs that avoid race conditions.
- Q() builds complex WHERE clauses with | (OR), & (AND), and ~ (NOT).

```python
qs = Post.objects.filter(status="published")  # NO SQL yet
qs = qs.exclude(author__is_staff=True)         # still no SQL
qs = qs.order_by("-published_at")[:10]         # still no SQL

# These trigger SQL:
list(qs)                  # SELECT ... LIMIT 10
len(qs)                   # SELECT COUNT(*) ... LIMIT 10
bool(qs)                  # SELECT ... LIMIT 1
for p in qs: print(p)     # SELECT ...
```
Caption: Lazy evaluation demo

### Common Pitfalls

- N+1 queries in loops — `for p in posts: print(p.author.name)` fires one SELECT per author; fix with `.select_related("author")` (FK) or `.prefetch_related("tags")` (M2M).
- Using Python to count instead of `.count()` — `len(posts)` materializes all rows; `.count()` runs COUNT(*) in SQL.
- Forgetting that slicing `qs[:10]` still doesn't evaluate — but `list(qs[:10])` does; slicing returns a new lazy queryset.
- Updating then reading without refresh — after `.update(...)`, in-memory instances have stale values; call `instance.refresh_from_db()` or refetch.
- Misusing `distinct()` without order_by — DISTINCT ON (Postgres) requires the ORDER BY to start with the same columns; otherwise results are non-deterministic.

### Real-World Applications

- Instagram's feed ranking uses SQL-side aggregations (counts, recent timestamps) to avoid Python loops over millions of rows.
- Disqus's "popular threads" feature uses annotate(Count("likes")) + order_by to compute engagement at the DB level.
- Mozilla SUMO's dashboards use aggregations for question/answer counts per contributor over rolling windows.
- Eventbite uses bulk_create for ticket imports to cut INSERT round-trips from minutes to seconds.

### Interview Questions

- 1. When is a QuerySet actually evaluated? — On iteration, slicing with step, len(), list(), bool(), repr(), or pickling. Methods like filter()/exclude() are lazy.
- 2. What's the difference between annotate and aggregate? — annotate adds a per-row computed value; aggregate collapses the entire queryset into one dict.
- 3. What does F() do and why use it? — F() references another column; using F("count") + 1 in update() issues a single atomic UPDATE, avoiding read-modify-write races.
- 4. When do you need select_related vs prefetch_related? — select_related for FK/OneToOne (SQL JOIN); prefetch_related for M2M/reverse FK (separate query + Python join).
- 5. How do you do an OR query? — Use Q objects: `Model.objects.filter(Q(a=1) | Q(b=2))`.

### Mini Project

Build a Sales Analytics Dashboard: A `Sales` model with product, quantity, price, sold_at. Build a `SalesSummary` service that returns total revenue, top-5 products by revenue, and the best-selling day in the last 30 days — all computed in SQL with annotate/aggregate. Suggested approach:
  - Annotate each row with `revenue=F("quantity") * F("price")`
  - Use `values("product").annotate(total=Sum("revenue")).order_by("-total")[:5]`
  - Use `values("sold_at__date").annotate(total=Sum("revenue")).order_by("-total").first()`
  - Add `select_related("product")` everywhere you'll iterate
  - Use `.aggregate(total=Sum("revenue"))` for the headline number

### Exercises

1. Write a query that returns users who have at least 3 published posts (annotate + filter).
2. Use Q objects to find posts that are either "featured" OR have > 100 views.
3. Atomically decrement inventory with `F("stock") - 1` and a `stock__gt=0` filter.
4. Use Subquery to annotate each user with the title of their most recent post.
5. Convert a slow loop creating 1000 objects to a single bulk_create call and measure the speedup.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When does `Post.objects.filter(status="published")` actually run SQL?
9. A) Only when the queryset is evaluated (iterated, len(), list(), etc.) (*)
10. B) Immediately, when filter() is called
11. C) Never — it's cached forever
12. D) Only inside transactions
13. Explanation: QuerySets are lazy. filter() returns a new QuerySet; SQL runs only at evaluation points like list(), iteration, len(), bool(), or slicing.
14. Q2: Which method adds a per-row computed column?
15. A) aggregate()
16. B) annotate() (*)
17. C) compute()
18. D) extra()
19. Explanation: annotate() adds a per-row field (e.g., Count("comments")). aggregate() collapses to a single dict (e.g., total=Sum("price")).
20. Q3: What does F("view_count") + 1 inside .update() guarantee?
21. A) The view count is read into Python and incremented
22. B) The object is deleted
23. C) A single atomic SQL UPDATE that increments the column server-side (*)
24. D) The field is renamed
25. Explanation: F() pushes the arithmetic into SQL, so the database does the increment atomically — no read-modify-write race.
26. Q4: Which method should you use to count rows without materializing them?
27. A) len(qs)
28. B) list(qs).count()
29. C) qs.len()
30. D) qs.count() (*)
31. Explanation: .count() runs SELECT COUNT(*) — no rows transferred. len(qs) loads every row into memory first.
32. Q5: select_related is best for which relationship?
33. A) ForeignKey / OneToOne (single-valued) (*)
34. B) ManyToMany
35. C) Reverse ForeignKey (many)
36. D) Generic relations
37. Explanation: select_related uses a SQL JOIN to fetch the related row in one query, but only works for single-valued relations. Use prefetch_related for M2M and reverse FK.
38. Q6: Which Q expression means "NOT (status=draft)"?
39. A) Q(status="draft").invert()
40. B) ~Q(status="draft") (*)
41. C) !Q(status="draft")
42. D) -Q(status="draft")
43. Explanation: Python's ~ operator on Q produces a negation. | is OR, & is AND, ~ is NOT.
44. Q7: What's the correct way to fetch only the title column?
45. A) qs.only("title")
46. B) qs.values_list("title", flat=True)
47. C) Both A and B work; A returns model instances with deferred fields, B returns tuples/strings (*)
48. D) qs.column("title")
49. Explanation: values_list("title", flat=True) returns plain strings/tuples — fastest. only("title") returns model instances that lazily fetch other fields on access.
50. Q8: Which problem does prefetch_related solve?
51. A) Missing database indexes
52. B) Slow SQL JOINs
53. C) Stale cache
54. D) N+1 queries on M2M or reverse FK relations (*)
55. Explanation: prefetch_related issues a second query (IN ...) and joins in Python, which works for M2M/reverse FK where select_related can't.
56. Q9: Which is a valid evaluation trigger for a lazy QuerySet?
57. A) list(qs) (*)
58. B) qs.filter(...)
59. C) qs.exclude(...)
60. D) qs.order_by(...)
61. Explanation: filter/exclude/order_by return new lazy querysets. list(qs), iteration, len(qs), bool(qs), slicing with step, and repr(qs) all force evaluation.
62. Q10: What does bulk_update do?
63. A) Updates all rows in a single UPDATE
64. B) Issues one UPDATE per field per batch of objects (more efficient than save() in a loop) (*)
65. C) Drops the table
66. D) Calls save() on each instance
67. Explanation: bulk_update([obj1, obj2, ...], ["field"]) batches UPDATEs by field; it doesn't call save() (so no signals fire) and skips auto_now by default.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When does `Post.objects.filter(status="published")` actually run SQL?
  options:
    - Only when the queryset is evaluated (iterated, len(), list(), etc.)
    - Immediately, when filter() is called
    - Never — it's cached forever
    - Only inside transactions
  correctIndex: 0
  explanation: QuerySets are lazy. filter() returns a new QuerySet; SQL runs only at evaluation points like list(), iteration, len(), bool(), or slicing.
- id: q2
  question: Which method adds a per-row computed column?
  options:
    - aggregate()
    - annotate()
    - compute()
    - extra()
  correctIndex: 1
  explanation: annotate() adds a per-row field (e.g., Count("comments")). aggregate() collapses to a single dict (e.g., total=Sum("price")).
- id: q3
  question: What does F("view_count") + 1 inside .update() guarantee?
  options:
    - The view count is read into Python and incremented
    - The object is deleted
    - A single atomic SQL UPDATE that increments the column server-side
    - The field is renamed
  correctIndex: 2
  explanation: F() pushes the arithmetic into SQL, so the database does the increment atomically — no read-modify-write race.
- id: q4
  question: Which method should you use to count rows without materializing them?
  options:
    - len(qs)
    - list(qs).count()
    - qs.len()
    - qs.count()
  correctIndex: 3
  explanation: .count() runs SELECT COUNT(*) — no rows transferred. len(qs) loads every row into memory first.
- id: q5
  question: select_related is best for which relationship?
  options:
    - ForeignKey / OneToOne (single-valued)
    - ManyToMany
    - Reverse ForeignKey (many)
    - Generic relations
  correctIndex: 0
  explanation: select_related uses a SQL JOIN to fetch the related row in one query, but only works for single-valued relations. Use prefetch_related for M2M and reverse FK.
- id: q6
  question: Which Q expression means "NOT (status=draft)"?
  options:
    - Q(status="draft").invert()
    - ~Q(status="draft")
    - '!Q(status="draft")'
    - -Q(status="draft")
  correctIndex: 1
  explanation: Python's ~ operator on Q produces a negation. | is OR, & is AND, ~ is NOT.
- id: q7
  question: What's the correct way to fetch only the title column?
  options:
    - qs.only("title")
    - qs.values_list("title", flat=True)
    - Both A and B work; A returns model instances with deferred fields, B returns tuples/strings
    - qs.column("title")
  correctIndex: 2
  explanation: values_list("title", flat=True) returns plain strings/tuples — fastest. only("title") returns model instances that lazily fetch other fields on access.
- id: q8
  question: Which problem does prefetch_related solve?
  options:
    - Missing database indexes
    - Slow SQL JOINs
    - Stale cache
    - N+1 queries on M2M or reverse FK relations
  correctIndex: 3
  explanation: prefetch_related issues a second query (IN ...) and joins in Python, which works for M2M/reverse FK where select_related can't.
- id: q9
  question: Which is a valid evaluation trigger for a lazy QuerySet?
  options:
    - list(qs)
    - qs.filter(...)
    - qs.exclude(...)
    - qs.order_by(...)
  correctIndex: 0
  explanation: filter/exclude/order_by return new lazy querysets. list(qs), iteration, len(qs), bool(qs), slicing with step, and repr(qs) all force evaluation.
- id: q10
  question: What does bulk_update do?
  options:
    - Updates all rows in a single UPDATE
    - Issues one UPDATE per field per batch of objects (more efficient than save() in a loop)
    - Drops the table
    - Calls save() on each instance
  correctIndex: 1
  explanation: bulk_update([obj1, obj2, ...], ["field"]) batches UPDATEs by field; it doesn't call save() (so no signals fire) and skips auto_now by default.
```

