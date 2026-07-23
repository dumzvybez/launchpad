---
slug: docker-docker-compose-u2014-multi-container-apps
id: docker-03
track: docker
order: 3
title: Docker Compose — Multi-Container Apps
description: Define and run multi-container applications with Docker Compose.
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Docker Compose — Multi-Container Apps

## Docker Compose — Multi-Container Apps

### Why It Matters

Real applications rarely run in a single container — they need a database, a cache, maybe a queue. Docker Compose lets you define all of these in one file and start them with a single command. It's the standard way to run development environments.

Docker Compose is a tool for defining and running multi-container Docker applications. You write a docker-compose.yml file that describes your services, networks, and volumes, then run docker compose up to start everything.

### Prerequisites

- Complete 'Getting Started with Docker' and 'Dockerfile Basics'
- Basic understanding of YAML

### Topics

- docker-compose.yml syntax
- Defining services, networks, and volumes
- Environment variables and secrets
- docker compose up / down / logs
- Development vs production overrides

```yaml
# docker-compose.yml for a web app + database
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```
Caption: A typical docker-compose.yml

### Key Concepts

- Service: a container defined in the compose file (e.g., web, db)
- depends_on: controls startup order (db starts before web)
- Volumes: persistent storage that survives container removal
- Networks: services on the same network can reach each other by service name (e.g., db:5432)

### Common Pitfalls

- depends_on doesn't wait for the database to be 'ready' — use a healthcheck or wait-for-it script
- Not using named volumes — data is lost when you run docker compose down -v
- Hardcoding secrets in the compose file — use .env files and docker secrets

### Interview Questions

- How does Docker Compose differ from plain Docker?
- What does depends_on do, and what does it NOT do?
- How do services in a compose file communicate with each other?

### Mini Project

Create a docker-compose.yml for a web app + PostgreSQL database. Start it with docker compose up, verify the web app can connect to the database, then stop it with docker compose down.

### Exercises

1. Add a Redis cache service to your compose file
2. Use a docker-compose.override.yml file for development-specific settings

```quiz
- id: q1
  question: What is Docker Compose used for?
  options:
    - Building single images
    - Running multi-container applications
    - Orchestrating containers across multiple servers
    - Monitoring container health
  correctIndex: 1
  explanation: Docker Compose defines and runs multi-container applications — e.g., a web server + database + cache — all from a single YAML file.
- id: q2
  question: How do services in a compose file communicate with each other?
  options:
    - By IP address
    - By service name (e.g., db:5432)
    - By container ID
    - By port number only
  correctIndex: 1
  explanation: Services on the same Docker network can reach each other by service name. For example, the web service can connect to the database at db:5432 — Docker's built-in DNS resolves the service name.
- id: q3
  question: What does depends_on do?
  options:
    - Waits for a service to be healthy
    - Controls startup order only
    - Creates a network link
    - Shares environment variables
  correctIndex: 1
  explanation: depends_on controls startup ORDER — the database container starts before the web container. But it does NOT wait for the database to be 'ready to accept connections.' Use a healthcheck or a wait-for-it script for that.
- id: q4
  question: Which command starts all services defined in docker-compose.yml?
  options:
    - docker start all
    - docker compose up
    - docker run compose
    - docker compose start-all
  correctIndex: 1
  explanation: docker compose up builds, (re)creates, starts, and attaches to all services. Use -d for detached mode (running in background).
- id: q5
  question: What is a Docker volume used for in a compose file?
  options:
    - To share code between containers
    - For persistent data that survives container removal
    - To configure environment variables
    - To set up networking
  correctIndex: 1
  explanation: Volumes provide persistent storage. Without a volume, data inside the database container is lost when the container is removed. Named volumes (e.g., db-data:) persist across docker compose down/up cycles.
```

