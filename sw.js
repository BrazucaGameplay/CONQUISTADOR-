// CONQUISTADOR DE WAIFU'S - service worker V141
// V140 FIX do carregamento infinito (mantido na V141): antes era cache-first para TUDO.
// O navegador continuava servindo o index.html velho do cache e o SW
// devolvia index.html no lugar do JSON do mapa-base externo.
// Agora: HTML/SW = network-first, assets locais = cache-first,
// URLs externas (jsDelivr / raw.githubusercontent) = rede direta, sem SW.
const CACHE = 'conquistador-v141';
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
  './data/monsters.json',
  './data/waifus.json',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(FILES.map(url => cache.add(url).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Externo: nao intercepta — deixa o fetch normal (com timeout no jogo).
  // Antes o SW devolvia index.html no lugar do JSON e o preload travava.
  if (url.origin !== location.origin) return;
  // HTML / SW: network-first — senao o navegador nunca ve a versao nova.
  const isHTML = url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('sw.js');
  if (isHTML) {
    event.respondWith(fetch(event.request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html'))));
    return;
  }
  // Assets locais: cache-first.
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
