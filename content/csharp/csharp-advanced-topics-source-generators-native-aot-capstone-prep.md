---
slug: csharp-advanced-topics-source-generators-native-aot-capstone-prep
id: csharp-20
track: csharp
order: 20
title: Advanced Topics — Source Generators, Native AOT, and Capstone Prep
description: Author a Roslyn source generator, understand Native AOT and trimming constraints, and tie the whole track together with capstone prep — choosing the architecture, libraries, and deployment for the final project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=19000s
whyItMatters: Author a Roslyn source generator, understand Native AOT and trimming constraints, and tie the whole track together with capstone prep — choosing the architecture, libraries, and deployment for the final project.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Advanced Topics — Source Generators, Native AOT, and Capstone Prep

## Advanced Topics — Source Generators, Native AOT, and Capstone Prep

### Why It Matters

Author a Roslyn source generator, understand Native AOT and trimming constraints, and tie the whole track together with capstone prep — choosing the architecture, libraries, and deployment for the final project.

Author a Roslyn source generator, understand Native AOT and trimming constraints, and tie the whole track together with capstone prep — choosing the architecture, libraries, and deployment for the final project.

### Prerequisites

- Stage 14: Reflection, Attributes, and Expression Trees.
- Stage 17: .NET Ecosystem (MSBuild, NuGet).
- Stage 19: ASP.NET Core Basics.

### Topics

- Roslyn source generators: `ISourceGenerator`, `IIncrementalGenerator`
- `[Generator]` attribute, `ForAttributeWithMetadataName` (.NET 7+)
- Generated code patterns: DTOs from interfaces, JSON serializers, validators
- Native AOT: `<PublishAot>true</PublishAot>`, trimming, reflection warnings
- `<InvariantGlobalization>`, `<ServerGarbageCollection>`, single-file publish
- `[DynamicallyAccessedMembers]` and trim warnings (IL2050, IL2075, etc.)
- Performance: `dotnet-trace`, `dotnet-counters`, `BenchmarkDotNet`
- Capstone prep: architecture checklist, library choices, deployment plan

### Key Concepts

- Source generators run at compile time and emit C# code that the compiler includes in the assembly; they replace runtime reflection for AOT/trimming and reduce boilerplate (DTOs, serializers, validators).
- `IIncrementalGenerator` (newer) is a pipelined generator that caches and reuses outputs when inputs are unchanged — far faster than the original `ISourceGenerator` for large solutions.
- Native AOT compiles to native code ahead-of-time; reflection, dynamic loading, and `Expression.Compile` are restricted; annotate with `[DynamicallyAccessedMembers]` or use source generators.
- Trim warnings (ILxxxx) tell you which reflection calls the trimmer can't verify; resolve by annotation, source generation, or `DynamicDependency` — never by suppression unless you've audited.
- BenchmarkDotNet is the standard for microbenchmarks: `[Benchmark]` methods, `[Params]` for matrices, statistical analysis with `[SimpleJob]` and `[MemoryDiagnoser]`.

### Common Pitfalls

- Suppressing trim warnings (`[UnconditionalSuppressMessage]`) without auditing — hides AOT failures that surface as `MissingMethodException` at runtime in production; resolve the root cause or annotate.
- Using `Activator.CreateInstance(Type)` without `[DynamicallyAccessedMembers]` — the trimmer can't know which constructor to keep, so it may be trimmed away; use the generic `Activator.CreateInstance<T>()` or annotate.
- Source generator projects targeting the wrong TFM — generators must target `netstandard2.0` so they can run on any SDK; targeting `net8.0` breaks older SDKs.
- Forgetting `IIncrementalGenerator` caching — the older `ISourceGenerator` re-runs on every change; `IIncrementalGenerator` pipelines inputs so unchanged files don't re-emit, crucial for large solutions.
- Publishing AOT without testing locally — cold-start wins are real but reflection-based code paths break silently; always run `dotnet publish -r <rid>` and exercise the binary before deploying.

### Real-World Applications

- `System.Text.Json` source generators are used throughout the Azure SDK to enable Native AOT deployment with minimal reflection.
- ASP.NET Core's rate limiter, output caching, and request delegate generators (for Minimal APIs) use Roslyn source generators to emit compiled handlers at build time.
- Microsoft's own PowerFx and Roslyn analyzers use incremental generators to analyze millions of LoC in seconds with caching.
- Stack Overflow's tag engine uses BenchmarkDotNet-validated hot paths and AOT-published worker services for sub-millisecond cache lookups.

### Interview Questions

- 1. What is a source generator and what problem does it solve? — A Roslyn component that runs at compile time and emits C# code into the compilation; replaces runtime reflection (AOT/trimming) and reduces boilerplate.
- 2. What is the difference between `ISourceGenerator` and `IIncrementalGenerator`? — `IIncrementalGenerator` (newer) has a pipelined model that caches outputs for unchanged inputs, dramatically reducing re-execution on large solutions.
- 3. What does Native AOT restrict? — Reflection-based code (dynamic loading, `Activator.CreateInstance(Type)`, `Expression.Compile`); annotate with `[DynamicallyAccessedMembers]` or use source generators to stay trim-safe.
- 4. What is a trim warning (IL2050, IL2075)? — The trimmer's signal that it cannot statically verify a reflection call will work after trimming; resolve by annotation, source generation, or refactoring — not by suppression unless audited.
- 5. Why use BenchmarkDotNet instead of `Stopwatch`? — It handles warmup, statistical analysis, GC side-effects, multiple iterations, and memory diagnoser; manual `Stopwatch` benchmarks are misleading due to JIT warmup and noise.

### Mini Project

Build a Source-Generated DTO Factory: A generator that emits a `Create()` method for every class decorated with `[GenerateFactory]`, producing a factory that calls the constructor with default values for missing arguments. Verify it trims cleanly under `<PublishAot>true</PublishAot>`. Suggested approach:
  - Create a netstandard2.0 generator project with `Microsoft.CodeAnalysis.CSharp` references
  - Use `IIncrementalGenerator` + `ForAttributeWithMetadataName("MyApp.GenerateFactoryAttribute")`
  - Emit a partial `XFactory` class with `public static X Create() => new X(default, default, ...);`
  - Reference the generator from a console app as an analyzer (`<ProjectReference ... OutputItemType="Analyzer" />`)
  - Publish the console app with `<PublishAot>true</PublishAot>` and confirm no IL2050 warnings

### Exercises

1. Write an `IIncrementalGenerator` that emits a `Strings` class with all constant string fields from a `[StringConstants]`-decorated class.
2. Publish a Minimal API with `<PublishAot>true</PublishAot>` and resolve every IL2050/IL2075 warning by annotation or source generation.
3. Use `dotnet-trace collect` to capture a 30s trace of a sample app and inspect with `dotnet-trace report` or PerfView.
4. Write a BenchmarkDotNet harness comparing `string.Concat`, `StringBuilder`, and `string.Join` over 1000 strings; report allocations and mean.
5. Audit a small library for reflection usage; replace one `Activator.CreateInstance(Type)` with a source-generated switch and confirm trim warnings disappear.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Source generators run…
9. A) At runtime
10. B) At deploy time
11. C) In the GC
12. D) At compile time, emitting C# into the compilation (*)
13. Explanation: Source generators are Roslyn components that execute during compilation, adding source files to the compilation; they replace runtime reflection (AOT/trimming) and reduce boilerplate.
14. Q2: `IIncrementalGenerator` differs from `ISourceGenerator` by…
15. A) Pipelined, caching outputs for unchanged inputs (faster on large solutions) (*)
16. B) Supporting more languages
17. C) Being deprecated
18. D) Running at runtime
19. Explanation: `IIncrementalGenerator` models generation as a pipeline of incremental transforms; unchanged inputs short-circuit, so only affected outputs are recomputed — essential for large solutions.
20. Q3: Native AOT restricts…
21. A) Async/await
22. B) Reflection-heavy patterns (dynamic loading, Expression.Compile, Activator.CreateInstance(Type)) (*)
23. C) Generics
24. D) LINQ
25. Explanation: AOT compiles ahead-of-time; the trimmer removes unused code, so runtime reflection on trimmed members fails. Annotate with `[DynamicallyAccessedMembers]` or use source generators.
26. Q4: A trim warning (e.g., IL2050) means…
27. A) A syntax error
28. B) The build failed
29. C) The trimmer cannot statically verify a reflection call will work after trimming (*)
30. D) The package is outdated
31. Explanation: IL2xxx warnings indicate the trimmer cannot prove a reflection target survives trimming; resolve by annotation, source generation, or refactoring. Suppression (`[UnconditionalSuppressMessage]`) hides the risk.
32. Q5: `[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicParameterlessConstructor)]` on a type parameter tells the trimmer…
33. A) To remove the type
34. B) To make the type sealed
35. C) To disable the JIT
36. D) To keep the public parameterless constructor of the type (*)
37. Explanation: The annotation tells the trimmer to retain the specified members (here, the parameterless ctor) so reflection can find them at runtime; this resolves the corresponding IL2050/IL2075 warning.
38. Q6: Source generator projects should target…
39. A) netstandard2.0 (so any SDK can run them) (*)
40. B) net8.0
41. C) net462
42. D) net9.0
43. Explanation: Generators run inside the compiler/SDK host; netstandard2.0 ensures compatibility across SDK versions (which themselves may run on older .NET runtimes).
44. Q7: BenchmarkDotNet is preferred over manual `Stopwatch` because…
45. A) Stopwatch is deprecated
46. B) It handles warmup, statistical analysis, GC noise, and multiple iterations (*)
47. C) Stopwatch is slower
48. D) BenchmarkDotNet does not exist
49. Explanation: Manual Stopwatch benchmarks are dominated by JIT warmup, GC pauses, and noise; BenchmarkDotNet runs warmup, multiple iterations, statistical analysis, and optional memory diagnoser for reliable results.
50. Q8: `<PublishAot>true</PublishAot>` produces…
51. A) A framework-dependent DLL
52. B) A NuGet package
53. C) A native ahead-of-time compiled binary (*)
54. D) A container image
55. Explanation: `<PublishAot>true</PublishAot>` invokes the AOT compiler at publish time, producing a native binary for the target RID; cold start is milliseconds, but reflection is restricted.
56. Q9: `dotnet-trace collect` is used to…
57. A) Format source code
58. B) Publish AOT
59. C) Restore packages
60. D) Profile CPU and allocations via EventPipe (*)
61. Explanation: `dotnet-trace` collects a profile of a running .NET process via EventPipe (no profiler attach needed); inspect with PerfView, Speedscope, or `dotnet-trace report`.
62. Q10: `[UnconditionalSuppressMessage]` should be used…
63. A) Only after auditing that the suppressed reflection is trim-safe (*)
64. B) Always, to silence all warnings
65. C) To enable reflection
66. D) Never
67. Explanation: Suppression hides the warning without verifying safety; only use after a manual audit confirms the reflection target is preserved (or you accept the runtime risk). The default should be to fix the root cause.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Source generators run…
  options:
    - At runtime
    - At deploy time
    - In the GC
    - At compile time, emitting C# into the compilation
  correctIndex: 3
  explanation: Source generators are Roslyn components that execute during compilation, adding source files to the compilation; they replace runtime reflection (AOT/trimming) and reduce boilerplate.
- id: q2
  question: "`IIncrementalGenerator` differs from `ISourceGenerator` by…"
  options:
    - Pipelined, caching outputs for unchanged inputs (faster on large solutions)
    - Supporting more languages
    - Being deprecated
    - Running at runtime
  correctIndex: 0
  explanation: "`IIncrementalGenerator` models generation as a pipeline of incremental transforms; unchanged inputs short-circuit, so only affected outputs are recomputed — essential for large solutions."
- id: q3
  question: Native AOT restricts…
  options:
    - Async/await
    - Reflection-heavy patterns (dynamic loading, Expression.Compile, Activator.CreateInstance(Type))
    - Generics
    - LINQ
  correctIndex: 1
  explanation: AOT compiles ahead-of-time; the trimmer removes unused code, so runtime reflection on trimmed members fails. Annotate with `[DynamicallyAccessedMembers]` or use source generators.
- id: q4
  question: A trim warning (e.g., IL2050) means…
  options:
    - A syntax error
    - The build failed
    - The trimmer cannot statically verify a reflection call will work after trimming
    - The package is outdated
  correctIndex: 2
  explanation: IL2xxx warnings indicate the trimmer cannot prove a reflection target survives trimming; resolve by annotation, source generation, or refactoring. Suppression (`[UnconditionalSuppressMessage]`) hides the risk.
- id: q5
  question: "`[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicParameterlessConstructor)]` on a type parameter tells the trimmer…"
  options:
    - To remove the type
    - To make the type sealed
    - To disable the JIT
    - To keep the public parameterless constructor of the type
  correctIndex: 3
  explanation: The annotation tells the trimmer to retain the specified members (here, the parameterless ctor) so reflection can find them at runtime; this resolves the corresponding IL2050/IL2075 warning.
- id: q6
  question: Source generator projects should target…
  options:
    - netstandard2.0 (so any SDK can run them)
    - net8.0
    - net462
    - net9.0
  correctIndex: 0
  explanation: Generators run inside the compiler/SDK host; netstandard2.0 ensures compatibility across SDK versions (which themselves may run on older .NET runtimes).
- id: q7
  question: BenchmarkDotNet is preferred over manual `Stopwatch` because…
  options:
    - Stopwatch is deprecated
    - It handles warmup, statistical analysis, GC noise, and multiple iterations
    - Stopwatch is slower
    - BenchmarkDotNet does not exist
  correctIndex: 1
  explanation: Manual Stopwatch benchmarks are dominated by JIT warmup, GC pauses, and noise; BenchmarkDotNet runs warmup, multiple iterations, statistical analysis, and optional memory diagnoser for reliable results.
- id: q8
  question: "`<PublishAot>true</PublishAot>` produces…"
  options:
    - A framework-dependent DLL
    - A NuGet package
    - A native ahead-of-time compiled binary
    - A container image
  correctIndex: 2
  explanation: "`<PublishAot>true</PublishAot>` invokes the AOT compiler at publish time, producing a native binary for the target RID; cold start is milliseconds, but reflection is restricted."
- id: q9
  question: "`dotnet-trace collect` is used to…"
  options:
    - Format source code
    - Publish AOT
    - Restore packages
    - Profile CPU and allocations via EventPipe
  correctIndex: 3
  explanation: "`dotnet-trace` collects a profile of a running .NET process via EventPipe (no profiler attach needed); inspect with PerfView, Speedscope, or `dotnet-trace report`."
- id: q10
  question: "`[UnconditionalSuppressMessage]` should be used…"
  options:
    - Only after auditing that the suppressed reflection is trim-safe
    - Always, to silence all warnings
    - To enable reflection
    - Never
  correctIndex: 0
  explanation: Suppression hides the warning without verifying safety; only use after a manual audit confirms the reflection target is preserved (or you accept the runtime risk). The default should be to fix the root cause.
```

