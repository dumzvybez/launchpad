---
slug: html-accessibility-a11y-fundamentals
id: html-08
track: html
order: 8
title: Accessibility (a11y) Fundamentals
description: "Make your pages usable by everyone, including keyboard, screen reader, and switch users. This stage covers WCAG principles, ARIA patterns, focus management, and the cardinal rule: use semantic HTML first."
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=2700s
whyItMatters: "Make your pages usable by everyone, including keyboard, screen reader, and switch users. This stage covers WCAG principles, ARIA patterns, focus management, and the cardinal rule: use semantic HTML first."
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Accessibility (a11y) Fundamentals

## Accessibility (a11y) Fundamentals

### Why It Matters

Make your pages usable by everyone, including keyboard, screen reader, and switch users. This stage covers WCAG principles, ARIA patterns, focus management, and the cardinal rule: use semantic HTML first.

Make your pages usable by everyone, including keyboard, screen reader, and switch users. This stage covers WCAG principles, ARIA patterns, focus management, and the cardinal rule: use semantic HTML first.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 5: Forms and Input Elements
- Stage 6: Semantic HTML and Document Outline

### Topics

- WCAG 2.2 principles: Perceivable, Operable, Understandable, Robust (POUR)
- ARIA roles, states, and properties
- The five rules of ARIA (use semantic HTML first; don't change native semantics; all interactive elements are keyboard-operable; don't hide visible focus; all visible elements have accessible names)
- Focus management: `tabindex`, `:focus-visible`, skip links
- Accessible names: `aria-label`, `aria-labelledby`, `aria-describedby`
- Live regions: `aria-live`, `role="status"`, `role="alert"`
- Color contrast ratios (4.5:1 for normal text, 3:1 for large)
- Screen reader testing: VoiceOver, NVDA, JAWS, TalkBack

### Key Concepts

- The first rule of ARIA: don't use ARIA. Prefer native semantic HTML whenever possible.
- Every interactive element must be operable by keyboard alone; if you build a custom widget, mirror native keyboard patterns.
- `tabindex="0"` adds an element to the tab order; `tabindex="-1"` makes it programmatically focusable but not in tab order; avoid `tabindex` > 0.
- Accessible name is computed from `aria-labelledby`, then `aria-label`, then content, then `title`.
- Never remove `:focus` outline without replacing it; invisible focus is an operability failure.

```html
<style>
  .visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  .skip-link { position:absolute; left:-9999px; }
  .skip-link:focus { left:1rem; top:1rem; background:#000; color:#fff; padding:0.5rem; z-index:999; }
</style>
<a href="#main" class="skip-link">Skip to content</a>
<main id="main">...</main>
```
Caption: Skip link and visually-hidden helper

### Common Pitfalls

- `<div onclick="...">` instead of `<button>` — not keyboard accessible, not announced as a button; always use `<button type="button">`.
- Removing `:focus` outline globally — leaves keyboard users with no visible focus indicator; replace with `:focus-visible` styling, don't remove.
- `tabindex` greater than 0 — destroys natural tab order and confuses screen reader users; use `0` (in order) or `-1` (programmatic only).
- Adding `role="button"` to a `<div>` — ARIA rule #2: don't change native semantics. Use a real `<button>` instead.
- Icon-only buttons with no accessible name — `<button>` containing only an SVG has no name; add `aria-label`.

### Real-World Applications

- Apple's VoiceOver documentation pages use semantic HTML and live regions for interactive demos that work with screen readers.
- Microsoft's Accessibility documentation uses skip links, semantic landmarks, and `aria-current="page"` on navigation across all docs.
- Gov.uk services meet WCAG 2.2 AA and use a strict design system built around semantic HTML and progressive enhancement.
- Twitter/X's "x new tweets" banner uses `role="status" aria-live="polite"` so screen reader users are notified without losing context.

### Interview Questions

- 1. What are the four WCAG principles (POUR)? — Perceivable, Operable, Understandable, Robust; every success criterion maps to one of these.
- 2. What is the first rule of ARIA? — Don't use ARIA; prefer native semantic HTML. ARIA is a patch, not a replacement for semantics.
- 3. Why is `tabindex` > 0 harmful? — It reorders tab sequence in unpredictable ways, breaking the natural reading order; use 0 or -1 only.
- 4. How does an element get its accessible name? — Computed from `aria-labelledby` (if present), then `aria-label`, then content, then `title` attribute.
- 5. What is the difference between `role="status"` and `role="alert"`? — `status` is polite (announced when user is idle); `alert` is assertive (interrupts immediately) for errors.

### Mini Project

Build an Accessible Navigation Menu: A top navigation bar with a skip link, primary nav, search form, and a mobile menu toggle button. Ensure full keyboard operability and screen reader support. Suggested approach:
  - Add a skip link as the first focusable element in `<body>`
  - Use `<nav aria-label="Primary">` with a `<ul>` of `<a>` links
  - Add `aria-current="page"` to the current page link
  - Implement a mobile menu toggle with `<button aria-expanded="false" aria-controls="menu">`
  - Test with Tab key only — every interactive element must be reachable and operable

### Exercises

1. Install axe DevTools and run it on a page; fix the top three issues it reports.
2. Navigate your page using Tab and Shift+Tab only; ensure you can reach every interactive element.
3. Replace a `<div onclick>` with a `<button type="button">` and verify Enter and Space both activate it.
4. Add an `aria-label` to an icon-only button and verify the screen reader announces the label.
5. Use `:focus-visible` to style focus rings and confirm mouse clicks don't show them but keyboard tabs do.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does POUR stand for in WCAG?
9. A) Plain, Open, Universal, Responsive
10. B) Performant, Observable, Usable, Reliable
11. C) Pure, Original, Unmodified, Raw
12. D) Perceivable, Operable, Understandable, Robust (*)
13. Explanation: WCAG's four principles are Perceivable, Operable, Understandable, and Robust — every guideline maps to one.
14. Q2: What is the first rule of ARIA?
15. A) Always use ARIA on every element
16. B) ARIA replaces HTML semantics
17. C) Don't use ARIA; prefer native semantic HTML (*)
18. D) ARIA is required for accessibility
19. Explanation: The first rule says: if you can use a native HTML element or attribute with semantics built in, do that instead of ARIA.
20. Q3: Which `tabindex` value removes an element from the natural tab order but keeps it focusable via JS?
21. A) -1 (*)
22. B) 0
23. C) 1
24. D) false
25. Explanation: `tabindex="-1"` makes an element programmatically focusable (via `element.focus()`) but excludes it from the tab order.
26. Q4: What is the minimum color contrast ratio for normal-sized text per WCAG AA?
27. A) 3:1
28. B) 7:1
29. C) 2:1
30. D) 4.5:1 (*)
31. Explanation: WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold); AAA requires 7:1.
32. Q5: Which attribute marks the current page in a nav?
33. A) aria-current="page" (*)
34. B) aria-active="page"
35. C) aria-selected="true"
36. D) data-current="yes"
37. Explanation: `aria-current="page"` is the standard way to indicate the current page link; screen readers announce "current page".
38. Q6: What does `role="alert"` imply?
39. A) aria-live="polite"
40. B) Nothing special
41. C) aria-live="assertive" and role="alert" (*)
42. D) A modal dialog
43. Explanation: `role="alert"` implies `aria-live="assertive"` so the screen reader interrupts to announce changes immediately.
44. Q7: How should an icon-only button get an accessible name?
45. A) Add an aria-label (*)
46. B) It already has one from the SVG
47. C) Add a tooltip via title only
48. D) Add a CSS ::before
49. Explanation: SVG with `aria-hidden="true"` has no name; the `<button>` needs `aria-label="Close"` (or similar) so the screen reader announces it.
50. Q8: Why is removing `:focus` outline harmful?
51. A) It breaks layout
52. B) Keyboard users lose their focus indicator (*)
53. C) Italicizes the text
54. D) It disables the mouse
55. Explanation: Removing `:focus` outline leaves keyboard users with no visible focus indicator; replace with `:focus-visible` styling instead.
56. Q9: Which `<div>` is keyboard accessible?
57. A) <div onclick="doThing()">
58. B) <div role="button" tabindex="0">
59. C) Both are equally accessible
60. D) Neither — use <button> instead (*)
61. Explanation: Even with role and tabindex, a `<div>` requires JS keyboard handlers for Enter/Space; a native `<button>` is always preferred.
62. Q10: What is the purpose of a skip link?
63. A) To skip CSS loading
64. B) To let keyboard users bypass repetitive nav and jump to main content (*)
65. C) To skip validation
66. D) To skip images
67. Explanation: A skip link is the first focusable element in `<body>` and lets keyboard users jump directly to `<main>` without tabbing through every nav link.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does POUR stand for in WCAG?
  options:
    - Plain, Open, Universal, Responsive
    - Performant, Observable, Usable, Reliable
    - Pure, Original, Unmodified, Raw
    - Perceivable, Operable, Understandable, Robust
  correctIndex: 3
  explanation: WCAG's four principles are Perceivable, Operable, Understandable, and Robust — every guideline maps to one.
- id: q2
  question: What is the first rule of ARIA?
  options:
    - Always use ARIA on every element
    - ARIA replaces HTML semantics
    - Don't use ARIA; prefer native semantic HTML
    - ARIA is required for accessibility
  correctIndex: 2
  explanation: "The first rule says: if you can use a native HTML element or attribute with semantics built in, do that instead of ARIA."
- id: q3
  question: Which `tabindex` value removes an element from the natural tab order but keeps it focusable via JS?
  options:
    - "-1"
    - "0"
    - "1"
    - "false"
  correctIndex: 0
  explanation: '`tabindex="-1"` makes an element programmatically focusable (via `element.focus()`) but excludes it from the tab order.'
- id: q4
  question: What is the minimum color contrast ratio for normal-sized text per WCAG AA?
  options:
    - 3:1
    - 7:1
    - 2:1
    - 4.5:1
  correctIndex: 3
  explanation: WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold); AAA requires 7:1.
- id: q5
  question: Which attribute marks the current page in a nav?
  options:
    - aria-current="page"
    - aria-active="page"
    - aria-selected="true"
    - data-current="yes"
  correctIndex: 0
  explanation: '`aria-current="page"` is the standard way to indicate the current page link; screen readers announce "current page".'
- id: q6
  question: What does `role="alert"` imply?
  options:
    - aria-live="polite"
    - Nothing special
    - aria-live="assertive" and role="alert"
    - A modal dialog
  correctIndex: 2
  explanation: '`role="alert"` implies `aria-live="assertive"` so the screen reader interrupts to announce changes immediately.'
- id: q7
  question: How should an icon-only button get an accessible name?
  options:
    - Add an aria-label
    - It already has one from the SVG
    - Add a tooltip via title only
    - Add a CSS ::before
  correctIndex: 0
  explanation: SVG with `aria-hidden="true"` has no name; the `<button>` needs `aria-label="Close"` (or similar) so the screen reader announces it.
- id: q8
  question: Why is removing `:focus` outline harmful?
  options:
    - It breaks layout
    - Keyboard users lose their focus indicator
    - Italicizes the text
    - It disables the mouse
  correctIndex: 1
  explanation: Removing `:focus` outline leaves keyboard users with no visible focus indicator; replace with `:focus-visible` styling instead.
- id: q9
  question: Which `<div>` is keyboard accessible?
  options:
    - <div onclick="doThing()">
    - <div role="button" tabindex="0">
    - Both are equally accessible
    - Neither — use <button> instead
  correctIndex: 3
  explanation: Even with role and tabindex, a `<div>` requires JS keyboard handlers for Enter/Space; a native `<button>` is always preferred.
- id: q10
  question: What is the purpose of a skip link?
  options:
    - To skip CSS loading
    - To let keyboard users bypass repetitive nav and jump to main content
    - To skip validation
    - To skip images
  correctIndex: 1
  explanation: A skip link is the first focusable element in `<body>` and lets keyboard users jump directly to `<main>` without tabbing through every nav link.
```

