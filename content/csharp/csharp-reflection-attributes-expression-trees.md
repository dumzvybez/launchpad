---
slug: csharp-reflection-attributes-expression-trees
id: csharp-14
track: csharp
order: 14
title: Reflection, Attributes, and Expression Trees
description: Inspect types and members with reflection, author and read custom attributes, build expression trees with `Expression<T>`, and understand the performance and AOT implications.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=13000s
whyItMatters: Inspect types and members with reflection, author and read custom attributes, build expression trees with `Expression<T>`, and understand the performance and AOT implications.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Reflection, Attributes, and Expression Trees

## Reflection, Attributes, and Expression Trees

### Why It Matters

Inspect types and members with reflection, author and read custom attributes, build expression trees with `Expression<T>`, and understand the performance and AOT implications.

Inspect types and members with reflection, author and read custom attributes, build expression trees with `Expression<T>`, and understand the performance and AOT implications.

### Prerequisites

- Stage 5: Classes, Structs, and Records.
- Stage 6: Inheritance, Polymorphism, and Interfaces.
- Stage 13: File I/O (for assembly loading).

### Topics

- Type, TypeInfo, MemberInfo, MethodInfo, FieldInfo, PropertyInfo
- `typeof`, `GetType()`, `is`, and `as`
- Activator.CreateInstance and dynamic invocation
- Custom attributes: `[AttributeUsage]`, Attribute.GetCustomAttribute
- Reflection.Emit and DynamicMethod (rare; mention source generators instead)
- Expression trees: `Expression<Func<T, bool>>`, ParameterExpression, lambda
- Expression.Compile() to a delegate
- AOT/trimming implications and `[DynamicallyAccessedMembers]`

### Key Concepts

- Reflection lets you inspect metadata (types, members, attributes) at runtime — powerful but slow (~100x a direct call) and incompatible with Native AOT unless annotated.
- Custom attributes are metadata; you define a class inheriting `Attribute`, decorate members, and read them via `MemberInfo.GetCustomAttributes`.
- Expression trees (in `System.Linq.Expressions`) represent code as data; EF Core translates them to SQL, and you can `Compile()` them to a delegate for runtime codegen.
- Reflection breaks trimming/AOT — the trimmer can't see what you'll reflect at runtime; annotate with `[DynamicallyAccessedMembers]` or use source generators instead.
- `Expression.Compile()` produces a dynamic method (IL emit) — fast to call but incompatible with Native AOT; for AOT, pre-compile at build time via source generators.

```csharp
Type t = typeof(Person);
foreach (var prop in t.GetProperties())
    Console.WriteLine($"{prop.Name} : {prop.PropertyType}");

var p = new Person("Alice", 30);
var nameProp = t.GetProperty("Name");
string? name = (string?)nameProp?.GetValue(p);   // "Alice"
nameProp?.SetValue(p, "Bob");
```
Caption: Basic reflection

### Common Pitfalls

- Using reflection in a hot loop — `methodInfo.Invoke` is ~100x slower than a direct call; cache the delegate (`CreateDelegate`) or use source generators / expression trees to pre-compile.
- Reflection breaks trimming and Native AOT — the trimmer can't see runtime types, so it may remove the members you reflect; annotate with `[DynamicallyAccessedMembers]` or use source generators.
- Confusing `Expression<Func<T>>` (a tree) with `Func<T>` (a delegate) — EF Core's `Where` takes `Expression<Func<T, bool>>` so it can translate to SQL; passing a `Func<T, bool>` overload switches to client-side evaluation.
- Forgetting `AttributeUsage` — without it, your attribute can decorate anything (including return values), which is sloppy; restrict to `AttributeTargets.Property | AttributeTargets.Class`.
- `Expression.Compile()` produces IL via DynamicMethod — works on JIT but NOT with Native AOT; for AOT, use source generators to emit code at compile time.

### Real-World Applications

- EF Core builds SQL from `Expression<Func<T, bool>>` trees passed to `Where`; the SQL provider walks the tree and emits parameterized SQL.
- ASP.NET Core MVC uses reflection (cached) to bind JSON to action parameters and to discover controllers/routes via `[Route]` and `[HttpGet]` attributes.
- System.Text.Json source generators replace runtime reflection for serialization in AOT scenarios — Microsoft uses them in Azure SDK libraries.
- Xunit/MSTest discover test methods via `[Fact]`/`[TestMethod]` attributes using reflection at test-discovery time.

### Interview Questions

- 1. What is the performance cost of reflection vs direct calls? — `MethodInfo.Invoke` is ~100x slower due to argument binding and security checks; cache the compiled delegate or use expression trees to bridge.
- 2. How do expression trees differ from delegates? — A delegate (`Func<T,T>`) is executable code; an expression tree (`Expression<Func<T,T>>`) is data representing the code, which can be inspected, translated (to SQL), or compiled to a delegate.
- 3. Why does reflection break trimming/Native AOT? — The trimmer statically analyzes usage; reflection's runtime-determined targets are invisible, so the trimmer may remove the very members you intend to reflect.
- 4. How do you author a custom attribute and read it? — Define a class inheriting `Attribute` with `[AttributeUsage(...)]`, decorate members, then read via `MemberInfo.GetCustomAttribute<T>()`.
- 5. When should you use `Expression.Compile()` vs source generators? — `Compile()` for runtime codegen (plugins, dynamic rules) on JIT; source generators for build-time codegen that must work with Native AOT.

### Mini Project

Build a Validation Framework: A `[MaxLength]`, `[Required]`, `[Range]` attribute-based validator that uses reflection to read attributes off a DTO and produce a list of validation errors. Cache the reflected metadata per type so repeated validations don't re-reflect. Suggested approach:
  - Define `RequiredAttribute`, `MaxLengthAttribute(int)`, `RangeAttribute(int min, int max)` inheriting `Attribute`
  - Decorate a `UserDto` with `[Required] Name`, `[MaxLength(50)] Email`, `[Range(0, 120)] Age`
  - Build a `Validator<T>` that caches `PropertyInfo[]` and attribute lists per type in a `ConcurrentDictionary<Type, ValidationPlan>`
  - Run all validators and collect `ValidationError[]`
  - Bonus: emit a compiled delegate via `Expression.Compile()` per property for getter speed

### Exercises

1. Use reflection to list all public properties of a type and print their names and types.
2. Author a `[Description("...")]` attribute and read it off an enum value via `GetCustomAttribute`.
3. Build an `Expression<Func<int, int>>` for `x => x*x + 1` by hand and compile it.
4. Benchmark `MethodInfo.Invoke` vs a cached `Delegate.CreateDelegate` vs a direct call over 1M iterations.
5. Mark a type with `[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicProperties)]` and confirm trimming no longer warns.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Reflection (`MethodInfo.Invoke`) compared to a direct call is roughly…
9. A) Faster
10. B) ~100x slower (*)
11. C) Same speed
12. D) Always async
13. Explanation: Reflection does runtime argument binding, visibility checks, and boxing; a direct call is JIT-inlined. Cache a compiled delegate (`CreateDelegate`) to bridge the gap.
14. Q2: `Expression<Func<T, bool>>` is…
15. A) A delegate (executable code)
16. B) A type alias
17. C) A data structure (tree) representing code (*)
18. D) A serialization format
19. Explanation: An expression tree is data — a tree of nodes (Parameter, Binary, Constant) representing the lambda's code; EF Core translates it to SQL, or `.Compile()` produces a runnable delegate.
20. Q3: EF Core's `IQueryable<T>.Where(Expression<Func<T,bool>>)` overload exists so that…
21. A) The predicate runs in memory
22. B) The predicate is cached
23. C) The predicate is async
24. D) The predicate can be translated to SQL and run on the database (*)
25. Explanation: `IQueryable<T>.Where` takes an expression tree so the provider can walk it and emit SQL; the `IEnumerable<T>.Where(Func<T,bool>)` overload runs the predicate in memory (client-side).
26. Q4: Reflection is incompatible with Native AOT unless…
27. A) You annotate with `[DynamicallyAccessedMembers]` or use source generators (*)
28. B) You disable the JIT
29. C) You run in release mode
30. D) You use .NET Framework
31. Explanation: The trimmer statically analyzes usage; `[DynamicallyAccessedMembers]` tells it which members to keep, and source generators can emit code at compile time without runtime reflection.
32. Q5: `Expression.Compile()` produces…
33. A) A C# source file
34. B) A dynamic method (IL emit) callable as a delegate (*)
35. C) A serialized tree
36. D) A SQL query
37. Explanation: `Compile()` emits IL via DynamicMethod, returning a typed delegate that runs at near-direct-call speed; it requires the JIT and is incompatible with Native AOT.
38. Q6: A custom attribute class should…
39. A) Inherit Object directly
40. B) Be sealed always
41. C) Inherit Attribute and be decorated with [AttributeUsage] (*)
42. D) Be static
43. Explanation: Custom attributes inherit `Attribute` and use `[AttributeUsage]` to restrict which targets (class, property, method, etc.) they can decorate and whether multiple instances are allowed.
44. Q7: `typeof(T)` vs `obj.GetType()`…
45. A) They are identical
46. B) `typeof` requires an instance
47. C) `GetType` requires a type parameter
48. D) `typeof(T)` is compile-time (static type); `GetType()` is runtime (actual type) (*)
49. Explanation: `typeof(T)` returns the static type parameter at compile time; `obj.GetType()` returns the runtime type of the instance, which may be a more-derived type than the static type.
50. Q8: Caching a reflected `MethodInfo` as a `Delegate` (via `CreateDelegate`)…
51. A) Closes most of the perf gap vs a direct call (*)
52. B) Makes it slower
53. C) Disables reflection
54. D) Is illegal
55. Explanation: `Delegate.CreateDelegate` produces a typed delegate that invokes the method with near-direct-call speed (no per-call argument binding); cache it once and reuse.
56. Q9: `Attribute.GetCustomAttribute(prop, typeof(MyAttr))` returns…
57. A) void
58. B) The attribute instance or null if not present (*)
59. C) A bool
60. D) An array of all attributes
61. Explanation: `GetCustomAttribute` returns the first matching attribute instance or null; use `GetCustomAttributes` (plural) for all instances including inherited ones.
62. Q10: Source generators are preferred over runtime reflection for AOT because…
63. A) They are faster at runtime
64. B) They are easier to write
65. C) They emit code at compile time, so no runtime reflection is needed (*)
66. D) They support more types
67. Explanation: Source generators run at compile time and emit C# code that the compiler includes in the assembly; the generated code uses direct calls (no reflection), so it trims cleanly and works under Native AOT.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Reflection (`MethodInfo.Invoke`) compared to a direct call is roughly…
  options:
    - Faster
    - ~100x slower
    - Same speed
    - Always async
  correctIndex: 1
  explanation: Reflection does runtime argument binding, visibility checks, and boxing; a direct call is JIT-inlined. Cache a compiled delegate (`CreateDelegate`) to bridge the gap.
- id: q2
  question: "`Expression<Func<T, bool>>` is…"
  options:
    - A delegate (executable code)
    - A type alias
    - A data structure (tree) representing code
    - A serialization format
  correctIndex: 2
  explanation: An expression tree is data — a tree of nodes (Parameter, Binary, Constant) representing the lambda's code; EF Core translates it to SQL, or `.Compile()` produces a runnable delegate.
- id: q3
  question: EF Core's `IQueryable<T>.Where(Expression<Func<T,bool>>)` overload exists so that…
  options:
    - The predicate runs in memory
    - The predicate is cached
    - The predicate is async
    - The predicate can be translated to SQL and run on the database
  correctIndex: 3
  explanation: "`IQueryable<T>.Where` takes an expression tree so the provider can walk it and emit SQL; the `IEnumerable<T>.Where(Func<T,bool>)` overload runs the predicate in memory (client-side)."
- id: q4
  question: Reflection is incompatible with Native AOT unless…
  options:
    - You annotate with `[DynamicallyAccessedMembers]` or use source generators
    - You disable the JIT
    - You run in release mode
    - You use .NET Framework
  correctIndex: 0
  explanation: The trimmer statically analyzes usage; `[DynamicallyAccessedMembers]` tells it which members to keep, and source generators can emit code at compile time without runtime reflection.
- id: q5
  question: "`Expression.Compile()` produces…"
  options:
    - A C# source file
    - A dynamic method (IL emit) callable as a delegate
    - A serialized tree
    - A SQL query
  correctIndex: 1
  explanation: "`Compile()` emits IL via DynamicMethod, returning a typed delegate that runs at near-direct-call speed; it requires the JIT and is incompatible with Native AOT."
- id: q6
  question: A custom attribute class should…
  options:
    - Inherit Object directly
    - Be sealed always
    - Inherit Attribute and be decorated with [AttributeUsage]
    - Be static
  correctIndex: 2
  explanation: Custom attributes inherit `Attribute` and use `[AttributeUsage]` to restrict which targets (class, property, method, etc.) they can decorate and whether multiple instances are allowed.
- id: q7
  question: "`typeof(T)` vs `obj.GetType()`…"
  options:
    - "` vs `obj.GetType()`…"
    - They are identical
    - "`typeof` requires an instance"
    - "`GetType` requires a type parameter"
    - "`typeof(T)` is compile-time (static type); `GetType()` is runtime (actual type)"
    - "` returns the static type parameter at compile time; `obj.GetType()` returns the runtime type of the instance, which may be a more-derived type than the static type."
  correctIndex: 4
  explanation: "`typeof(T)` returns the static type parameter at compile time; `obj.GetType()` returns the runtime type of the instance, which may be a more-derived type than the static type."
- id: q8
  question: Caching a reflected `MethodInfo` as a `Delegate` (via `CreateDelegate`)…
  options:
    - Closes most of the perf gap vs a direct call
    - Makes it slower
    - Disables reflection
    - Is illegal
  correctIndex: 0
  explanation: "`Delegate.CreateDelegate` produces a typed delegate that invokes the method with near-direct-call speed (no per-call argument binding); cache it once and reuse."
- id: q9
  question: "`Attribute.GetCustomAttribute(prop, typeof(MyAttr))` returns…"
  options:
    - void
    - The attribute instance or null if not present
    - A bool
    - An array of all attributes
  correctIndex: 1
  explanation: "`GetCustomAttribute` returns the first matching attribute instance or null; use `GetCustomAttributes` (plural) for all instances including inherited ones."
- id: q10
  question: Source generators are preferred over runtime reflection for AOT because…
  options:
    - They are faster at runtime
    - They are easier to write
    - They emit code at compile time, so no runtime reflection is needed
    - They support more types
  correctIndex: 2
  explanation: Source generators run at compile time and emit C# code that the compiler includes in the assembly; the generated code uses direct calls (no reflection), so it trims cleanly and works under Native AOT.
```

