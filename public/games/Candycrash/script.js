document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

// [S7721] Fonctions de drag déplacées hors du scope interne pour la performance
function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); }
function dragLeave() { /* Optionnel: ajouter un style de survol ici */ }

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const modeSelection = document.getElementById("modeSelection");
    const compactControls = document.querySelector(".compact-controls");

    const endlessButton = document.getElementById("endlessMode");
    const timedButton = document.getElementById("timedMode");
    const changeModeButton = document.getElementById("changeMode");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    const width = 8;
    const squares = [];
    let score = 0;
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

    function pauseGame() {
        isPaused = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
    }


    function createBoard() {
        grid.innerHTML = "";
        squares.length = 0;
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            const randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }

        squares.forEach(square => {
            square.addEventListener("dragstart", dragStart);
            square.addEventListener("dragend", dragEnd);
            square.addEventListener("dragover", dragOver);
            square.addEventListener("dragenter", dragEnter);
            square.addEventListener("dragleave", dragLeave);
            square.addEventListener("drop", dragDrop);
        });

        squares.forEach(square => {
            square.addEventListener("touchstart", touchStart, { passive: false });
            square.addEventListener("touchmove", touchMove, { passive: false });
            square.addEventListener("touchend", touchEnd, { passive: false });
        });
    }

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    function dragStart() {
        if (isPaused) return;
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = Number.parseInt(this.id); // [S7773]
    }

    function dragDrop() {
        if (isPaused) return;
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = Number.parseInt(this.id); // [S7773]
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        const validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        const validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced !== undefined) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    let hasSwapped = false;

    function touchStart(e) {
        if (isPaused) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.parentElement === grid) {
            colorBeingDragged = target.style.backgroundImage;
            squareIdBeingDragged = Number.parseInt(target.id); // [S7773]
            hasSwapped = false;
        }
    }

    function touchMove(e) {
        if (isPaused || hasSwapped) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (target && target.parentElement === grid) {
            squareIdBeingReplaced = Number.parseInt(target.id); // [S7773]

            if (squareIdBeingDragged !== undefined && squareIdBeingReplaced !== undefined && squareIdBeingDragged !== squareIdBeingReplaced) {
                const validMoves = [
                    squareIdBeingDragged - 1,
                    squareIdBeingDragged - width,
                    squareIdBeingDragged + 1,
                    squareIdBeingDragged + width
                ];

                if (validMoves.includes(squareIdBeingReplaced)) {
                    hasSwapped = true;
                    colorBeingReplaced = target.style.backgroundImage;
                    target.style.backgroundImage = colorBeingDragged;
                    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
                    dragEnd();
                }
            }
        }
    }

    function touchEnd(e) {
        if (isPaused) return;
    }

    function moveIntoSquareBelow() {
        let hasMoved = false;
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i + width].style.backgroundImage === "") {
                const fallingColor = squares[i].style.backgroundImage;
                if (fallingColor) {
                    squares[i + width].style.backgroundImage = fallingColor;
                    squares[i].style.backgroundImage = "";
                    squares[i + width].classList.add("falling");
                    squares[i + width].addEventListener("animationend", () => {
                        squares[i + width].classList.remove("falling");
                    }, { once: true });
                    hasMoved = true;
                }
            }
        }
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                const randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
                squares[i].classList.add("falling");
                squares[i].addEventListener("animationend", () => {
                    squares[i].classList.remove("falling");
                }, { once: true });
                hasMoved = true;
            }
        }
        return hasMoved;
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
            const row = [];
            for (let j = 0; j < size; j++) row.push(i + j);
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor && row.every(index => squares[index].style.backgroundImage === decidedColor)) {
                score += points;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.add("matching");
                    squares[index].addEventListener("animationend", () => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matching");
                    }, { once: true });
                });
            }
        }
    }

    function checkColumn(size, points) {
        for (let i = 0; i < 64 - (width * (size - 1)); i++) {
            const column = [];
            for (let j = 0; j < size; j++) column.push(i + (j * width));
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor && column.every(index => squares[index].style.backgroundImage === decidedColor)) {
                score += points;
                scoreDisplay.innerHTML = score;
                column.forEach(index => {
                    squares[index].classList.add("matching");
                    squares[index].addEventListener("animationend", () => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matching");
                    }, { once: true });
                });
            }
        }
    }

    let lastGlobalCheck = 0;
    const LOOP_SPEED = 100; // ms between logic cycles to see falling

    function gameLoop() {
        if (isPaused) return;

        const now = Date.now();
        if (now - lastGlobalCheck > LOOP_SPEED) {
            checkMatches();
            moveIntoSquareBelow();
            lastGlobalCheck = now;
        }
    }

    function startGame(mode) {
        modeSelection.style.display = "none";
        grid.style.display = "flex";
        compactControls.style.display = "flex";

        createBoard();
        score = 0;
        scoreDisplay.innerHTML = score;
        isPaused = false;

        gameInterval = setInterval(gameLoop, 1000 / 60);

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
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
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

    endlessButton.addEventListener("click", () => startGame("endless"));
    timedButton.addEventListener("click", () => startGame("timed"));
    changeModeButton.addEventListener("click", changeMode);
    fullscreenBtn.addEventListener("click", toggleFullscreen);

    function toggleFullscreen() {
        const gameArea = document.querySelector(".game-area");
        if (document.fullscreenElement) {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        } else {
            gameArea.requestFullscreen().catch(err => {
                console.error(`Erreur: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        }
    }

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });
}