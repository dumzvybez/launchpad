---
slug: svelte-slots-snippets
id: svelte-04
track: svelte
order: 4
title: Slots and Snippets
description: Master Svelte 5 snippets — passing UI as props, parameterized snippets, default snippets and fallbacks, and migrating from Svelte 4 slots.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=90s
whyItMatters: Master Svelte 5 snippets — passing UI as props, parameterized snippets, default snippets and fallbacks, and migrating from Svelte 4 slots.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Slots and Snippets

## Slots and Snippets

### Why It Matters

Master Svelte 5 snippets — passing UI as props, parameterized snippets, default snippets and fallbacks, and migrating from Svelte 4 slots.

Master Svelte 5 snippets — passing UI as props, parameterized snippets, default snippets and fallbacks, and migrating from Svelte 4 slots.

### Prerequisites

- Stage 3: Components and Props
- Understanding of component composition patterns.

### Topics

- Snippet basics: declaring and rendering
- Snippets with parameters
- Default snippets and fallbacks
- The `children` snippet convention
- Named snippets (replacing named slots)
- Conditional snippets
- Snippets as component props
- Migration: slots to snippets

### Key Concepts

- A snippet is a reusable chunk of UI declared inline with `{#snippet name(args)}...{/snippet}`
- Snippets can take parameters, unlike slots
- `{@render name(args)}` invokes a snippet
- `children` is the conventional name for the default content snippet
- Snippets are first-class values — pass them as props, store in arrays, render conditionally
- Slot fallback content uses `{@render children?.()}` with optional chaining

```svelte
<script>
  let { children } = $props();
</script>

<div class="card">
  {@render children()}
</div>
```
Caption: Basic snippet

### Common Pitfalls

- Trying to use Svelte 4 `<slot name="x">` in a runes component — migrate to `let { x }: { x?: Snippet } = $props()` and `{@render x?.()}`.
- Forgetting to pass snippet parameters — `{@render row(item)}` not `{@render row()}` if the snippet expects one.
- Confusing snippet scope — snippets declared inside `{#each}` close over the loop variable correctly (Svelte handles this), but passing them out of scope requires care.
- Using `children` as a variable name for non-snippet data — `children` is the conventional default snippet name; reuse only with intent.
- Forgetting that snippet types must be imported: `import type { Snippet } from "svelte"` and generic syntax `Snippet<[item: T]>`.

### Real-World Applications

- The New York Times' data table component uses a parameterized snippet for each row, letting different stories render rows with custom layouts.
- Apple Music's playlist component uses a `trackRow` snippet that callers customize with play buttons or context menus.
- Rakuten's category grid uses snippet parameters to swap promotional badges per card.
- Chess.com's move history uses snippets to render annotations inline with each ply.

### Interview Questions

- 1. What's a Svelte 5 snippet? — A reusable UI chunk declared with `{#snippet name(args)}...{/snippet}`, renderable via `{@render name(args)}`.
- 2. How do snippets differ from slots? — Snippets are first-class values that can be passed as props, take parameters, and render anywhere; slots are scope-limited tags.
- 3. How do you pass a snippet to a child component? — Declare it inside the child's tags using `{#snippet ...}` and the child receives it as a typed `Snippet` prop.
- 4. Can snippets take parameters? — Yes: `{#snippet row(item)}` then `{@render row(item)}` — unlike slots which can't take arbitrary parameters.
- 5. How do you migrate `<slot name="header" />` to snippets? — Type `header?: Snippet` in $props(), invoke with `{@render header?.()}`, and in the parent declare `{#snippet header()}...{/snippet}`.

### Mini Project

Build a Reusable Table Component with Snippet Columns: A `DataTable.svelte` that takes a `rows` array and snippet props for each column (e.g., `nameCell`, `statusCell`), rendering a header row and parameterized snippet cells. Demonstrate by rendering an employee directory with custom status badges. Suggested approach:
  - Define `Row = { id: number; name: string; status: "active" | "away" }`
  - Type snippet props as `Snippet<[row: Row]>`
  - Use `{@render nameCell(row)}` in each <td>
  - In the parent, declare `{#snippet nameCell(row)}<strong>{row.name}</strong>{/snippet}`
  - Add an `emptyState` snippet fallback when rows.length === 0

### Exercises

1. Build a Card component with optional `header` and `footer` snippets plus default `children`.
2. Convert a Svelte 4 component using `<slot name="row" />` to snippets with parameters.
3. Create a snippet that takes a number parameter and renders that many stars.
4. Build a parent that conditionally passes different snippets based on a `mode` prop.
5. Add a fallback for an optional snippet using `??`.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do you declare a snippet inline?
9. A) function snippet() {}
10. B) <snippet name>
11. C) const snippet = render()
12. D) {#snippet name(args)}...{/snippet} (*)
13. Explanation: Snippets are declared with `{#snippet name(args)}...{/snippet}` and rendered with `{@render name(args)}`.
14. Q2: How do you invoke a snippet?
15. A) {@render name()} (*)
16. B) <snippet />
17. C) call(name)
18. D) {{ name }}
19. Explanation: `{@render name(args)}` invokes the snippet and inserts its output into the DOM.
20. Q3: What's the conventional name for the default content snippet?
21. A) default
22. B) children (*)
23. C) slot
24. D) content
25. Explanation: `children` is the conventional default snippet name in Svelte 5; receive it via `let { children } = $props()`.
26. Q4: Can snippets take parameters?
27. A) No
28. B) Only via props
29. C) Yes — declared in the snippet tag and passed at {@render} (*)
30. D) Only strings
31. Explanation: Snippets can take typed parameters: `{#snippet row(item)}` then `{@render row(item)}`.
32. Q5: How do you type a snippet prop that takes a Row parameter?
33. A) Snippet
34. B) Function<Row>
35. C) Renderable<Row>
36. D) Snippet<[row: Row]> (*)
37. Explanation: Import `Snippet` from "svelte" and use generic syntax `Snippet<[row: Row]>` for parameterized snippets.
38. Q6: How do you handle an optional snippet that may not be passed?
39. A) {@render snippet?.()} (*)
40. B) {@render snippet()}
41. C) {@render snippet!()}
42. D) {@render snippet || null}
43. Explanation: Optional chaining `{@render snippet?.()}` is idiomatic; you can also guard with `{#if snippet}`.
44. Q7: What replaces `<slot name="header" />` in Svelte 5?
45. A) <Snippet name="header" />
46. B) A snippet prop named `header` rendered with {@render header?.()} (*)
47. C) Nothing — slots still work in runes mode
48. D) A custom element
49. Explanation: Named slots become named snippet props: `header?: Snippet` in $props(), invoked with `{@render header?.()}`.
50. Q8: Where can snippets be declared?
51. A) Only at the top of a component
52. B) Only inside <script>
53. C) Anywhere in markup, including inside {#each} and {#if} (*)
54. D) Only in a separate file
55. Explanation: Snippets can be declared inline anywhere in markup; they close over their lexical scope.
56. Q9: How do you migrate `<slot>fallback</slot>` to snippets?
57. A) It's not possible
58. B) Use a `fallback` prop only
59. C) Use v-if
60. D) {@render children?.() ?? <p>fallback</p>} (*)
61. Explanation: Svelte 5 supports `{@render children?.() ?? <p>fallback</p>}` — the ?? operator renders the fallback when the snippet is absent.
62. Q10: Why prefer snippets over slots in Svelte 5?
63. A) They take parameters, are first-class values, and compose better (*)
64. B) They're faster
65. C) Slots are deprecated in Svelte 5
66. D) They're required by SvelteKit
67. Explanation: Snippets are first-class typed values that can take parameters, be passed as props, and stored in arrays — more flexible than slots.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you declare a snippet inline?
  options:
    - function snippet() {}
    - <snippet name>
    - const snippet = render()
    - "{#snippet name(args)}...{/snippet}"
  correctIndex: 3
  explanation: Snippets are declared with `{#snippet name(args)}...{/snippet}` and rendered with `{@render name(args)}`.
- id: q2
  question: How do you invoke a snippet?
  options:
    - "{@render name()}"
    - <snippet />
    - call(name)
    - "{{ name }}"
  correctIndex: 0
  explanation: "`{@render name(args)}` invokes the snippet and inserts its output into the DOM."
- id: q3
  question: What's the conventional name for the default content snippet?
  options:
    - default
    - children
    - slot
    - content
  correctIndex: 1
  explanation: "`children` is the conventional default snippet name in Svelte 5; receive it via `let { children } = $props()`."
- id: q4
  question: Can snippets take parameters?
  options:
    - No
    - Only via props
    - Yes — declared in the snippet tag and passed at {@render}
    - Only strings
  correctIndex: 2
  explanation: "Snippets can take typed parameters: `{#snippet row(item)}` then `{@render row(item)}`."
- id: q5
  question: How do you type a snippet prop that takes a Row parameter?
  options:
    - Snippet
    - Function<Row>
    - Renderable<Row>
    - "Snippet<[row: Row]>"
  correctIndex: 3
  explanation: 'Import `Snippet` from "svelte" and use generic syntax `Snippet<[row: Row]>` for parameterized snippets.'
- id: q6
  question: How do you handle an optional snippet that may not be passed?
  options:
    - "{@render snippet?.()}"
    - "{@render snippet()}"
    - "{@render snippet!()}"
    - "{@render snippet || null}"
  correctIndex: 0
  explanation: Optional chaining `{@render snippet?.()}` is idiomatic; you can also guard with `{#if snippet}`.
- id: q7
  question: What replaces `<slot name="header" />` in Svelte 5?
  options:
    - <Snippet name="header" />
    - A snippet prop named `header` rendered with {@render header?.()}
    - Nothing — slots still work in runes mode
    - A custom element
  correctIndex: 1
  explanation: "Named slots become named snippet props: `header?: Snippet` in $props(), invoked with `{@render header?.()}`."
- id: q8
  question: Where can snippets be declared?
  options:
    - Only at the top of a component
    - Only inside <script>
    - Anywhere in markup, including inside {#each} and {#if}
    - Only in a separate file
  correctIndex: 2
  explanation: Snippets can be declared inline anywhere in markup; they close over their lexical scope.
- id: q9
  question: How do you migrate `<slot>fallback</slot>` to snippets?
  options:
    - It's not possible
    - Use a `fallback` prop only
    - Use v-if
    - "{@render children?.() ?? <p>fallback</p>}"
  correctIndex: 3
  explanation: Svelte 5 supports `{@render children?.() ?? <p>fallback</p>}` — the ?? operator renders the fallback when the snippet is absent.
- id: q10
  question: Why prefer snippets over slots in Svelte 5?
  options:
    - They take parameters, are first-class values, and compose better
    - They're faster
    - Slots are deprecated in Svelte 5
    - They're required by SvelteKit
  correctIndex: 0
  explanation: Snippets are first-class typed values that can take parameters, be passed as props, and stored in arrays — more flexible than slots.
```

