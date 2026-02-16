const gc = document.querySelector('#game_console');
const player = 'player2';
let pl;
const cols = 40;
let tile_size;
let gravity = 0;
const x_speed = 5;
let dead = false;
let dbljump = false;
let timer = 0;
let level_num = -1;
let deaths = 0;
let gameStarted = false;
let d = {};
let animationId; // Identifiant pour stopper la boucle de jeu

// ==========================================================================
// CONFIGURATION DES NIVEAUX
// ==========================================================================
const levels = [
    {
        start: '19.5,1',
        map: [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
            8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,9,9,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]
    },
    {
        start: '19.5,1',
        map: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,8,8,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,8,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
            0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,8,8,8,8,8,8,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,
            8,8,8,8,0,1,1,1,1,1,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,1,1,1,1,1,0,8,8,8,8,
            8,8,8,8,0,2,2,2,2,2,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,2,2,2,2,2,0,8,8,8,8,
            8,8,8,8,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,8,8,8,8]
    }
];

// ==========================================================================
// LOGIQUE DE DÉPLACEMENT ET COLLISIONS
// ==========================================================================

function isSolid(el) {
    if (!el) return false;
    return el.classList.contains('ground') || el.classList.contains('innerwall');
}

function updatePlayer() {
    if (!gameStarted || dead) return;

    const rect = gc.getBoundingClientRect();
    let px = Number.parseFloat(pl.style.left);
    let py = Number.parseFloat(pl.style.top);

    let mx = 0;
    if (d[37]) { mx -= x_speed; pl.className = 'goleft'; }
    if (d[39]) { mx += x_speed; pl.className = 'goright'; }
    if (!d[37] && !d[39]) pl.className = '';

    if (mx !== 0) {
        const nextX = px + mx;
        const checkX = (mx > 0) ? nextX + tile_size - 4 : nextX + 4;
        const wallTop = document.elementFromPoint(rect.left + checkX, rect.top + py + 4);
        const wallBot = document.elementFromPoint(rect.left + checkX, rect.top + py + tile_size - 4);

        if (!isSolid(wallTop) && !isSolid(wallBot)) {
            px = nextX;
        }
    }

    gravity += 0.5;
    if (gravity > 8) gravity = 8;
    let nextY = py + gravity;

    const footL = document.elementFromPoint(rect.left + px + 4, rect.top + nextY + tile_size);
    const footR = document.elementFromPoint(rect.left + px + tile_size - 4, rect.top + nextY + tile_size);

    if (isSolid(footL) || isSolid(footR)) {
        nextY = Math.floor((py + gravity) / tile_size) * tile_size;
        gravity = 0;
        dbljump = false;
    }

    const headL = document.elementFromPoint(rect.left + px + 4, rect.top + nextY);
    const headR = document.elementFromPoint(rect.left + px + tile_size - 4, rect.top + nextY);
    if (isSolid(headL) || isSolid(headR)) {
        gravity = 0.5;
        nextY = Math.ceil(nextY / tile_size) * tile_size;
    }
    py = nextY;

    if (d[38]) {
        if (gravity === 0) gravity = -9;
        else if (!dbljump) { gravity = -8; dbljump = true; }
        d[38] = false;
    }

    // VÉRIFICATION MORT (lave) - plusieurs points
    const deathPoints = [
        document.elementFromPoint(rect.left + px + tile_size/2, rect.top + py + tile_size - 2),
        document.elementFromPoint(rect.left + px + 4, rect.top + py + tile_size - 2),
        document.elementFromPoint(rect.left + px + tile_size - 4, rect.top + py + tile_size - 2)
    ];

    if (deathPoints.some(el => el && el.classList.contains('lava'))) {
        triggerDeathUI();
        return;
    }

    // VÉRIFICATION VICTOIRE (nextlevel) - grille complète de détection
    const winPoints = [
        // Centre
        document.elementFromPoint(rect.left + px + tile_size/2, rect.top + py + tile_size/2),
        // Coins
        document.elementFromPoint(rect.left + px + 2, rect.top + py + 2),
        document.elementFromPoint(rect.left + px + tile_size - 2, rect.top + py + 2),
        document.elementFromPoint(rect.left + px + 2, rect.top + py + tile_size - 2),
        document.elementFromPoint(rect.left + px + tile_size - 2, rect.top + py + tile_size - 2),
        // Milieux des côtés
        document.elementFromPoint(rect.left + px + tile_size/2, rect.top + py + 2),
        document.elementFromPoint(rect.left + px + tile_size/2, rect.top + py + tile_size - 2),
        document.elementFromPoint(rect.left + px + 2, rect.top + py + tile_size/2),
        document.elementFromPoint(rect.left + px + tile_size - 2, rect.top + py + tile_size/2)
    ];

    if (winPoints.some(el => el && el.classList.contains('nextlevel'))) {
        gameStarted = false;
        cancelAnimationFrame(animationId);
        document.getElementById('victoryScreen').classList.add('active');
        return;
    }

    pl.style.left = px + 'px';
    pl.style.top = py + 'px';

    timer++;
    updateDisplay();
    if(mx !== 0) playerTrail();

    animationId = requestAnimationFrame(updatePlayer);
}

// ==========================================================================
// SYSTÈME DE RECONSTRUCTION (BUILD)
// ==========================================================================

function buildGame(isNew = true, forceReset = false) {
    // 1. ARRÊT TOTAL DE LA BOUCLE PRÉCÉDENTE (Empêche la mort en boucle)
    cancelAnimationFrame(animationId);

    dead = false;
    gravity = 0;
    d = {}; // Reset des touches pressées

    // Retirer la classe dying du joueur
    if(pl) pl.classList.remove('dying');

    tile_size = gc.offsetWidth / cols;

    let ratioX = 0, ratioY = 0;
    if (!isNew && !forceReset && pl) {
        ratioX = Number.parseFloat(pl.style.left) / (gc.offsetWidth / cols);
        ratioY = Number.parseFloat(pl.style.top) / (gc.offsetWidth / cols);
    }

    gc.innerHTML = `<div id="${player}"></div>`;
    if (isNew) level_num = (level_num + 1) % levels.length;

    levels[level_num].map.forEach((tileType, i) => {
        if(tileType === 1) return;
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (tileType === 0) tile.classList.add('ground');
        if (tileType === 2) tile.classList.add('lava');
        if (tileType === 8) tile.classList.add('innerwall');
        if (tileType === 9) tile.classList.add('nextlevel');

        tile.style.width = tile_size + 'px';
        tile.style.height = tile_size + 'px';
        tile.style.left = (i % cols) * tile_size + 'px';
        tile.style.top = Math.floor(i / cols) * tile_size + 'px';
        gc.appendChild(tile);
    });

    pl = document.querySelector(`#${player}`);
    pl.style.width = tile_size + 'px';
    pl.style.height = tile_size + 'px';

    // Positionnement
    const s = levels[level_num].start.split(',');
    const startX = (tile_size * Number.parseFloat(s[0]));
    const startY = (tile_size * Number.parseFloat(s[1]));

    // Retour à la position de départ si nouveau niveau, retry après mort, ou forceReset
    if (isNew || forceReset) {
        pl.style.left = startX + 'px';
        pl.style.top = startY + 'px';
    } else if (ratioX !== 0 && ratioY !== 0) {
        // Maintenir la position relative lors du resize (seulement si le jeu est en cours)
        pl.style.left = (ratioX * tile_size) + 'px';
        pl.style.top = (ratioY * tile_size) + 'px';
    } else {
        pl.style.left = startX + 'px';
        pl.style.top = startY + 'px';
    }

    updateDisplay();
    if (gameStarted) animationId = requestAnimationFrame(updatePlayer);
}

// ==========================================================================
// UI ET ÉVÉNEMENTS
// ==========================================================================

const expandBtn = document.getElementById('expand-btn');
const fullscreenTarget = document.getElementById('fullscreen-target');

expandBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    } else {
        fullscreenTarget.requestFullscreen().catch(err => console.log(err));
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    }
});

// Détection robuste du changement de taille
const resizeObserver = new ResizeObserver(() => {
    if (gameStarted) {
        requestAnimationFrame(() => buildGame(false));
    }
});
resizeObserver.observe(gc);

function triggerDeathUI() {
    if(dead) return;
    dead = true;
    deaths++;
    pl.classList.add('dying');
    updateDisplay();
    setTimeout(() => {
        document.getElementById('gameOverScreen').classList.add('active');
    }, 600);
}

function playerTrail() {
    const t = document.createElement('div');
    t.className = 'trailBall';
    t.style.left = pl.offsetLeft + (Math.random()*5) + 'px';
    t.style.top = (pl.offsetTop + tile_size - 5) + 'px';
    gc.appendChild(t);
    setTimeout(() => t.remove(), 600);
}

function updateDisplay() {
    document.getElementById('deaths_display').textContent = deaths;
    document.getElementById('level_display').textContent = level_num + 1;
    document.getElementById('time_display').textContent = secondsToTime(Math.floor(timer/60));
}

function secondsToTime(s) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

globalThis.addEventListener('keydown', e => {
    if([37,38,39,40].includes(e.keyCode)) e.preventDefault();
    d[e.keyCode] = true;
});

globalThis.addEventListener('keyup', e => {
    d[e.keyCode] = false;
});

document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('controlsInfo').classList.add('hidden');
    gameStarted = true; buildGame(true);
});

document.getElementById('retryBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').classList.remove('active');
    gameStarted = true;
    buildGame(false, true); // false = même niveau, true = forceReset à la position de départ
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
    document.getElementById('victoryScreen').classList.remove('active');
    gameStarted = true; buildGame(true);
});

window.onload = () => buildGame(true);