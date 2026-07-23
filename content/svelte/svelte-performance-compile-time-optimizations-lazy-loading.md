---
slug: svelte-performance-compile-time-optimizations-lazy-loading
id: svelte-18
track: svelte
order: 18
title: Performance — Compile-Time Optimizations, Lazy Loading
description: "Squeeze the most out of Svelte's compile-time optimizations and add runtime performance techniques: code splitting, lazy loading, prefetching, and reducing hydration cost."
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=240s
whyItMatters: "Squeeze the most out of Svelte's compile-time optimizations and add runtime performance techniques: code splitting, lazy loading, prefetching, and reducing hydration cost."
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Performance — Compile-Time Optimizations, Lazy Loading

## Performance — Compile-Time Optimizations, Lazy Loading

### Why It Matters

Squeeze the most out of Svelte's compile-time optimizations and add runtime performance techniques: code splitting, lazy loading, prefetching, and reducing hydration cost.

Squeeze the most out of Svelte's compile-time optimizations and add runtime performance techniques: code splitting, lazy loading, prefetching, and reducing hydration cost.

### Prerequisites

- Stage 7: Conditionals and Each Blocks
- Stage 13: SvelteKit — Routing
- Basic awareness of bundle size and Lighthouse.

### Topics

- Svelte's compiler output: why it's small
- $effect vs $derived: avoid unnecessary work
- Keyed each for DOM reuse
- Lazy loading components (SvelteKit route splitting is automatic)
- `await import()` for code splitting inside routes
- Prefetching with data-sveltekit-preload-data
- Reducing hydration cost: csr={false} for static pages
- Lighthouse and bundle analysis

### Key Concepts

- Svelte compiles to imperative JS — no virtual DOM runtime ships
- SvelteKit code-splits per route by default; +page.svelte becomes its own chunk
- Keyed each reuses DOM nodes across reorders, avoiding recreate
- $derived memoizes; $effect re-runs on dep change — prefer $derived for derived data
- Setting `csr={false}` on a +page disables client-side hydration (page is static)

```svelte
<script lang="ts">
  let items = $state([
    { id: 1, label: "Apple" },
    { id: 2, label: "Banana" },
  ]);
  // Without key, Svelte would reuse DOM by index — wrong state if reordered
</script>

{#each items as item (item.id)}
  <input bind:value={item.label} />
{/each}
```
Caption: Keyed each for DOM reuse

### Common Pitfalls

- Using $effect where $derived fits — $effect re-runs on every dep change and can't be memoized; prefer $derived for derived data.
- Unkeyed {#each} on reorderable lists — leaks DOM/state across items; always use `(item.id)`.
- Importing heavy components eagerly — split via dynamic import() for above-the-fold wins.
- Forgetting csr={false} on truly static pages — pays hydration cost for nothing.
- Prefetching too aggressively — data-sveltekit-preload-data="tap" is safer than "hover" for mobile data budgets.

### Real-World Applications

- The New York Times uses prerender=true for evergreen articles so they ship as static HTML with no JS hydration cost.
- Apple Music's web player lazy-loads the lyrics panel only when the user expands it.
- Rakuten uses csr={false} on marketing landing pages and full CSR on the account dashboard.
- Chess.com prefetches analysis routes on hover over board moves for instant navigation.

### Interview Questions

- 1. Why is Svelte's bundle smaller than React's? — Svelte compiles to imperative DOM updates; no virtual DOM runtime ships — just per-component code and a few helpers.
- 2. How does SvelteKit code-split? — Per route by default; each +page.svelte becomes its own chunk loaded on navigation.
- 3. What's data-sveltekit-preload-data? — An attribute that prefetches route code + load data on hover/tap for near-instant navigation.
- 4. When should you set csr={false}? — On static pages (about, blog posts) where you don't need client-side routing or interactivity — saves hydration cost.
- 5. Why prefer $derived over $effect for derived data? — $derived memoizes and only recomputes on dep change; $effect re-runs and can cause loops and extra work.

### Mini Project

Build a Performance-Optimized Marketing Site: A SvelteKit site with prerendered landing/-about pages (csr=false, prerender=true), a hydrated dashboard route, lazy-loaded heavy chart component, and prefetch-on-hover for blog links. Measure with Lighthouse before and after. Suggested approach:
  - Set prerender=true and csr=false on / and /about
  - Keep /dashboard as a normal hydrated route
  - Lazy-load HeavyChart.svelte via dynamic import on button click
  - Add data-sveltekit-preload-data="hover" on blog post links
  - Run Lighthouse and compare bundle + LCP before/after

### Exercises

1. Add a stable key to an existing {#each} block and verify reorder doesn't lose input state.
2. Convert a $effect computing derived data into a $derived.
3. Use dynamic import() to lazy-load a heavy component on button click.
4. Set csr=false and prerender=true on a static page; verify the build outputs a plain .html.
5. Add data-sveltekit-preload-data="hover" to nav links and measure navigation time.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why is Svelte's bundle typically smaller than React's?
9. A) It uses WebAssembly
10. B) It compiles to imperative JS — no virtual DOM runtime ships (*)
11. C) It's minified more
12. D) It removes all CSS
13. Explanation: Svelte compiles .svelte files to plain JS that mutates the DOM directly; no virtual DOM library is shipped, just per-component code.
14. Q2: How does SvelteKit split code by default?
15. A) It bundles everything together
16. B) Per component
17. C) Per route — each +page.svelte becomes its own chunk (*)
18. D) It doesn't split
19. Explanation: SvelteKit splits per route by default; navigation loads only the chunk for the target page plus shared chunks.
20. Q3: What does data-sveltekit-preload-data="hover" do?
21. A) Disables hover styles
22. B) Preloads images
23. C) Skips navigation
24. D) Prefetches route code + load data when the user hovers the link (*)
25. Explanation: SvelteKit prefetches the route's JS and load function output on hover (or tap on mobile) so navigation feels instant.
26. Q4: How do you disable client hydration for a static page?
27. A) export const csr = false in +page.ts (*)
28. B) export const hydrate = false
29. C) Set <svelte:head>
30. D) Use csr: false in svelte.config.js
31. Explanation: In +page.ts (or +page.js), `export const csr = false;` disables client-side hydration — the page renders as static HTML.
32. Q5: Which is preferred for derived data?
33. A) $effect
34. B) $derived (*)
35. C) onMount
36. D) A store
37. Explanation: $derived memoizes and recomputes only on dep change; $effect re-runs and risks extra work and loops. Use $derived for derived values.
38. Q6: What does a keyed {#each} do for performance?
39. A) Slows rendering
40. B) Sorts the array
41. C) Reuses DOM nodes across reorders, avoiding recreate (*)
42. D) Deduplicates items
43. Explanation: With a stable key, Svelte matches items across renders and reuses DOM nodes — avoids tearing down and recreating nodes on reorder.
44. Q7: How do you lazy-load a heavy component?
45. A) Import it normally
46. B) Use svelte:component
47. C) You can't
48. D) await import() on demand (*)
49. Explanation: `const mod = await import("./Heavy.svelte")` creates a separate chunk loaded only when needed; render with <svelte:component this={mod.default}>.
50. Q8: What does prerender=true do?
51. A) Generates static HTML at build time for the route (*)
52. B) Disables SSR
53. C) Pre-renders CSS
54. D) Disables JavaScript
55. Explanation: `export const prerender = true` in +page.ts tells SvelteKit to generate static HTML at build time — great for evergreen content.
56. Q9: What's a performance pitfall of $effect?
57. A) It's slow always
58. B) Re-runs on every dep change; overuse can cause extra work and infinite loops (*)
59. C) It can't read $state
60. D) It's deprecated
61. Explanation: $effect re-runs whenever any tracked dep changes; using it for derived data bypasses memoization, duplicates work, and risks loops.
62. Q10: Which is a good mobile data-budget choice for prefetch?
63. A) data-sveltekit-preload-data="hover" always
64. B) Disable prefetch entirely
65. C) "tap" instead of "hover" to avoid wasting data on touch devices (*)
66. D) Prefetch everything on page load
67. Explanation: On mobile, "hover" doesn't really exist; "tap" prefetches just before navigation, balancing speed and data usage.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why is Svelte's bundle typically smaller than React's?
  options:
    - It uses WebAssembly
    - It compiles to imperative JS — no virtual DOM runtime ships
    - It's minified more
    - It removes all CSS
  correctIndex: 1
  explanation: Svelte compiles .svelte files to plain JS that mutates the DOM directly; no virtual DOM library is shipped, just per-component code.
- id: q2
  question: How does SvelteKit split code by default?
  options:
    - It bundles everything together
    - Per component
    - Per route — each +page.svelte becomes its own chunk
    - It doesn't split
  correctIndex: 2
  explanation: SvelteKit splits per route by default; navigation loads only the chunk for the target page plus shared chunks.
- id: q3
  question: What does data-sveltekit-preload-data="hover" do?
  options:
    - Disables hover styles
    - Preloads images
    - Skips navigation
    - Prefetches route code + load data when the user hovers the link
  correctIndex: 3
  explanation: SvelteKit prefetches the route's JS and load function output on hover (or tap on mobile) so navigation feels instant.
- id: q4
  question: How do you disable client hydration for a static page?
  options:
    - export const csr = false in +page.ts
    - export const hydrate = false
    - Set <svelte:head>
    - "Use csr: false in svelte.config.js"
  correctIndex: 0
  explanation: In +page.ts (or +page.js), `export const csr = false;` disables client-side hydration — the page renders as static HTML.
- id: q5
  question: Which is preferred for derived data?
  options:
    - $effect
    - $derived
    - onMount
    - A store
  correctIndex: 1
  explanation: $derived memoizes and recomputes only on dep change; $effect re-runs and risks extra work and loops. Use $derived for derived values.
- id: q6
  question: What does a keyed {#each} do for performance?
  options:
    - Slows rendering
    - Sorts the array
    - Reuses DOM nodes across reorders, avoiding recreate
    - Deduplicates items
  correctIndex: 2
  explanation: With a stable key, Svelte matches items across renders and reuses DOM nodes — avoids tearing down and recreating nodes on reorder.
- id: q7
  question: How do you lazy-load a heavy component?
  options:
    - Import it normally
    - Use svelte:component
    - You can't
    - await import() on demand
  correctIndex: 3
  explanation: '`const mod = await import("./Heavy.svelte")` creates a separate chunk loaded only when needed; render with <svelte:component this={mod.default}>.'
- id: q8
  question: What does prerender=true do?
  options:
    - Generates static HTML at build time for the route
    - Disables SSR
    - Pre-renders CSS
    - Disables JavaScript
  correctIndex: 0
  explanation: "`export const prerender = true` in +page.ts tells SvelteKit to generate static HTML at build time — great for evergreen content."
- id: q9
  question: What's a performance pitfall of $effect?
  options:
    - It's slow always
    - Re-runs on every dep change; overuse can cause extra work and infinite loops
    - It can't read $state
    - It's deprecated
  correctIndex: 1
  explanation: $effect re-runs whenever any tracked dep changes; using it for derived data bypasses memoization, duplicates work, and risks loops.
- id: q10
  question: Which is a good mobile data-budget choice for prefetch?
  options:
    - data-sveltekit-preload-data="hover" always
    - Disable prefetch entirely
    - '"tap" instead of "hover" to avoid wasting data on touch devices'
    - Prefetch everything on page load
  correctIndex: 2
  explanation: On mobile, "hover" doesn't really exist; "tap" prefetches just before navigation, balancing speed and data usage.
```

