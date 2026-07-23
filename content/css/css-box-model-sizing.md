---
slug: css-box-model-sizing
id: css-03
track: css
order: 3
title: The Box Model and Sizing
description: Every element is a box made of content, padding, border, and margin. Learn how `box-sizing` changes the math, why margins collapse, and how to size elements with `rem`, `em`, `%`, `vw`, and `dvh`.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=500s
whyItMatters: Every element is a box made of content, padding, border, and margin. Learn how `box-sizing` changes the math, why margins collapse, and how to size elements with `rem`, `em`, `%`, `vw`, and `dvh`.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# The Box Model and Sizing

## The Box Model and Sizing

### Why It Matters

Every element is a box made of content, padding, border, and margin. Learn how `box-sizing` changes the math, why margins collapse, and how to size elements with `rem`, `em`, `%`, `vw`, and `dvh`.

Every element is a box made of content, padding, border, and margin. Learn how `box-sizing` changes the math, why margins collapse, and how to size elements with `rem`, `em`, `%`, `vw`, and `dvh`.

### Prerequisites

- Stage 1: Getting Started with CSS
- Stage 2: Selectors and Specificity

### Topics

- The four boxes: content, padding, border, margin
- `box-sizing: content-box` (default) vs `border-box` (recommended)
- The universal box-sizing reset
- Margins: vertical collapse between siblings, no collapse on flex/grid children
- Length units: px, em, rem, %, vw, vh, dvh, dvi, ch, ex
- min-content, max-content, fit-content
- `width`/`height` vs `min-width`/`max-width`
- Why `100vh` causes mobile address-bar jump and `dvh` fixes it

### Key Concepts

- With content-box (default), `width: 200px; padding: 20px;` makes the element 240px wide; with border-box it stays 200px.
- Vertical margins collapse between adjacent block elements (the larger wins, they do not add).
- Flex and grid containers prevent margin collapse between their children.
- `rem` is rooted at the root font-size; `em` is rooted at the element's own font-size.
- `100vh` on mobile Safari includes the address bar; `100dvh` tracks the dynamic viewport so content is not hidden.

```css
/* Apply to everything, including ::before and ::after. */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```
Caption: Universal box-sizing reset

### Common Pitfalls

- Forgetting `box-sizing: border-box` — your 200px-wide card with 20px padding becomes 244px wide; always reset globally.
- Using `100vh` for full-height mobile layouts — the address bar overlaps content; use `100dvh` (or `100svh` for small viewport).
- Expecting margins to add up between stacked block elements — they collapse; use `gap` in a flex/grid container or padding instead.
- Mixing `em` units throughout without realizing they compound — `em` is relative to the element's own font-size, so nested ems multiply.
- Setting `width: 100%` plus `padding` without `box-sizing: border-box` — total width exceeds 100%, causing horizontal scroll.

### Real-World Applications

- Stripe applies a global `box-sizing: border-box` reset so every component's width includes padding and border.
- Linear uses `gap` in flex containers to space items without worrying about margin collapse or extra trailing margin.
- Vercel's dashboard uses `dvh` for full-viewport command palette overlays so mobile users never have content hidden by the URL bar.
- GitHub uses `min(100%, 80ch)` for article prose so lines stay readable on large screens but fluid on small ones.

### Interview Questions

- 1. What is the difference between content-box and border-box? — In content-box (default), width excludes padding/border; in border-box, width includes them.
- 2. Why do adjacent vertical margins collapse and how do you prevent it? — Block-level siblings' vertical margins collapse to the larger; flex/grid containers prevent collapse, as do padding, borders, or `overflow: hidden` on parents.
- 3. What is the difference between `rem` and `em`? — `rem` is relative to the root font-size; `em` is relative to the element's own (or inherited) font-size.
- 4. Why is `100vh` problematic on mobile and what is the fix? — `100vh` includes the area hidden by the address bar; use `100dvh` (dynamic viewport height).
- 5. Why prefer unitless `line-height: 1.5` over `line-height: 1.5em`? — Unitless line-height inherits as a multiplier of the child's font-size; em-based values are computed once at the parent and inherit as a fixed length.

### Mini Project

Build a Pricing Cards Row: Three pricing cards in a row using flexbox, each with a header, feature list, and CTA button. Demonstrates box-sizing, padding, border, margin, and `gap` without margin collapse. Suggested approach:
  - Apply the universal box-sizing reset
  - Use a flex container with `gap: 1.5rem` to avoid margin collapse math
  - Give each card `padding: 1.5rem` and a `border: 1px solid #e5e7eb`
  - Use `min-width: 0` on cards so long text does not break the flex layout
  - Highlight one card with a colored border and slightly larger scale via `transform: scale(1.02)`

### Exercises

1. Add `box-sizing: border-box` to a stylesheet and observe which layouts change.
2. Build two stacked paragraphs with `margin-top: 30px` and `margin-bottom: 20px`; measure the actual gap and explain.
3. Convert a layout that uses `100vh` to `100dvh` and test on a mobile viewport in DevTools.
4. Use `min()`, `max()`, and `clamp()` to size a heading that is fluid between 1.5rem and 3rem.
5. Create a 2-column layout where the sidebar is `20ch` and the main is `1fr`, and observe how `ch` adapts to font-size.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: With `box-sizing: content-box` and `width: 200px; padding: 20px; border: 2px solid;`, what is the total rendered width?
9. A) 200px
10. B) 240px
11. C) 244px (*)
12. D) 220px
13. Explanation: content-box adds padding (40px) and border (4px) on top of the 200px content width = 244px.
14. Q2: Which snippet is the recommended universal box-sizing reset?
15. A) html { box-sizing: border-box; }
16. B) body { box-sizing: border-box; }
17. C) div { box-sizing: border-box; }
18. D) *, *::before, *::after { box-sizing: border-box; } (*)
19. Explanation: Apply border-box to every element and pseudo-element so padding/border never push total width past the set value.
20. Q3: Two adjacent block elements with `margin-bottom: 30px` and `margin-top: 20px` produce a gap of:
21. A) 30px (*)
22. B) 50px
23. C) 20px
24. D) 25px
25. Explanation: Vertical margins between block siblings collapse to the larger value (30px), they do not add.
26. Q4: Which container property prevents margin collapse between children?
27. A) `display: block`
28. B) `display: flex` or `display: grid` (*)
29. C) `position: static`
30. D) `overflow: visible`
31. Explanation: Flex and grid containers establish a new block formatting context that prevents child margins from collapsing.
32. Q5: Which unit is rooted at the root element's font-size?
33. A) em
34. B) px
35. C) rem (*)
36. D) ch
37. Explanation: `rem` (root em) is always relative to the root element's font-size, regardless of nesting.
38. Q6: Which unit best fits a full-viewport hero on mobile without the address bar covering content?
39. A) 100vh
40. B) 100%
41. C) 1000px
42. D) 100dvh (*)
43. Explanation: `100dvh` (dynamic viewport height) tracks the visible area as the address bar shows/hides on mobile browsers.
44. Q7: Why is unitless `line-height: 1.5` preferred over `line-height: 1.5em`?
45. A) Each child recomputes against its own font-size (*)
46. B) It is shorter
47. C) em is deprecated
48. D) It avoids repaints
49. Explanation: A unitless line-height is inherited as a multiplier and recomputed per child; em-based is computed once and inherited as a fixed length.
50. Q8: What does `width: min(100%, 60ch)` do?
51. A) Sets width to 60% of the parent
52. B) Allows fluid width but caps at 60 characters wide (*)
53. C) Caps width at 60ch but allows shrink to 100% on small screens
54. D) Makes the element exactly 60ch wide
55. Explanation: `min()` picks the smaller value, so the element is at most 60ch but can shrink to fit smaller containers.
56. Q9: Why does `width: 100%; padding: 20px;` cause horizontal scroll without border-box?
57. A) Padding is not rendered
58. B) The browser ignores width
59. C) Padding pushes width past 100% (*)
60. D) It does not cause scroll
61. Explanation: With content-box, the total width becomes 100% + 40px, exceeding the parent and causing horizontal scroll.
62. Q10: Which property best replaces the need for negative margins to space flex children?
63. A) `padding`
64. B) `border`
65. C) `outline`
66. D) `gap` (*)
67. Explanation: `gap` adds space between flex/grid items uniformly without margin collapse or trailing margin issues.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "With `box-sizing: content-box` and `width: 200px; padding: 20px; border: 2px solid;`, what is the total rendered width?"
  options:
    - 200px
    - 240px
    - 244px
    - 220px
  correctIndex: 2
  explanation: content-box adds padding (40px) and border (4px) on top of the 200px content width = 244px.
- id: q2
  question: Which snippet is the recommended universal box-sizing reset?
  options:
    - "html { box-sizing: border-box; }"
    - "body { box-sizing: border-box; }"
    - "div { box-sizing: border-box; }"
    - "*, *::before, *::after { box-sizing: border-box; }"
  correctIndex: 3
  explanation: Apply border-box to every element and pseudo-element so padding/border never push total width past the set value.
- id: q3
  question: "Two adjacent block elements with `margin-bottom: 30px` and `margin-top: 20px` produce a gap of:"
  options:
    - 30px
    - 50px
    - 20px
    - 25px
  correctIndex: 0
  explanation: Vertical margins between block siblings collapse to the larger value (30px), they do not add.
- id: q4
  question: Which container property prevents margin collapse between children?
  options:
    - "`display: block`"
    - "`display: flex` or `display: grid`"
    - "`position: static`"
    - "`overflow: visible`"
  correctIndex: 1
  explanation: Flex and grid containers establish a new block formatting context that prevents child margins from collapsing.
- id: q5
  question: Which unit is rooted at the root element's font-size?
  options:
    - em
    - px
    - rem
    - ch
  correctIndex: 2
  explanation: "`rem` (root em) is always relative to the root element's font-size, regardless of nesting."
- id: q6
  question: Which unit best fits a full-viewport hero on mobile without the address bar covering content?
  options:
    - 100vh
    - 100%
    - 1000px
    - 100dvh
  correctIndex: 3
  explanation: "`100dvh` (dynamic viewport height) tracks the visible area as the address bar shows/hides on mobile browsers."
- id: q7
  question: "Why is unitless `line-height: 1.5` preferred over `line-height: 1.5em`?"
  options:
    - Each child recomputes against its own font-size
    - It is shorter
    - em is deprecated
    - It avoids repaints
  correctIndex: 0
  explanation: A unitless line-height is inherited as a multiplier and recomputed per child; em-based is computed once and inherited as a fixed length.
- id: q8
  question: "What does `width: min(100%, 60ch)` do?"
  options:
    - Sets width to 60% of the parent
    - Allows fluid width but caps at 60 characters wide
    - Caps width at 60ch but allows shrink to 100% on small screens
    - Makes the element exactly 60ch wide
  correctIndex: 1
  explanation: "`min()` picks the smaller value, so the element is at most 60ch but can shrink to fit smaller containers."
- id: q9
  question: "Why does `width: 100%; padding: 20px;` cause horizontal scroll without border-box?"
  options:
    - Padding is not rendered
    - The browser ignores width
    - Padding pushes width past 100%
    - It does not cause scroll
  correctIndex: 2
  explanation: With content-box, the total width becomes 100% + 40px, exceeding the parent and causing horizontal scroll.
- id: q10
  question: Which property best replaces the need for negative margins to space flex children?
  options:
    - "`padding`"
    - "`border`"
    - "`outline`"
    - "`gap`"
  correctIndex: 3
  explanation: "`gap` adds space between flex/grid items uniformly without margin collapse or trailing margin issues."
```

