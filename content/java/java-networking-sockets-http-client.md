---
slug: java-networking-sockets-http-client
id: java-16
track: java
order: 16
title: Networking — Sockets, HTTP Client
description: Build TCP clients and servers with ServerSocket, use the modern Java 11+ HttpClient for HTTP/1.1 and HTTP/2, and understand URI, URL, and content handling.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=18000s
whyItMatters: Build TCP clients and servers with ServerSocket, use the modern Java 11+ HttpClient for HTTP/1. 1 and HTTP/2, and understand URI, URL, and content handling.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Networking — Sockets, HTTP Client

## Networking — Sockets, HTTP Client

### Why It Matters

Build TCP clients and servers with ServerSocket, use the modern Java 11+ HttpClient for HTTP/1. 1 and HTTP/2, and understand URI, URL, and content handling.

Build TCP clients and servers with ServerSocket, use the modern Java 11+ HttpClient for HTTP/1.1 and HTTP/2, and understand URI, URL, and content handling.

### Prerequisites

- Stage 15: JDBC — Database Access.
- Comfort with try-with-resources, threading, and I/O.

### Topics

- TCP/IP basics and the Socket/ServerSocket API
- Reading and writing on a Socket with InputStream/OutputStream
- The legacy HttpURLConnection and why to avoid it
- The modern HttpClient (Java 11+) — sync and async
- HttpRequest, HttpResponse, BodyHandlers, BodyPublishers
- HTTP/2 multiplexing and server push
- WebSocket support (java.net.http.WebSocket)
- URI vs URL vs URN

### Key Concepts

- A ServerSocket.accept() blocks until a client connects, returning a Socket for that connection.
- HttpClient (Java 11, JEP 321) replaces HttpURLConnection with a modern, fluent, HTTP/2-capable, async-friendly API.
- HttpClient.send is synchronous (blocks the calling thread); sendAsync returns a CompletableFuture<HttpResponse>.
- HTTP/2 multiplexes multiple requests over a single TCP connection, reducing per-request overhead.
- Always close sockets (try-with-resources); a forgotten close leaks file descriptors and ports.

```java
try (var server = new ServerSocket(8080)) {
    System.out.println("listening on 8080");
    while (true) {
        try (var socket = server.accept();
             var in = socket.getInputStream();
             var out = socket.getOutputStream()) {
            int b;
            while ((b = in.read()) != -1) out.write(b);
        }
    }
}
```
Caption: TCP echo server

### Common Pitfalls

- Forgetting to set timeouts — a hung peer hangs your thread forever; always set connect and read timeouts.
- Using HttpURLConnection in new code — it's awkward, blocks synchronously, and lacks HTTP/2; use HttpClient.
- Not closing sockets — leaks file descriptors; the OS limit (often 1024 per process) is reached faster than you think.
- Reading the response body before checking the status code — wastes memory on large error pages; check `statusCode()` first when it matters.
- Assuming `sendAsync` parallelizes for free — it shares a thread pool; for many concurrent calls, compose with a dedicated executor or virtual threads.

### Real-World Applications

- The Java HttpClient (Java 11+) is the standard HTTP client in Spring Boot 3 reactive code paths and in many microservices for inter-service calls.
- Cassandra's internode communication uses raw TCP sockets with a custom binary protocol over Netty (rather than HTTP).
- Apache Spark's shuffle and RPC layers use custom TCP protocols built on Netty, not java.net.Socket.
- Eclipse Jetty (used by countless Java services) implements the HTTP/1.1 and HTTP/2 server protocols, powering the JVM-side of HTTP/2 push.

### Interview Questions

- 1. What's the difference between HttpClient.send and sendAsync? — send blocks the calling thread; sendAsync returns a CompletableFuture and runs on the client's executor.
- 2. Why was HttpClient introduced? — HttpURLConnection was synchronous, awkward, and lacked HTTP/2; HttpClient (JEP 321) is fluent, supports HTTP/2 and WebSocket, and has a proper async API.
- 3. What is HTTP/2 multiplexing? — Multiple requests/responses share one TCP connection via streams, avoiding head-of-line blocking and per-request connection overhead.
- 4. How do you set a connect timeout and a request timeout? — connectTimeout on HttpClient.Builder; timeout on HttpRequest.Builder.
- 5. What is the difference between URI and URL? — A URI is an identifier (possibly a URL or URN); a URL is a URI that includes a location/access mechanism (e.g., https://).

### Mini Project

Build a Concurrent Site Pinger: Given a list of URLs, fetch each asynchronously with HttpClient, measure latency, and print a sorted report (status, latency, body size). Suggested approach:
  - Read URLs from `args` or a file
  - Build one shared HttpClient with HTTP/2 and a 3-second connect timeout
  - Use `sendAsync` per URL and `thenApply` to compute latency via `System.nanoTime()`
  - Collect all futures with `CompletableFuture.allOf(...).join()`
  - Print results sorted by latency descending

### Exercises

1. Write a TCP echo server with ServerSocket and a corresponding client with Socket; verify echoes round-trip.
2. Fetch https://example.com with HttpClient and print status, headers, and body length.
3. Modify the fetch to be async with sendAsync, attach a timeout, and handle the TimeoutException in exceptionally.
4. POST a JSON body to https://httpbin.org/post and print the JSON echoed back.
5. Open 100 concurrent HTTPS connections to a slow server; compare platform-thread vs virtual-thread approaches for waiting on the responses.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: The modern Java HTTP client (`java.net.http.HttpClient`) was finalized in?
9. A) Java 8
10. B) Java 14
11. C) Java 17
12. D) Java 11 (*)
13. Explanation: HttpClient (JEP 321) was finalized in Java 11 after incubation in Java 9-10. It supports HTTP/1.1, HTTP/2, WebSocket, and async.
14. Q2: `HttpClient.send(...)` is?
15. A) Synchronous — blocks the calling thread until a response arrives (*)
16. B) Asynchronous, returns a CompletableFuture
17. C) Always non-blocking via NIO
18. D) Deprecated in Java 17
19. Explanation: send() blocks the calling thread. For non-blocking use sendAsync(), which returns a CompletableFuture<HttpResponse<T>>.
20. Q3: HTTP/2 multiplexing means?
21. A) Multiple HTTP methods per request
22. B) Multiple requests/responses share a single TCP connection via streams (*)
23. C) The server caches responses
24. D) Responses are encrypted twice
25. Explanation: HTTP/2 streams multiple logical requests over one TCP connection, avoiding head-of-line blocking and per-request connection setup.
26. Q4: ServerSocket's `accept()` method?
27. A) Returns immediately with a null Socket if no client
28. B) Throws IOException every 5s
29. C) Blocks until a client connects, then returns a Socket for that connection (*)
30. D) Only accepts UDP
31. Explanation: accept() blocks waiting for an incoming connection; when one arrives, it returns a Socket bound to that client. Set a SO_TIMEOUT to bound the wait.
32. Q5: Forgetting to set a read timeout on a Socket means?
33. A) The socket auto-closes after 1s
34. B) The JVM throws SocketTimeoutException immediately
35. C) Nothing — the OS handles it
36. D) A hung peer can hang your thread indefinitely (*)
37. Explanation: Without SO_TIMEOUT, read() blocks indefinitely if the peer stops responding; always set a timeout to fail fast.
38. Q6: URI vs URL — which is broader?
39. A) URI is broader; URL is a URI that includes an access mechanism (*)
40. B) URL is broader
41. C) They are identical
42. D) URN is broader than both
43. Explanation: URI is the superset; URL is a URI with a location (https://...); URN is a URI naming things without location (urn:isbn:...).
44. Q7: BodyHandlers.ofString() returns a handler that?
45. A) Streams the body as bytes
46. B) Accumulates the body into a String (*)
47. C) Discards the body
48. D) Writes the body to a file
49. Explanation: ofString() collects the entire response body into a String using the charset from Content-Type (or UTF-8 by default). ofInputStream, ofFile, ofByteArray are alternatives.
50. Q8: HttpURLConnection is generally avoided in new code because?
51. A) It was removed in Java 11
52. B) It requires a third-party JAR
53. C) It's synchronous-only, awkward, and lacks HTTP/2 (*)
54. D) It only supports FTP
55. Explanation: HttpURLConnection (1996-era) has a clunky API, blocks the calling thread, and supports only HTTP/1.1. HttpClient supersedes it for new code.
56. Q9: HttpClient's sendAsync returns a?
57. A) Future<HttpResponse>
58. B) Mono<HttpResponse>
59. C) Optional<HttpResponse>
60. D) CompletableFuture<HttpResponse<T>> (*)
61. Explanation: sendAsync returns CompletableFuture<HttpResponse<T>>, letting you chain thenApply/thenCompose/exceptionally for non-blocking composition.
62. Q10: To send a JSON POST body with HttpClient, use?
63. A) BodyPublishers.ofString(json) (*)
64. B) BodyHandlers.ofString
65. C) .body(json)
66. D) A FileWriter
67. Explanation: BodyPublishers produce request bodies; BodyHandlers consume response bodies. POST(BodyPublishers.ofString(json)) sends a String body as bytes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: The modern Java HTTP client (`java.net.http.HttpClient`) was finalized in?
  options:
    - Java 8
    - Java 14
    - Java 17
    - Java 11
  correctIndex: 3
  explanation: HttpClient (JEP 321) was finalized in Java 11 after incubation in Java 9-10. It supports HTTP/1.1, HTTP/2, WebSocket, and async.
- id: q2
  question: "`HttpClient.send(...)` is?"
  options:
    - Synchronous — blocks the calling thread until a response arrives
    - Asynchronous, returns a CompletableFuture
    - Always non-blocking via NIO
    - Deprecated in Java 17
  correctIndex: 0
  explanation: send() blocks the calling thread. For non-blocking use sendAsync(), which returns a CompletableFuture<HttpResponse<T>>.
- id: q3
  question: HTTP/2 multiplexing means?
  options:
    - Multiple HTTP methods per request
    - Multiple requests/responses share a single TCP connection via streams
    - The server caches responses
    - Responses are encrypted twice
  correctIndex: 1
  explanation: HTTP/2 streams multiple logical requests over one TCP connection, avoiding head-of-line blocking and per-request connection setup.
- id: q4
  question: ServerSocket's `accept()` method?
  options:
    - Returns immediately with a null Socket if no client
    - Throws IOException every 5s
    - Blocks until a client connects, then returns a Socket for that connection
    - Only accepts UDP
  correctIndex: 2
  explanation: accept() blocks waiting for an incoming connection; when one arrives, it returns a Socket bound to that client. Set a SO_TIMEOUT to bound the wait.
- id: q5
  question: Forgetting to set a read timeout on a Socket means?
  options:
    - The socket auto-closes after 1s
    - The JVM throws SocketTimeoutException immediately
    - Nothing — the OS handles it
    - A hung peer can hang your thread indefinitely
  correctIndex: 3
  explanation: Without SO_TIMEOUT, read() blocks indefinitely if the peer stops responding; always set a timeout to fail fast.
- id: q6
  question: URI vs URL — which is broader?
  options:
    - URI is broader; URL is a URI that includes an access mechanism
    - URL is broader
    - They are identical
    - URN is broader than both
  correctIndex: 0
  explanation: URI is the superset; URL is a URI with a location (https://...); URN is a URI naming things without location (urn:isbn:...).
- id: q7
  question: BodyHandlers.ofString() returns a handler that?
  options:
    - Streams the body as bytes
    - Accumulates the body into a String
    - Discards the body
    - Writes the body to a file
  correctIndex: 1
  explanation: ofString() collects the entire response body into a String using the charset from Content-Type (or UTF-8 by default). ofInputStream, ofFile, ofByteArray are alternatives.
- id: q8
  question: HttpURLConnection is generally avoided in new code because?
  options:
    - It was removed in Java 11
    - It requires a third-party JAR
    - It's synchronous-only, awkward, and lacks HTTP/2
    - It only supports FTP
  correctIndex: 2
  explanation: HttpURLConnection (1996-era) has a clunky API, blocks the calling thread, and supports only HTTP/1.1. HttpClient supersedes it for new code.
- id: q9
  question: HttpClient's sendAsync returns a?
  options:
    - Future<HttpResponse>
    - Mono<HttpResponse>
    - Optional<HttpResponse>
    - CompletableFuture<HttpResponse<T>>
  correctIndex: 3
  explanation: sendAsync returns CompletableFuture<HttpResponse<T>>, letting you chain thenApply/thenCompose/exceptionally for non-blocking composition.
- id: q10
  question: To send a JSON POST body with HttpClient, use?
  options:
    - BodyPublishers.ofString(json)
    - BodyHandlers.ofString
    - .body(json)
    - A FileWriter
  correctIndex: 0
  explanation: BodyPublishers produce request bodies; BodyHandlers consume response bodies. POST(BodyPublishers.ofString(json)) sends a String body as bytes.
```

