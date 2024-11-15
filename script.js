let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 
let editingTaskId = null;

const progressDisplay = document.getElementById("progress");

// Verifica el tema en localStorage al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.getElementById("theme-toggle").checked = savedTheme === "dark";
    }
});

document.getElementById("theme-toggle").addEventListener("change", toggleTheme);

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskDesc = document.getElementById("task-desc");
    const prioritySelect = document.getElementById("priority-select");
    const tagSelect = document.getElementById("tag-select");

    if (taskInput.value === "") return;

    const task = {
        id: Date.now(),
        title: taskInput.value,
        description: taskDesc.value,
        priority: prioritySelect.value,
        tag: tagSelect.value,
        completed: false,
        progress: 0
    };

    tasks.push(task);
    saveTasksToLocalStorage(); // Guardar tarea en localStorage
    
    taskInput.value = "";
    taskDesc.value = "";
    renderTasks();
    updateOverallProgress();

    // Alerta para tarea creada
    Swal.fire({
        title: "Tarea Agregada!",
        text: "La tarea se agrego con exito pulsa ok para continuar!",
        icon: "success"
      });
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
        <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${task.progress}%;">
                <span class="progress-percentage">${task.progress}%</span>
            </div>
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
        document.getElementById("edit-task-title").value = task.title;
        document.getElementById("edit-task-desc").value = task.description;
        document.getElementById("edit-priority-select").value = task.priority;
        document.getElementById("edit-category-select").value = task.tag;

        document.getElementById("edit-task-modal").classList.add("visible");
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
        task.description = document.getElementById("edit-task-desc").value;
        task.priority = document.getElementById("edit-priority-select").value;
        task.tag = document.getElementById("edit-category-select").value;
        
        saveTasksToLocalStorage(); // Actualiza localStorage después de editar
        renderTasks();
        updateOverallProgress();

        // Alerta para tarea editada
        Swal.fire({
            title: "Tarea Editada!",
            text: "La tarea se editó con éxito. ¡Pulsa OK para continuar!",
            icon: "success"
        });
    }
    closeEditModal();
}

function updateTaskPriority(id, newPriority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.priority = newPriority;
        saveTasksToLocalStorage(); // Guarda el cambio de prioridad en localStorage
        renderTasks();
    }
}

function updateTaskPriority(id, newPriority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.priority = newPriority;
        saveTasksToLocalStorage(); // Guarda el cambio de prioridad en localStorage
        renderTasks();
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