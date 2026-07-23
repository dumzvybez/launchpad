---
slug: kotlin-file-i-o-serialization-json-kotlinx-serialization
id: kotlin-17
track: kotlin
order: 17
title: File I/O, Serialization, and JSON (kotlinx.serialization)
description: Read and write files, serialize objects to JSON with `kotlinx.serialization`, and learn the annotations and polymorphism options that production Kotlin apps rely on.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=8640s
whyItMatters: Read and write files, serialize objects to JSON with `kotlinx. serialization`, and learn the annotations and polymorphism options that production Kotlin apps rely on.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# File I/O, Serialization, and JSON (kotlinx.serialization)

## File I/O, Serialization, and JSON (kotlinx.serialization)

### Why It Matters

Read and write files, serialize objects to JSON with `kotlinx. serialization`, and learn the annotations and polymorphism options that production Kotlin apps rely on.

Read and write files, serialize objects to JSON with `kotlinx.serialization`, and learn the annotations and polymorphism options that production Kotlin apps rely on.

### Prerequisites

- Stage 1-16.
- Comfort with coroutines, collections, and data classes.

### Topics

- File I/O with `java.nio.file` and Kotlin extensions
- `readText()`, `writeText()`, `useLines` for streaming
- `kotlinx.serialization` plugin and runtime
- `@Serializable` annotation
- `Json.encodeToString` / `decodeFromString`
- `@SerialName`, `@Transient`, `@SerialInfo`
- Optional fields and default values
- Polymorphic serialization (sealed classes)

### Key Concepts

- `kotlinx.serialization` is a compiler plugin that generates serializers at compile time — no reflection, fast, and works on Kotlin/Native and Kotlin/JS.
- `@Serializable` on a class generates a `serializer()`; `Json { ... }` is the configurable encoder.
- Default values are honored: a missing field in JSON fills in the default; set `encodeDefaults = false` to skip serializing defaults.
- `@SerialName("wire_name")` renames a field on the wire (camelCase Kotlin -> snake_case JSON, etc.).
- Polymorphic serialization requires a sealed class (or explicit `SerializersModule`) so the encoder knows all subclasses.

```kotlin
import java.io.File

// Read all
val text = File("input.txt").readText()
val lines = File("data.csv").readLines()

// Streaming a large file line by line (closes the reader automatically)
File("huge.log").useLines { lines ->
    lines.filter { it.contains("ERROR") }.forEach(::println)
}

// Write
File("out.txt").writeText("Hello")
File("out.txt").appendText("\nMore")
```
Caption: File I/O

### Common Pitfalls

- Forgetting the `kotlinx.serialization` plugin in `build.gradle.kts` — `@Serializable` alone is a no-op annotation; the compiler plugin must be applied.
- Marking a class `@Serializable` with a non-serializable property — the compiler rejects it; either make the property `@Transient` or supply a custom serializer.
- Expecting default values to be serialized — by default `Json` skips defaults in output; set `encodeDefaults = true` to include them.
- Using `Json.decodeFromString` on an unregistered polymorphic subclass — sealed-class hierarchies work automatically; for open hierarchies you need a `SerializersModule`.
- Loading an entire huge file with `readText()` — use `useLines` or `bufferedReader().lineSequence()` to stream and avoid OOMs.

### Real-World Applications

- Ktor's `ContentNegotiation` plugin uses `kotlinx.serialization` to auto-convert JSON request/response bodies to data classes.
- Square's Retrofit + kotlinx.serialization converter parses API responses with zero reflection and fast startup.
- JetBrains' YouTrack mobile app uses kotlinx.serialization for offline cache persistence.
- AndroidX DataStore (Jetpack) uses kotlinx.serialization internally for typed preferences.

### Interview Questions

- 1. Why does kotlinx.serialization require a compiler plugin? — Because serializers are generated at compile time (no reflection at runtime); this enables fast startup and Kotlin/Native/JS support.
- 2. What does `@SerialName` do? — Renames a property on the wire (e.g., Kotlin `userName` -> JSON `user_name`), decoupling code style from wire format.
- 3. What does `@Transient` do? — Marks a property to be skipped during serialization; the property must have a default value to be filled in on decode.
- 4. How does polymorphic serialization work? — For sealed classes, the encoder adds a `type` discriminator automatically; for open hierarchies, you register subclasses in a `SerializersModule`.
- 5. How do you stream a large file without loading it all? — Use `File.useLines { }` or `bufferedReader().lineSequence()` to process lazily and close the reader automatically.

### Mini Project

Build a Config File Loader: A serializable `AppConfig` data class with nested objects and a list; load it from JSON, validate, and persist changes back. Suggested approach:
  - `@Serializable data class AppConfig(val name: String, val db: DbConfig, val features: List<String> = emptyList())`
  - `@Serializable data class DbConfig(val url: String, val poolSize: Int = 10)`
  - `val cfg = Json.decodeFromString<AppConfig>(File("config.json").readText())`
  - Validate with `require(cfg.db.poolSize in 1..100) { "invalid pool" }`
  - Save back: `File("config.json").writeText(Json.encodeToString(cfg.copy(features = cfg.features + "new")))`

### Exercises

1. Apply the kotlinx.serialization plugin in `build.gradle.kts` and verify `@Serializable` generates a serializer.
2. Serialize and deserialize a `data class Person(name, age)` and check round-trip equality.
3. Use `@SerialName` to map `userName` to `user_name` in JSON output; verify with `println`.
4. Stream a CSV file with `useLines` and count lines containing a keyword without OOM.
5. Build a sealed class hierarchy with three subclasses and verify the `type` discriminator appears in JSON.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `@Serializable` require to work?
9. A) The kotlinx.serialization compiler plugin (*)
10. B) Nothing extra
11. C) Java reflection
12. D) Spring Boot
13. Explanation: `@Serializable` alone is a no-op; the kotlinx.serialization Gradle plugin generates serializers at compile time so no runtime reflection is needed.
14. Q2: Which function serializes an object to a JSON string?
15. A) `Json.toJson(obj)`
16. B) `Json.encodeToString(obj)` (*)
17. C) `obj.toJson()`
18. D) `serialize(obj)`
19. Explanation: `Json.encodeToString(value)` (reified) or `Json.encodeToString(Serializer, value)` produces the JSON string.
20. Q3: What does `@SerialName("foo")` do?
21. A) Marks it transient
22. B) Adds a default
23. C) Renames the property on the wire (*)
24. D) Makes it optional
25. Explanation: `@SerialName` maps a Kotlin property to a different JSON key — useful for snake_case wire formats or to avoid name clashes.
26. Q4: What does `@Transient` mean?
27. A) Cached during serialization
28. B) The property is required
29. C) The property is nullable
30. D) The property is skipped during serialization (*)
31. Explanation: `@Transient` excludes a property from serialization; the property must have a default value to be filled in on decode.
32. Q5: By default, are default-value properties serialized?
33. A) No — they're skipped unless `encodeDefaults = true` (*)
34. B) Yes
35. C) Only Int defaults
36. D) Only nullable defaults
37. Explanation: `Json.encodeToString` skips properties whose value equals the default; set `Json { encodeDefaults = true }` to include them.
38. Q6: How does polymorphic serialization work for sealed classes?
39. A) Manual subclass registration
40. B) A `type` discriminator is added automatically (*)
41. C) It's not supported
42. D) Only with SerializersModule
43. Explanation: Sealed-class hierarchies get a `type` discriminator automatically; for open hierarchies you need a `SerializersModule`.
44. Q7: Which streams a large file line by line and closes the reader automatically?
45. A) `File.readLines()`
46. B) `File.readText()`
47. C) `File.useLines { }` (*)
48. D) `File.forEachLine {}` (lazy, also closes)
49. Explanation: `useLines` opens a lazy sequence and guarantees the reader is closed; `readLines()` loads the whole file into memory.
50. Q8: What's the safest way to parse `{"name":"Alice"}` into `User(name, age=0)`?
51. A) Manually inject age
52. B) Use reflection
53. C) It will throw
54. D) Use `Json.decodeFromString<User>(...)` — age defaults to 0 (*)
55. Explanation: kotlinx.serialization honors default values: a missing field fills in the default (here, age=0).
56. Q9: Which Json config includes defaults in output?
57. A) `Json { encodeDefaults = true }` (*)
58. B) `Json { encodeDefaults = false }`
59. C) `Json { skipDefaults = true }`
60. D) `Json { prettyPrint = true }`
61. Explanation: `encodeDefaults = true` makes the encoder emit properties whose value equals the default — useful for schema-stable output.
62. Q10: Can kotlinx.serialization work on Kotlin/Native?
63. A) No
64. B) Yes — no reflection needed at runtime (*)
65. C) Only on JVM
66. D) Only with a native plugin
67. Explanation: Because serializers are generated at compile time, kotlinx.serialization works on Kotlin/Native, Kotlin/JS, and Kotlin/JVM without runtime reflection.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `@Serializable` require to work?
  options:
    - The kotlinx.serialization compiler plugin
    - Nothing extra
    - Java reflection
    - Spring Boot
  correctIndex: 0
  explanation: "`@Serializable` alone is a no-op; the kotlinx.serialization Gradle plugin generates serializers at compile time so no runtime reflection is needed."
- id: q2
  question: Which function serializes an object to a JSON string?
  options:
    - "`Json.toJson(obj)`"
    - "`Json.encodeToString(obj)`"
    - "`obj.toJson()`"
    - "`serialize(obj)`"
  correctIndex: 1
  explanation: "`Json.encodeToString(value)` (reified) or `Json.encodeToString(Serializer, value)` produces the JSON string."
- id: q3
  question: What does `@SerialName("foo")` do?
  options:
    - Marks it transient
    - Adds a default
    - Renames the property on the wire
    - Makes it optional
  correctIndex: 2
  explanation: "`@SerialName` maps a Kotlin property to a different JSON key — useful for snake_case wire formats or to avoid name clashes."
- id: q4
  question: What does `@Transient` mean?
  options:
    - Cached during serialization
    - The property is required
    - The property is nullable
    - The property is skipped during serialization
  correctIndex: 3
  explanation: "`@Transient` excludes a property from serialization; the property must have a default value to be filled in on decode."
- id: q5
  question: By default, are default-value properties serialized?
  options:
    - No — they're skipped unless `encodeDefaults = true`
    - Yes
    - Only Int defaults
    - Only nullable defaults
  correctIndex: 0
  explanation: "`Json.encodeToString` skips properties whose value equals the default; set `Json { encodeDefaults = true }` to include them."
- id: q6
  question: How does polymorphic serialization work for sealed classes?
  options:
    - Manual subclass registration
    - A `type` discriminator is added automatically
    - It's not supported
    - Only with SerializersModule
  correctIndex: 1
  explanation: Sealed-class hierarchies get a `type` discriminator automatically; for open hierarchies you need a `SerializersModule`.
- id: q7
  question: Which streams a large file line by line and closes the reader automatically?
  options:
    - "`File.readLines()`"
    - "`File.readText()`"
    - "`File.useLines { }`"
    - "`File.forEachLine {}` (lazy, also closes)"
  correctIndex: 2
  explanation: "`useLines` opens a lazy sequence and guarantees the reader is closed; `readLines()` loads the whole file into memory."
- id: q8
  question: What's the safest way to parse `{"name":"Alice"}` into `User(name, age=0)`?
  options:
    - Manually inject age
    - Use reflection
    - It will throw
    - Use `Json.decodeFromString<User>(...)` — age defaults to 0
  correctIndex: 3
  explanation: "kotlinx.serialization honors default values: a missing field fills in the default (here, age=0)."
- id: q9
  question: Which Json config includes defaults in output?
  options:
    - "`Json { encodeDefaults = true }`"
    - "`Json { encodeDefaults = false }`"
    - "`Json { skipDefaults = true }`"
    - "`Json { prettyPrint = true }`"
  correctIndex: 0
  explanation: "`encodeDefaults = true` makes the encoder emit properties whose value equals the default — useful for schema-stable output."
- id: q10
  question: Can kotlinx.serialization work on Kotlin/Native?
  options:
    - No
    - Yes — no reflection needed at runtime
    - Only on JVM
    - Only with a native plugin
  correctIndex: 1
  explanation: Because serializers are generated at compile time, kotlinx.serialization works on Kotlin/Native, Kotlin/JS, and Kotlin/JVM without runtime reflection.
```

