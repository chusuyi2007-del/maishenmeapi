const CACHE_NAME = 'maishenme-v1';
const STATIC_ASSETS = ['/'];

// Install — cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', e => {
  // Don't intercept API calls or Unsplash
  const url = new URL(e.request.url);
  if (url.hostname.includes('railway.app') ||
      url.hostname.includes('anthropic.com') ||
      url.hostname.includes('unsplash.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || '买什么', {
      body: data.body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: data.tag || 'maishenme',
      data: { url: data.url || '/' }
    })
  );
});

// Notification click — open app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(wins => {
      const win = wins.find(w => w.focused);
      if (win) return win.focus();
      return clients.openWindow(e.notification.data?.url || '/');
    })
  );
});

// Background sync — check expiry dates daily
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-expiry') {
    e.waitUntil(checkExpiryInBackground());
  }
});

async function checkExpiryInBackground() {
  // Read inventory from storage and fire notification if anything expiring
  // This runs even when app is closed (requires Periodic Background Sync permission)
  const clients_list = await clients.matchAll();
  if (clients_list.length > 0) return; // App is open, skip
  
  // Post message to any open client to trigger expiry check
  clients_list.forEach(client => client.postMessage({ type: 'CHECK_EXPIRY' }));
}
