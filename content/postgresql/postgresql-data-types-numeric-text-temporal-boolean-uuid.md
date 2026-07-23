---
slug: postgresql-data-types-numeric-text-temporal-boolean-uuid
id: postgresql-03
track: postgresql
order: 3
title: Data Types — Numeric, Text, Temporal, Boolean, UUID
description: Master Postgres's rich type system — exact-decimal numerics, variable- and fixed-length text, dates and times with and without timezones, booleans, and UUIDs — and learn which to choose for each column.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=2400s
whyItMatters: Master Postgres's rich type system — exact-decimal numerics, variable- and fixed-length text, dates and times with and without timezones, booleans, and UUIDs — and learn which to choose for each column.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Data Types — Numeric, Text, Temporal, Boolean, UUID

## Data Types — Numeric, Text, Temporal, Boolean, UUID

### Why It Matters

Master Postgres's rich type system — exact-decimal numerics, variable- and fixed-length text, dates and times with and without timezones, booleans, and UUIDs — and learn which to choose for each column.

Master Postgres's rich type system — exact-decimal numerics, variable- and fixed-length text, dates and times with and without timezones, booleans, and UUIDs — and learn which to choose for each column.

### Prerequisites

- Stage 1: Getting Started with PostgreSQL
- Stage 2: psql, createdb, and Database Administration Basics

### Topics

- Numeric types: smallint, integer, bigint, numeric/decimal, real, double precision, serial/IDENTITY
- Text types: text vs varchar(N) vs char(N) — and why varchar(N) is mostly a CHECK constraint
- Temporal types: date, time, timetz, timestamp, timestamptz, interval
- Boolean: true/false/'t'/'f'/'1'/'0'/'yes'/'no' casts
- UUID: the uuid type, gen_random_uuid() (pgcrypto or PG13+ core), uuid-ossp
- The money type (avoid it — use numeric(19,4))
- Bytea and large objects (lo) for binary blobs — and why you should usually use object storage
- Sequences and IDENTITY columns, and the gap myth

### Key Concepts

- `numeric(p, s)` is exact decimal arithmetic — use it for money and anything where rounding matters; it's slower than bigint but correct.
- `text` and `varchar` have identical performance in Postgres (no length prefix differences); `varchar(N)` adds only a length CHECK; prefer `text` unless you need a limit.
- `timestamptz` stores a UTC instant; the "tz" is not stored — it's applied on display using the session's `timezone` setting. Use timestamptz for nearly everything; bare `timestamp` is a footgun.
- UUIDs from `gen_random_uuid()` are v4 (random); great for distributed systems and avoiding sequence contention, but bigger (16 bytes) and unordered (bad for B-tree locality).
- Sequences are not transactional — a rolled-back INSERT still consumes a number, so IDENTITY columns have gaps by design; this is correct behavior, not a bug.
- `interval` arithmetic is precise for months/days but seconds math crosses DST boundaries carefully — use `interval` for date math, not integer seconds.

```sql
CREATE TABLE invoice (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Money is exact decimal; never use real/double for currency.
    amount      numeric(19, 4) NOT NULL CHECK (amount >= 0),
    tax_rate    numeric(5, 4)  NOT NULL CHECK (tax_rate BETWEEN 0 AND 1),
    created_at  timestamptz    NOT NULL DEFAULT now()
);

-- 0.1 + 0.2 with double precision gives 0.30000000000000004;
-- with numeric it is exactly 0.3.
SELECT 0.1::numeric + 0.2::numeric AS exact_sum,        -- 0.3
       0.1::float8   + 0.2::float8   AS float_sum;       -- 0.30000000000000004

-- Tax computation that must round to the cent:
SELECT amount, (amount * tax_rate)::numeric(19, 2) AS tax
FROM invoice;
```
Caption: Numeric types and exact math

### Common Pitfalls

- Using `double precision` for currency — floating-point rounding compounds; use `numeric(19, 4)` (4 decimal places of precision, 2 for cents plus 2 for fractional cents in tax math).
- Using bare `timestamp` (without tz) — you lose the timezone and queries joining data from multiple timezones silently corrupt; use `timestamptz` for nearly everything.
- Choosing UUID primary keys without considering index locality — random UUIDs fragment B-tree indexes and cause write amplification; consider UUIDv7 (time-ordered) for high-write tables.
- Forgetting that sequences have gaps — a rolled-back INSERT consumes a number; this is by design (sequences are not transactional for performance) and not a bug.
- Using `char(N)` for fixed-length text — it blank-pads and silently strips on input; `text` or `varchar(N)` is almost always what you want.

### Real-World Applications

- Stripe stores every charge as `numeric(19,4)` to ensure sub-cent tax math is exact across 135+ currencies.
- Discord uses UUID-like snowflake IDs for messages to avoid sequence contention across thousands of shards.
- Spotify uses timestamptz throughout its play-event pipeline so regional rollups are consistent across timezones.
- Apple's App Store billing uses numeric for prices and tax computations to comply with regional tax law down to the cent.

### Interview Questions

- 1. Why use `numeric` instead of `double precision` for money? — Floating-point can't represent 0.10 exactly; numeric is exact decimal arithmetic, mandatory for currency.
- 2. What's the difference between `timestamp` and `timestamptz`? — timestamptz stores UTC and displays in the session timezone; bare timestamp has no timezone and is dangerous for cross-region data.
- 3. Is `varchar(N)` faster than `text` in Postgres? — No; they share the same varlena storage. varchar(N) only adds a length CHECK constraint.
- 4. Why do IDENTITY/sequence columns have gaps? — Sequences are not transactional; rolled-back INSERTs still consume numbers, which avoids lock contention.
- 5. When should you avoid UUID primary keys? — On high-write tables where index locality matters (random UUIDs fragment B-trees); consider UUIDv7 or bigint IDENTITY instead.

### Mini Project

Build a Currency-Aware Invoice Table: A schema with `invoice`, `line_item`, and `currency` tables. Invoice has a numeric(19,4) total, a FK to currency (ISO 4217 code), and a timestamptz issued_at; line_item has quantity, unit_price (numeric), and a computed subtotal via a GENERATED column. Suggested approach:
  - Use `numeric(19,4)` for all money columns
  - Add a CHECK that issued_at <= now() (no future invoices)
  - Use a GENERATED ALWAYS column for subtotal: `subtotal numeric(19,4) GENERATED ALWAYS AS (quantity * unit_price) STORED`
  - Add a trigger or application code to keep invoice.total in sync with SUM(line_item.subtotal)
  - Seed 3 currencies and 10 invoices, verify totals match SUM(line_item.subtotal)

### Exercises

1. Create a table with one column of each numeric type (smallint, int, bigint, numeric, real, double) and insert the same value into each; run `SELECT pg_column_size(col)` to see storage sizes.
2. Demonstrate the float rounding problem: `SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;` (returns false); then show `0.1::numeric + 0.2::numeric = 0.3::numeric;` (returns true).
3. Insert a timestamptz value, change `SET timezone = 'Asia/Tokyo';`, and SELECT — observe the display shift but the stored UTC instant is unchanged.
4. Create a table with a uuid PK defaulting to `gen_random_uuid()`, insert 5 rows without specifying the ID, and verify all IDs are unique.
5. Create a GENERATED column `subtotal` as `quantity * unit_price` (STORED), insert rows, then try to UPDATE subtotal directly — observe the error.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which Postgres type should you use for storing monetary amounts?
9. A) double precision
10. B) real
11. C) numeric(19, 4) (*)
12. D) money
13. Explanation: numeric(19,4) is exact decimal arithmetic; the money type is locale-dependent and deprecated; floats can't represent 0.10 exactly.
14. Q2: What is the difference between timestamp and timestamptz?
15. A) They are identical
16. B) timestamptz is faster
17. C) timestamp stores UTC and timestamptz stores local time
18. D) timestamptz stores UTC and displays in the session timezone; bare timestamp has no timezone (*)
19. Explanation: timestamptz stores an instant (UTC internally) and renders using the session's timezone setting; bare timestamp has no timezone info.
20. Q3: Which is TRUE about varchar(N) vs text in Postgres?
21. A) They have identical storage; varchar(N) only adds a length CHECK (*)
22. B) varchar(N) is faster
23. C) text uses more disk
24. D) varchar(N) is the same as char(N)
25. Explanation: Both use varlena storage; varchar(N) only enforces a max length via an implicit CHECK. char(N) blank-pads and is almost never what you want.
26. Q4: Why do IDENTITY columns sometimes have gaps in their values?
27. A) Bug in the sequence code
28. B) Sequences are not transactional; rolled-back INSERTs still consume a number (*)
29. C) VACUUM reclaims the numbers
30. D) WAL checkpoints reset the counter
31. Explanation: Sequences advance outside transaction control to avoid lock contention; gaps are by design and not a bug.
32. Q5: What does gen_random_uuid() return?
33. A) A UUIDv1 (MAC-based)
34. B) A 16-byte integer
35. C) A UUIDv4 (random) (*)
36. D) A varchar(36)
37. Explanation: gen_random_uuid() returns UUIDv4 (random), available in core since PG13 (previously via pgcrypto); great for distributed systems.
38. Q6: Which type is best for a primary key on a very-high-write table?
39. A) UUIDv4 (random)
40. B) char(36)
41. C) varchar(64)
42. D) bigint IDENTITY (*)
43. Explanation: bigint IDENTITY gives ordered, sequential keys that pack well in B-tree indexes; random UUIDs fragment indexes and cause write amplification on huge tables.
44. Q7: What does the money type use under the hood in Postgres?
45. A) numeric with a locale-specific fractional setting (*)
46. B) float8
47. C) bigint cents
48. D) text
49. Explanation: money is a fixed-point numeric with the scale determined by lc_monetary; it is locale-dependent and almost never what you want.
50. Q8: How many bytes does a uuid column consume on disk (excluding varlena overhead)?
51. A) 8
52. B) 16 (*)
53. C) 24
54. D) 36
55. Explanation: A uuid is 128 bits = 16 bytes; a varchar(36) representation is 37 bytes plus overhead. Always use the uuid type, never text.
56. Q9: Which expression yields the current timestamp in UTC regardless of session timezone?
57. A) now() at time zone 'UTC'
58. B) clock_timestamp()
59. C) now() — it already returns an instant in UTC internally (*)
60. D) current_date
61. Explanation: now() returns timestamptz, which stores an instant (UTC internally); only the display shifts with the session timezone.
62. Q10: What is the correct CHECK constraint for a non-negative money column?
63. A) CHECK (amount > 0)
64. B) CHECK (amount != 0)
65. C) CHECK (amount IS POSITIVE)
66. D) CHECK (amount >= 0) (*)
67. Explanation: CHECK (amount >= 0) allows zero (refunds, voids) and rejects negatives; CHECK (amount > 0) rejects valid zero amounts.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which Postgres type should you use for storing monetary amounts?
  options:
    - double precision
    - real
    - numeric(19, 4)
    - money
  correctIndex: 2
  explanation: numeric(19,4) is exact decimal arithmetic; the money type is locale-dependent and deprecated; floats can't represent 0.10 exactly.
- id: q2
  question: What is the difference between timestamp and timestamptz?
  options:
    - They are identical
    - timestamptz is faster
    - timestamp stores UTC and timestamptz stores local time
    - timestamptz stores UTC and displays in the session timezone; bare timestamp has no timezone
  correctIndex: 3
  explanation: timestamptz stores an instant (UTC internally) and renders using the session's timezone setting; bare timestamp has no timezone info.
- id: q3
  question: Which is TRUE about varchar(N) vs text in Postgres?
  options:
    - vs text in Postgres?
    - They have identical storage; varchar(N) only adds a length CHECK
    - varchar(N) is faster
    - text uses more disk
    - varchar(N) is the same as char(N)
    - only enforces a max length via an implicit CHECK. char(N) blank-pads and is almost never what you want.
  correctIndex: 1
  explanation: Both use varlena storage; varchar(N) only enforces a max length via an implicit CHECK. char(N) blank-pads and is almost never what you want.
- id: q4
  question: Why do IDENTITY columns sometimes have gaps in their values?
  options:
    - Bug in the sequence code
    - Sequences are not transactional; rolled-back INSERTs still consume a number
    - VACUUM reclaims the numbers
    - WAL checkpoints reset the counter
  correctIndex: 1
  explanation: Sequences advance outside transaction control to avoid lock contention; gaps are by design and not a bug.
- id: q5
  question: What does gen_random_uuid() return?
  options:
    - A UUIDv1 (MAC-based)
    - A 16-byte integer
    - A UUIDv4 (random)
    - A varchar(36)
  correctIndex: 2
  explanation: gen_random_uuid() returns UUIDv4 (random), available in core since PG13 (previously via pgcrypto); great for distributed systems.
- id: q6
  question: Which type is best for a primary key on a very-high-write table?
  options:
    - UUIDv4 (random)
    - char(36)
    - varchar(64)
    - bigint IDENTITY
  correctIndex: 3
  explanation: bigint IDENTITY gives ordered, sequential keys that pack well in B-tree indexes; random UUIDs fragment indexes and cause write amplification on huge tables.
- id: q7
  question: What does the money type use under the hood in Postgres?
  options:
    - numeric with a locale-specific fractional setting
    - float8
    - bigint cents
    - text
  correctIndex: 0
  explanation: money is a fixed-point numeric with the scale determined by lc_monetary; it is locale-dependent and almost never what you want.
- id: q8
  question: How many bytes does a uuid column consume on disk (excluding varlena overhead)?
  options:
    - "8"
    - "16"
    - "24"
    - "36"
  correctIndex: 1
  explanation: A uuid is 128 bits = 16 bytes; a varchar(36) representation is 37 bytes plus overhead. Always use the uuid type, never text.
- id: q9
  question: Which expression yields the current timestamp in UTC regardless of session timezone?
  options:
    - now() at time zone 'UTC'
    - clock_timestamp()
    - now() — it already returns an instant in UTC internally
    - current_date
  correctIndex: 2
  explanation: now() returns timestamptz, which stores an instant (UTC internally); only the display shifts with the session timezone.
- id: q10
  question: What is the correct CHECK constraint for a non-negative money column?
  options:
    - CHECK (amount > 0)
    - CHECK (amount != 0)
    - CHECK (amount IS POSITIVE)
    - CHECK (amount >= 0)
  correctIndex: 3
  explanation: CHECK (amount >= 0) allows zero (refunds, voids) and rejects negatives; CHECK (amount > 0) rejects valid zero amounts.
```

