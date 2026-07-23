---
slug: django-getting-started-django
id: django-01
track: django
order: 1
title: Getting Started with Django
description: Install Django, start a project and an app, and understand the project layout, settings, and the runserver dev loop.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc
whyItMatters: Install Django, start a project and an app, and understand the project layout, settings, and the runserver dev loop.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Getting Started with Django

## Getting Started with Django

### Why It Matters

Install Django, start a project and an app, and understand the project layout, settings, and the runserver dev loop.

Install Django, start a project and an app, and understand the project layout, settings, and the runserver dev loop.

### Prerequisites

- None — basic Python knowledge is helpful.
- Comfort creating and activating a virtualenv (python3 -m venv .venv).

### Topics

- Installing Django 5.x via pip in a virtualenv
- `django-admin startproject` and `python manage.py startapp`
- Project vs app: what's the difference and when to make a new app
- The manage.py commands you'll use daily (runserver, migrate, makemigrations, shell, createsuperuser)
- settings.py anatomy: INSTALLED_APPS, MIDDLEWARE, DATABASES, TEMPLATES
- The dev server (runserver) and why you never use it in production
- WSGI vs ASGI: wsgi.py and asgi.py entry points
- Project directory layout (the inner config package vs the outer wrapper)

### Key Concepts

- A Django project is a configuration package; an app is a reusable feature module.
- Migrations are Python files that describe DB changes; you commit them to git.
- Django is request -> response: each URL maps to a view callable.
- Settings are a Python module (not YAML/TOML) — that means typos silently break things.
- Django ships WSGI by default; ASGI (asgi.py) unlocks async views, Channels, and WebSockets.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install "Django>=5.0,<6.0"
django-admin startproject mysite .
python manage.py startapp blog
# Now add "blog" to INSTALLED_APPS in mysite/settings.py
```
Caption: startproject + startapp

### Common Pitfalls

- Running `django-admin startproject mysite` (no trailing dot) creates a nested folder — use `startproject mysite .` to scaffold into the current directory and avoid the double-nested layout.
- Forgetting to add the new app to INSTALLED_APPS — Django silently ignores the app's models, migrations, and template tags until it's listed there.
- Running `manage.py runserver` in production — it's single-threaded, has no security headers, and isn't a real WSGI server; use Gunicorn or uWSGI.
- Hard-coding secrets in settings.py — use `os.environ["KEY"]` or django-environ, and never commit .env.
- Mixing the inner project package (mysite/) with the outer project root — the outer directory holds manage.py, the inner holds settings/urls/wsgi.

### Real-World Applications

- Instagram's backend uses Django on Python 3 and has been a flagship Django deployment since 2016 (hundreds of millions of daily users).
- Disqus runs one of the largest Django deployments in the world, serving 35+ million comments per day on Django + PostgreSQL.
- Mozilla's support site (support.mozilla.org) and MDN have run Django since the early 2010s.
- Pinterest's early backend was Django before later moving to a hybrid Django + custom-services architecture.

### Interview Questions

- 1. What's the difference between a project and an app in Django? — A project is the configuration package; an app is a self-contained feature module that can be plugged into any project.
- 2. Why does Django include wsgi.py and asgi.py? — wsgi.py is the synchronous entry point for Gunicorn/uWSGI; asgi.py enables async views, Channels, and WebSockets.
- 3. What does `manage.py makemigrations` do vs `migrate`? — makemigrations generates migration files from model changes; migrate applies those files to the database.
- 4. Why should you never run `runserver` in production? — It's single-threaded, lacks security headers, doesn't handle static files via WSGI correctly, and isn't built for concurrency.
- 5. Name three Django apps you'd typically build for a SaaS product. — accounts (custom user), billing (Stripe webhooks + subscriptions), and core (the product domain models).

### Mini Project

Build a "Hello, name" Greeter App: A Django project with one app `greeter`, one view that takes `?name=World` from the query string and returns `<h1>Hello, World!</h1>` styled with a small CSS file served from /static/. Suggested approach:
  - startproject + startapp, add the app to INSTALLED_APPS
  - Write `def greet(request): name = request.GET.get("name", "World"); return HttpResponse(...)`
  - Wire URL `path("greet/", greet)` in mysite/urls.py
  - Add a STATICFILES_DIRS entry pointing to a `static/` folder
  - Load CSS via `{% load static %}` in a tiny template

### Exercises

1. Install Django 5.x in a fresh virtualenv and run `python -m django --version` to confirm.
2. `startproject myproject .` and add an app called `pages`; render an "about" page at /about/.
3. Print `settings.INSTALLED_APPS` from `python manage.py shell` and identify which are contrib apps vs your own.
4. Start `runserver` and visit /admin/ — note the login redirect and the fact that no superuser exists yet.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which command creates a new Django project in the current directory (no nested folder)?
8. A) django-admin startproject mysite . (*)
9. B) django-admin startproject mysite
10. C) python manage.py startproject mysite
11. D) django new mysite
12. Explanation: The trailing `.` tells startproject to scaffold into the current directory instead of creating a new `mysite/` wrapper folder.
13. Q2: What is the role of manage.py?
14. A) It's the production WSGI entry point
15. B) It's a command-line utility that wraps django-admin with your project's settings (*)
16. C) It's the ASGI entry point
17. D) It compiles Python source to bytecode
18. Explanation: manage.py sets DJANGO_SETTINGS_MODULE and forwards commands (runserver, migrate, etc.) to django-admin.
19. Q3: Which of these is NOT a built-in Django contrib app?
20. A) django.contrib.auth
21. B) django.contrib.sessions
22. C) django.contrib.react (*)
23. D) django.contrib.staticfiles
24. Explanation: There's no django.contrib.react; Django is server-side. The others ship with Django.
25. Q4: Why must you never run `manage.py runserver` in production?
26. A) It only works on Windows
27. B) It requires Python 2
28. C) It only serves static files
29. D) It's single-threaded, lacks security headers, and isn't a real WSGI server (*)
30. Explanation: runserver is a dev loop with auto-reload, no concurrency, and no security headers — Gunicorn or uWSGI is the production server.
31. Q5: What does INSTALLED_APPS contain?
32. A) Strings naming the apps Django should load (model registration, templates, etc.) (*)
33. B) URLs to external PyPI packages
34. C) Database connection strings
35. D) Static file directories
36. Explanation: Each string in INSTALLED_APPS is a Python path to an app config; Django imports them to register models, template tags, signals, and migrations.
37. Q6: Which file is the WSGI entry point?
38. A) manage.py
39. B) wsgi.py (*)
40. C) settings.py
41. D) asgi.py
42. Explanation: wsgi.py exposes `application` for Gunicorn/uWSGI. asgi.py is for async deployments.
43. Q7: Where are Django settings typically stored?
44. A) settings.yaml
45. B) settings.toml
46. C) settings.py (a Python module) (*)
47. D) settings.json
48. Explanation: Django settings are a Python module, which means typos or syntax errors can silently misconfigure things; some teams split into settings/base.py, dev.py, prod.py.
49. Q8: What does `python manage.py startapp blog` create?
50. A) A new database called blog
51. B) A new URL route /blog/
52. C) A new virtualenv
53. D) A new app directory with models.py, views.py, admin.py, migrations/ (*)
54. Explanation: startapp scaffolds the app skeleton; you still need to add the app to INSTALLED_APPS and wire URLs yourself.
55. Q9: Django 5.x requires which Python version at minimum?
56. A) Python 3.10 (*)
57. B) Python 3.8
58. C) Python 3.6
59. D) Python 2.7
60. Explanation: Django 5.0 supports Python 3.10, 3.11, 3.12, and 3.13; earlier versions like Django 4.2 are the last with 3.8/3.9 support.
61. Q10: Which command applies model changes to the database?
62. A) python manage.py makemigrations
63. B) python manage.py migrate (*)
64. C) python manage.py syncdb
65. D) python manage.py apply
66. Explanation: makemigrations writes migration files; migrate executes them. syncdb was removed in Django 1.9.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command creates a new Django project in the current directory (no nested folder)?
  options:
    - django-admin startproject mysite .
    - django-admin startproject mysite
    - python manage.py startproject mysite
    - django new mysite
  correctIndex: 0
  explanation: The trailing `.` tells startproject to scaffold into the current directory instead of creating a new `mysite/` wrapper folder.
- id: q2
  question: What is the role of manage.py?
  options:
    - It's the production WSGI entry point
    - It's a command-line utility that wraps django-admin with your project's settings
    - It's the ASGI entry point
    - It compiles Python source to bytecode
  correctIndex: 1
  explanation: manage.py sets DJANGO_SETTINGS_MODULE and forwards commands (runserver, migrate, etc.) to django-admin.
- id: q3
  question: Which of these is NOT a built-in Django contrib app?
  options:
    - django.contrib.auth
    - django.contrib.sessions
    - django.contrib.react
    - django.contrib.staticfiles
  correctIndex: 2
  explanation: There's no django.contrib.react; Django is server-side. The others ship with Django.
- id: q4
  question: Why must you never run `manage.py runserver` in production?
  options:
    - It only works on Windows
    - It requires Python 2
    - It only serves static files
    - It's single-threaded, lacks security headers, and isn't a real WSGI server
  correctIndex: 3
  explanation: runserver is a dev loop with auto-reload, no concurrency, and no security headers — Gunicorn or uWSGI is the production server.
- id: q5
  question: What does INSTALLED_APPS contain?
  options:
    - Strings naming the apps Django should load (model registration, templates, etc.)
    - URLs to external PyPI packages
    - Database connection strings
    - Static file directories
  correctIndex: 0
  explanation: Each string in INSTALLED_APPS is a Python path to an app config; Django imports them to register models, template tags, signals, and migrations.
- id: q6
  question: Which file is the WSGI entry point?
  options:
    - manage.py
    - wsgi.py
    - settings.py
    - asgi.py
  correctIndex: 1
  explanation: wsgi.py exposes `application` for Gunicorn/uWSGI. asgi.py is for async deployments.
- id: q7
  question: Where are Django settings typically stored?
  options:
    - settings.yaml
    - settings.toml
    - settings.py (a Python module)
    - settings.json
  correctIndex: 2
  explanation: Django settings are a Python module, which means typos or syntax errors can silently misconfigure things; some teams split into settings/base.py, dev.py, prod.py.
- id: q8
  question: What does `python manage.py startapp blog` create?
  options:
    - A new database called blog
    - A new URL route /blog/
    - A new virtualenv
    - A new app directory with models.py, views.py, admin.py, migrations/
  correctIndex: 3
  explanation: startapp scaffolds the app skeleton; you still need to add the app to INSTALLED_APPS and wire URLs yourself.
- id: q9
  question: Django 5.x requires which Python version at minimum?
  options:
    - Python 3.10
    - Python 3.8
    - Python 3.6
    - Python 2.7
  correctIndex: 0
  explanation: Django 5.0 supports Python 3.10, 3.11, 3.12, and 3.13; earlier versions like Django 4.2 are the last with 3.8/3.9 support.
- id: q10
  question: Which command applies model changes to the database?
  options:
    - python manage.py makemigrations
    - python manage.py migrate
    - python manage.py syncdb
    - python manage.py apply
  correctIndex: 1
  explanation: makemigrations writes migration files; migrate executes them. syncdb was removed in Django 1.9.
```

