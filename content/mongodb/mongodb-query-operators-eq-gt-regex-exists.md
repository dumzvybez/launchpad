---
slug: mongodb-query-operators-eq-gt-regex-exists
id: mongodb-04
track: mongodb
order: 4
title: Query Operators — $eq, $in, $gt, $regex, $exists
description: "Express precise queries using MongoDB's operator vocabulary: comparison, logical, array, element, and evaluation operators."
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ExcRbA7fy_A&t=90s
whyItMatters: "Express precise queries using MongoDB's operator vocabulary: comparison, logical, array, element, and evaluation operators."
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Query Operators — $eq, $in, $gt, $regex, $exists

## Query Operators — $eq, $in, $gt, $regex, $exists

### Why It Matters

Express precise queries using MongoDB's operator vocabulary: comparison, logical, array, element, and evaluation operators.

Express precise queries using MongoDB's operator vocabulary: comparison, logical, array, element, and evaluation operators.

### Prerequisites

- Stage 3 (CRUD) — comfortable with `find()` returning a cursor.
- JSON object syntax for nested filter documents.

### Topics

- Comparison operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`
- Logical operators: `$and`, `$or`, `$nor`, `$not`
- Element operators: `$exists`, `$type`
- Array operators: `$all`, `$size`, `$elemMatch`
- Evaluation operators: `$regex`, `$mod`, `$where` (and why to avoid it)
- Implicit AND vs explicit `$and`
- Range queries and equality on the same field
- Top-level `$expr` for comparing fields to each other

### Key Concepts

- Operators are objects whose keys start with `$`; combining them on one field looks like `{ price: { $gte: 10, $lt: 100 } }` (implicit AND).
- Multiple top-level filter keys are implicit AND; use `$or: [...]` for OR; `$and` is only needed when the same field has multiple operator clauses that conflict.
- `$in` is the canonical "match any of these values" operator and is index-friendly; `$nin` is its negation.
- `$elemMatch` is the only way to require two predicates on the same array element (e.g., an order item with `qty >= 2 AND price < 50`).
- `$regex` is powerful but cannot use indexes for case-insensitive or leading-wildcard searches — use a text index (Stage 6) or Atlas Search (Stage 17) instead.

```javascript
// Price between 10 and 100, AND inStock
db.products.find({
  price: { $gte: 10, $lt: 100 },
  inStock: true
})

// Category in any of these (uses index on category if present)
db.products.find({ category: { $in: ["books", "music", "games"] } })

// OR of two different field conditions
db.products.find({
  $or: [
    { "discount.pct": { $gte: 20 } },
    { clearance: true }
  ]
})
```
Caption: Comparison and logical

### Common Pitfalls

- Using `{ "items.qty": { $gte: 2 }, "items.price": { $lt: 50 } }` to mean "one item with both" — it actually matches ANY item with qty>=2 OR any item with price<50; use `$elemMatch` to constrain to a single element.
- Running `{ name: /ada/i }` (case-insensitive regex) and expecting it to use the index — leading-wildcard or case-insensitive regex does a COLLSCAN; add a text index or Atlas Search.
- Using `$or: [{ a: 1 }, { b: 2 }]` and being surprised it's slower than `{ a: { $in: [1,2,3] } }` — `$or` runs separate index scans and merges; for the same field, prefer `$in`.
- Forgetting that `{ a: 1, b: 2 }` is implicit AND and writing redundant `$and: [{ a: 1 }, { b: 2 }]` — only use explicit `$and` when the same field has conflicting operator clauses.
- Using `$where: "this.a === this.b"` for cross-field comparisons — it runs JavaScript on every document (COLLSCAN, slow, security risk); use `$expr` with aggregation operators instead.

### Real-World Applications

- Uber Eats uses `$elemMatch` to find restaurants that have at least one menu item matching dietary + price filters simultaneously.
- eBay uses `$in` against precomputed category trees to fetch products in any of N leaf categories in a single query.
- Stripe uses `$expr` to flag invoices where `amount_paid < amount_due` in reconciliation jobs.
- Adobe Analytics uses `$or` over multiple session identifiers to merge anonymous and authenticated user sessions.

### Interview Questions

- 1. When do you need `$elemMatch` instead of two field-level predicates? — When two predicates must hold on the SAME array element; without `$elemMatch`, predicates can match different elements.
- 2. Why is `$or` sometimes slower than `$in`? — `$or` runs separate index scans per clause and merges; for the same field, `$in` does one index lookup and is faster.
- 3. Can a case-insensitive regex use an index? — Generally no; case-insensitive or leading-wildcard regex falls back to COLLSCAN; use a text index or Atlas Search.
- 4. What does `$expr` enable in `find()`? — Cross-field comparisons and aggregation expressions inside a regular filter, without `$where`'s JavaScript.
- 5. Why is `$where` discouraged? — It executes arbitrary JavaScript on every document (COLLSCAN), is slow, and historically has had security issues; prefer `$expr`.

### Mini Project

Build a Product Filter API: A Node endpoint `GET /products?category=&minPrice=&maxPrice=&tag=&q=` that compiles query params into a MongoDB filter using `$in`, `$gte`/`$lte`, `$all`, and `$regex`. Suggested approach:
  - Parse `tag` as a comma-separated list and build `{ tags: { $all: [...] } }`
  - Build `price: { $gte: minPrice, $lte: maxPrice }` only if params present
  - Use `$regex` for `q` against `name` (note: will COLLSCAN without a text index — Stage 6 fixes this)
  - Combine all clauses into one filter object (implicit AND)
  - Add a `GET /products/instock-cheap` shortcut using `$and`/`$or` and an `$elemMatch` on `variants`

### Exercises

1. Write a query for products priced $10-$100 in categories `books` or `music`.
2. Write a `$elemMatch` query for orders that have at least one item with `qty >= 2 AND price < 50`.
3. Write a `$or` query matching users with either `emailVerified: true` OR `guest: true`.
4. Use `$expr` to find orders where `discountedTotal > originalTotal` (a data-quality bug).
5. Find all users whose `deletedAt` field is missing using `$exists`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which operator matches "field is one of these N values"?
9. A) $or
10. B) $any
11. C) $eq
12. D) $in (*)
13. Explanation: `$in: [...]` matches a field equal to any of the listed values and is index-friendly; for the same field, it's preferred over `$or`.
14. Q2: How do you require two predicates on the same array element?
15. A) Use $elemMatch (*)
16. B) Use two field-level predicates
17. C) Use $and
18. D) Use $where
19. Explanation: Two separate predicates like `"items.qty": { $gte: 2 }` and `"items.price": { $lt: 50 }` can match different array elements; `$elemMatch` enforces both on a single element.
20. Q3: What does `{ price: { $gte: 10, $lt: 100 } }` mean?
21. A) Price equals 10 OR equals 100
22. B) Price is >= 10 AND < 100 (*)
23. C) Price is between 100 and 10 exclusive
24. D) Invalid syntax
25. Explanation: Multiple operators on the same field are implicit AND, so this matches 10 <= price < 100.
26. Q4: Which query matches documents where `email` starts with "ada" (case-sensitive, index-friendly)?
27. A) { email: { $regex: /ada/i } }
28. B) { email: { $regex: /ada/ } }
29. C) { email: { $regex: /^ada/ } } (*)
30. D) { email: { $regex: /.*ada.*/i } }
31. Explanation: A case-sensitive, anchored regex (`/^ada/`) can use an index; case-insensitive (`/i`) or leading-wildcard (`/.*ada/`) regex cannot.
32. Q5: What does `{ tags: { $all: ["a", "b"] } }` match?
33. A) Arrays containing either "a" or "b"
34. B) Arrays containing exactly "a" and "b" in order
35. C) Arrays of size 2
36. D) Arrays containing both "a" and "b" (*)
37. Explanation: `$all` requires the array to contain ALL listed values (in any order); for "either/or" use `$in`.
38. Q6: Which operator checks whether a field is present?
39. A) $exists (*)
40. B) $present
41. C) $has
42. D) $type
43. Explanation: `$exists: true/false` filters documents based on whether a field is present (true) or absent (false).
44. Q7: How do you compare two fields of the same document in a `find()` filter?
45. A) Use $where only
46. B) Use $expr with $gt: ["$a", "$b"] (*)
47. C) Use { a: { $gt: "$b" } }
48. D) It's impossible in find()
49. Explanation: `$expr: { $gt: ["$a", "$b"] }` lets you compare fields within a single document using aggregation expressions, replacing slow `$where` JavaScript.
50. Q8: What does `{ tags: { $size: 3 } }` match?
51. A) Arrays whose 3rd element exists
52. B) Arrays of size >= 3
53. C) Arrays with exactly 3 elements (*)
54. D) The 3rd tag of each document
55. Explanation: `$size` matches arrays of an exact length; it cannot use an index, so avoid on hot paths.
56. Q9: Why is `$or: [{ a: 1 }, { a: 2 }]` slower than `{ a: { $in: [1, 2] } }`?
57. A) $or is deprecated
58. B) $or doesn't use indexes at all
59. C) They're identical in performance
60. D) $or runs two index scans and merges; $in does one (*)
61. Explanation: For the same field, `$in` is a single index lookup; `$or` runs a separate index scan per clause and merges results, which is more work.
62. Q10: What's the problem with `$where: "this.a === this.b"`?
63. A) It runs JavaScript on every document (COLLSCAN, slow, security risk) — use $expr (*)
64. B) It's not valid syntax
65. C) It only works on sharded clusters
66. D) It requires admin auth
67. Explanation: `$where` evaluates JavaScript per document, bypassing indexes; `$expr` with aggregation operators achieves the same result using indexed operators.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which operator matches "field is one of these N values"?
  options:
    - $or
    - $any
    - $eq
    - $in
  correctIndex: 3
  explanation: "`$in: [...]` matches a field equal to any of the listed values and is index-friendly; for the same field, it's preferred over `$or`."
- id: q2
  question: How do you require two predicates on the same array element?
  options:
    - Use $elemMatch
    - Use two field-level predicates
    - Use $and
    - Use $where
  correctIndex: 0
  explanation: 'Two separate predicates like `"items.qty": { $gte: 2 }` and `"items.price": { $lt: 50 }` can match different array elements; `$elemMatch` enforces both on a single element.'
- id: q3
  question: "What does `{ price: { $gte: 10, $lt: 100 } }` mean?"
  options:
    - Price equals 10 OR equals 100
    - Price is >= 10 AND < 100
    - Price is between 100 and 10 exclusive
    - Invalid syntax
  correctIndex: 1
  explanation: Multiple operators on the same field are implicit AND, so this matches 10 <= price < 100.
- id: q4
  question: Which query matches documents where `email` starts with "ada" (case-sensitive, index-friendly)?
  options:
    - "{ email: { $regex: /ada/i } }"
    - "{ email: { $regex: /ada/ } }"
    - "{ email: { $regex: /^ada/ } }"
    - "{ email: { $regex: /.*ada.*/i } }"
  correctIndex: 2
  explanation: A case-sensitive, anchored regex (`/^ada/`) can use an index; case-insensitive (`/i`) or leading-wildcard (`/.*ada/`) regex cannot.
- id: q5
  question: 'What does `{ tags: { $all: ["a", "b"] } }` match?'
  options:
    - Arrays containing either "a" or "b"
    - Arrays containing exactly "a" and "b" in order
    - Arrays of size 2
    - Arrays containing both "a" and "b"
  correctIndex: 3
  explanation: '`$all` requires the array to contain ALL listed values (in any order); for "either/or" use `$in`.'
- id: q6
  question: Which operator checks whether a field is present?
  options:
    - $exists
    - $present
    - $has
    - $type
  correctIndex: 0
  explanation: "`$exists: true/false` filters documents based on whether a field is present (true) or absent (false)."
- id: q7
  question: How do you compare two fields of the same document in a `find()` filter?
  options:
    - Use $where only
    - 'Use $expr with $gt: ["$a", "$b"]'
    - 'Use { a: { $gt: "$b" } }'
    - It's impossible in find()
  correctIndex: 1
  explanation: '`$expr: { $gt: ["$a", "$b"] }` lets you compare fields within a single document using aggregation expressions, replacing slow `$where` JavaScript.'
- id: q8
  question: "What does `{ tags: { $size: 3 } }` match?"
  options:
    - Arrays whose 3rd element exists
    - Arrays of size >= 3
    - Arrays with exactly 3 elements
    - The 3rd tag of each document
  correctIndex: 2
  explanation: "`$size` matches arrays of an exact length; it cannot use an index, so avoid on hot paths."
- id: q9
  question: "Why is `$or: [{ a: 1 }, { a: 2 }]` slower than `{ a: { $in: [1, 2] } }`?"
  options:
    - $or is deprecated
    - $or doesn't use indexes at all
    - They're identical in performance
    - $or runs two index scans and merges; $in does one
  correctIndex: 3
  explanation: For the same field, `$in` is a single index lookup; `$or` runs a separate index scan per clause and merges results, which is more work.
- id: q10
  question: "What's the problem with `$where: \"this.a === this.b\"`?"
  options:
    - It runs JavaScript on every document (COLLSCAN, slow, security risk) — use $expr
    - It's not valid syntax
    - It only works on sharded clusters
    - It requires admin auth
  correctIndex: 0
  explanation: "`$where` evaluates JavaScript per document, bypassing indexes; `$expr` with aggregation operators achieves the same result using indexed operators."
```

