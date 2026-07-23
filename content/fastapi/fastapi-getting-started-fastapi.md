---
slug: fastapi-getting-started-fastapi
id: fastapi-01
track: fastapi
order: 1
title: Getting Started with FastAPI
description: Install FastAPI and Uvicorn, write your first path operation, run the dev server, and explore the auto-generated /docs and /redoc pages.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams
whyItMatters: Install FastAPI and Uvicorn, write your first path operation, run the dev server, and explore the auto-generated /docs and /redoc pages.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Getting Started with FastAPI

## Getting Started with FastAPI

### Why It Matters

Install FastAPI and Uvicorn, write your first path operation, run the dev server, and explore the auto-generated /docs and /redoc pages.

Install FastAPI and Uvicorn, write your first path operation, run the dev server, and explore the auto-generated /docs and /redoc pages.

### Prerequisites

- None — basic Python knowledge is helpful.
- Comfort creating and activating a virtualenv (`python3 -m venv .venv`).
- Familiarity with HTTP methods (GET/POST) and JSON.

### Topics

- Installing FastAPI 0.110+ and Uvicorn in a virtualenv
- The minimal `app = FastAPI()` and a `@app.get("/")` path operation
- Running `uvicorn main:app --reload` and reading the startup logs
- The automatic /docs (Swagger UI) and /redoc (ReDoc) pages
- ASGI vs WSGI: why FastAPI needs Uvicorn/Daphne/Hypercorn
- The route handler signature: parameters come from type hints
- Returning dicts, lists, and Pydantic models (JSON auto-serialized)
- Project layout options: single-file vs package, and when to split

### Key Concepts

- FastAPI is an ASGI framework; it must run under an ASGI server (Uvicorn, Daphne, Hypercorn) — never Gunicorn's sync workers.
- Type hints are not documentation: FastAPI uses them to parse, validate, and document request and response data.
- `--reload` watches files and restarts the server on change; never enable it in production.
- /docs and /redoc are generated at runtime from the OpenAPI schema stored at /openapi.json.
- Route handlers can be `def` (run in a threadpool) or `async def` (run on the event loop) — choosing wrong is a top performance bug.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install "fastapi>=0.110" "uvicorn[standard]>=0.29"
# Save pinned requirements
pip freeze > requirements.txt
# Run with auto-reload for dev
uvicorn main:app --reload --port 8000
```
Caption: Install and run

### Common Pitfalls

- Running `python main.py` and expecting the server to start — FastAPI apps don't run themselves; invoke `uvicorn main:app` or add a `if __name__ == "__main__": uvicorn.run(...)` block.
- Forgetting `--reload` in dev (or enabling it in prod) — reload watches the filesystem and restarts on save; in prod it adds overhead and can mask file-path issues.
- Installing only `fastapi` without `uvicorn[standard]` — the standard extra bundles uvloop and httptools, which are 2-4x faster than the pure-Python defaults.
- Using `from fastapi import FastAPI` and forgetting to instantiate — `app = FastAPI()` is what registers your routes; a bare import does nothing.
- Treating type hints as optional comments — FastAPI enforces them at runtime; `item_id: int` rejects `?item_id=abc` with a 422 before your code runs.

### Real-World Applications

- Netflix's engineering blog has described FastAPI-powered internal microservices for metadata and recommendation pipelines because of its async throughput and automatic OpenAPI contracts.
- Uber's Michelangelo PyML serving layer uses FastAPI to wrap Python ML models behind a typed REST API consumed by upstream model routers.
- Microsoft uses FastAPI in several Azure ML and Synapse patterns for managed online inference endpoints.
- OpenAI's early API tooling and several internal batch-job wrappers are reported to use FastAPI for its Pydantic integration with shared model schemas.

### Interview Questions

- 1. What is ASGI and why does FastAPI need it? — ASGI (Asynchronous Server Gateway Interface) is the async successor to WSGI; FastAPI relies on async I/O, so it requires an ASGI server like Uvicorn.
- 2. What does `uvicorn main:app --reload` actually do? — Uvicorn imports the `app` object from `main.py` and serves it via the ASGI protocol; `--reload` watches files and restarts on save.
- 3. Why are type hints mandatory in FastAPI? — FastAPI uses them to parse path/query params, validate request bodies via Pydantic, and auto-generate the OpenAPI schema.
- 4. What's the difference between /docs and /redoc? — Both render the same /openapi.json; /docs is Swagger UI (interactive), /redoc is a cleaner read-only three-pane layout.
- 5. When would you choose `def` over `async def` for a route handler? — Use `def` (run in a threadpool) for blocking CPU/IO work that has no async equivalent; `async def` for I/O-bound work using async libraries.

### Mini Project

Build a "Ping" Health-Check API: A single-file FastAPI app with `/`, `/health`, and `/echo/{word}` endpoints that returns JSON. The `/health` route should include a fake uptime counter and the `/echo/{word}` route should reject non-alpha words with a 422 by typing the param as a constrained str. Suggested approach:
  - Create `main.py` with `app = FastAPI(title="Ping API")`
  - Add `/` returning `{"service": "ping", "version": "0.1.0"}`
  - Add `/health` with a module-level `START = time.time()` and compute uptime
  - Add `/echo/{word}` typed `word: str` with a regex constraint via `Annotated[str, Path(pattern=r"^[a-zA-Z]+$")]`
  - Run `uvicorn main:app --reload` and visit `/docs` to verify the schema

### Exercises

1. Install FastAPI and Uvicorn in a fresh virtualenv, then run `uvicorn main:app --reload` and `curl http://127.0.0.1:8000/`.
2. Add three more GET endpoints (`/about`, `/version`, `/contact`) returning static JSON, then verify they all appear in /docs.
3. Add a `/square/{n}` endpoint typed `n: int` and confirm `?n=abc` returns a 422 with a clear validation error.
4. Compare `async def` vs `def` for `/square/{n}` by adding both versions and timing 1000 concurrent requests with `locust` or `hey`.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which server do you typically use to run a FastAPI app in development?
8. A) Uvicorn (an ASGI server) (*)
9. B) Gunicorn with sync workers
10. C) The built-in `python -m http.server`
11. D) Apache with mod_wsgi
12. Explanation: FastAPI is an ASGI framework and requires an ASGI server; Uvicorn is the canonical choice (Daphne and Hypercorn also work).
13. Q2: What does the `--reload` flag do in `uvicorn main:app --reload`?
14. A) Forces hot cache invalidation on every request
15. B) Watches files and restarts the server on change (*)
16. C) Re-imports the OpenAPI schema per request
17. D) Reloads the database connection pool
18. Explanation: `--reload` watches the working directory for Python file changes and restarts the worker; useful in dev, harmful in prod.
19. Q3: What is the role of type hints in FastAPI route handlers?
20. A) They are documentation only and ignored at runtime
21. B) They enable JIT compilation
22. C) They drive request parsing, validation, and OpenAPI schema generation (*)
23. D) They control the response Content-Type
24. Explanation: FastAPI reads type hints to coerce path/query params, validate bodies via Pydantic, and emit the OpenAPI schema.
25. Q4: Which endpoint serves the interactive Swagger UI by default?
26. A) /swagger
27. B) /api
28. C) /openapi-ui
29. D) /docs (*)
30. Explanation: FastAPI mounts Swagger UI at /docs and ReDoc at /redoc; both render the schema served at /openapi.json.
31. Q5: What happens if you install only `fastapi` without `uvicorn[standard]`?
32. A) You lose uvloop/httptools and get slower pure-Python defaults (*)
33. B) The app won't import
34. C) /docs becomes unavailable
35. D) Pydantic stops validating
36. Explanation: `uvicorn[standard]` bundles uvloop + httptools for 2-4x throughput; without it, Uvicorn falls back to asyncio's loop and h11.
37. Q6: Which is a valid minimal FastAPI app?
38. A) `app = Flask(); @app.route("/") def root(): return "hi"`
39. B) `app = FastAPI(); @app.get("/") def root(): return {"hi": True}` (*)
40. C) `app = FastAPI(); app.route("/") root()`
41. D) `FastAPI.serve("/")`
42. Explanation: You instantiate `FastAPI()` and decorate a function with `@app.get("/")`; returning a dict auto-serializes to JSON.
43. Q7: Why must FastAPI run under an ASGI server rather than a WSGI server?
44. A) WSGI doesn't support JSON
45. B) WSGI servers cost money
46. C) ASGI enables async I/O and WebSockets that WSGI's sync model can't (*)
47. D) ASGI is faster for static files
48. Explanation: WSGI is a synchronous protocol; FastAPI's async features (await, WebSockets, streaming) require the ASGI protocol.
49. Q8: What does the `/openapi.json` endpoint return?
50. A) The app's source code
51. B) The Pydantic model definitions only
52. C) A list of installed dependencies
53. D) The OpenAPI 3.x schema describing all routes, schemas, and security (*)
54. Explanation: FastAPI builds the OpenAPI schema at runtime; /docs and /redoc both fetch and render it.
55. Q9: Which is the recommended way to handle a route that calls a blocking CPU-bound function?
56. A) Declare it `def` so FastAPI runs it in a threadpool (*)
57. B) Declare it `async def` and hope for the best
58. C) Use `time.sleep` inside `async def`
59. D) Add `@app.middleware("http")` to wrap the call
60. Explanation: Plain `def` handlers are dispatched to a threadpool, so blocking calls don't stall the event loop; `async def` runs on the loop and would block it.
61. Q10: What is the default behavior when a path parameter fails type validation?
62. A) A 500 Internal Server Error is raised
63. B) A 422 Unprocessable Entity with a structured error body is returned (*)
64. C) The param is silently coerced to None
65. D) The request hangs
66. Explanation: FastAPI returns 422 with a JSON body listing the failing location, type, and reason — this comes from Pydantic's ValidationError.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which server do you typically use to run a FastAPI app in development?
  options:
    - Uvicorn (an ASGI server)
    - Gunicorn with sync workers
    - The built-in `python -m http.server`
    - Apache with mod_wsgi
  correctIndex: 0
  explanation: FastAPI is an ASGI framework and requires an ASGI server; Uvicorn is the canonical choice (Daphne and Hypercorn also work).
- id: q2
  question: What does the `--reload` flag do in `uvicorn main:app --reload`?
  options:
    - Forces hot cache invalidation on every request
    - Watches files and restarts the server on change
    - Re-imports the OpenAPI schema per request
    - Reloads the database connection pool
  correctIndex: 1
  explanation: "`--reload` watches the working directory for Python file changes and restarts the worker; useful in dev, harmful in prod."
- id: q3
  question: What is the role of type hints in FastAPI route handlers?
  options:
    - They are documentation only and ignored at runtime
    - They enable JIT compilation
    - They drive request parsing, validation, and OpenAPI schema generation
    - They control the response Content-Type
  correctIndex: 2
  explanation: FastAPI reads type hints to coerce path/query params, validate bodies via Pydantic, and emit the OpenAPI schema.
- id: q4
  question: Which endpoint serves the interactive Swagger UI by default?
  options:
    - /swagger
    - /api
    - /openapi-ui
    - /docs
  correctIndex: 3
  explanation: FastAPI mounts Swagger UI at /docs and ReDoc at /redoc; both render the schema served at /openapi.json.
- id: q5
  question: What happens if you install only `fastapi` without `uvicorn[standard]`?
  options:
    - You lose uvloop/httptools and get slower pure-Python defaults
    - The app won't import
    - /docs becomes unavailable
    - Pydantic stops validating
  correctIndex: 0
  explanation: "`uvicorn[standard]` bundles uvloop + httptools for 2-4x throughput; without it, Uvicorn falls back to asyncio's loop and h11."
- id: q6
  question: Which is a valid minimal FastAPI app?
  options:
    - '`app = Flask(); @app.route("/") def root(): return "hi"`'
    - '`app = FastAPI(); @app.get("/") def root(): return {"hi": True}`'
    - '`app = FastAPI(); app.route("/") root()`'
    - '`FastAPI.serve("/")`'
  correctIndex: 1
  explanation: You instantiate `FastAPI()` and decorate a function with `@app.get("/")`; returning a dict auto-serializes to JSON.
- id: q7
  question: Why must FastAPI run under an ASGI server rather than a WSGI server?
  options:
    - WSGI doesn't support JSON
    - WSGI servers cost money
    - ASGI enables async I/O and WebSockets that WSGI's sync model can't
    - ASGI is faster for static files
  correctIndex: 2
  explanation: WSGI is a synchronous protocol; FastAPI's async features (await, WebSockets, streaming) require the ASGI protocol.
- id: q8
  question: What does the `/openapi.json` endpoint return?
  options:
    - The app's source code
    - The Pydantic model definitions only
    - A list of installed dependencies
    - The OpenAPI 3.x schema describing all routes, schemas, and security
  correctIndex: 3
  explanation: FastAPI builds the OpenAPI schema at runtime; /docs and /redoc both fetch and render it.
- id: q9
  question: Which is the recommended way to handle a route that calls a blocking CPU-bound function?
  options:
    - Declare it `def` so FastAPI runs it in a threadpool
    - Declare it `async def` and hope for the best
    - Use `time.sleep` inside `async def`
    - Add `@app.middleware("http")` to wrap the call
  correctIndex: 0
  explanation: Plain `def` handlers are dispatched to a threadpool, so blocking calls don't stall the event loop; `async def` runs on the loop and would block it.
- id: q10
  question: What is the default behavior when a path parameter fails type validation?
  options:
    - A 500 Internal Server Error is raised
    - A 422 Unprocessable Entity with a structured error body is returned
    - The param is silently coerced to None
    - The request hangs
  correctIndex: 1
  explanation: FastAPI returns 422 with a JSON body listing the failing location, type, and reason — this comes from Pydantic's ValidationError.
```

