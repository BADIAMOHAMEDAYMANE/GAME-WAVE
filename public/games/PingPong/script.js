/**
 * PING PONG PRO - SCRIPT DE JEU
 * Gestion du scroll, collisions et thème Cyberpunk
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const modeBtn = document.getElementById("mode-btn");
const modeSelection = document.getElementById("mode-selection");

// Variables pour le plein écran
const expandBtn = document.getElementById("expand-btn");
const fullscreenTarget = document.getElementById("fullscreen-target");

let animationId;
let gameRunning = false;
let isPausedForAd = false;

// Game mode / AI
let gameMode = null; // 'pvp' or 'pva'
let aiEnabled = false;

// Couleurs (doivent matcher le CSS)
const COLOR_PRIMARY = "#22d3ee";
const COLOR_SECONDARY = "#a855f7";

// --- ADS & RELOAD ---
function triggerAd() {
    gameRunning = false;
    isPausedForAd = true;
    cancelAnimationFrame(animationId);

    if (typeof adBreak === 'function') {
        adBreak({
            type: 'next',
            name: 'restart-game',
            beforeAd: () => console.log("Ad showing"),
            afterAd: () => {
                isPausedForAd = false;
                location.reload();
            }
        });
    }

    setTimeout(() => { if (isPausedForAd) location.reload(); }, 500);
}

// --- LOGIQUE JEU ---
const ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

const paddleHeight = 80;
const paddleWidth = 10;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 8;

let leftScore = 0;
let rightScore = 0;
const maxScore = 5;

// --- CLAVIER & ANTI-SCROLL ---
const keys = {};

globalThis.addEventListener("keydown", function(e) {
    // BLOQUER LE SCROLL DU NAVIGATEUR
    if(["Space", "ArrowUp", "ArrowDown"].includes(e.code)) {
        e.preventDefault();
    }
    keys[e.key.toLowerCase()] = true;
    keys[e.key] = true;
}, false);

globalThis.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.key] = false;
}, false);

// --- ÉVÉNEMENTS ---
startBtn.addEventListener("click", () => {
    if (!gameRunning && !isPausedForAd) {
        if (!gameMode) {
            const overlay = document.getElementById('mode-selection');
            if (overlay) overlay.classList.remove('hidden');
            return;
        }
        gameRunning = true;
        loop();
    }
});

pauseBtn.addEventListener("click", () => {
    gameRunning = false;
    cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", triggerAd);

if (modeBtn) {
    modeBtn.addEventListener('click', () => {
        const overlay = document.getElementById('mode-selection');
        if (overlay) overlay.classList.remove('hidden');
    });
}

function update() {
    if (!gameRunning) return;

    // Mouvement Raquettes
    if (keys["w"] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (keys["s"] && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;

    if (!aiEnabled) {
        // PvP — left: W/S, right: ↑/↓
        if (keys["ArrowUp"] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
        if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
    } else {
        // PvAI — player is on the RIGHT (↑/↓). AI controls the LEFT paddle.
        if (keys["ArrowUp"] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
        if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
        aiControlLeftPaddle();
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collisions murs (consider ball radius)
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY *= -1;
        ballY = Math.max(ballRadius, Math.min(canvas.height - ballRadius, ballY));
    }

    // Collisions Raquettes (avec légère accélération) — account for ball radius
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = Math.abs(ballSpeedX) * 1.05;
        ballX = paddleWidth + ballRadius; // prevent sticking
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -Math.abs(ballSpeedX) * 1.05;
        ballX = canvas.width - paddleWidth - ballRadius;
    }

    // Scores (consider ball radius)
    if (ballX + ballRadius < 0) { rightScore++; resetBall(); }
    if (ballX - ballRadius > canvas.width) { leftScore++; resetBall(); }

    if (leftScore >= maxScore || rightScore >= maxScore) {
        gameRunning = false;
        $("#message").text(leftScore >= maxScore ? "Player 1 WIN !" : "Player 2 WIN !");
        $("#message-modal").modal("show");
    }
}

function setMode(mode) {
    gameMode = mode;
    aiEnabled = (mode === 'pva');
    const overlay = document.getElementById('mode-selection');
    if (overlay) overlay.classList.add('hidden');
    updateControlsHint();
}

function updateControlsHint() {
    const hintEl = document.getElementById('controls-hint');
    if (!hintEl) return;
    if (aiEnabled) {
        // AI on the left, player on the right
        hintEl.innerHTML = '<span><strong>Gaucher:</strong> IA</span><span class="separator">|</span><span><strong>Droitier:</strong> ↑ / ↓</span>';
    } else {
        hintEl.innerHTML = '<span><strong>Gaucher:</strong> W / S</span><span class="separator">|</span><span><strong>Droitier:</strong> ↑ / ↓</span>';
    }
}

/* Predict where the ball will be at a given X (accounts for vertical bounces) */
function predictBallYAtX(targetX) {
    if (ballSpeedX === 0) return ballY;
    const time = (targetX - ballX) / ballSpeedX;
    if (time <= 0) return ballY; // ball moving away or already past

    // linear projection then reflect across top/bottom
    let projected = ballY + ballSpeedY * time;
    const minY = ballRadius;
    const maxY = canvas.height - ballRadius;
    const range = maxY - minY;
    if (range <= 0) return Math.max(minY, Math.min(maxY, projected));

    projected -= minY;
    const period = 2 * range;
    projected = ((projected % period) + period) % period; // positive modulo
    if (projected > range) projected = period - projected;
    projected += minY;
    return projected;
}

function aiControlLeftPaddle() {
    const difficulty = 0.9;
    let aiMaxSpeed = Math.max(3, paddleSpeed * difficulty);
    const speedScale = 1 + Math.min(1.5, Math.abs(ballSpeedX) / 6);
    aiMaxSpeed *= speedScale;

    let targetTop;
    if (ballSpeedX < 0) {
        const predicted = predictBallYAtX(paddleWidth + ballRadius);
        targetTop = predicted - paddleHeight / 2;
    } else {
        // return to center when ball is moving away
        targetTop = (canvas.height - paddleHeight) / 2;
    }

    const diff = targetTop - leftPaddleY;
    if (Math.abs(diff) > 2) {
        leftPaddleY += Math.sign(diff) * Math.min(Math.abs(diff), aiMaxSpeed);
        leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
    }
}

function aiControlRightPaddle() {
    const difficulty = 0.9;
    let aiMaxSpeed = Math.max(3, paddleSpeed * difficulty);
    const speedScale = 1 + Math.min(1.5, Math.abs(ballSpeedX) / 6);
    aiMaxSpeed *= speedScale;

    let targetTop;
    if (ballSpeedX > 0) {
        const predicted = predictBallYAtX(canvas.width - paddleWidth - ballRadius);
        targetTop = predicted - paddleHeight / 2;
    } else {
        targetTop = (canvas.height - paddleHeight) / 2;
    }

    const diff = targetTop - rightPaddleY;
    if (Math.abs(diff) > 2) {
        rightPaddleY += Math.sign(diff) * Math.min(Math.abs(diff), aiMaxSpeed);
        rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
    }
}

function resetBall() {
    ballX = canvas.width / 2; ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 10;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ligne centrale
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Balle Néon
    ctx.setLineDash([]);
    ctx.fillStyle = COLOR_PRIMARY;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLOR_PRIMARY;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Raquettes Néon
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLOR_SECONDARY; ctx.shadowColor = COLOR_SECONDARY;
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

    ctx.fillStyle = COLOR_PRIMARY; ctx.shadowColor = COLOR_PRIMARY;
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Scores
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.font = "bold 35px Inter";
    ctx.fillText(leftScore, canvas.width / 4, 60);
    ctx.fillText(rightScore, canvas.width * 0.75, 60);
}

function loop() {
    update();
    draw();
    if (gameRunning) animationId = requestAnimationFrame(loop);
}

// --- GESTION PLEIN ÉCRAN ---
expandBtn.addEventListener("click", function() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    } else {
        fullscreenTarget.requestFullscreen().catch(err => {
            console.error(`Erreur: ${err.message}`);
        });
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    }
});

// Réinitialiser l'icône si l'utilisateur quitte avec la touche Echap
document.addEventListener("fullscreenchange", function() {
    if (!document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

$("#message-modal-close").on("click", triggerAd);
updateControlsHint();
draw();