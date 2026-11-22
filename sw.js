// CONQUISTADOR DE WAIFU'S - service worker (torna o jogo instalável como app)
// Ao subir, renomear este arquivo para sw.js. O conteúdo já usa os nomes
// pós-rename: cacheia ./index.html (não o nome versionado).
const CACHE = 'conquistador-v121';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Cacheia cada arquivo sozinho: se um falhar, os outros continuam
// e o service worker ATIVA mesmo assim (o erro antigo era travar tudo aqui).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(FILES.map(url => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok && new URL(event.request.url).origin === location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
