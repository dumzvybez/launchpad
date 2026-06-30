// ============================================================
// Launchpad Service Worker — offline-first caching
// Caches the app shell + static assets so the app works
// even when offline (after first load).
// ============================================================

const CACHE_VERSION = "launchpad-v2-2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Assets to cache immediately on install (app shell)
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/favicon.ico",
];

// Install — precache the app shell. Use Promise.allSettled instead of
// cache.addAll so that a single failed precache URL (e.g. a missing
// icon, or a transient network blip) doesn't abort the entire install
// and leave the SW stuck in the "installing" state forever.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u))),
      )
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] precache failed:", err)),
  );
});

// Activate — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch — stale-while-revalidate for most requests
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Chrome extension and devtools requests
  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Skip Next.js HMR + dev requests in development
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // PRIVACY: NEVER cache API responses. The /api/chat endpoint may
  // contain AI responses that include user code, and /api/roadmap-generate
  // responses include the user's personalized roadmap. Caching these in
  // Cache Storage would persist them in the browser even after the user
  // clicks "Reset all data" in Settings (which only clears localStorage).
  if (url.pathname.startsWith("/api/")) {
    return; // Let the request go straight to the network, no caching
  }

  // For navigation requests — network-first (so user gets latest HTML),
  // fall back to cached version when offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses — caching a 404/500 would lock
          // the user out of the app on the next offline load.
          if (response && response.ok && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // For static assets — stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/favicon.ico"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          // If both cache and network fail (first load while offline),
          // return a proper 504 Response instead of `undefined` —
          // returning undefined from respondWith is invalid and shows a
          // browser-level network error.
          .catch(() => cached ?? new Response("", { status: 504, statusText: "Gateway Timeout" }));
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Default — try network, DON'T cache (avoid caching random external
  // requests like Pyodide CDN partials — they're already cached by the
  // browser's HTTP cache). Same 504 fallback for the offline case.
  event.respondWith(
    fetch(request).catch(
      () => caches.match(request) ?? new Response("", { status: 504, statusText: "Gateway Timeout" }),
    ),
  );
});

// Allow the page to trigger immediate updates
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
