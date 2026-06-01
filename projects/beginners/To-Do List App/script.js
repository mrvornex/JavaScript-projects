let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateList() {
    let list = document.getElementById('taskList');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        if (task.done) li.classList.add('completed');
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <i class="fas fa-check" onclick="toggleTask(${index})"></i>
                <i class="fas fa-trash" onclick="deleteTask(${index})"></i>
            </div>
        `;
        list.appendChild(li);
    });
    document.getElementById('counter').textContent = `Total: ${tasks.length} tasks`;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    let input = document.getElementById('taskInput');
    let text = input.value.trim();
    if (text) {
        tasks.push({ text: text, done: false });
        input.value = '';
        updateList();
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    updateList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateList();
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

updateList();