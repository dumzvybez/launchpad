---
slug: sql-recursive-queries-tree-traversal
id: sql-14
track: sql
order: 14
title: Recursive Queries and Tree Traversal
description: Walk hierarchical and graph-shaped data — org charts, comment threads, dependency trees, and graph traversal — using `WITH RECURSIVE`, and learn the cycle-detection and termination patterns that prevent infinite loops.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=9000s
whyItMatters: Walk hierarchical and graph-shaped data — org charts, comment threads, dependency trees, and graph traversal — using `WITH RECURSIVE`, and learn the cycle-detection and termination patterns that prevent infinite loops.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Recursive Queries and Tree Traversal

## Recursive Queries and Tree Traversal

### Why It Matters

Walk hierarchical and graph-shaped data — org charts, comment threads, dependency trees, and graph traversal — using `WITH RECURSIVE`, and learn the cycle-detection and termination patterns that prevent infinite loops.

Walk hierarchical and graph-shaped data — org charts, comment threads, dependency trees, and graph traversal — using `WITH RECURSIVE`, and learn the cycle-detection and termination patterns that prevent infinite loops.

### Prerequisites

- Stage 13: Postgres-Specific Features — JSONB, Arrays, Full-Text Search.
- Solid CTE foundations from Stage 5.

### Topics

- WITH RECURSIVE — anchor member + recursive member + UNION ALL
- Termination condition (the recursive step yields no new rows)
- Depth-first vs breadth-first traversal
- Cycle detection with an array-of-visited-IDs
- Tree traversal: parent/child, multi-level
- Path enumeration (materialized path)
- Graph traversal: shortest path, N-hop neighbors
- Recursive CTE performance: avoid Cartesian explosion

### Key Concepts

- A recursive CTE has two parts: a base (anchor) query and a recursive query joined by UNION (or UNION ALL); the recursion stops when the recursive step returns no rows.
- Each iteration works on the PREVIOUS iteration's results only (not the accumulated set); termination is guaranteed when the recursive step yields nothing new.
- For DAGs and graphs, cycles are possible — track visited nodes in an array column and exclude them in the WHERE.
- Breadth-first is the default (Postgres evaluates in iteration order); for depth-first, use an array-based path column ordered for traversal.
- Recursive CTEs can be slow on deep graphs — add indexes on the join columns and bound the depth when possible.
- Use UNION (not UNION ALL) only if you want deduplication; it's slower but safe for cyclic graphs.

```sql
WITH RECURSIVE org_tree AS (
    -- Anchor: top-level managers (no manager)
    SELECT employee_id, last_name, manager_id, 0 AS depth
    FROM employee
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive: reports of the previous level
    SELECT e.employee_id, e.last_name, e.manager_id, o.depth + 1
    FROM employee e
    JOIN org_tree o ON e.manager_id = o.employee_id
)
SELECT depth, employee_id, last_name, manager_id
FROM org_tree
ORDER BY depth, employee_id;
```
Caption: Org chart: direct reports tree

### Common Pitfalls

- Infinite recursion on cyclic graphs — always include cycle detection (array of visited IDs) or use UNION (slow but safe).
- Cartesian explosion — joining on a non-unique key produces n*m rows per iteration; ensure the recursive join targets a unique key.
- Forgetting termination — a recursive CTE that always yields rows will exhaust `max_recursion_depth` (or run until OOM in older Postgres); bound with `WHERE depth < 100`.
- Missing index on the recursive join column — without an index on parent_id (or source_id/target_id), each iteration is a seq scan.
- Ordering surprise — recursive CTEs evaluate in iteration order (BFS by default); for DFS, sort by a path array at the end.

### Real-World Applications

- LinkedIn's member-graph queries use recursive CTEs for N-hop connection discovery (capped at depth 3).
- Reddit/Hacker News comment threads are rendered via recursive CTEs over (comment_id, parent_id) trees.
- Stripe's bill-of-materials for subscriptions uses recursive CTEs to expand plan → add-on → feature dependencies.
- Airbnb's category tree (Places to Stay > Cabins > Treehouses) uses materialized paths (ltree) for fast subtree filters.

### Interview Questions

- 1. What are the two parts of a recursive CTE? — An anchor (base) query and a recursive query joined by UNION or UNION ALL.
- 2. How does the recursion terminate? — When the recursive step yields no new rows; for safety, bound depth in the WHERE.
- 3. How do you detect cycles in a recursive CTE? — Track visited node IDs in an array column and `WHERE NOT x = ANY(visited)`.
- 4. Difference between UNION and UNION ALL in a recursive CTE? — UNION dedupes (safe for cyclic graphs but slower); UNION ALL is faster but doesn't dedupe.
- 5. Why use ltree (materialized path)? — Subtree queries (`path <@ '1.4'`) use a GiST index, faster than recursive joins on deep trees.

### Mini Project

Build a Comment Thread Renderer: A `comment` table (id, post_id, parent_id, body, created_at). Given a post_id, render the full threaded tree with indentation and depth labels, and detect when a malformed parent_id creates a cycle. Suggested approach:
  - Use WITH RECURSIVE with an array-path column for both ordering and cycle detection
  - Use `repeat('  ', depth)` for visual indentation
  - Add a WHERE NOT id = ANY(path) guard
  - Bound depth at 100 just in case
  - Output ordered by path array (depth-first)

### Exercises

1. Write a recursive CTE that lists all employees under a given manager.
2. Add a depth column and bound the recursion at depth 5.
3. Add cycle detection with an array-of-visited-IDs.
4. Use ltree for a category tree; query all descendants of a node with `<@`.
5. Write a 3-hop connection finder between two members; limit results to 10.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What are the two parts of a recursive CTE?
9. A) Init and final
10. B) Anchor (base) and recursive member (*)
11. C) SELECT and UPDATE
12. D) FROM and WHERE
13. Explanation: A recursive CTE has an anchor query (the base case) and a recursive query referencing the CTE itself, joined by UNION or UNION ALL.
14. Q2: How does a recursive CTE terminate?
15. A) When max_recursion_depth is hit
16. B) After 100 iterations always
17. C) When the recursive step returns no new rows (*)
18. D) On COMMIT
19. Explanation: The recursion stops when an iteration yields no new rows; always add a depth bound or cycle detection for safety.
20. Q3: How do you detect cycles in a recursive CTE?
21. A) Use SERIALIZABLE isolation
22. B) Use UNION ALL only
23. C) Add a CHECK constraint
24. D) Track visited IDs in an array and `WHERE NOT x = ANY(visited)` (*)
25. Explanation: Carry an array of visited node IDs through the recursion and exclude already-visited nodes in the WHERE clause.
26. Q4: What does UNION (vs UNION ALL) do in a recursive CTE?
27. A) Dedupes rows; safe for cyclic graphs but slower (*)
28. B) Faster, no dedup
29. C) Allows UPDATE
30. D) Forces parallelism
31. Explanation: UNION deduplicates each iteration's results, preventing infinite loops on cyclic graphs at the cost of per-iteration dedup.
32. Q5: What is the default traversal order of a recursive CTE in Postgres?
33. A) Depth-first
34. B) Breadth-first (iteration order) (*)
35. C) Random
36. D) Sorted by rowid
37. Explanation: Postgres evaluates the recursion in iteration order — effectively BFS; for DFS, build a path array and ORDER BY it at the end.
38. Q6: ltree is best used for?
39. A) Storing JSONB
40. B) UUID generation
41. C) Materialized-path tree columns with GiST-indexed subtree queries (*)
42. D) Trigger recursion
43. Explanation: ltree stores hierarchical paths like '1.4.17'; `path <@ '1.4'` finds all descendants using a GiST index, much faster than recursive joins.
44. Q7: Why bound the depth in a recursive CTE?
45. A) Required by SQL
46. B) Improves ranking
47. C) Required by ltree
48. D) Prevents runaway queries on cyclic or very deep data (*)
49. Explanation: Even with cycle detection, bounding depth (`WHERE depth < 100`) protects against accidental Cartesian explosion and runaway queries.
50. Q8: Cartesian explosion in a recursive CTE happens when?
51. A) The recursive join targets a non-unique key, multiplying rows per iteration (*)
52. B) The anchor returns 0 rows
53. C) UNION is used
54. D) The CTE has no name
55. Explanation: If each row joins to N rows, the result set grows exponentially; ensure the recursive join targets a unique key.
56. Q9: What is a "materialized path"?
57. A) A computed column for ORDER BY
58. B) Storing the full ancestor chain (e.g. /1/4/17/) for O(log n) subtree queries (*)
59. C) A CTE with MATERIALIZED
60. D) An index on parent_id
61. Explanation: A materialized path encodes the ancestor chain as a string/ltree; subtree queries become a prefix/contains check, fast with GiST.
62. Q10: A comment thread is best modeled as?
63. A) A flat table with no parent_id
64. B) A JSONB column
65. C) A self-referential (parent_id) table queried with a recursive CTE or ltree path (*)
66. D) An array of arrays
67. Explanation: Self-referential parent_id plus a recursive CTE (or ltree) is the canonical pattern for nested comment trees.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What are the two parts of a recursive CTE?
  options:
    - Init and final
    - Anchor (base) and recursive member
    - SELECT and UPDATE
    - FROM and WHERE
  correctIndex: 1
  explanation: A recursive CTE has an anchor query (the base case) and a recursive query referencing the CTE itself, joined by UNION or UNION ALL.
- id: q2
  question: How does a recursive CTE terminate?
  options:
    - When max_recursion_depth is hit
    - After 100 iterations always
    - When the recursive step returns no new rows
    - On COMMIT
  correctIndex: 2
  explanation: The recursion stops when an iteration yields no new rows; always add a depth bound or cycle detection for safety.
- id: q3
  question: How do you detect cycles in a recursive CTE?
  options:
    - Use SERIALIZABLE isolation
    - Use UNION ALL only
    - Add a CHECK constraint
    - Track visited IDs in an array and `WHERE NOT x = ANY(visited)`
  correctIndex: 3
  explanation: Carry an array of visited node IDs through the recursion and exclude already-visited nodes in the WHERE clause.
- id: q4
  question: What does UNION (vs UNION ALL) do in a recursive CTE?
  options:
    - do in a recursive CTE?
    - Dedupes rows; safe for cyclic graphs but slower
    - Faster, no dedup
    - Allows UPDATE
    - Forces parallelism
  correctIndex: 1
  explanation: UNION deduplicates each iteration's results, preventing infinite loops on cyclic graphs at the cost of per-iteration dedup.
- id: q5
  question: What is the default traversal order of a recursive CTE in Postgres?
  options:
    - Depth-first
    - Breadth-first (iteration order)
    - Random
    - Sorted by rowid
  correctIndex: 1
  explanation: Postgres evaluates the recursion in iteration order — effectively BFS; for DFS, build a path array and ORDER BY it at the end.
- id: q6
  question: ltree is best used for?
  options:
    - Storing JSONB
    - UUID generation
    - Materialized-path tree columns with GiST-indexed subtree queries
    - Trigger recursion
  correctIndex: 2
  explanation: ltree stores hierarchical paths like '1.4.17'; `path <@ '1.4'` finds all descendants using a GiST index, much faster than recursive joins.
- id: q7
  question: Why bound the depth in a recursive CTE?
  options:
    - Required by SQL
    - Improves ranking
    - Required by ltree
    - Prevents runaway queries on cyclic or very deep data
  correctIndex: 3
  explanation: Even with cycle detection, bounding depth (`WHERE depth < 100`) protects against accidental Cartesian explosion and runaway queries.
- id: q8
  question: Cartesian explosion in a recursive CTE happens when?
  options:
    - The recursive join targets a non-unique key, multiplying rows per iteration
    - The anchor returns 0 rows
    - UNION is used
    - The CTE has no name
  correctIndex: 0
  explanation: If each row joins to N rows, the result set grows exponentially; ensure the recursive join targets a unique key.
- id: q9
  question: What is a "materialized path"?
  options:
    - A computed column for ORDER BY
    - Storing the full ancestor chain (e.g. /1/4/17/) for O(log n) subtree queries
    - A CTE with MATERIALIZED
    - An index on parent_id
  correctIndex: 1
  explanation: A materialized path encodes the ancestor chain as a string/ltree; subtree queries become a prefix/contains check, fast with GiST.
- id: q10
  question: A comment thread is best modeled as?
  options:
    - A flat table with no parent_id
    - A JSONB column
    - A self-referential (parent_id) table queried with a recursive CTE or ltree path
    - An array of arrays
  correctIndex: 2
  explanation: Self-referential parent_id plus a recursive CTE (or ltree) is the canonical pattern for nested comment trees.
```

