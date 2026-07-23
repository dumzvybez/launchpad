---
slug: mongodb-projection-sorting-pagination
id: mongodb-05
track: mongodb
order: 5
title: Projection, Sorting, and Pagination
description: Use projection to fetch only the fields you need, sort efficiently with indexes, and paginate large result sets with offset and keyset strategies.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=120s
whyItMatters: Use projection to fetch only the fields you need, sort efficiently with indexes, and paginate large result sets with offset and keyset strategies.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Projection, Sorting, and Pagination

## Projection, Sorting, and Pagination

### Why It Matters

Use projection to fetch only the fields you need, sort efficiently with indexes, and paginate large result sets with offset and keyset strategies.

Use projection to fetch only the fields you need, sort efficiently with indexes, and paginate large result sets with offset and keyset strategies.

### Prerequisites

- Stage 3 (CRUD) and Stage 4 (Query Operators).
- Awareness that MongoDB returns a cursor (not an array) from `find()`.

### Topics

- Projection: inclusion vs exclusion, `_id` special case, projection of nested fields
- `sort({ field: 1|-1 })` and compound sorts
- `limit()` and `skip()` for paging
- The offset-pagination performance cliff and why `skip` is O(N)
- Keyset (cursor) pagination using `_id` or a sortable field
- `countDocuments` vs `estimatedDocumentCount`
- Cursor methods chaining order matters (sort -> skip -> limit)
- Covered queries: projection matches the index exactly

### Key Concepts

- Projection: `{ name: 1, price: 1, _id: 0 }` includes only those fields; you can mix inclusion and exclusion ONLY for `_id` (which is included by default).
- Sort is backed by an index when possible; an in-memory sort on >100MB of data fails by default (`allowDiskUse` changes this in aggregation but `find` sort still has limits).
- `skip(N)` requires scanning and discarding N documents — O(N) — so deep pagination (page 1000) is slow; use keyset pagination instead.
- Keyset pagination: `find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(20)` is O(log N + limit), not O(N + limit).
- `estimatedDocumentCount` is fast (collection metadata) but approximate; `countDocuments` is exact but runs a query — use the right one for the job.

```javascript
// Include only name and price; suppress _id
db.products.find(
  { inStock: true },
  { name: 1, price: 1, _id: 0 }
)

// Exclude a big field (e.g., a stored HTML blob)
db.posts.find({}, { body: 0 })

// Project nested array element by index (only first tag)
db.posts.find({}, { "tags.0": 1 })

// Project specific subdoc fields with dot notation
db.users.find({}, { "address.city": 1, "address.geo": 1 })
```
Caption: Projection

### Common Pitfalls

- Mixing inclusion and exclusion in one projection (except `_id`) — `{ name: 1, body: 0 }` is a syntax error; you can only do one or the other (plus `_id`).
- Paginating with `skip(10000)` for "page 501" of a 20-per-page list — `skip` is O(N); switch to keyset pagination for any page beyond the first few.
- Sorting on a non-indexed field with >100MB of candidate documents — `find().sort()` fails with QueryExceededMemoryLimit; create a compound index covering the filter + sort.
- Forgetting that cursor method order matters — `find().limit(10).skip(20)` is the same as `find().skip(20).limit(10)` in mongosh, but the canonical order is `sort -> skip -> limit` for readability.
- Using `countDocuments({})` to show "total pages" on a UI — it runs a full scan; cache the count or use `estimatedDocumentCount` for an approximate total.

### Real-World Applications

- eBay uses keyset pagination on product listings to keep page-load times flat across deep pages.
- Stripe uses projection (`{ customer: 1, amount: 1, _id: 0 }`) on its dashboard queries to avoid shipping full invoice documents over the wire.
- Uber Eats paginates restaurant menus with `_id`-keyset queries so that scrolling never slows down past page 10.
- Adobe uses compound indexes `(status, priority)` to back sorted job-queue queries without in-memory sorts.

### Interview Questions

- 1. Why is `skip(N)` slow for large N? — MongoDB must scan and discard N documents; it's O(N) per page, so deep pagination becomes linearly worse.
- 2. How does keyset pagination work? — Filter on `_id > lastSeenId` (or a sortable field) and `limit(N)` — O(log N + N), constant per page.
- 3. Can you mix inclusion and exclusion in one projection? — Only for `_id`; otherwise you must pick all-inclusion or all-exclusion.
- 4. What's the difference between `countDocuments` and `estimatedDocumentCount`? — `countDocuments` runs a query (exact, slower); `estimatedDocumentCount` reads collection metadata (fast, approximate).
- 5. What is a covered query? — A query where the index contains every field the query filters, sorts, and projects — so MongoDB answers from the index without fetching the document.

### Mini Project

Build an Infinite-Scroll Feed API: A Node endpoint `GET /feed?cursor=&limit=20` that returns the next page of posts and a `nextCursor` for the next call, with O(log N + limit) cost per page. Suggested approach:
  - Sort posts by `createdAt: -1, _id: -1` and create a compound index `{ createdAt: -1, _id: -1 }`
  - Encode the cursor as base64(JSON({ createdAt, _id }))
  - On each request, decode the cursor and build a filter: `{ $or: [{ createdAt: { $lt: lastCreatedAt } }, { createdAt: lastCreatedAt, _id: { $lt: lastId } }] }`
  - Project `{ body: 0 }` to skip the large content blob from the listing
  - Return `{ items, nextCursor }` where `nextCursor` is built from the last item

### Exercises

1. Write a `find` with projection that returns only `name` and `price` for in-stock products, excluding `_id`.
2. Build offset pagination (`skip` + `limit`) for page 5 of 20-per-page, then rewrite it as keyset pagination using `_id`.
3. Create a compound index on `{ status: 1, priority: -1 }` and confirm `find().sort({ status: 1, priority: -1 })` uses it via `explain()`.
4. Compare `countDocuments({})` and `estimatedDocumentCount()` on a 1M-document collection — note the time difference.
5. >>> QUIZ (Stage 5) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which projection returns only `name` and `price`, suppressing `_id`?
8. A) { name: 1, price: 1, _id: 0 } (*)
9. B) { name: 1, price: 1 }
10. C) { name: 0, price: 0, _id: 0 }
11. D) { _id: -1, name: 1, price: 1 }
12. Explanation: `_id` is included by default; explicitly set `_id: 0` to suppress it. Other fields must all be either inclusion (1) or exclusion (0).
13. Q2: Why is `skip(10000).limit(20)` slow?
14. A) It uses too much memory
15. B) It must scan and discard 10,000 documents before returning 20 (*)
16. C) It can't use indexes
17. D) It's actually fast
18. Explanation: `skip(N)` is O(N) — MongoDB scans N documents and throws them away, so deep offset pagination degrades linearly.
19. Q3: What's the correct keyset-pagination filter for "next page after `lastId`" sorted by `_id` ascending?
20. A) { _id: { $lt: lastId } }
21. B) { _id: { $ne: lastId } }
22. C) { _id: { $gt: lastId } } (*)
23. D) { _id: lastId }
24. Explanation: For ascending `_id` sort, the next page is documents with `_id` greater than the last seen ID, fetched with `.sort({ _id: 1 }).limit(n)`.
25. Q4: Which is faster for an approximate total count of a large collection?
26. A) countDocuments({})
27. B) find().length
28. C) aggregate $count
29. D) estimatedDocumentCount() (*)
30. Explanation: `estimatedDocumentCount` reads collection metadata (no scan), so it's O(1); `countDocuments` runs an actual query and is O(N) on unindexed filters.
31. Q5: What does a covered query require?
32. A) The index contains every field the query filters, sorts, and projects (*)
33. B) The collection is small
34. C) The query uses $expr
35. D) The query has no projections
36. Explanation: A covered query is answered entirely from index entries — no document fetch — so all filtered/sorted/projected fields must be in the index.
37. Q6: What's the canonical order to chain cursor methods?
38. A) limit -> skip -> sort
39. B) sort -> skip -> limit (*)
40. C) skip -> sort -> limit
41. D) Order doesn't matter
42. Explanation: Logically: sort first, then skip past pages, then limit per page. In mongosh the actual order in the chain doesn't matter, but `sort -> skip -> limit` is the readable convention.
43. Q7: Can you project both inclusion and exclusion at once?
44. A) Yes, always
45. B) Only in aggregations
46. C) Only `_id` can be mixed with inclusion/exclusion; all other fields must be one or the other (*)
47. D) Only on sharded collections
48. Explanation: `{ name: 1, body: 0 }` is illegal; you must pick all-inclusion or all-exclusion. `_id` is the only field that can be excluded alongside inclusions (or vice versa).
49. Q8: What does an in-memory sort require if it exceeds 100MB?
50. A) It silently fails
51. B) It uses swap automatically
52. C) It splits into multiple queries
53. D) It errors out (find sort can't use disk; aggregation can with allowDiskUse) (*)
54. Explanation: A `find().sort()` that can't use an index errors when the sort exceeds the 32MB memory limit; create a supporting index. Aggregation `$sort` can use `allowDiskUse: true`.
55. Q9: How do you paginate a compound sort `(status asc, priority desc)` with keyset?
56. A) Filter on { $or: [ { status: { $gt: lastStatus } }, { status: lastStatus, priority: { $lt: lastPriority } } ] } (*)
57. B) Filter on _id only
58. C) Use skip
59. D) It can't be done
60. Explanation: For keyset pagination on a compound sort, the filter is a "strictly greater" tuple: either status is strictly greater, OR status is equal and priority is strictly less (because priority is descending).
61. Q10: What's the trade-off of `countDocuments` vs `estimatedDocumentCount` for a UI "total pages"?
62. A) countDocuments is always better
63. B) countDocuments is exact but slow on large collections; estimatedDocumentCount is fast but approximate — cache or estimate for UI totals (*)
64. C) estimatedDocumentCount is always better
65. D) They're identical
66. Explanation: For UI pagination totals, an approximate count is usually fine and avoids the O(N) cost of `countDocuments`; cache the value if exact matters.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which projection returns only `name` and `price`, suppressing `_id`?
  options:
    - "{ name: 1, price: 1, _id: 0 }"
    - "{ name: 1, price: 1 }"
    - "{ name: 0, price: 0, _id: 0 }"
    - "{ _id: -1, name: 1, price: 1 }"
  correctIndex: 0
  explanation: "`_id` is included by default; explicitly set `_id: 0` to suppress it. Other fields must all be either inclusion (1) or exclusion (0)."
- id: q2
  question: Why is `skip(10000).limit(20)` slow?
  options:
    - It uses too much memory
    - It must scan and discard 10,000 documents before returning 20
    - It can't use indexes
    - It's actually fast
    - "` is O(N) — MongoDB scans N documents and throws them away, so deep offset pagination degrades linearly."
  correctIndex: 1
  explanation: "`skip(N)` is O(N) — MongoDB scans N documents and throws them away, so deep offset pagination degrades linearly."
- id: q3
  question: What's the correct keyset-pagination filter for "next page after `lastId`" sorted by `_id` ascending?
  options:
    - "{ _id: { $lt: lastId } }"
    - "{ _id: { $ne: lastId } }"
    - "{ _id: { $gt: lastId } }"
    - "{ _id: lastId }"
  correctIndex: 2
  explanation: "For ascending `_id` sort, the next page is documents with `_id` greater than the last seen ID, fetched with `.sort({ _id: 1 }).limit(n)`."
- id: q4
  question: Which is faster for an approximate total count of a large collection?
  options:
    - countDocuments({})
    - find().length
    - aggregate $count
    - estimatedDocumentCount()
    - on unindexed filters.
  correctIndex: 3
  explanation: "`estimatedDocumentCount` reads collection metadata (no scan), so it's O(1); `countDocuments` runs an actual query and is O(N) on unindexed filters."
- id: q5
  question: What does a covered query require?
  options:
    - The index contains every field the query filters, sorts, and projects
    - The collection is small
    - The query uses $expr
    - The query has no projections
  correctIndex: 0
  explanation: A covered query is answered entirely from index entries — no document fetch — so all filtered/sorted/projected fields must be in the index.
- id: q6
  question: What's the canonical order to chain cursor methods?
  options:
    - limit -> skip -> sort
    - sort -> skip -> limit
    - skip -> sort -> limit
    - Order doesn't matter
  correctIndex: 1
  explanation: "Logically: sort first, then skip past pages, then limit per page. In mongosh the actual order in the chain doesn't matter, but `sort -> skip -> limit` is the readable convention."
- id: q7
  question: Can you project both inclusion and exclusion at once?
  options:
    - Yes, always
    - Only in aggregations
    - Only `_id` can be mixed with inclusion/exclusion; all other fields must be one or the other
    - Only on sharded collections
  correctIndex: 2
  explanation: "`{ name: 1, body: 0 }` is illegal; you must pick all-inclusion or all-exclusion. `_id` is the only field that can be excluded alongside inclusions (or vice versa)."
- id: q8
  question: What does an in-memory sort require if it exceeds 100MB?
  options:
    - It silently fails
    - It uses swap automatically
    - It splits into multiple queries
    - It errors out (find sort can't use disk; aggregation can with allowDiskUse)
  correctIndex: 3
  explanation: "A `find().sort()` that can't use an index errors when the sort exceeds the 32MB memory limit; create a supporting index. Aggregation `$sort` can use `allowDiskUse: true`."
- id: q9
  question: How do you paginate a compound sort `(status asc, priority desc)` with keyset?
  options:
    - "Filter on { $or: [ { status: { $gt: lastStatus } }, { status: lastStatus, priority: { $lt: lastPriority } } ] }"
    - Filter on _id only
    - Use skip
    - It can't be done
  correctIndex: 0
  explanation: 'For keyset pagination on a compound sort, the filter is a "strictly greater" tuple: either status is strictly greater, OR status is equal and priority is strictly less (because priority is descending).'
- id: q10
  question: What's the trade-off of `countDocuments` vs `estimatedDocumentCount` for a UI "total pages"?
  options:
    - countDocuments is always better
    - countDocuments is exact but slow on large collections; estimatedDocumentCount is fast but approximate — cache or estimate for UI totals
    - estimatedDocumentCount is always better
    - They're identical
    - cost of `countDocuments`; cache the value if exact matters.
  correctIndex: 1
  explanation: For UI pagination totals, an approximate count is usually fine and avoids the O(N) cost of `countDocuments`; cache the value if exact matters.
```

