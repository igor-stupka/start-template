// const CACHE_NAME = 'mysite-1';
// const URLS_CACHE_ONLY = [
//     "/fonts/montserrat-v13-cyrillic_latin-500.woff2",
//     "/fonts/montserrat-v13-cyrillic_latin-900.woff2",
//     "/img/icons/favicon.jpg",
//     "/img/icons/webclip.jpg"
// ];
//
// const URLS_OVER_NETWORK_WITH_CACHE_FALLBACK = [
//     "/index.html",
//     "/css/main.min.css",
//     "/js/main.min.js"
// ];
//
// self.addEventListener("install", function(event) { //We add a new listener that listens when we come in the install state of the service worker.
//     event.waitUntil( //We have an event.waitUntil so the service worker waits until the promise given as its agrument is resolved to go to the next state.
//         caches.open(CACHE_NAME).then(function(cache) { //We open the cache with caches.open
//             return cache.addAll(URLS_CACHE_ONLY.concat(URLS_OVER_NETWORK_WITH_CACHE_FALLBACK)); //and when this is successful we cache all the URLs we have to cache with cache.addAll.
//         }).catch((err) => { // error handling.
//             console.error(err);
//             return new Promise((resolve, reject) => {
//                 reject('ERROR: ' + err);
//             });
//         })
//     );
// });
//
// self.addEventListener("fetch", function (event) {
//     const requestURL = new URL(event.request.url);
//     if (requestURL.pathname === '/') {
//       event.respondWith(getByNetworkFallingBackByCache("/index.html")); // In the event listener of fetch we added a special case for index.html so we can serve this file over cache when the network is failing, so this page will become offline available
//     } else if (URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.href) || URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.pathname)) {
//         event.respondWith(getByNetworkFallingBackByCache(event.request)); // not for index.html page
//     } else if (URLS_CACHE_ONLY.includes(requestURL.href) || URLS_CACHE_ONLY.includes(requestURL.pathname)) {
//         event.respondWith(getByCacheOnly(event.request));
//     }
// });
//
// self.addEventListener("activate", function (event) { // When we reach this state the service worker is ready and will take control of the page.
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function (cacheName) {
//                     if (CACHE_NAME !== cacheName && cacheName.startsWith("mysite")) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });
//
// /**
//  * 1. We fetch the request over the network
//  * 2. If successful we add the new response to the cache
//  * 3. If failed we return the result from the cache
//  *
//  * @param request
//  * @returns Promise
//  */
// const getByNetworkFallingBackByCache = (request) => {
//     return caches.open(CACHE_NAME).then((cache) => { // will try to fetch the content over the network
//         return fetch(request).then((networkResponse) => {
//             cache.put(request, networkResponse.clone()); // If it succeeds, we update the cache with the newest content
//             return networkResponse;
//         }).catch(() => { //If we are offline or the server, we will check if this content is inside the cache. When this is the case, we return the content from the cache
//
//             let str = 'You are in offline mode. The data may be outdated.';
//             let style = ['padding: 1rem;',
//                 'background: linear-gradient( gold, orangered);',
//                 'text-shadow: 0 2px orangered;',
//                 'font: 1.3rem/3 Georgia;',
//                 'color: white;'].join('');
//
//             console.log ( '%c%s', style, str ); // and show a warning that the data may be outdated';
//             return caches.match(request);
//         });
//     });
// };
//
// /**
//  * Get content from cache
//  *
//  * @param request
//  * @returns Promise
//  */
// const getByCacheOnly = (request) => {
//     return caches.open(CACHE_NAME).then((cache) => {
//         return cache.match(request).then((response) => {
//             return response;
//         });
//     });
// };

const CACHE_NAME = 'WNDW-1';
const URLS_CACHE_ONLY = [
    "/fonts/montserrat-v13-cyrillic_latin-500.woff2",
    "/fonts/montserrat-v13-cyrillic_latin-900.woff2",
    "/img/icons/favicon.jpg",
    "/img/icons/webclip.jpg"
];
const URLS_OVER_NETWORK_WITH_CACHE_FALLBACK = [
   "/index.html",
   "/css/main.min.css",
   "/js/main.min.js"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(URLS_CACHE_ONLY.concat(URLS_OVER_NETWORK_WITH_CACHE_FALLBACK));
        }).catch((err) => {
            // console.error(err);
            return new Promise((resolve, reject) => {
                reject('ERROR: ' + err);
            });
        })
    );
});

self.addEventListener("fetch", function (event) {
    const requestURL = new URL(event.request.url);
    if (requestURL.pathname === '/') {
        event.respondWith(getByNetworkFallingBackByCache("/index.html"));
    } else if (URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.href) || URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.pathname)) {
        event.respondWith(getByNetworkFallingBackByCache(event.request));
    } else if (URLS_CACHE_ONLY.includes(requestURL.href) || URLS_CACHE_ONLY.includes(requestURL.pathname)) {
        event.respondWith(getByCacheOnly(event.request));
    }
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("WNDW")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * 1. We fetch the request over the network
 * 2. If successful we add the new response to the cache
 * 3. If failed we return the result from the cache
 *
 * @param request
 * @returns Promise
 */
const getByNetworkFallingBackByCache = (request) => {
    return caches.open(CACHE_NAME).then((cache) => {
        return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }).catch(() => {
            console.log('You are in offline mode. The data may be outdated.')
            return caches.match(request);
        });
    });
};

/**
 * Get from cache
 *
 * @param request
 * @returns Promise
 */
const getByCacheOnly = (request) => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
            return response;
        });
    });
};