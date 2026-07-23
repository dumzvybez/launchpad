---
slug: svelte-sveltekit-routing-layouts
id: svelte-13
track: svelte
order: 13
title: SvelteKit — Routing and Layouts
description: Build file-based routes in SvelteKit 2, nest layouts, use path parameters and route groups, and understand the +page / +layout conventions.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=WK4SN853CqI&t=60s
whyItMatters: Build file-based routes in SvelteKit 2, nest layouts, use path parameters and route groups, and understand the +page / +layout conventions.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# SvelteKit — Routing and Layouts

## SvelteKit — Routing and Layouts

### Why It Matters

Build file-based routes in SvelteKit 2, nest layouts, use path parameters and route groups, and understand the +page / +layout conventions.

Build file-based routes in SvelteKit 2, nest layouts, use path parameters and route groups, and understand the +page / +layout conventions.

### Prerequisites

- Stage 1: Getting Started with Svelte
- Stage 3: Components and Props
- Basic understanding of URL routing.

### Topics

- File-based routing: src/routes/
- +page.svelte vs +layout.svelte
- Path parameters: [slug], [id]
- Catch-all routes: [...path]
- Optional parameters: [[slug]]
- Route groups: (group)/
- Layout nesting and {@render children?.()}
- Page and layout metadata: +page.ts/+layout.ts

### Key Concepts

- Each folder under src/routes/ is a route segment; +page.svelte renders the page
- +layout.svelte wraps all pages in the same folder and below
- [param] is a dynamic segment; [...rest] is catch-all; [[optional]] is optional
- (group) folders don't add to the URL path — they group routes for shared layouts
- Layouts receive a `children` snippet they must render with {@render children()}

```text
src/routes/
  +page.svelte              → /
  about/+page.svelte        → /about
  blog/[slug]/+page.svelte  → /blog/hello-world
  blog/+layout.svelte       → wraps all /blog/* pages
  (marketing)/+page.svelte  → /  (grouped for layout, no URL change)
```
Caption: Basic routes

### Common Pitfalls

- Forgetting to render `children` in +layout.svelte — pages won't show; always call `{@render children?.()}`.
- Confusing (group) folders with regular folders — (group) doesn't appear in the URL but does provide a layout scope.
- Mismatching parameter names — `[slug]/+page.svelte` reads `$page.params.slug`, not `id`; names must match.
- Using `+page.svelte` where `+page.ts` is needed for load functions — load logic goes in `+page.ts` (or `.js`), not the .svelte file.
- Hardcoding URLs in <a href> — use relative URLs or `goto()` from `$app/navigation`; absolute paths break deploys to subpaths.

### Real-World Applications

- The New York Times uses SvelteKit routing to organize sections (world, business, technology) with shared layouts per section.
- Apple Music's web player uses nested layouts for the player chrome and per-route content (browse, library, search).
- Rakuten's storefront uses route groups to share marketing layouts across promotional pages without affecting URL structure.
- Chess.com's analysis tools use catch-all routes for game URLs like /game/12345 variations.

### Interview Questions

- 1. How does SvelteKit routing work? — File-based: each folder under src/routes/ is a segment; +page.svelte renders the route; +layout.svelte wraps descendants.
- 2. How do you define a dynamic parameter? — Name the folder with brackets: [slug] becomes $page.params.slug.
- 3. What's a route group? — A folder named (group) that doesn't affect the URL but provides a layout scope — useful for shared chrome across routes.
- 4. What does +layout.svelte need to render? — The `children` snippet via `{@render children?.()}`; forgetting this makes child pages invisible.
- 5. How do you read the current URL? — `import { page } from "$app/stores"; $page.url.pathname` (or the new `$app/state` in newer versions).

### Mini Project

Build a Multi-Section Documentation Site: A SvelteKit app with a root layout (header/nav + footer), a /docs section with its own sidebar layout, dynamic [slug] pages for individual docs, and a (marketing) group for landing/pricing with a distinct layout. Suggested approach:
  - Create src/routes/+layout.svelte with global nav + {@render children()}
  - Add docs/+layout.svelte with a sidebar linking to doc pages
  - Create docs/[slug]/+page.svelte reading $page.params.slug
  - Add (marketing)/+layout.svelte and (marketing)/+page.svelte for the landing
  - Use $page.url.pathname to highlight active nav links

### Exercises

1. Create routes for /, /about, /contact using +page.svelte files.
2. Add a +layout.svelte with a nav and ensure children render.
3. Build a /blog/[slug] route that displays the slug from $page.params.
4. Use a catch-all [...path] for /docs/* routes.
5. Group /pricing and /landing under (marketing) with a shared layout but no URL prefix.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where do SvelteKit routes live?
9. A) src/routes/ (*)
10. B) src/pages/
11. C) src/app/
12. D) src/views/
13. Explanation: SvelteKit uses file-based routing under src/routes/; each folder is a segment, +page.svelte renders the page.
14. Q2: What file renders a route's UI?
15. A) route.svelte
16. B) +page.svelte (*)
17. C) page.ts
18. D) index.svelte
19. Explanation: +page.svelte is the UI component for a route; +page.ts (or .js) holds load functions and metadata.
20. Q3: How do you define a dynamic segment?
21. A) /:slug
22. B) {slug} folder
23. C) [slug] folder (*)
24. D) * slug
25. Explanation: Name the folder with brackets: src/routes/blog/[slug]/+page.svelte matches /blog/hello-world with $page.params.slug === "hello-world".
26. Q4: What does +layout.svelte wrap?
27. A) Only the index page
28. B) Only the parent route
29. C) The server only
30. D) All pages in the same folder and below (*)
31. Explanation: Layouts cascade: a +layout.svelte wraps every +page.svelte in its folder and any descendant folder.
32. Q5: What must +layout.svelte render?
33. A) {@render children?.()} (snippet) (*)
34. B) <slot />
35. C) <Outlet />
36. D) Nothing
37. Explanation: In Svelte 5, layouts receive a `children` snippet; render it with `{@render children?.()}` or child pages won't appear.
38. Q6: What's a route group?
39. A) A route with a shared URL prefix
40. B) A folder named (group) that provides layout scope without affecting the URL (*)
41. C) A group of components
42. D) A middleware
43. Explanation: (group) folders don't appear in the URL — useful for sharing a layout across routes (e.g., (marketing) for landing pages).
44. Q7: How do you read the current URL in SvelteKit?
45. A) window.location.href
46. B) document.URL
47. C) import { page } from "$app/stores"; $page.url.pathname (*)
48. D) useLocation()
49. Explanation: `import { page } from "$app/stores"` gives a reactive store of the current route: $page.url, $page.params, $page.route.
50. Q8: What does [...path] match?
51. A) A single segment
52. B) An optional segment
53. C) Only the root
54. D) Zero or more segments (catch-all) (*)
55. Explanation: [...path] is a catch-all that matches one or more segments: /docs/a/b/c gives $page.params.path === "a/b/c".
56. Q9: What's [[slug]] in a route folder?
57. A) An optional param — the route matches with or without the segment (*)
58. B) A required param
59. C) A catch-all
60. D) A route group
61. Explanation: [[slug]] is optional: /blog and /blog/hello both match, with $page.params.slug undefined in the first case.
62. Q10: Where do load functions go?
63. A) Inside +page.svelte's <script>
64. B) +page.ts (or +page.js) (*)
65. C) svelte.config.js
66. D) +layout.svelte only
67. Explanation: Load functions (page data) go in +page.ts; the .svelte file consumes `data` from props.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where do SvelteKit routes live?
  options:
    - src/routes/
    - src/pages/
    - src/app/
    - src/views/
  correctIndex: 0
  explanation: SvelteKit uses file-based routing under src/routes/; each folder is a segment, +page.svelte renders the page.
- id: q2
  question: What file renders a route's UI?
  options:
    - route.svelte
    - +page.svelte
    - page.ts
    - index.svelte
  correctIndex: 1
  explanation: +page.svelte is the UI component for a route; +page.ts (or .js) holds load functions and metadata.
- id: q3
  question: How do you define a dynamic segment?
  options:
    - /:slug
    - "{slug} folder"
    - "[slug] folder"
    - "* slug"
  correctIndex: 2
  explanation: 'Name the folder with brackets: src/routes/blog/[slug]/+page.svelte matches /blog/hello-world with $page.params.slug === "hello-world".'
- id: q4
  question: What does +layout.svelte wrap?
  options:
    - Only the index page
    - Only the parent route
    - The server only
    - All pages in the same folder and below
  correctIndex: 3
  explanation: "Layouts cascade: a +layout.svelte wraps every +page.svelte in its folder and any descendant folder."
- id: q5
  question: What must +layout.svelte render?
  options:
    - "{@render children?.()} (snippet)"
    - <slot />
    - <Outlet />
    - Nothing
  correctIndex: 0
  explanation: In Svelte 5, layouts receive a `children` snippet; render it with `{@render children?.()}` or child pages won't appear.
- id: q6
  question: What's a route group?
  options:
    - A route with a shared URL prefix
    - A folder named (group) that provides layout scope without affecting the URL
    - A group of components
    - A middleware
  correctIndex: 1
  explanation: (group) folders don't appear in the URL — useful for sharing a layout across routes (e.g., (marketing) for landing pages).
- id: q7
  question: How do you read the current URL in SvelteKit?
  options:
    - window.location.href
    - document.URL
    - import { page } from "$app/stores"; $page.url.pathname
    - useLocation()
  correctIndex: 2
  explanation: '`import { page } from "$app/stores"` gives a reactive store of the current route: $page.url, $page.params, $page.route.'
- id: q8
  question: What does [...path] match?
  options:
    - A single segment
    - An optional segment
    - Only the root
    - Zero or more segments (catch-all)
  correctIndex: 3
  explanation: '[...path] is a catch-all that matches one or more segments: /docs/a/b/c gives $page.params.path === "a/b/c".'
- id: q9
  question: What's [[slug]] in a route folder?
  options:
    - An optional param — the route matches with or without the segment
    - A required param
    - A catch-all
    - A route group
  correctIndex: 0
  explanation: "[[slug]] is optional: /blog and /blog/hello both match, with $page.params.slug undefined in the first case."
- id: q10
  question: Where do load functions go?
  options:
    - Inside +page.svelte's <script>
    - +page.ts (or +page.js)
    - svelte.config.js
    - +layout.svelte only
  correctIndex: 1
  explanation: Load functions (page data) go in +page.ts; the .svelte file consumes `data` from props.
```

