---
slug: css-css-performance-critical-css-will-change-repaints
id: css-16
track: css
order: 16
title: CSS Performance — Critical CSS, Will-Change, Repaints
description: CSS can make or break perceived performance. Learn the browser rendering pipeline (style → layout → paint → composite), which properties trigger which phases, critical CSS inlining, `content-visibility`, `will-change`, and how to measure with DevTools.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=1200s
whyItMatters: CSS can make or break perceived performance. Learn the browser rendering pipeline (style → layout → paint → composite), which properties trigger which phases, critical CSS inlining, `content-visibility`, `will-change`, and how to measure with DevTools.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# CSS Performance — Critical CSS, Will-Change, Repaints

## CSS Performance — Critical CSS, Will-Change, Repaints

### Why It Matters

CSS can make or break perceived performance. Learn the browser rendering pipeline (style → layout → paint → composite), which properties trigger which phases, critical CSS inlining, `content-visibility`, `will-change`, and how to measure with DevTools.

CSS can make or break perceived performance. Learn the browser rendering pipeline (style → layout → paint → composite), which properties trigger which phases, critical CSS inlining, `content-visibility`, `will-change`, and how to measure with DevTools.

### Prerequisites

- Stage 1-15 (especially Stage 9 transitions and Stage 15 filters)
- Basic understanding of browser performance metrics (LCP, CLS, FID/INP)

### Topics

- The rendering pipeline: style → layout → paint → composite
- Which properties trigger layout (width, height, margin, padding, position)
- Which properties trigger paint (color, background, box-shadow, border-radius)
- Which properties are GPU-composited (transform, opacity, filter)
- `will-change` — when to use and when to remove
- Critical CSS inlining and async-loading the rest
- `content-visibility: auto` and `contain-intrinsic-size`
- CSS `contain` property (layout, paint, style, size, strict, content)
- Measuring with DevTools Performance and Lighthouse

### Key Concepts

- Layout (reflow) is the most expensive phase; if you change a layout property, the browser must recompute positions for affected elements.
- Paint (repaint) is cheaper than layout but still expensive; changing colors/backgrounds triggers it.
- Composite (GPU) is cheapest — `transform` and `opacity` are GPU-composited and avoid layout/paint.
- `will-change: transform` hints the browser to pre-promote the element to its own layer; overuse wastes memory.
- `content-visibility: auto` skips rendering offscreen elements entirely, dramatically reducing initial paint cost on long pages.

```css
/* Cheap (composite only) */
.move { transform: translateX(10px); opacity: 0.8; }

/* Medium (paint) */
.color { color: red; background: white; box-shadow: 0 0 10px black; }

/* Expensive (layout) */
.layout { width: 50%; margin: 1rem; padding: 1rem; }
```
Caption: Property cost tiers

### Common Pitfalls

- Animating `width`, `top`, or `margin` — these trigger layout every frame; use `transform: translate/scale` instead.
- Setting `will-change: transform` permanently on hundreds of elements — each gets its own GPU layer, blowing up memory; set just-in-time and remove after.
- Forgetting `contain-intrinsic-size` with `content-visibility: auto` — without an estimate, the scrollbar jumps as sections render.
- Inlining 50KB of "critical CSS" — too much inline CSS slows first paint; extract only what's needed for the hero.
- Loading all CSS synchronously in `<head>` — render-blocking; preload the non-critical sheet and swap `rel` on load.

### Real-World Applications

- Vercel inlines critical CSS for above-the-fold dashboard chrome and async-loads the rest, achieving sub-second first paint.
- GitHub uses `content-visibility: auto` on long issue lists to skip rendering collapsed comments.
- Stripe uses `contain: layout paint` on payment form rows so updates inside one row don't recompute sibling layout.
- Linear uses DevTools Performance to track repaints on scroll, ensuring 60fps list scrolling.

### Interview Questions

- 1. What are the four phases of the browser rendering pipeline? — Style → Layout → Paint → Composite; some properties skip the early phases.
- 2. Why is `transform: translateX()` cheaper than `left: 10px`? — `transform` is GPU-composited and skips layout/paint; `left` triggers layout (reflow).
- 3. When should you use `will-change`? — Sparingly, just before an animation, and remove it after; permanent use wastes GPU memory.
- 4. What does `content-visibility: auto` do? — Skips rendering, layout, and paint for offscreen elements, dramatically reducing initial paint cost on long pages.
- 5. What is the difference between `contain: layout` and `contain: paint`? — `layout` isolates layout recalc to the subtree; `paint` additionally ensures the element's contents don't paint outside its bounds.

### Mini Project

Optimize a Long Article Page for Performance: Take a 50-section article and apply `content-visibility: auto` with `contain-intrinsic-size`, inline critical CSS for the hero, and async-load the full stylesheet. Measure with DevTools before and after. Suggested approach:
  - Identify above-the-fold styles and inline them in a `<style>` block in `<head>`
  - Add `rel="preload"` and `onload` swap pattern for the full stylesheet
  - Apply `content-visibility: auto; contain-intrinsic-size: auto 800px;` to each section
  - Add `contain: layout paint` to interactive cards so their changes don't reflow siblings
  - Record a DevTools Performance trace before and after; report the paint-time delta

### Exercises

1. Animate `left: 0 -> 100px` and `transform: translateX(0 -> 100px)` and compare Performance traces.
2. Inline critical CSS for a hero section; preload the rest; verify the Lighthouse First Contentful Paint improves.
3. Apply `content-visibility: auto` to a long list and verify the scrollbar size estimate.
4. Add `will-change: transform` to a hovering card and remove it on transitionend.
5. Use `contain: layout paint style` on a frequently updated widget and verify siblings don't reflow.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which property change is the most expensive because it triggers layout (reflow)?
9. A) `width` (*)
10. B) `opacity`
11. C) `transform`
12. D) `color`
13. Explanation: `width` triggers layout, which is the most expensive pipeline phase; transform/opacity are GPU-composited, color only triggers paint.
14. Q2: Which two properties are GPU-composited and skip layout/paint?
15. A) `width` and `height`
16. B) `margin` and `padding`
17. C) `color` and `background`
18. D) `transform` and `opacity` (*)
19. Explanation: `transform` and `opacity` are handled by the compositor on the GPU and do not trigger layout or paint.
20. Q3: What is the recommended usage pattern for `will-change`?
21. A) Apply just-in-time before animation and remove after (*)
22. B) Set it permanently on every animated element
23. C) Only use it on body
24. D) It is deprecated
25. Explanation: `will-change` pre-promotes to a GPU layer; permanent use on many elements wastes memory. Apply just-in-time and remove after.
26. Q4: Which property skips rendering offscreen elements entirely on long pages?
27. A) `visibility: hidden`
28. B) `content-visibility: auto` (*)
29. C) `display: none`
30. D) `contain: none`
31. Explanation: `content-visibility: auto` tells the browser to skip rendering, layout, and paint for offscreen elements, improving performance.
32. Q5: Which property is required alongside `content-visibility: auto` to prevent scrollbar jump?
33. A) `min-height`
34. B) `aspect-ratio`
35. C) `contain-intrinsic-size` (*)
36. D) `will-change`
37. Explanation: Without an estimated size, the browser cannot reserve space, so the scrollbar jumps as sections render; `contain-intrinsic-size` provides the estimate.
38. Q6: Which `contain` value isolates both layout and painting to the subtree?
39. A) `contain: strict`
40. B) `contain: content`
41. C) `contain: none`
42. D) `contain: layout paint` (*)
43. Explanation: `contain: layout paint` isolates both layout recalc and painting; `content` is shorthand for layout paint style (no size).
44. Q7: Which technique reduces render-blocking CSS for the initial paint?
45. A) Inline critical CSS and async-load the rest (*)
46. B) Load all CSS synchronously in <head>
47. C) Use only inline styles
48. D) Skip CSS entirely
49. Explanation: Inlining only the critical above-the-fold CSS in a `<style>` block and async-loading the rest avoids render-blocking.
50. Q8: Which DevTools panel measures repaints and layout shifts during scroll?
51. A) Elements
52. B) Performance (*)
53. C) Network
54. D) Application
55. Explanation: The Performance panel records a trace showing layout/paint/composite events; use it to spot expensive CSS.
56. Q9: Which Lighthouse metric measures when the largest visible element first paints?
57. A) FCP
58. B) CLS
59. C) LCP (*)
60. D) TTFB
61. Explanation: LCP (Largest Contentful Paint) measures when the largest visible element renders; CSS optimizations often target LCP.
62. Q10: Which property change triggers paint but NOT layout?
63. A) `width`
64. B) `margin`
65. C) `top`
66. D) `color` (*)
67. Explanation: Changing `color` triggers paint (repaint) but not layout; `width`, `margin`, and `top` all trigger layout.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which property change is the most expensive because it triggers layout (reflow)?
  options:
    - "`width`"
    - "`opacity`"
    - "`transform`"
    - "`color`"
  correctIndex: 0
  explanation: "`width` triggers layout, which is the most expensive pipeline phase; transform/opacity are GPU-composited, color only triggers paint."
- id: q2
  question: Which two properties are GPU-composited and skip layout/paint?
  options:
    - "`width` and `height`"
    - "`margin` and `padding`"
    - "`color` and `background`"
    - "`transform` and `opacity`"
  correctIndex: 3
  explanation: "`transform` and `opacity` are handled by the compositor on the GPU and do not trigger layout or paint."
- id: q3
  question: What is the recommended usage pattern for `will-change`?
  options:
    - Apply just-in-time before animation and remove after
    - Set it permanently on every animated element
    - Only use it on body
    - It is deprecated
  correctIndex: 0
  explanation: "`will-change` pre-promotes to a GPU layer; permanent use on many elements wastes memory. Apply just-in-time and remove after."
- id: q4
  question: Which property skips rendering offscreen elements entirely on long pages?
  options:
    - "`visibility: hidden`"
    - "`content-visibility: auto`"
    - "`display: none`"
    - "`contain: none`"
  correctIndex: 1
  explanation: "`content-visibility: auto` tells the browser to skip rendering, layout, and paint for offscreen elements, improving performance."
- id: q5
  question: "Which property is required alongside `content-visibility: auto` to prevent scrollbar jump?"
  options:
    - "`min-height`"
    - "`aspect-ratio`"
    - "`contain-intrinsic-size`"
    - "`will-change`"
  correctIndex: 2
  explanation: Without an estimated size, the browser cannot reserve space, so the scrollbar jumps as sections render; `contain-intrinsic-size` provides the estimate.
- id: q6
  question: Which `contain` value isolates both layout and painting to the subtree?
  options:
    - "`contain: strict`"
    - "`contain: content`"
    - "`contain: none`"
    - "`contain: layout paint`"
  correctIndex: 3
  explanation: "`contain: layout paint` isolates both layout recalc and painting; `content` is shorthand for layout paint style (no size)."
- id: q7
  question: Which technique reduces render-blocking CSS for the initial paint?
  options:
    - Inline critical CSS and async-load the rest
    - Load all CSS synchronously in <head>
    - Use only inline styles
    - Skip CSS entirely
  correctIndex: 0
  explanation: Inlining only the critical above-the-fold CSS in a `<style>` block and async-loading the rest avoids render-blocking.
- id: q8
  question: Which DevTools panel measures repaints and layout shifts during scroll?
  options:
    - Elements
    - Performance
    - Network
    - Application
  correctIndex: 1
  explanation: The Performance panel records a trace showing layout/paint/composite events; use it to spot expensive CSS.
- id: q9
  question: Which Lighthouse metric measures when the largest visible element first paints?
  options:
    - FCP
    - CLS
    - LCP
    - TTFB
  correctIndex: 2
  explanation: LCP (Largest Contentful Paint) measures when the largest visible element renders; CSS optimizations often target LCP.
- id: q10
  question: Which property change triggers paint but NOT layout?
  options:
    - "`width`"
    - "`margin`"
    - "`top`"
    - "`color`"
  correctIndex: 3
  explanation: Changing `color` triggers paint (repaint) but not layout; `width`, `margin`, and `top` all trigger layout.
```

