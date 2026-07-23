---
slug: docker-multi-stage-builds-image-optimization
id: docker-20
track: docker
order: 20
title: Multi-stage Builds & Image Optimization
description: Create smaller, more secure Docker images using multi-stage builds, distroless base images, and layer optimization.
difficulty: advanced
estMinutes: 70
contentVersion: 1.0.0
---

# Multi-stage Builds & Image Optimization

## Multi-stage Builds & Image Optimization

### Why It Matters

Smaller images are faster to build, push, pull, and deploy. They also have a smaller attack surface, improving security.

### Prerequisites

- Complete Docker lesson 19 first.

### Topics

- Multi-stage build syntax
- Choosing minimal base images (alpine, distroless)
- Layer caching strategies
- .dockerignore optimization

### Key Concepts

- Multi-stage builds copy only needed artifacts from build stage
- Distroless images have no shell, reducing attack surface
- Order Dockerfile instructions from least to most frequently changing

```dockerfile
# Multi-stage build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```
Caption: Multi-stage Dockerfile

Multi-stage builds allow you to use multiple FROM statements in a single Dockerfile. Each FROM starts a new build stage. You can selectively copy artifacts from one stage to another, leaving behind everything you don't need in the final image.

### Common Pitfalls

- Copying everything with COPY . . invalidates cache on every change
- Large images slow deployment and increase attack surface
- Not using .dockerignore includes unnecessary files

### Real-World Applications

- Reducing image size from 1GB to 50MB
- Production-ready Node.js images
- Go binary in scratch image

### Interview Questions

- What is a distroless image and what are its benefits?
- How does layer caching work in Docker?
- What is the optimal Dockerfile instruction order?

### Mini Project

Create a multi-stage Dockerfile that reduces image size by at least 50% compared to a single-stage build.

### Exercises

1. Create a multi-stage Dockerfile
2. Compare image sizes before and after
3. Add a .dockerignore file

```quiz
- id: q1
  question: What is a multi-stage build?
  options:
    - Building on multiple machines
    - Using multiple FROM statements to create smaller final images
    - Building multiple images at once
    - A Docker Compose feature
  correctIndex: 1
  explanation: Multi-stage builds use multiple FROM statements, copying only needed artifacts from build stages to the final image.
- id: q2
  question: What is a distroless image?
  options:
    - An image with no base layer
    - An image with only the runtime and app, no shell or package manager
    - An image without Docker installed
    - A custom-built image
  correctIndex: 1
  explanation: Distroless images contain only your application and its runtime dependencies — no shell, package manager, or other tools.
- id: q3
  question: How do you copy artifacts from a build stage?
  options:
    - COPY --from=builder /app/dist ./dist
    - COPY --source=builder /app/dist ./dist
    - COPY builder:/app/dist ./dist
    - TRANSFER --from=builder /app/dist
  correctIndex: 0
  explanation: The COPY --from=<stage_name> instruction copies files from a named build stage.
- id: q4
  question: What is the optimal Dockerfile instruction order?
  options:
    - Random order
    - Most frequently changing first
    - Least frequently changing first
    - Alphabetical order
  correctIndex: 2
  explanation: Putting least-frequently-changing instructions first maximizes layer cache hits.
- id: q5
  question: What does a .dockerignore file do?
  options:
    - Ignores Docker errors
    - Excludes files and directories from the build context
    - Skips Dockerfile instructions
    - Ignores Docker daemon settings
  correctIndex: 1
  explanation: .dockerignore specifies files/directories to exclude from the build context, reducing build time and image size.
- id: q6
  question: Why use 'COPY package*.json ./' before 'COPY . .'?
  options:
    - It's required by Docker
    - To cache the npm install layer separately from source code changes
    - It reduces image size
    - It improves security
  correctIndex: 1
  explanation: Copying package.json first and running npm install before copying source code means dependency layers are cached unless package.json changes.
- id: q7
  question: What is the 'scratch' base image?
  options:
    - A debugging image
    - A completely empty image — the smallest possible base
    - A Docker cleanup tool
    - An experimental image
  correctIndex: 1
  explanation: scratch is Docker's empty base image — it contains absolutely nothing. Used for statically-compiled binaries.
- id: q8
  question: How does Alpine Linux reduce image size?
  options:
    - It compresses files
    - It uses musl libc and busybox instead of glibc and coreutils
    - It removes all documentation
    - It uses a smaller kernel
  correctIndex: 1
  explanation: Alpine uses musl libc and busybox, which are much smaller than glibc and standard GNU coreutils.
- id: q9
  question: What is BuildKit's --mount=type=cache?
  options:
    - A volume mount
    - A persistent cache mount shared between builds
    - A network mount
    - A secret mount
  correctIndex: 1
  explanation: --mount=type=cache creates a persistent cache that persists across builds, useful for package manager caches.
- id: q10
  question: What is the benefit of smaller Docker images?
  options:
    - They use less memory at runtime
    - Faster build, push, pull, and deploy; smaller attack surface
    - They are more secure by default
    - They use fewer CPU cycles
  correctIndex: 1
  explanation: Smaller images are faster to build, push, pull, and deploy. They also have a smaller attack surface.
```

