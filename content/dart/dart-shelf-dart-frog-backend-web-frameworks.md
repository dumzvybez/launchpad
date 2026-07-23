---
slug: dart-shelf-dart-frog-backend-web-frameworks
id: dart-18
track: dart
order: 18
title: Shelf and Dart Frog — Backend Web Frameworks
description: Build HTTP servers in Dart using the low-level `shelf` package and the convention-over-configuration `dart_frog` framework; route requests, parse JSON, return responses, and integrate middleware.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=10200s
whyItMatters: Build HTTP servers in Dart using the low-level `shelf` package and the convention-over-configuration `dart_frog` framework; route requests, parse JSON, return responses, and integrate middleware.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Shelf and Dart Frog — Backend Web Frameworks

## Shelf and Dart Frog — Backend Web Frameworks

### Why It Matters

Build HTTP servers in Dart using the low-level `shelf` package and the convention-over-configuration `dart_frog` framework; route requests, parse JSON, return responses, and integrate middleware.

Build HTTP servers in Dart using the low-level `shelf` package and the convention-over-configuration `dart_frog` framework; route requests, parse JSON, return responses, and integrate middleware.

### Prerequisites

- Stage 11: Async Programming — Future, async/await
- Stage 13: Error Handling — try/catch, custom exceptions
- Stage 14: File I/O and Serialization

### Topics

- `shelf`: `Handler`, `Response`, `Request`, `Middleware`
- `shelf_router` for typed routes
- `dart_frog`: file-based routing in `routes/`
- Request parsing: JSON body, query params, path params
- Responses: `Response.json`, `Response(body: ...)`, status codes
- Middleware: logging, CORS, auth, error handling
- Hot reload via `dart_frog dev`
- Deployment via Docker and `dart_frog build`

### Key Concepts

- `shelf` is a small composable server abstraction: a `Handler` is `Future<Response> Function(Request)`.
- Middleware wraps handlers: `handler = middleware(innerHandler)`; `shelf` provides `Pipeline().addMiddleware(logRequests()).addHandler(...)`.
- `dart_frog` builds on shelf with file-based routing: `routes/users/[id].dart` becomes `GET /users/:id`.
- A route file exports `onRequest(RequestContext context, String id)`; dynamic segments become parameters.
- All responses should set explicit Content-Type and status codes; `Response.ok` defaults to 200.
- Hot reload during dev (`dart_frog dev`) restarts the server on file changes for fast iteration.

```dart
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';

final app = Router();

app.get('/hello/<name>', (Request req, String name) {
  return Response.ok('Hello, $name!');
});

void main() async {
  final handler = const Pipeline()
      .addMiddleware(logRequests())
      .addHandler(app);
  final server = await io.serve(handler, 'localhost', 8080);
  print('Serving at http://${server.address.host}:${server.port}');
}
```
Caption: Basic Shelf server

### Common Pitfalls

- Forgetting to await `request.json()` — the body is a Future; not awaiting returns a `_Future` that won't deserialize.
- Not setting Content-Type — `Response(body: ...)` defaults to `text/plain`; for JSON use `Response.json(body: ...)`.
- Catching errors at the handler level only — wrap with a `Pipeline().addMiddleware(...)` for global error handling so an uncaught throw becomes a 500, not a server crash.
- Blocking the event loop with sync work — long-running CPU work blocks all requests; offload to an isolate (Stage 15).
- Returning `null` from a route expecting `Response` — the route signature requires `Future<Response>`; `null` is a type error. Return a 404 explicitly.

### Real-World Applications

- Google's internal teams use shelf-based services for tools and dashboards.
- Very Good Ventures (a Dart consultancy) ships production backends with Dart Frog for clients like PowerSync and MeinGroßerGarten.
- The Flutter team's `package:flutter_goldens` server uses shelf for tooling.
- BMW's myBMW backend uses shelf microservices for telemetry ingestion alongside their Flutter app.

### Interview Questions

- 1. What is a Shelf `Handler`? — A function `Future<Response> Function(Request)`; the basic unit of server logic.
- 2. How does Shelf middleware compose? — A `Pipeline` chains middleware: `Pipeline().addMiddleware(...).addHandler(...)`; each middleware wraps the next.
- 3. What does `dart_frog` add over shelf? — File-based routing, hot reload in dev, providers (DI), and a build step that bundles into a single Docker image.
- 4. How do you parse a JSON body in Dart Frog? — `await context.request.json() as Map<String, dynamic>` (it returns a Future of dynamic).
- 5. How do you deploy a Dart Frog app? — `dart_frog build` produces a server in `build/`, then run with `dart build/bin/server.dart` or containerize with Docker.

### Mini Project

Build a Tiny URL Shortener: A Dart Frog service with `POST /shorten` (takes a URL, returns a short code) and `GET /<code>` (redirects to the original URL). Store mappings in-memory (or in a JSON file for persistence). Add an auth middleware checking a Bearer token. Suggested approach:
  - `routes/shorten.dart`: POST handler that generates a 6-char code and stores in a `Map<String, String>`
  - `routes/[code].dart`: GET handler that looks up the code and returns `Response(statusCode: 301, headers: {'location': url})`
  - `middleware.dart`: Bearer-token check
  - Run with `dart_frog dev --port 8080`
  - Test with `curl -X POST localhost:8080/shorten -d '{"url":"..."}'`

### Exercises

1. Build a Shelf server with `GET /health` returning `{"status":"ok"}`.
2. Add `shelf_router` with a `/<name>` route returning a greeting.
3. Create a Dart Frog route that returns the request's user-agent header.
4. Add a middleware that logs request method and path.
5. Deploy a Dart Frog app to Docker via `dart_frog build` + a Dockerfile.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a Shelf Handler?
9. A) A class that extends Handler
10. B) A function Future<Response> Function(Request) (*)
11. C) An async generator
12. D) A JSON converter
13. Explanation: A Handler is a function from Request to Future<Response>; it's the basic unit of shelf server logic.
14. Q2: How does middleware compose in Shelf?
15. A) Via inheritance
16. B) Via global state
17. C) Via a Pipeline that wraps handlers (*)
18. D) Via reflection
19. Explanation: `Pipeline().addMiddleware(mw).addHandler(h)` returns a handler where `mw` wraps `h`; multiple middlewares compose in order.
20. Q3: What does `dart_frog` provide over raw shelf?
21. A) A faster HTTP server
22. B) A built-in database
23. C) A GUI editor
24. D) File-based routing, hot reload, and DI providers (*)
25. Explanation: Dart Frog adds file-based routing (routes/<path>.dart), hot reload (`dart_frog dev`), dependency injection via providers, and a build step.
26. Q4: How do you parse a JSON body in Dart Frog?
27. A) await context.request.json() as Map<String, dynamic> (*)
28. B) request.body.json()
29. C) jsonDecode(request.body)
30. D) context.body.parse()
31. Explanation: `context.request.json()` returns a `Future<dynamic>`; await it and cast to the expected shape (usually `Map<String, dynamic>`).
32. Q5: What does `Response.json(body: ...)` do?
33. A) Sends plain text
34. B) Sets Content-Type: application/json and JSON-encodes the body (*)
35. C) Returns HTML
36. D) Streams the response
37. Explanation: `Response.json` serializes the body via `jsonEncode` and sets `Content-Type: application/json`; the default `Response(body: ...)` is `text/plain`.
38. Q6: How are path parameters declared in Dart Frog?
39. A) routes/_id.dart
40. B) routes/{id}.dart
41. C) routes/[id].dart (*)
42. D) routes/:id.dart
43. Explanation: File name with brackets `[id].dart` declares a dynamic segment; `id` becomes a parameter to `onRequest`.
44. Q7: What does `dart_frog dev` do?
45. A) Builds a production bundle
46. B) Generates documentation
47. C) Runs tests
48. D) Runs a dev server with hot reload (*)
49. Explanation: `dart_frog dev` starts a dev server that watches files and restarts on change, enabling fast iteration.
50. Q8: How do you set a redirect response?
51. A) Response(statusCode: 301, headers: {'location': url}) (*)
52. B) Response.redirect(url)
53. C) Response.ok(url)
54. D) Response.moved(url)
55. Explanation: A 301 (or 302) with a `location` header triggers a redirect; set both via `Response(statusCode: ..., headers: ...)`.
56. Q9: What happens if you forget to await `request.json()`?
57. A) Compile error
58. B) Returns a Future instead of the parsed body (*)
59. C) Throws at runtime
60. D) Auto-awaits
61. Explanation: `request.json()` returns a Future; not awaiting returns the Future object, not the deserialized map, leading to confusing type errors downstream.
62. Q10: How do you deploy a Dart Frog app?
63. A) dart_frog deploy (always)
64. B) dart pub publish
65. C) dart_frog build then run build/bin/server.dart (or Dockerize) (*)
66. D) dart compile exe
67. Explanation: `dart_frog build` produces a standalone server bundle in `build/`; run it with `dart build/bin/server.dart` or containerize with a Dockerfile.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a Shelf Handler?
  options:
    - A class that extends Handler
    - A function Future<Response> Function(Request)
    - An async generator
    - A JSON converter
  correctIndex: 1
  explanation: A Handler is a function from Request to Future<Response>; it's the basic unit of shelf server logic.
- id: q2
  question: How does middleware compose in Shelf?
  options:
    - Via inheritance
    - Via global state
    - Via a Pipeline that wraps handlers
    - Via reflection
  correctIndex: 2
  explanation: "`Pipeline().addMiddleware(mw).addHandler(h)` returns a handler where `mw` wraps `h`; multiple middlewares compose in order."
- id: q3
  question: What does `dart_frog` provide over raw shelf?
  options:
    - A faster HTTP server
    - A built-in database
    - A GUI editor
    - File-based routing, hot reload, and DI providers
  correctIndex: 3
  explanation: Dart Frog adds file-based routing (routes/<path>.dart), hot reload (`dart_frog dev`), dependency injection via providers, and a build step.
- id: q4
  question: How do you parse a JSON body in Dart Frog?
  options:
    - await context.request.json() as Map<String, dynamic>
    - request.body.json()
    - jsonDecode(request.body)
    - context.body.parse()
  correctIndex: 0
  explanation: "`context.request.json()` returns a `Future<dynamic>`; await it and cast to the expected shape (usually `Map<String, dynamic>`)."
- id: q5
  question: "What does `Response.json(body: ...)` do?"
  options:
    - Sends plain text
    - "Sets Content-Type: application/json and JSON-encodes the body"
    - Returns HTML
    - Streams the response
  correctIndex: 1
  explanation: "`Response.json` serializes the body via `jsonEncode` and sets `Content-Type: application/json`; the default `Response(body: ...)` is `text/plain`."
- id: q6
  question: How are path parameters declared in Dart Frog?
  options:
    - routes/_id.dart
    - routes/{id}.dart
    - routes/[id].dart
    - routes/:id.dart
  correctIndex: 2
  explanation: File name with brackets `[id].dart` declares a dynamic segment; `id` becomes a parameter to `onRequest`.
- id: q7
  question: What does `dart_frog dev` do?
  options:
    - Builds a production bundle
    - Generates documentation
    - Runs tests
    - Runs a dev server with hot reload
  correctIndex: 3
  explanation: "`dart_frog dev` starts a dev server that watches files and restarts on change, enabling fast iteration."
- id: q8
  question: How do you set a redirect response?
  options:
    - "Response(statusCode: 301, headers: {'location': url})"
    - Response.redirect(url)
    - Response.ok(url)
    - Response.moved(url)
  correctIndex: 0
  explanation: "A 301 (or 302) with a `location` header triggers a redirect; set both via `Response(statusCode: ..., headers: ...)`."
- id: q9
  question: What happens if you forget to await `request.json()`?
  options:
    - Compile error
    - Returns a Future instead of the parsed body
    - Throws at runtime
    - Auto-awaits
  correctIndex: 1
  explanation: "`request.json()` returns a Future; not awaiting returns the Future object, not the deserialized map, leading to confusing type errors downstream."
- id: q10
  question: How do you deploy a Dart Frog app?
  options:
    - dart_frog deploy (always)
    - dart pub publish
    - dart_frog build then run build/bin/server.dart (or Dockerize)
    - dart compile exe
  correctIndex: 2
  explanation: "`dart_frog build` produces a standalone server bundle in `build/`; run it with `dart build/bin/server.dart` or containerize with a Dockerfile."
```

