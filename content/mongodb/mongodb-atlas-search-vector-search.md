---
slug: mongodb-atlas-search-vector-search
id: mongodb-17
track: mongodb
order: 17
title: Atlas, Search, and Vector Search
description: Use MongoDB Atlas managed service, build full-text search with `$search` (Lucene-based), and add semantic search with `vectorSearch` for RAG applications.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=1080s
whyItMatters: Use MongoDB Atlas managed service, build full-text search with `$search` (Lucene-based), and add semantic search with `vectorSearch` for RAG applications.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Atlas, Search, and Vector Search

## Atlas, Search, and Vector Search

### Why It Matters

Use MongoDB Atlas managed service, build full-text search with `$search` (Lucene-based), and add semantic search with `vectorSearch` for RAG applications.

Use MongoDB Atlas managed service, build full-text search with `$search` (Lucene-based), and add semantic search with `vectorSearch` for RAG applications.

### Prerequisites

- Stage 6 (Indexes including text indexes) and Stage 8 (Aggregation).
- A free MongoDB Atlas account (or local Atlas-compatible setup).

### Topics

- Atlas clusters: M0 free tier, M10+ for production, dedicated tiers
- Atlas Search indexes (Apache Lucene) vs legacy text indexes
- `$search` stage: `text`, `phrase`, `autocomplete`, `queryString`, `regex`
- Relevance scoring with `score: { boost }` and `$meta: "searchScore"`
- Faceted search with `$searchMeta` and `facet`
- Synonyms, analyzers, and custom mappings
- Vector embeddings and `vectorSearch` (Atlas 7.0+)
- RAG pattern: combine `$vectorSearch` with LLM context retrieval

### Key Concepts

- Atlas Search uses Apache Lucene indexes separate from MongoDB's B-tree indexes — purpose-built for full-text search with analyzers, synonyms, and relevance scoring.
- `$search` is an aggregation stage that wraps Lucene; it must be the FIRST stage in a pipeline.
- Atlas Vector Search stores high-dimensional vectors (e.g., 1536-dim OpenAI embeddings) in a vector search index and supports ANN (approximate nearest neighbor) queries via `$vectorSearch`.
- The RAG pattern: embed user query -> `$vectorSearch` for top-K relevant docs -> feed as context to an LLM -> stream the answer.
- Atlas is fully managed: backups, scaling, security, and Search/Vector indexes are operated for you; you pay for the cluster tier and storage.

```javascript
// In Atlas UI or via Atlas CLI / driver, create a search index on the
// products collection over the `name` and `description` fields:
{
  mappings: {
    dynamic: true   // auto-index all string fields; or use `dynamic: false` + explicit fields
  }
  // Or explicit:
  // mappings: { dynamic: false, fields: {
  //   name:        { type: "string" },
  //   description: { type: "string" },
  //   tags:        { type: "string" }
  // } }
}
```
Caption: Create an Atlas Search index

### Common Pitfalls

- Using legacy `text` indexes (Stage 6) when you need ranking, synonyms, or autocomplete — those features require Atlas Search (`$search`); legacy text indexes are equality-style only.
- Forgetting that `$search` MUST be the first stage in the pipeline — MongoDB can't apply a `$match` before `$search` because the search index is separate from MongoDB's B-trees; filter after.
- Using too few `numCandidates` in `$vectorSearch` — ANN trades accuracy for speed; setting `numCandidates` too low returns poor matches (use ~10-20x the `limit`).
- Re-embedding all documents on every model change — embeddings are model-specific; switching models requires re-embedding the whole collection, which is expensive.
- Storing embeddings in the same document as the text and exceeding the 16MB cap — for very large texts, store text in object storage and only the embedding + summary in MongoDB.

### Real-World Applications

- eBay uses Atlas Search for product search with synonyms, autocomplete, and faceted filters across billions of listings.
- Stripe uses Atlas Vector Search to retrieve similar support tickets for客服 agents.
- Adobe uses Atlas Search across Creative Cloud tutorials with custom analyzers for multiple languages.
- Coinbase uses vector search to retrieve similar compliance incidents and prior cases.

### Interview Questions

- 1. What's the difference between a `text` index and Atlas Search? — Legacy `text` indexes are B-tree-based, equality-style, no ranking; Atlas Search uses Apache Lucene with analyzers, synonyms, autocomplete, and relevance scoring.
- 2. Why must `$search` be the first stage in a pipeline? — The search index is separate from MongoDB's B-trees, so MongoDB can't pre-filter with `$match`; you filter AFTER `$search`.
- 3. How does `$vectorSearch` work? — It's an approximate nearest neighbor (ANN) query over a vector index; you provide a query vector and `numCandidates` (pool size) and get the top-K most similar.
- 4. What's the RAG pattern? — Embed the user's query, retrieve top-K relevant docs via `$vectorSearch`, feed them as context to an LLM that generates an answer.
- 5. What's `numCandidates` in vector search? — The size of the ANN candidate pool; too small gives poor results, too large is slow — rule of thumb is 10-20x the `limit`.

### Mini Project

Build a Semantic Doc-Search API: Take a corpus of markdown articles, embed each with an embedding model (OpenAI or local), store in MongoDB with a vector index, and expose `GET /ask?q=` that returns the top 5 relevant articles plus a generated answer. Suggested approach:
  - For each article, generate an embedding (1536-dim) and store `{ title, body, embedding }`
  - Create an Atlas vector search index on `embedding` with `numDimensions: 1536, similarity: "cosine"`
  - On `/ask`, embed the query, run `$vectorSearch` with `numCandidates: 100, limit: 5`
  - Concatenate the top-5 article bodies as LLM context and call the LLM
  - Return `{ answer, sources: [{ title, score }] }` for traceability

### Exercises

1. Create an Atlas free-tier cluster and load 100 product documents.
2. Build an Atlas Search index on `name` and `description`, then run a `$search` query with `score: { $meta: "searchScore" }` and sort by score.
3. Build a faceted search returning top-10 products plus category and price-range facets.
4. Generate embeddings for 50 articles, create a vector index, and run a `$vectorSearch` for a semantic query.
5. >>> QUIZ (Stage 17) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does Atlas Search use under the hood?
8. A) Apache Lucene (*)
9. B) MongoDB B-tree indexes
10. C) Elasticsearch
11. D) PostgreSQL FTS
12. Explanation: Atlas Search indexes are powered by Apache Lucene, providing analyzers, synonyms, autocomplete, and relevance scoring beyond legacy text indexes.
13. Q2: Where must `$search` appear in the pipeline?
14. A) Anywhere
15. B) First (*)
16. C) Last
17. D) After $match
18. Explanation: `$search` must be the first stage because the Lucene index is separate from MongoDB's B-trees — MongoDB can't pre-filter with `$match`. Filter AFTER `$search`.
19. Q3: What does `$vectorSearch` perform?
20. A) Exact string match
21. B) Geospatial search
22. C) Approximate nearest neighbor (ANN) over a vector index (*)
23. D) Full-text search
24. Explanation: `$vectorSearch` runs an ANN query against a vector search index, returning the top-K most similar vectors (by cosine/dotProduct/euclidean) to a query vector.
25. Q4: What's the RAG pattern?
26. A) Read-Aggregate-Group
27. B) Random Access Graph
28. C) Replica-And-Grant
29. D) Embed query, retrieve relevant docs via $vectorSearch, feed as context to an LLM (*)
30. Explanation: Retrieval-Augmented Generation: embed the user query, retrieve top-K relevant documents via `$vectorSearch`, and feed them as context to an LLM to ground its answer.
31. Q5: What's the rule of thumb for `numCandidates` in `$vectorSearch`?
32. A) 10-20x the limit (*)
33. B) Equal to limit
34. C) Always 1000
35. D) Doesn't matter
36. Explanation: ANN trades accuracy for speed; setting `numCandidates` too small returns poor matches. 10-20x the `limit` is a reasonable starting point.
37. Q6: Which projection metadata returns Atlas Search relevance?
38. A) { $meta: "textScore" }
39. B) { $meta: "searchScore" } (*)
40. C) { $meta: "vectorSearchScore" }
41. D) { $meta: "indexScore" }
42. Explanation: For Atlas Search use `{ $meta: "searchScore" }`; for vector search use `{ $meta: "vectorSearchScore" }`. Legacy text indexes use `textScore`.
43. Q7: Why are embeddings model-specific?
44. A) They're not
45. B) They only work in Atlas
46. C) Switching embedding models requires re-embedding the whole collection (*)
47. D) They expire
48. Explanation: Embeddings are tied to the model that produced them; switching models requires re-embedding every document (expensive at scale).
49. Q8: What's a use case for `$searchMeta` with `facet`?
50. A) Updating documents
51. B) Vector search
52. C) Schema validation
53. D) Returning result counts AND facet buckets (categories, price ranges) in one call (*)
54. Explanation: `$searchMeta` returns metadata only — count bounds plus facet bucket counts (e.g., per category, per price range) — without fetching the documents.
55. Q9: What's a pitfall of using legacy `text` indexes for production search?
56. A) No relevance ranking, no synonyms, no autocomplete — use Atlas Search ($search) instead (*)
57. B) They require Atlas
58. C) They're deprecated
59. D) They can't be combined with $match
60. Explanation: Legacy text indexes are B-tree-based, equality-style, and lack ranking/synonyms/autocomplete; for any non-trivial search UX, use Atlas Search.
61. Q10: Why avoid storing huge text + embedding in one document?
62. A) MongoDB compresses them
63. B) Risk hitting the 16MB cap; store large text in object storage and keep embedding + summary in MongoDB (*)
64. C) Indexes can't include them
65. D) Vector search requires separate collections
66. Explanation: The 16MB document cap is a hard limit; for large documents, store text in S3 and keep the embedding + small summary in MongoDB for vector search.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does Atlas Search use under the hood?
  options:
    - Apache Lucene
    - MongoDB B-tree indexes
    - Elasticsearch
    - PostgreSQL FTS
  correctIndex: 0
  explanation: Atlas Search indexes are powered by Apache Lucene, providing analyzers, synonyms, autocomplete, and relevance scoring beyond legacy text indexes.
- id: q2
  question: Where must `$search` appear in the pipeline?
  options:
    - Anywhere
    - First
    - Last
    - After $match
  correctIndex: 1
  explanation: "`$search` must be the first stage because the Lucene index is separate from MongoDB's B-trees — MongoDB can't pre-filter with `$match`. Filter AFTER `$search`."
- id: q3
  question: What does `$vectorSearch` perform?
  options:
    - Exact string match
    - Geospatial search
    - Approximate nearest neighbor (ANN) over a vector index
    - Full-text search
  correctIndex: 2
  explanation: "`$vectorSearch` runs an ANN query against a vector search index, returning the top-K most similar vectors (by cosine/dotProduct/euclidean) to a query vector."
- id: q4
  question: What's the RAG pattern?
  options:
    - Read-Aggregate-Group
    - Random Access Graph
    - Replica-And-Grant
    - Embed query, retrieve relevant docs via $vectorSearch, feed as context to an LLM
  correctIndex: 3
  explanation: "Retrieval-Augmented Generation: embed the user query, retrieve top-K relevant documents via `$vectorSearch`, and feed them as context to an LLM to ground its answer."
- id: q5
  question: What's the rule of thumb for `numCandidates` in `$vectorSearch`?
  options:
    - 10-20x the limit
    - Equal to limit
    - Always 1000
    - Doesn't matter
  correctIndex: 0
  explanation: ANN trades accuracy for speed; setting `numCandidates` too small returns poor matches. 10-20x the `limit` is a reasonable starting point.
- id: q6
  question: Which projection metadata returns Atlas Search relevance?
  options:
    - '{ $meta: "textScore" }'
    - '{ $meta: "searchScore" }'
    - '{ $meta: "vectorSearchScore" }'
    - '{ $meta: "indexScore" }'
  correctIndex: 1
  explanation: 'For Atlas Search use `{ $meta: "searchScore" }`; for vector search use `{ $meta: "vectorSearchScore" }`. Legacy text indexes use `textScore`.'
- id: q7
  question: Why are embeddings model-specific?
  options:
    - They're not
    - They only work in Atlas
    - Switching embedding models requires re-embedding the whole collection
    - They expire
  correctIndex: 2
  explanation: Embeddings are tied to the model that produced them; switching models requires re-embedding every document (expensive at scale).
- id: q8
  question: What's a use case for `$searchMeta` with `facet`?
  options:
    - Updating documents
    - Vector search
    - Schema validation
    - Returning result counts AND facet buckets (categories, price ranges) in one call
  correctIndex: 3
  explanation: "`$searchMeta` returns metadata only — count bounds plus facet bucket counts (e.g., per category, per price range) — without fetching the documents."
- id: q9
  question: What's a pitfall of using legacy `text` indexes for production search?
  options:
    - No relevance ranking, no synonyms, no autocomplete — use Atlas Search ($search) instead
    - They require Atlas
    - They're deprecated
    - They can't be combined with $match
  correctIndex: 0
  explanation: Legacy text indexes are B-tree-based, equality-style, and lack ranking/synonyms/autocomplete; for any non-trivial search UX, use Atlas Search.
- id: q10
  question: Why avoid storing huge text + embedding in one document?
  options:
    - MongoDB compresses them
    - Risk hitting the 16MB cap; store large text in object storage and keep embedding + summary in MongoDB
    - Indexes can't include them
    - Vector search requires separate collections
  correctIndex: 1
  explanation: The 16MB document cap is a hard limit; for large documents, store text in S3 and keep the embedding + small summary in MongoDB for vector search.
```

