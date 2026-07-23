---
slug: css-css-grid-2d-layouts
id: css-07
track: css
order: 7
title: CSS Grid — 2D Layouts
description: CSS Grid is the purpose-built tool for two-dimensional layouts. Learn explicit and implicit grids, `grid-template-columns/rows`, the `fr` unit, `minmax`, `auto-fit`/`auto-fill`, line-based placement, grid areas, and `subgrid`.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=1500s
whyItMatters: CSS Grid is the purpose-built tool for two-dimensional layouts. Learn explicit and implicit grids, `grid-template-columns/rows`, the `fr` unit, `minmax`, `auto-fit`/`auto-fill`, line-based placement, grid areas, and `subgrid`.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# CSS Grid — 2D Layouts

## CSS Grid — 2D Layouts

### Why It Matters

CSS Grid is the purpose-built tool for two-dimensional layouts. Learn explicit and implicit grids, `grid-template-columns/rows`, the `fr` unit, `minmax`, `auto-fit`/`auto-fill`, line-based placement, grid areas, and `subgrid`.

CSS Grid is the purpose-built tool for two-dimensional layouts. Learn explicit and implicit grids, `grid-template-columns/rows`, the `fr` unit, `minmax`, `auto-fit`/`auto-fill`, line-based placement, grid areas, and `subgrid`.

### Prerequisites

- Stage 1: Getting Started with CSS
- Stage 2: Selectors and Specificity
- Stage 3: The Box Model and Sizing
- Stage 6: Layout — Floats, Positioning, Flexbox

### Topics

- `display: grid` and `display: inline-grid`
- `grid-template-columns`, `grid-template-rows`, and the `fr` unit
- `minmax()`, `repeat()`, `auto-fit`, `auto-fill`
- Implicit tracks via `grid-auto-rows` / `grid-auto-columns` and `grid-auto-flow`
- Line-based placement: `grid-column`, `grid-row`, span syntax
- Named grid lines and `grid-template-areas`
- `align-items`, `justify-items`, `align-content`, `justify-content`
- `subgrid` for nested grids that align to parent tracks
- When to use Grid vs Flexbox

### Key Concepts

- Grid is 2D: control rows AND columns simultaneously. Flexbox is 1D.
- `1fr` is a fraction of the *remaining* space after fixed-size tracks are accounted for.
- `auto-fit` collapses empty tracks; `auto-fill` keeps them. Use auto-fit for "as many as fit" responsive grids.
- `minmax(20rem, 1fr)` lets a track be fluid but never smaller than 20rem or larger than 1fr share.
- `subgrid` lets a child grid inherit the parent's tracks so nested items align perfectly.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
}
/* As many 18rem-min columns as fit; wider columns fill remaining space. */
```
Caption: Auto-fit responsive grid

### Common Pitfalls

- Confusing `auto-fit` and `auto-fill` — auto-fit collapses empty tracks so items stretch to fill; auto-fill keeps empty tracks, leaving gaps.
- Using `1fr` and expecting equal-width columns when content sizes differ — `1fr` is a share of *remaining* space; cap with `minmax(0, 1fr)` to allow shrinking below content size.
- Forgetting that `gap` works on both flex and grid — replace ad-hoc margins with `gap`.
- Setting `grid-row: 1 / 4` thinking it spans 4 rows — line 1 to line 4 is 3 tracks (1->2, 2->3, 3->4).
- Assuming `subgrid` is universally supported — it shipped in all major engines by 2023, but check your browser support matrix and provide a fallback for older browsers.

### Real-World Applications

- GitHub uses Grid for the repository file browser (icon, name, last commit, time) with line-based placement.
- Vercel's dashboard uses Grid for the project card grid with `auto-fit` and `minmax`.
- Linear uses Grid for issue detail headers (key, title, status, assignee).
- Stripe Docs uses `grid-template-areas` to lay out content, side nav, and table of contents consistently across every page.

### Interview Questions

- 1. When would you choose Grid over Flexbox? — Use Grid when you need to control both rows and columns (2D); Flexbox for a single axis (1D) like a navbar or stack.
- 2. What does `1fr` represent? — One fraction of the remaining space after fixed tracks are allocated; it is not a fixed ratio of the container width.
- 3. What is the difference between `auto-fit` and `auto-fill`? — Both repeat tracks, but auto-fit collapses empty tracks so existing items stretch; auto-fill keeps empty tracks as gaps.
- 4. Why use `minmax(0, 1fr)` instead of `1fr`? — `1fr` is `minmax(auto, 1fr)` so intrinsic content can prevent shrinking below its size; `minmax(0, 1fr)` allows shrinking to 0.
- 5. What is `subgrid` and what problem does it solve? — A nested grid that inherits the parent's track definitions, allowing grandchildren across different children to align.

### Mini Project

Build a Responsive Photo Gallery: A gallery that shows as many 200px-wide columns as fit on the screen, with a featured image that spans 2 columns and 2 rows. Demonstrates auto-fit, minmax, line-based placement, and gap. Suggested approach:
  - Use `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
  - Add `gap: 0.5rem` for spacing
  - Mark the first item `.featured` and set `grid-column: span 2; grid-row: span 2;`
  - Use `object-fit: cover; aspect-ratio: 1;` on images for uniform sizing
  - Test on mobile, tablet, and desktop widths

### Exercises

1. Build the ASCII-art grid template for a classic dashboard layout (header, sidebar, main, footer).
2. Replace `1fr` with `minmax(0, 1fr)` on a grid with long content and observe the fix.
3. Use `subgrid` to align three card children (title, body, footer) across multiple cards.
4. Demonstrate the difference between `auto-fit` and `auto-fill` by toggling between them with 4 items in a wide container.
5. Build a 12-column grid system using `grid-template-columns: repeat(12, 1fr)` and place items with `grid-column: span N`.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which CSS layout tool is best suited to 2D layouts (rows AND columns)?
9. A) Flexbox
10. B) Floats
11. C) CSS Grid (*)
12. D) position: absolute
13. Explanation: Grid is purpose-built for two-dimensional layouts; Flexbox is one-dimensional.
14. Q2: What does `1fr` represent in a grid template?
15. A) 1% of the container width
16. B) 1 pixel
17. C) The first track
18. D) One fraction of the remaining free space after fixed tracks (*)
19. Explanation: `fr` units share the leftover space after fixed-size tracks are placed; they are not a percentage of the container.
20. Q3: Which value collapses empty grid tracks so existing items stretch to fill them?
21. A) `auto-fit` (*)
22. B) `auto-fill`
23. C) `auto-rows`
24. D) `auto-flow`
25. Explanation: `auto-fit` collapses empty tracks; `auto-fill` keeps them as gaps even when there are too few items.
26. Q4: Why is `minmax(0, 1fr)` safer than plain `1fr`?
27. A) It is faster
28. B) It allows items to shrink below their intrinsic content size (*)
29. C) It is required by the spec
30. D) It disables gap
31. Explanation: Plain `1fr` is `minmax(auto, 1fr)` which respects content min-size; `minmax(0, 1fr)` allows shrinking to 0.
32. Q5: Which grid shorthand spans 3 columns starting from line 1?
33. A) `grid-column: 3;`
34. B) `grid-column: 1-3;`
35. C) `grid-column: 1 / span 3;` (*)
36. D) `grid-column: span 1 to 3;`
37. Explanation: `1 / span 3` starts at line 1 and spans 3 tracks (lines 1->2, 2->3, 3->4).
38. Q6: Which property defines named grid regions for visual layout?
39. A) `grid-area-names`
40. B) `grid-names`
41. C) `template-areas`
42. D) `grid-template-areas` (*)
43. Explanation: `grid-template-areas` lets you draw the layout with named regions in an ASCII-art style.
44. Q7: What does `subgrid` allow a child grid to do?
45. A) Inherit the parent grid's track definitions (*)
46. B) Become a flex container
47. C) Use a smaller font size
48. D) Apply inline styles
49. Explanation: `grid-template-rows: subgrid` makes the child inherit the parent's row tracks, so grandchildren align across children.
50. Q8: Which property spaces grid tracks uniformly without margins?
51. A) `padding`
52. B) `gap` (*)
53. C) `border-spacing`
54. D) `margin`
55. Explanation: `gap` is the modern way to space grid (and flex) items without per-item margins.
56. Q9: How many tracks does `grid-row: 1 / 4` span?
57. A) 1
58. B) 2
59. C) 3 (*)
60. D) 4
61. Explanation: Line 1 to line 4 spans tracks 1->2, 2->3, 3->4 — three tracks total.
62. Q10: Which layout is Grid best for?
63. A) A single horizontal navbar
64. B) A vertically scrolling list
65. C) A single centered button
66. D) A page with header, sidebar, main, and footer arranged in 2D (*)
67. Explanation: Grid is ideal for whole-page or dashboard 2D layouts where you control both rows and columns simultaneously.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which CSS layout tool is best suited to 2D layouts (rows AND columns)?
  options:
    - Flexbox
    - Floats
    - CSS Grid
    - "position: absolute"
  correctIndex: 2
  explanation: Grid is purpose-built for two-dimensional layouts; Flexbox is one-dimensional.
- id: q2
  question: What does `1fr` represent in a grid template?
  options:
    - 1% of the container width
    - 1 pixel
    - The first track
    - One fraction of the remaining free space after fixed tracks
  correctIndex: 3
  explanation: "`fr` units share the leftover space after fixed-size tracks are placed; they are not a percentage of the container."
- id: q3
  question: Which value collapses empty grid tracks so existing items stretch to fill them?
  options:
    - "`auto-fit`"
    - "`auto-fill`"
    - "`auto-rows`"
    - "`auto-flow`"
  correctIndex: 0
  explanation: "`auto-fit` collapses empty tracks; `auto-fill` keeps them as gaps even when there are too few items."
- id: q4
  question: Why is `minmax(0, 1fr)` safer than plain `1fr`?
  options:
    - It is faster
    - It allows items to shrink below their intrinsic content size
    - It is required by the spec
    - It disables gap
  correctIndex: 1
  explanation: Plain `1fr` is `minmax(auto, 1fr)` which respects content min-size; `minmax(0, 1fr)` allows shrinking to 0.
- id: q5
  question: Which grid shorthand spans 3 columns starting from line 1?
  options:
    - "`grid-column: 3;`"
    - "`grid-column: 1-3;`"
    - "`grid-column: 1 / span 3;`"
    - "`grid-column: span 1 to 3;`"
  correctIndex: 2
  explanation: "`1 / span 3` starts at line 1 and spans 3 tracks (lines 1->2, 2->3, 3->4)."
- id: q6
  question: Which property defines named grid regions for visual layout?
  options:
    - "`grid-area-names`"
    - "`grid-names`"
    - "`template-areas`"
    - "`grid-template-areas`"
  correctIndex: 3
  explanation: "`grid-template-areas` lets you draw the layout with named regions in an ASCII-art style."
- id: q7
  question: What does `subgrid` allow a child grid to do?
  options:
    - Inherit the parent grid's track definitions
    - Become a flex container
    - Use a smaller font size
    - Apply inline styles
  correctIndex: 0
  explanation: "`grid-template-rows: subgrid` makes the child inherit the parent's row tracks, so grandchildren align across children."
- id: q8
  question: Which property spaces grid tracks uniformly without margins?
  options:
    - "`padding`"
    - "`gap`"
    - "`border-spacing`"
    - "`margin`"
  correctIndex: 1
  explanation: "`gap` is the modern way to space grid (and flex) items without per-item margins."
- id: q9
  question: "How many tracks does `grid-row: 1 / 4` span?"
  options:
    - "1"
    - "2"
    - "3"
    - "4"
  correctIndex: 2
  explanation: Line 1 to line 4 spans tracks 1->2, 2->3, 3->4 — three tracks total.
- id: q10
  question: Which layout is Grid best for?
  options:
    - A single horizontal navbar
    - A vertically scrolling list
    - A single centered button
    - A page with header, sidebar, main, and footer arranged in 2D
  correctIndex: 3
  explanation: Grid is ideal for whole-page or dashboard 2D layouts where you control both rows and columns simultaneously.
```

