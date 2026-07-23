---
slug: fastapi-pydantic-models-validation
id: fastapi-04
track: fastapi
order: 4
title: Pydantic Models and Validation
description: Build robust Pydantic v2 models for request and response bodies, apply Field constraints, write field- and model-level validators, and use `model_config` for ORM mode and extra-field handling.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=900s
whyItMatters: Build robust Pydantic v2 models for request and response bodies, apply Field constraints, write field- and model-level validators, and use `model_config` for ORM mode and extra-field handling.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Pydantic Models and Validation

## Pydantic Models and Validation

### Why It Matters

Build robust Pydantic v2 models for request and response bodies, apply Field constraints, write field- and model-level validators, and use `model_config` for ORM mode and extra-field handling.

Build robust Pydantic v2 models for request and response bodies, apply Field constraints, write field- and model-level validators, and use `model_config` for ORM mode and extra-field handling.

### Prerequisites

- Stage 1: Getting Started with FastAPI
- Stage 3: Query Parameters and Request Bodies
- Basic Python dataclass knowledge is helpful.

### Topics

- Pydantic v2 `BaseModel` and `model_dump()` / `model_validate()`
- `Field(default=..., max_length=, ge=, le=, pattern=, description=)`
- Field validators with `@field_validator` (replaces v1 `@validator`)
- Model validators with `@model_validator(mode="after")`
- `model_config = ConfigDict(from_attributes=True)` (formerly `orm_mode`)
- `extra="forbid"`, `extra="ignore"` for unknown fields
- Nested models, `list[Model]`, and forward references
- Custom types via `Annotated[T, AfterValidator(...)]`

### Key Concepts

- Pydantic v2 is a Rust core with a Python API; `@validator` is deprecated, use `@field_validator`.
- `model_dump()` replaces `.dict()`; `model_validate()` replaces `.parse_obj()`.
- `from_attributes=True` (formerly `orm_mode=True`) lets Pydantic read attrs from SQLAlchemy ORM objects.
- `extra="forbid"` returns 422 on unknown fields — critical for strict APIs that must reject typos.
- Validators run on every parse path (request body, internal calls); they're not just for HTTP.

```python
from pydantic import BaseModel, Field, ConfigDict

class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    age: int = Field(ge=13, le=130)
    bio: str | None = Field(default=None, max_length=500)
```
Caption: Field constraints and config

### Common Pitfalls

- Using Pydantic v1 syntax in v2 — `.dict()`, `.parse_obj()`, `@validator`, `orm_mode=True` are deprecated or removed; migrate to `.model_dump()`, `.model_validate()`, `@field_validator`, `from_attributes=True`.
- Forgetting `@classmethod` on `@field_validator` — Pydantic v2 requires it; omitting it raises a TypeError at class definition.
- Raising `ValueError` from a validator with a multi-line message — FastAPI joins messages with `;`, which can produce confusing error bodies; prefer single-line messages or raise `PydanticCustomError`.
- Setting `extra="forbid"` on response models — this rejects fields FastAPI adds automatically (like `id`); use `extra="forbid"` for inputs and `extra="ignore"` for outputs.
- Mutating `self` in a `mode="after"` model validator — return `self`; mutations can break equality and caching in subtle ways.

### Real-World Applications

- Stripe's API uses strict request schemas that reject unknown fields — equivalent to Pydantic's `extra="forbid"` — to catch client bugs early.
- Uber's API contracts rely on cross-field validators (e.g., `dropoff_at > pickup_at`) just like Pydantic's `@model_validator(mode="after")`.
- Microsoft's Azure REST API specs validate integer ranges (e.g., `pageSize` between 1 and 1000) the same way Pydantic's `Field(ge=1, le=1000)` does.
- OpenAI's API schemas use nested Pydantic-like models for tool calls and structured outputs, with strict extra-field rejection for backward compatibility.

### Interview Questions

- 1. What changed between Pydantic v1 and v2? — v2 has a Rust core, `@field_validator` replaces `@validator`, `model_dump()` replaces `dict()`, and `from_attributes` replaces `orm_mode`.
- 2. What does `from_attributes=True` do? — Allows Pydantic to construct a model from any object with matching attributes (e.g., a SQLAlchemy ORM row), enabling `response_model` to serialize ORM objects directly.
- 3. When would you use `extra="forbid"`? — For request bodies where unknown fields indicate client bugs; it returns 422 on unknown keys, preventing silent data loss.
- 4. What's the difference between `mode="before"` and `mode="after"` validators? — `before` runs before Pydantic's coercion (receives raw input); `after` runs after the field is coerced to its declared type.
- 5. How do you validate a value that depends on two fields? — Use `@model_validator(mode="after")` to access `self.field_a` and `self.field_b` together and raise `ValueError` on inconsistency.

### Mini Project

Build a "Booking Validator" Service: A POST `/bookings` endpoint that accepts a Pydantic `Booking` model with `start`, `end`, `guests` (1-10), `room_type` (enum), and `extras` (list of strings). The model must reject unknown fields, validate that `end > start` and `guests` matches the room capacity. Returns the validated booking with a computed `nights` field. Suggested approach:
  - Define `class RoomType(str, Enum)` with values
  - Add `model_config = ConfigDict(extra="forbid")`
  - Use `@model_validator(mode="after")` to check `end > start` and `guests <= capacity(room_type)`
  - Add a `nights: int` computed field via `@computed_field`
  - Return `booking.model_dump()` from the route

### Exercises

1. Create a `UserCreate` model with `extra="forbid"` and confirm sending an unknown field returns 422.
2. Write a `@field_validator` for `password` enforcing uppercase + digit + 8+ chars.
3. Add a `@model_validator(mode="after")` to a `Booking` model checking `end > start`.
4. Configure `from_attributes=True` and convert a fake ORM object (a `types.SimpleNamespace`) to the model via `Model.model_validate(obj)`.
5. >>> QUIZ (Stage 4) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which method serializes a Pydantic v2 model to a dict?
8. A) `.dict()`
9. B) `.to_dict()`
10. C) `.asdict()`
11. D) `.model_dump()` (*)
12. Explanation: Pydantic v2 renamed `.dict()` to `.model_dump()`; `.dict()` is deprecated and emits a warning.
13. Q2: Which decorator replaces Pydantic v1's `@validator`?
14. A) `@field_validator` (*)
15. B) `@validate`
16. C) `@pydantic_validator`
17. D) `@validate_field`
18. Explanation: Pydantic v2 introduced `@field_validator` (per-field) and `@model_validator` (cross-field), deprecating `@validator`.
19. Q3: What does `from_attributes=True` enable?
20. A) Auto-generated docs
21. B) Constructing a model from any object with matching attributes (ORM mode) (*)
22. C) Field-level defaults
23. D) Strict integer parsing
24. Explanation: It allows `Model.model_validate(orm_obj)` to read attributes off any object, not just dicts — essential for SQLAlchemy ORM rows.
25. Q4: What does `extra="forbid"` do on a Pydantic model?
26. A) Forbids private attributes
27. B) Forbids computed fields
28. C) Forbids all extra fields, returning 422 on unknown keys (*)
29. D) Forbids inheritance
30. Explanation: With `extra="forbid"` (set via `ConfigDict`), unknown fields in the incoming JSON raise a validation error.
31. Q5: Which mode runs a validator before Pydantic's type coercion?
32. A) `mode="after"`
33. B) `mode="raw"`
34. C) `mode="strict"`
35. D) `mode="before"` (*)
36. Explanation: `mode="before"` receives the raw input (often a string or dict); `mode="after"` receives the coerced value.
37. Q6: How do you validate a value that depends on multiple fields?
38. A) Use `@model_validator(mode="after")` (*)
39. B) Use two `@field_validator`s
40. C) Use a custom `__init__`
41. D) Use `Field(validator=...)`
42. Explanation: `@model_validator(mode="after")` has access to the fully-constructed `self` and can compare fields.
43. Q7: Which is required on `@field_validator` in Pydantic v2?
44. A) `@staticmethod`
45. B) `@classmethod` (*)
46. C) `@property`
47. D) `@async`
48. Explanation: Pydantic v2 requires `@classmethod` on field validators; omitting it raises a TypeError.
49. Q8: What replaces Pydantic v1's `.parse_obj()`?
50. A) `.parse()`
51. B) `.from_obj()`
52. C) `.model_validate()` (*)
53. D) `.validate()`
54. Explanation: v2 renamed `parse_obj` → `model_validate`, `parse_raw` → `model_validate_json`.
55. Q9: How do you add a description that shows in /docs?
56. A) `# description: ...` comment
57. B) Pass it to the route decorator
58. C) Add a `__doc__` attribute on the field
59. D) `Field(description="...")` or docstrings on the model (*)
60. Explanation: `Field(description=...)` and the model's docstring both flow into the OpenAPI schema.
61. Q10: Which config setting controls Pydantic v2 model behavior?
62. A) `model_config = ConfigDict(...)` (*)
63. B) `class Config:` inner class (v1 style)
64. C) `__pydantic_config__ = {...}`
65. D) `Meta.config = {...}`
66. Explanation: v2 uses `model_config = ConfigDict(...)` as a class attribute; the inner `class Config` from v1 still works but is deprecated.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method serializes a Pydantic v2 model to a dict?
  options:
    - "`.dict()`"
    - "`.to_dict()`"
    - "`.asdict()`"
    - "`.model_dump()`"
  correctIndex: 3
  explanation: Pydantic v2 renamed `.dict()` to `.model_dump()`; `.dict()` is deprecated and emits a warning.
- id: q2
  question: Which decorator replaces Pydantic v1's `@validator`?
  options:
    - "`@field_validator`"
    - "`@validate`"
    - "`@pydantic_validator`"
    - "`@validate_field`"
  correctIndex: 0
  explanation: Pydantic v2 introduced `@field_validator` (per-field) and `@model_validator` (cross-field), deprecating `@validator`.
- id: q3
  question: What does `from_attributes=True` enable?
  options:
    - Auto-generated docs
    - Constructing a model from any object with matching attributes (ORM mode)
    - Field-level defaults
    - Strict integer parsing
  correctIndex: 1
  explanation: It allows `Model.model_validate(orm_obj)` to read attributes off any object, not just dicts — essential for SQLAlchemy ORM rows.
- id: q4
  question: What does `extra="forbid"` do on a Pydantic model?
  options:
    - Forbids private attributes
    - Forbids computed fields
    - Forbids all extra fields, returning 422 on unknown keys
    - Forbids inheritance
  correctIndex: 2
  explanation: With `extra="forbid"` (set via `ConfigDict`), unknown fields in the incoming JSON raise a validation error.
- id: q5
  question: Which mode runs a validator before Pydantic's type coercion?
  options:
    - '`mode="after"`'
    - '`mode="raw"`'
    - '`mode="strict"`'
    - '`mode="before"`'
  correctIndex: 3
  explanation: '`mode="before"` receives the raw input (often a string or dict); `mode="after"` receives the coerced value.'
- id: q6
  question: How do you validate a value that depends on multiple fields?
  options:
    - Use `@model_validator(mode="after")`
    - Use two `@field_validator`s
    - Use a custom `__init__`
    - Use `Field(validator=...)`
  correctIndex: 0
  explanation: '`@model_validator(mode="after")` has access to the fully-constructed `self` and can compare fields.'
- id: q7
  question: Which is required on `@field_validator` in Pydantic v2?
  options:
    - "`@staticmethod`"
    - "`@classmethod`"
    - "`@property`"
    - "`@async`"
  correctIndex: 1
  explanation: Pydantic v2 requires `@classmethod` on field validators; omitting it raises a TypeError.
- id: q8
  question: What replaces Pydantic v1's `.parse_obj()`?
  options:
    - "`.parse()`"
    - "`.from_obj()`"
    - "`.model_validate()`"
    - "`.validate()`"
  correctIndex: 2
  explanation: v2 renamed `parse_obj` → `model_validate`, `parse_raw` → `model_validate_json`.
- id: q9
  question: How do you add a description that shows in /docs?
  options:
    - "`# description: ...` comment"
    - Pass it to the route decorator
    - Add a `__doc__` attribute on the field
    - '`Field(description="...")` or docstrings on the model'
  correctIndex: 3
  explanation: "`Field(description=...)` and the model's docstring both flow into the OpenAPI schema."
- id: q10
  question: Which config setting controls Pydantic v2 model behavior?
  options:
    - "`model_config = ConfigDict(...)`"
    - "`class Config:` inner class (v1 style)"
    - "`__pydantic_config__ = {...}`"
    - "`Meta.config = {...}`"
  correctIndex: 0
  explanation: v2 uses `model_config = ConfigDict(...)` as a class attribute; the inner `class Config` from v1 still works but is deprecated.
```

