---
slug: react-forms-controlled-inputs
id: react-06
track: react
order: 6
title: Forms and Controlled Inputs
description: Build robust forms with controlled inputs, handle multiple field types, validate on the fly, and avoid the controlled-vs-uncontrolled trap.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=300s
whyItMatters: Build robust forms with controlled inputs, handle multiple field types, validate on the fly, and avoid the controlled-vs-uncontrolled trap.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Forms and Controlled Inputs

## Forms and Controlled Inputs

### Why It Matters

Build robust forms with controlled inputs, handle multiple field types, validate on the fly, and avoid the controlled-vs-uncontrolled trap.

Build robust forms with controlled inputs, handle multiple field types, validate on the fly, and avoid the controlled-vs-uncontrolled trap.

### Prerequisites

- Stage 5: Lists, Keys, and Conditional Rendering.
- HTML form elements and the change event.

### Topics

- Controlled vs uncontrolled inputs
- `value` + `onChange` for text inputs
- Checkboxes, radios, selects, textareas, file inputs
- Single state object for forms vs per-field state
- Basic inline validation and error display
- Disabled submit states
- `name` attribute and dynamic field handling
- The `defaultValue` escape hatch for uncontrolled inputs

### Key Concepts

- A controlled input has its `value` driven by React state; the input is a "view" of state
- An uncontrolled input manages its own DOM state; React reads it via a ref (Stage 8)
- Mixing the two on the same input triggers a React warning
- Forms should derive validity from state, not from the DOM
- `e.target.name` + computed property keys make a dynamic multi-field form possible

```tsx
function EmailInput() {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!valid && email.length > 0}
      />
      {email.length > 0 && !valid && <p className="error">Enter a valid email</p>}
    </div>
  );
}
```
Caption: Controlled single field

### Common Pitfalls

- Setting `value` without `onChange` (and no `readOnly`) — React treats it as read-only and the input won't accept typing; either add `onChange` or use `defaultValue`.
- Mixing controlled and uncontrolled behavior — switching a field from `defaultValue` to `value` mid-lifecycle throws a warning. Pick one and stick with it.
- Using `e.target.checked` for text inputs — `checked` is only meaningful for checkboxes/radios; text inputs use `value`.
- Forgetting `e.preventDefault()` in `onSubmit` — the browser does a full-page reload, wiping React state.
- Storing every keystroke as separate API calls — debounce (Stage 8) or submit only on blur/Enter.

### Real-World Applications

- Stripe's checkout form uses controlled inputs to validate card numbers in real time and surface issuer errors before submission.
- Airbnb's search bar uses controlled inputs with debounced dispatch to update the map and listings without spamming the API.
- Typeform's embeddable forms use controlled inputs to enable conditional branching based on prior answers.
- Linear's command palette uses a controlled input with keyboard navigation — the input value drives the filtered command list.

### Interview Questions

- 1. Controlled vs uncontrolled inputs? — Controlled: React owns the value via state; Uncontrolled: the DOM owns it and you read via a ref.
- 2. Why does an input with `value` but no `onChange` warn? — React sees a controlled input with no updater, which means typing does nothing; either add `onChange` or use `readOnly`/`defaultValue`.
- 3. How do you handle a checkbox vs a text input? — Checkbox uses `checked` and `e.target.checked`; text uses `value` and `e.target.value`.
- 4. How do you validate a controlled form? — Derive validity from state in render; surface errors conditionally. Heavy forms benefit from React Hook Form + Zod (Stage 15).
- 5. What is `defaultValue` for? — Setting the initial value of an uncontrolled input without making it controlled.

### Mini Project

Build a "Job Application Form": A multi-field form (name, email, experience years, current role, willing to relocate, resume URL) with inline validation per field, a disabled submit button until all fields are valid, and a success message on submit. Suggested approach:
  - Use one `useState` object for all fields
  - Write a `validate(form)` returning a partial record of errors
  - Disable submit unless `Object.keys(errors).length === 0`
  - Show per-field error text below each input
  - On submit, set a `submitted` state and render a success panel

### Exercises

1. Build a single controlled email input with regex validation and an error message.
2. Convert a form using three `useState` calls into one using a single state object.
3. Add a `select` with three options and bind it to state via `value` + `onChange`.
4. Build a checkbox group (multiple checkboxes, one state array) for picking tags.
5. Reproduce the controlled-without-onChange warning, then fix it with `defaultValue`.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What makes an input "controlled"?
9. A) It uses `defaultValue`
10. B) Its `value` is driven by React state and updates via `onChange` (*)
11. C) It uses a ref
12. D) It is wrapped in a `<form>`
13. Explanation: A controlled input's value is bound to React state; every keystroke updates state and the new state flows back into the input via `value`.
14. Q2: What happens if you set `value` on an input without `onChange` and without `readOnly`?
15. A) React throws an error
16. B) Nothing — it works fine
17. C) React warns and the input becomes read-only (*)
18. D) The input becomes uncontrolled
19. Explanation: Without an `onChange` handler the input can't update its state, so React treats it as read-only and logs a warning; use `readOnly` or `defaultValue` intentionally.
20. Q3: How do you read a checkbox's state in an `onChange` handler?
21. A) e.target.value
22. B) e.currentTarget.value
23. C) e.checked
24. D) e.target.checked (*)
25. Explanation: Checkboxes use the `checked` boolean property, not `value` (which is always `"on"` for checkboxes).
26. Q4: Which attribute sets the initial value of an uncontrolled input?
27. A) defaultValue (*)
28. B) value
29. C) initial
30. D) startValue
31. Explanation: `defaultValue` initializes an uncontrolled input's DOM value without making it controlled; React won't manage it.
32. Q5: Why must you call `e.preventDefault()` in a form's `onSubmit`?
33. A) To prevent event bubbling
34. B) To prevent the browser's default full-page reload (*)
35. C) To enable controlled inputs
36. D) To trigger validation
37. Explanation: The browser's default form submission reloads the page; `preventDefault()` lets you handle submission in JS without losing React state.
38. Q6: Which is a benefit of a single state object for a form?
39. A) Faster typing
40. B) Required by React
41. C) Easier validation and reset (`setForm(initial)`) (*)
42. D) Avoids using refs
43. Explanation: A single state object lets you validate the whole form, reset all fields at once, and update fields via a computed key in one updater.
44. Q7: What's the risk of making an API call on every keystroke of a controlled input?
45. A) None — it's the recommended approach
46. B) React warns about it
47. C) The input becomes uncontrolled
48. D) Spamming the API and causing rate limits / race conditions; debounce instead (*)
49. Explanation: Each keystroke fires `onChange`; if that triggers an API call you'll flood the server. Debounce (Stage 8) or submit on blur/Enter.
50. Q8: How do you dynamically update a field by `name` in one state object?
51. A) Use a computed property key: `setForm(prev => ({ ...prev, [e.target.name]: value }))` (*)
52. B) Switch on every possible name
53. C) Use a ref per field
54. D) Re-render with a key change
55. Explanation: `[e.target.name]: value` lets one `update` handler serve every field that has a `name` attribute, dramatically reducing boilerplate.
56. Q9: Which input type does NOT use `value` for its current state?
57. A) text
58. B) file (*)
59. C) email
60. D) password
61. Explanation: File inputs are uncontrolled for security reasons — their value cannot be set programmatically; read files via `e.target.files` and store metadata in state.
62. Q10: When should you consider React Hook Form + Zod (Stage 15)?
63. A) For every form, even one field
64. B) Never — controlled inputs are always enough
65. C) For complex forms with many fields, async validation, or schema reuse (*)
66. D) Only for uncontrolled inputs
67. Explanation: For small forms controlled inputs are fine; complex forms benefit from React Hook Form's performance (uncontrolled by default) and Zod's schema-based validation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What makes an input "controlled"?
  options:
    - It uses `defaultValue`
    - Its `value` is driven by React state and updates via `onChange`
    - It uses a ref
    - It is wrapped in a `<form>`
  correctIndex: 1
  explanation: A controlled input's value is bound to React state; every keystroke updates state and the new state flows back into the input via `value`.
- id: q2
  question: What happens if you set `value` on an input without `onChange` and without `readOnly`?
  options:
    - React throws an error
    - Nothing — it works fine
    - React warns and the input becomes read-only
    - The input becomes uncontrolled
  correctIndex: 2
  explanation: Without an `onChange` handler the input can't update its state, so React treats it as read-only and logs a warning; use `readOnly` or `defaultValue` intentionally.
- id: q3
  question: How do you read a checkbox's state in an `onChange` handler?
  options:
    - e.target.value
    - e.currentTarget.value
    - e.checked
    - e.target.checked
  correctIndex: 3
  explanation: Checkboxes use the `checked` boolean property, not `value` (which is always `"on"` for checkboxes).
- id: q4
  question: Which attribute sets the initial value of an uncontrolled input?
  options:
    - defaultValue
    - value
    - initial
    - startValue
  correctIndex: 0
  explanation: "`defaultValue` initializes an uncontrolled input's DOM value without making it controlled; React won't manage it."
- id: q5
  question: Why must you call `e.preventDefault()` in a form's `onSubmit`?
  options:
    - To prevent event bubbling
    - To prevent the browser's default full-page reload
    - To enable controlled inputs
    - To trigger validation
  correctIndex: 1
  explanation: The browser's default form submission reloads the page; `preventDefault()` lets you handle submission in JS without losing React state.
- id: q6
  question: Which is a benefit of a single state object for a form?
  options:
    - Faster typing
    - Required by React
    - Easier validation and reset (`setForm(initial)`)
    - Avoids using refs
  correctIndex: 2
  explanation: A single state object lets you validate the whole form, reset all fields at once, and update fields via a computed key in one updater.
- id: q7
  question: What's the risk of making an API call on every keystroke of a controlled input?
  options:
    - None — it's the recommended approach
    - React warns about it
    - The input becomes uncontrolled
    - Spamming the API and causing rate limits / race conditions; debounce instead
  correctIndex: 3
  explanation: Each keystroke fires `onChange`; if that triggers an API call you'll flood the server. Debounce (Stage 8) or submit on blur/Enter.
- id: q8
  question: How do you dynamically update a field by `name` in one state object?
  options:
    - "Use a computed property key: `setForm(prev => ({ ...prev, [e.target.name]: value }))`"
    - Switch on every possible name
    - Use a ref per field
    - Re-render with a key change
  correctIndex: 0
  explanation: "`[e.target.name]: value` lets one `update` handler serve every field that has a `name` attribute, dramatically reducing boilerplate."
- id: q9
  question: Which input type does NOT use `value` for its current state?
  options:
    - text
    - file
    - email
    - password
  correctIndex: 1
  explanation: File inputs are uncontrolled for security reasons — their value cannot be set programmatically; read files via `e.target.files` and store metadata in state.
- id: q10
  question: When should you consider React Hook Form + Zod (Stage 15)?
  options:
    - For every form, even one field
    - Never — controlled inputs are always enough
    - For complex forms with many fields, async validation, or schema reuse
    - Only for uncontrolled inputs
  correctIndex: 2
  explanation: For small forms controlled inputs are fine; complex forms benefit from React Hook Form's performance (uncontrolled by default) and Zod's schema-based validation.
```

