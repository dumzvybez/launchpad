---
slug: mongodb-change-streams-triggers
id: mongodb-15
track: mongodb
order: 15
title: Change Streams and Triggers
description: Subscribe to collection changes in real time with `watch()`, manage resume tokens for resumability, and use Atlas Triggers for serverless change handlers.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=720s
whyItMatters: Subscribe to collection changes in real time with `watch()`, manage resume tokens for resumability, and use Atlas Triggers for serverless change handlers.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Change Streams and Triggers

## Change Streams and Triggers

### Why It Matters

Subscribe to collection changes in real time with `watch()`, manage resume tokens for resumability, and use Atlas Triggers for serverless change handlers.

Subscribe to collection changes in real time with `watch()`, manage resume tokens for resumability, and use Atlas Triggers for serverless change handlers.

### Prerequisites

- Stage 12 (Replication — change streams read from the oplog).
- Comfort with Node.js EventEmitters or async iterators.

### Topics

- `db.collection.watch()` and the `$changeStream` pipeline stage
- Resume tokens: `resumeAfter`, `startAfter`, `startAtOperationTime`
- Change event structure: `operationType`, `fullDocument`, `updateDescription`
- Filtering change streams with `$match` on `operationType` and `fullDocument`
- Pre-image and post-image support (`fullDocument: "updateLookup"`, `"required"`)
- Resumability after disconnect or restart
- Atlas Triggers: database triggers and scheduled triggers
- Common use cases: audit log, denormalization, search index sync

### Key Concepts

- A change stream is a long-lived cursor that emits an event for every matching CRUD op on a collection, database, or cluster.
- Change streams are RESUMABLE: each event has a resume token; pass it as `resumeAfter` to continue from where you left off after a crash or restart.
- By default, update events contain only the changed fields (`updateDescription`), not the full doc; set `fullDocument: "updateLookup"` to fetch the current doc, or `"required"` for pre/post images (6.0+).
- Change streams read from the oplog, so they require a replica set or sharded cluster (not standalone mongod).
- Atlas Triggers are serverless functions that fire on database changes or a schedule — fully managed change streams without your own consumer process.

```javascript
const changeStream = db.collection("orders").watch()
for await (const change of changeStream) {
  console.log(change.operationType, change._id, change.fullDocument)
  // change: { _id: <resumeToken>, operationType: "insert",
  //           fullDocument: { ... }, ns: { db, coll }, documentKey: { _id } }
}
```
Caption: Basic change stream in Node

### Common Pitfalls

- Not saving the resume token durably — if your consumer crashes, the in-memory token is lost; on restart you either skip events or replay from a too-old timestamp, both of which lose data.
- Treating change streams as a queue with at-least-once delivery — handlers MUST be idempotent; the same event can be delivered twice (e.g., after a reconnect before the token was saved).
- Forgetting to enable `fullDocumentBeforeChange` (6.0+) before needing pre-images — once the collection setting is off, you can't reconstruct old versions of deleted/updated docs.
- Running change streams against a standalone mongod — they require a replica set or sharded cluster (they read the oplog).
- Letting a slow handler fall behind the oplog retention window — if the consumer is too slow, the oplog entry it needs may be overwritten; size the oplog for the worst-case lag.

### Real-World Applications

- Stripe uses change streams to sync payment state to its data warehouse for analytics.
- Uber uses change streams to update its real-time driver map as trip status changes.
- eBay uses change streams to denormalize hot fields into listing-search indexes for fast filters.
- Adobe uses Atlas Triggers to run image-thumbnail generation when assets are inserted.

### Interview Questions

- 1. What does a change stream's `_id` field represent? — The resume token; pass it as `resumeAfter` to continue from that exact point after a restart.
- 2. How do you get the full document on an update event? — By default you only get `updateDescription` (changed fields); set `fullDocument: "updateLookup"` to fetch the current doc, or `"required"` for post-image (6.0+).
- 3. Why must change-stream handlers be idempotent? — At-least-once delivery: the same event can be redelivered after a reconnect before the resume token was durably saved.
- 4. What's the difference between `resumeAfter` and `startAfter`? — `resumeAfter` continues after the token (can't be used after an invalidate event); `startAfter` is the post-invalidate continuation.
- 5. What are Atlas Triggers? — Fully managed serverless functions that fire on database changes or schedules, abstracting away the change-stream consumer process.

### Mini Project

Build an Audit Log via Change Streams: A Node service that watches the `orders` collection and appends every change to an `auditLog` collection with `{ ts, op, before, after }`, with crash-safe resume. Suggested approach:
  - Enable `changeStreamPreAndPostImages` on the `orders` collection via `collMod`
  - Persist the resume token in a `resumeTokens` collection after each event
  - On startup, read the latest token and pass `resumeAfter` to `watch()`
  - Make the audit-log append idempotent using a unique index on `{ resumeToken: 1 }`
  - Implement a supervisor loop that reconnects after errors with exponential backoff

### Exercises

1. Start a replica set, insert a few docs, and watch the collection in mongosh with `db.c.watch()`.
2. Build a filtered change stream that only emits `insert` events with `status: "paid"`.
3. Persist a resume token to a collection; kill your consumer; restart and confirm it picks up where it left off.
4. Enable pre/post images with `collMod` and confirm `fullDocumentBeforeChange` is populated on update events.
5. >>> QUIZ (Stage 15) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does the `_id` field of a change event represent?
8. A) The changed document's _id
9. B) A random UUID
10. C) The resume token used to continue after a restart (*)
11. D) The oplog timestamp
12. Explanation: `_id` in a change event is the resume token; pass it as `resumeAfter` to `watch()` to resume from exactly that point after a crash or restart.
13. Q2: How do you get the full current document on an update event?
14. A) It's always included
15. B) Use $lookup
16. C) You can't
17. D) Set `fullDocument: "updateLookup"` (or "required" for post-image in 6.0+) (*)
18. Explanation: By default update events only have `updateDescription` (changed fields); set `fullDocument: "updateLookup"` to fetch the current doc, or `"required"` for post-image.
19. Q3: Why must change-stream handlers be idempotent?
20. A) The same event can be redelivered after a reconnect before the resume token was durably saved (*)
21. B) Events can be reordered
22. C) Handlers run in parallel
23. D) Events have no order
24. Explanation: Change streams deliver at-least-once; if the consumer crashes after processing but before saving the token, the event is replayed on restart — handlers must tolerate duplicates.
25. Q4: What does a change stream require on the server side?
26. A) Standalone mongod
27. B) A replica set or sharded cluster (reads from oplog) (*)
28. C) Atlas only
29. D) Enterprise license
30. Explanation: Change streams read from the oplog, which only exists on replica sets / sharded clusters — not standalone mongod.
31. Q5: How do you enable pre-images (the document BEFORE an update/delete)?
32. A) Set a flag in the connection string
33. B) It's always on
34. C) Run `collMod` with `changeStreamPreAndPostImages: { enabled: true }` (6.0+) (*)
35. D) Use $lookup
36. Explanation: Pre/post images must be enabled per collection via `collMod` BEFORE you need them; once off, you can't reconstruct old versions of past events.
37. Q6: Which option resumes after an `invalidate` event (collection drop/rename)?
38. A) resumeAfter
39. B) startAtOperationTime
40. C) None — invalidate is terminal
41. D) startAfter (*)
42. Explanation: `invalidate` invalidates the stream; `resumeAfter` can't be used after it. `startAfter` (4.2+) starts a NEW stream after the invalidate.
43. Q7: What's the at-least-once delivery consequence?
44. A) Handlers may receive the same event more than once — must be idempotent (*)
45. B) Handlers receive each event exactly once
46. C) Events may be lost
47. D) Events may be reordered
48. Explanation: At-least-once means duplicates are possible (redelivery after a crash before token was saved); handlers must tolerate being called twice for the same event.
49. Q8: Which is a common change-stream use case?
50. A) Schema validation
51. B) Syncing a search index or denormalizing hot fields in real time (*)
52. C) Shard-key selection
53. D) Oplog sizing
54. Explanation: Change streams are commonly used to sync search indexes (e.g., Atlas Search), update denormalized fields, populate audit logs, or trigger webhooks.
55. Q9: What happens if a slow consumer falls behind the oplog retention window?
56. A) It catches up automatically
57. B) MongoDB increases the oplog
58. C) The oplog entry it needs may be overwritten — the stream errors out (*)
59. D) The consumer reads from disk
60. Explanation: If the consumer is too slow, the needed oplog entry can be overwritten; the stream errors and must restart with `startAtOperationTime` (losing unprocessed events) — size the oplog for worst-case lag.
61. Q10: What are Atlas Triggers?
62. A) Index triggers
63. B) Replica-set election triggers
64. C) Schema-validation triggers
65. D) Fully managed serverless functions that fire on database changes or schedules (*)
66. Explanation: Atlas Triggers are managed functions that fire on database changes (database triggers) or schedules — change-stream consumers without your own infrastructure.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the `_id` field of a change event represent?
  options:
    - The changed document's _id
    - A random UUID
    - The resume token used to continue after a restart
    - The oplog timestamp
  correctIndex: 2
  explanation: "`_id` in a change event is the resume token; pass it as `resumeAfter` to `watch()` to resume from exactly that point after a crash or restart."
- id: q2
  question: How do you get the full current document on an update event?
  options:
    - It's always included
    - Use $lookup
    - You can't
    - 'Set `fullDocument: "updateLookup"` (or "required" for post-image in 6.0+)'
  correctIndex: 3
  explanation: 'By default update events only have `updateDescription` (changed fields); set `fullDocument: "updateLookup"` to fetch the current doc, or `"required"` for post-image.'
- id: q3
  question: Why must change-stream handlers be idempotent?
  options:
    - The same event can be redelivered after a reconnect before the resume token was durably saved
    - Events can be reordered
    - Handlers run in parallel
    - Events have no order
  correctIndex: 0
  explanation: Change streams deliver at-least-once; if the consumer crashes after processing but before saving the token, the event is replayed on restart — handlers must tolerate duplicates.
- id: q4
  question: What does a change stream require on the server side?
  options:
    - Standalone mongod
    - A replica set or sharded cluster (reads from oplog)
    - Atlas only
    - Enterprise license
  correctIndex: 1
  explanation: Change streams read from the oplog, which only exists on replica sets / sharded clusters — not standalone mongod.
- id: q5
  question: How do you enable pre-images (the document BEFORE an update/delete)?
  options:
    - Set a flag in the connection string
    - It's always on
    - "Run `collMod` with `changeStreamPreAndPostImages: { enabled: true }` (6.0+)"
    - Use $lookup
  correctIndex: 2
  explanation: Pre/post images must be enabled per collection via `collMod` BEFORE you need them; once off, you can't reconstruct old versions of past events.
- id: q6
  question: Which option resumes after an `invalidate` event (collection drop/rename)?
  options:
    - resumeAfter
    - startAtOperationTime
    - None — invalidate is terminal
    - startAfter
  correctIndex: 3
  explanation: "`invalidate` invalidates the stream; `resumeAfter` can't be used after it. `startAfter` (4.2+) starts a NEW stream after the invalidate."
- id: q7
  question: What's the at-least-once delivery consequence?
  options:
    - Handlers may receive the same event more than once — must be idempotent
    - Handlers receive each event exactly once
    - Events may be lost
    - Events may be reordered
  correctIndex: 0
  explanation: At-least-once means duplicates are possible (redelivery after a crash before token was saved); handlers must tolerate being called twice for the same event.
- id: q8
  question: Which is a common change-stream use case?
  options:
    - Schema validation
    - Syncing a search index or denormalizing hot fields in real time
    - Shard-key selection
    - Oplog sizing
  correctIndex: 1
  explanation: Change streams are commonly used to sync search indexes (e.g., Atlas Search), update denormalized fields, populate audit logs, or trigger webhooks.
- id: q9
  question: What happens if a slow consumer falls behind the oplog retention window?
  options:
    - It catches up automatically
    - MongoDB increases the oplog
    - The oplog entry it needs may be overwritten — the stream errors out
    - The consumer reads from disk
  correctIndex: 2
  explanation: If the consumer is too slow, the needed oplog entry can be overwritten; the stream errors and must restart with `startAtOperationTime` (losing unprocessed events) — size the oplog for worst-case lag.
- id: q10
  question: What are Atlas Triggers?
  options:
    - Index triggers
    - Replica-set election triggers
    - Schema-validation triggers
    - Fully managed serverless functions that fire on database changes or schedules
  correctIndex: 3
  explanation: Atlas Triggers are managed functions that fire on database changes (database triggers) or schedules — change-stream consumers without your own infrastructure.
```

