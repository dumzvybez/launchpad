---
slug: kubernetes-getting-started-kubernetes
id: kubernetes-01
track: kubernetes
order: 1
title: Getting Started with Kubernetes
description: Understand container orchestration and why Kubernetes is the industry standard for running containers at scale.
difficulty: beginner
estMinutes: 70
contentVersion: 1.0.0
---

# Getting Started with Kubernetes

## Getting Started with Kubernetes

### Why It Matters

When you have 1 container, you run it with Docker. When you have 100 containers across 10 servers, you need Kubernetes. It automates deployment, scaling, load balancing, self-healing, and rolling updates. Every major tech company (Google, Netflix, Spotify, Uber) runs Kubernetes in production.

Kubernetes (K8s) is a container orchestration platform. It manages a cluster of machines and runs your containers across them, handling failures, scaling, networking, and storage automatically. Think of it as an operating system for your data center.

### Prerequisites

- Docker fundamentals (images, containers, Dockerfile)
- Basic command-line skills
- Understanding of client-server architecture

### Topics

- What problem does Kubernetes solve?
- Kubernetes architecture: control plane and nodes
- Pods, Deployments, and Services
- kubectl — the Kubernetes CLI
- Running your first pod

```bash
# Check kubectl is installed
kubectl version --client

# Run a simple nginx pod
kubectl run nginx --image=nginx

# List pods
kubectl get pods

# Get details about a pod
kubectl describe pod nginx

# Port-forward to access the pod locally
kubectl port-forward pod/nginx 8080:80

# Delete the pod
kubectl delete pod nginx
```
Caption: Basic kubectl commands

### Key Concepts

- Cluster: a set of machines (nodes) that Kubernetes manages
- Control plane: the 'brain' — makes scheduling decisions, maintains state
- Node: a worker machine where containers run
- Pod: the smallest deployable unit — usually 1 container, but can have sidecar containers
- kubectl: the CLI tool you use to interact with the cluster

### Common Pitfalls

- Confusing pods and containers — a pod can contain multiple containers; you deploy pods, not containers
- Running kubectl commands against the wrong cluster — always check kubectl config current-context
- Not cleaning up resources — pods, services, and deployments accumulate; use kubectl delete when done

### Interview Questions

- What problem does Kubernetes solve?
- Explain the difference between a pod and a container
- What are the main components of a Kubernetes cluster?

### Mini Project

Install minikube (local Kubernetes cluster), start it with minikube start, and run an nginx pod. Port-forward to access it in your browser.

### Exercises

1. Run a Redis pod and connect to it via port-forward
2. Use kubectl get pods -o wide to see which node your pod is running on

```quiz
- id: q1
  question: What is Kubernetes?
  options:
    - A container runtime like Docker
    - A container orchestration platform that manages containers across multiple machines
    - A programming language
    - A database
  correctIndex: 1
  explanation: Kubernetes is a container orchestration platform. It doesn't replace Docker — it manages Docker containers (or any container runtime) across a cluster of machines, handling scheduling, scaling, self-healing, and networking.
- id: q2
  question: What is a pod in Kubernetes?
  options:
    - A type of container
    - The smallest deployable unit — usually contains one container, but can have multiple (sidecars)
    - A Kubernetes node
    - A network policy
  correctIndex: 1
  explanation: A pod is the smallest deployable unit in Kubernetes. It usually contains a single container, but can contain multiple tightly-coupled containers (sidecars) that share networking and storage. You deploy pods, not containers.
- id: q3
  question: What is the control plane in Kubernetes?
  options:
    - Where your app runs
    - The 'brain' of the cluster — makes scheduling decisions, maintains cluster state, handles API requests
    - A network controller
    - A monitoring dashboard
  correctIndex: 1
  explanation: The control plane is the cluster's brain. It includes the API server (kubectl talks to this), scheduler (decides which node runs your pod), controller manager (maintains desired state), and etcd (the cluster's database). Worker nodes run your actual app containers.
- id: q4
  question: Which command lists all pods in the current namespace?
  options:
    - kubectl list pods
    - kubectl get pods
    - kubectl pods
    - kubectl show pods
  correctIndex: 1
  explanation: kubectl get pods lists all pods. Use kubectl get pods -o wide for more details (node name, IP). Use kubectl get pods --all-namespaces to see pods across all namespaces.
- id: q5
  question: What does kubectl port-forward do?
  options:
    - Forwards a port from your local machine to a pod — lets you access a pod without exposing it publicly
    - Changes a pod's port
    - Forwards traffic between pods
    - Creates a load balancer
  correctIndex: 1
  explanation: kubectl port-forward pod/nginx 8080:80 forwards your local port 8080 to the pod's port 80. This lets you access a pod for debugging without exposing it via a Service. The connection is temporary and only works while the command is running.
```

