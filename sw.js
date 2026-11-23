// CONQUISTADOR DE WAIFU'S - service worker V135
const CACHE = 'conquistador-v135';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/monsters/slime.png',
  './assets/monsters/monkey.png',
  './assets/monsters/rat.png',
  './assets/waifu/slime.jpg',
  './assets/waifu/monkey.jpg',
  './assets/waifu/rat.jpg',
  './assets/boss/art.jpg',
  './assets/boss/sprite.png',
  './assets/world/mountain.png',
  './assets/trees/pine.png',
  './assets/world/ice-peak.png',
  './assets/trees/frozen.png',
  './assets/ground/snow-1.png',
  './assets/ground/snow-2.png',
  './assets/ground/snow-3.png',
  './assets/ground/mountain-1.png',
  './assets/ground/mountain-2.png',
  './assets/ground/mountain-3.png',
  './assets/world/ruin.png',
  './assets/ground/grass-1.jpg',
  './assets/ground/grass-2.jpg',
  './assets/ground/tallgrass-1.jpg',
  './assets/ground/tallgrass-2.jpg',
  './assets/ground/dirt.jpg',
  './assets/ground/stone.jpg',
  './assets/ground/water.jpg',
  './assets/trees/leaf.png',
  './assets/trees/pine-big.png',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(FILES.map(url => cache.add(url).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response && response.ok && new URL(event.request.url).origin === location.origin) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
