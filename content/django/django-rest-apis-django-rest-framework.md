---
slug: django-rest-apis-django-rest-framework
id: django-12
track: django
order: 12
title: REST APIs with Django REST Framework
description: Build REST APIs with Django REST Framework (DRF) — serializers, viewsets, routers, authentication, permissions, and pagination. Learn to ship a public API with proper status codes and versioning.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=540s
whyItMatters: Build REST APIs with Django REST Framework (DRF) — serializers, viewsets, routers, authentication, permissions, and pagination. Learn to ship a public API with proper status codes and versioning.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# REST APIs with Django REST Framework

## REST APIs with Django REST Framework

### Why It Matters

Build REST APIs with Django REST Framework (DRF) — serializers, viewsets, routers, authentication, permissions, and pagination. Learn to ship a public API with proper status codes and versioning.

Build REST APIs with Django REST Framework (DRF) — serializers, viewsets, routers, authentication, permissions, and pagination. Learn to ship a public API with proper status codes and versioning.

### Prerequisites

- Stage 4 (Models), Stage 7 (CBVs), Stage 8 (Auth)
- Comfort with JSON and HTTP verbs (GET/POST/PUT/PATCH/DELETE).

### Topics

- DRF installation and REST_FRAMEWORK settings
- Serializers: Serializer vs ModelSerializer
- Serializer fields, validation (validate_<field>, validate)
- ViewSets and ModelViewSet
- Router (DefaultRouter, SimpleRouter) for URL generation
- Authentication: SessionAuth, TokenAuth, JWT (djangorestframework-simplejwt)
- Permissions: IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly, custom
- Pagination: PageNumberPagination, LimitOffsetPagination, CursorPagination
- Throttling and rate limits

### Key Concepts

- A Serializer converts model instances <-> JSON (and validates input).
- A ViewSet groups CRUD actions (list, create, retrieve, update, destroy) into one class.
- A Router auto-generates URLs from a ViewSet.
- DRF's request.data is the parsed body (works for JSON, form, multipart).
- Authentication identifies the user; permissions decide if they can do the action.

```bash
pip install djangorestframework djangorestframework-simplejwt
# Add "rest_framework" to INSTALLED_APPS
```
Caption: Install + settings

### Common Pitfalls

- Using `Model.objects.all()` as the queryset on a ViewSet without select_related — N+1 on the serializer's nested fields; override get_queryset or pre-join.
- Forgetting `perform_create` to set the user — serializer.save() without author defaults to NULL/raises IntegrityError; inject from request.user.
- Exposing unsafe methods (PUT/DELETE) without permission_classes — anyone can edit; default to IsAuthenticatedOrReadOnly and tighten from there.
- Returning nested writes via the same serializer — DRF's nested writes are read-only by default; use a separate write serializer or drf-writable-nested.
- Sending JSON without Content-Type: application/json — DRF silently treats it as form data; client must set the header.

### Real-World Applications

- Instagram's public API was Django + DRF (tastypie before) early on; mobile clients consumed it.
- Mozilla's Add-ons API (addons.mozilla.org) is DRF with custom permissions per add-on owner.
- Disqus's public API (disqus.com/api) is DRF with token auth and heavy throttling.
- Eventbrite's v3 API is DRF; the SDK clients (Python/Ruby/PHP) target it.

### Interview Questions

- 1. What's the difference between Serializer and ModelSerializer? — ModelSerializer auto-generates fields from a Meta.model; Serializer requires you to declare every field.
- 2. What does perform_create do? — Hook called by create() between serializer.is_valid() and serializer.save(); use it to inject request-dependent fields like author=request.user.
- 3. How do you do object-level permissions in DRF? — Subclass BasePermission, implement has_object_permission(self, request, view, obj); set permission_classes on the view.
- 4. What's the difference between JWT and TokenAuth? — Token is a single static string stored in DB; JWT is a signed token with expiry (access + refresh). JWT scales better; Token is simpler.
- 5. How do you paginate a list endpoint? — Set DEFAULT_PAGINATION_CLASS in REST_FRAMEWORK (PageNumberPagination) or set pagination_class on the view. CursorPagination is best for large ordered sets.

### Mini Project

Build a Public Blog API: A read-only `/api/posts/` (list + retrieve) and authenticated `/api/posts/<slug>/comments/` POST endpoint. Use JWT for auth, PageNumberPagination (20/page), and a custom IsAuthorOrReadOnly permission. Suggested approach:
  - PostSerializer + CommentSerializer
  - PostViewSet (read-only via ReadOnlyModelViewSet)
  - CommentViewSet with perform_create(self, serializer): serializer.save(author=request.user)
  - Wire JWT token endpoints + a /api/me/ view that returns the current user
  - Add throttle rates: anon 100/day, user 1000/day

### Exercises

1. Install DRF, expose a read-only /api/users/ endpoint with pagination.
2. Add JWT auth and protect /api/me/ with IsAuthenticated.
3. Write a custom permission that only allows owners to delete their posts.
4. Add filterset_fields for status + author on the post list endpoint.
5. Use @action(detail=True) to add a custom /api/posts/<slug>/publish/ endpoint.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which DRF class auto-generates fields from a model?
9. A) Serializer
10. B) FormSerializer
11. C) AutoSerializer
12. D) ModelSerializer (*)
13. Explanation: ModelSerializer reads Meta.model and Meta.fields to auto-build fields. Serializer requires you to declare each field.
14. Q2: Which method should you override to set the author on create?
15. A) perform_create() (*)
16. B) create()
17. C) save()
18. D) pre_save()
19. Explanation: perform_create(self, serializer) is called after is_valid() and before save(); call serializer.save(author=self.request.user).
20. Q3: Which viewset class provides full CRUD?
21. A) ReadOnlyModelViewSet
22. B) ModelViewSet (*)
23. C) CRUDViewSet
24. D) FullViewSet
25. Explanation: ModelViewSet includes list, create, retrieve, update, partial_update, destroy. ReadOnlyModelViewSet only has list + retrieve.
26. Q4: Which class auto-generates URLs for a ViewSet?
27. A) URLRouter
28. B) AutoURL
29. C) DefaultRouter (*)
30. D) URLGenerator
31. Explanation: router.register("posts", PostViewSet) generates /posts/ and /posts/<pk>/. DefaultRouter also adds an API root view.
32. Q5: What does IsAuthenticatedOrReadOnly allow?
33. A) Anyone can do anything
34. B) Only superusers can read
35. C) Only staff can read
36. D) Anonymous users can do GET/HEAD/OPTIONS; only authenticated users can POST/PUT/DELETE (*)
37. Explanation: SAFE_METHODS = GET, HEAD, OPTIONS are allowed for anyone; unsafe methods require IsAuthenticated.
38. Q6: How does DRF parse a JSON body?
39. A) Automatically into request.data (*)
40. B) Manually via request.body
41. C) Into request.POST
42. D) Into request.json
43. Explanation: DRF's Request object parses JSON, form, and multipart into request.data based on Content-Type.
44. Q7: What's the difference between TokenAuth and JWT?
45. A) Both are the same
46. B) Token is a static DB-stored string; JWT is a signed token with expiry and refresh (*)
47. C) JWT is faster
48. D) Token is for admin only
49. Explanation: Token auth requires a DB lookup per request; JWT is stateless (signed). JWT scales better but is harder to revoke.
50. Q8: Which pagination class is best for very large ordered sets?
51. A) PageNumberPagination
52. B) LimitOffsetPagination
53. C) CursorPagination (*)
54. D) NoPagination
55. Explanation: CursorPagination uses an opaque cursor (usually a timestamp/id), so inserts during pagination don't shift results. Avoids the "skip is slow" problem of offset pagination.
56. Q9: How do you add a custom action like /posts/<pk>/publish/?
57. A) @api_action
58. B) Define a publish() method on the viewset
59. C) Add it to extra_actions
60. D) @action(detail=True, methods=["post"]) (*)
61. Explanation: @action(detail=True, methods=["post"]) on a viewset method adds a custom URL. detail=True means it's on a single object.
62. Q10: What does has_object_permission do?
63. A) Checks if the user can act on a specific object instance (e.g., owner check) (*)
64. B) Checks if the user can access the view at all
65. C) Validates the serializer
66. D) Sets object-level caching
67. Explanation: has_permission runs first (view-level); has_object_permission runs when get_object() is called (retrieve/update/destroy). Use it for owner checks.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which DRF class auto-generates fields from a model?
  options:
    - Serializer
    - FormSerializer
    - AutoSerializer
    - ModelSerializer
  correctIndex: 3
  explanation: ModelSerializer reads Meta.model and Meta.fields to auto-build fields. Serializer requires you to declare each field.
- id: q2
  question: Which method should you override to set the author on create?
  options:
    - perform_create()
    - create()
    - save()
    - pre_save()
  correctIndex: 0
  explanation: perform_create(self, serializer) is called after is_valid() and before save(); call serializer.save(author=self.request.user).
- id: q3
  question: Which viewset class provides full CRUD?
  options:
    - ReadOnlyModelViewSet
    - ModelViewSet
    - CRUDViewSet
    - FullViewSet
  correctIndex: 1
  explanation: ModelViewSet includes list, create, retrieve, update, partial_update, destroy. ReadOnlyModelViewSet only has list + retrieve.
- id: q4
  question: Which class auto-generates URLs for a ViewSet?
  options:
    - URLRouter
    - AutoURL
    - DefaultRouter
    - URLGenerator
  correctIndex: 2
  explanation: router.register("posts", PostViewSet) generates /posts/ and /posts/<pk>/. DefaultRouter also adds an API root view.
- id: q5
  question: What does IsAuthenticatedOrReadOnly allow?
  options:
    - Anyone can do anything
    - Only superusers can read
    - Only staff can read
    - Anonymous users can do GET/HEAD/OPTIONS; only authenticated users can POST/PUT/DELETE
  correctIndex: 3
  explanation: SAFE_METHODS = GET, HEAD, OPTIONS are allowed for anyone; unsafe methods require IsAuthenticated.
- id: q6
  question: How does DRF parse a JSON body?
  options:
    - Automatically into request.data
    - Manually via request.body
    - Into request.POST
    - Into request.json
  correctIndex: 0
  explanation: DRF's Request object parses JSON, form, and multipart into request.data based on Content-Type.
- id: q7
  question: What's the difference between TokenAuth and JWT?
  options:
    - Both are the same
    - Token is a static DB-stored string; JWT is a signed token with expiry and refresh
    - JWT is faster
    - Token is for admin only
  correctIndex: 1
  explanation: Token auth requires a DB lookup per request; JWT is stateless (signed). JWT scales better but is harder to revoke.
- id: q8
  question: Which pagination class is best for very large ordered sets?
  options:
    - PageNumberPagination
    - LimitOffsetPagination
    - CursorPagination
    - NoPagination
  correctIndex: 2
  explanation: CursorPagination uses an opaque cursor (usually a timestamp/id), so inserts during pagination don't shift results. Avoids the "skip is slow" problem of offset pagination.
- id: q9
  question: How do you add a custom action like /posts/<pk>/publish/?
  options:
    - "@api_action"
    - Define a publish() method on the viewset
    - Add it to extra_actions
    - '@action(detail=True, methods=["post"])'
  correctIndex: 3
  explanation: "@action(detail=True, methods=[\"post\"]) on a viewset method adds a custom URL. detail=True means it's on a single object."
- id: q10
  question: What does has_object_permission do?
  options:
    - Checks if the user can act on a specific object instance (e.g., owner check)
    - Checks if the user can access the view at all
    - Validates the serializer
    - Sets object-level caching
  correctIndex: 0
  explanation: has_permission runs first (view-level); has_object_permission runs when get_object() is called (retrieve/update/destroy). Use it for owner checks.
```

