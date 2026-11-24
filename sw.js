'use strict';
const CACHE_NAME = 'conquistador-v147-split-v1';
const PRECACHE_URLS = [
  'index.html',
  'sw.js',
  'js/data/monsters.js',
  'js/data/waifus.js',
  'js/data/assets.js',
  'js/engine.js',
  'js/systems/status.js',
  'js/systems/level.js',
  'js/systems/save.js',
  'js/systems/monster.js',
  'js/systems/inventory.js',
  'js/systems/bestiary.js',
  'js/systems/waifu.js',
  'js/systems/waifu-gallery.js',
  'js/systems/waifu-drop.js',
  'js/core.js',
  'js/config.js',
  'js/scenes/dungeon.js',
  'js/scenes/world.js',
  'js/main.js',
  'js/diagnostics.js',
  'js/boot.js',
  'js/watchdog.js',
  'js/pwa.js'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of PRECACHE_URLS) {
      try { await cache.add(url); } catch (error) { /* best-effort: o jogo carrega o resto pela rede */ }
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (request.mode === 'navigate') {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (error) {
        return cached || Promise.reject(error);
      }
    }
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.status === 200 && fresh.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone());
      }
      return fresh;
    } catch (error) {
      return cached || Promise.reject(error);
    }
  })());
});
