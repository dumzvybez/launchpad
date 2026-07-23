---
slug: fastapi-path-operation-decorators-tags-summary-response-model
id: fastapi-05
track: fastapi
order: 5
title: Path Operation Decorators — tags, summary, response_model
description: Annotate path operations with tags, summaries, descriptions, deprecation, response_model, status codes, and OpenAPI examples that make your /docs pages production-grade.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=1200s
whyItMatters: Annotate path operations with tags, summaries, descriptions, deprecation, response_model, status codes, and OpenAPI examples that make your /docs pages production-grade.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Path Operation Decorators — tags, summary, response_model

## Path Operation Decorators — tags, summary, response_model

### Why It Matters

Annotate path operations with tags, summaries, descriptions, deprecation, response_model, status codes, and OpenAPI examples that make your /docs pages production-grade.

Annotate path operations with tags, summaries, descriptions, deprecation, response_model, status codes, and OpenAPI examples that make your /docs pages production-grade.

### Prerequisites

- Stage 2: Path Operations and Path Parameters
- Stage 4: Pydantic Models and Validation
- Familiarity with REST resource grouping.

### Topics

- `tags` for grouping routes in /docs
- `summary`, `description`, `response_description`
- `response_model` for response filtering and validation
- `response_model_exclude`, `response_model_include`, `response_model_by_alias`
- `response_model_exclude_unset`, `response_model_exclude_defaults`, `response_model_exclude_none`
- `status_code`, `deprecated`, `operation_id`
- `responses` for additional status codes and error schemas
- `openapi_extra` for vendor extensions (x-amazon-apigateway-*, etc.)

### Key Concepts

- `response_model` filters the output: only fields declared on the model are returned, even if the handler returns more.
- `response_model_exclude_unset=True` returns only fields the caller explicitly set — critical for PATCH endpoints.
- `response_model_exclude_none=True` strips null fields, which is great for sparse JSON.
- `tags` groups routes in /docs; tag order in the OpenAPI schema controls /docs ordering.
- `operation_id` becomes the operation's name in generated clients; set it explicitly for stable SDKs.

```python
from fastapi import FastAPI, status
from pydantic import BaseModel

class UserOut(BaseModel):
    id: int
    email: str

class UserIn(BaseModel):
    email: str
    password: str

app = FastAPI()

@app.post(
    "/users",
    tags=["users"],
    summary="Create a user",
    description="Creates a new user account and returns the public representation.",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    operation_id="createUser",
)
async def create_user(user: UserIn):
    return {"id": 1, "email": user.email, "password": "LEAKED"}  # password filtered
```
Caption: Tags, summary, description, response_model

### Common Pitfalls

- Returning a dict with extra fields and assuming they'll be stripped — they will be stripped only if `response_model` is set; without it, the raw dict is returned as-is.
- Using `response_model_exclude_unset=True` on a list endpoint — it excludes per-item unset fields, which is usually what you want, but it can hide defaults the client expects.
- Forgetting `response_model_by_alias=True` when your Pydantic model uses `alias` — the response will use Python attribute names instead of the API contract names.
- Setting `operation_id` only on some routes — generated clients require unique, stable IDs; FastAPI auto-generates from function name, but renaming a function breaks clients.
- Putting `tags=["users"]` inconsistently — once a route is tagged, it appears under that tag in /docs; mixing tagged and untagged routes creates an unruly "default" group.

### Real-World Applications

- Stripe's API groups endpoints under `Customers`, `Charges`, `PaymentIntents` — exactly the `tags` pattern in FastAPI.
- GitHub's REST API documents per-route summaries and error schemas (e.g., 410 Gone on moved endpoints), expressible via `responses={410: {...}}`.
- Slack's web API marks deprecated methods with a banner in their docs; FastAPI's `deprecated=True` renders a struck-through route in Swagger UI.
- Microsoft Graph uses stable operation IDs (`getUser`, `listMessages`) so generated SDKs have stable method names — same as FastAPI's `operation_id`.

### Interview Questions

- 1. What does `response_model` do beyond documentation? — It validates and filters the response: only declared fields are returned, and the output is validated against the schema at runtime.
- 2. When would you use `response_model_exclude_unset=True`? — On PATCH endpoints where the client sends only changed fields; the response should reflect what was set, not defaults.
- 3. How do you document a 404 response with a custom error schema? — Use `responses={404: {"model": ErrorOut, "description": "Not found"}}`.
- 4. What is `operation_id` for? — It's the OpenAPI operation name used by code generators; set it explicitly to keep generated SDK method names stable across refactors.
- 5. How do you deprecate a route in /docs? — Pass `deprecated=True` to the route decorator; Swagger UI shows it struck-through.

### Mini Project

Build a "Well-Documented CRUD" Stub: A `users` resource with GET (list), GET (detail), POST, PATCH, DELETE, all tagged `users`, each with summary, response_model, error responses (404, 422, 409), and `operation_id` set explicitly. The PATCH endpoint uses `response_model_exclude_unset=True`. Suggested approach:
  - Define `UserOut`, `UserIn`, `UserPatch`, `ErrorOut` Pydantic models
  - Tag every route `users`, set `operation_id="listUsers"`, `createUser`, etc.
  - Add `responses={404: {"model": ErrorOut}, 422: {"model": ErrorOut}}`
  - Mark DELETE as `deprecated=True` to demo the rendering
  - Verify /docs groups everything under "users"

### Exercises

1. Add `response_model=UserOut` to a route that returns a dict with extra fields; verify the extras are stripped.
2. Add `response_model_exclude_unset=True` to a PATCH route and confirm default-valued fields are excluded.
3. Document a 409 Conflict response with a custom `ConflictError` schema and trigger it.
4. Set `operation_id="getUserById"` on a route and verify a generated `openapi-python-client` uses that name.
5. >>> QUIZ (Stage 5) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does setting `response_model=UserOut` guarantee?
8. A) The response is filtered and validated against UserOut before being sent (*)
9. B) The handler can only return UserOut instances
10. C) The route returns 200 by default
11. D) The route is added to the "users" tag
12. Explanation: `response_model` causes FastAPI to validate and filter the handler's return value through the model — extra fields are stripped.
13. Q2: Which option excludes fields the caller did not explicitly set?
14. A) `response_model_exclude_none=True`
15. B) `response_model_exclude_unset=True` (*)
16. C) `response_model_exclude_defaults=True`
17. D) `response_model_include={"id"}`
18. Explanation: `_exclude_unset` returns only fields that were explicitly provided in the input — ideal for PATCH.
19. Q3: What is `operation_id` used for?
20. A) Logging
21. B) Caching
22. C) Stable names in generated client SDKs (*)
23. D) Authentication
24. Explanation: `operation_id` becomes the operation name in generated SDKs; set it explicitly to avoid breakage from function renames.
25. Q4: How do you deprecate a route in /docs?
26. A) Add `@deprecated` from typing
27. B) Prefix the path with `/deprecated/`
28. C) Set `status_code=410`
29. D) Pass `deprecated=True` to the decorator (*)
30. Explanation: `deprecated=True` flags the route in the OpenAPI schema; Swagger UI shows it struck-through with a warning.
31. Q5: Which parameter groups routes in /docs?
32. A) `tags` (*)
33. B) `group`
34. C) `section`
35. D) `category`
36. Explanation: `tags=["users"]` groups the route under a "users" heading in Swagger UI; tag order in the schema controls display order.
37. Q6: What does `responses={404: {"model": ErrorOut}}` do?
38. A) Returns 404 by default
39. B) Documents a 404 response with the ErrorOut schema in OpenAPI (*)
40. C) Raises 404 if ErrorOut is missing
41. D) Maps 404 to a custom handler
42. Explanation: `responses` adds extra status codes and schemas to the OpenAPI doc; it doesn't change runtime behavior beyond documentation.
43. Q7: When would you use `response_model_by_alias=True`?
44. A) When the response is a list
45. B) When the response is binary
46. C) When the Pydantic model uses `alias` and you want the alias in the JSON response (*)
47. D) When you want to skip validation
48. Explanation: By default FastAPI uses Python attribute names; `by_alias=True` outputs the alias names, matching the API contract.
49. Q8: What is the default status code for a POST route unless overridden?
50. A) 200
51. B) 201
52. C) 204
53. D) 200 (FastAPI defaults all routes to 200 unless `status_code=` is set) (*)
54. Explanation: FastAPI's default status code is 200 for all routes; you must pass `status_code=201` for POST creates.
55. Q9: What does `openapi_extra` allow?
56. A) Adding vendor extensions (x-*) and overriding schema fields (*)
57. B) Adding extra Python imports
58. C) Adding extra middleware
59. D) Adding extra response headers automatically
60. Explanation: `openapi_extra` merges arbitrary keys into the operation's OpenAPI object — useful for `x-amazon-apigateway-integration` and similar.
61. Q10: Which is a valid route decorator with metadata?
62. A) `@app.get("/x", tags=["a"], response_model=M)`
63. B) `@app.get(path="/x", response_model=M, tags=["a"])` (A and C both valid) (*)
64. C) `@app.route("/x", method="GET", tags=["a"])`
65. D) Only A
66. Explanation: Both the positional-path form and the keyword form are valid; FastAPI accepts `path` as a keyword argument.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does setting `response_model=UserOut` guarantee?
  options:
    - The response is filtered and validated against UserOut before being sent
    - The handler can only return UserOut instances
    - The route returns 200 by default
    - The route is added to the "users" tag
  correctIndex: 0
  explanation: "`response_model` causes FastAPI to validate and filter the handler's return value through the model — extra fields are stripped."
- id: q2
  question: Which option excludes fields the caller did not explicitly set?
  options:
    - "`response_model_exclude_none=True`"
    - "`response_model_exclude_unset=True`"
    - "`response_model_exclude_defaults=True`"
    - '`response_model_include={"id"}`'
  correctIndex: 1
  explanation: "`_exclude_unset` returns only fields that were explicitly provided in the input — ideal for PATCH."
- id: q3
  question: What is `operation_id` used for?
  options:
    - Logging
    - Caching
    - Stable names in generated client SDKs
    - Authentication
  correctIndex: 2
  explanation: "`operation_id` becomes the operation name in generated SDKs; set it explicitly to avoid breakage from function renames."
- id: q4
  question: How do you deprecate a route in /docs?
  options:
    - Add `@deprecated` from typing
    - Prefix the path with `/deprecated/`
    - Set `status_code=410`
    - Pass `deprecated=True` to the decorator
  correctIndex: 3
  explanation: "`deprecated=True` flags the route in the OpenAPI schema; Swagger UI shows it struck-through with a warning."
- id: q5
  question: Which parameter groups routes in /docs?
  options:
    - "`tags`"
    - "`group`"
    - "`section`"
    - "`category`"
  correctIndex: 0
  explanation: '`tags=["users"]` groups the route under a "users" heading in Swagger UI; tag order in the schema controls display order.'
- id: q6
  question: 'What does `responses={404: {"model": ErrorOut}}` do?'
  options:
    - Returns 404 by default
    - Documents a 404 response with the ErrorOut schema in OpenAPI
    - Raises 404 if ErrorOut is missing
    - Maps 404 to a custom handler
  correctIndex: 1
  explanation: "`responses` adds extra status codes and schemas to the OpenAPI doc; it doesn't change runtime behavior beyond documentation."
- id: q7
  question: When would you use `response_model_by_alias=True`?
  options:
    - When the response is a list
    - When the response is binary
    - When the Pydantic model uses `alias` and you want the alias in the JSON response
    - When you want to skip validation
  correctIndex: 2
  explanation: By default FastAPI uses Python attribute names; `by_alias=True` outputs the alias names, matching the API contract.
- id: q8
  question: What is the default status code for a POST route unless overridden?
  options:
    - "200"
    - "201"
    - "204"
    - 200 (FastAPI defaults all routes to 200 unless `status_code=` is set)
  correctIndex: 3
  explanation: FastAPI's default status code is 200 for all routes; you must pass `status_code=201` for POST creates.
- id: q9
  question: What does `openapi_extra` allow?
  options:
    - Adding vendor extensions (x-*) and overriding schema fields
    - Adding extra Python imports
    - Adding extra middleware
    - Adding extra response headers automatically
  correctIndex: 0
  explanation: "`openapi_extra` merges arbitrary keys into the operation's OpenAPI object — useful for `x-amazon-apigateway-integration` and similar."
- id: q10
  question: Which is a valid route decorator with metadata?
  options:
    - '`@app.get("/x", tags=["a"], response_model=M)`'
    - '`@app.get(path="/x", response_model=M, tags=["a"])` (A and C both valid)'
    - '`@app.route("/x", method="GET", tags=["a"])`'
    - Only A
  correctIndex: 1
  explanation: Both the positional-path form and the keyword form are valid; FastAPI accepts `path` as a keyword argument.
```

