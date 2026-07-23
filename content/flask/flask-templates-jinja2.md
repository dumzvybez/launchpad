---
slug: flask-templates-jinja2
id: flask-03
track: flask
order: 3
title: Templates with Jinja2
description: Render HTML with Jinja2 templates, use template inheritance and blocks, master autoescaping, write filters and macros, and include sub-templates.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=QnDWIZuWYW0&t=60s
whyItMatters: Render HTML with Jinja2 templates, use template inheritance and blocks, master autoescaping, write filters and macros, and include sub-templates.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Templates with Jinja2

## Templates with Jinja2

### Why It Matters

Render HTML with Jinja2 templates, use template inheritance and blocks, master autoescaping, write filters and macros, and include sub-templates.

Render HTML with Jinja2 templates, use template inheritance and blocks, master autoescaping, write filters and macros, and include sub-templates.

### Prerequisites

- Stage 2: Routes, View Functions, and URL Converters
- Basic HTML knowledge (tags, attributes, escaping).

### Topics

- render_template and the templates/ folder convention
- Variables {{ var }} vs control {% if %}/{% for %}
- Template inheritance: {% extends %} and {% block %}
- Filters: |upper, |default, |length, |tojson, custom filters
- Macros: {% macro %} for reusable snippet functions
- {% include %} and {% import %} for partials and macros
- Autoescaping (on for .html/.htm/.xml/.xhtml) and |safe
- Jinja globals and context processors

### Key Concepts

- Jinja2 compiles templates to Python once and caches the bytecode; reload only happens with TEMPLATES_AUTO_RELOAD or debug=True.
- Autoescaping is enabled by default for .html/.htm/.xml/.xhtml/.svg and off for .txt; |safe marks a value as trusted (use sparingly).
- Template inheritance composes: a child template {% extends 'base.html' %} and fills named {% block %}s; the parent can wrap block content with {{ super() }}.
- render_template('x.html', **ctx) injects ctx into the template scope plus Jinja globals (url_for, get_flashed_messages, request, session, g, config).
- Context processors (app.context_processor) inject variables into every template's scope; use sparingly to avoid hidden coupling.

```python
# app.py
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/hi/<name>")
def hi(name):
    return render_template("hi.html", name=name, items=["a", "b", "c"])
```
Caption: render_template with context

### Common Pitfalls

- Using |safe on user input to render rich text — This disables escaping and opens an XSS hole; use bleach.clean() to sanitize HTML before passing it to the template, then |safe only on the bleached output.
- Forgetting to call render_template vs returning a raw string — Returning a string sets Content-Type to text/html but skips Jinja's caching, autoescaping, and template lookup; always use render_template for HTML.
- Over-using context processors for data access — Context processors run for every template render including emails; putting DB queries there creates N+1 surprises. Inject static helpers only.
- Hard-coding URLs in templates like <a href="/users/42"> — Use <a href="{{ url_for('user_by_id', uid=42) }}"> instead so route refactors don't break links.
- Forgetting {{ super() }} when overriding a block that wraps parent content — Without {{ super() }}, overriding the block fully replaces the parent's content, which can drop navigation or layout markup unexpectedly.

### Real-World Applications

- Pinterest's early web templates used Jinja2 (via Flask) before moving to a React/Node front-end and Python back-end split.
- Twilio's console renders server-side Jinja2 templates for many dashboards alongside React widgets.
- Netflix's internal dashboards (Spinnaker siblings, Security Monkey) render Jinja2 templates via Flask for ops pages.
- Patreon's marketing site and creator emails are rendered with Jinja2 templates shared across Flask services.

### Interview Questions

- 1. What's the difference between {{ }} and {% %} in Jinja2? — {{ expr }} evaluates and renders an expression; {% statement %} runs control flow like if/for/block/extends/include.
- 2. How does Jinja2 autoescaping work? — It's enabled by default for .html/.htm/.xml/.xhtml/.svg; disabled for .txt. Use |safe to opt out for a single value (only after sanitizing).
- 3. What does {% extends %} do? — It makes the current template a child of the named base template; the child can only contain {% block %} overrides.
- 4. How do you register a custom Jinja filter? — Use @app.template_filter('name') on a function, or call app.jinja_env.filters['name'] = fn.
- 5. What does a context processor do? — It's a function registered via app.context_processor that returns a dict; the dict is merged into every template's context, useful for site-wide helpers like current_year.

### Mini Project

Build a Profile Card Page: A Flask app that renders a user profile
from a template. base.html provides the page chrome, profile.html
extends it and renders name, bio, and a list of skills. Suggested
approach:
  - Create templates/base.html with {% block content %}
  - Create templates/profile.html that extends base and fills content
  - Add a /profile/<username> route that calls render_template
  - Register a @app.template_filter('initials') that turns 'Ada Lovelace' -> 'AL'
  - Add a context_processor that injects site_name into every template

### Exercises

1. Render templates/hi.html with a name and a list; loop over the list with {% for %}.
2. Add a custom |truncate(20) filter and test it on a long string in a template.
3. Use {% extends 'base.html' %} and override a {% block title %} in a child template.
4. Inject a global via app.context_processor and verify it appears in every template.
5. Render a Jinja macro that generates a labeled input field and call it three times.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which function renders a Jinja2 template with context?
9. A) render
10. B) template
11. C) render_template (*)
12. D) jinja_render
13. Explanation: render_template('name.html', **ctx) renders templates/name.html with the given context plus Jinja globals.
14. Q2: Which delimiter runs control flow like if/for?
15. A) {{ }}
16. B) {# #}
17. C) {! !}
18. D) {% %} (*)
19. Explanation: {{ expr }} renders an expression; {% statement %} runs control flow such as if, for, block, extends, include.
20. Q3: What does {% extends 'base.html' %} do?
21. A) Makes the current template a child of base.html; only blocks can be overridden (*)
22. B) Renders base.html inline at that position
23. C) Imports base.html's macros
24. D) Resets the template scope
25. Explanation: extends establishes inheritance; the child template may contain only {% block %} overrides of blocks declared in the parent.
26. Q4: How do you preserve parent block content when overriding?
27. A) {% parent %}
28. B) {{ super() }} (*)
29. C) {% extends %}
30. D) {% include 'base' %}
31. Explanation: {{ super() }} inside a {% block %} renders the parent's version of that block, letting you wrap rather than replace.
32. Q5: What does the |safe filter do?
33. A) Sanitizes HTML to prevent XSS
34. B) Converts the value to JSON
35. C) Marks a value as already-safe so autoescaping is skipped (*)
36. D) Catches template errors
37. Explanation: |safe opts a single value out of autoescaping. Only use it after sanitizing with bleach — it does not sanitize anything.
38. Q6: Autoescaping is enabled by default for which file extension?
39. A) .txt
40. B) .csv
41. C) .json
42. D) .html (*)
43. Explanation: Autoescaping is on for .html/.htm/.xml/.xhtml/.svg and off for .txt/.json; use markupsafe.Markup or |safe to opt out.
44. Q7: How do you register a custom Jinja filter?
45. A) @app.template_filter('name') (*)
46. B) @app.filter('name')
47. C) app.add_filter('name', fn)
48. D) @jinja.filter('name')
49. Explanation: Decorate a function with @app.template_filter('name'); equivalently assign to app.jinja_env.filters['name'] = fn.
50. Q8: What does a context processor do?
51. A) Pre-compiles templates to bytecode
52. B) Returns a dict that's merged into every template's context (*)
53. C) Validates form input
54. D) Converts responses to JSON
55. Explanation: app.context_processor registers a function whose returned dict is injected into every render_template call — useful for site-wide helpers, dangerous for DB access.
56. Q9: Which built-in Jinja global does Flask provide for URL building?
57. A) reverse
58. B) path
59. C) url_for (*)
60. D) link
61. Explanation: Flask injects url_for, get_flashed_messages, request, session, g, and config as Jinja globals available in every template.
62. Q10: What's a Jinja macro?
63. A) A preprocessor directive
64. B) A global variable
65. C) An extension hook
66. D) A reusable template snippet callable like a function with arguments (*)
67. Explanation: {% macro field(name, label) %}...{% endmacro %} defines a reusable snippet; call it as {{ field('email', 'Email') }} after {% import %}.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which function renders a Jinja2 template with context?
  options:
    - render
    - template
    - render_template
    - jinja_render
  correctIndex: 2
  explanation: render_template('name.html', **ctx) renders templates/name.html with the given context plus Jinja globals.
- id: q2
  question: Which delimiter runs control flow like if/for?
  options:
    - "{{ }}"
    - "{# #}"
    - "{! !}"
    - "{% %}"
  correctIndex: 3
  explanation: "{{ expr }} renders an expression; {% statement %} runs control flow such as if, for, block, extends, include."
- id: q3
  question: What does {% extends 'base.html' %} do?
  options:
    - Makes the current template a child of base.html; only blocks can be overridden
    - Renders base.html inline at that position
    - Imports base.html's macros
    - Resets the template scope
  correctIndex: 0
  explanation: extends establishes inheritance; the child template may contain only {% block %} overrides of blocks declared in the parent.
- id: q4
  question: How do you preserve parent block content when overriding?
  options:
    - "{% parent %}"
    - "{{ super() }}"
    - "{% extends %}"
    - "{% include 'base' %}"
  correctIndex: 1
  explanation: "{{ super() }} inside a {% block %} renders the parent's version of that block, letting you wrap rather than replace."
- id: q5
  question: What does the |safe filter do?
  options:
    - Sanitizes HTML to prevent XSS
    - Converts the value to JSON
    - Marks a value as already-safe so autoescaping is skipped
    - Catches template errors
  correctIndex: 2
  explanation: "|safe opts a single value out of autoescaping. Only use it after sanitizing with bleach — it does not sanitize anything."
- id: q6
  question: Autoescaping is enabled by default for which file extension?
  options:
    - .txt
    - .csv
    - .json
    - .html
  correctIndex: 3
  explanation: Autoescaping is on for .html/.htm/.xml/.xhtml/.svg and off for .txt/.json; use markupsafe.Markup or |safe to opt out.
- id: q7
  question: How do you register a custom Jinja filter?
  options:
    - "@app.template_filter('name')"
    - "@app.filter('name')"
    - app.add_filter('name', fn)
    - "@jinja.filter('name')"
  correctIndex: 0
  explanation: Decorate a function with @app.template_filter('name'); equivalently assign to app.jinja_env.filters['name'] = fn.
- id: q8
  question: What does a context processor do?
  options:
    - Pre-compiles templates to bytecode
    - Returns a dict that's merged into every template's context
    - Validates form input
    - Converts responses to JSON
  correctIndex: 1
  explanation: app.context_processor registers a function whose returned dict is injected into every render_template call — useful for site-wide helpers, dangerous for DB access.
- id: q9
  question: Which built-in Jinja global does Flask provide for URL building?
  options:
    - reverse
    - path
    - url_for
    - link
  correctIndex: 2
  explanation: Flask injects url_for, get_flashed_messages, request, session, g, and config as Jinja globals available in every template.
- id: q10
  question: What's a Jinja macro?
  options:
    - A preprocessor directive
    - A global variable
    - An extension hook
    - A reusable template snippet callable like a function with arguments
  correctIndex: 3
  explanation: "{% macro field(name, label) %}...{% endmacro %} defines a reusable snippet; call it as {{ field('email', 'Email') }} after {% import %}."
```

