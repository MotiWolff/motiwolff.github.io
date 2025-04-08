const CACHE_NAME = 'portfolio-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Core assets that must exist
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.v2.css',
        '/404.html'
      ]).then(() => {
        // Only try to cache the JPG since we know it exists
        return Promise.allSettled([
          fetch('/assets/images/me.JPG')
            .then(response => {
              if (!response.ok) throw new Error('me.JPG not found');
              return cache.put('/assets/images/me.JPG', response);
            })
            .catch(() => console.log('me.JPG not available')),
          
          // Try video assets
          fetch('/assets/havlin-demo.mp4')
            .then(response => {
              if (!response.ok) throw new Error('Video not found');
              return cache.put('/assets/havlin-demo.mp4', response);
            })
            .catch(() => console.log('Main video not available')),
          
          fetch('/assets/images/havlin-poster.webp')
            .then(response => {
              if (!response.ok) throw new Error('Poster not found');
              return cache.put('/assets/images/havlin-poster.webp', response);
            })
            .catch(() => console.log('Poster not available'))
        ]);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for POST requests and chrome-extension schemes
  if (event.request.method === 'POST' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Only cache successful GET requests
            if (response.ok && event.request.method === 'GET') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // Handle failed requests with appropriate fallbacks
            const url = new URL(event.request.url);
            if (url.pathname.endsWith('me.webp')) {
              return caches.match('/assets/images/me.JPG')
                .catch(() => caches.match('/assets/images/placeholder.png'));
            }
            if (url.pathname.includes('-compressed.mp4')) {
              return caches.match(url.pathname.replace('-compressed', ''));
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/404.html');
            }
            return new Response('Resource not available', {
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            });
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