---
slug: html-links-images
id: html-03
track: html
order: 3
title: Links and Images
description: Connect pages together and embed visuals. This stage covers absolute and relative URLs, link relations, the `<img>` element, the `<picture>` element, and why `target="_blank"` needs `rel="noopener"`.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=700s
whyItMatters: Connect pages together and embed visuals. This stage covers absolute and relative URLs, link relations, the `<img>` element, the `<picture>` element, and why `target="_blank"` needs `rel="noopener"`.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Links and Images

## Links and Images

### Why It Matters

Connect pages together and embed visuals. This stage covers absolute and relative URLs, link relations, the `<img>` element, the `<picture>` element, and why `target="_blank"` needs `rel="noopener"`.

Connect pages together and embed visuals. This stage covers absolute and relative URLs, link relations, the `<img>` element, the `<picture>` element, and why `target="_blank"` needs `rel="noopener"`.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 2: Text Basics — Headings, Paragraphs, Formatting

### Topics

- The `<a>` element and the `href` attribute
- Absolute, relative, and root-relative URLs
- Link targets and the `rel` attribute (`noopener`, `noreferrer`, `external`, `bookmark`)
- `mailto:`, `tel:`, and fragment (`#id`) links
- The `<img>` element: `src`, `alt`, `width`, `height`, `loading`
- Intrinsic sizing to prevent Cumulative Layout Shift (CLS)
- The `<picture>` element with `srcset` and `sizes`
- `<figure>` and `<figcaption>` for captioned media

### Key Concepts

- A link's destination is its `href`; the link text is the visible content of `<a>`.
- `target="_blank"` opens a new tab but exposes the new page to `window.opener` unless you also set `rel="noopener"`.
- `alt` text describes the image for screen readers and when the image fails to load; decorative images use `alt=""`.
- Always specify `width` and `height` (or aspect-ratio CSS) so the browser reserves space and avoids layout shift.
- `srcset` lets the browser pick the best image for the device; `sizes` tells it the rendered width.

```html
<!-- Absolute URL to an external site -->
<a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">
  MDN Web Docs
</a>

<!-- Relative URL to a sibling page -->
<a href="about.html">About</a>

<!-- Root-relative URL -->
<a href="/contact">Contact</a>

<!-- Fragment link to an element with id="section-2" -->
<a href="#section-2">Jump to Section 2</a>

<!-- Email and telephone links -->
<a href="mailto:hello@example.com?subject=Hi">Email us</a>
<a href="tel:+15551234567">+1 (555) 123-4567</a>
```
Caption: Link variations

### Common Pitfalls

- Missing `alt` attribute on `<img>` — fails WCAG and breaks image-failure fallback; always provide `alt`, even if `alt=""` for decorative images.
- Using `target="_blank"` without `rel="noopener noreferrer"` — the new page can access `window.opener` and potentially redirect the original tab; modern browsers default to noopener behavior but include `rel` for safety on older browsers.
- Using `<a>` where `<button>` belongs — `<a href="#">` with a JS click handler is an anti-pattern; use `<button type="button">` for in-page actions.
- Omitting `width` and `height` on images — causes Cumulative Layout Shift as the image loads; specify intrinsic dimensions or CSS `aspect-ratio`.
- Vague link text like "click here" — screen readers list links out of context; use descriptive text like "View the Q3 report".

### Real-World Applications

- Wikipedia cross-references every claim with `<a href="/wiki/...">` links, producing one of the densest hyperlink graphs on the web.
- GitHub uses `target="_blank" rel="noopener noreferrer"` on external links in READMEs and issue comments across millions of repos.
- Unsplash serves responsive images via `srcset` so phones download a 400px-wide photo while desktops get a 1600px version.
- MDN wraps code screenshots in `<figure>` with `<figcaption>` so the captions appear in the table of figures for screen reader users.

### Interview Questions

- 1. Why does `target="_blank"` need `rel="noopener"`? — Without it, the new tab can access `window.opener` and potentially redirect or phishing-attack the original tab via `window.opener.location`.
- 2. What is the difference between `alt` and `title` on an image? — `alt` is required alternative text read by screen readers; `title` is optional advisory text shown as a tooltip, rarely useful for accessibility.
- 3. What does `srcset` do that CSS media queries cannot? — It lets the browser choose the image source based on device characteristics (DPR, width) before CSS loads, avoiding double-downloads.
- 4. When should `alt` be empty? — When the image is purely decorative and adds no information beyond the surrounding text; `alt=""` hides it from screen readers.
- 5. What is the difference between `<a>` and `<button>`? — `<a>` navigates to a URL; `<button>` triggers an in-page action. Use `<a>` only for navigation, never for JS-only handlers.

### Mini Project

Build a Photo Gallery Page: A single page showing 6-12 images in a grid with captions, each linking to a larger version, plus a navigation menu linking to three other local pages. Suggested approach:
  - Create `index.html`, `about.html`, `gallery.html`, and `contact.html`
  - Use `<nav>` with `<a>` links between pages, marking the current page with `aria-current="page"`
  - On `gallery.html`, use `<figure>` with `<img>` (include `alt`, `width`, `height`, `loading="lazy"`)
  - Wrap each `<figure>` in an `<a>` linking to a high-res version
  - Add a `<picture>` with `srcset` for the hero image on `index.html`

### Exercises

1. Add a "Skip to content" link as the first element of `<body>` linking to `<main id="content">`.
2. Create a footer with social media links that all use `target="_blank" rel="noopener noreferrer"`.
3. Replace a decorative divider image with `alt=""` and verify a screen reader skips it.
4. Convert a single `<img>` to a `<picture>` with two `<source>` elements for AVIF and WebP plus a JPEG fallback.
5. Audit your page for "click here" link text and rewrite each link to be descriptive on its own.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute on `<a>` specifies the destination URL?
9. A) href (*)
10. B) link
11. C) src
12. D) url
13. Explanation: The `href` (hypertext reference) attribute specifies the destination URL of a link.
14. Q2: Why should `target="_blank"` always be paired with `rel="noopener"`?
15. A) To make the link open faster
16. B) To prevent the new page from accessing window.opener (*)
17. C) To force HTTPS
18. D) To add a nofollow directive
19. Explanation: Without `noopener`, the new tab can use `window.opener` to redirect or attack the originating tab.
20. Q3: Which is a relative URL?
21. A) https://example.com/page
22. B) //example.com/page
23. C) page.html (*)
24. D) /page
25. Explanation: `page.html` is relative to the current page's location; the others are absolute or protocol-relative.
26. Q4: What is the purpose of `alt` on `<img>`?
27. A) To provide alternative text for screen readers and failed loads (*)
28. B) To show a tooltip
29. C) To set the image size
30. D) To cache the image
31. Explanation: `alt` provides a text alternative read by screen readers and shown when the image cannot load.
32. Q5: When should `alt=""` (empty) be used?
33. A) Never — it is invalid
34. B) When the image is broken
35. C) When the image is a link
36. D) When the image is purely decorative (*)
37. Explanation: Empty `alt` marks an image as decorative so screen readers skip it; never omit the attribute entirely.
38. Q6: Which attributes prevent layout shift when an image loads?
39. A) alt and title
40. B) loading and decoding
41. C) width and height (*)
42. D) src and srcset
43. Explanation: Specifying `width` and `height` lets the browser reserve space, preventing Cumulative Layout Shift (CLS).
44. Q7: What does `loading="lazy"` do on an `<img>`?
45. A) Compresses the image
46. B) Defers image load until it nears the viewport (*)
47. C) Disables caching
48. D) Forces synchronous loading
49. Explanation: Native lazy loading defers offscreen images until the user scrolls near them, saving bandwidth and improving initial load.
50. Q8: Which element wraps a captioned image?
51. A) <caption>
52. B) <legend>
53. C) <aside>
54. D) <figure> with <figcaption> (*)
55. Explanation: `<figure>` groups media with its `<figcaption>` caption; `<caption>` is only for tables.
56. Q9: What does `srcset` let the browser do?
57. A) Validate HTML
58. B) Preload the page
59. C) Choose the best image source for the device (*)
60. D) Add an alt text
61. Explanation: `srcset` lists candidate images with descriptors (width or DPR); the browser selects the most appropriate one.
62. Q10: Which element should trigger an in-page action like opening a modal?
63. A) <a href="#">
64. B) <a href="javascript:void(0)">
65. C) <span onclick="...">
66. D) <button type="button"> (*)
67. Explanation: In-page actions belong in `<button>`; `<a>` is for navigation only, and `<span>` with onclick is not keyboard-accessible.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute on `<a>` specifies the destination URL?
  options:
    - href
    - link
    - src
    - url
  correctIndex: 0
  explanation: The `href` (hypertext reference) attribute specifies the destination URL of a link.
- id: q2
  question: Why should `target="_blank"` always be paired with `rel="noopener"`?
  options:
    - To make the link open faster
    - To prevent the new page from accessing window.opener
    - To force HTTPS
    - To add a nofollow directive
  correctIndex: 1
  explanation: Without `noopener`, the new tab can use `window.opener` to redirect or attack the originating tab.
- id: q3
  question: Which is a relative URL?
  options:
    - https://example.com/page
    - //example.com/page
    - page.html
    - /page
  correctIndex: 2
  explanation: "`page.html` is relative to the current page's location; the others are absolute or protocol-relative."
- id: q4
  question: What is the purpose of `alt` on `<img>`?
  options:
    - To provide alternative text for screen readers and failed loads
    - To show a tooltip
    - To set the image size
    - To cache the image
  correctIndex: 0
  explanation: "`alt` provides a text alternative read by screen readers and shown when the image cannot load."
- id: q5
  question: When should `alt=""` (empty) be used?
  options:
    - Never — it is invalid
    - When the image is broken
    - When the image is a link
    - When the image is purely decorative
  correctIndex: 3
  explanation: Empty `alt` marks an image as decorative so screen readers skip it; never omit the attribute entirely.
- id: q6
  question: Which attributes prevent layout shift when an image loads?
  options:
    - alt and title
    - loading and decoding
    - width and height
    - src and srcset
    - .
  correctIndex: 2
  explanation: Specifying `width` and `height` lets the browser reserve space, preventing Cumulative Layout Shift (CLS).
- id: q7
  question: What does `loading="lazy"` do on an `<img>`?
  options:
    - Compresses the image
    - Defers image load until it nears the viewport
    - Disables caching
    - Forces synchronous loading
  correctIndex: 1
  explanation: Native lazy loading defers offscreen images until the user scrolls near them, saving bandwidth and improving initial load.
- id: q8
  question: Which element wraps a captioned image?
  options:
    - <caption>
    - <legend>
    - <aside>
    - <figure> with <figcaption>
  correctIndex: 3
  explanation: "`<figure>` groups media with its `<figcaption>` caption; `<caption>` is only for tables."
- id: q9
  question: What does `srcset` let the browser do?
  options:
    - Validate HTML
    - Preload the page
    - Choose the best image source for the device
    - Add an alt text
    - ; the browser selects the most appropriate one.
  correctIndex: 2
  explanation: "`srcset` lists candidate images with descriptors (width or DPR); the browser selects the most appropriate one."
- id: q10
  question: Which element should trigger an in-page action like opening a modal?
  options:
    - <a href="#">
    - <a href="javascript:void(0)">
    - <span onclick="...">
    - <button type="button">
  correctIndex: 3
  explanation: In-page actions belong in `<button>`; `<a>` is for navigation only, and `<span>` with onclick is not keyboard-accessible.
```

