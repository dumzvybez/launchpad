---
slug: angular-guards-resolvers-interceptors
id: angular-12
track: angular
order: 12
title: Guards, Resolvers, and Interceptors
description: Use functional route guards (`canActivateFn`), resolvers (`ResolveFn`), and HTTP interceptors (`HttpInterceptorFn`) — the modern, tree-shakable alternatives to class-based equivalents.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=60s
whyItMatters: Use functional route guards (`canActivateFn`), resolvers (`ResolveFn`), and HTTP interceptors (`HttpInterceptorFn`) — the modern, tree-shakable alternatives to class-based equivalents.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Guards, Resolvers, and Interceptors

## Guards, Resolvers, and Interceptors

### Why It Matters

Use functional route guards (`canActivateFn`), resolvers (`ResolveFn`), and HTTP interceptors (`HttpInterceptorFn`) — the modern, tree-shakable alternatives to class-based equivalents.

Use functional route guards (`canActivateFn`), resolvers (`ResolveFn`), and HTTP interceptors (`HttpInterceptorFn`) — the modern, tree-shakable alternatives to class-based equivalents.

### Prerequisites

- Stage 7: Routing and Navigation (you can configure routes and `provideRouter`).
- Stage 8: HttpClient (you've made typed HTTP calls).
- Stage 6: DI (you understand `inject()` and injection contexts).

### Topics

- Functional guards: `canActivateFn`, `canMatchFn`, `canDeactivateFn`, `canActivateChildFn`
- Functional resolvers: `ResolveFn<T>`
- Functional interceptors: `HttpInterceptorFn` registered with `withInterceptors([fn])`
- Chaining and ordering of interceptors
- Reading route data and param maps in guards and resolvers
- Authentication patterns: redirect to login with return URL
- Loading indicators driven by interceptor events
- Error normalization in a global interceptor

### Key Concepts

- Functional guards/resolvers/interceptors are arrow functions using `inject()` — tree-shakable, easier to test, and the modern Angular standard
- Interceptor order matters: they run in registration order on the request and reverse on the response
- `canMatchFn` differs from `canActivateFn` — canMatch gates whether the route config matches (can prevent lazy chunk loading), canActivate gates navigation after matching
- Resolvers pre-fetch data so the component can render synchronously — at the cost of slower navigation
- Guards return `boolean | UrlTree | Observable<boolean | UrlTree> | Promise<...>` — a UrlTree redirects

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], {
    queryParams: { redirect: window.location.pathname },
  });
};

// In routes:
// { path: 'dashboard', canMatch: [authGuard], loadComponent: ... }
```
Caption: Functional auth guard

### Common Pitfalls

- Using class-based `CanActivate` / `HttpInterceptor` in new code — they require `withInterceptorsFromDi()` and aren't tree-shakable; use the `Fn` variants.
- Forgetting interceptor order — the first registered runs first on the request and last on the response; arrange auth → loading → error so auth headers are present before errors are normalized.
- Resolvers blocking navigation for slow APIs — they delay the route activation; for slow endpoints, use a component-side fetch with loading state instead.
- Calling `inject()` inside an interceptor callback (not the function body) — injection context is only active during the synchronous body; capture dependencies outside the `next(req).pipe(...)`.
- Returning `false` from a guard instead of a `UrlTree` — `false` cancels navigation silently with no redirect; return a `UrlTree` to redirect to login.

### Real-World Applications

- Google Ads uses `canMatch` guards to lazy-load admin-only routes only for users with the right role, preventing the chunk from downloading for unauthorized users.
- PayPal's auth interceptor attaches the JWT to every request and redirects to /login on 401, retrying the original request after a successful refresh.
- Upwork uses a resolver to pre-fetch job details so the job page renders without a loading flash on direct links.
- Microsoft Teams uses an error-normalization interceptor to convert backend error codes into user-friendly toast messages.

### Interview Questions

- 1. What's the difference between `canActivate` and `canMatch`? — `canActivate` runs after the route matches; `canMatch` runs before, gating whether the route config is considered (and whether the lazy chunk loads).
- 2. Why prefer functional guards over class-based? — Functional guards (`canActivateFn`) are arrow functions using `inject()` — tree-shakable, easier to test, and don't need DI decorator boilerplate.
- 3. How do you redirect from a guard? — Return a `UrlTree` via `router.createUrlTree(['/login'], { queryParams })`; returning `false` cancels navigation without redirect.
- 4. What's the order of interceptor execution? — Request: registration order (first in, first out); Response: reverse order. Arrange auth first so headers are set before error handling.
- 5. When should you use a resolver vs a component-side fetch? — Resolver for fast endpoints that prevent flash of empty content; component-side fetch for slow endpoints where a loading state is acceptable.

### Mini Project

Build a "Protected Admin Panel": A small app with a `/login` page, an `authGuard` on `/admin/*`, an auth interceptor attaching a JWT (mock), and an error interceptor redirecting to `/login` on 401. Suggested approach:
  - Create `AuthService` with `login()` returning a fake JWT and a `token = signal<string|null>(null)`
  - Write `authGuard: CanActivateFn` redirecting to `/login?redirect=...`
  - Write `authInterceptor` attaching `Authorization: Bearer <token>`
  - Write `errorInterceptor` calling `auth.logout()` on 401
  - Register `withInterceptors([authInterceptor, errorInterceptor])` and add `canMatch: [authGuard]` to `/admin`

### Exercises

1. Write a `CanActivateFn` that checks an `AuthService.isLoggedIn()` signal and redirects to `/login` when false.
2. Write a `ResolveFn<User>` that fetches a user by route param and returns the Observable.
3. Write an `HttpInterceptorFn` that adds an `Authorization` header from an auth signal.
4. Write an interceptor that catches 500 errors and shows a toast via a `ToastService`.
5. Write a `canDeactivateFn` that confirms navigation away from an unsaved form.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which modern API defines a route guard as a function?
9. A) CanActivate class implementing canActivate()
10. B) GuardFunction
11. C) RouteGuard
12. D) CanActivateFn (*)
13. Explanation: `CanActivateFn` is a functional guard — an arrow function using `inject()` that returns `boolean | UrlTree | Observable<...>`; the class-based `CanActivate` is legacy.
14. Q2: What's the difference between canMatch and canActivate?
15. A) canMatch runs before route matching and gates lazy chunk loading; canActivate runs after (*)
16. B) canMatch is for forms only
17. C) canActivate is for guards only
18. D) They are identical
19. Explanation: `canMatch` runs during route matching (and prevents the lazy chunk from loading when false); `canActivate` runs after matching succeeds.
20. Q3: Which function registers functional interceptors?
21. A) withInterceptorsFromDi([fn])
22. B) withInterceptors([fn]) (*)
23. C) provideInterceptors([fn])
24. D) HTTP_INTERCEPTORS multi-provider
25. Explanation: `withInterceptors([authInterceptor, errorInterceptor])` accepts functional `HttpInterceptorFn`s; `withInterceptorsFromDi()` is for legacy class-based interceptors.
26. Q4: What does an HttpInterceptorFn return?
27. A) void
28. B) A Promise
29. C) An Observable<HttpEvent<unknown>> (*)
30. D) A string
31. Explanation: Interceptors return `Observable<HttpEvent<unknown>>` — typically `next(req).pipe(...)`, allowing operators like `catchError` and `finalize` to wrap the response stream.
32. Q5: How do you redirect from a guard?
33. A) Return false
34. B) Throw an error
35. C) Call router.navigate synchronously and return true
36. D) Return a UrlTree via router.createUrlTree(['/login']) (*)
37. Explanation: Returning a `UrlTree` redirects; returning `false` cancels navigation silently. `router.createUrlTree` builds the redirect target with query params.
38. Q6: What's the order of interceptor execution?
39. A) Request: registration order; Response: reverse order (*)
40. B) Random
41. C) Always reverse
42. D) Lexicographic by function name
43. Explanation: First-registered interceptor runs first on the outgoing request and last on the incoming response — arrange auth before error so headers are set first.
44. Q7: Which route property pre-fetches data before the component mounts?
45. A) canMatch
46. B) resolve (*)
47. C) data
48. D) children
49. Explanation: `resolve: { user: userResolver }` calls `ResolveFn<T>` and waits for emission; with `withComponentInputBinding`, the resolved value populates a matching component input.
50. Q8: Where can you safely call `inject()` inside a functional interceptor?
51. A) Inside the catchError callback
52. B) Inside a setTimeout callback
53. C) Anywhere inside the function body (synchronous portion, before next(req).pipe) (*)
54. D) Inside the Observable pipeline operators
55. Explanation: The injection context is active only during the synchronous function body; capture dependencies into variables before piping, then use them inside operators.
56. Q9: Which functional type represents a resolver?
57. A) ResolveClass
58. B) ResolverFunction
59. C) RouteResolver
60. D) ResolveFn<T> (*)
61. Explanation: `ResolveFn<T>` is the functional resolver — an arrow function `(route, state) => Observable<T> | Promise<T> | T`; router waits for resolution before activation.
62. Q10: What's a downside of using resolvers for slow endpoints?
63. A) They block navigation until the data arrives, hurting UX for slow APIs (*)
64. B) They leak memory
65. C) They can't be typed
66. D) They require FormsModule
67. Explanation: Resolvers delay route activation; for slow endpoints, prefer a component-side fetch with a loading state to give the user immediate feedback.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which modern API defines a route guard as a function?
  options:
    - CanActivate class implementing canActivate()
    - GuardFunction
    - RouteGuard
    - CanActivateFn
  correctIndex: 3
  explanation: "`CanActivateFn` is a functional guard — an arrow function using `inject()` that returns `boolean | UrlTree | Observable<...>`; the class-based `CanActivate` is legacy."
- id: q2
  question: What's the difference between canMatch and canActivate?
  options:
    - canMatch runs before route matching and gates lazy chunk loading; canActivate runs after
    - canMatch is for forms only
    - canActivate is for guards only
    - They are identical
  correctIndex: 0
  explanation: "`canMatch` runs during route matching (and prevents the lazy chunk from loading when false); `canActivate` runs after matching succeeds."
- id: q3
  question: Which function registers functional interceptors?
  options:
    - withInterceptorsFromDi([fn])
    - withInterceptors([fn])
    - provideInterceptors([fn])
    - HTTP_INTERCEPTORS multi-provider
  correctIndex: 1
  explanation: "`withInterceptors([authInterceptor, errorInterceptor])` accepts functional `HttpInterceptorFn`s; `withInterceptorsFromDi()` is for legacy class-based interceptors."
- id: q4
  question: What does an HttpInterceptorFn return?
  options:
    - void
    - A Promise
    - An Observable<HttpEvent<unknown>>
    - A string
  correctIndex: 2
  explanation: Interceptors return `Observable<HttpEvent<unknown>>` — typically `next(req).pipe(...)`, allowing operators like `catchError` and `finalize` to wrap the response stream.
- id: q5
  question: How do you redirect from a guard?
  options:
    - Return false
    - Throw an error
    - Call router.navigate synchronously and return true
    - Return a UrlTree via router.createUrlTree(['/login'])
  correctIndex: 3
  explanation: Returning a `UrlTree` redirects; returning `false` cancels navigation silently. `router.createUrlTree` builds the redirect target with query params.
- id: q6
  question: What's the order of interceptor execution?
  options:
    - "Request: registration order; Response: reverse order"
    - Random
    - Always reverse
    - Lexicographic by function name
  correctIndex: 0
  explanation: First-registered interceptor runs first on the outgoing request and last on the incoming response — arrange auth before error so headers are set first.
- id: q7
  question: Which route property pre-fetches data before the component mounts?
  options:
    - canMatch
    - resolve
    - data
    - children
  correctIndex: 1
  explanation: "`resolve: { user: userResolver }` calls `ResolveFn<T>` and waits for emission; with `withComponentInputBinding`, the resolved value populates a matching component input."
- id: q8
  question: Where can you safely call `inject()` inside a functional interceptor?
  options:
    - Inside the catchError callback
    - Inside a setTimeout callback
    - Anywhere inside the function body (synchronous portion, before next(req).pipe)
    - Inside the Observable pipeline operators
  correctIndex: 2
  explanation: The injection context is active only during the synchronous function body; capture dependencies into variables before piping, then use them inside operators.
- id: q9
  question: Which functional type represents a resolver?
  options:
    - ResolveClass
    - ResolverFunction
    - RouteResolver
    - ResolveFn<T>
  correctIndex: 3
  explanation: "`ResolveFn<T>` is the functional resolver — an arrow function `(route, state) => Observable<T> | Promise<T> | T`; router waits for resolution before activation."
- id: q10
  question: What's a downside of using resolvers for slow endpoints?
  options:
    - They block navigation until the data arrives, hurting UX for slow APIs
    - They leak memory
    - They can't be typed
    - They require FormsModule
  correctIndex: 0
  explanation: Resolvers delay route activation; for slow endpoints, prefer a component-side fetch with a loading state to give the user immediate feedback.
```

