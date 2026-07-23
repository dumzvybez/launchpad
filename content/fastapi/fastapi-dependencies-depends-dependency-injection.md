---
slug: fastapi-dependencies-depends-dependency-injection
id: fastapi-06
track: fastapi
order: 6
title: Dependencies — Depends and Dependency Injection
description: Use `Depends()` to inject shared logic (auth, DB sessions, pagination, rate limits), write generator dependencies with `yield`, and exploit FastAPI's per-request caching.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=1500s
whyItMatters: Use `Depends()` to inject shared logic (auth, DB sessions, pagination, rate limits), write generator dependencies with `yield`, and exploit FastAPI's per-request caching.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Dependencies — Depends and Dependency Injection

## Dependencies — Depends and Dependency Injection

### Why It Matters

Use `Depends()` to inject shared logic (auth, DB sessions, pagination, rate limits), write generator dependencies with `yield`, and exploit FastAPI's per-request caching.

Use `Depends()` to inject shared logic (auth, DB sessions, pagination, rate limits), write generator dependencies with `yield`, and exploit FastAPI's per-request caching.

### Prerequisites

- Stage 2: Path Operations and Path Parameters
- Stage 4: Pydantic Models and Validation
- Comfort with Python generators (`yield`).

### Topics

- `Depends(callable)` for parameter injection
- Class-based dependencies (constructor params become query params)
- Generator dependencies with `yield` (setup + teardown)
- Sub-dependencies (a dependency that itself uses `Depends`)
- Per-request caching: same `Depends(dep)` called twice returns one result
- `Annotated[X, Depends(...)]` style
- Global/router-level `dependencies=[Depends(...)]`
- `yield` dependencies with `try/except/finally` for cleanup

### Key Concepts

- A dependency is any callable: function, class, or generator.
- Results are cached per-request: if `get_db` is in the signature of two dependencies and the route, it runs once.
- `yield`-based dependencies enable teardown (closing DB sessions, releasing locks) even if the route raises.
- Class dependencies expose their `__init__` params as query params (great for pagination).
- Use `Annotated[Session, Depends(get_db)]` to keep signatures clean and reusable.

```python
from fastapi import Depends, FastAPI

app = FastAPI()

def common_params(q: str | None = None, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items")
async def list_items(commons: Annotated[dict, Depends(common_params)]):
    return commons
```
Caption: Basic function dependency

### Common Pitfalls

- Expecting `Depends(get_db)` to share state across requests — caching is per-request only; each request gets a fresh `get_db()` call.
- Forgetting to use `yield` for resources needing cleanup — a plain `return`-based dependency can't close the DB session if the route raises; use `try/finally` with `yield`.
- Catching exceptions in the `yield` dependency's `try` block — `try/except` around `yield` catches route exceptions (useful for rollback); `try/finally` always runs cleanup.
- Using `Depends()` without parentheses in class deps — `Depends(Pagination)` works, but `Annotated[Pagination, Depends()]` (no arg) infers the class itself.
- Sharing a mutable object via a module-level dependency — that's not per-request; if you need a per-request cache, use `request.state` or a dependency that returns a fresh dict.

### Real-World Applications

- Stripe's API injects auth context (account ID, API key scope) into every protected route — exactly the pattern FastAPI dependencies make idiomatic.
- Uber's per-request context (rider ID, locale, feature flags) is injected across handlers via a DI container; FastAPI's `Depends` is the Python equivalent.
- Microsoft Azure's API management uses shared rate-limit dependencies per subscription — expressible as a `Depends(rate_limit_by_sub)` dependency.
- OpenAI's API gates every endpoint behind an org/project-scoped auth dependency that injects the caller's `RequestContext`.

### Interview Questions

- 1. What is the scope of FastAPI's dependency cache? — Per-request: within one request, calling `Depends(get_db)` multiple times runs `get_db` once.
- 2. How do you implement cleanup (e.g., closing a DB session) in a dependency? — Use a generator with `yield`: setup before `yield`, cleanup in `finally`.
- 3. What's the difference between `Depends(Pagination)` and `Annotated[Pagination, Depends()]`? — Both register the class as a dependency; the `Annotated` form keeps the default value slot free.
- 4. How do you apply a dependency to every route in an app or router? — Pass `dependencies=[Depends(verify_token)]` to `FastAPI(...)` or `APIRouter(...)`.
- 5. Can a dependency itself have dependencies? — Yes; sub-dependencies form a DAG that FastAPI resolves top-down and caches per request.

### Mini Project

Build a "Pagination + Auth" Dependency Stack: A small API where every route depends on a `Pagination` class (skip/limit) and a `get_current_user` function that checks a header. Add a `get_db` generator dependency with `try/finally`. The `/posts` route uses all three. Suggested approach:
  - Define `class Pagination` with `skip` and `limit` (max 100)
  - Write `get_current_user(x_api_key: Annotated[str, Header()])` raising 401 on bad key
  - Write `get_db()` generator with `try: yield db; finally: db.close()`
  - Apply `dependencies=[Depends(get_current_user)]` to the router
  - Verify /docs shows the security header is required on every route

### Exercises

1. Write a `Pagination` class dependency with `skip` and `limit` (max 100) and use it in two routes.
2. Write a `get_db` generator dependency with `try/finally` and verify `db.close()` runs even when the route raises.
3. Apply `dependencies=[Depends(verify_token)]` to a router and confirm every route requires the header.
4. Add a sub-dependency: `get_current_user` depends on `get_db` and on `verify_token`; verify it's called once per request.
5. >>> QUIZ (Stage 6) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What is the scope of FastAPI's per-request dependency cache?
8. A) Per-process
9. B) Per-request (one call per Depends() per request) (*)
10. C) Per-worker
11. D) Per-route
12. Explanation: Each `Depends(dep)` runs at most once per request; the result is cached and reused for all other `Depends(dep)` references in the same request.
13. Q2: How do you clean up a resource (DB session) in a dependency?
14. A) Return a context manager
15. B) Use a `__del__` method
16. C) Use a generator with `yield` and `try/finally` (*)
17. D) Register an atexit handler
18. Explanation: `try: yield resource; finally: cleanup()` runs cleanup after the request finishes, even on exceptions.
19. Q3: Which is the modern Annotated style for declaring a dependency?
20. A) `db: Session = Depends(get_db)`
21. B) `db: Session -> Depends(get_db)`
22. C) `db: Depends(Session)`
23. D) `db: Annotated[Session, Depends(get_db)]` (*)
24. Explanation: `Annotated[T, Depends(...)]` keeps the default-value slot free and reads cleanly in signatures.
25. Q4: How do you apply a dependency to every route in a router?
26. A) Pass `dependencies=[Depends(...)]` to APIRouter() (*)
27. B) Use `@router.depends()`
28. C) List it in `INSTALLED_APPS`
29. D) Set `router.global_deps = [...]`
30. Explanation: `APIRouter(dependencies=[...])` applies the dependency to all routes added to that router.
31. Q5: What is a sub-dependency?
32. A) A dependency imported from a sub-package
33. B) A dependency that itself uses `Depends()` for its own params (*)
34. C) A route that depends on another route
35. D) A class with no __init__
36. Explanation: Sub-dependencies form a DAG; FastAPI resolves them recursively and caches each per request.
37. Q6: Which is true about class-based dependencies?
38. A) They can't have __init__ params
39. B) They must inherit from BaseModel
40. C) Their __init__ params become query/path params automatically (*)
41. D) They can't be used with Annotated
42. Explanation: FastAPI treats a class like a callable: __init__ params become query/path params and the instance is injected.
43. Q7: What happens if the same `Depends(get_db)` appears in two dependencies and the route?
44. A) `get_db` runs three times
45. B) FastAPI raises a duplicate-dependency error
46. C) Only the first call runs
47. D) `get_db` runs once and the result is shared (*)
48. Explanation: Per-request caching means `get_db` is called once; the result is reused across all references in the same request.
49. Q8: How does a `yield` dependency handle route exceptions?
50. A) The exception propagates; the `finally` still runs (and `except` around `yield` can catch it) (*)
51. B) The exception is silently swallowed
52. C) FastAPI retries the request
53. D) The dependency is re-invoked
54. Explanation: `try/except` around `yield` catches the route's exception (useful for rollback); `try/finally` always runs cleanup.
55. Q9: Can a dependency return any type?
56. A) Only Pydantic models
57. B) Any type — FastAPI injects whatever the callable returns (*)
58. C) Only dicts
59. D) Only strings
60. Explanation: A dependency can return a DB session, a dict, a class instance, a Pydantic model, or a primitive; FastAPI injects it as-is.
61. Q10: Which is a valid reason to use `Annotated[T, Depends()]` (no arg)?
62. A) To skip validation
63. B) To disable caching
64. C) To register a class as a dependency and let FastAPI infer it (*)
65. D) To mark the param as optional
66. Explanation: `Depends()` with no argument uses the parameter's type as the dependency callable — convenient for class-based deps.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the scope of FastAPI's per-request dependency cache?
  options:
    - Per-process
    - Per-request (one call per Depends() per request)
    - Per-worker
    - Per-route
  correctIndex: 1
  explanation: Each `Depends(dep)` runs at most once per request; the result is cached and reused for all other `Depends(dep)` references in the same request.
- id: q2
  question: How do you clean up a resource (DB session) in a dependency?
  options:
    - Return a context manager
    - Use a `__del__` method
    - Use a generator with `yield` and `try/finally`
    - Register an atexit handler
  correctIndex: 2
  explanation: "`try: yield resource; finally: cleanup()` runs cleanup after the request finishes, even on exceptions."
- id: q3
  question: Which is the modern Annotated style for declaring a dependency?
  options:
    - "`db: Session = Depends(get_db)`"
    - "`db: Session -> Depends(get_db)`"
    - "`db: Depends(Session)`"
    - "`db: Annotated[Session, Depends(get_db)]`"
  correctIndex: 3
  explanation: "`Annotated[T, Depends(...)]` keeps the default-value slot free and reads cleanly in signatures."
- id: q4
  question: How do you apply a dependency to every route in a router?
  options:
    - Pass `dependencies=[Depends(...)]` to APIRouter()
    - Use `@router.depends()`
    - List it in `INSTALLED_APPS`
    - Set `router.global_deps = [...]`
  correctIndex: 0
  explanation: "`APIRouter(dependencies=[...])` applies the dependency to all routes added to that router."
- id: q5
  question: What is a sub-dependency?
  options:
    - A dependency imported from a sub-package
    - A dependency that itself uses `Depends()` for its own params
    - A route that depends on another route
    - A class with no __init__
  correctIndex: 1
  explanation: Sub-dependencies form a DAG; FastAPI resolves them recursively and caches each per request.
- id: q6
  question: Which is true about class-based dependencies?
  options:
    - They can't have __init__ params
    - They must inherit from BaseModel
    - Their __init__ params become query/path params automatically
    - They can't be used with Annotated
  correctIndex: 2
  explanation: "FastAPI treats a class like a callable: __init__ params become query/path params and the instance is injected."
- id: q7
  question: What happens if the same `Depends(get_db)` appears in two dependencies and the route?
  options:
    - "`get_db` runs three times"
    - FastAPI raises a duplicate-dependency error
    - Only the first call runs
    - "`get_db` runs once and the result is shared"
  correctIndex: 3
  explanation: Per-request caching means `get_db` is called once; the result is reused across all references in the same request.
- id: q8
  question: How does a `yield` dependency handle route exceptions?
  options:
    - The exception propagates; the `finally` still runs (and `except` around `yield` can catch it)
    - The exception is silently swallowed
    - FastAPI retries the request
    - The dependency is re-invoked
  correctIndex: 0
  explanation: "`try/except` around `yield` catches the route's exception (useful for rollback); `try/finally` always runs cleanup."
- id: q9
  question: Can a dependency return any type?
  options:
    - Only Pydantic models
    - Any type — FastAPI injects whatever the callable returns
    - Only dicts
    - Only strings
  correctIndex: 1
  explanation: A dependency can return a DB session, a dict, a class instance, a Pydantic model, or a primitive; FastAPI injects it as-is.
- id: q10
  question: Which is a valid reason to use `Annotated[T, Depends()]` (no arg)?
  options:
    - To skip validation
    - To disable caching
    - To register a class as a dependency and let FastAPI infer it
    - To mark the param as optional
  correctIndex: 2
  explanation: "`Depends()` with no argument uses the parameter's type as the dependency callable — convenient for class-based deps."
```

