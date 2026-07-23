---
slug: django-authentication-authorization
id: django-08
track: django
order: 8
title: Authentication and Authorization
description: Use Django's built-in auth (User model, login, logout, permissions, groups), build a custom user model, and implement password reset, email verification, and object-level permissions.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=300s
whyItMatters: Use Django's built-in auth (User model, login, logout, permissions, groups), build a custom user model, and implement password reset, email verification, and object-level permissions.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Authentication and Authorization

## Authentication and Authorization

### Why It Matters

Use Django's built-in auth (User model, login, logout, permissions, groups), build a custom user model, and implement password reset, email verification, and object-level permissions.

Use Django's built-in auth (User model, login, logout, permissions, groups), build a custom user model, and implement password reset, email verification, and object-level permissions.

### Prerequisites

- Stage 7 (CBVs), Stage 4 (Models)
- Understanding of sessions (covered next stage, but helpful here).

### Topics

- The default User model and when to replace it
- AbstractUser vs AbstractBaseUser vs BaseUserManager
- AUTH_USER_MODEL and the "swap on day one" rule
- authenticate(), login(), logout()
- @login_required decorator and LoginRequiredMixin
- Permissions and groups (add_X, change_X, delete_X, view_X)
- @permission_required and PermissionRequiredMixin
- Password reset flow via django.contrib.auth.views
- Token authentication (DRF TokenAuth, JWT) — preview

### Key Concepts

- Always start a project with a custom User model even if it's identical to AbstractUser — switching later is painful.
- `authenticate(request, username=..., password=...)` checks credentials against backends; `login(request, user)` starts the session.
- Permissions are strings like `"blog.add_post"`; groups bundle permissions.
- Passwords are hashed with PBKDF2 by default (configurable via PASSWORD_HASHERS); never store plaintext.
- The `User.is_authenticated` property is True for logged-in users and False for AnonymousUser.

```python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add fields here. Don't override username/password unless you know why.
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    following = models.ManyToManyField("self", symmetrical=False, blank=True)

# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Profile", {"fields": ("bio", "avatar")}),
    )
```
Caption: Custom user model — swap on day one

### Common Pitfalls

- Not setting AUTH_USER_MODEL before the first migration — switching the user model after data exists requires a complex migration that almost no one does correctly; start with a custom user.
- Overriding `User.password` as a plain CharField — Django expects a hashed string; setting it raw breaks login. Always use `user.set_password(raw)` and `user.check_password(raw)`.
- Forgetting `is_authenticated` check — `request.user` for an anonymous visitor is AnonymousUser; calling `request.user.email` works but `request.user.posts` returns nothing. Use is_authenticated first.
- Rolling your own password reset tokens — use django.contrib.auth.tokens.default_token_generator; it's time-limited and one-time-use. Custom tokens often have replay vulnerabilities.
- Storing the password in session to "keep them logged in" — sessions are signed, not encrypted; if you store the password there, anyone with the secret can read it. Use the session key only.

### Real-World Applications

- Instagram's web auth uses Django's session framework for browser logins (the mobile app uses JWTs issued by a separate service).
- Mozilla uses Django auth + a custom Mozilla Persona / FXA backend for single sign-on across MDN, SUMO, and Bugzilla.
- Disqus's login is Django auth with custom backends for Google/Twitter/Facebook OAuth.
- Eventbrite uses Django's auth with a custom user model + SAML for enterprise customer SSO.

### Interview Questions

- 1. Why should every new Django project start with a custom User model? — Switching AUTH_USER_MODEL after data exists is a brutal migration; starting custom costs nothing and saves pain later.
- 2. What's the difference between AbstractUser and AbstractBaseUser? — AbstractUser keeps the default fields (username, email, first_name, etc.); AbstractBaseUser is bare-bones (only password + last_login), you build everything yourself.
- 3. What does authenticate() do vs login()? — authenticate checks creds against backends and returns a user or None; login puts the user ID into the session.
- 4. How are permissions stored? — As Permission rows linked to content types; users get them directly or via groups. Check with `user.has_perm("blog.add_post")`.
- 5. How are passwords hashed in Django? — PBKDF2 with SHA-256 by default (configurable via PASSWORD_HASHERS); bcrypt/argon2 available by adding them to the list.

### Mini Project

Build a Signup + Email Verification Flow: A custom User model with email-as-username, a signup form that creates an inactive user, an email with a signed token (default_token_generator), and a verify view that flips is_active=True. Suggested approach:
  - Custom User with `USERNAME_FIELD = "email"` and a UserManager
  - SignupView creates user with is_active=False, sends token URL via email
  - VerifyView checks token via default_token_generator.check_token(user, token)
  - On success: user.is_active = True; user.save(update_fields=["is_active"])
  - Add @login_required to a dashboard view

### Exercises

1. Create a custom User subclass of AbstractUser with a `bio` field; set AUTH_USER_MODEL.
2. Build a login form + view; redirect to /dashboard/ on success.
3. Add @login_required to a view; verify anonymous users get redirected to /login/?next=.
4. Create a "editors" group with blog.change_post permission and assign it to a user.
5. Build a password change form using PasswordChangeForm + the change_password view.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When should you set AUTH_USER_MODEL to a custom user?
9. A) Any time — Django handles the migration automatically
10. B) Only when you have 100+ users
11. C) After deploy
12. D) Before the first migration; switching later is very painful (*)
13. Explanation: Changing AUTH_USER_MODEL after data exists requires a destructive migration. The Django docs explicitly say to start every project with a custom user.
14. Q2: Which method correctly sets a user's password?
15. A) user.set_password("secret") then user.save() (*)
16. B) user.password = "secret"
17. C) user.update_password("secret")
18. D) hash.password(user, "secret")
19. Explanation: set_password hashes the password using the configured hasher. Saving the raw string breaks login.
20. Q3: What does `user.is_authenticated` return for AnonymousUser?
21. A) True
22. B) False (*)
23. C) Raises AttributeError
24. D) None
25. Explanation: AnonymousUser.is_authenticated is False; User.is_authenticated is True. Always check this before using user-only attributes.
26. Q4: Which decorator protects a FBV for logged-in users only?
27. A) @auth_required
28. B) @authenticated
29. C) @login_required (*)
30. D) @secure
31. Explanation: @login_required redirects anonymous users to LOGIN_URL. The CBV equivalent is LoginRequiredMixin.
32. Q5: How are permissions named in Django?
33. A) "UserCanEditPosts"
34. B) "EDIT_POST"
35. C) "blog/post/change"
36. D) "<app>.<action>_<model>" e.g. "blog.change_post" (*)
37. Explanation: Django auto-creates add/change/delete/view permissions per model. Check with user.has_perm("blog.change_post").
38. Q6: Which class do you subclass to keep all default User fields (username, email, etc.)?
39. A) AbstractUser (*)
40. B) AbstractBaseUser
41. C) BaseUser
42. D) UserBase
43. Explanation: AbstractUser has all the default fields + permissions. AbstractBaseUser is bare (password + last_login only); use it when you need a totally custom user.
44. Q7: What does `login(request, user)` do?
45. A) Saves the user's password to the session
46. B) Stores the user's ID and backend in the session, marking them logged in (*)
47. C) Sends a confirmation email
48. D) Hashes the password again
49. Explanation: login() puts user._meta.pk.value_to_string(user) and the auth backend path into the session. The session cookie is signed, not encrypted.
50. Q8: Which built-in token generator is used for password reset?
51. A) secrets.token_urlsafe
52. B) hashlib.sha256
53. C) django.contrib.auth.tokens.default_token_generator (*)
54. D) uuid.uuid4
55. Explanation: default_token_generator makes time-limited, single-use tokens bound to the user's pk, password hash, and last_login — so a password change invalidates old tokens.
56. Q9: What's the default password hasher in Django?
57. A) MD5
58. B) SHA1
59. C) bcrypt
60. D) PBKDF2 with SHA-256 (*)
61. Explanation: PBKDF2 is the default for portability. bcrypt and argon2 are stronger; add them to PASSWORD_HASHERS to upgrade.
62. Q10: What does PermissionRequiredMixin require?
63. A) permission_required attribute (string or list) (*)
64. B) test_func method
65. C) A custom has_perm method
66. D) A permission_decorator
67. Explanation: Set `permission_required = "blog.change_post"` (or a list). The mixin checks has_perm; on failure it redirects or raises 403.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When should you set AUTH_USER_MODEL to a custom user?
  options:
    - Any time — Django handles the migration automatically
    - Only when you have 100+ users
    - After deploy
    - Before the first migration; switching later is very painful
  correctIndex: 3
  explanation: Changing AUTH_USER_MODEL after data exists requires a destructive migration. The Django docs explicitly say to start every project with a custom user.
- id: q2
  question: Which method correctly sets a user's password?
  options:
    - user.set_password("secret") then user.save()
    - user.password = "secret"
    - user.update_password("secret")
    - hash.password(user, "secret")
  correctIndex: 0
  explanation: set_password hashes the password using the configured hasher. Saving the raw string breaks login.
- id: q3
  question: What does `user.is_authenticated` return for AnonymousUser?
  options:
    - "True"
    - "False"
    - Raises AttributeError
    - None
  correctIndex: 1
  explanation: AnonymousUser.is_authenticated is False; User.is_authenticated is True. Always check this before using user-only attributes.
- id: q4
  question: Which decorator protects a FBV for logged-in users only?
  options:
    - "@auth_required"
    - "@authenticated"
    - "@login_required"
    - "@secure"
  correctIndex: 2
  explanation: "@login_required redirects anonymous users to LOGIN_URL. The CBV equivalent is LoginRequiredMixin."
- id: q5
  question: How are permissions named in Django?
  options:
    - '"UserCanEditPosts"'
    - '"EDIT_POST"'
    - '"blog/post/change"'
    - '"<app>.<action>_<model>" e.g. "blog.change_post"'
  correctIndex: 3
  explanation: Django auto-creates add/change/delete/view permissions per model. Check with user.has_perm("blog.change_post").
- id: q6
  question: Which class do you subclass to keep all default User fields (username, email, etc.)?
  options:
    - AbstractUser
    - AbstractBaseUser
    - BaseUser
    - UserBase
  correctIndex: 0
  explanation: AbstractUser has all the default fields + permissions. AbstractBaseUser is bare (password + last_login only); use it when you need a totally custom user.
- id: q7
  question: What does `login(request, user)` do?
  options:
    - Saves the user's password to the session
    - Stores the user's ID and backend in the session, marking them logged in
    - Sends a confirmation email
    - Hashes the password again
  correctIndex: 1
  explanation: login() puts user._meta.pk.value_to_string(user) and the auth backend path into the session. The session cookie is signed, not encrypted.
- id: q8
  question: Which built-in token generator is used for password reset?
  options:
    - secrets.token_urlsafe
    - hashlib.sha256
    - django.contrib.auth.tokens.default_token_generator
    - uuid.uuid4
  correctIndex: 2
  explanation: default_token_generator makes time-limited, single-use tokens bound to the user's pk, password hash, and last_login — so a password change invalidates old tokens.
- id: q9
  question: What's the default password hasher in Django?
  options:
    - MD5
    - SHA1
    - bcrypt
    - PBKDF2 with SHA-256
  correctIndex: 3
  explanation: PBKDF2 is the default for portability. bcrypt and argon2 are stronger; add them to PASSWORD_HASHERS to upgrade.
- id: q10
  question: What does PermissionRequiredMixin require?
  options:
    - permission_required attribute (string or list)
    - test_func method
    - A custom has_perm method
    - A permission_decorator
  correctIndex: 0
  explanation: Set `permission_required = "blog.change_post"` (or a list). The mixin checks has_perm; on failure it redirects or raises 403.
```

