---
slug: mongodb-transactions-multi-document-acid
id: mongodb-11
track: mongodb
order: 11
title: Transactions and Multi-Document ACID
description: Use replica-set-backed multi-document transactions with `session.startTransaction()`, handle transient errors with retry logic, and understand isolation and limits.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o
whyItMatters: Use replica-set-backed multi-document transactions with `session. startTransaction()`, handle transient errors with retry logic, and understand isolation and limits.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Transactions and Multi-Document ACID

## Transactions and Multi-Document ACID

### Why It Matters

Use replica-set-backed multi-document transactions with `session. startTransaction()`, handle transient errors with retry logic, and understand isolation and limits.

Use replica-set-backed multi-document transactions with `session.startTransaction()`, handle transient errors with retry logic, and understand isolation and limits.

### Prerequisites

- Stage 3 (CRUD) and Stage 9 (Schema Design).
- A replica set (single-node replica set is fine) — transactions are NOT supported on standalone mongod.

### Topics

- Sessions: `client.startSession()`
- `session.startTransaction()`, `session.commitTransaction()`, `session.abortTransaction()`
- Read/write concern inside transactions: `snapshot` isolation, `"majority"` writes
- TransientTransactionError vs UnknownTransactionCommitResult retry codes
- The retry loop pattern (the only safe way to use transactions)
- 60-second default timeout, 16MB oplog entry limit
- What CAN'T be done in a transaction (creating collections, some index builds)
- Why transactions are a last resort in MongoDB (denormalize first)

### Key Concepts

- MongoDB supports multi-document ACID transactions since 4.0 (replica sets) and 4.2 (sharded clusters).
- Transactions provide SNAPSHOT isolation: reads see a consistent snapshot taken at transaction start; writes are isolated from other transactions.
- Every transaction runs on a session; pass `{ session }` to every CRUD call inside the transaction or it won't be part of it.
- Two error classes need retry: `TransientTransactionError` (retry the whole txn) and `UnknownTransactionCommitResult` (retry only the commit).
- Transactions are expensive in MongoDB (each op is replicated, oplog entry has 16MB limit); prefer schema design that keeps related data in one document.

```javascript
const session = client.startSession()
try {
  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" }
  })

  await db.collection("accounts").updateOne(
    { _id: "a1" }, { $inc: { balance: -100 } }, { session }
  )
  await db.collection("accounts").updateOne(
    { _id: "a2" }, { $inc: { balance:  100 } }, { session }
  )

  await session.commitTransaction()
} catch (err) {
  await session.abortTransaction()
  throw err
} finally {
  await session.endSession()
}
```
Caption: Basic transaction in Node driver

### Common Pitfalls

- Running transactions on a standalone mongod — transactions REQUIRE a replica set (even single-node); start mongod with `--replSet rs0` and run `rs.initiate()`.
- Forgetting `{ session }` on one of the CRUD calls inside a transaction — that op runs OUTSIDE the txn (separate auto-commit), breaking atomicity silently.
- Not implementing the retry loop — `TransientTransactionError` (e.g., write conflict) and `UnknownTransactionCommitResult` (network blip during commit) are EXPECTED in production; retry them.
- Long-running transactions (60s default timeout) holding locks and causing write conflicts — keep transactions short, do non-transactional work outside, and never call out to slow external services inside a txn.
- Hitting the 16MB oplog entry limit by writing too many large documents in one transaction — split into smaller batches or redesign the schema to embed.

### Real-World Applications

- Stripe uses MongoDB transactions for atomic fund movements between held balances and payouts.
- Coinbase uses transactions for atomic ledger entries (debit one wallet, credit another) with snapshot isolation.
- eBay uses transactions for multi-step order placement (reserve inventory + create order + decrement stock).
- Cisco uses transactions sparingly for configuration updates that span multiple device-profile documents.

### Interview Questions

- 1. Since when does MongoDB support multi-document ACID transactions? — 4.0 for replica sets; 4.2 for sharded clusters.
- 2. What isolation level do MongoDB transactions provide? — Snapshot isolation — reads see a consistent snapshot from transaction start; writes are isolated.
- 3. Why do you need a retry loop around transactions? — `TransientTransactionError` (retry the whole txn) and `UnknownTransactionCommitResult` (retry the commit) are expected in production due to conflicts and failovers.
- 4. What's the default transaction timeout? — 60 seconds (`transactionLifetimeLimitSeconds`); longer transactions hold locks and increase conflicts.
- 5. Why are transactions a "last resort" in MongoDB? — Each op is replicated and oplog entries are capped at 16MB; schema design that keeps related data in one document gives atomicity for free without txn overhead.

### Mini Project

Build a Wallet Transfer Service: A Node endpoint `POST /transfer` that atomically moves funds from one account to another using a retry-wrapped transaction. Suggested approach:
  - Start a replica set (single-node is fine for dev) and connect the Node driver
  - Implement the `runTxn(client, fn)` retry loop pattern from this stage
  - Inside the txn, decrement sender balance and increment receiver balance with `{ session }`
  - Check `balance >= amount` inside the txn (snapshot isolation) so concurrent transfers can't overdraw
  - Use `w: "majority"` write concern and log every committed transfer to an audit collection (outside the txn)

### Exercises

1. Convert a standalone mongod to a single-node replica set (`--replSet rs0`, `rs.initiate()`); verify `rs.status()`.
2. Write a two-document `updateOne` transaction in mongosh and commit it; then deliberately abort one to confirm rollback.
3. Implement the retry loop pattern in the Node driver; trigger a `TransientTransactionError` by running two concurrent transactions that touch the same doc.
4. Test the 60-second timeout by `sleep(70)` inside a transaction and observing the abort.
5. >>> QUIZ (Stage 11) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What's required to use multi-document transactions in MongoDB?
8. A) A standalone mongod
9. B) Atlas only
10. C) A replica set (or sharded cluster) (*)
11. D) Enterprise license
12. Explanation: Transactions require a replica set (since 4.0) or sharded cluster (since 4.2); they're not supported on standalone mongod.
13. Q2: What isolation level do MongoDB transactions provide?
14. A) Read uncommitted
15. B) Serializable
16. C) Read committed with row locks
17. D) Snapshot isolation (*)
18. Explanation: MongoDB transactions use snapshot isolation — reads see a consistent snapshot from transaction start, and writes are isolated from other transactions.
19. Q3: What MUST every CRUD call inside a transaction include?
20. A) { session } (*)
21. B) { w: "majority" }
22. C) { upsert: true }
23. D) { explain: true }
24. Explanation: Every CRUD call inside a transaction must receive `{ session }` or it runs outside the txn in its own auto-commit, silently breaking atomicity.
25. Q4: Which error label means "retry the WHOLE transaction"?
26. A) UnknownTransactionCommitResult
27. B) TransientTransactionError (*)
28. C) DuplicateKeyError
29. D) WriteConcernError
30. Explanation: `TransientTransactionError` (e.g., write conflict) means retry the entire txn; `UnknownTransactionCommitResult` means retry only the commit.
31. Q5: What's the default transaction lifetime limit?
32. A) 10 seconds
33. B) 5 minutes
34. C) 60 seconds (*)
35. D) Unlimited
36. Explanation: The default is 60 seconds (`transactionLifetimeLimitSeconds`); longer transactions hold locks and increase conflict rates.
37. Q6: Since which MongoDB version are transactions supported on sharded clusters?
38. A) 4.0
39. B) 4.4
40. C) 5.0
41. D) 4.2 (*)
42. Explanation: Replica-set transactions shipped in 4.0; sharded-cluster transactions in 4.2.
43. Q7: Why are transactions a "last resort" in MongoDB?
44. A) Each op is replicated and oplog entries are capped at 16MB; schema design that keeps related data in one doc gives atomicity for free (*)
45. B) They're deprecated
46. C) They don't work in production
47. D) They require enterprise license
48. Explanation: Transactions carry overhead (replication, oplog size limits); embedding related data in a single document gives single-document atomicity without txn cost.
49. Q8: What happens if you forget `{ session }` on one CRUD call inside a transaction?
50. A) The whole transaction aborts
51. B) That op runs OUTSIDE the transaction in its own auto-commit, silently breaking atomicity (*)
52. C) MongoDB throws immediately
53. D) Nothing changes
54. Explanation: Without `{ session }`, the op is not part of the txn — it commits independently, so a partial commit can leave data inconsistent.
55. Q9: Which is NOT allowed inside a transaction?
56. A) updateOne
57. B) find
58. C) Creating a new collection (in older versions) (*)
59. D) deleteMany
60. Explanation: Pre-4.4 transactions couldn't create collections or indexes; 4.4+ allows creating collections/indexes inside transactions but with restrictions.
61. Q10: What's a safe upper bound for oplog entry size in a transaction?
62. A) 1 MB
63. B) 100 MB
64. C) Unlimited
65. D) 16 MB per oplog entry (*)
66. Explanation: Oplog entries are capped at 16MB; writing too many large documents in one transaction can exceed this and abort the txn.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's required to use multi-document transactions in MongoDB?
  options:
    - A standalone mongod
    - Atlas only
    - A replica set (or sharded cluster)
    - Enterprise license
  correctIndex: 2
  explanation: Transactions require a replica set (since 4.0) or sharded cluster (since 4.2); they're not supported on standalone mongod.
- id: q2
  question: What isolation level do MongoDB transactions provide?
  options:
    - Read uncommitted
    - Serializable
    - Read committed with row locks
    - Snapshot isolation
  correctIndex: 3
  explanation: MongoDB transactions use snapshot isolation — reads see a consistent snapshot from transaction start, and writes are isolated from other transactions.
- id: q3
  question: What MUST every CRUD call inside a transaction include?
  options:
    - "{ session }"
    - '{ w: "majority" }'
    - "{ upsert: true }"
    - "{ explain: true }"
  correctIndex: 0
  explanation: Every CRUD call inside a transaction must receive `{ session }` or it runs outside the txn in its own auto-commit, silently breaking atomicity.
- id: q4
  question: Which error label means "retry the WHOLE transaction"?
  options:
    - UnknownTransactionCommitResult
    - TransientTransactionError
    - DuplicateKeyError
    - WriteConcernError
  correctIndex: 1
  explanation: "`TransientTransactionError` (e.g., write conflict) means retry the entire txn; `UnknownTransactionCommitResult` means retry only the commit."
- id: q5
  question: What's the default transaction lifetime limit?
  options:
    - 10 seconds
    - 5 minutes
    - 60 seconds
    - Unlimited
  correctIndex: 2
  explanation: The default is 60 seconds (`transactionLifetimeLimitSeconds`); longer transactions hold locks and increase conflict rates.
- id: q6
  question: Since which MongoDB version are transactions supported on sharded clusters?
  options:
    - "4.0"
    - "4.4"
    - "5.0"
    - "4.2"
  correctIndex: 3
  explanation: Replica-set transactions shipped in 4.0; sharded-cluster transactions in 4.2.
- id: q7
  question: Why are transactions a "last resort" in MongoDB?
  options:
    - Each op is replicated and oplog entries are capped at 16MB; schema design that keeps related data in one doc gives atomicity for free
    - They're deprecated
    - They don't work in production
    - They require enterprise license
  correctIndex: 0
  explanation: Transactions carry overhead (replication, oplog size limits); embedding related data in a single document gives single-document atomicity without txn cost.
- id: q8
  question: What happens if you forget `{ session }` on one CRUD call inside a transaction?
  options:
    - The whole transaction aborts
    - That op runs OUTSIDE the transaction in its own auto-commit, silently breaking atomicity
    - MongoDB throws immediately
    - Nothing changes
  correctIndex: 1
  explanation: Without `{ session }`, the op is not part of the txn — it commits independently, so a partial commit can leave data inconsistent.
- id: q9
  question: Which is NOT allowed inside a transaction?
  options:
    - updateOne
    - find
    - Creating a new collection (in older versions)
    - deleteMany
  correctIndex: 2
  explanation: Pre-4.4 transactions couldn't create collections or indexes; 4.4+ allows creating collections/indexes inside transactions but with restrictions.
- id: q10
  question: What's a safe upper bound for oplog entry size in a transaction?
  options:
    - 1 MB
    - 100 MB
    - Unlimited
    - 16 MB per oplog entry
  correctIndex: 3
  explanation: Oplog entries are capped at 16MB; writing too many large documents in one transaction can exceed this and abort the txn.
```

