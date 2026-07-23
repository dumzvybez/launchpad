---
slug: vue-getting-started-vue
id: vue-01
track: vue
order: 1
title: Getting Started with Vue
description: Install Node.js, scaffold a Vue 3 project with create-vue, render your first single-file component, and understand how Vue mounts to the DOM.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0
whyItMatters: Install Node. js, scaffold a Vue 3 project with create-vue, render your first single-file component, and understand how Vue mounts to the DOM.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Getting Started with Vue

## Getting Started with Vue

### Why It Matters

Install Node. js, scaffold a Vue 3 project with create-vue, render your first single-file component, and understand how Vue mounts to the DOM.

Install Node.js, scaffold a Vue 3 project with create-vue, render your first single-file component, and understand how Vue mounts to the DOM.

### Prerequisites

- None — basic HTML/CSS/JS knowledge is helpful.
- Comfort using a terminal and a code editor (VS Code with the Vue - Official extension recommended).

### Topics

- What Vue is (progressive framework vs library) and where it fits in the ecosystem
- Scaffolding a project with `npm create vue@latest`
- Project structure: src/, index.html, vite.config.ts, package.json
- Running the dev server and Hot Module Replacement (HMR)
- Single-File Components (.vue files): template, script, style blocks
- Vue 3 vs Vue 2 — Vue 2 reached end-of-life on December 31, 2023
- Installing the Vue DevTools browser extension
- The createApp -> mount flow at a glance

### Key Concepts

- Vue is progressive: use it as a script tag, a single component, or a full SPA framework
- A Single-File Component (SFC) co-locates template, script, and style in one .vue file
- Vue 3's reactivity is built on ES Proxies (Vue 2 used Object.defineProperty)
- An app is created with createApp(App).mount('#app') — one app per mount point
- Vue 3.4+ defaults to the Composition API and <script setup> syntax

```bash
npm create vue@latest my-vue-app
# Answer prompts: TypeScript = Yes, JSX = No, Vue Router = No (for now),
# Pinia = No, Vitest = No, ESLint = Yes, Prettier = Yes
cd my-vue-app
npm install
npm run dev
# Open the printed URL (usually http://localhost:5173)
```
Caption: Scaffolding a project

### Common Pitfalls

- Using Vue CLI (vue create) in 2024+ — it is in maintenance mode; use npm create vue@latest (Vite-based) for new projects.
- Installing Vue 2 by mistake — Vue 2 reached EOL on December 31, 2023; always verify package.json shows "vue": "^3.4.0" or higher.
- Forgetting the Vue - Official (formerly Volar) VS Code extension — without it .vue files have no IntelliSense, type checking, or template errors.
- Putting a `<style>` block without `scoped` and accidentally polluting global styles — use `scoped` unless you intentionally want global CSS.
- Editing `index.html` outside the project root — Vite resolves `index.html` as the entry; moving it breaks the dev server.

### Real-World Applications

- Alibaba's Taobao and Tmall frontends use Vue at massive scale; the company contributes heavily to Vue and Element Plus.
- GitLab's web interface uses Vue.js for its issue boards, merge request views, and CI/CD pipeline visualizations.
- Nintendo of America's marketing site (nintendo.com) is built with Vue and Nuxt for fast SSR-driven content pages.
- Behance (an Adobe product) uses Vue for parts of its portfolio viewer and project browsing interface.

### Interview Questions

- 1. What problem does Vue solve? — It provides a reactive, component-based way to build UIs declaratively, with a gentle learning curve and officially supported router, store, and SSR tooling.
- 2. What is a Single-File Component? — A .vue file containing `<template>`, `<script>`, and `<style>` blocks for one component, compiled by @vue/compiler-sfc into JavaScript.
- 3. What's the difference between Vue CLI and create-vue? — Vue CLI (webpack, maintenance mode) is the old scaffolder; create-vue (Vite-based) is the official modern scaffolder for Vue 3.
- 4. Why did Vue 3 switch from Object.defineProperty to Proxy for reactivity? — Proxies can detect property addition/deletion and array index mutations, which Vue 2 could not do without Vue.set.
- 5. What does "progressive framework" mean for Vue? — You can adopt Vue incrementally: as a script tag, a single component on a page, or a full SPA with router, store, and SSR.

### Mini Project

Build a "Hello, Vue" profile card: A single-page app that renders a card with your name, role, and a button that toggles between "Follow" and "Following". Use create-vue with TypeScript, accept an optional `name` prop, and persist the follow state to localStorage. Suggested approach:
  - Scaffold with `npm create vue@latest` choosing TypeScript + ESLint + Prettier
  - Create a `ProfileCard.vue` SFC accepting a `name` prop with a default value
  - Add a `ref<boolean>` initialized from `localStorage.getItem("following")`
  - Use a `watch` to write the value back to `localStorage` on change
  - Style with a scoped `<style>` block using CSS custom properties for theming

### Exercises

1. Scaffold a create-vue + TypeScript project and confirm `npm run dev` shows the default template.
2. Replace `App.vue` with a component that prints your name in an `<h1>` and the current year in a `<p>`.
3. Install the Vue DevTools browser extension and inspect the component tree of your running app.
4. Add a second component `Footer.vue` and import it into `App.vue` below your heading.
5. Run `npm run build` and inspect the contents of `dist/` to see the compiled output.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command scaffolds a new Vue 3 project in 2024+?
9. A) npm create vue@latest my-app (*)
10. B) npm install -g vue-cli && vue create my-app
11. C) npx vue init webpack my-app
12. D) npm init vue-app my-app
13. Explanation: `npm create vue@latest` is the official Vite-based scaffolder; Vue CLI is in maintenance mode.
14. Q2: What are the three top-level blocks in a Single-File Component?
15. A) <html>, <body>, <script>
16. B) <template>, <script>, <style> (*)
17. C) <view>, <model>, <controller>
18. D) <markup>, <logic>, <css>
19. Explanation: An SFC co-locates `<template>`, `<script>`, and `<style>` blocks, compiled by @vue/compiler-sfc into a JavaScript component.
20. Q3: When did Vue 2 reach end-of-life?
21. A) January 1, 2022
22. B) July 1, 2024
23. C) December 31, 2023 (*)
24. D) December 31, 2020
25. Explanation: Vue 2's EOL was December 31, 2023; after that it receives no security patches or bug fixes from the core team.
26. Q4: What does createApp(App).mount('#app') do?
27. A) Creates a global Vue instance and mounts it to every element
28. B) Creates an HTML element with id="app"
29. C) Compiles the App component to a string
30. D) Creates a Vue application instance and mounts it to the #app element (*)
31. Explanation: `createApp(App)` returns an app instance; `.mount('#app')` attaches its render tree to the DOM element with id `app`.
32. Q5: Which reactivity primitive does Vue 3 use under the hood?
33. A) ES Proxies (*)
34. B) Object.defineProperty
35. C) getters only
36. D) MutationObserver
37. Explanation: Vue 3 uses ES Proxy for reactivity; Vue 2 used Object.defineProperty, which could not detect property addition or array index mutations.
38. Q6: Which VS Code extension provides IntelliSense for .vue files in Vue 3?
39. A) Vetur
40. B) Vue - Official (formerly Volar) (*)
41. C) ESLint
42. D) Prettier
43. Explanation: "Vue - Official" (the renamed Volar extension) provides language support for Vue 3 SFCs; Vetur is for Vue 2 and is deprecated.
44. Q7: What does HMR stand for in the Vite dev server?
45. A) High Memory Runtime
46. B) HTTP Multi-Request
47. C) Hot Module Replacement (*)
48. D) Hard Module Reload
49. Explanation: HMR (Hot Module Replacement) swaps updated modules in the browser without a full reload, preserving component state.
50. Q8: Which of the following is TRUE about Vue 3 SFCs?
51. A) They can have only one root element in <template>
52. B) They must include a <style> block
53. C) They cannot use TypeScript
54. D) They can have multiple root elements (fragments) in <template> (*)
55. Explanation: Vue 3 supports fragments — multiple root elements in a template; `<style>` is optional and TypeScript is supported via `lang="ts"`.
56. Q9: Which file is the Vite entry point for a Vue app?
57. A) src/main.ts mounted into index.html's #app (*)
58. B) public/index.html
59. C) vite.config.ts
60. D) App.vue
61. Explanation: Vite uses `index.html` as the entry, which references `src/main.ts`; `main.ts` calls createApp(App).mount('#app').
62. Q10: What is the recommended default API in Vue 3.4+ for new components?
63. A) Options API with data(), methods, computed
64. B) <script setup> with Composition API (*)
65. C) Class components
66. D) Mixins
67. Explanation: Vue 3.4+ defaults to `<script setup>` (a compile-time syntactic sugar over the Composition API) for cleaner, more reusable component code.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command scaffolds a new Vue 3 project in 2024+?
  options:
    - npm create vue@latest my-app
    - npm install -g vue-cli && vue create my-app
    - npx vue init webpack my-app
    - npm init vue-app my-app
  correctIndex: 0
  explanation: "`npm create vue@latest` is the official Vite-based scaffolder; Vue CLI is in maintenance mode."
- id: q2
  question: What are the three top-level blocks in a Single-File Component?
  options:
    - <html>, <body>, <script>
    - <template>, <script>, <style>
    - <view>, <model>, <controller>
    - <markup>, <logic>, <css>
  correctIndex: 1
  explanation: An SFC co-locates `<template>`, `<script>`, and `<style>` blocks, compiled by @vue/compiler-sfc into a JavaScript component.
- id: q3
  question: When did Vue 2 reach end-of-life?
  options:
    - January 1, 2022
    - July 1, 2024
    - December 31, 2023
    - December 31, 2020
  correctIndex: 2
  explanation: Vue 2's EOL was December 31, 2023; after that it receives no security patches or bug fixes from the core team.
- id: q4
  question: What does createApp(App).mount('#app') do?
  options:
    - Creates a global Vue instance and mounts it to every element
    - Creates an HTML element with id="app"
    - Compiles the App component to a string
    - "Creates a Vue application instance and mounts it to the #app element"
  correctIndex: 3
  explanation: "`createApp(App)` returns an app instance; `.mount('#app')` attaches its render tree to the DOM element with id `app`."
- id: q5
  question: Which reactivity primitive does Vue 3 use under the hood?
  options:
    - ES Proxies
    - Object.defineProperty
    - getters only
    - MutationObserver
  correctIndex: 0
  explanation: Vue 3 uses ES Proxy for reactivity; Vue 2 used Object.defineProperty, which could not detect property addition or array index mutations.
- id: q6
  question: Which VS Code extension provides IntelliSense for .vue files in Vue 3?
  options:
    - Vetur
    - Vue - Official (formerly Volar)
    - ESLint
    - Prettier
  correctIndex: 1
  explanation: '"Vue - Official" (the renamed Volar extension) provides language support for Vue 3 SFCs; Vetur is for Vue 2 and is deprecated.'
- id: q7
  question: What does HMR stand for in the Vite dev server?
  options:
    - High Memory Runtime
    - HTTP Multi-Request
    - Hot Module Replacement
    - Hard Module Reload
  correctIndex: 2
  explanation: HMR (Hot Module Replacement) swaps updated modules in the browser without a full reload, preserving component state.
- id: q8
  question: Which of the following is TRUE about Vue 3 SFCs?
  options:
    - They can have only one root element in <template>
    - They must include a <style> block
    - They cannot use TypeScript
    - They can have multiple root elements (fragments) in <template>
  correctIndex: 3
  explanation: Vue 3 supports fragments — multiple root elements in a template; `<style>` is optional and TypeScript is supported via `lang="ts"`.
- id: q9
  question: Which file is the Vite entry point for a Vue app?
  options:
    - "src/main.ts mounted into index.html's #app"
    - public/index.html
    - vite.config.ts
    - App.vue
  correctIndex: 0
  explanation: Vite uses `index.html` as the entry, which references `src/main.ts`; `main.ts` calls createApp(App).mount('#app').
- id: q10
  question: What is the recommended default API in Vue 3.4+ for new components?
  options:
    - Options API with data(), methods, computed
    - <script setup> with Composition API
    - Class components
    - Mixins
    - for cleaner, more reusable component code.
  correctIndex: 1
  explanation: Vue 3.4+ defaults to `<script setup>` (a compile-time syntactic sugar over the Composition API) for cleaner, more reusable component code.
```

