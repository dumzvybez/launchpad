---
slug: django-static-files-media-file-uploads
id: django-10
track: django
order: 10
title: Static Files, Media, and File Uploads
description: Serve static files (CSS/JS/images) in dev and production, handle user-uploaded media, and integrate WhiteNoise and S3 for production. Understand STATIC_URL vs MEDIA_URL and the collectstatic flow.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=420s
whyItMatters: Serve static files (CSS/JS/images) in dev and production, handle user-uploaded media, and integrate WhiteNoise and S3 for production. Understand STATIC_URL vs MEDIA_URL and the collectstatic flow.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Static Files, Media, and File Uploads

## Static Files, Media, and File Uploads

### Why It Matters

Serve static files (CSS/JS/images) in dev and production, handle user-uploaded media, and integrate WhiteNoise and S3 for production. Understand STATIC_URL vs MEDIA_URL and the collectstatic flow.

Serve static files (CSS/JS/images) in dev and production, handle user-uploaded media, and integrate WhiteNoise and S3 for production. Understand STATIC_URL vs MEDIA_URL and the collectstatic flow.

### Prerequisites

- Stage 3 (Templates), Stage 4 (Models)
- Comfort with the {% static %} tag.

### Topics

- STATIC_URL, STATICFILES_DIRS, STATIC_ROOT
- MEDIA_URL, MEDIA_ROOT
- `manage.py collectstatic` and why it's required in prod
- WhiteNoise for serving static files from WSGI (no Nginx needed)
- django-storages with S3/Boto3 for offloading media
- FileField, ImageField, upload_to strategies (date-based paths)
- Image processing with Pillow (resize, optimize)
- Async file uploads to S3 via presigned URLs

### Key Concepts

- Static files (CSS/JS) are version-controlled and collected into STATIC_ROOT at deploy time.
- Media files (user uploads) are NOT version-controlled; they live in MEDIA_ROOT or S3.
- Django's runserver serves both via STATICFILES_FINDERS; production never serves them via Django.
- WhiteNoise makes Django serve static files efficiently in prod (with caching headers); the alternative is Nginx.
- ImageField requires Pillow; it validates that the upload is a real image and exposes .width/.height.

```python
# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static_local"]   # project-level static dirs
STATIC_ROOT = BASE_DIR / "staticfiles"          # collectstatic output

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Dev: serve media
if DEBUG:
    from django.conf.urls.static import static
    # in urls.py:
    # urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Prod with WhiteNoise
MIDDLEWARE.insert(  # SecurityMiddleware is already first; WhiteNoise just below
    list(MIDDLEWARE).index("django.middleware.security.SecurityMiddleware") + 1,
    "whitenoise.middleware.WhiteNoiseMiddleware",
)
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```
Caption: Settings: static + media

### Common Pitfalls

- Forgetting `collectstatic` in production — Django can't find static files because STATIC_ROOT is empty; the deploy script MUST run collectstatic before gunicorn starts.
- Confusing STATIC_URL with STATIC_ROOT — STATIC_URL is the URL prefix (/static/); STATIC_ROOT is the filesystem folder where collectstatic writes files for production.
- Serving user media through Django in production — security risk and slow; use Nginx, S3, or CloudFront for MEDIA_URL.
- DEBUG=False and forgetting to set ALLOWED_HOSTS — Django refuses to serve requests with DEBUG=False until ALLOWED_HOSTS is set; also static files won't auto-serve.
- Using a relative upload_to that collides across users — prefix with user ID or use UUIDs: `upload_to=lambda inst, fn: f"u{inst.user_id}/{uuid.uuid4().hex}/{fn}"`.

### Real-World Applications

- Instagram originally served media via Django + CloudFront; now uses custom services, but the upload_to pattern (date-based paths) is still how most teams organize S3 keys.
- Mozilla uses WhiteNoise for many smaller Django sites; large media goes through S3 + CloudFront.
- Disqus uses django-storages + S3 for media uploads (avatars, screenshots in moderation).
- Eventbrite uses S3 + presigned URLs for organizer asset uploads so the upload never touches Django.

### Interview Questions

- 1. What's the difference between STATIC_URL, STATICFILES_DIRS, and STATIC_ROOT? — STATIC_URL is the URL prefix; STATICFILES_DIRS is where collectstatic looks (project-level); STATIC_ROOT is where it writes for production serving.
- 2. Why do you need collectstatic in production? — Django's staticfiles finder only works with DEBUG=True; collectstatic copies all static files (from apps and STATICFILES_DIRS) into STATIC_ROOT for production serving.
- 3. When would you use WhiteNoise vs Nginx? — WhiteNoise is simpler (no separate server) and fine for medium traffic; Nginx is more performant for very high traffic and gives more caching control.
- 4. What does django-storages do? — Provides backends (S3, Google Cloud, Azure) so FileField/ImageField uploads go directly to cloud storage instead of the local filesystem.
- 5. How do presigned URLs work? — Server generates a time-limited signed S3 URL; client uploads directly to S3 (bypassing Django). Reduces Django load and speeds up large uploads.

### Mini Project

Build an Avatar Upload with Resize + S3: A profile page where users upload an avatar; the file is resized to 256x256 in memory and uploaded to S3 via django-storages. Show a thumbnail next to the form. Suggested approach:
  - Install django-storages[boto3] + Pillow; set DEFAULT_FILE_STORAGE = "storages.backends.s3.S3Storage"
  - Model: `avatar = ImageField(upload_to="avatars/")` with a save() override that resizes via Pillow
  - Form: ModelForm with avatar field; view uses CreateView/UpdateView
  - AWS_S3_ACCESS_KEY_ID / AWS_S3_SECRET_ACCESS_KEY / AWS_S3_BUCKET in env
  - Set AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=31536000"}

### Exercises

1. Configure STATICFILES_DIRS to include a project-level "static/" folder; add a CSS file and load it via {% static %}.
2. Run collectstatic locally and inspect STATIC_ROOT.
3. Install WhiteNoise and verify it serves static files with DEBUG=False.
4. Add an ImageField with upload_to="posts/%Y/%m/%d/" and confirm the date path is generated.
5. Add a Pillow-based resize on save() to cap image width at 800px.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which setting controls where collectstatic writes files?
9. A) STATIC_URL
10. B) STATIC_ROOT (*)
11. C) STATICFILES_DIRS
12. D) STATIC_PATH
13. Explanation: STATIC_ROOT is the absolute filesystem path where collectstatic copies files for production. STATIC_URL is the URL prefix; STATICFILES_DIRS is where collectstatic looks.
14. Q2: Which command gathers static files for production?
15. A) python manage.py gatherstatic
16. B) python manage.py buildstatic
17. C) python manage.py collectstatic (*)
18. D) python manage.py static
19. Explanation: collectstatic walks STATICFILES_FINDERS (apps + STATICFILES_DIRS) and copies everything into STATIC_ROOT.
20. Q3: What's the difference between STATIC_URL and MEDIA_URL?
21. A) Nothing — they're the same
22. B) STATIC_URL is for prod; MEDIA_URL is for dev
23. C) STATIC_URL is for images; MEDIA_URL is for video
24. D) STATIC_URL is for CSS/JS/version-controlled files; MEDIA_URL is for user uploads (*)
25. Explanation: Static = version-controlled assets shipped with the code. Media = user-uploaded files stored at runtime.
26. Q4: Which library lets Django serve static files in production without Nginx?
27. A) WhiteNoise (*)
28. B) gunicorn-static
29. C) serve-static
30. D) static-server
31. Explanation: WhiteNoise wraps the WSGI app and serves STATIC_ROOT with proper caching and gzip. Add it just below SecurityMiddleware.
32. Q5: Why shouldn't Django serve MEDIA_URL in production?
33. A) Django can't read files
34. B) Slow and a security risk; use Nginx, S3, or CloudFront (*)
35. C) It's deprecated
36. D) It only works with DEBUG=True
37. Explanation: Django serving user uploads means Django processes stream the file from disk — slow and bypasses CDNs. Use cloud storage or Nginx.
38. Q6: Which setting activates WhiteNoise's compressed, hashed storage?
39. A) WHITENOISE_ENABLE = True
40. B) STATIC_FILE_BACKEND = "whitenoise"
41. C) STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage" (*)
42. D) WHITENOISE_AUTOGZIP = True
43. Explanation: Set STATICFILES_STORAGE to the CompressedManifestStaticFilesStorage class — it gzips and adds content hashes to filenames for cache busting.
44. Q7: What does upload_to on a FileField accept?
45. A) Only a string
46. B) Only a callable
47. C) A regex
48. D) A string path or a callable (*)
49. Explanation: upload_to can be a string ("avatars/") or a callable that takes (instance, filename) and returns a path. Use a callable for dynamic paths (date-based, user-prefixed).
50. Q8: Which package is required to use ImageField?
51. A) Pillow (*)
52. B) OpenCV
53. C) imageio
54. D) Wand
55. Explanation: ImageField uses Pillow to validate the upload is a real image and to expose .width and .height. Install Pillow before adding ImageField.
56. Q9: What's the purpose of a presigned S3 URL?
57. A) To encrypt the file
58. B) To let the client upload directly to S3, bypassing Django (*)
59. C) To compress the file
60. D) To rename the file
61. Explanation: Server signs a URL with a TTL; the client PUTs directly to S3. Django never sees the bytes — great for large files and reduced server load.
62. Q10: When DEBUG=False, which setting must be configured for any request to work?
63. A) STATIC_ROOT
64. B) DEBUG_HOSTS
65. C) ALLOWED_HOSTS (*)
66. D) TRUSTED_ORIGINS
67. Explanation: With DEBUG=False, Django returns 400 for any Host header not in ALLOWED_HOSTS. Also set CSRF_TRUSTED_ORIGINS for cross-origin POSTs.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which setting controls where collectstatic writes files?
  options:
    - STATIC_URL
    - STATIC_ROOT
    - STATICFILES_DIRS
    - STATIC_PATH
  correctIndex: 1
  explanation: STATIC_ROOT is the absolute filesystem path where collectstatic copies files for production. STATIC_URL is the URL prefix; STATICFILES_DIRS is where collectstatic looks.
- id: q2
  question: Which command gathers static files for production?
  options:
    - python manage.py gatherstatic
    - python manage.py buildstatic
    - python manage.py collectstatic
    - python manage.py static
    - and copies everything into STATIC_ROOT.
  correctIndex: 2
  explanation: collectstatic walks STATICFILES_FINDERS (apps + STATICFILES_DIRS) and copies everything into STATIC_ROOT.
- id: q3
  question: What's the difference between STATIC_URL and MEDIA_URL?
  options:
    - Nothing — they're the same
    - STATIC_URL is for prod; MEDIA_URL is for dev
    - STATIC_URL is for images; MEDIA_URL is for video
    - STATIC_URL is for CSS/JS/version-controlled files; MEDIA_URL is for user uploads
  correctIndex: 3
  explanation: Static = version-controlled assets shipped with the code. Media = user-uploaded files stored at runtime.
- id: q4
  question: Which library lets Django serve static files in production without Nginx?
  options:
    - WhiteNoise
    - gunicorn-static
    - serve-static
    - static-server
  correctIndex: 0
  explanation: WhiteNoise wraps the WSGI app and serves STATIC_ROOT with proper caching and gzip. Add it just below SecurityMiddleware.
- id: q5
  question: Why shouldn't Django serve MEDIA_URL in production?
  options:
    - Django can't read files
    - Slow and a security risk; use Nginx, S3, or CloudFront
    - It's deprecated
    - It only works with DEBUG=True
  correctIndex: 1
  explanation: Django serving user uploads means Django processes stream the file from disk — slow and bypasses CDNs. Use cloud storage or Nginx.
- id: q6
  question: Which setting activates WhiteNoise's compressed, hashed storage?
  options:
    - WHITENOISE_ENABLE = True
    - STATIC_FILE_BACKEND = "whitenoise"
    - STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    - WHITENOISE_AUTOGZIP = True
  correctIndex: 2
  explanation: Set STATICFILES_STORAGE to the CompressedManifestStaticFilesStorage class — it gzips and adds content hashes to filenames for cache busting.
- id: q7
  question: What does upload_to on a FileField accept?
  options:
    - Only a string
    - Only a callable
    - A regex
    - A string path or a callable
  correctIndex: 3
  explanation: upload_to can be a string ("avatars/") or a callable that takes (instance, filename) and returns a path. Use a callable for dynamic paths (date-based, user-prefixed).
- id: q8
  question: Which package is required to use ImageField?
  options:
    - Pillow
    - OpenCV
    - imageio
    - Wand
  correctIndex: 0
  explanation: ImageField uses Pillow to validate the upload is a real image and to expose .width and .height. Install Pillow before adding ImageField.
- id: q9
  question: What's the purpose of a presigned S3 URL?
  options:
    - To encrypt the file
    - To let the client upload directly to S3, bypassing Django
    - To compress the file
    - To rename the file
  correctIndex: 1
  explanation: Server signs a URL with a TTL; the client PUTs directly to S3. Django never sees the bytes — great for large files and reduced server load.
- id: q10
  question: When DEBUG=False, which setting must be configured for any request to work?
  options:
    - STATIC_ROOT
    - DEBUG_HOSTS
    - ALLOWED_HOSTS
    - TRUSTED_ORIGINS
  correctIndex: 2
  explanation: With DEBUG=False, Django returns 400 for any Host header not in ALLOWED_HOSTS. Also set CSRF_TRUSTED_ORIGINS for cross-origin POSTs.
```

