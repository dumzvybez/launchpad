---
slug: postgresql-triggers-trigger-functions
id: postgresql-09
track: postgresql
order: 9
title: Triggers and Trigger Functions
description: Build trigger functions in PL/pgSQL, attach them with BEFORE/AFTER/INSTEAD OF and per-row/per-statement semantics, and use them for audit logs, computed columns, and soft-delete.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=9600s
whyItMatters: Build trigger functions in PL/pgSQL, attach them with BEFORE/AFTER/INSTEAD OF and per-row/per-statement semantics, and use them for audit logs, computed columns, and soft-delete.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Triggers and Trigger Functions

## Triggers and Trigger Functions

### Why It Matters

Build trigger functions in PL/pgSQL, attach them with BEFORE/AFTER/INSTEAD OF and per-row/per-statement semantics, and use them for audit logs, computed columns, and soft-delete.

Build trigger functions in PL/pgSQL, attach them with BEFORE/AFTER/INSTEAD OF and per-row/per-statement semantics, and use them for audit logs, computed columns, and soft-delete.

### Prerequisites

- Stage 8: Functions — SQL, PL/pgSQL, Procedural
- Stage 4: Schemas, Tables, and Constraints

### Topics

- CREATE TRIGGER ... BEFORE/AFTER/INSTEAD OF INSERT/UPDATE/DELETE
- ROW vs STATEMENT triggers (FOR EACH ROW vs FOR EACH STATEMENT)
- Trigger functions return NEW, OLD, or NULL
- Transition tables (NEW TABLE / OLD TABLE) in statement-level triggers
- CONSTRAINT TRIGGER (deferrable, runs at COMMIT)
- Common patterns: audit log, updated_at, soft-delete, denormalized counters
- INSTEAD OF triggers on views (for updatable complex views)
- Event triggers (DDL triggers) for schema-change auditing

### Key Concepts

- A trigger function takes no args and returns trigger; it accesses NEW and OLD special records; BEFORE triggers can modify NEW (and skip the operation by returning NULL).
- BEFORE triggers fire before the constraint check and the actual write — useful for normalizing data (lowercasing email, setting updated_at).
- AFTER triggers fire after the write — useful for audit logs and denormalized counters; you can't modify NEW here.
- STATEMENT triggers fire once per statement (not per row) and can use transition tables (NEW TABLE / OLD TABLE) to see all affected rows — much faster than per-row triggers for bulk operations.
- INSTEAD OF triggers fire on views (not tables) and let you make any view updatable by writing the underlying INSERT/UPDATE/DELETE yourself.
- CONSTRAINT TRIGGERs are AFTER-row triggers that can be DEFERRABLE (checked at COMMIT) — useful for cross-table invariants.
- Triggers are powerful but invisible — they hide side effects from application developers; document them, prefer constraints when possible, and avoid chains of triggers.

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END $$;

CREATE TABLE post (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       text,
    body        text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER post_set_updated_at
    BEFORE UPDATE ON post
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
```
Caption: updated_at BEFORE UPDATE trigger

### Common Pitfalls

- Per-row triggers on bulk operations — a 1M-row UPDATE fires the trigger 1M times; use a STATEMENT trigger with transition tables for bulk audit.
- AFTER trigger trying to modify NEW — AFTER triggers can't change NEW (the row is already written); use BEFORE for normalization.
- Trigger chains causing infinite recursion — trigger A updates table B, trigger B on B updates table A; set `session_replication_role = replica` to disable triggers in batch jobs, or guard with `IF TG_OP = ...` checks.
- Forgetting that triggers are invisible to app developers — they hide side effects; document them, prefer CHECK/EXCLUDE constraints when possible, and avoid long chains.
- Constraints enforced in triggers instead of CHECK/EXCLUDE — use the right tool: CHECK for row-local invariants, EXCLUDE for cross-row, FK for cross-table; triggers are a last resort for true invariant enforcement.

### Real-World Applications

- Stripe uses AFTER triggers to write immutable audit logs of every ledger entry for compliance.
- Discord uses BEFORE INSERT triggers to normalize message content (lowercase mentions, strip control chars).
- Reddit uses triggers to maintain denormalized vote counts on posts and comments.
- Spotify uses INSTEAD OF triggers on analytical views to let dashboards "edit" denormalized data safely.

### Interview Questions

- 1. What's the difference between BEFORE and AFTER triggers? — BEFORE fires before the write (can modify NEW or skip via NULL); AFTER fires after (for audit, denormalization).
- 2. When would you use a STATEMENT trigger over a ROW trigger? — For bulk operations: a STATEMENT trigger fires once per statement and uses transition tables (NEW TABLE/OLD TABLE) instead of N times for N rows.
- 3. What does an INSTEAD OF trigger do? — Fires on a view (not a table) and lets you make any view updatable by writing the underlying INSERT/UPDATE/DELETE yourself.
- 4. Can an AFTER trigger modify NEW? — No — AFTER fires after the row is written; only BEFORE triggers can modify NEW.
- 5. How do you disable triggers for a bulk data load? — `ALTER TABLE t DISABLE TRIGGER user;` (or ALL), load, re-enable; or `SET session_replication_role = replica` (session-wide, superuser only).

### Mini Project

Build an Audit-Log System: For a `post` table, build (1) a BEFORE UPDATE trigger that sets updated_at, (2) an AFTER INSERT/UPDATE/DELETE trigger that writes to `audit_log` with old_data/new_data as jsonb, and (3) a STATEMENT trigger using a transition table for bulk INSERT performance. Compare per-row vs statement trigger performance on a 100k-row INSERT. Suggested approach:
  - Use to_jsonb(NEW) and to_jsonb(OLD) to capture row state
  - Use TG_OP and TG_TABLE_NAME inside the trigger function
  - For the statement trigger, use `REFERENCING NEW TABLE AS new_table` and SELECT FROM new_table
  - Time the 100k INSERT with each trigger; statement should be 5-10× faster
  - Verify the audit_log has the expected number of rows after each test

### Exercises

1. Create a BEFORE UPDATE trigger that sets updated_at = now(); UPDATE a row and verify the timestamp changed.
2. Create an AFTER INSERT OR UPDATE OR DELETE trigger that writes to an audit_log table with old_data/new_data as jsonb.
3. Create a STATEMENT trigger with REFERENCING NEW TABLE AS new_table; INSERT 100k rows and measure the time vs a per-row trigger.
4. Create an INSTEAD OF INSERT trigger on a view; INSERT into the view and verify the underlying table received the row.
5. Disable all triggers on a table with ALTER TABLE ... DISABLE TRIGGER ALL; bulk-load data; re-enable; verify the audit log wasn't written during the load.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between BEFORE and AFTER triggers?
9. A) BEFORE fires before the write (can modify NEW); AFTER fires after (for audit) (*)
10. B) BEFORE is faster
11. C) AFTER can modify NEW
12. D) They are identical
13. Explanation: BEFORE triggers can modify or reject the row (return NULL); AFTER triggers see the final state and are used for audit logs, denormalization, and notifications.
14. Q2: When is a STATEMENT trigger better than a ROW trigger?
15. A) Always
16. B) For bulk operations — fires once per statement, uses transition tables (*)
17. C) Never
18. D) Only for DELETE
19. Explanation: A 1M-row UPDATE fires a ROW trigger 1M times; a STATEMENT trigger fires once and can use NEW TABLE / OLD TABLE to see all affected rows — often 5-10× faster for bulk.
20. Q3: What does an INSTEAD OF trigger attach to?
21. A) A table
22. B) A function
23. C) A view (*)
24. D) A schema
25. Explanation: INSTEAD OF triggers fire on views and let you make any view updatable by writing the underlying INSERT/UPDATE/DELETE logic yourself.
26. Q4: Can an AFTER trigger modify NEW?
27. A) Yes
28. B) Only if it's a STATEMENT trigger
29. C) Only with superuser
30. D) No — the row is already written; only BEFORE triggers can modify NEW (*)
31. Explanation: AFTER triggers fire after the write to the table; they can read NEW (the final value) but cannot change it. Use BEFORE to normalize or set defaults before the write.
32. Q5: What does `REFERENCING NEW TABLE AS new_table` enable?
33. A) Transition tables in a STATEMENT trigger — see all affected rows at once (*)
34. B) Recursion
35. C) Foreign keys
36. D) Faster triggers automatically
37. Explanation: Transition tables (NEW TABLE / OLD TABLE) are available in AFTER STATEMENT triggers; they let you process all affected rows in one query, drastically faster than per-row triggers for bulk ops.
38. Q6: How do you disable triggers for a bulk load?
39. A) DROP TRIGGER, recreate after
40. B) ALTER TABLE t DISABLE TRIGGER ALL (or user/replica); re-enable after (*)
41. C) Restart Postgres
42. D) You can't
43. Explanation: ALTER TABLE ... DISABLE TRIGGER ALL disables all triggers for the table; alternately, SET session_replication_role = replica (superuser) disables session-wide for non-replication triggers. Re-enable after the load.
44. Q7: What is a CONSTRAINT TRIGGER?
45. A) A trigger that can't fail
46. B) A trigger on constraints
47. C) An AFTER-row trigger that can be DEFERRABLE (checked at COMMIT) (*)
48. D) The same as a CHECK constraint
49. Explanation: CONSTRAINT TRIGGERs are created with CREATE CONSTRAINT TRIGGER and can be DEFERRABLE INITIALLY DEFERRED — checked at COMMIT, useful for cross-table invariants that hold only at end of txn.
50. Q8: Why are triggers considered "invisible" to application developers?
51. A) They run in a separate process
52. B) They can't be queried
53. C) They run only at night
54. D) Side effects (audit logs, denormalization) aren't visible in app code; document them and prefer constraints (*)
55. Explanation: App developers reading the ORM model don't see triggers; this can cause confusion ("where did updated_at come from?"). Document triggers in the schema README and prefer CHECK/EXCLUDE/FK when possible.
56. Q9: What does TG_OP return inside a trigger function?
57. A) 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE' — the operation that fired the trigger (*)
58. B) The table name
59. C) The current user
60. D) The row count
61. Explanation: TG_OP is a special variable holding the operation; TG_TABLE_NAME and TG_TABLE_SCHEMA give the table; use them to write generic audit triggers.
62. Q10: What's the right tool for an invariant that spans multiple rows in one table?
63. A) CHECK constraint
64. B) EXCLUDE constraint (often with GiST) (*)
65. C) A trigger
66. D) A foreign key
67. Explanation: EXCLUDE constraints (often with GiST on a range) handle multi-row invariants like "no overlapping bookings" declaratively. Use a trigger only if EXCLUDE can't express the invariant.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between BEFORE and AFTER triggers?
  options:
    - BEFORE fires before the write (can modify NEW); AFTER fires after (for audit)
    - BEFORE is faster
    - AFTER can modify NEW
    - They are identical
    - ; AFTER triggers see the final state and are used for audit logs, denormalization, and notifications.
  correctIndex: 0
  explanation: BEFORE triggers can modify or reject the row (return NULL); AFTER triggers see the final state and are used for audit logs, denormalization, and notifications.
- id: q2
  question: When is a STATEMENT trigger better than a ROW trigger?
  options:
    - Always
    - For bulk operations — fires once per statement, uses transition tables
    - Never
    - Only for DELETE
  correctIndex: 1
  explanation: A 1M-row UPDATE fires a ROW trigger 1M times; a STATEMENT trigger fires once and can use NEW TABLE / OLD TABLE to see all affected rows — often 5-10× faster for bulk.
- id: q3
  question: What does an INSTEAD OF trigger attach to?
  options:
    - A table
    - A function
    - A view
    - A schema
  correctIndex: 2
  explanation: INSTEAD OF triggers fire on views and let you make any view updatable by writing the underlying INSERT/UPDATE/DELETE logic yourself.
- id: q4
  question: Can an AFTER trigger modify NEW?
  options:
    - Yes
    - Only if it's a STATEMENT trigger
    - Only with superuser
    - No — the row is already written; only BEFORE triggers can modify NEW
  correctIndex: 3
  explanation: AFTER triggers fire after the write to the table; they can read NEW (the final value) but cannot change it. Use BEFORE to normalize or set defaults before the write.
- id: q5
  question: What does `REFERENCING NEW TABLE AS new_table` enable?
  options:
    - Transition tables in a STATEMENT trigger — see all affected rows at once
    - Recursion
    - Foreign keys
    - Faster triggers automatically
    - are available in AFTER STATEMENT triggers; they let you process all affected rows in one query, drastically faster than per-row triggers for bulk ops.
  correctIndex: 0
  explanation: Transition tables (NEW TABLE / OLD TABLE) are available in AFTER STATEMENT triggers; they let you process all affected rows in one query, drastically faster than per-row triggers for bulk ops.
- id: q6
  question: How do you disable triggers for a bulk load?
  options:
    - DROP TRIGGER, recreate after
    - ALTER TABLE t DISABLE TRIGGER ALL (or user/replica); re-enable after
    - Restart Postgres
    - You can't
  correctIndex: 1
  explanation: ALTER TABLE ... DISABLE TRIGGER ALL disables all triggers for the table; alternately, SET session_replication_role = replica (superuser) disables session-wide for non-replication triggers. Re-enable after the load.
- id: q7
  question: What is a CONSTRAINT TRIGGER?
  options:
    - A trigger that can't fail
    - A trigger on constraints
    - An AFTER-row trigger that can be DEFERRABLE (checked at COMMIT)
    - The same as a CHECK constraint
  correctIndex: 2
  explanation: CONSTRAINT TRIGGERs are created with CREATE CONSTRAINT TRIGGER and can be DEFERRABLE INITIALLY DEFERRED — checked at COMMIT, useful for cross-table invariants that hold only at end of txn.
- id: q8
  question: Why are triggers considered "invisible" to application developers?
  options:
    - They run in a separate process
    - They can't be queried
    - They run only at night
    - Side effects (audit logs, denormalization) aren't visible in app code; document them and prefer constraints
  correctIndex: 3
  explanation: App developers reading the ORM model don't see triggers; this can cause confusion ("where did updated_at come from?"). Document triggers in the schema README and prefer CHECK/EXCLUDE/FK when possible.
- id: q9
  question: What does TG_OP return inside a trigger function?
  options:
    - "'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE' — the operation that fired the trigger"
    - The table name
    - The current user
    - The row count
  correctIndex: 0
  explanation: TG_OP is a special variable holding the operation; TG_TABLE_NAME and TG_TABLE_SCHEMA give the table; use them to write generic audit triggers.
- id: q10
  question: What's the right tool for an invariant that spans multiple rows in one table?
  options:
    - CHECK constraint
    - EXCLUDE constraint (often with GiST)
    - A trigger
    - A foreign key
  correctIndex: 1
  explanation: EXCLUDE constraints (often with GiST on a range) handle multi-row invariants like "no overlapping bookings" declaratively. Use a trigger only if EXCLUDE can't express the invariant.
```

