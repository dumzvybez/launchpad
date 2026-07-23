---
slug: nextjs-css-tailwind-css-js-next-js
id: nextjs-12
track: nextjs
order: 12
title: CSS, Tailwind, and CSS-in-JS in Next.js
description: Style your App Router app with global CSS, CSS Modules, Tailwind CSS, and CSS-in-JS — including the rules for using styled-components and emotion in server components.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=60s
whyItMatters: Style your App Router app with global CSS, CSS Modules, Tailwind CSS, and CSS-in-JS — including the rules for using styled-components and emotion in server components.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# CSS, Tailwind, and CSS-in-JS in Next.js

## CSS, Tailwind, and CSS-in-JS in Next.js

### Why It Matters

Style your App Router app with global CSS, CSS Modules, Tailwind CSS, and CSS-in-JS — including the rules for using styled-components and emotion in server components.

Style your App Router app with global CSS, CSS Modules, Tailwind CSS, and CSS-in-JS — including the rules for using styled-components and emotion in server components.

### Prerequisites

- Stage 11: Image, Font, and Link Components.
- CSS fundamentals (selectors, specificity, the cascade).
- Tailwind utility-first basics (or willingness to learn).

### Topics

- Global CSS via `app/globals.css`
- CSS Modules (`*.module.css`) with scoped class names
- Tailwind CSS in the App Router (PostCSS config, content scanning)
- Tailwind config and theme extension
- CSS-in-JS libraries that support RSC (e.g. `styled-jsx`, Panda CSS)
- Why `styled-components` and `emotion` need `'use client'`
- Server Component styling constraints (no runtime CSS-in-JS)
- Using `tailwind.config.ts` to extend the theme

### Key Concepts

- Global CSS imports are allowed in any layout — Next.js bundles them
- CSS Modules scope class names locally (no need for BEM)
- Tailwind CSS is the recommended default; configure via `tailwind.config.ts` and `postcss.config.mjs`
- Most CSS-in-JS libraries (styled-components, emotion) require client components because they generate styles at runtime
- Newer zero-runtime CSS-in-JS (Panda CSS, vanilla-extract, Linaria) works in server components

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
```
Caption: Global CSS

### Common Pitfalls

- Trying to use styled-components or emotion in a server component — they need 'use client' because they generate styles at runtime; use a zero-runtime alternative like Panda CSS for server components.
- Forgetting to scan all source folders in `tailwind.config.ts` `content` — Tailwind purges unused classes; if your files are not in `content`, classes are stripped from the build.
- Using `@tailwind` directives in a non-global CSS file — they must be in a file imported by the root layout (typically `app/globals.css`); putting them in a CSS Module does not work.
- Importing global CSS inside a non-layout component — global CSS imports must be in `layout.tsx` (or `globals.css` imported there); importing in a page causes a build error in the App Router.
- Hardcoding the font-family in CSS instead of using `var(--font-inter)` from next/font — bypasses the optimized font and re-introduces FOUT.

### Real-World Applications

- Vercel's marketing site uses Tailwind with a custom design system extended via `tailwind.config.ts`.
- Notion uses CSS Modules in the App Router for scoped component styles, avoiding the runtime overhead of CSS-in-JS.
- Hulu uses Tailwind for the marketing surface and CSS Modules for the authenticated app's complex widget layouts.
- Linear uses a custom CSS-in-JS system adapted for RSC, with critical styles inlined at build time.

### Interview Questions

- 1. Where must global CSS be imported in the App Router? — In `layout.tsx` (or in `globals.css` which is imported by the root layout); importing global CSS in a non-layout component fails the build.
- 2. Why do styled-components and emotion require 'use client'? — They generate styles at runtime using React context, which is unavailable in server components.
- 3. What is the difference between CSS Modules and Tailwind? — CSS Modules scope class names locally to a component; Tailwind is a utility-first system that applies pre-defined utility classes directly in JSX.
- 4. What does the `content` array in `tailwind.config.ts` do? — Tells Tailwind which files to scan for class usage so it can purge unused classes from the production build.
- 5. Which CSS-in-JS libraries work in server components? — Zero-runtime libraries like Panda CSS, vanilla-extract, and Linaria that compile styles at build time.

### Mini Project

Build a styled design system: A small design system with Tailwind-extended brand colors, a `Button` CSS Module component, and a `Card` styled-jsx client component — all composed on a single page. Suggested approach:
  - Extend `tailwind.config.ts` with `colors.brand` and `fontFamily.sans`
  - Create `app/components/Button/Button.tsx` + `.module.css`
  - Create `app/components/Card.tsx` as a client component using styled-jsx
  - Compose both on `app/page.tsx` (a server component)
  - Verify the production build ships scoped styles with no FOUT

### Exercises

1. Add a custom brand color to `tailwind.config.ts` and use it in a `bg-brand` class.
2. Create a `Button` component using CSS Modules with hover and focus states.
3. Convert a styled-components component to 'use client' and verify it builds.
4. Add a styled-jsx block in a client component and inspect the rendered styles.
5. Audit a page for unused Tailwind classes by intentionally leaving one out of `content` and confirming it is purged.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where must global CSS be imported in the App Router?
9. A) In any component
10. B) In middleware.ts
11. C) In page.tsx
12. D) Only in layout.tsx (or globals.css imported there) (*)
13. Explanation: Global CSS imports must live in a layout file (typically `app/globals.css` imported by the root layout); importing global CSS in a non-layout component fails the build in the App Router.
14. Q2: Why do styled-components and emotion require 'use client'?
15. A) They generate styles at runtime using React context, unavailable in server components (*)
16. B) They are too slow for server components
17. C) They need a browser window
18. D) They are deprecated
19. Explanation: Runtime CSS-in-JS libraries use React context and dynamic style injection, neither of which works in server components; mark them 'use client' to use them.
20. Q3: What do CSS Modules provide?
21. A) Global styles
22. B) Locally scoped class names (*)
23. C) Inline styles
24. D) Tailwind utilities
25. Explanation: CSS Modules scope class names to the component that imports them, generating unique names like `Button_button__a1b2c` so styles never leak globally.
26. Q4: What does the `content` array in tailwind.config.ts do?
27. A) Lists CSS files to ignore
28. B) Sets the content of the page
29. C) Tells Tailwind which source files to scan for class usage so it can purge unused classes (*)
30. D) Lists the pages to render
31. Explanation: `content` lists source files Tailwind scans for class names; any class not found in those files is purged from the production CSS, so omitting folders silently strips their classes.
32. Q5: Which CSS-in-JS libraries work in server components?
33. A) styled-components
34. B) emotion
35. C) None
36. D) Zero-runtime libraries like Panda CSS and vanilla-extract (*)
37. Explanation: Zero-runtime CSS-in-JS (Panda CSS, vanilla-extract, Linaria) compiles styles at build time, so they work in server components without 'use client'.
38. Q6: Where must `@tailwind base/components/utilities` directives live?
39. A) In a CSS file imported by the root layout (typically globals.css) (*)
40. B) Anywhere
41. C) In a CSS Module
42. D) In next.config.mjs
43. Explanation: `@tailwind` directives must live in a global CSS file (typically `app/globals.css`) that is imported by the root layout; CSS Modules do not support them.
44. Q7: What happens if you import global CSS into a non-layout component?
45. A) It works fine
46. B) The build fails — global CSS must be imported in a layout (*)
47. C) It only loads on that page
48. D) It is silently ignored
49. Explanation: The App Router requires global CSS imports to live in layout files; importing them in a page or component throws a build error.
50. Q8: How do you reference a next/font family in CSS?
51. A) Use the font name directly
52. B) Re-import the font in CSS
53. C) Use the CSS variable set by next/font (e.g. var(--font-inter)) (*)
54. D) Use @font-face
55. Explanation: `next/font` exposes the font as a CSS variable (when you set `variable: '--font-inter'`); reference it in CSS as `font-family: var(--font-inter), system-ui, sans-serif`.
56. Q9: What is the difference between styled-jsx and CSS Modules?
57. A) styled-jsx is server-only; CSS Modules are client-only
58. B) They are identical
59. C) styled-jsx is for fonts only
60. D) styled-jsx writes CSS inside JSX (needs 'use client'); CSS Modules write CSS in separate files and work in server components (*)
61. Explanation: styled-jsx embeds CSS in JSX and needs 'use client'; CSS Modules use separate `.module.css` files with scoped class names and work in both server and client components.
62. Q10: Which file configures Tailwind's theme and content scanning?
63. A) tailwind.config.ts (*)
64. B) postcss.config.mjs
65. C) next.config.mjs
66. D) globals.css
67. Explanation: `tailwind.config.ts` (or .js) defines the theme extension, content scanning paths, plugins, and dark mode strategy. `postcss.config.mjs` just wires Tailwind into PostCSS.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where must global CSS be imported in the App Router?
  options:
    - In any component
    - In middleware.ts
    - In page.tsx
    - Only in layout.tsx (or globals.css imported there)
  correctIndex: 3
  explanation: Global CSS imports must live in a layout file (typically `app/globals.css` imported by the root layout); importing global CSS in a non-layout component fails the build in the App Router.
- id: q2
  question: Why do styled-components and emotion require 'use client'?
  options:
    - They generate styles at runtime using React context, unavailable in server components
    - They are too slow for server components
    - They need a browser window
    - They are deprecated
  correctIndex: 0
  explanation: Runtime CSS-in-JS libraries use React context and dynamic style injection, neither of which works in server components; mark them 'use client' to use them.
- id: q3
  question: What do CSS Modules provide?
  options:
    - Global styles
    - Locally scoped class names
    - Inline styles
    - Tailwind utilities
  correctIndex: 1
  explanation: CSS Modules scope class names to the component that imports them, generating unique names like `Button_button__a1b2c` so styles never leak globally.
- id: q4
  question: What does the `content` array in tailwind.config.ts do?
  options:
    - Lists CSS files to ignore
    - Sets the content of the page
    - Tells Tailwind which source files to scan for class usage so it can purge unused classes
    - Lists the pages to render
  correctIndex: 2
  explanation: "`content` lists source files Tailwind scans for class names; any class not found in those files is purged from the production CSS, so omitting folders silently strips their classes."
- id: q5
  question: Which CSS-in-JS libraries work in server components?
  options:
    - styled-components
    - emotion
    - None
    - Zero-runtime libraries like Panda CSS and vanilla-extract
  correctIndex: 3
  explanation: Zero-runtime CSS-in-JS (Panda CSS, vanilla-extract, Linaria) compiles styles at build time, so they work in server components without 'use client'.
- id: q6
  question: Where must `@tailwind base/components/utilities` directives live?
  options:
    - In a CSS file imported by the root layout (typically globals.css)
    - Anywhere
    - In a CSS Module
    - In next.config.mjs
  correctIndex: 0
  explanation: "`@tailwind` directives must live in a global CSS file (typically `app/globals.css`) that is imported by the root layout; CSS Modules do not support them."
- id: q7
  question: What happens if you import global CSS into a non-layout component?
  options:
    - It works fine
    - The build fails — global CSS must be imported in a layout
    - It only loads on that page
    - It is silently ignored
  correctIndex: 1
  explanation: The App Router requires global CSS imports to live in layout files; importing them in a page or component throws a build error.
- id: q8
  question: How do you reference a next/font family in CSS?
  options:
    - Use the font name directly
    - Re-import the font in CSS
    - Use the CSS variable set by next/font (e.g. var(--font-inter))
    - Use @font-face
  correctIndex: 2
  explanation: "`next/font` exposes the font as a CSS variable (when you set `variable: '--font-inter'`); reference it in CSS as `font-family: var(--font-inter), system-ui, sans-serif`."
- id: q9
  question: What is the difference between styled-jsx and CSS Modules?
  options:
    - styled-jsx is server-only; CSS Modules are client-only
    - They are identical
    - styled-jsx is for fonts only
    - styled-jsx writes CSS inside JSX (needs 'use client'); CSS Modules write CSS in separate files and work in server components
  correctIndex: 3
  explanation: styled-jsx embeds CSS in JSX and needs 'use client'; CSS Modules use separate `.module.css` files with scoped class names and work in both server and client components.
- id: q10
  question: Which file configures Tailwind's theme and content scanning?
  options:
    - tailwind.config.ts
    - postcss.config.mjs
    - next.config.mjs
    - globals.css
  correctIndex: 0
  explanation: "`tailwind.config.ts` (or .js) defines the theme extension, content scanning paths, plugins, and dark mode strategy. `postcss.config.mjs` just wires Tailwind into PostCSS."
```

