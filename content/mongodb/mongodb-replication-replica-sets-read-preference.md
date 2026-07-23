---
slug: mongodb-replication-replica-sets-read-preference
id: mongodb-12
track: mongodb
order: 12
title: Replication — Replica Sets, Read Preference
description: Run a 3-node replica set, understand primary/secondary roles, elections, and the oplog, and choose the right read preference and write concern for your workload.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=180s
whyItMatters: Run a 3-node replica set, understand primary/secondary roles, elections, and the oplog, and choose the right read preference and write concern for your workload.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Replication — Replica Sets, Read Preference

## Replication — Replica Sets, Read Preference

### Why It Matters

Run a 3-node replica set, understand primary/secondary roles, elections, and the oplog, and choose the right read preference and write concern for your workload.

Run a 3-node replica set, understand primary/secondary roles, elections, and the oplog, and choose the right read preference and write concern for your workload.

### Prerequisites

- Stage 11 (Transactions) — know that transactions require a replica set.
- Comfort starting mongod processes and editing config files.

### Topics

- Replica set members: primary, secondaries, arbiters
- Elections and `priority`, `votes`
- The oplog (`local.oplog.rs`) — capped collection of writes
- Asynchronous replication lag and `rs.printSecondaryReplicationInfo()`
- Write concern: `w: 1`, `w: "majority"`, `w: 3`, `j: true`, `wtimeout`
- Read preference: `primary`, `primaryPreferred`, `secondary`, `secondaryPreferred`, `nearest`
- Read concern: `local`, `majority`, `linearizable`, `available`, `snapshot`
- Failover behavior and client reconnect

### Key Concepts

- A replica set is 3+ mongod instances holding the same data; one is primary (takes writes), others are secondaries (replicate via oplog).
- The oplog is a special capped collection (`local.oplog.rs`) of all writes; secondaries tail it and apply operations in order.
- Write concern `w: "majority"` waits until a majority (ceil(N/2)+1) of members have replicated the write — survives failover without data loss.
- Read preference `secondary` allows reads from secondaries but risks stale reads (replication lag) — use only for analytics/ETL, not user-facing.
- Failover: when the primary dies, secondaries elect a new primary in seconds; clients automatically reconnect and route to the new primary.

```bash
# Start 3 mongod processes with the same replSet name
mongod --replSet rs0 --port 27017 --dbpath /data/rs0-1 --bind_ip_all
mongod --replSet rs0 --port 27018 --dbpath /data/rs0-2 --bind_ip_all
mongod --replSet rs0 --port 27019 --dbpath /data/rs0-3 --bind_ip_all
```
Caption: Initiate a 3-node replica set

### Common Pitfalls

- Using `w: 1` (primary-acknowledged only) for critical writes — a primary failover immediately after ack can lose the write; use `w: "majority", j: true`.
- Reading from secondaries (`secondaryPreferred`) for user-facing pages and being surprised by staleness — replication lag can be seconds; never serve user-critical reads from secondaries.
- Deploying a 2-member replica set — no majority means no failover (1 of 2 isn't a majority); always run 3 voting members or 2 data + 1 arbiter.
- Letting the oplog fill up — secondaries that fall behind the oplog's oldest entry must do an initial sync; size the oplog big enough for expected lag (default is 5% of disk, often too small for high-write workloads).
- Forgetting that `linearizable` read concern reads only from the primary AND confirms the primary is still primary via a majority read — slow but the strongest consistency guarantee.

### Real-World Applications

- Stripe runs MongoDB replica sets across 3 availability zones so a single AZ failure doesn't take down payments.
- Uber runs multi-region replica sets with delayed secondaries for "oops-I-dropped-a-collection" recovery.
- eBay uses `secondaryPreferred` for analytics queries to keep the primary free for buyer-facing traffic.
- Adobe uses arbiters in 2-data-center deployments to get a 3rd vote cheaply.

### Interview Questions

- 1. What's the difference between primary and secondary in a replica set? — Primary takes all writes; secondaries replicate the oplog asynchronously and can serve reads (with caveats).
- 2. What does write concern `w: "majority"` guarantee? — The write has been replicated to a majority of members (and journaled if `j: true`), so it survives primary failover without loss.
- 3. What's the oplog? — A special capped collection (`local.oplog.rs`) of all writes; secondaries tail and apply it in order to replicate.
- 4. Why is `secondaryPreferred` risky for user-facing reads? — Replication lag can be seconds; users may see stale data or even go "back in time" between requests.
- 5. What's an arbiter? — A replica set member that votes in elections but stores no data — useful for getting a 3rd vote in 2-data-center setups without disk cost.

### Mini Project

Run a 3-Node Replica Set Locally and Demonstrate Failover: Start 3 mongod processes, initiate the replica set, insert a write with `w: "majority"`, kill the primary, observe election, and confirm the write is intact on the new primary. Suggested approach:
  - Start 3 mongods on ports 27017/27018/27019 with `--replSet rs0`
  - Connect to 27017 and run `rs.initiate({...})` with all 3 members
  - Wait for `rs.status()` to show one PRIMARY and two SECONDARY
  - Insert `{ _id: "x", n: 1 }` with `{ w: "majority", j: true }`
  - `kill -9` the primary's process; observe election via `rs.status()` on a survivor
  - Connect to the new primary and `find()` the document — confirm it survived

### Exercises

1. Start a 3-node replica set on localhost ports 27017/18/19 and run `rs.status()`.
2. Insert a document with `w: "majority"`; then kill the primary; observe failover and confirm the document is intact on the new primary.
3. Run `rs.printSecondaryReplicationInfo()` and explain what `delayed`/`syncedTo` mean.
4. Set `readPreference: "secondary"` on a `find` and observe different results (insert on primary, read on secondary) until replication catches up.
5. >>> QUIZ (Stage 12) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How many voting members are recommended for a production replica set?
8. A) 1
9. B) 2
10. C) 10
11. D) 3 (odd, to avoid election ties) (*)
12. Explanation: 3 voting members (odd) is the standard — it survives 1 failure while keeping a majority; 2 members can't reach majority on failover.
13. Q2: What does write concern `w: "majority"` guarantee?
14. A) The write has been replicated to a majority of members (*)
15. B) The write is on the primary only
16. C) The write is compressed
17. D) The write is encrypted
18. Explanation: `w: "majority"` waits until a majority of replica set members have replicated the write, so it survives primary failover without data loss.
19. Q3: What is the oplog?
20. A) A log of user queries
21. B) A capped collection (`local.oplog.rs`) of all writes; secondaries tail it to replicate (*)
22. C) The MongoDB slow-query log
23. D) A backup file format
24. Explanation: The oplog is a special capped collection on each replica set member; secondaries tail it and apply operations in order to stay in sync.
25. Q4: Which read preference serves reads from secondaries (with stale-read risk)?
26. A) primary
27. B) primaryPreferred
28. C) secondary / secondaryPreferred (*)
29. D) nearest
30. Explanation: `secondary` (always) and `secondaryPreferred` (when possible) route reads to secondaries, which may be seconds behind the primary — risky for user-facing reads.
31. Q5: What's an arbiter?
32. A) A primary in another region
33. B) A read-only secondary
34. C) A sharded cluster router
35. D) A member that votes in elections but stores no data (*)
36. Explanation: Arbiters vote in elections but hold no data, useful for getting a 3rd vote in 2-data-center deployments without disk cost.
37. Q6: Why is a 2-member replica set problematic?
38. A) No majority is possible on failover (1 of 2 isn't a majority), so no automatic failover (*)
39. B) It can't be initiated
40. C) It requires enterprise license
41. D) It only supports reads
42. Explanation: With 2 members, losing one leaves 1 of 2 — not a majority — so the survivor steps down to secondary and the set becomes read-only.
43. Q7: What's the strongest read concern for consistent reads?
44. A) local
45. B) linearizable (*)
46. C) majority
47. D) available
48. Explanation: `linearizable` reads from the primary and confirms (via a majority read) that the primary is still primary — strongest consistency but slowest.
49. Q8: What does replication lag measure?
50. A) Network latency
51. B) Disk I/O wait
52. C) How far secondaries are behind the primary (*)
53. D) Election duration
54. Explanation: Replication lag is the time difference between a write on the primary and when secondaries have applied it — visible via `rs.printSecondaryReplicationInfo()`.
55. Q9: What happens if a secondary falls behind the oplog's oldest entry?
56. A) It catches up automatically
57. B) It becomes the primary
58. C) Nothing changes
59. D) It must do a full initial sync (resync from scratch) (*)
60. Explanation: If the secondary can't find the next oplog entry (it's been overwritten), it can't catch up incrementally — it must do a full initial sync.
61. Q10: What's a pitfall of `secondaryPreferred` for user-facing pages?
62. A) Replication lag means users may see stale data or go "back in time" between requests (*)
63. B) It requires admin auth
64. C) It only works on sharded clusters
65. D) It can't be combined with write concern
66. Explanation: `secondaryPreferred` can serve stale data because secondaries lag the primary; for user-facing reads, use `primary` (default) to avoid surprising staleness.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many voting members are recommended for a production replica set?
  options:
    - "1"
    - "2"
    - "10"
    - 3 (odd, to avoid election ties)
  correctIndex: 3
  explanation: 3 voting members (odd) is the standard — it survives 1 failure while keeping a majority; 2 members can't reach majority on failover.
- id: q2
  question: 'What does write concern `w: "majority"` guarantee?'
  options:
    - The write has been replicated to a majority of members
    - The write is on the primary only
    - The write is compressed
    - The write is encrypted
  correctIndex: 0
  explanation: '`w: "majority"` waits until a majority of replica set members have replicated the write, so it survives primary failover without data loss.'
- id: q3
  question: What is the oplog?
  options:
    - A log of user queries
    - A capped collection (`local.oplog.rs`) of all writes; secondaries tail it to replicate
    - The MongoDB slow-query log
    - A backup file format
  correctIndex: 1
  explanation: The oplog is a special capped collection on each replica set member; secondaries tail it and apply operations in order to stay in sync.
- id: q4
  question: Which read preference serves reads from secondaries (with stale-read risk)?
  options:
    - primary
    - primaryPreferred
    - secondary / secondaryPreferred
    - nearest
  correctIndex: 2
  explanation: "`secondary` (always) and `secondaryPreferred` (when possible) route reads to secondaries, which may be seconds behind the primary — risky for user-facing reads."
- id: q5
  question: What's an arbiter?
  options:
    - A primary in another region
    - A read-only secondary
    - A sharded cluster router
    - A member that votes in elections but stores no data
  correctIndex: 3
  explanation: Arbiters vote in elections but hold no data, useful for getting a 3rd vote in 2-data-center deployments without disk cost.
- id: q6
  question: Why is a 2-member replica set problematic?
  options:
    - No majority is possible on failover (1 of 2 isn't a majority), so no automatic failover
    - It can't be initiated
    - It requires enterprise license
    - It only supports reads
  correctIndex: 0
  explanation: With 2 members, losing one leaves 1 of 2 — not a majority — so the survivor steps down to secondary and the set becomes read-only.
- id: q7
  question: What's the strongest read concern for consistent reads?
  options:
    - local
    - linearizable
    - majority
    - available
  correctIndex: 1
  explanation: "`linearizable` reads from the primary and confirms (via a majority read) that the primary is still primary — strongest consistency but slowest."
- id: q8
  question: What does replication lag measure?
  options:
    - Network latency
    - Disk I/O wait
    - How far secondaries are behind the primary
    - Election duration
  correctIndex: 2
  explanation: Replication lag is the time difference between a write on the primary and when secondaries have applied it — visible via `rs.printSecondaryReplicationInfo()`.
- id: q9
  question: What happens if a secondary falls behind the oplog's oldest entry?
  options:
    - It catches up automatically
    - It becomes the primary
    - Nothing changes
    - It must do a full initial sync (resync from scratch)
  correctIndex: 3
  explanation: If the secondary can't find the next oplog entry (it's been overwritten), it can't catch up incrementally — it must do a full initial sync.
- id: q10
  question: What's a pitfall of `secondaryPreferred` for user-facing pages?
  options:
    - Replication lag means users may see stale data or go "back in time" between requests
    - It requires admin auth
    - It only works on sharded clusters
    - It can't be combined with write concern
  correctIndex: 0
  explanation: "`secondaryPreferred` can serve stale data because secondaries lag the primary; for user-facing reads, use `primary` (default) to avoid surprising staleness."
```

