---
slug: java-jvm-internals-memory-model-gc-classloading
id: java-17
track: java
order: 17
title: JVM Internals — Memory Model, GC, Classloading
description: Understand the JVM memory areas (heap, metaspace, stack, code cache), garbage collector families (Serial, Parallel, G1, ZGC), classloading, and the JIT compilers.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=19200s
whyItMatters: Understand the JVM memory areas (heap, metaspace, stack, code cache), garbage collector families (Serial, Parallel, G1, ZGC), classloading, and the JIT compilers.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# JVM Internals — Memory Model, GC, Classloading

## JVM Internals — Memory Model, GC, Classloading

### Why It Matters

Understand the JVM memory areas (heap, metaspace, stack, code cache), garbage collector families (Serial, Parallel, G1, ZGC), classloading, and the JIT compilers.

Understand the JVM memory areas (heap, metaspace, stack, code cache), garbage collector families (Serial, Parallel, G1, ZGC), classloading, and the JIT compilers.

### Prerequisites

- Stage 16: Networking — Sockets, HTTP Client.
- A working understanding of threads, I/O, and exceptions.

### Topics

- JVM memory areas: heap, metaspace (was permgen), stack, pc register, native stack, code cache
- Heap generations: young (Eden, S0, S1), old/tenured, and object aging
- Garbage collectors: Serial, Parallel, G1, ZGC, Shenandoah
- GC basics: roots, marking, sweeping, compaction
- Classloading: bootstrap, platform, application, custom classloaders
- The parent-delegation model and when to break it
- JIT compilers: C1 (client), C2 (server), Graal
- Diagnostic tools: jstack, jmap, jcmd, JFR, async-profiler

### Key Concepts

- The JVM heap is divided into generations because most objects die young (the weak generational hypothesis).
- Metaspace replaced permgen in Java 8; class metadata lives in native memory and grows as needed.
- G1 (default since Java 9) partitions the heap into regions and collects the regions with the most garbage first.
- ZGC and Shenandoah are concurrent compacting collectors that pause for sub-millisecond even on multi-TB heaps.
- Classloaders form a hierarchy with parent-delegation: a classloader asks its parent first, breaking the model only when needed (e.g., hot-reload, SPI).

```bash
# Print GC info on every collection
java -Xlog:gc*:file=gc.log -Xms2g -Xmx2g -XX:+UseG1GC -jar app.jar

# Heap histogram (top 20 classes by shallow size)
jcmd <pid> GC.class_histogram | head -25

# Heap dump
jcmd <pid> GC.heap_dump /tmp/heap.hprof
```
Caption: Inspecting memory and GC

### Common Pitfalls

- Tuning GC without measuring — never change -Xmx, -XX:MaxGCPauseMillis, or collector without before/after JFR recordings.
- Calling `System.gc()` in production code — at best a hint, often a full-GC pause; the JIT/GC know better than your code.
- Holding references too long in caches — soft/weak references help, but a poorly-bounded cache causes OOMs; size with Caffeine.
- Custom classloaders that break parent-delegation without need — class identity issues (ClassCastException when "same" class is loaded twice); prefer the standard model.
- Misreading a heap dump — shallow vs retained size; "retained" is what would be freed by collecting that object's dominator tree.

### Real-World Applications

- ZGC (originally from Oracle, production-ready in Java 15) is used at Twitter, LinkedIn, and Alibaba for sub-millisecond pauses on multi-TB heaps.
- Shenandoah (Red Hat) is the default low-pause collector in OpenJDK builds from Red Hat and is used in large-scale enterprise services.
- Tomcat's WebappClassLoader breaks parent-delegation for servlet spec compliance, enabling hot redeploy of web apps without restarting the JVM.
- IntelliJ's plugin system uses custom classloaders to isolate plugins, allowing per-plugin unload/reload during development.

### Interview Questions

- 1. What are the JVM memory areas? — Heap (objects), metaspace (class metadata, native), stack (frames per method), PC register, native stack, code cache (JIT output).
- 2. What replaced permgen and why? — Metaspace (Java 8) replaced permgen; it lives in native memory and grows on demand, removing the dreaded "OutOfMemoryError: PermGen space."
- 3. What is the parent-delegation model? — A classloader asks its parent to load a class before attempting itself; it prevents spoofing of core classes and avoids duplicate loading.
- 4. What is the difference between C1 and C2 compilers? — C1 (client) compiles fast with simple optimizations; C2 (server) compiles slower with aggressive optimizations (escape analysis, inlining).
- 5. How does G1 differ from Parallel GC? — G1 partitions the heap into regions and collects the most-garbage-rich regions first (incremental), targeting pause times; Parallel collects the whole young/old generation in one go.

### Mini Project

Build a GC Monitor: Attach to a running JVM via JFR or jcmd, sample GC events over 60 seconds, and print a report (pause count, total pause time, max pause, throughput %). Suggested approach:
  - Use `jcmd <pid> JFR.start duration=60s filename=/tmp/rec.jfr`
  - Parse the JFR file with the jdk.jfr API (`RecordingFile.readAllEvents`)
  - Filter for `jdk.GarbageCollection` events
  - Compute total/avg/max pause and percentage of wall clock
  - Print a summary table

### Exercises

1. Run a small app with `-Xlog:gc*` and identify the young vs old generation collections in the output.
2. Compare G1 vs ZGC by running the same app under both: `-XX:+UseG1GC` vs `-XX:+UseZGC`; record pause times with `-Xlog:safepoint`.
3. Trigger an OOM with `new byte[Integer.MAX_VALUE]`; capture a heap dump with `-XX:+HeapDumpOnOutOfMemoryError` and open it in VisualVM or Eclipse MAT.
4. Write a custom classloader that loads a class from a directory; load the same class with the system loader and confirm they are not `==`.
5. Profile a CPU-bound loop with `jcmd <pid> Thread.print` and `async-profiler`; identify the hot method.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What replaced permgen in Java 8?
9. A) Metaspace (*)
10. B) The heap
11. C) The stack
12. D) The code cache
13. Explanation: Metaspace (Java 8) replaced permgen; it stores class metadata in native memory, growing on demand, eliminating "OutOfMemoryError: PermGen space."
14. Q2: Which GC is the default since Java 9?
15. A) Serial
16. B) G1 (*)
17. C) Parallel
18. D) ZGC
19. Explanation: G1 became the default in Java 9 (JEP 248). It partitions the heap into regions and targets pause times by collecting the most garbage-rich regions.
20. Q3: The "weak generational hypothesis" states that?
21. A) All objects live forever
22. B) Old objects are always large
23. C) Most objects die young, so generational GCs are efficient (*)
24. D) GC pauses are zero
25. Explanation: Empirically, most objects become unreachable quickly; generational GCs exploit this by collecting the young generation frequently and cheaply.
26. Q4: ZGC and Shenandoah are notable for?
27. A) Single-threaded collection
28. B) Never collecting the old generation
29. C) Being deprecated
30. D) Sub-millisecond pauses even on multi-TB heaps (*)
31. Explanation: ZGC (Oracle) and Shenandoah (Red Hat) are concurrent compacting collectors that keep pauses under ~1ms even on terabyte heaps via load barriers / Brooks pointers.
32. Q5: The parent-delegation model means?
33. A) A classloader asks its parent first before attempting to load a class (*)
34. B) Each classloader loads independently
35. C) Children delegate to children
36. D) Parents bypass children
37. Explanation: Parent-delegation: a classloader asks its parent (ultimately the bootstrap loader) to load the class first; only if the parent fails does it try itself. Prevents spoofing of core classes.
38. Q6: C1 vs C2 JIT compilers — which compiles slower but optimizes more aggressively?
39. A) C1
40. B) C2 (*)
41. C) They are identical
42. D) Neither is a JIT
43. Explanation: C1 (client) compiles fast with limited optimization; C2 (server) compiles slower but applies aggressive optimizations like escape analysis and aggressive inlining.
44. Q7: `System.gc()` is?
45. A) Guaranteed to run GC immediately
46. B) Required by the JLS to free memory
47. C) A hint; the JVM may ignore it (*)
48. D) Removed in Java 17
49. Explanation: System.gc() is a hint; -XX:+DisableExplicitGC makes the JVM ignore it. Calling it in production is a smell — the GC knows better than application code.
50. Q8: A heap dump (.hprof) shows?
51. A) Live CPU samples
52. B) JIT compilation logs
53. C) Classloader hierarchy only
54. D) Object instances, references, and shallow/retained sizes (*)
55. Explanation: Heap dumps capture the live object graph at dump time; tools like Eclipse MAT and VisualVM let you inspect dominator trees, query paths to GC roots, and find leaks.
56. Q9: Java Flight Recorder (JFR) is?
57. A) A profiling tool built into the JDK with low overhead (*)
58. B) A screen recorder
59. C) A network packet capture tool
60. D) A third-party profiler
61. Explanation: JFR is built into OpenJDK (since 11) and collects JVM/application events with <1% overhead. Analyze recordings with jcmd, JMC, or the jdk.jfr API.
62. Q10: The code cache stores?
63. A) Java source code
64. B) Compiled (JIT) native code generated by the JVM (*)
65. C) Class metadata
66. D) Constants from final fields
67. Explanation: The code cache holds the native code emitted by the JIT compilers (C1/C2/Graal). A "CodeCache is full" warning means the JIT ran out of space to compile more methods.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What replaced permgen in Java 8?
  options:
    - Metaspace
    - The heap
    - The stack
    - The code cache
  correctIndex: 0
  explanation: 'Metaspace (Java 8) replaced permgen; it stores class metadata in native memory, growing on demand, eliminating "OutOfMemoryError: PermGen space."'
- id: q2
  question: Which GC is the default since Java 9?
  options:
    - Serial
    - G1
    - Parallel
    - ZGC
  correctIndex: 1
  explanation: G1 became the default in Java 9 (JEP 248). It partitions the heap into regions and targets pause times by collecting the most garbage-rich regions.
- id: q3
  question: The "weak generational hypothesis" states that?
  options:
    - All objects live forever
    - Old objects are always large
    - Most objects die young, so generational GCs are efficient
    - GC pauses are zero
  correctIndex: 2
  explanation: Empirically, most objects become unreachable quickly; generational GCs exploit this by collecting the young generation frequently and cheaply.
- id: q4
  question: ZGC and Shenandoah are notable for?
  options:
    - Single-threaded collection
    - Never collecting the old generation
    - Being deprecated
    - Sub-millisecond pauses even on multi-TB heaps
  correctIndex: 3
  explanation: ZGC (Oracle) and Shenandoah (Red Hat) are concurrent compacting collectors that keep pauses under ~1ms even on terabyte heaps via load barriers / Brooks pointers.
- id: q5
  question: The parent-delegation model means?
  options:
    - A classloader asks its parent first before attempting to load a class
    - Each classloader loads independently
    - Children delegate to children
    - Parents bypass children
  correctIndex: 0
  explanation: "Parent-delegation: a classloader asks its parent (ultimately the bootstrap loader) to load the class first; only if the parent fails does it try itself. Prevents spoofing of core classes."
- id: q6
  question: C1 vs C2 JIT compilers — which compiles slower but optimizes more aggressively?
  options:
    - C1
    - C2
    - They are identical
    - Neither is a JIT
  correctIndex: 1
  explanation: C1 (client) compiles fast with limited optimization; C2 (server) compiles slower but applies aggressive optimizations like escape analysis and aggressive inlining.
- id: q7
  question: "`System.gc()` is?"
  options:
    - Guaranteed to run GC immediately
    - Required by the JLS to free memory
    - A hint; the JVM may ignore it
    - Removed in Java 17
  correctIndex: 2
  explanation: System.gc() is a hint; -XX:+DisableExplicitGC makes the JVM ignore it. Calling it in production is a smell — the GC knows better than application code.
- id: q8
  question: A heap dump (.hprof) shows?
  options:
    - Live CPU samples
    - JIT compilation logs
    - Classloader hierarchy only
    - Object instances, references, and shallow/retained sizes
  correctIndex: 3
  explanation: Heap dumps capture the live object graph at dump time; tools like Eclipse MAT and VisualVM let you inspect dominator trees, query paths to GC roots, and find leaks.
- id: q9
  question: Java Flight Recorder (JFR) is?
  options:
    - is?
    - A profiling tool built into the JDK with low overhead
    - A screen recorder
    - A network packet capture tool
    - A third-party profiler
  correctIndex: 1
  explanation: JFR is built into OpenJDK (since 11) and collects JVM/application events with <1% overhead. Analyze recordings with jcmd, JMC, or the jdk.jfr API.
- id: q10
  question: The code cache stores?
  options:
    - Java source code
    - Compiled (JIT) native code generated by the JVM
    - Class metadata
    - Constants from final fields
  correctIndex: 1
  explanation: The code cache holds the native code emitted by the JIT compilers (C1/C2/Graal). A "CodeCache is full" warning means the JIT ran out of space to compile more methods.
```

