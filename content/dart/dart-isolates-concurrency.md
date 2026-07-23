---
slug: dart-isolates-concurrency
id: dart-15
track: dart
order: 15
title: Isolates and Concurrency
description: Use Dart `Isolate`s for true parallelism — `Isolate.run`, `compute`, message passing, `SendPort`/`ReceivePort`, and when NOT to reach for isolates.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=8400s
whyItMatters: Use Dart `Isolate`s for true parallelism — `Isolate. run`, `compute`, message passing, `SendPort`/`ReceivePort`, and when NOT to reach for isolates.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Isolates and Concurrency

## Isolates and Concurrency

### Why It Matters

Use Dart `Isolate`s for true parallelism — `Isolate. run`, `compute`, message passing, `SendPort`/`ReceivePort`, and when NOT to reach for isolates.

Use Dart `Isolate`s for true parallelism — `Isolate.run`, `compute`, message passing, `SendPort`/`ReceivePort`, and when NOT to reach for isolates.

### Prerequisites

- Stage 11: Async Programming — Future, async/await
- Stage 13: Error Handling — try/catch, custom exceptions

### Topics

- The isolate model: separate heaps, no shared memory
- `Isolate.run<T>(FutureOr<T> Function() fn)` (Dart 2.19+)
- Flutter's `compute` function (wraps Isolate.run)
- `Isolate.spawn` and message passing via SendPort/ReceivePort
- Copying messages (deep copy on send; no shared references)
- When to use isolates vs async on the main isolate
- `TransferableTypedData` for zero-copy buffer transfer
- Limitations: no shared globals, slower message passing than threads

### Key Concepts

- An isolate is a Dart VM worker with its own memory and event loop; isolates communicate only by message passing.
- `Isolate.run(fn)` is the modern one-shot API: it spawns an isolate, runs `fn`, returns the result, and tears down the isolate. Use this for CPU-bound chunks.
- `compute(fn, arg)` is Flutter's wrapper; identical behavior, slightly nicer API for one-shot work.
- Messages are copied (deep) when sent between isolates — large payloads are expensive; use `TransferableTypedData` for byte buffers.
- Isolates are NOT threads: you can't share globals or mutex them. Each isolate has its own copy of statics and singletons.
- Use isolates for CPU-bound work (image processing, parsing large JSON, crypto) that would block the UI; do NOT use them for I/O (use async).

```dart
import 'dart:isolate';

int heavyCompute(int n) {
  var sum = 0;
  for (var i = 0; i < n; i++) {
    sum += i * i;
  }
  return sum;
}

Future<void> main() async {
  final result = await Isolate.run(() => heavyCompute(100000000));
  print(result); // computed in parallel, no UI jank
}
```
Caption: Isolate.run one-shot

### Common Pitfalls

- Sending closures that capture non-sendable objects — closures sent across isolates must be top-level or static, and any captured values must themselves be sendable (no open files, sockets, etc.).
- Sending large objects repeatedly — every send copies; for huge byte buffers use `TransferableTypedData` to avoid the deep copy.
- Spawning isolates for trivial work — isolate spawn has ~1-5ms overhead; if the work is shorter than the spawn, just do it on the main isolate.
- Expecting shared globals across isolates — each isolate has its own memory; statics are NOT shared. If you need shared state, message-pass it.
- Calling platform channels from background isolates — historically only the root isolate could use platform channels; Dart 3+ supports `BackgroundIsolateBinaryMessenger` but you must initialize it properly.

### Real-World Applications

- Flutter's `compute` is used by countless apps to offload JSON parsing, image decoding, and crypto onto a background isolate.
- The Hamilton app uses a long-lived isolate for parsing large offline show schedules without blocking the UI.
- Alibaba's Xianyu uses isolates for image manipulation (resizing, watermarking) before upload.
- eBay Motors uses isolates to decode high-resolution VIN barcode photos without dropping frames in the camera preview.

### Interview Questions

- 1. What is an isolate? — A Dart VM worker with its own heap and event loop; isolates communicate via message passing, never shared memory.
- 2. When should you use `Isolate.run`? — For CPU-bound work (parsing, encoding, math) that would block the main isolate; not for I/O (which is already async).
- 3. Why can't you share globals between isolates? — Each isolate has its own memory; statics are independent per isolate. Message passing is the only way to share data.
- 4. What's the difference between `Isolate.run` and `Isolate.spawn`? — `run` is one-shot (spawn, compute, tear down); `spawn` is long-lived (you keep ports open for ongoing communication).
- 5. How do you send a large byte buffer efficiently? — Use `TransferableTypedData` to avoid the deep copy on send; the buffer is moved, not copied.

### Mini Project

Build a Parallel Image Processor: A program that takes a directory of images and generates thumbnails in parallel using a pool of isolates. Use `Isolate.run` per image, with concurrency limited to N (use a simple semaphore). Time the result vs sequential processing. Suggested approach:
  - List `.jpg` files in the directory via `Directory.list`
  - Define `Uint8List makeThumbnail(Uint8List bytes)` (use `image` package)
  - Implement `Future<Uint8List> processOne(Uint8List bytes) => Isolate.run(() => makeThumbnail(bytes))`
  - Limit concurrency with a simple counter or `Pool` from `package:pool`
  - Print total elapsed time and compare to sequential

### Exercises

1. Use `Isolate.run` to compute the factorial of 50 in parallel.
2. Spawn a long-lived isolate that receives numbers and replies with their squares.
3. Send a 10MB `Uint8List` between isolates; measure the time.
4. Use `TransferableTypedData` to send the same buffer and compare timings.
5. Trigger `compute` from a Flutter app for a slow sort and observe UI smoothness.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is an isolate?
9. A) A thread with shared memory
10. B) A deprecated async primitive
11. C) A worker with its own heap and event loop (*)
12. D) A type of Future
13. Explanation: Isolates are Dart's unit of concurrency; each has independent memory and an event loop, communicating only by message passing.
14. Q2: How do isolates share data?
15. A) Shared globals
16. B) Mutex-protected fields
17. C) They can't communicate
18. D) Message passing (no shared memory) (*)
19. Explanation: Isolates have separate heaps; the only way to share data is to send a copy via SendPort/ReceivePort. No shared mutable state.
20. Q3: What does `Isolate.run(fn)` do?
21. A) Spawns an isolate, runs fn, returns the result, tears down (*)
22. B) Runs fn on the current isolate
23. C) Spawns a long-lived isolate
24. D) Cancels the current isolate
25. Explanation: `Isolate.run` is the one-shot API: spawn, compute, return result, dispose. Ideal for parallel CPU-bound chunks.
26. Q4: Why are messages copied between isolates?
27. A) For security
28. B) Because there's no shared memory to reference (*)
29. C) To enable garbage collection
30. D) Messages aren't copied
31. Explanation: Since isolates don't share a heap, the only way to deliver a message is to deep-copy it into the receiver's heap.
32. Q5: When should you NOT use an isolate?
33. A) For CPU-bound work
34. B) For image processing
35. C) For I/O-bound work (already async) (*)
36. D) For JSON parsing
37. Explanation: I/O is already async on the main isolate; spawning a worker for I/O just adds overhead. Use isolates for CPU-bound work that would block the event loop.
38. Q6: What is Flutter's `compute`?
39. A) A math library
40. B) A reactive state manager
41. C) A build system
42. D) A wrapper around Isolate.run for one-shot parallel work (*)
43. Explanation: `compute(fn, arg)` is Flutter's convenience wrapper for `Isolate.run`, returning a Future with the result. Useful for offloading heavy work in widgets.
44. Q7: What's the issue with sending a closure that captures a File?
45. A) File is not sendable; the closure can't be sent (*)
46. B) Nothing — closures can be sent
47. C) The file is closed automatically
48. D) The file is duplicated
49. Explanation: Closures sent across isolates must be top-level or static, and captured values must be sendable. Open files/sockets/sockets are not.
50. Q8: How do you avoid copying a large Uint8List?
51. A) Use List<int> instead
52. B) Use TransferableTypedData (*)
53. C) You can't — always copied
54. D) Send the file path instead
55. Explanation: `TransferableTypedData` moves the buffer between isolates without copying, critical for large buffers in image/audio processing.
56. Q9: What's the approximate overhead of spawning an isolate?
57. A) Negligible (< 1 microsecond)
58. B) ~100 milliseconds
59. C) ~1-5 milliseconds (*)
60. D) ~1 second
61. Explanation: Isolate spawn is on the order of 1-5ms; for tasks shorter than the spawn, do them on the main isolate to avoid overhead.
62. Q10: What does `BackgroundIsolateBinaryMessenger` enable?
63. A) Sharing memory between isolates
64. B) Faster message passing
65. C) Automatic isolate pooling
66. D) Calling platform channels from a background isolate (*)
67. Explanation: Dart 3+ lets background isolates call platform channels (method channels, etc.) via `BackgroundIsolateBinaryMessenger`, but it must be initialized with the root isolate's token.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is an isolate?
  options:
    - A thread with shared memory
    - A deprecated async primitive
    - A worker with its own heap and event loop
    - A type of Future
  correctIndex: 2
  explanation: Isolates are Dart's unit of concurrency; each has independent memory and an event loop, communicating only by message passing.
- id: q2
  question: How do isolates share data?
  options:
    - Shared globals
    - Mutex-protected fields
    - They can't communicate
    - Message passing (no shared memory)
  correctIndex: 3
  explanation: Isolates have separate heaps; the only way to share data is to send a copy via SendPort/ReceivePort. No shared mutable state.
- id: q3
  question: What does `Isolate.run(fn)` do?
  options:
    - Spawns an isolate, runs fn, returns the result, tears down
    - Runs fn on the current isolate
    - Spawns a long-lived isolate
    - Cancels the current isolate
  correctIndex: 0
  explanation: "`Isolate.run` is the one-shot API: spawn, compute, return result, dispose. Ideal for parallel CPU-bound chunks."
- id: q4
  question: Why are messages copied between isolates?
  options:
    - For security
    - Because there's no shared memory to reference
    - To enable garbage collection
    - Messages aren't copied
  correctIndex: 1
  explanation: Since isolates don't share a heap, the only way to deliver a message is to deep-copy it into the receiver's heap.
- id: q5
  question: When should you NOT use an isolate?
  options:
    - For CPU-bound work
    - For image processing
    - For I/O-bound work (already async)
    - For JSON parsing
  correctIndex: 2
  explanation: I/O is already async on the main isolate; spawning a worker for I/O just adds overhead. Use isolates for CPU-bound work that would block the event loop.
- id: q6
  question: What is Flutter's `compute`?
  options:
    - A math library
    - A reactive state manager
    - A build system
    - A wrapper around Isolate.run for one-shot parallel work
  correctIndex: 3
  explanation: "`compute(fn, arg)` is Flutter's convenience wrapper for `Isolate.run`, returning a Future with the result. Useful for offloading heavy work in widgets."
- id: q7
  question: What's the issue with sending a closure that captures a File?
  options:
    - File is not sendable; the closure can't be sent
    - Nothing — closures can be sent
    - The file is closed automatically
    - The file is duplicated
  correctIndex: 0
  explanation: Closures sent across isolates must be top-level or static, and captured values must be sendable. Open files/sockets/sockets are not.
- id: q8
  question: How do you avoid copying a large Uint8List?
  options:
    - Use List<int> instead
    - Use TransferableTypedData
    - You can't — always copied
    - Send the file path instead
  correctIndex: 1
  explanation: "`TransferableTypedData` moves the buffer between isolates without copying, critical for large buffers in image/audio processing."
- id: q9
  question: What's the approximate overhead of spawning an isolate?
  options:
    - Negligible (< 1 microsecond)
    - ~100 milliseconds
    - ~1-5 milliseconds
    - ~1 second
  correctIndex: 2
  explanation: Isolate spawn is on the order of 1-5ms; for tasks shorter than the spawn, do them on the main isolate to avoid overhead.
- id: q10
  question: What does `BackgroundIsolateBinaryMessenger` enable?
  options:
    - Sharing memory between isolates
    - Faster message passing
    - Automatic isolate pooling
    - Calling platform channels from a background isolate
  correctIndex: 3
  explanation: Dart 3+ lets background isolates call platform channels (method channels, etc.) via `BackgroundIsolateBinaryMessenger`, but it must be initialized with the root isolate's token.
```

