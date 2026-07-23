---
slug: express-getting-started-express-js
id: express-01
track: express
order: 1
title: Getting Started with Express.js
description: Build your first web server with Express.js — the most popular Node.js web framework.
difficulty: beginner
estMinutes: 55
contentVersion: 1.0.0
---

# Getting Started with Express.js

## Getting Started with Express.js

### Why It Matters

Express.js is the foundational web framework for Node.js — it powers the backend of companies like Uber, IBM, and Netflix. Understanding Express is essential for any JavaScript full-stack developer. It's minimal, flexible, and teaches you how HTTP works at a low level.

Express is a fast, unopinionated, minimalist web framework for Node.js. It provides a thin layer of fundamental web application features, without obscuring Node.js features you already know.

### Prerequisites

- Basic JavaScript (functions, objects, async/await)
- Node.js installed (v18+)
- Understanding of HTTP methods (GET, POST)

### Topics

- What is Express and why use it?
- Creating an Express app
- Routing: GET and POST handlers
- Sending JSON and HTML responses
- Listening on a port

```javascript
// Install: npm install express
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// GET route — returns a greeting
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// GET route with a URL parameter
app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

// POST route — receives JSON data
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
Caption: A basic Express server

### Key Concepts

- Route: a URL path + HTTP method combination (e.g., GET /users)
- req (request): contains the URL, headers, query params, body, and params
- res (response): methods to send data back — res.json(), res.send(), res.status()
- Middleware: functions that run between receiving a request and sending a response (app.use())

### Common Pitfalls

- Forgetting app.use(express.json()) — req.body will be undefined for POST requests with JSON bodies
- Not sending a response — the request hangs forever; always call res.send(), res.json(), or res.end()
- Using res.send() after res.json() — can't send a response twice; pick one

### Interview Questions

- What is Express.js and why is it popular?
- Explain the difference between req.params and req.query
- What is middleware in Express?

### Mini Project

Build a simple API with 3 routes: GET / (returns a welcome message), GET /health (returns { status: 'ok' }), and POST /echo (returns the JSON body you sent). Test with curl or Postman.

### Exercises

1. Add a GET /users/:id route that returns a user object based on the :id parameter
2. Add query parameter support: GET /search?q=express returns { query: 'express' }

```quiz
- id: q1
  question: What is Express.js?
  options:
    - A database
    - A minimal web framework for Node.js
    - A frontend library
    - A CSS framework
  correctIndex: 1
  explanation: Express is a fast, unopinionated, minimalist web framework for Node.js. It provides routing, middleware, and HTTP utilities — the foundation for most Node.js backends.
- id: q2
  question: What does app.get('/users/:id', handler) do?
  options:
    - Gets all users
    - Defines a route that handles GET requests to /users/:id (e.g., /users/42)
    - Gets a user by ID from the database
    - Redirects to /users
  correctIndex: 1
  explanation: app.get('/users/:id', handler) registers a route handler for GET requests to /users/:id. The :id is a URL parameter accessible via req.params.id.
- id: q3
  question: What is middleware in Express?
  options:
    - A database driver
    - A function that runs between receiving a request and sending a response
    - A frontend framework
    - A package manager
  correctIndex: 1
  explanation: "Middleware are functions that have access to req, res, and the next() function. They run in order, processing the request before it reaches your route handler. Example: app.use(express.json()) parses JSON bodies."
- id: q4
  question: Why do you need app.use(express.json())?
  options:
    - To send JSON responses
    - To parse incoming JSON request bodies (so req.body works)
    - To format the response as JSON
    - It's optional
  correctIndex: 1
  explanation: express.json() is middleware that parses incoming request bodies with JSON payloads and makes them available as req.body. Without it, req.body is undefined for POST/PUT requests.
- id: q5
  question: How do you send a 201 Created status code?
  options:
    - res.send(201)
    - res.status(201).json({...})
    - res.code(201)
    - res.created()
  correctIndex: 1
  explanation: Use res.status(201) to set the status code, then chain .json() or .send() to send the response. 201 is the standard status code for successful resource creation.
```

