---
slug: dart-dart-web-dart2js-dart2wasm
id: dart-17
track: dart
order: 17
title: Dart for the Web — dart2js, dart2wasm
description: Compile Dart to JavaScript (dart2js) and WebAssembly (dart2wasm), interop with JS via `package:js` and `dart:js_interop`, and understand the tradeoffs.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=9600s
whyItMatters: Compile Dart to JavaScript (dart2js) and WebAssembly (dart2wasm), interop with JS via `package:js` and `dart:js_interop`, and understand the tradeoffs.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Dart for the Web — dart2js, dart2wasm

## Dart for the Web — dart2js, dart2wasm

### Why It Matters

Compile Dart to JavaScript (dart2js) and WebAssembly (dart2wasm), interop with JS via `package:js` and `dart:js_interop`, and understand the tradeoffs.

Compile Dart to JavaScript (dart2js) and WebAssembly (dart2wasm), interop with JS via `package:js` and `dart:js_interop`, and understand the tradeoffs.

### Prerequisites

- Stage 11: Async Programming — Future, async/await
- Stage 14: File I/O and Serialization

### Topics

- `dart compile js` (dart2js) — production JS bundles
- `dart compile wasm` (dart2wasm) — WebAssembly output
- `package:web` for browser APIs (replaces dart:html)
- `dart:js_interop` and `@JS()` annotations for JS interop
- `package:js` (legacy) — being phased out
- Tree shaking and minification in release builds
- Running with `dart run webdev serve` / `webdev build`
- Cross-platform code via conditional imports

### Key Concepts

- `dart2js` compiles to optimized, tree-shaken JavaScript; the standard since Dart 1.
- `dart2wasm` (Dart 3) compiles to WebAssembly for faster startup and predictable performance; requires browsers with Wasm GC support.
- Modern Dart web code uses `package:web` (generated from browser IDL) and `dart:js_interop` — the `dart:html` library is being deprecated.
- JS interop uses `extension type` (Dart 3.3+) for zero-cost wrappers around JS objects.
- Tree shaking removes unused code; release builds are dramatically smaller than dev builds.
- Conditional imports (`if (dart.library.html) 'web_impl.dart' else 'io_impl.dart'`) let you write platform-specific code without runtime checks.

```bash
# Build a JS bundle from a Dart entry point
dart compile js -O2 -o out/main.js bin/main.dart

# webdev (for full web apps)
dart pub global activate webdev
webdev serve         # dev server with hot reload
webdev build         # release build in build/
```
Caption: Compile to JS

### Common Pitfalls

- Importing `dart:io` in web code — compile error; use conditional imports or `package:universal_io` for cross-platform shims.
- Using the legacy `dart:html` API in new code — prefer `package:web`; `dart:html` is being phased out and doesn't support Wasm.
- Expecting `dart2wasm` to work on all browsers — Wasm GC requires modern browsers (Chrome 119+, Firefox 120+, Safari 17.4+); provide a JS fallback.
- Forgetting to tree-shake — dev builds include everything; release builds strip unused code. Always test with `webdev build` (release) before shipping.
- Mutating JS objects expecting Dart semantics — `JSObject` equality is reference-based; `==` doesn't compare fields. Convert to a Dart object first if you need value equality.

### Real-World Applications

- Flutter web compiles Flutter apps to JS (and now Wasm) for desktop browsers; Google's own Flutter web demos run on dart2js/dart2wasm.
- Reflectly's web build ( Flutter web) compiles to JS for browser access alongside iOS/Android.
- BMW's marketing microsites use Dart web for shared business logic between the mobile app and the web.
- Google Ads internal dashboards use Dart web for tooling that runs in the browser without server roundtrips.

### Interview Questions

- 1. What's the difference between dart2js and dart2wasm? — dart2js compiles to JavaScript (works everywhere); dart2wasm compiles to WebAssembly with GC (faster startup, modern browsers only).
- 2. What is `package:web`? — A Dart binding to browser APIs generated from the MDN IDL, replacing the legacy `dart:html` library.
- 3. How do you call a JS function from Dart? — Use `@JS()` annotation with `external` declarations and `dart:js_interop`; values convert via `.toJS` and `.toDart`.
- 4. What are conditional imports? — `import 'a.dart' if (dart.library.html) 'b.dart'` lets you pick a platform-specific implementation at compile time.
- 5. Why use `extension type` for JS interop? — It's a zero-cost wrapper (no runtime allocation) around a JS object, enabling type-safe interop without overhead.

### Mini Project

Build a Browser Stopwatch: A Dart web app that displays a stopwatch with start/stop/reset buttons, persists best lap time to `localStorage` via `package:web`, and compiles to both JS and Wasm. Suggested approach:
  - Use `package:web` for DOM access (`document.getElementById`)
  - Define a `Stopwatch` model with `start`, `stop`, `reset`, `elapsed`
  - Use `window.localStorage` for persistence (interop)
  - Build with `webdev build` for JS
  - Build with `dart compile wasm` for Wasm and verify both load in Chrome

### Exercises

1. Compile a Hello World Dart program to JS with `dart compile js -o out.js` and load it in an HTML page.
2. Use `dart:js_interop` to call `Math.random()` and print the result.
3. Define an `extension type` wrapping a JS `Date` object and read its `getFullYear()`.
4. Write a conditional import that returns `'web'` on browsers and `'io'` on Dart VM.
5. Build a small app with `webdev build` and inspect the output size with `-O2` vs default.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which compiler produces JavaScript from Dart?
9. A) dart2js (*)
10. B) dart2jvm
11. C) dartc
12. D) tsc
13. Explanation: `dart compile js` (the dart2js compiler) outputs optimized, tree-shaken JavaScript that runs in any modern browser.
14. Q2: What does dart2wasm compile to?
15. A) JavaScript
16. B) WebAssembly (with GC) (*)
17. C) Native machine code
18. D) JVM bytecode
19. Explanation: dart2wasm compiles Dart to WebAssembly using the Wasm GC proposal, enabling faster startup than JS on supported browsers.
20. Q3: Which library is being deprecated for Dart web?
21. A) dart:core
22. B) dart:js_interop
23. C) dart:html (*)
24. D) package:web
25. Explanation: `dart:html` is being phased out in favor of `package:web` and `dart:js_interop`, which support both JS and Wasm compilation.
26. Q4: How do you call a JS function from Dart?
27. A) import 'js:Math'
28. B) eval('Math.random()')
29. C) window.callJS('Math.random')
30. D) @JS() annotation + external declaration + dart:js_interop (*)
31. Explanation: Annotate an `external` function with `@JS('Math.random')` and import `dart:js_interop`; values cross via `.toJS` and `.toDart`.
32. Q5: What do conditional imports do?
33. A) Pick a platform-specific implementation at compile time (*)
34. B) Lazily load imports at runtime
35. C) Skip imports if missing
36. D) Bundle imports for tree shaking
37. Explanation: `export 'a.dart' if (dart.library.html) 'b.dart'` selects an implementation based on which Dart platform is compiling, enabling cross-platform code.
38. Q6: Which is true of extension types for JS interop?
39. A) They allocate a wrapper object on every access
40. B) They are zero-cost wrappers around a JS object (*)
41. C) They only work in dart2js
42. D) They require code generation
43. Explanation: `extension type` (Dart 3.3+) wraps a JS object with no runtime overhead, providing type-safe interop without allocation.
44. Q7: Why provide a JS fallback for Wasm builds?
45. A) Wasm is slower than JS
46. B) JS is more secure
47. C) Wasm GC requires modern browsers; older ones can't run it (*)
48. D) Wasm doesn't support Dart's type system
49. Explanation: Wasm GC requires Chrome 119+, Firefox 120+, Safari 17.4+; ship a JS fallback for older browsers via feature detection.
50. Q8: What does tree shaking do in dart2js release builds?
51. A) Adds runtime type checks
52. B) Minifies variable names
53. C) Bundles dependencies
54. D) Removes unused code from the output (*)
55. Explanation: Tree shaking analyzes reachability from main() and strips unreferenced code, dramatically reducing bundle size in release builds.
56. Q9: Which command runs a dev web server with hot reload?
57. A) webdev serve (*)
58. B) dart serve
59. C) dart run web
60. D) flutter serve
61. Explanation: `webdev serve` runs a dev server with incremental compilation and hot reload; `webdev build` produces a release bundle.
62. Q10: Why avoid `dart:io` in web code?
63. A) It's deprecated
64. B) It's not available on the web platform — compile error (*)
65. C) It's slower than dart:html
66. D) It requires Wasm
67. Explanation: `dart:io` exposes native-only APIs (File, Process, HttpClient); importing it in a web target fails compilation. Use conditional imports or `package:universal_io`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which compiler produces JavaScript from Dart?
  options:
    - dart2js
    - dart2jvm
    - dartc
    - tsc
  correctIndex: 0
  explanation: "`dart compile js` (the dart2js compiler) outputs optimized, tree-shaken JavaScript that runs in any modern browser."
- id: q2
  question: What does dart2wasm compile to?
  options:
    - JavaScript
    - WebAssembly (with GC)
    - Native machine code
    - JVM bytecode
  correctIndex: 1
  explanation: dart2wasm compiles Dart to WebAssembly using the Wasm GC proposal, enabling faster startup than JS on supported browsers.
- id: q3
  question: Which library is being deprecated for Dart web?
  options:
    - dart:core
    - dart:js_interop
    - dart:html
    - package:web
  correctIndex: 2
  explanation: "`dart:html` is being phased out in favor of `package:web` and `dart:js_interop`, which support both JS and Wasm compilation."
- id: q4
  question: How do you call a JS function from Dart?
  options:
    - import 'js:Math'
    - eval('Math.random()')
    - window.callJS('Math.random')
    - "@JS() annotation + external declaration + dart:js_interop"
  correctIndex: 3
  explanation: Annotate an `external` function with `@JS('Math.random')` and import `dart:js_interop`; values cross via `.toJS` and `.toDart`.
- id: q5
  question: What do conditional imports do?
  options:
    - Pick a platform-specific implementation at compile time
    - Lazily load imports at runtime
    - Skip imports if missing
    - Bundle imports for tree shaking
  correctIndex: 0
  explanation: "`export 'a.dart' if (dart.library.html) 'b.dart'` selects an implementation based on which Dart platform is compiling, enabling cross-platform code."
- id: q6
  question: Which is true of extension types for JS interop?
  options:
    - They allocate a wrapper object on every access
    - They are zero-cost wrappers around a JS object
    - They only work in dart2js
    - They require code generation
  correctIndex: 1
  explanation: "`extension type` (Dart 3.3+) wraps a JS object with no runtime overhead, providing type-safe interop without allocation."
- id: q7
  question: Why provide a JS fallback for Wasm builds?
  options:
    - Wasm is slower than JS
    - JS is more secure
    - Wasm GC requires modern browsers; older ones can't run it
    - Wasm doesn't support Dart's type system
  correctIndex: 2
  explanation: Wasm GC requires Chrome 119+, Firefox 120+, Safari 17.4+; ship a JS fallback for older browsers via feature detection.
- id: q8
  question: What does tree shaking do in dart2js release builds?
  options:
    - Adds runtime type checks
    - Minifies variable names
    - Bundles dependencies
    - Removes unused code from the output
  correctIndex: 3
  explanation: Tree shaking analyzes reachability from main() and strips unreferenced code, dramatically reducing bundle size in release builds.
- id: q9
  question: Which command runs a dev web server with hot reload?
  options:
    - webdev serve
    - dart serve
    - dart run web
    - flutter serve
  correctIndex: 0
  explanation: "`webdev serve` runs a dev server with incremental compilation and hot reload; `webdev build` produces a release bundle."
- id: q10
  question: Why avoid `dart:io` in web code?
  options:
    - It's deprecated
    - It's not available on the web platform — compile error
    - It's slower than dart:html
    - It requires Wasm
  correctIndex: 1
  explanation: "`dart:io` exposes native-only APIs (File, Process, HttpClient); importing it in a web target fails compilation. Use conditional imports or `package:universal_io`."
```

