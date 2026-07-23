---
slug: html-capstone-project
id: html-capstone
track: html
order: 21
title: "Capstone Project: Developer documentation sites (e.g., MDN, Stripe Docs, Cloudflare..."
description: |-
  Developer documentation sites (e.g., MDN, Stripe Docs, Cloudflare Docs) are
    among the most-visited pages on the web, and their HTML quality directly
    affects search rankings, accessibility for disabled developers, and onboarding
    speed. The capstone builds "Atlas Docs" — a static, multi-page dev
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Capstone Project: Developer documentation sites (e.g., MDN, Stripe Docs, Cloudflare...

## Developer documentation sites (e.g., MDN, Stripe Docs, Cloudflare...

Problem statement:
Developer documentation sites (e.g., MDN, Stripe Docs, Cloudflare Docs) are
  among the most-visited pages on the web, and their HTML quality directly
  affects search rankings, accessibility for disabled developers, and onboarding
  speed. The capstone builds "Atlas Docs" — a static, multi-page developer
  documentation site for a fictional JavaScript SDK. It must be hand-authored
  HTML5 (no framework), pass the W3C validator with zero errors, ship a strict
  Content Security Policy, expose schema.org structured data for every article,
  support light/dark themes via `prefers-color-scheme`, work offline as an
  installable PWA, score 90+ on every Lighthouse category, and demonstrate every
  concept from the 20-stage track: semantics, accessibility, SEO, structured
  data, internationalization hooks, email-friendly article pages, PWA,
  performance, and security. The finished site is deployed to a static host and
  audited with Lighthouse CI in GitHub Actions.

Target users:
• Junior developers reading API docs for the first time on a phone
• Senior engineers searching for specific function signatures via Google
• Developers with disabilities who rely on screen readers and keyboard nav
• Open-source contributors in low-bandwidth regions who need offline access

P0 (Must have) requirements:
• Hand-authored HTML5, no framework, passes W3C validator with zero errors
• Semantic document outline: one <h1> per page, sequential heading levels
• Accessible navigation with skip link, ARIA labels, aria-current="page"
• Side navigation with collapsible sections (using <details>/<summary>)
• Search form using <search> landmark and <input type="search">
• Article pages with <article>, <header>, <time datetime>, <pre><code> blocks
• Open Graph and Twitter Card tags on every page
• JSON-LD structured data (TechArticle + BreadcrumbList) on every article
• Service worker registered via HTML, installable PWA (manifest + icons)
• CSP via HTTP header on the static host (no unsafe-inline)

P1 (Should have) requirements:
• Light/dark theme via prefers-color-scheme, override persisted in localStorage
• Code blocks with copy button (<button type="button">) and accessible name
• "On this page" table of contents built from <h2>/<h3> with anchor links
• Previous/Next article navigation with descriptive link text
• Breadcrumb nav (<nav aria-label="Breadcrumb">) with structured data
• Language switcher scaffold (en + es) with hreflang alternates

P2 (Nice to have) requirements:
• Full-text client-side search via a prebuilt JSON index loaded in a worker
• Reading-progress bar that updates on scroll
• "Last updated" timestamp from git history baked in at build time
• Print stylesheet that hides nav and expands all <details>
• Webmentions support via <link rel="webmention">
• Service worker cache versioning with auto-update on new deploy

Tech stack:
• Hand-authored HTML5 (no React, no Vue — pure markup to exercise the track)
• CSS with custom properties for theming; logical properties for future RTL
• Vanilla ES2022 JavaScript modules for theme toggle and copy-code enhancer
• Web app manifest + service worker (Workbox optional; hand-rolled SW fine)
• Schema.org JSON-LD for TechArticle, BreadcrumbList, and Organization
• Lighthouse CI for performance, accessibility, SEO, and PWA gating
• axe-core via Playwright for automated accessibility testing
• W3C Nu Html Checker (vnu) for HTML validation in CI
• HTMLHint + Prettier for linting and formatting
• Cloudflare Pages (or Netlify) for hosting with custom `_headers`

> **Tip:** Testing strategy:
> - Validation: run `npx vnu --errors-only ./dist/**/*.html` in CI; fail the build on any error.
>   - Lint: run `npx htmlhint src/` and `npx prettier --check src/`; fail on warnings.
>   - Accessibility: `@axe-core/playwright` E2E tests on homepage and one article page; assert `results.violations` is empty.
>   - Lighthouse CI: collect three URLs and assert every category (Performance, Accessibility, Best Practices, SEO, PWA) ≥ 90; fail the build below threshold.
>   - Manual: keyboard-only navigation through the whole site, screen reader pass with VoiceOver or NVDA, and offline mode verification (kill network and reload) on the deployed URL.

> **Tip:** Deployment guide:
> - Host on Cloudflare Pages or Netlify (both have free tiers and custom `_headers` support).
>   - Environment variables: `SITE_URL` (canonical origin), `BUILD_NONCE` (per-deploy CSP nonce), `GA_ID` (optional analytics).
>   - Build command: `npm ci && npm run build`; output directory: `dist`.
>   - Ship `_headers` with CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS; verify headers in DevTools Network tab after deploy.
>   - Post-deploy: confirm HTTPS + HSTS, run Lighthouse on the live URL, install the PWA on mobile, share a URL in Slack to verify OG preview, run Google's Rich Results Test, and run the W3C validator on the live URL.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Semantic structure (20 pts) — Valid HTML5 with zero W3C validator errors, one <h1> per page, sequential heading levels, and proper use of <article>, <section>, <nav>, <main>, <aside>.
>   2. Accessibility (20 pts) — axe reports zero violations, full keyboard operability, descriptive link text, proper labels on every form control, and a working skip link.
>   3. SEO and structured data (20 pts) — Unique title and meta description per page, Open Graph and Twitter Cards render correctly, and JSON-LD passes Google's Rich Results Test with zero errors.
>   4. Performance and PWA (20 pts) — Lighthouse Performance, Best Practices, and PWA categories ≥ 90; LCP < 2.5s; manifest valid; service worker registered; app installs and works offline.
>   5. Security and deployment (20 pts) — Strict CSP with no unsafe-inline (nonces used), SRI on third-party scripts, HSTS + nosniff + Referrer-Policy headers, deployed via CI with green build, and headers verified post-deploy.
> 
> Stretch goals:
>   - Add a Spanish translation with `<html lang="es" dir="ltr">` and full `hreflang` alternates.
>   - Build a client-side full-text search with a prebuilt JSON index loaded in a Web Worker.
>   - Implement a reading-progress bar that updates on scroll using `IntersectionObserver`.
>   - Add a print stylesheet that hides nav, expands all `<details>`, and reformats code blocks for paper.
>   - Bake "Last updated" timestamps from git log into each article's `<time datetime>`.
>   - Add Webmention support with `<link rel="webmention" href="https://webmention.io/example/webmention">`.
>   - Implement service worker cache versioning with auto-update on new deploys (skipWaiting + clients.claim).
>   - Add an `<ruby>` annotation glossary for non-Latin SDK method names.

> **Tip:** Stretch goals:
> • Add a Spanish translation with `<html lang="es" dir="ltr">` and full `hreflang` alternates.
> • Build a client-side full-text search with a prebuilt JSON index loaded in a Web Worker.
> • Implement a reading-progress bar that updates on scroll using `IntersectionObserver`.
> • Add a print stylesheet that hides nav, expands all `<details>`, and reformats code blocks for paper.
> • Bake "Last updated" timestamps from git log into each article's `<time datetime>`.
> • Add Webmention support with `<link rel="webmention" href="https://webmention.io/example/webmention">`.
> • Implement service worker cache versioning with auto-update on new deploys (skipWaiting + clients.claim).
> • Add an `<ruby>` annotation glossary for non-Latin SDK method names.

