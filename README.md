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

El proyecto utiliza tecnologías web basicas: **HTML**, **CSS** y **JavaScript**. Se enfoca en la persistencia de datos mediante `localStorage` y la interacción del usuario con notificaciones.

### **Funciones principales del código**

#### 1. **Persistencia de datos con `localStorage`**
```javascript
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

- Guarda las tareas creadas por el usuario en el navegador.
-Recupera los datos al cargar la página:

```javascript
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
```

### **2. Notificaciones personalizadas**
Las notificaciones de recordatorio se implementan con la API de Notificaciones de JavaScript:

```javascript
function sendTaskNotification(task) {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(`Recordatorio: ${task.title}`, {
                body: task.reminderMessage || "No olvides completar esta tarea.",
                icon: "img/icon.jpg", 
                data: "https://gestor-tareas.cryptoguardstudio.com/",
                vibrate: [200, 100, 200],
                actions: [{ action: "view", title: "Ver tarea" }]
            });
        });
    } else {
        console.warn("Permiso de notificación no concedido.");
    }
}

```

### **3. Interfaz dinámica**
Las tareas se renderizan dinámicamente según su prioridad:

```javascript
function renderTasks(filter = "all") {
document.getElementById("column-alta").innerHTML = "<h2>Prioridad Alta</h2>";
document.getElementById("column-media").innerHTML = "<h2>Prioridad Media</h2>";
document.getElementById("column-baja").innerHTML = "<h2>Prioridad Baja</h2>";

tasks.filter(task => filter === "all" || task.tag === filter).forEach(task => renderTask(task));
}

function renderTask(task) {
let taskItem = document.getElementById(`task-${task.id}`);
if (!taskItem) {
  taskItem = document.createElement("div");
  taskItem.id = `task-${task.id}`;
  taskItem.classList.add("task-item", `priority-${task.priority}`);
  
  taskItem.setAttribute("draggable", true);
  taskItem.addEventListener("dragstart", (e) => onDragStart(e, task));
  taskItem.addEventListener("dragover", (e) => onDragOver(e));
  taskItem.addEventListener("drop", (e) => onDrop(e, task));
}
```

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
```

### **5. Modo Oscuro**
El modo oscuro se implementa con un toggle que actualiza los estilos y guarda la preferencia en localStorage:

```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}
```

### **6. Agregar tarea**

```javascript
function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskDesc = document.getElementById("task-desc");
    const prioritySelect = document.getElementById("priority-select");
    const tagSelect = document.getElementById("tag-select");
    const reminderTimeInput = document.getElementById("reminder-time");
    const reminderMessageInput = document.getElementById("reminder-message");

    if (taskInput.value === "") {
        Swal.fire({
            title: "Error",
            text: "El título de la tarea es obligatorio.",
            icon: "error"
        });
        return;
    }

    const task = {
        id: Date.now(),
        title: taskInput.value,
        description: taskDesc.value || "Sin descripción",
        priority: prioritySelect.value,
        tag: tagSelect.value,
        completed: false,
        progress: 0,
        reminderTime: reminderTimeInput.value || null,
        reminderMessage: reminderMessageInput.value || null
    };

    tasks.push(task);
    saveTasksToLocalStorage();
    renderTasks();
    updateOverallProgress();

    taskInput.value = "";
    taskDesc.value = "";
    reminderTimeInput.value = "";
    reminderMessageInput.value = "";

    Swal.fire({
        title: "Tarea Agregada",
        text: "La tarea se agregó con éxito.",
        icon: "success"
    });

    if (task.reminderTime) {
        scheduleTaskReminder(task);
    }
}
```

### **7. Eliminar tarea**

```javascript
function deleteTask(id) {
    Swal.fire({
        title: "¿Quieres eliminar la tarea?",
        text: "Si eliminas esta tarea no podrás restaurarla",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasksToLocalStorage(); // Guarda el cambio después de eliminar
            renderTasks();
            updateOverallProgress();

            Swal.fire({
                title: "Eliminada!",
                text: "La tarea se eliminó con éxito.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}
```

### **8. Editar tarea**

```javascript
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingTaskId = id;

        // Inicializa los campos existentes
        document.getElementById("edit-task-title").value = task.title;
        document.getElementById("edit-task-desc").value = task.description;
        document.getElementById("edit-priority-select").value = task.priority;
        document.getElementById("edit-category-select").value = task.tag;

        // Inicializa los nuevos campos de recordatorio
        document.getElementById("edit-reminder-time").value = task.reminderTime || "";
        document.getElementById("edit-reminder-message").value = task.reminderMessage || "";

        // Muestra el modal
        document.getElementById("edit-task-modal").classList.add("visible");
    } else {
        console.error("Tarea no encontrada para editar.");
    }
}


function closeEditModal() {
    document.getElementById("edit-task-modal").classList.remove("visible");
    editingTaskId = null;
}

function saveTaskChanges() {
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.title = document.getElementById("edit-task-title").value;
        task.description = document.getElementById("edit-task-desc").value || "Sin descripción";
        task.priority = document.getElementById("edit-priority-select").value;
        task.tag = document.getElementById("edit-category-select").value;
        const reminderTimeInput = document.getElementById("edit-reminder-time").value;
        const reminderMessageInput = document.getElementById("edit-reminder-message").value;

        task.reminderTime = reminderTimeInput || null; 
        task.reminderMessage = reminderMessageInput || null; 

        saveTasksToLocalStorage();
        renderTasks();
        updateOverallProgress();
        if (task.reminderTime) {
            scheduleTaskReminder(task);
        }

        Swal.fire({
            title: "Tarea Editada",
            text: "La tarea se actualizó con éxito.",
            icon: "success"
        });
    }
    closeEditModal();
}

function updateTaskPriority(id, newPriority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.priority = newPriority; // Actualiza la prioridad
        saveTasksToLocalStorage(); // Guarda los cambios en localStorage
        renderTasks(); // Re-renderiza todas las tareas para reflejar el cambio
    }
}

```

## 🚀 **Desarrollo y aprendizaje**

El desarrollo de esta aplicación incluyó:

- **1.Diseño de UI**: Creación de una interfaz intuitiva y responsiva.
- **2.Persistencia**: Uso de localStorage para mantener los datos después de cerrar el navegador.
- **3.Notificaciones**: Implementación de recordatorios con la API de Notificaciones.
- **4.Optimización**: Debugging y corrección de errores para asegurar la funcionalidad en diferentes navegadores y dispositivos.
- **5.Colaboración** en GitHub: Uso de control de versiones y despliegue en GitHub Pages.

## **Gracias por explorar este proyecto. Si tienes sugerencias o encuentras errores, no dudes en abrir un issue en el repositorio. 🎉**



**<footer><p>&copy; 2024 Gestor de Tareas. Todos los derechos reservados.</p></footer>**
