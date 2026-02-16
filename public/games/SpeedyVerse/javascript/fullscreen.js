const gameContainer = document.getElementById("game-container");
const gameElement = document.getElementById("game");

function updateGameSize() {
    // Always fill the available space (iframe or window)
    globalThis.width = window.innerWidth;
    globalThis.height = window.innerHeight;
    globalThis.halfWidth = globalThis.width / 2;

    if (gameElement) {
        gameElement.style.width = globalThis.width + "px";
        gameElement.style.height = globalThis.height + "px";
    }

    // Update hero position and background
    const hero = document.getElementById("hero");
    if (hero && typeof ASSETS !== 'undefined') {
        hero.style.top = globalThis.height - 80 + "px";
        hero.style.left = (globalThis.width / 2) - ASSETS.IMAGE.HERO.width / 2 + "px";
    }
}

// Initial size set
updateGameSize();

globalThis.addEventListener("resize", () => {
    updateGameSize();
});
