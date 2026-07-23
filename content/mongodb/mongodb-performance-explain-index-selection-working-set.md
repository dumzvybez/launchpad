---
slug: mongodb-performance-explain-index-selection-working-set
id: mongodb-14
track: mongodb
order: 14
title: Performance — explain(), Index Selection, Working Set
description: Read `explain()` output, fix COLLSCANs, build covered queries, and tune WiredTiger cache vs working-set size.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=540s
whyItMatters: Read `explain()` output, fix COLLSCANs, build covered queries, and tune WiredTiger cache vs working-set size.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Performance — explain(), Index Selection, Working Set

## Performance — explain(), Index Selection, Working Set

### Why It Matters

Read `explain()` output, fix COLLSCANs, build covered queries, and tune WiredTiger cache vs working-set size.

Read `explain()` output, fix COLLSCANs, build covered queries, and tune WiredTiger cache vs working-set size.

### Prerequisites

- Stage 6 (Indexes) and Stage 13 (Sharding).
- Comfort reading JSON explain plans.

### Topics

- `explain("queryPlanner")` vs `"executionStats"` vs `"allPlansExecution"`
- Reading `winningPlan`: `IXSCAN`, `COLLSCAN`, `FETCH`, `SORT`, `LIMIT`
- `totalKeysExamined`, `totalDocsExamined`, `nReturned`, `executionTimeMillis`
- Covered queries (index answers everything; no FETCH stage)
- ESR rule recap and selecting the right index
- Working set vs WiredTiger cache (default 50% of RAM)
- `db.serverStatus()`, `db.collection.stats()`, `$indexStats`
- Common fixes: add index, fix sort, project hot fields, denormalize

### Key Concepts

- A good query examines FEW keys/docs relative to results returned: aim for `totalKeysExamined ≈ nReturned` and `totalDocsExamined <= nReturned * small_constant`.
- A covered query has no FETCH stage — the index alone satisfies filter + sort + projection.
- The working set is the set of documents + indexes the workload touches frequently; if it fits in the WiredTiger cache (~50% of RAM), performance is stable; if not, the cache evicts and disk I/O spikes.
- `explain("allPlansExecution")` shows stats for ALL candidate plans the planner considered, not just the winner — useful when the planner picks the wrong index.
- `$indexStats` reveals which indexes are unused (low `accesses.opcount`) and can be dropped to save write cost.

```javascript
const plan = db.orders.find({
  status: "shipped",
  createdAt: { $gte: ISODate("2024-01-01") }
}).sort({ createdAt: -1 }).explain("executionStats")

print("stage:",        plan.executionStats.executionStages.stage)  // e.g. "LIMIT"
print("keys examined:", plan.executionStats.totalKeysExamined)
print("docs examined:", plan.executionStats.totalDocsExamined)
print("returned:",      plan.executionStats.nReturned)
print("time (ms):",     plan.executionStats.executionTimeMillis)
```
Caption: explain executionStats

### Common Pitfalls

- Trusting `queryPlanner` explain alone — it only shows the chosen plan, not whether it's good; always use `executionStats` to see `totalDocsExamined`.
- Letting the working set exceed the WiredTiger cache — once hot data doesn't fit in ~50% of RAM, every read may go to disk; either add RAM, increase `cacheSizeGB`, or shrink the working set with TTLs.
- Adding indexes that nobody uses — every index slows writes; check `$indexStats` periodically and drop unused indexes.
- Forgetting that `$or` and `$in` on a non-leading field of a compound index can't use it efficiently — the index must lead with the equality field.
- Ignoring `SORT` stage in explain — an in-memory sort on >32MB fails; create a compound index covering filter + sort to make it IXSCAN-only.

### Real-World Applications

- Stripe uses `explain()` regression tests in CI to catch queries that regress to COLLSCAN after schema changes.
- eBay uses `$indexStats` to find and drop unused indexes, saving write throughput and RAM.
- Uber tunes WiredTiger cache size per shard based on working-set measurements from `serverStatus`.
- Adobe uses covered queries for high-QPS dashboard endpoints to avoid document fetches.

### Interview Questions

- 1. What's the ideal ratio of `totalKeysExamined` to `nReturned`? — Close to 1:1; high ratios mean the index is fetching many keys to return few results (low selectivity).
- 2. What's a covered query? — One where the index alone satisfies filter + sort + projection — no FETCH stage, no document read.
- 3. What's the WiredTiger cache default and why does it matter? — 50% of RAM; if the working set fits in it, performance is stable; if not, evictions cause disk I/O.
- 4. How does `$indexStats` help? — It reports per-index access counts so you can find and drop unused indexes that slow writes.
- 5. Why use `allPlansExecution` over `executionStats`? — It runs all candidate plans, showing why the planner chose the winner — useful when the planner picks the wrong index.

### Mini Project

Build a Query-Performance Auditor: A Node script that loads 50 representative queries from a YAML file, runs each with `.explain("executionStats")`, and reports any query where `totalDocsExamined > 10 * nReturned`. Suggested approach:
  - Define queries in `queries.yaml` with name, collection, filter, projection, sort
  - For each, run `db.collection.find(...).explain("executionStats")`
  - Extract `totalKeysExamined`, `totalDocsExamined`, `nReturned`, `executionTimeMillis`
  - Flag queries where `totalDocsExamined > 10 * nReturned` OR a `COLLSCAN` stage is present
  - Output a markdown table sorted by execution time, with a "suggested index" column based on the filter+sort fields

### Exercises

1. Run `explain("executionStats")` on an unindexed query; note `COLLSCAN` and `totalDocsExamined == collection size`.
2. Add a covering index and re-run; verify the `FETCH` stage is gone (covered query).
3. Run `$indexStats` on a collection and identify any index with 0 accesses; drop it.
4. Inspect `db.serverStatus().wiredTiger.cache` and compute what % of the cache your working set occupies.
5. >>> QUIZ (Stage 14) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which `explain()` mode actually runs the query and reports docs examined?
8. A) explain("queryPlanner")
9. B) explain("executionStats") (*)
10. C) explain("allPlans")
11. D) explain() with no args
12. Explanation: `executionStats` runs the query and reports `totalDocsExamined`, `totalKeysExamined`, `nReturned`, and `executionTimeMillis` — needed to judge real performance.
13. Q2: What does a COLLSCAN stage in the winning plan indicate?
14. A) A covered query
15. B) The query used a compound index
16. C) The query scanned every document in the collection (no useful index) (*)
17. D) The query is cached
18. Explanation: COLLSCAN = Collection Scan — the filter couldn't use any index, so MongoDB examined every document; add an index for any non-trivial collection.
19. Q3: What's a covered query?
20. A) One that uses a compound index
21. B) One that returns all fields
22. C) One that runs in a transaction
23. D) One where the index alone satisfies filter + sort + projection — no FETCH stage (*)
24. Explanation: A covered query is answered entirely from the index (filter, sort, and projection all use index fields), so MongoDB skips the FETCH stage — much faster.
25. Q4: What's the default WiredTiger cache size?
26. A) 50% of RAM (or 256MB-512MB on small machines) (*)
27. B) 25% of RAM
28. C) 75% of RAM
29. D) 100% of RAM
30. Explanation: Default is `max(50% of RAM, 256MB)` (with adjustments for small hosts); the working set should fit in this cache for stable performance.
31. Q5: What does `$indexStats` reveal?
32. A) Index sizes only
33. B) Per-index access counts so you can drop unused indexes (*)
34. C) Query plans
35. D) Cache hit ratios
36. Explanation: `$indexStats` reports `accesses.opcount` per index — indexes with 0 accesses over time are candidates for dropping to save write cost and RAM.
37. Q6: Ideal ratio of `totalKeysExamined` to `nReturned` is:
38. A) 1000:1
39. B) 0:1
40. C) Close to 1:1 (*)
41. D) Doesn't matter
42. Explanation: When the index is selective, `totalKeysExamined` is close to `nReturned`; high ratios mean low selectivity — many keys fetched to return few results.
43. Q7: What's the per-stage memory limit for an in-memory SORT in `find()`?
44. A) 16 MB
45. B) 100 MB
46. C) 1 GB
47. D) 32 MB (*)
48. Explanation: In-memory sorts have a 32MB limit; exceed it and the query errors. Create a compound index covering filter + sort to avoid in-memory sort entirely.
49. Q8: Why use `allPlansExecution` instead of `executionStats`?
50. A) It runs all candidate plans to show why the planner picked the winner (*)
51. B) It's faster
52. C) It's the only mode that works in transactions
53. D) It uses less memory
54. Explanation: `allPlansExecution` runs ALL candidate plans, exposing their stats — useful when the planner picks a suboptimal index and you want to see what else was considered.
55. Q9: What happens when the working set exceeds the WiredTiger cache?
56. A) Nothing — MongoDB handles it automatically
57. B) Cache evictions cause disk I/O spikes and inconsistent latency (*)
58. C) MongoDB crashes
59. D) Reads return stale data
60. Explanation: Once hot data doesn't fit, the cache constantly evicts and re-reads from disk, killing latency; fix by adding RAM, raising `cacheSizeGB`, or shrinking the working set with TTLs.
61. Q10: Which is a safe performance fix?
62. A) Add indexes on every field "just in case"
63. B) Disable the journal
64. C) Drop unused indexes found via $indexStats, add covering indexes for hot queries (*)
65. D) Set cacheSizeGB to 100% of RAM
66. Explanation: Targeted index management (drop unused, add covering) improves performance; over-indexing slows writes, and setting cache to 100% starves the OS.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which `explain()` mode actually runs the query and reports docs examined?
  options:
    - explain("queryPlanner")
    - explain("executionStats")
    - explain("allPlans")
    - explain() with no args
  correctIndex: 1
  explanation: "`executionStats` runs the query and reports `totalDocsExamined`, `totalKeysExamined`, `nReturned`, and `executionTimeMillis` — needed to judge real performance."
- id: q2
  question: What does a COLLSCAN stage in the winning plan indicate?
  options:
    - A covered query
    - The query used a compound index
    - The query scanned every document in the collection (no useful index)
    - The query is cached
  correctIndex: 2
  explanation: COLLSCAN = Collection Scan — the filter couldn't use any index, so MongoDB examined every document; add an index for any non-trivial collection.
- id: q3
  question: What's a covered query?
  options:
    - One that uses a compound index
    - One that returns all fields
    - One that runs in a transaction
    - One where the index alone satisfies filter + sort + projection — no FETCH stage
  correctIndex: 3
  explanation: A covered query is answered entirely from the index (filter, sort, and projection all use index fields), so MongoDB skips the FETCH stage — much faster.
- id: q4
  question: What's the default WiredTiger cache size?
  options:
    - 50% of RAM (or 256MB-512MB on small machines)
    - 25% of RAM
    - 75% of RAM
    - 100% of RAM
    - "` (with adjustments for small hosts); the working set should fit in this cache for stable performance."
  correctIndex: 0
  explanation: Default is `max(50% of RAM, 256MB)` (with adjustments for small hosts); the working set should fit in this cache for stable performance.
- id: q5
  question: What does `$indexStats` reveal?
  options:
    - Index sizes only
    - Per-index access counts so you can drop unused indexes
    - Query plans
    - Cache hit ratios
  correctIndex: 1
  explanation: "`$indexStats` reports `accesses.opcount` per index — indexes with 0 accesses over time are candidates for dropping to save write cost and RAM."
- id: q6
  question: "Ideal ratio of `totalKeysExamined` to `nReturned` is:"
  options:
    - 1000:1
    - 0:1
    - Close to 1:1
    - Doesn't matter
  correctIndex: 2
  explanation: When the index is selective, `totalKeysExamined` is close to `nReturned`; high ratios mean low selectivity — many keys fetched to return few results.
- id: q7
  question: What's the per-stage memory limit for an in-memory SORT in `find()`?
  options:
    - 16 MB
    - 100 MB
    - 1 GB
    - 32 MB
  correctIndex: 3
  explanation: In-memory sorts have a 32MB limit; exceed it and the query errors. Create a compound index covering filter + sort to avoid in-memory sort entirely.
- id: q8
  question: Why use `allPlansExecution` instead of `executionStats`?
  options:
    - It runs all candidate plans to show why the planner picked the winner
    - It's faster
    - It's the only mode that works in transactions
    - It uses less memory
  correctIndex: 0
  explanation: "`allPlansExecution` runs ALL candidate plans, exposing their stats — useful when the planner picks a suboptimal index and you want to see what else was considered."
- id: q9
  question: What happens when the working set exceeds the WiredTiger cache?
  options:
    - Nothing — MongoDB handles it automatically
    - Cache evictions cause disk I/O spikes and inconsistent latency
    - MongoDB crashes
    - Reads return stale data
  correctIndex: 1
  explanation: Once hot data doesn't fit, the cache constantly evicts and re-reads from disk, killing latency; fix by adding RAM, raising `cacheSizeGB`, or shrinking the working set with TTLs.
- id: q10
  question: Which is a safe performance fix?
  options:
    - Add indexes on every field "just in case"
    - Disable the journal
    - Drop unused indexes found via $indexStats, add covering indexes for hot queries
    - Set cacheSizeGB to 100% of RAM
  correctIndex: 2
  explanation: Targeted index management (drop unused, add covering) improves performance; over-indexing slows writes, and setting cache to 100% starves the OS.
```

