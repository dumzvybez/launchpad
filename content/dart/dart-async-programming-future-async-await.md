---
slug: dart-async-programming-future-async-await
id: dart-11
track: dart
order: 11
title: Async Programming — Future, async/await
description: Master Dart's async model — `Future`, `async`/`await`, `Future.wait`, `Completer`, the event loop, microtasks vs macrotasks, and avoiding async gaps.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=6000s
whyItMatters: Master Dart's async model — `Future`, `async`/`await`, `Future. wait`, `Completer`, the event loop, microtasks vs macrotasks, and avoiding async gaps.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Async Programming — Future, async/await

## Async Programming — Future, async/await

### Why It Matters

Master Dart's async model — `Future`, `async`/`await`, `Future. wait`, `Completer`, the event loop, microtasks vs macrotasks, and avoiding async gaps.

Master Dart's async model — `Future`, `async`/`await`, `Future.wait`, `Completer`, the event loop, microtasks vs macrotasks, and avoiding async gaps.

### Prerequisites

- Stage 6: Collections — List, Set, Map
- Stage 10: Generics and Type Bounds

### Topics

- The event loop: microtask queue vs event queue
- `Future<T>` and `.then`/`.catchError`/`.whenComplete`
- `async` and `await` syntax
- `Future.value`, `Future.error`, `Future.delayed`
- `Future.wait` for parallelism and `Future.any` for first-to-complete
- `Completer<T>` for bridging callbacks to Futures
- `async`/`async*` (sync* is sync generator; async* is async generator, covered in Stage 12)
- The `unawaited` lint and avoiding fire-and-forget

### Key Concepts

- Dart is single-threaded per isolate; async code interleaves on the event loop, not via threads.
- `await` suspends the function (returns a Future) until the awaited Future completes; control returns to the event loop.
- Microtasks (created by `scheduleMicrotask` or `Future` chaining) run before the next event (I/O, timers, UI).
- `Future.wait([f1, f2, f3])` runs futures in parallel and waits for all (or first error by default); pass `eagerError: false` to wait for all to settle.
- `async`/`await` is sugar over `Future.then`; an `async` function always returns a `Future`.
- Avoid "async gaps" between checking a value and using it — a context switch can invalidate assumptions; use `await` to chain dependent operations tightly.

```dart
Future<String> fetchUser() async {
  await Future.delayed(Duration(milliseconds: 100));
  return 'Anna';
}

Future<void> main() async {
  print('before');
  final user = await fetchUser();
  print('user: $user');
  print('after');
}
// before -> (100ms) -> user: Anna -> after
```
Caption: async/await basics

### Common Pitfalls

- Forgetting to `await` a Future — `doThing()` without await creates a fire-and-forget; the `unawaited` lint flags this. Either await it or explicitly wrap with `unawaited(...)` to silence.
- Sequential awaits when parallel would work — `final a = await f1(); final b = await f2();` runs in sequence; use `Future.wait([f1(), f2()])` to parallelize.
- Using `Future.wait` with eagerError=true (default) and expecting all results — the first error short-circuits and you lose settled results; pass `eagerError: false` if you want to wait for all.
- Async gap bugs — `if (cache != null) { await longOp(); print(cache.field); }` can crash if `cache` is mutated during `longOp()`. Snapshot to a local first: `final c = cache; if (c != null) { await longOp(); print(c.field); }`.
- Calling `setState` after async gap in Flutter — if the widget is disposed before the await returns, calling setState throws. Use `if (mounted)` checks (covered more in Stage 19).

### Real-World Applications

- Flutter's `FutureBuilder` widget consumes a Future and rebuilds on data, error, or completion — used in nearly every loading screen.
- The Hamilton app's API layer uses `Future.wait` to parallelize fetching shows, venues, and dates from multiple endpoints.
- Alibaba's Xianyu uses Completers to bridge legacy callback-based native plugins into Dart Futures for a clean async/await API.
- eBay Motors uses `Future.any` to race cache vs network, returning whichever resolves first for snappier perceived performance.

### Interview Questions

- 1. Is Dart multi-threaded? — Per isolate, no; Dart is single-threaded with an event loop. True parallelism requires Isolates (Stage 15).
- 2. What's the difference between a microtask and an event? — Microtasks run before the next event; they're for short, urgent work like resolving a Future. Events are I/O, timers, messages.
- 3. How does `Future.wait` achieve parallelism in a single thread? — Each Future's underlying async work (I/O, other isolates) runs outside the Dart thread; the event loop interleaves their completion callbacks.
- 4. What is an async gap and why is it dangerous? — An `await` suspends the function, allowing other code to run and mutate shared state; assumptions held before the await may be invalid after.
- 5. What does `async*` produce? — An asynchronous generator that yields a `Stream<T>`; covered in Stage 12.

### Mini Project

Build a Parallel Image Downloader: A program that takes a list of image URLs, downloads them in parallel with `Future.wait`, retries failed downloads up to 3 times with exponential backoff, and returns a list of `(url, bytes)` records. Use `http` package and a `RetryOptions` config. Suggested approach:
  - Define `Future<Uint8List> downloadWithRetry(String url, {int retries = 3})`
  - Use `Future.wait` to parallelize all downloads
  - Catch errors and retry with `Future.delayed(Duration(seconds: 1 << attempt))`
  - Return `List<({String url, Uint8List bytes})>` (records)
  - Add a `print`-based progress reporter between attempts

### Exercises

1. Convert a callback-based function to async/await using `Completer`.
2. Use `Future.wait` to fetch three things in parallel and print the total time vs sequential.
3. Use `Future.any` to race two slow operations and print the winner.
4. Implement a `retry<T>(Future<T> Function() op, {int max})` helper.
5. Demonstrate an async gap bug with a global mutable and fix it with a local snapshot.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is Dart multi-threaded per isolate?
9. A) Yes, with native threads
10. B) Only when using async
11. C) No — single thread + event loop (*)
12. D) Only on web
13. Explanation: Each Dart isolate is single-threaded with its own event loop; concurrency between isolates uses message passing, not shared memory.
14. Q2: What does `await` do?
15. A) Blocks the entire isolate
16. B) Spawns a new thread
17. C) Cancels the Future
18. D) Suspends the function and returns control to the event loop (*)
19. Explanation: `await` pauses the function, returns a Future to the caller, and resumes when the awaited Future completes; the isolate keeps processing other events.
20. Q3: Which runs first, microtasks or events?
21. A) Microtasks (*)
22. B) Events
23. C) Random order
24. D) They run in parallel
25. Explanation: The microtask queue is drained completely before the next event is processed; microtasks are for urgent follow-up work like resolving a chained Future.
26. Q4: What does `Future.wait([a, b, c])` do?
27. A) Runs in sequence
28. B) Runs in parallel, returns when all complete (*)
29. C) Returns when the first completes
30. D) Cancels all on first error
31. Explanation: `Future.wait` runs all futures concurrently and completes with a list of results when all have completed; by default it errors on the first failure.
32. Q5: What does `async` mean on a function?
33. A) It runs in a new isolate
34. B) It runs in a background thread
35. C) It always returns a Future, and `await` is allowed in the body (*)
36. D) It is automatically retried on failure
37. Explanation: An `async` function returns a `Future<T>` (or `Future<void>`); the body is rewritten by the compiler into a state machine that yields at each `await`.
38. Q6: What does the `unawaited` lint flag?
39. A) Calls that should be async
40. B) Missing async keywords
41. C) Future.error calls
42. D) Futures started but not awaited (fire-and-forget) (*)
43. Explanation: The lint warns when a Future is created and discarded without being awaited; either `await` it or wrap with `unawaited(...)` to signal intent.
44. Q7: What does `Future.any([a, b, c])` return?
45. A) The result of the first Future to complete (*)
46. B) A list of all results
47. C) The result of the fastest successful Future
48. D) An error if any fails
49. Explanation: `Future.any` completes with the value of the first Future to complete (success or error); other futures continue running but their results are discarded.
50. Q8: What is an async gap?
51. A) A Future that never completes
52. B) The window between an `await` and the resumption (*)
53. C) A missing await
54. D) A null check after an await
55. Explanation: During an `await`, other code can run and mutate state; the "gap" is the period when assumptions held before the await may be invalidated.
56. Q9: How do you bridge a callback-based API to a Future?
57. A) Use Future.value
58. B) Use Future.wait
59. C) Use a Completer and call complete/completeError from the callback (*)
60. D) Use Future.then
61. Explanation: A `Completer<T>` exposes a `future` you control; call `completer.complete(value)` from the callback to resolve it.
62. Q10: Why is `final a = await f1(); final b = await f2();` slower than `Future.wait`?
63. A) It isn't
64. B) await is single-threaded
65. C) Future.wait spawns threads
66. D) f2 doesn't start until f1 completes — sequential, not parallel (*)
67. Explanation: Sequential awaits force f2 to start only after f1's await returns; `Future.wait([f1(), f2()])` starts both immediately and waits for both.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is Dart multi-threaded per isolate?
  options:
    - Yes, with native threads
    - Only when using async
    - No — single thread + event loop
    - Only on web
  correctIndex: 2
  explanation: Each Dart isolate is single-threaded with its own event loop; concurrency between isolates uses message passing, not shared memory.
- id: q2
  question: What does `await` do?
  options:
    - Blocks the entire isolate
    - Spawns a new thread
    - Cancels the Future
    - Suspends the function and returns control to the event loop
  correctIndex: 3
  explanation: "`await` pauses the function, returns a Future to the caller, and resumes when the awaited Future completes; the isolate keeps processing other events."
- id: q3
  question: Which runs first, microtasks or events?
  options:
    - Microtasks
    - Events
    - Random order
    - They run in parallel
  correctIndex: 0
  explanation: The microtask queue is drained completely before the next event is processed; microtasks are for urgent follow-up work like resolving a chained Future.
- id: q4
  question: What does `Future.wait([a, b, c])` do?
  options:
    - Runs in sequence
    - Runs in parallel, returns when all complete
    - Returns when the first completes
    - Cancels all on first error
  correctIndex: 1
  explanation: "`Future.wait` runs all futures concurrently and completes with a list of results when all have completed; by default it errors on the first failure."
- id: q5
  question: What does `async` mean on a function?
  options:
    - It runs in a new isolate
    - It runs in a background thread
    - It always returns a Future, and `await` is allowed in the body
    - It is automatically retried on failure
  correctIndex: 2
  explanation: An `async` function returns a `Future<T>` (or `Future<void>`); the body is rewritten by the compiler into a state machine that yields at each `await`.
- id: q6
  question: What does the `unawaited` lint flag?
  options:
    - Calls that should be async
    - Missing async keywords
    - Future.error calls
    - Futures started but not awaited (fire-and-forget)
  correctIndex: 3
  explanation: The lint warns when a Future is created and discarded without being awaited; either `await` it or wrap with `unawaited(...)` to signal intent.
- id: q7
  question: What does `Future.any([a, b, c])` return?
  options:
    - The result of the first Future to complete
    - A list of all results
    - The result of the fastest successful Future
    - An error if any fails
  correctIndex: 0
  explanation: "`Future.any` completes with the value of the first Future to complete (success or error); other futures continue running but their results are discarded."
- id: q8
  question: What is an async gap?
  options:
    - A Future that never completes
    - The window between an `await` and the resumption
    - A missing await
    - A null check after an await
  correctIndex: 1
  explanation: During an `await`, other code can run and mutate state; the "gap" is the period when assumptions held before the await may be invalidated.
- id: q9
  question: How do you bridge a callback-based API to a Future?
  options:
    - Use Future.value
    - Use Future.wait
    - Use a Completer and call complete/completeError from the callback
    - Use Future.then
  correctIndex: 2
  explanation: A `Completer<T>` exposes a `future` you control; call `completer.complete(value)` from the callback to resolve it.
- id: q10
  question: Why is `final a = await f1(); final b = await f2();` slower than `Future.wait`?
  options:
    - It isn't
    - await is single-threaded
    - Future.wait spawns threads
    - f2 doesn't start until f1 completes — sequential, not parallel
  correctIndex: 3
  explanation: Sequential awaits force f2 to start only after f1's await returns; `Future.wait([f1(), f2()])` starts both immediately and waits for both.
```

