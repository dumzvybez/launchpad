---
slug: express-express-routing-restful-apis
id: express-03
track: express
order: 3
title: Express Routing & RESTful APIs
description: Structure Express apps with express.Router and build RESTful API endpoints.
difficulty: intermediate
estMinutes: 65
contentVersion: 1.0.0
---

# Express Routing & RESTful APIs

## Express Routing & RESTful APIs

### Why It Matters

A RESTful API is the standard way to expose data and functionality over HTTP. Express Router lets you organize routes into modular files — essential for any app with more than a handful of endpoints. This is the structure every production Express app uses.

REST (Representational State Transfer) is an architectural style for APIs that uses HTTP methods (GET, POST, PUT, DELETE) to operate on resources identified by URLs. Express Router lets you group related routes and mount them at a prefix.

### Prerequisites

- Complete 'Getting Started with Express.js' and 'Express Middleware Deep Dive'

### Topics

- RESTful API conventions
- express.Router() for modular routing
- HTTP methods: GET, POST, PUT, PATCH, DELETE
- Route parameters vs query parameters
- Status codes and response patterns

```javascript
// routes/users.js — modular router
const express = require('express');
const router = express.Router();

// In-memory data (replace with a database in production)
let users = [{ id: 1, name: 'Ada', email: 'ada@example.com' }];

// GET /users — list all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET /users/:id — get one user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /users — create a user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json(user);
});

// PUT /users/:id — update a user
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  res.json(user);
});

// DELETE /users/:id — delete a user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

// app.js — mount the router
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```
Caption: RESTful API with express.Router

### Key Concepts

- REST conventions: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)
- express.Router(): creates a modular, mountable route handler
- Route prefix: app.use('/users', usersRouter) mounts all user routes under /users
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Server Error

### Common Pitfalls

- Using GET for mutations — GET should never modify data (it breaks caching, bookmarks, and crawlers)
- Returning 200 for 'not found' — use 404, not 200 with { error: 'not found' }
- Not validating input — always validate req.body before using it; use a library like zod or joi

### Interview Questions

- What is a RESTful API?
- Explain the difference between PUT and PATCH
- How does express.Router help organize a large Express app?

### Mini Project

Build a complete RESTful API for a 'todo' resource with GET (list), POST (create), PUT (update), and DELETE (remove). Use express.Router and mount it at /api/todos.

### Exercises

1. Add input validation: POST /users should return 400 if name or email is missing
2. Add pagination: GET /users?page=2&limit=10 returns paginated results

```quiz
- id: q1
  question: Which HTTP method should you use to create a new resource?
  options:
    - GET
    - POST
    - PUT
    - DELETE
  correctIndex: 1
  explanation: POST creates a new resource. The server assigns the ID and returns 201 Created. The new resource's URL is typically returned in the Location header.
- id: q2
  question: What is the difference between PUT and PATCH?
  options:
    - They are the same
    - PUT replaces the entire resource; PATCH applies a partial update
    - PUT is faster
    - PATCH is for deletion
  correctIndex: 1
  explanation: "PUT replaces the entire resource (you send the full new state). PATCH applies a partial update (you send only the fields that changed). For example, PUT /users/1 with {name: 'Ada'} would erase the email field; PATCH would only change the name."
- id: q3
  question: What does express.Router() do?
  options:
    - Creates a new Express app
    - Creates a modular, mountable route handler
    - Routes requests to different servers
    - Creates a database connection
  correctIndex: 1
  explanation: express.Router() creates a mini-router that you can add routes to, then mount in your main app with app.use('/prefix', router). This lets you split routes into separate files (e.g., users.js, posts.js) for maintainability.
- id: q4
  question: Which status code indicates 'resource created successfully'?
  options:
    - "200"
    - "201"
    - "204"
    - "301"
  correctIndex: 1
  explanation: 201 Created indicates a new resource was successfully created. It's the standard response for POST requests that create a resource. 200 OK is for successful reads/updates; 204 No Content is for successful deletions.
- id: q5
  question: Why should GET requests never modify data?
  options:
    - They're too slow
    - GET is for reading only — modifying data on GET breaks caching, bookmarks, and web crawlers
    - GET doesn't support request bodies
    - It's a security rule
  correctIndex: 1
  explanation: GET is supposed to be 'safe' and 'idempotent' — it should only read data. Modifying data on GET breaks HTTP caching, browser pre-fetching, bookmarks (which might accidentally trigger actions), and web crawlers (like Googlebot). Use POST/PUT/DELETE for mutations.
```

