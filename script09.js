let board = Array(9).fill(null);
let current = 'X';
let active = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

function init() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(9).fill(null);
    active = true;
    current = 'X';
    document.getElementById('status').innerText = '玩家 (X) 先手';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
}

function playerMove(i) {
    if (!active || board[i]) return;
    board[i] = 'X';
    updateBoard();

    if (checkWin('X')) return endGame('玩家 (X) 勝利！', 'X');
    if (isFull()) return endGame('平手！', 'D');

    current = 'O';
    document.getElementById('status').innerText = '電腦思考中...';

    setTimeout(computerMove, 600);
}

function computerMove() {
    let move = findWinningMove('O');
    if (move === null) move = findWinningMove('X');
    if (move === null) move = getRandomMove();

    board[move] = 'O';
    updateBoard();

    if (checkWin('O')) return endGame('電腦 (O) 勝利！', 'O');
    if (isFull()) return endGame('平手！', 'D');

    current = 'X';
    document.getElementById('status').innerText = '輪到玩家 (X)';
}

function findWinningMove(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let [a, b, c] of wins) {
        const line = [board[a], board[b], board[c]];
        if (line.filter(v => v === player).length === 2 && line.includes(null)) {
            return [a, b, c][line.indexOf(null)];
        }
    }
    return null;
}

function getRandomMove() {
    const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = board[i] || '';
    }
}

function checkWin(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(([a,b,c]) => board[a] === player && board[b] === player && board[c] === player);
}

function isFull() {
    return board.every(cell => cell !== null);
}

function endGame(message, result) {
    document.getElementById('status').innerText = message;
    active = false;
    if (result === 'X') {
        scoreX++;
    } else if (result === 'O') {
        scoreO++;
    } else if (result === 'D') {
        scoreDraw++;
    }

    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById('scoreX').innerText = scoreX;
    document.getElementById('scoreO').innerText = scoreO;
    document.getElementById('scoreDraw').innerText = scoreDraw;
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;
    updateScoreboard();
}

function resetGame() {
    init();
}

init();