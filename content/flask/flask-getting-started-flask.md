---
slug: flask-getting-started-flask
id: flask-01
track: flask
order: 1
title: Getting Started with Flask
description: Install Flask 3.x, write the canonical Hello World, and understand the dev server, the Flask class, and why app.run() is for development only.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo
whyItMatters: Install Flask 3. x, write the canonical Hello World, and understand the dev server, the Flask class, and why app.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Getting Started with Flask

## Getting Started with Flask

### Why It Matters

Install Flask 3. x, write the canonical Hello World, and understand the dev server, the Flask class, and why app.

Install Flask 3.x, write the canonical Hello World, and understand the dev server, the Flask class, and why app.run() is for development only.

### Prerequisites

- None — basic Python knowledge is helpful.
- Comfort creating and activating a virtualenv (python3 -m venv .venv).

### Topics

- Installing Flask 3.x via pip in a virtualenv
- The Flask class and the role of __name__
- Minimal app: app = Flask(__name__) + @app.route
- Running the dev server: `flask run` vs `app.run()`
- .flaskenv and python-dotenv for env-var loading
- The FLASK_APP / FLASK_DEBUG environment variables
- WSGI: the application callable interface
- Why app.run() must never be used in production

### Key Concepts

- Flask is a WSGI microframework: an instance of Flask is a callable that receives environ/start_response.
- The __name__ argument tells Flask where to find templates/static relative to the package root.
- app.run() starts Werkzeug's dev server — single-threaded by default, no security headers, no real concurrency.
- FLASK_APP points the CLI at your app module; FLASK_DEBUG=1 enables auto-reload and the interactive debugger.
- Flask 3.x requires Python 3.8+ (3.10+ recommended); Python 2 was never supported by modern Flask.

```python
# Terminal setup (run these first):
#   python3 -m venv .venv && source .venv/bin/activate
#   pip install "Flask>=3.0,<4.0"

# app.py
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Flask!"

# Run dev server ONLY in development:
#   flask --app app run --debug
# NEVER call app.run() in a deployed process.
```
Caption: Install + minimal app

### Common Pitfalls

- Running app.run(debug=True) in production — Use a real WSGI server (Gunicorn or uWSGI) behind Nginx; debug=True exposes the Werkzeug interactive debugger which is a remote-code-execution vector if reachable from the internet.
- Forgetting to set FLASK_APP and getting 'Could not import' errors — Create a .flaskenv file with FLASK_APP=app.py or export FLASK_APP=app before running flask run.
- Pip-installing Flask globally instead of per-project — Always create a venv first (python3 -m venv .venv) and install there; global installs cause version conflicts and break the system Python on Linux.
- Using Python 2 syntax or assuming Python <3.8 — Flask 3.x requires Python 3.8+; use a 3.10+ runtime so f-strings, match, and modern typing work out of the box.
- Binding to 0.0.0.0 with debug=True on a laptop — Keep dev servers on 127.0.0.1; binding to 0.0.0.0 with debug on exposes the Werkzeug debugger to the local network.

### Real-World Applications

- Pinterest's early web stack used Flask for several internal services before later moving to a hybrid Django + custom-services architecture.
- LinkedIn's early social-feed prototyping was done in Flask before being scaled out on internal JVM-based frameworks.
- Reddit's early link-ranking experiments were Flask apps before being ported to Pyramid and later Go services.
- Netflix's security-automation tooling (Scumblr, the Security Monkey siblings) ships Flask services that orchestrate vulnerability scans across regions.

### Interview Questions

- 1. Why must you never ship app.run() in production? — It uses Werkzeug's dev server, which is single-threaded, has no security headers, lacks graceful concurrency, and — with debug=True — exposes the interactive debugger.
- 2. What does the __name__ argument to Flask() actually do? — It tells Flask which package the app belongs to, so it can resolve templates/, static/, and instance folders relative to the package's location.
- 3. What's the difference between FLASK_APP and FLASK_DEBUG? — FLASK_APP points the CLI at your app module; FLASK_DEBUG=1 enables auto-reload, better tracebacks, and the Werkzeug debugger.
- 4. Is Flask synchronous or asynchronous? — Flask is WSGI (synchronous) at its core but supports async views since 2.0; each route can be `async def` and Flask runs it on a threadpool with `run_sync` under WSGI.
- 5. Name two production WSGI servers you'd run Flask under. — Gunicorn (most common, prefork model) and uWSGI (more knobs, pluggable languages); both are invoked as `gunicorn app:app` or `uwsgi --module app:app`.

### Mini Project

Build a Hello Flask Greeter: A single-file Flask app with one
route /greet/<name> that returns an HTML greeting. Suggested
approach:
  - Create a venv and `pip install Flask`
  - Write app.py with @app.route("/greet/<name>")
  - Return an f-string HTML response
  - Add a .flaskenv with FLASK_APP=app.py and FLASK_DEBUG=1
  - Run `flask run` and visit /greet/World in a browser

### Exercises

1. Install Flask 3.x in a fresh venv and run `flask --version` to confirm.
2. Write app.py with a / route returning 'Hello, Flask!' and run it via `flask run`.
3. Add a /health route returning JSON '{"status":"ok"}' and curl it.
4. Create a .flaskenv file with FLASK_APP and FLASK_DEBUG=1; verify that editing app.py auto-reloads.
5. Deliberately trigger a 500 error and observe the Werkzeug traceback in the browser; explain why this is unsafe in production.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command correctly installs Flask 3.x in a virtualenv?
9. A) pip install "Flask>=3.0,<4.0" (*)
10. B) pip install Flask==2.0
11. C) apt-get install flask
12. D) npm install flask
13. Explanation: Flask 3.x is installed via pip in an isolated venv using a version spec like >=3.0,<4.0 to avoid surprises from Flask 4.
14. Q2: What does the __name__ argument to Flask() do?
15. A) Sets the application's display name in the browser tab
16. B) Tells Flask where to find templates/static relative to the package root (*)
17. C) Configures the database connection name
18. D) Names the WSGI entry point for Gunicorn
19. Explanation: Flask uses __name__ to locate the package root so it can resolve templates/, static/, and the instance folder relative to it.
20. Q3: Why must app.run(debug=True) never be used in production?
21. A) It only works on Windows
22. B) It requires Python 2
23. C) It uses Werkzeug's dev server and exposes the interactive debugger (RCE risk) (*)
24. D) It cannot serve static files
25. Explanation: The Werkzeug dev server is not concurrency-safe, has no security headers, and debug=True exposes the interactive debugger which permits arbitrary code execution if reachable.
26. Q4: Which environment variable tells the Flask CLI which module holds your app?
27. A) FLASK_DEBUG
28. B) FLASK_RUN
29. C) APP_MODULE
30. D) FLASK_APP (*)
31. Explanation: FLASK_APP points the CLI at your app module (e.g. FLASK_APP=app.py); it is typically set in .flaskenv via python-dotenv.
32. Q5: Which file does python-dotenv auto-load for Flask CLI defaults?
33. A) .flaskenv (*)
34. B) .env
35. C) settings.py
36. D) config.toml
37. Explanation: .flaskenv is auto-loaded by Flask's CLI for non-secret values like FLASK_APP and FLASK_DEBUG; .env is for secrets and is loaded by your code via python-dotenv.
38. Q6: What is the minimum Python version for Flask 3.x?
39. A) Python 3.6
40. B) Python 3.8+ (3.10+ recommended) (*)
41. C) Python 2.7
42. D) Python 3.4
43. Explanation: Flask 3.x supports Python 3.8+; 3.10+ is recommended because the Flask team tests on the latest stable CPython.
44. Q7: Which production WSGI server is most commonly paired with Flask?
45. A) Node.js
46. B) Tomcat
47. C) Gunicorn (*)
48. D) Puma
49. Explanation: Gunicorn is the de-facto WSGI server for Flask in production, invoked as `gunicorn app:app`; uWSGI is a feature-rich alternative.
50. Q8: What is the default port for `flask run`?
51. A) 8000
52. B) 8080
53. C) 3000
54. D) 5000 (*)
55. Explanation: Flask's dev server defaults to port 5000 on 127.0.0.1; override with --port or --host.
56. Q9: Which is the canonical Flask Hello World?
57. A) from flask import Flask; app = Flask(__name__); @app.route("/") def hello(): return "Hello, Flask!" (*)
58. B) app = Flask(); @app.route("/") def hi(): return "Hi"
59. C) import flask; flask.route("/")("Hello")
60. D) def app(environ, start_response): return [b"Hello"]
61. Explanation: The canonical pattern imports Flask, instantiates with __name__, decorates a view with @app.route("/"), and returns a string.
62. Q10: What is WSGI?
63. A) A JavaScript framework
64. B) A Python specification for synchronous web apps: a callable (environ, start_response) -> iterable of bytes (*)
65. C) A database driver
66. D) A reverse-proxy protocol
67. Explanation: WSGI (PEP 3333) is the synchronous Python web standard; a Flask app is a WSGI callable that Gunicorn/uWSGI invoke per request.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command correctly installs Flask 3.x in a virtualenv?
  options:
    - pip install "Flask>=3.0,<4.0"
    - pip install Flask==2.0
    - apt-get install flask
    - npm install flask
  correctIndex: 0
  explanation: Flask 3.x is installed via pip in an isolated venv using a version spec like >=3.0,<4.0 to avoid surprises from Flask 4.
- id: q2
  question: What does the __name__ argument to Flask() do?
  options:
    - Sets the application's display name in the browser tab
    - Tells Flask where to find templates/static relative to the package root
    - Configures the database connection name
    - Names the WSGI entry point for Gunicorn
  correctIndex: 1
  explanation: Flask uses __name__ to locate the package root so it can resolve templates/, static/, and the instance folder relative to it.
- id: q3
  question: Why must app.run(debug=True) never be used in production?
  options:
    - It only works on Windows
    - It requires Python 2
    - It uses Werkzeug's dev server and exposes the interactive debugger (RCE risk)
    - It cannot serve static files
  correctIndex: 2
  explanation: The Werkzeug dev server is not concurrency-safe, has no security headers, and debug=True exposes the interactive debugger which permits arbitrary code execution if reachable.
- id: q4
  question: Which environment variable tells the Flask CLI which module holds your app?
  options:
    - FLASK_DEBUG
    - FLASK_RUN
    - APP_MODULE
    - FLASK_APP
  correctIndex: 3
  explanation: FLASK_APP points the CLI at your app module (e.g. FLASK_APP=app.py); it is typically set in .flaskenv via python-dotenv.
- id: q5
  question: Which file does python-dotenv auto-load for Flask CLI defaults?
  options:
    - .flaskenv
    - .env
    - settings.py
    - config.toml
  correctIndex: 0
  explanation: .flaskenv is auto-loaded by Flask's CLI for non-secret values like FLASK_APP and FLASK_DEBUG; .env is for secrets and is loaded by your code via python-dotenv.
- id: q6
  question: What is the minimum Python version for Flask 3.x?
  options:
    - Python 3.6
    - Python 3.8+ (3.10+ recommended)
    - Python 2.7
    - Python 3.4
  correctIndex: 1
  explanation: Flask 3.x supports Python 3.8+; 3.10+ is recommended because the Flask team tests on the latest stable CPython.
- id: q7
  question: Which production WSGI server is most commonly paired with Flask?
  options:
    - Node.js
    - Tomcat
    - Gunicorn
    - Puma
  correctIndex: 2
  explanation: Gunicorn is the de-facto WSGI server for Flask in production, invoked as `gunicorn app:app`; uWSGI is a feature-rich alternative.
- id: q8
  question: What is the default port for `flask run`?
  options:
    - "8000"
    - "8080"
    - "3000"
    - "5000"
  correctIndex: 3
  explanation: Flask's dev server defaults to port 5000 on 127.0.0.1; override with --port or --host.
- id: q9
  question: Which is the canonical Flask Hello World?
  options:
    - 'from flask import Flask; app = Flask(__name__); @app.route("/") def hello(): return "Hello, Flask!"'
    - 'app = Flask(); @app.route("/") def hi(): return "Hi"'
    - import flask; flask.route("/")("Hello")
    - 'def app(environ, start_response): return [b"Hello"]'
  correctIndex: 0
  explanation: The canonical pattern imports Flask, instantiates with __name__, decorates a view with @app.route("/"), and returns a string.
- id: q10
  question: What is WSGI?
  options:
    - A JavaScript framework
    - "A Python specification for synchronous web apps: a callable (environ, start_response) -> iterable of bytes"
    - A database driver
    - A reverse-proxy protocol
  correctIndex: 1
  explanation: WSGI (PEP 3333) is the synchronous Python web standard; a Flask app is a WSGI callable that Gunicorn/uWSGI invoke per request.
```

