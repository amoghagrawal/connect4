const preloadImages = () => {
    const playerImg = new Image();
    const aiImg = new Image();
    const frameImg = new Image();
    playerImg.src = 'sprites/Player.png';
    aiImg.src = 'sprites/AI.png';
    frameImg.src = '/frame.png';
};
preloadImages();

function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameContent').style.display = 'flex';
    createBoard();
    resetGame();
}

const ROWS = 6;
const COLS = 7;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
let gameOver = false;
let playerTurn = true;

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let col = 0; col < COLS; col++) {
        const column = document.createElement('div');
        column.className = 'column';
        column.onclick = () => makeMove(col);
        
        for (let row = 0; row < ROWS; row++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const img = document.createElement('img');
            img.src = 'sprites/Player.png';
            cell.appendChild(img);
            
            column.appendChild(cell);
        }
        boardElement.appendChild(column);
    }
}

function updateBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const img = cell.querySelector('img');
            
            if (board[row][col] === 'player') {
                cell.className = 'cell player';
                img.src = 'sprites/Player.png';
            } else if (board[row][col] === 'ai') {
                cell.className = 'cell ai';
                img.src = 'sprites/AI.png';
            } else {
                cell.className = 'cell';
            }
        }
    }
}

function makeMove(col) {
    if (gameOver || !playerTurn) return;
    
    const row = getLowestEmptyRow(col);
    if (row === -1) return;
    
    board[row][col] = 'player';
    updateBoard();
    
    if (checkWin(row, col, 'player')) {
        setTimeout(() => {
            showGameOver('You win! 🎉');
            gameOver = true;
        }, 800);
        return;
    }
    
    if (isBoardFull()) {
        showGameOver("It's a draw!");
        gameOver = true;
        return;
    }
    
    playerTurn = false;
    document.getElementById('status').textContent = 'AI is thinking...';
    
    let winningMove = findWinningMove('ai');
    if (winningMove !== null) {
        setTimeout(() => {
            const aiRow = getLowestEmptyRow(winningMove);
            board[aiRow][winningMove] = 'ai';
            updateBoard();
            
            setTimeout(() => {
                showGameOver('AI wins!');
                gameOver = true;
            }, 800);
        }, 1000);
        return;
    }
    
    setTimeout(aiMove, 1000);
}

function aiMove() {
    if (gameOver) return;
    
    let move = findWinningMove('player') || findRandomMove();
    
    const row = getLowestEmptyRow(move);
    board[row][move] = 'ai';
    updateBoard();
    
    if (checkWin(row, move, 'ai')) {
        setTimeout(() => {
            showGameOver('AI wins!');
            gameOver = true;
        }, 800);
        return;
    }
    
    if (isBoardFull()) {
        showGameOver("It's a draw!");
        gameOver = true;
        return;
    }
    
    playerTurn = true;
    document.getElementById('status').textContent = 'Your turn!';
}

function findWinningMove(player) {
    for (let col = 0; col < COLS; col++) {
        const row = getLowestEmptyRow(col);
        if (row !== -1) {
            board[row][col] = player;
            if (checkWin(row, col, player)) {
                board[row][col] = null;
                return col;
            }
            board[row][col] = null;
        }
    }
    return null;
}

function findRandomMove() {
    let availableMoves = [];
    for (let col = 0; col < COLS; col++) {
        if (getLowestEmptyRow(col) !== -1) {
            availableMoves.push(col);
        }
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getLowestEmptyRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) return row;
    }
    return -1;
}

function checkWin(row, col, player) {
    for (let c = 0; c <= COLS - 4; c++) {
        if (board[row][c] === player &&
            board[row][c+1] === player &&
            board[row][c+2] === player &&
            board[row][c+3] === player) {
            return true;
        }
    }
    
    for (let r = 0; r <= ROWS - 4; r++) {
        if (board[r][col] === player &&
            board[r+1][col] === player &&
            board[r+2][col] === player &&
            board[r+3][col] === player) {
            return true;
        }
    }
    
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player &&
                board[r-1][c+1] === player &&
                board[r-2][c+2] === player &&
                board[r-3][c+3] === player) {
                return true;
            }
        }
    }
    
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player &&
                board[r+1][c+1] === player &&
                board[r+2][c+2] === player &&
                board[r+3][c+3] === player) {
                return true;
            }
        }
    }
    
    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

function resetGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    gameOver = false;
    playerTurn = true;
    document.getElementById('status').textContent = 'Your turn!';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameContent').style.display = 'flex';
    updateBoard();
}

function showGameOver(message) {
    document.getElementById('gameContent').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('winnerText').textContent = message;
}

createBoard();