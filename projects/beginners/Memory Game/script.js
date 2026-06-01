const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');
const messageDisplay = document.getElementById('message');

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;

// Emoji pairs
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

// Initialize game
function initGame() {
    // Clear board
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    time = 0;
    gameStarted = false;
    
    // Reset displays
    movesDisplay.textContent = moves;
    timeDisplay.textContent = time + 's';
    messageDisplay.textContent = 'Click cards to start!';
    
    // Clear timer
    clearInterval(timer);
    
    // Create card pairs
    let cardValues = [...emojis, ...emojis];
    
    // Shuffle cards
    cardValues.sort(() => Math.random() - 0.5);
    
    // Create cards
    cardValues.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.textContent = '?';
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Flip card function
function flipCard(card) {
    // Don't flip if: already flipped, matched, or 2 cards already flipped
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        flippedCards.length === 2) {
        return;
    }
    
    // Start timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // Flip card
    card.classList.add('flipped');
    card.textContent = card.dataset.value;
    flippedCards.push(card);
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                flippedCards = [];
                matchedPairs++;
                
                // Check for win
                if (matchedPairs === emojis.length) {
                    clearInterval(timer);
                    messageDisplay.textContent = `🎉 You won in ${moves} moves and ${time} seconds!`;
                }
            }, 500);
        } else {
            // No match - flip back
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '?';
                card2.textContent = '?';
                flippedCards = [];
            }, 1000);
        }
    }
}

// Timer function
function startTimer() {
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time + 's';
    }, 1000);
}

// Event listeners
restartBtn.addEventListener('click', initGame);

// Start game
initGame();