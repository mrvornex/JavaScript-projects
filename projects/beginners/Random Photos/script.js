function newPhoto() {
    const sizes = ["400/300", "500/400", "600/500", "700/600", "800/700"];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    document.getElementById('photo').src = `https://picsum.photos/${randomSize}?random=${randomNum}`;
}

window.onload = newPhoto;