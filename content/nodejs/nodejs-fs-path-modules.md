---
slug: nodejs-fs-path-modules
id: nodejs-04
track: nodejs
order: 4
title: The fs and path Modules
description: Read and write files with the modern `fs.promises` API, navigate paths portably with `node:path`, and avoid the blocking `*Sync` family in request handlers.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=90s
whyItMatters: Read and write files with the modern `fs. promises` API, navigate paths portably with `node:path`, and avoid the blocking `*Sync` family in request handlers.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# The fs and path Modules

## The fs and path Modules

### Why It Matters

Read and write files with the modern `fs. promises` API, navigate paths portably with `node:path`, and avoid the blocking `*Sync` family in request handlers.

Read and write files with the modern `fs.promises` API, navigate paths portably with `node:path`, and avoid the blocking `*Sync` family in request handlers.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 3: Modules — CommonJS and ESM (for `__dirname` reconstruction in ESM).

### Topics

- `fs.promises` (async/await file API): readFile, writeFile, readdir, stat, rm, cp, mkdir
- `fs.readFileSync`/`writeFileSync` (blocking — only at startup)
- `fs.createReadStream`/`createWriteStream` (streaming, see Stage 6)
- `path.join`, `path.resolve`, `path.relative`, `path.parse`, `path.format`
- `path.sep`, `path.delimiter`, `path.posix` vs `path.win32`
- Recursive operations: `fs.cp(src, dst, { recursive: true })`, `fs.mkdir(p, { recursive: true })`
- File watching: `fs.watch` (unreliable cross-platform) and `chokidar` as the standard alternative
- `FileHandle` API via `fs.promises.open` for fine-grained control

### Key Concepts

- Sync fs methods (`readFileSync`, `writeFileSync`) block the event loop — use only at startup, never in request handlers.
- `fs.promises` is the modern async API; always `await` calls and `try/catch` for errors.
- `path.join` joins and normalizes (no leading slash); `path.resolve` makes an absolute path from cwd.
- `fs.watch` is platform-dependent and emits duplicate events; use the `chokidar` package in production.
- `fs.cp` (Node 16.7+) replaces the old recursive `fs-extra` copy; pass `{ recursive: true, force: true }`.

```javascript
const fs = require("node:fs/promises");
const path = require("node:path");

async function readJson(file) {
  const text = await fs.readFile(file, "utf8");
  return JSON.parse(text);   // throws SyntaxError on bad JSON
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

(async () => {
  const config = await readJson("./config.json");
  config.lastRun = new Date().toISOString();
  await writeJson("./out/run.json", config);
})();
```
Caption: fs.promises basics

### Common Pitfalls

- Using `fs.readFileSync` in an HTTP request handler — blocks the event loop; switch to `fs.promises.readFile` or streams.
- Forgetting to `await` a `fs.promises` call — the operation runs in the background; the next line reads stale or undefined data.
- Confusing `path.join` (joins relative to nothing, normalizes) with `path.resolve` (resolves to an absolute path from cwd) — pick the right one for the use case.
- Using `fs.watch` for production file watching — it's flaky and platform-specific (events fire multiple times, dirs vs files differ); use `chokidar`.
- Not handling `ENOENT` — `fs.readFile` on a missing file rejects with `ENOENT`; wrap with `try/catch` and handle gracefully.

### Real-World Applications

- VS Code uses Node's fs to read workspace files, watch for changes, and persist settings.
- Next.js's dev server uses chokidar to hot-reload when source files change.
- Webpack's file resolution walks the directory tree using `fs` and `path` for every `import`.
- npm reads and writes package.json, node_modules, and lockfiles via the fs module at install time.

### Interview Questions

- 1. When should you use sync fs methods? — Only at process startup (loading config, reading TLS certs) where blocking briefly is acceptable; never in request handlers.
- 2. What's the difference between `path.join` and `path.resolve`? — `join` concatenates and normalizes (no leading slash); `resolve` produces an absolute path resolved from `process.cwd()`.
- 3. How do you watch files reliably in production? — Use the `chokidar` package which abstracts platform differences (fsevents on macOS, inotify on Linux, ReadDirectoryChangesW on Windows).
- 4. What does `fs.cp` do that `fs.copyFile` doesn't? — `fs.cp` (Node 16.7+) recursively copies directories and preserves file modes; `copyFile` only copies a single file.
- 5. What error code do you get when reading a non-existent file? — `ENOENT` ("no such file or directory"); wrap with `try/catch` and `err.code === "ENOENT"` to handle.

### Mini Project

Build a Markdown-to-HTML Static Site Generator: A CLI that reads `.md` files from `src/`, converts each to HTML, and writes them to `dist/` preserving the directory structure. Suggested approach:
  - Walk `src/` recursively with `fs.readdir({ withFileTypes: true })`
  - For each `.md`, read with `fs.promises.readFile`, convert with a tiny markdown lib or regex
  - Compute the destination path with `path.join("dist", relativePath.replace(/\.md$/, ".html"))`
  - Create parent directories with `fs.mkdir({ recursive: true })`
  - Write HTML and print a summary of files processed

### Exercises

1. Write a script that reads `package.json`, parses it, and prints its `name` and `version` using `fs.promises`.
2. Recursively list all `.js` files in a directory using `fs.readdir` with `withFileTypes: true`.
3. Copy a directory tree from `src/` to `backup/` preserving structure with `fs.cp`.
4. Use `path.parse` to extract and print the name, extension, and directory of `./data/users.json`.
5. Watch a directory with chokidar and log every file change with a timestamp.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which module is the modern async/await file API?
9. A) node:fs
10. B) node:file
11. C) node:io
12. D) node:fs/promises (*)
13. Explanation: `node:fs/promises` exports promise-based versions of fs functions; `await fs.readFile(...)` returns the content.
14. Q2: Why should you avoid `fs.readFileSync` in request handlers?
15. A) It blocks the event loop (*)
16. B) It returns invalid data
17. C) It only works at startup
18. D) It requires root permissions
19. Explanation: All `*Sync` methods block the main thread; in a request handler this stalls every other request until the read completes.
20. Q3: What does `path.join("a", "b", "..", "c")` return?
21. A) "a/b/../c"
22. B) "a/c" (*)
23. C) "/a/c"
24. D) "c"
25. Explanation: `path.join` normalizes the result, so `..` collapses and the output is `"a/c"` on POSIX.
26. Q4: What's the difference between `path.join` and `path.resolve`?
27. A) There is none
28. B) `join` only works on Windows
29. C) `join` normalizes relative; `resolve` returns absolute from cwd (*)
30. D) `resolve` is async
31. Explanation: `path.join` concatenates and normalizes; `path.resolve` resolves to an absolute path using `process.cwd()` as the base.
32. Q5: Which Node version added `fs.cp` for recursive copy?
33. A) 12.0
34. B) 14.0
35. C) 20.0
36. D) 16.7 (*)
37. Explanation: `fs.cp` and `fs.cpSync` were added in Node 16.7.0; previously you needed the third-party `fs-extra` package.
38. Q6: Which is the recommended library for reliable file watching?
39. A) chokidar (*)
40. B) fs.watch
41. C) fs.watchFile
42. D) node:events
43. Explanation: `fs.watch` is platform-dependent and emits duplicate events; `chokidar` abstracts these differences and is used by Next.js, webpack, and Vite.
44. Q7: What error code is thrown when reading a missing file?
45. A) EACCES
46. B) ENOENT (*)
47. C) EEXIST
48. D) EINVAL
49. Explanation: `ENOENT` ("Error NO ENTry") is thrown when a file or directory doesn't exist; check `err.code === "ENOENT"` in your catch.
50. Q8: How do you read a directory recursively in Node 18+?
51. A) There is no built-in way
52. B) Use `fs.walk`
53. C) Use `fs.readdir({ recursive: true })` (*)
54. D) Use `fs.cp`
55. Explanation: Node 18.17+ supports `fs.readdir(path, { recursive: true })` which returns all entries at all depths.
56. Q9: Which `path` method extracts `{ dir, base, name, ext }` from a path?
57. A) path.split
58. B) path.format
59. C) path.extname
60. D) path.parse (*)
61. Explanation: `path.parse("/a/b/c.txt")` returns `{ root, dir, base, name, ext }`; `path.format` is the inverse.
62. Q10: What does `fs.mkdir(p, { recursive: true })` do?
63. A) Creates all missing intermediate directories (*)
64. B) Creates only the deepest directory
65. C) Deletes existing directories first
66. D) Returns a boolean
67. Explanation: `{ recursive: true }` makes `mkdir` behave like `mkdir -p`, creating all intermediate directories without error if they exist.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which module is the modern async/await file API?
  options:
    - node:fs
    - node:file
    - node:io
    - node:fs/promises
  correctIndex: 3
  explanation: "`node:fs/promises` exports promise-based versions of fs functions; `await fs.readFile(...)` returns the content."
- id: q2
  question: Why should you avoid `fs.readFileSync` in request handlers?
  options:
    - It blocks the event loop
    - It returns invalid data
    - It only works at startup
    - It requires root permissions
  correctIndex: 0
  explanation: All `*Sync` methods block the main thread; in a request handler this stalls every other request until the read completes.
- id: q3
  question: What does `path.join("a", "b", "..", "c")` return?
  options:
    - '"a/b/../c"'
    - '"a/c"'
    - '"/a/c"'
    - '"c"'
  correctIndex: 1
  explanation: '`path.join` normalizes the result, so `..` collapses and the output is `"a/c"` on POSIX.'
- id: q4
  question: What's the difference between `path.join` and `path.resolve`?
  options:
    - There is none
    - "`join` only works on Windows"
    - "`join` normalizes relative; `resolve` returns absolute from cwd"
    - "`resolve` is async"
  correctIndex: 2
  explanation: "`path.join` concatenates and normalizes; `path.resolve` resolves to an absolute path using `process.cwd()` as the base."
- id: q5
  question: Which Node version added `fs.cp` for recursive copy?
  options:
    - "12.0"
    - "14.0"
    - "20.0"
    - "16.7"
  correctIndex: 3
  explanation: "`fs.cp` and `fs.cpSync` were added in Node 16.7.0; previously you needed the third-party `fs-extra` package."
- id: q6
  question: Which is the recommended library for reliable file watching?
  options:
    - chokidar
    - fs.watch
    - fs.watchFile
    - node:events
  correctIndex: 0
  explanation: "`fs.watch` is platform-dependent and emits duplicate events; `chokidar` abstracts these differences and is used by Next.js, webpack, and Vite."
- id: q7
  question: What error code is thrown when reading a missing file?
  options:
    - EACCES
    - ENOENT
    - EEXIST
    - EINVAL
  correctIndex: 1
  explanation: "`ENOENT` (\"Error NO ENTry\") is thrown when a file or directory doesn't exist; check `err.code === \"ENOENT\"` in your catch."
- id: q8
  question: How do you read a directory recursively in Node 18+?
  options:
    - There is no built-in way
    - Use `fs.walk`
    - "Use `fs.readdir({ recursive: true })`"
    - Use `fs.cp`
  correctIndex: 2
  explanation: "Node 18.17+ supports `fs.readdir(path, { recursive: true })` which returns all entries at all depths."
- id: q9
  question: Which `path` method extracts `{ dir, base, name, ext }` from a path?
  options:
    - path.split
    - path.format
    - path.extname
    - path.parse
  correctIndex: 3
  explanation: '`path.parse("/a/b/c.txt")` returns `{ root, dir, base, name, ext }`; `path.format` is the inverse.'
- id: q10
  question: "What does `fs.mkdir(p, { recursive: true })` do?"
  options:
    - Creates all missing intermediate directories
    - Creates only the deepest directory
    - Deletes existing directories first
    - Returns a boolean
  correctIndex: 0
  explanation: "`{ recursive: true }` makes `mkdir` behave like `mkdir -p`, creating all intermediate directories without error if they exist."
```

