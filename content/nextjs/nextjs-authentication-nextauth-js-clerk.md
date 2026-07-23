---
slug: nextjs-authentication-nextauth-js-clerk
id: nextjs-14
track: nextjs
order: 14
title: Authentication — NextAuth.js, Clerk
description: Add authentication to a Next.js app with NextAuth.js (Auth.js) or Clerk — session management, protected routes via middleware, and server-side session access.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=180s
whyItMatters: Add authentication to a Next. js app with NextAuth.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Authentication — NextAuth.js, Clerk

## Authentication — NextAuth.js, Clerk

### Why It Matters

Add authentication to a Next. js app with NextAuth.

Add authentication to a Next.js app with NextAuth.js (Auth.js) or Clerk — session management, protected routes via middleware, and server-side session access.

### Prerequisites

- Stage 13: Forms, Server Actions, and Mutations.
- Stage 9: Middleware and Edge Functions.
- OAuth basics and JWT vs session cookies.

### Topics

- NextAuth.js (Auth.js v5) setup in the App Router
- OAuth providers (GitHub, Google) and credentials provider
- Session strategy: JWT vs database sessions
- `auth()` helper for server components and middleware
- Clerk setup: SDK, middleware, `<SignIn />` / `<SignUp />` components
- Protecting routes via middleware redirects
- Reading the session in server components and Server Actions
- Role-based access control basics

### Key Concepts

- NextAuth stores sessions in secure HTTP-only cookies; the `auth()` helper reads them in RSC, middleware, and actions
- Middleware is the right place to gate routes because it runs before the route renders
- Clerk provides pre-built UI components (`<SignIn />`, `<UserProfile />`) and a middleware helper for protection
- Server components can call `auth()` synchronously to get the session user; client components use `useSession()`
- For database sessions, NextAuth needs an adapter (Prisma, Drizzle) to persist sessions

```ts
// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
});
```
Caption: NextAuth v5 setup

### Common Pitfalls

- Forgetting to set `NEXTAUTH_SECRET` (or `AUTH_SECRET`) in production — sessions fail to sign and users cannot log in; generate one with `openssl rand -base64 32`.
- Using the credentials provider without a real password hash check — the credentials provider does no hashing by default; use bcrypt or argon2 to verify passwords server-side.
- Reading the session in a client component without `useSession` and a `SessionProvider` — `auth()` only works in server components; client components need the provider and hook.
- Forgetting that `signIn` server action requires `redirect: false` if you want to handle errors — by default it redirects, swallowing the error.
- Trusting `req.auth` for fine-grained permissions — use it for authentication (who), not authorization (what they can do); check the database for the latter.

### Real-World Applications

- Vercel uses NextAuth-style session cookies to authenticate dashboard users across all its products.
- Notion uses an internal auth system integrated with Next.js middleware for workspace gating.
- Hulu uses Clerk-style pre-built auth UI to handle millions of viewer sign-ins during peak events.
- Twitch uses OAuth-based auth (Twitch login) wired into Next.js middleware to gate creator dashboards.

### Interview Questions

- 1. Where is the right place to gate routes by auth in Next.js? — Middleware, because it runs before the route renders and can redirect unauthenticated users at the edge.
- 2. How does NextAuth store sessions? — In secure HTTP-only cookies; with JWT strategy the cookie contains a signed JWT, with database strategy it stores a session ID.
- 3. What is the `auth()` helper in NextAuth v5? — A function you can call in server components, middleware, and Server Actions to read the current session synchronously (RSC) or via Promise.
- 4. Why use Clerk over NextAuth? — Clerk provides pre-built sign-in/sign-up UI, multi-tenant orgs, MFA, and a hosted dashboard, trading flexibility for less code to maintain.
- 5. What is the difference between authentication and authorization? — Authentication verifies who you are (login); authorization verifies what you can do (permissions). NextAuth handles auth; you layer authz on top.

### Mini Project

Build a protected dashboard: A `/login` page with a GitHub sign-in button, middleware that redirects unauthenticated users from `/dashboard/*` to `/login?next=...`, and a dashboard that reads the session via `auth()` and shows the user's name and avatar. Suggested approach:
  - Set up NextAuth v5 with the GitHub provider and `AUTH_SECRET` in `.env.local`
  - Add a `signIn` server action button on `/login` that calls `signIn("github")`
  - Add middleware that redirects unauthenticated `/dashboard/*` requests to `/login`
  - Read `auth()` in `app/dashboard/page.tsx` and render the user's name/avatar
  - Add a sign-out button calling the `signOut` server action

### Exercises

1. Install NextAuth v5 and add a GitHub provider; verify the OAuth flow works locally.
2. Add middleware that redirects unauthenticated users from `/dashboard` to `/login`.
3. Read the session in a server component and display the user's name.
4. Set up Clerk with `<SignIn />` and protect `/dashboard` with `createRouteMatcher`.
5. Generate an `AUTH_SECRET` with openssl and confirm production login works.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where is the best place to gate routes by authentication in Next.js?
9. A) In a server component
10. B) In middleware (*)
11. C) In a client component
12. D) In next.config.mjs
13. Explanation: Middleware runs before any route renders and can redirect unauthenticated users at the edge, making it the best place for route-level auth gates.
14. Q2: Where does NextAuth store session data?
15. A) In localStorage
16. B) In a URL parameter
17. C) In secure HTTP-only cookies (*)
18. D) In IndexedDB
19. Explanation: NextAuth uses secure, HTTP-only cookies (signed JWT or session ID) so the session is automatically sent with every request and cannot be read by JavaScript.
20. Q3: What is `AUTH_SECRET` for?
21. A) Encrypting the database
22. B) OAuth client secret
23. C) Hashing user passwords
24. D) Signing session JWTs in production (*)
25. Explanation: `AUTH_SECRET` (or `NEXTAUTH_SECRET`) is the symmetric key used to sign and verify session JWTs; without it, sessions fail in production. Generate one with `openssl rand -base64 32`.
26. Q4: Which hook reads the session in a client component?
27. A) useSession() (*)
28. B) useAuth()
29. C) useUser()
30. D) useCookie()
31. Explanation: NextAuth exposes `useSession()` for client components, which requires a `<SessionProvider>` wrapping the app to share session state.
32. Q5: What does the NextAuth `authorized` callback do?
33. A) Hashes passwords
34. B) Decides whether a request is allowed in middleware based on session (*)
35. C) Issues OAuth tokens
36. D) Stores the session
37. Explanation: The `authorized` callback runs in middleware and returns true/false to allow or redirect a request based on the session and path — perfect for route gating.
38. Q6: What is a key advantage of Clerk over NextAuth?
39. A) Clerk is open source
40. B) Clerk is faster
41. C) Clerk provides pre-built UI, MFA, and multi-tenant orgs out of the box (*)
42. D) Clerk requires no setup
43. Explanation: Clerk ships pre-built sign-in/sign-up/profile UI, MFA, orgs, and a hosted dashboard, reducing the code you write at the cost of flexibility and vendor lock-in.
44. Q7: Which Clerk function is used to protect a route in middleware?
45. A) protectRoute()
46. B) requireAuth()
47. C) guard()
48. D) auth().protect() (*)
49. Explanation: Clerk's middleware exposes `auth()` which has a `.protect()` method that redirects unauthenticated users to the sign-in page automatically.
50. Q8: What is the difference between JWT and database session strategies in NextAuth?
51. A) JWT stores a signed token in a cookie; database stores a session ID and persists sessions server-side (*)
52. B) JWT stores sessions in the database; database stores them in a cookie
53. C) They are identical
54. D) JWT is faster but insecure
55. Explanation: JWT strategy puts a signed token in the cookie (stateless, scales easily); database strategy stores a session ID in the cookie and looks up the session server-side (revocable, more DB load).
56. Q9: What must you do when using the credentials provider?
57. A) Trust the password as-is
58. B) Verify the password with a hash (bcrypt/argon2) on the server inside authorize() (*)
59. C) Store passwords in plain text
60. D) Skip validation
61. Explanation: The credentials provider does no hashing; you must compare the submitted password against a stored hash using bcrypt or argon2 inside the `authorize` callback.
62. Q10: Why should `req.auth` not be your only authorization check?
63. A) It is too slow
64. B) It is unreliable
65. C) It only tells you WHO the user is, not WHAT they can do — check the database for fine-grained permissions (*)
66. D) It only works in middleware
67. Explanation: `req.auth` answers authentication (who), not authorization (what they can do); for permissions like "can edit this post", check the database or a permissions system.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where is the best place to gate routes by authentication in Next.js?
  options:
    - In a server component
    - In middleware
    - In a client component
    - In next.config.mjs
  correctIndex: 1
  explanation: Middleware runs before any route renders and can redirect unauthenticated users at the edge, making it the best place for route-level auth gates.
- id: q2
  question: Where does NextAuth store session data?
  options:
    - In localStorage
    - In a URL parameter
    - In secure HTTP-only cookies
    - In IndexedDB
    - so the session is automatically sent with every request and cannot be read by JavaScript.
  correctIndex: 2
  explanation: NextAuth uses secure, HTTP-only cookies (signed JWT or session ID) so the session is automatically sent with every request and cannot be read by JavaScript.
- id: q3
  question: What is `AUTH_SECRET` for?
  options:
    - Encrypting the database
    - OAuth client secret
    - Hashing user passwords
    - Signing session JWTs in production
  correctIndex: 3
  explanation: "`AUTH_SECRET` (or `NEXTAUTH_SECRET`) is the symmetric key used to sign and verify session JWTs; without it, sessions fail in production. Generate one with `openssl rand -base64 32`."
- id: q4
  question: Which hook reads the session in a client component?
  options:
    - useSession()
    - useAuth()
    - useUser()
    - useCookie()
  correctIndex: 0
  explanation: NextAuth exposes `useSession()` for client components, which requires a `<SessionProvider>` wrapping the app to share session state.
- id: q5
  question: What does the NextAuth `authorized` callback do?
  options:
    - Hashes passwords
    - Decides whether a request is allowed in middleware based on session
    - Issues OAuth tokens
    - Stores the session
  correctIndex: 1
  explanation: The `authorized` callback runs in middleware and returns true/false to allow or redirect a request based on the session and path — perfect for route gating.
- id: q6
  question: What is a key advantage of Clerk over NextAuth?
  options:
    - Clerk is open source
    - Clerk is faster
    - Clerk provides pre-built UI, MFA, and multi-tenant orgs out of the box
    - Clerk requires no setup
  correctIndex: 2
  explanation: Clerk ships pre-built sign-in/sign-up/profile UI, MFA, orgs, and a hosted dashboard, reducing the code you write at the cost of flexibility and vendor lock-in.
- id: q7
  question: Which Clerk function is used to protect a route in middleware?
  options:
    - protectRoute()
    - requireAuth()
    - guard()
    - auth().protect()
  correctIndex: 3
  explanation: Clerk's middleware exposes `auth()` which has a `.protect()` method that redirects unauthenticated users to the sign-in page automatically.
- id: q8
  question: What is the difference between JWT and database session strategies in NextAuth?
  options:
    - JWT stores a signed token in a cookie; database stores a session ID and persists sessions server-side
    - JWT stores sessions in the database; database stores them in a cookie
    - They are identical
    - JWT is faster but insecure
  correctIndex: 0
  explanation: JWT strategy puts a signed token in the cookie (stateless, scales easily); database strategy stores a session ID in the cookie and looks up the session server-side (revocable, more DB load).
- id: q9
  question: What must you do when using the credentials provider?
  options:
    - Trust the password as-is
    - Verify the password with a hash (bcrypt/argon2) on the server inside authorize()
    - Store passwords in plain text
    - Skip validation
  correctIndex: 1
  explanation: The credentials provider does no hashing; you must compare the submitted password against a stored hash using bcrypt or argon2 inside the `authorize` callback.
- id: q10
  question: Why should `req.auth` not be your only authorization check?
  options:
    - It is too slow
    - It is unreliable
    - It only tells you WHO the user is, not WHAT they can do — check the database for fine-grained permissions
    - It only works in middleware
  correctIndex: 2
  explanation: '`req.auth` answers authentication (who), not authorization (what they can do); for permissions like "can edit this post", check the database or a permissions system.'
```

