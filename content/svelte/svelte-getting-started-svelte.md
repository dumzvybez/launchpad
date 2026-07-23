---
slug: svelte-getting-started-svelte
id: svelte-01
track: svelte
order: 1
title: Getting Started with Svelte
description: Set up a SvelteKit 2 project, render your first component, and understand Svelte's compile-time philosophy.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs
whyItMatters: Set up a SvelteKit 2 project, render your first component, and understand Svelte's compile-time philosophy.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Getting Started with Svelte

## Getting Started with Svelte

### Why It Matters

Set up a SvelteKit 2 project, render your first component, and understand Svelte's compile-time philosophy.

Set up a SvelteKit 2 project, render your first component, and understand Svelte's compile-time philosophy.

### Prerequisites

- None — basic HTML/CSS/JS knowledge is helpful.
- Comfort using a terminal and a code editor (VS Code recommended).

### Topics

- What Svelte is (compiler-first UI framework) and where it fits
- Svelte 5 runes mode vs Svelte 4 legacy reactivity
- Creating a project with `npm create svelte@latest` / `npx sv create`
- Project structure: src/, src/routes/, svelte.config.js, vite.config.ts
- Running the dev server and hot module replacement (HMR)
- Svelte vs SvelteKit — what each provides
- The Svelte for VS Code extension and Svelte DevTools
- Compiled output: why Svelte ships less JS to the browser

### Key Concepts

- Svelte is a compiler: .svelte files compile to imperative JS, no virtual DOM
- Svelte 5 runes ($state, $derived, $effect, $props) opt in to fine-grained reactivity
- SvelteKit is the meta-framework: routing, SSR, data loading, deployment adapters
- Single-file components (.svelte): script, markup, style scoped by default
- Compile-time optimization: dead code elimination, scoped CSS, no runtime framework

```bash
npx sv create my-app
# choose: Skeleton project, TypeScript, ESLint, Prettier, Vitest, Playwright
cd my-app
npm install
npm run dev -- --open
# Open http://localhost:5173
```
Caption: Scaffolding a project

### Common Pitfalls

- Mixing Svelte 4 `let` reactivity with Svelte 5 runes in the same component — pick one mode per component; using any rune opts the whole component into runes mode.
- Installing an old "Svelte 3 Snippets" extension instead of the official "Svelte for VS Code" — only the official one drives the svelte-language-server.
- Using `npm create svelte@latest` vs the newer `npx sv create` — `sv` is the unified CLI shipped in 2024; both work but `sv` is current.
- Treating SvelteKit as optional for new projects — for any production app you almost always want SvelteKit for routing, SSR, and deployment adapters.
- Forgetting that Svelte components ship with scoped styles by default — global styles require `:global()`.

### Real-World Applications

- Apple's Music web player (music.apple.com) uses Svelte for parts of its UI, citing smaller bundle sizes than equivalent React builds.
- The New York Times uses Svelte for several interactive graphics and election pages because compiled components ship minimal JS to readers.
- Spotify's web player team has used Svelte for internal tools and select surfaces, drawn to its small runtime.
- Rakuten's marketing and commerce pages have shipped Svelte components to keep payloads low on mobile.

### Interview Questions

- 1. What problem does Svelte solve? — It compiles components to imperative JS at build time, eliminating runtime virtual DOM diffing and shrinking shipped bytes.
- 2. Library or framework? — Svelte is a UI compiler; SvelteKit is the full-stack framework that adds routing, SSR, and deployment adapters.
- 3. What are Svelte 5 runes? — Sigils like $state, $derived, $effect that opt in to fine-grained signal-based reactivity without compiler-tracked assignments.
- 4. Why scoped CSS by default? — To prevent style leakage across components without needing BEM or CSS modules.
- 5. What ships to the browser? — Compiled JS with no virtual DOM runtime, just the minimal per-component update code Svelte's compiler generates.

### Mini Project

Build a "Hello, Svelte" profile card: A single-page SvelteKit app that renders a card with your name, role, and a button that toggles between "Follow" and "Following" using $state. Take an optional `name` prop, persist the follow state to localStorage, and style it with scoped CSS. Suggested approach:
  - Scaffold with `npx sv create` choosing TypeScript
  - Replace `+page.svelte` with a ProfileCard component using $state
  - Initialize state from localStorage inside an $effect
  - Use $derived for the button label
  - Add scoped styles for the card and avatar

### Exercises

1. Scaffold a SvelteKit + TypeScript project and confirm `npm run dev` shows the welcome page.
2. Replace `+page.svelte` with a component that prints your name in an `<h1>` and the current year in a `<p>`.
3. Install the "Svelte for VS Code" extension and confirm syntax highlighting works.
4. Build the project with `npm run build`, then inspect `build/` to confirm there's no virtual DOM runtime shipped.
5. Add a second component `Footer.svelte` and import it into your page.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created Svelte?
9. A) Rich Harris (*)
10. B) Evan You
11. C) Dan Abramov
12. D) Misko Hevery
13. Explanation: Rich Harris created Svelte in 2016 while at The Guardian; he later joined Vercel and continues to lead the project.
14. Q2: What is Svelte's core architectural innovation?
15. A) A virtual DOM
16. B) A compiler that emits imperative DOM updates (*)
17. C) A new browser API
18. D) A web worker runtime
19. Explanation: Svelte compiles .svelte files to plain JavaScript that mutates the DOM directly, skipping the runtime diffing of a virtual DOM.
20. Q3: Which command scaffolds a SvelteKit project in 2024?
21. A) npm create react-app
22. B) npx svelte init
23. C) npx sv create (*)
24. D) pip install svelte
25. Explanation: `npx sv create` is the unified CLI shipped in 2024; `npm create svelte@latest` still works as a wrapper.
26. Q4: Which file configures SvelteKit (adapters, kit options)?
27. A) webpack.config.js
28. B) babel.config.js
29. C) app.html only
30. D) svelte.config.js (*)
31. Explanation: `svelte.config.js` configures SvelteKit (adapter, kit.adapter, preprocessors). Vite config lives separately in `vite.config.ts`.
32. Q5: In Svelte 5, which rune declares reactive state?
33. A) $state (*)
34. B) $let
35. C) useState
36. D) reactive()
37. Explanation: $state(value) declares a reactive variable in runes mode; mutations to it trigger fine-grained UI updates.
38. Q6: What ships to the browser when you build a Svelte app?
39. A) The full Svelte runtime (~40KB)
40. B) Compiled imperative JS with minimal runtime helpers (*)
41. C) A virtual DOM library
42. D) A WebAssembly bundle
43. Explanation: Svelte compiles components to direct DOM updates; only small per-component code and a few helpers ship.
44. Q7: Are Svelte component styles scoped by default?
45. A) No, all styles are global
46. B) Only if you opt in with `scoped`
47. C) Yes — classes get hashed suffixes automatically (*)
48. D) Only in production builds
49. Explanation: Svelte scopes styles to the component by hashing class names; use `:global()` to escape scoping.
50. Q8: Which extension provides the Svelte language server in VS Code?
51. A) Svelte 3 Snippets
52. B) Vetur
53. C) SvelteKit Pro
54. D) Svelte for VS Code (*)
55. Explanation: "Svelte for VS Code" drives svelte-language-server; other extensions are snippets-only.
56. Q9: What is SvelteKit?
57. A) The full-stack meta-framework for Svelte (routing, SSR, adapters) (*)
58. B) A UI library only
59. C) A Svelte-to-React compiler
60. D) A paid Svelte hosting service
61. Explanation: SvelteKit adds routing, data loading, SSR/SSG, and deployment adapters on top of the Svelte compiler.
62. Q10: What language can Svelte `<script>` tags use?
63. A) JavaScript only
64. B) TypeScript via `lang="ts"` (*)
65. C) Python via lang="py"
66. D) CoffeeScript only
67. Explanation: Add `lang="ts"` to `<script>` to use TypeScript; Svelte preprocesses it via Vite/esbuild.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Svelte?
  options:
    - Rich Harris
    - Evan You
    - Dan Abramov
    - Misko Hevery
  correctIndex: 0
  explanation: Rich Harris created Svelte in 2016 while at The Guardian; he later joined Vercel and continues to lead the project.
- id: q2
  question: What is Svelte's core architectural innovation?
  options:
    - A virtual DOM
    - A compiler that emits imperative DOM updates
    - A new browser API
    - A web worker runtime
  correctIndex: 1
  explanation: Svelte compiles .svelte files to plain JavaScript that mutates the DOM directly, skipping the runtime diffing of a virtual DOM.
- id: q3
  question: Which command scaffolds a SvelteKit project in 2024?
  options:
    - npm create react-app
    - npx svelte init
    - npx sv create
    - pip install svelte
  correctIndex: 2
  explanation: "`npx sv create` is the unified CLI shipped in 2024; `npm create svelte@latest` still works as a wrapper."
- id: q4
  question: Which file configures SvelteKit (adapters, kit options)?
  options:
    - webpack.config.js
    - babel.config.js
    - app.html only
    - svelte.config.js
  correctIndex: 3
  explanation: "`svelte.config.js` configures SvelteKit (adapter, kit.adapter, preprocessors). Vite config lives separately in `vite.config.ts`."
- id: q5
  question: In Svelte 5, which rune declares reactive state?
  options:
    - $state
    - $let
    - useState
    - reactive()
  correctIndex: 0
  explanation: $state(value) declares a reactive variable in runes mode; mutations to it trigger fine-grained UI updates.
- id: q6
  question: What ships to the browser when you build a Svelte app?
  options:
    - The full Svelte runtime (~40KB)
    - Compiled imperative JS with minimal runtime helpers
    - A virtual DOM library
    - A WebAssembly bundle
  correctIndex: 1
  explanation: Svelte compiles components to direct DOM updates; only small per-component code and a few helpers ship.
- id: q7
  question: Are Svelte component styles scoped by default?
  options:
    - No, all styles are global
    - Only if you opt in with `scoped`
    - Yes — classes get hashed suffixes automatically
    - Only in production builds
  correctIndex: 2
  explanation: Svelte scopes styles to the component by hashing class names; use `:global()` to escape scoping.
- id: q8
  question: Which extension provides the Svelte language server in VS Code?
  options:
    - Svelte 3 Snippets
    - Vetur
    - SvelteKit Pro
    - Svelte for VS Code
  correctIndex: 3
  explanation: '"Svelte for VS Code" drives svelte-language-server; other extensions are snippets-only.'
- id: q9
  question: What is SvelteKit?
  options:
    - The full-stack meta-framework for Svelte (routing, SSR, adapters)
    - A UI library only
    - A Svelte-to-React compiler
    - A paid Svelte hosting service
  correctIndex: 0
  explanation: SvelteKit adds routing, data loading, SSR/SSG, and deployment adapters on top of the Svelte compiler.
- id: q10
  question: What language can Svelte `<script>` tags use?
  options:
    - JavaScript only
    - TypeScript via `lang="ts"`
    - Python via lang="py"
    - CoffeeScript only
  correctIndex: 1
  explanation: Add `lang="ts"` to `<script>` to use TypeScript; Svelte preprocesses it via Vite/esbuild.
```

