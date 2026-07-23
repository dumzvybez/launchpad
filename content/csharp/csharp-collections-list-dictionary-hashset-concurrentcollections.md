---
slug: csharp-collections-list-dictionary-hashset-concurrentcollections
id: csharp-08
track: csharp
order: 8
title: Collections — List, Dictionary, HashSet, ConcurrentCollections
description: Master the core generic collections, choose the right one (List vs Dictionary vs HashSet vs SortedSet), understand capacity and hashing, and use the concurrent collections for thread-safe scenarios.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=7000s
whyItMatters: Master the core generic collections, choose the right one (List vs Dictionary vs HashSet vs SortedSet), understand capacity and hashing, and use the concurrent collections for thread-safe scenarios.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Collections — List, Dictionary, HashSet, ConcurrentCollections

## Collections — List, Dictionary, HashSet, ConcurrentCollections

### Why It Matters

Master the core generic collections, choose the right one (List vs Dictionary vs HashSet vs SortedSet), understand capacity and hashing, and use the concurrent collections for thread-safe scenarios.

Master the core generic collections, choose the right one (List vs Dictionary vs HashSet vs SortedSet), understand capacity and hashing, and use the concurrent collections for thread-safe scenarios.

### Prerequisites

- Stage 7: Generics and Constraints.
- Stage 2: Variables, Types, and Operators (value vs reference, hashing).

### Topics

- List<T> — indexed array, capacity growth, AddRange, RemoveAll, AsReadOnly
- Dictionary<TKey, TValue> — hash table, TryGetValue, GetValueOrDefault, add-vs-set
- HashSet<T> and SortedSet<T> — uniqueness, set operations (Union, Intersect)
- Queue<T>, Stack<T>, LinkedList<T>
- SortedDictionary, SortedList — when ordering matters
- IEqualityComparer<T> and IComparer<T> custom strategies
- ConcurrentDictionary, ConcurrentQueue, ConcurrentBag, BlockingCollection
- Collection initialization, capacity hints, and IReadOnlyList<T>/IReadOnlyDictionary<T>

### Key Concepts

- `List<T>` is a dynamic array — O(1) index access, O(n) insert/remove in the middle; pre-sizing with `new List<T>(capacity)` avoids reallocations.
- `Dictionary<TKey, TValue>` is a hash table — O(1) average lookup, but requires a good `GetHashCode` and `Equals` on TKey (records and primitives have this for free; classes use reference equality unless overridden).
- `HashSet<T>` is a hash table of keys — use it for "is X in this set?" and dedup; `SortedSet<T>` keeps items ordered via a red-black tree (O(log n)).
- `ConcurrentDictionary<TKey, TValue>` is thread-safe — use `GetOrAdd`/`AddOrUpdate` for atomic read-modify-write; `Dictionary` is not thread-safe and a concurrent `Add` can corrupt the bucket array.
- Always expose the narrowest interface you can: return `IReadOnlyList<T>` instead of `List<T>` to prevent callers from mutating your internal state.

```csharp
var nums = new List<int>(capacity: 1_000_000);
for (int i = 0; i < 1_000_000; i++) nums.Add(i);   // no reallocations after first

var evens = nums.FindAll(n => n % 2 == 0);
nums.RemoveAll(n => n % 3 == 0);                   // O(n) in-place removal
var frozen = nums.AsReadOnly();                     // IReadOnlyList<int>
```
Caption: List capacity and bulk ops

### Common Pitfalls

- Iterating a `Dictionary` and mutating it — `foreach (var kv in dict) dict.Remove(kv.Key);` throws `InvalidOperationException`; collect keys first or use `dict.Clear()`.
- Using a mutable class as a `Dictionary` key — mutating a field that contributes to `GetHashCode` makes the key unfindable; use immutable records or readonly fields.
- `Add` vs indexer — `dict.Add(k, v)` throws on duplicate; `dict[k] = v` overwrites silently; choosing the wrong one either crashes or hides bugs.
- Not pre-sizing `List<T>`/`Dictionary` when the count is known — repeated doubling reallocates and copies, causing GC pressure; pass `capacity` to the constructor.
- Exposing `List<T>` from a public API — callers can `Add`/`RemoveAt` and break your invariants; return `IReadOnlyList<T>` (via `AsReadOnly()`) or an immutable `ImmutableArray<T>`.

### Real-World Applications

- Stack Overflow's in-memory question cache uses `ConcurrentDictionary<long, Question>` for the hot path, with `GetOrAdd` to lazily hydrate from Postgres on miss.
- Roslyn caches symbol lookups in `Dictionary<SymbolKey, Symbol>`, pre-sized to the expected file symbol count to avoid resizing during parse.
- Unity's entity-component-system (ECS) uses `HashSet<int>` for archetype membership and `NativeArray<T>` (not the BCL List) for cache-friendly batch processing.
- Microsoft's Kestrel web server uses `ConcurrentQueue<Connection>` for the connection pool, with `BlockingCollection` for the accept loop.

### Interview Questions

- 1. What is the time complexity of `List<T>.Insert(0, x)`? — O(n) because every element must shift one slot right; if you frequently insert at the front, use `LinkedList<T>` or `Deque`.
- 2. Why does `Dictionary<TKey, TValue>` require `GetHashCode` and `Equals` to be consistent? — The dictionary uses the hash to find the bucket and `Equals` to confirm the key; if two equal keys have different hashes, lookups silently miss.
- 3. What is the difference between `Dictionary` and `ConcurrentDictionary`? — `ConcurrentDictionary` is lock-free for reads and uses fine-grained locking for writes; `Dictionary` is not thread-safe and corrupts under concurrent writers.
- 4. When would you choose `SortedDictionary` over `Dictionary`? — When you need keys in sorted order (e.g., range queries, ordered enumeration); `SortedDictionary` is O(log n) lookup vs O(1) for `Dictionary`.
- 5. Why expose `IReadOnlyList<T>` instead of `List<T>` from an API? — To prevent callers from mutating your internal list (adding/removing items), preserving invariants and enabling future changes to the internal representation.

### Mini Project

Build a Word Frequency Counter: Read a text file, count word occurrences case-insensitively, and print the top 20 by frequency using a `Dictionary<string, int>` with `StringComparer.OrdinalIgnoreCase`. Suggested approach:
  - Read lines with `File.ReadLines(path)` (streaming, not loading whole file)
  - Split on `\W+` regex and filter empties
  - Use `dict[word] = dict.GetValueOrDefault(word) + 1` for counting
  - Convert to `List<KeyValuePair>` and sort with `OrderByDescending(kv => kv.Value).ThenBy(kv => kv.Key)`
  - Print top 20 with `string.Join("\n", top.Select(kv => $"{kv.Key}: {kv.Value}"))`

### Exercises

1. Create a `List<int>` without capacity, add 100k items, and observe GC allocations with `dotnet-counters`; then redo with capacity.
2. Build a `Dictionary<record Point, string>` and confirm value equality works without writing GetHashCode.
3. Demonstrate that mutating a class used as a Dictionary key makes it unfindable.
4. Compare `Dictionary`, `SortedDictionary`, and `SortedList` for 1M insertions and 1M lookups; report timings.
5. Implement a thread-safe cache with `ConcurrentDictionary` and `GetOrAdd` calling a factory that sleeps 100ms; verify only one factory call happens per key under concurrency.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the average time complexity of Dictionary<TKey, TValue>.GetValue?
9. A) O(n)
10. B) O(log n)
11. C) O(n log n)
12. D) O(1) (*)
13. Explanation: Dictionary is a hash table — average O(1) lookup, worst-case O(n) only if many hash collisions; in practice it is constant-time.
14. Q2: What happens if you call `dict.Add("k", 1)` and "k" already exists?
15. A) Throws ArgumentException (*)
16. B) Overwrites silently
17. C) Returns false
18. D) Adds a duplicate
19. Explanation: `Add` throws `ArgumentException` on duplicate keys; the indexer `dict["k"] = 1` is what overwrites silently — pick the one matching your intent.
20. Q3: Which collection is best for "is X in this set?" with O(1) membership tests?
21. A) List<T>
22. B) HashSet<T> (*)
23. C) LinkedList<T>
24. D) Queue<T>
25. Explanation: HashSet<T> is a hash table of keys without values; `Contains` is O(1) average; List<T>.Contains is O(n).
26. Q4: Why is `List<T>` not thread-safe for concurrent writers?
27. A) It uses locks internally
28. B) It is immutable
29. C) Its internal array can be reallocated mid-Add, corrupting other threads' indices (*)
30. D) It is sealed
31. Explanation: List<T> has no synchronization; concurrent Add can race on the size/array swap, producing lost writes, duplicate slots, or IndexOutOfRange.
32. Q5: Which collection keeps items in sorted order using a red-black tree?
33. A) HashSet<T>
34. B) Queue<T>
35. C) Stack<T>
36. D) SortedSet<T> (*)
37. Explanation: SortedSet<T> (and SortedDictionary<TKey,TValue>) use a balanced tree, giving O(log n) insert/lookup and in-order enumeration.
38. Q6: Which statement about `ConcurrentDictionary.GetOrAdd(key, factory)` is TRUE?
39. A) The factory may run multiple times under contention, but the same value is returned to all callers (*)
40. B) The factory is guaranteed to run at most once per key
41. C) The factory never runs if the key already exists in the dictionary
42. D) The factory runs exactly once per process lifetime
43. Explanation: GetOrAdd may invoke the factory more than once under concurrent calls, but only one value is stored and returned to all callers; wrap the value in Lazy<T> if you need exactly-once factory execution.
44. Q7: Mutating a field of a class used as a Dictionary key…
45. A) Has no effect
46. B) Can make the key unfindable because the hash no longer matches its bucket (*)
47. C) Updates the bucket automatically
48. D) Throws an exception
49. Explanation: The Dictionary does not re-hash on mutation; the entry stays in its old bucket but a new lookup computes the new hash and looks in the wrong bucket — silent miss.
50. Q8: Which interface should a public API return to expose an immutable list view?
51. A) IList<T>
52. B) List<T>
53. C) IReadOnlyList<T> (*)
54. D) ICollection<T>
55. Explanation: IReadOnlyList<T> exposes index access and Count without Add/RemoveAt, preventing callers from mutating your internal list; pair with .AsReadOnly() to enforce.
56. Q9: `List<T>.Insert(0, item)` is…
57. A) O(1)
58. B) O(log n)
59. C) O(n^2)
60. D) O(n) — all elements shift right (*)
61. Explanation: Inserting at index 0 shifts every existing element one slot right; for frequent front-inserts, use LinkedList<T> or a deque.
62. Q10: Pre-sizing `new List<int>(1_000_000)`…
63. A) Avoids reallocations and copying during growth (*)
64. B) Has no effect
65. C) Allocates the items eagerly
66. D) Throws if you add fewer
67. Explanation: The capacity hint pre-allocates the backing array, so subsequent Adds up to the capacity do not trigger the doubling reallocation-and-copy loop.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the average time complexity of Dictionary<TKey, TValue>.GetValue?
  options:
    - O(n)
    - O(log n)
    - O(n log n)
    - O(1)
  correctIndex: 3
  explanation: Dictionary is a hash table — average O(1) lookup, worst-case O(n) only if many hash collisions; in practice it is constant-time.
- id: q2
  question: What happens if you call `dict.Add("k", 1)` and "k" already exists?
  options:
    - Throws ArgumentException
    - Overwrites silently
    - Returns false
    - Adds a duplicate
  correctIndex: 0
  explanation: '`Add` throws `ArgumentException` on duplicate keys; the indexer `dict["k"] = 1` is what overwrites silently — pick the one matching your intent.'
- id: q3
  question: Which collection is best for "is X in this set?" with O(1) membership tests?
  options:
    - List<T>
    - HashSet<T>
    - LinkedList<T>
    - Queue<T>
  correctIndex: 1
  explanation: HashSet<T> is a hash table of keys without values; `Contains` is O(1) average; List<T>.Contains is O(n).
- id: q4
  question: Why is `List<T>` not thread-safe for concurrent writers?
  options:
    - It uses locks internally
    - It is immutable
    - Its internal array can be reallocated mid-Add, corrupting other threads' indices
    - It is sealed
  correctIndex: 2
  explanation: List<T> has no synchronization; concurrent Add can race on the size/array swap, producing lost writes, duplicate slots, or IndexOutOfRange.
- id: q5
  question: Which collection keeps items in sorted order using a red-black tree?
  options:
    - HashSet<T>
    - Queue<T>
    - Stack<T>
    - SortedSet<T>
  correctIndex: 3
  explanation: SortedSet<T> (and SortedDictionary<TKey,TValue>) use a balanced tree, giving O(log n) insert/lookup and in-order enumeration.
- id: q6
  question: Which statement about `ConcurrentDictionary.GetOrAdd(key, factory)` is TRUE?
  options:
    - The factory may run multiple times under contention, but the same value is returned to all callers
    - The factory is guaranteed to run at most once per key
    - The factory never runs if the key already exists in the dictionary
    - The factory runs exactly once per process lifetime
  correctIndex: 0
  explanation: GetOrAdd may invoke the factory more than once under concurrent calls, but only one value is stored and returned to all callers; wrap the value in Lazy<T> if you need exactly-once factory execution.
- id: q7
  question: Mutating a field of a class used as a Dictionary key…
  options:
    - Has no effect
    - Can make the key unfindable because the hash no longer matches its bucket
    - Updates the bucket automatically
    - Throws an exception
  correctIndex: 1
  explanation: The Dictionary does not re-hash on mutation; the entry stays in its old bucket but a new lookup computes the new hash and looks in the wrong bucket — silent miss.
- id: q8
  question: Which interface should a public API return to expose an immutable list view?
  options:
    - IList<T>
    - List<T>
    - IReadOnlyList<T>
    - ICollection<T>
  correctIndex: 2
  explanation: IReadOnlyList<T> exposes index access and Count without Add/RemoveAt, preventing callers from mutating your internal list; pair with .AsReadOnly() to enforce.
- id: q9
  question: "`List<T>.Insert(0, item)` is…"
  options:
    - O(1)
    - O(log n)
    - O(n^2)
    - O(n) — all elements shift right
  correctIndex: 3
  explanation: Inserting at index 0 shifts every existing element one slot right; for frequent front-inserts, use LinkedList<T> or a deque.
- id: q10
  question: Pre-sizing `new List<int>(1_000_000)`…
  options:
    - Avoids reallocations and copying during growth
    - Has no effect
    - Allocates the items eagerly
    - Throws if you add fewer
  correctIndex: 0
  explanation: The capacity hint pre-allocates the backing array, so subsequent Adds up to the capacity do not trigger the doubling reallocation-and-copy loop.
```

