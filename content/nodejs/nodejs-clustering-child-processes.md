---
slug: nodejs-clustering-child-processes
id: nodejs-14
track: nodejs
order: 14
title: Clustering and Child Processes
description: Scale a single Node process to multiple cores with the cluster module, spawn external binaries safely with `child_process`, and avoid shell injection via `exec`.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=180s
whyItMatters: Scale a single Node process to multiple cores with the cluster module, spawn external binaries safely with `child_process`, and avoid shell injection via `exec`.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Clustering and Child Processes

## Clustering and Child Processes

### Why It Matters

Scale a single Node process to multiple cores with the cluster module, spawn external binaries safely with `child_process`, and avoid shell injection via `exec`.

Scale a single Node process to multiple cores with the cluster module, spawn external binaries safely with `child_process`, and avoid shell injection via `exec`.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 5: The http Module (cluster shares a port across workers).
- Stage 10: Process (signals, exit codes).
- Stage 13: Worker Threads (compare threads vs processes).

### Topics

- `cluster` module: `cluster.fork()`, `isPrimary`/`isWorker`, scheduling policy
- How cluster shares a port across worker processes (round-robin on Linux/macOS)
- `child_process.spawn` — streaming child (preferred for production)
- `child_process.exec` — buffered, runs in a shell (DANGER: shell injection)
- `child_process.execFile` — buffered, no shell (safer)
- `child_process.fork` — spawns a Node process with an IPC channel
- `stdio` options: `'pipe'`, `'inherit'`, `'ignore'`, `'inherit'`
- `maxBuffer` limit on `exec`, `timeout`, exit codes, signals

### Key Concepts

- Cluster spawns multiple Node processes that share a listening socket (round-robin by default) — true multi-core utilization for HTTP servers.
- `spawn` streams stdout/stderr (preferred); `exec` buffers all output in memory and runs in a shell (security risk with user input).
- `fork` is `spawn` for Node scripts and adds an IPC channel — the only way to `process.send(msg)` to a parent.
- Each cluster worker is a separate process with its own event loop and memory — no shared state (use Redis/Postgres for shared data).
- PM2's "cluster mode" is a wrapper around the cluster module; you can use either.

```javascript
const cluster = require("node:cluster");
const http = require("node:http");
const os = require("node:os");

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running`);
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();

  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.process.pid} exited (${code}); restarting`);
    cluster.fork();   // auto-restart on crash
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  }).listen(3000);
  console.log(`Worker ${process.pid} started`);
}
```
Caption: Cluster HTTP server

### Common Pitfalls

- Using `exec` with user input — shell injection; `exec("ls " + dir)` lets `dir=".; rm -rf /"` execute arbitrary commands. Use `execFile` or `spawn` with arg arrays.
- Hitting `exec`'s `maxBuffer` (default 1MB) — `exec` buffers stdout/stderr; if output exceeds the limit, the child is killed and an error fires. Use `spawn` for large output.
- Not handling the `'error'` event — if the binary doesn't exist or can't be spawned, `'error'` fires (not `'exit'`); without a listener, the process crashes.
- Forgetting to detach zombie children — if the parent exits without killing children, they may become orphans; use `child.kill()` in your shutdown handler.
- Assuming cluster workers share state — each worker is a separate process with its own memory; in-memory caches and counters are per-worker. Use Redis/Postgres for shared state.

### Real-World Applications

- PM2's "cluster mode" wraps the cluster module to scale Node across CPU cores with zero downtime reloads.
- Jest forks Node processes to run test files in isolation (avoids shared state between test suites).
- ESLint and Prettier use child_process to spawn parallel linters across CPU cores.
- Many CI tools spawn `git`, `npm`, `docker` via `child_process` to run pipeline steps.

### Interview Questions

- 1. What's the difference between cluster and worker_threads? — Cluster spawns separate Node processes (each with its own event loop, memory, V8 isolate) that share a listening socket for HTTP load balancing; worker_threads share memory within one process for CPU-bound work.
- 2. How do you avoid shell injection in `child_process`? — Never use `exec` with user input (it runs in a shell); use `execFile` or `spawn` with an args array — no shell, no injection.
- 3. What does `fork` do that `spawn` doesn't? — `fork` is `spawn` for Node scripts and sets up an IPC channel so parent and child can `process.send(msg)` to each other.
- 4. What's the default `maxBuffer` for `exec`? — 1MB; if stdout/stderr exceeds it, the child is killed and an error fires. Use `spawn` for unbounded output.
- 5. How does the cluster module share a port across workers? — The primary process binds the port and accepts connections, then distributes them to workers via round-robin (default on Linux/macOS) or shared socket (Windows).

### Mini Project

Build a Multi-process Task Runner: A "task-master" CLI that forks N worker processes, distributes a list of tasks (file paths to process) via IPC round-robin, and aggregates results back in the parent. Suggested approach:
  - Parent reads tasks from a JSON file (list of `{ id, input }`)
  - Fork `os.availableParallelism()` workers, each listening for `process.on("message")`
  - Send one task per idle worker; on `message` (result) send the next pending task
  - Track progress and print `[X/N]` after each completion
  - Handle worker crash (`worker.on("exit")`) by re-queuing its task and forking a replacement

### Exercises

1. Build a cluster HTTP server with `os.availableParallelism()` workers; verify with `curl` that different PIDs respond.
2. Use `spawn("git", ["log"])` with `stdio: "inherit"` to pipe git output directly to your terminal.
3. Demonstrate shell injection: `exec("echo " + userInput)` with `userInput = "; ls /"`.
4. Fix the injection with `execFile("echo", [userInput], cb)`.
5. Fork a worker, send it a task, receive the result via IPC, and print it.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does the `cluster` module do?
9. A) Spawns OS threads
10. B) Spawns multiple Node processes sharing a port (*)
11. C) Spawns Docker containers
12. D) Balances load via DNS
13. Explanation: Cluster forks multiple Node processes that share a listening socket; the primary distributes incoming connections to workers (round-robin on Linux/macOS).
14. Q2: Which `child_process` method runs in a shell (risk of injection)?
15. A) spawn
16. B) execFile
17. C) exec (*)
18. D) fork
19. Explanation: `exec` runs the command in a shell, so user input can chain commands (`;` `&&` `|`); use `execFile` or `spawn` with arg arrays (no shell).
20. Q3: How do you safely pass user input to a child process?
21. A) Wrap it in quotes manually
22. B) Use exec with a regex filter
23. C) You can't; never accept user input
24. D) Use spawn("cmd", [userInput], opts) — args array, no shell (*)
25. Explanation: `spawn` (and `execFile`) pass args as an array without invoking a shell; no shell means no shell injection.
26. Q4: What is the default `maxBuffer` for `exec`?
27. A) 1 MB (*)
28. B) 10 MB
29. C) 100 MB
30. D) Unlimited
31. Explanation: Default is 1MB; if stdout or stderr exceeds it, the child is killed with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`. Use `spawn` for unbounded output.
32. Q5: What does `fork` add on top of `spawn`?
33. A) A faster process startup
34. B) An IPC channel between parent and child (*)
35. C) Shared memory
36. D) Automatic restart on crash
37. Explanation: `fork` is `spawn` for Node scripts and sets up an IPC channel so parent and child can `process.send(msg)` and `process.on("message")`.
38. Q6: Do cluster workers share memory?
39. A) Yes, fully
40. B) Only via SharedArrayBuffer
41. C) No — each is a separate process with its own V8 isolate (*)
42. D) Only globals
43. Explanation: Each cluster worker is a separate OS process with its own V8 isolate and memory; use Redis/Postgres for shared state.
44. Q7: Which event fires if `spawn` can't find the binary?
45. A) exit
46. B) close
47. C) notfound
48. D) error (*)
49. Explanation: `'error'` fires when the child can't be spawned (binary missing, permission denied); without a listener, the parent process crashes.
50. Q8: What does `stdio: "inherit"` do in spawn?
51. A) Pipes child stdout/stderr to the parent's (*)
52. B) Ignores all output
53. C) Logs to a file
54. D) Buffers in memory
55. Explanation: `'inherit'` makes the child share the parent's stdio streams — useful for CLI tools that should print directly to the terminal.
56. Q9: How does cluster share a port across workers?
57. A) Workers each bind the port (impossible)
58. B) The primary binds and distributes connections via round-robin (*)
59. C) Via a load balancer
60. D) Via SO_REUSEPORT
61. Explanation: The primary process binds the port and accepts connections, then distributes them to workers via round-robin (default) or shared socket.
62. Q10: Why use cluster for HTTP servers?
63. A) To reduce memory usage
64. B) To simplify code
65. C) To use multiple CPU cores (Node is single-threaded by default) (*)
66. D) To avoid using PM2
67. Explanation: A single Node process uses one CPU core; cluster forks N workers to utilize all cores, multiplying throughput for HTTP servers.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the `cluster` module do?
  options:
    - Spawns OS threads
    - Spawns multiple Node processes sharing a port
    - Spawns Docker containers
    - Balances load via DNS
    - .
  correctIndex: 1
  explanation: Cluster forks multiple Node processes that share a listening socket; the primary distributes incoming connections to workers (round-robin on Linux/macOS).
- id: q2
  question: Which `child_process` method runs in a shell (risk of injection)?
  options:
    - spawn
    - execFile
    - exec
    - fork
  correctIndex: 2
  explanation: "`exec` runs the command in a shell, so user input can chain commands (`;` `&&` `|`); use `execFile` or `spawn` with arg arrays (no shell)."
- id: q3
  question: How do you safely pass user input to a child process?
  options:
    - Wrap it in quotes manually
    - Use exec with a regex filter
    - You can't; never accept user input
    - Use spawn("cmd", [userInput], opts) — args array, no shell
  correctIndex: 3
  explanation: "`spawn` (and `execFile`) pass args as an array without invoking a shell; no shell means no shell injection."
- id: q4
  question: What is the default `maxBuffer` for `exec`?
  options:
    - 1 MB
    - 10 MB
    - 100 MB
    - Unlimited
  correctIndex: 0
  explanation: Default is 1MB; if stdout or stderr exceeds it, the child is killed with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`. Use `spawn` for unbounded output.
- id: q5
  question: What does `fork` add on top of `spawn`?
  options:
    - A faster process startup
    - An IPC channel between parent and child
    - Shared memory
    - Automatic restart on crash
  correctIndex: 1
  explanation: '`fork` is `spawn` for Node scripts and sets up an IPC channel so parent and child can `process.send(msg)` and `process.on("message")`.'
- id: q6
  question: Do cluster workers share memory?
  options:
    - Yes, fully
    - Only via SharedArrayBuffer
    - No — each is a separate process with its own V8 isolate
    - Only globals
  correctIndex: 2
  explanation: Each cluster worker is a separate OS process with its own V8 isolate and memory; use Redis/Postgres for shared state.
- id: q7
  question: Which event fires if `spawn` can't find the binary?
  options:
    - exit
    - close
    - notfound
    - error
  correctIndex: 3
  explanation: "`'error'` fires when the child can't be spawned (binary missing, permission denied); without a listener, the parent process crashes."
- id: q8
  question: 'What does `stdio: "inherit"` do in spawn?'
  options:
    - Pipes child stdout/stderr to the parent's
    - Ignores all output
    - Logs to a file
    - Buffers in memory
  correctIndex: 0
  explanation: "`'inherit'` makes the child share the parent's stdio streams — useful for CLI tools that should print directly to the terminal."
- id: q9
  question: How does cluster share a port across workers?
  options:
    - Workers each bind the port (impossible)
    - The primary binds and distributes connections via round-robin
    - Via a load balancer
    - Via SO_REUSEPORT
  correctIndex: 1
  explanation: The primary process binds the port and accepts connections, then distributes them to workers via round-robin (default) or shared socket.
- id: q10
  question: Why use cluster for HTTP servers?
  options:
    - To reduce memory usage
    - To simplify code
    - To use multiple CPU cores (Node is single-threaded by default)
    - To avoid using PM2
  correctIndex: 2
  explanation: A single Node process uses one CPU core; cluster forks N workers to utilize all cores, multiplying throughput for HTTP servers.
```

