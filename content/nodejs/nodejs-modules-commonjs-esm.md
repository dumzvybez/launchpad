---
slug: nodejs-modules-commonjs-esm
id: nodejs-03
track: nodejs
order: 3
title: Modules — CommonJS and ESM
description: Understand CommonJS (`require`/`module.exports`) and ESM (`import`/`export`), how to enable ESM in Node, how to get `__dirname` in ESM, and how to interop between the two.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=60s
whyItMatters: Understand CommonJS (`require`/`module. exports`) and ESM (`import`/`export`), how to enable ESM in Node, how to get `__dirname` in ESM, and how to interop between the two.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Modules — CommonJS and ESM

## Modules — CommonJS and ESM

### Why It Matters

Understand CommonJS (`require`/`module. exports`) and ESM (`import`/`export`), how to enable ESM in Node, how to get `__dirname` in ESM, and how to interop between the two.

Understand CommonJS (`require`/`module.exports`) and ESM (`import`/`export`), how to enable ESM in Node, how to get `__dirname` in ESM, and how to interop between the two.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (microtask timing affects dynamic `import()`).

### Topics

- CommonJS: `require`, `module.exports`, `exports` alias, module caching
- ESM: `import`, `export`, default vs named exports, `import * as`
- Enabling ESM: `"type": "module"` in package.json, `.mjs` files
- Dynamic `import()` (returns a Promise; works in both CJS and ESM)
- `import.meta.url` and reconstructing `__dirname`/`__filename` in ESM
- Top-level await (ESM only)
- JSON modules, subpath imports/exports in package.json
- CJS/ESM interop: default import of CJS, named exports from CJS (caveats)

### Key Concepts

- CommonJS is synchronous and cached: `require("./foo")` returns the same `module.exports` object every time after first load.
- ESM is asynchronous and statically analyzable: imports are hoisted; supports tree-shaking and top-level await.
- `__dirname` and `__filename` are NOT defined in ESM — reconstruct with `fileURLToPath(import.meta.url)`.
- You cannot `require()` an ESM module — use dynamic `import()` instead; you can `import` a CommonJS module (its `module.exports` becomes the default export).
- Circular imports are handled differently: CJS gives partial `module.exports`, ESM gives a live binding.

```javascript
// math.cjs
function add(a, b) { return a + b; }
function mul(a, b) { return a * b; }

// Two ways to export — pick one; don't mix
module.exports = { add, mul };
// exports.add = add; exports.mul = mul;  // alternative

// consumer.cjs
const { add, mul } = require("./math.cjs");
console.log(add(2, 3));   // 5
```
Caption: CommonJS basics

### Common Pitfalls

- Using `__dirname` or `__filename` in ESM — they don't exist; reconstruct with `fileURLToPath(import.meta.url)` and `path.dirname()`.
- `require()`-ing an `.mjs` file — throws `ERR_REQUIRE_ESM`; you must use dynamic `import()` which returns a Promise.
- Setting `exports.foo = ...` after `module.exports = { ... }` — the assignment overwrites the original `exports` reference; the new properties go to the orphaned object.
- Expecting named exports from CommonJS to work in ESM — CJS modules only have a default export from ESM's perspective; named exports are statically detected (via cjs-module-lexer) but not guaranteed.
- Forgetting `"type": "module"` in package.json (or using `.mjs`) — Node silently treats your file as CommonJS and `import`/`export` throw `SyntaxError`.

### Real-World Applications

- Most popular npm packages now ship dual CJS/ESM builds (axios, chalk, lodash-es) to support both ecosystems.
- Next.js uses ESM internally for its build pipeline and encourages ESM in app code.
- Vite (used by Vue, Svelte, React) requires ESM in user code — its dev server resolves imports on the fly.
- Remix and SvelteKit are ESM-first; their config files use `import`/`export`.

### Interview Questions

- 1. What's the difference between CommonJS and ESM? — CJS is synchronous, uses `require`/`module.exports`, and is not statically analyzable; ESM is async, uses `import`/`export`, supports tree-shaking and top-level await.
- 2. How do you get `__dirname` in an ESM module? — `__dirname` doesn't exist; use `dirname(fileURLToPath(import.meta.url))` to reconstruct it.
- 3. Can you `require()` an ESM module from CommonJS? — No, this throws `ERR_REQUIRE_ESM`; use dynamic `import()` which returns a Promise.
- 4. What is top-level await and where is it supported? — Awaiting promises at the top level of a module (not inside an async function); ESM only, not CommonJS.
- 5. How does Node decide whether a file is CJS or ESM? — `.mjs` is always ESM, `.cjs` is always CJS, `.js` follows the nearest `package.json` `"type"` field (`"module"` = ESM, `"commonjs"` or absent = CJS).

### Mini Project

Build a Dual-module Utility Library: Author a small `mathy` package that exports `add`, `mul`, `factorial`, and a `sum(...nums)` function, shipping both as CommonJS (`mathy.cjs`) and ESM (`mathy.mjs`) and verified by a tiny test consumer in each format. Suggested approach:
  - Put logic in `src/mathy.mjs` and have `mathy.cjs` re-`require` via a CJS shim
  - Add `"type": "module"` and an `"exports"` field in package.json pointing to both
  - Write `test-cjs.cjs` using `require("./mathy.cjs")` and `test-esm.mjs` using `import`
  - Run both tests with `node` and confirm identical output
  - Add a `bin` field exposing a CLI that prints `sum(1,2,3)`

### Exercises

1. Create `math.cjs` exporting `add` and `mul`, then a consumer that `require`s and uses them.
2. Convert the same to `math.mjs` using `export`/`import` and run with `node`.
3. Reconstruct `__dirname` in an `.mjs` file and print it; verify it matches the CJS `__dirname`.
4. Use dynamic `import()` to lazy-load the `node:os` module only when a flag is passed.
5. Set up a package.json with `"exports"` exposing both `.cjs` and `.mjs` entry points and verify both resolve.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you enable ESM for `.js` files in a Node project?
9. A) Add `"module": true` to package.json
10. B) Use the `--esm` flag
11. C) Add `"type": "module"` to package.json (*)
12. D) Rename the file to `.esm`
13. Explanation: Setting `"type": "module"` in the nearest package.json makes all `.js` files in that package ESM by default.
14. Q2: What is `__dirname` in an ESM module?
15. A) The current directory
16. B) The user's home directory
17. C) The Node installation path
18. D) Undefined (ESM does not provide it) (*)
19. Explanation: `__dirname` and `__filename` are CommonJS-only; in ESM you reconstruct them via `fileURLToPath(import.meta.url)`.
20. Q3: Which of these is true about CommonJS?
21. A) It is synchronous and caches `require` results (*)
22. B) It is asynchronous
23. C) It supports top-level await
24. D) It uses `import`/`export`
25. Explanation: CommonJS `require()` is synchronous; the first call runs the module and caches `module.exports`, subsequent calls return the cached value.
26. Q4: What happens if you `require()` an `.mjs` file?
27. A) It works fine
28. B) It throws ERR_REQUIRE_ESM (*)
29. C) It silently returns undefined
30. D) It auto-converts to CJS
31. Explanation: `.mjs` files are ESM and cannot be `require()`-d; use dynamic `import()` which returns a Promise.
32. Q5: Which is a benefit of ESM over CommonJS?
33. A) Synchronous loading
34. B) Faster `require` calls
35. C) Static analysis and tree-shaking (*)
36. D) Access to `module.exports`
37. Explanation: ESM imports are statically analyzable, enabling bundlers to tree-shake (eliminate unused exports) and lint tools to detect issues.
38. Q6: What does `import.meta.url` provide in an ESM module?
39. A) The HTTP request URL
40. B) The npm registry URL
41. C) The package.json URL
42. D) The module's file:// URL (*)
43. Explanation: `import.meta.url` is the file:// URL of the current ESM module; wrap with `fileURLToPath()` to get a regular path.
44. Q7: Which file extension is always treated as ESM regardless of package.json?
45. A) .mjs (*)
46. B) .js
47. C) .cjs
48. D) .node
49. Explanation: `.mjs` is always ESM; `.cjs` is always CommonJS; `.js` follows the package.json `"type"` field.
50. Q8: What is top-level await?
51. A) Awaiting inside `main()`
52. B) Using `await` at the top level of a module, outside any async function (*)
53. C) Awaiting with `setImmediate`
54. D) A Promise.all at startup
55. Explanation: Top-level await lets you `await` promises directly in a module body; supported in ESM, not CommonJS.
56. Q9: When you `import` a CommonJS module from ESM, what becomes the default export?
57. A) The first named export
58. B) The package.json
59. C) `module.exports` (*)
60. D) Nothing; it errors
61. Explanation: ESM sees a CommonJS module's `module.exports` value as the default export; named exports may be statically detected but aren't guaranteed.
62. Q10: Which exports field in package.json controls the public API of a package?
63. A) main
64. B) module
65. C) public
66. D) exports (*)
67. Explanation: `"exports"` defines the public entry points and prevents deep imports of internal files; modern packages should set it.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you enable ESM for `.js` files in a Node project?
  options:
    - 'Add `"module": true` to package.json'
    - Use the `--esm` flag
    - 'Add `"type": "module"` to package.json'
    - Rename the file to `.esm`
  correctIndex: 2
  explanation: 'Setting `"type": "module"` in the nearest package.json makes all `.js` files in that package ESM by default.'
- id: q2
  question: What is `__dirname` in an ESM module?
  options:
    - The current directory
    - The user's home directory
    - The Node installation path
    - Undefined (ESM does not provide it)
  correctIndex: 3
  explanation: "`__dirname` and `__filename` are CommonJS-only; in ESM you reconstruct them via `fileURLToPath(import.meta.url)`."
- id: q3
  question: Which of these is true about CommonJS?
  options:
    - It is synchronous and caches `require` results
    - It is asynchronous
    - It supports top-level await
    - It uses `import`/`export`
  correctIndex: 0
  explanation: CommonJS `require()` is synchronous; the first call runs the module and caches `module.exports`, subsequent calls return the cached value.
- id: q4
  question: What happens if you `require()` an `.mjs` file?
  options:
    - It works fine
    - It throws ERR_REQUIRE_ESM
    - It silently returns undefined
    - It auto-converts to CJS
  correctIndex: 1
  explanation: "`.mjs` files are ESM and cannot be `require()`-d; use dynamic `import()` which returns a Promise."
- id: q5
  question: Which is a benefit of ESM over CommonJS?
  options:
    - Synchronous loading
    - Faster `require` calls
    - Static analysis and tree-shaking
    - Access to `module.exports`
  correctIndex: 2
  explanation: ESM imports are statically analyzable, enabling bundlers to tree-shake (eliminate unused exports) and lint tools to detect issues.
- id: q6
  question: What does `import.meta.url` provide in an ESM module?
  options:
    - The HTTP request URL
    - The npm registry URL
    - The package.json URL
    - The module's file:// URL
  correctIndex: 3
  explanation: "`import.meta.url` is the file:// URL of the current ESM module; wrap with `fileURLToPath()` to get a regular path."
- id: q7
  question: Which file extension is always treated as ESM regardless of package.json?
  options:
    - .mjs
    - .js
    - .cjs
    - .node
  correctIndex: 0
  explanation: '`.mjs` is always ESM; `.cjs` is always CommonJS; `.js` follows the package.json `"type"` field.'
- id: q8
  question: What is top-level await?
  options:
    - Awaiting inside `main()`
    - Using `await` at the top level of a module, outside any async function
    - Awaiting with `setImmediate`
    - A Promise.all at startup
  correctIndex: 1
  explanation: Top-level await lets you `await` promises directly in a module body; supported in ESM, not CommonJS.
- id: q9
  question: When you `import` a CommonJS module from ESM, what becomes the default export?
  options:
    - The first named export
    - The package.json
    - "`module.exports`"
    - Nothing; it errors
  correctIndex: 2
  explanation: ESM sees a CommonJS module's `module.exports` value as the default export; named exports may be statically detected but aren't guaranteed.
- id: q10
  question: Which exports field in package.json controls the public API of a package?
  options:
    - main
    - module
    - public
    - exports
  correctIndex: 3
  explanation: '`"exports"` defines the public entry points and prevents deep imports of internal files; modern packages should set it.'
```

