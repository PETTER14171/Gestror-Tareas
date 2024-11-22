self.addEventListener('push', function(event) {
    const data = event.data.json(); // Recibe datos del servidor o cliente
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || 'img/icon.jpg',
        data: data.url // URL a la que redirigir al hacer clic
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Cierra la notificación
    if (event.notification.data) {
        clients.openWindow(event.notification.data); // Abre la URL proporcionada
    }
});
