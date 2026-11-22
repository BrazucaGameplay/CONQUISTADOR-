// CONQUISTADOR DE WAIFU'S - service worker do ARQUIVO DE TESTE (V115)
// Mesma lógica do sw.js, mas com cache próprio e servindo index-V115.html.
// O teste nunca toca no cache do jogo real.
const CACHE = 'conquistador-v115-teste';
const FILES = [
  './index-V115.html',
  './manifest-V115.json',
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
      }).catch(() => caches.match('./index-V115.html'));
    })
  );
});
