---
slug: angular-pwa-service-workers-app-shell
id: angular-18
track: angular
order: 18
title: PWA, Service Workers, App Shell
description: Add a service worker with `@angular/service-worker`, configure caching strategies in `ngsw-config.json`, implement an app shell, and handle offline-first UX.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=420s
whyItMatters: Add a service worker with `@angular/service-worker`, configure caching strategies in `ngsw-config. json`, implement an app shell, and handle offline-first UX.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# PWA, Service Workers, App Shell

## PWA, Service Workers, App Shell

### Why It Matters

Add a service worker with `@angular/service-worker`, configure caching strategies in `ngsw-config. json`, implement an app shell, and handle offline-first UX.

Add a service worker with `@angular/service-worker`, configure caching strategies in `ngsw-config.json`, implement an app shell, and handle offline-first UX.

### Prerequisites

- Stage 19 (Performance) is recommended but not required — bundle size and lazy loading concepts help.
- Stage 7: Routing (you understand navigation and lazy routes).
- A production build (`ng build --configuration production`) is required for SW to work (service workers don't run in dev).

### Topics

- `ng add @angular/service-worker` setup
- `ngsw-config.json` structure: `index`, `assetGroups`, `dataGroups`
- Caching strategies: `performance` (cache-first) vs `freshness` (network-first)
- App Shell pattern: cache the index.html + critical assets for instant offline launch
- Data group caching for API responses with timeouts and limits
- `SwUpdate` service: version updates and prompting the user to reload
- `SwPush` for web push notifications
- Debugging service workers in Chrome DevTools (Application → Service Workers)

### Key Concepts

- The Angular service worker runs only in production builds (`ng build --configuration production`) — never in `ng serve`
- `assetGroups` cache static resources (JS, CSS, images, fonts); `dataGroups` cache API responses with TTL
- `performance` (cache-first) is for static assets that rarely change; `freshness` (network-first) is for API data
- `SwUpdate.versionUpdates` is an Observable of available updates; prompt the user and call `activateUpdate()` + reload
- The app shell (cached `index.html` + critical CSS/JS) loads instantly even offline

```json
// ngsw-config.json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "appData": { "version": "1.0.0" },
  "assetGroups": [
    {
      "name": "app-shell",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/manifest.webmanifest", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.(svg|png|jpg|jpeg|webp|woff2)"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1d",
        "timeout": "3s"
      }
    }
  ]
}
```
Caption: ng add @angular/service-worker and ngsw-config.json

### Common Pitfalls

- Trying to test the service worker with `ng serve` — service workers only run in production builds; use `ng build --configuration production` and serve `dist/` with `http-server` or `ng deploy`.
- Setting `installMode: "prefetch"` for huge assets — downloads everything on first load, killing first paint; use `lazy` for non-critical assets.
- Forgetting to bump `appData.version` in `ngsw-config.json` — the SW can't detect a new version; bump it with every release.
- Using `freshness` strategy with no `timeout` — network failures leave the user staring at a blank screen; always set a `timeout` (e.g., "3s") to fall back to cache.
- Calling `activateUpdate()` without reloading — leaves the old and new versions running simultaneously; always `document.location.reload()` after `activateUpdate()`.

### Real-World Applications

- Google Pay's merchant dashboard is a PWA — installable on desktop, with an app shell that loads instantly offline.
- Upwork's freelancer app uses `SwUpdate` to prompt users to reload when a new version is deployed.
- Deutsche Bahn's train lookup PWA caches the last search results, so travelers can re-open the app on a flaky connection and still see recent trains.
- Forbes' article reader PWA uses `freshness` strategy with a 3s timeout to fall back to cached articles on slow networks.

### Interview Questions

- 1. Why doesn't the service worker run in `ng serve`? — `ng serve` runs the dev build without SW registration; only `ng build --configuration production` ships `ngsw-worker.js`.
- 2. What's the difference between `installMode: "prefetch"` and `"lazy"`? — Prefetch downloads all resources immediately on first load; lazy downloads on first request — use lazy for non-critical assets.
- 3. What are the two caching strategies for `dataGroups`? — `freshness` (network-first, falls back to cache after timeout) for API data; `performance` (cache-first) for rarely-changing static data.
- 4. How does `SwUpdate.versionUpdates` work? — It's an Observable emitting `VERSION_DETECTED`, `VERSION_READY`, etc.; subscribe and prompt the user to reload when `VERSION_READY` fires.
- 5. What does `SwPush.requestSubscription({ serverPublicKey })` do? — Asks the user for permission, generates a `PushSubscription`, and sends it to your VAPID-signed server for storage.

### Mini Project

Build a "Read-It-Later" PWA: An Angular PWA that caches article content for offline reading, prompts the user on new versions, and is installable. Suggested approach:
  - Run `ng add @angular/service-worker`
  - Configure `ngsw-config.json` with `app-shell` (prefetch) and `articles` data group (freshness, 1d maxAge, 3s timeout)
  - Subscribe to `SwUpdate.versionUpdates` and show a "New version available" toast
  - Add a `manifest.webmanifest` with icons and `display: standalone`
  - Build with `ng build --configuration production` and serve `dist/` with `http-server`

### Exercises

1. Run `ng add @angular/service-worker` and confirm `ngsw-config.json` is created.
2. Configure an `assets` group with `installMode: "lazy"` for images.
3. Add a `dataGroups` entry for `/api/**` with `strategy: "freshness"` and a 3s `timeout`.
4. Subscribe to `SwUpdate.versionUpdates` and log `VERSION_READY` to the console.
5. Build the app with `--configuration production` and verify the SW is registered via Chrome DevTools.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which package adds Angular service worker support?
9. A) @angular/pwa
10. B) @angular/service-worker (*)
11. C) workbox-cli
12. D) @ngx/sw
13. Explanation: `ng add @angular/service-worker` installs the package, creates `ngsw-config.json`, and updates `angular.json` to enable the SW in production builds.
14. Q2: When does the Angular service worker actually run?
15. A) Always, including in `ng serve`
16. B) Only with SSR
17. C) Only in production builds (`ng build --configuration production`) (*)
18. D) On demand via a script
19. Explanation: SW registration is enabled in the production build configuration; `ng serve` runs without SW to avoid caching dev files.
20. Q3: Which caching strategy is network-first with cache fallback?
21. A) performance
22. B) network-only
23. C) cache-only
24. D) freshness (*)
25. Explanation: `freshness` (network-first) tries the network, falls back to cache after `timeout`; ideal for API data that should be fresh when possible.
26. Q4: Which caching strategy is cache-first for rarely-changing assets?
27. A) performance (*)
28. B) freshness
29. C) stale-while-revalidate
30. D) lazy
31. Explanation: `performance` (cache-first) serves from cache and only hits the network on cache miss — ideal for static assets that don't change.
32. Q5: Which service exposes version updates to your app?
33. A) SwRegister
34. B) SwUpdate (*)
35. C) SwVersion
36. D) VersionService
37. Explanation: `SwUpdate` from `@angular/service-worker` exposes `versionUpdates` (Observable) and `activateUpdate()` (Promise) to detect and apply new versions.
38. Q6: What does `installMode: "lazy"` do for an asset group?
39. A) Downloads all assets on first load
40. B) Disables caching
41. C) Downloads each asset on first request (*)
42. D) Uses network only
43. Explanation: `lazy` defers asset download until first request; `prefetch` downloads all group assets on install (first load).
44. Q7: What must you do AFTER calling `activateUpdate()`?
45. A) Nothing
46. B) Clear cache manually
47. C) Re-register the SW
48. D) Reload the document (document.location.reload()) (*)
49. Explanation: `activateUpdate()` swaps the cached version; reload to load the new bundles. Without reload, the old version keeps running.
50. Q8: Which manifest field makes the app installable as a standalone window?
51. A) "display": "standalone" (*)
52. B) "installable": true
53. C) "mode": "window"
54. D) "app": true
55. Explanation: `"display": "standalone"` (or `"fullscreen"`) in `manifest.webmanifest` enables "Add to Home Screen" with no browser chrome.
56. Q9: Which service handles web push notifications?
57. A) SwNotify
58. B) SwPush (*)
59. C) Notifications API directly
60. D) PushService
61. Explanation: `SwPush` from `@angular/service-worker` wraps the Push API, generating subscriptions and forwarding push events to your app.
62. Q10: Which is a recommended timeout for a `freshness` data group?
63. A) "0s"
64. B) "1h"
65. C) "3s" (or similar short timeout to fall back to cache) (*)
66. D) No timeout (skip cache forever)
67. Explanation: Always set a short `timeout` (e.g., 3s) for `freshness` strategy so network failures fall back to cache instead of leaving the user waiting.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which package adds Angular service worker support?
  options:
    - "@angular/pwa"
    - "@angular/service-worker"
    - workbox-cli
    - "@ngx/sw"
  correctIndex: 1
  explanation: "`ng add @angular/service-worker` installs the package, creates `ngsw-config.json`, and updates `angular.json` to enable the SW in production builds."
- id: q2
  question: When does the Angular service worker actually run?
  options:
    - Always, including in `ng serve`
    - Only with SSR
    - Only in production builds (`ng build --configuration production`)
    - On demand via a script
  correctIndex: 2
  explanation: SW registration is enabled in the production build configuration; `ng serve` runs without SW to avoid caching dev files.
- id: q3
  question: Which caching strategy is network-first with cache fallback?
  options:
    - performance
    - network-only
    - cache-only
    - freshness
  correctIndex: 3
  explanation: "`freshness` (network-first) tries the network, falls back to cache after `timeout`; ideal for API data that should be fresh when possible."
- id: q4
  question: Which caching strategy is cache-first for rarely-changing assets?
  options:
    - performance
    - freshness
    - stale-while-revalidate
    - lazy
  correctIndex: 0
  explanation: "`performance` (cache-first) serves from cache and only hits the network on cache miss — ideal for static assets that don't change."
- id: q5
  question: Which service exposes version updates to your app?
  options:
    - SwRegister
    - SwUpdate
    - SwVersion
    - VersionService
  correctIndex: 1
  explanation: "`SwUpdate` from `@angular/service-worker` exposes `versionUpdates` (Observable) and `activateUpdate()` (Promise) to detect and apply new versions."
- id: q6
  question: 'What does `installMode: "lazy"` do for an asset group?'
  options:
    - Downloads all assets on first load
    - Disables caching
    - Downloads each asset on first request
    - Uses network only
  correctIndex: 2
  explanation: "`lazy` defers asset download until first request; `prefetch` downloads all group assets on install (first load)."
- id: q7
  question: What must you do AFTER calling `activateUpdate()`?
  options:
    - Nothing
    - Clear cache manually
    - Re-register the SW
    - Reload the document (document.location.reload())
  correctIndex: 3
  explanation: "`activateUpdate()` swaps the cached version; reload to load the new bundles. Without reload, the old version keeps running."
- id: q8
  question: Which manifest field makes the app installable as a standalone window?
  options:
    - '"display": "standalone"'
    - '"installable": true'
    - '"mode": "window"'
    - '"app": true'
  correctIndex: 0
  explanation: '`"display": "standalone"` (or `"fullscreen"`) in `manifest.webmanifest` enables "Add to Home Screen" with no browser chrome.'
- id: q9
  question: Which service handles web push notifications?
  options:
    - SwNotify
    - SwPush
    - Notifications API directly
    - PushService
  correctIndex: 1
  explanation: "`SwPush` from `@angular/service-worker` wraps the Push API, generating subscriptions and forwarding push events to your app."
- id: q10
  question: Which is a recommended timeout for a `freshness` data group?
  options:
    - '"0s"'
    - '"1h"'
    - '"3s" (or similar short timeout to fall back to cache)'
    - No timeout (skip cache forever)
  correctIndex: 2
  explanation: Always set a short `timeout` (e.g., 3s) for `freshness` strategy so network failures fall back to cache instead of leaving the user waiting.
```

