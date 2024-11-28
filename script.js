let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskId = null;

const progressDisplay = document.getElementById("progress");

// Registrar el Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(registration => {
        console.log("Service Worker registrado con éxito:", registration);
    }).catch(error => {
        console.error("Error al registrar el Service Worker:", error);
    });
}

// Pedir permisos de notificación
document.addEventListener("DOMContentLoaded", () => {
    // Configurar el tema inicial
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Vincular el interruptor de tema
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("change", toggleTheme);
    }

    // Configurar recordatorios de tareas
    tasks.forEach(task => {
        if (!task.completed && task.reminderTime) {
            scheduleTaskReminder(task);
        }
    });

    // Configurar permisos de notificaciones
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Permiso de notificaciones concedido.");
            } else {
                console.warn("Permiso de notificaciones denegado.");
            }
        });
    }
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}


// Guardar tareas en localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Programar recordatorios de tareas
function scheduleTaskReminder(task) {
    const now = new Date();
    const [hours, minutes] = task.reminderTime.split(":").map(Number);
    const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    const timeUntilReminder = reminderDate - now;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            if (!task.completed) {
                sendTaskNotification(task); // Llama a la función para enviar la notificación
            }
        }, timeUntilReminder);
    }
}

// Enviar notificaciones push
function sendTaskNotification(task) {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(`Recordatorio: ${task.title}`, {
                body: task.reminderMessage || "No olvides completar esta tarea.",
                icon: "img/icon.jpg", 
                data: "https://gestor-tareas.cryptoguardstudio.com/",
                vibrate: [200, 100, 200],
                actions: [
                    { action: "view", title: "Ver tarea" }
                ]
            });
        });
    } else {
        console.warn("Permiso de notificación no concedido.");
    }
}

// Funciones principales
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

    taskItem.className = `task-item priority-${task.priority} ${task.completed ? "completed" : ""}`;

    taskItem.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Categoría:</strong> ${task.tag}</p>
        <p><strong>Status:</strong> <span onclick="toggleComplete(${task.id})">${task.completed ? "Completada" : "Pendiente"}</span></p>
        <div class="tarjeta-tarea">
            <input type="number" min="0" max="100" value="${task.progress}" 
                onchange="updateTaskProgress(${task.id}, this.value)" 
                placeholder="Progreso %" />
            <select onchange="updateTaskPriority(${task.id}, this.value)">
                <option value="alta" ${task.priority === "alta" ? "selected" : ""}>Alta</option>
                <option value="media" ${task.priority === "media" ? "selected" : ""}>Media</option>
                <option value="baja" ${task.priority === "baja" ? "selected" : ""}>Baja</option>
            </select>
            <button onclick="openEditModal(${task.id})">Editar</button>
            <button onclick="deleteTask(${task.id})">Eliminar</button>
        </div>  
        <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${task.progress}%;"></div>
        </div>
    `;

    const column = document.getElementById(`column-${task.priority}`);
    if (column) {
        column.appendChild(taskItem);
    }
}

// Funciones de arrastre para reordenar tareas
let draggedTask = null;

function onDragStart(e, task) {
    draggedTask = task;
    e.dataTransfer.effectAllowed = "move";
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function onDrop(e, targetTask) {
    e.preventDefault();
    if (draggedTask && draggedTask.priority === targetTask.priority) {
        const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
        const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

        tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);

        renderTasks(); // Vuelve a renderizar todas las tareas en el nuevo orden
        draggedTask = null;
    }
}

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


function updateTaskProgress(id, value) {
    const task = tasks.find(task => task.id === id);
    task.progress = Math.min(100, Math.max(0, value));
    task.completed = task.progress === 100;
    
    saveTasksToLocalStorage(); // Guarda el progreso actualizado en localStorage
    renderTask(task);
    updateOverallProgress();

    if (task.completed) {
        Swal.fire({
            title: "¡Felicidades! Completaste tu tarea.",
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(/img/Feliz1.png)",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://media.tenor.com/9zmtHZ0tIjkAAAAj/nyancat-rainbow-cat.gif")
                left top
                no-repeat
            `
        });
    }
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    task.progress = task.completed ? 100 : task.progress;

    saveTasksToLocalStorage(); // Guarda el cambio de completado en localStorage
    renderTask(task);
    updateOverallProgress();

    if (task.completed) {
        Swal.fire({
            title: "¡Felicidades! Completaste tu tarea.",
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(img/Feliz1.png)",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://media.tenor.com/9zmtHZ0tIjkAAAAj/nyancat-rainbow-cat.gif")
                left top
                no-repeat
            `
        });
    }
}

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

function filterTasks() {
    const filter = document.getElementById("filter-select").value;
    renderTasks(filter);
}

function updateOverallProgress() {
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    const overallProgress = tasks.length ? totalProgress / tasks.length : 0;
    progressDisplay.textContent = `Progreso general: ${overallProgress.toFixed(1)}%`;
}


function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

renderTasks();
updateOverallProgress();
