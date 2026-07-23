---
slug: svelte-bindings-input-form-bind-value
id: svelte-06
track: svelte
order: 6
title: Bindings — input, form, and bind:value
description: "Wire forms and inputs to reactive state with Svelte's bind: directives, covering text, numeric, checkbox, group, textarea, select, and bind:this."
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=150s
whyItMatters: "Wire forms and inputs to reactive state with Svelte's bind: directives, covering text, numeric, checkbox, group, textarea, select, and bind:this."
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Bindings — input, form, and bind:value

## Bindings — input, form, and bind:value

### Why It Matters

Wire forms and inputs to reactive state with Svelte's bind: directives, covering text, numeric, checkbox, group, textarea, select, and bind:this.

Wire forms and inputs to reactive state with Svelte's bind: directives, covering text, numeric, checkbox, group, textarea, select, and bind:this.

### Prerequisites

- Stage 2: Reactivity and Assignments
- Stage 5: Event Handlers and Event Modifiers
- HTML form elements (input, select, textarea).

### Topics

- bind:value for text, number, date inputs
- bind:checked for checkboxes
- bind:group for radio and checkbox groups
- bind:files for file inputs
- bind:this to capture element references
- bind:property on components (with $bindable)
- Contenteditable bindings with bind:innerHTML
- Form submission with type="submit" and preventDefault

### Key Concepts

- bind:value is two-way: input updates state, state updates input
- Numeric inputs return strings; Svelte auto-coerces with `type="number"`
- bind:group binds to an array (checkboxes) or scalar (radios) by name
- bind:this gives a ref to the DOM element after mount
- Component bindings require $bindable() in the child
- Spread bindings via `{...props}` do NOT forward bind: — wire explicitly

```svelte
<script lang="ts">
  let name = $state("");
  let age = $state(0);
  let interests = $state<string[]>([]);
  let role = $state<"admin" | "user">("user");
</script>

<form onsubmit={(e) => { e.preventDefault(); console.log({ name, age, interests, role }); }}>
  <input bind:value={name} placeholder="Name" />
  <input type="number" bind:value={age} min="0" />

  <label><input type="checkbox" bind:group={interests} value="sports" /> Sports</label>
  <label><input type="checkbox" bind:group={interests} value="music" /> Music</label>

  <label><input type="radio" bind:group={role} value="admin" /> Admin</label>
  <label><input type="radio" bind:group={role} value="user" /> User</label>

  <button type="submit">Save</button>
</form>
```
Caption: Form with multiple bindings

### Common Pitfalls

- Using `value={x}` instead of `bind:value={x}` — the former is one-way (won't update state on input).
- Forgetting `type="number"` and getting strings from numeric inputs — bind:value with type="number" coerces; without it you get strings.
- Spreading `{...props}` and expecting bind: to forward — bind: directives must be written explicitly; spread only forwards plain attributes.
- Capturing `bind:this` before mount — the ref is undefined until the element renders; guard with `if (el)` in effects.
- Binding radio/checkbox groups with bind:value instead of bind:group — bind:group is the only correct way to share state across inputs.

### Real-World Applications

- Apple Music's search input uses bind:value with a debounced $effect to query the catalog as the user types.
- The New York Times' quiz widgets use bind:group for radio answer choices and bind:value for free-text responses.
- Rakuten's product filter sidebar uses bind:group for category checkboxes that filter results live.
- Chess.com's game settings panel uses component bindings (custom Slider.svelte) for animation speed and sound volume.

### Interview Questions

- 1. What does bind:value do? — Establishes two-way binding: the input updates state on input events, and state updates the input value when it changes.
- 2. How do you bind a checkbox group to an array? — Use `bind:group={arr}` and `value="x"` on each checkbox; Svelte adds/removes values from the array.
- 3. How do you get a DOM element ref? — `let el: HTMLElement; <input bind:this={el} />` — el is set after mount.
- 4. Can you bind to a component prop? — Yes, if the child declares the prop with $bindable(); then parent uses `bind:prop={x}`.
- 5. Why doesn't `{...props}` forward bind:? — Bind directives are explicit by design; spreading forwards attributes only, not two-way bindings.

### Mini Project

Build a Settings Form with Live Preview: A Svelte page with text inputs (name, email), a number input (age), a checkbox group (interests), a radio group (plan), and a live preview card that updates as the user types. Include a custom Slider.svelte with $bindable for "weekly email volume". Suggested approach:
  - Use $state for each field and $derived for the preview string
  - Wrap inputs in a <form> with onsubmit preventDefault that logs the data
  - Use bind:group for interests (string[]) and plan (string)
  - Build Slider.svelte with $bindable and bind:value from parent
  - Add bind:this to the name input and focus it on mount with $effect

### Exercises

1. Build a form with name, email, and age inputs using bind:value; log on submit.
2. Add a checkbox group for "favorite colors" using bind:group and display the selected colors.
3. Create a Slider component with $bindable value and use it from a parent with bind:value.
4. Use bind:this to autofocus an input when a modal opens.
5. Build a select dropdown for country that updates a derived timezone string.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which directive binds an input value to state?
9. A) value={x}
10. B) bind:value={x} (*)
11. C) model={x}
12. D) v-model={x}
13. Explanation: `bind:value={x}` creates two-way binding; plain `value={x}` is one-way (state to input only).
14. Q2: How do you bind a checkbox group to an array?
15. A) bind:value
16. B) bind:checked
17. C) bind:group (*)
18. D) bind:array
19. Explanation: `bind:group={arr}` shares state across checkboxes/radios; for checkboxes, Svelte adds/removes the input's value from the array.
20. Q3: What does bind:this do?
21. A) Binds an event handler
22. B) Binds the element's value
23. C) Binds the element's class
24. D) Captures a reference to the DOM element after mount (*)
25. Explanation: `let el; <input bind:this={el} />` sets el to the DOM element after it mounts; useful for focus, scroll, measurement.
26. Q4: What do you need on a child component to support bind:prop?
27. A) Declare the prop with $bindable() (*)
28. B) Nothing, it's automatic
29. C) Use export const
30. D) Use a store
31. Explanation: The child must declare the prop with $bindable() as the default: `let { value = $bindable(0) } = $props()`; then parents can `bind:value={x}`.
32. Q5: What does `type="number"` + bind:value return?
33. A) A string
34. B) A number (auto-coerced) (*)
35. C) An integer only
36. D) A Number object
37. Explanation: With `type="number"`, Svelte coerces the input value to a number; without it, you get a string even for digits.
38. Q6: Does `{...props}` forward bind: directives?
39. A) Yes, automatically
40. B) Only on form elements
41. C) No — bind: must be written explicitly (*)
42. D) Only in Svelte 4
43. Explanation: Spread forwards plain attributes only; two-way bindings (bind:) must be written explicitly on the element.
44. Q7: Which binding do you use for a file input?
45. A) bind:value
46. B) bind:input
47. C) bind:file
48. D) bind:files (*)
49. Explanation: `bind:files` binds the FileList of an `<input type="file">`; bind:value doesn't work for file inputs (they're readonly).
50. Q8: When is a `bind:this` ref available?
51. A) After the element mounts (*)
52. B) Immediately on script parse
53. C) Only in onMount
54. D) Only in onDestroy
55. Explanation: The ref is assigned during mount; access it inside onMount or $effect (which run after mount), and guard with `if (el)`.
56. Q9: How do you bind a contenteditable element?
57. A) bind:value
58. B) bind:innerHTML (*)
59. C) bind:text
60. D) You can't
61. Explanation: `bind:innerHTML` works on contenteditable elements; Svelte updates state when the content changes (use with care — XSS risk if user input is rendered without sanitization).
62. Q10: What's the difference between `value={x}` and `bind:value={x}`?
63. A) None
64. B) bind:value is one-way
65. C) value= is one-way; bind:value= is two-way (*)
66. D) value= is two-way
67. Explanation: `value={x}` only pushes state into the input; `bind:value={x}` also updates state when the user types.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which directive binds an input value to state?
  options:
    - value={x}
    - bind:value={x}
    - model={x}
    - v-model={x}
  correctIndex: 1
  explanation: "`bind:value={x}` creates two-way binding; plain `value={x}` is one-way (state to input only)."
- id: q2
  question: How do you bind a checkbox group to an array?
  options:
    - bind:value
    - bind:checked
    - bind:group
    - bind:array
  correctIndex: 2
  explanation: "`bind:group={arr}` shares state across checkboxes/radios; for checkboxes, Svelte adds/removes the input's value from the array."
- id: q3
  question: What does bind:this do?
  options:
    - Binds an event handler
    - Binds the element's value
    - Binds the element's class
    - Captures a reference to the DOM element after mount
  correctIndex: 3
  explanation: "`let el; <input bind:this={el} />` sets el to the DOM element after it mounts; useful for focus, scroll, measurement."
- id: q4
  question: What do you need on a child component to support bind:prop?
  options:
    - Declare the prop with $bindable()
    - Nothing, it's automatic
    - Use export const
    - Use a store
  correctIndex: 0
  explanation: "The child must declare the prop with $bindable() as the default: `let { value = $bindable(0) } = $props()`; then parents can `bind:value={x}`."
- id: q5
  question: What does `type="number"` + bind:value return?
  options:
    - A string
    - A number (auto-coerced)
    - An integer only
    - A Number object
  correctIndex: 1
  explanation: With `type="number"`, Svelte coerces the input value to a number; without it, you get a string even for digits.
- id: q6
  question: "Does `{...props}` forward bind: directives?"
  options:
    - Yes, automatically
    - Only on form elements
    - "No — bind: must be written explicitly"
    - Only in Svelte 4
  correctIndex: 2
  explanation: Spread forwards plain attributes only; two-way bindings (bind:) must be written explicitly on the element.
- id: q7
  question: Which binding do you use for a file input?
  options:
    - bind:value
    - bind:input
    - bind:file
    - bind:files
  correctIndex: 3
  explanation: "`bind:files` binds the FileList of an `<input type=\"file\">`; bind:value doesn't work for file inputs (they're readonly)."
- id: q8
  question: When is a `bind:this` ref available?
  options:
    - After the element mounts
    - Immediately on script parse
    - Only in onMount
    - Only in onDestroy
  correctIndex: 0
  explanation: The ref is assigned during mount; access it inside onMount or $effect (which run after mount), and guard with `if (el)`.
- id: q9
  question: How do you bind a contenteditable element?
  options:
    - bind:value
    - bind:innerHTML
    - bind:text
    - You can't
  correctIndex: 1
  explanation: "`bind:innerHTML` works on contenteditable elements; Svelte updates state when the content changes (use with care — XSS risk if user input is rendered without sanitization)."
- id: q10
  question: What's the difference between `value={x}` and `bind:value={x}`?
  options:
    - None
    - bind:value is one-way
    - value= is one-way; bind:value= is two-way
    - value= is two-way
  correctIndex: 2
  explanation: "`value={x}` only pushes state into the input; `bind:value={x}` also updates state when the user types."
```

