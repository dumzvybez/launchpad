---
slug: csharp-file-i-o-streams-serialization
id: csharp-13
track: csharp
order: 13
title: File I/O, Streams, and Serialization
description: Read and write files with File, FileStream, StreamReader/Writer, serialize with System.Text.Json (source-generated), and avoid the common pitfalls of stream lifetime and async disposal.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=12000s
whyItMatters: Read and write files with File, FileStream, StreamReader/Writer, serialize with System. Text.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# File I/O, Streams, and Serialization

## File I/O, Streams, and Serialization

### Why It Matters

Read and write files with File, FileStream, StreamReader/Writer, serialize with System. Text.

Read and write files with File, FileStream, StreamReader/Writer, serialize with System.Text.Json (source-generated), and avoid the common pitfalls of stream lifetime and async disposal.

### Prerequisites

- Stage 11: async/await and the TPL.
- Stage 12: Exception Handling.

### Topics

- File, FileInfo, Directory, DirectoryInfo static helpers
- FileStream, BufferedStream, and the Stream base class
- StreamReader / StreamWriter (text) and BinaryReader / BinaryWriter
- `using` declarations and `await using` (IAsyncDisposable)
- System.Text.Json: JsonSerializer, JsonSerializerOptions, source generation
- JsonDocument / JsonNode (DOM), Utf8JsonReader / Utf8JsonWriter (low-level)
- Memory-mapped files (MemoryMappedFile) for huge files
- Paths: Path.Combine, Path.GetTempPath, cross-platform separators

### Key Concepts

- Streams are byte sequences; readers/writers add encoding (text) or schema (binary) on top; always wrap in `using` to dispose (which flushes and closes).
- `System.Text.Json` is the modern default — async, allocation-aware, UTF-8 native, and source-generator-friendly; avoid `Newtonsoft.Json` for new code unless you need its features.
- Source generation (`JsonSerializerContext`) AOT-trims the reflection out, enabling Native AOT and faster startup; declare a partial `JsonSerializerContext` subclass with `[JsonSerializable(typeof(T))]`.
- `File.ReadAllText` is convenient but loads the whole file into memory; for huge files, stream with `File.ReadLines` (lazy `IEnumerable<string>`) or `Utf8JsonReader` over a `ReadOnlySpan<byte>`.
- `using var fs = File.OpenRead(path);` is a `using` declaration (C# 8) — disposed at end of scope; `await using` (C# 8) is the async equivalent for `IAsyncDisposable`.

```csharp
// Convenience (loads whole file)
string text = File.ReadAllText("input.txt");
File.WriteAllText("output.txt", text.ToUpper());

// Streaming (lazy, low memory)
foreach (var line in File.ReadLines("big.log"))   // NOT ReadAllLines
    if (line.Contains("ERROR")) Console.WriteLine(line);

// Async streaming
await foreach (var line in File.ReadLinesAsync("big.log", ct))
    if (line.Contains("ERROR")) Console.WriteLine(line);
```
Caption: File helpers and streaming

### Common Pitfalls

- `File.ReadAllLines` on a multi-GB file — loads every line into an array; use `File.ReadLines` (lazy `IEnumerable<string>`) or stream line-by-line.
- Forgetting to dispose a `FileStream` — holds an open file handle (limited resource) and on Windows locks the file from other writers; always `using`/`await using`.
- Using `Newtonsoft.Json` defaults in a security-sensitive context — `TypeNameHandling.All` enables polymorphic deserialization, which is a remote-code-execution vector; System.Text.Json doesn't allow this by default.
- Source-generation mismatch — if a type isn't in the `[JsonSerializable]` list, the source generator can't serialize it, and reflection fallback breaks AOT/trimming; add every type you serialize.
- Mixing sync and async file IO on the same handle — sync `Read` on a `useAsync: true` FileStream is slower; pick one mode per stream.

### Real-World Applications

- EF Core streams query results from SQL Server via `DbDataReader` (a forward-only stream) — never loading the whole result set into memory.
- Microsoft's Kestrel uses `System.IO.Pipelines` (pipe-based streaming) for HTTP request/response bodies, avoiding the allocation overhead of classic streams.
- Unity's asset bundle format is read via memory-mapped files for instant load of large assets on mobile devices.
- Azure SDK uses `System.Text.Json` source generation throughout to enable Native AOT deployment of client libraries with minimal startup overhead.

### Interview Questions

- 1. What is the difference between `File.ReadAllLines` and `File.ReadLines`? — `ReadAllLines` returns `string[]` (eager, whole file in memory); `ReadLines` returns `IEnumerable<string>` (lazy, streamed) — use the latter for large files.
- 2. Why is `System.Text.Json` preferred over `Newtonsoft.Json` for new code? — It's UTF-8 native (no string round-trip), async-first, allocation-aware, and supports source generation for AOT/trimming; Newtonsoft relies on reflection and is slower for high-throughput scenarios.
- 3. What does `using var fs = ...;` do? — A `using` declaration (C# 8) disposes the resource at end of scope (via try/finally); `await using` is the async equivalent for `IAsyncDisposable`.
- 4. Why use source-generated JSON (`JsonSerializerContext`)? — Eliminates runtime reflection (faster startup, no trim warnings), enables Native AOT, and produces compile-time-verified serialization for the listed types.
- 5. What is a memory-mapped file good for? — Mapping a file directly into process address space for random access to huge files without explicit reads/writes — used by databases and Unity asset bundles.

### Mini Project

Build a Log Analyzer: Stream a multi-GB log file line-by-line, parse each line into a `LogEntry` record, count errors by category, and write a JSON summary report — all with async streams and source-generated JSON. Suggested approach:
  - Define `record LogEntry(DateTimeOffset Ts, string Level, string Category, string Msg)`
  - Use `await foreach (var line in File.ReadLinesAsync(path, ct))` to stream
  - Parse with `Span<char>` and a custom splitter for performance
  - Aggregate counts in `Dictionary<string, int>`
  - Write summary with `JsonSerializer.Serialize(summary, AppJsonContext.Default.LogSummary)` (source-generated)

### Exercises

1. Write a program that reads a 1M-line file with `ReadAllLines` and `ReadLines`; compare peak memory with `dotnet-counters`.
2. Serialize a `List<Person>` with `System.Text.Json` both reflectively and via a source-generated context; verify identical output.
3. Use `Utf8JsonReader` to manually parse a JSON array of numbers, counting values greater than 100.
4. Open a `FileStream` without `using`, write to it, and observe the file is locked until the process exits (or GC finalizes the stream).
5. Use `MemoryMappedFile.CreateFromFile` to map a 1GB file and read a 4KB chunk at offset 500MB without loading the whole file.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `File.ReadLines(path)` returns…
9. A) IEnumerable<string> (lazy, streamed) (*)
10. B) string[] (eager, whole file in memory)
11. C) a Task<string>
12. D) a byte[]
13. Explanation: `ReadLines` is lazy — it yields one line at a time as you enumerate, keeping memory low for huge files; `ReadAllLines` returns an eager `string[]`.
14. Q2: `using var fs = new FileStream(...);` disposes the stream…
15. A) Never
16. B) At end of the enclosing scope (C# 8 using declaration) (*)
17. C) Only on exception
18. D) Manually via GC.Collect
19. Explanation: A `using` declaration scopes the resource to the end of the enclosing block, emitting a try/finally that calls Dispose; `await using` is the async variant for IAsyncDisposable.
20. Q3: Which is the modern default JSON serializer for new .NET code?
21. A) Newtonsoft.Json
22. B) DataContractJsonSerializer
23. C) System.Text.Json (*)
24. D) JavaScriptSerializer
25. Explanation: System.Text.Json is UTF-8 native, async-first, allocation-aware, and source-generator-friendly; it ships in the BCL. Use Newtonsoft only if you need its specific features.
26. Q4: Source-generated JSON (`JsonSerializerContext`)…
27. A) Uses reflection at runtime
28. B) Cannot serialize custom types
29. C) Is slower than reflective serialization
30. D) Eliminates runtime reflection, enabling Native AOT and trimming (*)
31. Explanation: A source generator emits serialization code at compile time for types in `[JsonSerializable]`, removing runtime reflection — faster startup, no trim warnings, AOT-compatible.
32. Q5: Forgetting to dispose a FileStream…
33. A) Leaks a file handle (and may lock the file on Windows) until GC finalizes it (*)
34. B) Has no effect
35. C) Throws immediately
36. D) Closes the file automatically
37. Explanation: An undisposed FileStream relies on finalization to release the OS handle — slow and unreliable; on Windows the file may stay locked. Always use `using`/`await using`.
38. Q6: `Newtonsoft.Json` with `TypeNameHandling.All` is a security risk because…
39. A) It is slow
40. B) It enables polymorphic deserialization, a known RCE vector (*)
41. C) It does not support UTF-8
42. D) It throws on null
43. Explanation: `TypeNameHandling.All` lets the JSON payload specify the .NET type to instantiate, allowing an attacker to inject dangerous types (e.g., `ObjectDataProvider`); System.Text.Json refuses this by default.
44. Q7: `Utf8JsonReader` is best for…
45. A) High-level POCO binding
46. B) Writing JSON
47. C) Low-allocation, forward-only parsing of raw JSON bytes (*)
48. D) Schema validation
49. Explanation: `Utf8JsonReader` is a struct that walks UTF-8 JSON bytes with near-zero allocation; pair with `Utf8JsonWriter` for ultra-fast low-level scenarios, or use `JsonSerializer` for POCO binding.
50. Q8: `MemoryMappedFile` is useful for…
51. A) Streaming network responses
52. B) Serializing JSON
53. C) Compressing files
54. D) Random access to huge files without explicit reads (*)
55. Explanation: A memory-mapped file maps a file into the process address space, letting you read/write any offset via pointers/spans without explicit IO calls — ideal for huge databases or asset bundles.
56. Q9: `File.ReadAllLines` on a 10GB file…
57. A) Loads every line into a string[] — likely OOM (*)
58. B) Streams lazily
59. C) Throws immediately
60. D) Is async by default
61. Explanation: `ReadAllLines` allocates a `string[]` of every line; a 10GB file would attempt to allocate gigabytes of strings and likely OOM. Use `File.ReadLines` (lazy) or stream chunked.
62. Q10: `await using` (C# 8) is for…
63. A) IDisposable
64. B) IAsyncDisposable (async cleanup like FileStream with useAsync:true) (*)
65. C) All streams
66. D) Only HttpClient
67. Explanation: `await using` calls `DisposeAsync` on `IAsyncDisposable` types, which can flush and close asynchronously without blocking a thread — important for high-throughput async file/network streams.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`File.ReadLines(path)` returns…"
  options:
    - IEnumerable<string> (lazy, streamed)
    - string[] (eager, whole file in memory)
    - a Task<string>
    - a byte[]
  correctIndex: 0
  explanation: "`ReadLines` is lazy — it yields one line at a time as you enumerate, keeping memory low for huge files; `ReadAllLines` returns an eager `string[]`."
- id: q2
  question: "`using var fs = new FileStream(...);` disposes the stream…"
  options:
    - Never
    - At end of the enclosing scope (C# 8 using declaration)
    - Only on exception
    - Manually via GC.Collect
  correctIndex: 1
  explanation: A `using` declaration scopes the resource to the end of the enclosing block, emitting a try/finally that calls Dispose; `await using` is the async variant for IAsyncDisposable.
- id: q3
  question: Which is the modern default JSON serializer for new .NET code?
  options:
    - Newtonsoft.Json
    - DataContractJsonSerializer
    - System.Text.Json
    - JavaScriptSerializer
  correctIndex: 2
  explanation: System.Text.Json is UTF-8 native, async-first, allocation-aware, and source-generator-friendly; it ships in the BCL. Use Newtonsoft only if you need its specific features.
- id: q4
  question: Source-generated JSON (`JsonSerializerContext`)…
  options:
    - Uses reflection at runtime
    - Cannot serialize custom types
    - Is slower than reflective serialization
    - Eliminates runtime reflection, enabling Native AOT and trimming
  correctIndex: 3
  explanation: A source generator emits serialization code at compile time for types in `[JsonSerializable]`, removing runtime reflection — faster startup, no trim warnings, AOT-compatible.
- id: q5
  question: Forgetting to dispose a FileStream…
  options:
    - Leaks a file handle (and may lock the file on Windows) until GC finalizes it
    - Has no effect
    - Throws immediately
    - Closes the file automatically
  correctIndex: 0
  explanation: An undisposed FileStream relies on finalization to release the OS handle — slow and unreliable; on Windows the file may stay locked. Always use `using`/`await using`.
- id: q6
  question: "`Newtonsoft.Json` with `TypeNameHandling.All` is a security risk because…"
  options:
    - It is slow
    - It enables polymorphic deserialization, a known RCE vector
    - It does not support UTF-8
    - It throws on null
  correctIndex: 1
  explanation: "`TypeNameHandling.All` lets the JSON payload specify the .NET type to instantiate, allowing an attacker to inject dangerous types (e.g., `ObjectDataProvider`); System.Text.Json refuses this by default."
- id: q7
  question: "`Utf8JsonReader` is best for…"
  options:
    - High-level POCO binding
    - Writing JSON
    - Low-allocation, forward-only parsing of raw JSON bytes
    - Schema validation
  correctIndex: 2
  explanation: "`Utf8JsonReader` is a struct that walks UTF-8 JSON bytes with near-zero allocation; pair with `Utf8JsonWriter` for ultra-fast low-level scenarios, or use `JsonSerializer` for POCO binding."
- id: q8
  question: "`MemoryMappedFile` is useful for…"
  options:
    - Streaming network responses
    - Serializing JSON
    - Compressing files
    - Random access to huge files without explicit reads
  correctIndex: 3
  explanation: A memory-mapped file maps a file into the process address space, letting you read/write any offset via pointers/spans without explicit IO calls — ideal for huge databases or asset bundles.
- id: q9
  question: "`File.ReadAllLines` on a 10GB file…"
  options:
    - Loads every line into a string[] — likely OOM
    - Streams lazily
    - Throws immediately
    - Is async by default
  correctIndex: 0
  explanation: "`ReadAllLines` allocates a `string[]` of every line; a 10GB file would attempt to allocate gigabytes of strings and likely OOM. Use `File.ReadLines` (lazy) or stream chunked."
- id: q10
  question: "`await using` (C# 8) is for…"
  options:
    - IDisposable
    - IAsyncDisposable (async cleanup like FileStream with useAsync:true)
    - All streams
    - Only HttpClient
  correctIndex: 1
  explanation: "`await using` calls `DisposeAsync` on `IAsyncDisposable` types, which can flush and close asynchronously without blocking a thread — important for high-throughput async file/network streams."
```

