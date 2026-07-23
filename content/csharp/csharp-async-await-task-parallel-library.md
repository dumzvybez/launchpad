---
slug: csharp-async-await-task-parallel-library
id: csharp-11
track: csharp
order: 11
title: async/await and the Task Parallel Library
description: Author async methods with await, understand the Task model and the thread pool, use CancellationToken and ConfigureAwait, and avoid the classic `.Result` deadlock and `async void` disasters.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=10000s
whyItMatters: Author async methods with await, understand the Task model and the thread pool, use CancellationToken and ConfigureAwait, and avoid the classic `. Result` deadlock and `async void` disasters.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# async/await and the Task Parallel Library

## async/await and the Task Parallel Library

### Why It Matters

Author async methods with await, understand the Task model and the thread pool, use CancellationToken and ConfigureAwait, and avoid the classic `. Result` deadlock and `async void` disasters.

Author async methods with await, understand the Task model and the thread pool, use CancellationToken and ConfigureAwait, and avoid the classic `.Result` deadlock and `async void` disasters.

### Prerequisites

- Stage 9: Delegates, Events, and Lambdas.
- Stage 8: Collections.

### Topics

- Task, Task<T>, ValueTask, ValueTask<T>
- async/await and the state-machine compilation
- Returning async methods: Task, Task<T>, ValueTask, void (only events)
- CancellationToken and CancellationTokenSource
- ConfigureAwait(false) and the SynchronizationContext
- Task.Run, Task.WhenAll, Task.WhenAny
- IAsyncEnumerable<T> (async streams, C# 8)
- Parallel.For / Parallel.ForEachAsync (.NET 6+)

### Key Concepts

- `async`/`await` is compiler magic: the method is rewritten as a state machine that suspends on await and resumes via a continuation; the thread is freed during the await.
- The return type matters: `Task` (no value, awaitable), `Task<T>` (value), `ValueTask<T>` (value-type Task for hot paths to avoid allocation), `async void` (only for event handlers — exceptions crash).
- `ConfigureAwait(true)` (default) captures the SynchronizationContext and resumes on it (UI thread, ASP.NET classic); `ConfigureAwait(false)` does not, avoiding deadlocks in library code.
- `.Result` / `.Wait()` / `.GetAwaiter().GetResult()` block the calling thread — in UI/ASP.NET-classic contexts with a SynchronizationContext, this deadlocks because the continuation can never run on the blocked thread.
- `CancellationToken` is cooperative — pass it down to all async calls; the caller cancels via `CancellationTokenSource.Cancel()`; check `ThrowIfCancellationRequested()` in CPU-bound loops.

```csharp
public async Task<string> FetchAsync(string url, CancellationToken ct)
{
    using var http = new HttpClient();
    var resp = await http.GetAsync(url, ct).ConfigureAwait(false);
    resp.EnsureSuccessStatusCode();
    return await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
}

var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
string body = await FetchAsync("https://example.com", cts.Token);
```
Caption: Basic async/await

### Common Pitfalls

- `.Result` / `.Wait()` in UI or ASP.NET-classic code — the SynchronizationContext is captured, the continuation queues back to it, but the thread is blocked waiting for the result = deadlock; use `await` or `ConfigureAwait(false)` in libraries.
- `async void` outside event handlers — exceptions propagate to the SynchronizationContext (crashing the app), the caller cannot await, and unhandled exceptions are lost; use `async Task` always.
- Forgetting to pass `CancellationToken` to inner async calls — the token is checked at the top level but a long-running inner HTTP call keeps going; thread it through every async call.
- Awaiting a `ValueTask` twice — `ValueTask` may be backed by a pooled object that is single-consumption; await once and convert to `Task` if you need multiple awaits.
- Mixing `async`/`await` with `Task.Run` for IO-bound work — `Task.Run` for IO just wastes a thread-pool thread; await the IO call directly. Use `Task.Run` only for CPU-bound work.

### Real-World Applications

- ASP.NET Core's entire request pipeline is async — handlers return `Task<IActionResult>`, freeing the thread pool during IO; Stack Overflow serves thousands of requests/sec on a small pool because of this.
- EF Core's `ToListAsync`, `FirstOrDefaultAsync` are async, streaming results from Postgres/SQL Server without blocking.
- Microsoft's Kestrel web server uses async I/O via `System.IO.Pipelines` and `SocketAsyncEventArgs` to handle tens of thousands of concurrent sockets per worker.
- gRPC for .NET uses async streams (`IAsyncStreamReader<T>`) for bidirectional streaming RPCs between microservices.

### Interview Questions

- 1. How does `async`/`await` compile? — The compiler generates a state machine struct that captures locals; each `await` is a state transition; on completion the continuation resumes the method.
- 2. What is the difference between `Task` and `ValueTask`? — `Task` is a reference type (always allocates); `ValueTask` is a struct that can wrap a synchronous result or a `Task`, avoiding allocation on hot paths where the result is often already available.
- 3. Why does `.Result` deadlock in ASP.NET-classic but not ASP.NET Core? — ASP.NET-classic has a SynchronizationContext that the continuation needs; the blocked thread can't run it. ASP.NET Core has no SynchronizationContext, so the continuation runs on the thread pool — but blocking is still bad for throughput.
- 4. What is `ConfigureAwait(false)` for? — Tells the awaiter NOT to capture/post to the SynchronizationContext; library code should use it to avoid deadlocks and reduce context-switching cost.
- 5. How is cancellation propagated in async code? — Via `CancellationToken` threaded through every async call; the caller cancels via `CancellationTokenSource.Cancel()`; cooperative checks happen inside IO calls (HttpClient) and via `ThrowIfCancellationRequested()` in CPU loops.

### Mini Project

Build a Concurrent Web Crawler: Fetch multiple URLs concurrently with a max degree of parallelism, stream each response length as it completes via `IAsyncEnumerable<int>`, and cancel cleanly on Ctrl+C. Suggested approach:
  - Use `Parallel.ForEachAsync` with `MaxDegreeOfParallelism = 8`
  - Pass a `CancellationTokenSource` wired to `Console.CancelKeyPress`
  - Use `HttpClient` (single shared instance, not per-call)
  - Wrap each fetch in try/catch so one failure doesn't kill the batch
  - Stream progress with `IAsyncEnumerable<string>` and `await foreach`

### Exercises

1. Write `async Task<int> SumAsync(IEnumerable<int> xs)` using `Task.Run` for a CPU-bound sum; call it and await the result.
2. Reproduce a `.Result` deadlock in a WPF/WinForms test app with a SynchronizationContext, then fix it with `await` or `ConfigureAwait(false)`.
3. Convert a `Task<T>`-returning method to `ValueTask<T>` and benchmark the allocation difference for the synchronous-fast-path case.
4. Implement an `IAsyncEnumerable<int>` that yields a number every 100ms with cancellation; consume with `await foreach` and `WithCancellation`.
5. Use `Task.WhenAll` to fetch 10 URLs concurrently and time it against sequential awaits; report the speedup.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `async void` methods…
9. A) Are the recommended way to write async code
10. B) Should only be used for event handlers; exceptions crash the process
11. C) Both B and C (*)
12. D) Cannot be awaited at all
13. Explanation: async void is only valid for event handlers; the caller cannot await it, and unhandled exceptions propagate to the SynchronizationContext and crash the app.
14. Q2: `.Result` on an async method in a UI/ASP.NET-classic context…
15. A) Returns the result immediately
16. B) Throws immediately
17. C) Cancels the operation
18. D) Can deadlock because the continuation needs the blocked SynchronizationContext (*)
19. Explanation: The continuation is posted back to the captured SynchronizationContext, but that thread is blocked waiting for the result — classic deadlock. Use `await` or `ConfigureAwait(false)` in libraries.
20. Q3: `ConfigureAwait(false)` is recommended in library code because…
21. A) It improves perf by avoiding context capture and post-back (*)
22. B) It is required for correctness
23. C) It disables cancellation
24. D) It makes the method synchronous
25. Explanation: `ConfigureAwait(false)` skips capturing the SynchronizationContext, avoiding the post-back to the UI/ASP.NET thread; this reduces overhead and prevents deadlocks in libraries.
26. Q4: Which is the correct way to propagate cancellation through async calls?
27. A) Use a global static bool
28. B) Thread a CancellationToken through every async method (*)
29. C) Throw OperationCanceledException manually
30. D) Use Thread.Abort
31. Explanation: Cancellation is cooperative — pass `CancellationToken` to every async call; the caller cancels via `CancellationTokenSource.Cancel()`; check `ThrowIfCancellationRequested()` in CPU loops.
32. Q5: `ValueTask<T>` differs from `Task<T>` in that…
33. A) ValueTask is reference type; Task is value type
34. B) ValueTask cannot be awaited
35. C) ValueTask is a struct that may avoid allocation on the synchronous fast path (*)
36. D) ValueTask supports multiple awaits
37. Explanation: ValueTask<T> is a struct wrapping either a result or a Task; on the hot synchronous path it returns without allocating. It must be awaited only once (convert to Task if you need multiple awaits).
38. Q6: `Task.WhenAll(tasks)`…
39. A) Returns the first task to complete
40. B) Cancels all tasks
41. C) Runs tasks sequentially
42. D) Awaits all tasks and completes when all are done (or one faults) (*)
43. Explanation: `Task.WhenAll` completes when all input tasks complete; it aggregates exceptions into an AggregateException and returns an array of results.
44. Q7: `Task.WhenAny(tasks)` returns…
45. A) The first task to complete (success, fault, or cancel) (*)
46. B) An array of all completed tasks
47. C) The last task to complete
48. D) Nothing
49. Explanation: `Task.WhenAny` returns the first task to finish (in any state); useful for redundant fetches or implementing timeouts.
50. Q8: `IAsyncEnumerable<T>` is consumed with…
51. A) foreach
52. B) await foreach (*)
53. C) for
54. D) while
55. Explanation: `await foreach` is the consumer syntax for `IAsyncEnumerable<T>` (C# 8); each MoveNextAsync is awaited, enabling async streams.
56. Q9: Using `Task.Run` for IO-bound work is…
57. A) Recommended for performance
58. B) Required for HttpClient calls
59. C) Wasteful — it just occupies a thread-pool thread while waiting for IO (*)
60. D) Faster than await
61. Explanation: `Task.Run` for IO-bound work wastes a thread-pool thread that just blocks on IO; await the IO call directly so the thread is freed. Use `Task.Run` only for CPU-bound work.
62. Q10: How does the compiler transform an `async` method?
63. A) Inlines the awaits
64. B) Converts it to a Thread
65. C) Removes the async keyword
66. D) Generates a state machine struct that captures locals; each await is a state transition (*)
67. Explanation: The compiler generates a state machine (struct or class) holding local variables; each `await` becomes a state transition with a continuation that resumes the method on completion.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`async void` methods…"
  options:
    - Are the recommended way to write async code
    - Should only be used for event handlers; exceptions crash the process
    - Both B and C
    - Cannot be awaited at all
  correctIndex: 2
  explanation: async void is only valid for event handlers; the caller cannot await it, and unhandled exceptions propagate to the SynchronizationContext and crash the app.
- id: q2
  question: "`.Result` on an async method in a UI/ASP.NET-classic context…"
  options:
    - Returns the result immediately
    - Throws immediately
    - Cancels the operation
    - Can deadlock because the continuation needs the blocked SynchronizationContext
  correctIndex: 3
  explanation: The continuation is posted back to the captured SynchronizationContext, but that thread is blocked waiting for the result — classic deadlock. Use `await` or `ConfigureAwait(false)` in libraries.
- id: q3
  question: "`ConfigureAwait(false)` is recommended in library code because…"
  options:
    - It improves perf by avoiding context capture and post-back
    - It is required for correctness
    - It disables cancellation
    - It makes the method synchronous
  correctIndex: 0
  explanation: "`ConfigureAwait(false)` skips capturing the SynchronizationContext, avoiding the post-back to the UI/ASP.NET thread; this reduces overhead and prevents deadlocks in libraries."
- id: q4
  question: Which is the correct way to propagate cancellation through async calls?
  options:
    - Use a global static bool
    - Thread a CancellationToken through every async method
    - Throw OperationCanceledException manually
    - Use Thread.Abort
  correctIndex: 1
  explanation: Cancellation is cooperative — pass `CancellationToken` to every async call; the caller cancels via `CancellationTokenSource.Cancel()`; check `ThrowIfCancellationRequested()` in CPU loops.
- id: q5
  question: "`ValueTask<T>` differs from `Task<T>` in that…"
  options:
    - ValueTask is reference type; Task is value type
    - ValueTask cannot be awaited
    - ValueTask is a struct that may avoid allocation on the synchronous fast path
    - ValueTask supports multiple awaits
  correctIndex: 2
  explanation: ValueTask<T> is a struct wrapping either a result or a Task; on the hot synchronous path it returns without allocating. It must be awaited only once (convert to Task if you need multiple awaits).
- id: q6
  question: "`Task.WhenAll(tasks)`…"
  options:
    - Returns the first task to complete
    - Cancels all tasks
    - Runs tasks sequentially
    - Awaits all tasks and completes when all are done (or one faults)
  correctIndex: 3
  explanation: "`Task.WhenAll` completes when all input tasks complete; it aggregates exceptions into an AggregateException and returns an array of results."
- id: q7
  question: "`Task.WhenAny(tasks)` returns…"
  options:
    - The first task to complete (success, fault, or cancel)
    - An array of all completed tasks
    - The last task to complete
    - Nothing
  correctIndex: 0
  explanation: "`Task.WhenAny` returns the first task to finish (in any state); useful for redundant fetches or implementing timeouts."
- id: q8
  question: "`IAsyncEnumerable<T>` is consumed with…"
  options:
    - foreach
    - await foreach
    - for
    - while
  correctIndex: 1
  explanation: "`await foreach` is the consumer syntax for `IAsyncEnumerable<T>` (C# 8); each MoveNextAsync is awaited, enabling async streams."
- id: q9
  question: Using `Task.Run` for IO-bound work is…
  options:
    - Recommended for performance
    - Required for HttpClient calls
    - Wasteful — it just occupies a thread-pool thread while waiting for IO
    - Faster than await
  correctIndex: 2
  explanation: "`Task.Run` for IO-bound work wastes a thread-pool thread that just blocks on IO; await the IO call directly so the thread is freed. Use `Task.Run` only for CPU-bound work."
- id: q10
  question: How does the compiler transform an `async` method?
  options:
    - Inlines the awaits
    - Converts it to a Thread
    - Removes the async keyword
    - Generates a state machine struct that captures locals; each await is a state transition
  correctIndex: 3
  explanation: The compiler generates a state machine (struct or class) holding local variables; each `await` becomes a state transition with a continuation that resumes the method on completion.
```

