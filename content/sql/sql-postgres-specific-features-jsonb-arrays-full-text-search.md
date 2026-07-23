---
slug: sql-postgres-specific-features-jsonb-arrays-full-text-search
id: sql-13
track: sql
order: 13
title: Postgres-Specific Features — JSONB, Arrays, Full-Text Search
description: Use Postgres' superpowers — JSONB for flexible schema, arrays for multi-value columns, and built-in full-text search with tsvector and GIN indexes — and learn the right tool for each job.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=8300s
whyItMatters: Use Postgres' superpowers — JSONB for flexible schema, arrays for multi-value columns, and built-in full-text search with tsvector and GIN indexes — and learn the right tool for each job.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Postgres-Specific Features — JSONB, Arrays, Full-Text Search

## Postgres-Specific Features — JSONB, Arrays, Full-Text Search

### Why It Matters

Use Postgres' superpowers — JSONB for flexible schema, arrays for multi-value columns, and built-in full-text search with tsvector and GIN indexes — and learn the right tool for each job.

Use Postgres' superpowers — JSONB for flexible schema, arrays for multi-value columns, and built-in full-text search with tsvector and GIN indexes — and learn the right tool for each job.

### Prerequisites

- Stage 12: Triggers, Functions, and User-Defined Types.
- Familiarity with GIN indexes from Stage 9.

### Topics

- JSON vs JSONB (storage and semantics)
- JSONB operators: ->, ->>, #>, #>>, @>, <@, ?, ?|, ?&
- jsonb_build_object, jsonb_agg, jsonb_set, jsonb_strip_nulls
- GIN index on jsonb (jsonb_path_ops)
- Arrays: int[], text[], array_agg, unnest, array_length
- Full-text search: tsvector, tsquery, to_tsvector, plainto_tsquery, websearch_to_tsquery
- GIN index on tsvector
- Ranking with ts_rank, ts_rank_cd; headline with ts_headline

### Key Concepts

- JSONB stores parsed binary JSON — slower to write, faster to read, supports indexing; JSON stores text — keeps formatting, can't be indexed meaningfully.
- `->` returns jsonb; `->>` returns text; the latter is what you usually want in WHERE.
- `@>` (contains) is the most common query operator and uses the GIN index; plan for it.
- Arrays are first-class in Postgres (int[], text[]) but a normalized table is often a better design — use arrays for tags, not for entities.
- tsvector is the indexed document representation; tsquery is the search query; GIN indexes the tsvector.
- `websearch_to_tsquery` accepts Google-style input ("postgres jsonb" -mysql) and is safer than `to_tsquery` (which requires & | operators).

```sql
CREATE TABLE event (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    payload     jsonb NOT NULL
);

CREATE INDEX idx_event_payload_gin ON event USING gin (payload jsonb_path_ops);

-- Containment query (uses the GIN index)
SELECT id, payload->>'type' AS type, payload->'user'->>'id' AS user_id
FROM event
WHERE payload @> '{"type": "click", "user": {"country": "US"}}'
ORDER BY occurred_at DESC
LIMIT 100;
```
Caption: JSONB column with GIN index

### Common Pitfalls

- JSON vs JSONB confusion — JSON preserves text and whitespace; JSONB is parsed and indexed. Use JSONB unless you need exact text preservation.
- Missing GIN index — `payload @> '...'` without a GIN index scans the whole table; add `USING gin (payload jsonb_path_ops)`.
- Using `->>` to filter when `@>` would use the index — `payload->>'type' = 'click'` doesn't use GIN; rewrite as `payload @> '{"type":"click"}'`.
- Arrays as entities — storing IDs in an array breaks normalization; use a join table for entities, arrays only for tags/labels.
- to_tsquery with raw user input — accepts & | ! operators that break on plain input; prefer websearch_to_tsquery for end-user queries.

### Real-World Applications

- Stripe stores webhook payloads as JSONB with a GIN index for compliance searches.
- Airbnb stores listing amenities as text[] with array-contains filters (`amenities @> ARRAY['wifi']`).
- LinkedIn's article search uses tsvector + GIN for keyword relevance with ts_rank scoring.
- Uber's event ingestion uses JSONB columns for variable event payloads, indexed by GIN for analytics queries.

### Interview Questions

- 1. Difference between JSON and JSONB? — JSON stores text verbatim; JSONB stores parsed binary, supports indexing and removes whitespace/duplicate keys.
- 2. When does `payload @> '...'` use an index? — When a GIN index (often jsonb_path_ops) exists on the payload column; `payload->>'x' = 'y'` does not.
- 3. What does `->` vs `->>` return? — `->` returns jsonb (chained access); `->>` returns text (the value as a string).
- 4. When should you use a tsvector GENERATED column? — When you want a single indexable search column derived from title/body without manual maintenance.
- 5. Why prefer websearch_to_tsquery over to_tsquery? — It accepts Google-style input ("postgres -mysql") and won't break on plain user input; to_tsquery requires explicit & | operators.

### Mini Project

Build a Product Search Service: A `product` table with title, description, specs (jsonb), tags (text[]). Full-text search across title+description with ranked snippets, plus a faceted filter on specs (e.g. specs @> '{"color":"red"}') and tags. Suggested approach:
  - Use a GENERATED tsvector column weighted A on title, B on description
  - Add GIN index on tsvector and on specs (jsonb_path_ops)
  - Add GIN index on tags (array_ops)
  - Compose: WHERE search @@ q AND specs @> $1 AND tags @> $2 ORDER BY ts_rank DESC
  - Return id, title, ts_headline snippet, and matching specs

### Exercises

1. Create a table with a JSONB column; insert 5 rows; query with `payload @> '{"type":"click"}'`.
2. Add a GIN jsonb_path_ops index; verify the plan uses it.
3. Use jsonb_agg to produce a JSON array of a customer's payments.
4. Create an article table with a GENERATED tsvector column and GIN index; search for "postgres jsonb".
5. Use websearch_to_tsquery for "postgres -mysql" and verify MySQL results are excluded.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which JSON type supports GIN indexing in Postgres?
9. A) JSONB (*)
10. B) JSON
11. C) JSONPath
12. D) Both JSON and JSONB
13. Explanation: JSONB is the parsed binary form that supports GIN/GiST indexing; JSON is stored as text and can't be efficiently indexed for content queries.
14. Q2: Which operator tests JSONB containment (uses GIN index)?
15. A) ->
16. B) @> (*)
17. C) ->>
18. D) ?
19. Explanation: @> (contains) is the workhorse containment operator that uses the GIN index; -> and ->> are accessors that don't use it.
20. Q3: What does `payload -> 'user' ->> 'id'` return?
21. A) A jsonb object
22. B) An integer
23. C) The text value of payload.user.id (*)
24. D) An array
25. Explanation: -> keeps the result as jsonb (chaining); ->> returns the leaf as text — what you typically want in WHERE and SELECT.
26. Q4: Why prefer jsonb_path_ops GIN index over the default jsonb_ops?
27. A) It's required by SQL
28. B) It supports all operators
29. C) It's the default
30. D) Smaller index, faster @> queries, but supports only @> (no ?/?) (*)
31. Explanation: jsonb_path_ops is more compact and faster for @> queries but doesn't support existence checks (?, ?|); pick based on query patterns.
32. Q5: Which tsquery function accepts Google-style input like "postgres -mysql"?
33. A) websearch_to_tsquery (*)
34. B) to_tsquery
35. C) plainto_tsquery
36. D) phraseto_tsquery
37. Explanation: websearch_to_tsquery handles quoted phrases, +/- for include/exclude, and OR — safer than to_tsquery for end-user input.
38. Q6: Which statement creates an indexable search column without manual maintenance?
39. A) A view over to_tsvector
40. B) tsvector GENERATED ALWAYS AS (to_tsvector(...)) STORED (*)
41. C) A trigger that writes a tsvector column
42. D) A stored procedure
43. Explanation: GENERATED STORED columns are computed by Postgres on insert/update and can be GIN-indexed; no trigger needed.
44. Q7: What does `ts_rank(search, q)` return?
45. A) A boolean match
46. B) The number of matches
47. C) A numeric relevance score for ordering results (*)
48. D) The matched terms
49. Explanation: ts_rank returns a float ranking based on term frequency and proximity; ORDER BY ts_rank DESC sorts most-relevant first.
50. Q8: Arrays in Postgres are best used for?
51. A) Storing entities (e.g. users)
52. B) Replacing join tables
53. C) Storing JSONB
54. D) Storing tags, labels, and small fixed-cardinality multi-values (*)
55. Explanation: Arrays are great for tags and small multi-value fields; for entities (with their own attributes), use a normalized join table.
56. Q9: Which operator tests array containment (`arr` has all of these values)?
57. A) @> (*)
58. B) =
59. C) IN
60. D) &&
61. Explanation: `arr @> ARRAY['a','b']` is TRUE if arr contains both 'a' and 'b'; && tests overlap (any match).
62. Q10: Which is a difference between JSON and JSONB?
63. A) JSON is faster to read
64. B) JSON preserves key order and duplicates; JSONB does not (*)
65. C) JSONB doesn't support nested objects
66. D) JSON is binary
67. Explanation: JSONB parses and re-serializes (canonical form, no duplicate keys, no preserved order); JSON keeps the original text exactly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which JSON type supports GIN indexing in Postgres?
  options:
    - JSONB
    - JSON
    - JSONPath
    - Both JSON and JSONB
  correctIndex: 0
  explanation: JSONB is the parsed binary form that supports GIN/GiST indexing; JSON is stored as text and can't be efficiently indexed for content queries.
- id: q2
  question: Which operator tests JSONB containment (uses GIN index)?
  options:
    - ->
    - "@>"
    - ->>
    - "?"
  correctIndex: 1
  explanation: "@> (contains) is the workhorse containment operator that uses the GIN index; -> and ->> are accessors that don't use it."
- id: q3
  question: What does `payload -> 'user' ->> 'id'` return?
  options:
    - A jsonb object
    - An integer
    - The text value of payload.user.id
    - An array
  correctIndex: 2
  explanation: -> keeps the result as jsonb (chaining); ->> returns the leaf as text — what you typically want in WHERE and SELECT.
- id: q4
  question: Why prefer jsonb_path_ops GIN index over the default jsonb_ops?
  options:
    - It's required by SQL
    - It supports all operators
    - It's the default
    - Smaller index, faster @> queries, but supports only @> (no ?/?)
  correctIndex: 3
  explanation: jsonb_path_ops is more compact and faster for @> queries but doesn't support existence checks (?, ?|); pick based on query patterns.
- id: q5
  question: Which tsquery function accepts Google-style input like "postgres -mysql"?
  options:
    - websearch_to_tsquery
    - to_tsquery
    - plainto_tsquery
    - phraseto_tsquery
  correctIndex: 0
  explanation: websearch_to_tsquery handles quoted phrases, +/- for include/exclude, and OR — safer than to_tsquery for end-user input.
- id: q6
  question: Which statement creates an indexable search column without manual maintenance?
  options:
    - A view over to_tsvector
    - tsvector GENERATED ALWAYS AS (to_tsvector(...)) STORED
    - A trigger that writes a tsvector column
    - A stored procedure
  correctIndex: 1
  explanation: GENERATED STORED columns are computed by Postgres on insert/update and can be GIN-indexed; no trigger needed.
- id: q7
  question: What does `ts_rank(search, q)` return?
  options:
    - A boolean match
    - The number of matches
    - A numeric relevance score for ordering results
    - The matched terms
  correctIndex: 2
  explanation: ts_rank returns a float ranking based on term frequency and proximity; ORDER BY ts_rank DESC sorts most-relevant first.
- id: q8
  question: Arrays in Postgres are best used for?
  options:
    - Storing entities (e.g. users)
    - Replacing join tables
    - Storing JSONB
    - Storing tags, labels, and small fixed-cardinality multi-values
  correctIndex: 3
  explanation: Arrays are great for tags and small multi-value fields; for entities (with their own attributes), use a normalized join table.
- id: q9
  question: Which operator tests array containment (`arr` has all of these values)?
  options:
    - "@>"
    - =
    - IN
    - "&&"
  correctIndex: 0
  explanation: "`arr @> ARRAY['a','b']` is TRUE if arr contains both 'a' and 'b'; && tests overlap (any match)."
- id: q10
  question: Which is a difference between JSON and JSONB?
  options:
    - JSON is faster to read
    - JSON preserves key order and duplicates; JSONB does not
    - JSONB doesn't support nested objects
    - JSON is binary
  correctIndex: 1
  explanation: JSONB parses and re-serializes (canonical form, no duplicate keys, no preserved order); JSON keeps the original text exactly.
```

