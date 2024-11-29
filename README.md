# Gestor de Tareas con Recordatorios y Modo Oscuro

¡Bienvenido al Gestor de Tareas! Esta aplicación web te permite organizar tus tareas con prioridades, categorías, recordatorios personalizados y progresos visibles. Además, incluye un modo oscuro para una experiencia más cómoda.

---

## 🌟 **Cómo usar la aplicación**

### **1. Agregar una tarea**
1. Completa los campos:
   - **Título**: Nombre de la tarea (obligatorio).
   - **Descripción**: Detalles adicionales (opcional).
   - **Prioridad**: Selecciona entre Alta, Media o Baja.
   - **Categoría**: Trabajo, Personal u Otros.
   - **Hora del recordatorio**: Define una hora para recibir una notificación (opcional).
   - **Mensaje del recordatorio**: Personaliza el texto de la notificación (opcional).
2. Haz clic en **"Agregar Tarea"**. Aparecerá en la columna correspondiente a su prioridad.

### **2. Editar una tarea**
- Haz clic en el botón **Editar** en la tarjeta de la tarea.
- Cambia los datos que necesites, incluidos el recordatorio y su mensaje.
- Guarda los cambios haciendo clic en **"Guardar Cambios"**.

### **3. Completar una tarea**
- Marca la tarea como completada desde su estado o al alcanzar el 100% del progreso. ¡Recibirás una notificación de felicitación!

### **4. Eliminar una tarea**
- Presiona el botón **Eliminar** en la tarjeta de la tarea.
- Confirma la acción en el cuadro de diálogo para borrarla definitivamente.

### **5. Cambiar el tema**
- Activa o desactiva el modo oscuro usando el interruptor en la esquina superior derecha. Este cambio se guardará automáticamente.

---

## 🛠️ **Desarrollo del código**

El proyecto utiliza tecnologías web modernas: **HTML**, **CSS** y **JavaScript**. Se enfoca en la persistencia de datos mediante `localStorage` y la interacción del usuario con notificaciones.

### **Funciones principales del código**

#### 1. **Persistencia de datos con `localStorage`**
```javascript
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

- Guarda las tareas creadas por el usuario en el navegador.
-Recupera los datos al cargar la página:

```javascript
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

### **2. Notificaciones personalizadas**
Las notificaciones de recordatorio se implementan con la API de Notificaciones de JavaScript:

```javascript
function sendTaskNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('Recordatorio de Tarea', {
            body: task.reminderMessage || `Tarea pendiente: ${task.title}`,
            icon: 'img/icon.jpg'
        });
    }
}

-Requiere permisos: Se solicita permiso al cargar la página.
-Programación de recordatorios: Se usa setTimeout para programar notificaciones en el momento exacto definido por el usuario:

```javascript
function scheduleTaskReminder(task) {
    const reminderDate = new Date(/* parámetros de hora del recordatorio */);
    setTimeout(() => sendTaskNotification(task), reminderDate - Date.now());
}

### **3. Interfaz dinámica**
Las tareas se renderizan dinámicamente según su prioridad:

```javascript
function renderTasks() {
    tasks.forEach(task => renderTask(task));
}

Cada tarea es un objeto con propiedades como:
-title, description, priority, tag, progress, reminderTime, etc.

### **4. Interacción con el usuario**
-SweetAlert2: Mejora la interacción con mensajes visuales, como la confirmación al agregar o eliminar tareas:

```javascript
Swal.fire({
    title: "Tarea Agregada",
    text: "La tarea se agregó con éxito.",
    icon: "success"
});


### **5. Modo Oscuro**
El modo oscuro se implementa con un toggle que actualiza los estilos y guarda la preferencia en localStorage:

```javascript
function toggleTheme() {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

## 🚀 **Desarrollo y aprendizaje**

El desarrollo de esta aplicación incluyó:

-Diseño de UI: Creación de una interfaz intuitiva y responsiva.
-Persistencia: Uso de localStorage para mantener los datos después de cerrar el navegador.
-Notificaciones: Implementación de recordatorios con la API de Notificaciones.
-Optimización: Debugging y corrección de errores para asegurar la funcionalidad en diferentes navegadores y dispositivos.
-Colaboración en GitHub: Uso de control de versiones y despliegue en GitHub Pages.
-Gracias por explorar este proyecto. Si tienes sugerencias o encuentras errores, no dudes en abrir un issue en el repositorio. 🎉




                                                      <footer>
                                                      <p>&copy; 2024 Gestor de Tareas. Todos los derechos reservados.</p>
                                                      </footer>

