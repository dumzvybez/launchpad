---
slug: csharp-generics-constraints
id: csharp-07
track: csharp
order: 7
title: Generics and Constraints
description: "Author generic methods and types, apply constraints (where T : new(), class, struct, interface, base), understand covariance/contravariance, and learn the type-inference and overload edge cases that bite in production."
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=6000s
whyItMatters: "Author generic methods and types, apply constraints (where T : new(), class, struct, interface, base), understand covariance/contravariance, and learn the type-inference and overload edge cases that bite in production."
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Generics and Constraints

## Generics and Constraints

### Why It Matters

Author generic methods and types, apply constraints (where T : new(), class, struct, interface, base), understand covariance/contravariance, and learn the type-inference and overload edge cases that bite in production.

Author generic methods and types, apply constraints (where T : new(), class, struct, interface, base), understand covariance/contravariance, and learn the type-inference and overload edge cases that bite in production.

### Prerequisites

- Stage 5: Classes, Structs, and Records.
- Stage 6: Inheritance, Polymorphism, and Interfaces.

### Topics

- Generic methods and generic classes
- Type parameters, naming conventions (T, TKey, TValue)
- Constraints: `where T : new()`, `class`, `struct`, `notnull`, `unmanaged`, base class, interface, `Enum`
- Multiple type parameters and multiple constraints
- Covariance (`out`) and contravariance (`in`) on generic interfaces and delegates
- Generic type inference and method group conversion
- Generic math (INumber<T>, IAdditionOperators<T,T,T>) in .NET 7+
- Static abstract interface members (C# 11)

### Key Concepts

- Generics are reified at runtime — the CLR knows `List<int>` is different from `List<string>` (unlike Java's erasure), so no boxing for value-type generics.
- Constraints let you call methods on `T` (e.g., `new()` for construction, `class` for null checks, `INumber<T>` for arithmetic).
- `out` (covariance) means T appears only in outputs; `in` (contravariance) means T appears only in inputs; both are type-safe and preserve assignment compatibility.
- Static abstract interface members (C# 11) let interfaces declare operators and static methods, enabling generic math (`static T Zero { get; }`).
- Generic type inference works for methods but NOT for constructors (pre-C# 12) — `new Wrapper(5)` infers `Wrapper<int>` only in C# 12+ with target-typed `new()`.

```csharp
public static T Create<T>() where T : new() => new T();

public static T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) >= 0 ? a : b;

public static decimal Sum<T>(IEnumerable<T> items) where T : INumber<T>
{
    T sum = T.Zero;
    foreach (var x in items) sum += x;   // uses static abstract operator+
    return decimal.CreateChecked(sum);
}

Console.WriteLine(Max(3, 7));           // infers T=int
Console.WriteLine(Sum(new[] { 1, 2, 3 }));   // 6
```
Caption: Generic method with constraints

### Common Pitfalls

- Forgetting that covariance/contravariance only applies to interfaces and delegates, not classes — `IEnumerable<out T>` works, but `List<T>` is invariant (mutable) so `List<Dog>` is NOT a `List<Animal>`.
- Assuming generic type inference works for constructors — pre-C# 12, `new Wrapper(5)` did not infer `T=int` unless the constructor was generic; use `new Wrapper<int>(5)` or upgrade to C# 12 target-typed new.
- Using `where T : class` when you also need value types — this excludes `int`, `struct`, etc.; use `where T : notnull` if you just want to forbid null, or no constraint at all.
- Overloading a generic method with a non-generic version — `void M<T>(T)` and `void M(int)` resolve non-generically for `M(5)`, but `M((object)5)` becomes generic; the resolution rules are subtle and surprising.
- Boxing inside a generic method when `T` is constrained to `object` or no constraint — `EqualityComparer<T>.Default` avoids boxing, but `EqualityComparer<object>.Default` does not; use the `Default` singleton.

### Real-World Applications

- `System.Collections.Generic.List<T>` and `Dictionary<TKey, TValue>` are generic, so `List<int>` stores ints inline without boxing — a 10x perf and memory win over `ArrayList`.
- EF Core's `DbSet<TEntity>` is generic, giving compile-time-checked queries; `DbContext.Set<User>()` infers `DbSet<User>`.
- .NET 7's generic math (`INumber<T>`, `IFloatingPoint<T>`) lets libraries like Microsoft's ML.NET write one generic kernel that works for float, double, and decimal.
- Roslyn's `SyntaxList<TNode>` is covariant, letting `SyntaxList<DerivedSyntax>` be used as `SyntaxList<SyntaxNode>` for tree-walking.

### Interview Questions

- 1. How do C# generics differ from Java generics? — C# generics are reified (the runtime knows `List<int>` vs `List<string>`), so value-type generics avoid boxing; Java uses type erasure, requiring boxed wrappers.
- 2. What does `where T : new()` mean and when would you use it? — It constrains T to have a public parameterless constructor, letting you write `new T()`; useful for factory methods and repositories.
- 3. What is the difference between `class`, `struct`, and `notnull` constraints? — `class` allows only reference types; `struct` allows only non-nullable value types; `notnull` allows both but forbids null (works with NRTs).
- 4. What are static abstract interface members and what do they enable? — C# 11 lets interfaces declare operators and static members, enabling generic math (`INumber<T>`) where you can write `T.Zero` and `a + b` for any numeric type.
- 5. Why is `List<T>` invariant while `IEnumerable<T>` is covariant? — `List<T>` exposes `Add(T)`, which would be unsafe if `List<Dog>` were a `List<Animal>` (you could Add a Cat); `IEnumerable<T>` is read-only so `out T` is safe.

### Mini Project

Build a Generic Cache<TKey, TValue>: A thread-safe LRU cache generic over key and value, with constraints requiring TKey to be `notnull` and TValue to be `class, new()`. Add a factory method `GetOrAdd(TKey key, Func<TKey, TValue> factory)` and an eviction policy. Suggested approach:
  - Declare `public class LruCache<TKey, TValue> where TKey : notnull where TValue : class, new()`
  - Use `LinkedList<KeyValuePair<TKey, TValue>>` + `Dictionary<TKey, LinkedListNode<...>>` for O(1) LRU
  - Lock on a private object for thread-safety (later stages use `ConcurrentDictionary` and channels)
  - Implement `GetOrAdd` with double-check pattern
  - Add a `static LruCache<K, V> Create<K, V>(int capacity) where K : notnull where V : class, new()` factory

### Exercises

1. Write `static T[] Repeat<T>(T value, int count)` and call it with int and string; confirm no boxing.
2. Add a `where T : IComparable<T>` constraint to a `BubbleSort<T>` method and confirm it sorts value types without boxing.
3. Define `IRepository<T>` with covariant read methods and contravariant write methods; demonstrate assigning a `UserRepo` to `IReader<User>` and `IWriter<User>`.
4. Implement a generic `Sum<T>(T[] arr) where T : INumber<T>` that works for int, double, and decimal; benchmark it.
5. Write a generic `Factory<T> where T : new()` and observe that passing a struct without a parameterless ctor fails to compile.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: C# generics differ from Java generics because C# generics are…
9. A) Erased at runtime
10. B) Always boxed
11. C) Reified (the runtime distinguishes List<int> from List<string>) (*)
12. D) Slower
13. Explanation: C# generics are reified: the CLR maintains distinct types per type argument, so value-type generics avoid boxing and the JIT can specialize.
14. Q2: Which constraint requires T to have a public parameterless constructor?
15. A) where T : class
16. B) where T : struct
17. C) where T : notnull
18. D) where T : new() (*)
19. Explanation: `where T : new()` lets you call `new T()` inside the method; the compiler enforces that T has a public parameterless constructor.
20. Q3: `IEnumerable<out T>` is covariant, meaning…
21. A) IEnumerable<Dog> is assignable to IEnumerable<Animal> (*)
22. B) List<Dog> is assignable to List<Animal>
23. C) T can only appear in input positions
24. D) The interface is mutable
25. Explanation: Covariance (`out`) lets `IEnumerable<Dog>` be assigned to `IEnumerable<Animal>`; T appears only in output positions, so the assignment is type-safe.
26. Q4: Why is `List<T>` invariant?
27. A) List is not generic
28. B) List exposes Add(T), so covariance would let you add a wrong subtype (*)
29. C) List uses type erasure
30. D) List cannot be made covariant syntactically
31. Explanation: `List<T>` has both input (Add) and output (indexer getter) members; covariance on Add would allow inserting a Cat into a List<Dog>, which is unsafe.
32. Q5: Static abstract interface members (C# 11) enable…
33. A) Default interface methods
34. B) Covariance on classes
35. C) Generic math (INumber<T>) with operators (*)
36. D) Reflection-free serialization
37. Explanation: C# 11 lets interfaces declare operators and static properties, so generic code can write `T.Zero` and `a + b` for any numeric type implementing the interface.
38. Q6: Which constraint allows both reference types and non-nullable value types but forbids null?
39. A) where T : class
40. B) where T : struct
41. C) where T : new()
42. D) where T : notnull (*)
43. Explanation: `notnull` (with nullable reference types enabled) forbids null for both reference and value types; `class` excludes value types entirely.
44. Q7: `where T : unmanaged` constrains T to be…
45. A) A non-nullable value type with no reference-type fields (for interop/span) (*)
46. B) Any class
47. C) A managed heap object
48. D) A delegate
49. Explanation: `unmanaged` requires T to be a value type whose fields are all unmanaged — needed for `Span<T>`, `stackalloc`, and P/Invoke buffers.
50. Q8: Which call infers T=int for `static T Max<T>(T a, T b) where T : IComparable<T>`?
51. A) Max(3, 7)
52. B) Both A and B (*)
53. C) Max<int>(3, 7)
54. D) Max((object)3, (object)7)
55. Explanation: Both A (inferred from args) and B (explicit) work; C would infer T=object, which does not satisfy IComparable<T> by default and would fail or pick a different overload.
56. Q9: Generic type inference for constructors was added in…
57. A) C# 7
58. B) C# 9
59. C) C# 12 (*)
60. D) C# 11
61. Explanation: C# 12 (with .NET 8) added target-typed `new()` and constructor type inference, so `new Wrapper(5)` can infer `Wrapper<int>`; earlier versions required explicit `<int>`.
62. Q10: `EqualityComparer<T>.Default` is preferred over `EqualityComparer<object>.Default` because…
63. A) It avoids boxing for value types
64. B) It is faster at hashing
65. C) It uses reflection
66. D) Both A and B (*)
67. Explanation: `EqualityComparer<T>.Default` dispatches to a specialized comparer (e.g., `Int32EqualityComparer`) that avoids boxing and uses fast integer hashing.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: C# generics differ from Java generics because C# generics are…
  options:
    - Erased at runtime
    - Always boxed
    - Reified (the runtime distinguishes List<int> from List<string>)
    - Slower
  correctIndex: 2
  explanation: "C# generics are reified: the CLR maintains distinct types per type argument, so value-type generics avoid boxing and the JIT can specialize."
- id: q2
  question: Which constraint requires T to have a public parameterless constructor?
  options:
    - "where T : class"
    - "where T : struct"
    - "where T : notnull"
    - "where T : new()"
  correctIndex: 3
  explanation: "`where T : new()` lets you call `new T()` inside the method; the compiler enforces that T has a public parameterless constructor."
- id: q3
  question: "`IEnumerable<out T>` is covariant, meaning…"
  options:
    - IEnumerable<Dog> is assignable to IEnumerable<Animal>
    - List<Dog> is assignable to List<Animal>
    - T can only appear in input positions
    - The interface is mutable
  correctIndex: 0
  explanation: Covariance (`out`) lets `IEnumerable<Dog>` be assigned to `IEnumerable<Animal>`; T appears only in output positions, so the assignment is type-safe.
- id: q4
  question: Why is `List<T>` invariant?
  options:
    - List is not generic
    - List exposes Add(T), so covariance would let you add a wrong subtype
    - List uses type erasure
    - List cannot be made covariant syntactically
  correctIndex: 1
  explanation: "`List<T>` has both input (Add) and output (indexer getter) members; covariance on Add would allow inserting a Cat into a List<Dog>, which is unsafe."
- id: q5
  question: Static abstract interface members (C# 11) enable…
  options:
    - Default interface methods
    - Covariance on classes
    - Generic math (INumber<T>) with operators
    - Reflection-free serialization
  correctIndex: 2
  explanation: C# 11 lets interfaces declare operators and static properties, so generic code can write `T.Zero` and `a + b` for any numeric type implementing the interface.
- id: q6
  question: Which constraint allows both reference types and non-nullable value types but forbids null?
  options:
    - "where T : class"
    - "where T : struct"
    - "where T : new()"
    - "where T : notnull"
  correctIndex: 3
  explanation: "`notnull` (with nullable reference types enabled) forbids null for both reference and value types; `class` excludes value types entirely."
- id: q7
  question: "`where T : unmanaged` constrains T to be…"
  options:
    - A non-nullable value type with no reference-type fields (for interop/span)
    - Any class
    - A managed heap object
    - A delegate
  correctIndex: 0
  explanation: "`unmanaged` requires T to be a value type whose fields are all unmanaged — needed for `Span<T>`, `stackalloc`, and P/Invoke buffers."
- id: q8
  question: "Which call infers T=int for `static T Max<T>(T a, T b) where T : IComparable<T>`?"
  options:
    - Max(3, 7)
    - Both A and B
    - Max<int>(3, 7)
    - Max((object)3, (object)7)
  correctIndex: 1
  explanation: Both A (inferred from args) and B (explicit) work; C would infer T=object, which does not satisfy IComparable<T> by default and would fail or pick a different overload.
- id: q9
  question: Generic type inference for constructors was added in…
  options:
    - C# 7
    - C# 9
    - C# 12
    - C# 11
  correctIndex: 2
  explanation: C# 12 (with .NET 8) added target-typed `new()` and constructor type inference, so `new Wrapper(5)` can infer `Wrapper<int>`; earlier versions required explicit `<int>`.
- id: q10
  question: "`EqualityComparer<T>.Default` is preferred over `EqualityComparer<object>.Default` because…"
  options:
    - It avoids boxing for value types
    - It is faster at hashing
    - It uses reflection
    - Both A and B
  correctIndex: 3
  explanation: "`EqualityComparer<T>.Default` dispatches to a specialized comparer (e.g., `Int32EqualityComparer`) that avoids boxing and uses fast integer hashing."
```

