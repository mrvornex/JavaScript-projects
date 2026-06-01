const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const scoreXElem = document.getElementById('scoreX');
const scoreOElem = document.getElementById('scoreO');

let currentPlayer = 'X';
let boardState = Array(9).fill('');
let scoreX = 0;
let scoreO = 0;
let gameOver = false;

const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

function handleClick(e) {
    const index = e.target.dataset.index;

    if (boardState[index] !== '' || gameOver) return;

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) {
        message.textContent = `Player ${currentPlayer} Wins! 🎉`;
        updateScore();
        gameOver = true;
        highlightWinningCells();
        return;
    }

    if (!boardState.includes('')) {
        message.textContent = "It's a Draw! 🤝";
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a,b,c] = combination;
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        const [a,b,c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            cells[a].style.background = 'lime';
            cells[b].style.background = 'lime';
            cells[c].style.background = 'lime';
        }
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElem.textContent = scoreX;
    } else {
        scoreO++;
        scoreOElem.textContent = scoreO;
    }
}

function resetGame() {
    boardState.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '';
    });
    currentPlayer = 'X';
    message.textContent = '';
    gameOver = false;
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
