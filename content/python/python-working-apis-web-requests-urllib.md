---
slug: python-working-apis-web-requests-urllib
id: python-14
track: python
order: 14
title: Working with APIs and the Web (requests + urllib)
description: Consume REST APIs with the requests library and the stdlib urllib, handle JSON, set timeouts, use sessions for connection pooling, and avoid the most common HTTP-in-Python pitfalls.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=15500s
whyItMatters: Consume REST APIs with the requests library and the stdlib urllib, handle JSON, set timeouts, use sessions for connection pooling, and avoid the most common HTTP-in-Python pitfalls.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Working with APIs and the Web (requests + urllib)

## Working with APIs and the Web (requests + urllib)

### Why It Matters

Consume REST APIs with the requests library and the stdlib urllib, handle JSON, set timeouts, use sessions for connection pooling, and avoid the most common HTTP-in-Python pitfalls.

Consume REST APIs with the requests library and the stdlib urllib, handle JSON, set timeouts, use sessions for connection pooling, and avoid the most common HTTP-in-Python pitfalls.

### Prerequisites

- Stage 13: Modules, Packages, and the Standard Library
- Stage 11: File I/O and Context Managers (for JSON files).

### Topics

- HTTP verbs: GET, POST, PUT, PATCH, DELETE
- The requests library: get, post, json(), headers, params
- urllib.request as stdlib-only fallback
- Status codes and response.raise_for_status()
- Timeouts (always set one!)
- Sessions for connection pooling and cookie persistence
- Authentication (basic, bearer token)
- Pagination handling (cursor, offset, link headers)
- Rate limiting and exponential backoff
- Streaming large responses

### Key Concepts

- HTTP is request-response; each verb has a semantic meaning (GET reads, POST creates, etc.).
- ALWAYS pass a timeout to requests — otherwise a hung server hangs your program forever.
- Sessions reuse TCP connections (keep-alive) for performance on repeated calls to the same host.
- 2xx = success, 3xx = redirect, 4xx = client error, 5xx = server error.
- response.json() parses JSON; response.text gives the raw string; response.content gives bytes.

```python
import requests

# GET with query params
resp = requests.get(
    "https://api.github.com/users/torvalds",
    params={"per_page": 5},
    timeout=10,   # ALWAYS set a timeout!
)
resp.raise_for_status()   # raises HTTPError on 4xx/5xx
data = resp.json()
print(data["login"])

# POST with JSON body
resp = requests.post(
    "https://httpbin.org/post",
    json={"name": "Ada", "age": 36},   # auto-serializes + sets content-type
    headers={"Authorization": "Bearer xyz"},
    timeout=10,
)
print(resp.json())
```
Caption: Basic GET and POST

### Common Pitfalls

- No timeout — `requests.get(url)` hangs forever if the server doesn't respond; always pass timeout=.
- Not checking status codes — `r.json()` parses the body even on 500 errors; call `r.raise_for_status()` first.
- Leaking secrets in URLs — auth tokens in query strings get logged by proxies; use headers instead.
- Not using sessions for repeated calls — every call opens a new TCP+TLS connection; sessions reuse them.
- Building URLs by string concatenation — use `params=` (requests) or `urlencode` (urllib) to handle escaping.

### Real-World Applications

- Stripe's Python SDK wraps the Stripe REST API with requests and exponential backoff.
- GitHub's PyGithub library uses requests sessions to pool connections for API pagination.
- Slack's Python SDK uses requests with sessions and rate-limit-aware retry.
- Spotify's API client uses requests with bearer-token auth and offset pagination for track listings.

### Interview Questions

- 1. Why must you set a timeout on HTTP calls? — Without it, a slow/hung server blocks your program indefinitely; always pass timeout=.
- 2. What's the benefit of requests.Session? — Reuses TCP/TLS connections (faster), persists cookies, lets you set default headers.
- 3. What does raise_for_status() do? — Raises HTTPError if status is 4xx or 5xx; otherwise returns None.
- 4. How do you send JSON in a POST? — Use `requests.post(url, json={...})` — it auto-serializes and sets Content-Type.
- 5. What's the difference between requests and urllib? — requests is a third-party lib with a friendlier API; urllib is in the stdlib (no install needed) but more verbose.

### Mini Project

Build a GitHub Issue Fetcher: A CLI that fetches all open issues from a GitHub repo and exports them as JSON or CSV. Suggested approach:
  - Use requests.Session with a User-Agent and Authorization header
  - Paginate via the "Link" header (rel="next")
  - Always set timeout=10 and use raise_for_status
  - Add retry with exponential backoff on 429/5xx
  - Export to JSON or CSV based on a --format flag

### Exercises

1. GET https://httpbin.org/get with params={"name": "Ada"} and print the JSON.
2. POST JSON to https://httpbin.org/post and verify the response echoes it back.
3. Use a Session to make 10 sequential requests and compare timing to without-session.
4. Implement pagination by following the "next" link in JSON responses.
5. Add retry with exponential backoff on 429 Too Many Requests.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens if you call `requests.get(url)` with no timeout?
9. A) Default timeout of 30s applies
10. B) It can hang forever if the server doesn't respond (*)
11. C) Default timeout of 5s applies
12. D) It raises MissingTimeoutError
13. Explanation: Without timeout=, requests waits indefinitely; always pass timeout= to bound the wait.
14. Q2: What does response.raise_for_status() do?
15. A) Returns the status code
16. B) Logs the status
17. C) Always raises
18. D) Raises HTTPError if status is 4xx or 5xx; otherwise None (*)
19. Explanation: raise_for_status() is the canonical way to fail fast on HTTP errors; without it, you might parse a 500 error page as JSON.
20. Q3: What's the benefit of requests.Session?
21. A) Encrypts requests
22. B) Required for HTTPS
23. C) Reuses TCP connections, persists cookies, sets default headers (*)
24. D) Auto-retries all failures
25. Explanation: Sessions pool connections (faster), persist cookies across calls, and let you set headers/auth once for all requests.
26. Q4: Which argument auto-serializes a dict to JSON in requests.post?
27. A) json= (*)
28. B) data=
29. C) body=
30. D) payload=
31. Explanation: json={...} serializes the dict to JSON and sets Content-Type: application/json automatically.
32. Q5: Which is the stdlib-only HTTP module?
33. A) requests
34. B) urllib.request (*)
35. C) httpx
36. D) aiohttp
37. Explanation: urllib (urllib.request, urllib.parse) is in the standard library; requests, httpx, and aiohttp are third-party.
38. Q6: What's wrong with `?token=secret` in a URL?
39. A) It's fine — same as headers
40. B) Tokens must be base64-encoded
41. C) URLs can't contain query strings
42. D) Tokens in URLs get logged by proxies and servers — use headers (*)
43. Explanation: URLs (including query strings) are logged by web servers, proxies, and CDNs; pass secrets in Authorization headers instead.
44. Q7: How does requests handle a 3xx redirect by default?
45. A) Raises an error
46. B) Returns the 3xx response without following
47. C) Follows it automatically (up to a limit) (*)
48. D) Logs and stops
49. Explanation: requests follows redirects by default (allow_redirects=True); set allow_redirects=False to disable.
50. Q8: What's the recommended way to handle rate limiting (HTTP 429)?
51. A) Exponential backoff with jitter, respecting Retry-After header (*)
52. B) Retry immediately
53. C) Give up after one try
54. D) Open a new connection
55. Explanation: Honor the Retry-After header (or back off exponentially with jitter) to avoid hammering the API and getting banned.
56. Q9: Which HTTP verb is idempotent (same effect if called multiple times)?
57. A) POST
58. B) GET and PUT (*)
59. C) Only POST
60. D) PATCH
61. Explanation: GET (read) and PUT (replace) are idempotent; POST (create) is not — calling it twice creates two resources.
62. Q10: What's the difference between response.text and response.content?
63. A) Same thing
64. B) .text is JSON; .content is text
65. C) .text is bytes; .content is str
66. D) .text is str (decoded); .content is bytes (raw) (*)
67. Explanation: .content is the raw bytes; .text is the decoded str using the response's encoding. Use .content for binary, .text for text, .json() for JSON.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens if you call `requests.get(url)` with no timeout?
  options:
    - Default timeout of 30s applies
    - It can hang forever if the server doesn't respond
    - Default timeout of 5s applies
    - It raises MissingTimeoutError
  correctIndex: 1
  explanation: Without timeout=, requests waits indefinitely; always pass timeout= to bound the wait.
- id: q2
  question: What does response.raise_for_status() do?
  options:
    - Returns the status code
    - Logs the status
    - Always raises
    - Raises HTTPError if status is 4xx or 5xx; otherwise None
  correctIndex: 3
  explanation: raise_for_status() is the canonical way to fail fast on HTTP errors; without it, you might parse a 500 error page as JSON.
- id: q3
  question: What's the benefit of requests.Session?
  options:
    - Encrypts requests
    - Required for HTTPS
    - Reuses TCP connections, persists cookies, sets default headers
    - Auto-retries all failures
  correctIndex: 2
  explanation: Sessions pool connections (faster), persist cookies across calls, and let you set headers/auth once for all requests.
- id: q4
  question: Which argument auto-serializes a dict to JSON in requests.post?
  options:
    - json=
    - data=
    - body=
    - payload=
  correctIndex: 0
  explanation: "json={...} serializes the dict to JSON and sets Content-Type: application/json automatically."
- id: q5
  question: Which is the stdlib-only HTTP module?
  options:
    - requests
    - urllib.request
    - httpx
    - aiohttp
  correctIndex: 1
  explanation: urllib (urllib.request, urllib.parse) is in the standard library; requests, httpx, and aiohttp are third-party.
- id: q6
  question: What's wrong with `?token=secret` in a URL?
  options:
    - It's fine — same as headers
    - Tokens must be base64-encoded
    - URLs can't contain query strings
    - Tokens in URLs get logged by proxies and servers — use headers
  correctIndex: 3
  explanation: URLs (including query strings) are logged by web servers, proxies, and CDNs; pass secrets in Authorization headers instead.
- id: q7
  question: How does requests handle a 3xx redirect by default?
  options:
    - Raises an error
    - Returns the 3xx response without following
    - Follows it automatically (up to a limit)
    - Logs and stops
  correctIndex: 2
  explanation: requests follows redirects by default (allow_redirects=True); set allow_redirects=False to disable.
- id: q8
  question: What's the recommended way to handle rate limiting (HTTP 429)?
  options:
    - Exponential backoff with jitter, respecting Retry-After header
    - Retry immediately
    - Give up after one try
    - Open a new connection
  correctIndex: 0
  explanation: Honor the Retry-After header (or back off exponentially with jitter) to avoid hammering the API and getting banned.
- id: q9
  question: Which HTTP verb is idempotent (same effect if called multiple times)?
  options:
    - POST
    - GET and PUT
    - Only POST
    - PATCH
  correctIndex: 1
  explanation: GET (read) and PUT (replace) are idempotent; POST (create) is not — calling it twice creates two resources.
- id: q10
  question: What's the difference between response.text and response.content?
  options:
    - Same thing
    - .text is JSON; .content is text
    - .text is bytes; .content is str
    - .text is str (decoded); .content is bytes (raw)
  correctIndex: 3
  explanation: .content is the raw bytes; .text is the decoded str using the response's encoding. Use .content for binary, .text for text, .json() for JSON.
```

