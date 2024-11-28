self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
            const url = new URL(event.notification.data); 
            for (const client of clientList) {
                const clientUrl = new URL(client.url);
                if (clientUrl.origin === url.origin && clientUrl.pathname === url.pathname) {
                    if ("focus" in client) {
                        return client.focus();
                    }
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data);
            }
        })
    );
});