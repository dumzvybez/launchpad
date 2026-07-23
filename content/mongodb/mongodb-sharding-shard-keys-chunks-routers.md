---
slug: mongodb-sharding-shard-keys-chunks-routers
id: mongodb-13
track: mongodb
order: 13
title: Sharding — Shard Keys, Chunks, Routers
description: Scale horizontally by sharding a collection, choose shard keys that distribute load evenly, and understand chunks, balancer, and the role of `mongos`.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=360s
whyItMatters: Scale horizontally by sharding a collection, choose shard keys that distribute load evenly, and understand chunks, balancer, and the role of `mongos`.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Sharding — Shard Keys, Chunks, Routers

## Sharding — Shard Keys, Chunks, Routers

### Why It Matters

Scale horizontally by sharding a collection, choose shard keys that distribute load evenly, and understand chunks, balancer, and the role of `mongos`.

Scale horizontally by sharding a collection, choose shard keys that distribute load evenly, and understand chunks, balancer, and the role of `mongos`.

### Prerequisites

- Stage 12 (Replication — sharded clusters are replica sets of replica sets).
- Comfort with indexes and the `_id` field.

### Topics

- Sharded cluster components: `mongos` router, config servers (CSRS), shard replica sets
- Enabling sharding: `sh.enableSharding(db)` and `sh.shardCollection(ns, key)`
- Shard key types: ranged, hashed, compound
- Chunks (default 128MB) and the balancer
- Ranged shard keys and hot sharding on monotonic keys
- Hashed shard keys for even write distribution
- The "scatter-gather" cost of queries without the shard key
- Shard key immutability and the reshardCollection command (5.0+)

### Key Concepts

- Sharding distributes a collection's documents across N shards, each a replica set, allowing horizontal scale beyond one machine.
- The shard key determines where each document lives; queries that include the shard key route to one shard (targeted), queries without it hit ALL shards (scatter-gather, slow).
- Monotonic shard keys (timestamps, ObjectIds) cause all writes to land on one shard (the "hot shard"); use hashed shard keys to spread writes.
- Chunks are logical ranges of shard-key values; the balancer migrates chunks between shards to keep them even.
- Shard keys are IMMUTABLE in 4.4 and earlier; 5.0+ allows `reshardCollection` to change the key online.

```bash
# 1 config server replica set (CSRS), 2 shard replica sets, 1 mongos
mongod --configsvr --replSet cfg --port 27019 --dbpath /data/cfg
mongod --shardsvr --replSet s1   --port 27020 --dbpath /data/s1
mongod --shardsvr --replSet s2   --port 27021 --dbpath /data/s2
mongos --configdb cfg/localhost:27019 --port 27017
```
Caption: Deploy a sharded cluster (conceptual)

### Common Pitfalls

- Choosing a monotonic shard key (timestamp, ObjectId) with ranged sharding — all writes hit the "hot shard"; pick a hashed key or a high-cardinality compound key.
- Picking a low-cardinality shard key (e.g., `status: "active"`) — only a few chunks exist, so you can't split across many shards; pick a key with high cardinality.
- Forgetting to include the shard key in hot queries — scatter-gather hits every shard and limits horizontal scale; design queries to include the shard key.
- Using a shard key that grows with the workload (e.g., `customerId`) without a secondary differentiator — single large customers create jumbo chunks; add `_id` to the compound key.
- Trying to change the shard key pre-5.0 — it required dumping and re-importing the collection; 5.0+ supports `reshardCollection` but it's still expensive.

### Real-World Applications

- Uber shards trip data by `trip_id` (hashed) across dozens of shards to handle millions of trips per day.
- eBay shards product listings by category + listing ID to balance query locality with write distribution.
- Adobe shards Experience Manager content by tenant ID so each tenant's data lives on a subset of shards (no noisy-neighbor cross-talk).
- Stripe shards customer data by `customer_id` (hashed) for write throughput isolation across regions.

### Interview Questions

- 1. What's a sharded cluster's components? — `mongos` routers (clients connect), config servers (CSRS, store metadata), shard replica sets (store data).
- 2. What's the difference between ranged and hashed shard keys? — Ranged supports efficient range queries but causes hot shards on monotonic keys; hashed spreads writes evenly but loses range locality.
- 3. What's a targeted vs scatter-gather query? — Targeted includes the shard key and hits one shard; scatter-gather lacks the shard key and hits all shards (slow).
- 4. Why does a monotonic shard key cause hot sharding? — Each new max key writes to the chunk currently holding the max, which lives on one shard; the balancer can't move chunks fast enough.
- 5. How do you change a shard key? — Pre-5.0: dump/re-import. 5.0+: `reshardCollection` online (still expensive and blocks some operations).

### Mini Project

Shard a Logs Collection by Hashed _id: Deploy a 2-shard cluster locally (or use a sharded Atlas tier), shard `logs.events` by `_id: "hashed"`, and compare targeted vs scatter-gather query latency. Suggested approach:
  - Set up config server + 2 shard replica sets + 1 `mongos` (or use Atlas sharded tier)
  - Create a unique hashed index on `_id` and run `sh.shardCollection("logs.events", { _id: "hashed" })`
  - Insert 1M events with random ObjectIds
  - Run `sh.status()` to confirm chunks are balanced across both shards
  - Benchmark `find({ _id: <id> })` (targeted) vs `find({ level: "error" })` (scatter-gather) — measure latency difference

### Exercises

1. Deploy a 2-shard cluster on localhost and run `sh.status()` to see the topology.
2. Shard a `logs` collection by `_id: "hashed"` and insert 100k documents; verify chunks are split across shards.
3. Run a targeted query (with `_id`) and a scatter-gather query (without); compare `explain()`'s `nShards` field.
4. Pick a bad shard key (e.g., `status`) and observe that chunks can't split further due to low cardinality.
5. >>> QUIZ (Stage 13) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which component do clients connect to in a sharded cluster?
8. A) mongos (the router) (*)
9. B) The config server directly
10. C) A shard's primary
11. D) The balancer
12. Explanation: Clients connect to `mongos`, which routes queries to the right shards based on the shard key and metadata from the config servers.
13. Q2: Why is a monotonic shard key (e.g., ObjectId) bad for ranged sharding?
14. A) It's not unique
15. B) All new writes go to one "hot shard" holding the current max chunk (*)
16. C) It can't be indexed
17. D) It requires enterprise license
18. Explanation: Monotonic keys always insert at the right edge of the key space, so all writes hit the chunk currently holding the max — the balancer can't migrate chunks fast enough.
19. Q3: Which shard key type spreads writes evenly across shards?
20. A) Ranged on ObjectId
21. B) Ranged on timestamp
22. C) Hashed (*)
23. D) Single-value low-cardinality key
24. Explanation: Hashed shard keys hash the value, distributing writes evenly across shards; the trade-off is losing range-query locality on the original value.
25. Q4: What's a scatter-gather query?
26. A) A query that includes the shard key
27. B) A query that uses $lookup
28. C) A query that runs in a transaction
29. D) A query without the shard key, hitting all shards (*)
30. Explanation: Queries without the shard key can't be routed, so mongos forwards them to every shard and merges results — slower and limits horizontal scaling.
31. Q5: Which is required before `sh.shardCollection` with a unique constraint?
32. A) A unique index on the shard key prefix (*)
33. B) A compound index on every field
34. C) Disabling the balancer
35. D) Atlas enterprise tier
36. Explanation: For unique shard keys, you must already have a unique index on the shard key prefix (or the shard key itself for hashed) before sharding the collection.
37. Q6: What does the balancer do?
38. A) Balances read load across secondaries
39. B) Migrates chunks between shards to keep them even (*)
40. C) Balances the oplog
41. D) Schedules elections
42. Explanation: The balancer runs periodically (default on) and migrates chunks between shards so that no shard has many more chunks than the others.
43. Q7: Default chunk size in MongoDB 7 is approximately:
44. A) 1 MB
45. B) 1 GB
46. C) 128 MB (*)
47. D) 16 MB
48. Explanation: Default max chunk size is 128MB (configurable); when a chunk exceeds this, MongoDB splits it, and the balancer migrates chunks to even out shards.
49. Q8: How do you change a shard key in MongoDB 5.0+?
50. A) You can't
51. B) Drop and recreate the collection
52. C) Edit the config server manually
53. D) reshardCollection (online resharding) (*)
54. Explanation: 5.0 introduced `reshardCollection` for online shard-key changes; pre-5.0 required dumping and re-importing the collection.
55. Q9: What's a "jumbo chunk"?
56. A) A chunk that can't be split (shard key cardinality exhausted) or migrated (too big) (*)
57. B) A chunk bigger than 16MB
58. C) A chunk on the hot shard
59. D) A chunk in the config server
60. Explanation: Jumbo chunks exceed the max size but can't be split (e.g., all docs share the same shard key value) — they cause imbalance and need manual intervention or `clearJumboFlag`.
61. Q10: What's a low-cardinality shard key problem?
62. A) It's hard to index
63. B) Only a few chunks exist, so you can't split across many shards (*)
64. C) It requires more indexes
65. D) It can't be hashed
66. Explanation: Low-cardinality keys (e.g., `status: "active"`) produce only a few distinct chunks, capping how many shards the collection can use; pick a high-cardinality key.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which component do clients connect to in a sharded cluster?
  options:
    - mongos (the router)
    - The config server directly
    - A shard's primary
    - The balancer
  correctIndex: 0
  explanation: Clients connect to `mongos`, which routes queries to the right shards based on the shard key and metadata from the config servers.
- id: q2
  question: Why is a monotonic shard key (e.g., ObjectId) bad for ranged sharding?
  options:
    - It's not unique
    - All new writes go to one "hot shard" holding the current max chunk
    - It can't be indexed
    - It requires enterprise license
  correctIndex: 1
  explanation: Monotonic keys always insert at the right edge of the key space, so all writes hit the chunk currently holding the max — the balancer can't migrate chunks fast enough.
- id: q3
  question: Which shard key type spreads writes evenly across shards?
  options:
    - Ranged on ObjectId
    - Ranged on timestamp
    - Hashed
    - Single-value low-cardinality key
  correctIndex: 2
  explanation: Hashed shard keys hash the value, distributing writes evenly across shards; the trade-off is losing range-query locality on the original value.
- id: q4
  question: What's a scatter-gather query?
  options:
    - A query that includes the shard key
    - A query that uses $lookup
    - A query that runs in a transaction
    - A query without the shard key, hitting all shards
  correctIndex: 3
  explanation: Queries without the shard key can't be routed, so mongos forwards them to every shard and merges results — slower and limits horizontal scaling.
- id: q5
  question: Which is required before `sh.shardCollection` with a unique constraint?
  options:
    - A unique index on the shard key prefix
    - A compound index on every field
    - Disabling the balancer
    - Atlas enterprise tier
  correctIndex: 0
  explanation: For unique shard keys, you must already have a unique index on the shard key prefix (or the shard key itself for hashed) before sharding the collection.
- id: q6
  question: What does the balancer do?
  options:
    - Balances read load across secondaries
    - Migrates chunks between shards to keep them even
    - Balances the oplog
    - Schedules elections
  correctIndex: 1
  explanation: The balancer runs periodically (default on) and migrates chunks between shards so that no shard has many more chunks than the others.
- id: q7
  question: "Default chunk size in MongoDB 7 is approximately:"
  options:
    - 1 MB
    - 1 GB
    - 128 MB
    - 16 MB
  correctIndex: 2
  explanation: Default max chunk size is 128MB (configurable); when a chunk exceeds this, MongoDB splits it, and the balancer migrates chunks to even out shards.
- id: q8
  question: How do you change a shard key in MongoDB 5.0+?
  options:
    - You can't
    - Drop and recreate the collection
    - Edit the config server manually
    - reshardCollection (online resharding)
  correctIndex: 3
  explanation: 5.0 introduced `reshardCollection` for online shard-key changes; pre-5.0 required dumping and re-importing the collection.
- id: q9
  question: What's a "jumbo chunk"?
  options:
    - A chunk that can't be split (shard key cardinality exhausted) or migrated (too big)
    - A chunk bigger than 16MB
    - A chunk on the hot shard
    - A chunk in the config server
  correctIndex: 0
  explanation: Jumbo chunks exceed the max size but can't be split (e.g., all docs share the same shard key value) — they cause imbalance and need manual intervention or `clearJumboFlag`.
- id: q10
  question: What's a low-cardinality shard key problem?
  options:
    - It's hard to index
    - Only a few chunks exist, so you can't split across many shards
    - It requires more indexes
    - It can't be hashed
  correctIndex: 1
  explanation: 'Low-cardinality keys (e.g., `status: "active"`) produce only a few distinct chunks, capping how many shards the collection can use; pick a high-cardinality key.'
```

