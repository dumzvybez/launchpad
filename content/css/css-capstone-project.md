---
slug: css-capstone-project
id: css-capstone
track: css
order: 21
title: "Capstone Project: Modern web products live across many surfaces —..."
description: |-
  Modern web products live across many surfaces — marketing pages,
    dashboards, embedded widgets, email, and print — and a fragmented
    visual language erodes trust and slows shipping. The capstone builds
    "Atlas DS", a production-grade CSS design system with theme tokens,
    a small component librar
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Capstone Project: Modern web products live across many surfaces —...

## Modern web products live across many surfaces —...

Problem statement:
Modern web products live across many surfaces — marketing pages,
  dashboards, embedded widgets, email, and print — and a fragmented
  visual language erodes trust and slows shipping. The capstone builds
  "Atlas DS", a production-grade CSS design system with theme tokens,
  a small component library (Button, Card, Form Controls, Modal,
  Data Table), a responsive documentation site that demonstrates every
  component, and a hardened build pipeline that lints, prefixes,
  minifies, and extracts critical CSS. The system must support
  light/dark/dim themes via custom properties and `light-dark()`,
  adapt components to any container via container queries, respect
  `prefers-reduced-motion` and forced-colors, score 90+ on every
  Lighthouse category, ship zero render-blocking CSS, and demonstrate
  every concept from the 20-stage track: the box model, selectors and
  specificity, layout (flex + grid + subgrid), responsive design,
  animations, layered architecture, modern CSS (container queries,
  :has(), subgrid), custom properties and theming, pseudo-classes and
  pseudo-elements, form styling, filters/blend modes, performance,
  accessibility, print styles, Houdini, and tooling. The finished
  system is deployed to a static host and audited with Lighthouse CI
  and Stylelint in GitHub Actions.

Target users:
• Frontend developers at a startup adopting Atlas DS to build a
• customer-facing dashboard quickly and consistently
• Designers prototyping new pages in HTML/CSS who need a token-driven
• system that matches Figma variables
• Engineers with disabilities who rely on screen readers, keyboard
• navigation, and forced-colors mode
• Mobile users on low-end Android devices who need <100KB of CSS
• and a 90+ Lighthouse performance score

P0 (Must have) requirements:
• Design tokens defined as CSS custom properties on :root in a
• dedicated @layer tokens layer (color, spacing, typography,
• radius, shadow, motion, z-index)
• Three themes (light, dark, dim) switchable via [data-theme]
• attribute and OS-aware via light-dark() defaults
• Layered architecture: @layer reset, base, components, utilities,
• tokens, vendor with declared order
• Component library: Button (variants + sizes + states), Card,
• Input/Checkbox/Radio/Range (custom-styled, accessible), Modal
• (with backdrop-filter), Data Table (with sticky header)
• Container queries on every component so it adapts to its parent
• width, not the viewport
• :focus-visible rings on every interactive element; visible at
• 3:1 contrast against the background
• prefers-reduced-motion block that disables non-essential motion
• Forced-colors mode fallback using system color keywords
• WCAG AA contrast (4.5:1 text, 3:1 UI) on every theme
• Build pipeline: PostCSS (autoprefixer, postcss-preset-env,
• cssnano), Stylelint, critical CSS extraction

P1 (Should have) requirements:
• Print stylesheet for the documentation site (hide nav, expand
• <details>, show full URLs after links, page numbers in footer)
• Animated component playground with live theme switcher
• Custom property registered via @property for one animatable
• gradient (e.g., conic spinner)
• @supports feature-detection for subgrid with a flex fallback
• View Transitions API for animated theme switch
• Scroll-driven animations for in-page reveals

P2 (Nice to have) requirements:
• Paint Worklet for a custom dotted/grid background on hero
• sections
• CSS-only accordion using <details> + ::details-content
• Reading-progress bar using scroll-driven animations
• "On this page" table of contents with scroll-spy via :has()
• and IntersectionObserver
• Email-friendly fallback stylesheet for transactional templates
• Internationalization-ready logical properties throughout
• (margin-inline, padding-block) for future RTL support

Tech stack:
• Hand-authored modern CSS with @layer, custom properties, container
• queries, :has(), subgrid, and native nesting
• PostCSS pipeline: autoprefixer (browserslist-driven),
• postcss-preset-env (stage 2 future CSS), cssnano (minification)
• Stylelint with stylelint-config-standard for linting
• Critical CSS extraction via critical or Penthouse, inlined per page
• Inter variable font loaded via @font-face with font-display: swap
• Vanilla ES2022 JS modules for theme switching (with FOUC guard)
• Paint Worklet (Houdini) for custom backgrounds with @supports fallback
• Playwright + @axe-core/playwright for visual regression and a11y tests
• Lighthouse CI for performance, accessibility, SEO gating in CI
• Cloudflare Pages (or Vercel) for static hosting with custom _headers

> **Tip:** Testing strategy:
> - Visual regression: Playwright screenshot tests for each component
>     in light, dark, and dim themes; fail if a pixel diff exceeds 0.1%.
>   - Accessibility: `@axe-core/playwright` scans every doc page; assert
>     zero violations on WCAG AA rules (color-contrast, focus, aria).
>   - Cross-browser: Playwright runs on Chromium, Firefox, and WebKit;
>     verify form controls, container queries, and subgrid behavior.
>   - Performance: Lighthouse CI gates performance at 90+; CSS payload
>     target <50KB total (minified+gzipped), critical CSS <14KB inlined.
>   - Lint: Stylelint runs on every CSS file in CI; `no-descending-specificity`,
>     `selector-class-pattern`, and `color-hex-length` enforced; zero
>     warnings allowed.

> **Tip:** Deployment guide:
> - Host: Cloudflare Pages (or Vercel) connected to the GitHub repo.
>   - Build command: `npm run build` (runs PostCSS, critical CSS extraction,
>     Stylelint, and Playwright tests).
>   - Output directory: `dist/` containing static HTML, minified CSS,
>     fonts, and icons.
>   - Environment variables: `CF_PAGES_BRANCH` for branch-based deploys
>     (preview on PRs, production on `main`); no secrets needed.
>   - Headers: ship CSS with `Cache-Control: public, max-age=31536000,
>     immutable` (content-hashed filenames) and `Content-Type: text/css;
>     charset=utf-8`. Post-deploy verification: run Lighthouse against the
>     live URL, run axe-core via `npx @axe-core/playwright-cli <url>`,
>     and confirm zero violations and all categories >= 90.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture and tokens (20 pts) — Uses @layer with declared order;
>      tokens defined as custom properties in a tokens layer; three themes
>      switchable via [data-theme] with OS-aware light-dark() defaults.
>   2. Component quality (20 pts) — Every component (Button, Card, Form
>      Controls, Modal, Table) works in any container via container queries,
>      respects :focus-visible, and uses BEM-style single-class selectors
>      with no !important.
>   3. Accessibility (20 pts) — All interactive elements have visible
>      :focus-visible rings; WCAG AA contrast on every theme; respects
>      prefers-reduced-motion and forced-colors; zero axe violations.
>   4. Performance (20 pts) — Critical CSS inlined per page (<14KB);
>      non-critical CSS async-loaded; total CSS <50KB gzipped; Lighthouse
>      performance >= 90; uses GPU-friendly transform/opacity for
>      animations.
>   5. Build pipeline and tooling (20 pts) — PostCSS (autoprefixer,
>      preset-env, cssnano) configured; Stylelint passes with zero
>      warnings; Lighthouse CI gates 90+ in GitHub Actions; deployed to
>      Cloudflare Pages with immutable cache headers.
> 
> Stretch goals:
>   - Add a Paint Worklet (Houdini) for a custom dotted hero background,
>     with @supports fallback for non-supporting browsers.
>   - Implement scroll-driven animations (`animation-timeline: view()`)
>     for in-page section reveals, with a fallback for older browsers.
>   - Use the View Transitions API for animated theme switching with
>     `::view-transition-*` pseudo-element styling.
>   - Build a "On this page" TOC with scroll-spy using :has() and
>     IntersectionObserver (no JS lib).
>   - Add an email-friendly fallback stylesheet that uses table-based
>     layout and inline CSS for transactional templates.
>   - Convert all physical properties to logical (`margin-inline`,
>     `padding-block`, `inset-inline`) and add an RTL preview with
>     `dir="rtl"` on a test page.
>   - Add a CSS-only accordion using `<details>` + `::details-content`
>     pseudo-element for progressive disclosure without JS.
>   - Build a reading-progress bar using `animation-timeline: scroll()`
>     and a `transform: scaleX()` indicator.

> **Tip:** Stretch goals:
> • Add a Paint Worklet (Houdini) for a custom dotted hero background,
> • with @supports fallback for non-supporting browsers.
> • Implement scroll-driven animations (`animation-timeline: view()`)
> • for in-page section reveals, with a fallback for older browsers.
> • Use the View Transitions API for animated theme switching with
> • `::view-transition-*` pseudo-element styling.
> • Build a "On this page" TOC with scroll-spy using :has() and
> • IntersectionObserver (no JS lib).
> • Add an email-friendly fallback stylesheet that uses table-based
> • layout and inline CSS for transactional templates.
> • Convert all physical properties to logical (`margin-inline`,
> • `padding-block`, `inset-inline`) and add an RTL preview with
> • `dir="rtl"` on a test page.
> • Add a CSS-only accordion using `<details>` + `::details-content`
> • pseudo-element for progressive disclosure without JS.
> • Build a reading-progress bar using `animation-timeline: scroll()`
> • and a `transform: scaleX()` indicator.

