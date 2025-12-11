const CACHE_NAME = 'bico-certo-v1';
const STATIC_CACHE = 'bico-certo-static-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (url.origin !== location.origin) return;

    // Skip API requests (Supabase)
    if (url.pathname.includes('/rest/') || url.pathname.includes('/auth/')) return;

    event.respondWith(
        // Try network first
        fetch(request)
            .then((response) => {
                // Clone the response before caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/');
                    }

                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();

    const options = {
        body: data.body || 'Nova notificação do Bico Certo',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bico Certo', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Check if there's already a window open
            for (const client of clients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});
