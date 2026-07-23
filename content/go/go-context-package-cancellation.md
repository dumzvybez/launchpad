---
slug: go-context-package-cancellation
id: go-12
track: go
order: 12
title: The context Package and Cancellation
description: Use the `context` package to propagate cancellation, deadlines, and request-scoped values across goroutine trees — and learn the rules that keep context usage safe and idiomatic.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=8800s
whyItMatters: Use the `context` package to propagate cancellation, deadlines, and request-scoped values across goroutine trees — and learn the rules that keep context usage safe and idiomatic.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# The context Package and Cancellation

## The context Package and Cancellation

### Why It Matters

Use the `context` package to propagate cancellation, deadlines, and request-scoped values across goroutine trees — and learn the rules that keep context usage safe and idiomatic.

Use the `context` package to propagate cancellation, deadlines, and request-scoped values across goroutine trees — and learn the rules that keep context usage safe and idiomatic.

### Prerequisites

- Stage 11: Channels — Unbuffered, Buffered, Select.
- Comfort with goroutines and select.

### Topics

- context.Context — the standard cancellation/deadline/value carrier
- context.Background() vs context.TODO()
- context.WithCancel, WithTimeout, WithDeadline, WithAfterFunc (1.21+)
- context.WithValue — request-scoped values (and why to use sparingly)
- Propagation rules: pass Context as first param, never store in a struct
- ctx.Err() and ctx.Done() — the cancellation channel
- Cancellation propagation through the call tree
- context.AfterFunc (Go 1.21+) — register cleanup without a goroutine

### Key Concepts

- Context flows down the call tree; cancelling a parent cancels all children derived from it.
- `context.Background()` is the root, used in main and tests; `context.TODO()` is the "I haven't decided yet" placeholder.
- `ctx.Done()` returns a channel that closes when the context is cancelled (or expires); `ctx.Err()` tells you why (Canceled or DeadlineExceeded).
- The first parameter of a function that does I/O should be `ctx context.Context` — not stored in a struct (with rare exceptions like server main loops).
- `context.WithValue` should carry request-scoped values (trace IDs, auth tokens) only — not function parameters; the value lookup is O(n) on the chain.

```go
func fetch(ctx context.Context, url string) (*http.Response, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }
    return http.DefaultClient.Do(req)
}

ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()
resp, err := fetch(ctx, "https://example.com")
```
Caption: WithTimeout for an HTTP call

### Common Pitfalls

- Storing context.Context in a struct — the linter and reviewers will flag it; context should flow as a parameter so its lifetime is clear.
- Forgetting to call cancel — `WithCancel`/`WithTimeout`/`WithDeadline` return a cancel function that MUST be called (usually defer'd) to release timer resources.
- Using context.WithValue for function parameters — values are untyped, lookup is O(n), and there's no compile-time safety; use a struct field instead.
- Using string keys for WithValue — strings collide; use a custom unexported type (`type ctxKey int`) to avoid name clashes across packages.
- context.Background() vs TODO() confusion — Background is for main/init/tests (a real root); TODO is a placeholder flagged by static analysis to revisit.

### Real-World Applications

- The net/http server passes a context per request that's cancelled when the client disconnects — handlers must respect ctx.Done() to avoid leak.
- gRPC-Go propagates deadlines and cancellation across the wire via metadata, mirroring the local context tree across services.
- Kubernetes controllers derive a context per reconcile loop with a timeout (e.g., 30s), so a stuck reconcile doesn't block the work queue.
- Uber's context-aware service framework (go.uber.org/fx) uses context for component lifecycle: start, serve, graceful stop.

### Interview Questions

- 1. What's the difference between context.Background() and context.TODO()? — Background is the non-empty, never-cancelled root used in main/tests; TODO is a placeholder for "not yet decided," flagged by static analysis to revisit.
- 2. What does ctx.Done() return? — A channel that's closed when the context is cancelled or expires; receive returns zero-value immediately, signaling shutdown.
- 3. Why must you always call the cancel function? — WithTimeout/WithDeadline allocate a timer; cancel releases it. Even WithCancel must be called to free resources and signal descendants.
- 4. Why shouldn't you store context in a struct? — Context is a flow type with a clear lifetime tied to a request; storing it in a struct obscures lifetime and can outlive the request, causing subtle bugs.
- 5. When is context.WithValue appropriate? — For request-scoped data that crosses API boundaries without a natural parameter (trace IDs, request IDs, auth principals) — never for ordinary function parameters.

### Mini Project

Build a Shutdown-Aware HTTP Scraper: A CLI that fetches N URLs concurrently with a per-request timeout and a global shutdown signal (Ctrl+C). On shutdown, in-flight requests are cancelled and the program exits cleanly within 1s. Suggested approach:
  - `ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)`
  - Per-URL `ctx, cancel := context.WithTimeout(parentCtx, 5*time.Second)`
  - Use `errgroup.WithContext` for cancellation propagation across fetches
  - Print partial results on shutdown
  - Verify `kill -INT` exits within 1s with no leaked goroutines (use `runtime.NumGoroutine()`)

### Exercises

1. Create a context with 100ms timeout, sleep 200ms in a goroutine, and observe ctx.Err() == DeadlineExceeded.
2. Derive three child contexts from one parent; cancel the parent; verify all three children's Done() channels close.
3. Use context.AfterFunc (1.21+) to register cleanup without spawning a goroutine; verify it runs on cancel.
4. Store a trace ID via WithValue with a custom key type; retrieve it from a child context.
5. Replace a `context.TODO()` in existing code with either `context.Background()` (if root) or a passed-in parent ctx.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the root context used in main and tests?
9. A) context.TODO()
10. B) context.New()
11. C) context.Root()
12. D) context.Background() (*)
13. Explanation: `context.Background()` is the never-cancelled, never-deadlined root used in main, init, and tests. All derived contexts (WithCancel, WithTimeout) chain from it.
14. Q2: What is context.TODO()?
15. A) A placeholder used when you're unsure which context to use, flagged by static analysis (*)
16. B) A cancelled context
17. C) A context with no deadline
18. D) An alias for Background()
19. Explanation: `context.TODO()` is a placeholder for "not yet decided" — static analysis tools flag it for follow-up. It's functionally similar to Background but signals intent.
20. Q3: What does ctx.Done() return?
21. A) An error
22. B) A channel that closes when the context is cancelled or expires (*)
23. C) A boolean
24. D) A context
25. Explanation: `ctx.Done()` returns a `<-chan struct{}` that is closed when the context is cancelled or expires; `select` on it is the idiomatic way to react to shutdown.
26. Q4: Why must you always call the cancel function returned by WithCancel/WithTimeout?
27. A) To avoid a compile error
28. B) To send the result
29. C) To release timer/goroutine resources and signal descendants (*)
30. D) It's optional
31. Explanation: WithTimeout/WithDeadline allocate a timer; WithCancel sets up internal goroutines. Calling cancel releases these and propagates cancellation to children — `defer cancel()` is the rule.
32. Q5: Which is the recommended signature for a function that does I/O?
33. A) func Do(x int) error
34. B) func Do(x int, ctx context.Context) error
35. C) func Do(ctx *context.Context, x int) error
36. D) func Do(ctx context.Context, x int) error (*)
37. Explanation: Idiomatic Go puts `ctx context.Context` as the first parameter. It's never a pointer (contexts are immutable interfaces) and never the last parameter.
38. Q6: Why is storing context.Context in a struct discouraged?
39. A) It obscures the context's lifetime and can outlive the request, causing subtle bugs (*)
40. B) Compile error
41. C) It's slow
42. D) It's not — this is fine
43. Explanation: Context's lifetime is tied to a request; storing it in a long-lived struct can leak resources or cause use-after-cancel bugs. Pass it as a parameter instead.
44. Q7: What's the rule for context.WithValue keys?
45. A) Always use string keys
46. B) Use a custom unexported type to avoid collisions across packages (*)
47. C) Use int directly
48. D) Use any
49. Explanation: Strings collide across packages; use `type ctxKey int` (or similar unexported type) so your key is unique to your package. Values are untyped and looked up by interface equality.
50. Q8: What does context.AfterFunc (Go 1.21+) do?
51. A) Cancels the context after a delay
52. B) Sets a deadline
53. C) Registers a function to run when the context is cancelled, without spawning a goroutine (*)
54. D) Sets a value
55. Explanation: `context.AfterFunc(ctx, fn)` registers fn to run when ctx is cancelled; the returned `stop()` unregisters. It avoids the goroutine+select boilerplate of older patterns.
56. Q9: What's the difference between WithTimeout and WithDeadline?
57. A) None
58. B) WithTimeout is for cancels; WithDeadline is for values
59. C) WithTimeout is deprecated
60. D) WithTimeout takes a duration; WithDeadline takes an absolute time (*)
61. Explanation: `WithTimeout(parent, d)` is sugar for `WithDeadline(parent, time.Now().Add(d))`. Timeout is relative ("5s from now"); Deadline is absolute ("3pm UTC").
62. Q10: What does ctx.Err() return after the context's deadline passes?
63. A) context.DeadlineExceeded (*)
64. B) nil
65. C) context.Canceled
66. D) context.Timeout
67. Explanation: After a deadline passes, `ctx.Err()` returns `context.DeadlineExceeded`; after explicit cancel, it returns `context.Canceled`. nil means still active.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the root context used in main and tests?
  options:
    - context.TODO()
    - context.New()
    - context.Root()
    - context.Background()
  correctIndex: 3
  explanation: "`context.Background()` is the never-cancelled, never-deadlined root used in main, init, and tests. All derived contexts (WithCancel, WithTimeout) chain from it."
- id: q2
  question: What is context.TODO()?
  options:
    - A placeholder used when you're unsure which context to use, flagged by static analysis
    - A cancelled context
    - A context with no deadline
    - An alias for Background()
  correctIndex: 0
  explanation: "`context.TODO()` is a placeholder for \"not yet decided\" — static analysis tools flag it for follow-up. It's functionally similar to Background but signals intent."
- id: q3
  question: What does ctx.Done() return?
  options:
    - An error
    - A channel that closes when the context is cancelled or expires
    - A boolean
    - A context
  correctIndex: 1
  explanation: "`ctx.Done()` returns a `<-chan struct{}` that is closed when the context is cancelled or expires; `select` on it is the idiomatic way to react to shutdown."
- id: q4
  question: Why must you always call the cancel function returned by WithCancel/WithTimeout?
  options:
    - To avoid a compile error
    - To send the result
    - To release timer/goroutine resources and signal descendants
    - It's optional
  correctIndex: 2
  explanation: WithTimeout/WithDeadline allocate a timer; WithCancel sets up internal goroutines. Calling cancel releases these and propagates cancellation to children — `defer cancel()` is the rule.
- id: q5
  question: Which is the recommended signature for a function that does I/O?
  options:
    - func Do(x int) error
    - func Do(x int, ctx context.Context) error
    - func Do(ctx *context.Context, x int) error
    - func Do(ctx context.Context, x int) error
  correctIndex: 3
  explanation: Idiomatic Go puts `ctx context.Context` as the first parameter. It's never a pointer (contexts are immutable interfaces) and never the last parameter.
- id: q6
  question: Why is storing context.Context in a struct discouraged?
  options:
    - It obscures the context's lifetime and can outlive the request, causing subtle bugs
    - Compile error
    - It's slow
    - It's not — this is fine
  correctIndex: 0
  explanation: Context's lifetime is tied to a request; storing it in a long-lived struct can leak resources or cause use-after-cancel bugs. Pass it as a parameter instead.
- id: q7
  question: What's the rule for context.WithValue keys?
  options:
    - Always use string keys
    - Use a custom unexported type to avoid collisions across packages
    - Use int directly
    - Use any
  correctIndex: 1
  explanation: Strings collide across packages; use `type ctxKey int` (or similar unexported type) so your key is unique to your package. Values are untyped and looked up by interface equality.
- id: q8
  question: What does context.AfterFunc (Go 1.21+) do?
  options:
    - Cancels the context after a delay
    - Sets a deadline
    - Registers a function to run when the context is cancelled, without spawning a goroutine
    - Sets a value
  correctIndex: 2
  explanation: "`context.AfterFunc(ctx, fn)` registers fn to run when ctx is cancelled; the returned `stop()` unregisters. It avoids the goroutine+select boilerplate of older patterns."
- id: q9
  question: What's the difference between WithTimeout and WithDeadline?
  options:
    - None
    - WithTimeout is for cancels; WithDeadline is for values
    - WithTimeout is deprecated
    - WithTimeout takes a duration; WithDeadline takes an absolute time
  correctIndex: 3
  explanation: '`WithTimeout(parent, d)` is sugar for `WithDeadline(parent, time.Now().Add(d))`. Timeout is relative ("5s from now"); Deadline is absolute ("3pm UTC").'
- id: q10
  question: What does ctx.Err() return after the context's deadline passes?
  options:
    - context.DeadlineExceeded
    - nil
    - context.Canceled
    - context.Timeout
  correctIndex: 0
  explanation: After a deadline passes, `ctx.Err()` returns `context.DeadlineExceeded`; after explicit cancel, it returns `context.Canceled`. nil means still active.
```

