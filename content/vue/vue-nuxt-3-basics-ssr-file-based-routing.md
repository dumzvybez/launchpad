---
slug: vue-nuxt-3-basics-ssr-file-based-routing
id: vue-19
track: vue
order: 19
title: Nuxt 3 Basics — SSR, File-Based Routing
description: Build a Nuxt 3 app with server-side rendering, file-based routing, automatic imports, data fetching with `useFetch`/`useAsyncData`, and SEO meta tags.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=480s
whyItMatters: Build a Nuxt 3 app with server-side rendering, file-based routing, automatic imports, data fetching with `useFetch`/`useAsyncData`, and SEO meta tags.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Nuxt 3 Basics — SSR, File-Based Routing

## Nuxt 3 Basics — SSR, File-Based Routing

### Why It Matters

Build a Nuxt 3 app with server-side rendering, file-based routing, automatic imports, data fetching with `useFetch`/`useAsyncData`, and SEO meta tags.

Build a Nuxt 3 app with server-side rendering, file-based routing, automatic imports, data fetching with `useFetch`/`useAsyncData`, and SEO meta tags.

### Prerequisites

- Stage 14: Composables (Nuxt uses them everywhere).
- Stage 15: Vue Router (Nuxt abstracts it but the concepts matter).
- Stage 16: Pinia (works in Nuxt via the official module).

### Topics

- What Nuxt 3 is (a meta-framework on Vue 3, like Next.js for React)
- `npx nuxi@latest init` scaffolding
- File-based routing in `pages/`
- Server-side rendering and `universal` vs `spa` mode
- `useFetch` and `useAsyncData` for SSR-friendly data fetching
- `definePageMeta` and `definePage` for route metadata
- `useHead` and SEO meta tags
- Layouts, middleware, and plugins

### Key Concepts

- Nuxt 3 is to Vue what Next.js is to React — a meta-framework with SSR, file routing, and conventions
- Pages in `pages/` automatically become routes (`pages/index.vue` -> `/`, `pages/users/[id].vue` -> `/users/:id`)
- `useFetch(url)` runs on the server during SSR, then hydrates on the client without a refetch
- `definePageMeta({ middleware: ["auth"] })` runs middleware before the page renders
- `useHead({ title, meta })` sets the document head with SSR support

```bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
npm run dev
# Open http://localhost:3000
```
Caption: Scaffold a Nuxt app

### Common Pitfalls

- Using `fetch` directly in setup instead of `useFetch` — plain `fetch` does not run on the server, so SSR has no data and the client refetches (waterfall).
- Forgetting `await` before `useFetch` in setup — the response is a ref you can use, but to block SSR until data is ready, `await useFetch(...)` (Nuxt supports top-level await in setup).
- Mutating `useFetch` data without understanding dedup — Nuxt dedupes requests by URL/key; pass a unique `key` for distinct fetches.
- Using window/document in setup — they don't exist during SSR; guard with `if (process.client)` or use them in `onMounted`.
- Forgetting that file-based routing requires `pages/` to exist — without `pages/`, Nuxt runs in "app.vue only" mode with no router.

### Real-World Applications

- GitLab's marketing site (about.gitlab.com) is partially Nuxt-driven for content-heavy SEO pages.
- Alibaba uses Nuxt for content sites where SSR + SEO matter more than SPA interactivity.
- Behance's blog and marketing pages use Nuxt 3 for SSR and SEO.
- Nintendo of America's news pages use Nuxt 3 for fast SSR and structured data.

### Interview Questions

- 1. What is Nuxt 3? — A meta-framework on Vue 3 that adds SSR, file-based routing, automatic imports, data fetching, and conventions — analogous to Next.js for React.
- 2. How does file-based routing work in Nuxt? — Files in `pages/` become routes: `pages/index.vue` -> `/`, `pages/users/[id].vue` -> `/users/:id`, `pages/posts/[...slug].vue` -> catch-all.
- 3. What's the difference between `useFetch` and a plain `fetch`? — `useFetch` runs on the server during SSR, dedupes, and hydrates the client without a refetch; plain `fetch` runs only on the client.
- 4. What's `useAsyncData` for? — Generic SSR-friendly data fetching where you supply a resolver function and a unique key (more flexible than `useFetch`'s URL-keyed dedup).
- 5. How does Nuxt middleware differ from Vue Router guards? — Nuxt middleware runs on both server and client during SSR navigation; Vue Router guards run client-side only (Nuxt wraps them).

### Mini Project

Build a "Blog" with Nuxt 3: Pages for `/` (post list), `/posts/[slug]` (single post via `useFetch`), and `/about`. Add SEO meta on each page, an `auth` middleware that protects `/admin`, and a layout with a header + footer. Suggested approach:
  - Scaffold with `npx nuxi@latest init`
  - Create `pages/index.vue`, `pages/posts/[slug].vue`, `pages/about.vue`
  - Use `await useFetch("/api/posts")` for the list and `await useFetch(() => `/api/posts/${route.params.slug}`)` for the single post
  - Add `useHead({ title, meta })` on each page for SEO
  - Create `middleware/auth.ts` and `definePageMeta({ middleware: "auth" })` on `/admin`

### Exercises

1. Scaffold a Nuxt 3 app and add `pages/index.vue` and `pages/about.vue`.
2. Add a dynamic route `pages/users/[id].vue` and read `route.params.id`.
3. Use `useFetch` to load a list from a placeholder API and render it with SSR.
4. Add `useHead({ title })` to a page and verify the title in the browser tab and the SSR HTML.
5. Create a middleware that redirects to `/login` if no auth cookie is set.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Nuxt 3?
9. A) A Vue plugin
10. B) A state management library
11. C) A meta-framework on Vue 3 with SSR, file-based routing, and conventions (*)
12. D) A testing tool
13. Explanation: Nuxt 3 is to Vue what Next.js is to React — a meta-framework adding SSR, file routing, data fetching, and conventions.
14. Q2: How does file-based routing work in Nuxt?
15. A) Via a config file
16. B) You import them in router.ts
17. C) It uses Vue Router's standard routes array
18. D) Files in pages/ automatically become routes (*)
19. Explanation: Files in `pages/` become routes: `index.vue` -> `/`, `about.vue` -> `/about`, `users/[id].vue` -> `/users/:id`.
20. Q3: Which composable fetches data with SSR support?
21. A) useFetch (*)
22. B) fetch()
23. C) axios()
24. D) useResource()
25. Explanation: `useFetch(url)` runs on the server during SSR, dedupes by URL, and hydrates the client without a refetch; plain `fetch` is client-only.
26. Q4: What happens if you use plain fetch() in a Nuxt setup?
27. A) It runs on the server too
28. B) It runs only on the client, so SSR has no data and the client refetches (waterfall) (*)
29. C) It throws an error
30. D) It is blocked by Nuxt
31. Explanation: Plain `fetch` runs only on the client, so the server-rendered HTML has no data; use `useFetch`/`useAsyncData` for SSR-aware fetching.
32. Q5: How do you set the page title in Nuxt?
33. A) document.title = "..."
34. B) this.$title
35. C) useHead({ title: "..." }) (*)
36. D) <title> in template
37. Explanation: `useHead({ title, meta })` sets the document head with SSR support; the title appears in the SSR HTML and updates on the client.
38. Q6: Which is the catch-all route file in Nuxt?
39. A) pages/all.vue
40. B) pages/*.{vue}
41. C) pages/catch-all.vue
42. D) pages/[...slug].vue (*)
43. Explanation: `[...slug].vue` creates a catch-all (404 fallback or nested path); it captures all unmatched sub-paths as `slug` array.
44. Q7: Where does Nuxt middleware run?
45. A) Both server and client during navigation (*)
46. B) Client only
47. C) Server only
48. D) In a Web Worker
49. Explanation: Nuxt middleware runs on both server (during SSR navigation) and client; this differs from Vue Router guards which are client-only.
50. Q8: What does definePageMeta do?
51. A) Sets page SEO
52. B) Defines route-level metadata like middleware, layout, and keepalive (*)
53. C) Validates the page props
54. D) Imports a layout
55. Explanation: `definePageMeta({ middleware: "auth", layout: "default", keepalive: true })` configures the route's metadata applied by Nuxt during routing.
56. Q9: Why is using `window` directly in Nuxt setup risky?
57. A) It is forbidden
58. B) It is slow
59. C) `window` does not exist during SSR; guard with `process.client` or use in onMounted (*)
60. D) It throws a TypeScript error
61. Explanation: SSR runs in Node where `window` is undefined; access browser APIs only in client-side code (`onMounted`, `if (process.client)`).
62. Q10: Which Nuxt mode renders HTML on the server then hydrates on the client?
63. A) spa
64. B) static
65. C) legacy
66. D) universal (SSR) (*)
67. Explanation: `universal` mode (default) renders on the server and hydrates on the client; `spa` mode skips SSR and renders only on the client.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is Nuxt 3?
  options:
    - A Vue plugin
    - A state management library
    - A meta-framework on Vue 3 with SSR, file-based routing, and conventions
    - A testing tool
  correctIndex: 2
  explanation: Nuxt 3 is to Vue what Next.js is to React — a meta-framework adding SSR, file routing, data fetching, and conventions.
- id: q2
  question: How does file-based routing work in Nuxt?
  options:
    - Via a config file
    - You import them in router.ts
    - It uses Vue Router's standard routes array
    - Files in pages/ automatically become routes
  correctIndex: 3
  explanation: "Files in `pages/` become routes: `index.vue` -> `/`, `about.vue` -> `/about`, `users/[id].vue` -> `/users/:id`."
- id: q3
  question: Which composable fetches data with SSR support?
  options:
    - useFetch
    - fetch()
    - axios()
    - useResource()
  correctIndex: 0
  explanation: "`useFetch(url)` runs on the server during SSR, dedupes by URL, and hydrates the client without a refetch; plain `fetch` is client-only."
- id: q4
  question: What happens if you use plain fetch() in a Nuxt setup?
  options:
    - It runs on the server too
    - It runs only on the client, so SSR has no data and the client refetches (waterfall)
    - It throws an error
    - It is blocked by Nuxt
  correctIndex: 1
  explanation: Plain `fetch` runs only on the client, so the server-rendered HTML has no data; use `useFetch`/`useAsyncData` for SSR-aware fetching.
- id: q5
  question: How do you set the page title in Nuxt?
  options:
    - document.title = "..."
    - this.$title
    - 'useHead({ title: "..." })'
    - <title> in template
  correctIndex: 2
  explanation: "`useHead({ title, meta })` sets the document head with SSR support; the title appears in the SSR HTML and updates on the client."
- id: q6
  question: Which is the catch-all route file in Nuxt?
  options:
    - pages/all.vue
    - pages/*.{vue}
    - pages/catch-all.vue
    - pages/[...slug].vue
  correctIndex: 3
  explanation: "`[...slug].vue` creates a catch-all (404 fallback or nested path); it captures all unmatched sub-paths as `slug` array."
- id: q7
  question: Where does Nuxt middleware run?
  options:
    - Both server and client during navigation
    - Client only
    - Server only
    - In a Web Worker
  correctIndex: 0
  explanation: Nuxt middleware runs on both server (during SSR navigation) and client; this differs from Vue Router guards which are client-only.
- id: q8
  question: What does definePageMeta do?
  options:
    - Sets page SEO
    - Defines route-level metadata like middleware, layout, and keepalive
    - Validates the page props
    - Imports a layout
  correctIndex: 1
  explanation: "`definePageMeta({ middleware: \"auth\", layout: \"default\", keepalive: true })` configures the route's metadata applied by Nuxt during routing."
- id: q9
  question: Why is using `window` directly in Nuxt setup risky?
  options:
    - It is forbidden
    - It is slow
    - "`window` does not exist during SSR; guard with `process.client` or use in onMounted"
    - It throws a TypeScript error
  correctIndex: 2
  explanation: SSR runs in Node where `window` is undefined; access browser APIs only in client-side code (`onMounted`, `if (process.client)`).
- id: q10
  question: Which Nuxt mode renders HTML on the server then hydrates on the client?
  options:
    - spa
    - static
    - legacy
    - universal (SSR)
  correctIndex: 3
  explanation: "`universal` mode (default) renders on the server and hydrates on the client; `spa` mode skips SSR and renders only on the client."
```

