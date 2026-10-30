const CACHE_NAME = 'blindspot-admin-v1';
const ASSETS = [
  './index.html',
  './admin_manifest.json',
  './icon_192.png',
  './icon-512.png'
];

// Install Service Worker & Cache Files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate & Clear Old Cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch from Cache (Offline Support)
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});

// --- PUSH NOTIFICATION LISTENER ---
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icon_192.png',
      badge: './icon_192.png',
      vibrate: [100, 50, 100]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
