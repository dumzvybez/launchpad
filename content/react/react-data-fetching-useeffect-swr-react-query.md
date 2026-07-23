---
slug: react-data-fetching-useeffect-swr-react-query
id: react-12
track: react
order: 12
title: Data Fetching — useEffect, SWR, React Query
description: "Fetch data in React the right way: from raw `useEffect`+`fetch` to SWR and TanStack Query, including caching, invalidation, optimistic updates, and pagination."
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=660s
whyItMatters: "Fetch data in React the right way: from raw `useEffect`+`fetch` to SWR and TanStack Query, including caching, invalidation, optimistic updates, and pagination."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Data Fetching — useEffect, SWR, React Query

## Data Fetching — useEffect, SWR, React Query

### Why It Matters

Fetch data in React the right way: from raw `useEffect`+`fetch` to SWR and TanStack Query, including caching, invalidation, optimistic updates, and pagination.

Fetch data in React the right way: from raw `useEffect`+`fetch` to SWR and TanStack Query, including caching, invalidation, optimistic updates, and pagination.

### Prerequisites

- Stage 11: React Router and Navigation.
- HTTP, REST, JSON, `fetch` API, Promises.

### Topics

- The naive `useEffect` + `fetch` pattern and its pitfalls
- Loading/error/idle states
- AbortController for cancellation
- SWR basics: `useSWR`, caching, revalidation
- TanStack Query (React Query): `useQuery`, `useMutation`
- Cache keys, invalidation, and refetching
- Optimistic updates
- Infinite queries / pagination

### Key Concepts

- The naive pattern re-fetches on every mount and has no caching; libraries fix this
- SWR and React Query both use stale-while-revalidate: show cached data, refetch in background
- Cache keys are arrays; same key = same cache entry = shared request
- Invalidation marks a key stale so the next mount refetches
- Optimistic updates apply the expected result immediately and roll back on error

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((u) => { setUser(u); setLoading(false); })
      .catch((e) => { if (e.name !== "AbortError") { setError(e); setLoading(false); } });
    return () => controller.abort();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <Error/>;
  return <div>{user?.name}</div>;
}
```
Caption: Naive useEffect fetch — has pitfalls

### Common Pitfalls

- Calling `setState` after unmount — always use `AbortController` (or a `mounted` flag) and cancel in-flight requests in cleanup.
- Forgetting the dependency array on the fetch effect — re-fetches every render; or omitting `userId` so the wrong user is shown.
- Treating the cache as the source of truth without invalidation — stale data lingers; call `invalidateQueries` after mutations.
- Optimistic update without rollback — if the mutation fails, the UI is now wrong; always restore the previous cache in `onError`.
- Using array-of-one cache keys like `["todos"]` and string keys for parameterized queries — use `["todos", userId]` so different params don't share one cache entry.

### Real-World Applications

- Linear uses TanStack Query (via a custom wrapper) to cache issues across pages and invalidate on mutations.
- Vercel's dashboard uses SWR for project list and deployment status, refetching every few seconds.
- Notion's editor uses a custom fetch layer with optimistic updates for block moves and edits.
- GitHub's React codebase uses React Query for repository data with normalized cache keys per owner/repo.

### Interview Questions

- 1. What's wrong with the naive `useEffect` + `fetch` pattern? — No caching, refetches on every mount, race conditions when props change fast, and no built-in retry/invalidation.
- 2. What is stale-while-revalidate? — Return cached data immediately, refetch in the background, swap in fresh data when it arrives — the model SWR and React Query use.
- 3. Why use a stable cache key like `["todos", userId]`? — Same key = same cache entry; including params prevents cross-contamination between different resources.
- 4. How does an optimistic update work? — `onMutate` updates the cache with the expected result; `onError` rolls back; `onSettled` refetches to confirm.
- 5. When would you pick React Query over SWR? — For mutations, optimistic updates, devtools, and more advanced features; SWR is simpler for read-only caching.

### Mini Project

Build a "GitHub User Search": An app that searches GitHub users by username using the public GitHub API. Show loading state, error handling, paginated results, and cache the previous searches. Use TanStack Query with `useInfiniteQuery` for pagination. Suggested approach:
  - Use `useInfiniteQuery` with `pageParam` for pagination
  - Cache key: `["github-users", query]`
  - Show a stale-while-revalidate badge when refetching
  - Debounce the search input (Stage 9)
  - Add a "Refresh" button that calls `invalidateQueries`

### Exercises

1. Implement the naive `useEffect` + `fetch` pattern and add `AbortController` cleanup.
2. Rewrite it with SWR and observe the cached/refetch-on-focus behavior.
3. Add a mutation with React Query and an optimistic update with rollback.
4. Use `useInfiniteQuery` for "Load more" pagination.
5. Add a "stale" indicator using the `isFetching` flag from React Query.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's a major flaw of the naive `useEffect` + `fetch` pattern?
9. A) It uses too much CPU
10. B) It can't use async/await
11. C) It doesn't work with TypeScript
12. D) No caching, refetches on every mount, race conditions on prop changes (*)
13. Explanation: Naive fetching re-runs on every mount, has no cache, and races when props change quickly; libraries like SWR/React Query solve all three.
14. Q2: What does "stale-while-revalidate" mean?
15. A) Show cached data immediately, refetch in the background, swap when fresh (*)
16. B) Never refetch
17. C) Only fetch on focus
18. D) Refetch every render
19. Explanation: SWR shows the cached value instantly for fast UX, refetches in the background, and updates the UI with fresh data when it arrives.
20. Q3: How should a parameterized query cache key be structured?
21. A) A single string
22. B) An array including params: `["todos", userId]` (*)
23. C) A number
24. D) A Date object
25. Explanation: Array keys with params keep separate cache entries per resource id; `["todos", "ada"]` and `["todos", "linus"]` won't collide.
26. Q4: What does `invalidateQueries` do?
27. A) Deletes the cache
28. B) Cancels in-flight requests
29. C) Marks matching queries stale so they refetch on next mount or focus (*)
30. D) Disables the query
31. Explanation: Invalidation marks queries as stale; React Query refetches active ones immediately and refetches others when they're next mounted or focused.
32. Q5: What is an optimistic update?
33. A) Refetching in the background
34. B) Skipping the mutation
35. C) Debouncing the request
36. D) Applying the expected result to the cache immediately and rolling back on error (*)
37. Explanation: Optimistic updates show the expected result instantly; if the mutation fails, you restore the previous cache so the UI is correct again.
38. Q6: Why must you cancel in-flight queries before an optimistic update?
39. A) So a background refetch doesn't overwrite your optimistic value (*)
40. B) To save bandwidth
41. C) It's required by TypeScript
42. D) To prevent memory leaks
43. Explanation: `qc.cancelQueries` ensures no in-flight refetch resolves after your optimistic update and overwrites it before the mutation completes.
44. Q7: Which library is best suited for mutations with optimistic updates out of the box?
45. A) SWR
46. B) TanStack Query (React Query) (*)
47. C) axios
48. D) plain fetch
49. Explanation: React Query has built-in `useMutation` with `onMutate`/`onError`/`onSettled` for optimistic updates and rollback; SWR's mutation API is more minimal.
50. Q8: What is `useInfiniteQuery` used for?
51. A) Infinite recursion
52. B) Polling forever
53. C) Pagination with "Load more" or infinite scroll (*)
54. D) Cancellation
55. Explanation: `useInfiniteQuery` paginates by `pageParam`, returning `fetchNextPage` to load more — ideal for infinite scroll and "Load more" UIs.
56. Q9: Which hook flag tells you a query is refetching in the background?
57. A) `isLoading`
58. B) `isError`
59. C) `isSuccess`
60. D) `isFetching` (*)
61. Explanation: `isLoading` is true only on the first fetch with no data; `isFetching` is true on every fetch including background refetches, useful for "stale" badges.
62. Q10: What's the right way to handle a request that becomes stale because the user navigated away?
63. A) Cancel it via `AbortController` in the effect cleanup (*)
64. B) Let it resolve and update state anyway
65. C) Use setTimeout
66. D) Catch the error silently
67. Explanation: Always create an `AbortController` per fetch and abort it in cleanup; the fetch rejects with `AbortError` which you can ignore.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's a major flaw of the naive `useEffect` + `fetch` pattern?
  options:
    - It uses too much CPU
    - It can't use async/await
    - It doesn't work with TypeScript
    - No caching, refetches on every mount, race conditions on prop changes
  correctIndex: 3
  explanation: Naive fetching re-runs on every mount, has no cache, and races when props change quickly; libraries like SWR/React Query solve all three.
- id: q2
  question: What does "stale-while-revalidate" mean?
  options:
    - Show cached data immediately, refetch in the background, swap when fresh
    - Never refetch
    - Only fetch on focus
    - Refetch every render
  correctIndex: 0
  explanation: SWR shows the cached value instantly for fast UX, refetches in the background, and updates the UI with fresh data when it arrives.
- id: q3
  question: How should a parameterized query cache key be structured?
  options:
    - A single string
    - 'An array including params: `["todos", userId]`'
    - A number
    - A Date object
  correctIndex: 1
  explanation: Array keys with params keep separate cache entries per resource id; `["todos", "ada"]` and `["todos", "linus"]` won't collide.
- id: q4
  question: What does `invalidateQueries` do?
  options:
    - Deletes the cache
    - Cancels in-flight requests
    - Marks matching queries stale so they refetch on next mount or focus
    - Disables the query
  correctIndex: 2
  explanation: Invalidation marks queries as stale; React Query refetches active ones immediately and refetches others when they're next mounted or focused.
- id: q5
  question: What is an optimistic update?
  options:
    - Refetching in the background
    - Skipping the mutation
    - Debouncing the request
    - Applying the expected result to the cache immediately and rolling back on error
  correctIndex: 3
  explanation: Optimistic updates show the expected result instantly; if the mutation fails, you restore the previous cache so the UI is correct again.
- id: q6
  question: Why must you cancel in-flight queries before an optimistic update?
  options:
    - So a background refetch doesn't overwrite your optimistic value
    - To save bandwidth
    - It's required by TypeScript
    - To prevent memory leaks
  correctIndex: 0
  explanation: "`qc.cancelQueries` ensures no in-flight refetch resolves after your optimistic update and overwrites it before the mutation completes."
- id: q7
  question: Which library is best suited for mutations with optimistic updates out of the box?
  options:
    - SWR
    - TanStack Query (React Query)
    - axios
    - plain fetch
  correctIndex: 1
  explanation: React Query has built-in `useMutation` with `onMutate`/`onError`/`onSettled` for optimistic updates and rollback; SWR's mutation API is more minimal.
- id: q8
  question: What is `useInfiniteQuery` used for?
  options:
    - Infinite recursion
    - Polling forever
    - Pagination with "Load more" or infinite scroll
    - Cancellation
  correctIndex: 2
  explanation: '`useInfiniteQuery` paginates by `pageParam`, returning `fetchNextPage` to load more — ideal for infinite scroll and "Load more" UIs.'
- id: q9
  question: Which hook flag tells you a query is refetching in the background?
  options:
    - "`isLoading`"
    - "`isError`"
    - "`isSuccess`"
    - "`isFetching`"
  correctIndex: 3
  explanation: '`isLoading` is true only on the first fetch with no data; `isFetching` is true on every fetch including background refetches, useful for "stale" badges.'
- id: q10
  question: What's the right way to handle a request that becomes stale because the user navigated away?
  options:
    - Cancel it via `AbortController` in the effect cleanup
    - Let it resolve and update state anyway
    - Use setTimeout
    - Catch the error silently
  correctIndex: 0
  explanation: Always create an `AbortController` per fetch and abort it in cleanup; the fetch rejects with `AbortError` which you can ignore.
```

