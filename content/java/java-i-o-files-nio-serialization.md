---
slug: java-i-o-files-nio-serialization
id: java-12
track: java
order: 12
title: I/O — Files, NIO, and Serialization
description: Read and write files with java.nio.file, work with byte and character streams, understand path manipulation, and learn why Java serialization is being deprecated.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=13200s
whyItMatters: Read and write files with java. nio.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# I/O — Files, NIO, and Serialization

## I/O — Files, NIO, and Serialization

### Why It Matters

Read and write files with java. nio.

Read and write files with java.nio.file, work with byte and character streams, understand path manipulation, and learn why Java serialization is being deprecated.

### Prerequisites

- Stage 11: Streams and Lambda Expressions.
- Comfort with try-with-resources and the basics of byte/char streams.

### Topics

- The legacy java.io (File, InputStream, OutputStream, Reader, Writer)
- The modern java.nio.file (Path, Files, FileSystem)
- Reading and writing text and bytes with `Files.readString`, `Files.lines`, `Files.write`
- Buffered I/O and why it matters
- Path manipulation: resolve, relativize, normalize, toAbsolutePath
- Walking file trees with `Files.walk` and `SimpleFileVisitor`
- WatchService for directory change notifications
- Java serialization, its risks, and alternatives (JSON, protobuf)

### Key Concepts

- `java.io.File` is legacy; `java.nio.file.Path` is the modern replacement with richer operations and better platform behavior.
- `Files.lines` returns a Stream backed by an open file — must be closed (try-with-resources) to avoid leaking file handles.
- BufferedReader/BufferedWriter dramatically reduce I/O syscalls; unbuffered reads of one byte at a time are catastrophic.
- Java serialization (`ObjectOutputStream`) is being deprecated (JEP 154) due to security risks; prefer JSON, protobuf, or external serialization.
- Path operations are platform-aware: `Paths.get` uses the default file system's separator (`/` on Unix, `\` on Windows).

```java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

// Read all bytes/lines
String text = Files.readString(Path.of("config.yaml"));
List<String> lines = Files.readAllLines(Path.of("data.csv"));

// Stream lines (must close)
try (var stream = Files.lines(Path.of("big.log"))) {
    stream.filter(l -> l.contains("ERROR")).forEach(System.out::println);
}

// Write
Files.writeString(Path.of("out.txt"), "hello", StandardCharsets.UTF_8);
Files.write(Path.of("nums.bin"), new byte[]{1, 2, 3});
```
Caption: Modern file I/O

### Common Pitfalls

- Forgetting to close `Files.lines` — leaks file handles; always wrap in try-with-resources.
- Reading bytes one at a time without buffering — kills throughput; wrap in BufferedInputStream or use `Files.readAllBytes`.
- Assuming the default charset is UTF-8 — it isn't on Windows (often windows-1252); always pass `StandardCharsets.UTF_8` explicitly.
- Using Java serialization for long-term storage — the format is brittle, insecure, and being deprecated; use JSON (Jackson), protobuf, or Avro.
- Confusing `Path.resolve` with `Path.of` semantics — `resolve` joins paths (anchoring relative to the receiver); `Path.of` parses a string into a Path.

### Real-World Applications

- Apache Hadoop's HDFS client is built on a FileSystem abstraction layered over java.nio.file concepts (with Hadoop-specific Path and FileSystem classes).
- IntelliJ's project model uses `Files.walk` and `WatchService` to track source changes and trigger incremental compilation.
- Spring Boot's static-resource serving uses java.nio.file to read classpath and filesystem resources uniformly via Resource abstractions.
- Cassandra's SSTable readers use memory-mapped NIO channels (FileChannel + MappedByteBuffer) for sub-millisecond key lookups.

### Interview Questions

- 1. What's the difference between java.io.File and java.nio.file.Path? — File is legacy, has fewer operations, and behaves inconsistently across platforms; Path is modern, composable, and integrates with FileSystem.
- 2. Why must `Files.lines` be closed? — It returns a Stream backed by an open file; failing to close leaks file descriptors and may exhaust the OS limit.
- 3. What is the default charset and is it always UTF-8? — No; it depends on the OS/locale (windows-1252 on many Windows installs). Always pass StandardCharsets.UTF_8 explicitly.
- 4. Why is Java serialization being deprecated? — It's a security risk (deserialization gadgets enabled many CVEs) and brittle across versions; JEP 154 deprecates it for removal.
- 5. What does `transient` mean? — A field marked transient is skipped by the default serialization mechanism (e.g., for sensitive or non-serializable fields).

### Mini Project

Build a Recursive File Finder: Walk a directory tree, find files matching a glob, and report counts by extension. Use Files.walk and PathMatcher. Suggested approach:
  - Parse argv for root dir and glob pattern (`**/*.java`)
  - Use `FileSystems.getDefault().getPathMatcher("glob:" + pattern)`
  - Stream the tree with `Files.walk(Path.of(root))` in try-with-resources
  - Filter with `pathMatcher::matches` and group by extension via Collectors.groupingBy
  - Print a sorted report of extension -> count

### Exercises

1. Read a 100MB file with `Files.readAllBytes` vs `Files.lines`; compare memory usage and explain when each is appropriate.
2. Use `Path.resolve`, `normalize`, `relativize`, and `toAbsolutePath` on a few example paths; print the results and verify against your mental model.
3. Build a `Files.walkFileTree` visitor that deletes a directory tree recursively (handle IOException in visitFileFailed).
4. Serialize a small object with `ObjectOutputStream`, then deserialize and confirm field values; mark a field transient and confirm it's null after deserialization.
5. Read a CSV file with `Files.lines` and `stream.skip(1)` to skip the header; parse each row and collect into a List<record>.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which class is the modern replacement for `java.io.File`?
9. A) java.io.RandomAccessFile
10. B) java.nio.ByteBuffer
11. C) java.io.FileReader
12. D) java.nio.file.Path (*)
13. Explanation: java.nio.file.Path (Java 7) replaces java.io.File with richer operations, better platform behavior, and integration with FileSystem.
14. Q2: `Files.lines(path)` returns a Stream that?
15. A) Holds an open file handle and must be closed in try-with-resources (*)
16. B) Is auto-closing
17. C) Buffers the whole file in memory
18. D) Cannot be filtered
19. Explanation: Files.lines streams lazily but keeps the file open; you must close it (usually via try-with-resources) to avoid leaking file descriptors.
20. Q3: The default charset on a typical Windows install is often?
21. A) UTF-8
22. B) windows-1252 (*)
23. C) UTF-16
24. D) ASCII
25. Explanation: Default charset depends on OS locale; many Windows installs use windows-1252 (or GBK in CN). Always pass StandardCharsets.UTF_8 explicitly.
26. Q4: Reading one byte at a time without buffering is slow because?
27. A) The JVM refuses to read single bytes
28. B) Bytes must be UTF-8 decoded
29. C) Each read triggers a syscall; buffering batches them (*)
30. D) Files are sequential-only
31. Explanation: Unbuffered I/O issues a syscall per byte; buffered readers/writers batch operations into a single syscall per buffer fill/flush.
32. Q5: Java serialization is being deprecated because?
33. A) It is too slow for any use
34. B) JSON is built into the JDK
35. C) It does not support primitives
36. D) It has been the source of many CVEs and is brittle across versions (*)
37. Explanation: JEP 154 deprecates Java serialization due to deserialization gadget attacks (Equifax, WebLogic, etc.) and version-brittleness; prefer JSON or protobuf.
38. Q6: A field marked `transient` is?
39. A) Skipped by the default serialization mechanism (*)
40. B) Serialized with a default value
41. C) Required to be static
42. D) Required to be final
43. Explanation: transient fields are excluded from the default serialization; on deserialization they take the default value for their type (null, 0, false).
44. Q7: `Path.of("/a").resolve("b")` returns?
45. A) /b
46. B) /a/b (*)
47. C) /a
48. D) b
49. Explanation: `resolve` joins the given path onto the receiver; if the argument is absolute, it returns the argument unchanged.
50. Q8: `Files.walk(path)` returns?
51. A) A list of file names
52. B) A Future<Path[]>
53. C) A Stream<Path> lazily walking the tree (must be closed) (*)
54. D) A Set of paths
55. Explanation: Files.walk lazily streams all paths under the given root (depth-first by default); the underlying directory stream must be closed.
56. Q9: WatchService is used to?
57. A) Watch GC events
58. B) Monitor thread pool sizes
59. C) Profile application startup
60. D) Receive notifications about directory changes (create/modify/delete) (*)
61. Explanation: WatchService (java.nio.file) lets you register directories for create/modify/delete events, useful for hot-reload and build-watch features.
62. Q10: For long-term storage, prefer?
63. A) JSON, protobuf, or Avro (*)
64. B) Java serialization (.ser files)
65. C) Direct memory dumps
66. D) ObjectOutputStream with default settings
67. Explanation: Java serialization is brittle and insecure; structured formats (JSON, protobuf, Avro) are version-tolerant, language-agnostic, and have mature tooling.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which class is the modern replacement for `java.io.File`?
  options:
    - java.io.RandomAccessFile
    - java.nio.ByteBuffer
    - java.io.FileReader
    - java.nio.file.Path
  correctIndex: 3
  explanation: java.nio.file.Path (Java 7) replaces java.io.File with richer operations, better platform behavior, and integration with FileSystem.
- id: q2
  question: "`Files.lines(path)` returns a Stream that?"
  options:
    - Holds an open file handle and must be closed in try-with-resources
    - Is auto-closing
    - Buffers the whole file in memory
    - Cannot be filtered
  correctIndex: 0
  explanation: Files.lines streams lazily but keeps the file open; you must close it (usually via try-with-resources) to avoid leaking file descriptors.
- id: q3
  question: The default charset on a typical Windows install is often?
  options:
    - UTF-8
    - windows-1252
    - UTF-16
    - ASCII
    - . Always pass StandardCharsets.UTF_8 explicitly.
  correctIndex: 1
  explanation: Default charset depends on OS locale; many Windows installs use windows-1252 (or GBK in CN). Always pass StandardCharsets.UTF_8 explicitly.
- id: q4
  question: Reading one byte at a time without buffering is slow because?
  options:
    - The JVM refuses to read single bytes
    - Bytes must be UTF-8 decoded
    - Each read triggers a syscall; buffering batches them
    - Files are sequential-only
  correctIndex: 2
  explanation: Unbuffered I/O issues a syscall per byte; buffered readers/writers batch operations into a single syscall per buffer fill/flush.
- id: q5
  question: Java serialization is being deprecated because?
  options:
    - It is too slow for any use
    - JSON is built into the JDK
    - It does not support primitives
    - It has been the source of many CVEs and is brittle across versions
  correctIndex: 3
  explanation: JEP 154 deprecates Java serialization due to deserialization gadget attacks (Equifax, WebLogic, etc.) and version-brittleness; prefer JSON or protobuf.
- id: q6
  question: A field marked `transient` is?
  options:
    - Skipped by the default serialization mechanism
    - Serialized with a default value
    - Required to be static
    - Required to be final
  correctIndex: 0
  explanation: transient fields are excluded from the default serialization; on deserialization they take the default value for their type (null, 0, false).
- id: q7
  question: '`Path.of("/a").resolve("b")` returns?'
  options:
    - /b
    - /a/b
    - /a
    - b
  correctIndex: 1
  explanation: "`resolve` joins the given path onto the receiver; if the argument is absolute, it returns the argument unchanged."
- id: q8
  question: "`Files.walk(path)` returns?"
  options:
    - A list of file names
    - A Future<Path[]>
    - A Stream<Path> lazily walking the tree (must be closed)
    - A Set of paths
  correctIndex: 2
  explanation: Files.walk lazily streams all paths under the given root (depth-first by default); the underlying directory stream must be closed.
- id: q9
  question: WatchService is used to?
  options:
    - Watch GC events
    - Monitor thread pool sizes
    - Profile application startup
    - Receive notifications about directory changes (create/modify/delete)
  correctIndex: 3
  explanation: WatchService (java.nio.file) lets you register directories for create/modify/delete events, useful for hot-reload and build-watch features.
- id: q10
  question: For long-term storage, prefer?
  options:
    - JSON, protobuf, or Avro
    - Java serialization (.ser files)
    - Direct memory dumps
    - ObjectOutputStream with default settings
  correctIndex: 0
  explanation: Java serialization is brittle and insecure; structured formats (JSON, protobuf, Avro) are version-tolerant, language-agnostic, and have mature tooling.
```

