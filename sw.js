var cacheName = 'loan-pwa';//I will need to change this name
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/android-launchericon-512-512.png',
  '/images/android-launchericon-192-192.png',
  '/images/firefox-general-32-32.png',
  '/images/firefox-general-128-128.png'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});