function addItem(type) {
    const input = document.getElementById('itemInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter some text!');
        return;
    }
    
    const listId = type === 'pro' ? 'proList' : 'conList';
    const list = document.getElementById(listId);
    
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button onclick="removeItem(this)">✕</button>
    `;
    
    list.appendChild(li);
    input.value = '';
    input.focus();
}

function removeItem(button) {
    const li = button.parentElement;
    li.remove();
}

function clearAll() {
    if (confirm('Are you sure you want to clear all items?')) {
        document.getElementById('proList').innerHTML = '';
        document.getElementById('conList').innerHTML = '';
    }
}

document.getElementById('itemInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItem('pro');
    }
});

document.getElementById('itemInput').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        addItem('con');
    }
});