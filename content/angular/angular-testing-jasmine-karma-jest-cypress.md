---
slug: angular-testing-jasmine-karma-jest-cypress
id: angular-16
track: angular
order: 16
title: Testing — Jasmine, Karma, Jest, Cypress
description: Write unit tests with Jasmine + TestBed (or Jest), component tests with the Angular Testing Library, and E2E tests with Cypress — covering signals, services, HTTP, and routing.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=300s
whyItMatters: Write unit tests with Jasmine + TestBed (or Jest), component tests with the Angular Testing Library, and E2E tests with Cypress — covering signals, services, HTTP, and routing.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Testing — Jasmine, Karma, Jest, Cypress

## Testing — Jasmine, Karma, Jest, Cypress

### Why It Matters

Write unit tests with Jasmine + TestBed (or Jest), component tests with the Angular Testing Library, and E2E tests with Cypress — covering signals, services, HTTP, and routing.

Write unit tests with Jasmine + TestBed (or Jest), component tests with the Angular Testing Library, and E2E tests with Cypress — covering signals, services, HTTP, and routing.

### Prerequisites

- Stage 6: Services and DI (you understand `inject` and `TestBed.inject`).
- Stage 10: Forms (you'll test reactive forms).
- Stage 11: NgRx (you'll test reducers and selectors).

### Topics

- TestBed configuration for standalone components (`TestBed.configureTestingModule` with `imports: []`)
- Jasmine syntax: `describe`, `it`, `expect`, `beforeEach`, spies
- Testing components with signals: reading `signal()` in tests
- Testing services with `HttpTestingController`
- Testing routed components with `RouterTestingModule` or `provideRouter([])
- Mocking with `provideMockStore` (NgRx) and `HttpTestingController`
- Switching to Jest (`jest-preset-angular`) — faster, better watch mode
- Cypress E2E: `cy.visit`, `cy.get`, `cy.intercept`, page objects
- Coverage targets and CI integration

### Key Concepts

- `TestBed.configureTestingModule({ imports: [Comp], providers: [...] })` is the modern setup for standalone components
- `HttpTestingController` verifies HTTP calls without a real server — `expectOne(url, method).flush(response)`
- Signals are test-friendly: just call `signal.set(...)` and assert
- Jasmine spies (`spyOn(obj, 'method').and.returnValue(...)`) and `createSpyObj` for service mocks
- Cypress runs in a real browser; `cy.intercept` mocks backend calls and `cy.get` queries the DOM like a user would

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
  });

  it('renders initial count of 0', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')!.textContent).toContain('0');
  });

  it('increments on click', () => {
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.count()).toBe(1);
  });
});
```
Caption: Unit test for a signal-based component

### Common Pitfalls

- Forgetting `fixture.detectChanges()` after creating the component — the template isn't rendered; signals and inputs aren't bound yet; call it once after `createComponent`.
- Not calling `httpMock.verify()` in `afterEach` — leaves unverified requests undetected; always assert every expected HTTP call.
- Testing through `componentInstance.field` instead of the rendered DOM — that's a unit test of the class, not the component; query `nativeElement` for true component tests.
- Spying on a method that doesn't exist on the object — `spyOn(obj, 'missing')` throws; use `createSpyObj` to fake the entire service.
- Using `setTimeout`/async without `fakeAsync`/`tick` or `await` — flaky tests; use `fakeAsync` + `tick(ms)` for deterministic time control.

### Real-World Applications

- Google Ads runs ~80k Jasmine tests in CI across its Angular codebase, with strict coverage thresholds enforced via Codecov.
- PayPal uses Jest (via jest-preset-angular) for unit tests because of faster parallel execution and snapshot testing.
- Upwork uses Cypress for E2E with `cy.intercept` mocking the API, enabling tests to run without a backend.
- Microsoft Teams uses the Angular Testing Library for behavior-focused component tests (`getByRole`, `findByText`).

### Interview Questions

- 1. How do you set up a test for a standalone component? — `TestBed.configureTestingModule({ imports: [ComponentClass] })` then `createComponent`; no declarations needed.
- 2. What does `HttpTestingController.expectOne(url)` do? — Asserts exactly one HTTP request was made to the URL (and optionally method); returns a `TestRequest` you `.flush(response)` to complete.
- 3. How do you mock the NgRx store in tests? — `provideMockStore({ initialState, selectors })` from `@ngrx/store/testing`; use `MockStore.overrideSelector` to override per-test.
- 4. When would you pick Jest over Karma+Jasmine? — Jest has faster parallel test runs, snapshot testing, and better watch mode; many teams migrate via `jest-preset-angular`.
- 5. How does `fakeAsync` + `tick(ms)` help? — `fakeAsync` intercepts async timers; `tick(ms)` advances virtual time deterministically — no real waits, no flaky tests.

### Mini Project

Build a test suite for a Todo component: Write unit tests for a `TodoListComponent` (renders items, adds on submit, toggles on click), a service test with `HttpTestingController` for `TodoService.getTodos`, and a Cypress E2E for "user adds a todo and sees it". Suggested approach:
  - Use `TestBed.configureTestingModule({ imports: [TodoListComponent] })`
  - Assert initial render, then dispatch a click and re-assert
  - Inject `HttpTestingController` and `expectOne('/api/todos').flush([...])`
  - Add `cy.intercept('GET', '/api/todos', { body: [...] })` in the E2E
  - Run `ng test` (Jasmine/Karma) and `npx cypress run` separately in CI

### Exercises

1. Write a Jasmine test for a `CounterComponent` that asserts initial render and increments on click.
2. Use `HttpTestingController` to verify a `UserService.getUsers()` HTTP GET call.
3. Mock a service using `provideMockStore` and assert a component renders store-driven data.
4. Migrate one Jasmine spec to Jest (via `jest-preset-angular`) and confirm it passes.
5. Write a Cypress E2E that logs in via a mocked `/api/auth/login` and asserts the URL changes.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which utility configures the Angular testing module for standalone components?
9. A) TestBed.create(Comp)
10. B) TestBed.init(Comp)
11. C) AngularTest.setup(Comp)
12. D) TestBed.configureTestingModule({ imports: [Comp] }) (*)
13. Explanation: `TestBed.configureTestingModule({ imports, providers })` is the modern test setup; standalone components go in `imports`, not `declarations`.
14. Q2: Which class verifies HTTP requests without a real server?
15. A) HttpTestingController (*)
16. B) HttpBackend
17. C) HttpClientMock
18. D) RequestMock
19. Explanation: `HttpTestingController` (from `HttpClientTestingModule`) lets you `expectOne(url)` and `flush(response)` to simulate the server response.
20. Q3: Which NgRx testing helper replaces the real Store in unit tests?
21. A) provideStoreMock
22. B) provideMockStore (*)
23. C) StoreTestingModule
24. D) FakeStore
25. Explanation: `provideMockStore({ initialState, selectors })` from `@ngrx/store/testing` injects a `MockStore` you can override per test.
26. Q4: Which Jasmine function creates a spy object with multiple methods?
27. A) createSpy
28. B) spyOn
29. C) createSpyObj (*)
30. D) mockFn
31. Explanation: `createSpyObj('Name', ['method1', 'method2'])` returns an object with spied methods; useful for faking entire services.
32. Q5: Which function deterministically advances virtual time in tests?
33. A) setTimeout
34. B) await wait(ms)
35. C) realTime(ms)
36. D) tick(ms) inside fakeAsync (*)
37. Explanation: `fakeAsync` intercepts timers; `tick(ms)` advances virtual time synchronously — no flaky real waits.
38. Q6: What must you call after `TestBed.createComponent` to render the template?
39. A) fixture.detectChanges() (*)
40. B) fixture.render()
41. C) component.render()
42. D) Nothing — it auto-renders
43. Explanation: `fixture.detectChanges()` runs the first change detection cycle, binding signals/inputs and rendering the template.
44. Q7: Which framework is commonly used for Angular E2E tests?
45. A) Protractor (deprecated)
46. B) Cypress (*)
47. C) Selenium only
48. D) Playwright only
49. Explanation: Cypress is the modern Angular E2E choice; Protractor (Angular's old built-in) was deprecated. Playwright is also a valid alternative.
50. Q8: Which Cypress command mocks an HTTP call?
51. A) cy.mock
52. B) cy.route (deprecated)
53. C) cy.intercept (*)
54. D) cy.stub
55. Explanation: `cy.intercept(method, url, { body, statusCode })` mocks an HTTP call; `cy.route` was Cypress's old API (deprecated in favor of `intercept`).
56. Q9: Why might a team migrate from Karma to Jest?
57. A) Jest is built into Angular
58. B) Karma doesn't support TypeScript
59. C) Jest is the only option for E2E
60. D) Faster parallel runs, snapshot testing, better watch mode via jest-preset-angular (*)
61. Explanation: `jest-preset-angular` provides Jest with parallel test runs, snapshot testing, and a faster watch mode than Karma; many teams migrate for these reasons.
62. Q10: What's a "behavior-focused" component test approach?
63. A) Query the DOM via getByRole / findByText like a real user (*)
64. B) Assert on componentInstance fields only
65. C) Spy on every method
66. D) Use real HTTP calls
67. Explanation: Behavior-focused tests (Angular Testing Library) query the rendered DOM the way a user would (`getByRole`, `findByText`), making tests resilient to refactors and closer to real UX.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which utility configures the Angular testing module for standalone components?
  options:
    - TestBed.create(Comp)
    - TestBed.init(Comp)
    - AngularTest.setup(Comp)
    - "TestBed.configureTestingModule({ imports: [Comp] })"
  correctIndex: 3
  explanation: "`TestBed.configureTestingModule({ imports, providers })` is the modern test setup; standalone components go in `imports`, not `declarations`."
- id: q2
  question: Which class verifies HTTP requests without a real server?
  options:
    - HttpTestingController
    - HttpBackend
    - HttpClientMock
    - RequestMock
  correctIndex: 0
  explanation: "`HttpTestingController` (from `HttpClientTestingModule`) lets you `expectOne(url)` and `flush(response)` to simulate the server response."
- id: q3
  question: Which NgRx testing helper replaces the real Store in unit tests?
  options:
    - provideStoreMock
    - provideMockStore
    - StoreTestingModule
    - FakeStore
  correctIndex: 1
  explanation: "`provideMockStore({ initialState, selectors })` from `@ngrx/store/testing` injects a `MockStore` you can override per test."
- id: q4
  question: Which Jasmine function creates a spy object with multiple methods?
  options:
    - createSpy
    - spyOn
    - createSpyObj
    - mockFn
  correctIndex: 2
  explanation: "`createSpyObj('Name', ['method1', 'method2'])` returns an object with spied methods; useful for faking entire services."
- id: q5
  question: Which function deterministically advances virtual time in tests?
  options:
    - setTimeout
    - await wait(ms)
    - realTime(ms)
    - tick(ms) inside fakeAsync
  correctIndex: 3
  explanation: "`fakeAsync` intercepts timers; `tick(ms)` advances virtual time synchronously — no flaky real waits."
- id: q6
  question: What must you call after `TestBed.createComponent` to render the template?
  options:
    - fixture.detectChanges()
    - fixture.render()
    - component.render()
    - Nothing — it auto-renders
  correctIndex: 0
  explanation: "`fixture.detectChanges()` runs the first change detection cycle, binding signals/inputs and rendering the template."
- id: q7
  question: Which framework is commonly used for Angular E2E tests?
  options:
    - Protractor (deprecated)
    - Cypress
    - Selenium only
    - Playwright only
  correctIndex: 1
  explanation: Cypress is the modern Angular E2E choice; Protractor (Angular's old built-in) was deprecated. Playwright is also a valid alternative.
- id: q8
  question: Which Cypress command mocks an HTTP call?
  options:
    - cy.mock
    - cy.route (deprecated)
    - cy.intercept
    - cy.stub
  correctIndex: 2
  explanation: "`cy.intercept(method, url, { body, statusCode })` mocks an HTTP call; `cy.route` was Cypress's old API (deprecated in favor of `intercept`)."
- id: q9
  question: Why might a team migrate from Karma to Jest?
  options:
    - Jest is built into Angular
    - Karma doesn't support TypeScript
    - Jest is the only option for E2E
    - Faster parallel runs, snapshot testing, better watch mode via jest-preset-angular
  correctIndex: 3
  explanation: "`jest-preset-angular` provides Jest with parallel test runs, snapshot testing, and a faster watch mode than Karma; many teams migrate for these reasons."
- id: q10
  question: What's a "behavior-focused" component test approach?
  options:
    - Query the DOM via getByRole / findByText like a real user
    - Assert on componentInstance fields only
    - Spy on every method
    - Use real HTTP calls
  correctIndex: 0
  explanation: Behavior-focused tests (Angular Testing Library) query the rendered DOM the way a user would (`getByRole`, `findByText`), making tests resilient to refactors and closer to real UX.
```

