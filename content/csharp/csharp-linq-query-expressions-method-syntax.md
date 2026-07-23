---
slug: csharp-linq-query-expressions-method-syntax
id: csharp-10
track: csharp
order: 10
title: LINQ — Query Expressions and Method Syntax
description: Master both LINQ syntaxes (query expressions and method syntax), understand deferred execution and multiple enumeration, and use SelectMany, GroupBy, Join, and Aggregate fluently.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=9000s
whyItMatters: Master both LINQ syntaxes (query expressions and method syntax), understand deferred execution and multiple enumeration, and use SelectMany, GroupBy, Join, and Aggregate fluently.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# LINQ — Query Expressions and Method Syntax

## LINQ — Query Expressions and Method Syntax

### Why It Matters

Master both LINQ syntaxes (query expressions and method syntax), understand deferred execution and multiple enumeration, and use SelectMany, GroupBy, Join, and Aggregate fluently.

Master both LINQ syntaxes (query expressions and method syntax), understand deferred execution and multiple enumeration, and use SelectMany, GroupBy, Join, and Aggregate fluently.

### Prerequisites

- Stage 8: Collections.
- Stage 9: Delegates, Events, and Lambdas (for Func predicates).

### Topics

- Method syntax: Where, Select, OrderBy, ThenBy, Take, Skip, First, Single
- Query expression syntax: from/where/select/group/join/orderby
- SelectMany (flattening), GroupBy, Join, GroupJoin, Zip
- Aggregation: Sum, Min, Max, Average, Aggregate
- Deferred execution vs immediate (.ToList, .ToArray, .ToDictionary)
- IEnumerable<T> (LINQ to Objects) vs IQueryable<T> (LINQ to EF)
- Multiple enumeration and the "RecomputeWarning" pattern
- ElementAt, Chunk, DistinctBy, MaxBy (.NET 6+)

### Key Concepts

- LINQ operators on `IEnumerable<T>` are lazy — they compose a pipeline that runs only when you enumerate (via foreach, ToList, or aggregation).
- Each enumeration re-runs the pipeline (and any side effects in Select/Where lambdas); materialize with `.ToList()` if you need stable data or want to avoid recompute.
- `IQueryable<T>` translates LINQ to expression trees (SQL, etc.) — using a client-side method (like a custom C# function in Where) can fail or pull the whole table.
- `SelectMany` flattens nested sequences (one-to-many); `GroupJoin` produces hierarchical groupings even when the right side is empty (useful for left joins).
- `Distinct()` uses the default equality comparer; `DistinctBy(x => x.Id)` (NET 6+) is far more common in practice.

```csharp
var topThree = students
    .Where(s => s.Gpa >= 3.5)
    .OrderByDescending(s => s.Gpa)
    .ThenBy(s => s.Name)
    .Take(3)
    .Select(s => $"{s.Name}: {s.Gpa:F2}")
    .ToList();   // materialize to run once
```
Caption: Method syntax pipeline

### Common Pitfalls

- Multiple enumeration of `IEnumerable<T>` from a yield method or LINQ pipeline — each `foreach`/`Count()`/`Sum()` re-runs the entire pipeline (and re-executes side effects); materialize with `.ToList()` once.
- Calling `.First()` on an empty sequence — throws `InvalidOperationException`; use `.FirstOrDefault()` and check for default, or `.FirstOrDefault(predicate) ?? throw`.
- Using `IQueryable<T>` with a client-side predicate — `db.Users.Where(u => MyHelper(u.Name))` cannot translate to SQL and either throws (EF Core 3+) or pulls the whole table (EF6).
- Assuming `Distinct()` does what you want on objects — without a custom `IEqualityComparer<T>`, it uses reference equality for classes; use `DistinctBy(x => x.Key)` (.NET 6+) or pass a comparer.
- Capturing the loop variable in a LINQ `Select` lambda inside a `for` loop — same closure bug as Stage 9; the lambda sees the final value.

### Real-World Applications

- Stack Overflow uses LINQ extensively in the data access layer to compose SQL queries against the Postgres-backed tag engine; EF Core translates `IQueryable<T>` to parameterized SQL.
- Roslyn uses LINQ to walk syntax trees in analyzers — `descendantNodes.OfType<MethodDeclarationSyntax>().Where(m => m.Identifier.ValueText.StartsWith("Get"))`.
- Unity's asset pipeline uses LINQ over imported assets for filtering and grouping, though hot paths avoid it due to allocation cost.
- Microsoft's PowerBI dataset engine uses LINQ-style fluent APIs to compose data transformations over tabular models.

### Interview Questions

- 1. What is the difference between `IEnumerable<T>` and `IQueryable<T>`? — `IEnumerable<T>` runs LINQ in-memory (LINQ to Objects); `IQueryable<T>` builds an expression tree that a provider (EF Core) translates to a remote query (SQL).
- 2. What is deferred execution and why does it matter? — LINQ operators compose a pipeline that runs only on enumeration; this enables lazy evaluation but can cause repeated work if you enumerate multiple times.
- 3. What does `SelectMany` do? — Flattens a sequence-of-sequences into a single sequence (one-to-many); equivalent to nested from clauses in query syntax.
- 4. What happens when you call `First()` on an empty sequence? — Throws `InvalidOperationException`; use `FirstOrDefault()` to get `default(T)` instead, or supply a predicate.
- 5. How do you avoid multiple enumeration warnings? — Materialize the sequence once with `.ToList()` / `.ToArray()` / `.ToDictionary()` and reuse the cached collection.

### Mini Project

Build a Sales Analytics CLI: Read a JSON array of orders (each with items and quantities), compute total revenue per category, top 5 products by revenue, and the customer with the highest lifetime value — all with LINQ. Suggested approach:
  - Parse JSON with `JsonSerializer.Deserialize<List<Order>>(...)`
  - Flatten with `orders.SelectMany(o => o.Items)`
  - Group by category and sum: `items.GroupBy(i => i.Category).Select(g => new { g.Key, Total = g.Sum(...) })`
  - Top 5: `OrderByDescending(...).Take(5)`
  - Customer LTV: `orders.GroupBy(o => o.CustomerId).Select(g => g.Sum(o => o.Total)).MaxBy(...)`

### Exercises

1. Build a pipeline that filters, sorts, and projects a `List<int>`; enumerate twice and observe side effects (e.g., a logging `Select`).
2. Use `SelectMany` to flatten a `List<List<int>>` into a single list of distinct values.
3. Write a query expression with `join` to combine `orders` and `customers` on `CustomerId`.
4. Demonstrate the difference between `First`, `FirstOrDefault`, `Single`, and `SingleOrDefault` on a sequence with 0, 1, and 2 matching elements.
5. Use `Aggregate` to compute a running maximum of a `List<int>`.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: LINQ operators on `IEnumerable<T>` are…
9. A) Eager (run immediately)
10. B) Lazy (run on enumeration) (*)
11. C) Always cached
12. D) Always translated to SQL
13. Explanation: LINQ to Objects operators compose a pipeline that executes only when you enumerate it (foreach, ToList, or aggregation); side effects in lambdas run per enumeration.
14. Q2: What does `SelectMany` do?
15. A) Selects one field from each element
16. B) Groups elements by a key
17. C) Flattens a sequence of sequences into one sequence (*)
18. D) Joins two sequences
19. Explanation: SelectMany projects each element to a sequence and flattens the result — equivalent to nested `from` clauses in query syntax.
20. Q3: Calling `.First()` on an empty sequence…
21. A) Returns null
22. B) Returns default(T)
23. C) Returns the first element of a default sequence
24. D) Throws InvalidOperationException (*)
25. Explanation: `First()` throws `InvalidOperationException` if the sequence is empty; `FirstOrDefault()` returns `default(T)` instead.
26. Q4: What's the difference between `IEnumerable<T>` and `IQueryable<T>`?
27. A) IEnumerable runs in-memory; IQueryable builds an expression tree for remote translation (*)
28. B) They are identical
29. C) IQueryable is faster always
30. D) IEnumerable is for databases
31. Explanation: `IEnumerable<T>` executes LINQ in memory (LINQ to Objects); `IQueryable<T>` builds an expression tree that a provider like EF Core translates to SQL for remote execution.
32. Q5: Multiple enumeration of a LINQ pipeline…
33. A) Is impossible
34. B) Re-runs the pipeline (and any side effects) on each enumeration (*)
35. C) Caches after the first enumeration
36. D) Throws an exception
37. Explanation: Each foreach/Count/Sum re-runs the entire pipeline and re-executes side effects in lambdas; materialize with .ToList() once if you need stable data.
38. Q6: `db.Users.Where(u => MyHelper(u.Name))` against EF Core…
39. A) Always translates to SQL
40. B) Is the recommended pattern
41. C) Throws at runtime (client-side evaluation rejected in EF Core 3+) (*)
42. D) Returns IQueryable<User>
43. Explanation: EF Core 3+ rejects client-side predicates in Where — it cannot translate `MyHelper` to SQL and throws `InvalidOperationException`; rewrite the predicate in translatable terms.
44. Q7: Which method removes duplicates based on a key (.NET 6+)?
45. A) Distinct()
46. B) GroupBy(x => x.Id).Select(g => g.First())
47. C) Both B and C
48. D) DistinctBy(x => x.Id) (*)
49. Explanation: `DistinctBy` (NET 6+) is the one-liner; `GroupBy(...).Select(g => g.First())` is the pre-NET-6 equivalent. `Distinct()` without a comparer uses default equality.
50. Q8: `var q = students.Where(s => s.Gpa > 3); var c1 = q.Count(); var c2 = q.Count();`
51. A) Pipeline runs twice (once per Count) (*)
52. B) Pipeline runs once; c2 uses cached result
53. C) Compile error
54. D) Throws at runtime
55. Explanation: `Count()` enumerates the pipeline each time; the Where lambda runs 2N times total. Materialize with .ToList() before counting twice.
56. Q9: Which LINQ operator returns the only element of a sequence, throwing if there are 0 or 2+?
57. A) First
58. B) Single (*)
59. C) FirstOrDefault
60. D) Last
61. Explanation: `Single` requires exactly one element; it throws `InvalidOperationException` for empty or multi-element sequences. `SingleOrDefault` allows zero (returns default).
62. Q10: Query expression syntax (`from ... select`) and method syntax (`.Where().Select()`)…
63. A) Are different languages
64. B) Have different performance
65. C) Compile to the same IL (query syntax is syntactic sugar over method syntax) (*)
66. D) Cannot be mixed
67. Explanation: Query expressions are syntactic sugar that the compiler translates into method calls (Where, Select, SelectMany, etc.); they compile to identical IL and can be mixed freely.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: LINQ operators on `IEnumerable<T>` are…
  options:
    - Eager (run immediately)
    - Lazy (run on enumeration)
    - Always cached
    - Always translated to SQL
  correctIndex: 1
  explanation: LINQ to Objects operators compose a pipeline that executes only when you enumerate it (foreach, ToList, or aggregation); side effects in lambdas run per enumeration.
- id: q2
  question: What does `SelectMany` do?
  options:
    - Selects one field from each element
    - Groups elements by a key
    - Flattens a sequence of sequences into one sequence
    - Joins two sequences
  correctIndex: 2
  explanation: SelectMany projects each element to a sequence and flattens the result — equivalent to nested `from` clauses in query syntax.
- id: q3
  question: Calling `.First()` on an empty sequence…
  options:
    - Returns null
    - Returns default(T)
    - Returns the first element of a default sequence
    - Throws InvalidOperationException
    - "` instead."
  correctIndex: 3
  explanation: "`First()` throws `InvalidOperationException` if the sequence is empty; `FirstOrDefault()` returns `default(T)` instead."
- id: q4
  question: What's the difference between `IEnumerable<T>` and `IQueryable<T>`?
  options:
    - IEnumerable runs in-memory; IQueryable builds an expression tree for remote translation
    - They are identical
    - IQueryable is faster always
    - IEnumerable is for databases
  correctIndex: 0
  explanation: "`IEnumerable<T>` executes LINQ in memory (LINQ to Objects); `IQueryable<T>` builds an expression tree that a provider like EF Core translates to SQL for remote execution."
- id: q5
  question: Multiple enumeration of a LINQ pipeline…
  options:
    - Is impossible
    - Re-runs the pipeline (and any side effects) on each enumeration
    - Caches after the first enumeration
    - Throws an exception
  correctIndex: 1
  explanation: Each foreach/Count/Sum re-runs the entire pipeline and re-executes side effects in lambdas; materialize with .ToList() once if you need stable data.
- id: q6
  question: "`db.Users.Where(u => MyHelper(u.Name))` against EF Core…"
  options:
    - Always translates to SQL
    - Is the recommended pattern
    - Throws at runtime (client-side evaluation rejected in EF Core 3+)
    - Returns IQueryable<User>
  correctIndex: 2
  explanation: EF Core 3+ rejects client-side predicates in Where — it cannot translate `MyHelper` to SQL and throws `InvalidOperationException`; rewrite the predicate in translatable terms.
- id: q7
  question: Which method removes duplicates based on a key (.NET 6+)?
  options:
    - Distinct()
    - GroupBy(x => x.Id).Select(g => g.First())
    - Both B and C
    - DistinctBy(x => x.Id)
  correctIndex: 3
  explanation: "`DistinctBy` (NET 6+) is the one-liner; `GroupBy(...).Select(g => g.First())` is the pre-NET-6 equivalent. `Distinct()` without a comparer uses default equality."
- id: q8
  question: "`var q = students.Where(s => s.Gpa > 3); var c1 = q.Count(); var c2 = q.Count();`"
  options:
    - Pipeline runs twice (once per Count)
    - Pipeline runs once; c2 uses cached result
    - Compile error
    - Throws at runtime
  correctIndex: 0
  explanation: "`Count()` enumerates the pipeline each time; the Where lambda runs 2N times total. Materialize with .ToList() before counting twice."
- id: q9
  question: Which LINQ operator returns the only element of a sequence, throwing if there are 0 or 2+?
  options:
    - First
    - Single
    - FirstOrDefault
    - Last
  correctIndex: 1
  explanation: "`Single` requires exactly one element; it throws `InvalidOperationException` for empty or multi-element sequences. `SingleOrDefault` allows zero (returns default)."
- id: q10
  question: Query expression syntax (`from ... select`) and method syntax (`.Where().Select()`)…
  options:
    - Are different languages
    - Have different performance
    - Compile to the same IL (query syntax is syntactic sugar over method syntax)
    - Cannot be mixed
  correctIndex: 2
  explanation: Query expressions are syntactic sugar that the compiler translates into method calls (Where, Select, SelectMany, etc.); they compile to identical IL and can be mixed freely.
```

