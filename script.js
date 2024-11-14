let tasks = [];
const taskContainer = document.getElementById("task-container");
const progressDisplay = document.getElementById("progress");

document.getElementById("theme-toggle").addEventListener("change", toggleTheme);

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
        progress: 0,
        position: { x: 50, y: 100 }, // posición inicial de cada tarea
    };

    tasks.push(task);
    taskInput.value = "";
    taskDesc.value = "";
    renderTask(task); // Renderiza solo la nueva tarea
    updateOverallProgress();
}

function renderTasks(filter = "all") {
    taskContainer.innerHTML = ""; // Limpiar el contenedor una sola vez
    tasks.filter(task => filter === "all" || task.tag === filter).forEach(task => renderTask(task));
}

function renderTask(task) {
    let taskItem = document.getElementById(`task-${task.id}`);
    if (!taskItem) {
        taskItem = document.createElement("div");
        taskItem.id = `task-${task.id}`;
        taskItem.classList.add("task-item", `priority-${task.priority}`);
        taskContainer.appendChild(taskItem);

        // Añade eventos personalizados de arrastre
        taskItem.addEventListener("mousedown", (e) => startDrag(e, taskItem, task));
    }

    // Actualiza contenido y posición de la tarea
    taskItem.style.left = `${task.position.x}px`;
    taskItem.style.top = `${task.position.y}px`;
    taskItem.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <span onclick="toggleComplete(${task.id})">${task.completed ? "Completada" : "Pendiente"}</span>
        <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${task.progress}%;"></div>
        </div>
        <input type="number" min="0" max="100" value="${task.progress}" 
               onchange="updateTaskProgress(${task.id}, this.value)" 
               placeholder="Progreso %" />
        <button onclick="editTask(${task.id})">Editar</button>
        <button onclick="deleteTask(${task.id})">Eliminar</button>
    `;
}

function startDrag(e, element, task) {
    let offsetX = e.clientX - element.offsetLeft;
    let offsetY = e.clientY - element.offsetTop;

    function onMouseMove(e) {
        task.position.x = e.clientX - offsetX;
        task.position.y = e.clientY - offsetY;
        element.style.left = `${task.position.x}px`;
        element.style.top = `${task.position.y}px`;
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    document.getElementById(`task-${id}`).remove();
    updateOverallProgress();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newTitle = prompt("Edita el título de la tarea:", task.title);
    const newDescription = prompt("Edita la descripción de la tarea:", task.description);
    if (newTitle !== null) task.title = newTitle;
    if (newDescription !== null) task.description = newDescription;
    renderTask(task); // Actualiza solo la tarea editada
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    renderTask(task); // Actualiza solo la tarea modificada
    updateOverallProgress();
}

function filterTasks() {
    const filter = document.getElementById("filter-select").value;
    renderTasks(filter);
}

function updateTaskProgress(id, value) {
    const task = tasks.find(task => task.id === id);
    task.progress = Math.min(100, Math.max(0, value));
    task.completed = task.progress === 100;
    renderTask(task); // Actualiza solo la tarea con progreso cambiado
    updateOverallProgress();
}

function updateOverallProgress() {
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    const overallProgress = tasks.length ? totalProgress / tasks.length : 0;
    progressDisplay.textContent = `Progreso general: ${overallProgress.toFixed(1)}%`;
}

function toggleTheme() {
    document.documentElement.toggleAttribute("data-theme", "dark");
}
