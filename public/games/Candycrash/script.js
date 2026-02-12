document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    // Éléments du DOM
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const modeSelection = document.getElementById("modeSelection");
    const compactControls = document.querySelector(".compact-controls");

    // Boutons
    const endlessButton = document.getElementById("endlessMode");
    const timedButton = document.getElementById("timedMode");
    const changeModeButton = document.getElementById("changeMode");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    // Variables d'état
    const width = 8;
    const squares = [];
    let score = 0;
    let currentMode = null;
    let timeLeft = 0;
    let gameInterval = null;
    let timerInterval = null;
    let isPaused = false;

    const candyColors = [
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)",
    ];

    // --- LOGIQUE DE PAUSE ---
    function pauseGame() {
        isPaused = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
    }

    function resumeGame() {
        if (!isPaused) return;
        isPaused = false;
        gameInterval = setInterval(gameLoop, 100);
        if (currentMode === "timed") {
            timerInterval = setInterval(countdown, 1000);
        }
    }

    // --- CRÉATION DU PLATEAU ---
    function createBoard() {
        grid.innerHTML = "";
        squares.length = 0;
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }

        // Événements de Drag & Drop
        squares.forEach(square => {
            square.addEventListener("dragstart", dragStart);
            square.addEventListener("dragend", dragEnd);
            square.addEventListener("dragover", dragOver);
            square.addEventListener("dragenter", dragEnter);
            square.addEventListener("dragleave", dragLeave);
            square.addEventListener("drop", dragDrop);
        });
    }

    // --- GESTION DU DRAG & DROP ---
    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    function dragStart() {
        if(isPaused) return;
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) { e.preventDefault(); }
    function dragEnter(e) { e.preventDefault(); }
    function dragLeave() {}

    function dragDrop() {
        if(isPaused) return;
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced !== undefined) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // --- LOGIQUE DU JEU ---
    function moveIntoSquareBelow() {
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    function checkMatches() {
        checkRow(4, 4);
        checkColumn(4, 4);
        checkRow(3, 3);
        checkColumn(3, 3);
    }

    function checkRow(size, points) {
        for (let i = 0; i < 64; i++) {
            if (i % width > width - size) continue;
            let row = [];
            for(let j=0; j<size; j++) row.push(i+j);
            let decidedColor = squares[i].style.backgroundImage;
            if (decidedColor && row.every(index => squares[index].style.backgroundImage === decidedColor)) {
                score += points;
                scoreDisplay.innerHTML = score;
                row.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkColumn(size, points) {
        for (let i = 0; i < 64 - (width * (size-1)); i++) {
            let column = [];
            for(let j=0; j<size; j++) column.push(i + (j * width));
            let decidedColor = squares[i].style.backgroundImage;
            if (decidedColor && column.every(index => squares[index].style.backgroundImage === decidedColor)) {
                score += points;
                scoreDisplay.innerHTML = score;
                column.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function gameLoop() {
        if (isPaused) return;
        checkMatches();
        moveIntoSquareBelow();
    }

    // --- ÉTATS DU JEU ---
    function startGame(mode) {
        currentMode = mode;
        modeSelection.style.display = "none";
        grid.style.display = "flex";
        compactControls.style.display = "flex";

        createBoard();
        score = 0;
        scoreDisplay.innerHTML = score;
        isPaused = false;

        gameInterval = setInterval(gameLoop, 100);

        if (mode === "timed") {
            timeLeft = 120;
            updateTimerDisplay();
            timerInterval = setInterval(countdown, 1000);
        } else {
            timerDisplay.innerHTML = "Mode Infini";
        }
    }

    function countdown() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) endGame();
    }

    function updateTimerDisplay() {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        timerDisplay.innerHTML = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function endGame() {
        pauseGame();
        alert("🎉 Terminé ! Score final : " + score);
        changeMode();
    }

    function changeMode() {
        pauseGame();
        grid.style.display = "none";
        compactControls.style.display = "none";
        modeSelection.style.display = "flex";
    }

    // Écouteurs d'événements
    endlessButton.addEventListener("click", () => startGame("endless"));
    timedButton.addEventListener("click", () => startGame("timed"));
    changeModeButton.addEventListener("click", changeMode);

    // Gestion du plein écran
    fullscreenBtn.addEventListener("click", toggleFullscreen);

    function toggleFullscreen() {
        const gameArea = document.querySelector(".game-area");

        if (!document.fullscreenElement) {
            gameArea.requestFullscreen().catch(err => {
                console.error(`Erreur plein écran: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    }

    // Détecter la sortie du plein écran (avec ESC par exemple)
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });
}