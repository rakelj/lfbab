// Service worker template. vite.config.js fills in the cache name and the
// list of files at build time and writes it to dist/sw.js.
//
// - Everything the app needs is saved on install, so it works offline.
// - The page itself is fetched from the network first, so a new version shows
//   up the next time the app is opened; the saved copy is used when offline.
// - A new version takes over at once and the old saved files are deleted.
// Nothing about the user is stored here; it is only the app's own files.
const CACHE = __CACHE__
const FILES = __FILES__

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('./', copy))
          return response
        })
        .catch(() => caches.match('./')),
    )
    return
  }
  event.respondWith(caches.match(request, { ignoreSearch: true }).then((hit) => hit || fetch(request)))
})
