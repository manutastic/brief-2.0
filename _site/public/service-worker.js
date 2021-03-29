importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('airhorner').then(function(cache) {
     return cache.addAll([
       '/',
       '../views/index.js',
       '/main.js',
       '/main.min.css',
       '/icon.png',
       '/manifest.json',
       '../data/companydesc.json',
       '../data/jobdesc.json',
       '../data/name_word_bank.json',
       '../data/nouns.json'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {

    console.log(event.request.url);
    
    event.respondWith(
    
    caches.match(event.request).then(function(response) {
    
    return response || fetch(event.request);
    
    })
    
    );
    
    });