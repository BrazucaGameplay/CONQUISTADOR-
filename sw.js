// CONQUISTADOR DE WAIFU'S - service worker V145
// V145: cache novo (v145) — limpa o cache v137/v144 e força baixar as artes
// novas de slime/macaco/rato (mesmos caminhos, sprites novos) + os 33 frames
// dos monstros e os 7 retratos das waifus novas.
// HTML/SW = network-first, assets locais = cache-first,
// URLs externas = rede direta, sem SW.
const CACHE = 'conquistador-v145';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/monsters/slime.png',
  './assets/monsters/monkey.png',
  './assets/monsters/rat.png',
  './assets/monsters/snake.png',
  './assets/monsters/wolf.png',
  './assets/monsters/eagle.png',
  './assets/monsters/spider.png',
  './assets/monsters/bear.png',
  './assets/monsters/goblin.png',
  './assets/monsters/orc.png',
  './assets/monsters/ogre.png',
  './assets/monsters/slime_walk.png',
  './assets/monsters/slime_attack.png',
  './assets/monsters/slime_death.png',
  './assets/monsters/monkey_walk.png',
  './assets/monsters/monkey_attack.png',
  './assets/monsters/monkey_death.png',
  './assets/monsters/rat_walk.png',
  './assets/monsters/rat_attack.png',
  './assets/monsters/rat_death.png',
  './assets/monsters/snake_walk.png',
  './assets/monsters/snake_attack.png',
  './assets/monsters/snake_death.png',
  './assets/monsters/wolf_walk.png',
  './assets/monsters/wolf_attack.png',
  './assets/monsters/wolf_death.png',
  './assets/monsters/eagle_walk.png',
  './assets/monsters/eagle_attack.png',
  './assets/monsters/eagle_death.png',
  './assets/monsters/spider_walk.png',
  './assets/monsters/spider_attack.png',
  './assets/monsters/spider_death.png',
  './assets/monsters/bear_walk.png',
  './assets/monsters/bear_attack.png',
  './assets/monsters/bear_death.png',
  './assets/monsters/goblin_walk.png',
  './assets/monsters/goblin_attack.png',
  './assets/monsters/goblin_death.png',
  './assets/monsters/orc_walk.png',
  './assets/monsters/orc_attack.png',
  './assets/monsters/orc_death.png',
  './assets/monsters/ogre_walk.png',
  './assets/monsters/ogre_attack.png',
  './assets/monsters/ogre_death.png',
  './assets/waifu/slime.jpg',
  './assets/waifu/monkey.jpg',
  './assets/waifu/rat.jpg',
  './assets/waifus/goblin.png',
  './assets/waifus/lamia.png',
  './assets/waifus/loba.png',
  './assets/waifus/harpia.png',
  './assets/waifus/orc.png',
  './assets/waifus/orc_carmesim.png',
  './assets/waifus/orc_palida.png',
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
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  const isHTML = url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('sw.js');
  if (isHTML) {
    event.respondWith(fetch(event.request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
      return response;
    });
  }));
});
