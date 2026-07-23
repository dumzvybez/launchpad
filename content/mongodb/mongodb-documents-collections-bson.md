---
slug: mongodb-documents-collections-bson
id: mongodb-02
track: mongodb
order: 2
title: Documents, Collections, and BSON
description: Model real-world data as nested documents and arrays, master dot notation, and learn which BSON types exist beyond plain JSON.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=30s
whyItMatters: Model real-world data as nested documents and arrays, master dot notation, and learn which BSON types exist beyond plain JSON.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Documents, Collections, and BSON

## Documents, Collections, and BSON

### Why It Matters

Model real-world data as nested documents and arrays, master dot notation, and learn which BSON types exist beyond plain JSON.

Model real-world data as nested documents and arrays, master dot notation, and learn which BSON types exist beyond plain JSON.

### Prerequisites

- Stage 1 (Getting Started with MongoDB) — comfortable with `mongosh` and basic `insertOne`/`find`.
- Basic JSON literacy (objects, arrays, strings, numbers, booleans, null).

### Topics

- Document anatomy: fields, values, nesting, arrays of subdocuments
- BSON type system: ObjectId, Date, Decimal128, NumberLong, BinData, Timestamp, Boolean, Null, Regex
- Dot notation: `"address.city"`, `"tags.0"`, `"items.price"`
- The `_id` field: ObjectId vs UUID vs string vs number
- Inserting nested documents and querying nested fields
- Type coercion pitfalls: `1` vs `NumberLong(1)` vs `NumberDecimal("1")`
- `typeof` and `$type` operator basics
- `db.collection.stats()` and document size with `Object.bsonsize()`

### Key Concepts

- A document is an ordered set of key/value pairs stored as BSON; values can themselves be documents or arrays (nesting up to 100 levels deep, 16MB total).
- BSON extends JSON with types JSON can't represent natively: ObjectId, Date, Decimal128, BinData, NumberLong, Timestamp, Regex.
- Dot notation navigates nested fields in queries, projections, updates, and indexes.
- The `_id` field is immutable and indexed with a unique index automatically; you can use any BSON type as `_id` (string, number, ObjectId, UUID BinData) as long as it's unique.
- `1` (double) vs `NumberInt(1)` (32-bit) vs `NumberLong(1)` (64-bit) vs `NumberDecimal("1")` (128-bit) are distinct BSON types and `$type` distinguishes them.

```javascript
db.users.insertOne({
  _id: "u_42",                       // custom string _id
  name: "Ada Lovelace",
  email: "ada@example.com",
  address: {                         // nested subdocument
    street: "221B Baker St",
    city: "London",
    geo: { type: "Point", coordinates: [-0.16, 51.52] }
  },
  tags: ["math", "computing"],       // array of scalars
  orders: [                          // array of subdocuments
    { id: "o1", total: NumberDecimal("99.50"), at: new Date() },
    { id: "o2", total: NumberDecimal("14.00"), at: new Date() }
  ],
  meta: { visits: NumberLong(0) }    // 64-bit int, not double
})
```
Caption: Nested document and array

### Common Pitfalls

- Comparing `1` (double) to `NumberInt(1)` and expecting equality — they're different BSON types; MongoDB matches across numeric types by value but `$type` distinguishes them, and indexes store type-tagged values.
- Storing numbers larger than `2^53` as JavaScript Number — JS Numbers are doubles and lose precision past 2^53; use `NumberLong` from a string (`NumberLong("9007199254740993")`).
- Letting nested arrays grow unbounded — MongoDB's 16MB document cap and index performance degrade quickly; an unbounded comments array inside a post document is the #1 cause of E11000-style size errors and slow updates.
- Using strings as `_id` for high-write collections — string `_id`s don't have the timestamp prefix that gives ObjectIds their natural insertion-order locality; the `_id` index (a B-tree) becomes fragmented.
- Confusing JS `Date` (millisecond precision, UTC) with BSON `Timestamp` (second + counter, used in oplog and change streams) — they're different BSON types with different use cases.

### Real-World Applications

- Stripe stores payment-intent documents with deeply nested `charges`, `refunds`, and `metadata` subdocuments that fit naturally in BSON.
- Cisco's IoT telemetry pipeline uses BinData and Timestamp BSON types to store raw sensor frames and oplog-style event ordering.
- Adobe Creative Cloud uses MongoDB nested documents to represent layered design files where each layer is a subdocument in an array.
- MongoDB itself uses BSON Timestamps in the oplog (local.oplog.rs) for replica set replication ordering.

### Interview Questions

- 1. What's the difference between JSON and BSON? — BSON is binary, length-prefixed, and adds types JSON can't represent (ObjectId, Date, Decimal128, BinData, Timestamp, Regex).
- 2. How do you query a field nested three levels deep? — Use dot notation like `"address.geo.coordinates"` in the query filter.
- 3. What's the max nesting depth and document size in MongoDB 7? — 100 levels of nesting, 16MB total document size (hard limit).
- 4. Why does `1` vs `NumberInt(1)` vs `NumberLong(1)` matter? — They're distinct BSON types (double/int32/int64); `$type` distinguishes them and large ints need `NumberLong` to preserve precision.
- 5. When would you use a custom `_id` instead of ObjectId? — When you have a natural unique key (e.g., username, SKU, UUID string) and want to avoid an extra lookup index; trade-off is losing embedded timestamps.

### Mini Project

Build a JSON-to-BSON Type Inspector: A mongosh script that loads a sample document with every BSON type, then iterates fields and prints each field's `$type` and `Object.bsonsize()` contribution. Suggested approach:
  - Insert one document containing all 10+ BSON types (double, int, long, decimal, string, date, timestamp, binData, objectId, boolean, null, regex)
  - Use a `for...in` loop and `$type` aggregation operator to report each field's type alias
  - Compute `Object.bsonsize(doc)` for the whole document
  - Add a `printTotal()` helper that sums per-field sizes (approximate by serializing each field alone)
  - Output a markdown-style table of field, type, size

### Exercises

1. Insert a document with a nested `address` subdocument and write a `find()` query that filters on `address.city`.
2. Insert a document with an array of 3 subdocuments (e.g., `orders: [{id, total}, ...]`) and query by `"orders.id"`.
3. Insert documents with `NumberInt`, `NumberLong`, `NumberDecimal`, and JS Number for the same logical value `1`; use `$type` to fetch only the long.
4. Compute `Object.bsonsize()` of your largest document and reduce it by removing redundant fields until under 1KB.
5. >>> QUIZ (Stage 2) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How do you query a field nested inside a subdocument called `address`?
8. A) `find({ address: { city: "London" } })` only
9. B) `find({ "address.city": "London" })` using dot notation (*)
10. C) `find(address.city == "London")`
11. D) `find(address->city == "London")`
12. Explanation: Dot notation `"address.city"` is the canonical way to query nested fields in MongoDB filters, projections, and updates.
13. Q2: Which BSON type stores monetary values safely?
14. A) double
15. B) int32
16. C) Decimal128 (*)
17. D) string
18. Explanation: Decimal128 (NumberDecimal) gives 34 digits of decimal precision, avoiding float rounding errors in money math.
19. Q3: What is the maximum BSON document size?
20. A) 1 MB
21. B) 64 MB
22. C) Unlimited
23. D) 16 MB (*)
24. Explanation: 16MB is a hard ceiling per document; anything larger should use GridFS or external object storage referenced by URL.
25. Q4: What does `Object.bsonsize(doc)` return?
26. A) The size in bytes of the BSON-encoded document (*)
27. B) The number of fields
28. C) The number of characters when JSON-stringified
29. D) The compressed on-disk size
30. Explanation: `Object.bsonsize()` returns the byte size of the BSON serialization (uncompressed), useful for sizing documents before insertion.
31. Q5: Which is a BSON type that JSON does NOT have natively?
32. A) String
33. B) ObjectId (*)
34. C) Boolean
35. D) Number
36. Explanation: JSON has strings, booleans, numbers, null, arrays, and objects — but not ObjectId, Date, BinData, Decimal128, or Timestamp.
37. Q6: How do you store an integer larger than 2^53 safely?
38. A) Use a JavaScript Number
39. B) Use NumberInt
40. C) Use NumberLong from a string like NumberLong("9007199254740993") (*)
41. D) Store it as a string and parse later
42. Explanation: JS Numbers are doubles and lose precision past 2^53; NumberLong (64-bit int) preserves the value when constructed from a string.
43. Q7: What's the difference between BSON `Date` and `Timestamp`?
44. A) They are the same type
45. B) Date is a string; Timestamp is a number
46. C) Date is for past times; Timestamp is for future times
47. D) Date is millisecond precision UTC time; Timestamp is second+counter used in oplog/change streams (*)
48. Explanation: Date (ms precision, type 9) is for general datetimes; Timestamp (sec+counter, type 17) is the internal oplog ordering type used for replication and change streams.
49. Q8: What is the maximum nesting depth of a BSON document?
50. A) 100 (*)
51. B) 50
52. C) 256
53. D) Unlimited
54. Explanation: MongoDB enforces a 100-level nesting limit per document; deep nesting is usually a schema-design smell anyway.
55. Q9: Which operator checks a field's BSON type?
56. A) $typeof
57. B) $type (*)
58. C) $is
59. D) $class
60. Explanation: `$type: "long"` (or numeric alias like `$type: 18`) matches documents whose field is of that BSON type.
61. Q10: Why is using a string `_id` for high-write collections sometimes a problem?
62. A) Strings can't be indexed
63. B) Strings are case-sensitive and break queries
64. C) Random strings lose the insertion-order locality ObjectIds give the _id B-tree, causing fragmentation (*)
65. D) String _ids can't be unique
66. Explanation: ObjectIds are monotonically increasing (timestamp first), keeping the `_id` B-tree rightmost-heavy and append-friendly; random string `_id`s fragment the index.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you query a field nested inside a subdocument called `address`?
  options:
    - '`find({ address: { city: "London" } })` only'
    - '`find({ "address.city": "London" })` using dot notation'
    - '`find(address.city == "London")`'
    - '`find(address->city == "London")`'
  correctIndex: 1
  explanation: Dot notation `"address.city"` is the canonical way to query nested fields in MongoDB filters, projections, and updates.
- id: q2
  question: Which BSON type stores monetary values safely?
  options:
    - double
    - int32
    - Decimal128
    - string
  correctIndex: 2
  explanation: Decimal128 (NumberDecimal) gives 34 digits of decimal precision, avoiding float rounding errors in money math.
- id: q3
  question: What is the maximum BSON document size?
  options:
    - 1 MB
    - 64 MB
    - Unlimited
    - 16 MB
  correctIndex: 3
  explanation: 16MB is a hard ceiling per document; anything larger should use GridFS or external object storage referenced by URL.
- id: q4
  question: What does `Object.bsonsize(doc)` return?
  options:
    - The size in bytes of the BSON-encoded document
    - The number of fields
    - The number of characters when JSON-stringified
    - The compressed on-disk size
  correctIndex: 0
  explanation: "`Object.bsonsize()` returns the byte size of the BSON serialization (uncompressed), useful for sizing documents before insertion."
- id: q5
  question: Which is a BSON type that JSON does NOT have natively?
  options:
    - String
    - ObjectId
    - Boolean
    - Number
  correctIndex: 1
  explanation: JSON has strings, booleans, numbers, null, arrays, and objects — but not ObjectId, Date, BinData, Decimal128, or Timestamp.
- id: q6
  question: How do you store an integer larger than 2^53 safely?
  options:
    - Use a JavaScript Number
    - Use NumberInt
    - Use NumberLong from a string like NumberLong("9007199254740993")
    - Store it as a string and parse later
  correctIndex: 2
  explanation: JS Numbers are doubles and lose precision past 2^53; NumberLong (64-bit int) preserves the value when constructed from a string.
- id: q7
  question: What's the difference between BSON `Date` and `Timestamp`?
  options:
    - They are the same type
    - Date is a string; Timestamp is a number
    - Date is for past times; Timestamp is for future times
    - Date is millisecond precision UTC time; Timestamp is second+counter used in oplog/change streams
  correctIndex: 3
  explanation: Date (ms precision, type 9) is for general datetimes; Timestamp (sec+counter, type 17) is the internal oplog ordering type used for replication and change streams.
- id: q8
  question: What is the maximum nesting depth of a BSON document?
  options:
    - "100"
    - "50"
    - "256"
    - Unlimited
  correctIndex: 0
  explanation: MongoDB enforces a 100-level nesting limit per document; deep nesting is usually a schema-design smell anyway.
- id: q9
  question: Which operator checks a field's BSON type?
  options:
    - $typeof
    - $type
    - $is
    - $class
  correctIndex: 1
  explanation: '`$type: "long"` (or numeric alias like `$type: 18`) matches documents whose field is of that BSON type.'
- id: q10
  question: Why is using a string `_id` for high-write collections sometimes a problem?
  options:
    - Strings can't be indexed
    - Strings are case-sensitive and break queries
    - Random strings lose the insertion-order locality ObjectIds give the _id B-tree, causing fragmentation
    - String _ids can't be unique
  correctIndex: 2
  explanation: ObjectIds are monotonically increasing (timestamp first), keeping the `_id` B-tree rightmost-heavy and append-friendly; random string `_id`s fragment the index.
```

