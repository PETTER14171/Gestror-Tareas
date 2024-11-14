let tasks = [];
const taskList = document.getElementById("task-list");
const progressDisplay = document.getElementById("progress");

document.getElementById("theme-toggle").addEventListener("change", toggleTheme);

function addTask() {
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority-select");
    const tagSelect = document.getElementById("tag-select");

    if (taskInput.value === "") return;

    const task = {
        id: Date.now(),
        text: taskInput.value,
        priority: prioritySelect.value,
        tag: tagSelect.value,
        completed: false,
    };

    tasks.push(task);
    taskInput.value = "";
    renderTasks();
}

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => filter === "all" || task.tag === filter);
    filteredTasks.forEach(task => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item", `priority-${task.priority}`);
        if (task.completed) taskItem.classList.add("completed");

        taskItem.innerHTML = `
            <span onclick="toggleComplete(${task.id})">${task.text}</span>
            <div>
                <button onclick="editTask(${task.id})">Editar</button>
                <button onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateProgress();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt("Edita la tarea:", task.text);
    if (newText !== null) {
        task.text = newText;
        renderTasks();
    }
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

function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressDisplay.textContent = `Progreso: ${progress.toFixed(1)}%`;
}

function toggleTheme() {
    document.documentElement.toggleAttribute("data-theme", "dark");
}
