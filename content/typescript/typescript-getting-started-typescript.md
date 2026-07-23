---
slug: typescript-getting-started-typescript
id: typescript-01
track: typescript
order: 1
title: Getting Started with TypeScript
description: Install the TypeScript compiler, compile your first .ts file, and understand the relationship between TypeScript and JavaScript at runtime.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YmxwicpROps
whyItMatters: Install the TypeScript compiler, compile your first. ts file, and understand the relationship between TypeScript and JavaScript at runtime.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Getting Started with TypeScript

## Getting Started with TypeScript

### Why It Matters

Install the TypeScript compiler, compile your first. ts file, and understand the relationship between TypeScript and JavaScript at runtime.

Install the TypeScript compiler, compile your first .ts file, and understand the relationship between TypeScript and JavaScript at runtime.

### Prerequisites

- None — basic JavaScript knowledge is helpful but not required.
- Comfort using a terminal and a code editor (VS Code recommended).

### Topics

- What TypeScript is and what it is not (compile-time only, erasure)
- Installing Node.js LTS and the `typescript` package globally vs locally
- The `tsc` compiler and `npx tsc --init`
- Compiling a single .ts file to .js
- Strict mode preview (`"strict": true`)
- Watching files with `--watch`
- The role of .d.ts declaration files (preview)
- ts-node, tsx, and Bun as TypeScript runners

### Key Concepts

- TypeScript is a superset of JavaScript: every valid .js file is a valid .ts file.
- Types are erased at runtime; the emitted JavaScript contains no type annotations.
- The compiler (`tsc`) performs type-checking AND emits JavaScript (these are separable).
- `tsc --noEmit` runs type-checking only — used by editors and CI for fast feedback.
- TypeScript version 5.x is the current standard (5.0 shipped March 2023, 5.7 by late 2024).

```typescript
// hello.ts
const message: string = "Hello, TypeScript!";
console.log(message);
```
Caption: Hello World in TypeScript

### Common Pitfalls

- Expecting types to exist at runtime — `typeof` in JS sees only the erased values; you cannot reflect on TS interfaces at runtime without a library like `ts-morph`.
- Installing TypeScript globally once and never updating — projects pin specific TS versions in package.json devDependencies for reproducible builds.
- Running `tsc` on a single file ignores tsconfig.json — use `tsc -p .` or `tsc --noEmit` from the project root to use the config.
- Confusing `tsc` (compiler) with `ts-node` (runner) — `ts-node` is slow on cold start; `tsx` (esbuild-based) is 10-50x faster for dev.
- Forgetting that `tsc` will silently emit even on type errors by default — set `"noEmitOnError": true` in tsconfig to prevent shipping broken JS.

### Real-World Applications

- VS Code is written in TypeScript; the language server protocol implementation is itself a TS library shipped to npm as `vscode-languageserver-node`.
- Slack's desktop client (and much of its admin web app) is TypeScript on top of Electron.
- Airbnb migrated its 5+ million-line frontend from JavaScript to TypeScript between 2017 and 2019 and reported a 38% reduction in production errors.
- Asana's frontend has been TypeScript since 2016, providing the type-safe substrate for their `store` data-graph library.

### Interview Questions

- 1. What is TypeScript and how does it relate to JavaScript? — TS is a strict superset of JS that adds optional static typing, compiled (transpiled) to plain JS with types erased at runtime.
- 2. Does TypeScript run in the browser or Node? — Neither directly; the browser/Node runs the emitted JavaScript. TS itself is a build-time tool.
- 3. Who created TypeScript and when was it first released? — Anders Hejlsberg at Microsoft; first public release was October 2012 (version 0.8).
- 4. What is `tsc --noEmit` used for? — Type-checking only without producing JS; used in editors and CI for fast feedback.
- 5. Name two ways to run a .ts file without manually compiling. — `tsx file.ts` (esbuild) or `ts-node file.ts` (JIT transpile via ts-node).

### Mini Project

Build a Greeter CLI in TypeScript: A small CLI that takes a name from `process.argv`, prints a greeting, and demonstrates type annotations on a function. Suggested approach:
  - Initialize the project with `npm init -y` and `npm i -D typescript @types/node tsx`
  - Create `tsconfig.json` via `npx tsc --init` and enable `"strict": true`
  - Write `greet.ts` with a `greet(name: string): string` function
  - Read `process.argv[2]` and guard against `undefined`
  - Run with `npx tsx greet.ts World` and observe the output

### Exercises

1. Install Node.js LTS and confirm `node --version` prints v20 or higher.
2. Install TypeScript locally: `npm i -D typescript` and run `npx tsc --version`.
3. Create `hello.ts` with an annotated `const greeting: string` and compile it; inspect the emitted `hello.js` and confirm the annotation is gone.
4. Enable `"strict": true` in tsconfig.json and introduce a deliberate type error (e.g., `const n: number = "x"`); observe the compiler reports it.
5. Run the same file with `npx tsx hello.ts` and confirm no .js file is emitted.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does TypeScript compile to?
9. A) Plain JavaScript (*)
10. B) WebAssembly
11. C) Python bytecode
12. D) C# IL
13. Explanation: TypeScript's compiler erases type annotations and emits plain JavaScript that runs in any JS environment.
14. Q2: Who created TypeScript?
15. A) Bjarne Stroustrup
16. B) Anders Hejlsberg (*)
17. C) James Gosling
18. D) Guido van Rossum
19. Explanation: Anders Hejlsberg, also lead architect of C# and Delphi, led the TypeScript design at Microsoft starting in 2010.
20. Q3: Are TypeScript type annotations available at runtime?
21. A) Yes, via `Reflect.getType`
22. B) Yes, via `Symbol.type`
23. C) No — they are erased during compilation (*)
24. D) Only when using decorators
25. Explanation: TS types are a compile-time construct; the emitted JS contains zero type information (with the exception of `emitDecoratorMetadata`).
26. Q4: Which command runs type-checking without emitting JavaScript?
27. A) `tsc --checkOnly`
28. B) `tsc --dryRun`
29. C) `tsc --typecheck`
30. D) `tsc --noEmit` (*)
31. Explanation: `--noEmit` performs full type-checking and reports errors but writes no .js files; it is the standard CI command.
32. Q5: Which runner is fastest for executing .ts files during development?
33. A) tsx (esbuild-based) (*)
34. B) ts-node
35. C) tsc --watch && node
36. D) nodemon with babel
37. Explanation: `tsx` uses esbuild to transpile on the fly and is typically 10-50x faster than ts-node on cold starts.
38. Q6: What happens by default if `tsc` finds type errors?
39. A) It refuses to emit any output
40. B) It still emits JavaScript but reports the errors (*)
41. C) It deletes the source files
42. D) It crashes the editor
43. Explanation: Unless `noEmitOnError` is true, `tsc` emits JS anyway — useful for incremental migration but dangerous in CI.
44. Q7: Which tsconfig flag prevents emitting on type errors?
45. A) `strictEmit: true`
46. B) `failOnError: true`
47. C) `noEmitOnError: true` (*)
48. D) `emitOnError: false`
49. Explanation: `noEmitOnError` stops `tsc` from writing .js files when any error exists — the recommended CI default.
50. Q8: Which package provides Node.js type definitions?
51. A) `@types/nodejs`
52. B) `node-types`
53. C) `node-typings`
54. D) `@types/node` (*)
55. Explanation: DefinitelyTyped publishes Node's ambient types as `@types/node`; install it as a dev dependency.
56. Q9: What is the first public release year of TypeScript?
57. A) 2012 (*)
58. B) 2009
59. C) 2010
60. D) 2015
61. Explanation: TypeScript 0.8 was publicly released in October 2012; the first stable 1.0 shipped in April 2014.
62. Q10: Every valid JavaScript file is also a valid...?
63. A) Java file
64. B) TypeScript file (*)
65. C) Python file
66. D) WebAssembly file
67. Explanation: TypeScript is a syntactic superset of JavaScript, so any .js renamed to .ts is initially valid (though `tsc` may surface type issues once annotations are added).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does TypeScript compile to?
  options:
    - Plain JavaScript
    - WebAssembly
    - Python bytecode
    - C# IL
  correctIndex: 0
  explanation: TypeScript's compiler erases type annotations and emits plain JavaScript that runs in any JS environment.
- id: q2
  question: Who created TypeScript?
  options:
    - Bjarne Stroustrup
    - Anders Hejlsberg
    - James Gosling
    - Guido van Rossum
  correctIndex: 1
  explanation: Anders Hejlsberg, also lead architect of C# and Delphi, led the TypeScript design at Microsoft starting in 2010.
- id: q3
  question: Are TypeScript type annotations available at runtime?
  options:
    - Yes, via `Reflect.getType`
    - Yes, via `Symbol.type`
    - No — they are erased during compilation
    - Only when using decorators
  correctIndex: 2
  explanation: TS types are a compile-time construct; the emitted JS contains zero type information (with the exception of `emitDecoratorMetadata`).
- id: q4
  question: Which command runs type-checking without emitting JavaScript?
  options:
    - "`tsc --checkOnly`"
    - "`tsc --dryRun`"
    - "`tsc --typecheck`"
    - "`tsc --noEmit`"
  correctIndex: 3
  explanation: "`--noEmit` performs full type-checking and reports errors but writes no .js files; it is the standard CI command."
- id: q5
  question: Which runner is fastest for executing .ts files during development?
  options:
    - tsx (esbuild-based)
    - ts-node
    - tsc --watch && node
    - nodemon with babel
  correctIndex: 0
  explanation: "`tsx` uses esbuild to transpile on the fly and is typically 10-50x faster than ts-node on cold starts."
- id: q6
  question: What happens by default if `tsc` finds type errors?
  options:
    - It refuses to emit any output
    - It still emits JavaScript but reports the errors
    - It deletes the source files
    - It crashes the editor
  correctIndex: 1
  explanation: Unless `noEmitOnError` is true, `tsc` emits JS anyway — useful for incremental migration but dangerous in CI.
- id: q7
  question: Which tsconfig flag prevents emitting on type errors?
  options:
    - "`strictEmit: true`"
    - "`failOnError: true`"
    - "`noEmitOnError: true`"
    - "`emitOnError: false`"
  correctIndex: 2
  explanation: "`noEmitOnError` stops `tsc` from writing .js files when any error exists — the recommended CI default."
- id: q8
  question: Which package provides Node.js type definitions?
  options:
    - "`@types/nodejs`"
    - "`node-types`"
    - "`node-typings`"
    - "`@types/node`"
  correctIndex: 3
  explanation: DefinitelyTyped publishes Node's ambient types as `@types/node`; install it as a dev dependency.
- id: q9
  question: What is the first public release year of TypeScript?
  options:
    - "2012"
    - "2009"
    - "2010"
    - "2015"
  correctIndex: 0
  explanation: TypeScript 0.8 was publicly released in October 2012; the first stable 1.0 shipped in April 2014.
- id: q10
  question: Every valid JavaScript file is also a valid...?
  options:
    - Java file
    - TypeScript file
    - Python file
    - WebAssembly file
  correctIndex: 1
  explanation: TypeScript is a syntactic superset of JavaScript, so any .js renamed to .ts is initially valid (though `tsc` may surface type issues once annotations are added).
```

