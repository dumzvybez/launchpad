---
slug: kotlin-flows-cold-hot-operators
id: kotlin-16
track: kotlin
order: 16
title: Flows — Cold, Hot, Operators
description: Stream asynchronous sequences with `Flow` (cold) and `SharedFlow`/`StateFlow` (hot), apply operators, and learn when each fits.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=8100s
whyItMatters: Stream asynchronous sequences with `Flow` (cold) and `SharedFlow`/`StateFlow` (hot), apply operators, and learn when each fits.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Flows — Cold, Hot, Operators

## Flows — Cold, Hot, Operators

### Why It Matters

Stream asynchronous sequences with `Flow` (cold) and `SharedFlow`/`StateFlow` (hot), apply operators, and learn when each fits.

Stream asynchronous sequences with `Flow` (cold) and `SharedFlow`/`StateFlow` (hot), apply operators, and learn when each fits.

### Prerequisites

- Stage 1-15.
- Solid grasp of coroutines, suspend functions, and structured concurrency.

### Topics

- Cold `Flow<T>` built with `flow { emit(...) }`
- Collecting with `collect` (terminal operator)
- Operators: map, filter, debounce, distinctUntilChanged, flatMapLatest
- Exception handling: catch, retry, retryWhen
- flowOn for upstream dispatcher
- Buffer and conflate for backpressure
- Hot: `SharedFlow` (broadcast) and `StateFlow` (state holder)
- Converting callbacks and channels to flows

### Key Concepts

- A cold `Flow` is lazy — nothing runs until `collect` is called, and each collector gets its own sequence.
- A hot `SharedFlow` (or `StateFlow`) is active regardless of collectors; late subscribers miss earlier emissions (unless `replay` is set).
- `StateFlow` is a single-value holder with equality-based conflation — the canonical choice for UI state in Compose.
- Operators are cold: `flow.map { }` returns a new Flow that doesn't run until collected.
- Backpressure: `buffer` (queue), `conflate` (skip intermediates), `collectLatest` (cancel previous) handle fast producer / slow consumer.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun countdown(): Flow<Int> = flow {
    for (i in 5 downTo 1) {
        delay(200)
        emit(i)
    }
}

fun main() = runBlocking {
    countdown().collect { println(it) }   // 5,4,3,2,1 with 200ms delays
}
```
Caption: Cold flow

### Common Pitfalls

- Calling `collect` from a non-suspend context — `collect` is `suspend`; you need a coroutine scope (`runBlocking` in tests, `viewModelScope` in Android).
- Treating `Flow` like a hot stream — cold flows start fresh per collector; if you want all collectors to share emissions, use `StateFlow` or `SharedFlow`.
- Using `flowOn` after a terminal operator — `flowOn` only affects upstream; place it before `collect` to take effect.
- Forgetting that `MutableStateFlow` requires an initial value — `MutableStateFlow(0)` (initial 0) vs `MutableSharedFlow<T>()` (no initial value, replays configurable).
- Swallowing exceptions in `catch` — `catch` only catches upstream exceptions; if you throw downstream, it won't be caught; use `onEach` carefully and `retry` for transient errors.

### Real-World Applications

- Android's `StateFlow` is the standard way to expose UI state in ViewModels; Compose's `collectAsState()` subscribes to it for recomposition.
- Ktor's `WebSocket` and Server-Sent Events are exposed as `Flow<Frame>` for streaming.
- Square's Workflow library models UI updates as `Flow<Screen>` collected by the runtime.
- Trello's offline-sync pipeline uses `Flow` to model the queue of pending operations.

### Interview Questions

- 1. Difference between a cold Flow and a hot SharedFlow? — Cold flows start fresh per collector (no shared state); hot SharedFlow emits regardless of collectors, with optional replay for late subscribers.
- 2. What is `StateFlow` and when do you use it? — A hot single-value holder with equality-based conflation; ideal for UI state because collectors always get the latest value and updates are deduplicated.
- 3. What does `flowOn(dispatcher)` do? — Switches the upstream (everything before flowOn) to the specified dispatcher without affecting downstream.
- 4. How does backpressure work in Flow? — Operators like `buffer` (queue), `conflate` (skip intermediates), `collectLatest` (cancel previous) handle a fast producer and slow consumer.
- 5. What is `collectLatest` for? — Cancels the previous collector block when a new emission arrives — useful when only the latest value matters (search-as-you-type).

### Mini Project

Build a Search-as-You-Type Flow: A flow that takes user input events, debounces 300ms, distinctUntilChanged, flatMapLatest a search API call, and renders results. Suggested approach:
  - `val queryFlow = MutableStateFlow("")`
  - `queryFlow.debounce(300).distinctUntilChanged().flatMapLatest { q -> searchApi(q) }.collect { render(it) }`
  - `suspend fun searchApi(q: String): Flow<List<Result>> = flow { emit(repo.search(q)) }`
  - Add `catch { emit(emptyList()) }` for resilience
  - Demonstrate with simulated input events that older in-flight calls are canceled

### Exercises

1. Build `fun numbers(): Flow<Int> = flow { for (i in 1..5) { delay(100); emit(i) } }` and collect it.
2. Chain `.map { it * 2 }.filter { it > 4 }` and verify only 6, 8, 10 are collected.
3. Create a `MutableStateFlow(0)` and update it from a coroutine; collect on the main dispatcher and print changes.
4. Use `.buffer()` between a fast emitter (delay 50) and slow collector (delay 200) and measure total time.
5. Add `.retry(3) { it is IOException }` to a flow that fails transiently and verify it recovers.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is `Flow<T>` cold or hot?
9. A) Hot
10. B) Both
11. C) Neither
12. D) Cold — nothing runs until collect is called (*)
13. Explanation: Cold flows are lazy — the producer block runs only when collected, and each collector gets its own sequence.
14. Q2: Which operator is terminal (triggers execution)?
15. A) collect (*)
16. B) map
17. C) filter
18. D) onEach
19. Explanation: Only terminal operators (`collect`, `toList`, `first`, `single`) trigger execution; intermediate operators like `map`/`filter` are lazy.
20. Q3: Which is a hot flow with a single mutable value?
21. A) MutableSharedFlow
22. B) StateFlow (*)
23. C) Channel
24. D) Sequence
25. Explanation: `StateFlow` is a hot single-value holder with equality-based conflation — the standard for UI state in Compose.
26. Q4: What does `flowOn(Dispatchers.IO)` do?
27. A) Switches the downstream dispatcher
28. B) Blocks the collector
29. C) Switches the upstream dispatcher (everything before flowOn) (*)
30. D) Caches all emissions
31. Explanation: `flowOn` changes the dispatcher for upstream operations; the collector's dispatcher is unaffected.
32. Q5: Which operator handles backpressure by skipping intermediates?
33. A) buffer
34. B) debounce
35. C) retry
36. D) conflate (*)
37. Explanation: `conflate` keeps only the latest value when the consumer is slow; `buffer` queues instead of skipping.
38. Q6: What does `collectLatest` do?
39. A) Cancels the previous collector when a new value arrives (*)
40. B) Collects the last N values
41. C) Buffers all values
42. D) Throws if multiple values
43. Explanation: `collectLatest` cancels the in-progress collector block when a new emission arrives — useful when only the latest value matters.
44. Q7: What's the difference between `MutableStateFlow` and `MutableSharedFlow`?
45. A) None
46. B) StateFlow has a single value with equality conflation; SharedFlow broadcasts to multiple collectors (*)
47. C) SharedFlow is deprecated
48. D) StateFlow is for lists only
49. Explanation: `StateFlow` holds one value (with equality-based conflation); `SharedFlow` is a general broadcast with optional `replay` for late collectors.
50. Q8: Does a cold Flow emit values without a collector?
51. A) Yes
52. B) Only with replay
53. C) No — cold flows are lazy (*)
54. D) Only on Main
55. Explanation: Cold flows produce nothing until collected; if no one collects, nothing happens.
56. Q9: Which operator catches upstream exceptions?
57. A) onEach
58. B) retry
59. C) collect
60. D) catch (*)
61. Explanation: `catch` catches exceptions from upstream (before the catch operator); it cannot catch exceptions thrown inside `collect`'s lambda.
62. Q10: Which is the canonical Android UI state holder?
63. A) StateFlow (*)
64. B) MutableLiveData
65. C) LiveData
66. D) Cold Flow
67. Explanation: `StateFlow` is the modern Kotlin-first choice for UI state in ViewModels; Compose's `collectAsState()` subscribes to it for recomposition.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is `Flow<T>` cold or hot?
  options:
    - Hot
    - Both
    - Neither
    - Cold — nothing runs until collect is called
  correctIndex: 3
  explanation: Cold flows are lazy — the producer block runs only when collected, and each collector gets its own sequence.
- id: q2
  question: Which operator is terminal (triggers execution)?
  options:
    - collect
    - map
    - filter
    - onEach
  correctIndex: 0
  explanation: Only terminal operators (`collect`, `toList`, `first`, `single`) trigger execution; intermediate operators like `map`/`filter` are lazy.
- id: q3
  question: Which is a hot flow with a single mutable value?
  options:
    - MutableSharedFlow
    - StateFlow
    - Channel
    - Sequence
  correctIndex: 1
  explanation: "`StateFlow` is a hot single-value holder with equality-based conflation — the standard for UI state in Compose."
- id: q4
  question: What does `flowOn(Dispatchers.IO)` do?
  options:
    - "` do?"
    - Switches the downstream dispatcher
    - Blocks the collector
    - Switches the upstream dispatcher (everything before flowOn)
    - Caches all emissions
  correctIndex: 3
  explanation: "`flowOn` changes the dispatcher for upstream operations; the collector's dispatcher is unaffected."
- id: q5
  question: Which operator handles backpressure by skipping intermediates?
  options:
    - buffer
    - debounce
    - retry
    - conflate
  correctIndex: 3
  explanation: "`conflate` keeps only the latest value when the consumer is slow; `buffer` queues instead of skipping."
- id: q6
  question: What does `collectLatest` do?
  options:
    - Cancels the previous collector when a new value arrives
    - Collects the last N values
    - Buffers all values
    - Throws if multiple values
  correctIndex: 0
  explanation: "`collectLatest` cancels the in-progress collector block when a new emission arrives — useful when only the latest value matters."
- id: q7
  question: What's the difference between `MutableStateFlow` and `MutableSharedFlow`?
  options:
    - None
    - StateFlow has a single value with equality conflation; SharedFlow broadcasts to multiple collectors
    - SharedFlow is deprecated
    - StateFlow is for lists only
  correctIndex: 1
  explanation: "`StateFlow` holds one value (with equality-based conflation); `SharedFlow` is a general broadcast with optional `replay` for late collectors."
- id: q8
  question: Does a cold Flow emit values without a collector?
  options:
    - Yes
    - Only with replay
    - No — cold flows are lazy
    - Only on Main
  correctIndex: 2
  explanation: Cold flows produce nothing until collected; if no one collects, nothing happens.
- id: q9
  question: Which operator catches upstream exceptions?
  options:
    - onEach
    - retry
    - collect
    - catch
  correctIndex: 3
  explanation: "`catch` catches exceptions from upstream (before the catch operator); it cannot catch exceptions thrown inside `collect`'s lambda."
- id: q10
  question: Which is the canonical Android UI state holder?
  options:
    - StateFlow
    - MutableLiveData
    - LiveData
    - Cold Flow
  correctIndex: 0
  explanation: "`StateFlow` is the modern Kotlin-first choice for UI state in ViewModels; Compose's `collectAsState()` subscribes to it for recomposition."
```

