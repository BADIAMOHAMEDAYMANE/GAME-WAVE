const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const button = document.querySelector("#start");
const gameContainer = document.querySelector("#game-container");
const expandBtn = document.querySelector("#expand-btn");
const themeBtn = document.querySelector("#theme-btn");

let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) return randomHole(holes);
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(400, 1000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
        hole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    score = 0;
    timeUp = false;
    button.style.visibility = "hidden";
    button.classList.remove("pulse");
    peep();

    setTimeout(() => {
        timeUp = true;
        button.innerHTML = "RESTART";
        button.style.visibility = "visible";
        button.classList.add("pulse");
    }, 10000);
}

function bonk(e) {
    if (!e.isTrusted) return; // Anti-triche
    score++;
    this.parentElement.classList.remove("up");
    scoreBoard.textContent = score;
}

// --- LOGIQUE PLEIN ÉCRAN ---
expandBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => {
            console.error(`Erreur : ${err.message}`);
        });
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

// --- LOGIQUE MODE CLAIR / SOMBRE ---
themeBtn.addEventListener("click", () => {
    gameContainer.classList.toggle("light-mode");
    if (gameContainer.classList.contains("light-mode")) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Mode Clair</span>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> <span>Mode Sombre</span>';
    }
});

// Initialisation des événements
moles.forEach(mole => mole.addEventListener('click', bonk));
button.addEventListener('click', startGame);