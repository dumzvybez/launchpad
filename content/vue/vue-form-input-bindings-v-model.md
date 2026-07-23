---
slug: vue-form-input-bindings-v-model
id: vue-09
track: vue
order: 9
title: Form Input Bindings — v-model
description: Bind form inputs two-way with v-model on text, textarea, checkbox, radio, select, and learn the lazy/number/trim modifiers and custom component v-model.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=CYPZBK8zUik&t=60s
whyItMatters: Bind form inputs two-way with v-model on text, textarea, checkbox, radio, select, and learn the lazy/number/trim modifiers and custom component v-model.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Form Input Bindings — v-model

## Form Input Bindings — v-model

### Why It Matters

Bind form inputs two-way with v-model on text, textarea, checkbox, radio, select, and learn the lazy/number/trim modifiers and custom component v-model.

Bind form inputs two-way with v-model on text, textarea, checkbox, radio, select, and learn the lazy/number/trim modifiers and custom component v-model.

### Prerequisites

- Stage 3: Template Syntax (bindings).
- Stage 8: Event Handling (modifiers).

### Topics

- `v-model` on `<input>` text and `<textarea>`
- `v-model` on checkboxes (single boolean + multiple array)
- `v-model` on radio buttons
- `v-model` on `<select>` (single + multiple)
- Modifiers: `.lazy` (change event), `.number` (cast to number), `.trim` (strip whitespace)
- `v-model` with custom value bindings (`:value` + `@input`)
- `v-model` on custom components (modelValue prop + update:modelValue event)
- Multiple v-model bindings on one component

### Key Concepts

- `v-model` is syntactic sugar for `:value="x" @input="x = $event.target.value"`
- For checkboxes, `v-model` binds to a boolean (single) or array (multiple)
- `.lazy` syncs on `change` instead of `input` (less chatty, slower feedback)
- `.number` casts the input string to a number; if NaN, the original string is kept
- On a custom component, `v-model="x"` is shorthand for `:modelValue="x" @update:modelValue="x = $event"`

```vue
<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const bio = ref("");
const subscribe = ref(false);
const fruits = ref<string[]>([]);
const fruit = ref("apple");
const color = ref("red");
</script>

<template>
  <input v-model="name" placeholder="Name" />
  <textarea v-model="bio"></textarea>

  <!-- Single checkbox: boolean -->
  <input type="checkbox" v-model="subscribe" /> Subscribe

  <!-- Multiple checkboxes: array -->
  <input type="checkbox" value="apple" v-model="fruits" /> Apple
  <input type="checkbox" value="banana" v-model="fruits" /> Banana

  <!-- Radio -->
  <input type="radio" value="red" v-model="color" /> Red
  <input type="radio" value="blue" v-model="color" /> Blue

  <!-- Select (single) -->
  <select v-model="fruit">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
  </select>
</template>
```
Caption: v-model on text, textarea, checkbox, radio, select

### Common Pitfalls

- Mutating a prop directly via `v-model="modelValue"` inside a child — `v-model` on a prop is anti-pattern; emit `update:modelValue` instead.
- Forgetting that `v-model` on a checkbox with no `value` attribute binds a boolean, not the value attribute — for multiple checkboxes you MUST set a `value`.
- Using `v-model.number` on a non-numeric input — if the value is non-numeric, Vue keeps the string; check `typeof` before arithmetic.
- Mutating `props.modelValue` directly via `v-model` in custom component — Vue warns "Set operation on key X failed: target is readonly"; use `:value` + `@input` emit pattern.
- Mixing `:value` and `v-model` on the same input — they conflict; pick one (usually `v-model`).

### Real-World Applications

- GitLab's issue editor uses v-model on title, description, labels, and assignees with debounced autosave.
- Alibaba's checkout flow uses v-model across shipping, payment, and coupon forms with .trim and .number modifiers.
- Behance's project upload form uses multiple v-model bindings on a single multi-step form component.
- Adobe Portfolio's site settings use v-model for color pickers, font selectors, and toggle switches built as custom components.

### Interview Questions

- 1. What is `v-model` syntactic sugar for on a text input? — `:value="x" @input="x = $event.target.value"` — two-way binding in one directive.
- 2. What's the difference between v-model on a single checkbox vs multiple? — Single binds to a boolean; multiple (with `value` attributes) binds to an array of selected values.
- 3. What does `.lazy` do? — Switches the sync event from `input` to `change`, so the model updates only when the input loses focus or the user presses Enter.
- 4. How does v-model work on a custom component? — It expands to `:modelValue="x" @update:modelValue="x = $event"`; the child reads `modelValue` prop and emits `update:modelValue`.
- 5. How do you bind multiple v-models on one component? — Use named arguments: `v-model:firstName="x" v-model:lastName="y"` — each maps to a same-named prop and `update:name` event.

### Mini Project

Build a "Registration Form" mini-app: An SFC with name (text, trimmed), email (text, trimmed), age (number), newsletter (checkbox), and plan (radio: free/pro/enterprise). Show a live JSON preview of the form state. Suggested approach:
  - Hold each field in its own `ref` (or one reactive object)
  - Use `v-model.trim` on name/email and `v-model.number` on age
  - Use a single boolean ref for the newsletter checkbox
  - Use a ref bound to the value of the selected radio for the plan
  - Display the form state via `JSON.stringify(formState, null, 2)` in a `<pre>`

### Exercises

1. Bind a text input with `v-model` and echo the value live in a `<p>`.
2. Build a multi-checkbox group bound to an array; display the array contents.
3. Use `v-model.lazy` on a textarea and confirm the model only updates on blur.
4. Build a custom `CustomInput.vue` and use `v-model` on it from a parent.
5. Add a second `v-model:label` binding to your custom component for a label string.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is v-model on a text input syntactic sugar for?
9. A) :value="x" @input="x = $event.target.value" (*)
10. B) :value="x" @change="x = $event"
11. C) :model="x" @update="x = $event"
12. D) :bind="x"
13. Explanation: `v-model` on a text input expands to a `:value` binding plus an `@input` event that updates the bound ref.
14. Q2: What does v-model bind to on a single checkbox?
15. A) A string
16. B) A boolean (*)
17. C) An array
18. D) A number
19. Explanation: A single checkbox binds to a boolean (checked/unchecked); multiple checkboxes with `value` attributes bind to an array of selected values.
20. Q3: What does the .lazy modifier do?
21. A) Defers the binding until next tick
22. B) Makes the input readonly
23. C) Syncs on the 'change' event instead of 'input' (*)
24. D) Debounces by 300ms
25. Explanation: `.lazy` switches the sync event from `input` (per keystroke) to `change` (on blur/Enter), reducing update frequency.
26. Q4: What does .number do if the input is non-numeric?
27. A) Throws an error
28. B) Sets the value to 0
29. C) Sets the value to NaN
30. D) Keeps the original string (*)
31. Explanation: `.number` casts the input via `parseFloat`; if it returns NaN, Vue keeps the original string value.
32. Q5: How does v-model expand on a custom component?
33. A) :modelValue="x" @update:modelValue="x = $event" (*)
34. B) :value="x" @input="x = $event"
35. C) :model="x"
36. D) :data="x" @change="x = $event"
37. Explanation: On a custom component, `v-model="x"` becomes `:modelValue="x" @update:modelValue="x = $event"`; the child emits `update:modelValue`.
38. Q6: How do you bind two v-models on one component?
39. A) v-model="a" v-model="b"
40. B) v-model:a="a" v-model:b="b" (*)
41. C) :a="a" :b="b"
42. D) model1="a" model2="b"
43. Explanation: Named v-model arguments like `v-model:firstName="x"` allow multiple two-way bindings; each maps to a same-named prop and `update:name` event.
44. Q7: What's wrong with `v-model="modelValue"` on a prop inside a child?
45. A) It works fine
46. B) It throws a syntax error
47. C) It tries to mutate a readonly prop — emit `update:modelValue` instead (*)
48. D) It only works in Vue 2
49. Explanation: Mutating a prop directly violates one-way data flow and Vue warns; use `:value` + `@input` that emits the update event.
50. Q8: What does v-model on a multi-select bind to?
51. A) A string
52. B) A boolean
53. C) The selected option element
54. D) An array of selected option values (*)
55. Explanation: With `<select multiple v-model="x">`, x is an array of the selected options' values.
56. Q9: What does .trim do?
57. A) Strips leading and trailing whitespace (*)
58. B) Removes all whitespace
59. C) Truncates to 10 chars
60. D) Trims the input width
61. Explanation: `.trim` calls `String.prototype.trim()` on the input value before syncing to the model.
62. Q10: Which input type does v-model treat specially to bind a boolean?
63. A) text
64. B) checkbox (single) (*)
65. C) password
66. D) radio
67. Explanation: A single checkbox binds a boolean (checked state); radio and multi-checkbox bind to value strings/arrays.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is v-model on a text input syntactic sugar for?
  options:
    - :value="x" @input="x = $event.target.value"
    - :value="x" @change="x = $event"
    - :model="x" @update="x = $event"
    - :bind="x"
  correctIndex: 0
  explanation: "`v-model` on a text input expands to a `:value` binding plus an `@input` event that updates the bound ref."
- id: q2
  question: What does v-model bind to on a single checkbox?
  options:
    - A string
    - A boolean
    - An array
    - A number
  correctIndex: 1
  explanation: A single checkbox binds to a boolean (checked/unchecked); multiple checkboxes with `value` attributes bind to an array of selected values.
- id: q3
  question: What does the .lazy modifier do?
  options:
    - Defers the binding until next tick
    - Makes the input readonly
    - Syncs on the 'change' event instead of 'input'
    - Debounces by 300ms
  correctIndex: 2
  explanation: "`.lazy` switches the sync event from `input` (per keystroke) to `change` (on blur/Enter), reducing update frequency."
- id: q4
  question: What does .number do if the input is non-numeric?
  options:
    - Throws an error
    - Sets the value to 0
    - Sets the value to NaN
    - Keeps the original string
  correctIndex: 3
  explanation: "`.number` casts the input via `parseFloat`; if it returns NaN, Vue keeps the original string value."
- id: q5
  question: How does v-model expand on a custom component?
  options:
    - :modelValue="x" @update:modelValue="x = $event"
    - :value="x" @input="x = $event"
    - :model="x"
    - :data="x" @change="x = $event"
  correctIndex: 0
  explanation: On a custom component, `v-model="x"` becomes `:modelValue="x" @update:modelValue="x = $event"`; the child emits `update:modelValue`.
- id: q6
  question: How do you bind two v-models on one component?
  options:
    - v-model="a" v-model="b"
    - v-model:a="a" v-model:b="b"
    - :a="a" :b="b"
    - model1="a" model2="b"
  correctIndex: 1
  explanation: Named v-model arguments like `v-model:firstName="x"` allow multiple two-way bindings; each maps to a same-named prop and `update:name` event.
- id: q7
  question: What's wrong with `v-model="modelValue"` on a prop inside a child?
  options:
    - It works fine
    - It throws a syntax error
    - It tries to mutate a readonly prop — emit `update:modelValue` instead
    - It only works in Vue 2
  correctIndex: 2
  explanation: Mutating a prop directly violates one-way data flow and Vue warns; use `:value` + `@input` that emits the update event.
- id: q8
  question: What does v-model on a multi-select bind to?
  options:
    - A string
    - A boolean
    - The selected option element
    - An array of selected option values
  correctIndex: 3
  explanation: With `<select multiple v-model="x">`, x is an array of the selected options' values.
- id: q9
  question: What does .trim do?
  options:
    - Strips leading and trailing whitespace
    - Removes all whitespace
    - Truncates to 10 chars
    - Trims the input width
  correctIndex: 0
  explanation: "`.trim` calls `String.prototype.trim()` on the input value before syncing to the model."
- id: q10
  question: Which input type does v-model treat specially to bind a boolean?
  options:
    - text
    - checkbox (single)
    - password
    - radio
  correctIndex: 1
  explanation: A single checkbox binds a boolean (checked state); radio and multi-checkbox bind to value strings/arrays.
```

