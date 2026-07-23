---
slug: nodejs-events-eventemitter
id: nodejs-08
track: nodejs
order: 8
title: Events and EventEmitter
description: Use `EventEmitter` to decouple producers and consumers, handle the special `'error'` event, avoid listener leaks, and consume events with async iterators.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=210s
whyItMatters: Use `EventEmitter` to decouple producers and consumers, handle the special `'error'` event, avoid listener leaks, and consume events with async iterators.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Events and EventEmitter

## Events and EventEmitter

### Why It Matters

Use `EventEmitter` to decouple producers and consumers, handle the special `'error'` event, avoid listener leaks, and consume events with async iterators.

Use `EventEmitter` to decouple producers and consumers, handle the special `'error'` event, avoid listener leaks, and consume events with async iterators.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (events fire between phases).

### Topics

- `EventEmitter`: `on`, `once`, `off`, `emit`, `removeListener`, `removeAllListeners`
- The special `'error'` event: throws if no listener
- `setMaxListeners` and the `MaxListenersExceededWarning`
- `prependListener`, `prependOnceListener`
- Async iteration: `events.on(emitter, 'event')` returns an AsyncIterator
- `AbortController` integration with `events.once` (Node 18+)
- `newListener` and `removeListener` events
- Memory leak pattern: adding listeners in a loop without removing them

### Key Concepts

- `EventEmitter` is the foundation of streams, http servers, and most Node APIs — master it once, recognize it everywhere.
- An emitted `'error'` event with no listener throws and crashes the process — always handle errors.
- The default `maxListeners` is 10 — exceeding it prints a warning (likely a bug, not a hard limit).
- `emit` is synchronous: listeners run in registration order, one after another, before `emit` returns.
- `events.on(emitter, 'event')` returns an async iterator you can `for await` over — useful for async pipelines.

```javascript
const { EventEmitter } = require("node:events");

const bus = new EventEmitter();

bus.on("greet", (name) => console.log(`Hello, ${name}!`));
bus.once("boot", () => console.log("System booted"));  // fires only once

bus.emit("greet", "Alice");    // Hello, Alice!
bus.emit("boot");              // System booted
bus.emit("boot");              // (nothing — once already fired)
```
Caption: Basic emitter

### Common Pitfalls

- Emitting `'error'` with no listener — Node throws the error as an uncaught exception, crashing the process; always register an error handler.
- Adding listeners in a loop without removing them — you get `MaxListenersExceededWarning` and a memory leak; reuse a single listener or use `prependListener`.
- Assuming `emit` is async — listeners run synchronously in registration order before `emit` returns; long listeners block the loop.
- Using anonymous functions as listeners then trying to remove them — `off`/`removeListener` requires the same function reference; store the handler in a variable.
- Forgetting that `once` removes the listener before calling it — if the handler throws, the error propagates and no retry is possible.

### Real-World Applications

- Every `http.Server` is an EventEmitter ('request', 'connection', 'error', 'close').
- Every stream is an EventEmitter ('data', 'end', 'error', 'close').
- The `ws` library (WebSocket) is built on EventEmitter.
- Webpack's `tapable` is a more powerful EventEmitter with async hooks; every plugin registers via `.tap()`.

### Interview Questions

- 1. What is `EventEmitter`? — A class that lets objects emit named events and register listeners; it's the foundation of streams, http servers, and most Node APIs.
- 2. What happens when an `'error'` event is emitted with no listener? — Node throws the error as an uncaught exception and the process crashes (exit code 1) — always register an error handler.
- 3. What is the default `maxListeners` value? — 10; exceeding it prints a `MaxListenersExceededWarning` (a warning, not an error — usually a sign of a leak).
- 4. How do you remove a specific listener? — Keep the function reference and pass it to `emitter.off('event', fn)` (or `removeListener`); passing a different function reference won't work.
- 5. How do you consume events with async/await? — Use `events.on(emitter, 'event')` which returns an AsyncIterator; `for await (const [arg1, arg2] of on(emitter, 'event'))` consumes them.

### Mini Project

Build a Pub/Sub Event Bus Library: A small `EventBus` class that wraps `EventEmitter`, supports topic namespacing (`bus.subscribe("user.created", fn)`), tracks listener counts per topic, and exposes an async iterator (`bus.stream("user.created")`). Suggested approach:
  - Extend `EventEmitter` and add `subscribe`, `publish`, `unsubscribe` methods
  - Track listeners in a `Map<topic, Set<fn>>` so you can report counts and clean up
  - Implement `stream(topic)` using `events.on(this, topic)` returning the async iterator
  - Add a `close()` method that removes all listeners and emits a final `'close'` event
  - Write a small demo publishing 5 events and consuming them with `for await`

### Exercises

1. Create an EventEmitter, register two listeners, emit, and observe the order they fire.
2. Emit an `'error'` event with no listener and confirm the process crashes; then add a handler.
3. Trigger the `MaxListenersExceededWarning` by adding 11 listeners; then call `setMaxListeners(20)` and verify the warning disappears.
4. Use `events.on(emitter, "tick")` to async-iterate 5 ticks emitted on a timer.
5. Build a simple in-memory pub/sub: publishers emit, subscribers listen, all on one bus.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `EventEmitter` do?
9. A) Manages async functions
10. B) Handles HTTP requests
11. C) Stores key-value pairs
12. D) Lets objects emit named events and register listeners (*)
13. Explanation: `EventEmitter` is a class for the observer pattern — emit named events, register listeners, fire them synchronously on emit.
14. Q2: What happens if you emit `'error'` with no listener?
15. A) It throws an uncaught exception and crashes the process (*)
16. B) It is silently ignored
17. C) It logs to stderr and continues
18. D) It triggers a warning
19. Explanation: The `'error'` event is special — without a listener, Node re-throws the error as an uncaught exception; always register an error handler.
20. Q3: What is the default value of `maxListeners`?
21. A) 1
22. B) 10 (*)
23. C) 5
24. D) 100
25. Explanation: The default is 10; adding more than 10 listeners prints `MaxListenersExceededWarning` (a warning, not an error — usually a leak).
26. Q4: Which method registers a listener that fires only once?
27. A) on
28. B) onceOn
29. C) once (*)
30. D) single
31. Explanation: `emitter.once('event', fn)` removes the listener before calling it, so it fires exactly once for the next event.
32. Q5: Is `emit` synchronous or asynchronous?
33. A) Asynchronous
34. B) Depends on the listener
35. C) Always async via microtasks
36. D) Synchronous (listeners run in order before emit returns) (*)
37. Explanation: `emit` calls all registered listeners synchronously in registration order; if any throws, the others after it don't run.
38. Q6: How do you remove a specific listener?
39. A) emitter.off('event', fn) with the same fn reference (*)
40. B) emitter.clear('event')
41. C) emitter.delete(fn)
42. D) You cannot remove individual listeners
43. Explanation: `emitter.off('event', fn)` (alias `removeListener`) requires the same function reference; anonymous functions can't be removed individually.
44. Q7: Which API returns an async iterator over events?
45. A) events.iterator
46. B) events.on(emitter, 'event') (*)
47. C) emitter.async()
48. D) emitter.subscribe()
49. Explanation: `events.on(emitter, 'event')` returns an AsyncIterator; use `for await (const [args] of events.on(emitter, 'event'))`.
50. Q8: Which is a common listener leak pattern?
51. A) Using `once` for one-shot events
52. B) Storing listeners in variables
53. C) Adding listeners in a loop without removing them (*)
54. D) Setting maxListeners high
55. Explanation: Adding a new listener per request/iteration without removing the old ones grows the listener array indefinitely — a classic memory leak.
56. Q9: Which event fires when a new listener is added?
57. A) addListener
58. B) onAdd
59. C) listenerAdd
60. D) newListener (*)
61. Explanation: `EventEmitter` emits `'newListener'` (before the listener is added) and `'removeListener'` (after removal) — useful for instrumentation.
62. Q10: Which Node core module is built on EventEmitter?
63. A) All of: http servers, streams, fs watchers (*)
64. B) Only http
65. C) Only streams
66. D) None — they use a different pattern
67. Explanation: `http.Server`, `stream.Readable`/`Writable`, and `fs.FSWatcher` all extend `EventEmitter` — learn it once, see it everywhere.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `EventEmitter` do?
  options:
    - Manages async functions
    - Handles HTTP requests
    - Stores key-value pairs
    - Lets objects emit named events and register listeners
  correctIndex: 3
  explanation: "`EventEmitter` is a class for the observer pattern — emit named events, register listeners, fire them synchronously on emit."
- id: q2
  question: What happens if you emit `'error'` with no listener?
  options:
    - It throws an uncaught exception and crashes the process
    - It is silently ignored
    - It logs to stderr and continues
    - It triggers a warning
  correctIndex: 0
  explanation: The `'error'` event is special — without a listener, Node re-throws the error as an uncaught exception; always register an error handler.
- id: q3
  question: What is the default value of `maxListeners`?
  options:
    - "1"
    - "10"
    - "5"
    - "100"
  correctIndex: 1
  explanation: The default is 10; adding more than 10 listeners prints `MaxListenersExceededWarning` (a warning, not an error — usually a leak).
- id: q4
  question: Which method registers a listener that fires only once?
  options:
    - on
    - onceOn
    - once
    - single
  correctIndex: 2
  explanation: "`emitter.once('event', fn)` removes the listener before calling it, so it fires exactly once for the next event."
- id: q5
  question: Is `emit` synchronous or asynchronous?
  options:
    - Asynchronous
    - Depends on the listener
    - Always async via microtasks
    - Synchronous (listeners run in order before emit returns)
  correctIndex: 3
  explanation: "`emit` calls all registered listeners synchronously in registration order; if any throws, the others after it don't run."
- id: q6
  question: How do you remove a specific listener?
  options:
    - emitter.off('event', fn) with the same fn reference
    - emitter.clear('event')
    - emitter.delete(fn)
    - You cannot remove individual listeners
  correctIndex: 0
  explanation: "`emitter.off('event', fn)` (alias `removeListener`) requires the same function reference; anonymous functions can't be removed individually."
- id: q7
  question: Which API returns an async iterator over events?
  options:
    - events.iterator
    - events.on(emitter, 'event')
    - emitter.async()
    - emitter.subscribe()
  correctIndex: 1
  explanation: "`events.on(emitter, 'event')` returns an AsyncIterator; use `for await (const [args] of events.on(emitter, 'event'))`."
- id: q8
  question: Which is a common listener leak pattern?
  options:
    - Using `once` for one-shot events
    - Storing listeners in variables
    - Adding listeners in a loop without removing them
    - Setting maxListeners high
  correctIndex: 2
  explanation: Adding a new listener per request/iteration without removing the old ones grows the listener array indefinitely — a classic memory leak.
- id: q9
  question: Which event fires when a new listener is added?
  options:
    - addListener
    - onAdd
    - listenerAdd
    - newListener
  correctIndex: 3
  explanation: "`EventEmitter` emits `'newListener'` (before the listener is added) and `'removeListener'` (after removal) — useful for instrumentation."
- id: q10
  question: Which Node core module is built on EventEmitter?
  options:
    - "All of: http servers, streams, fs watchers"
    - Only http
    - Only streams
    - None — they use a different pattern
  correctIndex: 0
  explanation: "`http.Server`, `stream.Readable`/`Writable`, and `fs.FSWatcher` all extend `EventEmitter` — learn it once, see it everywhere."
```

