---
slug: html-forms-input-elements
id: html-05
track: html
order: 5
title: Forms and Input Elements
description: Capture user input. This stage covers every common form control, the critical importance of `<label>`, and how a `<form>` actually submits data to a server.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1500s
whyItMatters: Capture user input. This stage covers every common form control, the critical importance of `<label>`, and how a `<form>` actually submits data to a server.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Forms and Input Elements

## Forms and Input Elements

### Why It Matters

Capture user input. This stage covers every common form control, the critical importance of `<label>`, and how a `<form>` actually submits data to a server.

Capture user input. This stage covers every common form control, the critical importance of `<label>`, and how a `<form>` actually submits data to a server.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 4: Lists, Tables, and Structural Elements (for laying out form sections)

### Topics

- The `<form>` element: `action`, `method`, `enctype`
- Input types: `text`, `email`, `password`, `number`, `checkbox`, `radio`, `file`, `date`, `color`, `range`, `tel`, `url`, `search`
- `<textarea>`, `<select>`, `<option>`, `<optgroup>`
- `<label>` and the `for`/`id` association
- `<button>` types: `submit`, `button`, `reset`
- `<fieldset>` and `<legend>` for grouping
- `autocomplete`, `required`, `placeholder`, `disabled`, `readonly`
- Form submission and the `name` attribute

### Key Concepts

- Every input needs a `<label>`; either wrap the input in the label or use `for` matching the input's `id`.
- A `<button>` inside a `<form>` defaults to `type="submit"`; set `type="button"` to prevent accidental submission.
- The `name` attribute is what the server sees; without it, the field is not submitted at all.
- Use the right `type` (`email`, `tel`, `url`) to get mobile keyboards and built-in validation for free.
- `autocomplete` attributes (`given-name`, `email`, `street-address`) let browsers fill in values from the user's profile.

```html
<form action="/login" method="post">
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" autocomplete="email" required>
  </p>
  <p>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" autocomplete="current-password" required>
  </p>
  <button type="submit">Sign in</button>
</form>
```
Caption: Login form with labels

### Common Pitfalls

- Missing `<label>` or label not associated with input — screen reader users cannot tell what the field is; always use `for`/`id` or wrap the input in the label.
- `<button>` without `type` inside a form — defaults to `type="submit"` and triggers submission on click; set `type="button"` for non-submitting buttons.
- Input fields without a `name` attribute — the value is silently dropped on submit; every field the server needs must have a `name`.
- Using `type="text"` for everything — loses mobile keyboard hints and built-in validation; use `type="email"`, `tel`, `url`, `number` as appropriate.
- Relying on `placeholder` as a label — placeholder disappears on focus and is hard to read; always provide a real `<label>`.

### Real-World Applications

- Google Search's homepage is a single `<form>` with one text input of `type="search"` and a submit button.
- GitHub's login and signup forms use `autocomplete="username"` and `autocomplete="new-password"` so password managers integrate correctly.
- Stripe Checkout renders inputs with explicit `<label>` elements and `autocomplete` attributes to maximize conversion and accessibility.
- Gov.uk design system forms use `<fieldset>`/`<legend>` for every radio and checkbox group across hundreds of public services.

### Interview Questions

- 1. How do you associate a `<label>` with an input? — Either wrap the input inside the `<label>`, or set the label's `for` attribute to match the input's `id`.
- 2. What is the default `type` of a `<button>` inside a `<form>`? — `submit`; set `type="button"` to prevent submission.
- 3. Why does every input need a `name` attribute? — Without it, the field is not included in the form data sent to the server.
- 4. What does `<fieldset>` do? — Groups related form controls; the `<legend>` child provides the group's accessible name.
- 5. Why use `type="email"` instead of `type="text"`? — Triggers mobile email keyboards, built-in format validation, and `autocomplete="email"` integration.

### Mini Project

Build a Contact Form: A semantic contact form with name, email, subject dropdown, message textarea, priority radio group, and a "preferred contact method" checkbox group. Submit to a dummy `/contact` endpoint. Suggested approach:
  - Wrap everything in `<form action="/contact" method="post">`
  - Use `<label for>` with matching `id`s for every input
  - Group priority radios in a `<fieldset>` with a `<legend>`
  - Add `autocomplete` attributes (name, email, tel) where applicable
  - Add a `<button type="submit">` and a `<button type="reset">`

### Exercises

1. Add `autocomplete="off"` to a one-time-code field and verify the browser stops suggesting passwords.
2. Convert a text input to `type="tel"` and confirm a phone keypad appears on mobile.
3. Group a checkbox list of interests inside `<fieldset>`/`<legend>` and verify axe DevTools reports no issues.
4. Add `required` to all critical fields and try submitting the form in Firefox; observe the browser's built-in validation.
5. Open the form in a mobile browser and confirm each input shows the correct virtual keyboard.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute on `<label>` associates it with an input?
9. A) name
10. B) id
11. C) link
12. D) for (*)
13. Explanation: The label's `for` attribute must match the input's `id` to associate them; alternatively the input can be nested inside the label.
14. Q2: What is the default `type` of a `<button>` inside a `<form>`?
15. A) submit (*)
16. B) button
17. C) reset
18. D) none
19. Explanation: Inside a form, `<button>` defaults to `type="submit"`; set `type="button"` explicitly to prevent submission.
20. Q3: Which input type triggers a numeric keypad on mobile and built-in number validation?
21. A) text
22. B) number (*)
23. C) tel
24. D) search
25. Explanation: `type="number"` shows a numeric keypad and validates that the value is numeric; `tel` shows a phone keypad but does not validate format.
26. Q4: What happens if an input has no `name` attribute?
27. A) The field is excluded from the submitted data (*)
28. B) The browser blocks submission
29. C) The field uses id as name
30. D) The field becomes required
31. Explanation: The `name` attribute is the key under which the value is submitted; without it the field is silently dropped.
32. Q5: Which element groups related radio buttons and provides an accessible name?
33. A) <fieldset> with <legend> (*)
34. B) <div>
35. C) <section>
36. D) <group>
37. Explanation: `<fieldset>` groups controls and `<legend>` provides the group's accessible name, announced by screen readers.
38. Q6: Which `autocomplete` value should a password-creation field use?
39. A) current-password
40. B) password
41. C) new-password (*)
42. D) off
43. Explanation: `autocomplete="new-password"` tells password managers to suggest a strong new password instead of an existing one.
44. Q7: Which input type is appropriate for a multi-line free-text comment?
45. A) <input type="text">
46. B) <input type="textarea">
47. C) <input type="multi">
48. D) <textarea> (*)
49. Explanation: There is no `<input type="textarea">`; multi-line text uses the `<textarea>` element.
50. Q8: Why should `placeholder` NOT replace a label?
51. A) Placeholder is deprecated
52. B) Placeholder disappears on focus and has poor contrast (*)
53. C) Placeholder breaks validation
54. D) Placeholder is only for buttons
55. Explanation: Placeholders vanish when the user starts typing and are often low-contrast; use a real `<label>` and reserve placeholder for examples.
56. Q9: Which `enctype` is required for forms that upload files?
57. A) application/x-www-form-urlencoded
58. B) multipart/form-data (*)
59. C) text/plain
60. D) application/json
61. Explanation: File uploads require `enctype="multipart/form-data"` so each field is encoded as a separate MIME part.
62. Q10: Which input type gives users a color picker?
63. A) type="rgb"
64. B) type="palette"
65. C) type="color" (*)
66. D) type="swatch"
67. Explanation: `type="color"` renders the browser's native color picker and submits the value as a hex string like `#ff0000`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute on `<label>` associates it with an input?
  options:
    - name
    - id
    - link
    - for
  correctIndex: 3
  explanation: The label's `for` attribute must match the input's `id` to associate them; alternatively the input can be nested inside the label.
- id: q2
  question: What is the default `type` of a `<button>` inside a `<form>`?
  options:
    - submit
    - button
    - reset
    - none
  correctIndex: 0
  explanation: Inside a form, `<button>` defaults to `type="submit"`; set `type="button"` explicitly to prevent submission.
- id: q3
  question: Which input type triggers a numeric keypad on mobile and built-in number validation?
  options:
    - text
    - number
    - tel
    - search
  correctIndex: 1
  explanation: '`type="number"` shows a numeric keypad and validates that the value is numeric; `tel` shows a phone keypad but does not validate format.'
- id: q4
  question: What happens if an input has no `name` attribute?
  options:
    - The field is excluded from the submitted data
    - The browser blocks submission
    - The field uses id as name
    - The field becomes required
  correctIndex: 0
  explanation: The `name` attribute is the key under which the value is submitted; without it the field is silently dropped.
- id: q5
  question: Which element groups related radio buttons and provides an accessible name?
  options:
    - <fieldset> with <legend>
    - <div>
    - <section>
    - <group>
  correctIndex: 0
  explanation: "`<fieldset>` groups controls and `<legend>` provides the group's accessible name, announced by screen readers."
- id: q6
  question: Which `autocomplete` value should a password-creation field use?
  options:
    - current-password
    - password
    - new-password
    - off
  correctIndex: 2
  explanation: '`autocomplete="new-password"` tells password managers to suggest a strong new password instead of an existing one.'
- id: q7
  question: Which input type is appropriate for a multi-line free-text comment?
  options:
    - <input type="text">
    - <input type="textarea">
    - <input type="multi">
    - <textarea>
  correctIndex: 3
  explanation: There is no `<input type="textarea">`; multi-line text uses the `<textarea>` element.
- id: q8
  question: Why should `placeholder` NOT replace a label?
  options:
    - Placeholder is deprecated
    - Placeholder disappears on focus and has poor contrast
    - Placeholder breaks validation
    - Placeholder is only for buttons
  correctIndex: 1
  explanation: Placeholders vanish when the user starts typing and are often low-contrast; use a real `<label>` and reserve placeholder for examples.
- id: q9
  question: Which `enctype` is required for forms that upload files?
  options:
    - application/x-www-form-urlencoded
    - multipart/form-data
    - text/plain
    - application/json
  correctIndex: 1
  explanation: File uploads require `enctype="multipart/form-data"` so each field is encoded as a separate MIME part.
- id: q10
  question: Which input type gives users a color picker?
  options:
    - type="rgb"
    - type="palette"
    - type="color"
    - type="swatch"
  correctIndex: 2
  explanation: "`type=\"color\"` renders the browser's native color picker and submits the value as a hex string like `#ff0000`."
```

