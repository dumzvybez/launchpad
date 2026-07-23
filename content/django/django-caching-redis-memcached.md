---
slug: django-caching-redis-memcached
id: django-15
track: django
order: 15
title: Caching — Redis, Memcached
description: Speed up Django with caching — per-view cache, low-level cache API, template fragment caching, and queryset caching. Use Redis as both cache and broker, and avoid the classic cache-invalidation pitfalls.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=720s
whyItMatters: Speed up Django with caching — per-view cache, low-level cache API, template fragment caching, and queryset caching. Use Redis as both cache and broker, and avoid the classic cache-invalidation pitfalls.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Caching — Redis, Memcached

## Caching — Redis, Memcached

### Why It Matters

Speed up Django with caching — per-view cache, low-level cache API, template fragment caching, and queryset caching. Use Redis as both cache and broker, and avoid the classic cache-invalidation pitfalls.

Speed up Django with caching — per-view cache, low-level cache API, template fragment caching, and queryset caching. Use Redis as both cache and broker, and avoid the classic cache-invalidation pitfalls.

### Prerequisites

- Stage 4 (Models), Stage 9 (Sessions/Middleware)
- Redis or Memcached available locally (Docker).

### Topics

- CACHES setting: BACKEND, LOCATION, TIMEOUT, KEY_PREFIX
- Redis vs Memcached backends
- Per-view cache (@cache_page) and @vary_on_headers / @vary_on_cookie
- Low-level cache API: cache.get/set/get_or_set/delete_many
- Template fragment caching: {% cache %}
- Queryset caching with cacheops or django-cache-machine
- Cache invalidation strategies: TTL, event-driven, version bumping
- Cache stampede protection (cache.lock or dogpile)

### Key Concepts

- Caches store pre-computed results keyed by a string; first request misses, subsequent hit.
- Redis is the most common backend today (also a Celery broker); Memcached is simpler and older.
- Per-view caching uses the URL + headers as the key; vary_on_headers changes per Accept-Language etc.
- The "cache invalidation" problem is hard — pick a TTL that matches your staleness tolerance, and invalidate explicitly on writes.
- Cache stampede: many requests miss at once and rebuild; prevent with a lock (Redis SETNX) or with django-cacheops.

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "TIMEOUT": 300,  # 5 minutes default
        "KEY_PREFIX": "mysite",
        "OPTIONS": {"connection_pool_kwargs": {"max_connections": 50}},
    }
}
```
Caption: Settings: Redis cache

### Common Pitfalls

- Caching user-specific data without a per-user key — leaks one user's data to another; use `@vary_on_cookie` or include the user ID in the cache key.
- Forgetting to invalidate on writes — stale data forever (until TTL); call cache.delete() in save() or via signal.
- Caching querysets and reading attributes that hit the DB — `cache.set("posts", qs)` materializes the list, but `posts[0].author.name` re-queries; serialize or use select_related first.
- Pickling unserializable values (file handles, lambdas) — use JSON-compatible data or picklable models.
- Cache stampede on cold cache — many workers rebuild at once; use a lock or `cache.get_or_set` (no lock but provides one-time set).

### Real-World Applications

- Disqus caches comment threads in Memcached; their cache invalidation is event-driven (comment-posted -> invalidate thread).
- Mozilla MDN caches rendered HTML for docs pages; invalidation on document edit via Celery task.
- Eventbrite caches event pages behind Varnish + Redis; per-locale vary headers.
- Instagram uses Redis clusters for feed caching (a custom layer, but the cache-stampede pattern is identical).

### Interview Questions

- 1. What's the difference between Redis and Memcached for Django? — Redis has more data types (lists, sets, sorted sets), persistence, and pub/sub; Memcached is simpler and older. Django supports both.
- 2. What does @cache_page(60) do? — Wraps the view to cache its response for 60 seconds keyed by URL + headers from vary_on_*.
- 3. How do you invalidate a cached view? — Delete the cache key (hard to compute) or use a version bump (cache.incr_version) — or use a TTL short enough to be acceptable.
- 4. What's a cache stampede and how do you prevent it? — Many requests miss at once and rebuild, overloading the DB. Prevent with a lock (SETNX), jittered TTLs, or pre-warming.
- 5. Why use @vary_on_cookie? — Splits the cache per session cookie (effectively per user) so user-specific content doesn't leak between users.

### Mini Project

Build a Cached Tag Cloud: A view that shows the top-50 tags by post count. Cache the result for 10 minutes in Redis, invalidate via a post_save signal on Post.tags. Add a "refresh" admin action that bypasses the cache. Suggested approach:
  - tag_cloud() service: cache.get("tag_cloud"); on miss, compute Tag.objects.annotate(c=Count("posts")).order_by("-c")[:50]
  - post_save/post_delete signals on Post call cache.delete("tag_cloud")
  - View @cache_page(600) wraps the rendering
  - Admin "Refresh tag cloud" action calls cache.delete("tag_cloud") then redirects
  - Add a /debug/cache/ endpoint that shows the cache key + TTL (admin-only)

### Exercises

1. Configure Redis as the cache backend; verify with cache.set("k", "v") and cache.get.
2. Add @cache_page(60) to a list view and confirm the second request is fast.
3. Use {% cache 300 fragment %} for a sidebar; verify via cache stats.
4. Add @vary_on_headers("Accept-Language") and confirm separate caches per locale.
5. Build a dogpile-protected get_or_set with a Redis lock.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which backend is most common for new Django projects in 2024?
9. A) Memcached
10. B) Local memory
11. C) Redis (*)
12. D) Filesystem
13. Explanation: Redis is the most common — it's also a Celery broker and supports more data types. Memcached is still used but Redis is preferred.
14. Q2: What does @cache_page(60) do?
15. A) Caches the entire site for 60 seconds
16. B) Caches the request body for 60 seconds
17. C) Caches the user session for 60 seconds
18. D) Caches the view's response for 60 seconds, keyed by URL + vary headers (*)
19. Explanation: cache_page wraps the view; the response (with status, headers, body) is cached for 60s. Each unique URL+headers combo is a separate cache entry.
20. Q3: What's a cache stampede?
21. A) Many concurrent misses rebuild the same value, overloading the source (*)
22. B) Cache corruption
23. C) Cache growing too large
24. D) Workers crashing
25. Explanation: On cold cache or after expiry, many requests miss simultaneously and rebuild. Prevent with a lock (SETNX), jittered TTL, or pre-warming.
26. Q4: Which decorator splits the cache per user session?
27. A) @vary_on_user
28. B) @vary_on_cookie (*)
29. C) @per_user_cache
30. D) @user_aware
31. Explanation: @vary_on_cookie includes the session cookie in the cache key, giving each user a separate cache entry.
32. Q5: What's a safe way to invalidate a cached queryset?
33. A) Restart the worker
34. B) Wait for TTL
35. C) Delete the cache key in a post_save signal or after the write (*)
36. D) Increase the cache size
37. Explanation: Event-driven invalidation: when a Post is saved, delete the cached list. Or use a short TTL. Restarting workers doesn't touch Redis.
38. Q6: Which template tag caches a fragment?
39. A) {% cached %}
40. B) {% fragment_cache %}
41. C) {% block_cache %}
42. D) {% cache timeout key %} (*)
43. Explanation: {% cache 300 sidebar user.pk %} ... {% endcache %} caches the block for 300s keyed by "sidebar" + user.pk.
44. Q7: Why is caching querysets risky?
45. A) Lazy attributes (related objects) re-query the DB on access (*)
46. B) They can't be pickled
47. C) They're always huge
48. D) They violate CSRF
49. Explanation: cache.set("posts", qs) materializes the list, but post.author.name triggers a DB hit per row. Fix: use select_related first or serialize to dicts.
50. Q8: What does cache.get_or_set do?
51. A) Locks the cache
52. B) Gets a value or sets a default atomically (but doesn't prevent stampede) (*)
53. C) Sets a value and returns it
54. D) Invalidates the cache
55. Explanation: get_or_set(key, default, timeout) returns the cached value or sets default and returns it. Convenient, but doesn't prevent multiple workers from building default concurrently.
56. Q9: What's KEY_PREFIX for in the CACHES setting?
57. A) Encrypts cache keys
58. B) Limits cache size
59. C) Prefixes all cache keys with a string (per-site isolation when sharing Redis) (*)
60. D) Sets the default TTL
61. Explanation: KEY_PREFIX="mysite" makes every key start with "mysite:" so multiple Django apps sharing a Redis instance don't collide.
62. Q10: Why would you use a Lua script for cache-lock release?
63. A) Lua is faster
64. B) To compress the cache
65. C) To log the release
66. D) To check-and-delete atomically (only delete if you hold the lock) (*)
67. Explanation: A simple cache.delete(lock_key) might delete another worker's lock. A Lua script compares the value to your token and deletes only if they match — atomic.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which backend is most common for new Django projects in 2024?
  options:
    - Memcached
    - Local memory
    - Redis
    - Filesystem
  correctIndex: 2
  explanation: Redis is the most common — it's also a Celery broker and supports more data types. Memcached is still used but Redis is preferred.
- id: q2
  question: What does @cache_page(60) do?
  options:
    - Caches the entire site for 60 seconds
    - Caches the request body for 60 seconds
    - Caches the user session for 60 seconds
    - Caches the view's response for 60 seconds, keyed by URL + vary headers
  correctIndex: 3
  explanation: cache_page wraps the view; the response (with status, headers, body) is cached for 60s. Each unique URL+headers combo is a separate cache entry.
- id: q3
  question: What's a cache stampede?
  options:
    - Many concurrent misses rebuild the same value, overloading the source
    - Cache corruption
    - Cache growing too large
    - Workers crashing
    - ", jittered TTL, or pre-warming."
  correctIndex: 0
  explanation: On cold cache or after expiry, many requests miss simultaneously and rebuild. Prevent with a lock (SETNX), jittered TTL, or pre-warming.
- id: q4
  question: Which decorator splits the cache per user session?
  options:
    - "@vary_on_user"
    - "@vary_on_cookie"
    - "@per_user_cache"
    - "@user_aware"
  correctIndex: 1
  explanation: "@vary_on_cookie includes the session cookie in the cache key, giving each user a separate cache entry."
- id: q5
  question: What's a safe way to invalidate a cached queryset?
  options:
    - Restart the worker
    - Wait for TTL
    - Delete the cache key in a post_save signal or after the write
    - Increase the cache size
  correctIndex: 2
  explanation: "Event-driven invalidation: when a Post is saved, delete the cached list. Or use a short TTL. Restarting workers doesn't touch Redis."
- id: q6
  question: Which template tag caches a fragment?
  options:
    - "{% cached %}"
    - "{% fragment_cache %}"
    - "{% block_cache %}"
    - "{% cache timeout key %}"
  correctIndex: 3
  explanation: '{% cache 300 sidebar user.pk %} ... {% endcache %} caches the block for 300s keyed by "sidebar" + user.pk.'
- id: q7
  question: Why is caching querysets risky?
  options:
    - Lazy attributes (related objects) re-query the DB on access
    - They can't be pickled
    - They're always huge
    - They violate CSRF
  correctIndex: 0
  explanation: 'cache.set("posts", qs) materializes the list, but post.author.name triggers a DB hit per row. Fix: use select_related first or serialize to dicts.'
- id: q8
  question: What does cache.get_or_set do?
  options:
    - Locks the cache
    - Gets a value or sets a default atomically (but doesn't prevent stampede)
    - Sets a value and returns it
    - Invalidates the cache
  correctIndex: 1
  explanation: get_or_set(key, default, timeout) returns the cached value or sets default and returns it. Convenient, but doesn't prevent multiple workers from building default concurrently.
- id: q9
  question: What's KEY_PREFIX for in the CACHES setting?
  options:
    - Encrypts cache keys
    - Limits cache size
    - Prefixes all cache keys with a string (per-site isolation when sharing Redis)
    - Sets the default TTL
  correctIndex: 2
  explanation: KEY_PREFIX="mysite" makes every key start with "mysite:" so multiple Django apps sharing a Redis instance don't collide.
- id: q10
  question: Why would you use a Lua script for cache-lock release?
  options:
    - Lua is faster
    - To compress the cache
    - To log the release
    - To check-and-delete atomically (only delete if you hold the lock)
  correctIndex: 3
  explanation: A simple cache.delete(lock_key) might delete another worker's lock. A Lua script compares the value to your token and deletes only if they match — atomic.
```

