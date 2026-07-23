---
slug: docker-docker-best-practices-optimization
id: docker-05
track: docker
order: 5
title: Docker Best Practices & Optimization
description: Optimize Docker images for size, security, and build speed with multi-stage builds and best practices.
difficulty: intermediate
estMinutes: 80
contentVersion: 1.0.0
---

# Docker Best Practices & Optimization

## Docker Best Practices & Optimization

### Why It Matters

A poorly written Dockerfile produces large images, slow builds, and security vulnerabilities. Production Docker images should be small (faster to pull), secure (fewer attack surfaces), and cacheable (fast rebuilds). These best practices are what separate casual Docker users from professionals.

Multi-stage builds, alpine base images, layer optimization, and non-root users are the key techniques for production-grade Docker images.

### Prerequisites

- Complete 'Dockerfile Basics' and 'Docker Compose'
- Basic understanding of Linux permissions

### Topics

- Multi-stage builds
- Choosing the right base image (alpine vs slim vs full)
- Layer optimization and caching
- Security: non-root users, minimal images, scanning
- docker scan and Docker Scout

```dockerfile
# Multi-stage build for a Node.js app

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --production && npm cache clean --force

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER nodejs

EXPOSE 3000
CMD ["node", "dist/server.js"]
```
Caption: Multi-stage Dockerfile with non-root user

### Key Concepts

- Multi-stage build: use multiple FROM instructions; only the final stage ends up in the image (smaller image, no build tools in production)
- Alpine: a tiny Linux distribution (~5MB) — use node:20-alpine instead of node:20 for much smaller images
- Non-root user: containers run as root by default; create and switch to a non-root user for security
- Layer squashing: each RUN/COPY creates a layer; combine RUN commands to reduce layers

### Common Pitfalls

- Using full OS images (ubuntu:22.04 is ~77MB) when alpine would do (~5MB) — 15x larger than needed
- Leaving build tools (gcc, make, devDependencies) in the production image — increases size and attack surface
- Not scanning images for vulnerabilities — use docker scout or trivy to find CVEs in your base image

### Interview Questions

- What is a multi-stage build and why would you use it?
- How can you reduce the size of a Docker image?
- Why should you run containers as a non-root user?

### Mini Project

Take an existing single-stage Dockerfile and convert it to a multi-stage build. Compare the image sizes with docker images before and after.

### Exercises

1. Scan your image with docker scout to find vulnerabilities
2. Use a .dockerignore to exclude unnecessary files and measure the build time improvement

```quiz
- id: q1
  question: What is the main benefit of a multi-stage build?
  options:
    - Faster builds
    - Smaller final image — only the final stage's content is included
    - Better security
    - Easier to debug
  correctIndex: 1
  explanation: Multi-stage builds let you use a 'builder' stage with all build tools, then copy only the built artifacts into a clean final stage. The build tools and intermediate files don't end up in the production image — it's much smaller.
- id: q2
  question: Why use node:20-alpine instead of node:20?
  options:
    - It's more secure
    - It's much smaller (~5MB base vs ~100MB)
    - It's faster at runtime
    - It has more features
  correctIndex: 1
  explanation: Alpine Linux is ~5MB vs ~100MB for a full Debian-based image. Using alpine base images dramatically reduces image size and pull time.
- id: q3
  question: Why should containers run as a non-root user?
  options:
    - It's faster
    - Security — if an attacker breaks in, they have limited permissions
    - It's required by Docker
    - It uses less memory
  correctIndex: 1
  explanation: By default, containers run as root. If an attacker exploits a vulnerability in your app, they get root access inside the container. Creating and switching to a non-root user limits the damage.
- id: q4
  question: Which tool scans Docker images for known vulnerabilities?
  options:
    - docker scan
    - docker scout (or trivy)
    - docker check
    - docker security
  correctIndex: 1
  explanation: docker scout (formerly docker scan) and third-party tools like trivy scan images against CVE databases and report known vulnerabilities in the base image and installed packages.
- id: q5
  question: How do you combine multiple RUN commands to reduce layers?
  options:
    - Use semicolons
    - Chain with && in a single RUN instruction
    - You can't combine them
    - Use a script file
  correctIndex: 1
  explanation: "Each RUN creates a layer. Combine them: RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* — this creates one layer instead of three."
```

