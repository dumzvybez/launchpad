---
slug: django-sessions-cookies-middleware
id: django-09
track: django
order: 9
title: Sessions, Cookies, and Middleware
description: Use Django's session framework, set signed cookies, and write custom middleware for cross-cutting concerns like request logging, A/B testing, and tenant resolution.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=360s
whyItMatters: Use Django's session framework, set signed cookies, and write custom middleware for cross-cutting concerns like request logging, A/B testing, and tenant resolution.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Sessions, Cookies, and Middleware

## Sessions, Cookies, and Middleware

### Why It Matters

Use Django's session framework, set signed cookies, and write custom middleware for cross-cutting concerns like request logging, A/B testing, and tenant resolution.

Use Django's session framework, set signed cookies, and write custom middleware for cross-cutting concerns like request logging, A/B testing, and tenant resolution.

### Prerequisites

- Stage 2 (URLs/Views), Stage 8 (Auth)
- Comfort with HTTP cookies and session concepts.

### Topics

- Session backends: db, cache, file, signed_cookies
- SESSION_ENGINE, SESSION_COOKIE_AGE, SESSION_EXPIRE_AT_BROWSER_CLOSE
- Setting/reading session values: request.session["key"]
- Signed cookies: set_signed_cookie, get_signed_cookie
- Middleware anatomy: __init__, __call__
- Sync vs async middleware
- process_request, process_view, process_response, process_template_response, process_exception
- Middleware ordering rules and common gotchas

### Key Concepts

- Sessions are server-side state keyed by a session ID stored in a cookie.
- `request.session` is a SessionStore dict-like; changes are saved at response time.
- Cookies are client-side; signed cookies can't be tampered with but can be read.
- Middleware wraps EVERY request — order in MIDDLEWARE matters (e.g., AuthenticationMiddleware must come before SessionMiddleware... actually the reverse).
- New-style middleware is a callable class with __call__(request); old hooks (process_request, etc.) are deprecated but supported.

```python
# shop/views.py
def add_to_cart(request, product_id):
    cart = request.session.get("cart", {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + 1
    request.session["cart"] = cart
    request.session.modified = True  # needed for nested-dict mutations
    return redirect("cart")

def cart_view(request):
    cart = request.session.get("cart", {})
    return render(request, "shop/cart.html", {"cart": cart})
```
Caption: Reading and writing session

### Common Pitfalls

- Mutating a nested session dict without setting `request.session.modified = True` — Django can't detect deep mutations; the change is silently lost.
- Wrong middleware order — SessionMiddleware must come before AuthenticationMiddleware (auth reads session); CsrfViewMiddleware must come after SessionMiddleware but before auth.
- Storing unserializable objects in the session (lambdas, file handles) — sessions are pickled/JSON-encoded; use plain dicts and primitives.
- Putting secret data in cookies without signing — unsigned cookies are user-editable; always use set_signed_cookie or store server-side in session.
- Heavy work in middleware on every request — middleware runs for EVERY URL including /static/; use a separate path or move logic to a view decorator.

### Real-World Applications

- Disqus uses custom middleware to attach the visitor's "disqus_id" cookie and resolve the active forum based on the host header.
- Mozilla uses middleware for locale detection and for injecting the FXA SSO context into every request.
- Eventbrite uses tenant-resolution middleware that picks the organizer's subdomain and sets request.tenant.
- Shopify's Django-based admin uses middleware to set CSP headers and to attach the shop context per request.

### Interview Questions

- 1. What's the difference between sessions and cookies? — Sessions are server-side state keyed by a session ID; cookies are client-side. The session ID travels in a cookie.
- 2. Which session backend is fastest? — cache (Redis/Memcached), then db. signed_cookies is fastest but limited to ~4KB and exposes data to the client (signed, not encrypted).
- 3. Why does middleware ordering matter? — process_request runs top-down, process_response runs bottom-up; the first-listed middleware "wraps" everything below it.
- 4. How do you signal Django that a session mutation happened? — Either reassign request.session["key"] = new_value, or set request.session.modified = True for in-place mutations.
- 5. What's the difference between new-style and old-style middleware? — New-style uses __call__(request); old-style had process_request/process_response hooks (deprecated in 1.10, removed in 2.0).

### Mini Project

Build an A/B Testing Middleware: A middleware that picks a variant ("A" or "B") for each new visitor, stores it in a signed cookie `ab_variant`, and exposes `request.ab_variant` for views to branch on. Add a context processor so templates can show the variant. Suggested approach:
  - Middleware: if no cookie, randomly assign; set signed cookie (1 year)
  - Set `request.ab_variant = request.get_signed_cookie("ab_variant")`
  - Context processor: `return {"ab_variant": getattr(request, "ab_variant", "A")}`
  - Add a `/` view that renders different headlines per variant
  - Add a /stats/ endpoint that shows the count of A vs B visitors (use a simple in-memory counter for demo)

### Exercises

1. Store a "preferred_language" in the session and read it in a view.
2. Write a middleware that adds a custom X-Request-ID header to every response.
3. Convert it to async-capable with sync_capable=True.
4. Use set_signed_cookie to store a "referral" code; verify tampering raises BadSignature.
5. Add a context processor that exposes the user's cart count in every template.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does Django store in the session cookie?
9. A) Just the session ID; data lives server-side (*)
10. B) The full session data
11. C) The user's password hash
12. D) The CSRF token only
13. Explanation: The session cookie (sessionid) contains only the session key. Actual data lives in the DB, cache, or file (per SESSION_ENGINE). signed_cookies is the exception.
14. Q2: Which must come first in MIDDLEWARE?
15. A) AuthenticationMiddleware
16. B) SessionMiddleware (*)
17. C) CsrfViewMiddleware
18. D) Order doesn't matter
19. Explanation: SessionMiddleware must run before AuthenticationMiddleware (which reads request.session to find the user). CsrfViewMiddleware uses session too — order matters.
20. Q3: How do you ensure a mutated nested session dict gets saved?
21. A) Call request.session.save() explicitly
22. B) Re-assign the whole session
23. C) Set request.session.modified = True (*)
24. D) Both B and C work
25. Explanation: Django can't detect in-place mutations of nested values. Setting modified=True forces a save. Re-assigning request.session["x"] = newdict also marks it modified.
26. Q4: Which session engine doesn't require server-side storage?
27. A) db
28. B) cache
29. C) file
30. D) signed_cookies (*)
31. Explanation: signed_cookies stores the data in the cookie itself (signed with SECRET_KEY). Limited to ~4KB and readable by the client (not encrypted).
32. Q5: What method does new-style middleware implement?
33. A) __call__ (*)
34. B) process_request
35. C) handle_request
36. D) dispatch
37. Explanation: New-style middleware is a class with __init__(self, get_response) and __call__(self, request). Old hooks (process_request, etc.) are removed in 2.0+.
38. Q6: What happens when get_signed_cookie detects tampering?
39. A) Returns the original value
40. B) Raises django.core.signing.BadSignature (*)
41. C) Returns the default
42. D) Logs a warning and ignores
43. Explanation: get_signed_cookie raises BadSignature if the signature doesn't match. Pass default=... to suppress and return the default instead.
44. Q7: Where do context processors run?
45. A) Once at startup
46. B) Only in admin
47. C) On every template render, adding to the context (*)
48. D) Only in async views
49. Explanation: Context processors are callables that return a dict merged into the template context. They run per-render; keep them cheap.
50. Q8: Which middleware sets request.user?
51. A) SessionMiddleware
52. B) CommonMiddleware
53. C) SecurityMiddleware
54. D) AuthenticationMiddleware (*)
55. Explanation: AuthenticationMiddleware reads the user ID from the session and attaches request.user (User or AnonymousUser). Requires SessionMiddleware before it.
56. Q9: What's the max safe size of session data with the signed_cookies backend?
57. A) ~4 KB (browser cookie limit) (*)
58. B) 1 KB
59. C) 1 MB
60. D) Unlimited
61. Explanation: Browsers cap cookies at ~4096 bytes. signed_cookies stores the data in the cookie, so it must stay small.
62. Q10: What's a common use case for async middleware?
63. A) Faster CPU-bound work
64. B) Non-blocking I/O like fetching from Redis or an external API without blocking the event loop (*)
65. C) Replacing all sync middleware
66. D) There's no difference from sync middleware
67. Explanation: Async middleware lets the request flow through async views and Channels without being forced into a sync thread. Use it for I/O; CPU-bound work should still be offloaded.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does Django store in the session cookie?
  options:
    - Just the session ID; data lives server-side
    - The full session data
    - The user's password hash
    - The CSRF token only
    - . signed_cookies is the exception.
  correctIndex: 0
  explanation: The session cookie (sessionid) contains only the session key. Actual data lives in the DB, cache, or file (per SESSION_ENGINE). signed_cookies is the exception.
- id: q2
  question: Which must come first in MIDDLEWARE?
  options:
    - AuthenticationMiddleware
    - SessionMiddleware
    - CsrfViewMiddleware
    - Order doesn't matter
  correctIndex: 1
  explanation: SessionMiddleware must run before AuthenticationMiddleware (which reads request.session to find the user). CsrfViewMiddleware uses session too — order matters.
- id: q3
  question: How do you ensure a mutated nested session dict gets saved?
  options:
    - Call request.session.save() explicitly
    - Re-assign the whole session
    - Set request.session.modified = True
    - Both B and C work
  correctIndex: 2
  explanation: Django can't detect in-place mutations of nested values. Setting modified=True forces a save. Re-assigning request.session["x"] = newdict also marks it modified.
- id: q4
  question: Which session engine doesn't require server-side storage?
  options:
    - db
    - cache
    - file
    - signed_cookies
    - . Limited to ~4KB and readable by the client (not encrypted).
  correctIndex: 3
  explanation: signed_cookies stores the data in the cookie itself (signed with SECRET_KEY). Limited to ~4KB and readable by the client (not encrypted).
- id: q5
  question: What method does new-style middleware implement?
  options:
    - __call__
    - process_request
    - handle_request
    - dispatch
  correctIndex: 0
  explanation: New-style middleware is a class with __init__(self, get_response) and __call__(self, request). Old hooks (process_request, etc.) are removed in 2.0+.
- id: q6
  question: What happens when get_signed_cookie detects tampering?
  options:
    - Returns the original value
    - Raises django.core.signing.BadSignature
    - Returns the default
    - Logs a warning and ignores
  correctIndex: 1
  explanation: get_signed_cookie raises BadSignature if the signature doesn't match. Pass default=... to suppress and return the default instead.
- id: q7
  question: Where do context processors run?
  options:
    - Once at startup
    - Only in admin
    - On every template render, adding to the context
    - Only in async views
  correctIndex: 2
  explanation: Context processors are callables that return a dict merged into the template context. They run per-render; keep them cheap.
- id: q8
  question: Which middleware sets request.user?
  options:
    - SessionMiddleware
    - CommonMiddleware
    - SecurityMiddleware
    - AuthenticationMiddleware
  correctIndex: 3
  explanation: AuthenticationMiddleware reads the user ID from the session and attaches request.user (User or AnonymousUser). Requires SessionMiddleware before it.
- id: q9
  question: What's the max safe size of session data with the signed_cookies backend?
  options:
    - ~4 KB (browser cookie limit)
    - 1 KB
    - 1 MB
    - Unlimited
  correctIndex: 0
  explanation: Browsers cap cookies at ~4096 bytes. signed_cookies stores the data in the cookie, so it must stay small.
- id: q10
  question: What's a common use case for async middleware?
  options:
    - Faster CPU-bound work
    - Non-blocking I/O like fetching from Redis or an external API without blocking the event loop
    - Replacing all sync middleware
    - There's no difference from sync middleware
  correctIndex: 1
  explanation: Async middleware lets the request flow through async views and Channels without being forced into a sync thread. Use it for I/O; CPU-bound work should still be offloaded.
```

