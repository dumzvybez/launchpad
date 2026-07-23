---
slug: kubernetes-kubernetes-production-best-practices
id: kubernetes-05
track: kubernetes
order: 5
title: Kubernetes Production Best Practices
description: Security, namespaces, RBAC, Helm, and CI/CD patterns for production Kubernetes.
difficulty: advanced
estMinutes: 90
contentVersion: 1.0.0
---

# Kubernetes Production Best Practices

## Kubernetes Production Best Practices

### Why It Matters

Running a pod is easy. Running a production cluster with 100 microservices, strict security, automated deploys, and zero downtime is hard. This lesson covers the patterns that every DevOps engineer needs: namespaces, RBAC, Helm, CI/CD, and security hardening.

Production Kubernetes involves: (1) Namespaces for isolation, (2) RBAC for access control, (3) Helm for package management, (4) CI/CD with GitOps (ArgoCD, Flux), (5) Network policies, (6) Pod Security Standards, and (7) Observability (Prometheus + Grafana).

### Prerequisites

- Complete all previous Kubernetes lessons
- Basic CI/CD concepts

### Topics

- Namespaces for multi-tenancy and environment isolation
- RBAC: Roles, RoleBindings, ClusterRoles
- Helm: package manager for Kubernetes
- GitOps with ArgoCD or Flux
- Network Policies for pod-to-pod security
- Pod Security Standards (PSS)
- Observability: Prometheus, Grafana, Loki

```yaml
# 1. Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
# 2. RBAC: ServiceAccount + Role + RoleBinding
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  namespace: production
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-sa-pod-reader
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-reader
subjects:
- kind: ServiceAccount
  name: app-sa
  namespace: production
---
# 3. Network Policy: restrict incoming traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-app-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend   # only frontend pods can reach web-app
    ports:
    - protocol: TCP
      port: 80
```
Caption: Namespace, RBAC, and NetworkPolicy

### Key Concepts

- Namespace: a virtual cluster within a cluster — use for environment isolation (dev/staging/prod) or multi-tenancy
- RBAC: Role-Based Access Control — Roles grant permissions, RoleBindings assign Roles to users/ServiceAccounts
- Helm: a package manager for Kubernetes — define charts (templated YAML) for reusable, versioned deployments
- GitOps: store all Kubernetes manifests in Git; ArgoCD/Flux automatically syncs Git → cluster. Git is the source of truth
- Network Policy: a firewall for pods — restrict which pods can talk to which other pods

### Common Pitfalls

- Running everything in the 'default' namespace — use namespaces for isolation (e.g., dev, staging, production)
- Giving ServiceAccounts cluster-admin — use least privilege; create a Role with only the permissions needed
- Not using Network Policies — by default, any pod can reach any other pod. Use Network Policies for defense in depth
- Manual kubectl apply in production — use GitOps (ArgoCD/Flux) so every change goes through Git (reviewable, auditable, reversible)

### Interview Questions

- What is a Kubernetes Namespace and why use them?
- Explain RBAC in Kubernetes
- What is GitOps and why is it preferred over manual kubectl apply?

### Mini Project

Create a 'production' namespace, deploy your web app into it with a ServiceAccount, create a Role that only allows reading pods, and bind it to the ServiceAccount. Add a NetworkPolicy that only allows traffic from a 'frontend' pod.

### Exercises

1. Install Helm and deploy an app using a public Helm chart (e.g., bitnami/nginx)
2. Set up a simple GitOps pipeline: push YAML to Git, install ArgoCD, and let it sync automatically

```quiz
- id: q1
  question: What is a Kubernetes Namespace used for?
  options:
    - Naming pods
    - Virtual cluster isolation — use for environments (dev/staging/prod) or multi-tenancy
    - DNS configuration
    - Storage management
  correctIndex: 1
  explanation: Namespaces provide isolation within a cluster. Use them to separate environments (dev, staging, production) or different teams. Resources in one namespace are isolated from another (by default). You can apply RBAC, NetworkPolicies, and ResourceQuotas per namespace.
- id: q2
  question: What does RBAC stand for and what does it do?
  options:
    - Random-Based Access Control
    - Role-Based Access Control — grants permissions via Roles, assigned to users/ServiceAccounts via RoleBindings
    - Resource-Based Access Control
    - Remote-Based Access Control
  correctIndex: 1
  explanation: RBAC (Role-Based Access Control) defines Roles (sets of permissions) and RoleBindings (assigns Roles to users or ServiceAccounts). Follow the principle of least privilege — give each ServiceAccount only the permissions it needs.
- id: q3
  question: What is Helm?
  options:
    - A monitoring tool
    - A package manager for Kubernetes — uses 'charts' (templated YAML) for reusable, versioned deployments
    - A container runtime
    - A load balancer
  correctIndex: 1
  explanation: "Helm is the package manager for Kubernetes. A Helm 'chart' is a set of templated YAML files. Instead of writing raw YAML for every deployment, you install a chart: helm install my-app bitnami/nginx. Charts are versioned, parameterizable, and reusable."
- id: q4
  question: What is GitOps?
  options:
    - Using Git for source code
    - Storing all Kubernetes manifests in Git; an operator (ArgoCD/Flux) automatically syncs Git → cluster. Git is the source of truth
    - A Git hosting service
    - A Git extension for Kubernetes
  correctIndex: 1
  explanation: "GitOps: all Kubernetes manifests live in Git. ArgoCD or Flux watches the Git repo and automatically applies changes to the cluster. Git is the single source of truth — every change goes through a PR (reviewable, auditable, reversible). No manual kubectl apply."
- id: q5
  question: By default, can any pod communicate with any other pod in Kubernetes?
  options:
    - No — pods are isolated by default
    - Yes — by default, all pods can reach all other pods. Use NetworkPolicies to restrict traffic
    - Only in the same namespace
    - Only with a Service
  correctIndex: 1
  explanation: "By default, Kubernetes networking is flat — any pod can reach any other pod by IP. This is a security risk. NetworkPolicies act as a firewall: you specify which pods can communicate with which other pods. Always use them in production for defense in depth."
```

