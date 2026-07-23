---
slug: postgresql-advanced-types-jsonb-arrays-hstore-enums-composite
id: postgresql-06
track: postgresql
order: 6
title: Advanced Types — JSONB, Arrays, Hstore, Enums, Composite
description: Use Postgres's rich type system beyond the basics — JSONB for flexible documents, arrays for tags, hstore for key-value, enums for closed sets, and composite types for structured values.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=6000s
whyItMatters: Use Postgres's rich type system beyond the basics — JSONB for flexible documents, arrays for tags, hstore for key-value, enums for closed sets, and composite types for structured values.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Advanced Types — JSONB, Arrays, Hstore, Enums, Composite

## Advanced Types — JSONB, Arrays, Hstore, Enums, Composite

### Why It Matters

Use Postgres's rich type system beyond the basics — JSONB for flexible documents, arrays for tags, hstore for key-value, enums for closed sets, and composite types for structured values.

Use Postgres's rich type system beyond the basics — JSONB for flexible documents, arrays for tags, hstore for key-value, enums for closed sets, and composite types for structured values.

### Prerequisites

- Stage 3: Data Types — Numeric, Text, Temporal, Boolean, UUID
- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN

### Topics

- JSONB: storage, operators (->, ->>, #>, #>>), @>, <@, ?, ?|, ?&
- JSONB indexing: GIN (jsonb_path_ops), expression indexes on (col->>'key')
- JSONB functions: jsonb_build_object, jsonb_set, jsonb_agg, jsonb_strip_nulls
- JSON vs JSONB: when (rarely) to use JSON; JSONB is almost always right
- Arrays: int[], text[], array_agg, unnest, ANY, @>, &&
- hstore: legacy key-value; use jsonb unless you need GIN on hstore specifically
- Enums: CREATE TYPE ... AS ENUM, migration costs, ALTER TYPE ADD VALUE
- Composite types: CREATE TYPE, used in functions and as columns

### Key Concepts

- JSONB stores a parsed binary representation; JSON stores the original text. JSONB supports indexing and most operators; JSON is for passthrough only.
- JSONB operators: `->` returns jsonb, `->>` returns text; `@>` is containment (uses GIN); `?` checks key existence; `#>` extracts at a path.
- Adding an enum value (`ALTER TYPE mood ADD VALUE 'sleepy'`) requires no table rewrite but cannot run inside a transaction block (PG12 lifted most restrictions, but still be careful).
- Reordering or removing an enum value requires a full rewrite — that's why enums are best for truly closed sets; for changing sets, use a lookup table with a FK.
- Arrays are first-class types with their own operators (`@>` contains, `&&` overlaps, `ANY` membership); they're great for tags but bad for many-to-many relationships (use a join table).
- Composite types let you return structured values from functions and store address-like bundles; they're underused but powerful.
- hstore predates jsonb; there's almost no reason to use it today, but you'll see it in legacy schemas.

```sql
CREATE TABLE event (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    payload    jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO event (payload) VALUES
    ('{"type":"click","page":"/home","user":{"id":42,"plan":"pro"},"tags":["a","b"]}');

SELECT
    payload -> 'type'         AS type_jsonb,    -- "click" (jsonb, with quotes)
    payload ->> 'type'        AS type_text,     -- click (text, no quotes)
    payload #>> '{user,plan}' AS user_plan,     -- pro
    payload -> 'tags' -> 0    AS first_tag      -- "a"
FROM event;

-- Containment (uses GIN if available):
SELECT * FROM event WHERE payload @> '{"type":"click"}';
-- Key existence:
SELECT * FROM event WHERE payload ? 'user';
-- Path existence (any of):
SELECT * FROM event WHERE payload ?| array['user','session'];
```
Caption: JSONB storage and operators

### Common Pitfalls

- Using JSON instead of JSONB — JSON stores text and supports almost no operators or indexes; JSONB is parsed, indexed, and the right choice in 99% of cases.
- Treating JSONB as a schema-less free-for-all — validate required keys with CHECK constraints (`CHECK (payload ? 'type')`) or a JSON Schema check, or you'll have bad data forever.
- Adding enum values inside a transaction block — pre-PG12 this raised; even now it's safer to run as a standalone migration; reordering/removing values requires a full rewrite.
- Using arrays for many-to-many — arrays can't have FKs to other tables and can't model relationships cleanly; use a join table for real relationships.
- Forgetting that `->` returns jsonb (with quotes) and `->>` returns text — confusing them leads to `WHERE payload->'type' = 'click'` (jsonb vs text) returning zero rows.

### Real-World Applications

- Instagram stores post metadata in JSONB columns for flexible schema evolution across billions of rows.
- Discord uses JSONB for message embeds and rich content, with GIN indexes for analytics queries.
- Spotify uses enums for explicit-content flags and track types where the set is truly closed and stable.
- Reddit uses text[] arrays for subreddit tags and post flair, with GIN indexes for tag-based filtering.

### Interview Questions

- 1. What's the difference between JSON and JSONB? — JSON stores the original text; JSONB stores a parsed binary representation that supports indexing and most operators.
- 2. When should you NOT use an enum? — When the set of values is volatile (you'll need to add/remove/reorder); use a lookup table with a FK instead.
- 3. What's the difference between `->` and `->>` on jsonb? — `->` returns jsonb (with quotes); `->>` returns text (no quotes); `->>` is what you want in WHERE clauses comparing to strings.
- 4. How do you index a jsonb column for `@>` (containment) queries? — `CREATE INDEX ... USING gin (col jsonb_path_ops)` — smaller and faster than the default GIN.
- 5. Why are arrays a poor choice for many-to-many relationships? — Arrays can't enforce foreign keys to another table; use a join table for real relationships.

### Mini Project

Build a Tagged Event Store: An `event` table with a jsonb payload and a text[] tags column. Add GIN indexes on both, write 5 queries (by tag, by payload key, by payload containment, by tag overlap, by tag count > N), and add CHECK constraints that require payload to have a 'type' key and tags to be non-empty. Suggested approach:
  - Use `jsonb` with `DEFAULT '{}'::jsonb`
  - Add `CHECK (payload ? 'type')` and `CHECK (coalesce(array_length(tags,1),0) > 0)`
  - Create GIN(payload jsonb_path_ops) and GIN(tags)
  - Demonstrate each query with EXPLAIN showing the index used
  - Show that a missing 'type' key in an INSERT raises the CHECK constraint

### Exercises

1. Create a jsonb column, insert 3 rows, and use each of ->, ->>, #>, #>>, @>, ?, ?| to query them.
2. Create a GIN index with jsonb_path_ops and verify a `@>` query uses it via EXPLAIN.
3. Use `jsonb_set` to update a nested value; confirm the row changed.
4. Create an enum, add a value with ALTER TYPE ADD VALUE, then attempt (and fail) to reorder a value — observe the rewrite cost.
5. Create a text[] column, insert 3 rows, and use `@>`, `&&`, `ANY`, and `unnest` to query it.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is TRUE about JSON vs JSONB in Postgres?
9. A) JSON is faster for queries
10. B) JSONB stores a parsed binary representation and supports indexing (*)
11. C) JSONB is the same as JSON
12. D) JSON preserves key order; JSONB does too
13. Explanation: JSONB is parsed and stored in a binary format, enabling GIN indexes and most operators. JSON stores text and supports almost nothing; use JSONB in 99% of cases.
14. Q2: What does `payload ->> 'type'` return?
15. A) A jsonb value with quotes
16. B) An array
17. C) A text value without quotes (*)
18. D) A boolean
19. Explanation: `->>` returns text; `->` returns jsonb (with quotes). Use `->>` in WHERE clauses comparing to strings to avoid type-mismatch bugs.
20. Q3: Which operator tests jsonb containment (and can use a GIN index)?
21. A) =
22. B) ?
23. C) ->
24. D) @> (*)
25. Explanation: @> tests whether the left jsonb contains the right (e.g. `payload @> '{"type":"click"}'`); this is the operator GIN with jsonb_path_ops accelerates.
26. Q4: What does `ALTER TYPE mood ADD VALUE 'sleepy'` require?
27. A) No rewrite, but historically could not run inside a transaction block (*)
28. B) A full table rewrite
29. C) Restarting the server
30. D) Dropping and recreating the enum
31. Explanation: Adding an enum value is metadata-only (no rewrite), but pre-PG12 it had to be outside a txn block. Reordering or removing a value DOES require a full rewrite.
32. Q5: Why are arrays a poor choice for many-to-many relationships?
33. A) They are slow
34. B) They can't enforce foreign keys to another table (*)
35. C) They use too much disk
36. D) They don't support indexing
37. Explanation: Arrays can't have FKs to other tables; use a join table for real relationships. Arrays are fine for tags/labels where the values are simple scalars.
38. Q6: Which index is best for `tags @> ARRAY['postgres']`?
39. A) B-tree
40. B) Hash
41. C) GIN (*)
42. D) BRIN
43. Explanation: GIN supports the array-containment operator @>; B-tree and Hash do not. The index is created as `USING gin (tags)`.
44. Q7: What does `jsonb_set(payload, '{user,plan}', '"pro"'::jsonb)` do?
45. A) Mutates payload in place
46. B) Deletes the path
47. C) Throws if the path doesn't exist
48. D) Returns a new jsonb with the path set to the new value (*)
49. Explanation: jsonb_set returns a new value (jsonb is immutable); you must assign the result back: `SET payload = jsonb_set(...)`. Use `create_missing` (default true) to add new keys.
50. Q8: Which is a sane CHECK constraint for a jsonb payload?
51. A) CHECK (payload ? 'type') — requires the 'type' key (*)
52. B) CHECK (payload IS NOT NULL)
53. C) CHECK (payload = '{}')
54. D) CHECK (length(payload) < 100)
55. Explanation: CHECK (payload ? 'type') enforces that the required 'type' key exists; pair this with a CHECK on payload->>'type' IN ('click','view') to enforce an enum-like value.
56. Q9: Which is TRUE about hstore?
57. A) It's faster than jsonb
58. B) It predates jsonb; there's almost no reason to use it today (*)
59. C) It's required for GIN indexes
60. D) It's the only way to store key-value data
61. Explanation: hstore is a pre-jsonb extension; jsonb is now the standard for key-value and document data. You may see hstore in legacy schemas but should not introduce it.
62. Q10: What does `SELECT id, tag FROM post, unnest(tags) AS tag` produce?
63. A) One row per post
64. B) An error
65. C) One row per (post, tag) pair (*)
66. D) The first tag of each post
67. Explanation: unnest expands an array into rows; the implicit cross join produces one row per post per tag. Useful for aggregations like "count posts by tag".
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is TRUE about JSON vs JSONB in Postgres?
  options:
    - JSON is faster for queries
    - JSONB stores a parsed binary representation and supports indexing
    - JSONB is the same as JSON
    - JSON preserves key order; JSONB does too
  correctIndex: 1
  explanation: JSONB is parsed and stored in a binary format, enabling GIN indexes and most operators. JSON stores text and supports almost nothing; use JSONB in 99% of cases.
- id: q2
  question: What does `payload ->> 'type'` return?
  options:
    - A jsonb value with quotes
    - An array
    - A text value without quotes
    - A boolean
  correctIndex: 2
  explanation: "`->>` returns text; `->` returns jsonb (with quotes). Use `->>` in WHERE clauses comparing to strings to avoid type-mismatch bugs."
- id: q3
  question: Which operator tests jsonb containment (and can use a GIN index)?
  options:
    - =
    - "?"
    - ->
    - "@>"
  correctIndex: 3
  explanation: "@> tests whether the left jsonb contains the right (e.g. `payload @> '{\"type\":\"click\"}'`); this is the operator GIN with jsonb_path_ops accelerates."
- id: q4
  question: What does `ALTER TYPE mood ADD VALUE 'sleepy'` require?
  options:
    - No rewrite, but historically could not run inside a transaction block
    - A full table rewrite
    - Restarting the server
    - Dropping and recreating the enum
  correctIndex: 0
  explanation: Adding an enum value is metadata-only (no rewrite), but pre-PG12 it had to be outside a txn block. Reordering or removing a value DOES require a full rewrite.
- id: q5
  question: Why are arrays a poor choice for many-to-many relationships?
  options:
    - They are slow
    - They can't enforce foreign keys to another table
    - They use too much disk
    - They don't support indexing
  correctIndex: 1
  explanation: Arrays can't have FKs to other tables; use a join table for real relationships. Arrays are fine for tags/labels where the values are simple scalars.
- id: q6
  question: Which index is best for `tags @> ARRAY['postgres']`?
  options:
    - B-tree
    - Hash
    - GIN
    - BRIN
  correctIndex: 2
  explanation: GIN supports the array-containment operator @>; B-tree and Hash do not. The index is created as `USING gin (tags)`.
- id: q7
  question: What does `jsonb_set(payload, '{user,plan}', '"pro"'::jsonb)` do?
  options:
    - Mutates payload in place
    - Deletes the path
    - Throws if the path doesn't exist
    - Returns a new jsonb with the path set to the new value
  correctIndex: 3
  explanation: "jsonb_set returns a new value (jsonb is immutable); you must assign the result back: `SET payload = jsonb_set(...)`. Use `create_missing` (default true) to add new keys."
- id: q8
  question: Which is a sane CHECK constraint for a jsonb payload?
  options:
    - CHECK (payload ? 'type') — requires the 'type' key
    - CHECK (payload IS NOT NULL)
    - CHECK (payload = '{}')
    - CHECK (length(payload) < 100)
  correctIndex: 0
  explanation: CHECK (payload ? 'type') enforces that the required 'type' key exists; pair this with a CHECK on payload->>'type' IN ('click','view') to enforce an enum-like value.
- id: q9
  question: Which is TRUE about hstore?
  options:
    - It's faster than jsonb
    - It predates jsonb; there's almost no reason to use it today
    - It's required for GIN indexes
    - It's the only way to store key-value data
  correctIndex: 1
  explanation: hstore is a pre-jsonb extension; jsonb is now the standard for key-value and document data. You may see hstore in legacy schemas but should not introduce it.
- id: q10
  question: What does `SELECT id, tag FROM post, unnest(tags) AS tag` produce?
  options:
    - One row per post
    - An error
    - One row per (post, tag) pair
    - The first tag of each post
  correctIndex: 2
  explanation: unnest expands an array into rows; the implicit cross join produces one row per post per tag. Useful for aggregations like "count posts by tag".
```

