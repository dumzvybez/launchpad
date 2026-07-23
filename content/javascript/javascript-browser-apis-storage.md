---
slug: javascript-browser-apis-storage
id: javascript-11
track: javascript
order: 11
title: The Browser APIs and Storage
description: Use the browser's built-in APIs — Web Storage, IndexedDB, IntersectionObserver, ResizeObserver, and the History API — to build fast, persistent, app-like experiences.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=8500s
whyItMatters: Use the browser's built-in APIs — Web Storage, IndexedDB, IntersectionObserver, ResizeObserver, and the History API — to build fast, persistent, app-like experiences.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# The Browser APIs and Storage

## The Browser APIs and Storage

### Why It Matters

Use the browser's built-in APIs — Web Storage, IndexedDB, IntersectionObserver, ResizeObserver, and the History API — to build fast, persistent, app-like experiences.

Use the browser's built-in APIs — Web Storage, IndexedDB, IntersectionObserver, ResizeObserver, and the History API — to build fast, persistent, app-like experiences.

### Prerequisites

- Stage 10: Modules and npm
- Comfort with the DOM and async code.

### Topics

- localStorage, sessionStorage, cookies — and when to use each
- IndexedDB for structured client-side data
- IntersectionObserver for lazy-loading and infinite scroll
- ResizeObserver for responsive components
- History API and pushState for SPA routing
- Geolocation, Clipboard, Notification APIs (briefly)
- Web Workers for off-main-thread work
- Page Visibility API and lifecycle events

### Key Concepts

- localStorage is synchronous, ~5MB, string-only, and blocks the main thread — fine for tiny flags, bad for big data
- IndexedDB is async, transactional, stores objects and blobs, can be 50MB+ per origin
- Observers (Intersection, Resize, Mutation) replace expensive scroll/resize polling
- pushState changes the URL without a reload; you must wire up the renderer yourself
- Web Workers run JS off the main thread — perfect for hashing, parsing, image processing
- All storage is per-origin; iframe/CDN rules and quotas vary by browser

```javascript
const Store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn("Quota exceeded", e); }
  },
};
Store.set("theme", "dark");
console.log(Store.get("theme", "light")); // "dark"
```
Caption: localStorage with JSON

### Common Pitfalls

- Storing large JSON in localStorage — synchronous and tiny quota (5MB); use IndexedDB for >1MB.
- Forgetting to handle `onupgradeneeded` in IndexedDB — schema changes only happen there; without it, createObjectStore throws.
- Polling scroll/resize instead of using observers — destroys battery and CPU; use IntersectionObserver and ResizeObserver.
- pushState without a popstate listener — back button breaks; always wire up popstate to re-render.
- Storing sensitive data in localStorage — any XSS can read it; never store tokens here (use httpOnly cookies).

### Real-World Applications

- Twitter/X uses IndexedDB to cache timelines so the app loads instantly on repeat visits, even offline.
- Notion uses IntersectionObserver to virtualize long documents — only the visible blocks render at scale.
- The YouTube TV client uses the Page Visibility API to pause video when the tab is hidden.
- Figma offloads WebGL hit-testing and shape interpolation to Web Workers so the main thread stays 60fps.

### Interview Questions

- 1. localStorage vs IndexedDB? — localStorage is sync, string-only, ~5MB; IndexedDB is async, transactional, stores objects/blobs, much larger.
- 2. Why use IntersectionObserver? — To observe when elements enter/leave the viewport without scroll polling; perfect for lazy images, infinite scroll, and analytics.
- 3. How does SPA routing work? — pushState changes the URL without reload; popstate fires on back/forward; you render the matching route.
- 4. What are Web Workers for? — Off-main-thread CPU work (parsing, hashing, ML) so the UI thread stays responsive; they can't touch the DOM.
- 5. Why not store auth tokens in localStorage? — Any XSS attack can read it; use httpOnly secure cookies with CSRF tokens instead.

### Mini Project

Build an "Offline Note Pad" that stores notes in IndexedDB, lists them, and survives a full reload — including a "draft auto-save" feature that saves the active note every 2 seconds. It takes typed input and persists structured note objects. Suggested approach:
  - Create an IndexedDB database with a "notes" object store keyed by id
  - Implement getAll, put, delete as Promise wrappers
  - Render the list with a DocumentFragment on every change
  - Debounce auto-save with a 2-second timer using the input event
  - Add a "Clear all" button that opens a confirm dialog and clears the store

### Exercises

1. Build a settings store that syncs across tabs using the `storage` event.
2. Use IntersectionObserver to implement infinite scroll on a fake "feed" of 1000 items.
3. Add a Service Worker stub that caches the page for offline (just the registration).
4. Use ResizeObserver to log when a `<div>` changes size on window resize.
5. Implement a tiny SPA router with pushState for "/", "/about", "/contact" routes.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: localStorage is:
9. A) Async
10. B) Synchronous and string-only (*)
11. C) Per-tab
12. D) unlimited in size
13. Explanation: localStorage is sync, ~5MB per origin, and stores only strings; JSON.stringify/parse for objects.
14. Q2: IndexedDB stores:
15. A) Only strings
16. B) Structured objects, blobs, and files (*)
17. C) Only numbers
18. D) Only images
19. Explanation: IndexedDB is a transactional object store supporting any structured-clone-able value, including Blobs and Files.
20. Q3: IntersectionObserver is used for:
21. A) Tracking the mouse
22. B) Lazy-loading and visibility-based actions (*)
23. C) Form validation
24. D) Network requests
25. Explanation: It calls back when elements enter/leave the viewport — far cheaper than scroll polling.
26. Q4: `history.pushState(state, "", path)`:
27. A) Reloads the page
28. B) Changes the URL without reload; you must render (*)
29. C) Deletes history
30. D) Is synchronous and blocking
31. Explanation: pushState updates the URL and adds a history entry; you handle the rendering, and popstate fires on back/forward.
32. Q5: Where should auth tokens NOT be stored?
33. A) httpOnly cookies
34. B) In-memory only
35. C) localStorage (*)
36. D) SessionStorage with expiration
37. Explanation: localStorage is readable by any XSS; httpOnly cookies can't be read by JS at all.
38. Q6: Web Workers can:
39. A) Manipulate the DOM
40. B) Run JS off the main thread (*)
41. C) Access localStorage directly
42. D) Use window APIs freely
43. Explanation: Workers run in a separate context; they can't touch the DOM but can postMessage to the main thread.
44. Q7: Which event fires in OTHER tabs when localStorage changes?
45. A) storage (*)
46. B) change
47. C) update
48. D) sync
49. Explanation: The storage event fires in other tabs/windows of the same origin when localStorage is modified — great for cross-tab sync.
50. Q8: IndexedDB schema changes happen in:
51. A) onupgradeneeded (*)
52. B) onsuccess
53. C) onerror
54. D) onload
55. Explanation: createObjectStore and createIndex must run inside onupgradeneeded, which fires when the version bumps or the DB is first created.
56. Q9: Page Visibility API is useful for:
57. A) Detecting ad blockers
58. B) Pausing work when the tab is hidden (*)
59. C) Form validation
60. D) Routing
61. Explanation: document.visibilityState tells you "hidden"/"visible" — pause video, reduce polling, save battery.
62. Q10: ResizeObserver fires when:
63. A) The window resizes only
64. B) Any observed element's size changes (*)
65. C) The user scrolls
66. D) An image loads
67. Explanation: ResizeObserver watches element content-box changes — useful for responsive components regardless of window size.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "localStorage is:"
  options:
    - Async
    - Synchronous and string-only
    - Per-tab
    - unlimited in size
  correctIndex: 1
  explanation: localStorage is sync, ~5MB per origin, and stores only strings; JSON.stringify/parse for objects.
- id: q2
  question: "IndexedDB stores:"
  options:
    - Only strings
    - Structured objects, blobs, and files
    - Only numbers
    - Only images
  correctIndex: 1
  explanation: IndexedDB is a transactional object store supporting any structured-clone-able value, including Blobs and Files.
- id: q3
  question: "IntersectionObserver is used for:"
  options:
    - Tracking the mouse
    - Lazy-loading and visibility-based actions
    - Form validation
    - Network requests
  correctIndex: 1
  explanation: It calls back when elements enter/leave the viewport — far cheaper than scroll polling.
- id: q4
  question: '`history.pushState(state, "", path)`:'
  options:
    - Reloads the page
    - Changes the URL without reload; you must render
    - Deletes history
    - Is synchronous and blocking
  correctIndex: 1
  explanation: pushState updates the URL and adds a history entry; you handle the rendering, and popstate fires on back/forward.
- id: q5
  question: Where should auth tokens NOT be stored?
  options:
    - httpOnly cookies
    - In-memory only
    - localStorage
    - SessionStorage with expiration
  correctIndex: 2
  explanation: localStorage is readable by any XSS; httpOnly cookies can't be read by JS at all.
- id: q6
  question: "Web Workers can:"
  options:
    - Manipulate the DOM
    - Run JS off the main thread
    - Access localStorage directly
    - Use window APIs freely
  correctIndex: 1
  explanation: Workers run in a separate context; they can't touch the DOM but can postMessage to the main thread.
- id: q7
  question: Which event fires in OTHER tabs when localStorage changes?
  options:
    - storage
    - change
    - update
    - sync
  correctIndex: 0
  explanation: The storage event fires in other tabs/windows of the same origin when localStorage is modified — great for cross-tab sync.
- id: q8
  question: "IndexedDB schema changes happen in:"
  options:
    - onupgradeneeded
    - onsuccess
    - onerror
    - onload
  correctIndex: 0
  explanation: createObjectStore and createIndex must run inside onupgradeneeded, which fires when the version bumps or the DB is first created.
- id: q9
  question: "Page Visibility API is useful for:"
  options:
    - Detecting ad blockers
    - Pausing work when the tab is hidden
    - Form validation
    - Routing
  correctIndex: 1
  explanation: document.visibilityState tells you "hidden"/"visible" — pause video, reduce polling, save battery.
- id: q10
  question: "ResizeObserver fires when:"
  options:
    - The window resizes only
    - Any observed element's size changes
    - The user scrolls
    - An image loads
  correctIndex: 1
  explanation: ResizeObserver watches element content-box changes — useful for responsive components regardless of window size.
```

