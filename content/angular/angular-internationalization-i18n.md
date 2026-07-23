---
slug: angular-internationalization-i18n
id: angular-17
track: angular
order: 17
title: Internationalization (i18n)
description: Use `@angular/localize` to mark translatable text, extract messages into XLIFF/JSON, build per-locale bundles, and switch locales at build time.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=360s
whyItMatters: Use `@angular/localize` to mark translatable text, extract messages into XLIFF/JSON, build per-locale bundles, and switch locales at build time.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Internationalization (i18n)

## Internationalization (i18n)

### Why It Matters

Use `@angular/localize` to mark translatable text, extract messages into XLIFF/JSON, build per-locale bundles, and switch locales at build time.

Use `@angular/localize` to mark translatable text, extract messages into XLIFF/JSON, build per-locale bundles, and switch locales at build time.

### Prerequisites

- Stage 2: Components and Templates (you can write standalone components).
- Stage 5: Pipes (you've used locale-aware pipes like `date` and `currency`).
- Comfort with English-only templates being marked up for translation.

### Topics

- `@angular/localize` package and `i18n` template attribute
- Marking text: `i18n`, `i18n-title`, `i18n-placeholder`, `i18n-label`
- Meaning and description: `i18n="@@customId|meaning|description"`
- Pluralization with `i18nPlural` and ICU expressions
- Gender with `i18nSelect`
- Extracting messages with `ng extract-i18n`
- Translation file formats: XLIFF 1.2/2.0, JSON, ARB
- Building per-locale apps with `--localize` and locale-specific pipes

### Key Concepts

- `i18n` is a build-time extraction tool — at runtime, each locale gets its own compiled bundle
- `@angular/localize` transforms `<h1 i18n>Hello</h1>` into a translation call at compile time
- ICU expressions (`{count, plural, =0 {No items} =1 {One item} other {# items}}`) handle pluralization and selection
- Locale-aware pipes (`date`, `currency`, `number`) auto-use the active locale via `LOCALE_ID`
- `ng extract-i18n` produces a `messages.xlf` that translators edit; `--format=json` for JSON-based workflows

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  standalone: true,
  template: `
    <h1 i18n="@@greetingTitle|User greeting|Shown on the dashboard">Hello, World!</h1>
    <p i18n>Welcome back to your dashboard.</p>
    <button i18n-title title="Click to log out">Logout</button>
    <input i18n-placeholder placeholder="Search..." />
  `,
})
export class GreetingComponent {}
```
Caption: Marking text for translation

### Common Pitfalls

- Forgetting to run `ng add @angular/localize` — `$localize` tag and `i18n` attributes silently fail; install the package first.
- Adding `i18n` to an element with interpolation but not handling the ICU — translations break on pluralization; use ICU `{count, plural, ...}` blocks.
- Hard-coding IDs (`@@id`) inconsistently — once a translator fills a string, changing the ID loses the translation; pick stable IDs from the start.
- Using `--localize` and serving only one locale — the dev server defaults to the source locale; use `ng serve --configuration=fr` to test a translated locale locally.
- Forgetting to register locale data for non-`en-US` pipes — the `date`/`currency`/`number` pipes throw without `registerLocaleData(locale)` and the right `LOCALE_ID`.

### Real-World Applications

- Google Pay ships per-locale Angular bundles (en, fr, de, ja, hi, etc.) with `--localize`, served by locale-detection at the CDN.
- Deutsche Bahn's train booking UI is fully translated to English, French, Italian, etc., using ICU pluralization for ticket counts.
- Microsoft Office Online uses Angular i18n for the document settings UI across 30+ languages with XLIFF exchange with vendors.
- PayPal's merchant dashboard ships per-locale bundles with locale-aware `currency` and `date` pipes driven by `LOCALE_ID`.

### Interview Questions

- 1. Is Angular i18n build-time or runtime? — Build-time: `@angular/localize` compiles translations into per-locale bundles at `ng build --localize`.
- 2. How do you mark a paragraph for translation? — Add the `i18n` attribute: `<p i18n>Text</p>`; extract with `ng extract-i18n`.
- 3. What's an ICU expression? — A standardized syntax for pluralization and selection: `{count, plural, =0 {...} other {...}}` or `{gender, select, male {...} other {...}}`.
- 4. How do you build all configured locales at once? — `ng build --localize` produces a bundle per locale listed in `angular.json`'s `i18n.locales`.
- 5. How do locale-aware pipes know the active locale? — They read `LOCALE_ID` (a DI token); provide it per locale and register locale data via `registerLocaleData` in `main.ts`.

### Mini Project

Build a bilingual "Welcome" app: An Angular app with English source strings and a French translation. Mark all visible text with `i18n` (including a pluralized "X items" string), extract to `messages.xlf`, translate to `messages.fr.xlf`, build both locales with `--localize`, and serve each via `ng serve --configuration=fr`. Suggested approach:
  - `ng add @angular/localize`
  - Mark all strings with `i18n` and stable `@@ids`
  - Use ICU for `{count, plural, =0 {No items} =1 {One item} other {{{count}} items}}`
  - Run `ng extract-i18n --output-path src/locale`
  - Configure `angular.json` i18n.locales and `ng build --localize`

### Exercises

1. Run `ng add @angular/localize` and confirm `$localize` is available.
2. Mark three strings (heading, button, placeholder) with `i18n` and extract to XLIFF.
3. Add an ICU plural block for "items count" and verify extraction includes the plural cases.
4. Configure a `fr` locale in `angular.json` and serve it with `ng serve --configuration=fr`.
5. Register `localeFr` in `main.ts` and verify the `date` pipe formats in French.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which package provides Angular i18n tooling?
9. A) @angular/localize (*)
10. B) @angular/i18n
11. C) @ngx-translate
12. D) @angular/translations
13. Explanation: `@angular/localize` is the official Angular i18n package; `@ngx-translate` is a popular third-party runtime alternative (not the official tool).
14. Q2: When does Angular i18n apply translations?
15. A) Runtime via JSON fetch
16. B) Build time — each locale gets its own compiled bundle (*)
17. C) In the dev server only
18. D) Via a directive at runtime
19. Explanation: `@angular/localize` is build-time: `ng build --localize` produces a per-locale bundle with translations compiled in.
20. Q3: Which attribute marks an element's text for translation?
21. A) translate
22. B) t
23. C) i18n (*)
24. D) tr
25. Explanation: `<p i18n>Text</p>` marks the text node for extraction; `i18n-title`, `i18n-placeholder` mark attributes.
26. Q4: Which ICU expression handles pluralization?
27. A) {count, pluralize, 0 {...}}
28. B) {count, switch, ...}
29. C) {plural count, ...}
30. D) {count, plural, =0 {...} =1 {...} other {...}} (*)
31. Explanation: ICU MessageFormat syntax: `{count, plural, =0 {No items} =1 {One item} other {{{count}} items}}` — the `=` cases are exact matches, `other` is the fallback.
32. Q5: Which command extracts marked strings to a translation file?
33. A) ng extract-i18n (*)
34. B) ng i18n
35. C) ng translate
36. D) ng generate translations
37. Explanation: `ng extract-i18n --output-path src/locale` produces `messages.xlf` (or `--format=json`) for translators.
38. Q6: Which flag builds all configured locales at once?
39. A) --all-locales
40. B) --localize (*)
41. C) --multi
42. D) --i18n-all
43. Explanation: `ng build --localize` builds a bundle per locale configured in `angular.json`'s `i18n.locales` map.
44. Q7: Which DI token controls the active locale for locale-aware pipes?
45. A) LANG_ID
46. B) I18N_LOCALE
47. C) LOCALE_ID (*)
48. D) LANGUAGE
49. Explanation: `LOCALE_ID` is the Angular DI token; pipes (`date`, `currency`, `number`) read it to format; provide per locale.
50. Q8: How do you register non-en-US locale data?
51. A) It's automatic
52. B) Add a script tag
53. C) Set html lang attribute
54. D) registerLocaleData(locale) in main.ts (*)
55. Explanation: Angular ships only `en-US` by default; call `registerLocaleData(localeFr)` (importing from `@angular/common/locales/fr`) in `main.ts` for other locales.
56. Q9: Which is a valid custom ID syntax for an `i18n` attribute?
57. A) i18n="@@customId|meaning|description" (*)
58. B) i18n="@id"
59. C) i18n="#customId"
60. D) i18n="id:customId"
61. Explanation: `i18n="@@id|meaning|description"` — the `@@` prefix marks a stable custom ID; meaning and description are optional but help translators.
62. Q10: Why use a stable `@@id` instead of an auto-generated one?
63. A) Auto IDs are unsupported
64. B) Changing the source text without an @@id generates a new ID and loses the translation (*)
65. C) Stable IDs disable extraction
66. D) Stable IDs require extra packages
67. Explanation: Without a stable `@@id`, Angular hashes the source text; any change generates a new ID, breaking the link to the translator's existing translation. `@@id` keeps the link stable across text edits.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which package provides Angular i18n tooling?
  options:
    - "@angular/localize"
    - "@angular/i18n"
    - "@ngx-translate"
    - "@angular/translations"
  correctIndex: 0
  explanation: "`@angular/localize` is the official Angular i18n package; `@ngx-translate` is a popular third-party runtime alternative (not the official tool)."
- id: q2
  question: When does Angular i18n apply translations?
  options:
    - Runtime via JSON fetch
    - Build time — each locale gets its own compiled bundle
    - In the dev server only
    - Via a directive at runtime
  correctIndex: 1
  explanation: "`@angular/localize` is build-time: `ng build --localize` produces a per-locale bundle with translations compiled in."
- id: q3
  question: Which attribute marks an element's text for translation?
  options:
    - translate
    - t
    - i18n
    - tr
  correctIndex: 2
  explanation: "`<p i18n>Text</p>` marks the text node for extraction; `i18n-title`, `i18n-placeholder` mark attributes."
- id: q4
  question: Which ICU expression handles pluralization?
  options:
    - "{count, pluralize, 0 {...}}"
    - "{count, switch, ...}"
    - "{plural count, ...}"
    - "{count, plural, =0 {...} =1 {...} other {...}}"
  correctIndex: 3
  explanation: "ICU MessageFormat syntax: `{count, plural, =0 {No items} =1 {One item} other {{{count}} items}}` — the `=` cases are exact matches, `other` is the fallback."
- id: q5
  question: Which command extracts marked strings to a translation file?
  options:
    - ng extract-i18n
    - ng i18n
    - ng translate
    - ng generate translations
  correctIndex: 0
  explanation: "`ng extract-i18n --output-path src/locale` produces `messages.xlf` (or `--format=json`) for translators."
- id: q6
  question: Which flag builds all configured locales at once?
  options:
    - --all-locales
    - --localize
    - --multi
    - --i18n-all
  correctIndex: 1
  explanation: "`ng build --localize` builds a bundle per locale configured in `angular.json`'s `i18n.locales` map."
- id: q7
  question: Which DI token controls the active locale for locale-aware pipes?
  options:
    - LANG_ID
    - I18N_LOCALE
    - LOCALE_ID
    - LANGUAGE
  correctIndex: 2
  explanation: "`LOCALE_ID` is the Angular DI token; pipes (`date`, `currency`, `number`) read it to format; provide per locale."
- id: q8
  question: How do you register non-en-US locale data?
  options:
    - It's automatic
    - Add a script tag
    - Set html lang attribute
    - registerLocaleData(locale) in main.ts
  correctIndex: 3
  explanation: Angular ships only `en-US` by default; call `registerLocaleData(localeFr)` (importing from `@angular/common/locales/fr`) in `main.ts` for other locales.
- id: q9
  question: Which is a valid custom ID syntax for an `i18n` attribute?
  options:
    - i18n="@@customId|meaning|description"
    - i18n="@id"
    - i18n="#customId"
    - i18n="id:customId"
  correctIndex: 0
  explanation: '`i18n="@@id|meaning|description"` — the `@@` prefix marks a stable custom ID; meaning and description are optional but help translators.'
- id: q10
  question: Why use a stable `@@id` instead of an auto-generated one?
  options:
    - Auto IDs are unsupported
    - Changing the source text without an @@id generates a new ID and loses the translation
    - Stable IDs disable extraction
    - Stable IDs require extra packages
  correctIndex: 1
  explanation: Without a stable `@@id`, Angular hashes the source text; any change generates a new ID, breaking the link to the translator's existing translation. `@@id` keeps the link stable across text edits.
```

