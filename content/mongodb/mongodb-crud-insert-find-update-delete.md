---
slug: mongodb-crud-insert-find-update-delete
id: mongodb-03
track: mongodb
order: 3
title: CRUD — Insert, Find, Update, Delete
description: Master the four CRUD primitives with `insertOne/Many`, `find`, `updateOne/Many`, `replaceOne`, `deleteOne/Many`, plus `upsert`, `findOneAndUpdate`, and write concern basics.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=60s
whyItMatters: Master the four CRUD primitives with `insertOne/Many`, `find`, `updateOne/Many`, `replaceOne`, `deleteOne/Many`, plus `upsert`, `findOneAndUpdate`, and write concern basics.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# CRUD — Insert, Find, Update, Delete

## CRUD — Insert, Find, Update, Delete

### Why It Matters

Master the four CRUD primitives with `insertOne/Many`, `find`, `updateOne/Many`, `replaceOne`, `deleteOne/Many`, plus `upsert`, `findOneAndUpdate`, and write concern basics.

Master the four CRUD primitives with `insertOne/Many`, `find`, `updateOne/Many`, `replaceOne`, `deleteOne/Many`, plus `upsert`, `findOneAndUpdate`, and write concern basics.

### Prerequisites

- Stage 1 (Getting Started) and Stage 2 (Documents, Collections, BSON).
- Comfort with JSON-shaped queries and mongosh.

### Topics

- `insertOne` / `insertMany` (ordered vs unordered, write errors)
- `find` cursor basics: `.limit()`, `.skip()`, `.sort()`, `.countDocuments()`
- `updateOne` / `updateMany` / `replaceOne` and the `$set`, `$unset`, `$inc`, `$push`, `$pull` operators
- `upsert: true` and `upsert` matching idiom
- `findOneAndUpdate` / `findOneAndReplace` / `findOneAndDelete` with `returnDocument: "after"`
- `deleteOne` / `deleteMany` and the danger of `{}`
- Write concern: `{ w: 1, j: false }` vs `{ w: "majority", j: true }`
- Atomicity at the document level (no multi-document transactions yet — that's Stage 11)

### Key Concepts

- All writes are atomic at the single-document level: a single `updateOne` updating 10 fields either fully applies or doesn't — no partial state visible to readers.
- `updateOne`/`updateMany` use update operators (`$set`, `$inc`, `$push`, etc.); `replaceOne` swaps the entire document (except `_id`).
- `findOneAndUpdate` is the atomic "read-modify-write" primitive — perfect for counters, sequencers, and queue-style claim patterns.
- `insertMany` defaults to `ordered: true` (stops at first error); use `ordered: false` to continue inserting and collect all errors.
- `db.collection.bulkWrite()` combines insert/update/delete ops in one round-trip; ideal for ETL batches.

```javascript
// ordered: true (default) stops at the first duplicate-key error
db.products.insertMany([
  { _id: "p1", name: "A" },
  { _id: "p1", name: "duplicate" },   // E11000 — stops here
  { _id: "p2", name: "B" }            // never attempted
], { ordered: true })

// ordered: false attempts all and reports errors at the end
db.products.insertMany([
  { _id: "p3", name: "C" },
  { _id: "p3", name: "dup" },         // fails but continues
  { _id: "p4", name: "D" }            // still attempted
], { ordered: false })
```
Caption: Insert ordered vs unordered

### Common Pitfalls

- Running `db.users.deleteMany({})` thinking the empty filter means "no matches" — it means "match everything"; always double-check the filter before delete/updateMany.
- Calling `updateOne({ name: "Ada" }, { name: "Ada", age: 30 })` without `$set` — MongoDB 4.2+ rejects this as "unknown operator" because the second arg must use update operators or be a pipeline; use `$set: { name: "Ada", age: 30 }` or `replaceOne`.
- Letting `$push` grow an array forever — every push rewrites the entire document (and moves it on disk); use `$slice` to cap, or move to a separate collection (Bucket pattern, Stage 10).
- Forgetting `upsert: true` on a `findOneAndUpdate` sequencer — if the doc doesn't exist, the function returns null and your downstream code crashes; always set `upsert: true` for counters.
- Using `w: 1` (acknowledged by primary only) for critical writes — a primary failover immediately after can lose the write; use `w: "majority", j: true` for durable writes.

### Real-World Applications

- Stripe uses `findOneAndUpdate` for atomic ledger updates and idempotency-key dedup tables.
- Coinbase uses `bulkWrite` to apply matched-order batches to user wallets in a single round-trip.
- Cisco's IoT platform uses `updateOne` with `$inc` on per-device counters to ingest millions of telemetry events per second.
- eBay uses `upsert` patterns to materialize product catalog entries from external feeds without separate "exists?" lookups.

### Interview Questions

- 1. Is `updateOne` atomic? — Yes, at the single-document level; multiple fields updated in one `updateOne` apply atomically, but multi-document atomicity needs transactions (Stage 11).
- 2. What's the difference between `updateOne` and `replaceOne`? — `updateOne` uses operators (`$set`, `$inc`) on fields; `replaceOne` swaps the entire document (except `_id`).
- 3. What does `ordered: false` do in `insertMany`? — Continues inserting remaining documents after an error and returns all errors at the end, instead of stopping at the first failure.
- 4. How does `findOneAndUpdate` differ from `updateOne`? — It returns the document (before or after, controlled by `returnDocument`) in the same atomic call, enabling read-modify-write without a race.
- 5. What's the safest write concern for money-critical writes? — `{ w: "majority", j: true }` ensures the write is journaled and replicated to a majority before ack, surviving primary failover.

### Mini Project

Build a URL Shortener Click Counter: A Node service that takes a short code, looks up the long URL, and atomically increments a `clicks` counter; expose `/api/shorten` (insert) and `/:code` (redirect + count). Suggested approach:
  - Store `{ _id: <shortcode>, longUrl, clicks, createdAt }` in a `urls` collection
  - Use `findOneAndUpdate` with `$inc: { clicks: 1 }` and `returnDocument: "after"` for the redirect handler
  - Generate short codes with `nanoid` or a `counters`-backed sequencer via `findOneAndUpdate({ _id: "url_seq" }, { $inc: { seq: 1 } }, { upsert: true })`
  - Add a `GET /top` endpoint using `find().sort({ clicks: -1 }).limit(10)`
  - Use `w: "majority"` write concern on insert so a failover can't lose a brand-new short URL

### Exercises

1. Insert 10 documents with `insertMany`, then write `updateMany` that adds a `lastSeen` field set to `new Date()` for all of them.
2. Build a counter `page_views` with `findOneAndUpdate` and `upsert: true`; call it 5 times and verify the value is 5.
3. Create a `bulkWrite` with one insert, one upsert-update, and one delete; verify the result's `insertedCount`, `modifiedCount`, `deletedCount`.
4. (Carefully) write `deleteMany` with a filter that deletes documents older than 30 days; verify with `countDocuments` before and after.
5. >>> QUIZ (Stage 3) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: At what level is a single `updateOne` atomic?
8. A) Field level
9. B) Collection level
10. C) Document level (*)
11. D) Database level
12. Explanation: MongoDB guarantees atomicity per document; multi-document atomicity requires explicit transactions (Stage 11).
13. Q2: What's the difference between `updateOne` and `replaceOne`?
14. A) None, they're synonyms
15. B) `updateOne` is faster
16. C) `replaceOne` requires a transaction
17. D) `updateOne` uses operators like $set; `replaceOne` swaps the whole document (except _id) (*)
18. Explanation: `updateOne` accepts `$set`/`$inc`/`$push` update operators on specific fields; `replaceOne` replaces the entire document body, keeping only `_id`.
19. Q3: What does `ordered: false` do in `insertMany`?
20. A) Continues inserting after errors and collects all errors at the end (*)
21. B) Reverses insertion order
22. C) Disables index updates
23. D) Sorts documents by _id first
24. Explanation: By default `insertMany` stops at the first error; `ordered: false` continues and returns all errors, which is faster for bulk loads where some duplicates are expected.
25. Q4: Which call atomically returns the updated document?
26. A) updateOne
27. B) findOneAndUpdate with returnDocument: "after" (*)
28. C) updateMany
29. D) replaceOne
30. Explanation: `findOneAndUpdate` performs the update and returns the doc (before or after, per `returnDocument`) in one atomic call, eliminating the read-modify-write race.
31. Q5: What does `db.users.deleteMany({})` do?
32. A) No-op (empty filter means no matches)
33. B) Throws an error
34. C) Deletes ALL documents in the collection (*)
35. D) Drops the collection
36. Explanation: An empty filter `{}` matches every document; always double-check filters before `deleteMany`/`updateMany` to avoid catastrophic data loss.
37. Q6: What's the safest write concern for money-critical writes?
38. A) { w: 0 }
39. B) { w: 1 }
40. C) { w: 0, j: false }
41. D) { w: "majority", j: true } (*)
42. Explanation: `w: "majority", j: true` waits for the write to be journaled AND replicated to a majority of replica set members, surviving primary failover without losing the write.
43. Q7: Which operator atomically increments a numeric field?
44. A) $inc (*)
45. B) $add
46. C) $set
47. D) $incr
48. Explanation: `$inc: { count: 1 }` atomically adds 1 to `count`, creating it at 1 if absent; works on int/long/double/decimal fields.
49. Q8: Which operator adds an item to an array?
50. A) $add
51. B) $push (*)
52. C) $append
53. D) $addToSet
54. Explanation: `$push` appends to an array (with duplicates); `$addToSet` appends only if not already present.
55. Q9: What does `upsert: true` do in `updateOne`?
56. A) Reverses the update
57. B) Updates multiple documents
58. C) Creates a new document if no document matches the filter (*)
59. D) Skips the update if the doc exists
60. Explanation: With `upsert: true`, if no document matches the filter, MongoDB inserts a new document combining the filter fields and update operators — perfect for materialization.
61. Q10: Which is the most efficient way to do many mixed insert/update/delete ops in one round-trip?
62. A) Multiple updateOne calls in a loop
63. B) A transaction with savepoints
64. C) mapReduce
65. D) bulkWrite with insertOne/updateOne/deleteMany ops (*)
66. Explanation: `bulkWrite` batches all operations into a single network round-trip and lets the server apply them in one go, dramatically reducing latency for ETL-style batches.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: At what level is a single `updateOne` atomic?
  options:
    - Field level
    - Collection level
    - Document level
    - Database level
  correctIndex: 2
  explanation: MongoDB guarantees atomicity per document; multi-document atomicity requires explicit transactions (Stage 11).
- id: q2
  question: What's the difference between `updateOne` and `replaceOne`?
  options:
    - None, they're synonyms
    - "`updateOne` is faster"
    - "`replaceOne` requires a transaction"
    - "`updateOne` uses operators like $set; `replaceOne` swaps the whole document (except _id)"
  correctIndex: 3
  explanation: "`updateOne` accepts `$set`/`$inc`/`$push` update operators on specific fields; `replaceOne` replaces the entire document body, keeping only `_id`."
- id: q3
  question: "What does `ordered: false` do in `insertMany`?"
  options:
    - Continues inserting after errors and collects all errors at the end
    - Reverses insertion order
    - Disables index updates
    - Sorts documents by _id first
  correctIndex: 0
  explanation: "By default `insertMany` stops at the first error; `ordered: false` continues and returns all errors, which is faster for bulk loads where some duplicates are expected."
- id: q4
  question: Which call atomically returns the updated document?
  options:
    - updateOne
    - 'findOneAndUpdate with returnDocument: "after"'
    - updateMany
    - replaceOne
  correctIndex: 1
  explanation: "`findOneAndUpdate` performs the update and returns the doc (before or after, per `returnDocument`) in one atomic call, eliminating the read-modify-write race."
- id: q5
  question: What does `db.users.deleteMany({})` do?
  options:
    - No-op (empty filter means no matches)
    - Throws an error
    - Deletes ALL documents in the collection
    - Drops the collection
  correctIndex: 2
  explanation: An empty filter `{}` matches every document; always double-check filters before `deleteMany`/`updateMany` to avoid catastrophic data loss.
- id: q6
  question: What's the safest write concern for money-critical writes?
  options:
    - "{ w: 0 }"
    - "{ w: 1 }"
    - "{ w: 0, j: false }"
    - '{ w: "majority", j: true }'
  correctIndex: 3
  explanation: '`w: "majority", j: true` waits for the write to be journaled AND replicated to a majority of replica set members, surviving primary failover without losing the write.'
- id: q7
  question: Which operator atomically increments a numeric field?
  options:
    - $inc
    - $add
    - $set
    - $incr
  correctIndex: 0
  explanation: "`$inc: { count: 1 }` atomically adds 1 to `count`, creating it at 1 if absent; works on int/long/double/decimal fields."
- id: q8
  question: Which operator adds an item to an array?
  options:
    - $add
    - $push
    - $append
    - $addToSet
  correctIndex: 1
  explanation: "`$push` appends to an array (with duplicates); `$addToSet` appends only if not already present."
- id: q9
  question: "What does `upsert: true` do in `updateOne`?"
  options:
    - Reverses the update
    - Updates multiple documents
    - Creates a new document if no document matches the filter
    - Skips the update if the doc exists
  correctIndex: 2
  explanation: "With `upsert: true`, if no document matches the filter, MongoDB inserts a new document combining the filter fields and update operators — perfect for materialization."
- id: q10
  question: Which is the most efficient way to do many mixed insert/update/delete ops in one round-trip?
  options:
    - Multiple updateOne calls in a loop
    - A transaction with savepoints
    - mapReduce
    - bulkWrite with insertOne/updateOne/deleteMany ops
  correctIndex: 3
  explanation: "`bulkWrite` batches all operations into a single network round-trip and lets the server apply them in one go, dramatically reducing latency for ETL-style batches."
```

