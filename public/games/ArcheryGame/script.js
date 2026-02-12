let board = [];
let rows = 8;
let columns = 8;
let minesCount = 10;
let minesLocation = [];
let tilesClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function () {
    startGame();
    initThemeToggle();
    initFullscreenToggle();
};

// --- THEME TOGGLE ---
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeIcon, currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.innerText = theme === 'dark' ? '☀️' : '🌙';
}

// --- FULLSCREEN TOGGLE ---
function initFullscreenToggle() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const fullscreenIcon = fullscreenToggle.querySelector('.fullscreen-icon');

    fullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Update icon when fullscreen state changes
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenIcon.innerText = '⛶'; // Exit fullscreen icon
        } else {
            fullscreenIcon.innerText = '⛶'; // Enter fullscreen icon
        }
    });
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r + "-" + c;
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// --- CARTE DE FIN DE JEU ---
function showGameOverCard(status) {
    gameOver = true;

    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';

    const card = document.createElement('div');
    card.className = 'game-over-card';

    const icon = document.createElement('div');
    icon.className = 'game-over-icon';
    icon.innerText = status === 'win' ? '🎉' : '💥';

    const title = document.createElement('h2');
    title.className = 'game-over-title';
    title.innerText = status === 'win' ? 'Congratulations !' : 'Game Over !';

    const message = document.createElement('p');
    message.className = 'game-over-message';
    message.innerText = status === 'win'
        ? 'You have cleared all the mines !'
        : 'You touched a mine !';

    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.innerText = '🔄 Start Over';
    restartButton.onclick = () => location.reload();

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(restartButton);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Animation d'entrée
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

// --- LOGIQUE DES PUBLICITÉS ---
function triggerAd(status) {
    gameOver = true;

    adBreak({
        type: 'next',
        name: status === 'win' ? 'win-game' : 'game-over',
        beforeAd: () => { console.log("Début de la pub"); },
        afterAd: () => {
            showGameOverCard(status);
        }
    });

    // Simulateur pour test local (localhost)
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        setTimeout(() => {
            showGameOverCard(status);
        }, 300);
    }
}

function setFlag() {
    flagEnabled = !flagEnabled;
    this.style.backgroundColor = flagEnabled ? "rgba(0, 212, 255, 0.3)" : "";
    this.style.borderColor = flagEnabled ? "rgba(0, 212, 255, 0.8)" : "";
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) return;

    let tile = this;
    if (flagEnabled) {
        tile.innerText = tile.innerText == "" ? "🚩" : "";
        return;
    }

    if (minesLocation.includes(tile.id)) {
        revealMines();
        triggerAd('lose');
        return;
    }

    let coords = tile.id.split("-");
    checkMine(parseInt(coords[0]), parseInt(coords[1]));
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.background = "linear-gradient(145deg, rgba(255, 0, 0, 0.6), rgba(200, 0, 0, 0.8))";
                tile.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.6)";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return;
    if (board[r][c].classList.contains("tile-clicked")) return;

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            minesFound += checkTile(r + i, c + j);
        }
    }

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound);
    } else {
        for(let i=-1; i<=1; i++) {
            for(let j=-1; j<=1; j++) {
                checkMine(r + i, c + j);
            }
        }
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        triggerAd('win');
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return 0;
    return minesLocation.includes(r + "-" + c) ? 1 : 0;
}