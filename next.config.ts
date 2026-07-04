import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // v5.79: re-enabled strict TypeScript type checking. The main type issue
  // (Project type shadowing between types.ts and projects-data.ts) has been
  // fixed — types.ts now re-exports Project from projects-data.ts. The 6MB
  // lessons-content.ts is type-checked via skipLibCheck + the Lesson type.
  typescript: {
    ignoreBuildErrors: false,
  },
  // v5.78: ESLint errors now fail the build (previously ignored). Warnings
  // (like react-hooks/exhaustive-deps) do NOT fail — they surface in `next lint`
  // output for incremental fixing.
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable React StrictMode in development to catch impure renders, missing
  // cleanups, and stale state. (The previous setting was `false` which masked
  // these bugs during development.)
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
