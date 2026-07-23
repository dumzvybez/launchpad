---
slug: html-metadata-seo-open-graph
id: html-10
track: html
order: 10
title: Metadata, SEO, and Open Graph
description: "Make your page shareable and discoverable. This stage covers everything inside `<head>`: title, meta description, canonical, robots, Open Graph, Twitter Cards, and favicons."
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3500s
whyItMatters: "Make your page shareable and discoverable. This stage covers everything inside `<head>`: title, meta description, canonical, robots, Open Graph, Twitter Cards, and favicons."
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Metadata, SEO, and Open Graph

## Metadata, SEO, and Open Graph

### Why It Matters

Make your page shareable and discoverable. This stage covers everything inside `<head>`: title, meta description, canonical, robots, Open Graph, Twitter Cards, and favicons.

Make your page shareable and discoverable. This stage covers everything inside `<head>`: title, meta description, canonical, robots, Open Graph, Twitter Cards, and favicons.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 6: Semantic HTML and Document Outline

### Topics

- `<title>` (50-60 chars) and `<meta name="description">` (150-160 chars)
- Canonical link: `<link rel="canonical" href="...">`
- Robots meta: `noindex`, `nofollow`, `noarchive`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Cards: `twitter:card`, `twitter:title`, `twitter:image`
- `<link rel="icon">` and `<link rel="apple-touch-icon">`
- `<meta name="theme-color">`
- `<link rel="alternate" hreflang="...">` for international pages

### Key Concepts

- The `<title>` is the single most important on-page SEO signal and the browser tab label.
- Meta description does not affect ranking but does affect click-through rate from search results.
- Open Graph tags control how your page appears when shared on Facebook, LinkedIn, Slack, and most messaging apps.
- The canonical tag tells search engines which URL is the master version when duplicate content exists.
- `noindex` removes a page from search results; `nofollow` tells crawlers not to follow links.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>How to Bake Sourdough Bread — Acme Bakery</title>
  <meta name="description" content="Step-by-step sourdough bread recipe with timing, temperature, and tips. Ready in 24 hours.">
  <link rel="canonical" href="https://acme.example/recipes/sourdough">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Acme Bakery">
  <meta name="theme-color" content="#e34f26">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/icons/apple-180.png">
  <link rel="alternate" hreflang="es" href="https://acme.example/es/recipes/sourdough">
</head>
```
Caption: Full SEO head

### Common Pitfalls

- Missing `<title>` or duplicate titles across pages — kills SEO and confuses users with multiple tabs; every page needs a unique title.
- Stuffing the `<meta name="keywords">` — ignored by Google since 2009; remove it, it does nothing and signals spam.
- Forgetting Open Graph tags — link previews on Slack, Twitter, and LinkedIn look broken; add at minimum `og:title`, `og:description`, `og:image`, `og:url`.
- Missing canonical on duplicate content — search engines may index the wrong URL; set `<link rel="canonical">` to the master URL.
- Using `noindex` accidentally on a page you want indexed — verify robots meta in production; one stray `noindex` can hide a page from Google.

### Real-World Applications

- GitHub renders Open Graph tags on every repo so that shared links show the repo name, description, and owner avatar in Slack/Twitter.
- The New York Times sets unique `<title>` and `og:image` (a custom share image) on every article for rich social previews.
- Wikipedia's article pages set `<link rel="canonical">` and `<link rel="alternate" hreflang="...">` for 300+ language editions.
- Web.dev's article pages set `theme-color`, Twitter Cards, and Open Graph so the browser UI matches the brand color on mobile.

### Interview Questions

- 1. What is the ideal length of a `<title>` tag? — 50-60 characters to avoid truncation in Google search results.
- 2. Does `<meta name="description">` affect ranking? — No direct ranking effect, but it affects click-through rate; write a compelling 150-160 character summary.
- 3. What is the canonical tag for? — Tells search engines which URL is the master version when the same content appears at multiple URLs.
- 4. What do Open Graph tags do? — Control how your page appears when shared on Facebook, LinkedIn, Slack, and most social platforms.
- 5. What does `noindex` do? — Instructs search engines not to include the page in search results; combine with `follow` or `nofollow` independently.

### Mini Project

Build an SEO-Optimized Article with Social Cards: A single article page with a complete SEO head — title, description, canonical, robots, Open Graph, Twitter Cards, and favicons. Validate the result with the Twitter Card Validator and Facebook Sharing Debugger. Suggested approach:
  - Write a unique 55-char `<title>` and 155-char meta description
  - Add `<link rel="canonical" href="https://yoursite.example/article">`
  - Create a 1200x630 share image and reference it in `og:image` and `twitter:image`
  - Add `<link rel="icon">` and `<link rel="apple-touch-icon">`
  - Set `<meta name="theme-color" content="#yourbrand">`

### Exercises

1. Audit five pages on your site and confirm each has a unique `<title>` and meta description.
2. Share a page URL in Slack and verify the Open Graph preview renders the image, title, and description.
3. Add a `noindex` tag to a staging page and confirm Google Search Console reports it as excluded.
4. Set `<link rel="canonical">` on a page with URL parameters and verify search results link to the canonical URL.
5. Run your page through the Twitter Card Validator and fix any reported issues.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the recommended length of a `<title>` tag?
9. A) 10-20 characters
10. B) 50-60 characters (*)
11. C) 100-120 characters
12. D) Unlimited
13. Explanation: 50-60 characters avoids truncation in Google search results; longer titles are cut off with an ellipsis.
14. Q2: Does `<meta name="description">` directly affect search ranking?
15. A) Yes, heavily
16. B) No, but it affects click-through rate from results (*)
17. C) Yes, slightly
18. D) Only on Bing
19. Explanation: Google announced in 2009 that meta description is not a ranking factor, but it appears as the snippet text and influences CTR.
20. Q3: Which tag prevents a page from appearing in search results?
21. A) <meta name="robots" content="nofollow">
22. B) <link rel="canonical">
23. C) <meta name="robots" content="noindex"> (*)
24. D) <meta name="description" content="">
25. Explanation: `noindex` tells search engines not to include the page in results; `nofollow` only stops them following links.
26. Q4: What is the canonical link for?
27. A) To set the homepage
28. B) To declare the XML namespace
29. C) To enforce HTTPS
30. D) To point to the master URL when duplicate content exists (*)
31. Explanation: `<link rel="canonical" href="...">` tells search engines which URL is the master version when content is duplicated across URLs.
32. Q5: Which Open Graph tag controls the share image?
33. A) og:picture
34. B) og:thumb
35. C) og:image (*)
36. D) og:preview
37. Explanation: `og:image` is the image URL shown in social previews; recommended size is 1200x630 pixels.
38. Q6: Which Twitter Card type shows a large image above the title?
39. A) summary_large_image (*)
40. B) summary
41. C) photo
42. D) player
43. Explanation: `twitter:card=summary_large_image` shows a large featured image; `summary` shows a small square thumbnail.
44. Q7: Which meta tag sets the browser UI color on mobile?
45. A) <meta name="theme-color"> (*)
46. B) <meta name="brand-color">
47. C) <meta name="browser-color">
48. D) <meta name="ui-color">
49. Explanation: `<meta name="theme-color" content="#e34f26">` colors the mobile browser address bar to match your brand.
50. Q8: Why is `<meta name="keywords">` no longer useful?
51. A) It is invalid HTML
52. B) It slows page load
53. C) Google has ignored it since 2009 due to spam abuse (*)
54. D) It conflicts with Open Graph
55. Explanation: Keyword stuffing abuse led Google to ignore the keywords meta tag entirely in 2009; it has no SEO effect.
56. Q9: What does `<link rel="alternate" hreflang="es">` declare?
57. A) The page is in Spanish
58. B) The page should redirect to Spanish
59. C) The page is blocked in Spain
60. D) A Spanish translation of the page exists at the linked URL (*)
61. Explanation: `hreflang` tells search engines about localized versions of a page, helping them serve the right language to users.
62. Q10: Which `<link rel>` declares the favicon for modern browsers?
63. A) <link rel="favicon">
64. B) <link rel="icon"> (*)
65. C) <link rel="shortcut">
66. D) <link rel="meta">
67. Explanation: `<link rel="icon" href="/favicon.ico">` is the modern way; `rel="shortcut icon"` is an IE legacy that still works but is non-standard.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the recommended length of a `<title>` tag?
  options:
    - 10-20 characters
    - 50-60 characters
    - 100-120 characters
    - Unlimited
  correctIndex: 1
  explanation: 50-60 characters avoids truncation in Google search results; longer titles are cut off with an ellipsis.
- id: q2
  question: Does `<meta name="description">` directly affect search ranking?
  options:
    - Yes, heavily
    - No, but it affects click-through rate from results
    - Yes, slightly
    - Only on Bing
  correctIndex: 1
  explanation: Google announced in 2009 that meta description is not a ranking factor, but it appears as the snippet text and influences CTR.
- id: q3
  question: Which tag prevents a page from appearing in search results?
  options:
    - <meta name="robots" content="nofollow">
    - <link rel="canonical">
    - <meta name="robots" content="noindex">
    - <meta name="description" content="">
  correctIndex: 2
  explanation: "`noindex` tells search engines not to include the page in results; `nofollow` only stops them following links."
- id: q4
  question: What is the canonical link for?
  options:
    - To set the homepage
    - To declare the XML namespace
    - To enforce HTTPS
    - To point to the master URL when duplicate content exists
  correctIndex: 3
  explanation: '`<link rel="canonical" href="...">` tells search engines which URL is the master version when content is duplicated across URLs.'
- id: q5
  question: Which Open Graph tag controls the share image?
  options:
    - og:picture
    - og:thumb
    - og:image
    - og:preview
  correctIndex: 2
  explanation: "`og:image` is the image URL shown in social previews; recommended size is 1200x630 pixels."
- id: q6
  question: Which Twitter Card type shows a large image above the title?
  options:
    - summary_large_image
    - summary
    - photo
    - player
  correctIndex: 0
  explanation: "`twitter:card=summary_large_image` shows a large featured image; `summary` shows a small square thumbnail."
- id: q7
  question: Which meta tag sets the browser UI color on mobile?
  options:
    - <meta name="theme-color">
    - <meta name="brand-color">
    - <meta name="browser-color">
    - <meta name="ui-color">
  correctIndex: 0
  explanation: '`<meta name="theme-color" content="#e34f26">` colors the mobile browser address bar to match your brand.'
- id: q8
  question: Why is `<meta name="keywords">` no longer useful?
  options:
    - It is invalid HTML
    - It slows page load
    - Google has ignored it since 2009 due to spam abuse
    - It conflicts with Open Graph
  correctIndex: 2
  explanation: Keyword stuffing abuse led Google to ignore the keywords meta tag entirely in 2009; it has no SEO effect.
- id: q9
  question: What does `<link rel="alternate" hreflang="es">` declare?
  options:
    - The page is in Spanish
    - The page should redirect to Spanish
    - The page is blocked in Spain
    - A Spanish translation of the page exists at the linked URL
  correctIndex: 3
  explanation: "`hreflang` tells search engines about localized versions of a page, helping them serve the right language to users."
- id: q10
  question: Which `<link rel>` declares the favicon for modern browsers?
  options:
    - <link rel="favicon">
    - <link rel="icon">
    - <link rel="shortcut">
    - <link rel="meta">
  correctIndex: 1
  explanation: '`<link rel="icon" href="/favicon.ico">` is the modern way; `rel="shortcut icon"` is an IE legacy that still works but is non-standard.'
```

