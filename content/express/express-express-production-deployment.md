---
slug: express-express-production-deployment
id: express-05
track: express
order: 5
title: Express Production Deployment
description: Deploy Express apps to production with security, performance, and reliability best practices.
difficulty: advanced
estMinutes: 85
contentVersion: 1.0.0
---

# Express Production Deployment

## Express Production Deployment

### Why It Matters

A development Express app is very different from a production one. Production apps need security headers, rate limiting, compression, process management (PM2), logging, monitoring, and proper environment configuration. Skip these and your app will be slow, vulnerable, and hard to debug.

Production readiness involves: security middleware (helmet, cors, rate-limit), performance (compression, clustering), process management (PM2 or Docker), logging (winston/pino), and environment-based configuration.

### Prerequisites

- Complete all previous Express lessons
- Basic understanding of environment variables
- Familiarity with Docker (helpful but not required)

### Topics

- Security: helmet, cors, express-rate-limit
- Performance: compression, clustering
- Process management with PM2
- Logging with winston or pino
- Environment variables and dotenv
- Graceful shutdown

```javascript
// Production Express setup
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Trust proxy (needed when behind a reverse proxy like nginx/load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet()); // security headers
app.use(cors({ origin: process.env.CORS_ORIGIN })); // restrict origins

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window per IP
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Performance
app.use(compression()); // gzip responses

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10kb' })); // limit body size

// Routes
app.use('/api/users', require('./routes/users'));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
Caption: Production Express configuration

### Key Concepts

- helmet: adds 15 security headers (XSS protection, clickjacking prevention, etc.) with one line
- Rate limiting: prevents brute-force and DDoS — express-rate-limit caps requests per IP per window
- compression: gzip responses — reduces bandwidth by 50-70%
- PM2: process manager — auto-restarts on crash, clustering for multi-core utilization
- trust proxy: needed when behind nginx/load balancer — makes req.ip and rate limiting work correctly

### Common Pitfalls

- Not setting NODE_ENV=production in production — Express runs slower in development mode
- Using console.log for logging — use winston or pino for structured, leveled logging
- Not handling SIGTERM — Kubernetes/Docker sends SIGTERM to shut down; handle it to finish in-flight requests

### Interview Questions

- What security middleware should every production Express app use?
- How does rate limiting work and why is it important?
- What is graceful shutdown and how do you implement it?

### Mini Project

Take your todo API and add: helmet, cors (restrict to localhost:3000), rate limiting (100 req/15min), compression, morgan logging, and dotenv for configuration. Run it with NODE_ENV=production.

### Exercises

1. Install PM2 and run your app with pm2 start app.js --name todo-api -i max (cluster mode)
2. Add a health check endpoint (GET /health) that returns { status: 'ok', uptime: seconds } for load balancer probes

```quiz
- id: q1
  question: What does helmet() do?
  options:
    - Adds a helmet logo
    - Adds 15+ security-related HTTP headers
    - Encrypts responses
    - Blocks DDoS attacks
  correctIndex: 1
  explanation: helmet() sets various HTTP headers to improve security — including X-Content-Type-Options, X-Frame-Options, Content-Security-Policy, and more. It's the easiest way to secure an Express app.
- id: q2
  question: Why is rate limiting important in production?
  options:
    - It makes the app faster
    - It prevents brute-force attacks and DDoS by capping requests per IP per time window
    - It reduces server costs
    - It's required by law
  correctIndex: 1
  explanation: Rate limiting caps how many requests a single IP can make in a time window (e.g., 100 per 15 minutes). This prevents brute-force password attacks, API abuse, and basic DDoS attacks.
- id: q3
  question: What does compression() middleware do?
  options:
    - Minifies JavaScript
    - Gzip-compresses HTTP responses — reduces bandwidth by 50-70%
    - Compresses images
    - Compresses the database
  correctIndex: 1
  explanation: compression() gzip-compresses HTTP responses. The server sends compressed data; the browser decompresses it. This reduces bandwidth and speeds up page loads, especially for large JSON API responses.
- id: q4
  question: What is graceful shutdown?
  options:
    - Turning off the server quickly
    - Handling SIGTERM to stop accepting new requests, finish in-flight requests, then exit cleanly
    - Forcing the server to stop immediately
    - Restarting the server periodically
  correctIndex: 1
  explanation: "Graceful shutdown: when the server receives SIGTERM (from Docker/Kubernetes/PM2), it stops accepting new connections, finishes processing in-flight requests, closes database connections, then exits. This prevents dropped requests and data corruption."
- id: q5
  question: Why must you set app.set('trust proxy', 1) when behind a reverse proxy?
  options:
    - It makes the app faster
    - It makes req.ip and rate limiting work correctly — the proxy's IP would be used otherwise
    - It's required by Express
    - It enables HTTPS
  correctIndex: 1
  explanation: Behind a reverse proxy (nginx, load balancer), req.ip would be the proxy's IP, not the client's. trust proxy tells Express to use the X-Forwarded-For header to get the real client IP — essential for rate limiting and logging.
```

