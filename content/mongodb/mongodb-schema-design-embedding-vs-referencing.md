---
slug: mongodb-schema-design-embedding-vs-referencing
id: mongodb-09
track: mongodb
order: 9
title: Schema Design — Embedding vs Referencing
description: Decide when to embed subdocuments vs reference other collections, and learn the one-to-few, one-to-many, and many-to-many patterns.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=240s
whyItMatters: Decide when to embed subdocuments vs reference other collections, and learn the one-to-few, one-to-many, and many-to-many patterns.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Schema Design — Embedding vs Referencing

## Schema Design — Embedding vs Referencing

### Why It Matters

Decide when to embed subdocuments vs reference other collections, and learn the one-to-few, one-to-many, and many-to-many patterns.

Decide when to embed subdocuments vs reference other collections, and learn the one-to-few, one-to-many, and many-to-many patterns.

### Prerequisites

- Stage 2 (Documents, Collections, BSON) and Stage 8 (`$lookup`).
- Comfort drawing simple entity-relationship sketches.

### Topics

- Embedding: nested subdocuments in one document
- Referencing: storing `_id`s to other collections (manual + DBRef)
- One-to-Few: embed (e.g., addresses inside a user)
- One-to-Many: reference (e.g., orders by a customer)
- One-to-Squillions: bucket + reference (e.g., log events per device)
- Many-to-Many: array of refs in both collections, or a join collection
- The 16MB document cap and unbounded array growth
- Read-pattern-driven design: design for the queries, not the entities

### Key Concepts

- Embed when the subdocuments are queried together, are bounded in number, and change together (atomic writes).
- Reference when the subdocuments are unbounded, shared across parents, or updated independently (avoid 16MB docs and write contention).
- "One-to-Few" (<= ~100 items): embed. "One-to-Many" (hundreds-thousands): reference. "One-to-Squillions" (millions+): bucket + reference.
- The right answer depends on your READ pattern: if you always load a user with all their addresses, embed; if you only display the latest 5 orders, reference.
- Favor embedding for atomicity: a single `updateOne` modifying a parent + embedded children is atomic; multi-collection updates require transactions.

```javascript
db.users.insertOne({
  name: "Ada",
  addresses: [
    { label: "home", city: "London", zip: "NW1" },
    { label: "work", city: "London", zip: "EC1" }
  ]
})
// Atomic update of one address
db.users.updateOne(
  { _id: "u1", "addresses.label": "home" },
  { $set: { "addresses.$.zip": "NW1 6XE" } }     // $ = first match index
)
```
Caption: One-to-Few: embed addresses

### Common Pitfalls

- Embedding an unbounded array (e.g., comments inside a post) — eventually hits the 16MB document cap and slows down every write that rewrites the doc; move to a separate collection (or Bucket pattern) once it exceeds a few hundred items.
- Modeling everything as references "to be normalized" — MongoDB isn't a relational DB; unnecessary `$lookup`s add round trips and lose atomicity. Embed when data is queried together.
- Storing the same denormalized data in 5 places and updating all of them — denormalization is fast for reads but creates consistency headaches; pick the ONE place that owns the data and denormalize read-only copies.
- Using DBRef (`{ $ref, $id, $db }`) — deprecated and not needed; store plain `_id` values and resolve with `$lookup` (your driver may not even support DBRef).
- Designing the schema from the entities ("we have users and orders") instead of the queries ("we always load the latest 5 orders per customer") — schema design in MongoDB is query-driven, not entity-driven.

### Real-World Applications

- Stripe embeds `charges` and `refunds` as subdocuments on the payment-intent document for atomic state transitions and single-fetch reads.
- Uber embeds the per-trip route as an array of GeoJSON points inside the trip document (bounded by trip duration).
- Adobe embeds layer data inside design files (one-to-few) but references asset libraries externally (one-to-many shared assets).
- eBay uses a Bucket pattern for listing-view events: hourly buckets per listing keep documents bounded and queryable.

### Interview Questions

- 1. When should you embed vs reference? — Embed when bounded, queried together, and updated atomically; reference when unbounded, shared, or updated independently.
- 2. What's the Bucket pattern? — Group many child events (e.g., telemetry) into bounded parent documents (per hour/day) so each doc stays small and the array doesn't grow unbounded.
- 3. What's the danger of an unbounded embedded array? — Hits the 16MB cap, slows writes (rewrites the whole doc), and degrades index performance.
- 4. Why is embedding good for atomicity? — A single `updateOne` modifying a parent + embedded children is atomic at the document level; cross-collection updates need transactions.
- 5. How do you choose for many-to-many with large N? — Use a separate join/enrollment collection with two indexed foreign keys; don't try to keep arrays in sync on both sides.

### Mini Project

Model a Blog with Posts, Comments, and Tags: Decide for each whether to embed or reference, then implement and benchmark. Suggested approach:
  - Embed `tags` (bounded, queried together with the post) as a string array
  - Embed the first 5 comments as `recentComments` for fast first-page display
  - Reference all comments in a separate `comments` collection keyed by `postId`
  - Use a `find()` for the post (returns first 5 comments) and a separate paginated `find` on `comments` for the rest
  - Add a `db.posts.createIndex({ tags: 1 })` for tag-filter queries

### Exercises

1. Model a User with up to 3 addresses — embed and write an atomic update for one address using `$` positional operator.
2. Model Customer-Orders (a customer may have thousands of orders) using references; query the latest 10 orders for a customer.
3. Apply the Bucket pattern to a stream of temperature readings: one bucket per device per hour, max 3600 events.
4. Convert a DBRef-style field to a plain `_id` reference and write a `$lookup` to resolve it.
5. >>> QUIZ (Stage 9) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: When should you EMBED a child document?
8. A) When the children are bounded, queried together with the parent, and updated atomically (*)
9. B) Always
10. C) When the children are unbounded
11. D) When the children are shared across many parents
12. Explanation: Embed when the array is small and stable, the data is read together, and you want atomic single-document updates — otherwise reference.
13. Q2: What's the danger of embedding an unbounded array (e.g., all comments in a post)?
14. A) Comments can't be queried
15. B) The document eventually exceeds the 16MB cap and writes get slow (*)
16. C) Indexes are not allowed on arrays
17. D) MongoDB disallows array subdocuments
18. Explanation: Each push rewrites the whole document; unbounded arrays blow past the 16MB cap and slow writes. Use a separate collection (or Bucket pattern) for unbounded children.
19. Q3: Which pattern handles "one-to-squillions" (e.g., millions of events per device)?
20. A) Embed everything in the device doc
21. B) Create one collection per device
22. C) Bucket + reference: group events into bounded hourly buckets, each referencing the device (*)
23. D) Use $lookup on every read
24. Explanation: The Bucket pattern groups many child events into bounded parent docs (e.g., hourly per device), keeping each doc small and queryable while avoiding the 16MB cap.
25. Q4: Why is embedding good for atomicity?
26. A) Embedded writes use no locks
27. B) Embedded data is cached in RAM
28. C) Embedded writes skip the journal
29. D) A single updateOne modifying a parent + embedded children is atomic at the document level (*)
30. Explanation: MongoDB guarantees per-document atomicity; updating a parent and its embedded children in one `updateOne` is atomic, while cross-collection updates need explicit transactions.
31. Q5: What's the recommended way to model many-to-many with very large N?
32. A) A separate join/enrollment collection with two indexed foreign keys (*)
33. B) Array of refs on both sides
34. C) Embed all on one side
35. D) Use DBRef
36. Explanation: For large N, a join collection with both foreign keys indexed scales; keeping arrays in sync on both sides for millions of entries is impractical and slow.
37. Q6: What is DBRef and should you use it?
38. A) A modern replacement for $lookup
39. B) A legacy `{ $ref, $id, $db }` convention — deprecated; store plain _id values instead (*)
40. C) The official way to do joins
41. D) Required for transactions
42. Explanation: DBRef is a legacy convention with little driver support; modern MongoDB uses plain `_id` references resolved with `$lookup` or app-side queries.
43. Q7: For "one-to-few" (a user with up to ~5 addresses), what's the best design?
44. A) Reference each address by _id
45. B) Use a join collection
46. C) Embed the addresses array in the user document (*)
47. D) Use DBRef
48. Explanation: Bounded small arrays queried together with the parent should be embedded — single-fetch reads and atomic updates.
49. Q8: What does the `$` positional operator do in an update?
50. A) Adds a field
51. B) Removes an array
52. C) Creates an index
53. D) Refers to the first array element matched by the query filter (*)
54. Explanation: `"addresses.$.zip": "NW1"` updates the zip of the first address whose `label` matched in the query filter — the `$` is the positional placeholder.
55. Q9: Why shouldn't you normalize everything as references "to be clean"?
56. A) MongoDB isn't relational — unnecessary $lookups add round trips and lose atomicity (*)
57. B) References are deprecated
58. C) References can't be indexed
59. D) References require a transaction
60. Explanation: Over-normalizing forces expensive `$lookup`s on every read and prevents atomic single-doc updates. Embed data that's queried together.
61. Q10: Schema design in MongoDB should be driven by what?
62. A) The entities (we have users and orders)
63. B) The queries (we always load the latest 5 orders per customer) (*)
64. C) The number of developers
65. D) The sharding topology
66. Explanation: MongoDB schema design is query-driven: model the data for how the application actually reads it, not for relational-style entity normalization.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When should you EMBED a child document?
  options:
    - When the children are bounded, queried together with the parent, and updated atomically
    - Always
    - When the children are unbounded
    - When the children are shared across many parents
  correctIndex: 0
  explanation: Embed when the array is small and stable, the data is read together, and you want atomic single-document updates — otherwise reference.
- id: q2
  question: What's the danger of embedding an unbounded array (e.g., all comments in a post)?
  options:
    - Comments can't be queried
    - The document eventually exceeds the 16MB cap and writes get slow
    - Indexes are not allowed on arrays
    - MongoDB disallows array subdocuments
  correctIndex: 1
  explanation: Each push rewrites the whole document; unbounded arrays blow past the 16MB cap and slow writes. Use a separate collection (or Bucket pattern) for unbounded children.
- id: q3
  question: Which pattern handles "one-to-squillions" (e.g., millions of events per device)?
  options:
    - Embed everything in the device doc
    - Create one collection per device
    - "Bucket + reference: group events into bounded hourly buckets, each referencing the device"
    - Use $lookup on every read
  correctIndex: 2
  explanation: The Bucket pattern groups many child events into bounded parent docs (e.g., hourly per device), keeping each doc small and queryable while avoiding the 16MB cap.
- id: q4
  question: Why is embedding good for atomicity?
  options:
    - Embedded writes use no locks
    - Embedded data is cached in RAM
    - Embedded writes skip the journal
    - A single updateOne modifying a parent + embedded children is atomic at the document level
  correctIndex: 3
  explanation: MongoDB guarantees per-document atomicity; updating a parent and its embedded children in one `updateOne` is atomic, while cross-collection updates need explicit transactions.
- id: q5
  question: What's the recommended way to model many-to-many with very large N?
  options:
    - A separate join/enrollment collection with two indexed foreign keys
    - Array of refs on both sides
    - Embed all on one side
    - Use DBRef
  correctIndex: 0
  explanation: For large N, a join collection with both foreign keys indexed scales; keeping arrays in sync on both sides for millions of entries is impractical and slow.
- id: q6
  question: What is DBRef and should you use it?
  options:
    - A modern replacement for $lookup
    - A legacy `{ $ref, $id, $db }` convention — deprecated; store plain _id values instead
    - The official way to do joins
    - Required for transactions
  correctIndex: 1
  explanation: DBRef is a legacy convention with little driver support; modern MongoDB uses plain `_id` references resolved with `$lookup` or app-side queries.
- id: q7
  question: For "one-to-few" (a user with up to ~5 addresses), what's the best design?
  options:
    - Reference each address by _id
    - Use a join collection
    - Embed the addresses array in the user document
    - Use DBRef
  correctIndex: 2
  explanation: Bounded small arrays queried together with the parent should be embedded — single-fetch reads and atomic updates.
- id: q8
  question: What does the `$` positional operator do in an update?
  options:
    - Adds a field
    - Removes an array
    - Creates an index
    - Refers to the first array element matched by the query filter
  correctIndex: 3
  explanation: '`"addresses.$.zip": "NW1"` updates the zip of the first address whose `label` matched in the query filter — the `$` is the positional placeholder.'
- id: q9
  question: Why shouldn't you normalize everything as references "to be clean"?
  options:
    - MongoDB isn't relational — unnecessary $lookups add round trips and lose atomicity
    - References are deprecated
    - References can't be indexed
    - References require a transaction
  correctIndex: 0
  explanation: Over-normalizing forces expensive `$lookup`s on every read and prevents atomic single-doc updates. Embed data that's queried together.
- id: q10
  question: Schema design in MongoDB should be driven by what?
  options:
    - The entities (we have users and orders)
    - The queries (we always load the latest 5 orders per customer)
    - The number of developers
    - The sharding topology
  correctIndex: 1
  explanation: "MongoDB schema design is query-driven: model the data for how the application actually reads it, not for relational-style entity normalization."
```

