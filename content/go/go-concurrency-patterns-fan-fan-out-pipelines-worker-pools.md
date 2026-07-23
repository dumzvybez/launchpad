---
slug: go-concurrency-patterns-fan-fan-out-pipelines-worker-pools
id: go-18
track: go
order: 18
title: Concurrency Patterns — fan-in/fan-out, pipelines, worker pools
description: Apply the classic Go concurrency patterns — pipelines, fan-out/fan-in, worker pools, publish/subscribe, and the errgroup package for error-aware concurrency.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=13600s
whyItMatters: Apply the classic Go concurrency patterns — pipelines, fan-out/fan-in, worker pools, publish/subscribe, and the errgroup package for error-aware concurrency.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Concurrency Patterns — fan-in/fan-out, pipelines, worker pools

## Concurrency Patterns — fan-in/fan-out, pipelines, worker pools

### Why It Matters

Apply the classic Go concurrency patterns — pipelines, fan-out/fan-in, worker pools, publish/subscribe, and the errgroup package for error-aware concurrency.

Apply the classic Go concurrency patterns — pipelines, fan-out/fan-in, worker pools, publish/subscribe, and the errgroup package for error-aware concurrency.

### Prerequisites

- Stage 17: The Standard Library.
- Comfort with channels, select, and context.

### Topics

- Pipeline: stage 1 → stage 2 → stage 3, each a goroutine reading a channel
- Fan-out: multiple goroutines reading the same input channel
- Fan-in: merge multiple channels into one with select or sync.WaitGroup
- Worker pool: fixed N workers, queue of jobs, results channel
- Pub/Sub: topic → multiple subscribers, each its own goroutine
- errgroup.WithContext — error-aware group, cancels on first error
- Bounded concurrency with semaphore (buffered channel)
- Tee pattern: split one channel into two

### Key Concepts

- A pipeline is a series of stages connected by channels; each stage is one or more goroutines that read from input and write to output.
- Fan-out means multiple goroutines reading the same channel (parallelizing CPU-bound work); fan-in means merging multiple channels into one.
- Worker pools bound concurrency: N workers consume from a jobs channel, write to a results channel — backpressure is automatic.
- errgroup.WithContext returns a Group whose Go() spawns a goroutine and a Context that's cancelled on first error — the canonical error-aware concurrency primitive.
- Always close channels at the producer side, never the consumer; with multiple producers, coordinate via a WaitGroup.

```go
func gen(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums { out <- n }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in { out <- n * n }
    }()
    return out
}

for r := range square(square(gen(1, 2, 3))) {
    fmt.Println(r) // 1, 16, 81
}
```
Caption: Pipeline

### Common Pitfalls

- Goroutine leak when consumer abandons a channel — the producer goroutine blocks on send forever; always wire up a context for cancellation or close from the consumer via a done channel.
- Closing a channel from the receiver side — multiple producers sending on a closed channel will panic; coordinate closing with a single owner + WaitGroup.
- Forgetting to close the results channel — `for r := range results` blocks forever; close results after all workers finish (often via `go func() { wg.Wait(); close(results) }()`).
- Unbounded fan-out — spawning one goroutine per task with no semaphore can exhaust memory or trigger OOM under load; bound with a buffered-channel semaphore.
- Ignoring errors in goroutines — `go func() { doWork() }()` swallows errors; use errgroup or a results channel that includes error info.

### Real-World Applications

- Prometheus's scrape manager fans out one goroutine per target, fanning in results to the storage layer; the pipeline pattern is fundamental.
- The Docker daemon uses worker pools for image pulls and container starts, bounding concurrency to avoid resource exhaustion.
- HashiCorp's raft uses pipelines for log replication: each follower gets a pipeline goroutine, results fan in to the leader's commit loop.
- The Twitch IRC ingestion pipeline (post-Go migration) is a textbook fan-in/fan-out: shards fan out per channel, results fan in to the broadcast layer.

### Interview Questions

- 1. What's a Go pipeline? — A series of stages connected by channels; each stage is a goroutine that reads from an input channel and writes to an output channel, closing output when input closes.
- 2. What's the difference between fan-out and fan-in? — Fan-out spawns multiple goroutines reading the same input (parallel processing); fan-in merges multiple channels into one for a single consumer.
- 3. How do you safely close a channel with multiple producers? — Use a WaitGroup: each producer signals Done() when finished; a separate goroutine waits and closes the channel exactly once.
- 4. What does errgroup.WithContext provide? — A Group whose Go() spawns a goroutine and a Context that's cancelled on first error returned by any sibling — automatic cancellation propagation.
- 5. How do you bound concurrency without a worker pool? — Use a buffered channel as a semaphore: `sem := make(chan struct{}, N)`; acquire `sem <- struct{}{}` before work, release `<-sem` after.

### Mini Project

Build a Concurrent File Hasher with Worker Pool: A CLI that walks a directory, computes SHA-256 of each file using a configurable worker pool, and prints results in input order with timing. Suggested approach:
  - Walk with `filepath.WalkDir` producing a `jobs chan string`
  - Spawn N workers each reading from jobs, computing sha256, writing to results
  - Track original index to print in input order (or use a sorted final map)
  - Use errgroup.WithContext for error propagation and cancellation
  - Benchmark N=1, 4, 16, 64 — find the sweet spot for SSD vs HDD

### Exercises

1. Implement a 3-stage pipeline (gen → square → print) and verify ordering.
2. Fan out 4 workers on the same input channel; confirm work is distributed.
3. Build fan-in for two channels and confirm interleaved output.
4. Use errgroup to fetch 10 URLs concurrently with a per-request context timeout; cancel on first error.
5. Add a semaphore (buffered channel) to bound a fan-out to 8 workers.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's a Go pipeline?
9. A) A single goroutine doing everything
10. B) Stages connected by channels; each stage reads input, writes output, closes output on input close (*)
11. C) A Unix pipe
12. D) A buffered reader
13. Explanation: A pipeline is a series of goroutine stages, each consuming from an input channel and producing to an output channel, closing its output when its input closes — the canonical Go concurrency pattern.
14. Q2: What's the difference between fan-out and fan-in?
15. A) They're the same
16. B) Fan-out is for inputs; fan-in for outputs
17. C) Fan-out spawns multiple goroutines reading one input; fan-in merges multiple channels into one (*)
18. D) Fan-in is for errors; fan-out for results
19. Explanation: Fan-out parallelizes by having N goroutines read from one channel; fan-in merges N channels into one so a single consumer can read all values.
20. Q3: Who should close a channel in a multi-producer setup?
21. A) The receiver
22. B) Any producer
23. C) The runtime
24. D) A single owner that waits for all producers to finish (e.g., via WaitGroup) (*)
25. Explanation: Receivers must never close (producers would panic on next send). A single coordinator goroutine waits for all producers (via WaitGroup) and closes the channel exactly once.
26. Q4: What does errgroup.WithContext return?
27. A) A Group and a Context that's cancelled on first error (*)
28. B) Just a Group
29. C) An error channel
30. D) A WaitGroup
31. Explanation: `errgroup.WithContext(ctx)` returns (Group, ctx). Group.Go spawns a goroutine; if any returns an error, ctx is cancelled and Group.Wait returns the first error.
32. Q5: How do you bound concurrency without a fixed worker pool?
33. A) Use sync.Mutex
34. B) Use a buffered channel as a semaphore: make(chan struct{}, N) (*)
35. C) Use sync.Once
36. D) You can't
37. Explanation: A buffered channel of size N admits at most N goroutines into a section: acquire (`sem <- struct{}{}`) before work, release (`<-sem`) after — a cheap, idiomatic semaphore.
38. Q6: Why does the pipeline pattern close its output when input closes?
39. A) To free memory
40. B) To flush buffers
41. C) To signal downstream stages that no more values are coming, so they can exit their range loop (*)
42. D) It's optional
43. Explanation: `defer close(out)` in each stage lets the next stage's `for v := range in` exit cleanly. Without it, the downstream range blocks forever — a goroutine leak.
44. Q7: What's a goroutine leak?
45. A) A goroutine that's been killed
46. B) A goroutine that returned an error
47. C) A goroutine running too fast
48. D) A goroutine blocked forever with no path to exit, consuming stack and memory indefinitely (*)
49. Explanation: A goroutine leak is a blocked goroutine that can never make progress (e.g., sending on a channel no one reads). It accumulates, draining memory and file descriptors.
50. Q8: Which pattern is best for "process N independent tasks, return on first error, cancel the rest"?
51. A) errgroup.WithContext + g.Go (*)
52. B) Plain WaitGroup
53. C) sync.Once
54. D) for-loop with select
55. Explanation: errgroup.WithContext gives a context that's cancelled on first error, and g.Go spawns a goroutine per task respecting that context — automatic cancellation propagation.
56. Q9: What's the canonical producer→consumer close pattern for a single producer?
57. A) Consumer closes after range
58. B) Producer closes after the final send (defer close(out)) (*)
59. C) Both close
60. D) Neither closes
61. Explanation: The producer owns the channel and closes it (typically via `defer close(out)`) after sending all values, signaling end-of-stream to the consumer's range loop.
62. Q10: How does a worker pool apply backpressure?
63. A) By panicking
64. B) By dropping jobs
65. C) By blocking on a full jobs channel (*)
66. D) It doesn't — backpressure requires extra logic
67. Explanation: When the jobs channel is full (buffered) and all workers are busy, senders block on `jobs <- j`, applying backpressure naturally to upstream producers — bounded queues, bounded load.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's a Go pipeline?
  options:
    - A single goroutine doing everything
    - Stages connected by channels; each stage reads input, writes output, closes output on input close
    - A Unix pipe
    - A buffered reader
  correctIndex: 1
  explanation: A pipeline is a series of goroutine stages, each consuming from an input channel and producing to an output channel, closing its output when its input closes — the canonical Go concurrency pattern.
- id: q2
  question: What's the difference between fan-out and fan-in?
  options:
    - They're the same
    - Fan-out is for inputs; fan-in for outputs
    - Fan-out spawns multiple goroutines reading one input; fan-in merges multiple channels into one
    - Fan-in is for errors; fan-out for results
  correctIndex: 2
  explanation: Fan-out parallelizes by having N goroutines read from one channel; fan-in merges N channels into one so a single consumer can read all values.
- id: q3
  question: Who should close a channel in a multi-producer setup?
  options:
    - The receiver
    - Any producer
    - The runtime
    - A single owner that waits for all producers to finish (e.g., via WaitGroup)
  correctIndex: 3
  explanation: Receivers must never close (producers would panic on next send). A single coordinator goroutine waits for all producers (via WaitGroup) and closes the channel exactly once.
- id: q4
  question: What does errgroup.WithContext return?
  options:
    - A Group and a Context that's cancelled on first error
    - Just a Group
    - An error channel
    - A WaitGroup
  correctIndex: 0
  explanation: "`errgroup.WithContext(ctx)` returns (Group, ctx). Group.Go spawns a goroutine; if any returns an error, ctx is cancelled and Group.Wait returns the first error."
- id: q5
  question: How do you bound concurrency without a fixed worker pool?
  options:
    - Use sync.Mutex
    - "Use a buffered channel as a semaphore: make(chan struct{}, N)"
    - Use sync.Once
    - You can't
  correctIndex: 1
  explanation: "A buffered channel of size N admits at most N goroutines into a section: acquire (`sem <- struct{}{}`) before work, release (`<-sem`) after — a cheap, idiomatic semaphore."
- id: q6
  question: Why does the pipeline pattern close its output when input closes?
  options:
    - To free memory
    - To flush buffers
    - To signal downstream stages that no more values are coming, so they can exit their range loop
    - It's optional
  correctIndex: 2
  explanation: "`defer close(out)` in each stage lets the next stage's `for v := range in` exit cleanly. Without it, the downstream range blocks forever — a goroutine leak."
- id: q7
  question: What's a goroutine leak?
  options:
    - A goroutine that's been killed
    - A goroutine that returned an error
    - A goroutine running too fast
    - A goroutine blocked forever with no path to exit, consuming stack and memory indefinitely
  correctIndex: 3
  explanation: A goroutine leak is a blocked goroutine that can never make progress (e.g., sending on a channel no one reads). It accumulates, draining memory and file descriptors.
- id: q8
  question: Which pattern is best for "process N independent tasks, return on first error, cancel the rest"?
  options:
    - errgroup.WithContext + g.Go
    - Plain WaitGroup
    - sync.Once
    - for-loop with select
  correctIndex: 0
  explanation: errgroup.WithContext gives a context that's cancelled on first error, and g.Go spawns a goroutine per task respecting that context — automatic cancellation propagation.
- id: q9
  question: What's the canonical producer→consumer close pattern for a single producer?
  options:
    - Consumer closes after range
    - Producer closes after the final send (defer close(out))
    - Both close
    - Neither closes
  correctIndex: 1
  explanation: The producer owns the channel and closes it (typically via `defer close(out)`) after sending all values, signaling end-of-stream to the consumer's range loop.
- id: q10
  question: How does a worker pool apply backpressure?
  options:
    - By panicking
    - By dropping jobs
    - By blocking on a full jobs channel
    - It doesn't — backpressure requires extra logic
  correctIndex: 2
  explanation: When the jobs channel is full (buffered) and all workers are busy, senders block on `jobs <- j`, applying backpressure naturally to upstream producers — bounded queues, bounded load.
```

