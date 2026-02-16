const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const gameOverOverlay = document.getElementById("game-over-overlay");
const finalScoreText = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");

const gameContainer = document.getElementById("game-container");
const expandBtn = document.getElementById("expand-btn");
const themeBtn = document.getElementById("theme-btn");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = highScore;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    finalScoreText.innerText = `Score final : ${score}`;
    gameOverOverlay.classList.remove("hidden");
    replayBtn.classList.add("pulse"); // Active le clignotement
};

const resetGame = () => {
    score = 0;
    snakeX = 5;
    snakeY = 5;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    gameOver = false;
    scoreElement.innerText = score;
    gameOverOverlay.classList.add("hidden");
    replayBtn.classList.remove("pulse"); // Désactive le clignotement
    updateFoodPosition();
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, 125);
};

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0; velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0; velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1; velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1; velocityY = 0;
    }
};

const initGame = () => {
    // Logic tick only (keeps existing movement speed)
    if (gameOver) return handleGameOver();

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = Math.max(score, highScore);
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = score;
        highScoreElement.innerText = highScore;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody[0] = [snakeY, snakeX];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
            break;
        }
    }
};

// Render at 60 FPS (separate from logic)
function renderGame() {
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (const segment of snakeBody) {
        html += `<div class="head" style="grid-area: ${segment[0]} / ${segment[1]}"></div>`;
    }
    playBoard.innerHTML = html;
}

function renderLoop() {
    renderGame();
    requestAnimationFrame(renderLoop);
}

// --- PLEIN ÉCRAN ---
expandBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    } else {
        gameContainer.requestFullscreen().catch(err => {
            console.error(`Erreur : ${err.message}`);
        });
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    }
});

// --- THÈME (Light/Dark) ---
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

globalThis.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
}, false);

replayBtn.addEventListener("click", resetGame);
controls.forEach(button => {
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }));
});
document.addEventListener("keydown", changeDirection);

updateFoodPosition();
setIntervalId = setInterval(initGame, 125);
// Start smooth rendering loop (60 FPS) while keeping logic tick at 125ms
requestAnimationFrame(renderLoop);