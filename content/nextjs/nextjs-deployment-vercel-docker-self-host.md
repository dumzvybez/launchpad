---
slug: nextjs-deployment-vercel-docker-self-host
id: nextjs-19
track: nextjs
order: 19
title: Deployment — Vercel, Docker, Self-Host
description: "Deploy your Next.js app to Vercel, build a self-contained Docker image with `output: 'standalone'`, and run it on any container platform."
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dufPA_v48YM
whyItMatters: "Deploy your Next. js app to Vercel, build a self-contained Docker image with `output: 'standalone'`, and run it on any container platform."
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Deployment — Vercel, Docker, Self-Host

## Deployment — Vercel, Docker, Self-Host

### Why It Matters

Deploy your Next. js app to Vercel, build a self-contained Docker image with `output: 'standalone'`, and run it on any container platform.

Deploy your Next.js app to Vercel, build a self-contained Docker image with `output: 'standalone'`, and run it on any container platform.

### Prerequisites

- Stage 18: Performance — Core Web Vitals, Bundle Analysis.
- Stage 15: Database Integration (env vars and migrations).
- Basic Docker and CI/CD familiarity.

### Topics

- Vercel deployment: Git-connected, env vars, preview deploys
- `output: 'standalone'` for minimal Docker images
- Multi-stage Dockerfile for Next.js
- Environment variables at build vs runtime
- Running migrations on deploy (Vercel build hook, post-deploy script)
- Custom server vs `next start` (and when not to use one)
- Self-hosting on Fly.io, Render, AWS, Kubernetes
- Edge vs Node regions and `runtime = 'edge'`

### Key Concepts

- Vercel is the canonical deployment target — Git-connected deploys, preview URLs, and automatic edge caching with zero config
- `output: 'standalone'` produces a minimal `.next/standalone` folder with only the needed node_modules, ideal for Docker
- A multi-stage Dockerfile reduces image size by building in one stage and copying only the output to a slim runtime image
- Environment variables without `NEXT_PUBLIC_` are server-only and can be rotated without rebuilding
- For self-hosting, use `next start` (or a standalone server.js) — a custom server is rarely needed and disables some features

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};
export default nextConfig;
```
Caption: Standalone output config

### Common Pitfalls

- Forgetting `output: 'standalone'` for Docker — without it, the image needs the full `node_modules` and a custom start command; with it, you ship a minimal `server.js`.
- Baking secrets into the Docker image via `ENV` in the Dockerfile — use runtime env vars (`fly secrets`, Kubernetes secrets, Vercel project env) so they can be rotated without rebuilding.
- Running `next dev` in production — it is slow, includes hot-reload code, and disables optimizations; always use `next start` (or the standalone `server.js`).
- Using a custom server (`server.js` with express) — it disables some Next.js features (streaming, middleware edge runtime) and is rarely needed; use Route Handlers instead.
- Forgetting to run database migrations on deploy — set a build hook or post-deploy script to run `prisma migrate deploy` before the new code serves traffic.

### Real-World Applications

- Vercel deploys the nextjs.org site and thousands of customer apps with Git-connected deploys, preview URLs, and automatic edge caching.
- Hulu self-hosts parts of its Next.js app on AWS ECS for compliance, using `output: 'standalone'` images.
- Notion uses a mix of Vercel and self-hosted containers for different surfaces (marketing on Vercel, app on Kubernetes).
- Twitch self-hosts Next.js apps on Kubernetes for low-latency multi-region delivery during live events.

### Interview Questions

- 1. What does `output: 'standalone'` do? — Produces a minimal `.next/standalone` folder containing only the needed node_modules and a `server.js`, ideal for small Docker images.
- 2. Why avoid a custom server (`server.js` with express)? — It disables Next.js streaming, the middleware edge runtime, and some optimizations; Route Handlers cover most needs without a custom server.
- 3. How do you run database migrations on Vercel? — Add a `postbuild` script (`prisma migrate deploy`) or use a deploy hook that runs migrations before traffic shifts.
- 4. Why use runtime env vars instead of baking them into the Docker image? — So you can rotate secrets without rebuilding the image and keep one image across environments (staging/prod).
- 5. What is the difference between Vercel preview and production deploys? — Preview deploys are created per Git branch/PR with unique URLs for review; production deploys happen on the main branch with the production env vars.

### Mini Project

Deploy to Vercel and Docker: Deploy the same Next.js app to Vercel (Git-connected) and to Fly.io via a multi-stage Dockerfile with `output: 'standalone'`. Verify both serve the same content. Suggested approach:
  - Push your project to GitHub
  - Import the repo on Vercel and deploy; add env vars in the project settings
  - Add `output: 'standalone'` to `next.config.mjs`
  - Create the multi-stage Dockerfile and `.dockerignore`
  - Run `fly launch` and `fly deploy`; verify the app at the Fly URL

### Exercises

1. Push your project to GitHub and import it on Vercel; verify the auto-deploy works.
2. Add `output: 'standalone'` and write a multi-stage Dockerfile; build it locally and run.
3. Set up a `postbuild` script that runs `prisma migrate deploy` on Vercel.
4. Deploy to Fly.io with `fly launch` and confirm the app is reachable.
5. Configure a preview deploy on a feature branch and verify the unique URL.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `output: 'standalone'` produce?
9. A) A static HTML site
10. B) A Docker image
11. C) A minimal `.next/standalone` folder with a server.js and only needed node_modules (*)
12. D) A Vercel deployment
13. Explanation: `output: 'standalone'` produces a self-contained `.next/standalone` folder containing only the node_modules needed at runtime and a `server.js`, ideal for minimal Docker images.
14. Q2: Why avoid a custom server (e.g. Express wrapping Next.js)?
15. A) It is slower
16. B) It costs more
17. C) It is deprecated
18. D) It disables streaming, middleware edge runtime, and some optimizations; Route Handlers cover most needs (*)
19. Explanation: A custom server disables Next.js streaming, the middleware edge runtime, and certain optimizations. Route Handlers and Server Actions cover most use cases without one.
20. Q3: How do you run database migrations on Vercel?
21. A) Add a postbuild script (e.g. "prisma migrate deploy") or use a deploy hook (*)
22. B) Manually via SSH
23. C) Migrations are automatic
24. D) Use a custom server
25. Explanation: Vercel runs `npm run build`; adding `postbuild: "prisma migrate deploy"` (or a deploy hook) runs migrations after the build but before traffic shifts.
26. Q4: Why use runtime env vars instead of baking them into the Docker image?
27. A) They are faster
28. B) So you can rotate secrets without rebuilding and use one image across environments (*)
29. C) They are required by Vercel
30. D) Build-time env vars do not exist
31. Explanation: Runtime env vars (`fly secrets`, K8s secrets, Vercel project env) let you rotate credentials without rebuilding the image and ship one image across staging and prod.
32. Q5: Which environment is `next dev` suitable for?
33. A) Production
34. B) Staging
35. C) Local development only (*)
36. D) CI/CD
37. Explanation: `next dev` includes hot-reload code, is slow, and disables production optimizations; always use `next start` (or the standalone server.js) in production.
38. Q6: What is a Vercel preview deploy?
39. A) A staging environment for the main branch
40. B) A local dev server
41. C) A paid feature only
42. D) A unique URL per Git branch/PR for review before merging (*)
43. Explanation: Vercel creates a preview deployment with a unique URL for every Git push (branch or PR), letting teams review changes before merging to production.
44. Q7: Which Dockerfile stage copies only the built output into a slim image?
45. A) runner (*)
46. B) base
47. C) builder
48. D) test
49. Explanation: A multi-stage Dockerfile uses a `builder` stage to compile and a `runner` stage that copies only the built output (and `public/`, `.next/static`) into a slim runtime image.
50. Q8: Which file should you include in `.dockerignore`?
51. A) package.json
52. B) node_modules (*)
53. C) next.config.mjs
54. D) app/page.tsx
55. Explanation: Exclude `node_modules`, `.next`, `.git`, and `.env*` from the Docker context so the build is fast and secrets are not leaked into the image.
56. Q9: What command starts the standalone Next.js server in a Docker image?
57. A) npm run dev
58. B) next start
59. C) node server.js (*)
60. D) npm start
61. Explanation: With `output: 'standalone'`, the runtime image contains a `server.js` that you start with `node server.js`; it does not require the full `next` CLI or `node_modules`.
62. Q10: Why is multi-region deployment useful for self-hosting?
63. A) It is required by Docker
64. B) It is cheaper
65. C) It enables SSR
66. D) Lower latency for global users by serving from regions close to them (*)
67. Explanation: Multi-region deployment (e.g. Fly.io `fly scale count 2 --region sjc,iad`) puts instances close to users worldwide, reducing latency for global audiences.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "What does `output: 'standalone'` produce?"
  options:
    - A static HTML site
    - A Docker image
    - A minimal `.next/standalone` folder with a server.js and only needed node_modules
    - A Vercel deployment
  correctIndex: 2
  explanation: "`output: 'standalone'` produces a self-contained `.next/standalone` folder containing only the node_modules needed at runtime and a `server.js`, ideal for minimal Docker images."
- id: q2
  question: Why avoid a custom server (e.g. Express wrapping Next.js)?
  options:
    - It is slower
    - It costs more
    - It is deprecated
    - It disables streaming, middleware edge runtime, and some optimizations; Route Handlers cover most needs
  correctIndex: 3
  explanation: A custom server disables Next.js streaming, the middleware edge runtime, and certain optimizations. Route Handlers and Server Actions cover most use cases without one.
- id: q3
  question: How do you run database migrations on Vercel?
  options:
    - Add a postbuild script (e.g. "prisma migrate deploy") or use a deploy hook
    - Manually via SSH
    - Migrations are automatic
    - Use a custom server
  correctIndex: 0
  explanation: 'Vercel runs `npm run build`; adding `postbuild: "prisma migrate deploy"` (or a deploy hook) runs migrations after the build but before traffic shifts.'
- id: q4
  question: Why use runtime env vars instead of baking them into the Docker image?
  options:
    - They are faster
    - So you can rotate secrets without rebuilding and use one image across environments
    - They are required by Vercel
    - Build-time env vars do not exist
  correctIndex: 1
  explanation: Runtime env vars (`fly secrets`, K8s secrets, Vercel project env) let you rotate credentials without rebuilding the image and ship one image across staging and prod.
- id: q5
  question: Which environment is `next dev` suitable for?
  options:
    - Production
    - Staging
    - Local development only
    - CI/CD
  correctIndex: 2
  explanation: "`next dev` includes hot-reload code, is slow, and disables production optimizations; always use `next start` (or the standalone server.js) in production."
- id: q6
  question: What is a Vercel preview deploy?
  options:
    - A staging environment for the main branch
    - A local dev server
    - A paid feature only
    - A unique URL per Git branch/PR for review before merging
    - ", letting teams review changes before merging to production."
  correctIndex: 3
  explanation: Vercel creates a preview deployment with a unique URL for every Git push (branch or PR), letting teams review changes before merging to production.
- id: q7
  question: Which Dockerfile stage copies only the built output into a slim image?
  options:
    - runner
    - base
    - builder
    - test
  correctIndex: 0
  explanation: A multi-stage Dockerfile uses a `builder` stage to compile and a `runner` stage that copies only the built output (and `public/`, `.next/static`) into a slim runtime image.
- id: q8
  question: Which file should you include in `.dockerignore`?
  options:
    - package.json
    - node_modules
    - next.config.mjs
    - app/page.tsx
  correctIndex: 1
  explanation: Exclude `node_modules`, `.next`, `.git`, and `.env*` from the Docker context so the build is fast and secrets are not leaked into the image.
- id: q9
  question: What command starts the standalone Next.js server in a Docker image?
  options:
    - npm run dev
    - next start
    - node server.js
    - npm start
  correctIndex: 2
  explanation: "With `output: 'standalone'`, the runtime image contains a `server.js` that you start with `node server.js`; it does not require the full `next` CLI or `node_modules`."
- id: q10
  question: Why is multi-region deployment useful for self-hosting?
  options:
    - It is required by Docker
    - It is cheaper
    - It enables SSR
    - Lower latency for global users by serving from regions close to them
  correctIndex: 3
  explanation: Multi-region deployment (e.g. Fly.io `fly scale count 2 --region sjc,iad`) puts instances close to users worldwide, reducing latency for global audiences.
```

