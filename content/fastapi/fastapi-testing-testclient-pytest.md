---
slug: fastapi-testing-testclient-pytest
id: fastapi-12
track: fastapi
order: 12
title: Testing with TestClient and pytest
description: Write unit and integration tests with FastAPI's `TestClient` (sync) and `httpx.AsyncClient` (async), use dependency overrides to swap DBs and auth, and run everything under `pytest --cov`.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=3300s
whyItMatters: Write unit and integration tests with FastAPI's `TestClient` (sync) and `httpx. AsyncClient` (async), use dependency overrides to swap DBs and auth, and run everything under `pytest --cov`.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Testing with TestClient and pytest

## Testing with TestClient and pytest

### Why It Matters

Write unit and integration tests with FastAPI's `TestClient` (sync) and `httpx. AsyncClient` (async), use dependency overrides to swap DBs and auth, and run everything under `pytest --cov`.

Write unit and integration tests with FastAPI's `TestClient` (sync) and `httpx.AsyncClient` (async), use dependency overrides to swap DBs and auth, and run everything under `pytest --cov`.

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 8: Database Integration with SQLAlchemy and Alembic
- Familiarity with pytest.

### Topics

- `fastapi.testclient.TestClient` (sync, backed by httpx + requests)
- `httpx.AsyncClient(transport=ASGITransport(app=app))` for async tests
- Dependency overrides via `app.dependency_overrides[dep] = mock`
- Fixtures for the test DB (sqlite in-memory or a per-test Postgres schema)
- Testing auth by overriding `get_current_user`
- Testing errors: 422 on bad input, 401 on missing token, 404 on missing resource
- Coverage with `pytest --cov=app --cov-report=term-missing`
- Lifecycle events (`@app.on_event("startup")`) and `lifespan`

### Key Concepts

- `TestClient` runs the app in-process using `httpx` and an ASGI transport — no network, no Uvicorn.
- For `async def` tests, use `httpx.AsyncClient` with `ASGITransport` inside `asyncio`-aware pytest (`pytest-asyncio` or anyio).
- `app.dependency_overrides` lets you swap real DB / auth / email dependencies per test without touching route code.
- Tests should be hermetic: each test gets a clean DB (rollback or drop-create) so order doesn't matter.
- `lifespan` events fire when the app starts/stops; use them to init the test DB.

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_create_user_validation():
    r = client.post("/users", json={"email": "not-an-email"})
    assert r.status_code == 422
```
Caption: Basic TestClient test

### Common Pitfalls

- Forgetting to clear `app.dependency_overrides` between tests — leaks into other tests; use a fixture that clears in teardown.
- Using `TestClient` for `async def` tests that need real async — `TestClient` is sync; for async, use `httpx.AsyncClient(transport=ASGITransport(app=app))`.
- Sharing one DB across tests without rollback — tests become order-dependent; use a per-test transaction that rolls back.
- Not testing error paths — happy-path-only tests miss validation, auth, and not-found regressions.
- Mocking too much — over-mocking the DB or external services makes tests pass while integration breaks; prefer real fakes (sqlite, mockservers).

### Real-World Applications

- Stripe's API has thousands of integration tests covering validation, auth, idempotency, and webhooks; FastAPI's `TestClient` + dependency overrides is the same approach at small scale.
- Uber's CI runs service-level tests with overridden dependencies for downstream services; the pattern matches `app.dependency_overrides`.
- Microsoft's Azure SDK samples ship FastAPI + pytest + pytest-asyncio + coverage in their templates.
- Netflix's engineering blog describes contract tests for each service; FastAPI's schema (from `/openapi.json`) can be diffed in CI to catch breaking changes.

### Interview Questions

- 1. How does `TestClient` work without a running server? — It uses `httpx` with an in-process ASGI transport; no network, no Uvicorn.
- 2. How do you swap a DB dependency in tests? — Set `app.dependency_overrides[get_db] = fake_get_db`; clear it in teardown.
- 3. How do you test an `async def` route? — Use `httpx.AsyncClient(transport=ASGITransport(app=app))` with `pytest-asyncio` or `anyio`.
- 4. Why must each test get a clean DB? — To keep tests hermetic and order-independent; shared state causes flaky failures.
- 5. What's the recommended coverage target? — ≥80% line coverage on core modules; enforce with `pytest --cov-fail-under=80`.

### Mini Project

Build a "Test Suite for a Tiny CRUD API": Take a small FastAPI app with `/items` CRUD and write tests covering: validation 422, happy-path 201, list 200, not-found 404, auth-override for protected routes. Use `TestClient` and `app.dependency_overrides`. Suggested approach:
  - Use sqlite in-memory for tests
  - Override `get_db` to point at the test session
  - Override `get_current_user` to return a fake user
  - Write 5+ tests covering each status code
  - Run `pytest --cov=app --cov-report=term-missing --cov-fail-under=80`

### Exercises

1. Write a `TestClient` test for a `/health` route asserting 200 and JSON shape.
2. Override `get_db` with a sqlite in-memory session and test a CRUD round-trip.
3. Write an async test using `httpx.AsyncClient(transport=ASGITransport(app=app))`.
4. Add a fixture that clears `app.dependency_overrides` after each test.
5. >>> QUIZ (Stage 12) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does `TestClient` use to call the app in-process?
8. A) requests
9. B) aiohttp
10. C) curl
11. D) httpx with an ASGI transport (*)
12. Explanation: `TestClient` wraps `httpx.Client` with an ASGI transport — no network, no Uvicorn, all in-process.
13. Q2: How do you swap a dependency in tests?
14. A) Set `app.dependency_overrides[dep] = fake` (*)
15. B) Monkeypatch the route function
16. C) Edit `INSTALLED_APPS`
17. D) Use `@pytest.fixture(autouse=True)`
18. Explanation: `app.dependency_overrides` is the FastAPI-blessed way to replace a dependency for tests; clear it in teardown.
19. Q3: How do you test an `async def` route?
20. A) `TestClient` works fine
21. B) Use `httpx.AsyncClient(transport=ASGITransport(app=app))` with pytest-asyncio (*)
22. C) You can't test async routes
23. D) Use `asyncio.run(client.get(...))` directly
24. Explanation: `TestClient` is sync; for async tests use `httpx.AsyncClient` with the ASGI transport under an async test runner.
25. Q4: Why must each test get a clean DB?
26. A) For speed
27. B) Because SQLite requires it
28. C) To keep tests hermetic and order-independent (*)
29. D) Because of the GIL
30. Explanation: Shared DB state couples tests; each test should start from a known state (rollback, drop-create, or per-test schema).
31. Q5: How do you clear dependency overrides after a test?
32. A) Restart the worker
33. B) Delete the app object
34. C) Reload the module
35. D) `app.dependency_overrides.clear()` (or pop the specific dep) in teardown (*)
36. Explanation: Clearing `dependency_overrides` prevents leakage; the standard pattern is a fixture with teardown.
37. Q6: Which is a recommended coverage target?
38. A) ≥80% line coverage on core modules (*)
39. B) 50%
40. C) 100% always
41. D) Coverage doesn't matter
42. Explanation: 80% is a common pragmatic floor; 100% is rarely worth the cost; enforce with `--cov-fail-under=80`.
43. Q7: Which pytest plugin enables `async def test_...`?
44. A) pytest-cov
45. B) pytest-asyncio or anyio (*)
46. C) pytest-django
47. D) pytest-xdist
48. Explanation: `pytest-asyncio` or `anyio` provides the event loop for `async def` tests.
49. Q8: What does `ASGITransport(app=app)` do?
50. A) Sends real HTTP over TCP
51. B) Compresses the request
52. C) Routes httpx calls directly to the ASGI app in-process (*)
53. D) Adds CORS headers
54. Explanation: `ASGITransport` is an httpx transport that calls the app's ASGI callable directly — no socket.
55. Q9: Which is a likely bug from over-mocking?
56. A) Tests run slow
57. B) Coverage is too high
58. C) Type hints break
59. D) Tests pass while integration breaks (*)
60. Explanation: Mocking every collaborator removes the integration check; prefer real fakes (sqlite, wiremock) for boundary deps.
61. Q10: Which status code does FastAPI return for a malformed JSON body?
62. A) 422 Unprocessable Entity (*)
63. B) 400
64. C) 500
65. D) 415
66. Explanation: Pydantic validation errors produce 422 with a structured error body — assert this in your validation tests.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `TestClient` use to call the app in-process?
  options:
    - requests
    - aiohttp
    - curl
    - httpx with an ASGI transport
  correctIndex: 3
  explanation: "`TestClient` wraps `httpx.Client` with an ASGI transport — no network, no Uvicorn, all in-process."
- id: q2
  question: How do you swap a dependency in tests?
  options:
    - Set `app.dependency_overrides[dep] = fake`
    - Monkeypatch the route function
    - Edit `INSTALLED_APPS`
    - Use `@pytest.fixture(autouse=True)`
  correctIndex: 0
  explanation: "`app.dependency_overrides` is the FastAPI-blessed way to replace a dependency for tests; clear it in teardown."
- id: q3
  question: How do you test an `async def` route?
  options:
    - "`TestClient` works fine"
    - Use `httpx.AsyncClient(transport=ASGITransport(app=app))` with pytest-asyncio
    - You can't test async routes
    - Use `asyncio.run(client.get(...))` directly
  correctIndex: 1
  explanation: "`TestClient` is sync; for async tests use `httpx.AsyncClient` with the ASGI transport under an async test runner."
- id: q4
  question: Why must each test get a clean DB?
  options:
    - For speed
    - Because SQLite requires it
    - To keep tests hermetic and order-independent
    - Because of the GIL
  correctIndex: 2
  explanation: Shared DB state couples tests; each test should start from a known state (rollback, drop-create, or per-test schema).
- id: q5
  question: How do you clear dependency overrides after a test?
  options:
    - Restart the worker
    - Delete the app object
    - Reload the module
    - "`app.dependency_overrides.clear()` (or pop the specific dep) in teardown"
  correctIndex: 3
  explanation: Clearing `dependency_overrides` prevents leakage; the standard pattern is a fixture with teardown.
- id: q6
  question: Which is a recommended coverage target?
  options:
    - ≥80% line coverage on core modules
    - 50%
    - 100% always
    - Coverage doesn't matter
  correctIndex: 0
  explanation: 80% is a common pragmatic floor; 100% is rarely worth the cost; enforce with `--cov-fail-under=80`.
- id: q7
  question: Which pytest plugin enables `async def test_...`?
  options:
    - pytest-cov
    - pytest-asyncio or anyio
    - pytest-django
    - pytest-xdist
  correctIndex: 1
  explanation: "`pytest-asyncio` or `anyio` provides the event loop for `async def` tests."
- id: q8
  question: What does `ASGITransport(app=app)` do?
  options:
    - Sends real HTTP over TCP
    - Compresses the request
    - Routes httpx calls directly to the ASGI app in-process
    - Adds CORS headers
  correctIndex: 2
  explanation: "`ASGITransport` is an httpx transport that calls the app's ASGI callable directly — no socket."
- id: q9
  question: Which is a likely bug from over-mocking?
  options:
    - Tests run slow
    - Coverage is too high
    - Type hints break
    - Tests pass while integration breaks
  correctIndex: 3
  explanation: Mocking every collaborator removes the integration check; prefer real fakes (sqlite, wiremock) for boundary deps.
- id: q10
  question: Which status code does FastAPI return for a malformed JSON body?
  options:
    - 422 Unprocessable Entity
    - "400"
    - "500"
    - "415"
  correctIndex: 0
  explanation: Pydantic validation errors produce 422 with a structured error body — assert this in your validation tests.
```

