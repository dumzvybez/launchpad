---
slug: fastapi-error-handling-custom-exceptions-exception-handlers
id: fastapi-18
track: fastapi
order: 18
title: Error Handling, Custom Exceptions, Exception Handlers
description: Raise `HTTPException` for HTTP errors, register custom exception handlers, transform Pydantic `RequestValidationError` into branded JSON, and log unhandled exceptions without leaking stack traces.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=5100s
whyItMatters: Raise `HTTPException` for HTTP errors, register custom exception handlers, transform Pydantic `RequestValidationError` into branded JSON, and log unhandled exceptions without leaking stack traces.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Error Handling, Custom Exceptions, Exception Handlers

## Error Handling, Custom Exceptions, Exception Handlers

### Why It Matters

Raise `HTTPException` for HTTP errors, register custom exception handlers, transform Pydantic `RequestValidationError` into branded JSON, and log unhandled exceptions without leaking stack traces.

Raise `HTTPException` for HTTP errors, register custom exception handlers, transform Pydantic `RequestValidationError` into branded JSON, and log unhandled exceptions without leaking stack traces.

### Prerequisites

- Stage 4: Pydantic Models and Validation
- Stage 5: Path Operation Decorators — tags, summary, response_model
- Stage 12: Testing with TestClient and pytest

### Topics

- `HTTPException(status_code=, detail=, headers=)` for HTTP errors
- `app.exception_handler(SomeException)` to register custom handlers
- `RequestValidationError` handler for branded 422 bodies
- `StarletteHTTPException` vs `fastapi.HTTPException`
- Custom domain exceptions (e.g., `UserNotFound`, `InsufficientFunds`)
- Logging unhandled exceptions; never expose stack traces to clients
- `JSONResponse` for full control over status, body, and headers
- Mapping exceptions to status codes in a single handler

### Key Concepts

- `HTTPException` is the standard way to return an HTTP error from a route or dependency.
- Custom exception handlers let you map domain exceptions (e.g., `UserNotFound`) to JSON responses with consistent shapes.
- The `RequestValidationError` handler receives the Pydantic error list; override it to brand the 422 body.
- Always log unhandled exceptions server-side; return a generic `{"detail": "Internal Server Error"}` to the client.
- `headers={"WWW-Authenticate": "Bearer"}` on a 401 helps clients retry with auth.

```python
from fastapi import FastAPI, HTTPException, status

app = FastAPI()

@app.get("/items/{iid}")
async def get_item(iid: int):
    if iid != 1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"item {iid} not found",
        )
    return {"id": iid}
```
Caption: HTTPException

### Common Pitfalls

- Catching `Exception` and returning 500 without logging — hides bugs; always log with `log.exception(...)`.
- Leaking stack traces in JSON responses — security risk; return a generic message, log details server-side.
- Forgetting to register the `RequestValidationError` handler before routes are hit — order doesn't matter at startup, but missing registration means default 422 bodies.
- Raising `HTTPException` from a background task — there's no request to return a response to; tasks must log and recover.
- Confusing `fastapi.HTTPException` with `starlette.exceptions.HTTPException` — subclass them carefully; FastAPI's is a subclass and is what `raise HTTPException` imports.

### Real-World Applications

- Stripe's API returns consistent error shapes (`{type, code, message, param}`) for every status code — exactly the branded-handler pattern.
- GitHub's API uses `{message, documentation_url}` for errors with stable types; FastAPI handlers can replicate this.
- Microsoft Graph returns `{error: {code, message}}` for all failures; a single exception handler can enforce this shape.
- Slack's web API returns `{ok: false, error: "..."}` for everything; a custom handler can wrap all responses.

### Interview Questions

- 1. How do you return a 404 from a route? — `raise HTTPException(status_code=404, detail="...")` — FastAPI converts it to a JSON response.
- 2. How do you map a domain exception to a JSON response? — Register `@app.exception_handler(MyException)` returning a `JSONResponse`.
- 3. How do you brand the 422 body? — Register a handler for `RequestValidationError` and return your custom JSON shape.
- 4. Why log unhandled exceptions instead of returning them? — Stack traces leak internals (paths, library versions) that attackers exploit; log server-side, return a generic 500.
- 5. How do you add `WWW-Authenticate` to a 401? — Pass `headers={"WWW-Authenticate": "Bearer"}` to `HTTPException`.

### Mini Project

Build a "Branded Error API": A small FastAPI app with a custom `InsufficientFunds` exception + handler, a branded `RequestValidationError` handler, and a catch-all `Exception` handler that logs and returns a generic 500. Add a `/charge` route that raises `InsufficientFunds` and a `/items/{iid}` route that 404s. Suggested approach:
  - Define `class InsufficientFunds(Exception)` with balance/needed
  - Register `@app.exception_handler(InsufficientFunds)` returning JSONResponse(422, ...)
  - Register `@app.exception_handler(RequestValidationError)` returning branded 422
  - Register `@app.exception_handler(Exception)` that logs and returns generic 500
  - Test each path with `TestClient`

### Exercises

1. Raise `HTTPException(404, detail="not found")` from a route and verify the JSON body.
2. Register a custom exception handler for a domain exception returning a JSONResponse with structured fields.
3. Override the `RequestValidationError` handler to return a branded 422 body.
4. Add a catch-all `Exception` handler that logs and returns a generic 500; trigger it with a route that raises `RuntimeError`.
5. >>> QUIZ (Stage 18) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How do you return a 404 from a route?
8. A) `return Response(404)`
9. B) `raise HTTPException(status_code=404, detail="not found")` (*)
10. C) `return {"status": 404}`
11. D) `request.status = 404`
12. Explanation: `HTTPException` is FastAPI's standard way to short-circuit a route with an HTTP error and a JSON body.
13. Q2: How do you map a custom domain exception to a JSON response?
14. A) Try/except in every route
15. B) Subclass HTTPException
16. C) Register `@app.exception_handler(MyException)` returning JSONResponse (*)
17. D) Use a middleware
18. Explanation: Exception handlers map an exception class to a response builder; one handler covers all routes.
19. Q3: Which exception class is raised on Pydantic validation failure in a request?
20. A) `ValidationError`
21. B) `HTTPException`
22. C) `ValueError`
23. D) `RequestValidationError` (*)
24. Explanation: FastAPI raises `RequestValidationError` (a subclass of Pydantic's `ValidationError`) with `errors()` listing each failure.
25. Q4: Why log unhandled exceptions instead of returning them?
26. A) Stack traces leak internals (paths, library versions) attackers exploit (*)
27. B) For performance
28. C) Logs are required by law
29. D) It's faster
30. Explanation: Always log server-side with `log.exception`; return a generic message to avoid leaking implementation details.
31. Q5: How do you add `WWW-Authenticate` to a 401 response?
32. A) Set `request.headers["WWW-Authenticate"]`
33. B) Pass `headers={"WWW-Authenticate": "Bearer"}` to HTTPException (*)
34. C) Use a middleware
35. D) You can't — headers are fixed
36. Explanation: `HTTPException(headers=...)` lets you set response headers; this is the standard way to hint auth to clients.
37. Q6: Which handler catches every uncaught exception?
38. A) `@app.exception_handler(HTTPException)`
39. B) `@app.exception_handler(BaseException)`
40. C) `@app.exception_handler(Exception)` (*)
41. D) `@app.exception_handler(RuntimeError)`
42. Explanation: Registering a handler for `Exception` catches all unhandled subclasses; log and return a generic 500.
43. Q7: What's the relationship between `fastapi.HTTPException` and `starlette.exceptions.HTTPException`?
44. A) They're unrelated
45. B) Starlette's is a subclass of FastAPI's
46. C) They're the same class
47. D) FastAPI's is a subclass of Starlette's (*)
48. Explanation: `fastapi.HTTPException` subclasses Starlette's to add `detail`-aware rendering; both work, but import from FastAPI for consistency.
49. Q8: What happens if you raise `HTTPException` from a background task?
50. A) There's no request to respond to; the exception is logged by Starlette but the client already got 200 (*)
51. B) The client gets the error
52. C) The task is retried
53. D) The worker crashes
54. Explanation: Background tasks run after the response is sent; exceptions can't reach the client. Log and recover in the task body.
55. Q9: Which is a recommended branded error shape?
56. A) Free-form per route
57. B) `{"error": "<code>", "message": "...", "details": {...}}` (consistent across all status codes) (*)
58. C) Bare strings
59. D) Stack traces
60. Explanation: A consistent shape (`error`, `message`, `details`) lets clients parse errors uniformly; route it through exception handlers.
61. Q10: Why register a handler for `RequestValidationError`?
62. A) To speed up validation
63. B) To disable validation
64. C) To brand the 422 response body with a consistent shape (*)
65. D) To raise 500 instead
66. Explanation: The default 422 body is Pydantic's; a custom handler lets you wrap it in your API's error contract.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you return a 404 from a route?
  options:
    - "`return Response(404)`"
    - '`raise HTTPException(status_code=404, detail="not found")`'
    - '`return {"status": 404}`'
    - "`request.status = 404`"
  correctIndex: 1
  explanation: "`HTTPException` is FastAPI's standard way to short-circuit a route with an HTTP error and a JSON body."
- id: q2
  question: How do you map a custom domain exception to a JSON response?
  options:
    - Try/except in every route
    - Subclass HTTPException
    - Register `@app.exception_handler(MyException)` returning JSONResponse
    - Use a middleware
  correctIndex: 2
  explanation: Exception handlers map an exception class to a response builder; one handler covers all routes.
- id: q3
  question: Which exception class is raised on Pydantic validation failure in a request?
  options:
    - "`ValidationError`"
    - "`HTTPException`"
    - "`ValueError`"
    - "`RequestValidationError`"
  correctIndex: 3
  explanation: FastAPI raises `RequestValidationError` (a subclass of Pydantic's `ValidationError`) with `errors()` listing each failure.
- id: q4
  question: Why log unhandled exceptions instead of returning them?
  options:
    - Stack traces leak internals (paths, library versions) attackers exploit
    - For performance
    - Logs are required by law
    - It's faster
  correctIndex: 0
  explanation: Always log server-side with `log.exception`; return a generic message to avoid leaking implementation details.
- id: q5
  question: How do you add `WWW-Authenticate` to a 401 response?
  options:
    - Set `request.headers["WWW-Authenticate"]`
    - 'Pass `headers={"WWW-Authenticate": "Bearer"}` to HTTPException'
    - Use a middleware
    - You can't — headers are fixed
  correctIndex: 1
  explanation: "`HTTPException(headers=...)` lets you set response headers; this is the standard way to hint auth to clients."
- id: q6
  question: Which handler catches every uncaught exception?
  options:
    - "`@app.exception_handler(HTTPException)`"
    - "`@app.exception_handler(BaseException)`"
    - "`@app.exception_handler(Exception)`"
    - "`@app.exception_handler(RuntimeError)`"
  correctIndex: 2
  explanation: Registering a handler for `Exception` catches all unhandled subclasses; log and return a generic 500.
- id: q7
  question: What's the relationship between `fastapi.HTTPException` and `starlette.exceptions.HTTPException`?
  options:
    - They're unrelated
    - Starlette's is a subclass of FastAPI's
    - They're the same class
    - FastAPI's is a subclass of Starlette's
  correctIndex: 3
  explanation: "`fastapi.HTTPException` subclasses Starlette's to add `detail`-aware rendering; both work, but import from FastAPI for consistency."
- id: q8
  question: What happens if you raise `HTTPException` from a background task?
  options:
    - There's no request to respond to; the exception is logged by Starlette but the client already got 200
    - The client gets the error
    - The task is retried
    - The worker crashes
  correctIndex: 0
  explanation: Background tasks run after the response is sent; exceptions can't reach the client. Log and recover in the task body.
- id: q9
  question: Which is a recommended branded error shape?
  options:
    - Free-form per route
    - '`{"error": "<code>", "message": "...", "details": {...}}` (consistent across all status codes)'
    - Bare strings
    - Stack traces
  correctIndex: 1
  explanation: A consistent shape (`error`, `message`, `details`) lets clients parse errors uniformly; route it through exception handlers.
- id: q10
  question: Why register a handler for `RequestValidationError`?
  options:
    - To speed up validation
    - To disable validation
    - To brand the 422 response body with a consistent shape
    - To raise 500 instead
  correctIndex: 2
  explanation: The default 422 body is Pydantic's; a custom handler lets you wrap it in your API's error contract.
```

