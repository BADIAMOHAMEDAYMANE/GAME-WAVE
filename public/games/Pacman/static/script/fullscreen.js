const expandBtn = document.getElementById("expand-btn");
const gameContainer = document.getElementById("game-container");

if (expandBtn && gameContainer) {
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
}
