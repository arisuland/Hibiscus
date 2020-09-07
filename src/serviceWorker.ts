/**
 * Copyright (c) 2020 August
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

interface Configuration {
  onSuccess?(registration: ServiceWorkerRegistration): void;
  onUpdate?(registration: ServiceWorkerRegistration): void;
}

export function register(config?: Configuration) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUri = new URL(process.env.PUBLIC_URL!, window.location.href);

    if (publicUri.origin !== window.location.origin) return;
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        check(swUrl, config);
        navigator.serviceWorker.ready.then(() => 
          console.log('[Monori] Application is being served cache-first by a service worker. Learn here for more information: https://bit.ly/CRA-PWA')
        );
      } else {
        registerWorker(swUrl, config);
      }
    });
  }
}

function registerWorker(swUrl: string, config?: Configuration) {
  navigator
    .serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const worker = registration.installing;

        if (worker === null) return;
        worker.onstatechange = () => {
          if (navigator.serviceWorker.controller) {
            console.log('[Monori] New content is available and will be used when all tabs for this page are closed, see https://bit.ly/CRA-PW');
            if (config && config.onUpdate) config.onUpdate(registration);
          } else {
            console.log('[Monori] Content is now cached for offline usage.');
            if (config && config.onSuccess) config.onSuccess(registration);
          }
        };
      };
    }).catch(error => console.error('[Monori] Unable to register service worker', error));
}

function check(swUrl: string, config?: Configuration) {
  fetch(swUrl, { 
    headers: {
      'Service-Worker': 'script'
    }
  }).then((res) => {
    const ct = res.headers.get('content-type');
    if (res.status === 404 || (ct != null && ct.indexOf('javascript') === -1)) { // eslint-disable-line eqeqeq
      navigator.serviceWorker.ready.then(registration =>
        registration.unregister().then(() => window.location.reload())
      );
    } else {
      registerWorker(swUrl, config);
    }
  }).catch(error => 
    console.error('[Monori] Unable to establish internet connection, running in offline mode.')  
  );
}
