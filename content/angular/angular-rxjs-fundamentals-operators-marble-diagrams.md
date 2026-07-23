---
slug: angular-rxjs-fundamentals-operators-marble-diagrams
id: angular-09
track: angular
order: 9
title: RxJS Fundamentals — Operators, Marble Diagrams
description: Master RxJS operators (creation, transformation, filtering, combination, error handling), read and write marble diagrams, and apply `switchMap`/`mergeMap`/`exhaustMap` correctly.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=240s
whyItMatters: Master RxJS operators (creation, transformation, filtering, combination, error handling), read and write marble diagrams, and apply `switchMap`/`mergeMap`/`exhaustMap` correctly.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# RxJS Fundamentals — Operators, Marble Diagrams

## RxJS Fundamentals — Operators, Marble Diagrams

### Why It Matters

Master RxJS operators (creation, transformation, filtering, combination, error handling), read and write marble diagrams, and apply `switchMap`/`mergeMap`/`exhaustMap` correctly.

Master RxJS operators (creation, transformation, filtering, combination, error handling), read and write marble diagrams, and apply `switchMap`/`mergeMap`/`exhaustMap` correctly.

### Prerequisites

- Stage 8: HttpClient and Observables (you've used `subscribe`, `pipe`, and the `async` pipe).
- Comfort with higher-order functions in JavaScript (`map`, `filter`, `reduce`).

### Topics

- Observable, Observer, Subscription, Subject, BehaviorSubject
- Creation: `of`, `from`, `fromEvent`, `interval`, `timer`, `ajax`
- Transformation: `map`, `scan`, `switchMap`, `mergeMap`, `concatMap`, `exhaustMap`
- Filtering: `filter`, `debounceTime`, `distinctUntilChanged`, `takeUntil`, `first`
- Combination: `combineLatest`, `forkJoin`, `merge`, `zip`, `startWith`
- Error handling: `catchError`, `retry`, `finalize`, `throwError`
- Reading marble diagrams: `--a--b--c--|`, `#` for error, `(...)` for groups
- Hot vs cold Observables; multicasting with `share`, `shareReplay`

### Key Concepts

- An Observable is a lazy producer of values over time; nothing happens until subscribe
- The four flattening operators differ in concurrency: `switchMap` cancels prior, `mergeMap` parallels, `concatMap` queues, `exhaustMap` ignores new while busy
- `combineLatest` emits when ALL sources have emitted, then on any change; `forkJoin` emits only the LAST value of each source on completion
- Subjects are hot and multicast — they're both Observer and Observable; `BehaviorSubject` requires an initial value and stores the latest
- Marble diagrams are a compact notation for time-based Observable behavior; `--a--b--|` means "after 2 frames emit a, after 2 more emit b, then complete"

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

const input = document.querySelector('#search') as HTMLInputElement;

fromEvent<InputEvent>(input, 'input').pipe(
  map((e) => (e.target as HTMLInputElement).value),
  filter((q) => q.length >= 2),
  debounceTime(300),
  distinctUntilChanged(),
  // switchMap cancels the prior request when a new keystroke arrives
  switchMap((q) => fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json())),
).subscribe((results) => console.log(results));
```
Caption: Typeahead search with switchMap

### Common Pitfalls

- Using `mergeMap` for typeahead — it parallels requests, so old responses can arrive after new ones, clobbering the latest result; use `switchMap` to cancel.
- Using `switchMap` for form submit — it cancels an in-flight submit if the user double-clicks (technically fine) but also cancels legit retries; prefer `exhaustMap` to ignore new clicks while busy.
- Forgetting `distinctUntilChanged()` after `debounceTime` — fires the same query twice when the user types a character and then deletes it; add it.
- Subscribing inside `subscribe` (callback hell) — flatten with `switchMap`/`mergeMap` instead; nested subscribes are leaky and untestable.
- Using `combineLatest` when you only want each source's last value — `combineLatest` re-emits on every change forever; use `forkJoin` for "wait for all to complete" semantics.

### Real-World Applications

- Google Ads' autocomplete uses `debounceTime(150) → distinctUntilChanged → switchMap` to power the campaign picker without overwhelming the API.
- Upwork's job feed uses `combineLatest([filters$, page$]).pipe(switchMap(fetchJobs))` to refetch whenever filters or pagination change.
- PayPal's multi-step checkout uses `concatMap` to ensure step submissions are processed in order, even if the user clicks fast.
- Microsoft Teams' presence indicator uses `BehaviorSubject<Presence>` so newly-subscribed components immediately get the current state.

### Interview Questions

- 1. What's the difference between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`? — switchMap cancels prior; mergeMap parallels; concatMap queues in order; exhaustMap ignores new while busy.
- 2. When does `combineLatest` emit? — After ALL sources have emitted at least once, then on any subsequent emission from any source.
- 3. What's a Subject vs BehaviorSubject? — Both are hot, multicast Observables; BehaviorSubject requires an initial value and replays the latest to new subscribers; Subject does not.
- 4. What does the marble `--a--b--#` mean? — Two frames empty, emit `a`, two frames, emit `b`, two frames, error (`#`).
- 5. Why use `takeUntilDestroyed(this.destroyRef)` instead of manual `unsubscribe`? — It completes the observable when the component's `DestroyRef` fires, removing boilerplate and preventing leaks.

### Mini Project

Build a "Live Currency Converter" with RxJS: An input amount, a from-currency, and a to-currency, all combined via `combineLatest` and `switchMap`-ed to a (mocked) conversion API. Display the converted amount with a 1-second polling refresh. Suggested approach:
  - Create three signals (amount, from, to) and convert each to an Observable with `toObservable`
  - Use `combineLatest([amount$, from$, to$])` to react to any change
  - Pipe through `debounceTime(200)` and `switchMap` to a conversion fetch
  - Add `startWith(null)` to show a loading state
  - Display with `toSignal` and `@if`/`@else` for loading/result/error

### Exercises

1. Build a typeahead that filters a static array via `fromEvent` + `debounceTime` + `map`.
2. Use `combineLatest` of two signals to compute a derived value reactively.
3. Replace `mergeMap` with `switchMap` in a search and observe how stale responses are cancelled.
4. Write a marble-diagram test for an operator using `TestScheduler` from RxJS.
5. Use `takeUntilDestroyed()` to auto-unsubscribe an `interval(1000)` subscription in a component.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which operator cancels the previous inner Observable when a new value arrives?
9. A) switchMap (*)
10. B) mergeMap
11. C) concatMap
12. D) exhaustMap
13. Explanation: `switchMap` unsubscribes from the prior inner Observable when the source emits a new value, making it ideal for typeahead search.
14. Q2: Which flattening operator should you use for a "Submit" button to ignore clicks while a request is in flight?
15. A) switchMap
16. B) exhaustMap (*)
17. C) mergeMap
18. D) concatMap
19. Explanation: `exhaustMap` ignores new source emissions while the inner Observable is active, preventing double-submit on rapid clicks.
20. Q3: When does `combineLatest` emit?
21. A) Only when all sources complete
22. B) Only on the first emission of each source
23. C) After ALL sources emit at least once, then on any subsequent emission from any source (*)
24. D) Once per source
25. Explanation: combineLatest requires all sources to emit at least once, then re-emits on any change with the latest values from each source as an array.
26. Q4: Which operator emits only the LAST value of each source when all complete?
27. A) combineLatest
28. B) merge
29. C) zip
30. D) forkJoin (*)
31. Explanation: `forkJoin` waits for all sources to complete, then emits an array of their last values (Promise.all semantics); never emits if a source doesn't complete.
32. Q5: What does a marble `--a--b--#` represent?
33. A) Emit a, then b, then error (*)
34. B) Emit a, then b, then complete
35. C) Empty then complete
36. D) Two errors
37. Explanation: `-` is a frame, lowercase letters are emissions, `#` is an error, `|` is completion.
38. Q6: Which Subject variant requires an initial value and replays the latest to new subscribers?
39. A) Subject
40. B) BehaviorSubject (*)
41. C) ReplaySubject
42. D) AsyncSubject
43. Explanation: BehaviorSubject stores the latest value and emits it immediately to new subscribers; it must be constructed with an initial value.
44. Q7: Which operator debounces and then emits only if the value changed?
45. A) throttleTime(300)
46. B) sampleTime(300)
47. C) debounceTime(300) followed by distinctUntilChanged() (*)
48. D) auditTime(300)
49. Explanation: `debounceTime(300)` waits 300ms of silence before emitting; `distinctUntilChanged()` then skips if the value equals the previous one.
50. Q8: Which operator should you use for ordered, sequential writes (e.g. file uploads)?
51. A) switchMap
52. B) mergeMap
53. C) exhaustMap
54. D) concatMap (*)
55. Explanation: `concatMap` queues inner Observables and processes them one at a time in order, preserving sequence for ordered writes.
56. Q9: How do you auto-unsubscribe an Observable when a component is destroyed?
57. A) pipe(takeUntilDestroyed()) inside an injection context (*)
58. B) Manually unsubscribe in ngOnDestroy
59. C) Use async/await
60. D) Use shareReplay
61. Explanation: `takeUntilDestroyed(destroyRef?)` from `@angular/core/rxjs-interop` completes the Observable when the DestroyRef fires; called without args inside a constructor/field, it captures the context automatically.
62. Q10: Which is the BEST RxJS approach to wait for several HTTP calls to all complete?
63. A) merge([req1$, req2$, req3$])
64. B) forkJoin([req1$, req2$, req3$]) (*)
65. C) zip([req1$, req2$, req3$])
66. D) combineLatest([req1$, req2$, req3$])
67. Explanation: `forkJoin` waits for all sources to complete, then emits an array of their last values — Promise.all semantics for HTTP calls.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which operator cancels the previous inner Observable when a new value arrives?
  options:
    - switchMap
    - mergeMap
    - concatMap
    - exhaustMap
  correctIndex: 0
  explanation: "`switchMap` unsubscribes from the prior inner Observable when the source emits a new value, making it ideal for typeahead search."
- id: q2
  question: Which flattening operator should you use for a "Submit" button to ignore clicks while a request is in flight?
  options:
    - switchMap
    - exhaustMap
    - mergeMap
    - concatMap
  correctIndex: 1
  explanation: "`exhaustMap` ignores new source emissions while the inner Observable is active, preventing double-submit on rapid clicks."
- id: q3
  question: When does `combineLatest` emit?
  options:
    - Only when all sources complete
    - Only on the first emission of each source
    - After ALL sources emit at least once, then on any subsequent emission from any source
    - Once per source
  correctIndex: 2
  explanation: combineLatest requires all sources to emit at least once, then re-emits on any change with the latest values from each source as an array.
- id: q4
  question: Which operator emits only the LAST value of each source when all complete?
  options:
    - combineLatest
    - merge
    - zip
    - forkJoin
  correctIndex: 3
  explanation: "`forkJoin` waits for all sources to complete, then emits an array of their last values (Promise.all semantics); never emits if a source doesn't complete."
- id: q5
  question: What does a marble `--a--b--#` represent?
  options:
    - Emit a, then b, then error
    - Emit a, then b, then complete
    - Empty then complete
    - Two errors
  correctIndex: 0
  explanation: "`-` is a frame, lowercase letters are emissions, `#` is an error, `|` is completion."
- id: q6
  question: Which Subject variant requires an initial value and replays the latest to new subscribers?
  options:
    - Subject
    - BehaviorSubject
    - ReplaySubject
    - AsyncSubject
  correctIndex: 1
  explanation: BehaviorSubject stores the latest value and emits it immediately to new subscribers; it must be constructed with an initial value.
- id: q7
  question: Which operator debounces and then emits only if the value changed?
  options:
    - throttleTime(300)
    - sampleTime(300)
    - debounceTime(300) followed by distinctUntilChanged()
    - auditTime(300)
  correctIndex: 2
  explanation: "`debounceTime(300)` waits 300ms of silence before emitting; `distinctUntilChanged()` then skips if the value equals the previous one."
- id: q8
  question: Which operator should you use for ordered, sequential writes (e.g. file uploads)?
  options:
    - switchMap
    - mergeMap
    - exhaustMap
    - concatMap
  correctIndex: 3
  explanation: "`concatMap` queues inner Observables and processes them one at a time in order, preserving sequence for ordered writes."
- id: q9
  question: How do you auto-unsubscribe an Observable when a component is destroyed?
  options:
    - pipe(takeUntilDestroyed()) inside an injection context
    - Manually unsubscribe in ngOnDestroy
    - Use async/await
    - Use shareReplay
  correctIndex: 0
  explanation: "`takeUntilDestroyed(destroyRef?)` from `@angular/core/rxjs-interop` completes the Observable when the DestroyRef fires; called without args inside a constructor/field, it captures the context automatically."
- id: q10
  question: Which is the BEST RxJS approach to wait for several HTTP calls to all complete?
  options:
    - merge([req1$, req2$, req3$])
    - forkJoin([req1$, req2$, req3$])
    - zip([req1$, req2$, req3$])
    - combineLatest([req1$, req2$, req3$])
  correctIndex: 1
  explanation: "`forkJoin` waits for all sources to complete, then emits an array of their last values — Promise.all semantics for HTTP calls."
```

