const CACHE_NAME = 'sys-review-v1';
const urlsToCache = [
  './',
  './index.html',
  './app_icon.png',
  './app_icon_192.png',
  './app_icon_512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});