self.addEventListener("notificationclick", event => {
    event.notification.close(); 

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
            const url = event.notification.data; 
            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus(); 
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url); 
            }
        })
    );
});
