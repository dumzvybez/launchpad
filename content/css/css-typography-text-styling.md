---
slug: css-typography-text-styling
id: css-05
track: css
order: 5
title: Typography and Text Styling
description: "Style type for readability and hierarchy: font-family stacks, system fonts, variable fonts, `font-size` strategies, `line-height`, letter-spacing, text alignment, wrapping, truncation, and OpenType features."
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=1000s
whyItMatters: "Style type for readability and hierarchy: font-family stacks, system fonts, variable fonts, `font-size` strategies, `line-height`, letter-spacing, text alignment, wrapping, truncation, and OpenType features."
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Typography and Text Styling

## Typography and Text Styling

### Why It Matters

Style type for readability and hierarchy: font-family stacks, system fonts, variable fonts, `font-size` strategies, `line-height`, letter-spacing, text alignment, wrapping, truncation, and OpenType features.

Style type for readability and hierarchy: font-family stacks, system fonts, variable fonts, `font-size` strategies, `line-height`, letter-spacing, text alignment, wrapping, truncation, and OpenType features.

### Prerequisites

- Stage 1: Getting Started with CSS
- Stage 2: Selectors and Specificity
- Stage 3: The Box Model and Sizing
- Stage 4: Colors, Backgrounds, and Gradients

### Topics

- Font stacks and the `font-family` property
- System font stack vs web fonts (`@font-face`, `@import`)
- Variable fonts with `font-variation-settings` and named axes
- `font-size` units (rem, em, %, clamp)
- `line-height` (unitless recommended)
- `letter-spacing`, `word-spacing`, `text-transform`
- `text-align`, `text-justify`, `text-wrap: balance` and `pretty`
- Truncation with `text-overflow: ellipsis`, line clamping with `-webkit-line-clamp`
- OpenType features: `font-feature-settings`, ligatures, tabular numbers

### Key Concepts

- A font stack should always end in a generic family (`sans-serif`, `serif`, `monospace`) so the page renders even if every named font fails.
- Variable fonts expose one or more axes (weight, width, slant, optical size) and reduce payload vs shipping multiple static fonts.
- Unitless `line-height: 1.5` is the recommended form because it is recomputed per child, not fixed at the parent.
- `text-wrap: balance` evens out line breaks in headings; `text-wrap: pretty` prevents orphans in paragraphs.
- `font-variant-numeric: tabular-nums` makes digits monospaced so tables and counters don't jitter.

```css
body {
  font-family:
    system-ui,                             /* macOS / iOS / Windows 11 */
    -apple-system, "Segoe UI", Roboto,     /* Apple, Windows, Android   */
    "Helvetica Neue", Arial,               /* fallbacks                  */
    sans-serif;                            /* generic                    */
}

code, pre, kbd {
  font-family: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono",
               "Fira Code", Menlo, Consolas, monospace;
}
```
Caption: System font stack

### Common Pitfalls

- Hardcoding `font-family: Helvetica` with no fallback — users without Helvetica see the default serif; always end with a generic family.
- Setting `line-height` in px or em — use unitless so each child recomputes against its own font-size.
- Using `text-overflow: ellipsis` without `white-space: nowrap; overflow: hidden` — all three are required for the ellipsis to appear.
- Loading 6 static font weights instead of one variable font — variable fonts cut payload and unlock any weight on the axis.
- Forgetting `font-display: swap` — without it, the page is invisible text while the web font loads; swap shows fallback text immediately.

### Real-World Applications

- Vercel and Linear use Inter (variable) loaded via `@font-face` with `font-display: swap` so text renders instantly with a system fallback.
- Stripe uses tabular numbers in pricing tables so the dollar signs and digits line up across rows.
- GitHub uses `font-variant-numeric: tabular-nums` in commit-count columns and line numbers to prevent width jitter.
- Apple uses San Francisco (system-ui) on its site to render at native performance with zero font download.

### Interview Questions

- 1. Why does a font stack end with a generic family? — So the page still renders readable text if every named font fails to load.
- 2. What is a variable font and what are its advantages? — A single font file exposing axes (weight, width, etc.); fewer requests, any value on the axis, smaller payload than multiple static fonts.
- 3. Why is unitless `line-height` preferred? — It is inherited as a multiplier and recomputed per child, avoiding compounding.
- 4. What three properties are required for single-line text truncation? — `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`.
- 5. What does `font-variant-numeric: tabular-nums` do and when would you use it? — Makes digits equal-width; use in tables, prices, counters, and clocks to prevent jitter.

### Mini Project

Build a Blog Article Typography Stylesheet: A stylesheet for a long-form article (h1, h2, h3, p, blockquote, code, ul, ol, table). Demonstrates fluid font sizing, line-height, text-wrap, tabular numerals, and truncation in the metadata row. Suggested approach:
  - Use `clamp()` for h1 and h2 so headings scale fluidly from mobile to desktop
  - Set `line-height: 1.6` on paragraphs and `1.2` on headings
  - Use `text-wrap: pretty` on paragraphs to avoid orphans
  - Apply `tabular-nums` to the article date and reading-time line
  - Truncate the article URL display with ellipsis

### Exercises

1. Write a system-font stack and a separate monospace stack; verify both render on macOS, Windows, and Linux.
2. Load a variable font via `@font-face` and use `font-variation-settings` to render three weights from one file.
3. Use `text-wrap: balance` on a long h2 and compare line breaks before and after.
4. Apply `tabular-nums` to a column of numbers in a table; observe digit alignment.
5. Implement a 3-line clamp on a card description and confirm the ellipsis appears after the third line.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why should every font stack end with a generic family like `sans-serif`?
9. A) So the page still renders readable text if named fonts are missing (*)
10. B) It is required by the spec
11. C) To improve performance
12. D) Generic families are deprecated
13. Explanation: A generic family guarantees the browser falls back to a usable font if every named font is unavailable.
14. Q2: Which `line-height` value is recommended and why?
15. A) `1.5em` — fixed
16. B) `1.5` (unitless) — recomputed per child (*)
17. C) `24px` — predictable
18. D) `150%` — same as 1.5
19. Explanation: Unitless line-height is inherited as a multiplier and recomputed for each child's font-size, avoiding compounding.
20. Q3: Which three properties together produce a single-line ellipsis?
21. A) `text-overflow`, `overflow`, `white-space: nowrap` (*)
22. B) `text-overflow`, `display: flex`, `white-space: pre`
23. C) `overflow`, `clip`, `white-space: normal`
24. D) `text-overflow`, `text-wrap`, `white-space: pre-wrap`
25. Explanation: All three are required: nowrap prevents wrapping, overflow hides, text-overflow shows the ellipsis.
26. Q4: What does `font-display: swap` do?
27. A) Hides text until the font loads
28. B) Shows fallback text immediately, then swaps to the web font when ready (*)
29. C) Disables web fonts
30. D) Only shows the web font on slow connections
31. Explanation: `swap` renders text in a fallback face immediately and replaces it with the web font once loaded, avoiding invisible text.
32. Q5: Which property evens out line breaks in headings so the last line is not much shorter?
33. A) `text-align: justify`
34. B) `word-break: break-all`
35. C) `text-wrap: balance` (*)
36. D) `letter-spacing: 0`
37. Explanation: `text-wrap: balance` distributes text more evenly across lines, preventing the last line from being very short.
38. Q6: What does `font-variant-numeric: tabular-nums` do?
39. A) Adds thousands separators
40. B) Converts numbers to uppercase
41. C) Disables digits entirely
42. D) Makes digits equal-width so columns align (*)
43. Explanation: Tabular figures use fixed widths per digit so that columns of numbers stay aligned vertically.
44. Q7: Which value of `font-variation-settings` sets a variable font's weight to 700?
45. A) `"wght" 700` (*)
46. B) `"weight" 700`
47. C) `weight=700`
48. D) `font-weight: variation(700)`
49. Explanation: Variable font axes use four-letter tags; the weight axis is `"wght"`.
50. Q8: Which unit makes a heading fluid between 2rem and 4rem based on viewport width?
51. A) `font-size: 3rem`
52. B) `font-size: clamp(2rem, 5vw, 4rem)` (*)
53. C) `font-size: vw(5)`
54. D) `font-size: 5vw`
55. Explanation: `clamp(min, preferred, max)` lets the size scale with the viewport but never below the min or above the max.
56. Q9: Which CSS property controls the optical alignment of digits in OpenType fonts?
57. A) `font-smooth`
58. B) `font-stretch`
59. C) `font-feature-settings` (*)
60. D) `font-display`
61. Explanation: `font-feature-settings` toggles OpenType features like `"tnum"` (tabular numbers) and ligatures.
62. Q10: Why prefer a single variable font over six static weights?
63. A) Variable fonts are required by WCAG
64. B) Static fonts are deprecated
65. C) Variable fonts render sharper
66. D) One file covers the whole weight axis with a smaller total payload (*)
67. Explanation: A variable font exposes the entire weight range from one file, reducing requests and bytes versus shipping multiple static weights.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why should every font stack end with a generic family like `sans-serif`?
  options:
    - So the page still renders readable text if named fonts are missing
    - It is required by the spec
    - To improve performance
    - Generic families are deprecated
  correctIndex: 0
  explanation: A generic family guarantees the browser falls back to a usable font if every named font is unavailable.
- id: q2
  question: Which `line-height` value is recommended and why?
  options:
    - "`1.5em` — fixed"
    - "`1.5` (unitless) — recomputed per child"
    - "`24px` — predictable"
    - "`150%` — same as 1.5"
  correctIndex: 1
  explanation: Unitless line-height is inherited as a multiplier and recomputed for each child's font-size, avoiding compounding.
- id: q3
  question: Which three properties together produce a single-line ellipsis?
  options:
    - "`text-overflow`, `overflow`, `white-space: nowrap`"
    - "`text-overflow`, `display: flex`, `white-space: pre`"
    - "`overflow`, `clip`, `white-space: normal`"
    - "`text-overflow`, `text-wrap`, `white-space: pre-wrap`"
  correctIndex: 0
  explanation: "All three are required: nowrap prevents wrapping, overflow hides, text-overflow shows the ellipsis."
- id: q4
  question: "What does `font-display: swap` do?"
  options:
    - Hides text until the font loads
    - Shows fallback text immediately, then swaps to the web font when ready
    - Disables web fonts
    - Only shows the web font on slow connections
  correctIndex: 1
  explanation: "`swap` renders text in a fallback face immediately and replaces it with the web font once loaded, avoiding invisible text."
- id: q5
  question: Which property evens out line breaks in headings so the last line is not much shorter?
  options:
    - "`text-align: justify`"
    - "`word-break: break-all`"
    - "`text-wrap: balance`"
    - "`letter-spacing: 0`"
  correctIndex: 2
  explanation: "`text-wrap: balance` distributes text more evenly across lines, preventing the last line from being very short."
- id: q6
  question: "What does `font-variant-numeric: tabular-nums` do?"
  options:
    - Adds thousands separators
    - Converts numbers to uppercase
    - Disables digits entirely
    - Makes digits equal-width so columns align
  correctIndex: 3
  explanation: Tabular figures use fixed widths per digit so that columns of numbers stay aligned vertically.
- id: q7
  question: Which value of `font-variation-settings` sets a variable font's weight to 700?
  options:
    - '`"wght" 700`'
    - '`"weight" 700`'
    - "`weight=700`"
    - "`font-weight: variation(700)`"
  correctIndex: 0
  explanation: Variable font axes use four-letter tags; the weight axis is `"wght"`.
- id: q8
  question: Which unit makes a heading fluid between 2rem and 4rem based on viewport width?
  options:
    - "`font-size: 3rem`"
    - "`font-size: clamp(2rem, 5vw, 4rem)`"
    - "`font-size: vw(5)`"
    - "`font-size: 5vw`"
  correctIndex: 1
  explanation: "`clamp(min, preferred, max)` lets the size scale with the viewport but never below the min or above the max."
- id: q9
  question: Which CSS property controls the optical alignment of digits in OpenType fonts?
  options:
    - "`font-smooth`"
    - "`font-stretch`"
    - "`font-feature-settings`"
    - "`font-display`"
  correctIndex: 2
  explanation: '`font-feature-settings` toggles OpenType features like `"tnum"` (tabular numbers) and ligatures.'
- id: q10
  question: Why prefer a single variable font over six static weights?
  options:
    - Variable fonts are required by WCAG
    - Static fonts are deprecated
    - Variable fonts render sharper
    - One file covers the whole weight axis with a smaller total payload
  correctIndex: 3
  explanation: A variable font exposes the entire weight range from one file, reducing requests and bytes versus shipping multiple static weights.
```

