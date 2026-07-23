---
slug: angular-change-detection-onpush-default-async-pipe
id: angular-13
track: angular
order: 13
title: Change Detection — OnPush, Default, Async Pipe
description: Understand Angular's change detection tree, configure `ChangeDetectionStrategy.OnPush`, use the `async` pipe and signals to minimize CD cycles, and debug CD storms.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=120s
whyItMatters: Understand Angular's change detection tree, configure `ChangeDetectionStrategy. OnPush`, use the `async` pipe and signals to minimize CD cycles, and debug CD storms.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Change Detection — OnPush, Default, Async Pipe

## Change Detection — OnPush, Default, Async Pipe

### Why It Matters

Understand Angular's change detection tree, configure `ChangeDetectionStrategy. OnPush`, use the `async` pipe and signals to minimize CD cycles, and debug CD storms.

Understand Angular's change detection tree, configure `ChangeDetectionStrategy.OnPush`, use the `async` pipe and signals to minimize CD cycles, and debug CD storms.

### Prerequisites

- Stage 8: HttpClient and Observables (you've used the async pipe).
- Stage 2: Components (you understand `@Component` metadata and inputs).
- Stage 10: Forms (you've seen `valueChanges` Observables).

### Topics

- The change detection tree and how `ApplicationRef.tick()` walks it
- Zone.js: how Angular knows to run CD (and how `provideZonelessChangeDetection()` removes it)
- `ChangeDetectionStrategy.OnPush` vs `Default`
- OnPush triggers: input reference change, DOM event from component, async pipe emit, `markForCheck()`, signal change
- `ChangeDetectorRef.markForCheck()` vs `detectChanges()`
- Async pipe and `toSignal` as OnPush-friendly patterns
- ` NgZone.runOutsideAngular()` for high-frequency work (canvas, scroll, etc.)
- Debugging CD: Angular DevTools "Profiler" tab, `ng.profiler`

### Key Concepts

- Default CD walks the entire tree on every zone.js task (click, setTimeout, Promise resolve, HTTP) — easy but expensive
- OnPush components only re-render when: an input reference changes, a DOM event originates from them or a child, an async pipe emits, `markForCheck()` is called, or a signal they read changes
- Signals are the future — `provideZonelessChangeDetection()` (Angular 18+) lets components re-render only when signals change, dropping zone.js entirely
- The async pipe calls `markForCheck()` on emit, making it a leak-free OnPush pattern
- `markForCheck()` flags the component (and ancestors) for the next CD cycle; `detectChanges()` runs CD synchronously now

```typescript
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter-onpush',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ count() }}</h1>
    <button (click)="count.set(count() + 1)">+1</button>
    <p>Doubled: {{ doubled() }}</p>
  `,
})
export class CounterOnPushComponent {
  count = signal(0);
  // computed is memoized — re-runs only when count() changes
  doubled = computed(() => this.count() * 2);
}
```
Caption: OnPush with signals — the modern default

### Common Pitfalls

- Setting `changeDetection: OnPush` and then mutating an array in place — OnPush uses reference equality, so `items.push(x)` doesn't trigger CD; replace with `items = [...items, x]` or use a signal.
- Subscribing in the component and updating a field on emit with OnPush — the field updates but the view doesn't (no markForCheck); use async pipe or signals.
- Running `requestAnimationFrame` / `setInterval` inside the zone for animation — fires CD 60×/sec; use `zone.runOutsideAngular` and re-enter via `zone.run` only when needed.
- Calling `detectChanges()` instead of `markForCheck()` to "fix" a view that's not updating — `detectChanges` runs synchronously now (synchronous CD); prefer `markForCheck` to flag for the next tick.
- Mixing signals and zone-based CD without understanding — a signal change inside a long-running task can trigger CD when you don't expect it; consider zoneless for predictability.

### Real-World Applications

- Google Ads' campaign table uses OnPush + signals to render thousands of rows without CD storms on hover/click.
- Upwork's search feed uses the async pipe + OnPush so the list re-renders only when search results emit.
- PayPal uses `runOutsideAngular` for the payment countdown timer (1Hz tick) to avoid CD every second.
- Microsoft Teams migrated parts of the meeting UI to `provideZonelessChangeDetection()` to reduce jank during video calls.

### Interview Questions

- 1. What's the difference between Default and OnPush change detection? — Default walks the whole tree every zone task; OnPush only re-renders on input ref change, DOM event, async pipe emit, `markForCheck`, or signal change.
- 2. What triggers an OnPush component to re-render? — Input reference change, DOM event from itself or a child, async pipe emit, `markForCheck()` call, or a signal it reads changing.
- 3. What does `markForCheck` do? — Flags the component and all ancestors as dirty so the next CD cycle re-renders them; doesn't run CD synchronously.
- 4. What is `provideZonelessChangeDetection()`? — An Angular 18+ provider that removes zone.js; CD is scheduled only when signals change or `markForCheck` is called.
- 5. Why does the async pipe work well with OnPush? — It subscribes, returns the latest value, AND calls `markForCheck` on emit — fitting OnPush's re-render triggers exactly.

### Mini Project

Build a "Live Stock Ticker" widget: A component that subscribes to a (mocked) WebSocket of stock prices, updates a list, and renders without CD storms. Use OnPush, `toSignal`, and `runOutsideAngular` for the WebSocket subscription. Suggested approach:
  - Generate `StockService` exposing a `BehaviorSubject<Stock[]>`
  - Subscribe inside `runOutsideAngular` and call `markForCheck` only after batching updates
  - Use `toSignal(stocks$, { initialValue: [] })` in the component
  - Set `changeDetection: OnPush` and render with `@for`/`track`
  - Profile with Angular DevTools to confirm CD fires only on batched emits

### Exercises

1. Switch a Default component to OnPush and confirm it stops re-rendering on unrelated changes.
2. Use `toSignal(observable$)` with OnPush to drive a list without manual subscriptions.
3. Run a `setInterval` outside Angular with `runOutsideAngular` and re-enter with `zone.run` to update state.
4. Use Angular DevTools' Profiler to identify a CD storm on a component.
5. Enable `provideZonelessChangeDetection()` in a small demo app and verify signals still drive re-renders.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which change detection strategy only re-renders on input ref change, DOM events, async pipe emit, markForCheck, or signal changes?
9. A) ChangeDetectionStrategy.OnPush (*)
10. B) ChangeDetectionStrategy.Default
11. C) ChangeDetectionStrategy.Manual
12. D) ChangeDetectionStrategy.Zoneless
13. Explanation: OnPush skips CD for unrelated changes and re-renders only when one of the listed triggers fires, reducing the tree walked per cycle.
14. Q2: What does Zone.js do for Angular?
15. A) Sanitizes HTML
16. B) Monkey-patches async APIs (setTimeout, Promise, etc.) so Angular knows when to run CD (*)
17. C) Provides the router
18. D) Compiles templates
19. Explanation: Zone.js intercepts async operations and notifies Angular to run change detection; `provideZonelessChangeDetection()` removes this dependency.
20. Q3: Which API removes Zone.js and relies on signals + markForCheck to schedule CD?
21. A) withZoneless()
22. B) disableZone()
23. C) provideZonelessChangeDetection (*)
24. D) ChangeDetectionStrategy.Zoneless
25. Explanation: `provideZonelessChangeDetection()` (Angular 18+) opts out of zone.js; CD fires only when signals change or `markForCheck` is called — smaller bundle, more predictable.
26. Q4: Why does mutating an array in place (`items.push(x)`) not trigger OnPush re-render?
27. A) OnPush forbids arrays
28. B) Arrays can't be signals
29. C) push is not reactive
30. D) OnPush uses reference equality; the array reference didn't change (*)
31. Explanation: OnPush compares input references; mutation keeps the same reference, so no re-render. Replace with `items = [...items, x]` or use a signal array.
32. Q5: What does `ChangeDetectorRef.markForCheck()` do?
33. A) Flags the component and its ancestors as dirty for the next CD cycle (*)
34. B) Runs change detection synchronously
35. C) Detaches the component from CD
36. D) Re-runs ngOnInit
37. Explanation: `markForCheck` marks the path to root dirty so the next scheduled CD re-renders; `detectChanges()` runs CD synchronously now.
38. Q6: Why does the async pipe work well with OnPush?
39. A) It disables OnPush
40. B) It calls markForCheck on emit, fitting OnPush's triggers (*)
41. C) It runs CD synchronously
42. D) It bypasses zone.js
43. Explanation: AsyncPipe subscribes, returns the latest value, and calls `markForCheck` on each emit — exactly the trigger OnPush needs.
44. Q7: Which function runs a callback outside Angular's zone (no CD trigger)?
45. A) ngZone.run(...)
46. B) ngZone.runGuarded(...)
47. C) ngZone.runOutsideAngular(...) (*)
48. D) ngZone.disable(...)
49. Explanation: `runOutsideAngular` executes the callback without triggering CD; useful for high-frequency work (rAF, scroll, etc.). Re-enter via `run()` when state changes.
50. Q8: Which is a downside of `detectChanges()` vs `markForCheck()`?
51. A) detectChanges is slower in all cases
52. B) detectChanges doesn't exist
53. C) markForCheck is async-only
54. D) detectChanges runs CD synchronously now, risking ExpressionChanged errors and cascading work (*)
55. Explanation: `detectChanges` runs CD immediately on this subtree, which can trigger ExpressionChangedAfterItHasBeenChecked errors; prefer `markForCheck` to flag for the next scheduled cycle.
56. Q9: Which modern primitive integrates seamlessly with OnPush via `computed()` and `effect()`?
57. A) Signals (*)
58. B) BehaviorSubjects
59. C) Promises
60. D) NgRx actions
61. Explanation: Signals are tracked by `computed`/`effect` and trigger OnPush re-renders automatically — no manual `markForCheck` needed.
62. Q10: How can you profile change detection in an Angular app?
63. A) Use console.log in ngOnInit
64. B) Use Angular DevTools' Profiler tab to record and inspect CD cycles per component (*)
65. C) Use the Performance API only
66. D) You can't — it's opaque
67. Explanation: Angular DevTools (browser extension) has a Profiler tab that records CD cycles and shows how long each component took, identifying CD storms.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which change detection strategy only re-renders on input ref change, DOM events, async pipe emit, markForCheck, or signal changes?
  options:
    - ChangeDetectionStrategy.OnPush
    - ChangeDetectionStrategy.Default
    - ChangeDetectionStrategy.Manual
    - ChangeDetectionStrategy.Zoneless
  correctIndex: 0
  explanation: OnPush skips CD for unrelated changes and re-renders only when one of the listed triggers fires, reducing the tree walked per cycle.
- id: q2
  question: What does Zone.js do for Angular?
  options:
    - Sanitizes HTML
    - Monkey-patches async APIs (setTimeout, Promise, etc.) so Angular knows when to run CD
    - Provides the router
    - Compiles templates
  correctIndex: 1
  explanation: Zone.js intercepts async operations and notifies Angular to run change detection; `provideZonelessChangeDetection()` removes this dependency.
- id: q3
  question: Which API removes Zone.js and relies on signals + markForCheck to schedule CD?
  options:
    - withZoneless()
    - disableZone()
    - provideZonelessChangeDetection
    - ChangeDetectionStrategy.Zoneless
  correctIndex: 2
  explanation: "`provideZonelessChangeDetection()` (Angular 18+) opts out of zone.js; CD fires only when signals change or `markForCheck` is called — smaller bundle, more predictable."
- id: q4
  question: Why does mutating an array in place (`items.push(x)`) not trigger OnPush re-render?
  options:
    - OnPush forbids arrays
    - Arrays can't be signals
    - push is not reactive
    - OnPush uses reference equality; the array reference didn't change
  correctIndex: 3
  explanation: OnPush compares input references; mutation keeps the same reference, so no re-render. Replace with `items = [...items, x]` or use a signal array.
- id: q5
  question: What does `ChangeDetectorRef.markForCheck()` do?
  options:
    - Flags the component and its ancestors as dirty for the next CD cycle
    - Runs change detection synchronously
    - Detaches the component from CD
    - Re-runs ngOnInit
  correctIndex: 0
  explanation: "`markForCheck` marks the path to root dirty so the next scheduled CD re-renders; `detectChanges()` runs CD synchronously now."
- id: q6
  question: Why does the async pipe work well with OnPush?
  options:
    - It disables OnPush
    - It calls markForCheck on emit, fitting OnPush's triggers
    - It runs CD synchronously
    - It bypasses zone.js
  correctIndex: 1
  explanation: AsyncPipe subscribes, returns the latest value, and calls `markForCheck` on each emit — exactly the trigger OnPush needs.
- id: q7
  question: Which function runs a callback outside Angular's zone (no CD trigger)?
  options:
    - ngZone.run(...)
    - ngZone.runGuarded(...)
    - ngZone.runOutsideAngular(...)
    - ngZone.disable(...)
  correctIndex: 2
  explanation: "`runOutsideAngular` executes the callback without triggering CD; useful for high-frequency work (rAF, scroll, etc.). Re-enter via `run()` when state changes."
- id: q8
  question: Which is a downside of `detectChanges()` vs `markForCheck()`?
  options:
    - detectChanges is slower in all cases
    - detectChanges doesn't exist
    - markForCheck is async-only
    - detectChanges runs CD synchronously now, risking ExpressionChanged errors and cascading work
  correctIndex: 3
  explanation: "`detectChanges` runs CD immediately on this subtree, which can trigger ExpressionChangedAfterItHasBeenChecked errors; prefer `markForCheck` to flag for the next scheduled cycle."
- id: q9
  question: Which modern primitive integrates seamlessly with OnPush via `computed()` and `effect()`?
  options:
    - Signals
    - BehaviorSubjects
    - Promises
    - NgRx actions
  correctIndex: 0
  explanation: Signals are tracked by `computed`/`effect` and trigger OnPush re-renders automatically — no manual `markForCheck` needed.
- id: q10
  question: How can you profile change detection in an Angular app?
  options:
    - Use console.log in ngOnInit
    - Use Angular DevTools' Profiler tab to record and inspect CD cycles per component
    - Use the Performance API only
    - You can't — it's opaque
  correctIndex: 1
  explanation: Angular DevTools (browser extension) has a Profiler tab that records CD cycles and shows how long each component took, identifying CD storms.
```

