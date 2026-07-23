---
slug: nextjs-pages-layouts-templates
id: nextjs-03
track: nextjs
order: 3
title: Pages, Layouts, and Templates
description: Understand the differences between pages, layouts, and templates, when each one renders, and how to compose them for persistent vs re-mounting UI.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=60s
whyItMatters: Understand the differences between pages, layouts, and templates, when each one renders, and how to compose them for persistent vs re-mounting UI.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Pages, Layouts, and Templates

## Pages, Layouts, and Templates

### Why It Matters

Understand the differences between pages, layouts, and templates, when each one renders, and how to compose them for persistent vs re-mounting UI.

Understand the differences between pages, layouts, and templates, when each one renders, and how to compose them for persistent vs re-mounting UI.

### Prerequisites

- Stage 2: The App Router and File-Based Routing.
- React composition patterns (children prop, context).
- Familiarity with SSR vs CSR at a high level.

### Topics

- page.tsx: the leaf of each route
- layout.tsx: persistent shell across navigations
- template.tsx: re-mounting shell per navigation
- Nesting layouts along the route tree
- The root layout requirements (`<html>`, `<body>`)
- Passing data from layout to children (and why you usually cannot)
- Server vs client components in layouts
- Colocating components alongside layouts

### Key Concepts

- Pages are the leaf — they render the unique UI for a URL
- Layouts wrap children and PERSIST across navigations between sibling routes (state preserved)
- Templates also wrap children but REMOUNT on every navigation (state reset)
- The root layout must render `<html>` and `<body>`; no other component can
- Layouts cannot receive searchParams or dynamic params the same way pages do (in 14+), because they apply to multiple URLs

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Acme", template: "%s | Acme" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```
Caption: Root layout

### Common Pitfalls

- Trying to read `searchParams` in a layout — layouts apply to multiple URLs so they cannot reliably receive searchParams; move that logic to a page or client component reading `useSearchParams()`.
- Forgetting that the root layout must include `<html>` and `<body>` — omitting them breaks hydration because Next.js renders the entire document.
- Using `template.tsx` when you wanted persistent state — templates re-mount on every navigation, so state resets; use layout.tsx for state that must persist across sibling routes.
- Putting 'use client' on the root layout — the root layout must remain a server component because it renders `<html>`/`<body>` and exports `metadata`; client concerns go in child client components.
- Importing server-only code (database clients) into a client-rendered layout — this leaks server secrets to the browser and breaks the build.

### Real-World Applications

- Vercel's dashboard uses a nested dashboard layout with a sidebar that persists across project/route navigations, preserving panel state.
- Notion's editor shell is a layout that persists while page content swaps — keeping the sidebar and header mounted avoids re-fetching user data.
- Linear's app uses templates for issue views that need a fresh state per navigation, while keeping the global sidebar in a persistent layout.
- Twitch's creator dashboard uses nested layouts to keep chat and stream panels mounted while swapping content panels.

### Interview Questions

- 1. What is the difference between a layout and a template? — Layouts persist (and preserve state) across navigations between sibling routes; templates re-mount on every navigation, resetting state.
- 2. Can a layout receive `searchParams`? — No; layouts apply to multiple URLs and Next.js does not provide searchParams to them; use `useSearchParams()` in a client component or read it in a page.
- 3. Why must the root layout be a server component? — It renders the `<html>` and `<body>` tags and exports `metadata`, both of which require server rendering; client components cannot do either.
- 4. When would you choose `template.tsx` over `layout.tsx`? — When you want fresh state on every navigation — e.g. resetting a form, animating entrance, or running a mount effect per route.
- 5. Do layouts nest? — Yes, along the route tree; the root layout wraps every segment layout which wraps the page, allowing composition.

### Mini Project

Build a dashboard shell: A two-section app where `/` is a marketing page and `/dashboard/*` is an authenticated dashboard with a persistent sidebar in `dashboard/layout.tsx` and a per-route `dashboard/template.tsx` that animates content in on each navigation. Suggested approach:
  - Create `app/layout.tsx` with `<html>`, `<body>`, and a global navbar
  - Create `app/dashboard/layout.tsx` rendering a `<Sidebar />` + `{children}`
  - Create `app/dashboard/template.tsx` as a client component with a fade-in animation
  - Add `app/dashboard/page.tsx`, `app/dashboard/analytics/page.tsx`, and `app/dashboard/settings/page.tsx`
  - Navigate between dashboard routes and observe that the sidebar stays mounted but the template re-mounts

### Exercises

1. Create a root `layout.tsx` with `<html>` and `<body>` and verify the build still succeeds.
2. Add a nested `dashboard/layout.tsx` with a sidebar; navigate between `/dashboard`, `/dashboard/analytics`, and confirm the sidebar does NOT re-render.
3. Add a `dashboard/template.tsx` with a `useState` counter; navigate between dashboard routes and confirm the counter resets.
4. Move `metadata` from the root layout into a `dashboard/page.tsx` and observe the title update per route.
5. Add a client component `ThemeToggle` to the root layout and confirm it can be interactive without making the layout itself a client component.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which layout file is REQUIRED at the root of app/?
9. A) app/page.tsx
10. B) app/template.tsx
11. C) app/layout.tsx (*)
12. D) app/root.tsx
13. Explanation: `app/layout.tsx` is required and must render `<html>` and `<body>`; it wraps every route in the application.
14. Q2: What is the key difference between layout.tsx and template.tsx?
15. A) Templates cannot be client components
16. B) Layouts only work server-side, templates only client-side
17. C) Templates wrap layouts, not pages
18. D) Layouts persist across navigations, templates re-mount on each navigation (*)
19. Explanation: Layouts preserve their React state across sibling-route navigations; templates re-mount on every navigation, resetting state and re-running effects.
20. Q3: Which tags MUST the root layout render?
21. A) <html> and <body> (*)
22. B) <head> and <body>
23. C) <main> and <footer>
24. D) <Document> and <Page>
25. Explanation: The root layout is responsible for the document shell — it must render `<html>` and `<body>` because Next.js renders the entire document.
26. Q4: Can a layout receive `searchParams` as a prop?
27. A) Yes, always
28. B) No, because layouts apply to multiple URLs (*)
29. C) Only client layouts
30. D) Only in the Pages Router
31. Explanation: Layouts wrap multiple URLs so searchParams are not provided to them; use `useSearchParams()` in a client component or read them in a page instead.
32. Q5: Why must the root layout be a Server Component?
33. A) Client components are slower
34. B) Vercel only deploys server components
35. C) It renders <html>/<body> and exports metadata, which require server rendering (*)
36. D) Client components cannot have children
37. Explanation: The root layout renders the document shell and exports the static `metadata` object — both require server rendering, so 'use client' is not allowed there.
38. Q6: When would you choose template.tsx over layout.tsx?
39. A) When you want state to persist across navigations
40. B) When you need to read cookies
41. C) When you need to render <html>
42. D) When you want state to reset and effects to re-run on every navigation (*)
43. Explanation: Templates re-mount per navigation, so they are useful for animations, resetting form state, or running mount effects fresh on each route.
44. Q7: Do layouts nest along the route tree?
45. A) Yes, segment layouts nest inside parent layouts down to the page (*)
46. B) No, only the root layout is used
47. C) Yes, but only one level deep
48. D) Only when explicitly imported
49. Explanation: Layouts compose: the root layout wraps each segment layout, which wraps deeper segment layouts, which finally wrap the page.
50. Q8: Which is true about importing server-only code (e.g. Prisma) into a layout?
51. A) It is always safe
52. B) It is safe only if the layout remains a server component (no 'use client') (*)
53. C) It is safe in any layout that imports 'use server'
54. D) It is never safe
55. Explanation: Server-only modules can be imported into server layouts; if you mark the layout 'use client' the bundler tries to ship the import to the browser, leaking secrets and breaking the build.
56. Q9: What happens if you put 'use client' at the top of the root layout?
57. A) It works fine
58. B) Only the home page becomes client-rendered
59. C) The build fails because the root layout must render <html>/<body> and export metadata (*)
60. D) Vercel refuses to deploy
61. Explanation: The root layout must remain a server component to render the document shell and static metadata, so 'use client' there breaks the build.
62. Q10: Which file would you create to animate page transitions on each navigation?
63. A) layout.tsx
64. B) page.tsx
65. C) transition.tsx
66. D) template.tsx (*)
67. Explanation: Templates re-mount on each navigation, so they are the right place for entrance animations that should run fresh per route.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which layout file is REQUIRED at the root of app/?
  options:
    - app/page.tsx
    - app/template.tsx
    - app/layout.tsx
    - app/root.tsx
  correctIndex: 2
  explanation: "`app/layout.tsx` is required and must render `<html>` and `<body>`; it wraps every route in the application."
- id: q2
  question: What is the key difference between layout.tsx and template.tsx?
  options:
    - Templates cannot be client components
    - Layouts only work server-side, templates only client-side
    - Templates wrap layouts, not pages
    - Layouts persist across navigations, templates re-mount on each navigation
  correctIndex: 3
  explanation: Layouts preserve their React state across sibling-route navigations; templates re-mount on every navigation, resetting state and re-running effects.
- id: q3
  question: Which tags MUST the root layout render?
  options:
    - <html> and <body>
    - <head> and <body>
    - <main> and <footer>
    - <Document> and <Page>
  correctIndex: 0
  explanation: The root layout is responsible for the document shell — it must render `<html>` and `<body>` because Next.js renders the entire document.
- id: q4
  question: Can a layout receive `searchParams` as a prop?
  options:
    - Yes, always
    - No, because layouts apply to multiple URLs
    - Only client layouts
    - Only in the Pages Router
  correctIndex: 1
  explanation: Layouts wrap multiple URLs so searchParams are not provided to them; use `useSearchParams()` in a client component or read them in a page instead.
- id: q5
  question: Why must the root layout be a Server Component?
  options:
    - Client components are slower
    - Vercel only deploys server components
    - It renders <html>/<body> and exports metadata, which require server rendering
    - Client components cannot have children
  correctIndex: 2
  explanation: The root layout renders the document shell and exports the static `metadata` object — both require server rendering, so 'use client' is not allowed there.
- id: q6
  question: When would you choose template.tsx over layout.tsx?
  options:
    - When you want state to persist across navigations
    - When you need to read cookies
    - When you need to render <html>
    - When you want state to reset and effects to re-run on every navigation
  correctIndex: 3
  explanation: Templates re-mount per navigation, so they are useful for animations, resetting form state, or running mount effects fresh on each route.
- id: q7
  question: Do layouts nest along the route tree?
  options:
    - Yes, segment layouts nest inside parent layouts down to the page
    - No, only the root layout is used
    - Yes, but only one level deep
    - Only when explicitly imported
  correctIndex: 0
  explanation: "Layouts compose: the root layout wraps each segment layout, which wraps deeper segment layouts, which finally wrap the page."
- id: q8
  question: Which is true about importing server-only code (e.g. Prisma) into a layout?
  options:
    - It is always safe
    - It is safe only if the layout remains a server component (no 'use client')
    - It is safe in any layout that imports 'use server'
    - It is never safe
  correctIndex: 1
  explanation: Server-only modules can be imported into server layouts; if you mark the layout 'use client' the bundler tries to ship the import to the browser, leaking secrets and breaking the build.
- id: q9
  question: What happens if you put 'use client' at the top of the root layout?
  options:
    - It works fine
    - Only the home page becomes client-rendered
    - The build fails because the root layout must render <html>/<body> and export metadata
    - Vercel refuses to deploy
  correctIndex: 2
  explanation: The root layout must remain a server component to render the document shell and static metadata, so 'use client' there breaks the build.
- id: q10
  question: Which file would you create to animate page transitions on each navigation?
  options:
    - layout.tsx
    - page.tsx
    - transition.tsx
    - template.tsx
  correctIndex: 3
  explanation: Templates re-mount on each navigation, so they are the right place for entrance animations that should run fresh per route.
```

