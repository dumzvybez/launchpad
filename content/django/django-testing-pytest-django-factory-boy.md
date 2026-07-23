---
slug: django-testing-pytest-django-factory-boy
id: django-13
track: django
order: 13
title: Testing — pytest-django, factory_boy
description: Write tests with pytest-django and factory_boy, including fixtures, parametrization, model factories, API tests, and coverage. Learn Django's test client, LiveServerTestCase, and how to mock external services.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=600s
whyItMatters: Write tests with pytest-django and factory_boy, including fixtures, parametrization, model factories, API tests, and coverage. Learn Django's test client, LiveServerTestCase, and how to mock external services.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Testing — pytest-django, factory_boy

## Testing — pytest-django, factory_boy

### Why It Matters

Write tests with pytest-django and factory_boy, including fixtures, parametrization, model factories, API tests, and coverage. Learn Django's test client, LiveServerTestCase, and how to mock external services.

Write tests with pytest-django and factory_boy, including fixtures, parametrization, model factories, API tests, and coverage. Learn Django's test client, LiveServerTestCase, and how to mock external services.

### Prerequisites

- Stage 4 (Models), Stage 12 (DRF)
- Some exposure to pytest or unittest.

### Topics

- pytest-django setup and settings
- Fixtures: db, client, admin_client, rf (request factory)
- @pytest.mark.django_db and database access
- factory_boy model factories with Faker
- Subfactory, RelatedFactory, post_generation
- Test client GET/POST with reverse()
- APIClient for DRF tests (force_authenticate)
- Coverage: pytest-cov, branch coverage, .coveragerc
- Mocking external calls with responses or pytest-mock

### Key Concepts

- pytest-django's `db` fixture (or `@pytest.mark.django_db`) grants DB access; without it, ORM calls raise.
- Factories beat hand-built objects — faster, less duplication, clear intent.
- `force_authenticate(user)` skips the JWT/session dance in API tests.
- Use reverse() in tests, not hard-coded URLs — refactors stay safe.
- Coverage isn't quality, but 80%+ is a sane floor for catching dead code.

```python
# conftest.py
import pytest
from rest_framework.test import APIClient
from accounts.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(username="ada", email="ada@x.com", password="pw12345")

@pytest.fixture
def authed_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

# settings.py — pytest-django config
# [tool.pytest.ini_options]
# DJANGO_SETTINGS_MODULE = "mysite.settings"
# python_files = ["tests.py", "test_*.py", "*_tests.py"]
```
Caption: Conftest + fixtures

### Common Pitfalls

- Forgetting `@pytest.mark.django_db` — every test that touches the ORM needs it; otherwise pytest-django raises SynchronousOnlyOperation or RuntimeOperation.
- Tests sharing state via class attributes — fixtures must be function-scoped (default); module-scoped DB fixtures cause cascading test failures.
- Using `setUp` to build objects without factories — slow and brittle; use FactoryBoy.
- Not calling `transaction.on_commit` callbacks in tests — wrap test body in `transaction.atomic()` and call `connection.run_and_clear_commit_hooks()` or use pytest-django-pg's `django_db(transaction=True)`.
- Mocking too much — over-mocking makes tests pass while the real integration breaks; reserve mocks for external services and slow calls, not your own code.

### Real-World Applications

- Mozilla runs ~50k Django tests per CI run across SUMO, MDN, and addons-server using pytest-django + factory_boy.
- Disqus uses factory_boy for comment/thread/user factories and runs ~30k tests per merge.
- Eventbrite's Django monolith has 100k+ pytest tests; they use parallel pytest-xdist to keep CI under 20 min.
- Instagram's Django services (legacy) used pytest-django + custom factories before the move to a service mesh.

### Interview Questions

- 1. Why use pytest-django over Django's built-in TestCase? — pytest fixtures are composable; parametrize is cleaner; better assertion introspection; factory_boy integration is cleaner.
- 2. What does @pytest.mark.django_db do? — Wraps the test in a transaction-savepoint so ORM access works; without it, pytest-django blocks DB calls.
- 3. Why use factory_boy instead of setUp? — Factories are reusable across tests, generate realistic random data, and reduce duplication; setUp tends to grow into a mess.
- 4. How does force_authenticate differ from real login in tests? — It bypasses auth backends and sets request.user directly; faster, no password hashing, no session.
- 5. How do you test code inside transaction.on_commit()? — Use `pytest.mark.django_db(transaction=True)` and call the callback directly, or use `django.test.utils.captureOnCommitCallbacks`.

### Mini Project

Build a Test Suite for the Blog API: Cover the post list (pagination, status filter), create (auth + validation), and the comment-create endpoint. Use factory_boy, parametrize, and an `authed_client` fixture. Aim for 85% coverage on blog/. Suggested approach:
  - conftest.py: api_client, user, authed_client fixtures
  - factories.py: UserFactory, PostFactory, CommentFactory
  - test_post_api.py: list pagination, status filter, create auth, title validation
  - test_comment_api.py: create requires auth, body required, post FK enforced
  - Run `pytest --cov=blog --cov-report=term-missing` and fix gaps

### Exercises

1. Install pytest-django + factory_boy; add DJANGO_SETTINGS_MODULE to pyproject.toml.
2. Write a UserFactory and PostFactory; verify with a quick test.
3. Use @pytest.mark.parametrize to test slug validation across 4 inputs.
4. Test that an anonymous POST to /api/posts/ returns 401 or 403.
5. Generate a coverage report with pytest-cov and aim for 80%+.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which marker is required to access the ORM in pytest-django?
9. A) @pytest.mark.django_db (*)
10. B) @pytest.mark.database
11. C) @pytest.mark.orm
12. D) @pytest.mark.models
13. Explanation: Without @pytest.mark.django_db (or the db fixture), ORM calls raise. The marker wraps the test in a savepoint.
14. Q2: Which factory_boy class is used for Django models?
15. A) ModelFactory
16. B) DjangoModelFactory (*)
17. C) FactoryModel
18. D) DjangoFactory
19. Explanation: factory.django.DjangoModelFactory knows how to call Model.objects.create and handle SubFactory.
20. Q3: How does APIClient.force_authenticate work?
21. A) It logs in via the auth backend
22. B) It generates a JWT
23. C) It sets request.user directly, bypassing auth backends (*)
24. D) It creates a session
25. Explanation: force_authenticate(user=...) skips the auth middleware/backend entirely. Faster than login(); no password hashing.
26. Q4: Which fixture provides a Django test client?
27. A) request
28. B) http_client
29. C) test_client
30. D) client (*)
31. Explanation: pytest-django provides `client` (Django Client) and `api_client` is custom for DRF (APIClient). Both function-scoped by default.
32. Q5: What does @factory.post_generation enable?
33. A) Defines a hook that runs after creation — perfect for M2M relations (*)
34. B) Generates fields after the instance is created
35. C) Replaces SubFactory
36. D) Marks the factory as deprecated
37. Explanation: post_generation methods take (create, extracted, **kwargs). For M2M, if extracted is a list, add each. Skipped when build_strategy is "build" without create.
38. Q6: How do you run a pytest with coverage?
39. A) pytest --coverage
40. B) pytest --cov=myapp --cov-report=term-missing (*)
41. C) pytest --cover
42. D) pytest run --cov
43. Explanation: pytest-cov adds --cov. Specify the package to measure. --cov-report=term-missing shows uncovered lines.
44. Q7: Which fixture scope should the DB user fixture use?
45. A) session
46. B) module
47. C) function (default) (*)
48. D) class
49. Explanation: Function scope isolates tests — each test gets a fresh user. Module/session scope risks data leaking between tests.
50. Q8: What's the recommended way to test code inside transaction.on_commit()?
51. A) Use @pytest.mark.asyncio
52. B) Skip those tests
53. C) Mock transaction.on_commit
54. D) Use captureOnCommitCallbacks or pytest-django-pg (transaction=True) (*)
55. Explanation: on_commit callbacks don't fire in a savepoint test. Use django.test.utils.captureOnCommitCallbacks or run the test with transaction=True.
56. Q9: Why use reverse() in tests instead of hard-coded URLs?
57. A) URL refactors don't break tests; tests stay decoupled from URL strings (*)
58. B) It's faster
59. C) reverse() is required by DRF
60. D) It triggers middleware
61. Explanation: reverse("post-list") resolves to the URL at test time. If you change URLs, the test still works.
62. Q10: What's a good branch coverage floor for a Django project?
63. A) 20%
64. B) 80% (*)
65. C) 50%
66. D) 100%
67. Explanation: 80% is a common floor. 100% is rarely worth the cost. Track coverage in CI to prevent regressions.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which marker is required to access the ORM in pytest-django?
  options:
    - "@pytest.mark.django_db"
    - "@pytest.mark.database"
    - "@pytest.mark.orm"
    - "@pytest.mark.models"
  correctIndex: 0
  explanation: Without @pytest.mark.django_db (or the db fixture), ORM calls raise. The marker wraps the test in a savepoint.
- id: q2
  question: Which factory_boy class is used for Django models?
  options:
    - ModelFactory
    - DjangoModelFactory
    - FactoryModel
    - DjangoFactory
  correctIndex: 1
  explanation: factory.django.DjangoModelFactory knows how to call Model.objects.create and handle SubFactory.
- id: q3
  question: How does APIClient.force_authenticate work?
  options:
    - It logs in via the auth backend
    - It generates a JWT
    - It sets request.user directly, bypassing auth backends
    - It creates a session
  correctIndex: 2
  explanation: force_authenticate(user=...) skips the auth middleware/backend entirely. Faster than login(); no password hashing.
- id: q4
  question: Which fixture provides a Django test client?
  options:
    - request
    - http_client
    - test_client
    - client
  correctIndex: 3
  explanation: pytest-django provides `client` (Django Client) and `api_client` is custom for DRF (APIClient). Both function-scoped by default.
- id: q5
  question: What does @factory.post_generation enable?
  options:
    - Defines a hook that runs after creation — perfect for M2M relations
    - Generates fields after the instance is created
    - Replaces SubFactory
    - Marks the factory as deprecated
  correctIndex: 0
  explanation: post_generation methods take (create, extracted, **kwargs). For M2M, if extracted is a list, add each. Skipped when build_strategy is "build" without create.
- id: q6
  question: How do you run a pytest with coverage?
  options:
    - pytest --coverage
    - pytest --cov=myapp --cov-report=term-missing
    - pytest --cover
    - pytest run --cov
  correctIndex: 1
  explanation: pytest-cov adds --cov. Specify the package to measure. --cov-report=term-missing shows uncovered lines.
- id: q7
  question: Which fixture scope should the DB user fixture use?
  options:
    - session
    - module
    - function (default)
    - class
  correctIndex: 2
  explanation: Function scope isolates tests — each test gets a fresh user. Module/session scope risks data leaking between tests.
- id: q8
  question: What's the recommended way to test code inside transaction.on_commit()?
  options:
    - Use @pytest.mark.asyncio
    - Skip those tests
    - Mock transaction.on_commit
    - Use captureOnCommitCallbacks or pytest-django-pg (transaction=True)
  correctIndex: 3
  explanation: on_commit callbacks don't fire in a savepoint test. Use django.test.utils.captureOnCommitCallbacks or run the test with transaction=True.
- id: q9
  question: Why use reverse() in tests instead of hard-coded URLs?
  options:
    - URL refactors don't break tests; tests stay decoupled from URL strings
    - It's faster
    - reverse() is required by DRF
    - It triggers middleware
  correctIndex: 0
  explanation: reverse("post-list") resolves to the URL at test time. If you change URLs, the test still works.
- id: q10
  question: What's a good branch coverage floor for a Django project?
  options:
    - 20%
    - 80%
    - 50%
    - 100%
  correctIndex: 1
  explanation: 80% is a common floor. 100% is rarely worth the cost. Track coverage in CI to prevent regressions.
```

