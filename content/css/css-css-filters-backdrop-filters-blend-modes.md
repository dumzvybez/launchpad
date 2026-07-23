---
slug: css-css-filters-backdrop-filters-blend-modes
id: css-15
track: css
order: 15
title: CSS Filters, Backdrop Filters, and Blend Modes
description: Add visual polish with `filter` (blur, brightness, contrast, drop-shadow), `backdrop-filter` (frosted glass), and `mix-blend-mode`/`background-blend-mode` for non-destructive layering. Learn performance implications and accessibility concerns.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=1000s
whyItMatters: Add visual polish with `filter` (blur, brightness, contrast, drop-shadow), `backdrop-filter` (frosted glass), and `mix-blend-mode`/`background-blend-mode` for non-destructive layering. Learn performance implications and accessibility concerns.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# CSS Filters, Backdrop Filters, and Blend Modes

## CSS Filters, Backdrop Filters, and Blend Modes

### Why It Matters

Add visual polish with `filter` (blur, brightness, contrast, drop-shadow), `backdrop-filter` (frosted glass), and `mix-blend-mode`/`background-blend-mode` for non-destructive layering. Learn performance implications and accessibility concerns.

Add visual polish with `filter` (blur, brightness, contrast, drop-shadow), `backdrop-filter` (frosted glass), and `mix-blend-mode`/`background-blend-mode` for non-destructive layering. Learn performance implications and accessibility concerns.

### Prerequisites

- Stage 1-14 (especially Stage 4 colors and Stage 9 transitions)
- Comfort with stacking contexts and the cascade

### Topics

- `filter`: blur(), brightness(), contrast(), grayscale(), hue-rotate(), invert(), saturate(), sepia(), drop-shadow()
- `backdrop-filter`: blur(), saturate(), and the `-webkit-` prefix for Safari
- Performance: filters are expensive on large areas; promote to GPU
- `mix-blend-mode`: multiply, screen, overlay, darken, lighten, color-dodge, color-burn, difference, exclusion, hue, saturation, color, luminosity
- `background-blend-mode` for layered backgrounds
- `isolation: isolate` to create a new stacking context for blending
- Accessibility: ensure contrast with `prefers-contrast` and forced-colors
- Combining filters with custom properties and animations

### Key Concepts

- `filter` applies to the element itself (and children); `backdrop-filter` applies to what is behind the element (frosted glass).
- `drop-shadow()` follows the alpha shape of the element (including transparent PNGs and CSS shapes), unlike `box-shadow` which is a rectangle.
- `mix-blend-mode` blends the element with whatever is behind it in the same stacking context; use `isolation: isolate` on a parent to keep blending contained.
- Filters and backdrop-filters are GPU-composited but expensive on large areas; restrict to small overlays and promote with `will-change`.
- `backdrop-filter` requires a semi-transparent background on the element to show the effect.

```css
.img-grayscale { filter: grayscale(1); }
.img-vintage { filter: sepia(0.4) contrast(1.1) saturate(1.3); }
.img-hover { transition: filter 200ms; }
.img-hover:hover { filter: brightness(1.1) saturate(1.2); }

/* drop-shadow follows the alpha shape */
.icon {
  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.2));
}
```
Caption: Filter effects

### Common Pitfalls

- Using `backdrop-filter` without a translucent background — the filter has nothing to show through; set `background: rgb(255 255 255 / 0.6)`.
- Forgetting the `-webkit-` prefix for Safari — older Safari versions need `-webkit-backdrop-filter`; include both for compatibility.
- Applying heavy `backdrop-filter` to full-screen elements — kills performance on low-end devices; restrict to small overlays.
- Expecting `mix-blend-mode` to blend with content outside the parent stacking context — it blends only within the same context; use `isolation: isolate` on a parent to contain blending.
- Using `box-shadow` on a transparent PNG icon and expecting the shadow to follow the shape — `box-shadow` is rectangular; use `filter: drop-shadow()` for alpha-aware shadows.

### Real-World Applications

- Apple's website uses `backdrop-filter` for sticky navigation bars over scrolling content (the iconic frosted-glass look since macOS 10.10 Yosemite).
- Stripe uses subtle `filter: drop-shadow()` on logo SVGs so the shadow follows the icon shape.
- Linear uses `mix-blend-mode: screen` for issue-status pills overlaid on colorful backgrounds.
- Vercel's deployment overlays use `backdrop-filter: blur()` for command palette modals.

### Interview Questions

- 1. What is the difference between `filter` and `backdrop-filter`? — `filter` applies to the element itself; `backdrop-filter` applies to what is behind the element (frosted glass).
- 2. Why use `drop-shadow()` instead of `box-shadow`? — `drop-shadow()` follows the element's alpha shape (good for transparent PNGs and CSS shapes); `box-shadow` is rectangular.
- 3. What does `isolation: isolate` do and when is it needed? — It creates a new stacking context so `mix-blend-mode` on children blends only within the parent, not with content behind it.
- 4. Why does `backdrop-filter` need a translucent background? — The filter shows what is behind the element; a fully opaque background hides it.
- 5. What is the performance concern with `backdrop-filter`? — It is GPU-composited but expensive on large areas; restrict to small overlays and add `will-change` if needed.

### Mini Project

Build a Frosted Glass Navbar: A sticky navbar with `backdrop-filter: blur()` that floats over a scrolling hero section with multiple gradient layers. Add a `mix-blend-mode` badge on top. Suggested approach:
  - Give the navbar a translucent background `rgb(255 255 255 / 0.6)`
  - Apply `backdrop-filter: blur(12px) saturate(180%)` and the `-webkit-` prefix
  - Add a colored badge with `mix-blend-mode: screen` and `isolation: isolate` on the navbar to contain it
  - Add a `drop-shadow()` to an SVG logo so the shadow follows the icon shape
  - Test on Safari (needs `-webkit-` prefix) and verify performance on mobile

### Exercises

1. Apply `filter: grayscale(1)` on hover for an image gallery and transition it smoothly.
2. Build a frosted-glass sticky header over a long scrolling page; include `-webkit-backdrop-filter`.
3. Use `mix-blend-mode: difference` on a fixed cursor-following element to invert the content beneath.
4. Replace a `box-shadow` on a transparent PNG icon with `filter: drop-shadow()` and observe the difference.
5. Use `isolation: isolate` on a card and `mix-blend-mode: multiply` on a child to keep the blending contained.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which CSS property applies a blur effect to whatever is BEHIND an element?
9. A) `filter: blur()`
10. B) `background-blur`
11. C) `backdrop-filter: blur()` (*)
12. D) `mix-blend-mode: blur`
13. Explanation: `backdrop-filter` filters what is behind the element (frosted glass); `filter` filters the element itself.
14. Q2: Which filter function follows the alpha shape of an element (good for PNG icons)?
15. A) `box-shadow`
16. B) `text-shadow`
17. C) `outline`
18. D) `drop-shadow()` (*)
19. Explanation: `drop-shadow()` follows the alpha shape; `box-shadow` is rectangular regardless of transparency.
20. Q3: Which property contains `mix-blend-mode` blending to a parent?
21. A) `isolation: isolate` (*)
22. B) `contain: paint`
23. C) `position: relative`
24. D) `display: flow-root`
25. Explanation: `isolation: isolate` creates a new stacking context so children blend only within the parent.
26. Q4: Why does `backdrop-filter` require a translucent background?
27. A) It is required by the spec
28. B) An opaque background hides the filtered content behind it (*)
29. C) To improve performance
30. D) To prevent crashes
31. Explanation: The filter shows what is behind the element; a fully opaque background covers the effect entirely.
32. Q5: Which prefix is required for older Safari versions?
33. A) `-moz-`
34. B) `-ms-`
35. C) `-webkit-` (*)
36. D) `-o-`
37. Explanation: Safari needs `-webkit-backdrop-filter`; include both prefixed and unprefixed for compatibility.
38. Q6: Which blend mode darkens like overlapping printed inks?
39. A) `screen`
40. B) `difference`
41. C) `lighten`
42. D) `multiply` (*)
43. Explanation: `multiply` multiplies channel values, darkening where layers overlap (like printing inks).
44. Q7: Which blend mode is great for a cursor highlight that inverts content beneath?
45. A) `difference` (*)
46. B) `multiply`
47. C) `screen`
48. D) `overlay`
49. Explanation: `difference` subtracts the lower color from the upper, producing an inversion-like effect.
50. Q8: What does `background-blend-mode` blend?
51. A) The element's text with its background
52. B) Multiple background layers on the same element (*)
53. C) The element with its parent
54. D) Two separate elements
55. Explanation: `background-blend-mode` blends the multiple backgrounds declared on a single element.
56. Q9: Which is a performance best practice for `backdrop-filter`?
57. A) Apply to full-screen elements
58. B) Use it instead of `filter`
59. C) Restrict to small overlays and add `will-change` if needed (*)
60. D) Always pair with `mix-blend-mode`
61. Explanation: `backdrop-filter` is expensive on large areas; restrict to small overlays and promote with `will-change` when needed.
62. Q10: Which statement about `filter` vs `backdrop-filter` is true?
63. A) They are aliases
64. B) `backdrop-filter` is deprecated
65. C) `filter` is GPU-only
66. D) `filter` applies to the element; `backdrop-filter` applies to what's behind it (*)
67. Explanation: `filter` filters the element itself (and its children); `backdrop-filter` filters the content behind the element.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which CSS property applies a blur effect to whatever is BEHIND an element?
  options:
    - "`filter: blur()`"
    - "`background-blur`"
    - "`backdrop-filter: blur()`"
    - "`mix-blend-mode: blur`"
  correctIndex: 2
  explanation: "`backdrop-filter` filters what is behind the element (frosted glass); `filter` filters the element itself."
- id: q2
  question: Which filter function follows the alpha shape of an element (good for PNG icons)?
  options:
    - "`box-shadow`"
    - "`text-shadow`"
    - "`outline`"
    - "`drop-shadow()`"
  correctIndex: 3
  explanation: "`drop-shadow()` follows the alpha shape; `box-shadow` is rectangular regardless of transparency."
- id: q3
  question: Which property contains `mix-blend-mode` blending to a parent?
  options:
    - "`isolation: isolate`"
    - "`contain: paint`"
    - "`position: relative`"
    - "`display: flow-root`"
  correctIndex: 0
  explanation: "`isolation: isolate` creates a new stacking context so children blend only within the parent."
- id: q4
  question: Why does `backdrop-filter` require a translucent background?
  options:
    - It is required by the spec
    - An opaque background hides the filtered content behind it
    - To improve performance
    - To prevent crashes
  correctIndex: 1
  explanation: The filter shows what is behind the element; a fully opaque background covers the effect entirely.
- id: q5
  question: Which prefix is required for older Safari versions?
  options:
    - "`-moz-`"
    - "`-ms-`"
    - "`-webkit-`"
    - "`-o-`"
  correctIndex: 2
  explanation: Safari needs `-webkit-backdrop-filter`; include both prefixed and unprefixed for compatibility.
- id: q6
  question: Which blend mode darkens like overlapping printed inks?
  options:
    - "`screen`"
    - "`difference`"
    - "`lighten`"
    - "`multiply`"
  correctIndex: 3
  explanation: "`multiply` multiplies channel values, darkening where layers overlap (like printing inks)."
- id: q7
  question: Which blend mode is great for a cursor highlight that inverts content beneath?
  options:
    - "`difference`"
    - "`multiply`"
    - "`screen`"
    - "`overlay`"
  correctIndex: 0
  explanation: "`difference` subtracts the lower color from the upper, producing an inversion-like effect."
- id: q8
  question: What does `background-blend-mode` blend?
  options:
    - The element's text with its background
    - Multiple background layers on the same element
    - The element with its parent
    - Two separate elements
  correctIndex: 1
  explanation: "`background-blend-mode` blends the multiple backgrounds declared on a single element."
- id: q9
  question: Which is a performance best practice for `backdrop-filter`?
  options:
    - Apply to full-screen elements
    - Use it instead of `filter`
    - Restrict to small overlays and add `will-change` if needed
    - Always pair with `mix-blend-mode`
  correctIndex: 2
  explanation: "`backdrop-filter` is expensive on large areas; restrict to small overlays and promote with `will-change` when needed."
- id: q10
  question: Which statement about `filter` vs `backdrop-filter` is true?
  options:
    - They are aliases
    - "`backdrop-filter` is deprecated"
    - "`filter` is GPU-only"
    - "`filter` applies to the element; `backdrop-filter` applies to what's behind it"
  correctIndex: 3
  explanation: "`filter` filters the element itself (and its children); `backdrop-filter` filters the content behind the element."
```

