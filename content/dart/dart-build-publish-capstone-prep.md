---
slug: dart-build-publish-capstone-prep
id: dart-20
track: dart
order: 20
title: Build, Publish, and Capstone Prep
description: Build standalone executables with `dart compile exe`, publish packages to pub.dev, manage versions and changelogs, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=11400s
whyItMatters: Build standalone executables with `dart compile exe`, publish packages to pub. dev, manage versions and changelogs, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Build, Publish, and Capstone Prep

## Build, Publish, and Capstone Prep

### Why It Matters

Build standalone executables with `dart compile exe`, publish packages to pub. dev, manage versions and changelogs, and prepare for the capstone project.

Build standalone executables with `dart compile exe`, publish packages to pub.dev, manage versions and changelogs, and prepare for the capstone project.

### Prerequisites

- Stage 14: File I/O and Serialization (json_serializable)
- Stage 16: Testing — flutter_test, test package, mocktail
- Stage 17: Dart for the Web (optional, but useful for cross-platform)
- Stage 18: Shelf and Dart Frog (for backend capstones)

### Topics

- `dart compile exe` for self-contained native executables
- `dart compile js` and `dart compile wasm` (recap)
- `dart compile kernel` (snapshots) for fast startup
- Versioning: semver in pubspec.yaml
- `dart pub publish --dry-run` and the publish flow
- Pub.dev verified publishers and reputation
- `CHANGELOG.md`, `README.md`, and example/ for pub
- CI: GitHub Actions for test + publish on tag
- Pre-capstone checklist: scope, file structure, dependencies, testing strategy

### Key Concepts

- `dart compile exe bin/main.dart` produces a native executable that bundles the Dart runtime — no Dart install required on the target machine.
- `dart pub publish` uploads a package to pub.dev; first publish is permanent (the name is taken forever).
- Semantic versioning: MAJOR.MINOR.PATCH; bump MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes.
- A good pub package has: README with examples, CHANGELOG with bullet-point changes per version, an `example/` folder with a working demo, and CI badges.
- `--dry-run` runs validation without uploading: catches missing READMEs, lint issues, and file size problems before they're permanent.
- Pub.dev penalizes packages with low scores (no analysis, no description, no platforms tab); aim for 130/130 pub points before publishing.

```bash
dart compile exe bin/myapp.dart -o myapp
./myapp           # runs on any Linux machine (matching arch) without Dart installed
```
Caption: Build a native exe

### Common Pitfalls

- Publishing without `--dry-run` first — first publishes are permanent; dry-run catches missing READMEs, oversized files, and lint issues.
- Forgetting to bump the version before publishing — pub.dev rejects re-publishing the same version with `Package version already exists`.
- Not updating CHANGELOG.md — pub.dev surfaces this prominently; a missing or stale changelog drops the maintenance score.
- Shipping a binary blob in `lib/` — pub packages should be source-only; large binaries bloat the package and tank the popularity score.
- Publishing a `1.0.0` without thinking through API stability — once you ship `1.0.0`, breaking changes require `2.0.0` and major-version migrations for users; consider `0.x.y` until the API is settled.

### Real-World Applications

- Very Good Ventures publishes dozens of open-source packages on pub.dev (very_good_analysis, very_good_cli) used by Flutter teams worldwide.
- Flutter's own framework and plugins are published on pub.dev with strict CI and high pub points.
- Alibaba's Xianyu shares selected utilities internally via pub.dev private packages.
- eBay Motors publishes a `vehicle_data` package used across multiple internal apps, with CI auto-publishing on tag.

### Interview Questions

- 1. What does `dart compile exe` produce? — A self-contained native executable that bundles the Dart runtime; runs without Dart installed on the target.
- 2. Why publish with `--dry-run` first? — It validates the package (README, lints, file size) without uploading; the first real publish is permanent.
- 3. How does semver apply to pub packages? — MAJOR for breaking changes, MINOR for new features (backward compatible), PATCH for bug fixes.
- 4. What makes a pub package score well? — Strong analysis (no warnings), good description, multiple platforms, an example/, and a CHANGELOG; aim for 130/130 pub points.
- 5. How do you automate publishing? — GitHub Actions on tag push runs `dart pub publish --force` with credentials from secrets; the tag event is the trigger.

### Mini Project

Publish a Tiny Utility Package: Take any small utility you've written (e.g., a `Money` class, a `retry` helper, or a string-title-case extension) and publish it as a pub package. Include README, CHANGELOG, example/, tests, and a CI workflow that publishes on tag. Suggested approach:
  - Restructure the code into a pub package (`dart create -t package my_pkg`)
  - Add `README.md` with install + usage examples and a CI badge
  - Add `CHANGELOG.md` starting at `0.1.0`
  - Move a demo into `example/my_pkg_example.dart`
  - Run `dart pub publish --dry-run` and fix all warnings, then publish

### Exercises

1. Compile a CLI tool to a native exe and run it on a machine without Dart installed.
2. Bump a package from `0.1.0` to `0.2.0` with a CHANGELOG entry; publish with `--dry-run`.
3. Add a GitHub Actions workflow that runs `dart test` on every push.
4. Add `example/` to an existing package and verify the pub score goes up.
5. Set up automated publishing on tag push using `PUB_CREDENTIALS` secret.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `dart compile exe` produce?
9. A) A JS bundle
10. B) A snapshot
11. C) A Wasm module
12. D) A self-contained native executable (*)
13. Explanation: `dart compile exe` produces a native executable that bundles the Dart runtime and AOT-compiled code; it runs on the target OS without Dart installed.
14. Q2: Why run `dart pub publish --dry-run` first?
15. A) To validate the package without uploading (*)
16. B) To make the publish faster
17. C) To get pub points
18. D) It's required by pub.dev
19. Explanation: Dry-run validates README, lints, file size, and package structure without uploading; the first real publish permanently claims the name.
20. Q3: When do you bump the MAJOR version in semver?
21. A) For any new feature
22. B) For breaking changes (*)
23. C) For bug fixes
24. D) Never — only MINOR/PATCH
25. Explanation: MAJOR bumps signal breaking changes that require user migration; MINOR adds backward-compatible features, PATCH fixes bugs.
26. Q4: Which file is prominently surfaced by pub.dev and affects the maintenance score?
27. A) LICENSE
28. B) .gitignore
29. C) CHANGELOG.md (*)
30. D) analysis_options.yaml
31. Explanation: A missing or stale CHANGELOG drops the maintenance score; pub.dev surfaces the latest version's changelog on the package page.
32. Q5: What is the recommended pre-1.0 versioning strategy?
33. A) Start at 1.0.0 immediately
34. B) Never publish below 1.0
35. C) Use only PATCH versions
36. D) Use 0.x.y until the API is settled (*)
37. Explanation: `0.x.y` signals "API may change without a major bump"; this is the convention for settling APIs before promising stability with `1.0.0`.
38. Q6: How do you automate publishing to pub.dev?
39. A) GitHub Actions on tag push running `dart pub publish --force` (*)
40. B) Manually run `dart pub publish` on each release
41. C) Email the pub team
42. D) You can't — publishing is manual
43. Explanation: A GitHub Actions workflow triggers on tag push, runs tests, then publishes with credentials from secrets; this is the canonical CI/CD pattern.
44. Q7: What's the maximum pub points a package can score?
45. A) 100
46. B) 130 (*)
47. C) 110
48. D) 200
49. Explanation: The maximum is 130 pub points, distributed across categories like popularity, popularity, maintenance, analysis, and documentation.
50. Q8: What does the `example/` folder do for a pub package?
51. A) Required for compilation
52. B) Stores test fixtures
53. C) Demonstrates usage and contributes to pub points (*)
54. D) Holds documentation
55. Explanation: An `example/` folder with a runnable demo earns pub points and helps users understand the package at a glance.
56. Q9: What's the issue with shipping a binary blob in `lib/`?
57. A) It's fine
58. B) Compile error
59. C) pub.dev rejects all binaries
60. D) Bloats the package and tanks popularity score (*)
61. Explanation: Pub packages should be source-only; large binaries inflate download size and lower the popularity score; consider hosting binaries separately.
62. Q10: What does `dart compile kernel` produce?
63. A) A kernel snapshot for fast startup (*)
64. B) A native executable
65. C) A JS bundle
66. D) A Wasm module
67. Explanation: Kernel snapshots serialize the kernel AST for fast startup (skip parsing); used internally by tools like `dart run` for the first-run speedup.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What does `dart compile exe` produce?
  options:
    - A JS bundle
    - A snapshot
    - A Wasm module
    - A self-contained native executable
  correctIndex: 3
  explanation: "`dart compile exe` produces a native executable that bundles the Dart runtime and AOT-compiled code; it runs on the target OS without Dart installed."
- id: q2
  question: Why run `dart pub publish --dry-run` first?
  options:
    - To validate the package without uploading
    - To make the publish faster
    - To get pub points
    - It's required by pub.dev
  correctIndex: 0
  explanation: Dry-run validates README, lints, file size, and package structure without uploading; the first real publish permanently claims the name.
- id: q3
  question: When do you bump the MAJOR version in semver?
  options:
    - For any new feature
    - For breaking changes
    - For bug fixes
    - Never — only MINOR/PATCH
  correctIndex: 1
  explanation: MAJOR bumps signal breaking changes that require user migration; MINOR adds backward-compatible features, PATCH fixes bugs.
- id: q4
  question: Which file is prominently surfaced by pub.dev and affects the maintenance score?
  options:
    - LICENSE
    - .gitignore
    - CHANGELOG.md
    - analysis_options.yaml
  correctIndex: 2
  explanation: A missing or stale CHANGELOG drops the maintenance score; pub.dev surfaces the latest version's changelog on the package page.
- id: q5
  question: What is the recommended pre-1.0 versioning strategy?
  options:
    - Start at 1.0.0 immediately
    - Never publish below 1.0
    - Use only PATCH versions
    - Use 0.x.y until the API is settled
  correctIndex: 3
  explanation: '`0.x.y` signals "API may change without a major bump"; this is the convention for settling APIs before promising stability with `1.0.0`.'
- id: q6
  question: How do you automate publishing to pub.dev?
  options:
    - GitHub Actions on tag push running `dart pub publish --force`
    - Manually run `dart pub publish` on each release
    - Email the pub team
    - You can't — publishing is manual
  correctIndex: 0
  explanation: A GitHub Actions workflow triggers on tag push, runs tests, then publishes with credentials from secrets; this is the canonical CI/CD pattern.
- id: q7
  question: What's the maximum pub points a package can score?
  options:
    - "100"
    - "130"
    - "110"
    - "200"
  correctIndex: 1
  explanation: The maximum is 130 pub points, distributed across categories like popularity, popularity, maintenance, analysis, and documentation.
- id: q8
  question: What does the `example/` folder do for a pub package?
  options:
    - Required for compilation
    - Stores test fixtures
    - Demonstrates usage and contributes to pub points
    - Holds documentation
  correctIndex: 2
  explanation: An `example/` folder with a runnable demo earns pub points and helps users understand the package at a glance.
- id: q9
  question: What's the issue with shipping a binary blob in `lib/`?
  options:
    - It's fine
    - Compile error
    - pub.dev rejects all binaries
    - Bloats the package and tanks popularity score
  correctIndex: 3
  explanation: Pub packages should be source-only; large binaries inflate download size and lower the popularity score; consider hosting binaries separately.
- id: q10
  question: What does `dart compile kernel` produce?
  options:
    - A kernel snapshot for fast startup
    - A native executable
    - A JS bundle
    - A Wasm module
  correctIndex: 0
  explanation: Kernel snapshots serialize the kernel AST for fast startup (skip parsing); used internally by tools like `dart run` for the first-run speedup.
```

