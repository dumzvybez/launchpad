---
slug: react-getting-started-react
id: react-01
track: react
order: 1
title: Getting Started with React
description: Set up a modern React 18 project with Vite and TypeScript, render your first component, and understand how React's reconciliation model works.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8
whyItMatters: Set up a modern React 18 project with Vite and TypeScript, render your first component, and understand how React's reconciliation model works.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Getting Started with React

## Getting Started with React

### Why It Matters

Set up a modern React 18 project with Vite and TypeScript, render your first component, and understand how React's reconciliation model works.

Set up a modern React 18 project with Vite and TypeScript, render your first component, and understand how React's reconciliation model works.

### Prerequisites

- None — basic HTML/CSS/JS knowledge is helpful.
- Comfort using a terminal and a code editor (VS Code recommended).

### Topics

- What React is (library vs framework) and where it fits
- Creating a project with Vite (`npm create vite@latest`)
- Project structure: src/, index.html, vite.config.ts
- Running the dev server and hot module replacement (HMR)
- The two React packages: `react` vs `react-dom`
- StrictMode and why it double-invokes effects in dev
- React Developer Tools (browser extension)
- The render tree and the virtual DOM at a glance

### Key Concepts

- React is declarative: you describe UI as a function of state, React reconciles changes
- Components are JavaScript functions that return JSX
- The virtual DOM is a lightweight tree React diffs before touching the real DOM
- Single-source-of-truth rendering: same props/state -> same output
- React 18+ enables automatic batching and concurrent features by default

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
# Open the printed URL (usually http://localhost:5173)
```
Caption: Scaffolding a project

### Common Pitfalls

- Using Create React App in 2024+ — it is deprecated and slow; use Vite (or Next.js for SSR) for new projects.
- Forgetting that StrictMode double-invokes effects in dev — this is intentional to surface side-effect bugs and does NOT happen in production.
- Editing `index.html` outside the project root — Vite resolves `index.html` as the entry; moving it breaks the dev server.
- Importing React 17-style (`import React from "react"`) and assuming you need it — with the modern JSX transform you only need to import the hooks you use.
- Treating the React DevTools Profiler as optional — install it now; you will need it from Stage 13 onward.

### Real-World Applications

- Facebook's web interface is built on React; the original 2017 rewrite replaced the PHP/XHP stack and now powers News Feed, Marketplace, and Groups.
- Netflix's TV UI uses a React-based framework called Gibbon that targets custom embedded devices.
- Discord's desktop client is an Electron app rendering React components shared with the web client across millions of daily users.
- Notion's web app is a large React codebase with thousands of components, many memoized for fast block editing.

### Interview Questions

- 1. What problem does React solve? — It lets you describe UI as a function of state and abstracts away direct DOM mutations, making complex interfaces predictable and reusable.
- 2. Library or framework? — React is a library for rendering UI; routing, data fetching, and bundling come from the ecosystem (React Router, TanStack Query, Vite, Next.js).
- 3. What is the virtual DOM? — An in-memory tree of React elements React diffs against the previous tree to compute the minimum set of DOM mutations.
- 4. Why does StrictMode double-invoke effects? — To surface side-effect bugs (e.g. missing cleanup) that would only appear in production during remounts.
- 5. What is the difference between `react` and `react-dom`? — `react` defines components, hooks, and elements; `react-dom` renders them to the browser DOM (other renderers target native, canvas, terminal).

### Mini Project

Build a "Hello, React" profile card: A single-page app that renders a card with your name, role, and a button that toggles between "Follow" and "Following". Use Vite + TypeScript, take an optional `name` prop, and persist the follow state to `localStorage`. Suggested approach:
  - Scaffold with `npm create vite@latest -- --template react-ts`
  - Create a `ProfileCard` component accepting a `name: string` prop
  - Add `useState<boolean>` initialized from `localStorage.getItem`
  - Use a `useEffect` to write the value back to `localStorage` on change
  - Style with plain CSS imported into the component

### Exercises

1. Scaffold a Vite + React + TS project and confirm `npm run dev` shows the default template.
2. Replace `App.tsx` with a component that prints your name in an `<h1>` and the current year in a `<p>`.
3. Install the React DevTools extension and inspect the component tree of your running app.
4. Wrap `App` in `<StrictMode>` and add a `console.log` to your component body — observe the double log in dev, then verify it logs once in production (`npm run build && npm run preview`).
5. Add a second component `Footer` and render it below your heading.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command scaffolds a new Vite + React + TypeScript project?
9. A) npm create vite@latest my-app -- --template react-ts (*)
10. B) npx create-react-app my-app
11. C) npm init react my-app
12. D) npm install react my-app
13. Explanation: `npm create vite@latest` with the `react-ts` template scaffolds a modern, fast Vite + React + TypeScript project; Create React App is deprecated.
14. Q2: Which package actually renders React elements to the browser DOM?
15. A) react
16. B) react-dom (*)
17. C) vite
18. D) react-router
19. Explanation: `react` defines components and hooks; `react-dom` provides `createRoot` and the renderer that mounts elements to the real DOM.
20. Q3: What is the virtual DOM?
21. A) A browser API for fast DOM updates
22. B) A CDN-hosted copy of the DOM
23. C) An in-memory tree of React elements React diffs before applying real DOM mutations (*)
24. D) A Web Worker that mirrors the DOM
25. Explanation: React keeps an in-memory element tree, diffs it against the previous version, and applies only the resulting DOM mutations.
26. Q4: Why does StrictMode double-invoke some functions in development?
27. A) To make the app run twice as fast
28. B) To enable concurrent rendering
29. C) To improve code splitting
30. D) To surface bugs from impure renders and missing effect cleanups (*)
31. Explanation: StrictMode intentionally double-invokes render, effects, and state updaters in dev to flush out impure code and missing cleanup before it ships.
32. Q5: Which file is the Vite entry point for a React app?
33. A) src/main.tsx mounted into index.html's #root (*)
34. B) public/index.html
35. C) vite.config.ts
36. D) package.json
37. Explanation: Vite uses `index.html` as the entry, which references `src/main.tsx`; `main.tsx` calls `createRoot(...).render(<App/>)` into the `#root` div.
38. Q6: What does HMR stand for in the Vite dev server?
39. A) High Memory Runtime
40. B) Hot Module Replacement (*)
41. C) HTTP Multi-Request
42. D) Hard Module Reload
43. Explanation: HMR (Hot Module Replacement) swaps updated modules in the browser without a full reload, preserving component state during development.
44. Q7: Which of the following is true about React 18's automatic batching?
45. A) It only batches updates inside event handlers
46. B) It batches server-side renders only
47. C) It batches state updates in event handlers, timeouts, promises, and native handlers (*)
48. D) It must be enabled via a flag
49. Explanation: React 18 batches updates in all contexts (timeouts, promises, native events) instead of only inside React event handlers like React 17.
50. Q8: What is a React component, conceptually?
51. A) A class extending HTMLElement
52. B) An HTML custom element
53. C) A CSS module
54. D) A function (or class) that returns React elements describing UI (*)
55. Explanation: A React component is a function (in modern React) that takes props and returns a tree of React elements — JSX compiles to `React.createElement` calls.
56. Q9: Where should you NOT install React DevTools?
57. A) Inside your deployed bundle for end users (*)
58. B) In your development browser
59. C) In production via the standalone app for remote debugging
60. D) On a Node script using `react-dom/server`
61. Explanation: DevTools is a debugging aid; never ship it to end users. Use the standalone Electron app to inspect remote/production builds.
62. Q10: Which statement best describes React's rendering model?
63. A) Imperative: you write `document.querySelector` to update the DOM
64. B) Declarative: you describe UI as a function of state, React reconciles changes (*)
65. C) Reactive: it observes streams automatically
66. D) Procedural: it runs a step-by-step render script
67. Explanation: React is declarative — given the same props and state it produces the same UI; you mutate state and let React figure out the DOM updates.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command scaffolds a new Vite + React + TypeScript project?
  options:
    - npm create vite@latest my-app -- --template react-ts
    - npx create-react-app my-app
    - npm init react my-app
    - npm install react my-app
  correctIndex: 0
  explanation: "`npm create vite@latest` with the `react-ts` template scaffolds a modern, fast Vite + React + TypeScript project; Create React App is deprecated."
- id: q2
  question: Which package actually renders React elements to the browser DOM?
  options:
    - react
    - react-dom
    - vite
    - react-router
  correctIndex: 1
  explanation: "`react` defines components and hooks; `react-dom` provides `createRoot` and the renderer that mounts elements to the real DOM."
- id: q3
  question: What is the virtual DOM?
  options:
    - A browser API for fast DOM updates
    - A CDN-hosted copy of the DOM
    - An in-memory tree of React elements React diffs before applying real DOM mutations
    - A Web Worker that mirrors the DOM
  correctIndex: 2
  explanation: React keeps an in-memory element tree, diffs it against the previous version, and applies only the resulting DOM mutations.
- id: q4
  question: Why does StrictMode double-invoke some functions in development?
  options:
    - To make the app run twice as fast
    - To enable concurrent rendering
    - To improve code splitting
    - To surface bugs from impure renders and missing effect cleanups
  correctIndex: 3
  explanation: StrictMode intentionally double-invokes render, effects, and state updaters in dev to flush out impure code and missing cleanup before it ships.
- id: q5
  question: Which file is the Vite entry point for a React app?
  options:
    - "src/main.tsx mounted into index.html's #root"
    - public/index.html
    - vite.config.ts
    - package.json
  correctIndex: 0
  explanation: Vite uses `index.html` as the entry, which references `src/main.tsx`; `main.tsx` calls `createRoot(...).render(<App/>)` into the `#root` div.
- id: q6
  question: What does HMR stand for in the Vite dev server?
  options:
    - High Memory Runtime
    - Hot Module Replacement
    - HTTP Multi-Request
    - Hard Module Reload
  correctIndex: 1
  explanation: HMR (Hot Module Replacement) swaps updated modules in the browser without a full reload, preserving component state during development.
- id: q7
  question: Which of the following is true about React 18's automatic batching?
  options:
    - It only batches updates inside event handlers
    - It batches server-side renders only
    - It batches state updates in event handlers, timeouts, promises, and native handlers
    - It must be enabled via a flag
  correctIndex: 2
  explanation: React 18 batches updates in all contexts (timeouts, promises, native events) instead of only inside React event handlers like React 17.
- id: q8
  question: What is a React component, conceptually?
  options:
    - A class extending HTMLElement
    - An HTML custom element
    - A CSS module
    - A function (or class) that returns React elements describing UI
  correctIndex: 3
  explanation: A React component is a function (in modern React) that takes props and returns a tree of React elements — JSX compiles to `React.createElement` calls.
- id: q9
  question: Where should you NOT install React DevTools?
  options:
    - Inside your deployed bundle for end users
    - In your development browser
    - In production via the standalone app for remote debugging
    - On a Node script using `react-dom/server`
  correctIndex: 0
  explanation: DevTools is a debugging aid; never ship it to end users. Use the standalone Electron app to inspect remote/production builds.
- id: q10
  question: Which statement best describes React's rendering model?
  options:
    - "Imperative: you write `document.querySelector` to update the DOM"
    - "Declarative: you describe UI as a function of state, React reconciles changes"
    - "Reactive: it observes streams automatically"
    - "Procedural: it runs a step-by-step render script"
  correctIndex: 1
  explanation: React is declarative — given the same props and state it produces the same UI; you mutate state and let React figure out the DOM updates.
```

