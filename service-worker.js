const CACHE_NAME = 'portfolio-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache what we can, ignore failures
      return Promise.allSettled([
        cache.add('/'),
        cache.add('/index.html'),
        cache.add('/styles.v2.css'),
        // Try each asset individually
        cache.add('/assets/images/me.webp').catch(() => console.log('Failed to cache me.webp')),
        cache.add('/assets/images/havlin-poster.webp').catch(() => console.log('Failed to cache havlin-poster.webp')),
        cache.add('/assets/havlin-demo-compressed.mp4').catch(() => console.log('Failed to cache video'))
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/404.html');
        }
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});