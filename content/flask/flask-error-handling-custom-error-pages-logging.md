---
slug: flask-error-handling-custom-error-pages-logging
id: flask-15
track: flask
order: 15
title: Error Handling, Custom Error Pages, Logging
description: Convert 404/500 responses into branded JSON or HTML, log exceptions with structured context, integrate Sentry, and configure rotating file logs for production.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=720s
whyItMatters: Convert 404/500 responses into branded JSON or HTML, log exceptions with structured context, integrate Sentry, and configure rotating file logs for production.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Error Handling, Custom Error Pages, Logging

## Error Handling, Custom Error Pages, Logging

### Why It Matters

Convert 404/500 responses into branded JSON or HTML, log exceptions with structured context, integrate Sentry, and configure rotating file logs for production.

Convert 404/500 responses into branded JSON or HTML, log exceptions with structured context, integrate Sentry, and configure rotating file logs for production.

### Prerequisites

- Stage 14: REST APIs and Flask-Smorest
- Stage 5 (abort/HTTPException) and Stage 3 (templates).

### Topics

- @app.errorhandler(code) and @app.errorhandler(Exception)
- Custom 404/500 HTML pages
- JSON error responses for API blueprints
- app.logger and Python's logging module
- Structured logging with structlog or json-logging-python
- Rotating file handlers (RotatingFileHandler, TimedRotatingFileHandler)
- Sentry integration (sentry-sdk[flask])
- Logging request id (X-Request-ID) for tracing

### Key Concepts

- @app.errorhandler(Exception) catches everything but should re-raise HTTPException so abort(404) still works — register specific handlers first.
- Flask's app.logger is a NamedLogger('app') that inherits the root logger; in prod, configure handlers (file + Sentry) on the root logger or via dictConfig.
- Never expose tracebacks to clients in production (DEBUG=False); log the full traceback server-side and return a generic 500 message.
- A request id (UUID generated in before_request, stored in g, logged in every line) lets you trace a single request across logs and downstream services.
- Sentry's Flask integration auto-captures unhandled exceptions; call sentry_sdk.init(dsn=..., environment=..., traces_sample_rate=0.1) at app boot.

```python
from flask import Flask, jsonify, render_template, request
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

@app.errorhandler(404)
def not_found(err):
    # Return JSON for API routes, HTML for browser routes:
    if request.path.startswith("/api/"):
        return jsonify({"error": "not_found", "message": err.description}), 404
    return render_template("errors/404.html"), 404

@app.errorhandler(500)
def server_error(err):
    app.logger.exception("500 on %s", request.path)
    return render_template("errors/500.html"), 500

@app.errorhandler(Exception)
def unhandled(err):
    if isinstance(err, HTTPException):
        return err  # let Flask's default formatting kick in for abort()
    app.logger.exception("Unhandled on %s", request.path)
    return render_template("errors/500.html"), 500
```
Caption: Custom error handlers (HTML + JSON)

### Common Pitfalls

- Letting DEBUG=True leak tracebacks to clients in production — Set DEBUG=False in prod; tracebacks reveal code paths, secrets, and DB schema. Return a generic 500 page and log the traceback server-side.
- Registering @app.errorhandler(Exception) before specific handlers — Specific handlers must come first or the catch-all wins; also re-raise HTTPException inside the catch-all so abort() still produces the right status code.
- Using print() instead of app.logger — print() bypasses the logging config (no levels, no handlers, no Sentry); use app.logger.info/error/exception consistently.
- Logging without a request id — Without a correlation id, tracing a single request across log lines and downstream services is impossible; generate X-Request-ID in before_request and emit it in every log line.
- Forgetting to rotate logs — FileHandler grows unbounded; use RotatingFileHandler(maxBytes=10*1024*1024, backupCount=10) or TimedRotatingFileHandler(when='midnight') in production.

### Real-World Applications

- Pinterest's Flask services pipe structured JSON logs (with request id, shard, latency) into their internal logging backbone for queryability.
- Lyft's Flask admin apps use Sentry + structured logs with X-Request-ID propagation to the upstream gateway for end-to-end tracing.
- Netflix's security-automation Flask tools log every finding event with a correlation id to Splunk for compliance audit trails.
- Patreon's Flask services run sentry-sdk[flask] with traces_sample_rate=0.01 and route all app.logger output to stdout for kubectl logs.

### Interview Questions

- 1. Why register specific errorhandlers before the catch-all Exception? — Flask invokes the first matching handler; @app.errorhandler(Exception) would swallow 404/500 unless you re-raise HTTPException inside it. Register specific first.
- 2. How do you avoid leaking tracebacks in production? — Set DEBUG=False; Flask's default 500 page is generic. Log the traceback with app.logger.exception() and return a branded 500 page.
- 3. What's the role of X-Request-ID? — It's a correlation id generated per request (or echoed from an upstream gateway); included in every log line so you can trace one request across services.
- 4. How does Sentry integrate with Flask? — sentry_sdk.init(dsn=..., integrations=[FlaskIntegration()]) at boot auto-captures unhandled exceptions and HTTP 5xx; traces_sample_rate controls performance monitoring.
- 5. Why use RotatingFileHandler instead of FileHandler? — FileHandler grows unbounded; RotatingFileHandler caps file size and keeps N backups, preventing disk exhaustion in long-running services.

### Mini Project

Build a Branded Error + Logging App: A Flask app with custom 404/500
pages (HTML for browser, JSON for /api/*), structured logging with
X-Request-ID, and Sentry integration. Suggested approach:
  - Register @app.errorhandler(404) and (500) returning template or JSON
  - Add @app.errorhandler(Exception) that re-raises HTTPException
  - Generate X-Request-ID in before_request and log it on every line
  - Echo X-Request-ID back in the response via after_request
  - Init sentry_sdk with FlaskIntegration in create_app

### Exercises

1. Register @app.errorhandler(404) returning a custom HTML page.
2. Add @app.errorhandler(Exception) that re-raises HTTPException and logs the rest.
3. Generate X-Request-ID in before_request and emit it in app.logger output.
4. Configure RotatingFileHandler with 10MB rotation and 5 backups.
5. Init sentry_sdk[flask] and trigger a 500 to verify it appears in Sentry.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why must @app.errorhandler(Exception) re-raise HTTPException?
9. A) To slow it down
10. B) Because HTTPException can't be caught
11. C) So abort(404) still produces a 404 instead of being swallowed by the catch-all (*)
12. D) It's required by Flask
13. Explanation: Without re-raising HTTPException, the catch-all would convert every abort(404) into a 500; check isinstance(err, HTTPException) and return err.
14. Q2: What's the safe production setting for DEBUG?
15. A) DEBUG=True for visibility
16. B) DEBUG=auto
17. C) DEBUG=1
18. D) DEBUG=False; tracebacks leak code paths and secrets (*)
19. Explanation: DEBUG=False in production; the Werkzeug debugger is an RCE vector and tracebacks expose internals. Log server-side, return generic pages to clients.
20. Q3: Which logger should you use instead of print()?
21. A) app.logger (*)
22. B) print()
23. C) sys.stdout
24. D) logging.print()
25. Explanation: app.logger respects levels, handlers, and Sentry integration; print() bypasses everything and isn't captured by log aggregators.
26. Q4: What's the role of X-Request-ID?
27. A) It's the user's session id
28. B) Correlation id per request for tracing across logs and services (*)
29. C) It's the CSRF token
30. D) It's the user's IP
31. Explanation: X-Request-ID is generated per request (or echoed from the gateway); included in every log line so you can trace one request across services and downstream calls.
32. Q5: Which handler prevents log files from growing unbounded?
33. A) FileHandler
34. B) StreamHandler
35. C) RotatingFileHandler (*)
36. D) NullHandler
37. Explanation: RotatingFileHandler(maxBytes=10*1024*1024, backupCount=10) caps the file size and keeps N backups; TimedRotatingFileHandler rotates by time.
38. Q6: How does Sentry's Flask integration work?
39. A) You call sentry_sdk.capture() in every view
40. B) It replaces app.logger
41. C) It's a separate Flask extension
42. D) sentry_sdk.init(integrations=[FlaskIntegration()]) auto-captures unhandled exceptions and 5xx (*)
43. Explanation: FlaskIntegration hooks into Flask's error handling at boot; unhandled exceptions and HTTP 5xx are auto-captured with full traceback, request, and user context.
44. Q7: How do you return JSON errors for /api/* but HTML for browser routes?
45. A) Check request.path.startswith('/api/') inside the errorhandler (*)
46. B) You can't; pick one
47. C) Use a separate app for APIs
48. D) Check request.method
49. Explanation: Inside @app.errorhandler(404) check request.path and return jsonify(...) for API paths or render_template(...) otherwise; also inspect Accept header for content negotiation.
50. Q8: Which logging method records the full traceback server-side?
51. A) app.logger.info(str(err))
52. B) app.logger.exception('msg') (*)
53. C) print(err)
54. D) app.logger.warn(err)
55. Explanation: app.logger.exception('msg') logs at ERROR level and attaches the current traceback; equivalent to logger.error('msg', exc_info=True).
56. Q9: Why propagate X-Request-ID back in the response?
57. A) For SEO
58. B) For caching
59. C) So clients can quote it when reporting issues and you can find the log lines (*)
60. D) For CORS
61. Explanation: Echoing X-Request-ID in @app.after_request lets users quote it in support tickets; you grep logs for that id to find the exact request.
62. Q10: What does send_default_pii=False do in sentry_sdk.init?
63. A) Disables Sentry
64. B) Encrypts the DSN
65. C) Limits log size
66. D) Prevents PII (cookies, user info, form data) from being sent to Sentry (*)
67. Explanation: send_default_pii=False (default in newer SDKs) keeps cookies, form fields, and user info out of Sentry events, important for GDPR/CCPA compliance.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why must @app.errorhandler(Exception) re-raise HTTPException?
  options:
    - To slow it down
    - Because HTTPException can't be caught
    - So abort(404) still produces a 404 instead of being swallowed by the catch-all
    - It's required by Flask
  correctIndex: 2
  explanation: Without re-raising HTTPException, the catch-all would convert every abort(404) into a 500; check isinstance(err, HTTPException) and return err.
- id: q2
  question: What's the safe production setting for DEBUG?
  options:
    - DEBUG=True for visibility
    - DEBUG=auto
    - DEBUG=1
    - DEBUG=False; tracebacks leak code paths and secrets
  correctIndex: 3
  explanation: DEBUG=False in production; the Werkzeug debugger is an RCE vector and tracebacks expose internals. Log server-side, return generic pages to clients.
- id: q3
  question: Which logger should you use instead of print()?
  options:
    - app.logger
    - print()
    - sys.stdout
    - logging.print()
  correctIndex: 0
  explanation: app.logger respects levels, handlers, and Sentry integration; print() bypasses everything and isn't captured by log aggregators.
- id: q4
  question: What's the role of X-Request-ID?
  options:
    - It's the user's session id
    - Correlation id per request for tracing across logs and services
    - It's the CSRF token
    - It's the user's IP
  correctIndex: 1
  explanation: X-Request-ID is generated per request (or echoed from the gateway); included in every log line so you can trace one request across services and downstream calls.
- id: q5
  question: Which handler prevents log files from growing unbounded?
  options:
    - FileHandler
    - StreamHandler
    - RotatingFileHandler
    - NullHandler
  correctIndex: 2
  explanation: RotatingFileHandler(maxBytes=10*1024*1024, backupCount=10) caps the file size and keeps N backups; TimedRotatingFileHandler rotates by time.
- id: q6
  question: How does Sentry's Flask integration work?
  options:
    - You call sentry_sdk.capture() in every view
    - It replaces app.logger
    - It's a separate Flask extension
    - sentry_sdk.init(integrations=[FlaskIntegration()]) auto-captures unhandled exceptions and 5xx
  correctIndex: 3
  explanation: FlaskIntegration hooks into Flask's error handling at boot; unhandled exceptions and HTTP 5xx are auto-captured with full traceback, request, and user context.
- id: q7
  question: How do you return JSON errors for /api/* but HTML for browser routes?
  options:
    - Check request.path.startswith('/api/') inside the errorhandler
    - You can't; pick one
    - Use a separate app for APIs
    - Check request.method
  correctIndex: 0
  explanation: Inside @app.errorhandler(404) check request.path and return jsonify(...) for API paths or render_template(...) otherwise; also inspect Accept header for content negotiation.
- id: q8
  question: Which logging method records the full traceback server-side?
  options:
    - app.logger.info(str(err))
    - app.logger.exception('msg')
    - print(err)
    - app.logger.warn(err)
  correctIndex: 1
  explanation: app.logger.exception('msg') logs at ERROR level and attaches the current traceback; equivalent to logger.error('msg', exc_info=True).
- id: q9
  question: Why propagate X-Request-ID back in the response?
  options:
    - For SEO
    - For caching
    - So clients can quote it when reporting issues and you can find the log lines
    - For CORS
  correctIndex: 2
  explanation: Echoing X-Request-ID in @app.after_request lets users quote it in support tickets; you grep logs for that id to find the exact request.
- id: q10
  question: What does send_default_pii=False do in sentry_sdk.init?
  options:
    - Disables Sentry
    - Encrypts the DSN
    - Limits log size
    - Prevents PII (cookies, user info, form data) from being sent to Sentry
  correctIndex: 3
  explanation: send_default_pii=False (default in newer SDKs) keeps cookies, form fields, and user info out of Sentry events, important for GDPR/CCPA compliance.
```

