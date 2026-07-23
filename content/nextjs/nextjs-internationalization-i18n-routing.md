---
slug: nextjs-internationalization-i18n-routing
id: nextjs-16
track: nextjs
order: 16
title: Internationalization (i18n) and Routing
description: Add multi-language support to the App Router with `[locale]` dynamic segments, middleware-based locale detection, and message formatting with `next-intl` or the App Router i18n conventions.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=300s
whyItMatters: Add multi-language support to the App Router with `[locale]` dynamic segments, middleware-based locale detection, and message formatting with `next-intl` or the App Router i18n conventions.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Internationalization (i18n) and Routing

## Internationalization (i18n) and Routing

### Why It Matters

Add multi-language support to the App Router with `[locale]` dynamic segments, middleware-based locale detection, and message formatting with `next-intl` or the App Router i18n conventions.

Add multi-language support to the App Router with `[locale]` dynamic segments, middleware-based locale detection, and message formatting with `next-intl` or the App Router i18n conventions.

### Prerequisites

- Stage 9: Middleware and Edge Functions.
- Stage 7: Dynamic Routes and generateStaticParams.
- Awareness of locales, language tags (BCP 47), and ICU message format.

### Topics

- The `[locale]` segment strategy (App Router-native i18n)
- Middleware for locale detection and redirect
- `next-intl` for messages, formatting, and locale routing
- Static generation of localized routes with `generateStaticParams`
- Pluralization, number, and date formatting (ICU MessageFormat)
- Cookie-based locale persistence
- SEO: `hrefLang` alternates via `generateMetadata`
- Right-to-left (RTL) layout basics

### Key Concepts

- App Router i18n uses a `[locale]` dynamic segment as the root for localized routes
- Middleware detects the user's preferred locale (cookie, Accept-Language, path) and redirects
- `next-intl` provides `getTranslations`, `useTranslations`, and locale-aware formatting
- Each locale has its own message catalog (e.g. `messages/en.json`, `messages/es.json`)
- `generateStaticParams` returns all locales so the build pre-renders each one

```text
app/
  [locale]/
    layout.tsx          # Sets <html lang>, loads messages
    page.tsx
    about/page.tsx
i18n/
  routing.ts            # locale config
  request.ts            # server-side messages
messages/
  en.json
  es.json
  fr.json
```
Caption: Locale folder structure

### Common Pitfalls

- Forgetting to set `<html lang>` per locale — screen readers and search engines rely on the lang attribute; without it accessibility and SEO degrade.
- Mixing the legacy `i18n` config from `next.config.mjs` (Pages Router) with App Router `[locale]` — the App Router does not use that config; use a `[locale]` segment and middleware instead.
- Putting all messages in one giant file — split per-locale or per-feature so the bundler can tree-shake unused keys.
- Returning non-string values from message catalogs and using them directly — `next-intl` expects strings (or ICU-formatted messages); rich text needs `t.rich()` with tag handlers.
- Forgetting hrefLang alternates — without them Google may serve the wrong locale to users in other regions; declare them via `generateMetadata`.

### Real-World Applications

- Vercel's marketing site uses `next-intl` to localize content across 10+ locales with locale-prefixed routes.
- Notion's help center is fully localized via `[locale]` segments with per-locale message catalogs.
- Hulu uses locale detection to serve region-appropriate show catalogs with localized titles.
- TikTok uses middleware-based locale routing to switch UI language and content per region.

### Interview Questions

- 1. How does the App Router handle i18n natively? — Via a `[locale]` dynamic segment at the root and middleware for detection/redirect; no special config in next.config.mjs.
- 2. What does `next-intl` middleware do? — Detects the user's preferred locale (cookie, Accept-Language), redirects to the locale-prefixed URL, and sets the locale cookie.
- 3. How do you pre-render localized pages at build time? — Export `generateStaticParams` from the `[locale]/layout.tsx` returning each locale.
- 4. Why set `<html lang>` per locale? — Screen readers, search engines, and browser translation tools rely on the lang attribute; without it, accessibility and SEO degrade.
- 5. What are hrefLang alternates for? — Telling search engines which URLs are equivalent in other locales, so they serve the right version to users in each region.

### Mini Project

Build a bilingual landing page: A `/[locale]` app with English and Spanish message files, middleware that redirects `/` to `/en` (or `/es` based on Accept-Language), and a localized home page rendering the title and a date in the user's locale. Suggested approach:
  - Install `next-intl` and configure middleware with locales `["en", "es"]`
  - Create `messages/en.json` and `messages/es.json` with a `home` namespace
  - Create `app/[locale]/layout.tsx` with `generateStaticParams` returning both locales
  - Use `getTranslations` in `app/[locale]/page.tsx` to render the title and a formatted date
  - Add hrefLang alternates via `generateMetadata`

### Exercises

1. Set up `next-intl` middleware and confirm `/` redirects to `/en`.
2. Create two message files (en, es) and translate the home page title.
3. Add `generateStaticParams` returning both locales and verify both are pre-rendered.
4. Add hrefLang alternates and inspect the rendered `<link rel="alternate" hreflang>`.
5. Add a language switcher that uses `useRouter().push('/es')` to change locale.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How does the App Router handle i18n natively?
9. A) Via next.config.mjs i18n config (Pages Router style)
10. B) Via a built-in <LocaleProvider>
11. C) i18n is not supported in the App Router
12. D) Via a [locale] dynamic segment and middleware (*)
13. Explanation: The App Router uses a `[locale]` dynamic segment at the root and middleware for detection/redirect; the legacy `i18n` config from next.config.mjs is Pages Router only.
14. Q2: What does next-intl middleware do?
15. A) Detects the user's preferred locale, redirects to the locale-prefixed URL, and sets a cookie (*)
16. B) Translates page content automatically
17. C) Generates message files
18. D) Handles RTL layout
19. Explanation: next-intl's middleware detects the preferred locale (cookie, Accept-Language), redirects to `/locale/...`, and persists the choice in a cookie.
20. Q3: How do you pre-render localized pages at build time?
21. A) Set export const dynamic = 'force-static'
22. B) Export generateStaticParams returning each locale (*)
23. C) Use a sitemap
24. D) Pre-rendering is automatic
25. Explanation: Export `generateStaticParams` from the `[locale]/layout.tsx` returning each locale object so Next.js pre-renders every localized route at build time.
26. Q4: Why must `<html lang>` be set per locale?
27. A) It is required by React
28. B) It controls caching
29. C) Screen readers, search engines, and translation tools rely on it (*)
30. D) It enables streaming
31. Explanation: The `lang` attribute tells screen readers how to pronounce content, search engines which language the page is in, and browser translation tools what to do — getting it wrong hurts accessibility and SEO.
32. Q5: What are hrefLang alternates for?
33. A) Loading fonts
34. B) Setting the page language
35. C) Configuring middleware
36. D) Telling search engines which URLs are equivalent in other locales (*)
37. Explanation: hrefLang `<link rel="alternate" hreflang="...">` tags tell Google which localized URLs are equivalent, so it serves the right version to users in each region.
38. Q6: Where do message catalogs typically live in a next-intl project?
39. A) In per-locale JSON files (e.g. messages/en.json) (*)
40. B) In the database
41. C) In next.config.mjs
42. D) In environment variables
43. Explanation: next-intl loads messages from per-locale JSON files (or a function returning them); each locale has its own file like `messages/en.json`, `messages/es.json`.
44. Q7: Which function reads translations in a server component?
45. A) useTranslations()
46. B) getTranslations() (*)
47. C) t()
48. D) translate()
49. Explanation: `getTranslations` (from `next-intl/server`) returns a `t` function for server components and async contexts; `useTranslations` is the client-component equivalent.
50. Q8: What is the recommended matcher for i18n middleware?
51. A) "/*"
52. B) "/dashboard/*"
53. C) "/((?!api|_next|.*\\..*).*)" — excludes API, _next, and files with extensions (*)
54. D) "/:locale/*"
55. Explanation: The negative-lookahead matcher excludes `/_next`, `/api`, and any file with an extension (CSS, images), so middleware only runs on real localized routes.
56. Q9: What is ICU MessageFormat used for in i18n?
57. A) Caching messages
58. B) Loading messages
59. C) Detecting locale
60. D) Pluralization, number, and date formatting with placeholders (*)
61. Explanation: ICU MessageFormat is a syntax for expressing plurals, gender, numbers, and dates inside message strings, e.g. `{count, plural, =0 {No items} one {# item} other {# items}}`.
62. Q10: What does `localePrefix: "always"` mean in next-intl middleware?
63. A) Every URL has a locale prefix (e.g. /en/about) — the default locale is not exempt (*)
64. B) Locales are auto-detected without prefixing
65. C) Only the default locale is prefixed
66. D) Locales are stored in cookies only
67. Explanation: `localePrefix: "always"` ensures every URL includes the locale prefix (e.g. `/en/about`), even for the default locale — useful for consistency and avoiding redirect chains.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How does the App Router handle i18n natively?
  options:
    - Via next.config.mjs i18n config (Pages Router style)
    - Via a built-in <LocaleProvider>
    - i18n is not supported in the App Router
    - Via a [locale] dynamic segment and middleware
  correctIndex: 3
  explanation: The App Router uses a `[locale]` dynamic segment at the root and middleware for detection/redirect; the legacy `i18n` config from next.config.mjs is Pages Router only.
- id: q2
  question: What does next-intl middleware do?
  options:
    - Detects the user's preferred locale, redirects to the locale-prefixed URL, and sets a cookie
    - Translates page content automatically
    - Generates message files
    - Handles RTL layout
  correctIndex: 0
  explanation: next-intl's middleware detects the preferred locale (cookie, Accept-Language), redirects to `/locale/...`, and persists the choice in a cookie.
- id: q3
  question: How do you pre-render localized pages at build time?
  options:
    - Set export const dynamic = 'force-static'
    - Export generateStaticParams returning each locale
    - Use a sitemap
    - Pre-rendering is automatic
  correctIndex: 1
  explanation: Export `generateStaticParams` from the `[locale]/layout.tsx` returning each locale object so Next.js pre-renders every localized route at build time.
- id: q4
  question: Why must `<html lang>` be set per locale?
  options:
    - It is required by React
    - It controls caching
    - Screen readers, search engines, and translation tools rely on it
    - It enables streaming
  correctIndex: 2
  explanation: The `lang` attribute tells screen readers how to pronounce content, search engines which language the page is in, and browser translation tools what to do — getting it wrong hurts accessibility and SEO.
- id: q5
  question: What are hrefLang alternates for?
  options:
    - Loading fonts
    - Setting the page language
    - Configuring middleware
    - Telling search engines which URLs are equivalent in other locales
  correctIndex: 3
  explanation: hrefLang `<link rel="alternate" hreflang="...">` tags tell Google which localized URLs are equivalent, so it serves the right version to users in each region.
- id: q6
  question: Where do message catalogs typically live in a next-intl project?
  options:
    - In per-locale JSON files (e.g. messages/en.json)
    - In the database
    - In next.config.mjs
    - In environment variables
  correctIndex: 0
  explanation: next-intl loads messages from per-locale JSON files (or a function returning them); each locale has its own file like `messages/en.json`, `messages/es.json`.
- id: q7
  question: Which function reads translations in a server component?
  options:
    - useTranslations()
    - getTranslations()
    - t()
    - translate()
  correctIndex: 1
  explanation: "`getTranslations` (from `next-intl/server`) returns a `t` function for server components and async contexts; `useTranslations` is the client-component equivalent."
- id: q8
  question: What is the recommended matcher for i18n middleware?
  options:
    - '"/*"'
    - '"/dashboard/*"'
    - '"/((?!api|_next|.*\\..*).*)" — excludes API, _next, and files with extensions'
    - '"/:locale/*"'
  correctIndex: 2
  explanation: The negative-lookahead matcher excludes `/_next`, `/api`, and any file with an extension (CSS, images), so middleware only runs on real localized routes.
- id: q9
  question: What is ICU MessageFormat used for in i18n?
  options:
    - Caching messages
    - Loading messages
    - Detecting locale
    - Pluralization, number, and date formatting with placeholders
  correctIndex: 3
  explanation: ICU MessageFormat is a syntax for expressing plurals, gender, numbers, and dates inside message strings, e.g. `{count, plural, =0 {No items} one {# item} other {# items}}`.
- id: q10
  question: 'What does `localePrefix: "always"` mean in next-intl middleware?'
  options:
    - Every URL has a locale prefix (e.g. /en/about) — the default locale is not exempt
    - Locales are auto-detected without prefixing
    - Only the default locale is prefixed
    - Locales are stored in cookies only
  correctIndex: 0
  explanation: '`localePrefix: "always"` ensures every URL includes the locale prefix (e.g. `/en/about`), even for the default locale — useful for consistency and avoiding redirect chains.'
```

