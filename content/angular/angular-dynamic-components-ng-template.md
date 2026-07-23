---
slug: angular-dynamic-components-ng-template
id: angular-15
track: angular
order: 15
title: Dynamic Components and ng-template
description: Render components dynamically with `ViewContainerRef.createComponent`, use `ng-template` and `TemplateRef` for reusable markup, and explore the modern `NgComponentOutlet` directive.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=240s
whyItMatters: Render components dynamically with `ViewContainerRef. createComponent`, use `ng-template` and `TemplateRef` for reusable markup, and explore the modern `NgComponentOutlet` directive.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Dynamic Components and ng-template

## Dynamic Components and ng-template

### Why It Matters

Render components dynamically with `ViewContainerRef. createComponent`, use `ng-template` and `TemplateRef` for reusable markup, and explore the modern `NgComponentOutlet` directive.

Render components dynamically with `ViewContainerRef.createComponent`, use `ng-template` and `TemplateRef` for reusable markup, and explore the modern `NgComponentOutlet` directive.

### Prerequisites

- Stage 14: Content Projection and ViewChild/ContentChild (you understand template refs and queries).
- Stage 6: Services and DI (you understand `inject()` and providers).

### Topics

- `ViewContainerRef.createComponent(Component)` API
- `ng-template` and `TemplateRef` — embedding markup without rendering
- `[ngTemplateOutlet]` and `[ngTemplateOutletContext]`
- `NgComponentOutlet` directive for declarative dynamic components
- Passing inputs/outputs to dynamically created components
- Destroying dynamic components and cleanup with `DestroyRef`
- Use cases: toasts, modals, tooltips, dynamic dashboards
- `ApplicationRef` and `createComponent` outside a view container (rare)

### Key Concepts

- `ViewContainerRef` is the API to programmatically add/remove components or templates
- A `TemplateRef` is a chunk of template that hasn't been rendered; rendering creates a view
- `createComponent` returns a `ComponentRef` with `.setInput()` and `.instance` for interaction
- `NgComponentOutlet` is the declarative equivalent: `<ng-container [ngComponentOutlet]="Comp" [ngComponentOutletInputs]="{...}">`
- Dynamic components are crucial for overlays (toasts, modals) — created on demand, destroyed on dismiss

```typescript
import { Component, ViewChild, ViewContainerRef, TemplateRef, inject, ViewRef } from '@angular/core';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  template: `<div #vc></div>`,
})
export class ToastHostComponent {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vcr!: ViewContainerRef;

  show(message: string, type: 'info' | 'error' = 'info') {
    const ref = this.vcr.createComponent(ToastComponent);
    ref.setInput('message', message);
    ref.setInput('type', type);
    ref.instance.close.subscribe(() => ref.destroy());
    // Auto-destroy after 3s
    setTimeout(() => ref.destroy(), 3000);
  }
}
```
Caption: ViewContainerRef.createComponent with inputs/outputs

### Common Pitfalls

- Calling `createComponent` without attaching the view (when using `ApplicationRef` directly) — the component is created but never rendered; call `appRef.attachView(ref.hostView)` and append the host element to the DOM.
- Forgetting to `destroy()` dynamically created components — they leak DOM, listeners, and subscriptions; track them and destroy on dismiss.
- Using `setInput` on a component whose inputs are not declared — silently no-ops; ensure the input name matches the `input()` field.
- Reading `ref.instance.someField` before the component is initialized — `instance` is available immediately, but inputs set via `setInput` propagate after `ngOnChanges`/`ngOnInit`; use `effect` in the child for reactive input handling.
- Mutating the `ngComponentOutletInputs` object reference instead of replacing it — NgComponentOutlet uses reference equality; create a new object on each change to trigger input updates.

### Real-World Applications

- Google Ads uses dynamic components to render arbitrary widgets in a customizable dashboard, with `NgComponentOutlet` for declarative switching.
- PayPal's toast notification service uses `ViewContainerRef.createComponent` to spawn transient messages on demand.
- Upwork's analytics dashboard uses dynamic charts (bar/pie/line) switched via `NgComponentOutlet` and a shared `data` input.
- Microsoft Teams uses a `ModalService` that attaches modal components to `document.body` outside the calling component's tree, preventing parent CD from affecting the modal.

### Interview Questions

- 1. What's the difference between `ng-template` and `ng-container`? — `ng-template` is a chunk of template not rendered until instantiated; `ng-container` is a logical grouping that renders nothing but applies directives/structural logic.
- 2. How do you pass data into a `TemplateRef`? — Via `ngTemplateOutletContext` with `$implicit` for the default value and named keys for the rest; read via `let-x` (implicit) and `let-y="name"` in the template.
- 3. When would you use `createComponent` over `NgComponentOutlet`? — Programmatic, on-demand creation (toasts, modals, tooltips, overlays attached to body); `NgComponentOutlet` for declarative, in-template switching.
- 4. What does `ViewContainerRef` provide? — APIs to create/remove embedded views (templates) and component views, manage length, and access the parent element.
- 5. How do you destroy a dynamically created component? — Call `ref.destroy()` (for `ViewContainerRef.createComponent`) — also removes its DOM, listeners, and tear-down hooks; for `createComponent` standalone, also `appRef.detachView(ref.hostView)`.

### Mini Project

Build a "Toast System": A `ToastService` that dynamically creates `ToastComponent` instances, stacks them top-right, auto-dismisses after 3s, and supports a manual close button. Use `ApplicationRef.attachView` to render outside any specific component. Suggested approach:
  - Create `ToastComponent` with `message = input<string>()` and `close = output<void>()`
  - Build `ToastService` using `createComponent(ModalComponent, { hostElement: document.body, ... })`
  - Attach the view via `appRef.attachView(ref.hostView)`
  - Subscribe to `close` to call `ref.destroy()` and `appRef.detachView`
  - Stack toasts by appending to a `position: fixed` container

### Exercises

1. Use `ViewContainerRef.createComponent` to render a `BannerComponent` on button click.
2. Pass an input and subscribe to an output on the dynamically created component.
3. Replace `createComponent` with `NgComponentOutlet` for declarative dynamic rendering.
4. Build an `<app-repeater>` that renders a projected `<ng-template #item let-x>` for each array item.
5. Create a `ModalService.open()` that attaches a `ModalComponent` to `document.body` and destroys it on close.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which service lets you programmatically create a component view?
9. A) TemplateRef
10. B) ApplicationRef only
11. C) ViewContainerRef (*)
12. D) ComponentRef
13. Explanation: `ViewContainerRef.createComponent(Component)` creates a component instance and inserts its view; `createComponent` (from `@angular/core`) creates a standalone ref.
14. Q2: Which tag wraps template content that is NOT rendered until instantiated?
15. A) <ng-container>
16. B) <template>
17. C) <div hidden>
18. D) <ng-template> (*)
19. Explanation: `<ng-template>` declares a `TemplateRef` that doesn't render until instantiated via `ngTemplateOutlet` or `ViewContainerRef.createEmbeddedView`.
20. Q3: Which directive declaratively renders a dynamic component?
21. A) NgComponentOutlet (*)
22. B) NgComponent
23. C) ComponentOutlet
24. D) DynamicComponent
25. Explanation: `<ng-container [ngComponentOutlet]="Comp" [ngComponentOutletInputs]="{...}">` is the declarative way to render a dynamic component, replacing imperative `createComponent`.
26. Q4: How do you pass an input to a dynamically created `ComponentRef`?
27. A) ref.instance.input = value
28. B) ref.setInput(name, value) (*)
29. C) ref.input(name).set(value)
30. D) ref.set(name, value)
31. Explanation: `ref.setInput(name, value)` triggers Angular's input pipeline (signals or @Input) — use this instead of directly assigning `ref.instance.x` which bypasses reactivity.
32. Q5: Which context key provides the default `let-x` value in a projected template?
33. A) $default
34. B) $value
35. C) $implicit (*)
36. D) $item
37. Explanation: `$implicit` is the default context value accessed via `let-x` (no name); named keys are accessed via `let-y="name"`.
38. Q6: What must you do after `createComponent` (standalone, not ViewContainerRef) to render the host?
39. A) Nothing — it auto-renders
40. B) Call ref.render()
41. C) Call ref.attach()
42. D) Call appRef.attachView(ref.hostView) and append the host element to the DOM (*)
43. Explanation: When using `createComponent` standalone, you must attach the view to the application (`appRef.attachView`) and add the host element to the DOM manually.
44. Q7: How do you clean up a dynamically created component?
45. A) ref.destroy() (and appRef.detachView for standalone) (*)
46. B) Set ref = null
47. C) ref.remove()
48. D) document.removeChild
49. Explanation: `ref.destroy()` removes the component, its view, listeners, and triggers `ngOnDestroy`; for standalone `createComponent`, also call `appRef.detachView(ref.hostView)`.
50. Q8: Which is a use case for dynamic components?
51. A) Static navigation
52. B) Toast/modals/overlays created on demand (*)
53. C) Two-way binding
54. D) Form validation
55. Explanation: Dynamic components are essential for overlays (toasts, modals, tooltips) created programmatically and destroyed on dismiss — they're not tied to the template lifecycle.
56. Q9: Which NgComponentOutlet input passes a map of inputs to the rendered component?
57. A) [ngComponentOutletData]
58. B) [inputs]
59. C) [ngComponentOutletInputs] (*)
60. D) [props]
61. Explanation: `[ngComponentOutletInputs]="{ data: chartData() }"` passes a map of inputs that NgComponentOutlet sets on the rendered component via `setInput`.
62. Q10: What does `TemplateRef<T>` represent?
63. A) A rendered DOM element
64. B) A component instance
65. C) A view container
66. D) An unrendered template chunk with context type T (*)
67. Explanation: `TemplateRef<T>` is the reference to an `<ng-template>` (or structural directive's template), not yet rendered; instantiating it creates an `EmbeddedViewRef` with context T.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which service lets you programmatically create a component view?
  options:
    - TemplateRef
    - ApplicationRef only
    - ViewContainerRef
    - ComponentRef
  correctIndex: 2
  explanation: "`ViewContainerRef.createComponent(Component)` creates a component instance and inserts its view; `createComponent` (from `@angular/core`) creates a standalone ref."
- id: q2
  question: Which tag wraps template content that is NOT rendered until instantiated?
  options:
    - <ng-container>
    - <template>
    - <div hidden>
    - <ng-template>
  correctIndex: 3
  explanation: "`<ng-template>` declares a `TemplateRef` that doesn't render until instantiated via `ngTemplateOutlet` or `ViewContainerRef.createEmbeddedView`."
- id: q3
  question: Which directive declaratively renders a dynamic component?
  options:
    - NgComponentOutlet
    - NgComponent
    - ComponentOutlet
    - DynamicComponent
  correctIndex: 0
  explanation: '`<ng-container [ngComponentOutlet]="Comp" [ngComponentOutletInputs]="{...}">` is the declarative way to render a dynamic component, replacing imperative `createComponent`.'
- id: q4
  question: How do you pass an input to a dynamically created `ComponentRef`?
  options:
    - ref.instance.input = value
    - ref.setInput(name, value)
    - ref.input(name).set(value)
    - ref.set(name, value)
  correctIndex: 1
  explanation: "`ref.setInput(name, value)` triggers Angular's input pipeline (signals or @Input) — use this instead of directly assigning `ref.instance.x` which bypasses reactivity."
- id: q5
  question: Which context key provides the default `let-x` value in a projected template?
  options:
    - $default
    - $value
    - $implicit
    - $item
  correctIndex: 2
  explanation: '`$implicit` is the default context value accessed via `let-x` (no name); named keys are accessed via `let-y="name"`.'
- id: q6
  question: What must you do after `createComponent` (standalone, not ViewContainerRef) to render the host?
  options:
    - Nothing — it auto-renders
    - Call ref.render()
    - Call ref.attach()
    - Call appRef.attachView(ref.hostView) and append the host element to the DOM
  correctIndex: 3
  explanation: When using `createComponent` standalone, you must attach the view to the application (`appRef.attachView`) and add the host element to the DOM manually.
- id: q7
  question: How do you clean up a dynamically created component?
  options:
    - ref.destroy() (and appRef.detachView for standalone)
    - Set ref = null
    - ref.remove()
    - document.removeChild
  correctIndex: 0
  explanation: "`ref.destroy()` removes the component, its view, listeners, and triggers `ngOnDestroy`; for standalone `createComponent`, also call `appRef.detachView(ref.hostView)`."
- id: q8
  question: Which is a use case for dynamic components?
  options:
    - Static navigation
    - Toast/modals/overlays created on demand
    - Two-way binding
    - Form validation
  correctIndex: 1
  explanation: Dynamic components are essential for overlays (toasts, modals, tooltips) created programmatically and destroyed on dismiss — they're not tied to the template lifecycle.
- id: q9
  question: Which NgComponentOutlet input passes a map of inputs to the rendered component?
  options:
    - "[ngComponentOutletData]"
    - "[inputs]"
    - "[ngComponentOutletInputs]"
    - "[props]"
  correctIndex: 2
  explanation: '`[ngComponentOutletInputs]="{ data: chartData() }"` passes a map of inputs that NgComponentOutlet sets on the rendered component via `setInput`.'
- id: q10
  question: What does `TemplateRef<T>` represent?
  options:
    - A rendered DOM element
    - A component instance
    - A view container
    - An unrendered template chunk with context type T
  correctIndex: 3
  explanation: "`TemplateRef<T>` is the reference to an `<ng-template>` (or structural directive's template), not yet rendered; instantiating it creates an `EmbeddedViewRef` with context T."
```

