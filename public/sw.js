const CACHE = "guiding-grace-v4";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  )
);

self.addEventListener("fetch", (e) => {
  // Only cache GET requests — POST/PUT/DELETE cannot be cached
  if (e.request.method !== "GET") return;

  // Don't cache API routes or Supabase calls
  const url = new URL(e.request.url);
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {};
  const title = data.title ?? "Guiding Grace 🙏";
  const body = data.body ?? "Your daily devotion is ready.";
  const url = data.url ?? "/today";
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
      tag: "daily-devotion",
      renotify: false,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/today";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
