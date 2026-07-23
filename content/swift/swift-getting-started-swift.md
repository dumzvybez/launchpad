---
slug: swift-getting-started-swift
id: swift-01
track: swift
order: 1
title: Getting Started with Swift
description: Install Swift, run your first program with the Swift REPL and `swift run`, and understand the compile-and-execute model.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0
whyItMatters: Install Swift, run your first program with the Swift REPL and `swift run`, and understand the compile-and-execute model.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Getting Started with Swift

## Getting Started with Swift

### Why It Matters

Install Swift, run your first program with the Swift REPL and `swift run`, and understand the compile-and-execute model.

Install Swift, run your first program with the Swift REPL and `swift run`, and understand the compile-and-execute model.

### Prerequisites

- None — this is the entry point for the Swift track.
- A macOS, Linux, or Windows machine with Swift 5.10+ installed (Xcode on macOS; swift.org toolchain elsewhere).
- Basic terminal literacy (running commands, editing text files).

### Topics

- Installing Swift via Xcode (macOS) or swift.org (Linux/Windows)
- The `swift` REPL and `swiftc` compiler
- Swift Package Manager: `swift package init`, `swift run`, `swift build`
- Project layout: `Sources/`, `Tests/`, `Package.swift`
- Comments: `//`, `/* */`, and `///` documentation comments
- `print`, string interpolation with `\(...)`
- Semicolon inference and why Swift mostly doesn't need them
- Playgrounds vs command-line vs Xcode projects

### Key Concepts

- Swift compiles to native machine code via LLVM — no VM, no GC, ARC-managed memory.
- `Package.swift` is the manifest; `swift run <target>` executes the named executable.
- Everything has a type; the compiler infers it when you omit annotations (`let x = 42` → `Int`).
- Swift is type-safe: you cannot implicitly convert between `Int` and `Double` or `String` and `Int`.
- Documentation comments (`///`) power Xcode's Quick Help and DocC.

```swift
print("Hello, World!")
// String interpolation
let name = "Ada"
print("Hello, \(name)!")
```
Caption: Hello World

### Common Pitfalls

- Trying to use `python3 hello.swift` semantics — Swift is compiled; run with `swift hello.swift` (script mode), `swift run` (SPM), or build in Xcode.
- Installing Swift via `apt install swift` — Debian/Ubuntu's packaged Swift is years behind; install from swift.org or use swiftenv.
- Confusing `//` and `///` — `///` is a documentation comment that feeds DocC and Quick Help; `//` is ignored entirely.
- Using `print` for logging in production code — use `os.Logger` (iOS 14+) for structured, filterable logs that don't ship debug noise to users.
- Forgetting `import Foundation` when you need `Date`, `URL`, `Data`, etc. — the Swift standard library is tiny; Foundation provides the rest.

### Real-World Applications

- Apple ships Swift as the implementation language for many first-party frameworks including SwiftUI, the new Foundation, and substantial parts of the Swift compiler itself.
- LinkedIn rewrote large portions of its iOS app in Swift starting in 2017, citing a measurable reduction in crashes versus the legacy Objective-C codebase.
- Lyft's Rider app is almost entirely Swift; their engineering blog describes migrating from Objective-C to improve build times and developer velocity.
- Airbnb open-sourced its Swift style guide and `Epoxy` SwiftUI-style DSL, used in production across the Airbnb iOS app.

### Interview Questions

- 1. Who created Swift and when was 1.0 released? — Chris Lattner led the project at Apple; Swift 1.0 shipped in September 2014.
- 2. What memory management model does Swift use? — Automatic Reference Counting (ARC), not tracing garbage collection.
- 3. What is the Swift Package Manager and why prefer it over CocoaPods for new projects? — SPM is Apple-blessed, source-controlled via `Package.swift`, and integrates natively with Xcode; CocoaPods adds an external dependency and central `Podfile.lock`.
- 4. What's the difference between `swift` and `swiftc`? — `swift` is the REPL/interpreter driver; `swiftc` is the actual compiler frontend.
- 5. Why is Swift called "type-safe"? — It forbids implicit type coercion (e.g. `Int` → `Double`) and forces explicit handling of optionals, eliminating whole classes of runtime errors.

### Mini Project

Build a Greeting Generator CLI: A Swift command-line tool that reads a name from `CommandLine.arguments` and prints a time-aware greeting. Suggested approach:
  - Use `swift package init --type executable` to scaffold
  - Read `CommandLine.arguments` (element 0 is the executable path)
  - Use `Date()` and `Calendar.current.component(.hour, from:)` to pick "morning"/"afternoon"/"evening"
  - Print with string interpolation
  - Handle the missing-name case with a friendly default

### Exercises

1. Install Swift 5.10+ and run `swift --version` to confirm.
2. Open the REPL (`swift` with no args) and use it as a calculator: compute `17 * 23`, `2 << 10`, and `100.0 / 7.0`.
3. Create `greet.swift` that prints your name and the current hour using `Date()` and `Calendar`.
4. Add a `///` doc comment above a function and run `swift package generate-documentation` to see the rendered docs.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Who created Swift?
8. A) Chris Lattner at Apple (*)
9. B) Bjarne Stroustrup
10. C) Guido van Rossum
11. D) Anders Hejlsberg
12. Explanation: Chris Lattner led Swift's design at Apple starting in 2010; 1.0 shipped with Xcode 6 in September 2014.
13. Q2: What memory management model does Swift use?
14. A) Tracing garbage collection
15. B) Automatic Reference Counting (ARC) (*)
16. C) Manual malloc/free
17. D) Reference counting with a stop-the-world collector
18. Explanation: Swift uses ARC, which inserts retain/release calls at compile time; there is no background GC thread.
19. Q3: Which command initializes a new Swift executable package?
20. A) `swift init --exe`
21. B) `xcode new`
22. C) `swift package init --type executable` (*)
23. D) `cargo new`
24. Explanation: `swift package init --type executable` scaffolds an executable target with `Sources/main.swift` and a `Package.swift`.
25. Q4: What does `print("Hello, \(name)!")` do?
26. A) Concatenates with `+`
27. B) Calls `name.description`
28. C) Throws if `name` is empty
29. D) Performs string interpolation (*)
30. Explanation: `\(expr)` interpolates any `String`-convertible expression into the string literal at compile time.
31. Q5: Which is a documentation comment in Swift?
32. A) `///` (*)
33. B) `//`
34. C) `/* */`
35. D) `#!`
36. Explanation: `///` is a documentation comment processed by DocC and shown in Xcode Quick Help; `//` is a plain comment.
37. Q6: What is `Foundation` in Swift?
38. A) The Swift standard library
39. B) A framework providing `Date`, `URL`, `Data`, `JSONDecoder`, etc. (*)
40. C) The iOS UI framework
41. D) A testing framework
42. Explanation: Foundation provides essential types like `Date`, `URL`, `Data`, and codable infrastructure; it sits above the Swift standard library.
43. Q7: Why does Swift forbid implicit `Int`-to-`Double` conversion?
44. A) Performance
45. B) Legacy reasons from Objective-C
46. C) Type safety — explicit conversions prevent silent lossy casts (*)
47. D) It doesn't — `Int` coerces to `Double` automatically
48. Explanation: Swift requires `Double(intValue)` explicitly to make lossy or surprising conversions visible at the call site.
49. Q8: Which file is the manifest for a Swift package?
50. A) `Cargo.toml`
51. B) `package.json`
52. C) `Podfile`
53. D) `Package.swift` (*)
54. Explanation: `Package.swift` declares targets, products, and dependencies using the `PackageDescription` module.
55. Q9: What does `swift run` do?
56. A) Builds the package and executes the main executable target (*)
57. B) Compiles only
58. C) Starts a REPL
59. D) Generates an Xcode project
60. Explanation: `swift run` builds incrementally then runs the named executable target (or the only one if unspecified).
61. Q10: Which tool produces API docs from `///` comments?
62. A) `swift-doc`
63. B) `swift package generate-documentation` (DocC) (*)
64. C) `jazzy`
65. D) `doxygen`
66. Explanation: DocC (`swift package generate-documentation`) is Apple's modern documentation compiler that consumes `///` comments and produces hosted docs.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Swift?
  options:
    - Chris Lattner at Apple
    - Bjarne Stroustrup
    - Guido van Rossum
    - Anders Hejlsberg
  correctIndex: 0
  explanation: Chris Lattner led Swift's design at Apple starting in 2010; 1.0 shipped with Xcode 6 in September 2014.
- id: q2
  question: What memory management model does Swift use?
  options:
    - Tracing garbage collection
    - Automatic Reference Counting (ARC)
    - Manual malloc/free
    - Reference counting with a stop-the-world collector
  correctIndex: 1
  explanation: Swift uses ARC, which inserts retain/release calls at compile time; there is no background GC thread.
- id: q3
  question: Which command initializes a new Swift executable package?
  options:
    - "`swift init --exe`"
    - "`xcode new`"
    - "`swift package init --type executable`"
    - "`cargo new`"
  correctIndex: 2
  explanation: "`swift package init --type executable` scaffolds an executable target with `Sources/main.swift` and a `Package.swift`."
- id: q4
  question: What does `print("Hello, \(name)!")` do?
  options:
    - Concatenates with `+`
    - Calls `name.description`
    - Throws if `name` is empty
    - Performs string interpolation
  correctIndex: 3
  explanation: "`\\(expr)` interpolates any `String`-convertible expression into the string literal at compile time."
- id: q5
  question: Which is a documentation comment in Swift?
  options:
    - "`///`"
    - "`//`"
    - "`/* */`"
    - "`#!`"
  correctIndex: 0
  explanation: "`///` is a documentation comment processed by DocC and shown in Xcode Quick Help; `//` is a plain comment."
- id: q6
  question: What is `Foundation` in Swift?
  options:
    - The Swift standard library
    - A framework providing `Date`, `URL`, `Data`, `JSONDecoder`, etc.
    - The iOS UI framework
    - A testing framework
  correctIndex: 1
  explanation: Foundation provides essential types like `Date`, `URL`, `Data`, and codable infrastructure; it sits above the Swift standard library.
- id: q7
  question: Why does Swift forbid implicit `Int`-to-`Double` conversion?
  options:
    - Performance
    - Legacy reasons from Objective-C
    - Type safety — explicit conversions prevent silent lossy casts
    - It doesn't — `Int` coerces to `Double` automatically
  correctIndex: 2
  explanation: Swift requires `Double(intValue)` explicitly to make lossy or surprising conversions visible at the call site.
- id: q8
  question: Which file is the manifest for a Swift package?
  options:
    - "`Cargo.toml`"
    - "`package.json`"
    - "`Podfile`"
    - "`Package.swift`"
  correctIndex: 3
  explanation: "`Package.swift` declares targets, products, and dependencies using the `PackageDescription` module."
- id: q9
  question: What does `swift run` do?
  options:
    - Builds the package and executes the main executable target
    - Compiles only
    - Starts a REPL
    - Generates an Xcode project
  correctIndex: 0
  explanation: "`swift run` builds incrementally then runs the named executable target (or the only one if unspecified)."
- id: q10
  question: Which tool produces API docs from `///` comments?
  options:
    - "`swift-doc`"
    - "`swift package generate-documentation` (DocC)"
    - "`jazzy`"
    - "`doxygen`"
  correctIndex: 1
  explanation: DocC (`swift package generate-documentation`) is Apple's modern documentation compiler that consumes `///` comments and produces hosted docs.
```

