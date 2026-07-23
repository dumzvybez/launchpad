---
slug: kubernetes-kubernetes-configmaps-secrets-volumes
id: kubernetes-03
track: kubernetes
order: 3
title: Kubernetes ConfigMaps, Secrets & Volumes
description: Manage configuration, secrets, and persistent storage in Kubernetes.
difficulty: intermediate
estMinutes: 75
contentVersion: 1.0.0
---

# Kubernetes ConfigMaps, Secrets & Volumes

## Kubernetes ConfigMaps, Secrets & Volumes

### Why It Matters

Your app needs configuration (database URLs, feature flags), secrets (API keys, passwords), and persistent storage (database files, uploads). Kubernetes provides ConfigMaps for config, Secrets for sensitive data, and PersistentVolumes for storage. Understanding these is essential for running any real application.

ConfigMaps and Secrets decouple configuration from your container image — the same image works in dev, staging, and prod with different configs. Volumes provide persistent storage that survives pod restarts.

### Prerequisites

- Complete 'Getting Started with Kubernetes' and 'Deployments & Services'

### Topics

- ConfigMaps for non-sensitive configuration
- Secrets for passwords, API keys, certificates
- Mounting ConfigMaps/Secrets as files or environment variables
- PersistentVolumes and PersistentVolumeClaims
- StorageClasses for dynamic provisioning

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: "postgres://db:5432/myapp"
  LOG_LEVEL: "info"
  FEATURES: "dark-mode,beta"
---
# secret.yaml (base64-encoded values)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: c2VjcmV0LWFwaS1rZXk=   # echo -n 'secret-api-key' | base64
  DB_PASSWORD: cGFzc3dvcmQxMjM=  # echo -n 'password123' | base64
---
# pod that uses them
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: my-app:1.0
    envFrom:
    - configMapRef:
        name: app-config        # all ConfigMap keys as env vars
    - secretRef:
        name: app-secrets        # all Secret keys as env vars
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config     # ConfigMap mounted as files
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```
Caption: ConfigMap, Secret, and Pod that uses them

### Key Concepts

- ConfigMap: stores non-sensitive config as key-value pairs — injected as env vars or mounted as files
- Secret: stores sensitive data (base64-encoded, not encrypted by default — enable encryption at rest in production)
- PersistentVolume (PV): cluster-level storage resource (e.g., a disk)
- PersistentVolumeClaim (PVC): a pod's request for storage — binds to a PV
- StorageClass: enables dynamic provisioning — Kubernetes creates the PV automatically when a PVC is created

### Common Pitfalls

- Storing secrets in ConfigMaps — ConfigMaps are plain text; use Secrets for anything sensitive
- Forgetting that Secrets are base64-encoded, not encrypted — enable encryption-at-rest in your cluster for real security
- Not using PVCs for databases — data is lost when the pod restarts; always use persistent volumes for stateful apps

### Interview Questions

- What is the difference between a ConfigMap and a Secret?
- How do you make storage persist across pod restarts?
- What is a PersistentVolumeClaim?

### Mini Project

Create a ConfigMap with app settings, a Secret with a fake API key, and a Pod that uses both as environment variables. Verify the values are available inside the container with kubectl exec -it pod/app -- env.

### Exercises

1. Create a PersistentVolumeClaim and mount it to a pod. Write data to it, delete the pod, recreate it, and verify the data persists
2. Mount a ConfigMap as a file (not env var) and read it from inside the container

```quiz
- id: q1
  question: What is the difference between a ConfigMap and a Secret?
  options:
    - They are the same
    - ConfigMaps store non-sensitive config; Secrets store sensitive data (base64-encoded)
    - Secrets are encrypted; ConfigMaps are not
    - ConfigMaps are larger
  correctIndex: 1
  explanation: "ConfigMaps store plain-text configuration (URLs, feature flags, log levels). Secrets store sensitive data (passwords, API keys, certificates) base64-encoded. Note: base64 is NOT encryption — enable encryption-at-rest in production."
- id: q2
  question: How do you make data persist across pod restarts?
  options:
    - You can't — pods are ephemeral
    - Use a PersistentVolumeClaim (PVC) — it requests storage that survives pod deletion
    - Store data in a ConfigMap
    - Use a larger pod
  correctIndex: 1
  explanation: Pods are ephemeral — their filesystem is lost when they restart. A PersistentVolumeClaim (PVC) requests storage from the cluster. The data lives on the PersistentVolume (PV), not the pod, so it survives pod restarts, deletions, and rescheduling to another node.
- id: q3
  question: What is a PersistentVolumeClaim (PVC)?
  options:
    - A type of pod
    - A request for storage by a pod — specifies size and access mode; binds to a PersistentVolume
    - A backup of a volume
    - A cloud storage bill
  correctIndex: 1
  explanation: A PVC is a pod's request for storage. It says 'I need 5GB of read-write storage.' Kubernetes finds or creates a matching PersistentVolume (PV) and binds it. The pod mounts the PVC; the data persists on the PV.
- id: q4
  question: How can you inject ConfigMap values into a pod?
  options:
    - Only as environment variables
    - As environment variables (envFrom) OR mounted as files (volumes)
    - Only as files
    - Only via command-line arguments
  correctIndex: 1
  explanation: "ConfigMaps can be injected as environment variables (envFrom: configMapRef) or mounted as files (volumes: configMap). Secrets work the same way. Files are useful for config that the app reads from disk; env vars are useful for simple key-value config."
- id: q5
  question: Are Kubernetes Secrets encrypted by default?
  options:
    - Yes, always
    - No — they are base64-encoded (which is NOT encryption). You must enable encryption-at-rest in the cluster for real security
    - Only in production
    - Only for certain secret types
  correctIndex: 1
  explanation: By default, Secrets are base64-encoded — which is just encoding, not encryption. Anyone with kubectl access can decode them. For production, enable encryption-at-rest (encrypts Secrets in etcd) and use a cloud KMS or HashiCorp Vault for the encryption key.
```

