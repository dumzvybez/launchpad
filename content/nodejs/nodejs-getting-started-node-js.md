---
slug: nodejs-getting-started-node-js
id: nodejs-01
track: nodejs
order: 1
title: Getting Started with Node.js
description: Install the Node.js runtime, write and run your first script, explore the REPL, and understand the V8 + libuv architecture that makes Node.js different from browser JavaScript.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms
whyItMatters: Install the Node. js runtime, write and run your first script, explore the REPL, and understand the V8 + libuv architecture that makes Node.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Getting Started with Node.js

## Getting Started with Node.js

### Why It Matters

Install the Node. js runtime, write and run your first script, explore the REPL, and understand the V8 + libuv architecture that makes Node.

Install the Node.js runtime, write and run your first script, explore the REPL, and understand the V8 + libuv architecture that makes Node.js different from browser JavaScript.

### Prerequisites

- None — basic JavaScript knowledge is helpful but not required.
- Comfort using a terminal (running commands, editing files).

### Topics

- Installing Node.js 20 LTS+ via nvm or fnm (never system sudo)
- Verifying with `node --version` and `npm --version`
- Running scripts: `node hello.js` and `node -e "console.log(1+1)"`
- The Node REPL: `.help`, `.exit`, multi-line blocks
- The V8 engine and libuv event loop (high level)
- CommonJS vs ESM preview (more in Stage 3)
- Node's built-in modules (fs, path, http, stream, crypto)
- Why Node.js is not the browser (no DOM, no window, has process)

### Key Concepts

- Node.js = V8 (JS engine) + libuv (async I/O + event loop) + built-in modules.
- The JS thread is single-threaded; I/O is offloaded to libuv's thread pool (default 4 threads).
- Node uses CommonJS by default (`require`/`module.exports`); opt into ESM via `"type": "module"` in package.json or `.mjs` files.
- Node ships with batteries-included modules (fs, http, crypto, stream, path) — reach for stdlib before npm.
- Even-numbered Node versions (20, 22) become LTS; odd-numbered versions are short-lived.

```javascript
// hello.js
console.log("Hello, World!");

// Node.js adds globals beyond browser JS:
console.log("Node version:", process.version);        // e.g. v20.10.0
console.log("Platform:", process.platform);            // e.g. linux
console.log("Process ID:", process.pid);
```
Caption: Hello World

### Common Pitfalls

- Installing Node with `sudo apt install nodejs` (gets you Node 12 or 18 on old distros) — install via nvm (`curl -o- ... | bash` then `nvm install 20`) or fnm so you can pick the version per project.
- Using an odd-numbered or EOL Node version (e.g. 17 or 16) in production — only use Even-numbered LTS releases (20, 22); Node 16 hit EOL in September 2023, Node 18 in April 2025.
- Confusing `node` (the runtime) with `npm` (the package manager) — `node` runs JavaScript; `npm` installs packages and runs scripts; both ship together but are separate tools.
- Treating Node code like browser code (expecting `window`, `document`, `fetch` globals from older Node) — `fetch` is global only since Node 18; `window` and `document` do not exist.
- Running scripts with `sudo node app.js` — Node does not need root; bind to port 80 via a reverse proxy (nginx, Caddy) or use `setcap` on the binary, never run as root.

### Real-World Applications

- Netflix uses Node.js as its API gateway layer, replacing a Java/Oracle stack and cutting startup time from minutes to seconds.
- PayPal migrated its account-overview page from Java/Spring to Node.js and reported 2x throughput, 35% fewer lines of code, and 33% fewer requests to backends.
- LinkedIn rebuilt its mobile backend from Rails to Node.js, dropping server count from 30 to 3 and cutting request times.
- Walmart survived Black Friday traffic spikes by running Node.js behind a load balancer for its mobile backend.

### Interview Questions

- 1. Who created Node.js and when? — Ryan Dahl created Node.js in 2009, demoing it at JSConf EU; he later created Deno in 2018.
- 2. What two technologies sit underneath Node.js? — V8 (Google's JavaScript engine, also in Chrome) and libuv (cross-platform async I/O library providing the event loop).
- 3. Why is Node.js called "single-threaded"? — JavaScript executes on one main thread; I/O (fs, net, crypto in some cases) is offloaded to libuv's thread pool or the OS, so the JS thread is never blocked by I/O.
- 4. What's the difference between CommonJS and ESM in Node? — CommonJS uses `require`/`module.exports` synchronously; ESM uses `import`/`export`, is statically analyzable, supports tree-shaking and top-level await.
- 5. How do you pick which Node version to install? — Use the current LTS (even-numbered, e.g. 20 or 22) for production; install via nvm or fnm per-project, never via `sudo apt install`.

### Mini Project

Build a Greeting Generator CLI: A command-line tool that takes a name from argv (or `--name`), prints a personalized greeting with a timestamp, and falls back to "World" when no name is supplied. Suggested approach:
  - Create `greet.js` and read `process.argv` (argv[2] is the first user argument)
  - Optionally support `--name Alice` by parsing argv manually or with the `node:util` `parseArgs` helper
  - Stamp output with `new Date().toISOString()`
  - Print with `console.log(\`Hello, ${name}! [${ts}]\`)`
  - Add a `--shout` flag that uppercases the greeting with `String.prototype.toUpperCase`

### Exercises

1. Install Node 20 LTS via nvm and confirm with `node --version` (should print v20.x.x or higher).
2. Create `hello.js` that prints your name and the current Node version using `process.version`; run it.
3. Open the REPL, compute `2 ** 16`, run `process.platform`, and exit with `.exit`.
4. Write a script that uses `node:os` to print hostname, platform, and CPU count; run it.
5. Use `node -e "console.log(process.argv)" a b c` to see how argv is structured.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created Node.js?
9. A) Ryan Dahl (*)
10. B) Brendan Eich
11. C) TJ Holowaychuk
12. D) Isaac Schlueter
13. Explanation: Ryan Dahl created Node.js in 2009, demoing it at JSConf EU in Berlin.
14. Q2: What JavaScript engine does Node.js use?
15. A) SpiderMonkey
16. B) V8 (*)
17. C) JavaScriptCore
18. D) Chakra
19. Explanation: Node.js uses V8, Google's open-source JavaScript engine originally built for Chrome.
20. Q3: What library provides Node's event loop and async I/O?
21. A) libevent
22. B) Boost.Asio
23. C) libuv (*)
24. D) libev
25. Explanation: libuv is the C library that provides the event loop, thread pool, and cross-platform async I/O.
26. Q4: Which command prints the installed Node version?
27. A) node version
28. B) npm version
29. C) node -v
30. D) node --version (*)
31. Explanation: `node --version` (or `-v` shorthand) prints the runtime version, e.g. v20.10.0.
32. Q5: What does the Node REPL do?
33. A) Reads, evaluates, and prints JavaScript expressions interactively (*)
34. B) Compiles JavaScript to bytecode ahead of time
35. C) Replaces the npm CLI
36. D) Generates package.json files
37. Explanation: REPL = Read-Eval-Print Loop; type JavaScript, get immediate results, with `.help` for commands.
38. Q6: Which is the recommended way to install Node.js for development?
39. A) sudo apt install nodejs
40. B) Use nvm or fnm to install per-project versions (*)
41. C) Download the binary as root
42. D) Build V8 from source
43. Explanation: nvm/fnm let you install multiple Node versions per user without sudo and switch between them.
44. Q7: Which Node versions become LTS (long-term support)?
45. A) Odd-numbered major versions (17, 19, 21)
46. B) All minor versions
47. C) Even-numbered major versions (18, 20, 22) (*)
48. D) Only patch versions
49. Explanation: Node ships a new even-numbered major every April that becomes LTS in October of the same year.
50. Q8: Which of these is NOT a Node.js built-in module?
51. A) node:fs
52. B) node:http
53. C) node:crypto
54. D) node:dom (*)
55. Explanation: There is no `node:dom` module — Node has no DOM; that's a browser concept implemented by jsdom as a third-party package.
56. Q9: What is npm?
57. A) The Node Package Manager; installs packages and runs scripts (*)
58. B) A faster replacement for Node
59. C) A test runner built into Node
60. D) The compiler that produces .node binaries
61. Explanation: npm = Node Package Manager; it ships with Node, manages dependencies in package.json, and runs scripts via `npm run`.
62. Q10: Why is Node.js called "single-threaded"?
63. A) It can only handle one request per process
64. B) Only one JS thread runs at a time; I/O is async via libuv (*)
65. C) It refuses to use multiple CPU cores
66. D) It has no concept of concurrency
67. Explanation: JavaScript executes on one main thread, but I/O is offloaded to libuv's thread pool, so a single process handles thousands of concurrent connections.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Node.js?
  options:
    - Ryan Dahl
    - Brendan Eich
    - TJ Holowaychuk
    - Isaac Schlueter
  correctIndex: 0
  explanation: Ryan Dahl created Node.js in 2009, demoing it at JSConf EU in Berlin.
- id: q2
  question: What JavaScript engine does Node.js use?
  options:
    - SpiderMonkey
    - V8
    - JavaScriptCore
    - Chakra
  correctIndex: 1
  explanation: Node.js uses V8, Google's open-source JavaScript engine originally built for Chrome.
- id: q3
  question: What library provides Node's event loop and async I/O?
  options:
    - libevent
    - Boost.Asio
    - libuv
    - libev
  correctIndex: 2
  explanation: libuv is the C library that provides the event loop, thread pool, and cross-platform async I/O.
- id: q4
  question: Which command prints the installed Node version?
  options:
    - node version
    - npm version
    - node -v
    - node --version
  correctIndex: 3
  explanation: "`node --version` (or `-v` shorthand) prints the runtime version, e.g. v20.10.0."
- id: q5
  question: What does the Node REPL do?
  options:
    - Reads, evaluates, and prints JavaScript expressions interactively
    - Compiles JavaScript to bytecode ahead of time
    - Replaces the npm CLI
    - Generates package.json files
  correctIndex: 0
  explanation: REPL = Read-Eval-Print Loop; type JavaScript, get immediate results, with `.help` for commands.
- id: q6
  question: Which is the recommended way to install Node.js for development?
  options:
    - sudo apt install nodejs
    - Use nvm or fnm to install per-project versions
    - Download the binary as root
    - Build V8 from source
  correctIndex: 1
  explanation: nvm/fnm let you install multiple Node versions per user without sudo and switch between them.
- id: q7
  question: Which Node versions become LTS (long-term support)?
  options:
    - Odd-numbered major versions (17, 19, 21)
    - All minor versions
    - Even-numbered major versions (18, 20, 22)
    - Only patch versions
  correctIndex: 2
  explanation: Node ships a new even-numbered major every April that becomes LTS in October of the same year.
- id: q8
  question: Which of these is NOT a Node.js built-in module?
  options:
    - node:fs
    - node:http
    - node:crypto
    - node:dom
  correctIndex: 3
  explanation: There is no `node:dom` module — Node has no DOM; that's a browser concept implemented by jsdom as a third-party package.
- id: q9
  question: What is npm?
  options:
    - The Node Package Manager; installs packages and runs scripts
    - A faster replacement for Node
    - A test runner built into Node
    - The compiler that produces .node binaries
  correctIndex: 0
  explanation: npm = Node Package Manager; it ships with Node, manages dependencies in package.json, and runs scripts via `npm run`.
- id: q10
  question: Why is Node.js called "single-threaded"?
  options:
    - It can only handle one request per process
    - Only one JS thread runs at a time; I/O is async via libuv
    - It refuses to use multiple CPU cores
    - It has no concept of concurrency
  correctIndex: 1
  explanation: JavaScript executes on one main thread, but I/O is offloaded to libuv's thread pool, so a single process handles thousands of concurrent connections.
```

