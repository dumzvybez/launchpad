---
slug: javascript-events-interactivity
id: javascript-06
track: javascript
order: 6
title: Events and Interactivity
description: Wire up user interactions with `addEventListener`, event delegation, custom events, and form handling — and learn when to `preventDefault` and `stopPropagation`.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=3900s
whyItMatters: Wire up user interactions with `addEventListener`, event delegation, custom events, and form handling — and learn when to `preventDefault` and `stopPropagation`.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Events and Interactivity

## Events and Interactivity

### Why It Matters

Wire up user interactions with `addEventListener`, event delegation, custom events, and form handling — and learn when to `preventDefault` and `stopPropagation`.

Wire up user interactions with `addEventListener`, event delegation, custom events, and form handling — and learn when to `preventDefault` and `stopPropagation`.

### Prerequisites

- Stage 5: Objects and the DOM
- Comfort selecting and modifying DOM nodes.

### Topics

- addEventListener and removeEventListener
- Event object: target, currentTarget, bubbles, preventDefault, stopPropagation
- Event delegation via bubbling
- Mouse, keyboard, focus, input, change, submit events
- Custom events with `new CustomEvent` and dispatchEvent
- Form handling: FormData, validation, constraint validation API
- Debouncing and throttling input
- The passive flag and scroll performance

### Key Concepts

- Events bubble from target up to document (unless stopPropagation); use this for delegation
- `event.target` is the deepest element clicked; `event.currentTarget` is the element the listener is attached to
- `preventDefault` stops the default action (form submit, link click); `stopPropagation` stops bubbling
- Event delegation attaches ONE listener to a parent and dispatches based on `target.closest()`
- Listeners registered with `{ passive: true }` can't preventDefault but enable smoother scroll
- Removing a listener requires the SAME function reference — anonymous functions can't be removed

```javascript
document.querySelector("#list").addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (!item) return;
  const id = item.dataset.id;
  if (e.target.matches(".delete")) {
    item.remove();
  } else {
    item.classList.toggle("selected");
  }
});
```
Caption: Event delegation

### Common Pitfalls

- Adding many listeners instead of one delegated listener — for a 1000-row table, attach one listener to the `<tbody>` and use `closest()`.
- Calling `removeEventListener` with a new function reference — must pass the SAME reference used in `addEventListener`; store it in a variable.
- Forgetting `preventDefault` on form submit — the page reloads and your handler's fetch never fires; always preventDefault for SPA forms.
- Using `stopPropagation` to "fix" double-handling — usually masks a design bug; prefer checking `e.target` and using `closest()`.
- Adding scroll/touch listeners without `passive: true` — blocks the compositor and janks the page; mark them passive when you don't need preventDefault.

### Real-World Applications

- Trello's board uses event delegation on the lists container to handle drag, click, and edit events for hundreds of cards with a single set of listeners.
- Google Calendar's month view uses passive touch listeners so panning stays 60fps even with hundreds of events rendered.
- Twitter/X's infinite scroll uses throttled scroll/IntersectionObserver handlers to load tweets without locking the main thread.
- Notion's contenteditable editor uses custom events to coordinate between its block tree, the toolbar, and the cursor — a pattern that ships to millions of users.

### Interview Questions

- 1. What's the difference between `target` and `currentTarget`? — target is the element that triggered the event; currentTarget is the element the listener is attached to (changes during bubbling).
- 2. What is event delegation? — Attaching one listener to a parent and using `e.target.closest()` to handle child events; saves memory and handles dynamically added children.
- 3. When would you use `preventDefault` vs `stopPropagation`? — preventDefault stops the browser's default (form submit, link nav); stopPropagation stops bubbling/capturing.
- 4. What is the passive flag? — Tells the browser the listener won't call preventDefault, enabling scroll/touch optimizations; never call preventDefault in a passive listener.
- 5. Why can't you remove an anonymous listener? — removeEventListener needs the same function reference used to add it; anonymous functions have no reference.

### Mini Project

Build a "Keyboard Shortcuts Dashboard" that listens for `Cmd/Ctrl+K` (search), `Cmd/Ctrl+/` (help), and arrow-key navigation, and shows a live log of the last 10 shortcuts pressed. It takes keyboard input and outputs a visible command palette. Suggested approach:
  - Listen on `document` for `keydown` and check `e.metaKey || e.ctrlKey` plus `e.key`
  - Use a custom event `shortcut-fired` so the log panel is decoupled from the listener
  - Show a palette overlay when Cmd+K is pressed; filter options by typed query
  - Use event delegation on the palette's list for click selection
  - Add a "Recording" toggle that captures all key presses for 5 seconds for debugging

### Exercises

1. Implement `throttle(fn, ms)` that fires at most once per interval (vs debounce which fires after).
2. Build a delegated click handler that logs which child of a `<ul>` was clicked, including dynamically added items.
3. Add a `paste` event handler that strips HTML and only keeps plain text in a contenteditable div.
4. Create a custom `toast` event system: dispatch from anywhere, listen on `document`, render a notification.
5. Add `passive: true` scroll listener that updates a progress bar — measure scroll jank before/after.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `event.target` is:
9. A) The element the listener is attached to
10. B) The deepest element that triggered the event (*)
11. C) Always document.body
12. D) The parent of the clicked element
13. Explanation: target is the element on which the event occurred; currentTarget is the element with the listener.
14. Q2: Event delegation works because events:
15. A) Are captured
16. B) Bubble up the DOM (*)
17. C) Are synchronous
18. D) Are queued
19. Explanation: Events bubble from target to document, so a parent listener can handle events from any descendant.
20. Q3: `e.preventDefault()` on a form submit:
21. A) Stops the page reload and lets you handle it in JS (*)
22. B) Removes the form from the DOM
23. C) Deletes the form data
24. D) Disables validation
25. Explanation: preventDefault stops the browser's default action — for forms, the GET navigation/POST reload.
26. Q4: `removeEventListener` requires:
27. A) The same function reference used to add it (*)
28. B) Just the event name
29. C) A string description
30. D) The element only
31. Explanation: You must pass the exact same function reference; anonymous functions can't be removed.
32. Q5: `{ passive: true }` on a scroll listener:
33. A) Lets you call preventDefault
34. B) Promises you won't preventDefault, enabling scroll optimization (*)
35. C) Disables the listener
36. D) Forces async behavior
37. Explanation: passive tells the browser it can scroll without waiting for your listener — crucial for 60fps scrolling.
38. Q6: `stopPropagation`:
39. A) Prevents the default action
40. B) Stops bubbling to ancestor listeners (*)
41. C) Removes the listener
42. D) Cancels async events
43. Explanation: stopPropagation stops the event from continuing up (or down) the DOM tree; it does not preventDefault.
44. Q7: `new CustomEvent("x", { detail: {...} })`:
45. A) Creates a DOM node
46. B) Creates an event with custom payload accessible via e.detail (*)
47. C) Defines a new event type that's built in
48. D) Is only available in Node.js
49. Explanation: CustomEvent carries arbitrary data in `detail`, dispatched via dispatchEvent and received by listeners.
50. Q8: Best practice for handling clicks on 500 list items?
51. A) 500 listeners
52. B) Inline onclick attributes
53. C) One delegated listener on the parent (*)
54. D) Polling every 100ms
55. Explanation: Delegation uses one listener and handles dynamically added items — far better memory and CPU.
56. Q9: Which event fires when a user types in an `<input>`?
57. A) submit
58. B) click
59. C) input (*)
60. D) load
61. Explanation: `input` fires on every value change (including paste); `change` fires on blur for text inputs.
62. Q10: Why use `closest()` in a delegated handler?
63. A) To find the nearest matching ancestor (or self) of the clicked element (*)
64. B) To close the page
65. C) To remove the element
66. D) To find child elements
67. Explanation: e.target.closest(".item") returns the nearest ancestor (or self) matching the selector, even if you clicked a child.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`event.target` is:"
  options:
    - The element the listener is attached to
    - The deepest element that triggered the event
    - Always document.body
    - The parent of the clicked element
  correctIndex: 1
  explanation: target is the element on which the event occurred; currentTarget is the element with the listener.
- id: q2
  question: "Event delegation works because events:"
  options:
    - Are captured
    - Bubble up the DOM
    - Are synchronous
    - Are queued
  correctIndex: 1
  explanation: Events bubble from target to document, so a parent listener can handle events from any descendant.
- id: q3
  question: "`e.preventDefault()` on a form submit:"
  options:
    - Stops the page reload and lets you handle it in JS
    - Removes the form from the DOM
    - Deletes the form data
    - Disables validation
  correctIndex: 0
  explanation: preventDefault stops the browser's default action — for forms, the GET navigation/POST reload.
- id: q4
  question: "`removeEventListener` requires:"
  options:
    - The same function reference used to add it
    - Just the event name
    - A string description
    - The element only
  correctIndex: 0
  explanation: You must pass the exact same function reference; anonymous functions can't be removed.
- id: q5
  question: "`{ passive: true }` on a scroll listener:"
  options:
    - Lets you call preventDefault
    - Promises you won't preventDefault, enabling scroll optimization
    - Disables the listener
    - Forces async behavior
  correctIndex: 1
  explanation: passive tells the browser it can scroll without waiting for your listener — crucial for 60fps scrolling.
- id: q6
  question: "`stopPropagation`:"
  options:
    - Prevents the default action
    - Stops bubbling to ancestor listeners
    - Removes the listener
    - Cancels async events
  correctIndex: 1
  explanation: stopPropagation stops the event from continuing up (or down) the DOM tree; it does not preventDefault.
- id: q7
  question: '`new CustomEvent("x", { detail: {...} })`:'
  options:
    - Creates a DOM node
    - Creates an event with custom payload accessible via e.detail
    - Defines a new event type that's built in
    - Is only available in Node.js
  correctIndex: 1
  explanation: CustomEvent carries arbitrary data in `detail`, dispatched via dispatchEvent and received by listeners.
- id: q8
  question: Best practice for handling clicks on 500 list items?
  options:
    - 500 listeners
    - Inline onclick attributes
    - One delegated listener on the parent
    - Polling every 100ms
  correctIndex: 2
  explanation: Delegation uses one listener and handles dynamically added items — far better memory and CPU.
- id: q9
  question: Which event fires when a user types in an `<input>`?
  options:
    - submit
    - click
    - input
    - load
  correctIndex: 2
  explanation: "`input` fires on every value change (including paste); `change` fires on blur for text inputs."
- id: q10
  question: Why use `closest()` in a delegated handler?
  options:
    - To find the nearest matching ancestor (or self) of the clicked element
    - To close the page
    - To remove the element
    - To find child elements
  correctIndex: 0
  explanation: e.target.closest(".item") returns the nearest ancestor (or self) matching the selector, even if you clicked a child.
```

