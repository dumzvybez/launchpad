---
slug: kubernetes-kubernetes-health-checks-auto-scaling
id: kubernetes-04
track: kubernetes
order: 4
title: Kubernetes Health Checks & Auto-scaling
description: Keep your apps healthy with probes and scale automatically with HPA.
difficulty: advanced
estMinutes: 80
contentVersion: 1.0.0
---

# Kubernetes Health Checks & Auto-scaling

## Kubernetes Health Checks & Auto-scaling

### Why It Matters

In production, pods crash, apps hang, and traffic spikes. Kubernetes liveness/readiness probes automatically restart unhealthy pods and remove them from load balancers. The Horizontal Pod Autoscaler (HPA) scales your app up during traffic spikes and down during quiet periods — saving money and preventing outages.

Liveness probes detect deadlocked apps and restart them. Readiness probes detect apps that are alive but not ready to serve traffic (e.g., still warming up). The HPA watches CPU/memory or custom metrics and adjusts the replica count automatically.

### Prerequisites

- Complete all previous Kubernetes lessons
- Understanding of HTTP endpoints and metrics

### Topics

- Liveness probes: restart dead pods
- Readiness probes: remove unready pods from the Service
- Startup probes: for slow-starting apps
- Horizontal Pod Autoscaler (HPA)
- Metrics Server and custom metrics

```yaml
# deployment with probes and HPA
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: my-app:1.0
        ports:
        - containerPort: 3000
        livenessProbe:           # restart if this fails
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:          # remove from load balancer if this fails
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:               # needed for HPA
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # scale up if CPU > 70%
```
Caption: Probes and HPA

### Key Concepts

- Liveness probe: 'Is the app alive?' If it fails, Kubernetes restarts the pod. Use for detecting deadlocks
- Readiness probe: 'Is the app ready to serve traffic?' If it fails, the pod is removed from the Service's endpoints (but NOT restarted)
- Startup probe: 'Has the app finished starting?' Disables liveness/readiness until it succeeds — for slow-starting apps (Java, Python)
- HPA: watches metrics (CPU, memory, custom) and adjusts replicas. Scales up when CPU > 70%, down when CPU < 70%
- Metrics Server: required for HPA — collects CPU/memory usage from each node

### Common Pitfalls

- Setting liveness probe too aggressive — if the probe fails during startup, Kubernetes kills and restarts the pod in an infinite loop (CrashLoopBackOff). Use startupProbe for slow starters
- Not setting resource requests — HPA can't scale based on CPU if requests aren't set (it needs a baseline to calculate utilization %)
- Setting minReplicas to 1 for production — if that pod crashes, there's a brief outage. Use at least 2

### Interview Questions

- What is the difference between a liveness probe and a readiness probe?
- How does the Horizontal Pod Autoscaler work?
- What is a startup probe and when would you use it?

### Mini Project

Add liveness and readiness probes to your web app deployment (create /health and /ready endpoints in your app). Add an HPA that scales between 2-10 replicas based on CPU. Generate load with kubectl run load-generator --image=busybox --rm -it -- /bin/sh -c 'while true; do wget -q -O- http://web-app-service; done' and watch the HPA scale up.

### Exercises

1. Add a startup probe to a slow-starting app (initialDelaySeconds: 0, periodSeconds: 10, failureThreshold: 30)
2. Install the Metrics Server and verify kubectl top pods shows CPU/memory usage

```quiz
- id: q1
  question: What is the difference between a liveness probe and a readiness probe?
  options:
    - They are the same
    - Liveness restarts the pod if it fails; readiness removes the pod from the Service (no restart)
    - Liveness is for HTTP; readiness is for TCP
    - Liveness is more important
  correctIndex: 1
  explanation: "Liveness probe: 'Is the app alive?' If it fails, Kubernetes RESTARTS the pod. Readiness probe: 'Is the app ready to serve?' If it fails, Kubernetes removes the pod from the Service's endpoints (stops routing traffic to it) but does NOT restart it. The pod can become ready again later."
- id: q2
  question: What does the Horizontal Pod Autoscaler (HPA) do?
  options:
    - Scales nodes automatically
    - Watches metrics (CPU, memory, custom) and adjusts the number of pod replicas automatically
    - Adds more CPU to pods
    - Creates new clusters
  correctIndex: 1
  explanation: The HPA watches metrics and adjusts replica count. If average CPU exceeds 70%, it adds more replicas. If CPU drops below 70%, it removes replicas. This handles traffic spikes automatically and saves money during quiet periods.
- id: q3
  question: What is a startup probe used for?
  options:
    - To check if the pod has started
    - For slow-starting apps — it disables liveness/readiness probes until the app is fully started, preventing premature restarts
    - To start the cluster
    - To initialize volumes
  correctIndex: 1
  explanation: Startup probes are for apps that take a long time to start (Java, Python with heavy imports). Without a startup probe, the liveness probe might fail during startup and restart the pod in an infinite loop (CrashLoopBackOff). The startup probe disables liveness/readiness until it succeeds.
- id: q4
  question: Why must you set resource requests for HPA to work?
  options:
    - It's required by Kubernetes
    - HPA calculates CPU utilization as a percentage of the requested amount — without requests, it can't calculate utilization
    - It makes pods faster
    - It reduces costs
  correctIndex: 1
  explanation: HPA scales based on CPU utilization (%). Utilization = actual usage / requested amount. If requests aren't set, Kubernetes can't calculate the percentage, and HPA won't work. Always set resources.requests.cpu when using HPA.
- id: q5
  question: What happens if a liveness probe fails failureThreshold times?
  options:
    - The pod is deleted
    - Kubernetes restarts the pod (the container is killed and recreated)
    - The pod is removed from the Service
    - An alert is sent
  correctIndex: 1
  explanation: "If the liveness probe fails failureThreshold consecutive times (default 3), Kubernetes restarts the pod — it kills the container and creates a new one. This is self-healing: if your app deadlocks, Kubernetes detects it and restarts automatically."
```

