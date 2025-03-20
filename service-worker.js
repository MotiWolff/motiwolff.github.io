const CACHE_NAME = 'portfolio-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.v2.css'
      ]).catch(error => {
        console.error('Cache addAll error:', error);
        // Continue with installation even if caching fails
        return Promise.resolve();
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
          // Return fallback content or handle error
          if (event.request.mode === 'navigate') {
            return caches.match('/404.html');
          }
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
}); 