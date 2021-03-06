const CACHE_NAME = 'AST-3';
const URLS_CACHE_ONLY = [
    "/fonts/montserrat-900.woff2",
    "/fonts/montserrat-400.woff2",
    "/img/icons/webclip192.png",
    "/img/icons/webclip256.png",
    "/img/icons/webclip512.png"
];

const URLS_OVER_NETWORK_WITH_CACHE_FALLBACK = [
    "/index.html",
    "/css/main.min.css",
    "/js/main.min.js"
];

self.addEventListener("install", function(event) { //We add a new listener that listens when we come in the install state of the service worker.
    event.waitUntil( //We have an event.waitUntil so the service worker waits until the promise given as its agrument is resolved to go to the next state.
        caches.open(CACHE_NAME).then(function(cache) { //We open the cache with caches.open
            return cache.addAll(URLS_CACHE_ONLY.concat(URLS_OVER_NETWORK_WITH_CACHE_FALLBACK)); //and when this is successful we cache all the URLs we have to cache with cache.addAll.
        }).catch((err) => { // error handling.
            console.error(err);
            return new Promise((resolve, reject) => {
                reject('ERROR: ' + err);
            });
        })
    );
});

self.addEventListener("fetch", function (event) {
    const requestURL = new URL(event.request.url);
    if (requestURL.pathname === '/') {
      event.respondWith(getByNetworkFallingBackByCache("/index.html")); // In the event listener of fetch we added a special case for index.html so we can serve this file over cache when the network is failing, so this page will become offline available
    } else if (URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.href) || URLS_OVER_NETWORK_WITH_CACHE_FALLBACK.includes(requestURL.pathname)) {
        event.respondWith(getByNetworkFallingBackByCache(event.request)); // not for index.html page
    } else if (URLS_CACHE_ONLY.includes(requestURL.href) || URLS_CACHE_ONLY.includes(requestURL.pathname)) {
        event.respondWith(getByCacheOnly(event.request));
    }
});

self.addEventListener("activate", function (event) { // When we reach this state the service worker is ready and will take control of the page.
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("AST")) {
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
    return caches.open(CACHE_NAME).then((cache) => { // will try to fetch the content over the network
        return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone()); // If it succeeds, we update the cache with the newest content
            return networkResponse;
        }).catch(() => { //If we are offline or the server, we will check if this content is inside the cache. When this is the case, we return the content from the cache
            console.log ('You are in offline mode. The data may be outdated.'); // and show a warning that the data may be outdated';
            return caches.match(request);
        });
    });
};

/**
 * Get content from cache
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

