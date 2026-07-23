---
slug: nextjs-getting-started-next-js
id: nextjs-01
track: nextjs
order: 1
title: Getting Started with Next.js
description: Scaffold a Next.js 14+ App Router project with TypeScript, run the dev server, and understand the project layout, build output, and how Next.js extends React.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU
whyItMatters: Scaffold a Next. js 14+ App Router project with TypeScript, run the dev server, and understand the project layout, build output, and how Next.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Getting Started with Next.js

## Getting Started with Next.js

### Why It Matters

Scaffold a Next. js 14+ App Router project with TypeScript, run the dev server, and understand the project layout, build output, and how Next.

Scaffold a Next.js 14+ App Router project with TypeScript, run the dev server, and understand the project layout, build output, and how Next.js extends React.

### Prerequisites

- None — basic React knowledge is helpful.
- Comfort using a terminal and a code editor (VS Code recommended).
- Node.js 18.17+ installed locally.

### Topics

- What Next.js is (React framework) and why teams choose it
- Scaffolding with `npx create-next-app@latest`
- The App Router directory (app/) vs the legacy pages/ directory
- TypeScript, ESLint, Tailwind CSS, and src/ layout options
- Running `next dev`, `next build`, and `next start`
- The .next/ build output and what each folder contains
- React Server Components as the default rendering model
- Zero-config bundling, fast refresh, and Turbopack preview

### Key Concepts

- Next.js = React + a compiler + a router + a server runtime + a deployment platform
- The App Router (app/) is the modern default; pages/ is supported for backwards compatibility only
- Every file inside app/ is either a route, a layout, a special file (loading, error, not-found), or a private folder (_name)
- React Server Components (RSC) run on the server by default — no 'use client' needed for static server UI
- `next dev` runs a dev server with Fast Refresh; `next build` produces an optimized `.next/` folder for `next start`

```bash
npx create-next-app@latest my-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"
cd my-app
npm run dev
# Open http://localhost:3000
```
Caption: Scaffolding a project

### Common Pitfalls

- Choosing the `pages/` directory for a new project — the App Router (app/) is the modern default and where all new features land; only use pages/ for legacy migrations.
- Assuming Next.js requires 'use client' on every component — server components are the default and you should add 'use client' only where you need state, effects, or browser APIs.
- Running `npm run build` against a dev-only `.env.local` and shipping secrets — always split `.env.local` (dev), `.env.production` (build-time, non-secret), and Vercel project env vars (secrets at runtime).
- Deleting `next.config.mjs` thinking it is optional — many features (image domains, redirects, rewrites, experimental flags) require it; keep a minimal one even if empty.
- Forgetting that Next.js 14 requires Node 18.17+ — older Node versions fail at `next build` with cryptic "ERR_UNKNOWN_FILE_EXTENSION" or worker errors.

### Real-World Applications

- TikTok's web experience is built on Next.js, serving hundreds of millions of users with hybrid SSR + ISR for video and creator pages.
- Hulu's marketing site and parts of its authenticated app use Next.js for fast first paint and SEO on show pages.
- Notion's marketing site and help center are built on Next.js, with ISR keeping docs fresh without rebuilds.
- Vercel's own dashboard and marketing site are the canonical reference App Router app, open-sourced as `nextjs.org`.

### Interview Questions

- 1. What is Next.js and why would you choose it over plain React? — It is a React framework that adds file-based routing, server components, image/font optimization, and a deployment story so you do not have to wire those up yourself.
- 2. App Router or Pages Router for a new project in 2024+? — App Router; it is the modern default with server components, layouts, and new features, while Pages Router is in maintenance.
- 3. What is a React Server Component? — A component that runs only on the server, never ships JavaScript to the client, and can directly access databases, files, and secrets.
- 4. What does `next dev` do under the hood? — Runs a Node server with Fast Refresh, on-demand server compilation, and React Server Components enabled for the app/ directory.
- 5. Why does Next.js require Node 18.17+? — It uses native fetch (Node 18+), streaming APIs, and server component primitives that older Node versions do not support.

### Mini Project

Build a "Hello, Next.js" landing page: A single-page site that renders a hero section with your name, a tagline, and a footer with the current year. Take no input, render server-side, and deploy to Vercel. Suggested approach:
  - Scaffold with `npx create-next-app@latest` using TypeScript + Tailwind + App Router
  - Replace `src/app/page.tsx` with a hero component using Tailwind classes
  - Add a root `metadata` export in `layout.tsx` for the page title
  - Commit to GitHub and import to Vercel — your first deploy is free
  - Add a `Footer` server component that shows `new Date().getFullYear()` (server-side)

### Exercises

1. Scaffold a Next.js project and confirm `npm run dev` shows the default template at localhost:3000.
2. Replace `src/app/page.tsx` with a custom hero and verify Fast Refresh updates without a full reload.
3. Run `npm run build && npm run start` and inspect the `.next/` folder — list at least 3 subfolders and what they contain.
4. Add a `metadata` export to `layout.tsx` with a custom title and verify it appears in the browser tab.
5. Add a new file `src/app/about/page.tsx` and visit `/about` — observe that no router config was needed.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command scaffolds a new Next.js 14 project with TypeScript and Tailwind?
9. A) npx create-next-app@latest my-app --typescript --tailwind (*)
10. B) npx create-react-app my-app --typescript
11. C) npm install next my-app
12. D) npx next init my-app
13. Explanation: `create-next-app@latest` scaffolds a Next.js 14+ project with optional TypeScript, Tailwind, ESLint, App Router, and src/ directory flags.
14. Q2: Which directory is the modern default for routing in Next.js 14+?
15. A) pages/
16. B) app/ (*)
17. C) routes/
18. D) src/routes/
19. Explanation: The App Router (app/) is the default and where new features ship; pages/ is kept for backwards compatibility only.
20. Q3: Which Node.js version is the minimum required by Next.js 14?
21. A) 14.x
22. B) 16.x
23. C) 18.17+ (*)
24. D) 20.x only
25. Explanation: Next.js 14 requires Node 18.17 or newer because it uses native fetch, streaming, and server-component primitives unavailable in older Node versions.
26. Q4: What is a React Server Component by default in the App Router?
27. A) Any component that imports useState
28. B) Any component in the components/ folder
29. C) Any class component
30. D) Any component in app/ without a 'use client' directive (*)
31. Explanation: Components inside the app/ directory are server components by default; you opt into client-side behavior with the 'use client' directive at the top of the file.
32. Q5: What does `next build` produce?
33. A) An optimized .next/ folder with server and client bundles (*)
34. B) A standalone .exe binary
35. C) A Docker image
36. D) A static HTML file only
37. Explanation: `next build` compiles routes, code-splits client/server, and outputs `.next/` containing server, static, and trace data consumed by `next start` or Vercel.
38. Q6: Which file is REQUIRED at the root of the app/ directory?
39. A) page.tsx
40. B) layout.tsx (*)
41. C) loading.tsx
42. D) error.tsx
43. Explanation: `app/layout.tsx` is the required root layout that wraps every route; without it the build fails. `page.tsx` is required only to make a route exist.
44. Q7: What does Fast Refresh provide in `next dev`?
45. A) A full page reload on every change
46. B) Faster builds by skipping type-checking
47. C) Hot-reloading of components while preserving React state (*)
48. D) A CDN for static assets
49. Explanation: Fast Refresh swaps edited modules in the browser without a full reload, preserving component state and providing instant feedback during development.
50. Q8: Where do environment variables that should be visible to the browser need to be prefixed?
51. A) PUBLIC_
52. B) BROWSER_
53. C) CLIENT_
54. D) NEXT_PUBLIC_ (*)
55. Explanation: Variables prefixed with NEXT_PUBLIC_ are inlined into the client bundle at build time; all other env vars are server-only and never leak to the browser.
56. Q9: Which of these is NOT a special filename in the App Router?
57. A) header.tsx (*)
58. B) loading.tsx
59. C) error.tsx
60. D) not-found.tsx
61. Explanation: loading, error, not-found, layout, page, template, route, and global-error are special files; `header.tsx` is just a regular component file.
62. Q10: Which statement about the App Router vs Pages Router is correct?
63. A) Pages Router is the recommended default for new projects
64. B) App Router supports nested layouts and server components, Pages Router does not (*)
65. C) App Router removes the need for client-side navigation entirely
66. D) Pages Router requires Vercel to deploy
67. Explanation: The App Router brings nested layouts, server components, and streaming; the Pages Router is a simpler legacy model without those primitives.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command scaffolds a new Next.js 14 project with TypeScript and Tailwind?
  options:
    - npx create-next-app@latest my-app --typescript --tailwind
    - npx create-react-app my-app --typescript
    - npm install next my-app
    - npx next init my-app
  correctIndex: 0
  explanation: "`create-next-app@latest` scaffolds a Next.js 14+ project with optional TypeScript, Tailwind, ESLint, App Router, and src/ directory flags."
- id: q2
  question: Which directory is the modern default for routing in Next.js 14+?
  options:
    - pages/
    - app/
    - routes/
    - src/routes/
  correctIndex: 1
  explanation: The App Router (app/) is the default and where new features ship; pages/ is kept for backwards compatibility only.
- id: q3
  question: Which Node.js version is the minimum required by Next.js 14?
  options:
    - 14.x
    - 16.x
    - 18.17+
    - 20.x only
  correctIndex: 2
  explanation: Next.js 14 requires Node 18.17 or newer because it uses native fetch, streaming, and server-component primitives unavailable in older Node versions.
- id: q4
  question: What is a React Server Component by default in the App Router?
  options:
    - Any component that imports useState
    - Any component in the components/ folder
    - Any class component
    - Any component in app/ without a 'use client' directive
  correctIndex: 3
  explanation: Components inside the app/ directory are server components by default; you opt into client-side behavior with the 'use client' directive at the top of the file.
- id: q5
  question: What does `next build` produce?
  options:
    - An optimized .next/ folder with server and client bundles
    - A standalone .exe binary
    - A Docker image
    - A static HTML file only
  correctIndex: 0
  explanation: "`next build` compiles routes, code-splits client/server, and outputs `.next/` containing server, static, and trace data consumed by `next start` or Vercel."
- id: q6
  question: Which file is REQUIRED at the root of the app/ directory?
  options:
    - page.tsx
    - layout.tsx
    - loading.tsx
    - error.tsx
  correctIndex: 1
  explanation: "`app/layout.tsx` is the required root layout that wraps every route; without it the build fails. `page.tsx` is required only to make a route exist."
- id: q7
  question: What does Fast Refresh provide in `next dev`?
  options:
    - A full page reload on every change
    - Faster builds by skipping type-checking
    - Hot-reloading of components while preserving React state
    - A CDN for static assets
  correctIndex: 2
  explanation: Fast Refresh swaps edited modules in the browser without a full reload, preserving component state and providing instant feedback during development.
- id: q8
  question: Where do environment variables that should be visible to the browser need to be prefixed?
  options:
    - PUBLIC_
    - BROWSER_
    - CLIENT_
    - NEXT_PUBLIC_
  correctIndex: 3
  explanation: Variables prefixed with NEXT_PUBLIC_ are inlined into the client bundle at build time; all other env vars are server-only and never leak to the browser.
- id: q9
  question: Which of these is NOT a special filename in the App Router?
  options:
    - header.tsx
    - loading.tsx
    - error.tsx
    - not-found.tsx
  correctIndex: 0
  explanation: loading, error, not-found, layout, page, template, route, and global-error are special files; `header.tsx` is just a regular component file.
- id: q10
  question: Which statement about the App Router vs Pages Router is correct?
  options:
    - Pages Router is the recommended default for new projects
    - App Router supports nested layouts and server components, Pages Router does not
    - App Router removes the need for client-side navigation entirely
    - Pages Router requires Vercel to deploy
  correctIndex: 1
  explanation: The App Router brings nested layouts, server components, and streaming; the Pages Router is a simpler legacy model without those primitives.
```

