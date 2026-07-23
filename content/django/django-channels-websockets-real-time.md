---
slug: django-channels-websockets-real-time
id: django-19
track: django
order: 19
title: Channels, WebSockets, and Real-Time
description: Build real-time features with Django Channels — WebSockets, ASGI consumers, channel layers (Redis), background workers, and the async/sync boundary. Ship a chat app or live dashboard.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=960s
whyItMatters: Build real-time features with Django Channels — WebSockets, ASGI consumers, channel layers (Redis), background workers, and the async/sync boundary. Ship a chat app or live dashboard.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Channels, WebSockets, and Real-Time

## Channels, WebSockets, and Real-Time

### Why It Matters

Build real-time features with Django Channels — WebSockets, ASGI consumers, channel layers (Redis), background workers, and the async/sync boundary. Ship a chat app or live dashboard.

Build real-time features with Django Channels — WebSockets, ASGI consumers, channel layers (Redis), background workers, and the async/sync boundary. Ship a chat app or live dashboard.

### Prerequisites

- Stage 9 (Middleware), Stage 14 (Celery)
- Comfort with async/await in Python.

### Topics

- ASGI vs WSGI and why Channels needs ASGI
- Installing channels + channels_redis
- asgi.py wiring with ProtocolTypeRouter and URLRouter
- Async consumers (WebsocketConsumer vs AsyncWebsocketConsumer)
- Channel layers and group_send
- Authentication for WebSockets (query-string token or cookie)
- Database access in async consumers (database_sync_to_async)
- Background workers via channel layers (async_to_sync / send)
- Deployment with Daphne + Uvicorn workers behind Nginx

### Key Concepts

- Channels extends Django to handle protocols beyond HTTP (WebSockets, MQTT, IRC).
- ASGI is the async spec; a request is a coroutine, not a function.
- Channel layers let consumers send messages to each other (via Redis) — the foundation for "broadcast to all listeners".
- ORM access in async code must be wrapped in `database_sync_to_async` (Django's ORM is sync).
- Consumers are like views but for WebSockets; they have connect/disconnect/receive methods.

```python
# mysite/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})
```
Caption: asgi.py wiring

### Common Pitfalls

- Calling ORM directly in an async consumer — Django's ORM is sync; you'll get "SynchronousOnlyOperation". Wrap with database_sync_to_async.
- Forgetting to put "daphne" first in INSTALLED_APPS — Django's runserver stays WSGI; the WebSocket routes won't load.
- Using the InMemoryChannelLayer in production — it's per-process only; use channels_redis for cross-process broadcasting.
- Authenticating WebSockets via session cookies — works in same-origin, but cross-origin needs a token (query string or subprotocol); be careful with logging the token in access logs.
- Long-running code in receive() — blocks the event loop; offload to a Celery task or use asyncio.to_thread for sync I/O.

### Real-World Applications

- Discord's earliest prototype was Django + Channels for the real-time layer before they rewrote it in Elixir + custom backends.
- Mozilla Hubs uses Channels for room state sync (now mostly custom).
- Eventbrite uses Channels for live attendee check-in dashboards at events.
- Many SaaS dashboards (Datadog-style) use Channels to push updates to the browser.

### Interview Questions

- 1. What's the difference between WSGI and ASGI? — WSGI is sync (one callable per request); ASGI is async (one coroutine per request) and supports WebSockets.
- 2. Why does the Django ORM need database_sync_to_async in async code? — The ORM is sync; calling it from an async context raises SynchronousOnlyOperation. The wrapper runs it in a thread.
- 3. What's a channel layer? — A messaging layer (usually Redis) that lets consumers send messages to each other and to groups; enables broadcast.
- 4. How do you broadcast to all listeners in a "room"? — group_add each consumer on connect; group_send(message) — each consumer receives a method call named after the message "type".
- 5. How do you deploy Channels in production? — Daphne (or Uvicorn with UvicornWorker) behind Nginx; Redis for the channel layer; multiple workers via process manager (systemd, k8s).

### Mini Project

Build a Live Chat Room: A `Room` and `Message` model, a WebSocket consumer that broadcasts messages to all connected clients in the room, and a simple HTML+JS page that connects and renders messages. Suggested approach:
  - Models: Room(name unique), Message(room FK, user FK, text, created_at)
  - Consumer: connect -> group_add; receive -> save + group_send; chat_message -> send to client
  - Frontend: WebSocket(`ws://${host}/ws/chat/${room}/`) with onmessage handler
  - Auth: AuthMiddlewareStack for cookie-based session auth
  - Deploy: daphne + Redis + Nginx with WebSocket upgrade headers

### Exercises

1. Install channels + channels_redis; wire asgi.py with a hello consumer.
2. Add a /ws/ping/ consumer that echoes back the message; verify with browser JS.
3. Use database_sync_to_async to save an incoming message to the DB.
4. Add group_send so all clients in a room see new messages.
5. Run with Daphne behind Nginx; verify WebSocket upgrade works.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which protocol spec does Channels require?
9. A) WSGI
10. B) CGI
11. C) ASGI (*)
12. D) FastCGI
13. Explanation: ASGI is the async spec; it supports WebSockets and other protocols. WSGI is sync-only and can't do WebSockets.
14. Q2: Why must ORM calls in an async consumer be wrapped?
15. A) The ORM is async-only
16. B) The ORM can't be used in Channels at all
17. C) You must use a different ORM
18. D) The ORM is sync; calling it from async raises SynchronousOnlyOperation — wrap in database_sync_to_async (*)
19. Explanation: Django's ORM is synchronous. database_sync_to_async runs the call in a thread, returning an awaitable.
20. Q3: Which class do you subclass for an async WebSocket consumer?
21. A) AsyncWebsocketConsumer (*)
22. B) WebsocketConsumer
23. C) AsyncConsumer
24. D) HTTPConsumer
25. Explanation: AsyncWebsocketConsumer exposes async connect/disconnect/receive. WebsocketConsumer is the sync variant.
26. Q4: What does a channel layer do?
27. A) Caches HTTP responses
28. B) Lets consumers send messages to each other and to groups (broadcast) (*)
29. C) Authenticates users
30. D) Compresses WebSocket frames
31. Explanation: Channel layers (usually backed by Redis) let consumers communicate. group_send broadcasts to all members of a group.
32. Q5: Which must be first in INSTALLED_APPS for Channels to work?
33. A) channels
34. B) channels_redis
35. C) daphne (*)
36. D) asyncio
37. Explanation: Putting "daphne" first overrides runserver to use ASGI. Without it, manage.py runserver uses WSGI and WebSockets won't work.
38. Q6: Which channel layer backend is safe for production?
39. A) InMemoryChannelLayer
40. B) DatabaseChannelLayer
41. C) FileChannelLayer
42. D) channels_redis (Redis) (*)
43. Explanation: InMemoryChannelLayer is per-process only — works for tests but not for cross-process broadcasting. Use channels_redis in prod.
44. Q7: How is auth typically handled for WebSockets?
45. A) Session cookie via AuthMiddlewareStack, or a token in query string/subprotocol (*)
46. B) Username/password sent every message
47. C) No auth needed
48. D) JWT in URL fragment
49. Explanation: Same-origin sites use session cookies via AuthMiddlewareStack. Cross-origin or mobile often uses a short-lived token in ?token= or as a subprotocol.
50. Q8: Which server runs ASGI Django in production?
51. A) Gunicorn (sync-only mode)
52. B) Daphne or Uvicorn with UvicornWorker (*)
53. C) runserver
54. D) mod_wsgi
55. Explanation: Daphne is the Channels-recommended server. Uvicorn with UvicornWorker also works. Gunicorn can run UvicornWorker too.
56. Q9: Why is putting long-running sync I/O in receive() dangerous?
57. A) It triggers CSRF
58. B) It breaks the channel layer
59. C) It blocks the event loop, stalling all connections on that worker (*)
60. D) It causes database deadlocks
61. Explanation: Async consumers share one event loop. A blocking call freezes every connection. Use asyncio.to_thread or offload to Celery.
62. Q10: Which Nginx directives are required for WebSocket proxying?
63. A) proxy_pass only
64. B) proxy_cache
65. C) ssl_verify
66. D) Upgrade and Connection headers (`proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`) (*)
67. Explanation: Nginx needs to upgrade the HTTP connection to WebSocket. Set Upgrade and Connection headers and a longer proxy_read_timeout.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which protocol spec does Channels require?
  options:
    - WSGI
    - CGI
    - ASGI
    - FastCGI
  correctIndex: 2
  explanation: ASGI is the async spec; it supports WebSockets and other protocols. WSGI is sync-only and can't do WebSockets.
- id: q2
  question: Why must ORM calls in an async consumer be wrapped?
  options:
    - The ORM is async-only
    - The ORM can't be used in Channels at all
    - You must use a different ORM
    - The ORM is sync; calling it from async raises SynchronousOnlyOperation — wrap in database_sync_to_async
  correctIndex: 3
  explanation: Django's ORM is synchronous. database_sync_to_async runs the call in a thread, returning an awaitable.
- id: q3
  question: Which class do you subclass for an async WebSocket consumer?
  options:
    - AsyncWebsocketConsumer
    - WebsocketConsumer
    - AsyncConsumer
    - HTTPConsumer
  correctIndex: 0
  explanation: AsyncWebsocketConsumer exposes async connect/disconnect/receive. WebsocketConsumer is the sync variant.
- id: q4
  question: What does a channel layer do?
  options:
    - Caches HTTP responses
    - Lets consumers send messages to each other and to groups (broadcast)
    - Authenticates users
    - Compresses WebSocket frames
  correctIndex: 1
  explanation: Channel layers (usually backed by Redis) let consumers communicate. group_send broadcasts to all members of a group.
- id: q5
  question: Which must be first in INSTALLED_APPS for Channels to work?
  options:
    - channels
    - channels_redis
    - daphne
    - asyncio
  correctIndex: 2
  explanation: Putting "daphne" first overrides runserver to use ASGI. Without it, manage.py runserver uses WSGI and WebSockets won't work.
- id: q6
  question: Which channel layer backend is safe for production?
  options:
    - InMemoryChannelLayer
    - DatabaseChannelLayer
    - FileChannelLayer
    - channels_redis (Redis)
  correctIndex: 3
  explanation: InMemoryChannelLayer is per-process only — works for tests but not for cross-process broadcasting. Use channels_redis in prod.
- id: q7
  question: How is auth typically handled for WebSockets?
  options:
    - Session cookie via AuthMiddlewareStack, or a token in query string/subprotocol
    - Username/password sent every message
    - No auth needed
    - JWT in URL fragment
  correctIndex: 0
  explanation: Same-origin sites use session cookies via AuthMiddlewareStack. Cross-origin or mobile often uses a short-lived token in ?token= or as a subprotocol.
- id: q8
  question: Which server runs ASGI Django in production?
  options:
    - Gunicorn (sync-only mode)
    - Daphne or Uvicorn with UvicornWorker
    - runserver
    - mod_wsgi
  correctIndex: 1
  explanation: Daphne is the Channels-recommended server. Uvicorn with UvicornWorker also works. Gunicorn can run UvicornWorker too.
- id: q9
  question: Why is putting long-running sync I/O in receive() dangerous?
  options:
    - It triggers CSRF
    - It breaks the channel layer
    - It blocks the event loop, stalling all connections on that worker
    - It causes database deadlocks
  correctIndex: 2
  explanation: Async consumers share one event loop. A blocking call freezes every connection. Use asyncio.to_thread or offload to Celery.
- id: q10
  question: Which Nginx directives are required for WebSocket proxying?
  options:
    - proxy_pass only
    - proxy_cache
    - ssl_verify
    - Upgrade and Connection headers (`proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`)
  correctIndex: 3
  explanation: Nginx needs to upgrade the HTTP connection to WebSocket. Set Upgrade and Connection headers and a longer proxy_read_timeout.
```

