---
slug: sql-replication-backups-high-availability
id: sql-17
track: sql
order: 17
title: Replication, Backups, and High Availability
description: Keep data safe and available with streaming and logical replication, point-in-time recovery via WAL archiving, and high-availability failover with Patroni — and learn the failure modes that catch teams off guard.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=11100s
whyItMatters: Keep data safe and available with streaming and logical replication, point-in-time recovery via WAL archiving, and high-availability failover with Patroni — and learn the failure modes that catch teams off guard.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Replication, Backups, and High Availability

## Replication, Backups, and High Availability

### Why It Matters

Keep data safe and available with streaming and logical replication, point-in-time recovery via WAL archiving, and high-availability failover with Patroni — and learn the failure modes that catch teams off guard.

Keep data safe and available with streaming and logical replication, point-in-time recovery via WAL archiving, and high-availability failover with Patroni — and learn the failure modes that catch teams off guard.

### Prerequisites

- Stage 16: Performance Tuning — EXPLAIN, Vacuum, Statistics.
- Two Postgres instances (Docker is fine) for replication practice.

### Topics

- Write-Ahead Log (WAL) and how Postgres achieves durability
- Streaming (physical) replication — primary and replica
- Logical replication — publications, subscriptions, table-level
- pg_basebackup for initial replica setup
- WAL archiving with archive_command; PITR with pgBackRest
- pg_dump and pg_restore — logical backups and selective restores
- High availability: Patroni, etcd, haproxy
- Failover, split-brain, and fencing

### Key Concepts

- Every change is written to the WAL before the data file (write-ahead logging); crash recovery replays the WAL on startup.
- Physical (streaming) replication ships WAL bytes; replica is byte-for-byte identical, read-only (or read-write with cascading + logical).
- Logical replication decodes WAL into row-level changes; allows selective table replication and cross-version upgrades.
- WAL archiving lets you restore to any point in time (PITR) by combining a base backup + archived WAL.
- pg_dump is logical (slower, schema-aware, portable); pg_basebackup is physical (faster, byte-identical).
- Patroni + etcd provides automatic failover with quorum; fencing prevents split-brain when network partitions occur.

```bash
# On the primary: create replication role
psql -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'secret';"
echo "host replication replicator 0.0.0.0/0 md5" >> pg_hba.conf

# On the replica: take a base backup and start
pg_basebackup -h primary -U replicator -D /var/lib/postgresql/data -Fp -Xs -P -R
pg_ctl start
```
Caption: Setting up streaming replication

### Common Pitfalls

- No WAL archiving — without archived WAL you can only restore to the time of the last base backup; enable archiving for PITR.
- Replication lag going unnoticed — replicas silently fall behind; alert on lag bytes or seconds.
- Split-brain after failover — without fencing (e.g. STONITH) two primaries can accept writes; use Patroni with quorum.
- Forgetting to add a new table to a publication — logical replication silently stops for that table; use `ALTER PUBLICATION ... ADD TABLE`.
- pg_dump is not a backup strategy alone — large databases take hours; combine with physical base backups + WAL archiving.

### Real-World Applications

- Stripe runs Postgres with Patroni for high availability, with cross-region replicas for disaster recovery.
- Netflix uses logical replication to fan out changes from transactional Postgres to analytics clusters.
- Airbnb runs streaming replication per region with pgBackRest for nightly base backups and continuous WAL archiving.
- Uber moved away from Postgres replication in their Schemaless layer due to lag sensitivity; the original pattern remains canonical elsewhere.

### Interview Questions

- 1. Difference between physical and logical replication? — Physical ships WAL bytes (byte-identical, read-only replica); logical decodes WAL to row-level changes (selective, cross-version).
- 2. What is WAL and why does it matter? — Write-Ahead Log; durability is achieved by flushing WAL before the data file; crash recovery replays WAL.
- 3. How does PITR work? — Restore a base backup, replay archived WAL up to a target timestamp (or LSN).
- 4. Why use Patroni? — Automates failover with leader election via etcd; provides fencing to prevent split-brain.
- 5. Why isn't pg_dump enough? — It's logical and slow for large DBs; combine with physical base backups + WAL archiving for fast, point-in-time recovery.

### Mini Project

Set Up Streaming Replication and PITR: On two Docker Postgres containers, configure primary + replica, take a base backup with pg_basebackup, archive WAL to a shared volume, and verify you can recover to a specific timestamp. Suggested approach:
  - docker-compose with two postgres:16 services and a shared volume
  - On primary: CREATE ROLE replicator, configure pg_hba.conf, archive_mode=on
  - On replica: pg_basebackup with -R, start
  - Insert test data on primary; verify it appears on the replica
  - Stop primary at a known time; restore from base backup + WAL with recovery_target_time

### Exercises

1. Set up a primary + one streaming replica via pg_basebackup; insert on primary, read on replica.
2. Monitor replication lag with pg_stat_replication; kill the replica and watch lag grow.
3. Create a logical publication for one table; subscribe on a second cluster; verify INSERT replicates.
4. Take a pg_dump -Fc backup; restore only one table into a new database.
5. Configure archive_command to copy WAL to /backup/wal; verify files appear.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does WAL stand for in Postgres?
9. A) Write-Ahead Log (*)
10. B) Write-After Log
11. C) Workload Archive Log
12. D) Write-Audit Log
13. Explanation: WAL = Write-Ahead Log; every change is written to WAL before the data file, enabling crash recovery by replaying WAL on startup.
14. Q2: Which replication ships WAL bytes for a byte-identical read-only replica?
15. A) Logical
16. B) Streaming (physical) (*)
17. C) pg_dump
18. D) Slony
19. Explanation: Streaming replication ships WAL bytes; the replica is byte-identical and read-only. Logical replication decodes WAL to row-level changes.
20. Q3: What does logical replication enable that physical doesn't?
21. A) Lower latency
22. B) Smaller WAL
23. C) Cross-version upgrades and per-table selective replication (*)
24. D) Read-only replicas
25. Explanation: Logical replication decodes WAL to row changes; you can publish only specific tables and replicate between different Postgres major versions.
26. Q4: What is PITR?
27. A) Parallel Index Table Recovery
28. B) Primary-In-Transit-Replica
29. C) Postgres Internal Table Replication
30. D) Point-in-Time Recovery — restore to a specific timestamp using a base backup + archived WAL (*)
31. Explanation: PITR combines a base backup with replay of archived WAL up to a recovery_target_time, giving minute-granularity restore.
32. Q5: Which tool automates Postgres failover with leader election?
33. A) Patroni (with etcd for quorum) (*)
34. B) pg_basebackup
35. C) pg_dump
36. D) psql
37. Explanation: Patroni uses etcd (or Consul/ZooKeeper) for leader election and automatic failover; haproxy routes traffic to the leader.
38. Q6: Which command takes a physical base backup?
39. A) pg_dump
40. B) pg_basebackup (*)
41. C) pg_restore
42. D) COPY
43. Explanation: pg_basebackup does a physical byte-identical copy of the data directory (used to seed replicas and PITR base images).
44. Q7: What's a key risk during failover?
45. A) Index bloat
46. B) Replication lag
47. C) Split-brain (two primaries accept writes simultaneously) without fencing (*)
48. D) Statistics staleness
49. Explanation: Without fencing (STONITH) and quorum, network partitions can leave two nodes both acting as primary, causing data loss.
50. Q8: pg_stat_replication shows?
51. A) Backup progress
52. B) Index usage
53. C) Deadlock graphs
54. D) Connected replicas and their replay LSN lag (*)
55. Explanation: On the primary, pg_stat_replication lists each connected replica with state and replay_lsn; compute lag with pg_wal_lsn_diff.
56. Q9: What's a limitation of logical replication?
57. A) Can't replicate sequences, schema changes, or TRUNCATE (without extra config) (*)
58. B) Always slower than physical
59. C) Doesn't support SELECT
60. D) Requires Patroni
61. Explanation: Logical replication is row-level; DDL, sequences, and large objects need extra handling. TRUNCATE is supported since Postgres 11 but must be enabled.
62. Q10: A reasonable backup strategy combines?
63. A) pg_dump nightly only
64. B) Physical base backups + continuous WAL archiving + periodic restore tests (*)
65. C) Replication only
66. D) Manual COPY commands
67. Explanation: Replication isn't a backup; combine periodic base backups with continuous WAL archiving and TEST restores regularly — an untested backup is no backup.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does WAL stand for in Postgres?
  options:
    - Write-Ahead Log
    - Write-After Log
    - Workload Archive Log
    - Write-Audit Log
  correctIndex: 0
  explanation: WAL = Write-Ahead Log; every change is written to WAL before the data file, enabling crash recovery by replaying WAL on startup.
- id: q2
  question: Which replication ships WAL bytes for a byte-identical read-only replica?
  options:
    - Logical
    - Streaming (physical)
    - pg_dump
    - Slony
  correctIndex: 1
  explanation: Streaming replication ships WAL bytes; the replica is byte-identical and read-only. Logical replication decodes WAL to row-level changes.
- id: q3
  question: What does logical replication enable that physical doesn't?
  options:
    - Lower latency
    - Smaller WAL
    - Cross-version upgrades and per-table selective replication
    - Read-only replicas
  correctIndex: 2
  explanation: Logical replication decodes WAL to row changes; you can publish only specific tables and replicate between different Postgres major versions.
- id: q4
  question: What is PITR?
  options:
    - Parallel Index Table Recovery
    - Primary-In-Transit-Replica
    - Postgres Internal Table Replication
    - Point-in-Time Recovery — restore to a specific timestamp using a base backup + archived WAL
  correctIndex: 3
  explanation: PITR combines a base backup with replay of archived WAL up to a recovery_target_time, giving minute-granularity restore.
- id: q5
  question: Which tool automates Postgres failover with leader election?
  options:
    - Patroni (with etcd for quorum)
    - pg_basebackup
    - pg_dump
    - psql
  correctIndex: 0
  explanation: Patroni uses etcd (or Consul/ZooKeeper) for leader election and automatic failover; haproxy routes traffic to the leader.
- id: q6
  question: Which command takes a physical base backup?
  options:
    - pg_dump
    - pg_basebackup
    - pg_restore
    - COPY
  correctIndex: 1
  explanation: pg_basebackup does a physical byte-identical copy of the data directory (used to seed replicas and PITR base images).
- id: q7
  question: What's a key risk during failover?
  options:
    - Index bloat
    - Replication lag
    - Split-brain (two primaries accept writes simultaneously) without fencing
    - Statistics staleness
    - and quorum, network partitions can leave two nodes both acting as primary, causing data loss.
  correctIndex: 2
  explanation: Without fencing (STONITH) and quorum, network partitions can leave two nodes both acting as primary, causing data loss.
- id: q8
  question: pg_stat_replication shows?
  options:
    - Backup progress
    - Index usage
    - Deadlock graphs
    - Connected replicas and their replay LSN lag
  correctIndex: 3
  explanation: On the primary, pg_stat_replication lists each connected replica with state and replay_lsn; compute lag with pg_wal_lsn_diff.
- id: q9
  question: What's a limitation of logical replication?
  options:
    - Can't replicate sequences, schema changes, or TRUNCATE (without extra config)
    - Always slower than physical
    - Doesn't support SELECT
    - Requires Patroni
  correctIndex: 0
  explanation: Logical replication is row-level; DDL, sequences, and large objects need extra handling. TRUNCATE is supported since Postgres 11 but must be enabled.
- id: q10
  question: A reasonable backup strategy combines?
  options:
    - pg_dump nightly only
    - Physical base backups + continuous WAL archiving + periodic restore tests
    - Replication only
    - Manual COPY commands
  correctIndex: 1
  explanation: Replication isn't a backup; combine periodic base backups with continuous WAL archiving and TEST restores regularly — an untested backup is no backup.
```

