---
slug: fastapi-caching-redis
id: fastapi-15
track: fastapi
order: 15
title: Caching with Redis
description: Add Redis caching to FastAPI using `redis` (async), build a caching dependency, set TTLs, invalidate on write, and dodge the cache-stampede and stale-data traps.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=4200s
whyItMatters: Add Redis caching to FastAPI using `redis` (async), build a caching dependency, set TTLs, invalidate on write, and dodge the cache-stampede and stale-data traps.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Caching with Redis

## Caching with Redis

### Why It Matters

Add Redis caching to FastAPI using `redis` (async), build a caching dependency, set TTLs, invalidate on write, and dodge the cache-stampede and stale-data traps.

Add Redis caching to FastAPI using `redis` (async), build a caching dependency, set TTLs, invalidate on write, and dodge the cache-stampede and stale-data traps.

### Prerequisites

- Stage 6: Dependencies — Depends and Dependency Injection
- Stage 9: async/await in FastAPI
- Basic Redis knowledge (GET/SET/EXPIRE).

### Topics

- `redis.asyncio.Redis` (the modern async client, formerly aioredis)
- Connecting via `redis.ConnectionPool.from_url(url)`
- `SET`/`GET`/`DELETE` with `ex=` TTL
- JSON serialization: `json.dumps` vs `pickle` (prefer JSON)
- Caching dependency: a `Depends` that returns cached or computes
- Cache invalidation on writes (delete the key after POST/PUT/DELETE)
- Cache stampede and the SETNX-lock pattern
- Per-user keys, key namespacing, and prefix management

### Key Concepts

- The modern async client is `redis.asyncio.Redis` (in the `redis` package, not the abandoned `aioredis`).
- Always set a TTL: caches without TTLs leak memory and serve stale data forever.
- Cache invalidation is hard: write-through (invalidate on write) is the simplest correct strategy.
- For expensive computations under load, use a `SET NX` lock to prevent stampedes.
- Per-user keys must include the user ID; a shared key leaks data across users.

```python
import redis.asyncio as redis
from fastapi import FastAPI

REDIS_URL = "redis://localhost:6379/0"
pool = redis.ConnectionPool.from_url(REDIS_URL, decode_responses=True)

async def get_redis() -> redis.Redis:
    return redis.Redis(connection_pool=pool)

app = FastAPI()
```
Caption: Redis connection pool

### Common Pitfalls

- Using the abandoned `aioredis` package — it was merged into `redis` in 2022; use `redis.asyncio` (the `redis` package).
- Caching user-specific data under a shared key — leaks data across users; include the user ID in the key.
- Forgetting to invalidate on writes — serves stale data; delete the key after any mutation.
- Using `pickle` for serialization — pickle allows arbitrary code execution on deserialize; use JSON (or msgpack) for untrusted data.
- Caches without TTLs — leak memory and serve stale data forever; always pass `ex=` seconds.

### Real-World Applications

- Netflix caches user profiles and recommendation lists in Redis with per-user keys and short TTLs; FastAPI + redis-py is the same pattern.
- Uber caches ETAs and driver locations in Redis with sub-second TTLs; the cache-stampede lock pattern matters at their scale.
- GitHub caches rendered README and blob contents in Redis with write-through invalidation on every push.
- Slack caches channel metadata per workspace in Redis; FastAPI dependencies make this trivial to inject.

### Interview Questions

- 1. Which package provides the modern async Redis client? — `redis` (use `redis.asyncio.Redis`); the standalone `aioredis` was merged into it in 2022.
- 2. Why must every cache key have a TTL? — Without TTL, the cache grows unbounded and serves stale data forever; TTL bounds memory and staleness.
- 3. How do you prevent a cache stampede? — Use `SET NX` (or Redlock) to acquire a compute lock; the first worker computes, others wait briefly and retry.
- 4. Why is `pickle` unsafe for cache values? — Deserializing untrusted pickle allows arbitrary code execution; prefer JSON or msgpack.
- 5. How do you scope a cache key per user? — Include the user ID (and tenant ID, if multi-tenant) in the key: `user:{uid}:profile`.

### Mini Project

Build a "Cached User Profile" Service: A GET `/users/{uid}` that checks Redis first, falls back to a fake DB loader, and caches the result for 60s. A PUT `/users/{uid}` invalidates the key. Add a stampede lock for the loader. Suggested approach:
  - Set up `redis.asyncio.Redis` connection pool
  - Write `cached_user(uid)` dependency: `redis.get -> json.loads` or `load -> redis.set(ex=60)`
  - On PUT, `redis.delete(f"user:{uid}")`
  - Add `SET NX` lock around the loader to prevent stampede
  - Test concurrent reads with `asyncio.gather` to confirm one DB hit

### Exercises

1. Install `redis` and connect via `redis.asyncio.ConnectionPool.from_url`; verify `await redis.ping()`.
2. Add a caching dependency for `GET /users/{uid}` with a 60s TTL.
3. Add invalidation on `PUT /users/{uid}` and verify the next GET hits the DB.
4. Implement a `SET NX` lock around an expensive loader and test concurrent reads.
5. >>> QUIZ (Stage 15) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which package provides the modern async Redis client?
8. A) aioredis (abandoned)
9. B) redisco
10. C) redis (use redis.asyncio.Redis) (*)
11. D) pyredis
12. Explanation: `aioredis` was merged into `redis` in 2022; today you use `redis.asyncio.Redis` from the `redis` package.
13. Q2: Why must every cache key have a TTL?
14. A) For security
15. B) Because Redis requires it
16. C) To improve compression
17. D) To bound memory and staleness (*)
18. Explanation: Without TTL, keys accumulate forever and serve stale data; TTL bounds both memory and freshness.
19. Q3: How do you prevent a cache stampede?
20. A) Use a SET NX lock so only one worker computes; others retry briefly (*)
21. B) Increase TTL
22. C) Disable caching under load
23. D) Use a longer key
24. Explanation: A `SET NX` (or Redlock) compute lock lets the first worker compute while others wait, preventing N concurrent loads.
25. Q4: Why is pickle unsafe for cache values?
26. A) It's slow
27. B) Deserializing untrusted pickle allows arbitrary code execution (*)
28. C) It doesn't compress
29. D) It's deprecated
30. Explanation: `pickle.loads` can construct arbitrary objects; JSON/msgpack are safe for untrusted data.
31. Q5: How do you scope a cache key per user?
32. A) Use a random key
33. B) Use the request IP
34. C) Include the user ID (and tenant ID) in the key, e.g. user:{uid}:profile (*)
35. D) Use the session cookie
36. Explanation: Per-user keys must include a stable user identifier; a shared key leaks data across users.
37. Q6: Which method sets a key with TTL atomically?
38. A) `redis.set(key, value)` then `redis.expire(key, ttl)`
39. B) `redis.setex(key, value)` without TTL arg
40. C) `redis.ttl(key, value)`
41. D) `redis.set(key, value, ex=ttl)` (*)
42. Explanation: `SET key value EX ttl` is atomic; doing SET then EXPIRE has a tiny window where the key has no TTL.
43. Q7: When should you invalidate the cache?
44. A) On any write (POST/PUT/DELETE) that affects the cached value (*)
45. B) Never — let TTL handle it
46. C) Every 24 hours
47. D) Only on DELETE
48. Explanation: Write-through invalidation prevents stale reads; TTL is the backstop for forgotten invalidations.
49. Q8: Which redis-py method acquires a lock atomically?
50. A) `redis.lock(key)`
51. B) `redis.set(lock_key, "1", nx=True, ex=10)` (*)
52. C) `redis.acquire(key)`
53. D) `redis.mutex(key)`
54. Explanation: `SET NX EX` acquires a key only if absent, with an expiry for safety; release with `DELETE`.
55. Q9: What's the recommended serialization for cache values?
56. A) pickle
57. B) repr()
58. C) JSON (or msgpack for compactness) for untrusted data (*)
59. D) CSV
60. Explanation: JSON is safe and language-portable; msgpack is a smaller alternative. Pickle is unsafe for untrusted data.
61. Q10: How is Redis typically injected into routes?
62. A) As a global module-level client (no DI)
63. B) Via environment variables only
64. C) Via cookies
65. D) Via a `Depends(get_redis)` dependency returning a client from a shared pool (*)
66. Explanation: A `get_redis` dependency returning a pooled client is the idiomatic pattern; it's mockable in tests via dependency overrides.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which package provides the modern async Redis client?
  options:
    - aioredis (abandoned)
    - redisco
    - redis (use redis.asyncio.Redis)
    - pyredis
  correctIndex: 2
  explanation: "`aioredis` was merged into `redis` in 2022; today you use `redis.asyncio.Redis` from the `redis` package."
- id: q2
  question: Why must every cache key have a TTL?
  options:
    - For security
    - Because Redis requires it
    - To improve compression
    - To bound memory and staleness
  correctIndex: 3
  explanation: Without TTL, keys accumulate forever and serve stale data; TTL bounds both memory and freshness.
- id: q3
  question: How do you prevent a cache stampede?
  options:
    - Use a SET NX lock so only one worker computes; others retry briefly
    - Increase TTL
    - Disable caching under load
    - Use a longer key
  correctIndex: 0
  explanation: A `SET NX` (or Redlock) compute lock lets the first worker compute while others wait, preventing N concurrent loads.
- id: q4
  question: Why is pickle unsafe for cache values?
  options:
    - It's slow
    - Deserializing untrusted pickle allows arbitrary code execution
    - It doesn't compress
    - It's deprecated
  correctIndex: 1
  explanation: "`pickle.loads` can construct arbitrary objects; JSON/msgpack are safe for untrusted data."
- id: q5
  question: How do you scope a cache key per user?
  options:
    - Use a random key
    - Use the request IP
    - Include the user ID (and tenant ID) in the key, e.g. user:{uid}:profile
    - Use the session cookie
  correctIndex: 2
  explanation: Per-user keys must include a stable user identifier; a shared key leaks data across users.
- id: q6
  question: Which method sets a key with TTL atomically?
  options:
    - "`redis.set(key, value)` then `redis.expire(key, ttl)`"
    - "`redis.setex(key, value)` without TTL arg"
    - "`redis.ttl(key, value)`"
    - "`redis.set(key, value, ex=ttl)`"
  correctIndex: 3
  explanation: "`SET key value EX ttl` is atomic; doing SET then EXPIRE has a tiny window where the key has no TTL."
- id: q7
  question: When should you invalidate the cache?
  options:
    - On any write (POST/PUT/DELETE) that affects the cached value
    - Never — let TTL handle it
    - Every 24 hours
    - Only on DELETE
  correctIndex: 0
  explanation: Write-through invalidation prevents stale reads; TTL is the backstop for forgotten invalidations.
- id: q8
  question: Which redis-py method acquires a lock atomically?
  options:
    - "`redis.lock(key)`"
    - '`redis.set(lock_key, "1", nx=True, ex=10)`'
    - "`redis.acquire(key)`"
    - "`redis.mutex(key)`"
  correctIndex: 1
  explanation: "`SET NX EX` acquires a key only if absent, with an expiry for safety; release with `DELETE`."
- id: q9
  question: What's the recommended serialization for cache values?
  options:
    - pickle
    - repr()
    - JSON (or msgpack for compactness) for untrusted data
    - CSV
  correctIndex: 2
  explanation: JSON is safe and language-portable; msgpack is a smaller alternative. Pickle is unsafe for untrusted data.
- id: q10
  question: How is Redis typically injected into routes?
  options:
    - As a global module-level client (no DI)
    - Via environment variables only
    - Via cookies
    - Via a `Depends(get_redis)` dependency returning a client from a shared pool
  correctIndex: 3
  explanation: A `get_redis` dependency returning a pooled client is the idiomatic pattern; it's mockable in tests via dependency overrides.
```

