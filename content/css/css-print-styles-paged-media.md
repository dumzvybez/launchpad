---
slug: css-print-styles-paged-media
id: css-18
track: css
order: 18
title: Print Styles and Paged Media
description: Print styles are a forgotten art. Learn `@media print`, page breaks (`break-before/inside/after`), `@page` for margins and size, the `:left/:right` page selectors, print-only headers/footers, and how to ensure content prints cleanly (no nav, expanded details, full URLs in links).
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=1600s
whyItMatters: Print styles are a forgotten art. Learn `@media print`, page breaks (`break-before/inside/after`), `@page` for margins and size, the `:left/:right` page selectors, print-only headers/footers, and how to ensure content prints cleanly (no nav, expanded details, full URLs in links).
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Print Styles and Paged Media

## Print Styles and Paged Media

### Why It Matters

Print styles are a forgotten art. Learn `@media print`, page breaks (`break-before/inside/after`), `@page` for margins and size, the `:left/:right` page selectors, print-only headers/footers, and how to ensure content prints cleanly (no nav, expanded details, full URLs in links).

Print styles are a forgotten art. Learn `@media print`, page breaks (`break-before/inside/after`), `@page` for margins and size, the `:left/:right` page selectors, print-only headers/footers, and how to ensure content prints cleanly (no nav, expanded details, full URLs in links).

### Prerequisites

- Stage 1-17 (especially Stage 8 media queries and Stage 13 pseudo-elements)
- Comfort with the cascade and media queries

### Topics

- `@media print` and `@media screen`
- `@page` for size, margin, and orientation
- `:left`, `:right`, `:first` page pseudo-classes
- Page breaks: `break-before`, `break-inside`, `break-after` (and legacy `page-break-*`)
- `widows` and `orphans` for paragraph line control
- Print-only content via `display: none` on screen and visible in print
- Expanding `<details>` and removing nav/ads/footers for print
- Showing full URLs in links via `::after { content: attr(href) }`
- Color management: `print-color-adjust: exact` for backgrounds

### Key Concepts

- Always provide a print stylesheet; users print articles, invoices, and receipts more than you'd think.
- `@page { size: A4; margin: 2cm; }` sets the physical page; `@page :first` styles the first page only.
- `break-inside: avoid` on cards prevents ugly mid-card splits; `break-before: page` forces a new page before a chapter.
- `widows: 3; orphans: 3;` keeps at least 3 lines at the top/bottom of a page when a paragraph splits.
- Use `display: none` in `@media print` to hide nav, ads, footers, and sidebars; use `print-color-adjust: exact` to preserve background colors (off by default).

```css
@media print {
  /* Hide UI chrome */
  nav, .sidebar, .ads, .footer-nav, .cookie-banner { display: none; }

  /* Expand <details> for print */
  details { display: block; }
  details > summary { list-style: none; }
  details > *:not(summary) { display: block !important; }

  /* Expand main content to full width */
  main { width: 100% !important; margin: 0 !important; }

  /* Black text on white */
  body { background: white; color: black; font-size: 12pt; }

  /* Show full URLs after links */
  a[href^="http://"]::after,
  a[href^="https://"]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: #555;
  }

  /* Avoid breaking inside cards/figures */
  figure, .card, table, tr { break-inside: avoid; }

  /* Force a page break before each H1 */
  h1 { break-before: page; }
  h1:first-of-type { break-before: avoid; }
}
```
Caption: Print stylesheet skeleton

### Common Pitfalls

- Forgetting `@media print` entirely — users print a nav-filled, ad-heavy page; provide a clean print stylesheet.
- Using `page-break-*` instead of `break-*` — the new generic `break-*` properties work for both paged and fragmented contexts (regions, multicol); prefer them.
- Forgetting `print-color-adjust: exact` for branded headers — by default, browsers drop background colors in print to save ink.
- Letting cards break across pages — apply `break-inside: avoid` to figures, cards, and table rows.
- Showing only the link text in print — readers can't follow `click here`; use `::after { content: " (" attr(href) ")"; }` to print full URLs.

### Real-World Applications

- GitHub provides print styles for source code and issue pages so developers can print or PDF-share code reviews.
- Stripe prints invoices with `@page` rules for margins and page numbers in the footer.
- Wikipedia provides clean print styles that hide the sidebar, infobox chrome, and edit links.
- The New York Times prints articles with full URLs and readable serif typography.

### Interview Questions

- 1. What does `@page` let you control? — Physical page size, margins, and margin boxes (header/footer); `:first`, `:left`, `:right` pseudo-classes target specific page types.
- 2. What is the difference between `break-inside` and `page-break-inside`? — `break-inside` is the generic property for both paged and fragmented contexts; `page-break-inside` is the legacy print-specific form.
- 3. What do `widows` and `orphans` control? — `widows` is the minimum lines left at the top of a page; `orphans` is the minimum lines left at the bottom; both prevent ugly single-line splits.
- 4. Why are background colors dropped in print by default, and how do you preserve them? — Browsers drop backgrounds to save ink; use `print-color-adjust: exact` to preserve them.
- 5. How do you print the full URL after each link? — `a[href^="http"]::after { content: " (" attr(href) ")"; }` inside `@media print`.

### Mini Project

Build a Print Stylesheet for a Blog Article: Take a blog article page and write a print stylesheet that hides nav/sidebar/ads, expands `<details>`, shows full URLs after links, forces a page break before each `<h2>`, and adds page numbers in the footer. Suggested approach:
  - Use `@media print { nav, .sidebar, .ads { display: none; } }`
  - Expand `<details>` with `details > summary { list-style: none; } details > * { display: block !important; }`
  - Add `a[href^="http"]::after { content: " (" attr(href) ")"; }`
  - Add `h2 { break-before: page; }` and `figure, table { break-inside: avoid; }`
  - Use `@page { @bottom-right { content: "Page " counter(page); } }`

### Exercises

1. Open a blog in your browser, print to PDF without a print stylesheet, then add one and compare.
2. Use `@page :first` to add a larger top margin on the first printed page.
3. Apply `break-inside: avoid` to figures and tables, and verify they no longer split mid-card.
4. Use `widows: 3; orphans: 3;` on paragraphs and verify no single-line page splits.
5. Add `print-color-adjust: exact` to a branded header and confirm the background prints.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which at-rule controls physical page size and margins for printing?
9. A) `@media print`
10. B) `@page` (*)
11. C) `@print`
12. D) `@document`
13. Explanation: `@page { size: A4; margin: 2cm; }` controls the physical page; `:first`, `:left`, `:right` pseudo-classes target specific page types.
14. Q2: Which property is the modern, generic version of `page-break-inside`?
15. A) `split-inside`
16. B) `fragment-inside`
17. C) `break-inside` (*)
18. D) `page-split`
19. Explanation: `break-*` properties are generic for both paged and fragmented contexts (regions, multicol); `page-break-*` is the legacy print-specific form.
20. Q3: Which property prevents a card from splitting across two pages?
21. A) `break-inside: avoid` (*)
22. B) `break-before: avoid`
23. C) `break-after: avoid`
24. D) `page-break: none`
25. Explanation: `break-inside: avoid` prevents the element from splitting; use it on figures, cards, and table rows.
26. Q4: Which property sets the minimum number of lines left at the bottom of a page when a paragraph splits?
27. A) `widows`
28. B) `orphans` (*)
29. C) `lines-bottom`
30. D) `break-orphans`
31. Explanation: `orphans` is the minimum lines at the bottom of a page; `widows` is the minimum at the top of the next page.
32. Q5: How do you print the full URL after each link?
33. A) `a::after { content: url(href); }`
34. B) `a { print-href: true; }`
35. C) `a[href^="http"]::after { content: " (" attr(href) ")"; }` (*)
36. D) `a::after { href: attr(href); }`
37. Explanation: Use `attr(href)` in `content` to insert the link's URL after the link text, scoped to http(s) links.
38. Q6: Why are background colors dropped by default in print?
39. A) Printers cannot render colors
40. B) It is a spec requirement
41. C) Browsers cannot compute them
42. D) To save ink (*)
43. Explanation: Browsers drop background colors by default to save ink; use `print-color-adjust: exact` to preserve them.
44. Q7: Which pseudo-class targets the first printed page only?
45. A) `@page :first` (*)
46. B) `@page :first-child`
47. C) `@page :nth(1)`
48. D) `@page :start`
49. Explanation: `@page :first` styles only the first page; useful for a larger top margin or different header.
50. Q8: Which property preserves background colors in print?
51. A) `background-print: keep`
52. B) `print-color-adjust: exact` (*)
53. C) `force-color: yes`
54. D) `ink-saver: off`
55. Explanation: `print-color-adjust: exact` (and the `-webkit-` prefixed variant) tells the browser to preserve background colors and images.
56. Q9: Which `@page` margin box adds page numbers at the bottom-right?
57. A) `@page { footer: counter(page); }`
58. B) `@page { bottom-right: "Page " page; }`
59. C) `@page { @bottom-right { content: counter(page); } }` (*)
60. D) `@page { @footer-right { counter(page); } }`
61. Explanation: `@bottom-right` is one of the 16 margin boxes; `counter(page)` and `counter(pages)` give current and total page numbers.
62. Q10: Which common print practice hides UI chrome like nav and ads?
63. A) `nav { visibility: hidden; }` everywhere
64. B) `nav { opacity: 0; }` everywhere
65. C) `nav { print: hide; }`
66. D) `nav { display: none; }` inside `@media print` (*)
67. Explanation: Use `display: none` inside `@media print` for nav, sidebars, ads, and footers so they don't appear in the printed output.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which at-rule controls physical page size and margins for printing?
  options:
    - "`@media print`"
    - "`@page`"
    - "`@print`"
    - "`@document`"
  correctIndex: 1
  explanation: "`@page { size: A4; margin: 2cm; }` controls the physical page; `:first`, `:left`, `:right` pseudo-classes target specific page types."
- id: q2
  question: Which property is the modern, generic version of `page-break-inside`?
  options:
    - "`split-inside`"
    - "`fragment-inside`"
    - "`break-inside`"
    - "`page-split`"
  correctIndex: 2
  explanation: "`break-*` properties are generic for both paged and fragmented contexts (regions, multicol); `page-break-*` is the legacy print-specific form."
- id: q3
  question: Which property prevents a card from splitting across two pages?
  options:
    - "`break-inside: avoid`"
    - "`break-before: avoid`"
    - "`break-after: avoid`"
    - "`page-break: none`"
  correctIndex: 0
  explanation: "`break-inside: avoid` prevents the element from splitting; use it on figures, cards, and table rows."
- id: q4
  question: Which property sets the minimum number of lines left at the bottom of a page when a paragraph splits?
  options:
    - "`widows`"
    - "`orphans`"
    - "`lines-bottom`"
    - "`break-orphans`"
  correctIndex: 1
  explanation: "`orphans` is the minimum lines at the bottom of a page; `widows` is the minimum at the top of the next page."
- id: q5
  question: How do you print the full URL after each link?
  options:
    - "`a::after { content: url(href); }`"
    - "`a { print-href: true; }`"
    - '`a[href^="http"]::after { content: " (" attr(href) ")"; }`'
    - "`a::after { href: attr(href); }`"
  correctIndex: 2
  explanation: Use `attr(href)` in `content` to insert the link's URL after the link text, scoped to http(s) links.
- id: q6
  question: Why are background colors dropped by default in print?
  options:
    - Printers cannot render colors
    - It is a spec requirement
    - Browsers cannot compute them
    - To save ink
  correctIndex: 3
  explanation: "Browsers drop background colors by default to save ink; use `print-color-adjust: exact` to preserve them."
- id: q7
  question: Which pseudo-class targets the first printed page only?
  options:
    - "`@page :first`"
    - "`@page :first-child`"
    - "`@page :nth(1)`"
    - "`@page :start`"
  correctIndex: 0
  explanation: "`@page :first` styles only the first page; useful for a larger top margin or different header."
- id: q8
  question: Which property preserves background colors in print?
  options:
    - "`background-print: keep`"
    - "`print-color-adjust: exact`"
    - "`force-color: yes`"
    - "`ink-saver: off`"
  correctIndex: 1
  explanation: "`print-color-adjust: exact` (and the `-webkit-` prefixed variant) tells the browser to preserve background colors and images."
- id: q9
  question: Which `@page` margin box adds page numbers at the bottom-right?
  options:
    - "`@page { footer: counter(page); }`"
    - '`@page { bottom-right: "Page " page; }`'
    - "`@page { @bottom-right { content: counter(page); } }`"
    - "`@page { @footer-right { counter(page); } }`"
  correctIndex: 2
  explanation: "`@bottom-right` is one of the 16 margin boxes; `counter(page)` and `counter(pages)` give current and total page numbers."
- id: q10
  question: Which common print practice hides UI chrome like nav and ads?
  options:
    - "`nav { visibility: hidden; }` everywhere"
    - "`nav { opacity: 0; }` everywhere"
    - "`nav { print: hide; }`"
    - "`nav { display: none; }` inside `@media print`"
  correctIndex: 3
  explanation: "Use `display: none` inside `@media print` for nav, sidebars, ads, and footers so they don't appear in the printed output."
```

