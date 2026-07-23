---
slug: html-web-components-custom-elements
id: html-11
track: html
order: 11
title: Web Components and Custom Elements
description: Build reusable HTML components with custom elements, shadow DOM, and slots. This stage introduces the four Web Components standards and shows how to encapsulate styling and behavior natively.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3900s
whyItMatters: Build reusable HTML components with custom elements, shadow DOM, and slots. This stage introduces the four Web Components standards and shows how to encapsulate styling and behavior natively.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Web Components and Custom Elements

## Web Components and Custom Elements

### Why It Matters

Build reusable HTML components with custom elements, shadow DOM, and slots. This stage introduces the four Web Components standards and shows how to encapsulate styling and behavior natively.

Build reusable HTML components with custom elements, shadow DOM, and slots. This stage introduces the four Web Components standards and shows how to encapsulate styling and behavior natively.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 6: Semantic HTML and Document Outline
- Stage 9: HTML5 APIs — Canvas, SVG, Drag-and-Drop
- Familiarity with JavaScript classes (the JS track's Stage 7 covers this)

### Topics

- The four Web Components standards: Custom Elements, Shadow DOM, HTML Templates, ES Modules
- Custom element naming: must contain a hyphen, e.g., `<my-tooltip>`
- `customElements.define(name, class)` and lifecycle callbacks (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`)
- Shadow DOM: `attachShadow({ mode: 'open' })` and style encapsulation
- The `<template>` element: parsed but not rendered until cloned
- Named slots: `<slot name="header">` and `<span slot="header">`
- Light DOM vs shadow DOM
- Declarative Shadow DOM (`<template shadowrootmode="open">`)

### Key Concepts

- Custom element names must contain a hyphen to avoid clashing with current/future HTML elements.
- Shadow DOM encapsulates styles so external CSS does not leak in and shadow CSS does not leak out.
- Slots are placeholders in shadow DOM that the consumer fills from light DOM; unnamed `<slot>` is the default slot.
- The `<template>` element's content is inert — scripts inside do not run, images do not load — until cloned into the DOM.
- Use `connectedCallback` for setup, `disconnectedCallback` for cleanup, and `attributeChangedCallback` to react to attribute changes.

```html
<script>
  class GreetingCard extends HTMLElement {
    connectedCallback() {
      const name = this.getAttribute('name') || 'World';
      this.innerHTML = `<p style="border:1px solid #ccc;padding:1rem">Hello, ${name}!</p>`;
    }
  }
  customElements.define('greeting-card', GreetingCard);
</script>
<greeting-card name="Ada"></greeting-card>
```
Caption: Simple custom element

### Common Pitfalls

- Custom element name without a hyphen — `customElements.define('mybutton', ...)` throws; names must contain a hyphen (e.g., `my-button`).
- Setting `innerHTML` before `connectedCallback` runs — element may not be in the DOM yet; do DOM work in `connectedCallback`.
- Styling shadow DOM from outside — external CSS selectors do not penetrate shadow DOM; use CSS custom properties (`--brand-color`) for theming.
- Forgetting `attributeChangedCallback` requires `static observedAttributes` — the callback never fires unless you declare which attributes to watch.
- Re-defining an already-defined custom element — throws a `NotSupportedError`; check `customElements.get(name)` before defining in libraries.

### Real-World Applications

- GitHub uses Web Components heavily via their `@github/*` packages (e.g., `<details-dialog>`, `<include-fragment>`) across github.com.
- Adobe Spectrum Web Components ships 100+ accessible custom elements used inside Creative Cloud apps.
- YouTube's `<yt-icon>` and other `yt-*` elements are custom elements built with shadow DOM for icon encapsulation.
- Ionic Framework ships accessible Web Components that compile to React, Vue, and Angular wrappers from a single source.

### Interview Questions

- 1. Why must a custom element name contain a hyphen? — To namespace user-defined elements and avoid collisions with current or future HTML elements, all of which are single words.
- 2. What is shadow DOM? — An encapsulated DOM subtree attached to an element, with its own styles and IDs that do not leak in or out.
- 3. What are slots for? — Placeholders in shadow DOM that the consumer fills with their own content from light DOM; this enables composable APIs.
- 4. What is the difference between `connectedCallback` and `constructor`? — Constructor runs at instantiation (before insertion); `connectedCallback` runs when the element is added to the DOM, which is where DOM-dependent setup belongs.
- 5. How do you observe attribute changes? — Declare `static observedAttributes = ['name']` and implement `attributeChangedCallback(name, oldVal, newVal)`.

### Mini Project

Build a Custom Tooltip Component: A `<my-tooltip>` custom element that shows a tooltip on hover/focus, using shadow DOM for style encapsulation and a `<slot>` for the trigger. Suggested approach:
  - Create a class extending `HTMLElement` with `attachShadow({ mode: 'open' })`
  - Inside the shadow root, add a `<slot>` for the trigger and a `<div role="tooltip">` for the tip text
  - Use the `tip` attribute to set the tooltip text and observe it via `observedAttributes`
  - Add `mouseenter`/`mouseleave` and `focus`/`blur` listeners to show/hide
  - Ensure the tooltip is keyboard-accessible by showing it on focus of the slotted trigger

### Exercises

1. Build a `<count-down>` element that displays a timer to a target date passed as an attribute.
2. Convert an existing `<div class="card">` pattern to a `<my-card>` custom element with shadow DOM.
3. Add CSS custom properties (`--card-bg`, `--card-border`) to your component and override them from outside.
4. Use a `<template>` element as the source of your component's shadow content (clone it in the constructor).
5. Implement `attributeChangedCallback` to react to a `disabled` attribute on your component.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why must a custom element name contain a hyphen?
9. A) It's a stylistic preference
10. B) To avoid collisions with current and future HTML elements (*)
11. C) Required for accessibility
12. D) Required for shadow DOM
13. Explanation: HTML element names are single words without hyphens; requiring a hyphen in custom names namespaces user elements and prevents collisions.
14. Q2: Which method registers a custom element?
15. A) customElements.define() (*)
16. B) document.registerElement()
17. C) HTMLElement.register()
18. D) window.defineElement()
19. Explanation: `customElements.define('my-tag', MyClass)` is the modern API; `document.registerElement` was the deprecated v0 API.
20. Q3: Which lifecycle callback runs when the element is added to the DOM?
21. A) constructor
22. B) disconnectedCallback
23. C) createdCallback
24. D) connectedCallback (*)
25. Explanation: `connectedCallback` fires when the element is inserted into the DOM; do DOM-dependent setup here.
26. Q4: What does shadow DOM encapsulate?
27. A) DOM structure and CSS styles (*)
28. B) JavaScript scope
29. C) Network requests
30. D) Event listeners
31. Explanation: Shadow DOM creates a scoped DOM subtree with isolated styles; external CSS does not leak in and shadow CSS does not leak out.
32. Q5: How are slots filled by the component consumer?
33. A) Via JavaScript only
34. B) Via the `template` attribute
35. C) Slots are auto-filled
36. D) By placing elements with a matching `slot` attribute in light DOM (*)
37. Explanation: Light DOM children with `<span slot="title">` fill the corresponding `<slot name="title">` in shadow DOM.
38. Q6: Which method is required to attach a shadow root?
39. A) this.createShadowRoot()
40. B) this.shadow()
41. C) this.attachShadow({ mode: 'open' }) (*)
42. D) document.createShadow(this)
43. Explanation: `attachShadow({ mode: 'open' or 'closed' })` creates and returns the shadow root; `createShadowRoot` was the deprecated v0 API.
44. Q7: What is the `<template>` element for?
45. A) Declaring CSS variables
46. B) Holding inert HTML parsed but not rendered until cloned (*)
47. C) Defining JavaScript classes
48. D) Importing modules
49. Explanation: `<template>` content is parsed but inert (scripts don't run, images don't load) until cloned via `content.cloneNode(true)` into the DOM.
50. Q8: What is required for `attributeChangedCallback` to fire?
51. A) Nothing — it always fires
52. B) Setting `mode: 'open'` on the shadow root
53. C) Declaring `static observedAttributes` listing the attribute names (*)
54. D) Calling `this.observe()`
55. Explanation: You must declare `static observedAttributes = ['name']` listing which attributes to watch; otherwise the callback never fires.
56. Q9: How can external CSS style a property inside shadow DOM?
57. A) By using the element's tag name as a selector
58. B) It cannot be done at all
59. C) By using `!important`
60. D) By using CSS custom properties (`--var`) (*)
61. Explanation: Shadow DOM blocks external selectors, but CSS custom properties inherit through the shadow boundary; `:host { color: var(--brand) }` lets consumers theme.
62. Q10: What does declarative shadow DOM (`<template shadowrootmode="open">`) enable?
63. A) Faster CSS animations
64. B) Smaller JavaScript bundles
65. C) Server-side rendering of shadow DOM without JavaScript (*)
66. D) Better SEO for images
67. Explanation: Declarative Shadow DOM lets the parser attach shadow roots at parse time, so the component renders correctly before JS loads — critical for SSR.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why must a custom element name contain a hyphen?
  options:
    - It's a stylistic preference
    - To avoid collisions with current and future HTML elements
    - Required for accessibility
    - Required for shadow DOM
  correctIndex: 1
  explanation: HTML element names are single words without hyphens; requiring a hyphen in custom names namespaces user elements and prevents collisions.
- id: q2
  question: Which method registers a custom element?
  options:
    - customElements.define()
    - document.registerElement()
    - HTMLElement.register()
    - window.defineElement()
  correctIndex: 0
  explanation: "`customElements.define('my-tag', MyClass)` is the modern API; `document.registerElement` was the deprecated v0 API."
- id: q3
  question: Which lifecycle callback runs when the element is added to the DOM?
  options:
    - constructor
    - disconnectedCallback
    - createdCallback
    - connectedCallback
  correctIndex: 3
  explanation: "`connectedCallback` fires when the element is inserted into the DOM; do DOM-dependent setup here."
- id: q4
  question: What does shadow DOM encapsulate?
  options:
    - DOM structure and CSS styles
    - JavaScript scope
    - Network requests
    - Event listeners
  correctIndex: 0
  explanation: Shadow DOM creates a scoped DOM subtree with isolated styles; external CSS does not leak in and shadow CSS does not leak out.
- id: q5
  question: How are slots filled by the component consumer?
  options:
    - Via JavaScript only
    - Via the `template` attribute
    - Slots are auto-filled
    - By placing elements with a matching `slot` attribute in light DOM
  correctIndex: 3
  explanation: Light DOM children with `<span slot="title">` fill the corresponding `<slot name="title">` in shadow DOM.
- id: q6
  question: Which method is required to attach a shadow root?
  options:
    - this.createShadowRoot()
    - this.shadow()
    - "this.attachShadow({ mode: 'open' })"
    - document.createShadow(this)
  correctIndex: 2
  explanation: "`attachShadow({ mode: 'open' or 'closed' })` creates and returns the shadow root; `createShadowRoot` was the deprecated v0 API."
- id: q7
  question: What is the `<template>` element for?
  options:
    - Declaring CSS variables
    - Holding inert HTML parsed but not rendered until cloned
    - Defining JavaScript classes
    - Importing modules
  correctIndex: 1
  explanation: "`<template>` content is parsed but inert (scripts don't run, images don't load) until cloned via `content.cloneNode(true)` into the DOM."
- id: q8
  question: What is required for `attributeChangedCallback` to fire?
  options:
    - Nothing — it always fires
    - "Setting `mode: 'open'` on the shadow root"
    - Declaring `static observedAttributes` listing the attribute names
    - Calling `this.observe()`
  correctIndex: 2
  explanation: You must declare `static observedAttributes = ['name']` listing which attributes to watch; otherwise the callback never fires.
- id: q9
  question: How can external CSS style a property inside shadow DOM?
  options:
    - By using the element's tag name as a selector
    - It cannot be done at all
    - By using `!important`
    - By using CSS custom properties (`--var`)
  correctIndex: 3
  explanation: "Shadow DOM blocks external selectors, but CSS custom properties inherit through the shadow boundary; `:host { color: var(--brand) }` lets consumers theme."
- id: q10
  question: What does declarative shadow DOM (`<template shadowrootmode="open">`) enable?
  options:
    - Faster CSS animations
    - Smaller JavaScript bundles
    - Server-side rendering of shadow DOM without JavaScript
    - Better SEO for images
  correctIndex: 2
  explanation: Declarative Shadow DOM lets the parser attach shadow roots at parse time, so the component renders correctly before JS loads — critical for SSR.
```

