---
slug: angular-forms-template-driven-reactive
id: angular-10
track: angular
order: 10
title: Forms — Template-Driven and Reactive
description: Build template-driven forms with `ngModel` and reactive forms with `FormControl`/`FormGroup`/`FormBuilder`, validate input, and integrate with signals.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=270s
whyItMatters: Build template-driven forms with `ngModel` and reactive forms with `FormControl`/`FormGroup`/`FormBuilder`, validate input, and integrate with signals.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Forms — Template-Driven and Reactive

## Forms — Template-Driven and Reactive

### Why It Matters

Build template-driven forms with `ngModel` and reactive forms with `FormControl`/`FormGroup`/`FormBuilder`, validate input, and integrate with signals.

Build template-driven forms with `ngModel` and reactive forms with `FormControl`/`FormGroup`/`FormBuilder`, validate input, and integrate with signals.

### Prerequisites

- Stage 9: RxJS Fundamentals (you understand Observables and `combineLatest`).
- Stage 3: Data Binding (you can use `[(ngModel)]`).
- Familiarity with HTML form elements and validation.

### Topics

- Template-driven forms: `FormsModule`, `ngModel`, `#f="ngForm"`, `ngModelGroup`
- Reactive forms: `ReactiveFormsModule`, `FormControl`, `FormGroup`, `FormArray`, `FormBuilder`
- Built-in validators: `required`, `minlength`, `maxlength`, `pattern`, `email`
- Custom validators: synchronous and asynchronous
- Cross-field validation with `FormGroup`-level validators
- `FormBuilder.nonNullable` and typed forms
- `valueChanges` and `statusChanges` Observables
- Signals integration: `toSignal(form.valueChanges)` and `form.controls.email` typed access

### Key Concepts

- Template-driven forms are async (Angular builds the model after the view); reactive forms are sync (model first)
- Reactive forms scale better — easier testing, custom validators, dynamic fields, and immutability
- `FormBuilder.nonNullable.group({...})` produces typed forms where empty fields don't become `null`
- Async validators return `Observable<ValidationErrors | null>` and run after sync validators pass
- Modern reactive forms expose typed `controls.x` access — no more `get('name')` casting

```typescript
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-td',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f)" novalidate>
      <label>Email
        <input name="email" ngModel email required #email="ngModel" />
      </label>
      @if (email.invalid && email.touched) {
        <p class="err">Valid email required.</p>
      }
      <label>Password
        <input name="password" type="password" ngModel required minlength="8" />
      </label>
      <button [disabled]="f.invalid">Login</button>
    </form>
  `,
})
export class LoginTdComponent {
  onSubmit(f: NgForm) {
    if (f.valid) {
      console.log(f.value); // { email: '...', password: '...' }
    }
  }
}
```
Caption: Template-driven form

### Common Pitfalls

- Using template-driven forms for complex cross-field validation — `ngModel` makes it hard; switch to reactive forms where validators live on the `FormGroup`.
- Forgetting `novalidate` on `<form>` — the browser's native validation UI intercepts submit and hides Angular's invalid styling; add it.
- Mutating `form.value` directly — it's read-only; use `form.patchValue({...})` or `form.setValue({...})` to update.
- Casting `form.get('x')` to `FormControl` everywhere — modern typed forms expose `form.controls.x` directly, preserving types.
- Calling async validators on every keystroke without debouncing — they fire per change, hammering your API; debounce via a wrapper or use the `updateOn: 'blur'` option.

### Real-World Applications

- PayPal's checkout form uses reactive forms with custom cross-field validators for billing address vs shipping address consistency.
- Upwork's job post creation uses FormArray for skills, milestones, and questions — dynamically addable/removable.
- Google Ads' campaign creation uses a giant reactive form (500+ fields) with conditional validation rules and async uniqueness checks.
- Microsoft Office Online's settings forms use `updateOn: 'blur'` to avoid re-validating on every keystroke.

### Interview Questions

- 1. When would you pick template-driven over reactive forms? — Template-driven for simple forms where the template is the source of truth; reactive for complex, dynamic, or heavily-tested forms.
- 2. What's `FormBuilder.nonNullable`? — A variant where empty fields default to `''` instead of `null`, producing fully-typed forms where `value` is non-nullable.
- 3. How do async validators differ from sync ones? — They return `Observable<ValidationErrors | null>` or a Promise; they run only after sync validators pass and have `updateOn` semantics.
- 4. What does `updateOn: 'blur'` do? — Defers form value/validity updates until the field loses focus, reducing re-validation noise on every keystroke.
- 5. How do you add a field dynamically in a reactive form? — Use `FormArray` and `push`/`removeAt`; bind with `formArrayName` and iterate `array.controls` in the template.

### Mini Project

Build a "Multi-step Registration" form: A reactive form across three steps (email/password, profile info, address), each with validators, a "Next" button that gates on the current step's validity, and a final review panel. Suggested approach:
  - Use `FormBuilder.nonNullable.group` with nested `FormGroup`s for each step
  - Add cross-step validation (e.g., password confirmation match) at the root level
  - Track current step in a signal and gate `Next` with `step.invalid`
  - Show progress dots and back/next buttons
  - On final submit, log `form.getRawValue()` to the console

### Exercises

1. Build a template-driven login form with `email` + `required` validators and submit on valid.
2. Convert it to reactive forms using `FormBuilder.nonNullable.group`.
3. Add a custom `matchPassword` validator on a `FormGroup` to verify password === confirm.
4. Build a `FormArray` of skills with add/remove buttons.
5. Add an async validator that checks email uniqueness against a mocked API with a 300ms debounce.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which module is required for `[(ngModel)]` and template-driven forms?
9. A) ReactiveFormsModule
10. B) FormsModule (*)
11. C) CommonModule
12. D) HttpClientModule
13. Explanation: `FormsModule` provides `ngModel` and template-driven form directives; standalone components must add it to `imports: [...]`.
14. Q2: Which module provides `FormControl`, `FormGroup`, and `FormBuilder`?
15. A) FormsModule
16. B) FormsCore
17. C) ReactiveFormsModule (*)
18. D) NgModelModule
19. Explanation: `ReactiveFormsModule` exports the reactive forms APIs — FormControl, FormGroup, FormArray, FormBuilder, and the `formControlName` directive.
20. Q3: What does `FormBuilder.nonNullable.group({...})` produce?
21. A) A form whose values are always null
22. B) A form without validators
23. C) A form with no submit handler
24. D) A typed form where empty fields default to '' instead of null (*)
25. Explanation: `nonNullable` makes controls non-nullable — empty fields stay `''` (or `0` for numbers), and `form.value` is typed as non-nullable throughout.
26. Q4: Which form type builds the model asynchronously from the template?
27. A) Template-driven forms (*)
28. B) Reactive forms
29. C) Both
30. D) Neither
31. Explanation: Template-driven forms create the model after the view initializes (async); reactive forms declare the model first (sync) and bind it to the view.
32. Q5: Where do cross-field validators (e.g. password match) live?
33. A) On the individual FormControl
34. B) On the FormGroup (*)
35. C) On the template only
36. D) On the form element's class
37. Explanation: Cross-field validators are attached to the FormGroup (or FormArray) so they can read multiple child controls at once.
38. Q6: Which property on a FormControl reflects its sync validation state?
39. A) .value
40. B) .dirty
41. C) .status ('VALID' | 'INVALID' | 'PENDING' | 'DISABLED') (*)
42. D) .untouched
43. Explanation: `status` is `'VALID'`, `'INVALID'`, `'PENDING'` (async in flight), or `'DISABLED'`; the `valid`/`invalid` getters derive from this.
44. Q7: Which Observable emits on every form value change?
45. A) form.statusChanges
46. B) form.submit
47. C) form.input
48. D) form.valueChanges (*)
49. Explanation: `valueChanges` is a hot Observable firing on each value change; `statusChanges` fires on validity transitions.
50. Q8: What does `updateOn: 'blur'` do on a FormControl?
51. A) Defers value/validity updates until the field loses focus (*)
52. B) Disables validation
53. C) Updates on every keystroke
54. D) Updates on form submit only
55. Explanation: `updateOn: 'blur'` (default is `'change'`) delays the value/validity events until blur, reducing re-validation noise during typing.
56. Q9: How do you add a field to a FormArray?
57. A) array.set(i, control)
58. B) array.push(control) (*)
59. C) array.add(control)
60. D) array.concat(control)
61. Explanation: `FormArray.push(control)` appends; `insert(index, control)` inserts at a position; `removeAt(index)` removes.
62. Q10: What is the recommended way to access a typed control in modern reactive forms?
63. A) form.get('email') as FormControl
64. B) form.find('email')
65. C) form.controls.email (*)
66. D) form.at('email')
67. Explanation: Modern typed forms expose `form.controls.<name>` directly with preserved types, avoiding the `as FormControl` cast that `form.get(...)` requires.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which module is required for `[(ngModel)]` and template-driven forms?
  options:
    - ReactiveFormsModule
    - FormsModule
    - CommonModule
    - HttpClientModule
  correctIndex: 1
  explanation: "`FormsModule` provides `ngModel` and template-driven form directives; standalone components must add it to `imports: [...]`."
- id: q2
  question: Which module provides `FormControl`, `FormGroup`, and `FormBuilder`?
  options:
    - FormsModule
    - FormsCore
    - ReactiveFormsModule
    - NgModelModule
  correctIndex: 2
  explanation: "`ReactiveFormsModule` exports the reactive forms APIs — FormControl, FormGroup, FormArray, FormBuilder, and the `formControlName` directive."
- id: q3
  question: What does `FormBuilder.nonNullable.group({...})` produce?
  options:
    - A form whose values are always null
    - A form without validators
    - A form with no submit handler
    - A typed form where empty fields default to '' instead of null
  correctIndex: 3
  explanation: "`nonNullable` makes controls non-nullable — empty fields stay `''` (or `0` for numbers), and `form.value` is typed as non-nullable throughout."
- id: q4
  question: Which form type builds the model asynchronously from the template?
  options:
    - Template-driven forms
    - Reactive forms
    - Both
    - Neither
  correctIndex: 0
  explanation: Template-driven forms create the model after the view initializes (async); reactive forms declare the model first (sync) and bind it to the view.
- id: q5
  question: Where do cross-field validators (e.g. password match) live?
  options:
    - On the individual FormControl
    - On the FormGroup
    - On the template only
    - On the form element's class
  correctIndex: 1
  explanation: Cross-field validators are attached to the FormGroup (or FormArray) so they can read multiple child controls at once.
- id: q6
  question: Which property on a FormControl reflects its sync validation state?
  options:
    - .value
    - .dirty
    - .status ('VALID' | 'INVALID' | 'PENDING' | 'DISABLED')
    - .untouched
  correctIndex: 2
  explanation: "`status` is `'VALID'`, `'INVALID'`, `'PENDING'` (async in flight), or `'DISABLED'`; the `valid`/`invalid` getters derive from this."
- id: q7
  question: Which Observable emits on every form value change?
  options:
    - form.statusChanges
    - form.submit
    - form.input
    - form.valueChanges
  correctIndex: 3
  explanation: "`valueChanges` is a hot Observable firing on each value change; `statusChanges` fires on validity transitions."
- id: q8
  question: "What does `updateOn: 'blur'` do on a FormControl?"
  options:
    - Defers value/validity updates until the field loses focus
    - Disables validation
    - Updates on every keystroke
    - Updates on form submit only
  correctIndex: 0
  explanation: "`updateOn: 'blur'` (default is `'change'`) delays the value/validity events until blur, reducing re-validation noise during typing."
- id: q9
  question: How do you add a field to a FormArray?
  options:
    - array.set(i, control)
    - array.push(control)
    - array.add(control)
    - array.concat(control)
  correctIndex: 1
  explanation: "`FormArray.push(control)` appends; `insert(index, control)` inserts at a position; `removeAt(index)` removes."
- id: q10
  question: What is the recommended way to access a typed control in modern reactive forms?
  options:
    - form.get('email') as FormControl
    - form.find('email')
    - form.controls.email
    - form.at('email')
  correctIndex: 2
  explanation: Modern typed forms expose `form.controls.<name>` directly with preserved types, avoiding the `as FormControl` cast that `form.get(...)` requires.
```

