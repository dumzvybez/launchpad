---
slug: css-layout-floats-positioning-flexbox
id: css-06
track: css
order: 6
title: Layout — Floats, Positioning, Flexbox
description: Learn the three historical layout systems and why Flexbox is the right tool for 1D layout today. Cover `position`, floats (and why they're not for layout anymore), and the Flexbox model end to end.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=1250s
whyItMatters: Learn the three historical layout systems and why Flexbox is the right tool for 1D layout today. Cover `position`, floats (and why they're not for layout anymore), and the Flexbox model end to end.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Layout — Floats, Positioning, Flexbox

## Layout — Floats, Positioning, Flexbox

### Why It Matters

Learn the three historical layout systems and why Flexbox is the right tool for 1D layout today. Cover `position`, floats (and why they're not for layout anymore), and the Flexbox model end to end.

Learn the three historical layout systems and why Flexbox is the right tool for 1D layout today. Cover `position`, floats (and why they're not for layout anymore), and the Flexbox model end to end.

### Prerequisites

- Stage 1: Getting Started with CSS
- Stage 2: Selectors and Specificity
- Stage 3: The Box Model and Sizing
- Stage 4: Colors, Backgrounds, and Gradients
- Stage 5: Typography and Text Styling

### Topics

- The five `position` values: static, relative, absolute, fixed, sticky
- Containing blocks and how `absolute` finds its reference
- `z-index` and stacking contexts
- Floats: `float: left/right/none`, `clear`, clearfix
- Why floats are no longer used for layout (but still for text wrap)
- Flexbox: container (`display: flex`) vs item properties
- `flex-direction`, `justify-content`, `align-items`, `align-self`, `gap`
- `flex: 1 1 0` shorthand, `flex-grow`, `flex-shrink`, `flex-basis`
- `flex-wrap`, `flex-flow`, common patterns (centering, nav, sticky footer)

### Key Concepts

- `position: absolute` is relative to the nearest positioned ancestor (not necessarily the parent); if none exists, it falls back to the initial containing block (viewport-sized).
- Setting `transform`, `filter`, `opacity < 1`, `will-change`, or `position: fixed/sticky` on an element creates a new stacking context, which contains its children's z-index values.
- Flexbox is one-dimensional; Grid is two-dimensional. Use flex for rows OR columns, grid for rows AND columns.
- `flex: 1` means `1 1 0%` (grow 1, shrink 1, basis 0); `flex: auto` means `1 1 auto`.
- `min-width: 0` on a flex child prevents content (like long words or non-wrapping strings) from forcing the item wider than the container.

```css
.banner {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.tooltip {
  position: absolute;          /* positioned relative to nearest positioned ancestor */
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.modal-backdrop {
  position: fixed;
  inset: 0;                    /* top/right/bottom/left: 0 */
  background: rgb(0 0 0 / 0.5);
}
```
Caption: Positioning

### Common Pitfalls

- Using `position: absolute` for primary layout — it removes elements from flow and breaks responsiveness; use flex/grid instead.
- Forgetting `min-width: 0` on flex children — long words, images, or non-wrapping strings can blow out the container.
- Assuming `z-index: 9999` always wins — z-index is scoped to its stacking context; an element in a lower-context sibling cannot out-stack a higher-context tree.
- Using `float` for grid-like layouts — that is a 2010-era hack; use flexbox or grid. Floats are still correct for wrapping text around images.
- Setting `position: relative` on every parent "just in case" — it creates stacking contexts and changes how `absolute` children position; do it deliberately.

### Real-World Applications

- Stripe's pricing page uses Flexbox to align plan features and CTAs across cards of differing heights.
- GitHub uses `position: sticky` for sticky file headers and table headers in pull-request diffs.
- Linear uses Flexbox for the command palette row layout (icon, title, shortcut, chevron).
- Vercel's dashboard uses `position: fixed` for the global command bar (`Cmd+K`) with a backdrop overlay.

### Interview Questions

- 1. What is the difference between `position: relative`, `absolute`, `fixed`, and `sticky`? — relative offsets from in-flow position; absolute from nearest positioned ancestor; fixed from viewport; sticky toggles between relative and fixed at a scroll threshold.
- 2. What creates a new stacking context? — Any of: position fixed/sticky, z-index on a positioned element, transform, filter, opacity < 1, will-change, contain, mix-blend-mode.
- 3. Why is Flexbox called "one-dimensional"? — It lays out items along a single axis (row OR column); Grid is two-dimensional (rows AND columns).
- 4. What does `flex: 1` mean? — Shorthand for `1 1 0%`: grow 1, shrink 1, basis 0.
- 5. Why do flex children sometimes overflow their container and how do you fix it? — Content with intrinsic min-size (long words, images) prevents shrinking; set `min-width: 0` (or `min-height: 0`) on the flex child.

### Mini Project

Build a Responsive Navbar with Flexbox: A horizontal navbar with logo on the left, links in the middle, and a CTA button on the right that wraps gracefully on small screens. Demonstrates flex-direction, justify-content, gap, and flex-wrap. Suggested approach:
  - Use `display: flex` with `justify-content: space-between` for the top row
  - Group the middle links in a nested flex with `gap`
  - Set `flex-wrap: wrap` and `gap: 0.5rem` so links wrap on narrow viewports
  - Use `align-items: center` for vertical alignment
  - Add a sticky header with `position: sticky; top: 0`

### Exercises

1. Recreate a 3-column layout with flexbox using `flex: 1 1 0` and verify equal widths.
2. Build a modal dialog using `position: fixed; inset: 0;` with `display: flex; align-items: center; justify-content: center;`.
3. Demonstrate stacking contexts: nest two positioned elements with z-index and observe that an outer element with lower z-index still wins over a child of a sibling.
4. Wrap text around an image using `float: left` and `shape-outside: circle()`.
5. Set `min-width: 0` on a flex child containing a long URL and verify the container no longer overflows.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which `position` value keeps an element in flow but lets you offset it from its natural position?
9. A) static
10. B) relative (*)
11. C) absolute
12. D) fixed
13. Explanation: `position: relative` keeps the element in the normal flow but allows `top/right/bottom/left` offsets from its in-flow position.
14. Q2: An element with `position: absolute` is positioned relative to:
15. A) The viewport
16. B) The <html> element
17. C) The nearest positioned ancestor (or initial containing block if none) (*)
18. D) Its previous sibling
19. Explanation: Absolute positioning resolves against the nearest ancestor with a position other than static; if none exists, it uses the initial containing block.
20. Q3: Which property/value pair creates a modal that covers the entire viewport?
21. A) `position: fixed; inset: 0;` (*)
22. B) `position: absolute; top: 0; left: 0;`
23. C) `position: sticky; inset: 0;`
24. D) `position: relative; inset: 0;`
25. Explanation: `position: fixed; inset: 0` pins the element to the viewport edges (top/right/bottom/left: 0).
26. Q4: What does `flex: 1` expand to?
27. A) `1 1 auto`
28. B) `1 1 0%` (*)
29. C) `1 0 0`
30. D) `0 1 auto`
31. Explanation: `flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`.
32. Q5: Which property on a flex child prevents content (e.g., a long URL) from blowing out the container?
33. A) `overflow: hidden`
34. B) `flex-shrink: 0`
35. C) `min-width: 0` (*)
36. D) `white-space: nowrap`
37. Explanation: Flex children default to `min-width: auto`, which respects intrinsic content size; `min-width: 0` allows them to shrink below content size.
38. Q6: Which value of `justify-content` pushes items to the extremes with space between?
39. A) `flex-start`
40. B) `space-around`
41. C) `stretch`
42. D) `space-between` (*)
43. Explanation: `space-between` puts the first item at the start, the last at the end, and equal space between items.
44. Q7: Which property establishes a new stacking context when set on an element?
45. A) `transform: translateX(0)` (*)
46. B) `display: block`
47. C) `position: static`
48. D) `overflow: hidden`
49. Explanation: Setting `transform`, `filter`, `opacity < 1`, `will-change`, `position: fixed/sticky`, or `z-index` on a positioned element all create stacking contexts.
50. Q8: Why are floats no longer recommended for page layout?
51. A) They are deprecated
52. B) They remove elements from flow and require clearfix hacks; flex/grid are purpose-built (*)
53. C) They are slower
54. D) They only work in Firefox
55. Explanation: Floats were a 2010-era layout hack; flexbox and grid are the modern purpose-built tools. Floats remain correct for wrapping text around images.
56. Q9: Which property pairs well with flexbox to space items uniformly without trailing margin?
57. A) `margin`
58. B) `padding`
59. C) `gap` (*)
60. D) `border-spacing`
61. Explanation: `gap` applies uniform spacing between flex/grid items without margin-collapse or trailing-margin concerns.
62. Q10: A `position: sticky` element stops sticking when:
63. A) The user clicks
64. B) `display` changes
65. C) The viewport resizes
66. D) The user scrolls past its parent's bottom edge (*)
67. Explanation: Sticky positioning is constrained to the parent's box; the element unsticks when its container scrolls out of view.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which `position` value keeps an element in flow but lets you offset it from its natural position?
  options:
    - static
    - relative
    - absolute
    - fixed
  correctIndex: 1
  explanation: "`position: relative` keeps the element in the normal flow but allows `top/right/bottom/left` offsets from its in-flow position."
- id: q2
  question: "An element with `position: absolute` is positioned relative to:"
  options:
    - The viewport
    - The <html> element
    - The nearest positioned ancestor (or initial containing block if none)
    - Its previous sibling
  correctIndex: 2
  explanation: Absolute positioning resolves against the nearest ancestor with a position other than static; if none exists, it uses the initial containing block.
- id: q3
  question: Which property/value pair creates a modal that covers the entire viewport?
  options:
    - "`position: fixed; inset: 0;`"
    - "`position: absolute; top: 0; left: 0;`"
    - "`position: sticky; inset: 0;`"
    - "`position: relative; inset: 0;`"
  correctIndex: 0
  explanation: "`position: fixed; inset: 0` pins the element to the viewport edges (top/right/bottom/left: 0)."
- id: q4
  question: "What does `flex: 1` expand to?"
  options:
    - "`1 1 auto`"
    - "`1 1 0%`"
    - "`1 0 0`"
    - "`0 1 auto`"
  correctIndex: 1
  explanation: "`flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`."
- id: q5
  question: Which property on a flex child prevents content (e.g., a long URL) from blowing out the container?
  options:
    - from blowing out the container?
    - "`overflow: hidden`"
    - "`flex-shrink: 0`"
    - "`min-width: 0`"
    - "`white-space: nowrap`"
  correctIndex: 3
  explanation: "Flex children default to `min-width: auto`, which respects intrinsic content size; `min-width: 0` allows them to shrink below content size."
- id: q6
  question: Which value of `justify-content` pushes items to the extremes with space between?
  options:
    - "`flex-start`"
    - "`space-around`"
    - "`stretch`"
    - "`space-between`"
  correctIndex: 3
  explanation: "`space-between` puts the first item at the start, the last at the end, and equal space between items."
- id: q7
  question: Which property establishes a new stacking context when set on an element?
  options:
    - "`transform: translateX(0)`"
    - "`display: block`"
    - "`position: static`"
    - "`overflow: hidden`"
  correctIndex: 0
  explanation: "Setting `transform`, `filter`, `opacity < 1`, `will-change`, `position: fixed/sticky`, or `z-index` on a positioned element all create stacking contexts."
- id: q8
  question: Why are floats no longer recommended for page layout?
  options:
    - They are deprecated
    - They remove elements from flow and require clearfix hacks; flex/grid are purpose-built
    - They are slower
    - They only work in Firefox
  correctIndex: 1
  explanation: Floats were a 2010-era layout hack; flexbox and grid are the modern purpose-built tools. Floats remain correct for wrapping text around images.
- id: q9
  question: Which property pairs well with flexbox to space items uniformly without trailing margin?
  options:
    - "`margin`"
    - "`padding`"
    - "`gap`"
    - "`border-spacing`"
  correctIndex: 2
  explanation: "`gap` applies uniform spacing between flex/grid items without margin-collapse or trailing-margin concerns."
- id: q10
  question: "A `position: sticky` element stops sticking when:"
  options:
    - The user clicks
    - "`display` changes"
    - The viewport resizes
    - The user scrolls past its parent's bottom edge
  correctIndex: 3
  explanation: Sticky positioning is constrained to the parent's box; the element unsticks when its container scrolls out of view.
```

