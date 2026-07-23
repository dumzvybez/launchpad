---
slug: html-html-pwas-service-workers-manifests
id: html-17
track: html
order: 17
title: HTML for PWAs — Service Workers, Manifests
description: Make your site installable and offline-capable. This stage covers the web app manifest, service worker registration from HTML, installability criteria, and display modes — all from the HTML author's perspective.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=6300s
whyItMatters: Make your site installable and offline-capable. This stage covers the web app manifest, service worker registration from HTML, installability criteria, and display modes — all from the HTML author's perspective.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# HTML for PWAs — Service Workers, Manifests

## HTML for PWAs — Service Workers, Manifests

### Why It Matters

Make your site installable and offline-capable. This stage covers the web app manifest, service worker registration from HTML, installability criteria, and display modes — all from the HTML author's perspective.

Make your site installable and offline-capable. This stage covers the web app manifest, service worker registration from HTML, installability criteria, and display modes — all from the HTML author's perspective.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 10: Metadata, SEO, and Open Graph
- Stage 13: iframes, Embeds, and Sandbox (CSP context)

### Topics

- The web app manifest: `manifest.json` and `<link rel="manifest">`
- Manifest properties: `name`, `short_name`, `icons`, `start_url`, `display`, `theme_color`, `background_color`, `orientation`
- Display modes: `fullscreen`, `standalone`, `minimal-ui`, `browser`
- Service worker registration from HTML (`navigator.serviceWorker.register`)
- The `beforeinstallprompt` event and install button
- Installability criteria (HTTPS, manifest with icons, registered SW)
- `<meta name="theme-color">` and `<meta name="apple-mobile-web-app-capable">`
- iOS Safari-specific tags: `apple-touch-icon`, `apple-mobile-web-app-title`

### Key Concepts

- A PWA is a website that meets installability criteria: HTTPS, a manifest with icons, and a registered service worker with a fetch handler.
- The manifest's `display` mode controls whether the app opens in a browser chrome or standalone (app-like) window.
- iOS Safari ignores much of the manifest; you need `apple-touch-icon` and `apple-mobile-web-app-*` meta tags for full iOS support.
- `beforeinstallprompt` lets you show a custom install button; without it, browsers show their own infobar (or nothing on iOS).
- Service workers must be served over HTTPS and registered from a same-origin HTML page.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acme Tasks</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1d4ed8">
  <meta name="description" content="A simple offline-first task manager.">

  <!-- iOS-specific tags (Safari ignores most of the manifest) -->
  <link rel="apple-touch-icon" href="/icons/apple-180.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Acme Tasks">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
</head>
```
Caption: Manifest link and theme color

### Common Pitfalls

- Missing maskable icon — Android O+ clips icons to a circle; without a `purpose: "maskable"` icon, the icon gets cropped badly.
- Manifest missing required fields — `name`, `short_name`, `icons` (192px and 512px), `start_url`, `display` are required for installability.
- No service worker with a fetch handler — installability requires a registered SW that handles `fetch`; without it, the install prompt never fires.
- Serving the app over HTTP — PWAs require HTTPS (or localhost); the service worker will not register on plain HTTP.
- iOS-only omissions — Safari ignores much of the manifest; you must add `apple-touch-icon` and `apple-mobile-web-app-*` meta tags separately.

### Real-World Applications

- Starbucks PWA is 200KB smaller than their iOS app and works offline; it has driven measurable increase in daily active users.
- Pinterest rebuilt their mobile site as a PWA and saw a 40% increase in time spent and 50% increase in ad revenue.
- Twitter Lite is a PWA that uses 3% of the storage of the native Android app and works on slow networks.
- Google Maps Go and YouTube Go are PWAs designed for emerging markets with limited connectivity and storage.

### Interview Questions

- 1. What are the installability criteria for a PWA? — HTTPS, a manifest with name/icons/start_url/display, and a registered service worker with a fetch handler.
- 2. What is the difference between `display: standalone` and `display: browser`? — Standalone opens without browser UI (app-like); browser opens with full browser chrome.
- 3. Why do you need `apple-touch-icon` when you have a manifest? — iOS Safari does not fully support the manifest; the `apple-touch-icon` link tag is the only reliable way to set the iOS home-screen icon.
- 4. What does the `beforeinstallprompt` event let you do? — Intercept the browser's install prompt so you can show a custom install button at a contextually appropriate time.
- 5. Why must a service worker be served over HTTPS? — Service workers can intercept network requests for an entire origin; HTTPS prevents man-in-the-middle attacks from injecting a malicious SW.

### Mini Project

Build an Installable PWA Shell: A minimal HTML page with a manifest, theme color, maskable icon, registered service worker, and a custom install button. Install it on desktop and mobile. Suggested approach:
  - Create `manifest.json` with name, short_name, 192/512 icons (one maskable), display: standalone, theme_color
  - Link the manifest in `<head>` along with `<meta name="theme-color">`
  - Add `apple-touch-icon` and `apple-mobile-web-app-*` tags for iOS
  - Create `sw.js` with a basic fetch handler that responds from cache
  - Register the SW from `<script>` and wire up `beforeinstallprompt` to a custom button

### Exercises

1. Run Lighthouse's PWA audit and fix every red item until it passes.
2. Add a maskable icon variant to your manifest and verify it renders correctly on Android.
3. Install your PWA on desktop Chrome and confirm it opens in a standalone window.
4. Add `<meta name="apple-mobile-web-app-capable" content="yes">` and add to iOS home screen; verify it opens without Safari chrome.
5. Use `display-mode: standalone` in a CSS media query to hide an "Install" banner once installed.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which link tag declares the web app manifest?
9. A) <link rel="manifest" href="/manifest.json"> (*)
10. B) <link rel="pwa" href="/manifest.json">
11. C) <link rel="app" href="/manifest.json">
12. D) <link rel="webapp" href="/manifest.json">
13. Explanation: `<link rel="manifest" href="/manifest.json">` declares the manifest; the browser fetches it and applies its properties.
14. Q2: Which manifest display mode opens the app without browser UI?
15. A) standalone (*)
16. B) browser
17. C) minimal-ui
18. D) fullscreen-chrome
19. Explanation: `display: standalone` opens in an app-like window with no browser chrome; `fullscreen` removes even the status bar (good for games).
20. Q3: What is required for a PWA to be installable?
21. A) Only a manifest
22. B) Only HTTPS
23. C) HTTPS, a manifest with icons, and a registered service worker (*)
24. D) An app store listing
25. Explanation: Installability requires HTTPS, a manifest with name/icons/start_url/display, and a registered SW with a fetch handler.
26. Q4: Why do you need `apple-touch-icon` in addition to the manifest?
27. A) It is required for validation
28. B) iOS Safari does not fully support the manifest (*)
29. C) It is faster
30. D) For desktop
31. Explanation: iOS Safari historically ignored most of the manifest; `apple-touch-icon` and `apple-mobile-web-app-*` meta tags are required for full iOS support.
32. Q5: What event lets you show a custom install button?
33. A) installprompt
34. B) promptinstall
35. C) appinstalled
36. D) beforeinstallprompt (*)
37. Explanation: `beforeinstallprompt` fires before the browser's own prompt; you can `preventDefault()`, save the event, and call `prompt()` later from a button click.
38. Q6: What is the purpose of a maskable icon?
39. A) It is smaller
40. B) It animates
41. C) It ensures the icon looks correct when Android clips it to a circle (*)
42. D) It is required for iOS
43. Explanation: Android O+ masks icons to shapes like circles; a `purpose: "maskable"` icon has safe padding so the logo is not cropped.
44. Q7: Why must a PWA be served over HTTPS?
45. A) Service workers can intercept network requests; HTTPS prevents MITM injection (*)
46. B) For SEO
47. C) To enable caching
48. D) HTTP is deprecated
49. Explanation: A malicious service worker over HTTP could hijack an entire origin; HTTPS (or localhost) is required to register a SW.
50. Q8: Which manifest property sets the splash-screen background color on Android?
51. A) splash_color
52. B) background_color (*)
53. C) theme_color
54. D) start_color
55. Explanation: `background_color` is shown on the splash screen before the app loads; `theme_color` colors the browser/window chrome.
56. Q9: Which manifest field restricts the SW's scope?
57. A) start_url
58. B) domain
59. C) origin
60. D) scope (*)
61. Explanation: `scope` defines the URL subset the SW controls; pages outside this scope are not intercepted by the SW.
62. Q10: How do you detect if the app is running as an installed PWA?
63. A) Check navigator.standalone only
64. B) Use the CSS media query `display-mode: standalone` (*)
65. C) Check window.installed
66. D) You cannot
67. Explanation: `@media (display-mode: standalone)` matches when the app runs in standalone display mode (installed PWA); iOS also supports `navigator.standalone` as a legacy check.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which link tag declares the web app manifest?
  options:
    - <link rel="manifest" href="/manifest.json">
    - <link rel="pwa" href="/manifest.json">
    - <link rel="app" href="/manifest.json">
    - <link rel="webapp" href="/manifest.json">
  correctIndex: 0
  explanation: '`<link rel="manifest" href="/manifest.json">` declares the manifest; the browser fetches it and applies its properties.'
- id: q2
  question: Which manifest display mode opens the app without browser UI?
  options:
    - standalone
    - browser
    - minimal-ui
    - fullscreen-chrome
  correctIndex: 0
  explanation: "`display: standalone` opens in an app-like window with no browser chrome; `fullscreen` removes even the status bar (good for games)."
- id: q3
  question: What is required for a PWA to be installable?
  options:
    - Only a manifest
    - Only HTTPS
    - HTTPS, a manifest with icons, and a registered service worker
    - An app store listing
  correctIndex: 2
  explanation: Installability requires HTTPS, a manifest with name/icons/start_url/display, and a registered SW with a fetch handler.
- id: q4
  question: Why do you need `apple-touch-icon` in addition to the manifest?
  options:
    - It is required for validation
    - iOS Safari does not fully support the manifest
    - It is faster
    - For desktop
  correctIndex: 1
  explanation: iOS Safari historically ignored most of the manifest; `apple-touch-icon` and `apple-mobile-web-app-*` meta tags are required for full iOS support.
- id: q5
  question: What event lets you show a custom install button?
  options:
    - installprompt
    - promptinstall
    - appinstalled
    - beforeinstallprompt
  correctIndex: 3
  explanation: "`beforeinstallprompt` fires before the browser's own prompt; you can `preventDefault()`, save the event, and call `prompt()` later from a button click."
- id: q6
  question: What is the purpose of a maskable icon?
  options:
    - It is smaller
    - It animates
    - It ensures the icon looks correct when Android clips it to a circle
    - It is required for iOS
  correctIndex: 2
  explanation: 'Android O+ masks icons to shapes like circles; a `purpose: "maskable"` icon has safe padding so the logo is not cropped.'
- id: q7
  question: Why must a PWA be served over HTTPS?
  options:
    - Service workers can intercept network requests; HTTPS prevents MITM injection
    - For SEO
    - To enable caching
    - HTTP is deprecated
  correctIndex: 0
  explanation: A malicious service worker over HTTP could hijack an entire origin; HTTPS (or localhost) is required to register a SW.
- id: q8
  question: Which manifest property sets the splash-screen background color on Android?
  options:
    - splash_color
    - background_color
    - theme_color
    - start_color
  correctIndex: 1
  explanation: "`background_color` is shown on the splash screen before the app loads; `theme_color` colors the browser/window chrome."
- id: q9
  question: Which manifest field restricts the SW's scope?
  options:
    - start_url
    - domain
    - origin
    - scope
  correctIndex: 3
  explanation: "`scope` defines the URL subset the SW controls; pages outside this scope are not intercepted by the SW."
- id: q10
  question: How do you detect if the app is running as an installed PWA?
  options:
    - Check navigator.standalone only
    - "Use the CSS media query `display-mode: standalone`"
    - Check window.installed
    - You cannot
    - ; iOS also supports `navigator.standalone` as a legacy check.
  correctIndex: 1
  explanation: "`@media (display-mode: standalone)` matches when the app runs in standalone display mode (installed PWA); iOS also supports `navigator.standalone` as a legacy check."
```

