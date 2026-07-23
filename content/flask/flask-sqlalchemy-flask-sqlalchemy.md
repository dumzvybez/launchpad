---
slug: flask-sqlalchemy-flask-sqlalchemy
id: flask-10
track: flask
order: 10
title: SQLAlchemy and Flask-SQLAlchemy
description: Model your data with SQLAlchemy 2.x / Flask-SQLAlchemy 3.x, use the modern select() query style, eager-load relationships to avoid N+1, and manage the session lifecycle correctly.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=420s
whyItMatters: Model your data with SQLAlchemy 2. x / Flask-SQLAlchemy 3.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# SQLAlchemy and Flask-SQLAlchemy

## SQLAlchemy and Flask-SQLAlchemy

### Why It Matters

Model your data with SQLAlchemy 2. x / Flask-SQLAlchemy 3.

Model your data with SQLAlchemy 2.x / Flask-SQLAlchemy 3.x, use the modern select() query style, eager-load relationships to avoid N+1, and manage the session lifecycle correctly.

### Prerequisites

- Stage 9: Configuration
- Basic SQL (SELECT, JOIN, WHERE) and ORM familiarity.

### Topics

- Flask-SQLAlchemy 3.x: db = SQLAlchemy() and init_app()
- Model definition: db.Model, Column, Integer, String, DateTime, ForeignKey
- Relationships: db.relationship with back_populates and lazy='selectin'
- Modern query style: db.session.execute(db.select(Model))
- Eager loading: selectinload, joinedload, subqueryload
- N+1 queries and how to spot them with echo=True or sqltap
- Session lifecycle: commit, rollback, remove on teardown
- Pagination: select(...).limit().offset() and paginate()

### Key Concepts

- Flask-SQLAlchemy 3.x removed Query.get() and Model.query (still available but deprecated); use db.session.get(Model, id) and db.select(Model) instead.
- db.session is a scoped session tied to the app context; Flask-SQLAlchemy auto-removes it at the end of each request (teardown).
- lazy='select' (default) issues a separate query per relationship access — the classic N+1; use lazy='selectin' or selectinload() for collections.
- Model.__tablename__ is required; if you forget it SQLAlchemy derives it from the class name but the convention is to set it explicitly.
- db.session.add(obj) stages; db.session.commit() writes; db.session.rollback() discards. Always commit before the request ends or the row is lost.

```python
# app/models.py
from datetime import datetime
from app.extensions import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    posts = db.relationship("Post", back_populates="author",
                            lazy="selectin")  # avoid N+1

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"),
                           nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author = db.relationship("User", back_populates="posts")
```
Caption: Models with relationships

### Common Pitfalls

- Using Model.query (Flask-SQLAlchemy 2.x style) in 3.x — It still works but is deprecated; use db.session.execute(db.select(Model)) and db.session.get(Model, id) for forward compatibility.
- Default lazy='select' on collections creating N+1 queries — Set lazy='selectin' on the relationship or use options(selectinload(...)) per query; verify with SQL echo (app.config['SQLALCHEMY_ECHO']=True).
- Forgetting db.session.commit() after add() — add() only stages the object; if the request ends without commit, the row is discarded (rolled back). Wrap mutations in try/except with rollback on error.
- Returning ORM objects directly from JSON endpoints — JSON can't serialize SQLAlchemy models; use a marshmallow schema or jsonify({col: getattr(obj, col)}) explicitly to control output and avoid leaking columns.
- Long-lived sessions causing stale data and locks — Flask-SQLAlchemy auto-removes the session at request teardown, but background workers must do it manually (db.session.remove()); a session held open for minutes leaks locks and sees stale data.

### Real-World Applications

- Pinterest's early data layer used Flask-SQLAlchemy + MySQL before later migrating to a custom sharded datastore.
- Lyft's internal admin Flask apps use Flask-SQLAlchemy against Postgres for tracking metadata, with selectinload() everywhere to avoid N+1 on list pages.
- Patreon's Flask services use Flask-SQLAlchemy 3.x with select() style against a sharded Postgres cluster; ORM models map to one shard, raw SQL handles cross-shard aggregates.
- Netflix's security tooling uses Flask-SQLAlchemy against Postgres for findings tables, with careful selectinload() on the relationship to vulnerability records.

### Interview Questions

- 1. What's the difference between Model.query and db.session.execute(db.select(Model))? — Model.query is the Flask-SQLAlchemy 2.x shorthand; db.session.execute(db.select(Model)) is the SQLAlchemy 2.x native style and the recommended way in Flask-SQLAlchemy 3.x+.
- 2. How do you avoid N+1 queries on a relationship? — Use lazy='selectin' on the relationship definition, or per-query options(selectinload(Relationship)) / joinedload(Relationship).
- 3. When does db.session.add() write to the DB? — It only stages the object in the session's identity map; the actual INSERT/UPDATE happens on db.session.commit(). If the request ends without commit, it's rolled back.
- 4. What's the difference between selectinload and joinedload? — selectinload issues a second SELECT with WHERE id IN (...) (good for collections); joinedload tacks a JOIN onto the original query (good for *-to-one, dedup with .unique()).
- 5. How does Flask-SQLAlchemy clean up the session? — It registers a teardown_appcontext handler that calls db.session.remove() at the end of each request, releasing the connection back to the pool and clearing the identity map.

### Mini Project

Build a Blog CRUD API: A Flask app with User and Post models and
endpoints to list users (with their posts eager-loaded), get a
user by id, create a post, and list posts by author. Suggested
approach:
  - Define User and Post models with back_populates and lazy='selectin'
  - Add GET /users using db.select(User).options(selectinload(User.posts))
  - Add POST /posts that creates a Post and db.session.commit()s
  - Add GET /users/<int:uid>/posts that filters by author_id
  - Turn on SQLALCHEMY_ECHO=True and confirm no N+1 in /users

### Exercises

1. Define two models with a *-to-many relationship using back_populates.
2. Use db.session.execute(db.select(Model)) to fetch all rows and print them.
3. Trigger an N+1 by setting lazy='select', then fix it with selectinload().
4. Implement POST /items that adds, commits, and returns 201 with the new id.
5. Add a unique constraint on a column and verify duplicate inserts raise IntegrityError.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the recommended query style in Flask-SQLAlchemy 3.x?
9. A) Model.query.filter_by(...)
10. B) db.session.execute(db.select(Model).filter_by(...)) (*)
11. C) db.query(Model).all()
12. D) Model.objects.filter(...)
13. Explanation: Flask-SQLAlchemy 3.x prefers the SQLAlchemy 2.x native style: db.session.execute(db.select(Model)) returns a Result; use .scalars() / .scalar_one_or_none().
14. Q2: How do you fetch a single row by primary key in 3.x?
15. A) Model.query.get(id)
16. B) Model.objects.get(id)
17. C) db.session.get(Model, id) (*)
18. D) db.fetch(Model, id)
19. Explanation: db.session.get(Model, id) is the 2.x/3.x replacement for the deprecated Query.get(id).
20. Q3: Which relationship lazy strategy issues a second SELECT with WHERE id IN (...)?
21. A) lazy='select'
22. B) lazy='joined'
23. C) lazy='subquery'
24. D) lazy='selectin' (*)
25. Explanation: lazy='selectin' (and selectinload()) issues one extra SELECT per collection batch; ideal for *-to-many without JOIN duplication.
26. Q4: What causes the N+1 query problem?
27. A) A loop accessing a lazy relationship issues one query per row (1 + N total) (*)
28. B) A single SELECT returning N rows
29. C) Using JOINs
30. D) Missing indexes
31. Explanation: Default lazy='select' fires a SELECT each time you access the relationship inside a loop, giving 1 + N queries. Fix with selectinload/joinedload.
32. Q5: When does db.session.add(obj) write the row to the DB?
33. A) Immediately
34. B) On db.session.commit() (*)
35. C) On request teardown
36. D) Never; it's just a hint
37. Explanation: add() stages the object; the actual INSERT (or UPDATE for changed objects) is flushed on db.session.commit(). Without commit the row is discarded.
38. Q6: How does Flask-SQLAlchemy clean up the session per request?
39. A) It commits automatically
40. B) It rolls back unconditionally
41. C) It calls db.session.remove() at request/teardown (*)
42. D) It closes the DB connection
43. Explanation: Flask-SQLAlchemy registers a teardown handler that calls db.session.remove(), releasing the connection to the pool and clearing the identity map.
44. Q7: Why must you call .unique() with joinedload on a collection?
45. A) To sort the results
46. B) To enable caching
47. C) It's optional
48. D) To deduplicate parent rows returned once per child (*)
49. Explanation: joinedload on a *-to-many produces one row per child, repeating the parent; .unique() deduplicates parents. selectinload doesn't need it.
50. Q8: How do you turn on SQL echo to spot N+1 queries?
51. A) app.config['SQLALCHEMY_ECHO']=True (*)
52. B) app.config['SQL_ECHO']=True
53. C) FLASK_ECHO=1
54. D) db.echo=True
55. Explanation: SQLALCHEMY_ECHO=True prints every SQL statement to stderr; combine with your view to count queries per request.
56. Q9: Why should you never return a SQLAlchemy model directly from jsonify?
57. A) Flask forbids it
58. B) JSON can't serialize them and you'd leak columns; use a schema or explicit dict (*)
59. C) It's slow
60. D) It triggers a DB query per JSON key
61. Explanation: jsonify raises TypeError on Model objects; use marshmallow/pydantic to define the output shape and avoid leaking columns like password_hash.
62. Q10: What's the modern way to paginate in Flask-SQLAlchemy 3.x?
63. A) Model.query.paginate(1, 20)
64. B) .limit(20).offset(0)
65. C) .paginate(page=1, per_page=20) on the select() (*)
66. D) There is no built-in pagination
67. Explanation: db.select(Model).paginate(page=1, per_page=20, max_per_page=100) returns a Pagination object with .items, .total, .pages, .has_next.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the recommended query style in Flask-SQLAlchemy 3.x?
  options:
    - Model.query.filter_by(...)
    - db.session.execute(db.select(Model).filter_by(...))
    - db.query(Model).all()
    - Model.objects.filter(...)
  correctIndex: 1
  explanation: "Flask-SQLAlchemy 3.x prefers the SQLAlchemy 2.x native style: db.session.execute(db.select(Model)) returns a Result; use .scalars() / .scalar_one_or_none()."
- id: q2
  question: How do you fetch a single row by primary key in 3.x?
  options:
    - Model.query.get(id)
    - Model.objects.get(id)
    - db.session.get(Model, id)
    - db.fetch(Model, id)
  correctIndex: 2
  explanation: db.session.get(Model, id) is the 2.x/3.x replacement for the deprecated Query.get(id).
- id: q3
  question: Which relationship lazy strategy issues a second SELECT with WHERE id IN (...)?
  options:
    - lazy='select'
    - lazy='joined'
    - lazy='subquery'
    - lazy='selectin'
  correctIndex: 3
  explanation: lazy='selectin' (and selectinload()) issues one extra SELECT per collection batch; ideal for *-to-many without JOIN duplication.
- id: q4
  question: What causes the N+1 query problem?
  options:
    - A loop accessing a lazy relationship issues one query per row (1 + N total)
    - A single SELECT returning N rows
    - Using JOINs
    - Missing indexes
  correctIndex: 0
  explanation: Default lazy='select' fires a SELECT each time you access the relationship inside a loop, giving 1 + N queries. Fix with selectinload/joinedload.
- id: q5
  question: When does db.session.add(obj) write the row to the DB?
  options:
    - Immediately
    - On db.session.commit()
    - On request teardown
    - Never; it's just a hint
  correctIndex: 1
  explanation: add() stages the object; the actual INSERT (or UPDATE for changed objects) is flushed on db.session.commit(). Without commit the row is discarded.
- id: q6
  question: How does Flask-SQLAlchemy clean up the session per request?
  options:
    - It commits automatically
    - It rolls back unconditionally
    - It calls db.session.remove() at request/teardown
    - It closes the DB connection
  correctIndex: 2
  explanation: Flask-SQLAlchemy registers a teardown handler that calls db.session.remove(), releasing the connection to the pool and clearing the identity map.
- id: q7
  question: Why must you call .unique() with joinedload on a collection?
  options:
    - To sort the results
    - To enable caching
    - It's optional
    - To deduplicate parent rows returned once per child
  correctIndex: 3
  explanation: joinedload on a *-to-many produces one row per child, repeating the parent; .unique() deduplicates parents. selectinload doesn't need it.
- id: q8
  question: How do you turn on SQL echo to spot N+1 queries?
  options:
    - app.config['SQLALCHEMY_ECHO']=True
    - app.config['SQL_ECHO']=True
    - FLASK_ECHO=1
    - db.echo=True
  correctIndex: 0
  explanation: SQLALCHEMY_ECHO=True prints every SQL statement to stderr; combine with your view to count queries per request.
- id: q9
  question: Why should you never return a SQLAlchemy model directly from jsonify?
  options:
    - Flask forbids it
    - JSON can't serialize them and you'd leak columns; use a schema or explicit dict
    - It's slow
    - It triggers a DB query per JSON key
  correctIndex: 1
  explanation: jsonify raises TypeError on Model objects; use marshmallow/pydantic to define the output shape and avoid leaking columns like password_hash.
- id: q10
  question: What's the modern way to paginate in Flask-SQLAlchemy 3.x?
  options:
    - Model.query.paginate(1, 20)
    - .limit(20).offset(0)
    - .paginate(page=1, per_page=20) on the select()
    - There is no built-in pagination
  correctIndex: 2
  explanation: db.select(Model).paginate(page=1, per_page=20, max_per_page=100) returns a Pagination object with .items, .total, .pages, .has_next.
```

