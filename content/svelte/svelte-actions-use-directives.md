---
slug: svelte-actions-use-directives
id: svelte-11
track: svelte
order: 11
title: "Actions and use: Directives"
description: "Encapsulate DOM-side behavior in reusable Svelte actions (use: directives) — perfect for tooltips, click-outside, intersection-based lazy loading, and third-party library integration."
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw
whyItMatters: "Encapsulate DOM-side behavior in reusable Svelte actions (use: directives) — perfect for tooltips, click-outside, intersection-based lazy loading, and third-party library integration."
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Actions and use: Directives

## Actions and use: Directives

### Why It Matters

Encapsulate DOM-side behavior in reusable Svelte actions (use: directives) — perfect for tooltips, click-outside, intersection-based lazy loading, and third-party library integration.

Encapsulate DOM-side behavior in reusable Svelte actions (use: directives) — perfect for tooltips, click-outside, intersection-based lazy loading, and third-party library integration.

### Prerequisites

- Stage 8: Lifecycle
- Stage 5: Event Handlers
- DOM manipulation and event listener basics.

### Topics

- Defining an action: (node, params) => ({ update, destroy })
- use: directive on any element
- Action parameters and update()
- Returning destroy() for cleanup
- Built-in patterns: clickOutside, tooltip, longPress, lazy image
- SvelteAction type from svelte/action
- Combining actions with rest props
- Action + bind:this interplay

### Key Concepts

- An action is a function (node, params) => { update?, destroy? }
- update(params) fires when the params change (re-runs without remount)
- destroy() fires when the element is removed
- Actions let you reuse imperative DOM logic across components
- Actions compose with rest props: pass use:action={...} alongside {...rest}

```ts
// actions/clickOutside.ts
import type { Action } from "svelte/action";

export const clickOutside: Action<HTMLElement, (e: MouseEvent) => void> = (node, callback) => {
  const handle = (e: MouseEvent) => {
    if (!node.contains(e.target as Node)) callback?.(e);
  };
  document.addEventListener("click", handle, true);
  return {
    update(newCb) { callback = newCb; },
    destroy() { document.removeEventListener("click", handle, true); }
  };
};
```
Caption: clickOutside action

### Common Pitfalls

- Forgetting to return destroy() — leaks listeners and observers; the action keeps firing after the element is gone.
- Not handling parameter changes via update() — if params change without remount, the action uses stale values; implement update to refresh.
- Mutating the DOM node directly without cleanup — restore styles/attributes in destroy to avoid leaking changes.
- Using actions as a substitute for components — actions are for imperative DOM glue; complex UI should be a component.
- Adding actions inside {#if} blocks and expecting them to persist — actions attach on mount and detach on unmount; re-mounting re-runs them.

### Real-World Applications

- The New York Times uses a clickOutside action to close share dialogs and overlays.
- Apple Music's web player uses a long-press action on track rows to reveal context menus on touch devices.
- Rakuten's product image grids use a lazySrc action backed by IntersectionObserver to defer off-screen image loads.
- Chess.com uses actions to wire up third-party chessboard libraries (chessground) to Svelte components.

### Interview Questions

- 1. What's a Svelte action? — A function (node, params) => { update?, destroy? } that attaches imperative behavior to an element via use:.
- 2. When does update fire? — When the action's params change, without remounting the element; use it to refresh state.
- 3. When does destroy fire? — When the element is removed from the DOM; clean up listeners and observers here.
- 4. Why use actions over components? — For thin DOM-level concerns (focus, observers, third-party glue) that don't need template markup.
- 5. What's the SvelteAction type? — `import type { Action } from "svelte/action"`; generic over <Node, Param, Attributes>.

### Mini Project

Build a Reusable Tooltip & Long-Press Action Set: Two actions — `tooltip(text)` that shows a positioned tooltip on hover, and `longPress(duration, callback)` that fires on mouse/touch hold. Use them on a dashboard of icon buttons. Suggested approach:
  - Implement tooltip with mouseenter/mouseleave and update()
  - Implement longPress with pointerdown/pointerup timers
  - Both return destroy() to clean up listeners
  - Build a Dashboard.svelte with 5 icon buttons using both actions
  - Add CSS for the tooltip in a global stylesheet (since it's appended to body)

### Exercises

1. Build a clickOutside action and use it to close a dropdown.
2. Add an update() method to handle parameter changes in a tooltip action.
3. Build a lazySrc action using IntersectionObserver.
4. Build a focus action that autofocuses an element when a condition is true.
5. Combine use: with {...rest} to forward props alongside an action.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the signature of a Svelte action?
9. A) (props) => {}
10. B) (event) => void
11. C) (node, params) => { update?, destroy? } (*)
12. D) (component) => {}
13. Explanation: An action takes the DOM node and optional params, returns an object with optional update(params) and destroy() methods.
14. Q2: How do you attach an action to an element?
15. A) <div action={fn}>
16. B) <div on:fn>
17. C) <div bind:fn>
18. D) <div use:fn={params}> (*)
19. Explanation: Use the `use:` directive: `<div use:clickOutside={cb}>`. The action runs when the element mounts.
20. Q3: When does update() fire?
21. A) When params change, without remount (*)
22. B) On mount
23. C) On destroy
24. D) Every render
25. Explanation: If params passed to use:action change, Svelte calls update(newParams) instead of destroying and re-running the action.
26. Q4: When does destroy() fire?
27. A) On mount
28. B) When the element is removed from the DOM (*)
29. C) On every render
30. D) When params change
31. Explanation: destroy() runs when the element is unmounted — clean up listeners, observers, and DOM additions here.
32. Q5: Where do you import the Action type?
33. A) svelte
34. B) svelte/store
35. C) svelte/action (*)
36. D) svelte/elements
37. Explanation: `import type { Action } from "svelte/action";` Action is generic: Action<Node, Param, Attributes>.
38. Q6: Which is a common action pitfall?
39. A) Using actions on a div
40. B) Using actions in SvelteKit
41. C) Using too many actions
42. D) Forgetting to return destroy() — leaks listeners/observers (*)
43. Explanation: Without destroy(), listeners and observers remain attached after the element is gone, causing leaks and stale updates.
44. Q7: Should an action mutate the node's styles?
45. A) It can, but restore them in destroy() (*)
46. B) Never
47. C) Only on mount
48. D) Only in Svelte 4
49. Explanation: Actions may set styles/attributes, but destroy() should restore the original state to avoid leaking changes when the element unmounts.
50. Q8: Why use an action over a component?
51. A) Actions are faster always
52. B) For thin DOM-level concerns (focus, observers, third-party glue) that don't need template markup (*)
53. C) Components are deprecated
54. D) Actions support state
55. Explanation: Actions are imperative glue; if you need reactive markup or props, use a component. Use actions for one-off DOM behaviors.
56. Q9: Can actions take parameters?
57. A) No
58. B) Only strings
59. C) Yes — `use:action={params}` and update() handles changes (*)
60. D) Only in Svelte 4
61. Explanation: Actions take a second `params` argument; when params change, update(newParams) is called (if defined).
62. Q10: What happens if you don't define update()?
63. A) The action throws
64. B) Svelte re-mounts the element
65. C) Nothing
66. D) Param changes are ignored — the action keeps using the original params (*)
67. Explanation: Without update(), param changes are silently ignored; the action continues with the original params. Define update() to react to changes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the signature of a Svelte action?
  options:
    - (props) => {}
    - (event) => void
    - (node, params) => { update?, destroy? }
    - (component) => {}
  correctIndex: 2
  explanation: An action takes the DOM node and optional params, returns an object with optional update(params) and destroy() methods.
- id: q2
  question: How do you attach an action to an element?
  options:
    - <div action={fn}>
    - <div on:fn>
    - <div bind:fn>
    - <div use:fn={params}>
  correctIndex: 3
  explanation: "Use the `use:` directive: `<div use:clickOutside={cb}>`. The action runs when the element mounts."
- id: q3
  question: When does update() fire?
  options:
    - When params change, without remount
    - On mount
    - On destroy
    - Every render
  correctIndex: 0
  explanation: If params passed to use:action change, Svelte calls update(newParams) instead of destroying and re-running the action.
- id: q4
  question: When does destroy() fire?
  options:
    - On mount
    - When the element is removed from the DOM
    - On every render
    - When params change
  correctIndex: 1
  explanation: destroy() runs when the element is unmounted — clean up listeners, observers, and DOM additions here.
- id: q5
  question: Where do you import the Action type?
  options:
    - svelte
    - svelte/store
    - svelte/action
    - svelte/elements
  correctIndex: 2
  explanation: '`import type { Action } from "svelte/action";` Action is generic: Action<Node, Param, Attributes>.'
- id: q6
  question: Which is a common action pitfall?
  options:
    - Using actions on a div
    - Using actions in SvelteKit
    - Using too many actions
    - Forgetting to return destroy() — leaks listeners/observers
  correctIndex: 3
  explanation: Without destroy(), listeners and observers remain attached after the element is gone, causing leaks and stale updates.
- id: q7
  question: Should an action mutate the node's styles?
  options:
    - It can, but restore them in destroy()
    - Never
    - Only on mount
    - Only in Svelte 4
  correctIndex: 0
  explanation: Actions may set styles/attributes, but destroy() should restore the original state to avoid leaking changes when the element unmounts.
- id: q8
  question: Why use an action over a component?
  options:
    - Actions are faster always
    - For thin DOM-level concerns (focus, observers, third-party glue) that don't need template markup
    - Components are deprecated
    - Actions support state
  correctIndex: 1
  explanation: Actions are imperative glue; if you need reactive markup or props, use a component. Use actions for one-off DOM behaviors.
- id: q9
  question: Can actions take parameters?
  options:
    - No
    - Only strings
    - Yes — `use:action={params}` and update() handles changes
    - Only in Svelte 4
  correctIndex: 2
  explanation: Actions take a second `params` argument; when params change, update(newParams) is called (if defined).
- id: q10
  question: What happens if you don't define update()?
  options:
    - The action throws
    - Svelte re-mounts the element
    - Nothing
    - Param changes are ignored — the action keeps using the original params
  correctIndex: 3
  explanation: Without update(), param changes are silently ignored; the action continues with the original params. Define update() to react to changes.
```

