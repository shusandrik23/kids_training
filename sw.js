/*
 * Service worker «Сладкой Учёбы»: игра работает без интернета.
 *
 * ВАЖНО: после ЛЮБОГО изменения файлов игры (index.html, app.js, words.js, иконки)
 * увеличьте VERSION. Браузер увидит, что sw.js изменился, скачает всё заново,
 * а старый кэш удалит — так обновление дойдёт до всех телефонов.
 */
const VERSION = '2.0.2';
const CACHE = 'sladkaya-ucheba-' + VERSION;
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './words.js',
    './manifest.json',
    './icons/icon.svg',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(k => k.startsWith('sladkaya-ucheba-') && k !== CACHE)
                .map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    // Страница: из кэша; если её там нет — из сети.
    if (req.mode === 'navigate') {
        event.respondWith(
            caches.match('./index.html').then(cached => cached || fetch(req))
        );
        return;
    }
    // Остальные файлы: сначала кэш, иначе сеть (и положить в кэш).
    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then(cached => cached || fetch(req).then(resp => {
            if (resp && resp.ok) {
                const copy = resp.clone();
                caches.open(CACHE).then(cache => cache.put(req, copy));
            }
            return resp;
        }))
    );
});
