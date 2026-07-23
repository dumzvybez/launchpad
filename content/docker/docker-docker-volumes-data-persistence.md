---
slug: docker-docker-volumes-data-persistence
id: docker-04
track: docker
order: 4
title: Docker Volumes & Data Persistence
description: Persist data across container restarts with Docker volumes and bind mounts.
difficulty: intermediate
estMinutes: 55
contentVersion: 1.0.0
---

# Docker Volumes & Data Persistence

## Docker Volumes & Data Persistence

### Why It Matters

Containers are ephemeral — when a container is removed, all data inside it is lost. For databases, user uploads, logs, or any data that must survive, you need volumes. Understanding persistence is essential for running any stateful application in Docker.

Docker provides two main ways to persist data: named volumes (managed by Docker) and bind mounts (mapped to a host directory). Each has trade-offs for development vs production.

### Prerequisites

- Complete 'Getting Started with Docker'
- Basic understanding of filesystems

### Topics

- Named volumes vs bind mounts
- Creating and managing volumes
- Sharing volumes between containers
- Backup and restore strategies

```bash
# Create a named volume
docker volume create my-data

# Use a volume in a container
docker run -d \
  --name my-db \
  -v my-data:/var/lib/postgresql/data \
  postgres:16

# List volumes
docker volume ls

# Inspect a volume
docker volume inspect my-data

# Remove a volume (only if no container is using it)
docker volume rm my-data

# Bind mount (maps a host directory into the container)
docker run -v /host/path:/container/path my-image
```
Caption: Docker volume commands

### Key Concepts

- Named volume: managed by Docker, stored in a Docker-managed location on the host
- Bind mount: maps a specific host directory into the container — great for development (live code reload)
- Volume driver: plugins that let volumes be stored on remote hosts or cloud storage (e.g., NFS, AWS EBS)

### Common Pitfalls

- Using bind mounts in production — they create a coupling between the host filesystem and the container; use named volumes instead
- Forgetting to back up volumes — use docker run --rm -v my-data:/data -v $(pwd):/backup ubuntu tar cvf /backup/my-data.tar /data to back up
- Running docker volume rm on a volume that's in use — Docker will warn you; always stop containers first

### Interview Questions

- What's the difference between a named volume and a bind mount?
- How would you back up a Docker volume?
- When would you use a bind mount vs a named volume?

### Mini Project

Run a PostgreSQL container with a named volume. Insert some data, stop and remove the container, start a new container with the same volume, and verify the data is still there.

### Exercises

1. Back up a volume to a tar file and restore it to a new volume
2. Share a volume between two containers simultaneously

```quiz
- id: q1
  question: What is the key difference between a named volume and a bind mount?
  options:
    - Named volumes are faster
    - Named volumes are managed by Docker; bind mounts map a specific host directory
    - Bind mounts are more secure
    - There is no difference
  correctIndex: 1
  explanation: Named volumes are created and managed by Docker (stored in Docker's area on the host). Bind mounts map a specific host directory into the container — you specify the exact path on the host.
- id: q2
  question: Why are containers described as 'ephemeral'?
  options:
    - They run very briefly
    - Data inside a container is lost when the container is removed
    - They can't store any data
    - They automatically delete themselves
  correctIndex: 1
  explanation: Ephemeral means 'lasting for a very short time.' When a container is removed, its writable layer (where all runtime data is stored) is deleted. Volumes solve this by storing data outside the container's filesystem.
- id: q3
  question: Which flag mounts a volume into a container?
  options:
    - --mount
    - -v
    - --volume
    - -m
  correctIndex: 1
  explanation: "The -v (or --volume) flag mounts a volume. Syntax: -v volume-name:/container/path or -v /host/path:/container/path for bind mounts."
- id: q4
  question: When would you use a bind mount instead of a named volume?
  options:
    - In production for databases
    - In development for live code reloading
    - Never
    - When you need more security
  correctIndex: 1
  explanation: Bind mounts are great for development — you map your source code directory into the container, and changes on the host are immediately reflected inside the container (live reload). For production, use named volumes.
- id: q5
  question: How do you back up a Docker volume?
  options:
    - docker volume backup
    - Run a temporary container that mounts the volume and creates a tar archive
    - Use docker cp
    - It's not possible
  correctIndex: 1
  explanation: "To back up a volume, run a temporary container that mounts both the volume and a host directory, then creates a tar archive: docker run --rm -v my-data:/data -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /data"
```

