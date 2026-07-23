---
slug: swift-combine-async-sequences
id: swift-17
track: swift
order: 17
title: Combine and Async Sequences
description: Use Apple's Combine framework for reactive pipelines and Swift's native `AsyncSequence` for async iteration, and know when to choose each.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=960s
whyItMatters: Use Apple's Combine framework for reactive pipelines and Swift's native `AsyncSequence` for async iteration, and know when to choose each.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Combine and Async Sequences

## Combine and Async Sequences

### Why It Matters

Use Apple's Combine framework for reactive pipelines and Swift's native `AsyncSequence` for async iteration, and know when to choose each.

Use Apple's Combine framework for reactive pipelines and Swift's native `AsyncSequence` for async iteration, and know when to choose each.

### Prerequisites

- Stage 6: Functions and Closures (escaping closures)
- Stage 16: Concurrency (async/await)
- Stage 12: Protocols (Publishers/Operators as protocols)

### Topics

- Combine: `Publisher`, `Subscriber`, `Operator`, `Cancellable`
- `Just`, `Future`, `PassthroughSubject`, `CurrentValueSubject`
- Operators: `map`, `filter`, `flatMap`, `decode`, `throttle`, `debounce`
- `sink(receiveValue:)` and `assign(to:on:)`
- Backpressure and `Demand`
- Memory management: storing `AnyCancellable`
- `AsyncSequence` and `AsyncStream`
- `for await` iteration
- Bridging Combine to AsyncSequence
- When to choose Combine vs AsyncSequence

### Key Concepts

- Combine is a reactive framework: pipelines of `Publisher` → operators → `Subscriber`, with values flowing through.
- You MUST hold the `AnyCancellable` returned by `sink`/`assign` for the pipeline's lifetime; releasing it tears down the subscription.
- `AsyncSequence` is the Swift-native equivalent for async iteration — values arrive over time, and the consumer awaits each.
- Combine is great for binding to UI (e.g., `@Published` in `ObservableObject`); AsyncSequence is great for streaming sources (websockets, file tailing).
- Modern Swift code often replaces Combine with `AsyncSequence` + `@Observable` (Swift 5.9+), but Combine remains important in legacy codebases.

```swift
import Combine

let subject = PassthroughSubject<Int, Never>()

let cancellable = subject
    .filter { $0.isMultiple(of: 2) }
    .map { $0 * $0 }
    .sink { print($0) }   // 4, 16, 36

subject.send(2); subject.send(3); subject.send(4); subject.send(6)
// Hold `cancellable` or the pipeline tears down immediately
```
Caption: Combine pipeline

### Common Pitfalls

- Not storing the `AnyCancellable` — `sink` returns one; if you don't store it, the subscription is torn down at end of expression. Store in a `Set<AnyCancellable>`.
- Using Combine for everything when `AsyncSequence` fits better — Combine pipelines have a learning curve; for simple streaming, `AsyncStream` + `for await` is clearer.
- Forgetting to handle `receiveCompletion` errors — `sink(receiveCompletion:receiveValue:)` reports completion (including failure); if you only use `receiveValue`, errors are silently dropped.
- Capturing `self` strongly in `sink` — creates a retain cycle if the cancellable is stored on self; use `[weak self]` and `guard let self`.
- Combining `@Published` with `@MainActor` incorrectly — updates may arrive on background threads; use `.receive(on: DispatchQueue.main)` before binding to UI.

### Real-World Applications

- Apple's Combine powers `@Published` in `ObservableObject` for SwiftUI bindings in pre-iOS 17 codebases.
- LinkedIn's networking layer uses Combine for response decoding and state binding, then converts to AsyncSequence for new code.
- Airbnb uses Combine to debounce search input (`.debounce(for: 0.3)`), avoiding a network call per keystroke.
- Things 3 uses `AsyncStream` to model file-system watchers that emit change events as the user edits.

### Interview Questions

- 1. What's the difference between Combine and AsyncSequence? — Combine is a push-based reactive framework with backpressure; AsyncSequence is pull-based async iteration. Combine binds pipelines; AsyncSequence is consumed by `for await`.
- 2. Why must you store `AnyCancellable`? — Releasing it tears down the subscription; pipelines are owned by their cancellables.
- 3. What's the difference between `throttle` and `debounce`? — `throttle` emits the first/last value in a window (rate-limits); `debounce` waits for a quiet period before emitting (filters noise).
- 4. What is `@Published`? — A property wrapper that wraps a value and exposes a Combine publisher; mutating the property sends a new value to subscribers.
- 5. How do you bridge Combine to async/await? — Implement a `values()` extension using `AsyncStream` and `sink`, cancelling the subscription on stream termination.

### Mini Project

Build a Search-with-Debounce: A search field that publishes text changes, debounces 300ms, hits a search API, decodes results, and updates a list. Use Combine and then re-implement with AsyncSequence for comparison. Suggested approach:
  - `let searchSubject = PassthroughSubject<String, Never>()`
  - Pipeline: `.debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)` → `.flatMap { URLSession.shared.dataTaskPublisher(...) }`
  - Hold the cancellable in a `Set<AnyCancellable>`
  - Re-implement with `AsyncStream` + `Task` and `Task.sleep`
  - Compare readability and lifecycle management

### Exercises

1. Create a `PassthroughSubject<Int, Never>` and chain `map` → `filter` → `sink`. Hold the cancellable.
2. Build a `CurrentValueSubject` and verify new subscribers receive the current value.
3. Use `.debounce` on a simulated search input and confirm it only fires after 300ms quiet.
4. Build an `AsyncStream` that yields values from a `Timer` and iterate with `for await`.
5. Write a `values()` extension on a Combine publisher to bridge to AsyncSequence.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What must you do with the `AnyCancellable` returned by `sink`?
9. A) Store it for the lifetime of the subscription, or the pipeline tears down (*)
10. B) Discard it
11. C) Cancel it immediately
12. D) Pass it to the next operator
13. Explanation: The cancellable owns the subscription; releasing it tears down the pipeline. Store it in a `Set<AnyCancellable>` on the owner.
14. Q2: What's the core difference between Combine and AsyncSequence?
15. A) Combine is faster
16. B) Combine is push-based reactive; AsyncSequence is pull-based async iteration (*)
17. C) Combine is async; AsyncSequence is sync
18. D) They're identical
19. Explanation: Combine pushes values through pipelines you build; AsyncSequence is consumed by `for await`, pulling one value at a time across an await.
20. Q3: What does `.debounce(for: 0.3)` do?
21. A) Emits the first value every 0.3s
22. B) Drops all values for 0.3s
23. C) Waits 0.3s of silence, then emits the latest value (*)
24. D) Errors after 0.3s
25. Explanation: `debounce` waits for a quiet window of N seconds before emitting the most recent value; useful for type-ahead search.
26. Q4: What's the difference between `throttle` and `debounce`?
27. A) They're identical
28. B) `throttle` is for errors only
29. C) `debounce` is sync
30. D) `throttle` rate-limits (emits first/last in window); `debounce` waits for silence (*)
31. Explanation: `throttle` enforces a max rate (one emission per window); `debounce` resets the timer on each new value and only emits after a quiet period.
32. Q5: What is `@Published`?
33. A) A property wrapper that wraps a value and exposes a Combine publisher (*)
34. B) A networking protocol
35. C) An actor
36. D) A subscript
37. Explanation: `@Published var x: T` wraps `x` and emits a new value to subscribers whenever `x` changes; widely used in `ObservableObject` (pre-iOS 17).
38. Q6: Which Combine operator transforms a `Publisher<Data, Error>` to `Publisher<User, Error>`?
39. A) `map`
40. B) `decode(type:decoder:)` (*)
41. C) `flatMap`
42. D) `sink`
43. Explanation: `decode` decodes the upstream `Data` using a `Decoder` (e.g., `JSONDecoder`) into the requested type.
44. Q7: What does `AsyncStream` provide?
45. A) A synchronous stream
46. B) A Combine publisher
47. C) A bridge from callback/yield-based sources to `AsyncSequence` (*)
48. D) A thread pool
49. Explanation: `AsyncStream` builds an `AsyncSequence` from a closure that `yield`s values; the consumer iterates with `for await`.
50. Q8: How do you cancel an AsyncStream consumer?
51. A) `stream.cancel()`
52. B) Throw an error
53. C) You can't
54. D) Break out of the `for await` loop; `onTermination` runs (*)
55. Explanation: Breaking out or task cancellation triggers the stream's `onTermination` handler, where you can clean up (e.g., cancel a Combine subscription).
56. Q9: Why use `.receive(on: DispatchQueue.main)` before updating UI from Combine?
57. A) Combine may emit on background threads; UI updates must be on main (*)
58. B) Performance
59. C) To debounce
60. D) Required for `@Published`
61. Explanation: Publishers can emit on any thread; `.receive(on:)` hops to the specified scheduler so UI updates happen on main.
62. Q10: Which is the modern Swift replacement for Combine pipelines in iOS 17+?
63. A) GCD
64. B) AsyncSequence + `@Observable` (Observation framework) (*)
65. C) NotificationCenter
66. D) KVO
67. Explanation: Swift 5.9's `@Observable` macro plus `AsyncSequence` covers most Combine use cases with simpler ergonomics; Combine remains supported for legacy code.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What must you do with the `AnyCancellable` returned by `sink`?
  options:
    - Store it for the lifetime of the subscription, or the pipeline tears down
    - Discard it
    - Cancel it immediately
    - Pass it to the next operator
  correctIndex: 0
  explanation: The cancellable owns the subscription; releasing it tears down the pipeline. Store it in a `Set<AnyCancellable>` on the owner.
- id: q2
  question: What's the core difference between Combine and AsyncSequence?
  options:
    - Combine is faster
    - Combine is push-based reactive; AsyncSequence is pull-based async iteration
    - Combine is async; AsyncSequence is sync
    - They're identical
  correctIndex: 1
  explanation: Combine pushes values through pipelines you build; AsyncSequence is consumed by `for await`, pulling one value at a time across an await.
- id: q3
  question: "What does `.debounce(for: 0.3)` do?"
  options:
    - Emits the first value every 0.3s
    - Drops all values for 0.3s
    - Waits 0.3s of silence, then emits the latest value
    - Errors after 0.3s
  correctIndex: 2
  explanation: "`debounce` waits for a quiet window of N seconds before emitting the most recent value; useful for type-ahead search."
- id: q4
  question: What's the difference between `throttle` and `debounce`?
  options:
    - They're identical
    - "`throttle` is for errors only"
    - "`debounce` is sync"
    - "`throttle` rate-limits (emits first/last in window); `debounce` waits for silence"
  correctIndex: 3
  explanation: "`throttle` enforces a max rate (one emission per window); `debounce` resets the timer on each new value and only emits after a quiet period."
- id: q5
  question: What is `@Published`?
  options:
    - A property wrapper that wraps a value and exposes a Combine publisher
    - A networking protocol
    - An actor
    - A subscript
  correctIndex: 0
  explanation: "`@Published var x: T` wraps `x` and emits a new value to subscribers whenever `x` changes; widely used in `ObservableObject` (pre-iOS 17)."
- id: q6
  question: Which Combine operator transforms a `Publisher<Data, Error>` to `Publisher<User, Error>`?
  options:
    - "`map`"
    - "`decode(type:decoder:)`"
    - "`flatMap`"
    - "`sink`"
  correctIndex: 1
  explanation: "`decode` decodes the upstream `Data` using a `Decoder` (e.g., `JSONDecoder`) into the requested type."
- id: q7
  question: What does `AsyncStream` provide?
  options:
    - A synchronous stream
    - A Combine publisher
    - A bridge from callback/yield-based sources to `AsyncSequence`
    - A thread pool
  correctIndex: 2
  explanation: "`AsyncStream` builds an `AsyncSequence` from a closure that `yield`s values; the consumer iterates with `for await`."
- id: q8
  question: How do you cancel an AsyncStream consumer?
  options:
    - "`stream.cancel()`"
    - Throw an error
    - You can't
    - Break out of the `for await` loop; `onTermination` runs
  correctIndex: 3
  explanation: Breaking out or task cancellation triggers the stream's `onTermination` handler, where you can clean up (e.g., cancel a Combine subscription).
- id: q9
  question: "Why use `.receive(on: DispatchQueue.main)` before updating UI from Combine?"
  options:
    - Combine may emit on background threads; UI updates must be on main
    - Performance
    - To debounce
    - Required for `@Published`
  correctIndex: 0
  explanation: Publishers can emit on any thread; `.receive(on:)` hops to the specified scheduler so UI updates happen on main.
- id: q10
  question: Which is the modern Swift replacement for Combine pipelines in iOS 17+?
  options:
    - GCD
    - AsyncSequence + `@Observable` (Observation framework)
    - NotificationCenter
    - KVO
  correctIndex: 1
  explanation: Swift 5.9's `@Observable` macro plus `AsyncSequence` covers most Combine use cases with simpler ergonomics; Combine remains supported for legacy code.
```

