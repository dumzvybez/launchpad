---
slug: postgresql-full-text-search-tsvector-tsquery
id: postgresql-11
track: postgresql
order: 11
title: Full-Text Search with tsvector and tsquery
description: Build fast, relevant full-text search using tsvector, tsquery, GIN indexes, ranking, and highlighting — Postgres's built-in alternative to Elasticsearch for many use cases.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=12000s
whyItMatters: Build fast, relevant full-text search using tsvector, tsquery, GIN indexes, ranking, and highlighting — Postgres's built-in alternative to Elasticsearch for many use cases.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Full-Text Search with tsvector and tsquery

## Full-Text Search with tsvector and tsquery

### Why It Matters

Build fast, relevant full-text search using tsvector, tsquery, GIN indexes, ranking, and highlighting — Postgres's built-in alternative to Elasticsearch for many use cases.

Build fast, relevant full-text search using tsvector, tsquery, GIN indexes, ranking, and highlighting — Postgres's built-in alternative to Elasticsearch for many use cases.

### Prerequisites

- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN
- Stage 6: Advanced Types — JSONB, Arrays, Hstore, Enums, Composite

### Topics

- tsvector (parsed document) and tsquery (parsed query)
- to_tsvector, to_tsquery, plainto_tsquery, phraseto_tsquery, websearch_to_tsquery
- GIN index on tsvector for fast lookup
- Ranking: ts_rank, ts_rank_cd (cover density)
- Highlighting: ts_headline
- Configuration: text search configs, dictionaries, stemming, stop words
- Multi-language search and per-column configs
- Generated tsvector column for performance

### Key Concepts

- A tsvector is a sorted list of (lexeme, positions) — words reduced to stems with positional info; a tsquery is a parsed boolean query (and/or/not/phrase).
- `websearch_to_tsquery` is the user-friendly parser — accepts "quoted phrases", OR, and minus for negation, like Google. Use it for end-user input.
- Stemming and stop words: "running" → "run", "the" is dropped — this is config-based (english, simple, etc.) and matches across conjugations.
- GIN index on tsvector is the standard; `gin_pending_list_limit` controls the fastupdate tradeoff (faster inserts, slower queries until cleanup).
- `ts_rank` scores by term frequency; `ts_rank_cd` (cover density) rewards terms closer together — usually better for "is the whole document about this?".
- A GENERATED tsvector column consolidates multiple columns with weights (A=1.0, B=0.4, C=0.2, D=0.1) so titles rank higher than body text.
- Postgres FTS is good for millions of documents and tens of thousands of QPS; beyond that, you may need Elasticsearch — but start here.

```sql
-- Parse a document and a query:
SELECT to_tsvector('english', 'The quick brown fox jumps over the lazy dog');
-- 'brown':3 'dog':9 'fox':4 'jumps':5 'lazy':8 'quick':2

SELECT websearch_to_tsquery('english', 'quick fox -dog');
-- 'quick' & 'fox' & !'dog'

-- Match (uses GIN if available):
SELECT to_tsvector('english', body) @@ websearch_to_tsquery('english', 'fox');
```
Caption: Basic tsvector and tsquery

### Common Pitfalls

- Forgetting the GIN index on tsvector — `to_tsvector(...) @@ to_tsquery(...)` without an index is a Seq Scan on the table; create a GIN index or use a generated tsvector column with a GIN.
- Using `to_tsquery` on user input — it requires operators (`&`, `|`, `!`) and raises on syntax errors; use `websearch_to_tsquery` or `plainto_tsquery` for user input.
- Mismatched text search configs — index with `english`, query with `simple` → no matches; the config must match between index and query.
- Ignoring weights — without `setweight`, all columns are equal; users expect title matches to rank higher than body matches. Use weights A/B/C/D.
- Not using ts_headline for snippets — returning the full body is huge over the wire; ts_headline generates compact snippets with `<b>` highlighting.

### Real-World Applications

- Reddit uses Postgres FTS for subreddit and comment search at massive scale before adding Elasticsearch for some workloads.
- Discord uses Postgres FTS over message history for in-app search within servers.
- Spotify uses Postgres FTS for podcast episode metadata search.
- Twitch uses Postgres FTS for stream-title and category search.

### Interview Questions

- 1. What's the difference between to_tsvector and to_tsquery? — to_tsvector parses a document into lexemes; to_tsquery parses a boolean query. The @@ operator tests if the vector matches the query.
- 2. Which tsquery parser should you use for end-user input? — websearch_to_tsquery (accepts "quotes", OR, and -minus like Google); to_tsquery requires operators and raises on bad syntax.
- 3. What do weights A/B/C/D do in ts_rank? — They weight terms from different columns; A=1.0 (usually title), B=0.4, C=0.2, D=0.1. Use setweight() to apply.
- 4. Why use a GENERATED tsvector column? — It consolidates multiple columns with weights into one indexed tsvector, avoiding re-parsing on every query.
- 5. When does Postgres FTS lose to Elasticsearch? — At very high QPS or very large corpora (100M+ docs) with complex facets; Postgres FTS is fine for most apps and avoids a second datastore.

### Mini Project

Build a Blog Search Engine: For a `post` table with title and body, add a generated tsvector column combining title (weight A) and body (weight B), a GIN index, and a `search_posts(query text)` SQL function returning top 20 matches with rank and ts_headline snippet. Support phrase search via quotes (websearch_to_tsquery handles it). Suggested approach:
  - Use `setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(body, '')), 'B')` for the generated column
  - Create the GIN index on the generated column
  - Function body: `SELECT id, title, ts_rank(search, q) AS rank, ts_headline('english', body, q, 'MaxFragments=3') AS snippet FROM post, websearch_to_tsquery('english', $1) q WHERE search @@ q ORDER BY rank DESC LIMIT 20`
  - Mark the function STABLE
  - Test with single word, phrase (quoted), and negation (`-word`)

### Exercises

1. Use to_tsvector on a paragraph and observe the lexemes and positions; verify "running" stems to "run".
2. Create a GIN index on a tsvector column; run a search with EXPLAIN to verify the index is used.
3. Use websearch_to_tsquery with "quoted phrase" and observe the <-> (followed by) operator in the parsed query.
4. Use ts_headline to generate a snippet with `<b>` highlighting around match terms.
5. Create a multi-column tsvector with setweight and verify a title match ranks higher than a body match.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does to_tsvector do?
9. A) Parses a query
10. B) Highlights matches
11. C) Parses a document into sorted lexemes with positions (*)
12. D) Ranks documents
13. Explanation: to_tsvector parses text into a sorted list of (lexeme, positions), applying stemming and stop-word removal. to_tsquery parses a query; @@ tests matches.
14. Q2: Which tsquery parser is best for end-user input?
15. A) to_tsquery
16. B) plainto_tsquery
17. C) phraseto_tsquery
18. D) websearch_to_tsquery (*)
19. Explanation: websearch_to_tsquery accepts "quoted phrases", OR, and -minus like Google and is robust to bad syntax. to_tsquery requires operators and raises on errors.
20. Q3: What index type is standard for a tsvector column?
21. A) GIN (*)
22. B) B-tree
23. C) Hash
24. D) BRIN
25. Explanation: GIN supports the @@ operator on tsvector; B-tree does not. The index is created as `USING gin (col)` on the tsvector column.
26. Q4: What do weights A, B, C, D do in ts_rank?
27. A) They sort results
28. B) They weight terms from different columns (A=1.0, B=0.4, C=0.2, D=0.1) (*)
29. C) They filter stop words
30. D) They enable phrase search
31. Explanation: setweight() assigns a weight to each tsvector; ts_rank uses the weights so title (A) matches rank higher than body (B) matches.
32. Q5: Why use a GENERATED tsvector column?
33. A) It's required for GIN
34. B) To enable phrase search
35. C) To consolidate multiple columns with weights into one indexed column, avoiding re-parsing (*)
36. D) It's the only way to filter stop words
37. Explanation: A GENERATED tsvector column stores the combined, weighted vector; queries reference one column and reuse the index. Re-parsing on every query is slow.
38. Q6: What does `to_tsquery('quick <3> fox')` mean?
39. A) quick AND fox
40. B) quick OR fox
41. C) quick NOT fox
42. D) quick within 3 words of fox (proximity) (*)
43. Explanation: `<N>` is the proximity operator — matches when the lexemes are within N words of each other. <-> is the strict "followed by" operator (distance 1).
44. Q7: Which is TRUE about text search configs?
45. A) The config used for indexing must match the config used for querying (*)
46. B) All configs are the same
47. C) Configs only affect ranking
48. D) Configs are required for GIN
49. Explanation: Stemming and stop words differ per config (english, french, simple); index with one config and query with another yields zero matches.
50. Q8: What does ts_headline do?
51. A) Returns the title
52. B) Generates a snippet with <b> highlighting around match terms (*)
53. C) Removes stop words
54. D) Computes rank
55. Explanation: ts_headline produces a compact snippet of the body with match terms wrapped in <b>...</b>; configurable via MaxWords, MinWords, MaxFragments.
56. Q9: Why might you choose Postgres FTS over Elasticsearch?
57. A) It's always faster
58. B) Postgres FTS supports more languages
59. C) For most apps, it's good enough and avoids a second datastore to operate (*)
60. D) Postgres FTS scales infinitely
61. Explanation: Postgres FTS handles millions of documents and high QPS for most apps; Elasticsearch adds operational complexity. Start with Postgres; add ES only when you outgrow it.
62. Q10: What does `setweight(to_tsvector('english', title), 'A')` do?
63. A) Sorts by title
64. B) Filters stop words
65. C) Concatenates with body
66. D) Marks the title's lexemes with weight A so they rank higher (*)
67. Explanation: setweight assigns weight A (highest, 1.0) to the title's lexemes; concatenating with setweight(body, 'B') gives title matches priority in ts_rank.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does to_tsvector do?
  options:
    - Parses a query
    - Highlights matches
    - Parses a document into sorted lexemes with positions
    - Ranks documents
  correctIndex: 2
  explanation: to_tsvector parses text into a sorted list of (lexeme, positions), applying stemming and stop-word removal. to_tsquery parses a query; @@ tests matches.
- id: q2
  question: Which tsquery parser is best for end-user input?
  options:
    - to_tsquery
    - plainto_tsquery
    - phraseto_tsquery
    - websearch_to_tsquery
  correctIndex: 3
  explanation: websearch_to_tsquery accepts "quoted phrases", OR, and -minus like Google and is robust to bad syntax. to_tsquery requires operators and raises on errors.
- id: q3
  question: What index type is standard for a tsvector column?
  options:
    - GIN
    - B-tree
    - Hash
    - BRIN
  correctIndex: 0
  explanation: GIN supports the @@ operator on tsvector; B-tree does not. The index is created as `USING gin (col)` on the tsvector column.
- id: q4
  question: What do weights A, B, C, D do in ts_rank?
  options:
    - They sort results
    - They weight terms from different columns (A=1.0, B=0.4, C=0.2, D=0.1)
    - They filter stop words
    - They enable phrase search
    - matches rank higher than body (B) matches.
  correctIndex: 1
  explanation: setweight() assigns a weight to each tsvector; ts_rank uses the weights so title (A) matches rank higher than body (B) matches.
- id: q5
  question: Why use a GENERATED tsvector column?
  options:
    - It's required for GIN
    - To enable phrase search
    - To consolidate multiple columns with weights into one indexed column, avoiding re-parsing
    - It's the only way to filter stop words
  correctIndex: 2
  explanation: A GENERATED tsvector column stores the combined, weighted vector; queries reference one column and reuse the index. Re-parsing on every query is slow.
- id: q6
  question: What does `to_tsquery('quick <3> fox')` mean?
  options:
    - quick AND fox
    - quick OR fox
    - quick NOT fox
    - quick within 3 words of fox (proximity)
  correctIndex: 3
  explanation: '`<N>` is the proximity operator — matches when the lexemes are within N words of each other. <-> is the strict "followed by" operator (distance 1).'
- id: q7
  question: Which is TRUE about text search configs?
  options:
    - The config used for indexing must match the config used for querying
    - All configs are the same
    - Configs only affect ranking
    - Configs are required for GIN
  correctIndex: 0
  explanation: Stemming and stop words differ per config (english, french, simple); index with one config and query with another yields zero matches.
- id: q8
  question: What does ts_headline do?
  options:
    - Returns the title
    - Generates a snippet with <b> highlighting around match terms
    - Removes stop words
    - Computes rank
  correctIndex: 1
  explanation: ts_headline produces a compact snippet of the body with match terms wrapped in <b>...</b>; configurable via MaxWords, MinWords, MaxFragments.
- id: q9
  question: Why might you choose Postgres FTS over Elasticsearch?
  options:
    - It's always faster
    - Postgres FTS supports more languages
    - For most apps, it's good enough and avoids a second datastore to operate
    - Postgres FTS scales infinitely
  correctIndex: 2
  explanation: Postgres FTS handles millions of documents and high QPS for most apps; Elasticsearch adds operational complexity. Start with Postgres; add ES only when you outgrow it.
- id: q10
  question: What does `setweight(to_tsvector('english', title), 'A')` do?
  options:
    - Sorts by title
    - Filters stop words
    - Concatenates with body
    - Marks the title's lexemes with weight A so they rank higher
  correctIndex: 3
  explanation: setweight assigns weight A (highest, 1.0) to the title's lexemes; concatenating with setweight(body, 'B') gives title matches priority in ts_rank.
```

