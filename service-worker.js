const CACHE_NAME="webbrainx-memory-engine-v1";
const ASSETS=["./","./index.html","./manifest.json","./icons/icon-72.png","./icons/icon-96.png","./icons/icon-128.png","./icons/icon-144.png","./icons/icon-152.png","./icons/icon-192.png","./icons/icon-384.png","./icons/icon-512.png","./screenshots/mobile.png","./screenshots/desktop.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy)).catch(()=>{});return r}).catch(()=>caches.match("./index.html"))))});
