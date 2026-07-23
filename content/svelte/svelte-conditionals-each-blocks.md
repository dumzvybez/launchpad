---
slug: svelte-conditionals-each-blocks
id: svelte-07
track: svelte
order: 7
title: Conditionals and Each Blocks
description: Render UI conditionally with {#if}/{:else if}/{:else} and iterate with {#each}, including keyed lists, indices, and the {#key} block for forced re-creation.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=180s
whyItMatters: Render UI conditionally with {#if}/{:else if}/{:else} and iterate with {#each}, including keyed lists, indices, and the {#key} block for forced re-creation.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Conditionals and Each Blocks

## Conditionals and Each Blocks

### Why It Matters

Render UI conditionally with {#if}/{:else if}/{:else} and iterate with {#each}, including keyed lists, indices, and the {#key} block for forced re-creation.

Render UI conditionally with {#if}/{:else if}/{:else} and iterate with {#each}, including keyed lists, indices, and the {#key} block for forced re-creation.

### Prerequisites

- Stage 2: Reactivity and Assignments
- Stage 3: Components and Props
- Basic JavaScript arrays and conditionals.

### Topics

- {#if}/{:else if}/{:else} blocks
- {#each} with index and destructuring
- Keyed each blocks ({#each items as item, i (item.id)})
- {#key} block for forcing re-creation
- {#each} over iterables and arrays of objects
- {:else} for empty arrays in {#each}
- Nested each and conditional combos
- Async blocks: {#await}/{:then}/{:catch}

### Key Concepts

- Keyed each blocks tell Svelte how to match items across renders for efficient DOM reuse
- Without a key, Svelte uses index-based diffing — risky if items reorder or get inserted in the middle
- {#key expr} forces Svelte to destroy and recreate the inner DOM when expr changes
- {#each} supports {:else} for empty lists
- {#await} handles promises declaratively with pending/then/catch branches

```svelte
<script lang="ts">
  let status = $state<"idle" | "loading" | "done" | "error">("idle");
</script>

{#if status === "loading"}
  <p>Loading...</p>
{:else if status === "error"}
  <p>Error!</p>
{:else if status === "done"}
  <p>Done.</p>
{:else}
  <p>Idle.</p>
{/if}
```
Caption: Conditional rendering

### Common Pitfalls

- Using `{#each items as item}` without a key when items reorder — Svelte reuses DOM by index, leading to wrong state on inputs; use `(item.id)`.
- Mutating array in place and expecting re-render in Svelte 4 — works in Svelte 5 (proxy), but Svelte 4 needs reassignment; verify which version you target.
- Forgetting {:else} on {#each} — adds an empty-state fallback for zero-length arrays.
- Using {#key} for general reactivity — {#key} destroys and recreates DOM, expensive; use only when you really need state reset.
- Reading `item` outside the {#each} scope — the loop variable is scoped to the block; lift to script if needed elsewhere.

### Real-World Applications

- The New York Times' homepage uses {#if} to conditionally render breaking-news banners and {#each} for the article list keyed by URL.
- Apple Music's track list uses keyed {#each} so reordering playlists preserves the play state of each row.
- Rakuten's product grid uses keyed each with product IDs so scrolling and filtering reuse DOM efficiently.
- Chess.com's move history uses {#key} to reset the analysis board when a new game loads.

### Interview Questions

- 1. Why use a key in {#each}? — It tells Svelte how to match items across renders so DOM and component state are preserved correctly when items reorder or get inserted.
- 2. What happens without a key? — Svelte uses index-based diffing, which can leak state across items when the list reorders.
- 3. What's the {#key} block for? — Forcing Svelte to destroy and recreate the inner DOM when the key expression changes — useful for resetting component state.
- 4. Does {#each} support {:else}? — Yes, it renders when the array is empty, providing a built-in empty-state fallback.
- 5. How does {#await} work? — It declaratively handles a promise with three branches: pending (default), {:then value}, and {:catch error}.

### Mini Project

Build a Filterable Task List: A page with a list of tasks (id, text, done, priority), a filter for all/active/done, and a priority sort toggle. Use keyed {#each} for the list, {#if} for the filter, and {#key} to reset an "elapsed timer" component when the filter changes. Suggested approach:
  - Use $state for tasks array and filter string
  - Compute visible tasks with $derived based on filter
  - Render with `{#each visible as t (t.id)}`
  - Add {:else} for empty state
  - Wrap the elapsed timer in {#key filter} to restart on filter change

### Exercises

1. Build an {#if}/{:else if}/{:else} status display for loading/done/error.
2. Render an array of objects with a keyed {#each} and verify state preservation when reordered.
3. Add an {:else} to an {#each} that shows "No items" when the list is empty.
4. Use {#key} to reset a counter component when a `key` prop changes.
5. Build an {#await} block that fetches a user and shows loading/result/error states.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which block does conditional rendering in Svelte?
9. A) if/elif/else
10. B) [if]
11. C) {#if}/{:else if}/{:else} (*)
12. D) <If>
13. Explanation: Svelte uses `{#if cond}...{:else if cond}...{:else}...{/if}` for conditional rendering.
14. Q2: Why provide a key in {#each}?
15. A) For performance only
16. B) To sort the array
17. C) To deduplicate items
18. D) To match items across renders so DOM/state is preserved correctly when items reorder (*)
19. Explanation: The key tells Svelte which DOM nodes correspond to which items, so reordering reuses nodes correctly instead of leaking state.
20. Q3: What's the syntax for a keyed each block?
21. A) {#each items as item (item.id)} (*)
22. B) {#each items as item :id}
23. C) {#each items key=id}
24. D) {#each items as item by id}
25. Explanation: The key goes in parentheses after the binding: `{#each items as item (item.id)}`.
26. Q4: Does {#each} support {:else}?
27. A) No
28. B) Yes — renders when the array is empty (*)
29. C) Only with a fallback prop
30. D) Only in Svelte 4
31. Explanation: `{#each items as item}...{:else}<empty-state>{/each}` renders the else branch when items.length === 0.
32. Q5: What does {#key expr} do?
33. A) Caches the expression
34. B) Sorts the inner content
35. C) Forces Svelte to destroy and recreate the inner DOM when expr changes (*)
36. D) Adds an aria-key attribute
37. Explanation: {#key expr} tears down and rebuilds its contents whenever the expression changes — useful for resetting state.
38. Q6: Which block handles promises declaratively?
39. A) {#promise}
40. B) {#async}
41. C) {#try}
42. D) {#await}/{:then}/{:catch} (*)
43. Explanation: `{#await promise}pending{:then v}result{:catch e}error{/await}` handles promises with three branches.
44. Q7: What's a common pitfall of unkeyed {#each}?
45. A) State leakage across items when the list reorders (*)
46. B) Faster rendering
47. C) Memory leaks
48. D) Type errors
49. Explanation: Without a key, Svelte uses index-based diffing; reordering can put the wrong state on the wrong item (e.g., checkbox checked on the wrong row).
50. Q8: What's the index variable in `{#each items as item, i}`?
51. A) The item id
52. B) The zero-based array index (*)
53. C) A unique key
54. D) The element ref
55. Explanation: `i` is the zero-based index of the current item; useful for stripes, zebra rows, and "first/last" checks.
56. Q9: Can {#each} iterate over non-array iterables?
57. A) No
58. B) Only arrays
59. C) Yes — Svelte accepts any iterable including Map and Set (*)
60. D) Only objects
61. Explanation: Svelte's {#each} accepts arrays and any iterable; for plain objects, use `Object.entries(obj)` or a derived array.
62. Q10: When should you use {#key}?
63. A) For general reactivity
64. B) To improve performance
65. C) To add a key to an each block
66. D) When you need to force-reset component state on a value change (*)
67. Explanation: {#key} is for intentionally destroying and recreating DOM (and child component state) when a value changes — e.g., restarting a timer when route changes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which block does conditional rendering in Svelte?
  options:
    - if/elif/else
    - "[if]"
    - "{#if}/{:else if}/{:else}"
    - <If>
  correctIndex: 2
  explanation: Svelte uses `{#if cond}...{:else if cond}...{:else}...{/if}` for conditional rendering.
- id: q2
  question: Why provide a key in {#each}?
  options:
    - For performance only
    - To sort the array
    - To deduplicate items
    - To match items across renders so DOM/state is preserved correctly when items reorder
  correctIndex: 3
  explanation: The key tells Svelte which DOM nodes correspond to which items, so reordering reuses nodes correctly instead of leaking state.
- id: q3
  question: What's the syntax for a keyed each block?
  options:
    - "{#each items as item (item.id)}"
    - "{#each items as item :id}"
    - "{#each items key=id}"
    - "{#each items as item by id}"
  correctIndex: 0
  explanation: "The key goes in parentheses after the binding: `{#each items as item (item.id)}`."
- id: q4
  question: Does {#each} support {:else}?
  options:
    - No
    - Yes — renders when the array is empty
    - Only with a fallback prop
    - Only in Svelte 4
  correctIndex: 1
  explanation: "`{#each items as item}...{:else}<empty-state>{/each}` renders the else branch when items.length === 0."
- id: q5
  question: What does {#key expr} do?
  options:
    - Caches the expression
    - Sorts the inner content
    - Forces Svelte to destroy and recreate the inner DOM when expr changes
    - Adds an aria-key attribute
  correctIndex: 2
  explanation: "{#key expr} tears down and rebuilds its contents whenever the expression changes — useful for resetting state."
- id: q6
  question: Which block handles promises declaratively?
  options:
    - "{#promise}"
    - "{#async}"
    - "{#try}"
    - "{#await}/{:then}/{:catch}"
  correctIndex: 3
  explanation: "`{#await promise}pending{:then v}result{:catch e}error{/await}` handles promises with three branches."
- id: q7
  question: What's a common pitfall of unkeyed {#each}?
  options:
    - State leakage across items when the list reorders
    - Faster rendering
    - Memory leaks
    - Type errors
  correctIndex: 0
  explanation: Without a key, Svelte uses index-based diffing; reordering can put the wrong state on the wrong item (e.g., checkbox checked on the wrong row).
- id: q8
  question: What's the index variable in `{#each items as item, i}`?
  options:
    - The item id
    - The zero-based array index
    - A unique key
    - The element ref
  correctIndex: 1
  explanation: '`i` is the zero-based index of the current item; useful for stripes, zebra rows, and "first/last" checks.'
- id: q9
  question: Can {#each} iterate over non-array iterables?
  options:
    - No
    - Only arrays
    - Yes — Svelte accepts any iterable including Map and Set
    - Only objects
  correctIndex: 2
  explanation: Svelte's {#each} accepts arrays and any iterable; for plain objects, use `Object.entries(obj)` or a derived array.
- id: q10
  question: When should you use {#key}?
  options:
    - For general reactivity
    - To improve performance
    - To add a key to an each block
    - When you need to force-reset component state on a value change
  correctIndex: 3
  explanation: "{#key} is for intentionally destroying and recreating DOM (and child component state) when a value changes — e.g., restarting a timer when route changes."
```

