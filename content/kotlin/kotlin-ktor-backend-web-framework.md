---
slug: kotlin-ktor-backend-web-framework
id: kotlin-18
track: kotlin
order: 18
title: Ktor — Backend Web Framework
description: "Build a Kotlin-native HTTP server with Ktor: routing, plugins, JSON content negotiation, status pages, and the HttpClient for outbound calls."
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=9180s
whyItMatters: "Build a Kotlin-native HTTP server with Ktor: routing, plugins, JSON content negotiation, status pages, and the HttpClient for outbound calls."
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Ktor — Backend Web Framework

## Ktor — Backend Web Framework

### Why It Matters

Build a Kotlin-native HTTP server with Ktor: routing, plugins, JSON content negotiation, status pages, and the HttpClient for outbound calls.

Build a Kotlin-native HTTP server with Ktor: routing, plugins, JSON content negotiation, status pages, and the HttpClient for outbound calls.

### Prerequisites

- Stage 1-17.
- Comfort with coroutines, serialization, and DSLs.

### Topics

- Ktor project structure (Gradle + application.conf)
- Application config and `embeddedServer`
- Routing DSL: `routing { get("/path") { } }`
- Plugins: ContentNegotiation, StatusPages, CallLogging, Routing
- JSON with kotlinx.serialization
- Request/response: `call.receive<T>()`, `call.respond(...)`
- HttpClient: GET, POST, JSON body
- Testing Ktor with `testApplication`

### Key Concepts

- Ktor is a coroutine-native framework — every request runs in a `suspend` lambda, no thread-per-request model.
- Plugins replace middleware: install once, applied to every call in the pipeline (`ContentNegotiation`, `StatusPages`, `Routing`).
- The routing DSL uses lambdas with receivers: `routing { route("/api") { get { } post { } } }`.
- `call.receive<T>()` deserializes the request body; `call.respond(value)` serializes the response — both suspend.
- `HttpClient` is coroutine-native: `client.get(url).body<MyDto>()` suspends until the response is fully received.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") { call.respondText("Hello, Ktor!") }
            get("/users/{id}") {
                val id = call.parameters["id"]
                call.respondText("User $id")
            }
        }
    }.start(wait = true)
}
```
Caption: Minimal server

### Common Pitfalls

- Forgetting to install `ContentNegotiation` before using `call.receive<T>()` — without it, Ktor doesn't know how to parse JSON and you get a `CannotTransformedException`.
- Calling blocking code in a route handler — Ktor runs on a small dispatcher; wrap blocking calls in `withContext(Dispatchers.IO)`.
- Mixing up `application.conf` and `embeddedServer` config — choose one; mixing leads to "port already in use" or config-not-applied bugs.
- Forgetting to close the `HttpClient` — it owns a connection pool and an event loop; use `HttpClient().use { }` or shut it down in a lifecycle hook.
- Using `runBlocking` inside a route — route handlers are already suspend; using `runBlocking` blocks the dispatcher and serializes all requests through one thread.

### Real-World Applications

- JetBrains uses Ktor for several internal microservices and the YouTrack mobile backend.
- Many Kotlin-only startups (e.g., Discord's smaller internal tools, Hashicorp's Kotlin services) use Ktor for its coroutine-native ergonomics.
- Ktor is the canonical choice for Kotlin Multiplatform HTTP clients (mobile + server share the same client API).
- Wire (encrypted messenger) uses Ktor's HttpClient in its Android and iOS apps via Kotlin Multiplatform.

### Interview Questions

- 1. What makes Ktor coroutine-native? — Every request runs in a `suspend` lambda on a dispatcher; no thread-per-request model — you can have thousands of concurrent connections on a few threads.
- 2. What is a Ktor plugin and how does it differ from middleware? — Plugins are installed once and applied to every call in the pipeline; conceptually similar to middleware but written as Kotlin DSL configuration.
- 3. How do you parse a JSON body in a Ktor route? — Install `ContentNegotiation` with `json()`, then `call.receive<MyDto>()` deserializes the request body.
- 4. Difference between `routing { }` and `install(Routing) { }`? — `install(Routing)` is the plugin install; `routing { }` is a convenience that installs (if needed) and lets you declare routes — most apps use `routing { }`.
- 5. Why must you close the `HttpClient`? — It owns a connection pool and event loop; not closing leaks connections and threads — use `use { }` or shut down in a lifecycle hook.

### Mini Project

Build a Tiny URL Shortener: A Ktor service with POST `/shorten` (returns a short code) and GET `/{code}` (redirects), in-memory map, JSON I/O, and a 404 handler. Suggested approach:
  - `embeddedServer(Netty, port = 8080) { module() }.start(wait = true)`
  - `install(ContentNegotiation) { json() }`
  - `install(StatusPages) { exception<NotFoundException> { call, _ -> call.respond(HttpStatusCode.NotFound) } }`
  - `routing { post("/shorten") { val req = call.receive<ShortenRequest>(); val code = generateCode(); store[code] = req.url; call.respond(ShortenResponse(code)) }; get("/{code}") { val code = call.parameters["code"]!!; val url = store[code] ?: throw NotFoundException(); call.respondRedirect(url) } }`
  - Test with `testApplication` and curl

### Exercises

1. Scaffold a Ktor project with `gradle init` or start.ktor.io; run and hit `http://localhost:8080/`.
2. Add a `/health` route returning JSON `{"status":"UP"}` using ContentNegotiation.
3. Add a `StatusPages` plugin that maps `IllegalArgumentException` to 400.
4. Use `HttpClient` to call a public API (jsonplaceholder) and deserialize a `Post` data class.
5. Write a `testApplication` test for one of your routes and verify status code and body.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Ktor?
9. A) A build tool
10. B) A coroutine-native Kotlin HTTP framework (server and client) (*)
11. C) A testing library
12. D) A JSON parser
13. Explanation: Ktor is JetBrains' coroutine-native HTTP framework — both server (Netty, Jetty, CIO) and client, sharing APIs across Kotlin Multiplatform.
14. Q2: How does Ktor handle requests?
15. A) One thread per request
16. B) Blocking servlet model
17. C) Each request runs in a suspend lambda on a dispatcher (*)
18. D) Single-threaded event loop only
19. Explanation: Ktor runs each request in a `suspend` lambda on a small dispatcher — no thread-per-request, so thousands of concurrent connections share a few threads.
20. Q3: Which plugin parses JSON request bodies?
21. A) Routing
22. B) StatusPages
23. C) CallLogging
24. D) ContentNegotiation (*)
25. Explanation: `install(ContentNegotiation) { json() }` registers kotlinx.serialization as the JSON converter; then `call.receive<T>()` deserializes the body.
26. Q4: How do you declare routes in Ktor?
27. A) `routing { get("/path") { } }` DSL (*)
28. B) Annotations on a controller class
29. C) XML config
30. D) YAML file
31. Explanation: Ktor uses a routing DSL with lambdas with receivers: `routing { get("/") { call.respondText("hi") } }`.
32. Q5: How do you get a path parameter from `/users/{id}`?
33. A) `call.path["id"]`
34. B) `call.parameters["id"]` (*)
35. C) `request.getParameter("id")`
36. D) `call.id`
37. Explanation: `call.parameters` is an application-parameters map; `call.parameters["id"]` returns the path parameter value (nullable String).
38. Q6: What does `call.respond(value)` do?
39. A) Prints to stdout
40. B) Throws an exception
41. C) Serializes `value` and writes the response (suspending) (*)
42. D) Closes the connection
43. Explanation: `call.respond(value)` uses ContentNegotiation to serialize `value` and write the HTTP response; it's a `suspend` function.
44. Q7: What is `StatusPages` for?
45. A) Serving static HTML
46. B) Logging requests
47. C) Routing
48. D) Mapping exceptions to HTTP responses (*)
49. Explanation: `install(StatusPages) { exception<E> { call, e -> call.respond(...) } }` maps thrown exceptions to HTTP responses — Ktor's error-handling plugin.
50. Q8: Why must you close the `HttpClient`?
51. A) It owns a connection pool and event loop (*)
52. B) Memory leak only
53. C) It's not necessary
54. D) To free the port
55. Explanation: `HttpClient` holds a connection pool, threads, and an event loop; not closing leaks resources. Use `client.use { }` or shut down in a lifecycle hook.
56. Q9: Which is the canonical Ktor test entry point?
57. A) `@SpringBootTest`
58. B) `testApplication { application { module() }; client.get("/") }` (*)
59. C) `runBlocking { ... }`
60. D) `MockMvc`
61. Explanation: `testApplication` from `ktor-server-test-host` configures the application in-test and provides a `client` to make requests without binding a real port.
62. Q10: Which engine is commonly used for production Ktor servers on the JVM?
63. A) Tomcat
64. B) Undertow
65. C) Netty (*)
66. D) Jetty only
67. Explanation: Netty is the default and most-used Ktor server engine on the JVM — async, high-throughput, and well-supported; CIO is a pure-Kotlin alternative.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is Ktor?
  options:
    - A build tool
    - A coroutine-native Kotlin HTTP framework (server and client)
    - A testing library
    - A JSON parser
    - and client, sharing APIs across Kotlin Multiplatform.
  correctIndex: 1
  explanation: Ktor is JetBrains' coroutine-native HTTP framework — both server (Netty, Jetty, CIO) and client, sharing APIs across Kotlin Multiplatform.
- id: q2
  question: How does Ktor handle requests?
  options:
    - One thread per request
    - Blocking servlet model
    - Each request runs in a suspend lambda on a dispatcher
    - Single-threaded event loop only
  correctIndex: 2
  explanation: Ktor runs each request in a `suspend` lambda on a small dispatcher — no thread-per-request, so thousands of concurrent connections share a few threads.
- id: q3
  question: Which plugin parses JSON request bodies?
  options:
    - Routing
    - StatusPages
    - CallLogging
    - ContentNegotiation
  correctIndex: 3
  explanation: "`install(ContentNegotiation) { json() }` registers kotlinx.serialization as the JSON converter; then `call.receive<T>()` deserializes the body."
- id: q4
  question: How do you declare routes in Ktor?
  options:
    - '`routing { get("/path") { } }` DSL'
    - Annotations on a controller class
    - XML config
    - YAML file
  correctIndex: 0
  explanation: 'Ktor uses a routing DSL with lambdas with receivers: `routing { get("/") { call.respondText("hi") } }`.'
- id: q5
  question: How do you get a path parameter from `/users/{id}`?
  options:
    - '`call.path["id"]`'
    - '`call.parameters["id"]`'
    - '`request.getParameter("id")`'
    - "`call.id`"
  correctIndex: 1
  explanation: '`call.parameters` is an application-parameters map; `call.parameters["id"]` returns the path parameter value (nullable String).'
- id: q6
  question: What does `call.respond(value)` do?
  options:
    - Prints to stdout
    - Throws an exception
    - Serializes `value` and writes the response (suspending)
    - Closes the connection
  correctIndex: 2
  explanation: "`call.respond(value)` uses ContentNegotiation to serialize `value` and write the HTTP response; it's a `suspend` function."
- id: q7
  question: What is `StatusPages` for?
  options:
    - Serving static HTML
    - Logging requests
    - Routing
    - Mapping exceptions to HTTP responses
  correctIndex: 3
  explanation: "`install(StatusPages) { exception<E> { call, e -> call.respond(...) } }` maps thrown exceptions to HTTP responses — Ktor's error-handling plugin."
- id: q8
  question: Why must you close the `HttpClient`?
  options:
    - It owns a connection pool and event loop
    - Memory leak only
    - It's not necessary
    - To free the port
  correctIndex: 0
  explanation: "`HttpClient` holds a connection pool, threads, and an event loop; not closing leaks resources. Use `client.use { }` or shut down in a lifecycle hook."
- id: q9
  question: Which is the canonical Ktor test entry point?
  options:
    - "`@SpringBootTest`"
    - '`testApplication { application { module() }; client.get("/") }`'
    - "`runBlocking { ... }`"
    - "`MockMvc`"
  correctIndex: 1
  explanation: "`testApplication` from `ktor-server-test-host` configures the application in-test and provides a `client` to make requests without binding a real port."
- id: q10
  question: Which engine is commonly used for production Ktor servers on the JVM?
  options:
    - Tomcat
    - Undertow
    - Netty
    - Jetty only
  correctIndex: 2
  explanation: Netty is the default and most-used Ktor server engine on the JVM — async, high-throughput, and well-supported; CIO is a pure-Kotlin alternative.
```

