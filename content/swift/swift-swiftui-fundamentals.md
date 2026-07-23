---
slug: swift-swiftui-fundamentals
id: swift-18
track: swift
order: 18
title: SwiftUI Fundamentals
description: Build declarative UIs with SwiftUI — views, modifiers, navigation, lists, forms, and state management with `@State`, `@Binding`, `@StateObject`, and `@EnvironmentObject`.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=1020s
whyItMatters: Build declarative UIs with SwiftUI — views, modifiers, navigation, lists, forms, and state management with `@State`, `@Binding`, `@StateObject`, and `@EnvironmentObject`.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# SwiftUI Fundamentals

## SwiftUI Fundamentals

### Why It Matters

Build declarative UIs with SwiftUI — views, modifiers, navigation, lists, forms, and state management with `@State`, `@Binding`, `@StateObject`, and `@EnvironmentObject`.

Build declarative UIs with SwiftUI — views, modifiers, navigation, lists, forms, and state management with `@State`, `@Binding`, `@StateObject`, and `@EnvironmentObject`.

### Prerequisites

- Stage 8: Structs and Classes (value types, View structs)
- Stage 12: Protocols (View, some View)
- Stage 9: Properties (property wrappers)

### Topics

- `View` protocol and `var body: some View`
- `some View` opaque return types
- View modifiers (`.padding`, `.background`, `.frame`)
- Stacks: `VStack`, `HStack`, `ZStack`
- `List`, `ForEach`, `Section`
- `NavigationStack` and `NavigationLink`
- `Form` for settings-style UIs
- `@State`, `@Binding`, `@StateObject`, `@ObservedObject`, `@EnvironmentObject`
- `Button`, `TextField`, `Toggle`, `Slider`
- Previews (`#Preview` macro, Swift 5.9+)

### Key Concepts

- SwiftUI views are structs that describe their state-derived appearance; the framework diffs and renders.
- `@State` is for value-typed local UI state; `@StateObject` for reference-typed view models owned by this view.
- `@Binding` is a borrowed reference to a parent's `@State`; child writes propagate up.
- `@ObservedObject` is for externally-owned observable objects (don't own them in this view, or resets on re-init).
- The `body` is recomputed whenever observed state changes; keep it pure and side-effect-free.

```swift
import SwiftUI

struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.title)
            Button("Increment") { count += 1 }
                .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

#Preview {
    CounterView()
}
```
Caption: Basic view with @State

### Common Pitfalls

- Using `@ObservedObject` for a view-model you create locally — `@ObservedObject` doesn't own the object; on re-init, the object is reset. Use `@StateObject` for objects created in this view.
- Doing heavy work in `body` — `body` is called on every state change; if it parses JSON or builds a large image, the UI stalls. Compute once and cache.
- Forgetting `Identifiable` on `ForEach` items — the compiler demands an `id` or `Identifiable` conformance; missing it produces a confusing error.
- Mutating `@State` from outside `body` (e.g., in `init`) — `@State`'s storage isn't ready in `init`; use `@State`'s `init(wrappedValue:)` or `.onAppear`.
- Holding strong references to views in long-lived closures — views are recreated frequently; capture `self` (the view model) instead, or use `[weak self]`.

### Real-World Applications

- Apple rewrote many first-party iOS apps (Weather, Wallet, Maps portions) in SwiftUI for iOS 16+.
- LinkedIn uses SwiftUI for new screens in its iOS app, citing faster iteration and consistent animations.
- Airbnb's SwiftUI adoption is selective (mostly new screens) due to performance constraints in its huge legacy app.
- Things 3's sister app, Things 3 for Apple Watch, is implemented entirely in SwiftUI.

### Interview Questions

- 1. What's the difference between `@State`, `@StateObject`, and `@ObservedObject`? — `@State` is value-typed local UI state; `@StateObject` owns a reference-typed observable; `@ObservedObject` observes one it doesn't own (passed in).
- 2. Why are SwiftUI views structs? — Value types enable cheap diffing and prevent accidental shared state; the framework recreates views freely.
- 3. When does `body` recompute? — Whenever observed state (`@State`, `@Published`, `@ObservedObject`) changes; the diff engine compares old vs new and updates the render tree.
- 4. What does `@Binding` do? — It's a borrowed reference to a parent's `@State`, letting children read and write without owning.
- 5. What's the rule for `Identifiable` in `ForEach`? — Elements must be `Identifiable` (or you provide `id: \KeyPath`); the `id` must be stable across updates so the diff engine can track rows.

### Mini Project

Build a Tip Calculator: A SwiftUI screen with a bill amount `TextField`, a tip percentage `Slider` (0-30%), and a computed total. Use `@State` and `@Binding` for a reusable `LabeledRow` view. Suggested approach:
  - `struct ContentView: View { @State private var amount: String = ""; @State private var tipPct: Double = 15 }`
  - Compute `total` as a computed property
  - Build a child `LabeledRow(title:value:)` with `@Binding var value` for the slider
  - Format the total with `NumberFormatter`
  - Add `#Preview` for both states (empty and populated)

### Exercises

1. Build `CounterView` with `@State` and a button to increment.
2. Create a `StepperView` taking `@Binding var value: Int` and embed it in a parent.
3. Build `TaskListView` with `@StateObject` and a `List` of items, with add/delete.
4. Add a `NavigationStack` with a `NavigationLink` to a detail view.
5. Add `#Preview` for your view in light and dark mode using `.environment(\.colorScheme, .dark)`.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which property wrapper is used for value-typed local UI state owned by a view?
9. A) @ObservedObject
10. B) @State (*)
11. C) @Binding
12. D) @EnvironmentObject
13. Explanation: `@State` wraps a value type (Int, String, struct) for local UI state; SwiftUI manages its storage across re-inits.
14. Q2: Which wrapper should you use for a reference-typed view model created in this view?
15. A) @ObservedObject
16. B) @Binding
17. C) @StateObject (*)
18. D) @State
19. Explanation: `@StateObject` owns the object — it's created once and persists across view re-inits. `@ObservedObject` would reset it on re-init.
20. Q3: What does `@Binding` represent?
21. A) A copy of a parent's state
22. B) An environment value
23. C) A published property
24. D) A borrowed reference to a parent's `@State`, allowing writes to propagate up (*)
25. Explanation: `@Binding var value: T` lets a child read/write a parent-owned `@State` via `$state` passed in.
26. Q4: Why are SwiftUI views structs?
27. A) Value semantics enable cheap diffing and prevent shared-state bugs (*)
28. B) Performance
29. C) Required by Combine
30. D) Required by UIKit
31. Explanation: Structs are value types — the framework can recreate and diff them safely, with no shared mutable state between renders.
32. Q5: When does `body` recompute?
33. A) Every frame
34. B) When observed state changes (`@State`, `@Published`, `@ObservedObject`) (*)
35. C) On a timer
36. D) Never
37. Explanation: SwiftUI tracks observed state and recomputes `body` only when relevant state changes, then diffs the new tree against the old.
38. Q6: What must `ForEach` elements provide?
39. A) A `description`
40. B) A `hashValue`
41. C) An `id` — via `Identifiable` conformance or explicit `id: \KeyPath` (*)
42. D) A `rawValue`
43. Explanation: SwiftUI needs stable identifiers to track rows across updates; either conform to `Identifiable` or pass `id:` explicitly.
44. Q7: What's the danger of heavy work in `body`?
45. A) Compile error
46. B) Memory leak
47. C) Nothing
48. D) UI stalls because `body` runs on every state change (*)
49. Explanation: `body` runs whenever observed state changes; doing JSON parsing or image decoding there blocks the main thread.
50. Q8: Why shouldn't you use `@ObservedObject` for a view model you create locally?
51. A) The object isn't owned; on view re-init the object is reset to its initial state (*)
52. B) Compile error
53. C) It's deprecated
54. D) Performance
55. Explanation: `@ObservedObject` doesn't manage the object's lifetime; if the view re-inits, a new instance replaces the old. Use `@StateObject` for ownership.
56. Q9: What's the role of `#Preview` (Swift 5.9+)?
57. A) A networking macro
58. B) Defines a SwiftUI preview rendered in Xcode's canvas (*)
59. C) An async helper
60. D) A test macro
61. Explanation: `#Preview { MyView() }` registers a preview that Xcode renders live in the canvas alongside your code.
62. Q10: What does `.environment(\.colorScheme, .dark)` do?
63. A) Forces dark mode globally
64. B) A Combine operator
65. C) Sets the color scheme for the modified view subtree (useful in previews) (*)
66. D) An actor hop
67. Explanation: Environment values flow down the view tree; setting `colorScheme` is a common way to preview both light and dark variants in Xcode.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which property wrapper is used for value-typed local UI state owned by a view?
  options:
    - "@ObservedObject"
    - "@State"
    - "@Binding"
    - "@EnvironmentObject"
  correctIndex: 1
  explanation: "`@State` wraps a value type (Int, String, struct) for local UI state; SwiftUI manages its storage across re-inits."
- id: q2
  question: Which wrapper should you use for a reference-typed view model created in this view?
  options:
    - "@ObservedObject"
    - "@Binding"
    - "@StateObject"
    - "@State"
  correctIndex: 2
  explanation: "`@StateObject` owns the object — it's created once and persists across view re-inits. `@ObservedObject` would reset it on re-init."
- id: q3
  question: What does `@Binding` represent?
  options:
    - A copy of a parent's state
    - An environment value
    - A published property
    - A borrowed reference to a parent's `@State`, allowing writes to propagate up
  correctIndex: 3
  explanation: "`@Binding var value: T` lets a child read/write a parent-owned `@State` via `$state` passed in."
- id: q4
  question: Why are SwiftUI views structs?
  options:
    - Value semantics enable cheap diffing and prevent shared-state bugs
    - Performance
    - Required by Combine
    - Required by UIKit
  correctIndex: 0
  explanation: Structs are value types — the framework can recreate and diff them safely, with no shared mutable state between renders.
- id: q5
  question: When does `body` recompute?
  options:
    - Every frame
    - When observed state changes (`@State`, `@Published`, `@ObservedObject`)
    - On a timer
    - Never
  correctIndex: 1
  explanation: SwiftUI tracks observed state and recomputes `body` only when relevant state changes, then diffs the new tree against the old.
- id: q6
  question: What must `ForEach` elements provide?
  options:
    - A `description`
    - A `hashValue`
    - "An `id` — via `Identifiable` conformance or explicit `id: \\KeyPath`"
    - A `rawValue`
  correctIndex: 2
  explanation: SwiftUI needs stable identifiers to track rows across updates; either conform to `Identifiable` or pass `id:` explicitly.
- id: q7
  question: What's the danger of heavy work in `body`?
  options:
    - Compile error
    - Memory leak
    - Nothing
    - UI stalls because `body` runs on every state change
  correctIndex: 3
  explanation: "`body` runs whenever observed state changes; doing JSON parsing or image decoding there blocks the main thread."
- id: q8
  question: Why shouldn't you use `@ObservedObject` for a view model you create locally?
  options:
    - The object isn't owned; on view re-init the object is reset to its initial state
    - Compile error
    - It's deprecated
    - Performance
  correctIndex: 0
  explanation: "`@ObservedObject` doesn't manage the object's lifetime; if the view re-inits, a new instance replaces the old. Use `@StateObject` for ownership."
- id: q9
  question: What's the role of `#Preview` (Swift 5.9+)?
  options:
    - A networking macro
    - Defines a SwiftUI preview rendered in Xcode's canvas
    - An async helper
    - A test macro
  correctIndex: 1
  explanation: "`#Preview { MyView() }` registers a preview that Xcode renders live in the canvas alongside your code."
- id: q10
  question: What does `.environment(\.colorScheme, .dark)` do?
  options:
    - Forces dark mode globally
    - A Combine operator
    - Sets the color scheme for the modified view subtree (useful in previews)
    - An actor hop
  correctIndex: 2
  explanation: Environment values flow down the view tree; setting `colorScheme` is a common way to preview both light and dark variants in Xcode.
```

