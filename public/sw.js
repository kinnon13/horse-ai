const CACHE_NAME = 'horsegpt-v1'
const urlsToCache = [
  '/',
  '/chat',
  '/dashboard',
  '/pricing',
  '/provider-login',
  '/producer-portal',
  '/athlete-portal',
  '/stallion-portal',
  '/horse-portal',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/horsegpt-logo-transparent.png',
  '/horsegpt-logo-with-bg.png'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache install failed:', error)
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone()
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Clone the response because it's a stream
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        }).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/offline.html')
          }
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync any pending messages or data when back online
    const pendingData = await getPendingData()
    if (pendingData.length > 0) {
      await syncPendingData(pendingData)
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

async function getPendingData() {
  // Get any data that was stored while offline
  return new Promise((resolve) => {
    const request = indexedDB.open('HorseGPTOffline', 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingMessages'], 'readonly')
      const store = transaction.objectStore('pendingMessages')
      const getAllRequest = store.getAll()
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }
    }
  })
}

async function syncPendingData(pendingData) {
  // Send pending data to server
  for (const data of pendingData) {
    try {
      await fetch('/api/sync-offline-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      // Remove from offline storage after successful sync
      await removePendingData(data.id)
    } catch (error) {
      console.error('Failed to sync data:', error)
    }
  }
}

async function removePendingData(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('HorseGPTOffline', 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingMessages'], 'readwrite')
      const store = transaction.objectStore('pendingMessages')
      store.delete(id)
      resolve()
    }
  })
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from HorseGPT',
    icon: '/horsegpt-logo-transparent.png',
    badge: '/horsegpt-logo-transparent.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open HorseGPT',
        icon: '/horsegpt-logo-transparent.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/horsegpt-logo-transparent.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('HorseGPT', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/chat')
    )
  }
})

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})


