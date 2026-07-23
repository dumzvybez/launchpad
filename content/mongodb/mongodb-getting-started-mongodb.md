---
slug: mongodb-getting-started-mongodb
id: mongodb-01
track: mongodb
order: 1
title: Getting Started with MongoDB
description: Install MongoDB 7 and mongosh, run your first insert and find, and understand the database, collection, and document hierarchy plus the JSON-vs-BSON distinction.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A
whyItMatters: Install MongoDB 7 and mongosh, run your first insert and find, and understand the database, collection, and document hierarchy plus the JSON-vs-BSON distinction.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Getting Started with MongoDB

## Getting Started with MongoDB

### Why It Matters

Install MongoDB 7 and mongosh, run your first insert and find, and understand the database, collection, and document hierarchy plus the JSON-vs-BSON distinction.

Install MongoDB 7 and mongosh, run your first insert and find, and understand the database, collection, and document hierarchy plus the JSON-vs-BSON distinction.

### Prerequisites

- None — basic database concepts (tables, rows, queries) are helpful.
- Comfort using a terminal and a code editor.

### Topics

- Installing MongoDB 7 Community Edition locally (or signing up for an Atlas free tier)
- Installing mongosh (the modern Node-based shell, replaces the legacy mongo shell)
- Connecting with `mongosh "mongodb://localhost:27017"`
- Database -> Collection -> Document hierarchy
- The `_id` field and ObjectId basics
- JSON vs BSON (binary JSON, more types than JSON)
- Creating and switching databases with `use`
- `show dbs`, `show collections`, `db.stats()`

### Key Concepts

- MongoDB is a document database: rows become nested documents, tables become collections.
- A document is a JSON-like object stored as BSON (Binary JSON) supporting types like ObjectId, Date, Decimal128, BinData.
- Every document needs a unique `_id`; if omitted, MongoDB auto-generates an ObjectId.
- `use mydb` switches to (and implicitly creates on first write) a database; databases are lazy-created.
- mongosh is a Node.js REPL with full JS, replacing the legacy C++ mongo shell that was removed in MongoDB 6.0.

```javascript
// Start mongosh against a local mongod on default port
mongosh "mongodb://localhost:27017"

// Inside mongosh
show dbs                  // list non-empty databases
use shop                  // switch to (or implicitly create) shop
db                        // prints current db name
show collections
```
Caption: Connect and show dbs

### Common Pitfalls

- Using the legacy `mongo` shell — MongoDB 6.0+ removed it; install `mongosh` instead (Node-based, more features, same connection string).
- Calling `use shop` and expecting `show dbs` to list it — databases and collections are lazy-created; `shop` only appears after you insert a document.
- Treating MongoDB as "schemaless" (no schema at all) — it's really "schema-on-read"; your application still needs a consistent document shape or queries and indexes will silently misbehave.
- Storing money as floating-point `39.99` — use `NumberDecimal("39.99")` (Decimal128) to avoid IEEE-754 rounding errors that accumulate in financial reports.
- Forgetting `_id` uniqueness within a collection — any duplicate `_id` raises E11000; if you supply your own, ensure it's globally unique per collection.

### Real-World Applications

- Uber stores trip and user-preference documents in MongoDB alongside Redis and Schemaless to iterate on flexible schemas during fast product changes.
- eBay's Catalog platform uses MongoDB to store heterogeneous product attributes that don't fit a fixed relational schema.
- Adobe Experience Manager uses MongoDB as a content repository backend for large, deeply nested document trees.
- Coinbase uses MongoDB replica sets and sharding for account data and ledger entries that need fast schema evolution and horizontal scale.

### Interview Questions

- 1. What's the difference between MongoDB and a relational database? — MongoDB stores flexible JSON-like BSON documents in collections; no fixed schema, no JOINs by default, horizontal scaling via sharding.
- 2. What is BSON and why does MongoDB use it? — Binary JSON: more types than JSON (ObjectId, Date, BinData, Decimal128), length-prefixed fields for fast traversal.
- 3. What does an ObjectId contain? — 12 bytes: 4-byte timestamp, 5-byte random value, 3-byte incrementing counter.
- 4. What is mongosh and how does it differ from the old mongo shell? — Node.js-based shell replacing the C++ mongo shell (removed in 6.0); supports modern JS, async/await, and driver-consistent syntax.
- 5. Why is MongoDB called "schemaless" misleading? — It's schema-on-read; the application still needs a consistent shape or queries, indexes, and aggregations silently produce wrong results.

### Mini Project

Build a Personal Library CLI: A Node script that connects to a local MongoDB, lets you add a book (title, author, year, rating), list all books, and find books by author. Suggested approach:
  - Connect with the official `mongodb` Node driver using `MongoClient`
  - Use a `books` collection in a `library` database
  - Implement `add`, `list`, `find-by-author` subcommands via `process.argv`
  - Use `NumberInt` for year and `NumberDecimal` for rating
  - Always close the client with `await client.close()` in a `finally` block

### Exercises

1. Install MongoDB 7 and mongosh; verify with `mongosh --version` and `db.version()` in the shell.
2. Connect to a local instance, run `use testdb`, insert one document with `insertOne`, then confirm `show dbs` now lists `testdb`.
3. Insert 5 documents with various field shapes, then write a `find()` that returns only documents containing a specific tag.
4. Generate 5 ObjectIds and use `getTimestamp()` to confirm they encode creation time, then drop the test database with `db.dropDatabase()`.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does MongoDB store data as?
8. A) BSON documents in collections (*)
9. B) Rows in tables
10. C) Key-value pairs in a hash table
11. D) Graph nodes and edges
12. Explanation: MongoDB groups flexible JSON-like BSON documents into collections, replacing rows-and-tables with documents-and-collections.
13. Q2: Which shell ships with MongoDB 6.0+?
14. A) mongo (C++ shell)
15. B) mongosh (Node-based) (*)
16. C) psql
17. D) isql
18. Explanation: The legacy C++ mongo shell was removed in MongoDB 6.0; the modern Node-based mongosh replaces it.
19. Q3: What happens when you run `use newdb` on a fresh MongoDB instance?
20. A) The database is created immediately and listed in `show dbs`
21. B) An error is raised because the db doesn't exist
22. C) The shell switches context; the db is created lazily on first write (*)
23. D) All collections are auto-created
24. Explanation: Databases (and collections) are lazy-created; `use newdb` only sets context — the db appears in `show dbs` after you insert a document.
25. Q4: How many bytes is an ObjectId?
26. A) 8
27. B) 16
28. C) 24
29. D) 12 (*)
30. Explanation: ObjectId is 12 bytes: 4-byte timestamp, 5-byte random value, 3-byte counter (displayed as 24 hex chars).
31. Q5: Which type should you use to store monetary values in MongoDB?
32. A) NumberDecimal (Decimal128) (*)
33. B) JavaScript Number (double)
34. C) NumberInt (32-bit int)
35. D) String
36. Explanation: Decimal128 (NumberDecimal) avoids IEEE-754 float rounding errors that accumulate in financial calculations.
37. Q6: What is BSON?
38. A) A query language
39. B) Binary JSON with more types than JSON (*)
40. C) A NoSQL competitor to MongoDB
41. D) A backup file format
42. Explanation: BSON is Binary JSON: like JSON but adds ObjectId, Date, BinData, Decimal128, and length-prefixed fields for fast traversal.
43. Q7: Which command lists all non-empty databases?
44. A) list databases
45. B) \l
46. C) show dbs (*)
47. D) db.list()
48. Explanation: `show dbs` lists all databases that have at least one document (lazy-created empty dbs aren't shown).
49. Q8: What is the maximum BSON document size in MongoDB 7?
50. A) 1 MB
51. B) 64 MB
52. C) Unlimited
53. D) 16 MB (*)
54. Explanation: The hard BSON document size limit is 16MB; larger payloads belong in GridFS or external object storage.
55. Q9: What does `db.dropDatabase()` do?
56. A) Drops the current database and all its collections (*)
57. B) Drops the current collection
58. C) Disconnects from the server
59. D) Removes all users but keeps data
60. Explanation: `db.dropDatabase()` permanently deletes the current database and every collection in it; there is no undo (without a backup).
61. Q10: What is "schema-on-read" in MongoDB?
62. A) Schemas are validated at write time only
63. B) Documents aren't validated at write unless you add $jsonSchema validation; readers must interpret shape (*)
64. C) Reads require a schema definition file
65. D) Schemas are loaded from a .json file on every read
66. Explanation: By default MongoDB doesn't enforce a shape at write — that's "schema-on-read"; you can add $jsonSchema validators (Stage 18) to enforce shape at write.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does MongoDB store data as?
  options:
    - BSON documents in collections
    - Rows in tables
    - Key-value pairs in a hash table
    - Graph nodes and edges
  correctIndex: 0
  explanation: MongoDB groups flexible JSON-like BSON documents into collections, replacing rows-and-tables with documents-and-collections.
- id: q2
  question: Which shell ships with MongoDB 6.0+?
  options:
    - mongo (C++ shell)
    - mongosh (Node-based)
    - psql
    - isql
  correctIndex: 1
  explanation: The legacy C++ mongo shell was removed in MongoDB 6.0; the modern Node-based mongosh replaces it.
- id: q3
  question: What happens when you run `use newdb` on a fresh MongoDB instance?
  options:
    - The database is created immediately and listed in `show dbs`
    - An error is raised because the db doesn't exist
    - The shell switches context; the db is created lazily on first write
    - All collections are auto-created
  correctIndex: 2
  explanation: Databases (and collections) are lazy-created; `use newdb` only sets context — the db appears in `show dbs` after you insert a document.
- id: q4
  question: How many bytes is an ObjectId?
  options:
    - "8"
    - "16"
    - "24"
    - "12"
  correctIndex: 3
  explanation: "ObjectId is 12 bytes: 4-byte timestamp, 5-byte random value, 3-byte counter (displayed as 24 hex chars)."
- id: q5
  question: Which type should you use to store monetary values in MongoDB?
  options:
    - NumberDecimal (Decimal128)
    - JavaScript Number (double)
    - NumberInt (32-bit int)
    - String
  correctIndex: 0
  explanation: Decimal128 (NumberDecimal) avoids IEEE-754 float rounding errors that accumulate in financial calculations.
- id: q6
  question: What is BSON?
  options:
    - A query language
    - Binary JSON with more types than JSON
    - A NoSQL competitor to MongoDB
    - A backup file format
  correctIndex: 1
  explanation: "BSON is Binary JSON: like JSON but adds ObjectId, Date, BinData, Decimal128, and length-prefixed fields for fast traversal."
- id: q7
  question: Which command lists all non-empty databases?
  options:
    - list databases
    - \l
    - show dbs
    - db.list()
  correctIndex: 2
  explanation: "`show dbs` lists all databases that have at least one document (lazy-created empty dbs aren't shown)."
- id: q8
  question: What is the maximum BSON document size in MongoDB 7?
  options:
    - 1 MB
    - 64 MB
    - Unlimited
    - 16 MB
  correctIndex: 3
  explanation: The hard BSON document size limit is 16MB; larger payloads belong in GridFS or external object storage.
- id: q9
  question: What does `db.dropDatabase()` do?
  options:
    - Drops the current database and all its collections
    - Drops the current collection
    - Disconnects from the server
    - Removes all users but keeps data
  correctIndex: 0
  explanation: "`db.dropDatabase()` permanently deletes the current database and every collection in it; there is no undo (without a backup)."
- id: q10
  question: What is "schema-on-read" in MongoDB?
  options:
    - Schemas are validated at write time only
    - Documents aren't validated at write unless you add $jsonSchema validation; readers must interpret shape
    - Reads require a schema definition file
    - Schemas are loaded from a .json file on every read
  correctIndex: 1
  explanation: By default MongoDB doesn't enforce a shape at write — that's "schema-on-read"; you can add $jsonSchema validators (Stage 18) to enforce shape at write.
```

