---
slug: django-templates-dtl
id: django-03
track: django
order: 3
title: Templates and the DTL
description: Render HTML with the Django Template Language (DTL), use template inheritance, filters, tags, and the static tag, and learn when to reach for Jinja2 instead.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=a48xeeo5Vnk&t=60s
whyItMatters: Render HTML with the Django Template Language (DTL), use template inheritance, filters, tags, and the static tag, and learn when to reach for Jinja2 instead.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Templates and the DTL

## Templates and the DTL

### Why It Matters

Render HTML with the Django Template Language (DTL), use template inheritance, filters, tags, and the static tag, and learn when to reach for Jinja2 instead.

Render HTML with the Django Template Language (DTL), use template inheritance, filters, tags, and the static tag, and learn when to reach for Jinja2 instead.

### Prerequisites

- Stage 1, Stage 2 (URLs/Views)
- Basic HTML knowledge.

### Topics

- Template loading: DIRS, APP_DIRS, and the order of resolution
- Template inheritance: {% extends %}, {% block %}, {{ block.super }}
- Variables and dot lookup (dict, attribute, list-index)
- Built-in tags: {% if %}, {% for %}, {% with %}, {% url %}, {% csrf_token %}, {% static %}, {% load %}
- Filters: |default, |date, |truncatewords, |safe, |escape, |length, |join
- Context processors (request, user, messages)
- Custom template tags and filters (simple_tag, inclusion_tag, assignment_tag removed)
- CSRF tokens in POST forms and the CsrfViewMiddleware

### Key Concepts

- Templates render server-side; the DTL is intentionally restricted (no arbitrary Python).
- Dot lookup tries dict-key, then attribute, then list-index, in that order.
- {% extends %} must be the first tag in a child template.
- Auto-escaping is ON by default; |safe marks a value as not-to-be-escaped (use carefully — XSS risk).
- CSRF protection is mandatory for POST forms; {% csrf_token %} renders the hidden input.

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}My Site{% endblock %}</title>
  {% load static %}
  <link rel="stylesheet" href="{% static 'css/app.css' %}">
</head>
<body>
  <nav>{% block nav %}{% endblock %}</nav>
  <main>{% block content %}{% endblock %}</main>
</body>
</html>

<!-- templates/blog/post_detail.html -->
{% extends "base.html" %}
{% block title %}{{ post.title }}{% endblock %}
{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    <p>By {{ post.author.username }} on {{ post.published_at|date:"Y-m-d" }}</p>
    <div>{{ post.body|safe }}</div>
  </article>
{% endblock %}
```
Caption: Base + child template

### Common Pitfalls

- Forgetting {% csrf_token %} in a POST form — Django raises 403 Forbidden on submit; the token is required by CsrfViewMiddleware.
- Using |safe on user-supplied content — that disables HTML escaping and opens XSS holes; only use |safe on trusted/generated HTML.
- Loading templates from the wrong place — by default APP_DIRS=True loads from each app's templates/ subdir; if you also use DIRS, the DIRS list is searched first.
- Heavy logic in templates — the DTL intentionally forbids calling functions with arguments; do data prep in the view, not the template.
- Forgetting to register a custom tag library — the templatetags/ folder must be a Python package (have __init__.py), and you must `{% load blog_extras %}` before using its tags.

### Real-World Applications

- Instagram's web UI uses Django templates server-rendered for SEO-critical public pages (profile pages, hashtag pages).
- Mozilla MDN's templates use extensive custom tags for syntax-highlighting and localization macros.
- Eventbrite uses Django templates with thousands of partials for event pages and the organizer dashboard.
- PBS LearningMedia renders curriculum pages with Django templates and a custom template tag library for embedding media.

### Interview Questions

- 1. How does Django resolve template names? — It checks TEMPLATES["DIRS"] first, then each app's templates/ subdir (if APP_DIRS=True); first match wins.
- 2. What's the order of dot lookup in `{{ obj.attr }}`? — dict-key, then attribute, then list-index, then it raises (or returns string_if_invalid).
- 3. How does CSRF protection work in Django forms? — CsrfViewMiddleware injects a token into the cookie and form; the POST must echo both. {% csrf_token %} renders the hidden input.
- 4. What's the difference between |escape and |safe? — |escape (default) HTML-escapes; |safe disables auto-escaping. Never |safe untrusted content.
- 5. When would you choose Jinja2 over the DTL? — Jinja2 is faster (compiled), supports expressions like `{% if x > 5 %}`, and integrates well if you need template-level logic; DTL is intentionally restrictive.

### Mini Project

Build a Blog Listing + Detail Pages: Two templates extending a base.html — a list page that loops over posts with truncatewords and a detail page with the post body, author, and date. Add a custom filter `reading_time` that estimates minutes from word count. Suggested approach:
  - Create templates/base.html with a {% block content %}
  - Create blog/post_list.html and blog/post_detail.html extending base
  - Add `reading_time` filter: `return max(1, len(value.split()) // 200)`
  - Use `{% url 'blog:detail' post.pk %}` for links
  - Add `{% csrf_token %}` to a fake subscribe form at the bottom

### Exercises

1. Create a base.html with blocks for title, nav, content; extend it in two child templates.
2. Write a custom filter `initials` that turns `"Ada Lovelace"` into `"AL"`.
3. Render a list with {% for %} and {% empty %} to handle empty querysets gracefully.
4. Add `{% now "jS F Y" %}` to your footer.
5. Switch TEMPLATES backend to Jinja2 and re-render one page using `{{ url('blog:detail', pk=post.pk) }}`.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What must be the first tag in a child template that extends another?
9. A) {% load %}
10. B) {% block %}
11. C) {% extends %} (*)
12. D) {% include %}
13. Explanation: {% extends %} must be the very first line; everything else in the child template must be inside {% block %} tags defined by the parent.
14. Q2: Auto-escaping in the DTL escapes which characters by default?
15. A) Only < and >
16. B) Only quotes
17. C) Spaces and tabs
18. D) <, >, &, ', and " (*)
19. Explanation: Django's escape() converts <, >, &, ', and " to HTML entities to prevent XSS. |safe disables this.
20. Q3: What does {% csrf_token %} render as?
21. A) A hidden <input> with the CSRF token (*)
22. B) A visible form field
23. C) A meta tag in <head>
24. D) A cookie only
25. Explanation: It renders `<input type="hidden" name="csrfmiddlewaretoken" value="...">`. CsrfViewMiddleware checks this on POST.
26. Q4: Which order does the DTL use for `{{ obj.attr }}` dot lookup?
27. A) Attribute, dict-key, list-index
28. B) Dict-key, attribute, list-index (*)
29. C) List-index, dict-key, attribute
30. D) Random
31. Explanation: Django tries dict-key first, then attribute/method, then list-index. The first success wins.
32. Q5: Where must a custom template tag library live?
33. A) Anywhere in the project root
34. B) Inside settings.py
35. C) Inside the app's templatetags/ package (which must have __init__.py) (*)
36. D) Inside static/
37. Explanation: Create `<app>/templatetags/__init__.py` and `<app>/templatetags/blog_extras.py`. Then `{% load blog_extras %}` in templates.
38. Q6: Which template tag is used to include a partial template inline?
39. A) {% extends %}
40. B) {% partial %}
41. C) {% render %}
42. D) {% include %} (*)
43. Explanation: {% include "partials/_nav.html" %} renders another template inline. {% extends %} is for inheritance, not inclusion.
44. Q7: What does the {% with %} tag do?
45. A) Binds a variable name to an expression inside the block (*)
46. B) Loads a context processor
47. C) Imports a Python module
48. D) Adds a CSS class
49. Explanation: `{% with total=items|length %} ... {% endwith %}` lets you cache an expensive expression under a name within the block.
50. Q8: How does Django know which template to load when APP_DIRS is True?
51. A) It searches the filesystem randomly
52. B) It searches each app's templates/ subdirectory in INSTALLED_APPS order (*)
53. C) It only looks in /var/www/templates
54. D) It requires absolute paths
55. Explanation: APP_DIRS=True makes the engine look inside each app's templates/ folder. DIRS is checked first, then app dirs.
56. Q9: Which filter truncates a string to N words and appends an ellipsis?
57. A) |truncatechars
58. B) |truncate
59. C) |truncatewords (*)
60. D) |trim
61. Explanation: |truncatewords:20 cuts at 20 words. |truncatechars cuts by character count.
62. Q10: Which is a valid reason to switch from DTL to Jinja2?
63. A) Jinja2 is the default in Django 5
64. B) DTL is deprecated
65. C) Jinja2 doesn't need CSRF tokens
66. D) Jinja2 supports template expressions and is significantly faster (compiled) (*)
67. Explanation: Jinja2 is faster and more expressive (supports arbitrary Python-like expressions), but loses Django's auto- CSRF rendering; you wire it up via TEMPLATES backend.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What must be the first tag in a child template that extends another?
  options:
    - "{% load %}"
    - "{% block %}"
    - "{% extends %}"
    - "{% include %}"
  correctIndex: 2
  explanation: "{% extends %} must be the very first line; everything else in the child template must be inside {% block %} tags defined by the parent."
- id: q2
  question: Auto-escaping in the DTL escapes which characters by default?
  options:
    - Only < and >
    - Only quotes
    - Spaces and tabs
    - <, >, &, ', and "
  correctIndex: 3
  explanation: Django's escape() converts <, >, &, ', and " to HTML entities to prevent XSS. |safe disables this.
- id: q3
  question: What does {% csrf_token %} render as?
  options:
    - A hidden <input> with the CSRF token
    - A visible form field
    - A meta tag in <head>
    - A cookie only
  correctIndex: 0
  explanation: It renders `<input type="hidden" name="csrfmiddlewaretoken" value="...">`. CsrfViewMiddleware checks this on POST.
- id: q4
  question: Which order does the DTL use for `{{ obj.attr }}` dot lookup?
  options:
    - Attribute, dict-key, list-index
    - Dict-key, attribute, list-index
    - List-index, dict-key, attribute
    - Random
  correctIndex: 1
  explanation: Django tries dict-key first, then attribute/method, then list-index. The first success wins.
- id: q5
  question: Where must a custom template tag library live?
  options:
    - Anywhere in the project root
    - Inside settings.py
    - Inside the app's templatetags/ package (which must have __init__.py)
    - Inside static/
  correctIndex: 2
  explanation: Create `<app>/templatetags/__init__.py` and `<app>/templatetags/blog_extras.py`. Then `{% load blog_extras %}` in templates.
- id: q6
  question: Which template tag is used to include a partial template inline?
  options:
    - "{% extends %}"
    - "{% partial %}"
    - "{% render %}"
    - "{% include %}"
  correctIndex: 3
  explanation: '{% include "partials/_nav.html" %} renders another template inline. {% extends %} is for inheritance, not inclusion.'
- id: q7
  question: What does the {% with %} tag do?
  options:
    - Binds a variable name to an expression inside the block
    - Loads a context processor
    - Imports a Python module
    - Adds a CSS class
  correctIndex: 0
  explanation: "`{% with total=items|length %} ... {% endwith %}` lets you cache an expensive expression under a name within the block."
- id: q8
  question: How does Django know which template to load when APP_DIRS is True?
  options:
    - It searches the filesystem randomly
    - It searches each app's templates/ subdirectory in INSTALLED_APPS order
    - It only looks in /var/www/templates
    - It requires absolute paths
  correctIndex: 1
  explanation: APP_DIRS=True makes the engine look inside each app's templates/ folder. DIRS is checked first, then app dirs.
- id: q9
  question: Which filter truncates a string to N words and appends an ellipsis?
  options:
    - "|truncatechars"
    - "|truncate"
    - "|truncatewords"
    - "|trim"
  correctIndex: 2
  explanation: "|truncatewords:20 cuts at 20 words. |truncatechars cuts by character count."
- id: q10
  question: Which is a valid reason to switch from DTL to Jinja2?
  options:
    - Jinja2 is the default in Django 5
    - DTL is deprecated
    - Jinja2 doesn't need CSRF tokens
    - Jinja2 supports template expressions and is significantly faster (compiled)
  correctIndex: 3
  explanation: Jinja2 is faster and more expressive (supports arbitrary Python-like expressions), but loses Django's auto- CSRF rendering; you wire it up via TEMPLATES backend.
```

