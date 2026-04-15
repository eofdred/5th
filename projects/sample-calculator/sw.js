const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./app_icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache).catch(err => console.warn("Cache fail", err)))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});
