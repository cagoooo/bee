const CACHE_VERSION = 'bee-v1-2026-05-02';
const PRECACHE_URLS = [
  './',
  './index.html',
  './beginner.html',
  './medium.html',
  './advanced.html',
  './css/styles.css',
  './js/game.js',
  './manifest.webmanifest',
  './favicon.ico',
  './icon.png',
  './images/card-back.jpg',
  './images/flower.png',
  './images/video-thumbnail.jpg',
  './audio/card-flip.mp3',
  './audio/card-match.mp3',
  './audio/card-mismatch.mp3',
  './audio/restart.mp3',
  './audio/background-music.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('Precache partial failure:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
