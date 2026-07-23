---
slug: typescript-modules-namespaces-declaration-files
id: typescript-09
track: typescript
order: 9
title: Modules, Namespaces, and Declaration Files
description: Organize code with ES modules, author declaration files (`.d.ts`) for untyped libraries, and understand the module-resolution modes.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=4500s
whyItMatters: Organize code with ES modules, author declaration files (`. d.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Modules, Namespaces, and Declaration Files

## Modules, Namespaces, and Declaration Files

### Why It Matters

Organize code with ES modules, author declaration files (`. d.

Organize code with ES modules, author declaration files (`.d.ts`) for untyped libraries, and understand the module-resolution modes.

### Prerequisites

- Stage 1: Getting Started with TypeScript.
- Stage 3: Interfaces and Type Aliases.

### Topics

- ES module syntax (`import`/`export`) and CommonJS interop
- Default vs named exports
- `import type` and `export type` (isolatedModules)
- Re-exports (`export { x } from "./mod"`)
- Namespaces (legacy) and why modern code uses modules
- Ambient declarations and `.d.ts` files
- Writing a module declaration for an untyped npm package
- `moduleResolution`: `node`, `node16`, `nodenext`, `bundler`

### Key Concepts

- TypeScript prefers ES modules; CommonJS interop is handled via `esModuleInterop` and `allowSyntheticDefaultImports`.
- `.d.ts` files contain only types — they describe shapes for JS code, including runtime JS you don't own.
- `import type` is required under `isolatedModules` so that single-file transpilers (esbuild, Babel, swc) can safely erase imports.
- `moduleResolution: bundler` is the modern default for Vite/webpack/esbuild projects; `nodenext` is correct for Node-native ESM.
- Triple-slash directives (`/// <reference types="node" />`) are legacy but still appear in `.d.ts` files.

```typescript
// math.ts
export const PI = 3.14159;
export function add(a: number, b: number): number { return a + b; }
export default function square(x: number): number { return x * x; }

// consumer.ts
import square, { add, PI } from "./math";
import type { AddFn } from "./math"; // type-only, erased by esbuild
```
Caption: ES module basics

### Common Pitfalls

- Forgetting `import type` under `isolatedModules` — esbuild/Babel can't tell whether an import is a value or a type, so TS errors if you mix them.
- Mixing default and named exports incorrectly — `import { default as square }` works but `import square from "./math"` is the idiomatic form when there's a default.
- Writing `.d.ts` files with `export =` syntax that doesn't match the runtime CommonJS shape — verify with a small test file.
- Using namespaces (`namespace X {}`) for new code — they predate ES modules and integrate poorly with tree-shaking; use modules instead.
- Setting `moduleResolution: node` for a Node 18+ project — use `nodenext` (or `bundler` for Vite/webpack) to get correct ESM/CJS resolution and `package.json` `exports` support.

### Real-World Applications

- DefinitelyTyped (`@types/*`) is the world's largest collection of `.d.ts` files, with over 8,000 packages; the React types alone are downloaded 30+ million times per week.
- NestJS modules are organized as ES modules with barrel `index.ts` files per feature directory.
- The Stripe Node SDK ships its own `.d.ts` files (no `@types/stripe` needed) — modern practice for libraries.
- Vite uses `moduleResolution: bundler` by default and supports `import type` natively for tree-shaken type imports.

### Interview Questions

- 1. What is the difference between `import` and `import type`? — `import type` brings in only types, which are erased at compile time; `import` brings in runtime values.
- 2. What is a `.d.ts` file? — A declaration file containing only types (no runtime code); used to describe the shape of JS code, including third-party libraries.
- 3. What does `esModuleInterop` do? — Enables default-import interop with CommonJS modules by synthesizing a default export.
- 4. What is `isolatedModules` and why does it matter? — It enforces that each file can be transpiled independently (required by esbuild/Babel/swc); forces `import type` and forbids re-exporting types without `export type`.
- 5. When should you use `moduleResolution: nodenext`? — For Node-native ESM projects; it correctly resolves `package.json` `exports` fields and `.mjs`/`.cjs` extensions.

### Mini Project

Build a typed Wrapper for an Untyped Library: Pick a small untyped npm package (or simulate one), write a `legacy-lib.d.ts` ambient declaration, and consume it from a typed module. Suggested approach:
  - Create `legacy/index.js` exporting `function doStuff(x) { return x.length; }`
  - Create `types/legacy.d.ts` with `declare module "legacy" { ... }`
  - Create `consumer.ts` that imports `doStuff` and uses it with full types
  - Add a re-exporting barrel `index.ts` with `export type` for the function type
  - Configure `tsconfig.json` with `"isolatedModules": true` and `"esModuleInterop": true`

### Exercises

1. Create a module `math.ts` with named exports and a default export; import both into `index.ts`.
2. Add a `import type` for a function type and verify it's erased in the emitted JS.
3. Write a `.d.ts` file for a tiny JS module that lacks types.
4. Set up a barrel file (`utils/index.ts`) that re-exports from three sub-modules.
5. Augment the Express `Request` interface with a custom `user` field and verify it appears in your handlers.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `import type { Foo } from "./mod"` do?
9. A) Imports only the type Foo, which is erased at compile time (*)
10. B) Imports the runtime value Foo
11. C) Imports both the value and the type
12. D) Creates a circular import
13. Explanation: `import type` is type-only; the import is fully erased in the emitted JS, satisfying `isolatedModules` constraints.
14. Q2: What is the purpose of a `.d.ts` file?
15. A) To run TypeScript code at runtime
16. B) To declare types for JS code (including third-party libs) without emitting runtime JS (*)
17. C) To replace tsconfig.json
18. D) To define CSS classes
19. Explanation: `.d.ts` files contain only type declarations — they describe shapes that TS can use to type-check, with no runtime output.
20. Q3: What does `esModuleInterop` enable?
21. A) Tree-shaking
22. B) Faster compiles
23. C) Default-import interop with CommonJS modules (*)
24. D) Strict mode
25. Explanation: `esModuleInterop` synthesizes a default export for CommonJS modules so that `import x from "cjs-lib"` works as expected.
26. Q4: Which `moduleResolution` is correct for a Node 20+ native-ESM project?
27. A) `node`
28. B) `classic`
29. C) `webpack`
30. D) `nodenext` (*)
31. Explanation: `nodenext` matches Node's actual ESM resolution, including `package.json` `exports` and `.mjs`/`.cjs` extensions.
32. Q5: Which feature does `isolatedModules` require?
33. A) `import type` for type-only imports (*)
34. B) Strict mode
35. C) Decorators
36. D) CommonJS
37. Explanation: Under `isolatedModules`, single-file transpilers (esbuild/Babel/swc) cannot tell type imports from value imports, so TS forces `import type`.
38. Q6: What is the modern replacement for `namespace`?
39. A) Global variables
40. B) ES modules (*)
41. C) Triple-slash directives
42. D) `declare global`
43. Explanation: ES modules are the standard for code organization; namespaces predate modules and tree-shake poorly.
44. Q7: What does `export * from "./math"` do?
45. A) Renames math's exports
46. B) Imports math at runtime
47. C) Re-exports all named exports of math (a "barrel") (*)
48. D) Deletes math's exports
49. Explanation: `export * from "./mod"` re-exports every named export of the source module, useful for building a barrel `index.ts`.
50. Q8: Which is the canonical source of community `.d.ts` files?
51. A) The TypeScript GitHub repo
52. B) MDN
53. C) W3C
54. D) npm `@types/*` packages from DefinitelyTyped (*)
55. Explanation: DefinitelyTyped is a community repo publishing `@types/<pkg>` packages on npm; the React types alone are downloaded tens of millions of times weekly.
56. Q9: What does `declare module "legacy" { ... }` create?
57. A) An ambient module declaration that types any `import "legacy"` (*)
58. B) A runtime module named legacy
59. C) A namespace
60. D) A circular import
61. Explanation: `declare module "name"` is an ambient declaration: TS treats any `import "name"` as having the declared shape, even though there's no TS source for it.
62. Q10: Which directive augments an existing module's types?
63. A) `namespace express { ... }`
64. B) `declare module "express" { interface Request { ... } }` after `import "express"` (*)
65. C) `// @ts-ignore`
66. D) `export default express`
67. Explanation: Module augmentation uses `declare module` with an `import` of the target module to merge new members into its existing types.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `import type { Foo } from "./mod"` do?
  options:
    - Imports only the type Foo, which is erased at compile time
    - Imports the runtime value Foo
    - Imports both the value and the type
    - Creates a circular import
  correctIndex: 0
  explanation: "`import type` is type-only; the import is fully erased in the emitted JS, satisfying `isolatedModules` constraints."
- id: q2
  question: What is the purpose of a `.d.ts` file?
  options:
    - To run TypeScript code at runtime
    - To declare types for JS code (including third-party libs) without emitting runtime JS
    - To replace tsconfig.json
    - To define CSS classes
  correctIndex: 1
  explanation: "`.d.ts` files contain only type declarations — they describe shapes that TS can use to type-check, with no runtime output."
- id: q3
  question: What does `esModuleInterop` enable?
  options:
    - Tree-shaking
    - Faster compiles
    - Default-import interop with CommonJS modules
    - Strict mode
  correctIndex: 2
  explanation: '`esModuleInterop` synthesizes a default export for CommonJS modules so that `import x from "cjs-lib"` works as expected.'
- id: q4
  question: Which `moduleResolution` is correct for a Node 20+ native-ESM project?
  options:
    - "`node`"
    - "`classic`"
    - "`webpack`"
    - "`nodenext`"
  correctIndex: 3
  explanation: "`nodenext` matches Node's actual ESM resolution, including `package.json` `exports` and `.mjs`/`.cjs` extensions."
- id: q5
  question: Which feature does `isolatedModules` require?
  options:
    - "`import type` for type-only imports"
    - Strict mode
    - Decorators
    - CommonJS
  correctIndex: 0
  explanation: Under `isolatedModules`, single-file transpilers (esbuild/Babel/swc) cannot tell type imports from value imports, so TS forces `import type`.
- id: q6
  question: What is the modern replacement for `namespace`?
  options:
    - Global variables
    - ES modules
    - Triple-slash directives
    - "`declare global`"
  correctIndex: 1
  explanation: ES modules are the standard for code organization; namespaces predate modules and tree-shake poorly.
- id: q7
  question: What does `export * from "./math"` do?
  options:
    - Renames math's exports
    - Imports math at runtime
    - Re-exports all named exports of math (a "barrel")
    - Deletes math's exports
  correctIndex: 2
  explanation: '`export * from "./mod"` re-exports every named export of the source module, useful for building a barrel `index.ts`.'
- id: q8
  question: Which is the canonical source of community `.d.ts` files?
  options:
    - The TypeScript GitHub repo
    - MDN
    - W3C
    - npm `@types/*` packages from DefinitelyTyped
  correctIndex: 3
  explanation: DefinitelyTyped is a community repo publishing `@types/<pkg>` packages on npm; the React types alone are downloaded tens of millions of times weekly.
- id: q9
  question: What does `declare module "legacy" { ... }` create?
  options:
    - An ambient module declaration that types any `import "legacy"`
    - A runtime module named legacy
    - A namespace
    - A circular import
  correctIndex: 0
  explanation: "`declare module \"name\"` is an ambient declaration: TS treats any `import \"name\"` as having the declared shape, even though there's no TS source for it."
- id: q10
  question: Which directive augments an existing module's types?
  options:
    - "`namespace express { ... }`"
    - '`declare module "express" { interface Request { ... } }` after `import "express"`'
    - "`// @ts-ignore`"
    - "`export default express`"
  correctIndex: 1
  explanation: Module augmentation uses `declare module` with an `import` of the target module to merge new members into its existing types.
```

