---
slug: express-express-middleware-deep-dive
id: express-02
track: express
order: 2
title: Express Middleware Deep Dive
description: Master middleware — the backbone of Express. Build custom middleware for logging, auth, and error handling.
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Express Middleware Deep Dive

## Express Middleware Deep Dive

### Why It Matters

Middleware is the heart of Express. Authentication, logging, CORS, body parsing, error handling — everything in Express is middleware. Understanding middleware deeply is what separates beginners from production-ready Express developers.

Middleware functions are executed in the order they are added with app.use(). Each middleware receives (req, res, next) and can modify the request, end the response, or call next() to pass control to the next middleware.

### Prerequisites

- Complete 'Getting Started with Express.js'
- Understanding of JavaScript closures and higher-order functions

### Topics

- Writing custom middleware
- Application-level vs router-level middleware
- Error-handling middleware
- Third-party middleware (cors, morgan, helmet)
- The next() function and the middleware chain

```javascript
// Custom logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next(); // pass control to the next middleware
});

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // Verify token...
  req.user = { id: 1, name: 'Ada' }; // attach user to request
  next();
}

// Use middleware on specific routes only
app.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Error-handling middleware (4 arguments!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```
Caption: Custom middleware examples

### Key Concepts

- next(): passes control to the next middleware — if you forget this, the request hangs
- Error middleware: has 4 arguments (err, req, res, next) — Express recognizes it by the arity
- app.use() applies to ALL routes; app.get('/path', middleware, handler) applies to specific routes
- Third-party middleware: cors (cross-origin), morgan (logging), helmet (security headers), express-rate-limit

### Common Pitfalls

- Forgetting next() — the request hangs forever because no middleware sends a response or passes control
- Not handling async errors — async middleware needs try/catch or use express-async-handler
- Putting error middleware before route handlers — it won't catch errors from routes defined after it

### Interview Questions

- Explain the middleware chain in Express
- What is the difference between app.use() and app.get() with middleware?
- How does error-handling middleware differ from regular middleware?

### Mini Project

Build an API with: (1) a logging middleware that prints each request, (2) an auth middleware that checks for a fake API key in headers, (3) a protected /admin route that requires auth, and (4) a global error handler.

### Exercises

1. Add the cors middleware to allow cross-origin requests from a frontend
2. Install and configure helmet to add security headers to your API

```quiz
- id: q1
  question: What does the next() function do in Express middleware?
  options:
    - Skips to the next route
    - Passes control to the next middleware function in the chain
    - Sends the response
    - Starts the server
  correctIndex: 1
  explanation: next() passes control to the next middleware function. If you don't call next() and don't send a response, the request hangs indefinitely — the client times out.
- id: q2
  question: How does Express recognize error-handling middleware?
  options:
    - By the function name
    - By having 4 arguments (err, req, res, next)
    - By being registered last
    - By using try/catch
  correctIndex: 1
  explanation: "Express identifies error-handling middleware by its arity — it must have exactly 4 parameters: (err, req, res, next). Regular middleware has 3 (req, res, next)."
- id: q3
  question: What is the difference between app.use(middleware) and app.get('/path', middleware, handler)?
  options:
    - They are the same
    - app.use applies to ALL routes; app.get with middleware applies to specific routes only
    - app.use is faster
    - app.get is for GET requests only
  correctIndex: 1
  explanation: app.use(middleware) runs for EVERY request regardless of method or path. app.get('/path', middleware, handler) runs the middleware only for GET requests to /path — route-specific middleware.
- id: q4
  question: What happens if you forget to call next() in middleware?
  options:
    - The server crashes
    - The request hangs forever (client times out)
    - Express skips to the next route automatically
    - The response is sent automatically
  correctIndex: 1
  explanation: If middleware doesn't call next() and doesn't send a response (res.send/res.json), the request hangs indefinitely. The client will eventually time out. Always either call next() or send a response.
- id: q5
  question: Which third-party middleware adds security headers?
  options:
    - cors
    - morgan
    - helmet
    - body-parser
  correctIndex: 2
  explanation: helmet sets various HTTP headers for security — it helps protect against well-known web vulnerabilities like XSS, clickjacking, and MIME sniffing. Just app.use(helmet()) and you're protected.
```

