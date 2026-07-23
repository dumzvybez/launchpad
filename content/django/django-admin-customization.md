---
slug: django-admin-customization
id: django-11
track: django
order: 11
title: Admin Customization
description: "Customize Django's admin: list displays, filters, search, inlines, actions, and custom admin templates. Build a usable back-office UI for non-technical staff."
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=480s
whyItMatters: "Customize Django's admin: list displays, filters, search, inlines, actions, and custom admin templates. Build a usable back-office UI for non-technical staff."
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Admin Customization

## Admin Customization

### Why It Matters

Customize Django's admin: list displays, filters, search, inlines, actions, and custom admin templates. Build a usable back-office UI for non-technical staff.

Customize Django's admin: list displays, filters, search, inlines, actions, and custom admin templates. Build a usable back-office UI for non-technical staff.

### Prerequisites

- Stage 4 (Models), Stage 8 (Auth)
- Comfort with ModelAdmin registration.

### Topics

- register(Model) vs @admin.register(Model)
- list_display, list_filter, search_fields, list_editable, list_per_page
- prepopulated_fields (auto-slug), readonly_fields
- Fieldsets for organizing the form
- Inlines: TabularInline, StackedInline
- Custom admin actions (@admin.action)
- get_queryset overrides for tenant-aware admin
- Custom admin templates (extending admin/base_site.html)

### Key Concepts

- The admin is for trusted staff only — never expose it to public users.
- list_display must use field names or callables on the ModelAdmin.
- search_fields use ORM lookups (`title__icontains`, `author__username`).
- Inlines add child objects on the parent's edit page; limit with `extra`.
- Actions appear in the dropdown on the list page; they take request, queryset.

```python
# blog/admin.py
from django.contrib import admin
from .models import Post, Tag, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "published_at", "tag_list")
    list_filter = ("status", "created_at", "author")
    search_fields = ("title", "body", "author__username")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("status",)
    date_hierarchy = "published_at"
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("title", "slug", "author")}),
        ("Content", {"fields": ("body", "tags")}),
        ("Publishing", {"fields": ("status", "published_at"),
                        "classes": ("collapse",)}),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(author=request.user)

    def tag_list(self, obj):
        return ", ".join(t.name for t in obj.tags.all())
    tag_list.short_description = "Tags"

    @admin.action(description="Publish selected posts")
    def publish(self, request, queryset):
        queryset.update(status="published", published_at=timezone.now())
    actions = ["publish"]
```
Caption: Basic ModelAdmin

### Common Pitfalls

- Forgetting to register a model — the model silently doesn't appear in admin; either @admin.register(Model) on the class or admin.site.register(Model, ModelAdmin).
- Adding a method to list_display that does heavy queries — `tag_list` from above will N+1 on every row; fix with `get_queryset(...).prefetch_related("tags")`.
- Exposing admin at /admin/ with a weak superuser password — bot scanners hit /admin/ 24/7; use a long random password and 2FA (django-otp).
- list_editable on a field that's also in list_display links — Django rejects having the link field editable; use a separate field for the link.
- Customizing admin templates in the wrong place — copy from django/contrib/admin/templates/admin/ into your project's templates/admin/ and override by name; don't edit Django's source.

### Real-World Applications

- Disqus uses a heavily customized Django admin for the moderation team — custom actions for "approve all from this user", "ban user", etc.
- Mozilla SUMO's admin is the daily tool for KB editors; it has custom inlines and permission-gated actions.
- Eventbrite's internal admin uses Django admin for ops tooling (refund approvals, fraud queues).
- Pinterest used Django admin early on for content moderation before building a custom React dashboard.

### Interview Questions

- 1. What's the difference between admin.site.register(M) and @admin.register(M)? — They're equivalent; the decorator form is preferred when defining a ModelAdmin in the same statement.
- 2. How do you add a custom column to the list view? — Define a method on ModelAdmin returning the value, add it to list_display, set short_description for the header.
- 3. What does prepopulated_fields do? — Auto-fills the target field from the source fields via JavaScript (typically slug from title) in the admin form.
- 4. How do you scope the admin to the current user? — Override get_queryset(self, request) and filter by request.user (or request.tenant for multi-tenant).
- 5. When would you use a custom AdminSite? — When you need multiple admin instances (e.g., separate admin for ops vs moderators) or custom branding/permissions per group.

### Mini Project

Build a Moderation Queue Admin: A Comment model with a `flagged` BooleanField. Build a custom admin page that lists only flagged comments with actions "Approve", "Delete", "Ban user". Add a custom admin template that highlights flagged rows in red. Suggested approach:
  - Register Comment with list_filter=("flagged",), list_display=("body", "author", "flagged", "created_at")
  - get_queryset filters flagged=True on the default changelist (with a custom URL to view all)
  - @admin.action methods for approve (flagged=False) / delete / ban user (user.is_active=False)
  - Override change_list.html to add a CSS class to flagged rows
  - Add permission_required = "moderation.can_moderate"

### Exercises

1. Add list_display and list_filter to a Product admin; verify the changelist UI.
2. Add a custom action that marks selected products as "featured".
3. Use TabularInline to edit OrderItems on the Order admin.
4. Override get_queryset to scope Products to the current user's company.
5. Brand the admin with a custom site_header and a custom logo via base_site.html override.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which decorator registers a ModelAdmin with the default admin site?
9. A) @register(Model)
10. B) @admin.site(Model)
11. C) @admin.register(Model) (*)
12. D) @model_admin(Model)
13. Explanation: @admin.register(Post) on the class is equivalent to admin.site.register(Post, PostAdmin) at the bottom.
14. Q2: How do you add a custom column to the admin list view?
15. A) Use admin_display decorator
16. B) Override render_list
17. C) Add to list_columns
18. D) Add a field to list_display that matches a method name on ModelAdmin (*)
19. Explanation: Define a method returning the value, add it to list_display, set short_description for the column header.
20. Q3: What does prepopulated_fields = {"slug": ("title",)} do?
21. A) Auto-fills slug from title via JS as the user types (*)
22. B) Validates that slug matches title
23. C) Generates the slug on save in Python
24. D) Locks the slug field
25. Explanation: The admin injects JS that copies title into slug (with slugify) on keypress. It's a UI helper, not server-side.
26. Q4: Which attribute limits who can edit a model in admin?
27. A) allowed_groups
28. B) Override get_queryset(request) to filter by request.user (*)
29. C) admin_only = True
30. D) restrict_to = "staff"
31. Explanation: get_queryset(request) controls which rows appear. Combine with custom permissions to control who can use the admin at all.
32. Q5: What does a TabularInline do?
33. A) Deletes child objects
34. B) Imports a CSV inline
35. C) Edits child objects inline in a table layout on the parent's edit page (*)
36. D) Displays a tabbed admin
37. Explanation: TabularInline renders child rows as a table; StackedInline renders each as a stacked form block. Both edit children on the parent page.
38. Q6: How do you add a custom bulk action to the admin?
39. A) Override bulk_action method
40. B) Set custom_actions attribute
41. C) Use the action_view method
42. D) @admin.action decorator + add to actions list (*)
43. Explanation: Define a method with @admin.action(description="...") that takes (request, queryset); add its name to actions = ["publish"].
44. Q7: Which is true about admin security?
45. A) Admin should be for trusted staff only; lock it down with strong passwords, 2FA, and IP allowlists (*)
46. B) Admin is safe to expose publicly
47. C) Admin is automatically rate-limited
48. D) Admin requires no auth by default
49. Explanation: Bots hit /admin/ constantly. Use long random passwords, django-otp for 2FA, and consider hiding it behind a non-default URL.
50. Q8: Which list_display entry would cause an N+1?
51. A) "title"
52. B) A method that does `obj.tags.all()` (*)
53. C) "author" (a FK)
54. D) "created_at"
55. Explanation: Calling obj.tags.all() per row fires one query per row. Fix by overriding get_queryset to prefetch_related("tags").
56. Q9: How do you customize admin templates?
57. A) Edit Django's source files
58. B) Use template_actions
59. C) Copy the template into your project's templates/admin/ and override by name (*)
60. D) You can't customize them
61. Explanation: The Django template loader checks project templates first. Copy e.g. change_list.html from django/contrib/admin/templates/admin/ and edit.
62. Q10: What does readonly_fields do?
63. A) Hides the field from admin
64. B) Deletes the field
65. C) Adds a database constraint
66. D) Displays the field as read-only on the edit form (and can include computed methods) (*)
67. Explanation: readonly_fields shows the value but prevents editing. Useful for timestamps and computed values like "total_orders".
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which decorator registers a ModelAdmin with the default admin site?
  options:
    - "@register(Model)"
    - "@admin.site(Model)"
    - "@admin.register(Model)"
    - "@model_admin(Model)"
  correctIndex: 2
  explanation: "@admin.register(Post) on the class is equivalent to admin.site.register(Post, PostAdmin) at the bottom."
- id: q2
  question: How do you add a custom column to the admin list view?
  options:
    - Use admin_display decorator
    - Override render_list
    - Add to list_columns
    - Add a field to list_display that matches a method name on ModelAdmin
  correctIndex: 3
  explanation: Define a method returning the value, add it to list_display, set short_description for the column header.
- id: q3
  question: 'What does prepopulated_fields = {"slug": ("title",)} do?'
  options:
    - Auto-fills slug from title via JS as the user types
    - Validates that slug matches title
    - Generates the slug on save in Python
    - Locks the slug field
  correctIndex: 0
  explanation: The admin injects JS that copies title into slug (with slugify) on keypress. It's a UI helper, not server-side.
- id: q4
  question: Which attribute limits who can edit a model in admin?
  options:
    - allowed_groups
    - Override get_queryset(request) to filter by request.user
    - admin_only = True
    - restrict_to = "staff"
  correctIndex: 1
  explanation: get_queryset(request) controls which rows appear. Combine with custom permissions to control who can use the admin at all.
- id: q5
  question: What does a TabularInline do?
  options:
    - Deletes child objects
    - Imports a CSV inline
    - Edits child objects inline in a table layout on the parent's edit page
    - Displays a tabbed admin
  correctIndex: 2
  explanation: TabularInline renders child rows as a table; StackedInline renders each as a stacked form block. Both edit children on the parent page.
- id: q6
  question: How do you add a custom bulk action to the admin?
  options:
    - Override bulk_action method
    - Set custom_actions attribute
    - Use the action_view method
    - "@admin.action decorator + add to actions list"
  correctIndex: 3
  explanation: Define a method with @admin.action(description="...") that takes (request, queryset); add its name to actions = ["publish"].
- id: q7
  question: Which is true about admin security?
  options:
    - Admin should be for trusted staff only; lock it down with strong passwords, 2FA, and IP allowlists
    - Admin is safe to expose publicly
    - Admin is automatically rate-limited
    - Admin requires no auth by default
  correctIndex: 0
  explanation: Bots hit /admin/ constantly. Use long random passwords, django-otp for 2FA, and consider hiding it behind a non-default URL.
- id: q8
  question: Which list_display entry would cause an N+1?
  options:
    - '"title"'
    - A method that does `obj.tags.all()`
    - '"author" (a FK)'
    - '"created_at"'
  correctIndex: 1
  explanation: Calling obj.tags.all() per row fires one query per row. Fix by overriding get_queryset to prefetch_related("tags").
- id: q9
  question: How do you customize admin templates?
  options:
    - Edit Django's source files
    - Use template_actions
    - Copy the template into your project's templates/admin/ and override by name
    - You can't customize them
  correctIndex: 2
  explanation: The Django template loader checks project templates first. Copy e.g. change_list.html from django/contrib/admin/templates/admin/ and edit.
- id: q10
  question: What does readonly_fields do?
  options:
    - Hides the field from admin
    - Deletes the field
    - Adds a database constraint
    - Displays the field as read-only on the edit form (and can include computed methods)
  correctIndex: 3
  explanation: readonly_fields shows the value but prevents editing. Useful for timestamps and computed values like "total_orders".
```

