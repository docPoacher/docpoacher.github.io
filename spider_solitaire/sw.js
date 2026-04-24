const CACHE_NAME = "spider-v1";

const FILES_TO_CACHE = [
  "./goopis_spider_solitaire.html",
  "./goopis_spider_solitaire-large.png",
  "./goopis_spider_solitaire-small.png",
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});