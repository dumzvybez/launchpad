---
slug: django-forms-modelforms-validation
id: django-06
track: django
order: 6
title: Forms — ModelForms and Validation
description: Build HTML forms with Form and ModelForm, validate input with clean() methods and validators, and handle file uploads safely. Understand CSRF, field widgets, and the form rendering lifecycle.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=180s
whyItMatters: Build HTML forms with Form and ModelForm, validate input with clean() methods and validators, and handle file uploads safely. Understand CSRF, field widgets, and the form rendering lifecycle.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Forms — ModelForms and Validation

## Forms — ModelForms and Validation

### Why It Matters

Build HTML forms with Form and ModelForm, validate input with clean() methods and validators, and handle file uploads safely. Understand CSRF, field widgets, and the form rendering lifecycle.

Build HTML forms with Form and ModelForm, validate input with clean() methods and validators, and handle file uploads safely. Understand CSRF, field widgets, and the form rendering lifecycle.

### Prerequisites

- Stage 3 (Templates), Stage 4 (Models)
- Understanding of HTTP POST and form-encoded bodies.

### Topics

- Form vs ModelForm — when to use which
- Field types and widgets (TextInput, Textarea, Select, CheckboxInput, ClearableFileInput)
- Form rendering: as_p, as_ul, as_table, manual field rendering
- Validation flow: field.clean() -> field validators -> clean_<field>() -> clean()
- Form errors: form.errors, form.<field>.errors, non_field_errors
- File uploads: request.FILES, FileField, ImageField, upload_to
- Formsets for editing multiple forms at once
- Saving ModelForms with commit=False for extra processing

### Key Concepts

- A Form is standalone; a ModelForm is generated from a model's fields via Meta.
- Validation runs in a specific order; raising ValidationError stops the chain.
- `form.is_valid()` runs cleaning, populates form.cleaned_data, and sets form.errors.
- File uploads live in `request.FILES` (not POST) and require `enctype="multipart/form-data"` in the form tag.
- `instance=obj` on a ModelForm turns a create form into an edit form.

```python
# blog/forms.py
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "slug", "body", "status", "tags"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 10, "class": "markdown"}),
            "status": forms.Select(attrs={"class": "form-control"}),
        }

    # Per-field validation
    def clean_slug(self):
        slug = self.cleaned_data["slug"]
        if slug.lower() in {"admin", "settings", "login"}:
            raise forms.ValidationError("That slug is reserved.")
        return slug

    # Cross-field validation
    def clean(self):
        cleaned = super().clean()
        status = cleaned.get("status")
        published_at = cleaned.get("published_at")
        if status == "published" and not published_at:
            raise forms.ValidationError("Published posts need a published_at.")
        return cleaned
```
Caption: ModelForm for Post

### Common Pitfalls

- Forgetting `enctype="multipart/form-data"` on a form with file inputs — request.FILES comes back empty and the form's FileField validation fails.
- Calling `form.save()` when `commit=False` and forgetting `form.save_m2m()` — M2M relations are silently dropped because save() with commit=False can't save them.
- Mixing `request.POST or None` with file forms — request.FILES is separate; pass `PostForm(request.POST, request.FILES)` or files get dropped.
- Raising strings instead of ValidationError — `raise forms.ValidationError("msg")` is correct; bare strings crash later when rendering.
- Trusting `request.POST["field"]` instead of using form validation — bypasses all cleaning and validators; always go through a form (or serializer in DRF).

### Real-World Applications

- Disqus uses Django forms for comment moderation UIs (flag, approve, delete actions with batch operations).
- Eventbrite's organizer dashboard uses formsets for editing multiple ticket types on one event page.
- Mozilla's SUMO uses ModelForms with custom clean() for the question/answer workflow with spam filtering.
- Instagram's web upload (rare) uses Django forms for the desktop upload flow with image validation.

### Interview Questions

- 1. What's the difference between Form and ModelForm? — Form is standalone; ModelForm generates fields from a model's Meta and adds save().
- 2. What does form.is_valid() do? — Runs field.clean() + validators + clean_<field>() + clean(); returns True if no errors and populates cleaned_data.
- 3. What's the order of validation? — Field's to_python -> validators -> clean_<field>() -> form.clean() -> model's clean() (for ModelForm).
- 4. Why do you need form.save_m2m() after save(commit=False)? — M2M relations require a saved instance; with commit=False the instance isn't saved yet, so save_m2m() defers them.
- 5. How are file uploads different from POST data? — Files live in request.FILES, require multipart/form-data on the form tag, and the file is a UploadedFile object with .size, .name, .read().

### Mini Project

Build a Job Application Form: A ModelForm for an `Application` model (name, email, resume PDF, cover letter). Validate resume size < 5MB and PDF only; validate email domain isn't a disposable-mail blacklist. Show errors next to fields. Suggested approach:
  - ModelForm with `fields = ["name", "email", "resume", "cover_letter"]`
  - clean_resume: check f.size and f.content_type
  - clean_email: lowercase and check against a set of disposable domains
  - Render with `{% csrf_token %}` and manual field rendering
  - On success, save and redirect to a thank-you page

### Exercises

1. Build a ContactForm with name, email, message; validate message length > 10.
2. Convert it to a ModelForm backed by a Contact model.
3. Add a clean() that rejects messages containing "viagra" (lowercase check).
4. Add a FileField for attachment and validate file size <= 2 MB.
5. Use a formset to let users submit up to 3 referrals on one page.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute on the <form> tag is required to upload files?
9. A) method="post"
10. B) enctype="multipart/form-data" (*)
11. C) action="/upload/"
12. D) accept="file"
13. Explanation: Without enctype="multipart/form-data", the browser sends files as URL-encoded strings and request.FILES is empty.
14. Q2: What does form.is_valid() return when there are errors?
15. A) True (errors are warnings)
16. B) Raises ValidationError
17. C) False; form.errors is populated and cleaned_data is empty/partial (*)
18. D) The form is destroyed
19. Explanation: is_valid() returns False on errors; errors are stored in form.errors (a dict per field). cleaned_data only contains valid fields.
20. Q3: After form.save(commit=False), what must you call to save ManyToMany fields?
21. A) form.save_relations()
22. B) form.save(commit=True)
23. C) Nothing; M2M is saved automatically
24. D) form.save_m2m() (*)
25. Explanation: M2M relations need the instance to exist first. save(commit=False) defers instance save, so save_m2m() is required after you save the instance yourself.
26. Q4: Which method handles cross-field validation?
27. A) clean() (*)
28. B) clean_<field>()
29. C) validate()
30. D) save()
31. Explanation: clean_<field>() is per-field; clean() is form-wide and can compare multiple fields (e.g., password and password_confirm).
32. Q5: Where does file data appear in the request?
33. A) request.POST
34. B) request.FILES (*)
35. C) request.BODY
36. D) request.DATA
37. Explanation: request.FILES is a MultiValueDict keyed by field name. Pass it to the form: MyForm(request.POST, request.FILES).
38. Q6: Which is the correct way to render a form's fields automatically as paragraphs?
39. A) {{ form.as_div }}
40. B) {{ form.auto }}
41. C) {{ form.as_p }} (*)
42. D) {{ form.html }}
43. Explanation: as_p, as_ul, as_table are built-in output formats. For custom layout, render fields manually: {{ form.field.label_tag }} {{ form.field }}.
44. Q7: What's the right way to raise a validation error from clean()?
45. A) raise Exception("bad")
46. B) return "bad"
47. C) raise forms.Error("bad")
48. D) raise forms.ValidationError("bad") (*)
49. Explanation: ValidationError is caught by the form framework and rendered as a field error. Raising Exception causes a 500.
50. Q8: What does `instance=post` on a ModelForm do?
51. A) Pre-fills the form from the existing instance and turns save() into an UPDATE (*)
52. B) Clones the instance
53. C) Deletes the instance
54. D) Adds the instance as a related field
55. Explanation: Passing instance turns a create form into an edit form; save() updates the existing row instead of inserting.
56. Q9: Which form method lets you specify widget attributes like CSS classes?
57. A) field_attrs
58. B) Meta.widgets dict (*)
59. C) attrs_class
60. D) You can't — widgets are fixed
61. Explanation: `class Meta: widgets = {"title": forms.TextInput(attrs={"class": "form-control"})}` overrides default widgets.
62. Q10: What does a FormSet manage?
63. A) A single form across multiple steps
64. B) Form-to-form relationships
65. C) Multiple instances of the same form on one page (*)
66. D) Async form submission
67. Explanation: formset_factory(Form, extra=3) renders 3 copies of Form on one page and validates them as a batch — useful for editing multiple child objects.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute on the <form> tag is required to upload files?
  options:
    - method="post"
    - enctype="multipart/form-data"
    - action="/upload/"
    - accept="file"
  correctIndex: 1
  explanation: Without enctype="multipart/form-data", the browser sends files as URL-encoded strings and request.FILES is empty.
- id: q2
  question: What does form.is_valid() return when there are errors?
  options:
    - True (errors are warnings)
    - Raises ValidationError
    - False; form.errors is populated and cleaned_data is empty/partial
    - The form is destroyed
  correctIndex: 2
  explanation: is_valid() returns False on errors; errors are stored in form.errors (a dict per field). cleaned_data only contains valid fields.
- id: q3
  question: After form.save(commit=False), what must you call to save ManyToMany fields?
  options:
    - form.save_relations()
    - form.save(commit=True)
    - Nothing; M2M is saved automatically
    - form.save_m2m()
  correctIndex: 3
  explanation: M2M relations need the instance to exist first. save(commit=False) defers instance save, so save_m2m() is required after you save the instance yourself.
- id: q4
  question: Which method handles cross-field validation?
  options:
    - clean()
    - clean_<field>()
    - validate()
    - save()
  correctIndex: 0
  explanation: clean_<field>() is per-field; clean() is form-wide and can compare multiple fields (e.g., password and password_confirm).
- id: q5
  question: Where does file data appear in the request?
  options:
    - request.POST
    - request.FILES
    - request.BODY
    - request.DATA
    - .
  correctIndex: 1
  explanation: "request.FILES is a MultiValueDict keyed by field name. Pass it to the form: MyForm(request.POST, request.FILES)."
- id: q6
  question: Which is the correct way to render a form's fields automatically as paragraphs?
  options:
    - "{{ form.as_div }}"
    - "{{ form.auto }}"
    - "{{ form.as_p }}"
    - "{{ form.html }}"
  correctIndex: 2
  explanation: "as_p, as_ul, as_table are built-in output formats. For custom layout, render fields manually: {{ form.field.label_tag }} {{ form.field }}."
- id: q7
  question: What's the right way to raise a validation error from clean()?
  options:
    - raise Exception("bad")
    - return "bad"
    - raise forms.Error("bad")
    - raise forms.ValidationError("bad")
  correctIndex: 3
  explanation: ValidationError is caught by the form framework and rendered as a field error. Raising Exception causes a 500.
- id: q8
  question: What does `instance=post` on a ModelForm do?
  options:
    - Pre-fills the form from the existing instance and turns save() into an UPDATE
    - Clones the instance
    - Deletes the instance
    - Adds the instance as a related field
  correctIndex: 0
  explanation: Passing instance turns a create form into an edit form; save() updates the existing row instead of inserting.
- id: q9
  question: Which form method lets you specify widget attributes like CSS classes?
  options:
    - field_attrs
    - Meta.widgets dict
    - attrs_class
    - You can't — widgets are fixed
  correctIndex: 1
  explanation: '`class Meta: widgets = {"title": forms.TextInput(attrs={"class": "form-control"})}` overrides default widgets.'
- id: q10
  question: What does a FormSet manage?
  options:
    - A single form across multiple steps
    - Form-to-form relationships
    - Multiple instances of the same form on one page
    - Async form submission
  correctIndex: 2
  explanation: formset_factory(Form, extra=3) renders 3 copies of Form on one page and validates them as a batch — useful for editing multiple child objects.
```

