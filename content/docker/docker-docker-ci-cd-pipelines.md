---
slug: docker-docker-ci-cd-pipelines
id: docker-19
track: docker
order: 19
title: Docker CI/CD Pipelines
description: "Integrate Docker into CI/CD pipelines: build, test, scan, and push images automatically."
difficulty: advanced
estMinutes: 70
contentVersion: 1.0.0
---

# Docker CI/CD Pipelines

## Docker CI/CD Pipelines

### Why It Matters

Automating Docker image builds and deployments in CI/CD ensures consistent, tested, and secure deployments.

### Prerequisites

- Complete Docker lesson 18 first.

### Topics

- Building images in CI
- Multi-architecture builds (buildx)
- Image tagging strategies
- Automated vulnerability scanning

### Key Concepts

- Tag images with git commit SHA, not just 'latest'
- Use buildx for multi-arch images
- Cache layers in CI for faster builds

```bash
# Build and tag
DOCKER_BUILDKIT=1 docker build \
  -t myregistry/app:${GIT_SHA} \
  -t myregistry/app:latest .

# Push
docker push myregistry/app:${GIT_SHA}
docker push myregistry/app:latest

# Multi-arch build
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myregistry/app:${GIT_SHA} \
  --push .
```
Caption: CI/CD Docker commands

A good CI/CD pipeline for Docker should: build the image, run tests inside a container, scan for vulnerabilities, tag with semantic versioning or commit SHA, push to registry, and trigger deployment.

### Common Pitfalls

- Using 'latest' tag exclusively makes rollbacks impossible
- Not caching layers slows CI significantly
- Not scanning before pushing risks deploying vulnerable images

### Real-World Applications

- GitHub Actions with Docker
- GitLab CI container builds
- Automated deployment pipelines

### Interview Questions

- Why should you avoid using only the 'latest' tag in production?
- What is Docker buildx and why is it useful?
- How do you cache Docker layers in CI?

### Mini Project

Set up a GitHub Actions workflow that builds, scans, and pushes a Docker image on every commit.

### Exercises

1. Build an image with a commit SHA tag
2. Set up layer caching in CI
3. Run a security scan in the pipeline

```quiz
- id: q1
  question: Why should you avoid using only the 'latest' tag in production?
  options:
    - It's too long
    - It makes rollbacks impossible — you can't distinguish versions
    - Docker doesn't support it
    - It requires more memory
  correctIndex: 1
  explanation: Without unique tags (like commit SHA or version number), you can't identify or roll back to a specific version.
- id: q2
  question: What is Docker buildx used for?
  options:
    - Building faster images
    - Multi-architecture builds (amd64, arm64)
    - Building smaller images
    - Building secure images
  correctIndex: 1
  explanation: buildx enables building images for multiple CPU architectures simultaneously.
- id: q3
  question: What should a CI/CD pipeline do after building a Docker image?
  options:
    - Push immediately
    - Run tests, scan for vulnerabilities, then push
    - Delete the image
    - Tag with 'latest' only
  correctIndex: 1
  explanation: A proper pipeline runs tests and security scans before pushing the image to a registry.
- id: q4
  question: How do you cache Docker layers in GitHub Actions?
  options:
    - Use docker save/load
    - Use docker/build-push-action with cache-from/cache-to
    - You can't cache in CI
    - Use a larger runner
  correctIndex: 1
  explanation: The docker/build-push-action supports cache-from and cache-to parameters for layer caching.
- id: q5
  question: What is BuildKit?
  options:
    - A Docker alternative
    - A backend for building Docker images with better caching and parallelism
    - A Docker registry
    - A security scanner
  correctIndex: 1
  explanation: BuildKit is Docker's modern build backend that provides parallel builds, better caching, and multi-stage optimizations.
- id: q6
  question: What is the best image tagging strategy?
  options:
    - Only use 'latest'
    - Use semantic version + commit SHA
    - Use random strings
    - Use timestamps only
  correctIndex: 1
  explanation: Combining semantic version (v1.2.3) with commit SHA provides both human-readable and unique identifiers.
- id: q7
  question: What does '--push' do in 'docker buildx build --push'?
  options:
    - Pushes the builder to GitHub
    - Builds and pushes the image to a registry in one step
    - Pushes the Dockerfile
    - Pushes build logs
  correctIndex: 1
  explanation: The --push flag builds the image and pushes it to the specified registry in a single command.
- id: q8
  question: Why is layer caching important in CI?
  options:
    - It uses less disk space
    - It significantly speeds up builds by reusing unchanged layers
    - It improves image security
    - It reduces image size
  correctIndex: 1
  explanation: Layer caching avoids rebuilding unchanged layers, reducing build time from minutes to seconds.
- id: q9
  question: What should you scan Docker images for in CI?
  options:
    - Image size
    - Known vulnerabilities (CVEs)
    - Dockerfile formatting
    - Layer count
  correctIndex: 1
  explanation: Scanning for known vulnerabilities (CVEs) ensures you don't deploy images with security issues.
- id: q10
  question: What is a Docker registry?
  options:
    - A Docker daemon
    - A storage and distribution system for Docker images
    - A Docker network
    - A Docker plugin
  correctIndex: 1
  explanation: A Docker registry stores and distributes Docker images (e.g., Docker Hub, GitHub Container Registry, ECR).
```

