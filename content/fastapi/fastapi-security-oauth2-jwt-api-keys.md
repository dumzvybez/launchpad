---
slug: fastapi-security-oauth2-jwt-api-keys
id: fastapi-07
track: fastapi
order: 7
title: Security — OAuth2, JWT, API Keys
description: Implement OAuth2 password flow with JWT access tokens, refresh tokens, API-key auth, and security scopes — using FastAPI's `fastapi.security` toolkit and PyJWT.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=1800s
whyItMatters: Implement OAuth2 password flow with JWT access tokens, refresh tokens, API-key auth, and security scopes — using FastAPI's `fastapi. security` toolkit and PyJWT.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Security — OAuth2, JWT, API Keys

## Security — OAuth2, JWT, API Keys

### Why It Matters

Implement OAuth2 password flow with JWT access tokens, refresh tokens, API-key auth, and security scopes — using FastAPI's `fastapi. security` toolkit and PyJWT.

Implement OAuth2 password flow with JWT access tokens, refresh tokens, API-key auth, and security scopes — using FastAPI's `fastapi.security` toolkit and PyJWT.

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 4: Pydantic Models and Validation
- Basic understanding of JWT, HMAC, and tokens.

### Topics

- `OAuth2PasswordBearer` and the tokenUrl flow
- `OAuth2PasswordRequestForm` for username/password grant
- Hashing passwords with `passlib[bcrypt]` (NEVER plain-text)
- Issuing JWTs with `python-jose` or `pyjwt`
- `Security()` and scopes for fine-grained access
- `APIKeyHeader` / `APIKeyQuery` for service-to-service auth
- Refresh tokens, token rotation, and revocation lists
- Common pitfalls: algorithm confusion, missing `exp`, leeway, audience

### Key Concepts

- JWT is a signed, base64-encoded JSON payload; it's not encrypted — never put secrets in it.
- Always specify `algorithms=["HS256"]` (or RS256) explicitly; `algorithms=["none"]` is a famous attack.
- `OAuth2PasswordBearer` is a dependency that extracts the token from `Authorization: Bearer ...`.
- Scopes let you authorize per-route: `Security(get_current_user, scopes=["read:items"])`.
- API keys belong in headers (`X-API-Key`), not query strings (logged by proxies).

```python
from datetime import datetime, timedelta, timezone
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET = "CHANGE-ME"  # load from env in prod
ALGO = "HS256"
ACCESS_TTL = timedelta(minutes=15)

oauth2 = OAuth2PasswordBearer(tokenUrl="token")
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI()

def create_access_token(sub: str) -> str:
    payload = {"sub": sub, "exp": datetime.now(timezone.utc) + ACCESS_TTL}
    return jwt.encode(payload, SECRET, algorithm=ALGO)

async def get_current_user(token: str = Depends(oauth2)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/token")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # verify_user raises 401 on bad creds
    user = verify_user(form.username, form.password)
    return {"access_token": create_access_token(user.email), "token_type": "bearer"}
```
Caption: OAuth2 password flow with JWT

### Common Pitfalls

- Decoding JWT without `algorithms=` — `pyjwt` raises an error, but some libraries default to `none`; always pass `algorithms=["HS256"]` explicitly.
- Forgetting `exp` (expiry) — tokens without `exp` never expire; always set `exp = now + ttl`.
- Using symmetric HS256 with a weak shared secret — if the secret leaks, anyone can forge tokens; for multi-service setups, use RS256 (asymmetric).
- Storing the JWT in `localStorage` — exposes it to XSS; prefer `HttpOnly` cookies with `SameSite=Strict` for browser clients.
- Mixing `audience`/`issuer` validation — if you set `aud`/`iss` at signing, you must pass them to `decode`; mismatches raise silently in some libs.

### Real-World Applications

- Stripe's API uses bearer API keys (`sk_live_...`) for server-to-server auth, exactly the `APIKeyHeader` pattern.
- GitHub's API supports both OAuth2 (for apps acting on behalf of users) and PATs (personal access tokens) — FastAPI's `OAuth2PasswordBearer` covers the first, `APIKeyHeader` covers the second.
- Auth0 emits JWTs (RS256) consumed by FastAPI services that validate the signature using Auth0's JWKS — a common microservice pattern.
- Slack's web API signs requests with HMAC-SHA256 (verified via `X-Slack-Signature`), a variation on the API-key pattern with request signing.

### Interview Questions

- 1. Why must you pass `algorithms=` to `jwt.decode`? — To prevent the `alg=none` attack and algorithm-confusion attacks (HS256 with RS256 public key).
- 2. What's the difference between an access token and a refresh token? — Access tokens are short-lived (15 min) and stateless; refresh tokens are long-lived and typically stored server-side with revocation.
- 3. Why use `passlib[bcrypt]` instead of storing password hashes with `hashlib.sha256`? — bcrypt (or argon2) is slow on purpose, defeating brute-force; sha256 is too fast and unsalted-by-default.
- 4. What are OAuth2 scopes? — Strings labeling permissions; clients request them, the auth server grants them, and APIs enforce them per route via `Security(dep, scopes=[...])`.
- 5. Where should a browser client store a JWT? — In an `HttpOnly`, `Secure`, `SameSite=Strict` cookie — not `localStorage` (XSS-vulnerable) or `sessionStorage`.

### Mini Project

Build a "Token Issuer + Protected Resource" Pair: A `/token` endpoint that takes username/password via `OAuth2PasswordRequestForm`, verifies against an in-memory user dict (bcrypt-hashed passwords), and issues a 15-minute JWT. A `/me` endpoint protected by `get_current_user` returns the user's email. Add a `/admin` route requiring the `admin` scope. Suggested approach:
  - Use `passlib[bcrypt]` for hashing; pre-hash a demo user
  - Sign JWTs with HS256 and a secret from env
  - Define `oauth2 = OAuth2PasswordBearer(tokenUrl="token", scopes={"admin": "Admin"})`
  - In `get_current_user`, decode and return the user; attach `scopes` from the token
  - Use `Security(get_current_user, scopes=["admin"])` on `/admin`

### Exercises

1. Hash a password with bcrypt and verify it with `pwd_ctx.verify(plain, hashed)`.
2. Issue a JWT with `exp = now + 15min` and decode it; confirm decoding an expired token raises.
3. Add a `scopes=["read:items"]` requirement to a route and confirm a token without the scope is rejected.
4. Implement an `X-API-Key` header dependency and protect an internal route with it.
5. >>> QUIZ (Stage 7) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which attack does passing `algorithms=["HS256"]` to `jwt.decode` prevent?
8. A) CSRF
9. B) SQL injection
10. C) The `alg=none` and algorithm-confusion attacks (*)
11. D) XSS
12. Explanation: Without `algorithms=`, an attacker can set `alg=none` or use HS256 with an RS256 public key to forge tokens; specifying the algorithm list blocks both.
13. Q2: What does `OAuth2PasswordBearer(tokenUrl="token")` do?
14. A) Issues tokens itself
15. B) Hashes passwords
16. C) Stores sessions
17. D) Extracts the bearer token from the Authorization header and exposes /token in /docs (*)
18. Explanation: It's a dependency that reads `Authorization: Bearer ...` and tells Swagger UI to use `tokenUrl` for the password flow.
19. Q3: Which library is recommended for password hashing?
20. A) passlib[bcrypt] (*)
21. B) hashlib.sha256
22. C) base64
23. D) md5
24. Explanation: bcrypt (and argon2) are slow and salted by design, defeating brute-force; sha256/md5 are too fast and unsafe for passwords.
25. Q4: What's the standard lifetime of an access token in a stateless JWT setup?
26. A) 30 days
27. B) 15 minutes (short-lived; refresh with a long-lived refresh token) (*)
28. C) 1 year
29. D) Forever
30. Explanation: Access tokens are short-lived (5-60 min) to limit blast radius; refresh tokens (days-weeks) get new access tokens.
31. Q5: Where should a browser client store a JWT?
32. A) localStorage
33. B) A plain cookie
34. C) HttpOnly + Secure + SameSite=Strict cookie (*)
35. D) In the URL
36. Explanation: HttpOnly cookies can't be read by JS (no XSS exfiltration); Secure requires HTTPS; SameSite=Strict blocks CSRF.
37. Q6: What are OAuth2 scopes?
38. A) Encrypted token claims
39. B) Token lifetimes
40. C) JWT algorithms
41. D) Permission labels enforced per route via Security(dep, scopes=[...]) (*)
42. Explanation: Scopes are strings (e.g., "read:items") that label permissions; clients request them, APIs enforce them.
43. Q7: Why prefer API keys in headers over query strings?
44. A) Query strings get logged by proxies and browsers (security risk) (*)
45. B) Headers are faster
46. C) Headers support longer values only
47. D) Query strings are deprecated in HTTP/2
48. Explanation: Query strings end up in URL logs, browser history, and Referer headers — never put secrets there.
49. Q8: What happens if you forget `exp` when issuing a JWT?
50. A) Decode fails immediately
51. B) The token never expires (*)
52. C) The token is rejected by /docs
53. D) FastAPI auto-adds exp
54. Explanation: Without `exp`, the token is valid forever; always set `exp = now + ttl` and validate `exp` on decode.
55. Q9: Which dependency declares the API key header?
56. A) `HeaderKey("X-API-Key")`
57. B) `Cookie("X-API-Key")`
58. C) `APIKeyHeader(name="X-API-Key")` (or just `Annotated[str, Header()]`) (*)
59. D) `Bearer("X-API-Key")`
60. Explanation: `fastapi.security.APIKeyHeader` models an API-key header; you can also roll your own with `Annotated[str, Header()]`.
61. Q10: What does `Security(dep, scopes=["admin"])` do?
62. A) Encrypts the request
63. B) Adds HTTPS
64. C) Disables auth for the route
65. D) Runs the dependency and enforces that the returned user has the "admin" scope (*)
66. Explanation: `Security` is `Depends` plus scope enforcement; the dependency must return an object whose `scopes` attribute contains the required scope.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attack does passing `algorithms=["HS256"]` to `jwt.decode` prevent?
  options:
    - CSRF
    - SQL injection
    - The `alg=none` and algorithm-confusion attacks
    - XSS
  correctIndex: 2
  explanation: Without `algorithms=`, an attacker can set `alg=none` or use HS256 with an RS256 public key to forge tokens; specifying the algorithm list blocks both.
- id: q2
  question: What does `OAuth2PasswordBearer(tokenUrl="token")` do?
  options:
    - Issues tokens itself
    - Hashes passwords
    - Stores sessions
    - Extracts the bearer token from the Authorization header and exposes /token in /docs
  correctIndex: 3
  explanation: "It's a dependency that reads `Authorization: Bearer ...` and tells Swagger UI to use `tokenUrl` for the password flow."
- id: q3
  question: Which library is recommended for password hashing?
  options:
    - passlib[bcrypt]
    - hashlib.sha256
    - base64
    - md5
  correctIndex: 0
  explanation: bcrypt (and argon2) are slow and salted by design, defeating brute-force; sha256/md5 are too fast and unsafe for passwords.
- id: q4
  question: What's the standard lifetime of an access token in a stateless JWT setup?
  options:
    - 30 days
    - 15 minutes (short-lived; refresh with a long-lived refresh token)
    - 1 year
    - Forever
  correctIndex: 1
  explanation: Access tokens are short-lived (5-60 min) to limit blast radius; refresh tokens (days-weeks) get new access tokens.
- id: q5
  question: Where should a browser client store a JWT?
  options:
    - localStorage
    - A plain cookie
    - HttpOnly + Secure + SameSite=Strict cookie
    - In the URL
  correctIndex: 2
  explanation: HttpOnly cookies can't be read by JS (no XSS exfiltration); Secure requires HTTPS; SameSite=Strict blocks CSRF.
- id: q6
  question: What are OAuth2 scopes?
  options:
    - Encrypted token claims
    - Token lifetimes
    - JWT algorithms
    - Permission labels enforced per route via Security(dep, scopes=[...])
  correctIndex: 3
  explanation: Scopes are strings (e.g., "read:items") that label permissions; clients request them, APIs enforce them.
- id: q7
  question: Why prefer API keys in headers over query strings?
  options:
    - Query strings get logged by proxies and browsers (security risk)
    - Headers are faster
    - Headers support longer values only
    - Query strings are deprecated in HTTP/2
  correctIndex: 0
  explanation: Query strings end up in URL logs, browser history, and Referer headers — never put secrets there.
- id: q8
  question: What happens if you forget `exp` when issuing a JWT?
  options:
    - Decode fails immediately
    - The token never expires
    - The token is rejected by /docs
    - FastAPI auto-adds exp
  correctIndex: 1
  explanation: Without `exp`, the token is valid forever; always set `exp = now + ttl` and validate `exp` on decode.
- id: q9
  question: Which dependency declares the API key header?
  options:
    - '`HeaderKey("X-API-Key")`'
    - '`Cookie("X-API-Key")`'
    - '`APIKeyHeader(name="X-API-Key")` (or just `Annotated[str, Header()]`)'
    - '`Bearer("X-API-Key")`'
  correctIndex: 2
  explanation: "`fastapi.security.APIKeyHeader` models an API-key header; you can also roll your own with `Annotated[str, Header()]`."
- id: q10
  question: What does `Security(dep, scopes=["admin"])` do?
  options:
    - Encrypts the request
    - Adds HTTPS
    - Disables auth for the route
    - Runs the dependency and enforces that the returned user has the "admin" scope
  correctIndex: 3
  explanation: "`Security` is `Depends` plus scope enforcement; the dependency must return an object whose `scopes` attribute contains the required scope."
```

