---
slug: css-css-accessibility-focus-color-contrast-prefers-reduced-motion
id: css-17
track: css
order: 17
title: CSS Accessibility — Focus, Color Contrast, prefers-reduced-motion
description: Accessibility is not optional. Learn visible focus rings, WCAG color contrast, `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`, forced-colors mode (Windows High Contrast), and the `:focus-visible` ring that respects user settings.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=1400s
whyItMatters: Accessibility is not optional. Learn visible focus rings, WCAG color contrast, `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`, forced-colors mode (Windows High Contrast), and the `:focus-visible` ring that respects user settings.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# CSS Accessibility — Focus, Color Contrast, prefers-reduced-motion

## CSS Accessibility — Focus, Color Contrast, prefers-reduced-motion

### Why It Matters

Accessibility is not optional. Learn visible focus rings, WCAG color contrast, `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`, forced-colors mode (Windows High Contrast), and the `:focus-visible` ring that respects user settings.

Accessibility is not optional. Learn visible focus rings, WCAG color contrast, `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`, forced-colors mode (Windows High Contrast), and the `:focus-visible` ring that respects user settings.

### Prerequisites

- Stage 1-16 (especially Stage 9 transitions and Stage 13 pseudo-classes)
- Familiarity with WCAG basics (Levels A, AA, AAA)

### Topics

- WCAG 2.1/2.2 color contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components)
- `:focus-visible` and never removing `outline: none` without a replacement
- `prefers-reduced-motion: reduce` — disable non-essential motion
- `prefers-contrast: more` — increase contrast for users who request it
- `prefers-color-scheme: light/dark` — respect OS theme
- Forced-colors mode (Windows High Contrast): `forced-color-adjust: none`, system color keywords
- Reading order and CSS `order` pitfalls (visual vs DOM order)
- `visually-hidden` utility for screen-reader-only content
- `scroll-behavior: smooth` and respecting reduced motion

### Key Concepts

- WCAG AA requires 4.5:1 contrast for normal text, 3:1 for large text and UI component boundaries; AAA requires 7:1 / 4.5:1.
- Never set `outline: none` without providing an alternative visible focus indicator (e.g., a `:focus-visible` ring with sufficient contrast).
- `prefers-reduced-motion: reduce` is a user setting; respect it by shortening or removing non-essential animation.
- Forced-colors mode (Windows High Contrast) replaces your colors with a user-chosen palette; use system color keywords (`ButtonText`, `Canvas`) and `forced-color-adjust: none` only where you must preserve brand.
- CSS `order` changes visual order but not DOM order, so screen-reader and tab order may diverge — restructure the DOM, don't just reorder with CSS.

```css
/* Bad: removes focus indicator entirely */
a:focus { outline: none; }

/* Good: ring only for keyboard users */
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
a:focus:not(:focus-visible) { outline: none; }
```
Caption: Visible focus ring

### Common Pitfalls

- Setting `outline: none` without a replacement — keyboard users have no visible focus indicator; always provide `:focus-visible` styles.
- Color contrast below 4.5:1 for normal text — fails WCAG AA; use a contrast checker (e.g., web.dev/contrast) for every text/background pair.
- Using CSS `order` to reorder flex/grid items — visual order changes but DOM, tab, and screen-reader order don't, causing confusion; restructure the DOM instead.
- Animating without gating `prefers-reduced-motion` — users with vestibular disorders may get sick; always provide a reduced-motion fallback.
- Forgetting forced-colors mode (Windows High Contrast) — your colorful UI becomes high-contrast black/white; use system color keywords and test with the emulator.

### Real-World Applications

- GitHub's entire UI uses `:focus-visible` rings and respects `prefers-reduced-motion` on its animations.
- Apple's website uses `prefers-color-scheme` for dark mode and provides high-contrast themes for accessibility.
- Stripe uses `visually-hidden` for screen-reader-only labels on icon-only buttons in payment forms.
- Vercel's dashboard is tested in forced-colors mode via the Windows High Contrast emulator and uses system color keywords on interactive controls.

### Interview Questions

- 1. What is the minimum color contrast ratio for normal text under WCAG AA? — 4.5:1 for normal text, 3:1 for large text and UI component boundaries.
- 2. Why use `:focus-visible` instead of `:focus`? — `:focus-visible` shows the ring only for keyboard/AT users, so mouse clickers don't see an ugly ring.
- 3. What does `prefers-reduced-motion: reduce` request? — The user wants minimal motion; reduce or remove non-essential animations.
- 4. What is forced-colors mode and how do you test for it? — Windows High Contrast replaces your palette with a user-chosen one; use `@media (forced-colors: active)` and the DevTools emulator.
- 5. Why is reordering with CSS `order` an accessibility problem? — It changes visual order but not DOM, tab, or screen-reader order, causing a mismatch between what users see and what AT reads.

### Mini Project

Build an Accessible Menu Component: A dropdown menu with visible `:focus-visible` rings, `prefers-reduced-motion` fallbacks, 4.5:1 contrast, screen-reader-only labels, and a forced-colors mode fallback using system color keywords. Suggested approach:
  - Use a `<button aria-expanded>` trigger and `<ul role="menu">` list
  - Style `:focus-visible` rings on every interactive element
  - Verify all text/background pairs pass 4.5:1 with a contrast checker
  - Add `visually-hidden` text for icon-only controls
  - Add a `@media (prefers-reduced-motion: reduce)` block that disables the dropdown slide animation
  - Add a `@media (forced-colors: active)` block with system color keywords

### Exercises

1. Audit a stylesheet for `outline: none` and add `:focus-visible` replacements for each.
2. Check every text/background color pair against WCAG AA (4.5:1) and adjust the failing ones.
3. Add a `prefers-reduced-motion` block and test by toggling the OS setting.
4. Use the DevTools "Emulate forced-colors: active" and verify your UI still works.
5. Use `visually-hidden` to add a screen-reader-only label to an icon-only button.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the minimum contrast ratio for normal text under WCAG AA?
9. A) 4.5:1 (*)
10. B) 3:1
11. C) 7:1
12. D) 2:1
13. Explanation: WCAG AA requires 4.5:1 for normal text, 3:1 for large text and UI component boundaries; AAA requires 7:1 / 4.5:1.
14. Q2: Why use `:focus-visible` instead of `:focus` for the focus ring?
15. A) It is faster
16. B) It only shows for keyboard/AT users, so mouse clickers don't see the ring (*)
17. C) It is required by the spec
18. D) It only works on links
19. Explanation: `:focus-visible` matches keyboard/AT focus, so mouse users see no ring on click while keyboard users still get one.
20. Q3: Which media query disables non-essential animation?
21. A) `@media (prefers-reduced-motion: reduce)` (*)
22. B) `@media (no-motion)`
23. C) `@media (animation: off)`
24. D) `@media (motion: none)`
25. Explanation: `prefers-reduced-motion: reduce` is the user setting; respect it by shortening or removing animation.
26. Q4: Why is reordering flex/grid items with CSS `order` an accessibility problem?
27. A) It is invalid CSS
28. B) Visual order changes but DOM, tab, and screen-reader order don't (*)
29. C) It triggers reflow
30. D) It is slower than DOM reordering
31. Explanation: `order` changes only visual order; tab and screen-reader order follow the DOM, causing a mismatch.
32. Q5: Which media query targets Windows High Contrast mode?
33. A) `@media (high-contrast: active)`
34. B) `@media (contrast: more)`
35. C) `@media (forced-colors: active)` (*)
36. D) `@media (windows-hc)`
37. Explanation: `@media (forced-colors: active)` matches Windows High Contrast and similar modes; the user palette replaces your colors.
38. Q6: Which CSS keyword preserves a brand color in forced-colors mode?
39. A) `color: brand`
40. B) `appearance: none`
41. C) `theme: preserve`
42. D) `forced-color-adjust: none` (*)
43. Explanation: `forced-color-adjust: none` opts the element out of forced-colors substitution, preserving your authored colors (use sparingly).
44. Q7: Which technique hides content visually but keeps it for screen readers?
45. A) `.visually-hidden` with clip/position absolute (*)
46. B) `display: none`
47. C) `visibility: hidden`
48. D) `opacity: 0`
49. Explanation: The visually-hidden pattern (position absolute, 1px size, clip) keeps content in the accessibility tree while hiding it visually; `display: none` removes it entirely.
50. Q8: Which system color keyword styles button text in forced-colors mode?
51. A) `--button-text`
52. B) `ButtonText` (*)
53. C) `currentColor`
54. D) `auto`
55. Explanation: System color keywords like `ButtonText`, `ButtonFace`, `Canvas`, and `CanvasText` map to the user's high-contrast palette.
56. Q9: What contrast ratio does WCAG AA require for large text (>=18pt or 14pt bold)?
57. A) 4.5:1
58. B) 7:1
59. C) 3:1 (*)
60. D) 2:1
61. Explanation: Large text needs 3:1 under AA (lower than normal text's 4.5:1) because larger size is easier to read at lower contrast.
62. Q10: Which property should you NEVER remove without providing a replacement?
63. A) `color`
64. B) `background`
65. C) `font-size`
66. D) `outline` on `:focus` (*)
67. Explanation: Removing `outline` on `:focus` strips the keyboard focus indicator; always provide a visible `:focus-visible` alternative.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the minimum contrast ratio for normal text under WCAG AA?
  options:
    - 4.5:1
    - 3:1
    - 7:1
    - 2:1
  correctIndex: 0
  explanation: WCAG AA requires 4.5:1 for normal text, 3:1 for large text and UI component boundaries; AAA requires 7:1 / 4.5:1.
- id: q2
  question: Why use `:focus-visible` instead of `:focus` for the focus ring?
  options:
    - It is faster
    - It only shows for keyboard/AT users, so mouse clickers don't see the ring
    - It is required by the spec
    - It only works on links
  correctIndex: 1
  explanation: "`:focus-visible` matches keyboard/AT focus, so mouse users see no ring on click while keyboard users still get one."
- id: q3
  question: Which media query disables non-essential animation?
  options:
    - "`@media (prefers-reduced-motion: reduce)`"
    - "`@media (no-motion)`"
    - "`@media (animation: off)`"
    - "`@media (motion: none)`"
  correctIndex: 0
  explanation: "`prefers-reduced-motion: reduce` is the user setting; respect it by shortening or removing animation."
- id: q4
  question: Why is reordering flex/grid items with CSS `order` an accessibility problem?
  options:
    - It is invalid CSS
    - Visual order changes but DOM, tab, and screen-reader order don't
    - It triggers reflow
    - It is slower than DOM reordering
  correctIndex: 1
  explanation: "`order` changes only visual order; tab and screen-reader order follow the DOM, causing a mismatch."
- id: q5
  question: Which media query targets Windows High Contrast mode?
  options:
    - "`@media (high-contrast: active)`"
    - "`@media (contrast: more)`"
    - "`@media (forced-colors: active)`"
    - "`@media (windows-hc)`"
  correctIndex: 2
  explanation: "`@media (forced-colors: active)` matches Windows High Contrast and similar modes; the user palette replaces your colors."
- id: q6
  question: Which CSS keyword preserves a brand color in forced-colors mode?
  options:
    - "`color: brand`"
    - "`appearance: none`"
    - "`theme: preserve`"
    - "`forced-color-adjust: none`"
  correctIndex: 3
  explanation: "`forced-color-adjust: none` opts the element out of forced-colors substitution, preserving your authored colors (use sparingly)."
- id: q7
  question: Which technique hides content visually but keeps it for screen readers?
  options:
    - "`.visually-hidden` with clip/position absolute"
    - "`display: none`"
    - "`visibility: hidden`"
    - "`opacity: 0`"
  correctIndex: 0
  explanation: "The visually-hidden pattern (position absolute, 1px size, clip) keeps content in the accessibility tree while hiding it visually; `display: none` removes it entirely."
- id: q8
  question: Which system color keyword styles button text in forced-colors mode?
  options:
    - "`--button-text`"
    - "`ButtonText`"
    - "`currentColor`"
    - "`auto`"
  correctIndex: 1
  explanation: System color keywords like `ButtonText`, `ButtonFace`, `Canvas`, and `CanvasText` map to the user's high-contrast palette.
- id: q9
  question: What contrast ratio does WCAG AA require for large text (>=18pt or 14pt bold)?
  options:
    - 4.5:1
    - 7:1
    - 3:1
    - 2:1
  correctIndex: 2
  explanation: Large text needs 3:1 under AA (lower than normal text's 4.5:1) because larger size is easier to read at lower contrast.
- id: q10
  question: Which property should you NEVER remove without providing a replacement?
  options:
    - "`color`"
    - "`background`"
    - "`font-size`"
    - "`outline` on `:focus`"
  correctIndex: 3
  explanation: Removing `outline` on `:focus` strips the keyboard focus indicator; always provide a visible `:focus-visible` alternative.
```

