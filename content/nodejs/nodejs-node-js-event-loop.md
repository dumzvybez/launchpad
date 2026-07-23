---
slug: nodejs-node-js-event-loop
id: nodejs-02
track: nodejs
order: 2
title: The Node.js Event Loop
description: Master the six phases of the Node event loop, the microtask queues (nextTick and Promise), and why a single blocking call freezes the entire process.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=30s
whyItMatters: Master the six phases of the Node event loop, the microtask queues (nextTick and Promise), and why a single blocking call freezes the entire process.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# The Node.js Event Loop

## The Node.js Event Loop

### Why It Matters

Master the six phases of the Node event loop, the microtask queues (nextTick and Promise), and why a single blocking call freezes the entire process.

Master the six phases of the Node event loop, the microtask queues (nextTick and Promise), and why a single blocking call freezes the entire process.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Comfort running `node script.js` and basic JavaScript syntax.

### Topics

- The six phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks
- Microtask queues: `process.nextTick` vs `Promise.then`
- `setImmediate` (check phase) vs `setTimeout(0)` (timers phase)
- I/O polling and how callbacks get queued
- Blocking the loop with sync fs/crypto/JSON.parse on big payloads
- `queueMicrotask`, `setImmediate`, `setTimeout` ordering rules
- Detecting event-loop lag with `perf_hooks.monitorEventLoopDelay`
- Why CPU-bound work freezes the entire process

### Key Concepts

- The loop runs phases in order each "tick": timers → pending → poll → check → close.
- Microtasks (`process.nextTick` and Promises) drain between every phase, before the next macrotask.
- `process.nextTick` fires before `Promise.then` (nextTick queue is drained first).
- A blocking call (e.g. `fs.readFileSync` on a 1GB file) blocks the entire process — no other request is served.
- `setImmediate` and `setTimeout(0)` ordering is non-deterministic in the main module but `setImmediate` always fires first inside an I/O callback.

```javascript
console.log("1: start");

setImmediate(() => console.log("5: setImmediate (check phase)"));
setTimeout(() => console.log("3: setTimeout 0 (timers phase)"), 0);
Promise.resolve().then(() => console.log("2: promise (microtask)"));
process.nextTick(() => console.log("2.5: nextTick (before promises)"));

console.log("4: end of script");

// Typical output: 1, 4, 2.5, 2, 3, 5 (timers/check order varies in main module)
```
Caption: Phase ordering

### Common Pitfalls

- Calling `JSON.parse` on a 50MB string in a request handler — blocks the loop for hundreds of ms; chunk-parse with `stream-json` or move to a worker.
- Infinite recursion in `process.nextTick` — every nextTick reschedules another, starving I/O; you get `RangeError: Maximum call stack size exceeded` or just hang.
- Assuming `setTimeout(fn, 0)` fires immediately — the minimum is ~1ms (clamped by Node), and timers fire in the next tick's timers phase, not synchronously.
- Running sync `crypto.pbkdf2Sync` or `bcrypt.compareSync` on the main thread — uses libuv thread pool only for async versions; sync blocks the loop.
- CPU-heavy work inside `setImmediate` thinking it's "background" — setImmediate runs on the main thread, just in the check phase; use `worker_threads` for real CPU work.

### Real-World Applications

- Netflix's API gateway relies on a non-blocking event loop to multiplex thousands of fan-out requests per process to backend services.
- Uber's matching engine uses Node's event loop for async I/O multiplexing over its geo-indexed lookup services.
- Trello's real-time push layer uses long-polling on Node, holding thousands of connections open per process via the event loop.
- Walmart's Black Friday traffic relies on Node's ability to hold thousands of idle connections cheaply (no per-thread overhead).

### Interview Questions

- 1. Name the six phases of the Node event loop in order — timers, pending callbacks, idle/prepare, poll, check, close callbacks.
- 2. What's the difference between `process.nextTick` and `Promise.then`? — Both are microtasks, but nextTick has its own queue that drains completely before the Promise microtask queue, so nextTick callbacks fire first.
- 3. Why does `setImmediate` always fire before `setTimeout(0)` inside an I/O callback but not in the main module? — In the main module the timers phase already ran by the time the I/O callback is scheduled; inside an I/O callback we're past the poll phase, so check (setImmediate) runs before the next timers phase.
- 4. How do you detect that your event loop is blocked? — Use `perf_hooks.monitorEventLoopDelay` for histogram data, or `clinic.js doctor` for a flamegraph-aware report.
- 5. What happens if you call a synchronous fs/crypto operation in an HTTP request handler? — The entire process blocks until it completes; no other request can be served, causing p99 latency spikes.

### Mini Project

Build an Event Loop Visualizer CLI: A script that prints the order in which `setTimeout`, `setImmediate`, `Promise.then`, `process.nextTick`, and `queueMicrotask` callbacks fire, both at the top level and inside a `fs.readFile` callback, so the learner can see phase ordering empirically. Suggested approach:
  - Create `loop.js` that logs each callback with a label
  - Schedule timers, setImmediate, promises, nextTicks, microtasks
  - Wrap the same scheduling inside a `fs.readFile` callback to show the difference
  - Run with `node loop.js` and document the output in a comment
  - Add a `--io` flag to print the I/O-callback version side-by-side

### Exercises

1. Write a script that schedules `setTimeout(0)`, `setImmediate`, and `Promise.resolve().then` at the top level and predict the order before running.
2. Move the same scheduling inside an `fs.readFile` callback and verify `setImmediate` now reliably fires before `setTimeout(0)`.
3. Use `monitorEventLoopDelay` to log p50/p99 every 5s while running a tight `while` loop in another script; observe the lag.
4. Demonstrate nextTick starvation by recursively calling `process.nextTick` in a tight loop; observe that a `setTimeout(0)` never fires.
5. >>> QUIZ (Stage 2) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How many phases does the Node event loop have?
8. A) 4
9. B) 6 (*)
10. C) 8
11. D) 12
12. Explanation: Node's event loop has six phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks.
13. Q2: In which phase does `setImmediate` fire?
14. A) Timers
15. B) Pending callbacks
16. C) Check (*)
17. D) Poll
18. Explanation: `setImmediate` schedules a callback in the "check" phase, which runs after the poll phase.
19. Q3: Which fires first: `process.nextTick` or `Promise.then`?
20. A) Promise.then
21. B) They fire simultaneously
22. C) Order is non-deterministic
23. D) process.nextTick (*)
24. Explanation: Both are microtasks, but the nextTick queue is drained fully before the Promise microtask queue, so nextTick fires first.
25. Q4: Inside an I/O callback, which fires first: `setTimeout(0)` or `setImmediate`?
26. A) setImmediate (*)
27. B) setTimeout(0)
28. C) Always the same time
29. D) Depends on CPU speed
30. Explanation: After I/O, the check phase runs before the next timers phase, so setImmediate reliably beats setTimeout(0) inside I/O callbacks.
31. Q5: What happens if you call `fs.readFileSync` on a 1GB file in a request handler?
32. A) Node spawns a new thread for it
33. B) The event loop is blocked for the duration of the read (*)
34. C) libuv queues it asynchronously
35. D) An error is thrown immediately
36. Explanation: `*Sync` methods run on the main thread and block the loop; no other callback can fire until they return.
37. Q6: Which tool measures event loop lag with a histogram?
38. A) node --inspect
39. B) console.time
40. C) monitorEventLoopDelay from perf_hooks (*)
41. D) util.inspect
42. Explanation: `perf_hooks.monitorEventLoopDelay()` returns a histogram of delays between event loop ticks.
43. Q7: What does recursive `process.nextTick` cause?
44. A) Nothing; it's safe
45. B) Stack overflow immediately
46. C) Automatic throttling by Node
47. D) I/O starvation (the loop never reaches the poll phase) (*)
48. Explanation: Each nextTick schedules another in the same microtask drain; the loop never advances to the next phase, starving I/O.
49. Q8: When are microtasks drained?
50. A) Between every event-loop phase and before each macrotask (*)
51. B) Only at the end of the program
52. C) Once per second
53. D) Only when the queue hits 1000 items
54. Explanation: Microtasks drain fully between phases and after each macrotask, before control returns to the next phase.
55. Q9: What is the minimum delay for `setTimeout(fn, 0)` in Node?
56. A) 0 ms exactly
57. B) ~1 ms (clamped) (*)
58. C) 16 ms
59. D) 100 ms
60. Explanation: Node clamps `setTimeout` with 0 delay to about 1ms (configurable), and the callback fires in the next tick's timers phase.
61. Q10: Why doesn't CPU-bound work belong on the main thread?
62. A) It uses too much memory
63. B) Node forbids it
64. C) The main thread is single-threaded; CPU work blocks the loop (*)
65. D) It triggers GC
66. Explanation: A tight `while` loop on the main thread prevents the loop from processing I/O callbacks, causing every active request to stall.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many phases does the Node event loop have?
  options:
    - "4"
    - "6"
    - "8"
    - "12"
  correctIndex: 1
  explanation: "Node's event loop has six phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks."
- id: q2
  question: In which phase does `setImmediate` fire?
  options:
    - Timers
    - Pending callbacks
    - Check
    - Poll
  correctIndex: 2
  explanation: '`setImmediate` schedules a callback in the "check" phase, which runs after the poll phase.'
- id: q3
  question: "Which fires first: `process.nextTick` or `Promise.then`?"
  options:
    - Promise.then
    - They fire simultaneously
    - Order is non-deterministic
    - process.nextTick
  correctIndex: 3
  explanation: Both are microtasks, but the nextTick queue is drained fully before the Promise microtask queue, so nextTick fires first.
- id: q4
  question: "Inside an I/O callback, which fires first: `setTimeout(0)` or `setImmediate`?"
  options:
    - setImmediate
    - setTimeout(0)
    - Always the same time
    - Depends on CPU speed
  correctIndex: 0
  explanation: After I/O, the check phase runs before the next timers phase, so setImmediate reliably beats setTimeout(0) inside I/O callbacks.
- id: q5
  question: What happens if you call `fs.readFileSync` on a 1GB file in a request handler?
  options:
    - Node spawns a new thread for it
    - The event loop is blocked for the duration of the read
    - libuv queues it asynchronously
    - An error is thrown immediately
  correctIndex: 1
  explanation: "`*Sync` methods run on the main thread and block the loop; no other callback can fire until they return."
- id: q6
  question: Which tool measures event loop lag with a histogram?
  options:
    - node --inspect
    - console.time
    - monitorEventLoopDelay from perf_hooks
    - util.inspect
  correctIndex: 2
  explanation: "`perf_hooks.monitorEventLoopDelay()` returns a histogram of delays between event loop ticks."
- id: q7
  question: What does recursive `process.nextTick` cause?
  options:
    - Nothing; it's safe
    - Stack overflow immediately
    - Automatic throttling by Node
    - I/O starvation (the loop never reaches the poll phase)
  correctIndex: 3
  explanation: Each nextTick schedules another in the same microtask drain; the loop never advances to the next phase, starving I/O.
- id: q8
  question: When are microtasks drained?
  options:
    - Between every event-loop phase and before each macrotask
    - Only at the end of the program
    - Once per second
    - Only when the queue hits 1000 items
  correctIndex: 0
  explanation: Microtasks drain fully between phases and after each macrotask, before control returns to the next phase.
- id: q9
  question: What is the minimum delay for `setTimeout(fn, 0)` in Node?
  options:
    - 0 ms exactly
    - ~1 ms (clamped)
    - 16 ms
    - 100 ms
  correctIndex: 1
  explanation: Node clamps `setTimeout` with 0 delay to about 1ms (configurable), and the callback fires in the next tick's timers phase.
- id: q10
  question: Why doesn't CPU-bound work belong on the main thread?
  options:
    - It uses too much memory
    - Node forbids it
    - The main thread is single-threaded; CPU work blocks the loop
    - It triggers GC
  correctIndex: 2
  explanation: A tight `while` loop on the main thread prevents the loop from processing I/O callbacks, causing every active request to stall.
```

