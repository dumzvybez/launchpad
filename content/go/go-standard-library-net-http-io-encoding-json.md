---
slug: go-standard-library-net-http-io-encoding-json
id: go-17
track: go
order: 17
title: The Standard Library — net/http, io, encoding/json
description: Master the three most-used standard library packages — net/http (servers and clients), io (Reader/Writer/Copy/All), and encoding/json (marshal/unmarshal, streams, encoders/decoders).
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=12800s
whyItMatters: Master the three most-used standard library packages — net/http (servers and clients), io (Reader/Writer/Copy/All), and encoding/json (marshal/unmarshal, streams, encoders/decoders).
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# The Standard Library — net/http, io, encoding/json

## The Standard Library — net/http, io, encoding/json

### Why It Matters

Master the three most-used standard library packages — net/http (servers and clients), io (Reader/Writer/Copy/All), and encoding/json (marshal/unmarshal, streams, encoders/decoders).

Master the three most-used standard library packages — net/http (servers and clients), io (Reader/Writer/Copy/All), and encoding/json (marshal/unmarshal, streams, encoders/decoders).

### Prerequisites

- Stage 16: Testing.
- Comfort with interfaces (io.Reader, io.Writer).

### Topics

- net/http: http.HandleFunc, http.Server, http.Client, http.Handler, http.ServeMux
- Server graceful shutdown with Shutdown(ctx)
- http.NewRequestWithContext for client-side timeouts
- io.Reader, io.Writer, io.Copy, io.ReadAll, io.MultiWriter
- encoding/json: Marshal, Unmarshal, Encoder, Decoder, streaming
- Struct tags: json:"name,omitempty,string"
- json.RawMessage for delayed decoding
- time.Time, time.Duration, context in HTTP handlers

### Key Concepts

- net/http spawns one goroutine per request; handlers must be concurrency-safe.
- The default http.Client has NO timeout — always set one (or use http.NewRequestWithContext with a deadline).
- io.Reader/Writer are the universal abstractions; io.Copy bridges them without loading everything into memory.
- json.NewEncoder/Decoder stream JSON to/from io.Writer/Reader; use them for large payloads to avoid allocation.
- `json.RawMessage` (`[]byte`) lets you delay decoding part of a message until you know its schema (e.g., a "type" field).

```go
srv := &http.Server{
    Addr:              ":8080",
    Handler:           mux,
    ReadHeaderTimeout: 5 * time.Second,
}

go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
        log.Fatal(err)
    }
}()

// Graceful shutdown on SIGINT
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
defer stop()
<-ctx.Done()

shutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
srv.Shutdown(shutCtx) // waits for in-flight handlers, then closes listeners
```
Caption: HTTP server with graceful shutdown

### Common Pitfalls

- Using http.DefaultClient (no timeout) — a slow server can hang your goroutine forever; always set Client.Timeout or use a context.
- Forgetting ReadHeaderTimeout — exposes you to Slowloris-style DoS; set it (e.g., 5s) on every server.
- Not closing resp.Body — leaks the connection; always `defer resp.Body.Close()`.
- json.Unmarshal into a struct with unexported fields — they're silently ignored; either export or use a custom UnmarshalJSON.
- Loading huge bodies via io.ReadAll — for big payloads, stream with json.NewDecoder or io.Copy to a file.

### Real-World Applications

- The entire Caddy web server is built on net/http; it serves millions of sites with HTTP/3 and TLS termination.
- Prometheus's scrape and remote-write protocols use streaming JSON and protobuf over net/http with custom encoders.
- The Docker daemon's API is net/http + json.Encoder/Decoder streaming; `docker logs --follow` is NDJSON over chunked HTTP.
- Kubernetes' apiserver uses net/http with custom handlers, etag-based caching, and watch streams (chunked HTTP).

### Interview Questions

- 1. Why does the default http.Client have no timeout? — Backwards compatibility; the default predates context. Always set Client.Timeout or use a request context — never use http.DefaultClient in production.
- 2. What does srv.Shutdown(ctx) do? — Closes listeners (no new connections), waits for in-flight handlers to complete (or ctx to expire), then returns; uses graceful close, not abrupt.
- 3. What's the difference between io.ReadAll and io.Copy? — ReadAll reads the entire stream into a []byte (allocates); Copy streams from Reader to Writer in fixed-size chunks (low memory).
- 4. When should you use json.NewDecoder vs json.Unmarshal? — Decoder for streams (e.g., NDJSON, large bodies); Unmarshal for already-in-memory []byte. Decoder is more memory-efficient.
- 5. What is json.RawMessage? — A []byte that implements json.Unmarshaler/ Marshaler by deferring decode/encode; lets you inspect one field before deciding how to decode the rest.

### Mini Project

Build a JSON-over-HTTP API Client with Streaming: A small `api` package that connects to a paginated JSON API, streams results via json.Decoder, handles rate limits with retry-after, and supports context-based cancellation. Suggested approach:
  - `type Client struct { http *http.Client; base string }`
  - Use `http.NewRequestWithContext` with a per-page timeout
  - Decode each page with `json.NewDecoder(resp.Body).Decode(&page)`
  - Sleep on `429 Retry-After`, return on context cancel
  - Add a test server with `httptest.NewServer` returning paginated JSON

### Exercises

1. Build an HTTP server with two handlers (`/time`, `/echo`) and graceful shutdown on Ctrl+C.
2. Replace http.DefaultClient with a client that has a 5s timeout; verify a slow server no longer hangs.
3. Stream a 1GB file to disk via io.Copy without loading it into memory; verify RSS stays low.
4. Use json.RawMessage to decode a polymorphic event payload based on a "type" field.
5. Add a per-request context timeout to a client call and verify context.DeadlineExceeded.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What timeout does http.DefaultClient have?
9. A) None — you must set one or use a context (*)
10. B) 30 seconds
11. C) 60 seconds
12. D) 5 seconds
13. Explanation: The default http.Client has no timeout for backwards compatibility. Always set Client.Timeout or use http.NewRequestWithContext with a deadline — never use DefaultClient in production.
14. Q2: What does srv.Shutdown(ctx) do?
15. A) Kills all connections immediately
16. B) Stops accepting new connections, waits for in-flight handlers (or ctx) (*)
17. C) Restarts the server
18. D) Reloads TLS certificates
19. Explanation: Shutdown closes listeners (no new conns), waits for in-flight handlers to finish or ctx to expire, then returns — graceful, not abrupt.
20. Q3: Which header timeout mitigates Slowloris attacks?
21. A) ReadTimeout
22. B) WriteTimeout
23. C) ReadHeaderTimeout (*)
24. D) IdleTimeout
25. Explanation: ReadHeaderTimeout caps the time to read the request headers, mitigating Slowloris (which sends headers one byte at a time). Always set it (e.g., 5s) on every server.
26. Q4: Why must you close resp.Body?
27. A) To flush logs
28. B) It's optional
29. C) To send the response
30. D) To free the connection back to the pool (*)
31. Explanation: The response body holds the connection; closing it returns the connection to the pool (for keep-alive) or closes it. Forgetting leaks connections and goroutines.
32. Q5: Which streams a file to an HTTP response with low memory?
33. A) io.Copy(w, file) (*)
34. B) io.ReadAll + w.Write
35. C) bytes.NewBuffer(file)
36. D) fmt.Fprintf(w, "%v", file)
37. Explanation: io.Copy streams from Reader to Writer in fixed-size chunks (32KB default), keeping memory flat regardless of file size — the canonical pattern.
38. Q6: When should you use json.NewDecoder over json.Unmarshal?
39. A) Never
40. B) For streaming inputs (large bodies, NDJSON) — lower memory (*)
41. C) For small payloads only
42. D) For pretty-printing
43. Explanation: Decoder reads from an io.Reader incrementally, ideal for streaming or large payloads. Unmarshal takes a []byte already in memory; pick based on input size and source.
44. Q7: What is json.RawMessage?
45. A) A pretty-printer flag
46. B) A streaming encoder
47. C) A []byte that defers marshal/unmarshal — useful for polymorphic payloads (*)
48. D) An error type
49. Explanation: RawMessage is a []byte that implements MarshalJSON/UnmarshalJSON as identity, letting you delay decoding part of a message until you've inspected a discriminator field.
50. Q8: How many goroutines does net/http spawn per request?
51. A) Zero
52. B) Two
53. C) Configurable
54. D) One goroutine per request (*)
55. Explanation: The server spawns one goroutine per incoming request — cheap enough that real-world Go services handle millions of req/s this way, but it means handlers must be concurrency-safe.
56. Q9: Which struct tag makes a field use omitempty AND a custom JSON name?
57. A) json:"name,omitempty" (*)
58. B) json:"name,optional"
59. C) json:"name;omitempty"
60. D) omitempty:"name"
61. Explanation: `json:"name,omitempty"` renames the field to "name" and omits it when it has its zero value. `json:"-"` skips entirely; `json:"-,omitempty"` is a literal "-" name.
62. Q10: What's the canonical way to set a per-request deadline on an HTTP client?
63. A) client.Timeout = 5 * time.Second
64. B) http.NewRequestWithContext(ctx, ...) with a context deadline (*)
65. C) resp.Body.SetDeadline
66. D) setsockopt
67. Explanation: `http.NewRequestWithContext(ctx, method, url, body)` plus a context with a deadline is the modern, composable way; it cancels the in-flight request when ctx expires, including during TLS handshake and body read.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What timeout does http.DefaultClient have?
  options:
    - None — you must set one or use a context
    - 30 seconds
    - 60 seconds
    - 5 seconds
  correctIndex: 0
  explanation: The default http.Client has no timeout for backwards compatibility. Always set Client.Timeout or use http.NewRequestWithContext with a deadline — never use DefaultClient in production.
- id: q2
  question: What does srv.Shutdown(ctx) do?
  options:
    - Kills all connections immediately
    - Stops accepting new connections, waits for in-flight handlers (or ctx)
    - Restarts the server
    - Reloads TLS certificates
  correctIndex: 1
  explanation: Shutdown closes listeners (no new conns), waits for in-flight handlers to finish or ctx to expire, then returns — graceful, not abrupt.
- id: q3
  question: Which header timeout mitigates Slowloris attacks?
  options:
    - ReadTimeout
    - WriteTimeout
    - ReadHeaderTimeout
    - IdleTimeout
  correctIndex: 2
  explanation: ReadHeaderTimeout caps the time to read the request headers, mitigating Slowloris (which sends headers one byte at a time). Always set it (e.g., 5s) on every server.
- id: q4
  question: Why must you close resp.Body?
  options:
    - To flush logs
    - It's optional
    - To send the response
    - To free the connection back to the pool
  correctIndex: 3
  explanation: The response body holds the connection; closing it returns the connection to the pool (for keep-alive) or closes it. Forgetting leaks connections and goroutines.
- id: q5
  question: Which streams a file to an HTTP response with low memory?
  options:
    - io.Copy(w, file)
    - io.ReadAll + w.Write
    - bytes.NewBuffer(file)
    - fmt.Fprintf(w, "%v", file)
  correctIndex: 0
  explanation: io.Copy streams from Reader to Writer in fixed-size chunks (32KB default), keeping memory flat regardless of file size — the canonical pattern.
- id: q6
  question: When should you use json.NewDecoder over json.Unmarshal?
  options:
    - Never
    - For streaming inputs (large bodies, NDJSON) — lower memory
    - For small payloads only
    - For pretty-printing
  correctIndex: 1
  explanation: Decoder reads from an io.Reader incrementally, ideal for streaming or large payloads. Unmarshal takes a []byte already in memory; pick based on input size and source.
- id: q7
  question: What is json.RawMessage?
  options:
    - A pretty-printer flag
    - A streaming encoder
    - A []byte that defers marshal/unmarshal — useful for polymorphic payloads
    - An error type
  correctIndex: 2
  explanation: RawMessage is a []byte that implements MarshalJSON/UnmarshalJSON as identity, letting you delay decoding part of a message until you've inspected a discriminator field.
- id: q8
  question: How many goroutines does net/http spawn per request?
  options:
    - Zero
    - Two
    - Configurable
    - One goroutine per request
  correctIndex: 3
  explanation: The server spawns one goroutine per incoming request — cheap enough that real-world Go services handle millions of req/s this way, but it means handlers must be concurrency-safe.
- id: q9
  question: Which struct tag makes a field use omitempty AND a custom JSON name?
  options:
    - json:"name,omitempty"
    - json:"name,optional"
    - json:"name;omitempty"
    - omitempty:"name"
  correctIndex: 0
  explanation: '`json:"name,omitempty"` renames the field to "name" and omits it when it has its zero value. `json:"-"` skips entirely; `json:"-,omitempty"` is a literal "-" name.'
- id: q10
  question: What's the canonical way to set a per-request deadline on an HTTP client?
  options:
    - client.Timeout = 5 * time.Second
    - http.NewRequestWithContext(ctx, ...) with a context deadline
    - resp.Body.SetDeadline
    - setsockopt
  correctIndex: 1
  explanation: "`http.NewRequestWithContext(ctx, method, url, body)` plus a context with a deadline is the modern, composable way; it cancels the in-flight request when ctx expires, including during TLS handshake and body read."
```

