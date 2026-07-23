---
slug: javascript-getting-started-javascript
id: javascript-01
track: javascript
order: 1
title: Getting Started with JavaScript
description: Install Node.js and a code editor, run your first script, and understand how JavaScript executes in browsers versus Node.js.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg
whyItMatters: Install Node. js and a code editor, run your first script, and understand how JavaScript executes in browsers versus Node.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Getting Started with JavaScript

## Getting Started with JavaScript

### Why It Matters

Install Node. js and a code editor, run your first script, and understand how JavaScript executes in browsers versus Node.

Install Node.js and a code editor, run your first script, and understand how JavaScript executes in browsers versus Node.js.

### Prerequisites

- None — this is the entry point for the JavaScript track.
- Basic computer literacy (terminal, file system, browser dev tools).

### Topics

- Installing Node.js and npm on Windows/macOS/Linux
- Running JS in the browser console and in Node.js
- The `<script>` tag (inline, external, defer, async)
- console.log, console.error, console.table
- Strict mode ("use strict")
- Choosing an editor (VS Code, WebStorm)
- The browser developer tools (Elements, Console, Sources, Network)
- How engines work: V8 (Chrome/Node), SpiderMonkey (Firefox), JavaScriptCore (Safari)

### Key Concepts

- JavaScript is single-threaded with an event loop (no parallelism by default)
- ECMAScript is the specification; JavaScript is the implementation
- ES2020+ is the modern baseline supported by all current browsers
- The DOM is the in-memory tree of HTML nodes a script manipulates
- Source code is parsed, then JIT-compiled by the engine at runtime
- "use strict" enables safer parsing rules (no implicit globals, etc.)

```javascript
"use strict";
// Save as hello.js and run with: node hello.js
console.log("Hello, World!");
console.warn("This is a warning");
console.error("This is an error");
```
Caption: Hello World in Node

### Common Pitfalls

- Confusing Java with JavaScript — they are unrelated languages; JavaScript was renamed for marketing in 1995; remember "Java is to JavaScript what Car is to Carpet".
- Loading scripts in `<head>` without defer — blocks HTML parsing and slows first paint; use `defer` (or `async` for independent scripts) on external scripts.
- Forgetting "use strict" in older codebases — silent bugs like implicit globals and `this` defaulting to window slip through; always opt in.
- Using `var` (legacy hoisting semantics) — use `let`/`const` (covered in Stage 2) to get block-scoped, predictable behavior.
- Editing then forgetting to refresh the browser — use DevTools' "Disable cache" while DevTools is open to avoid serving stale JS.

### Real-World Applications

- Netflix uses JavaScript heavily in its TV UI (React-based) and in its browser player; the player itself coordinates buffering, ABR, and DRM in JS.
- VS Code is built almost entirely in JavaScript/TypeScript on top of Electron; the editor core runs the same Monaco engine that powers the Azure DevOps editor.
- Airbnb's frontend is a large React/JavaScript codebase that renders property listings, search, and booking flows for millions of users daily.
- Slack's desktop client is an Electron app that reuses the JavaScript code from its web client across Windows, macOS, and Linux.

### Interview Questions

- 1. What's the difference between Java and JavaScript? — Different languages, different runtime models; Java is compiled to JVM bytecode, JavaScript is JIT-compiled by V8/SpiderMonkey; the name was marketing-driven.
- 2. What does "use strict" do? — Enables strict parsing: removes silent errors (implicit globals, duplicate params), throws on this=undefined in functions, future-proofs code.
- 3. What is the difference between defer and async on a script tag? — Both download in parallel; defer waits until HTML parsing completes and runs in document order; async runs ASAP in any order.
- 4. Name the major JS engines and who maintains them. — V8 (Google, Chrome/Node), SpiderMonkey (Mozilla, Firefox), JavaScriptCore (Apple, Safari), Chakra (legacy Microsoft Edge).
- 5. Why is JavaScript called single-threaded? — It has one call stack per realm; long tasks block the UI; concurrency is achieved via the event loop, Web Workers, and async APIs.

### Mini Project

Build a "Page Info Bookmarklet" that, when clicked from the browser bookmarks bar, logs the page title, URL, and number of `<p>` elements to the console. It takes no inputs and outputs structured info via console.table. Suggested approach:
  - Wrap the code in an IIFE so it doesn't pollute the global scope
  - Use document.title, location.href, and document.querySelectorAll('p').length
  - Print a single object with all three values
  - Minify by hand or with a tool, then prefix with `javascript:` for the bookmark URL
  - Test on three different websites (Wikipedia, GitHub, a news site)

### Exercises

1. Install Node.js LTS and run `node --version` and `npm --version` — confirm both print recent versions.
2. Open the browser console on your favorite site and run `console.table(document.links.length)` — note the result.
3. Create `hello.js` that prints your name and the current Node version using `process.version`.
4. Add "use strict" to the top, then deliberately try to assign an undeclared variable and read the error.
5. Write an HTML file with two external scripts using `defer` and confirm they run in order after parse.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created JavaScript?
9. A) Brendan Eich (*)
10. B) Guido van Rossum
11. C) James Gosling
12. D) Bjarne Stroustrup
13. Explanation: Brendan Eich created JavaScript in 10 days at Netscape in May 1995; it was renamed from Mocha to LiveScript to JavaScript for marketing.
14. Q2: Which engine does Node.js use?
15. A) SpiderMonkey
16. B) JavaScriptCore
17. C) V8 (*)
18. D) Chakra
19. Explanation: Node.js is built on Google's V8 engine, the same engine used in Chrome.
20. Q3: What does "use strict" do at the top of a script?
21. A) Compiles the code to WebAssembly
22. B) Enables stricter parsing and runtime rules (*)
23. C) Disables the event loop
24. D) Forces TypeScript type checking
25. Explanation: Strict mode throws on implicit globals, duplicate parameters, and other footguns; it's the default in ES modules.
26. Q4: Which attribute makes an external script wait for HTML parsing to finish?
27. A) async
28. B) defer (*)
29. C) wait
30. D) onload
31. Explanation: defer downloads in parallel but executes only after the document is parsed, preserving script order.
32. Q5: ECMAScript is best described as:
33. A) A JavaScript framework
34. B) The language specification that JavaScript implements (*)
35. C) A replacement for TypeScript
36. D) A browser extension API
37. Explanation: ECMAScript (ECMA-262) is the spec; JavaScript, JScript, and ActionScript are implementations.
38. Q6: Which is true about JavaScript's threading model?
39. A) It runs one thread per function
40. B) It is single-threaded with an event loop (*)
41. C) It always spawns a thread per HTTP request
42. D) It has no threading concept at all
43. Explanation: Each realm has one call stack; the event loop schedules tasks, microtasks, and render steps.
44. Q7: Which console method renders arrays of objects as a table?
45. A) console.grid
46. B) console.table (*)
47. C) console.matrix
48. D) console.tabular
49. Explanation: console.table takes an array or object and renders it as a sortable table in the console.
50. Q8: Which is the recommended way to load an external script today?
51. A) Inline it in the head with no attributes
52. B) Use <script src="app.js" defer></script> (*)
53. C) Use document.write in the head
54. D) eval the file at runtime
55. Explanation: defer preserves order, doesn't block parsing, and is supported in all modern browsers.
56. Q9: Which company originally developed V8?
57. A) Mozilla
58. B) Apple
59. C) Google (*)
60. D) Microsoft
61. Explanation: V8 is Google's open-source JavaScript and WebAssembly engine, written in C++.
62. Q10: What is the DOM?
63. A) A JavaScript library for animations
64. B) The in-memory tree of HTML nodes the browser exposes to scripts (*)
65. C) A CSS preprocessor
66. D) A network protocol
67. Explanation: The Document Object Model is the live tree representation of the page that JavaScript manipulates via document.* APIs.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created JavaScript?
  options:
    - Brendan Eich
    - Guido van Rossum
    - James Gosling
    - Bjarne Stroustrup
  correctIndex: 0
  explanation: Brendan Eich created JavaScript in 10 days at Netscape in May 1995; it was renamed from Mocha to LiveScript to JavaScript for marketing.
- id: q2
  question: Which engine does Node.js use?
  options:
    - SpiderMonkey
    - JavaScriptCore
    - V8
    - Chakra
  correctIndex: 2
  explanation: Node.js is built on Google's V8 engine, the same engine used in Chrome.
- id: q3
  question: What does "use strict" do at the top of a script?
  options:
    - Compiles the code to WebAssembly
    - Enables stricter parsing and runtime rules
    - Disables the event loop
    - Forces TypeScript type checking
  correctIndex: 1
  explanation: Strict mode throws on implicit globals, duplicate parameters, and other footguns; it's the default in ES modules.
- id: q4
  question: Which attribute makes an external script wait for HTML parsing to finish?
  options:
    - async
    - defer
    - wait
    - onload
  correctIndex: 1
  explanation: defer downloads in parallel but executes only after the document is parsed, preserving script order.
- id: q5
  question: "ECMAScript is best described as:"
  options:
    - A JavaScript framework
    - The language specification that JavaScript implements
    - A replacement for TypeScript
    - A browser extension API
  correctIndex: 1
  explanation: ECMAScript (ECMA-262) is the spec; JavaScript, JScript, and ActionScript are implementations.
- id: q6
  question: Which is true about JavaScript's threading model?
  options:
    - It runs one thread per function
    - It is single-threaded with an event loop
    - It always spawns a thread per HTTP request
    - It has no threading concept at all
  correctIndex: 1
  explanation: Each realm has one call stack; the event loop schedules tasks, microtasks, and render steps.
- id: q7
  question: Which console method renders arrays of objects as a table?
  options:
    - console.grid
    - console.table
    - console.matrix
    - console.tabular
  correctIndex: 1
  explanation: console.table takes an array or object and renders it as a sortable table in the console.
- id: q8
  question: Which is the recommended way to load an external script today?
  options:
    - Inline it in the head with no attributes
    - Use <script src="app.js" defer></script>
    - Use document.write in the head
    - eval the file at runtime
  correctIndex: 1
  explanation: defer preserves order, doesn't block parsing, and is supported in all modern browsers.
- id: q9
  question: Which company originally developed V8?
  options:
    - Mozilla
    - Apple
    - Google
    - Microsoft
  correctIndex: 2
  explanation: V8 is Google's open-source JavaScript and WebAssembly engine, written in C++.
- id: q10
  question: What is the DOM?
  options:
    - A JavaScript library for animations
    - The in-memory tree of HTML nodes the browser exposes to scripts
    - A CSS preprocessor
    - A network protocol
  correctIndex: 1
  explanation: The Document Object Model is the live tree representation of the page that JavaScript manipulates via document.* APIs.
```

