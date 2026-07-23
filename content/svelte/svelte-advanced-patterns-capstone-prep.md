---
slug: svelte-advanced-patterns-capstone-prep
id: svelte-20
track: svelte
order: 20
title: Advanced Patterns and Capstone Prep
description: Pull together advanced Svelte/SvelteKit patterns — snippets in depth, error boundaries, async state, and architectural choices — and prep for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=360s
whyItMatters: Pull together advanced Svelte/SvelteKit patterns — snippets in depth, error boundaries, async state, and architectural choices — and prep for the capstone project.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Advanced Patterns and Capstone Prep

## Advanced Patterns and Capstone Prep

### Why It Matters

Pull together advanced Svelte/SvelteKit patterns — snippets in depth, error boundaries, async state, and architectural choices — and prep for the capstone project.

Pull together advanced Svelte/SvelteKit patterns — snippets in depth, error boundaries, async state, and architectural choices — and prep for the capstone project.

### Prerequisites

- All prior 19 stages
- Comfort assembling multi-file SvelteKit apps.

### Topics

- <svelte:boundary> for error and pending states
- <svelte:window>, <svelte:document>, <svelte:body> bindings
- <svelte:head> for document head
- <svelte:options> (runes, customElement, tag)
- Snippets as building blocks for higher-order components
- Async load + Suspense-like patterns with {#await}
- Project structure for scale: $lib, services, types
- Capstone planning: scope, P0/P1/P2, file structure, testing plan

### Key Concepts

- <svelte:boundary> catches errors and pending states of its children declaratively
- <svelte:head> inserts elements into document.head (SEO, meta)
- $lib is an alias to src/lib — central place for shared modules
- Snippets enable render-prop patterns similar to React's render props
- Plan capstone scope deliberately: P0 must ship, P1 stretch, P2 nice-to-have

```svelte
<script lang="ts">
  let { children } = $props();
</script>

<svelte:boundary>
  {#snippet failed(error, reset)}
    <p>Something broke: {error.message}</p>
    <button onclick={reset}>Retry</button>
  {/snippet}
  {@render children?.()}
</svelte:boundary>
```
Caption: Error boundary

### Common Pitfalls

- Using try/catch in components for error UI — use <svelte:boundary> for declarative error and pending states.
- Importing server-only code (DB) into client components — keep server code in $lib/server which SvelteKit guards against client imports.
- Polluting +page.svelte with business logic — extract to $lib/services and call from load/actions.
- Skipping capstone P0 planning — scope creep kills projects; lock P0 before writing code.
- Forgetting to set <svelte:head> per route — SEO and social sharing suffer; set title/meta in each page.

### Real-World Applications

- The New York Times uses <svelte:boundary> around chart components so a single broken chart doesn't tank the article.
- Apple Music's web player uses <svelte:head> to update title and metadata per track.
- Rakuten's product pages use $lib/server for database access, guarded from client bundles.
- Chess.com uses $lib/types and services to keep game logic out of route components.

### Interview Questions

- 1. What's <svelte:boundary> for? — Declaratively catches errors and pending states in its children, providing a snippet for the failed UI.
- 2. How do you set the document title in SvelteKit? — Use <svelte:head><title>...</title></svelte:head> inside any component or page.
- 3. What's $lib? — A build alias to src/lib where you put shared code (components, stores, types, server-only modules under $lib/server).
- 4. How does $lib/server protect secrets? — SvelteKit fails the build if any $lib/server import ends up in a client bundle.
- 5. How do you plan a capstone? — Write P0 (must ship), P1 (stretch), P2 (nice-to-have); design file structure; define testing strategy before coding.

### Mini Project

Capstone Prep Document: Write a one-page plan for your capstone (a collaborative bookmark manager): problem statement, target users, P0/P1/P2 requirements, file structure, tech stack, testing plan, and deploy target. Suggested approach:
  - Write the problem statement (3-5 sentences)
  - List 4 user personas
  - Draft 8 P0, 5 P1, 5 P2 requirements
  - Sketch the src/routes and src/lib tree
  - List the tech stack (SvelteKit, adapter-vercel, Vitest, Playwright)

### Exercises

1. Wrap a fragile component in <svelte:boundary> with a failed snippet and reset button.
2. Use <svelte:head> to set a unique title and meta description per route.
3. Set up src/lib/server with a dummy database module and verify importing it from a +page.svelte fails the build.
4. Write a render-prop DataTable using a snippet with a Row parameter.
5. Draft the capstone prep document for your own app idea.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does <svelte:boundary> do?
9. A) Renders a CSS border
10. B) Wraps server loads
11. C) Adds a route guard
12. D) Catches errors and pending states in children with declarative snippets (*)
13. Explanation: <svelte:boundary> provides declarative error and pending-state handling; pass a `failed` snippet for the error UI and a reset callback.
14. Q2: How do you set the document <title> in SvelteKit?
15. A) <svelte:head><title>...</title></svelte:head> (*)
16. B) document.title = "..."
17. C) In svelte.config.js
18. D) +page.ts
19. Explanation: <svelte:head> inserts elements into document.head; place it in any component or +page.svelte for per-route titles and meta.
20. Q3: What's $lib?
21. A) A runtime library
22. B) A build alias to src/lib for shared code (*)
23. C) A package manager
24. D) A CLI tool
25. Explanation: $lib aliases to src/lib, where you place shared components, stores, types, and server-only modules (under $lib/server).
26. Q4: What's special about $lib/server?
27. A) It's faster
28. B) It's deprecated
29. C) SvelteKit fails the build if it's imported into a client bundle (*)
30. D) It runs only in dev
31. Explanation: $lib/server is server-only; SvelteKit enforces this and throws a build error if any client code imports it, protecting secrets.
32. Q5: Which snippet does <svelte:boundary> use for the error UI?
33. A) error
34. B) catch
35. C) fallback
36. D) failed (*)
37. Explanation: The `failed` snippet receives (error, reset) and renders when an error is thrown in the boundary's children.
38. Q6: What does the reset callback in <svelte:boundary> do?
39. A) Re-renders the boundary's children from scratch (*)
40. B) Resets CSS
41. C) Reloads the page
42. D) Clears localStorage
43. Explanation: reset() re-mounts the boundary's children, retrying the failed render — useful for "Retry" buttons after transient errors.
44. Q7: Which special element binds to window scroll?
45. A) <svelte:scroll>
46. B) <svelte:window bind:scrollY> (*)
47. C) <bind:window>
48. D) <Window>
49. Explanation: <svelte:window> exposes reactive bindings like scrollY, innerWidth, innerHeight; bind to them as bind:scrollY={y}.
50. Q8: Where should business logic live in a SvelteKit app?
51. A) +page.svelte inline
52. B) svelte.config.js
53. C) $lib/services, called from load/actions (*)
54. D) The <style> block
55. Explanation: Keep route components lean; extract business logic into $lib/services or $lib/server and call from load functions or form actions.
56. Q9: What's a render-prop pattern in Svelte 5?
57. A) A class component
58. B) A higher-order component
59. C) An effect
60. D) Passing a snippet with parameters to a child for it to render (*)
61. Explanation: Pass a snippet with typed parameters (e.g., Snippet<[Row]>) to a child; the child invokes {@render snippet(row)} — analogous to render props in React.
62. Q10: What's the recommended capstone planning step?
63. A) Write P0/P1/P2, file structure, testing plan before code (*)
64. B) Start coding immediately
65. C) Pick a domain name first
66. D) Buy hosting first
67. Explanation: Lock scope (P0 must-ship, P1 stretch, P2 nice-to-have), draft file structure, define testing plan, then code — scope creep is the #1 capstone killer.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What does <svelte:boundary> do?
  options:
    - Renders a CSS border
    - Wraps server loads
    - Adds a route guard
    - Catches errors and pending states in children with declarative snippets
  correctIndex: 3
  explanation: <svelte:boundary> provides declarative error and pending-state handling; pass a `failed` snippet for the error UI and a reset callback.
- id: q2
  question: How do you set the document <title> in SvelteKit?
  options:
    - <svelte:head><title>...</title></svelte:head>
    - document.title = "..."
    - In svelte.config.js
    - +page.ts
  correctIndex: 0
  explanation: <svelte:head> inserts elements into document.head; place it in any component or +page.svelte for per-route titles and meta.
- id: q3
  question: What's $lib?
  options:
    - A runtime library
    - A build alias to src/lib for shared code
    - A package manager
    - A CLI tool
  correctIndex: 1
  explanation: $lib aliases to src/lib, where you place shared components, stores, types, and server-only modules (under $lib/server).
- id: q4
  question: What's special about $lib/server?
  options:
    - It's faster
    - It's deprecated
    - SvelteKit fails the build if it's imported into a client bundle
    - It runs only in dev
  correctIndex: 2
  explanation: $lib/server is server-only; SvelteKit enforces this and throws a build error if any client code imports it, protecting secrets.
- id: q5
  question: Which snippet does <svelte:boundary> use for the error UI?
  options:
    - error
    - catch
    - fallback
    - failed
  correctIndex: 3
  explanation: The `failed` snippet receives (error, reset) and renders when an error is thrown in the boundary's children.
- id: q6
  question: What does the reset callback in <svelte:boundary> do?
  options:
    - Re-renders the boundary's children from scratch
    - Resets CSS
    - Reloads the page
    - Clears localStorage
  correctIndex: 0
  explanation: reset() re-mounts the boundary's children, retrying the failed render — useful for "Retry" buttons after transient errors.
- id: q7
  question: Which special element binds to window scroll?
  options:
    - <svelte:scroll>
    - <svelte:window bind:scrollY>
    - <bind:window>
    - <Window>
  correctIndex: 1
  explanation: <svelte:window> exposes reactive bindings like scrollY, innerWidth, innerHeight; bind to them as bind:scrollY={y}.
- id: q8
  question: Where should business logic live in a SvelteKit app?
  options:
    - +page.svelte inline
    - svelte.config.js
    - $lib/services, called from load/actions
    - The <style> block
  correctIndex: 2
  explanation: Keep route components lean; extract business logic into $lib/services or $lib/server and call from load functions or form actions.
- id: q9
  question: What's a render-prop pattern in Svelte 5?
  options:
    - A class component
    - A higher-order component
    - An effect
    - Passing a snippet with parameters to a child for it to render
  correctIndex: 3
  explanation: Pass a snippet with typed parameters (e.g., Snippet<[Row]>) to a child; the child invokes {@render snippet(row)} — analogous to render props in React.
- id: q10
  question: What's the recommended capstone planning step?
  options:
    - Write P0/P1/P2, file structure, testing plan before code
    - Start coding immediately
    - Pick a domain name first
    - Buy hosting first
  correctIndex: 0
  explanation: "Lock scope (P0 must-ship, P1 stretch, P2 nice-to-have), draft file structure, define testing plan, then code — scope creep is the #1 capstone killer."
```

