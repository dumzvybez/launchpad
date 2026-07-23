---
slug: fastapi-query-parameters-request-bodies
id: fastapi-03
track: fastapi
order: 3
title: Query Parameters and Request Bodies
description: Accept query strings (including lists, optional values, and aliases) and JSON request bodies via Pydantic models, and learn how FastAPI routes each parameter to its source.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=600s
whyItMatters: Accept query strings (including lists, optional values, and aliases) and JSON request bodies via Pydantic models, and learn how FastAPI routes each parameter to its source.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Query Parameters and Request Bodies

## Query Parameters and Request Bodies

### Why It Matters

Accept query strings (including lists, optional values, and aliases) and JSON request bodies via Pydantic models, and learn how FastAPI routes each parameter to its source.

Accept query strings (including lists, optional values, and aliases) and JSON request bodies via Pydantic models, and learn how FastAPI routes each parameter to its source.

### Prerequisites

- Stage 1: Getting Started with FastAPI
- Stage 2: Path Operations and Path Parameters
- Familiarity with JSON.

### Topics

- Query parameters from simple type hints (`?skip=0&limit=10`)
- Optional query params with defaults and `None`
- Boolean coercion quirks (`?active=true`, `1`, `on`, `yes`)
- Query params of type `list[str]` (`?tags=a&tags=b`)
- `Query()` constraints: alias, deprecated, min_length, max_length, pattern
- Request bodies via Pydantic `BaseModel`
- Mixing path, query, and body params in one signature
- `Body()` and embedded body fields

### Key Concepts

- FastAPI infers a parameter's source from its type: simple types (int/str/bool/float) without a default become query params; `BaseModel` types become request bodies.
- Default values make a query param optional; `None` allows null in the query string.
- Booleans accept `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` (case-insensitive) — a frequent surprise.
- `Annotated[list[str], Query()]` is the modern way to declare repeating query params.
- A route can have at most one body model; FastAPI wraps extras in a JSON key when you use `Body(...)`.

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items")
async def list_items(
    q: Annotated[str | None, Query(min_length=2, max_length=50)] = None,
    skip: int = 0,
    limit: int = 10,
    active: bool = True,
):
    return {"q": q, "skip": skip, "limit": limit, "active": active}
```
Caption: Query params with defaults and bool

### Common Pitfalls

- Declaring `tags: list[str]` without `Query(...)` — FastAPI treats it as a body param by default; use `Annotated[list[str], Query()]` to force it into the query string.
- Forgetting that `bool` accepts `1`, `0`, `yes`, `no`, `on`, `off` — a stray `?active=yes` returns `True`, which can mask bugs in client code that expects only `true`/`false`.
- Using `Optional[X]` vs `X | None` interchangeably — both work in modern Python, but mixing the two in one codebase hurts readability; pick one (prefer `X | None` on 3.10+).
- Naming a query param the same as a body field — FastAPI will route it correctly but readers will be confused; use `alias=` to disambiguate.
- Sending a body to a GET route — many clients/proxies strip GET bodies; design GET routes to use query params only.

### Real-World Applications

- Stripe's list endpoints (`/v1/charges?limit=100&starting_after=ch_xxx`) use cursor pagination with typed query params, easily modeled with `Annotated[str, Query()]` for the cursor.
- GitHub's `/search/repositories?q=...&sort=stars&order=desc` uses query params including list-typed `labels` — directly expressible as `list[str]` with `Query()`.
- Slack's `conversations.list?types=public_channel,private_channel` accepts a comma-separated list; FastAPI can model this with a custom parser or use `list[str]` with multiple `types=` repeats.
- Twilio's list endpoints accept `PageSize` as an integer query param constrained via `Query(ge=1, le=1000)`.

### Interview Questions

- 1. How does FastAPI know whether a parameter is a path, query, or body param? — Path params come from `{...}` segments; `BaseModel` types are bodies; everything else (simple types) is a query param.
- 2. How do you accept repeating query params like `?tag=a&tag=b`? — Declare `tags: Annotated[list[str], Query()]`; FastAPI collects all values into a list.
- 3. What is the `alias` parameter for? — It maps an incoming field name (often a short or snake-case key) to a Python-safe attribute name; useful for matching external APIs.
- 4. How would you mark a query param as deprecated? — Pass `deprecated=True` to `Query(...)`; /docs shows it struck through and warns clients.
- 5. Can a single route have multiple body params? — Yes, but FastAPI wraps them in a JSON object keyed by parameter name; for a single body use a single Pydantic model.

### Mini Project

Build a "Search API" Stub: A `/search` endpoint that accepts `q` (string, 2-50 chars), `tags` (list of strings), `limit` (1-100, default 10), `active` (bool, default true), and `cursor` (optional string). Returns a fake result page with a `next_cursor`. Suggested approach:
  - Type each param with `Annotated[T, Query(...)]`
  - Use `alias="t"` for tags to expose a short URL key
  - Build a fake in-memory list and slice by `limit`
  - Return `{"results": [...], "next_cursor": "..."}`
  - Test with `curl "/search?q=hi&t=a&t=b&limit=5&active=false"`

### Exercises

1. Add a `?verbose=true` bool query param to an existing route and verify that `?verbose=1` and `?verbose=yes` both coerce to `True`.
2. Create a `/users` GET endpoint with `?role=admin&role=editor` accepting a `list[str]` of roles.
3. Add a `cursor` query param (optional string) and use it to slice a list; return a `next_cursor`.
4. Send a JSON body to a POST route using `httpx` (or `curl -d`) and confirm FastAPI validates it as a Pydantic model.
5. >>> QUIZ (Stage 3) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How does FastAPI decide that a parameter is a query param (not a body)?
8. A) By its name
9. B) By alphabetical order
10. C) By its type — simple types (int/str/bool/float) become query params (*)
11. D) By the order in the signature
12. Explanation: Simple types default to query params; `BaseModel` types become bodies; path-segment names become path params.
13. Q2: Which declares a repeating query param `?t=a&t=b`?
14. A) `t: str`
15. B) `t: list[str]` (without Query)
16. C) `t: dict[str, str]`
17. D) `t: Annotated[list[str], Query()]` (*)
18. Explanation: A bare `list[str]` defaults to a body param; you must wrap it in `Query()` to make FastAPI read it from the query string.
19. Q3: What does `?active=1` parse to when the param is typed `bool`?
20. A) `True` (*)
21. B) Raises a 422
22. C) `False`
23. D) The string `"1"`
24. Explanation: FastAPI accepts `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` (case-insensitive) for bool query params.
25. Q4: How do you mark a query param as deprecated in /docs?
26. A) Prefix the name with `deprecated_`
27. B) Pass `deprecated=True` to `Query()` (*)
28. C) Add `@deprecated` from typing
29. D) You can't — deprecation is OpenAPI-only
30. Explanation: `Query(deprecated=True)` flags the param in the OpenAPI schema, and Swagger UI shows it struck-through.
31. Q5: What is `alias` used for in `Query(alias="t")`?
32. A) To rename the Python variable internally
33. B) To forward the request to another route
34. C) To expose a different key in the URL/JSON than the Python attribute name (*)
35. D) To log the param under a different name
36. Explanation: `alias` maps an external key (e.g., a short URL param) to a Python-safe attribute name.
37. Q6: What happens if you send a JSON body to a GET route?
38. A) FastAPI always rejects it with 415
39. B) It works reliably everywhere
40. C) FastAPI converts it to query params
41. D) Many clients/proxies strip GET bodies; design GETs to use query params (*)
42. Explanation: HTTP allows GET bodies but they're rarely honored end-to-end; use POST for bodies, GET for query params.
43. Q7: How many body models can one route declare?
44. A) Multiple — FastAPI wraps them in a JSON object keyed by param name (*)
45. B) Exactly one
46. C) Zero or one
47. D) Up to two
48. Explanation: You can declare multiple `BaseModel` params; FastAPI nests them under their parameter names in the request JSON.
49. Q8: Which type annotation makes a query param optional?
50. A) `q: str`
51. B) `q: str | None = None` (*)
52. C) `q: Optional[str]` with no default
53. D) `q: Annotated[str, None]`
54. Explanation: A default of `None` plus `str | None` makes the param optional and accepts `?q=` or absence.
55. Q9: Which constraint enforces a 2-50 char length on a query string?
56. A) `Query(min=2, max=50)`
57. B) `Query(length=50)`
58. C) `Query(min_length=2, max_length=50)` (*)
59. D) `Query(regex=r".{2,50}")`
60. Explanation: `min_length` and `max_length` constrain string length; `pattern` constrains the format via regex.
61. Q10: What does FastAPI return when a required query param is missing?
62. A) 400 Bad Request
63. B) 404 Not Found
64. C) 500 Internal Server Error
65. D) 422 Unprocessable Entity (*)
66. Explanation: Missing required query params produce a 422 with a structured error body listing the missing field.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How does FastAPI decide that a parameter is a query param (not a body)?
  options:
    - By its name
    - By alphabetical order
    - By its type — simple types (int/str/bool/float) become query params
    - By the order in the signature
  correctIndex: 2
  explanation: Simple types default to query params; `BaseModel` types become bodies; path-segment names become path params.
- id: q2
  question: Which declares a repeating query param `?t=a&t=b`?
  options:
    - "`t: str`"
    - "`t: list[str]` (without Query)"
    - "`t: dict[str, str]`"
    - "`t: Annotated[list[str], Query()]`"
  correctIndex: 3
  explanation: A bare `list[str]` defaults to a body param; you must wrap it in `Query()` to make FastAPI read it from the query string.
- id: q3
  question: What does `?active=1` parse to when the param is typed `bool`?
  options:
    - "`True`"
    - Raises a 422
    - "`False`"
    - The string `"1"`
  correctIndex: 0
  explanation: FastAPI accepts `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` (case-insensitive) for bool query params.
- id: q4
  question: How do you mark a query param as deprecated in /docs?
  options:
    - Prefix the name with `deprecated_`
    - Pass `deprecated=True` to `Query()`
    - Add `@deprecated` from typing
    - You can't — deprecation is OpenAPI-only
  correctIndex: 1
  explanation: "`Query(deprecated=True)` flags the param in the OpenAPI schema, and Swagger UI shows it struck-through."
- id: q5
  question: What is `alias` used for in `Query(alias="t")`?
  options:
    - To rename the Python variable internally
    - To forward the request to another route
    - To expose a different key in the URL/JSON than the Python attribute name
    - To log the param under a different name
  correctIndex: 2
  explanation: "`alias` maps an external key (e.g., a short URL param) to a Python-safe attribute name."
- id: q6
  question: What happens if you send a JSON body to a GET route?
  options:
    - FastAPI always rejects it with 415
    - It works reliably everywhere
    - FastAPI converts it to query params
    - Many clients/proxies strip GET bodies; design GETs to use query params
  correctIndex: 3
  explanation: HTTP allows GET bodies but they're rarely honored end-to-end; use POST for bodies, GET for query params.
- id: q7
  question: How many body models can one route declare?
  options:
    - Multiple — FastAPI wraps them in a JSON object keyed by param name
    - Exactly one
    - Zero or one
    - Up to two
  correctIndex: 0
  explanation: You can declare multiple `BaseModel` params; FastAPI nests them under their parameter names in the request JSON.
- id: q8
  question: Which type annotation makes a query param optional?
  options:
    - "`q: str`"
    - "`q: str | None = None`"
    - "`q: Optional[str]` with no default"
    - "`q: Annotated[str, None]`"
  correctIndex: 1
  explanation: A default of `None` plus `str | None` makes the param optional and accepts `?q=` or absence.
- id: q9
  question: Which constraint enforces a 2-50 char length on a query string?
  options:
    - "`Query(min=2, max=50)`"
    - "`Query(length=50)`"
    - "`Query(min_length=2, max_length=50)`"
    - '`Query(regex=r".{2,50}")`'
  correctIndex: 2
  explanation: "`min_length` and `max_length` constrain string length; `pattern` constrains the format via regex."
- id: q10
  question: What does FastAPI return when a required query param is missing?
  options:
    - 400 Bad Request
    - 404 Not Found
    - 500 Internal Server Error
    - 422 Unprocessable Entity
  correctIndex: 3
  explanation: Missing required query params produce a 422 with a structured error body listing the missing field.
```

