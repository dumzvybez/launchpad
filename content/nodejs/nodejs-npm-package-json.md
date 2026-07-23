---
slug: nodejs-npm-package-json
id: nodejs-11
track: nodejs
order: 11
title: npm and package.json
description: Master the package.json schema, semver ranges, npm scripts, `npm ci` for reproducible installs, the `exports` field, and publishing to the npm registry.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU
whyItMatters: Master the package. json schema, semver ranges, npm scripts, `npm ci` for reproducible installs, the `exports` field, and publishing to the npm registry.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# npm and package.json

## npm and package.json

### Why It Matters

Master the package. json schema, semver ranges, npm scripts, `npm ci` for reproducible installs, the `exports` field, and publishing to the npm registry.

Master the package.json schema, semver ranges, npm scripts, `npm ci` for reproducible installs, the `exports` field, and publishing to the npm registry.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 3: Modules — CommonJS and ESM (the `"type"` field).

### Topics

- package.json fields: name, version, main, type, scripts, dependencies, devDependencies, peerDependencies, engines, exports, bin
- Semantic versioning: `^` (caret), `~` (tilde), exact, `>=`, `*`
- `npm install`, `npm install --save-dev`, `npm ci`, `npm uninstall`
- `npm run` scripts with `pre`/`post` hooks and `node_modules/.bin` in PATH
- `npx` for one-off binary execution
- Lockfile (`package-lock.json`) for reproducible installs
- `npm audit` and `npm audit fix` for security
- Publishing: `npm login`, `npm version`, `npm publish`, scoped packages

### Key Concepts

- `^1.2.3` allows `>=1.2.3 <2.0.0` (minor + patch); `~1.2.3` allows `>=1.2.3 <1.3.0` (patch only); exact pins to `1.2.3`.
- `npm install` updates the lockfile; `npm ci` installs exactly from the lockfile (faster, reproducible, used in CI).
- `devDependencies` are not installed when your package is a dependency (only when you develop it); put test/build tools here.
- `scripts` runs in an environment with `node_modules/.bin` in PATH — no need for `./node_modules/.bin/eslint`.
- The `exports` field replaces `main` and lets you define public entry points, conditions (import/require/default), and prevent deep imports.

```json
{
  "name": "@myorg/api-client",
  "version": "1.4.2",
  "type": "module",
  "engines": { "node": ">=20" },
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": "./dist/utils.js"
  },
  "scripts": {
    "test":    "node --test",
    "build":   "esbuild src/index.js --bundle --format=esm --outfile=dist/index.mjs",
    "lint":    "eslint .",
    "prepublishOnly": "npm run build && npm test"
  },
  "dependencies": {
    "undici": "^6.0.0"
  },
  "devDependencies": {
    "esbuild": "^0.20.0",
    "eslint": "^9.0.0"
  }
}
```
Caption: package.json example

### Common Pitfalls

- Using `npm install` in CI instead of `npm ci` — `npm install` updates the lockfile and may pull different patch versions; `npm ci` installs exactly from the lockfile.
- Forgetting `engines.node` — your code may use Node 20+ features but a CI runner on Node 18 silently fails; pin the version with `engines` and enforce with `engine-strict=true`.
- Committing `node_modules/` — bloats the repo and breaks cross-platform installs; always gitignore it and use the lockfile.
- Relying on transitive dependencies (a dep of a dep) — if your direct dep removes that sub-dep, your code breaks; install what you `require`/`import`.
- Using `^` for critical packages in production — the lockfile protects you, but if someone runs `npm update` they may pull a broken patch; pin exact for security-critical deps.

### Real-World Applications

- The npm registry serves over 200 billion downloads per week to developers worldwide; npm is the largest package registry by far.
- Vercel uses `npm ci` in its build pipeline to ensure reproducible Next.js builds.
- Many large companies run internal npm proxies (Verdaccio, Artifactory) to cache packages and survive registry outages.
- The `eslint` and `prettier` ecosystems ship as npm packages with `bin` fields, executed via `npx`.

### Interview Questions

- 1. What's the difference between `npm install` and `npm ci`? — `install` updates the lockfile and may pull new patch versions; `ci` installs exactly from the existing lockfile, faster and reproducible (use in CI).
- 2. What does `^1.2.3` allow? — `>=1.2.3 <2.0.0` (minor and patch updates, no major bumps); `~1.2.3` allows only patch (`<1.3.0`); exact `1.2.3` pins.
- 3. What's the difference between `dependencies` and `devDependencies`? — `devDependencies` are not installed when your package is a dependency (only for development); put test/build/lint tools there.
- 4. What is the `exports` field for? — It defines the public entry points of a package, supports conditional exports (import/require/default), and prevents deep imports of internal files.
- 5. How do `pre`/`post` scripts work? — `npm run build` automatically runs `prebuild` before `build` and `postbuild` after; useful for compile/cleanup hooks.

### Mini Project

Build an npm-package Publisher CLI: A small scoped package `@yourname/uptime-pinger` that exposes a CLI checking if a URL is up; configure `prepublishOnly` to run tests and build, publish to the local npm registry (Verdaccio) or npm. Suggested approach:
  - Create `package.json` with `"bin": { "uptime": "./bin.js" }`, `"type": "module"`, and `engines.node: ">=20"`
  - Write `bin.js` with a `#!/usr/bin/env node` shebang using `fetch` + `process.argv`
  - Add a `test` script using `node --test` covering the URL-check logic
  - Add `prepublishOnly` running tests + a syntax check
  - Publish to a local Verdaccio (`npm publish --registry http://localhost:4873`)

### Exercises

1. Run `npm init -y` and inspect the generated `package.json`; add a `start` script.
2. Add `chalk` as a dependency with `^` and `eslint` as devDependency with `~`; install both.
3. Run `npm ci` after deleting `node_modules/`; verify identical versions install.
4. Add an `exports` field exposing both ESM and CJS entry points; verify both resolve.
5. Run `npm audit` on an old project and fix any vulnerabilities with `npm audit fix`.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command installs exactly from package-lock.json?
9. A) npm install
10. B) npm update
11. C) npm ci (*)
12. D) npm sync
13. Explanation: `npm ci` deletes node_modules and installs exactly the versions pinned in the lockfile — faster and reproducible for CI.
14. Q2: What does `^1.2.3` allow?
15. A) >=1.2.3 <1.3.0
16. B) exactly 1.2.3
17. C) >=1.0.0
18. D) >=1.2.3 <2.0.0 (*)
19. Explanation: Caret allows minor and patch updates but not major bumps: `^1.2.3` = `>=1.2.3 <2.0.0`.
20. Q3: Where do test/build tools belong?
21. A) devDependencies (*)
22. B) dependencies
23. C) peerDependencies
24. D) optionalDependencies
25. Explanation: `devDependencies` aren't installed when your package is a dependency — perfect for test/build/lint tools used only during development.
26. Q4: What does the `exports` field control?
27. A) The Node version
28. B) Public entry points and conditional exports (*)
29. C) The published files list
30. D) The license
31. Explanation: `exports` defines what importers can resolve (e.g. `"."` and `"./utils"`), supports conditions (import/require), and prevents deep imports of internal files.
32. Q5: Which runs `prebuild` before `build` and `postbuild` after?
33. A) npm build --hooks
34. B) npm build --pre --post
35. C) npm run build (pre/post hooks are automatic) (*)
36. D) npm exec build
37. Explanation: `npm run build` automatically runs `prebuild` first and `postbuild` last; useful for compile/cleanup hooks.
38. Q6: What does `npx` do?
39. A) Compiles TypeScript
40. B) Publishes to npm
41. C) Audits dependencies
42. D) Runs binaries from node_modules/.bin or fetches one-off packages (*)
43. Explanation: `npx <cmd>` runs a binary from the local `node_modules/.bin` or downloads and runs a one-off package (e.g. `npx create-react-app`).
44. Q7: Why should `node_modules/` be gitignored?
45. A) It's too large and breaks cross-platform installs; the lockfile is the source of truth (*)
46. B) It contains secrets
47. C) Git can't handle it
48. D) It's deprecated
49. Explanation: `node_modules` is regenerable from `package.json` + `package-lock.json`; committing it bloats the repo and may break on different OS/architectures.
50. Q8: What is `peerDependencies` for?
51. A) Tools you only need in dev
52. B) Packages the consumer must provide (e.g. React for a component library) (*)
53. C) Optional packages
54. D) Build scripts
55. Explanation: `peerDependencies` declares packages the consumer is expected to install (e.g. a React component library peer-deps React); prevents version conflicts.
56. Q9: Which command publishes a package to the npm registry?
57. A) npm push
58. B) npm deploy
59. C) npm publish (*)
60. D) npm release
61. Explanation: `npm publish` uploads the package; `prepublishOnly` script runs first (typically build + test) so broken packages can't ship.
62. Q10: What does `npm audit` do?
63. A) Checks for outdated versions
64. B) Lints package.json
65. C) Counts downloads
66. D) Scans dependencies for known vulnerabilities (*)
67. Explanation: `npm audit` checks the dependency tree against the GitHub Advisory Database; `npm audit fix` auto-updates vulnerable deps where possible.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command installs exactly from package-lock.json?
  options:
    - npm install
    - npm update
    - npm ci
    - npm sync
  correctIndex: 2
  explanation: "`npm ci` deletes node_modules and installs exactly the versions pinned in the lockfile — faster and reproducible for CI."
- id: q2
  question: What does `^1.2.3` allow?
  options:
    - ">=1.2.3 <1.3.0"
    - exactly 1.2.3
    - ">=1.0.0"
    - ">=1.2.3 <2.0.0"
  correctIndex: 3
  explanation: "Caret allows minor and patch updates but not major bumps: `^1.2.3` = `>=1.2.3 <2.0.0`."
- id: q3
  question: Where do test/build tools belong?
  options:
    - devDependencies
    - dependencies
    - peerDependencies
    - optionalDependencies
  correctIndex: 0
  explanation: "`devDependencies` aren't installed when your package is a dependency — perfect for test/build/lint tools used only during development."
- id: q4
  question: What does the `exports` field control?
  options:
    - The Node version
    - Public entry points and conditional exports
    - The published files list
    - The license
  correctIndex: 1
  explanation: '`exports` defines what importers can resolve (e.g. `"."` and `"./utils"`), supports conditions (import/require), and prevents deep imports of internal files.'
- id: q5
  question: Which runs `prebuild` before `build` and `postbuild` after?
  options:
    - npm build --hooks
    - npm build --pre --post
    - npm run build (pre/post hooks are automatic)
    - npm exec build
  correctIndex: 2
  explanation: "`npm run build` automatically runs `prebuild` first and `postbuild` last; useful for compile/cleanup hooks."
- id: q6
  question: What does `npx` do?
  options:
    - Compiles TypeScript
    - Publishes to npm
    - Audits dependencies
    - Runs binaries from node_modules/.bin or fetches one-off packages
  correctIndex: 3
  explanation: "`npx <cmd>` runs a binary from the local `node_modules/.bin` or downloads and runs a one-off package (e.g. `npx create-react-app`)."
- id: q7
  question: Why should `node_modules/` be gitignored?
  options:
    - It's too large and breaks cross-platform installs; the lockfile is the source of truth
    - It contains secrets
    - Git can't handle it
    - It's deprecated
  correctIndex: 0
  explanation: "`node_modules` is regenerable from `package.json` + `package-lock.json`; committing it bloats the repo and may break on different OS/architectures."
- id: q8
  question: What is `peerDependencies` for?
  options:
    - Tools you only need in dev
    - Packages the consumer must provide (e.g. React for a component library)
    - Optional packages
    - Build scripts
  correctIndex: 1
  explanation: "`peerDependencies` declares packages the consumer is expected to install (e.g. a React component library peer-deps React); prevents version conflicts."
- id: q9
  question: Which command publishes a package to the npm registry?
  options:
    - npm push
    - npm deploy
    - npm publish
    - npm release
  correctIndex: 2
  explanation: "`npm publish` uploads the package; `prepublishOnly` script runs first (typically build + test) so broken packages can't ship."
- id: q10
  question: What does `npm audit` do?
  options:
    - Checks for outdated versions
    - Lints package.json
    - Counts downloads
    - Scans dependencies for known vulnerabilities
  correctIndex: 3
  explanation: "`npm audit` checks the dependency tree against the GitHub Advisory Database; `npm audit fix` auto-updates vulnerable deps where possible."
```

