---
slug: typescript-tooling-tsconfig-eslint-prettier
id: typescript-11
track: typescript
order: 11
title: Tooling — tsconfig, ESLint, Prettier
description: Configure tsconfig.json for strictness, set up ESLint with `typescript-eslint`, and integrate Prettier for consistent formatting.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=6000s
whyItMatters: Configure tsconfig. json for strictness, set up ESLint with `typescript-eslint`, and integrate Prettier for consistent formatting.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Tooling — tsconfig, ESLint, Prettier

## Tooling — tsconfig, ESLint, Prettier

### Why It Matters

Configure tsconfig. json for strictness, set up ESLint with `typescript-eslint`, and integrate Prettier for consistent formatting.

Configure tsconfig.json for strictness, set up ESLint with `typescript-eslint`, and integrate Prettier for consistent formatting.

### Prerequisites

- Stage 1: Getting Started with TypeScript.
- Stage 9: Modules, Namespaces, and Declaration Files.

### Topics

- `tsconfig.json` anatomy: `compilerOptions`, `include`, `exclude`
- Strict-mode flags: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `noUncheckedIndexedAccess`
- Project references and composite projects
- Path aliases (`paths`/`baseUrl`)
- ESLint with `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Type-aware rules (`typeof` checks, `no-floating-promises`)
- Prettier integration and `eslint-config-prettier`
- `tsc --watch` and editor integration

### Key Concepts

- `strict: true` is a shortcut enabling 8+ flags; new projects should always start strict.
- `noUncheckedIndexedAccess` adds `| undefined` to every indexed access — annoying at first but catches real bugs.
- ESLint's type-aware rules require `parserOptions.project` pointing at your tsconfig; they're slower but catch more bugs.
- Prettier and ESLint overlap on formatting; use `eslint-config-prettier` to disable ESLint's formatting rules.
- Path aliases (`"@/*": ["src/*"]`) need a matching resolver in your bundler (Vite `resolve.alias`, tsconfig-paths for Node).

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src"]
}
```
Caption: Strict tsconfig.json

### Common Pitfalls

- Setting `target: ES5` and `module: ESNext` together — `target` controls emitted JS syntax, `module` controls module format; mismatched combos can produce unrunnable output.
- Forgetting to mirror path aliases in the bundler — `tsc` resolves `@/foo` but Node/Vite/webpack still need their own alias config or runtime imports fail.
- Enabling type-aware ESLint rules project-wide without `parserOptions.project` — the rules silently no-op because they can't find types.
- Running ESLint on `.js` files with TS rules — use `ignores` to exclude `.js`/`.cjs` from TS-specific rules.
- Skipping `noUncheckedIndexedAccess` because it's noisy — the noise is real bugs; fix the indexing, don't disable the flag.

### Real-World Applications

- Vercel's frontend uses a single root `tsconfig.json` with project references for monorepo packages; ESLint runs per-package with type-aware rules.
- The TypeScript compiler itself uses ESLint with a custom config (`tslint` was retired in 2020 in favor of `typescript-eslint`).
- Airbnb's eslint-config-airbnb-typescript extends `@typescript-eslint` with hundreds of house-style rules.
- Linear's monorepo uses Turborepo + tsconfig project references so that `tsc --build` only re-checks changed packages.

### Interview Questions

- 1. What does `strict: true` enable? — A bundle of strictness flags including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, and others.
- 2. What is `noUncheckedIndexedAccess`? — A flag that adds `| undefined` to every indexed access (e.g., `arr[0]`), forcing you to handle the empty case.
- 3. Why does `typescript-eslint` need `parserOptions.project` for type-aware rules? — Type-aware rules require the program (type info) built from your tsconfig; without it, they no-op silently.
- 4. How do you disable ESLint's formatting rules when using Prettier? — Extend `eslint-config-prettier` last; it turns off all rules that conflict with Prettier.
- 5. What's the difference between `target` and `module` in tsconfig? — `target` controls emitted JS syntax (ES5/ES2022/...); `module` controls module format (CommonJS/ESNext).

### Mini Project

Configure a TypeScript Project from Scratch: Set up a small library with tsconfig (strict + `noUncheckedIndexedAccess`), ESLint (flat config + type-aware rules), Prettier, and a `lint`/`format`/`typecheck` npm script. Suggested approach:
  - Run `npm init -y` and install `typescript`, `eslint`, `typescript-eslint`, `prettier`, `eslint-config-prettier`
  - Create `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `isolatedModules`
  - Write `eslint.config.js` extending `recommendedTypeChecked`
  - Add `.prettierrc.json` and a `.prettierignore`
  - Add scripts: `"typecheck": "tsc --noEmit"`, `"lint": "eslint . "`, `"format": "prettier --write ."`

### Exercises

1. Generate a fresh `tsconfig.json` with `tsc --init`, then enable every `strict*` flag manually and confirm what `strict: true` covers.
2. Add `noUncheckedIndexedAccess` and refactor every `arr[i]` access to handle `| undefined`.
3. Set up ESLint flat config with `typescript-eslint` recommended-type-checked rules.
4. Add Prettier and `eslint-config-prettier`; verify formatting conflicts are resolved.
5. Configure a path alias `@/` -> `src/` in tsconfig and add the matching alias to a Vite or tsconfig-paths config.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `strict: true` enable in tsconfig?
9. A) Only `noImplicitAny`
10. B) Just `strictNullChecks`
11. C) A bundle of strictness flags including `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` (*)
12. D) Only `strictBindCallApply`
13. Explanation: `strict` is a shortcut enabling 8+ strictness flags at once, including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, and others.
14. Q2: What does `noUncheckedIndexedAccess` do?
15. A) Forbids indexing arrays
16. B) Disables `arr[0]` syntax
17. C) Enables index signatures
18. D) Adds `| undefined` to every indexed access result (*)
19. Explanation: With this flag, `arr[0]` is typed as `T | undefined` instead of `T`, forcing you to handle the empty case.
20. Q3: Which ESLint config extends last to defer formatting to Prettier?
21. A) `eslint-config-prettier` (*)
22. B) `eslint:recommended`
23. C) `@typescript-eslint/recommended`
24. D) `plugin:react/recommended`
25. Explanation: `eslint-config-prettier` turns off all ESLint rules that conflict with Prettier; it must be last so it overrides earlier rules.
26. Q4: What does `parserOptions.project` do in `typescript-eslint`?
27. A) Specifies the TS version
28. B) Points the parser at your tsconfig so type-aware rules work (*)
29. C) Sets the output directory
30. D) Enables strict mode
31. Explanation: Type-aware rules need a TS program (type info); `parserOptions.project` tells the parser which tsconfig to build it from.
32. Q5: What's the difference between `target` and `module` in tsconfig?
33. A) `target` = file format; `module` = JS syntax
34. B) They are the same
35. C) `target` = output JS syntax; `module` = module format (CJS/ESM) (*)
36. D) `target` is for Node; `module` is for the browser
37. Explanation: `target` controls emitted syntax (e.g., ES2022 keeps `class`); `module` controls module system (CommonJS, ESNext, NodeNext).
38. Q6: Which tsconfig setting enables `import x from "cjs-lib"` on CommonJS modules?
39. A) `allowJs: true`
40. B) `skipLibCheck: true`
41. C) `strict: true`
42. D) `esModuleInterop: true` (*)
43. Explanation: `esModuleInterop` synthesizes a default export for CJS modules, enabling the default-import syntax.
44. Q7: What is the modern ESLint config format (v9+) called?
45. A) Flat config (`eslint.config.js`) (*)
46. B) `.eslintrc.json`
47. C) `eslint.yaml`
48. D) `package.json` `eslintConfig`
49. Explanation: ESLint 9 ships flat config (`eslint.config.js`) as the default; the legacy `.eslintrc.*` formats are deprecated.
50. Q8: What is `skipLibCheck` for?
51. A) Skips checking your code
52. B) Skips type-checking of `.d.ts` files for speed (*)
53. C) Skips ESLint
54. D) Skips emit
55. Explanation: `skipLibCheck` skips type-checking declaration files (yours and dependencies'), speeding up compiles; it doesn't affect your source checking.
56. Q9: What does `isolatedModules` enforce?
57. A) Files cannot import each other
58. B) One module per project
59. C) Each file must compile independently — forces `import type` etc. (*)
60. D) Strict mode in each module
61. Explanation: `isolatedModules` ensures each file can be transpiled by single-file transpilers (esbuild/Babel/swc), requiring `import type` and forbidding re-exporting types as values.
62. Q10: Which path-alias configuration is correct for `@/foo` -> `src/foo`?
63. A) `"alias": { "@": "src" }`
64. B) `"resolve": { "@": "src" }`
65. C) `"map": { "@": "src" }`
66. D) `"paths": { "@/*": ["src/*"] }` with `"baseUrl": "."` (*)
67. Explanation: `paths` maps import specifiers to file paths, relative to `baseUrl`; both must be set for the alias to work in `tsc`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "What does `strict: true` enable in tsconfig?"
  options:
    - Only `noImplicitAny`
    - Just `strictNullChecks`
    - A bundle of strictness flags including `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`
    - Only `strictBindCallApply`
  correctIndex: 2
  explanation: "`strict` is a shortcut enabling 8+ strictness flags at once, including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, and others."
- id: q2
  question: What does `noUncheckedIndexedAccess` do?
  options:
    - Forbids indexing arrays
    - Disables `arr[0]` syntax
    - Enables index signatures
    - Adds `| undefined` to every indexed access result
  correctIndex: 3
  explanation: With this flag, `arr[0]` is typed as `T | undefined` instead of `T`, forcing you to handle the empty case.
- id: q3
  question: Which ESLint config extends last to defer formatting to Prettier?
  options:
    - "`eslint-config-prettier`"
    - "`eslint:recommended`"
    - "`@typescript-eslint/recommended`"
    - "`plugin:react/recommended`"
  correctIndex: 0
  explanation: "`eslint-config-prettier` turns off all ESLint rules that conflict with Prettier; it must be last so it overrides earlier rules."
- id: q4
  question: What does `parserOptions.project` do in `typescript-eslint`?
  options:
    - Specifies the TS version
    - Points the parser at your tsconfig so type-aware rules work
    - Sets the output directory
    - Enables strict mode
  correctIndex: 1
  explanation: Type-aware rules need a TS program (type info); `parserOptions.project` tells the parser which tsconfig to build it from.
- id: q5
  question: What's the difference between `target` and `module` in tsconfig?
  options:
    - "`target` = file format; `module` = JS syntax"
    - They are the same
    - "`target` = output JS syntax; `module` = module format (CJS/ESM)"
    - "`target` is for Node; `module` is for the browser"
  correctIndex: 2
  explanation: "`target` controls emitted syntax (e.g., ES2022 keeps `class`); `module` controls module system (CommonJS, ESNext, NodeNext)."
- id: q6
  question: Which tsconfig setting enables `import x from "cjs-lib"` on CommonJS modules?
  options:
    - "`allowJs: true`"
    - "`skipLibCheck: true`"
    - "`strict: true`"
    - "`esModuleInterop: true`"
  correctIndex: 3
  explanation: "`esModuleInterop` synthesizes a default export for CJS modules, enabling the default-import syntax."
- id: q7
  question: What is the modern ESLint config format (v9+) called?
  options:
    - Flat config (`eslint.config.js`)
    - "`.eslintrc.json`"
    - "`eslint.yaml`"
    - "`package.json` `eslintConfig`"
  correctIndex: 0
  explanation: ESLint 9 ships flat config (`eslint.config.js`) as the default; the legacy `.eslintrc.*` formats are deprecated.
- id: q8
  question: What is `skipLibCheck` for?
  options:
    - Skips checking your code
    - Skips type-checking of `.d.ts` files for speed
    - Skips ESLint
    - Skips emit
  correctIndex: 1
  explanation: "`skipLibCheck` skips type-checking declaration files (yours and dependencies'), speeding up compiles; it doesn't affect your source checking."
- id: q9
  question: What does `isolatedModules` enforce?
  options:
    - Files cannot import each other
    - One module per project
    - Each file must compile independently — forces `import type` etc.
    - Strict mode in each module
  correctIndex: 2
  explanation: "`isolatedModules` ensures each file can be transpiled by single-file transpilers (esbuild/Babel/swc), requiring `import type` and forbidding re-exporting types as values."
- id: q10
  question: Which path-alias configuration is correct for `@/foo` -> `src/foo`?
  options:
    - '`"alias": { "@": "src" }`'
    - '`"resolve": { "@": "src" }`'
    - '`"map": { "@": "src" }`'
    - '`"paths": { "@/*": ["src/*"] }` with `"baseUrl": "."`'
  correctIndex: 3
  explanation: "`paths` maps import specifiers to file paths, relative to `baseUrl`; both must be set for the alias to work in `tsc`."
```

