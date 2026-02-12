/**
 * PING PONG PRO - SCRIPT DE JEU
 * Gestion du scroll, collisions et thème Cyberpunk
 */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");

// Variables pour le plein écran
var expandBtn = document.getElementById("expand-btn");
var fullscreenTarget = document.getElementById("fullscreen-target");

var animationId;
var gameRunning = false;
var isPausedForAd = false;

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
var ballRadius = 8;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 5;
var ballSpeedY = 5;

var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = (canvas.height - paddleHeight) / 2;
var rightPaddleY = (canvas.height - paddleHeight) / 2;
var paddleSpeed = 8;

var leftScore = 0;
var rightScore = 0;
var maxScore = 5;

// --- CLAVIER & ANTI-SCROLL ---
var keys = {};

window.addEventListener("keydown", function(e) {
    // BLOQUER LE SCROLL DU NAVIGATEUR
    if(["Space", "ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    keys[e.key.toLowerCase()] = true;
    keys[e.key] = true;
}, false);

window.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.key] = false;
}, false);

// --- ÉVÉNEMENTS ---
startBtn.addEventListener("click", () => {
    if (!gameRunning && !isPausedForAd) {
        gameRunning = true;
        loop();
    }
});

pauseBtn.addEventListener("click", () => {
    gameRunning = false;
    cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", triggerAd);

function update() {
    if (!gameRunning) return;

    // Mouvement Raquettes
    if (keys["w"] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (keys["s"] && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    if (keys["ArrowUp"] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collisions murs
    if (ballY < 0 || ballY > canvas.height) ballSpeedY *= -1;

    // Collisions Raquettes (avec légère accélération)
    if (ballX < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ballSpeedX = Math.abs(ballSpeedX) * 1.05;
    if (ballX > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) ballSpeedX = -Math.abs(ballSpeedX) * 1.05;

    // Scores
    if (ballX < 0) { rightScore++; resetBall(); }
    if (ballX > canvas.width) { leftScore++; resetBall(); }

    if (leftScore >= maxScore || rightScore >= maxScore) {
        gameRunning = false;
        $("#message").text(leftScore >= maxScore ? "JOUEUR GAUCHE GAGNE !" : "JOUEUR DROITE GAGNE !");
        $("#message-modal").modal("show");
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
    if (!document.fullscreenElement) {
        fullscreenTarget.requestFullscreen().catch(err => {
            console.error(`Erreur: ${err.message}`);
        });
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

// Réinitialiser l'icône si l'utilisateur quitte avec la touche Echap
document.addEventListener("fullscreenchange", function() {
    if (!document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

$("#message-modal-close").on("click", triggerAd);
draw();