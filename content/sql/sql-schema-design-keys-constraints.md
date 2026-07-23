---
slug: sql-schema-design-keys-constraints
id: sql-08
track: sql
order: 8
title: Schema Design, Keys, and Constraints
description: Design normalized schemas with primary keys, foreign keys, UNIQUE, CHECK, and NOT NULL constraints — and learn the modern trade-offs between IDENTITY, UUID, enum, and lookup tables.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=4800s
whyItMatters: Design normalized schemas with primary keys, foreign keys, UNIQUE, CHECK, and NOT NULL constraints — and learn the modern trade-offs between IDENTITY, UUID, enum, and lookup tables.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Schema Design, Keys, and Constraints

## Schema Design, Keys, and Constraints

### Why It Matters

Design normalized schemas with primary keys, foreign keys, UNIQUE, CHECK, and NOT NULL constraints — and learn the modern trade-offs between IDENTITY, UUID, enum, and lookup tables.

Design normalized schemas with primary keys, foreign keys, UNIQUE, CHECK, and NOT NULL constraints — and learn the modern trade-offs between IDENTITY, UUID, enum, and lookup tables.

### Prerequisites

- Stage 7: Data Modification — INSERT, UPDATE, DELETE, UPSERT.
- Comfort with CREATE TABLE syntax.

### Topics

- Normalization: 1NF, 2NF, 3NF, BCNF — when to denormalize
- PRIMARY KEY: bigint IDENTITY vs UUID vs natural keys
- FOREIGN KEY with ON DELETE / ON UPDATE actions
- UNIQUE, NOT NULL, CHECK constraints
- EXCLUDE constraints (Postgres) — range exclusion
- enum types vs lookup tables — the trade-off
- Surrogate vs natural keys
- Schema migration patterns (additive, expand-then-contract)

### Key Concepts

- Each table represents an entity; each non-key column should depend on the whole key and nothing but the key (3NF).
- Surrogate keys (id) are stable and opaque; natural keys (email, isbn) carry meaning but can change.
- A foreign key enforces referential integrity; ON DELETE CASCADE/SET NULL/RESTRICT controls cleanup.
- Enums are rigid (adding a value requires ALTER TYPE); lookup tables are flexible (just INSERT a row).
- EXCLUDE USING gist (range WITH &&) prevents overlapping ranges (e.g. bookings on the same resource).
- Schema migrations should be additive first; destructive changes go through expand-then-contract.

```sql
CREATE TABLE author (
    id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     text NOT NULL,
    born_at  date
);

CREATE TABLE book (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       text NOT NULL,
    author_id   bigint NOT NULL REFERENCES author(id) ON DELETE RESTRICT,
    published_at date,
    isbn        text UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX book_author_id_idx ON book(author_id);
```
Caption: Normalized schema with FKs

### Common Pitfalls

- Missing FK constraint — leads to orphan rows; add FKs early and use ON DELETE RESTRICT to catch mistakes loudly.
- Missing index on FK column — Postgres doesn't auto-index FKs; queries like `JOIN child ON parent_id` and `DELETE FROM parent` become seq scans.
- Enum vs lookup mistake — enums are fast but require ALTER TYPE to add values and can't be removed easily; use lookup tables for evolving domains.
- Natural key as PK — values like email or isbn can change, forcing cascading updates; prefer surrogate keys with a separate UNIQUE on the natural key.
- Forgetting ON DELETE behavior — the default is NO ACTION (raises); pick CASCADE/SET NULL/RESTRICT explicitly.

### Real-World Applications

- Stripe's schema uses UUIDs as primary keys on most tables to allow sharding and idempotent client-generated IDs.
- Airbnb's booking table uses an EXCLUDE constraint to prevent double-booking a listing's date range.
- LinkedIn's graph tables use bigint IDENTITY for member IDs and lookup tables for industry/code enums.
- Uber's trip schema uses surrogate bigint keys with denormalized snapshot columns for high-throughput reads.

### Interview Questions

- 1. Difference between surrogate and natural keys? — Surrogate keys (id) are opaque and stable; natural keys (email, isbn) carry meaning but can change.
- 2. When would you use an enum vs a lookup table? — Enum for stable, small, type-safe sets (order_status); lookup table for evolving sets and metadata.
- 3. Why does Postgres not auto-index foreign keys? — Indexes cost writes; the DB leaves the choice to you. Add them when you query or DELETE on the FK column.
- 4. What does an EXCLUDE constraint do? — Prevents rows whose ranges overlap (e.g. two bookings on the same room at the same time).
- 5. What's the expand-then-contract migration pattern? — Add new column/structure, backfill, switch reads, then drop the old one — zero-downtime schema changes.

### Mini Project

Design a Concert Ticketing Schema: Tables for venue, event, section, seat, ticket, customer, purchase. Use FKs with sensible ON DELETE actions, an EXCLUDE constraint to prevent double-selling a seat, a lookup table for ticket tier, and a CHECK constraint ensuring `seat.row_letter ~ '^[A-Z]$'`. Suggested approach:
  - bigint GENERATED ALWAYS AS IDENTITY for all PKs
  - UUIDs only for externally-exposed IDs (purchase_id)
  - EXCLUDE USING gist (seat_id WITH =, tstzrange(held_from, held_to) WITH &&) for seat holds
  - CHECK (price > 0), CHECK (capacity > 0)
  - Migration files: V1__create.sql, V2__seed_lookups.sql

### Exercises

1. Design a 3NF schema for a blog (author, post, tag, post_tag); identify the join table.
2. Add a FK with ON DELETE SET NULL to handle user deletion gracefully.
3. Convert an enum column to a lookup table via a migration (additive then backfill then drop).
4. Add an EXCLUDE constraint that prevents overlapping events on the same resource.
5. Add a missing index on a foreign key column and verify with EXPLAIN that a join speeds up.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which normal form removes transitive dependencies (non-key cols depending on other non-key cols)?
9. A) 1NF
10. B) 2NF
11. C) 4NF
12. D) 3NF (*)
13. Explanation: 3NF requires non-key columns to depend on nothing but the key (no transitive dependencies); BCNF is stricter.
14. Q2: What does an EXCLUDE constraint with `tstzrange WITH &&` prevent?
15. A) Overlapping time ranges on the same key (*)
16. B) NULL ranges
17. C) Negative durations
18. D) Duplicate IDs
19. Explanation: && is the range-overlap operator; EXCLUDE USING gist (key WITH =, range WITH &&) blocks double-bookings.
20. Q3: Why are lookup tables preferred over enums for evolving domains?
21. A) Lookups are faster
22. B) Adding a value is a simple INSERT; removing requires no ALTER TYPE (*)
23. C) Enums can't be indexed
24. D) Lookups don't need FKs
25. Explanation: ALTER TYPE ADD VALUE is a multi-step migration and removes aren't supported easily; lookup tables evolve via INSERT/DELETE.
26. Q4: What's the default ON DELETE behavior for a foreign key?
27. A) CASCADE
28. B) SET NULL
29. C) NO ACTION (raises on violation) (*)
30. D) SET DEFAULT
31. Explanation: Without explicit ON DELETE, Postgres uses NO ACTION which raises if a referenced row is deleted; pick CASCADE/SET NULL intentionally.
32. Q5: Which is a benefit of UUID primary keys?
33. A) Smaller index size
34. B) Sequential and ordered
35. C) Faster joins
36. D) Client-generated, supports sharding and idempotent inserts (*)
37. Explanation: UUIDs let clients generate IDs ahead of insert, avoiding a round-trip; they shard naturally but bloat indexes vs bigint.
38. Q6: What problem does expand-then-contract solve?
39. A) Zero-downtime schema migrations in production (*)
40. B) Long-running transactions
41. C) Replication lag
42. D) Index bloat
43. Explanation: Add the new structure, backfill, switch reads, then drop the old — each step is non-breaking, avoiding downtime.
44. Q7: Why is missing index on a foreign key column a problem?
45. A) It's not; Postgres auto-indexes FKs
46. B) JOINs and parent-row DELETEs become seq scans (*)
47. C) FKs don't work without indexes
48. D) Lookups use too much memory
49. Explanation: Postgres doesn't auto-index FKs; joins and `DELETE FROM parent` (which must check children) become slow without them.
50. Q8: Which is TRUE about surrogate keys?
51. A) They must be UUIDs
52. B) They're always faster than natural keys
53. C) They're opaque, stable, and carry no business meaning (*)
54. D) They replace UNIQUE constraints
55. Explanation: Surrogate keys (id) are system-generated and don't change; pair with a UNIQUE constraint on the natural key for business lookups.
56. Q9: BCNF differs from 3NF in that?
57. A) BCNF allows transitive dependencies
58. B) BCNF only applies to 2-table schemas
59. C) BCNF is weaker than 3NF
60. D) BCNF requires every determinant to be a candidate key (*)
61. Explanation: BCNF is stricter: every determinant (LHS of a functional dependency) must be a candidate key; 3NF allows exceptions for trivial cases.
62. Q10: Which is the recommended PK type for new Postgres schemas?
63. A) bigint GENERATED ALWAYS AS IDENTITY (*)
64. B) SERIAL
65. C) BIGSERIAL
66. D) AUTO_INCREMENT
67. Explanation: IDENTITY is the SQL:2003 standard, supports GENERATED ALWAYS BY DEFAULT, and dumps cleanly — preferred over SERIAL since Postgres 10.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which normal form removes transitive dependencies (non-key cols depending on other non-key cols)?
  options:
    - 1NF
    - 2NF
    - 4NF
    - 3NF
  correctIndex: 3
  explanation: 3NF requires non-key columns to depend on nothing but the key (no transitive dependencies); BCNF is stricter.
- id: q2
  question: What does an EXCLUDE constraint with `tstzrange WITH &&` prevent?
  options:
    - Overlapping time ranges on the same key
    - NULL ranges
    - Negative durations
    - Duplicate IDs
  correctIndex: 0
  explanation: "&& is the range-overlap operator; EXCLUDE USING gist (key WITH =, range WITH &&) blocks double-bookings."
- id: q3
  question: Why are lookup tables preferred over enums for evolving domains?
  options:
    - Lookups are faster
    - Adding a value is a simple INSERT; removing requires no ALTER TYPE
    - Enums can't be indexed
    - Lookups don't need FKs
  correctIndex: 1
  explanation: ALTER TYPE ADD VALUE is a multi-step migration and removes aren't supported easily; lookup tables evolve via INSERT/DELETE.
- id: q4
  question: What's the default ON DELETE behavior for a foreign key?
  options:
    - CASCADE
    - SET NULL
    - NO ACTION (raises on violation)
    - SET DEFAULT
  correctIndex: 2
  explanation: Without explicit ON DELETE, Postgres uses NO ACTION which raises if a referenced row is deleted; pick CASCADE/SET NULL intentionally.
- id: q5
  question: Which is a benefit of UUID primary keys?
  options:
    - Smaller index size
    - Sequential and ordered
    - Faster joins
    - Client-generated, supports sharding and idempotent inserts
  correctIndex: 3
  explanation: UUIDs let clients generate IDs ahead of insert, avoiding a round-trip; they shard naturally but bloat indexes vs bigint.
- id: q6
  question: What problem does expand-then-contract solve?
  options:
    - Zero-downtime schema migrations in production
    - Long-running transactions
    - Replication lag
    - Index bloat
  correctIndex: 0
  explanation: Add the new structure, backfill, switch reads, then drop the old — each step is non-breaking, avoiding downtime.
- id: q7
  question: Why is missing index on a foreign key column a problem?
  options:
    - It's not; Postgres auto-indexes FKs
    - JOINs and parent-row DELETEs become seq scans
    - FKs don't work without indexes
    - Lookups use too much memory
  correctIndex: 1
  explanation: Postgres doesn't auto-index FKs; joins and `DELETE FROM parent` (which must check children) become slow without them.
- id: q8
  question: Which is TRUE about surrogate keys?
  options:
    - They must be UUIDs
    - They're always faster than natural keys
    - They're opaque, stable, and carry no business meaning
    - They replace UNIQUE constraints
  correctIndex: 2
  explanation: Surrogate keys (id) are system-generated and don't change; pair with a UNIQUE constraint on the natural key for business lookups.
- id: q9
  question: BCNF differs from 3NF in that?
  options:
    - BCNF allows transitive dependencies
    - BCNF only applies to 2-table schemas
    - BCNF is weaker than 3NF
    - BCNF requires every determinant to be a candidate key
  correctIndex: 3
  explanation: "BCNF is stricter: every determinant (LHS of a functional dependency) must be a candidate key; 3NF allows exceptions for trivial cases."
- id: q10
  question: Which is the recommended PK type for new Postgres schemas?
  options:
    - bigint GENERATED ALWAYS AS IDENTITY
    - SERIAL
    - BIGSERIAL
    - AUTO_INCREMENT
  correctIndex: 0
  explanation: IDENTITY is the SQL:2003 standard, supports GENERATED ALWAYS BY DEFAULT, and dumps cleanly — preferred over SERIAL since Postgres 10.
```

