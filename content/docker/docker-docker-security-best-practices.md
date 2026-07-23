---
slug: docker-docker-security-best-practices
id: docker-18
track: docker
order: 18
title: Docker Security Best Practices
description: "Secure your Docker containers: image scanning, least privilege, secrets management, and runtime protection."
difficulty: advanced
estMinutes: 75
contentVersion: 1.0.0
---

# Docker Security Best Practices

## Docker Security Best Practices

### Why It Matters

Containers share the host kernel, so security vulnerabilities can affect the entire system. Following security best practices is critical for production deployments.

### Prerequisites

- Complete Docker lesson 17 first.

### Topics

- Running as non-root user
- Read-only filesystems
- Image scanning and vulnerability detection
- Docker secrets for sensitive data

### Key Concepts

- Never run containers as root
- Use multi-stage builds to reduce attack surface
- Scan images with Trivy or Snyk

```dockerfile
# Run as non-root user
FROM node:20-alpine
RUN addgroup -S app && adduser -S app -G app
USER app

# Read-only filesystem
docker run --read-only myimage

# Use Docker secrets
echo "mysecret" | docker secret create db_password -

# Scan an image
trivy image myimage:latest
```
Caption: Docker security practices

Container security involves multiple layers: the base image, the application code, the runtime configuration, and the host system. Each layer must be secured independently.

### Common Pitfalls

- Running as root gives attackers full container access
- Storing secrets in environment variables is visible via docker inspect
- Not scanning images leaves known vulnerabilities

### Real-World Applications

- Compliance requirements (SOC2, PCI)
- Multi-tenant container platforms
- Supply chain security

### Interview Questions

- What are Docker secrets and how do they differ from environment variables?
- How do you reduce a Docker image's attack surface?
- What is the principle of least privilege in containers?

### Mini Project

Create a Dockerfile that runs as a non-root user, uses a read-only filesystem, and passes a security scan.

### Exercises

1. Create a non-root user in a Dockerfile
2. Run a container with --read-only
3. Scan an image with Trivy

```quiz
- id: q1
  question: Why should you avoid running containers as root?
  options:
    - It uses more memory
    - It gives attackers full container access if compromised
    - It's slower
    - Docker doesn't support it
  correctIndex: 1
  explanation: Running as root means an attacker who compromises the container has root privileges, increasing the attack surface.
- id: q2
  question: What does the USER instruction in a Dockerfile do?
  options:
    - Sets the Docker daemon user
    - Sets the user for running the container
    - Creates a new system user
    - Authenticates with Docker Hub
  correctIndex: 1
  explanation: The USER instruction sets the user (and optionally group) for instructions that follow it in the Dockerfile.
- id: q3
  question: What does --read-only do when running a container?
  options:
    - Makes the image read-only
    - Makes the container's filesystem read-only
    - Prevents pulling new images
    - Disables network access
  correctIndex: 1
  explanation: The --read-only flag mounts the container's root filesystem as read-only, preventing writes to it.
- id: q4
  question: How are Docker secrets different from environment variables?
  options:
    - Secrets are encrypted and not visible in docker inspect
    - Secrets are faster
    - Secrets can only be strings
    - There is no difference
  correctIndex: 0
  explanation: Docker secrets are encrypted at rest and in transit, and are not visible in docker inspect or docker exec.
- id: q5
  question: What tool can scan Docker images for vulnerabilities?
  options:
    - docker scan
    - trivy
    - docker security
    - Both docker scan and trivy
  correctIndex: 3
  explanation: Both 'docker scan' (built-in) and 'trivy' (third-party) can scan images for known vulnerabilities.
- id: q6
  question: What is a distroless image?
  options:
    - An image with no operating system
    - An image with only the runtime and application, no shell or package manager
    - An image without a base layer
    - An unofficial Docker image
  correctIndex: 1
  explanation: Distroless images contain only your application and its runtime dependencies — no shell, package manager, or other tools.
- id: q7
  question: How do multi-stage builds improve security?
  options:
    - By encrypting the image
    - By reducing the final image size and attack surface
    - By adding more security layers
    - By using HTTPS
  correctIndex: 1
  explanation: Multi-stage builds copy only needed artifacts from build stages, excluding build tools and intermediate files from the final image.
- id: q8
  question: What is the principle of least privilege in Docker?
  options:
    - Running containers with only the permissions they need
    - Using the smallest base image
    - Limiting container count
    - Using Docker Enterprise
  correctIndex: 0
  explanation: Least privilege means giving containers only the minimum capabilities and permissions needed to function.
- id: q9
  question: What does 'docker scout' do?
  options:
    - Monitors container health
    - Scans images for vulnerabilities and provides remediation advice
    - Tracks container resource usage
    - Manages Docker networks
  correctIndex: 1
  explanation: Docker Scout scans images for vulnerabilities, compares against base images, and suggests fixes.
- id: q10
  question: Why should you avoid storing secrets in environment variables?
  options:
    - They use too much memory
    - They're visible via docker inspect and in logs
    - They expire quickly
    - They can only hold numbers
  correctIndex: 1
  explanation: Environment variables are visible in docker inspect, docker exec, and potentially in application logs.
```

