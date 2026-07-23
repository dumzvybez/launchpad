---
slug: typescript-working-dom-browser
id: typescript-15
track: typescript
order: 15
title: Working with the DOM and the Browser
description: Manipulate the DOM with typed `querySelector`, handle events with typed targets, and use the `lib.dom.d.ts` types safely.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=9200s
whyItMatters: Manipulate the DOM with typed `querySelector`, handle events with typed targets, and use the `lib. dom.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Working with the DOM and the Browser

## Working with the DOM and the Browser

### Why It Matters

Manipulate the DOM with typed `querySelector`, handle events with typed targets, and use the `lib. dom.

Manipulate the DOM with typed `querySelector`, handle events with typed targets, and use the `lib.dom.d.ts` types safely.

### Prerequisites

- Stage 10: Type Narrowing and Type Guards.
- Stage 14: Async/Await and Promises in TypeScript.

### Topics

- `lib.dom.d.ts` and DOM type definitions
- `document.querySelector<E>(selector)` with generic narrowing
- Event types: `MouseEvent`, `KeyboardEvent`, `CustomEvent<T>`
- `EventTarget` and `addEventListener` overloads
- `HTMLInputElement`, `HTMLCanvasElement`, etc. — the element hierarchy
- Strict-null checks on DOM lookups
- Custom events with `CustomEvent<T>` detail payloads
- Web Workers and `postMessage` typing

### Key Concepts

- `querySelector` returns `Element | null`; cast to the specific element type after a null check.
- Event listeners receive a generic `Event`; narrow with `instanceof MouseEvent` or by using the typed-listener overload.
- `lib.dom.d.ts` ships with TS — it's the source of all browser types (no install needed).
- `input.value` is always `string`; convert explicitly with `Number(...)` or `parseInt`.
- Custom events carry typed payloads via `CustomEvent<Detail>`.

```typescript
const btn = document.querySelector<HTMLButtonElement>("#submit");
if (!btn) throw new Error("Submit button not found");
btn.addEventListener("click", () => console.log("clicked"));
```
Caption: querySelector with null check

### Common Pitfalls

- Casting `document.querySelector("#x") as HTMLButtonElement` without a null check — runtime can return null; check first or use the generic argument.
- Using `e.target` instead of `e.currentTarget` — `target` is the innermost element clicked (could be a child), `currentTarget` is the element the listener is attached to.
- Forgetting that `input.value` is `string` — `+input.value` or `Number(input.value)` to get a number, and handle `NaN`.
- Including `lib.dom.d.ts` in a Node project — set `"lib": ["ES2022"]` (without `"DOM"`) in tsconfig for backend-only code to avoid DOM globals leaking in.
- Treating `getAttribute("disabled")` as a boolean — it returns `string | null`; disabled-ness is presence-based (`el.hasAttribute("disabled")`).

### Real-World Applications

- VS Code's webview panels use the DOM API with strict typed-event listeners to communicate with the extension host via `postMessage`.
- Figma's plugin sandbox uses typed `MessageEvent`s to bridge the plugin and the Figma document with full type safety.
- The Linear web app uses `CustomEvent<{ ... }>` payloads for its in-app command palette.
- Excalidraw's canvas collaboration uses `HTMLCanvasElement` + `OffscreenCanvas` with typed `postMessage` for the worker-based rendering pipeline.

### Interview Questions

- 1. What does `document.querySelector` return? — `Element | null` (the generic version returns `T | null` where T is the specified element type).
- 2. What's the difference between `e.target` and `e.currentTarget`? — `target` is the element that triggered the event (could be a child); `currentTarget` is the element the listener is attached to.
- 3. What is the type of `input.value`? — Always `string`; convert explicitly with `Number(...)` and handle `NaN`.
- 4. How do you type a custom event's payload? — Use `CustomEvent<Detail>` and `addEventListener` with a typed listener (or cast `e` to your custom event type).
- 5. How do you exclude DOM types from a Node project? — Set `"lib": ["ES2022"]` (omit `"DOM"`) in tsconfig compilerOptions.

### Mini Project

Build a typed Todo List with Vanilla DOM: An HTML page with a form, list, and counter; all DOM access typed, with `CustomEvent<{ id: string }>` for "todo:added" events. Suggested approach:
  - Create `index.html` with `<form id="todo-form">`, `<input id="todo-input">`, `<ul id="todo-list">`, `<span id="count">`
  - Write `app.ts` that uses `document.querySelector<HTMLInputElement>(...)` for each element with null checks
  - Add a form submit listener that creates `<li>` elements and dispatches `CustomEvent("todo:added", { detail: { id } })`
  - Maintain an in-memory `Todo[]` array and re-render on every change
  - Compile with `tsc` and load `app.js` from `index.html`

### Exercises

1. Use `document.querySelector<HTMLButtonElement>("#x")` and check for null before adding a listener.
2. Add a click listener that logs `e.currentTarget` (typed) vs `e.target` (loose).
3. Create a `CustomEvent<{ count: number }>` and dispatch it; listen with a typed handler.
4. Read a numeric input value and convert it safely to a number, handling `NaN`.
5. Configure tsconfig for a Node-only project (no DOM lib) and confirm `document` is undefined.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `document.querySelector("#x")` return by default?
9. A) `Element`
10. B) `HTMLElement`
11. C) `Element | null` (*)
12. D) `any`
13. Explanation: `querySelector` returns `Element | null` because the element may not exist; the generic overload `querySelector<T>("#x")` returns `T | null`.
14. Q2: Which is the listener's attached element?
15. A) `e.target`
16. B) `e.srcElement`
17. C) `e.element`
18. D) `e.currentTarget` (*)
19. Explanation: `currentTarget` is always the element the listener was attached to; `target` is the innermost element that triggered the event (could be a descendant).
20. Q3: What is the type of `(input as HTMLInputElement).value`?
21. A) `string` (*)
22. B) `number`
23. C) `string | null`
24. D) `any`
25. Explanation: DOM input values are always strings; convert explicitly with `Number(...)` or `parseInt(...)` and handle `NaN`.
26. Q4: How do you type a custom event with a `{ sku: string }` payload?
27. A) `new Event("x", { sku: "" })`
28. B) `new CustomEvent("x", { detail: { sku: "" } })` and listen with a `CustomEvent<{ sku: string }>` cast (*)
29. C) `new CustomEvent<{ sku: string }>("x")`
30. D) `dispatchEvent({ sku: "" })`
31. Explanation: `CustomEvent<Detail>` carries a `detail: Detail` field; dispatch with `new CustomEvent("x", { detail: ... })` and narrow at the listener.
32. Q5: How do you exclude DOM types from a Node-only TS project?
33. A) `"types": []`
34. B) `"skipLibCheck": true`
35. C) `"lib": ["ES2022"]` (omit "DOM") (*)
36. D) `"noLib": true`
37. Explanation: Setting `lib` to omit `"DOM"` prevents DOM globals (`document`, `window`) from leaking into a backend project.
38. Q6: Which generic narrows `querySelector` to an input element?
39. A) `querySelector("#email", HTMLInputElement)`
40. B) `querySelector<Input>("#email")`
41. C) `querySelector("#email") as Input`
42. D) `querySelector<HTMLInputElement>("#email")` (*)
43. Explanation: The generic argument specifies the element type, so the return is `HTMLInputElement | null`.
44. Q7: Why is `getAttribute("disabled")` not a boolean?
45. A) It returns `string | null` — presence-based, not value-based (*)
46. B) It is a boolean
47. C) It returns `true | false`
48. D) It returns `undefined`
49. Explanation: HTML attributes are string-valued; presence-based "boolean" attributes are checked with `el.hasAttribute("disabled")`, not the attribute value.
50. Q8: Which method gets a 2D canvas drawing context?
51. A) `canvas.get2DContext()`
52. B) `canvas.getContext("2d")` (*)
53. C) `canvas.context("2d")`
54. D) `canvas.ctx2d`
55. Explanation: `HTMLCanvasElement.getContext("2d")` returns `CanvasRenderingContext2D | null`; check for null before drawing.
56. Q9: Where do browser types like `MouseEvent` come from?
57. A) npm `@types/dom`
58. B) MDN
59. C) `lib.dom.d.ts`, shipped with TS (*)
60. D) The browser exports them
61. Explanation: `lib.dom.d.ts` is part of the TS standard library and provides all DOM types; no install needed (just include `"DOM"` in `lib`).
62. Q10: Which is the safer cast after a null check?
63. A) `const el = document.querySelector("#x") as HTMLButtonElement;`
64. B) `const el: HTMLButtonElement = document.querySelector("#x");`
65. C) `const el = document.querySelector("#x")!;`
66. D) `const el = document.querySelector<HTMLButtonElement>("#x"); if (!el) throw ...;` (*)
67. Explanation: The generic argument narrows the return type, and the explicit null check turns the `| null` into a compile-time-guaranteed `HTMLButtonElement` — no `as` lie needed.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `document.querySelector("#x")` return by default?
  options:
    - "`Element`"
    - "`HTMLElement`"
    - "`Element | null`"
    - "`any`"
  correctIndex: 2
  explanation: '`querySelector` returns `Element | null` because the element may not exist; the generic overload `querySelector<T>("#x")` returns `T | null`.'
- id: q2
  question: Which is the listener's attached element?
  options:
    - "`e.target`"
    - "`e.srcElement`"
    - "`e.element`"
    - "`e.currentTarget`"
  correctIndex: 3
  explanation: "`currentTarget` is always the element the listener was attached to; `target` is the innermost element that triggered the event (could be a descendant)."
- id: q3
  question: What is the type of `(input as HTMLInputElement).value`?
  options:
    - "`string`"
    - "`number`"
    - "`string | null`"
    - "`any`"
  correctIndex: 0
  explanation: DOM input values are always strings; convert explicitly with `Number(...)` or `parseInt(...)` and handle `NaN`.
- id: q4
  question: "How do you type a custom event with a `{ sku: string }` payload?"
  options:
    - '`new Event("x", { sku: "" })`'
    - '`new CustomEvent("x", { detail: { sku: "" } })` and listen with a `CustomEvent<{ sku: string }>` cast'
    - '`new CustomEvent<{ sku: string }>("x")`'
    - '`dispatchEvent({ sku: "" })`'
  correctIndex: 1
  explanation: '`CustomEvent<Detail>` carries a `detail: Detail` field; dispatch with `new CustomEvent("x", { detail: ... })` and narrow at the listener.'
- id: q5
  question: How do you exclude DOM types from a Node-only TS project?
  options:
    - '`"types": []`'
    - '`"skipLibCheck": true`'
    - '`"lib": ["ES2022"]` (omit "DOM")'
    - '`"noLib": true`'
  correctIndex: 2
  explanation: Setting `lib` to omit `"DOM"` prevents DOM globals (`document`, `window`) from leaking into a backend project.
- id: q6
  question: Which generic narrows `querySelector` to an input element?
  options:
    - '`querySelector("#email", HTMLInputElement)`'
    - '`querySelector<Input>("#email")`'
    - '`querySelector("#email") as Input`'
    - '`querySelector<HTMLInputElement>("#email")`'
  correctIndex: 3
  explanation: The generic argument specifies the element type, so the return is `HTMLInputElement | null`.
- id: q7
  question: Why is `getAttribute("disabled")` not a boolean?
  options:
    - It returns `string | null` — presence-based, not value-based
    - It is a boolean
    - It returns `true | false`
    - It returns `undefined`
  correctIndex: 0
  explanation: HTML attributes are string-valued; presence-based "boolean" attributes are checked with `el.hasAttribute("disabled")`, not the attribute value.
- id: q8
  question: Which method gets a 2D canvas drawing context?
  options:
    - "`canvas.get2DContext()`"
    - '`canvas.getContext("2d")`'
    - '`canvas.context("2d")`'
    - "`canvas.ctx2d`"
  correctIndex: 1
  explanation: '`HTMLCanvasElement.getContext("2d")` returns `CanvasRenderingContext2D | null`; check for null before drawing.'
- id: q9
  question: Where do browser types like `MouseEvent` come from?
  options:
    - npm `@types/dom`
    - MDN
    - "`lib.dom.d.ts`, shipped with TS"
    - The browser exports them
  correctIndex: 2
  explanation: '`lib.dom.d.ts` is part of the TS standard library and provides all DOM types; no install needed (just include `"DOM"` in `lib`).'
- id: q10
  question: Which is the safer cast after a null check?
  options:
    - '`const el = document.querySelector("#x") as HTMLButtonElement;`'
    - '`const el: HTMLButtonElement = document.querySelector("#x");`'
    - '`const el = document.querySelector("#x")!;`'
    - '`const el = document.querySelector<HTMLButtonElement>("#x"); if (!el) throw ...;`'
  correctIndex: 3
  explanation: The generic argument narrows the return type, and the explicit null check turns the `| null` into a compile-time-guaranteed `HTMLButtonElement` — no `as` lie needed.
```

