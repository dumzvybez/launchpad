---
slug: php-rest-apis-slim-laravel-zero
id: php-17
track: php
order: 17
title: REST APIs with Slim or Laravel Zero
description: Build RESTful JSON APIs with the Slim 4 microframework — routing, PSR-7 request/response objects, PSR-15 middleware, JSON error handling, and request validation.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=12800s
whyItMatters: Build RESTful JSON APIs with the Slim 4 microframework — routing, PSR-7 request/response objects, PSR-15 middleware, JSON error handling, and request validation.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# REST APIs with Slim or Laravel Zero

## REST APIs with Slim or Laravel Zero

### Why It Matters

Build RESTful JSON APIs with the Slim 4 microframework — routing, PSR-7 request/response objects, PSR-15 middleware, JSON error handling, and request validation.

Build RESTful JSON APIs with the Slim 4 microframework — routing, PSR-7 request/response objects, PSR-15 middleware, JSON error handling, and request validation.

### Prerequisites

- Stage 11: OOP — Inheritance, Interfaces, Traits
- Stage 14: PDO and Database Access
- Stage 16: Error Handling, Exceptions, and Logging

### Topics

- REST principles: resources, HTTP methods, status codes, statelessness
- Slim 4 app structure: `AppFactory`, `addRoutingMiddleware`, `addBodyParsingMiddleware`
- PSR-7: `ServerRequestInterface`, `ResponseInterface`, `StreamInterface`
- Route definition: `$app->get('/users/{id}', $handler)`
- Route groups and named routes
- PSR-15 middleware: `MiddlewareInterface`, `process()`
- Request body parsing for JSON (`addBodyParsingMiddleware`)
- Response helpers: `withStatus`, `withHeader`, `withJson` (custom)
- Validation with `respect/validation` or custom validators
- Error handling: custom error renderer, problem+json (RFC 7807)
- Status code conventions: 200/201/204/400/401/403/404/409/422/500

### Key Concepts

- REST (Representational State Transfer) emphasizes resources identified by URLs, manipulated via HTTP methods (GET/POST/PUT/PATCH/DELETE), with stateless responses and standard status codes.
- PSR-7 immutability: every `with*` method returns a NEW response object; the original is unchanged. Always `return $response` from handlers.
- Slim 4 is PSR-15 middleware-based: each request flows through a stack of middleware (in reverse order) before reaching the route handler, and the response flows back out.
- JSON request bodies require `addBodyParsingMiddleware` (or manual `php://input` parsing) — `$_POST` is empty for `application/json`.
- Standard status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error.

```php
<?php
declare(strict_types=1);

use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();   // parse JSON body into $req->getParsedBody()
$app->addRoutingMiddleware();
$app->add(ErrorMiddleware::class);  // call LAST so it runs first (middleware is LIFO)

$app->get('/health', function (Request $req, Response $res): Response {
    $res->getBody()->write(json_encode(['status' => 'ok']));
    return $res->withHeader('Content-Type', 'application/json');
});

$app->run();
```
Caption: Slim 4 app skeleton

### Common Pitfalls

- Forgetting to return the Response from a handler — PSR-7 responses are immutable; `withStatus(404)` returns a NEW object that you must return. `$res->withStatus(404); return $res;` returns the original (200).
- Not parsing JSON request bodies — `$_POST` is empty for `application/json`; either add `addBodyParsingMiddleware` or read `php://input` and `json_decode` manually.
- Using 401 vs 403 incorrectly — 401 means "not authenticated" (no/invalid credentials); 403 means "authenticated but not permitted" (insufficient role). Mixing them confuses clients.
- Returning 200 with an error body — successful HTTP status codes (2xx) should mean success; validation failures should be 422 (or 400), not 200 with `{"error": ...}`.
- Not setting `Content-Type: application/json` — without it, clients can't reliably parse the body; some browsers and proxies may interpret it as HTML or text.

### Real-World Applications

- Slim is used by many APIs that need a lightweight framework: the Blackfire profiler's agent dashboard and some ApiPlatform integrations use Slim for the routing layer.
- Laravel Zero is a Slim-inspired micro-framework for CLI apps (used by Laravel Horizon's console, and by many companies for cron job runners).
- Stripe's PHP SDK is PSR-7-aware and integrates with any PSR-15 middleware stack, including Slim and Laravel.
- Wikipedia's REST API (`api.wikimedia.org`) is built on a custom PSR-15 stack with Slim-like routing and uses RFC 7807 problem+json for errors.

### Interview Questions

- 1. What's the difference between 401 and 403? — 401 Unauthorized = not authenticated (no/invalid credentials); 403 Forbidden = authenticated but not permitted (insufficient role).
- 2. Why are PSR-7 responses immutable? — Immutability prevents accidental mutation across middleware layers; `with*` methods return a new instance, so each layer's changes are isolated and predictable.
- 3. What does `addBodyParsingMiddleware` do? — Parses the request body based on `Content-Type` (JSON, form-encoded, XML) into `$req->getParsedBody()` — needed because `$_POST` is empty for JSON.
- 4. What is PSR-15? — A standard `MiddlewareInterface` with a single `process(ServerRequestInterface, RequestHandlerInterface): ResponseInterface` method; middleware wraps the request/response cycle in a stack.
- 5. What is RFC 7807 (problem+json)? — A standardized `application/problem+json` response format for HTTP errors with `type`, `title`, `status`, `detail`, and optional `instance` fields; clients can parse errors uniformly.

### Mini Project

Build a Bookmarks API with Slim 4: A REST API with endpoints for listing, creating, updating, and deleting bookmarks (URL + title + tags), plus a JWT-style Bearer auth middleware. Suggested approach:
  - Scaffold with `composer require slim/slim slim/psr7`
  - Use SQLite + PDO for storage with a `bookmarks` table
  - Define routes in a `/api/bookmarks` group with regex ID constraints `{id:\d+}`
  - Implement `AuthMiddleware` that checks the `Authorization: Bearer ...` header
  - Return problem+json on errors with appropriate status codes (400/401/404/422)

### Exercises

1. Install Slim 4 and create a `/health` endpoint returning `{"status": "ok"}` with the right Content-Type.
2. Add a POST route that reads JSON body via `getParsedBody()` and echoes it back with a 201 status.
3. Write a PSR-15 middleware that adds an `X-Response-Time` header with the duration in ms.
4. Implement a `/api/users/{id:\d+}` route that returns 404 problem+json for non-numeric IDs or missing users.
5. Set up the ErrorMiddleware to render JSON errors in production and detailed errors in dev.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which status code means "Created"?
9. A) 201 (*)
10. B) 200
11. C) 204
12. D) 301
13. Explanation: 201 Created is returned after a successful POST that creates a new resource; include a `Location` header pointing to the new resource.
14. Q2: Which status code means "authenticated but not permitted"?
15. A) 401
16. B) 403 (*)
17. C) 404
18. D) 422
19. Explanation: 403 Forbidden = the user is authenticated but lacks permission for the action. 401 Unauthorized = not authenticated at all.
20. Q3: Why are PSR-7 responses immutable?
21. A) For security
22. B) For performance
23. C) To prevent accidental mutation across middleware layers (*)
24. D) They aren't — they're mutable
25. Explanation: Immutability isolates each middleware's changes; `with*` methods return a new instance. Always `return $response` from handlers.
26. Q4: What does `addBodyParsingMiddleware` do?
27. A) Adds routing
28. B) Compresses responses
29. C) Adds CORS headers
30. D) Parses request body based on Content-Type into getParsedBody() (*)
31. Explanation: It parses JSON/form-encoded/XML bodies into `$req->getParsedBody()` — needed because `$_POST` is empty for `application/json`.
32. Q5: What is PSR-15?
33. A) A standard middleware interface with a single `process()` method (*)
34. B) A standard HTTP message interface
35. C) A standard logger interface
36. D) A standard cache interface
37. Explanation: PSR-15 defines `MiddlewareInterface::process(ServerRequestInterface, RequestHandlerInterface): ResponseInterface` — middleware as a stack of decorators.
38. Q6: Which Content-Type signals an RFC 7807 error response?
39. A) application/json
40. B) application/problem+json (*)
41. C) text/plain
42. D) application/error
43. Explanation: RFC 7807 uses `application/problem+json` with `type`, `title`, `status`, `detail`, and optional `instance` fields — a standardized error format for REST APIs.
44. Q7: Which HTTP method is idempotent (same effect if repeated)?
45. A) POST
46. B) PATCH (sometimes)
47. C) PUT (*)
48. D) CONNECT
49. Explanation: PUT and DELETE are idempotent — repeating them produces the same state. POST is not (each call creates a new resource). PATCH can be either.
50. Q8: What does `$res->withStatus(404)` do?
51. A) Returns the response with status 404
52. B) Mutates $res in place
53. C) Throws an exception
54. D) Returns a NEW response with status 404 (*)
55. Explanation: PSR-7 immutability: `withStatus` returns a NEW response with the status set; the original `$res` is unchanged. You must capture or return the result.
56. Q9: What is the convention for a POST that fails validation?
57. A) 422 Unprocessable Entity (*)
58. B) 200 with an error body
59. C) 500 Internal Server Error
60. D) 409 Conflict
61. Explanation: 422 Unprocessable Entity is the standard for semantic validation failures (the request was syntactically valid but the data didn't pass rules). 400 is for malformed syntax.
62. Q10: Which Slim method registers a route group with shared middleware?
63. A) `$app->routes(...)`
64. B) `$app->group('/api', $fn)->add(Middleware::class)` (*)
65. C) `$app->with(...)`
66. D) `$app->bundle(...)`
67. Explanation: `$app->group('/api', function (RouteCollectorProxy $g) { ... })->add(Middleware::class)` defines routes under `/api` with shared middleware applied to all.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which status code means "Created"?
  options:
    - "201"
    - "200"
    - "204"
    - "301"
  correctIndex: 0
  explanation: 201 Created is returned after a successful POST that creates a new resource; include a `Location` header pointing to the new resource.
- id: q2
  question: Which status code means "authenticated but not permitted"?
  options:
    - "401"
    - "403"
    - "404"
    - "422"
  correctIndex: 1
  explanation: 403 Forbidden = the user is authenticated but lacks permission for the action. 401 Unauthorized = not authenticated at all.
- id: q3
  question: Why are PSR-7 responses immutable?
  options:
    - For security
    - For performance
    - To prevent accidental mutation across middleware layers
    - They aren't — they're mutable
  correctIndex: 2
  explanation: Immutability isolates each middleware's changes; `with*` methods return a new instance. Always `return $response` from handlers.
- id: q4
  question: What does `addBodyParsingMiddleware` do?
  options:
    - Adds routing
    - Compresses responses
    - Adds CORS headers
    - Parses request body based on Content-Type into getParsedBody()
  correctIndex: 3
  explanation: It parses JSON/form-encoded/XML bodies into `$req->getParsedBody()` — needed because `$_POST` is empty for `application/json`.
- id: q5
  question: What is PSR-15?
  options:
    - A standard middleware interface with a single `process()` method
    - A standard HTTP message interface
    - A standard logger interface
    - A standard cache interface
  correctIndex: 0
  explanation: "PSR-15 defines `MiddlewareInterface::process(ServerRequestInterface, RequestHandlerInterface): ResponseInterface` — middleware as a stack of decorators."
- id: q6
  question: Which Content-Type signals an RFC 7807 error response?
  options:
    - application/json
    - application/problem+json
    - text/plain
    - application/error
  correctIndex: 1
  explanation: RFC 7807 uses `application/problem+json` with `type`, `title`, `status`, `detail`, and optional `instance` fields — a standardized error format for REST APIs.
- id: q7
  question: Which HTTP method is idempotent (same effect if repeated)?
  options:
    - POST
    - PATCH (sometimes)
    - PUT
    - CONNECT
  correctIndex: 2
  explanation: PUT and DELETE are idempotent — repeating them produces the same state. POST is not (each call creates a new resource). PATCH can be either.
- id: q8
  question: What does `$res->withStatus(404)` do?
  options:
    - Returns the response with status 404
    - Mutates $res in place
    - Throws an exception
    - Returns a NEW response with status 404
  correctIndex: 3
  explanation: "PSR-7 immutability: `withStatus` returns a NEW response with the status set; the original `$res` is unchanged. You must capture or return the result."
- id: q9
  question: What is the convention for a POST that fails validation?
  options:
    - 422 Unprocessable Entity
    - 200 with an error body
    - 500 Internal Server Error
    - 409 Conflict
  correctIndex: 0
  explanation: 422 Unprocessable Entity is the standard for semantic validation failures (the request was syntactically valid but the data didn't pass rules). 400 is for malformed syntax.
- id: q10
  question: Which Slim method registers a route group with shared middleware?
  options:
    - "`$app->routes(...)`"
    - "`$app->group('/api', $fn)->add(Middleware::class)`"
    - "`$app->with(...)`"
    - "`$app->bundle(...)`"
  correctIndex: 1
  explanation: "`$app->group('/api', function (RouteCollectorProxy $g) { ... })->add(Middleware::class)` defines routes under `/api` with shared middleware applied to all."
```

