---
slug: fastapi-database-integration-sqlalchemy-alembic
id: fastapi-08
track: fastapi
order: 8
title: Database Integration with SQLAlchemy and Alembic
description: Integrate SQLAlchemy 2.0 with FastAPI using sync and async sessions, model relationships, and Alembic migrations — and avoid the classic async-ORM-session pitfalls.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=2100s
whyItMatters: Integrate SQLAlchemy 2. 0 with FastAPI using sync and async sessions, model relationships, and Alembic migrations — and avoid the classic async-ORM-session pitfalls.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Database Integration with SQLAlchemy and Alembic

## Database Integration with SQLAlchemy and Alembic

### Why It Matters

Integrate SQLAlchemy 2. 0 with FastAPI using sync and async sessions, model relationships, and Alembic migrations — and avoid the classic async-ORM-session pitfalls.

Integrate SQLAlchemy 2.0 with FastAPI using sync and async sessions, model relationships, and Alembic migrations — and avoid the classic async-ORM-session pitfalls.

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 4: Pydantic Models and Validation
- Basic SQL and ORM familiarity.

### Topics

- SQLAlchemy 2.0 `DeclarativeBase` and `Mapped` / `mapped_column`
- Sync vs async engines (`create_engine` vs `create_async_engine`)
- `sessionmaker` and `async_sessionmaker` patterns
- Dependency-injected sessions with `yield` and `try/finally`
- Relationships: `relationship()`, `back_populates`, lazy vs eager loading
- `selectinload` / `joinedload` to avoid N+1
- Alembic setup: `alembic init`, `alembic revision --autogenerate`, `alembic upgrade head`
- Configuring Alembic to import your models and `target_metadata`

### Key Concepts

- Use `AsyncSession` with `create_async_engine` for async routes; sync `Session` with `create_engine` is fine for `def` handlers.
- The session lifecycle is one-per-request: open in the dependency, close in `finally`.
- Lazy-loaded relationships raise `MissingGreenlet` in async contexts; use `selectinload` to eager-load.
- Alembic's `autogenerate` compares model metadata to DB schema; it's a starting point, not a finish line — review the generated migration.
- `target_metadata = Base.metadata` in `env.py` is what tells Alembic about your models.

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship(back_populates="posts")
```
Caption: Models with SQLAlchemy 2.0

### Common Pitfalls

- Using a sync `Session` in an `async def` route — it blocks the event loop; either use `AsyncSession` or change the route to `def` so FastAPI runs it in a threadpool.
- Forgetting `expire_on_commit=False` on async sessions — accessing attributes after `commit` triggers a refresh that fails in async contexts.
- Lazy-loading relationships in an async route — raises `MissingGreenlet`; use `selectinload` or `joinedload` to fetch them eagerly.
- Running `alembic revision --autogenerate` and committing without review — autogenerate misses constraint renames and server-side defaults; always inspect the diff.
- Sharing a single `Session` across requests — sessions are not thread-safe and not request-scoped by default; always create one per request via the dependency.

### Real-World Applications

- Netflix's metadata services use SQLAlchemy (or equivalents) with carefully tuned connection pools; the async/await pattern with asyncpg is increasingly common for high-throughput services.
- Uber's engineering blog has described SQLAlchemy + Alembic patterns for migrating schemas across sharded Postgres clusters with zero downtime.
- Microsoft's Azure SDK samples include FastAPI + SQLAlchemy + asyncpg patterns for managed Postgres, with Alembic in the CI pipeline.
- OpenAI's data tooling uses SQLAlchemy to introspect schemas; their recipe-style tutorials mirror the patterns shown here.

### Interview Questions

- 1. Why use `AsyncSession` instead of `Session` in an `async def` route? — Sync `Session` calls block the event loop; `AsyncSession` with asyncpg/aiomysql keeps I/O non-blocking.
- 2. What does `expire_on_commit=False` do? — Prevents SQLAlchemy from invalidating attribute values after `commit`, which would trigger a lazy refresh that fails in async contexts.
- 3. How do you avoid N+1 queries when listing users with their posts? — Use `selectinload(User.posts)` (or `joinedload`) to fetch in one extra query instead of N.
- 4. What does Alembic's `autogenerate` do? — Compares `Base.metadata` to the live DB schema and emits a migration script; it's a starting point that needs human review.
- 5. Why must each request get its own session? — Sessions aren't thread-safe and hold state (identity map, pending changes); sharing them causes data corruption and concurrency bugs.

### Mini Project

Build a "Blog API" with SQLAlchemy 2.0: Models for `User` and `Post` with a one-to-many relationship; async session dependency; routes for `GET /users/{id}` (with posts eager-loaded), `POST /posts`, and `GET /posts`. Add Alembic and generate the first migration. Suggested approach:
  - Define `Base`, `User`, `Post` with `relationship` + `back_populates`
  - Create `get_db` async generator dependency
  - Use `selectinload(User.posts)` on the user detail route
  - Run `alembic init alembic`, set `target_metadata = Base.metadata` in env.py
  - `alembic revision --autogenerate -m "init"` then `alembic upgrade head`

### Exercises

1. Define two models with a FK and `back_populates`; confirm `user.posts` works after a `selectinload`.
2. Add `expire_on_commit=False` to your async session and confirm attributes are usable after `await db.commit()`.
3. Run `alembic revision --autogenerate` after adding a column and review the generated diff.
4. Cause an N+1 (list users, access `.posts` in a loop) and fix it with `selectinload`; verify query count drops.
5. >>> QUIZ (Stage 8) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which session type should you use in an `async def` route?
8. A) sqlalchemy.orm.Session
9. B) sqlite3.Connection
10. C) Any; it doesn't matter
11. D) sqlalchemy.ext.asyncio.AsyncSession (*)
12. Explanation: Sync `Session` blocks the event loop; `AsyncSession` with asyncpg/aiomysql keeps I/O non-blocking.
13. Q2: Why set `expire_on_commit=False` on async sessions?
14. A) To prevent attribute access from triggering a refresh that fails in async contexts (*)
15. B) To skip commit entirely
16. C) To disable transactions
17. D) To enable lazy loading
18. Explanation: After `commit`, expired attributes trigger a lazy refresh via SQL — which fails outside a greenlet in async code.
19. Q3: Which loading strategy fetches a relationship in one extra IN-clause query?
20. A) joinedload
21. B) selectinload (*)
22. C) lazyload
23. D) noload
24. Explanation: `selectinload` issues a second `SELECT ... WHERE id IN (...)` query — efficient for collections and avoids cartesian-product joins.
25. Q4: What does `alembic revision --autogenerate` compare?
26. A) Two git branches
27. B) The models against Pydantic schemas
28. C) `Base.metadata` against the live database schema (*)
29. D) The OpenAPI spec against the routes
30. Explanation: Alembic diffs the ORM metadata (from your models) against the actual DB schema and emits a migration script.
31. Q5: Where do you set `target_metadata` for Alembic?
32. A) In the migration file
33. B) In `pyproject.toml`
34. C) In `main.py`
35. D) In `alembic/env.py` (*)
36. Explanation: `env.py` runs Alembic's environment; you set `target_metadata = Base.metadata` so autogenerate knows your models.
37. Q6: Why should each request get its own session?
38. A) Sessions aren't thread-safe and hold an identity map; sharing causes corruption (*)
39. B) Sessions are stateless
40. C) Sessions cost money per use
41. D) It's a SQLAlchemy requirement
42. Explanation: Sessions track pending changes and identity maps; sharing them across requests mixes data and breaks transaction isolation.
43. Q7: Which SQLAlchemy 2.0 base class do you use?
44. A) `declarative_base()`
45. B) `DeclarativeBase` (subclassed) (*)
46. C) `BaseModel`
47. D) `Table`
48. Explanation: SQLAlchemy 2.0 favors `class Base(DeclarativeBase): pass`; the legacy `declarative_base()` still works but is the 1.x style.
49. Q8: Which driver URL is correct for async Postgres?
50. A) `postgresql://...`
51. B) `postgres+psycopg2://...`
52. C) `postgresql+asyncpg://...` (*)
53. D) `psql://...`
54. Explanation: `+asyncpg` selects the asyncpg driver used by `create_async_engine` and `AsyncSession`.
55. Q9: What happens if you lazy-load a relationship inside an async route?
56. A) It works fine
57. B) It silently returns None
58. C) It blocks the event loop forever
59. D) It raises `MissingGreenlet` (*)
60. Explanation: Async sessions can't issue lazy SQL on attribute access; you must eager-load via `selectinload`/`joinedload` or use `await db.refresh(obj, attribute_names=[...])`.
61. Q10: What's a safe way to apply Alembic migrations in production?
62. A) Review the generated migration, test on staging, run as a deploy step before new code serves traffic (*)
63. B) Run `upgrade head` automatically on app boot
64. C) Never run migrations in prod
65. D) Let Docker run `alembic upgrade head` on every container start
66. Explanation: Migrations should be reviewed, tested on staging, and run as a deliberate deploy step — not implicitly on boot — to avoid surprises.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which session type should you use in an `async def` route?
  options:
    - sqlalchemy.orm.Session
    - sqlite3.Connection
    - Any; it doesn't matter
    - sqlalchemy.ext.asyncio.AsyncSession
  correctIndex: 3
  explanation: Sync `Session` blocks the event loop; `AsyncSession` with asyncpg/aiomysql keeps I/O non-blocking.
- id: q2
  question: Why set `expire_on_commit=False` on async sessions?
  options:
    - To prevent attribute access from triggering a refresh that fails in async contexts
    - To skip commit entirely
    - To disable transactions
    - To enable lazy loading
  correctIndex: 0
  explanation: After `commit`, expired attributes trigger a lazy refresh via SQL — which fails outside a greenlet in async code.
- id: q3
  question: Which loading strategy fetches a relationship in one extra IN-clause query?
  options:
    - joinedload
    - selectinload
    - lazyload
    - noload
  correctIndex: 1
  explanation: "`selectinload` issues a second `SELECT ... WHERE id IN (...)` query — efficient for collections and avoids cartesian-product joins."
- id: q4
  question: What does `alembic revision --autogenerate` compare?
  options:
    - Two git branches
    - The models against Pydantic schemas
    - "`Base.metadata` against the live database schema"
    - The OpenAPI spec against the routes
  correctIndex: 2
  explanation: Alembic diffs the ORM metadata (from your models) against the actual DB schema and emits a migration script.
- id: q5
  question: Where do you set `target_metadata` for Alembic?
  options:
    - In the migration file
    - In `pyproject.toml`
    - In `main.py`
    - In `alembic/env.py`
  correctIndex: 3
  explanation: "`env.py` runs Alembic's environment; you set `target_metadata = Base.metadata` so autogenerate knows your models."
- id: q6
  question: Why should each request get its own session?
  options:
    - Sessions aren't thread-safe and hold an identity map; sharing causes corruption
    - Sessions are stateless
    - Sessions cost money per use
    - It's a SQLAlchemy requirement
  correctIndex: 0
  explanation: Sessions track pending changes and identity maps; sharing them across requests mixes data and breaks transaction isolation.
- id: q7
  question: Which SQLAlchemy 2.0 base class do you use?
  options:
    - "`declarative_base()`"
    - "`DeclarativeBase` (subclassed)"
    - "`BaseModel`"
    - "`Table`"
  correctIndex: 1
  explanation: "SQLAlchemy 2.0 favors `class Base(DeclarativeBase): pass`; the legacy `declarative_base()` still works but is the 1.x style."
- id: q8
  question: Which driver URL is correct for async Postgres?
  options:
    - "`postgresql://...`"
    - "`postgres+psycopg2://...`"
    - "`postgresql+asyncpg://...`"
    - "`psql://...`"
  correctIndex: 2
  explanation: "`+asyncpg` selects the asyncpg driver used by `create_async_engine` and `AsyncSession`."
- id: q9
  question: What happens if you lazy-load a relationship inside an async route?
  options:
    - It works fine
    - It silently returns None
    - It blocks the event loop forever
    - It raises `MissingGreenlet`
  correctIndex: 3
  explanation: Async sessions can't issue lazy SQL on attribute access; you must eager-load via `selectinload`/`joinedload` or use `await db.refresh(obj, attribute_names=[...])`.
- id: q10
  question: What's a safe way to apply Alembic migrations in production?
  options:
    - Review the generated migration, test on staging, run as a deploy step before new code serves traffic
    - Run `upgrade head` automatically on app boot
    - Never run migrations in prod
    - Let Docker run `alembic upgrade head` on every container start
  correctIndex: 0
  explanation: Migrations should be reviewed, tested on staging, and run as a deliberate deploy step — not implicitly on boot — to avoid surprises.
```

