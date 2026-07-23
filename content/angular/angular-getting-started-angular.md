---
slug: angular-getting-started-angular
id: angular-01
track: angular
order: 1
title: Getting Started with Angular
description: Install Node.js and the Angular CLI, scaffold a standalone-components app, run the dev server, and inspect the project structure and your first component.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=DwTNR3EBSJQ
whyItMatters: Install Node. js and the Angular CLI, scaffold a standalone-components app, run the dev server, and inspect the project structure and your first component.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Getting Started with Angular

## Getting Started with Angular

### Why It Matters

Install Node. js and the Angular CLI, scaffold a standalone-components app, run the dev server, and inspect the project structure and your first component.

Install Node.js and the Angular CLI, scaffold a standalone-components app, run the dev server, and inspect the project structure and your first component.

### Prerequisites

- None — basic HTML/CSS/JS/TS knowledge is helpful.
- Comfort using a terminal and a code editor (VS Code with the Angular Language Service extension recommended).
- Node.js 18.19+ or 20.9+ installed (check with `node --version`).

### Topics

- What Angular is (opinionated framework vs library) and where it fits
- Installing the Angular CLI globally vs via npx
- Scaffolding a project with `ng new` and the standalone flag
- Project structure: src/, angular.json, tsconfig.json, package.json
- Running `ng serve` and Hot Module Replacement
- The bootstrap flow: main.ts -> bootstrapApplication(AppComponent)
- Standalone components vs NgModule-based components (default in v17+)
- Installing Angular DevTools browser extension
- Comparing Angular to React and Vue at a glance

### Key Concepts

- Angular is opinionated: routing, forms, HTTP, DI, and testing ship in the box
- Standalone components (default since v17) compile without NgModule boilerplate
- Bootstrap is `bootstrapApplication(AppComponent, { providers: [...] })` in main.ts
- TypeScript is required — Angular templates and DI depend on types at compile time
- The Angular CLI (`ng`) is the canonical tool for new, generate, serve, build, test, deploy

```bash
npx @angular/cli@latest new my-app --style=scss --routing --ssr=false
cd my-app
npm start
# Open http://localhost:4200
```
Caption: Scaffolding a project

### Common Pitfalls

- Installing Angular CLI globally with `npm install -g @angular/cli` and getting version drift across projects — prefer `npx @angular/cli@latest` per command, or pin the CLI per project.
- Picking `--ssr=true` by accident during `ng new` — SSR adds complexity (server config, hydration); choose it only when you need SEO or fast first paint.
- Confusing `ng serve` (dev server) with `ng build` (production bundle) — `ng serve` runs an unminified dev build with HMR; never ship it.
- Skipping the Angular Language Service VS Code extension — without it you lose template type checking and IntelliSense inside `template` and `templateUrl`.
- Editing `angular.json` by hand without backing it up — a single syntax error breaks every CLI command; use `git commit` before touching it.

### Real-World Applications

- Google Pay's merchant-facing web console is built with Angular and Material, supporting millions of transactions per day.
- Microsoft Office Online (office.com) uses Angular for parts of the document list and account surfaces alongside React.
- PayPal's merchant dashboard ships Angular for compliance-heavy, complex forms that benefit from Angular's Reactive Forms.
- Upwork's freelancer search and proposal flows are Angular, serving 18M+ registered users.

### Interview Questions

- 1. What is the Angular CLI and why use it instead of a custom webpack config? — It standardizes builds, scaffolding, and upgrades; CLI updates carry breaking-change migrations via `ng update`.
- 2. What does `bootstrapApplication` do? — It compiles the root standalone component, registers providers, and attaches the rendered DOM to the document, replacing the old `platformBrowserDynamic().bootstrapModule(AppModule)`.
- 3. What's a standalone component and why did Angular default to it in v17? — A standalone component declares its imports inline and needs no NgModule; it removes boilerplate, enables better tree-shaking, and is the foundation for signals and lazy APIs.
- 4. Why is TypeScript required in Angular? — Templates, decorators, DI tokens, and pipes rely on compile-time types; Angular's compiler (`ngc`) generates typed code, and the Language Service type-checks templates.
- 5. How do you check the installed Angular version? — `ng version` (or `ng v`) prints the CLI, Angular core, TypeScript, and bundled tooling versions in a table.

### Mini Project

Build a "Hello, Angular" counter app: A standalone-component single-page app that displays your name, a counter, and a button that increments with a signal. Add a second button that resets to 0 and prints the count to the console via an `effect`. Suggested approach:
  - Scaffold with `npx @angular/cli@latest new counter --style=scss`
  - Edit `app.component.ts` to use `signal(0)` for the counter
  - Add increment and reset buttons in the inline template
  - Use `effect(() => console.log('count is', this.count()))` to log every change
  - Style the page with a `stylesUrl` or inline `styles` array

### Exercises

1. Scaffold a new Angular app and confirm `npm start` shows the default welcome page at http://localhost:4200.
2. Replace the root component's template with an `<h1>` containing your name and a `<p>` with today's date.
3. Install the Angular DevTools browser extension and inspect the component tree of your running app.
4. Generate a second component with `ng generate component header` and render it inside `AppComponent`.
5. Run `ng build` and inspect the contents of `dist/` to see the production bundles.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command scaffolds a new Angular 17+ project?
9. A) npx @angular/cli@latest new my-app (*)
10. B) npm install -g angular && angular new my-app
11. C) npm create angular my-app
12. D) ng init my-app
13. Explanation: `npx @angular/cli@latest new my-app` runs the latest Angular CLI without a global install; the CLI prompts for routing, styling, and SSR.
14. Q2: What is the modern bootstrap entry point for an Angular 17+ standalone-components app?
15. A) platformBrowserDynamic().bootstrapModule(AppModule)
16. B) bootstrapApplication(AppComponent, { providers }) (*)
17. C) createApp(App).mount('#app')
18. D) angular.bootstrap(AppComponent)
19. Explanation: `bootstrapApplication` from `@angular/core` boots a standalone root component and registers root-level providers without an NgModule.
20. Q3: Which decorator marks a class as an Angular component?
21. A) @Injectable
22. B) @Directive
23. C) @Component (*)
24. D) @NgModule
25. Explanation: `@Component` is the decorator; `@Directive` is for attribute/structural directives, `@Injectable` for services, `@NgModule` for the legacy module system.
26. Q4: What does the `standalone: true` flag on a @Component indicate?
27. A) The component cannot use dependency injection
28. B) The component is rendered without a router
29. C) The component is server-side only
30. D) The component declares its imports inline and needs no NgModule (*)
31. Explanation: Standalone components specify their template dependencies in `imports: [...]` directly and do not belong to (or require) an NgModule.
32. Q5: Which VS Code extension provides template type-checking and IntelliSense for Angular?
33. A) Angular Language Service (*)
34. B) Angular Snippets
35. C) ESLint Angular
36. D) TSLint
37. Explanation: The Angular Language Service (maintained by the Angular team) adds template diagnostics, completions, and go-to-definition inside `.html` and inline templates.
38. Q6: Which Node.js version is the minimum for Angular 17?
39. A) Node 14
40. B) Node 18.19+ or 20.9+ (*)
41. C) Node 16
42. D) Node 22 only
43. Explanation: Angular 17 supports Node 18.19+ and 20.9+ (active LTS); Node 14 and 16 are end-of-life and unsupported by the CLI.
44. Q7: What does `ng serve` do?
45. A) Compiles a production bundle and uploads it
46. B) Runs the test suite in watch mode
47. C) Starts the dev server with HMR on http://localhost:4200 (*)
48. D) Generates a new component
49. Explanation: `ng serve` builds the app in development mode, serves it locally (default port 4200), and watches for file changes, applying HMR when possible.
50. Q8: Which reactive primitive does modern Angular (v16+) recommend for component state?
51. A) BehaviorSubject from RxJS
52. B) NgRx store only
53. C) @Input setters
54. D) Signals (signal, computed, effect) (*)
55. Explanation: Angular 16+ ships signals (`signal()`, `computed()`, `effect()`) as the primary reactive primitive for component state; RxJS remains for async streams and NgRx for app state.
56. Q9: Which file is the entry point that Angular CLI compiles for a browser build?
57. A) src/index.html which loads src/main.ts (*)
58. B) angular.json directly
59. C) public/index.html
60. D) src/app/app.module.ts
61. Explanation: `angular.json` points the browser builder at `src/index.html`, which loads `src/main.ts`; `main.ts` calls `bootstrapApplication` to start the app.
62. Q10: What is the role of `angular.json`?
63. A) It is the package manifest listing npm dependencies
64. B) It is the workspace config defining build, serve, test targets and project files (*)
65. C) It is the TypeScript compiler config
66. D) It is the router definition
67. Explanation: `angular.json` is the per-workspace CLI config: it lists projects, builder targets (`build`, `serve`, `test`, `lint`), asset/style/script arrays, and budget thresholds.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command scaffolds a new Angular 17+ project?
  options:
    - npx @angular/cli@latest new my-app
    - npm install -g angular && angular new my-app
    - npm create angular my-app
    - ng init my-app
  correctIndex: 0
  explanation: "`npx @angular/cli@latest new my-app` runs the latest Angular CLI without a global install; the CLI prompts for routing, styling, and SSR."
- id: q2
  question: What is the modern bootstrap entry point for an Angular 17+ standalone-components app?
  options:
    - platformBrowserDynamic().bootstrapModule(AppModule)
    - bootstrapApplication(AppComponent, { providers })
    - createApp(App).mount('#app')
    - angular.bootstrap(AppComponent)
  correctIndex: 1
  explanation: "`bootstrapApplication` from `@angular/core` boots a standalone root component and registers root-level providers without an NgModule."
- id: q3
  question: Which decorator marks a class as an Angular component?
  options:
    - "@Injectable"
    - "@Directive"
    - "@Component"
    - "@NgModule"
  correctIndex: 2
  explanation: "`@Component` is the decorator; `@Directive` is for attribute/structural directives, `@Injectable` for services, `@NgModule` for the legacy module system."
- id: q4
  question: "What does the `standalone: true` flag on a @Component indicate?"
  options:
    - The component cannot use dependency injection
    - The component is rendered without a router
    - The component is server-side only
    - The component declares its imports inline and needs no NgModule
  correctIndex: 3
  explanation: "Standalone components specify their template dependencies in `imports: [...]` directly and do not belong to (or require) an NgModule."
- id: q5
  question: Which VS Code extension provides template type-checking and IntelliSense for Angular?
  options:
    - Angular Language Service
    - Angular Snippets
    - ESLint Angular
    - TSLint
  correctIndex: 0
  explanation: The Angular Language Service (maintained by the Angular team) adds template diagnostics, completions, and go-to-definition inside `.html` and inline templates.
- id: q6
  question: Which Node.js version is the minimum for Angular 17?
  options:
    - Node 14
    - Node 18.19+ or 20.9+
    - Node 16
    - Node 22 only
    - ; Node 14 and 16 are end-of-life and unsupported by the CLI.
  correctIndex: 1
  explanation: Angular 17 supports Node 18.19+ and 20.9+ (active LTS); Node 14 and 16 are end-of-life and unsupported by the CLI.
- id: q7
  question: What does `ng serve` do?
  options:
    - Compiles a production bundle and uploads it
    - Runs the test suite in watch mode
    - Starts the dev server with HMR on http://localhost:4200
    - Generates a new component
  correctIndex: 2
  explanation: "`ng serve` builds the app in development mode, serves it locally (default port 4200), and watches for file changes, applying HMR when possible."
- id: q8
  question: Which reactive primitive does modern Angular (v16+) recommend for component state?
  options:
    - BehaviorSubject from RxJS
    - NgRx store only
    - "@Input setters"
    - Signals (signal, computed, effect)
  correctIndex: 3
  explanation: Angular 16+ ships signals (`signal()`, `computed()`, `effect()`) as the primary reactive primitive for component state; RxJS remains for async streams and NgRx for app state.
- id: q9
  question: Which file is the entry point that Angular CLI compiles for a browser build?
  options:
    - src/index.html which loads src/main.ts
    - angular.json directly
    - public/index.html
    - src/app/app.module.ts
  correctIndex: 0
  explanation: "`angular.json` points the browser builder at `src/index.html`, which loads `src/main.ts`; `main.ts` calls `bootstrapApplication` to start the app."
- id: q10
  question: What is the role of `angular.json`?
  options:
    - It is the package manifest listing npm dependencies
    - It is the workspace config defining build, serve, test targets and project files
    - It is the TypeScript compiler config
    - It is the router definition
  correctIndex: 1
  explanation: "`angular.json` is the per-workspace CLI config: it lists projects, builder targets (`build`, `serve`, `test`, `lint`), asset/style/script arrays, and budget thresholds."
```

