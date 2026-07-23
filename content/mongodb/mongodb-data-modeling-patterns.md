---
slug: mongodb-data-modeling-patterns
id: mongodb-10
track: mongodb
order: 10
title: Data Modeling Patterns
description: Apply named MongoDB patterns (Attribute, Polymorphic, Bucket, Computed, Extended Reference, Outlier, Approximation) to common modeling problems.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=270s
whyItMatters: Apply named MongoDB patterns (Attribute, Polymorphic, Bucket, Computed, Extended Reference, Outlier, Approximation) to common modeling problems.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Data Modeling Patterns

## Data Modeling Patterns

### Why It Matters

Apply named MongoDB patterns (Attribute, Polymorphic, Bucket, Computed, Extended Reference, Outlier, Approximation) to common modeling problems.

Apply named MongoDB patterns (Attribute, Polymorphic, Bucket, Computed, Extended Reference, Outlier, Approximation) to common modeling problems.

### Prerequisites

- Stage 9 (Embedding vs Referencing) and Stage 7 (Aggregation basics).
- Exposure to at least one production schema you've had to change.

### Topics

- Attribute pattern: `[{ k: "color", v: "red" }, ...]` for sparse attributes
- Polymorphic pattern: discriminator field (`type`) in one collection
- Bucket pattern: bounded arrays for time-series-ish data
- Computed pattern: pre-computed running totals/counts
- Extended Reference pattern: denormalize hot foreign fields into the parent
- Outlier pattern: handle a few "celebrity" docs differently from the rest
- Approximation pattern: hyperloglog-style counters for huge cardinalities
- Tree patterns: parent reference, child array, materialized path, nested set

### Key Concepts

- Patterns are reusable solutions to recurring schema-design trade-offs (read-speed vs write-speed vs storage vs atomicity).
- The Attribute pattern replaces N sparse top-level fields with one `attributes: [{ k, v }]` array plus a multikey index — great for product specs.
- The Polymorphic pattern stores multiple "types" of doc in one collection with a `type` field — good when they're queried together but have different shapes.
- The Computed pattern pre-aggregates rollups (e.g., `totalViews`) to avoid expensive on-the-fly aggregations.
- The Outlier pattern: most docs follow schema A, but a few "celebrity" docs (e.g., a viral post) get a separate overflow collection to avoid unbounded arrays.

```javascript
// Instead of { color, size, weight, voltage, ... } with hundreds of sparse fields:
db.products.insertOne({
  _id: "p1",
  name: "Universal Widget",
  attributes: [
    { k: "color",    v: "red" },
    { k: "voltage",  v: 220 },
    { k: "weight_kg",v: NumberDecimal("0.4") }
  ]
})
db.products.createIndex({ "attributes.k": 1, "attributes.v": 1 })
db.products.find({ attributes: { $all: [
  { $elemMatch: { k: "color",  v: "red" } },
  { $elemMatch: { k: "voltage",v: 220 } }
] } })
```
Caption: Attribute pattern

### Common Pitfalls

- Applying the Attribute pattern blindly to a few well-known fields — if you only ever query `color` and `size`, keep them as top-level fields (simpler, faster); reserve the Attribute pattern for hundreds of sparse, optional attributes.
- Polymorphic collections with wildly different query patterns — if `email` and `sms` notifications never share a query, split into separate collections to keep indexes tight.
- Computed pattern with stale counters — every increment must be atomic (`$inc`); if you cache counts in app memory and sync periodically, you'll lose increments on crash.
- Extended Reference with no plan to refresh denormalized fields — when the source changes, old snapshots become wrong; decide if you need historical fidelity (keep snapshot) or current truth (refresh job).
- Materialized Path with wrong delimiter — `"1.2.3"` collides with category IDs like `"12"`; use a delimiter that can't appear in IDs (e.g., `"/1/2/3/"`) to make `$regex` prefix queries safe.

### Real-World Applications

- eBay uses the Attribute pattern for product specs across thousands of categories that each have unique attributes.
- Stripe uses the Polymorphic pattern for `events` (one collection, many event types with different payloads).
- Adobe uses the Computed pattern for asset view counts to render dashboards in milliseconds.
- Uber uses the Outlier pattern for surge events: normal cities embed events; outlier cities spill to overflow collections.

### Interview Questions

- 1. When is the Attribute pattern useful? — When you have hundreds of sparse, optional attributes (e.g., product specs) that would otherwise be empty top-level fields.
- 2. How does the Polymorphic pattern work? — One collection stores multiple "types" of doc, distinguished by a `type` field, each with its own shape — good when types are queried together.
- 3. What problem does the Computed pattern solve? — Avoids expensive on-the-fly aggregations by pre-computing rollups (counts, totals) atomically with `$inc`.
- 4. What's the Extended Reference pattern? — Denormalize a few hot fields from a referenced document into the parent (e.g., customer name on an order) to avoid a `$lookup` on every read.
- 5. When do you need the Outlier pattern? — When 99% of docs fit schema A but a few "celebrity" docs blow past limits (e.g., viral post with 100k comments) — move outliers to an overflow collection.

### Mini Project

Model a Product Catalog with the Attribute Pattern: A catalog with products in many categories, each with its own attribute set (size, color, voltage, material, ...). Suggested approach:
  - Store attributes as `[{ k, v }]` with a multikey index on `{ "attributes.k": 1, "attributes.v": 1 }`
  - Implement a filter API `GET /products?attr.color=red&attr.voltage=220` that compiles each `attr.*` into an `$elemMatch` clause combined with `$all`
  - Add the Computed pattern: pre-compute `reviewCount` and `avgRating` on each product
  - Add the Polymorphic pattern: store physical and digital products in the same collection with a `type` field
  - Add a separate `productsOverflow` collection for any product whose `attributes` array exceeds 500 entries (Outlier pattern)

### Exercises

1. Convert a product with sparse fields (`color`, `voltage`, `weight`) to the Attribute pattern and write a multi-attribute `$elemMatch` + `$all` query.
2. Build a polymorphic `notifications` collection with `email`, `sms`, and `push` types; query by `type`.
3. Implement a computed `viewCount` on posts using atomic `$inc`; display a top-20 by views without aggregating.
4. Add the Extended Reference pattern to an `orders` collection by denormalizing `customer.name`; discuss whether to refresh on customer name change.
5. >>> QUIZ (Stage 10) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does the Attribute pattern replace?
8. A) Indexes
9. B) Hundreds of sparse top-level fields with one `[{ k, v }]` array (*)
10. C) The _id field
11. D) Aggregation pipelines
12. Explanation: Instead of having `color`, `voltage`, `weight`, ... as mostly-empty top-level fields, the Attribute pattern stores them as `{ k, v }` pairs in one array indexed multikey.
13. Q2: Which pattern stores multiple "types" of document in one collection?
14. A) Attribute pattern
15. B) Bucket pattern
16. C) Polymorphic pattern (*)
17. D) Outlier pattern
18. Explanation: The Polymorphic pattern uses a discriminator `type` field to store differently-shaped documents in one collection — useful when they're queried together.
19. Q3: What does the Computed pattern do?
20. A) Computes aggregations on-the-fly
21. B) Computes indexes lazily
22. C) Computes shard keys
23. D) Pre-computes rollups (counts, totals) atomically with $inc (*)
24. Explanation: The Computed pattern stores pre-aggregated values (e.g., `viewCount`) updated atomically via `$inc` so reads don't need to run expensive aggregations.
25. Q4: The Extended Reference pattern denormalizes what?
26. A) A few hot fields from a referenced document into the parent (*)
27. B) The _id
28. C) The whole foreign document
29. D) The shard key
30. Explanation: Extended Reference copies a few frequently-read fields (e.g., customer name) from the referenced doc into the parent to avoid a `$lookup` on every read.
31. Q5: When do you need the Outlier pattern?
32. A) For every document
33. B) When a few "celebrity" docs blow past limits while 99% fit schema A (*)
34. C) For sharded collections
35. D) For transactions
36. Explanation: The Outlier pattern moves a few extreme docs (e.g., a viral post with 100k comments) to an overflow collection so normal docs stay simple and bounded.
37. Q6: Why use `$inc` for Computed-pattern counters?
38. A) It's faster than $set
39. B) It can't be canceled
40. C) It's atomic per document and survives concurrent updates without lost increments (*)
41. D) It uses no journal
42. Explanation: `$inc` is atomic at the document level, so concurrent increments don't overwrite each other (no lost updates); caching counts in app memory and syncing periodically risks losing increments on crash.
43. Q7: Which pattern best fits time-series telemetry per device?
44. A) Attribute pattern
45. B) Polymorphic pattern
46. C) Outlier pattern
47. D) Bucket pattern (*)
48. Explanation: The Bucket pattern groups time-series events into bounded parent docs (e.g., hourly per device), keeping each doc small while preserving locality for time-range queries.
49. Q8: What's a pitfall of the Polymorphic pattern?
50. A) Mixing types with wildly different query patterns bloats indexes and slows queries — split if types never share queries (*)
51. B) It requires sharding
52. C) It can't be indexed
53. D) It only works for 2 types
54. Explanation: If polymorphic types never share a query, putting them in one collection forces indexes that serve no cross-type queries — split into per-type collections to keep indexes tight.
55. Q9: Which tree pattern uses a path string like `/1/2/3/` for subtree queries?
56. A) Parent reference
57. B) Materialized path (*)
58. C) Nested set
59. D) Child array
60. Explanation: The Materialized Path pattern stores the full path as a string (e.g., `/1/2/3/`); subtree queries become a `$regex` /^\/1\/2\// prefix match.
61. Q10: What's a problem with the Extended Reference pattern?
62. A) It can't be indexed
63. B) It requires transactions
64. C) Denormalized fields go stale when the source changes; need a refresh strategy (*)
65. D) It only works on sharded collections
66. Explanation: Denormalized snapshots can diverge from the source; decide whether to keep historical fidelity (snapshot stays) or current truth (background refresh job updates snapshots).
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the Attribute pattern replace?
  options:
    - Indexes
    - Hundreds of sparse top-level fields with one `[{ k, v }]` array
    - The _id field
    - Aggregation pipelines
  correctIndex: 1
  explanation: Instead of having `color`, `voltage`, `weight`, ... as mostly-empty top-level fields, the Attribute pattern stores them as `{ k, v }` pairs in one array indexed multikey.
- id: q2
  question: Which pattern stores multiple "types" of document in one collection?
  options:
    - Attribute pattern
    - Bucket pattern
    - Polymorphic pattern
    - Outlier pattern
  correctIndex: 2
  explanation: The Polymorphic pattern uses a discriminator `type` field to store differently-shaped documents in one collection — useful when they're queried together.
- id: q3
  question: What does the Computed pattern do?
  options:
    - Computes aggregations on-the-fly
    - Computes indexes lazily
    - Computes shard keys
    - Pre-computes rollups (counts, totals) atomically with $inc
  correctIndex: 3
  explanation: The Computed pattern stores pre-aggregated values (e.g., `viewCount`) updated atomically via `$inc` so reads don't need to run expensive aggregations.
- id: q4
  question: The Extended Reference pattern denormalizes what?
  options:
    - A few hot fields from a referenced document into the parent
    - The _id
    - The whole foreign document
    - The shard key
  correctIndex: 0
  explanation: Extended Reference copies a few frequently-read fields (e.g., customer name) from the referenced doc into the parent to avoid a `$lookup` on every read.
- id: q5
  question: When do you need the Outlier pattern?
  options:
    - For every document
    - When a few "celebrity" docs blow past limits while 99% fit schema A
    - For sharded collections
    - For transactions
  correctIndex: 1
  explanation: The Outlier pattern moves a few extreme docs (e.g., a viral post with 100k comments) to an overflow collection so normal docs stay simple and bounded.
- id: q6
  question: Why use `$inc` for Computed-pattern counters?
  options:
    - It's faster than $set
    - It can't be canceled
    - It's atomic per document and survives concurrent updates without lost increments
    - It uses no journal
  correctIndex: 2
  explanation: "`$inc` is atomic at the document level, so concurrent increments don't overwrite each other (no lost updates); caching counts in app memory and syncing periodically risks losing increments on crash."
- id: q7
  question: Which pattern best fits time-series telemetry per device?
  options:
    - Attribute pattern
    - Polymorphic pattern
    - Outlier pattern
    - Bucket pattern
  correctIndex: 3
  explanation: The Bucket pattern groups time-series events into bounded parent docs (e.g., hourly per device), keeping each doc small while preserving locality for time-range queries.
- id: q8
  question: What's a pitfall of the Polymorphic pattern?
  options:
    - Mixing types with wildly different query patterns bloats indexes and slows queries — split if types never share queries
    - It requires sharding
    - It can't be indexed
    - It only works for 2 types
  correctIndex: 0
  explanation: If polymorphic types never share a query, putting them in one collection forces indexes that serve no cross-type queries — split into per-type collections to keep indexes tight.
- id: q9
  question: Which tree pattern uses a path string like `/1/2/3/` for subtree queries?
  options:
    - Parent reference
    - Materialized path
    - Nested set
    - Child array
  correctIndex: 1
  explanation: The Materialized Path pattern stores the full path as a string (e.g., `/1/2/3/`); subtree queries become a `$regex` /^\/1\/2\// prefix match.
- id: q10
  question: What's a problem with the Extended Reference pattern?
  options:
    - It can't be indexed
    - It requires transactions
    - Denormalized fields go stale when the source changes; need a refresh strategy
    - It only works on sharded collections
  correctIndex: 2
  explanation: Denormalized snapshots can diverge from the source; decide whether to keep historical fidelity (snapshot stays) or current truth (background refresh job updates snapshots).
```

