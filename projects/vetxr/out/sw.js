const CACHE_NAME = 'vetxr-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // In a Next.js static export we can't reliably predict all chunk names,
      // but we can cache the main entry points and offline fallback if needed.
      return cache.addAll(['./', './index.html', './app_icon.png', './manifest.json']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        // Cache new assets dynamically
        if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
          const cacheCopy = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
        }
        return fetchRes;
      });
    }).catch(() => {
        // Offline fallback if needed
    })
  );
});