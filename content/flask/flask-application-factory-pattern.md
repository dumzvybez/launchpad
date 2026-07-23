---
slug: flask-application-factory-pattern
id: flask-08
track: flask
order: 8
title: Application Factory Pattern
description: Wrap app creation in a create_app() function so you can have multiple configs (dev/test/prod), deferred extension initialization, and clean test isolation.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=300s
whyItMatters: Wrap app creation in a create_app() function so you can have multiple configs (dev/test/prod), deferred extension initialization, and clean test isolation.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Application Factory Pattern

## Application Factory Pattern

### Why It Matters

Wrap app creation in a create_app() function so you can have multiple configs (dev/test/prod), deferred extension initialization, and clean test isolation.

Wrap app creation in a create_app() function so you can have multiple configs (dev/test/prod), deferred extension initialization, and clean test isolation.

### Prerequisites

- Stage 7: Blueprints and Application Structure
- Stage 5 understanding of app/request context proxies.

### Topics

- The problem with module-level app = Flask(__name__)
- create_app(config_name='dev') function shape
- Deferred extension init: db.init_app(app), login_manager.init_app(app)
- Extensions module pattern: app/extensions.py holding db, login_manager, migrate
- Loading config inside create_app: from_object, from_envvar, from_file
- Registering blueprints inside create_app
- Why tests need the factory: fresh app per test, no global state
- Circular imports solved by deferring all app access to runtime

### Key Concepts

- Module-level app instances are global singletons — they break tests (state leaks across test cases) and prevent multiple configs in one process.
- create_app() is the canonical Flask pattern: a function that builds, configures, and returns an app, called once per process or once per test.
- Extensions are instantiated at module level (db = SQLAlchemy()) but initialized inside create_app() via init_app(app) — this defers app binding until an app exists.
- current_app, g, request, and session are proxies; inside create_app() before any request, push an app context with app.app_context() to access current_app.
- Test configuration is just another config object passed to create_app('testing') — no env-var gymnastics needed.

```python
# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

# app/__init__.py
from flask import Flask
from app.extensions import db, login_manager, migrate

def create_app(config_name="dev"):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(f"app.config.{config_name.capitalize()}Config")
    # Initialize extensions on THIS app:
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    from app.blog import bp as blog_bp
    from app.auth import bp as auth_bp
    app.register_blueprint(blog_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    return app
```
Caption: The factory + extensions module

### Common Pitfalls

- Defining db = SQLAlchemy(app) at module level with the app object — This ties the extension to one app instance and breaks the factory pattern; instantiate db = SQLAlchemy() at module level and call db.init_app(app) inside create_app().
- Pushing a request context when you only need app context — current_app and g live in the app context; request and session live in the request context. Use with app.app_context(): for config/DB access outside a request.
- Forgetting to import models before migrate.init_app — Alembic's autogenerate only sees models that have been imported; create_app() must import every models.py before migrate.init_app(app, db) so the metadata is populated.
- Reading app.config at import time (before create_app runs) — Module-level code runs at first import; if it reads app.config you'll get an error. Defer all config reads to inside create_app or to request-time via current_app.config.
- Sharing one create_app() call across test cases — Tests must call create_app('testing') in a fixture so each test gets a fresh app and DB; sharing a global app leaks state (logged-in users, DB rows) across tests.

### Real-World Applications

- Pinterest's internal Flask services use the factory pattern so each service can boot with dev/test/canary configs from the same codebase.
- Lyft's admin Flask apps use create_app() to run multiple apps in one process during migration windows (old + new version side-by-side).
- Netflix's security-automation Flask tools use the factory pattern to enable pytest fixtures with isolated in-memory SQLite per test.
- Patreon's Flask services use create_app() so they can mount the same blueprints under both /api (public) and /internal-api (within the VPC) for ops tooling.

### Interview Questions

- 1. Why is module-level app = Flask(__name__) an anti-pattern? — It's a global singleton; tests share state, you can't have multiple configs in one process, and extensions get bound to that one app at import time.
- 2. How does db.init_app(app) differ from db = SQLAlchemy(app)? — init_app() defers binding to a specific app; SQLAlchemy(app) binds immediately. The factory pattern needs init_app() so the extension is created before any app exists.
- 3. When would you push app.app_context() inside create_app()? — When you need to access current_app or run DB operations (db.create_all()) outside a request — e.g., during app bootstrapping.
- 4. Why must tests use create_app() per fixture? — So each test gets a fresh app + DB; sharing one app leaks state (logged-in users, DB rows) and makes tests order-dependent.
- 5. What's the role of an extensions.py module? — It instantiates extensions (db, login_manager, migrate) at module level so any blueprint or model can import them without circular imports; init_app() binds them to a specific app inside create_app().

### Mini Project

Convert a flat app.py to the factory pattern: refactor so create_app()
returns a configured Flask app, with extensions in app/extensions.py
and a wsgi.py entry point. Suggested approach:
  - Move db, login_manager, migrate to app/extensions.py (no app arg)
  - Write create_app(config_name) that init_app()s each extension
  - Add BaseConfig, DevConfig, ProdConfig, TestConfig classes
  - Create wsgi.py exposing application = create_app(os.environ['FLASK_CONFIG'])
  - Write a pytest fixture that calls create_app('testing') per test

### Exercises

1. Move `app = Flask(__name__)` into a create_app() function and update .flaskenv with FLASK_APP=app:create_app.
2. Refactor `db = SQLAlchemy(app)` into `db = SQLAlchemy()` + `db.init_app(app)` inside create_app.
3. Push app.app_context() inside create_app() to print config values at boot.
4. Write a wsgi.py with `application = create_app('prod')` and run gunicorn against it.
5. Add a test fixture `app` that calls create_app('testing') and yields it.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why is module-level `app = Flask(__name__)` an anti-pattern?
9. A) It's deprecated
10. B) It's slower than create_app()
11. C) It doesn't support Jinja
12. D) It's a global singleton; tests share state and only one config is possible (*)
13. Explanation: A module-level app is a singleton; tests leak state, you can't have dev/test/prod configs in one process, and extensions bind at import time.
14. Q2: Which pattern defers extension binding to a specific app?
15. A) db = SQLAlchemy(); db.init_app(app) inside create_app() (*)
16. B) db = SQLAlchemy(app)
17. C) db.bind(app)
18. D) app.use(db)
19. Explanation: Instantiate the extension at module level (no app), then bind it to the app inside create_app() with init_app(app).
20. Q3: When do you need to push app.app_context()?
21. A) Inside every view
22. B) Outside a request, when you need current_app or DB access (*)
23. C) Never; Flask pushes it automatically
24. D) Only in tests
25. Explanation: current_app and g live in the app context. Outside a request (e.g. in create_app or a script), use with app.app_context(): to access them.
26. Q4: What's the WSGI entry point for a factory-based app?
27. A) application = Flask(__name__)
28. B) app = create_app
29. C) application = create_app('prod') (*)
30. D) wsgi = create_app()
31. Explanation: wsgi.py exposes `application = create_app(config)`; gunicorn invokes it as `gunicorn wsgi:application`.
32. Q5: Why must models be imported before migrate.init_app(app, db)?
33. A) Alembic needs the app first
34. B) Migrations are written to models.py
35. C) Flask sorts imports alphabetically
36. D) Autogenerate only sees models whose modules have been imported (*)
37. Explanation: Alembic compares the DB schema to SQLAlchemy's metadata; models register themselves on the metadata at import time, so all models.py must be imported before autogenerate runs.
38. Q6: Which fixture pattern gives each pytest a fresh app?
39. A) @pytest.fixture() def app(): return create_app('testing') (*)
40. B) @pytest.fixture(scope='session') def app(): return create_app()
41. C) app = create_app() at module top
42. D) pytest uses the global app automatically
43. Explanation: Function-scoped fixture calling create_app('testing') gives each test its own app + DB, preventing state leaks.
44. Q7: Where should extensions like db and login_manager live?
45. A) Inside create_app()
46. B) In an app/extensions.py module at module level (*)
47. C) In app/__init__.py inside create_app()
48. D) In settings.py
49. Explanation: extensions.py holds `db = SQLAlchemy()` etc. so any blueprint/model can import without circular imports; create_app() then calls init_app(app).
50. Q8: What does .flaskenv look like for a factory app?
51. A) FLASK_APP=app.py
52. B) FLASK_APP=create_app
53. C) FLASK_APP=app:create_app (*)
54. D) FLASK_FACTORY=app:create_app
55. Explanation: FLASK_APP=app:create_app tells the Flask CLI to call create_app() (optionally --factory flag pre-2.2; factory auto-detected since 2.2).
56. Q9: Why avoid reading app.config at module import time?
57. A) Config isn't loaded yet
58. B) Config is encrypted
59. C) It triggers a circular import
60. D) Module-level code runs before create_app(); current_app is unbound (*)
61. Explanation: Module-level code runs at first import — before any app exists. Defer config reads to inside create_app() or to request time via current_app.config.
62. Q10: Which pattern supports running old + new app versions in one process?
63. A) Two create_app() calls with different configs (*)
64. B) Module-level app
65. C) Two blueprints
66. D) Two .flaskenv files
67. Explanation: Because create_app() returns a fresh app per call, you can build app_v1 = create_app('v1') and app_v2 = create_app('v2') and dispatch between them at the WSGI layer during migrations.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why is module-level `app = Flask(__name__)` an anti-pattern?
  options:
    - It's deprecated
    - It's slower than create_app()
    - It doesn't support Jinja
    - It's a global singleton; tests share state and only one config is possible
  correctIndex: 3
  explanation: A module-level app is a singleton; tests leak state, you can't have dev/test/prod configs in one process, and extensions bind at import time.
- id: q2
  question: Which pattern defers extension binding to a specific app?
  options:
    - db = SQLAlchemy(); db.init_app(app) inside create_app()
    - db = SQLAlchemy(app)
    - db.bind(app)
    - app.use(db)
  correctIndex: 0
  explanation: Instantiate the extension at module level (no app), then bind it to the app inside create_app() with init_app(app).
- id: q3
  question: When do you need to push app.app_context()?
  options:
    - Inside every view
    - Outside a request, when you need current_app or DB access
    - Never; Flask pushes it automatically
    - Only in tests
  correctIndex: 1
  explanation: "current_app and g live in the app context. Outside a request (e.g. in create_app or a script), use with app.app_context(): to access them."
- id: q4
  question: What's the WSGI entry point for a factory-based app?
  options:
    - application = Flask(__name__)
    - app = create_app
    - application = create_app('prod')
    - wsgi = create_app()
  correctIndex: 2
  explanation: wsgi.py exposes `application = create_app(config)`; gunicorn invokes it as `gunicorn wsgi:application`.
- id: q5
  question: Why must models be imported before migrate.init_app(app, db)?
  options:
    - Alembic needs the app first
    - Migrations are written to models.py
    - Flask sorts imports alphabetically
    - Autogenerate only sees models whose modules have been imported
  correctIndex: 3
  explanation: Alembic compares the DB schema to SQLAlchemy's metadata; models register themselves on the metadata at import time, so all models.py must be imported before autogenerate runs.
- id: q6
  question: Which fixture pattern gives each pytest a fresh app?
  options:
    - "@pytest.fixture() def app(): return create_app('testing')"
    - "@pytest.fixture(scope='session') def app(): return create_app()"
    - app = create_app() at module top
    - pytest uses the global app automatically
  correctIndex: 0
  explanation: Function-scoped fixture calling create_app('testing') gives each test its own app + DB, preventing state leaks.
- id: q7
  question: Where should extensions like db and login_manager live?
  options:
    - Inside create_app()
    - In an app/extensions.py module at module level
    - In app/__init__.py inside create_app()
    - In settings.py
  correctIndex: 1
  explanation: extensions.py holds `db = SQLAlchemy()` etc. so any blueprint/model can import without circular imports; create_app() then calls init_app(app).
- id: q8
  question: What does .flaskenv look like for a factory app?
  options:
    - FLASK_APP=app.py
    - FLASK_APP=create_app
    - FLASK_APP=app:create_app
    - FLASK_FACTORY=app:create_app
  correctIndex: 2
  explanation: FLASK_APP=app:create_app tells the Flask CLI to call create_app() (optionally --factory flag pre-2.2; factory auto-detected since 2.2).
- id: q9
  question: Why avoid reading app.config at module import time?
  options:
    - Config isn't loaded yet
    - Config is encrypted
    - It triggers a circular import
    - Module-level code runs before create_app(); current_app is unbound
  correctIndex: 3
  explanation: Module-level code runs at first import — before any app exists. Defer config reads to inside create_app() or to request time via current_app.config.
- id: q10
  question: Which pattern supports running old + new app versions in one process?
  options:
    - Two create_app() calls with different configs
    - Module-level app
    - Two blueprints
    - Two .flaskenv files
  correctIndex: 0
  explanation: Because create_app() returns a fresh app per call, you can build app_v1 = create_app('v1') and app_v2 = create_app('v2') and dispatch between them at the WSGI layer during migrations.
```

