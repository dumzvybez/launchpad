---
slug: css-modern-css-container-queries-has-subgrid
id: css-11
track: css
order: 11
title: Modern CSS — Container Queries, :has(), Subgrid
description: 'Modern CSS unlocks patterns that previously required JavaScript: container queries that respond to component width, `:has()` (the "parent selector"), subgrid for nested alignment, and `aspect-ratio` for intrinsic sizing. Learn what shipped, how to use it, and how to provide fallbacks.'
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=200s
whyItMatters: 'Modern CSS unlocks patterns that previously required JavaScript: container queries that respond to component width, `:has()` (the "parent selector"), subgrid for nested alignment, and `aspect-ratio` for intrinsic sizing. Learn what shipped, how to use it, and how to provide fallbacks.'
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Modern CSS — Container Queries, :has(), Subgrid

## Modern CSS — Container Queries, :has(), Subgrid

### Why It Matters

Modern CSS unlocks patterns that previously required JavaScript: container queries that respond to component width, `:has()` (the "parent selector"), subgrid for nested alignment, and `aspect-ratio` for intrinsic sizing. Learn what shipped, how to use it, and how to provide fallbacks.

Modern CSS unlocks patterns that previously required JavaScript: container queries that respond to component width, `:has()` (the "parent selector"), subgrid for nested alignment, and `aspect-ratio` for intrinsic sizing. Learn what shipped, how to use it, and how to provide fallbacks.

### Prerequisites

- Stage 1-10 (especially Stage 7 grid and Stage 8 responsive)
- Familiar with flexbox, grid, and media queries

### Topics

- `@container` queries (`inline-size`, `size`, `style` queries)
- `container-type` and `container-name`
- The `:has()` relational pseudo-class (parent selector)
- `:is()`, `:where()`, `:not()` with `:has()`
- Subgrid (`grid-template-rows: subgrid`)
- `aspect-ratio` and intrinsic sizing
- `text-wrap: balance` and `text-wrap: pretty`
- The `@supports` rule and progressive enhancement

### Key Concepts

- Container queries let a component adapt to its container's width, not the viewport; perfect for design systems whose components appear in unpredictable contexts.
- `:has()` lets you style a parent based on its descendants (e.g., `form:has(input:invalid)` highlights the form when an input is invalid).
- Subgrid inherits the parent's tracks so grandchildren across multiple children can align perfectly.
- `aspect-ratio: 16 / 9` reserves space for media before load, preventing CLS.
- `@supports (--foo: green)` lets you conditionally apply modern features with fallbacks for older browsers.

```css
.sidebar { container-type: inline-size; container-name: sidebar; }

@container sidebar (width > 240px) {
  .widget { display: grid; grid-template-columns: 80px 1fr; }
}
@container sidebar (width <= 240px) {
  .widget { display: block; }
}
```
Caption: Container query

### Common Pitfalls

- Forgetting `container-type: inline-size` on the parent — `@container` queries have no target and silently match nothing.
- Using `:has()` for expensive selectors that scan deep DOM — `:has(*)` or deeply-nested `:has()` can be slow; keep it shallow.
- Assuming subgrid works without parent tracks — subgrid requires the parent to have explicit tracks the child can inherit.
- Setting `container-type: size` when you only need width — `size` requires the element to have a defined height, which often breaks layout; prefer `inline-size`.
- Forgetting to provide an `@supports` fallback for subgrid in older browsers — feature-detect and fall back to grid or flex.

### Real-World Applications

- Vercel uses container queries on dashboard widgets that render in variable-width columns.
- Linear uses `:has()` to highlight the parent row of a focused input in issue tables.
- GitHub uses subgrid in some repo file views so metadata columns align across nested components.
- Stripe Docs uses `text-wrap: balance` on section headings so they wrap evenly across viewports.

### Interview Questions

- 1. What problem do container queries solve that media queries cannot? — Components can adapt to their parent's size, not the viewport, so they work in any container context (sidebar, modal, grid cell).
- 2. What does `:has()` let you do that was previously impossible? — Style an element based on its descendants (a "parent selector"), e.g., highlight a form containing an invalid input.
- 3. What is the difference between `container-type: inline-size` and `size`? — `inline-size` queries only the inline (width) axis; `size` requires the container to have a defined block (height) size, which can break layout.
- 4. What is subgrid and when is it useful? — A child grid inheriting the parent's tracks; useful for aligning grandchildren (e.g., card titles/bodies/footers) across multiple cards.
- 5. How do you feature-detect modern CSS before using it? — `@supports (property: value)` returns true if the browser supports that declaration; wrap modern rules in `@supports`.

### Mini Project

Build a Container-Query Widget: A widget that displays as a horizontal card when its container is wide (>32rem) and a vertical card when narrow, using only `@container` queries. Add `:has()` to highlight the widget when it contains a `.is-active` child. Suggested approach:
  - Set `container-type: inline-size; container-name: widget;` on the wrapper
  - Use `@container widget (min-width: 32rem)` to switch to a grid layout
  - Use `.widget:has(.is-active)` to apply a highlight ring
  - Use `aspect-ratio: 16 / 9` on the media
  - Provide a flex fallback wrapped in `@supports (container-type: inline-size)`

### Exercises

1. Apply `container-type: inline-size` to a card and write a `@container` query that flips layout at 28rem.
2. Use `:has()` to add a "contains unread" indicator to a list item that has `.unread` as a child.
3. Use subgrid to align three card children across a 3-column grid.
4. Add `text-wrap: balance` to all `<h2>` elements and compare line breaks on a narrow viewport.
5. Feature-detect container queries with `@supports` and provide a flex fallback.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which property must be set on an element before `@container` queries can target it?
9. A) `display: container`
10. B) `position: relative`
11. C) `container-type` (*)
12. D) `isolation: isolate`
13. Explanation: `container-type: inline-size` (or `size`) establishes a query container; without it, `@container` queries have no target.
14. Q2: Which selector styles a parent based on its descendants?
15. A) `:not()`
16. B) `:where()`
17. C) `:is()`
18. D) `:has()` (*)
19. Explanation: `:has()` is the "relational" pseudo-class; `parent:has(.child)` matches a parent that contains a matching descendant.
20. Q3: Which `container-type` value requires only the inline (width) axis to be queryable?
21. A) `inline-size` (*)
22. B) `size`
23. C) `block-size`
24. D) `both`
25. Explanation: `inline-size` queries only the inline axis; `size` requires both axes and a defined block size, which can break layout.
26. Q4: What does `grid-template-rows: subgrid` do?
27. A) Creates a new track definition
28. B) Inherits the parent grid's row tracks (*)
29. C) Removes grid rows
30. D) Reverses row order
31. Explanation: Subgrid makes the child grid inherit the parent's row tracks, allowing grandchildren to align across children.
32. Q5: Which rule lets you feature-detect modern CSS safely?
33. A) `@if`
34. B) `@feature`
35. C) `@supports` (*)
36. D) `@media (supports)`
37. Explanation: `@supports (property: value)` returns true if the browser supports that declaration; wrap modern rules inside it.
38. Q6: What does `text-wrap: balance` do for headings?
39. A) Centers text
40. B) Adds hyphenation
41. C) Disables wrapping
42. D) Evens out line lengths so the last line is not much shorter (*)
43. Explanation: `balance` distributes text more evenly across lines; `pretty` prevents orphans in paragraphs.
44. Q7: Which selector highlights a form that contains an invalid input?
45. A) `form:has(input:invalid)` (*)
46. B) `form input:invalid`
47. C) `form:invalid(input)`
48. D) `form.has(input:invalid)`
49. Explanation: `form:has(input:invalid)` matches a `<form>` element that has a descendant `input:invalid`.
50. Q8: Which property reserves space for media before load, preventing CLS?
51. A) `object-fit`
52. B) `aspect-ratio` (*)
53. C) `display`
54. D) `position`
55. Explanation: `aspect-ratio: 16 / 9` reserves the correct box before the media loads, avoiding layout shift.
56. Q9: Why is `:has(*)` considered potentially expensive?
57. A) It is invalid
58. B) It only matches the body
59. C) It can scan the entire DOM subtree, hurting performance (*)
60. D) It triggers layout
61. Explanation: Deep `:has()` selectors can require scanning large subtrees; keep them shallow and specific.
62. Q10: Which CSS feature lets a widget adapt to its container's width instead of the viewport?
63. A) Media queries
64. B) Viewport units
65. C) `position: sticky`
66. D) Container queries (*)
67. Explanation: Container queries test the parent container's size, allowing components to adapt to any context.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which property must be set on an element before `@container` queries can target it?
  options:
    - "`display: container`"
    - "`position: relative`"
    - "`container-type`"
    - "`isolation: isolate`"
  correctIndex: 2
  explanation: "`container-type: inline-size` (or `size`) establishes a query container; without it, `@container` queries have no target."
- id: q2
  question: Which selector styles a parent based on its descendants?
  options:
    - "`:not()`"
    - "`:where()`"
    - "`:is()`"
    - "`:has()`"
  correctIndex: 3
  explanation: '`:has()` is the "relational" pseudo-class; `parent:has(.child)` matches a parent that contains a matching descendant.'
- id: q3
  question: Which `container-type` value requires only the inline (width) axis to be queryable?
  options:
    - "`inline-size`"
    - "`size`"
    - "`block-size`"
    - "`both`"
  correctIndex: 0
  explanation: "`inline-size` queries only the inline axis; `size` requires both axes and a defined block size, which can break layout."
- id: q4
  question: "What does `grid-template-rows: subgrid` do?"
  options:
    - Creates a new track definition
    - Inherits the parent grid's row tracks
    - Removes grid rows
    - Reverses row order
  correctIndex: 1
  explanation: Subgrid makes the child grid inherit the parent's row tracks, allowing grandchildren to align across children.
- id: q5
  question: Which rule lets you feature-detect modern CSS safely?
  options:
    - "`@if`"
    - "`@feature`"
    - "`@supports`"
    - "`@media (supports)`"
  correctIndex: 2
  explanation: "`@supports (property: value)` returns true if the browser supports that declaration; wrap modern rules inside it."
- id: q6
  question: "What does `text-wrap: balance` do for headings?"
  options:
    - Centers text
    - Adds hyphenation
    - Disables wrapping
    - Evens out line lengths so the last line is not much shorter
  correctIndex: 3
  explanation: "`balance` distributes text more evenly across lines; `pretty` prevents orphans in paragraphs."
- id: q7
  question: Which selector highlights a form that contains an invalid input?
  options:
    - "`form:has(input:invalid)`"
    - "`form input:invalid`"
    - "`form:invalid(input)`"
    - "`form.has(input:invalid)`"
  correctIndex: 0
  explanation: "`form:has(input:invalid)` matches a `<form>` element that has a descendant `input:invalid`."
- id: q8
  question: Which property reserves space for media before load, preventing CLS?
  options:
    - "`object-fit`"
    - "`aspect-ratio`"
    - "`display`"
    - "`position`"
  correctIndex: 1
  explanation: "`aspect-ratio: 16 / 9` reserves the correct box before the media loads, avoiding layout shift."
- id: q9
  question: Why is `:has(*)` considered potentially expensive?
  options:
    - It is invalid
    - It only matches the body
    - It can scan the entire DOM subtree, hurting performance
    - It triggers layout
  correctIndex: 2
  explanation: Deep `:has()` selectors can require scanning large subtrees; keep them shallow and specific.
- id: q10
  question: Which CSS feature lets a widget adapt to its container's width instead of the viewport?
  options:
    - Media queries
    - Viewport units
    - "`position: sticky`"
    - Container queries
  correctIndex: 3
  explanation: Container queries test the parent container's size, allowing components to adapt to any context.
```

