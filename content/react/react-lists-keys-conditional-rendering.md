---
slug: react-lists-keys-conditional-rendering
id: react-05
track: react
order: 5
title: Lists, Keys, and Conditional Rendering
description: Render lists correctly with stable keys, switch UI with conditional rendering patterns, and avoid the index-as-key bug when lists reorder.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=240s
whyItMatters: Render lists correctly with stable keys, switch UI with conditional rendering patterns, and avoid the index-as-key bug when lists reorder.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Lists, Keys, and Conditional Rendering

## Lists, Keys, and Conditional Rendering

### Why It Matters

Render lists correctly with stable keys, switch UI with conditional rendering patterns, and avoid the index-as-key bug when lists reorder.

Render lists correctly with stable keys, switch UI with conditional rendering patterns, and avoid the index-as-key bug when lists reorder.

### Prerequisites

- Stage 4: State and Event Handlers.
- Array methods: `map`, `filter`, `find`, `reduce`.

### Topics

- Rendering lists with `.map`
- Why `key` exists and how React uses it
- Stable keys: IDs vs index vs hash
- The index-as-key bug under reordering
- Conditional rendering: ternary, `&&`, early return, `switch`
- Render functions vs JSX in conditionals
- Empty states and loading states
- Filtering and searching lists

### Key Concepts

- `key` is React's identity hint for list items; it tells React which element maps to which DOM node across renders
- Keys must be stable across renders and unique among siblings
- Using array index as key breaks when items reorder, prepend, insert, or delete — state and animations attach to wrong items
- Conditional rendering is just JavaScript — pick the right expression form per case
- Derived data (filtered lists) should be computed in render, not stored as state

```tsx
type Task = { id: string; title: string; done: boolean };

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id} className={t.done ? "done" : ""}>
          {t.title}
        </li>
      ))}
    </ul>
  );
}
```
Caption: List with stable keys

### Common Pitfalls

- Using array index as `key` for reorderable lists — causes state to "stick" to the wrong row after reorder, insert, or delete. Use a stable domain ID.
- Generating keys with `Math.random()` or `Date.now()` in render — creates new keys every render, defeating reconciliation and remounting all children.
- Forgetting `key` entirely — React warns and falls back to index, which has the same reordering bug.
- Using non-unique keys (e.g. duplicate titles) — React can't distinguish items and produces bugs in state, focus, and animation.
- Storing filtered/derived lists in state — duplicate source of truth; recompute from the source array in render with `useMemo`.

### Real-World Applications

- Trello's card lists use card IDs (not indexes) as keys so drag-and-drop reorders preserve per-card state (e.g. open menus, draft edits).
- Notion's block list uses UUIDs as keys so block-level state (cursor position, selection) survives reordering and paste.
- Spotify's playlist editor keys rows by track URI to keep play state stable when dragging tracks.
- Linear's issue list uses stable issue IDs as keys to preserve row hover/focus state across fast filter changes.

### Interview Questions

- 1. Why does React need a `key` prop for list items? — To identify which elements changed, were added, or were removed, so reconciliation can preserve DOM nodes and state across renders.
- 2. When is using array index as key acceptable? — Only for static, never-reordered, never-filtered lists where items have no per-item state.
- 3. Why is `key={Math.random()}` in render a bug? — New keys each render force React to unmount and remount every item, losing state and hurting performance.
- 4. How do you render "nothing" conditionally? — Return `null`, `false`, or `undefined` — React renders nothing for those.
- 5. Should you store a filtered list in state? — No; derive it from the source array in render (or `useMemo`) so there's a single source of truth.

### Mini Project

Build a "Searchable, Filterable Task List": An app that displays a list of tasks (id, title, priority, done), supports a search box, and a priority filter dropdown. Clicking a task toggles done; deleting removes it. Use stable IDs for keys and derive the filtered list in render. Suggested approach:
  - Seed 8-10 tasks with `crypto.randomUUID()` for IDs
  - Store `tasks`, `query`, and `priorityFilter` as separate states
  - Compute `visible = tasks.filter(...)` in render (or `useMemo`)
  - Use `task.id` as the key
  - Add a checkbox input bound to `task.done` toggling via immutable update

### Exercises

1. Render an array of 5 numbers as `<li>` and add `key={n}` — confirm no warning.
2. Reproduce the index-as-key bug: render 3 inputs with `key={i}`, type in the middle one, then prepend an item — observe focus/state jumping.
3. Refactor a nested ternary into early returns for readability.
4. Replace `key={Math.random()}` with a stable ID and watch the dev-tools Profiler: remounts disappear.
5. Add a search filter that recomputes the visible list in render (no state) and verify the count updates live.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why does React need a `key` prop on list items?
9. A) To identify which elements changed/added/removed across renders (*)
10. B) To style items uniquely
11. C) To enable sorting
12. D) To provide accessibility
13. Explanation: `key` is React's identity hint for list items so reconciliation can match elements across renders and preserve DOM nodes and state.
14. Q2: When is it safe to use array index as a key?
15. A) Always
16. B) Only for static, never-reordered lists with no per-item state (*)
17. C) Only in production
18. D) Never
19. Explanation: Index keys break when items reorder, prepend, insert, or delete because index no longer maps to the same item.
20. Q3: What happens if you use `key={Math.random()}` in render?
21. A) Faster rendering
22. B) React dedupes random keys
23. C) Every item remounts every render, losing state and hurting perf (*)
24. D) Nothing changes
25. Explanation: New keys every render make React think every item is new, so it unmounts the old and mounts a new subtree — destroying state and animations.
26. Q4: Which value does React NOT render (renders nothing)?
27. A) "0"
28. B) {0}
29. C) {undefined-as-children}
30. D) {false} (*)
31. Explanation: React renders strings and numbers, including `0`; it renders nothing for `false`, `null`, `undefined`, and `true`.
32. Q5: Where should a filtered/derived list live?
33. A) Derived in render from the source array (or useMemo) (*)
34. B) In state
35. C) In a ref
36. D) In localStorage
37. Explanation: Deriving in render keeps a single source of truth; storing the filtered list in state introduces a second copy that can drift out of sync.
38. Q6: Which key is best for a list of users fetched from an API?
39. A) The array index
40. B) The user's email or unique ID returned by the API (*)
41. C) A random UUID generated in render
42. D) The user's first name
43. Explanation: A stable server-provided unique ID (or email) is the right key — stable across renders and unique among siblings.
44. Q7: What's the bug when a list has duplicate keys?
45. A) React throws
46. B) The list renders twice
47. C) React can't distinguish items; state/focus/animation may attach to the wrong item (*)
48. D) Nothing — duplicates are allowed
49. Explanation: Duplicate keys prevent React from correctly identifying items, leading to subtle bugs in state, focus, and transitions.
50. Q8: Which pattern handles a multi-state UI cleanly?
51. A) Nested ternaries five levels deep
52. B) Storing JSX in state
53. C) Using setTimeout to switch
54. D) Early returns per state, then a default JSX (*)
55. Explanation: Early returns (e.g. `if (loading) return <Spinner/>`) make multi-state UIs readable; reserve ternaries for short, two-branch choices.
56. Q9: Why is `key` not accessible as a prop inside the child component?
57. A) `key` is reserved by React and not passed through to the child (*)
58. B) It's stripped from props for security
59. C) It's renamed to `id`
60. D) It is accessible as `props.key`
61. Explanation: `key` is consumed by React itself and is intentionally not forwarded to the child component's props; if you need the ID inside, pass it as a separate prop.
62. Q10: Which is the correct way to render an empty state when a list is empty?
63. A) Render an empty `<ul/>`
64. B) Check `items.length === 0` and render `<EmptyState/>` instead of the list (*)
65. C) Use CSS to hide the list
66. D) Throw an error
67. Explanation: Conditional rendering based on `items.length` (or an explicit status) is the cleanest way to show an empty state without rendering an empty list.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why does React need a `key` prop on list items?
  options:
    - To identify which elements changed/added/removed across renders
    - To style items uniquely
    - To enable sorting
    - To provide accessibility
  correctIndex: 0
  explanation: "`key` is React's identity hint for list items so reconciliation can match elements across renders and preserve DOM nodes and state."
- id: q2
  question: When is it safe to use array index as a key?
  options:
    - Always
    - Only for static, never-reordered lists with no per-item state
    - Only in production
    - Never
  correctIndex: 1
  explanation: Index keys break when items reorder, prepend, insert, or delete because index no longer maps to the same item.
- id: q3
  question: What happens if you use `key={Math.random()}` in render?
  options:
    - Faster rendering
    - React dedupes random keys
    - Every item remounts every render, losing state and hurting perf
    - Nothing changes
  correctIndex: 2
  explanation: New keys every render make React think every item is new, so it unmounts the old and mounts a new subtree — destroying state and animations.
- id: q4
  question: Which value does React NOT render (renders nothing)?
  options:
    - '"0"'
    - "{0}"
    - "{undefined-as-children}"
    - "{false}"
  correctIndex: 3
  explanation: React renders strings and numbers, including `0`; it renders nothing for `false`, `null`, `undefined`, and `true`.
- id: q5
  question: Where should a filtered/derived list live?
  options:
    - Derived in render from the source array (or useMemo)
    - In state
    - In a ref
    - In localStorage
  correctIndex: 0
  explanation: Deriving in render keeps a single source of truth; storing the filtered list in state introduces a second copy that can drift out of sync.
- id: q6
  question: Which key is best for a list of users fetched from an API?
  options:
    - The array index
    - The user's email or unique ID returned by the API
    - A random UUID generated in render
    - The user's first name
  correctIndex: 1
  explanation: A stable server-provided unique ID (or email) is the right key — stable across renders and unique among siblings.
- id: q7
  question: What's the bug when a list has duplicate keys?
  options:
    - React throws
    - The list renders twice
    - React can't distinguish items; state/focus/animation may attach to the wrong item
    - Nothing — duplicates are allowed
  correctIndex: 2
  explanation: Duplicate keys prevent React from correctly identifying items, leading to subtle bugs in state, focus, and transitions.
- id: q8
  question: Which pattern handles a multi-state UI cleanly?
  options:
    - Nested ternaries five levels deep
    - Storing JSX in state
    - Using setTimeout to switch
    - Early returns per state, then a default JSX
  correctIndex: 3
  explanation: Early returns (e.g. `if (loading) return <Spinner/>`) make multi-state UIs readable; reserve ternaries for short, two-branch choices.
- id: q9
  question: Why is `key` not accessible as a prop inside the child component?
  options:
    - "`key` is reserved by React and not passed through to the child"
    - It's stripped from props for security
    - It's renamed to `id`
    - It is accessible as `props.key`
  correctIndex: 0
  explanation: "`key` is consumed by React itself and is intentionally not forwarded to the child component's props; if you need the ID inside, pass it as a separate prop."
- id: q10
  question: Which is the correct way to render an empty state when a list is empty?
  options:
    - Render an empty `<ul/>`
    - Check `items.length === 0` and render `<EmptyState/>` instead of the list
    - Use CSS to hide the list
    - Throw an error
  correctIndex: 1
  explanation: Conditional rendering based on `items.length` (or an explicit status) is the cleanest way to show an empty state without rendering an empty list.
```

