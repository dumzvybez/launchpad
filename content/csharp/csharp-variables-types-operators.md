---
slug: csharp-variables-types-operators
id: csharp-02
track: csharp
order: 2
title: Variables, Types, and Operators
description: Declare variables across built-in types, master value vs reference semantics, learn arithmetic/logical/bitwise operators, and meet string interning and the `==` vs `.Equals` trap.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=1000s
whyItMatters: Declare variables across built-in types, master value vs reference semantics, learn arithmetic/logical/bitwise operators, and meet string interning and the `==` vs `. Equals` trap.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Declare variables across built-in types, master value vs reference semantics, learn arithmetic/logical/bitwise operators, and meet string interning and the `==` vs `. Equals` trap.

Declare variables across built-in types, master value vs reference semantics, learn arithmetic/logical/bitwise operators, and meet string interning and the `==` vs `.Equals` trap.

### Prerequisites

- Stage 1: Getting Started with C# and .NET.
- Comfort running `dotnet new console`, `dotnet run`.

### Topics

- Built-in types: int, long, double, float, decimal, char, bool, byte, nint
- Value types vs reference types (stack vs heap conceptual model)
- var, target-typed new (C# 9), and type inference
- Constants (const) vs readonly vs static readonly
- Arithmetic, relational, logical, bitwise, and compound assignment operators
- Null-coalescing ??, null-conditional ?., null-coalescing assignment ??=
- String literals: regular, verbatim (@"..."), interpolated ($"..."), raw (C# 11)
- Boxing/unboxing and the int `==` vs `Equals` behavior

### Key Concepts

- Value types (primitives, structs, enums) are copied by value; reference types (classes, arrays, strings, delegates) are copied by reference.
- `string` is a reference type but immutable and interned; `==` is overloaded to compare content, but `object.ReferenceEquals` reveals identity.
- `const` is compile-time literal (must be primitive/string, implicitly static); `readonly` is set once at runtime (field or constructor).
- Boxing wraps a value type in a heap object — silent perf killer in hot loops and non-generic collections.
- `decimal` is base-10 (28-29 digits, no binary float error) — use it for money; never use `double` for currency.

```csharp
struct Point { public int X, Y; }
class Box    { public int X, Y; }

var p1 = new Point { X = 1, Y = 2 };
var p2 = p1;        // COPY — value semantics
p2.X = 99;
Console.WriteLine(p1.X);  // 1 (unchanged)

var b1 = new Box { X = 1, Y = 2 };
var b2 = b1;        // REFERENCE — same object
b2.X = 99;
Console.WriteLine(b1.X);  // 99 (shared!)
```
Caption: Value vs reference semantics

### Common Pitfalls

- Using `==` to compare two boxed value types — `((object)1) == ((object)1)` is false because object.== is reference equality; use `.Equals` or unbox first.
- Using `double` for money — `0.1 + 0.2 != 0.3` in binary float; always use `decimal` for financial calculations.
- Mutating a struct returned by a property — `myList[i].X = 5;` fails to compile because the indexer returns a copy; capture into a local, mutate, then reassign.
- Treating `const` like `readonly` across assemblies — `const` values are baked into call sites at compile time; changing a const in library.dll requires recompiling all consumers or they'll use the stale value.
- Assuming `string` `==` does reference equality — `string.==` is overloaded to compare content (value semantics), which surprises developers coming from Java where `String ==` is identity.

### Real-World Applications

- Bloomberg's terminal clients use .NET with `decimal` arithmetic for all currency calculations to avoid float rounding in trade reporting.
- Unity game scripts use structs (Vector3, Quaternion) heavily for value semantics in hot transform loops — copying avoids aliasing bugs in physics.
- Microsoft Excel's calculation engine (in the .NET-based add-in layer) uses `decimal` and `double` carefully separated by data type to prevent float drift.
- Stack Overflow's tag engine caches millions of string keys and relies on string interning to keep memory bounded.

### Interview Questions

- 1. What is the difference between a value type and a reference type? — Value types are allocated inline and copied on assignment (structs, primitives, enums); reference types are heap-allocated and assigned by reference (classes, arrays, strings, delegates).
- 2. Why is `string` immutable and what is interning? — Immutability makes strings thread-safe and hash-stable; interning deduplicates string literals in a CLR-managed pool so identical literals share one object.
- 3. What is boxing and why is it expensive? — Boxing copies a value type into a heap-allocated object; it allocates, causes GC pressure, and defeats inlining in hot loops.
- 4. When should you use `decimal` vs `double`? — `decimal` for money and exact base-10 arithmetic (financial); `double` for scientific computing where range matters and tiny error is acceptable.
- 5. What is the difference between `const` and `readonly`? — `const` is a compile-time literal baked into call sites (cross-assembly versioning hazard); `readonly` is set once at runtime and reads at runtime from the field.

### Mini Project

Build a Money Calculator: A console app that reads two currency amounts as strings (e.g., "$19.99"), parses them with `decimal`, and reports the sum, difference, product by an integer quantity, and a 8.5% tax — all formatted as currency. Suggested approach:
  - Parse input with `decimal.Parse(s, NumberStyles.Currency)`
  - Store amounts in a `readonly struct Money { decimal Amount; string Currency; }`
  - Use `FormattableString` and `decimal.ToString("C")` for output
  - Demonstrate value-semantics by copying a Money and mutating the copy
  - Add a unit test (just a Main-method assert) that `0.1m + 0.2m == 0.3m` (passes) vs the double equivalent (fails)

### Exercises

1. Declare `int i = 5; object o = i;` and inspect `o.GetType()` and `RuntimeHelpers.GetHashCode(o)` to confirm boxing happened.
2. Write two `string` variables (one literal "abc", one `new string("abc".ToCharArray())`) and print `a == b`, `a.Equals(b)`, `ReferenceEquals(a,b)`.
3. Create a `readonly struct Vector2` with `X, Y` and a method `double Length()`; demonstrate that assigning to a field of a returned Vector2 fails to compile.
4. Compare `0.1 + 0.2 == 0.3` (double) with `0.1m + 0.2m == 0.3m` (decimal) and print both results.
5. Benchmark a hot loop summing 10M ints into an `ArrayList` (boxed) vs `List<int>` (generic) and report the time difference with `Stopwatch`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which type should you use for monetary calculations?
9. A) double
10. B) decimal (*)
11. C) float
12. D) int (cents)
13. Explanation: `decimal` is base-10 with 28-29 significant digits and avoids the binary-float rounding that makes 0.1+0.2 != 0.3; it is the correct type for money.
14. Q2: What is the output? `string a = "ab"; string b = "a" + "b"; Console.Write(a == b); Console.Write(ReferenceEquals(a, b));`
15. A) TrueFalse
16. B) FalseTrue
17. C) TrueTrue (*)
18. D) FalseFalse
19. Explanation: "a"+"b" is a compile-time constant, so it is interned to the same literal as "ab"; both `==` (value) and ReferenceEquals are True.
20. Q3: Boxing occurs when…
21. A) A reference type is assigned to another reference variable
22. B) A string is concatenated with an int
23. C) A const is read at runtime
24. D) A value type is assigned to object or an interface type (*)
25. Explanation: Boxing wraps a value type into a heap-allocated object; assigning int to object or to a non-generic interface triggers it.
26. Q4: Which keyword declares a value that is baked into call sites at compile time?
27. A) const (*)
28. B) readonly
29. C) static
30. D) sealed
31. Explanation: `const` values are compile-time literals embedded directly in IL of consumers; changing a const in a library requires recompiling all consumers.
32. Q5: What is the result of `((object)5).Equals((object)5)`?
33. A) Compile error
34. B) True (*)
35. C) False
36. D) Throws InvalidCastException
37. Explanation: `object.Equals` is virtual and Int32 overrides it to compare values; so boxed 5 Equals boxed 5 returns True (contrast with `==` which would be False).
38. Q6: Which operator returns the left operand if non-null, else the right?
39. A) ?.
40. B) ??=
41. C) ?? (*)
42. D) ?:
43. Explanation: `??` is the null-coalescing operator: `a ?? b` returns `a` if non-null, otherwise `b`.
44. Q7: Why does `myList[0].X = 5;` fail to compile when the list contains structs?
45. A) Indexers are read-only
46. B) Structs cannot have public fields
47. C) List<T> is immutable
48. D) The indexer returns a copy of the struct, and you cannot mutate a temporary (*)
49. Explanation: Value-type indexer returns a copy; mutating it would have no observable effect, so the compiler disallows the assignment.
50. Q8: Which of these is a value type?
51. A) int (*)
52. B) string
53. C) object
54. D) int[] (array)
55. Explanation: `int` is a primitive value type; strings, objects, and arrays are reference types (even though arrays of structs hold values inline).
56. Q9: What does the null-conditional operator `name?.Length` evaluate to when name is null?
57. A) 0
58. B) null (as int?) (*)
59. C) Throws NullReferenceException
60. D) -1
61. Explanation: `?.` short-circuits and returns `null` (typed as `int?` here) instead of throwing when the receiver is null.
62. Q10: Which string literal supports backslashes verbatim (no escaping)?
63. A) "C:\temp"
64. B) $"C:\temp"
65. C) @"C:\temp" (*)
66. D) $$"""C:\temp"""
67. Explanation: Verbatim strings (prefixed with @) treat backslashes literally and allow newlines inside; useful for file paths and regex.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which type should you use for monetary calculations?
  options:
    - double
    - decimal
    - float
    - int (cents)
  correctIndex: 1
  explanation: "`decimal` is base-10 with 28-29 significant digits and avoids the binary-float rounding that makes 0.1+0.2 != 0.3; it is the correct type for money."
- id: q2
  question: What is the output? `string a = "ab"; string b = "a" + "b"; Console.Write(a == b); Console.Write(ReferenceEquals(a, b));`
  options:
    - TrueFalse
    - FalseTrue
    - TrueTrue
    - FalseFalse
  correctIndex: 2
  explanation: '"a"+"b" is a compile-time constant, so it is interned to the same literal as "ab"; both `==` (value) and ReferenceEquals are True.'
- id: q3
  question: Boxing occurs when…
  options:
    - A reference type is assigned to another reference variable
    - A string is concatenated with an int
    - A const is read at runtime
    - A value type is assigned to object or an interface type
  correctIndex: 3
  explanation: Boxing wraps a value type into a heap-allocated object; assigning int to object or to a non-generic interface triggers it.
- id: q4
  question: Which keyword declares a value that is baked into call sites at compile time?
  options:
    - const
    - readonly
    - static
    - sealed
  correctIndex: 0
  explanation: "`const` values are compile-time literals embedded directly in IL of consumers; changing a const in a library requires recompiling all consumers."
- id: q5
  question: What is the result of `((object)5).Equals((object)5)`?
  options:
    - Compile error
    - "True"
    - "False"
    - Throws InvalidCastException
  correctIndex: 1
  explanation: "`object.Equals` is virtual and Int32 overrides it to compare values; so boxed 5 Equals boxed 5 returns True (contrast with `==` which would be False)."
- id: q6
  question: Which operator returns the left operand if non-null, else the right?
  options:
    - ?.
    - ??=
    - ??
    - "?:"
  correctIndex: 2
  explanation: "`??` is the null-coalescing operator: `a ?? b` returns `a` if non-null, otherwise `b`."
- id: q7
  question: Why does `myList[0].X = 5;` fail to compile when the list contains structs?
  options:
    - Indexers are read-only
    - Structs cannot have public fields
    - List<T> is immutable
    - The indexer returns a copy of the struct, and you cannot mutate a temporary
  correctIndex: 3
  explanation: Value-type indexer returns a copy; mutating it would have no observable effect, so the compiler disallows the assignment.
- id: q8
  question: Which of these is a value type?
  options:
    - int
    - string
    - object
    - int[] (array)
  correctIndex: 0
  explanation: "`int` is a primitive value type; strings, objects, and arrays are reference types (even though arrays of structs hold values inline)."
- id: q9
  question: What does the null-conditional operator `name?.Length` evaluate to when name is null?
  options:
    - "0"
    - null (as int?)
    - Throws NullReferenceException
    - "-1"
  correctIndex: 1
  explanation: "`?.` short-circuits and returns `null` (typed as `int?` here) instead of throwing when the receiver is null."
- id: q10
  question: Which string literal supports backslashes verbatim (no escaping)?
  options:
    - '"C:\temp"'
    - $"C:\temp"
    - '@"C:\temp"'
    - $$"""C:\temp"""
  correctIndex: 2
  explanation: Verbatim strings (prefixed with @) treat backslashes literally and allow newlines inside; useful for file paths and regex.
```

