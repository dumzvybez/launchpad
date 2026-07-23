---
slug: angular-data-binding-interpolation-property-event-two-way
id: angular-03
track: angular
order: 3
title: Data Binding — Interpolation, Property, Event, Two-Way
description: Master the four binding kinds — interpolation, property, event, and two-way — and understand Angular's binding syntax, security model, and the new control flow's interaction with bindings.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=60s
whyItMatters: Master the four binding kinds — interpolation, property, event, and two-way — and understand Angular's binding syntax, security model, and the new control flow's interaction with bindings.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Data Binding — Interpolation, Property, Event, Two-Way

## Data Binding — Interpolation, Property, Event, Two-Way

### Why It Matters

Master the four binding kinds — interpolation, property, event, and two-way — and understand Angular's binding syntax, security model, and the new control flow's interaction with bindings.

Master the four binding kinds — interpolation, property, event, and two-way — and understand Angular's binding syntax, security model, and the new control flow's interaction with bindings.

### Prerequisites

- Stage 2: Components and Templates (you can build a standalone component with inputs/outputs).
- Familiarity with DOM events and HTML attributes vs properties.

### Topics

- Interpolation: `{{ expression }}` for text
- Property binding: `[prop]="expr"` for HTML/DOM properties
- Attribute binding: `[attr.aria-label]="expr"` and `[class.foo]` / `[style.width.px]`
- Event binding: `(event)="handler($event)"` and `$event` payload
- Two-way binding: `[(ngModel)]="x"` (FormsModule) and `[(myModel)]="x"` (signal `model()`)
- Template reference variables: `#ref` and `ref.value`
- Safe navigation: `user?.address?.city`
- Security: Angular's automatic sanitization and `[innerHtml]` with `DomSanitizer`

### Key Concepts

- Every binding is one-directional from the source-of-truth to the target; two-way binding is sugar for `[x]` + `(xChange)`
- Property binding uses DOM properties (not HTML attributes); `[disabled]` not `[attr.disabled]` when you want the JS property
- `[(ngModel)]` requires `FormsModule` (template-driven forms); the signal `model()` requires nothing extra
- Angular sanitizes interpolation and `[innerHtml]` by default — `bypassSecurityTrustHtml` is opt-in and dangerous
- Safe navigation (`?.`) only short-circuits in templates, not in TypeScript code

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-bindings',
  standalone: true,
  template: `
    <h1>{{ title() }}</h1>
    <img [src]="avatarUrl()" [alt]="title() + ' avatar'" />
    <button [disabled]="!canSubmit()" (click)="submit()">Submit</button>
    <p [style.color]="isError() ? 'red' : 'green'">Status: {{ status() }}</p>
  `,
})
export class BindingsComponent {
  title = signal('Bindings Demo');
  avatarUrl = signal('https://placehold.co/80x80');
  canSubmit = signal(true);
  isError = signal(false);
  status = signal('idle');

  submit() {
    this.status.set('submitted');
  }
}
```
Caption: Interpolation and property binding

### Common Pitfalls

- Binding to `[attr.disabled]` instead of `[disabled]` — `attr.disabled` sets the HTML attribute (string "true"/"false" both enable the button); use `[disabled]` to set the DOM property correctly.
- Using `[(ngModel)]` without importing `FormsModule` (or `[(formControl)]` without `ReactiveFormsModule`) — Angular fails to compile with "Unknown property ngModel"; add it to `imports: []`.
- Mutating the model in the child via `input().set(...)` — signal inputs are read-only; calling `.set()` throws at runtime; use `model()` for two-way.
- Forgetting to sanitize user-supplied HTML before binding to `[innerHtml]` — Angular sanitizes by default, but `bypassSecurityTrustHtml` opens XSS holes; only use it on trusted, server-validated content.
- Confusing `#ref` (template reference) with `$event` (event payload) — `#ref` captures the DOM element/component, `$event` captures the emitted event; mixing them up leads to "undefined" or wrong data.

### Real-World Applications

- PayPal's checkout form uses `[(ngModel)]` two-way bindings on country, currency, and amount inputs, validated in real time by Reactive Forms.
- Upwork's job search uses property bindings `[routerLink]` and `[queryParams]` to compose search URLs from bound state.
- Microsoft Teams' settings panels use `[disabled]` bindings driven by permission signals to gate admin-only actions.
- Forbes' real-time ticker uses event bindings `(input)` on a search field to filter headlines through a debounced service call.

### Interview Questions

- 1. What's the difference between `[disabled]` and `[attr.disabled]`? — `[disabled]` sets the DOM property (boolean, correct behavior); `[attr.disabled]` sets the HTML attribute (any non-null value disables), which is rarely what you want.
- 2. How does `[(ngModel)]` desugar? — It expands to `[ngModel]="x" (ngModelChange)="x = $event"`; the `FormsModule` directive provides `ngModel` and emits `ngModelChange` on input.
- 3. What does the `?.` safe navigation operator do? — It short-circuits to `undefined` if any step on the chain is nullish; it's a template-only feature (in TypeScript code use optional chaining `?.` directly).
- 4. How does Angular protect against XSS in bindings? — Interpolation and `[innerHtml]` sanitize by default (stripping scripts and unsafe attributes); `bypassSecurityTrust*` is the opt-out for trusted content.
- 5. When would you use a template reference variable (`#ref`)? — To capture an element, directive, or component instance from the template and pass it to a handler or use it elsewhere in the same template.

### Mini Project

Build a "Color Picker" component: A standalone component that shows a color preview swatch, three range sliders (R/G/B), and a hex code input. Use property bindings to set slider values, event bindings to read changes, and `model()` to expose the current color as a two-way binding. Suggested approach:
  - Create `color-picker.component.ts` with `color = model<string>('#000000')`
  - Add three `<input type="range">` sliders with `[value]` and `(input)` bindings
  - Compute R/G/B from the hex with `computed()` and write back via `color.set(...)`
  - Display a `<div [style.background]="color()">` swatch
  - Add an `<input [(ngModel)]="hexInput">` (import FormsModule) for the hex code

### Exercises

1. Create a button whose `[disabled]` binding reflects a `canSubmit()` signal; toggle the signal from another button.
2. Add an `(input)` handler that uppercases text and binds it back to a `<p>` via interpolation.
3. Use `[class.active]="isActive()"` and `[style.fontSize.px]="size()"` to style an element reactively.
4. Convert a template-driven `[(ngModel)]` input to a signal `model()` two-way binding.
5. Add a template reference `#email` to an input and read `email.value` from a button click handler.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which syntax binds a DOM property (not an HTML attribute)?
9. A) attr.disabled="value"
10. B) disabled="{{ canSubmit() }}"
11. C) [disabled]="canSubmit()" (*)
12. D) (disabled)="canSubmit()"
13. Explanation: Square brackets `[prop]` bind to the DOM property; `[attr.x]` is for HTML attributes; `{{ }}` only works for interpolation into text content.
14. Q2: How does `[(ngModel)]="x"` desugar?
15. A) [ngModel]="x" only
16. B) (ngModelChange)="x($event)" only
17. C) [ngModelChange]="x" (ngModel)="x = $event"
18. D) [ngModel]="x" (ngModelChange)="x = $event" (*)
19. Explanation: Two-way banana-in-a-box syntax expands to property binding plus event binding; `ngModelChange` carries the new value as `$event`.
20. Q3: Which import is required to use `[(ngModel)]` in a standalone component?
21. A) FormsModule (*)
22. B) CommonModule
23. C) ReactiveFormsModule
24. D) No import needed
25. Explanation: `ngModel` is the template-driven forms directive, provided by `FormsModule`; standalone components must add it to `imports: [...]`.
26. Q4: What does `user?.address?.city` evaluate to in a template when `user` is null?
27. A) Throws "Cannot read property 'address' of null"
28. B) Returns undefined without throwing (*)
29. C) Returns the empty string
30. D) Returns null only if address is null
31. Explanation: The safe navigation operator `?.` short-circuits the rest of the chain to undefined; equivalent to optional chaining in TypeScript but recognized by the Angular template compiler.
32. Q5: Which API does Angular use to opt OUT of HTML sanitization for `[innerHtml]`?
33. A) innerHtml="trusted: ..."
34. B) [innerHtmlUnsafe]="..."
35. C) bypassSecurityTrustHtml(...) on DomSanitizer (*)
36. D) noEscape attribute
37. Explanation: `DomSanitizer.bypassSecurityTrustHtml()` returns a `SafeHtml` that Angular trusts verbatim; only use it on content you fully control to avoid XSS.
38. Q6: Which binding sets a CSS class conditionally?
39. A) class="{{ isActive() ? 'active' : '' }}"
40. B) (class)="isActive()"
41. C) [[class]]="active"
42. D) [class.active]="isActive()" (*)
43. Explanation: `[class.foo]="expr"` toggles class `foo` based on the expression's truthiness; `[class]="stringExpr"` replaces the whole class attribute.
44. Q7: Which template reference syntax captures an input element?
45. A) #field (*)
46. B) &input
47. C) $input
48. D) ref-input
49. Explanation: `#field` (or `ref-field`) creates a template reference variable pointing to the DOM element or directive instance on that element.
50. Q8: What is the event payload variable inside `(click)="handler($event)"`?
51. A) The component class
52. B) The DOM MouseEvent (*)
53. C) The button text
54. D) The template reference
55. Explanation: `$event` is the emitted event payload; for native DOM events it's the standard DOM Event object (MouseEvent, InputEvent, etc.).
56. Q9: What's a two-way signal binding using `model()` look like in the parent template?
57. A) [model]="x"
58. B) (modelChange)="x = $event"
59. C) [(x)]="parentSignal" where the child declares `x = model(...)` (*)
60. D) [[x]]="parentSignal"
61. Explanation: The banana-in-a-box syntax `[(x)]` works with `model()` signals out of the box; the child's `x = model()` is both an input and an output.
62. Q10: Which is a correct way to bind a numeric style value with units?
63. A) [style.fontSize]="size() + 'px'"
64. B) Both A and B work, but A is the canonical unit-suffix form
65. C) Neither works — you must use inline styles
66. D) [style.fontSize.px]="size()" (*)
67. Explanation: Both forms work; `[style.prop.unit]="expr"` is the canonical Angular unit-suffix form, while `[style.prop]="expr"` accepts any string (e.g. `'12px'`).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which syntax binds a DOM property (not an HTML attribute)?
  options:
    - attr.disabled="value"
    - disabled="{{ canSubmit() }}"
    - '[disabled]="canSubmit()"'
    - (disabled)="canSubmit()"
  correctIndex: 2
  explanation: Square brackets `[prop]` bind to the DOM property; `[attr.x]` is for HTML attributes; `{{ }}` only works for interpolation into text content.
- id: q2
  question: How does `[(ngModel)]="x"` desugar?
  options:
    - '[ngModel]="x" only'
    - (ngModelChange)="x($event)" only
    - '[ngModelChange]="x" (ngModel)="x = $event"'
    - '[ngModel]="x" (ngModelChange)="x = $event"'
  correctIndex: 3
  explanation: Two-way banana-in-a-box syntax expands to property binding plus event binding; `ngModelChange` carries the new value as `$event`.
- id: q3
  question: Which import is required to use `[(ngModel)]` in a standalone component?
  options:
    - FormsModule
    - CommonModule
    - ReactiveFormsModule
    - No import needed
  correctIndex: 0
  explanation: "`ngModel` is the template-driven forms directive, provided by `FormsModule`; standalone components must add it to `imports: [...]`."
- id: q4
  question: What does `user?.address?.city` evaluate to in a template when `user` is null?
  options:
    - Throws "Cannot read property 'address' of null"
    - Returns undefined without throwing
    - Returns the empty string
    - Returns null only if address is null
  correctIndex: 1
  explanation: The safe navigation operator `?.` short-circuits the rest of the chain to undefined; equivalent to optional chaining in TypeScript but recognized by the Angular template compiler.
- id: q5
  question: Which API does Angular use to opt OUT of HTML sanitization for `[innerHtml]`?
  options:
    - 'innerHtml="trusted: ..."'
    - '[innerHtmlUnsafe]="..."'
    - bypassSecurityTrustHtml(...) on DomSanitizer
    - noEscape attribute
  correctIndex: 2
  explanation: "`DomSanitizer.bypassSecurityTrustHtml()` returns a `SafeHtml` that Angular trusts verbatim; only use it on content you fully control to avoid XSS."
- id: q6
  question: Which binding sets a CSS class conditionally?
  options:
    - "class=\"{{ isActive() ? 'active' : '' }}\""
    - (class)="isActive()"
    - '[[class]]="active"'
    - '[class.active]="isActive()"'
  correctIndex: 3
  explanation: "`[class.foo]=\"expr\"` toggles class `foo` based on the expression's truthiness; `[class]=\"stringExpr\"` replaces the whole class attribute."
- id: q7
  question: Which template reference syntax captures an input element?
  options:
    - "#field"
    - "&input"
    - $input
    - ref-input
  correctIndex: 0
  explanation: "`#field` (or `ref-field`) creates a template reference variable pointing to the DOM element or directive instance on that element."
- id: q8
  question: What is the event payload variable inside `(click)="handler($event)"`?
  options:
    - The component class
    - The DOM MouseEvent
    - The button text
    - The template reference
  correctIndex: 1
  explanation: "`$event` is the emitted event payload; for native DOM events it's the standard DOM Event object (MouseEvent, InputEvent, etc.)."
- id: q9
  question: What's a two-way signal binding using `model()` look like in the parent template?
  options:
    - '[model]="x"'
    - (modelChange)="x = $event"
    - '[(x)]="parentSignal" where the child declares `x = model(...)`'
    - '[[x]]="parentSignal"'
  correctIndex: 2
  explanation: The banana-in-a-box syntax `[(x)]` works with `model()` signals out of the box; the child's `x = model()` is both an input and an output.
- id: q10
  question: Which is a correct way to bind a numeric style value with units?
  options:
    - "[style.fontSize]=\"size() + 'px'\""
    - Both A and B work, but A is the canonical unit-suffix form
    - Neither works — you must use inline styles
    - '[style.fontSize.px]="size()"'
  correctIndex: 3
  explanation: Both forms work; `[style.prop.unit]="expr"` is the canonical Angular unit-suffix form, while `[style.prop]="expr"` accepts any string (e.g. `'12px'`).
```

