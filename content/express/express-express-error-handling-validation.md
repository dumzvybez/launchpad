---
slug: express-express-error-handling-validation
id: express-04
track: express
order: 4
title: Express Error Handling & Validation
description: Handle errors gracefully and validate user input with proper patterns and libraries.
difficulty: intermediate
estMinutes: 60
contentVersion: 1.0.0
---

# Express Error Handling & Validation

## Express Error Handling & Validation

### Why It Matters

Bad input and unhandled errors crash APIs and leak sensitive data. Production Express apps MUST validate every input and handle every error gracefully. This lesson covers the patterns that keep your API secure and reliable.

Express error handling has two parts: (1) input validation (reject bad data before it reaches your logic) and (2) error-handling middleware (catch and format errors consistently).

### Prerequisites

- Complete all previous Express lessons
- Basic understanding of async/await and try/catch

### Topics

- Input validation with zod or joi
- Validation middleware pattern
- Async error handling (try/catch vs express-async-handler)
- Custom error classes
- Global error-handling middleware
- Production vs development error responses

```javascript
// Validation with zod
const { z } = require('zod');

// Define a schema
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  age: z.number().int().min(0).max(150).optional(),
});

// Validation middleware
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues,
      });
    }
    req.body = result.data; // use the validated/transformed data
    next();
  };
}

// Use it
app.post('/users', validate(createUserSchema), (req, res) => {
  // req.body is guaranteed to match the schema
  res.status(201).json({ user: req.body });
});

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global error handler (must be LAST middleware)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';
  res.status(statusCode).json({
    error: err.message,
    ...(isDev && { stack: err.stack }),
  });
});
```
Caption: Validation and error handling patterns

### Key Concepts

- Schema validation: define the expected shape of data; reject anything that doesn't match
- safeParse: returns { success, data } or { success, error } — doesn't throw
- Operational errors: expected errors (bad input, not found) vs programming errors (bugs, undefined variable)
- Error middleware: 4-argument function, must be registered LAST in the middleware chain

### Common Pitfalls

- Using try/catch in every route — use express-async-handler or Express 5's built-in async support instead
- Leaking stack traces in production — only show them in development
- Catching errors but not passing them to next(err) — the error handler never runs

### Interview Questions

- How do you handle async errors in Express 4 vs Express 5?
- What is the difference between operational and programming errors?
- How do you validate user input in Express?

### Mini Project

Add input validation to your todo API: POST /api/todos must validate that 'title' is a non-empty string and 'completed' is an optional boolean. Return 400 with specific error messages for invalid input.

### Exercises

1. Create a custom AppError class and use it in your routes (e.g., throw new AppError('User not found', 404))
2. Add a 404 handler for unknown routes that returns { error: 'Route not found' }

```quiz
- id: q1
  question: What does zod's safeParse() return?
  options:
    - The parsed data or throws
    - "An object: { success: true, data } or { success: false, error }"
    - A boolean
    - A promise
  correctIndex: 1
  explanation: "safeParse() returns { success: true, data } if validation passes, or { success: false, error } if it fails. Unlike parse(), it doesn't throw — you handle both cases explicitly."
- id: q2
  question: How many arguments does Express error-handling middleware have?
  options:
    - "2"
    - "3"
    - "4"
    - "5"
  correctIndex: 2
  explanation: "Error-handling middleware has 4 arguments: (err, req, res, next). Express identifies error handlers by this arity — the extra 'err' parameter at the front."
- id: q3
  question: Why should you never show stack traces in production?
  options:
    - They're too long
    - They leak internal implementation details (file paths, library versions) that help attackers
    - They slow down the response
    - They're not informative
  correctIndex: 1
  explanation: Stack traces reveal internal file paths, library names, and code structure — valuable information for attackers. In production, return a generic error message. In development, include the stack for debugging.
- id: q4
  question: What is an 'operational error' in Express?
  options:
    - A bug in the code
    - An expected error like 'user not found' or 'invalid input' that the app handles gracefully
    - A server crash
    - A network timeout
  correctIndex: 1
  explanation: Operational errors are expected runtime errors the app can handle gracefully (404 not found, 400 bad request, 401 unauthorized). Programming errors are bugs (undefined variable, type error) that require code fixes. The distinction helps decide whether to send an error response or crash the process.
- id: q5
  question: Where should the error-handling middleware be registered?
  options:
    - First, before all routes
    - In the middle, between routes
    - Last, after all routes and other middleware
    - It doesn't matter
  correctIndex: 2
  explanation: Error-handling middleware must be registered LAST — after all routes and other middleware. Express matches middleware in registration order, so if you register the error handler before a route, it won't catch errors from that route.
```

