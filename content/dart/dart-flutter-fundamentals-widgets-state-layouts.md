---
slug: dart-flutter-fundamentals-widgets-state-layouts
id: dart-19
track: dart
order: 19
title: Flutter Fundamentals — Widgets, State, Layouts
description: Build Flutter UIs with `StatelessWidget`, `StatefulWidget`, `setState`, common layouts (Row, Column, Stack, ListView), and the widget tree lifecycle. This is a focused tour; the full Flutter track covers more.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=10800s
whyItMatters: Build Flutter UIs with `StatelessWidget`, `StatefulWidget`, `setState`, common layouts (Row, Column, Stack, ListView), and the widget tree lifecycle. This is a focused tour; the full Flutter track covers more.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Flutter Fundamentals — Widgets, State, Layouts

## Flutter Fundamentals — Widgets, State, Layouts

### Why It Matters

Build Flutter UIs with `StatelessWidget`, `StatefulWidget`, `setState`, common layouts (Row, Column, Stack, ListView), and the widget tree lifecycle. This is a focused tour; the full Flutter track covers more.

Build Flutter UIs with `StatelessWidget`, `StatefulWidget`, `setState`, common layouts (Row, Column, Stack, ListView), and the widget tree lifecycle. This is a focused tour; the full Flutter track covers more.

### Prerequisites

- Stage 7: Classes, Constructors, and Named Parameters
- Stage 11: Async Programming — Future, async/await
- Stage 16: Testing — flutter_test, test package, mocktail

### Topics

- `Widget`, `StatelessWidget`, `StatefulWidget`
- `build(context)` and the element tree
- `setState` and the rebuild cycle
- Layout widgets: `Container`, `Row`, `Column`, `Stack`, `Padding`, `Align`
- Scrolling: `ListView`, `GridView`, `SingleChildScrollView`
- `MaterialApp`, `Scaffold`, `AppBar`, `FloatingActionButton`
- Lifecycle: `initState`, `dispose`, `didChangeDependencies`
- `const` widgets for performance (canonicalization)

### Key Concepts

- Everything is a widget: buttons, padding, themes, layouts — all immutable descriptions of UI.
- `StatelessWidget.build` is called when the widget is inserted and when its `InheritedWidget` dependencies change.
- `StatefulWidget` holds a mutable `State` object; `setState(() { ... })` marks the State dirty and schedules a rebuild.
- The widget tree is rebuilt frequently; the element tree is the long-lived counterpart that diffs new widgets against old.
- `const` widgets are canonicalized: two `const Text('hi')` are `identical`, and Flutter skips rebuilding them, a key performance optimization.
- `dispose()` is where you clean up controllers, subscriptions, timers; missing it causes leaks.

```dart
import 'package:flutter/material.dart';

class Greeting extends StatelessWidget {
  final String name;
  const Greeting({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Text('Hello, $name!',
        style: Theme.of(context).textTheme.headlineMedium);
  }
}
```
Caption: Stateless widget

### Common Pitfalls

- Calling `setState` after the widget is disposed — throws "setState() called after dispose()"; always guard with `if (mounted)` after async gaps.
- Forgetting `const` where possible — every non-const widget allocates and rebuilds; mark constructors `const` and instances `const` aggressively for performance.
- Putting business logic in `build` — `build` runs on every rebuild; expensive work belongs in `initState`, event handlers, or a separate class.
- Mutating a list field and calling `setState` — Flutter doesn't deep-compare children, but the same list instance may not trigger rebuilds in some widgets; create a new list to be safe.
- Not disposing controllers (TextEditingController, ScrollController, AnimationController) — leaks listeners and memory; always dispose in `dispose()`.

### Real-World Applications

- Google's own Flutter apps (Google Pay redesign, Stadia remote) use the same widget primitives this stage covers.
- Reflectly's UI is built entirely from Flutter widgets, with `setState` for ephemeral state and `Provider` for app state.
- The Hamilton app uses `ListView.builder` for the show list and `Stack` for layered hero imagery.
- BMW's myBMW app uses `StatefulWidget` extensively for vehicle status cards that update from a stream.

### Interview Questions

- 1. What's the difference between `StatelessWidget` and `StatefulWidget`? — Stateless rebuilds from props only; Stateful holds mutable State across rebuilds via `setState`.
- 2. Why use `const` widgets? — Const widgets are canonicalized and skipped during rebuild, improving performance by avoiding allocation and diffing.
- 3. When does `build` run? — On insertion, when `setState` is called, when an inherited dependency changes, or when the parent rebuilds.
- 4. What goes in `dispose`? — Cancel timers and subscriptions, dispose controllers, close streams; prevents leaks and setState-after-dispose errors.
- 5. Why guard `setState` with `if (mounted)`? — After an async gap, the widget may be disposed; calling setState then throws. The check is a defensive guard.

### Mini Project

Build a Todo List App: A Flutter app with a `ListView` of todos, an `add` text field, a checkbox per item, and a delete button. Use `StatefulWidget` and `setState` for state; nothing else. Suggested approach:
  - `Todo` value class with `title` and `done` fields
  - `StatefulWidget` with `List<Todo> _items`
  - `TextField` + `ElevatedButton` to add
  - `ListView.builder` rendering `CheckboxListTile` per item
  - Use `const` constructors where possible; mark `key` parameters

### Exercises

1. Build a `StatelessWidget` that displays the current `DateTime.now()` (note: it won't update).
2. Convert it to `StatefulWidget` with a 1-second `Timer` that calls `setState` to refresh.
3. Build a `ListView.builder` of 1000 items and confirm it scrolls smoothly.
4. Use `Row` and `Column` to build a simple login form layout.
5. Add `dispose()` to cancel the timer from exercise 2 and verify no leaks with the Flutter DevTools.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between StatelessWidget and StatefulWidget?
9. A) Stateless can't have children
10. B) Stateless is faster always
11. C) Stateless has no mutable State; StatefulWidget holds State across rebuilds (*)
12. D) They are identical
13. Explanation: StatelessWidget describes UI purely from props; StatefulWidget creates a State object that persists and mutates via setState.
14. Q2: What does `setState(() { ... })` do?
15. A) Replaces the widget tree
16. B) Cancels pending timers
17. C) Reloads the app
18. D) Marks the State dirty and schedules a rebuild (*)
19. Explanation: `setState` marks the State dirty; Flutter schedules a rebuild for the next frame, calling `build` again with the updated fields.
20. Q3: Why use `const` widgets?
21. A) They're canonicalized and skipped during rebuilds (*)
22. B) They render faster at runtime
23. C) They allow mutation
24. D) They auto-dispose
25. Explanation: Two `const Text('hi')` are identical; Flutter skips rebuilding them since they cannot have changed, improving performance.
26. Q4: When does `build` run?
27. A) Only on first insertion
28. B) On insertion, setState, inherited dependency changes, parent rebuilds (*)
29. C) Only on setState
30. D) On a fixed timer
31. Explanation: `build` runs on insertion, when setState is called, when an InheritedWidget dependency changes, or when the parent rebuilds and provides a new widget.
32. Q5: What goes in `dispose()`?
33. A) Setting initial state
34. B) Building the widget tree
35. C) Canceling timers, subscriptions, disposing controllers (*)
36. D) Calling setState
37. Explanation: `dispose` is for cleanup: cancel timers/subscriptions, dispose controllers, close streams — preventing leaks and setState-after-dispose errors.
38. Q6: Why guard `setState` with `if (mounted)`?
39. A) To avoid rebuilding too often
40. B) To skip const widgets
41. C) To improve performance
42. D) After an async gap, the widget may be disposed — setState then throws (*)
43. Explanation: After `await`, the widget may have been removed from the tree; calling setState on a disposed State throws. `if (mounted)` guards against it.
44. Q7: Which widget builds lazily for long lists?
45. A) ListView.builder (*)
46. B) Column
47. C) ListView (non-builder)
48. D) Stack
49. Explanation: `ListView.builder` only builds items visible on screen, enabling smooth scrolling of thousands of items; plain `ListView` builds all children up front.
50. Q8: What's the role of the element tree?
51. A) It's a backup of the widget tree
52. B) It holds the actual mutable state and diffs widgets (*)
53. C) It's the JSON representation
54. D) It's the native rendering layer
55. Explanation: Widgets are immutable descriptions; elements are the long-lived counterparts that hold state and diff new widgets against old, deciding what to update.
56. Q9: What's wrong with putting business logic in `build`?
57. A) Nothing
58. B) Build can't call functions
59. C) `build` runs on every rebuild; expensive work blocks the UI (*)
60. D) Build is private
61. Explanation: `build` runs frequently; expensive computation there causes jank. Move logic to initState, event handlers, or a separate class.
62. Q10: Which lifecycle method runs once before build?
63. A) build
64. B) dispose
65. C) setState
66. D) initState (*)
67. Explanation: `initState` runs once when the State is inserted into the tree, before the first build; it's where you initialize controllers, start timers, etc.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between StatelessWidget and StatefulWidget?
  options:
    - Stateless can't have children
    - Stateless is faster always
    - Stateless has no mutable State; StatefulWidget holds State across rebuilds
    - They are identical
  correctIndex: 2
  explanation: StatelessWidget describes UI purely from props; StatefulWidget creates a State object that persists and mutates via setState.
- id: q2
  question: What does `setState(() { ... })` do?
  options:
    - Replaces the widget tree
    - Cancels pending timers
    - Reloads the app
    - Marks the State dirty and schedules a rebuild
  correctIndex: 3
  explanation: "`setState` marks the State dirty; Flutter schedules a rebuild for the next frame, calling `build` again with the updated fields."
- id: q3
  question: Why use `const` widgets?
  options:
    - They're canonicalized and skipped during rebuilds
    - They render faster at runtime
    - They allow mutation
    - They auto-dispose
  correctIndex: 0
  explanation: Two `const Text('hi')` are identical; Flutter skips rebuilding them since they cannot have changed, improving performance.
- id: q4
  question: When does `build` run?
  options:
    - Only on first insertion
    - On insertion, setState, inherited dependency changes, parent rebuilds
    - Only on setState
    - On a fixed timer
  correctIndex: 1
  explanation: "`build` runs on insertion, when setState is called, when an InheritedWidget dependency changes, or when the parent rebuilds and provides a new widget."
- id: q5
  question: What goes in `dispose()`?
  options:
    - Setting initial state
    - Building the widget tree
    - Canceling timers, subscriptions, disposing controllers
    - Calling setState
  correctIndex: 2
  explanation: "`dispose` is for cleanup: cancel timers/subscriptions, dispose controllers, close streams — preventing leaks and setState-after-dispose errors."
- id: q6
  question: Why guard `setState` with `if (mounted)`?
  options:
    - To avoid rebuilding too often
    - To skip const widgets
    - To improve performance
    - After an async gap, the widget may be disposed — setState then throws
  correctIndex: 3
  explanation: After `await`, the widget may have been removed from the tree; calling setState on a disposed State throws. `if (mounted)` guards against it.
- id: q7
  question: Which widget builds lazily for long lists?
  options:
    - ListView.builder
    - Column
    - ListView (non-builder)
    - Stack
  correctIndex: 0
  explanation: "`ListView.builder` only builds items visible on screen, enabling smooth scrolling of thousands of items; plain `ListView` builds all children up front."
- id: q8
  question: What's the role of the element tree?
  options:
    - It's a backup of the widget tree
    - It holds the actual mutable state and diffs widgets
    - It's the JSON representation
    - It's the native rendering layer
  correctIndex: 1
  explanation: Widgets are immutable descriptions; elements are the long-lived counterparts that hold state and diff new widgets against old, deciding what to update.
- id: q9
  question: What's wrong with putting business logic in `build`?
  options:
    - Nothing
    - Build can't call functions
    - "`build` runs on every rebuild; expensive work blocks the UI"
    - Build is private
  correctIndex: 2
  explanation: "`build` runs frequently; expensive computation there causes jank. Move logic to initState, event handlers, or a separate class."
- id: q10
  question: Which lifecycle method runs once before build?
  options:
    - build
    - dispose
    - setState
    - initState
  correctIndex: 3
  explanation: "`initState` runs once when the State is inserted into the tree, before the first build; it's where you initialize controllers, start timers, etc."
```

