---
slug: csharp-memory-gc-idisposable-span-t-memory-t
id: csharp-15
track: csharp
order: 15
title: Memory — GC, IDisposable, Span<T>, Memory<T>
description: Understand the generational GC and finalizer lifecycle, implement IDisposable correctly (with the dispose pattern), and use Span<T>/Memory<T>/stackalloc for allocation-free hot paths.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=14000s
whyItMatters: Understand the generational GC and finalizer lifecycle, implement IDisposable correctly (with the dispose pattern), and use Span<T>/Memory<T>/stackalloc for allocation-free hot paths.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Memory — GC, IDisposable, Span<T>, Memory<T>

## Memory — GC, IDisposable, Span<T>, Memory<T>

### Why It Matters

Understand the generational GC and finalizer lifecycle, implement IDisposable correctly (with the dispose pattern), and use Span<T>/Memory<T>/stackalloc for allocation-free hot paths.

Understand the generational GC and finalizer lifecycle, implement IDisposable correctly (with the dispose pattern), and use Span<T>/Memory<T>/stackalloc for allocation-free hot paths.

### Prerequisites

- Stage 13: File I/O, Streams (IDisposable).
- Stage 14: Reflection (for attribute-based cleanup).
- Stage 2: Value vs reference types.

### Topics

- GC generations (0, 1, 2, LOH, POH), background GC, server vs workstation
- Finalizers, `~T()`, and the finalizer thread
- IDisposable, the dispose pattern, `Dispose(disposing: bool)`
- `using` and `await using`, `SafeHandle` for handles
- Span<T>, ReadOnlySpan<T>, Memory<T>, ReadOnlyMemory<T>
- `stackalloc`, `Span<T>` from arrays, `MemoryMarshal`, `fixed`/`pin`
- `ArrayPool<T>.Shared` for rented buffers
- `GC.AllocateUninitializedArray`, `NativeMemory.Alloc` (advanced)

### Key Concepts

- The .NET GC is generational: Gen 0 (short-lived, collected often), Gen 1 (buffer), Gen 2 (long-lived, expensive to collect), LOH (≥85KB objects, no compaction by default).
- Finalizers run on a single finalizer thread after GC; ordering is not guaranteed; they delay reclamation (object survives to next GC). Prefer `SafeHandle` and `IDisposable` over finalizers.
- The dispose pattern: `Dispose(bool disposing)` is called from `Dispose()` (true, managed + unmanaged) and from the finalizer (false, unmanaged only); `GC.SuppressFinalize(this)` in Dispose().
- `Span<T>` is a stack-only ref struct over a contiguous buffer (array, string, stackalloc, native); it enables slicing and parsing with zero allocation.
- `Memory<T>` is the heap-able sibling of `Span<T>` (can be stored in fields, await across); use when you need to pass the buffer across async boundaries.

```csharp
public sealed class FileWriter : IDisposable
{
    private StreamWriter? _writer;
    public FileWriter(string path) => _writer = new StreamWriter(path);
    public void Write(string s) => _writer!.WriteLine(s);

    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
    private void Dispose(bool disposing)
    {
        if (disposing) _writer?.Dispose();   // free managed
        // no unmanaged resources here (SafeHandle would handle them)
    }
}
```
Caption: Dispose pattern

### Common Pitfalls

- Forgetting `GC.SuppressFinalize(this)` in Dispose — the object is still on the finalizer queue, surviving an extra GC and running a useless finalizer; always suppress.
- Touching managed objects in a finalizer — finalization order is not guaranteed, so a finalizer may access a field whose own finalizer has already run; only free unmanaged resources in the finalizer.
- Storing `Span<T>` in a field or capturing it in a lambda — `Span<T>` is a `ref struct` and cannot be boxed, captured, or stored on the heap; use `Memory<T>` for cross-boundary scenarios.
- Not returning rented buffers to `ArrayPool<T>` — the pool grows but never shrinks; a missing `Return` leaks memory and defeats the pool's purpose.
- Using `IDisposable` for managed-only resources with a finalizer — finalizers add GC pressure and are useless for managed resources (the GC handles them); only add a finalizer if you own unmanaged resources.

### Real-World Applications

- ASP.NET Core's Kestrel uses `ArrayPool<byte>.Shared` and `System.IO.Pipelines` to process HTTP requests with near-zero allocation per request — Stack Overflow runs on this stack.
- The `System.Text.Json.Utf8JsonReader` takes a `ReadOnlySpan<byte>` and parses JSON without allocating strings until you explicitly call `GetString()`.
- Unity's `NativeArray<T>` and Burst compiler use `Span<T>`-like patterns to expose managed C# to native SIMD code with zero marshaling.
- The .NET BCL `string.IndexOf` and `MemoryExtensions` use `Span<char>` internally; the entire string-processing stack is span-based in .NET 8.

### Interview Questions

- 1. What are GC generations and why? — Gen 0/1/2 with the generational hypothesis (new objects die young); collecting Gen 0 often is cheap, deferring expensive Gen 2 collections.
- 2. What is the dispose pattern and why is `Dispose(bool disposing)` parameterized? — `Dispose(true)` from `Dispose()` frees managed + unmanaged; `Dispose(false)` from the finalizer frees only unmanaged (managed objects may already be finalized).
- 3. Why can't `Span<T>` be stored in a field or captured in a lambda? — It's a `ref struct` (stack-only) to guarantee it doesn't outlive its underlying buffer; the compiler enforces this, preventing use-after-free.
- 4. What is `ArrayPool<T>.Shared` for? — Renting and returning large buffers across the app, avoiding per-call allocation and GC pressure for transient buffers (e.g., HTTP read buffers).
- 5. Why prefer `SafeHandle` over a finalizer for unmanaged resources? — SafeHandle ensures the handle is released exactly once even under async exceptions and AppDomain unloads; finalizers are unreliable and run on a single thread.

### Mini Project

Build a Zero-Allocation CSV Parser: A `CsvReader` that yields `ReadOnlySpan<char>` fields per row from a memory-mapped file, using `Span<T>` slicing and `stackalloc` for field delimiters, with `ArrayPool<char>` for large rows. Suggested approach:
  - Open the file with `MemoryMappedFile.CreateFromFile`
  - Get a `MemoryMappedViewAccessor` and read into a rented `byte[]`
  - Slice `ReadOnlySpan<byte>` on the newline (0x0A) and comma (0x2C) bytes
  - Yield `CsvRow` containing start offsets + lengths (no string allocation)
  - Convert to strings only when the caller calls `row.GetString(i)`

### Exercises

1. Implement the full dispose pattern on a class wrapping a `FileStream` (managed) and a hypothetically-owned `IntPtr` (unmanaged); call `GC.SuppressFinalize`.
2. Use `stackalloc int[100]` to compute primes with a Sieve of Eratosthenes — no heap allocation.
3. Rent a `byte[]` from `ArrayPool<byte>.Shared`, fill it, return it; verify with `dotnet-counters` that GC allocations stay near zero across 100k iterations.
4. Slice a `ReadOnlySpan<char>` from a string and pass it to `int.TryParse` (which accepts `ReadOnlySpan<char>`) — confirm no allocation.
5. Force GC and watch the finalizer order: create 100 objects with finalizers that log, call `GC.Collect()`, and observe the order is not construction order.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: The .NET GC is generational with which generations?
9. A) Young and Old only
10. B) A single generation
11. C) Gen 0, Gen 1, Gen 2 (plus Large Object Heap) (*)
12. D) Gen 0 through Gen 9
13. Explanation: The managed heap is split into Gen 0 (short-lived), Gen 1 (buffer), Gen 2 (long-lived), and the Large Object Heap (≥85KB objects, collected with Gen 2).
14. Q2: `GC.SuppressFinalize(this)` in Dispose()…
15. A) Forces immediate GC
16. B) Finalizes the object now
17. C) Disables the GC
18. D) Removes the object from the finalizer queue (it's already disposed) (*)
19. Explanation: After Dispose frees resources, the finalizer is unnecessary; `SuppressFinalize` removes the object from the finalizer queue, avoiding an extra GC survival and a useless finalizer call.
20. Q3: Why can't `Span<T>` be stored in a field or captured in a lambda?
21. A) It is a ref struct (stack-only) — prevents outliving its buffer (*)
22. B) It is sealed
23. C) It is internal
24. D) It requires unsafe
25. Explanation: `Span<T>` is a `ref struct`; the compiler forbids boxing, field storage, capture in lambdas, or use across async — guaranteeing the span cannot outlive its underlying buffer.
26. Q4: The dispose pattern's `Dispose(bool disposing)` is called with `false` from…
27. A) Dispose()
28. B) The finalizer (*)
29. C) using
30. D) GC.Collect
31. Explanation: The finalizer calls `Dispose(false)` — only unmanaged resources are freed (managed fields may already be finalized). `Dispose()` calls `Dispose(true)` (managed + unmanaged).
32. Q5: Finalizers run on…
33. A) The thread that allocated the object
34. B) The GC thread synchronously
35. C) A single finalizer thread (not guaranteed order) (*)
36. D) Any thread the runtime picks
37. Explanation: Finalization happens on a dedicated finalizer thread after GC; order across objects is not guaranteed, which is why finalizers must not touch other managed objects.
38. Q6: `ArrayPool<T>.Shared.Return(buffer)`…
39. A) Frees the buffer immediately
40. B) Resets the buffer to zero
41. C) Throws if the buffer is in use
42. D) Returns the buffer to the pool for reuse (avoiding future allocations) (*)
43. Explanation: ArrayPool rents and returns buffers; returning makes the buffer available for the next renter, dramatically reducing allocation and GC pressure for transient buffers.
44. Q7: `Memory<T>` differs from `Span<T>` in that…
45. A) Memory<T> can be stored on the heap (fields, async) — Span<T> cannot (*)
46. B) Memory<T> is faster
47. C) Memory<T> is read-only
48. D) Memory<T> requires unsafe
49. Explanation: `Memory<T>` is the heap-compatible sibling of `Span<T>`; it can be stored in fields, captured in lambdas, and awaited across. Call `.Span` to get a Span<T> for synchronous use.
50. Q8: The Large Object Heap (LOH) stores objects…
51. A) Smaller than 1KB
52. B) ≥85,000 bytes (and is not compacted by default) (*)
53. C) Of any size
54. D) Only strings
55. Explanation: The LOH holds objects ≥85KB; it's collected with Gen 2 but not compacted by default, leading to fragmentation; .NET 5+ can compact on demand via `GCSettings.LargeObjectHeapCompactionMode`.
56. Q9: `stackalloc int[100]`…
57. A) Allocates on the GC heap
58. B) Allocates in unmanaged memory
59. C) Allocates on the call stack (no GC pressure) (*)
60. D) Is illegal in safe code
61. Explanation: `stackalloc` allocates a block on the call stack; it's freed automatically when the method returns. It's perfect for small, short-lived buffers and avoids GC pressure.
62. Q10: SafeHandle is preferred over a finalizer for unmanaged resources because…
63. A) It is faster
64. B) It does not require IDisposable
65. C) It is automatic
66. D) It guarantees single-release even under async exceptions and AppDomain unloads (*)
67. Explanation: SafeHandle uses a critical finalizer and reference counting to ensure the unmanaged handle is released exactly once, even if the constructor or Dispose throws or the runtime shuts down; finalizers are unreliable for this.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: The .NET GC is generational with which generations?
  options:
    - Young and Old only
    - A single generation
    - Gen 0, Gen 1, Gen 2 (plus Large Object Heap)
    - Gen 0 through Gen 9
  correctIndex: 2
  explanation: The managed heap is split into Gen 0 (short-lived), Gen 1 (buffer), Gen 2 (long-lived), and the Large Object Heap (≥85KB objects, collected with Gen 2).
- id: q2
  question: "`GC.SuppressFinalize(this)` in Dispose()…"
  options:
    - Forces immediate GC
    - Finalizes the object now
    - Disables the GC
    - Removes the object from the finalizer queue (it's already disposed)
  correctIndex: 3
  explanation: After Dispose frees resources, the finalizer is unnecessary; `SuppressFinalize` removes the object from the finalizer queue, avoiding an extra GC survival and a useless finalizer call.
- id: q3
  question: Why can't `Span<T>` be stored in a field or captured in a lambda?
  options:
    - It is a ref struct (stack-only) — prevents outliving its buffer
    - It is sealed
    - It is internal
    - It requires unsafe
  correctIndex: 0
  explanation: "`Span<T>` is a `ref struct`; the compiler forbids boxing, field storage, capture in lambdas, or use across async — guaranteeing the span cannot outlive its underlying buffer."
- id: q4
  question: The dispose pattern's `Dispose(bool disposing)` is called with `false` from…
  options:
    - Dispose()
    - The finalizer
    - using
    - GC.Collect
  correctIndex: 1
  explanation: The finalizer calls `Dispose(false)` — only unmanaged resources are freed (managed fields may already be finalized). `Dispose()` calls `Dispose(true)` (managed + unmanaged).
- id: q5
  question: Finalizers run on…
  options:
    - The thread that allocated the object
    - The GC thread synchronously
    - A single finalizer thread (not guaranteed order)
    - Any thread the runtime picks
  correctIndex: 2
  explanation: Finalization happens on a dedicated finalizer thread after GC; order across objects is not guaranteed, which is why finalizers must not touch other managed objects.
- id: q6
  question: "`ArrayPool<T>.Shared.Return(buffer)`…"
  options:
    - Frees the buffer immediately
    - Resets the buffer to zero
    - Throws if the buffer is in use
    - Returns the buffer to the pool for reuse (avoiding future allocations)
  correctIndex: 3
  explanation: ArrayPool rents and returns buffers; returning makes the buffer available for the next renter, dramatically reducing allocation and GC pressure for transient buffers.
- id: q7
  question: "`Memory<T>` differs from `Span<T>` in that…"
  options:
    - Memory<T> can be stored on the heap (fields, async) — Span<T> cannot
    - Memory<T> is faster
    - Memory<T> is read-only
    - Memory<T> requires unsafe
  correctIndex: 0
  explanation: "`Memory<T>` is the heap-compatible sibling of `Span<T>`; it can be stored in fields, captured in lambdas, and awaited across. Call `.Span` to get a Span<T> for synchronous use."
- id: q8
  question: The Large Object Heap (LOH) stores objects…
  options:
    - stores objects…
    - Smaller than 1KB
    - ≥85,000 bytes (and is not compacted by default)
    - Of any size
    - Only strings
  correctIndex: 2
  explanation: The LOH holds objects ≥85KB; it's collected with Gen 2 but not compacted by default, leading to fragmentation; .NET 5+ can compact on demand via `GCSettings.LargeObjectHeapCompactionMode`.
- id: q9
  question: "`stackalloc int[100]`…"
  options:
    - Allocates on the GC heap
    - Allocates in unmanaged memory
    - Allocates on the call stack (no GC pressure)
    - Is illegal in safe code
  correctIndex: 2
  explanation: "`stackalloc` allocates a block on the call stack; it's freed automatically when the method returns. It's perfect for small, short-lived buffers and avoids GC pressure."
- id: q10
  question: SafeHandle is preferred over a finalizer for unmanaged resources because…
  options:
    - It is faster
    - It does not require IDisposable
    - It is automatic
    - It guarantees single-release even under async exceptions and AppDomain unloads
  correctIndex: 3
  explanation: SafeHandle uses a critical finalizer and reference counting to ensure the unmanaged handle is released exactly once, even if the constructor or Dispose throws or the runtime shuts down; finalizers are unreliable for this.
```

