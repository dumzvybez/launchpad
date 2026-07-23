---
slug: mongodb-aggregation-pipeline-match-group-project
id: mongodb-07
track: mongodb
order: 7
title: Aggregation Pipeline — $match, $group, $project
description: Compose multi-stage pipelines to filter, transform, and summarize documents — the most powerful querying tool in MongoDB.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=180s
whyItMatters: Compose multi-stage pipelines to filter, transform, and summarize documents — the most powerful querying tool in MongoDB.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Aggregation Pipeline — $match, $group, $project

## Aggregation Pipeline — $match, $group, $project

### Why It Matters

Compose multi-stage pipelines to filter, transform, and summarize documents — the most powerful querying tool in MongoDB.

Compose multi-stage pipelines to filter, transform, and summarize documents — the most powerful querying tool in MongoDB.

### Prerequisites

- Stage 4 (Query Operators) and Stage 6 (Indexes) — `$match` reuses the same filter syntax and benefits from the same indexes.
- Familiarity with SQL `GROUP BY` and `SELECT` aliases is helpful but not required.

### Topics

- Pipeline concept: stages flow document-by-document
- `$match`, `$project`, `$sort`, `$limit`, `$skip`, `$count`
- `$group` with `_id` and accumulators (`$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`)
- `$set` / `$addFields` and `$unset`
- Field references with `$` prefix (e.g., `$price`)
- Expression operators: `$cond`, `$ifNull`, `$concat`, `$dateToString`, `$multiply`
- Pipeline optimization: `$match` first to use indexes and reduce input
- `allowDiskUse: true` for large pipelines

### Key Concepts

- A pipeline is an array of stages; each stage receives the output of the previous one and emits documents to the next.
- `$match` should come as early as possible so it can use indexes and reduce documents flowing through later stages.
- `$group`'s `_id` is the group-by key; accumulators like `$sum: 1` count, `$sum: "$price"` totals, `$avg` averages.
- Field references inside expressions use `$` prefix: `$price` means "the value of the price field of the current document".
- `aggregate()` runs in memory by default with a 100MB limit per stage; `allowDiskUse: true` spills to disk for big `$group`/`$sort` stages.

```javascript
db.orders.aggregate([
  { $match: { status: "shipped", createdAt: { $gte: ISODate("2024-01-01") } } },
  { $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
      avgOrder: { $avg: "$total" }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
])
```
Caption: Basic pipeline: match -> group -> sort

### Common Pitfalls

- Putting `$group` before `$match` — `$group` can't use indexes and forces a full collection scan; always `$match` first to reduce input.
- Forgetting the `$` prefix on field references in expressions — `$sum: "total"` is wrong (it's the literal string "total"); use `$sum: "$total"`.
- Hitting the 100MB memory limit on `$group`/`$sort` without `allowDiskUse: true` — pass `{ allowDiskUse: true }` as the second arg to `aggregate()`.
- Using `$group` with a high-cardinality `_id` (like a timestamp) and expecting few output docs — you'll get millions of tiny groups; truncate to a useful key (`$dateToString`) first.
- Treating `$sum: 1` and `$sum: "$field"` as identical — `1` counts documents, `"$field"` sums field values; mixing them up gives wildly wrong totals.

### Real-World Applications

- Stripe uses aggregation pipelines to compute daily settlement reports across millions of charges.
- eBay uses `$group` to roll up listing-view counts by product and category for dashboards.
- Adobe Analytics uses aggregation pipelines on session collections to compute funnel and cohort metrics.
- Coinbase uses `$bucket` to build price-distribution histograms for order-book analysis.

### Interview Questions

- 1. Why should `$match` come early in a pipeline? — It can use indexes and reduces the number of documents flowing through later (more expensive) stages.
- 2. What's the difference between `$sum: 1` and `$sum: "$price"`? — `1` counts documents in each group; `"$price"` sums the values of the `price` field.
- 3. What does `$` prefix mean in an aggregation expression? — It references the current document's field value (e.g., `$price` = "the price field").
- 4. What's the per-stage memory limit and how do you lift it? — 100MB; pass `{ allowDiskUse: true }` to `aggregate()` to spill to disk on `$group`/`$sort`.
- 5. How does `$group` differ from SQL `GROUP BY`? — Conceptually identical; `_id` is the GROUP BY key, accumulators are aggregate functions, and unaggregated fields can't appear outside `_id`.

### Mini Project

Build a Sales Dashboard Aggregator: Given an `orders` collection, write a Node function `salesReport({ from, to, groupBy })` that returns daily/weekly/monthly revenue, order count, AOV (average order value), and top 5 products. Suggested approach:
  - First stage: `$match` on `createdAt` between `from` and `to`
  - Then `$group` by the chosen granularity (`$dateToString` with format `%Y-%m-%d` / `%Y-W%U` / `%Y-%m`)
  - Add a second `$group` pass to compute `totalRevenue`, `orderCount`, and `aov = totalRevenue / orderCount`
  - Run a separate pipeline with `$unwind: "$items"` + `$group` by `items.sku` for top products
  - Use `allowDiskUse: true` and create a compound index on `{ status: 1, createdAt: -1 }`

### Exercises

1. Write a pipeline that groups orders by `customerId` and computes `totalSpent`, `orderCount`, and `avgOrder`.
2. Add a `$project` stage to format each result as `{ customer, totalSpent, avgOrder }` with `_id: 0`.
3. Build a daily-revenue pipeline using `$dateToString` for the `_id`.
4. Run `db.orders.aggregate([...], { allowDiskUse: true })` and observe how it behaves on a large dataset.
5. >>> QUIZ (Stage 7) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which stage should generally come FIRST in a pipeline?
8. A) $group
9. B) $sort
10. C) $match (*)
11. D) $project
12. Explanation: `$match` early uses indexes and reduces the document set flowing through later stages, making the pipeline faster and cheaper.
13. Q2: What does `$sum: 1` do inside a `$group`?
14. A) Sums the field named "1"
15. B) Adds 1 to a field
16. C) Errors out
17. D) Counts documents in each group (*)
18. Explanation: `$sum: 1` adds 1 per document, effectively counting documents in each group; `$sum: "$field"` sums field values instead.
19. Q3: What does the `$` prefix mean in an aggregation expression?
20. A) A reference to the current document's field (*)
21. B) A literal dollar sign
22. C) A variable declaration
23. D) A shell prompt
24. Explanation: `$price` inside an expression references the value of the `price` field of the current document flowing through the stage.
25. Q4: What's the default per-stage memory limit for aggregation?
26. A) 16MB
27. B) 100MB (*)
28. C) 1GB
29. D) Unlimited
30. Explanation: Each pipeline stage has a 100MB memory limit by default; pass `{ allowDiskUse: true }` to spill to disk for `$group`/`$sort` on larger datasets.
31. Q5: Which accumulator computes the average per group?
32. A) $sum
33. B) $mean
34. C) $avg (*)
35. D) $average
36. Explanation: `$avg: "$price"` computes the arithmetic mean of `price` within each group; ignores non-numeric values.
37. Q6: What does the `_id` field of a `$group` stage represent?
38. A) The document's _id
39. B) A unique stage ID
40. C) Always null
41. D) The group-by key (*)
42. Explanation: `_id` in `$group` is the GROUP BY key — documents with the same `_id` value land in the same group; set `_id: null` to aggregate all documents into one group.
43. Q7: How do you format a date as `YYYY-MM-DD` in a pipeline?
44. A) $dateToString with format: "%Y-%m-%d" (*)
45. B) $formatDate
46. C) $toString
47. D) $dateToISO
48. Explanation: `$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }` formats a BSON Date into a string for grouping or display.
49. Q8: Which stage adds new fields without removing existing ones?
50. A) $project
51. B) $addFields (or $set) (*)
52. C) $group
53. D) $unset
54. Explanation: `$addFields` (alias `$set`) adds or overwrites fields while keeping all existing ones; `$project` reshapes the whole document.
55. Q9: What's a common mistake when grouping by a high-cardinality field?
56. A) Using $match first
57. B) Forgetting $sort
58. C) Grouping by a raw timestamp instead of a truncated bucket, producing millions of tiny groups (*)
59. D) Using $sum
60. Explanation: Grouping by a raw ISODate produces one group per millisecond; truncate to a useful key (`$dateToString` daily) first to get actionable buckets.
61. Q10: Which stage is the SQL equivalent of `SELECT ... AS alias, expr`?
62. A) $match
63. B) $group
64. C) $sort
65. D) $project with expressions (*)
66. Explanation: `$project` selects, transforms, and aliases fields — like SQL's `SELECT` with expressions and `AS`.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which stage should generally come FIRST in a pipeline?
  options:
    - $group
    - $sort
    - $match
    - $project
  correctIndex: 2
  explanation: "`$match` early uses indexes and reduces the document set flowing through later stages, making the pipeline faster and cheaper."
- id: q2
  question: "What does `$sum: 1` do inside a `$group`?"
  options:
    - Sums the field named "1"
    - Adds 1 to a field
    - Errors out
    - Counts documents in each group
  correctIndex: 3
  explanation: '`$sum: 1` adds 1 per document, effectively counting documents in each group; `$sum: "$field"` sums field values instead.'
- id: q3
  question: What does the `$` prefix mean in an aggregation expression?
  options:
    - A reference to the current document's field
    - A literal dollar sign
    - A variable declaration
    - A shell prompt
  correctIndex: 0
  explanation: "`$price` inside an expression references the value of the `price` field of the current document flowing through the stage."
- id: q4
  question: What's the default per-stage memory limit for aggregation?
  options:
    - 16MB
    - 100MB
    - 1GB
    - Unlimited
  correctIndex: 1
  explanation: "Each pipeline stage has a 100MB memory limit by default; pass `{ allowDiskUse: true }` to spill to disk for `$group`/`$sort` on larger datasets."
- id: q5
  question: Which accumulator computes the average per group?
  options:
    - $sum
    - $mean
    - $avg
    - $average
  correctIndex: 2
  explanation: '`$avg: "$price"` computes the arithmetic mean of `price` within each group; ignores non-numeric values.'
- id: q6
  question: What does the `_id` field of a `$group` stage represent?
  options:
    - The document's _id
    - A unique stage ID
    - Always null
    - The group-by key
  correctIndex: 3
  explanation: "`_id` in `$group` is the GROUP BY key — documents with the same `_id` value land in the same group; set `_id: null` to aggregate all documents into one group."
- id: q7
  question: How do you format a date as `YYYY-MM-DD` in a pipeline?
  options:
    - '$dateToString with format: "%Y-%m-%d"'
    - $formatDate
    - $toString
    - $dateToISO
  correctIndex: 0
  explanation: '`$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }` formats a BSON Date into a string for grouping or display.'
- id: q8
  question: Which stage adds new fields without removing existing ones?
  options:
    - $project
    - $addFields (or $set)
    - $group
    - $unset
  correctIndex: 1
  explanation: "`$addFields` (alias `$set`) adds or overwrites fields while keeping all existing ones; `$project` reshapes the whole document."
- id: q9
  question: What's a common mistake when grouping by a high-cardinality field?
  options:
    - Using $match first
    - Forgetting $sort
    - Grouping by a raw timestamp instead of a truncated bucket, producing millions of tiny groups
    - Using $sum
  correctIndex: 2
  explanation: Grouping by a raw ISODate produces one group per millisecond; truncate to a useful key (`$dateToString` daily) first to get actionable buckets.
- id: q10
  question: Which stage is the SQL equivalent of `SELECT ... AS alias, expr`?
  options:
    - $match
    - $group
    - $sort
    - $project with expressions
  correctIndex: 3
  explanation: "`$project` selects, transforms, and aliases fields — like SQL's `SELECT` with expressions and `AS`."
```

