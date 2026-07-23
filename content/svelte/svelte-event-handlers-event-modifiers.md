---
slug: svelte-event-handlers-event-modifiers
id: svelte-05
track: svelte
order: 5
title: Event Handlers and Event Modifiers
description: Handle DOM and component events in Svelte 5, use keyboard modifiers and component callbacks, and migrate from Svelte 4's `on:` directive to `onclick` and friends.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=120s
whyItMatters: Handle DOM and component events in Svelte 5, use keyboard modifiers and component callbacks, and migrate from Svelte 4's `on:` directive to `onclick` and friends.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Event Handlers and Event Modifiers

## Event Handlers and Event Modifiers

### Why It Matters

Handle DOM and component events in Svelte 5, use keyboard modifiers and component callbacks, and migrate from Svelte 4's `on:` directive to `onclick` and friends.

Handle DOM and component events in Svelte 5, use keyboard modifiers and component callbacks, and migrate from Svelte 4's `on:` directive to `onclick` and friends.

### Prerequisites

- Stage 1-4 (basic components, props, snippets).
- Familiarity with DOM events (click, input, keydown).

### Topics

- The `onclick={fn}` syntax (Svelte 5) vs `on:click={fn}` (Svelte 4)
- Event modifiers: |preventDefault, |stopPropagation, |once, |self, |trusted
- Keyboard event modifiers: |enter, |escape, |space, |ctrl, |shift
- Component callbacks (props-as-functions instead of events)
- Forwarding DOM events with rest props
- Custom events (Svelte 4 createEventDispatcher — deprecated in 5)
- Synthetic vs native events
- Programmatic event dispatch with dispatchEvent

### Key Concepts

- Svelte 5 prefers plain DOM-style attributes (`onclick`) over `on:click` — same name as HTML, works with rest spread
- Event modifiers (|preventDefault etc.) only work with `on:` syntax in Svelte 4; in Svelte 5, inline them in the handler
- Svelte 5 components communicate via callback props, not createEventDispatcher
- `onclickcapture` is supported for capture-phase listeners
- Multiple handlers: pass an array `onclick={[fn1, fn2]}` (Svelte 5)

```svelte
<script lang="ts">
  let count = $state(0);
</script>

<button onclick={() => count++}>+1</button>
<button onclick={(e) => { e.preventDefault(); count = 0; }}>Reset</button>
```
Caption: Svelte 5 event handler syntax

### Common Pitfalls

- Using `on:click` in a Svelte 5 runes component — works but is deprecated style; use `onclick` (no colon) for consistency and rest-prop spread.
- Expecting `|preventDefault` to work with `onclick={fn}` — modifiers only work with `on:` syntax; in Svelte 5 call `e.preventDefault()` inside the handler.
- Using `createEventDispatcher` in Svelte 5 — pass callback props instead: `let { onsave } = $props(); onsave?.(data);`.
- Forgetting to forward events from a wrapper component — spread `...rest` onto the inner element so parent `onclick` still fires.
- Confusing `onclick` with `onClick` (React) — Svelte follows HTML: `onclick` lowercase, no camelCase.

### Real-World Applications

- Apple Music's transport buttons use Svelte event handlers with preventDefault for custom media key handling.
- The New York Times' interactive maps use capture-phase handlers to track pointer movement over layered SVG.
- Rakuten's checkout flow uses callback props for shipping-method changes that bubble to the cart store.
- Chess.com's board uses keydown modifiers (|enter, |escape) to control analysis mode without mouse interaction.

### Interview Questions

- 1. What's the Svelte 5 event handler syntax? — `onclick={fn}` (HTML-style attribute), replacing Svelte 4's `on:click={fn}`.
- 2. How do you do `on:click|preventDefault` in Svelte 5? — Call `e.preventDefault()` inside the handler function; modifiers only work with the `on:` directive.
- 3. How do components emit events in Svelte 5? — Pass callback props: `let { onsave } = $props()` and call `onsave?.(data)` instead of createEventDispatcher.
- 4. How do you forward DOM events through a wrapper? — Destructure `...rest` from $props() and spread `{...rest}` onto the inner element.
- 5. Can you attach multiple handlers to one event? — Yes, in Svelte 5 pass an array: `onclick={[fn1, fn2]}`.

### Mini Project

Build a Search Box with Callbacks: A `Search.svelte` component with a query input, a debounced `onsearch` callback, and `onclear`; a parent page that displays the latest results below. Use Svelte 5 callback props (no createEventDispatcher) and handle Enter and Escape keys. Suggested approach:
  - Declare `onsearch?: (q: string) => void` and `onclear?: () => void` props
  - Use $state for query and an $effect to debounce onsearch by 200ms
  - On Enter, fire onsearch immediately; on Escape, clear and fire onclear
  - Forward aria-* and disabled via rest props to the <input>
  - In the parent, render results filtered by the last query string

### Exercises

1. Convert a Svelte 4 `on:click|preventDefault={fn}` to Svelte 5 `onclick` with inline preventDefault.
2. Build a Button component that forwards `onclick` and aria-label via rest props.
3. Replace a `createEventDispatcher`-based component with callback props.
4. Add both `onclick` and `onkeydown` handlers to a custom dropdown trigger.
5. Implement a debounced input using $effect and a setTimeout cleanup.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the Svelte 5 syntax for a click handler?
9. A) onclick={fn} (*)
10. B) on:click={fn}
11. C) onClick={fn}
12. D) v-on:click={fn}
13. Explanation: Svelte 5 prefers HTML-style `onclick={fn}` (lowercase, no colon); `on:click` still works but is legacy.
14. Q2: How do you prevent default in Svelte 5?
15. A) onclick|preventDefault
16. B) Call e.preventDefault() inside the handler (*)
17. C) Use the `prevent` modifier
18. D) Set the form's action to ""
19. Explanation: Event modifiers (|preventDefault) only work with the `on:` directive; in Svelte 5 with `onclick`, call e.preventDefault() inside the handler.
20. Q3: How do Svelte 5 components emit events?
21. A) createEventDispatcher
22. B) dispatchEvent only
23. C) Callback props like `onsave?: (data) => void` (*)
24. D) emit("event")
25. Explanation: Svelte 5 uses callback props (functions passed as props) instead of createEventDispatcher, which is deprecated.
26. Q4: Which directive syntax supported event modifiers in Svelte 4?
27. A) onclick={fn}
28. B) @click={fn}
29. C) v-on:click
30. D) on:click={fn} (*)
31. Explanation: The `on:click` (with colon) directive supported modifiers like `|preventDefault`, `|stopPropagation`, `|once`.
32. Q5: How do you forward events through a wrapper component?
33. A) Spread `...rest` from $props() onto the inner element (*)
34. B) Use $forward
35. C) Re-declare on:click
36. D) Use forwardRef
37. Explanation: Destructure `...rest` and spread `{...rest}` onto the inner element — parent event handlers flow through automatically.
38. Q6: Can you attach multiple handlers to one event in Svelte 5?
39. A) No
40. B) Yes, pass an array: onclick={[fn1, fn2]} (*)
41. C) Only via on:
42. D) Only one handler per event
43. Explanation: Svelte 5 supports passing an array of handlers to `onclick={[fn1, fn2]}` — both fire in order.
44. Q7: Which modifier restricts a handler to direct (non-bubbled) events?
45. A) |direct
46. B) |local
47. C) |self (*)
48. D) |stop
49. Explanation: `|self` (Svelte 4) fires only when the event target is the element itself, not a descendant. In Svelte 5 check `e.target === e.currentTarget`.
50. Q8: What does `|once` do?
51. A) Runs once per render
52. B) Debounces the handler
53. C) Throttles to one per second
54. D) Runs the handler one time then removes it (*)
55. Explanation: `|once` ensures the handler runs only once; subsequent events of the same type are ignored. In Svelte 5, manage with a flag or removeEventListener.
56. Q9: Which is the React-style attribute that does NOT work in Svelte?
57. A) onClick (*)
58. B) onclick
59. C) on:click
60. D) on-click
61. Explanation: Svelte uses lowercase `onclick` (matching HTML); `onClick` (camelCase) is React and won't work in Svelte.
62. Q10: How do you handle keyboard-specific keys in Svelte 5?
63. A) Use |enter modifier (works only in on: syntax)
64. B) Use onkeydown={fn} and check e.key inside (*)
65. C) Use $keyboard
66. D) Use e.keyCode
67. Explanation: In Svelte 5 with `onkeydown`, check `e.key === "Enter"` inside the handler; modifiers like |enter are Svelte 4 only.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the Svelte 5 syntax for a click handler?
  options:
    - onclick={fn}
    - on:click={fn}
    - onClick={fn}
    - v-on:click={fn}
  correctIndex: 0
  explanation: Svelte 5 prefers HTML-style `onclick={fn}` (lowercase, no colon); `on:click` still works but is legacy.
- id: q2
  question: How do you prevent default in Svelte 5?
  options:
    - onclick|preventDefault
    - Call e.preventDefault() inside the handler
    - Use the `prevent` modifier
    - Set the form's action to ""
  correctIndex: 1
  explanation: Event modifiers (|preventDefault) only work with the `on:` directive; in Svelte 5 with `onclick`, call e.preventDefault() inside the handler.
- id: q3
  question: How do Svelte 5 components emit events?
  options:
    - createEventDispatcher
    - dispatchEvent only
    - "Callback props like `onsave?: (data) => void`"
    - emit("event")
  correctIndex: 2
  explanation: Svelte 5 uses callback props (functions passed as props) instead of createEventDispatcher, which is deprecated.
- id: q4
  question: Which directive syntax supported event modifiers in Svelte 4?
  options:
    - onclick={fn}
    - "@click={fn}"
    - v-on:click
    - on:click={fn}
  correctIndex: 3
  explanation: The `on:click` (with colon) directive supported modifiers like `|preventDefault`, `|stopPropagation`, `|once`.
- id: q5
  question: How do you forward events through a wrapper component?
  options:
    - Spread `...rest` from $props() onto the inner element
    - Use $forward
    - Re-declare on:click
    - Use forwardRef
  correctIndex: 0
  explanation: Destructure `...rest` and spread `{...rest}` onto the inner element — parent event handlers flow through automatically.
- id: q6
  question: Can you attach multiple handlers to one event in Svelte 5?
  options:
    - No
    - "Yes, pass an array: onclick={[fn1, fn2]}"
    - "Only via on:"
    - Only one handler per event
  correctIndex: 1
  explanation: Svelte 5 supports passing an array of handlers to `onclick={[fn1, fn2]}` — both fire in order.
- id: q7
  question: Which modifier restricts a handler to direct (non-bubbled) events?
  options:
    - "|direct"
    - "|local"
    - "|self"
    - "|stop"
  correctIndex: 2
  explanation: "`|self` (Svelte 4) fires only when the event target is the element itself, not a descendant. In Svelte 5 check `e.target === e.currentTarget`."
- id: q8
  question: What does `|once` do?
  options:
    - Runs once per render
    - Debounces the handler
    - Throttles to one per second
    - Runs the handler one time then removes it
  correctIndex: 3
  explanation: "`|once` ensures the handler runs only once; subsequent events of the same type are ignored. In Svelte 5, manage with a flag or removeEventListener."
- id: q9
  question: Which is the React-style attribute that does NOT work in Svelte?
  options:
    - onClick
    - onclick
    - on:click
    - on-click
    - ; `onClick` (camelCase) is React and won't work in Svelte.
  correctIndex: 0
  explanation: Svelte uses lowercase `onclick` (matching HTML); `onClick` (camelCase) is React and won't work in Svelte.
- id: q10
  question: How do you handle keyboard-specific keys in Svelte 5?
  options:
    - "Use |enter modifier (works only in on: syntax)"
    - Use onkeydown={fn} and check e.key inside
    - Use $keyboard
    - Use e.keyCode
  correctIndex: 1
  explanation: In Svelte 5 with `onkeydown`, check `e.key === "Enter"` inside the handler; modifiers like |enter are Svelte 4 only.
```

