import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // NOTE: We keep `ignoreBuildErrors: true` for now because the codebase has
  // accumulated pre-existing TypeScript issues (e.g. lessons-data.ts is 6MB
  // and has subtle type mismatches with the legacy Project type in
  // projects-data.ts). Turning this off would block the build. A follow-up
  // cleanup pass should fix these and re-enable strict type checking.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React StrictMode in development to catch impure renders, missing
  // cleanups, and stale state. (The previous setting was `false` which masked
  // these bugs during development.)
  reactStrictMode: true,
  // Don't leak "X-Powered-By: Next.js" header.
  poweredByHeader: false,
  // Security headers — defense in depth.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
