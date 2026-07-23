---
slug: flask-cookies-sessions-flash-messages
id: flask-06
track: flask
order: 6
title: Cookies, Sessions, and Flash Messages
description: Read and set cookies, use Flask's signed-cookie session, configure session lifetime and security flags, and emit one-time flash messages between requests.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=180s
whyItMatters: Read and set cookies, use Flask's signed-cookie session, configure session lifetime and security flags, and emit one-time flash messages between requests.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Cookies, Sessions, and Flash Messages

## Cookies, Sessions, and Flash Messages

### Why It Matters

Read and set cookies, use Flask's signed-cookie session, configure session lifetime and security flags, and emit one-time flash messages between requests.

Read and set cookies, use Flask's signed-cookie session, configure session lifetime and security flags, and emit one-time flash messages between requests.

### Prerequisites

- Stage 5: Request and Response Objects
- Conceptual understanding of cookies, SameSite, and signed cookies.

### Topics

- request.cookies (read) and response.set_cookie (write)
- The session proxy: a signed-cookie dict
- SECRET_KEY and why sessions break without it
- session.permanent, PERMANENT_SESSION_LIFETIME, and refresh
- Cookie flags: Secure, HttpOnly, SameSite=Strict/Lax/None
- SESSION_COOKIE_NAME, SESSION_COOKIE_HTTPONLY, SESSION_COOKIE_SAMESITE
- flash(message, category) and get_flashed_messages(with_categories=True)
- Server-side sessions with Flask-Session (Redis/Filesystem) at scale

### Key Concepts

- Flask sessions are signed cookies: the data lives in the browser, the signature (HMAC) prevents tampering, but anyone can read the contents.
- SECRET_KEY must be a long random value; rotate it carefully (old sessions become invalid) and never commit it to git.
- flash() stores a message in session['_flashes']; get_flashed_messages() pops it on the next request, so flashes are one-shot.
- Default cookies are HttpOnly=True and SameSite=Lax in modern Flask; flip Secure=True in production (requires HTTPS).
- Server-side sessions (Flask-Session) move the data to Redis/DB and store only a session id in the cookie — needed when session data exceeds cookie size (4KB).

```python
from flask import Flask, request, make_response
app = Flask(__name__)

@app.get("/set-pref")
def set_pref():
    resp = make_response("pref set")
    # 90-day cookie, Secure + HttpOnly + SameSite=Lax
    resp.set_cookie("theme", "dark", max_age=60*60*24*90,
                    secure=True, httponly=True, samesite="Lax")
    return resp

@app.get("/pref")
def pref():
    return f"theme={request.cookies.get('theme', 'light')}"
```
Caption: Reading and setting cookies

### Common Pitfalls

- Leaving SECRET_KEY unset or defaulting to 'dev' — Sessions raise RuntimeError without a SECRET_KEY; in production generate one with `secrets.token_urlsafe(64)` and load it from env (never commit).
- Storing large data in session — Flask sessions are signed cookies limited to ~4KB; for carts or large prefs use server-side sessions (Flask-Session + Redis) and store only an id in the cookie.
- Forgetting Secure=True on session cookies in production — Without Secure, the cookie is sent over HTTP and can be sniffed; set SESSION_COOKIE_SECURE=True (and SESSION_COOKIE_SAMESITE='Lax') in production config.
- Treating session data as encrypted — It's signed, not encrypted — anyone can base64-decode the cookie and read the contents. Don't store secrets like API tokens or PII in it.
- Using flash() without redirecting — Flashes live in session['_flashes'] and are popped on the next request; if you flash and render in the same request, get_flashed_messages returns empty unless you call it first.

### Real-World Applications

- Pinterest's early Flask services used signed-cookie sessions for non-critical UI state (theme, locale) before moving sensitive state to server-side sessions in Redis.
- Lyft's internal admin Flask apps use server-side sessions (Redis-backed) so operators can be force-logged-out by deleting a server-side key.
- Twilio's console mixes short-lived signed cookies for OAuth state with server-side sessions for the authenticated session.
- Patreon's marketing Flask site uses signed cookies for the 'logged-out cart' pattern before pushing the user to the main app for checkout.

### Interview Questions

- 1. What's the difference between a cookie and a Flask session? — A cookie is a key/value string the browser stores; Flask's session is a signed-cookie dict — the data is base64-encoded and HMAC-signed so it can't be tampered with.
- 2. Why is SECRET_KEY required for sessions? — Sessions are signed with HMAC-SHA1 using SECRET_KEY; without it Flask can't sign or verify and raises RuntimeError.
- 3. Are Flask session cookies encrypted? — No — they're signed, not encrypted. The contents are readable by anyone with the cookie; don't put secrets or PII there.
- 4. What does flash() do that session['msg']='x' doesn't? — flash() stores the message in session['_flashes']; get_flashed_messages pops it on the next render, making flashes one-shot and self-cleaning.
- 5. When should you switch to Flask-Session (server-side)? — When session data exceeds ~4KB (cookie size limit), when you need to invalidate sessions server-side, or when you want to store sensitive data on the server and only an id in the cookie.

### Mini Project

Build a Theme Switcher with Flash: A Flask app that stores the user's
theme preference in a cookie for 30 days and flashes a confirmation
after they change it. Suggested approach:
  - Set SECRET_KEY from env
  - /set-theme/<theme> sets the 'theme' cookie and flashes 'Theme updated'
  - Redirect to / which renders the theme + shows flash messages
  - Make the cookie Secure+HttpOnly+SameSite=Lax (in a real HTTPS deploy)
  - Add a /logout that clears the cookie via resp.delete_cookie

### Exercises

1. Set a 'theme' cookie via response.set_cookie and read it back via request.cookies.get.
2. Configure app.secret_key from os.environ and store user_id in session.
3. Set SESSION_COOKIE_SECURE=True and SESSION_COOKIE_SAMESITE='Lax' in a production config.
4. flash('Saved', 'success') and render it in a template with get_flashed_messages(with_categories=True).
5. Install Flask-Session and switch to Redis-backed sessions; verify the cookie is just an id.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What kind of cookie backs Flask's default session?
9. A) Encrypted cookie
10. B) Signed cookie (HMAC, not encrypted) (*)
11. C) Plain-text cookie
12. D) JWT token
13. Explanation: Flask sessions are signed with HMAC-SHA1 using SECRET_KEY. The data is base64-encoded and readable, but tampering invalidates the signature.
14. Q2: What happens if SECRET_KEY is unset and you access session?
15. A) Flask generates a random one
16. B) Sessions silently fail
17. C) Flask raises RuntimeError at runtime (*)
18. D) Flask uses a default key 'dev'
19. Explanation: SECRET_KEY is required; without it Flask raises RuntimeError. Always set it from env in production with `secrets.token_urlsafe(64)`.
20. Q3: What does flash(message, category) do?
21. A) Sends a toast notification
22. B) Logs to app.logger
23. C) Sets a response header
24. D) Stores a one-shot message in session['_flashes'] (*)
25. Explanation: flash() appends to session['_flashes']; get_flashed_messages pops it on the next render, making flashes one-shot.
26. Q4: How do you read flash messages with categories in a template?
27. A) get_flashed_messages(with_categories=True) (*)
28. B) get_flashed_messages()
29. C) session.get_flashed()
30. D) request.flashes
31. Explanation: Pass with_categories=True to get (category, message) tuples; iterate with {% for cat, msg in msgs %}.
32. Q5: Which cookie flag prevents JavaScript from reading the cookie?
33. A) Secure
34. B) HttpOnly (*)
35. C) SameSite=Strict
36. D) Domain
37. Explanation: HttpOnly=True makes the cookie inaccessible to document.cookie, mitigating XSS-driven session theft.
38. Q6: Which SameSite value allows the cookie to be sent on cross-site POSTs?
39. A) Strict
40. B) Lax
41. C) None (with Secure=True) (*)
42. D) Off
43. Explanation: SameSite=None; Secure=True is the only combination that allows cross-site cookies (e.g. third-party embeds); modern browsers reject None without Secure.
44. Q7: What's the practical size limit for Flask's signed-cookie session?
45. A) 16KB
46. B) 1MB
47. C) Unlimited
48. D) 4KB (browser cookie limit) (*)
49. Explanation: Browsers cap cookies near 4KB; for larger session data use server-side sessions (Flask-Session + Redis) and store only an id in the cookie.
50. Q8: Which config key sets the session cookie's lifetime when session.permanent=True?
51. A) PERMANENT_SESSION_LIFETIME (*)
52. B) SESSION_LIFETIME
53. C) COOKIE_AGE
54. D) SESSION_TIMEOUT
55. Explanation: PERMANENT_SESSION_LIFETIME is a timedelta; it applies only when session.permanent=True is set.
56. Q9: Why is treating session data as encrypted a mistake?
57. A) Sessions don't exist in Flask
58. B) Sessions are signed, not encrypted — anyone can base64-decode and read the contents (*)
59. C) Flask encrypts sessions by default
60. D) Sessions are stored in the database
61. Explanation: Flask sessions are signed (HMAC) but not encrypted; the data is readable. Never store secrets, PII, or tokens in the session cookie.
62. Q10: Which extension moves session data to the server side?
63. A) Flask-Cache
64. B) Flask-Login
65. C) Flask-Session (*)
66. D) Flask-WTF
67. Explanation: Flask-Session stores session data server-side (Redis, filesystem, Memcached) and keeps only a session id in the cookie.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What kind of cookie backs Flask's default session?
  options:
    - Encrypted cookie
    - Signed cookie (HMAC, not encrypted)
    - Plain-text cookie
    - JWT token
  correctIndex: 1
  explanation: Flask sessions are signed with HMAC-SHA1 using SECRET_KEY. The data is base64-encoded and readable, but tampering invalidates the signature.
- id: q2
  question: What happens if SECRET_KEY is unset and you access session?
  options:
    - Flask generates a random one
    - Sessions silently fail
    - Flask raises RuntimeError at runtime
    - Flask uses a default key 'dev'
  correctIndex: 2
  explanation: SECRET_KEY is required; without it Flask raises RuntimeError. Always set it from env in production with `secrets.token_urlsafe(64)`.
- id: q3
  question: What does flash(message, category) do?
  options:
    - Sends a toast notification
    - Logs to app.logger
    - Sets a response header
    - Stores a one-shot message in session['_flashes']
  correctIndex: 3
  explanation: flash() appends to session['_flashes']; get_flashed_messages pops it on the next render, making flashes one-shot.
- id: q4
  question: How do you read flash messages with categories in a template?
  options:
    - get_flashed_messages(with_categories=True)
    - get_flashed_messages()
    - session.get_flashed()
    - request.flashes
  correctIndex: 0
  explanation: Pass with_categories=True to get (category, message) tuples; iterate with {% for cat, msg in msgs %}.
- id: q5
  question: Which cookie flag prevents JavaScript from reading the cookie?
  options:
    - Secure
    - HttpOnly
    - SameSite=Strict
    - Domain
  correctIndex: 1
  explanation: HttpOnly=True makes the cookie inaccessible to document.cookie, mitigating XSS-driven session theft.
- id: q6
  question: Which SameSite value allows the cookie to be sent on cross-site POSTs?
  options:
    - Strict
    - Lax
    - None (with Secure=True)
    - Off
  correctIndex: 2
  explanation: SameSite=None; Secure=True is the only combination that allows cross-site cookies (e.g. third-party embeds); modern browsers reject None without Secure.
- id: q7
  question: What's the practical size limit for Flask's signed-cookie session?
  options:
    - 16KB
    - 1MB
    - Unlimited
    - 4KB (browser cookie limit)
  correctIndex: 3
  explanation: Browsers cap cookies near 4KB; for larger session data use server-side sessions (Flask-Session + Redis) and store only an id in the cookie.
- id: q8
  question: Which config key sets the session cookie's lifetime when session.permanent=True?
  options:
    - PERMANENT_SESSION_LIFETIME
    - SESSION_LIFETIME
    - COOKIE_AGE
    - SESSION_TIMEOUT
  correctIndex: 0
  explanation: PERMANENT_SESSION_LIFETIME is a timedelta; it applies only when session.permanent=True is set.
- id: q9
  question: Why is treating session data as encrypted a mistake?
  options:
    - Sessions don't exist in Flask
    - Sessions are signed, not encrypted — anyone can base64-decode and read the contents
    - Flask encrypts sessions by default
    - Sessions are stored in the database
    - but not encrypted; the data is readable. Never store secrets, PII, or tokens in the session cookie.
  correctIndex: 1
  explanation: Flask sessions are signed (HMAC) but not encrypted; the data is readable. Never store secrets, PII, or tokens in the session cookie.
- id: q10
  question: Which extension moves session data to the server side?
  options:
    - Flask-Cache
    - Flask-Login
    - Flask-Session
    - Flask-WTF
  correctIndex: 2
  explanation: Flask-Session stores session data server-side (Redis, filesystem, Memcached) and keeps only a session id in the cookie.
```

