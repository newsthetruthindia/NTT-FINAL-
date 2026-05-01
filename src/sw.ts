import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { defaultCache } from "@serwist/next/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// Handle push events from OneSignal
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data: { title?: string; body?: string; url?: string; icon?: string } = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "NTT News", body: event.data.text() };
  }

  const options: NotificationOptions = {
    body: data.body || "Read the latest news from NTT.",
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    tag: "ntt-news",
    renotify: true,
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "🔴 NTT Breaking News", options)
  );
});

// Handle notification clicks — open the article
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url === targetUrl && "focus" in c);
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    })
  );
});

serwist.addEventListeners();
