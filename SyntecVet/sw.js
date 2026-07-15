const CACHE_NAME = "syntecvet-v28";
const OFFLINE_URL = "/index.html";
const APP_SHELL = [
  OFFLINE_URL,
  "/styles.css?v=28",
  "/app.js?v=28",
  "/config.js?v=28",
  "/manifest.webmanifest?v=28",
  "/assets/brand/syntec-logo.png",
  "/assets/catalog/catalog-hero-v2.webp",
  "/assets/ui/product-stage-v1.webp",
  "/assets/ui/assistant-avatar-v1.png",
  "/assets/products/anestt.jpg",
  "/assets/products/get-vacina-syntec.jpg",
];

const SAFE_REFRESH_PATHS = new Set(["/", "/catalogo", "/login"]);

async function cacheResponse(request, response) {
  if (!response?.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, fallbackRequest = request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    return cacheResponse(request, response);
  } catch {
    return (await caches.match(fallbackRequest)) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => cacheResponse(request, response))
    .catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" }))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();

      const windows = await self.clients.matchAll({ type: "window" });
      await Promise.all(
        windows.map((client) => {
          const url = new URL(client.url);
          return SAFE_REFRESH_PATHS.has(url.pathname) ? client.navigate(client.url) : Promise.resolve();
        }),
      );
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, OFFLINE_URL));
    return;
  }

  if (["script", "style", "manifest"].includes(event.request.destination) || requestUrl.pathname === "/config.js") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
