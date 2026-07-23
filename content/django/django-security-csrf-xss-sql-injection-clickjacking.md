---
slug: django-security-csrf-xss-sql-injection-clickjacking
id: django-16
track: django
order: 16
title: Security — CSRF, XSS, SQL Injection, Clickjacking
description: "Lock down Django against the OWASP Top 10: CSRF, XSS, SQL injection, clickjacking, insecure deserialization, and security headers. Learn the built-in protections and where they fall short."
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=780s
whyItMatters: "Lock down Django against the OWASP Top 10: CSRF, XSS, SQL injection, clickjacking, insecure deserialization, and security headers. Learn the built-in protections and where they fall short."
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Security — CSRF, XSS, SQL Injection, Clickjacking

## Security — CSRF, XSS, SQL Injection, Clickjacking

### Why It Matters

Lock down Django against the OWASP Top 10: CSRF, XSS, SQL injection, clickjacking, insecure deserialization, and security headers. Learn the built-in protections and where they fall short.

Lock down Django against the OWASP Top 10: CSRF, XSS, SQL injection, clickjacking, insecure deserialization, and security headers. Learn the built-in protections and where they fall short.

### Prerequisites

- Stage 6 (Forms), Stage 9 (Middleware), Stage 12 (DRF)
- Basic familiarity with OWASP Top 10.

### Topics

- CsrfViewMiddleware and {% csrf_token %}
- Auto-escaping in DTL (XSS protection) and the danger of |safe
- SQL injection: ORM-safe vs raw() and extra()
- XFrameOptionsMiddleware and frame-ancestors CSP
- SecurityMiddleware: HSTS, SSL redirect, referrer policy
- Content Security Policy (CSP) via django-csp
- Clickjacking, MIME sniffing, and SECURE_* settings
- Secret key management, signed cookies, and timing attacks

### Key Concepts

- Django auto-escapes template variables; XSS via templates is rare unless you use |safe or mark_safe on untrusted content.
- The ORM parameterizes queries, so `Post.objects.filter(title=request.GET["x"])` is safe; raw() with f-strings is NOT.
- CSRF protection is automatic for POST forms via middleware + the template tag.
- Clickjacking is mitigated by X-Frame-Options: DENY (default in Django).
- Production checklist: DEBUG=False, ALLOWED_HOSTS, SECURE_SSL_REDIRECT, SECURE_HSTS_SECONDS, CSP_DEFAULT_SRC.

```python
# settings.py (production)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 365  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

X_FRAME_OPTIONS = "DENY"

# django-csp
CSP_DEFAULT_SRC = ("'none'",)
CSP_STYLE_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'",)
CSP_IMG_SRC = ("'self'", "data:", "https:")
CSP_CONNECT_SRC = ("'self'",)
CSP_REPORT_URI = "https://your-collector.report-uri.com/r/t/csp/enforce"
```
Caption: Security settings

### Common Pitfalls

- Using |safe or mark_safe on user content — instant XSS; only mark trusted/generated HTML safe.
- Building SQL with f-strings in raw() or extra() — SQL injection; always use %s placeholders with a params list.
- Setting DEBUG=True in production — leaks stack traces, settings, and source on errors; always False in prod.
- Disabling CsrfViewMiddleware globally — instead, exempt specific webhook endpoints and verify HMAC signatures.
- Not setting SECURE_PROXY_SSL_HEADER behind a TLS-terminating proxy — Django can't tell the request was HTTPS; sessions/cookies leak over HTTP.

### Real-World Applications

- Mozilla's MDN uses django-csp with strict report-only mode and rolls out policies per page template.
- Disqus uses CSP + X-Frame-Options: DENY (their widgets use ALLOW-FROM for embeds).
- Eventbrite uses Django's SECURE_* settings + Cloudflare for DDoS, TLS, and WAF.
- Instagram's web uses strict CSP and `nonce`-based script-src; cookies are SameSite=Strict.

### Interview Questions

- 1. How does Django protect against CSRF? — CsrfViewMiddleware checks that the CSRF token in the POST form matches the cookie; both are signed with SECRET_KEY.
- 2. How does Django protect against XSS in templates? — Auto-escaping converts <, >, &, ', " to entities; you must explicitly mark_safe to disable it.
- 3. When is raw() SQL injection-safe? — When you use %s placeholders and a params list. F-strings or % formatting are unsafe.
- 4. What does X-Frame-Options: DENY do? — Prevents the page from being rendered in an iframe, mitigating clickjacking.
- 5. What's HSTS? — HTTP Strict-Transport-Security tells the browser to only use HTTPS for the next N seconds; prevents SSL-stripping MITM.

### Mini Project

Harden a Django Site: Take a starter project and apply the production security checklist: DEBUG=False, ALLOWED_HOSTS, SECURE_SSL_REDIRECT, HSTS, secure cookies, CSP, X-Frame-Options. Use django-csp in report-only mode first; fix violations, then enforce. Suggested approach:
  - Set DEBUG=False and ALLOWED_HOSTS=["yourdomain.com"]
  - Add SECURE_* settings + cookie flags
  - Install django-csp; start with CSP_REPORT_ONLY=True
  - Fix violations (move inline scripts to nonce-based, tighten script-src)
  - Switch CSP_REPORT_ONLY=False and verify with a CSP evaluator

### Exercises

1. Set X_FRAME_OPTIONS = "DENY" and verify with an iframe test page.
2. Add SECURE_SSL_REDIRECT=True and confirm HTTP redirects to HTTPS.
3. Find one template using |safe; remove it if it touches user input.
4. Write a raw() query with a %s placeholder and a params list.
5. Install django-csp and set CSP_DEFAULT_SRC=("'none'",) for the admin.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which middleware provides CSRF protection?
9. A) SecurityMiddleware
10. B) CommonMiddleware
11. C) SessionMiddleware
12. D) CsrfViewMiddleware (*)
13. Explanation: CsrfViewMiddleware checks the CSRF token on POST/PUT/PATCH/DELETE. The token is in the form (via {% csrf_token %}) and the cookie.
14. Q2: How does Django protect against XSS in templates?
15. A) Auto-escaping converts <, >, &, ', " to HTML entities (*)
16. B) It blocks all HTML
17. C) It uses a sandboxed JS interpreter
18. D) It strips <script> tags
19. Explanation: Auto-escaping is on by default. |safe or mark_safe disables it — only use on trusted content.
20. Q3: Which is SQL-injection-safe?
21. A) raw(f"SELECT * FROM t WHERE x = '{user_input}'")
22. B) raw("SELECT * FROM t WHERE x = %s", [user_input]) (*)
23. C) extra(where=[f"x = '{user_input}'"])
24. D) cursor.execute(f"SELECT * FROM t WHERE x = '{user_input}'")
25. Explanation: %s placeholders with a params list are parameterized. F-strings interpolate user input directly into SQL — classic injection.
26. Q4: What does X-Frame-Options: DENY do?
27. A) Disables JavaScript
28. B) Disables cookies
29. C) Disables iframe rendering entirely on this page (*)
30. D) Forces HTTPS
31. Explanation: X-Frame-Options: DENY (or CSP frame-ancestors 'none') prevents the page from being framed — mitigating clickjacking.
32. Q5: What does SECURE_HSTS_SECONDS do?
33. A) Sets a session timeout
34. B) Sets the cache TTL
35. C) Limits the connection time
36. D) Tells the browser to use HTTPS only for N seconds (Strict-Transport-Security) (*)
37. Explanation: HSTS forces HTTPS for the duration, preventing SSL-stripping attacks. Use a long value (1 year) once you're sure HTTPS works.
38. Q6: Why must DEBUG=False in production?
39. A) It leaks stack traces, settings, and source on errors (*)
40. B) It's slower
41. C) It disables the admin
42. D) It blocks logins
43. Explanation: With DEBUG=True, Django renders a detailed error page including settings and locals — a goldmine for attackers. Always False in prod.
44. Q7: Which is the safest way to handle a webhook endpoint?
45. A) @csrf_exempt with no other checks
46. B) @csrf_exempt + HMAC signature verification (*)
47. C) Disable CsrfViewMiddleware globally
48. D) Use a weak shared secret in the URL
49. Explanation: Webhooks can't send CSRF tokens; exempt from CSRF but verify the request signature with HMAC and a shared secret.
50. Q8: What does SECURE_PROXY_SSL_HEADER do?
51. A) Encrypts the proxy
52. B) Disables TLS
53. C) Tells Django which header to trust to know if the request was HTTPS (behind a TLS-terminating proxy) (*)
54. D) Adds a custom header
55. Explanation: Behind Cloudflare/Nginx, Django sees HTTP. Set SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https") so request.is_secure() works.
56. Q9: What's the danger of |safe on user content?
57. A) It's slow
58. B) It triggers CSRF
59. C) It breaks the cache
60. D) It disables HTML escaping, allowing XSS (*)
61. Explanation: |safe marks content as not-to-be-escaped. If the content is user-supplied, an attacker can inject <script>.
62. Q10: Which library adds Content Security Policy to Django?
63. A) django-csp (*)
64. B) django-security
65. C) django-headers
66. D) django-owasp
67. Explanation: django-csp adds CSP_* settings and a middleware that emits the Content-Security-Policy header. Start with CSP_REPORT_ONLY=True.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which middleware provides CSRF protection?
  options:
    - SecurityMiddleware
    - CommonMiddleware
    - SessionMiddleware
    - CsrfViewMiddleware
  correctIndex: 3
  explanation: CsrfViewMiddleware checks the CSRF token on POST/PUT/PATCH/DELETE. The token is in the form (via {% csrf_token %}) and the cookie.
- id: q2
  question: How does Django protect against XSS in templates?
  options:
    - Auto-escaping converts <, >, &, ', " to HTML entities
    - It blocks all HTML
    - It uses a sandboxed JS interpreter
    - It strips <script> tags
  correctIndex: 0
  explanation: Auto-escaping is on by default. |safe or mark_safe disables it — only use on trusted content.
- id: q3
  question: Which is SQL-injection-safe?
  options:
    - raw(f"SELECT * FROM t WHERE x = '{user_input}'")
    - raw("SELECT * FROM t WHERE x = %s", [user_input])
    - extra(where=[f"x = '{user_input}'"])
    - cursor.execute(f"SELECT * FROM t WHERE x = '{user_input}'")
  correctIndex: 1
  explanation: "%s placeholders with a params list are parameterized. F-strings interpolate user input directly into SQL — classic injection."
- id: q4
  question: "What does X-Frame-Options: DENY do?"
  options:
    - Disables JavaScript
    - Disables cookies
    - Disables iframe rendering entirely on this page
    - Forces HTTPS
  correctIndex: 2
  explanation: "X-Frame-Options: DENY (or CSP frame-ancestors 'none') prevents the page from being framed — mitigating clickjacking."
- id: q5
  question: What does SECURE_HSTS_SECONDS do?
  options:
    - Sets a session timeout
    - Sets the cache TTL
    - Limits the connection time
    - Tells the browser to use HTTPS only for N seconds (Strict-Transport-Security)
  correctIndex: 3
  explanation: HSTS forces HTTPS for the duration, preventing SSL-stripping attacks. Use a long value (1 year) once you're sure HTTPS works.
- id: q6
  question: Why must DEBUG=False in production?
  options:
    - It leaks stack traces, settings, and source on errors
    - It's slower
    - It disables the admin
    - It blocks logins
  correctIndex: 0
  explanation: With DEBUG=True, Django renders a detailed error page including settings and locals — a goldmine for attackers. Always False in prod.
- id: q7
  question: Which is the safest way to handle a webhook endpoint?
  options:
    - "@csrf_exempt with no other checks"
    - "@csrf_exempt + HMAC signature verification"
    - Disable CsrfViewMiddleware globally
    - Use a weak shared secret in the URL
  correctIndex: 1
  explanation: Webhooks can't send CSRF tokens; exempt from CSRF but verify the request signature with HMAC and a shared secret.
- id: q8
  question: What does SECURE_PROXY_SSL_HEADER do?
  options:
    - Encrypts the proxy
    - Disables TLS
    - Tells Django which header to trust to know if the request was HTTPS (behind a TLS-terminating proxy)
    - Adds a custom header
  correctIndex: 2
  explanation: Behind Cloudflare/Nginx, Django sees HTTP. Set SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https") so request.is_secure() works.
- id: q9
  question: What's the danger of |safe on user content?
  options:
    - It's slow
    - It triggers CSRF
    - It breaks the cache
    - It disables HTML escaping, allowing XSS
  correctIndex: 3
  explanation: "|safe marks content as not-to-be-escaped. If the content is user-supplied, an attacker can inject <script>."
- id: q10
  question: Which library adds Content Security Policy to Django?
  options:
    - django-csp
    - django-security
    - django-headers
    - django-owasp
  correctIndex: 0
  explanation: django-csp adds CSP_* settings and a middleware that emits the Content-Security-Policy header. Start with CSP_REPORT_ONLY=True.
```

