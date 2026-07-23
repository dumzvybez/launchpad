---
slug: java-collections-framework-list-set-map-queue
id: java-09
track: java
order: 9
title: Collections Framework — List, Set, Map, Queue
description: Use the right collection for the job — ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs LinkedHashMap vs TreeMap, and the concurrent collections in java.util.concurrent.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=9600s
whyItMatters: Use the right collection for the job — ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs LinkedHashMap vs TreeMap, and the concurrent collections in java. util.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Collections Framework — List, Set, Map, Queue

## Collections Framework — List, Set, Map, Queue

### Why It Matters

Use the right collection for the job — ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs LinkedHashMap vs TreeMap, and the concurrent collections in java. util.

Use the right collection for the job — ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs LinkedHashMap vs TreeMap, and the concurrent collections in java.util.concurrent.

### Prerequisites

- Stage 8: Strings, StringBuilder, and Wrappers.
- Comfort with generics-free raw types from prior stages (we'll fix that in Stage 10).

### Topics

- The Collection and Map hierarchies
- ArrayList vs LinkedList — when each wins
- HashSet, LinkedHashSet, TreeSet — ordering and complexity
- HashMap, LinkedHashMap, TreeMap — ordering, complexity, and null handling
- Queue, Deque, ArrayDeque, PriorityQueue
- Collections utility (sort, shuffle, unmodifiable, synchronized wrappers)
- Iterator and fail-fast vs fail-safe (CopyOnWrite)
- ConcurrentHashMap and the concurrent collections family

### Key Concepts

- ArrayList is a growable array with O(1) random access; LinkedList is a doubly-linked list with O(1) add/remove at endpoints but O(n) random access.
- HashMap is O(1) average for get/put; TreeMap is O(log n) but maintains sorted order; LinkedHashMap maintains insertion (or access) order.
- HashSet/HashMap permit one null key; Hashtable (legacy) and ConcurrentHashMap do not permit nulls.
- Collections.synchronizedXxx wrappers exist for legacy compatibility; new code uses java.util.concurrent collections directly.
- Fail-fast iterators (HashMap, ArrayList) throw ConcurrentModificationException on structural change; fail-safe (CopyOnWriteArrayList) snapshot.

```java
List<Integer> arr = new ArrayList<>();        // backed by array
List<Integer> ll  = new LinkedList<>();        // backed by doubly-linked nodes

arr.add(1); arr.add(2); arr.add(0, 99);        // O(n) at index 0
ll.add(1); ll.add(2); ll.add(0, 99);           // O(1) at endpoints

arr.get(1_000_000);   // O(1)
ll.get(1_000_000);    // O(n) — must traverse
```
Caption: ArrayList vs LinkedList

### Common Pitfalls

- Using HashMap from multiple threads — undefined behavior (lost updates, infinite loops in < Java 8); use ConcurrentHashMap.
- Mutating a key after insertion into a HashMap — the entry becomes unreachable; use immutable keys.
- Using LinkedList as a general-purpose List — random access is O(n), so indexed loops are catastrophic; ArrayList is almost always better.
- Relying on HashMap iteration order — it's deliberately unspecified and changes between JVM versions; use LinkedHashMap if order matters.
- Wrapping a collection with `synchronizedList` and then iterating without external synchronization — the iterator is still fail-fast and not thread-safe.

### Real-World Applications

- LinkedIn's real-time presence service uses ConcurrentHashMap for tens of millions of member-to-connection mappings with non-blocking reads.
- Cassandra's memtable uses a custom concurrent skip-list variant (not java.util.concurrent) for ordered, concurrent in-memory writes.
- IntelliJ's PSI caches use ConcurrentHashMap and CopyOnWriteArrayList so that read-heavy code inspections never block the EDT.
- Apache Spark's shuffle buffers use ArrayList and compact primitive arrays for intermediate sort/aggregate stages.

### Interview Questions

- 1. When would you choose LinkedList over ArrayList? — Rarely; only when you frequently add/remove at the endpoints of a list and almost never do random access. ArrayList wins in nearly all real workloads.
- 2. What is the difference between HashMap and ConcurrentHashMap? — ConcurrentHashMap is thread-safe with bucket-level locking (no CME on iteration); HashMap is not thread-safe.
- 3. What is fail-fast vs fail-safe iteration? — Fail-fast iterators throw CME on structural modification; fail-safe (CopyOnWrite) snapshot and don't see concurrent changes.
- 4. Why does HashMap allow null keys but Hashtable does not? — Hashtable (legacy, synchronized) explicitly disallows nulls; HashMap permits one null key by special-casing its hash to 0.
- 5. How does TreeMap maintain order? — Uses a Red-Black tree keyed by the natural ordering or a supplied Comparator; get/put are O(log n).

### Mini Project

Build a Word Frequency Counter: Read text from a file or stdin, tokenize, and print the top-N words by frequency. Use a HashMap and sort the entries. Suggested approach:
  - Read with `Files.readString(Path.of(args[0]))`
  - Tokenize with `String.split("\\W+")` and lowercase
  - Count with `map.merge(word, 1L, Long::sum)`
  - Build a List<Map.Entry> and sort by value descending
  - Print the top 20 with `System.out.printf("%-15s %d%n", word, count)`

### Exercises

1. Time `add(0, x)` on ArrayList vs LinkedList for 100,000 inserts; explain why LinkedList is faster here but slower for indexed get.
2. Use a LinkedHashMap with access-order (`new LinkedHashMap<>(16, 0.75f, true)`) to build a simple LRU cache.
3. Iterate a CopyOnWriteArrayList while another thread mutates it; confirm no CME is thrown and the iterator sees the snapshot.
4. Implement a PriorityQueue with a custom Comparator (e.g., by length of string); confirm `poll()` returns the shortest first.
5. Convert a List to a Set and back to remove duplicates; verify the operation loses order (HashSet) or preserves it (LinkedHashSet).
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: ArrayList is backed by?
9. A) A dynamic array (*)
10. B) A linked list of nodes
11. C) A hash table
12. D) A red-black tree
13. Explanation: ArrayList wraps a Java array that grows by ~50% when full; this gives O(1) random access and amortized O(1) append.
14. Q2: HashMap's average get/put complexity is?
15. A) O(n)
16. B) O(1) (*)
17. C) O(log n)
18. D) O(n log n)
19. Explanation: With a good hash function, HashMap operations are O(1) average (amortized); worst case is O(log n) since Java 8 thanks to treeification of heavy buckets.
20. Q3: Which Map maintains keys in sorted order?
21. A) HashMap
22. B) LinkedHashMap
23. C) TreeMap (*)
24. D) IdentityHashMap
25. Explanation: TreeMap is backed by a Red-Black tree keyed by the natural ordering or a Comparator; operations are O(log n) and keys iterate in sorted order.
26. Q4: ConcurrentHashMap compared to HashMap?
27. A) Allows null keys
28. B) Is slower in all cases
29. C) Was removed in Java 9
30. D) Is thread-safe and disallows nulls (*)
31. Explanation: ConcurrentHashMap uses bucket-level locking for thread-safety and explicitly rejects null keys/values (ambiguity in get()).
32. Q5: A fail-fast iterator on a HashMap throws?
33. A) ConcurrentModificationException (*)
34. B) IllegalStateException
35. C) NullPointerException
36. D) ArrayIndexOutOfBoundsException
37. Explanation: Fail-fast iterators detect structural modification between calls (using a modCount counter) and throw CME to fail early rather than risk corruption.
38. Q6: Which is the recommended Deque implementation (not Stack)?
39. A) Stack
40. B) ArrayDeque (*)
41. C) LinkedList only
42. D) PriorityQueue
43. Explanation: Stack extends Vector and is synchronized; ArrayDeque is faster (no synchronization, better cache locality) and is the recommended stack/queue.
44. Q7: LinkedHashMap with access-order (`true`) is commonly used to implement?
45. A) A Bloom filter
46. B) A priority queue
47. C) An LRU cache (*)
48. D) A trie
49. Explanation: `new LinkedHashMap<>(cap, 0.75f, true)` re-orders on access; override removeEldestEntry to evict the least-recently-used entry — a classic LRU cache.
50. Q8: Hashtable is?
51. A) The recommended replacement for HashMap
52. B) Generic-friendly
53. C) Deprecated for removal
54. D) A legacy synchronized class that disallows nulls (*)
55. Explanation: Hashtable is from Java 1.0 — synchronized method-by-method and disallows null keys/values. Modern code uses ConcurrentHashMap for thread safety.
56. Q9: CopyOnWriteArrayList is appropriate for?
57. A) Read-heavy workloads with infrequent writes (*)
58. B) Write-heavy workloads
59. C) Sorted collections
60. D) Stacks
61. Explanation: CopyOnWriteArrayList copies the backing array on every write (expensive) but reads are lock-free and fast; ideal for listener lists read far more than written.
62. Q10: PriorityQueue orders elements by?
63. A) Insertion order
64. B) Natural ordering or a Comparator (heap-based) (*)
65. C) Hash code
66. D) Random order
67. Explanation: PriorityQueue is a binary heap; the head is the least element per natural ordering or a supplied Comparator. It does NOT iterate in sorted order.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: ArrayList is backed by?
  options:
    - A dynamic array
    - A linked list of nodes
    - A hash table
    - A red-black tree
  correctIndex: 0
  explanation: ArrayList wraps a Java array that grows by ~50% when full; this gives O(1) random access and amortized O(1) append.
- id: q2
  question: HashMap's average get/put complexity is?
  options:
    - O(n)
    - O(1)
    - O(log n)
    - O(n log n)
  correctIndex: 1
  explanation: With a good hash function, HashMap operations are O(1) average (amortized); worst case is O(log n) since Java 8 thanks to treeification of heavy buckets.
- id: q3
  question: Which Map maintains keys in sorted order?
  options:
    - HashMap
    - LinkedHashMap
    - TreeMap
    - IdentityHashMap
  correctIndex: 2
  explanation: TreeMap is backed by a Red-Black tree keyed by the natural ordering or a Comparator; operations are O(log n) and keys iterate in sorted order.
- id: q4
  question: ConcurrentHashMap compared to HashMap?
  options:
    - Allows null keys
    - Is slower in all cases
    - Was removed in Java 9
    - Is thread-safe and disallows nulls
  correctIndex: 3
  explanation: ConcurrentHashMap uses bucket-level locking for thread-safety and explicitly rejects null keys/values (ambiguity in get()).
- id: q5
  question: A fail-fast iterator on a HashMap throws?
  options:
    - ConcurrentModificationException
    - IllegalStateException
    - NullPointerException
    - ArrayIndexOutOfBoundsException
  correctIndex: 0
  explanation: Fail-fast iterators detect structural modification between calls (using a modCount counter) and throw CME to fail early rather than risk corruption.
- id: q6
  question: Which is the recommended Deque implementation (not Stack)?
  options:
    - Stack
    - ArrayDeque
    - LinkedList only
    - PriorityQueue
  correctIndex: 1
  explanation: Stack extends Vector and is synchronized; ArrayDeque is faster (no synchronization, better cache locality) and is the recommended stack/queue.
- id: q7
  question: LinkedHashMap with access-order (`true`) is commonly used to implement?
  options:
    - A Bloom filter
    - A priority queue
    - An LRU cache
    - A trie
  correctIndex: 2
  explanation: "`new LinkedHashMap<>(cap, 0.75f, true)` re-orders on access; override removeEldestEntry to evict the least-recently-used entry — a classic LRU cache."
- id: q8
  question: Hashtable is?
  options:
    - The recommended replacement for HashMap
    - Generic-friendly
    - Deprecated for removal
    - A legacy synchronized class that disallows nulls
  correctIndex: 3
  explanation: Hashtable is from Java 1.0 — synchronized method-by-method and disallows null keys/values. Modern code uses ConcurrentHashMap for thread safety.
- id: q9
  question: CopyOnWriteArrayList is appropriate for?
  options:
    - Read-heavy workloads with infrequent writes
    - Write-heavy workloads
    - Sorted collections
    - Stacks
  correctIndex: 0
  explanation: CopyOnWriteArrayList copies the backing array on every write (expensive) but reads are lock-free and fast; ideal for listener lists read far more than written.
- id: q10
  question: PriorityQueue orders elements by?
  options:
    - Insertion order
    - Natural ordering or a Comparator (heap-based)
    - Hash code
    - Random order
  correctIndex: 1
  explanation: PriorityQueue is a binary heap; the head is the least element per natural ordering or a supplied Comparator. It does NOT iterate in sorted order.
```

