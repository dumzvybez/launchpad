---
slug: dart-streams-single-broadcast
id: dart-12
track: dart
order: 12
title: Streams — Single and Broadcast
description: Learn Dart's `Stream<T>` for sequences of async events — single-subscription vs broadcast streams, `async*` generators, `StreamController`, and the rich `Stream` operators (map, where, expand, debounce, etc.).
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=6600s
whyItMatters: Learn Dart's `Stream<T>` for sequences of async events — single-subscription vs broadcast streams, `async*` generators, `StreamController`, and the rich `Stream` operators (map, where, expand, debounce, etc. ).
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Streams — Single and Broadcast

## Streams — Single and Broadcast

### Why It Matters

Learn Dart's `Stream<T>` for sequences of async events — single-subscription vs broadcast streams, `async*` generators, `StreamController`, and the rich `Stream` operators (map, where, expand, debounce, etc. ).

Learn Dart's `Stream<T>` for sequences of async events — single-subscription vs broadcast streams, `async*` generators, `StreamController`, and the rich `Stream` operators (map, where, expand, debounce, etc.).

### Prerequisites

- Stage 11: Async Programming — Future, async/await

### Topics

- `Stream<T>` as the async analog of `Iterable<T>`
- Single-subscription vs broadcast streams
- `async*` and `yield`/`yield*`
- `StreamController<T>` (with `broadcast: true` for multi-listener)
- Listening, pausing, resuming, canceling subscriptions
- Operators: `map`, `where`, `expand`, `take`, `skip`, `distinct`, `debounceTime`, `asyncExpand`
- `await for` loop for consuming a stream
- Error handling in streams: `onError`, `cancelOnError`

### Key Concepts

- A single-subscription stream can have ONE listener at a time; a broadcast stream can have many.
- `async*` functions produce a Stream by yielding values; `yield` emits one value, `yield*` delegates to another stream.
- `StreamController` is the imperative counterpart to `async*` — you call `add`, `addError`, `close` to push events.
- `await for (final x in stream)` consumes a stream sequentially, awaiting each event; you can `break` to cancel.
- `Stream.fromIterable` and `Stream.periodic` are common constructors.
- `stream.listen(onData, onError, onDone, cancelOnError: true)` returns a `StreamSubscription` you can pause, resume, or cancel.

```dart
Stream<int> count(int n) async* {
  for (var i = 1; i <= n; i++) {
    await Future.delayed(Duration(milliseconds: 100));
    yield i;
  }
}

Future<void> main() async {
  await for (final i in count(3)) {
    print(i); // 1, 2, 3 with 100ms gaps
  }
}
```
Caption: async* generator

### Common Pitfalls

- Adding multiple listeners to a single-subscription stream — throws `StateError: Stream has already been listened to`. Use `stream.asBroadcastStream()` (converts late) or create a broadcast stream from the start.
- Forgetting to close a `StreamController` — leaks resources; controllers should be closed when no more events will be sent, often in `dispose()`.
- Treating streams as Futures — `Future<T>` resolves to one value; `Stream<T>` emits zero or more. Confusing them leads to "I'm only getting the first event" bugs.
- Mutating paused subscriptions — a paused subscription buffers events; if the producer is faster than the consumer, memory grows unbounded. Apply backpressure (e.g., `asyncExpand` that awaits processing).
- Not canceling subscriptions in Flutter `dispose` — subscriptions outlive the widget and fire on dead state, causing setState-after-dispose errors. Always store the subscription and cancel in `dispose()`.

### Real-World Applications

- Flutter's `StreamBuilder` widget rebuilds on every stream event — used for real-time UI updates from Firestore, WebSockets, sensors.
- The Hamilton app uses broadcast streams for a global "navigation events" bus, allowing multiple widgets to react to route changes.
- Alibaba's Xianyu uses `async*` to lazily stream search results from a paginated API, rendering as they arrive.
- eBay Motors uses streams to pipe OBD-II sensor data from a Bluetooth dongle into the UI at 10 Hz without blocking.

### Interview Questions

- 1. What's the difference between a single-subscription and a broadcast stream? — Single-subscription allows one listener and replays nothing; broadcast allows many but late listeners miss earlier events.
- 2. How do you convert a single-subscription stream to a broadcast one? — `stream.asBroadcastStream()` for late conversion, or `StreamController.broadcast()` from creation.
- 3. What does `yield*` do? — Delegates to another stream, emitting all its values and then continuing; useful for composing generators.
- 4. How does `await for` differ from `listen`? — `await for` blocks the current async function until the stream completes; `listen` returns immediately and invokes callbacks.
- 5. Why cancel a subscription in `dispose()`? — A subscription holds resources and may call back into a disposed widget; canceling prevents setState-after-dispose errors and resource leaks.

### Mini Project

Build a Stock Ticker Simulator: A program that emits simulated stock prices every 200ms for N symbols using `async*`, with a broadcast `StreamController` so multiple "clients" can subscribe. Apply `map` to compute percentage change from the first tick and `take` to limit each client to 10 ticks. Suggested approach:
  - `Stream<Tick> ticker(String symbol) async*` that yields random prices
  - Wrap in a `StreamController.broadcast()` so multiple listeners can attach
  - Client A: `ticker.stream.take(5).listen(...)`
  - Client B (late join): attaches after 500ms, gets only future events
  - Print all events with timestamps

### Exercises

1. Write an `async*` function that yields the first N Fibonacci numbers with a 100ms delay.
2. Convert a single-subscription stream to broadcast and attach two listeners.
3. Use `await for` to sum all events from `Stream.fromIterable([1,2,3,4,5])`.
4. Build a `StreamController` that closes after 5 events and observe `onDone`.
5. Apply `debounceTime` (from rxdart or simulate) to drop rapid bursts.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many listeners can a single-subscription stream have?
9. A) Unlimited
10. B) Up to 10
11. C) Two
12. D) One at a time (*)
13. Explanation: Single-subscription streams allow one listener; adding a second throws `StateError`. Use `asBroadcastStream()` or a broadcast controller for multiple listeners.
14. Q2: What does `async*` produce?
15. A) A Stream (*)
16. B) A Future
17. C) An Iterable
18. D) A Generator object
19. Explanation: `async*` functions are async generators that return `Stream<T>`; they `yield` values as they become available.
20. Q3: How do you convert a single-subscription stream to broadcast?
21. A) stream.broadcast()
22. B) stream.asBroadcastStream() (*)
23. C) BroadcastStream(stream)
24. D) stream.toList()
25. Explanation: `asBroadcastStream()` creates a broadcast stream that listens to the underlying single-subscription stream and forwards events to all subscribers.
26. Q4: What does `await for` do?
27. A) Blocks the isolate
28. B) Cancels the stream
29. C) Asynchronously consumes the stream, awaiting each event (*)
30. D) Returns the first event
31. Explanation: `await for (final x in stream)` loops over stream events, awaiting each; the function is suspended between events. `break` cancels the subscription.
32. Q5: What does `yield*` do in an async generator?
33. A) Yields a Future
34. B) Throws an error
35. C) Closes the stream
36. D) Delegates to another stream, emitting all its values (*)
37. Explanation: `yield* otherStream` emits all values from `otherStream` before continuing the generator, useful for composing streams.
38. Q6: Which constructor creates a broadcast StreamController?
39. A) StreamController.broadcast() (*)
40. B) StreamController()
41. C) StreamController.multi()
42. D) BroadcastStreamController()
43. Explanation: `StreamController.broadcast()` creates a controller whose stream supports multiple simultaneous listeners.
44. Q7: What happens if you forget to close a StreamController?
45. A) Compile error
46. B) Resource leak; listeners never see `onDone` (*)
47. C) The controller auto-closes
48. D) The stream emits null forever
49. Explanation: Not closing leaves listeners waiting for `onDone` indefinitely and can leak native resources; close in `dispose()` or when the source is exhausted.
50. Q8: What does `stream.listen(...)` return?
51. A) A Future
52. B) void
53. C) A StreamSubscription (*)
54. D) The next event
55. Explanation: `listen` returns a `StreamSubscription` you can `pause`, `resume`, or `cancel` — important for backpressure and lifecycle management.
56. Q9: Why cancel a subscription in Flutter `dispose`?
57. A) To free memory in the widget tree
58. B) To trigger a rebuild
59. C) It's optional; the GC handles it
60. D) To prevent setState-after-dispose errors and leaks (*)
61. Explanation: Subscriptions outlive their widgets; without canceling, callbacks fire on disposed widgets, throwing setState errors, and the stream source may leak.
62. Q10: What does `cancelOnError: true` do?
63. A) Cancels the subscription after the first error (*)
64. B) Suppresses all errors
65. C) Cancels the subscription immediately
66. D) Throws on subscription
67. Explanation: `listen(..., cancelOnError: true)` cancels the subscription as soon as an error event arrives; default is `false`, which keeps the subscription alive past errors.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many listeners can a single-subscription stream have?
  options:
    - Unlimited
    - Up to 10
    - Two
    - One at a time
  correctIndex: 3
  explanation: Single-subscription streams allow one listener; adding a second throws `StateError`. Use `asBroadcastStream()` or a broadcast controller for multiple listeners.
- id: q2
  question: What does `async*` produce?
  options:
    - A Stream
    - A Future
    - An Iterable
    - A Generator object
  correctIndex: 0
  explanation: "`async*` functions are async generators that return `Stream<T>`; they `yield` values as they become available."
- id: q3
  question: How do you convert a single-subscription stream to broadcast?
  options:
    - stream.broadcast()
    - stream.asBroadcastStream()
    - BroadcastStream(stream)
    - stream.toList()
  correctIndex: 1
  explanation: "`asBroadcastStream()` creates a broadcast stream that listens to the underlying single-subscription stream and forwards events to all subscribers."
- id: q4
  question: What does `await for` do?
  options:
    - Blocks the isolate
    - Cancels the stream
    - Asynchronously consumes the stream, awaiting each event
    - Returns the first event
  correctIndex: 2
  explanation: "`await for (final x in stream)` loops over stream events, awaiting each; the function is suspended between events. `break` cancels the subscription."
- id: q5
  question: What does `yield*` do in an async generator?
  options:
    - Yields a Future
    - Throws an error
    - Closes the stream
    - Delegates to another stream, emitting all its values
  correctIndex: 3
  explanation: "`yield* otherStream` emits all values from `otherStream` before continuing the generator, useful for composing streams."
- id: q6
  question: Which constructor creates a broadcast StreamController?
  options:
    - StreamController.broadcast()
    - StreamController()
    - StreamController.multi()
    - BroadcastStreamController()
  correctIndex: 0
  explanation: "`StreamController.broadcast()` creates a controller whose stream supports multiple simultaneous listeners."
- id: q7
  question: What happens if you forget to close a StreamController?
  options:
    - Compile error
    - Resource leak; listeners never see `onDone`
    - The controller auto-closes
    - The stream emits null forever
  correctIndex: 1
  explanation: Not closing leaves listeners waiting for `onDone` indefinitely and can leak native resources; close in `dispose()` or when the source is exhausted.
- id: q8
  question: What does `stream.listen(...)` return?
  options:
    - A Future
    - void
    - A StreamSubscription
    - The next event
  correctIndex: 2
  explanation: "`listen` returns a `StreamSubscription` you can `pause`, `resume`, or `cancel` — important for backpressure and lifecycle management."
- id: q9
  question: Why cancel a subscription in Flutter `dispose`?
  options:
    - To free memory in the widget tree
    - To trigger a rebuild
    - It's optional; the GC handles it
    - To prevent setState-after-dispose errors and leaks
  correctIndex: 3
  explanation: Subscriptions outlive their widgets; without canceling, callbacks fire on disposed widgets, throwing setState errors, and the stream source may leak.
- id: q10
  question: "What does `cancelOnError: true` do?"
  options:
    - Cancels the subscription after the first error
    - Suppresses all errors
    - Cancels the subscription immediately
    - Throws on subscription
  correctIndex: 0
  explanation: "`listen(..., cancelOnError: true)` cancels the subscription as soon as an error event arrives; default is `false`, which keeps the subscription alive past errors."
```

