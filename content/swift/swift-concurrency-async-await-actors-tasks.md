---
slug: swift-concurrency-async-await-actors-tasks
id: swift-16
track: swift
order: 16
title: Concurrency — async/await, Actors, Tasks
description: Use Swift's modern concurrency model — `async`/`await`, structured `Task`s, `actor` isolation, `Sendable`, and `AsyncSequence` — to write safe concurrent code without locks.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=900s
whyItMatters: Use Swift's modern concurrency model — `async`/`await`, structured `Task`s, `actor` isolation, `Sendable`, and `AsyncSequence` — to write safe concurrent code without locks.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Concurrency — async/await, Actors, Tasks

## Concurrency — async/await, Actors, Tasks

### Why It Matters

Use Swift's modern concurrency model — `async`/`await`, structured `Task`s, `actor` isolation, `Sendable`, and `AsyncSequence` — to write safe concurrent code without locks.

Use Swift's modern concurrency model — `async`/`await`, structured `Task`s, `actor` isolation, `Sendable`, and `AsyncSequence` — to write safe concurrent code without locks.

### Prerequisites

- Stage 6: Functions and Closures (escaping closures)
- Stage 14: Error Handling (throws)
- Stage 15: Memory Management (weak self)

### Topics

- `async` functions and `await` suspension points
- Structured concurrency with `Task`, `async let`, `TaskGroup`
- `actor` types and isolation
- `Sendable` conformance for safe concurrent passing
- `@MainActor` for UI-thread isolation
- `nonisolated` members
- Async sequences and `for await`
- Cancellation: `Task.cancel()`, `Task.checkCancellation()`, `withTaskCancellationHandler`
- Continuations: `withCheckedContinuation`, `withCheckedThrowingContinuation`
- Actor reentrancy and how to avoid it

### Key Concepts

- `async`/`await` is cooperative: suspension happens only at `await` points, so no thread is blocked and no locks are needed for awaiting.
- `actor` types serialize access to their mutable state — only one task runs a method on a given actor at a time.
- `Sendable` is a marker protocol: types that are safe to pass across concurrency domains (value types, `actor`s, classes marked `final` and immutable).
- `Task` is unstructured (detached) concurrency; `async let` and `TaskGroup` are structured (parent-child cancellation).
- Actor reentrancy: a method that awaits may be re-entered by another call before completing; don't read-modify-write shared state across an await.

```swift
func fetchUser(_ id: Int) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: URL(string: "https://api.example.com/users/\(id)")!)
    return try JSONDecoder().decode(User.self, from: data)
}

func loadProfile() async {
    do {
        let user = try await fetchUser(42)
        print(user.name)
    } catch {
        print("failed: \(error)")
    }
}
```
Caption: async/await basics

### Common Pitfalls

- Calling blocking APIs (`Thread.sleep`, `URLSession.dataTask` completion) inside an `async` function — block the executor thread and stall other tasks. Use `async` variants or offload with `Task.detached`.
- Forgetting `await` when calling an actor method — compile error: expressions are not concurrent-safe; the compiler requires `await` to suspend until the actor is free.
- Reading actor state across an `await` (read-modify-write race) — actor reentrancy means another task can mutate state between your reads and writes; batch operations into a single actor method.
- Treating `Task {}` as fire-and-forget — detached tasks can outlive the parent and aren't cancelled automatically; use structured `async let` / `TaskGroup` when possible.
- Marking non-thread-safe classes `Sendable` to silence warnings — `Sendable` is a promise; lying creates data races that the runtime won't catch.

### Real-World Applications

- Apple's URLSession provides async `data(from:)` since iOS 15, eliminating callback hell in networking code.
- LinkedIn rewrote its API client with async/await and `actor`-isolated state objects, drastically reducing crash reports from data races.
- Lyft's ride-state machine is implemented as an `actor` to serialize state transitions across driver/rider updates.
- Slack uses `TaskGroup` to fetch channel data in parallel during cold start, cutting launch time by 30%.

### Interview Questions

- 1. What's the difference between `Task {}` and `async let`? — `Task` is unstructured (outlives the parent, manual cancellation); `async let` is structured (parent-child cancellation, scoped).
- 2. What is `actor` isolation and why does it eliminate data races? — Only one task executes a method on a given actor at a time; the compiler enforces `await` at call sites to suspend until the actor is free.
- 3. What is `Sendable` and when is it required? — A marker protocol promising safe concurrent passing; required when crossing actor boundaries (function args, async return values).
- 4. What is actor reentrancy and why is it dangerous? — An actor method may be re-entered by another task across an `await` mid-execution; read-modify-write across an await is a race.
- 5. How do you cancel a structured task? — Cancellation propagates automatically from parent to child; check with `Task.checkCancellation()` or `Task.isCancelled`, or use `withTaskCancellationHandler`.

### Mini Project

Build a Concurrent Image Downloader: An `actor ImageCache` with `func image(for url: URL) async throws -> UIImage` that downloads (with `URLSession` async), caches in memory, and deduplicates concurrent requests for the same URL. Suggested approach:
  - `actor ImageCache { private var cache: [URL: UIImage] = [:]; private var inflight: [URL: Task<UIImage, Error>] = [:] }`
  - In `image(for:)`, return cached if present, otherwise return existing inflight task
  - Otherwise create a new `Task` to fetch and decode, store it, and `await` its value
  - Use `Task.checkCancellation()` to support cancellation
  - Test by requesting the same URL concurrently and confirming only one network call fires

### Exercises

1. Write `async func sleep(seconds:)` using `Task.sleep` and call it with `await`.
2. Use `async let` to fetch two URLs in parallel and combine the results.
3. Convert a completion-handler API to async with `withCheckedThrowingContinuation`.
4. Build an `actor Bank { var balance: Decimal }` with `deposit` and `withdraw` methods; verify no races by spawning 1000 tasks.
5. Add `Task.checkCancellation()` to a long-running loop and observe `CancellationError` when cancelled.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `await` do?
9. A) Blocks the calling thread until done
10. B) Throws an error
11. C) Creates a new thread
12. D) Suspends the current task at a suspension point without blocking a thread (*)
13. Explanation: `await` is a suspension point: the task yields the thread to the executor, which can run other tasks; when the awaited op completes, the task resumes.
14. Q2: What does an `actor` provide?
15. A) Serialized access to its mutable state — no locks needed (*)
16. B) Async functions
17. C) A thread pool
18. D) GC
19. Explanation: Actors isolate their state; only one task runs an actor method at a time, eliminating data races without explicit locks.
20. Q3: What's the difference between `Task {}` and `async let`?
21. A) None
22. B) `Task` is unstructured (detached lifetime); `async let` is structured (parent-child cancellation) (*)
23. C) `Task` is faster
24. D) `async let` is for actors only
25. Explanation: Structured concurrency (`async let`, `TaskGroup`) propagates cancellation and awaits completion at scope exit; `Task {}` runs independently.
26. Q4: What is `Sendable`?
27. A) A networking protocol
28. B) A type of closure
29. C) A marker protocol promising safe concurrent passing across actor boundaries (*)
30. D) An actor subtype
31. Explanation: `Sendable` types are safe to share across concurrency domains (value types, actors, immutable final classes); the compiler enforces it at boundaries.
32. Q5: What is actor reentrancy?
33. A) A way to call actors recursively
34. B) A compile error
35. C) A deadlock
36. D) An actor method may be re-entered by another task across an `await`, allowing interleaved state mutation (*)
37. Explanation: Because the actor yields at `await`, another task can run a method on the same actor before the first resumes — read-modify-write across an await is unsafe.
38. Q6: How do you bridge a completion-handler API to async?
39. A) Use `withCheckedThrowingContinuation` (*)
40. B) Use `Task.detached`
41. C) Use a semaphore
42. D) You can't
43. Explanation: `withCheckedThrowingContinuation` suspends the task and hands you a continuation to `resume(returning:)` or `resume(throwing:)` from the callback.
44. Q7: How does cancellation propagate in structured concurrency?
45. A) It doesn't — each task manages its own
46. B) Automatically from parent to child; check with `Task.isCancelled` or `Task.checkCancellation()` (*)
47. C) Via NotificationCenter
48. D) Via a global flag
49. Explanation: Structured tasks inherit cancellation from their parent; cooperative tasks poll `Task.isCancelled` or call `Task.checkCancellation()` to throw `CancellationError`.
50. Q8: Why is calling `Thread.sleep` inside an `async` function bad?
51. A) Compile error
52. B) Throws an error
53. C) Blocks the executor thread, stalling other tasks (*)
54. D) Nothing — it's fine
55. Explanation: The cooperative thread pool has limited threads; blocking one with `Thread.sleep` starves other tasks. Use `Task.sleep` instead.
56. Q9: What does `@MainActor` do?
57. A) Marks a function as the entry point
58. B) Creates a new actor
59. C) Disables async
60. D) Isolates the marked type/function to the main thread (UI updates) (*)
61. Explanation: `@MainActor` ensures code runs on the main thread — required for UIKit/SwiftUI updates. Calls from off-main `await` automatically hop.
62. Q10: What's a `TaskGroup`?
63. A) A structured concurrency primitive for spawning N child tasks and collecting their results (*)
64. B) A group of related actors
65. C) A thread pool
66. D) A continuation type
67. Explanation: `withTaskGroup` creates a scope where you `addTask` multiple child tasks; results stream back via `for await`, and the group awaits all children at scope exit.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `await` do?
  options:
    - Blocks the calling thread until done
    - Throws an error
    - Creates a new thread
    - Suspends the current task at a suspension point without blocking a thread
  correctIndex: 3
  explanation: "`await` is a suspension point: the task yields the thread to the executor, which can run other tasks; when the awaited op completes, the task resumes."
- id: q2
  question: What does an `actor` provide?
  options:
    - Serialized access to its mutable state — no locks needed
    - Async functions
    - A thread pool
    - GC
  correctIndex: 0
  explanation: Actors isolate their state; only one task runs an actor method at a time, eliminating data races without explicit locks.
- id: q3
  question: What's the difference between `Task {}` and `async let`?
  options:
    - None
    - "`Task` is unstructured (detached lifetime); `async let` is structured (parent-child cancellation)"
    - "`Task` is faster"
    - "`async let` is for actors only"
  correctIndex: 1
  explanation: Structured concurrency (`async let`, `TaskGroup`) propagates cancellation and awaits completion at scope exit; `Task {}` runs independently.
- id: q4
  question: What is `Sendable`?
  options:
    - A networking protocol
    - A type of closure
    - A marker protocol promising safe concurrent passing across actor boundaries
    - An actor subtype
  correctIndex: 2
  explanation: "`Sendable` types are safe to share across concurrency domains (value types, actors, immutable final classes); the compiler enforces it at boundaries."
- id: q5
  question: What is actor reentrancy?
  options:
    - A way to call actors recursively
    - A compile error
    - A deadlock
    - An actor method may be re-entered by another task across an `await`, allowing interleaved state mutation
  correctIndex: 3
  explanation: Because the actor yields at `await`, another task can run a method on the same actor before the first resumes — read-modify-write across an await is unsafe.
- id: q6
  question: How do you bridge a completion-handler API to async?
  options:
    - Use `withCheckedThrowingContinuation`
    - Use `Task.detached`
    - Use a semaphore
    - You can't
  correctIndex: 0
  explanation: "`withCheckedThrowingContinuation` suspends the task and hands you a continuation to `resume(returning:)` or `resume(throwing:)` from the callback."
- id: q7
  question: How does cancellation propagate in structured concurrency?
  options:
    - It doesn't — each task manages its own
    - Automatically from parent to child; check with `Task.isCancelled` or `Task.checkCancellation()`
    - Via NotificationCenter
    - Via a global flag
  correctIndex: 1
  explanation: Structured tasks inherit cancellation from their parent; cooperative tasks poll `Task.isCancelled` or call `Task.checkCancellation()` to throw `CancellationError`.
- id: q8
  question: Why is calling `Thread.sleep` inside an `async` function bad?
  options:
    - Compile error
    - Throws an error
    - Blocks the executor thread, stalling other tasks
    - Nothing — it's fine
  correctIndex: 2
  explanation: The cooperative thread pool has limited threads; blocking one with `Thread.sleep` starves other tasks. Use `Task.sleep` instead.
- id: q9
  question: What does `@MainActor` do?
  options:
    - Marks a function as the entry point
    - Creates a new actor
    - Disables async
    - Isolates the marked type/function to the main thread (UI updates)
  correctIndex: 3
  explanation: "`@MainActor` ensures code runs on the main thread — required for UIKit/SwiftUI updates. Calls from off-main `await` automatically hop."
- id: q10
  question: What's a `TaskGroup`?
  options:
    - A structured concurrency primitive for spawning N child tasks and collecting their results
    - A group of related actors
    - A thread pool
    - A continuation type
  correctIndex: 0
  explanation: "`withTaskGroup` creates a scope where you `addTask` multiple child tasks; results stream back via `for await`, and the group awaits all children at scope exit."
```

