---
slug: angular-httpclient-observables
id: angular-08
track: angular
order: 8
title: HttpClient and Observables
description: Configure `HttpClient` with `provideHttpClient`, make typed GET/POST/PUT/DELETE calls, handle errors, and unwrap responses in templates with the `async` pipe.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=210s
whyItMatters: Configure `HttpClient` with `provideHttpClient`, make typed GET/POST/PUT/DELETE calls, handle errors, and unwrap responses in templates with the `async` pipe.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# HttpClient and Observables

## HttpClient and Observables

### Why It Matters

Configure `HttpClient` with `provideHttpClient`, make typed GET/POST/PUT/DELETE calls, handle errors, and unwrap responses in templates with the `async` pipe.

Configure `HttpClient` with `provideHttpClient`, make typed GET/POST/PUT/DELETE calls, handle errors, and unwrap responses in templates with the `async` pipe.

### Prerequisites

- Stage 7: Routing and Navigation (you understand lazy routes and DI).
- Basic familiarity with HTTP methods, status codes, and JSON APIs.
- Introductory RxJS: `Observable`, `subscribe`, `next`/`error`/`complete`.

### Topics

- `provideHttpClient(withInterceptorsFromDi(), withFetch())` setup
- `inject(HttpClient).get<T>(url)`, `post`, `put`, `patch`, `delete`
- Typed responses and `HttpContextToken` for per-request config
- Error handling with `catchError`, `retry`, `throwError`
- `withFetch()` vs XMLHttpRequest backend
- Reading response headers/metadata via `{ observe: 'response' }`
- AsyncPipe unwrap in templates; `toSignal()` for signal-based views
- Avoiding double-subscription with `shareReplay`

### Key Concepts

- `HttpClient` methods are cold — the request fires only on `subscribe()` (or `toSignal`/`async` pipe)
- `provideHttpClient(withFetch())` switches to the modern `fetch` backend (smaller bundle, streaming)
- `withInterceptorsFromDi()` enables class-based interceptors; modern code uses `withInterceptors([fn])` (Stage 12)
- AsyncPipe subscribes once, renders the latest value, and unsubscribes on destroy
- `toSignal(observable$)` is the bridge from RxJS to signals — but requires an initial value or `requireSync`

```typescript
// src/main.ts
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi())],
});

// src/app/users/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User { id: number; name: string; email: string; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = '/api/users';

  getUsers() {
    return this.http.get<User[]>(this.baseUrl);
  }
  getUser(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  create(payload: Omit<User, 'id'>) {
    return this.http.post<User>(this.baseUrl, payload);
  }
}
```
Caption: HttpClient setup and a typed GET

### Common Pitfalls

- Subscribing in the component and never unsubscribing — leaks the subscription and the request; use AsyncPipe or `toSignal()` to handle teardown automatically.
- Treating `http.get` as a Promise and calling `.then()` — it returns an Observable; convert with `firstValueFrom(observable$)` if you really need a Promise.
- Calling `getUsers()` in a method that re-fires on every change detection — wrap in a `computed()` or memoize; otherwise the request re-runs constantly.
- Using `withInterceptorsFromDi()` and class-based interceptors in new code — prefer `withInterceptors([fn])` functional interceptors (covered in Stage 12).
- Forgetting `withFetch()` — the default XMLHttpRequest backend is larger and doesn't support streaming; `fetch` is the modern default.

### Real-World Applications

- Google Pay's merchant API client uses typed `HttpClient.get<Transaction[]>` with retry and exponential backoff for the transaction list.
- Upwork's job search service uses `shareReplay(1)` on the search Observable so multiple components share one network call per query.
- PayPal uses functional interceptors (`withInterceptors([authInterceptor, errorInterceptor])`) to attach JWTs and normalize errors.
- Deutsche Bahn's connection lookup uses `toSignal()` to feed connection results into a `computed()` UI state, replacing the older BehaviorSubject pattern.

### Interview Questions

- 1. Is `http.get()` hot or cold? — Cold; the request fires only when subscribed (or unwrapped via AsyncPipe/toSignal); each subscribe re-fires.
- 2. What does `provideHttpClient(withFetch())` do? — Switches the backend from XMLHttpRequest to the Fetch API, enabling smaller bundles and streaming responses.
- 3. How do you prevent duplicate HTTP calls when multiple components need the same data? — `shareReplay({ bufferSize: 1, refCount: true })` caches the latest emission for late subscribers.
- 4. What's the difference between `observe: 'body'` (default), `'response'`, and `'events'`? — `'body'` returns just the parsed body; `'response'` returns the full `HttpResponse` (headers, status); `'events'` streams progress events for uploads/downloads.
- 5. How do you convert an Observable to a signal? — `toSignal(observable$, { initialValue })` from `@angular/core/rxjs-interop`; throws if no initial value and the source isn't synchronous.

### Mini Project

Build a "GitHub User Search" widget: A search input that debounces keystrokes (300ms) and calls GitHub's public API (`https://api.github.com/users/:user`) to show the user's avatar, name, and bio. Use `toSignal` to unwrap the response and show loading/error states. Suggested approach:
  - Create `github.service.ts` injecting `HttpClient`
  - Use RxJS `debounceTime(300)` and `switchMap` to cancel stale requests
  - Convert the resulting Observable to a signal with `toSignal`
  - Render states with `@if`/`@else if`/`@else` for loading/error/success
  - Add a `try again` button on error that re-fires the request

### Exercises

1. Configure `provideHttpClient(withFetch())` in main.ts and verify a GET request works.
2. Make a typed `http.get<User[]>(...)` call and render the list with `async` pipe.
3. Add `retry(2)` and `catchError` to handle a failing endpoint gracefully.
4. Convert an Observable-based property to use `toSignal()` with an initial value.
5. Use `shareReplay(1)` to share one HTTP call between two component instances.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which provider configures HttpClient in a standalone app?
9. A) HttpClientModule
10. B) provideHttp
11. C) HttpInterceptor
12. D) provideHttpClient (*)
13. Explanation: `provideHttpClient(...features)` is the functional provider for standalone apps; `HttpClientModule` was the NgModule-era equivalent.
14. Q2: Which function enables the Fetch backend?
15. A) withFetch() (*)
16. B) useFetch()
17. C) withBackend('fetch')
18. D) provideFetch()
19. Explanation: `withFetch()` switches HttpClient from XMLHttpRequest to the Fetch API, reducing bundle size and enabling streaming.
20. Q3: When does an HttpClient Observable fire the HTTP request?
21. A) Immediately when `http.get(...)` is called
22. B) When subscribed (or unwrapped via async/toSignal) (*)
23. C) On route change
24. D) On component init only
25. Explanation: HttpClient methods return cold Observables; the request fires only on subscription, and each subscribe re-fires unless shared.
26. Q4: Which operator caches the latest emission for late subscribers?
27. A) share
28. B) replay
29. C) shareReplay (*)
30. D) cache
31. Explanation: `shareReplay({ bufferSize: 1, refCount: true })` multicasts the source and replays the last value to new subscribers, avoiding duplicate HTTP calls.
32. Q5: Which RxJS utility converts an Observable to a signal?
33. A) signalFromObservable
34. B) signalOf
35. C) observableSignal
36. D) toSignal (*)
37. Explanation: `toSignal(observable$, { initialValue })` from `@angular/core/rxjs-interop` bridges RxJS to signals; throws if no initial value and the source isn't sync.
38. Q6: Which `observe` option returns the full HttpResponse with headers and status?
39. A) 'response' (*)
40. B) 'body'
41. C) 'events'
42. D) 'full'
43. Explanation: `{ observe: 'response' }` returns the `HttpResponse<T>` with headers, status, and body; `'body'` (default) returns just the body, `'events'` streams progress.
44. Q7: Which operator retries a failed request a fixed number of times?
45. A) repeat
46. B) retry (*)
47. C) restart
48. D) again
49. Explanation: `retry({ count: 2, delay: 500 })` re-subscribes up to 2 times with a 500ms delay; `repeat` re-subscribes on successful completion instead.
50. Q8: Which AsyncPipe behavior is TRUE?
51. A) It subscribes once and never unsubscribes
52. B) It returns the Observable itself
53. C) It subscribes, returns the latest value, and unsubscribes on destroy (*)
54. D) It auto-converts to a Promise
55. Explanation: AsyncPipe handles subscription, value caching, and unsubscription, eliminating the need for manual `subscribe`/`ngOnDestroy`.
56. Q9: How do you convert an Observable to a Promise for a one-shot await?
57. A) observable.toPromise() (deprecated)
58. B) await observable
59. C) Promise.from(observable)
60. D) firstValueFrom(observable) (*)
61. Explanation: `firstValueFrom(observable$)` from RxJS returns a Promise that resolves with the first emission; `toPromise()` is deprecated in modern RxJS.
62. Q10: Which is the recommended interceptor style in Angular 17+?
63. A) Functional interceptors with withInterceptors([fn]) (*)
64. B) Class-based HttpInterceptor with withInterceptorsFromDi()
65. C) Provider interceptors with useClass
66. D) ngOnInit-based interceptors
67. Explanation: `withInterceptors([authInterceptor, errorInterceptor])` accepts functional interceptors (HttpInterceptorFn), which are tree-shakable and easier to test than class-based ones.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which provider configures HttpClient in a standalone app?
  options:
    - HttpClientModule
    - provideHttp
    - HttpInterceptor
    - provideHttpClient
  correctIndex: 3
  explanation: "`provideHttpClient(...features)` is the functional provider for standalone apps; `HttpClientModule` was the NgModule-era equivalent."
- id: q2
  question: Which function enables the Fetch backend?
  options:
    - withFetch()
    - useFetch()
    - withBackend('fetch')
    - provideFetch()
  correctIndex: 0
  explanation: "`withFetch()` switches HttpClient from XMLHttpRequest to the Fetch API, reducing bundle size and enabling streaming."
- id: q3
  question: When does an HttpClient Observable fire the HTTP request?
  options:
    - Immediately when `http.get(...)` is called
    - When subscribed (or unwrapped via async/toSignal)
    - On route change
    - On component init only
  correctIndex: 1
  explanation: HttpClient methods return cold Observables; the request fires only on subscription, and each subscribe re-fires unless shared.
- id: q4
  question: Which operator caches the latest emission for late subscribers?
  options:
    - share
    - replay
    - shareReplay
    - cache
  correctIndex: 2
  explanation: "`shareReplay({ bufferSize: 1, refCount: true })` multicasts the source and replays the last value to new subscribers, avoiding duplicate HTTP calls."
- id: q5
  question: Which RxJS utility converts an Observable to a signal?
  options:
    - signalFromObservable
    - signalOf
    - observableSignal
    - toSignal
  correctIndex: 3
  explanation: "`toSignal(observable$, { initialValue })` from `@angular/core/rxjs-interop` bridges RxJS to signals; throws if no initial value and the source isn't sync."
- id: q6
  question: Which `observe` option returns the full HttpResponse with headers and status?
  options:
    - "'response'"
    - "'body'"
    - "'events'"
    - "'full'"
  correctIndex: 0
  explanation: "`{ observe: 'response' }` returns the `HttpResponse<T>` with headers, status, and body; `'body'` (default) returns just the body, `'events'` streams progress."
- id: q7
  question: Which operator retries a failed request a fixed number of times?
  options:
    - repeat
    - retry
    - restart
    - again
  correctIndex: 1
  explanation: "`retry({ count: 2, delay: 500 })` re-subscribes up to 2 times with a 500ms delay; `repeat` re-subscribes on successful completion instead."
- id: q8
  question: Which AsyncPipe behavior is TRUE?
  options:
    - It subscribes once and never unsubscribes
    - It returns the Observable itself
    - It subscribes, returns the latest value, and unsubscribes on destroy
    - It auto-converts to a Promise
  correctIndex: 2
  explanation: AsyncPipe handles subscription, value caching, and unsubscription, eliminating the need for manual `subscribe`/`ngOnDestroy`.
- id: q9
  question: How do you convert an Observable to a Promise for a one-shot await?
  options:
    - observable.toPromise() (deprecated)
    - await observable
    - Promise.from(observable)
    - firstValueFrom(observable)
  correctIndex: 3
  explanation: "`firstValueFrom(observable$)` from RxJS returns a Promise that resolves with the first emission; `toPromise()` is deprecated in modern RxJS."
- id: q10
  question: Which is the recommended interceptor style in Angular 17+?
  options:
    - Functional interceptors with withInterceptors([fn])
    - Class-based HttpInterceptor with withInterceptorsFromDi()
    - Provider interceptors with useClass
    - ngOnInit-based interceptors
  correctIndex: 0
  explanation: "`withInterceptors([authInterceptor, errorInterceptor])` accepts functional interceptors (HttpInterceptorFn), which are tree-shakable and easier to test than class-based ones."
```

