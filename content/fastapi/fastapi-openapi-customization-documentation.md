---
slug: fastapi-openapi-customization-documentation
id: fastapi-16
track: fastapi
order: 16
title: OpenAPI Customization and Documentation
description: Customize the OpenAPI schema — custom schemas, examples, security schemes, deprecation, vendor extensions, and a hand-rolled `/openapi.json` override for full control.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=4500s
whyItMatters: Customize the OpenAPI schema — custom schemas, examples, security schemes, deprecation, vendor extensions, and a hand-rolled `/openapi. json` override for full control.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# OpenAPI Customization and Documentation

## OpenAPI Customization and Documentation

### Why It Matters

Customize the OpenAPI schema — custom schemas, examples, security schemes, deprecation, vendor extensions, and a hand-rolled `/openapi. json` override for full control.

Customize the OpenAPI schema — custom schemas, examples, security schemes, deprecation, vendor extensions, and a hand-rolled `/openapi.json` override for full control.

### Prerequisites

- Stage 5: Path Operation Decorators — tags, summary, response_model
- Stage 4: Pydantic Models and Validation
- Familiarity with the OpenAPI 3.x spec.

### Topics

- The default `/openapi.json`, `/docs`, `/redoc` endpoints
- `Field(examples=[...])`, `Body(openapi_examples={...})`, `model_config["json_schema_extra"]`
- `responses={404: {"model": ErrorOut, "content": {...}}}`
- Security schemes: `OAuth2`, `HTTPBearer`, `APIKeyHeader`
- `openapi_extra` for vendor extensions (`x-internal`, `x-amazon-apigateway-*`)
- `app.openapi()` override for fully custom schemas
- `servers`, `externalDocs`, `tags` with descriptions
- Disabling `/docs` or `/redoc` in production

### Key Concepts

- FastAPI builds the OpenAPI schema lazily on first request to `/openapi.json`; override `app.openapi()` to customize.
- Examples in `Field(examples=[...])` and `Body(openapi_examples={...})` appear in Swagger UI's "Try it out" and request samples.
- Security schemes are declared once and attached per-route via `Security()`; Swagger UI shows an "Authorize" button.
- `json_schema_extra` on a Pydantic model lets you inject `examples`, `pattern`, or vendor extensions into the schema.
- Hide internal endpoints by setting `include_in_schema=False` on the decorator.

```python
from pydantic import BaseModel, Field, ConfigDict

class UserCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {"email": "alice@example.com", "password": "Hunter2!"},
            ]
        }
    )
    email: str = Field(examples=["alice@example.com"])
    password: str = Field(min_length=8, examples=["Hunter2!"])
```
Caption: Field examples and json_schema_extra

### Common Pitfalls

- Forgetting to cache `app.openapi_schema` in the override — regenerates the schema on every request; check `if app.openapi_schema: return ...`.
- Setting `include_in_schema=False` but still listing the route in `app.routes` — it's hidden from /docs but still callable; combine with auth.
- Examples in `Field(...)` vs `Body(openapi_examples=...)` — both work; the former is per-field, the latter per-request with named examples.
- Disabling `/docs` and `/redoc` in dev — many teams do this in prod only; set `FastAPI(openapi_url=None, docs_url=None, redoc_url=None)`.
- Schema bloat — large enums or recursive models inflate `/openapi.json`; consider splitting into multiple specs for huge APIs.

### Real-World Applications

- Stripe's API docs are heavily customized OpenAPI with rich examples and vendor extensions — exactly what `Field(examples=...)` and `openapi_extra` enable.
- GitHub's REST API spec ships hand-curated examples per endpoint; FastAPI's `Body(openapi_examples=...)` matches this pattern.
- Microsoft Graph's OpenAPI includes `x-ms-docs-service-type` and other vendor extensions; `openapi_extra` is the FastAPI hook.
- Slack's OpenAPI uses server variables and per-method deprecation; FastAPI supports both via `servers=` and `deprecated=True`.

### Interview Questions

- 1. How do you fully customize the OpenAPI schema? — Override `app.openapi` with a function that calls `get_openapi(...)` and mutates the result; cache in `app.openapi_schema`.
- 2. How do you add examples that appear in Swagger UI? — Use `Field(examples=[...])` for fields or `Body(openapi_examples={...})` for whole-request named examples.
- 3. How do you hide an internal endpoint from /docs? — Pass `include_in_schema=False` to the route decorator (still callable; combine with auth).
- 4. How do you disable /docs and /redoc in production? — Set `FastAPI(openapi_url=None, docs_url=None, redoc_url=None)` or pass explicit None values.
- 5. What are vendor extensions in OpenAPI? — Keys starting with `x-` (e.g., `x-internal`, `x-amazon-apigateway-integration`) ignored by spec but used by tools.

### Mini Project

Build a "Branded OpenAPI" Service: Override `app.openapi` to add an `x-logo`, custom `info.description`, server list, and a security scheme. Add per-field examples and named request examples. Hide an `/internal/health` route. Suggested approach:
  - Use `get_openapi(...)` to build the base schema
  - Set `schema["info"]["x-logo"]` and `schema["servers"]`
  - Add `HTTPBearer` to the components and reference via `Security()`
  - Use `Field(examples=[...])` on a request model
  - Add `include_in_schema=False` to the internal route

### Exercises

1. Add `Field(examples=[...])` to a request model and verify the example appears in Swagger UI's "Try it out".
2. Override `app.openapi` to set `info.x-logo`; fetch `/openapi.json` and verify.
3. Add `include_in_schema=False` to a route and confirm it disappears from /docs.
4. Disable /docs and /redoc via FastAPI constructor kwargs and confirm 404 on those paths.
5. >>> QUIZ (Stage 16) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: How do you fully customize the OpenAPI schema?
8. A) Edit /openapi.json directly
9. B) Use a FastAPI plugin
10. C) You can't — it's auto-generated
11. D) Override `app.openapi` with a function using `get_openapi(...)` (*)
12. Explanation: Override `app.openapi` to call `get_openapi`, mutate the result, cache in `app.openapi_schema`, and return it.
13. Q2: How do you add field examples that show in Swagger UI?
14. A) `Field(examples=[...])` (*)
15. B) Docstrings
16. C) Comments
17. D) `app.docs.examples`
18. Explanation: `Field(examples=[...])` injects examples into the schema; Swagger UI renders them in "Try it out".
19. Q3: How do you hide a route from /docs?
20. A) Delete the route
21. B) Pass `include_in_schema=False` to the decorator (*)
22. C) Prefix the path with `_`
23. D) Use a custom middleware
24. Explanation: `include_in_schema=False` removes the route from the OpenAPI schema but it remains callable; combine with auth.
25. Q4: How do you disable /docs and /redoc in production?
26. A) Set DEBUG=False
27. B) Use a firewall
28. C) Set `docs_url=None, redoc_url=None` (and optionally `openapi_url=None`) (*)
29. D) You can't disable them
30. Explanation: Passing `None` for those URLs unmounts them; `openapi_url=None` also hides the raw schema.
31. Q5: Why must you cache `app.openapi_schema` in the override?
32. A) Schemas are immutable
33. B) To validate it
34. C) To encrypt it
35. D) To avoid regenerating the schema on every request (*)
36. Explanation: `get_openapi` walks all routes; caching avoids that cost on each `/openapi.json` fetch.
37. Q6: What are vendor extensions in OpenAPI?
38. A) Custom tags starting with `x-` ignored by the spec (*)
39. B) Extensions to Pydantic
40. C) Third-party plugins
41. D) Schema validators
42. Explanation: OpenAPI reserves `x-*` keys for vendor-specific metadata (e.g., `x-amazon-apigateway-integration`); tools like AWS API Gateway read them.
43. Q7: Which parameter attaches a security scheme to a route?
44. A) `Depends(security)`
45. B) `Security(dep, scopes=[...])` (*)
46. C) `app.security = ...`
47. D) `route.auth = ...`
48. Explanation: `Security` is `Depends` plus security-scheme metadata and optional scopes; Swagger UI shows the "Authorize" button.
49. Q8: Which Pydantic config injects extra schema fields?
50. A) `class Meta: schema = ...`
51. B) `__schema__ = ...`
52. C) `model_config = ConfigDict(json_schema_extra={...})` (*)
53. D) `Field(schema_extra=...)`
54. Explanation: `json_schema_extra` is merged into the model's JSON schema; useful for examples, patterns, and vendor extensions.
55. Q9: What does `Body(openapi_examples={...})` provide?
56. A) Per-field examples
57. B) Response examples
58. C) Header examples
59. D) Named whole-request examples shown in Swagger UI's dropdown (*)
60. Explanation: `openapi_examples` lets you ship multiple named example payloads (e.g., "normal", "admin") that users can pick from.
61. Q10: When is the OpenAPI schema generated by default?
62. A) Lazily on first `/openapi.json` request (and cached) (*)
63. B) At import time
64. C) At server start
65. D) On every request
66. Explanation: FastAPI builds the schema lazily and caches it in `app.openapi_schema`; the override must respect that pattern.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do you fully customize the OpenAPI schema?
  options:
    - Edit /openapi.json directly
    - Use a FastAPI plugin
    - You can't — it's auto-generated
    - Override `app.openapi` with a function using `get_openapi(...)`
  correctIndex: 3
  explanation: Override `app.openapi` to call `get_openapi`, mutate the result, cache in `app.openapi_schema`, and return it.
- id: q2
  question: How do you add field examples that show in Swagger UI?
  options:
    - "`Field(examples=[...])`"
    - Docstrings
    - Comments
    - "`app.docs.examples`"
  correctIndex: 0
  explanation: '`Field(examples=[...])` injects examples into the schema; Swagger UI renders them in "Try it out".'
- id: q3
  question: How do you hide a route from /docs?
  options:
    - Delete the route
    - Pass `include_in_schema=False` to the decorator
    - Prefix the path with `_`
    - Use a custom middleware
  correctIndex: 1
  explanation: "`include_in_schema=False` removes the route from the OpenAPI schema but it remains callable; combine with auth."
- id: q4
  question: How do you disable /docs and /redoc in production?
  options:
    - Set DEBUG=False
    - Use a firewall
    - Set `docs_url=None, redoc_url=None` (and optionally `openapi_url=None`)
    - You can't disable them
  correctIndex: 2
  explanation: Passing `None` for those URLs unmounts them; `openapi_url=None` also hides the raw schema.
- id: q5
  question: Why must you cache `app.openapi_schema` in the override?
  options:
    - Schemas are immutable
    - To validate it
    - To encrypt it
    - To avoid regenerating the schema on every request
  correctIndex: 3
  explanation: "`get_openapi` walks all routes; caching avoids that cost on each `/openapi.json` fetch."
- id: q6
  question: What are vendor extensions in OpenAPI?
  options:
    - Custom tags starting with `x-` ignored by the spec
    - Extensions to Pydantic
    - Third-party plugins
    - Schema validators
  correctIndex: 0
  explanation: OpenAPI reserves `x-*` keys for vendor-specific metadata (e.g., `x-amazon-apigateway-integration`); tools like AWS API Gateway read them.
- id: q7
  question: Which parameter attaches a security scheme to a route?
  options:
    - "`Depends(security)`"
    - "`Security(dep, scopes=[...])`"
    - "`app.security = ...`"
    - "`route.auth = ...`"
  correctIndex: 1
  explanation: '`Security` is `Depends` plus security-scheme metadata and optional scopes; Swagger UI shows the "Authorize" button.'
- id: q8
  question: Which Pydantic config injects extra schema fields?
  options:
    - "`class Meta: schema = ...`"
    - "`__schema__ = ...`"
    - "`model_config = ConfigDict(json_schema_extra={...})`"
    - "`Field(schema_extra=...)`"
  correctIndex: 2
  explanation: "`json_schema_extra` is merged into the model's JSON schema; useful for examples, patterns, and vendor extensions."
- id: q9
  question: What does `Body(openapi_examples={...})` provide?
  options:
    - Per-field examples
    - Response examples
    - Header examples
    - Named whole-request examples shown in Swagger UI's dropdown
  correctIndex: 3
  explanation: '`openapi_examples` lets you ship multiple named example payloads (e.g., "normal", "admin") that users can pick from.'
- id: q10
  question: When is the OpenAPI schema generated by default?
  options:
    - Lazily on first `/openapi.json` request (and cached)
    - At import time
    - At server start
    - On every request
  correctIndex: 0
  explanation: FastAPI builds the schema lazily and caches it in `app.openapi_schema`; the override must respect that pattern.
```

