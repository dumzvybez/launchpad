---
slug: docker-capstone-project
id: docker-capstone
track: docker
order: 21
title: "Capstone: Containerize a Full-Stack App"
description: "Put it all together: containerize a full-stack application with frontend, backend, and database using Docker Compose."
difficulty: advanced
estMinutes: 180
contentVersion: 1.0.0
---

# Capstone: Containerize a Full-Stack App

## Capstone: Containerize a Full-Stack App

### Why It Matters

This capstone brings together everything you've learned about Docker: images, containers, networking, volumes, security, and Docker Compose.

### Prerequisites

- Complete all Docker lessons 01-20 first.

### Topics

- Designing a multi-container architecture
- Docker Compose for local development
- Environment management (dev vs prod)
- Health checks and restart policies

### Key Concepts

- Use Docker Compose for multi-container apps
- Health checks prevent routing to unhealthy containers
- Restart policies ensure availability

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on:
      backend:
        condition: service_healthy
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
volumes:
  pgdata:
```
Caption: docker-compose.yml for full-stack app

This capstone project demonstrates a real-world Docker setup: a React frontend, a Node.js backend, and a PostgreSQL database — all containerized and connected via Docker Compose with health checks and persistent storage.

### Common Pitfalls

- Not using health checks causes race conditions on startup
- Hardcoding secrets in compose files is a security risk
- Not using volumes for databases loses data

### Real-World Applications

- Full-stack development environments
- Microservices deployment
- CI/CD integration testing

### Interview Questions

- How do health checks improve container orchestration?
- What is the difference between depends_on and health checks?
- How do you manage secrets in Docker Compose?

### Mini Project

Create a docker-compose.yml for a 3-service app (frontend, backend, database) with health checks, volumes, and environment-specific configuration.

### Exercises

1. Create a multi-service docker-compose.yml
2. Add health checks to services
3. Configure volume persistence for the database

```quiz
- id: q1
  question: What is Docker Compose used for?
  options:
    - Building Docker images
    - Defining and running multi-container applications
    - Scanning images for vulnerabilities
    - Managing Docker networks
  correctIndex: 1
  explanation: Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file.
- id: q2
  question: "What does 'depends_on' with 'condition: service_healthy' do?"
  options:
    - Starts the dependency after the main service
    - Waits for the dependency to be healthy before starting
    - Checks if the service exists
    - Creates a network between services
  correctIndex: 1
  explanation: depends_on with service_healthy waits until the dependency's health check passes before starting the dependent service.
- id: q3
  question: How do you persist database data in Docker Compose?
  options:
    - Use a named volume
    - Store it in the container filesystem
    - Use environment variables
    - Use bind mounts only
  correctIndex: 0
  explanation: Named volumes persist data across container restarts and removals.
- id: q4
  question: What is a health check in Docker?
  options:
    - A security scan
    - A command that checks if a container is healthy
    - A network test
    - A Docker daemon check
  correctIndex: 1
  explanation: A health check runs a command periodically to determine if the container is functioning properly.
- id: q5
  question: What restart policy keeps a container always running?
  options:
    - "restart: no"
    - "restart: always"
    - "restart: on-failure"
    - "restart: unless-stopped"
  correctIndex: 3
  explanation: "restart: unless-stopped keeps the container running unless it was explicitly stopped."
- id: q6
  question: How do you pass environment variables in docker-compose.yml?
  options:
    - Using the env key
    - Using the environment key
    - Using the variables key
    - Using the config key
  correctIndex: 1
  explanation: The 'environment' key in docker-compose.yml sets environment variables for a service.
- id: q7
  question: What is the purpose of the 'build' key in docker-compose.yml?
  options:
    - Builds the image from a Dockerfile
    - Downloads an image from Docker Hub
    - Compiles the application
    - Runs tests
  correctIndex: 0
  explanation: The 'build' key specifies a directory containing a Dockerfile to build the image from.
- id: q8
  question: How do you run Docker Compose in detached mode?
  options:
    - docker-compose up -d
    - docker-compose start --detach
    - docker-compose run --background
    - docker-compose up --background
  correctIndex: 0
  explanation: The -d flag runs containers in detached (background) mode.
- id: q9
  question: What does 'docker-compose down' do?
  options:
    - Stops containers but keeps them
    - Stops and removes containers, networks, and volumes (unless specified)
    - Deletes the docker-compose.yml
    - Shuts down Docker daemon
  correctIndex: 1
  explanation: docker-compose down stops and removes containers, networks, and default networks. Use -v to also remove volumes.
- id: q10
  question: How do you scale a service in Docker Compose?
  options:
    - docker-compose scale service=3
    - docker-compose up --scale service=3
    - docker-compose --replicas 3 service
    - docker-compose expand service=3
  correctIndex: 1
  explanation: The --scale flag scales a service to the specified number of replicas.
```

