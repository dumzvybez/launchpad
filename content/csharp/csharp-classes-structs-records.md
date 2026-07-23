---
slug: csharp-classes-structs-records
id: csharp-05
track: csharp
order: 5
title: Classes, Structs, and Records
description: Author classes, structs, and records; understand reference vs value semantics, primary constructors (C# 12), init-only properties, and when each kind of type is the right choice.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=4000s
whyItMatters: Author classes, structs, and records; understand reference vs value semantics, primary constructors (C# 12), init-only properties, and when each kind of type is the right choice.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Classes, Structs, and Records

## Classes, Structs, and Records

### Why It Matters

Author classes, structs, and records; understand reference vs value semantics, primary constructors (C# 12), init-only properties, and when each kind of type is the right choice.

Author classes, structs, and records; understand reference vs value semantics, primary constructors (C# 12), init-only properties, and when each kind of type is the right choice.

### Prerequisites

- Stage 2: Variables, Types, and Operators (value vs reference).
- Stage 4: Methods, Parameters, and Out/Ref.

### Topics

- class vs struct vs record vs record struct
- Fields, properties, auto-properties, init-only setters (C# 9)
- Primary constructors (C# 12) for classes and structs
- readonly struct and readonly fields
- Constructor overloading and `: this(...)` / `: base(...)` chaining
- Object initializers and collection initializers
- Records: value equality, with-expressions, `record class` vs `record struct`
- Pattern matching with `is` and `switch` on record positional deconstruction

### Key Concepts

- Classes are reference types (heap, identity equality by default); structs are value types (stack/inline, copied on assignment).
- Records (C# 9) are reference types with value-based equality, immutability, and `with`-expression support; `record struct` (C# 10) is the value-type variant.
- `readonly struct` enforces immutability at the type level — all fields must be readonly, and the compiler can skip defensive copies when passing `in`.
- Mutable structs are a notorious footgun: mutation on a copy (from a property/indexer) silently does nothing; prefer `readonly struct` or use `ref` returns.
- `init` accessors allow setting during construction (object initializer) but not after — enables immutability without constructor explosion.

```csharp
public class PointC { public int X, Y; }            // reference type
public struct PointS { public int X, Y; }           // value type (mutable - risky)
public readonly struct PointR { public int X, Y; public PointR(int x, int y) => (X, Y) = (x, y); }

public record PointRec(int X, int Y);               // reference type, value equality
public record struct PointRecStruct(int X, int Y);  // value type, value equality

var r1 = new PointRec(1, 2);
var r2 = new PointRec(1, 2);
Console.WriteLine(r1 == r2);                // True  (value equality)
Console.WriteLine(ReferenceEquals(r1, r2)); // False (different objects)
var r3 = r1 with { X = 9 };                 // non-destructive mutation
```
Caption: Class vs struct vs record

### Common Pitfalls

- Using a mutable struct — `list[0].Inc();` fails to compile (mutating a temporary copy); use a `readonly struct` or a class, or expose the field via a `ref` indexer.
- Treating records as just "immutable classes" — records add value equality, `with` expressions, structural printing (`ToString`), and positional deconstruction; using a class loses these for free.
- Forgetting that `readonly struct` requires all fields to be readonly — the compiler errors if you try to mutate inside a method, which is the whole point (enables `in` optimization without defensive copies).
- Assuming `record struct` has the same defaults as `record class` — `record struct` is mutable by default (like a normal struct); use `readonly record struct` for immutability.
- Boxing a struct in a non-generic collection or interface — every boxing allocates and breaks value equality; `List<int>` is fine, but `ArrayList` boxes.

### Real-World Applications

- Roslyn's syntax tree nodes are immutable classes (effectively records) — every refactor produces a new tree, enabling time-travel debugging and snapshot diffs.
- EF Core entity types are typically `class` (reference type) so change-tracking can hold a single instance per row; record types are used for DTOs where value equality matters.
- Unity uses structs (Vector3, Color, Quaternion) for ~99% of math to avoid per-frame heap allocations; they are `readonly` where possible.
- Microsoft's PowerFx interpreter uses records for formula values, giving value-equality and `with`-style updates for app-state snapshots.

### Interview Questions

- 1. When should you choose a struct over a class? — For small (≤16 bytes), immutable, value-semantics types that are short-lived and copied often; otherwise prefer a class to avoid boxing and copy costs.
- 2. What does `record` add over a plain `class`? — Value-based equality, a synthesized `ToString`, `with`-expression support, and positional deconstruction — all for one keyword.
- 3. What is the difference between `record class` and `record struct`? — `record class` (default) is a reference type; `record struct` (C# 10) is a value type; both have value equality, but `record struct` is mutable by default (use `readonly record struct` for immutability).
- 4. What is `init` and how does it differ from `set`? — `init` allows assignment only during construction (object initializer or constructor body); `set` allows assignment anytime. `init` gives immutability without constructor boilerplate.
- 5. Why are mutable structs considered harmful? — Mutations on a copy (from a property, indexer, or method return) silently do nothing; defensive copies in `in` parameters add overhead; aliasing assumptions break.

### Mini Project

Build an Immutable Config Builder: A `readonly record struct` representing app configuration (Env, Timeout, Retries, Endpoint) with a `with`-based "override" flow that loads a base config from JSON, applies environment overrides, and prints the final config. Suggested approach:
  - Define `readonly record struct Config(string Env, int Timeout, int Retries, Uri Endpoint)`
  - Load base via `System.Text.Json.JsonSerializer.Deserialize<Config>(File.ReadAllText(...))`
  - Apply env overrides with `var final = base with { Env = "prod", Timeout = 2000 }`
  - Override `ToString` via the record's built-in synthesis (inspect it)
  - Add a `Match` method using a switch expression on `Env` to return a log level

### Exercises

1. Define `class PointC` and `struct PointS` with `X, Y`; put each in a `List<T>`, mutate `list[0].X`, and explain why one compiles and the other doesn't.
2. Convert a 50-field DTO `class` to a `record` and observe that `==` now compares values; add a `with` test.
3. Create a `readonly struct Money(decimal Amount, string Currency)` and try to mutate a field — observe the compile error.
4. Build a `record struct Point(int X, int Y)` and check that it is mutable; redeclare as `readonly record struct` and confirm immutability.
5. Use a primary constructor (C# 12) on a `class` with two derived fields and verify the parameters are accessible throughout the class body.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which kind of type has value-based equality by default?
9. A) record (*)
10. B) class
11. C) struct
12. D) array
13. Explanation: Records (both `record class` and `record struct`) synthesize value-based equality operators; plain classes use reference equality for == unless overloaded.
14. Q2: What does the `with` expression require on its target type?
15. A) A public parameterless constructor
16. B) Record-like semantics (init-only properties or a synthesized Clone method) (*)
17. C) The [Serializable] attribute
18. D) A mutable field
19. Explanation: `with` works on records and structs with init-only auto-properties; it produces a copy then applies the member overrides via init accessors.
20. Q3: Why does `list[0].Inc()` fail to compile when the list contains a mutable struct?
21. A) Structs cannot be in List<T>
22. B) Inc() must be static
23. C) The indexer returns a copy; mutating a temporary is disallowed (*)
24. D) List indexers are read-only
25. Explanation: Value-type indexer returns a copy; the compiler rejects the assignment because it would have no observable effect on the list.
26. Q4: Which C# version introduced primary constructors for classes?
27. A) C# 9
28. B) C# 10
29. C) C# 11
30. D) C# 12 (*)
31. Explanation: Primary constructors for classes and structs shipped in C# 12 with .NET 8; records had them since C# 9.
32. Q5: A `readonly struct` requires that…
33. A) All fields are readonly (*)
34. B) No methods are defined
35. C) It cannot have constructors
36. D) It must be sealed
37. Explanation: In a `readonly struct`, every field must be `readonly`; the compiler then skips defensive copies when the struct is passed `in`.
38. Q6: Which declaration gives an immutable value type with value equality?
39. A) record class
40. B) readonly record struct (*)
41. C) readonly struct
42. D) sealed class
43. Explanation: `readonly record struct` (C# 10) combines value-type semantics, immutability, and synthesized value equality in one declaration.
44. Q7: What is the default mutability of `record struct Point(int X, int Y)`?
45. A) Immutable (init-only)
46. B) Compile error
47. C) Mutable (settable) (*)
48. D) Depends on the runtime
49. Explanation: `record struct` is mutable by default (its properties have set accessors); use `readonly record struct` to make them init-only.
50. Q8: The `init` accessor allows assignment…
51. A) Anytime after construction
52. B) Only from derived classes
53. C) Only via reflection
54. D) Only during construction (object initializer or constructor body) (*)
55. Explanation: `init` accessors can be called during object initialization or from a constructor but not after, giving immutability without constructor boilerplate.
56. Q9: Records support which of the following out of the box?
57. A) All of the above (*)
58. B) Value equality
59. C) with expressions
60. D) Synthesized ToString
61. Explanation: Records synthesize value equality, a `with`-based copy-and-update, positional deconstruction, and a structural `ToString` — all from one keyword.
62. Q10: Boxing a struct…
63. A) Has no cost
64. B) Allocates a heap object wrapping the value (*)
65. C) Is the same as passing by ref
66. D) Makes the struct immutable
67. Explanation: Boxing copies a value type into a heap-allocated object (an `object` box), causing allocation and GC pressure; it also breaks value equality via ==.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which kind of type has value-based equality by default?
  options:
    - record
    - class
    - struct
    - array
  correctIndex: 0
  explanation: Records (both `record class` and `record struct`) synthesize value-based equality operators; plain classes use reference equality for == unless overloaded.
- id: q2
  question: What does the `with` expression require on its target type?
  options:
    - A public parameterless constructor
    - Record-like semantics (init-only properties or a synthesized Clone method)
    - The [Serializable] attribute
    - A mutable field
  correctIndex: 1
  explanation: "`with` works on records and structs with init-only auto-properties; it produces a copy then applies the member overrides via init accessors."
- id: q3
  question: Why does `list[0].Inc()` fail to compile when the list contains a mutable struct?
  options:
    - Structs cannot be in List<T>
    - Inc() must be static
    - The indexer returns a copy; mutating a temporary is disallowed
    - List indexers are read-only
  correctIndex: 2
  explanation: Value-type indexer returns a copy; the compiler rejects the assignment because it would have no observable effect on the list.
- id: q4
  question: Which C# version introduced primary constructors for classes?
  options:
    - C# 9
    - C# 10
    - C# 11
    - C# 12
  correctIndex: 3
  explanation: Primary constructors for classes and structs shipped in C# 12 with .NET 8; records had them since C# 9.
- id: q5
  question: A `readonly struct` requires that…
  options:
    - All fields are readonly
    - No methods are defined
    - It cannot have constructors
    - It must be sealed
  correctIndex: 0
  explanation: In a `readonly struct`, every field must be `readonly`; the compiler then skips defensive copies when the struct is passed `in`.
- id: q6
  question: Which declaration gives an immutable value type with value equality?
  options:
    - record class
    - readonly record struct
    - readonly struct
    - sealed class
  correctIndex: 1
  explanation: "`readonly record struct` (C# 10) combines value-type semantics, immutability, and synthesized value equality in one declaration."
- id: q7
  question: What is the default mutability of `record struct Point(int X, int Y)`?
  options:
    - "`?"
    - Immutable (init-only)
    - Compile error
    - Mutable (settable)
    - Depends on the runtime
  correctIndex: 3
  explanation: "`record struct` is mutable by default (its properties have set accessors); use `readonly record struct` to make them init-only."
- id: q8
  question: The `init` accessor allows assignment…
  options:
    - Anytime after construction
    - Only from derived classes
    - Only via reflection
    - Only during construction (object initializer or constructor body)
  correctIndex: 3
  explanation: "`init` accessors can be called during object initialization or from a constructor but not after, giving immutability without constructor boilerplate."
- id: q9
  question: Records support which of the following out of the box?
  options:
    - All of the above
    - Value equality
    - with expressions
    - Synthesized ToString
  correctIndex: 0
  explanation: Records synthesize value equality, a `with`-based copy-and-update, positional deconstruction, and a structural `ToString` — all from one keyword.
- id: q10
  question: Boxing a struct…
  options:
    - Has no cost
    - Allocates a heap object wrapping the value
    - Is the same as passing by ref
    - Makes the struct immutable
  correctIndex: 1
  explanation: Boxing copies a value type into a heap-allocated object (an `object` box), causing allocation and GC pressure; it also breaks value equality via ==.
```

