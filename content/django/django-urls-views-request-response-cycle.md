---
slug: django-urls-views-request-response-cycle
id: django-02
track: django
order: 2
title: URLs, Views, and the Request/Response Cycle
description: Map URLs to views, read request data, and return HttpResponse, JsonResponse, and redirect responses. Understand the full request/response lifecycle through middleware.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=a48xeeo5Vnk
whyItMatters: Map URLs to views, read request data, and return HttpResponse, JsonResponse, and redirect responses. Understand the full request/response lifecycle through middleware.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# URLs, Views, and the Request/Response Cycle

## URLs, Views, and the Request/Response Cycle

### Why It Matters

Map URLs to views, read request data, and return HttpResponse, JsonResponse, and redirect responses. Understand the full request/response lifecycle through middleware.

Map URLs to views, read request data, and return HttpResponse, JsonResponse, and redirect responses. Understand the full request/response lifecycle through middleware.

### Prerequisites

- Stage 1: Getting Started with Django
- Basic familiarity with HTTP methods (GET/POST) and status codes.

### Topics

- URLconfs and the path() / re_path() functions
- Dynamic URL parameters: int, str, slug, uuid, path converters
- include() and per-app urls.py for modular routing
- Function-based views (FBVs) — the building block
- HttpRequest object: GET, POST, META, headers, FILES, user, session
- HttpResponse, JsonResponse, HttpResponseRedirect, Http404
- The middleware stack: process_request, process_view, process_response, process_template_response
- Reverse URL matching with reverse() and the {% url %} template tag

### Key Concepts

- Django resolves a URL by walking urlpatterns top-down; the first match wins.
- Converters (int, slug, uuid) both parse and validate URL segments.
- `request.GET` and `request.POST` are QueryDicts — multi-valued, use getlist() for repeats.
- A view is just a callable that takes an HttpRequest and returns an HttpResponse.
- `reverse("blog:detail", kwargs={"pk": 42})` decouples code from URL strings; never hard-code URLs.

```python
# mysite/urls.py
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls", namespace="blog")),
]

# blog/urls.py
from django.urls import path
from . import views

app_name = "blog"
urlpatterns = [
    path("", views.post_list, name="list"),
    path("<int:pk>/", views.post_detail, name="detail"),
    path("<slug:slug>/", views.post_by_slug, name="by_slug"),
    path("archive/<int:year>/<int:month>/", views.archive, name="archive"),
]
```
Caption: URL converters and include

### Common Pitfalls

- Hard-coding URL strings like `/blog/42/` instead of using `reverse()` — when you change URL patterns later, every hard-coded link breaks; use `{% url %}` and `reverse()`.
- Forgetting `app_name` in the app's urls.py and then `reverse("blog:detail")` raises NoReverseMatch — set `app_name = "blog"` at the top of blog/urls.py.
- Using `request.GET["key"]` instead of `request.GET.get("key")` — the bracket form raises MultiValueDictKeyError on missing keys; use .get() with a default.
- Putting the catch-all path `path("", ...)` at the top of urlpatterns — it shadows everything below; URL patterns are matched top-down.
- Confusing `request.POST` (form-encoded body) with JSON request bodies — for `application/json`, you must `json.loads(request.body)` yourself; Django doesn't auto-parse JSON.

### Real-World Applications

- Disqus routes 35M+ comments/day through Django URLconfs; their `disqus.com/next/` view serves 100k QPS via FBVs behind Varnish.
- Mozilla uses namespaced URLs across hundreds of apps in MDN; reverse() keeps links intact during refactors.
- Eventbrite's ticket-flow URLs are heavily namespaced (`events:attendees:check_in`) to support multi-team development.
- The Washington Post's page-rendering stack uses FBVs for many of its reader-facing endpoints because of granular control over caching headers.

### Interview Questions

- 1. What's the difference between path() and re_path()? — path() uses path converters (int, slug, uuid); re_path() takes a raw regex. Prefer path() unless you need a regex.
- 2. What does `include("blog.urls", namespace="blog")` do? — Delegates a URL prefix to another URLconf and namespaces the names so `reverse("blog:detail")` works.
- 3. How does Django process a request through middleware? — process_request -> process_view -> view -> process_template_response -> process_response, in MIDDLEWARE order (response phase runs in reverse).
- 4. What's the difference between request.GET and request.POST? — Both are QueryDicts; GET comes from the query string, POST from form-encoded body. JSON bodies live in request.body.
- 5. When would you use JsonResponse vs HttpResponse? — JsonResponse sets Content-Type: application/json and JSON-encodes the data; HttpResponse is for raw bytes/strings.

### Mini Project

Build a URL Shortener Core: A Django app `shorty` with a single model `ShortUrl(code, long_url)`, an FBV `POST /shorten/` that creates a random 6-char code and redirects, and `GET /<code>/` that issues a 302 to the long_url. Suggested approach:
  - startapp shorty, add to INSTALLED_APPS, write the ShortUrl model
  - Generate codes with `secrets.token_urlsafe(6)` and handle IntegrityError on the unique code
  - Use `redirect(long_url)` for the 302 response and `get_object_or_404` for missing codes
  - Add a `visit_count` IntegerField and increment with `F("visit_count") + 1` to avoid race conditions
  - Use `reverse("shorty:redirect", kwargs={"code": code})` to build the short URL in tests

### Exercises

1. Create a URL pattern that matches `/articles/2024/03/` and renders a year/month archive; use `int` converters.
2. Add a `slug` converter route `/articles/<slug:slug>/` and confirm it rejects slugs with slashes.
3. Build a JSON endpoint `/api/whoami/` that returns `{"user": request.user.username, "ip": request.META["REMOTE_ADDR"]}`.
4. Use `reverse()` in the Django shell to print the URL for a fake pk=7.
5. Write a tiny middleware that adds `X-Server-Timing: 12ms` to every response.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which path converter matches only positive integers?
9. A) str
10. B) int (*)
11. C) slug
12. D) path
13. Explanation: int matches one or more ASCII digits and converts to a Python int. str matches any non-slash string. slug matches [-a-zA-Z0-9_]+. path matches everything including slashes.
14. Q2: In which order does middleware run during the response phase?
15. A) Top-to-bottom as listed in MIDDLEWARE
16. B) Alphabetically by class name
17. C) Bottom-to-top (reverse of MIDDLEWARE order) (*)
18. D) Random order
19. Explanation: process_request and process_view run top-to-bottom; process_response and process_template_response run bottom-to-top so the first-listed middleware wraps the whole request.
20. Q3: Which exception is raised by `request.GET["missing_key"]` when the key isn't present?
21. A) KeyError
22. B) AttributeError
23. C) IndexError
24. D) MultiValueDictKeyError (*)
25. Explanation: QueryDict subclasses MultiValueDict; bracket access raises MultiValueDictKeyError (a subclass of KeyError). Use .get() for safety.
26. Q4: How do you reverse a namespaced URL `blog:detail` with pk=7?
27. A) reverse("blog:detail", kwargs={"pk": 7}) (*)
28. B) reverse("blog/detail", args=[7])
29. C) reverse_url("blog.detail", pk=7)
30. D) url_for("blog/detail", 7)
31. Explanation: Namespaced URLs use a colon; pass URL parameters via kwargs= for keyword args or args= for positional.
32. Q5: Which helper returns 404 if the object doesn't exist?
33. A) get_or_404
34. B) get_object_or_404 (*)
35. C) get_or_none
36. D) filter_or_404
37. Explanation: get_object_or_404 wraps Model.objects.get and raises Http404 on DoesNotExist. get_or_create is different — it creates if missing.
38. Q6: What's the correct way to read a JSON request body in Django?
39. A) request.json
40. B) request.POST
41. C) json.loads(request.body) (*)
42. D) request.data
43. Explanation: Django auto-parses only form-encoded POST bodies. For application/json, parse request.body yourself. (DRF adds request.data.)
44. Q7: What does `include("blog.urls", namespace="blog")` require inside blog/urls.py?
45. A) A `namespace` variable
46. B) A `urlpatterns` variable only
47. C) Nothing — namespaces are auto-detected
48. D) An `app_name` variable (*)
49. Explanation: When using include() with namespace, the included URLconf must define `app_name` (since Django 1.10) so the namespace is declared once at the source.
50. Q8: Which response class sets Content-Type: application/json automatically?
51. A) JsonResponse (*)
52. B) HttpResponse
53. C) HttpResponseJSON
54. D) JSONResponse
55. Explanation: JsonResponse takes a dict (or list with safe=False), serializes via json.dumps, and sets Content-Type: application/json.
56. Q9: What's the difference between path() and re_path()?
57. A) path() is faster because it uses C
58. B) re_path() uses regex; path() uses path converters (*)
59. C) re_path() is async-only
60. D) There's no difference
61. Explanation: path() uses converters like <int:pk>; re_path() takes a raw regex like r"^articles/(?P<pk>\d+)/$". Use path() unless you need full regex power.
62. Q10: Why is `redirect("blog:detail", pk=7)` preferred over `HttpResponseRedirect("/blog/7/")`?
63. A) It's shorter
64. B) It returns 301 instead of 302
65. C) It uses reverse() internally so URLs stay DRY and refactoring-safe (*)
66. D) It bypasses middleware
67. Explanation: redirect() calls reverse() to build the URL from the name, so changing urlpatterns never breaks the link.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which path converter matches only positive integers?
  options:
    - str
    - int
    - slug
    - path
  correctIndex: 1
  explanation: int matches one or more ASCII digits and converts to a Python int. str matches any non-slash string. slug matches [-a-zA-Z0-9_]+. path matches everything including slashes.
- id: q2
  question: In which order does middleware run during the response phase?
  options:
    - Top-to-bottom as listed in MIDDLEWARE
    - Alphabetically by class name
    - Bottom-to-top (reverse of MIDDLEWARE order)
    - Random order
  correctIndex: 2
  explanation: process_request and process_view run top-to-bottom; process_response and process_template_response run bottom-to-top so the first-listed middleware wraps the whole request.
- id: q3
  question: Which exception is raised by `request.GET["missing_key"]` when the key isn't present?
  options:
    - KeyError
    - AttributeError
    - IndexError
    - MultiValueDictKeyError
  correctIndex: 3
  explanation: QueryDict subclasses MultiValueDict; bracket access raises MultiValueDictKeyError (a subclass of KeyError). Use .get() for safety.
- id: q4
  question: How do you reverse a namespaced URL `blog:detail` with pk=7?
  options:
    - 'reverse("blog:detail", kwargs={"pk": 7})'
    - reverse("blog/detail", args=[7])
    - reverse_url("blog.detail", pk=7)
    - url_for("blog/detail", 7)
  correctIndex: 0
  explanation: Namespaced URLs use a colon; pass URL parameters via kwargs= for keyword args or args= for positional.
- id: q5
  question: Which helper returns 404 if the object doesn't exist?
  options:
    - get_or_404
    - get_object_or_404
    - get_or_none
    - filter_or_404
  correctIndex: 1
  explanation: get_object_or_404 wraps Model.objects.get and raises Http404 on DoesNotExist. get_or_create is different — it creates if missing.
- id: q6
  question: What's the correct way to read a JSON request body in Django?
  options:
    - request.json
    - request.POST
    - json.loads(request.body)
    - request.data
  correctIndex: 2
  explanation: Django auto-parses only form-encoded POST bodies. For application/json, parse request.body yourself. (DRF adds request.data.)
- id: q7
  question: What does `include("blog.urls", namespace="blog")` require inside blog/urls.py?
  options:
    - A `namespace` variable
    - A `urlpatterns` variable only
    - Nothing — namespaces are auto-detected
    - An `app_name` variable
  correctIndex: 3
  explanation: When using include() with namespace, the included URLconf must define `app_name` (since Django 1.10) so the namespace is declared once at the source.
- id: q8
  question: "Which response class sets Content-Type: application/json automatically?"
  options:
    - JsonResponse
    - HttpResponse
    - HttpResponseJSON
    - JSONResponse
  correctIndex: 0
  explanation: "JsonResponse takes a dict (or list with safe=False), serializes via json.dumps, and sets Content-Type: application/json."
- id: q9
  question: What's the difference between path() and re_path()?
  options:
    - path() is faster because it uses C
    - re_path() uses regex; path() uses path converters
    - re_path() is async-only
    - There's no difference
  correctIndex: 1
  explanation: path() uses converters like <int:pk>; re_path() takes a raw regex like r"^articles/(?P<pk>\d+)/$". Use path() unless you need full regex power.
- id: q10
  question: Why is `redirect("blog:detail", pk=7)` preferred over `HttpResponseRedirect("/blog/7/")`?
  options:
    - It's shorter
    - It returns 301 instead of 302
    - It uses reverse() internally so URLs stay DRY and refactoring-safe
    - It bypasses middleware
  correctIndex: 2
  explanation: redirect() calls reverse() to build the URL from the name, so changing urlpatterns never breaks the link.
```

