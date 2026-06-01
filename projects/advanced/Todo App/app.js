 const addTaskForm = document.getElementById('addTaskForm');
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const notification = document.getElementById('notification');
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const searchTask = document.getElementById('searchTask');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const priorityOptions = document.querySelectorAll('.priority-option');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const pendingTasksEl = document.getElementById('pendingTasks');
        const markAllCompleteBtn = document.getElementById('markAllComplete');
        const clearCompletedBtn = document.getElementById('clearCompleted');

        // App State
        let tasks = JSON.parse(localStorage.getItem('nextLevelTasks')) || [];
        let currentFilter = 'all';
        let selectedPriority = 'medium';
        let isListening = false;
        let speechRecognition = null;

        // Initialize app
        document.addEventListener('DOMContentLoaded', () => {
            renderTasks();
            updateStats();
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('taskDueDate').min = today;
            
            // Initialize Speech Recognition
            if ('webkitSpeechRecognition' in window) {
                speechRecognition = new webkitSpeechRecognition();
                speechRecognition.continuous = false;
                speechRecognition.interimResults = false;
                speechRecognition.lang = 'en-US';
                
                speechRecognition.onstart = () => {
                    isListening = true;
                    voiceBtn.classList.add('listening');
                    voiceStatus.textContent = "Listening... Speak your task now";
                };
                
                speechRecognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    processVoiceCommand(transcript);
                };
                
                speechRecognition.onerror = () => {
                    voiceStatus.textContent = "Error occurred. Please try again";
                    resetVoiceUI();
                };
                
                speechRecognition.onend = () => {
                    resetVoiceUI();
                };
            } else {
                voiceStatus.textContent = "Voice recognition not supported in this browser";
                voiceBtn.disabled = true;
            }
        });

        // Priority selection
        priorityOptions.forEach(option => {
            option.addEventListener('click', () => {
                priorityOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedPriority = option.getAttribute('data-priority');
            });
        });

        // Add task form submission
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDescription').value.trim();
            const category = document.getElementById('taskCategory').value;
            const dueDate = document.getElementById('taskDueDate').value;
            
            if (!title) return;
            
            const newTask = {
                id: Date.now(),
                title,
                description,
                category,
                priority: selectedPriority,
                dueDate,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            tasks.unshift(newTask);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Task added successfully!', 'success');
            
            // Reset form
            addTaskForm.reset();
            document.getElementById('taskDueDate').value = '';
            
            // Reset priority to medium
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.priority-option[data-priority="medium"]').classList.add('selected');
            selectedPriority = 'medium';
        });

        // Filter tasks
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderTasks();
            });
        });

        // Search tasks
        searchTask.addEventListener('input', () => {
            renderTasks();
        });

        // Mark all tasks as complete
        markAllCompleteBtn.addEventListener('click', () => {
            tasks.forEach(task => task.completed = true);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('All tasks marked as complete!', 'success');
        });

        // Clear completed tasks
        clearCompletedBtn.addEventListener('click', () => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Completed tasks cleared!', 'warning');
        });

        // Voice control
        voiceBtn.addEventListener('click', () => {
            if (!speechRecognition) return;
            
            if (isListening) {
                speechRecognition.stop();
                resetVoiceUI();
            } else {
                speechRecognition.start();
            }
        });

        // Process voice command
        function processVoiceCommand(transcript) {
            voiceStatus.textContent = `Heard: "${transcript}"`;
            
            // Simple voice command processing
            if (transcript.toLowerCase().includes('add task') || transcript.toLowerCase().includes('create task')) {
                // Extract task title after command
                const title = transcript.replace(/add task|create task/i, '').trim();
                if (title) {
                    const newTask = {
                        id: Date.now(),
                        title: title,
                        description: "Added via voice command",
                        category: "personal",
                        priority: "medium",
                        dueDate: "",
                        completed: false,
                        createdAt: new Date().toISOString()
                    };
                    
                    tasks.unshift(newTask);
                    saveTasks();
                    renderTasks();
                    updateStats();
                    showNotification('Task added via voice command!', 'success');
                    
                    // Auto-read the task added
                    setTimeout(() => {
                        const speech = new SpeechSynthesisUtterance(`Task "${title}" added successfully`);
                        speech.rate = 1.1;
                        window.speechSynthesis.speak(speech);
                    }, 500);
                }
            } else if (transcript.toLowerCase().includes('delete all')) {
                tasks = [];
                saveTasks();
                renderTasks();
                updateStats();
                showNotification('All tasks deleted!', 'danger');
            } else {
                voiceStatus.textContent = `Command not recognized. Try saying "Add task [your task]"`;
            }
        }

        // Reset voice UI
        function resetVoiceUI() {
            isListening = false;
            voiceBtn.classList.remove('listening');
            setTimeout(() => {
                voiceStatus.textContent = "Click mic icon to add task by voice";
            }, 2000);
        }

        // Render tasks based on filter and search
        function renderTasks() {
            let filteredTasks = [...tasks];
            const searchTerm = searchTask.value.toLowerCase().trim();
            
            // Apply search filter
            if (searchTerm) {
                filteredTasks = filteredTasks.filter(task => 
                    task.title.toLowerCase().includes(searchTerm) || 
                    task.description.toLowerCase().includes(searchTerm) ||
                    task.category.toLowerCase().includes(searchTerm)
                );
            }
            
            // Apply category filter
            switch(currentFilter) {
                case 'pending':
                    filteredTasks = filteredTasks.filter(task => !task.completed);
                    break;
                case 'completed':
                    filteredTasks = filteredTasks.filter(task => task.completed);
                    break;
                case 'high':
                    filteredTasks = filteredTasks.filter(task => task.priority === 'high');
                    break;
                case 'today':
                    const today = new Date().toISOString().split('T')[0];
                    filteredTasks = filteredTasks.filter(task => task.dueDate === today);
                    break;
                default:
                    // 'all' - no filter
                    break;
            }
            
            // Clear task list
            taskList.innerHTML = '';
            
            // Show empty state if no tasks
            if (filteredTasks.length === 0) {
                taskList.appendChild(emptyState);
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            // Render each task
            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
                
                // Format date
                let dueDateText = 'No due date';
                if (task.dueDate) {
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    if (dueDate.toDateString() === today.toDateString()) {
                        dueDateText = 'Today';
                        taskElement.style.borderLeftColor = 'var(--danger)';
                    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
                        dueDateText = 'Tomorrow';
                        taskElement.style.borderLeftColor = 'var(--warning)';
                    } else {
                        dueDateText = dueDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                    }
                }
                
                // Priority badge color
                let priorityColorClass = '';
                let priorityText = '';
                switch(task.priority) {
                    case 'high':
                        priorityColorClass = 'priority-high';
                        priorityText = 'High Priority';
                        break;
                    case 'medium':
                        priorityColorClass = 'priority-medium';
                        priorityText = 'Medium Priority';
                        break;
                    case 'low':
                        priorityColorClass = 'priority-low';
                        priorityText = 'Low Priority';
                        break;
                }
                
                taskElement.innerHTML = `
                    <div class="task-header">
                        <div class="task-title ${task.completed ? 'completed' : ''}">
                            ${task.title}
                            <span class="task-category">${task.category}</span>
                        </div>
                        <div class="task-priority ${priorityColorClass}">${priorityText}</div>
                    </div>
                    
                    ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                    
                    <div class="task-footer">
                        <div class="task-date">
                            <i class="far fa-calendar"></i>
                            ${dueDateText}
                        </div>
                        <div class="task-actions">
                            <button class="action-btn complete-btn" data-id="${task.id}" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="action-btn edit-btn" data-id="${task.id}" title="Edit task">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" data-id="${task.id}" title="Delete task">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                taskList.appendChild(taskElement);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.complete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    toggleTaskComplete(id);
                });
            });
            
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    editTask(id);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    deleteTask(id);
                });
            });
        }

        // Toggle task completion status
        function toggleTaskComplete(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                updateStats();
                showNotification(`Task marked as ${task.completed ? 'complete' : 'pending'}!`, 'success');
            }
        }

        // Edit task
        function editTask(id) {
            const task = tasks.find(t => t.id === id);
            if (!task) return;
            
            // Populate form with task data
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskDueDate').value = task.dueDate;
            
            // Set priority
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            document.querySelector(`.priority-option[data-priority="${task.priority}"]`).classList.add('selected');
            selectedPriority = task.priority;
            
            // Remove task from list
            tasks = tasks.filter(t => t.id !== id);
            
            // Update button text
            const submitBtn = addTaskForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';
            submitBtn.onclick = (e) => {
                e.preventDefault();
                
                // Update task with form data
                task.title = document.getElementById('taskTitle').value.trim();
                task.description = document.getElementById('taskDescription').value.trim();
                task.category = document.getElementById('taskCategory').value;
                task.priority = selectedPriority;
                task.dueDate = document.getElementById('taskDueDate').value;
                
                // Add back to tasks
                tasks.unshift(task);
                saveTasks();
                renderTasks();
                updateStats();
                showNotification('Task updated successfully!', 'success');
                
                // Reset form and button
                addTaskForm.reset();
                document.getElementById('taskDueDate').value = '';
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
                submitBtn.onclick = null;
                
                // Reset priority to medium
                priorityOptions.forEach(opt => opt.classList.remove('selected'));
                document.querySelector('.priority-option[data-priority="medium"]').classList.add('selected');
                selectedPriority = 'medium';
            };
            
            // Scroll to form
            document.getElementById('taskTitle').focus();
        }

        // Delete task
        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
                updateStats();
                showNotification('Task deleted successfully!', 'danger');
            }
        }

        // Update statistics
        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;
            
            totalTasksEl.textContent = total;
            completedTasksEl.textContent = completed;
            pendingTasksEl.textContent = pending;
        }

        // Save tasks to localStorage
        function saveTasks() {
            localStorage.setItem('nextLevelTasks', JSON.stringify(tasks));
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const icon = notification.querySelector('i');
            const content = notification.querySelector('.notification-content');
            
            // Set notification type
            notification.className = 'notification';
            notification.classList.add(`notification-${type}`);
            notification.classList.add('show');
            
            // Set icon based on type
            switch(type) {
                case 'success':
                    icon.className = 'fas fa-check-circle';
                    break;
                case 'warning':
                    icon.className = 'fas fa-exclamation-triangle';
                    break;
                case 'danger':
                    icon.className = 'fas fa-exclamation-circle';
                    break;
            }
            
            content.textContent = message;
            
            // Auto-hide notification
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Add some sample tasks on first load
        if (tasks.length === 0) {
            const sampleTasks = [
                {
                    id: 1,
                    title: "Welcome to NextLevel Todo",
                    description: "This is a sample task. Try adding your own tasks using the form or voice command!",
                    category: "personal",
                    priority: "high",
                    dueDate: new Date().toISOString().split('T')[0],
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Complete project proposal",
                    description: "Finish the client proposal and send for review",
                    category: "work",
                    priority: "high",
                    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Buy groceries",
                    description: "Milk, eggs, bread, fruits, and vegetables",
                    category: "shopping",
                    priority: "medium",
                    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
                    completed: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: "Morning workout",
                    description: "30 minutes of cardio and strength training",
                    category: "health",
                    priority: "low",
                    dueDate: "",
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ];
            
            tasks = sampleTasks;
            saveTasks();
            renderTasks();
            updateStats();
        }