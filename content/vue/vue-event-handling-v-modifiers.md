---
slug: vue-event-handling-v-modifiers
id: vue-08
track: vue
order: 8
title: Event Handling — v-on, Modifiers
description: Attach event handlers with v-on (and the @ shorthand), use built-in modifiers for common patterns, and learn key aliases and system modifier keys.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=CYPZBK8zUik
whyItMatters: Attach event handlers with v-on (and the @ shorthand), use built-in modifiers for common patterns, and learn key aliases and system modifier keys.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Event Handling — v-on, Modifiers

## Event Handling — v-on, Modifiers

### Why It Matters

Attach event handlers with v-on (and the @ shorthand), use built-in modifiers for common patterns, and learn key aliases and system modifier keys.

Attach event handlers with v-on (and the @ shorthand), use built-in modifiers for common patterns, and learn key aliases and system modifier keys.

### Prerequisites

- Stage 3: Template Syntax (v-on basics).
- Stage 2: refs and methods.

### Topics

- `v-on` and the `@` shorthand
- Inline handlers vs method handlers (`@click="doThing"` vs `@click="doThing()"`)
- Accessing the event object: `$event` and explicit arguments
- Event modifiers: `.stop`, `.prevent`, `.capture`, `.self`, `.once`, `.passive`
- Key modifiers: `.enter`, `.tab`, `.delete`, `.esc`, `.space`, `.up`, etc.
- System modifiers: `.ctrl`, `.alt`, `.shift`, `.meta`, `.exact`
- Mouse modifiers: `.left`, `.middle`, `.right`
- Chaining modifiers (`@click.stop.prevent`)

### Key Concepts

- `@click="handler"` passes the handler reference (method handler); `@click="handler()"` calls it (inline)
- Modifiers are processed left-to-right: `@click.stop.prevent` calls stopPropagation then preventDefault
- Key modifiers match against `KeyboardEvent.key` kebab-cased (e.g. `.page-down`)
- `.passive` improves scroll performance on mobile by hinting the handler will not call preventDefault
- `.exact` ensures no other system modifiers are pressed (e.g. `@click.ctrl.exact` = ctrl only)

```vue
<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);

function increment(by: number = 1, event?: MouseEvent) {
  count.value += by;
  console.log("event target:", event?.target);
}
</script>

<template>
  <!-- Method handler: passes the event implicitly -->
  <button @click="increment">Add 1</button>

  <!-- Inline handler: pass explicit args; use $event for the event -->
  <button @click="increment(5, $event)">Add 5</button>
</template>
```
Caption: Method vs inline handler

### Common Pitfalls

- Confusing `@click="handler"` (method handler) with `@click="handler()"` (inline) — the latter runs once per render? No, it runs per click, but the event object is NOT passed automatically; use `$event` explicitly.
- Chaining modifiers in the wrong order — `@click.prevent.stop` and `@click.stop.prevent` both work, but be deliberate: the order reflects intent (e.g. stop bubbling before preventing default).
- Using `.passive` with `.prevent` — `.passive` hints the browser you will NOT call `preventDefault`; combining with `.prevent` is contradictory and Vue warns.
- Forgetting key modifier names are kebab-cased — `@keyup.page-down` works; `@keyup.PageDown` does not.
- Overusing `.stop` — it can break event delegation patterns; prefer `.self` or check `event.target` in the handler.

### Real-World Applications

- GitLab's keyboard shortcuts use `@keydown.ctrl.enter` to submit comments and `@keydown.esc` to close modals.
- Alibaba's Tmall uses `@scroll.passive` on long product lists for smooth mobile scrolling.
- Behance's gallery uses `@mousedown.left` to start drag-select and `@click.self` to close the lightbox when the backdrop is clicked.
- Adobe Portfolio's editor uses `@keydown.meta.s` (Cmd/Ctrl+S) to save drafts and intercept the browser save dialog with `.prevent`.

### Interview Questions

- 1. What's the difference between `@click="handler"` and `@click="handler()"`? — The first is a method handler (event passed automatically); the second is an inline call (use `$event` to access the event).
- 2. What does `@click.stop` do? — Calls `event.stopPropagation()` before the handler runs, preventing the event from bubbling to ancestors.
- 3. What does `.passive` do and when is it useful? — Hints to the browser that the handler will not call preventDefault, enabling scroll optimizations; ideal for `@scroll`/`@touchmove`.
- 4. What's the difference between `.ctrl` and `.ctrl.exact`? — `.ctrl` requires Ctrl to be pressed (others allowed); `.ctrl.exact` requires Ctrl ONLY (no shift/alt/meta).
- 5. How are key modifier names derived? — From `KeyboardEvent.key` kebab-cased, e.g. `PageDown` becomes `@keyup.page-down`.

### Mini Project

Build a "Keyboard Navigator" mini-app: An SFC that displays a list of items and lets you navigate them with arrow keys, select with Enter, and cancel with Esc. Show the active index live. Suggested approach:
  - Hold items in `ref<string[]>` and an `activeIndex` ref
  - Add `@keydown.down="moveDown"`, `@keydown.up="moveUp"`, `@keydown.enter="select"`, `@keydown.esc="cancel"` on a focusable container
  - Use `tabindex="0"` on the container so it can receive keyboard focus
  - Highlight the active item with `:class="{ active: i === activeIndex }"`
  - Log the selected item text to a "history" array ref

### Exercises

1. Build a button with `@click.stop` inside a parent that also has `@click`; verify only the child handler runs.
2. Use `@submit.prevent` on a form and log the form data without reloading the page.
3. Add an input that responds only to `@keyup.enter` and `@keyup.esc`.
4. Use `@click.ctrl.exact` to trigger an action only when Ctrl is pressed alone.
5. Add `@scroll.passive` to a long list and verify (via performance panel) that scroll is smooth.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the shorthand for v-on:click?
9. A) :click
10. B) #click
11. C) ->click
12. D) @click (*)
13. Explanation: `@click` is the shorthand for `v-on:click`; `:` is for v-bind and `#` is for v-slot.
14. Q2: What's the difference between @click="handler" and @click="handler()"?
15. A) The first passes the event automatically; the second is an inline call where you pass $event explicitly (*)
16. B) No difference
17. C) The first is invalid
18. D) The second is invalid
19. Explanation: A method handler `@click="handler"` receives the event as the first argument; an inline call `@click="handler()"` runs the function and uses `$event` for the event.
20. Q3: What does @click.stop do?
21. A) Calls event.preventDefault()
22. B) Calls event.stopPropagation() (*)
23. C) Runs the handler only once
24. D) Cancels the click
25. Explanation: `.stop` calls `event.stopPropagation()` so the event does not bubble to ancestors.
26. Q4: What does @submit.prevent do?
27. A) Stops propagation
28. B) Disables the submit button
29. C) Calls event.preventDefault() to stop the form from submitting (*)
30. D) Validates the form
31. Explanation: `.prevent` calls `event.preventDefault()`, preventing the default form submission and page reload.
32. Q5: What does .passive signal to the browser?
33. A) The handler is async
34. B) The handler runs only once
35. C) The handler runs on a Web Worker
36. D) The handler will never call preventDefault, enabling scroll perf optimizations (*)
37. Explanation: `.passive` is a hint that the handler will not cancel the event, letting the browser optimize scrolling and touch.
38. Q6: Which key modifier triggers on Enter?
39. A) @keyup.enter (*)
40. B) @keyup.return
41. C) @keyup.13
42. D) @keyup.ENTER
43. Explanation: Vue provides `.enter` as an alias for the Enter key; `.13` (the keyCode) is deprecated and discouraged.
44. Q7: What does @click.ctrl.exact require?
45. A) Ctrl+any other modifier
46. B) Ctrl only — no other system modifiers pressed (*)
47. C) Any modifier
48. D) Just any click
49. Explanation: `.exact` requires that no other system modifiers (shift/alt/meta) are pressed, so `@click.ctrl.exact` means Ctrl alone.
50. Q8: How are key modifier names derived?
51. A) From event.keyCode
52. B) From event.code only
53. C) From event.key kebab-cased (*)
54. D) Arbitrary names
55. Explanation: Vue derives key modifier names from `KeyboardEvent.key` kebab-cased, e.g. `PageDown` -> `@keyup.page-down`.
56. Q9: Which is TRUE about combining .passive with .prevent?
57. A) They work great together
58. B) .prevent wins
59. C) .passive wins
60. D) It's contradictory — .passive hints no preventDefault, .prevent calls it; Vue warns (*)
61. Explanation: `.passive` and `.prevent` contradict each other; Vue will warn and the browser will ignore the preventDefault call.
62. Q10: What does @click.self do?
63. A) Calls the handler only if event.target is the element itself, not a descendant (*)
64. B) Calls the handler only on the root element
65. C) Prevents propagation
66. D) Runs the handler once
67. Explanation: `.self` only triggers the handler if `event.target === event.currentTarget`, ignoring bubbled events from descendants.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the shorthand for v-on:click?
  options:
    - :click
    - "#click"
    - ->click
    - "@click"
  correctIndex: 3
  explanation: "`@click` is the shorthand for `v-on:click`; `:` is for v-bind and `#` is for v-slot."
- id: q2
  question: What's the difference between @click="handler" and @click="handler()"?
  options:
    - The first passes the event automatically; the second is an inline call where you pass $event explicitly
    - No difference
    - The first is invalid
    - The second is invalid
  correctIndex: 0
  explanation: A method handler `@click="handler"` receives the event as the first argument; an inline call `@click="handler()"` runs the function and uses `$event` for the event.
- id: q3
  question: What does @click.stop do?
  options:
    - Calls event.preventDefault()
    - Calls event.stopPropagation()
    - Runs the handler only once
    - Cancels the click
  correctIndex: 1
  explanation: "`.stop` calls `event.stopPropagation()` so the event does not bubble to ancestors."
- id: q4
  question: What does @submit.prevent do?
  options:
    - Stops propagation
    - Disables the submit button
    - Calls event.preventDefault() to stop the form from submitting
    - Validates the form
  correctIndex: 2
  explanation: "`.prevent` calls `event.preventDefault()`, preventing the default form submission and page reload."
- id: q5
  question: What does .passive signal to the browser?
  options:
    - The handler is async
    - The handler runs only once
    - The handler runs on a Web Worker
    - The handler will never call preventDefault, enabling scroll perf optimizations
  correctIndex: 3
  explanation: "`.passive` is a hint that the handler will not cancel the event, letting the browser optimize scrolling and touch."
- id: q6
  question: Which key modifier triggers on Enter?
  options:
    - "@keyup.enter"
    - "@keyup.return"
    - "@keyup.13"
    - "@keyup.ENTER"
  correctIndex: 0
  explanation: Vue provides `.enter` as an alias for the Enter key; `.13` (the keyCode) is deprecated and discouraged.
- id: q7
  question: What does @click.ctrl.exact require?
  options:
    - Ctrl+any other modifier
    - Ctrl only — no other system modifiers pressed
    - Any modifier
    - Just any click
  correctIndex: 1
  explanation: "`.exact` requires that no other system modifiers (shift/alt/meta) are pressed, so `@click.ctrl.exact` means Ctrl alone."
- id: q8
  question: How are key modifier names derived?
  options:
    - From event.keyCode
    - From event.code only
    - From event.key kebab-cased
    - Arbitrary names
  correctIndex: 2
  explanation: Vue derives key modifier names from `KeyboardEvent.key` kebab-cased, e.g. `PageDown` -> `@keyup.page-down`.
- id: q9
  question: Which is TRUE about combining .passive with .prevent?
  options:
    - They work great together
    - .prevent wins
    - .passive wins
    - It's contradictory — .passive hints no preventDefault, .prevent calls it; Vue warns
  correctIndex: 3
  explanation: "`.passive` and `.prevent` contradict each other; Vue will warn and the browser will ignore the preventDefault call."
- id: q10
  question: What does @click.self do?
  options:
    - Calls the handler only if event.target is the element itself, not a descendant
    - Calls the handler only on the root element
    - Prevents propagation
    - Runs the handler once
  correctIndex: 0
  explanation: "`.self` only triggers the handler if `event.target === event.currentTarget`, ignoring bubbled events from descendants."
```

