---
slug: javascript-modules-npm
id: javascript-10
track: javascript
order: 10
title: Modules and npm
description: Organize code with ES modules, manage dependencies with npm, and understand the package ecosystem.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=7600s
whyItMatters: Organize code with ES modules, manage dependencies with npm, and understand the package ecosystem.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Modules and npm

## Modules and npm

### Why It Matters

Organize code with ES modules, manage dependencies with npm, and understand the package ecosystem.

Organize code with ES modules, manage dependencies with npm, and understand the package ecosystem.

### Prerequisites

- Stage 9: ES6+ Features and Modern Syntax
- Comfort with the Node REPL and basic command line.

### Topics

- ES modules: import, export, default, named, namespace
- Dynamic import() for code-splitting
- CommonJS (require/module.exports) and interop
- package.json — scripts, dependencies, semver
- npm install, npm ci, npm audit
- devDependencies vs dependencies vs peerDependencies
- Lockfiles (package-lock.json, yarn.lock, pnpm-lock.yaml)
- Package managers compared: npm, yarn, pnpm

### Key Concepts

- ES modules are static (imports analyzed at parse time) — enables tree-shaking
- Default export is one per module; named exports are unlimited
- `import()` returns a Promise — load code on demand, perfect for routes/lazy components
- Semver: `^1.2.3` allows 1.x.x (minor+patch); `~1.2.3` allows 1.2.x (patch only); `1.2.3` is exact
- `npm ci` installs from the lockfile exactly — for CI, reproducibility, and faster installs
- Peer dependencies are not installed automatically (npm 7+ does); they signal compatibility, not inclusion

```javascript
// math.js
export const add = (a, b) => a + b;
export const mul = (a, b) => a * b;
export default function subtract(a, b) { return a - b; }

// main.js
import subtract, { add, mul } from "./math.js";
import * as math from "./math.js";
console.log(subtract(5, 2), add(1, 2), math.mul(3, 4));
```
Caption: Named and default exports

### Common Pitfalls

- Mixing ESM and CommonJS without "type": "module" — Node treats `.js` as CommonJS by default; use `.mjs`, set `"type": "module"`, or use dynamic import.
- Trusting `npm install` over `npm ci` in CI — `install` may rewrite the lockfile; `ci` enforces exact versions and reproducible builds.
- Committing `node_modules` — never; rely on the lockfile; add node_modules to .gitignore.
- Forgetting `^` is not "latest" — `^1.2.3` allows 1.x.x, NOT 2.x; if you want latest, you must explicitly upgrade.
- Treating peerDependencies like dependencies — peer deps signal "your app must provide this"; ensure compatibility, don't double-install.

### Real-World Applications

- npm hosts over 2 million packages and serves 200+ billion downloads a week; essentially every JavaScript project depends on it (Microsoft/GitHub owns npm).
- Vite (created by Evan You, used by Vue, Svelte, Astro) leverages native ESM in dev mode for instant startup — no bundling step.
- Next.js uses dynamic import() for route-level code-splitting, shipping millions of pages per day for Vercel customers.
- React's own package uses peerDependencies for `react-dom` so a single React instance is shared across libraries (avoiding hooks errors).

### Interview Questions

- 1. Difference between ES modules and CommonJS? — ESM is static, async, supports tree-shaking, and uses import/export; CJS is synchronous, dynamic, uses require/module.exports.
- 2. What is `npm ci` and when to use it? — Clean install from the lockfile; faster and stricter than `install`; used in CI for reproducibility.
- 3. What does `^1.2.3` allow? — All 1.x.x versions (minor + patch), but NOT 2.0.0 — semver caret allows compatible updates.
- 4. What is dynamic import? — `import()` returns a Promise, enabling runtime/conditional code loading for code-splitting and lazy routes.
- 5. What are peerDependencies for? — Declaring that your package expects the consumer to provide a dependency (e.g., a React UI library declaring react as peer) to avoid version conflicts.

### Mini Project

Build and publish a tiny utility library `string-tools` (locally) with functions `capitalize`, `slugify`, `camelCase`, `truncate`, and `wordCount`. It exports an ESM module and includes a basic test file. Suggested approach:
  - Create package.json with `"type": "module"` and `"exports"` for dual ESM/CJS
  - Write each function in `src/index.js` with named exports
  - Add a `README.md` with usage examples
  - Add an npm `test` script that runs vitest (or node:test)
  - Run `npm pack` to produce the tarball (don't actually publish) and inspect its contents

### Exercises

1. Convert a 3-file CommonJS project to ESM — update package.json and change require/module.exports to import/export.
2. Use dynamic `import()` to load a module only when a button is clicked; show the network tab.
3. Inspect a `package-lock.json` and explain what `integrity`, `resolved`, and `requires` mean.
4. Add an npm `prepare` script that runs the build on every `npm install`.
5. Use `npm audit` and `npm audit fix --dry-run` to identify a vulnerable transitive dependency.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is a default export?
9. A) export const x
10. B) export default function foo() {} (*)
11. C) export { x }
12. D) import x
13. Explanation: A module can have exactly one default export, imported without braces.
14. Q2: `import("./mod.js")` returns:
15. A) The module object directly
16. B) A Promise resolving to the module (*)
17. C) A function
18. D) undefined
19. Explanation: Dynamic import() is async and returns a Promise, enabling lazy loading and code-splitting.
20. Q3: `^1.2.3` allows:
21. A) Only 1.2.3
22. B) 1.x.x — minor and patch updates (*)
23. C) Any 1.x or 2.x
24. D) The latest version
25. Explanation: Caret allows changes that don't modify the leftmost non-zero digit — for ^1.2.3, that's 1.x.x.
26. Q4: `npm ci` is used for:
27. A) Interactive installs
28. B) Reproducible installs from the lockfile (*)
29. C) Installing CI tools
30. D) Publishing packages
31. Explanation: ci removes node_modules and installs exactly per the lockfile — faster and stricter for CI.
32. Q5: ES modules are:
33. A) Synchronous, dynamic
34. B) Static, async, tree-shakable (*)
35. C) Always CommonJS
36. D) Deprecated
37. Explanation: ESM imports are analyzed at parse time, enabling dead-code elimination (tree-shaking) and async loading.
38. Q6: `peerDependencies` are:
39. A) Always installed automatically
40. B) Expected to be provided by the consumer (*)
41. C) The same as devDependencies
42. D) Removed in npm 7
43. Explanation: Peer deps signal compatibility (e.g., UI lib needs your React); npm 7+ auto-installs but the contract is still "consumer provides".
44. Q7: Which file tells Node to treat .js as ESM?
45. A) "type": "module" in package.json (*)
46. B) .eslintrc
47. C) tsconfig.json
48. D) webpack.config.js
49. Explanation: Setting "type": "module" makes .js files ESM; alternatively use .mjs extension.
50. Q8: Lockfiles exist to:
51. A) Lock the registry
52. B) Ensure reproducible installs across machines (*)
53. C) Block npm install
54. D) Replace package.json
55. Explanation: Lockfiles pin exact versions and integrity hashes, giving identical installs everywhere.
56. Q9: Which is a named import?
57. A) import foo from "mod"
58. B) import { foo } from "mod" (*)
59. C) import * as mod from "mod"
60. D) import "mod"
61. Explanation: Braces import specific named exports; without braces imports the default.
62. Q10: `import * as math from "./math.js"`:
63. A) Imports only the default
64. B) Imports the whole module namespace as `math` (*)
65. C) Throws
66. D) Is dynamic
67. Explanation: Namespace import gives you every export under one name: math.add, math.mul, etc.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is a default export?
  options:
    - export const x
    - export default function foo() {}
    - export { x }
    - import x
  correctIndex: 1
  explanation: A module can have exactly one default export, imported without braces.
- id: q2
  question: '`import("./mod.js")` returns:'
  options:
    - The module object directly
    - A Promise resolving to the module
    - A function
    - undefined
  correctIndex: 1
  explanation: Dynamic import() is async and returns a Promise, enabling lazy loading and code-splitting.
- id: q3
  question: "`^1.2.3` allows:"
  options:
    - Only 1.2.3
    - 1.x.x — minor and patch updates
    - Any 1.x or 2.x
    - The latest version
  correctIndex: 1
  explanation: Caret allows changes that don't modify the leftmost non-zero digit — for ^1.2.3, that's 1.x.x.
- id: q4
  question: "`npm ci` is used for:"
  options:
    - Interactive installs
    - Reproducible installs from the lockfile
    - Installing CI tools
    - Publishing packages
  correctIndex: 1
  explanation: ci removes node_modules and installs exactly per the lockfile — faster and stricter for CI.
- id: q5
  question: "ES modules are:"
  options:
    - Synchronous, dynamic
    - Static, async, tree-shakable
    - Always CommonJS
    - Deprecated
  correctIndex: 1
  explanation: ESM imports are analyzed at parse time, enabling dead-code elimination (tree-shaking) and async loading.
- id: q6
  question: "`peerDependencies` are:"
  options:
    - Always installed automatically
    - Expected to be provided by the consumer
    - The same as devDependencies
    - Removed in npm 7
  correctIndex: 1
  explanation: Peer deps signal compatibility (e.g., UI lib needs your React); npm 7+ auto-installs but the contract is still "consumer provides".
- id: q7
  question: Which file tells Node to treat .js as ESM?
  options:
    - '"type": "module" in package.json'
    - .eslintrc
    - tsconfig.json
    - webpack.config.js
  correctIndex: 0
  explanation: 'Setting "type": "module" makes .js files ESM; alternatively use .mjs extension.'
- id: q8
  question: "Lockfiles exist to:"
  options:
    - Lock the registry
    - Ensure reproducible installs across machines
    - Block npm install
    - Replace package.json
  correctIndex: 1
  explanation: Lockfiles pin exact versions and integrity hashes, giving identical installs everywhere.
- id: q9
  question: Which is a named import?
  options:
    - import foo from "mod"
    - import { foo } from "mod"
    - import * as mod from "mod"
    - import "mod"
  correctIndex: 1
  explanation: Braces import specific named exports; without braces imports the default.
- id: q10
  question: '`import * as math from "./math.js"`:'
  options:
    - Imports only the default
    - Imports the whole module namespace as `math`
    - Throws
    - Is dynamic
  correctIndex: 1
  explanation: "Namespace import gives you every export under one name: math.add, math.mul, etc."
```

