let score = 0;
let timeLeft = 30;
let gameActive = false;
let gameTimer;
let balloonTimer;

function startGame() {
    if (gameActive) return;
    
    score = 0;
    timeLeft = 30;
    gameActive = true;
    document.getElementById('score').textContent = score;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('gameArea').innerHTML = '';
    
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    balloonTimer = setInterval(createBalloon, 800);
}

function createBalloon() {
    if (!gameActive) return;
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 90 + '%';
    balloon.style.top = '100%';
    
    const colors = ['#FF416C', '#FF4B2B', '#FFB347', '#42E695', '#4B6CB7'];
    balloon.style.background = `linear-gradient(to bottom, ${colors[Math.floor(Math.random() * colors.length)]}, #FF4B2B)`;
    
    balloon.onclick = () => {
        if (!gameActive) return;
        score++;
        document.getElementById('score').textContent = score;
        balloon.classList.add('popped');
        setTimeout(() => balloon.remove(), 300);
    };
    
    document.getElementById('gameArea').appendChild(balloon);
    
    setTimeout(() => {
        if (balloon.parentNode && !balloon.classList.contains('popped')) {
            balloon.remove();
        }
    }, 5000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(balloonTimer);
    document.getElementById('startBtn').disabled = false;
    document.getElementById('startBtn').textContent = 'Play Again';
    alert(`Game Over! Your score: ${score}`);
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !gameActive) {
        startGame();
    }
});