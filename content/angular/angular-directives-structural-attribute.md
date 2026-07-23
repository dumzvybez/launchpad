---
slug: angular-directives-structural-attribute
id: angular-04
track: angular
order: 4
title: Directives — Structural and Attribute
description: Use Angular's built-in directives (`@if`/`@for`/`@switch` new control flow, `ngClass`, `ngStyle`) and author your own attribute and structural directives.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=90s
whyItMatters: Use Angular's built-in directives (`@if`/`@for`/`@switch` new control flow, `ngClass`, `ngStyle`) and author your own attribute and structural directives.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Directives — Structural and Attribute

## Directives — Structural and Attribute

### Why It Matters

Use Angular's built-in directives (`@if`/`@for`/`@switch` new control flow, `ngClass`, `ngStyle`) and author your own attribute and structural directives.

Use Angular's built-in directives (`@if`/`@for`/`@switch` new control flow, `ngClass`, `ngStyle`) and author your own attribute and structural directives.

### Prerequisites

- Stage 3: Data Binding (you understand property/event/interpolation bindings).
- Knowledge of HTML attributes, CSS classes, and DOM manipulation concepts.

### Topics

- The new control flow: `@if`, `@else if`, `@else`, `@for` (with `track`), `@switch`/`@case`/`@default`
- Migration from `*ngIf` / `*ngFor` / `*ngSwitch` (deprecated in v17, removed in v20)
- `@for` requires `track` — why and how it differs from `*ngFor`
- `@empty` block in `@for` for empty-state rendering
- Attribute directives: `ngClass`, `ngStyle`
- Authoring an attribute directive with `@Directive` and `HostListener`/`HostBinding`
- Authoring a structural directive with `TemplateRef` + `ViewContainerRef`
- `ngTemplateOutlet` for template composition

### Key Concepts

- New control flow (`@if`, `@for`, `@switch`) compiles to native JS in templates — no directive imports needed
- `@for`'s `track` is mandatory; it gives Angular a stable identity for DOM recycling (replace `trackBy: fn` from `*ngFor`)
- Attribute directives change the appearance or behavior of an element (`[ngClass]`, `[appHighlight]`)
- Structural directives add/remove DOM nodes via `ViewContainerRef.createEmbeddedView`
- `@for` is up to 90% faster than `*ngFor` on large lists due to compiled control flow and required `track`

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  template: `
    @if (items().length > 0) {
      <ul>
        @for (item of items(); track item.id) {
          <li [class.done]="item.done">{{ item.text }}</li>
        } @empty {
          <li>No items yet.</li>
        }
      </ul>
    } @else {
      <p>Start by adding an item.</p>
    }
  `,
})
export class ListComponent {
  items = signal<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Learn @for', done: true },
  ]);
}
```
Caption: New control flow: @if and @for

### Common Pitfalls

- Using `*ngIf`/`*ngFor` in new Angular code — they're deprecated in v17 and removed in v20; use `@if`/`@for` and run `ng generate @angular/core:control-flow` to migrate.
- Forgetting `track` in `@for` — Angular throws a compile error; you must provide a stable identity expression (e.g. `track item.id`).
- Tracking `@for` by `track $index` and then mutating the array — index tracking breaks DOM recycling when items reorder, causing inputs to keep stale state.
- Calling `createEmbeddedView` repeatedly without `clear()` in a structural directive — leaks views; always clear before re-creating or use `ViewContainerRef`'s length to manage.
- Mutating DOM directly in a component instead of an attribute directive — wraps the side effect in a reusable, testable directive and keeps the component declarative.

### Real-World Applications

- Google Ads' campaign list uses `@for` with `track campaign.id` to efficiently re-render thousands of rows when filters change.
- PayPal's transaction table uses a custom `appSort` attribute directive to encapsulate column-sorting logic across dozens of tables.
- Upwork's job feed uses `@if`/`@else` blocks to switch between loading skeleton, error, and content states per feed section.
- Microsoft Office Online's ribbon uses structural directives to dynamically add or hide contextual tabs based on the current selection.

### Interview Questions

- 1. Why does `@for` require `track`? — Tracking gives Angular a stable identity to recycle DOM nodes on add/remove/reorder, avoiding expensive re-renders and preserving component state.
- 2. What's the difference between `@if` and `*ngIf`? — `@if` is the new control flow compiled natively (no directive import, faster); `*ngIf` is the structural directive (NgIf) deprecated in v17 and removed in v20.
- 3. What does `@empty` do inside `@for`? — It renders its block when the iterable is empty, replacing the need for a separate `*ngIf="items.length"` wrapper.
- 4. When would you write a structural directive vs an attribute directive? — Structural adds/removes DOM (`*appUnless`); attribute changes appearance/behavior of an existing element (`[appHighlight]`).
- 5. How does `ngTemplateOutlet` help composition? — It renders a `TemplateRef` at a location with optional context, enabling reusable template snippets passed around as inputs.

### Mini Project

Build a "Repeater" directive: An attribute directive `[appRepeat]="count"` that duplicates its host element N times (cloning the host's content) using `ViewContainerRef`. Apply it to a `<li appRepeat="5">Item</li>` to render five list items. Suggested approach:
  - Create `repeat.directive.ts` with `input<number>()` for `appRepeat`
  - Inject `TemplateRef` and `ViewContainerRef`
  - Use `effect()` to re-render when `appRepeat` changes
  - Clear the container and call `createEmbeddedView` in a loop
  - Display the index inside the template via the `$implicit` context

### Exercises

1. Migrate an existing `*ngIf="items.length > 0"` / `*ngFor="let i of items"` block to `@if` / `@for` with `track`.
2. Add an `@empty` block to a list rendering a friendly message when items is `[]`.
3. Write a `[appBold]` attribute directive that sets `font-weight: bold` on the host.
4. Write an `[appUnless]="cond"` structural directive that hides the element when `cond` is true.
5. Use `ngClass` to conditionally apply `active` and `disabled` classes from a signal state object.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the modern Angular control-flow block for conditional rendering?
9. A) *ngIf
10. B) v-if
11. C) ng-template [ngIf]
12. D) @if (*)
13. Explanation: `@if` (and `@else if`/`@else`) is the new compiled control flow introduced in Angular 17; `*ngIf` is the legacy structural directive, deprecated.
14. Q2: What is required on every `@for` block in Angular 17+?
15. A) A `track` expression (*)
16. B) A `let` index variable
17. C) An `@empty` block
18. D) A `key` attribute on the element
19. Explanation: `@for` requires `track expr` for stable identity; without it the template fails to compile. It replaces the optional `trackBy: fn` from `*ngFor`.
20. Q3: Which block renders content when an `@for` iterable is empty?
21. A) @else
22. B) @empty (*)
23. C) @default
24. D) @nothing
25. Explanation: `@empty` is the inline empty-state branch of `@for`, replacing the older `*ngIf="items.length"` wrapper pattern.
26. Q4: Which decorator marks a class as an attribute directive?
27. A) @Component
28. B) @Injectable
29. C) @Directive (*)
30. D) @Pipe
31. Explanation: `@Directive` marks attribute and structural directives; `@Component` is a specialized directive with a template; `@Pipe` is for transformations.
32. Q5: What does `@HostListener('mouseenter')` do?
33. A) Listens to a component output
34. B) Listens to a router event
35. C) Listens to a window resize
36. D) Listens to a host element's DOM event (*)
37. Explanation: `@HostListener(eventName)` registers the method as a handler for that DOM event on the directive's host element.
38. Q6: Which two services does a structural directive typically inject?
39. A) TemplateRef and ViewContainerRef (*)
40. B) ElementRef and Renderer2
41. C) ChangeDetectorRef and NgZone
42. D) Router and ActivatedRoute
43. Explanation: `TemplateRef` represents the embedded template; `ViewContainerRef` provides `createEmbeddedView`/`clear` to add or remove the rendered nodes.
44. Q7: Why is `track $index` an anti-pattern in `@for`?
45. A) It is unsupported
46. B) Index is unstable when items reorder, breaking DOM recycling and preserving stale component state (*)
47. C) It only works for primitives
48. D) It requires CommonModule
49. Explanation: Index-based tracking recycles the wrong DOM nodes when items move, causing inputs/state to attach to wrong items; track by a unique ID instead.
50. Q8: Which approach can render a `TemplateRef` with a context object?
51. A) [ngTemplateOutletContext]
52. B) @if only
53. C) ngTemplateOutlet with [ngTemplateOutletContext] (*)
54. D) innerHtml
55. Explanation: `<ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="ctx">` renders the template with `$implicit` and named context values.
56. Q9: Which is TRUE about `@switch`?
57. A) It only accepts string cases
58. B) It cannot fall through
59. C) It replaces `@if` entirely
60. D) It supports `@case` and `@default` branches (*)
61. Explanation: `@switch (expr) { @case (v) {...} @default {...} }` provides multi-branch selection with a default fallback, like JS switch.
62. Q10: What's a key performance benefit of `@for` over `*ngFor`?
63. A) It compiles to native JS in templates and requires tracking, enabling up to 90% faster list diffs (*)
64. B) It uses Web Workers
65. C) It removes the need for change detection
66. D) It runs server-side only
67. Explanation: The new control flow compiles template logic to JS, and mandatory `track` lets Angular reuse DOM efficiently — benchmarked at up to 90% faster on large lists.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the modern Angular control-flow block for conditional rendering?
  options:
    - "*ngIf"
    - v-if
    - ng-template [ngIf]
    - "@if"
  correctIndex: 3
  explanation: "`@if` (and `@else if`/`@else`) is the new compiled control flow introduced in Angular 17; `*ngIf` is the legacy structural directive, deprecated."
- id: q2
  question: What is required on every `@for` block in Angular 17+?
  options:
    - A `track` expression
    - A `let` index variable
    - An `@empty` block
    - A `key` attribute on the element
  correctIndex: 0
  explanation: "`@for` requires `track expr` for stable identity; without it the template fails to compile. It replaces the optional `trackBy: fn` from `*ngFor`."
- id: q3
  question: Which block renders content when an `@for` iterable is empty?
  options:
    - "@else"
    - "@empty"
    - "@default"
    - "@nothing"
  correctIndex: 1
  explanation: '`@empty` is the inline empty-state branch of `@for`, replacing the older `*ngIf="items.length"` wrapper pattern.'
- id: q4
  question: Which decorator marks a class as an attribute directive?
  options:
    - "@Component"
    - "@Injectable"
    - "@Directive"
    - "@Pipe"
  correctIndex: 2
  explanation: "`@Directive` marks attribute and structural directives; `@Component` is a specialized directive with a template; `@Pipe` is for transformations."
- id: q5
  question: What does `@HostListener('mouseenter')` do?
  options:
    - Listens to a component output
    - Listens to a router event
    - Listens to a window resize
    - Listens to a host element's DOM event
  correctIndex: 3
  explanation: "`@HostListener(eventName)` registers the method as a handler for that DOM event on the directive's host element."
- id: q6
  question: Which two services does a structural directive typically inject?
  options:
    - TemplateRef and ViewContainerRef
    - ElementRef and Renderer2
    - ChangeDetectorRef and NgZone
    - Router and ActivatedRoute
  correctIndex: 0
  explanation: "`TemplateRef` represents the embedded template; `ViewContainerRef` provides `createEmbeddedView`/`clear` to add or remove the rendered nodes."
- id: q7
  question: Why is `track $index` an anti-pattern in `@for`?
  options:
    - It is unsupported
    - Index is unstable when items reorder, breaking DOM recycling and preserving stale component state
    - It only works for primitives
    - It requires CommonModule
  correctIndex: 1
  explanation: Index-based tracking recycles the wrong DOM nodes when items move, causing inputs/state to attach to wrong items; track by a unique ID instead.
- id: q8
  question: Which approach can render a `TemplateRef` with a context object?
  options:
    - "[ngTemplateOutletContext]"
    - "@if only"
    - ngTemplateOutlet with [ngTemplateOutletContext]
    - innerHtml
  correctIndex: 2
  explanation: '`<ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="ctx">` renders the template with `$implicit` and named context values.'
- id: q9
  question: Which is TRUE about `@switch`?
  options:
    - It only accepts string cases
    - It cannot fall through
    - It replaces `@if` entirely
    - It supports `@case` and `@default` branches
  correctIndex: 3
  explanation: "`@switch (expr) { @case (v) {...} @default {...} }` provides multi-branch selection with a default fallback, like JS switch."
- id: q10
  question: What's a key performance benefit of `@for` over `*ngFor`?
  options:
    - It compiles to native JS in templates and requires tracking, enabling up to 90% faster list diffs
    - It uses Web Workers
    - It removes the need for change detection
    - It runs server-side only
  correctIndex: 0
  explanation: The new control flow compiles template logic to JS, and mandatory `track` lets Angular reuse DOM efficiently — benchmarked at up to 90% faster on large lists.
```

