---
slug: kubernetes-kubernetes-deployments-services
id: kubernetes-02
track: kubernetes
order: 2
title: Kubernetes Deployments & Services
description: Deploy applications with Deployments and expose them with Services.
difficulty: intermediate
estMinutes: 80
contentVersion: 1.0.0
---

# Kubernetes Deployments & Services

## Kubernetes Deployments & Services

### Why It Matters

Pods die. Deployments keep your app running by automatically restarting failed pods, scaling them up/down, and rolling out new versions with zero downtime. Services make pods discoverable — they give a stable IP and DNS name to a set of pods that come and go. These are the two most important Kubernetes resources.

A Deployment manages a set of pods — it ensures N replicas are always running, handles rolling updates, and can roll back. A Service gives pods a stable network identity (IP + DNS name) so other services can find them even as pods are created and destroyed.

### Prerequisites

- Complete 'Getting Started with Kubernetes'
- Understanding of networking basics (IP, DNS, ports)

### Topics

- Deployment YAML: replicas, selectors, pod templates
- kubectl apply -f for declarative management
- Service types: ClusterIP, NodePort, LoadBalancer
- Labels and selectors
- Rolling updates and rollbacks

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3                    # always run 3 pods
  selector:
    matchLabels:
      app: web-app
  template:                      # pod template
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "250m"
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  type: LoadBalancer             # expose externally
  selector:
    app: web-app                 # route to pods with this label
  ports:
  - port: 80                     # external port
    targetPort: 80               # container port
```
Caption: Deployment + Service YAML

### Key Concepts

- Deployment: ensures N replicas of a pod are always running; handles updates and rollbacks
- ReplicaSet: a Deployment creates a ReplicaSet, which creates pods — you rarely manage ReplicaSets directly
- Service: gives pods a stable IP/DNS name; routes traffic to matching pods via labels
- ClusterIP: internal-only (default). NodePort: exposes on a port on every node. LoadBalancer: cloud provider gives you a public IP
- Label selector: Services find pods by matching labels (app: web-app) — pods and services are decoupled

### Common Pitfalls

- Not setting resource limits — a pod can consume all node resources; always set resources.limits
- Using latest tag — deployments can't roll back if every version is :latest; use semantic version tags
- Forgetting the Service — your pods are running but unreachable from outside the cluster without a Service

### Interview Questions

- What is the difference between a Deployment and a Pod?
- Explain the three Service types in Kubernetes
- How do rolling updates work in a Deployment?

### Mini Project

Write a deployment.yaml for a 3-replica web app and a service.yaml to expose it. Apply both with kubectl apply -f. Verify the app is accessible, then update the image to trigger a rolling update.

### Exercises

1. Scale your deployment to 5 replicas with kubectl scale deployment web-app --replicas=5
2. Roll back a failed update with kubectl rollout undo deployment web-app

```quiz
- id: q1
  question: What is the main purpose of a Kubernetes Deployment?
  options:
    - To deploy a single pod
    - To manage a set of pods — ensures N replicas are running, handles rolling updates and rollbacks
    - To expose pods to the internet
    - To store configuration data
  correctIndex: 1
  explanation: A Deployment manages a set of identical pods. It ensures the desired number of replicas are always running, handles rolling updates (zero-downtime deploys), and can roll back to a previous version if something goes wrong.
- id: q2
  question: What does a Kubernetes Service do?
  options:
    - Runs containers
    - Gives pods a stable IP and DNS name — routes traffic to pods even as they're created and destroyed
    - Stores data
    - Monitors pod health
  correctIndex: 1
  explanation: Pods come and go (they're ephemeral — each gets a new IP). A Service provides a stable IP and DNS name that other services can reach. The Service uses label selectors to route traffic to matching pods, even as pods are created and destroyed.
- id: q3
  question: Which Service type exposes your app externally with a cloud load balancer?
  options:
    - ClusterIP
    - NodePort
    - LoadBalancer
    - Ingress
  correctIndex: 2
  explanation: LoadBalancer creates a cloud-provider load balancer (AWS ELB, GCP Load Balancer, etc.) with a public IP. ClusterIP is internal-only (default). NodePort exposes on a high port on every node. Ingress is an HTTP-level router (layer 7).
- id: q4
  question: How does a Service know which pods to route traffic to?
  options:
    - By pod name
    - By label selectors — the Service has a selector that matches pod labels
    - By IP address
    - By namespace
  correctIndex: 1
  explanation: "Services use label selectors to find pods. The Service spec has selector: { app: web-app }, and pods have labels: { app: web-app }. The Service continuously scans for pods with matching labels and routes traffic to them — pods can be added/removed dynamically."
- id: q5
  question: Why should you always set resource limits on containers in Kubernetes?
  options:
    - It's required
    - Without limits, a single pod can consume all node resources (CPU/memory), causing other pods to crash or the node to fail
    - It makes pods faster
    - It reduces costs
  correctIndex: 1
  explanation: Without resource limits, a single container can use all the node's CPU and memory, starving other pods and potentially crashing the node. Always set resources.limits (and resources.requests for scheduling) in your pod spec.
```

