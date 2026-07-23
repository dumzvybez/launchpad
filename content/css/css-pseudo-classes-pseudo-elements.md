---
slug: css-pseudo-classes-pseudo-elements
id: css-13
track: css
order: 13
title: Pseudo-Classes and Pseudo-Elements
description: Pseudo-classes select elements in specific states (`:hover`, `:focus-visible`, `:nth-child`, `:placeholder-shown`). Pseudo-elements select generated content (`::before`, `::after`, `::selection`, `::marker`). Master both, plus `::placeholder`, `::backdrop`, and the new `::details-content` and `::view-transition-*` pseudo-elements.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=600s
whyItMatters: Pseudo-classes select elements in specific states (`:hover`, `:focus-visible`, `:nth-child`, `:placeholder-shown`). Pseudo-elements select generated content (`::before`, `::after`, `::selection`, `::marker`).
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Pseudo-Classes and Pseudo-Elements

## Pseudo-Classes and Pseudo-Elements

### Why It Matters

Pseudo-classes select elements in specific states (`:hover`, `:focus-visible`, `:nth-child`, `:placeholder-shown`). Pseudo-elements select generated content (`::before`, `::after`, `::selection`, `::marker`).

Pseudo-classes select elements in specific states (`:hover`, `:focus-visible`, `:nth-child`, `:placeholder-shown`). Pseudo-elements select generated content (`::before`, `::after`, `::selection`, `::marker`). Master both, plus `::placeholder`, `::backdrop`, and the new `::details-content` and `::view-transition-*` pseudo-elements.

### Prerequisites

- Stage 1-12 (especially Stage 2 selectors and Stage 12 custom properties)
- Solid grasp of specificity and the cascade

### Topics

- Interactive pseudo-classes: `:hover`, `:focus`, `:focus-visible`, `:focus-within`, `:active`
- Form pseudo-classes: `:checked`, `:disabled`, `:enabled`, `:read-only`, `:placeholder-shown`, `:valid`, `:invalid`, `:required`
- Structural pseudo-classes: `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-of-type()`, `:not()`, `:is()`, `:where()`, `:empty`
- Link pseudo-classes: `:link`, `:visited`, `:any-link`
- Generated content: `::before`, `::after`, `content`
- Special pseudo-elements: `::selection`, `::placeholder`, `::marker`, `::backdrop`, `::first-letter`, `::first-line`
- New pseudo-elements: `::details-content`, `::view-transition-old/new/group`

### Key Concepts

- `:focus` matches any focus (mouse, keyboard, programmatic); `:focus-visible` matches keyboard/AT focus only — use `:focus-visible` for the focus ring to avoid showing it on mouse click.
- `:focus-within` matches an element that itself or any descendant has focus — perfect for highlighting a form field's wrapper.
- `::before` and `::after` insert generated content via the `content` property; they are real elements in the box tree.
- `::selection` styles highlighted text; `::placeholder` styles input placeholder text.
- The `::view-transition-*` pseudo-elements power the View Transitions API for animated DOM swaps.

```css
/* Show focus ring only for keyboard users */
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Remove the default ring for mouse users */
.button:focus:not(:focus-visible) { outline: none; }

/* Highlight a form row when any field inside is focused */
.form-row:focus-within {
  background: #f0f9ff;
}
```
Caption: Focus states done right

### Common Pitfalls

- Using `:focus` instead of `:focus-visible` — mouse users see a focus ring on every click, which is ugly; `:focus-visible` shows it only for keyboard/AT users.
- Forgetting `content: ""` on `::before`/`::after` — pseudo-elements do not render without a `content` property (even an empty string).
- Using `:nth-child(2)` thinking it means "the 2nd of its type" — `:nth-child` counts among all siblings, not type-matched siblings; use `:nth-of-type(2)` for the latter.
- Styling `:visited` and expecting full color freedom — for privacy, browsers restrict `:visited` styles to color, background-color, border-color, outline-color, and column-rule-color.
- Confusing `:focus-within` (any descendant focused) with `:focus-visible` (this element focused via keyboard) — they solve different problems.

### Real-World Applications

- GitHub uses `:focus-visible` on every interactive element so mouse users see no ring but keyboard users do.
- Stripe uses `:focus-within` to highlight the active input's wrapper in payment forms.
- Linear uses `::before` for issue-status icons and `::after` for keyboard shortcut hints in list rows.
- Vercel uses `::selection` to brand the text-highlight color across the marketing site.

### Interview Questions

- 1. What is the difference between `:focus` and `:focus-visible`? — `:focus` matches any focus; `:focus-visible` matches keyboard/AT focus only, so mouse users don't see the ring.
- 2. What does `:focus-within` do? — Matches an element that itself or any descendant has focus; useful for highlighting a wrapper when a child input is focused.
- 3. What is required for `::before`/`::after` to render? — A `content` property (even an empty string); without it, the pseudo-element does not exist.
- 4. What is the difference between `:nth-child(2)` and `:nth-of-type(2)`? — `:nth-child(2)` is the second sibling of any type; `:nth-of-type(2)` is the second sibling of the same type.
- 5. What restrictions apply to `:visited` styles? — Only color, background-color, border-color, outline-color, and column-rule-color can be styled, for privacy (preventing history sniffing).

### Mini Project

Build a Custom-Styled Checkbox Group: Use `:checked`, `:disabled`, `:focus-visible`, and `::before`/`::after` to render custom checkboxes without losing keyboard accessibility. Demonstrates generated content, focus-visible, and form pseudo-classes. Suggested approach:
  - Visually hide the native checkbox with `position: absolute; opacity: 0;`
  - Use a `<label>` wrapper as the visual checkbox
  - Render the box with `::before` and the checkmark with `::after` (rotated)
  - Show the checkmark only when `:checked` is true
  - Add `:focus-visible` ring on the wrapper via `:has(input:focus-visible)` or `input:focus-visible + .visual`
  - Style `:disabled` with reduced opacity and `not-allowed` cursor

### Exercises

1. Add `:focus-visible` rings to all interactive elements and verify mouse users see no ring on click.
2. Use `:nth-of-type(2n)` to zebra-stripe a list of items.
3. Build an external-link indicator with `a[href^="https://"]::after`.
4. Style `::selection` to use the brand color and verify on text highlight.
5. Use `:focus-within` to highlight the active input row in a form.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which pseudo-class matches keyboard focus only (not mouse click)?
9. A) `:focus-visible` (*)
10. B) `:focus`
11. C) `:focus-within`
12. D) `:active`
13. Explanation: `:focus-visible` matches focus that comes from the keyboard or AT, so mouse clicks don't show the ring.
14. Q2: Which pseudo-class matches an element when any descendant is focused?
15. A) `:focus`
16. B) `:focus-within` (*)
17. C) `:focus-visible`
18. D) `:has-focus`
19. Explanation: `:focus-within` matches an element that itself or any descendant has focus; useful for highlighting form wrappers.
20. Q3: Which property is required for `::before` to render?
21. A) `content` (*)
22. B) `display`
23. C) `position`
24. D) `visibility`
25. Explanation: Pseudo-elements require a `content` property (even an empty string) or they do not exist in the box tree.
26. Q4: What does `:nth-of-type(2)` match?
27. A) The 2nd child of any type
28. B) The 2nd sibling of the same type (*)
29. C) The 2nd element in the document
30. D) The element with type="2"
31. Explanation: `:nth-of-type(n)` counts among type-matched siblings, unlike `:nth-child(n)` which counts all siblings.
32. Q5: Which `:visited` style is allowed for privacy reasons?
33. A) background-image
34. B) font-size
35. C) color (*)
36. D) padding
37. Explanation: `:visited` can only style color, background-color, border-color, outline-color, and column-rule-color; other properties are blocked to prevent history sniffing.
38. Q6: Which pseudo-element styles the text highlight color?
39. A) `::highlight`
40. B) `::marker`
41. C) `::backdrop`
42. D) `::selection` (*)
43. Explanation: `::selection` styles the appearance of text the user has highlighted.
44. Q7: Which pseudo-element styles the bullet/number of a list item?
45. A) `::marker` (*)
46. B) `::bullet`
47. C) `::list-item`
48. D) `::before`
49. Explanation: `::marker` styles the marker box (bullet or number) of list items and summary elements.
50. Q8: Which pseudo-class matches an input that has a placeholder currently shown?
51. A) `:placeholder`
52. B) `:placeholder-shown` (*)
53. C) `:empty`
54. D) `:blank`
55. Explanation: `:placeholder-shown` matches an input whose placeholder is currently displayed (i.e., empty).
56. Q9: Which pseudo-class matches a form control that failed validation after the user interacted?
57. A) `:invalid`
58. B) `:failed`
59. C) `:user-invalid` (*)
60. D) `:error`
61. Explanation: `:user-invalid` matches an invalid control after the user has interacted with it, avoiding showing errors on page load.
62. Q10: Which pseudo-elements power the View Transitions API?
63. A) `::transition-old/new`
64. B) `::vt-old/new`
65. C) `::swap-before/after`
66. D) `::view-transition-old/new/group/name` (*)
67. Explanation: `::view-transition-*` pseudo-elements (old, new, group, image-pair, root, name) enable styling animated DOM swaps via the View Transitions API.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which pseudo-class matches keyboard focus only (not mouse click)?
  options:
    - "`:focus-visible`"
    - "`:focus`"
    - "`:focus-within`"
    - "`:active`"
  correctIndex: 0
  explanation: "`:focus-visible` matches focus that comes from the keyboard or AT, so mouse clicks don't show the ring."
- id: q2
  question: Which pseudo-class matches an element when any descendant is focused?
  options:
    - "`:focus`"
    - "`:focus-within`"
    - "`:focus-visible`"
    - "`:has-focus`"
  correctIndex: 1
  explanation: "`:focus-within` matches an element that itself or any descendant has focus; useful for highlighting form wrappers."
- id: q3
  question: Which property is required for `::before` to render?
  options:
    - "`content`"
    - "`display`"
    - "`position`"
    - "`visibility`"
  correctIndex: 0
  explanation: Pseudo-elements require a `content` property (even an empty string) or they do not exist in the box tree.
- id: q4
  question: What does `:nth-of-type(2)` match?
  options:
    - The 2nd child of any type
    - The 2nd sibling of the same type
    - The 2nd element in the document
    - The element with type="2"
  correctIndex: 1
  explanation: "`:nth-of-type(n)` counts among type-matched siblings, unlike `:nth-child(n)` which counts all siblings."
- id: q5
  question: Which `:visited` style is allowed for privacy reasons?
  options:
    - background-image
    - font-size
    - color
    - padding
  correctIndex: 2
  explanation: "`:visited` can only style color, background-color, border-color, outline-color, and column-rule-color; other properties are blocked to prevent history sniffing."
- id: q6
  question: Which pseudo-element styles the text highlight color?
  options:
    - "`::highlight`"
    - "`::marker`"
    - "`::backdrop`"
    - "`::selection`"
  correctIndex: 3
  explanation: "`::selection` styles the appearance of text the user has highlighted."
- id: q7
  question: Which pseudo-element styles the bullet/number of a list item?
  options:
    - "`::marker`"
    - "`::bullet`"
    - "`::list-item`"
    - "`::before`"
  correctIndex: 0
  explanation: "`::marker` styles the marker box (bullet or number) of list items and summary elements."
- id: q8
  question: Which pseudo-class matches an input that has a placeholder currently shown?
  options:
    - "`:placeholder`"
    - "`:placeholder-shown`"
    - "`:empty`"
    - "`:blank`"
  correctIndex: 1
  explanation: "`:placeholder-shown` matches an input whose placeholder is currently displayed (i.e., empty)."
- id: q9
  question: Which pseudo-class matches a form control that failed validation after the user interacted?
  options:
    - "`:invalid`"
    - "`:failed`"
    - "`:user-invalid`"
    - "`:error`"
  correctIndex: 2
  explanation: "`:user-invalid` matches an invalid control after the user has interacted with it, avoiding showing errors on page load."
- id: q10
  question: Which pseudo-elements power the View Transitions API?
  options:
    - "`::transition-old/new`"
    - "`::vt-old/new`"
    - "`::swap-before/after`"
    - "`::view-transition-old/new/group/name`"
  correctIndex: 3
  explanation: "`::view-transition-*` pseudo-elements (old, new, group, image-pair, root, name) enable styling animated DOM swaps via the View Transitions API."
```

