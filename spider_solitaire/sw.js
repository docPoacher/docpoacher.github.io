const CACHE_NAME = "spider-v1";

const FILES_TO_CACHE = [
  "./",
  "./goopis_spider_solitaire.html",
  "./goopis_spider_solitaire-large.png",
  "./goopis_spider_solitaire-small.png",
  "./favicon.ico"
];

// Install: cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// Activate: take control immediately
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch: safe offline-first strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      try {
        // 1. Try cache first
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // 2. Try network
        const response = await fetch(event.request);

        // 3. Optional: cache new GET requests dynamically
        if (event.request.method === "GET") {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (err) {
        // 4. Fallback for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./goopis_spider_solitaire.html");
        }

        // 5. Fail gracefully (no crash logs)
        return new Response("", { status: 408 });
      }
    })()
  );
});
