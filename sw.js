const CACHE_NAME = 'blindspot-admin-v1';
const ASSETS = [
  './admin.html',
  './admin-manifest.json'
];

// 1. Install Service Worker & Cache Files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate & Clear Old Cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch from Cache (Offline Support)
self.addEventListener('fetch', (e) => {
  // Skip Supabase API calls (so Admin Panel always gets fresh live data)
  if (e.request.url.includes('supabase.co')) return;
  
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});