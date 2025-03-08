// Service Worker for ProjectPulse
const CACHE_NAME = 'projectpulse-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients so the service worker is in control immediately
  self.clients.claim();
});

// Helper function to determine if a request is for an API
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for an HTML page
const isHTMLPageRequest = (url) => {
  return (
    !url.pathname.includes('.') || 
    url.pathname.endsWith('.html') || 
    url.pathname.endsWith('/')
  );
};

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // For API requests, use network first, then cache
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the successful API response
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For HTML page requests, use network first with a fallback to a cached app shell
  if (isHTMLPageRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails and this is a navigation request,
          // serve the cached index page as a fallback
          return caches.match('/');
        })
    );
    return;
  }

  // For all other requests, use cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        // Make network request
        return fetch(fetchRequest)
          .then((response) => {
            // Check for valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            // Cache the new resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch error:', error);
            // If fetch fails, try to return the offline page
            if (isHTMLPageRequest(url)) {
              return caches.match('/');
            }
            return new Response('Network error', { status: 408, statusText: 'Offline' });
          });
      })
  );
});

// Listen for sync events for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Process offline task operations
async function syncTasks() {
  try {
    // Get the offline queue from indexedDB
    const offlineQueue = await getOfflineQueue();
    
    // Process each operation
    for (const operation of offlineQueue) {
      await sendToServer(operation);
    }
    
    // Clear the offline queue
    await clearOfflineQueue();
    
    // Notify the clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          message: 'Your changes have been synchronized'
        });
      });
    });
  } catch (error) {
    console.error('Error syncing tasks:', error);
  }
}

// Simulated function to get offline queue (in a real app, this would use IndexedDB)
async function getOfflineQueue() {
  // This is a placeholder - in a real app, this would retrieve from IndexedDB
  return [];
}

// Simulated function to clear offline queue
async function clearOfflineQueue() {
  // This is a placeholder - in a real app, this would clear IndexedDB
  return true;
}

// Send operation to server
async function sendToServer(operation) {
  // This is a placeholder - in a real app, this would send the operation to the server
  console.log('Syncing operation:', operation);
  return true;
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-128x128.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('Service Worker Loaded'); 