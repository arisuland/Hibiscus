import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready: () => console.log('[Monori] Application is being served from cache by a service worker -- for more details, visit https://goo.gl/AFskqB'),
    registered: () => console.log('[Monori] Service worker has been registered'),
    cached: () => console.log('[Monori] Content has been cached for offline use'),
    updatefound: () => console.log('[Monori] New content is downloading...'),
    offline: () => console.log('[Monori] No connection was found, running in offline mode.'),
    updated: () => console.log('[Monori] New content is avaliable; please refresh.'),
    error: (error) => console.error('[Monori] Unexpected error has occured during service worker registration:', error)
  });
}
