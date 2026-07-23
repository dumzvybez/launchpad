---
slug: sql-triggers-functions-user-defined-types
id: sql-12
track: sql
order: 12
title: Triggers, Functions, and User-Defined Types
description: Run logic on row changes with BEFORE/AFTER/INSTEAD OF triggers, write rich PL/pgSQL functions, and define composite types, enums, and domains — and learn when triggers become a maintenance nightmare.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=7600s
whyItMatters: Run logic on row changes with BEFORE/AFTER/INSTEAD OF triggers, write rich PL/pgSQL functions, and define composite types, enums, and domains — and learn when triggers become a maintenance nightmare.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Triggers, Functions, and User-Defined Types

## Triggers, Functions, and User-Defined Types

### Why It Matters

Run logic on row changes with BEFORE/AFTER/INSTEAD OF triggers, write rich PL/pgSQL functions, and define composite types, enums, and domains — and learn when triggers become a maintenance nightmare.

Run logic on row changes with BEFORE/AFTER/INSTEAD OF triggers, write rich PL/pgSQL functions, and define composite types, enums, and domains — and learn when triggers become a maintenance nightmare.

### Prerequisites

- Stage 11: Views, Materialized Views, and Stored Procedures.
- Solid PL/pgSQL fundamentals.

### Topics

- CREATE TRIGGER — BEFORE, AFTER, INSTEAD OF, per-row (FOR EACH ROW) and per-statement
- INSERT/UPDATE/DELETE triggers; NEW and OLD records
- WHEN clause on triggers
- Constraint triggers (DEFERRABLE)
- Event triggers (DDL changes)
- CREATE TYPE (composite, enum)
- CREATE DOMAIN (constrained base type)
- PL/pgSQL control flow: IF, CASE, LOOP, FOR, FOREACH
- Audit trail pattern and the trigger-recursion pitfall

### Key Concepts

- BEFORE triggers can modify NEW before insert/update (e.g. set updated_at, validate); AFTER triggers can't modify the row but are good for side effects (audit log).
- Constraint triggers are DEFERRABLE — checked at COMMIT, not at statement, enabling cross-row validation.
- Triggers fire in alphabetical order by name within the same event/timing; rely on it cautiously.
- Trigger recursion: a trigger on table A writes to table B whose trigger writes back to A — use pg_trigger_depth() to guard.
- Composite types allow structured columns (e.g. address); domains add CHECK constraints to a base type.
- Audit triggers add ~30-50% write overhead; weigh against application-level auditing.

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customer_updated_at
BEFORE UPDATE ON customer
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```
Caption: BEFORE UPDATE trigger: updated_at

### Common Pitfalls

- Trigger recursion — a trigger on A writes to B whose trigger writes to A; guard with pg_trigger_depth().
- Performance cliff on bulk writes — per-row triggers fire once per row; use per-statement triggers or move logic to a CTE batch.
- Hidden business logic — triggers execute invisibly to application code, surprising new engineers; document and prefer app-level logic when feasible.
- AFTER trigger can't modify NEW — to set updated_at or compute derived columns, use a BEFORE trigger.
- Forgotten WHEN clause — without WHEN, the trigger fires on every row; add `WHEN (OLD.email IS DISTINCT FROM NEW.email)` to fire only on changes.

### Real-World Applications

- Stripe uses audit triggers on the charges table to capture every state transition for compliance.
- Airbnb uses BEFORE UPDATE triggers to enforce `updated_at` on listings and reviews.
- LinkedIn's member profile updates fire triggers that fan out to search-indexing jobs.
- Uber's ledger uses constraint triggers (DEFERRABLE) to validate balance invariants at COMMIT.

### Interview Questions

- 1. Difference between BEFORE and AFTER triggers? — BEFORE can modify NEW and skip the operation (RETURN NULL); AFTER can't modify but is good for side effects.
- 2. What are constraint triggers? — DEFERRABLE triggers checked at COMMIT, enabling cross-row and cross-table validation.
- 3. How do you prevent trigger recursion? — Guard with `IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;`.
- 4. Composite type vs JSONB — when to pick which? — Composite when the structure is stable and you want type safety; JSONB when the shape is flexible or schema evolves often.
- 5. What's a domain? — A base type plus a CHECK constraint, reusable across columns (e.g. email_address).

### Mini Project

Build a Generic Audit Trigger: A reusable trigger function `audit_any_table()` that captures INSERT/UPDATE/DELETE on any table, storing old_data/new_data as JSONB in a single audit_log table. Apply it to `customer`, `payment`, and `rental`. Suggested approach:
  - Use TG_TABLE_NAME and TG_OP from the trigger context
  - Use to_jsonb(NEW) / to_jsonb(OLD) for row snapshots
  - Use a wildcard policy: any table that wants auditing adds `CREATE TRIGGER ... EXECUTE FUNCTION audit_any_table()`
  - Guard against recursion with pg_trigger_depth()
  - Add an index on audit_log(table_name, changed_at) for queries

### Exercises

1. Write a BEFORE UPDATE trigger that sets `updated_at = now()` automatically.
2. Add a WHEN clause so the trigger fires only when the email actually changes.
3. Create a composite type `address` and use it as a column on `customer`.
4. Create a domain `positive_int` with CHECK (value > 0); test inserting 0.
5. Write a constraint trigger that enforces "no two active bookings on the same seat" at COMMIT.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which trigger timing can modify the NEW record?
9. A) AFTER
10. B) INSTEAD OF (only on views)
11. C) None
12. D) BEFORE (*)
13. Explanation: BEFORE triggers fire before the row is written and can modify NEW (set updated_at, validate) or cancel the operation (RETURN NULL).
14. Q2: What does pg_trigger_depth() help with?
15. A) Detecting and guarding against trigger recursion (*)
16. B) Index depth
17. C) Trigger performance
18. D) Stack traces
19. Explanation: pg_trigger_depth() returns the current nesting level; check it to skip nested invocations and avoid infinite recursion.
20. Q3: Constraint triggers are checked when?
21. A) At statement start
22. B) Immediately at statement end (or at COMMIT if DEFERRABLE) (*)
23. C) At session end
24. D) Never
25. Explanation: Constraint triggers are DEFERRABLE; they fire at COMMIT (or statement end if IMMEDIATE), enabling cross-row validation.
26. Q4: What is a domain in Postgres?
27. A) A schema
28. B) A table partition
29. C) A base type with a CHECK constraint, reusable across columns (*)
30. D) A foreign key
31. Explanation: A domain wraps a base type with constraints (e.g. email_address AS text CHECK (...)); reuse it on any column without re-stating the CHECK.
32. Q5: Which TG_OP values exist for a row trigger?
33. A) 'CREATE', 'ALTER', 'DROP'
34. B) 'SELECT', 'INSERT', 'UPDATE'
35. C) 'BEFORE', 'AFTER'
36. D) 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE' (*)
37. Explanation: TG_OP is one of INSERT/UPDATE/TRUNCATE (and the trigger can also fire on these events); use it to branch inside a multi-event trigger.
38. Q6: Why add a WHEN clause to a trigger?
39. A) To prevent the trigger firing on every row, only when a specific column changes (*)
40. B) To allow the trigger to skip the operation
41. C) To set the trigger name
42. D) To make the trigger DEFERRABLE
43. Explanation: `WHEN (OLD.email IS DISTINCT FROM NEW.email)` ensures the trigger fires only when email actually changes — saving overhead.
44. Q7: When does a per-row trigger become a performance problem?
45. A) Never
46. B) On bulk INSERT/UPDATE/DELETE of many rows; consider per-statement triggers or batching (*)
47. C) Only with SERIALIZABLE
48. D) Only with jsonb
49. Explanation: Per-row triggers fire once per row; a 1M-row UPDATE triggers 1M function calls. Use per-statement or batch in CTEs for bulk work.
50. Q8: INSTEAD OF triggers are used on?
51. A) Tables only
52. B) Indexes
53. C) Views (to make non-simple views writable) (*)
54. D) Sequences
55. Explanation: INSTEAD OF triggers fire on views, intercepting INSERT/UPDATE/DELETE and mapping them to base-table operations.
56. Q9: What overhead do audit triggers typically add?
57. A) ~0% — they're free
58. B) 10x slower reads
59. C) They disable indexes
60. D) ~30-50% write overhead per row, plus storage growth (*)
61. Explanation: Audit triggers write to the audit log on every change; budget for the extra write and storage, and consider app-level auditing for high-volume tables.
62. Q10: Which is TRUE about composite types?
63. A) They group multiple fields into a single typed column (e.g. money_amount) (*)
64. B) They can't be indexed
65. C) They are immutable
66. D) They're equivalent to JSONB
67. Explanation: Composite types are structured columns with named fields; good for stable shapes where you want type safety, as opposed to JSONB's flexibility.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which trigger timing can modify the NEW record?
  options:
    - AFTER
    - INSTEAD OF (only on views)
    - None
    - BEFORE
    - .
  correctIndex: 3
  explanation: BEFORE triggers fire before the row is written and can modify NEW (set updated_at, validate) or cancel the operation (RETURN NULL).
- id: q2
  question: What does pg_trigger_depth() help with?
  options:
    - Detecting and guarding against trigger recursion
    - Index depth
    - Trigger performance
    - Stack traces
  correctIndex: 0
  explanation: pg_trigger_depth() returns the current nesting level; check it to skip nested invocations and avoid infinite recursion.
- id: q3
  question: Constraint triggers are checked when?
  options:
    - At statement start
    - Immediately at statement end (or at COMMIT if DEFERRABLE)
    - At session end
    - Never
    - ", enabling cross-row validation."
  correctIndex: 1
  explanation: Constraint triggers are DEFERRABLE; they fire at COMMIT (or statement end if IMMEDIATE), enabling cross-row validation.
- id: q4
  question: What is a domain in Postgres?
  options:
    - A schema
    - A table partition
    - A base type with a CHECK constraint, reusable across columns
    - A foreign key
  correctIndex: 2
  explanation: A domain wraps a base type with constraints (e.g. email_address AS text CHECK (...)); reuse it on any column without re-stating the CHECK.
- id: q5
  question: Which TG_OP values exist for a row trigger?
  options:
    - "'CREATE', 'ALTER', 'DROP'"
    - "'SELECT', 'INSERT', 'UPDATE'"
    - "'BEFORE', 'AFTER'"
    - "'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'"
  correctIndex: 3
  explanation: TG_OP is one of INSERT/UPDATE/TRUNCATE (and the trigger can also fire on these events); use it to branch inside a multi-event trigger.
- id: q6
  question: Why add a WHEN clause to a trigger?
  options:
    - To prevent the trigger firing on every row, only when a specific column changes
    - To allow the trigger to skip the operation
    - To set the trigger name
    - To make the trigger DEFERRABLE
  correctIndex: 0
  explanation: "`WHEN (OLD.email IS DISTINCT FROM NEW.email)` ensures the trigger fires only when email actually changes — saving overhead."
- id: q7
  question: When does a per-row trigger become a performance problem?
  options:
    - Never
    - On bulk INSERT/UPDATE/DELETE of many rows; consider per-statement triggers or batching
    - Only with SERIALIZABLE
    - Only with jsonb
  correctIndex: 1
  explanation: Per-row triggers fire once per row; a 1M-row UPDATE triggers 1M function calls. Use per-statement or batch in CTEs for bulk work.
- id: q8
  question: INSTEAD OF triggers are used on?
  options:
    - Tables only
    - Indexes
    - Views (to make non-simple views writable)
    - Sequences
  correctIndex: 2
  explanation: INSTEAD OF triggers fire on views, intercepting INSERT/UPDATE/DELETE and mapping them to base-table operations.
- id: q9
  question: What overhead do audit triggers typically add?
  options:
    - ~0% — they're free
    - 10x slower reads
    - They disable indexes
    - ~30-50% write overhead per row, plus storage growth
  correctIndex: 3
  explanation: Audit triggers write to the audit log on every change; budget for the extra write and storage, and consider app-level auditing for high-volume tables.
- id: q10
  question: Which is TRUE about composite types?
  options:
    - They group multiple fields into a single typed column (e.g. money_amount)
    - They can't be indexed
    - They are immutable
    - They're equivalent to JSONB
  correctIndex: 0
  explanation: Composite types are structured columns with named fields; good for stable shapes where you want type safety, as opposed to JSONB's flexibility.
```

