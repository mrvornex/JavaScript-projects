function generateColor() {
    // Generate random hex color
    const hex = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
        color += hex[Math.floor(Math.random() * 16)];
    }
    
    // Update display
    document.getElementById('colorBox').style.background = color;
    document.getElementById('colorCode').textContent = color;
    
    // Update text color based on brightness
    const brightness = parseInt(color.replace('#', ''), 16);
    document.getElementById('colorCode').style.color = brightness > 0x888888 ? '#333' : '#fff';
}

function copyColor() {
    const colorCode = document.getElementById('colorCode').textContent;
    navigator.clipboard.writeText(colorCode)
        .then(() => alert(`Copied: ${colorCode}`))
        .catch(() => {
            // Fallback for older browsers
            const temp = document.createElement('textarea');
            temp.value = colorCode;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert(`Copied: ${colorCode}`);
        });
}

// Generate initial color on load
window.onload = generateColor;