// Force unregister all service workers and clear all caches
if ('serviceWorker' in navigator) {
    // Unregister all service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });

    // Force the service worker to skip waiting and activate immediately
    navigator.serviceWorker.ready.then(registration => {
        registration.active.postMessage({type: 'SKIP_WAITING'});
    });

    // Clear all caches
    caches.keys().then(function(names) {
        for (let name of names) {
            caches.delete(name);
        }
    });

    // Reload the page after cleanup
    window.location.reload(true);
} 