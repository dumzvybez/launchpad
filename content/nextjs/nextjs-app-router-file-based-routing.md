---
slug: nextjs-app-router-file-based-routing
id: nextjs-02
track: nextjs
order: 2
title: The App Router and File-Based Routing
description: Master the App Router's file-based conventions — pages, layouts, dynamic routes, route groups, and private folders — and how URLs map to files.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=30s
whyItMatters: Master the App Router's file-based conventions — pages, layouts, dynamic routes, route groups, and private folders — and how URLs map to files.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# The App Router and File-Based Routing

## The App Router and File-Based Routing

### Why It Matters

Master the App Router's file-based conventions — pages, layouts, dynamic routes, route groups, and private folders — and how URLs map to files.

Master the App Router's file-based conventions — pages, layouts, dynamic routes, route groups, and private folders — and how URLs map to files.

### Prerequisites

- Stage 1: Getting Started with Next.js.
- Basic React component knowledge (JSX, props).
- Understanding of URL paths and HTTP routing basics.

### Topics

- File-system routing rules in app/
- page.tsx, layout.tsx, template.tsx, and not-found.tsx conventions
- Route segments and nested URLs
- Dynamic segments: [param] and [...slug] catch-alls
- Route groups with (folder) — grouping without URL impact
- Private folders with _folder — excluded from routing
- Colocating non-route files (components, utils, types)
- Parallel routes and intercepting routes (intro)

### Key Concepts

- Each folder in app/ is a URL segment; each page.tsx makes that segment navigable
- A folder with no page.tsx is routeable but renders nothing — it is just a layout container
- Route groups (parentheses) organize files without affecting the URL
- Private folders (underscore) are excluded from routing entirely
- Dynamic params arrive as props to your page: `{ params: { slug: string } }`

```text
app/
  page.tsx              -> /
  about/page.tsx        -> /about
  blog/page.tsx         -> /blog
  blog/post/page.tsx    -> /blog/post
```
Caption: Basic nested routes

### Common Pitfalls

- Creating `app/about.tsx` instead of `app/about/page.tsx` — top-level files in app/ that are not special filenames are ignored for routing; you must use a folder with page.tsx.
- Forgetting that `app/[slug]/page.tsx` and `app/[id]/page.tsx` collide — Next.js does not allow two dynamic segments with the same shape at the same level; pick one name or differentiate via route groups.
- Using a private folder `_components` for code you DO want routed — files in `_`-prefixed folders are excluded from routing; use them only for colocated non-route files.
- Assuming route groups `(group)` show up in the URL — they do not; `(marketing)/about/page.tsx` serves `/about`, not `/(marketing)/about`.
- Mixing `pages/` and `app/` routers in the same project without intention — they can coexist for migration, but new projects should use app/ only to avoid dual-routing confusion.

### Real-World Applications

- Vercel's marketing site uses route groups like (marketing) and (product) to give each section its own layout without polluting URLs.
- Notion's help center uses `[...slug]` catch-alls to render thousands of doc pages from a single page.tsx template.
- Linear's marketing site uses parallel routes (`@modal`) to intercept sign-up flows and render them in a modal without losing context.
- Hulu's show pages use dynamic `[showId]` segments to generate millions of SEO-friendly URLs at the edge.

### Interview Questions

- 1. What is the difference between `[slug]` and `[...slug]`? — `[slug]` matches one segment; `[...slug]` is a catch-all matching many segments as an array.
- 2. What is the difference between `[...slug]` and `[[...slug]]`? — The double-bracketed version is optional and matches the parent path too (zero or more segments), while single-bracket requires at least one.
- 3. What is a route group and when would you use it? — A folder wrapped in parentheses groups files for layout/organization without affecting the URL; useful when two unrelated pages share a layout.
- 4. What is a private folder in app/? — A folder prefixed with `_` that is excluded from routing; used for colocating utilities and components next to their consumers.
- 5. Can the App Router and Pages Router coexist? — Yes, during migration; `pages/` routes take precedence and `app/` should be introduced incrementally, but new projects should use app/ only.

### Mini Project

Build a multi-section docs site: A small documentation site with a marketing home page, a `/docs` section with nested routes, and a dynamic `[...slug]` page that renders docs by path. Take doc slugs from the URL, render markdown-ish content, and use route groups to separate marketing from docs layouts. Suggested approach:
  - Create `app/(marketing)/page.tsx` and `app/(marketing)/layout.tsx` with a navbar
  - Create `app/(docs)/docs/[...slug]/page.tsx` reading `params.slugs`
  - Define a flat list of `{ slug, title, body }` records and look up by joined slug
  - Add a `not-found.tsx` for missing docs
  - Use a separate `(docs)/layout.tsx` with a sidebar listing all doc slugs

### Exercises

1. Create routes `/`, `/about`, and `/contact` using nested folders with `page.tsx` files; verify each renders.
2. Add a dynamic route `/blog/[slug]` and visit `/blog/hello` and `/blog/world` to confirm params arrive correctly.
3. Convert `/blog/[slug]` to `/blog/[...slugs]` and visit `/blog/2024/01/news` — log the `params.slugs` array.
4. Create two route groups `(marketing)` and `(app)` each with their own `layout.tsx` and confirm the URL paths do not include the group name.
5. Add a `_components` private folder inside `app/` and verify it is NOT served as a route.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which file makes a route segment renderable in the App Router?
9. A) index.tsx
10. B) page.tsx (*)
11. C) route.tsx
12. D) view.tsx
13. Explanation: A folder in app/ becomes a route only when it contains a `page.tsx` file; folders without page.tsx are layout/group containers and do not render on their own.
14. Q2: What does `app/blog/[slug]/page.tsx` match?
15. A) Only /blog
16. B) /blog and /blog/anything
17. C) /blog/anything (a single segment) (*)
18. D) /blog/anything/more/segments
19. Explanation: `[slug]` matches exactly one URL segment; to match multiple nested segments you need the catch-all `[...slug]` or optional catch-all `[[...slug]]`.
20. Q3: What is the difference between `[...slug]` and `[[...slug]]`?
21. A) No difference, both are catch-alls
22. B) `[...slug]` only matches one segment
23. C) `[[...slug]]` only works in the Pages Router
24. D) `[[...slug]]` is optional and matches the parent path too (*)
25. Explanation: Double-bracketed `[[...slug]]` is an optional catch-all — it matches the parent path with zero segments as well as deeper paths; `[...slug]` requires at least one segment.
26. Q4: What is the purpose of a route group like `(marketing)`?
27. A) It groups routes for layout without changing the URL (*)
28. B) It adds `/marketing` to the URL
29. C) It protects routes with authentication
30. D) It speeds up the build
31. Explanation: Parenthesized folders are route groups: they organize files and allow shared layouts without affecting the URL structure.
32. Q5: What does a folder named `_components` inside app/ do?
33. A) It is served at /_components
34. B) It is a private folder excluded from routing (*)
35. C) It is treated as a route group
36. D) It generates a 404 for any path under it
37. Explanation: Folders prefixed with an underscore are private — excluded from routing — and are intended for colocating non-route files like components and utilities.
38. Q6: Which file is REQUIRED inside app/ for the app to build?
39. A) page.tsx
40. B) error.tsx
41. C) layout.tsx (*)
42. D) not-found.tsx
43. Explanation: `app/layout.tsx` is required at the root because it provides the `<html>` and `<body>` shell that every route renders into.
44. Q7: How do you read a dynamic segment value in a page component?
45. A) Via `useParams()` hook in any component
46. B) Via `process.env.PARAMS`
47. C) Via `context.query`
48. D) Via the `params` prop on the page component (*)
49. Explanation: Page components receive a `params` prop containing key/value pairs for each dynamic segment in the route path.
50. Q8: Which two dynamic segment names would COLLIDE at the same path level?
51. A) [slug] and [id] (*)
52. B) [slug] and [...slug]
53. C) [slug] and [[...slug]]
54. D) [id] and [...id]
55. Explanation: `[slug]` and `[id]` both match a single segment at the same level, so Next.js cannot decide which one to use and fails the build; pick one or differentiate by route group.
56. Q9: What happens if you create `app/about.tsx` (file, not folder)?
57. A) It serves /about
58. B) It is ignored for routing purposes (*)
59. C) It crashes the build
60. D) It becomes a layout
61. Explanation: Only special filenames (page, layout, etc.) inside folders participate in routing; a top-level `about.tsx` file is treated as a colocated module and is not routed.
62. Q10: Which layout wraps BOTH `/` and `/about` if you have `app/layout.tsx` and `app/about/layout.tsx`?
63. A) Only app/layout.tsx
64. B) Only app/about/layout.tsx
65. C) Both, with app/about/layout.tsx nested inside app/layout.tsx (*)
66. D) Neither, layouts do not nest
67. Explanation: Layouts nest along the route path: the root layout wraps everything, and segment layouts wrap their subtree, so `/about` renders through both layouts.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which file makes a route segment renderable in the App Router?
  options:
    - index.tsx
    - page.tsx
    - route.tsx
    - view.tsx
  correctIndex: 1
  explanation: A folder in app/ becomes a route only when it contains a `page.tsx` file; folders without page.tsx are layout/group containers and do not render on their own.
- id: q2
  question: What does `app/blog/[slug]/page.tsx` match?
  options:
    - Only /blog
    - /blog and /blog/anything
    - /blog/anything (a single segment)
    - /blog/anything/more/segments
  correctIndex: 2
  explanation: "`[slug]` matches exactly one URL segment; to match multiple nested segments you need the catch-all `[...slug]` or optional catch-all `[[...slug]]`."
- id: q3
  question: What is the difference between `[...slug]` and `[[...slug]]`?
  options:
    - No difference, both are catch-alls
    - "`[...slug]` only matches one segment"
    - "`[[...slug]]` only works in the Pages Router"
    - "`[[...slug]]` is optional and matches the parent path too"
  correctIndex: 3
  explanation: Double-bracketed `[[...slug]]` is an optional catch-all — it matches the parent path with zero segments as well as deeper paths; `[...slug]` requires at least one segment.
- id: q4
  question: What is the purpose of a route group like `(marketing)`?
  options:
    - It groups routes for layout without changing the URL
    - It adds `/marketing` to the URL
    - It protects routes with authentication
    - It speeds up the build
  correctIndex: 0
  explanation: "Parenthesized folders are route groups: they organize files and allow shared layouts without affecting the URL structure."
- id: q5
  question: What does a folder named `_components` inside app/ do?
  options:
    - It is served at /_components
    - It is a private folder excluded from routing
    - It is treated as a route group
    - It generates a 404 for any path under it
  correctIndex: 1
  explanation: Folders prefixed with an underscore are private — excluded from routing — and are intended for colocating non-route files like components and utilities.
- id: q6
  question: Which file is REQUIRED inside app/ for the app to build?
  options:
    - page.tsx
    - error.tsx
    - layout.tsx
    - not-found.tsx
  correctIndex: 2
  explanation: "`app/layout.tsx` is required at the root because it provides the `<html>` and `<body>` shell that every route renders into."
- id: q7
  question: How do you read a dynamic segment value in a page component?
  options:
    - Via `useParams()` hook in any component
    - Via `process.env.PARAMS`
    - Via `context.query`
    - Via the `params` prop on the page component
  correctIndex: 3
  explanation: Page components receive a `params` prop containing key/value pairs for each dynamic segment in the route path.
- id: q8
  question: Which two dynamic segment names would COLLIDE at the same path level?
  options:
    - "[slug] and [id]"
    - "[slug] and [...slug]"
    - "[slug] and [[...slug]]"
    - "[id] and [...id]"
  correctIndex: 0
  explanation: "`[slug]` and `[id]` both match a single segment at the same level, so Next.js cannot decide which one to use and fails the build; pick one or differentiate by route group."
- id: q9
  question: What happens if you create `app/about.tsx` (file, not folder)?
  options:
    - It serves /about
    - It is ignored for routing purposes
    - It crashes the build
    - It becomes a layout
  correctIndex: 1
  explanation: Only special filenames (page, layout, etc.) inside folders participate in routing; a top-level `about.tsx` file is treated as a colocated module and is not routed.
- id: q10
  question: Which layout wraps BOTH `/` and `/about` if you have `app/layout.tsx` and `app/about/layout.tsx`?
  options:
    - Only app/layout.tsx
    - Only app/about/layout.tsx
    - Both, with app/about/layout.tsx nested inside app/layout.tsx
    - Neither, layouts do not nest
  correctIndex: 2
  explanation: "Layouts nest along the route path: the root layout wraps everything, and segment layouts wrap their subtree, so `/about` renders through both layouts."
```

