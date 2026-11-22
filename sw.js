// CONQUISTADOR DE WAIFU'S - service worker (torna o jogo instalável como app)
const CACHE = 'conquistador-v101';
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
  const url = new URL(event.request.url);
  const isPage = event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('/');
  // V86: pagina sempre tenta a REDE primeiro. So usa o cache se estiver sem internet.
  // Antes era cache-first: o app entregava a versao velha antes de olhar a internet,
  // e a correcao parecia nao ter aplicado. O resto (icones, manifest) continua cache-first.
  if (isPage) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.ok && url.origin === location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }
  // V87: os 3 recursos do mundo (tileset, personagem, mapa) vivem em hosts externos
  // (jsDelivr / raw.githubusercontent) e o SW nunca os cacheava. Agora qualquer
  // resposta GET ok e cacheada, de qualquer origem: depois de um carregamento bom,
  // o mundo abre mesmo que esses repos caiam. Erro de rede num recurso NAO devolve
  // mais o index.html (isso fazia o Phaser tentar ler HTML como imagem).
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request));
    })
  );
});
