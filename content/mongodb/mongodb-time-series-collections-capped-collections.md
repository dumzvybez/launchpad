---
slug: mongodb-time-series-collections-capped-collections
id: mongodb-19
track: mongodb
order: 19
title: Time Series Collections and Capped Collections
description: Use native time series collections for efficient storage and queries of timestamped measurements, and capped collections with tailable cursors for log-style queues.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=1440s
whyItMatters: Use native time series collections for efficient storage and queries of timestamped measurements, and capped collections with tailable cursors for log-style queues.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Time Series Collections and Capped Collections

## Time Series Collections and Capped Collections

### Why It Matters

Use native time series collections for efficient storage and queries of timestamped measurements, and capped collections with tailable cursors for log-style queues.

Use native time series collections for efficient storage and queries of timestamped measurements, and capped collections with tailable cursors for log-style queues.

### Prerequisites

- Stage 6 (Indexes) and Stage 7 (Aggregation).
- Familiarity with metrics / IoT telemetry workloads.

### Topics

- Time series collections: `timeField`, `metaField`, `granularity` (`seconds`/`minutes`/`hours`)
- How time series stores data (columnar-like compression under the hood)
- Indexes on time series: time + meta
- `$dateTrunc` and time-bucket aggregations
- Capped collections: fixed size, insertion-order preservation, no updates/deletes
- Tailable cursors (`tailable` + `awaitData`) — queue-like behavior
- Change streams vs tailable cursors
- When NOT to use a time series collection

### Key Concepts

- Time series collections (5.0+) optimize storage and queries for `{ timestamp, metadata, measurement }`-shaped data — they compress well and time-range queries are fast.
- The `timeField` is required and indexed; `metaField` (e.g., `deviceId`) holds data that doesn't change per series; `granularity` tunes storage bucketing.
- Capped collections are fixed-size, insertion-ordered collections that auto-overwrite oldest documents — perfect for log buffers and tiny queue patterns.
- Tailable cursors on capped collections behave like `tail -f` — they keep returning new inserts as they arrive.
- For event streaming with durability and resume tokens, prefer change streams (Stage 15); use capped collections only for short-lived, loss-tolerant buffers.

```javascript
db.createCollection("temperatures", {
  timeseries: {
    timeField: "ts",
    metaField: "deviceId",
    granularity: "seconds"        // "seconds" | "minutes" | "hours"
  },
  expireAfterSeconds: 60 * 60 * 24 * 90    // 90-day TTL
})

db.temperatures.insertMany([
  { ts: new Date(), deviceId: "d1", temp: 22.5, humidity: 45 },
  { ts: new Date(), deviceId: "d2", temp: 18.0, humidity: 52 }
])

// Time-range + meta query is fast
db.temperatures.find({
  deviceId: "d1",
  ts: { $gte: ISODate("2024-01-01"), $lt: ISODate("2024-01-02") }
}).sort({ ts: 1 })
```
Caption: Create a time series collection

### Common Pitfalls

- Setting `granularity: "seconds"` when measurements are hourly — wastes storage buckets; pick the granularity that matches your inter-arrival time.
- Using a regular collection for high-cardinality telemetry instead of a time series collection — you miss out on the columnar compression and time-ordered storage, paying 5-10x in disk.
- Trying to `updateOne` or `deleteOne` on a capped collection — capped collections disallow deletes and require same-size updates; use a regular collection if you need mutation.
- Using a tailable cursor on a non-capped collection — they only work on capped collections; for regular collections use change streams.
- Forgetting that capped collections silently drop OLD documents when full — your "queue" loses head-of-line data if the consumer is too slow; size accordingly or use a real queue.

### Real-World Applications

- Cisco uses time series collections for IoT device telemetry (temperature, pressure, vibration per second).
- Uber uses time series collections for per-trip location pings and ETA recalculation inputs.
- Stripe uses time series collections for per-minute charge-rate metrics dashboards.
- Adobe uses capped collections with tailable cursors for in-process event buffers feeding real-time analytics.

### Interview Questions

- 1. What's a time series collection optimized for? — Append-only timestamped measurements; columnar-like compression and fast time-range queries.
- 2. What do `timeField`, `metaField`, and `granularity` do? — `timeField` is the required timestamp; `metaField` is per-series metadata (e.g., `deviceId`); `granularity` tunes storage bucketing.
- 3. What's a capped collection? — Fixed-size, insertion-ordered, auto-overwriting collection that disallows deletes — useful for log buffers and tiny queues.
- 4. Why use a tailable cursor on a capped collection? — To `tail -f` new inserts as they arrive — queue-like behavior without a separate broker.
- 5. When should you NOT use a time series collection? — When you need frequent updates/deletes to existing measurements, or when data isn't timestamped/append-only.

### Mini Project

Build a Device Telemetry Ingestor + Hourly Rollups: Insert 1000 simulated temperature readings per device into a `temperatures` time series collection, then run a daily cron that aggregates hourly averages and writes them to a `dailyRollups` collection. Suggested approach:
  - Create the `temperatures` time series collection with `timeField: "ts", metaField: "deviceId", granularity: "seconds"`
  - Use a Node script + `setInterval` to insert readings every 10s for 5 devices
  - Create a compound index on `{ deviceId: 1, ts: 1 }` (auto-created, but be explicit)
  - Daily cron: `$group` by `$dateTrunc` hour + `deviceId`, write to `dailyRollups` via `$merge`
  - Add a 90-day TTL on `temperatures` so raw data ages out while rollups persist

### Exercises

1. Create a time series collection with `granularity: "minutes"` and insert 100 readings for 2 devices.
2. Write an aggregation that produces hourly averages per device using `$dateTrunc`.
3. Create a capped collection (10MB, max 100k docs), insert 5 docs, and confirm `$natural` ordering.
4. Open a tailable cursor on the capped collection in Node and insert a doc from another shell; confirm the cursor emits it.
5. >>> QUIZ (Stage 19) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What is a time series collection optimized for?
8. A) Frequent updates to existing documents
9. B) Relational joins
10. C) Append-only timestamped measurements with fast time-range queries (*)
11. D) Full-text search
12. Explanation: Time series collections use columnar-like compression and time-ordered storage to optimize append-only telemetry; updates/deletes are limited.
13. Q2: Which field is REQUIRED on a time series collection?
14. A) metaField
15. B) granularity
16. C) expireAfterSeconds
17. D) timeField (*)
18. Explanation: `timeField` (the timestamp) is required and indexed; `metaField` and `granularity` are optional (but recommended).
19. Q3: What does a capped collection do when it's full?
20. A) Silently overwrites the OLDEST documents (*)
21. B) Stops accepting writes
22. C) Errors out
23. D) Auto-scales
24. Explanation: Capped collections are fixed-size and FIFO — when full, new inserts overwrite the oldest documents, so head-of-line data is lost if the consumer is slow.
25. Q4: Which cursor type lets you `tail -f` new inserts on a capped collection?
26. A) change stream
27. B) tailable cursor with awaitData (*)
28. C) snapshot cursor
29. D) covered cursor
30. Explanation: `find().addCursorFlag("tailable", true).addCursorFlag("awaitData", true)` keeps the cursor open and blocks for new inserts — `tail -f` style. Only works on capped collections.
31. Q5: What's a pitfall of `granularity: "seconds"` for hourly measurements?
32. A) Errors out
33. B) Reduces query speed
34. C) Wastes storage buckets — match granularity to inter-arrival time (*)
35. D) Doesn't allow inserts
36. Explanation: Granularity tunes the storage bucketing; "seconds" granularity for hourly data creates many tiny buckets and wastes storage. Match granularity to the actual inter-arrival time.
37. Q6: Which operation is NOT allowed on a capped collection?
38. A) insertOne
39. B) find
40. C) sort by $natural
41. D) deleteOne (*)
42. Explanation: Capped collections disallow deletes; updates must keep the same document size. Use a regular collection if you need mutation.
43. Q7: How do capped collections order documents?
44. A) By insertion order ($natural) — not by _id or any field (*)
45. B) By _id
46. C) Alphabetically
47. D) Randomly
48. Explanation: Capped collections preserve insertion (natural) order; sort with `{ $natural: 1 }` or `{ $natural: -1 }`. `_id` order is not guaranteed (especially with custom _ids).
49. Q8: Why use change streams over tailable cursors for event streaming?
50. A) Tailable cursors are deprecated
51. B) Change streams have resume tokens, work on regular collections, and emit richer events (*)
52. C) Tailable cursors require Atlas
53. D) Change streams are faster
54. Explanation: Change streams provide resumability, work on any collection (not just capped), and emit structured events (insert/update/delete). Tailable cursors are a low-level primitive for capped collections only.
55. Q9: What does `$dateTrunc` do in an aggregation?
56. A) Truncates a date field from the document
57. B) Converts a date to a string
58. C) Rounds a date DOWN to the start of a unit (hour, day, week) for grouping (*)
59. D) Computes the difference between two dates
60. Explanation: `$dateTrunc: { date: "$ts", unit: "hour" }` rounds each timestamp down to the top of the hour, enabling per-hour bucket aggregations.
61. Q10: When should you NOT use a time series collection?
62. A) When data is timestamped
63. B) When you have many devices
64. C) When you need an index on time
65. D) When you need frequent updates/deletes to existing measurements, or data isn't append-only (*)
66. Explanation: Time series collections are for append-only timestamped data; if you need to mutate or delete existing measurements, use a regular collection.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a time series collection optimized for?
  options:
    - Frequent updates to existing documents
    - Relational joins
    - Append-only timestamped measurements with fast time-range queries
    - Full-text search
  correctIndex: 2
  explanation: Time series collections use columnar-like compression and time-ordered storage to optimize append-only telemetry; updates/deletes are limited.
- id: q2
  question: Which field is REQUIRED on a time series collection?
  options:
    - metaField
    - granularity
    - expireAfterSeconds
    - timeField
  correctIndex: 3
  explanation: "`timeField` (the timestamp) is required and indexed; `metaField` and `granularity` are optional (but recommended)."
- id: q3
  question: What does a capped collection do when it's full?
  options:
    - Silently overwrites the OLDEST documents
    - Stops accepting writes
    - Errors out
    - Auto-scales
  correctIndex: 0
  explanation: Capped collections are fixed-size and FIFO — when full, new inserts overwrite the oldest documents, so head-of-line data is lost if the consumer is slow.
- id: q4
  question: Which cursor type lets you `tail -f` new inserts on a capped collection?
  options:
    - change stream
    - tailable cursor with awaitData
    - snapshot cursor
    - covered cursor
  correctIndex: 1
  explanation: '`find().addCursorFlag("tailable", true).addCursorFlag("awaitData", true)` keeps the cursor open and blocks for new inserts — `tail -f` style. Only works on capped collections.'
- id: q5
  question: "What's a pitfall of `granularity: \"seconds\"` for hourly measurements?"
  options:
    - Errors out
    - Reduces query speed
    - Wastes storage buckets — match granularity to inter-arrival time
    - Doesn't allow inserts
  correctIndex: 2
  explanation: Granularity tunes the storage bucketing; "seconds" granularity for hourly data creates many tiny buckets and wastes storage. Match granularity to the actual inter-arrival time.
- id: q6
  question: Which operation is NOT allowed on a capped collection?
  options:
    - insertOne
    - find
    - sort by $natural
    - deleteOne
  correctIndex: 3
  explanation: Capped collections disallow deletes; updates must keep the same document size. Use a regular collection if you need mutation.
- id: q7
  question: How do capped collections order documents?
  options:
    - By insertion order ($natural) — not by _id or any field
    - By _id
    - Alphabetically
    - Randomly
  correctIndex: 0
  explanation: "Capped collections preserve insertion (natural) order; sort with `{ $natural: 1 }` or `{ $natural: -1 }`. `_id` order is not guaranteed (especially with custom _ids)."
- id: q8
  question: Why use change streams over tailable cursors for event streaming?
  options:
    - Tailable cursors are deprecated
    - Change streams have resume tokens, work on regular collections, and emit richer events
    - Tailable cursors require Atlas
    - Change streams are faster
  correctIndex: 1
  explanation: Change streams provide resumability, work on any collection (not just capped), and emit structured events (insert/update/delete). Tailable cursors are a low-level primitive for capped collections only.
- id: q9
  question: What does `$dateTrunc` do in an aggregation?
  options:
    - Truncates a date field from the document
    - Converts a date to a string
    - Rounds a date DOWN to the start of a unit (hour, day, week) for grouping
    - Computes the difference between two dates
  correctIndex: 2
  explanation: '`$dateTrunc: { date: "$ts", unit: "hour" }` rounds each timestamp down to the top of the hour, enabling per-hour bucket aggregations.'
- id: q10
  question: When should you NOT use a time series collection?
  options:
    - When data is timestamped
    - When you have many devices
    - When you need an index on time
    - When you need frequent updates/deletes to existing measurements, or data isn't append-only
  correctIndex: 3
  explanation: Time series collections are for append-only timestamped data; if you need to mutate or delete existing measurements, use a regular collection.
```

