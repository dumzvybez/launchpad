---
slug: css-colors-backgrounds-gradients
id: css-04
track: css
order: 4
title: Colors, Backgrounds, and Gradients
description: Specify color with hex, rgb(), hsl(), oklch(), and the new color-mix(). Layer backgrounds, gradients, and `background-clip`, and learn the difference between sRGB, Display P3, and perceptually uniform color spaces.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=750s
whyItMatters: Specify color with hex, rgb(), hsl(), oklch(), and the new color-mix(). Layer backgrounds, gradients, and `background-clip`, and learn the difference between sRGB, Display P3, and perceptually uniform color spaces.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Colors, Backgrounds, and Gradients

## Colors, Backgrounds, and Gradients

### Why It Matters

Specify color with hex, rgb(), hsl(), oklch(), and the new color-mix(). Layer backgrounds, gradients, and `background-clip`, and learn the difference between sRGB, Display P3, and perceptually uniform color spaces.

Specify color with hex, rgb(), hsl(), oklch(), and the new color-mix(). Layer backgrounds, gradients, and `background-clip`, and learn the difference between sRGB, Display P3, and perceptually uniform color spaces.

### Prerequisites

- Stage 1: Getting Started with CSS
- Stage 2: Selectors and Specificity
- Stage 3: The Box Model and Sizing

### Topics

- Color formats: hex, rgb()/rgba(), hsl()/hsla(), oklch(), color()
- The color-mix() function for blending
- currentColor and inherit
- Background shorthand: color, image, position, size, repeat, origin, clip, attachment
- Linear, radial, and conic gradients
- Multiple backgrounds and layering order
- background-clip: text for gradient text
- Color gamuts: sRGB vs Display P3 vs Rec. 2020

### Key Concepts

- `oklch(L C H / a)` is perceptually uniform: equal numeric steps look equally different to humans.
- `color-mix(in oklch, red, blue 40%)` blends two colors in a chosen color space; great for hover states.
- `currentColor` resolves to the element's computed `color`, so borders and SVG fills track text color automatically.
- Multiple backgrounds are listed front-to-back: the first listed is on top, the last is on the bottom.
- `background-clip: text` clips a background to the text glyphs but requires `-webkit-text-fill-color: transparent`.

```css
.hex      { color: #1572b6; }
.rgb      { color: rgb(21, 114, 182); }
.rgba     { color: rgb(21 114 182 / 0.5); }       /* modern slash alpha */
.hsl      { color: hsl(204 79% 40%); }
.oklch    { color: oklch(54% 0.13 245); }         /* perceptually uniform */
.mix      { color: color-mix(in oklch, red, blue 50%); }
.current  { color: crimson; border: 1px solid currentColor; }
```
Caption: Color formats

### Common Pitfalls

- Using rgba() with a leading zero alpha as the only "transparency" tool — modern syntax `rgb(0 0 0 / 0.5)` is clearer and supports all formats.
- Forgetting that the first background listed paints on top — your hero image is hidden by an overlay listed before it; list overlays first, image last.
- `background-clip: text` showing nothing — you must also set `-webkit-text-fill-color: transparent` or `color: transparent`, and the element must contain text.
- Using sRGB colors and assuming they cover the whole display — Apple, Samsung, and modern monitors render Display P3; use `color(display-p3 ...)` or `oklch()` for vivid greens/reds.
- Hardcoding hex pairs for hover states instead of `color-mix()` — `color-mix(in oklch, var(--brand), black 15%)` produces a darker shade automatically.

### Real-World Applications

- Stripe uses subtle linear gradients on buttons and cards to suggest depth without skeuomorphic shadows.
- Linear uses conic and mesh gradients for product hero backgrounds and issue status indicators.
- Vercel's homepage uses `background-clip: text` for gradient logos that match brand colors.
- Apple's website uses Display P3 photography and oklch-defined accent colors that pop on P3-capable displays.

### Interview Questions

- 1. What is the advantage of oklch over hsl? — oklch is perceptually uniform; equal numeric steps look equally different, so palettes and mixes look consistent.
- 2. What does `color-mix(in oklch, red, blue 50%)` return? — A color halfway between red and blue in the oklch color space.
- 3. In what order do multiple backgrounds paint? — First listed is on top, last listed is the bottom layer.
- 4. What two properties are required for gradient text? — `background-clip: text` plus `-webkit-text-fill-color: transparent` (or `color: transparent`).
- 5. What is `currentColor` and when is it useful? — It resolves to the element's computed `color`; useful for borders, box-shadows, and SVG fills that should track text color.

### Mini Project

Build a Gradient Hero Section: A full-viewport hero with a layered mesh gradient background, gradient text headline, and a CTA button whose hover state is generated by `color-mix()`. Suggested approach:
  - Use `min-height: 100dvh` for the hero
  - Layer 2-3 radial gradients over a base color for the mesh effect
  - Apply `background-clip: text` to the headline with a linear gradient
  - Define `--brand: oklch(60% 0.2 250)` and use `color-mix(in oklch, var(--brand), white 20%)` for the button hover
  - Add a fallback solid color for browsers without oklch support

### Exercises

1. Convert a hex palette to oklch using a tool like oklch.com; observe that mixes look perceptually even.
2. Build a conic-gradient color wheel and rotate it with `@keyframes` (preview of Stage 9).
3. Layer a transparent-to-black gradient over an image to make white text readable.
4. Use `color-mix()` to generate 5 hover shades of a single brand color.
5. Test your gradients on a Display P3 display (or DevTools "Emulate CSS media feature color-gamut") and observe saturation.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which color format is perceptually uniform?
9. A) oklch() (*)
10. B) hex
11. C) rgb()
12. D) hsl()
13. Explanation: oklch (OK Lightness Chroma Hue) is designed so equal numeric steps look equally different to the human eye.
14. Q2: In what order do multiple backgrounds paint?
15. A) Last listed is on top
16. B) Alphabetical
17. C) Reverse DOM order
18. D) First listed is on top (*)
19. Explanation: Backgrounds are listed front-to-back; the first listed paints on top, the last is the base.
20. Q3: Which two properties together produce gradient text?
21. A) `background-clip: text` and `-webkit-text-fill-color: transparent` (*)
22. B) `color: transparent` and `text-shadow: none`
23. C) `background: gradient()` and `color: gradient`
24. D) `text-fill: gradient` and `clip: text`
25. Explanation: `background-clip: text` clips the background to glyphs; setting the text fill color transparent reveals the gradient.
26. Q4: What does `color-mix(in oklch, red, blue 50%)` return?
27. A) Red with 50% alpha
28. B) A color halfway between red and blue in oklch space (*)
29. C) Blue with 50% alpha
30. D) Purple in sRGB only
31. Explanation: `color-mix()` blends two colors by the given percentage in the named color space.
32. Q5: Which value resolves to the element's computed `color`?
33. A) inherit
34. B) auto
35. C) currentColor (*)
36. D) initial
37. Explanation: `currentColor` dynamically references the element's own computed `color`, useful for borders, fills, and shadows.
38. Q6: Which gradient type produces a "color wheel" when given `border-radius: 50%`?
39. A) linear-gradient
40. B) radial-gradient
41. C) repeating-linear-gradient
42. D) conic-gradient (*)
43. Explanation: Conic gradients rotate around a center point, so a circle with conic colors looks like a color wheel.
44. Q7: Which statement about Display P3 is true?
45. A) It has a wider gamut than sRGB, supporting more vivid greens/reds (*)
46. B) It is a subset of sRGB
47. C) It is only available in print CSS
48. D) It is required for oklch
49. Explanation: Display P3 covers more chromaticities than sRGB; modern displays (Apple, Samsung) render P3 content with more vivid colors.
50. Q8: What is the modern syntax for an rgba color at 50% alpha?
51. A) `rgba(0,0,0,0.5)`
52. B) `rgb(0 0 0 / 0.5)` (*)
53. C) `rgb(0,0,0,50%)`
54. D) `color(0 0 0 alpha 0.5)`
55. Explanation: Modern CSS allows space-separated channels with a slash for alpha: `rgb(0 0 0 / 0.5)`.
56. Q9: What does `background-size: cover` do?
57. A) Stretches the image to 100% width
58. B) Tiles the image
59. C) Scales the image to cover the element, cropping overflow (*)
60. D) Hides the image
61. Explanation: `cover` scales the image to fill the box while preserving aspect ratio, cropping any overflow.
62. Q10: Which is a robust way to generate a hover shade from a single brand variable?
63. A) Manually pick a second hex
64. B) Apply `filter: brightness(1.2)`
65. C) Add a black overlay
66. D) `color-mix(in oklch, var(--brand), white 20%)` (*)
67. Explanation: `color-mix()` lets you derive a tint/shade from one source color, so theme changes propagate automatically.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which color format is perceptually uniform?
  options:
    - oklch()
    - hex
    - rgb()
    - hsl()
  correctIndex: 0
  explanation: oklch (OK Lightness Chroma Hue) is designed so equal numeric steps look equally different to the human eye.
- id: q2
  question: In what order do multiple backgrounds paint?
  options:
    - Last listed is on top
    - Alphabetical
    - Reverse DOM order
    - First listed is on top
  correctIndex: 3
  explanation: Backgrounds are listed front-to-back; the first listed paints on top, the last is the base.
- id: q3
  question: Which two properties together produce gradient text?
  options:
    - "`background-clip: text` and `-webkit-text-fill-color: transparent`"
    - "`color: transparent` and `text-shadow: none`"
    - "`background: gradient()` and `color: gradient`"
    - "`text-fill: gradient` and `clip: text`"
  correctIndex: 0
  explanation: "`background-clip: text` clips the background to glyphs; setting the text fill color transparent reveals the gradient."
- id: q4
  question: What does `color-mix(in oklch, red, blue 50%)` return?
  options:
    - Red with 50% alpha
    - A color halfway between red and blue in oklch space
    - Blue with 50% alpha
    - Purple in sRGB only
  correctIndex: 1
  explanation: "`color-mix()` blends two colors by the given percentage in the named color space."
- id: q5
  question: Which value resolves to the element's computed `color`?
  options:
    - inherit
    - auto
    - currentColor
    - initial
  correctIndex: 2
  explanation: "`currentColor` dynamically references the element's own computed `color`, useful for borders, fills, and shadows."
- id: q6
  question: 'Which gradient type produces a "color wheel" when given `border-radius: 50%`?'
  options:
    - linear-gradient
    - radial-gradient
    - repeating-linear-gradient
    - conic-gradient
  correctIndex: 3
  explanation: Conic gradients rotate around a center point, so a circle with conic colors looks like a color wheel.
- id: q7
  question: Which statement about Display P3 is true?
  options:
    - It has a wider gamut than sRGB, supporting more vivid greens/reds
    - It is a subset of sRGB
    - It is only available in print CSS
    - It is required for oklch
  correctIndex: 0
  explanation: Display P3 covers more chromaticities than sRGB; modern displays (Apple, Samsung) render P3 content with more vivid colors.
- id: q8
  question: What is the modern syntax for an rgba color at 50% alpha?
  options:
    - "`rgba(0,0,0,0.5)`"
    - "`rgb(0 0 0 / 0.5)`"
    - "`rgb(0,0,0,50%)`"
    - "`color(0 0 0 alpha 0.5)`"
  correctIndex: 1
  explanation: "Modern CSS allows space-separated channels with a slash for alpha: `rgb(0 0 0 / 0.5)`."
- id: q9
  question: "What does `background-size: cover` do?"
  options:
    - Stretches the image to 100% width
    - Tiles the image
    - Scales the image to cover the element, cropping overflow
    - Hides the image
  correctIndex: 2
  explanation: "`cover` scales the image to fill the box while preserving aspect ratio, cropping any overflow."
- id: q10
  question: Which is a robust way to generate a hover shade from a single brand variable?
  options:
    - Manually pick a second hex
    - "Apply `filter: brightness(1.2)`"
    - Add a black overlay
    - "`color-mix(in oklch, var(--brand), white 20%)`"
  correctIndex: 3
  explanation: "`color-mix()` lets you derive a tint/shade from one source color, so theme changes propagate automatically."
```

