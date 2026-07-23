---
slug: javascript-tooling-bundlers-transpilers-linters
id: javascript-19
track: javascript
order: 19
title: Tooling — Bundlers, Transpilers, Linters
description: Configure the modern JS toolchain — Vite, esbuild, SWC, Babel, ESLint, and Prettier — to build, format, and lint production code.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=15600s
whyItMatters: Configure the modern JS toolchain — Vite, esbuild, SWC, Babel, ESLint, and Prettier — to build, format, and lint production code.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Tooling — Bundlers, Transpilers, Linters

## Tooling — Bundlers, Transpilers, Linters

### Why It Matters

Configure the modern JS toolchain — Vite, esbuild, SWC, Babel, ESLint, and Prettier — to build, format, and lint production code.

Configure the modern JS toolchain — Vite, esbuild, SWC, Babel, ESLint, and Prettier — to build, format, and lint production code.

### Prerequisites

- Stage 18: Security — XSS, CSRF, CSP, and Sanitization
- Comfort with npm (Stage 10) and ES modules.

### Topics

- Why bundle: fewer requests, tree-shaking, minification
- Vite (dev server + Rollup build) and esbuild (Go-based transpiler)
- SWC (Rust-based) vs Babel (JS-based) for transpilation
- Babel presets and plugins (TypeScript strip, JSX, decorators)
- ESLint: flat config, rules, plugins, shareable configs
- Prettier: opinionated formatter; running on save and in CI
- Source maps in dev and prod
- Monorepos: pnpm workspaces, Turborepo, Nx (overview)

### Key Concepts

- Bundlers combine modules into optimized chunks; transpilers convert newer syntax (TS, JSX) to plain JS
- Vite serves ESM in dev (instant startup) and bundles with Rollup in prod
- esbuild/SWC are 10-100x faster than Babel because they're written in Go/Rust
- ESLint finds bugs and enforces style; Prettier formats; they overlap only on style rules (use eslint-config-prettier)
- Source maps let DevTools show original source in dev and enable production stack traces
- Tree-shaking requires ESM and "sideEffects": false in package.json

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["chart.js"],
        },
      },
    },
  },
});
```
Caption: Vite config

### Common Pitfalls

- Shipping source maps to production — exposes original source; either omit them or serve only to error trackers.
- Transpiling too aggressively — modern browsers don't need ES5; target ES2020+ to ship less code.
- Running Prettier and ESLint with conflicting style rules — use eslint-config-prettier to disable ESLint's style rules.
- Forgetting "sideEffects": false in package.json — bundlers can't tree-shake your library, bloating consumers.
- Bundling everything into one chunk — loses caching benefits; split vendor and route chunks.

### Real-World Applications

- Vite (created by Evan You) is used by Vue, SvelteKit, Astro, and Remix; serves ESM in dev for instant startup.
- Next.js uses SWC (Rust-based) for compilation and minification, cutting build times by 70% vs Babel for Vercel customers.
- ESLint is used by virtually every JS codebase including Meta's React, Airbnb's config, and Google's TypeScript style.
- Turborepo (Vercel) and Nx (Nrwl) orchestrate monorepo builds for companies like Stripe, Microsoft, and GitHub.

### Interview Questions

- 1. Why bundle JavaScript? — Fewer HTTP requests, tree-shaking, minification, module resolution, asset hashing.
- 2. Vite vs Webpack? — Vite serves native ESM in dev (instant startup), bundles with Rollup in prod; Webpack bundles in dev too (slower start).
- 3. Why is esbuild/SWC faster than Babel? — They're written in Go/Rust, compile to native, and parallelize; Babel is JS-based and single-threaded.
- 4. What's the difference between ESLint and Prettier? — ESLint finds bugs and enforces SOME style; Prettier is purely an opinionated formatter; use eslint-config-prettier to avoid conflicts.
- 5. What does "sideEffects": false do? — Tells bundlers the package has no side-effectful imports, enabling tree-shaking of unused exports.

### Mini Project

Set up a tiny Vite + ESLint + Prettier project from scratch: a one-page app that fetches a joke from a public API and renders it. Configure lint-on-save and a CI check. It outputs a dev server URL. Suggested approach:
  - `npm create vite@latest` (Vanilla template), then `npm i -D eslint prettier eslint-config-prettier`
  - Add eslint.config.js with recommended rules + prettier config
  - Add .prettierrc with `semi: true, singleQuote: false`
  - Write a fetch call to https://official-joke-api.appspot.com/random_joke
  - Add a GitHub Action that runs `npm run lint && npm run format:check && npm run build`

### Exercises

1. Initialize a Vite project; configure manualChunks to split vendor and app code.
2. Add ESLint with a custom rule that bans `var` (enforces let/const).
3. Set up Prettier with `formatOnSave` in VS Code settings; verify on a sample file.
4. Compare Babel vs SWC build times on a sample 100-file project; report the ratio.
5. Add "sideEffects": false to a package.json; demonstrate tree-shaking of an unused export.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Bundlers exist primarily to:
9. A) Replace npm
10. B) Combine modules, tree-shake, minify, and reduce HTTP requests (*)
11. C) Run tests
12. D) Serve HTTPS
13. Explanation: Bundlers merge modules into optimized chunks, dead-code eliminate, minify, and hash filenames for caching.
14. Q2: Vite is fast in dev because:
15. A) It bundles everything upfront
16. B) It serves native ESM, only transforming on demand (*)
17. C) It uses WebAssembly
18. D) It skips parsing
19. Explanation: Vite leverages native browser ESM, transforming only the requested module — instant startup even on big apps.
20. Q3: esbuild and SWC are faster than Babel because they're:
21. A) Written in JS
22. B) Written in Go/Rust and parallelized (*)
23. C) Compiled to WebAssembly only
24. D) Slower than Babel
25. Explanation: Native binaries with parallelism are 10-100x faster than JS-based Babel for transpilation.
26. Q4: ESLint primarily:
27. A) Formats code
28. B) Finds bugs and enforces rules (*)
29. C) Bundles modules
30. D) Runs tests
31. Explanation: ESLint is a static analyzer; it can fix style too, but its main job is bug/rule enforcement.
32. Q5: Prettier is:
33. A) A linter
34. B) An opinionated code formatter (*)
35. C) A bundler
36. D) A test runner
37. Explanation: Prettier reformats code to a consistent style with no configuration beyond minor options; pair with ESLint via eslint-config-prettier.
38. Q6: Source maps in production:
39. A) Are always required
40. B) Should usually be omitted or served only to error trackers to avoid leaking source (*)
41. C) Speed up the site
42. D) Replace minification
43. Explanation: Public source maps expose original code; use hidden maps uploaded to Sentry/Datadog instead.
44. Q7: "sideEffects": false in package.json:
45. A) Marks the package as broken
46. B) Enables tree-shaking of unused exports (*)
47. C) Disables the package
48. D) Is required by npm
49. Explanation: It tells the bundler the package has no side-effectful imports, so unused exports can be dropped.
50. Q8: To avoid ESLint/Prettier conflicts:
51. A) Disable ESLint entirely
52. B) Use eslint-config-prettier to turn off ESLint's style rules (*)
53. C) Use only Prettier
54. D) Use only ESLint
55. Explanation: eslint-config-prettier disables ESLint rules that conflict with Prettier, letting Prettier own formatting.
56. Q9: Modern JS builds typically target:
57. A) ES5
58. B) ES2020+ — modern browsers don't need ES5 transpilation (*)
59. C) Internet Explorer 6
60. D) WebAssembly
61. Explanation: Transpiling to ES5 bloats bundles; target ES2020+ to ship less code to evergreen browsers.
62. Q10: Manual chunking in a build:
63. A) Bundles everything as one file
64. B) Splits vendor/route code into separate cacheable chunks (*)
65. C) Slows the build
66. D) Is automatic
67. Explanation: Splitting vendor from app code lets the browser cache vendor across deploys, speeding repeat visits.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "Bundlers exist primarily to:"
  options:
    - Replace npm
    - Combine modules, tree-shake, minify, and reduce HTTP requests
    - Run tests
    - Serve HTTPS
  correctIndex: 1
  explanation: Bundlers merge modules into optimized chunks, dead-code eliminate, minify, and hash filenames for caching.
- id: q2
  question: "Vite is fast in dev because:"
  options:
    - It bundles everything upfront
    - It serves native ESM, only transforming on demand
    - It uses WebAssembly
    - It skips parsing
  correctIndex: 1
  explanation: Vite leverages native browser ESM, transforming only the requested module — instant startup even on big apps.
- id: q3
  question: "esbuild and SWC are faster than Babel because they're:"
  options:
    - Written in JS
    - Written in Go/Rust and parallelized
    - Compiled to WebAssembly only
    - Slower than Babel
  correctIndex: 1
  explanation: Native binaries with parallelism are 10-100x faster than JS-based Babel for transpilation.
- id: q4
  question: "ESLint primarily:"
  options:
    - Formats code
    - Finds bugs and enforces rules
    - Bundles modules
    - Runs tests
  correctIndex: 1
  explanation: ESLint is a static analyzer; it can fix style too, but its main job is bug/rule enforcement.
- id: q5
  question: "Prettier is:"
  options:
    - A linter
    - An opinionated code formatter
    - A bundler
    - A test runner
  correctIndex: 1
  explanation: Prettier reformats code to a consistent style with no configuration beyond minor options; pair with ESLint via eslint-config-prettier.
- id: q6
  question: "Source maps in production:"
  options:
    - Are always required
    - Should usually be omitted or served only to error trackers to avoid leaking source
    - Speed up the site
    - Replace minification
  correctIndex: 1
  explanation: Public source maps expose original code; use hidden maps uploaded to Sentry/Datadog instead.
- id: q7
  question: '"sideEffects": false in package.json:'
  options:
    - Marks the package as broken
    - Enables tree-shaking of unused exports
    - Disables the package
    - Is required by npm
  correctIndex: 1
  explanation: It tells the bundler the package has no side-effectful imports, so unused exports can be dropped.
- id: q8
  question: "To avoid ESLint/Prettier conflicts:"
  options:
    - Disable ESLint entirely
    - Use eslint-config-prettier to turn off ESLint's style rules
    - Use only Prettier
    - Use only ESLint
  correctIndex: 1
  explanation: eslint-config-prettier disables ESLint rules that conflict with Prettier, letting Prettier own formatting.
- id: q9
  question: "Modern JS builds typically target:"
  options:
    - ES5
    - ES2020+ — modern browsers don't need ES5 transpilation
    - Internet Explorer 6
    - WebAssembly
  correctIndex: 1
  explanation: Transpiling to ES5 bloats bundles; target ES2020+ to ship less code to evergreen browsers.
- id: q10
  question: "Manual chunking in a build:"
  options:
    - Bundles everything as one file
    - Splits vendor/route code into separate cacheable chunks
    - Slows the build
    - Is automatic
  correctIndex: 1
  explanation: Splitting vendor from app code lets the browser cache vendor across deploys, speeding repeat visits.
```

