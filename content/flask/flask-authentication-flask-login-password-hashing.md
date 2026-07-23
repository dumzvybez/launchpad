---
slug: flask-authentication-flask-login-password-hashing
id: flask-13
track: flask
order: 13
title: Authentication — Flask-Login, password hashing
description: Add login/logout flows with Flask-Login, hash passwords with werkzeug.security, wire a user_loader, gate routes with @login_required, and access the current_user proxy safely.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=600s
whyItMatters: Add login/logout flows with Flask-Login, hash passwords with werkzeug. security, wire a user_loader, gate routes with @login_required, and access the current_user proxy safely.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Authentication — Flask-Login, password hashing

## Authentication — Flask-Login, password hashing

### Why It Matters

Add login/logout flows with Flask-Login, hash passwords with werkzeug. security, wire a user_loader, gate routes with @login_required, and access the current_user proxy safely.

Add login/logout flows with Flask-Login, hash passwords with werkzeug.security, wire a user_loader, gate routes with @login_required, and access the current_user proxy safely.

### Prerequisites

- Stage 12: WTForms and Form Validation
- Stage 10 (SQLAlchemy) for the User model.

### Topics

- Flask-Login: LoginManager, login_user, logout_user, current_user
- user_loader callback: session id -> User
- werkzeug.security.generate_password_hash / check_password_hash
- @login_required on views
- login_view and unauthorized_handler
- session_protection modes: 'basic', 'strong', None
- remember_me cookies and REMEMBER_COOKIE_DURATION
- Common attacks: brute force, session fixation, password reuse

### Key Concepts

- Flask-Login stores the user id in the session; user_loader(id) resolves it to a User object on every request — keep this query fast (cache or indexed PK lookup).
- Passwords are hashed with PBKDF2-HMAC-SHA256 by default (werkzeug); never store plaintext or MD5/SHA1 — they're brute-forceable in seconds.
- @login_required aborts to login_view (default '/login') for anonymous users; customize with @login_manager.unauthorized_handler for JSON APIs to return 401.
- current_user is a LocalProxy to the loaded user (or AnonymousUserMixin); access attributes like current_user.is_authenticated in templates and views.
- session_protection='strong' regenerates the session id if the IP or user agent changes, mitigating session fixation; 'basic' only checks on each request and re-checks identifiers.

```python
# app/models.py
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db, login_manager

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw, method="pbkdf2:sha256", salt_length=16)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))
```
Caption: User model with Flask-Login mixin

### Common Pitfalls

- Storing passwords as plaintext or MD5/SHA1 — Use generate_password_hash (PBKDF2-HMAC-SHA256 by default); MD5/SHA1 are brute-forceable in seconds. Never roll your own crypto.
- Open-redirect via `next` parameter — Always validate `next` starts with '/' and doesn't start with '//'; an attacker can craft ?next=https://evil.com to phish users post-login.
- Forgetting @login_manager.user_loader — Without user_loader, current_user is always AnonymousUserMixin and @login_required redirects forever; the loader must return a User by session id.
- Using session_protection=None in production — None disables session-fixation protection; use 'basic' (default) or 'strong' (regenerate session id on IP/UA change — stricter, can log out mobile users).
- Calling login_user() but forgetting to commit the session — Flask-Login writes to session['user_id']; ensure SECRET_KEY is set so the signed cookie survives the redirect, and don't manually clear session['user_id'].

### Real-World Applications

- Patreon's Flask auth layer uses Flask-Login with 'strong' session protection plus 2FA via TOTP for staff accounts.
- Lyft's admin Flask apps use Flask-Login behind SSO (Okta) with a custom user_loader that resolves Okta SAML assertions to internal User rows.
- Twilio's console uses a custom auth flow but Flask-style password hashing (PBKDF2) for legacy accounts not yet on Authy.
- Netflix's security-automation Flask tools use Flask-Login with SSO + IP allow-lists and session_protection='strong' to mitigate session fixation.

### Interview Questions

- 1. How does Flask-Login remember the user across requests? — It stores user.id in the signed session cookie; the @user_loader callback resolves it to a User object at the start of each request.
- 2. Which werkzeug functions hash and verify passwords? — generate_password_hash(raw, method='pbkdf2:sha256') for hashing; check_password_hash(stored, raw) for verification. Never use MD5/SHA1.
- 3. What does @login_required do? — It aborts to login_manager.login_view for anonymous users; for JSON APIs override with @login_manager.unauthorized_handler to return 401 JSON.
- 4. Why validate the `next` redirect parameter? — Without validation an attacker can craft ?next=https://evil.com and phish users after a successful login; only allow relative URLs starting with '/' but not '//'.
- 5. What's the difference between session_protection 'basic' and 'strong'? — 'basic' checks identifiers each request and clears the session on mismatch; 'strong' regenerates the session id (and logs the user out) if IP or User-Agent changes.

### Mini Project

Build a Login Flow: A Flask app with a User model (email + password_hash),
/signup, /login, /logout, and a /dashboard gated by @login_required.
Suggested approach:
  - Add User(UserMixin, db.Model) with set_password/check_password
  - Wire @login_manager.user_loader returning db.session.get(User, id)
  - Build SignupForm + LoginForm (Flask-WTF)
  - Set login_manager.login_view = 'auth.login' and session_protection='strong'
  - Validate the `next` param to prevent open redirects

### Exercises

1. Generate a password hash and verify it with check_password_hash.
2. Implement /login that calls login_user(user, remember=True).
3. Add @login_required to a /dashboard route and verify anonymous users are redirected.
4. Implement /logout with logout_user() and redirect.
5. Validate the `next` param to reject absolute URLs.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How does Flask-Login identify the user across requests?
9. A) It stores user.id in the signed session cookie and resolves via @user_loader (*)
10. B) It reads a JWT from the Authorization header
11. C) It queries the DB on every request
12. D) It uses IP address
13. Explanation: Flask-Login stores user.id in session['user_id']; the @user_loader callback resolves it to a User object at the start of each request.
14. Q2: Which werkzeug function hashes a password?
15. A) hashlib.md5
16. B) werkzeug.security.generate_password_hash (*)
17. C) bcrypt.hash
18. D) flask.hash_password
19. Explanation: generate_password_hash(raw, method='pbkdf2:sha256') produces a salted hash; verify with check_password_hash(stored, raw).
20. Q3: What does @login_required do for anonymous users?
21. A) Returns 200 with empty body
22. B) Raises an exception
23. C) Aborts to login_manager.login_view (or unauthorized_handler for JSON) (*)
24. D) Renders a 404 page
25. Explanation: @login_required redirects anonymous users to login_view; for APIs override with @login_manager.unauthorized_handler to return 401 JSON.
26. Q4: Why must you validate the `next` redirect parameter?
27. A) It's slow
28. B) It triggers CSRF
29. C) It bypasses login
30. D) Without validation, an attacker can craft ?next=https://evil.com for open-redirect phishing (*)
31. Explanation: Allow only relative URLs starting with '/' but not '//'; reject anything else to prevent open-redirect attacks.
32. Q5: Which session_protection mode regenerates the session id on IP/UA change?
33. A) strong (*)
34. B) None
35. C) basic
36. D) strict
37. Explanation: 'strong' regenerates the session id (and logs the user out) if the IP or User-Agent changes; 'basic' only clears on identifier mismatch.
38. Q6: What mixin does a User model typically inherit for Flask-Login?
39. A) flask_login.AnonymousUserMixin
40. B) flask_login.UserMixin (*)
41. C) flask_login.LoginManager
42. D) db.Model only
43. Explanation: UserMixin provides is_authenticated, is_active, is_anonymous, and get_id() (returns str(self.id)); pair with db.Model.
44. Q7: How do you customize the JSON response for unauthorized API calls?
45. A) @app.errorhandler(401)
46. B) @login_required(json=True)
47. C) @login_manager.unauthorized_handler returning jsonify({...}), 401 (*)
48. D) Override login_view
49. Explanation: @login_manager.unauthorized_handler lets you return JSON 401 instead of redirecting; useful for API endpoints behind @login_required.
50. Q8: What does login_user(user, remember=True) do extra?
51. A) Sends an email
52. B) Skips CSRF
53. C) Disables session_protection
54. D) Sets a long-lived signed REMEMBER_COOKIE alongside the session (*)
55. Explanation: remember=True stores a separate signed cookie (REMEMBER_COOKIE_NAME) so the user stays logged in across browser restarts; configurable duration via REMEMBER_COOKIE_DURATION.
56. Q9: Why must user_loader be fast?
57. A) It runs on every request to resolve the session id to a User (*)
58. B) Flask times out at 50ms
59. C) It's called per template render
60. D) It's only called once per app boot
61. Explanation: user_loader runs on every authenticated request; a slow query (e.g., unindexed lookup) adds latency to every page. Use an indexed PK or cache.
62. Q10: Which attack does session_protection='strong' mitigate?
63. A) SQL injection
64. B) Session fixation (stolen session cookie used from a different IP/UA) (*)
65. C) XSS
66. D) CSRF
67. Explanation: 'strong' regenerates the session id when IP or User-Agent changes; if an attacker steals a cookie and uses it from a different environment, Flask-Login logs them out.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How does Flask-Login identify the user across requests?
  options:
    - It stores user.id in the signed session cookie and resolves via @user_loader
    - It reads a JWT from the Authorization header
    - It queries the DB on every request
    - It uses IP address
  correctIndex: 0
  explanation: Flask-Login stores user.id in session['user_id']; the @user_loader callback resolves it to a User object at the start of each request.
- id: q2
  question: Which werkzeug function hashes a password?
  options:
    - hashlib.md5
    - werkzeug.security.generate_password_hash
    - bcrypt.hash
    - flask.hash_password
  correctIndex: 1
  explanation: generate_password_hash(raw, method='pbkdf2:sha256') produces a salted hash; verify with check_password_hash(stored, raw).
- id: q3
  question: What does @login_required do for anonymous users?
  options:
    - Returns 200 with empty body
    - Raises an exception
    - Aborts to login_manager.login_view (or unauthorized_handler for JSON)
    - Renders a 404 page
  correctIndex: 2
  explanation: "@login_required redirects anonymous users to login_view; for APIs override with @login_manager.unauthorized_handler to return 401 JSON."
- id: q4
  question: Why must you validate the `next` redirect parameter?
  options:
    - It's slow
    - It triggers CSRF
    - It bypasses login
    - Without validation, an attacker can craft ?next=https://evil.com for open-redirect phishing
  correctIndex: 3
  explanation: Allow only relative URLs starting with '/' but not '//'; reject anything else to prevent open-redirect attacks.
- id: q5
  question: Which session_protection mode regenerates the session id on IP/UA change?
  options:
    - strong
    - None
    - basic
    - strict
  correctIndex: 0
  explanation: "'strong' regenerates the session id (and logs the user out) if the IP or User-Agent changes; 'basic' only clears on identifier mismatch."
- id: q6
  question: What mixin does a User model typically inherit for Flask-Login?
  options:
    - flask_login.AnonymousUserMixin
    - flask_login.UserMixin
    - flask_login.LoginManager
    - db.Model only
  correctIndex: 1
  explanation: UserMixin provides is_authenticated, is_active, is_anonymous, and get_id() (returns str(self.id)); pair with db.Model.
- id: q7
  question: How do you customize the JSON response for unauthorized API calls?
  options:
    - "@app.errorhandler(401)"
    - "@login_required(json=True)"
    - "@login_manager.unauthorized_handler returning jsonify({...}), 401"
    - Override login_view
  correctIndex: 2
  explanation: "@login_manager.unauthorized_handler lets you return JSON 401 instead of redirecting; useful for API endpoints behind @login_required."
- id: q8
  question: What does login_user(user, remember=True) do extra?
  options:
    - Sends an email
    - Skips CSRF
    - Disables session_protection
    - Sets a long-lived signed REMEMBER_COOKIE alongside the session
    - so the user stays logged in across browser restarts; configurable duration via REMEMBER_COOKIE_DURATION.
  correctIndex: 3
  explanation: remember=True stores a separate signed cookie (REMEMBER_COOKIE_NAME) so the user stays logged in across browser restarts; configurable duration via REMEMBER_COOKIE_DURATION.
- id: q9
  question: Why must user_loader be fast?
  options:
    - It runs on every request to resolve the session id to a User
    - Flask times out at 50ms
    - It's called per template render
    - It's only called once per app boot
  correctIndex: 0
  explanation: user_loader runs on every authenticated request; a slow query (e.g., unindexed lookup) adds latency to every page. Use an indexed PK or cache.
- id: q10
  question: Which attack does session_protection='strong' mitigate?
  options:
    - SQL injection
    - Session fixation (stolen session cookie used from a different IP/UA)
    - XSS
    - CSRF
  correctIndex: 1
  explanation: "'strong' regenerates the session id when IP or User-Agent changes; if an attacker steals a cookie and uses it from a different environment, Flask-Login logs them out."
```

