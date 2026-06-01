// Game variables
let gameBoard = document.getElementById('game-board');
let movesDisplay = document.getElementById('moves');
let timerDisplay = document.getElementById('timer');
let scoreDisplay = document.getElementById('score');
let restartBtn = document.getElementById('restart-btn');
let newGameBtn = document.getElementById('new-game-btn');
let diffButtons = document.querySelectorAll('.diff-btn');
let message = document.getElementById('message');
let messageTitle = document.getElementById('message-title');
let messageText = document.getElementById('message-text');
let finalMoves = document.getElementById('final-moves');
let finalTime = document.getElementById('final-time');
let finalScore = document.getElementById('final-score');
let playAgainBtn = document.getElementById('play-again-btn');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let score = 0;
let gameStarted = false;
let timer = 0;
let timerInterval = null;
let currentDifficulty = 'easy';

// Emoji sets for different difficulties
const emojiSets = {
    easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
    hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵']
};

// Difficulty configurations
const difficultyConfig = {
    easy: { rows: 4, cols: 4, timeBonus: 500, moveBonus: 10 },
    medium: { rows: 4, cols: 5, timeBonus: 800, moveBonus: 15 },
    hard: { rows: 5, cols: 6, timeBonus: 1200, moveBonus: 20 }
};

// Initialize game
function initGame(difficulty = 'easy') {
    // Reset game state
    clearInterval(timerInterval);
    gameStarted = false;
    timer = 0;
    moves = 0;
    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    cards = [];
    
    // Update displays
    movesDisplay.textContent = moves;
    timerDisplay.textContent = `${timer}s`;
    scoreDisplay.textContent = score;
    
    // Set difficulty
    currentDifficulty = difficulty;
    const config = difficultyConfig[difficulty];
    
    // Calculate total pairs
    totalPairs = (config.rows * config.cols) / 2;
    
    // Update game board grid
    gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Create cards
    createCards(difficulty);
    
    // Shuffle cards
    shuffleCards();
    
    // Render cards
    renderCards();
    
    // Update active difficulty button
    diffButtons.forEach(btn => {
        if (btn.dataset.level === difficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Hide message
    message.style.display = 'none';
}

// Create card array based on difficulty
function createCards(difficulty) {
    const config = difficultyConfig[difficulty];
    const emojis = emojiSets[difficulty];
    
    // Create pairs of emojis
    for (let i = 0; i < totalPairs; i++) {
        const emoji = emojis[i % emojis.length];
        cards.push({ id: i * 2, emoji, flipped: false, matched: false });
        cards.push({ id: i * 2 + 1, emoji, flipped: false, matched: false });
    }
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Render cards to the game board
function renderCards() {
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = card.emoji;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.innerHTML = '<i class="fas fa-question"></i>';
        
        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        
        cardElement.addEventListener('click', () => flipCard(card, cardElement));
        gameBoard.appendChild(cardElement);
    });
}

// Flip a card
function flipCard(card, cardElement) {
    // Don't flip if already flipped or matched
    if (card.flipped || card.matched || flippedCards.length >= 2) return;
    
    // Start timer on first flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // Flip the card
    card.flipped = true;
    cardElement.classList.add('flipped');
    flippedCards.push({ card, element: cardElement });
    
    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        
        const card1 = flippedCards[0].card;
        const card2 = flippedCards[1].card;
        
        if (card1.emoji === card2.emoji) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            flippedCards.forEach(flipped => {
                flipped.element.classList.add('matched');
            });
            flippedCards = [];
            matchedPairs++;
            
            // Calculate and update score
            const config = difficultyConfig[currentDifficulty];
            score += config.moveBonus + Math.max(0, config.timeBonus - timer);
            scoreDisplay.textContent = score;
            
            // Check for win
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            // No match, flip back after delay
            setTimeout(() => {
                flippedCards.forEach(flipped => {
                    flipped.card.flipped = false;
                    flipped.element.classList.remove('flipped');
                });
                flippedCards = [];
            }, 1000);
        }
    }
}

// Start game timer
function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerDisplay.textContent = `${timer}s`;
    
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `${timer}s`;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    
    // Update final stats
    finalMoves.textContent = moves;
    finalTime.textContent = `${timer}s`;
    finalScore.textContent = score;
    
    // Determine message based on performance
    const config = difficultyConfig[currentDifficulty];
    const maxTime = config.timeBonus;
    const maxMoves = totalPairs * 2;
    
    if (moves <= totalPairs) {
        messageTitle.textContent = 'Perfect! 🎉';
        messageText.textContent = 'You have an amazing memory!';
    } else if (moves <= maxMoves) {
        messageTitle.textContent = 'Great Job! 👍';
        messageText.textContent = 'You found all the matching pairs!';
    } else {
        messageTitle.textContent = 'Good Game! 👏';
        messageText.textContent = 'You completed the memory challenge!';
    }
    
    // Show message
    message.style.display = 'flex';
}

// Event Listeners
restartBtn.addEventListener('click', () => {
    initGame(currentDifficulty);
});

newGameBtn.addEventListener('click', () => {
    initGame(currentDifficulty);
});

playAgainBtn.addEventListener('click', () => {
    initGame(currentDifficulty);
});

diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        initGame(btn.dataset.level);
    });
});

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    initGame('easy');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        initGame(currentDifficulty);
    }
    
    if (e.key === 'Escape') {
        message.style.display = 'none';
    }
    
    if (e.key >= '1' && e.key <= '3') {
        const difficulties = ['easy', 'medium', 'hard'];
        initGame(difficulties[parseInt(e.key) - 1]);
    }
});