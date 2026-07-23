---
slug: django-class-based-views
id: django-07
track: django
order: 7
title: Class-Based Views
description: Master Django's class-based views (CBVs) — View, TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView — and the mixin architecture. Learn to override get_queryset, get_context_data, form_valid, and dispatch.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=240s
whyItMatters: Master Django's class-based views (CBVs) — View, TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView — and the mixin architecture. Learn to override get_queryset, get_context_data, form_valid, and dispatch.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Class-Based Views

## Class-Based Views

### Why It Matters

Master Django's class-based views (CBVs) — View, TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView — and the mixin architecture. Learn to override get_queryset, get_context_data, form_valid, and dispatch.

Master Django's class-based views (CBVs) — View, TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView — and the mixin architecture. Learn to override get_queryset, get_context_data, form_valid, and dispatch.

### Prerequisites

- Stage 2 (URLs/Views), Stage 4 (Models), Stage 6 (Forms)
- Comfort with Python class inheritance and super().

### Topics

- View and the HTTP method dispatch (get, post, put, delete)
- TemplateView, RedirectView
- ListView: paginate_by, get_queryset, get_context_data
- DetailView: get_object, slug_url_kwarg, slug_field
- CreateView, UpdateView, DeleteView and the ModelForm integration
- LoginRequiredMixin, PermissionRequiredMixin, UserPassesTestMixin
- Mixin composition order (MRO matters!)
- get_success_url, form_valid, form_invalid

### Key Concepts

- CBVs map HTTP methods to methods: GET -> get(), POST -> post() — automatic dispatch.
- Mixins provide reusable behavior; the leftmost class in the MRO wins.
- `self.request`, `self.args`, `self.kwargs` are available in every method.
- `get_context_data(**kwargs)` is how you add template variables.
- LoginRequiredMixin must come first in the bases list to gate dispatch before other mixins.

```python
# blog/views.py
from django.views.generic import ListView
from .models import Post

class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(status="published").select_related("author")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["now"] = timezone.now()
        return ctx
```
Caption: ListView with pagination

### Common Pitfalls

- Mixing LoginRequiredMixin AFTER another mixin that does dispatch — order matters; LoginRequiredMixin must be LEFTMOST so it gates access before others run.
- Forgetting `as_view()` in URLconf — `path("", PostListView)` raises TypeError; CBVs need `.as_view()`.
- Not calling super().get_context_data(**kwargs) — wipes out paginator/previous context data; always chain.
- Overriding `get()` in a ListView to filter — the right hook is `get_queryset()`; overriding get() bypasses pagination and template rendering.
- Using `self.request.user.is_staff` in get_queryset without checking `is_authenticated` first — AnonymousUser has is_staff=False, but explicit check is clearer and avoids subtle bugs in custom user models.

### Real-World Applications

- Mozilla SUMO uses CBVs heavily for the question/answer pages with deep mixin stacks (cache + perms + rate limit).
- Eventbrite's organizer dashboard uses CreateView/UpdateView mixins for event and ticket CRUD with custom form_valid hooks.
- Disqus uses CBVs for moderation queues with UserPassesTestMixin gating staff-only actions.
- Instagram's web admin uses generic CBVs for internal moderation tools where consistency matters more than micro-performance.

### Interview Questions

- 1. What's the MRO and why does it matter for CBVs? — Method Resolution Order determines which class's method runs first; mixins left of the main view class take precedence.
- 2. When do you override get_queryset vs get_object? — get_queryset for list views (filter the collection); get_object for detail views (override the single-object lookup).
- 3. What does form_valid(form) typically do? — Saves the form (form.save()), sets self.object, and redirects to get_success_url().
- 4. Why must LoginRequiredMixin be the leftmost base? — Its dispatch() checks login before delegating; if it's not first, other mixins' dispatch might run unauthorized.
- 5. How do you add extra context in a CBV? — Override get_context_data(**kwargs), call super(), add to ctx, return ctx.

### Mini Project

Build a CRUD App with CBVs: A Bookmark model (url, title, owner, created_at). Use ListView, DetailView, CreateView, UpdateView, DeleteView with LoginRequiredMixin. Limit list/edit to the user's own bookmarks. Suggested approach:
  - Bookmark model with `owner = FK(User)` and `get_absolute_url`
  - BookmarkListView: get_queryset filters `owner=request.user`
  - BookmarkCreateView: form_valid sets owner=request.user
  - BookmarkUpdateView: UserPassesTestMixin checks owner==request.user
  - BookmarkDeleteView: success_url = reverse_lazy("bookmarks:list")

### Exercises

1. Convert a FBV list view to ListView; preserve pagination.
2. Add LoginRequiredMixin to a CreateView and confirm anonymous users get redirected to /login/.
3. Override get_context_data to add a "recent_posts" sidebar list.
4. Use UserPassesTestMixin to restrict UpdateView to the object's owner.
5. Override get_success_url to redirect to the detail page after create.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What method must you call in URLconf to use a CBV?
9. A) .view()
10. B) .render()
11. C) .as_view() (*)
12. D) .dispatch()
13. Explanation: CBVs are classes; .as_view() returns a callable that Django can invoke with a request. The callable creates an instance and calls dispatch().
14. Q2: Which method on a ListView should you override to filter the queryset?
15. A) get()
16. B) get_object()
17. C) filter()
18. D) get_queryset() (*)
19. Explanation: get_queryset returns the queryset used for both list rendering and pagination count. Overriding get() bypasses pagination.
20. Q3: In what order should mixins be listed?
21. A) LoginRequiredMixin leftmost, then other mixins, then the view class (*)
22. B) Alphabetically
23. C) View class first, mixins last
24. D) Doesn't matter
25. Explanation: LoginRequiredMixin.dispatch must run first to gate access. Mixins precede the main view class so their methods can override.
26. Q4: Which method handles a successful form submission in CreateView?
27. A) form_invalid()
28. B) form_valid() (*)
29. C) save()
30. D) success()
31. Explanation: form_valid(form) saves the form, sets self.object, and returns a redirect to get_success_url(). Override to inject extra logic.
32. Q5: How do you add a template variable in a CBV?
33. A) Override get_template()
34. B) Set self.context
35. C) Override get_context_data() and add to the dict (*)
36. D) Pass it in as_view()
37. Explanation: get_context_data(**kwargs) returns the template context. Always call super() first and merge.
38. Q6: Which CBV displays a single object by pk or slug?
39. A) ListView
40. B) SingleView
41. C) ShowView
42. D) DetailView (*)
43. Explanation: DetailView fetches one object via get_object_or_404 using pk_url_kwarg or slug_url_kwarg from the URL.
44. Q7: What's the correct way to set the redirect target after a CreateView save?
45. A) Override get_success_url() or set success_url (*)
46. B) Set self.redirect
47. C) Return a string from form_valid
48. D) Use redirect_to attribute
49. Explanation: get_success_url() is called by form_valid; you can set success_url = "/" or override the method for dynamic URLs (e.g., return self.object.get_absolute_url()).
50. Q8: What does UserPassesTestMixin require you to implement?
51. A) check_user()
52. B) test_func() returning a bool (*)
53. C) has_permission()
54. D) permission_required
55. Explanation: test_func(self) returns True/False; False -> 403 (or redirect to login if raise_exception=False). Used for object-level checks.
56. Q9: What does self.kwargs contain in a CBV?
57. A) The model's kwargs
58. B) The form's kwargs
59. C) URL keyword arguments captured by path converters (*)
60. D) Settings overrides
61. Explanation: For path("post/<int:pk>/"), self.kwargs == {"pk": 42}. Use it in get_object/get_queryset to filter.
62. Q10: Why is overriding get() in a ListView usually wrong?
63. A) get() doesn't exist in ListView
64. B) It triggers an extra query
65. C) It conflicts with as_view()
66. D) It bypasses pagination and context setup that the BaseListView's get provides (*)
67. Explanation: ListView's get() calls get_queryset(), paginates, and renders. Bypassing it with a custom get() means re-implementing all of that — prefer get_queryset or get_context_data.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What method must you call in URLconf to use a CBV?
  options:
    - .view()
    - .render()
    - .as_view()
    - .dispatch()
  correctIndex: 2
  explanation: CBVs are classes; .as_view() returns a callable that Django can invoke with a request. The callable creates an instance and calls dispatch().
- id: q2
  question: Which method on a ListView should you override to filter the queryset?
  options:
    - get()
    - get_object()
    - filter()
    - get_queryset()
  correctIndex: 3
  explanation: get_queryset returns the queryset used for both list rendering and pagination count. Overriding get() bypasses pagination.
- id: q3
  question: In what order should mixins be listed?
  options:
    - LoginRequiredMixin leftmost, then other mixins, then the view class
    - Alphabetically
    - View class first, mixins last
    - Doesn't matter
  correctIndex: 0
  explanation: LoginRequiredMixin.dispatch must run first to gate access. Mixins precede the main view class so their methods can override.
- id: q4
  question: Which method handles a successful form submission in CreateView?
  options:
    - form_invalid()
    - form_valid()
    - save()
    - success()
  correctIndex: 1
  explanation: form_valid(form) saves the form, sets self.object, and returns a redirect to get_success_url(). Override to inject extra logic.
- id: q5
  question: How do you add a template variable in a CBV?
  options:
    - Override get_template()
    - Set self.context
    - Override get_context_data() and add to the dict
    - Pass it in as_view()
  correctIndex: 2
  explanation: get_context_data(**kwargs) returns the template context. Always call super() first and merge.
- id: q6
  question: Which CBV displays a single object by pk or slug?
  options:
    - ListView
    - SingleView
    - ShowView
    - DetailView
  correctIndex: 3
  explanation: DetailView fetches one object via get_object_or_404 using pk_url_kwarg or slug_url_kwarg from the URL.
- id: q7
  question: What's the correct way to set the redirect target after a CreateView save?
  options:
    - Override get_success_url() or set success_url
    - Set self.redirect
    - Return a string from form_valid
    - Use redirect_to attribute
  correctIndex: 0
  explanation: get_success_url() is called by form_valid; you can set success_url = "/" or override the method for dynamic URLs (e.g., return self.object.get_absolute_url()).
- id: q8
  question: What does UserPassesTestMixin require you to implement?
  options:
    - check_user()
    - test_func() returning a bool
    - has_permission()
    - permission_required
  correctIndex: 1
  explanation: test_func(self) returns True/False; False -> 403 (or redirect to login if raise_exception=False). Used for object-level checks.
- id: q9
  question: What does self.kwargs contain in a CBV?
  options:
    - The model's kwargs
    - The form's kwargs
    - URL keyword arguments captured by path converters
    - Settings overrides
  correctIndex: 2
  explanation: 'For path("post/<int:pk>/"), self.kwargs == {"pk": 42}. Use it in get_object/get_queryset to filter.'
- id: q10
  question: Why is overriding get() in a ListView usually wrong?
  options:
    - get() doesn't exist in ListView
    - It triggers an extra query
    - It conflicts with as_view()
    - It bypasses pagination and context setup that the BaseListView's get provides
  correctIndex: 3
  explanation: ListView's get() calls get_queryset(), paginates, and renders. Bypassing it with a custom get() means re-implementing all of that — prefer get_queryset or get_context_data.
```

