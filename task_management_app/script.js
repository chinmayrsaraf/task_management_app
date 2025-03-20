// script.js
class Task {
    constructor(id, name, description, status = 'pending') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.init();
    }

    init() {
        this.renderTasks();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleAddTask(e));
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    handleAddTask(e) {
        e.preventDefault();
        const name = document.getElementById('taskName').value.trim();
        const desc = document.getElementById('taskDesc').value.trim();

        if (!name) {
            alert('Task name is required!');
            return;
        }

        const task = new Task(Date.now(), name, desc);
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();

        e.target.reset();
    }

    handleEdit(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const name = prompt('Enter new task name:', task.name);
        if (name === null) return;

        const desc = prompt('Enter new description:', task.description);
        task.name = name.trim();
        task.description = desc ? desc.trim() : task.description;
        this.saveTasks();
        this.renderTasks();
    }

    handleDelete(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    handleToggleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
            this.saveTasks();
            this.renderTasks();
        }
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        this.renderTasks(filter);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks(filter = 'all') {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const filteredTasks = this.tasks.filter(task => 
            filter === 'all' || task.status === filter
        );

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.status}`;
            taskElement.innerHTML = `
                <h3>${task.name}</h3>
                <p>${task.description || 'No description'}</p>
                <div class="task-actions">
                    <button onclick="taskManager.handleToggleStatus(${task.id})">
                        ${task.status === 'pending' ? 'Complete' : 'Undo'}
                    </button>
                    <button onclick="taskManager.handleEdit(${task.id})">Edit</button>
                    <button onclick="taskManager.handleDelete(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    }
}

const taskManager = new TaskManager();