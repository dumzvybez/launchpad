---
slug: cpp-build-systems-cmake-bazel-vcpkg-conan
id: cpp-19
track: cpp
order: 19
title: Build Systems — CMake, Bazel, vcpkg, Conan
description: Master CMake (the de-facto C++ build system), Bazel for monorepos, and the package managers vcpkg and Conan that have transformed C++ dependency management.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=900s
whyItMatters: Master CMake (the de-facto C++ build system), Bazel for monorepos, and the package managers vcpkg and Conan that have transformed C++ dependency management.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Build Systems — CMake, Bazel, vcpkg, Conan

## Build Systems — CMake, Bazel, vcpkg, Conan

### Why It Matters

Master CMake (the de-facto C++ build system), Bazel for monorepos, and the package managers vcpkg and Conan that have transformed C++ dependency management.

Master CMake (the de-facto C++ build system), Bazel for monorepos, and the package managers vcpkg and Conan that have transformed C++ dependency management.

### Prerequisites

- Stage 1-18

### Topics

- CMake basics: minimum version, project, add_executable, add_library
- Targets and target_link_libraries (modern CMake)
- PUBLIC / PRIVATE / INTERFACE link scopes
- find_package and Config-file packages
- CMake presets and CTest
- Bazel: WORKSPACE, BUILD, cc_library, cc_binary, cc_test
- vcpkg: manifest mode, vcpkg.json, portfile overlays
- Conan: conanfile.txt / conanfile.py, profiles, lockfiles
- Sanitizers and -Wall -Wextra -Werror as default
- Cross-compilation toolchain files

### Key Concepts

- Modern CMake is target-based: define properties on targets (target_link_libraries, target_include_directories, target_compile_features) — avoid global commands like include_directories.
- PUBLIC = consumers AND the target itself; PRIVATE = the target only; INTERFACE = consumers only (header-only libraries).
- find_package searches standard paths and Config files; package config files (FooConfig.cmake) are the modern way packages expose themselves.
- vcpkg and Conan both solve the "no built-in package manager" problem; vcpkg is simpler (Microsoft), Conan is more flexible (JFrog).
- Bazel excels at hermetic, reproducible monorepo builds with strict dependency tracking.
- Always enable sanitizers in CI: -fsanitize=address,undefined, -Werror, and CI warnings as errors.

```cmake
cmake_minimum_required(VERSION 3.20)
project(myapp LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Warning flags as targets' property
add_library(mylib STATIC src/foo.cpp src/bar.cpp)
target_include_directories(mylib PUBLIC include)
target_compile_features(mylib PUBLIC cxx_std_20)
target_compile_options(mylib PRIVATE -Wall -Wextra -Wpedantic -Werror)

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE mylib)

# Tests
enable_testing()
add_subdirectory(tests)
```
Caption: Modern CMakeLists.txt

### Common Pitfalls

- Using global commands (include_directories, link_directories, add_definitions) — these bypass target scoping and break encapsulation; use target_* commands.
- Mixing PRIVATE and PUBLIC incorrectly — header-only deps needed in your headers should be PUBLIC; impl-only deps should be PRIVATE; getting this wrong causes either link errors or over-broad propagation.
- Not pinning dependency versions — vcpkg baseline or Conan lockfiles pin transitive versions; without them, reproducibility suffers.
- In-source builds (running cmake . in the source tree) — pollutes the source tree; always build out-of-source: `cmake -B build -S .`
- Missing sanitizer + -Werror in CI — bugs the toolchain already diagnoses ship to production; make sanitizers and -Werror default in Debug CI builds.

### Real-World Applications

- Google uses Bazel for its monorepo; the entire Google codebase builds with Bazel hermetically.
- LLVM uses CMake exclusively; the build supports hundreds of configurations and downstream packages use find_package(LLVM).
- Bloomberg's BDE provides CMake and Conan packaging for their internal use and external consumers.
- Unreal Engine uses a custom build system (UBT) but vcpkg integration is increasingly common for third-party dependencies.

### Interview Questions

- 1. What is modern CMake's core principle? — Target-based design: properties live on targets (target_link_libraries, target_include_directories), not on global state (include_directories).
- 2. What's the difference between PUBLIC, PRIVATE, and INTERFACE? — PUBLIC propagates to the target AND its consumers; PRIVATE only to the target; INTERFACE only to consumers (used for header-only libraries).
- 3. What problem does vcpkg (or Conan) solve? — C++ has no built-in package manager; vcpkg/Conan provide declarative dependency declaration, reproducible builds, and integration with CMake.
- 4. Why prefer Bazel for monorepos? — Hermetic, reproducible builds with strict dependency tracking (every dep must be declared), remote caching, and parallel execution across thousands of targets.
- 5. Why are in-source builds discouraged? — They pollute the source tree with generated files, mix well with version control poorly, and prevent multiple build configurations side-by-side.

### Mini Project

Build a CMake-Based Library with Tests and Packaging: A small library "strutil" with a header, source, and GoogleTest unit tests, packaged via vcpkg manifest. Suggested approach:
  - Structure: include/strutil.hpp, src/strutil.cpp, tests/test_strutil.cpp
  - CMakeLists.txt with add_library(strutil STATIC), add_executable(strutil_test), enable_testing()
  - vcpkg.json with "fmt" and "gtest" deps
  - target_link_libraries(strutil PUBLIC fmt) and PRIVATE for gtest on the test target
  - Add a CMake preset (Debug with sanitizers) and a Release preset

### Exercises

1. Convert an old-style CMakeLists.txt (using include_directories) to modern CMake with target_include_directories.
2. Add vcpkg.json to a project and use vcpkg manifest mode to install fmt; integrate via find_package(fmt).
3. Set up a Bazel BUILD with cc_library + cc_binary + cc_test; run `bazel test //...`.
4. Enable -fsanitize=address,undefined in your CMake Debug preset; run tests and fix any diagnostics.
5. Create a Conanfile.py that builds your project; use conan lock to pin transitive dependencies.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is modern CMake's core principle?
9. A) Global state
10. B) Manual makefiles
11. C) Target-based design — properties live on targets (*)
12. D) Header inclusion order
13. Explanation: Modern CMake puts properties on targets (target_link_libraries, target_include_directories) rather than on global state (include_directories); this enables proper scoping and reuse.
14. Q2: What does PUBLIC link scope mean?
15. A) The library is public
16. B) The dependency is only in headers
17. C) The dependency is only in source files
18. D) The dependency propagates to the target AND its consumers (*)
19. Explanation: PUBLIC = used by the target and required by consumers; PRIVATE = only used by the target's implementation; INTERFACE = only required by consumers (header-only libs).
20. Q3: Why are in-source builds discouraged?
21. A) They pollute the source tree with generated files (*)
22. B) They are slower
23. C) They are not allowed
24. D) They are deprecated by CMake
25. Explanation: In-source builds mix generated files with source files, complicating version control and preventing multiple build configurations side by side. Use `cmake -B build -S .`.
26. Q4: What does vcpkg (or Conan) provide?
27. A) A C++ compiler
28. B) A package manager for C++ dependencies (*)
29. C) A test framework
30. D) A build system
31. Explanation: vcpkg and Conan are package managers that declare dependencies in a manifest, download and build them, and integrate with CMake via find_package or toolchain files.
32. Q5: What does Bazel excel at?
33. A) Small projects
34. B) Cross-compilation
35. C) Hermetic, reproducible monorepo builds with strict dep tracking (*)
36. D) Header-only libraries
37. Explanation: Bazel enforces strict dependency declaration (every dep must be explicit), supports remote caching and execution, and excels at large monorepos.
38. Q6: Which CMake command should you avoid in modern CMake?
39. A) add_library
40. B) project
41. C) message
42. D) include_directories (use target_include_directories instead) (*)
43. Explanation: include_directories is global; prefer target_include_directories which scopes includes to specific targets and propagates correctly via PUBLIC/PRIVATE/INTERFACE.
44. Q7: What does find_package do?
45. A) Locates a package's config file and exposes its targets (*)
46. B) Builds a package
47. C) Installs a package
48. D) Downloads a package
49. Explanation: find_package searches standard paths and CMake prefix paths for FooConfig.cmake; the config file exposes imported targets you link against.
50. Q8: Why enable -fsanitize=address,undefined in CI?
51. A) It speeds up tests
52. B) It catches memory and UB bugs the compiler already knows about (*)
53. C) It is required by the standard
54. D) It enables constexpr
55. Explanation: ASan + UBSan catch use-after-free, leaks, signed overflow, and other UB at runtime; running tests under sanitizers in CI catches bugs before they ship.
56. Q9: What is a CMake preset?
57. A) A package manager
58. B) A compiler
59. C) A reusable CMake configuration (CMakePresets.json) — build dir, generator, flags (*)
60. D) A unit test
61. Explanation: CMakePresets.json defines reusable configurations (Debug, Release, Sanitize) with their flags, generators, and build directories; users invoke `cmake --preset debug`.
62. Q10: What is a Conan lockfile for?
63. A) Locking the compiler
64. B) Locking the source tree
65. C) Disabling network access
66. D) Pinning dependency versions for reproducibility (*)
67. Explanation: Conan lockfiles pin the resolved dependency graph (exact versions of all transitive deps), enabling reproducible builds across machines and time.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is modern CMake's core principle?
  options:
    - Global state
    - Manual makefiles
    - Target-based design — properties live on targets
    - Header inclusion order
  correctIndex: 2
  explanation: Modern CMake puts properties on targets (target_link_libraries, target_include_directories) rather than on global state (include_directories); this enables proper scoping and reuse.
- id: q2
  question: What does PUBLIC link scope mean?
  options:
    - The library is public
    - The dependency is only in headers
    - The dependency is only in source files
    - The dependency propagates to the target AND its consumers
  correctIndex: 3
  explanation: PUBLIC = used by the target and required by consumers; PRIVATE = only used by the target's implementation; INTERFACE = only required by consumers (header-only libs).
- id: q3
  question: Why are in-source builds discouraged?
  options:
    - They pollute the source tree with generated files
    - They are slower
    - They are not allowed
    - They are deprecated by CMake
  correctIndex: 0
  explanation: In-source builds mix generated files with source files, complicating version control and preventing multiple build configurations side by side. Use `cmake -B build -S .`.
- id: q4
  question: What does vcpkg (or Conan) provide?
  options:
    - A C++ compiler
    - A package manager for C++ dependencies
    - A test framework
    - A build system
  correctIndex: 1
  explanation: vcpkg and Conan are package managers that declare dependencies in a manifest, download and build them, and integrate with CMake via find_package or toolchain files.
- id: q5
  question: What does Bazel excel at?
  options:
    - Small projects
    - Cross-compilation
    - Hermetic, reproducible monorepo builds with strict dep tracking
    - Header-only libraries
  correctIndex: 2
  explanation: Bazel enforces strict dependency declaration (every dep must be explicit), supports remote caching and execution, and excels at large monorepos.
- id: q6
  question: Which CMake command should you avoid in modern CMake?
  options:
    - add_library
    - project
    - message
    - include_directories (use target_include_directories instead)
  correctIndex: 3
  explanation: include_directories is global; prefer target_include_directories which scopes includes to specific targets and propagates correctly via PUBLIC/PRIVATE/INTERFACE.
- id: q7
  question: What does find_package do?
  options:
    - Locates a package's config file and exposes its targets
    - Builds a package
    - Installs a package
    - Downloads a package
  correctIndex: 0
  explanation: find_package searches standard paths and CMake prefix paths for FooConfig.cmake; the config file exposes imported targets you link against.
- id: q8
  question: Why enable -fsanitize=address,undefined in CI?
  options:
    - It speeds up tests
    - It catches memory and UB bugs the compiler already knows about
    - It is required by the standard
    - It enables constexpr
  correctIndex: 1
  explanation: ASan + UBSan catch use-after-free, leaks, signed overflow, and other UB at runtime; running tests under sanitizers in CI catches bugs before they ship.
- id: q9
  question: What is a CMake preset?
  options:
    - A package manager
    - A compiler
    - A reusable CMake configuration (CMakePresets.json) — build dir, generator, flags
    - A unit test
  correctIndex: 2
  explanation: CMakePresets.json defines reusable configurations (Debug, Release, Sanitize) with their flags, generators, and build directories; users invoke `cmake --preset debug`.
- id: q10
  question: What is a Conan lockfile for?
  options:
    - Locking the compiler
    - Locking the source tree
    - Disabling network access
    - Pinning dependency versions for reproducibility
  correctIndex: 3
  explanation: Conan lockfiles pin the resolved dependency graph (exact versions of all transitive deps), enabling reproducible builds across machines and time.
```

