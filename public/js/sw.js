const cacheElement = "v1"
const offlineCache = [
    "index.html", "joueur.html", "equipe.html", "stat.html", "actualite.html",
    "js/classement.js", "js/script.js", "jsc/src.js",
    "css/style.css",
    "data/actu.json", "data/competition.json", "data/equipe.json", "data/game.json", "data/groupe.json"

]

self.addEventListener('install', function (e) {
    console.log("installed")
    e.waitUntil(
        caches.open(cacheElement)
            .then(cache => {
                cache.addAll(offlineCache)
            }
            ).then(() => self.skipWaiting)
    )
})

self.addEventListener('activate', function (e) {
    console.log("actived")
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(
                    cache => {
                        if (cache !== cacheElement) {
                            console.log('service worker :clearing')
                            return caches.delete(cache)
                        }
                    }
                )
            )
        })
    )
})

self.addEventListener('fetch', function (e) {
    console.log("fetched")
    e.respondWith(
        fetch(e.request).catch((error) => caches.match(e.request))
    )

})