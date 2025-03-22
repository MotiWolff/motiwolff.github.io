const CACHE_NAME = 'portfolio-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache core assets, but don't fail if some are missing
      return Promise.allSettled([
        cache.add('/'),
        cache.add('/index.html'),
        cache.add('/styles.v2.css')
      ]).then(() => {
        // Then try to cache media files individually
        return Promise.allSettled([
          cache.add('/assets/images/me.webp').catch(() => console.log('Failed to cache me.webp')),
          cache.add('/assets/images/me.JPG').catch(() => console.log('Failed to cache me.JPG')),
          cache.add('/assets/images/havlin-poster.webp').catch(() => console.log('Failed to cache havlin-poster.webp')),
          cache.add('/assets/havlin-demo-compressed.mp4').catch(() => console.log('Failed to cache compressed video')),
          cache.add('/assets/havlin-demo.mp4').catch(() => console.log('Failed to cache video'))
        ]);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(() => {
          // Return fallback images/videos for failed requests
          if (event.request.url.endsWith('me.webp')) {
            return caches.match('/assets/images/me.JPG');
          }
          if (event.request.url.includes('-compressed.mp4')) {
            return caches.match(event.request.url.replace('-compressed', ''));
          }
          return caches.match('/assets/images/placeholder.png');
        });
      })
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

// Handle service worker updates
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});