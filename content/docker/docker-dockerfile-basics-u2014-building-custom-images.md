---
slug: docker-dockerfile-basics-u2014-building-custom-images
id: docker-02
track: docker
order: 2
title: Dockerfile Basics — Building Custom Images
description: Write a Dockerfile to package your application into a custom Docker image.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
---

# Dockerfile Basics — Building Custom Images

## Dockerfile Basics — Building Custom Images

### Why It Matters

A Dockerfile is how you package your own application into a reproducible, portable Docker image. It's the bridge between 'my code on my laptop' and 'my app running anywhere.' Every deployed containerized application starts with a Dockerfile.

A Dockerfile is a text file containing a series of instructions that Docker reads to build an image. Each instruction creates a new layer in the image, making builds cacheable and efficient.

### Prerequisites

- Complete the 'Getting Started with Docker' lesson
- Basic understanding of your application's dependencies

### Topics

- Dockerfile syntax: FROM, RUN, COPY, CMD
- Building images with docker build
- Tagging images
- Best practices: .dockerignore, layer caching

```dockerfile
# Dockerfile for a simple Node.js app
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies first (for caching)
COPY package*.json ./
RUN npm ci --production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
```
Caption: A typical Node.js Dockerfile

### Key Concepts

- FROM: the base image to build on (e.g., node:20, python:3.12, ubuntu:22.04)
- RUN: executes a command during the build (e.g., npm install)
- COPY: copies files from your machine into the image
- CMD: the default command to run when the container starts
- Layer caching: each instruction creates a layer; Docker caches layers so rebuilds are fast

### Common Pitfalls

- Copying all files before npm install — this invalidates the cache every time code changes, making rebuilds slow
- Using :latest tag — it's unpredictable; always pin a specific version
- Running as root — create a non-root user in the Dockerfile for security

### Interview Questions

- What does the FROM instruction do in a Dockerfile?
- Why would you COPY package.json and RUN npm install before copying the rest of the code?
- What's the difference between CMD and ENTRYPOINT?

### Mini Project

Write a Dockerfile for a simple Python Flask app, build it with docker build -t my-flask-app ., and run it with docker run -p 5000:5000 my-flask-app

### Exercises

1. Create a .dockerignore file to exclude node_modules, .git, and other unnecessary files from the build context
2. Add a HEALTHCHECK instruction to your Dockerfile

```quiz
- id: q1
  question: What does the FROM instruction in a Dockerfile do?
  options:
    - Runs a command
    - Sets the base image to build on
    - Copies files into the image
    - Exposes a port
  correctIndex: 1
  explanation: FROM specifies the base image — every Dockerfile starts with FROM (e.g., FROM node:20-alpine).
- id: q2
  question: Why should you COPY package.json and RUN npm install BEFORE copying the rest of your code?
  options:
    - It's required by Docker
    - For layer caching — dependencies only reinstall when package.json changes
    - To make the image smaller
    - To run the app faster
  correctIndex: 1
  explanation: Docker caches layers. By installing dependencies before copying code, the expensive npm install layer is cached and only re-runs when package.json changes — not on every code change.
- id: q3
  question: Which instruction sets the default command to run when the container starts?
  options:
    - RUN
    - CMD
    - EXEC
    - START
  correctIndex: 1
  explanation: CMD sets the default command. It can be overridden at runtime with docker run <image> <command>.
- id: q4
  question: What is the purpose of a .dockerignore file?
  options:
    - To ignore Docker errors
    - To exclude files from the build context (like .gitignore for Docker)
    - To skip building certain layers
    - To prevent Docker from running
  correctIndex: 1
  explanation: .dockerignore excludes files/directories from the build context, making builds faster and images smaller (e.g., exclude node_modules, .git, .env).
- id: q5
  question: Why should you avoid using the :latest tag in production?
  options:
    - It's too long
    - It's unpredictable — the image it points to can change over time
    - Docker doesn't support it
    - It requires more memory
  correctIndex: 1
  explanation: The :latest tag is a moving target — it can point to different images over time. Always pin a specific version (e.g., node:20.11-alpine) for reproducible builds.
```

