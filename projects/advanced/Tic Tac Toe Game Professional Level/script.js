// Game State
const gameState = {
    currentPlayer: 'X',
    gameBoard: Array(9).fill(''),
    gameActive: true,
    gameMode: 'pvp',
    difficulty: 'easy',
    scores: {
        X: 0,
        O: 0,
        draws: 0
    },
    moveHistory: [],
    gameHistory: [],
    totalGames: 0,
    fastestWin: Infinity,
    timer: 0,
    timerInterval: null,
    moveCount: 0
};

// DOM Elements
const cells = [];
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const turnX = document.getElementById('turnX');
const turnO = document.getElementById('turnO');
const timerElement = document.getElementById('timer');
const moveCountElement = document.getElementById('moveCount');
const historyList = document.getElementById('historyList');
const totalGamesElement = document.getElementById('totalGames');
const winRateElement = document.getElementById('winRate');
const fastestWinElement = document.getElementById('fastestWin');
const winAnimation = document.getElementById('winAnimation');
const winnerMessage = document.getElementById('winnerMessage');

// Audio Elements
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

// Winning Combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Game
function initGame() {
    createBoard();
    setupEventListeners();
    updateUI();
    startTimer();
    loadGameState();
}

// Create Game Board
function createBoard() {
    gameBoard.innerHTML = '';
    cells.length = 0;
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        
        cell.addEventListener('click', () => handleCellClick(i));
        cell.addEventListener('mouseenter', () => handleCellHover(i, true));
        cell.addEventListener('mouseleave', () => handleCellHover(i, false));
        
        gameBoard.appendChild(cell);
        cells.push(cell);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Game Mode Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.gameMode = btn.dataset.mode;
            resetGame();
        });
    });
    
    // Difficulty Buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.difficulty = btn.dataset.difficulty;
        });
    });
    
    // Action Buttons
    document.getElementById('newGame').addEventListener('click', resetGame);
    document.getElementById('resetScore').addEventListener('click', resetScore);
    document.getElementById('undoMove').addEventListener('click', undoMove);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    document.getElementById('closeAnimation').addEventListener('click', () => {
        winAnimation.classList.remove('active');
    });
    
    // Instructions Toggle
    const toggleBtn = document.getElementById('toggleInstructions');
    const instructionsContent = document.getElementById('instructionsContent');
    
    toggleBtn.addEventListener('click', () => {
        instructionsContent.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });
}

// Handle Cell Click
function handleCellClick(index) {
    if (!gameState.gameActive || gameState.gameBoard[index] !== '') {
        return;
    }
    
    // Play click sound
    playSound(clickSound);
    
    // Make move
    makeMove(index, gameState.currentPlayer);
    
    // Check for win or draw
    if (checkWin(gameState.currentPlayer)) {
        handleWin(gameState.currentPlayer);
        return;
    }
    
    if (checkDraw()) {
        handleDraw();
        return;
    }
    
    // Switch player
    switchPlayer();
    
    // If AI's turn
    if ((gameState.gameMode === 'pvc' && gameState.currentPlayer === 'O') ||
        (gameState.gameMode === 'cvc')) {
        setTimeout(makeAIMove, 500);
    }
}

// Handle Cell Hover
function handleCellHover(index, isEntering) {
    if (!gameState.gameActive || gameState.gameBoard[index] !== '') {
        return;
    }
    
    const cell = cells[index];
    if (isEntering) {
        cell.textContent = gameState.currentPlayer;
        cell.classList.add(gameState.currentPlayer.toLowerCase());
        cell.style.opacity = '0.5';
    } else {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.style.opacity = '1';
    }
}

// Make Move
function makeMove(index, player) {
    // Save move to history for undo
    gameState.moveHistory.push({
        index: index,
        player: player,
        board: [...gameState.gameBoard]
    });
    
    // Update game state
    gameState.gameBoard[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].style.opacity = '1';
    
    // Update move count
    gameState.moveCount++;
    moveCountElement.textContent = `Move: ${gameState.moveCount}`;
}

// Make AI Move
function makeAIMove() {
    if (!gameState.gameActive) return;
    
    let moveIndex;
    
    switch (gameState.difficulty) {
        case 'easy':
            moveIndex = getEasyAIMove();
            break;
        case 'medium':
            moveIndex = getMediumAIMove();
            break;
        case 'hard':
            moveIndex = getHardAIMove();
            break;
        default:
            moveIndex = getEasyAIMove();
    }
    
    if (moveIndex !== -1) {
        makeMove(moveIndex, gameState.currentPlayer);
        
        if (checkWin(gameState.currentPlayer)) {
            handleWin(gameState.currentPlayer);
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        switchPlayer();
        
        // If CVC mode, continue AI moves
        if (gameState.gameMode === 'cvc') {
            setTimeout(makeAIMove, 500);
        }
    }
}

// AI Move Functions
function getEasyAIMove() {
    const emptyCells = gameState.gameBoard
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1);
    
    if (emptyCells.length === 0) return -1;
    
    // Random move
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumAIMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (gameState.gameBoard[i] === '') {
            gameState.gameBoard[i] = 'O';
            if (checkWin('O')) {
                gameState.gameBoard[i] = '';
                return i;
            }
            gameState.gameBoard[i] = '';
        }
    }
    
    // Block player
    for (let i = 0; i < 9; i++) {
        if (gameState.gameBoard[i] === '') {
            gameState.gameBoard[i] = 'X';
            if (checkWin('X')) {
                gameState.gameBoard[i] = '';
                return i;
            }
            gameState.gameBoard[i] = '';
        }
    }
    
    // Take center if available
    if (gameState.gameBoard[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState.gameBoard[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return getEasyAIMove();
}

function getHardAIMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (gameState.gameBoard[i] === '') {
            gameState.gameBoard[i] = 'O';
            if (checkWin('O')) {
                gameState.gameBoard[i] = '';
                return i;
            }
            gameState.gameBoard[i] = '';
        }
    }
    
    // Block player
    for (let i = 0; i < 9; i++) {
        if (gameState.gameBoard[i] === '') {
            gameState.gameBoard[i] = 'X';
            if (checkWin('X')) {
                gameState.gameBoard[i] = '';
                return i;
            }
            gameState.gameBoard[i] = '';
        }
    }
    
    // Take center
    if (gameState.gameBoard[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState.gameBoard[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take edges
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => gameState.gameBoard[i] === '');
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
    
    return -1;
}

// Check for Win
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState.gameBoard[index] === player);
    });
}

// Check for Draw
function checkDraw() {
    return gameState.gameBoard.every(cell => cell !== '');
}

// Handle Win
function handleWin(winner) {
    gameState.gameActive = false;
    stopTimer();
    
    // Update scores
    gameState.scores[winner]++;
    
    // Update fastest win
    if (gameState.timer < gameState.fastestWin) {
        gameState.fastestWin = gameState.timer;
    }
    
    // Highlight winning cells
    const winningCombo = winningCombinations.find(combo =>
        combo.every(index => gameState.gameBoard[index] === winner)
    );
    
    if (winningCombo) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winning');
        });
    }
    
    // Add to history
    addToHistory(`${winner} Wins!`, 'win');
    
    // Update UI
    updateUI();
    
    // Show win animation
    showWinAnimation(`${winner} Wins!`);
    
    // Play win sound
    playSound(winSound);
}

// Handle Draw
function handleDraw() {
    gameState.gameActive = false;
    gameState.scores.draws++;
    stopTimer();
    
    // Add to history
    addToHistory('Game Draw!', 'draw');
    
    // Update UI
    updateUI();
    
    // Show draw message
    showWinAnimation('Game Draw!');
    
    // Play draw sound
    playSound(drawSound);
}

// Switch Player
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
    updateStatus();
}

// Reset Game
function resetGame() {
    gameState.currentPlayer = 'X';
    gameState.gameBoard = Array(9).fill('');
    gameState.gameActive = true;
    gameState.moveHistory = [];
    gameState.moveCount = 0;
    gameState.timer = 0;
    
    // Reset timer
    stopTimer();
    startTimer();
    
    // Clear board
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning');
        cell.style.opacity = '1';
    });
    
    // Update UI
    updateUI();
    
    // If CVC mode, start AI moves
    if (gameState.gameMode === 'cvc') {
        setTimeout(makeAIMove, 1000);
    }
}

// Reset Score
function resetScore() {
    if (confirm('Are you sure you want to reset all scores?')) {
        gameState.scores = { X: 0, O: 0, draws: 0 };
        gameState.gameHistory = [];
        gameState.totalGames = 0;
        gameState.fastestWin = Infinity;
        updateUI();
        saveGameState();
    }
}

// Undo Move
function undoMove() {
    if (gameState.moveHistory.length === 0 || !gameState.gameActive) {
        return;
    }
    
    const lastMove = gameState.moveHistory.pop();
    
    // Restore board state
    gameState.gameBoard = lastMove.board;
    gameState.currentPlayer = lastMove.player;
    gameState.moveCount--;
    
    // Update board display
    cells.forEach((cell, index) => {
        cell.textContent = gameState.gameBoard[index];
        cell.classList.remove('x', 'o', 'winning');
        if (gameState.gameBoard[index] !== '') {
            cell.classList.add(gameState.gameBoard[index].toLowerCase());
        }
    });
    
    // Update UI
    updateUI();
    
    // Stop timer if game was over
    if (!gameState.gameActive) {
        gameState.gameActive = true;
        startTimer();
    }
}

// Update UI
function updateUI() {
    // Update scores
    scoreX.textContent = gameState.scores.X;
    scoreO.textContent = gameState.scores.O;
    
    // Update turn indicator
    updateTurnIndicator();
    
    // Update status
    updateStatus();
    
    // Update timer
    updateTimerDisplay();
    
    // Update statistics
    updateStatistics();
    
    // Save game state
    saveGameState();
}

// Update Turn Indicator
function updateTurnIndicator() {
    turnX.classList.toggle('active', gameState.currentPlayer === 'X');
    turnO.classList.toggle('active', gameState.currentPlayer === 'O');
}

// Update Status
function updateStatus() {
    const statusText = gameState.gameActive 
        ? `${gameState.currentPlayer}'s Turn`
        : 'Game Over';
    
    gameStatus.querySelector('.status-text').textContent = statusText;
}

// Timer Functions
function startTimer() {
    stopTimer();
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Game History
function addToHistory(result, type) {
    gameState.totalGames++;
    
    const historyItem = {
        id: Date.now(),
        result: result,
        type: type,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: gameState.timer,
        moves: gameState.moveCount
    };
    
    gameState.gameHistory.unshift(historyItem);
    
    // Keep only last 10 games
    if (gameState.gameHistory.length > 10) {
        gameState.gameHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    gameState.gameHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-result">
                <div class="result-icon ${item.type}">
                    ${item.type === 'win' ? '🏆' : '🤝'}
                </div>
                <div>
                    <strong>${item.result}</strong>
                    <div>${item.moves} moves • ${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}</div>
                </div>
            </div>
            <div class="history-time">${item.time}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear game history?')) {
        gameState.gameHistory = [];
        updateHistoryDisplay();
        saveGameState();
    }
}

// Update Statistics
function updateStatistics() {
    totalGamesElement.textContent = gameState.totalGames;
    
    // Calculate win rate
    const totalWins = gameState.scores.X + gameState.scores.O;
    const winRate = gameState.totalGames > 0 ? Math.round((totalWins / gameState.totalGames) * 100) : 0;
    winRateElement.textContent = `${winRate}%`;
    
    // Update fastest win
    const fastest = gameState.fastestWin === Infinity ? 0 : gameState.fastestWin;
    const fastestMinutes = Math.floor(fastest / 60);
    const fastestSeconds = fastest % 60;
    fastestWinElement.textContent = `${fastestMinutes}:${fastestSeconds.toString().padStart(2, '0')}`;
}

// Show Win Animation
function showWinAnimation(message) {
    winnerMessage.textContent = message;
    winAnimation.classList.add('active');
}

// Play Sound
function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("Audio play failed:", e));
}

// Save/Load Game State
function saveGameState() {
    const saveData = {
        scores: gameState.scores,
        gameHistory: gameState.gameHistory,
        totalGames: gameState.totalGames,
        fastestWin: gameState.fastestWin
    };
    
    localStorage.setItem('ticTacToePro', JSON.stringify(saveData));
}

function loadGameState() {
    const savedData = localStorage.getItem('ticTacToePro');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            gameState.scores = data.scores || { X: 0, O: 0, draws: 0 };
            gameState.gameHistory = data.gameHistory || [];
            gameState.totalGames = data.totalGames || 0;
            gameState.fastestWin = data.fastestWin || Infinity;
            
            updateUI();
            updateHistoryDisplay();
        } catch (e) {
            console.log("Error loading saved data:", e);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);