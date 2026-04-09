const CACHE_NAME = "aar-app-v1";

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

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
