const CACHE_NAME = "coffee-roulette-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./icon.png",
  "./og_icon.png",
  "./manifest.json",
];

// Removed "./main.js" from the cache list as the file does not exist.
// Attempting to cache a missing file caused the service worker installation to fail.

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
