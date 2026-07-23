---
slug: nodejs-process-argv-env-exit-signals
id: nodejs-10
track: nodejs
order: 10
title: Process — argv, env, exit, signals
description: Read command-line arguments and environment variables, exit cleanly, and handle SIGINT/SIGTERM for graceful shutdown in containers and process managers.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=270s
whyItMatters: Read command-line arguments and environment variables, exit cleanly, and handle SIGINT/SIGTERM for graceful shutdown in containers and process managers.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Process — argv, env, exit, signals

## Process — argv, env, exit, signals

### Why It Matters

Read command-line arguments and environment variables, exit cleanly, and handle SIGINT/SIGTERM for graceful shutdown in containers and process managers.

Read command-line arguments and environment variables, exit cleanly, and handle SIGINT/SIGTERM for graceful shutdown in containers and process managers.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 5: The http Module (servers need graceful shutdown).
- Stage 9: Errors (uncaught handlers exit the process).

### Topics

- `process.argv` and `process.execArgv`
- `process.env` and dotenv for `.env` files
- `parseArgs` from `node:util` (the modern argv parser)
- `process.exit(code)` vs `process.exitCode = code` (preferred)
- Signal handling: `SIGINT`, `SIGTERM`, `SIGHUP`, `SIGUSR2`
- `process.stdin`, `process.stdout`, `process.stderr`
- `process.cwd()`, `process.chdir()`, `process.memoryUsage()`, `process.pid`
- Graceful shutdown: drain HTTP server, close DB pool, exit

### Key Concepts

- `process.argv[0]` is the node binary, `argv[1]` is the script path; user args start at `argv[2]`.
- `process.env` values are always strings — `Boolean(process.env.FOO)` is `true` even for `"false"`; parse explicitly.
- `process.exit(0)` exits immediately without flushing async writes — set `process.exitCode = 0` and let the loop drain instead.
- `SIGTERM` (sent by k8s, Docker, PM2) is your signal to drain in-flight requests and exit cleanly within the grace period.
- Env vars should be read at startup and passed as config; reading them deep in modules makes testing hard.

```javascript
const { parseArgs } = require("node:util");

const { values, positionals } = parseArgs({
  options: {
    port:    { type: "string", short: "p", default: "3000" },
    verbose: { type: "boolean", short: "v", default: false },
    host:    { type: "string" },
  },
  allowPositionals: true,
});

console.log(values);          // { port: '3000', verbose: false, host: undefined }
console.log(positionals);     // ['input.txt']
// Run: node app.js -p 8080 -v --host 0.0.0.0 input.txt
```
Caption: parseArgs — modern argv parser

### Common Pitfalls

- Calling `process.exit(0)` in the middle of async writes — stdout may not flush; use `process.exitCode = 0` and let the loop drain.
- Treating `process.env.FOO` as a boolean — `Boolean("false")` is `true`; explicitly parse with `=== "true"` or `"1" === process.env.FOO`.
- Ignoring `SIGTERM` (k8s default) — after the grace period, k8s sends `SIGKILL` which can't be caught; you lose in-flight work.
- Reading env vars deep in modules — makes testing hard; read once at startup into a frozen config object passed via dependency injection.
- Using `process.on("SIGINT")` without `unref`-ing the shutdown timer — the timer keeps the loop alive, defeating the purpose of graceful shutdown.

### Real-World Applications

- PM2 sends `SIGINT` to gracefully restart Node processes and reloads them in cluster mode without dropping requests.
- Kubernetes sends `SIGTERM` with a `terminationGracePeriodSeconds` (default 30s) before `SIGKILL`.
- Every Node CLI tool (npm, eslint, prettier) reads `process.argv` to parse flags and arguments.
- The `dotenv` package is loaded by virtually every Node app to populate `process.env` from a `.env` file in development.

### Interview Questions

- 1. What's in `process.argv`? — `argv[0]` is the node binary path, `argv[1]` is the script path, `argv[2]` is the first user argument; use `parseArgs` from `node:util` to parse them.
- 2. Why prefer `process.exitCode = 0` over `process.exit(0)`? — `process.exit` exits immediately without flushing async stdout; setting `exitCode` lets the loop drain naturally.
- 3. What signal does Kubernetes send to terminate a pod? — `SIGTERM` (default), followed by `SIGKILL` after `terminationGracePeriodSeconds` (default 30s) if the process hasn't exited.
- 4. Why are env vars always strings? — They come from the OS environment which has no type system; parse explicitly (`parseInt`, `=== "true"`) instead of trusting `Boolean(env.FOO)`.
- 5. How do you handle Ctrl-C in a long-running script? — Register `process.on("SIGINT", () => { cleanup(); process.exit(0); })` and clean up resources (close DB pool, flush logs) before exiting.

### Mini Project

Build a Graceful Shutdown HTTP Server: A small server that, on `SIGTERM` or `SIGINT`, stops accepting new connections, finishes in-flight requests within a 10-second grace period, closes the DB pool (simulated), and exits with code 0; logs every step. Suggested approach:
  - Build an `http.createServer` with a `setTimeout`-simulated DB query in the handler
  - Add a `isShuttingDown` flag that responds 503 to new requests during drain
  - On `SIGTERM`/`SIGINT`, call `server.close()` and wait for in-flight requests
  - Add a hard 10s timeout (`setTimeout(...).unref()`) that force-exits if drain takes too long
  - Test by sending `kill -TERM <pid>` while a slow request is in flight

### Exercises

1. Use `parseArgs` to build a CLI that takes `--port`, `--host`, and a positional `cmd`.
2. Read `DATABASE_URL` from env and fail loudly if missing; use `dotenv` to load a `.env` file.
3. Build a server that responds 503 to new requests after `SIGTERM` is received.
4. Demonstrate the difference between `process.exit(0)` and `process.exitCode = 0` with an async stdout write.
5. Print `process.memoryUsage()` every 5s and observe `heapUsed` growth.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is `process.argv[2]`?
9. A) The node binary path
10. B) The first user-provided argument (*)
11. C) The script path
12. D) Always undefined
13. Explanation: `argv[0]` is node, `argv[1]` is the script path; user arguments start at index 2.
14. Q2: Which is preferred to exit cleanly after async work?
15. A) process.exit(0)
16. B) process.kill()
17. C) process.exitCode = 0; let the loop drain (*)
18. D) process.abort()
19. Explanation: `process.exit(0)` may truncate unflushed async stdout; setting `exitCode` lets the event loop drain naturally before exit.
20. Q3: What signal does Kubernetes send to terminate a pod?
21. A) SIGKILL
22. B) SIGHUP
23. C) SIGQUIT
24. D) SIGTERM (*)
25. Explanation: k8s sends `SIGTERM` first and waits `terminationGracePeriodSeconds` (default 30s) before sending `SIGKILL`.
26. Q4: What is the type of `process.env.PORT`?
27. A) string (always) (*)
28. B) number
29. C) boolean
30. D) undefined or string
31. Explanation: Env vars are always strings; `process.env.PORT` is `"3000"` not `3000`, so parse with `parseInt`.
32. Q5: What does `Boolean(process.env.DEBUG)` return when `DEBUG="false"`?
33. A) false
34. B) true (any non-empty string is truthy) (*)
35. C) throws
36. D) undefined
37. Explanation: `Boolean("false")` is `true` because any non-empty string is truthy; check explicitly with `process.env.DEBUG === "true"`.
38. Q6: Which module provides modern argv parsing?
39. A) node:argv
40. B) node:args
41. C) node:util (parseArgs) (*)
42. D) node:cli
43. Explanation: `parseArgs` from `node:util` (Node 18.3+) is the built-in argv parser with `options`, `short` aliases, and positionals.
44. Q7: Why should you unref() the shutdown timer?
45. A) To make it fire faster
46. B) To pause it
47. C) To reduce memory
48. D) To prevent the timer from keeping the loop alive forever (*)
49. Explanation: `.unref()` tells Node not to keep the event loop alive just for this timer; once everything else is done, the loop exits even if the timer hasn't fired.
50. Q8: Which package loads `.env` files into `process.env`?
51. A) dotenv (*)
52. B) node:env
53. C) envfile
54. D) node:dotenv
55. Explanation: `dotenv` is the de facto standard; `import 'dotenv/config'` at the top of your entry point populates `process.env` from `.env`.
56. Q9: What does `process.memoryUsage().heapUsed` report?
57. A) Total system RAM
58. B) Bytes of V8 JS heap currently used (*)
59. C) The size of all Buffers
60. D) The event loop lag
61. Explanation: `heapUsed` is the V8-managed JS heap in bytes; `rss` is total process resident set, `external` is C++ objects (Buffers).
62. Q10: Why read env vars once at startup into a config object?
63. A) Faster startup
64. B) Env vars disappear after startup
65. C) Testability and explicit dependencies (*)
66. D) It's required by Node
67. Explanation: Reading env deep in modules makes them hard to test (you'd mutate `process.env`); inject a frozen config object instead.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is `process.argv[2]`?
  options:
    - The node binary path
    - The first user-provided argument
    - The script path
    - Always undefined
  correctIndex: 1
  explanation: "`argv[0]` is node, `argv[1]` is the script path; user arguments start at index 2."
- id: q2
  question: Which is preferred to exit cleanly after async work?
  options:
    - process.exit(0)
    - process.kill()
    - process.exitCode = 0; let the loop drain
    - process.abort()
  correctIndex: 2
  explanation: "`process.exit(0)` may truncate unflushed async stdout; setting `exitCode` lets the event loop drain naturally before exit."
- id: q3
  question: What signal does Kubernetes send to terminate a pod?
  options:
    - SIGKILL
    - SIGHUP
    - SIGQUIT
    - SIGTERM
  correctIndex: 3
  explanation: k8s sends `SIGTERM` first and waits `terminationGracePeriodSeconds` (default 30s) before sending `SIGKILL`.
- id: q4
  question: What is the type of `process.env.PORT`?
  options:
    - string (always)
    - number
    - boolean
    - undefined or string
  correctIndex: 0
  explanation: Env vars are always strings; `process.env.PORT` is `"3000"` not `3000`, so parse with `parseInt`.
- id: q5
  question: What does `Boolean(process.env.DEBUG)` return when `DEBUG="false"`?
  options:
    - '` return when `DEBUG="false"`?'
    - "false"
    - true (any non-empty string is truthy)
    - throws
    - undefined
  correctIndex: 2
  explanation: '`Boolean("false")` is `true` because any non-empty string is truthy; check explicitly with `process.env.DEBUG === "true"`.'
- id: q6
  question: Which module provides modern argv parsing?
  options:
    - node:argv
    - node:args
    - node:util (parseArgs)
    - node:cli
  correctIndex: 2
  explanation: "`parseArgs` from `node:util` (Node 18.3+) is the built-in argv parser with `options`, `short` aliases, and positionals."
- id: q7
  question: Why should you unref() the shutdown timer?
  options:
    - To make it fire faster
    - To pause it
    - To reduce memory
    - To prevent the timer from keeping the loop alive forever
  correctIndex: 3
  explanation: "`.unref()` tells Node not to keep the event loop alive just for this timer; once everything else is done, the loop exits even if the timer hasn't fired."
- id: q8
  question: Which package loads `.env` files into `process.env`?
  options:
    - dotenv
    - node:env
    - envfile
    - node:dotenv
  correctIndex: 0
  explanation: "`dotenv` is the de facto standard; `import 'dotenv/config'` at the top of your entry point populates `process.env` from `.env`."
- id: q9
  question: What does `process.memoryUsage().heapUsed` report?
  options:
    - Total system RAM
    - Bytes of V8 JS heap currently used
    - The size of all Buffers
    - The event loop lag
  correctIndex: 1
  explanation: "`heapUsed` is the V8-managed JS heap in bytes; `rss` is total process resident set, `external` is C++ objects (Buffers)."
- id: q10
  question: Why read env vars once at startup into a config object?
  options:
    - Faster startup
    - Env vars disappear after startup
    - Testability and explicit dependencies
    - It's required by Node
  correctIndex: 2
  explanation: Reading env deep in modules makes them hard to test (you'd mutate `process.env`); inject a frozen config object instead.
```

