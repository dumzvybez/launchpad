---
slug: express-authentication-jwt
id: express-16
track: express
order: 16
title: Authentication and JWT
description: Implement secure auth with JWT, bcrypt, middleware.
difficulty: advanced
estMinutes: 75
contentVersion: 1.0.0
---

# Authentication and JWT

## Authentication and JWT

### Why It Matters

Implement secure auth with JWT, bcrypt, middleware.

### Prerequisites

- Complete lesson 15 first.

### Topics

- JWT structure
- bcrypt hashing
- Auth middleware
- Token refresh

### Key Concepts

- JWT is stateless
- Always hash with bcrypt
- Access short refresh long

```javascript
const token = jwt.sign({userId}, secret, {expiresIn:1h})
```
Caption: Authentication and JWT - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Storing JWT_SECRET in code
- Not verifying expiration

### Real-World Applications

- User login
- API auth
- SPA backends

### Interview Questions

- Access vs refresh token?
- Why bcrypt not SHA-256?

### Mini Project

Build auth with register login protected routes.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Authentication and JWT"?
  options:
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - JWT structure
    - bcrypt hashing
  correctIndex: 2
  explanation: "The correct answer is: JWT structure"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It was deprecated in the latest version
    - JWT is stateless
    - It requires a paid commercial license to use
    - It is only supported on Linux operating systems
  correctIndex: 1
  explanation: "The correct answer is: JWT is stateless"
- id: q3
  question: Which of the following best describes a concept from "Authentication and JWT"?
  options:
    - Always hash with bcrypt
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
    - It requires root/administrator privileges
  correctIndex: 0
  explanation: "The correct answer is: Always hash with bcrypt"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
    - Access short refresh long
  correctIndex: 3
  explanation: "The correct answer is: Access short refresh long"
- id: q5
  question: Which of the following is a core topic in "Authentication and JWT"?
  options:
    - Writing device drivers
    - Managing database migrations
    - bcrypt hashing
    - JWT structure
  correctIndex: 2
  explanation: "The correct answer is: bcrypt hashing"
- id: q6
  question: What is a common pitfall related to "Authentication and JWT"?
  options:
    - Using version control for the project
    - Storing JWT_SECRET in code
    - Not verifying expiration
    - Naming variables with lowercase letters
  correctIndex: 1
  explanation: "The correct answer is: Storing JWT_SECRET in code"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Not verifying expiration
    - Testing code before deployment
    - Using descriptive variable names
    - Following established coding conventions
  correctIndex: 0
  explanation: "The correct answer is: Not verifying expiration"
- id: q8
  question: In what real-world scenario would you use the concepts from "Authentication and JWT"?
  options:
    - API auth
    - Writing poetry and creative fiction
    - Composing orchestral music scores
    - User login
  correctIndex: 3
  explanation: "The correct answer is: User login"
- id: q9
  question: Which of the following is a relevant interview question about "Authentication and JWT"?
  options:
    - How many planets are in the solar system?
    - What year was the company founded?
    - Access vs refresh token?
    - Why bcrypt not SHA-256?
  correctIndex: 2
  explanation: "The correct answer is: Access vs refresh token?"
- id: q10
  question: Why does "Authentication and JWT" matter in real-world practice?
  options:
    - It is only used by academic researchers, not industry
    - Implement secure auth with JWT, bcrypt, middleware.
    - It is a purely theoretical concept with no practical use
    - It was important historically but is no longer relevant
  correctIndex: 1
  explanation: "The correct answer is: Implement secure auth with JWT, bcrypt, middleware."
```

