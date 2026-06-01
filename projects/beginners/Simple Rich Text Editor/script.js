const editor = document.getElementById('editor');
const toolBtns = document.querySelectorAll('.tool-btn');
const fontSize = document.getElementById('fontSize');
const fontFamily = document.getElementById('fontFamily');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const printBtn = document.getElementById('printBtn');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const previewContent = document.getElementById('previewContent');

function execCommand(command, value = null) {
    document.execCommand(command, false, value);
    editor.focus();
    updatePreview();
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const command = btn.dataset.command;
        execCommand(command);
        
        toolBtns.forEach(b => b.classList.remove('active'));
        if (command.includes('justify') || command.includes('insert')) {
            btn.classList.add('active');
        }
    });
});

fontSize.addEventListener('change', () => {
    execCommand('fontSize', fontSize.value);
});

fontFamily.addEventListener('change', () => {
    execCommand('fontName', fontFamily.value);
});

textColor.addEventListener('input', () => {
    execCommand('foreColor', textColor.value);
});

bgColor.addEventListener('input', () => {
    execCommand('backColor', bgColor.value);
});

function updateCounters() {
    const text = editor.innerText.trim();
    const words = text ? text.split(/\s+/).filter(word => word.length > 0) : [];
    const characters = text.length;
    
    wordCount.textContent = words.length;
    charCount.textContent = characters;
}

function updatePreview() {
    previewContent.innerHTML = editor.innerHTML;
    updateCounters();
}

clearBtn.addEventListener('click', () => {
    editor.innerHTML = '<p>Start typing here...</p>';
    updatePreview();
});

copyBtn.addEventListener('click', () => {
    const text = editor.innerText;
    navigator.clipboard.writeText(text)
        .then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = original;
            }, 2000);
        });
});

saveBtn.addEventListener('click', () => {
    const text = editor.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    const original = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    setTimeout(() => {
        saveBtn.innerHTML = original;
    }, 2000);
});

printBtn.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Editor Content</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .content { font-size: 16px; line-height: 1.6; }
                </style>
            </head>
            <body>
                <div class="content">${editor.innerHTML}</div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
});

editor.addEventListener('input', updatePreview);
editor.addEventListener('keyup', updatePreview);
editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updatePreview();
});

editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '    ');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                execCommand('bold');
                break;
            case 'i':
                e.preventDefault();
                execCommand('italic');
                break;
            case 'u':
                e.preventDefault();
                execCommand('underline');
                break;
            case 's':
                e.preventDefault();
                saveBtn.click();
                break;
            case 'p':
                e.preventDefault();
                printBtn.click();
                break;
        }
    }
});

updatePreview();