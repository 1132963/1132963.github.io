const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetScore = document.getElementById('resetScore');
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreTieEl = document.getElementById('scoreTie');

let board, current, active;
let scoreX = 0, scoreO = 0, scoreTie = 0;

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function init() {
    board = Array(9).fill('');
    current = 'X';
    active = true;
    cells.forEach(c => {
        c.textContent = '';
        c.className = 'cell';
        c.disabled = false;
    });
    turnEl.textContent = current;
    stateEl.textContent = '';
}

function place(idx) {
    if (!active || board[idx]) return;

    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase());

    const result = evaluate();

    if (result.finished) {
        endGame(result);
    } else {
        switchTurn();
    }
}

function switchTurn() {
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
}

function evaluate() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { finished: true, winner: board[a], line };
        }
    }
    if (board.every(v => v)) return { finished: true, winner: null };
    return { finished: false };
}

function endGame({ winner, line }) {
    active = false;

    if (winner) {
        stateEl.textContent = `${winner} 勝)`;
        line.forEach(i => cells[i].classList.add('win'));

        if (winner === 'X') scoreX++;
        else scoreO++;
    } else {
        stateEl.textContent = '平手';
        scoreTie++;
    }

    updateScore();
    cells.forEach(c => c.disabled = true);
}

function updateScore() {
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreTieEl.textContent = scoreTie;
}

function resetScoreboard() {
    scoreX = 0;
    scoreO = 0;
    scoreTie = 0;
    updateScore();
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

btnReset.addEventListener('click', init);
btnResetScore.addEventListener('click', resetScoreboard);
