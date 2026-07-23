---
slug: postgresql-backup-recovery-pg-dump-pg-basebackup-pitr
id: postgresql-17
track: postgresql
order: 17
title: Backup and Recovery — pg_dump, pg_basebackup, PITR
description: Choose the right backup strategy (logical vs physical, full vs incremental), implement point-in-time recovery (PITR) via WAL archiving, and test restore drills.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14&t=1200s
whyItMatters: Choose the right backup strategy (logical vs physical, full vs incremental), implement point-in-time recovery (PITR) via WAL archiving, and test restore drills.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Backup and Recovery — pg_dump, pg_basebackup, PITR

## Backup and Recovery — pg_dump, pg_basebackup, PITR

### Why It Matters

Choose the right backup strategy (logical vs physical, full vs incremental), implement point-in-time recovery (PITR) via WAL archiving, and test restore drills.

Choose the right backup strategy (logical vs physical, full vs incremental), implement point-in-time recovery (PITR) via WAL archiving, and test restore drills.

### Prerequisites

- Stage 16: Replication — Streaming, Logical, Failover
- Stage 2: psql, createdb, and Database Administration Basics

### Topics

- pg_dump (logical, per-database, portable, slow on large DBs)
- pg_dumpall (cluster-wide roles and globals)
- pg_basebackup (physical, full cluster, base for PITR)
- WAL archiving (archive_command, archive_mode = on, wal_level = replica)
- PITR: restore base backup, replay WAL to a target time/xid/lsn
- pgBackRest and Barman for managed backups with incremental and retention
- Continuous WAL archiving vs periodic full backups
- Restore testing: monthly drills, RTO/RPO targets

### Key Concepts

- pg_dump produces a logical SQL dump (or custom-format binary) — portable across versions but slow to restore on large DBs (it replays every INSERT).
- pg_basebackup produces a physical copy of the cluster's data directory — fast to restore (just copy back) but tied to the PG major version.
- PITR (Point-in-Time Recovery) combines a base backup with archived WAL: restore the base, then replay WAL up to a target time/xid/lsn, then stop.
- `archive_command` ships completed WAL segments to durable storage (S3, GCS, NFS); if it returns non-zero, the primary retains the segment (disk fill risk — same as replication slots).
- pgBackRest and Barman add incremental backups, retention policies, compression, and parallelism — essential for terabyte-scale databases.
- An untested backup is not a backup — run quarterly restore drills to a staging cluster and verify row counts; document RTO (recovery time objective) and RPO (recovery point objective).
- Logical backups (pg_dump) protect against corruption that would be replicated to standbys; physical backups (pg_basebackup) are faster for full-cluster restore.

```bash
# Custom-format binary (parallel restore, selective restore):
pg_dump -Fc -d app -f app.dump

# Parallel dump (faster on multi-core):
pg_dump -Fd -j 4 -d app -f app.dir/

# Plain SQL (portable, but slow to restore):
pg_dump -d app > app.sql

# Globals (roles, tablespaces):
pg_dumpall --globals-only > globals.sql

# Restore:
pg_restore -d newdb -j 4 app.dump        # parallel restore
# Or psql -f app.sql newdb
```
Caption: pg_dump: logical backup with options

### Common Pitfalls

- Untested backups — an untested backup is not a backup; run quarterly restore drills and verify row counts. Document RTO/RPO and test against them.
- archive_command failing silently — if the command returns non-zero, the primary retains the WAL segment; this can fill the disk. Monitor archive_status and pg_stat_archiver.
- Restoring to the wrong target time — PITR stops at recovery_target_time; pick a target a few seconds before the bad event, not after, and use `recovery_target_action = 'pause'` to inspect before promoting.
- Using pg_dump for terabyte databases — restore is too slow (replays every INSERT); use pg_basebackup + WAL archiving (PITR) or pgBackRest with incremental for large DBs.
- Forgetting pg_dumpall for globals — pg_dump backs up one database but not roles, tablespaces, or pg_hba.conf; run `pg_dumpall --globals-only` separately.

### Real-World Applications

- Stripe uses pgBackRest with continuous WAL archiving to S3 and quarterly restore drills for its ledger databases.
- Discord uses Barman for managed backups with retention and PITR across hundreds of shards.
- Reddit uses pg_basebackup + WAL archiving for shard backups, with weekly restore drills to staging.
- Spotify uses pgBackRest with incremental backups and S3 storage for its multi-terabyte play-event databases.

### Interview Questions

- 1. What's the difference between pg_dump and pg_basebackup? — pg_dump is logical (portable, slow restore on large DBs); pg_basebackup is physical (fast restore, version-tied).
- 2. What is PITR and how does it work? — Point-in-Time Recovery: restore a base backup, then replay WAL up to a target time/xid/lsn, then stop. Requires archive_mode=on and WAL archiving.
- 3. Why is an untested backup not a backup? — You don't know if it restores correctly until you try; run quarterly drills to staging and verify row counts. Document RTO/RPO.
- 4. What does archive_command do, and what's its main risk? — Ships completed WAL segments to durable storage; if it returns non-zero, the primary retains the segment (disk fill risk). Monitor pg_stat_archiver.
- 5. When would you use pgBackRest over pg_dump? — For terabyte-scale databases (incremental backups, parallelism, retention); pg_dump restore is too slow for large DBs.

### Mini Project

Build a PITR Restore Drill Script: A `restore_drill.sh` that (1) takes a pg_basebackup of a primary, (2) configures WAL archiving, (3) simulates a "bad" DROP TABLE at a known time, (4) restores the base backup to a fresh cluster, (5) replays WAL up to 1 second before the DROP, (6) verifies the table exists. Suggested approach:
  - pg_basebackup -h primary -U replicator -D /tmp/recovery -Fp -Xs -P
  - On primary: SELECT now() AS t0; DROP TABLE important; SELECT now() AS t_bad;
  - On recovery cluster: set restore_command, recovery_target_time = t0, recovery_target_action = pause
  - Start the recovery cluster, wait for "recovery stopping after commit time"
  - SELECT * FROM important; — should return rows
  - Document RTO (time to restore) and RPO (data lost = ~0)

### Exercises

1. Run pg_dump -Fc on a small database, drop the database, recreate it, and pg_restore; verify row counts match.
2. Take a pg_basebackup, write WAL by inserting rows, then restore the backup and replay WAL; verify the new rows appear.
3. Configure archive_command to copy WAL to /tmp/wal; insert rows; verify WAL files appear in /tmp/wal.
4. Set recovery_target_time to a known point, restore, and verify the database state matches that point in time.
5. Install pgBackRest, take a full backup, then an incremental backup; restore the incremental; verify it works.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between pg_dump and pg_basebackup?
9. A) pg_dump is logical (portable, slow restore on large DBs); pg_basebackup is physical (fast restore, version-tied) (*)
10. B) They are identical
11. C) pg_dump is faster
12. D) pg_basebackup requires superuser
13. Explanation: pg_dump produces SQL or custom-format binary (portable across versions, but replays every INSERT on restore — slow for TBs). pg_basebackup copies the data dir (fast restore, but tied to the major PG version).
14. Q2: What does PITR stand for and how does it work?
15. A) Pre-Incremental Table Restore; uses pg_dump
16. B) Point-in-Time Recovery; restore a base backup, then replay WAL to a target time/xid/lsn (*)
17. C) Parallel Insert Table Recovery
18. D) Post-Incident Transaction Reversal
19. Explanation: PITR combines a base backup (pg_basebackup) with archived WAL; you restore the base, then replay WAL up to recovery_target_time/xid/lsn, then stop. Requires archive_mode=on.
20. Q3: What does archive_command do?
21. A) Compresses WAL
22. B) Deletes old WAL
23. C) Ships completed WAL segments to durable storage for PITR (*)
24. D) Replicates WAL to standbys
25. Explanation: archive_command is a shell command Postgres runs to copy each completed WAL segment to durable storage (S3, NFS); if it returns non-zero, the primary retains the segment. Required for PITR.
26. Q4: What's the main risk of an archive_command that returns non-zero?
27. A) WAL is lost
28. B) Replication breaks
29. C) Backups fail silently
30. D) The primary retains the segment, potentially filling its disk (*)
31. Explanation: Postgres won't overwrite or delete an unarchived WAL segment; if archive_command keeps failing, pg_wal grows until the disk fills. Monitor pg_stat_archiver.failed_count.
32. Q5: Why is an untested backup not a backup?
33. A) You don't know if it restores correctly until you try; run quarterly drills (*)
34. B) It might be corrupted
35. C) It's not really a backup
36. D) Backups expire automatically
37. Explanation: A backup that's never been restored might be corrupted, incomplete, or incompatible with your restore tooling. Run quarterly restore drills to staging and verify row counts; document RTO/RPO.
38. Q6: Which tool provides incremental backups with retention for Postgres?
39. A) pg_dump
40. B) pgBackRest (*)
41. C) pgAdmin
42. D) pg_stat_statements
43. Explanation: pgBackRest (and Barman) support full/differential/incremental backups, parallelism, compression, and retention policies; essential for terabyte-scale databases. pg_dump is logical-only.
44. Q7: What does `recovery_target_action = 'pause'` do during PITR?
45. A) Pauses the restore indefinitely
46. B) Pauses WAL archiving
47. C) Pauses after reaching recovery_target_time so you can inspect before promoting (*)
48. D) Pauses replication
49. Explanation: 'pause' (default in PG14+) stops recovery at the target without promoting, so you can verify the state with SELECTs. Use 'promote' to promote immediately, or 'shutdown' to shut down.
50. Q8: What does pg_dumpall --globals-only back up?
51. A) All databases
52. B) Only the postgres role
53. C) Only schemas
54. D) Roles (users/groups), tablespaces, and cluster-level config — but no table data (*)
55. Explanation: pg_dumpall --globals-only backs up roles, tablespaces, and cluster config; pair it with per-database pg_dump for a complete backup. Without it, you'd lose role definitions on restore.
56. Q9: When should you NOT use pg_dump?
57. A) For terabyte-scale databases (restore replays every INSERT — too slow) (*)
58. B) For small databases
59. C) For schema-only dumps
60. D) For migrating between PG versions
61. Explanation: pg_dump restore is O(N) in rows; for terabyte databases it can take days. Use pg_basebackup + WAL archiving (PITR) or pgBackRest with incremental for large DBs.
62. Q10: What are RTO and RPO?
63. A) Read Time Objective and Read Point Objective
64. B) Recovery Time Objective (how fast you must restore) and Recovery Point Objective (max data lost) (*)
65. C) Replication Time Objective and Replication Point Objective
66. D) Restore Target Order and Restore Point Order
67. Explanation: RTO = max acceptable downtime (e.g. 4 hours); RPO = max acceptable data loss (e.g. 5 minutes). Design backups and replication to meet both; test against them in drills.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between pg_dump and pg_basebackup?
  options:
    - pg_dump is logical (portable, slow restore on large DBs); pg_basebackup is physical (fast restore, version-tied)
    - They are identical
    - pg_dump is faster
    - pg_basebackup requires superuser
  correctIndex: 0
  explanation: pg_dump produces SQL or custom-format binary (portable across versions, but replays every INSERT on restore — slow for TBs). pg_basebackup copies the data dir (fast restore, but tied to the major PG version).
- id: q2
  question: What does PITR stand for and how does it work?
  options:
    - Pre-Incremental Table Restore; uses pg_dump
    - Point-in-Time Recovery; restore a base backup, then replay WAL to a target time/xid/lsn
    - Parallel Insert Table Recovery
    - Post-Incident Transaction Reversal
  correctIndex: 1
  explanation: PITR combines a base backup (pg_basebackup) with archived WAL; you restore the base, then replay WAL up to recovery_target_time/xid/lsn, then stop. Requires archive_mode=on.
- id: q3
  question: What does archive_command do?
  options:
    - Compresses WAL
    - Deletes old WAL
    - Ships completed WAL segments to durable storage for PITR
    - Replicates WAL to standbys
    - ; if it returns non-zero, the primary retains the segment. Required for PITR.
  correctIndex: 2
  explanation: archive_command is a shell command Postgres runs to copy each completed WAL segment to durable storage (S3, NFS); if it returns non-zero, the primary retains the segment. Required for PITR.
- id: q4
  question: What's the main risk of an archive_command that returns non-zero?
  options:
    - WAL is lost
    - Replication breaks
    - Backups fail silently
    - The primary retains the segment, potentially filling its disk
  correctIndex: 3
  explanation: Postgres won't overwrite or delete an unarchived WAL segment; if archive_command keeps failing, pg_wal grows until the disk fills. Monitor pg_stat_archiver.failed_count.
- id: q5
  question: Why is an untested backup not a backup?
  options:
    - You don't know if it restores correctly until you try; run quarterly drills
    - It might be corrupted
    - It's not really a backup
    - Backups expire automatically
  correctIndex: 0
  explanation: A backup that's never been restored might be corrupted, incomplete, or incompatible with your restore tooling. Run quarterly restore drills to staging and verify row counts; document RTO/RPO.
- id: q6
  question: Which tool provides incremental backups with retention for Postgres?
  options:
    - pg_dump
    - pgBackRest
    - pgAdmin
    - pg_stat_statements
  correctIndex: 1
  explanation: pgBackRest (and Barman) support full/differential/incremental backups, parallelism, compression, and retention policies; essential for terabyte-scale databases. pg_dump is logical-only.
- id: q7
  question: What does `recovery_target_action = 'pause'` do during PITR?
  options:
    - Pauses the restore indefinitely
    - Pauses WAL archiving
    - Pauses after reaching recovery_target_time so you can inspect before promoting
    - Pauses replication
  correctIndex: 2
  explanation: "'pause' (default in PG14+) stops recovery at the target without promoting, so you can verify the state with SELECTs. Use 'promote' to promote immediately, or 'shutdown' to shut down."
- id: q8
  question: What does pg_dumpall --globals-only back up?
  options:
    - All databases
    - Only the postgres role
    - Only schemas
    - Roles (users/groups), tablespaces, and cluster-level config — but no table data
  correctIndex: 3
  explanation: pg_dumpall --globals-only backs up roles, tablespaces, and cluster config; pair it with per-database pg_dump for a complete backup. Without it, you'd lose role definitions on restore.
- id: q9
  question: When should you NOT use pg_dump?
  options:
    - For terabyte-scale databases (restore replays every INSERT — too slow)
    - For small databases
    - For schema-only dumps
    - For migrating between PG versions
    - in rows; for terabyte databases it can take days. Use pg_basebackup + WAL archiving (PITR) or pgBackRest with incremental for large DBs.
  correctIndex: 0
  explanation: pg_dump restore is O(N) in rows; for terabyte databases it can take days. Use pg_basebackup + WAL archiving (PITR) or pgBackRest with incremental for large DBs.
- id: q10
  question: What are RTO and RPO?
  options:
    - Read Time Objective and Read Point Objective
    - Recovery Time Objective (how fast you must restore) and Recovery Point Objective (max data lost)
    - Replication Time Objective and Replication Point Objective
    - Restore Target Order and Restore Point Order
  correctIndex: 1
  explanation: RTO = max acceptable downtime (e.g. 4 hours); RPO = max acceptable data loss (e.g. 5 minutes). Design backups and replication to meet both; test against them in drills.
```

