---
slug: mongodb-indexes-single-compound-text-geospatial
id: mongodb-06
track: mongodb
order: 6
title: Indexes — Single, Compound, Text, Geospatial
description: Create single-field, compound, text, and geospatial indexes, understand the ESR rule, and use `explain()` to confirm IXSCAN vs COLLSCAN.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=150s
whyItMatters: Create single-field, compound, text, and geospatial indexes, understand the ESR rule, and use `explain()` to confirm IXSCAN vs COLLSCAN.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Indexes — Single, Compound, Text, Geospatial

## Indexes — Single, Compound, Text, Geospatial

### Why It Matters

Create single-field, compound, text, and geospatial indexes, understand the ESR rule, and use `explain()` to confirm IXSCAN vs COLLSCAN.

Create single-field, compound, text, and geospatial indexes, understand the ESR rule, and use `explain()` to confirm IXSCAN vs COLLSCAN.

### Prerequisites

- Stage 4 (Query Operators) and Stage 5 (Projection, Sorting, Pagination).
- Conceptual familiarity with B-trees.

### Topics

- `createIndex()`, `dropIndex()`, `getIndexes()`, index naming
- Single-field indexes (asc/desc)
- Compound indexes and the ESR (Equality, Sort, Range) rule
- Multikey indexes (indexing array fields)
- Text indexes (`text`), `$text` queries, weights, default language
- Geospatial: `2dsphere` indexes, `$near`, `$geoWithin`, GeoJSON Point/Polygon
- `explain()` and `explain("executionStats")` reading
- TTL (time-to-live) indexes and unique indexes

### Key Concepts

- An index is a B-tree (or specialized structure) that lets MongoDB find matching documents without scanning the entire collection (COLLSCAN -> IXSCAN).
- The ESR rule governs compound index field order: Equality fields first, then Sort fields, then Range fields — this maximizes index usefulness.
- Multikey indexes are created automatically when you index a field that holds arrays; one index entry per array element.
- Text indexes tokenize and stem words; `$text` queries rank by relevance but cannot be combined with `$regex` on the same field.
- TTL indexes auto-delete documents `expireAfterSeconds` after a timestamp field — perfect for sessions and rate-limit buckets.

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.products.createIndex({ category: 1, price: -1 })   // compound
db.products.createIndex({ createdAt: -1 })

// ESR rule example: find { status: "active" }
//                   sort { createdAt: -1 }
//                   range { createdAt: { $gte: weekAgo } }
// E=status, S=createdAt (sort), R=createdAt (range) — merged:
db.events.createIndex({ status: 1, createdAt: -1 })

db.products.getIndexes()
db.products.dropIndex("category_1_price_-1")
```
Caption: Single, compound, and unique

### Common Pitfalls

- Creating a compound index in the wrong field order — `{ price: 1, category: 1 }` doesn't help `{ category: "books" }` queries; follow the ESR rule.
- Indexing everything "just in case" — every index slows down writes and consumes RAM (working set); monitor `indexSize` and remove unused indexes with `$indexStats`.
- Running `$text` queries case-insensitively without a text index — `$text` REQUIRES a text index, and one collection can have at most ONE text index.
- Storing `coordinates` as `[lat, lng]` instead of GeoJSON's `[lng, lat]` — GeoJSON order is longitude-first; reversing silently returns wrong nearest-neighbor results.
- Forgetting that TTL indexes delete documents based on a DATE field, not document creation time — if the indexed field is missing or non-date, the document is never expired.

### Real-World Applications

- Uber uses `2dsphere` indexes to find nearby drivers and riders in milliseconds.
- eBay uses compound ESR-rule indexes to power faceted product search across billions of listings.
- Stripe uses TTL indexes to expire OAuth sessions and rate-limit buckets automatically.
- Adobe uses text indexes on its help-system articles for full-text search across millions of docs.

### Interview Questions

- 1. What is the ESR rule? — Order compound index fields as Equality first, then Sort, then Range — to maximize the number of clauses the index can serve.
- 2. What's the difference between COLLSCAN and IXSCAN? — COLLSCAN scans every document in the collection; IXSCAN walks a B-tree index. Always aim for IXSCAN on hot queries.
- 3. How does a multikey index work? — MongoDB creates one index entry per array element; the index is "multikey" and supports element-level lookups.
- 4. Can a collection have more than one text index? — No; one text index per collection. To search multiple fields, put them in one text index with weights.
- 5. How does a TTL index decide when to delete a document? — It deletes the document `expireAfterSeconds` after the value of the indexed date field; missing/non-date fields never expire.

### Mini Project

Build a "Coffee Shops Near Me" API: Insert 100 coffee shops with `location: { type: "Point", coordinates: [lng, lat] }`, create a `2dsphere` index, and expose `GET /near?lng=&lat=&maxDistance=`. Suggested approach:
  - Seed shops via `insertMany` (use random coords around a city center)
  - Create `db.shops.createIndex({ location: "2dsphere" })`
  - In the handler, build a `$near` filter with `$geometry` and `$maxDistance` (meters)
  - Project `{ name: 1, distance: 0, _id: 0 }` and `limit(20)`
  - Add a text index on `name` and a `$text` endpoint `GET /search?q=`

### Exercises

1. Create a single-field index on `email` and confirm `find({ email })` uses IXSCAN via `explain()`.
2. Build a compound index following ESR for `find({ status: "active" }).sort({ createdAt: -1 })`.
3. Create a text index on `{ title: "text", body: "text" }` and run a `$text` search sorted by `textScore`.
4. Add a `2dsphere` index on a `location` field, insert 5 points, and run a `$near` query within 5km.
5. >>> QUIZ (Stage 6) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does the ESR rule stand for?
8. A) External Sort Requirement
9. B) Equal, Sort, Range — the recommended order for compound index fields (*)
10. C) Encode, Serialize, Reduce
11. D) Equality, Storage, RAM
12. Explanation: ESR (Equality, Sort, Range) is MongoDB's compound-index design rule: equality fields first, then sort fields, then range fields, for maximum index utilization.
13. Q2: Which `explain()` mode shows documents examined?
14. A) explain("queryPlanner")
15. B) explain("allPlans")
16. C) explain("executionStats") (*)
17. D) explain()
18. Explanation: `executionStats` actually runs the query and reports `totalDocsExamined`, `totalKeysExamined`, and `executionTimeMillis` — needed to verify index effectiveness.
19. Q3: What does COLLSCAN mean in `explain()` output?
20. A) The query used a collection-level lock
21. B) The query was canceled
22. C) The query used a compound index
23. D) The query scanned every document in the collection (no useful index) (*)
24. Explanation: COLLSCAN = Collection Scan — MongoDB reads every document to test the filter; for any non-trivial collection, add an index.
25. Q4: How many text indexes can a single collection have?
26. A) 1 (*)
27. B) Unlimited
28. C) 5
29. D) 2
30. Explanation: One text index per collection; to search multiple fields, create a single text index covering all of them (with optional per-field weights).
31. Q5: Which index type auto-deletes documents after a time?
32. A) Unique index
33. B) TTL index (*)
34. C) Text index
35. D) Hashed index
36. Explanation: A TTL index (`expireAfterSeconds: N`) deletes documents N seconds after the indexed date field's value; great for sessions and rate-limit buckets.
37. Q6: What is the correct coordinate order for GeoJSON Point?
38. A) [lat, lng]
39. B) (lat, lng) tuple
40. C) [lng, lat] (*)
41. D) { lat, lng } object
42. Explanation: GeoJSON specifies `[longitude, latitude]` — reversing the order silently returns wrong results in `$near` and `$geoWithin` queries.
43. Q7: What happens when you index a field that holds arrays?
44. A) Error
45. B) Only the first element is indexed
46. C) The array is concatenated to a string
47. D) MongoDB creates a multikey index with one entry per array element (*)
48. Explanation: Indexing an array field creates a multikey index automatically; each array element becomes its own index entry, supporting element-level lookups.
49. Q8: What does `db.products.find({ category: "books" }).explain("executionStats")` show if there's NO index on `category`?
50. A) COLLSCAN with totalDocsExamined == collection size (*)
51. B) IXSCAN with low totalDocsExamined
52. C) No output
53. D) An error
54. Explanation: Without an index on `category`, MongoDB falls back to a COLLSCAN, examining every document — `totalDocsExamined` will equal the collection size.
55. Q9: Which `$text` feature ranks results by relevance?
56. A) sort({ relevance: 1 })
57. B) { score: { $meta: "textScore" } } projection + sort by it (*)
58. C) $near
59. D) $elemMatch
60. Explanation: Project `{ score: { $meta: "textScore" } }` then `.sort({ score: { $meta: "textScore" } })` to order results by text relevance.
61. Q10: What's a downside of indexing too many fields?
62. A) Reads get slower
63. B) Indexes are immutable
64. C) Every index slows down writes and consumes RAM (working set) (*)
65. D) MongoDB limits you to 5 indexes per collection
66. Explanation: Each index must be updated on every write and held in the WiredTiger cache; over-indexing hurts write throughput and can blow out the working set. Use `$indexStats` to find unused indexes.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the ESR rule stand for?
  options:
    - External Sort Requirement
    - Equal, Sort, Range — the recommended order for compound index fields
    - Encode, Serialize, Reduce
    - Equality, Storage, RAM
  correctIndex: 1
  explanation: "ESR (Equality, Sort, Range) is MongoDB's compound-index design rule: equality fields first, then sort fields, then range fields, for maximum index utilization."
- id: q2
  question: Which `explain()` mode shows documents examined?
  options:
    - explain("queryPlanner")
    - explain("allPlans")
    - explain("executionStats")
    - explain()
  correctIndex: 2
  explanation: "`executionStats` actually runs the query and reports `totalDocsExamined`, `totalKeysExamined`, and `executionTimeMillis` — needed to verify index effectiveness."
- id: q3
  question: What does COLLSCAN mean in `explain()` output?
  options:
    - The query used a collection-level lock
    - The query was canceled
    - The query used a compound index
    - The query scanned every document in the collection (no useful index)
  correctIndex: 3
  explanation: COLLSCAN = Collection Scan — MongoDB reads every document to test the filter; for any non-trivial collection, add an index.
- id: q4
  question: How many text indexes can a single collection have?
  options:
    - "1"
    - Unlimited
    - "5"
    - "2"
  correctIndex: 0
  explanation: One text index per collection; to search multiple fields, create a single text index covering all of them (with optional per-field weights).
- id: q5
  question: Which index type auto-deletes documents after a time?
  options:
    - Unique index
    - TTL index
    - Text index
    - Hashed index
  correctIndex: 1
  explanation: "A TTL index (`expireAfterSeconds: N`) deletes documents N seconds after the indexed date field's value; great for sessions and rate-limit buckets."
- id: q6
  question: What is the correct coordinate order for GeoJSON Point?
  options:
    - "[lat, lng]"
    - (lat, lng) tuple
    - "[lng, lat]"
    - "{ lat, lng } object"
  correctIndex: 2
  explanation: GeoJSON specifies `[longitude, latitude]` — reversing the order silently returns wrong results in `$near` and `$geoWithin` queries.
- id: q7
  question: What happens when you index a field that holds arrays?
  options:
    - Error
    - Only the first element is indexed
    - The array is concatenated to a string
    - MongoDB creates a multikey index with one entry per array element
  correctIndex: 3
  explanation: Indexing an array field creates a multikey index automatically; each array element becomes its own index entry, supporting element-level lookups.
- id: q8
  question: "What does `db.products.find({ category: \"books\" }).explain(\"executionStats\")` show if there's NO index on `category`?"
  options:
    - COLLSCAN with totalDocsExamined == collection size
    - IXSCAN with low totalDocsExamined
    - No output
    - An error
  correctIndex: 0
  explanation: Without an index on `category`, MongoDB falls back to a COLLSCAN, examining every document — `totalDocsExamined` will equal the collection size.
- id: q9
  question: Which `$text` feature ranks results by relevance?
  options:
    - "sort({ relevance: 1 })"
    - '{ score: { $meta: "textScore" } } projection + sort by it'
    - $near
    - $elemMatch
  correctIndex: 1
  explanation: 'Project `{ score: { $meta: "textScore" } }` then `.sort({ score: { $meta: "textScore" } })` to order results by text relevance.'
- id: q10
  question: What's a downside of indexing too many fields?
  options:
    - Reads get slower
    - Indexes are immutable
    - Every index slows down writes and consumes RAM (working set)
    - MongoDB limits you to 5 indexes per collection
  correctIndex: 2
  explanation: Each index must be updated on every write and held in the WiredTiger cache; over-indexing hurts write throughput and can blow out the working set. Use `$indexStats` to find unused indexes.
```

