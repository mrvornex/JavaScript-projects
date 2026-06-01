function changeColor() {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    document.body.style.background = randomColor;
    document.getElementById('colorCode').textContent = randomColor;
}

document.addEventListener('keypress', (e) => {
    if (e.key === ' ') changeColor();
});

changeColor();