---
slug: html-html5-apis-canvas-svg-drag-drop
id: html-09
track: html
order: 9
title: HTML5 APIs — Canvas, SVG, Drag-and-Drop
description: Author graphics and interactions directly in HTML. This stage covers inline SVG, the `<canvas>` element, and the native drag-and-drop API — and when to use which.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3100s
whyItMatters: Author graphics and interactions directly in HTML. This stage covers inline SVG, the `<canvas>` element, and the native drag-and-drop API — and when to use which.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# HTML5 APIs — Canvas, SVG, Drag-and-Drop

## HTML5 APIs — Canvas, SVG, Drag-and-Drop

### Why It Matters

Author graphics and interactions directly in HTML. This stage covers inline SVG, the `<canvas>` element, and the native drag-and-drop API — and when to use which.

Author graphics and interactions directly in HTML. This stage covers inline SVG, the `<canvas>` element, and the native drag-and-drop API — and when to use which.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 6: Semantic HTML and Document Outline
- Stage 8: Accessibility (a11y) Fundamentals

### Topics

- Inline SVG: `<svg>`, `viewBox`, `path`, `<g>`, `<use>`, gradients
- SVG accessibility: `<title>`, `<desc>`, `role="img"`, `aria-labelledby`
- The `<canvas>` element and 2D context
- Drawing shapes, text, and images on canvas
- Canvas accessibility: fallback content and `role="img"`
- The Drag-and-Drop API: `draggable`, `dragstart`, `dragover`, `drop`
- DataTransfer and drag images
- When to use canvas vs SVG (raster vs vector, complexity, interactivity)

### Key Concepts

- SVG is vector (scales crisply, DOM-addressable, good for icons and charts); canvas is raster (pixel-based, faster for thousands of objects, harder for a11y).
- Inline SVG is part of the DOM, so it can be styled with CSS and scripted directly.
- Canvas is invisible to screen readers; always provide fallback content and `role="img"` with `aria-label`.
- The DnD API requires `event.preventDefault()` on `dragover` for the drop to fire — the most common bug.
- DnD is not keyboard accessible by default; always provide a keyboard alternative (e.g., up/down buttons).

```html
<svg role="img" aria-labelledby="warning-title warning-desc"
     width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <title id="warning-title">Warning</title>
  <desc id="warning-desc">A yellow triangle with an exclamation mark</desc>
  <path d="M12 2 L22 20 L2 20 Z" fill="#f5a623"/>
  <text x="12" y="17" text-anchor="middle" fill="#000" font-size="12">!</text>
</svg>
```
Caption: Accessible inline SVG icon

### Common Pitfalls

- Canvas without fallback content — screen reader users see nothing; include `<p>` fallback inside `<canvas>` and add `role="img"` with `aria-label`.
- SVG without `<title>`/`<desc>` — invisible to screen readers; add `role="img"` and `aria-labelledby` pointing to a `<title>` element.
- Forgetting `event.preventDefault()` on `dragover` — the `drop` event never fires; this is the single most common DnD bug.
- DnD without keyboard alternative — mouse-only DnD fails WCAG 2.5.7 (Dragging Movements); add arrow-key reordering.
- Using SVG for thousands of nodes — DOM overhead kills performance; switch to canvas or WebGL for large datasets.

### Real-World Applications

- Figma renders its design canvas via WebGL (a 3D context) for performance, but exports icons as inline SVG.
- Excalidraw uses HTML5 canvas for freehand drawing and ships keyboard alternatives for every drag operation.
- Google Maps renders map tiles as a mix of `<canvas>` (for raster tiles) and DOM overlays (for markers and popups).
- Trello's drag-and-drop board uses the native HTML5 DnD API on desktop and a JS polyfill on touch devices.

### Interview Questions

- 1. When would you choose SVG over canvas? — For icons, charts with fewer than ~1000 elements, anything that needs to scale crisply or be styled with CSS, and when DOM accessibility matters.
- 2. Why must you call `preventDefault()` on `dragover`? — The default behavior of `dragover` is to disallow drops; calling `preventDefault()` enables the drop event to fire.
- 3. How do you make an SVG accessible? — Add `role="img"` and `aria-labelledby` pointing to a `<title>` (and optionally `<desc>`) element inside the SVG.
- 4. What is the difference between SVG `viewBox` and `width`/`height`? — `viewBox` defines the internal coordinate system; `width`/`height` define the rendered size. Together they control scaling.
- 5. Is the Drag-and-Drop API keyboard accessible? — No, by default it is mouse-only; you must add keyboard handlers and ARIA to comply with WCAG 2.5.7.

### Mini Project

Build an SVG Icon Set + Canvas Sketchpad: A page that displays a set of 6 accessible inline SVG icons and a canvas sketchpad where the user can draw with the mouse. Suggested approach:
  - Create 6 inline SVGs each with `role="img"`, `<title>`, and `<desc>`
  - Add a `<canvas>` with fallback content describing what it shows
  - Implement `mousedown`/`mousemove`/`mouseup` drawing on the canvas
  - Add "Clear" and "Save PNG" `<button type="button">` controls
  - Provide an `aria-label` on the canvas reflecting the current state

### Exercises

1. Add a `<title>` and `<desc>` to every SVG icon on a page and verify the screen reader announces them.
2. Convert a CSS background-image PNG icon to inline SVG and confirm it scales crisply at any size.
3. Implement a simple bar chart on `<canvas>` from an array of numbers and provide a fallback table inside the canvas element.
4. Build a drag-to-reorder list using the native DnD API; remember to call `preventDefault()` on `dragover`.
5. Add keyboard arrow-key reordering to your DnD list and verify it works without a mouse.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which element is best for a 50-node interactive line chart that must scale crisply?
9. A) <canvas>
10. B) <img src="chart.png">
11. C) Inline <svg> (*)
12. D) <table>
13. Explanation: SVG is vector (crisp at any size), DOM-addressable (each node can have handlers), and performant up to ~1000 nodes; ideal for charts.
14. Q2: What is required to make the `drop` event fire on a target?
15. A) Setting `draggable="true"` on the target
16. B) Calling `preventDefault()` on `dragover` (*)
17. C) Adding `ondrop="return true"`
18. D) Using `pointer-events: all`
19. Explanation: The default `dragover` behavior disallows drops; calling `preventDefault()` on the `dragover` handler is mandatory for `drop` to fire.
20. Q3: How do you make an inline SVG accessible to screen readers?
21. A) Add role="img" and aria-labelledby pointing to a <title> (*)
22. B) Add alt="..." attribute
23. C) Wrap it in a <figure>
24. D) SVGs are accessible by default
25. Explanation: SVG has no `alt` attribute; add `role="img"` plus `aria-labelledby` pointing to a `<title>` element inside the SVG.
26. Q4: Which attribute on `<canvas>` provides fallback content?
27. A) alt
28. B) Content placed between the opening and closing tags (*)
29. C) fallback
30. D) aria-fallback
31. Explanation: Anything between `<canvas>` and `</canvas>` is rendered only by browsers that don't support canvas — use it for fallback text.
32. Q5: What does SVG `viewBox` define?
33. A) The internal coordinate system (*)
34. B) The pixel size on screen
35. C) The border width
36. D) The background color
37. Explanation: `viewBox="0 0 24 24"` defines the internal coordinate space; combined with `width`/`height` it controls how the SVG scales.
38. Q6: Is the native Drag-and-Drop API keyboard accessible?
39. A) Yes, by default
40. B) No; you must add keyboard handlers and ARIA (*)
41. C) Only on Firefox
42. D) Only with a polyfill
43. Explanation: Native DnD is mouse-only; WCAG 2.5.7 (Dragging Movements) requires a keyboard alternative, which you must build.
44. Q7: When should you choose canvas over SVG?
45. A) For a 5-icon nav
46. B) For a static logo
47. C) For rendering thousands of particles in real time (*)
48. D) For a print stylesheet
49. Explanation: Canvas is raster-based and faster for thousands of objects; SVG DOM overhead would make a large particle system laggy.
50. Q8: What role should a canvas presenting an image-like graphic have?
51. A) role="application"
52. B) role="presentation"
53. C) No role — canvas is ignored
54. D) role="img" with aria-label (*)
55. Explanation: Add `role="img"` and `aria-label` so screen readers announce the canvas content; without it, the canvas is silent.
56. Q9: Which event fires when the user starts dragging an element?
57. A) dragbegin
58. B) draginit
59. C) pick
60. D) dragstart (*)
61. Explanation: `dragstart` fires on the draggable element when the user begins dragging; set `dataTransfer` data here.
62. Q10: What is the safest accessibility strategy for a complex interactive canvas app?
63. A) Provide a text/HTML alternative view with the same data (*)
64. B) Add a long alt text
65. C) Make the canvas read-only
66. D) Hide the canvas from AT
67. Explanation: For complex canvas apps, an alternative DOM view (e.g., a data table) is more robust than trying to make the canvas itself accessible.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which element is best for a 50-node interactive line chart that must scale crisply?
  options:
    - <canvas>
    - <img src="chart.png">
    - Inline <svg>
    - <table>
  correctIndex: 2
  explanation: SVG is vector (crisp at any size), DOM-addressable (each node can have handlers), and performant up to ~1000 nodes; ideal for charts.
- id: q2
  question: What is required to make the `drop` event fire on a target?
  options:
    - Setting `draggable="true"` on the target
    - Calling `preventDefault()` on `dragover`
    - Adding `ondrop="return true"`
    - "Using `pointer-events: all`"
  correctIndex: 1
  explanation: The default `dragover` behavior disallows drops; calling `preventDefault()` on the `dragover` handler is mandatory for `drop` to fire.
- id: q3
  question: How do you make an inline SVG accessible to screen readers?
  options:
    - Add role="img" and aria-labelledby pointing to a <title>
    - Add alt="..." attribute
    - Wrap it in a <figure>
    - SVGs are accessible by default
  correctIndex: 0
  explanation: SVG has no `alt` attribute; add `role="img"` plus `aria-labelledby` pointing to a `<title>` element inside the SVG.
- id: q4
  question: Which attribute on `<canvas>` provides fallback content?
  options:
    - alt
    - Content placed between the opening and closing tags
    - fallback
    - aria-fallback
  correctIndex: 1
  explanation: Anything between `<canvas>` and `</canvas>` is rendered only by browsers that don't support canvas — use it for fallback text.
- id: q5
  question: What does SVG `viewBox` define?
  options:
    - The internal coordinate system
    - The pixel size on screen
    - The border width
    - The background color
  correctIndex: 0
  explanation: '`viewBox="0 0 24 24"` defines the internal coordinate space; combined with `width`/`height` it controls how the SVG scales.'
- id: q6
  question: Is the native Drag-and-Drop API keyboard accessible?
  options:
    - Yes, by default
    - No; you must add keyboard handlers and ARIA
    - Only on Firefox
    - Only with a polyfill
  correctIndex: 1
  explanation: Native DnD is mouse-only; WCAG 2.5.7 (Dragging Movements) requires a keyboard alternative, which you must build.
- id: q7
  question: When should you choose canvas over SVG?
  options:
    - For a 5-icon nav
    - For a static logo
    - For rendering thousands of particles in real time
    - For a print stylesheet
  correctIndex: 2
  explanation: Canvas is raster-based and faster for thousands of objects; SVG DOM overhead would make a large particle system laggy.
- id: q8
  question: What role should a canvas presenting an image-like graphic have?
  options:
    - role="application"
    - role="presentation"
    - No role — canvas is ignored
    - role="img" with aria-label
  correctIndex: 3
  explanation: Add `role="img"` and `aria-label` so screen readers announce the canvas content; without it, the canvas is silent.
- id: q9
  question: Which event fires when the user starts dragging an element?
  options:
    - dragbegin
    - draginit
    - pick
    - dragstart
  correctIndex: 3
  explanation: "`dragstart` fires on the draggable element when the user begins dragging; set `dataTransfer` data here."
- id: q10
  question: What is the safest accessibility strategy for a complex interactive canvas app?
  options:
    - Provide a text/HTML alternative view with the same data
    - Add a long alt text
    - Make the canvas read-only
    - Hide the canvas from AT
  correctIndex: 0
  explanation: For complex canvas apps, an alternative DOM view (e.g., a data table) is more robust than trying to make the canvas itself accessible.
```

