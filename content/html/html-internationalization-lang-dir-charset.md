---
slug: html-internationalization-lang-dir-charset
id: html-15
track: html
order: 15
title: Internationalization — lang, dir, and Charset
description: Build pages that work in any language and direction. This stage covers character encoding, the `lang` attribute, RTL layout, `hreflang`, ruby annotations, and bidirectional text handling.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5500s
whyItMatters: Build pages that work in any language and direction. This stage covers character encoding, the `lang` attribute, RTL layout, `hreflang`, ruby annotations, and bidirectional text handling.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Internationalization — lang, dir, and Charset

## Internationalization — lang, dir, and Charset

### Why It Matters

Build pages that work in any language and direction. This stage covers character encoding, the `lang` attribute, RTL layout, `hreflang`, ruby annotations, and bidirectional text handling.

Build pages that work in any language and direction. This stage covers character encoding, the `lang` attribute, RTL layout, `hreflang`, ruby annotations, and bidirectional text handling.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 6: Semantic HTML and Document Outline
- Stage 10: Metadata, SEO, and Open Graph

### Topics

- Character encoding: UTF-8, `<meta charset="utf-8">`
- The `lang` attribute and BCP 47 language tags (`en`, `en-GB`, `ar`, `zh-Hans`, `pt-BR`)
- The `dir` attribute: `ltr`, `rtl`, `auto`
- `<bdi>` (bidirectional isolate) and `<bdo>` (bidirectional override)
- `<ruby>`, `<rt>`, `<rp>` for CJK pronunciation annotations
- `hreflang` on `<link rel="alternate">` for multilingual SEO
- The `translate` attribute (`yes`/`no`) for content that should not be translated
- Date, number, and time formatting with `Intl` (mention only — JS territory)

### Key Concepts

- UTF-8 encodes every character in the Unicode standard; declare it as the first thing in `<head>`.
- The `lang` attribute on `<html>` sets the page's primary language; override per-element when content switches language.
- `dir="rtl"` flips the entire layout for right-to-left languages like Arabic and Hebrew.
- `<bdi>` isolates a span of text so its direction does not leak into neighbors (essential for user-generated content with mixed directions).
- `<ruby>` adds small pronunciation hints above CJK characters; `<rp>` provides fallback parentheses for browsers without ruby support.

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>مرحبا</title>
  <link rel="alternate" hreflang="en" href="https://example.com/en/">
  <link rel="alternate" hreflang="ar" href="https://example.com/ar/">
</head>
<body>
  <h1>مرحبا بكم</h1>
  <p>النص يبدأ من اليمين</p>
  <p translate="no">Brand names like iPhone should not translate.</p>
</body>
</html>
```
Caption: Multilingual page with RTL

### Common Pitfalls

- Missing `<meta charset="utf-8">` — non-ASCII characters (é, ñ, 漢) render as mojibake; declare charset in the first 1024 bytes.
- Wrong or missing `lang` attribute — screen readers use wrong pronunciation; set the correct BCP 47 tag on `<html>` and override per-element.
- Hardcoded `dir="ltr"` assumptions in CSS — breaks RTL layouts; use logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical (`margin-left`).
- Forgetting `hreflang` on multilingual sites — search engines may serve the wrong language version; declare all alternates including `hreflang="x-default"`.
- Using `<bdo>` where `<bdi>` is needed — `<bdo>` forces a direction; `<bdi>` isolates, which is what you want for unknown user content.

### Real-World Applications

- Wikipedia serves 300+ language editions each with the correct `lang` and `dir` on `<html>`, plus `hreflang` alternates between editions.
- BBC Arabic (`bbc.com/arabic`) uses `dir="rtl"` throughout and ships CSS logical properties so the same components work in LTR and RTL.
- Twitter uses `<bdi>` around usernames so Arabic, Hebrew, and English usernames display correctly inline in any feed.
- Apple's localized sites use `<html lang="zh-Hans">` for Simplified Chinese and `<ruby>` annotations on kanji-focused pages in Japan.

### Interview Questions

- 1. What is the purpose of `<meta charset="utf-8">`? — Tells the browser to decode the page as UTF-8, ensuring every Unicode character renders correctly.
- 2. What does `dir="rtl"` do? — Sets the base direction of the element's content to right-to-left, mirroring layout for languages like Arabic and Hebrew.
- 3. What is the difference between `<bdi>` and `<bdo>`? — `<bdi>` isolates content's direction from neighbors; `<bdo>` forces a specific direction on its content.
- 4. What is a BCP 47 language tag? — A standardized code like `en-GB` or `zh-Hans` combining language, region, and script used by the `lang` attribute.
- 5. What does `hreflang="x-default"` mean? — The default page to serve when no language/region matches the user's settings.

### Mini Project

Build a Bilingual Page with RTL Support: A page with a language toggle between English (LTR) and Arabic (RTL). Both versions show the same content with correct direction, lang attribute, and a ruby annotation for a borrowed CJK term. Suggested approach:
  - Create `index.html` (en, ltr) and `index.ar.html` (ar, rtl) with matching content
  - Set `<html lang="..." dir="...">` correctly on each
  - Use CSS logical properties (`margin-inline-start`) so layout works in both directions
  - Add `<link rel="alternate" hreflang="en">` and `hreflang="ar"` to both
  - Include one `<ruby>` annotation for a borrowed word like "origami" written in 漢字

### Exercises

1. Set `<html lang="en">` and verify VoiceOver pronounces French words correctly when marked `<span lang="fr">`.
2. Add `dir="rtl"` to a paragraph and confirm the text aligns right and reads right-to-left.
3. Wrap a user-displayed username in `<bdi>` and verify mixed Arabic/English names display correctly inline.
4. Add `<link rel="alternate" hreflang="es">` to your page and run it through Google's International Targeting report.
5. Add `translate="no"` to a brand name and confirm Google Translate leaves it alone.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which meta tag declares character encoding?
9. A) <meta encoding="utf-8">
10. B) <meta charset="utf-8"> (*)
11. C) <meta http-equiv="content-type" content="text/utf-8">
12. D) <meta lang="utf-8">
13. Explanation: `<meta charset="utf-8">` is the HTML5 way to declare UTF-8 encoding; it should appear in the first 1024 bytes of the document.
14. Q2: Which attribute sets right-to-left text direction?
15. A) lang="ar"
16. B) align="right"
17. C) rtl="true"
18. D) dir="rtl" (*)
19. Explanation: `dir="rtl"` sets the base direction to right-to-left for languages like Arabic and Hebrew; `dir="ltr"` is the default.
20. Q3: What is a BCP 47 language tag?
21. A) A URL scheme
22. B) A character encoding
23. C) A standardized code like `en-GB` or `zh-Hans` (*)
24. D) A CSS property
25. Explanation: BCP 47 defines language tags combining language, region, and script (e.g., `en-GB`, `zh-Hans`, `pt-BR`) used by the `lang` attribute.
26. Q4: Which element isolates bidirectional text from its neighbors?
27. A) <bdo>
28. B) <rtl>
29. C) <bdi> (*)
30. D) <dir>
31. Explanation: `<bdi>` (bidirectional isolate) wraps content whose direction is unknown, preventing it from leaking into adjacent text — essential for usernames.
32. Q5: What does `<bdo>` do?
33. A) Forces a specific direction on its content (*)
34. B) Isolates direction
35. C) Adds a translation
36. D) Sets the language
37. Explanation: `<bdo dir="rtl">` overrides the bidirectional algorithm and forces the content to render in the specified direction.
38. Q6: What does `hreflang="x-default"` declare?
39. A) The default page when no language/region matches the user (*)
40. B) The page is broken
41. C) The XML namespace
42. D) The CSS language
43. Explanation: `x-default` is the fallback URL Google serves when no hreflang matches the user's language/region settings.
44. Q7: Which element provides pronunciation hints for CJK characters?
45. A) <hint>
46. B) <annot>
47. C) <cjk>
48. D) <ruby> (*)
49. Explanation: `<ruby>` adds small annotations above characters (commonly pronunciation in Latin script); `<rt>` holds the annotation text.
50. Q8: Why use CSS logical properties (`margin-inline-start`) instead of `margin-left`?
51. A) They are faster
52. B) They are shorter
53. C) They flip automatically in RTL layouts (*)
54. D) They are required for SEO
55. Explanation: Logical properties map to physical sides based on `dir`, so `margin-inline-start` is left in LTR and right in RTL — no separate RTL stylesheet needed.
56. Q9: What does `translate="no"` do?
57. A) Disables the page
58. B) Tells translation tools to leave the content untranslated (*)
59. C) Adds a translation
60. D) Sets the page language
61. Explanation: `translate="no"` (or `translate="yes"`) signals to Google Translate and other tools whether to translate the element's content, useful for brand names.
62. Q10: Where should the `lang` attribute be set for a page's primary language?
63. A) On <body>
64. B) On <head>
65. C) On <main>
66. D) On <html> (*)
67. Explanation: Set the primary language on `<html lang="en">` so it applies to the entire document; override per-element when content switches language.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which meta tag declares character encoding?
  options:
    - <meta encoding="utf-8">
    - <meta charset="utf-8">
    - <meta http-equiv="content-type" content="text/utf-8">
    - <meta lang="utf-8">
  correctIndex: 1
  explanation: '`<meta charset="utf-8">` is the HTML5 way to declare UTF-8 encoding; it should appear in the first 1024 bytes of the document.'
- id: q2
  question: Which attribute sets right-to-left text direction?
  options:
    - lang="ar"
    - align="right"
    - rtl="true"
    - dir="rtl"
  correctIndex: 3
  explanation: '`dir="rtl"` sets the base direction to right-to-left for languages like Arabic and Hebrew; `dir="ltr"` is the default.'
- id: q3
  question: What is a BCP 47 language tag?
  options:
    - A URL scheme
    - A character encoding
    - A standardized code like `en-GB` or `zh-Hans`
    - A CSS property
  correctIndex: 2
  explanation: BCP 47 defines language tags combining language, region, and script (e.g., `en-GB`, `zh-Hans`, `pt-BR`) used by the `lang` attribute.
- id: q4
  question: Which element isolates bidirectional text from its neighbors?
  options:
    - <bdo>
    - <rtl>
    - <bdi>
    - <dir>
  correctIndex: 2
  explanation: "`<bdi>` (bidirectional isolate) wraps content whose direction is unknown, preventing it from leaking into adjacent text — essential for usernames."
- id: q5
  question: What does `<bdo>` do?
  options:
    - Forces a specific direction on its content
    - Isolates direction
    - Adds a translation
    - Sets the language
  correctIndex: 0
  explanation: '`<bdo dir="rtl">` overrides the bidirectional algorithm and forces the content to render in the specified direction.'
- id: q6
  question: What does `hreflang="x-default"` declare?
  options:
    - The default page when no language/region matches the user
    - The page is broken
    - The XML namespace
    - The CSS language
  correctIndex: 0
  explanation: "`x-default` is the fallback URL Google serves when no hreflang matches the user's language/region settings."
- id: q7
  question: Which element provides pronunciation hints for CJK characters?
  options:
    - <hint>
    - <annot>
    - <cjk>
    - <ruby>
  correctIndex: 3
  explanation: "`<ruby>` adds small annotations above characters (commonly pronunciation in Latin script); `<rt>` holds the annotation text."
- id: q8
  question: Why use CSS logical properties (`margin-inline-start`) instead of `margin-left`?
  options:
    - They are faster
    - They are shorter
    - They flip automatically in RTL layouts
    - They are required for SEO
  correctIndex: 2
  explanation: Logical properties map to physical sides based on `dir`, so `margin-inline-start` is left in LTR and right in RTL — no separate RTL stylesheet needed.
- id: q9
  question: What does `translate="no"` do?
  options:
    - Disables the page
    - Tells translation tools to leave the content untranslated
    - Adds a translation
    - Sets the page language
  correctIndex: 1
  explanation: "`translate=\"no\"` (or `translate=\"yes\"`) signals to Google Translate and other tools whether to translate the element's content, useful for brand names."
- id: q10
  question: Where should the `lang` attribute be set for a page's primary language?
  options:
    - On <body>
    - On <head>
    - On <main>
    - On <html>
  correctIndex: 3
  explanation: Set the primary language on `<html lang="en">` so it applies to the entire document; override per-element when content switches language.
```

