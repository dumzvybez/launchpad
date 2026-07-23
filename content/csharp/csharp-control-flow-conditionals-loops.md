---
slug: csharp-control-flow-conditionals-loops
id: csharp-03
track: csharp
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/else, switch statements and expressions, pattern matching, and all loop constructs (for, foreach, while, do-while), with break/continue and the iterator-vs-iterable distinction.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=2000s
whyItMatters: Master if/else, switch statements and expressions, pattern matching, and all loop constructs (for, foreach, while, do-while), with break/continue and the iterator-vs-iterable distinction.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/else, switch statements and expressions, pattern matching, and all loop constructs (for, foreach, while, do-while), with break/continue and the iterator-vs-iterable distinction.

Master if/else, switch statements and expressions, pattern matching, and all loop constructs (for, foreach, while, do-while), with break/continue and the iterator-vs-iterable distinction.

### Prerequisites

- Stage 1: Getting Started with C# and .NET.
- Stage 2: Variables, Types, and Operators.

### Topics

- if / else if / else and the dangling-else rule
- switch statements (classic constant patterns)
- switch expressions (C# 8) and pattern matching (type, property, positional)
- Relational and logical patterns (C# 9): `> 0 and < 100`, `not null`
- for, foreach, while, do-while loops
- break, continue, return, and labeled jumps (C# has no goto for loops but goto exists)
- Iterator blocks (yield return) and deferred enumeration
- Exhaustiveness with `when` guards and discard `_`

### Key Concepts

- C# `switch` differs from C/Java: no implicit fall-through (each case must end with break/return/goto/throw), and `switch` on strings is supported.
- Pattern matching unifies type tests, destructuring, and conditions in one expression — switch expressions return values.
- `foreach` requires `IEnumerable` (or the duck-typed GetEnumerator pattern); it does NOT dispose enumerators unless the enumerable implements IDisposable.
- `yield return` produces a state-machine iterator that is lazy — code does not run until you start enumerating.
- Exhaustiveness: with switch expressions on enums, the compiler warns if a case is missing; add a `_ =>` discard default.

```csharp
static string Classify(int n) => n switch
{
    < 0           => "negative",
    0             => "zero",
    > 0 and < 10  => "small",
    > 10 and < 100 => "medium",
    _             => "large",
};

static decimal Discount(object o) => o switch
{
    Customer { IsPremium: true, Years: var y } => 0.20m + y * 0.01m,
    Customer c                                  => 0.05m,
    null                                        => throw new ArgumentNullException(),
    _                                           => 0m,
};
```
Caption: Switch expression with patterns

### Common Pitfalls

- Forgetting `break` in a switch statement — C# disallows implicit fall-through, so the compiler error is friendly, but `goto case` is easy to misuse; switch expressions avoid this entirely.
- Modifying a collection while foreach-ing over it — `foreach (var x in list) list.Remove(x);` throws `InvalidOperationException`; collect keys to remove first, or iterate by index backwards.
- Treating `yield return` as eager — calling `var seq = Fibs(10);` runs zero code; only the first `foreach`/`.ToList()` materializes the sequence, which surprises users who put logging inside iterators.
- Multiple enumeration of an `IEnumerable<T>` returned by a yield method — each foreach re-runs the iterator (and any side effects); cache with `.ToList()` if you need stable data.
- Switch on enum without default — adding a new enum member later silently falls through to no case; enable `AnalysisLevel` and treat CS8509 (non-exhaustive switch) as an error.

### Real-World Applications

- Roslyn (the C# compiler) uses pattern matching switch expressions extensively in the binder and lowering passes to dispatch AST nodes.
- ASP.NET Core's endpoint routing uses switch-like dispatch on HTTP method + path template, with the route pattern compiled to a fast matcher.
- Unity's input system classifies input devices via type-pattern matching in switch expressions to dispatch events to handlers.
- Microsoft's ML.NET pipeline builder uses `yield return` to lazily stream training examples from disk without loading the entire dataset into memory.

### Interview Questions

- 1. Why doesn't C# allow implicit switch fall-through? — To eliminate the classic C bug where a forgotten break executes the next case's code unintentionally; use `goto case` if you really want chaining.
- 2. What is the difference between a switch statement and a switch expression? — A statement performs actions; an expression returns a value and must be exhaustive (or have a `_` discard default).
- 3. How does `yield return` work under the hood? — The compiler generates a hidden state-machine class implementing IEnumerator; each yield becomes a state transition, so the method's local variables become fields.
- 4. Does `foreach` call `Dispose` on the enumerator? — Yes if the enumerator implements IDisposable (which C# iterators do); this is why `foreach` over a `yield` method with a `using` inside works correctly.
- 5. What is the C# equivalent of labeled break? — There is none; you use a flag, `goto`, or refactor to extract the inner loop into a method that returns early.

### Mini Project

Build a Number Guessing Game: The app picks a random 1-100, gives the user up to 7 guesses, and after each guess prints "higher", "lower", or "correct" using a switch expression. Track guess history in a `List<int>` and print it at the end. Suggested approach:
  - Use `Random.Shared.Next(1, 101)` to pick the target
  - Loop with `for` over 7 attempts, reading input with `int.TryParse`
  - Classify the guess with `guess switch { var g when g < target => "higher", ... }`
  - Store guesses in a `List<int>` and `string.Join` them at the end
  - Handle non-numeric input by re-prompting without consuming a guess

### Exercises

1. Write a method using a switch expression that maps an HTTP status code to a category string ("success", "redirect", "client error", "server error").
2. Implement a `FizzBuzz` using a switch expression with relational and `and` patterns (no if statements allowed).
3. Write an iterator `static IEnumerable<int> Evens(int max)` using `yield return` and consume it twice — observe the side effects of double enumeration.
4. Modify a `List<int>` while iterating with foreach to confirm the `InvalidOperationException`, then fix it by iterating backwards by index.
5. Write a nested loop with `goto` to break out of both loops when a condition holds, then refactor it to a bool flag and compare readability.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Does C# allow implicit switch fall-through (like C)?
9. A) Yes, always
10. B) Only for empty cases
11. C) No — each case must end with break/return/goto/throw (*)
12. D) Only in switch expressions
13. Explanation: C# disallows implicit fall-through; each case must explicitly end with a transfer statement, eliminating the classic forgotten-break bug.
14. Q2: Which C# version introduced switch expressions?
15. A) C# 6
16. B) C# 7
17. C) C# 9
18. D) C# 8 (*)
19. Explanation: Switch expressions shipped in C# 8 (2019) with .NET Core 3; they return values and use the `=>` arm syntax.
20. Q3: What does `names[^1]` return?
21. A) The last element (*)
22. B) The first element
23. C) A single-element array
24. D) Throws IndexOutOfRange
25. Explanation: The `^N` index counts from the end; `^1` is the last element, `^0` is one-past-the-end (invalid).
26. Q4: What happens when you `foreach` over a `yield return` method?
27. A) The entire method runs once and caches
28. B) The method runs lazily, resuming at each yield (*)
29. C) The method runs eagerly on first call
30. D) The method throws InvalidOperationException
31. Explanation: `yield return` compiles to a state machine; each MoveNext resumes execution until the next yield, so enumeration is lazy.
32. Q5: Which best describes `not null and > 0` as a pattern?
33. A) Invalid syntax
34. B) A type pattern
35. C) A relational pattern combined with a logical pattern (*)
36. D) A positional pattern
37. Explanation: C# 9 added relational (`> 0`) and logical (`and`, `or`, `not`) patterns; combining them produces a single pattern.
38. Q6: What error does `foreach (var x in list) list.Remove(x);` produce?
39. A) NullReferenceException
40. B) IndexOutOfRangeException
41. C) No error; removes all elements
42. D) InvalidOperationException (collection modified) (*)
43. Explanation: foreach uses an enumerator that tracks version; modifying the collection bumps the version and throws on the next MoveNext.
44. Q7: A switch expression that does not handle all enum cases…
45. A) Produces warning CS8509 (and an error if treated as such) (*)
46. B) Compiles silently and returns default(T) for missing cases
47. C) Throws at runtime
48. D) Is impossible to write
49. Explanation: The compiler warns CS8509 for non-exhaustive switch expressions; enabling `<AnalysisLevel>latest-all</AnalysisLevel>` escalates it.
50. Q8: Which loop guarantees at least one iteration before testing the condition?
51. A) for
52. B) do-while (*)
53. C) while
54. D) foreach
55. Explanation: `do { ... } while (cond);` tests the condition after the body, guaranteeing at least one execution even if cond is initially false.
56. Q9: Does `foreach` dispose the enumerator?
57. A) Never
58. B) Only when wrapped in a using
59. C) Yes, if the enumerator implements IDisposable (*)
60. D) Only for arrays
61. Explanation: foreach expands to a try/finally that calls Dispose on the enumerator if it implements IDisposable; C# iterators do, so cleanup runs.
62. Q10: What is the recommended fix for "multiple enumeration of IEnumerable" warnings?
63. A) Use a for loop instead
64. B) Add .AsEnumerable()
65. C) Wrap in a Parallel.ForEach
66. D) Materialize once with .ToList() and reuse the list (*)
67. Explanation: An IEnumerable from a yield method re-runs on each enumeration; calling .ToList() once caches the materialized sequence and removes the warning.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Does C# allow implicit switch fall-through (like C)?
  options:
    - "?"
    - Yes, always
    - Only for empty cases
    - No — each case must end with break/return/goto/throw
    - Only in switch expressions
  correctIndex: 3
  explanation: C# disallows implicit fall-through; each case must explicitly end with a transfer statement, eliminating the classic forgotten-break bug.
- id: q2
  question: Which C# version introduced switch expressions?
  options:
    - C# 6
    - C# 7
    - C# 9
    - C# 8
  correctIndex: 3
  explanation: Switch expressions shipped in C# 8 (2019) with .NET Core 3; they return values and use the `=>` arm syntax.
- id: q3
  question: What does `names[^1]` return?
  options:
    - The last element
    - The first element
    - A single-element array
    - Throws IndexOutOfRange
  correctIndex: 0
  explanation: The `^N` index counts from the end; `^1` is the last element, `^0` is one-past-the-end (invalid).
- id: q4
  question: What happens when you `foreach` over a `yield return` method?
  options:
    - The entire method runs once and caches
    - The method runs lazily, resuming at each yield
    - The method runs eagerly on first call
    - The method throws InvalidOperationException
  correctIndex: 1
  explanation: "`yield return` compiles to a state machine; each MoveNext resumes execution until the next yield, so enumeration is lazy."
- id: q5
  question: Which best describes `not null and > 0` as a pattern?
  options:
    - Invalid syntax
    - A type pattern
    - A relational pattern combined with a logical pattern
    - A positional pattern
  correctIndex: 2
  explanation: C# 9 added relational (`> 0`) and logical (`and`, `or`, `not`) patterns; combining them produces a single pattern.
- id: q6
  question: What error does `foreach (var x in list) list.Remove(x);` produce?
  options:
    - NullReferenceException
    - IndexOutOfRangeException
    - No error; removes all elements
    - InvalidOperationException (collection modified)
  correctIndex: 3
  explanation: foreach uses an enumerator that tracks version; modifying the collection bumps the version and throws on the next MoveNext.
- id: q7
  question: A switch expression that does not handle all enum cases…
  options:
    - Produces warning CS8509 (and an error if treated as such)
    - Compiles silently and returns default(T) for missing cases
    - Throws at runtime
    - Is impossible to write
  correctIndex: 0
  explanation: The compiler warns CS8509 for non-exhaustive switch expressions; enabling `<AnalysisLevel>latest-all</AnalysisLevel>` escalates it.
- id: q8
  question: Which loop guarantees at least one iteration before testing the condition?
  options:
    - for
    - do-while
    - while
    - foreach
  correctIndex: 1
  explanation: "`do { ... } while (cond);` tests the condition after the body, guaranteeing at least one execution even if cond is initially false."
- id: q9
  question: Does `foreach` dispose the enumerator?
  options:
    - Never
    - Only when wrapped in a using
    - Yes, if the enumerator implements IDisposable
    - Only for arrays
  correctIndex: 2
  explanation: foreach expands to a try/finally that calls Dispose on the enumerator if it implements IDisposable; C# iterators do, so cleanup runs.
- id: q10
  question: What is the recommended fix for "multiple enumeration of IEnumerable" warnings?
  options:
    - Use a for loop instead
    - Add .AsEnumerable()
    - Wrap in a Parallel.ForEach
    - Materialize once with .ToList() and reuse the list
  correctIndex: 3
  explanation: An IEnumerable from a yield method re-runs on each enumeration; calling .ToList() once caches the materialized sequence and removes the warning.
```

