---
slug: kotlin-android-basics-kotlin-capstone-prep
id: kotlin-20
track: kotlin
order: 20
title: Android Basics with Kotlin and Capstone Prep
description: Tie the whole track together with Android fundamentals — Activity/Fragment lifecycle, Jetpack Compose basics, ViewModel + StateFlow — and prepare to ship the capstone.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=10260s
whyItMatters: Tie the whole track together with Android fundamentals — Activity/Fragment lifecycle, Jetpack Compose basics, ViewModel + StateFlow — and prepare to ship the capstone.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Android Basics with Kotlin and Capstone Prep

## Android Basics with Kotlin and Capstone Prep

### Why It Matters

Tie the whole track together with Android fundamentals — Activity/Fragment lifecycle, Jetpack Compose basics, ViewModel + StateFlow — and prepare to ship the capstone.

Tie the whole track together with Android fundamentals — Activity/Fragment lifecycle, Jetpack Compose basics, ViewModel + StateFlow — and prepare to ship the capstone.

### Prerequisites

- Stage 1-19.
- All prior Kotlin concepts: coroutines, Flows, serialization, testing.

### Topics

- Android Studio and project structure
- Activity lifecycle (onCreate, onStart, onResume, onPause, onStop, onDestroy)
- Jetpack Compose basics: @Composable, remember, mutableStateOf
- ViewModel and viewModelScope
- StateFlow as UI state holder
- Lifecycle-aware coroutine scopes (lifecycleScope, repeatOnLifecycle)
- Navigation Compose basics
- Capstone preview: Ktor + Compose + serialization

### Key Concepts

- Android Studio is the official IDE; the Kotlin plugin is bundled and first-class.
- An Activity is a screen; it goes through a lifecycle (created -> started -> resumed -> paused -> stopped -> destroyed) you can hook into.
- Jetpack Compose is Android's modern UI toolkit — Kotlin-only, declarative, with `@Composable` functions that re-run when state changes.
- `ViewModel` survives configuration changes (rotations); expose `StateFlow` for UI state, collect it in Compose with `collectAsStateWithLifecycle()`.
- `viewModelScope` is a structured coroutine scope tied to the ViewModel — cancels when the ViewModel is cleared.

```kotlin
import androidx.compose.runtime.*

@Composable
fun Greeting(name: String) {
    var clicks by remember { mutableStateOf(0) }
    Text("Hello, $name! Clicks: $clicks")
    Button(onClick = { clicks++ }) { Text("Click me") }
}
```
Caption: Composable function

### Common Pitfalls

- Doing network on the Main thread — Android throws `NetworkOnMainThreadException`; always switch to `Dispatchers.IO` (or use a suspend client).
- Forgetting `collectAsStateWithLifecycle` — the older `collectAsState` keeps collecting when the UI is in the background; the lifecycle-aware version pauses collection when stopped.
- Storing mutable state directly in a `@Composable` without `remember` — the state resets on every recomposition; use `remember { mutableStateOf(...) }` or `by remember`.
- Using `GlobalScope` in ViewModels — leaks work that outlives the ViewModel; always use `viewModelScope` or `lifecycleScope`.
- Blocking in `viewModelScope.launch` — `viewModelScope` runs on `Main`; wrap blocking work in `withContext(Dispatchers.IO)`.

### Real-World Applications

- Google's own apps (Drive, Photos, Maps) have migrated to Kotlin + Jetpack Compose; Compose is now the recommended UI toolkit.
- Twitter's Android app adopted Kotlin for new features and reported crash reductions thanks to null safety.
- Trello's Android rewrite in Kotlin + Coroutines simplified their async data layer substantially.
- Cash App (Square) is one of the largest Kotlin + Compose codebases, using Ktor Client for networking.

### Interview Questions

- 1. What is the Activity lifecycle and when does `onCreate` run? — `onCreate` runs once when the Activity is created (before UI is visible); it's where you inflate the layout and set up ViewModels.
- 2. What is Jetpack Compose and how does it differ from XML views? — Compose is a declarative Kotlin-only UI toolkit; UI is built with `@Composable` functions that re-run when state changes — no XML, no `findViewById`.
- 3. Why use a ViewModel? — It survives configuration changes (rotations) and exposes state to the UI; it has a `viewModelScope` for coroutines that cancels on `onCleared`.
- 4. What is `collectAsStateWithLifecycle`? — A Compose helper that collects a `Flow` as `State`, pausing collection when the lifecycle drops below STARTED — saves battery and avoids background updates.
- 5. How do you avoid `NetworkOnMainThreadException`? — Never do network on the Main thread; use `withContext(Dispatchers.IO)` or a suspend client like Ktor's HttpClient.

### Mini Project

Build a Single-Screen Counter App: A Compose screen with a button and text showing the count, backed by a `CounterViewModel` exposing a `StateFlow<Int>`. Suggested approach:
  - `class CounterViewModel : ViewModel() { private val _c = MutableStateFlow(0); val c = _c.asStateFlow(); fun inc() = viewModelScope.launch { _c.value++ } }`
  - `@Composable fun CounterScreen(vm: CounterViewModel = viewModel()) { val count by vm.c.collectAsStateWithLifecycle(); Column { Text("Count: $count"); Button(onClick = { vm.inc() }) { Text("+1") } } }`
  - Add a decrement button and a reset button
  - Test the ViewModel in isolation with `runTest` and Turbine
  - Verify the count survives rotation (ViewModel retains state)

### Exercises

1. Install Android Studio, create an Empty Compose Activity project, and run the default Greeting on an emulator.
2. Add a button that increments a counter stored in `remember { mutableStateOf(0) }` and displays it in a Text.
3. Move the counter into a `CounterViewModel` exposing `StateFlow`; collect with `collectAsStateWithLifecycle`.
4. Write a unit test for the ViewModel using `runTest` and Turbine.
5. Rotate the emulator and verify the count is retained (ViewModel survives).
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Jetpack Compose?
9. A) A build tool
10. B) A JSON library
11. C) A DI framework
12. D) Android's declarative Kotlin UI toolkit (*)
13. Explanation: Compose is Android's modern, declarative UI toolkit — Kotlin-only, with `@Composable` functions that re-run when state changes; no XML.
14. Q2: Which annotation marks a composable UI function?
15. A) `@Composable` (*)
16. B) `@UI`
17. C) `@View`
18. D) `@Layout`
19. Explanation: `@Composable` marks a function as part of the Compose tree; the compiler transforms it to support re-running when state changes.
20. Q3: What does a ViewModel survive?
21. A) App kills
22. B) Configuration changes (rotations) (*)
23. C) Process death
24. D) Reboots
25. Explanation: ViewModels survive configuration changes like rotation; they're cleared on `onCleared` (when the Activity is finished for good) — not process death (use `SavedStateHandle` for that).
26. Q4: Which coroutine scope is tied to a ViewModel?
27. A) GlobalScope
28. B) MainScope
29. C) viewModelScope (*)
30. D) IO
31. Explanation: `viewModelScope` is a structured scope created per ViewModel and canceled in `onCleared` — use it for any coroutine a ViewModel launches.
32. Q5: What does `collectAsStateWithLifecycle` do?
33. A) Always collects regardless of lifecycle
34. B) Cancels the Flow
35. C) Blocks the Main thread
36. D) Pauses collection when the lifecycle drops below STARTED (*)
37. Explanation: The lifecycle-aware collector pauses when the UI is in the background, saving battery and avoiding updates no one sees; the older `collectAsState` keeps collecting.
38. Q6: What exception is thrown for network on the Main thread?
39. A) `NetworkOnMainThreadException` (*)
40. B) `IOException`
41. C) `SecurityException`
42. D) `IllegalStateException`
43. Explanation: Android throws `NetworkOnMainThreadException` for any network call on the Main thread; do network in `Dispatchers.IO` or a suspend client.
44. Q7: What does `remember { mutableStateOf(0) }` do in Compose?
45. A) Saves state to disk
46. B) Persists state across recompositions (*)
47. C) Resets on every recomposition
48. D) Requires a ViewModel
49. Explanation: `remember` caches the value across recompositions; `mutableStateOf` makes it observable so changes trigger recomposition of dependent composables.
50. Q8: Which dispatcher is for blocking I/O in Android?
51. A) Dispatchers.Main
52. B) Dispatchers.Default
53. C) Dispatchers.IO (*)
54. D) Dispatchers.Unconfined
55. Explanation: `Dispatchers.IO` is for blocking operations (file, network, SQLite); `Main` is for UI, `Default` for CPU work.
56. Q9: Which lifecycle method runs once when an Activity is created?
57. A) `onStart`
58. B) `onResume`
59. C) `onPause`
60. D) `onCreate` (*)
61. Explanation: `onCreate` runs once per Activity instance; it's where you inflate the layout, initialize ViewModels, and restore saved state.
62. Q10: For the capstone, which combo does the track recommend?
63. A) Ktor backend + Compose client + kotlinx.serialization (*)
64. B) Spring + XML
65. C) Django + Thymeleaf
66. D) Express + React
67. Explanation: The capstone uses Ktor (coroutine-native backend), Jetpack Compose (Android UI), and kotlinx.serialization (shared DTOs) — pure Kotlin stack across client and server.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What is Jetpack Compose?
  options:
    - A build tool
    - A JSON library
    - A DI framework
    - Android's declarative Kotlin UI toolkit
  correctIndex: 3
  explanation: Compose is Android's modern, declarative UI toolkit — Kotlin-only, with `@Composable` functions that re-run when state changes; no XML.
- id: q2
  question: Which annotation marks a composable UI function?
  options:
    - "`@Composable`"
    - "`@UI`"
    - "`@View`"
    - "`@Layout`"
  correctIndex: 0
  explanation: "`@Composable` marks a function as part of the Compose tree; the compiler transforms it to support re-running when state changes."
- id: q3
  question: What does a ViewModel survive?
  options:
    - App kills
    - Configuration changes (rotations)
    - Process death
    - Reboots
  correctIndex: 1
  explanation: ViewModels survive configuration changes like rotation; they're cleared on `onCleared` (when the Activity is finished for good) — not process death (use `SavedStateHandle` for that).
- id: q4
  question: Which coroutine scope is tied to a ViewModel?
  options:
    - GlobalScope
    - MainScope
    - viewModelScope
    - IO
  correctIndex: 2
  explanation: "`viewModelScope` is a structured scope created per ViewModel and canceled in `onCleared` — use it for any coroutine a ViewModel launches."
- id: q5
  question: What does `collectAsStateWithLifecycle` do?
  options:
    - Always collects regardless of lifecycle
    - Cancels the Flow
    - Blocks the Main thread
    - Pauses collection when the lifecycle drops below STARTED
  correctIndex: 3
  explanation: The lifecycle-aware collector pauses when the UI is in the background, saving battery and avoiding updates no one sees; the older `collectAsState` keeps collecting.
- id: q6
  question: What exception is thrown for network on the Main thread?
  options:
    - "`NetworkOnMainThreadException`"
    - "`IOException`"
    - "`SecurityException`"
    - "`IllegalStateException`"
  correctIndex: 0
  explanation: Android throws `NetworkOnMainThreadException` for any network call on the Main thread; do network in `Dispatchers.IO` or a suspend client.
- id: q7
  question: What does `remember { mutableStateOf(0) }` do in Compose?
  options:
    - Saves state to disk
    - Persists state across recompositions
    - Resets on every recomposition
    - Requires a ViewModel
  correctIndex: 1
  explanation: "`remember` caches the value across recompositions; `mutableStateOf` makes it observable so changes trigger recomposition of dependent composables."
- id: q8
  question: Which dispatcher is for blocking I/O in Android?
  options:
    - Dispatchers.Main
    - Dispatchers.Default
    - Dispatchers.IO
    - Dispatchers.Unconfined
  correctIndex: 2
  explanation: "`Dispatchers.IO` is for blocking operations (file, network, SQLite); `Main` is for UI, `Default` for CPU work."
- id: q9
  question: Which lifecycle method runs once when an Activity is created?
  options:
    - "`onStart`"
    - "`onResume`"
    - "`onPause`"
    - "`onCreate`"
  correctIndex: 3
  explanation: "`onCreate` runs once per Activity instance; it's where you inflate the layout, initialize ViewModels, and restore saved state."
- id: q10
  question: For the capstone, which combo does the track recommend?
  options:
    - Ktor backend + Compose client + kotlinx.serialization
    - Spring + XML
    - Django + Thymeleaf
    - Express + React
    - ", and kotlinx.serialization (shared DTOs) — pure Kotlin stack across client and server."
  correctIndex: 0
  explanation: The capstone uses Ktor (coroutine-native backend), Jetpack Compose (Android UI), and kotlinx.serialization (shared DTOs) — pure Kotlin stack across client and server.
```

