---
slug: go-channels-unbuffered-buffered-select
id: go-11
track: go
order: 11
title: Channels — Unbuffered, Buffered, Select
description: Master Go's other concurrency primitive — channels. Cover unbuffered vs buffered, send/receive blocking, the select statement, nil channels, and the close-panic rules.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=8000s
whyItMatters: Master Go's other concurrency primitive — channels. Cover unbuffered vs buffered, send/receive blocking, the select statement, nil channels, and the close-panic rules.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Channels — Unbuffered, Buffered, Select

## Channels — Unbuffered, Buffered, Select

### Why It Matters

Master Go's other concurrency primitive — channels. Cover unbuffered vs buffered, send/receive blocking, the select statement, nil channels, and the close-panic rules.

Master Go's other concurrency primitive — channels. Cover unbuffered vs buffered, send/receive blocking, the select statement, nil channels, and the close-panic rules.

### Prerequisites

- Stage 10: Goroutines and the sync Package.
- Comfort with goroutines and sync.Mutex.

### Topics

- Unbuffered channels: `make(chan T)` — synchronous handoff
- Buffered channels: `make(chan T, n)` — asynchronous up to n
- Send, receive, and the comma-ok idiom on receive
- The `for range ch` loop (exits when channel is closed)
- The `select` statement — random selection, default case
- Closing channels and the double-close panic
- Sending on a closed channel panics; receiving returns zero value
- nil channels block forever (useful in select to disable a case)

### Key Concepts

- An unbuffered channel is a synchronous rendezvous: send blocks until a receiver is ready, receive blocks until a sender sends.
- A buffered channel is asynchronous up to capacity: sends block only when full, receives only when empty.
- `close(ch)` marks a channel as closed; receiving from a closed channel returns the zero value with ok=false; sending panics.
- `select` picks one ready case at random; with a `default` it never blocks; without, it blocks until a case is ready.
- A nil channel blocks forever in select; setting a channel to nil effectively disables that case — useful for dynamic select sets.

```go
// Unbuffered: send blocks until received
uc := make(chan int)
go func() { uc <- 42 }()      // blocks until main reads
fmt.Println(<-uc)              // 42

// Buffered: send doesn't block until full
bc := make(chan int, 2)
bc <- 1                       // doesn't block
bc <- 2                       // doesn't block
// bc <- 3                    // would block (buffer full)
fmt.Println(<-bc)             // 1
```
Caption: Unbuffered vs buffered

### Common Pitfalls

- Sending on a closed channel panics — only the sender should close; receivers should never close. Document ownership clearly.
- Closing a channel twice panics — `close(ch)` on an already-closed channel panics; use `sync.Once` or guard with a flag if multiple paths might close.
- Leaking `time.After` in tight select loops — each `time.After(d)` creates a timer that's not garbage collected until it fires; in a hot loop use `time.NewTimer` and `Stop()`.
- Forgetting to close a channel — `for range ch` blocks forever if no one closes; the consumer goroutine leaks.
- Blocking on a send to a full buffered channel — if no consumer drains, senders block forever; consider select-with-default or context cancellation.

### Real-World Applications

- The Go runtime's `time` package uses a single goroutine + channel-based timer heap to deliver all timer ticks — channels are the universal signal.
- gRPC-Go's streaming RPCs are channels-under-the-hood (one per stream) for ordered message delivery.
- HashiCorp's raft implementation uses channels to deliver log entries to followers and to signal commit notifications.
- The Prometheus scrape loop uses a `select` on a tick channel and a context cancel channel to stop cleanly on shutdown.

### Interview Questions

- 1. What's the difference between an unbuffered and a buffered channel? — Unbuffered blocks the sender until a receiver is ready (rendezvous); buffered blocks the sender only when the buffer is full.
- 2. Who should close a channel? — The sender, never the receiver. Closing signals "no more values"; multiple senders should coordinate via a separate "done" channel or context.
- 3. What happens when you send on a closed channel? — Panic ("send on closed channel"). What happens when you receive on a closed channel? — You get the zero value with ok=false, repeatedly.
- 4. How does select choose among multiple ready cases? — Randomly; this prevents starvation. With a `default` clause, select is non-blocking.
- 5. Why does `time.After` leak in a tight loop? — Each call schedules a timer that the runtime holds until it fires; in a hot loop this accumulates timers and memory. Use `time.NewTimer` + `Stop()`.

### Mini Project

Build a Rate-Limited Job Dispatcher: A worker pool that consumes jobs from a channel, processes them with a configurable concurrency limit, and gracefully shuts down on context cancellation — draining in-flight jobs before exiting. Suggested approach:
  - `jobs := make(chan Job)` and `results := make(chan Result, N)`
  - Spawn W workers, each `for job := range jobs { results <- process(job) }`
  - Use `context.WithCancel` for shutdown signal
  - Close `jobs` after dispatching to terminate workers via range
  - Use a WaitGroup to wait for workers to drain, then close `results`

### Exercises

1. Implement an unbuffered channel rendezvous between two goroutines; prove both block until paired.
2. Send on a closed channel and observe the panic; then receive from a closed channel and observe ok=false.
3. Build a select with two channels and observe the random selection over 100 iterations.
4. Use a nil channel to dynamically enable/disable a select case.
5. Trigger a `time.After` leak in a hot loop; profile with `pprof` and fix with `time.NewTimer`.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does sending on an unbuffered channel do?
9. A) Returns immediately
10. B) Panics
11. C) Blocks until a receiver is ready (rendezvous) (*)
12. D) Drops the value
13. Explanation: Unbuffered channels are synchronous — the sender blocks until a receiver is ready to take the value, providing a rendezvous between goroutines.
14. Q2: When does a buffered channel send block?
15. A) Never
16. B) Always
17. C) Only when the buffer is empty
18. D) Only when the buffer is full (*)
19. Explanation: A buffered channel of capacity N accepts N sends without blocking; the (N+1)th send blocks until a receiver makes room.
20. Q3: What happens when you send on a closed channel?
21. A) Panics with "send on closed channel" (*)
22. B) Returns an error
23. C) Drops the value silently
24. D) Reopens the channel
25. Explanation: Sending on a closed channel panics. Only the sender should close, and only after all sends are done; receivers must never close.
26. Q4: What does receiving from a closed channel return?
27. A) Panic
28. B) The zero value with ok=false (and any buffered values first) (*)
29. C) Blocks forever
30. D) An error
31. Explanation: A closed channel drains any buffered values (ok=true), then returns the zero value with ok=false indefinitely, signaling end-of-stream.
32. Q5: How does select pick among multiple ready cases?
33. A) FIFO order
34. B) By case index
35. C) Randomly — to prevent starvation (*)
36. D) By channel name
37. Explanation: When multiple select cases are ready, Go picks one at random to prevent systematic starvation of any single case.
38. Q6: What does `for v := range ch` do?
39. A) Loops forever
40. B) Sends values
41. C) Closes the channel
42. D) Receives values until the channel is closed, then exits (*)
43. Explanation: `for v := range ch` receives values until the channel is closed; if no one closes ch, the loop blocks forever — a common goroutine leak.
44. Q7: What's the effect of a nil channel in a select case?
45. A) It blocks forever — effectively disabling that case (*)
46. B) It panics
47. C) It returns the zero value
48. D) It closes the select
49. Explanation: A nil channel blocks forever, so a select case on a nil channel never fires. Setting a channel to nil dynamically disables that case.
50. Q8: Why is `time.After` dangerous in a tight select loop?
51. A) It's inaccurate
52. B) Each call schedules a timer that's not GC'd until it fires, leaking memory in hot loops (*)
53. C) It panics
54. D) It uses too much CPU
55. Explanation: `time.After(d)` creates a timer the runtime holds until it fires. In a hot loop, unfired timers accumulate; use `time.NewTimer` + `Stop()`.
56. Q9: What happens if you close a channel twice?
57. A) No-op
58. B) Returns an error
59. C) Panic — "close of closed channel" (*)
60. D) Re-opens the channel
61. Explanation: Closing an already-closed channel panics. If multiple paths might close, guard with sync.Once or coordinate via a single owner.
62. Q10: Which is the canonical pattern for "multiple senders, one receiver, graceful close"?
63. A) The receiver closes the channel
64. B) Each sender closes after sending
65. C) Use sync.Mutex around close
66. D) A separate done channel or context signals senders to stop; the receiver closes after all senders exit (*)
67. Explanation: The receiver should never close (senders would panic on next send). Coordinate with a done channel or context: senders stop on done, then one party (often a coordinator) closes the channel.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does sending on an unbuffered channel do?
  options:
    - Returns immediately
    - Panics
    - Blocks until a receiver is ready (rendezvous)
    - Drops the value
  correctIndex: 2
  explanation: Unbuffered channels are synchronous — the sender blocks until a receiver is ready to take the value, providing a rendezvous between goroutines.
- id: q2
  question: When does a buffered channel send block?
  options:
    - Never
    - Always
    - Only when the buffer is empty
    - Only when the buffer is full
  correctIndex: 3
  explanation: A buffered channel of capacity N accepts N sends without blocking; the (N+1)th send blocks until a receiver makes room.
- id: q3
  question: What happens when you send on a closed channel?
  options:
    - Panics with "send on closed channel"
    - Returns an error
    - Drops the value silently
    - Reopens the channel
  correctIndex: 0
  explanation: Sending on a closed channel panics. Only the sender should close, and only after all sends are done; receivers must never close.
- id: q4
  question: What does receiving from a closed channel return?
  options:
    - Panic
    - The zero value with ok=false (and any buffered values first)
    - Blocks forever
    - An error
  correctIndex: 1
  explanation: A closed channel drains any buffered values (ok=true), then returns the zero value with ok=false indefinitely, signaling end-of-stream.
- id: q5
  question: How does select pick among multiple ready cases?
  options:
    - FIFO order
    - By case index
    - Randomly — to prevent starvation
    - By channel name
  correctIndex: 2
  explanation: When multiple select cases are ready, Go picks one at random to prevent systematic starvation of any single case.
- id: q6
  question: What does `for v := range ch` do?
  options:
    - Loops forever
    - Sends values
    - Closes the channel
    - Receives values until the channel is closed, then exits
  correctIndex: 3
  explanation: "`for v := range ch` receives values until the channel is closed; if no one closes ch, the loop blocks forever — a common goroutine leak."
- id: q7
  question: What's the effect of a nil channel in a select case?
  options:
    - It blocks forever — effectively disabling that case
    - It panics
    - It returns the zero value
    - It closes the select
  correctIndex: 0
  explanation: A nil channel blocks forever, so a select case on a nil channel never fires. Setting a channel to nil dynamically disables that case.
- id: q8
  question: Why is `time.After` dangerous in a tight select loop?
  options:
    - It's inaccurate
    - Each call schedules a timer that's not GC'd until it fires, leaking memory in hot loops
    - It panics
    - It uses too much CPU
  correctIndex: 1
  explanation: "`time.After(d)` creates a timer the runtime holds until it fires. In a hot loop, unfired timers accumulate; use `time.NewTimer` + `Stop()`."
- id: q9
  question: What happens if you close a channel twice?
  options:
    - No-op
    - Returns an error
    - Panic — "close of closed channel"
    - Re-opens the channel
  correctIndex: 2
  explanation: Closing an already-closed channel panics. If multiple paths might close, guard with sync.Once or coordinate via a single owner.
- id: q10
  question: Which is the canonical pattern for "multiple senders, one receiver, graceful close"?
  options:
    - The receiver closes the channel
    - Each sender closes after sending
    - Use sync.Mutex around close
    - A separate done channel or context signals senders to stop; the receiver closes after all senders exit
  correctIndex: 3
  explanation: "The receiver should never close (senders would panic on next send). Coordinate with a done channel or context: senders stop on done, then one party (often a coordinator) closes the channel."
```

