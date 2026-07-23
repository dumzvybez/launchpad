---
slug: postgresql-replication-streaming-logical-failover
id: postgresql-16
track: postgresql
order: 16
title: Replication — Streaming, Logical, Failover
description: Set up streaming (physical) replication for hot standbys, logical replication for selective table sync and cross-version migrations, and understand failover and replication slot retention.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14&t=600s
whyItMatters: Set up streaming (physical) replication for hot standbys, logical replication for selective table sync and cross-version migrations, and understand failover and replication slot retention.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Replication — Streaming, Logical, Failover

## Replication — Streaming, Logical, Failover

### Why It Matters

Set up streaming (physical) replication for hot standbys, logical replication for selective table sync and cross-version migrations, and understand failover and replication slot retention.

Set up streaming (physical) replication for hot standbys, logical replication for selective table sync and cross-version migrations, and understand failover and replication slot retention.

### Prerequisites

- Stage 13: Transactions, Isolation Levels, and MVCC
- Stage 14: Performance — EXPLAIN, ANALYZE, Vacuum, Statistics

### Topics

- Streaming (physical) replication: primary, replica, wal_level = replica
- WAL segments and how they flow from primary to standby
- Synchronous vs asynchronous replication (synchronous_commit, synchronous_standby_names)
- Hot standby: read-only queries on a replica; hot_standby_feedback
- Replication slots: physical and logical; retention and the slot-overflow footgun
- Logical replication: CREATE PUBLICATION / CREATE SUBSCRIPTION; row-level, cross-version
- Failover: promote (pg_ctl promote), failover scripts, Patroni, repmgr
- Split-brain prevention, fencing, and quorum-based failover

### Key Concepts

- Streaming replication ships WAL records from primary to standby; the standby applies them continuously. It's a byte-for-byte physical copy (same PG major version, same architecture).
- Logical replication decodes WAL into logical changes (INSERT/UPDATE/DELETE per table) and replays them on a subscriber; supports cross-version, cross-platform, and selective table replication.
- A replication slot guarantees the primary retains WAL until the standby acknowledges receipt — essential for preventing data loss, but a stalled standby can cause the primary to fill its disk (slot retention footgun).
- `max_replication_slots` must be set; monitor `pg_replication_slots` for `restart_lsn` lag and disable unused slots.
- Hot standby lets you run read-only queries on a replica; `hot_standby_feedback = on` prevents the primary from vacuuming tuples the standby still needs (avoiding replication conflicts).
- Synchronous replication (`synchronous_standby_names = 'FIRST 1 (replica1)'`) waits for at least one standby to ack before committing — zero data loss, but slower commits.
- Failover = promote a standby to primary. Patroni (etcd-based) and repmgr automate this; fencing (STONITH) prevents split-brain.

```sql
-- On the PRIMARY (postgresql.conf):
--   wal_level = replica
--   max_wal_senders = 10
--   max_replication_slots = 10
--   listen_addresses = '*'
-- In pg_hba.conf:
--   host replication replicator 192.168.1.0/24 scram-sha-256

CREATE ROLE replicator LOGIN REPLICATION PASSWORD 'env-secret';

-- Create a physical replication slot:
SELECT pg_create_physical_replication_slot('standby1');

-- On the STANDBY (after pg_basebackup):
--   primary_conninfo = 'host=primary port=5432 user=replicator'
--   primary_slot_name = 'standby1'
--   hot_standby = on
--   hot_standby_feedback = on
-- Start the standby; it connects and begins streaming.
```
Caption: Set up streaming replication

### Common Pitfalls

- Replication slot retention filling the primary's disk — a stalled inactive slot causes the primary to retain WAL forever; monitor `pg_replication_slots.restart_lsn` and drop unused slots.
- Replication conflicts from long-running standby queries — `hot_standby_feedback = on` prevents the primary from vacuuming tuples the standby needs (avoids "canceling statement due to conflict with recovery" errors) at the cost of primary bloat.
- Assuming streaming replication works across major versions — physical replication requires the same major version; use logical replication for major-version upgrades.
- Forgetting to update app connection strings after failover — the new primary is read-write but apps still point at the old primary (now a stale standby); use a VIP, DNS, or a connection pooler with a failover command.
- Split-brain during failover — without fencing (STONITH) or quorum (Patroni+etcd), two nodes can both think they're primary and accept writes; always use a tested HA tool.

### Real-World Applications

- Discord uses streaming replication with Patroni for failover across availability zones for its message store.
- Reddit uses logical replication to feed analytical clusters and to migrate between major PG versions with zero downtime.
- Spotify uses streaming replication with synchronous_commit=remote_apply for zero-data-loss billing writes.
- Apple uses Patroni + etcd for automated failover in iCloud's Postgres backends.

### Interview Questions

- 1. What's the difference between streaming (physical) and logical replication? — Streaming ships WAL bytes (same version, byte-for-byte copy); logical decodes changes per table (cross-version, selective).
- 2. What is a replication slot, and what's its main risk? — It guarantees the primary retains WAL until the standby acks; a stalled inactive slot causes the primary's disk to fill (the slot retention footgun).
- 3. What does hot_standby_feedback do? — Tells the primary not to vacuum tuples the standby still needs, avoiding replication conflicts at the cost of primary bloat.
- 4. When would you use synchronous replication? — When you need zero data loss (e.g. billing); `synchronous_standby_names = 'FIRST 1 (replica1)'` waits for one ack before commit. Tradeoff: slower commits.
- 5. How does failover work? — Promote a standby to primary (pg_ctl promote, or Patroni/repmgr for automation); the new primary takes a timeline bump and accepts writes. Use fencing/quorum to prevent split-brain.

### Mini Project

Build a Two-Node Streaming Replication Setup: Use Docker Compose to run a primary and a standby with streaming replication and a physical replication slot. Verify (1) writes on the primary appear on the standby, (2) the standby is read-only, (3) promoting the standby works, (4) the replication slot's restart_lsn tracks the standby. Suggested approach:
  - Primary postgresql.conf: wal_level=replica, max_wal_senders=10, max_replication_slots=10
  - Create replicator role with REPLICATION
  - pg_basebackup the standby with -R -S standby1 (writes primary_conninfo and creates the slot)
  - INSERT on primary, SELECT on standby (read-only — error on INSERT)
  - pg_ctl promote on standby; verify it accepts writes
  - Monitor with pg_stat_replication and pg_replication_slots

### Exercises

1. Set wal_level=replica, create a replicator role, and use pg_basebackup to seed a standby; verify it's read-only.
2. Create a physical replication slot, stop the standby, and observe retained_bytes grow on the primary; restart the standby and observe it shrink.
3. Create a PUBLICATION for one table on the primary; SUBSCRIBE on a second cluster; verify INSERTs replicate.
4. Promote a standby with pg_ctl promote; verify it accepts writes and the old primary is now stale.
5. Set synchronous_standby_names = 'FIRST 1 (standby1)'; INSERT on the primary; verify it waits for the standby to ack.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between streaming and logical replication?
9. A) They are identical
10. B) Logical is faster
11. C) Streaming is read-only
12. D) Streaming ships WAL bytes (same version, physical); logical decodes changes per table (cross-version, selective) (*)
13. Explanation: Streaming replication is byte-for-byte (same PG major version required); logical replication decodes WAL into per-table INSERT/UPDATE/DELETE, supporting cross-version and selective table sync.
14. Q2: What is the main risk of a replication slot?
15. A) A stalled inactive slot causes the primary to retain WAL forever, filling its disk (*)
16. B) It's slower
17. C) It breaks failover
18. D) It requires superuser
19. Explanation: A slot guarantees WAL retention until the consumer acks; if the consumer is down, WAL accumulates on the primary. Monitor pg_replication_slots and drop unused slots.
20. Q3: What does hot_standby_feedback = on do?
21. A) Speeds up replication
22. B) Tells the primary not to vacuum tuples the standby still needs, avoiding replication conflicts (*)
23. C) Disables the standby
24. D) Enables sync replication
25. Explanation: Without hot_standby_feedback, the primary may vacuum dead tuples the standby needs for a long-running query, causing "canceling statement due to conflict with recovery". The tradeoff is primary bloat.
26. Q4: Which replication type supports cross-major-version upgrades?
27. A) Streaming
28. B) Physical
29. C) Logical (*)
30. D) Both
31. Explanation: Streaming/physical replication requires the same major version (byte-for-byte WAL); logical replication decodes changes into row-level operations, supporting cross-version and cross-platform migrations.
32. Q5: What does synchronous_standby_names = 'FIRST 1 (standby1)' do?
33. A) Limits the standby to 1 connection
34. B) Disables async replication
35. C) Promotes the standby
36. D) Waits for at least one standby (standby1) to ack WAL before committing on the primary (*)
37. Explanation: Synchronous replication waits for ack from at least N standbys before commit; this gives zero data loss at the cost of commit latency. Use for billing/financial writes.
38. Q6: What happens when you `pg_ctl promote` a standby?
39. A) It becomes a read-write primary with a timeline bump (*)
40. B) It shuts down
41. C) It resets to a clean state
42. D) It deletes the WAL
43. Explanation: Promote ends recovery mode, takes a timeline bump (new WAL filename prefix), and begins accepting writes. The old primary becomes stale; update app connection strings or use a VIP/DNS.
44. Q7: How do you monitor replication slot lag?
45. A) pg_stat_activity
46. B) pg_replication_slots — restart_lsn vs pg_current_wal_lsn() (*)
47. C) pg_locks
48. D) EXPLAIN
49. Explanation: pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) shows how many bytes of WAL the primary is retaining for the slot. Growing unbounded for an inactive slot = footgun.
50. Q8: What does CREATE PUBLICATION ... FOR TABLE ... WHERE (...) do?
51. A) Filters rows on the subscriber
52. B) Drops unmatched rows
53. C) Publishes only matching rows (row-level filter; PG13+ allows WHERE in publications) (*)
54. D) Indexes the table
55. Explanation: Row filters in publications let you replicate a subset of rows (e.g. only 'click' events); useful for sharding or per-tenant replication streams.
56. Q9: What's the split-brain problem in failover?
57. A) Two standbys can't agree
58. B) The primary can't be promoted
59. C) WAL is corrupted
60. D) Two nodes both think they're primary and accept writes (*)
61. Explanation: Without fencing (STONITH) or quorum (Patroni+etcd), a network partition can leave two nodes both believing they're primary; both accept writes, diverging. Use a tested HA tool to prevent this.
62. Q10: Which tool automates Postgres failover with etcd-based quorum?
63. A) Patroni (*)
64. B) pgAdmin
65. C) pgBouncer
66. D) pg_dump
67. Explanation: Patroni uses etcd (or Consul/ZooKeeper) for leader election and quorum; it automates failover and prevents split-brain. repmgr is a simpler alternative; stolon is another option.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between streaming and logical replication?
  options:
    - They are identical
    - Logical is faster
    - Streaming is read-only
    - Streaming ships WAL bytes (same version, physical); logical decodes changes per table (cross-version, selective)
  correctIndex: 3
  explanation: Streaming replication is byte-for-byte (same PG major version required); logical replication decodes WAL into per-table INSERT/UPDATE/DELETE, supporting cross-version and selective table sync.
- id: q2
  question: What is the main risk of a replication slot?
  options:
    - A stalled inactive slot causes the primary to retain WAL forever, filling its disk
    - It's slower
    - It breaks failover
    - It requires superuser
  correctIndex: 0
  explanation: A slot guarantees WAL retention until the consumer acks; if the consumer is down, WAL accumulates on the primary. Monitor pg_replication_slots and drop unused slots.
- id: q3
  question: What does hot_standby_feedback = on do?
  options:
    - Speeds up replication
    - Tells the primary not to vacuum tuples the standby still needs, avoiding replication conflicts
    - Disables the standby
    - Enables sync replication
  correctIndex: 1
  explanation: Without hot_standby_feedback, the primary may vacuum dead tuples the standby needs for a long-running query, causing "canceling statement due to conflict with recovery". The tradeoff is primary bloat.
- id: q4
  question: Which replication type supports cross-major-version upgrades?
  options:
    - Streaming
    - Physical
    - Logical
    - Both
    - ; logical replication decodes changes into row-level operations, supporting cross-version and cross-platform migrations.
  correctIndex: 2
  explanation: Streaming/physical replication requires the same major version (byte-for-byte WAL); logical replication decodes changes into row-level operations, supporting cross-version and cross-platform migrations.
- id: q5
  question: What does synchronous_standby_names = 'FIRST 1 (standby1)' do?
  options:
    - Limits the standby to 1 connection
    - Disables async replication
    - Promotes the standby
    - Waits for at least one standby (standby1) to ack WAL before committing on the primary
  correctIndex: 3
  explanation: Synchronous replication waits for ack from at least N standbys before commit; this gives zero data loss at the cost of commit latency. Use for billing/financial writes.
- id: q6
  question: What happens when you `pg_ctl promote` a standby?
  options:
    - It becomes a read-write primary with a timeline bump
    - It shuts down
    - It resets to a clean state
    - It deletes the WAL
  correctIndex: 0
  explanation: Promote ends recovery mode, takes a timeline bump (new WAL filename prefix), and begins accepting writes. The old primary becomes stale; update app connection strings or use a VIP/DNS.
- id: q7
  question: How do you monitor replication slot lag?
  options:
    - pg_stat_activity
    - pg_replication_slots — restart_lsn vs pg_current_wal_lsn()
    - pg_locks
    - EXPLAIN
  correctIndex: 1
  explanation: pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) shows how many bytes of WAL the primary is retaining for the slot. Growing unbounded for an inactive slot = footgun.
- id: q8
  question: What does CREATE PUBLICATION ... FOR TABLE ... WHERE (...) do?
  options:
    - Filters rows on the subscriber
    - Drops unmatched rows
    - Publishes only matching rows (row-level filter; PG13+ allows WHERE in publications)
    - Indexes the table
  correctIndex: 2
  explanation: Row filters in publications let you replicate a subset of rows (e.g. only 'click' events); useful for sharding or per-tenant replication streams.
- id: q9
  question: What's the split-brain problem in failover?
  options:
    - Two standbys can't agree
    - The primary can't be promoted
    - WAL is corrupted
    - Two nodes both think they're primary and accept writes
    - or quorum (Patroni+etcd), a network partition can leave two nodes both believing they're primary; both accept writes, diverging. Use a tested HA tool to prevent this.
  correctIndex: 3
  explanation: Without fencing (STONITH) or quorum (Patroni+etcd), a network partition can leave two nodes both believing they're primary; both accept writes, diverging. Use a tested HA tool to prevent this.
- id: q10
  question: Which tool automates Postgres failover with etcd-based quorum?
  options:
    - Patroni
    - pgAdmin
    - pgBouncer
    - pg_dump
  correctIndex: 0
  explanation: Patroni uses etcd (or Consul/ZooKeeper) for leader election and quorum; it automates failover and prevents split-brain. repmgr is a simpler alternative; stolon is another option.
```

