---
slug: csharp-exception-handling-custom-exceptions
id: csharp-12
track: csharp
order: 12
title: Exception Handling and Custom Exceptions
description: Use try/catch/finally correctly, author custom exception hierarchies, apply exception filters (when), and aggregate exceptions from parallel and async work.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=11000s
whyItMatters: Use try/catch/finally correctly, author custom exception hierarchies, apply exception filters (when), and aggregate exceptions from parallel and async work.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Exception Handling and Custom Exceptions

## Exception Handling and Custom Exceptions

### Why It Matters

Use try/catch/finally correctly, author custom exception hierarchies, apply exception filters (when), and aggregate exceptions from parallel and async work.

Use try/catch/finally correctly, author custom exception hierarchies, apply exception filters (when), and aggregate exceptions from parallel and async work.

### Prerequisites

- Stage 11: async/await and the TPL.
- Stage 4: Methods, Parameters, and Out/Ref.

### Topics

- try / catch / finally / when (exception filters, C# 6)
- Exception hierarchy: Exception, SystemException, ApplicationException (deprecated)
- Custom exceptions: serializable, multiple constructors, [Exception] best practices
- Inner exceptions and `throw;` vs `throw ex;` (stack trace preservation)
- AggregateException and Flatten/Handle
- Exception dispatch info (capture across thread boundaries)
- Global handlers: AppDomain.UnhandledException, TaskScheduler.UnobservedTaskException
- Performance: exceptions for exceptional cases, not control flow

### Key Concepts

- `throw;` preserves the original stack trace; `throw ex;` resets it — always use `throw;` (bare rethrow) inside a catch to preserve diagnostic information.
- Exception filters (`catch (Ex e) when (...)`) let you inspect without catching — if the filter returns false, the exception continues propagating (and other catch blocks or finally blocks see the original).
- Custom exceptions should inherit `Exception`, be `[Serializable]` (for cross-AppDomain/old scenarios), and provide the standard four constructors (default, message, message+inner, serialization).
- `AggregateException` wraps multiple exceptions from parallel/async work; use `.Flatten()` to unwrap nested aggregates and `.Handle(ex => bool)` to process each.
- Exceptions are expensive (stack walk + allocation) — use them for genuinely exceptional cases; for expected failures (parsing, lookups), prefer `Try*` patterns or Result<T>.

```csharp
try { DoWork(); }
catch (Exception ex)
{
    Log(ex);
    throw;        // PRESERVES original stack trace
    // throw ex;  // RESETS stack trace to this line — bad
}
```
Caption: throw; vs throw ex;

### Common Pitfalls

- `throw ex;` instead of `throw;` — resets the stack trace so you can't see where the exception originated; use bare `throw;` to preserve.
- Catching `Exception` and swallowing — `catch (Exception) { }` hides bugs; at minimum log, or filter to specific types.
- Using exceptions for control flow (e.g., `int.Parse` in a loop) — parsing failures are expected; use `int.TryParse` (no throw) for hot paths.
- Not unwrapping `AggregateException` — `await Task.WhenAll` rethrows only the first exception; iterate `.Task.Exception.InnerExceptions` or use `Task.Wait`/`AggregateException.Flatten()` to see all.
- Throwing from a `finally` block — masks the original exception (the finally's exception wins); avoid throwing in finally unless you wrap and chain via `ExceptionDispatchInfo`.

### Real-World Applications

- ASP.NET Core's middleware pipeline catches exceptions and converts them to ProblemDetails responses via exception-handling middleware (`app.UseExceptionHandler`).
- EF Core throws `DbUpdateException` with `Entries` for each failed entity — controllers catch and translate to 409 Conflict responses.
- Stack Overflow's exception filter logs 4xx-but-not-5xx HTTP exceptions without polluting crash telemetry (using `when` to discriminate).
- Microsoft's Azure SDK uses `RequestFailedException` with status code and reason, allowing retry policies to inspect via exception filters.

### Interview Questions

- 1. What is the difference between `throw;` and `throw ex;`? — `throw;` rethrows preserving the original stack trace; `throw ex;` resets the stack trace to the current line, losing where the exception actually originated.
- 2. What are exception filters and why use them? — `catch (E e) when (cond)` lets you inspect without catching (false = propagate); useful for logging-then-propagate and for matching on properties without consuming the exception.
- 3. When should you write a custom exception? — When callers will catch it specifically (domain errors like `OrderValidationException`); inherit `Exception`, be `[Serializable]`, and provide the four standard constructors.
- 4. How does `AggregateException` work with `await Task.WhenAll`? — `await` rethrows only the first inner exception; to see all, catch `AggregateException` from `Task.Wait`/`.Exception` or use `Task.WhenAll(tasks).ContinueWith(t => ...)` and inspect `.Exception.InnerExceptions`.
- 5. Why are exceptions expensive and when should you avoid them? — Each throw does a stack walk and allocates; for expected control-flow (parse failures, lookups), use `Try*` patterns or `Result<T, E>` instead of throwing.

### Mini Project

Build a Resilient HTTP Client Wrapper: A `ResilientClient` that retries on transient errors (5xx, 429) with exponential backoff, uses exception filters to log without catching, and unwraps `AggregateException` from concurrent batches. Suggested approach:
  - Define `TransientHttpException : Exception` with `StatusCode` and `Attempts`
  - Loop with retry: `catch (HttpRequestException ex) when (IsTransient(ex.StatusCode)) { await Delay; retry; }`
  - Add a logging filter: `when (Log(ex))` that returns false to propagate
  - For batch fetches, catch `AggregateException`, call `.Flatten().Handle(...)` to mark transient ones handled
  - Re-throw as `AggregateException` with all failures after max retries

### Exercises

1. Write a method that catches and rethrows with `throw;`; inspect the stack trace vs the same code with `throw ex;`.
2. Use an exception filter `when (DateTime.Now.Hour < 9)` to only handle errors during business hours; verify propagation outside those hours.
3. Define a `[Serializable]` custom exception with the four standard constructors and serialize it via `BinaryFormatter` (or note its deprecation).
4. Throw from three concurrent tasks, `await Task.WhenAll`, and inspect the first exception; then use `.Exception.InnerExceptions` to see all three.
5. Benchmark `int.Parse` (throws on bad input) vs `int.TryParse` over 100k bad inputs and report the time difference.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which preserves the original stack trace when rethrowing?
9. A) throw ex;
10. B) throw new Exception(ex);
11. C) return;
12. D) throw; (*)
13. Explanation: Bare `throw;` rethrows the current exception preserving its original stack trace; `throw ex;` resets the trace to the current line, losing the origin.
14. Q2: Exception filters (`catch (E e) when (cond)`)…
15. A) Only catch if the filter returns true; false propagates the exception (*)
16. B) Always catch if the type matches
17. C) Cannot access the exception object
18. D) Run in finally
19. Explanation: The `when` filter is evaluated when the type matches; if it returns false, the catch is skipped and the exception continues propagating — useful for inspect-then-propagate and matching on properties.
20. Q3: Custom exceptions should generally inherit from…
21. A) SystemException
22. B) Exception (*)
23. C) ApplicationException (deprecated)
24. D) InvalidOperationException
25. Explanation: Inherit `Exception` directly; `ApplicationException` was deprecated early because nothing meaningful was added; `SystemException` is for runtime-internal types.
26. Q4: `await Task.WhenAll(tasks)` rethrows…
27. A) All exceptions as AggregateException
28. B) No exceptions
29. C) Only the first exception (unwrapped from AggregateException) (*)
30. D) The last exception only
31. Explanation: `await Task.WhenAll` rethrows only the first inner exception (unwrapped); to see all, access `.Exception.InnerExceptions` or use `Task.Wait`/`ContinueWith` to get the full AggregateException.
32. Q5: Using exceptions for expected control flow (e.g., int.Parse on bad input)…
33. A) Is the recommended pattern
34. B) Is required by the BCL
35. C) Has no performance cost
36. D) Is expensive (stack walk + allocation); use TryParse instead (*)
37. Explanation: Each throw does a stack walk and allocates; for expected failures like parsing, `int.TryParse` (no throw) is dramatically faster and clearer in intent.
38. Q6: `AggregateException.Flatten()`…
39. A) Unwraps nested AggregateExceptions into a single flat list (*)
40. B) Removes all inner exceptions
41. C) Cancels the operation
42. D) Re-throws the first exception
43. Explanation: `Flatten()` recursively unwraps nested AggregateExceptions (e.g., from layered Task.WhenAll) into a single AggregateException with all leaf exceptions in `.InnerExceptions`.
44. Q7: Catching `Exception` and swallowing (`catch (Exception) { }`)…
45. A) Is best practice
46. B) Hides bugs; at minimum log or filter to specific types (*)
47. C) Is required for async methods
48. D) Improves performance
49. Explanation: Swallowing all exceptions masks bugs and makes debugging impossible; if you must catch broadly, log and rethrow (`throw;`) or filter to specific types you can handle.
50. Q8: Throwing from a `finally` block…
51. A) Is safe and recommended
52. B) Cancels the original exception
53. C) Masks the original exception (the finally's exception wins) (*)
54. D) Is ignored by the runtime
55. Explanation: If a finally block throws, the new exception replaces the original (which is lost); avoid throwing in finally unless you capture with `ExceptionDispatchInfo` and re-chain.
56. Q9: `AggregateException.Handle(predicate)`…
57. A) Re-throws the aggregate
58. B) Logs the exceptions
59. C) Returns a bool
60. D) Runs the predicate on each inner exception; if all return true, marks as handled; otherwise rethrows unhandled (*)
61. Explanation: `Handle(predicate)` calls the predicate on each inner exception; if every predicate returns true, the exceptions are considered handled. If any returns false, a new AggregateException with the unhandled ones is thrown.
62. Q10: The four standard constructors for a custom exception are…
63. A) Default, message, message+inner, serialization (*)
64. B) Default, message, code, stack trace
65. C) Default, message, factory, logger
66. D) Only the default constructor
67. Explanation: The convention is: parameterless, `(string message)`, `(string message, Exception inner)`, and `(SerializationInfo, StreamingContext)` for cross-AppDomain/serialization scenarios.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which preserves the original stack trace when rethrowing?
  options:
    - throw ex;
    - throw new Exception(ex);
    - return;
    - throw;
  correctIndex: 3
  explanation: Bare `throw;` rethrows the current exception preserving its original stack trace; `throw ex;` resets the trace to the current line, losing the origin.
- id: q2
  question: Exception filters (`catch (E e) when (cond)`)…
  options:
    - Only catch if the filter returns true; false propagates the exception
    - Always catch if the type matches
    - Cannot access the exception object
    - Run in finally
  correctIndex: 0
  explanation: The `when` filter is evaluated when the type matches; if it returns false, the catch is skipped and the exception continues propagating — useful for inspect-then-propagate and matching on properties.
- id: q3
  question: Custom exceptions should generally inherit from…
  options:
    - SystemException
    - Exception
    - ApplicationException (deprecated)
    - InvalidOperationException
  correctIndex: 1
  explanation: Inherit `Exception` directly; `ApplicationException` was deprecated early because nothing meaningful was added; `SystemException` is for runtime-internal types.
- id: q4
  question: "`await Task.WhenAll(tasks)` rethrows…"
  options:
    - All exceptions as AggregateException
    - No exceptions
    - Only the first exception (unwrapped from AggregateException)
    - The last exception only
  correctIndex: 2
  explanation: "`await Task.WhenAll` rethrows only the first inner exception (unwrapped); to see all, access `.Exception.InnerExceptions` or use `Task.Wait`/`ContinueWith` to get the full AggregateException."
- id: q5
  question: Using exceptions for expected control flow (e.g., int.Parse on bad input)…
  options:
    - Is the recommended pattern
    - Is required by the BCL
    - Has no performance cost
    - Is expensive (stack walk + allocation); use TryParse instead
  correctIndex: 3
  explanation: Each throw does a stack walk and allocates; for expected failures like parsing, `int.TryParse` (no throw) is dramatically faster and clearer in intent.
- id: q6
  question: "`AggregateException.Flatten()`…"
  options:
    - Unwraps nested AggregateExceptions into a single flat list
    - Removes all inner exceptions
    - Cancels the operation
    - Re-throws the first exception
  correctIndex: 0
  explanation: "`Flatten()` recursively unwraps nested AggregateExceptions (e.g., from layered Task.WhenAll) into a single AggregateException with all leaf exceptions in `.InnerExceptions`."
- id: q7
  question: Catching `Exception` and swallowing (`catch (Exception) { }`)…
  options:
    - Is best practice
    - Hides bugs; at minimum log or filter to specific types
    - Is required for async methods
    - Improves performance
  correctIndex: 1
  explanation: Swallowing all exceptions masks bugs and makes debugging impossible; if you must catch broadly, log and rethrow (`throw;`) or filter to specific types you can handle.
- id: q8
  question: Throwing from a `finally` block…
  options:
    - Is safe and recommended
    - Cancels the original exception
    - Masks the original exception (the finally's exception wins)
    - Is ignored by the runtime
  correctIndex: 2
  explanation: If a finally block throws, the new exception replaces the original (which is lost); avoid throwing in finally unless you capture with `ExceptionDispatchInfo` and re-chain.
- id: q9
  question: "`AggregateException.Handle(predicate)`…"
  options:
    - Re-throws the aggregate
    - Logs the exceptions
    - Returns a bool
    - Runs the predicate on each inner exception; if all return true, marks as handled; otherwise rethrows unhandled
  correctIndex: 3
  explanation: "`Handle(predicate)` calls the predicate on each inner exception; if every predicate returns true, the exceptions are considered handled. If any returns false, a new AggregateException with the unhandled ones is thrown."
- id: q10
  question: The four standard constructors for a custom exception are…
  options:
    - Default, message, message+inner, serialization
    - Default, message, code, stack trace
    - Default, message, factory, logger
    - Only the default constructor
  correctIndex: 0
  explanation: "The convention is: parameterless, `(string message)`, `(string message, Exception inner)`, and `(SerializationInfo, StreamingContext)` for cross-AppDomain/serialization scenarios."
```

