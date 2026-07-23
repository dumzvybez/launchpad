---
slug: angular-components-templates
id: angular-02
track: angular
order: 2
title: Components and Templates
description: Build standalone components with inline and external templates, learn the component lifecycle, and use signal-based inputs/outputs to communicate between parent and child.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=30s
whyItMatters: Build standalone components with inline and external templates, learn the component lifecycle, and use signal-based inputs/outputs to communicate between parent and child.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Components and Templates

## Components and Templates

### Why It Matters

Build standalone components with inline and external templates, learn the component lifecycle, and use signal-based inputs/outputs to communicate between parent and child.

Build standalone components with inline and external templates, learn the component lifecycle, and use signal-based inputs/outputs to communicate between parent and child.

### Prerequisites

- Stage 1: Getting Started with Angular (you can scaffold and run an Angular app).
- Basic TypeScript (classes, decorators, types) and HTML.

### Topics

- @Component decorator: selector, template, templateUrl, styles, styleUrls
- Standalone components and the `imports` array (CommonModule, RouterLink, etc.)
- Inline vs external templates and when to choose which
- The component lifecycle: ngOnInit, ngOnChanges, ngAfterViewInit, ngOnDestroy
- Signal-based inputs: `input()` and `input.required<T>()`
- Signal-based outputs: `output<T>()` and `outputFromObservable()`
- Two-way bindings via `model()` signals (Angular 17.2+)
- Component selectors: element, attribute, class
- Style encapsulation: Emulated (default), None, ShadowDom

### Key Concepts

- A component = a TypeScript class + a template + styles, all wired by @Component
- Standalone components explicitly list their template dependencies in `imports: [...]`
- Signal inputs (`input()`) are reactive — `computed()` and `effect()` track them automatically
- `model()` is a signal-based two-way binding primitive that emits both as an output and an input
- Angular emulates Shadow DOM by default via attribute-scoped CSS (ViewEncapsulation.Emulated)

```typescript
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <article>
      <h2>{{ name() }}</h2>
      <p>{{ role() }}</p>
      <button (click)="select.emit(id())">Select</button>
    </article>
  `,
})
export class UserCardComponent {
  // Signal-based inputs (Angular 17.1+)
  id = input.required<number>();
  name = input<string>('Anonymous');
  role = input<string>('Viewer');

  // Signal-based output
  select = output<number>();

  // Computed value re-derives when inputs change
  label = computed(() => `${this.name()} (${this.role()})`);
}
```
Caption: Standalone component with signal input/output

### Common Pitfalls

- Forgetting to import a directive/pipe in `imports: [...]` on a standalone component — the template silently fails to compile with `NG8004: Unknown element` or similar; always add the symbol.
- Using `@Input()` setters when you should use `input()` signals — setters can't be tracked by `computed()`/`effect()` and break the signals mental model; migrate to `input()`.
- Mutating an `input()` signal value from the child — inputs are read-only; use `model()` if you need to emit updates back to the parent.
- Choosing `ViewEncapsulation.None` to "fix" CSS quickly — it leaks styles globally; prefer `Emulated` (default) or `ShadowDom` for true encapsulation.
- Naming the selector with a `ng-` prefix — `ng` is reserved for Angular built-ins; use a custom prefix (default `app-`) to avoid collisions.

### Real-World Applications

- Google Ads' management console uses hundreds of standalone components composed into dashboards, each scoped to one business object (campaign, ad group, keyword).
- Deutsche Bahn's train booking flow (bahn.de) uses Angular components for the journey planner, seat map, and ticket purchase — each isolated and unit-tested.
- Upwork's job card and proposal card components are reused across the search results, dashboard, and notifications surfaces.
- Forbes' article page renders the headline, byline, and paywall banner as separate Angular components to enable independent A/B testing.

### Interview Questions

- 1. What's the difference between `@Input()` and `input()`? — `input()` is the new signal-based API (Angular 17.1+) that integrates with `computed`/`effect`; `@Input()` is the legacy decorator that fires `ngOnChanges` but is not signal-aware.
- 2. When does `ngOnInit` fire and why prefer it over the constructor? — `ngOnInit` fires after inputs are bound; the constructor should only do DI and field initialization, never input-dependent logic.
- 3. What is `ViewEncapsulation.Emulated`? — Angular rewrites component CSS to scope each rule to a unique attribute (`_ngcontent-xyz`) on host elements, emulating Shadow DOM without its isolation overhead.
- 4. What does `model()` do that `input()` + `output()` together don't? — `model()` is a single signal that is both an input and an output — binding `[(myModel)]` on it just works without manually wiring `(myModelChange)`.
- 5. How do you clean up RxJS subscriptions in a component? — Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` with `inject(DestroyRef)`, or `takeUntilDestroyed()` called inside an injection context (constructor or field initializer).

### Mini Project

Build a "User Profile Card" component library: A reusable standalone component that accepts a user (id, name, role, avatar URL) via signal inputs and emits `select` and `edit` outputs. Display three cards in a parent, and show a "currently selected" panel below. Suggested approach:
  - Generate `user-card.component.ts` with `input.required<User>()` and `output<User>()`
  - Define the `User` interface in `user.model.ts`
  - Add an `avatarUrl` input with a default placeholder
  - Use `computed()` to build a fallback label when `role` is empty
  - Render three cards in `AppComponent` with different users and track the selected one

### Exercises

1. Create a `HeaderComponent` with a `title` signal input and use it in `AppComponent`.
2. Add an `output<string>()` named `search` and emit when the user types in an input field.
3. Convert a legacy `@Input() count` / `@Output() countChange` pair to a single `model<number>()` two-way binding.
4. Switch a component's styles from inline `styles: []` to an external `stylesUrl` and confirm styles still apply.
5. Add an `ngOnInit` and `ngOnDestroy` lifecycle hook to log mount/unmount, then navigate away and back to verify.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which API is the modern signal-based way to declare a component input?
9. A) @Input() myProp: string;
10. B) myProp = input<string>(); (*)
11. C) myProp: string = '';
12. D) @ViewChild('myProp')
13. Explanation: `input()` (Angular 17.1+) returns a signal that integrates with `computed()` and `effect()`; `@Input()` is the legacy decorator that fires lifecycle hooks instead.
14. Q2: How do you declare a required signal input?
15. A) input<string>({ required: true })
16. B) @Input({ required: true })
17. C) input.required<string>() (*)
18. D) input<string!>()
19. Explanation: `input.required<T>()` returns an InputSignal that throws at runtime if the parent doesn't bind it; the `@Input({required: true})` form is the older API.
20. Q3: Which `imports` array does a standalone component use to declare template dependencies?
21. A) The `@NgModule.imports`
22. B) The `@Component.declarations`
23. C) The `bootstrap` array in main.ts
24. D) The `@Component.imports` array (*)
25. Explanation: Standalone components list their dependencies (directives, pipes, other components) in `@Component({ imports: [...] })`; `declarations` was for NgModules.
26. Q4: Which lifecycle hook fires after Angular has initialized all inputs for the first time?
27. A) ngOnInit (*)
28. B) ngOnChanges
29. C) constructor
30. D) ngDoCheck
31. Explanation: `ngOnInit` runs once after the first `ngOnChanges`, after inputs are guaranteed to be set; the constructor should only handle DI and field init.
32. Q5: What does `model()` provide that `input()` + `output()` together do not?
33. A) Memoization across renders
34. B) A single signal that is simultaneously an input and an output, enabling `[(x)]` two-way binding (*)
35. C) Better TypeScript inference
36. D) Server-side rendering
37. Explanation: `model()` (Angular 17.2+) is a two-way binding primitive — binding `[(myModel)]="parent"` propagates parent changes to the child and child `set()` calls back to the parent.
38. Q6: Which `ViewEncapsulation` mode is Angular's default?
39. A) None
40. B) Native
41. C) Emulated (*)
42. D) ShadowDom
43. Explanation: `Emulated` rewrites CSS selectors with a unique attribute (`_ngcontent-xxx`), giving scoped styles without the performance cost of real Shadow DOM.
44. Q7: What is the correct selector prefix for a custom Angular component?
45. A) ng-
46. B) data-
47. C) must be camelCase only
48. D) Any prefix, but `app-` is the CLI default (*)
49. Explanation: `ng-` is reserved for Angular built-ins; the CLI defaults to `app-` (configurable in `angular.json` `prefix`), and selectors must contain a dash to be valid custom element names.
50. Q8: How do you clean up an RxJS subscription in a standalone component using modern Angular?
51. A) Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` (*)
52. B) Manually unsubscribe in ngOnDestroy
53. C) Use async/await
54. D) Convert to a Promise
55. Explanation: `takeUntilDestroyed(destroyRef?)` completes the observable when the injection context (component) is destroyed; called without args inside a constructor/field, it captures `DestroyRef` automatically.
56. Q9: What happens if you forget to import a used pipe (e.g. `DatePipe`) in a standalone component's `imports`?
57. A) The component renders but the pipe is a no-op
58. B) The template fails to compile with NG8004/NG8002 unknown element/pipe (*)
59. C) Angular falls back to global pipes
60. D) Nothing — pipes are globally available
61. Explanation: Standalone components are explicitly self-contained; missing imports produce compile errors during `ng serve`/`ng build`, surfacing before runtime.
62. Q10: Which approach correctly emits a value from a signal-based output named `select`?
63. A) this.select = value;
64. B) this.select.next(value);
65. C) this.select.emit(value); (*)
66. D) this.select.set(value);
67. Explanation: `output()` returns an `OutputEmitterRef` with an `emit(value)` method; `set()` is for signals, `next()` is for RxJS Subjects.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which API is the modern signal-based way to declare a component input?
  options:
    - "@Input() myProp: string;"
    - myProp = input<string>();
    - "myProp: string = '';"
    - "@ViewChild('myProp')"
  correctIndex: 1
  explanation: "`input()` (Angular 17.1+) returns a signal that integrates with `computed()` and `effect()`; `@Input()` is the legacy decorator that fires lifecycle hooks instead."
- id: q2
  question: How do you declare a required signal input?
  options:
    - "input<string>({ required: true })"
    - "@Input({ required: true })"
    - input.required<string>()
    - input<string!>()
  correctIndex: 2
  explanation: "`input.required<T>()` returns an InputSignal that throws at runtime if the parent doesn't bind it; the `@Input({required: true})` form is the older API."
- id: q3
  question: Which `imports` array does a standalone component use to declare template dependencies?
  options:
    - The `@NgModule.imports`
    - The `@Component.declarations`
    - The `bootstrap` array in main.ts
    - The `@Component.imports` array
  correctIndex: 3
  explanation: "Standalone components list their dependencies (directives, pipes, other components) in `@Component({ imports: [...] })`; `declarations` was for NgModules."
- id: q4
  question: Which lifecycle hook fires after Angular has initialized all inputs for the first time?
  options:
    - ngOnInit
    - ngOnChanges
    - constructor
    - ngDoCheck
  correctIndex: 0
  explanation: "`ngOnInit` runs once after the first `ngOnChanges`, after inputs are guaranteed to be set; the constructor should only handle DI and field init."
- id: q5
  question: What does `model()` provide that `input()` + `output()` together do not?
  options:
    - Memoization across renders
    - A single signal that is simultaneously an input and an output, enabling `[(x)]` two-way binding
    - Better TypeScript inference
    - Server-side rendering
  correctIndex: 1
  explanation: '`model()` (Angular 17.2+) is a two-way binding primitive — binding `[(myModel)]="parent"` propagates parent changes to the child and child `set()` calls back to the parent.'
- id: q6
  question: Which `ViewEncapsulation` mode is Angular's default?
  options:
    - None
    - Native
    - Emulated
    - ShadowDom
  correctIndex: 2
  explanation: "`Emulated` rewrites CSS selectors with a unique attribute (`_ngcontent-xxx`), giving scoped styles without the performance cost of real Shadow DOM."
- id: q7
  question: What is the correct selector prefix for a custom Angular component?
  options:
    - ng-
    - data-
    - must be camelCase only
    - Any prefix, but `app-` is the CLI default
  correctIndex: 3
  explanation: "`ng-` is reserved for Angular built-ins; the CLI defaults to `app-` (configurable in `angular.json` `prefix`), and selectors must contain a dash to be valid custom element names."
- id: q8
  question: How do you clean up an RxJS subscription in a standalone component using modern Angular?
  options:
    - Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop`
    - Manually unsubscribe in ngOnDestroy
    - Use async/await
    - Convert to a Promise
  correctIndex: 0
  explanation: "`takeUntilDestroyed(destroyRef?)` completes the observable when the injection context (component) is destroyed; called without args inside a constructor/field, it captures `DestroyRef` automatically."
- id: q9
  question: What happens if you forget to import a used pipe (e.g. `DatePipe`) in a standalone component's `imports`?
  options:
    - The component renders but the pipe is a no-op
    - The template fails to compile with NG8004/NG8002 unknown element/pipe
    - Angular falls back to global pipes
    - Nothing — pipes are globally available
  correctIndex: 1
  explanation: Standalone components are explicitly self-contained; missing imports produce compile errors during `ng serve`/`ng build`, surfacing before runtime.
- id: q10
  question: Which approach correctly emits a value from a signal-based output named `select`?
  options:
    - this.select = value;
    - this.select.next(value);
    - this.select.emit(value);
    - this.select.set(value);
  correctIndex: 2
  explanation: "`output()` returns an `OutputEmitterRef` with an `emit(value)` method; `set()` is for signals, `next()` is for RxJS Subjects."
```

