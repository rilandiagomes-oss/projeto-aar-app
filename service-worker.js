const CACHE_NAME = "aar-app-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./animais-transmissores-raiva.html",
  "./assets/style.css",
  "./assets/script.js",
  "./assets/ConditionalContent.js",
  "./assets/PopupTrigger.js",
  "./assets/PopupButton.js",
  "./assets/PopupModal.js",
  "./assets/RandomMovImage.js",
  "./assets/AutoOpenPopupModal.js",
  "./assets/img/morcego.png"
];

// Instalação
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação e limpeza de cache antigo
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação das requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
