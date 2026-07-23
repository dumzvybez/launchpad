---
slug: css-form-styling-inputs
id: css-14
track: css
order: 14
title: Form Styling and Inputs
description: Form controls are notoriously hard to style. Learn to reset native styles, build custom checkboxes/radios, style range sliders, file inputs, select menus, and the new `<selectmenu>`/`<input type="color">`, while preserving accessibility and keyboard navigation.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=800s
whyItMatters: Form controls are notoriously hard to style. Learn to reset native styles, build custom checkboxes/radios, style range sliders, file inputs, select menus, and the new `<selectmenu>`/`<input type="color">`, while preserving accessibility and keyboard navigation.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Form Styling and Inputs

## Form Styling and Inputs

### Why It Matters

Form controls are notoriously hard to style. Learn to reset native styles, build custom checkboxes/radios, style range sliders, file inputs, select menus, and the new `<selectmenu>`/`<input type="color">`, while preserving accessibility and keyboard navigation.

Form controls are notoriously hard to style. Learn to reset native styles, build custom checkboxes/radios, style range sliders, file inputs, select menus, and the new `<selectmenu>`/`<input type="color">`, while preserving accessibility and keyboard navigation.

### Prerequisites

- Stage 1-13 (especially Stage 6 flexbox, Stage 9 transitions, Stage 13 pseudo-classes)
- Some familiarity with HTML form controls

### Topics

- The default appearance and how to reset it (`appearance: none`)
- Styling text inputs, textareas, and the `:focus-visible` ring
- Custom checkboxes and radios using `:checked` + `::before/::after`
- Custom range sliders (`::-webkit-slider-thumb`, `::-moz-range-thumb`)
- File inputs (visually hide, custom label trigger)
- `<select>` styling limits and the `appearance: none` + custom arrow trick
- `:user-invalid` for after-interaction validation styling
- `accent-color` for cheap native control theming
- The new `<selectmenu>` (or `<select>` with `appearance: base-select`) and the Popover API

### Key Concepts

- `appearance: none` removes native OS styling so you can apply your own — but you must rebuild focus and keyboard affordances.
- `accent-color: var(--brand)` is the cheapest way to theme native checkboxes, radios, ranges, and progress bars without custom markup.
- Always hide the native checkbox visually (`position: absolute; opacity: 0;`) rather than with `display: none`, so it remains keyboard-focusable and AT-reachable.
- Style `:user-invalid` (not `:invalid`) so errors only show after the user interacts, preventing red borders on page load.
- Custom range thumbs need both `::-webkit-slider-thumb` and `::-moz-range-thumb` for cross-browser support.

```css
:root { accent-color: var(--color-brand); }
/* Applies to checkboxes, radios, range, progress, meter. */
```
Caption: accent-color for quick theming

### Common Pitfalls

- Using `display: none` to hide the native checkbox — it removes the input from the tab order and breaks keyboard use; use visually-hidden (clip/opacity) instead.
- Styling `:invalid` instead of `:user-invalid` — `:invalid` matches on page load before the user has typed, scaring them with red borders.
- Forgetting `::-moz-range-thumb` for Firefox — Chrome's `::-webkit-slider-thumb` does not apply to Firefox; both are required.
- Using `appearance: none` without rebuilding focus affordances — the default focus ring is gone; add `:focus-visible` styles yourself.
- Custom `<select>` with `appearance: none` and a custom arrow but missing the `<option>` styling — the dropdown list is still OS-styled and inconsistent across browsers; consider the new `<selectmenu>`/Popover API.

### Real-World Applications

- Stripe's payment forms use `appearance: none` + custom focus rings on every input for a branded, consistent experience.
- Linear uses custom checkboxes styled via `:checked` + `::after` to render issue-completion checkmarks.
- Vercel's settings pages use `accent-color` for native control theming where fully custom styling is overkill.
- GitHub uses custom range sliders for repository search filters with `::-webkit-slider-thumb` and `::-moz-range-thumb`.

### Interview Questions

- 1. Why use `appearance: none` on form controls? — It removes native OS styling so you can apply a consistent custom look, but you must rebuild focus affordances.
- 2. How do you hide a native checkbox without breaking keyboard access? — Visually hide it with `position: absolute; width: 1px; height: 1px; opacity: 0;` (not `display: none`, which removes it from the tab order).
- 3. Why style `:user-invalid` instead of `:invalid`? — `:invalid` matches on page load before the user types; `:user-invalid` only matches after interaction, avoiding premature error styling.
- 4. What is the cheapest way to theme native checkboxes/radios/ranges? — `accent-color: var(--brand);` colors the native control without custom markup.
- 5. Why do custom range sliders need both `::-webkit-slider-thumb` and `::-moz-range-thumb`? — Each browser engine has its own pseudo-element for the thumb; both are required for cross-browser support.

### Mini Project

Build a Custom Form Controls Kit: Implement a custom checkbox, radio, range slider, and file input that all preserve keyboard accessibility and respect `:focus-visible`. Demonstrate `appearance: none`, `:checked`, `:user-invalid`, and `accent-color` (as a fallback). Suggested approach:
  - Build the custom checkbox with a visually-hidden input and `::after` checkmark
  - Build the radio similarly with a `::after` dot
  - Build the range with both `::-webkit-slider-thumb` and `::-moz-range-thumb`
  - Build the file input by visually hiding it and triggering via a `<label>`
  - Test each control with Tab, Space, Arrow keys, and a screen reader

### Exercises

1. Apply `accent-color: var(--brand)` to a form and observe native controls theme instantly.
2. Build a custom checkbox using `:checked + .box::after` and verify keyboard Space toggles it.
3. Style `:user-invalid` on an email input and confirm the error only appears after blur, not on load.
4. Build a cross-browser range slider with both `::-webkit-slider-thumb` and `::-moz-range-thumb`.
5. Use `appearance: none` on a `<select>` and add a custom SVG arrow via `background-image`.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which property removes native OS styling from a form control?
9. A) `display: none`
10. B) `appearance: none` (*)
11. C) `style: custom`
12. D) `theme: none`
13. Explanation: `appearance: none` (or `appearance: none`) removes native styling so you can apply your own; rebuild focus affordances yourself.
14. Q2: Which is the safest way to visually hide a native checkbox while keeping it keyboard-focusable?
15. A) `display: none`
16. B) `visibility: hidden`
17. C) `position: absolute; width: 1px; height: 1px; opacity: 0;` (*)
18. D) `clip: rect(0,0,0,0); display: none`
19. Explanation: Visually-hidden technique keeps the input in the tab order and accessible to AT; `display: none` removes it from both.
20. Q3: Which pseudo-class matches an invalid control after the user interacts with it?
21. A) `:user-invalid` (*)
22. B) `:invalid`
23. C) `:failed`
24. D) `:error`
25. Explanation: `:user-invalid` matches after user interaction, avoiding red borders on page load.
26. Q4: Which is the cheapest way to theme native checkboxes/radios/ranges?
27. A) Rebuild with custom markup
28. B) `accent-color: var(--brand)` (*)
29. C) `appearance: auto`
30. D) `filter: hue-rotate()`
31. Explanation: `accent-color` themes native controls without custom markup, perfect for low-effort branding.
32. Q5: Which pseudo-element is required for the range thumb in Firefox?
33. A) `::-webkit-slider-thumb`
34. B) `::-ms-thumb`
35. C) `::-moz-range-thumb` (*)
36. D) `::thumb`
37. Explanation: Firefox uses `::-moz-range-thumb`; Chrome/Safari use `::-webkit-slider-thumb`. Both are required for cross-browser support.
38. Q6: Why avoid `:invalid` for showing form errors?
39. A) It is deprecated
40. B) It only works on text inputs
41. C) It is slower than `:user-invalid`
42. D) It matches on page load before the user has typed, scaring them prematurely (*)
43. Explanation: `:invalid` matches an empty required field on load; use `:user-invalid` to gate errors behind interaction.
44. Q7: Which CSS rule makes a custom checkbox's checkmark appear only when checked?
45. A) `input:checked + .box::after { transform: scale(1); }` (*)
46. B) `.box::after { transform: scale(1); }`
47. C) `.box:checked::after { transform: scale(1); }`
48. D) `input + .box::after { transform: scale(1); }`
49. Explanation: The `:checked` state is on the input, and the visual box is a sibling; `input:checked + .box::after` targets the box's after pseudo when the input is checked.
50. Q8: Which pseudo-element styles the dropdown arrow of a `<select>` after `appearance: none`?
51. A) `::select-arrow`
52. B) There is no standard pseudo-element; use a background-image on the select (*)
53. C) `::arrow`
54. D) `::cue`
55. Explanation: There is no standard `<select>` arrow pseudo-element; the common approach is `appearance: none` plus a custom `background-image` arrow.
56. Q9: Why must you rebuild focus affordances after `appearance: none`?
57. A) `appearance: none` disables the keyboard
58. B) It is required by the spec
59. C) The native focus ring is removed (*)
60. D) It improves performance
61. Explanation: `appearance: none` removes the native focus ring; you must add `:focus-visible` styles yourself to preserve accessibility.
62. Q10: Which approach lets you fully customize a `<select>` dropdown list (not just the trigger)?
63. A) `appearance: none` plus a background image
64. B) `::-webkit-select-list`
65. C) `::select-list`
66. D) The new `<selectmenu>` element or Popover API (limited browser support) (*)
67. Explanation: `appearance: none` only styles the trigger; fully custom dropdowns require the new `<selectmenu>` element or a Popover-based rebuild.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which property removes native OS styling from a form control?
  options:
    - "`display: none`"
    - "`appearance: none`"
    - "`style: custom`"
    - "`theme: none`"
  correctIndex: 1
  explanation: "`appearance: none` (or `appearance: none`) removes native styling so you can apply your own; rebuild focus affordances yourself."
- id: q2
  question: Which is the safest way to visually hide a native checkbox while keeping it keyboard-focusable?
  options:
    - "`display: none`"
    - "`visibility: hidden`"
    - "`position: absolute; width: 1px; height: 1px; opacity: 0;`"
    - "`clip: rect(0,0,0,0); display: none`"
  correctIndex: 2
  explanation: "Visually-hidden technique keeps the input in the tab order and accessible to AT; `display: none` removes it from both."
- id: q3
  question: Which pseudo-class matches an invalid control after the user interacts with it?
  options:
    - "`:user-invalid`"
    - "`:invalid`"
    - "`:failed`"
    - "`:error`"
  correctIndex: 0
  explanation: "`:user-invalid` matches after user interaction, avoiding red borders on page load."
- id: q4
  question: Which is the cheapest way to theme native checkboxes/radios/ranges?
  options:
    - Rebuild with custom markup
    - "`accent-color: var(--brand)`"
    - "`appearance: auto`"
    - "`filter: hue-rotate()`"
  correctIndex: 1
  explanation: "`accent-color` themes native controls without custom markup, perfect for low-effort branding."
- id: q5
  question: Which pseudo-element is required for the range thumb in Firefox?
  options:
    - "`::-webkit-slider-thumb`"
    - "`::-ms-thumb`"
    - "`::-moz-range-thumb`"
    - "`::thumb`"
  correctIndex: 2
  explanation: Firefox uses `::-moz-range-thumb`; Chrome/Safari use `::-webkit-slider-thumb`. Both are required for cross-browser support.
- id: q6
  question: Why avoid `:invalid` for showing form errors?
  options:
    - It is deprecated
    - It only works on text inputs
    - It is slower than `:user-invalid`
    - It matches on page load before the user has typed, scaring them prematurely
  correctIndex: 3
  explanation: "`:invalid` matches an empty required field on load; use `:user-invalid` to gate errors behind interaction."
- id: q7
  question: Which CSS rule makes a custom checkbox's checkmark appear only when checked?
  options:
    - "`input:checked + .box::after { transform: scale(1); }`"
    - "`.box::after { transform: scale(1); }`"
    - "`.box:checked::after { transform: scale(1); }`"
    - "`input + .box::after { transform: scale(1); }`"
  correctIndex: 0
  explanation: The `:checked` state is on the input, and the visual box is a sibling; `input:checked + .box::after` targets the box's after pseudo when the input is checked.
- id: q8
  question: "Which pseudo-element styles the dropdown arrow of a `<select>` after `appearance: none`?"
  options:
    - "`::select-arrow`"
    - There is no standard pseudo-element; use a background-image on the select
    - "`::arrow`"
    - "`::cue`"
  correctIndex: 1
  explanation: "There is no standard `<select>` arrow pseudo-element; the common approach is `appearance: none` plus a custom `background-image` arrow."
- id: q9
  question: "Why must you rebuild focus affordances after `appearance: none`?"
  options:
    - "`appearance: none` disables the keyboard"
    - It is required by the spec
    - The native focus ring is removed
    - It improves performance
  correctIndex: 2
  explanation: "`appearance: none` removes the native focus ring; you must add `:focus-visible` styles yourself to preserve accessibility."
- id: q10
  question: Which approach lets you fully customize a `<select>` dropdown list (not just the trigger)?
  options:
    - "`appearance: none` plus a background image"
    - "`::-webkit-select-list`"
    - "`::select-list`"
    - The new `<selectmenu>` element or Popover API (limited browser support)
  correctIndex: 3
  explanation: "`appearance: none` only styles the trigger; fully custom dropdowns require the new `<selectmenu>` element or a Popover-based rebuild."
```

