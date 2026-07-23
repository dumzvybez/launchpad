---
slug: css-responsive-design-media-queries
id: css-08
track: css
order: 8
title: Responsive Design and Media Queries
description: Make your layouts adapt to any screen. Learn `@media`, `min-width`/`max-width` mobile-first strategy, `prefers-color-scheme`, container queries, modern viewport units, and the `picture` element for responsive images.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=1750s
whyItMatters: Make your layouts adapt to any screen. Learn `@media`, `min-width`/`max-width` mobile-first strategy, `prefers-color-scheme`, container queries, modern viewport units, and the `picture` element for responsive images.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Responsive Design and Media Queries

## Responsive Design and Media Queries

### Why It Matters

Make your layouts adapt to any screen. Learn `@media`, `min-width`/`max-width` mobile-first strategy, `prefers-color-scheme`, container queries, modern viewport units, and the `picture` element for responsive images.

Make your layouts adapt to any screen. Learn `@media`, `min-width`/`max-width` mobile-first strategy, `prefers-color-scheme`, container queries, modern viewport units, and the `picture` element for responsive images.

### Prerequisites

- Stage 1-7 (especially Stage 6 Flexbox and Stage 7 Grid)
- Comfortable with the box model and basic layout

### Topics

- Mobile-first vs desktop-first strategy
- `@media` syntax: `min-width`, `max-width`, `orientation`, `pointer`
- Logical breakpoints (not device-specific)
- `em`-based media queries (vs `px`)
- `@media (prefers-color-scheme: dark)` and `light-dark()`
- Modern viewport units: `svh`, `lvh`, `dvh`, `svi`, `dvi`
- Container queries (`@container`) and `container-type`
- Responsive images: `<picture>`, `srcset`, `sizes`, `aspect-ratio`
- `print` media and forced-colors considerations (previewed)

### Key Concepts

- Mobile-first means base styles target small screens, then `min-width` media queries add complexity for larger screens; this keeps the small-screen bundle small.
- Use `em` in media queries so user font-size settings scale breakpoints consistently.
- Container queries let a component respond to its parent's size, not the viewport — ideal for design systems whose components live in unpredictable containers.
- `prefers-color-scheme: dark` flips the palette based on OS preference; pair with `light-dark()` (CSS Color 5) for one-line theming.
- `aspect-ratio: 16 / 9` reserves space for media before load, preventing CLS.

```css
/* Base: mobile */
.layout { display: flex; flex-direction: column; }

/* Tablet and up */
@media (min-width: 48em) {
  .layout { flex-direction: row; }
}

/* Desktop and up */
@media (min-width: 64em) {
  .layout { grid-template-columns: 240px 1fr 320px; display: grid; }
}
```
Caption: Mobile-first media queries

### Common Pitfalls

- Using device-specific breakpoints (iPhone 12, iPad) — devices change; pick logical breakpoints based on your content's reflow needs.
- Writing desktop-first with `max-width` queries — base styles are the heavy desktop bundle; mobile-first with `min-width` ships less to small screens.
- Forgetting `color-scheme: light dark` — without it, form controls and scrollbars do not auto-darken in dark mode.
- Using `vh` for full-screen mobile layouts — the address bar overlaps; use `dvh` (or `svh` for stable small viewport).
- Hardcoding `aspect-ratio` without `width`/`height` attributes on the `<img>` — pre-load layout shift still happens; use both for best CLS.

### Real-World Applications

- Stripe's marketing pages ship mobile-first styles and progressive `min-width` queries for tablet/desktop enhancements.
- Vercel's dashboard uses container queries so widgets resize based on their column width, not the viewport.
- GitHub uses `prefers-color-scheme` to flip syntax highlighting, code blocks, and chrome to dark mode automatically.
- Apple's product pages use `aspect-ratio` on hero media so the page never reflows when heavy images load.

### Interview Questions

- 1. What is the difference between mobile-first and desktop-first media queries? — Mobile-first uses `min-width` to add layout for larger screens (small base); desktop-first uses `max-width` to subtract (large base).
- 2. Why use `em` instead of `px` in media queries? — `em`-based queries scale with the user's root font-size, so users who zoom text see breakpoints reflow proportionally.
- 3. What problem do container queries solve? — They let a component respond to its parent's size, not the viewport, so components adapt in any context (sidebar, modal, grid cell).
- 4. What does `color-scheme: light dark` do? — Tells the browser the page supports both schemes, so UA widgets (scrollbars, form controls) auto-style.
- 5. Why prefer `dvh` over `vh` on mobile? — `vh` is the largest possible viewport (address bar hidden); `dvh` tracks the visible area so content is never covered.

### Mini Project

Build a Responsive Product Grid: A product card grid that shows 1 column on mobile, 2 on tablet, 3-4 on desktop, with each card flipping its internal layout based on its container width via container queries. Suggested approach:
  - Apply `container-type: inline-size` to each card wrapper
  - Write `@container (min-width: 24rem)` to switch from stacked to horizontal card layout
  - Use grid `auto-fit, minmax(16rem, 1fr)` for the outer grid
  - Add `prefers-color-scheme: dark` styles via `light-dark()`
  - Add `aspect-ratio: 4 / 3` to product images

### Exercises

1. Rewrite a desktop-first stylesheet (max-width) as mobile-first (min-width) and compare the small-screen bundle size.
2. Set `color-scheme: light dark` and verify scrollbars and form controls flip with `prefers-color-scheme: dark`.
3. Add a container query to a card so it switches from horizontal to vertical at < 28em container width.
4. Replace `100vh` with `100dvh` and test on a mobile emulator; observe no content hidden by address bar.
5. Add `aspect-ratio: 16 / 9` to a video placeholder and observe no CLS when the video loads.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which media-query strategy ships the smallest CSS bundle to mobile users?
9. A) Mobile-first with `min-width` (*)
10. B) Desktop-first with `max-width`
11. C) Device-specific queries
12. D) Inline styles
13. Explanation: Mobile-first makes the base styles the small-screen ones; `min-width` queries add desktop complexity only when needed.
14. Q2: Which unit is recommended for media-query breakpoints?
15. A) px
16. B) vw
17. C) pt
18. D) em (*)
19. Explanation: `em`-based breakpoints scale with the user's root font-size, so text zoomers see queries reflow proportionally.
20. Q3: What does `@container` query against?
21. A) The parent container's size (*)
22. B) The viewport
23. C) The screen DPI
24. D) The number of children
25. Explanation: Container queries test the size of the nearest ancestor with `container-type` set, allowing components to adapt to their context.
26. Q4: Which unit tracks the visible viewport on mobile as the address bar shows/hides?
27. A) vh
28. B) dvh (*)
29. C) svh
30. D) lvh
31. Explanation: `dvh` (dynamic viewport height) adjusts with the visible area; `vh` is the largest possible viewport.
32. Q5: Which declaration tells the browser the page supports both light and dark schemes?
33. A) `theme: both`
34. B) `prefers-color-scheme: both`
35. C) `color-scheme: light dark` (*)
36. D) `appearance: auto`
37. Explanation: `color-scheme: light dark` lets UA widgets (scrollbars, form controls) auto-darken in dark mode.
38. Q6: Which function lets you specify both light and dark values in one declaration?
39. A) `dark()`
40. B) `theme()`
41. C) `color-mix()`
42. D) `light-dark()` (*)
43. Explanation: `light-dark(lightValue, darkValue)` returns the appropriate value based on the active color-scheme.
44. Q7: What does `aspect-ratio: 16 / 9` on a media container prevent?
45. A) Cumulative Layout Shift when the media loads (*)
46. B) Image loading slowly
47. C) Image corruption
48. D) Bandwidth usage
49. Explanation: `aspect-ratio` reserves the correct space before the media loads, so the page does not reflow.
50. Q8: Which breakpoint choice is considered an anti-pattern?
51. A) `min-width: 48em`
52. B) Device-specific (e.g., "iPhone 12 width") (*)
53. C) Content-based breakpoints
54. D) Using `em` units
55. Explanation: Device-specific breakpoints break when new devices ship; prefer content-based or logical breakpoints.
56. Q9: Which property must be set on a container before `@container` queries can target it?
57. A) `display: container`
58. B) `position: relative`
59. C) `container-type` (*)
60. D) `isolation: isolate`
61. Explanation: `container-type: inline-size` (or `size`) establishes a query container for descendant queries.
62. Q10: Which responsive image element lets the browser pick the best image based on viewport?
63. A) `<responsive-img>`
64. B) `<image-source>`
65. C) `<img responsive>`
66. D) `<img srcset>` and `<picture>` (*)
67. Explanation: `srcset` and `<picture>` with `<source>` let the browser choose the right image based on viewport density and width.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which media-query strategy ships the smallest CSS bundle to mobile users?
  options:
    - Mobile-first with `min-width`
    - Desktop-first with `max-width`
    - Device-specific queries
    - Inline styles
  correctIndex: 0
  explanation: Mobile-first makes the base styles the small-screen ones; `min-width` queries add desktop complexity only when needed.
- id: q2
  question: Which unit is recommended for media-query breakpoints?
  options:
    - px
    - vw
    - pt
    - em
  correctIndex: 3
  explanation: "`em`-based breakpoints scale with the user's root font-size, so text zoomers see queries reflow proportionally."
- id: q3
  question: What does `@container` query against?
  options:
    - The parent container's size
    - The viewport
    - The screen DPI
    - The number of children
  correctIndex: 0
  explanation: Container queries test the size of the nearest ancestor with `container-type` set, allowing components to adapt to their context.
- id: q4
  question: Which unit tracks the visible viewport on mobile as the address bar shows/hides?
  options:
    - vh
    - dvh
    - svh
    - lvh
  correctIndex: 1
  explanation: "`dvh` (dynamic viewport height) adjusts with the visible area; `vh` is the largest possible viewport."
- id: q5
  question: Which declaration tells the browser the page supports both light and dark schemes?
  options:
    - "`theme: both`"
    - "`prefers-color-scheme: both`"
    - "`color-scheme: light dark`"
    - "`appearance: auto`"
  correctIndex: 2
  explanation: "`color-scheme: light dark` lets UA widgets (scrollbars, form controls) auto-darken in dark mode."
- id: q6
  question: Which function lets you specify both light and dark values in one declaration?
  options:
    - "`dark()`"
    - "`theme()`"
    - "`color-mix()`"
    - "`light-dark()`"
  correctIndex: 3
  explanation: "`light-dark(lightValue, darkValue)` returns the appropriate value based on the active color-scheme."
- id: q7
  question: "What does `aspect-ratio: 16 / 9` on a media container prevent?"
  options:
    - Cumulative Layout Shift when the media loads
    - Image loading slowly
    - Image corruption
    - Bandwidth usage
  correctIndex: 0
  explanation: "`aspect-ratio` reserves the correct space before the media loads, so the page does not reflow."
- id: q8
  question: Which breakpoint choice is considered an anti-pattern?
  options:
    - "`min-width: 48em`"
    - Device-specific (e.g., "iPhone 12 width")
    - Content-based breakpoints
    - Using `em` units
  correctIndex: 1
  explanation: Device-specific breakpoints break when new devices ship; prefer content-based or logical breakpoints.
- id: q9
  question: Which property must be set on a container before `@container` queries can target it?
  options:
    - "`display: container`"
    - "`position: relative`"
    - "`container-type`"
    - "`isolation: isolate`"
  correctIndex: 2
  explanation: "`container-type: inline-size` (or `size`) establishes a query container for descendant queries."
- id: q10
  question: Which responsive image element lets the browser pick the best image based on viewport?
  options:
    - "`<responsive-img>`"
    - "`<image-source>`"
    - "`<img responsive>`"
    - "`<img srcset>` and `<picture>`"
  correctIndex: 3
  explanation: "`srcset` and `<picture>` with `<source>` let the browser choose the right image based on viewport density and width."
```

