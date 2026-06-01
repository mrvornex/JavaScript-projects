window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollInfo = document.getElementById('scrollInfo');
    const scrollY = window.scrollY;

    scrollInfo.textContent = `Scroll Position: ${scrollY}px`;

    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (scrollY > 300) {
        header.style.background = 'rgba(255,255,255,0.98)';
    } else if (scrollY > 50) {
        header.style.background = 'rgba(255,255,255,0.95)';
    }
});

window.dispatchEvent(new Event('scroll'));