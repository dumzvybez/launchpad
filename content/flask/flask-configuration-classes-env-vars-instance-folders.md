---
slug: flask-configuration-classes-env-vars-instance-folders
id: flask-09
track: flask
order: 9
title: Configuration — classes, env vars, instance folders
description: Manage configuration across environments with Config classes, environment variables, from_prefixed_env, instance folders for secrets, and the FLASK_ENV deprecation in Flask 2.3+.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=360s
whyItMatters: Manage configuration across environments with Config classes, environment variables, from_prefixed_env, instance folders for secrets, and the FLASK_ENV deprecation in Flask 2. 3+.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Configuration — classes, env vars, instance folders

## Configuration — classes, env vars, instance folders

### Why It Matters

Manage configuration across environments with Config classes, environment variables, from_prefixed_env, instance folders for secrets, and the FLASK_ENV deprecation in Flask 2. 3+.

Manage configuration across environments with Config classes, environment variables, from_prefixed_env, instance folders for secrets, and the FLASK_ENV deprecation in Flask 2.3+.

### Prerequisites

- Stage 8: Application Factory Pattern
- Familiarity with 12-factor app config (env vars, no secrets in code).

### Topics

- app.config as a dict subclass
- from_object, from_envvar, from_file, from_prefixed_env, from_mapping
- Config classes (BaseConfig, DevConfig, ProdConfig, TestConfig)
- Environment variables and os.environ.get
- Instance folders and instance_relative_config=True
- FLASK_ENV and FLASK_DEBUG deprecation in Flask 2.3+
- SECRET_KEY rotation and best practices
- Secrets managers (AWS Secrets Manager, Vault) integration

### Key Concepts

- app.config is a dict-like object; methods like from_object load attributes (uppercase only) from a class or module path.
- from_prefixed_env('FLASK') reads FLASK_FOO=bar into config['FOO'] — ideal for 12-factor deploys without a config file.
- Instance folders live outside the package (instance/) so they're not committed; use instance_relative_config=True and from_pyfile('config.py') to load secrets.
- FLASK_ENV was deprecated in Flask 2.3; use explicit config classes and FLASK_DEBUG for the debug flag instead.
- Config classes let tests override with TestingConfig(DEBUG=False, TESTING=True, SQLALCHEMY_DATABASE_URI='sqlite:///:memory:') without env-var branching.

```python
# app/config.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_TIME_LIMIT = 3600

class DevConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'dev.db'}")

class ProdConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]
    SESSION_COOKIE_SECURE = True
    PREFERRED_URL_SCHEME = "https"

class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False

CONFIGS = {"dev": DevConfig, "prod": ProdConfig, "testing": TestConfig}
```
Caption: Config classes

### Common Pitfalls

- Hard-coding SECRET_KEY in config.py and committing it — Generate with `secrets.token_urlsafe(64)`, load from env or instance/config.py (which is in .gitignore); rotate by swapping the env value and bouncing the app.
- Using FLASK_ENV=production to enable prod config in Flask 2.3+ — FLASK_ENV was deprecated in 2.3 and removed in 2.4; pass the config name explicitly to create_app('prod') and use FLASK_DEBUG for the debug flag.
- Forgetting to set TESTING=True in TestConfig — Without TESTING=True, exceptions in views propagate as 500s instead of being raised for the test client to inspect, and some extensions (Flask-Mail) suppress sends silently.
- Reading os.environ['KEY'] at module import time — If the env var is missing, the import crashes the whole app; default with os.environ.get('KEY') or read inside create_app() so missing prod-only vars surface at boot with a clear message.
- Committing instance/config.py with real secrets — The instance/ folder must be in .gitignore; use .gitignore patterns and pre-commit hooks (detect-secrets, gitleaks) to block secrets at commit time.

### Real-World Applications

- Pinterest's Flask services load config from env vars via from_prefixed_env so they can be deployed across canary/stable environments with the same Docker image.
- Lyft's admin Flask apps read secrets from AWS Secrets Manager at boot, falling back to instance/config.py for local dev.
- Netflix's security-automation Flask tools load per-region config from environment variables injected by Spinnaker's deployment pipeline.
- Patreon's Flask services use HashiCorp Vault with a sidecar that writes instance/config.py at boot, then Flask reads it via from_pyfile.

### Interview Questions

- 1. What's the difference between from_object and from_envvar? — from_object loads UPPERCASE attributes from a Python class or module path; from_envvar reads a filename from an env var and from_pyfile()s it.
- 2. Why use from_prefixed_env('FLASK')? — It loads FLASK_FOO=bar into config['FOO'] — perfect for 12-factor deploys where config comes from env vars and you want no extra config file.
- 3. What's an instance folder for? — A folder outside the package (instance/) for deployment-specific secrets; not committed, loaded via from_pyfile('config.py', silent=True).
- 4. Why was FLASK_ENV deprecated in Flask 2.3? — It conflated config selection with the debug flag and didn't scale to multiple configs; the maintainers recommend passing the config name explicitly to create_app().
- 5. How do you rotate SECRET_KEY safely? — Generate a new key, set it in env (or secrets manager), bounce the app; old sessions become invalid (users must re-login). For zero-downtime, support a list of accepted keys during the transition window.

### Mini Project

Build a Config-Driven App: A Flask app that boots with dev, prod,
or testing config based on FLASK_CONFIG env var, reads FLASK_*
env vars, and loads instance/config.py for secrets. Suggested
approach:
  - Write app/config.py with BaseConfig, DevConfig, ProdConfig, TestConfig
  - In create_app, use from_object(CONFIGS[config_name])
  - Add from_prefixed_env('FLASK') for FLASK_SQLALCHEMY_DATABASE_URI
  - Add instance/config.py to .gitignore
  - Verify `FLASK_CONFIG=testing FLASK_DEBUG=0 flask run` boots correctly

### Exercises

1. Write DevConfig, ProdConfig, TestConfig classes with different SQLALCHEMY_DATABASE_URI.
2. Add app.config.from_prefixed_env('FLASK') and set FLASK_SECRET_KEY in your shell.
3. Create instance/config.py with a fake secret and load it via from_pyfile('config.py', silent=True).
4. Add instance/ to .gitignore and verify git status doesn't show instance/config.py.
5. Remove FLASK_ENV usage and replace it with FLASK_CONFIG + FLASK_DEBUG.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does app.config.from_object(SomeClass) load?
9. A) Only UPPERCASE attributes of SomeClass (*)
10. B) All attributes of SomeClass
11. C) Only methods of SomeClass
12. D) Only lowercase attributes
13. Explanation: from_object loads only UPPERCASE attribute names by convention (SECRET_KEY, DEBUG); lowercase names are ignored to allow private helpers.
14. Q2: Which method loads FLASK_FOO=bar into config['FOO']?
15. A) from_object
16. B) from_prefixed_env('FLASK') (*)
17. C) from_envvar
18. D) from_mapping
19. Explanation: from_prefixed_env('FLASK') strips the prefix and loads FLASK_FOO=bar as config['FOO']; ideal for 12-factor deploys.
20. Q3: What's the purpose of the instance/ folder?
21. A) Holds Python bytecode
22. B) Holds templates
23. C) Holds deployment-specific config and secrets, not committed to git (*)
24. D) Holds database files
25. Explanation: instance/ is outside the package; deployment-specific config.py lives there and is loaded via from_pyfile('config.py', silent=True). Always add to .gitignore.
26. Q4: Why was FLASK_ENV deprecated in Flask 2.3?
27. A) It was slow
28. B) It only worked on Windows
29. C) It was replaced by app.run()
30. D) It conflated config selection with the debug flag and didn't scale to multiple configs (*)
31. Explanation: FLASK_ENV overloaded two concerns; the maintainers recommend passing the config name to create_app() explicitly and using FLASK_DEBUG for the debug flag.
32. Q5: What should SECRET_KEY be in production?
33. A) A long random value from secrets.token_urlsafe(64), loaded from env or a secrets manager (*)
34. B) 'dev'
35. C) 'secret'
36. D) Your app name
37. Explanation: Generate a long random key, store it in env or a secrets manager (Vault, AWS SM), never commit it; rotate by swapping the value and bouncing the app.
38. Q6: Which config flag makes exceptions propagate to the test client instead of 500?
39. A) DEBUG=True
40. B) TESTING=True (*)
41. C) PROPAGATE_EXCEPTIONS=True
42. D) RAISE_ON_ERROR=True
43. Explanation: TESTING=True sets PROPAGATE_EXCEPTIONS=True so tests see real tracebacks; it also disables error catching in some extensions.
44. Q7: Which loading order is correct (last wins)?
45. A) from_pyfile -> from_object -> from_prefixed_env
46. B) from_prefixed_env -> from_object -> from_pyfile
47. C) from_object -> from_pyfile -> from_prefixed_env (*)
48. D) Order doesn't matter; they merge
49. Explanation: Typical order: class via from_object, then instance/config.py via from_pyfile, then env via from_prefixed_env — so env wins, allowing deploy-time overrides.
50. Q8: Why avoid os.environ['KEY'] at module import time?
51. A) It's slow
52. B) env vars are read-only
53. C) It triggers a circular import
54. D) Missing key crashes the entire app at import; use os.environ.get or read inside create_app() (*)
55. Explanation: Bracket access raises KeyError if the var is missing; prefer .get() with a default or read inside create_app() so missing prod-only vars surface at boot with a clear message.
56. Q9: What does instance_relative_config=True do?
57. A) Tells Flask to look in the instance/ folder for from_pyfile and config files (*)
58. B) Loads config from the package root
59. C) Forces config reloads
60. D) Disables config loading
61. Explanation: instance_relative_config=True makes from_pyfile and relative config paths resolve against the instance/ folder rather than the package root.
62. Q10: What's a safe way to rotate SECRET_KEY without logging out every user?
63. A) You can't; all sessions invalidate
64. B) Support a list of accepted keys during the transition (old + new), then remove the old key after a TTL (*)
65. C) Set SECRET_KEY to None
66. D) Use the same key forever
67. Explanation: For zero-downtime rotation, accept both old and new keys during a transition window (custom session interface), then drop the old key after the session TTL expires.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does app.config.from_object(SomeClass) load?
  options:
    - Only UPPERCASE attributes of SomeClass
    - All attributes of SomeClass
    - Only methods of SomeClass
    - Only lowercase attributes
    - ; lowercase names are ignored to allow private helpers.
  correctIndex: 0
  explanation: from_object loads only UPPERCASE attribute names by convention (SECRET_KEY, DEBUG); lowercase names are ignored to allow private helpers.
- id: q2
  question: Which method loads FLASK_FOO=bar into config['FOO']?
  options:
    - from_object
    - from_prefixed_env('FLASK')
    - from_envvar
    - from_mapping
  correctIndex: 1
  explanation: from_prefixed_env('FLASK') strips the prefix and loads FLASK_FOO=bar as config['FOO']; ideal for 12-factor deploys.
- id: q3
  question: What's the purpose of the instance/ folder?
  options:
    - Holds Python bytecode
    - Holds templates
    - Holds deployment-specific config and secrets, not committed to git
    - Holds database files
  correctIndex: 2
  explanation: instance/ is outside the package; deployment-specific config.py lives there and is loaded via from_pyfile('config.py', silent=True). Always add to .gitignore.
- id: q4
  question: Why was FLASK_ENV deprecated in Flask 2.3?
  options:
    - It was slow
    - It only worked on Windows
    - It was replaced by app.run()
    - It conflated config selection with the debug flag and didn't scale to multiple configs
  correctIndex: 3
  explanation: FLASK_ENV overloaded two concerns; the maintainers recommend passing the config name to create_app() explicitly and using FLASK_DEBUG for the debug flag.
- id: q5
  question: What should SECRET_KEY be in production?
  options:
    - A long random value from secrets.token_urlsafe(64), loaded from env or a secrets manager
    - "'dev'"
    - "'secret'"
    - Your app name
    - ", never commit it; rotate by swapping the value and bouncing the app."
  correctIndex: 0
  explanation: Generate a long random key, store it in env or a secrets manager (Vault, AWS SM), never commit it; rotate by swapping the value and bouncing the app.
- id: q6
  question: Which config flag makes exceptions propagate to the test client instead of 500?
  options:
    - DEBUG=True
    - TESTING=True
    - PROPAGATE_EXCEPTIONS=True
    - RAISE_ON_ERROR=True
  correctIndex: 1
  explanation: TESTING=True sets PROPAGATE_EXCEPTIONS=True so tests see real tracebacks; it also disables error catching in some extensions.
- id: q7
  question: Which loading order is correct (last wins)?
  options:
    - from_pyfile -> from_object -> from_prefixed_env
    - from_prefixed_env -> from_object -> from_pyfile
    - from_object -> from_pyfile -> from_prefixed_env
    - Order doesn't matter; they merge
  correctIndex: 2
  explanation: "Typical order: class via from_object, then instance/config.py via from_pyfile, then env via from_prefixed_env — so env wins, allowing deploy-time overrides."
- id: q8
  question: Why avoid os.environ['KEY'] at module import time?
  options:
    - It's slow
    - env vars are read-only
    - It triggers a circular import
    - Missing key crashes the entire app at import; use os.environ.get or read inside create_app()
  correctIndex: 3
  explanation: Bracket access raises KeyError if the var is missing; prefer .get() with a default or read inside create_app() so missing prod-only vars surface at boot with a clear message.
- id: q9
  question: What does instance_relative_config=True do?
  options:
    - Tells Flask to look in the instance/ folder for from_pyfile and config files
    - Loads config from the package root
    - Forces config reloads
    - Disables config loading
  correctIndex: 0
  explanation: instance_relative_config=True makes from_pyfile and relative config paths resolve against the instance/ folder rather than the package root.
- id: q10
  question: What's a safe way to rotate SECRET_KEY without logging out every user?
  options:
    - You can't; all sessions invalidate
    - Support a list of accepted keys during the transition (old + new), then remove the old key after a TTL
    - Set SECRET_KEY to None
    - Use the same key forever
  correctIndex: 1
  explanation: For zero-downtime rotation, accept both old and new keys during a transition window (custom session interface), then drop the old key after the session TTL expires.
```

