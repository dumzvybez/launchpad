---
slug: docker-docker-networking-deep-dive
id: docker-17
track: docker
order: 17
title: Docker Networking Deep Dive
description: "Master Docker networking: bridge, host, overlay, and custom networks for multi-container communication."
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Docker Networking Deep Dive

## Docker Networking Deep Dive

### Why It Matters

Networking is how containers communicate with each other and the outside world. Understanding Docker networking is essential for multi-container applications.

### Prerequisites

- Complete Docker lesson 16 first.

### Topics

- Network drivers (bridge, host, overlay, macvlan)
- Creating custom networks
- Container DNS and service discovery
- Port mapping and exposure

### Key Concepts

- Bridge is the default network driver
- Custom networks provide automatic DNS resolution
- Overlay networks span multiple Docker hosts

```bash
# Create a custom network
docker network create mynet

# Run containers on the same network
docker run --network mynet --name api myimage
docker run --network mynet --name db myimage

# Containers can reach each other by name
# Inside 'api' container: ping db

# List networks
docker network ls

# Inspect a network
docker network inspect mynet

# Connect a running container to a network
docker network connect mynet existing_container
```
Caption: Docker networking commands

Docker's networking subsystem is pluggable, using drivers. The default bridge network doesn't provide DNS resolution between containers. Custom bridge networks do — containers on the same custom network can reach each other by name.

### Common Pitfalls

- Containers on different networks cannot communicate by default
- Published ports (-p) expose ports to the host, not to other containers
- Using host networking removes network isolation

### Real-World Applications

- Microservices communication
- Service mesh setups
- Isolating environments (dev/test/prod)

### Interview Questions

- How does DNS resolution work in custom Docker networks?
- What is the difference between bridge and overlay networks?
- When would you use host networking?

### Mini Project

Create a custom network, run two containers on it, and verify they can communicate using container names as hostnames.

### Exercises

1. Create a custom bridge network
2. Run two containers and ping by name
3. Inspect network details

```quiz
- id: q1
  question: What is the default Docker network driver?
  options:
    - host
    - overlay
    - bridge
    - macvlan
  correctIndex: 2
  explanation: The bridge network driver is the default for containers unless specified otherwise.
- id: q2
  question: How do containers on a custom network discover each other?
  options:
    - By IP address only
    - Through automatic DNS resolution by container name
    - Through manual /etc/hosts entries
    - They cannot discover each other
  correctIndex: 1
  explanation: Custom bridge networks provide automatic DNS resolution — containers can reach each other by name.
- id: q3
  question: What command creates a custom Docker network?
  options:
    - docker create network mynet
    - docker network create mynet
    - docker net new mynet
    - docker network add mynet
  correctIndex: 1
  explanation: The command 'docker network create <name>' creates a custom network.
- id: q4
  question: What does the -p flag do in 'docker run -p 8080:80'?
  options:
    - Maps container port 8080 to host port 80
    - Maps host port 8080 to container port 80
    - Creates a network
    - Assigns a static IP
  correctIndex: 1
  explanation: "The -p flag maps a host port to a container port: -p <host_port>:<container_port>."
- id: q5
  question: Can containers on different networks communicate by default?
  options:
    - Yes, always
    - No, they are isolated
    - Only if on the same host
    - Only with overlay networks
  correctIndex: 1
  explanation: Containers on different networks are isolated and cannot communicate unless connected to the same network.
- id: q6
  question: What is an overlay network?
  options:
    - A network that spans multiple Docker hosts
    - A network on top of the host network
    - A read-only network
    - A network for containers only
  correctIndex: 0
  explanation: Overlay networks create a distributed network across multiple Docker hosts, enabling swarm communication.
- id: q7
  question: How do you connect a running container to a network?
  options:
    - docker run --network mynet container
    - docker network connect mynet container
    - docker attach network mynet container
    - docker link mynet container
  correctIndex: 1
  explanation: The 'docker network connect <network> <container>' command connects a running container to a network.
- id: q8
  question: What is host networking?
  options:
    - A network that uses the host's network stack directly
    - A network for the Docker daemon
    - A network between Docker hosts
    - A bridge to the host
  correctIndex: 0
  explanation: Host networking (--network host) makes the container use the host's network stack directly, removing isolation.
- id: q9
  question: Why would you avoid host networking in production?
  options:
    - It's slower
    - It removes network isolation and can cause port conflicts
    - It requires root access
    - It doesn't support TCP
  correctIndex: 1
  explanation: Host networking removes container network isolation and can cause port conflicts with the host.
- id: q10
  question: What does 'docker network inspect' show?
  options:
    - Network configuration and connected containers
    - Network traffic statistics
    - Network security rules
    - Network hardware details
  correctIndex: 0
  explanation: docker network inspect shows the network's configuration, IP range, and which containers are connected.
```

