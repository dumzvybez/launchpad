---
slug: nodejs-worker-threads-cpu-bound-work
id: nodejs-13
track: nodejs
order: 13
title: Worker Threads for CPU-Bound Work
description: Offload CPU-bound work (crypto, image processing, parsing) to worker threads, share memory with `SharedArrayBuffer` + `Atomics`, and pool workers for high throughput.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=120s
whyItMatters: Offload CPU-bound work (crypto, image processing, parsing) to worker threads, share memory with `SharedArrayBuffer` + `Atomics`, and pool workers for high throughput.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Worker Threads for CPU-Bound Work

## Worker Threads for CPU-Bound Work

### Why It Matters

Offload CPU-bound work (crypto, image processing, parsing) to worker threads, share memory with `SharedArrayBuffer` + `Atomics`, and pool workers for high throughput.

Offload CPU-bound work (crypto, image processing, parsing) to worker threads, share memory with `SharedArrayBuffer` + `Atomics`, and pool workers for high throughput.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (why CPU work blocks).
- Stage 7: Buffers and Binary Data (ArrayBuffer transfer).

### Topics

- `worker_threads`: `Worker`, `parentPort`, `workerData`
- Spawning a worker and message passing
- `MessageChannel` for direct port-to-port communication
- `SharedArrayBuffer` + `Atomics` for zero-copy shared memory
- `transferList` (move ownership of ArrayBuffer instead of cloning)
- Worker pool pattern (reuse workers instead of spawn-per-task)
- `worker.terminate()` and graceful worker shutdown
- Why worker_threads vs child_process (threads share memory; processes don't)

### Key Concepts

- `worker_threads` run JS in parallel OS threads within the same process — true parallelism for CPU-bound work.
- Data passed via `postMessage` is structured-cloned (deep copied); large data should be transferred via `transferList` (zero-copy move).
- `SharedArrayBuffer` allows multiple threads to read/write the same memory; `Atomics` provides atomic operations and synchronization.
- Spawning a worker has overhead (~10ms); use a worker pool to reuse workers across many tasks.
- Workers have their own event loop and V8 isolate; they don't share JS state (closures, globals) with the parent.

```javascript
// worker.js
const { parentPort, workerData } = require("node:worker_threads");

parentPort.on("message", (n) => {
  const result = heavyFib(n);
  parentPort.postMessage(result);
});

function heavyFib(n) {
  if (n < 2) return n;
  return heavyFib(n - 1) + heavyFib(n - 2);
}

// main.js
const { Worker } = require("node:worker_threads");
const worker = new Worker("./worker.js");

worker.on("message", (result) => console.log("fib =", result));
worker.postMessage(40);
```
Caption: Simple worker

### Common Pitfalls

- Spawning a worker per request — start-up overhead (~10ms) kills throughput; use a worker pool that reuses workers across tasks.
- Structured-cloning large data via `postMessage` — for big ArrayBuffers, use `transferList` (zero-copy move) or `SharedArrayBuffer` (shared memory).
- Forgetting to `worker.terminate()` on shutdown — workers keep the process alive (they're references); track and terminate them in your shutdown handler.
- Assuming `workerData` is shared — it's structured-cloned at worker start; for shared state, pass a `SharedArrayBuffer`.
- Calling sync code (`Atomics.wait`) on the main thread — it blocks the event loop; only call `Atomics.wait` inside a worker.

### Real-World Applications

- Jest uses worker_threads (and child_process fallback) to run test files in parallel.
- Image processing services use workers to offload `sharp`/`jimp` work from the main thread.
- Babel and TypeScript compile in worker pools for faster CI builds (`thread-loader`, `ts-node` workers).
- Webpack's `terser-webpack-plugin` runs minification in worker threads for parallelism.

### Interview Questions

- 1. When would you use `worker_threads` vs the cluster module? — Use `worker_threads` for CPU-bound work that benefits from shared memory (one process, multiple OS threads); use cluster for HTTP load-balancing across processes (each with its own event loop).
- 2. How do you share memory between worker threads? — Use `SharedArrayBuffer` (a fixed-size block of memory) with `Atomics` for safe atomic operations; both parent and worker create typed array views over the same buffer.
- 3. What is `transferList` in `postMessage`? — A list of `ArrayBuffer`s to move (zero-copy) instead of clone; the sender's reference is "neutered" (byteLength becomes 0).
- 4. What's the cost of spawning a worker? — Roughly 5-20ms of startup; for many small tasks, use a worker pool that reuses workers.
- 5. Why can't workers share JS state (closures, globals) with the parent? — Each worker has its own V8 isolate and event loop; only structured data and SharedArrayBuffer are shared, not JS object graphs.

### Mini Project

Build a Parallel Image Hasher: A CLI that takes a directory of images and computes a perceptual hash (pHash) of each in parallel using a worker pool of 4 workers. Suggested approach:
  - List `.jpg`/`.png` files in the directory with `fs.readdir`
  - Create a `WorkerPool` with 4 workers running `phash-worker.js`
  - For each file, post a message with the file path; the worker reads, resizes, and hashes
  - Collect results with `Promise.all` and print `{ file, hash, elapsedMs }`
  - Compare elapsed time vs a sequential single-threaded version

### Exercises

1. Build a worker that computes the 40th Fibonacci number and posts the result back.
2. Extend it to a pool of 4 workers; submit 10 tasks and observe parallel execution.
3. Use `SharedArrayBuffer` + `Atomics` to share a counter incremented by 2 workers.
4. Transfer a 1MB ArrayBuffer to a worker; verify `byteLength` is 0 on the parent after.
5. Implement `Atomics.wait`/`notify` between two workers to coordinate a producer/consumer.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What do `worker_threads` provide?
9. A) Parallel OS threads within one process for CPU work (*)
10. B) Multiple Node processes
11. C) Faster I/O
12. D) An alternative to async/await
13. Explanation: `worker_threads` run JavaScript in parallel OS threads within the same process — true parallelism for CPU-bound work like crypto and image processing.
14. Q2: How is data passed via `postMessage` by default?
15. A) Shared by reference
16. B) Structured-cloned (deep copied) (*)
17. C) Sent as a string
18. D) Converted to JSON
19. Explanation: By default, `postMessage` structured-clones the data (a deep copy); for large ArrayBuffers, pass them in `transferList` for a zero-copy move.
20. Q3: How do you share memory between workers?
21. A) Use a global variable
22. B) Use postMessage with a Buffer
23. C) Use SharedArrayBuffer + Atomics (*)
24. D) You can't share memory
25. Explanation: `SharedArrayBuffer` is a fixed-size block of memory shared across threads; `Atomics` provides atomic operations and synchronization primitives.
26. Q4: What does `transferList` do in `postMessage`?
27. A) Clones an ArrayBuffer
28. B) Shares the ArrayBuffer
29. C) Compresses the ArrayBuffer
30. D) Moves an ArrayBuffer (zero-copy); sender's reference is neutered (*)
31. Explanation: `postMessage(data, [buf])` moves the ArrayBuffer to the receiver; the sender's `buf.byteLength` becomes 0 — zero-copy transfer.
32. Q5: Why use a worker pool instead of spawning a worker per task?
33. A) Spawning is slow (~10ms overhead); reuse workers across tasks (*)
34. B) Workers can't be spawned at runtime
35. C) Node limits you to 4 workers
36. D) Pools use less memory per task
37. Explanation: Worker startup has ~5-20ms overhead; a pool reuses workers across many tasks to amortize the cost and maximize throughput.
38. Q6: Can workers share JS closures or globals with the parent?
39. A) Yes, automatically
40. B) No — each worker has its own V8 isolate; only structured data and SharedArrayBuffer are shared (*)
41. C) Only globals
42. D) Only closures
43. Explanation: Each worker has its own V8 isolate and event loop; you cannot share closures, modules, or globals — only structured-cloned data and `SharedArrayBuffer`.
44. Q7: Which function blocks until a memory location changes?
45. A) Atomics.load
46. B) Atomics.store
47. C) Atomics.wait (*)
48. D) Atomics.notify
49. Explanation: `Atomics.wait(view, index, expected)` blocks the calling thread until the value at `view[index]` changes; only safe to call inside a worker (not the main thread).
50. Q8: How do you stop a worker?
51. A) worker.stop()
52. B) worker.kill()
53. C) worker.exit()
54. D) worker.terminate() (*)
55. Explanation: `worker.terminate()` stops the worker immediately; for graceful shutdown, send a "shutdown" message and let the worker exit itself.
56. Q9: Where does `workerData` come from in the worker?
57. A) Passed via `new Worker(script, { workerData: ... })`; available as a global import in the worker (*)
58. B) Imported from `node:worker_threads`
59. C) Read from process.env
60. D) Always undefined
61. Explanation: `new Worker(s, { workerData: x })` passes `x` (structured-cloned) to the worker, where it's available via `const { workerData } = require("worker_threads")`.
62. Q10: When should you use worker_threads vs the cluster module?
63. A) Always cluster
64. B) Worker_threads for CPU work with shared memory; cluster for HTTP load balancing across processes (*)
65. C) Always worker_threads
66. D) They are interchangeable
67. Explanation: Worker threads share memory and are good for CPU-bound tasks; cluster spawns separate processes (each with its own event loop) and is good for HTTP load balancing.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What do `worker_threads` provide?
  options:
    - Parallel OS threads within one process for CPU work
    - Multiple Node processes
    - Faster I/O
    - An alternative to async/await
  correctIndex: 0
  explanation: "`worker_threads` run JavaScript in parallel OS threads within the same process — true parallelism for CPU-bound work like crypto and image processing."
- id: q2
  question: How is data passed via `postMessage` by default?
  options:
    - Shared by reference
    - Structured-cloned (deep copied)
    - Sent as a string
    - Converted to JSON
  correctIndex: 1
  explanation: By default, `postMessage` structured-clones the data (a deep copy); for large ArrayBuffers, pass them in `transferList` for a zero-copy move.
- id: q3
  question: How do you share memory between workers?
  options:
    - Use a global variable
    - Use postMessage with a Buffer
    - Use SharedArrayBuffer + Atomics
    - You can't share memory
  correctIndex: 2
  explanation: "`SharedArrayBuffer` is a fixed-size block of memory shared across threads; `Atomics` provides atomic operations and synchronization primitives."
- id: q4
  question: What does `transferList` do in `postMessage`?
  options:
    - Clones an ArrayBuffer
    - Shares the ArrayBuffer
    - Compresses the ArrayBuffer
    - Moves an ArrayBuffer (zero-copy); sender's reference is neutered
  correctIndex: 3
  explanation: "`postMessage(data, [buf])` moves the ArrayBuffer to the receiver; the sender's `buf.byteLength` becomes 0 — zero-copy transfer."
- id: q5
  question: Why use a worker pool instead of spawning a worker per task?
  options:
    - Spawning is slow (~10ms overhead); reuse workers across tasks
    - Workers can't be spawned at runtime
    - Node limits you to 4 workers
    - Pools use less memory per task
  correctIndex: 0
  explanation: Worker startup has ~5-20ms overhead; a pool reuses workers across many tasks to amortize the cost and maximize throughput.
- id: q6
  question: Can workers share JS closures or globals with the parent?
  options:
    - Yes, automatically
    - No — each worker has its own V8 isolate; only structured data and SharedArrayBuffer are shared
    - Only globals
    - Only closures
  correctIndex: 1
  explanation: Each worker has its own V8 isolate and event loop; you cannot share closures, modules, or globals — only structured-cloned data and `SharedArrayBuffer`.
- id: q7
  question: Which function blocks until a memory location changes?
  options:
    - Atomics.load
    - Atomics.store
    - Atomics.wait
    - Atomics.notify
  correctIndex: 2
  explanation: "`Atomics.wait(view, index, expected)` blocks the calling thread until the value at `view[index]` changes; only safe to call inside a worker (not the main thread)."
- id: q8
  question: How do you stop a worker?
  options:
    - worker.stop()
    - worker.kill()
    - worker.exit()
    - worker.terminate()
  correctIndex: 3
  explanation: '`worker.terminate()` stops the worker immediately; for graceful shutdown, send a "shutdown" message and let the worker exit itself.'
- id: q9
  question: Where does `workerData` come from in the worker?
  options:
    - "Passed via `new Worker(script, { workerData: ... })`; available as a global import in the worker"
    - Imported from `node:worker_threads`
    - Read from process.env
    - Always undefined
  correctIndex: 0
  explanation: "`new Worker(s, { workerData: x })` passes `x` (structured-cloned) to the worker, where it's available via `const { workerData } = require(\"worker_threads\")`."
- id: q10
  question: When should you use worker_threads vs the cluster module?
  options:
    - Always cluster
    - Worker_threads for CPU work with shared memory; cluster for HTTP load balancing across processes
    - Always worker_threads
    - They are interchangeable
  correctIndex: 1
  explanation: Worker threads share memory and are good for CPU-bound tasks; cluster spawns separate processes (each with its own event loop) and is good for HTTP load balancing.
```

