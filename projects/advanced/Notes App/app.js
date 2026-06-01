  // Enhanced notes data with more realistic content
        const notesData = [
            {
                id: 1,
                title: "Meeting with Design Team",
                content: "Discuss the new UI components and design system implementation. Need to review the mockups for the dashboard redesign.<br><br><strong>Action Items:</strong><br>1. Review Figma designs<br>2. Provide feedback by Friday<br>3. Schedule follow-up meeting",
                date: "2023-10-15",
                folder: "work",
                tags: ["work", "meeting", "important"],
                pinned: true,
                favorite: true,
                color: "#fef3c7",
                lastModified: "2023-10-15T10:30:00"
            },
            {
                id: 2,
                title: "Personal Goals 2023",
                content: "<ol><li>Learn a new programming language (Python)</li><li>Read 24 books (currently at 18)</li><li>Exercise 4 times a week</li><li>Travel to 2 new countries</li></ol><br><em>Progress update: Going well with Python basics!</em>",
                date: "2023-10-10",
                folder: "personal",
                tags: ["personal", "todo"],
                pinned: false,
                favorite: true,
                color: "#d1fae5",
                lastModified: "2023-10-12T14:20:00"
            },
            {
                id: 3,
                title: "Project Ideas",
                content: "Brainstorming session ideas:<br><br>1. <u>AI-powered note-taking assistant</u><br>2. Expense tracker with receipt scanning<br>3. Habit-building app with gamification<br>4. Personal finance dashboard<br><br><strong>Priority:</strong> Start with #1",
                date: "2023-10-12",
                folder: "ideas",
                tags: ["ideas", "todo"],
                pinned: true,
                favorite: false,
                color: "#e0e7ff",
                lastModified: "2023-10-12T09:15:00"
            },
            {
                id: 4,
                title: "Grocery List",
                content: "<ul><li>Milk</li><li>Eggs</li><li>Bread</li><li>Coffee</li><li>Fruits (Apples, Bananas)</li><li>Vegetables (Spinach, Tomatoes)</li><li>Chicken</li><li>Pasta</li><li>Cheese</li><li>Snacks</li></ul>",
                date: "2023-10-14",
                folder: "personal",
                tags: ["personal"],
                pinned: false,
                favorite: false,
                color: "#f3f4f6",
                lastModified: "2023-10-14T16:45:00"
            },
            {
                id: 5,
                title: "Quarterly Planning",
                content: "<h3>Q4 Objectives:</h3><ul><li>Launch new mobile app</li><li>Increase user engagement by 30%</li><li>Reduce churn rate to under 5%</li><li>Hire 2 new developers</li></ul><br><strong>Timeline:</strong> End of December",
                date: "2023-10-05",
                folder: "work",
                tags: ["work", "important"],
                pinned: true,
                favorite: true,
                color: "#fce7f3",
                lastModified: "2023-10-10T11:30:00"
            },
            {
                id: 6,
                title: "Book Recommendations",
                content: "<strong>Must-read books:</strong><br>1. Atomic Habits by James Clear<br>2. Deep Work by Cal Newport<br>3. The Alchemist by Paulo Coelho<br>4. Thinking Fast and Slow by Daniel Kahneman<br><br><em>Currently reading: Atomic Habits</em>",
                date: "2023-10-08",
                folder: "personal",
                tags: ["personal"],
                pinned: false,
                favorite: true,
                color: "#fef3c7",
                lastModified: "2023-10-09T20:15:00"
            },
            {
                id: 7,
                title: "React Code Snippets",
                content: "<pre><code>// Custom Hook for form handling<br>const useForm = (initialValues) => {<br>  const [values, setValues] = useState(initialValues);<br>  <br>  const handleChange = (e) => {<br>    setValues({...values, [e.target.name]: e.target.value});<br>  };<br>  <br>  return { values, handleChange };<br>};</code></pre>",
                date: "2023-10-03",
                folder: "work",
                tags: ["work", "code"],
                pinned: false,
                favorite: false,
                color: "#e0e7ff",
                lastModified: "2023-10-05T15:40:00"
            },
            {
                id: 8,
                title: "Japan Travel Plans",
                content: "<strong>Japan Trip Itinerary:</strong><br>• Tokyo: 5 days<br>• Kyoto: 4 days<br>• Osaka: 3 days<br><br><strong>Activities:</strong><br>- Visit temples<br>- Try authentic ramen<br>- Experience bullet train<br>- See cherry blossoms",
                date: "2023-10-01",
                folder: "personal",
                tags: ["personal", "todo"],
                pinned: false,
                favorite: true,
                color: "#d1fae5",
                lastModified: "2023-10-02T18:20:00"
            }
        ];

        // DOM Elements
        const notesContainer = document.getElementById('notes-container');
        const editorPanel = document.getElementById('editor-panel');
        const overlay = document.getElementById('overlay');
        const newNoteBtn = document.getElementById('new-note-btn');
        const editorClose = document.getElementById('editor-close');
        const cancelNoteBtn = document.getElementById('cancel-note');
        const saveNoteBtn = document.getElementById('save-note');
        const noteTitle = document.getElementById('note-title');
        const noteBody = document.getElementById('note-body');
        const searchInput = document.getElementById('search-input');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const tagInput = document.getElementById('tag-input');
        const tagsContainer = document.getElementById('tags-container');
        const syncNotesBtn = document.getElementById('sync-notes');
        const viewToggleBtn = document.getElementById('view-toggle');
        const sortNotesBtn = document.getElementById('sort-notes');

        // App State
        let currentNotes = [...notesData];
        let currentFilter = 'all';
        let currentFolder = 'all';
        let currentTag = 'all';
        let currentNoteId = null;
        let isEditing = false;
        let tags = [];
        let isGridView = true;
        let sortBy = 'date-desc';

        // Initialize the app
        function initApp() {
            renderNotes();
            setupEventListeners();
            updateCounts();
            updateFolderCounts();
        }

        // Render notes to the DOM
        function renderNotes() {
            notesContainer.innerHTML = '';
            
            if (currentNotes.length === 0) {
                notesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-sticky-note"></i>
                        <h3>No notes found</h3>
                        <p>${searchInput.value ? 'Try a different search term or' : 'Create a new note or'} try a different filter.</p>
                        ${!searchInput.value ? '<button class="new-note-btn" style="margin: 16px auto; width: auto; padding: 10px 20px;">Create New Note</button>' : ''}
                    </div>
                `;
                
                // Add event listener to the button in empty state
                const emptyStateBtn = notesContainer.querySelector('.new-note-btn');
                if (emptyStateBtn) {
                    emptyStateBtn.addEventListener('click', () => openEditor());
                }
                return;
            }
            
            currentNotes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = `note-card ${note.pinned ? 'pinned' : ''} ${note.favorite ? 'favorite' : ''}`;
                noteElement.style.backgroundColor = note.color;
                noteElement.dataset.id = note.id;
                
                // Format date
                const dateObj = new Date(note.lastModified || note.date);
                const formattedDate = formatDate(dateObj);
                
                // Create tags HTML
                const tagsHTML = note.tags.map(tag => 
                    `<span class="note-tag">${tag}</span>`
                ).join('');
                
                // Determine icon states
                const pinIconClass = note.pinned ? 'fas fa-thumbtack pinned' : 'far fa-thumbtack';
                const favoriteIconClass = note.favorite ? 'fas fa-star favorite' : 'far fa-star';
                
                noteElement.innerHTML = `
                    ${note.pinned ? '<div class="pin-indicator"><i class="fas fa-thumbtack"></i></div>' : ''}
                    <div class="note-header">
                        <div class="note-title">${escapeHtml(note.title)}</div>
                        <div class="note-actions">
                            <div class="note-action-btn ${note.pinned ? 'pinned' : ''}" data-action="pin" title="${note.pinned ? 'Unpin' : 'Pin'}">
                                <i class="${pinIconClass}"></i>
                            </div>
                            <div class="note-action-btn ${note.favorite ? 'favorite' : ''}" data-action="favorite" title="${note.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                                <i class="${favoriteIconClass}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="note-content">${formatNoteContent(note.content)}</div>
                    <div class="note-footer">
                        <div class="note-date">${formattedDate}</div>
                        <div class="note-tags">${tagsHTML}</div>
                    </div>
                `;
                
                notesContainer.appendChild(noteElement);
            });
            
            // Add event listeners to note cards
            document.querySelectorAll('.note-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.note-action-btn')) {
                        const noteId = parseInt(card.dataset.id);
                        openEditor(noteId);
                    }
                });
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.note-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const noteId = parseInt(btn.closest('.note-card').dataset.id);
                    handleNoteAction(action, noteId);
                });
            });
        }

        // Format date for display
        function formatDate(date) {
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Format note content for display
        function formatNoteContent(content) {
            // Remove HTML tags for preview
            let plainText = content.replace(/<[^>]*>/g, ' ');
            
            // Replace multiple spaces with single space
            plainText = plainText.replace(/\s+/g, ' ');
            
            // Truncate if too long
            if (plainText.length > 150) {
                plainText = plainText.substring(0, 150) + '...';
            }
            
            return escapeHtml(plainText);
        }

        // Handle note actions (pin, favorite, etc.)
        function handleNoteAction(action, noteId) {
            const noteIndex = currentNotes.findIndex(note => note.id === noteId);
            if (noteIndex === -1) return;
            
            switch(action) {
                case 'pin':
                    currentNotes[noteIndex].pinned = !currentNotes[noteIndex].pinned;
                    currentNotes[noteIndex].lastModified = new Date().toISOString();
                    break;
                case 'favorite':
                    currentNotes[noteIndex].favorite = !currentNotes[noteIndex].favorite;
                    currentNotes[noteIndex].lastModified = new Date().toISOString();
                    break;
            }
            
            // Update the main notesData for persistence
            const mainIndex = notesData.findIndex(note => note.id === noteId);
            if (mainIndex !== -1) {
                notesData[mainIndex] = {...currentNotes[noteIndex]};
            }
            
            applyFilters();
            renderNotes();
            updateCounts();
            updateFolderCounts();
            
            showNotification(`Note ${action === 'pin' ? (currentNotes[noteIndex].pinned ? 'pinned' : 'unpinned') : (currentNotes[noteIndex].favorite ? 'added to favorites' : 'removed from favorites')}`);
        }

        // Open editor with a note
        function openEditor(noteId = null) {
            isEditing = noteId !== null;
            currentNoteId = noteId;
            
            if (isEditing) {
                const note = currentNotes.find(n => n.id === noteId);
                if (note) {
                    document.getElementById('editor-title').textContent = 'Edit Note';
                    noteTitle.value = note.title;
                    noteBody.innerHTML = note.content;
                    
                    // Update tags
                    tags = [...note.tags];
                    renderTags();
                }
            } else {
                document.getElementById('editor-title').textContent = 'New Note';
                noteTitle.value = '';
                noteBody.innerHTML = '';
                tags = [];
                renderTags();
            }
            
            editorPanel.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on title
            setTimeout(() => {
                noteTitle.focus();
            }, 100);
        }

        // Close editor
        function closeEditor() {
            // Ask for confirmation if there are unsaved changes
            if (hasUnsavedChanges()) {
                if (!confirm('You have unsaved changes. Are you sure you want to discard them?')) {
                    return;
                }
            }
            
            editorPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            currentNoteId = null;
            isEditing = false;
        }

        // Check if there are unsaved changes
        function hasUnsavedChanges() {
            if (!isEditing && (!noteTitle.value.trim() && !noteBody.innerHTML.trim())) {
                return false;
            }
            
            if (isEditing && currentNoteId) {
                const note = currentNotes.find(n => n.id === currentNoteId);
                if (note) {
                    return noteTitle.value !== note.title || 
                           noteBody.innerHTML !== note.content || 
                           JSON.stringify(tags) !== JSON.stringify(note.tags);
                }
            }
            
            return noteTitle.value.trim() !== '' || noteBody.innerHTML.trim() !== '';
        }

        // Save note
        function saveNote() {
            const title = noteTitle.value.trim();
            const content = noteBody.innerHTML.trim();
            
            if (!title) {
                alert('Please enter a title for your note');
                noteTitle.focus();
                return;
            }
            
            if (isEditing && currentNoteId) {
                // Update existing note
                const noteIndex = notesData.findIndex(note => note.id === currentNoteId);
                if (noteIndex !== -1) {
                    notesData[noteIndex].title = title;
                    notesData[noteIndex].content = content;
                    notesData[noteIndex].tags = [...tags];
                    notesData[noteIndex].lastModified = new Date().toISOString();
                    
                    // Update currentNotes if note is visible
                    const currentNoteIndex = currentNotes.findIndex(note => note.id === currentNoteId);
                    if (currentNoteIndex !== -1) {
                        currentNotes[currentNoteIndex] = {...notesData[noteIndex]};
                    }
                }
            } else {
                // Create new note
                const newNote = {
                    id: Date.now(),
                    title,
                    content,
                    date: new Date().toISOString().split('T')[0],
                    lastModified: new Date().toISOString(),
                    folder: currentFolder !== 'all' ? currentFolder : 'personal',
                    tags: [...tags],
                    pinned: false,
                    favorite: false,
                    color: getRandomColor()
                };
                
                notesData.unshift(newNote);
                currentNotes.unshift({...newNote});
            }
            
            closeEditor();
            applyFilters();
            renderNotes();
            updateCounts();
            updateFolderCounts();
            
            showNotification('Note saved successfully!');
        }

        // Get random color for new notes
        function getRandomColor() {
            const colors = [
                '#fef3c7', '#d1fae5', '#e0e7ff', '#fce7f3',
                '#f3f4f6', '#fef9c3', '#dcfce7', '#dbeafe',
                '#fee2e2', '#fef3c7', '#ecfccb', '#ccfbf1'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Apply filters based on current state
        function applyFilters() {
            let filteredNotes = [...notesData];
            
            // Apply search filter
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                filteredNotes = filteredNotes.filter(note => 
                    note.title.toLowerCase().includes(searchTerm) || 
                    note.content.toLowerCase().includes(searchTerm) ||
                    note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
            }
            
            // Apply menu filter
            switch(currentFilter) {
                case 'pinned':
                    filteredNotes = filteredNotes.filter(note => note.pinned);
                    break;
                case 'favorite':
                    filteredNotes = filteredNotes.filter(note => note.favorite);
                    break;
                case 'recent':
                    // Show notes from last 7 days
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    filteredNotes = filteredNotes.filter(note => 
                        new Date(note.lastModified || note.date) > oneWeekAgo
                    );
                    break;
                case 'trash':
                    // In a real app, this would show deleted notes
                    filteredNotes = [];
                    break;
            }
            
            // Apply folder filter
            if (currentFolder !== 'all') {
                filteredNotes = filteredNotes.filter(note => note.folder === currentFolder);
            }
            
            // Apply tag filter
            if (currentTag !== 'all') {
                filteredNotes = filteredNotes.filter(note => note.tags.includes(currentTag));
            }
            
            // Apply sorting
            filteredNotes = sortNotes(filteredNotes);
            
            currentNotes = filteredNotes;
        }

        // Sort notes based on current sort criteria
        function sortNotes(notes) {
            const sortedNotes = [...notes];
            
            switch(sortBy) {
                case 'date-desc':
                    sortedNotes.sort((a, b) => new Date(b.lastModified || b.date) - new Date(a.lastModified || a.date));
                    break;
                case 'date-asc':
                    sortedNotes.sort((a, b) => new Date(a.lastModified || a.date) - new Date(b.lastModified || b.date));
                    break;
                case 'title-asc':
                    sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
                    break;
            }
            
            return sortedNotes;
        }

        // Update note counts
        function updateCounts() {
            const allCount = notesData.length;
            const pinnedCount = notesData.filter(note => note.pinned).length;
            const favoriteCount = notesData.filter(note => note.favorite).length;
            const trashCount = 0; // Hardcoded for demo
            
            document.getElementById('all-count').textContent = allCount;
            document.getElementById('pinned-count').textContent = pinnedCount;
            document.getElementById('favorite-count').textContent = favoriteCount;
            document.getElementById('trash-count').textContent = trashCount;
        }

        // Update folder counts
        function updateFolderCounts() {
            const personalCount = notesData.filter(note => note.folder === 'personal').length;
            const workCount = notesData.filter(note => note.folder === 'work').length;
            const ideasCount = notesData.filter(note => note.folder === 'ideas').length;
            
            document.querySelector('[data-folder="personal"] .note-count').textContent = personalCount;
            document.querySelector('[data-folder="work"] .note-count').textContent = workCount;
            document.querySelector('[data-folder="ideas"] .note-count').textContent = ideasCount;
        }

        // Render tags in editor
        function renderTags() {
            // Clear existing tags except the input
            const existingTags = tagsContainer.querySelectorAll('.editor-tag');
            existingTags.forEach(tag => tag.remove());
            
            // Add current tags
            tags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'editor-tag';
                tagElement.innerHTML = `
                    <span>${escapeHtml(tag)}</span>
                    <span class="editor-tag-remove"><i class="fas fa-times"></i></span>
                `;
                
                tagElement.querySelector('.editor-tag-remove').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeTag(tag);
                });
                
                tagsContainer.insertBefore(tagElement, tagInput);
            });
            
            // Reset input
            tagInput.value = '';
        }

        // Add a tag
        function addTag(tag) {
            const trimmedTag = tag.trim();
            if (trimmedTag && !tags.includes(trimmedTag)) {
                tags.push(trimmedTag);
                renderTags();
                tagInput.focus();
            }
        }

        // Remove a tag
        function removeTag(tagToRemove) {
            tags = tags.filter(tag => tag !== tagToRemove);
            renderTags();
        }

        // Show notification
        function showNotification(message) {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary);
                color: white;
                padding: 16px 24px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                z-index: 1000;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 300px;
            `;
            
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateY(100px)';
                notification.style.opacity = '0';
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }

        // Setup event listeners
        function setupEventListeners() {
            // New note button
            newNoteBtn.addEventListener('click', () => openEditor());
            
            // Editor close buttons
            editorClose.addEventListener('click', closeEditor);
            cancelNoteBtn.addEventListener('click', closeEditor);
            overlay.addEventListener('click', closeEditor);
            
            // Save note button
            saveNoteBtn.addEventListener('click', saveNote);
            
            // Search input
            searchInput.addEventListener('input', () => {
                applyFilters();
                renderNotes();
            });
            
            // Sidebar toggle
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
            
            // Close sidebar when clicking on overlay on mobile
            overlay.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
            
            // Menu items
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentFilter = item.dataset.filter;
                    applyFilters();
                    renderNotes();
                });
            });
            
            // Folder items
            document.querySelectorAll('.folder-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.folder-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentFolder = item.dataset.folder;
                    applyFilters();
                    renderNotes();
                });
            });
            
            // Tag items
            document.querySelectorAll('.tag-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.tag-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentTag = item.dataset.tag;
                    applyFilters();
                    renderNotes();
                });
            });
            
            // Tag input
            tagInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag(tagInput.value);
                }
            });
            
            tagInput.addEventListener('blur', () => {
                if (tagInput.value.trim()) {
                    addTag(tagInput.value);
                }
            });
            
            // Sync notes button
            syncNotesBtn.addEventListener('click', () => {
                showNotification('Syncing notes with cloud...');
                
                // Simulate sync with animation
                syncNotesBtn.classList.add('active');
                syncNotesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                setTimeout(() => {
                    showNotification('Notes synced successfully!');
                    syncNotesBtn.classList.remove('active');
                    syncNotesBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
                }, 1500);
            });
            
            // View toggle button
            viewToggleBtn.addEventListener('click', () => {
                isGridView = !isGridView;
                
                if (isGridView) {
                    notesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
                    viewToggleBtn.innerHTML = '<i class="fas fa-th-large"></i>';
                    viewToggleBtn.title = 'Switch to list view';
                } else {
                    notesContainer.style.gridTemplateColumns = '1fr';
                    viewToggleBtn.innerHTML = '<i class="fas fa-list"></i>';
                    viewToggleBtn.title = 'Switch to grid view';
                }
            });
            
            // Sort notes button
            sortNotesBtn.addEventListener('click', () => {
                // Cycle through sort options
                const sortOptions = ['date-desc', 'date-asc', 'title-asc', 'title-desc'];
                const currentIndex = sortOptions.indexOf(sortBy);
                sortBy = sortOptions[(currentIndex + 1) % sortOptions.length];
                
                let message = '';
                switch(sortBy) {
                    case 'date-desc':
                        message = 'Sorted by date (newest first)';
                        break;
                    case 'date-asc':
                        message = 'Sorted by date (oldest first)';
                        break;
                    case 'title-asc':
                        message = 'Sorted by title (A-Z)';
                        break;
                    case 'title-desc':
                        message = 'Sorted by title (Z-A)';
                        break;
                }
                
                applyFilters();
                renderNotes();
                showNotification(message);
            });
            
            // Toolbar buttons
            document.querySelectorAll('.toolbar-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const format = btn.dataset.format;
                    const action = btn.dataset.action;
                    
                    if (action) {
                        handleEditorAction(action);
                    } else if (format) {
                        applyFormat(format);
                    }
                    
                    // Toggle active state
                    btn.classList.toggle('active');
                    setTimeout(() => btn.classList.remove('active'), 300);
                });
            });
            
            // Handle keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + N for new note
                if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                    e.preventDefault();
                    openEditor();
                }
                
                // Ctrl/Cmd + S for save
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    if (editorPanel.classList.contains('active')) {
                        saveNote();
                    }
                }
                
                // Escape to close editor
                if (e.key === 'Escape' && editorPanel.classList.contains('active')) {
                    closeEditor();
                }
            });
        }

        // Apply formatting to selected text
        function applyFormat(format) {
            document.execCommand(format, false, null);
            noteBody.focus();
        }

        // Handle editor actions
        function handleEditorAction(action) {
            switch(action) {
                case 'createLink':
                    const url = prompt('Enter URL:', 'https://');
                    if (url) {
                        document.execCommand('createLink', false, url);
                    }
                    break;
                case 'insertImage':
                    const imageUrl = prompt('Enter image URL:', 'https://');
                    if (imageUrl) {
                        document.execCommand('insertImage', false, imageUrl);
                    }
                    break;
            }
            noteBody.focus();
        }
        document.addEventListener('DOMContentLoaded', initApp);