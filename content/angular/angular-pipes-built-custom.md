---
slug: angular-pipes-built-custom
id: angular-05
track: angular
order: 5
title: Pipes — Built-in and Custom
description: Use Angular's built-in pipes (date, currency, number, json, async) and author your own pure and impure pipes, with attention to the modern `@Pipe` standalone form.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ&t=120s
whyItMatters: Use Angular's built-in pipes (date, currency, number, json, async) and author your own pure and impure pipes, with attention to the modern `@Pipe` standalone form.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Pipes — Built-in and Custom

## Pipes — Built-in and Custom

### Why It Matters

Use Angular's built-in pipes (date, currency, number, json, async) and author your own pure and impure pipes, with attention to the modern `@Pipe` standalone form.

Use Angular's built-in pipes (date, currency, number, json, async) and author your own pure and impure pipes, with attention to the modern `@Pipe` standalone form.

### Prerequisites

- Stage 4: Directives (you understand structural and attribute directives).
- Familiarity with formatting data for display (dates, numbers, currency).

### Topics

- Built-in pipes: DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, JsonPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe
- AsyncPipe: unwrapping Observables and Promises in templates
- SlicePipe, KeyValuePipe
- Authoring a custom pipe with `@Pipe({ standalone: true })`
- Pure vs impure pipes and the `pure: false` flag
- Pipe parameters and chaining (`value | pipe1:arg1 | pipe2`)
- i18n-aware pipes: locale registration with `registerLocaleData`
- The new `@Pipe` transform signature and `pure` semantics with signals

### Key Concepts

- Pipes are pure functions: `transform(value, ...args)` returning a new value
- Pure pipes (default) re-run only when the input reference changes; impure pipes run every change detection cycle (perf cost)
- AsyncPipe subscribes to an Observable/Promise, returns the latest value, and unsubscribes on destroy — a leak-free shortcut
- Pipes chain left-to-right: `{{ value | date:'short' | uppercase }}`
- Locale-aware pipes need `registerLocaleData(locale)` in `main.ts` or via `LOCALE_ID` provider

```typescript
import { Component } from '@angular/core';
import { DatePipe, CurrencyPipe, UpperCasePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-pipes',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, UpperCasePipe, JsonPipe],
  template: `
    <p>{{ today | date:'medium' }}</p>
    <p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>
    <p>{{ name | uppercase }}</p>
    <pre>{{ obj | json }}</pre>
  `,
})
export class PipesComponent {
  today = new Date();
  price = 42.5;
  name = 'ada lovelace';
  obj = { id: 1, role: 'admin' };
}
```
Caption: Built-in pipes

### Common Pitfalls

- Using `pure: false` pipes to filter arrays — they re-run on every change detection tick, killing perf; prefer filtering in a `computed()` or moving to a memoized service.
- Forgetting to import a pipe in a standalone component's `imports` — Angular fails with NG8004 "Unknown pipe"; add it.
- Mutating the input to a pure pipe and expecting re-evaluation — pure pipes use reference equality; mutating the same array does not trigger a re-run.
- Mixing up pipe argument order — `currency:'USD':'symbol':'1.2-2'` is `code : display : digitsInfo`; check the Angular docs when in doubt.
- Using AsyncPipe with `combineLatest` and forgetting the initial emit — combineLatest emits only after all sources emit at least once; show a loading state until then.

### Real-World Applications

- PayPal's transaction list formats amounts with `currency:'USD':'symbol':'1.2-2'` and shows dates with `date:'short'`, both locale-aware via `LOCALE_ID`.
- Google Ads' reporting dashboard uses a custom `appNumberCompact` pipe to render "1.2M" instead of "1,200,000" on metrics.
- Upwork's job feed uses AsyncPipe to unwrap a `BehaviorSubject<Job[]>` of search results directly in the template.
- Deutsche Bahn's connection list uses a custom `appDuration` pipe to format minutes into "1h 23m" strings.

### Interview Questions

- 1. What's the difference between a pure and an impure pipe? — Pure pipes re-run only when the input reference changes; impure (`pure: false`) re-run on every change detection cycle.
- 2. How does AsyncPipe avoid memory leaks? — It subscribes in `transform`, caches the latest value, and unsubscribes on the directive's `ngOnDestroy`.
- 3. When would you write a custom pipe vs a computed signal? — Pipes for presentation formatting reused across templates (`| currency`, `| filesize`); computed for stateful derivations tied to one component.
- 4. Why do locale-aware pipes need `registerLocaleData`? — Angular ships only the `en-US` locale by default to keep bundle size small; other locales must be registered manually in `main.ts`.
- 5. How do you pass arguments to a pipe? — Colon-separated: `value | pipe:arg1:arg2`; the pipe's `transform(value, arg1, arg2)` signature mirrors the order.

### Mini Project

Build a "Markdown-to-HTML" pipe: A custom pipe `appMarkdown` that converts simple markdown (`**bold**`, `*italic*`, `` `code` ``, `# heading`) to HTML and binds via `[innerHtml]`. Support a `safe` argument that bypasses sanitization for trusted content. Suggested approach:
  - Generate `markdown.pipe.ts` with `@Pipe({ name: 'appMarkdown', standalone: true })`
  - Implement `transform(md: string, safe = false): string | SafeHtml`
  - Inject `DomSanitizer` and call `bypassSecurityTrustHtml` only when `safe` is true
  - Use simple regex replacements for `**`, `*`, `` ` ``, and `#`
  - Use it in a component: `<div [innerHtml]="content | appMarkdown:true"></div>`

### Exercises

1. Use the `date` pipe with `'longDate'` and `'shortTime'` formats on a `Date` signal.
2. Chain `uppercase | slice:0:3` to display the first three letters of a name in caps.
3. Write a custom `appTruncate:50` pipe that truncates text to N chars and appends '...'.
4. Convert an `Observable<number>` to a value in the template using `async` pipe and display it.
5. Register a non-English locale (`de-DE`) in `main.ts` and use the `date` pipe to verify it formats with German month names.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which decorator marks a class as an Angular pipe?
9. A) @Pipe (*)
10. B) @Directive
11. C) @Injectable
12. D) @Component
13. Explanation: `@Pipe({ name, standalone })` declares a pipe; the class implements `PipeTransform.transform(value, ...args)`.
14. Q2: What is the default value of `pure` on a custom pipe?
15. A) false
16. B) true (*)
17. C) undefined — required
18. D) determined by change detection
19. Explanation: Pipes are pure by default, meaning they re-run only when the input reference changes; set `pure: false` for impure behavior.
20. Q3: What does AsyncPipe do?
21. A) Converts a Promise to a callback
22. B) Wraps a callback in an Observable
23. C) Subscribes to an Observable/Promise, returns the latest value, and unsubscribes on destroy (*)
24. D) Schedules change detection
25. Explanation: AsyncPipe handles subscription, value caching, and unsubscription, often replacing manual `subscribe` + `ngOnDestroy` plumbing.
26. Q4: Which is a correct way to pass multiple arguments to a pipe?
27. A) value | pipe(arg1, arg2)
28. B) value | pipe(arg1)(arg2)
29. C) value | pipe(arg1, arg2)
30. D) value | pipe:arg1:arg2 (*)
31. Explanation: Pipe arguments are colon-separated in templates; the pipe's `transform(value, arg1, arg2)` receives them positionally.
32. Q5: Why is `pure: false` on a filtering pipe an anti-pattern?
33. A) It re-runs every change detection cycle, killing performance on large lists (*)
34. B) It doesn't work with signals
35. C) It cannot accept arguments
36. D) It breaks AsyncPipe
37. Explanation: Impure pipes run on every CD tick; for array filtering, prefer a `computed()` signal or memoized service method to avoid O(n) work per tick.
38. Q6: Which built-in pipe renders an object as formatted JSON?
39. A) stringify
40. B) json (*)
41. C) object
42. D) pretty
43. Explanation: `JsonPipe` (`| json`) calls `JSON.stringify(value, null, 2)` for debugging nested objects in templates.
44. Q7: How do you make a pipe locale-aware for non-English formats?
45. A) Set `i18n: true` on the pipe
46. B) Use the Intl API only
47. C) Call `registerLocaleData(locale)` and provide `LOCALE_ID` (*)
48. D) Set the lang attribute on <html>
49. Explanation: Angular ships only `en-US` by default; register additional locales via `registerLocaleData(de)` in `main.ts` and provide `LOCALE_ID: 'de'`.
50. Q8: Which is a valid chain of pipes?
51. A) {{ name | uppercase >> slice:0:3 }}
52. B) {{ name | uppercase(slice(0,3)) }}
53. C) {{ uppercase(slice(name,0,3)) }}
54. D) {{ name | uppercase | slice:0:3 }} (*)
55. Explanation: Pipes chain left-to-right with `|`, each receiving the previous output; `name | uppercase | slice:0:3` uppercases then takes first 3 chars.
56. Q9: When does a pure pipe re-evaluate?
57. A) Only when the input reference changes (or any argument reference changes) (*)
58. B) Every keystroke
59. C) Every second
60. D) On route change
61. Explanation: Pure pipes use reference equality on inputs and arguments; mutating the same array does NOT trigger re-evaluation — replace the reference instead.
62. Q10: Which service must you inject to safely bypass HTML sanitization in a custom pipe?
63. A) Renderer2
64. B) DomSanitizer (*)
65. C) ElementRef
66. D) ChangeDetectorRef
67. Explanation: `DomSanitizer.bypassSecurityTrustHtml(...)` returns a `SafeHtml` that Angular passes through to `[innerHtml]` without sanitization; use only on trusted content.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which decorator marks a class as an Angular pipe?
  options:
    - "@Pipe"
    - "@Directive"
    - "@Injectable"
    - "@Component"
  correctIndex: 0
  explanation: "`@Pipe({ name, standalone })` declares a pipe; the class implements `PipeTransform.transform(value, ...args)`."
- id: q2
  question: What is the default value of `pure` on a custom pipe?
  options:
    - "false"
    - "true"
    - undefined — required
    - determined by change detection
  correctIndex: 1
  explanation: "Pipes are pure by default, meaning they re-run only when the input reference changes; set `pure: false` for impure behavior."
- id: q3
  question: What does AsyncPipe do?
  options:
    - Converts a Promise to a callback
    - Wraps a callback in an Observable
    - Subscribes to an Observable/Promise, returns the latest value, and unsubscribes on destroy
    - Schedules change detection
  correctIndex: 2
  explanation: AsyncPipe handles subscription, value caching, and unsubscription, often replacing manual `subscribe` + `ngOnDestroy` plumbing.
- id: q4
  question: Which is a correct way to pass multiple arguments to a pipe?
  options:
    - value | pipe(arg1, arg2)
    - value | pipe(arg1)(arg2)
    - value | pipe(arg1, arg2)
    - value | pipe:arg1:arg2
  correctIndex: 3
  explanation: Pipe arguments are colon-separated in templates; the pipe's `transform(value, arg1, arg2)` receives them positionally.
- id: q5
  question: "Why is `pure: false` on a filtering pipe an anti-pattern?"
  options:
    - It re-runs every change detection cycle, killing performance on large lists
    - It doesn't work with signals
    - It cannot accept arguments
    - It breaks AsyncPipe
  correctIndex: 0
  explanation: Impure pipes run on every CD tick; for array filtering, prefer a `computed()` signal or memoized service method to avoid O(n) work per tick.
- id: q6
  question: Which built-in pipe renders an object as formatted JSON?
  options:
    - stringify
    - json
    - object
    - pretty
  correctIndex: 1
  explanation: "`JsonPipe` (`| json`) calls `JSON.stringify(value, null, 2)` for debugging nested objects in templates."
- id: q7
  question: How do you make a pipe locale-aware for non-English formats?
  options:
    - "Set `i18n: true` on the pipe"
    - Use the Intl API only
    - Call `registerLocaleData(locale)` and provide `LOCALE_ID`
    - Set the lang attribute on <html>
  correctIndex: 2
  explanation: "Angular ships only `en-US` by default; register additional locales via `registerLocaleData(de)` in `main.ts` and provide `LOCALE_ID: 'de'`."
- id: q8
  question: Which is a valid chain of pipes?
  options:
    - "{{ name | uppercase >> slice:0:3 }}"
    - "{{ name | uppercase(slice(0,3)) }}"
    - "{{ uppercase(slice(name,0,3)) }}"
    - "{{ name | uppercase | slice:0:3 }}"
  correctIndex: 3
  explanation: Pipes chain left-to-right with `|`, each receiving the previous output; `name | uppercase | slice:0:3` uppercases then takes first 3 chars.
- id: q9
  question: When does a pure pipe re-evaluate?
  options:
    - Only when the input reference changes (or any argument reference changes)
    - Every keystroke
    - Every second
    - On route change
  correctIndex: 0
  explanation: Pure pipes use reference equality on inputs and arguments; mutating the same array does NOT trigger re-evaluation — replace the reference instead.
- id: q10
  question: Which service must you inject to safely bypass HTML sanitization in a custom pipe?
  options:
    - Renderer2
    - DomSanitizer
    - ElementRef
    - ChangeDetectorRef
  correctIndex: 1
  explanation: "`DomSanitizer.bypassSecurityTrustHtml(...)` returns a `SafeHtml` that Angular passes through to `[innerHtml]` without sanitization; use only on trusted content."
```

