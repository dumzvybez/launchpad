---
slug: css-transitions-transforms-animations
id: css-09
track: css
order: 9
title: Transitions, Transforms, and Animations
description: Bring interfaces to life with smooth transitions, transforms, and keyframe animations. Learn `transition`, `transform`, `@keyframes`, `animation`, the GPU-friendly properties, and `prefers-reduced-motion` for accessibility.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=2000s
whyItMatters: Bring interfaces to life with smooth transitions, transforms, and keyframe animations. Learn `transition`, `transform`, `@keyframes`, `animation`, the GPU-friendly properties, and `prefers-reduced-motion` for accessibility.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Transitions, Transforms, and Animations

## Transitions, Transforms, and Animations

### Why It Matters

Bring interfaces to life with smooth transitions, transforms, and keyframe animations. Learn `transition`, `transform`, `@keyframes`, `animation`, the GPU-friendly properties, and `prefers-reduced-motion` for accessibility.

Bring interfaces to life with smooth transitions, transforms, and keyframe animations. Learn `transition`, `transform`, `@keyframes`, `animation`, the GPU-friendly properties, and `prefers-reduced-motion` for accessibility.

### Prerequisites

- Stage 1-8 (especially Stage 4 colors and Stage 6 layout)
- Familiarity with hover/focus states

### Topics

- `transition` shorthand: property, duration, timing-function, delay
- Common timing functions: ease, ease-in, ease-out, ease-in-out, linear, cubic-bezier, steps
- `transform`: translate, rotate, scale, skew, matrix, 3D transforms
- `transform-origin` and `perspective`
- `@keyframes` and `animation` shorthand
- Which properties animate cheaply (transform, opacity) vs expensively (width, top, margin)
- `will-change` and how to use it sparingly
- `prefers-reduced-motion: reduce` and how to disable animation
- Scroll-driven animations (preview)

### Key Concepts

- Animate `transform` and `opacity` whenever possible — they are GPU-composited and do not trigger layout or paint; animating `width`, `top`, or `margin` triggers layout (reflow) and is expensive.
- `transition` is for state changes (hover, focus, class toggle); `@keyframes` is for scripted sequences with multiple stops.
- `cubic-bezier(x1, y1, x2, y2)` defines a custom easing curve; `steps(N)` is for sprite-sheet animation.
- `prefers-reduced-motion: reduce` is a user setting; respect it by reducing or removing motion.
- `will-change: transform` hints the browser to optimize, but overuse wastes memory; apply it just before animation and remove after.

```css
.button {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 200ms ease,
              box-shadow 200ms ease;
}
.button:hover { transform: translateY(-2px); }
.button:active { transform: translateY(0); }
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```
Caption: Transition

### Common Pitfalls

- Animating `width`, `height`, `top`, or `left` — these trigger layout (reflow) every frame; use `transform: translate/scale` instead.
- Forgetting `prefers-reduced-motion` — some users get sick from motion; always gate non-essential animation behind the media query.
- Setting `will-change: transform` permanently — it pins GPU memory; set it just-in-time and remove after.
- Transitioning `all` — unpredictable and slow; specify the exact properties you want to transition.
- Animating `display: none` -> `block` — display is not animatable; use opacity + transform + visibility, or the new `transition-behavior: allow-discrete` for `display`.

### Real-World Applications

- Stripe's buttons use a 200ms cubic-bezier transition on transform and box-shadow for the tactile "lift" feel.
- Linear uses `prefers-reduced-motion` to disable its subtle issue-card animations for users who request reduced motion.
- GitHub uses keyframe animations for the loading skeleton shimmer on issue lists.
- Vercel's deployment progress bar uses `transform: scaleX()` with a custom easing to show real-time progress without reflow.

### Interview Questions

- 1. Which CSS properties are cheapest to animate and why? — `transform` and `opacity` because they are GPU-composited and do not trigger layout or paint.
- 2. What is the difference between `transition` and `animation`? — `transition` animates between two states on a property change; `animation` plays a scripted sequence defined by `@keyframes` with multiple stops and loop control.
- 3. What does `cubic-bezier(0.4, 0, 0.2, 1)` represent? — A custom easing curve (Material Design's "standard" easing); the four values are the control points of the cubic bezier.
- 4. Why must you respect `prefers-reduced-motion`? — Some users (vestibular disorders) get motion sick; accessibility guidelines require reducing non-essential motion.
- 5. Why is `will-change` a "use sparingly" property? — It preallocates GPU resources; overuse wastes memory and can hurt performance.

### Mini Project

Build an Animated Card Flip: A card that flips on click to reveal content on the back, with `transform: rotateY(180deg)` and `backface-visibility: hidden`. Respects `prefers-reduced-motion` by falling back to a cross-fade. Suggested approach:
  - Use a flex container with `perspective: 800px` on the parent
  - Build `.card-inner` with `transform-style: preserve-3d; transition: transform 600ms`
  - Front and back faces use `backface-visibility: hidden; position: absolute; inset: 0`
  - Back face starts at `transform: rotateY(180deg)`
  - Add a `.flipped` class on the parent that rotates `.card-inner` by 180deg
  - In `@media (prefers-reduced-motion: reduce)`, swap to opacity transitions

### Exercises

1. Replace a `width` animation with `transform: scaleX()` and verify the animation is smoother.
2. Build a keyframe shimmer placeholder using a linear gradient and `background-position`.
3. Add a `prefers-reduced-motion` block that disables every animation in your stylesheet.
4. Experiment with `cubic-bezier` curves on easings.net and pick three to apply to different UI elements.
5. Use `will-change: transform` on an element during a hover, then remove it on transitionend, and verify memory is released.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which two properties are cheapest to animate because they are GPU-composited?
9. A) `transform` and `opacity` (*)
10. B) `width` and `height`
11. C) `top` and `left`
12. D) `margin` and `padding`
13. Explanation: `transform` and `opacity` are composited on the GPU and do not trigger layout or paint; animating layout properties is expensive.
14. Q2: Which media query disables animations for users who request reduced motion?
15. A) `@media (no-motion)`
16. B) `@media (prefers-reduced-motion: reduce)` (*)
17. C) `@media (animation: off)`
18. D) `@media (motion: none)`
19. Explanation: `prefers-reduced-motion: reduce` is the user setting; respect it by shortening or removing animations.
20. Q3: What does `transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1)` specify?
21. A) A 200ms transform animation with a custom easing curve (*)
22. B) A 200ms transform with linear easing
23. C) A 200s transform with steps easing
24. D) No transition; cubic-bezier is invalid
25. Explanation: The shorthand specifies the property, duration, and timing function — here a custom cubic-bezier easing.
26. Q4: Which property is NOT animatable in a way that triggers layout?
27. A) opacity
28. B) None (*)
29. C) transform
30. D) width
31. Explanation: `width` triggers layout (reflow) on every frame; opacity and transform do not.
32. Q5: What does `@keyframes spin { to { transform: rotate(360deg); } }` do?
33. A) Defines a static rotation
34. B) Disables rotation
35. C) Defines a single keyframe that rotates to 360deg (*)
36. D) Reverses rotation
37. Explanation: `@keyframes` defines an animation; `to` is the 100% state, so the element rotates to 360deg by the end.
38. Q6: Why is `transition: all` discouraged?
39. A) It is invalid
40. B) It only works on hover
41. C) It disables GPU compositing
42. D) It transitions every property unpredictably, which is slow and surprising (*)
43. Explanation: `all` transitions every changed property, including expensive ones; specify each property explicitly.
44. Q7: Which CSS hint preallocates GPU resources for an upcoming animation?
45. A) `will-change` (*)
46. B) `transition-hint`
47. C) `animation-prep`
48. D) `prefers-reduced-motion`
49. Explanation: `will-change: transform` tells the browser to optimize for a future change; use it just-in-time and remove after.
50. Q8: Why is animating `display: none -> block` not straightforward?
51. A) It is too slow
52. B) `display` is not animatable; use opacity/transform with visibility, or `transition-behavior: allow-discrete` (*)
53. C) It is deprecated
54. D) It requires JavaScript
55. Explanation: `display` cannot be smoothly animated; use opacity + visibility, or `allow-discrete` (CSS Transitions Level 2).
56. Q9: Which timing function divides the animation into N equal jumps?
57. A) `cubic-bezier`
58. B) `ease-in-out`
59. C) `steps(N)` (*)
60. D) `linear`
61. Explanation: `steps(N, [start|end])` divides the animation into N discrete jumps; useful for sprite-sheet animation.
62. Q10: Which property controls the anchor point for `transform: rotate()`?
63. A) `transform-anchor`
64. B) `transform-box`
65. C) `transform-style`
66. D) `transform-origin` (*)
67. Explanation: `transform-origin` sets the point around which transforms are applied; default is the element's center (50% 50%).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which two properties are cheapest to animate because they are GPU-composited?
  options:
    - "`transform` and `opacity`"
    - "`width` and `height`"
    - "`top` and `left`"
    - "`margin` and `padding`"
  correctIndex: 0
  explanation: "`transform` and `opacity` are composited on the GPU and do not trigger layout or paint; animating layout properties is expensive."
- id: q2
  question: Which media query disables animations for users who request reduced motion?
  options:
    - "`@media (no-motion)`"
    - "`@media (prefers-reduced-motion: reduce)`"
    - "`@media (animation: off)`"
    - "`@media (motion: none)`"
  correctIndex: 1
  explanation: "`prefers-reduced-motion: reduce` is the user setting; respect it by shortening or removing animations."
- id: q3
  question: "What does `transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1)` specify?"
  options:
    - A 200ms transform animation with a custom easing curve
    - A 200ms transform with linear easing
    - A 200s transform with steps easing
    - No transition; cubic-bezier is invalid
  correctIndex: 0
  explanation: The shorthand specifies the property, duration, and timing function — here a custom cubic-bezier easing.
- id: q4
  question: Which property is NOT animatable in a way that triggers layout?
  options:
    - opacity
    - None
    - transform
    - width
  correctIndex: 1
  explanation: "`width` triggers layout (reflow) on every frame; opacity and transform do not."
- id: q5
  question: "What does `@keyframes spin { to { transform: rotate(360deg); } }` do?"
  options:
    - Defines a static rotation
    - Disables rotation
    - Defines a single keyframe that rotates to 360deg
    - Reverses rotation
  correctIndex: 2
  explanation: "`@keyframes` defines an animation; `to` is the 100% state, so the element rotates to 360deg by the end."
- id: q6
  question: "Why is `transition: all` discouraged?"
  options:
    - It is invalid
    - It only works on hover
    - It disables GPU compositing
    - It transitions every property unpredictably, which is slow and surprising
  correctIndex: 3
  explanation: "`all` transitions every changed property, including expensive ones; specify each property explicitly."
- id: q7
  question: Which CSS hint preallocates GPU resources for an upcoming animation?
  options:
    - "`will-change`"
    - "`transition-hint`"
    - "`animation-prep`"
    - "`prefers-reduced-motion`"
  correctIndex: 0
  explanation: "`will-change: transform` tells the browser to optimize for a future change; use it just-in-time and remove after."
- id: q8
  question: "Why is animating `display: none -> block` not straightforward?"
  options:
    - It is too slow
    - "`display` is not animatable; use opacity/transform with visibility, or `transition-behavior: allow-discrete`"
    - It is deprecated
    - It requires JavaScript
  correctIndex: 1
  explanation: "`display` cannot be smoothly animated; use opacity + visibility, or `allow-discrete` (CSS Transitions Level 2)."
- id: q9
  question: Which timing function divides the animation into N equal jumps?
  options:
    - "`cubic-bezier`"
    - "`ease-in-out`"
    - "`steps(N)`"
    - "`linear`"
  correctIndex: 2
  explanation: "`steps(N, [start|end])` divides the animation into N discrete jumps; useful for sprite-sheet animation."
- id: q10
  question: "Which property controls the anchor point for `transform: rotate()`?"
  options:
    - "`transform-anchor`"
    - "`transform-box`"
    - "`transform-style`"
    - "`transform-origin`"
  correctIndex: 3
  explanation: "`transform-origin` sets the point around which transforms are applied; default is the element's center (50% 50%)."
```

