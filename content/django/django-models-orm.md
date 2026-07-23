---
slug: django-models-orm
id: django-04
track: django
order: 4
title: Models and the ORM
description: Define database models, run migrations, and use the ORM to create, read, update, and delete rows. Understand field types, relationships, Meta options, and the model lifecycle.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=60s
whyItMatters: Define database models, run migrations, and use the ORM to create, read, update, and delete rows. Understand field types, relationships, Meta options, and the model lifecycle.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Models and the ORM

## Models and the ORM

### Why It Matters

Define database models, run migrations, and use the ORM to create, read, update, and delete rows. Understand field types, relationships, Meta options, and the model lifecycle.

Define database models, run migrations, and use the ORM to create, read, update, and delete rows. Understand field types, relationships, Meta options, and the model lifecycle.

### Prerequisites

- Stage 1, 2, 3
- Basic SQL understanding (SELECT, INSERT, JOIN).

### Topics

- Model definition: CharField, TextField, IntegerField, DateTimeField, BooleanField, EmailField, UUIDField, JSONField
- Field options: null, blank, default, unique, choices, db_index, verbose_name
- Relationships: ForeignKey (M2O), OneToOneField, ManyToManyField
- Meta options: ordering, constraints, indexes, verbose_name, db_table
- Migrations: makemigrations, migrate, sqlmigrate, makemigrations --empty
- Model methods: __str__, save(), delete(), clean(), get_absolute_url()
- Model managers: objects (default) and custom managers
- on_delete options: CASCADE, PROTECT, SET_NULL, SET_DEFAULT, DO_NOTHING

### Key Concepts

- A model class maps to a database table; an instance maps to a row.
- ForeignKey creates a DB column with `_id` suffix and adds the reverse descriptor.
- Migrations are version control for your DB schema; commit them and review them in code review.
- `null=True` is database-level; `blank=True` is form-level. They're independent.
- Choices are now enums (models.TextChoices / IntegerChoices) since Django 3.0 — type-safe and IDE-friendly.

```python
# blog/models.py
import uuid
from django.db import models
from django.conf import settings

class Timestamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Post(Timestamped):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    tags = models.ManyToManyField("Tag", blank=True, related_name="posts")
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at"]
        indexes = [models.Index(fields=["status", "-published_at"])]
        constraints = [
            models.CheckConstraint(check=~models.Q(title=""), name="title_not_empty"),
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse("blog:detail", kwargs={"pk": self.pk})

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
```
Caption: Models with relationships

### Common Pitfalls

- Adding a custom manager and forgetting to also define `objects = Manager()` — once you add a custom manager, `objects` is no longer auto-added, breaking existing code.
- Confusing `null=True` with `blank=True` — null is the DB column constraint; blank controls form validation. For string fields, prefer `default=""` + `blank=True` over `null=True` (Django convention: avoid null strings).
- Forgetting `on_delete` on ForeignKey — it's required since Django 2.0; CASCADE deletes related rows, PROTECT raises ProtectedError, SET_NULL requires null=True.
- Calling `instance.save()` after every field change in a loop — causes N+1 writes; batch with bulk_update or F() expressions.
- Putting business logic in `save()` instead of a service module — makes testing harder and mixes concerns; save() should be for data integrity, not workflows.

### Real-World Applications

- Instagram's feed models use ForeignKey chains (User -> Post -> Comment -> Like) at massive scale; they shard by user_id.
- Disqus stores 35M+ comments/day on Django models with custom managers (e.g., `Thread.objects.flagged()`) for moderation queues.
- Mozilla's SUMO (support.mozilla.org) uses Django models for the KB article tree, questions, and KPI dashboards.
- Eventbrite's ticketing models use a custom manager to filter by event status and availability.

### Interview Questions

- 1. What's the difference between null=True and blank=True? — null controls the DB (nullable column); blank controls form validation (field can be empty).
- 2. What does on_delete=CASCADE do? — When the parent is deleted, all child rows referencing it are also deleted. PROTECT raises instead.
- 3. What is related_name for? — It names the reverse accessor: `author.posts` instead of `author.post_set`.
- 4. How do you safely get a single object that might not exist? — Use `Model.objects.filter(**kw).first()` (returns None) instead of `.get()` (raises DoesNotExist).
- 5. What does save(update_fields=[...]) do? — Issues an UPDATE only for the listed columns, avoiding race conditions on other fields and skipping full-row writes.

### Mini Project

Build a Mini-CRM: Three models — `Customer`, `Company` (M2O from Customer), and `Deal` (FK to Customer, with `value` DecimalField and `stage` choices). Add a custom manager `Deal.won` that filters stage="won". Suggested approach:
  - Define an abstract Timestamped base
  - Use TextChoices for deal stage (LEAD, QUALIFIED, PROPOSAL, WON, LOST)
  - Add a CheckConstraint that value >= 0
  - Add `Deal.objects.with_customer()` as a queryset method (select_related)
  - Write a small script in `manage.py shell` to seed 5 customers and 10 deals

### Exercises

1. Define a `Book` model with title, ISBN (unique), price (DecimalField with max_digits=10, decimal_places=2), and a FK to `Author`.
2. Add a `Meta.ordering = ["-published"]` and verify the default queryset order.
3. Create a custom manager `available()` on Book that filters `stock__gt=0`.
4. Run `makemigrations` and `sqlmigrate myapp 0001` to inspect the generated SQL.
5. Add a CheckConstraint that price > 0 and verify it raises on bad inserts.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which field type stores a universally unique identifier?
9. A) SlugField
10. B) HashField
11. C) GUIDField
12. D) UUIDField (*)
13. Explanation: UUIDField stores a uuid.UUID and uses PostgreSQL's uuid type. Use `default=uuid.uuid4` for auto-generation.
14. Q2: What does `on_delete=models.PROTECT` do?
15. A) Raises ProtectedError, preventing the deletion (*)
16. B) Deletes related objects
17. C) Sets the FK to NULL
18. D) Sets the FK to its default
19. Explanation: PROTECT blocks the parent deletion if children exist. CASCADE deletes children. SET_NULL requires null=True.
20. Q3: Which is true about `null=True` on a CharField?
21. A) It's the recommended way to allow empty strings
22. B) Django convention is to avoid it; use default="" + blank=True instead (*)
23. C) It's required for CharField
24. D) It has no effect
25. Explanation: Django convention avoids null=True on string fields because two "empty" representations (NULL and "") cause confusion. Use default="" + blank=True.
26. Q4: What's the difference between `objects` and a custom manager?
27. A) Custom managers can't filter
28. B) You can only have one manager per model
29. C) Once you add a custom manager, you must explicitly declare `objects = Manager()` to keep it (*)
30. D) Custom managers replace objects automatically
31. Explanation: The first manager defined becomes the default (used for related lookups). If you add a custom one without `objects = Manager()`, `objects` disappears.
32. Q5: Which Meta option controls default queryset ordering?
33. A) order_by
34. B) sort
35. C) default_order
36. D) ordering (*)
37. Explanation: `class Meta: ordering = ["-published_at"]` sets the default order. Watch out: it adds an ORDER BY to every query unless you call `.order_by()` explicitly.
38. Q6: What does `related_name="posts"` do on a ForeignKey?
39. A) Sets the reverse accessor name (author.posts) (*)
40. B) Names the FK column
41. C) Renames the model
42. D) Adds a database index
43. Explanation: Without related_name, the reverse accessor is `author.post_set`. With related_name="posts", it becomes `author.posts`.
44. Q7: Which command shows the SQL a migration will run without applying it?
45. A) python manage.py showsql
46. B) python manage.py sqlmigrate appname 0001 (*)
47. C) python manage.py inspectdb
48. D) python manage.py dryrun
49. Explanation: sqlmigrate prints the SQL for a given migration. inspectdb does the reverse — generates models from an existing DB.
50. Q8: What does `save(update_fields=["title"])` do?
51. A) Updates all fields
52. B) Deletes the row
53. C) Issues an UPDATE only for the listed columns (*)
54. D) Creates a new row
55. Explanation: update_fields restricts the UPDATE to those columns, avoiding races on other fields and skipping auto_now fields not listed.
56. Q9: Which is the correct way to define choices since Django 3.0?
57. A) CHOICES = (("a", "A"),)
58. B) choices=[("a", "A")]
59. C) All of the above work, but TextChoices is type-safe
60. D) class Status(models.TextChoices): A = "a", "A" (*)
61. Explanation: TextChoices/IntegerChoices are enums; they give IDE autocomplete and `.label` access. The tuple form still works but isn't type-safe.
62. Q10: What's the safest way to get a single object when you're not sure it exists?
63. A) Model.objects.filter(pk=1).first() (*)
64. B) Model.objects.get(pk=1)
65. C) Model.objects.all()[0]
66. D) Model.objects.first(pk=1)
67. Explanation: `.first()` returns None if no match; `.get()` raises DoesNotExist. Use `get_object_or_404` in views for the 404 semantics.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which field type stores a universally unique identifier?
  options:
    - SlugField
    - HashField
    - GUIDField
    - UUIDField
  correctIndex: 3
  explanation: UUIDField stores a uuid.UUID and uses PostgreSQL's uuid type. Use `default=uuid.uuid4` for auto-generation.
- id: q2
  question: What does `on_delete=models.PROTECT` do?
  options:
    - Raises ProtectedError, preventing the deletion
    - Deletes related objects
    - Sets the FK to NULL
    - Sets the FK to its default
  correctIndex: 0
  explanation: PROTECT blocks the parent deletion if children exist. CASCADE deletes children. SET_NULL requires null=True.
- id: q3
  question: Which is true about `null=True` on a CharField?
  options:
    - It's the recommended way to allow empty strings
    - Django convention is to avoid it; use default="" + blank=True instead
    - It's required for CharField
    - It has no effect
  correctIndex: 1
  explanation: Django convention avoids null=True on string fields because two "empty" representations (NULL and "") cause confusion. Use default="" + blank=True.
- id: q4
  question: What's the difference between `objects` and a custom manager?
  options:
    - Custom managers can't filter
    - You can only have one manager per model
    - Once you add a custom manager, you must explicitly declare `objects = Manager()` to keep it
    - Custom managers replace objects automatically
  correctIndex: 2
  explanation: The first manager defined becomes the default (used for related lookups). If you add a custom one without `objects = Manager()`, `objects` disappears.
- id: q5
  question: Which Meta option controls default queryset ordering?
  options:
    - order_by
    - sort
    - default_order
    - ordering
  correctIndex: 3
  explanation: '`class Meta: ordering = ["-published_at"]` sets the default order. Watch out: it adds an ORDER BY to every query unless you call `.order_by()` explicitly.'
- id: q6
  question: What does `related_name="posts"` do on a ForeignKey?
  options:
    - Sets the reverse accessor name (author.posts)
    - Names the FK column
    - Renames the model
    - Adds a database index
  correctIndex: 0
  explanation: Without related_name, the reverse accessor is `author.post_set`. With related_name="posts", it becomes `author.posts`.
- id: q7
  question: Which command shows the SQL a migration will run without applying it?
  options:
    - python manage.py showsql
    - python manage.py sqlmigrate appname 0001
    - python manage.py inspectdb
    - python manage.py dryrun
  correctIndex: 1
  explanation: sqlmigrate prints the SQL for a given migration. inspectdb does the reverse — generates models from an existing DB.
- id: q8
  question: What does `save(update_fields=["title"])` do?
  options:
    - Updates all fields
    - Deletes the row
    - Issues an UPDATE only for the listed columns
    - Creates a new row
  correctIndex: 2
  explanation: update_fields restricts the UPDATE to those columns, avoiding races on other fields and skipping auto_now fields not listed.
- id: q9
  question: Which is the correct way to define choices since Django 3.0?
  options:
    - CHOICES = (("a", "A"),)
    - choices=[("a", "A")]
    - All of the above work, but TextChoices is type-safe
    - 'class Status(models.TextChoices): A = "a", "A"'
  correctIndex: 3
  explanation: TextChoices/IntegerChoices are enums; they give IDE autocomplete and `.label` access. The tuple form still works but isn't type-safe.
- id: q10
  question: What's the safest way to get a single object when you're not sure it exists?
  options:
    - Model.objects.filter(pk=1).first()
    - Model.objects.get(pk=1)
    - Model.objects.all()[0]
    - Model.objects.first(pk=1)
  correctIndex: 0
  explanation: "`.first()` returns None if no match; `.get()` raises DoesNotExist. Use `get_object_or_404` in views for the 404 semantics."
```

