---
slug: nextjs-metadata-seo-open-graph
id: nextjs-10
track: nextjs
order: 10
title: Metadata, SEO, and Open Graph
description: Configure per-route `<head>` content with the Metadata API — titles, descriptions, Open Graph, Twitter cards, canonical URLs, robots, sitemaps, and `robots.txt`.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=270s
whyItMatters: Configure per-route `<head>` content with the Metadata API — titles, descriptions, Open Graph, Twitter cards, canonical URLs, robots, sitemaps, and `robots. txt`.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Metadata, SEO, and Open Graph

## Metadata, SEO, and Open Graph

### Why It Matters

Configure per-route `<head>` content with the Metadata API — titles, descriptions, Open Graph, Twitter cards, canonical URLs, robots, sitemaps, and `robots. txt`.

Configure per-route `<head>` content with the Metadata API — titles, descriptions, Open Graph, Twitter cards, canonical URLs, robots, sitemaps, and `robots.txt`.

### Prerequisites

- Stage 7: Dynamic Routes and generateStaticParams.
- Basic SEO concepts (title, description, OG tags, sitemaps).
- Familiarity with `<head>` and meta tags.

### Topics

- Static `metadata` export
- Dynamic `generateMetadata` for per-route tags
- Title templates (`%s | Brand`)
- Open Graph and Twitter card images
- Canonical URLs and `alternates`
- `robots.txt` via `app/robots.ts`
- Sitemaps via `app/sitemap.ts`
- `manifest.ts` for PWA manifests
- JSON-LD structured data in server components

### Key Concepts

- The Metadata API replaces manual `<head>` tags; exporting `metadata` or `generateMetadata` from a layout/page populates the head
- Title templates let child routes fill in a parent template (`%s | Brand`)
- `app/robots.ts` generates `/robots.txt` from a function
- `app/sitemap.ts` generates `/sitemap.xml` from a function
- Metadata is deduplicated and merged up the layout tree, with the deepest page winning

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Acme", template: "%s | Acme" },
  description: "Acme builds things.",
  metadataBase: new URL("https://acme.com"),
  openGraph: {
    type: "website",
    url: "https://acme.com",
    siteName: "Acme",
  },
};
```
Caption: Static metadata

### Common Pitfalls

- Forgetting `metadataBase` — relative OG image URLs resolve incorrectly without a base; set `metadataBase` in the root layout.
- Setting both `metadata` and `generateMetadata` in the same file — only `generateMetadata` is used; pick one.
- Using a non-absolute URL for canonical without `metadataBase` — Next.js warns and the canonical may not resolve; provide absolute URLs.
- Putting OG image files in `public/` but referencing them with `/og.png` only — relative URLs need `metadataBase` to become absolute for crawlers.
- Returning metadata with a Date object for `lastModified` — sitemap accepts Date but the head tags serialize strings; convert with `toISOString()` for clarity.

### Real-World Applications

- Vercel's marketing site uses the Metadata API to produce consistent OG images and Twitter cards across hundreds of pages.
- Notion's public docs use `generateMetadata` to produce per-doc OG images with the doc title rendered into a preview.
- Hulu uses `app/sitemap.ts` to generate a sitemap with thousands of show URLs updated nightly via ISR.
- TikTok's creator pages generate dynamic OG images with the creator's avatar and follower count to maximize share CTR.

### Interview Questions

- 1. How do you set per-page metadata? — Export a static `metadata` object or an async `generateMetadata` function from the page or layout.
- 2. What is the title template for? — Lets child routes fill in a parent template like `%s | Brand`, ensuring consistent branding across pages.
- 3. How do you generate a sitemap? — Create `app/sitemap.ts` exporting a function that returns a `MetadataRoute.Sitemap` array of URLs with optional metadata.
- 4. What is `metadataBase` for? — Resolves relative URLs (like OG images) to absolute URLs so crawlers can fetch them.
- 5. How do metadata fields merge across layouts? — They merge down the tree, with deeper segments overriding shallower ones for the same field.

### Mini Project

Build an SEO-optimized blog: A blog with a root `metadata` (title template, OG defaults), per-post `generateMetadata` (title, description, canonical, OG image), a `sitemap.ts` listing all posts, and a `robots.ts` blocking `/admin`. Suggested approach:
  - Set `metadataBase` in the root layout
  - Add `generateMetadata` to `app/blog/[slug]/page.tsx`
  - Create `app/sitemap.ts` returning all posts with `lastModified`
  - Create `app/robots.ts` allowing everything except `/admin` and `/api`
  - Verify `/sitemap.xml` and `/robots.txt` render correctly in the browser

### Exercises

1. Add a static `metadata` export to your root layout with a title and description.
2. Add a title template `%s | Acme` and verify child pages append the brand.
3. Add `generateMetadata` to a dynamic route and verify the OG image changes per slug.
4. Create `app/robots.ts` disallowing `/admin` and verify `/robots.txt`.
5. Create `app/sitemap.ts` listing 5 URLs and verify `/sitemap.xml` is valid XML.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you set per-page metadata in the App Router?
9. A) Edit index.html
10. B) Export `metadata` or `generateMetadata` from the page/layout (*)
11. C) Use a <Head> component
12. D) Use a hook
13. Explanation: The Metadata API replaces manual head tags; exporting a static `metadata` object or an async `generateMetadata` function populates the head automatically.
14. Q2: What is the title `template` field for?
15. A) Setting a default title for the whole app
16. B) Generating titles from a database
17. C) Letting child routes fill a parent template like "%s | Brand" (*)
18. D) Localizing titles
19. Explanation: `title.template` lets child pages set just their name (`title: "About"`) and Next.js formats it as `About | Brand` using the parent's template.
20. Q3: Which file generates `/robots.txt`?
21. A) public/robots.txt only
22. B) app/api/robots/route.ts
23. C) next.config.mjs
24. D) app/robots.ts (*)
25. Explanation: `app/robots.ts` exports a function returning a `MetadataRoute.Robots` object; Next.js serves it at `/robots.txt` automatically.
26. Q4: Which file generates `/sitemap.xml`?
27. A) app/sitemap.ts (*)
28. B) public/sitemap.xml only
29. C) app/api/sitemap/route.ts
30. D) next.config.mjs
31. Explanation: `app/sitemap.ts` exports a function returning a `MetadataRoute.Sitemap` array; Next.js serves it at `/sitemap.xml` automatically.
32. Q5: What does `metadataBase` do?
33. A) Sets the base font family
34. B) Resolves relative URLs (like OG images) to absolute URLs (*)
35. C) Sets the deployment URL
36. D) Disables metadata
37. Explanation: `metadataBase` is a URL that Next.js uses to resolve relative metadata URLs (especially OG images) to absolute URLs so crawlers can fetch them.
38. Q6: What happens if you export both `metadata` and `generateMetadata` in the same file?
39. A) Both run and merge
40. B) The build fails
41. C) Only `generateMetadata` is used (*)
42. D) Only `metadata` is used
43. Explanation: `generateMetadata` takes precedence when both are exported; you should pick one per file (static for static routes, async for dynamic routes).
44. Q7: How do metadata fields merge across layouts and pages?
45. A) They don't — each level overrides everything
46. B) Only the root layout's metadata is used
47. C) Only the page's metadata is used
48. D) Deeper segments override shallower ones for the same field; others merge (*)
49. Explanation: Next.js merges metadata down the route tree; for overlapping fields the deepest segment wins, but non-overlapping fields combine.
50. Q8: Which OG tag is required for rich social media previews?
51. A) og:title, og:description, and og:image at minimum (*)
52. B) og:site_name only
53. C) og:locale only
54. D) og:type only
55. Explanation: For rich previews on Twitter/Facebook you need at least `og:title`, `og:description`, and `og:image`; the Metadata API sets these via `openGraph: { title, description, images }`.
56. Q9: What is the type returned by `app/sitemap.ts`?
57. A) string
58. B) MetadataRoute.Sitemap (array of objects) (*)
59. C) XML string
60. D) Buffer
61. Explanation: `app/sitemap.ts` returns a `MetadataRoute.Sitemap` array of `{ url, lastModified?, changeFrequency?, priority? }` objects; Next.js serializes them to XML.
62. Q10: Which is true about JSON-LD structured data?
63. A) It must be set via the metadata API
64. B) It only works in client components
65. C) You render a <script type="application/ld+json"> in a server component (*)
66. D) It is replaced by the robots API
67. Explanation: JSON-LD is rendered by emitting a `<script type="application/ld+json">` tag inside a server component's JSX; Next.js does not have a dedicated API for it.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you set per-page metadata in the App Router?
  options:
    - Edit index.html
    - Export `metadata` or `generateMetadata` from the page/layout
    - Use a <Head> component
    - Use a hook
  correctIndex: 1
  explanation: The Metadata API replaces manual head tags; exporting a static `metadata` object or an async `generateMetadata` function populates the head automatically.
- id: q2
  question: What is the title `template` field for?
  options:
    - Setting a default title for the whole app
    - Generating titles from a database
    - Letting child routes fill a parent template like "%s | Brand"
    - Localizing titles
  correctIndex: 2
  explanation: "`title.template` lets child pages set just their name (`title: \"About\"`) and Next.js formats it as `About | Brand` using the parent's template."
- id: q3
  question: Which file generates `/robots.txt`?
  options:
    - public/robots.txt only
    - app/api/robots/route.ts
    - next.config.mjs
    - app/robots.ts
  correctIndex: 3
  explanation: "`app/robots.ts` exports a function returning a `MetadataRoute.Robots` object; Next.js serves it at `/robots.txt` automatically."
- id: q4
  question: Which file generates `/sitemap.xml`?
  options:
    - app/sitemap.ts
    - public/sitemap.xml only
    - app/api/sitemap/route.ts
    - next.config.mjs
  correctIndex: 0
  explanation: "`app/sitemap.ts` exports a function returning a `MetadataRoute.Sitemap` array; Next.js serves it at `/sitemap.xml` automatically."
- id: q5
  question: What does `metadataBase` do?
  options:
    - Sets the base font family
    - Resolves relative URLs (like OG images) to absolute URLs
    - Sets the deployment URL
    - Disables metadata
  correctIndex: 1
  explanation: "`metadataBase` is a URL that Next.js uses to resolve relative metadata URLs (especially OG images) to absolute URLs so crawlers can fetch them."
- id: q6
  question: What happens if you export both `metadata` and `generateMetadata` in the same file?
  options:
    - Both run and merge
    - The build fails
    - Only `generateMetadata` is used
    - Only `metadata` is used
  correctIndex: 2
  explanation: "`generateMetadata` takes precedence when both are exported; you should pick one per file (static for static routes, async for dynamic routes)."
- id: q7
  question: How do metadata fields merge across layouts and pages?
  options:
    - They don't — each level overrides everything
    - Only the root layout's metadata is used
    - Only the page's metadata is used
    - Deeper segments override shallower ones for the same field; others merge
  correctIndex: 3
  explanation: Next.js merges metadata down the route tree; for overlapping fields the deepest segment wins, but non-overlapping fields combine.
- id: q8
  question: Which OG tag is required for rich social media previews?
  options:
    - og:title, og:description, and og:image at minimum
    - og:site_name only
    - og:locale only
    - og:type only
  correctIndex: 0
  explanation: "For rich previews on Twitter/Facebook you need at least `og:title`, `og:description`, and `og:image`; the Metadata API sets these via `openGraph: { title, description, images }`."
- id: q9
  question: What is the type returned by `app/sitemap.ts`?
  options:
    - string
    - MetadataRoute.Sitemap (array of objects)
    - XML string
    - Buffer
  correctIndex: 1
  explanation: "`app/sitemap.ts` returns a `MetadataRoute.Sitemap` array of `{ url, lastModified?, changeFrequency?, priority? }` objects; Next.js serializes them to XML."
- id: q10
  question: Which is true about JSON-LD structured data?
  options:
    - It must be set via the metadata API
    - It only works in client components
    - You render a <script type="application/ld+json"> in a server component
    - It is replaced by the robots API
  correctIndex: 2
  explanation: JSON-LD is rendered by emitting a `<script type="application/ld+json">` tag inside a server component's JSX; Next.js does not have a dedicated API for it.
```

