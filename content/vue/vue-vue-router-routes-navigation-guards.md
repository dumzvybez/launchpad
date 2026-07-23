---
slug: vue-vue-router-routes-navigation-guards
id: vue-15
track: vue
order: 15
title: Vue Router — Routes, Navigation Guards
description: Build a multi-page SPA with Vue Router 4, define routes with dynamic segments and nested children, and protect routes with navigation guards.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=240s
whyItMatters: Build a multi-page SPA with Vue Router 4, define routes with dynamic segments and nested children, and protect routes with navigation guards.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Vue Router — Routes, Navigation Guards

## Vue Router — Routes, Navigation Guards

### Why It Matters

Build a multi-page SPA with Vue Router 4, define routes with dynamic segments and nested children, and protect routes with navigation guards.

Build a multi-page SPA with Vue Router 4, define routes with dynamic segments and nested children, and protect routes with navigation guards.

### Prerequisites

- Stage 10: Components and Props.
- Stage 13: Lifecycle hooks.
- Stage 14: Composables (for useRoute / useRouter).

### Topics

- Installing Vue Router (`npm install vue-router@4`)
- Creating routes with `createRouter` and `createWebHistory`
- `<RouterLink>` and `<RouterView>`
- Dynamic segments (`:id`) and `useRoute().params`
- Nested routes and child `<RouterView>`
- Named routes and redirects
- Navigation guards: `beforeEach`, `beforeEnter`, `beforeRouteLeave`
- Lazy-loaded routes with `() => import(...)` and `definePage` (Nuxt meta)

### Key Concepts

- Vue Router 4 is the official router for Vue 3 (Vue Router 3 was for Vue 2)
- `createWebHistory()` for HTML5 history mode; `createWebHashHistory()` for hash mode (no server config)
- `<RouterLink to="...">` renders an `<a>` with the right href and adds `router-link-active` / `router-link-exact-active` classes
- Navigation guards let you authorize, redirect, or cancel a navigation
- Route components can be lazy-loaded via dynamic `() => import()` for code-splitting

```ts
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
    {
      path: "/user/:id",
      name: "user",
      component: () => import("@/views/User.vue"),
      props: true,  // pass :id as a prop
    },
  ],
});

export default router;
```
Caption: Basic router setup

### Common Pitfalls

- Forgetting to install the router plugin — `createApp(App).use(router)` is required; otherwise `<RouterView>` and `<RouterLink>` are unregistered.
- Using `createWebHistory` without server config — deep links return 404; configure the server to fall back to `index.html` for unknown paths.
- Mutating `route.params` directly — params are read-only; use `router.push` to navigate.
- Returning `false` vs redirecting in a guard — `false` cancels navigation silently; redirect by returning a route location object.
- Forgetting to lazy-load heavy routes — `component: Heavy` bundles Heavy in the main chunk; use `() => import("@/Heavy.vue")` to code-split.

### Real-World Applications

- GitLab's router has hundreds of nested routes with per-route guards checking permissions and feature flags.
- Alibaba's Tmall SPA uses lazy-loaded routes for category pages, with route-level code-splitting for fast initial loads.
- Behance's portfolio router uses dynamic segments for `/user/:username/project/:projectId` with deep-linking from social shares.
- Adobe Portfolio's editor uses nested routes with layout components for the dashboard, settings, and analytics sub-pages.

### Interview Questions

- 1. What's the difference between `createWebHistory` and `createWebHashHistory`? — WebHistory uses HTML5 pushState (clean URLs, needs server fallback); HashHistory uses `#` fragments (works without server config).
- 2. How do you pass a dynamic segment as a prop? — Set `props: true` on the route; the segment value becomes a prop on the component.
- 3. What are navigation guards? — Functions that run before/after a navigation, allowing you to authorize, redirect, or cancel.
- 4. How do you lazy-load a route component? — Use `component: () => import("@/Heavy.vue")` so webpack/Vite code-splits it into a separate chunk.
- 5. How does `<RouterLink>` differ from a plain `<a href>`? — RouterLink intercepts the click, uses history.pushState, and adds active classes; a plain `<a>` triggers a full page reload.

### Mini Project

Build a "Multi-Page Blog" SPA: Routes for `/`, `/posts/:slug`, `/admin` (guarded), and `/login`. Use lazy-loaded post components, a navigation guard for `/admin`, and a redirect from `/home` to `/`. Suggested approach:
  - Create a router with routes for Home, Post, Admin, Login, and a redirect
  - Use `() => import("@/views/Post.vue")` for lazy loading
  - Add `meta: { requiresAuth: true }` to the admin route
  - Add `beforeEach` to check `localStorage.getItem("token")` and redirect to `/login?redirect=...`
  - In `Login.vue`, set the token on submit and `router.push(route.query.redirect || "/")`

### Exercises

1. Install Vue Router, register it, and add three routes; navigate between them with `<RouterLink>`.
2. Add a dynamic segment `/user/:id` and read it via `useRoute().params`.
3. Build a nested route layout with a parent `<RouterView>` and two child routes.
4. Add a `beforeEach` guard that logs each navigation and redirects unauthenticated users.
5. Convert one route to a lazy-loaded component and verify the chunk loads on navigation.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which function creates an HTML5 history-mode router?
9. A) createHistory()
10. B) createBrowserHistory()
11. C) createWebHistory() (*)
12. D) createWebHashHistory()
13. Explanation: `createWebHistory()` enables HTML5 history mode (clean URLs); `createWebHashHistory()` uses `#` fragments and needs no server config.
14. Q2: Which component renders the matched route's component?
15. A) <RouterLink>
16. B) <Route>
17. C) <Outlet>
18. D) <RouterView> (*)
19. Explanation: `<RouterView>` renders the component matched by the current route; `<RouterLink>` renders navigation links.
20. Q3: How do you pass a dynamic segment `/user/:id` to the component as a prop?
21. A) Set `props: true` on the route (*)
22. B) Use v-model
23. C) Use provide/inject
24. D) You cannot
25. Explanation: Setting `props: true` on a route with dynamic segments passes each segment as a prop to the component.
26. Q4: What does a navigation guard returning `false` do?
27. A) Redirects to home
28. B) Cancels the navigation silently (*)
29. C) Throws an error
30. D) Reloads the page
31. Explanation: Returning `false` from a guard cancels the navigation; returning a route location object redirects to that route.
32. Q5: How do you lazy-load a route component?
33. A) component: lazy("./X.vue")
34. B) lazy: true
35. C) component: () => import("./X.vue") (*)
36. D) async: true
37. Explanation: A dynamic import `() => import("./X.vue")` lets the bundler code-split the route component into a separate chunk loaded on navigation.
38. Q6: Which hook runs before every navigation?
39. A) router.beforeAll
40. B) router.onEach
41. C) router.pre
42. D) router.beforeEach (*)
43. Explanation: `router.beforeEach((to, from) => ...)` runs before every navigation globally; per-route guards use `beforeEnter`.
44. Q7: What's required on the server when using createWebHistory?
45. A) A fallback to index.html for unknown paths (*)
46. B) Nothing
47. C) A CDN
48. D) HTTPS
49. Explanation: With history mode, deep links return 404 unless the server falls back to `index.html` for any unknown path; hash mode avoids this.
50. Q8: What does `<RouterLink to="/about">` render as?
51. A) A <div>
52. B) An <a> tag with the correct href and active classes (*)
53. C) A <button>
54. D) A <span>
55. Explanation: `<RouterLink>` renders an `<a>` tag; it intercepts the click, uses history.pushState, and applies `router-link-active` / `router-link-exact-active` classes.
56. Q9: How do you access the current route's params in a component?
57. A) useRouter().params
58. B) this.params
59. C) useRoute().params (*)
60. D) $route.params only (no composable)
61. Explanation: `useRoute()` returns the current reactive route object with `params`, `query`, `path`, etc.; `useRouter()` returns the router instance for navigation.
62. Q10: Which is TRUE about nested routes?
63. A) They must use hash mode
64. B) They are deprecated
65. C) They require a special prop
66. D) They use a `children` array on the parent route and a <RouterView> in the parent (*)
67. Explanation: Nested routes are declared via `children: [...]` on a route; the parent component renders a `<RouterView>` where the matched child renders.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which function creates an HTML5 history-mode router?
  options:
    - createHistory()
    - createBrowserHistory()
    - createWebHistory()
    - createWebHashHistory()
  correctIndex: 2
  explanation: "`createWebHistory()` enables HTML5 history mode (clean URLs); `createWebHashHistory()` uses `#` fragments and needs no server config."
- id: q2
  question: Which component renders the matched route's component?
  options:
    - <RouterLink>
    - <Route>
    - <Outlet>
    - <RouterView>
  correctIndex: 3
  explanation: "`<RouterView>` renders the component matched by the current route; `<RouterLink>` renders navigation links."
- id: q3
  question: How do you pass a dynamic segment `/user/:id` to the component as a prop?
  options:
    - "Set `props: true` on the route"
    - Use v-model
    - Use provide/inject
    - You cannot
  correctIndex: 0
  explanation: "Setting `props: true` on a route with dynamic segments passes each segment as a prop to the component."
- id: q4
  question: What does a navigation guard returning `false` do?
  options:
    - Redirects to home
    - Cancels the navigation silently
    - Throws an error
    - Reloads the page
  correctIndex: 1
  explanation: Returning `false` from a guard cancels the navigation; returning a route location object redirects to that route.
- id: q5
  question: How do you lazy-load a route component?
  options:
    - 'component: lazy("./X.vue")'
    - "lazy: true"
    - 'component: () => import("./X.vue")'
    - "async: true"
  correctIndex: 2
  explanation: A dynamic import `() => import("./X.vue")` lets the bundler code-split the route component into a separate chunk loaded on navigation.
- id: q6
  question: Which hook runs before every navigation?
  options:
    - router.beforeAll
    - router.onEach
    - router.pre
    - router.beforeEach
  correctIndex: 3
  explanation: "`router.beforeEach((to, from) => ...)` runs before every navigation globally; per-route guards use `beforeEnter`."
- id: q7
  question: What's required on the server when using createWebHistory?
  options:
    - A fallback to index.html for unknown paths
    - Nothing
    - A CDN
    - HTTPS
  correctIndex: 0
  explanation: With history mode, deep links return 404 unless the server falls back to `index.html` for any unknown path; hash mode avoids this.
- id: q8
  question: What does `<RouterLink to="/about">` render as?
  options:
    - A <div>
    - An <a> tag with the correct href and active classes
    - A <button>
    - A <span>
  correctIndex: 1
  explanation: "`<RouterLink>` renders an `<a>` tag; it intercepts the click, uses history.pushState, and applies `router-link-active` / `router-link-exact-active` classes."
- id: q9
  question: How do you access the current route's params in a component?
  options:
    - useRouter().params
    - this.params
    - useRoute().params
    - $route.params only (no composable)
  correctIndex: 2
  explanation: "`useRoute()` returns the current reactive route object with `params`, `query`, `path`, etc.; `useRouter()` returns the router instance for navigation."
- id: q10
  question: Which is TRUE about nested routes?
  options:
    - They must use hash mode
    - They are deprecated
    - They require a special prop
    - They use a `children` array on the parent route and a <RouterView> in the parent
  correctIndex: 3
  explanation: "Nested routes are declared via `children: [...]` on a route; the parent component renders a `<RouterView>` where the matched child renders."
```

