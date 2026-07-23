---
slug: fastapi-project-structure-routers-services-repositories
id: fastapi-17
track: fastapi
order: 17
title: Project Structure — Routers, Services, Repositories
description: Structure a FastAPI project with APIRouters per feature, a service layer for business logic, a repository layer for data access, and shared dependencies — the layered architecture production teams converge on.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=4800s
whyItMatters: Structure a FastAPI project with APIRouters per feature, a service layer for business logic, a repository layer for data access, and shared dependencies — the layered architecture production teams converge on.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Project Structure — Routers, Services, Repositories

## Project Structure — Routers, Services, Repositories

### Why It Matters

Structure a FastAPI project with APIRouters per feature, a service layer for business logic, a repository layer for data access, and shared dependencies — the layered architecture production teams converge on.

Structure a FastAPI project with APIRouters per feature, a service layer for business logic, a repository layer for data access, and shared dependencies — the layered architecture production teams converge on.

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 8: Database Integration with SQLAlchemy and Alembic
- Comfort with Python packages and imports.

### Topics

- `APIRouter` for per-feature route groups
- `include_router(router, prefix=..., tags=[...])` composition
- Service layer: pure business logic, no HTTP concerns
- Repository layer: data access, no business logic
- Dependency wiring: `get_db` -> repository -> service -> route
- Pydantic schemas split by use case (Create, Update, Out)
- Settings via `pydantic-settings` (env-driven config)
- Layout: `app/main.py`, `app/api/v1/`, `app/core/`, `app/services/`, `app/repositories/`, `app/models/`, `app/schemas/`

### Key Concepts

- `APIRouter` modularizes routes; each feature module exposes its own router that `main.py` includes.
- The layered architecture (route -> service -> repository -> DB) keeps business logic testable without HTTP.
- `pydantic-settings.BaseSettings` reads env vars; use it for DB URLs, secrets, feature flags.
- Schemas should be split by use case: `UserCreate`, `UserUpdate`, `UserOut` — never reuse one model for both input and output.
- Repositories own queries; services own rules; routes own HTTP.

```python
# app/api/v1/users.py
from fastapi import APIRouter, Depends, status
from app.schemas.user import UserCreate, UserOut
from app.services.users import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, svc: UserService = Depends()):
    return await svc.create(payload)
```
Caption: Router with prefix

### Common Pitfalls

- Putting SQL inside route handlers — couples HTTP to data access; extract to a repository so business rules are testable.
- Reusing one Pydantic model for input and output — leaks fields (e.g., password hash) into responses; split into Create/Update/Out.
- Forgetting `prefix=` on `include_router` (or doubling it) — URLs end up wrong; pick one place to set the prefix and stick with it.
- Importing models inside `main.py` only — Alembic autogenerate misses models that aren't imported at app startup; ensure `app.models` is imported.
- Hard-coding settings in code — use `pydantic-settings.BaseSettings` and read env vars; never commit secrets.

### Real-World Applications

- Netflix's service templates use layered architectures (route/service/repo) across microservices; FastAPI's DI makes this natural.
- Uber's domain-driven services separate business logic from data access; FastAPI's dependency graph supports this cleanly.
- Microsoft's FastAPI samples in Azure docs use the layered structure with `pydantic-settings` for config.
- OpenAI's internal tooling follows the same route/service/repo split; their Cookbook examples mirror this layout.

### Interview Questions

- 1. Why split routes, services, and repositories? — Routes own HTTP, services own business rules, repositories own data access; this makes logic testable without HTTP.
- 2. How does `APIRouter` help? — Modularizes routes per feature; `main.py` includes routers with prefixes and tags.
- 3. Why use separate Create/Update/Out schemas? — Different fields are accepted vs returned; reusing one model leaks sensitive fields (e.g., password hash).
- 4. How do you load config from env? — Use `pydantic-settings.BaseSettings`; it reads env vars and validates types.
- 5. Why must Alembic see all models at import time? — Autogenerate compares `Base.metadata` to the DB; unimported models aren't in metadata and get missed.

### Mini Project

Build a "Layered Users + Posts" API: Two features (`users`, `posts`), each with router/service/repository, schemas split by use case, and `pydantic-settings` config. `main.py` includes both routers under `/api/v1`. Suggested approach:
  - Create `app/core/config.py` with `Settings(BaseSettings)`
  - Define `User`/`Post` models in `app/models/`
  - Define `UserCreate`/`UserOut`/`PostCreate`/`PostOut` in `app/schemas/`
  - Write `UserRepository`/`PostRepository` and `UserService`/`PostService`
  - `main.py` includes `users_router` and `posts_router` under `/api/v1`

### Exercises

1. Refactor a single-file FastAPI app into `api/v1/`, `services/`, `repositories/`, `schemas/`.
2. Split one Pydantic model into Create/Update/Out; verify the Out model strips sensitive fields.
3. Add `pydantic-settings` config loading `DATABASE_URL` and `SECRET_KEY` from env.
4. Write a unit test for a service that uses a mocked repository.
5. >>> QUIZ (Stage 17) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which class modularizes a group of routes?
8. A) `APIRouter` (*)
9. B) `APIGroup`
10. C) `RouteGroup`
11. D) `Blueprint`
12. Explanation: `APIRouter` collects routes per feature; `app.include_router(router, prefix=..., tags=[...])` mounts it.
13. Q2: Where should SQL queries live?
14. A) In route handlers
15. B) In a repository layer (*)
16. C) In Pydantic models
17. D) In main.py
18. Explanation: Repositories own data access; routes call services, services call repositories — keeping SQL out of routes.
19. Q3: Why split Pydantic schemas by use case?
20. A) For performance
21. B) Pydantic requires it
22. C) Different fields are accepted vs returned; reusing one model leaks sensitive fields (*)
23. D) It's the only way to validate
24. Explanation: `UserCreate` accepts a password; `UserOut` must not return it. Separate schemas enforce this at the type level.
25. Q4: How do you load config from env?
26. A) `os.getenv` everywhere
27. B) Hard-code in settings.py
28. C) A custom YAML parser
29. D) `pydantic-settings.BaseSettings` (*)
30. Explanation: `BaseSettings` reads env vars, validates types, and supports `.env` files via `python-dotenv`.
31. Q5: Why must Alembic see all models at import time?
32. A) Autogenerate compares Base.metadata to the DB; unimported models aren't in metadata (*)
33. B) For performance
34. C) To run migrations faster
35. D) It's required by Alembic
36. Explanation: Models register with `Base.metadata` at import time; if a model is never imported, its table is invisible to autogenerate.
37. Q6: Which is a typical project layout for a FastAPI service?
38. A) `app/{main.py}` only
39. B) `app/{main,api,services,repositories,schemas,models,core}` (*)
40. C) `app/{routes.py}` only
41. D) `app/{index.html}`
42. Explanation: The layered layout (`api/v1/`, `services/`, `repositories/`, `schemas/`, `models/`, `core/`) is the production convention.
43. Q7: Where do business rules (e.g., "email must be unique") belong?
44. A) In the route handler
45. B) In the database trigger
46. C) In the service layer (*)
47. D) In Pydantic
48. Explanation: Services enforce business rules; routes are HTTP adapters; repositories are data access; triggers create coupling and are hard to test.
49. Q8: How do you mount a router under `/api/v1`?
50. A) `router.prefix = "/api/v1"`
51. B) `app.mount("/api/v1", router)`
52. C) `@app.include("/api/v1")`
53. D) `app.include_router(router, prefix="/api/v1")` (*)
54. Explanation: `include_router` accepts `prefix` and `tags`; the router's own prefix (if any) is appended.
55. Q9: What does `pydantic-settings.BaseSettings` do that `os.getenv` doesn't?
56. A) Type validation and `.env` file support (*)
57. B) It's faster
58. C) It's part of stdlib
59. D) It caches the value
60. Explanation: `BaseSettings` validates types, casts strings, supports defaults and `.env` files, and gives you a typed `settings` object.
61. Q10: Why avoid reusing one schema for input and output?
62. A) Performance
63. B) It leaks fields (e.g., password hash) into responses and couples API shape to internal model (*)
64. C) Pydantic forbids it
65. D) It breaks /docs
66. Explanation: Separate Create/Update/Out schemas let you accept some fields and return others, preventing accidental data exposure.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which class modularizes a group of routes?
  options:
    - "`APIRouter`"
    - "`APIGroup`"
    - "`RouteGroup`"
    - "`Blueprint`"
  correctIndex: 0
  explanation: "`APIRouter` collects routes per feature; `app.include_router(router, prefix=..., tags=[...])` mounts it."
- id: q2
  question: Where should SQL queries live?
  options:
    - In route handlers
    - In a repository layer
    - In Pydantic models
    - In main.py
  correctIndex: 1
  explanation: Repositories own data access; routes call services, services call repositories — keeping SQL out of routes.
- id: q3
  question: Why split Pydantic schemas by use case?
  options:
    - For performance
    - Pydantic requires it
    - Different fields are accepted vs returned; reusing one model leaks sensitive fields
    - It's the only way to validate
  correctIndex: 2
  explanation: "`UserCreate` accepts a password; `UserOut` must not return it. Separate schemas enforce this at the type level."
- id: q4
  question: How do you load config from env?
  options:
    - "`os.getenv` everywhere"
    - Hard-code in settings.py
    - A custom YAML parser
    - "`pydantic-settings.BaseSettings`"
  correctIndex: 3
  explanation: "`BaseSettings` reads env vars, validates types, and supports `.env` files via `python-dotenv`."
- id: q5
  question: Why must Alembic see all models at import time?
  options:
    - Autogenerate compares Base.metadata to the DB; unimported models aren't in metadata
    - For performance
    - To run migrations faster
    - It's required by Alembic
  correctIndex: 0
  explanation: Models register with `Base.metadata` at import time; if a model is never imported, its table is invisible to autogenerate.
- id: q6
  question: Which is a typical project layout for a FastAPI service?
  options:
    - "`app/{main.py}` only"
    - "`app/{main,api,services,repositories,schemas,models,core}`"
    - "`app/{routes.py}` only"
    - "`app/{index.html}`"
  correctIndex: 1
  explanation: The layered layout (`api/v1/`, `services/`, `repositories/`, `schemas/`, `models/`, `core/`) is the production convention.
- id: q7
  question: Where do business rules (e.g., "email must be unique") belong?
  options:
    - In the route handler
    - In the database trigger
    - In the service layer
    - In Pydantic
  correctIndex: 2
  explanation: Services enforce business rules; routes are HTTP adapters; repositories are data access; triggers create coupling and are hard to test.
- id: q8
  question: How do you mount a router under `/api/v1`?
  options:
    - '`router.prefix = "/api/v1"`'
    - '`app.mount("/api/v1", router)`'
    - '`@app.include("/api/v1")`'
    - '`app.include_router(router, prefix="/api/v1")`'
  correctIndex: 3
  explanation: "`include_router` accepts `prefix` and `tags`; the router's own prefix (if any) is appended."
- id: q9
  question: What does `pydantic-settings.BaseSettings` do that `os.getenv` doesn't?
  options:
    - Type validation and `.env` file support
    - It's faster
    - It's part of stdlib
    - It caches the value
  correctIndex: 0
  explanation: "`BaseSettings` validates types, casts strings, supports defaults and `.env` files, and gives you a typed `settings` object."
- id: q10
  question: Why avoid reusing one schema for input and output?
  options:
    - Performance
    - It leaks fields (e.g., password hash) into responses and couples API shape to internal model
    - Pydantic forbids it
    - It breaks /docs
  correctIndex: 1
  explanation: Separate Create/Update/Out schemas let you accept some fields and return others, preventing accidental data exposure.
```

