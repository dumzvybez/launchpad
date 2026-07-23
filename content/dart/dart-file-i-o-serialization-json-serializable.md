---
slug: dart-file-i-o-serialization-json-serializable
id: dart-14
track: dart
order: 14
title: File I/O and Serialization (json_serializable)
description: Read and write files with the `dart:io` library, parse and produce JSON manually and with `json_serializable` code generation, and bridge between typed Dart objects and JSON maps.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=7800s
whyItMatters: Read and write files with the `dart:io` library, parse and produce JSON manually and with `json_serializable` code generation, and bridge between typed Dart objects and JSON maps.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# File I/O and Serialization (json_serializable)

## File I/O and Serialization (json_serializable)

### Why It Matters

Read and write files with the `dart:io` library, parse and produce JSON manually and with `json_serializable` code generation, and bridge between typed Dart objects and JSON maps.

Read and write files with the `dart:io` library, parse and produce JSON manually and with `json_serializable` code generation, and bridge between typed Dart objects and JSON maps.

### Prerequisites

- Stage 7: Classes, Constructors, and Named Parameters
- Stage 11: Async Programming — Future, async/await
- Stage 13: Error Handling — try/catch, custom exceptions

### Topics

- `dart:io` File and Directory APIs
- `File.readAsString`, `writeAsString`, `readAsBytes`, `writeAsBytes`
- `dart:convert` JSON: `jsonEncode`, `jsonDecode`
- Manual `fromJson`/`toJson` methods
- `json_serializable` package: annotations and codegen
- `@JsonKey`, `@JsonSerializable(fieldRename: ...)`, default values
- `build_runner` for codegen: `dart run build_runner build`
- Handling nested objects, lists, and enums in JSON

### Key Concepts

- `dart:io` is unavailable in web builds — for cross-platform file abstraction use `package:path_provider` (Flutter) or `package:file`.
- `jsonDecode` returns `dynamic` (typically `Map<String, dynamic>` or `List<dynamic>`); you must cast and validate before using.
- Manual `fromJson`/`toJson` is verbose but explicit; `json_serializable` generates them via build_runner, reducing boilerplate.
- Generated code lives in `.g.dart` files; never edit by hand, and don't forget to re-run build_runner when the schema changes.
- `@JsonKey(name: 'snake_case')` maps a Dart camelCase field to a JSON snake_case key.
- Enums serialize as their name by default; `@JsonEnum(alwaysCreate: true)` and custom converters handle non-string representations.

```dart
import 'dart:io';

Future<void> writeLog(String msg) async {
  final file = File('log.txt');
  await file.writeAsString('${DateTime.now()}: $msg\n', mode: FileMode.append);
}

Future<String> readLog() async {
  final file = File('log.txt');
  return await file.readAsString();
}
```
Caption: File I/O

### Common Pitfalls

- Casting `jsonDecode` to `Map<String, dynamic>` blindly — JSON arrays decode as `List<dynamic>`, so `as Map` throws on arrays. Check the runtime type or use `as Map<String, dynamic>` only when you know the shape.
- Forgetting to re-run `build_runner` after editing annotations — the generated `.g.dart` file is stale; CI should fail the build if the generated code doesn't match.
- Using `dart:io` in a Flutter web build — `dart:io` is not available on the web; use conditional imports or `package:file`/`path_provider` abstractions.
- Mutating the map returned by `jsonDecode` and assuming it's typed — it's `Map<String, dynamic>` with `dynamic` values, so `map['age'] + 1` works at runtime but has no static type checking.
- Missing `@JsonKey(defaultValue: ...)` for required fields with backward-incompatible JSON — adding a new non-nullable field breaks old payloads; provide a default or make the field nullable.

### Real-World Applications

- Flutter apps universally use `json_serializable` for typed API models — Google's own examples and codelabs recommend it.
- The Hamilton app persists user preferences and offline show data as JSON files via `path_provider` + `json_serializable`.
- Alibaba's Xianyu uses `json_serializable` with `@JsonSerializable(fieldRename: FieldRename.snake)` to bridge Dart camelCase with their snake_case backend.
- eBay Motors uses custom `JsonConverter`s to serialize complex domain types like `Money` and `VIN` cleanly.

### Interview Questions

- 1. Why use `json_serializable` over manual `fromJson`? — Less boilerplate, less error-prone, and generated code stays in sync with the schema via build_runner.
- 2. What does `jsonDecode` return? — `dynamic`; the actual runtime type is usually `Map<String, dynamic>` or `List<dynamic>` depending on the JSON's top-level structure.
- 3. Why can't you use `dart:io` in Flutter web? — `dart:io` is a native-only library; the web platform has no filesystem. Use `package:file` or conditional imports for cross-platform.
- 4. What does `@JsonKey(name: 'foo_bar')` do? — Maps a Dart field name to a different JSON key, common when the API uses snake_case but Dart uses camelCase.
- 5. How do you regenerate the `.g.dart` files? — `dart run build_runner build --delete-conflicting-outputs` regenerates; `watch` mode rebuilds on file change during development.

### Mini Project

Build a JSON-backed Key-Value Store: A small persistent KV store that saves `Map<String, dynamic>` to a JSON file on disk. Use `json_serializable` for a `KvEntry` value type, support `get`, `set`, `delete`, `list`, and atomic file writes (write-to-temp + rename). Add a CLI that exercises all commands. Suggested approach:
  - Use `path` package to compute a sensible storage path
  - Implement `Future<void> save()` that writes JSON via `writeAsString`
  - Implement atomic write: `File(tmp).writeAsString(...)` then `tmp.rename(target)`
  - Use `json_serializable` for entries with `@JsonKey` for snake_case keys
  - Add a simple CLI in `bin/kv.dart` parsing `args`

### Exercises

1. Use `File.readAsString` and `jsonDecode` to read a JSON config and print a field.
2. Write a manual `fromJson` for a `Point(double x, double y)` class.
3. Set up `json_serializable` and run `build_runner build` to generate code.
4. Use `@JsonKey(defaultValue: 0)` and verify an absent key falls back to the default.
5. Write a custom `JsonConverter<DateTime, String>` that formats dates as ISO-8601.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `jsonDecode` return?
9. A) Map<String, dynamic>
10. B) dynamic (*)
11. C) List<dynamic>
12. D) String
13. Explanation: `jsonDecode` returns `dynamic`; the runtime type is `Map<String, dynamic>` for objects, `List<dynamic>` for arrays, `String`/`num`/`bool`/`null` for primitives.
14. Q2: Which library is unavailable on Flutter web?
15. A) dart:async
16. B) dart:convert
17. C) dart:io (*)
18. D) dart:core
19. Explanation: `dart:io` (File, Directory, HttpClient, Process) is native-only; the web has no filesystem. Use `package:file` or conditional imports for cross-platform code.
20. Q3: Which command regenerates .g.dart files?
21. A) dart generate
22. B) dart compile
23. C) dart pub get
24. D) dart run build_runner build (*)
25. Explanation: `dart run build_runner build` runs all code generators (json_serializable, freezed, drift, etc.); `--delete-conflicting-outputs` discards stale files.
26. Q4: What does `@JsonKey(name: 'created_at')` do?
27. A) Maps the Dart field to the JSON key 'created_at' (*)
28. B) Renames the Dart field
29. C) Makes the field required
30. D) Defaults the field to null
31. Explanation: `@JsonKey(name: ...)` aliases a Dart field to a different JSON key, enabling camelCase in Dart with snake_case in JSON.
32. Q5: Why use json_serializable over manual fromJson?
33. A) It's faster at runtime
34. B) It reduces boilerplate and stays in sync with the schema (*)
35. C) It avoids the dart:convert dependency
36. D) It works on the web without dart:io
37. Explanation: Code generation produces correct, type-checked fromJson/toJson from annotations; you maintain the schema, not the boilerplate.
38. Q6: What's a safe way to handle a top-level JSON array?
39. A) Cast jsonDecode to Map<String, dynamic>
40. B) Use jsonDecode without casting
41. C) Cast to List<dynamic> and iterate (*)
42. D) Use jsonEncode instead
43. Explanation: A JSON array decodes as `List<dynamic>`; casting to `Map` throws. Check the runtime type or cast to the appropriate list type.
44. Q7: What does `File.writeAsString(..., mode: FileMode.append)` do?
45. A) Replaces the file
46. B) Throws if the file exists
47. C) Writes to a temp file
48. D) Appends to the file (*)
49. Explanation: `FileMode.append` opens the file for appending; the default mode is `FileMode.write`, which truncates and replaces.
50. Q8: What is the generated file extension for json_serializable?
51. A) .g.dart (*)
52. B) .dart.json
53. C) .gen.dart
54. D) .jsons.dart
55. Explanation: json_serializable (and most Dart codegen tools) emit `.g.dart` files referenced via `part 'foo.g.dart';` in the source.
56. Q9: What happens if you add a new non-nullable field without a default?
57. A) Old JSON still loads fine
58. B) Old JSON missing the field throws at runtime (*)
59. C) Old JSON silently uses null
60. D) Compile error only
61. Explanation: A new required field without `defaultValue` or nullable type causes `_$XFromJson` to throw on payloads that predate the field.
62. Q10: How do you write to a file atomically?
63. A) File.write always atomically
64. B) Use FileMode.atomic
65. C) Write to a temp file then rename over the target (*)
66. D) Lock the file with flock first
67. Explanation: Atomic writes use a temp file + rename pattern so a crash mid-write leaves either the old or the new file, never a truncated one.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `jsonDecode` return?
  options:
    - Map<String, dynamic>
    - dynamic
    - List<dynamic>
    - String
  correctIndex: 1
  explanation: "`jsonDecode` returns `dynamic`; the runtime type is `Map<String, dynamic>` for objects, `List<dynamic>` for arrays, `String`/`num`/`bool`/`null` for primitives."
- id: q2
  question: Which library is unavailable on Flutter web?
  options:
    - dart:async
    - dart:convert
    - dart:io
    - dart:core
  correctIndex: 2
  explanation: "`dart:io` (File, Directory, HttpClient, Process) is native-only; the web has no filesystem. Use `package:file` or conditional imports for cross-platform code."
- id: q3
  question: Which command regenerates .g.dart files?
  options:
    - dart generate
    - dart compile
    - dart pub get
    - dart run build_runner build
  correctIndex: 3
  explanation: "`dart run build_runner build` runs all code generators (json_serializable, freezed, drift, etc.); `--delete-conflicting-outputs` discards stale files."
- id: q4
  question: "What does `@JsonKey(name: 'created_at')` do?"
  options:
    - Maps the Dart field to the JSON key 'created_at'
    - Renames the Dart field
    - Makes the field required
    - Defaults the field to null
  correctIndex: 0
  explanation: "`@JsonKey(name: ...)` aliases a Dart field to a different JSON key, enabling camelCase in Dart with snake_case in JSON."
- id: q5
  question: Why use json_serializable over manual fromJson?
  options:
    - It's faster at runtime
    - It reduces boilerplate and stays in sync with the schema
    - It avoids the dart:convert dependency
    - It works on the web without dart:io
  correctIndex: 1
  explanation: Code generation produces correct, type-checked fromJson/toJson from annotations; you maintain the schema, not the boilerplate.
- id: q6
  question: What's a safe way to handle a top-level JSON array?
  options:
    - Cast jsonDecode to Map<String, dynamic>
    - Use jsonDecode without casting
    - Cast to List<dynamic> and iterate
    - Use jsonEncode instead
  correctIndex: 2
  explanation: A JSON array decodes as `List<dynamic>`; casting to `Map` throws. Check the runtime type or cast to the appropriate list type.
- id: q7
  question: "What does `File.writeAsString(..., mode: FileMode.append)` do?"
  options:
    - Replaces the file
    - Throws if the file exists
    - Writes to a temp file
    - Appends to the file
  correctIndex: 3
  explanation: "`FileMode.append` opens the file for appending; the default mode is `FileMode.write`, which truncates and replaces."
- id: q8
  question: What is the generated file extension for json_serializable?
  options:
    - .g.dart
    - .dart.json
    - .gen.dart
    - .jsons.dart
  correctIndex: 0
  explanation: json_serializable (and most Dart codegen tools) emit `.g.dart` files referenced via `part 'foo.g.dart';` in the source.
- id: q9
  question: What happens if you add a new non-nullable field without a default?
  options:
    - Old JSON still loads fine
    - Old JSON missing the field throws at runtime
    - Old JSON silently uses null
    - Compile error only
  correctIndex: 1
  explanation: A new required field without `defaultValue` or nullable type causes `_$XFromJson` to throw on payloads that predate the field.
- id: q10
  question: How do you write to a file atomically?
  options:
    - File.write always atomically
    - Use FileMode.atomic
    - Write to a temp file then rename over the target
    - Lock the file with flock first
  correctIndex: 2
  explanation: Atomic writes use a temp file + rename pattern so a crash mid-write leaves either the old or the new file, never a truncated one.
```

