---
slug: ruby-deployment-asset-pipeline-capstone-prep
id: ruby-20
track: ruby
order: 20
title: Deployment, Asset Pipeline, and Capstone Prep
description: Configure Puma, manage secrets via ENV and credentials, precompile assets, and dockerize a Rails app for production.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=13200s
whyItMatters: Configure Puma, manage secrets via ENV and credentials, precompile assets, and dockerize a Rails app for production.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Deployment, Asset Pipeline, and Capstone Prep

## Deployment, Asset Pipeline, and Capstone Prep

### Why It Matters

Configure Puma, manage secrets via ENV and credentials, precompile assets, and dockerize a Rails app for production.

Configure Puma, manage secrets via ENV and credentials, precompile assets, and dockerize a Rails app for production.

### Prerequisites

- Stage 19: Rails Basics
- Stage 15: Testing (for CI).

### Topics

- Puma: workers, threads, preload_app, on_worker_boot
- Environment variables and .env (12-factor)
- Rails encrypted credentials (master.key + credentials.yml.enc)
- Asset pipeline: Sprockets, importmap, esbuild, fingerprinting
- Precompiling assets for production
- Dockerfile (multi-stage) and docker-compose
- CI with GitHub Actions (rspec, rubocop, brakeman)
- Deploy targets: Render, Heroku, Fly.io, Kamal

### Key Concepts

- Puma runs multiple workers (processes), each with multiple threads — tune for your DB pool size.
- Never commit secrets; use ENV vars (12-factor) or Rails encrypted credentials with a master.key kept out of git.
- Asset fingerprinting adds a content hash to filenames so browsers cache aggressively and bust on deploy.
- Precompile assets in production: `RAILS_ENV=production rails assets:precompile`.
- Multi-stage Docker builds keep the final image small — build in `ruby:3.3-slim` builder, copy gems to a slim runtime.
- CI should run rubocop, brakeman (security), and rspec on every push; gate merges on green builds.

```ruby
# config/puma.rb — production-grade config
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS') { max_threads_count }.to_i
threads min_threads_count, max_threads_count

port ENV.fetch('PORT', 3000)
environment ENV.fetch('RAILS_ENV', 'development')

# Workers (processes) — each runs its own threads
workers ENV.fetch('WEB_CONCURRENCY', 2).to_i

# Preload app for faster fork + lower memory (use with on_worker_boot)
preload_app!

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart
```
Caption: Puma configuration

### Common Pitfalls

- Committing master.key or .env — Never commit secrets; add master.key and .env to .gitignore — use ENV vars or Rails encrypted credentials.
- Forgetting to precompile assets in production — Run `RAILS_ENV=production rails assets:precompile` (or let the deploy platform do it) — otherwise CSS/JS 404.
- DB pool size < Puma threads — Set DB pool size >= RAILS_MAX_THREADS in database.yml — otherwise threads starve for connections.
- Using development RAILS_ENV in production — Set RAILS_ENV=production in the deploy environment — dev mode reloads classes, leaks memory, and skips precompile.
- Shipping a bloated Docker image — Use multi-stage builds; copy only the bundled gems and app code, not build tools or source caches.

### Real-World Applications

- GitHub deploys its Rails monolith many times per day via custom Kubernetes + Puma workers, with assets precompiled in CI.
- Shopify uses Kamal (formerly MRSK) to deploy Rails containers to bare-metal servers, replacing complex Kubernetes.
- Stripe uses multi-stage Docker builds and ships a slim runtime image with precompiled assets per service.
- Basecamp runs Rails on single-host Kamal deployments, demonstrating that not every app needs Kubernetes.

### Interview Questions

- 1. What does `preload_app!` do in Puma? — Loads the app once before forking workers — saves memory via copy-on-write but requires re-establishing DB connections in on_worker_boot.
- 2. What's the difference between .env and Rails credentials? — .env is for local dev (dotenv gem); credentials.yml.enc + master.key is Rails' encrypted secrets store for production.
- 3. What does asset fingerprinting do? — Adds a content hash to filenames (application-a1b2c3.css) so browsers cache aggressively and bust on deploy.
- 4. Why use a multi-stage Docker build? — Build gems in a builder image, copy only the result to a slim runtime — smaller image, fewer attack surfaces.
- 5. What CI checks should run on every Rails PR? — rubocop (style), brakeman (security), rspec (tests), and bundle audit (vulnerable gems) — gate merges on green.

### Mini Project

Build a Capstone-Ready Rails App: A small blog or todo API with Puma
config, encrypted credentials, Dockerfile, GitHub Actions CI, and deploy
to Render or Fly.io. Suggested approach:
Suggested approach:
  - rails new capstone --database=postgresql
  - Configure Puma with workers + threads from ENV
  - Add encrypted credentials for SECRET_KEY_BASE
  - Write Dockerfile (multi-stage) + docker-compose
  - Add GitHub Actions workflow running rubocop + rspec

### Exercises

1. Configure Puma with workers and threads; verify in `rails s`.
2. Add a credential via `rails credentials:edit` and read it in a controller.
3. Precompile assets with `RAILS_ENV=production rails assets:precompile`.
4. Write a multi-stage Dockerfile and build it locally.
5. Set up a GitHub Actions workflow that runs rspec on every push.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `preload_app!` do in Puma?
9. A) Skips loading the app
10. B) Disables workers
11. C) Compiles assets
12. D) Loads the app before forking workers (saves memory via COW) (*)
13. Explanation: preload_app! loads the app once in the master, then fork()s workers that share memory via copy-on-write — requires on_worker_boot to reconnect DB.
14. Q2: What's the difference between .env and Rails credentials?
15. A) .env is for local dev; credentials.yml.enc is for production secrets (*)
16. B) They're identical
17. C) .env is for production
18. D) Credentials are deprecated
19. Explanation: .env (dotenv gem) is for local dev; credentials.yml.enc is encrypted with master.key and committed safely to git.
20. Q3: What does asset fingerprinting do?
21. A) Minifies JavaScript
22. B) Adds a content hash to filenames for cache busting (*)
23. C) Compresses images
24. D) Encrypts assets
25. Explanation: Fingerprinting (e.g., application-a1b2c3.css) means the URL changes when content does, so browsers bust cache on deploy.
26. Q4: Why use a multi-stage Docker build?
27. A) Faster builds always
28. B) Required by Rails
29. C) Smaller final image (build tools left behind) (*)
30. D) For type checking
31. Explanation: Build gems in a builder stage, copy only the bundled result to a slim runtime — smaller, more secure image.
32. Q5: What CI checks should run on every Rails PR?
33. A) Only rspec
34. B) Only rubocop
35. C) None — tests are optional
36. D) rubocop + brakeman + rspec + bundle audit (*)
37. Explanation: Lint (rubocop), security (brakeman), tests (rspec), and dependency audit (bundle audit) — gate merges on green.
38. Q6: What should DB pool size be relative to Puma threads?
39. A) At least equal to RAILS_MAX_THREADS (*)
40. B) Always 1
41. C) Half the thread count
42. D) Unlimited
43. Explanation: Each thread may need a DB connection; pool size < threads causes connection starvation and timeouts.
44. Q7: What's Kamal used for?
45. A) A test framework
46. B) Deploying Rails containers to servers (replacing complex K8s) (*)
47. C) An asset compiler
48. D) A database tool
49. Explanation: Kamal (formerly MRSK) by 37 Signals deploys Docker containers to bare-metal or VM hosts with zero-downtime swaps.
50. Q8: What env var sets the production environment?
51. A) RAILS_MODE=prod
52. B) APP_ENV=production
53. C) RAILS_ENV=production (*)
54. D) ENV=production
55. Explanation: Set RAILS_ENV=production — enables class caching, precompiled assets, and proper logging.
56. Q9: What does `rails secret` do?
57. A) Encrypts credentials
58. B) Creates an admin user
59. C) Hashes a password
60. D) Generates a random SECRET_KEY_BASE (*)
61. Explanation: `rails secret` outputs a 128-char hex string suitable for SECRET_KEY_BASE in production.
62. Q10: What's the 12-factor principle for config?
63. A) Store config in ENV vars, not in code (*)
64. B) Hard-code config in source
65. C) Use a YAML config file committed to git
66. D) Store secrets in plain text
67. Explanation: 12-factor apps separate config from code — ENV vars let you change behavior without re-deploying code.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What does `preload_app!` do in Puma?
  options:
    - Skips loading the app
    - Disables workers
    - Compiles assets
    - Loads the app before forking workers (saves memory via COW)
  correctIndex: 3
  explanation: preload_app! loads the app once in the master, then fork()s workers that share memory via copy-on-write — requires on_worker_boot to reconnect DB.
- id: q2
  question: What's the difference between .env and Rails credentials?
  options:
    - .env is for local dev; credentials.yml.enc is for production secrets
    - They're identical
    - .env is for production
    - Credentials are deprecated
  correctIndex: 0
  explanation: .env (dotenv gem) is for local dev; credentials.yml.enc is encrypted with master.key and committed safely to git.
- id: q3
  question: What does asset fingerprinting do?
  options:
    - Minifies JavaScript
    - Adds a content hash to filenames for cache busting
    - Compresses images
    - Encrypts assets
  correctIndex: 1
  explanation: Fingerprinting (e.g., application-a1b2c3.css) means the URL changes when content does, so browsers bust cache on deploy.
- id: q4
  question: Why use a multi-stage Docker build?
  options:
    - Faster builds always
    - Required by Rails
    - Smaller final image (build tools left behind)
    - For type checking
  correctIndex: 2
  explanation: Build gems in a builder stage, copy only the bundled result to a slim runtime — smaller, more secure image.
- id: q5
  question: What CI checks should run on every Rails PR?
  options:
    - Only rspec
    - Only rubocop
    - None — tests are optional
    - rubocop + brakeman + rspec + bundle audit
  correctIndex: 3
  explanation: Lint (rubocop), security (brakeman), tests (rspec), and dependency audit (bundle audit) — gate merges on green.
- id: q6
  question: What should DB pool size be relative to Puma threads?
  options:
    - At least equal to RAILS_MAX_THREADS
    - Always 1
    - Half the thread count
    - Unlimited
  correctIndex: 0
  explanation: Each thread may need a DB connection; pool size < threads causes connection starvation and timeouts.
- id: q7
  question: What's Kamal used for?
  options:
    - A test framework
    - Deploying Rails containers to servers (replacing complex K8s)
    - An asset compiler
    - A database tool
    - by 37 Signals deploys Docker containers to bare-metal or VM hosts with zero-downtime swaps.
  correctIndex: 1
  explanation: Kamal (formerly MRSK) by 37 Signals deploys Docker containers to bare-metal or VM hosts with zero-downtime swaps.
- id: q8
  question: What env var sets the production environment?
  options:
    - RAILS_MODE=prod
    - APP_ENV=production
    - RAILS_ENV=production
    - ENV=production
  correctIndex: 2
  explanation: Set RAILS_ENV=production — enables class caching, precompiled assets, and proper logging.
- id: q9
  question: What does `rails secret` do?
  options:
    - Encrypts credentials
    - Creates an admin user
    - Hashes a password
    - Generates a random SECRET_KEY_BASE
  correctIndex: 3
  explanation: "`rails secret` outputs a 128-char hex string suitable for SECRET_KEY_BASE in production."
- id: q10
  question: What's the 12-factor principle for config?
  options:
    - Store config in ENV vars, not in code
    - Hard-code config in source
    - Use a YAML config file committed to git
    - Store secrets in plain text
  correctIndex: 0
  explanation: 12-factor apps separate config from code — ENV vars let you change behavior without re-deploying code.
```

