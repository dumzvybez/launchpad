---
slug: angular-content-projection-viewchild-contentchild
id: angular-14
track: angular
order: 14
title: Content Projection and ViewChild/ContentChild
description: Use `ng-content` for content projection, multi-slot and conditional projection, and the modern signal-based `viewChild()` / `contentChild()` queries to access child components and DOM nodes.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=180s
whyItMatters: Use `ng-content` for content projection, multi-slot and conditional projection, and the modern signal-based `viewChild()` / `contentChild()` queries to access child components and DOM nodes.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Content Projection and ViewChild/ContentChild

## Content Projection and ViewChild/ContentChild

### Why It Matters

Use `ng-content` for content projection, multi-slot and conditional projection, and the modern signal-based `viewChild()` / `contentChild()` queries to access child components and DOM nodes.

Use `ng-content` for content projection, multi-slot and conditional projection, and the modern signal-based `viewChild()` / `contentChild()` queries to access child components and DOM nodes.

### Prerequisites

- Stage 2: Components and Templates (you understand inputs/outputs and lifecycle).
- Stage 13: Change Detection (you understand OnPush and signals).

### Topics

- Single-slot content projection with `<ng-content>`
- Multi-slot projection with `select="..."` (element, attribute, class)
- Conditional projection with `<ng-template>` and `ngTemplateOutlet`
- Signal-based `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`
- Legacy `@ViewChild` / `@ContentChild` decorators (still supported)
- `static: true` vs `static: false` (resolved before vs after CD)
- `@ContentChild` timing — available in `ngAfterContentInit`, not in constructor
- Projecting templates with `[ngTemplateOutlet]` for reusable layouts

### Key Concepts

- Content projection lets a parent inject content into a child component's template — fundamental to building reusable UI primitives (cards, modals, dialogs)
- `viewChild()` queries the component's own view; `contentChild()` queries the projected content
- Signal queries return `Signal<T | undefined>` — they're reactive and integrate with `computed`/`effect`
- Multi-slot projection uses `select` with CSS-like selectors to target specific projected content
- `static: true` queries (only on `@ViewChild`) resolve before the first CD, useful when the element is always present

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <section class="card">
      <ng-content />
    </section>
  `,
  styles: [`.card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; }`],
})
export class CardComponent {}

// Parent usage:
// <app-card><p>Hello, projected!</p></app-card>
```
Caption: Single-slot content projection

### Common Pitfalls

- Accessing `contentChild()` or `@ContentChild` in the constructor — they're not yet resolved; use `ngAfterContentInit` (decorator) or an `effect()` (signal query).
- Using `select="header"` instead of `select="header"` on a projected element — `select` accepts element names, attributes (in brackets), classes (with dot), or attributes-as-attr — pick the right syntax.
- Forgetting `static: true` (only on `@ViewChild`) for elements that need to be available before the first CD — but only when they're guaranteed present in the initial template.
- Confusing `viewChild` (own view) with `contentChild` (projected content) — picking the wrong one returns `undefined`.
- Calling `contentChild.required<T>()` and not providing matching content — throws `NG0950` at runtime; use the non-required variant for optional content.

### Real-World Applications

- Google Ads' card components use multi-slot projection to allow parent pages to inject title, body, and footer into a reusable analytics card.
- PayPal's modal component uses content projection with `ngTemplateOutlet` to swap header/body/footer templates per use case.
- Upwork's data-table component uses `contentChild` to read a `cellTemplate` projected by parent pages, enabling per-column custom rendering.
- Microsoft Teams' tabbed pane uses conditional projection to show loading/error/content based on each tab's state.

### Interview Questions

- 1. What's the difference between `viewChild` and `contentChild`? — `viewChild` queries elements/components in the component's own template; `contentChild` queries elements/components projected via `<ng-content>`.
- 2. When is `@ContentChild` resolved? — In `ngAfterContentInit` (before `ngAfterViewInit`); signal queries update reactively and can be read in `effect()`.
- 3. What does `contentChild.required()` do? — Returns a non-undefined signal; throws NG0950 if no matching content is projected. Use the non-required variant for optional content.
- 4. How does multi-slot projection work? — Add `select="..."` (CSS-like selector) to each `<ng-content>` and wrap projected nodes with matching attributes/classes/elements.
- 5. When would you use `ngTemplateOutlet`? — To render a `TemplateRef` at a specific location, often with a context object — enabling reusable layouts where the consumer passes a template instead of content.

### Mini Project

Build a "Smart Modal" component: A reusable modal that projects its header, body, and footer via multi-slot `<ng-content>` and exposes an `open()` / `close()` API via `viewChild`. Add a `(esc)` keyboard handler and `backdrop` click to close. Suggested approach:
  - Create `ModalComponent` with three `<ng-content select="...">` slots
  - Use `viewChild` of a `dialogRef` to call `.showModal()` / `.close()`
  - Add `output<boolean>()` for `close` events
  - Listen for `keydown.esc` on the host and call `close()`
  - Add `backdrop` click detection by checking the click target

### Exercises

1. Build a `CardComponent` that projects arbitrary content into a styled container.
2. Add multi-slot projection with `[card-title]` and `[card-actions]` selectors.
3. Use `viewChild` to access a child component and call one of its methods from a button.
4. Use `contentChild.required<TemplateRef<unknown>>('tpl')` to read a projected template and render it via `ngTemplateOutlet`.
5. Convert a legacy `@ViewChild` decorator query to a signal `viewChild()` and use it in an `effect`.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which tag enables content projection in Angular?
9. A) <slot>
10. B) <ng-content> (*)
11. C) <project>
12. D) <inject>
13. Explanation: `<ng-content>` marks where projected content is rendered; `<slot>` is the Web Components equivalent Angular does not use directly.
14. Q2: Which attribute on `<ng-content>` enables multi-slot projection?
15. A) slot
16. B) name
17. C) select (*)
18. D) target
19. Explanation: `select="..."` accepts a CSS-like selector (element, [attribute], .class) to match specific projected content for that slot.
20. Q3: Which signal-based API queries elements in a component's OWN view?
21. A) contentChild()
22. B) childQuery()
23. C) queryChild()
24. D) viewChild() (*)
25. Explanation: `viewChild()` queries the component's own template; `contentChild()` queries content projected via `<ng-content>`.
26. Q4: When is `@ContentChild` first available?
27. A) In ngAfterContentInit (*)
28. B) In the constructor
29. C) In ngOnInit
30. D) In ngAfterViewInit
31. Explanation: Projected content is resolved before view init; access via `ngAfterContentInit` (decorator) or read reactively in an `effect()` for signal queries.
32. Q5: What does `contentChild.required<T>()` do if no matching content is projected?
33. A) Returns undefined
34. B) Throws NG0950 (*)
35. C) Returns null
36. D) Renders an empty string
37. Explanation: The `.required` variant throws NG0950 when no matching content is projected; use the non-required variant for optional content.
38. Q6: Which directive renders a `TemplateRef` at a location with an optional context?
39. A) [ngTemplateOutlet]
40. B) ngProjectAs
41. C) ngTemplate (*)
42. D) ngContent
43. Explanation: `<ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="ctx">` renders a `TemplateRef` with optional `$implicit` and named context values.
44. Q7: Which `select` syntax matches a projected element with attribute `panel-title`?
45. A) select="panel-title"
46. B) select=".panel-title"
47. C) select="#panel-title"
48. D) select="[panel-title]" (*)
49. Explanation: `[attr]` matches by attribute; bare name matches an element type; `.class` matches by class; `#id` matches by template reference.
50. Q8: Which is TRUE about signal-based queries?
51. A) They return a Signal<T | undefined> that integrates with computed/effect (*)
52. B) They return a static value
53. C) They can only run in ngOnInit
54. D) They replace ngOnChanges
55. Explanation: `viewChild()`/`contentChild()` return signals that update reactively and can be read in `computed()`/`effect()`; they replace the legacy `@ViewChild`/`@ContentChild` decorators.
56. Q9: Which `static: true` (legacy @ViewChild) is for?
57. A) Static (CSS) queries only
58. B) Resolving the query before the first change detection (*)
59. C) Disabling CD for the query
60. D) Making the query synchronous forever
61. Explanation: `static: true` (only on `@ViewChild`) resolves the query before the first CD, useful for elements always present; signal queries don't have this flag — they're reactive.
62. Q10: How can a parent pass a conditional template to a child component?
63. A) Pass a string and parse it
64. B) Use innerHtml
65. C) Use `<ng-template #x>` and `contentChild.required<TemplateRef>('x')` plus `[ngTemplateOutlet]` (*)
66. D) Pass a function returning HTML
67. Explanation: Define `<ng-template #x>` in the parent, project it, read it via `contentChild<TemplateRef>('x')`, and render via `[ngTemplateOutlet]` in the child template.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which tag enables content projection in Angular?
  options:
    - <slot>
    - <ng-content>
    - <project>
    - <inject>
  correctIndex: 1
  explanation: "`<ng-content>` marks where projected content is rendered; `<slot>` is the Web Components equivalent Angular does not use directly."
- id: q2
  question: Which attribute on `<ng-content>` enables multi-slot projection?
  options:
    - slot
    - name
    - select
    - target
  correctIndex: 2
  explanation: '`select="..."` accepts a CSS-like selector (element, [attribute], .class) to match specific projected content for that slot.'
- id: q3
  question: Which signal-based API queries elements in a component's OWN view?
  options:
    - contentChild()
    - childQuery()
    - queryChild()
    - viewChild()
  correctIndex: 3
  explanation: "`viewChild()` queries the component's own template; `contentChild()` queries content projected via `<ng-content>`."
- id: q4
  question: When is `@ContentChild` first available?
  options:
    - In ngAfterContentInit
    - In the constructor
    - In ngOnInit
    - In ngAfterViewInit
  correctIndex: 0
  explanation: Projected content is resolved before view init; access via `ngAfterContentInit` (decorator) or read reactively in an `effect()` for signal queries.
- id: q5
  question: What does `contentChild.required<T>()` do if no matching content is projected?
  options:
    - Returns undefined
    - Throws NG0950
    - Returns null
    - Renders an empty string
  correctIndex: 1
  explanation: The `.required` variant throws NG0950 when no matching content is projected; use the non-required variant for optional content.
- id: q6
  question: Which directive renders a `TemplateRef` at a location with an optional context?
  options:
    - "[ngTemplateOutlet]"
    - ngProjectAs
    - ngTemplate
    - ngContent
  correctIndex: 2
  explanation: '`<ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="ctx">` renders a `TemplateRef` with optional `$implicit` and named context values.'
- id: q7
  question: Which `select` syntax matches a projected element with attribute `panel-title`?
  options:
    - select="panel-title"
    - select=".panel-title"
    - select="#panel-title"
    - select="[panel-title]"
  correctIndex: 3
  explanation: "`[attr]` matches by attribute; bare name matches an element type; `.class` matches by class; `#id` matches by template reference."
- id: q8
  question: Which is TRUE about signal-based queries?
  options:
    - They return a Signal<T | undefined> that integrates with computed/effect
    - They return a static value
    - They can only run in ngOnInit
    - They replace ngOnChanges
  correctIndex: 0
  explanation: "`viewChild()`/`contentChild()` return signals that update reactively and can be read in `computed()`/`effect()`; they replace the legacy `@ViewChild`/`@ContentChild` decorators."
- id: q9
  question: "Which `static: true` (legacy @ViewChild) is for?"
  options:
    - Static (CSS) queries only
    - Resolving the query before the first change detection
    - Disabling CD for the query
    - Making the query synchronous forever
  correctIndex: 1
  explanation: "`static: true` (only on `@ViewChild`) resolves the query before the first CD, useful for elements always present; signal queries don't have this flag — they're reactive."
- id: q10
  question: How can a parent pass a conditional template to a child component?
  options:
    - Pass a string and parse it
    - Use innerHtml
    - "Use `<ng-template #x>` and `contentChild.required<TemplateRef>('x')` plus `[ngTemplateOutlet]`"
    - Pass a function returning HTML
  correctIndex: 2
  explanation: "Define `<ng-template #x>` in the parent, project it, read it via `contentChild<TemplateRef>('x')`, and render via `[ngTemplateOutlet]` in the child template."
```

