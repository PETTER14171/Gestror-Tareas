self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Notificación de Tarea";
    const options = {
        body: data.body || "Tienes una nueva tarea pendiente.",
        icon: data.icon || "img/icon.jpg",
        badge: data.badge || "img/badge.png",
        data: data.url || "/"
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
