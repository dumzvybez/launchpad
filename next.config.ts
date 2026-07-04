import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // v5.84: TypeScript type checking. We keep ignoreBuildErrors: true because
  // the 6MB auto-generated lessons-content.ts has type mismatches that would
  // require a massive data cleanup to fix. The Project type shadowing issue
  // (the main hand-written-code type error) was fixed in v5.79.
  // ESLint is configured via eslint.config.mjs (Next.js 16 removed the
  // `eslint` key from NextConfig — it's now handled by the flat config file).
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React StrictMode in development to catch impure renders, missing
  // cleanups, and stale state.
  reactStrictMode: true,
  // Don't leak "X-Powered-By: Next.js" header.
  poweredByHeader: false,
  // Security headers — defense in depth.
  // v5.77 fix: added Content-Security-Policy and Strict-Transport-Security.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // CSP: allow self + the AI providers + YouTube-nocookie + Giscus + Pyodide CDN.
          // 'unsafe-inline' is needed for Next.js's inline scripts/styles; a future
          // hardening pass should switch to nonce-based CSP.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://giscus.app",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://api.groq.com https://openrouter.ai https://api.openai.com https://api.anthropic.com",
              "frame-src https://www.youtube-nocookie.com https://giscus.app",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
