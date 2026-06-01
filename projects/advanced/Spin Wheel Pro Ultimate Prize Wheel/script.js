const gameState = {
    coins: 10000,
    totalSpins: 248,
    jackpots: 12,
    spinCost: 100,
    isSpinning: false,
    currentSpin: null,
    spinStreak: 5,
    freeSpinTimer: 225,
    autoSpin: false,
    autoSpinCount: 0,
    wheelSegments: 8,
    spinDuration: 5,
    spinPower: 7,
    soundVolume: 80,
    prizes: [
        { name: "Jackpot", value: 5000, color: "#FF6B6B", probability: 5 },
        { name: "Mega Prize", value: 2000, color: "#4ECDC4", probability: 10 },
        { name: "Big Win", value: 1000, color: "#FFE66D", probability: 15 },
        { name: "Good Prize", value: 500, color: "#95E1D3", probability: 20 },
        { name: "Small Prize", value: 200, color: "#F38181", probability: 25 },
        { name: "Try Again", value: 0, color: "#A8D8EA", probability: 10 },
        { name: "Coin Bonus", value: 100, color: "#AA96DA", probability: 10 },
        { name: "Spin Again", value: -1, color: "#FFD3B6", probability: 5 }
    ],
    results: [],
    achievements: [
        { id: 1, name: "First Spin", desc: "Complete your first spin", unlocked: true, reward: 100 },
        { id: 2, name: "Lucky Winner", desc: "Win 10 times", unlocked: true, reward: 500 },
        { id: 3, name: "Jackpot King", desc: "Hit 5 jackpots", unlocked: true, reward: 2000 },
        { id: 4, name: "Spin Master", desc: "Complete 100 spins", unlocked: true, reward: 1000 },
        { id: 5, name: "Streak Breaker", desc: "Get 10 win streak", unlocked: false, reward: 1500 },
        { id: 6, name: "High Roller", desc: "Spend 10,000 coins", unlocked: false, reward: 2000 }
    ],
    stats: {
        todaySpins: 12,
        winRate: 64.5,
        totalWon: 25400,
        bestStreak: 15
    },
    currentWin: null
};

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const wheelSegmentsInput = document.getElementById('wheelSegments');
const spinDurationInput = document.getElementById('spinDuration');
const spinPowerInput = document.getElementById('spinPower');
const soundVolumeInput = document.getElementById('soundVolume');
const winModal = document.getElementById('winModal');
const closeModal = document.getElementById('closeModal');
const spinAgainButton = document.getElementById('spinAgain');
const addPrizeButton = document.getElementById('addPrize');
const randomizePrizesButton = document.getElementById('randomizePrizes');
const autoSpinButton = document.getElementById('autoSpin');
const clearResultsButton = document.getElementById('clearResults');
const claimPrizeButton = document.getElementById('claimPrize');
const confettiContainer = document.getElementById('confettiContainer');

const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');
const clickSound = document.getElementById('clickSound');
const jackpotSound = document.getElementById('jackpotSound');

let wheelRotation = 0;
let isAnimating = false;
let spinAnimationId = null;
let freeSpinInterval = null;
let autoSpinInterval = null;

function init() {
    loadGameState();
    setupEventListeners();
    updateUI();
    drawWheel();
    startFreeSpinTimer();
    updatePrizesList();
    updateAchievements();
    updateResultsList();
}

function setupEventListeners() {
    spinButton.addEventListener('click', handleSpin);
    
    wheelSegmentsInput.addEventListener('input', () => {
        gameState.wheelSegments = parseInt(wheelSegmentsInput.value);
        document.getElementById('segmentsValue').textContent = gameState.wheelSegments;
        updatePrizesForSegments();
        drawWheel();
    });
    
    spinDurationInput.addEventListener('input', () => {
        gameState.spinDuration = parseFloat(spinDurationInput.value);
        document.getElementById('durationValue').textContent = gameState.spinDuration + 's';
    });
    
    spinPowerInput.addEventListener('input', () => {
        gameState.spinPower = parseInt(spinPowerInput.value);
        document.getElementById('powerValue').textContent = gameState.spinPower;
    });
    
    soundVolumeInput.addEventListener('input', () => {
        gameState.soundVolume = parseInt(soundVolumeInput.value);
        document.getElementById('volumeValue').textContent = gameState.soundVolume + '%';
        updateSoundVolume();
    });
    
    closeModal.addEventListener('click', () => {
        winModal.classList.remove('active');
        stopConfetti();
    });
    
    spinAgainButton.addEventListener('click', () => {
        winModal.classList.remove('active');
        stopConfetti();
        if (gameState.coins >= gameState.spinCost) {
            handleSpin();
        }
    });
    
    addPrizeButton.addEventListener('click', addNewPrize);
    randomizePrizesButton.addEventListener('click', randomizePrizes);
    autoSpinButton.addEventListener('click', toggleAutoSpin);
    clearResultsButton.addEventListener('click', clearResults);
    claimPrizeButton.addEventListener('click', claimCurrentPrize);
    
    document.querySelectorAll('.prize-btn.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = prizeItem.querySelector('.prize-color').style.backgroundColor;
            colorInput.addEventListener('change', (e) => {
                prizeItem.querySelector('.prize-color').style.backgroundColor = e.target.value;
                updatePrizeColors();
            });
            colorInput.click();
        });
    });
    
    document.querySelectorAll('.prize-btn.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const index = Array.from(prizeItem.parentElement.children).indexOf(prizeItem);
            if (gameState.prizes.length > 4) {
                gameState.prizes.splice(index, 1);
                updatePrizesList();
                drawWheel();
            }
        });
    });
    
    document.querySelectorAll('.prize-name, .prize-value').forEach(input => {
        input.addEventListener('change', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const index = Array.from(prizeItem.parentElement.children).indexOf(prizeItem);
            const nameInput = prizeItem.querySelector('.prize-name');
            const valueInput = prizeItem.querySelector('.prize-value');
            
            gameState.prizes[index].name = nameInput.value;
            gameState.prizes[index].value = parseInt(valueInput.value) || 0;
            
            updateProbability();
            saveGameState();
        });
    });
    
    document.querySelectorAll('.shop-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            playSound(clickSound);
            const shopItem = e.target.closest('.shop-item');
            const itemName = shopItem.querySelector('.shop-name').textContent;
            alert(`Thank you for purchasing: ${itemName}\nThis is a demo - no real transaction occurred.`);
        });
    });
}

function updateSoundVolume() {
    const volume = gameState.soundVolume / 100;
    spinSound.volume = volume;
    winSound.volume = volume;
    clickSound.volume = volume;
    jackpotSound.volume = volume;
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const segmentAngle = (2 * Math.PI) / gameState.wheelSegments;
    
    for (let i = 0; i < gameState.wheelSegments; i++) {
        const startAngle = segmentAngle * i + wheelRotation;
        const endAngle = segmentAngle * (i + 1) + wheelRotation;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        const prize = gameState.prizes[i] || gameState.prizes[0];
        ctx.fillStyle = prize.color;
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Montserrat';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        const prizeName = prize.name;
        const maxLength = 8;
        const displayName = prizeName.length > maxLength ? prizeName.substring(0, maxLength) + '...' : prizeName;
        
        ctx.fillText(displayName, radius - 40, 0);
        
        if (prize.value > 0) {
            ctx.font = 'bold 30px Orbitron';
            ctx.fillStyle = '#FFE66D';
            ctx.fillText('+' + prize.value, radius - 40, 30);
        }
        
        ctx.restore();
    }
    
    drawWheelCenter();
}

function drawWheelCenter() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerRadius = 60;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.font = 'bold 20px Montserrat';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY - 10);
    ctx.fillText('WHEEL', centerX, centerY + 15);
}

function handleSpin() {
    if (gameState.isSpinning) return;
    
    if (gameState.coins < gameState.spinCost && gameState.freeSpinTimer > 0) {
        alert('Not enough coins! Wait for free spin or buy more coins.');
        return;
    }
    
    if (gameState.freeSpinTimer <= 0) {
        gameState.freeSpinTimer = 300;
    } else {
        gameState.coins -= gameState.spinCost;
    }
    
    gameState.isSpinning = true;
    spinButton.disabled = true;
    gameState.totalSpins++;
    gameState.stats.todaySpins++;
    gameState.spinStreak++;
    
    updateUI();
    playSound(spinSound);
    
    const spinPower = gameState.spinPower;
    const spinDuration = gameState.spinDuration;
    const extraRotations = 5 + spinPower;
    const targetRotation = wheelRotation + (extraRotations * 2 * Math.PI);
    
    const startTime = Date.now();
    const endTime = startTime + (spinDuration * 1000);
    
    function animateSpin() {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / (spinDuration * 1000));
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentRotation = wheelRotation + (targetRotation - wheelRotation) * easeOut;
        
        wheelRotation = currentRotation % (2 * Math.PI);
        drawWheel();
        
        if (now < endTime) {
            spinAnimationId = requestAnimationFrame(animateSpin);
        } else {
            finishSpin();
        }
    }
    
    spinAnimationId = requestAnimationFrame(animateSpin);
}

function finishSpin() {
    gameState.isSpinning = false;
    spinButton.disabled = false;
    
    const segmentAngle = (2 * Math.PI) / gameState.wheelSegments;
    const normalizedRotation = ((wheelRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const winningSegment = Math.floor(((2 * Math.PI) - normalizedRotation) / segmentAngle) % gameState.wheelSegments;
    
    const winningPrize = gameState.prizes[winningSegment];
    gameState.currentWin = winningPrize;
    
    let prizeValue = winningPrize.value;
    
    if (prizeValue === -1) {
        prizeValue = gameState.spinCost;
        gameState.coins += gameState.spinCost;
    } else {
        const multiplier = calculateMultiplier();
        const finalValue = prizeValue * multiplier;
        
        if (prizeValue > 0) {
            gameState.coins += finalValue;
            gameState.stats.totalWon += finalValue;
        }
        
        prizeValue = finalValue;
        
        if (winningPrize.name === "Jackpot") {
            gameState.jackpots++;
            playSound(jackpotSound);
            createConfetti();
        } else if (prizeValue > 0) {
            playSound(winSound);
        }
    }
    
    const result = {
        prize: winningPrize.name,
        value: prizeValue,
        time: new Date().toLocaleTimeString(),
        isJackpot: winningPrize.name === "Jackpot"
    };
    
    gameState.results.unshift(result);
    if (gameState.results.length > 10) gameState.results.pop();
    
    updateUI();
    updateResultsList();
    
    document.getElementById('winPrize').textContent = winningPrize.name;
    document.getElementById('winMultiplier').textContent = calculateMultiplier() + 'x';
    claimPrizeButton.disabled = false;
    
    if (!gameState.autoSpin) {
        showWinModal(winningPrize, prizeValue);
    }
    
    checkAchievements();
    saveGameState();
    
    if (gameState.autoSpin && gameState.autoSpinCount > 0) {
        gameState.autoSpinCount--;
        setTimeout(() => {
            if (gameState.autoSpin && gameState.coins >= gameState.spinCost) {
                handleSpin();
            } else {
                toggleAutoSpin();
            }
        }, 2000);
    }
}

function calculateMultiplier() {
    const baseMultiplier = 1;
    const streakBonus = Math.floor(gameState.spinStreak / 5) * 0.5;
    const randomBonus = Math.random() * 0.5;
    return Math.min(baseMultiplier + streakBonus + randomBonus, 3).toFixed(1);
}

function showWinModal(prize, value) {
    const modalPrizeIcon = document.getElementById('modalPrizeIcon');
    const modalPrizeTitle = document.getElementById('modalPrizeTitle');
    const modalPrizeAmount = document.getElementById('modalPrizeAmount');
    const modalMultiplier = document.getElementById('modalMultiplier');
    
    modalPrizeIcon.innerHTML = prize.name === "Jackpot" ? '<i class="fas fa-crown"></i>' : '<i class="fas fa-gift"></i>';
    modalPrizeTitle.textContent = prize.name;
    modalPrizeAmount.textContent = `+${value} coins`;
    modalMultiplier.textContent = calculateMultiplier() + 'x';
    
    winModal.classList.add('active');
    
    if (prize.name === "Jackpot") {
        createConfetti();
    }
}

function createConfetti() {
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#A8D8EA', '#AA96DA', '#FFD3B6'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.width = Math.random() * 20 + 10 + 'px';
        confetti.style.height = Math.random() * 20 + 10 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        const animationDuration = Math.random() * 3 + 2;
        confetti.style.animation = `confettiFall ${animationDuration}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

function stopConfetti() {
    confettiContainer.innerHTML = '';
}

function updateUI() {
    document.getElementById('totalCoins').textContent = gameState.coins.toLocaleString();
    document.getElementById('totalSpins').textContent = gameState.totalSpins;
    document.getElementById('jackpots').textContent = gameState.jackpots;
    document.getElementById('spinCost').textContent = gameState.spinCost;
    document.getElementById('spinStreak').textContent = gameState.spinStreak;
    
    document.getElementById('todaySpins').textContent = gameState.stats.todaySpins;
    document.getElementById('winRate').textContent = gameState.stats.winRate.toFixed(1) + '%';
    document.getElementById('totalWon').textContent = gameState.stats.totalWon.toLocaleString();
    document.getElementById('bestStreak').textContent = gameState.stats.bestStreak;
    
    spinButton.disabled = gameState.isSpinning || (gameState.coins < gameState.spinCost && gameState.freeSpinTimer > 0);
    
    if (gameState.currentWin) {
        document.getElementById('winPrize').textContent = gameState.currentWin.name;
    }
}

function updatePrizesList() {
    const prizesList = document.getElementById('prizesList');
    prizesList.innerHTML = '';
    
    gameState.prizes.forEach((prize, index) => {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item';
        prizeItem.innerHTML = `
            <div class="prize-color" style="background: ${prize.color};"></div>
            <div class="prize-info">
                <input type="text" class="prize-name" value="${prize.name}" placeholder="Prize name">
                <input type="number" class="prize-value" value="${prize.value}" placeholder="Value">
            </div>
            <div class="prize-probability">
                <span>${prize.probability}%</span>
            </div>
            <div class="prize-actions">
                <button class="prize-btn color-btn">
                    <i class="fas fa-palette"></i>
                </button>
                <button class="prize-btn delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        prizesList.appendChild(prizeItem);
    });
    
    updateProbability();
    
    document.querySelectorAll('.prize-btn.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const index = Array.from(prizeItem.parentElement.children).indexOf(prizeItem);
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = gameState.prizes[index].color;
            colorInput.addEventListener('change', (e) => {
                gameState.prizes[index].color = e.target.value;
                prizeItem.querySelector('.prize-color').style.backgroundColor = e.target.value;
                drawWheel();
                saveGameState();
            });
            colorInput.click();
        });
    });
    
    document.querySelectorAll('.prize-btn.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const index = Array.from(prizeItem.parentElement.children).indexOf(prizeItem);
            if (gameState.prizes.length > 4) {
                gameState.prizes.splice(index, 1);
                updatePrizesList();
                drawWheel();
                saveGameState();
            }
        });
    });
    
    document.querySelectorAll('.prize-name, .prize-value').forEach(input => {
        input.addEventListener('change', (e) => {
            const prizeItem = e.target.closest('.prize-item');
            const index = Array.from(prizeItem.parentElement.children).indexOf(prizeItem);
            const nameInput = prizeItem.querySelector('.prize-name');
            const valueInput = prizeItem.querySelector('.prize-value');
            
            gameState.prizes[index].name = nameInput.value;
            gameState.prizes[index].value = parseInt(valueInput.value) || 0;
            
            updateProbability();
            saveGameState();
        });
    });
}

function updatePrizesForSegments() {
    const currentSegments = gameState.prizes.length;
    const targetSegments = gameState.wheelSegments;
    
    if (targetSegments > currentSegments) {
        const colors = ['#FF9A76', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#073B4C', '#7209B7', '#F72585', '#3A86FF', '#FB5607'];
        
        for (let i = currentSegments; i < targetSegments; i++) {
            const randomValue = Math.floor(Math.random() * 1000) + 100;
            const randomProb = Math.floor(Math.random() * 15) + 5;
            
            gameState.prizes.push({
                name: `Prize ${i + 1}`,
                value: randomValue,
                color: colors[i % colors.length],
                probability: randomProb
            });
        }
    } else if (targetSegments < currentSegments) {
        gameState.prizes = gameState.prizes.slice(0, targetSegments);
    }
    
    updateProbability();
    updatePrizesList();
}

function updateProbability() {
    const totalProbability = gameState.prizes.reduce((sum, prize) => sum + prize.probability, 0);
    const probabilityElement = document.getElementById('totalProbability');
    const warningElement = document.getElementById('probabilityWarning');
    
    probabilityElement.textContent = totalProbability + '%';
    
    if (totalProbability !== 100) {
        const adjustment = (100 - totalProbability) / gameState.prizes.length;
        gameState.prizes.forEach(prize => {
            prize.probability = Math.max(1, Math.round(prize.probability + adjustment));
        });
        
        const newTotal = gameState.prizes.reduce((sum, prize) => sum + prize.probability, 0);
        probabilityElement.textContent = newTotal + '%';
        
        if (newTotal !== 100) {
            warningElement.textContent = 'Probabilities adjusted to total 100%';
            warningElement.style.color = '#FFE66D';
        } else {
            warningElement.textContent = '';
        }
    } else {
        warningElement.textContent = '';
    }
    
    document.querySelectorAll('.prize-probability span').forEach((span, index) => {
        if (gameState.prizes[index]) {
            span.textContent = gameState.prizes[index].probability + '%';
        }
    });
}

function updatePrizeColors() {
    document.querySelectorAll('.prize-color').forEach((div, index) => {
        if (gameState.prizes[index]) {
            gameState.prizes[index].color = div.style.backgroundColor;
        }
    });
    drawWheel();
    saveGameState();
}

function addNewPrize() {
    const colors = ['#FF9A76', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#073B4C'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomValue = Math.floor(Math.random() * 1000) + 100;
    
    gameState.prizes.push({
        name: 'New Prize',
        value: randomValue,
        color: randomColor,
        probability: 10
    });
    
    gameState.wheelSegments = gameState.prizes.length;
    wheelSegmentsInput.value = gameState.wheelSegments;
    document.getElementById('segmentsValue').textContent = gameState.wheelSegments;
    
    updatePrizesList();
    drawWheel();
    saveGameState();
}

function randomizePrizes() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#A8D8EA', '#AA96DA', '#FFD3B6', '#FF9A76', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#073B4C', '#7209B7', '#F72585'];
    const names = ['Jackpot', 'Mega Win', 'Big Prize', 'Good Win', 'Small Win', 'Bonus', 'Free Spin', 'Try Again', 'Coin Rain', 'Lucky Win', 'Special Prize', 'Mystery Box'];
    
    gameState.prizes = [];
    
    for (let i = 0; i < gameState.wheelSegments; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomValue = Math.floor(Math.random() * 5000) + 100;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomProb = Math.floor(Math.random() * 20) + 5;
        
        gameState.prizes.push({
            name: randomName,
            value: randomValue,
            color: randomColor,
            probability: randomProb
        });
    }
    
    updateProbability();
    updatePrizesList();
    drawWheel();
    saveGameState();
}

function updateAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';
    
    gameState.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-icon">
                <i class="fas fa-${achievement.unlocked ? 'check' : 'lock'}"></i>
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
            <div class="achievement-reward">+${achievement.reward}</div>
        `;
        achievementsGrid.appendChild(achievementElement);
    });
}

function checkAchievements() {
    if (gameState.totalSpins >= 100) {
        unlockAchievement(4);
    }
    
    if (gameState.spinStreak >= 10) {
        unlockAchievement(5);
    }
    
    const totalSpent = (gameState.totalSpins * gameState.spinCost) - gameState.stats.totalWon;
    if (totalSpent >= 10000) {
        unlockAchievement(6);
    }
}

function unlockAchievement(achievementId) {
    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        gameState.coins += achievement.reward;
        updateAchievements();
        updateUI();
        
        alert(`Achievement Unlocked: ${achievement.name}\nReward: +${achievement.reward} coins`);
        saveGameState();
    }
}

function updateResultsList() {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    gameState.results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.isJackpot ? 'jackpot' : ''}`;
        resultItem.innerHTML = `
            <div class="result-icon">
                <i class="fas fa-${result.isJackpot ? 'crown' : 'gift'}"></i>
            </div>
            <div class="result-details">
                <div class="result-prize">${result.prize}</div>
                <div class="result-time">${result.time}</div>
            </div>
            <div class="result-amount">+${result.value}</div>
        `;
        resultsList.appendChild(resultItem);
    });
}

function clearResults() {
    if (confirm('Clear all results history?')) {
        gameState.results = [];
        updateResultsList();
        saveGameState();
    }
}

function claimCurrentPrize() {
    if (gameState.currentWin) {
        claimPrizeButton.disabled = true;
        gameState.currentWin = null;
        saveGameState();
    }
}

function toggleAutoSpin() {
    gameState.autoSpin = !gameState.autoSpin;
    autoSpinButton.classList.toggle('active', gameState.autoSpin);
    
    if (gameState.autoSpin) {
        gameState.autoSpinCount = 10;
        autoSpinButton.innerHTML = '<i class="fas fa-stop"></i> Stop Auto Spin';
        
        if (gameState.coins >= gameState.spinCost) {
            handleSpin();
        } else {
            toggleAutoSpin();
            alert('Not enough coins for auto spin!');
        }
    } else {
        autoSpinButton.innerHTML = '<i class="fas fa-robot"></i> Auto Spin';
        if (autoSpinInterval) {
            clearInterval(autoSpinInterval);
            autoSpinInterval = null;
        }
    }
}

function startFreeSpinTimer() {
    freeSpinInterval = setInterval(() => {
        if (gameState.freeSpinTimer > 0) {
            gameState.freeSpinTimer--;
            const minutes = Math.floor(gameState.freeSpinTimer / 60);
            const seconds = gameState.freeSpinTimer % 60;
            document.getElementById('freeSpinTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (gameState.freeSpinTimer <= 0) {
            spinButton.disabled = false;
        }
        
        saveGameState();
    }, 1000);
}

function playSound(soundElement) {
    if (gameState.soundVolume > 0) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.log("Audio error:", e));
    }
}

function saveGameState() {
    localStorage.setItem('spinWheelPro', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('spinWheelPro');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            Object.assign(gameState, savedState);
            
            wheelSegmentsInput.value = gameState.wheelSegments;
            spinDurationInput.value = gameState.spinDuration;
            spinPowerInput.value = gameState.spinPower;
            soundVolumeInput.value = gameState.soundVolume;
            
            document.getElementById('segmentsValue').textContent = gameState.wheelSegments;
            document.getElementById('durationValue').textContent = gameState.spinDuration + 's';
            document.getElementById('powerValue').textContent = gameState.spinPower;
            document.getElementById('volumeValue').textContent = gameState.soundVolume + '%';
            
            updateSoundVolume();
        } catch (e) {
            console.log("Error loading saved state:", e);
        }
    }
}

window.addEventListener('load', init);