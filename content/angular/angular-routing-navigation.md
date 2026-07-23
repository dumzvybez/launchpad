---
slug: angular-routing-navigation
id: angular-07
track: angular
order: 7
title: Routing and Navigation
description: Configure the router with `provideRouter`, define routes (lazy and eager), navigate via `routerLink` and the `Router` service, and read route params with `ActivatedRoute`.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=180s
whyItMatters: Configure the router with `provideRouter`, define routes (lazy and eager), navigate via `routerLink` and the `Router` service, and read route params with `ActivatedRoute`.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Routing and Navigation

## Routing and Navigation

### Why It Matters

Configure the router with `provideRouter`, define routes (lazy and eager), navigate via `routerLink` and the `Router` service, and read route params with `ActivatedRoute`.

Configure the router with `provideRouter`, define routes (lazy and eager), navigate via `routerLink` and the `Router` service, and read route params with `ActivatedRoute`.

### Prerequisites

- Stage 6: Services and Dependency Injection (you can write injectable services).
- Comfort with URLs, query strings, and SPA navigation concepts.

### Topics

- `provideRouter(routes, withInMemoryScrolling, withComponentInputBinding)` in main.ts
- Route configuration: `path`, `component`, `loadComponent`, `children`, `redirectTo`
- Lazy loading: `loadComponent` for standalone components, `loadChildren` for sub-routes
- `<router-outlet>` and nested routes
- `routerLink`, `routerLinkActive`, and `routerLinkActiveOptions`
- Programmatic navigation: `router.navigate` and `router.navigateByUrl`
- Reading params: `route.paramMap`, `route.queryParamMap`, route data
- `withComponentInputBinding` to bind route params to component inputs
- Router events, navigation extras (`queryParamsHandling`, `state`)

### Key Concepts

- Modern Angular prefers `loadComponent` (lazy standalone) over `loadChildren` (lazy NgModule)
- `withComponentInputBinding()` lets you bind `:id` params to signal inputs without `ActivatedRoute`
- `provideRouter` is functional — features like scrolling, preloading, and debug tracing are toggled via `with*()` functions
- `routerLinkActive="active"` toggles a CSS class when the link's route matches
- The router emits events (`NavigationStart`, `NavigationEnd`, `NavigationCancel`) you can subscribe to for loading bars

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
  { path: 'users/:id', loadComponent: () => import('./user/user-detail.component').then((m) => m.UserDetailComponent) },
  { path: 'settings', loadChildren: () => import('./settings/settings.routes').then((m) => m.SETTINGS_ROUTES) },
  { path: '**', loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent) },
];

// src/main.ts
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
  ],
});
```
Caption: provideRouter with lazy routes

### Common Pitfalls

- Forgetting `provideRouter(routes)` in `main.ts` — `<router-outlet>` silently renders nothing; check the providers list.
- Lazy-loading with `loadChildren` and returning a `Routes` array from the file — the file must `export default Routes` or you must `.then((m) => m.ROUTES)`.
- Mixing `routerLink="/users/{{ id }}"` interpolation with `[routerLink]` — interpolation works but `[routerLink]="['/users', id()]"` is safer and supports arrays.
- Using `route.snapshot.paramMap` for values that can change without a re-mount — use `route.paramMap` (Observable) or signal inputs (with `withComponentInputBinding`).
- Not adding `path: '**'` for a 404 catch-all — unknown URLs leave the user on a blank page; always define a fallback.

### Real-World Applications

- Google Ads' deep link structure (`/campaigns/:cid/adgroups/:aid/ads/:adid`) uses nested lazy routes for fast first paint on the campaign list.
- Upwork's job detail page lazy-loads `JobDetailComponent` only when a user clicks a job, keeping the initial bundle small.
- PayPal's transaction flow uses `withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })` so back-button navigation restores scroll position.
- Microsoft Office Online uses `withComponentInputBinding()` to pass `:fileId` to the editor component as a signal input.

### Interview Questions

- 1. What's the difference between `loadComponent` and `loadChildren`? — `loadComponent` lazy-loads a single standalone component; `loadChildren` lazy-loads a route config (array or NgModule) for sub-routes.
- 2. What does `withComponentInputBinding()` do? — Binds route params, query params, and data to matching component inputs/signals — no `ActivatedRoute` needed.
- 3. How do you lazy-load a route? — Use `loadComponent: () => import('./x.component').then(m => m.XComponent)` (or `loadChildren` for sub-routes); the CLI splits it into a separate chunk.
- 4. When would you use `routerLinkActiveOptions: { exact: true }`? — On the home route (`/`) to prevent it from being "active" on every URL (which all start with `/`).
- 5. How does the router pass opaque state to a navigated component? — Via `NavigationExtras.state`; the target reads `window.history.state` (or `Router.getCurrentNavigation().extras.state` synchronously in the constructor).

### Mini Project

Build a multi-page "Docs site" router: A small app with home, docs (nested with sub-routes for `intro`, `guide`, `api`), and a 404 page. Add a sidebar with active-link highlighting and use `withComponentInputBinding` to read a `:section` param into the docs component. Suggested approach:
  - Define `routes` with lazy `loadComponent` for each page
  - Add nested children under `/docs` for `intro`, `guide`, `api`
  - Provide `provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling(...))`
  - Use `routerLinkActive="active"` for nav highlighting
  - Read the `section` input signal in the docs component to render the right content

### Exercises

1. Configure three lazy routes (`/`, `/about`, `/contact`) and navigate between them with `routerLink`.
2. Add a `/users/:id` route and read `id` as a signal input in the component (enable `withComponentInputBinding`).
3. Add a `path: '**'` catch-all that redirects to `/` with `redirectTo`.
4. Use `router.navigate(['/search'], { queryParams: { q: 'angular' } })` and read the `q` param in the component.
5. Subscribe to `Router.events` and log `NavigationStart`/`NavigationEnd` to the console.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which function configures the Angular router in a standalone app?
9. A) RouterModule.forRoot(routes)
10. B) Router.configure(routes)
11. C) provideRouter(routes) (*)
12. D) bootstrapRouter(routes)
13. Explanation: `provideRouter(routes, ...features)` is the functional provider for standalone apps; `RouterModule.forRoot` was the NgModule-era equivalent.
14. Q2: Which lazy-loading API loads a single standalone component?
15. A) loadChildren
16. B) lazyComponent
17. C) importComponent
18. D) loadComponent (*)
19. Explanation: `loadComponent: () => import('./x').then(m => m.XComponent)` lazy-loads one standalone component as its own chunk; `loadChildren` is for sub-route configs.
20. Q3: What does `withComponentInputBinding()` enable?
21. A) Binding route params/query params/data to component inputs (*)
22. B) Two-way binding on components
23. C) Auto-importing components
24. D) Form binding
25. Explanation: With this feature, a `:id` route param automatically populates an `id = input()` on the routed component — no `ActivatedRoute` needed.
26. Q4: Which directive marks where the router renders the active component?
27. A) <router-view>
28. B) <router-outlet> (*)
29. C) <ng-router>
30. D) <route-outlet>
31. Explanation: `<router-outlet>` is the placeholder where Angular inserts the matched route component; nested outlets render child routes.
32. Q5: Which directive toggles a CSS class when its link's route is active?
33. A) routerLink
34. B) routerActive
35. C) routerLinkActive (*)
36. D) [active]
37. Explanation: `routerLinkActive="active"` applies the `active` class when the link's target matches the current URL; `routerLinkActiveOptions` controls matching strictness.
38. Q6: What's the recommended way to read a route param that can change while the component is mounted?
39. A) route.snapshot.paramMap.get('id') — once in ngOnInit
40. B) window.location.href
41. C) localStorage
42. D) route.paramMap (Observable) or withComponentInputBinding signal input (*)
43. Explanation: Snapshot only captures the first value; subscribe to `route.paramMap` or use signal inputs (with `withComponentInputBinding`) to react to param changes.
44. Q7: Which `routerLinkActiveOptions` value prevents `/` from being "active" on every URL?
45. A) { exact: true } (*)
46. B) { strict: true }
47. C) { match: 'exact' }
48. D) { first: true }
49. Explanation: `{ exact: true }` requires the URL to match the link exactly, so `/` is active only on the root path, not on `/users` etc.
50. Q8: How do you pass opaque state (not in URL) on navigation?
51. A) As a query param
52. B) Via NavigationExtras.state (*)
53. C) Via route data
54. D) Via localStorage only
55. Explanation: `router.navigate(['/x'], { state: { source: 'menu' } })` carries state read via `window.history.state` (synchronously in the target constructor).
56. Q9: Which is the correct catch-all route for a 404 page?
57. A) { path: '404', component: NotFound }
58. B) { path: '*', component: NotFound }
59. C) { path: '**', component: NotFound } (*)
60. D) { path: 'unknown', component: NotFound }
61. Explanation: The wildcard `**` matches any URL not matched above it; place it last in the routes array.
62. Q10: Which provider toggles scroll-position restoration on back/forward?
63. A) withScrollRestoration
64. B) provideScrollRestore()
65. C) withRouterScroll
66. D) withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) (*)
67. Explanation: `withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })` restores the previous scroll position on back/forward navigation; pass `'top'` to always scroll to top.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which function configures the Angular router in a standalone app?
  options:
    - RouterModule.forRoot(routes)
    - Router.configure(routes)
    - provideRouter(routes)
    - bootstrapRouter(routes)
  correctIndex: 2
  explanation: "`provideRouter(routes, ...features)` is the functional provider for standalone apps; `RouterModule.forRoot` was the NgModule-era equivalent."
- id: q2
  question: Which lazy-loading API loads a single standalone component?
  options:
    - loadChildren
    - lazyComponent
    - importComponent
    - loadComponent
  correctIndex: 3
  explanation: "`loadComponent: () => import('./x').then(m => m.XComponent)` lazy-loads one standalone component as its own chunk; `loadChildren` is for sub-route configs."
- id: q3
  question: What does `withComponentInputBinding()` enable?
  options:
    - Binding route params/query params/data to component inputs
    - Two-way binding on components
    - Auto-importing components
    - Form binding
  correctIndex: 0
  explanation: With this feature, a `:id` route param automatically populates an `id = input()` on the routed component — no `ActivatedRoute` needed.
- id: q4
  question: Which directive marks where the router renders the active component?
  options:
    - <router-view>
    - <router-outlet>
    - <ng-router>
    - <route-outlet>
  correctIndex: 1
  explanation: "`<router-outlet>` is the placeholder where Angular inserts the matched route component; nested outlets render child routes."
- id: q5
  question: Which directive toggles a CSS class when its link's route is active?
  options:
    - routerLink
    - routerActive
    - routerLinkActive
    - "[active]"
  correctIndex: 2
  explanation: "`routerLinkActive=\"active\"` applies the `active` class when the link's target matches the current URL; `routerLinkActiveOptions` controls matching strictness."
- id: q6
  question: What's the recommended way to read a route param that can change while the component is mounted?
  options:
    - route.snapshot.paramMap.get('id') — once in ngOnInit
    - window.location.href
    - localStorage
    - route.paramMap (Observable) or withComponentInputBinding signal input
  correctIndex: 3
  explanation: Snapshot only captures the first value; subscribe to `route.paramMap` or use signal inputs (with `withComponentInputBinding`) to react to param changes.
- id: q7
  question: Which `routerLinkActiveOptions` value prevents `/` from being "active" on every URL?
  options:
    - "{ exact: true }"
    - "{ strict: true }"
    - "{ match: 'exact' }"
    - "{ first: true }"
  correctIndex: 0
  explanation: "`{ exact: true }` requires the URL to match the link exactly, so `/` is active only on the root path, not on `/users` etc."
- id: q8
  question: How do you pass opaque state (not in URL) on navigation?
  options:
    - on navigation?
    - As a query param
    - Via NavigationExtras.state
    - Via route data
    - Via localStorage only
  correctIndex: 2
  explanation: "`router.navigate(['/x'], { state: { source: 'menu' } })` carries state read via `window.history.state` (synchronously in the target constructor)."
- id: q9
  question: Which is the correct catch-all route for a 404 page?
  options:
    - "{ path: '404', component: NotFound }"
    - "{ path: '*', component: NotFound }"
    - "{ path: '**', component: NotFound }"
    - "{ path: 'unknown', component: NotFound }"
  correctIndex: 2
  explanation: The wildcard `**` matches any URL not matched above it; place it last in the routes array.
- id: q10
  question: Which provider toggles scroll-position restoration on back/forward?
  options:
    - withScrollRestoration
    - provideScrollRestore()
    - withRouterScroll
    - "withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })"
  correctIndex: 3
  explanation: "`withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })` restores the previous scroll position on back/forward navigation; pass `'top'` to always scroll to top."
```

