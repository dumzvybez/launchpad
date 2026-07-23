---
slug: svelte-deployment-vercel-netlify-node-adapter
id: svelte-19
track: svelte
order: 19
title: Deployment — Vercel, Netlify, Node Adapter
description: Deploy SvelteKit apps to Vercel, Netlify, and Node using the right adapter, configure environment variables, and verify post-deploy with smoke tests.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=300s
whyItMatters: Deploy SvelteKit apps to Vercel, Netlify, and Node using the right adapter, configure environment variables, and verify post-deploy with smoke tests.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Deployment — Vercel, Netlify, Node Adapter

## Deployment — Vercel, Netlify, Node Adapter

### Why It Matters

Deploy SvelteKit apps to Vercel, Netlify, and Node using the right adapter, configure environment variables, and verify post-deploy with smoke tests.

Deploy SvelteKit apps to Vercel, Netlify, and Node using the right adapter, configure environment variables, and verify post-deploy with smoke tests.

### Prerequisites

- Stage 13: SvelteKit — Routing
- Stage 16: SvelteKit — Hooks, Sessions, and Auth
- A GitHub repo and account on Vercel/Netlify.

### Topics

- Adapters: @sveltejs/adapter-vercel, adapter-netlify, adapter-node, adapter-static
- Configuring the adapter in svelte.config.js
- Environment variables: $env/static/private, $env/dynamic/private, $env/static/public
- Building for production: npm run build
- Previewing locally: npm run preview
- Deploying via Git integration
- Smoke tests and post-deploy verification

### Key Concepts

- adapter-vercel deploys to Vercel as serverless functions per route
- adapter-netlify deploys to Netlify functions
- adapter-node produces a self-contained Node server (use `node build/index.js`)
- adapter-static produces a fully static site (requires prerender=true on all routes)
- $env/static/private is replaced at build; $env/dynamic/private reads at runtime (good for serverless)

```js
// svelte.config.js
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: "nodejs20.x",
      regions: ["iad1"],
      split: true
    })
  }
};
```
Caption: Adapter configuration (Vercel)

### Common Pitfalls

- Forgetting ORIGIN env var on Node adapter — SvelteKit blocks requests with unknown origins; set ORIGIN=https://yourdomain.com.
- Using $env/static/private in a serverless context — values get baked into the bundle; for rotating secrets use $env/dynamic/private.
- Deploying with the wrong adapter — pick the right one per platform; mismatched adapters produce broken builds.
- Missing env vars in production — set them in the Vercel/Netlify dashboard; $env/static/private at build needs them present at build time.
- Using adapter-static without prerendering all routes — adapter-static requires every route to be prerendered; otherwise the build fails.

### Real-World Applications

- The New York Times deploys SvelteKit sites to Vercel for preview deploys per PR.
- Apple Music's web player is deployed to its own CDN with adapter-node behind a custom load balancer.
- Rakuten uses adapter-node in Docker containers orchestrated by Kubernetes for full control.
- Chess.com uses adapter-node with horizontal scaling for real-time features.

### Interview Questions

- 1. What does an adapter do? — Translates SvelteKit's build output into the format a platform expects (Vercel functions, Netlify functions, Node server, static HTML).
- 2. How do you deploy to Vercel? — Install adapter-vercel, set it in svelte.config.js, push to GitHub, import the repo on Vercel — automatic deploys per push.
- 3. What's the difference between $env/static/private and $env/dynamic/private? — Static is inlined at build time; dynamic reads at runtime (better for rotating secrets and serverless).
- 4. Why does the Node adapter need ORIGIN? — SvelteKit blocks cross-origin POSTs for CSRF protection; ORIGIN declares your site's allowed origin.
- 5. When is adapter-static appropriate? — For fully static sites where every route can be prerendered (no SSR, no server-only logic).

### Mini Project

Deploy a SvelteKit App to Vercel and Netlify: Build a small SvelteKit app with a server load and a public env var; configure adapter-vercel and deploy via Git; switch to adapter-netlify and redeploy; verify both work. Suggested approach:
  - Create the app with `npx sv create`
  - Install adapter-vercel and set in svelte.config.js
  - Add PUBLIC_API_URL to .env and use it in +page.svelte
  - Push to GitHub; import on Vercel — verify auto-deploy
  - Swap to adapter-netlify; redeploy; smoke-test both URLs

### Exercises

1. Install adapter-vercel, configure svelte.config.js, and deploy via Git.
2. Add a server-only env var (DATABASE_URL) and verify it doesn't leak to the client.
3. Switch to adapter-netlify and redeploy.
4. Use adapter-node to build and run locally with `node build/index.js`.
5. Set ORIGIN and PORT env vars and verify the server responds.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does a SvelteKit adapter do?
9. A) Compiles .svelte files
10. B) Runs the dev server
11. C) Translates the build output into a platform-specific format (*)
12. D) Generates TypeScript types
13. Explanation: Adapters (adapter-vercel, adapter-netlify, adapter-node, adapter-static) package SvelteKit's output for a target platform.
14. Q2: Which adapter deploys to Vercel?
15. A) adapter-node
16. B) adapter-static
17. C) @sveltejs/adapter-cloudflare
18. D) @sveltejs/adapter-vercel (*)
19. Explanation: @sveltejs/adapter-vercel outputs Vercel serverless functions per route; it's auto-detected by Vercel's build pipeline.
20. Q3: Which env module inlines values at build time?
21. A) $env/static/private (*)
22. B) $env/dynamic/private
23. C) process.env
24. D) import.meta.env
25. Explanation: $env/static/private replaces references at build time (values baked in); $env/dynamic/private reads at runtime — better for rotating secrets.
26. Q4: Which env module is safe to expose to the client?
27. A) $env/static/private
28. B) $env/static/public (*)
29. C) $env/dynamic/private
30. D) All of them
31. Explanation: $env/static/public (and $env/dynamic/public) are intentionally exposed to client bundles; private variants are server-only.
32. Q5: Which env var is required by adapter-node?
33. A) PORT only
34. B) NODE_ENV only
35. C) ORIGIN (your site's URL) — and PORT (*)
36. D) DATABASE_URL
37. Explanation: adapter-node requires ORIGIN (for CSRF/origin checks) and PORT; ORIGIN should be your deployed site's URL.
38. Q6: What's required for adapter-static to work?
39. A) Nothing
40. B) A database
41. C) SSR enabled
42. D) Every route must be prerenderable (prerender=true) (*)
43. Explanation: adapter-static produces only HTML/JS/CSS — every route must be prerendered at build time; routes with server-only logic fail the build.
44. Q7: How do you preview a production build locally?
45. A) npm run preview (*)
46. B) npm run dev
47. C) npm start
48. D) npm run serve
49. Explanation: `npm run preview` runs Vite's preview server against the built output — production-like for final smoke testing.
50. Q8: Where do you set production env vars on Vercel?
51. A) .env in the repo
52. B) Vercel dashboard → Project → Settings → Environment Variables (*)
53. C) svelte.config.js
54. D) package.json
55. Explanation: Production secrets go in the Vercel project settings; .env files in the repo are for local dev only and shouldn't be committed for secrets.
56. Q9: Why prefer $env/dynamic/private in serverless deploys?
57. A) It's faster
58. B) It's required
59. C) Secrets can rotate without rebuilding; values aren't baked into bundles (*)
60. D) It works on the client
61. Explanation: Static env inlines values at build time — bundle redeploy needed when secrets rotate. Dynamic env reads at runtime, allowing rotation without rebuilds.
62. Q10: How does Git-based deployment work on Vercel/Netlify?
63. A) Manual upload via FTP
64. B) Email the build
65. C) Copy-paste
66. D) Push to GitHub triggers auto-build and deploy; PRs get preview URLs (*)
67. Explanation: Connect the repo to Vercel/Netlify; every push to main deploys to production, every PR gets a preview URL — automated CI/CD.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does a SvelteKit adapter do?
  options:
    - Compiles .svelte files
    - Runs the dev server
    - Translates the build output into a platform-specific format
    - Generates TypeScript types
  correctIndex: 2
  explanation: Adapters (adapter-vercel, adapter-netlify, adapter-node, adapter-static) package SvelteKit's output for a target platform.
- id: q2
  question: Which adapter deploys to Vercel?
  options:
    - adapter-node
    - adapter-static
    - "@sveltejs/adapter-cloudflare"
    - "@sveltejs/adapter-vercel"
  correctIndex: 3
  explanation: "@sveltejs/adapter-vercel outputs Vercel serverless functions per route; it's auto-detected by Vercel's build pipeline."
- id: q3
  question: Which env module inlines values at build time?
  options:
    - $env/static/private
    - $env/dynamic/private
    - process.env
    - import.meta.env
  correctIndex: 0
  explanation: $env/static/private replaces references at build time (values baked in); $env/dynamic/private reads at runtime — better for rotating secrets.
- id: q4
  question: Which env module is safe to expose to the client?
  options:
    - $env/static/private
    - $env/static/public
    - $env/dynamic/private
    - All of them
  correctIndex: 1
  explanation: $env/static/public (and $env/dynamic/public) are intentionally exposed to client bundles; private variants are server-only.
- id: q5
  question: Which env var is required by adapter-node?
  options:
    - PORT only
    - NODE_ENV only
    - ORIGIN (your site's URL) — and PORT
    - DATABASE_URL
  correctIndex: 2
  explanation: adapter-node requires ORIGIN (for CSRF/origin checks) and PORT; ORIGIN should be your deployed site's URL.
- id: q6
  question: What's required for adapter-static to work?
  options:
    - Nothing
    - A database
    - SSR enabled
    - Every route must be prerenderable (prerender=true)
  correctIndex: 3
  explanation: adapter-static produces only HTML/JS/CSS — every route must be prerendered at build time; routes with server-only logic fail the build.
- id: q7
  question: How do you preview a production build locally?
  options:
    - npm run preview
    - npm run dev
    - npm start
    - npm run serve
  correctIndex: 0
  explanation: "`npm run preview` runs Vite's preview server against the built output — production-like for final smoke testing."
- id: q8
  question: Where do you set production env vars on Vercel?
  options:
    - .env in the repo
    - Vercel dashboard → Project → Settings → Environment Variables
    - svelte.config.js
    - package.json
  correctIndex: 1
  explanation: Production secrets go in the Vercel project settings; .env files in the repo are for local dev only and shouldn't be committed for secrets.
- id: q9
  question: Why prefer $env/dynamic/private in serverless deploys?
  options:
    - It's faster
    - It's required
    - Secrets can rotate without rebuilding; values aren't baked into bundles
    - It works on the client
  correctIndex: 2
  explanation: Static env inlines values at build time — bundle redeploy needed when secrets rotate. Dynamic env reads at runtime, allowing rotation without rebuilds.
- id: q10
  question: How does Git-based deployment work on Vercel/Netlify?
  options:
    - Manual upload via FTP
    - Email the build
    - Copy-paste
    - Push to GitHub triggers auto-build and deploy; PRs get preview URLs
  correctIndex: 3
  explanation: Connect the repo to Vercel/Netlify; every push to main deploys to production, every PR gets a preview URL — automated CI/CD.
```

