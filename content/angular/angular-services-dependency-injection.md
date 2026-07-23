---
slug: angular-services-dependency-injection
id: angular-06
track: angular
order: 6
title: Services and Dependency Injection
description: Author injectable services with `providedIn`, understand Angular's hierarchical injector tree, and use the modern `inject()` function for concise DI.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=150s
whyItMatters: Author injectable services with `providedIn`, understand Angular's hierarchical injector tree, and use the modern `inject()` function for concise DI.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Services and Dependency Injection

## Services and Dependency Injection

### Why It Matters

Author injectable services with `providedIn`, understand Angular's hierarchical injector tree, and use the modern `inject()` function for concise DI.

Author injectable services with `providedIn`, understand Angular's hierarchical injector tree, and use the modern `inject()` function for concise DI.

### Prerequisites

- Stage 5: Pipes (you can build standalone components and directives).
- Basic TypeScript: classes, generics, and decorators.

### Topics

- `@Injectable({ providedIn: 'root' })` for tree-shakable singletons
- The `inject()` function vs constructor injection
- Hierarchical injectors: root, platform, component-level, element-level
- Providers: `useClass`, `useValue`, `useExisting`, `useFactory`
- Multi-providers and `InjectionToken<T>`
- `EnvironmentInjector` and `runInInjectionContext`
- `providedIn: 'any'` vs `'root'` vs `'platform'`
- Optional injection: `inject(TOKEN, { optional: true })`
- Forward references and circular dependency handling

### Key Concepts

- Angular DI is hierarchical — child injectors fall back to parents, allowing component-scoped overrides
- `providedIn: 'root'` lazy singletons are tree-shaken if never injected (unlike NgModule providers)
- `inject()` must be called in an injection context (constructor, field initializer, or factory); calling outside throws
- Injection tokens carry types where classes can't (interfaces, primitives, third-party values)
- `useFactory` providers can compose other dependencies via `deps: [...]` or call `inject()` directly

```typescript
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private count = 0;
  increment() { return ++this.count; }
  reset() { this.count = 0; }
  get value() { return this.count; }
}

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `<button (click)="add()">+1 ({{ svc.value }})</button>`,
})
export class CounterComponent {
  // Modern inject() — preferred over constructor params
  svc = inject(CounterService);
  add() { this.svc.increment(); }
}
```
Caption: Basic service with providedIn root

### Common Pitfalls

- Using `inject()` outside an injection context (e.g. inside a `setTimeout` callback) — it throws NG0203; capture the value in a field first, then use the field.
- Declaring `providedIn: 'root'` on a service that should be component-scoped — root singletons leak state across the whole app; use `providers: [...]` on the component instead.
- Creating circular dependencies between two services (`A` injects `B`, `B` injects `A`) — Angular throws NG200; break the cycle with `forwardRef` or refactor to events.
- Forgetting `multi: true` on a second provider for the same token — the second provider silently overwrites the first instead of adding to the array.
- Calling `inject(SomeToken, { optional: true })` and assuming it's defined — optional returns `null`, which can cause null-reference errors downstream if not guarded.

### Real-World Applications

- Google Ads injects a single `CampaignService` (providedIn root) shared across 50+ components, all reading the same in-memory cache.
- PayPal uses a multi-provider token `ERROR_HANDLER` to plug in Sentry, Datadog, and an in-app toast handler at runtime.
- Microsoft Teams uses component-level providers to inject a per-chat `ChatService` that's torn down when the chat panel closes.
- Upwork uses a `SessionService` factory that injects different implementations (`GuestSession` vs `AuthSession`) based on auth state.

### Interview Questions

- 1. What does `providedIn: 'root'` mean? — A root-scoped singleton lazily created on first inject and tree-shaken if never used; the modern replacement for NgModule providers.
- 2. Why prefer `inject()` over constructor injection? — It's shorter, works in field initializers, supports `optional`/`skipSelf` flags, and reads top-to-bottom like any other code.
- 3. What's an `InjectionToken` and when do you need one? — A typed, runtime-stable key for non-class values (interfaces, configs, third-party objects) where you can't use a class as the token.
- 4. What's the difference between `providedIn: 'root'` and `providedIn: 'any'`? — `'root'` = one shared singleton per app; `'any'` = one lazy instance per module injector that imports it (rarely needed in standalone apps).
- 5. How does Angular's hierarchical injector work? — Each component/directive has its own injector; resolution walks up the tree (element → parent elements → component → module → root → platform); the first match wins.

### Mini Project

Build a "Theme Service" with DI: A `ThemeService` (providedIn root) that exposes `theme = signal<'light' | 'dark'>('light')` and persists to localStorage. Provide a `ThemeToggleComponent` that injects and toggles it, and a `[appThemed]` attribute directive that reads the service to set `data-theme` on its host. Suggested approach:
  - Create `theme.service.ts` with `@Injectable({ providedIn: 'root' })`
  - Initialize `theme` from `localStorage.getItem('theme')` in a constructor
  - Use `effect()` to write back to localStorage on change
  - Build `ThemeToggleComponent` that calls `theme.set(...)` on click
  - Create `ThemedDirective` that uses `effect()` to update the host's `data-theme` attribute

### Exercises

1. Create a `LoggerService` with `providedIn: 'root'` and inject it into two components; verify it's the same instance.
2. Add a component-level `providers: [{ provide: LoggerService, useClass: MockLogger }]` and verify the override is local.
3. Define an `APP_CONFIG` InjectionToken and provide it from `main.ts` with `useValue`.
4. Convert a constructor-injected service to use `inject()` and confirm behavior is unchanged.
5. Create a `useFactory` provider that reads from a `window`-injected config and returns a base URL string.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which decorator marks a class as an injectable Angular service?
9. A) @Service
10. B) @Injectable (*)
11. C) @Provider
12. D) @Inject
13. Explanation: `@Injectable({ providedIn })` marks a service for DI; the `providedIn` option replaces NgModule registration.
14. Q2: What does `providedIn: 'root'` produce?
15. A) One instance per component
16. B) A new instance per injection site
17. C) One tree-shakable singleton per app (*)
18. D) A platform-level singleton across multiple apps
19. Explanation: Root-provided services are lazily instantiated once per app and tree-shaken if never injected, making them the modern default.
20. Q3: Which modern function does Angular recommend for dependency injection?
21. A) constructor(private svc: Service)
22. B) Reflect.getMetadata
23. C) Injector.resolveAndCreate
24. D) inject(Service) called in an injection context (*)
25. Explanation: `inject()` is the modern API: concise, works in field initializers, and supports `optional`/`skipSelf` flags; constructor params remain supported but are more verbose.
26. Q4: When does `inject()` throw NG0203?
27. A) When called outside an injection context (e.g. inside setTimeout) (*)
28. B) When the token isn't registered
29. C) When the service is providedIn root
30. D) When the service is a singleton
31. Explanation: `inject()` requires an injection context (constructor, field initializer, or factory); calling it elsewhere throws NG0203.
32. Q5: Which provider option replaces one class with another (e.g. for tests)?
33. A) useValue
34. B) useClass (*)
35. C) useExisting
36. D) useFactory
37. Explanation: `useClass: MockService` instantiates the given class for the token, useful for swapping implementations per component or in tests.
38. Q6: Which token type is needed for non-class values like configs?
39. A) ClassToken
40. B) StringToken
41. C) InjectionToken<T> (*)
42. D) ProviderToken
43. Explanation: `InjectionToken<T>` carries a type for interfaces, primitives, and third-party values that don't have a class to serve as the token.
44. Q7: What does `multi: true` on a provider do?
45. A) Creates multiple instances of the same service
46. B) Causes a circular dependency
47. C) Disables tree-shaking
48. D) Appends to an array of providers for the same token (*)
49. Explanation: Multi-providers extend an array (`inject(TOKEN)` returns `T[]`); used for plugin systems, handlers, and validators.
50. Q8: What is the Angular injector hierarchy resolution order?
51. A) Element → parent elements → component → module → root → platform (*)
52. B) Module → Component → Root
53. C) Root → Module → Component
54. D) Random order
55. Explanation: Angular walks up from the element injector through parents to the component, then environment/module injectors, then root and platform; first match wins.
56. Q9: What does `inject(TOKEN, { optional: true })` return when the token isn't provided?
57. A) Throws NG0201
58. B) Returns null (without throwing) (*)
59. C) Returns undefined
60. D) Returns the token's default
61. Explanation: Optional injection returns `null` when unprovided, letting the consumer guard with `??`; required injection throws NG0201.
62. Q10: Which provider runs a function to compute the value, with access to `inject()` inside?
63. A) useClass
64. B) useValue
65. C) useFactory (*)
66. D) useExisting
67. Explanation: `useFactory: () => ...` runs at inject time and can call `inject()` to compose other dependencies dynamically.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which decorator marks a class as an injectable Angular service?
  options:
    - "@Service"
    - "@Injectable"
    - "@Provider"
    - "@Inject"
  correctIndex: 1
  explanation: "`@Injectable({ providedIn })` marks a service for DI; the `providedIn` option replaces NgModule registration."
- id: q2
  question: "What does `providedIn: 'root'` produce?"
  options:
    - One instance per component
    - A new instance per injection site
    - One tree-shakable singleton per app
    - A platform-level singleton across multiple apps
  correctIndex: 2
  explanation: Root-provided services are lazily instantiated once per app and tree-shaken if never injected, making them the modern default.
- id: q3
  question: Which modern function does Angular recommend for dependency injection?
  options:
    - "constructor(private svc: Service)"
    - Reflect.getMetadata
    - Injector.resolveAndCreate
    - inject(Service) called in an injection context
  correctIndex: 3
  explanation: "`inject()` is the modern API: concise, works in field initializers, and supports `optional`/`skipSelf` flags; constructor params remain supported but are more verbose."
- id: q4
  question: When does `inject()` throw NG0203?
  options:
    - When called outside an injection context (e.g. inside setTimeout)
    - When the token isn't registered
    - When the service is providedIn root
    - When the service is a singleton
  correctIndex: 0
  explanation: "`inject()` requires an injection context (constructor, field initializer, or factory); calling it elsewhere throws NG0203."
- id: q5
  question: Which provider option replaces one class with another (e.g. for tests)?
  options:
    - useValue
    - useClass
    - useExisting
    - useFactory
  correctIndex: 1
  explanation: "`useClass: MockService` instantiates the given class for the token, useful for swapping implementations per component or in tests."
- id: q6
  question: Which token type is needed for non-class values like configs?
  options:
    - ClassToken
    - StringToken
    - InjectionToken<T>
    - ProviderToken
  correctIndex: 2
  explanation: "`InjectionToken<T>` carries a type for interfaces, primitives, and third-party values that don't have a class to serve as the token."
- id: q7
  question: "What does `multi: true` on a provider do?"
  options:
    - Creates multiple instances of the same service
    - Causes a circular dependency
    - Disables tree-shaking
    - Appends to an array of providers for the same token
    - "` returns `T[]`); used for plugin systems, handlers, and validators."
  correctIndex: 3
  explanation: Multi-providers extend an array (`inject(TOKEN)` returns `T[]`); used for plugin systems, handlers, and validators.
- id: q8
  question: What is the Angular injector hierarchy resolution order?
  options:
    - Element → parent elements → component → module → root → platform
    - Module → Component → Root
    - Root → Module → Component
    - Random order
  correctIndex: 0
  explanation: Angular walks up from the element injector through parents to the component, then environment/module injectors, then root and platform; first match wins.
- id: q9
  question: "What does `inject(TOKEN, { optional: true })` return when the token isn't provided?"
  options:
    - Throws NG0201
    - Returns null (without throwing)
    - Returns undefined
    - Returns the token's default
  correctIndex: 1
  explanation: Optional injection returns `null` when unprovided, letting the consumer guard with `??`; required injection throws NG0201.
- id: q10
  question: Which provider runs a function to compute the value, with access to `inject()` inside?
  options:
    - useClass
    - useValue
    - useFactory
    - useExisting
  correctIndex: 2
  explanation: "`useFactory: () => ...` runs at inject time and can call `inject()` to compose other dependencies dynamically."
```

