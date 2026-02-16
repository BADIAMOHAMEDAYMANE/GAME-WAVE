const boxes = document.querySelectorAll(".box");
const statusEl = document.querySelector(".status");
const restartBtnEl = document.getElementById("restartBtn");
const gameContainer = document.getElementById("game-container");
const expandBtn = document.getElementById("expand-btn");
const themeBtn = document.getElementById("theme-btn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const modeOverlay = document.getElementById("mode-selection");
const gameTitle = document.getElementById("game-title");

const imgX = "./X-Player.png";
const imgO = "./O-Player.png";

const winPossibilities = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "1";
let running = false;
let scoreX = 0;
let scoreO = 0;
let gameMode = "pvp";

initializeGame();

function initializeGame() {
    boxes.forEach(box => box.addEventListener("click", boxClicked));
    restartBtnEl.addEventListener("click", restartGame);

    // Cliquer sur le titre permet de revenir au menu
    gameTitle.addEventListener("click", () => {
        modeOverlay.classList.remove("hidden");
        running = false;
    });
}

function setMode(mode) {
    gameMode = mode;
    modeOverlay.classList.add("hidden");
    document.getElementById("labelO").textContent = mode === "pva" ? "IA (O)" : "PLAYER 2";
    restartGame();
}

function boxClicked() {
    const cellIndex = this.getAttribute("data-index");
    if (options[cellIndex] !== "" || !running) return;

    updateBox(this, cellIndex);
    checkWinner();

    if (gameMode === "pva" && running && currentPlayer === "O") {
        setTimeout(aiTurn, 500);
    }
}

function updateBox(box, index) {
    options[index] = currentPlayer;
    box.innerHTML = `<img src="${currentPlayer === "X" ? imgX : imgO}" alt="${currentPlayer}">`;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusEl.textContent = `Turn of ${currentPlayer}`;
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winPossibilities.length; i++) {
        const condition = winPossibilities[i];
        if (options[condition[0]] && options[condition[0]] === options[condition[1]] && options[condition[0]] === options[condition[2]]) {
            roundWon = true;
            condition.forEach(index => boxes[index].classList.add("win"));
            break;
        }
    }

    if (roundWon) {
        statusEl.textContent = `Victory of ${currentPlayer} ! 🏆`;
        updateScore();
        running = false;
        restartBtnEl.classList.add("pulse");
    } else if (!options.includes("")) {
        statusEl.textContent = `Draw ! 🤝`;
        running = false;
        restartBtnEl.classList.add("pulse");
    } else {
        changePlayer();
    }
}

// --- IA MINIMAX ---
function aiTurn() {
    if (!running) return;
    const iqLevel = (scoreX > scoreO + 1) ? 1.0 : 0.6;
    let choice;

    if (Math.random() > iqLevel) {
        const available = options.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        choice = available[Math.floor(Math.random() * available.length)];
    } else {
        choice = getBestMove();
    }

    const targetBox = document.querySelector(`.box[data-index="${choice}"]`);
    updateBox(targetBox, choice);
    checkWinner();
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (options[i] === "") {
            options[i] = "O";
            const score = minimax(options, 0, false);
            options[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = { "O": 10, "X": -10, "tie": 0 };
    const result = evaluateBoard(board);
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return bestScore;
    }
}

function evaluateBoard(board) {
    for (const cond of winPossibilities) {
        if (board[cond[0]] && board[cond[0]] === board[cond[1]] && board[cond[0]] === board[cond[2]]) return board[cond[0]];
    }
    return board.includes("") ? null : "tie";
}

function updateScore() {
    if (currentPlayer === "X") { scoreX++; scoreXEl.textContent = scoreX; }
    else { scoreO++; scoreOEl.textContent = scoreO; }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusEl.textContent = `Turn of ${currentPlayer}`;
    boxes.forEach(box => { box.innerHTML = ""; box.classList.remove("win"); });
    restartBtnEl.classList.remove("pulse");
    running = true;
}

// Contrôles
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

expandBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => console.error(err));
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});