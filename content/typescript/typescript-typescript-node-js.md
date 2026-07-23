---
slug: typescript-typescript-node-js
id: typescript-17
track: typescript
order: 17
title: TypeScript with Node.js
description: Build a typed Node.js server with Express or Fastify, configure tsconfig for Node ESM, and use `@types/node` and `tsx` correctly.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=10800s
whyItMatters: Build a typed Node. js server with Express or Fastify, configure tsconfig for Node ESM, and use `@types/node` and `tsx` correctly.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# TypeScript with Node.js

## TypeScript with Node.js

### Why It Matters

Build a typed Node. js server with Express or Fastify, configure tsconfig for Node ESM, and use `@types/node` and `tsx` correctly.

Build a typed Node.js server with Express or Fastify, configure tsconfig for Node ESM, and use `@types/node` and `tsx` correctly.

### Prerequisites

- Stage 9: Modules, Namespaces, and Declaration Files.
- Stage 11: Tooling — tsconfig, ESLint, Prettier.
- Stage 14: Async/Await and Promises in TypeScript.

### Topics

- `@types/node` and the Node.js global types
- `module: NodeNext` and `moduleResolution: NodeNext`
- ESM vs CommonJS in Node (`type: "module"` in package.json)
- Typing Express (`@types/express`) or Fastify (built-in types)
- Typed `Request`, `Response`, and middleware
- Custom error classes and `ErrorRequestHandler`
- `process.env` typing with `dotenv` + `process-env-ts`
- Running with `tsx` (dev) and compiling with `tsc` (prod)

### Key Concepts

- Use `module: NodeNext` for Node-native ESM; `module: CommonJS` only if you must support legacy.
- `@types/node` is required for `process`, `Buffer`, `NodeJS.ErrnoException`, and other Node globals.
- Express's types come from `@types/express`; Fastify's types ship with the package itself.
- `process.env.X` is `string | undefined`; use a typed config loader (Zod, envalid) to validate at boot.
- `tsx` for dev (esbuild-based, fast), `tsc` for prod emit — or use a bundler (esbuild/rollup).

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```
Caption: tsconfig for Node ESM

### Common Pitfalls

- Using `module: CommonJS` for a Node 18+ ESM project — set `module: NodeNext` and `"type": "module"` in package.json, and use `.js` extensions in relative imports.
- Casting `req.query.q as string` without validation — query params are `string | ParsedQs | string[] | ParsedQs[]`; use Zod or a validator to coerce.
- Forgetting `app.use(express.json())` before typed body-parsing — `req.body` is `any` until the body parser is mounted.
- Running prod with `tsx` — `tsx` is dev-only (esbuild transpiles per-file, no type-checking); use `tsc && node dist/index.js` for prod.
- Treating `process.env.PORT` as a number — it's `string | undefined`; coerce with `Number(env.PORT)` or `z.coerce.number()`.

### Real-World Applications

- The Slack web API SDK (`@slack/web-api`) is written in TypeScript on Node.js with full request/response typing via generated OpenAPI types.
- The Prisma CLI is a Node.js TypeScript application that runs queries against your schema to generate a fully typed client.
- Vercel's Next.js server runtime uses `module: NodeNext` for the App Router; every server component and route handler is typed end-to-end.
- The tRPC server is a TypeScript-first Node library that infers the entire API contract from your router definition — no codegen.

### Interview Questions

- 1. Which `module` setting is correct for a Node 18+ ESM project? — `NodeNext` (also set `"type": "module"` in package.json and use `.js` extensions in imports).
- 2. Why is `req.query.q` typed loosely? — Express's types model query params as `string | ParsedQs | string[] | ParsedQs[]` because they can be any of these at runtime; validate with Zod.
- 3. Why is `tsx` not ideal for production? — It transpiles per-file with no type-checking; use `tsc && node dist/...` for prod, or a bundler.
- 4. How do you type a custom error class? — Extend `Error` and add fields (e.g., `status: number`); use `instanceof` to narrow in the error handler.
- 5. How do you safely read `process.env`? — Validate it at boot with a Zod schema (or envalid) so missing/invalid values fail fast.

### Mini Project

Build a typed URL-Shortener API in Express: A small Express server with `POST /shorten`, `GET /:code`, and a Zod-validated env config. Suggested approach:
  - Set up `package.json` with `"type": "module"` and install `express`, `@types/express`, `zod`, `dotenv`, `tsx`
  - Configure tsconfig with `module: NodeNext`
  - Define an `EnvSchema` and parse `process.env` at boot
  - Implement `POST /shorten` accepting `{ url: string }` (Zod-validated) and returning `{ code: string }`
  - Implement `GET /:code` that redirects or 404s

### Exercises

1. Configure a Node ESM project with `module: NodeNext` and import a local file using a `.js` extension.
2. Write an Express route with typed `Request`/`Response` and a query string parsed via Zod.
3. Add a typed error-handling middleware that narrows `HttpError` vs unknown errors.
4. Validate `process.env` at boot with a Zod schema; verify missing vars throw.
5. Build the project with `tsc` and run the emitted `dist/index.js` with `node`.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which `module` setting is correct for Node 18+ ESM?
9. A) `NodeNext` (*)
10. B) `CommonJS`
11. C) `ES6`
12. D) `UMD`
13. Explanation: `NodeNext` matches Node's actual ESM resolution, including `package.json` `"type"` and `exports` fields; also set `"type": "module"` in package.json.
14. Q2: What is the type of `process.env.PORT`?
15. A) `number`
16. B) `string | undefined` (*)
17. C) `string`
18. D) `number | undefined`
19. Explanation: All env vars are strings (or undefined if missing); coerce with `Number(...)` or `z.coerce.number()`.
20. Q3: Where do Express's TypeScript types come from?
21. A) Built into Express
22. B) `@types/node`
23. C) `@types/express` (DefinitelyTyped) (*)
24. D) The Express CLI
25. Explanation: Express itself ships JS; its types live in `@types/express` from DefinitelyTyped. (Fastify, by contrast, ships its own types.)
26. Q4: Why is `req.query.q` typed loosely in Express?
27. A) It's an Express bug
28. B) It's `any` because of CommonJS
29. C) It's `unknown`
30. D) Query params can be string, string[], or nested objects at runtime (*)
31. Explanation: Express types query as `ParsedQs` to model the variety of shapes; validate with a Zod schema or `as string` after a typeof check.
32. Q5: Why is `tsx` not recommended for production?
33. A) It transpiles per-file with no type-checking; `tsc && node` is preferred for prod (*)
34. B) It is deprecated
35. C) It's slower than `node` directly
36. D) It doesn't support ES modules
37. Explanation: `tsx` (esbuild-based) skips type-checking for speed; prod should run `tsc` (or a bundler with type-checking) to ensure the build is type-clean before deploy.
38. Q6: Which middleware must be mounted before `req.body` is typed as JSON?
39. A) `express.static()`
40. B) `express.json()` (*)
41. C) `cors()`
42. D) `helmet()`
43. Explanation: `express.json()` parses the request body as JSON and assigns it to `req.body`; without it, `req.body` is `undefined`.
44. Q7: How do you type an Express error-handling middleware?
45. A) `(req, res) => void`
46. B) `RequestHandler`
47. C) `ErrorRequestHandler` from `@types/express` (*)
48. D) `NextFunction`
49. Explanation: `ErrorRequestHandler` is the 4-arg signature `(err, req, res, next) => void`; an Express error handler must have exactly 4 parameters.
50. Q8: Which package provides Node globals like `process` and `Buffer`?
51. A) `@types/express`
52. B) `tslib`
53. C) `core-js`
54. D) `@types/node` (*)
55. Explanation: `@types/node` provides ambient declarations for Node's globals and built-in modules.
56. Q9: What's the recommended way to validate env vars at boot?
57. A) Use a Zod schema (or envalid) to parse `process.env` and fail fast (*)
58. B) Cast with `as string`
59. C) Ignore them — they're always strings
60. D) Use `dotenv.config()` only
61. Explanation: A Zod schema validates types and presence; missing required vars throw immediately at startup, surfacing misconfiguration early.
62. Q10: Which is the correct relative import in Node ESM?
63. A) `import "./utils"` (no extension)
64. B) `import "./utils.js"` (explicit `.js` extension, even if source is `.ts`) (*)
65. C) `import "./utils.ts"`
66. D) `require("./utils")`
67. Explanation: Node ESM requires explicit file extensions; the convention is to import the `.js` extension even when the source is `.ts` (the compiler will emit `.js`).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which `module` setting is correct for Node 18+ ESM?
  options:
    - "`NodeNext`"
    - "`CommonJS`"
    - "`ES6`"
    - "`UMD`"
  correctIndex: 0
  explanation: "`NodeNext` matches Node's actual ESM resolution, including `package.json` `\"type\"` and `exports` fields; also set `\"type\": \"module\"` in package.json."
- id: q2
  question: What is the type of `process.env.PORT`?
  options:
    - "`number`"
    - "`string | undefined`"
    - "`string`"
    - "`number | undefined`"
  correctIndex: 1
  explanation: All env vars are strings (or undefined if missing); coerce with `Number(...)` or `z.coerce.number()`.
- id: q3
  question: Where do Express's TypeScript types come from?
  options:
    - Built into Express
    - "`@types/node`"
    - "`@types/express` (DefinitelyTyped)"
    - The Express CLI
  correctIndex: 2
  explanation: Express itself ships JS; its types live in `@types/express` from DefinitelyTyped. (Fastify, by contrast, ships its own types.)
- id: q4
  question: Why is `req.query.q` typed loosely in Express?
  options:
    - It's an Express bug
    - It's `any` because of CommonJS
    - It's `unknown`
    - Query params can be string, string[], or nested objects at runtime
  correctIndex: 3
  explanation: Express types query as `ParsedQs` to model the variety of shapes; validate with a Zod schema or `as string` after a typeof check.
- id: q5
  question: Why is `tsx` not recommended for production?
  options:
    - It transpiles per-file with no type-checking; `tsc && node` is preferred for prod
    - It is deprecated
    - It's slower than `node` directly
    - It doesn't support ES modules
  correctIndex: 0
  explanation: "`tsx` (esbuild-based) skips type-checking for speed; prod should run `tsc` (or a bundler with type-checking) to ensure the build is type-clean before deploy."
- id: q6
  question: Which middleware must be mounted before `req.body` is typed as JSON?
  options:
    - "`express.static()`"
    - "`express.json()`"
    - "`cors()`"
    - "`helmet()`"
  correctIndex: 1
  explanation: "`express.json()` parses the request body as JSON and assigns it to `req.body`; without it, `req.body` is `undefined`."
- id: q7
  question: How do you type an Express error-handling middleware?
  options:
    - "`(req, res) => void`"
    - "`RequestHandler`"
    - "`ErrorRequestHandler` from `@types/express`"
    - "`NextFunction`"
  correctIndex: 2
  explanation: "`ErrorRequestHandler` is the 4-arg signature `(err, req, res, next) => void`; an Express error handler must have exactly 4 parameters."
- id: q8
  question: Which package provides Node globals like `process` and `Buffer`?
  options:
    - "`@types/express`"
    - "`tslib`"
    - "`core-js`"
    - "`@types/node`"
  correctIndex: 3
  explanation: "`@types/node` provides ambient declarations for Node's globals and built-in modules."
- id: q9
  question: What's the recommended way to validate env vars at boot?
  options:
    - Use a Zod schema (or envalid) to parse `process.env` and fail fast
    - Cast with `as string`
    - Ignore them — they're always strings
    - Use `dotenv.config()` only
  correctIndex: 0
  explanation: A Zod schema validates types and presence; missing required vars throw immediately at startup, surfacing misconfiguration early.
- id: q10
  question: Which is the correct relative import in Node ESM?
  options:
    - '`import "./utils"` (no extension)'
    - '`import "./utils.js"` (explicit `.js` extension, even if source is `.ts`)'
    - '`import "./utils.ts"`'
    - '`require("./utils")`'
  correctIndex: 1
  explanation: Node ESM requires explicit file extensions; the convention is to import the `.js` extension even when the source is `.ts` (the compiler will emit `.js`).
```

