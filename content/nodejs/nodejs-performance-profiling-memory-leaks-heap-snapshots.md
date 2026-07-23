---
slug: nodejs-performance-profiling-memory-leaks-heap-snapshots
id: nodejs-19
track: nodejs
order: 19
title: Performance — Profiling, Memory Leaks, Heap Snapshots
description: Diagnose event-loop blocking with `clinic.js`, profile CPU usage, take heap snapshots to find memory leaks, and tune V8's garbage collector for production.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=480s
whyItMatters: Diagnose event-loop blocking with `clinic. js`, profile CPU usage, take heap snapshots to find memory leaks, and tune V8's garbage collector for production.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Performance — Profiling, Memory Leaks, Heap Snapshots

## Performance — Profiling, Memory Leaks, Heap Snapshots

### Why It Matters

Diagnose event-loop blocking with `clinic. js`, profile CPU usage, take heap snapshots to find memory leaks, and tune V8's garbage collector for production.

Diagnose event-loop blocking with `clinic.js`, profile CPU usage, take heap snapshots to find memory leaks, and tune V8's garbage collector for production.

### Prerequisites

- Stage 2: The Node.js Event Loop (detecting lag).
- Stage 8: Events and EventEmitter (listener leaks).
- Stage 6: Streams (backpressure).

### Topics

- `clinic.js doctor` — detects event-loop blocking and CPU-heavy paths
- `clinic.js flame` and `0x` — flamegraphs for CPU profiling
- `--inspect` with Chrome DevTools — CPU profile, heap snapshot, allocation timeline
- `--cpu-prof` and `--heap-prof` flags — write profiles to disk
- `perf_hooks.monitorEventLoopDelay` — measure loop lag in production
- Memory leak patterns: closures, EventEmitter listener pile-up, growing Maps/arrays
- `--max-old-space-size` to raise V8 heap limit
- `process.memoryUsage()` and `--expose-gc` for manual GC

### Key Concepts

- `clinic.js doctor` runs your server under load and reports if the event loop is blocked and where (sync fs, JSON.parse on big payloads, regex backtracking).
- A heap snapshot is a point-in-time dump of every JS object on the V8 heap; comparing two snapshots shows what's retained (the leak).
- Closures retaining large objects are the most common leak — a callback that closes over `req` keeps it alive forever.
- EventEmitter listener pile-up (adding listeners per request without removing) leaks memory and triggers `MaxListenersExceededWarning`.
- `--max-old-space-size=4096` raises V8's old-generation heap to 4GB (default ~2GB on 64-bit); use for memory-heavy workloads.

```bash
# Install once
npm install -g clinic

# Profile a server under load
clinic doctor --on-port 'autocannon -c 50 -d 30 http://localhost:3000' -- node server.js

# clinic opens a report: event-loop utilization, CPU, GC, I/O delay
# Recommendations: "CPU bound", "I/O wait", "Event loop blocked"
```
Caption: clinic.js doctor

### Common Pitfalls

- Closures retaining large objects — a callback that closes over `req` (with a big body) keeps the whole request alive; clear references or use weak refs.
- EventEmitter listener pile-up — `emitter.on("data", fn)` per request without `off` grows the listener array indefinitely; reuse a single listener.
- `setInterval`/`setTimeout` not cleared — keeping timers alive keeps their callbacks (and closures) alive; clear them on shutdown.
- Streams not destroyed — an errored Readable keeps the source open; use `pipeline` or `stream.destroy()` in error handlers.
- Growing Maps/Arrays without bounds — a cache with no eviction grows forever; use an LRU (`lru-cache`) with a size limit.

### Real-World Applications

- Netflix uses `clinic.js` to debug Node services in production staging.
- Uber uses `0x` flamegraphs to find CPU hotspots in their matching engine.
- PayPal profiles its Node API gateway with Chrome DevTools' CPU profiler.
- Sentry's Node SDK captures heap snapshots and leaks reports from production.

### Interview Questions

- 1. How do you find a memory leak in Node? — Take two heap snapshots (Chrome DevTools or `writeHeapSnapshot`), exercise the workload, take a third, and compare — retained objects between snapshots are the leak.
- 2. What is `clinic.js doctor`? — A diagnostic tool that runs your server under load and reports event-loop blocking, CPU usage, and I/O patterns with recommendations.
- 3. How do you profile CPU in Node? — Use `node --inspect` + Chrome DevTools Profiler, or `--cpu-prof` flag to write a `.cpuprofile` to disk; visualize with `clinic flame` or `0x`.
- 4. What is event loop lag and how do you measure it? — Delay between when a callback should fire and when it actually does; measure with `perf_hooks.monitorEventLoopDelay()` (p50, p99, max).
- 5. How do you raise V8's heap limit? — `node --max-old-space-size=4096 app.js` raises the old-generation heap to 4GB; default is ~2GB on 64-bit. Use only if you genuinely need more memory.

### Mini Project

Build a Memory Leak Detective Tool: A script that takes a heap snapshot, runs a workload N times, takes another snapshot, and prints the top 10 retained object types between them. Suggested approach:
  - Use `writeHeapSnapshot` from `node:v8`
  - Take an initial snapshot, then call a leaky function (e.g. one that pushes to a global array) 1000 times
  - Take a second snapshot, parse both as JSON, compare retained objects by type
  - Print top 10 types with the largest delta (e.g. "Array: +50000")
  - Add a `--gc` flag that calls `global.gc()` between runs (requires `--expose-gc`)

### Exercises

1. Run `clinic.js doctor` against an Express server with a deliberately slow sync handler; read the report.
2. Use `node --inspect` to take a CPU profile while running `autocannon` against the server.
3. Use `writeHeapSnapshot()` to dump two snapshots and compare in Chrome DevTools.
4. Add `monitorEventLoopDelay` logging to a server; observe p99 under load.
5. Introduce a closure-retained leak (callback closing over `req`) and confirm via heap snapshot diff.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which tool detects event-loop blocking under load?
9. A) eslint
10. B) prettier
11. C) clinic.js doctor (*)
12. D) nodemon
13. Explanation: `clinic doctor --on-port '...' -- node server.js` runs your server under load and reports event-loop utilization, CPU, GC, and I/O delay with recommendations.
14. Q2: How do you take a heap snapshot programmatically?
15. A) `process.heapSnapshot()`
16. B) `console.snapshot()`
17. C) `v8.snap()`
18. D) `writeHeapSnapshot()` from `node:v8` (*)
19. Explanation: `require("node:v8").writeHeapSnapshot()` writes a `.heapsnapshot` file you can load in Chrome DevTools (Memory tab) to inspect retained objects.
20. Q3: Which is the most common memory leak pattern in Node?
21. A) Closures retaining large objects (e.g. callback closes over `req`) (*)
22. B) Using const instead of let
23. C) Using too many imports
24. D) Sync fs calls
25. Explanation: A callback that closes over a large object (like `req` with a big body) keeps that object alive as long as the callback exists; clear references or use weak refs.
26. Q4: How do you raise V8's old-generation heap limit?
27. A) `NODE_HEAP=4096`
28. B) `--max-old-space-size=4096` (*)
29. C) `--heap-size=4gb`
30. D) You can't
31. Explanation: `node --max-old-space-size=4096 app.js` raises the old-gen heap to 4GB (default ~2GB on 64-bit); use only if you genuinely need more memory.
32. Q5: What does `monitorEventLoopDelay` measure?
33. A) Heap usage
34. B) CPU percentage
35. C) Delay between when a callback should fire and when it does (*)
36. D) Number of open handles
37. Explanation: `perf_hooks.monitorEventLoopDelay()` returns a histogram of loop-tick delays; p99 > 10ms typically indicates blocking.
38. Q6: Which EventEmitter pattern causes leaks?
39. A) Using `once` for one-shot events
40. B) Storing listeners in variables
41. C) Setting maxListeners
42. D) Adding listeners per request without removing them (*)
43. Explanation: `emitter.on("data", fn)` per request without `off` grows the listener array indefinitely — a classic Node leak; reuse a single listener.
44. Q7: How do you profile CPU with Chrome DevTools?
45. A) `node --inspect`, open chrome://inspect, use Profiler tab (*)
46. B) `node --profile`
47. C) `node --cpu`
48. D) Install a Chrome extension
49. Explanation: `node --inspect server.js` exposes the inspector; open chrome://inspect in Chrome, click "inspect", go to Profiler tab, start, exercise the server, stop, view flamegraph.
50. Q8: Why should you clear `setInterval`/`setTimeout` on shutdown?
51. A) To save CPU
52. B) Timers keep their callbacks (and closures) alive — memory leak (*)
53. C) It's a syntax error not to
54. D) Node auto-clears them
55. Explanation: An active timer keeps its callback in memory; if the callback closes over a large object, the object is retained. Always `clearInterval`/`clearTimeout` on shutdown.
56. Q9: What does the `--cpu-prof` flag do?
57. A) Starts a profiler UI
58. B) Disables V8 optimizations
59. C) Writes a `.cpuprofile` file to disk on exit (*)
60. D) Increases CPU allocation
61. Explanation: `node --cpu-prof server.js` writes a `.cpuprofile` file on process exit; load it in Chrome DevTools Profiler or visualize with `clinic flame` / `0x`.
62. Q10: Which is a memory-safe cache pattern?
63. A) A plain Map that grows forever
64. B) An array of every request ever seen
65. C) A Set of all sockets
66. D) An LRU cache with a size limit (e.g. `lru-cache` package) (*)
67. Explanation: A plain Map grows without bound; an LRU cache (`lru-cache` package) evicts oldest entries when the size limit is hit, bounding memory.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which tool detects event-loop blocking under load?
  options:
    - eslint
    - prettier
    - clinic.js doctor
    - nodemon
  correctIndex: 2
  explanation: "`clinic doctor --on-port '...' -- node server.js` runs your server under load and reports event-loop utilization, CPU, GC, and I/O delay with recommendations."
- id: q2
  question: How do you take a heap snapshot programmatically?
  options:
    - "`process.heapSnapshot()`"
    - "`console.snapshot()`"
    - "`v8.snap()`"
    - "`writeHeapSnapshot()` from `node:v8`"
  correctIndex: 3
  explanation: '`require("node:v8").writeHeapSnapshot()` writes a `.heapsnapshot` file you can load in Chrome DevTools (Memory tab) to inspect retained objects.'
- id: q3
  question: Which is the most common memory leak pattern in Node?
  options:
    - Closures retaining large objects (e.g. callback closes over `req`)
    - Using const instead of let
    - Using too many imports
    - Sync fs calls
  correctIndex: 0
  explanation: A callback that closes over a large object (like `req` with a big body) keeps that object alive as long as the callback exists; clear references or use weak refs.
- id: q4
  question: How do you raise V8's old-generation heap limit?
  options:
    - "`NODE_HEAP=4096`"
    - "`--max-old-space-size=4096`"
    - "`--heap-size=4gb`"
    - You can't
  correctIndex: 1
  explanation: "`node --max-old-space-size=4096 app.js` raises the old-gen heap to 4GB (default ~2GB on 64-bit); use only if you genuinely need more memory."
- id: q5
  question: What does `monitorEventLoopDelay` measure?
  options:
    - Heap usage
    - CPU percentage
    - Delay between when a callback should fire and when it does
    - Number of open handles
  correctIndex: 2
  explanation: "`perf_hooks.monitorEventLoopDelay()` returns a histogram of loop-tick delays; p99 > 10ms typically indicates blocking."
- id: q6
  question: Which EventEmitter pattern causes leaks?
  options:
    - Using `once` for one-shot events
    - Storing listeners in variables
    - Setting maxListeners
    - Adding listeners per request without removing them
  correctIndex: 3
  explanation: '`emitter.on("data", fn)` per request without `off` grows the listener array indefinitely — a classic Node leak; reuse a single listener.'
- id: q7
  question: How do you profile CPU with Chrome DevTools?
  options:
    - "`node --inspect`, open chrome://inspect, use Profiler tab"
    - "`node --profile`"
    - "`node --cpu`"
    - Install a Chrome extension
  correctIndex: 0
  explanation: '`node --inspect server.js` exposes the inspector; open chrome://inspect in Chrome, click "inspect", go to Profiler tab, start, exercise the server, stop, view flamegraph.'
- id: q8
  question: Why should you clear `setInterval`/`setTimeout` on shutdown?
  options:
    - To save CPU
    - Timers keep their callbacks (and closures) alive — memory leak
    - It's a syntax error not to
    - Node auto-clears them
  correctIndex: 1
  explanation: An active timer keeps its callback in memory; if the callback closes over a large object, the object is retained. Always `clearInterval`/`clearTimeout` on shutdown.
- id: q9
  question: What does the `--cpu-prof` flag do?
  options:
    - Starts a profiler UI
    - Disables V8 optimizations
    - Writes a `.cpuprofile` file to disk on exit
    - Increases CPU allocation
  correctIndex: 2
  explanation: "`node --cpu-prof server.js` writes a `.cpuprofile` file on process exit; load it in Chrome DevTools Profiler or visualize with `clinic flame` / `0x`."
- id: q10
  question: Which is a memory-safe cache pattern?
  options:
    - A plain Map that grows forever
    - An array of every request ever seen
    - A Set of all sockets
    - An LRU cache with a size limit (e.g. `lru-cache` package)
  correctIndex: 3
  explanation: A plain Map grows without bound; an LRU cache (`lru-cache` package) evicts oldest entries when the size limit is hit, bounding memory.
```

