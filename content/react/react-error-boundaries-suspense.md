---
slug: react-error-boundaries-suspense
id: react-14
track: react
order: 14
title: Error Boundaries and Suspense
description: Catch render-time errors gracefully with error boundaries, orchestrate async UI with Suspense, and combine the two for resilient loading states.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=780s
whyItMatters: Catch render-time errors gracefully with error boundaries, orchestrate async UI with Suspense, and combine the two for resilient loading states.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Error Boundaries and Suspense

## Error Boundaries and Suspense

### Why It Matters

Catch render-time errors gracefully with error boundaries, orchestrate async UI with Suspense, and combine the two for resilient loading states.

Catch render-time errors gracefully with error boundaries, orchestrate async UI with Suspense, and combine the two for resilient loading states.

### Prerequisites

- Stage 13: Performance.
- React 18 concurrent features (Suspense, transitions).

### Topics

- Class-component error boundaries (no hook equivalent exists)
- `componentDidCatch` vs `getDerivedStateFromError`
- Where error boundaries DON'T catch (events, async, effects)
- `<Suspense>` and fallbacks
- Nested Suspense boundaries
- Suspense + React.lazy
- Suspense for data fetching (with React Query / RSC)
- Hydration mismatches with SSR

### Key Concepts

- Error boundaries catch errors during rendering, in lifecycle, and in constructors of child components
- Error boundaries do NOT catch errors in event handlers, async code, or `useEffect` — wrap those in try/catch
- Suspense lets a component "suspend" while it waits for data/code, showing a fallback
- Multiple nested Suspense boundaries let parts of the page load independently
- Hydration mismatch happens when SSR HTML differs from the client's first render (e.g. dates, random values)

```tsx
import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to Sentry / Datadog / console
    console.error("Boundary caught:", error, info.componentStack);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <RiskyComponent />
</ErrorBoundary>
```
Caption: Error boundary class component

### Common Pitfalls

- Expecting error boundaries to catch event-handler errors — they don't. Wrap event handlers in try/catch or use a `reportError` utility.
- Forgetting `getDerivedStateFromError` — without it, the boundary renders the broken subtree again on next render; you need both lifecycle methods.
- Putting one giant Suspense boundary around the whole app — a single slow component blocks the entire page; nest boundaries for incremental loading.
- Hydration mismatches from server/client divergence — never render `Date.now()`, `Math.random()`, or `window`-dependent values directly; gate with `useEffect`-set state.
- Not logging boundary errors — install Sentry/Datadog and capture errors in `componentDidCatch` so you can fix them.

### Real-World Applications

- Sentry's own React SDK ships an `ErrorBoundary` that auto-captures errors with component stacks.
- Netflix's player UI uses Suspense + React.lazy to load the player code on demand, reducing initial bundle.
- Facebook wraps News Feed sections in error boundaries so one broken card doesn't take down the whole feed.
- Vercel's dashboard uses nested Suspense for incremental streaming of project data over SSR.

### Interview Questions

- 1. What does an error boundary catch? — Errors during rendering, in lifecycle methods, and in constructors of child components.
- 2. What does an error boundary NOT catch? — Errors in event handlers, async code (setTimeout/Promises), and `useEffect` callbacks — wrap those in try/catch.
- 3. Why is there no hook for error boundaries? — Boundaries need lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) that have no hook equivalent; class components remain required for this.
- 4. What does Suspense do? — Lets a component "suspend" while waiting for code (`React.lazy`) or data; React shows a fallback until the suspended resource is ready.
- 5. What is a hydration mismatch? — When the SSR-rendered HTML differs from the client's first render; React warns and discards the server HTML, hurting performance and UX.

### Mini Project

Build a "Resilient Dashboard" with three independently-loaded panels (stats, chart, table) each wrapped in its own `<ErrorBoundary>` and `<Suspense>`. Force one panel to throw and one to suspend, and confirm the rest keep working. Suggested approach:
  - Create a reusable `ErrorBoundary` class component
  - Wrap each panel in its own `<ErrorBoundary>` + `<Suspense>`
  - Make the chart panel `React.lazy` with a 1s artificial delay
  - Make the table panel throw on a button click
  - Confirm the stats panel keeps rendering

### Exercises

1. Build an `ErrorBoundary` class component and verify it catches a thrown render.
2. Confirm the same boundary does NOT catch an error in an `onClick` handler.
3. Code-split a route with `React.lazy` + `Suspense` and confirm the chunk loads.
4. Cause a hydration mismatch with `Date.now()` and observe the warning.
5. Add nested Suspense boundaries and confirm the inner one shows its own fallback.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What do error boundaries catch?
9. A) Errors in event handlers
10. B) Errors during rendering and in lifecycle methods of children (*)
11. C) Errors in async code
12. D) Errors in useEffect
13. Explanation: Error boundaries catch render-time errors, lifecycle errors, and constructor errors in child components. They do NOT catch event-handler, async, or effect errors.
14. Q2: Which error source is NOT caught by an error boundary?
15. A) A throw inside render
16. B) A throw inside a constructor
17. C) A throw inside an onClick handler (*)
18. D) A throw inside a child's render
19. Explanation: Event handlers run outside React's render commit, so error boundaries can't catch them — wrap them in try/catch or use an error reporting utility.
20. Q3: Why is there no hook equivalent of error boundaries?
21. A) Hooks can't catch errors
22. B) The React team forgot
23. C) Hooks are slower
24. D) Boundaries need lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) that hooks can't replicate (*)
25. Explanation: Error boundaries rely on class lifecycle methods; no hook API exists for this, so class components remain required for catching render errors.
26. Q4: What does `<Suspense fallback={...}>` do?
27. A) Shows the fallback while a child "suspends" waiting for code or data (*)
28. B) Defers the children's rendering to the next tick
29. C) Catches errors in children
30. D) Memoizes the children
31. Explanation: Suspense renders the fallback until all suspended children resolve; it works with `React.lazy` and (in concurrent mode) data-fetching libraries.
32. Q5: Why nest Suspense boundaries?
33. A) For SEO
34. B) So a single slow component doesn't block the whole page (*)
35. C) It's required for code splitting
36. D) To enable StrictMode
37. Explanation: Each Suspense boundary shows its own fallback independently, so one slow section loads while the rest of the page is interactive.
38. Q6: Which lifecycle method renders the fallback UI?
39. A) `componentDidCatch`
40. B) `shouldComponentUpdate`
41. C) `getDerivedStateFromError` (*)
42. D) `render`
43. Explanation: `getDerivedStateFromError` updates state during render to switch to the fallback UI; `componentDidCatch` is for logging after the commit.
44. Q7: What is a hydration mismatch?
45. A) A network error
46. B) A type error
47. C) A bundling issue
48. D) When SSR HTML differs from the client's first render (*)
49. Explanation: Hydration mismatch happens when server-rendered HTML doesn't match what React renders on the client; React warns, discards the server HTML, and re-renders — hurting performance.
50. Q8: Which value is safe to render in SSR without hydration issues?
51. A) A constant string from props (*)
52. B) `Date.now()`
53. C) `Math.random()`
54. D) `window.innerWidth`
55. Explanation: Stable values (props, constants) render identically on server and client; time-dependent or environment-dependent values cause mismatches.
56. Q9: Where should you log errors caught by a boundary?
57. A) In `getDerivedStateFromError`
58. B) In `componentDidCatch` (e.g. to Sentry/Datadog) (*)
59. C) In `render`
60. D) In the constructor
61. Explanation: `componentDidCatch` runs after the commit and receives the error plus component stack — the right place to ship the error to your monitoring service.
62. Q10: Which combination gives the best resilience for a complex page?
63. A) One big boundary around the whole app
64. B) One Suspense around the whole app
65. C) Per-section ErrorBoundary + Suspense so failures are isolated (*)
66. D) No boundaries — let the whole page crash
67. Explanation: Wrapping each independent section in its own boundary + Suspense isolates failures and loading states, so one broken or slow panel doesn't take down the page.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What do error boundaries catch?
  options:
    - Errors in event handlers
    - Errors during rendering and in lifecycle methods of children
    - Errors in async code
    - Errors in useEffect
  correctIndex: 1
  explanation: Error boundaries catch render-time errors, lifecycle errors, and constructor errors in child components. They do NOT catch event-handler, async, or effect errors.
- id: q2
  question: Which error source is NOT caught by an error boundary?
  options:
    - A throw inside render
    - A throw inside a constructor
    - A throw inside an onClick handler
    - A throw inside a child's render
  correctIndex: 2
  explanation: Event handlers run outside React's render commit, so error boundaries can't catch them — wrap them in try/catch or use an error reporting utility.
- id: q3
  question: Why is there no hook equivalent of error boundaries?
  options:
    - Hooks can't catch errors
    - The React team forgot
    - Hooks are slower
    - Boundaries need lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) that hooks can't replicate
  correctIndex: 3
  explanation: Error boundaries rely on class lifecycle methods; no hook API exists for this, so class components remain required for catching render errors.
- id: q4
  question: What does `<Suspense fallback={...}>` do?
  options:
    - Shows the fallback while a child "suspends" waiting for code or data
    - Defers the children's rendering to the next tick
    - Catches errors in children
    - Memoizes the children
  correctIndex: 0
  explanation: Suspense renders the fallback until all suspended children resolve; it works with `React.lazy` and (in concurrent mode) data-fetching libraries.
- id: q5
  question: Why nest Suspense boundaries?
  options:
    - For SEO
    - So a single slow component doesn't block the whole page
    - It's required for code splitting
    - To enable StrictMode
  correctIndex: 1
  explanation: Each Suspense boundary shows its own fallback independently, so one slow section loads while the rest of the page is interactive.
- id: q6
  question: Which lifecycle method renders the fallback UI?
  options:
    - "`componentDidCatch`"
    - "`shouldComponentUpdate`"
    - "`getDerivedStateFromError`"
    - "`render`"
  correctIndex: 2
  explanation: "`getDerivedStateFromError` updates state during render to switch to the fallback UI; `componentDidCatch` is for logging after the commit."
- id: q7
  question: What is a hydration mismatch?
  options:
    - A network error
    - A type error
    - A bundling issue
    - When SSR HTML differs from the client's first render
  correctIndex: 3
  explanation: Hydration mismatch happens when server-rendered HTML doesn't match what React renders on the client; React warns, discards the server HTML, and re-renders — hurting performance.
- id: q8
  question: Which value is safe to render in SSR without hydration issues?
  options:
    - A constant string from props
    - "`Date.now()`"
    - "`Math.random()`"
    - "`window.innerWidth`"
  correctIndex: 0
  explanation: Stable values (props, constants) render identically on server and client; time-dependent or environment-dependent values cause mismatches.
- id: q9
  question: Where should you log errors caught by a boundary?
  options:
    - In `getDerivedStateFromError`
    - In `componentDidCatch` (e.g. to Sentry/Datadog)
    - In `render`
    - In the constructor
  correctIndex: 1
  explanation: "`componentDidCatch` runs after the commit and receives the error plus component stack — the right place to ship the error to your monitoring service."
- id: q10
  question: Which combination gives the best resilience for a complex page?
  options:
    - One big boundary around the whole app
    - One Suspense around the whole app
    - Per-section ErrorBoundary + Suspense so failures are isolated
    - No boundaries — let the whole page crash
  correctIndex: 2
  explanation: Wrapping each independent section in its own boundary + Suspense isolates failures and loading states, so one broken or slow panel doesn't take down the page.
```

