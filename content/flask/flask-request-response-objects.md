---
slug: flask-request-response-objects
id: flask-05
track: flask
order: 5
title: Request and Response Objects
description: Use the request proxy (args, form, data, json, headers, cookies, files), build responses with make_response and jsonify, set status codes and headers, and abort early with abort().
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=120s
whyItMatters: Use the request proxy (args, form, data, json, headers, cookies, files), build responses with make_response and jsonify, set status codes and headers, and abort early with abort().
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Request and Response Objects

## Request and Response Objects

### Why It Matters

Use the request proxy (args, form, data, json, headers, cookies, files), build responses with make_response and jsonify, set status codes and headers, and abort early with abort().

Use the request proxy (args, form, data, json, headers, cookies, files), build responses with make_response and jsonify, set status codes and headers, and abort early with abort().

### Prerequisites

- Stage 4: Static Files, Files, and Forms
- Familiarity with HTTP request/response structure (method, headers, body, status).

### Topics

- The request LocalProxy and why it's thread-safe
- request.args (GET), request.form (POST urlencoded), request.json / get_json
- request.data (raw bytes) vs request.values (form + args merged)
- request.headers, request.cookies, request.method, request.path
- Response objects: Response, jsonify, make_response
- Setting status codes and custom headers
- abort(404, message=...) and HTTPException
- send_file and send_from_directory

### Key Concepts

- request, g, current_app, and session are LocalProxy objects bound to the active request/app context; never pass them across threads.
- jsonify() returns a Response with Content-Type application/json and JSON-serializes dicts/lists (use Flask 2.2+ json provider for customization).
- make_response(render_template(...), 201) lets you set status/headers on a rendered body; returning a bare tuple (body, status, headers) also works.
- abort(404) raises HTTPException which Flask catches and turns into the matching response; pass a Response to abort() to fully customize.
- request.data is the raw body as bytes; for application/json use request.get_json() and for form data request.form — never re-parse data yourself if a parser exists.

```python
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.get("/search")
def search():
    q = request.args.get("q", "")  # ?q=flask
    page = request.args.get("page", 1, type=int)
    return jsonify({"q": q, "page": page})

@app.post("/items")
def create_item():
    payload = request.get_json(silent=True)
    if not payload or "name" not in payload:
        from flask import abort
        abort(400, description="name is required")
    return jsonify(payload), 201
```
Caption: Reading request data

### Common Pitfalls

- Passing the request object to a background thread — request is a LocalProxy bound to the request context; in a worker thread it raises RuntimeError. Copy the values you need into a plain dict before launching the thread.
- Calling request.get_json() on form-encoded bodies without silent=True — It raises a 400 BadRequest; pass silent=True (or check Content-Type) when the endpoint accepts either JSON or form data.
- Returning a dict from a view and assuming it's JSON — Flask 1.1+ auto-jsonifies dicts, but returning a tuple (dict, status) is safer for status codes; for full control use jsonify().
- Using request.form for JSON payloads — Form-encoded bodies live in request.form; JSON bodies live in request.get_json(). Mixing them returns None silently.
- Forgetting to set status codes on created resources — Returning the body without 201 Created confuses API clients that distinguish creation from update; use `return jsonify(obj), 201` or `return jsonify(obj), 201, {"Location": url}`.

### Real-World Applications

- Pinterest's early API endpoints returned jsonify-style responses with X-RateLimit headers before they migrated to a Thrift-based internal API.
- Twilio's webhook-receiving Flask services parse request.form (Twilio posts form-encoded) and reply with TwiML XML responses.
- Lyft's internal admin APIs use abort(404) and custom errorhandlers to return structured JSON errors to React front-ends.
- Patreon's webhook receiver uses request.headers['X-Patreon-Signature'] to verify HMAC before parsing request.get_json().

### Interview Questions

- 1. Why is request called a proxy? — It's a werkzeug.local.LocalProxy that forwards attribute access to the request object bound to the current request context, making it thread-safe without passing it as an argument.
- 2. What's the difference between request.data, request.form, and request.get_json()? — data is the raw bytes; form is parsed urlencoded/multipart fields; get_json() parses application/json. Use the right one for the Content-Type.
- 3. How do you set a custom header on a response? — Use make_response(body, status) then assign resp.headers['X-Foo']='bar'; or return (body, status, headers_dict).
- 4. What does abort(403) do? — It raises werkzeug.exceptions.Forbidden, which Flask's default errorhandler converts into a 403 response; you can override with @app.errorhandler(403).
- 5. Why should you avoid passing request to a thread? — The request context is thread-local; a background thread has no active context, so accessing request raises RuntimeError. Copy needed values into a plain dict first.

### Mini Project

Build a JSON Echo API: A Flask app with POST /echo that accepts JSON
and returns it with a 201 status, an X-Echoed-At header, and an
abort(400) if the body is missing the 'message' field. Suggested
approach:
  - Use request.get_json(silent=True)
  - Validate payload has 'message' (string, non-empty)
  - Use make_response(jsonify(payload), 201) and add the header
  - Register @app.errorhandler(400) returning JSON errors
  - Test with curl -X POST -H 'Content-Type: application/json' -d '{"message":"hi"}'

### Exercises

1. Build a GET /search endpoint that reads ?q= and ?page= and returns JSON.
2. Add an X-Frame-Options: DENY header to every response via make_response or after_request.
3. POST JSON without 'message' to /echo and confirm a 400 with a JSON error body.
4. Use abort(404) inside a view and verify your @app.errorhandler(404) returns JSON.
5. Return a CSV file from /export with Content-Disposition: attachment; filename=users.csv.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What kind of object is request in Flask?
9. A) A LocalProxy bound to the current request context (*)
10. B) A global singleton
11. C) A class attribute of Flask
12. D) A WSGI environ dict
13. Explanation: request is a werkzeug.local.LocalProxy that forwards attribute access to the request object bound to the active request context, making it thread-safe.
14. Q2: Which attribute holds parsed query string parameters?
15. A) request.body
16. B) request.args (*)
17. C) request.form
18. D) request.query
19. Explanation: request.args is a MultiDict of parsed query string params (?q=...&page=...); request.form holds POST body fields.
20. Q3: Which function returns a JSON Response with the right Content-Type?
21. A) json.dumps
22. B) render_json
23. C) jsonify (*)
24. D) make_json
25. Explanation: jsonify(obj) serializes to JSON and sets Content-Type: application/json; in Flask 1.1+ returning a bare dict also auto-jsonifies.
26. Q4: How do you set a custom header on a response?
27. A) resp.set_header('X-Foo', 'bar')
28. B) resp.add_header('X-Foo', 'bar')
29. C) resp['X-Foo'] = 'bar'
30. D) resp.headers['X-Foo'] = 'bar' (*)
31. Explanation: Access resp.headers (a Headers dict) and assign; or return (body, status, headers_dict) from the view.
32. Q5: What does abort(404, description='not found') do?
33. A) Raises werkzeug.exceptions.NotFound which Flask converts to a 404 response (*)
34. B) Returns a 404 response directly
35. C) Logs the error and continues
36. D) Sends a 500 response
37. Explanation: abort() raises an HTTPException subclass; Flask catches it and renders the matching response, overridable via @app.errorhandler(404).
38. Q6: Which is the safe way to parse a JSON body that may be missing?
39. A) request.json()
40. B) request.get_json(silent=True) (*)
41. C) request.data.decode()
42. D) request.json
43. Explanation: get_json(silent=True) returns None instead of raising 400; pair with `or {}` to default the shape.
44. Q7: What does request.data contain?
45. A) Parsed form fields
46. B) Parsed JSON as a dict
47. C) The raw request body as bytes (*)
48. D) The query string as a dict
49. Explanation: request.data is the unparsed body as bytes; for JSON use get_json(), for forms use request.form, for args use request.args.
50. Q8: Which return form sets a status code and headers together?
51. A) return body.with_status(201)
52. B) return {body, status, headers}
53. C) return [body, status, headers]
54. D) return body, status, headers_dict (*)
55. Explanation: A 3-tuple (body, status, headers_dict) tells Flask to assemble a Response with the given status and headers.
56. Q9: Which statement about passing request to a thread is correct?
57. A) It raises RuntimeError because the request context is thread-local (*)
58. B) It's safe; request is global
59. C) It works only with from_request=True
60. D) It works only on Linux
61. Explanation: request is a thread-local proxy; a background thread has no active request context, so accessing request raises RuntimeError. Copy needed values into a plain dict first.
62. Q10: Which function returns a Response for a file on disk?
63. A) open_file
64. B) send_file (*)
65. C) serve_file
66. D) static_file
67. Explanation: send_file(path_or_fp) streams a file; send_from_directory(folder, name) is the safer variant that prevents path traversal.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What kind of object is request in Flask?
  options:
    - A LocalProxy bound to the current request context
    - A global singleton
    - A class attribute of Flask
    - A WSGI environ dict
  correctIndex: 0
  explanation: request is a werkzeug.local.LocalProxy that forwards attribute access to the request object bound to the active request context, making it thread-safe.
- id: q2
  question: Which attribute holds parsed query string parameters?
  options:
    - request.body
    - request.args
    - request.form
    - request.query
  correctIndex: 1
  explanation: request.args is a MultiDict of parsed query string params (?q=...&page=...); request.form holds POST body fields.
- id: q3
  question: Which function returns a JSON Response with the right Content-Type?
  options:
    - json.dumps
    - render_json
    - jsonify
    - make_json
  correctIndex: 2
  explanation: "jsonify(obj) serializes to JSON and sets Content-Type: application/json; in Flask 1.1+ returning a bare dict also auto-jsonifies."
- id: q4
  question: How do you set a custom header on a response?
  options:
    - resp.set_header('X-Foo', 'bar')
    - resp.add_header('X-Foo', 'bar')
    - resp['X-Foo'] = 'bar'
    - resp.headers['X-Foo'] = 'bar'
  correctIndex: 3
  explanation: Access resp.headers (a Headers dict) and assign; or return (body, status, headers_dict) from the view.
- id: q5
  question: What does abort(404, description='not found') do?
  options:
    - Raises werkzeug.exceptions.NotFound which Flask converts to a 404 response
    - Returns a 404 response directly
    - Logs the error and continues
    - Sends a 500 response
  correctIndex: 0
  explanation: abort() raises an HTTPException subclass; Flask catches it and renders the matching response, overridable via @app.errorhandler(404).
- id: q6
  question: Which is the safe way to parse a JSON body that may be missing?
  options:
    - request.json()
    - request.get_json(silent=True)
    - request.data.decode()
    - request.json
  correctIndex: 1
  explanation: get_json(silent=True) returns None instead of raising 400; pair with `or {}` to default the shape.
- id: q7
  question: What does request.data contain?
  options:
    - Parsed form fields
    - Parsed JSON as a dict
    - The raw request body as bytes
    - The query string as a dict
  correctIndex: 2
  explanation: request.data is the unparsed body as bytes; for JSON use get_json(), for forms use request.form, for args use request.args.
- id: q8
  question: Which return form sets a status code and headers together?
  options:
    - return body.with_status(201)
    - return {body, status, headers}
    - return [body, status, headers]
    - return body, status, headers_dict
  correctIndex: 3
  explanation: A 3-tuple (body, status, headers_dict) tells Flask to assemble a Response with the given status and headers.
- id: q9
  question: Which statement about passing request to a thread is correct?
  options:
    - It raises RuntimeError because the request context is thread-local
    - It's safe; request is global
    - It works only with from_request=True
    - It works only on Linux
  correctIndex: 0
  explanation: request is a thread-local proxy; a background thread has no active request context, so accessing request raises RuntimeError. Copy needed values into a plain dict first.
- id: q10
  question: Which function returns a Response for a file on disk?
  options:
    - open_file
    - send_file
    - serve_file
    - static_file
  correctIndex: 1
  explanation: send_file(path_or_fp) streams a file; send_from_directory(folder, name) is the safer variant that prevents path traversal.
```

