---
slug: nextjs-image-font-link-components
id: nextjs-11
track: nextjs
order: 11
title: Image, Font, and Link Components
description: Use `next/image`, `next/font`, and `next/link` to optimize images, eliminate font layout shifts, and enable client-side navigation with prefetching.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y
whyItMatters: Use `next/image`, `next/font`, and `next/link` to optimize images, eliminate font layout shifts, and enable client-side navigation with prefetching.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Image, Font, and Link Components

## Image, Font, and Link Components

### Why It Matters

Use `next/image`, `next/font`, and `next/link` to optimize images, eliminate font layout shifts, and enable client-side navigation with prefetching.

Use `next/image`, `next/font`, and `next/link` to optimize images, eliminate font layout shifts, and enable client-side navigation with prefetching.

### Prerequisites

- Stage 10: Metadata, SEO, and Open Graph.
- HTML `<img>` and `<a>` basics.
- Awareness of Core Web Vitals (LCP, CLS, FID/INP).

### Topics

- `next/image`: optimization, formats, sizes, priority
- Configuring `images.domains` / `images.remotePatterns` in next.config
- The `fill` mode and responsive `sizes` attribute
- `next/font/google` and `next/font/local`
- Eliminating FOUT/FOIT with automatic font subsetting
- `next/link` and automatic prefetching on hover/in-view
- Disabling prefetch for rarely-visited links
- Using `next/script` for third-party scripts with strategy

### Key Concepts

- `next/image` serves WebP/AVIF at the right resolution, lazy-loads, and prevents CLS by reserving space
- External image URLs must be whitelisted in `next.config.mjs` via `remotePatterns` (or legacy `domains`)
- `next/font` self-hosts Google Fonts (or local fonts), subsets to the languages you use, and inlines CSS to prevent FOUT
- `next/link` prefetches the destination route on hover or when it enters the viewport, making navigation instant
- `next/script` with `strategy="lazyOnload"` defers analytics until after interaction

```tsx
// app/page.tsx
import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* Local static image — needs width/height or fill */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={630}
        priority // preload for LCP
      />
      {/* Responsive fill — parent must be position: relative */}
      <div className="relative w-full h-64">
        <Image
          src="https://images.example.com/photo.jpg"
          alt="Photo"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
```
Caption: next/image with local and remote

### Common Pitfalls

- Using external image URLs without `remotePatterns` — Next.js throws a 400 error; whitelist each host in `next.config.mjs`.
- Using `fill` without a sized parent — the image needs a positioned parent (`position: relative`) with a height; otherwise it collapses to zero.
- Importing Google Fonts via `@import` in CSS — bypasses `next/font`, causing FOUT and a render-blocking request; use `next/font/google` instead.
- Setting `priority` on too many images — `priority` adds a `<link rel="preload">`; only use it for the LCP image (usually the hero).
- Forgetting `sizes` with `fill` — without `sizes`, Next.js defaults to `100vw`, generating unnecessarily large images for mobile devices.

### Real-World Applications

- Vercel's marketing site uses `next/image` to serve AVIF hero images, cutting LCP by ~30% vs raw JPEG.
- Notion uses `next/font` to self-host Inter and a custom emoji font, eliminating the FOUT that plagued their pre-Next.js docs.
- Hulu uses `next/image` with `sizes` to serve appropriately sized poster images for shows on mobile vs desktop.
- TikTok uses `next/link` prefetching on the home feed to make creator profile navigation feel instant.

### Interview Questions

- 1. Why use `next/image` over a plain `<img>`? — It serves modern formats at the right resolution, lazy-loads, reserves space (prevents CLS), and can be served from a Vercel-hosted optimizer.
- 2. How do you allow images from an external domain? — Add the host to `images.remotePatterns` (or legacy `images.domains`) in `next.config.mjs`.
- 3. What does `next/font` do to prevent FOUT? — It self-hosts the font, subsets it to the requested languages, and inlines the CSS so the font loads without a flash.
- 4. What does `next/link` prefetch? — It prefetches the destination route's JS/data when the link is hovered or enters the viewport (unless `prefetch={false}`).
- 5. When should you use `priority` on an image? — For the LCP (largest contentful paint) image, typically the hero; setting it on too many images wastes bandwidth.

### Mini Project

Build an image gallery: A `/gallery` page rendering 12 images in a responsive grid using `next/image` with `fill`, a custom `sizes` attribute, and an external CDN whitelist. Include a hero image with `priority`. Suggested approach:
  - Whitelist `images.unsplash.com` in `next.config.mjs`
  - Create a responsive grid of `<div className="relative">` containers with `aspect-video`
  - Render `<Image fill sizes="(max-width:768px) 100vw, 33vw" />` in each
  - Add one large hero image with `priority`
  - Verify AVIF/WebP is served by inspecting the network tab

### Exercises

1. Add a `next/image` for a local `/hero.jpg` with explicit width/height and verify it loads.
2. Configure `remotePatterns` for `images.unsplash.com` and load a remote image with `fill`.
3. Set up `next/font/google` for Inter with `display: "swap"` and verify no FOUT.
4. Add a `<Link prefetch={false}>` and confirm with DevTools that prefetch only happens on click.
5. Add `next/script` with `strategy="lazyOnload"` for a fake analytics script.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which component optimizes images in Next.js?
9. A) <img>
10. B) next/picture
11. C) next/image (*)
12. D) <OptimizedImage>
13. Explanation: `next/image` serves modern formats (AVIF/WebP) at the right resolution, lazy-loads by default, and prevents CLS by reserving space using width/height or fill.
14. Q2: Where do you whitelist an external image hostname?
15. A) In app/layout.tsx
16. B) In .env.local
17. C) In middleware.ts
18. D) In next.config.mjs under images.remotePatterns (*)
19. Explanation: External image hosts must be whitelisted in `images.remotePatterns` (or legacy `images.domains`) in `next.config.mjs`; otherwise `next/image` returns a 400 error.
20. Q3: What is required when using the `fill` prop on next/image?
21. A) A parent element with position: relative and a size (*)
22. B) A width prop
23. C) The priority prop
24. D) A placeholder prop
25. Explanation: `fill` makes the image absolutely position itself to fill the parent; the parent must have `position: relative` (or absolute/fixed) and a non-zero size for the image to display.
26. Q4: What does `next/font/google` do differently from a CSS @import?
27. A) It downloads fonts at runtime on the client
28. B) It self-hosts the font at build time, subsets it, and inlines the CSS to prevent FOUT (*)
29. C) It uses Google's CDN directly
30. D) Nothing — they are identical
31. Explanation: `next/font/google` downloads and self-hosts the font at build time, subsets to the languages you specify, and inlines the CSS, eliminating the FOUT and render-blocking that come with CSS @import.
32. Q5: What does `next/link` do by default on hover or viewport entry?
33. A) Nothing
34. B) Reloads the page
35. C) Prefetches the destination route (*)
36. D) Disables the link
37. Explanation: `next/link` prefetches the destination route's JS (and data for static routes) when the link is hovered or scrolls into view, making navigation feel instant.
38. Q6: How do you disable prefetch on a specific link?
39. A) prefetch="off"
40. B) noPrefetch
41. C) disablePrefetch
42. D) prefetch={false} (*)
43. Explanation: `<Link href="..." prefetch={false}>` disables automatic prefetch; the route is fetched only when the user clicks the link.
44. Q7: What does the `sizes` attribute on next/image do?
45. A) Tells the browser how wide the image will be at different breakpoints so Next.js generates appropriately sized sources (*)
46. B) Sets the file size limit
47. C) Compresses the image
48. D) Disables lazy loading
49. Explanation: `sizes` describes the image's display width at different breakpoints; Next.js uses it to generate appropriately sized `srcset` candidates so the browser downloads the smallest viable image.
50. Q8: Which `next/script` strategy defers loading until after interaction?
51. A) strategy="beforeInteractive"
52. B) strategy="lazyOnload" (*)
53. C) strategy="afterInteractive"
54. D) strategy="defer"
55. Explanation: `strategy="lazyOnload"` loads the script during idle time after the page is interactive, suitable for analytics and other non-critical scripts.
56. Q9: What is FOUT?
57. A) First Useful Text
58. B) Font Underline Type
59. C) Flash of Unstyled Text — fallback font shows briefly before the web font loads (*)
60. D) Font Update Time
61. Explanation: FOUT (Flash of Unstyled Text) is the brief moment when the fallback font shows before the web font loads; `next/font` prevents it by inlining the font CSS at build time.
62. Q10: When should you set `priority` on an image?
63. A) On every image
64. B) On background images
65. C) On images below the fold
66. D) Only on the LCP image (usually the hero) to preload it (*)
67. Explanation: `priority` adds a `<link rel="preload">` and disables lazy loading; use it only for the LCP image. Setting it on too many images wastes bandwidth and competes for priority.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which component optimizes images in Next.js?
  options:
    - <img>
    - next/picture
    - next/image
    - <OptimizedImage>
    - at the right resolution, lazy-loads by default, and prevents CLS by reserving space using width/height or fill.
  correctIndex: 2
  explanation: "`next/image` serves modern formats (AVIF/WebP) at the right resolution, lazy-loads by default, and prevents CLS by reserving space using width/height or fill."
- id: q2
  question: Where do you whitelist an external image hostname?
  options:
    - In app/layout.tsx
    - In .env.local
    - In middleware.ts
    - In next.config.mjs under images.remotePatterns
  correctIndex: 3
  explanation: External image hosts must be whitelisted in `images.remotePatterns` (or legacy `images.domains`) in `next.config.mjs`; otherwise `next/image` returns a 400 error.
- id: q3
  question: What is required when using the `fill` prop on next/image?
  options:
    - "A parent element with position: relative and a size"
    - A width prop
    - The priority prop
    - A placeholder prop
  correctIndex: 0
  explanation: "`fill` makes the image absolutely position itself to fill the parent; the parent must have `position: relative` (or absolute/fixed) and a non-zero size for the image to display."
- id: q4
  question: What does `next/font/google` do differently from a CSS @import?
  options:
    - It downloads fonts at runtime on the client
    - It self-hosts the font at build time, subsets it, and inlines the CSS to prevent FOUT
    - It uses Google's CDN directly
    - Nothing — they are identical
  correctIndex: 1
  explanation: "`next/font/google` downloads and self-hosts the font at build time, subsets to the languages you specify, and inlines the CSS, eliminating the FOUT and render-blocking that come with CSS @import."
- id: q5
  question: What does `next/link` do by default on hover or viewport entry?
  options:
    - Nothing
    - Reloads the page
    - Prefetches the destination route
    - Disables the link
  correctIndex: 2
  explanation: "`next/link` prefetches the destination route's JS (and data for static routes) when the link is hovered or scrolls into view, making navigation feel instant."
- id: q6
  question: How do you disable prefetch on a specific link?
  options:
    - prefetch="off"
    - noPrefetch
    - disablePrefetch
    - prefetch={false}
  correctIndex: 3
  explanation: '`<Link href="..." prefetch={false}>` disables automatic prefetch; the route is fetched only when the user clicks the link.'
- id: q7
  question: What does the `sizes` attribute on next/image do?
  options:
    - Tells the browser how wide the image will be at different breakpoints so Next.js generates appropriately sized sources
    - Sets the file size limit
    - Compresses the image
    - Disables lazy loading
  correctIndex: 0
  explanation: "`sizes` describes the image's display width at different breakpoints; Next.js uses it to generate appropriately sized `srcset` candidates so the browser downloads the smallest viable image."
- id: q8
  question: Which `next/script` strategy defers loading until after interaction?
  options:
    - strategy="beforeInteractive"
    - strategy="lazyOnload"
    - strategy="afterInteractive"
    - strategy="defer"
  correctIndex: 1
  explanation: '`strategy="lazyOnload"` loads the script during idle time after the page is interactive, suitable for analytics and other non-critical scripts.'
- id: q9
  question: What is FOUT?
  options:
    - First Useful Text
    - Font Underline Type
    - Flash of Unstyled Text — fallback font shows briefly before the web font loads
    - Font Update Time
  correctIndex: 2
  explanation: FOUT (Flash of Unstyled Text) is the brief moment when the fallback font shows before the web font loads; `next/font` prevents it by inlining the font CSS at build time.
- id: q10
  question: When should you set `priority` on an image?
  options:
    - On every image
    - On background images
    - On images below the fold
    - Only on the LCP image (usually the hero) to preload it
  correctIndex: 3
  explanation: '`priority` adds a `<link rel="preload">` and disables lazy loading; use it only for the LCP image. Setting it on too many images wastes bandwidth and competes for priority.'
```

