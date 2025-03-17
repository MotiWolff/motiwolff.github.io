const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
    '/',
    '/styles.v2.css',
    '/assets/images/me.JPG',
    // Add other important assets
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 