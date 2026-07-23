---
slug: vue-template-syntax-interpolation-directives
id: vue-03
track: vue
order: 3
title: Template Syntax — Interpolation, Directives
description: "Learn Vue's template syntax: text interpolation with {{ }}, raw HTML with v-html, attribute binding with v-bind, and the v-on/v-if/v-for/v-model directives overview."
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=60s
whyItMatters: "Learn Vue's template syntax: text interpolation with {{ }}, raw HTML with v-html, attribute binding with v-bind, and the v-on/v-if/v-for/v-model directives overview."
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Template Syntax — Interpolation, Directives

## Template Syntax — Interpolation, Directives

### Why It Matters

Learn Vue's template syntax: text interpolation with {{ }}, raw HTML with v-html, attribute binding with v-bind, and the v-on/v-if/v-for/v-model directives overview.

Learn Vue's template syntax: text interpolation with {{ }}, raw HTML with v-html, attribute binding with v-bind, and the v-on/v-if/v-for/v-model directives overview.

### Prerequisites

- Stage 1: Getting Started with Vue (project setup, SFC structure).
- Stage 2: The Vue Instance and Reactivity (ref/reactive basics).

### Topics

- Text interpolation with `{{ }}` (mustache) and how it auto-unwraps refs
- Binding attributes with `v-bind` (and the `:` shorthand)
- Class and style attribute binding (covered deeply in Stage 5)
- Binding to expressions (not just variables)
- Raw HTML with `v-html` (and the XSS risk)
- The `v-on` directive (and the `@` shorthand)
- Directive modifiers overview (.prevent, .stop, .once)
- Dynamic arguments (`:[eventName]`, `:[propName]`)

### Key Concepts

- `{{ expr }}` evaluates a JavaScript expression in the component scope and text-escapes the result
- `v-bind:attr="expr"` sets an attribute to the result of expr; shorthand is `:attr`
- `v-on:event="handler"` attaches an event listener; shorthand is `@event`
- Directives are special `v-*` attributes that apply reactive behavior to the DOM
- Modifiers (`@click.stop`, `@submit.prevent`) post-process the event before the handler runs

```vue
<script setup lang="ts">
import { ref } from "vue";
const name = ref("Ada");
const count = ref(7);
</script>

<template>
  <p>Hello, {{ name }}!</p>
  <p>Double: {{ count * 2 }}</p>
  <p>Status: {{ count > 5 ? "high" : "low" }}</p>
  <p>Upper: {{ name.toUpperCase() }}</p>
</template>
```
Caption: Interpolation and expressions

### Common Pitfalls

- Using `{{ }}` inside an HTML attribute — `class="{{ active }}"` does NOT work; use `:class="active"` instead.
- Treating `v-html` as safe — it renders raw HTML and is an XSS vector for any user-controlled content; sanitize with DOMPurify first.
- Forgetting the `:` shorthand changes meaning — `prop="value"` passes the literal string "value", but `:prop="value"` passes the JS variable `value`.
- Putting statements (not expressions) in `{{ }}` — `{{ if (x) return 1 }}` is invalid; use ternaries or computed properties instead.
- Using modifiers on the wrong directive — `v-if.prevent` is meaningless; modifiers belong to specific directives (e.g. `@click.prevent`, `v-model.trim`).

### Real-World Applications

- GitLab's merge request diff view uses `:class` bindings to highlight added/removed lines and to mark comment threads.
- Alibaba's Tmall product pages use `v-bind` heavily to wire image URLs, price, and stock to server-rendered data hydration.
- Adobe Portfolio's template editor uses dynamic arguments (`@[event]="handler"`) to support user-configurable trigger events.
- Nintendo's news pages use `{{ }}` interpolation for localized strings driven by a headless CMS.

### Interview Questions

- 1. What's the difference between `class="active"` and `:class="active"`? — The first passes the literal string "active"; the second evaluates `active` as a JS expression in the component scope.
- 2. When is `v-html` safe to use? — Only with content you fully control or have sanitized (e.g. via DOMPurify); never with raw user input.
- 3. What is a directive in Vue? — A special `v-*` attribute that applies reactive DOM behavior; built-ins include v-if, v-for, v-bind, v-on, v-model, v-show.
- 4. What is the difference between `@click` and `@click.native`? — In Vue 3, `.native` is removed (listeners always fall through to the root element); you attach native events directly with `@click`.
- 5. How do dynamic arguments work? — `@[eventName]="handler"` lets the event name be a JS expression, e.g. `@[isTouch ? 'touchstart' : 'mousedown']`.

### Mini Project

Build a "Dynamic Greeting" card: An SFC with an input bound to a `name` ref, a select bound to a `color` ref, and a checkbox bound to a `shout` ref. The greeting re-renders live with the chosen color and case. Suggested approach:
  - Use `v-model` (covered fully in Stage 9) on the input, select, and checkbox
  - Bind the greeting's `:style` to the chosen color
  - Compute the display name in a `{{ }}` expression using `shout ? name.toUpperCase() : name`
  - Add a button `@click="name = ''"` to reset
  - Use `:disabled` on the reset button when the name is empty

### Exercises

1. Render `{{ 1 + 2 }}` and `{{ "ab".repeat(3) }}` in a template; verify expressions work.
2. Bind an `<img>` `:src` and `:alt` from two refs and toggle them with a button.
3. Use `@click.prevent` on an `<a href>` to log without navigating.
4. Render a user-supplied string with `v-html` and observe the XSS risk in the devtools console.
5. Add a dynamic event argument `@[eventName]="handler"` where eventName is a ref toggled between "click" and "dblclick".
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which syntax is used for text interpolation in Vue templates?
9. A) {% ... %}
10. B) ${ ... }
11. C) {{ ... }} (*)
12. D) #{ ... }
13. Explanation: Vue uses double-curly `{{ }}` (mustache) for text interpolation; the result is HTML-escaped.
14. Q2: Which is the shorthand for v-bind:href?
15. A) #href
16. B) @href
17. C) ->href
18. D) :href (*)
19. Explanation: `:href` is the shorthand for `v-bind:href`; `@` is for v-on and `#` is for v-slot.
20. Q3: Which is the shorthand for v-on:click?
21. A) @click (*)
22. B) :click
23. C) #click
24. D) ->click
25. Explanation: `@click` is the shorthand for `v-on:click`; `:` is for v-bind and `#` is for v-slot.
26. Q4: What does prop="value" do (no colon)?
27. A) Passes the JS variable named `value`
28. B) Passes the literal string "value" to the prop (*)
29. C) Passes the number 0
30. D) Throws a compile error
31. Explanation: Without the `:` (v-bind), the attribute value is the literal string; `:prop="value"` is needed to pass a JS expression.
32. Q5: Why is v-html dangerous with user input?
33. A) It is slower than {{ }}
34. B) It escapes HTML entities twice
35. C) It renders raw HTML and enables XSS attacks (*)
36. D) It cannot render script tags
37. Explanation: `v-html` injects raw HTML into the DOM, bypassing Vue's auto-escaping; any user-controlled content must be sanitized first.
38. Q6: Which expression is INVALID inside {{ }}?
39. A) {{ 1 + 2 }}
40. B) {{ name.toUpperCase() }}
41. C) {{ count > 5 ? 'hi' : 'lo' }}
42. D) {{ if (x) return 1 }} (*)
43. Explanation: `{{ }}` accepts a single expression, not a statement; `if`/`return` are statements. Use ternaries or computed properties.
44. Q7: What does @click.prevent do?
45. A) Calls event.preventDefault() before the handler runs (*)
46. B) Prevents the click event entirely
47. C) Prevents the handler from running more than once
48. D) Stops propagation
49. Explanation: `.prevent` is a modifier that calls `event.preventDefault()` automatically (e.g. to stop a form submit); `.stop` calls stopPropagation.
50. Q8: What is a dynamic argument in Vue 3?
51. A) An argument prefixed with `$`
52. B) An argument wrapped in square brackets, e.g. :[attrName]="x" (*)
53. C) An argument passed via props
54. D) An argument resolved at runtime by Vue DevTools
55. Explanation: `:[attrName]="x"` and `@[eventName]="h"` allow the attribute or event name to be a JS expression, evaluated reactively.
56. Q9: Which of the following is a Vue directive?
57. A) v-if
58. B) v-for
59. C) All of the above (*)
60. D) v-model
61. Explanation: v-if, v-for, and v-model are all built-in Vue directives; custom directives can also be registered via `app.directive()`.
62. Q10: What is a directive modifier?
63. A) A way to chain directives
64. B) A type of prop
65. C) A compiler flag
66. D) A postfix like .prevent or .trim that alters directive behavior (*)
67. Explanation: Modifiers (`.prevent`, `.stop`, `.once`, `.trim`, `.number`) customize a directive's behavior; e.g. `@click.once` runs only on the first click.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which syntax is used for text interpolation in Vue templates?
  options:
    - "{% ... %}"
    - ${ ... }
    - "{{ ... }}"
    - "#{ ... }"
  correctIndex: 2
  explanation: Vue uses double-curly `{{ }}` (mustache) for text interpolation; the result is HTML-escaped.
- id: q2
  question: Which is the shorthand for v-bind:href?
  options:
    - "#href"
    - "@href"
    - ->href
    - :href
  correctIndex: 3
  explanation: "`:href` is the shorthand for `v-bind:href`; `@` is for v-on and `#` is for v-slot."
- id: q3
  question: Which is the shorthand for v-on:click?
  options:
    - "@click"
    - :click
    - "#click"
    - ->click
  correctIndex: 0
  explanation: "`@click` is the shorthand for `v-on:click`; `:` is for v-bind and `#` is for v-slot."
- id: q4
  question: What does prop="value" do (no colon)?
  options:
    - Passes the JS variable named `value`
    - Passes the literal string "value" to the prop
    - Passes the number 0
    - Throws a compile error
  correctIndex: 1
  explanation: Without the `:` (v-bind), the attribute value is the literal string; `:prop="value"` is needed to pass a JS expression.
- id: q5
  question: Why is v-html dangerous with user input?
  options:
    - It is slower than {{ }}
    - It escapes HTML entities twice
    - It renders raw HTML and enables XSS attacks
    - It cannot render script tags
  correctIndex: 2
  explanation: "`v-html` injects raw HTML into the DOM, bypassing Vue's auto-escaping; any user-controlled content must be sanitized first."
- id: q6
  question: Which expression is INVALID inside {{ }}?
  options:
    - "{{ 1 + 2 }}"
    - "{{ name.toUpperCase() }}"
    - "{{ count > 5 ? 'hi' : 'lo' }}"
    - "{{ if (x) return 1 }}"
  correctIndex: 3
  explanation: "`{{ }}` accepts a single expression, not a statement; `if`/`return` are statements. Use ternaries or computed properties."
- id: q7
  question: What does @click.prevent do?
  options:
    - Calls event.preventDefault() before the handler runs
    - Prevents the click event entirely
    - Prevents the handler from running more than once
    - Stops propagation
  correctIndex: 0
  explanation: "`.prevent` is a modifier that calls `event.preventDefault()` automatically (e.g. to stop a form submit); `.stop` calls stopPropagation."
- id: q8
  question: What is a dynamic argument in Vue 3?
  options:
    - An argument prefixed with `$`
    - An argument wrapped in square brackets, e.g. :[attrName]="x"
    - An argument passed via props
    - An argument resolved at runtime by Vue DevTools
  correctIndex: 1
  explanation: '`:[attrName]="x"` and `@[eventName]="h"` allow the attribute or event name to be a JS expression, evaluated reactively.'
- id: q9
  question: Which of the following is a Vue directive?
  options:
    - v-if
    - v-for
    - All of the above
    - v-model
  correctIndex: 2
  explanation: v-if, v-for, and v-model are all built-in Vue directives; custom directives can also be registered via `app.directive()`.
- id: q10
  question: What is a directive modifier?
  options:
    - A way to chain directives
    - A type of prop
    - A compiler flag
    - A postfix like .prevent or .trim that alters directive behavior
  correctIndex: 3
  explanation: Modifiers (`.prevent`, `.stop`, `.once`, `.trim`, `.number`) customize a directive's behavior; e.g. `@click.once` runs only on the first click.
```

