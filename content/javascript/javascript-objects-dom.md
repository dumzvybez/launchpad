---
slug: javascript-objects-dom
id: javascript-05
track: javascript
order: 5
title: Objects and the DOM
description: Model data with objects, then read and mutate the page by selecting elements, creating nodes, and updating attributes and classes.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=3000s
whyItMatters: Model data with objects, then read and mutate the page by selecting elements, creating nodes, and updating attributes and classes.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Objects and the DOM

## Objects and the DOM

### Why It Matters

Model data with objects, then read and mutate the page by selecting elements, creating nodes, and updating attributes and classes.

Model data with objects, then read and mutate the page by selecting elements, creating nodes, and updating attributes and classes.

### Prerequisites

- Stage 4: Control Flow and Functions
- Basic familiarity with HTML structure.

### Topics

- Object literals, property shorthand, computed keys
- Object destructuring and nested destructuring
- Object methods: keys, values, entries, assign, freeze
- Spread for objects and shallow merge
- Selecting elements: querySelector, querySelectorAll, getElementById
- Creating and inserting nodes: createElement, append, prepend, insertAdjacentHTML
- Modifying attributes, classes (classList), dataset, style
- Traversing: parentElement, children, nextElementSibling

### Key Concepts

- The DOM is a live tree — JavaScript holds references to nodes, and changes are reflected immediately
- `querySelectorAll` returns a static NodeList; `getElementsByClassName` returns a live HTMLCollection
- Property shorthand `{ x, y }` is sugar for `{ x: x, y: y }`
- `Object.assign(target, ...sources)` mutates `target` — pass `{}` as the target for a shallow copy
- `data-*` attributes are accessible via `element.dataset.camelCase`
- Re-rendering via `innerHTML +=` re-parses everything and breaks event listeners — prefer `appendChild`

```javascript
const name = "Ada", age = 36;
const user = { name, age, greet() { return `Hi ${this.name}`; } };

const { name: who, age: years = 0 } = user;
console.log(who, years); // "Ada" 36

const users = [{ name: "Ada" }, { name: "Linus" }];
for (const { name } of users) console.log(name); // "Ada" "Linus"
```
Caption: Object shorthand and destructuring

### Common Pitfalls

- Using `innerHTML` with user input — opens XSS holes; use `textContent` for plain text or DOMPurify for HTML.
- Looping with `innerHTML +=` — re-parses the whole subtree each time, destroying event listeners; build a fragment and append once.
- Treating `NodeList` like an array — older NodeLists lacked `forEach`; spread to an array or use `Array.from` for full API.
- Forgetting `Object.freeze` is shallow — nested objects can still be mutated; use a deep-freeze helper for true immutability.
- Storing state in the DOM — read state from a JS model and render from it; using the DOM as the source of truth leads to desync bugs.

### Real-World Applications

- React, Vue, and Angular all ultimately call DOM APIs (or `appendChild` equivalents) under the hood; React's `react-dom` package is essentially a managed wrapper over these primitives, deployed at Meta, Netflix, and Airbnb.
- Google Docs' editor manipulates contenteditable regions via direct DOM APIs for character-level editing performance.
- The WordPress block editor (Gutenberg) renders blocks by creating and updating DOM nodes via React, which in turn calls these primitives.
- Trello's drag-and-drop reorders cards by detaching and re-inserting DOM nodes, then persists the new order to its API.

### Interview Questions

- 1. Difference between `innerHTML` and `textContent`? — innerHTML parses HTML (XSS risk); textContent sets plain text safely. Use innerHTML only with sanitized input.
- 2. What does `Object.freeze` do? — Prevents adding/removing/modifying own properties at the top level; it's shallow — nested objects are still mutable.
- 3. How do you efficiently add many nodes at once? — Build a DocumentFragment and append it once, avoiding N reflows.
- 4. `querySelectorAll` vs `getElementsByClassName`? — The former returns a static NodeList; the latter returns a live HTMLCollection that updates as the DOM changes.
- 5. How are `data-*` attributes accessed in JS? — Via `element.dataset.camelCase` (e.g., `data-user-id` → `dataset.userId`).

### Mini Project

Build a "Dynamic Todo List" page where users add, complete, and delete todos. State lives in a plain array of objects; the UI re-renders from that array each change. Suggested approach:
  - Keep a `let todos = []` array as the single source of truth
  - Write a `render()` function that rebuilds the list with a DocumentFragment
  - Use textContent (never innerHTML) to set todo text — XSS-safe
  - Add a checkbox toggle and a delete button per item using event delegation
  - Persist to localStorage (Stage 11 previews this) so todos survive refresh

### Exercises

1. Write `pick(obj, keys)` that returns a new object with only the listed keys.
2. Build `deepFreeze(obj)` that recursively freezes an object and all nested objects.
3. Create a function that creates 1000 `<li>` items both via `innerHTML +=` and via a DocumentFragment; measure the time difference.
4. Implement a `tableFromData(rows)` function that builds a `<table>` from an array of objects.
5. Add a "dark mode" toggle that toggles a class on `<body>` and persists to localStorage.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which property sets plain text safely (no XSS)?
9. A) innerHTML
10. B) outerHTML
11. C) textContent (*)
12. D) innerText — wait, both are safe, but textContent is preferred
13. Explanation: textContent never parses HTML, so user input can't inject script. innerText is also safe but slower (layout-aware).
14. Q2: `Object.freeze` is:
15. A) Deep
16. B) Shallow (*)
17. C) Recursive
18. D) Asynchronous
19. Explanation: Only top-level properties are frozen; nested objects remain mutable.
20. Q3: Which returns a LIVE collection?
21. A) querySelectorAll
22. B) getElementsByClassName (*)
23. C) document.querySelectorAll("div")
24. D) Array.from(document.links)
25. Explanation: getElementsByClassName and getElementsByTagName return live HTMLCollections that update as the DOM changes.
26. Q4: How do you read `data-user-id` from an element?
27. A) el.dataUserId
28. B) el.dataset.userId (*)
29. C) el.getAttribute("data-userId")
30. D) el.user_id
31. Explanation: data-* attributes map to dataset with camelCase conversion: data-user-id → dataset.userId.
32. Q5: Efficient way to append 1000 nodes?
33. A) innerHTML += 1000 times
34. B) appendChild in a loop
35. C) Build a DocumentFragment, append once (*)
36. D) document.write
37. Explanation: A DocumentFragment batches the reflow into a single update, dramatically improving performance.
38. Q6: `{ ...a, ...b }` does what?
39. A) Deep-merges b into a
40. B) Shallow-merges, b wins on conflict (*)
41. C) Freezes both objects
42. D) Throws if keys overlap
43. Explanation: Object spread shallow-merges; later sources overwrite earlier ones for the same key.
44. Q7: Which is the safer alternative to `el.innerHTML = userInput`?
45. A) el.outerHTML = userInput
46. B) el.textContent = userInput (*)
47. C) el.write(userInput)
48. D) document.write(userInput)
49. Explanation: textContent sets text only — no HTML parsing — eliminating XSS risk for plain strings.
50. Q8: `Object.entries({a:1, b:2})` returns:
51. A) ["a","b"]
52. B) [1,2]
53. C) [["a",1],["b",2]] (*)
54. D) {a:1, b:2}
55. Explanation: entries returns an array of [key, value] pairs, useful for iteration and destructuring.
56. Q9: Property shorthand `{ x, y }` is sugar for:
57. A) { x: x, y: y } (*)
58. B) { "x": 0, "y": 0 }
59. C) Object.freeze({x, y})
60. D) () => ({x, y})
61. Explanation: When the variable name matches the key, you can drop the value — shorthand from ES6.
62. Q10: `replaceChildren(frag)`:
63. A) Removes the element itself
64. B) Replaces all children with the new nodes (*)
65. C) Clones the fragment
66. D) Throws on fragment input
67. Explanation: replaceChildren accepts nodes or fragments and replaces the element's entire child list in one operation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which property sets plain text safely (no XSS)?
  options:
    - "?"
    - innerHTML
    - outerHTML
    - textContent
    - innerText — wait, both are safe, but textContent is preferred
  correctIndex: 3
  explanation: textContent never parses HTML, so user input can't inject script. innerText is also safe but slower (layout-aware).
- id: q2
  question: "`Object.freeze` is:"
  options:
    - Deep
    - Shallow
    - Recursive
    - Asynchronous
  correctIndex: 1
  explanation: Only top-level properties are frozen; nested objects remain mutable.
- id: q3
  question: Which returns a LIVE collection?
  options:
    - querySelectorAll
    - getElementsByClassName
    - document.querySelectorAll("div")
    - Array.from(document.links)
  correctIndex: 1
  explanation: getElementsByClassName and getElementsByTagName return live HTMLCollections that update as the DOM changes.
- id: q4
  question: How do you read `data-user-id` from an element?
  options:
    - el.dataUserId
    - el.dataset.userId
    - el.getAttribute("data-userId")
    - el.user_id
  correctIndex: 1
  explanation: "data-* attributes map to dataset with camelCase conversion: data-user-id → dataset.userId."
- id: q5
  question: Efficient way to append 1000 nodes?
  options:
    - innerHTML += 1000 times
    - appendChild in a loop
    - Build a DocumentFragment, append once
    - document.write
  correctIndex: 2
  explanation: A DocumentFragment batches the reflow into a single update, dramatically improving performance.
- id: q6
  question: "`{ ...a, ...b }` does what?"
  options:
    - Deep-merges b into a
    - Shallow-merges, b wins on conflict
    - Freezes both objects
    - Throws if keys overlap
  correctIndex: 1
  explanation: Object spread shallow-merges; later sources overwrite earlier ones for the same key.
- id: q7
  question: Which is the safer alternative to `el.innerHTML = userInput`?
  options:
    - el.outerHTML = userInput
    - el.textContent = userInput
    - el.write(userInput)
    - document.write(userInput)
  correctIndex: 1
  explanation: textContent sets text only — no HTML parsing — eliminating XSS risk for plain strings.
- id: q8
  question: "`Object.entries({a:1, b:2})` returns:"
  options:
    - '["a","b"]'
    - "[1,2]"
    - '[["a",1],["b",2]]'
    - "{a:1, b:2}"
  correctIndex: 2
  explanation: entries returns an array of [key, value] pairs, useful for iteration and destructuring.
- id: q9
  question: "Property shorthand `{ x, y }` is sugar for:"
  options:
    - "{ x: x, y: y }"
    - '{ "x": 0, "y": 0 }'
    - Object.freeze({x, y})
    - () => ({x, y})
  correctIndex: 0
  explanation: When the variable name matches the key, you can drop the value — shorthand from ES6.
- id: q10
  question: "`replaceChildren(frag)`:"
  options:
    - Removes the element itself
    - Replaces all children with the new nodes
    - Clones the fragment
    - Throws on fragment input
  correctIndex: 1
  explanation: replaceChildren accepts nodes or fragments and replaces the element's entire child list in one operation.
```

