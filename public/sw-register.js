// Service Worker registration script

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Setup periodic sync for offline data if available
        if ('periodicSync' in registration) {
          const status = navigator.onLine ? 'online' : 'offline';
          document.querySelector('body').setAttribute('data-connection', status);
          setupPeriodicSync(registration);
        }
        
        // Setup background sync for offline operations
        if ('sync' in registration) {
          setupBackgroundSync(registration);
        }
        
        // Setup push notifications
        if ('pushManager' in registration) {
          setupPushNotifications(registration);
        }
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
  
  // Listen for online/offline events
  window.addEventListener('online', function() {
    document.querySelector('body').setAttribute('data-connection', 'online');
    showConnectivityNotification('You are back online!', 'success');
    
    // Attempt to sync when coming back online
    navigator.serviceWorker.ready.then(function(registration) {
      if ('sync' in registration) {
        registration.sync.register('sync-tasks');
      }
    });
  });
  
  window.addEventListener('offline', function() {
    document.querySelector('body').setAttribute('data-connection', 'offline');
    showConnectivityNotification('You are offline. Some features may be limited.', 'warning');
  });
  
  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SYNC_COMPLETED') {
      showConnectivityNotification(event.data.message, 'success');
    }
  });
}

// Function to setup periodic sync (browser support is limited)
async function setupPeriodicSync(registration) {
  try {
    // Check if permission is granted
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    });
    
    if (status.state === 'granted') {
      await registration.periodicSync.register('sync-tasks', {
        minInterval: 24 * 60 * 60 * 1000, // 24 hours
      });
      console.log('Periodic sync registered');
    }
  } catch (error) {
    console.log('Periodic sync could not be registered: ', error);
  }
}

// Function to setup background sync
function setupBackgroundSync(registration) {
  console.log('Background sync capability detected');
  
  // We'll register sync when the user makes changes while offline
  // This is handled in the app code when operations fail due to being offline
}

// Function to setup push notifications (simplified)
async function setupPushNotifications(registration) {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted. Setting up push...');
      
      // This would typically involve subscribing to push notifications and
      // sending the subscription to your server
      // registration.pushManager.subscribe({...})
    }
  } catch (error) {
    console.log('Error setting up push notifications: ', error);
  }
}

// Display a notification about connectivity
function showConnectivityNotification(message, type) {
  // Check if notification container exists, create if not
  let container = document.getElementById('connectivity-notification');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'connectivity-notification';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(container);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.style.padding = '12px 20px';
  notification.style.margin = '8px 0';
  notification.style.borderRadius = '4px';
  notification.style.color = 'white';
  notification.style.fontSize = '14px';
  notification.style.fontWeight = '500';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  
  // Set color based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#10B981';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#F59E0B';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#EF4444';
  } else {
    notification.style.backgroundColor = '#6B7280';
  }
  
  notification.textContent = message;
  
  // Add to container
  container.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, 5000);
}

// Function to request permission for push notifications
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
}

// Request notification permission when the user is logged in
window.requestNotificationPermission = requestNotificationPermission; 