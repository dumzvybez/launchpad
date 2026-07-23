---
slug: fastapi-path-operations-path-parameters
id: fastapi-02
track: fastapi
order: 2
title: Path Operations and Path Parameters
description: Define GET/POST/PUT/PATCH/DELETE path operations, declare path parameters with type hints, constrain them with Path(), and route requests deterministically.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=300s
whyItMatters: Define GET/POST/PUT/PATCH/DELETE path operations, declare path parameters with type hints, constrain them with Path(), and route requests deterministically.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Path Operations and Path Parameters

## Path Operations and Path Parameters

### Why It Matters

Define GET/POST/PUT/PATCH/DELETE path operations, declare path parameters with type hints, constrain them with Path(), and route requests deterministically.

Define GET/POST/PUT/PATCH/DELETE path operations, declare path parameters with type hints, constrain them with Path(), and route requests deterministically.

### Prerequisites

- Stage 1: Getting Started with FastAPI
- Basic understanding of HTTP verbs and status codes.

### Topics

- Declaring path operations with `@app.get`, `@app.post`, `@app.put`, `@app.patch`, `@app.delete`
- Path parameters from `{...}` segments and Python type hints
- Path parameter ordering (static before dynamic, why it matters)
- `Path()` constraints: gt, ge, lt, le, min_length, max_length, pattern
- `Enum`-typed path parameters for closed value sets
- The `Annotated` style (Python 3.9+) for metadata in type hints
- Path operations returning dicts, lists, and Pydantic models
- Status codes per route via `status_code=...`

### Key Concepts

- Routes are matched in declaration order; a `/users/me` route declared after `/users/{user_id}` would be shadowed by the dynamic route.
- Path parameters are required by default; optional values belong in the query string.
- `Path(...)` (Ellipsis) marks a parameter as required even when a default could be inferred.
- `Annotated[int, Path(ge=1)]` is the modern style; FastAPI reads metadata from `Annotated` to keep the signature clean.
- Returning a Pydantic model from a route automatically filters and serializes the output.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/me")          # MUST be declared before /users/{user_id}
async def current_user():
    return {"id": "me"}

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"id": item_id if False else item_id}  # placeholder
```
Caption: Route ordering

### Common Pitfalls

- Declaring `/users/{user_id}` before `/users/me` — the dynamic route matches "me" as a string, so `/users/me` is shadowed; declare static routes first.
- Forgetting that path params are required by default — there is no `Optional[int]` for path params; if a value is optional it should be a query param.
- Using `int` for IDs that may exceed 2^31 — Postgres bigserial and Snowflake IDs need Python `int` (arbitrary precision), but if you serialize via JSON the client must accept large numbers; consider strings for Snowflake IDs.
- Mixing `Path(...)` positional and `Annotated` styles — pick `Annotated[T, Path(...)]` consistently; mixing leads to confusing signatures and is deprecated in some FastAPI versions.
- Returning a raw ORM object that has lazy attributes — accessing them after the session closes raises DetachedInstanceError; convert to a Pydantic response_model first.

### Real-World Applications

- Stripe's API uses deterministic path-parameter routing like `/v1/charges/{charge_id}` and `/v1/customers/{customer_id}/sources/{id}`; FastAPI mirrors this pattern with nested routes via APIRouter.
- GitHub's REST API exposes `/repos/{owner}/{repo}/issues/{issue_number}` — a pattern trivially expressible in FastAPI with multiple typed path params.
- Twilio's API uses constrained path params (Account SIDs are 34-char strings) which FastAPI can enforce via `Path(min_length=34, max_length=34, pattern=r"^AC[0-9a-f]{32}$")`.
- Slack's web API exposes workspace-scoped IDs as strings; using a `str` path param prevents integer overflow surprises.

### Interview Questions

- 1. Why does route declaration order matter in FastAPI? — Routes are matched in declaration order; a dynamic `{x}` segment will shadow any later static segment with the same prefix.
- 2. How would you constrain an ID path param to integers between 1 and 10,000? — Use `Annotated[int, Path(ge=1, le=10_000)]`; FastAPI returns 422 for out-of-range values.
- 3. What is the `Annotated` style and why prefer it? — `Annotated[T, Path(...)]` moves metadata into the type hint, keeping the default value slot free for actual defaults and improving editor support.
- 4. When would you use an `Enum` for a path parameter? — When the value set is closed and known up front (model names, environment names); FastAPI documents the enum in OpenAPI and validates the input.
- 5. How do you set a custom success status code for a route? — Pass `status_code=status.HTTP_201_CREATED` (or another constant) to the route decorator.

### Mini Project

Build a "Model Registry" API: A FastAPI service with `GET /models/{name}` that accepts an enum model name (`resnet`, `vgg`, `alexnet`) and returns metadata JSON. Add a second route `GET /versions/{version_id}` constrained to integers 1-1000, returning a fake changelog. Suggested approach:
  - Define `class ModelName(str, Enum)` with three values
  - Add `/models/{name}` typed `name: ModelName` returning `{"name": name, "params": ...}`
  - Add `/versions/{version_id}` typed `Annotated[int, Path(ge=1, le=1000)]`
  - Verify at /docs that the enum renders as a dropdown
  - Test `curl /models/foo` returns 422 and `/versions/0` returns 422

### Exercises

1. Create three routes `/users/me`, `/users/{user_id}`, `/users/{user_id}/posts/{post_id}` and confirm ordering matches expected behavior.
2. Add `Annotated[int, Path(ge=1)]` to `/users/{user_id}` and verify negative IDs return 422.
3. Add an Enum-typed `/languages/{lang}` endpoint with three values and verify the dropdown appears in /docs.
4. Set `status_code=201` on a POST `/users` route and verify the response code via `curl -i`.
5. >>> QUIZ (Stage 2) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What happens if you declare `/users/{user_id}` before `/users/me`?
8. A) FastAPI raises an ImportError
9. B) `/users/me` is shadowed and never matched (*)
10. C) FastAPI auto-reorders the routes
11. D) Both routes match and the response is concatenated
12. Explanation: Routes match in declaration order; the dynamic `{user_id}` captures "me" as a string before the static route can match.
13. Q2: Which correctly constrains an ID to integers 1..10000?
14. A) `item_id: int = Path(1, 10000)`
15. B) `item_id: Path(int, min=1, max=10000)`
16. C) `item_id: Annotated[int, Path(ge=1, le=10_000)]` (*)
17. D) `item_id: Range[int](1, 10000)`
18. Explanation: `Annotated[T, Path(ge=..., le=...)]` is the modern FastAPI style for path-param constraints.
19. Q3: Are path parameters required or optional by default?
20. A) Optional with a default of None
21. B) Required only when typed `int`
22. C) Optional when typed `str`
23. D) Required — optional values must go in the query string (*)
24. Explanation: A path segment can't be missing, so FastAPI treats all path params as required; use query params for optional values.
25. Q4: What does `Path(...)` (Ellipsis) signify?
26. A) The parameter is required even when a default could be inferred (*)
27. B) The parameter is optional
28. C) The parameter is a list
29. D) The parameter is deprecated
30. Explanation: `...` marks the param as required in the metadata; it's the Pydantic/FastAPI convention for "no default, this is mandatory".
31. Q5: How does FastAPI document an Enum-typed path parameter?
32. A) It doesn't — enums are erased
33. B) As an enum schema in OpenAPI, with /docs showing a dropdown (*)
34. C) As a free-form string with a regex
35. D) As a number
36. Explanation: FastAPI emits the Enum's values as an OpenAPI enum schema, and Swagger UI renders them as a dropdown.
37. Q6: Which decorator handles a DELETE request?
38. A) `@app.remove`
39. B) `@app.del`
40. C) `@app.delete` (*)
41. D) `@app.route(method="DELETE")`
42. Explanation: FastAPI exposes `@app.delete(...)` for DELETE; `del` is a Python keyword and can't be a method name.
43. Q7: How do you set a custom success status code for a route?
44. A) Return a tuple `(body, 201)`
45. B) Raise `HTTPException(201)`
46. C) Set `response.status_code = 201` after returning
47. D) Pass `status_code=status.HTTP_201_CREATED` to the decorator (*)
48. Explanation: The decorator's `status_code` argument sets the response code in OpenAPI and at runtime.
49. Q8: What is the `Annotated` style preferred over?
50. A) The older `param: type = Path(...)` style (*)
51. B) Query strings
52. C) Pydantic models
53. D) Type hints in general
54. Explanation: `Annotated[T, Path(...)]` keeps the default-value slot free for actual defaults and improves editor/IDE inference.
55. Q9: Which path-param type would you use for a Twitter Snowflake ID?
56. A) `int` (64-bit)
57. B) `str` (to avoid JSON numeric overflow in JS clients) (*)
58. C) `float`
59. D) `bool`
60. Explanation: Snowflake IDs exceed JavaScript's safe integer (2^53); many APIs serialize them as strings to avoid precision loss in browsers.
61. Q10: What does FastAPI return when a path param fails validation?
62. A) 400 Bad Request
63. B) 404 Not Found
64. C) 422 Unprocessable Entity with a structured error body (*)
65. D) 500 Internal Server Error
66. Explanation: FastAPI returns 422 with a JSON body listing the failing location, input, and reason; the body shape comes from Pydantic's validation error.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if you declare `/users/{user_id}` before `/users/me`?
  options:
    - FastAPI raises an ImportError
    - "`/users/me` is shadowed and never matched"
    - FastAPI auto-reorders the routes
    - Both routes match and the response is concatenated
  correctIndex: 1
  explanation: Routes match in declaration order; the dynamic `{user_id}` captures "me" as a string before the static route can match.
- id: q2
  question: Which correctly constrains an ID to integers 1..10000?
  options:
    - "`item_id: int = Path(1, 10000)`"
    - "`item_id: Path(int, min=1, max=10000)`"
    - "`item_id: Annotated[int, Path(ge=1, le=10_000)]`"
    - "`item_id: Range[int](1, 10000)`"
  correctIndex: 2
  explanation: "`Annotated[T, Path(ge=..., le=...)]` is the modern FastAPI style for path-param constraints."
- id: q3
  question: Are path parameters required or optional by default?
  options:
    - Optional with a default of None
    - Required only when typed `int`
    - Optional when typed `str`
    - Required — optional values must go in the query string
  correctIndex: 3
  explanation: A path segment can't be missing, so FastAPI treats all path params as required; use query params for optional values.
- id: q4
  question: What does `Path(...)` (Ellipsis) signify?
  options:
    - The parameter is required even when a default could be inferred
    - The parameter is optional
    - The parameter is a list
    - The parameter is deprecated
  correctIndex: 0
  explanation: "`...` marks the param as required in the metadata; it's the Pydantic/FastAPI convention for \"no default, this is mandatory\"."
- id: q5
  question: How does FastAPI document an Enum-typed path parameter?
  options:
    - It doesn't — enums are erased
    - As an enum schema in OpenAPI, with /docs showing a dropdown
    - As a free-form string with a regex
    - As a number
  correctIndex: 1
  explanation: FastAPI emits the Enum's values as an OpenAPI enum schema, and Swagger UI renders them as a dropdown.
- id: q6
  question: Which decorator handles a DELETE request?
  options:
    - "`@app.remove`"
    - "`@app.del`"
    - "`@app.delete`"
    - '`@app.route(method="DELETE")`'
  correctIndex: 2
  explanation: FastAPI exposes `@app.delete(...)` for DELETE; `del` is a Python keyword and can't be a method name.
- id: q7
  question: How do you set a custom success status code for a route?
  options:
    - Return a tuple `(body, 201)`
    - Raise `HTTPException(201)`
    - Set `response.status_code = 201` after returning
    - Pass `status_code=status.HTTP_201_CREATED` to the decorator
  correctIndex: 3
  explanation: The decorator's `status_code` argument sets the response code in OpenAPI and at runtime.
- id: q8
  question: What is the `Annotated` style preferred over?
  options:
    - "The older `param: type = Path(...)` style"
    - Query strings
    - Pydantic models
    - Type hints in general
  correctIndex: 0
  explanation: "`Annotated[T, Path(...)]` keeps the default-value slot free for actual defaults and improves editor/IDE inference."
- id: q9
  question: Which path-param type would you use for a Twitter Snowflake ID?
  options:
    - "`int` (64-bit)"
    - "`str` (to avoid JSON numeric overflow in JS clients)"
    - "`float`"
    - "`bool`"
  correctIndex: 1
  explanation: Snowflake IDs exceed JavaScript's safe integer (2^53); many APIs serialize them as strings to avoid precision loss in browsers.
- id: q10
  question: What does FastAPI return when a path param fails validation?
  options:
    - 400 Bad Request
    - 404 Not Found
    - 422 Unprocessable Entity with a structured error body
    - 500 Internal Server Error
  correctIndex: 2
  explanation: FastAPI returns 422 with a JSON body listing the failing location, input, and reason; the body shape comes from Pydantic's validation error.
```

