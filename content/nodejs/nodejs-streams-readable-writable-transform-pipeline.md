---
slug: nodejs-streams-readable-writable-transform-pipeline
id: nodejs-06
track: nodejs
order: 6
title: Streams — Readable, Writable, Transform, Pipeline
description: Master Node's four stream types, use `pipeline` to safely compose them, understand backpressure, and process large files without blowing memory.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=150s
whyItMatters: Master Node's four stream types, use `pipeline` to safely compose them, understand backpressure, and process large files without blowing memory.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Streams — Readable, Writable, Transform, Pipeline

## Streams — Readable, Writable, Transform, Pipeline

### Why It Matters

Master Node's four stream types, use `pipeline` to safely compose them, understand backpressure, and process large files without blowing memory.

Master Node's four stream types, use `pipeline` to safely compose them, understand backpressure, and process large files without blowing memory.

### Prerequisites

- Stage 4: The fs and path Modules (createReadStream, createWriteStream).
- Stage 5: The http Module (req/res are streams).
- Stage 2: The Node.js Event Loop (streams fire callbacks on the loop).

### Topics

- The four stream types: Readable, Writable, Duplex, Transform
- `stream.pipeline(src, ...transforms, dst, callback)` — the safe composition API
- Why `pipe()` is dangerous (silent errors, doesn't propagate 'error' across streams)
- Backpressure: what it is and how `pipeline`/`pipe` handle it
- Object mode streams (streaming JS objects instead of bytes)
- `Readable.from(iterable)` and `Readable.fromWeb`/`Writable.toWeb` (web streams interop)
- `stream.finished` and `stream.compose`
- Async iteration: `for await (const chunk of readable)`

### Key Concepts

- Streams process data in chunks (or objects) rather than buffering the whole payload — essential for large files or infinite sources.
- Backpressure is the signal from a slow consumer to a fast producer to pause; `pipe`/`pipeline` propagate it automatically via the return value of `write()`.
- `pipe()` does NOT forward 'error' events between streams — if any stream errors, the others leak. Always use `pipeline` or `stream.finished` to handle errors.
- Transform streams (e.g. `zlib.createGzip`) are Duplex streams where the output is a function of the input.
- Object mode streams emit JS objects instead of Buffers; useful for parsing pipelines (`stream-json`, `csv-parse`).

```javascript
const { pipeline } = require("node:stream/promises");
const fs = require("node:fs");
const zlib = require("node:zlib");

async function gzipFile(src, dst) {
  await pipeline(
    fs.createReadStream(src),         // Readable
    zlib.createGzip(),                 // Transform
    fs.createWriteStream(dst),         // Writable
  );
  console.log(`${src} -> ${dst}`);
}

gzipFile("access.log", "access.log.gz").catch(console.error);
```
Caption: Gzip a file with pipeline

### Common Pitfalls

- Using `.pipe()` without error handling — if any stream errors, the others are not destroyed and the process leaks file descriptors; always use `pipeline()` from `node:stream/promises`.
- Not destroying streams on error — a leaked Readable keeps the source (file, socket) open; use `stream.finished` or wrap with `try/finally` + `stream.destroy()`.
- Ignoring backpressure by buffering manually (e.g. `chunks.push(...chunk)` in memory) — for large files this OOMs the process; let the stream emit chunks.
- Mixing object mode and byte mode without `objectMode: true` on the right stream — the downstream receives Buffers instead of objects, or vice versa.
- Calling `write()` on a Writable after `end()` — throws `ERR_STREAM_WRITE_AFTER_END`; track your lifecycle with `pipeline` or events.

### Real-World Applications

- Netflix's video pipeline uses Node streams to pipe transcoded video chunks from origin to CDN edge.
- The `tar` extraction (`tar -x`) in npm is a stream pipeline (gzip → tar-stream → fs writes).
- HTTP response bodies (`res` in `fetch`) are Readable streams you can pipe through transforms (gunzip, parse).
- Webpack's compilation pipeline is built on tapable + streams; intermediate chunks flow between plugins.

### Interview Questions

- 1. What is backpressure in a stream? — The signal a slow consumer sends to a fast producer to pause `write()`; without it, memory grows unbounded as chunks queue up.
- 2. Why is `pipeline` preferred over `pipe`? — `pipeline` propagates errors across the chain, destroys all streams on error, and provides a callback/Promise interface; `pipe` silently leaks on errors.
- 3. What is object mode? — A stream mode where chunks are arbitrary JS objects instead of Buffers/strings; set `objectMode: true` in the constructor options.
- 4. What is a Transform stream? — A Duplex stream where the output is computed from the input via a `transform(chunk, enc, cb)` function; examples: gzip, encrypt, JSON.parse.
- 5. How do you consume a Readable stream with async/await? — Use `for await (const chunk of readable)` — async iteration handles 'data'/'end'/'error' for you.

### Mini Project

Build a Log File Compressor and Filter: A CLI that reads a large access log, filters out lines containing a given substring, gzip-compresses the result, and writes to an output file — all via streams so memory stays flat regardless of input size. Suggested approach:
  - Use `fs.createReadStream` as the source
  - Use `split2` (or a custom Transform) to split into lines
  - Add a Transform that drops lines matching a regex
  - Pipe through `zlib.createGzip`
  - End with `fs.createWriteStream`; wrap in `pipeline` with a Promise

### Exercises

1. Use `pipeline` to gzip a file and verify the output with `gunzip -l`.
2. Write a Transform that uppercases every chunk; pipe it through `process.stdin` to `process.stdout`.
3. Count the lines in a 1GB file using async iteration without buffering the whole file.
4. Create an object-mode stream of `{ id, name }` objects and serialize each to NDJSON in a Transform.
5. Demonstrate backpressure by writing a fast Readable and a slow Writable that sleeps 100ms per chunk.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which API is the safe way to compose streams?
9. A) .pipe()
10. B) stream.pipeline (*)
11. C) .connect()
12. D) .link()
13. Explanation: `pipeline` propagates errors and destroys all streams on failure; `.pipe()` does not propagate errors and leaks resources.
14. Q2: What is backpressure?
15. A) A type of stream error
16. B) The maximum chunk size
17. C) The signal from a slow consumer to a fast producer to pause (*)
18. D) A pipe() option
19. Explanation: When a Writable's internal buffer fills, it returns `false` from `write()` and the source pauses until 'drain' fires — this is backpressure.
20. Q3: Why is `.pipe()` considered dangerous?
21. A) It is slower than pipeline
22. B) It only works on object mode streams
23. C) It blocks the event loop
24. D) It does not propagate 'error' events between streams (*)
25. Explanation: If one stream in a `.pipe()` chain errors, the others are not destroyed and the process leaks file descriptors; use `pipeline` instead.
26. Q4: Which stream type transforms input into output?
27. A) Transform (*)
28. B) Readable
29. C) Writable
30. D) Duplex
31. Explanation: A Transform is a Duplex stream where the output is a function of the input via a `transform(chunk, enc, cb)` method; e.g. zlib.createGzip.
32. Q5: What does "object mode" mean for a stream?
33. A) It serializes objects to JSON
34. B) Chunks are JS objects rather than Buffers (*)
35. C) It only accepts class instances
36. D) It is required for all Transform streams
37. Explanation: Object mode streams emit JS objects instead of bytes; useful for parsing pipelines like `stream-json` or `csv-parse`.
38. Q6: Which module exposes the Promise-based `pipeline`?
39. A) node:stream
40. B) node:pipeline
41. C) node:stream/promises (*)
42. D) node:pipe
43. Explanation: `node:stream/promises` exports `pipeline` and `finished` as Promise-returning functions for async/await usage.
44. Q7: How do you consume a Readable with async/await?
45. A) readable.forEach(chunk => ...)
46. B) readable.map(chunk => ...)
47. C) readable.all()
48. D) for await (const chunk of readable) (*)
49. Explanation: Async iteration handles 'data'/'end'/'error' for you; just `for await (const chunk of readable)`.
50. Q8: What happens if you call `write()` on a Writable after `end()`?
51. A) It throws ERR_STREAM_WRITE_AFTER_END (*)
52. B) It silently no-ops
53. C) It queues the data
54. D) It restarts the stream
55. Explanation: After `end()`, the stream is closing; calling `write()` throws `ERR_STREAM_WRITE_AFTER_END`.
56. Q9: Which is true about `stream.finished`?
57. A) It only fires on success
58. B) It fires when a stream is no longer readable/writable (end, error, or destroy) (*)
59. C) It is a sync function
60. D) It is the same as pipeline
61. Explanation: `stream.finished(stream, cb)` calls back when the stream is done — either ended normally, errored, or was destroyed.
62. Q10: Which built-in module provides gzip compression streams?
63. A) node:compress
64. B) node:gzip
65. C) node:zlib (*)
66. D) node:crypto
67. Explanation: `node:zlib` exports `createGzip`, `createGunzip`, `createDeflate`, etc. — Transform streams for compression.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which API is the safe way to compose streams?
  options:
    - .pipe()
    - stream.pipeline
    - .connect()
    - .link()
  correctIndex: 1
  explanation: "`pipeline` propagates errors and destroys all streams on failure; `.pipe()` does not propagate errors and leaks resources."
- id: q2
  question: What is backpressure?
  options:
    - A type of stream error
    - The maximum chunk size
    - The signal from a slow consumer to a fast producer to pause
    - A pipe() option
  correctIndex: 2
  explanation: When a Writable's internal buffer fills, it returns `false` from `write()` and the source pauses until 'drain' fires — this is backpressure.
- id: q3
  question: Why is `.pipe()` considered dangerous?
  options:
    - It is slower than pipeline
    - It only works on object mode streams
    - It blocks the event loop
    - It does not propagate 'error' events between streams
  correctIndex: 3
  explanation: If one stream in a `.pipe()` chain errors, the others are not destroyed and the process leaks file descriptors; use `pipeline` instead.
- id: q4
  question: Which stream type transforms input into output?
  options:
    - Transform
    - Readable
    - Writable
    - Duplex
  correctIndex: 0
  explanation: A Transform is a Duplex stream where the output is a function of the input via a `transform(chunk, enc, cb)` method; e.g. zlib.createGzip.
- id: q5
  question: What does "object mode" mean for a stream?
  options:
    - It serializes objects to JSON
    - Chunks are JS objects rather than Buffers
    - It only accepts class instances
    - It is required for all Transform streams
  correctIndex: 1
  explanation: Object mode streams emit JS objects instead of bytes; useful for parsing pipelines like `stream-json` or `csv-parse`.
- id: q6
  question: Which module exposes the Promise-based `pipeline`?
  options:
    - node:stream
    - node:pipeline
    - node:stream/promises
    - node:pipe
  correctIndex: 2
  explanation: "`node:stream/promises` exports `pipeline` and `finished` as Promise-returning functions for async/await usage."
- id: q7
  question: How do you consume a Readable with async/await?
  options:
    - readable.forEach(chunk => ...)
    - readable.map(chunk => ...)
    - readable.all()
    - for await (const chunk of readable)
  correctIndex: 3
  explanation: Async iteration handles 'data'/'end'/'error' for you; just `for await (const chunk of readable)`.
- id: q8
  question: What happens if you call `write()` on a Writable after `end()`?
  options:
    - It throws ERR_STREAM_WRITE_AFTER_END
    - It silently no-ops
    - It queues the data
    - It restarts the stream
  correctIndex: 0
  explanation: After `end()`, the stream is closing; calling `write()` throws `ERR_STREAM_WRITE_AFTER_END`.
- id: q9
  question: Which is true about `stream.finished`?
  options:
    - It only fires on success
    - It fires when a stream is no longer readable/writable (end, error, or destroy)
    - It is a sync function
    - It is the same as pipeline
  correctIndex: 1
  explanation: "`stream.finished(stream, cb)` calls back when the stream is done — either ended normally, errored, or was destroyed."
- id: q10
  question: Which built-in module provides gzip compression streams?
  options:
    - node:compress
    - node:gzip
    - node:zlib
    - node:crypto
  correctIndex: 2
  explanation: "`node:zlib` exports `createGzip`, `createGunzip`, `createDeflate`, etc. — Transform streams for compression."
```

