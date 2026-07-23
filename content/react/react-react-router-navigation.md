---
slug: react-react-router-navigation
id: react-11
track: react
order: 11
title: React Router and Navigation
description: Add multi-page navigation to a React SPA with React Router 6+, including nested routes, dynamic params, loaders, and navigation guards.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=600s
whyItMatters: Add multi-page navigation to a React SPA with React Router 6+, including nested routes, dynamic params, loaders, and navigation guards.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# React Router and Navigation

## React Router and Navigation

### Why It Matters

Add multi-page navigation to a React SPA with React Router 6+, including nested routes, dynamic params, loaders, and navigation guards.

Add multi-page navigation to a React SPA with React Router 6+, including nested routes, dynamic params, loaders, and navigation guards.

### Prerequisites

- Stage 10: Context API and useReducer.
- URLs, the History API, and the difference between client and server routing.

### Topics

- Installing and configuring React Router 6
- `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>`
- Dynamic route params with `useParams`
- Nested routes and `<Outlet>`
- `useNavigate` for programmatic navigation
- Navigation guards: protected routes, redirects
- Loaders and actions (data router)
- 404 handling and `<Navigate>`

### Key Concepts

- React Router is a client-side router — the URL changes but the page doesn't reload
- The data router (`createBrowserRouter`) supports loaders (fetch on navigation) and actions (form submissions)
- `<Outlet>` renders the matched child route; nested routes share layout components
- Navigation can be declarative (`<Link>`) or programmatic (`useNavigate()`)
- A redirect from a guard returns `<Navigate to="..." replace />`

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/ada">Ada</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserPage() {
  const { userId } = useParams();
  return <h1>User: {userId}</h1>;
}
```
Caption: Basic routing

### Common Pitfalls

- Forgetting to wrap the app in `<BrowserRouter>` — `<Routes>` and `<Link>` throw outside a router. Always start with the router at the top.
- Using `<a href>` instead of `<Link to>` — `<a>` triggers a full page reload, losing React state; `<Link>` uses the History API.
- Mismatched route paths in nested routing — child paths are relative to the parent; `path="settings"` (not `/settings`) under a parent route.
- Not handling 404s — always include `<Route path="*" element={<NotFound/>} />` so unknown URLs show a friendly page.
- Storing the "return to" URL in component state instead of `location.state` — `location.state` survives the navigation to /login and back.

### Real-World Applications

- Vercel's dashboard uses React Router (now Remix) with nested layouts for the project/settings/team sections.
- Airbnb's listing pages use nested routing for the photo gallery, amenities, and reviews tabs.
- Linear uses a custom router for its keyboard-driven command palette flow plus React Router for page-level navigation.
- Notion's workspace switcher uses nested routes per workspace and per page.

### Interview Questions

- 1. What's the difference between `<Link>` and `<a>`? — `<Link>` uses the History API to update the URL without a reload, preserving React state; `<a>` does a full page load.
- 2. What does `<Outlet>` do? — Renders the matched child route in a nested layout, letting parents wrap children with shared chrome.
- 3. How do you redirect an unauthenticated user? — Render `<Navigate to="/login" state={{ from: location }} replace />` from a guard component.
- 4. What's the difference between `createBrowserRouter` and `<BrowserRouter>`? — The data router supports loaders/actions and the `useLoaderData`/`useActionData` hooks; `<BrowserRouter>` is purely presentational.
- 5. How do you read a URL parameter? — `const { userId } = useParams()` inside a route component for `path="/users/:userId"`.

### Mini Project

Build a "Multi-page Blog" with React Router: Home (post list), Post detail (`/posts/:slug`), About, Login (mock), and a protected Admin page that requires a fake logged-in flag. Use nested routes for a shared Layout and a `<RequireAuth>` guard for Admin. Suggested approach:
  - Use `createBrowserRouter` with a root Layout route and child routes
  - Create a `useAuth` context that flips `user` after clicking "Log in"
  - Add a `<RequireAuth>` guard redirecting to `/login` with `state.from`
  - After login, navigate back to `state.from` via `useNavigate`
  - Include a `*` route rendering a 404 page

### Exercises

1. Convert a single-page component into a two-route app with `<Link>` between them.
2. Add a dynamic `/users/:id` route and display the id with `useParams`.
3. Implement a `<RequireAuth>` guard that redirects to `/login` when not authed.
4. Use `useNavigate` to programmatically navigate after a form submit.
5. Add a 404 catch-all route and confirm unknown paths render it.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which component updates the URL without a full page reload?
9. A) `<a href>`
10. B) `<Route>`
11. C) `<Link to>` (*)
12. D) `<Navigate>`
13. Explanation: `<Link to>` uses the History API to update the URL and let React Router swap components without reloading the page or losing React state.
14. Q2: What does `<Outlet>` render?
15. A) The current user
16. B) Nothing
17. C) The 404 page
18. D) The matched child route in a nested layout (*)
19. Explanation: In a layout route, `<Outlet />` is the placeholder where the matched child route's element renders, enabling shared chrome around nested pages.
20. Q3: How do you read a dynamic URL parameter like `:userId`?
21. A) `useParams()` (*)
22. B) `useLocation().userId`
23. C) `useSearchParams()`
24. D) `useNavigate()`
25. Explanation: `useParams()` returns an object with the dynamic segments from the matched route, e.g. `{ userId: "ada" }` for `/users/ada`.
26. Q4: What is the purpose of `createBrowserRouter` (the data router)?
27. A) It's a faster router
28. B) It supports loaders, actions, and `useLoaderData`/`useActionData` (*)
29. C) It's required for nested routes
30. D) It replaces `<Link>`
31. Explanation: The data router brings Remix-style data loading and form actions to client-side routing; `<BrowserRouter>` is purely presentational.
32. Q5: How do you redirect an unauthenticated user from a protected route?
33. A) Throw an error
34. B) Use window.location
35. C) Render `<Navigate to="/login" state={{ from: location }} replace />` (*)
36. D) Use a setTimeout
37. Explanation: A guard component checks auth and renders `<Navigate>` to redirect; `state.from` preserves the original URL so you can return after login.
38. Q6: Why use `replace` on a `<Navigate>`?
39. A) For performance
40. B) To clear state
41. C) To enable nested routes
42. D) So the current URL is replaced in history (no back-button trap) (*)
43. Explanation: `replace` swaps the current history entry instead of pushing a new one, so the back button doesn't bounce the user back to the protected page they were redirected from.
44. Q7: Why must `<Routes>` and `<Link>` be inside a `<BrowserRouter>` (or data router)?
45. A) They throw outside a router context (*)
46. B) For performance
47. C) It's a TypeScript requirement
48. D) Only for nested routes
49. Explanation: Routing hooks and components read from router context; without a provider they throw "useLocation() may be used only in the context of a <Router>".
50. Q8: What's the catch-all route pattern for 404 pages?
51. A) `path="404"`
52. B) `path="*"` (*)
53. C) `path="/"`
54. D) `path=":notFound"`
55. Explanation: `path="*"` matches any URL not matched by other routes, letting you render a NotFound page for unknown paths.
56. Q9: Where do nested child route paths anchor?
57. A) Always at the root `/`
58. B) At the domain
59. C) Relative to the parent route's path (*)
60. D) They must be absolute
61. Explanation: Child `path` is relative to its parent — under `path="settings"`, a child `path="profile"` matches `/settings/profile`, not `/profile`.
62. Q10: Which hook returns the current `location` object (pathname, search, hash)?
63. A) `useNavigate()`
64. B) `useParams()`
65. C) `useSearchParams()`
66. D) `useLocation()` (*)
67. Explanation: `useLocation()` returns the current location object with `pathname`, `search`, `hash`, and `state`; useful for guards and analytics.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which component updates the URL without a full page reload?
  options:
    - "`<a href>`"
    - "`<Route>`"
    - "`<Link to>`"
    - "`<Navigate>`"
  correctIndex: 2
  explanation: "`<Link to>` uses the History API to update the URL and let React Router swap components without reloading the page or losing React state."
- id: q2
  question: What does `<Outlet>` render?
  options:
    - The current user
    - Nothing
    - The 404 page
    - The matched child route in a nested layout
  correctIndex: 3
  explanation: In a layout route, `<Outlet />` is the placeholder where the matched child route's element renders, enabling shared chrome around nested pages.
- id: q3
  question: How do you read a dynamic URL parameter like `:userId`?
  options:
    - "`useParams()`"
    - "`useLocation().userId`"
    - "`useSearchParams()`"
    - "`useNavigate()`"
  correctIndex: 0
  explanation: '`useParams()` returns an object with the dynamic segments from the matched route, e.g. `{ userId: "ada" }` for `/users/ada`.'
- id: q4
  question: What is the purpose of `createBrowserRouter` (the data router)?
  options:
    - It's a faster router
    - It supports loaders, actions, and `useLoaderData`/`useActionData`
    - It's required for nested routes
    - It replaces `<Link>`
  correctIndex: 1
  explanation: The data router brings Remix-style data loading and form actions to client-side routing; `<BrowserRouter>` is purely presentational.
- id: q5
  question: How do you redirect an unauthenticated user from a protected route?
  options:
    - Throw an error
    - Use window.location
    - 'Render `<Navigate to="/login" state={{ from: location }} replace />`'
    - Use a setTimeout
  correctIndex: 2
  explanation: A guard component checks auth and renders `<Navigate>` to redirect; `state.from` preserves the original URL so you can return after login.
- id: q6
  question: Why use `replace` on a `<Navigate>`?
  options:
    - For performance
    - To clear state
    - To enable nested routes
    - So the current URL is replaced in history (no back-button trap)
  correctIndex: 3
  explanation: "`replace` swaps the current history entry instead of pushing a new one, so the back button doesn't bounce the user back to the protected page they were redirected from."
- id: q7
  question: Why must `<Routes>` and `<Link>` be inside a `<BrowserRouter>` (or data router)?
  options:
    - They throw outside a router context
    - For performance
    - It's a TypeScript requirement
    - Only for nested routes
  correctIndex: 0
  explanation: Routing hooks and components read from router context; without a provider they throw "useLocation() may be used only in the context of a <Router>".
- id: q8
  question: What's the catch-all route pattern for 404 pages?
  options:
    - '`path="404"`'
    - '`path="*"`'
    - '`path="/"`'
    - '`path=":notFound"`'
  correctIndex: 1
  explanation: '`path="*"` matches any URL not matched by other routes, letting you render a NotFound page for unknown paths.'
- id: q9
  question: Where do nested child route paths anchor?
  options:
    - Always at the root `/`
    - At the domain
    - Relative to the parent route's path
    - They must be absolute
  correctIndex: 2
  explanation: Child `path` is relative to its parent — under `path="settings"`, a child `path="profile"` matches `/settings/profile`, not `/profile`.
- id: q10
  question: Which hook returns the current `location` object (pathname, search, hash)?
  options:
    - "`useNavigate()`"
    - "`useParams()`"
    - "`useSearchParams()`"
    - "`useLocation()`"
  correctIndex: 3
  explanation: "`useLocation()` returns the current location object with `pathname`, `search`, `hash`, and `state`; useful for guards and analytics."
```

