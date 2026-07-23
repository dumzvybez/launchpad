---
slug: mongodb-aggregation-lookup-unwind-facet
id: mongodb-08
track: mongodb
order: 8
title: Aggregation — $lookup, $unwind, $facet
description: Join collections with `$lookup`, flatten arrays with `$unwind`, and run multiple sub-pipelines in one pass with `$facet`.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=210s
whyItMatters: Join collections with `$lookup`, flatten arrays with `$unwind`, and run multiple sub-pipelines in one pass with `$facet`.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Aggregation — $lookup, $unwind, $facet

## Aggregation — $lookup, $unwind, $facet

### Why It Matters

Join collections with `$lookup`, flatten arrays with `$unwind`, and run multiple sub-pipelines in one pass with `$facet`.

Join collections with `$lookup`, flatten arrays with `$unwind`, and run multiple sub-pipelines in one pass with `$facet`.

### Prerequisites

- Stage 7 (Aggregation basics: `$match`, `$group`, `$project`).
- Understanding of relational JOINs (helpful, but MongoDB's `$lookup` is left-outer-join only).

### Topics

- `$lookup` basic form (from, localField, foreignField, as)
- `$lookup` with `pipeline` and `let` for advanced joins
- `$unwind` to flatten arrays (with `preserveNullAndEmptyArrays`)
- `$facet` to run multiple pipelines in parallel on the same input
- `$sortByCount` for quick histogram buckets
- `$bucketAuto` for auto-bucketing
- `$replaceRoot` / `$replaceWith`
- `$merge` vs `$out` for materializing pipeline output

### Key Concepts

- `$lookup` is a LEFT OUTER JOIN: for each input document, it appends an array of matching foreign documents; un-matched inputs get an empty array.
- The basic `$lookup` is equality-only on a single field; the `pipeline + let` form supports arbitrary matching conditions.
- `$unwind` produces one output document per array element; use `preserveNullAndEmptyArrays: true` to keep docs whose array is missing/empty.
- `$facet` runs multiple named sub-pipelines on the SAME input — perfect for "data + total count + facets" in one round trip.
- `$merge` (4.2+) writes pipeline output back to a collection with upsert/replace/keep-existing semantics, replacing the older `$out`.

```javascript
db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
  }},
  { $unwind: "$customer" },          // flatten the 1-element array
  { $project: { orderId: "$_id", customerName: "$customer.name", total: 1 } }
])
```
Caption: Basic $lookup

### Common Pitfalls

- Using `$lookup` everywhere instead of embedding — each `$lookup` is a separate index probe per input document; for frequently-accessed joins, consider denormalizing/embedding.
- Forgetting to index `foreignField` on the foreign collection — `$lookup` does an index lookup per input doc; an unindexed foreignField forces a COLLSCAN per input doc, killing performance.
- Running `$unwind` on an unbounded array before `$match` — produces one doc per array element, multiplying the pipeline size; filter first.
- Treating `$facet` as a way to "shard" work — sub-pipelines run independently and can't share state; results are returned as a single document (each facet is an array).
- Using `$out` (which replaces the target collection) when you meant to upsert — `$out` drops the target collection each run; use `$merge` with `whenMatched: "replace"` for incremental upserts.

### Real-World Applications

- Stripe uses `$lookup` to join charges with refunds and disputes for the merchant dashboard.
- eBay uses `$facet` to return product results plus category facets and price histograms in one query.
- Adobe uses `$lookup` with sub-pipelines to enrich content documents with computed metrics (view counts, ratings).
- Coinbase uses `$merge` to materialize per-minute candlestick bars from raw trades for charting APIs.

### Interview Questions

- 1. Is `$lookup` an inner or outer join? — Left OUTER join: every input document appears in the output; unmatched inputs get an empty array.
- 2. When would you use the `pipeline + let` form of `$lookup`? — When you need non-equality matching, aggregation filters, or grouped/summarized foreign data per input doc.
- 3. What does `$unwind` do to missing/empty arrays? — By default it DROPS the document; set `preserveNullAndEmptyArrays: true` to keep it with a null field.
- 4. What's the difference between `$out` and `$merge`? — `$out` replaces the target collection wholesale; `$merge` (4.2+) upserts/replaces/keeps per document, enabling incremental materializations.
- 5. Why is `$facet` useful for search results? — It runs data + total count + faceted filters in one round-trip, avoiding N+1 queries.

### Mini Project

Build a Search-with-Facets Endpoint: `GET /products?q=&category=&page=` returns `{ data, total, facets: { categories, brands, priceBuckets } }` from a single `aggregate()` call with `$facet`. Suggested approach:
  - First stage `$match` on the query (text index `$text` or regex on `name`)
  - Single `$facet` stage with sub-pipelines: `data` (sort + skip + limit), `total` ($count), `categories` ($group by category), `brands` ($group by brand), `priceBuckets` ($bucket)
  - Index `name` (text), `category`, and `brand` so the `$match` and facet `$group` stages use indexes
  - Transform the output so `total` is a single number, not `[{ count: N }]`
  - Add a `$lookup` to enrich each product with `reviewCount` and `avgRating` from a `reviews` collection

### Exercises

1. Write a `$lookup` joining `orders` to `customers` on `customerId` and `$unwind` the result.
2. Use the `pipeline + let` form of `$lookup` to compute, per product, the average rating from a `reviews` collection.
3. Build a `$facet` that returns `data`, `total`, and `byCategory` for a paginated product search.
4. Materialize a `dailySales` collection using `$merge` with `whenMatched: "replace"`.
5. >>> QUIZ (Stage 8) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: `$lookup` is equivalent to which SQL JOIN type?
8. A) INNER JOIN
9. B) RIGHT OUTER JOIN
10. C) FULL OUTER JOIN
11. D) LEFT OUTER JOIN (*)
12. Explanation: `$lookup` is a LEFT OUTER JOIN — every input document appears in the output; unmatched inputs get an empty array in the `as` field.
13. Q2: Which `foreignField` requirement makes `$lookup` fast?
14. A) It must be indexed on the foreign collection (*)
15. B) It must be a string
16. C) It must be unique
17. D) It must be the _id
18. Explanation: `$lookup` does an index probe per input document; an unindexed foreignField forces a COLLSCAN per input doc, killing performance on large collections.
19. Q3: What does `$unwind` do by default for documents whose array is missing or empty?
20. A) Keeps them with a null field
21. B) Drops them from the output (*)
22. C) Errors out
23. D) Keeps them with an empty array
24. Explanation: By default `$unwind` removes documents whose array field is missing or empty; pass `preserveNullAndEmptyArrays: true` to keep them.
25. Q4: Why use `$facet`?
26. A) To shard the pipeline across nodes
27. B) To join collections
28. C) To run multiple sub-pipelines on the same input in one round trip (*)
29. D) To unwind arrays
30. Explanation: `$facet` runs multiple named sub-pipelines on the same input, returning all results in one document — ideal for "data + total + facets" search responses.
31. Q5: What's the difference between `$out` and `$merge`?
32. A) They're identical
33. B) `$out` is faster
34. C) `$merge` requires a transaction
35. D) `$out` replaces the target collection; `$merge` upserts per document (*)
36. Explanation: `$out` drops and replaces the whole target collection; `$merge` (4.2+) writes per document with configurable `whenMatched`/`whenNotMatched` semantics, enabling incremental upserts.
37. Q6: Which `$lookup` form supports non-equality matching conditions?
38. A) The pipeline + let form (*)
39. B) The basic form (from/localField/foreignField/as)
40. C) $lookup with $unwind
41. D) $facet
42. Explanation: The basic form is equality-only on a single field; the `pipeline + let` form lets you write an arbitrary sub-pipeline with `$expr`-based matching.
43. Q7: What's a performance pitfall of `$unwind` before `$match`?
44. A) It loses data
45. B) It multiplies the pipeline size — one doc per array element — before filtering (*)
46. C) It can't use indexes
47. D) It errors on big arrays
48. Explanation: `$unwind` produces one output document per array element; doing it before `$match` explodes the pipeline size. Filter first to limit how many docs get unwound.
49. Q8: What does `$merge`'s `whenMatched: "replace"` do?
50. A) Skips the existing doc
51. B) Merges fields
52. C) Replaces the existing document with the pipeline output (*)
53. D) Fails the operation
54. Explanation: `whenMatched: "replace"` overwrites the existing target document with the new one; other options include `merge`, `keepExisting`, `fail`, or a custom pipeline.
55. Q9: Which sub-pipeline stage returns `[{ count: N }]`?
56. A) $sum
57. B) $total
58. C) $size
59. D) $count (*)
60. Explanation: `{ $count: "count" }` produces a single document `{ count: N }` (or none if empty input); often unwrapped to a plain number in app code.
61. Q10: Why is `$facet` sub-pipelines NOT a way to parallelize work across nodes?
62. A) They run independently but can't share state, and results return as ONE document (each facet is an array) (*)
63. B) They actually do parallelize across shards
64. C) They require a transaction
65. D) They can only run on a single node
66. Explanation: `$facet` runs each sub-pipeline on the same input and returns them as fields of a single result document; they're parallelism-friendly but not a sharding tool.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`$lookup` is equivalent to which SQL JOIN type?"
  options:
    - INNER JOIN
    - RIGHT OUTER JOIN
    - FULL OUTER JOIN
    - LEFT OUTER JOIN
  correctIndex: 3
  explanation: "`$lookup` is a LEFT OUTER JOIN — every input document appears in the output; unmatched inputs get an empty array in the `as` field."
- id: q2
  question: Which `foreignField` requirement makes `$lookup` fast?
  options:
    - It must be indexed on the foreign collection
    - It must be a string
    - It must be unique
    - It must be the _id
  correctIndex: 0
  explanation: "`$lookup` does an index probe per input document; an unindexed foreignField forces a COLLSCAN per input doc, killing performance on large collections."
- id: q3
  question: What does `$unwind` do by default for documents whose array is missing or empty?
  options:
    - Keeps them with a null field
    - Drops them from the output
    - Errors out
    - Keeps them with an empty array
  correctIndex: 1
  explanation: "By default `$unwind` removes documents whose array field is missing or empty; pass `preserveNullAndEmptyArrays: true` to keep them."
- id: q4
  question: Why use `$facet`?
  options:
    - To shard the pipeline across nodes
    - To join collections
    - To run multiple sub-pipelines on the same input in one round trip
    - To unwind arrays
  correctIndex: 2
  explanation: '`$facet` runs multiple named sub-pipelines on the same input, returning all results in one document — ideal for "data + total + facets" search responses.'
- id: q5
  question: What's the difference between `$out` and `$merge`?
  options:
    - They're identical
    - "`$out` is faster"
    - "`$merge` requires a transaction"
    - "`$out` replaces the target collection; `$merge` upserts per document"
  correctIndex: 3
  explanation: "`$out` drops and replaces the whole target collection; `$merge` (4.2+) writes per document with configurable `whenMatched`/`whenNotMatched` semantics, enabling incremental upserts."
- id: q6
  question: Which `$lookup` form supports non-equality matching conditions?
  options:
    - The pipeline + let form
    - The basic form (from/localField/foreignField/as)
    - $lookup with $unwind
    - $facet
  correctIndex: 0
  explanation: The basic form is equality-only on a single field; the `pipeline + let` form lets you write an arbitrary sub-pipeline with `$expr`-based matching.
- id: q7
  question: What's a performance pitfall of `$unwind` before `$match`?
  options:
    - It loses data
    - It multiplies the pipeline size — one doc per array element — before filtering
    - It can't use indexes
    - It errors on big arrays
  correctIndex: 1
  explanation: "`$unwind` produces one output document per array element; doing it before `$match` explodes the pipeline size. Filter first to limit how many docs get unwound."
- id: q8
  question: "What does `$merge`'s `whenMatched: \"replace\"` do?"
  options:
    - Skips the existing doc
    - Merges fields
    - Replaces the existing document with the pipeline output
    - Fails the operation
  correctIndex: 2
  explanation: '`whenMatched: "replace"` overwrites the existing target document with the new one; other options include `merge`, `keepExisting`, `fail`, or a custom pipeline.'
- id: q9
  question: "Which sub-pipeline stage returns `[{ count: N }]`?"
  options:
    - $sum
    - $total
    - $size
    - $count
  correctIndex: 3
  explanation: '`{ $count: "count" }` produces a single document `{ count: N }` (or none if empty input); often unwrapped to a plain number in app code.'
- id: q10
  question: Why is `$facet` sub-pipelines NOT a way to parallelize work across nodes?
  options:
    - They run independently but can't share state, and results return as ONE document (each facet is an array)
    - They actually do parallelize across shards
    - They require a transaction
    - They can only run on a single node
  correctIndex: 0
  explanation: "`$facet` runs each sub-pipeline on the same input and returns them as fields of a single result document; they're parallelism-friendly but not a sharding tool."
```

