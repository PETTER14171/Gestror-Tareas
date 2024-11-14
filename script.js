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
    };

    tasks.push(task);
    taskInput.value = "";
    taskDesc.value = "";
    renderTasks();
}

function renderTasks(filter = "all") {
    taskContainer.innerHTML = "";
    const filteredTasks = tasks.filter(task => filter === "all" || task.tag === filter);
    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item", `priority-${task.priority}`);
        taskItem.setAttribute("draggable", true);
        taskItem.style.top = "100px";
        taskItem.style.left = "50px";
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
        taskContainer.appendChild(taskItem);
        makeDraggable(taskItem);
    });
    updateOverallProgress();
}

function makeDraggable(element) {
    let offsetX, offsetY;
    element.addEventListener("dragstart", (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });
    element.addEventListener("dragend", (e) => {
        element.style.left = `${e.pageX - offsetX}px`;
        element.style.top = `${e.pageY - offsetY}px`;
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newTitle = prompt("Edita el título de la tarea:", task.title);
    const newDescription = prompt("Edita la descripción de la tarea:", task.description);
    if (newTitle !== null) task.title = newTitle;
    if (newDescription !== null) task.description = newDescription;
    renderTasks();
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    renderTasks();
}

function filterTasks() {
    const filter = document.getElementById("filter-select").value;
    renderTasks(filter);
}

function updateTaskProgress(id, value) {
    const task = tasks.find(task => task.id === id);
    task.progress = Math.min(100, Math.max(0, value));
    task.completed = task.progress === 100;
    renderTasks();
}

function updateOverallProgress() {
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    const overallProgress = tasks.length ? totalProgress / tasks.length : 0;
    progressDisplay.textContent = `Progreso general: ${overallProgress.toFixed(1)}%`;
}

function toggleTheme() {
    document.documentElement.toggleAttribute("data-theme", "dark");
}
