---
slug: docker-getting-started-docker
id: docker-01
track: docker
order: 1
title: Getting Started with Docker
description: Understand what Docker is, why it exists, and run your first container.
difficulty: beginner
estMinutes: 60
contentVersion: 1.0.0
---

# Getting Started with Docker

## Getting Started with Docker

### Why It Matters

Docker solves the 'it works on my machine' problem. It packages your application and its dependencies into a single, portable container that runs identically on any machine — your laptop, a colleague's computer, or a production server. Every modern tech company uses Docker for deployment.

Docker is a platform for developing, shipping, and running applications in containers. A container is a lightweight, standalone, executable package that includes everything needed to run an application: code, runtime, system tools, libraries, and settings.

### Prerequisites

- Basic command-line/terminal familiarity
- A computer running Windows, macOS, or Linux
- No prior Docker or container experience needed

### Topics

- What is a container vs a virtual machine?
- Installing Docker Desktop
- The docker command-line interface
- Running your first container: hello-world
- Understanding images vs containers

```bash
# Check Docker is installed
docker --version
# Run your first container
docker run hello-world

# List running containers
docker ps
# List all containers (including stopped)
docker ps -a
# List downloaded images
docker images
```
Caption: Basic Docker commands

### Key Concepts

- Image: a read-only template with instructions for creating a container (like a class in OOP)
- Container: a runnable instance of an image (like an object in OOP)
- Docker Engine: the runtime that builds and runs containers
- Docker Hub: the public registry where images are stored (like GitHub for containers)

### Common Pitfalls

- Forgetting to stop and remove old containers — they accumulate and waste disk space
- Running containers as root by default — for production, create a non-root user
- Not understanding that containers are ephemeral — data inside a container is lost when it stops; use volumes for persistence

### Interview Questions

- What's the difference between a Docker image and a container?
- How does Docker differ from a virtual machine?
- What is Docker Hub and why is it useful?

### Mini Project

Run the nginx web server in a container and access it in your browser: docker run -d -p 8080:80 nginx, then open http://localhost:8080

### Exercises

1. Run the ubuntu container interactively: docker run -it ubuntu bash
2. List all containers on your system and clean up stopped ones with docker container prune

```quiz
- id: q1
  question: What is the key difference between a Docker image and a container?
  options:
    - An image is a running process; a container is a file
    - An image is a read-only template; a container is a running instance of it
    - They are the same thing
    - A container is a template; an image is a running instance
  correctIndex: 1
  explanation: An image is the blueprint (read-only template), and a container is a running instance created from that image — like a class vs an object in OOP.
- id: q2
  question: Which command runs a container from the hello-world image?
  options:
    - docker start hello-world
    - docker run hello-world
    - docker create hello-world
    - docker execute hello-world
  correctIndex: 1
  explanation: docker run creates AND starts a container from an image. docker create only creates it; docker start starts an existing container.
- id: q3
  question: What happens to data inside a container when the container stops?
  options:
    - It's automatically saved to Docker Hub
    - It's preserved forever
    - It's lost unless you use a volume
    - It's saved to the host's /tmp directory
  correctIndex: 2
  explanation: Containers are ephemeral — data written inside the container filesystem is lost when the container is removed. Use Docker volumes or bind mounts for data that needs to persist.
- id: q4
  question: Which command lists all running containers?
  options:
    - docker list
    - docker ps
    - docker containers
    - docker show
  correctIndex: 1
  explanation: docker ps lists running containers. Use docker ps -a to include stopped containers.
- id: q5
  question: What is Docker Hub?
  options:
    - A local container storage
    - A public registry for Docker images
    - A Docker command-line tool
    - A container orchestration platform
  correctIndex: 1
  explanation: Docker Hub is the default public registry where Docker images are stored and shared — like GitHub but for container images.
```

