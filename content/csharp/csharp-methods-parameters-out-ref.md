---
slug: csharp-methods-parameters-out-ref
id: csharp-04
track: csharp
order: 4
title: Methods, Parameters, and Out/Ref
description: Author methods with all parameter kinds (value, ref, out, in, params), use named and optional arguments, master overload resolution, and learn local functions and expression-bodied members.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=3000s
whyItMatters: Author methods with all parameter kinds (value, ref, out, in, params), use named and optional arguments, master overload resolution, and learn local functions and expression-bodied members.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Methods, Parameters, and Out/Ref

## Methods, Parameters, and Out/Ref

### Why It Matters

Author methods with all parameter kinds (value, ref, out, in, params), use named and optional arguments, master overload resolution, and learn local functions and expression-bodied members.

Author methods with all parameter kinds (value, ref, out, in, params), use named and optional arguments, master overload resolution, and learn local functions and expression-bodied members.

### Prerequisites

- Stage 1: Getting Started with C# and .NET.
- Stage 2: Variables, Types, and Operators.
- Stage 3: Control Flow — Conditionals and Loops.

### Topics

- Method declaration: return type, name, parameters, body
- Value parameters (default), ref (in/out), out, in (read-only ref)
- params arrays and `params ReadOnlySpan<T>` (C# 13)
- Optional parameters (default values) and named arguments
- Method overloading and overload resolution rules
- Local functions (C# 7) and static local functions
- Expression-bodied members (C# 6/7): `=>` for methods, properties, constructors
- Tuple return types and deconstruction

### Key Concepts

- `ref` means "alias to the caller's variable" — both reads and writes go through; `out` is a write-only `ref` that the callee MUST assign before returning; `in` is a read-only `ref` for passing large structs without copying.
- Overload resolution considers the static types at the call site; the compiler picks the "best" match, and ambiguity is a compile-time error.
- Optional parameters are baked into call sites as default values — same cross-assembly versioning hazard as `const`.
- Local functions can capture enclosing locals; `static` local functions cannot (avoids accidental closure allocations).
- `params` is syntactic sugar — the compiler collects variadic args into an array (allocates); `params ReadOnlySpan<T>` (.NET 7+) avoids the allocation.

```csharp
static void Increment(ref int x) => x++;          // alias: caller sees changes
static bool TryParseInt(string s, out int result) // must assign result
{
    if (int.TryParse(s, out result)) return true;
    result = 0;
    return false;
}
static double Magnitude(in Vector3 v)             // read-only ref, no copy
    => Math.Sqrt(v.X * v.X + v.Y * v.Y + v.Z * v.Z);

int n = 5;
Increment(ref n);                  // n is now 6
TryParseInt("42", out int r);      // r declared inline (C# 7)
```
Caption: ref, out, in

### Common Pitfalls

- Forgetting to assign an `out` parameter on all return paths — the compiler enforces this (good!), but throws developers who try to early-return without setting it.
- Confusing `ref` and `out` — `out` requires the callee to assign (caller need not initialize); `ref` requires the caller to initialize (callee may read before writing). Mixing them up is a compile error.
- Adding an optional parameter to a public method in a library — callers compiled against the old version still bake in the old default; recompile or add an overload.
- Passing a large readonly struct by value — implicit copy on every call; use `in` to pass by read-only reference (but watch out for defensive copies if the struct is not `readonly struct`).
- Using `async void` for "fire-and-forget" methods — exceptions crash the process and the caller can't await; use `async Task` and explicitly ignore (or use `Task.Run` + logging).

### Real-World Applications

- `int.TryParse` (in the BCL) uses `out` so callers can branch on success and read the value in one call without exceptions for the common bad-input case.
- The .NET Numerics package uses `in` parameters on `Vector<double>`-sized structs to avoid copying multi-hundred-byte SIMD vectors on every operation.
- EF Core's `DbContext.SaveChangesAsync` overload accepts a `CancellationToken` as an optional parameter so existing callers don't break — but it's not optional-defaulted; it's overloading.
- Roslyn's syntax visitor uses `virtual` methods with `params` arrays of arguments to support variadic node-visitor dispatch.

### Interview Questions

- 1. What is the difference between `ref`, `out`, and `in`? — `ref` aliases a caller-initialized variable (read+write); `out` is write-only and the callee must assign; `in` is a read-only ref to avoid copying large structs.
- 2. Why are optional parameters considered a versioning hazard? — Defaults are baked into call-site IL, so a library change to a default is invisible to already-compiled consumers until they recompile.
- 3. What is a local function and when should it be `static`? — A method declared inside another method (can capture enclosing locals); mark it `static` to forbid captures, preventing accidental closure allocations and forcing explicit parameter passing.
- 4. How does overload resolution pick the best method? — It builds a candidate set, applies better-conversion rules (exact match > implicit > params), and errors on ties; `params` is always worse than a direct parameter.
- 5. What does `params ReadOnlySpan<T>` (C# 13) improve? — It lets variadic methods receive a stack-allocated span instead of a heap-allocated array, eliminating the GC pressure of `params int[]` in hot paths.

### Mini Project

Build a Mini Spreadsheet Evaluator: A method `double Eval(string expr)` that parses a simple arithmetic expression like "3 + 4 * 2" using a recursive-descent parser, with `TryEval` returning `(bool ok, double value, string error)` as a tuple. Suggested approach:
  - Use a `TryEval(string expr, out double result, out string err)` overload and a tuple-returning wrapper
  - Implement local functions `ParseTerm`, `ParseFactor`, `ParseNumber` that call each other recursively
  - Use `ref int pos` to track the current parser position shared across calls
  - Mark local functions `static` where they don't capture (forces explicit pos passing)
  - Add unit tests via a `Main` method that asserts `Eval("3 + 4 * 2") == 11`

### Exercises

1. Write `void Swap(ref int a, ref int b)` and confirm it modifies the caller's variables.
2. Implement `bool TryDivide(int a, int b, out int q, out int r)` returning quotient and remainder; verify the compiler enforces assigning both.
3. Add an optional parameter to a public method, call it from a second project without recompiling after changing the default, and observe the stale value.
4. Write a recursive Fibonacci using a `static local function` inside the public method and benchmark it against a memoized version.
5. Convert a class with full-property bodies to expression-bodied members and confirm the IL is functionally equivalent.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which parameter kind requires the callee to assign before returning?
9. A) ref
10. B) in
11. C) params
12. D) out (*)
13. Explanation: `out` parameters must be definitely assigned by the callee on all return paths; the compiler enforces this so callers always read a valid value.
14. Q2: Which parameter kind passes a large struct by read-only reference (no copy)?
15. A) in (*)
16. B) ref
17. C) out
18. D) params
19. Explanation: `in` is a read-only alias to the caller's variable; it avoids copying large structs and forbids the callee from mutating it.
20. Q3: What is the versioning hazard with optional parameters?
21. A) They cannot be changed
22. B) Default values are baked into call sites at compile time (*)
23. C) They are not supported in interfaces
24. D) They cause runtime errors when changed
25. Explanation: A default value becomes a literal in the caller's IL; changing it in a library does not affect already-compiled consumers until they recompile.
26. Q4: A `static local function`…
27. A) Cannot be called from outside its parent
28. B) Cannot capture variables from the enclosing method
29. C) Both A and B (*)
30. D) Is compiled as a top-level method
31. Explanation: `static` local functions are still scoped to the enclosing method (A) and additionally cannot capture enclosing locals (B), forcing explicit parameter passing.
32. Q5: How does `params int[]` compile for `Sum(1, 2, 3)`?
33. A) Three separate int arguments
34. B) A stack-allocated span
35. C) An inlined constant
36. D) A heap-allocated int[]{1,2,3} (*)
37. Explanation: The compiler collects variadic args into a new int[] array (heap allocation); `params ReadOnlySpan<int>` (C# 13) avoids the allocation.
38. Q6: Which call is valid for `void M(int x, int y = 2, int z = 3)`?
39. A) M(1, z: 9) (*)
40. B) M(z: 9, 1)
41. C) M(, , 9)
42. D) M(1, y: , 9)
43. Explanation: Named arguments let you skip optional params but must come after positional args in C# 7.2+; `M(1, z: 9)` is valid (y uses default).
44. Q7: What does the compiler do if you forget to assign an `out` parameter on a return path?
45. A) Silently leaves it uninitialized
46. B) Compile-time error: "out parameter must be assigned" (*)
47. C) Initializes it to default
48. D) Throws at runtime
49. Explanation: The C# compiler performs definite-assignment analysis on out parameters and errors if any return path leaves them unassigned.
50. Q8: Which is the best overload when calling `M(5)` with candidates `M(int)` and `M(params int[])`?
51. A) M(params int[]) — variadic preferred
52. B) Ambiguous; compile error
53. C) M(int) — exact match preferred (*)
54. D) Both run in order
55. Explanation: Overload resolution prefers an exact-parameter match over a params array; M(int) wins.
56. Q9: What does `(string Name, int Age) Parse(string s)` allow at the call site?
57. A) Only `var t = Parse(s); t.Name`
58. B) Deconstruction: `var (n, a) = Parse(s)`
59. C) Returning multiple values without a class
60. D) Both B and C (*)
61. Explanation: Named-tuple returns enable deconstruction syntax (`var (n,a) = ...`) and are the idiomatic way to return multiple values without a custom type.
62. Q10: Which statement about `async void` is TRUE?
63. A) The caller cannot await it and unhandled exceptions crash the process (*)
64. B) It is the recommended pattern for fire-and-forget
65. C) Exceptions propagate to the caller
66. D) It is required for event handlers in ASP.NET Core
67. Explanation: `async void` is only valid for event handlers; the caller can't await, and exceptions thrown inside escape to the SynchronizationContext and crash the app.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which parameter kind requires the callee to assign before returning?
  options:
    - ref
    - in
    - params
    - out
  correctIndex: 3
  explanation: "`out` parameters must be definitely assigned by the callee on all return paths; the compiler enforces this so callers always read a valid value."
- id: q2
  question: Which parameter kind passes a large struct by read-only reference (no copy)?
  options:
    - in
    - ref
    - out
    - params
  correctIndex: 0
  explanation: "`in` is a read-only alias to the caller's variable; it avoids copying large structs and forbids the callee from mutating it."
- id: q3
  question: What is the versioning hazard with optional parameters?
  options:
    - They cannot be changed
    - Default values are baked into call sites at compile time
    - They are not supported in interfaces
    - They cause runtime errors when changed
  correctIndex: 1
  explanation: A default value becomes a literal in the caller's IL; changing it in a library does not affect already-compiled consumers until they recompile.
- id: q4
  question: A `static local function`…
  options:
    - Cannot be called from outside its parent
    - Cannot capture variables from the enclosing method
    - Both A and B
    - Is compiled as a top-level method
    - and additionally cannot capture enclosing locals (B), forcing explicit parameter passing.
  correctIndex: 2
  explanation: "`static` local functions are still scoped to the enclosing method (A) and additionally cannot capture enclosing locals (B), forcing explicit parameter passing."
- id: q5
  question: How does `params int[]` compile for `Sum(1, 2, 3)`?
  options:
    - Three separate int arguments
    - A stack-allocated span
    - An inlined constant
    - A heap-allocated int[]{1,2,3}
  correctIndex: 3
  explanation: The compiler collects variadic args into a new int[] array (heap allocation); `params ReadOnlySpan<int>` (C# 13) avoids the allocation.
- id: q6
  question: Which call is valid for `void M(int x, int y = 2, int z = 3)`?
  options:
    - "M(1, z: 9)"
    - "M(z: 9, 1)"
    - M(, , 9)
    - "M(1, y: , 9)"
  correctIndex: 0
  explanation: "Named arguments let you skip optional params but must come after positional args in C# 7.2+; `M(1, z: 9)` is valid (y uses default)."
- id: q7
  question: What does the compiler do if you forget to assign an `out` parameter on a return path?
  options:
    - Silently leaves it uninitialized
    - 'Compile-time error: "out parameter must be assigned"'
    - Initializes it to default
    - Throws at runtime
  correctIndex: 1
  explanation: The C# compiler performs definite-assignment analysis on out parameters and errors if any return path leaves them unassigned.
- id: q8
  question: Which is the best overload when calling `M(5)` with candidates `M(int)` and `M(params int[])`?
  options:
    - M(params int[]) — variadic preferred
    - Ambiguous; compile error
    - M(int) — exact match preferred
    - Both run in order
  correctIndex: 2
  explanation: Overload resolution prefers an exact-parameter match over a params array; M(int) wins.
- id: q9
  question: What does `(string Name, int Age) Parse(string s)` allow at the call site?
  options:
    - Only `var t = Parse(s); t.Name`
    - "Deconstruction: `var (n, a) = Parse(s)`"
    - Returning multiple values without a class
    - Both B and C
  correctIndex: 3
  explanation: Named-tuple returns enable deconstruction syntax (`var (n,a) = ...`) and are the idiomatic way to return multiple values without a custom type.
- id: q10
  question: Which statement about `async void` is TRUE?
  options:
    - The caller cannot await it and unhandled exceptions crash the process
    - It is the recommended pattern for fire-and-forget
    - Exceptions propagate to the caller
    - It is required for event handlers in ASP.NET Core
  correctIndex: 0
  explanation: "`async void` is only valid for event handlers; the caller can't await, and exceptions thrown inside escape to the SynchronizationContext and crash the app."
```

