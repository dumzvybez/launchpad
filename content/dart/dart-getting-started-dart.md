---
slug: dart-getting-started-dart
id: dart-01
track: dart
order: 1
title: Getting Started with Dart
description: Install the Dart SDK, write and run your first program, and learn how `dart` and `dart run` work for CLI scripts and projects.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w
whyItMatters: Install the Dart SDK, write and run your first program, and learn how `dart` and `dart run` work for CLI scripts and projects.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Getting Started with Dart

## Getting Started with Dart

### Why It Matters

Install the Dart SDK, write and run your first program, and learn how `dart` and `dart run` work for CLI scripts and projects.

Install the Dart SDK, write and run your first program, and learn how `dart` and `dart run` work for CLI scripts and projects.

### Prerequisites

- None — this is the entry point for the Dart track.
- Basic terminal comfort (running commands, editing text files).
- An editor with Dart/Flutter extension installed (VS Code or IntelliJ/Android Studio).

### Topics

- Installing the Dart SDK on Windows/macOS/Linux
- Verifying with `dart --version`
- Creating a project with `dart create` (console-simple, console-full, package)
- Running scripts: `dart run` vs `dart file.dart`
- The `pubspec.yaml` file and pub.dev ecosystem
- `dart format`, `dart analyze`, `dart test` overview
- AOT vs JIT compilation in Dart (and the VM)
- Choosing an editor and the Dart extension

### Key Concepts

- Dart is a strongly-typed, garbage-collected, object-oriented language with sound null safety.
- AOT compilation gives fast startup; JIT (via the VM) gives hot reload during development.
- Everything you can put in a variable is an object, including numbers, functions, and null (of type Null).
- `main()` is the entry point; every executable Dart program begins there.
- The pubspec.yaml declares dependencies and project metadata.
- Dart uses semicolons to terminate statements and braces {} for blocks (like C, Java, JS).

```dart
// hello.dart
void main() {
  print('Hello, Dart!');
}
// Run:  dart run hello.dart
// Or:   dart hello.dart
```
Caption: Hello World

### Common Pitfalls

- Using an old SDK that doesn't support sound null safety — require `sdk: '>=3.0.0 <4.0.0'` in pubspec.yaml so `dart pub get` fails loudly on stale toolchains.
- Editing files in `bin/` while `dart run` defaults to `bin/<project>.dart` — if you rename or remove the entry file you get a confusing "Target of URI doesn't exist" error; either update `bin/<name>.dart` or run `dart run path/to/file.dart`.
- Mixing tabs and spaces — `dart format` will rewrite your files, so commit clean formatting once and let the formatter own it.
- Treating DartPad as a full environment — DartPad cannot run `dart pub get`, file I/O, or packages beyond a small allowlist; use a local SDK for anything non-trivial.

### Real-World Applications

- Google Ads uses Dart internally for tooling around its billing and ad campaign pipelines.
- The Flutter framework itself is written in Dart; Google ships the Flutter SDK with Dart baked in.
- Reflectly, a journaling app with millions of downloads, is built end-to-end in Dart and Flutter.
- BMW's My BMW app uses Dart/Flutter for its cross-platform mobile experience across iOS and Android.

### Interview Questions

- 1. What are the AOT and JIT compilation modes in Dart, and when is each used? — JIT powers development hot reload via the VM; AOT is used for release builds for fast startup and predictable performance.
- 2. Why does Dart require a `main()` function? — `main` is the agreed entry point the runtime looks for; without it the VM has nowhere to begin execution.
- 3. What is the role of pubspec.yaml? — It declares project name, version, SDK constraints, dependencies, and dev_dependencies, and is the contract `dart pub get` uses to resolve packages.
- 4. Name three dart tool subcommands. — `dart run`, `dart analyze`, `dart test`, `dart format`, `dart compile`, `dart pub` are all valid answers.
- 5. How does Dart's type system differ from JavaScript's? — Dart is statically typed with sound null safety; JS is dynamically typed and `null`/`undefined` are unchecked at compile time.

### Mini Project

Build a Greeting CLI: A console app that reads a name from command-line arguments and prints a personalized greeting. If no name is given it greets the world. Suggested approach:
  - Read `List<String> arguments` from `main(List<String> args)`
  - Default the name to "World" when `args.isEmpty`
  - Use string interpolation: `print('Hello, $name!')`
  - Add a `--shout` flag check that uppercases the output
  - Add a doc comment above main describing the program

### Exercises

1. Install the Dart SDK and run `dart --version`. Confirm it prints 3.0 or higher.
2. Run `dart create -t console-simple hello_cli`, then modify `bin/hello_cli.dart` to print your name and current date using `DateTime.now()`.
3. Run `dart analyze` on your project and fix any warnings reported.
4. Run `dart format` and inspect the diff (or use `git diff` if you init a repo).
5. Add a top-of-file doc comment `///` describing your CLI, then run `dart doc --dry-run` to verify it parses.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which company created and maintains Dart?
9. A) Google (*)
10. B) Microsoft
11. C) Apple
12. D) Mozilla
13. Explanation: Dart was created at Google by Lars Bak and Kasper Lund; the first stable release shipped in 2013.
14. Q2: What is the entry point of a Dart program?
15. A) start()
16. B) main() (*)
17. C) init()
18. D) run()
19. Explanation: Dart looks for a top-level `main()` function (optionally with `List<String> args`) as the program entry point.
20. Q3: Which command creates a new Dart console project?
21. A) dart new console
22. B) dart init my_app
23. C) dart create -t console-simple my_app (*)
24. D) flutter create my_app
25. Explanation: `dart create -t console-simple <name>` scaffolds a minimal console project; `-t console-full` adds tests and sample code.
26. Q4: What does `dart analyze` do?
27. A) Compiles the program to native code
28. B) Publishes the package to pub.dev
29. C) Profiles runtime memory usage
30. D) Runs static analysis and reports lints/type issues (*)
31. Explanation: `dart analyze` runs the Dart analyzer to surface type errors, lint violations, and unreachable code without executing the program.
32. Q5: Which file declares dependencies and SDK constraints?
33. A) pubspec.yaml (*)
34. B) package.json
35. C) requirements.txt
36. D) Cargo.toml
37. Explanation: pubspec.yaml is Dart's project manifest — name, version, environment, dependencies, dev_dependencies, and assets.
38. Q6: Dart's sound null safety was enabled by default starting in which version?
39. A) Dart 1.x
40. B) Dart 2.12 (*)
41. C) Dart 2.0
42. D) Dart 3.0
43. Explanation: Dart 2.12 (March 2021) introduced sound null safety; Dart 3.0 made it mandatory by dropping unsound modes.
44. Q7: Which command runs the executable defined in bin/ of a Dart project?
45. A) dart execute
46. B) dart start
47. C) dart run (*)
48. D) dart launch
49. Explanation: `dart run` (with no path) executes the project's default entry point under bin/; you can also pass `dart run path/to/file.dart`.
50. Q8: Which compilation mode provides hot reload during development?
51. A) AOT
52. B) Snapshot only
53. C) dart2js release
54. D) JIT (*)
55. Explanation: The Dart VM runs in JIT mode during development, enabling fast incremental recompilation and hot reload (especially via Flutter).
56. Q9: Which is a valid Dart Hello World?
57. A) print('Hello, World!') (*)
58. B) console.log("Hello, World!")
59. C) echo "Hello, World!"
60. D) println("Hello, World!")
61. Explanation: Dart's `print(...)` writes to stdout with a trailing newline; string literals may use single or double quotes.
62. Q10: Which environment key in pubspec.yaml controls the SDK version?
63. A) dart_sdk
64. B) environment:  sdk: '>=3.0.0 <4.0.0' (*)
65. C) sdk_version
66. D) toolchain
67. Explanation: The `environment.sdk` constraint tells `dart pub get` which SDK range is acceptable; mismatch fails resolution.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which company created and maintains Dart?
  options:
    - Google
    - Microsoft
    - Apple
    - Mozilla
  correctIndex: 0
  explanation: Dart was created at Google by Lars Bak and Kasper Lund; the first stable release shipped in 2013.
- id: q2
  question: What is the entry point of a Dart program?
  options:
    - start()
    - main()
    - init()
    - run()
  correctIndex: 1
  explanation: Dart looks for a top-level `main()` function (optionally with `List<String> args`) as the program entry point.
- id: q3
  question: Which command creates a new Dart console project?
  options:
    - dart new console
    - dart init my_app
    - dart create -t console-simple my_app
    - flutter create my_app
  correctIndex: 2
  explanation: "`dart create -t console-simple <name>` scaffolds a minimal console project; `-t console-full` adds tests and sample code."
- id: q4
  question: What does `dart analyze` do?
  options:
    - Compiles the program to native code
    - Publishes the package to pub.dev
    - Profiles runtime memory usage
    - Runs static analysis and reports lints/type issues
  correctIndex: 3
  explanation: "`dart analyze` runs the Dart analyzer to surface type errors, lint violations, and unreachable code without executing the program."
- id: q5
  question: Which file declares dependencies and SDK constraints?
  options:
    - pubspec.yaml
    - package.json
    - requirements.txt
    - Cargo.toml
  correctIndex: 0
  explanation: pubspec.yaml is Dart's project manifest — name, version, environment, dependencies, dev_dependencies, and assets.
- id: q6
  question: Dart's sound null safety was enabled by default starting in which version?
  options:
    - Dart 1.x
    - Dart 2.12
    - Dart 2.0
    - Dart 3.0
  correctIndex: 1
  explanation: Dart 2.12 (March 2021) introduced sound null safety; Dart 3.0 made it mandatory by dropping unsound modes.
- id: q7
  question: Which command runs the executable defined in bin/ of a Dart project?
  options:
    - dart execute
    - dart start
    - dart run
    - dart launch
  correctIndex: 2
  explanation: "`dart run` (with no path) executes the project's default entry point under bin/; you can also pass `dart run path/to/file.dart`."
- id: q8
  question: Which compilation mode provides hot reload during development?
  options:
    - AOT
    - Snapshot only
    - dart2js release
    - JIT
  correctIndex: 3
  explanation: The Dart VM runs in JIT mode during development, enabling fast incremental recompilation and hot reload (especially via Flutter).
- id: q9
  question: Which is a valid Dart Hello World?
  options:
    - print('Hello, World!')
    - console.log("Hello, World!")
    - echo "Hello, World!"
    - println("Hello, World!")
  correctIndex: 0
  explanation: Dart's `print(...)` writes to stdout with a trailing newline; string literals may use single or double quotes.
- id: q10
  question: Which environment key in pubspec.yaml controls the SDK version?
  options:
    - dart_sdk
    - "environment:  sdk: '>=3.0.0 <4.0.0'"
    - sdk_version
    - toolchain
  correctIndex: 1
  explanation: The `environment.sdk` constraint tells `dart pub get` which SDK range is acceptable; mismatch fails resolution.
```

